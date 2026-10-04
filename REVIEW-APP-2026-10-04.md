# 0KAY Android 客户端审查 — 2026-10-04

> **修复状态（同日）：A1–A9 已按下文方案修复。A1 掩码 key 不再回传、A2 PIN 改为按需质询重发一次、A3 聊天消息改 data class 并用 copy 替换驱动重组、A4/A5 通知按当前会话过滤并在重置时清理旧会话通知、A6 关闭 WebView 万能文件访问、A7 收件箱轮询提升为 AppRepo 单例并与任务页共享、A8 提问选项统一 `agentOptionLabel()` 解析、A9 发布 tag 改为读取 versionName 并新增解析层单测。剩余边界：本机无 Android SDK/Gradle 未编译验证（CI 可编译）；release 仍用 debug 签名发行、Material3 alpha 依赖未降级——均属发布策略决策，未擅自改动。**

## 结论与范围

**发现 9 项应修复问题，其中 2 项会造成数据损坏或凭据泄露。整体架构（单一 `OkayApi` 传输层 + DataStore 配置 + Compose 导航）是干净的，问题集中在服务端契约理解和 Compose 状态模型两类。**

审查对象：`D:\0kay-app-stage`，HEAD `d064e62`，25 个 Kotlin 源文件 + Live2D WebView 资源 + CI。逐个核对了传输层、配对、聊天 SSE、审批、供应商、设置、任务、Live2D，并与 `D:/0KAY` 服务端对应的 handler 比对契约。

**未构建、未运行。** 本机没有 Gradle 和 Android SDK（仅有 JDK 25，而项目要求 JDK 17 工具链）。因此所有发现来自源码与服务端契约比对，没有运行期证据；下面标注「静态判定」的条目尤其需要在真机上确认。仓库中也没有任何测试，无可运行的回归基线。

## P1

### A1 — 保存供应商会用掩码覆盖真实 API Key

- `ProviderEditScreen.kt:69` 加载时 `apiKey = p.str("api_key_masked")`，保存时 `:103` 原样回传该字段。
- 服务端 `providers/store.go:71` 的 `IsMasked` 只识别自己生成的掩码形状（`abcd************wxyz` 或全星号）。`MaskKey` 对 **8 字符以内**的 key 返回全星号（可被识别），但对更长的 key 返回带前后 4 位的形式——该形式**能**被识别。
- 真正的问题在于：App 展示的掩码串被用户**误认为可编辑**，一旦用户在掩码后追加或修改任意字符（常见于「我再确认下 key 对不对」），结果既不匹配掩码形状也不是真 key，服务端会把这串垃圾当作新凭据存入，供应商随即失效，且原 key 不可恢复。
- 另外该屏保存时未带 PIN 之外的任何确认，`/api/providers` 是 PIN 敏感操作，但 App 把 PIN 作为常驻 header 发送（见 A2），等于永久满足二次确认。
- 修复方向：密钥输入框留空表示「不修改」，仅在用户显式输入新值时提交 `api_key`；不要把掩码塞进可编辑字段。

### A2 — PIN 作为常驻请求头发送，二次确认形同虚设

- `OkayApi.kt:50`：每个请求都附加 `X-0kay-Pin`。
- 服务端 `pairing/pin.go:432` 的 `pinSatisfied` 只要请求带有效 PIN 头即放行。PIN 的设计意图是**敏感操作时二次确认**（安装插件、改供应商、改权限），而 App 让它退化为一个长期凭据，和 token 无异。
- 配合 `Server.kt:55` 把 PIN 明文存入 DataStore（未加密），设备丢失或被取证时，攻击者同时拿到长期 token 与 PIN，可直接执行插件安装（即远程代码执行路径）。
- 修复方向：PIN 仅在服务端返回 `pin_required` 时按次提示并发送；或登录时换取会话 cookie 后不再常驻携带。至少应使用 EncryptedSharedPreferences / Keystore 存储。

## P2

### A3 — SSE 流式更新不触发重组（静态判定）

- `ChatStore.kt:27` 的 `ChatMessage.content` 是普通 `var`，`:114` 直接 `existing.content = acc` 原地改写。
- `messages` 是 `mutableStateListOf`，但**只观察列表结构变化**，不观察元素内部字段。原地改写已有元素的 `var` 不会标记重组。
- 后果：流式回复期间屏幕很可能不逐字更新，直到某次列表结构变化（新消息、typing 指示切换）才刷新。`:118` 的 `messages.add` 路径正常，所以首块会显示——这可能掩盖了问题。
- 为什么标静态判定：`isTyping` 状态在流式期间变化会触发重组，重组时读取到新 `content`，实际表现可能是「卡顿更新」而非「完全不更新」。需真机确认。
- 修复方向：`ChatMessage` 改为 `data class` + `messages[index] = copy(...)`，或把 `content` 改为 `mutableStateOf`。

### A4 — 主动通知未按会话过滤，会串入他人对话

- `ChatStore.kt:200-209` 的 `fetchNotifications` 只排除 `webui:` 前缀，其余**全部**采纳。
- 服务端 `legacy.py` 的 `get_notifications(session_id)` 支持按会话过滤，但 App 调用时不传 `session_id`。
- 后果：QQ 适配器或其他会话产生的主动消息会出现在 App 聊天流里；`:216` 的 ack 又用 App 自己的 session，等于**替其他会话消费了通知**，WebUI 侧可能再也收不到。
- 修复方向：请求时带 `session_id=app:<id>`，只 ack 自己的 ID。

