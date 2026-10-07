# 0KAY 全量 Review（含配套安卓 App）

> 审查时间：2026-10-05
> 范围：`D:\0KAY`（core / mocr / life / agent / webui / proto / plugin-web）+ `D:\0kay-app-stage`（Android 原生 Compose）
> 规模：Go ~23.6k 行、Python ~32k 行、TS ~8.2k 行、Vue/TS ~14.9k 行、Kotlin ~5.2k 行
> 方法：通读源码 + 交叉核对 Core HTTP 契约与客户端调用 + 实际执行测试

---

## 0. 实测结论（可复现）

| 组件 | 命令 | 结果 |
|---|---|---|
| Core (Go) | `go build ./...` | ✅ 通过 |
| Core (Go) | `go test ./...` | ✅ 全部包通过（gateway / pairing / server / netguard / search / update …） |
| WebUI | `npx vitest run` | ✅ 36/36 通过（5 个测试文件） |
| LIFE (Python) | `pytest tests -q`（Python 3.14） | ✅ **942 passed / 0 failed**（217s） |
| Agent (TS) | `npm test` | ⚠️ **39 通过 / 1 失败**（失败为环境耦合，见 M17） |
| Android | `gradle assembleRelease` | ❌ **未能编译**：仓库无 `gradlew`，本机无 Android SDK |
| Core 竞态检测 | `go test -race` | ❌ 不可用：`-race requires cgo`，当前工具链未启用 |

**结论：Core / WebUI / LIFE 三个主力服务都是健康的——构建干净、测试全绿（Core 全包通过、WebUI 36/36、LIFE 942/942）。Agent 有 1 个环境耦合的失败用例。Android 我无法编译，因此对它的判断全部来自逐行读码 + 与 Core HTTP 契约逐条比对，下文均标注证据位置。**

> 说明：`life` 的依赖在本机 managed Python(3.13) 里缺失且 pip 无索引，改用系统 Python 3.14（自带 pytest + tantivy）执行。

---

## 1. 创意与产品判断

### 1.1 这个项目真正独特的地方

**① 「有状态的伙伴」+「真 Agent」二合一，是一个真实的市场空位。**
市面上绝大多数 AI 伴侣 = 一个 system prompt 包着的聊天框；绝大多数 Agent 框架 = 没有持久人格的任务执行器。0KAY 把两者缝在一起，而且缝得不是表面功夫：同一个角色既能跟你说话，也能真的改文件、跑命令。

**② 情绪是一等公民的**类型化状态机**，不是提示词里的形容词。**
`emotion/emotion.py` 里 valence∈[-1,1]、arousal/connection/irritation∈[0,1]，有 delta 钳制、有自然衰减、有基于词典的评价（`lexicon.scan`），而且被三处消费：写进提示词（`_emotion_phrase`）、渲染成 WebUI/App 状态面板、影响主动消息。这是我在同类项目里少见的设计深度。

**③ 昼夜节律（circadian）是最有想象力的一块。**
`mental_energy` 0–100、hunger、health、**从 28 天交互小时分布里学出来的睡眠窗口**、被强行叫醒后的「不满窗口」、按精力给出的回复延迟倍率。角色会累、会饿、会因为被吵醒而烦躁——这是一个能产生「她今天不太想理我」这种体验的机制，而不是一句设定。

**④ 两套刻意分离的 Skill 系统**（L.I.F.E 人格技能 vs Agent 任务技能）是一个真正的架构洞见：*「怎么成为」* 与 *「怎么做」* 是两件事，混在一起就会互相污染。

**⑤ 一切皆插件 + 声明式 UI patch。**
`*.patch` 注入 nav / router / settings / status / theme，插件停用后对应页面、路由、导航整体消失。这种「UI 可热插拔」在同类自托管项目里很少见，而且实现得相当完整（`webui/src/stores/uiPatches.ts` + `core/internal/gateway/ui_patches.go`）。

**⑥ 隐私叙事是自洽的。** 默认只绑 loopback、密钥留在 Core、数据是磁盘上的明文文件、BYO API key。

### 1.2 创意上我担心的地方

