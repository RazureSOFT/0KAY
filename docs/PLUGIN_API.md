# 0KAY Plugin API (v1)

Protocol sources live in `proto/{core,plugin,agent,life,mocr}/v1/*.proto`. Field
types, enum numbers and stream directions are defined there; TypeScript uses
proto-loader, Go/Python use `gen/`. Per-endpoint HTTP details are in the
[HTTP API Reference](HTTP_API.md).

## 0. Package manifest (schema 1)

Every installable plugin or module ships a `manifest.json` declaring its
package identity, version, build and run commands. The file is consumed by
**0kay-pm**; Core's gRPC registration, settings declarations and WebUI
`.patch` files are separate interfaces and cannot be replaced by the manifest.

### 0.1 Service plugin example

```json
{
  "schema": 1,
  "name": "@razuresoft/0kay-agent",
  "version": "0.1.0",
  "tags": ["0kay-plugin"],
  "dependencies": ["@razuresoft/0kay-mcp"],
  "requires": ["core", "mocr"],
  "install": [["npm", "ci"], ["npm", "run", "build"]],
  "start": ["node", "dist/index.js"]
}
```

| Field | Type / required | Meaning |
|---|---|---|
| `schema` | number / yes | Fixed at `1` |
| `name` | string / yes | Package name; validated as `@razuresoft/` plus lowercase letters, digits or hyphens |
| `version` | string / yes | Package version; releases use SemVer, e.g. `0.1.0` |
| `tags` | string[] / yes | Must contain `0kay-plugin` (see below) |
| `description` | string / no | Human-readable note; does not affect execution |
| `install` | string[][] / no | Ordered build/install commands; each entry is an argv array |
| `start` | string[] / no | Single start command argv; omitted when there is no standalone process |
| `dependencies` | string[] / no | Packages pm installs recursively; version ranges are not supported yet |
| `requires` | string[] / no | Runtime dependency hints; pm does not install, wait for readiness or register capabilities from these |
| `modules` | string[] / no | Sub-manifest paths (relative to the repo root) used by an umbrella package |
| `repositories` | object[] / no | External sub-repository declarations, each `{path, package, url}` |
| `ui` | object / no | Optional plugin WebUI build/publish config (below) |
| `ports` | object / no | Port metadata such as Core's `http`/`grpc`; not a generic port executor |

**Every 0kay plugin must carry the `0kay-plugin` tag.** The manifest `tags`
array has to contain `0kay-plugin`; this is the only tag the platform reserves
and it is how a package is recognized as a 0kay plugin. It applies to
third-party plugins **and to the platform's own plugins we write** — Agent,
LIFE, MOCR, MCP, Minecraft, skillsguishow and every `plugin-web/*` bundle
declare it too. Other tags may be added freely alongside it.

Commands must be non-empty argv arrays such as `["python", "-m", "life.main"]`,
never a single shell string. Every argument must be a string with no newline or
NUL; do not rely on `&&`, pipes or shell variable expansion. Service commands
run with the manifest directory as the working directory; the standalone agent
package is arranged by pm into an `agent/`, `mcp/`, `proto/` layout and built and
started inside `agent/`.

### 0.2 Umbrella packages and sub-repositories

```json
{
  "schema": 1,
  "name": "@razuresoft/0kay",
  "version": "0.1.0",
  "modules": ["core/manifest.json", "mocr/manifest.json", "life/manifest.json",
              "webui/manifest.json", "plugin-web/agent/manifest.json"],
  "repositories": [{
    "path": "agent",
    "package": "@razuresoft/0kay-agent",
    "url": "https://github.com/RazureSOFT/0KAY-agent.git"
  }]
}
```

This is a structural example; the full module list is the repository root
manifest. Sub-repositories download as source archives, not `git clone`.
First-party names use a built-in package-name → repository map. Other names are
resolved as third-party packages: pm reads the npm registry `repository` field,
then falls back to a GitHub `owner/repo` convention for the requested name; an
unscoped `owner/repo` argument is accepted directly. `0kay-pm install --source
&lt;local-tree&gt;` installs a local checkout of any package without registry
resolution. A package manifest must still pass `validateManifest` and its
declared `name` must match the requested package.

