# HTTP API Reference

Complete reference for the Core HTTP gateway. Default base URL is
`http://127.0.0.1:8080` (`CORE_HTTP_PORT`, `CORE_BIND_HOST`). With
`CORE_LAN_ENABLED=1` the same routes are additionally served over TLS on
`https://<host>:8443`. The gRPC plugin protocol is documented in
[PLUGIN_API](PLUGIN_API.md).

## 1. Conventions

### Authentication

Every `/api/*` route (including `/health`) is behind one gate:

- Loopback callers and callers inside `CORE_TRUSTED_NETWORKS` are trusted and
  need no credential.
- Everyone else must present one of: `Authorization: Bearer <token>` with a
  paired-device token or `CORE_API_TOKEN`, or the HttpOnly `0kay_session`
  cookie minted by `POST /api/auth/session`.
- Failure returns `401` with `WWW-Authenticate: Bearer realm="0kay"` and the
  JSON error envelope with code `unauthenticated`.

`/api/auth/session` runs ahead of the gate so an unauthenticated browser can
discover that a credential is required and supply one:

| Method | Path | Purpose |
|---|---|---|
| GET, HEAD | `/api/auth/session` | `{authenticated, method, requires_auth, core_id, lan_enabled}` |
| POST | `/api/auth/session` | `{token}` → sets `0kay_session` (HttpOnly, SameSite=Strict, 30 d) → `{authenticated, method:"cookie", requires_auth, core_id}` |
| DELETE | `/api/auth/session` | Clears the cookie → `{authenticated:false, method:""}` |

The cookie value is the bearer token itself, so `Secure` is set whenever the
browser hop is encrypted: direct TLS, or `X-Forwarded-Proto: https` from a
trusted peer (a TLS-terminating reverse proxy). `CORE_COOKIE_SECURE=1|0`
overrides the detection when the deployment cannot be inferred.

Plugin pairing callbacks (`/api/pairing/*`) are handled before this gate and
apply their own loopback/Origin rules instead.

### Host and origin checks

- DNS-rebinding guard: loopback, IP literals and single-label hostnames
  (e.g. the compose service name `core`) are accepted; any other host must be
  listed in `CORE_ALLOWED_HOSTS` / `CORE_ALLOWED_ORIGINS` or reported by
  `pairingHostIdentity()`, otherwise `403 host_not_allowed`. Entries in either
  variable may be a bare hostname, `host:port`, or a full origin URL; all three
  are reduced to the hostname for the Host check. For CORS authorization,
  `CORE_ALLOWED_ORIGINS` entries must still be complete origins (scheme, host,
  and port when non-default), matching the browser's Origin header exactly.
- Allowed origins: same origin, `localhost`/`127.0.0.1` variants, plus any host
  listed in `CORE_ALLOWED_ORIGINS` (comma separated). Other origins get
  `403 origin_not_allowed`.
- Allowed methods: `GET, POST, PUT, PATCH, DELETE, OPTIONS`. Allowed headers:
  `Content-Type, Authorization`.
- Accepted origins are echoed back with `Access-Control-Allow-Origin`,
  `Access-Control-Allow-Credentials: true` and `Vary: Origin`.
- `OPTIONS` preflight returns `204` empty body before token validation.

### Errors

Every failure (except SSE bodies, which report errors as `event: error`) uses
one envelope, always `application/json`:

```json
{"error": "human readable message", "code": "machine_code"}
```

`error` stays a string so existing `data?.error` clients keep working. Method
mismatches return `405` with `Allow`. Common codes: `bad_request`,
`unauthenticated`, `forbidden`, `not_found`, `method_not_allowed`,
`section_disabled`, `upstream_error`, `unavailable`, `host_not_allowed`,
`origin_not_allowed`, `cross_site_denied`.

`POST /api/usage/record` still answers `204` with an empty body on success.

### Request details

- JSON bodies use `snake_case` field names and `Content-Type: application/json`.
- The server enforces a hard body cap per route (requests over it are rejected
  before decode): chat/LIFE chat 4 MB, direct runs (`/api/run`, approvals,
  questions, workspace, host, compact) 64 KB, agent messages 128 KB, generic
  small bodies (settings, providers, models, skills deletes) 64 KB, skills
  POST 2 MB, tasks 2 MB, images 16 MB (8 MB per multipart part), live2d upload
  512 MB (32 MB per part).
- Common query parameters: `?limit=` `?query=` `?cursor=` `?incremental=1`
  `?session_id=` `?executor_id=` `?path=` `?id=` `?name=` `?values=1` `?file=`.

### Deprecation

Legacy alias routes keep working and answer with

```
Deprecation: true
Link: </api/usage>; rel="successor-version"
```

pointing at the successor, for example `POST /api/usage/clear` →
`DELETE /api/usage` and `POST /api/plugins/enable` → `PATCH /api/plugins/{name}`.