**① 认知层（cognition / worldsim）是一个研究项目被焊在产品上。**
`life/src/life/cognition/` 有 15 个文件：engram、Q-learning 睡眠回放、异稳态负荷、selfhood、worldsim（68 维特征向量）、world policy 训练与 checkpoint 轮换。维护者自己的 `life-review-report-v2-addendum.md` 已经承认存在「**双实现漂移（死模块层）**」。对伴侣产品而言，这是一个用户可感知收益不明、但维护成本极高的表面积——而且其中若干机制被自己的文档记录为**单向失效**（异稳态负荷只升不降、社交 ties 只升不降）。

**风险判断**：角色的性格由一堆维护者自己都无法完全推理的机制共同决定。这是产品最大的不确定性来源。

**② 多个「单向棘轮」让角色必然收敛到固定表型。**
- `emotion.decay()` 只衰减 valence / arousal / irritation，**connection 永不衰减**（`emotion.py:27-38`）→ 联结度只会被正向互动推到 1.0 并锁死。
- 异稳态负荷只加不减 → 数周内钉死 1.0，永久 +0.3 威胁偏置。
- 社交 ties 无条件 `+0.05` → 坏互动也无法降低。

一个伴侣应当能**恢复**。现在的模型里，无论你怎么对待它，它都趋向同一个终局。这是我在「创意层」最想提的一条。

**③ 主动消息是情感钩子，但它太脆弱了。**
一次投递要同时满足：未睡眠 + irritation<0.7 + candidate 窗口（preferred_at/best_until/expires_at 三重）+ 每日/每目标配额 + 免打扰时段 + 客户端 2.5–4s 轮询。维护者自己的 P0（valence 量纲错误）曾**静默封死全部主动触达**。虽然已修（我已复核 `engine/legacy.py:3147-3158` 阈值已重标定、`or 0.5` 已移除），但这么多独立条件叠加、且没有任何「为什么她没来找我」的诊断面，意味着静默失败的概率依然很高。

**④ 审批门保护的强度与它的 UX 不匹配。**
对话框只展示工具名 + 被截断到 500/400 字符的参数（`ApprovalOverlay.kt:90`、`TasksScreen.kt:88`），没有风险解释、没有「本次会话内允许」、文件写入没有 diff 预览。同时 `write` / `edit` / `apply_patch` **默认就在自动放行名单里**（`agent/src/agent/agent.ts:72-73`）——所以 README 那句「File edits, shell, web and desktop control, behind an approval gate」是**不准确的**：文件编辑默认不过审批门。这是招牌特性上的承诺与行为不一致。

**⑤ 安卓端用 30 个屏重写了同一套 HTTP API，却只有一个 34 行的解析测试。**
WebUI 有 36 个测试，App 有 2 个。契约漂移已经发生了（见 §3 的 M6/M7/H3/H4）。

---

## 2. 逻辑与架构

### 2.1 做得对的地方

- **Core 是唯一真相源**，浏览器不直连插件，插件只暴露 gRPC。边界干净。
- **两级凭据模型**：设备 token / API token 过门禁；PIN 只用于敏感操作二次确认；机器凭据豁免 PIN。设计清晰，PIN 用 bcrypt(cost 10)、cookie 只存 SHA-256、`HttpOnly + SameSite=Strict`、`crypto/rand` 32 字节。
- **审批管理器是 fail-closed 的**：超时（10 分钟）拒绝、拒绝即抛错、abort 感知、决议绑定 executor（`agent/src/task/approvals.ts`）。这是安全关键路径上少见的正确写法。
- **mocr 重试策略克制且正确**：只重试 429/408/409/425/5xx 与网络类错误（`retry.go:13-41`），指数退避上限 5s，**且一旦已经吐出过内容就拒绝重试**（`mocr_service.go:345,370`）——避免了重复输出。这个细节很多人会写错。
- **LIFE 的持久化是成熟工程**：到处 tmp + `os.replace` 原子写；SQLite 刻意用 `journal_mode=PERSIST` 并在注释里说明为什么不用 WAL（避免 `-wal`/`-shm` sidecar 爆炸）；audit / ledger / observations 都有保留期与硬上限；专门有 `timeutil.py` 处理 naive/aware datetime 混用的历史坑。
- **WebUI 用 fetch + ReadableStream 而非 EventSource** 做 SSE（`stores/chat.ts:401-427`），因此能带 Authorization 头并用 AbortController 取消——比 EventSource 正确。
- **Markdown 渲染有 DOMPurify**（`MarkdownContent.vue:4-6`），且全仓只有一处 `v-html`。XSS 面收得住。
- **文档完整度高**：README 引用的 10 个文档全部存在。这在自托管项目里不常见。