pm runs each sub-manifest `install` in `modules` order and handles sub-manifest
`ui`. Starting an umbrella package runs the direct sub-manifests' `start`
commands in parallel, skipping library and UI-only modules. Plugins handle
dependency-not-ready, registration retry and reconnection themselves.

### 0.3 Plugin WebUI manifest

A standalone build can be published through `ui`:

```json
{
  "schema": 1,
  "name": "@razuresoft/0kay-web-example",
  "version": "0.1.0",
  "install": [["npm", "ci"]],
  "ui": { "dir": ".", "plugin": "example", "dist": "dist", "build": [["npm", "run", "build"]] }
}
```

- `dir`: build directory relative to the manifest, default `.`.
- `build`: ordered argv arrays run in `dir`, after `install`.
- `dist`: artifact path relative to the build directory, default `dist`.
- `plugin`: publish directory name, `[A-Za-z0-9_-]{1,64}`; must match the plugin
  name used in the UI URL.
- Output is copied to Core's `plugin-ui/<plugin>/` data directory.

This repository's `plugin-web/{life,agent,minecraft,skillsguishow}` Vite configs
already emit to `core/data/plugin-ui/<name>`, so their manifests only need
`install`. A build manifest does not replace a route `.patch`; the native Vue
module loading protocol is in [Writing a Plugin](writing-a-plugin.md) §5a.

### 0.4 Install, autostart and update

```powershell
0kay-pm install @razuresoft/0kay@0.1.0
0kay-pm install @razuresoft/0kay-agent@0.1.0
0kay-pm update @razuresoft/0kay-agent@0.1.0
0kay-pm start @razuresoft/0kay-agent
```

- `@0.1.0` (or `--version 0.1.0`) selects the `v0.1.0` tag source archive, not a
  prebuilt binary; the matching toolchain is still required. Omitting the version
  downloads `main`.
- Interactive installs of the platform or related components ask for the Core
  HTTP, Core gRPC and WebUI ports; defaults are `8080`, `50051`, `3000`. Use
  `--core-port`, `--core-grpc-port`, `--webui-port` for scripts.
- Configuration is stored as `runtime-env.json` in the install root and passed
  to child processes at start.
- A successful install runs the start command automatically; modules without
  `start` create no process.
- Stop a component before updating it. Update keeps `runtime-env.json` and the
  standard component `data` directories, and keeps a `.old-<id>` recovery copy of
  the previous install.

### 0.5 One-click updates (Settings → About)

