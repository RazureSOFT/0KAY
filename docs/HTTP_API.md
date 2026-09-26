# HTTP API Reference

Complete reference for the Core HTTP gateway. Default base URL is
`http://127.0.0.1:8080` (`CORE_HTTP_PORT`, `CORE_BIND_HOST`). With
`CORE_LAN_ENABLED=1` the same routes are additionally served over TLS on
`https://<host>:8443`. The gRPC plugin protocol is documented in
[PLUGIN_API](PLUGIN_API.md).

## 1. Conventions

### Authentication

- If `CORE_API_TOKEN` is set, every path except `GET /health` requires
  `Authorization: Bearer <token>`. Failure returns `401` with plain text
  `authentication required`.
- When `CORE_LAN_ENABLED=1`, requests from outside loopback and
  `CORE_TRUSTED_NETWORKS` must additionally present a paired device token (or
  `CORE_API_TOKEN`), otherwise `401 paired device required`.
- Plugin callbacks (`/api/pairing/*` routes) are handled before CORS/auth and
  apply their own loopback/Origin rules instead.

### CORS and preflight

- Allowed origins: same origin, `localhost`/`127.0.0.1` variants, plus any host
  listed in `CORE_ALLOWED_ORIGINS` (comma separated). Other origins get
  `403 origin not allowed`.
- Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`. Allowed headers:
  `Content-Type, Authorization`.
- `OPTIONS` preflight returns `200` empty body before token validation.

### Errors

There is no single error envelope. Expect one of:

| Shape | Where |
|---|---|
| `4xx/5xx` plain text (`http.Error`) | Most validation/auth failures |
| JSON `{success, result, error}` | `POST /api/run`, `/api/skills` |
| JSON `{error}` or SSE `event: error` | Chat/generation streams |
| `204` empty body | `POST /api/usage/record` |

### Request details

- JSON bodies use `snake_case` field names and `Content-Type: application/json`.
- Body size limits: sessions 8 KB, messages 128 KB, approvals/questions 64 KB,
  notifications 64 KB, tasks 2 MB, skills POST 2 MB, usage record 16 KB,
  pairing request 4 KB, update apply JSON 8 KB, images 16 MB, live2d upload
  512 MB (32 MB per part).
- Common query parameters: `?limit=` `?query=` `?cursor=` `?incremental=1`
  `?session_id=` `?executor_id=` `?path=` `?id=` `?name=` `?file=`.

## 2. Health and plugins

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health summary (exempt from `CORE_API_TOKEN`) |
| GET | `/api/plugins` | All plugins, including disabled rows |
| POST | `/api/plugins/enable` | Enable a plugin, body `{plugin\|name}` |
| POST | `/api/plugins/disable` | Disable a plugin (persisted to `data/disabled_plugins.json`) |
| GET, HEAD | `/api/plugins/{name}/ui/{path…}` | Plugin frontend ESM/static assets |

```json
// GET /health
{"status": "ok", "plugins": 6, "healthy": 5}

// GET /api/plugins (array)
[{"plugin_id": "agent", "name": "agent", "version": "0.1.0",
  "type": "PLUGIN_TYPE_SERVICE", "capabilities": ["agent"],
  "status": "PLUGIN_STATUS_HEALTHY", "active_tasks": 0, "disabled": false}]

// POST /api/plugins/enable  →  {"plugin": "life", "enabled": true, "ok": true}
```

### Plugin UI assets

Served from `$CORE_DATA_DIR/plugin-ui/{name}` (default `data/plugin-ui/{name}`).

- Methods: `GET`/`HEAD` only, otherwise `405`.
- `name` must match `[A-Za-z0-9_-]{1,64}`; path traversal is rejected (`404`).
- Disabled plugin → `404 plugin disabled`.
- Content-hashed chunks (filename contains `-`, extension `.js`/`.css`) get
  `Cache-Control: public, max-age=31536000, immutable`; everything else
  `no-cache`.

## 3. Updates

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/update/check` | Latest 0KAY GitHub release vs. the running version |
| GET | `/api/update/check-plugins` | Latest release vs. each registered plugin version |
| POST | `/api/update/apply` | Start an update for one component |
| GET | `/api/update/status` | Progress of the most recent update |