### 2.2 结构性问题

**L1. `handleLifeChat` 把所有调用方硬编码成 `AdapterType: "webui"`。**
`core/internal/gateway/gateway.go:901`：`AdapterType: "webui"` 是常量。安卓端发的是 `session_id="app:<uuid>"`（`ChatStore.kt:160`），但注册到 LIFE 侧的身份是 webui。**会话身份与适配器身份不一致**——任何按 adapter 类型分支的逻辑都会把手机当成浏览器标签页。这是 App 与 Core 之间最根本的一处语义错配。

**L2. 主动消息候选没有过期清扫。**
`companion/legacy.py:254-280` 的 `maintenance()` 清理了 audit / relationship_ledger / group_observations / activity_observations / self_statements，**但没有 `proactive_candidates`**。`_proactive_due`（`engine/legacy.py:4953-4967`）对过期候选返回 False，于是它们永远停在 `status='candidate'`。而 `snapshot()` 只返回最新 100 条候选 —— 死候选累积到一定程度会**把活候选挤出窗口**，静默掐死主动消息。仪表盘上的 `proactive_pending` 计数也会无限增长。

**L3. 两套 Skill 系统没有共享加载器。** 分离是刻意的、正确的，但 markdown 约定（`# name` + `tags:` + 描述）在两处各自实现，格式演进时容易漂移。

**L4. 文档漂移。**
- `ARCHITECTURE.md:93` 描述的 `generateOffline` 函数**不存在**；mocr 实际返回 `codes.FailedPrecondition`（`mocr_service.go:207-208,237`）。行为是诚实的（不是静默回显），但文档已过期。
- `ARCHITECTURE.md` 顶部的「旧有聊天镜像和技能预取描述」自我声明已被 `RUNTIME_CONTRACTS.md` 取代。

**L5. 对话状态有两个真相源。**
安卓端每次请求都从本地 `messages` 重建 `history`（最近 21 条，`ChatStore.kt:141-146`），而 LIFE 自己维护记忆。WebUI 则额外发 `persona` 和一个 `system` 上下文摘要（`stores/chat.ts:425`）。安卓端**两者都不发**。所以手机上的对话上下文质量明显低于浏览器，且 `resetSession()` 后本地历史与服务端记忆会短暂不一致。

---

## 3. 代码问题（按严重度排序）

### CRITICAL

**C1. 已存储的供应商 API Key 可被外泄到任意 URL（SSRF 加固挡不住，且安卓 App 直接暴露了入口）**

`core/internal/gateway/models.go:78-107`：
```go
if req.ID != "" {
    if key := g.providerStore.Secret(req.ID); key != "" {
        return key            // ← 只按 id 取明文密钥，完全不校验 base_url 归属
    }
}
```
调用点 `models.go:61`：`fetchModelsFromProvider(format, req.BaseURL, g.resolveModelAPIKey(req))` —— 拿到的密钥被当作 `Authorization: Bearer` **发往请求方自选的 `req.BaseURL`**。

- 加固只有 `netguard.Transport(netguard.Strict())`（`models.go:115`），而 `Strict()` 默认**关闭**（`netguard.go:57-63`，需显式 `CORE_SSRF_STRICT=1`），所以只挡 metadata / link-local，**公网与内网地址都可以**。
- **不需要 PIN**：`pinSatisfied`（`pin.go:532-540`）对任何 paired-device token / API token 直接放行。
- **安卓端直接暴露了这个入口**：`ProviderEditScreen.kt:130-150` 的「探测模型」按钮把 `pid` 和 `baseUrl` 一起发给 `/api/models/fetch`，两者都是可编辑输入框，`api_key` 留空即可触发服务端按 id 查库。

