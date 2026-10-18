# API devkit

Tiny clients for the running **0kay Core** — in **Python, Node, Go, Rust and
Java**. Each client resolves the Core port at runtime, discovers the live surface
(`/health`, `/api/plugins`, `/api/settings/sections`), and exposes it as callable
objects:

```python
okay.get_plugin("agent").is_enabled   # -> True / False
okay.get_core().plugins               # -> 6
```

## Downloads

| Language | Artifact | Install |
|---|---|---|
| Python | [okay-devkit-python.zip](assets/devkit/okay-devkit-python.zip) | unzip, then `pip install .` |
| Node | [0kay-devkit-0.1.0.tgz](assets/devkit/0kay-devkit-0.1.0.tgz) | `npm install ./0kay-devkit-0.1.0.tgz` |
| Go | [okay-devkit-go.zip](assets/devkit/okay-devkit-go.zip) | module `okaydevkit`; unzip and `replace` / vendor |
| Rust | [okay-devkit-0.1.0.crate](assets/devkit/okay-devkit-0.1.0.crate) | `cargo add --path <unpacked>` |
| Java | [okay-devkit-java.jar](assets/devkit/okay-devkit-java.jar) | `javac -cp okay-devkit-java.jar ...` |

Artifacts are rebuilt with `bash devkit/build.sh` and live in `devkit/dist/`.
Source and examples: [`devkit/`](../devkit/README.md).

## Usage

### Python (stdlib only)

```bash
pip install ./okay-devkit-python.zip   # or: pip install .
```

```python
from okay_devkit import Okay

ok = Okay()                      # prompts "0kay Core port [8080]:" if unknown
ok.get_core().healthy            # 6
ok.get_plugin("agent").is_enabled
ok.get("/api/models")
```

### Node (22+)

```bash
npm install ./0kay-devkit-0.1.0.tgz
```

```js
import { Okay } from '@0kay/devkit'

const ok = new Okay({ port: 8080 })
const agent = await ok.getPlugin('agent')
agent.isEnabled                  // -> boolean
await ok.get('/api/models')
```

### Go

```go
import "okaydevkit"

ok := okaydevkit.New(0)
plugin, _ := ok.GetPlugin("agent")
plugin.IsEnabled()               // -> bool
```

### Rust

```toml
[dependencies]
okay-devkit = { path = "devkit/rust" }
```

```rust
let okay = okay_devkit::Okay::new(None);
let plugin = okay.get_plugin("agent")?.unwrap();
plugin.is_enabled();
```

### Java (JDK 11+)

```java
Okay okay = new OkayDevkit.Okay(null);
Plugin plugin = okay.getPlugin("agent");
plugin.isEnabled();              // -> boolean
```

## Port resolution

1. `port` / `baseUrl` argument
2. `CORE_HTTP` or `CORE_HTTP_ADDR`
3. `OKAY_CORE_PORT`
4. interactive prompt (Python / Node CLIs), else `8080`

## What gets discovered

| Call | Core route |
|---|---|
| `getCore()` / `health` | `GET /health` |
| `plugins` / `getPlugin(key)` | `GET /api/plugins` |
| `settingsSections` | `GET /api/settings/sections` |
| `get(path)` | any Core route |

`getPlugin(key)` matches `plugin_id` or `name` (case-insensitive).