```json
// GET /api/update/check
{"current": "0.1.0", "latest": "0.1.0", "has_update": false,
 "url": "https://github.com/RazureSOFT/0KAY/releases/tag/v0.1.0"}

// GET /api/update/check-plugins
{"plugins": [{"name": "agent", "version": "0.1.0", "latest": "0.1.0",
  "has_update": false, "repository": "https://github.com/RazureSOFT/0KAY-agent",
  "package": "@razuresoft/0kay-agent", "can_update": true}]}

// POST /api/update/apply
// {"plugin": "core"}                      → beta (sync main)
// {"plugin": "agent", "version": "0.1.0"} → pinned release
// → 202 Accepted
{"plugin":"core","package":"@razuresoft/0kay-core","mode":"source",
 "status":"running","started":"2026-09-26T05:42:52Z"}

// GET /api/update/status
{"plugin":"core","package":"@razuresoft/0kay-core","mode":"source",
 "status":"done","started":"2026-09-26T05:42:52Z","log":"git pull --ff-only"}
```

- `mode` is `pm` when the component is installed with 0kay-pm, otherwise
  `source` (git pull + rebuild + restart). See [Releases](RELEASES.md).
- `status` is `idle`/`running`/`done`/`failed`. Only one update runs at a time;
  a second request returns `409`. Unknown components return `400`.
- Version comparison is semver-aware. `latest` is omitted with no release; the
  platform check returns `502` when GitHub is unreachable, the plugin check
  reports a per-plugin `error` (including `unknown repository`).

## 4. Agent sessions

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/agents` | Registered executors, health, missing dependencies |
| GET | `/api/agent/sessions` | List sessions (`kind == "agent_session"` tasks) |
| POST | `/api/agent/sessions` | Create session, body `{title}` → `201 {session_id}` |
| PATCH | `/api/agent/sessions` | `{session_id, action: "archive"\|"restore"\|…}` or `{session_id, action:"rename", title}` |
| DELETE | `/api/agent/sessions` | Body `{session_id}` (forces `action=delete`) |
| POST | `/api/agent/messages` | Dispatch a prompt to a session |
| GET, POST | `/api/agent/workspace` | GET browse `?executor_id=&path=`, POST `{path,name}` mkdir |
| GET | `/api/agent/host` | `?executor_id=` live CPU/memory sample via `host_status` |
| POST | `/api/agent/compact` | Compact a session's history via LIFE |

```json
// POST /api/agent/messages (128 KB max)
{"session_id": "s_1", "prompt": "…", "agent_type": "code",
 "executor_id": "", "workdir": "", "model_id": "MOCR",
 "thinking_intensity": "off|low|medium|high|max|<0-100>",
 "permission_mode": "normal|full_access", "language": "zh"}
// → 202 {"task_id": "agent-task:…", "accepted": true, "message": ""}
// 409 session already has an active task · 404 session not found
```

`GET /api/agent/workspace` and `GET /api/agent/host` return the executor's
`RunDirect` result verbatim. If no `executor_id` is given the first healthy
executor is used, otherwise `503 selected executor unavailable`.

## 5. Approvals and questions

`GET`/`POST /api/agent/approvals` and `GET`/`POST /api/agent/questions` share
one handler; the path selects `approval_list`/`approval_decide` versus
`question_list`/`question_answer` on every online executor.

| Method | Path | Body / query |
|---|---|---|
| GET | `/api/agent/approvals` | `?session_id=` → `{approvals: [...]}` |
| POST | `/api/agent/approvals` | `{executor_id, id, allow: true\|false}` → `{ok:true}` or `409` |
| GET | `/api/agent/questions` | `?session_id=` → `{approvals: [...]}` |
| POST | `/api/agent/questions` | `{executor_id, id, answer: "…"}` → `{ok:true}` or `409` |

## 6. Skills

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/skills` | List skills → `{success, result: {dir, skills[]}, error}` |
| POST | `/api/skills` | Save/overwrite `{name, content}` (2 MB) |
| DELETE | `/api/skills?name=` | Delete a file-backed skill (`404` if missing) |

Proxied to the Agent `skills_admin` tool through `RunDirect` with a 30 s timeout.

