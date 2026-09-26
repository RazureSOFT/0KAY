# Writing a Plugin

A plugin is a package with a `manifest.json`, an optional protobuf service and,
optionally, a WebUI surface. It registers itself with Core and owns its own
domain behavior, process and data.

## 0. Package manifest

Every installable plugin or module needs a `manifest.json` describing its name,
version, build commands and optional start command. The package manager consumes
it; Core's gRPC registration, settings and `.patch` files are separate
interfaces and cannot be replaced by the manifest. See
[Plugin API §0](PLUGIN_API.md) for every field.

Every 0kay plugin — third-party and the platform's own — sets a `tags` array
containing `0kay-plugin`:

```json
{ "tags": ["0kay-plugin"] }
```

The plugin marketplace uses this tag to list 0kay plugins; `0kay-pm` does not
require it to install a package.

After a successful install 0kay-pm runs the manifest start command automatically.
Library and UI-only modules omit `start`. The plugin must still register itself
with Core and send its manifest version as `plugin_info.version`.

## 1. Define the contract

Add or extend protobuf APIs under `proto/<package>/v1/` and regenerate bindings:

```powershell
buf generate
```

Keep request/response fields backward-compatible and document state transitions.

## 2. Start a gRPC server

Bind a loopback address, add the generated service implementation and register
with Core only after the server is ready. Read your own version from
`manifest.json` and set it on `plugin_info.version`.

## 3. Register capabilities

Use stable capability names (`agent`, `life`, `mocr`, `minecraft`, …). Core and
other plugins use them for discovery; never derive them from display labels.
Declare runtime dependencies as `requires:<plugin>`.

## 4. Add settings

Contribute declarative settings fields during registration and validate secrets
before use. See [Settings and UI Patches](settings-ui.md).

## 5. Add UI through a patch

Place a JSON patch in the plugin-owned UI patch directory with `plugin` set to
the exact registered plugin name. Never hardcode plugin pages into the WebUI.

### 5a. Native Vue page (`module`)

Router ops may load a plugin-owned ESM bundle:

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

| Piece | Contract |
|---|---|
| Source layout | `plugin-web/{name}/` (see `plugin-web/README.md`) |
| Build output | `${CORE_DATA_DIR}/plugin-ui/{name}/` |
| HTTP | `GET /api/plugins/{name}/ui/{path…}` (404 if plugin disabled) |
| Entry export | `export default` Vue component |
| Vue import | Bare `import { h, ref, … } from 'vue'` via the WebUI importmap → host bridge (`window.__0KAY_VUE__`) |
| Forbidden imports | Host `vue-router`, pinia, vue-i18n, private stores |
| API | Same-origin `fetch('/api/…')` |
| Cache | Entry `no-cache`; hashed `*-*.{js,css}` immutable |

## 6. Heartbeat and shutdown

Send heartbeats every 10 seconds, re-register after Core connectivity loss, and
close streams and child processes on shutdown.

## 7. Test

At minimum verify:

- registration and heartbeat;
- disabled-plugin patch removal;
- settings defaults and persistence;
- service-unavailable behavior;
- task cancellation and completion;
- no secrets in Git history or build artifacts;
- native UI builds (`npm run build` in `plugin-web/{name}`) and renders without
  console errors.
