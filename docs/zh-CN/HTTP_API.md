# HTTP API 参考

> **Language / 语言**: [English](../HTTP_API.md) · 简体中文

Core HTTP 网关的完整参考。默认基地址为 `http://127.0.0.1:8080`
（`CORE_HTTP_PORT`、`CORE_BIND_HOST`）。设置 `CORE_LAN_ENABLED=1` 后，同一组
路由会额外通过 TLS 在 `https://<host>:8443` 上提供。gRPC 插件协议见
[PLUGIN_API](../PLUGIN_API.md)。

## 1. 约定

### 认证

所有路由（包括 `/health`）都在同一道门后：

- 回环（loopback）调用方以及 `CORE_TRUSTED_NETWORKS` 网段内的调用方视为可信，
  无需凭据。
- 其他调用方必须出示以下之一：`Authorization: Bearer <token>`（配对设备令牌
  或 `CORE_API_TOKEN`），或由 `POST /api/auth/session` 签发的 HttpOnly
  `0kay_session` Cookie。
- 失败返回 `401`，带 `WWW-Authenticate: Bearer realm="0kay"` 以及 `code` 为
  `unauthenticated` 的 JSON 错误信封。
- 配置了访问 PIN 后，敏感路由还要求 PIN（`X-0kay-Pin` 请求头，或 `pin:`
  会话 Cookie）。PIN/令牌失败按客户端限速：5 次失败锁定 15 分钟，返回
  `429 too_many_attempts` 与 `Retry-After`。

`/api/auth/session` 在这道门之前运行，未认证的浏览器可以先探测是否需要凭据
并提供凭据：

| 方法 | 路径 | 用途 |
|---|---|---|
| GET, HEAD | `/api/auth/session` | `{authenticated, method, requires_auth, core_id, lan_enabled}` |
| POST | `/api/auth/session` | `{token}` → 设置 `0kay_session`（HttpOnly，SameSite=Strict，30 天）→ `{authenticated, method:"cookie", requires_auth, core_id}` |
| DELETE | `/api/auth/session` | 清除 Cookie → `{authenticated:false, method:""}` |

Cookie 的值就是 bearer 令牌本身，因此只要浏览器这一跳是加密的就会带上
`Secure`：直连 TLS，或可信对端（TLS 终结的反向代理）传入的
`X-Forwarded-Proto: https`。无法推断部署形态时可用 `CORE_COOKIE_SECURE=1|0`
强制覆盖。

插件配对回调（`/api/pairing/*`）在这道门之前处理，并应用自己的
loopback/Origin 规则。

### Host 与 Origin 校验

- DNS 重绑定防护：回环、IP 字面量与单标签主机名（如 compose 服务名 `core`）
  直接接受；其他主机必须出现在 `CORE_ALLOWED_HOSTS` / `CORE_ALLOWED_ORIGINS`
  中，或由 `pairingHostIdentity()` 上报，否则返回 `403 host_not_allowed`。
  两个变量里的条目可以是裸主机名、`host:port` 或完整 origin URL，Host 校验
  时都会归约为主机名。CORS 授权则要求 `CORE_ALLOWED_ORIGINS` 条目必须是完整
  origin（协议、主机、非默认端口），与浏览器的 Origin 头精确匹配。
- 允许的 origin：同源、`localhost`/`127.0.0.1` 各变体，以及
  `CORE_ALLOWED_ORIGINS`（逗号分隔）中列出的主机。其余 origin 返回
  `403 origin_not_allowed`。
- 允许的方法：`GET, POST, PUT, PATCH, DELETE, OPTIONS`。允许的头：
  `Content-Type, Authorization`。
- 被接受的 origin 会通过 `Access-Control-Allow-Origin`、
  `Access-Control-Allow-Credentials: true` 和 `Vary: Origin` 回显。
- `OPTIONS` 预检在令牌校验之前返回 `204` 空响应体。

### 安全相关环境变量

| 变量 | 作用 |
|---|---|
| `CORE_API_TOKEN` | 所有 `/api/*` 路由接受的共享 bearer 令牌。 |
| `CORE_PIN` | 首次运行时播种 6 位访问 PIN（否则自动生成并打印到日志）。 |
| `CORE_COOKIE_SECURE` | 强制会话 Cookie 的 `Secure` 标志开（`1`）或关（`0`）；缺省由 TLS / 可信代理的 `X-Forwarded-Proto` 推断。 |
| `CORE_TRUSTED_NETWORKS` | 逗号分隔的 CIDR，视同回环（无需逐请求凭据）。 |
| `CORE_ALLOWED_HOSTS`、`CORE_ALLOWED_ORIGINS` | Host / DNS 重绑定与 CORS 白名单。 |
| `CORE_PLUGIN_REGISTRATION_TOKEN` | 可选的共享注册密钥：每个非内置插件在 gRPC 注册时必须出示（`x-0kay-registration-token` 元数据）。 |
| `CORE_SSRF_STRICT` | `1` 时对模型拉取与插件出口代理额外封禁 loopback/RFC1918；metadata/链路本地/CGNAT 永远封禁。 |