## 2. Health and plugins

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | Health summary (behind the normal auth gate) |
| GET | `/api/plugins` | All plugins, including disabled rows |
| PATCH | `/api/plugins/{name}` | `{enabled: bool}`; unknown plugin → `404` |
| POST | `/api/plugins/enable` | Legacy alias: enable, body `{plugin\|name}` |
| POST | `/api/plugins/disable` | Legacy alias: disable (persisted to `data/disabled_plugins.json`) |
| GET, HEAD | `/api/plugins/{name}/ui/{path…}` | Plugin frontend ESM/static assets |

```json
// GET /health
{"status": "ok", "plugins": 6, "healthy": 5}

// GET /api/plugins (array)
[{"plugin_id": "agent", "name": "agent", "version": "0.1.0",
  "type": "PLUGIN_TYPE_SERVICE", "capabilities": ["agent"],
  "status": "PLUGIN_STATUS_HEALTHY", "active_tasks": 0, "disabled": false}]

// PATCH /api/plugins/life  {"enabled": true}
// →  {"plugin": "life", "enabled": true, "ok": true}
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
| GET | `/api/update/check-plugins` | Latest release vs. every installed component (registered plugins + source/pm components) |
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
- `check-plugins` lists **every installed component**, not only currently
  running plugins: registered plugin services, platform components found in the
  source checkout (`core`, `webui`, `life`, `mocr`, `agent`, `searxng`, `mcp`,
  `minecraft`, `pm`) and third-party plugins installed through 0kay-pm (listed
  by their package name). `can_update` is true whenever `apply` can handle it.
- `apply` with no `version` syncs the latest source (or runs `0kay-pm update`)
  for that component; a component whose manifest declares no start command
  (e.g. `mcp`, `pm`) is synced/built without a restart.
- The global GitHub mirror ("plugin source") lives in the core-owned `updates`
  settings section as `github_proxy` (`GET`/`POST /api/settings/updates`). When
  set (e.g. `https://gh-proxy.com`) it is applied to source syncs and to the git
  commands `0kay-pm` runs during install/update; empty means direct access.
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
| PATCH | `/api/agent/sessions/{session_id}` | `{action: "archive"\|"restore"\|…}` or `{action:"rename", title}` |
| DELETE | `/api/agent/sessions/{session_id}` | Delete a session |
| POST | `/api/agent/sessions` | Legacy alias: PATCH/DELETE with `{session_id, action?, title?}` in the body |
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
`question_list`/`question_answer` on every online executor. `GET /api/agent/inbox`
merges both lists into a single round trip and is what the WebUI inbox polls.

| Method | Path | Body / query |
|---|---|---|
| GET | `/api/agent/inbox` | `?session_id=` → `{approvals: [...], questions: [...]}` |
| GET | `/api/agent/approvals` | `?session_id=` → `{approvals: [...]}` |
| POST | `/api/agent/approvals` | `{executor_id, id, allow: true\|false}` → `{ok:true}` or `409` |
| GET | `/api/agent/questions` | `?session_id=` → `{approvals: [...]}` |
| POST | `/api/agent/questions` | `{executor_id, id, answer: "…"}` → `{ok:true}` or `409` |

An executor that fails the round trip turns the whole request into `502
upstream_error`, so the client never silently loses pending prompts.

## 6. Skills

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/skills` | List skills → `{success, result: {dir, skills[]}, error}` |
| POST | `/api/skills` | Save/overwrite `{name, content}` (2 MB) |
| DELETE | `/api/skills/{name}` | Delete a file-backed skill (`404` if missing) |
| DELETE | `/api/skills?name=` | Legacy alias for the path form |

Proxied to the Agent `skills_admin` tool through `RunDirect` with a 30 s timeout.

## 7. Tasks

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/tasks` | `{tasks: [...]}` full list |
| GET | `/api/tasks?incremental=1&cursor=` | Delta since cursor |
| POST | `/api/tasks` | Record a `TaskEvent` (2 MB) → `{ok:true}` / `409` |
| GET | `/api/tasks/events` | SSE stream of task deltas |
| POST | `/api/tasks/{task_id}/cancel` | → `{success, message}` |
| POST | `/api/tasks/cancel` | Legacy alias: body `{task_id}` |

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

Core always asks mocr for a streaming generation and aggregates the chunks
itself, so `stream` in the request only selects the HTTP response shape. An
upstream failure — including a stream that ends without an explicit `done` —
becomes a real error (`502` for the JSON form, `event: error` for SSE) instead
of a silent empty answer.

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
| POST | `/api/models/fetch` | `{id?, provider, base_url, api_key?, format?}` → `{models, source, error}` |
| GET | `/api/providers` | Redacted snapshot: `api_key` is dropped and `api_key_masked` added |
| POST, PUT | `/api/providers` | Upsert `{provider}` or replace `{providers, default_provider_id, default_model}` |
| DELETE | `/api/providers/{id}` | Remove one provider → snapshot |
| DELETE | `/api/providers/delete?id=` | Legacy alias for the path form |
| GET | `/api/providers/credentials` | **Plaintext** catalog (legacy `GET /api/providers` shape) + `?id=` for one |
| GET | `/api/providers/defaults` | `{default_provider_id, default_model}` |
| POST, PUT | `/api/providers/defaults` | Set defaults → echoed back |
| POST | `/api/run` | `RunDirect` (60 s) → `{success, result, error}` |

