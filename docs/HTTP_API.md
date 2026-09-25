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
  `CORE_TRUSTED_NETWORKS` must additionally present a paired device token
  (or `CORE_API_TOKEN`), otherwise `401 paired device required`.
- Plugin callbacks (`/api/pairing/*` routes) are handled before CORS/auth and
  apply their own loopback/Origin rules instead.

### CORS and preflight

- Allowed origins: same origin, `localhost`/`127.0.0.1` variants, plus any host
  listed in `CORE_ALLOWED_ORIGINS` (comma separated). Other origins get
  `403 origin not allowed`.
- Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`.
  Allowed headers: `Content-Type, Authorization`.
- `OPTIONS` preflight returns `200` empty body **before** token validation, so
  browsers do not need to send credentials on preflight.

### Errors

There is no single error envelope. Expect one of:

| Shape | Where |
|---|---|
| `4xx/5xx` plain text (`http.Error`) | Most validation/auth failures, e.g. `invalid request`, `prompt required`, `session not found` |
| JSON `{success, result, error}` | `POST /api/run`, `/api/skills` |
| JSON `{error}` or SSE `event: error` | Chat/generation streams |
| `204` empty body | `POST /api/usage/record` |

### Request details

- JSON bodies use `snake_case` field names and `Content-Type: application/json`.
- Body size limits: sessions 8 KB, messages 128 KB, approvals/questions 64 KB,
  notifications 64 KB, tasks 2 MB, skills POST 2 MB, usage record 16 KB,
  pairing request 4 KB, images 16 MB, live2d upload 512 MB (32 MB per part).
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
- Files are referenced by patch modules, e.g.
  `import("/api/plugins/agent/ui/index.js")`.

## 3. Agent sessions

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/agents` | Registered executors, health, missing dependencies |
| GET | `/api/agent/sessions` | List sessions (`kind == "agent_session"` tasks) |
| POST | `/api/agent/sessions` | Create session, body `{title}` → `201 {session_id}` |
| PATCH | `/api/agent/sessions` | `{session_id, action: "archive"\|"restore"\|…}` or `{session_id, action:"rename", title}` |
| DELETE | `/api/agent/sessions` | Same handler as PATCH; body `{session_id}` (forces `action=delete`) |
| POST | `/api/agent/messages` | Dispatch a prompt to a session |
| GET, POST | `/api/agent/workspace` | GET browse `?executor_id=&path=`, POST `{path,name}` mkdir |
| GET | `/api/agent/host` | `?executor_id=` live CPU/memory sample via `host_status` |
| POST | `/api/agent/compact` | Compact a session's history via LIFE |

```json
// GET /api/agents
{"agents": [{"plugin_id": "agent-1", "name": "executor", "version": "0.1.0",
  "address": "127.0.0.1:50054", "status": "PLUGIN_STATUS_HEALTHY",
  "active_tasks": 0, "last_heartbeat_age_seconds": 3,
  "host": {"hostname": "WIN", "os": "windows", "arch": "amd64",
           "cpu_model": "…", "cpu_cores": 8, "memory_total_bytes": 0,
           "memory_available_bytes": 0, "workdir": "C:/work"},
  "missing_dependencies": []}],
 "online_count": 1}

// POST /api/agent/messages (128 KB max)
{"session_id": "s_1", "prompt": "…", "agent_type": "code",
 "executor_id": "", "workdir": "", "model_id": "MOCR",
 "thinking_intensity": "off|low|medium|high|max|<0-100>",
 "permission_mode": "normal|full_access", "language": "zh"}
// → 202 {"task_id": "agent-task:…", "accepted": true, "message": ""}
// 409 session already has an active task · 404 session not found
// 400 thinking intensity must be between 0 and 100 / invalid permission mode
```

`GET /api/agent/workspace` and `GET /api/agent/host` return the executor's
`RunDirect` result verbatim (JSON string produced by the Agent). If no
`executor_id` is given, the first healthy executor is used; otherwise
`503 selected executor unavailable`.

`POST /api/agent/compact` rebuilds history from stored tasks, asks LIFE for a
summary (120 s timeout), records a `compact` task, and returns
`{"summary": "…"}`. Failures: `409` while a task is active,
`400 no conversation to compact`, `503 LIFE unavailable`.

## 4. Approvals and questions

`GET`/`POST /api/agent/approvals` and `GET`/`POST /api/agent/questions` share
one handler; the path selects `approval_list`/`approval_decide` versus
`question_list`/`question_answer` on every online executor.

| Method | Path | Body / query |
|---|---|---|
| GET | `/api/agent/approvals` | `?session_id=` → `{approvals: [...]}` (rows gain `executor_id`, `executor_name`) |
| POST | `/api/agent/approvals` | `{executor_id, id, allow: true\|false}` → `{ok:true}` or `409` |
| GET | `/api/agent/questions` | `?session_id=` → `{approvals: [...]}` |
| POST | `/api/agent/questions` | `{executor_id, id, answer: "…"}` → `{ok:true}` or `409` |