### 错误

除 SSE 响应体（错误以 `event: error` 上报）外，所有失败使用同一信封，恒为
`application/json`：

```json
{"error": "human readable message", "code": "machine_code"}
```

`error` 保持字符串，既有的 `data?.error` 客户端不受影响。方法不匹配返回
`405` 与 `Allow`。常见 code：`bad_request`、`unauthenticated`、`forbidden`、
`not_found`、`method_not_allowed`、`section_disabled`、`upstream_error`、
`unavailable`、`host_not_allowed`、`origin_not_allowed`、`cross_site_denied`、
`machine_credential_required`（`403`，浏览器会话访问机器专用端点）、
`pin_required`、`too_many_attempts`（`429`，PIN/令牌锁定）、
`plugin_identity_required`、`api_not_permitted`。

`POST /api/usage/record` 成功时仍返回 `204` 空响应体。

### 请求细节

- JSON 请求体使用 `snake_case` 字段名与 `Content-Type: application/json`。
- 服务端按路由强制请求体上限（超限在解码前拒绝）：chat/LIFE chat 4 MB，
  直接运行类（`/api/run`、审批、提问、workspace、host、compact）64 KB，
  agent 消息 128 KB，通用小请求体（settings、providers、models、skills 删除）
  64 KB，skills POST 2 MB，tasks 2 MB，images 16 MB（每个 multipart 分片
  8 MB），files 64 MB（每分片 16 MB），live2d 上传 512 MB（每分片 32 MB）。
- 常用查询参数：`?limit=` `?query=` `?cursor=` `?incremental=1`
  `?session_id=` `?executor_id=` `?path=` `?id=` `?name=` `?values=1` `?file=`。

### 弃用

旧别名路由继续可用，并返回

```
Deprecation: true
Link: </api/usage>; rel="successor-version"
```

指向后继路由，例如 `POST /api/usage/clear` → `DELETE /api/usage`、
`POST /api/plugins/enable` → `PATCH /api/plugins/{name}`。

## 2. 健康与插件

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/health` | 健康摘要（同样经过认证门） |
| GET | `/api/plugins` | 插件注册表快照 |
| GET, PATCH | `/api/plugins/{name}` | 读取 / `{enabled: true\|false}` 启停一个插件 |
| GET | `/api/plugins/capabilities` | 能力 → 插件映射 |
| GET | `/api/plugins/installed` | 已安装组件（0kay-pm 视角） |
| GET | `/api/plugins/pm/status` | 最近一次 install/update 的进度 |
| GET | `/api/plugins/pm/check` | 全部已安装组件的更新检查 |
| GET | `/api/plugins/pm/check-plugins` | `check` 的插件别名 |
| GET | `/api/plugins/pm/installed` | `installed` 的插件别名 |
| POST | `/api/plugins/pm/install` | `{repository\|package, version?}` → 安装并启动 |
| POST | `/api/plugins/pm/uninstall` | `{package}` → 停止并移除 |
| POST | `/api/plugins/pm/update` | `{package, version?}` → 更新 |
| POST | `/api/plugins/enable` | 旧别名：启用，body `{plugin\|name}` |
| POST | `/api/plugins/disable` | 旧别名：停用（持久化到 `data/disabled_plugins.json`） |
| POST | `/api/plugins/install` | `/api/plugins/pm/install` 的旧别名 |
| GET | `/api/plugins/install/status` | `/api/plugins/pm/status` 的旧别名 |
| POST | `/api/plugins/uninstall` | `/api/plugins/pm/uninstall` 的旧别名 |
| GET, HEAD | `/api/plugins/{name}/ui/{path…}` | 插件前端 ESM/静态资源 |
| GET | `/api/state` | 平台状态快照：插件注册表、健康数、computer-use 标志（`/api/life/state` 是已弃用别名） |
| GET | `/api/messaging` | 「消息平台」页面的消息总线快照（适配器、最近路由的消息） |

```json
// GET /health
{"status": "ok", "plugins": 6, "healthy": 5}

// GET /api/plugins（数组）— plugin_id 是插件名的稳定哈希
//（内置插件同样使用哈希 id；只有 "disabled:<name>" 这类占位符是字面量）。
[{"plugin_id": "plugin_04dfb2f26c115ff43f05e6d9", "name": "agent", "version": "0.1.0",
  "type": "PLUGIN_TYPE_SERVICE", "capabilities": ["agent"],
  "status": "PLUGIN_STATUS_HEALTHY", "active_tasks": 0, "disabled": false}]