Core exposes component-update endpoints; the About panel renders **Update now**
(published release) and **Beta (sync repo)** (main branch) from them:

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/update/check` | Latest platform release vs the running version |
| GET | `/api/update/check-plugins` | Latest release vs each registered plugin |
| POST | `/api/update/apply` | Start an update for one component |
| GET | `/api/update/status` | Progress of the most recent update |

`POST /api/update/apply` takes `{plugin, version?}`; omitting `version` syncs
`main` (beta). The update path is chosen automatically:

- **pm mode**: when `~/.0kay/state.json` records the package, Core runs a
  detached `0kay-pm stop → update → start` script.
- **source mode**: with no pm record, Core `git pull --ff-only` the component's
  git repository, rebuilds it from `manifest.json` (dependency installs
  skipped), then restarts the component on its listen port. Components without a
  pm package (e.g. Minecraft) also use source mode.

Both paths run as a detached script that writes to
`$CORE_DATA_DIR/updates/apply.log` and prints a completion marker;
`GET /api/update/status` derives `running`/`done`/`failed` from that file so
status survives a Core restart. The Windows updater runs with no console window.

### 0.6 Version and registration

The manifest `name` is the package name (`@razuresoft/0kay-agent`); gRPC
`plugin_info.name` is the service name (`agent`). A plugin reads its own version
and sets `plugin_info.version`; Agent, LIFE and MOCR read it from their
manifests. `requires` is not converted automatically: the plugin still sends
`requires:<plugin>` capabilities at runtime. Core reports the registered version
at `/api/plugins`, and the update check compares it with the known repository's
latest GitHub Release.

## 1. Registration, identity and dependencies

Plugins connect to Core's `core.v1.PluginService`:

| RPC | Input | Output |
|---|---|---|
| Register | plugin_info, capabilities, address, settings_sections | success, plugin_id, message |
| Heartbeat | plugin_id, status, active_tasks, host | ok, shutdown_signal |

`plugin_info`: name, version, description, author, plugin_type
(PERSONA/TOOL/SERVICE/ADAPTER). `address` is the address Core calls back; remote
plugins must not send localhost. Executors use `executor:<persistent UUID>`;
runtime dependencies use `requires:<plugin>`, e.g.
`['agent','executor:uuid','requires:mocr']`. Registration does not imply
schedulable: missing, unhealthy, disabled or circularly-dependent plugins are
withheld and become available once the dependency recovers. Heartbeat every
~10 seconds; 30 seconds without a heartbeat marks the plugin unhealthy. The
registration id is stable and independent of start order.

Settings registration uses
`SettingsSection{id,label,icon,order,description,fields}` and
`SettingsField{key,type,label,default_value,options,help}` where `type` is
bool/number/text/select and `default_value` is a string.

## 2. Core gRPC (core.v1.CoreService)

| RPC | Function |
|---|---|
| CallMocr | Model call; request_id, caller_id, prompt, context, stream, session_id, messages, model_id, system_prompt; returns text and usage stream |
| UseAgent | Async dispatch; task_id, caller_id, prompt, agent_type, metadata; returns accepted/task_id/message |
| CancelAgent | task_id/caller_id; cancels execution, returns success/message |
| ListAgents | include_unhealthy; returns agents/online_count |
| RunDirect | tool, args (JSON string), session_id; returns success/result/error |

UseAgent metadata: `session_id`, `parent_id`, `executor_id`, `workdir`,
`model_id` (MOCR = automatic), `thinking_intensity`
(off/low/medium/high/max or 0–100), `permission_mode` (normal/full_access).
Normal waits for a user decision on every privileged tool call; Full access runs
without prompts; sub-agents inherit the mode.

## 3. Plugin callback services

### agent.v1.AgentService
- ExecuteTask: task_id/prompt/agent_type/metadata → task_id/state/result/error/metadata.
- CancelTask: task_id → success/message.
- GetTaskStatus: task_id → task_id/state/result/error.
- RunDirect: tool/args/session_id → success/result/error.

Task states: PENDING, RUNNING, DONE, FAILED, CANCELLED; a cancelled or truncated
run is never DONE. RunDirect management operations — workspace_browse(path),
workspace_mkdir(path/name), host_status, approval_list(session_id),
approval_decide(id/allow) — are never exposed to the model as tools.
`edit`/`apply_patch` return a unified diff (`--- a/…`, `+++ b/…`,
`@@ -old +new @@`) so the WebUI can show the source file and line numbers, with
added lines green and deleted lines red.

### mocr.v1.MocrService
- ChooseModels: prompt/SelectionContext → think_model/output_model/reasoning.
- Generate: model_id/messages/system_prompt/max_tokens/temperature/stream/thinking/provider/base_url/api_key/tools/tool_choice → chunk/done/finish_reason/usage/thinking_content/role/tool_calls/text.
- Message: role/content/tool_call_id/tool_calls/reasoning_content. In thinking
  mode every assistant history item must carry `reasoning_content` back
  (DeepSeek returns 400 when tools are used and the field is missing).
- Streams must carry a normal completion flag; a network EOF is not success.

### life.v1.LifeService
- OnUserMessage: session_id/user_id/message/adapter_type/persona_json/history_json → reply, task id, emotion and energy stream. `persona_json.customPrompt` is sent to the model as the system prompt.
- OnTaskCompleted: task_id/state/result/error → acknowledged/response_text (idempotent).
- OnScheduledEvent: event_type → acknowledged (circadian, memory consolidation, idle check).
- GetState: emotion, energy, sleep, tasks, permissions.
- GetMemories: limit/query → memories and tier stats.
- SetPermissions: screen_watch/computer_use/report_agent_host → ok.
- GetCompanion → JSON snapshot; ManageCompanion: add_agenda, confirm_agenda, reject_agenda, complete_agenda, journal, dream, memory_maintenance, delete_memory, clear_all_memory, ack_notifications.
- CompactConversation: session_id/history_json/persona_json → ok/summary/error.
- GetNotifications: session_id → notifications; reads do not delete — confirm with ack_notifications.

### Tool plugins (minecraft, …)
`minecraft` registers as `PLUGIN_TYPE_TOOL` with `capabilities=["minecraft"]` and
a settings section (edition, server, username, password, autopilot, …). It
exposes a local HTTP tool API (default `127.0.0.1:8765`) that LIFE reaches
through Core.

## 4. HTTP gateway surface

The full per-endpoint request/response, auth and query details are in the
[HTTP API Reference](HTTP_API.md). Summary:

| Path | Method / purpose |
|---|---|
| /health | GET health and plugin counts |
| /api/plugins | GET plugin list |
| /api/plugins/enable, /disable | POST enable/disable |
| /api/update/check, /check-plugins | GET update checks |
| /api/update/apply | POST start a component update |
| /api/update/status | GET latest update progress |
| /api/agents | GET executors, hosts, missing dependencies |
| /api/agent/sessions | GET/POST sessions; PATCH archive/restore/rename; DELETE remove |
| /api/agent/messages | POST session_id/prompt/agent_type and execution options |
| /api/agent/workspace | GET browse; POST mkdir |
| /api/agent/host | GET live CPU/memory sample |
| /api/agent/approvals, /questions | GET pending; POST decision |
| /api/agent/compact | POST session_id, build and store a summary |
| /api/skills | GET list; POST save; DELETE ?name= remove |
| /api/tasks | GET full/incremental; POST TaskEvent |
| /api/tasks/events | GET SSE task delta stream |
| /api/tasks/cancel | POST task_id |
| /api/chat, /api/mocr/generate | POST base model generation, SSE capable |
| /api/life/chat | POST prompt/session_id/user_id/persona/history, SSE |
| /api/life/compact, /notifications, /state, /permissions, /memories, /companion | LIFE features |
| /api/run | POST direct tool call |
| /api/models, /models/fetch | model catalog |
| /api/providers, /delete, /defaults | provider config |
| /api/settings/sections, /settings/{id} | settings sections and values |
| /api/usage, /record, /clear | usage |
| /api/live2d, /live2d/models/* | Live2D models |
| /api/images | image upload/read |
| /api/ui/patches | GET UI ops; POST reload |
| /api/plugins/{name}/ui/{path…} | GET plugin ESM/static assets (404 when disabled) |
| /ws | WebSocket notifications and legacy chat |

TaskEvent: task_id/caller_id/session_id/parent_id/kind/prompt/state/result/error.
Keep results under ~200k characters. UI patch files carry
plugin/id/enabled/patches; each op sets target, op, id, item, anchor, position.
Targets are nav/router/settings/status/chat; disabling a plugin filters its
patches.

## 5. LAN discovery and pairing

Default local HTTP 8080 and gRPC 50051. `CORE_LAN_ENABLED=1` additionally opens
UDP 50050, HTTPS 8443 and TLS gRPC 5443.

- Discovery request: `{"protocol":"0kay-discover-v1","nonce":"<random>"}`; the
  response echoes the nonce and carries id/name/http_port/grpc_port/fingerprint.
- Discovery is not trust. pm pins the certificate fingerprint, requires user
  confirmation, and matches the pairing code on the Core host.
- POST /api/pairing/request {name} → id/code/secret/expires.
- GET /api/pairing/pending (loopback only) → requests.
- POST /api/pairing/approve {id,code,allow} (loopback only).
- POST /api/pairing/status {id,secret} → approved; on approval it issues
  token/certificate/server_name once.
- Remote HTTP and TLS gRPC use `Authorization: Bearer <token>`.
- Core binds callback credentials on Agent registration; the Agent verifies the
  Core callback token.
- The TLS gRPC port also proxies mocr, so mocr need not be exposed to the LAN.

The Agent callback port is still token-authenticated gRPC without callback TLS;
use it only on a trusted LAN, never the public internet. Never commit
certificates, tokens or pairing state.
