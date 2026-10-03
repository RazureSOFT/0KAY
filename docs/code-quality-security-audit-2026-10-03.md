# D:\0kay 全目录代码质量与安全审计

日期：2026-10-03。方式：源码审查、现有测试、类型检查、依赖数据库扫描及无破坏性的隔离验证。

## 结论与范围

测试通过，但服务间的身份验证、敏感数据出口与资源限制仍存在实际缺口。优先修复 Agent/Core 的信任边界、LIFE 凭证返回路径、Minecraft 未鉴权入口和文件预览依赖。

本次范围是整个 `D:\0kay`，包含 umbrella 仓库及独立目录 `agent`、`mcp`、`pm`、`minecraft`、`deepseek-web`、`deepseek-tts`、`free-model`、`ZCode`。覆盖 Core/mocr/LIFE、WebUI、四个 plugin-web 包的关键入口、配置与依赖。`proto/gen` 作为接口与生成物查看；静态站点、资产、数据、第三方代码及所有业务算法未逐行审计。这里的“全目录”是跨子项目审计范围，不代表所有文件均已人工验证安全。

未修改业务源码。执行测试可能更新缓存或构建产物（MCP 测试脚本包含 tsc）。Agent 中发现已有修改和未跟踪文件，予以保留。未读取或公开真实密钥，凭证验证只使用临时数据库和假字符串。

证据等级：**复现**=隔离调用证实；**源码确认**=明确可达代码路径，未攻击运行服务；**依赖告警**=版本命中公告，不等价于业务可利用性；**待验证**=环境或部署条件未验证。

## 1. 优先问题

### H-01 Agent 无令牌时放行，直接调用可跨过 Core 权限边界

- 位置：`agent/src/connection.ts:24`，`agent/src/plugin.ts:424-523`，`agent/src/agent/agent.ts:1291-1328`。
- 证据：`authorized()` 在 `CORE_PAIR_TOKEN`、`CORE_API_TOKEN` 都未设置时返回 true。隔离调用的结果为 `missing-token-authorized: true`。
- 四个 RPC 虽调用此函数，但注册获得的插件 identity token 不会改变该判定；不能据“已注册插件”推断入站 RPC 已鉴权。
- `RunDirect` 可访问审批及管理功能；`terminal_exec` 在 `enable_terminal=true` 时直接执行命令，不要求二次审批。该设置默认 false，因此不是默认必然远程命令执行。computeruse/browser 的直接调用也依赖 Core 已做权限校验的假设。
- 默认仅回环可达；`AGENT_BIND_HOST` 可改为非回环，无强制鉴权启动检查。Compose 已设置 `0.0.0.0`，而 API token 默认可为空。
- 风险：可达该端口的调用方可绕过 Core 的用户鉴权与部分权限检查；终端启用后可达命令执行。
- 修复：入站使用专用服务令牌/mTLS，缺失即拒绝；危险直接操作在 Agent 本端复核权限；非回环启动强制安全配置。
- 验收：无 token/错误 token/仅完成插件注册均不能访问管理 RPC；正确身份仍不能绕过未授予的工具权限。

### H-02 Core 注册入口的网络信任允许身份冒用

- 位置：`core/internal/pairing/pairing.go:576-590`；`core/internal/registry/registry.go:77-93,104-125,274-323`；`core/internal/server/plugin_service.go:46-54,107-112`；`core/cmd/core/main.go:60-63`。
- 源码确认：回环/可信网络的 gRPC 请求免 token；注册口令为空时不验证注册身份；重注册相同身份会覆盖原地址；注册响应返回服务 token。权限豁免又依赖受信任插件名称。
- 前提：本机进程或可信容器网络调用方可达 Core，且未配置注册口令；属于当前网络信任模型的隔离缺口，不是任意公网免认证。
- 风险：冒用已有插件名称、替换路由、获得其服务凭证；受信任名称可能绕过 manifest API 权限表。LIFE 入站 token 也依赖这一身份发行环节。
- 修复：保留名称绑定安装记录和独立凭据，重注册证明旧身份/显式授权；不要仅凭自报名称授予平台权限。共享注册口令只能缩小攻击面，不能隔离持有该口令的插件。
- 验收：新客户端不能注册为已有受信插件，不能替换地址或取得其 token。

