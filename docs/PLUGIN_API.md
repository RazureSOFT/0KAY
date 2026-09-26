# 0KAY 插件 API（v1）

协议源文件：`proto/{core,plugin,agent,life,mocr}/v1/*.proto`。字段类型、枚举编号和流式方向以这些文件为准；TS 使用 proto-loader，Go/Python 使用 `gen/`。

## 0. 插件包 manifest（schema 1）

每个可安装的插件或模块应提供 `manifest.json`，声明包身份、版本、构建与运行方式。
此文件由 **0kay-pm** 使用；Core 的 gRPC 注册、设置声明和 WebUI `.patch` 是独立接口，不能以 manifest 代替。

### 0.1 服务插件示例

```json
{
  "schema": 1,
  "name": "@razuresoft/0kay-agent",
  "version": "0.1.0",
  "dependencies": ["@razuresoft/0kay-mcp"],
  "requires": ["core", "mocr"],
  "install": [["npm", "ci"], ["npm", "run", "build"]],
  "start": ["node", "dist/index.js"]
}
```

| 字段 | 类型 / 必填 | 含义 |
|---|---|---|
| `schema` | number / 是 | 当前固定为 `1` |
| `name` | string / 是 | 包名；当前校验格式为 `@razuresoft/` 加小写字母、数字或连字符 |
| `version` | string / 是 | 包版本；发行版使用 SemVer，例如 `0.1.0` |
| `description` | string / 否 | 可读说明，不影响执行 |
| `install` | string[][] / 否 | 按顺序执行的安装、构建命令；每一项是一组 argv |
| `start` | string[] / 否 | 单个启动命令 argv；省略表示没有独立进程 |
| `dependencies` | string[] / 否 | 安装依赖包名，由 pm 递归安装；目前不支持版本范围表达式 |
| `requires` | string[] / 否 | 运行时依赖说明；pm 不会据此自动安装、等待服务就绪或发送注册能力 |
| `modules` | string[] / 否 | 相对仓库根目录的子 manifest 路径，用于组合包 |
| `repositories` | object[] / 否 | 外部子仓库声明，每项为 `{path, package, url}` |
| `ui` | object / 否 | 可选的插件 WebUI 构建、发布配置，见下文 |
| `ports` | object / 否 | 端口元信息，例如 Core 清单中的 `http`、`grpc` |

命令必须是非空 argv 数组，例如 `["python", "-m", "life.main"]`，不能写成整条 shell 字符串。
各参数必须是字符串，不能包含换行或 NUL；不要依赖 `&&`、管道或 shell 变量展开。
服务包命令通常以 manifest 所在目录为工作目录执行；独立 Agent 包由 pm 整理为 `agent/`、`mcp/`、`proto/` 布局后，在 `agent/` 内构建和启动。

### 0.2 组合包与子仓库

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

这是结构示例，完整模块列表以仓库根清单为准。子仓库以源码归档下载，不执行 git clone。
当前 pm 使用内置包名到仓库的映射；仅添加一个 manifest 并不会让任意第三方仓库自动成为可安装包。

pm 按 `modules` 顺序执行各子清单的 `install`，并处理子清单的 `ui`。启动组合包时并行执行直接子清单中存在的 `start`，跳过库和纯 UI 模块。
插件应自行处理依赖尚未就绪、注册重试和断线重连。

### 0.3 插件 WebUI 清单

独立构建产物可通过 `ui` 发布：

```json
{
  "schema": 1,
  "name": "@razuresoft/0kay-web-example",
  "version": "0.1.0",
  "install": [["npm", "ci"]],
  "ui": { "dir": ".", "plugin": "example", "dist": "dist", "build": [["npm", "run", "build"]] }
}
```

- `dir`：相对 manifest 目录的构建目录，默认 `.`。
- `build`：在 `dir` 中顺序执行的 argv 数组列表，在 `install` 之后执行。
- `dist`：相对构建目录的产物路径，默认 `dist`。
- `plugin`：发布目录名，仅允许字母、数字、下划线、连字符，长度 1–64；应与 UI URL 使用的插件名一致。
- 产物复制到 Core 数据目录的 `plugin-ui/<plugin>/`。

