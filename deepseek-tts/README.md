# 0KAY DeepSeek TTS

A small loopback service that gives **LIFE a voice** and drives the WebUI
Live2D lip-sync. It wraps the unofficial
[deepseek-tts-api](https://github.com/Eyeing0721/deepseek-tts-api) CLI (`dstts`),
which synthesizes speech through DeepSeek's web "read aloud" feature.

```
LIFE / WebUI →  POST http://127.0.0.1:8792/  {"text":"..."}
            ←  audio/wav
```

## Install / run

```sh
# from this repo's deepseek-tts directory
npm install -g github:Eyeing0721/deepseek-tts-api   # provides `dstts` (Node >= 22)
$env:DS_TOKEN = '<your DeepSeek userToken>'         # 64-char token from chat.deepseek.com
node src/server.mjs
```

On start it registers itself as LIFE's TTS endpoint (`Settings → LIFE → TTS
接口`), unless one is already configured. LIFE then speaks through it, and the
WebUI plays the audio with Live2D lip-sync.

## Configuration (environment)

| Variable | Default | Purpose |
|---|---|---|
| `DEEPSEEK_TTS_PORT` | `8792` | Listen port |
| `DEEPSEEK_TTS_HOST` | `127.0.0.1` | Bind address (loopback only) |
| `DSTTS_BIN` | `dstts` | CLI to run; e.g. `npx github:Eyeing0721/deepseek-tts-api` |
| `DSTTS_VOICE` | `mira` | Default voice (`mira` / `echo` / `stella` / `tide`) |
| `DS_TOKEN` | — | DeepSeek `userToken` (required for synthesis) |
| `OKAY_TTS_AUTOREGISTER` | on | `0` disables setting LIFE's `tts_endpoint` on start |

## Endpoints

| Method | Path | Body → Response |
|---|---|---|
| POST | `/` or `/tts` | `{"text":"...","voice":"mira"}` → `audio/wav` |
| GET | `/health` | `{"ok":true,...}` |

## Notes

- Requires a DeepSeek account that has the read-aloud feature enabled
  (the upstream service is in beta; unsupported accounts get `NOT_AVAILABLE`).
- Synthesis runs the `dstts` CLI, which creates a temporary DeepSeek session and
  solves a PoW; expect ~3–8 s per request. Text is capped at 600 chars here.
- The token is only read from `DS_TOKEN`; it is never written to disk or logged.
- Unofficial, for personal/technical use; upstream may change or be rate-limited.