### H-03 LIFE 的凭证过滤可从其他出口绕过

- 位置：`life/src/life/grpc/server.py:423-434,450-451`；`life/src/life/memory/memory.py:358-373,1673-1733`。
- **已复现**：使用临时 MemorySystem 写入 `AUDIT_FAKE_SECRET`，scope 为 credential：
  - `page_facts(scope='credential')` 返回内容；RPC 将客户端传入的 scope 原样传递。
  - `reinforce_facts(fact_ids=[id])` 返回内容。
  - `adjust_importance(id, 0)` 返回内容。
- 三条验证输出均为 true。`get_fact`、默认列表和导出已有过滤，不能代表所有响应已过滤。
- 前提：拥有管理 RPC 访问权；或者处于 `LIFE_REQUIRE_AUTH=auto` 且尚无 token 的回环服务状态。后两条还需已知 ID，第一条不需要。
- 风险：违背“credential 只通过内部显式读取”边界，管理接口可取得明文凭证。
- 修复：RPC 层禁止外部 credential scope；所有返回事实的修改 API 统一脱敏/排除凭证。内部密码检索使用独立、不可由 RPC scope 字符串模拟的接口。
- 验收：覆盖查询、分页、详情、强化、重要度修改、导出等全部出口，而非仅测试 `scope='*'`。

### H-04 Minecraft HTTP 缺省开放，事件流绕过已配置的鉴权

- 位置：`minecraft/src/index.js:16-19,80-94,126-146,164-186`。
- 源码确认：空 `MINECRAFT_TOKEN` 放行；所有 JSON 响应允许 `Access-Control-Allow-Origin: *`；`/events` 在鉴权之前建立 SSE 并发送状态/后续事件。即使配置 token，事件流仍公开。
- `/status` 返回整个 `serverSettings`，包含 `mergedConnectArgs` 使用的 `default_password` 时会回传该值。
- 前提：服务可达；浏览器跨源访问还受浏览器本地网络访问策略影响，未进行浏览器实测。
- 修复：默认拒绝无凭据的业务请求，事件流纳入鉴权，限制 Origin，状态响应仅返回非敏感字段。
- 验收：未授权的事件订阅被拒；状态输出不含密码；非受信 Origin 不能调用控制接口。

### H-05 Agent 文件预览使用有公告的 SheetJS 版本

- 位置：`plugin-web/agent/package.json:16`，`plugin-web/agent/src/FileViewer.vue:80-85`。
- `npm audit --omit=dev` 确认 xlsx 命中 GHSA-4r6h-8v6p-xvw6（原型污染）、GHSA-5pgg-2g8v-p4x9（ReDoS）。声明版本 `^0.18.5`，audit 显示无常规 npm 修复版本。
- 业务可达性：文件预览将文件字节直接交给 `XLSX.read`；HTML 后置 DOMPurify 不保护解析阶段。未制作恶意表格执行利用。
- 修复：采用经验证的已修复发行源或替换解析器；将解析放到可终止 worker，限制文件大小/解析时间。单纯更新 sanitizer 无法修复此问题。

### H-06 ZCode HTTP 启动入口缺省无鉴权（运行验证受限）

- 位置：`ZCode/packages/server/src/entry-http.ts:13-25`；`ZCode/packages/server/src/http.ts:298-346,466-470`。
- 源码确认：未设 `ZCODE_SERVER_AUTH_TOKEN` 时不安装 token 中间件，仍公开 `/ws` 和 `/api/*`；本地服务通过 ChannelServer 暴露。没有看到 WebSocket Origin 校验。
- host 缺省为 undefined 交给适配器，而日志显示 localhost；不能把该日志当成回环绑定保证。实际适配器绑定行为未在本环境运行确认。
- `authRequired` 描述还读取另一环境变量 `ZCODE_SERVER_TOKEN`（http.ts:177），与真正鉴权变量不一致，容易造成“报告启用但未实施”的误判。
- 修复：监听默认明确设 127.0.0.1；外部访问强制认证；启动统一解析鉴权参数并校验；WebSocket 验证 Origin。不可只改日志。
- 状态：高风险源码发现；缺依赖，未启动服务验证或宣称远程利用成功。