本仓库 `plugin-web/{life,agent,minecraft,skillsguishow}` 的 Vite 配置已直接输出到 `core/data/plugin-ui/<name>`，因此这些清单只需 `install`。
构建清单不代替页面路由 `.patch`；原生 Vue 模块的加载协议见 [插件开发指南](writing-a-plugin.md) 第 5a 节。

### 0.4 安装、自动启动与更新

```powershell
0kay-pm install @razuresoft/0kay@0.1.0
0kay-pm install @razuresoft/0kay-agent@0.1.0
0kay-pm update @razuresoft/0kay-agent@0.1.0
0kay-pm start @razuresoft/0kay-agent
```

- `@0.1.0`（或 `--version 0.1.0`）选择 `v0.1.0` tag 的源码归档，不是预编译二进制；仍需相应构建工具链。不指定版本时下载 `main`。
- 交互安装完整平台或相关组件时询问 Core HTTP、Core gRPC、WebUI 端口；默认 `8080`、`50051`、`3000`。可用 `--core-port`、`--core-grpc-port`、`--webui-port` 指定。
- 配置保存为安装根目录的 `runtime-env.json`，启动时传给子进程。
- 安装成功后自动执行启动命令；没有 `start` 的模块不创建进程。
- `update` 前应停止对应组件。更新保留运行配置与标准组件 `data` 目录，并留下 `.old-<id>` 旧安装副本。

### 0.5 一键更新（Settings → About）

Core 提供组件更新接口，About 页面据此显示“立即更新”（发布版）与“测试版（同步仓库）”（main 分支）：

| 方法 | 路径 | 用途 |
|---|---|---|
| GET | `/api/update/check` | 平台最新发行版与当前版本 |
| GET | `/api/update/check-plugins` | 各插件最新发行版与注册版本 |
| POST | `/api/update/apply` | 启动某个组件的更新 |
| GET | `/api/update/status` | 最近一次更新的进度 |

`POST /api/update/apply` 的 `{plugin, version?}`：`version` 省略即同步 `main`（测试版）。更新路径自动选择：

- **pm 模式**：`~/.0kay/state.json` 有该包记录时，执行分离进程的 `0kay-pm stop → update → start`。
- **源码模式**：没有 pm 记录时，对组件所在 git 仓库 `git pull --ff-only`，按 `manifest.json` 重建（跳过装依赖步骤），再按监听端口重启组件。没有 pm 包名的组件（如 minecraft）也走源码模式。

两条路径都以分离进程运行，脚本把输出写入 `$CORE_DATA_DIR/updates/apply.log` 并打印完成标记；`GET /api/update/status` 依据该文件得出 `running`/`done`/`failed`，Core 重启后状态仍可读。Windows 下更新器不弹窗。

### 0.6 版本与注册的关系

manifest 的 `name` 是包名（如 `@razuresoft/0kay-agent`），gRPC `plugin_info.name` 是服务名（如 `agent`）。
插件启动时必须自行读取版本并设置 `plugin_info.version`。Agent、LIFE、MOCR 已从各自 manifest 读取版本。
`requires` 不会自动转成注册字段：运行时仍需发送 `requires:<插件名>` 能力。
Core 在 `/api/plugins` 返回注册版本；更新检查以此版本与已知仓库的最新 GitHub Release 比较。

## 1. 注册、身份与依赖

插件连接 Core 的 `core.v1.PluginService`：

| RPC | 输入 | 输出 |
|---|---|---|
| Register | plugin_info、capabilities、address、settings_sections | success、plugin_id、message |
| Heartbeat | plugin_id、status、active_tasks、host | ok、shutdown_signal |