// PATCH /api/plugins/life  {"enabled": true}
// →  {"plugin": "life", "enabled": true, "ok": true}
```

### 插件 UI 资源

从 `$CORE_DATA_DIR/plugin-ui/{name}`（默认 `data/plugin-ui/{name}`）提供。

- 仅允许 `GET`/`HEAD`，否则 `405`。
- `name` 必须匹配 `[A-Za-z0-9_-]{1,64}`；路径穿越返回 `404`。
- 插件被停用 → `404 plugin disabled`。
- 内容哈希命名的分片（文件名含 `-`，扩展名 `.js`/`.css`）返回
  `Cache-Control: public, max-age=31536000, immutable`；其余为 `no-cache`。

## 3. 更新

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/update/check` | 最新 0KAY GitHub release 与当前版本对比 |
| GET | `/api/update/check-plugins` | 对每个已安装组件做同样的对比（已注册插件 + source/pm 组件） |
| POST | `/api/update/apply` | 为一个组件启动更新 |
| GET | `/api/update/status` | 最近一次更新的进度 |

```json
// GET /api/update/check
{"current": "0.1.3", "latest": "0.1.3", "has_update": false,
 "url": "https://github.com/RazureSOFT/0KAY/releases/tag/v0.1.3",
 "name": "0KAY 0.1.3", "notes": "release notes / changelog body",
 "published_at": "2026-10-01T00:00:00Z"}

// GET /api/update/check-plugins
{"plugins": [{"name": "agent", "version": "0.1.3", "latest": "0.1.3",
  "has_update": false, "repository": "https://github.com/RazureSOFT/0KAY-agent",
  "package": "@razuresoft/0kay-agent", "can_update": true}]}

// POST /api/update/apply
// {"plugin": "core"}                      → beta（同步 main）
// {"plugin": "agent", "version": "0.1.3"} → 固定版本
// → 202 Accepted
{"plugin":"core","package":"@razuresoft/0kay-core","mode":"source",
 "status":"running","started":"2026-09-26T05:42:52Z"}

// GET /api/update/status
{"plugin":"core","package":"@razuresoft/0kay-core","mode":"source",
 "status":"done","started":"2026-09-26T05:42:52Z","log":"git pull --ff-only"}
```

- 组件以 0kay-pm 安装时 `mode` 为 `pm`，否则为 `source`（git pull + 重新构建
  + 重启）。见 [Releases](RELEASES.md)。
- `check-plugins` 列出**每一个已安装组件**，不只是当前运行中的插件：已注册
  的插件服务、源码树中的平台组件（`core`、`webui`、`life`、`mocr`、`agent`、
  `mcp`、`minecraft`、`pm`）以及通过 0kay-pm 安装的第三方插件（按包名列出）。
  只要 `apply` 能处理，`can_update` 即为 true。
- `apply` 不带 `version` 时同步该组件的最新源码（或执行 `0kay-pm update`）；
  manifest 未声明启动命令的组件（如 `mcp`、`pm`）只同步/构建、不重启。
- 全局 GitHub 镜像（"plugin source"）存放在 Core 管理的 `updates` 设置节
  `github_proxy`（`GET`/`POST /api/settings/updates`）。设置后（例如
  `https://gh-proxy.com`）会作用于源码同步以及 0kay-pm 安装/更新时的 git
  命令；留空表示直连。
- `status` 取值 `idle`/`running`/`done`/`failed`。同一时刻只允许一个更新，
  第二个请求返回 `409`。未知组件返回 `400`。
- 版本比较遵循 semver。没有 release 时省略 `latest`；GitHub 不可达时平台
  检查返回 `502`，插件检查则在每个插件上给出 `error`（含
  `unknown repository`）。