## 2. 中等风险与可靠性问题

### M-01 mocr 无入站鉴权及出网限制

`mocr/cmd/mocr/main.go:37-51` 创建无拦截器 gRPC 服务；`internal/server/mocr_service.go:196-204` 接受调用方的 API key 和 BaseURL；`internal/providers/generate.go:20-28` 使用普通 dialer。可达调用方可使服务向任意 BaseURL 发起模型格式请求；没有复用 Core 的 netguard。默认回环、Compose 容器内全网卡。此路径不会凭空取得用户已有 API key，因为请求要自带 key。应认证调用方并在拨号/重定向处验证目标；本地模型用明确允许列表兼容。

### M-02 LIFE 默认 auto 模式仍有未认证窗口

`life/src/life/grpc/auth.py:188-211` 在无 token 的 auto 模式放行；`server.py:751-760` 先启动监听，再启动注册后台任务。Core 注册失败时窗口可能持续，不只是正常启动的短暂时间。应在就绪前拒绝业务 RPC，仅开放必要健康检查，或默认强制认证。

### M-03 LIFE SSRF 检查未绑定实际连接的 IP

`life/src/life/tools/tools.py:22-64` 先 getaddrinfo 校验，再返回原 hostname/URL；httpx、IMAP/SMTP 建连时仍自行解析。DNS 重绑定存在检查与使用间隙。另在异步请求路径同步 DNS 可能阻塞事件循环。应让 transport 使用已验证地址，保持 TLS SNI/证书主机验证，并逐跳验证重定向。静态路径确认，未运行 DNS 重绑定攻击。

### M-04 RSS 在体积校验前已完整下载

`life/src/life/content.py:105-113,124` 使用 `await client.get` 及 `response.text`，之后才进入 parse_feed 的体积检查。大响应可先消耗内存；读取超时不是总大小限制。应流式累计解压后字节数，到限立即终止。

### M-05 邮件 TLS 验证与明文 IMAP

`life/src/life/tools/tools.py:135-137,168,178,215,225` 使用 IMAP4_SSL/SMTP_SSL/starttls 而未显式传入验证上下文；应针对目标 Python 版本确认标准库默认上下文行为，并统一传入 `ssl.create_default_context()`。`mail_imap_ssl=false` 分支直接 IMAP4.login，源码明确没有 STARTTLS。禁止明文密码登录，针对不受信证书/主机名不匹配添加验收。TLS 默认行为本次未做握手实验。

### M-06 DeepSeek TTS 未鉴权、队列无界

`deepseek-tts/src/server.mjs:92-127` 未验证请求方身份，host 可配置非回环；`serial.mjs:8-17` 无限追加 promise，没有队列上限/断连取消。可达调用方可消耗账号服务与积压内存。文本和单请求体上限不能替代队列上限。应加服务鉴权、429 背压、取消及任务截止时间。独立 `deepseek-web/src/server.mjs` 的 HTTP 模式也没有客户端鉴权，但固定回环，默认 start 使用 stdio；影响限于启用 HTTP 模式时。

### Q-01 Compose 的 LIFE 监听配置不匹配

`docker-compose.yml:66-74` 指定 `LIFE_BIND_HOST=0.0.0.0`，却没有 `LIFE_ALLOW_REMOTE_BIND=1`；`life/src/life/grpc/server.py:718-725` 因此回退容器内 127.0.0.1。Core 使用 `life:50053` 无法连接。修复时同时建立鉴权配置和容器集成测试。注意：LIFE Dockerfile 的 COPY 在 umbrella build context 下是合理的，历史仅以 life/ 为根得出的“必然构建失败”不适用于当前 Compose。

### Q-02 测试覆盖与门禁不足

- 现有测试通过但未覆盖上述凭证旁路和多服务启动组合。
- Minecraft package.json 没有 test 脚本；MCP 当前只有 1 项测试；deepseek-web 仅 4 项协议辅助函数测试。
- umbrella `.github/workflows/ci.yml` 覆盖 Core/mocr/WebUI/LIFE，但没有这些独立插件及 plugin-web 文件预览的集成门禁，也未配置依赖审计步骤。
- LIFE 的 ManageCompanion 大型 action 分支混合类型转换、权限、持久化及业务调用；建议使用有类型的参数校验和独立 handler，把安全规则统一在入口和序列化出口，避免每条分支自行处理。
- ZCode 缺少 node_modules；实际 Node v26.10.0 与 mise 固定 v24.14.0 不同，本次不能给其类型/构建质量出具通过结论。