`plugin_info`：name、version、description、author、plugin_type（PERSONA/TOOL/SERVICE/ADAPTER）。
`address` 是 Core 可回连的地址，远端插件不能填写 localhost。
执行器能力使用 `executor:<持久化 UUID>`；依赖声明采用 `requires:<插件名>`，例如 `['agent','executor:uuid','requires:mocr']`。
注册成功不代表可被调度：缺失、不健康、被禁用或循环依赖时暂停服务发现，依赖恢复后自动可用。
建议每 10 秒心跳，30 秒未心跳标记不健康。注册 ID 稳定，不依赖启动顺序。

设置注册结构：`SettingsSection{id,label,icon,order,description,fields}`；`SettingsField{key,type,label,default_value,options,help}`，type 为 bool/number/text/select，default_value 为字符串。

## 2. Core 提供的 gRPC（core.v1.CoreService）

| RPC | 功能 |
|---|---|
| CallMocr | 模型调用；输入 request_id、caller_id、prompt、context、stream、session_id、messages、model_id、system_prompt；返回文本与用量流 |
| UseAgent | 异步派发；task_id、caller_id、prompt、agent_type、metadata；返回 accepted/task_id/message |
| CancelAgent | task_id/caller_id；取消执行，返回 success/message |
| ListAgents | include_unhealthy；返回 agents/online_count |
| RunDirect | tool、args(JSON 字符串)、session_id；返回 success/result/error |

UseAgent metadata：`session_id`、`parent_id`、`executor_id`、`workdir`、`model_id`（MOCR=自动）、`thinking_intensity`（off/low/medium/high/max 或 0–100）、`permission_mode`（normal/full_access）。
Normal 每次工具调用等待用户决定；Full access 自动执行；子 Agent 继承模式。

## 3. 插件回调服务

### agent.v1.AgentService
- ExecuteTask：task_id/prompt/agent_type/metadata → task_id/state/result/error/metadata。
- CancelTask：task_id → success/message。
- GetTaskStatus：task_id → task_id/state/result/error。
- RunDirect：tool/args/session_id → success/result/error。

任务状态：PENDING、RUNNING、DONE、FAILED、CANCELLED；不能将取消或截断当作 DONE。
RunDirect 管理操作：workspace_browse(path)、workspace_mkdir(path/name)、host_status、approval_list(session_id)、approval_decide(id/allow)，不放进模型工具列表。
`edit`/`apply_patch` 返回统一 diff（`--- a/…`、`+++ b/…`、`@@ -old +new @@`），WebUI 据此显示源文件、行号，新增绿、删除红。

### mocr.v1.MocrService
- ChooseModels：prompt/SelectionContext → think_model/output_model/reasoning。
- Generate：model_id/messages/system_prompt/max_tokens/temperature/stream/thinking/provider/base_url/api_key/tools/tool_choice → chunk/done/finish_reason/usage/thinking_content/role/tool_calls/text。
- Message：role/content/tool_call_id/tool_calls/reasoning_content。thinking 模式下每条 assistant 历史都必须带回 reasoning_content（DeepSeek 带 tools 调用时缺字段会 400）。
- 流必须带正常完成标志；网络 EOF 不表示成功。

### life.v1.LifeService
- OnUserMessage：session_id/user_id/message/adapter_type/persona_json/history_json → 回复、任务 ID、情绪、精力流。`persona_json.customPrompt` 会作为模型 system prompt 发送。
- OnTaskCompleted：task_id/state/result/error → acknowledged/response_text（幂等）。
- OnScheduledEvent：event_type → acknowledged（节律、记忆整合、空闲检查）。
- GetState：情绪、精力、睡眠、任务、权限。
- GetMemories：limit/query → memories 与分层统计。
- SetPermissions：screen_watch/computer_use/report_agent_host → ok。
- GetCompanion → JSON 快照；ManageCompanion：add_agenda、confirm_agenda、reject_agenda、complete_agenda、journal、dream、memory_maintenance、delete_memory、clear_all_memory、ack_notifications。
- CompactConversation：session_id/history_json/persona_json → ok/summary/error。
- GetNotifications：session_id → notifications；读取不删除，使用 ack_notifications 确认 IDs。