## 4. Agent 会话

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/agents` | 已注册执行器、健康状态、缺失依赖 |
| GET | `/api/agent/sessions` | 会话列表（`kind == "agent_session"` 的任务） |
| POST | `/api/agent/sessions` | 创建会话，body `{title}` → `201 {session_id}` |
| PATCH | `/api/agent/sessions/{session_id}` | `{action: "archive"\|"restore"\|"rename", title?}` |
| DELETE | `/api/agent/sessions/{session_id}` | 删除会话 |
| POST | `/api/agent/sessions` | 旧别名（body 带 `{session_id, action?, title?}`），等价于上面的 PATCH/DELETE |
| GET | `/api/agent/sessions/search` | `?q=&limit=` 对会话标题与轮次文本的字面搜索 → `{matches:[{session_id,title,snippet}]}` |
| POST | `/api/agent/sessions/fork` | `{session_id}` → `201 {session_id}`（把已完成轮次复制进新的命名会话） |
| POST | `/api/agent/messages` | 向会话派发一条 prompt |
| GET, POST | `/api/agent/workspace` | GET 浏览 `?executor_id=&path=`，POST `{path,name}` 创建目录 |
| GET, POST | `/api/agent/workspaces` | dsh 风格的工作区注册表：GET `{workspaces:[…]}`，POST `{action, …}`（转发给 `workspace_admin`） |
| GET | `/api/agent/tree` | `?executor_id=&path=` 目录单层列表（`workspace_tree`） |
| GET | `/api/agent/file` | `?executor_id=&path=&offset=&limit=` 读取工作区文本文件（`workspace_read`） |
| GET | `/api/agent/file/raw` | `?path=` 以 base64 读取文件（二进制安全，`workspace_read_binary`） |
| GET | `/api/agent/file/convert` | `?path=&target=` 用 LibreOffice 转换旧版 Office 文件，如 `.doc/.ppt → pdf` |
| GET | `/api/agent/file/text` | `?path=` 尽力从旧版 Office 文件提取纯文本（`workspace_extract_text`） |
| POST | `/api/agent/file` | `{executor_id,path,content}` 写文件（`workspace_write`） |
| POST | `/api/agent/exec` | `{executor_id,command,cwd,timeout}` 执行 shell 命令（`terminal_exec`） |
| GET | `/api/agent/pick-folder` | `?executor_id=&title=` 在执行器主机上弹原生目录选择框（阻塞到选择/取消） |
| GET | `/api/agent/browser` | `?executor_id=` 浏览器状态（`browser_status`） |
| GET | `/api/agent/browser/view` | `?executor_id=` 当前页面的一帧 JPEG（`browser_view`） |
| GET | `/api/agent/browser/stream` | `?executor_id=` 页面实时 MJPEG（`multipart/x-mixed-replace; boundary=okayframe`） |
| POST | `/api/agent/browser/action` | 驱动浏览器（`browser` 工具：后退/前进/刷新/goto/…） |
| GET | `/api/agent/computeruse` | `?executor_id=` 桌面控制状态（`computeruse_status`） |
| GET | `/api/agent/computeruse/stream` | `?executor_id=` `computer` 工具运行时的桌面实时帧（MJPEG） |
| GET | `/api/agent/context` | `?session_id=&model_id=` 压缩状态 → `{summary,tokens,window,threshold,breakdown,blocks}` |
| GET | `/api/agent/context/search` | `?session_id=&q=` 对会话轮次 + 已折叠摘要的关键词搜索 |
| GET | `/api/agent/host` | `?executor_id=` 通过 `host_status` 采集实时 CPU/内存 |
| POST | `/api/agent/compact` | 通过 LIFE 压缩会话历史 |

```json
// POST /api/agent/messages（上限 128 KB）
{"session_id": "s_1", "prompt": "…", "agent_type": "code",
 "executor_id": "", "workdir": "", "model_id": "MOCR",
 "thinking_intensity": "off|low|medium|high|max|<0-100>",
 "permission_mode": "normal|full_access", "language": "zh",
 "attachments": [{"name": "notes.txt", "url": "/api/files?file=file_1.txt",
                  "mime": "text/plain", "size": 12}]}
// → 202 {"task_id": "agent-task:…", "accepted": true, "message": ""}
// 409 会话已有进行中的任务 · 404 会话不存在
```

`agent_type` 取值：`plan`（只出方案不改文件）、`work`（单遍专注执行）、
以及智能体子类型 `general`/`code`/`code_explore`/`research`/`science`
（子类型会强制启用同名技能）。`duet_mode: "1"` 开启大小模型协作：
大模型（think）定方案并写出实现提示词，小模型（output）按提示词实现。

`attachments` 是 `POST /api/files` 返回的引用。执行器主机会在任务开始前把
每个附件下载到 `<workdir>/.0kay/attachments/`，供 `read`/`glob` 工具打开。

`GET /api/agent/workspace` 与 `GET /api/agent/host` 原样返回执行器的
`RunDirect` 结果。未提供 `executor_id` 时使用第一个健康的执行器，否则返回
`503 selected executor unavailable`。

## 5. 审批与提问

`GET`/`POST /api/agent/approvals` 与 `GET`/`POST /api/agent/questions` 共用
一个处理器；路径在每个在线执行器上分别选择 `approval_list`/`approval_decide`
或 `question_list`/`question_answer`。`GET /api/agent/inbox` 把两个列表合并
成一次往返，是 WebUI 收件箱轮询的端点。

| 方法 | 路径 | Body / query |
|---|---|---|
| GET | `/api/agent/inbox` | `?session_id=` → `{approvals: [...], questions: [...]}` |
| GET | `/api/agent/approvals` | `?session_id=` → `{approvals: [...]}` |
| POST | `/api/agent/approvals` | `{executor_id, id, allow: true\|false}` → `{ok:true}` 或 `409` |
| GET | `/api/agent/questions` | `?session_id=` → `{approvals: [...]}` |
| POST | `/api/agent/questions` | `{executor_id, id, answer: "…"}` → `{ok:true}` 或 `409` |

执行器往返失败时整个请求返回 `502 upstream_error`，客户端不会静默丢失待
处理的提示。

## 6. 技能

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/skills` | 技能列表 → `{success, result: {dir, skills[]}, error}` |
| POST | `/api/skills` | 保存/覆盖 `{name, content}`（2 MB） |
| DELETE | `/api/skills/{name}` | 删除文件型技能（不存在则 `404`） |
| DELETE | `/api/skills?name=` | 路径形式的旧别名 |