## 3. 执行结果

| 目录 | 命令/检查 | 结果 |
|---|---|---|
| life | `.venv/Scripts/python.exe -m pytest tests/ -q -p no:cacheprovider` | 715 passed，7 subtests passed，141.28 秒 |
| core | `go test ./...`；`go vet ./...` | 通过；部分测试使用 Go 缓存 |
| mocr | `go test ./...`；`go vet ./...` | 通过 |
| agent | `npm test`；本地 `tsc --noEmit` | 34 测试通过；类型检查通过 |
| webui | `npm test`；`npm run lint`；本地 `vue-tsc --noEmit` | 34 测试通过；lint/类型检查通过 |
| mcp | `npm test`（包含 build） | 1 测试通过，构建通过 |
| pm | `npm test` | 53 测试通过 |
| deepseek-web | `npm test` | 4 测试通过 |
| deepseek-tts | `npm test` | 56 测试通过 |
| free-model | `npm test` | 12 测试通过 |
| ZCode | `node scripts/check-workspace-freshness.mjs` | 工具报告基线新鲜 |
| ZCode | `pnpm typecheck`；`pnpm lint` | 失败：缺少 node_modules，找不到 tsc/oxlint |
| core | `govulncheck ./...` | 未运行成功：工具未安装 |
| life | `python -m pip_audit` | 未运行成功：pip_audit 未安装 |

依赖结果为审计时在线数据库响应。npm 是受影响包条目，pnpm 是公告条目，不能直接合并成“独立可利用漏洞总数”。仅扫描生产依赖，开发依赖另有暴露面。

| 目录 | 命令 | 结果 |
|---|---|---|
| agent | `npm audit --omit=dev --json` | 0 |
| webui | 同上 | 9：5 critical、2 high、2 low |
| minecraft | 同上 | 10：1 critical、2 high、7 moderate |
| deepseek-tts | 同上 | 0 |
| plugin-web/agent | 同上 | 4：1 high、3 moderate |
| plugin-web/life | 同上 | 0 |
| plugin-web/minecraft | 同上 | 0 |
| plugin-web/skillsguishow | 同上 | 0 |
| ZCode | `pnpm audit --prod --json` | 218：1 critical、75 high、117 moderate、25 low |

WebUI 的主要链路为 live2d-widget → opencollective → minimist/node-fetch/tmp，以及 pixi-live2d-display → gh-pages；多为工具/安装链，不能据 critical 标签宣称浏览器远程代码执行。Minecraft 主要涉及 cmake-js → axios/tar 和认证依赖 → uuid。ZCode 命中 axios、hono、node-forge、DOMPurify 等；例如 axios 1.13.6 命中 GHSA-3pq3-5fj3-cg6v，公告修复版本为 1.20.0，但该条要求 HTTP/2 路径，未验证实际启用。必须逐条确认使用条件再定业务优先级。不要自动采用 audit 推荐的破坏性降级。

ZCode 原始工具输出位于当前审计环境：`C:\Users\Administrator\.local\share\opencode\tool-output\tool_0ffe0b077001pvg2Bmy15X6idp`（非仓库文件）。

## 4. 已观察到的有效防护

- Core provider 明文导出要求机器凭据，浏览器 cookie 不算机器身份：`core/internal/gateway/providers.go:11-27`。
- Core netguard 在拨号时检查并连接已验证 IP：`core/internal/netguard/netguard.go:128-170`，比只做 URL 预检查更强。
- 主 WebUI 和 Agent Markdown 渲染使用 DOMPurify；表格 HTML 也清洗，但不能代替解析器安全。
- PM 有路径穿越/归档链接相关测试，工具链下载有 SHA256 校验；本次相关测试通过，不等于所有归档格式和资源耗尽场景均已验证。
- LIFE 已有鉴权拦截器、部分凭证过滤、逐跳 URL 检查，容器已使用非 root 用户。历史报告中的全部未鉴权描述已过时，应以本报告的条件化结论为准。

