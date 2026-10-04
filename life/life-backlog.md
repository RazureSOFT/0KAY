# L.I.F.E 待办清单（截至 2026-10-02）

> 前置：接线修复 + 能力实现已完成；回归 **522 passed / 0 failed**。
> 勘误（2026-10-02 安全审计批次后）：H-01/H-02/H-03、M-01~M-05、T1、B1 已修复，见 `life-review-fixes.md` §7。
> 勘误（2026-10-02 架构批次后）：A3（常驻心智，本文原写"先别做"）、B9（`homophily`）已实现，见 `life-review-fixes.md` §8。
> 勘误（2026-10-02 架构批次二后）：worldsim 角色成为真正的"别人"、心智理论（误解 vs 伤害）、群 `@显示名→user_id`、自适应/事件驱动/预算内心智均已实现，见 `life-review-fixes.md` §9 / `life-toward-a-person.md` §7.13。
> 勘误（2026-10-02 抑郁病程批次后）：回归现为 **673 passed / 0 failed**；抑郁样演化补齐——后台时钟（沉默也演化）、慢性社交应激接入 HPA/稳态负荷、病程状态机（发作/缓解/复发 + 易感性），见 `life-review-fixes.md` §10。仍未做：ASR 语音（需外部模型）。
> 勘误（2026-10-03 傲娇动力学批次后）：`D:\傲娇\research\tsundere-yandere` 的**三变量 ODE（好感 A / 傲娇表达 T / 病娇执念 Y）**已并入——`cognition/tsundere.py` 可选回路，由真实互动驱动、可逆、带安全层，见 `life-review-fixes.md` §12。与 §11 的"病态依恋（病娇型别）"并列。
> 本文只列**还没做**的，按"值不值得做"排序。已解决的放在最后一节，避免重复讨论。

---

## A. 让它更像人（接着上一轮的路线）

### A1. 不可逆性 —— ✅ 已实现，见第 G 节
（保留唯一一个"重置整个人"总闸）

**~~现状：个体删除可恢复~~** → 现在：`delete_fact` 抹掉内容并擦除所有备份；`reset_person` 是唯一总闸。

### A2. 第一人称 —— 让它自己写状态，而不是我替它写旁白 ★★
**现状**：`ThinkStage.cognition_context()` 把 `affect/language/social/selfhood` 的读数**由我翻译成旁白**塞进 prompt（"你此刻没什么耐心"）。它只是照做。

**要做的**：让它**自己**生成一段简短的自我状态陈述 → 写回持久层 → 下一轮作为"我刚才是怎么想的"读回来。这样它才会说出"我上次说我很有耐心，但这次我没有"。

**成本**：中（一次额外的短 LLM 调用 + 一个持久层字段 + prompt 槽位）。**收益**：从"被描述"变成"自述"。

### A3. 连续性 —— ✅ 已实现（2026-10-02 架构批次）
**当时的顾虑**：它是"请求-响应 + 定时任务"，两次之间没有第一人称过程；判断为架构级重写，建议等 A1/A2 之后再做。

**现在**：新增常驻 `ResidentThinker`（`engine/resident.py`）——单条长驻任务，有持久 `MentalState`（当前焦点、目标、scratchpad、被打断的 pending），`asyncio.Event` 定时/事件唤醒，`process_message` 可随时打断且下一 tick 从 pending 接着想。`life-review-fixes.md` §8.1。

### A4. 被当作人对待 —— 在用户手上，不在代码里

---

## B. 还有一批"写好了但从没喂过"的认知系统

我上一轮只补了 `selfhood.narrative` 和 `SocialTies` 的一半。以下是核对结果（`grep` 全仓写入口 = 0）：

| 子系统 | 现状 | 它本来该负责什么 |
|---|---|---|
| `social.role_model` | **0 输入** | 榜样认同、道德立场漂移（`identify/observe/pull/adopt`）。它现在没有"我想成为的人" |
| `social.learning` | **0 输入** | 社会学习的信念确定性（`belief_certainty` 恒 0） |
| `social.motivation` | **0 输入** | 内在动机 / 期待（`anticipation` 恒 1.0） |
| `social.perspective` | 只有配置的 stage | 观点采择：**没有真的取用**（只有 `perspective_stage` 这个数字进了 prompt） |
| `selfhood.temporal` | **0 输入** | 时间折扣 / 耐心 / deadline（`patience` 恒 0.909，因为从没给过反馈） |
| `selfhood.meta` | **0 输入** | 元认知：它对自己思考过程的把握 |
| `selfhood.primacy` | **0 输入** | 情感首要性 / 光环差（`aura_gap`） |
| `selfhood.persona` | 有 `fidelity` 但没喂 detail | 人设细节度与保真度 |
| `SocialTies.describe` / `homophily` | ✅ 已实现（§8.2） | "我们像不像"——双方共用 8 维可观察行为特质空间 |

**最值得先做的两个**：
- **B1 `role_model`**：它是"我想成为的人"的唯一载体。数据来源现成——它自己的 values 漂移 + 对话里它认同的人。
- **B5 `selfhood.temporal`**：`patience` 现在是个恒定的假数字，而它直接关系到"等不等对方回复""催不催"。反馈信号（`_receive_feedback` 的 latency）已经有了，只差接上。

