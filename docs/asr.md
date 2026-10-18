# Speech-to-text (ASR): one Core endpoint, many plugins

Core owns exactly one speech-to-text entry point. Every front end (WebUI chat,
LIFE wake word, a plugin page) posts audio to `/api/asr`; which engine actually
transcribes it is a **plugin** decision, resolved from settings at request time.
Plugins adapt to Core — never the other way round.

This is deliberately the mirror image of `/api/tts`.

---

## 1. The public endpoint

### `GET /api/asr`

```json
{ "configured": true, "provider": "asr" }
```

`configured` is false when no backend is available; `provider` names the
settings section that supplied it (`"env"` when `ASR_ENDPOINT` is set).

### `POST /api/asr`

Two accepted bodies.

**multipart/form-data** (what the browser sends):

| field | required | meaning |
|---|---|---|
| `audio` | yes¹ | the audio file. `file` is accepted as an alias |
| `language` | no | BCP-47-ish hint (`zh`, `ja`, `en`); omit for auto |
| `model` | no | backend-specific model name |
| `prompt` | no | vocabulary hint ("美玖, 0KAY, mihari") |

¹ exactly one of `audio` / `file`.

**application/json** — for clients that cannot build multipart:

```json
{ "audio_base64": "…", "mime": "audio/webm", "language": "zh" }
```

`language`, `model` and `prompt` are also accepted as query parameters.

Response (200):

```json
{ "text": "美玖，今天几号", "provider": "asr", "language": "zh" }
```

Errors:

| status | code | when |
|---|---|---|
| 400 | `bad_request` | no audio, bad base64, malformed multipart |
| 413 | `audio_too_large` | over 24 MiB |
| 502 | `asr_failed` | the backend answered with an error / no text |
| 503 | `asr_failed` | no backend is configured |

Audio limits: 24 MiB per request, 120 s upstream timeout. Nothing is persisted —
the bytes are forwarded and dropped.

---

## 2. What a plugin has to do

Two things, both declarative.

### 2.1 Register a settings section that publishes `asr_endpoint`

```python
SettingsSection(
    id="my-asr", label="My ASR", order=84,
    fields=[
        SettingsField(key="asr_endpoint", type="text", label="服务地址",
                      default_value="http://127.0.0.1:9001/v1/audio/transcriptions",
                      help="OpenAI 兼容的转写端点；Core 的 /api/asr 会把音频转发到这里"),
        SettingsField(key="enabled", type="bool", label="启用", default_value="true"),
        SettingsField(key="model", type="text", label="模型", default_value=""),
        SettingsField(key="language", type="text", label="默认语言", default_value="zh"),
    ],
)
```

* The **field name `asr_endpoint` is the opt-in**. Core scans every registered
  section for it, so a brand-new plugin needs no Core change at all.
* If you declare `enabled`, give it `default_value: "true"` — the settings store
  materialises an unset bool as `false`, which would look like "switched off".
  Omit `enabled` entirely and the section always counts as enabled.
* Backends whose id is listed in `asrSections` (`asr`, `soniox`, `genieasr`,
  `whisper-asr`) may publish `endpoint` instead, matching the TTS convention.

Resolution order (first hit wins):

1. `ASR_ENDPOINT` environment variable.
2. Any section with a non-empty `asr_endpoint`.
3. A known `endpoint`-style section, in `asrSections` order.
4. `life.asr_endpoint` (legacy escape hatch).

### 2.2 Serve an OpenAI-compatible transcription route

Core posts **exactly** the OpenAI `/v1/audio/transcriptions` shape, so an
existing whisper server can be pointed at directly and a plugin only has to
forward:

```
POST <asr_endpoint>
Content-Type: multipart/form-data; boundary=…
Authorization: Bearer <ASR_SERVICE_TOKEN>   # only when Core has the token set

file=<audio bytes>   filename=chunk.webm
response_format=json
language=zh          # when the caller supplied one
model=…              # when the caller supplied one
prompt=…             # when the caller supplied one
```

Answer with either

```json
{ "text": "…", "language": "zh" }
```

or a plain-text body containing the transcript. Anything else is a 502 at the
Core boundary. `language`, `model` and `duration` are optional in the JSON.

The endpoint should bind `127.0.0.1`: Core's egress guard refuses metadata and
link-local addresses always, and loopback/private ranges when
`CORE_SSRF_STRICT=1`.

### 2.3 Optional: service token

Set `ASR_SERVICE_TOKEN` in Core's environment and the same value in the plugin.
Core then attaches `Authorization: Bearer <token>`; the plugin should compare it
in constant time and reject mismatches. Without the variable, loopback binding
is the only boundary — the same trade-off `/api/tts` makes.

---

## 3. Reference wiring

```text
browser  ──multipart──▶  Core  /api/asr  ──multipart──▶  plugin endpoint
                          │                              (whisper.cpp server,
                          └─ resolves from settings        faster-whisper,
                             on every request              vLLM, a wrapper…)
```

A minimal plugin is ~100 lines: an HTTP server that forwards the multipart body
upstream, plus a gRPC `Register` call that publishes the settings section above
(see `deepseek-tts/` for the TTS twin, or `genie-tts/` for a Python one).

[`soniox-asr/`](../soniox-asr/README.md) is the reference implementation: it
publishes `asr_endpoint`, speaks the OpenAI shape on port 8795, and turns the
multipart body into a Soniox realtime WebSocket session. Copy it to add another
backend.

Pointing straight at an existing server works too — no plugin code at all:

```bash
# whisper.cpp server, already listening on 8080
ASR_ENDPOINT=http://127.0.0.1:8080/inference ./0kay-core
```

## 4. Front ends that use it

| consumer | behaviour |
|---|---|
| WebUI chat (LIFE) | 「喊一声唤醒」 listens in short chunks, transcribes each one, and matches the configured nickname; on a hit it chimes, records one utterance and sends it (see `webui/src/composables/wakeWord.ts`) |
| LIFE settings | `wake_enabled` / `wake_nickname` / `asr_language` live in the `life` section |

When no backend is configured, `GET /api/asr` reports `configured: false` and
the UI falls back to the browser's own speech recognition (Chrome/Edge) or
tells the user to install an ASR plugin.
