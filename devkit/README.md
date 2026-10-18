# 0kay API devkit

Tiny, dependency-free clients for the running **0kay Core** — in **Python, Node,
Go, Rust and Java**.

At runtime each client asks for the Core port (or reads it from the environment),
then **discovers** the live surface (`/health`, `/api/plugins`,
`/api/settings/sections`) and exposes it as ergonomic, callable objects:

```python
okay.get_plugin("agent").is_enabled     # -> True / False
okay.get_plugin("plugin_04df...").is_healthy
okay.get_core().plugins                 # -> 6
```

```js
(await okay.getPlugin('agent')).isEnabled   // -> true / false
(await okay.getCore()).plugins              // -> 6
```

```go
plugin, _ := ok.GetPlugin("agent")
plugin.IsEnabled()                          // -> bool
```

```rust
let plugin = okay.get_plugin("agent")?.unwrap();
plugin.is_enabled()                         // -> bool
```

```java
Plugin plugin = okay.getPlugin("agent");
plugin.isEnabled()                          // -> boolean
```

## Layout

```
devkit/
├── python/okay_devkit/   # Okay, Plugin, Core + `discover` CLI
├── node/                 # okay-devkit.mjs + discover.mjs
├── go/                   # package okaydevkit + cmd/discover
├── rust/                 # crate okay-devkit + bin/discover
├── java/                 # OkayDevkit.java (single file, no deps)
├── surface.json          # generated snapshot of the live API surface
└── README.md
```

## Quick start

### Python (stdlib only)

```bash
cd devkit/python
OKAY_CORE_PORT=8080 python -m okay_devkit.discover   # writes devkit/surface.json
OKAY_CORE_PORT=8080 python -c "from okay_devkit import Okay; print(Okay().get_core())"
```

```python
from okay_devkit import Okay

ok = Okay()                      # prompts "0kay Core port [8080]:" if unknown
ok = Okay(port=8080)
ok = Okay(base_url="http://127.0.0.1:8080")

ok.health["status"]              # "ok"
ok.get_core().healthy            # 6
ok.get_plugin("agent").is_enabled
[p.name for p in ok.plugins]
ok.get("/api/models")            # raw JSON from any route
ok.post("/api/agent/exec", {"command": "git status", "cwd": "."})
```

### Node (22+, global fetch)

```bash
OKAY_CORE_PORT=8080 node devkit/node/discover.mjs
OKAY_CORE_PORT=8080 node -e "import('./devkit/node/okay-devkit.mjs').then(async m => { const ok = new m.Okay(); console.log(await ok.getCore()) })"
```

```js
import { Okay } from './devkit/node/okay-devkit.mjs'

const ok = new Okay({ port: 8080 })      // or { baseUrl } / env OKAY_CORE_PORT
await ok.health()                        // { status: 'ok', healthy: 6, plugins: 6 }
const agent = await ok.getPlugin('agent')
agent.isEnabled                          // -> boolean
agent.isHealthy                          // -> boolean
await ok.get('/api/models')              // raw JSON
```

### Go

```bash
cd devkit/go
go build ./...
OKAY_CORE_PORT=8080 go run ./cmd/discover   # writes devkit/surface.json
```

```go
import "okaydevkit"

ok := okaydevkit.New(0)                  // 0 = resolve from env, else 8080
core, _ := ok.GetCore()                  // { Status, Healthy, Plugins }
plugin, _ := ok.GetPlugin("agent")
plugin.IsEnabled()                       // -> bool
plugins, _ := ok.Plugins()
```

### Rust

```bash
cd devkit/rust
cargo run --bin discover                 # writes devkit/surface.json
```

```rust
use okay_devkit::Okay;

let okay = Okay::new(None);              // None = resolve from env, else 8080
let core = okay.get_core()?;
let plugin = okay.get_plugin("agent")?.unwrap();
assert!(plugin.is_enabled());
```

### Java (JDK 11+, no dependencies)

```bash
cd devkit/java
javac -d out src/OkayDevkit.java
OKAY_CORE_PORT=8080 java -cp out OkayDevkit   # writes devkit/surface.json
```

```java
Okay okay = new OkayDevkit.Okay(null);   // null = resolve from env, else 8080
Core core = okay.getCore();
Plugin plugin = okay.getPlugin("agent");
boolean enabled = plugin.isEnabled();
```

## Port resolution

In order:

1. `baseUrl` / `port` argument
2. `CORE_HTTP` or `CORE_HTTP_ADDR`
3. `OKAY_CORE_PORT`
4. interactive prompt (`0kay Core port [8080]:`, Python / Node CLIs)

## What gets discovered

| Call | Core route |
|---|---|
| `health` / `getCore()` | `GET /health` |
| `plugins` / `getPlugin(key)` | `GET /api/plugins` |
| `settingsSections` | `GET /api/settings/sections` |
| `get(path)` / `post(path, body)` | any Core route |

`getPlugin(key)` matches by `plugin_id` **or** `name` (case-insensitive) and
returns `null`/`None` when absent.

## surface.json

`discover` writes a snapshot so tooling can read the surface offline:

```json
{
  "base_url": "http://127.0.0.1:8080",
  "health": { "status": "ok", "healthy": 6, "plugins": 6 },
  "plugins": [ { "plugin_id": "plugin_...", "name": "agent", "disabled": false, ... } ],
  "settings_sections": [ { "id": "mocr", "label": "模型", "fields": [ ... ] } ],
  "generated_at": "2026-10-17T12:20:00"
}
```

Re-run `discover` whenever plugins or settings change.