→ 任何一台已配对的手机，改一下 Base URL 就能把服务器上**所有已存供应商的明文密钥**送出去。

**修复**：只有在请求的 `base_url` 与该 provider 自身的 `BaseURL` 匹配时才允许用 id 解析密钥；否则只接受调用方显式传入的 key。

### HIGH

**H1. PIN 门禁漏掉多条状态变更路由** — `core/internal/pairing/pin.go:487-497`
`path == "/api/agent/sessions"` 和 `path == "/api/tasks"` 是**精确匹配**，于是：
- `DELETE /api/agent/sessions/{id}`、`PATCH /api/agent/sessions/{id}` → **删除/重命名会话（连带销毁其全部轮次）无需 PIN**
- `POST /api/agent/sessions/fork`、`POST /api/tasks/{id}/cancel`、`POST /api/chat`、`POST /api/life/chat`（主要花钱入口）、`DELETE /api/usage` 全部不在名单
- `path == "/api/tools/"` 精确匹配漏掉 `/api/tools/call`

同文件注释（`pin.go:492-496`）明确论证了为什么要门禁 `/api/agent/messages`，但 `/api/chat` 却没有同等对待 —— 这是自相矛盾。

**这是一类会反复复发的问题**：此前的 review 批次已经发现过同一清单漏掉 `/api/agent/exec`、`POST /api/agent/file`、`/api/run`、`/api/tools/call`，修完一轮之后现在又漏掉 sessions/tasks 的路径参数形式。根因是「用一长串字符串字面量维护安全清单」这种写法本身不可靠。
**修复**：改用「method + path 前缀」表匹配，并补一个**表驱动测试**遍历 `Handler()` 里注册的全部路由，断言每个写路由都被显式分类（gated / intentionally-open）——否则下次加路由还会漏。

**H2. 插件身份校验可被一个请求头绕过** — `core/internal/gateway/plugin_guard.go:140-143` + `:31-35`
```go
if looksLikePluginBrowser(r) { next.ServeHTTP(w, r); return }
```
`looksLikePluginBrowser` 对**任何带 `Origin` / `Referer` / `Sec-Fetch-Site` 的请求**返回 true。于是机器客户端只要加一个 `Referer: http://x` 就跳过 `apiRequiresIdentity` —— 插件可以调用它从未在 manifest 里声明的 API。
**修复**：用正向的机器信号（如要求 `X-0KAY-Plugin`），而不是「某个头存在」。

**H3. 安卓端：服务器托管的媒体在局域网下**永远加载不出来**
- `OkayApi` 构造 OkHttpClient 时**没有设置 CookieJar**（`OkayApi.kt:28-33`），OkHttp 默认 `NO_COOKIES`；因此 App 完全依赖 Authorization 头。
- 但 WebView（Live2D 模型）和 Coil（图片）**都不带这个头**，也没有任何 cookie 注入（全仓 grep 无 `CookieJar` / `setCookie` / `addJavascriptInterface`）。
- 而 `/api/images`、`/api/files`、`/api/live2d`、`/live2d/models/` 对非 loopback 调用方**都需要 bearer token**（`pairing.go:505-512`，且 `loginEnabled` 默认 true，`pairing.go:124`）。

后果：**（a）聊天气泡里的图片 401；（b）Live2D 形象永远加载不出模型** —— 而 Live2D 是这个 App 的招牌功能。
更糟的是，图片 URL 存的是**相对路径**（`/api/images?file=...`，`gateway.go:1569`），`pendingImages.add(resp.str("url"))` 后直接喂给 `AsyncImage(model = img)`（`ChatScreen.kt:423`）——Coil 无法解析相对 URL，**即使在 loopback 下也渲染不出来**。

