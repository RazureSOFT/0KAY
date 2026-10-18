# API 开发套件（devkit）

面向运行中的 **0kay Core** 的轻量客户端，覆盖 **Python / Node / Go / Rust / Java**。
每种客户端都会在运行时解析 Core 端口，自动发现接口面
（`/health`、`/api/plugins`、`/api/settings/sections`），并暴露成可调用对象：

```python
okay.get_plugin("agent").is_enabled   # -> True / False
okay.get_core().plugins               # -> 6
```

## 下载

| 语言 | 产物 | 安装 |
|---|---|---|
| Python | [okay-devkit-python.zip](assets/devkit/okay-devkit-python.zip) | 解压后 `pip install .` |
| Node | [0kay-devkit-0.1.0.tgz](assets/devkit/0kay-devkit-0.1.0.tgz) | `npm install ./0kay-devkit-0.1.0.tgz` |
| Go | [okay-devkit-go.zip](assets/devkit/okay-devkit-go.zip) | 模块 `okaydevkit`，解压后 `replace` 或 vendor |
| Rust | [okay-devkit-0.1.0.crate](assets/devkit/okay-devkit-0.1.0.crate) | `cargo add --path <解压目录>` |
| Java | [okay-devkit-java.jar](assets/devkit/okay-devkit-java.jar) | `javac -cp okay-devkit-java.jar ...` |

产物由 `bash devkit/build.sh` 重新生成，位于 `devkit/dist/`。源码与示例见
[`devkit/`](../devkit/README.md)。

## 用法

### Python（仅标准库）

```python
from okay_devkit import Okay

ok = Okay()                      # 不知道端口时会提示 "0kay Core port [8080]:"
ok.get_core().healthy            # 6
ok.get_plugin("agent").is_enabled
```

### Node（22+）

```js
import { Okay } from '@0kay/devkit'

const ok = new Okay({ port: 8080 })
;(await ok.getPlugin('agent')).isEnabled
```

### Go

```go
import "okaydevkit"

ok := okaydevkit.New(0)
plugin, _ := ok.GetPlugin("agent")
plugin.IsEnabled()
```

### Rust

```rust
let okay = okay_devkit::Okay::new(None);
let plugin = okay.get_plugin("agent")?.unwrap();
plugin.is_enabled();
```

### Java（JDK 11+）

```java
Okay okay = new OkayDevkit.Okay(null);
Plugin plugin = okay.getPlugin("agent");
plugin.isEnabled();
```

## 端口解析

1. `port` / `baseUrl` 参数
2. `CORE_HTTP` 或 `CORE_HTTP_ADDR`
3. `OKAY_CORE_PORT`
4. Python / Node CLI 会交互提示，否则默认 `8080`

## 自动发现的内容

| 调用 | Core 路由 |
|---|---|
| `getCore()` / `health` | `GET /health` |
| `plugins` / `getPlugin(key)` | `GET /api/plugins` |
| `settingsSections` | `GET /api/settings/sections` |
| `get(path)` | 任意 Core 路由 |

`getPlugin(key)` 按 `plugin_id` 或 `name`（大小写不敏感）匹配。