通过 `RunDirect` 以 30 秒超时代理到 Agent 的 `skills_admin` 工具。

## 7. 任务

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/tasks` | `{tasks: [...]}` 全量列表 |
| GET | `/api/tasks?incremental=1&cursor=` | 自游标以来的增量 |
| POST | `/api/tasks` | 记录一个 `TaskEvent`（2 MB）→ `{ok:true}` / `409` |
| GET | `/api/tasks/events` | 任务增量的 SSE 流 |
| POST | `/api/tasks/{task_id}/cancel` | → `{success, message}` |
| POST | `/api/tasks/cancel` | 旧别名：body `{task_id}` |

`TaskEvent` 字段：`task_id`、`caller_id`、`session_id`、`parent_id`、`kind`、
`prompt`、`state`、`result`、`error`。状态：`pending`、`running`、`done`、
`failed`、`cancelled`。result 载荷请控制在 ~20 万字符以内。

SSE（`Content-Type: text/event-stream`）：

```
event: tasks
data: {"cursor":"…","added":[…],"updated":[…],"removed":[…]}

: heartbeat        （每 15 秒；轮询节拍 200 毫秒）
```

## 8. 对话与模型

### `POST /api/chat`（别名 `POST /api/mocr/generate`）

```json
{"request_id": "r1", "prompt": "hi", "stream": false,
 "session_id": "default", "model_id": "", "system_prompt": "",
 "temperature": 0.7, "max_tokens": 1024,
 "messages": [{"role": "user", "content": "hi"}]}
```

- `stream: false` → `{"request_id", "response", "error"?, "usage"?: {prompt_tokens, completion_tokens, total_tokens}}`
- `stream: true` → SSE `event: chunk` / `event: done` / `event: error`。

空 `model_id` 表示走 Core/mocr 选型（`MOCR`）；固定模型 id 可绕过选型。

Core 总是向 mocr 请求流式生成并自行聚合分片，请求里的 `stream` 只决定 HTTP
响应形态。上游失败——包括流结束却没有显式 `done`——会变成真实错误（JSON
形式返回 `502`，SSE 形式发 `event: error`），而不是静默的空回答。

### `POST /api/life/chat`

WebUI 主对话路径；把 LIFE 的 `OnUserMessage` 代理为 SSE。

```json
{"request_id": "life_1", "session_id": "webui:default", "user_id": "webui",
 "prompt": "…", "persona": {}, "history": [],
 "attachments": [{"name": "report.pdf", "url": "/api/files?file=file_2.pdf",
                  "mime": "application/pdf", "size": 1024}]}
```

`attachments`（来自 `POST /api/files`）会以 `<attachments>…</attachments>`
JSON 标记追加进 prompt。LIFE 从 Core 拉取每个文件并转成多模态模型内容——
文本内联、图片作为原生图像分片（主模型拒收图片时回退到配置的视觉模型）——
然后移除标记。存在至少一个附件时 `prompt` 可以为空。

`persona` 可包含 `customPrompt`，LIFE 会把它作为 system prompt 发给模型。
分片载荷：`{request_id, chunk, done, task_id, think_summary,
emotion: {valence, arousal, connection, irritation}, mental_energy}`。事件：
`chunk`、`done`、`error`（LIFE 离线时 `503 LIFE is unavailable`）。

### 模型目录与供应商

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/models` | `{models, all_model_ids, default_provider_id, default_model, providers}` |
| POST | `/api/models/fetch` | `{id?, provider, base_url, api_key?, format?}` → `{models, source, error}` |
| GET | `/api/providers` | 脱敏快照：去掉 `api_key`，附加 `api_key_masked` |
| POST, PUT | `/api/providers` | upsert `{provider}` 或整体替换 `{providers, default_provider_id, default_model}` |
| DELETE | `/api/providers/{id}` | 删除一个供应商 → 快照 |
| DELETE | `/api/providers/delete?id=` | 路径形式的旧别名 |
| GET | `/api/providers/credentials` | **明文**目录（旧版 `GET /api/providers` 形态），`?id=` 取单个。仅机器可调（见下） |
| GET | `/api/providers/defaults` | `{default_provider_id, default_model}` |
| POST, PUT | `/api/providers/defaults` | 设置默认值 → 回显 |
| POST | `/api/run` | `RunDirect`（60 秒）→ `{success, result, error}` |
| POST | `/api/tts` | `{"text", "voice"}` → 配置的 TTS 后端返回音频字节（Live2D 口型） |