Provider configs persist to `data/providers.json`. `503 provider store not ready`
while the store is initializing.

Each provider row may carry a `format` field selecting the wire protocol
independently of the `provider` preset: `"openai"` (`/chat/completions`) or
`"anthropic"` (`/v1/messages`). Empty means *auto* — mocr infers it from the
preset name or an `anthropic.com` base URL. This lets a `custom` (or any
OpenAI-named) endpoint speak the Anthropic Messages API, e.g. a Claude-compatible
relay. Core forwards the effective provider to mocr and to
`/api/providers/credentials`, so LIFE / Agent / mocr pick the right transport;
the redacted `/api/providers` view keeps the original preset plus `format` for
display.

**API keys never leave Core through `/api/providers`.** The list is redacted:
`api_key` is empty and `api_key_masked` carries `abcd************wxyz`
(first 4 + 12 `*` + last 4; fully masked for keys ≤ 8 chars). Sending an empty
or masked `api_key` back in an upsert preserves the stored secret, and a mask is
never written to disk. Only `GET /api/providers/credentials` returns plaintext;
it requires authentication and rejects cross-site browser reads
(`Sec-Fetch-Site: cross-site` → `403 cross_site_denied`). It exists for the
in-repo services (LIFE / Agent / mocr) that must forward a key upstream.

`POST /api/models/fetch` resolves the key server-side: when `api_key` is empty
or masked it looks the provider up by `id`, then by `(provider, base_url)`. A
masked key is never forwarded to the provider's model endpoint.

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
| POST | `/api/usage/record` | One usage record (64 KB) → `204` |
| DELETE | `/api/usage` | Wipe → `{ok: true, usage}` |
| POST | `/api/usage/clear` | Legacy alias for `DELETE /api/usage` |

`/api/usage/record` is called by mocr with `Authorization: Bearer ${CORE_API_TOKEN}`.

## 11. Settings

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/settings/sections` | Plugin-contributed sections (disabled plugins omitted) |
| GET | `/api/settings/sections?values=1` | Same, each row additionally carrying `values` (one round trip) |
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
| DELETE | `/api/live2d/{path…}` | Remove a model (ids contain `/`, e.g. `nice/model.json`) |
| DELETE | `/api/live2d?id=` | Legacy alias for the path form |
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

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/pairing/request` | Origin empty or localhost | `{name}` → `{id, code, secret, expires}` (4 KB, max 32 pending) |
| GET | `/api/pairing/pending` | Loopback only | `{requests: [...]}` |
| POST | `/api/pairing/approve` | Loopback only | `{id, code, allow}` → `{ok}` |
| POST | `/api/pairing/status` | Needs `secret` | → `{approved, core_id, token, certificate, server_name}` (single claim) |

Browser session endpoints (`/api/auth/session`) run on the same pre-gate path;
see [Authentication](#authentication).

## 16. Service ports and plugin auth

| Service | Inbound | Auth |
|---|---|---|
| Core HTTP | 8080 (TLS 8443 in LAN mode) | trusted network, `CORE_API_TOKEN`, paired device token, or `0kay_session` cookie |
| Core gRPC | 50051 (TLS 5443 in LAN mode) | pairing on TLS port; loopback plaintext otherwise |
| mocr gRPC | 50052 | none (loopback bind, plaintext) |
| LIFE gRPC | 50053 | none (loopback bind, plaintext) |
| Agent gRPC | 50054 | `authorization: Bearer ${CORE_PAIR_TOKEN\|\|CORE_API_TOKEN}` on every RPC |
| Minecraft HTTP | 8765 | local tool API for the minecraft plugin |
| Discovery | UDP 50050 | pairing protocol |

### Outbound plugin → Core calls

| Plugin | Calls | Auth |
|---|---|---|
| mocr | `GET /api/models`, `GET /api/settings/provider`, `GET /api/providers/credentials`, `POST /api/usage/record` | Bearer on `providers/credentials` and `usage/record` |
| LIFE | `GET /api/settings/life`, `GET /api/providers/credentials`, `POST /api/tasks` | Bearer on `providers/credentials` and `tasks` (if token set) |
| Agent | `GET /api/settings/agent`, `GET /api/providers/credentials`, `POST /api/tasks` | `Authorization: Bearer ${CORE_PAIR_TOKEN\|\|CORE_API_TOKEN}`; TLS via `CORE_TLS_CA`/`CORE_TLS_NAME` |
| Minecraft | `POST /api/chat`, `POST /api/tasks` | Bearer when `CORE_API_TOKEN` is set |

`GET /api/providers/credentials` is fetched per request (no caching) so provider
edits take effect immediately.
