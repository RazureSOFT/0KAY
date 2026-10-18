# 从 天枢 (Tianshu-harness) 借鉴到 0KAY

> 目标：把天枢在「agent 执行层」做得比我们深的地方，按 0KAY 的架构落地。
> 原则：**只借鉴思想，不搬代码**（天枢代码 Apache-2.0，但其 CVM 理论与实证文档是 CC BY-NC-ND，不可改写/摘编/商用）。
> 状态标记：`[已落地]` / `[进行中]` / `[待办]`

---

## 0. 一句话对照

天枢的核心命题是「模型何以稳定交付」——它把目标/状态/证据/权限/终止条件从对话历史里**外置**给运行时（CVM），用**确定性监督包裹概率性认知**。0KAY 的 agent 已经有 todowrite、ContextLedger、explore 子代理、审批门禁，但缺三样：**证据门禁、退化（锚点坍缩）拦截、成本/缓存的一等公民化**。

---

## 1. 交付可靠性：CVM-lite —— 证据门禁 + 运行时监督 `[进行中]`

**天枢的做法**：`deliver_task` 交付门禁（GREEN/YELLOW/RED）+ 75 个 runtime hooks 拦截退化 + 四层防线（信念宪法 → Courage Hook → Sensorium → RuntimeHookPipeline）。

**已落地（本次）**：
- `agent/src/agent/supervision.ts` —— 依赖为零的 `DeliverySupervisor`：
  - 记录每个工具调用（指纹归一化），检测**死循环**（同一调用重复 ≥3 次）；
  - 追踪**验证证据**（test / build / lint / typecheck 命令）；
  - `evaluateDelivery()` 产出 `GREEN / YELLOW / RED`（有改动但无证据 → YELLOW；重复退化 → RED）；
  - `supervisionDirective()` —— prompt 层「信念」（天枢第 1 层，零额外推理成本）。
- `agent/src/agent/supervision.test.ts` —— 8 个用例全绿。
- 接入 `agent/src/agent/agent.ts`（**行为保持，默认关闭**，用 `OKAY_EVIDENCE_GATE=1` 开启）：
  - 每轮 `executeToolCall` 后 `supervisor.recordToolCall(...)`（两处 finish 缝：`:842`/`:877`）；
  - `finish` 时经 `deliveryGate()` 在结果里追加证据报告；
  - 每轮 systemPrompt 追加 `supervisionDirective()`。

**待办**：
- `[待办]` 把门禁从「注释」升级为「软阻塞」：RED 时要求模型补证据或改策略（对标天枢的 `deliver_task` 拦截）。
- `[待办]` 把每个任务的 `DeliveryReport` 落到 `agent/src/task/records.ts`，在 WebUI 的 agent 会话页展示（对标 `/cockpit verify`）。
- `[待办]` 默认开启策略与灰度（先 warn 后 enforce）。

## 2. 成本 / 缓存：前缀缓存引擎 + token 账本 `[待办]`

**天枢的做法**：冻结前缀 + 增量附录 + Read 引用去重 + 断点续传，长会话命中率 **95–99%**；`/usage` token 账本；reasoning 强度自动降级路由；峰谷价提醒。

**0KAY 现状**：`mocr/internal/server/usage.go` 已有 usage-outbox（上报 Core）；`agent/src/context/ledger.ts` 是上下文折叠账本（不是缓存账本）；`agent.ts` 有 `trackSessionPromptTokens`。

**落地点**：
- `[待办]` 在 `mocr` 增加**前缀冻结**：对同一 `session_id` 复用稳定 system prompt 前缀，增量只追加；输出 cache-hit 指标（对标 `95–99%` 可核验）。
- `[待办]` 把 `usage.go` 的 outbox 升级为**本地 token 账本**（按 session/model 聚合 + 成本估算），在 Core 加只读接口，WebUI 加「用量」页。
- `[待办]` 在 `mocr/internal/selector`（jev 路由）加 **reasoning 强度降级**策略。
- 参照物：本项目在用 DeepSeek-V4.1-Flash，天枢「极度优化 DeepSeek V4」，其缓存/路由值得直接对标 benchmark。

