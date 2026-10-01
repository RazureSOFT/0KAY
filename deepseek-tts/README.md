# 0KAY DeepSeek TTS

A small loopback service that gives **LIFE a voice** and drives the WebUI
Live2D lip-sync. Speech is synthesized **in-process** by a vendored copy of the
DeepSeek web "read aloud" protocol (`src/deepseek/`, see [NOTICE.md](NOTICE.md)) —
no external CLI and no third-party runtime dependency.

```
LIFE / WebUI →  POST http://127.0.0.1:8792/  {"text":"..."}
            ←  audio/wav
```

## Run

```sh
cd deepseek-tts
npm install          # @grpc/grpc-js + @grpc/proto-loader (Core registration only)
node src/server.mjs
```

Requires **Node >= 22** (global `fetch` + `WebSocket`).

On start it registers with Core as a plugin and contributes a **Settings →
DeepSeek TTS** section (`启用语音合成` / `音色` / `DeepSeek userToken`), and points
LIFE's `tts_endpoint` at itself when that is still empty.

Get the `userToken` from <https://chat.deepseek.com> (DevTools → Console →
`JSON.parse(localStorage.getItem('userToken')).value`), then paste it into the
settings section (or set `DS_TOKEN`). Synthesis is only enabled once a token is
present.

## Configuration (environment)

| Variable | Default | Purpose |
|---|---|---|
| `DEEPSEEK_TTS_PORT` | `8792` | Listen port |
| `DEEPSEEK_TTS_HOST` | `127.0.0.1` | Bind address (loopback only) |
| `DSTTS_VOICE` | `mira` | Default voice (`mira` / `echo` / `stella` / `tide`) |
| `DS_TOKEN` | — | DeepSeek `userToken` fallback (Settings value wins) |
| `OKAY_TTS_AUTOREGISTER` | on | `0` disables pointing LIFE at this service on start |
| `CORE_ADDRESS` | `localhost:50051` | Core gRPC for registration |
| `PROTO_DIR` | `../proto` | Protobuf root (for `core/v1/core.proto`) |

## Endpoints

| Method | Path | Body → Response |
|---|---|---|
| POST | `/` or `/tts` | `{"text":"...","voice":"mira"}` → `audio/wav` |
| GET | `/health` | `{"ok":true,"token":bool,"enabled":bool,...}` |

## Notes

- Every request creates a temporary DeepSeek chat session, solves the
  `DeepSeekHashV1` proof-of-work, asks the model to repeat the text verbatim,
  then synthesizes and deletes the session — expect ~3–8 s per request. Text is
  capped at 600 chars here.
- Requires a DeepSeek account with the read-aloud feature enabled (upstream is
  in beta; unsupported accounts get `NOT_AVAILABLE`).
- Unofficial, for personal/technical use; upstream may change or be
  rate-limited.