Aggregated list responses reuse the `approvals` key for both kinds. Each
decision forwards to one executor (3 s timeout); unknown executor → `503`.

## 5. Skills

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/skills` | List skills → `{success, result: {dir, skills[]}, error}` |
| POST | `/api/skills` | Save/overwrite `{name, content}` (2 MB) |
| DELETE | `/api/skills?name=` | Delete a file-backed skill (`404` if missing) |

Proxied to the Agent `skills_admin` tool through `RunDirect` with a 30 s
timeout. `result` is raw JSON or `null`.

## 6. Tasks

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/tasks` | `{tasks: [...]}` full list |
| GET | `/api/tasks?incremental=1&cursor=` | Delta since cursor (same shape as SSE payload) |
| POST | `/api/tasks` | Record a `TaskEvent` (2 MB) → `{ok:true}` / `409` |
| GET | `/api/tasks/events` | SSE stream of task deltas |
| POST | `/api/tasks/cancel` | `{task_id}` → `{success, message}` |

`TaskEvent` fields: `task_id`, `caller_id`, `session_id`, `parent_id`, `kind`,
`prompt`, `state`, `result`, `error`. States: `pending`, `running`, `done`,
`failed`, `cancelled`. Result payloads should stay under ~200 k characters.

SSE (`Content-Type: text/event-stream`):

```
event: tasks
data: {"cursor":"…","added":[…],"updated":[…],"removed":[…]}

: heartbeat        (every 15 s; poll tick is 200 ms)
```

## 7. Chat and models

### `POST /api/chat` (alias `POST /api/mocr/generate`)

```json
{"request_id": "r1", "prompt": "hi", "stream": false,
 "session_id": "default", "model_id": "", "system_prompt": "",
 "temperature": 0.7, "max_tokens": 1024,
 "messages": [{"role": "user", "content": "hi"}]}
```

- `stream: false` → `{"request_id", "response", "error"?, "usage"?: {prompt_tokens, completion_tokens, total_tokens}}`
- `stream: true` → SSE events:
  - `event: chunk` with the serialized mocr chunk (`chunk`, `done`, …)
  - `event: done` with `{}`
  - `event: error` with `{"request_id"?, "error"}`

Empty `model_id` means Core/mocr selection (`MOCR`); pin a model id to bypass
selection.

### `POST /api/life/chat`

Main WebUI conversation path; proxies LIFE `OnUserMessage` as SSE.

```json
{"request_id": "life_1", "session_id": "webui:default", "user_id": "webui",
 "prompt": "…", "persona": {}, "history": []}
```

Chunk payload: `{request_id, chunk, done, task_id, think_summary,
emotion: {valence, arousal, connection, irritation}, mental_energy}`.
Events: `chunk`, `done`, `error` (`503 LIFE is unavailable` when the plugin
is offline).

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

Provider configs persist to `data/providers.json`. `503 provider store not
ready` while the store is initializing.

## 8. LIFE

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

// GET /api/life/permissions
{"screen_watch": false, "computer_use": false, "report_agent_host": "…"}
// POST/PUT echoes the stored value set

// GET /api/life/memories?limit=1..500 (default 100)&query=text
{"memories": [{"id", "content", "importance", "strength",
               "created_at", "tags", "tier"}],
 "stats": {"working": 0, "shortTerm": {"total": 0}, "longTerm": 0, "avgStrength": 0}}
// LIFE offline → 200 with empty lists (soft fail, optional "error")

// GET /api/life/companion → LIFE JSON snapshot verbatim
// POST /api/life/companion {"action": "add_agenda", "payload": {...}}
//   actions: add_agenda, confirm_agenda, reject_agenda, complete_agenda,
//            journal, dream, memory_maintenance, delete_memory,
//            clear_all_memory, ack_notifications
```

`POST /api/settings/life` values with keys `screen_watch`, `computer_use`,
`report_agent_host` are also mirrored into `/api/life/permissions`.

## 9. Usage

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/usage` | `{total_tokens, by_model, by_day}` |
| POST | `/api/usage/record` | One usage record (16 KB) → `204` |
| POST | `/api/usage/clear` | Wipe → `{ok: true, usage}` |

`/api/usage/record` is called by mocr with `Authorization: Bearer ${CORE_API_TOKEN}`.