## 5. 修复顺序与剩余验证

1. 首先收紧 Agent/Core 插件注册信任链；统一入站身份验证和未就绪状态的 fail-closed 行为。
2. 统一 LIFE 敏感事实的序列化过滤；保护 Minecraft 控制和事件流；修复文件预览解析依赖。
3. 修正 Compose LIFE 监听配置，添加真实多服务启动/鉴权冒用/未授权事件订阅测试。
4. 在 ZCode 固定 Node 环境装齐依赖后运行 typecheck、lint、HTTP/WebSocket 身份测试；确认默认监听地址、token 变量及 trusted-host capability 的角色隔离。
5. 给 RSS/TTS/文档解析补充流式大小、并发、队列、取消和总时限控制；修复 DNS 检查与建连分离。
6. 按调用可达性清理依赖告警；补齐 govulncheck、pip-audit 与开发依赖审计。

未完成：全项目逐行证明、真实浏览器攻击验证、线上渗透、容器端到端启动、Go race 本地复测、全量密钥/历史提交扫描、所有第三方源码及 ZCode 各业务包深度审查。以上未执行项不是通过项。

## 6. 修复记录（2026-10-03 第二轮）

ZCode 未改动（其独立 workspace 与依赖环境不在本次范围）。

### 6.1 逐项对照

| 问题 | 修复 | 关键文件 |
|---|---|---|
| H-01 Agent 无令牌放行 | 入站 `authorized()` 改为 fail-closed：无凭据一律拒绝，接受 `pluginToken`（注册签发）/`AGENT_GRPC_TOKEN`/`CORE_PAIR_TOKEN`/`CORE_API_TOKEN` | `agent/src/connection.ts` |
| H-02 Core 注册信任 | `RegisterAuthenticated` 必须有注册口令；新增按名独立密钥 `CORE_PLUGIN_TOKEN_<NAME>`；第一方插件无独立密钥直接拒绝；builtin 名称不可被外部注册替换 | `core/internal/registry/registry.go`、`core/internal/registry/registry_permissions_test.go`、`core/internal/server/core_service.go` |
| H-03 LIFE 凭证旁路 | `page_facts`/`reinforce_facts`/`adjust_importance` 等出口排除 credential 事实，新增回归测试 | `life/src/life/memory/memory.py`、`life/src/life/tools/tools.py`、`life/tests/test_memory_scope_privacy.py` |
| H-04 Minecraft 缺省开放 | 鉴权前置到 `/events` 事件流之前；Origin 白名单；`/status` 过滤 `password/token/secret/key` 字段；新增 6 项 HTTP 边界测试与 `test` 脚本 | `minecraft/src/index.js`、`minecraft/test/http.test.mjs`、`minecraft/package.json` |
| H-05 文件预览 SheetJS | xlsx 换为维护分支 `npm:@e965/xlsx@0.20.3`，并把解析移入 worker（16 MiB 上限 + 10s 超时，`?worker&inline`） | `plugin-web/agent/package.json`、`plugin-web/agent/src/spreadsheet.worker.ts`、`plugin-web/agent/src/FileViewer.vue` |
| H-06 ZCode HTTP 鉴权 | 未处理（范围外） | — |
| M-01 mocr 无入站鉴权 | 新增 gRPC 拦截器鉴权（注册 identity / `MOCR_GRPC_TOKEN` / `CORE_API_TOKEN`），Core 侧所有 mocr 拨号带 `PerRPCCredentials`；出网拨号守卫 | `mocr/internal/server/auth.go`、`mocr/internal/providers/network.go`、`core/internal/pairing/mocr_proxy.go` |
| M-02 LIFE auto 模式窗口 | 凭据就绪前拒绝入站（注册为出站，不会死锁），测试期望 `_Aborted` | `life/src/life/grpc/auth.py`、`life/tests/test_grpc_auth.py` |
| M-03 SSRF 检查与建连分离 | 新增 `PublicHTTPTransport`（DNS 校验后 pin IP 连接，保留 Host/SNI），mocr 侧 `network.go` | `life/src/life/network.py`、`life/tests/test_network_transport.py`、`mocr/internal/providers/network.go` |
| M-04 RSS 先下载后校验 | 改为流式/带体积上限读取（内容与媒体处理收敛） | `life/src/life/content.py`、`life/src/life/media.py` |
| M-05 邮件 TLS | `SecureIMAP`/`StartTLSIMAP`/`SecureSMTP`/`StartTLSSMTP` 显式使用 `ssl.create_default_context()` 验证证书 | `life/src/life/network.py` |
| M-06 TTS 未鉴权/队列无界 | `TTS_SERVICE_TOKEN`、队列上限返回 429、AbortSignal 取消；deepseek-web HTTP 模式需 `DEEPSEEK_WEB_SERVICE_TOKEN` | `deepseek-tts/src/server.mjs`、`deepseek-tts/src/serial.mjs`、`deepseek-web/src/server.mjs`、`core/internal/gateway/tts.go` |
| Q-01 Compose 监听不匹配 | 必填 token 用 `${VAR:?...}` 强制；补 `LIFE_ALLOW_REMOTE_BIND=1`、`LIFE_REQUIRE_AUTH=1`；新增运行时变量模板 | `docker-compose.yml`、`docs/security-runtime.env.example` |
| Q-02 门禁不足 | umbrella CI 增加 plugin-web 依赖审计+构建矩阵与 LIFE `pip-audit` 步骤；为 7 个独立仓库各建 CI（install→audit→test）；Minecraft 增加测试 | `.github/workflows/ci.yml`、`agent|mcp|minecraft|pm|deepseek-tts|deepseek-web|free-model/.github/workflows/ci.yml` |