## 3. 代码智能：LSP 深度集成 `[待办]`

**天枢的做法**：自研 JSON-RPC LSP 客户端接 20+ 语言，跳转定义/查引用成为 agent 工具，**编辑后诊断自动回灌**到循环。

**0KAY 现状**：`agent/src/tools/` 有 read/write/edit/glob/grep/shell，**无 LSP**；agent 改完代码只能靠跑测试发现类型错误。

**落地点**：
- `[待办]` 新增 `agent/src/tools/lsp.ts`：`Tool` 子类，接 `gopls`/`typescript-language-server`/`pyright` 等；工具：`lsp_definition` / `lsp_references` / `lsp_diagnostics`。
- `[待办]` 在 `agent.ts` 的 `edit`/`write` 之后调用 `lsp_diagnostics`，把错误注入 `context.history`（对标「编辑后诊断回灌」）。
- 复用 `tools/types.ts` 的 `Tool` 抽象（`dangerous` 设 false，只读）。

## 4. 多代理编排：scout / team / council `[待办]`

**天枢的做法**：`/scout`（只读侦察）→ `/team`（波次施工，读写隔离）→ `/council`（多席会诊）→ `/galaxy`，类型化工单 + 自适应模型路由。

**0KAY 现状**：`agent.ts` 有 `EXPLORE_AGENT_TYPE` + `exploreSolutions()`（explore 扇出），`tools/types.ts` 有 `runSubAgent`。

**落地点**：
- `[待办]` 把 explore 泛化为三种具名模式：`scout`（只读，无写工具）、`team`（写隔离 + 波次验收）、`council`（多模型同题作答 + 收敛）。
- `[待办]` 工单类型化：给子代理传结构化 work order（目标/验收标准/可写路径集）。

## 5. 会话控制：handoff 文档 / 回滚 / checkpoint `[待办]`

**天枢的做法**：`/handoff` 生成五章交接文档并归档；双 ESC 回滚到任意历史点；每轮首次修改前建 git checkpoint + 文件级 undo。

**0KAY 现状**：`agent.ts` 的 `handoffs` Map 只是**运行内压缩**交接（给 LIFE 用），非用户可见文档；无回滚/checkpoint。

**落地点**：
- `[待办]` 用户级 `/handoff`：把 `handoffs` 的 JSON 扩成结构化文档（目标/进展/产物/未决/下一步），落盘并可在新会话注入。
- `[待办]` git checkpoint：在 `agent.ts` 首次文件改动前 `git stash create`/commit 快照；提供「回滚到该点」。

## 6. 工程指标：可核验 metrics `[已落地]`

**天枢的做法**：`engineering-metrics.md` —— 规模/测试/迭代里程碑，公开可复算。

**已落地（本次）**：`scripts/engineering-metrics.mjs` —— 统计各模块代码行/文件数/测试文件数，输出可核验快照。

**待办**：`[待办]` 把输出纳入 CI（`node scripts/engineering-metrics.mjs`），生成 `docs/engineering-metrics.md`。

## 7. 信念 / 工作姿态：Star Domain 类比 `[进行中]`

**天枢的做法**：16 个「星域」= 可切换的**工作姿态**（改的是 system prompt + 工具白名单 + 决策阈值，不改模型）。

**0KAY 现状**：LIFE 有「人格」（伴侣性格），但不是「工作姿态」。agent 的 system prompt 是静态的。

**已落地（本次）**：`supervisionDirective()` 是第一个 prompt 层「信念」。
**落地点**：
- `[待办]` 抽象 `agent/src/agent/posture.ts`：定义若干工作姿态（如「审慎 / 破军 / 天权」），每个 = 一段信念 + 工具白名单 + 阈值；由任务类型/用户选择注入。