### 工具插件（minecraft 等）
`minecraft` 以 `PLUGIN_TYPE_TOOL` 注册，`capabilities=["minecraft"]`，并注册设置段（默认版本、服务器、昵称、密码、自动挂机等）。它在本地暴露 HTTP 工具 API（默认 `127.0.0.1:8765`），LIFE 通过 Core 网关调用。

## 4. HTTP 网关接口全集

逐端点的请求/响应结构、认证、错误与查询参数见 [HTTP API Reference](HTTP_API.md)。

| 路径 | 方法/用途 |
|---|---|
| /health | GET 健康与插件计数 |
| /api/plugins | GET 插件列表 |
| /api/plugins/enable、/disable | POST 启停插件 |
| /api/update/check、/check-plugins | GET 更新检查 |
| /api/update/apply | POST 启动组件更新 |
| /api/update/status | GET 最近更新进度 |
| /api/agents | GET 执行器、宿主机、缺失依赖 |
| /api/agent/sessions | GET/POST 会话；PATCH archive/restore/rename；DELETE 删除 |
| /api/agent/messages | POST session_id/prompt/agent_type 与执行选项 |
| /api/agent/workspace | GET 浏览；POST 新目录 |
| /api/agent/host | GET 实时 CPU/内存采样 |
| /api/agent/approvals、/questions | GET 待处理；POST 决策 |
| /api/agent/compact | POST session_id，生成并保存上下文摘要 |
| /api/skills | GET 列表；POST 保存；DELETE ?name= 删除 |
| /api/tasks | GET 全量/增量；POST TaskEvent |
| /api/tasks/events | GET SSE 任务增量流 |
| /api/tasks/cancel | POST task_id |
| /api/chat、/api/mocr/generate | POST 基础模型生成，支持 SSE |
| /api/life/chat | POST prompt/session_id/user_id/persona/history，SSE |
| /api/life/compact、/notifications、/state、/permissions、/memories、/companion | LIFE 功能 |
| /api/run | POST 直接工具调用 |
| /api/models、/models/fetch | 模型目录 |
| /api/providers、/delete、/defaults | 供应商配置 |
| /api/settings/sections、/settings/{id} | 设置段与取值 |
| /api/usage、/record、/clear | 用量 |
| /api/live2d、/live2d/models/* | Live2D 模型 |
| /api/images | 图片上传/读取 |
| /api/ui/patches | GET UI ops；POST 重载 |
| /api/plugins/{name}/ui/{path…} | GET 插件原生 ESM/静态资源（停用 404） |
| /ws | WebSocket 通知与传统聊天通道 |

TaskEvent：task_id/caller_id/session_id/parent_id/kind/prompt/state/result/error。结果建议 <200k 字符。
UI patch：plugin/id/enabled/patches；每个 op 指定 target、op、id、item、anchor、position。target 支持 nav/router/settings/status/chat。停用插件会过滤其 patch。

## 5. 局域网发现与配对

默认本机 HTTP 8080、gRPC 50051。`CORE_LAN_ENABLED=1` 另开 UDP 50050、HTTPS 8443、TLS gRPC 5443。
发现请求：`{"protocol":"0kay-discover-v1","nonce":"随机值"}`；响应含相同 nonce、id/name/http_port/grpc_port/fingerprint。
发现信息不等于信任。PM 固定证书指纹并要求用户确认、在 Core 本机核对配对码。

- POST /api/pairing/request {name} → id/code/secret/expires。
- GET /api/pairing/pending（仅本机）→ requests。
- POST /api/pairing/approve {id,code,allow}（仅本机）。
- POST /api/pairing/status {id,secret} → approved；允许后一次领取 token/certificate/server_name。
- 远端 HTTP 与 TLS gRPC 使用 `Authorization: Bearer <token>`。
- Agent 注册时 Core 绑定回调凭证；Agent 校验 Core 的回调 token。
- TLS gRPC 端口同时代理 mocr 服务，不必开放 mocr 到局域网。

当前 Agent 回调端口仍是带 token 的 gRPC，尚未实现回调 TLS；仅用于可信局域网，不能暴露公网。证书、token、pairing state 不提交 Git。