附带修复：人格缓存 / 天气缓存 / 昼夜状态改为 tmp+replace 原子写入；OneBot 日志改用 `logging_setup` 并对 URL 做脱敏（去掉 query 令牌）；Agent computeruse 增加 `doubleclick`/`scroll` 动作、串行队列防并发抢占、`runDirect` 默认拒绝、截图作为视觉 `MessagePart` 而非文本历史，并为 Windows 热键新增 `windowsKeyExpression` 解析。

### 6.2 本轮回归

| 目录/对象 | 命令 | 结果 |
|---|---|---|
| life | `pytest tests/ -q` | 720 passed，7 subtests |
| core | `go vet ./...`；`go test ./...` | 通过 |
| mocr | `go vet ./...`；`go test ./...` | 通过 |
| agent | `tsc --noEmit`；`npm test` | 通过；36 passed |
| webui | `npm run lint`；`npm test`；`npm run build` | 通过；34 passed；构建通过 |
| minecraft | `npm test` | 6 passed（新增） |
| plugin-web/agent | `npm run build` | 通过（worker 内联进单文件产物） |
| npm audit（12 个包，含 dev） | `npm audit` | 全部 0 漏洞 |
| life | `pip-audit` | No known vulnerabilities found |
| 8 份 CI YAML | pyyaml 解析 | 全部可解析 |

### 6.3 剩余限制与未验证项

- `govulncheck` 仍无法安装（`proxy.golang.org` 连接超时），Core/mocr 的 Go 依赖漏洞未扫描。
- 本机无 Docker，`docker compose config` 与容器端到端启动未验证。
- ZCode 未纳入（其独立仓库、无 node_modules，类型/lint 不能运行）。
- 浏览器端 Minecraft token 输入流程、真实浏览器 DoS/解析攻击未做人工验证。
- 独立仓库 CI 首次在 Linux 运行，可能暴露平台差异（Agent 已按 `process.platform` 跳过/调整阈值，但未在 Linux 实跑）。
- `life/src/life/engine/legacy.py` 在索引中即为 CRLF，故 `git diff --check` 会把新增行报为 trailing whitespace，属该文件既有换行风格，非本次引入。
- `life/uv.lock` 随依赖下限调整重新生成（此前未纳入版本控制），是否提交由维护者决定。
- 本机运行中的 Core（gRPC:50051）曾被 minecraft 测试临时注册；已将其 `minecraft` 插件地址恢复为默认 `http://127.0.0.1:8765`，并给测试加 `MINECRAFT_SKIP_PLUGIN=1` 防止再次污染。