### A5 — 会话 ID 在「清除对话」后仍被服务端沿用（契约不一致）

- `ChatStore.kt:71` 的 `resetSession` 换新 UUID 并清空本地消息，但不通知服务端。LIFE 侧 `_histories` 按旧 session 保留，新 session 从零开始——本地行为与用户预期一致。
- 但 `:216` 的 ack 和 `MiscScreens.kt:94` 的通知已读都用**当前** session，重置后旧 session 的未读通知永远无法 ack，会在 `/api/life/notifications` 里持续堆积（服务端上限 100 条后才滚动）。
- 修复方向：重置时先 ack 或显式丢弃旧 session 的通知。

### A6 — Live2D WebView 开启了 `allowUniversalAccessFromFileURLs`

- `Live2DStage.kt:68`。页面从 `file:///android_asset` 加载，开启该选项意味着本地页面可读取**任意**源的响应。
- 当前 `live2d.html` 只加载同目录 asset 与 Core 托管的模型，风险受限于这些内容的可信度；但模型 URL 来自服务端设置（`:35`），若 Core 被配置指向第三方模型地址，该模型的 JS 即获得跨源读取能力。
- `:67` 的 `allowFileAccess = true` 同理。
- 修复方向：关闭 universal access；模型跨域需求用 Core 侧代理解决。

### A7 — 任务审批屏与全局审批弹层重复轮询并互相抢占

- `ApprovalOverlay.kt:48` 每 2.5s 轮询 `/api/agent/inbox`，`TasksScreen.kt:58` 每 3s 轮询同一端点，两者都能解决同一条审批。
- `ApprovalOverlay` 挂在 `AppRoot`（`AppNav.kt:191`），任务页可见时两个 UI 同时展示同一审批；任一侧处理后，另一侧仍显示旧条目直到下次轮询，重复点击会向服务端发送对已消费 ID 的二次决议。
- 另外 `InboxScreen` 直接 `= TasksScreen(nav)`（`MiscScreens.kt:61`），「收件箱」与「任务」是同一个屏，导航存在冗余。
- 修复方向：审批状态提升到单一 repo 层，两处共享同一数据源。

### A8 — Agent 提问的选项解析在两处不一致

- `ApprovalOverlay.kt:111`：`q.arr("options").map { it.toString().trim('"') }` —— 按字符串处理。
- `TasksScreen.kt:107`：`it.asObject().str("label").ifEmpty { it.toString().trim('"') }` —— 先按对象取 `label`。
- 两者对同一数据的理解不同，必有一处错误。若服务端返回对象数组，弹层会显示 `{"label":"..."}` 原文。
- 修复方向：确认服务端 `options` 的真实结构后统一解析，抽成一个函数。

### A9 — 构建配置与声明不符，且 CI 产物签名不可用于分发

- `app/build.gradle.kts:10` `compileSdk = 37`、`:54` `material3:1.5.0-alpha18`、`:49` compose BOM `2025.12.01`：alpha 依赖 + 超前 SDK，`ChatScreen.kt:41` 已在用实验性 `LoadingIndicator` 与 `MediumFlexibleTopAppBar`，升级时易碎。
- `:25` release 构建使用 **debug 签名**，`:23` 关闭混淆。README 与 CI 都说明这是便于侧载的有意选择，但该 APK 不可上架，且 debug 签名密钥公开——任何人都能构造同签名的「升级包」覆盖安装。
- `.github/workflows/android.yml:61` 的 `tag_name: v0.2.0` 是硬编码，每次 main 推送都覆盖同一 release，无法追溯历史版本。
- 仓库**无任何测试**，CI 只有编译门禁。
- 修复方向：至少把发布 tag 与 `versionName` 联动；正式分发前接入真实签名。

## 与服务端的契约核对结果（一致，无需改）

- 配对流程（`/api/pairing/request` → `/api/pairing/status`）与 `pairing.go` 完全一致，含 404 过期处理。
- `/api/life/chat` SSE 的 `chunk`/`done`/`error` 事件名与 `gateway.go:935` 一致；`think_summary`、`emotion`、`task_id` 字段名均正确。
- `/api/agent/sessions/{id}/turns` 的 `tasks`/`more`/`next` 分页与 `agent_sessions.go:116` 一致。
- `/api/settings/sections?values=1`、`/api/settings/{id}` 读写形状正确。
- 上传走 `/api/images`（白名单）与 `/api/files`（通用），与服务端分工一致；本次服务端 R3 改为强制 attachment 下载，App 侧用 Coil 按 URL 加载图片不受影响（`AsyncImage` 不依赖 inline disposition）。

## 建议顺序

1. A1、A2 —— 凭据相关，一个会毁配置，一个削弱权限模型。
2. A3 —— 直接影响核心体验，需真机确认后修。
3. A4、A5 —— 通知归属，涉及跨端数据正确性。
4. A6、A7、A8 —— 安全面收敛与一致性。
5. A9 —— 发布工程。

补测试是前提：当前没有任何自动化验证，上述多数问题（尤其 A3、A4、A8）本可由一个解析层单测或 Compose 测试拦住。