## 8. 模型预设广度 `[待办]`

**天枢**：25+ 内置预设，含 Codex(OAuth)、Gemini 原生、Kimi、Grok 等。
**0KAY 现状**：`mocr/internal/selector/data/catalog.json` + provider 体系（OpenAI 兼容 + Anthropic + stdio）。
**落地点**：`[待办]` 扩充 catalog 预设 + 增加 OAuth 类 provider（如需）。

---

## 落地路线图

| 阶段 | 内容 | 状态 |
|---|---|---|
| P0 | CVM-lite 模块 + 测试 + env-gated 接入；工程指标脚本 | ✅ |
| P1 | 门禁软阻塞（strict）+ 交付报告落库；token 账本 + 缓存命中度量（Core 账本 + mocr 上报） | ✅（UI 展示待办） |
| P2 | LSP 集成（客户端 + 工具 + mock 测试）；多代理具名模式（scout/team/council）；用户级 handoff 文档 | ✅（编辑后诊断回灌 / 回滚待办） |
| P3 | 工作姿态系统（posture）；模型预设扩充 | ✅ 姿态 / 待办 预设 |

### 本轮新增落地

- **P1 门禁软阻塞**：`agent.ts` 的 `gateFinish()` 支持 `OKAY_EVIDENCE_GATE=2|strict` —— 非 GREEN 的 finish 被拦下（最多 3 次）并回灌纠正消息；交付报告经 `taskRecorder` 落库（`kind: delivery-gate`）。
- **P1 token 账本 + 缓存**：`core/internal/server` 的 `UsageRecord` 增 `CachedTokens` / `CostUSD`，`Snapshot()` 增 `total_cached_tokens` / `total_cost_usd` / `cache_hit_ratio`（+按 model/day 聚合）；`mocr` 解析 `prompt_tokens_details.cached_tokens` 并用 `ResolvePrice().EstimateCost()` 估算成本后上报。
- **P2 LSP**：`agent/src/tools/lsp.ts` —— 零依赖 LSP 客户端（Content-Length 帧 + JSON-RPC）+ `LspTool`（diagnostics/definition/references），按扩展名解析语言服务器，缺失时优雅失败；`lsp.test.ts` 用 mock 语言服务器验证。
- **P2 多代理具名模式**：`agent/src/agent/modes.ts`（explore/scout/team/council），`exploreSolutions`/`explorationDigest` 按模式取 fanout / 只读 / digest 引导；`options.multi_agent_mode` 选择。
- **P2 用户级 handoff**：`agent/src/agent/handoff.ts` 渲染结构化交接文档（目标/结果/产物/证据/未决/下一步），`OKAY_HANDOFF_DOC=1` 时归档到 `AGENT_DATA_DIR/handoffs/<taskId>.md`。
- **P3 工作姿态**：`agent/src/agent/posture.ts`（启明/太一/破军/天权/瑶光/文曲），`options.posture` 或 `OKAY_POSTURE` 注入 prompt 信念。

**仍待办**：编辑后 LSP 诊断自动回灌；会话回滚 / git checkpoint；门禁报告在 WebUI 展示；前缀缓存**引擎**（冻结前缀，不只是度量）；模型预设扩充。

## 开启方式（P0）

```bash
# 证据门禁（默认关闭，行为保持）
OKAY_EVIDENCE_GATE=1  # 启动 agent 时带上；finish 会附 [交付门禁 GREEN/YELLOW/RED]
# 单元测试
cd agent && node --import tsx --test src/agent/supervision.test.ts
# 工程指标
node scripts/engineering-metrics.mjs
```

## 许可与署名

- 仅借鉴**思想**，代码为 0KAY 自行实现。
- 天枢：代码 Apache-2.0；**CVM 理论与实证文档 CC BY-NC-ND 4.0**（不可改写/摘编/商用）——引用其结论时请只附原文链接并署名。