供应商配置持久化到 `data/providers.json`。存储初始化期间返回
`503 provider store not ready`。

每个供应商行可带 `format` 字段，独立于 `provider` 预设选择线上协议：
`"openai"`（`/chat/completions`）或 `"anthropic"`（`/v1/messages`）。留空表示
*自动*——mocr 根据预设名或 `anthropic.com` 的 base_url 推断。这样 `custom`
（或任何以 OpenAI 命名的）端点也能说 Anthropic Messages 协议，例如
Claude 兼容中转。Core 把生效后的 provider 传给 mocr 和
`/api/providers/credentials`，LIFE / Agent / mocr 据此选择正确的传输；脱敏的
`/api/providers` 视图保留原始预设与 `format` 供展示。

**API key 永远不会通过 `/api/providers` 离开 Core。** 列表是脱敏的：
`api_key` 为空，`api_key_masked` 形如 `abcd************wxyz`（前 4 位 +
12 个 `*` + 后 4 位；≤8 字符的 key 全遮蔽）。upsert 时回传空或遮蔽的
`api_key` 会保留已存密钥，遮蔽值永不落盘。只有
`GET /api/providers/credentials` 返回明文，且**仅限机器调用方**：请求必须带
有效的插件身份（`X-0KAY-Plugin` + 服务令牌）或配对设备 / `CORE_API_TOKEN`
bearer。浏览器会话 Cookie 不够——即便同源也不行——所以同源的插件 WebUI
bundle 读不到 key（`403 machine_credential_required`）。跨站读取先被拒绝
（`Sec-Fetch-Site: cross-site` → `403 cross_site_denied`）。它的存在是为
仓库内的服务（LIFE / Agent / mocr）向上游转发密钥。

供应商模型拉取（`POST /api/models/fetch`）与插件出口代理
（`POST /api/net/egress`）经过 Core 的 SSRF 防护：链路本地/metadata、
CGNAT/保留段、以及（`CORE_SSRF_STRICT=1` 时）loopback/内网目标都会被拒绝，
每个重定向都会重新校验。

`POST /api/models/fetch` 在服务端解析密钥：`api_key` 为空或被遮蔽时按 `id`、
再按 `(provider, base_url)` 查找。遮蔽的 key 永远不会转发给供应商的模型端点。

### stdio 托管的供应商插件

manifest 声明了 `provider` 块的包（见 [PLUGIN_API.md](../PLUGIN_API.md)
§0.1.3），其供应商由 Core 以 stdio 子进程托管——**不占用插件端口**。Core
在启动时拉起声明的命令，以
`base_url = http://127.0.0.1:<core-http-port>/api/stdio-provider/<id><route>`
注册供应商，并通过 stdin/stdout 的换行分隔 JSON 转发每个请求。

| 方法 | 路径 | 用途 |
|---|---|---|
| GET, POST | `/api/stdio-provider/{id}/{path…}` | 代理到 stdio 托管的供应商 `id`（如 `/api/stdio-provider/opencode-free/v1/chat/completions`） |

供应商模型来自 manifest 的 `models` 列表；缺省时从子进程的
`GET <route>/models` 发现。注册在后台运行，慢子进程不会阻塞 Core 启动。
安装了声明 provider 的包之后需要重启 Core。

## 9. LIFE

| 方法 | 路径 | 用途 |
|---|---|---|
| POST | `/api/life/chat` | 对话 SSE（见上） |
| POST | `/api/life/compact` | `{session_id, history, persona}` → `{summary}`（90 秒） |
| GET | `/api/life/notifications?session_id=` | `{notifications: [...]}` |
| POST | `/api/life/notifications` | `{session_id, ids}` 确认 → `{"ok":true}` |
| GET | `/api/state`、`/api/life/state` | 聚合平台状态 |
| GET, POST, PUT | `/api/life/permissions` | 读写权限 |
| GET | `/api/life/memories?limit=&query=` | 记忆列表 + 统计 |
| GET, POST | `/api/life/companion` | 陪伴快照 / 操作 |

