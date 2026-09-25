# Writing a Plugin

## 1. Define the Contract

Add or extend protobuf APIs under `proto/<package>/v1/`. Regenerate bindings:

```powershell
buf generate
```

Keep request/response fields backward-compatible and document state transitions.

## 2. Start a gRPC Server

Bind a loopback address, add the generated service implementation, and register
with Core only after the server is ready.

## 3. Register Capabilities

Use stable capability names. Core and other plugins use these names for service
discovery; do not derive them from display labels.

## 4. Add Settings

Contribute declarative settings fields during registration. Treat secrets as
local runtime values and validate them before use.

## 5. Add UI Through a Patch

Place a JSON patch in the plugin-owned UI patch directory with `plugin` set to
the exact registered plugin name. Do not hardcode plugin pages into the WebUI.

### 5a. Native Vue page (`module`)

Router ops may load a **plugin-owned ESM bundle** instead of a built-in
component or iframe:

```json
{
  "target": "router",
  "op": "insert",
  "id": "my-plugin",
  "item": {
    "id": "my-plugin",
    "path": "/my-plugin",
    "name": "my-plugin",
    "module": "/api/plugins/my-plugin/ui/index.js",
    "title": "My Plugin"
  }
}
```

Priority: `module` → `component` (built-in whitelist) → `src` (iframe).

| Piece | Contract |
|-------|----------|
| Source layout | `plugin-web/{name}/` (see `plugin-web/README.md`) |
| Build output | `${CORE_DATA_DIR}/plugin-ui/{name}/` |
| HTTP | `GET /api/plugins/{name}/ui/{path…}` (404 if plugin disabled) |
| Entry export | `export default` Vue component (`setup` → render fn) |
| Vue import | Bare `import { h, ref, … } from 'vue'` via WebUI importmap → host bridge (`window.__0KAY_VUE__`) |
| Forbidden imports | Host `vue-router`, pinia, vue-i18n, private stores |
| API | Same-origin `fetch('/api/…')` |
| Cache | Entry `no-cache`; hashed `*-*.{js,css}` immutable |
| Example | `plugin-web/skillsguishow/` → builds to `core/data/plugin-ui/skillsguishow/`; patch `core/data/ui/skillsguishow.patch` |

Set `plugin` on the `.patch` file so disable/capability filtering applies
(empty `plugin` always shows the nav entry).

## 6. Heartbeat and Shutdown

Send heartbeats every 10 seconds, re-register after Core connectivity loss, and
close streams/processes on shutdown.

## 7. Test

At minimum verify:

- registration and heartbeat;
- disabled-plugin patch removal;
- settings defaults and persistence;
- service unavailable behavior;
- task cancellation and completion;
- no secrets in Git history or build artifacts;
- native UI: `npm run build` in `plugin-web/{name}`, open the route, confirm
  interactive content (reference: `webui/scripts/cdp-agents-smoke.cjs` pattern).
