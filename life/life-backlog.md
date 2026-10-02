# L.I.F.E 待办清单（截至 2026-10-02）

> 前置：接线修复 + 能力实现已完成；回归 **522 passed / 0 failed**。
> 勘误（2026-10-02 安全审计批次后）：回归现为 **607 passed / 0 failed**；H-01/H-02/H-03、M-01~M-05、T1、B1 已修复，遗留项见 `life-review-fixes.md` §7。
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

### A3. 连续性 —— 大重构，先别做 ★
**现状**：它是"请求-响应 + 定时任务"，只在被 tick 或被消息唤醒时"在"。两次之间没有第一人称过程。

**要做的**：改成一个以自己为中心、一直在跑的心智循环（有当前注意力、当前在想的事、被打断后能接回去）。

**为什么先别做**：这是架构级重写，且 A1/A2 做完之后这个问题会变得**更清楚该怎么解**（现在缺的是"被描述"而不是"一直在跑"）。

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
| `SocialTies.describe` / `homophily` | 留空 | "我们像不像" |

**最值得先做的两个**：
- **B1 `role_model`**：它是"我想成为的人"的唯一载体。数据来源现成——它自己的 values 漂移 + 对话里它认同的人。
- **B5 `selfhood.temporal`**：`patience` 现在是个恒定的假数字，而它直接关系到"等不等对方回复""催不催"。反馈信号（`_receive_feedback` 的 latency）已经有了，只差接上。

**B9 `homophily` 有个真实的设计障碍**：算"我们像不像"需要双方**共有的特质空间**，现有数据里没有——我的 `values` 和用户的 `preferences` 是两套自由文本。要做得先定义一组双方都能被打分的轴（比如 5 个粗轴），否则就是在伪造相似度。**这一项需要你拍板要不要做。**

---

## C. 能力缺口

| 项 | 状态 | 说明 |
|---|---|---|
| **ASR 语音输入** | ❌ 完全没有 | 代码里连 hook 都没有；QQ 语音永远只是 `[语音]`。需要外部 ASR 模型/服务，不是接线能解决 |
| **群成员 `@名字` → user_id** | ⚠️ 部分 | `group_edges` 用稳定的 user_id；`@` 后面是**显示名**，没做映射，所以"@某人"无法变成一条关系 |
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