```json
// GET /api/state
{"source": "core", "emotion": {"valence": 0, "arousal": 0.5,
 "connection": 0.5, "irritation": 0}, "mentalEnergy": 100, "isSleeping": false,
 "activeTasks": [], "onlineAgents": 1, "totalAgents": 1, "agentIds": ["agent"],
 "pluginCount": 5, "healthyPlugins": 5, "updatedAt": "2026-09-25T…Z"}
// emotion/mentalEnergy 在 life 插件健康时由 LIFE 叠加
```

`POST /api/settings/life` 的 `screen_watch`、`computer_use`、
`report_agent_host` 键会同步进 `/api/life/permissions`。

## 10. 用量

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/usage` | `{total_tokens, by_model, by_day}` |
| POST | `/api/usage/record` | 一条用量记录（64 KB）→ `204` |
| DELETE | `/api/usage` | 清空 → `{ok: true, usage}` |
| POST | `/api/usage/clear` | `DELETE /api/usage` 的旧别名 |

`/api/usage/record` 由 mocr 调用，带
`Authorization: Bearer ${CORE_API_TOKEN}`。

## 11. 设置

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/settings/sections` | 插件贡献的设置节（停用的插件被省略） |
| GET | `/api/settings/sections?values=1` | 同上，每行额外携带 `values`（一次往返） |
| GET | `/api/settings/{id}` | `{section, values}` |
| POST, PUT | `/api/settings/{id}` | Body：扁平 values 或 `{values: {...}}` → `{section, values}` |
| POST | `/api/settings/{id}/test` | 运行该设置节的后端测试并返回样例音频（目前是固定的 TTS 样例；不可用时 `502 tts_test_failed`） |

`SetValues` 是合并语义：省略的键保持原值。被停用插件拥有的设置节返回
`403 section disabled`。见 [Settings and UI Patches](../settings-ui.md)。

## 12. 图片、文件与 Live2D

| 方法 | 路径 | 用途 |
|---|---|---|
| POST | `/api/images` | multipart `file`（16 MB）→ `{file, url}` |
| GET | `/api/images?file=` | 读取已存图片 |
| POST | `/api/files` | multipart `file`（任意类型，64 MB）→ `{file, url, name, size, mime}` |
| GET | `/api/files?file=` | 读取已存附件（文件名由服务端生成） |
| GET | `/api/live2d` | 模型列表 `[{id, label, url}]` |
| POST | `/api/live2d` | multipart 上传：files + `paths`（总计 512 MB） |
| DELETE | `/api/live2d/{path…}` | 删除模型（id 含 `/`，如 `nice/model.json`） |
| DELETE | `/api/live2d?id=` | 路径形式的旧别名 |
| GET | `/live2d/models/*` | 静态模型资源 |

