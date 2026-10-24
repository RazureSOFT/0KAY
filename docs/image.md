# Image generation: one Core endpoint, many plugins

Core owns exactly one image entry point. LIFE's "send me a selfie" behaviour, a
plugin page, or any front end posts a prompt to `/api/image`; which engine draws
it is a **plugin** decision, resolved from settings at request time. Plugins adapt
to Core — never the other way round.

This is the third leg of the same table as `/api/tts` and `/api/asr`.

---

## 1. The public endpoint

### `GET /api/image`

```json
{ "configured": true, "provider": "draw" }
```

### `POST /api/image`

```json
{ "prompt": "a girl in a cafe, soft light, phone camera", "size": "1024x1024" }
```

| field | required | meaning |
|---|---|---|
| `prompt` | yes | the image description; 8 KiB ceiling |
| `size` | no | e.g. `1024x1024`, `1024x1792`; the backend decides the default |

Response: raw image bytes with the backend's `Content-Type` (`image/png`,
`image/jpeg`, `image/webp`), `Cache-Control: no-store`. 24 MiB ceiling.

| status | code | meaning |
|---|---|---|
| 200 | | image bytes |
| 400 | | empty prompt / malformed body |
| 502 | `image_failed` | no backend configured, or the backend errored |
| 405 | | method other than GET/POST |

---

## 2. How a backend is found

Resolved per request, in this order:

1. **`IMAGE_ENDPOINT`** env var (wins over everything; handy for containers);
2. **any settings section that declares a field named `image_endpoint`** — the
   documented way for a plugin to plug in, no Core change needed;
3. a section whose id is in `imageSections` (`image`, `draw`, `sd-webui`,
   `comfyui-openai`) and that publishes `endpoint`, the shape TTS plugins use;
4. `life.image_endpoint` (legacy).

A section is skipped when its `enabled` field is false, so a user can switch a
backend off without uninstalling it.

Optional: **`IMAGE_SERVICE_TOKEN`** is sent as `Authorization: Bearer`.

---

## 3. The contract a plugin must honour

```
POST <endpoint>            application/json
{ "prompt": "...", "n": 1, "size": "...", "response_format": "b64_json" }
```

and answer with the OpenAI envelope:

```json
{ "data": [ { "b64_json": "iVBORw0KGgo…" } ] }
```

A `url` instead of `b64_json` is rejected (Core cannot fetch it — the backend
runs on loopback behind the same guard Core does). A backend that ignores the
contract and returns raw image bytes with an `image/*` content type also works.

Because the contract is OpenAI's, existing servers point straight at it:

```bash
IMAGE_ENDPOINT=http://127.0.0.1:7860/v1/images/generations ./start-0kay.sh start
```

---

## 4. What uses it today

- **LIFE selfies** — when the character decides to send a photo, the WebUI calls
  `/api/image` and renders the result in the bubble. The persona settings
  (`voice_reply_enabled` / `selfie_enabled` / `call_enabled` on the `life`
  section) decide which of those actions the model is even told about.
- **Any plugin page** — `fetch('/api/image', …)` needs no plugin-side plumbing.