## 7. Tasks

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/tasks` | `{tasks: [...]}` full list |
| GET | `/api/tasks?incremental=1&cursor=` | Delta since cursor |
| POST | `/api/tasks` | Record a `TaskEvent` (2 MB) → `{ok:true}` / `409` |
| GET | `/api/tasks/events` | SSE stream of task deltas |
| POST | `/api/tasks/cancel` | `{task_id}` → `{success, message}` |

`TaskEvent` fields: `task_id`, `caller_id`, `session_id`, `parent_id`, `kind`,
`prompt`, `state`, `result`, `error`. States: `pending`, `running`, `done`,
`failed`, `cancelled`. Keep result payloads under ~200 k characters.

SSE (`Content-Type: text/event-stream`):

```
event: tasks
data: {"cursor":"…","added":[…],"updated":[…],"removed":[…]}

: heartbeat        (every 15 s; poll tick is 200 ms)
```

## 8. Chat and models

### `POST /api/chat` (alias `POST /api/mocr/generate`)

```json
{"request_id": "r1", "prompt": "hi", "stream": false,
 "session_id": "default", "model_id": "", "system_prompt": "",
 "temperature": 0.7, "max_tokens": 1024,
 "messages": [{"role": "user", "content": "hi"}]}
```

- `stream: false` → `{"request_id", "response", "error"?, "usage"?: {prompt_tokens, completion_tokens, total_tokens}}`
- `stream: true` → SSE `event: chunk` / `event: done` / `event: error`.

Empty `model_id` means Core/mocr selection (`MOCR`); pin a model id to bypass
selection.

### `POST /api/life/chat`

Main WebUI conversation path; proxies LIFE `OnUserMessage` as SSE.

```json
{"request_id": "life_1", "session_id": "webui:default", "user_id": "webui",
 "prompt": "…", "persona": {}, "history": []}
```

`persona` may include `customPrompt`, which LIFE sends to the model as the
system prompt. Chunk payload: `{request_id, chunk, done, task_id, think_summary,
emotion: {valence, arousal, connection, irritation}, mental_energy}`. Events:
`chunk`, `done`, `error` (`503 LIFE is unavailable` when offline).

### Model catalog and providers

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/models` | `{models, all_model_ids, default_provider_id, default_model, providers}` |
| POST | `/api/models/fetch` | Fetch provider model list → `{models, source, error}` |
| GET | `/api/providers` | Snapshot `{providers, default_provider_id, default_model}` |
| POST, PUT | `/api/providers` | Upsert `{provider}` or replace `{providers, default_provider_id, default_model}` |
| DELETE | `/api/providers/delete?id=` | Remove one provider → snapshot |
| GET | `/api/providers/defaults` | `{default_provider_id, default_model}` |
| POST, PUT | `/api/providers/defaults` | Set defaults → echoed back |
| POST | `/api/run` | `RunDirect` (60 s) → `{success, result, error}` |

Provider configs persist to `data/providers.json`. `503 provider store not ready`
while the store is initializing.

## 9. LIFE

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/life/chat` | Conversational SSE (above) |
| POST | `/api/life/compact` | `{session_id, history, persona}` → `{summary}` (90 s) |
| GET | `/api/life/notifications?session_id=` | `{notifications: [...]}` |
| POST | `/api/life/notifications` | `{session_id, ids}` acknowledge → `{"ok":true}` |
| GET | `/api/state`, `/api/life/state` | Aggregated platform state |
| GET, POST, PUT | `/api/life/permissions` | Read/write permissions |
| GET | `/api/life/memories?limit=&query=` | Memory list + stats |
| GET, POST | `/api/life/companion` | Companion snapshot / action |

```json
// GET /api/state
{"source": "core", "emotion": {"valence": 0, "arousal": 0.5,
 "connection": 0.5, "irritation": 0}, "mentalEnergy": 100, "isSleeping": false,
 "activeTasks": [], "onlineAgents": 1, "totalAgents": 1, "agentIds": ["agent"],
 "pluginCount": 5, "healthyPlugins": 5, "updatedAt": "2026-09-25T…Z"}
// emotion/mentalEnergy overlaid from LIFE when the life plugin is healthy
```

`POST /api/settings/life` keys `screen_watch`, `computer_use` and
`report_agent_host` are mirrored into `/api/life/permissions`.

## 10. Usage

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/usage` | `{total_tokens, by_model, by_day}` |
| POST | `/api/usage/record` | One usage record (16 KB) → `204` |
| POST | `/api/usage/clear` | Wipe → `{ok: true, usage}` |

`/api/usage/record` is called by mocr with `Authorization: Bearer ${CORE_API_TOKEN}`.