## 13. UI 补丁

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/ui/patches` | 为 WebUI 展平的补丁操作 |
| POST | `/api/ui/patches` | 强制重新加载 → `{ok: true, count: n}` |

- 发现目录：`$CORE_DATA_DIR/ui`、`{cwd}/ui`、`{cwd}/../webui/patches`、
  `{cwd}/data/ui`。只读取 `*.patch`；内容为 JSON。
- `GET` 至多每 3 秒重扫一次（按时间的冷却；每次重扫读取所有 `*.patch`）。
  `POST` 与插件启停绕过冷却。
- `capability`（缺省回退 `plugin`）匹配不到任何已注册能力、或对应插件被停用
  时，该操作被丢弃。
- 目标：`nav`、`router`、`settings`、`status`、`chat`、`theme`、`bootstrap`。
  操作：`insert`、`remove`、`replace`。WebUI 每 15 秒轮询该端点。

## 14. WebSocket `/ws`

升级为 WebSocket（`CheckOrigin` 使用同一允许来源规则）。

客户端消息：

```json
{"type": "chat", "request_id": "r1", "session_id": "default",
 "prompt": "hi", "messages": [{"role": "user", "content": "hi"}]}
{"type": "ping"}
```

服务端消息：`{"type": "chunk", "request_id", "chunk", "done"}`、
`{"type": "usage", "request_id", "usage": {…}}`、
`{"type": "done", "request_id"}`、`{"type": "error", "request_id", "error"}`、
`{"type": "pong"}`。

## 15. 配对

| 方法 | 路径 | 访问 | 用途 |
|---|---|---|---|
| POST | `/api/pairing/request` | Origin 为空或 localhost | `{name}` → `{id, code, secret, expires}`（4 KB，最多 32 个待审批） |
| GET | `/api/pairing/pending` | 仅 loopback | `{requests: [...]}` |
| POST | `/api/pairing/approve` | 仅 loopback | `{id, code, allow}` → `{ok}` |
| POST | `/api/pairing/status` | 需要 `secret` | → `{approved, core_id, token, certificate, server_name}`（一次性领取） |

浏览器会话端点（`/api/auth/session`）同样在门之前运行；
见[认证](#认证)。

## 16. 服务端口与插件认证

| 服务 | 入站 | 认证 |
|---|---|---|
| Core HTTP | 8080（LAN 模式 TLS 8443） | 可信网络、`CORE_API_TOKEN`、配对设备令牌或 `0kay_session` Cookie |
| Core gRPC | 50051（LAN 模式 TLS 5443） | TLS 端口走配对；否则 loopback 明文 |
| mocr gRPC | 50052 | 无（loopback 绑定，明文） |
| LIFE gRPC | 50053 | Core 出示插件服务令牌（`authorization: Bearer <token>`；`LIFE_REQUIRE_AUTH=auto`）；loopback 绑定，明文 |
| Agent gRPC | 50054 | 每个 RPC 上 `authorization: Bearer ${CORE_PAIR_TOKEN\|\|CORE_API_TOKEN}` |
| Minecraft HTTP | 8765 | minecraft 插件的本地工具 API |
| 发现 | UDP 50050 | 配对协议 |

### 插件 → Core 的出站调用

| 插件 | 调用 | 认证 |
|---|---|---|
| mocr | `GET /api/models`、`GET /api/settings/provider`、`GET /api/providers/credentials`、`POST /api/usage/record` | `X-0KAY-Plugin: mocr` + `Authorization: Bearer <服务令牌>`（回退 `CORE_API_TOKEN`） |
| LIFE | `GET /api/settings/life`、`GET /api/providers/credentials`、`POST /api/tasks` | 插件身份（`X-0KAY-Plugin: life` + 服务令牌），否则 `CORE_PAIR_TOKEN`/`CORE_API_TOKEN` |
| Agent | `GET /api/settings/agent`、`GET /api/providers/credentials`、`POST /api/tasks` | `X-0KAY-Plugin: agent` + 服务令牌，否则 `CORE_PAIR_TOKEN`/`CORE_API_TOKEN`；TLS 走 `CORE_TLS_CA`/`CORE_TLS_NAME` |
| Minecraft | `POST /api/chat`、`POST /api/tasks` | 设置了 `CORE_API_TOKEN` 时使用 bearer |

`GET /api/providers/credentials` 每次请求都实时拉取（不缓存），供应商编辑
立即生效。

## 17. 内置搜索

Core 自带网页搜索（没有 SearXNG 插件或额外端口）；Agent 与 L.I.F.E. 调用
这些路由。三者都接受 `GET ?q=&n=`（别名 `?query=`）或
`POST {"query":"…","n":10}`，返回相同信封
`{query, results:[{title,url,snippet,engine}], errors:[…]}`。搜索失败记录在
`errors` 里（绝不抛硬 5xx）：结果偏少仍是 `200`。

| 方法 | 路径 | 用途 |
|---|---|---|
| GET, POST | `/api/search` | 网页搜索；`?engine=cnbing\|bing\|so360\|duckduckgo`（默认取 `search` 设置节） |
| GET, POST | `/api/search/papers` | 学术文献（arXiv / Crossref / OpenAlex） |
| GET, POST | `/api/search/apidocs` | API 文档（MDN / Microsoft Learn / Stack Overflow），带文档域过滤的网页兜底 |

结果按 URL 去重并按来源优先级交错；`n` 默认 10（专用后端为 8），上限 50。

## 18. 插件工具

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/tools?scope=agent\|life` | 插件工具目录 → `{tools:[{plugin,name,description,parameters,dangerous,scopes}]}` |
| POST | `/api/tools/call` | `{tool, args}`（或 `{tool, args_json, session_id, caller}`）→ 调用一个插件工具 |

相关的单一用途路由：

| 方法 | 路径 | 用途 |
|---|---|---|
| POST | `/api/tts` | `{text, voice?}` → 音频字节（`audio/*`）；TTS 不可用时 `502 tts_failed` |
| POST | `/api/settings/{id}/test` | 固定 TTS 样例（见 §11） |
| POST | `/api/net/egress` | 插件署名的出站 HTTP 代理；body `{url, method?, headers?, body?, timeout_ms?}` → `{status, headers, body}`。要求插件身份（`X-0KAY-Plugin` + 服务令牌），并执行该插件 `permissions.egress` 白名单；这是插件唯一的合规网络通道 |