**H4. 安卓端选图上传必定失败** — `ChatScreen.kt:183-192`
```kotlin
val name = (uri.lastPathSegment ?: "image.png").substringAfterLast('/')
```
Android Photo Picker 返回的 URI 形如 `content://media/picker/0/.../media/1000000034`，`lastPathSegment` 是**纯数字媒体 id，没有扩展名**。而 Core 按**扩展名**校验（`gateway.go:1540-1544`，`allowedImageExt`）→ 返回 400 `unsupported image type`。
另外 multipart 的 mime 被硬编码成 `image/png`（`ChatScreen.kt:188`），与实际格式不符。

**H5. `write`/`edit`/`apply_patch` 默认绕过审批门** — `agent/src/agent/agent.ts:72-73`
`DEFAULT_AUTO_APPROVE_TOOLS` 包含这三个文件写入工具，而 README 宣称「File edits … behind an approval gate」。要么把文件写入纳入门禁，要么修正 README。现状下 Agent 可以在**没有任何人工确认**的情况下覆盖任意文件。

### MEDIUM

| 编号 | 位置 | 问题 |
|---|---|---|
| M1 | `core/internal/gateway/gateway.go:617-631`、`:643` | `disabled_plugins.json` 非原子写（无 tmp+rename）、错误被吞、权限 0644；**文件损坏时静默把所有已停用插件重新启用** |
| M2 | `core/internal/registry/registry.go:141` | `CORE_PLUGIN_REGISTRATION_TOKEN` 未设置时，能连上 :50051 的任何人都可注册插件并拿到服务 token（应 fail closed） |
| M3 | `core/internal/pairing/pairing.go:423-439` | 只存一个 `pinSessionHash`，**每次 PIN 登录都会踢掉其它浏览器会话** —— 安卓 App 与 WebUI 无法在 PIN 模式下共存 |
| M4 | `gateway.go:1137`、`agent_context.go:95`、`task_callbacks.go:49-66` | 无界 goroutine：每个 WS 帧一个、每个 turn 一个 `autoCompactAsync`、`retryCallbacks` 的 ticker 循环**永不终止** |
| M5 | `webui`/Android `SectionScreen.kt:68,142-146` | 设置分区把每个值当字符串回传：对象/数组型设置会被 `toString()` 后写回（**损坏**），且任何「看起来像数字」的文本字段会被转成 JSON number |
| M6 | `MemoryScreen` vs `gateway.go:1411` | Core 返回 `stats.shortTerm = {"total":N}`（对象），App 用 `int("shortTerm")` 读 → **「短期」永远显示 0** |
| M7 | `StatusScreen.kt:82` | `mentalEnergy` 量纲是 **0–100**（WebUI `life.ts:37` 用 `ref(100)`），App 却 `coerceIn(0.0,1.0)` → **精力条永远 100%** |
| M8 | `life/src/life/companion/legacy.py:254-280` | `proactive_candidates` 无过期清扫 → 无界增长 + 挤占 top-100 快照（见 L2） |
| M9 | `companion/legacy.py:438` | `preferred_at` 未走 `timeutil.parse_utc` 归一化，带 `+08:00` 的时间戳被原样落库；目前只因为 `_proactive_due` 二次归一化才没炸（`engine/legacy.py:4955-4960`） |
| M10 | `life/src/life/circadian/circadian.py:231-238` | `load()` 只捕获 `FileNotFoundError`；一个损坏/手工编辑过的 `circadian.json` 会让启动直接抛异常 —— 而产品卖点正是「数据是你自己的明文文件」 |
| M11 | 全 `life/src` | 43 处 `except …: pass` 静默吞异常；`engine/legacy.py:4206` 只剥掉 `"Z"`，`+08:00` 偏移被保留 |
| M12 | `MainActivity.kt:78-85` + `AndroidManifest.xml:11,16,32` | `0kay://pair?url=...` 深链**无任何确认**即可重配服务器（任意 App/网页可劫持到攻击者服务器并注入 token/PIN）；`allowBackup="true"` 让含 token+PIN 的 DataStore 进入自动备份；`usesCleartextTraffic="true"` 全局允许明文 |
| M13 | `app/build.gradle.kts:22-27` | release 构建 `isMinifyEnabled = false` 且用 **debug keystore** 签名 → 更新包无任何完整性保证 |
| M14 | `ApprovalOverlay.kt:90`、`TasksScreen.kt:88` | 审批参数被截断到 500/400 字符 —— 人在批准一条自己看不全的命令 |
| M15 | `ChatScreen.kt:162-168` | 离开聊天 Tab 会 `cancelStream()`，**静默掐断正在流式输出的回复**（底栏用 `saveState`，切 Tab 必然 dispose） |
| M16 | `ChatScreen.kt:185,195`、`CompanionScreen.kt:95` | 上传前 `readBytes()` 整文件进内存，无大小上限 → 大附件/大模型 OOM（服务端上限 64MB / 512MB） |
| M17 | `agent/src/regression.test.ts`（research 用例） | `npm test` **不是自洽的**：用例 shell 调用环境里的 `python -m life.tools.research`，需要 LIFE 的 Python 依赖已安装 → 干净环境必失败。同时也是生产隐患：宿主机缺这些 Python 依赖时，Agent 的绘图/调研工具在运行时直接坏掉 |
| M18 | `.github/workflows/android.yml:6,33-36` | CI **只跑 `assembleRelease`，从不跑 `gradle test`**，且不响应根目录 Gradle 文件变更 → 那个唯一守护 App↔Core 解析契约的测试是死代码 |
| M19 | `life/`、`webui/scripts/`、`core/data/plugin-ui/` | 仓库卫生：**7 份内部 review/backlog 文档已提交**（`life-review-report.md`、`-v2`、`-v2-addendum`、`life-backlog.md`、`life-wiring-*.md`、`life-toward-a-person.md`）；24 个一次性 `cdp-*.cjs`/`check-*.cjs` 脚本；提交了 `scripts/skills-ui.png`；**`core/data/plugin-ui/` 下有 17 个被 git 跟踪的构建产物，共 4.5MB**，其中 `agent/index.js` 单文件 **3.2MB** minified bundle —— 任何 plugin-web 源码改动都会产生数万行 diff 噪声（维护者此前已注意过，`b6bf246`/`4085497` 只部分处理了 `assets/`） |
| M20 | `.env` | `CORE_API_TOKEN` == `MOCR_GRPC_TOKEN` 复用同一密钥 —— 一处泄露同时拿到对外的 API 与模型服务。（`.env` 本身已被 gitignore，未入库 ✅） |
| M21 | `MiscScreens.kt:175` vs `app/build.gradle.kts:17` | 关于页硬编码版本 `0.2.0`，实际 `versionName = "0.3.0"` |
| M22 | `LoginScreen.kt:58` | 默认服务器地址硬编码开发机内网 IP `http://192.168.1.15:8080` |
| M23 | `ScanScreen.kt:89-96` | 扫码后**先落盘再探活**，连接失败时 App 已被指向坏服务器且不回滚 |
| M24 | `Server.kt:107-127,197-206`、`ChatScreen.kt:132-139`、`StatusScreen.kt:57-68` | 4 条常驻轮询（主动消息 4s、收件箱 2.5s、computeruse 5s、状态 5s），无退避、后台不停 → 移动端耗电；且这些 `while(true)` 循环无取消路径 |