## 10. Settings

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/settings/sections` | Plugin-contributed sections (disabled plugins omitted) |
| GET | `/api/settings/{id}` | `{section, values}` |
| POST, PUT | `/api/settings/{id}` | Body: flat values or `{values: {...}}` → `{section, values}` |

- `SetValues` is a merge: omitted keys keep their previous value.
- Sections owned by a disabled plugin: `403 section disabled`.
- Field schema and the `SettingsSection` contract are described in
  [Settings and UI Patches](settings-ui.md).

## 11. Images and Live2D

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/images` | multipart `file` (16 MB) → `{file, url}` |
| GET | `/api/images?file=` | Read stored image |
| GET | `/api/live2d` | List models `[{id, label, url}]` |
| POST | `/api/live2d` | multipart upload: files + `paths` (512 MB total) |
| DELETE | `/api/live2d?id=` | Remove a model |
| GET | `/live2d/models/*` | Static model assets |

## 12. UI patches

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/ui/patches` | Flattened patch ops for WebUI |
| POST | `/api/ui/patches` | Force reload → `{ok: true, count: n}` |

```json
// GET /api/ui/patches
{"ops": [{"patchId": "life", "plugin": "life", "capability": "",
          "target": "router", "op": "insert", "anchor": "", "position": "",
          "id": "memory", "item": {"path": "/memory", "module": "/api/plugins/life/ui/memory.js"}}],
 "files": ["agent", "life", "mocr", "searxng"],
 "count": 12,
 "loaded": "2026-09-25T12:00:00Z"}
```

Behavior:

- Discovery directories: `$CORE_DATA_DIR/ui`, `{cwd}/ui`,
  `{cwd}/../webui/patches`, `{cwd}/data/ui`. Only `*.patch` files are read;
  contents are JSON (full file object or a bare ops array). Duplicate ids are
  resolved first-come-wins; missing `id` defaults to the file stem.
- `GET` rescans at most every **3 seconds** (mtime check). `POST` and plugin
  enable/disable bypass the cooldown with a forced reload.
- An op is dropped when its `capability` (falling back to `plugin`) matches no
  registered capability. Ops of admin-disabled plugins are always stripped.
- Targets: `nav`, `router`, `settings`, `status`, `chat`. Operations:
  `insert`, `remove`, `replace`. WebUI polls this endpoint every 15 s.
  See [Settings and UI Patches](settings-ui.md) for file format details.

## 13. WebSocket `/ws`

Upgrade to WebSocket (`CheckOrigin` uses the same allowed-origin rule).

Client messages:

```json
{"type": "chat", "request_id": "r1", "session_id": "default",
 "prompt": "hi", "messages": [{"role": "user", "content": "hi"}]}
{"type": "ping"}
```

Server messages: `{"type": "chunk", "request_id", "chunk", "done"}`,
`{"type": "usage", "request_id", "usage": {…}}`,
`{"type": "done", "request_id"}`, `{"type": "error", "request_id", "error"}`,
`{"type": "pong"}`.

## 14. Pairing

Handled before CORS/token middleware (`CORE_LAN_ENABLED=1`).

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/pairing/request` | Origin must be empty or localhost | `{name}` → `{id, code, secret, expires}` (4 KB, max 32 pending) |
| GET | `/api/pairing/pending` | Loopback only | `{requests: [...]}` |
| POST | `/api/pairing/approve` | Loopback only | `{id, code, allow}` → `{ok}` |
| POST | `/api/pairing/status` | Needs `secret` | → `{approved, core_id, token, certificate, server_name}` (single claim) |

Unknown `/api/pairing/*` paths return `404`. Details in
[PLUGIN_API §5](PLUGIN_API.md).

## 15. Service ports and plugin auth

| Service | Inbound | Auth |
|---|---|---|
| Core HTTP | 8080 (TLS 8443 in LAN mode) | `CORE_API_TOKEN` + pairing |
| Core gRPC | 50051 (TLS 5443 in LAN mode) | pairing on TLS port; loopback plaintext otherwise |
| mocr gRPC | 50052 | none (loopback bind, plaintext) |
| LIFE gRPC | 50053 | none (loopback bind, plaintext) |
| Agent gRPC | 50054 | `authorization: Bearer ${CORE_PAIR_TOKEN\|\|CORE_API_TOKEN}` on every RPC (`UNAUTHENTICATED paired Core required`) |
| Discovery | UDP 50050 | pairing protocol |

### Outbound plugin → Core calls

| Plugin | Calls | Auth |
|---|---|---|
| mocr | `GET /api/models`, `GET /api/settings/provider`, `GET /api/providers`, `POST /api/usage/record` | Bearer only on `usage/record` |
| LIFE | `GET /api/settings/life`, `GET /api/providers`, `POST /api/tasks` | Bearer on `tasks` (if token set) |
| Agent | `GET /api/settings/agent`, `GET /api/providers`, `POST /api/tasks` | `Authorization: Bearer ${CORE_PAIR_TOKEN\|\|CORE_API_TOKEN}`; TLS via `CORE_TLS_CA`/`CORE_TLS_NAME` |