## 11. Settings

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/settings/sections` | Plugin-contributed sections (disabled plugins omitted) |
| GET | `/api/settings/{id}` | `{section, values}` |
| POST, PUT | `/api/settings/{id}` | Body: flat values or `{values: {...}}` → `{section, values}` |

`SetValues` is a merge: omitted keys keep their previous value. Sections owned by
a disabled plugin return `403 section disabled`. See
[Settings and UI Patches](settings-ui.md).

## 12. Images and Live2D

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/images` | multipart `file` (16 MB) → `{file, url}` |
| GET | `/api/images?file=` | Read stored image |
| GET | `/api/live2d` | List models `[{id, label, url}]` |
| POST | `/api/live2d` | multipart upload: files + `paths` (512 MB total) |
| DELETE | `/api/live2d?id=` | Remove a model |
| GET | `/live2d/models/*` | Static model assets |

## 13. UI patches

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/ui/patches` | Flattened patch ops for WebUI |
| POST | `/api/ui/patches` | Force reload → `{ok: true, count: n}` |

- Discovery directories: `$CORE_DATA_DIR/ui`, `{cwd}/ui`, `{cwd}/../webui/patches`,
  `{cwd}/data/ui`. Only `*.patch` files are read; contents are JSON.
- `GET` rescans at most every 3 seconds (mtime check). `POST` and plugin
  enable/disable bypass the cooldown.
- An op is dropped when its `capability` (falling back to `plugin`) matches no
  registered capability, or when its plugin is disabled.
- Targets: `nav`, `router`, `settings`, `status`, `chat`. Operations: `insert`,
  `remove`, `replace`. WebUI polls this endpoint every 15 s.

## 14. WebSocket `/ws`

Upgrade to WebSocket (`CheckOrigin` uses the same allowed-origin rule).

Client messages:

```json
{"type": "chat", "request_id": "r1", "session_id": "default",
 "prompt": "hi", "messages": [{"role": "user", "content": "hi"}]}
{"type": "ping"}
```

Server messages: `{"type": "chunk", "request_id", "chunk", "done"}`,
`{"type": "usage", "request_id", "usage": {…}}`, `{"type": "done", "request_id"}`,
`{"type": "error", "request_id", "error"}`, `{"type": "pong"}`.

## 15. Pairing

Handled before CORS/token middleware (`CORE_LAN_ENABLED=1`).

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/pairing/request` | Origin empty or localhost | `{name}` → `{id, code, secret, expires}` (4 KB, max 32 pending) |
| GET | `/api/pairing/pending` | Loopback only | `{requests: [...]}` |
| POST | `/api/pairing/approve` | Loopback only | `{id, code, allow}` → `{ok}` |
| POST | `/api/pairing/status` | Needs `secret` | → `{approved, core_id, token, certificate, server_name}` (single claim) |

## 16. Service ports and plugin auth

| Service | Inbound | Auth |
|---|---|---|
| Core HTTP | 8080 (TLS 8443 in LAN mode) | `CORE_API_TOKEN` + pairing |
| Core gRPC | 50051 (TLS 5443 in LAN mode) | pairing on TLS port; loopback plaintext otherwise |
| mocr gRPC | 50052 | none (loopback bind, plaintext) |
| LIFE gRPC | 50053 | none (loopback bind, plaintext) |
| Agent gRPC | 50054 | `authorization: Bearer ${CORE_PAIR_TOKEN\|\|CORE_API_TOKEN}` on every RPC |
| Minecraft HTTP | 8765 | local tool API for the minecraft plugin |
| Discovery | UDP 50050 | pairing protocol |

### Outbound plugin → Core calls

| Plugin | Calls | Auth |
|---|---|---|
| mocr | `GET /api/models`, `GET /api/settings/provider`, `GET /api/providers`, `POST /api/usage/record` | Bearer only on `usage/record` |
| LIFE | `GET /api/settings/life`, `GET /api/providers`, `POST /api/tasks` | Bearer on `tasks` (if token set) |
| Agent | `GET /api/settings/agent`, `GET /api/providers`, `POST /api/tasks` | `Authorization: Bearer ${CORE_PAIR_TOKEN\|\|CORE_API_TOKEN}`; TLS via `CORE_TLS_CA`/`CORE_TLS_NAME` |
| Minecraft | `POST /api/mocr/generate`, `POST /api/tasks` | Bearer when `CORE_API_TOKEN` is set |