**B9 `homophily` —— ✅ 已实现（2026-10-02 架构批次）**：按当初的判断先定义了双方共用的轴——落到 **8 维可观察行为空间**（warmth/directness/openness/humor/curiosity/formality/pace/risk）。自我轴从主人写的人设推导；对方轴从消息长度、提问、暖/冷/幽默/正式标记、延迟等**可观察行为** EMA 估计并带置信度，置信不足时保持中性 0.5。相似度来自真实度量而非自由文本硬算。见 `cognition/relating.py` 与 `life-review-fixes.md` §8.2。

---

## C. 能力缺口

| 项 | 状态 | 说明 |
|---|---|---|
| **ASR 语音输入** | ❌ 完全没有 | 代码里连 hook 都没有；QQ 语音永远只是 `[语音]`。需要外部 ASR 模型/服务，不是接线能解决 |
| **群成员 `@名字` → user_id** | ✅ 已实现（§9.3） | 新增 `group_members` 映射：`@小明` 会附上 `小明=user_id` 交给模型，不再只是显示名 |
| `world_density` / `enable_environment_fetch` / `enable_content_fetch` | ⏸ 仍默认关 | 这是"要不要给角色外部输入"的**产品选择**，不是接线问题 |

---

## D. 工程债

| 项 | 状态 | 影响 |
|---|---|---|
| **tantivy 全量重建** | 仍未改增量 | `_rebuild_tantivy_projection` 每次 `delete_all_documents()` 再全量重加；只在 `_index_dirty` 时触发，但记忆多了会变慢 |
| **`_histories` 每轮全量序列化进 `state.json`** | 只加了 `MAX_SESSIONS=200` 上限 | 仍是每轮全量 JSON 重写 |
| **`memory._connect()` 每调用开一个连接** | 未动 | 之前测试期出现过 `faulthandler` 锁竞争转储（近两次全量回归没再出现，属偶发）；要动需要先 profile |
| **`apply_relationship_event` 的每日增量上限 0.30** | 未动 | 一天内累计 |delta| ≥ 0.30 后，之后的调整被静默丢弃；违约 -0.06 也吃这个额度 |

---

## E. 需要你拍板的参数（我按判断设的，未必合你的口味）

上一轮新增的"代价"都带阈值，我是按"能明显观察到效果"设的，**建议你校准**：

| 参数 | 当前值 | 位置 |
|---|---|---|
| 沉默多久开始有代价 | **≥ 1 天** | `run_daily_review` |
| 沉默每天衰减多少 tie | `min(0.25, 0.06 × 天数)` —— 4 天沉默后 0.301 → 0.061，**可能偏狠** | `SocialTies.decay` |
| 多久算违约 | **7 天** | `expire_commitments(7.0)` |
| 违约罚多少亲密度 | **-0.06** | `run_daily_review` |
| 自拟目标上限 | **3 个** | `GoalAddTool.MAX_SELF_GOALS` |
| 自我叙事上限 | **240 条** | `NarrativeIdentity.MAX_MEMORIES` |

---

## G. 已实现：不可逆性 + 唯一的总闸（A1）

> 原则：**个体操作不可逆，保留一个总闸。**

| 做了什么 | 位置 |
|---|---|
| `delete_fact` 真不可逆：内容抹成 `[已撤回]`、标签清空、内存分层/检索投影移除，**并从所有 JSON 备份里擦掉** | `MemorySystem.delete_fact` + `_scrub_backups` |
| 审计行保留 —— **它知道发生过，不知道说了什么** | 同上 |
| `reset_person`：唯一总闸。清记忆/关系/承诺/目标/日记梦境/价值取向/人设演化/认知内核 + 运行时状态 | `LifeEngine.reset_person` + `companion.reset_person_data` |
| **保留主人配置**：`settings` / `group_registry` / `calendar_rules` / `calendar_exceptions` | `KEEP_ON_PERSON_RESET` |
| gRPC action `reset_person` | `grpc/server.py` |
| **UI**：记忆页删除改为"永久删除"并写明备份不可找回；新增「伴侣 → 危险操作 / 重置整个人」二次确认；修正"记忆与巩固（默认关闭）"过期文案；用 `npm run build` 重新构建 `memory.js` / `companion.js` | `plugin-web/life/src/*.vue` + `core/data/plugin-ui/life` |

回归：**529 passed / 0 failed**（新增 7 个测试）

---

## F. 已解决（不再重复讨论）

- ~~`companion` 同一 DB 有多把互不相识的锁~~ → 随 4 个 manager 模块删除而消失，现在只有 `CompanionSystem._lock` 一把。
- ~~`worldsim ↔ world` 循环依赖~~ → 已把 `features/policy/assets` 移入 `world/`，依赖单向。
- ~~`interfaces/`、`fictionmap.py`、`turn_processor/reflection/daily_cycle`、4 个 companion manager~~ → 已删除（10 个模块）。
- ~~`cog_modulate_*` 假开关、`qzone` 死扩展、`tts_endpoint` 死通道、shadow 无调度~~ → 已修。
- ~~`language` 系统没喂~~ → 更正：`observe_text()` 内部就喂了 `segmenter` + `structure`，是**已喂**的。