### LOW

- **代码块在 App 里是不可读的**：`MarkdownText` 把代码画在 `Color(0xFF0A0F22)`（近黑）上，文字却用 `TextMain = #211D2A`（深灰）→ 对比度约 1.2:1（`Common.kt:396-407,464`）。App 还完全没有暗色主题（`Theme.kt:47` 只有 `lightColorScheme`）。
- **`MarkdownText` 会吞掉代码块后的第一行**：`Common.kt:390` 跳收尾围栏后又在外层 `:432` 再 `i++` → 双重自增。
- `Notifier.kt:36-42` 通知没有 `PendingIntent`，点击无反应。
- `circadian.py:69-77` `tick(seconds)` **忽略了自己的参数**；`should_auto_sleep()`（`:158-161`）与 `tick` 内的判断（`:106`）重复了同一谓词，容易分叉。
- `ARCHITECTURE.md:93` 引用不存在的 `generateOffline`。
- `CompanionScreen.kt:165-171` 的 `relPath` 只取最后两段路径，深层嵌套的 Live2D 模型会传错；`delete("/api/live2d/$id")` 未对含 `/` 的 id 做 URL 编码。
- `ChatStore.kt:138,148,152` 用 `System.currentTimeMillis()` 生成消息 id，同一毫秒内两条消息会撞 LazyColumn 的 key。
- `Server.kt:113-122`：ack 失败时 `proactive` 列表会累积重复 id（ChatScreen 侧有去重，列表本身无）。
- `webui/src/stores/chat.ts:459-465`：SSE 解析假定 `data:` 单行；多行 data 字段会被静默丢弃（当前 JSON 转义换行，实际安全，但脆弱）。
- `emotion.decay()` 不衰减 `connection`（见 §1.2②）。

---

## 4. 建议的修复顺序

**第一批（安全，建议立即）**
1. **C1** — `/api/models/fetch` 的密钥解析加上 base_url 归属校验。
2. **H1** — `sensitiveRequest` 改成 method + 前缀表匹配。
3. **H2** — 插件身份校验换成正向信号。
4. **M2** — 注册 token 未配置时 fail closed。
5. **H5** — 把文件写入纳入审批门，或修正 README 的承诺。

**第二批（App 可用性 —— 现在的 App 有几处招牌功能是坏的）**
6. **H3 / H4** — 给 WebView 与 Coil 加认证（自定义 `ImageLoader` 注入 Authorization 头 + WebView cookie 注入或带 token 的 URL）；图片 URL 存绝对值；选图时从 `contentResolver.getType()` 推导扩展名。
7. **M6 / M7** — 修正 `shortTerm` 与 `mentalEnergy` 的量纲/结构解析。
8. **M15 / M23 / M24** — 切 Tab 不掐流、先探活再落盘、轮询加退避与前台感知。

**第三批（结构性）**
9. **L1** — 让 `handleLifeChat` 接受并透传真实的 adapter 类型。
10. **M8 / L2** — `maintenance()` 增加 `proactive_candidates` 过期清扫。
11. **M5** — 设置分区改为按字段类型回传，避免对象值被字符串化损坏。
12. **M10 / M11** — LIFE 的持久化加载改为「损坏则降级 + 告警」，而不是抛异常/静默吞。

**第四批（卫生与可信度）**
13. **M19** — 把 7 份内部 review 文档与 24 个一次性脚本移出仓库（或归档到 `docs/internal/`）。
14. **M17 / M18** — 让 `npm test` 自洽（跳过或 mock 需要 Python 的用例）；Android CI 加 `gradle test`。
15. **M21 / M22** — 版本号与默认地址改为从构建配置读取。
16. 修复代码块配色与 `MarkdownText` 的丢行（`Common.kt`），这直接影响聊天观感。

---

## 5. 一句话总评

**这是一个工程完成度明显高于同类自托管项目的作品** —— Core 构建干净、测试全绿，LIFE 的持久化与 mocr 的重试策略都体现了成熟的工程判断，UI patch 与插件生命周期设计得相当漂亮，文档也齐全。

**它目前最大的风险不在"能不能跑"，而在三处错位：**
1. **安全承诺与实现的错位** —— 招牌特性「审批门」默认放行文件写入，而 `/api/models/fetch` 会把明文密钥送往调用方指定的 URL，且这条路径由配套 App 的一个普通按钮直接暴露；
2. **产品承诺与实现的错位** —— 配套 App 的 Live2D 形象与聊天图片在局域网部署下根本加载不出来，而 Live2D 正是它的卖点；
3. **创意野心与可维护性的错位** —— 认知层有真实的学术野心，但它既不在关键路径上，又带着若干「单向棘轮」，让角色性格收敛到与用户无关的固定表型。

前两处是可以在一两周内收敛的工程问题。第三处是产品决策：**要么把认知层做成真正影响对话的、可观测、可恢复的机制，要么诚实地把它降级为一个可选的实验模块。**
