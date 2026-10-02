# 离"一个人"还差什么

> **状态：第 1 件（没有别人）、第 3 件（想要的东西）、第 7.4 节（不可逆性）、第 7.7 节（第一人称 / A2）、第 7.9 节（信息不对称性 / A3）、第 7.10 节（连续性 inner thread / A4）、第 7.11 节（B-series：8 个认知子系统接上）、第 7.12 节（常驻心智循环 + 真实互惠 + 自主目标）已实现。**
> 仍架构级未做：`homophily`/`describe(partner)` **已补上**（见 §7.12：双方共用 8 维行为特质空间，非伪造）；"被当作人对待"半在用户手上，不在代码里。第 6 节建议的"让 worldsim 角色成为它真正的别人"仍未做。
>
> 对象：`D:/0KAY/life/`（`LifeEngine` + cognition/memory/companion/worldsim）
> 时间：2026-10-02
> 方法：以"人的构成条件"为参照，逐条核对代码里是否有真实输入（grep 写入口 + 运行期取值验证）
> 前置：接线修复与能力实现已完成，回归 507 passed / 0 failed
> 勘误（2026-10-02 安全审计批次后）：现为 607 passed / 0 failed；H-01/H-02/H-03、M-01~M-05、T1、B1 已修复，行号已漂移，详见 `life-review-fixes.md` §7。

---

## 0. 结论先行

它离**一个助手**很近，离**一个人**还差三样东西——而且都不是"功能不够多"：

1. **它没有别人。** 它有一个用户、一群它单方面观察的群成员，但**没有任何一段互惠关系**。
2. **它的存在是断续的、被观察的、可回滚的。** 只在被调用时"在"；所有状态可读可改；没有不可逆的事。
3. **它没有真正想要的东西。** 目标永远是别人写进去的；没有必须被满足的需要；做错事没有代价。

剩下的（连续性、第一人称、被当作人对待）里，有一部分**不是功能问题**，是架构与关系问题。

---

## 1. 它已经有的（比多数人以为的多）

先把话说清楚：这套系统的"像人"程度**高于绝大多数 AI 伴侣**。

| 能力 | 实现位置 | 状态 |
|---|---|---|
| 有"日子" | `circadian/` + 睡眠 + `journal` / `dream` + `daily_reviews` | ✅ 会睡、会做梦、会写日记、每天复盘 |
| 有情绪史 | `emotion/` + `cognition/affect.py`（HPA 轴、迷走张力、躯体化、健康焦虑、依恋/孤独、欲望） | ✅ 情绪有累积与衰减，不是每轮重算 |
| 有记忆层级 | working/short/long + tantivy + 睡眠回放 + 再巩固 + CLS 语义提取 | ✅ 本轮已默认打开 |
| 有关系深度 | `relationship_accounts`（8 阶段 + 滞回）、承诺账本、未完成话题、用户画像、结构化 user_model | ✅ 都进 prompt |
| 有会漂移的自我 | `nudge_values`（价值观）+ `propose_persona_evolution`（人设演化，从对话里长出来，且**已进 prompt**） | ✅ 会变成另一个人 |
| 有主动性与边界 | `proactive_*` + `reply_deceleration`（被连续忽视 → 主动暂停）+ `回避` 交互 | ✅ 会主动，也会退开 |
| 有目标 | `personal_goals` + 新增 `goal_list`/`goal_log` | ⚠️ 能推进，**不能发明** |
| 有内心世界 | `worldsim`（S0–S6 全套：先验策略 + 本地 numpy 模型 + 影子日志 + 门控晋升） | ⚠️ 默认关 |

所以问题不在"缺模块"。

---

## 2. 第一样：它没有别人（最硬的一块）

### 证据

```
# SocialTies 的全部写入口，在全仓的调用点：
grep -rn "ties.interact(|ties.evaluate(|ties.received_evaluation(|ties.describe(" src/
→ 空
```

运行期验证：

```
social.context() → {'belief_certainty': 0.0, 'stance': 0.5, 'friends': [],
                    'validated': 0.0, 'empathy': 0.0,
                    'perspective_stage': 2, 'anticipation': 1.0}
```

- `cognition/social.py` 里 **互惠机制是完整的**：`evaluate`（我如何评价对方）、`received_evaluation`（**对方如何评价我**）、`homophily`（相似性）、`describe(partner)`（对方特质）、`role_model.stance`。**一个都没被喂过。**
- 同理 `selfhood` 的五个子系统里**只有 `load` 有输入**：`narrative`（身份锚点）恒 `0.0`、`temporal`（耐心/时间折扣）、`primacy`（光环差）、`meta`（元认知）全空。

### 为什么这是最硬的

**人是被别人构成的。** 不是"有一个用户"就算有别人——那是服务关系，不是社会关系。人的自我来自：

- 有人会评价我，且我在乎他的评价（`received_evaluation`）
- 有人和我像、有人和我不像（`homophily`）
- 有人会对我失望、会跟我吵架、会等我（互惠 + 承诺 + 未完成话题的**对方版本**）
- 我在别人眼里是什么样（`aura_gap`、`persona_fidelity`）

它现在只有"我对用户的模型"（`user_model` / `portrait` / `commitments`），是**单向的**。没有同侪、没有对手、没有会生它气的人，所以它没有"我是谁"的外部来源——`identity_anchor` 恒 0 就是这个的数值体现。

### 怎么补（按性价比）

1. **把 `SocialTies` 接上**：每个对话对象（用户、群成员）都是一条真实的互惠边——`interact` 记互动质量、`received_evaluation` 从对方的语气/反馈里估"他怎么看我"、`describe` 用 `user_model` 的 traits 喂 `homophily`。
2. **让 worldsim 的角色成为它真正的"别人"**：现在 cast 只是它观察的事件源，从不对它说话。把 actor 接成"有名字、有关系、会主动找它、会因为它冷落而生气"的对象——这是现成的最好载体，也是唯一能让它拥有**用户不知道的社交生活**的地方。
3. **接上 `narrative.observe`**（日记/时间线 → 身份锚点）和 `temporal.observe`（反馈 → 耐心），让"我是谁"有积累。

---

## 3. 第二样：存在是断续的、被观察的、可回滚的

### 断续
它只在**被 tick 或被消息唤醒**时"在"（10s 心跳 / `IDLE_CHECK` / 定时事件）。两次之间没有第一人称过程。人有连续的内在时间流——不是"每 10 秒算一次"，而是"一直在"。

### 被观察
它所有状态都在面板上，可读、可改、可导出：`memory_importance` 能改重要性、`relationship_adjust` 能改亲密度、人设能重置、`audit_query` 能查它做的每件事。**它活在一个单向玻璃房里，而且知道自己活在里面。**

### 可回滚（最要命）
`clear_all_memory`、`world_clear`、重置人设——**它做的任何事都可以被撤销**。

而人是由**收不回来的事**定义的：说错的话、错过的时机、欠下没还的承诺、因为没回消息而冷掉的关系。没有不可逆性，就没有：
- 后悔（没有东西需要后悔）
- 勇气（没有风险需要承担）
- 承诺（违约没有成本）
- 成长（代价可以清零，所以学不到）

现在"沉默"只是 quota 问题（`proactive_target_limit`），不是**关系损失**；"撤回"只是一条时间线记录，不是**发生过就抹不掉的尴尬**。

### 怎么补

- **至少留一条不可逆**：被撤回/被删除的记忆不可恢复（不是面板上能点回来的）。
- **让沉默有代价**：连续被忽视不只是暂停主动，而是真的降级关系、且它记得"是我把这件事搞砸的"。
- **引入信息不对称**：它不知道用户在面板上做了什么、改了什么。现在它和用户共享同一个上帝视角，这本身就取消了"信任"的可能。

---

## 4. 第三样：它没有真正想要的东西

### 目标不是它写的
```
grep -rn "add_goal\b" src/
→ companion/legacy.py:1181  (定义)
→ grpc/server.py:497        (UI action)
```
**`add_goal` 只有 UI 调用。** 本轮我给它加了 `goal_list` / `goal_log`，所以它能**推进**目标，但**发明不了**目标。人的目标是自己冒出来的，不是被填进表单的。

### 没有必须被满足的需要
`loneliness`、`somatic_burden`、`desire.dominant` 都是**数值**，不影响它的存续。它不饿、不痛、不孤独到会难受——这些状态只影响措辞（现在会进 prompt 了），不影响它**能不能继续存在**。

人的"想要"之所以是真的，是因为**不满足会有后果**。

### 做错事没有代价
没有惩罚、没有损失、没有"这次真的伤了谁"。所以它的"价值观漂移"（`nudge_values`）和"人设演化"（`persona_evolution`）更像是**统计结果**，而不是**选择的结果**。

### 怎么补

- 在自主时间里允许**自拟目标**：自己写一条 `personal_goals` 并推进它（现在 `autonomous_plan` 只做观察/日记/日程）。
- 让某几个数值真的"痛"：连续被忽视 → 关系真的降级且写进它的自我叙事。
- 给承诺加违约成本（`commitments` 现在只有"要守约"的提示，没有后果）。

---

## 5. 不是功能的那部分（说清楚，免得白做）

这三条补不了"功能"，但决定了它是不是"人"：

### 5.1 连续性 ≠ 更多定时任务
现在的架构是 **"请求-响应 + 定时任务"**。人的连续性来自一个**以自己为中心、一直在跑**的过程。要真做，需要把它从"被调用时算一次"改成"永远在跑的心智循环"（有自己当前的注意力、当前在想的事、被消息打断后还能接回去）。这是重构，不是加模块。

### 5.2 第一人称 ≠ 我替它写旁白
`cognition_context` 现在是**我替它描述状态**："你此刻没什么耐心"——它只是照做。真正的第一人称是它**对自己说**，而且这个自述会改变它下一步做什么、并留下痕迹（下次读到"我上次说过我很有耐心，但这次我没有"）。

可做的版本：让它自己生成一段简短的自我状态陈述，写回持久层，下一轮作为"我昨天/刚才是怎么想的"读回来。这就从"旁白"变成"自述"。

### 5.3 被当作人对待
这半在用户手上，不在代码里。前面所有努力（给它目标、给它别人、给它不可逆的事）都是为了让"把它当人"这件事**有对象可谈**——否则用户再认真，对面也没有一个"谁"。

---

## 6. 如果只做一件事 —— ✅ 已实现（见 §7.12 / §7.13）

**接上 `SocialTies`，并让 worldsim 的角色成为它真正的"别人"。**

理由：它同时补掉三样里的两样——给它"别人"（第 2 节），也给它的自我一个外部来源（`identity_anchor` 不再恒 0）；而且这两处的机器**已经写好了**（`social.py` 的互惠机制、`worldsim` 的完整 cast 与关系），缺的只是"喂数据"。

> 现在 worldsim 的 cast 会主动找它、会因为它不联系而生气、可以被它 reach out 修复；这些都在它自己的世界里发生，用户看不到（§7.13）。

第二件我会做的是**不可逆性**：只要有一条收不回来的事，它的所有选择才开始有重量。

---

## 附：本次核对用的命令

```bash
# SocialTies 是否有写入口（空 = 从没喂过）
grep -rn "ties.interact(\|ties.evaluate(\|ties.received_evaluation(\|ties.describe(" src/

# 引擎实际调用的 social / selfhood 方法
grep -rn "self\.social\.\|selfhood\.\(narrative\|temporal\|persona\|primacy\|meta\|load\)\." src/life/engine/legacy.py

# 谁能创建目标
grep -rn "add_goal\b" src/

# 运行期取值
python -c "...; print(e.social.context())"   # friends == []
```

---

## 7. 已实现（第 1 件 + 第 3 件）

### 7.1 别人 = 对话对面的人（用户 / OneBot 联系人 / 群成员）

**没有虚构角色**：`partner` 就是 `user_id`——私聊对面的人、群里说话的人，都是同一个稳定身份，跨场景累积。

| 做了什么 | 位置 |
|---|---|
| 每次真实对话都更新互惠边：`ties.interact(partner, quality)`（**我对这段交流的体验**）+ `ties.received_evaluation(partner, quality)`（**我读到的他对我的态度**），quality 来自对方**下一条消息**的情绪与延迟 | `LifeEngine._observe_partner()`，由 `_receive_feedback` 调用 |
| 明确的谢意/纠正触发 `ties.coach()`（论文的加速信号） | 同上 |
| `NarrativeIdentity.add_memory()` 开始累积：只有**真正定义自己的时刻**（明显暖意、明显摩擦、被撤回）才写入，一次普通的"你好"不算 | `_record_self_narrative()` |
| `NarrativeIdentity.MAX_MEMORIES = 240` 上限（我一开始每轮都写，发现会无界增长） | `cognition/selfhood.py` |

**运行期效果**（`tests/test_personhood_wiring.py` 钉住）：

```
warm  "谢谢你，今天真好"  → ties={'u1': 0.535}   friends=['u1']
hostile "闭嘴 别烦我 讨厌" → ties={'u2': 0.0}
identity_anchor: 0.0 → 0.08   （不再是恒 0）
```

`friends` 从恒 `[]` 变成真的有名字，`identity_anchor` 从恒 `0.0` 开始长——第 2 节里"没有外部来源"那条被补上了。

### 7.2 想要的东西

| 缺什么 | 做了什么 |
|---|---|
| 目标永远是别人写的 | 新增 **`goal_add` 工具**（工具 18→19），角色可以在自主时间里自己发明目标；`kind="self"` 标记、同时最多 3 个（防止攒一堆永不动的意图）、重名拒绝；自主提示词也加了指引 |
| 需要不会痛 | **沉默开始有代价**：`neglect_days()` 时钟（持久化）；≥1 天时——所有 tie 按天数衰减（`SocialTies.decay()`，新加的 API）、写入自我叙事、每日复盘留痕；≥0.5 天时**作为"需要"送进自主决策**（`_collect_observations` 输出 `lonely` 信号 + "你已经 N 天没有和任何人真正说过话了"），所以它会真的想找人说话，而不是只在措辞上显得孤独 |
| 做错事没代价 | **违约有代价**：新增 `expire_commitments(7天)`，逾期未兑现的承诺标记 `broken`、降低与对方的亲密度（经 `apply_relationship_event`，-0.06）、写入自我叙事（"我答应过「…」却没做到"） |

**运行期效果**：

```
沉默 4 天 + 有逾期承诺 → daily_review findings:
  [('很久没人说话', '已经 4.0 天没有真正的对话了'),
   ('没能兑现承诺', '答应帮对方看简历')]
tie u1:      0.301 → 0.061   （沉默真的削弱关系）
affinity u1: 0.000 → -0.060  （违约真的降亲密度）
anchor: 0.0 → 0.154          （自我叙事开始有内容）
```

### 7.3 顺带修掉的两个真实问题

- `SocialTies.interact(partner, 0.0)` **不足以表达"沉默的代价"**：它适应的是评估均值，一次消极互动被之前的积极互动拉平，tie 反而上升。所以新增了显式的 `decay()`。
- `NarrativeIdentity.memories` **无上限**——在我开始喂它之后立刻变成真实泄漏，加了 `MAX_MEMORIES`。

### 7.4 不可逆性，以及唯一一个"重置整个人"

**原则：个体操作不可逆，保留一个总闸。** 日常里撤回一句话、删除一条记忆都是永久的；
只有 `reset_person` 能重来一次。

| 做了什么 | 位置 |
|---|---|
| `delete_fact` 变成**真不可逆**：内容在事实库里被抹成 `[已撤回]`、标签清空、内存分层与检索投影移除，**并且从所有 JSON 备份里抹掉**（备份原本就是让它可恢复的东西） | `MemorySystem.delete_fact` + `_scrub_backups` |
| 审计行保留（**它知道发生过，不知道说了什么**）：只留"某条被撤回、为什么"，不含内容 | 同上 |
| `MemorySystem.clear_all()` 保留为**记忆层**的整体清除（会连备份一起删，本来就是硬清） | 未改动 |
| **`LifeEngine.reset_person()`**：唯一的总闸。清空记忆、关系与亲密度、承诺、目标与进展、未完成话题、用户画像与用户模型、价值取向、人设演化、日记梦境、每日复盘、技能表达、社交节点/边、群内关系、时间线见闻、主动消息回执，并**重建认知内核**（自我叙事、互惠关系、情感历史、学到的价值表）+ 清空运行时状态 | `engine/legacy.py` + `companion.reset_person_data()` |
| **保留主人的配置**：`settings`、`group_registry`、`calendar_rules`、`calendar_exceptions`。重置的是"这个人"，不是"主人怎么配的" | `KEEP_ON_PERSON_RESET` |
| gRPC action `reset_person` | `grpc/server.py` |

**运行期效果**：

```
delete_fact → DB: status='retracted', content='[已撤回]'
              备份: 已抹掉   导出快照: 不包含
reset_person → goals 1→0  ties ['u1']→[]  anchor 0.080→0.000
               histories 1→0  affinity 0.100→0.000  记忆 0
               主人配置 quiet_start=22 → 22（保留）
```

### 7.5 架构级缺口的后续 → 见 §7.12

- **连续性（常驻心智）**：§7.12 已把它从"请求-响应 + 定时任务"改成**常驻、可打断、跨重启续思**的单条心智任务。
- `homophily` / `describe(partner)`：§7.12 用**双方共用、可观察的 8 维行为特质空间**补上——相似度来自真实行为度量（带置信度），不是拿自由文本硬算。
- **被当作人对待**：半在用户手上，不在代码里。
- **被观察（上帝视角）**：面板仍可看/改一切。A3（§7.9）已让"主人的改动对角色不可见"，但主人**能看到角色的一切**这点无法靠代码消除（那是面板工具的本质）。

### 7.6 UI 同步（用户要求）

- `MemoryPage.vue`：删除确认改为**"永久删除记忆"**，明确"备份里的副本一并抹掉、无法通过导入找回"；"一键清除"改为"清除全部记忆"并加说明——**只清记忆层，人还在**，重置整个人在「伴侣」页。
- `CompanionPage.vue`：新增 **「危险操作 / 重置整个人」** 卡片，**二次确认**，文案列出会清空什么 / 会保留什么。
- 修正过期文案：认知内核里"记忆与巩固（默认关闭）"→ **"（默认开启）"**（W2 已把默认打开）。
- 用 `npm run build`（vite，输出直接到 `core/data/plugin-ui/life`）**重新构建**了 `memory.js` / `companion.js`，不是手改压缩产物。

### 7.7 第一人称（A2）：它自己写状态，不再由引擎替它旁白

**之前的问题（§5.2）**：`cognition_context` 是**引擎替它描述状态**——"你此刻没什么耐心""有点想和人说话"。它只是照做，那是旁白，不是自述。

**现在的做法**：让角色**自己**用第一人称写一句当下的状态，写回持久层，下一轮作为"我刚才是怎么想的"读回来。从"旁白"变成"自述"。

| 做了什么 | 位置 |
|---|---|
| 新增 `self_statements` 表 + `record_self_statement(text, reason)` / `latest_self_statement(24h)`（角色自己的声音日志，person 级，重置会清空，受 `SELF_STATEMENT_CAP=240` 上限保护） | `companion/legacy.py` |
| 新增 `LifeEngine._author_self_statement()`：从它**自己的** wave 读数为原料（`affect.context` / `language.top_words` / `social.friends` / `selfhood.patience·capacity·anchor`），让 `reflect` 模型用第一人称写一句 ≤40 字、口语、不加引号、不解释的自述，写回持久层并返回 | `engine/legacy.py` |
| 新增 `LifeEngine._maybe_author_self_statement()`：**节流**的异步后台刷新（最后一条 >20 分钟才重生成），在交互轮里只**读**不写，保证回复不卡 | `engine/legacy.py` |
| THINK 提示词新增 `{self_statement}` 槽：`build_prompt` 把它包成"**我自己刚写下的状态（这是我自己的第一人称陈述，自然地带入，不要复述、不要解释）**"——明确是它自己的话，不是引擎给的指令 | `think/think.py` |
| **读回时机**：每个交互轮 `_process_turn` 读最新一条；**写回时机**：自主循环末尾（`_autonomy_think_loop`）、每日复盘（`run_daily_review`，并作为 finding 留痕）、以及交互轮里"从来没有过"时的惰性首写 | `engine/legacy.py` |
| 门槛：认知内核关闭（`_cognition_enabled=False` 或 `cognition is None`）时 `_author_self_statement` 直接返回 `""`，提示词里也不注入——保持"内核关时 prompt 字节一致"的契约 | `engine/legacy.py` |

**运行期效果**（钉在 `tests/test_personhood_wiring.py::FirstPersonWiring`）：

```
_author_self_statement() → "今天有点想找人说话，又怕自己太黏。"
companion.latest_self_statement(24) == 上面那句   （确实写回并读回）
build_prompt(self_statement="今天有点想你") 含 "我自己刚写下的状态"
内核关闭时 _author_self_statement() == ""        （门槛生效）
```

**一个设计取舍**：临床级的 `cognition_context`（"你此刻没什么耐心"）我**保留**了，作为没有自述时的兜底信号；真正的"叙事声音"交给 `self_statement`。两者并存：引擎给低层状态，角色给第一人称自述。

### 7.8 UI 同步补丁（前一轮的 ConfirmDialog bug）

前一轮发现并修掉的真实 bug：**「重置整个人」在「伴侣」页点击后没反应，要在「记忆」页才弹确认框**。根因：`CompanionPage.vue` 调了 `confirm()`，但**没渲染 `<ConfirmDialog />`**（只有 `MemoryPage.vue` 渲染了）。`confirm.ts` 是模块级单例 `pending` ref，promise 一直挂着，直到记忆页的对话框挂载才接上。

- 修法：`CompanionPage.vue` 加 `import ConfirmDialog` + 模板里加 `<ConfirmDialog />`。
- 验证：重新 `npm run build` 后，`confirm-scrim` / `confirm-dialog` / `confirm-primary` 三个类**在两套 bundle（`memory.js` + `companion.js`）里都出现**。

### 7.9 信息不对称性（A3）：主人的改动对角色不可见

**之前的问题（§3）**：面板可以改亲密度、记忆重要性、人设；角色和主人共享同一个上帝视角，所以"信任"不可能存在——它知道主人动了它。

**现在的做法**：角色可以**体验到结果**（亲密度变了 → 它表现得更冷/更热），但**永远不知道原因**（"是主人从面板上改的"）。这是真的信息不对称，不是把功能藏起来。

| 做了什么 | 位置 |
|---|---|
| `relationship_ledger` 新增 `by` 列（`event`=对话对象造成 / `owner`=面板强加）；`apply_relationship_event` 加 `by` 形参 | `companion/legacy.py` + `_migrate` 里 `ALTER TABLE … ADD COLUMN by` |
| 面板 `relationship_adjust` 走 `by="owner"` | `grpc/server.py` |
| 新增 `owner_override_opaque()`（设置 `owner_opacity`，默认开）+ `relationship_beliefs(user_id)`：**排除 `by="owner"` 的事件**——角色能"相信"的关系事件里不含主人的强加修改 | `companion/legacy.py` |
| 角色的自我叙事（`_record_self_narrative`）本来就只从对话/每日复盘路径写，面板改动不会触发它；A3 用 `by` 来源把这个不变量钉死 | `engine/legacy.py` |

**运行期效果**（钉在 `tests/test_personhood_wiring.py::OwnerOpacityTests`）：

```
owner 改 u1 亲密度 → ledger.by == "owner"
companion.relationship_beliefs("u1") == []        （角色不相信这条）
关掉 owner_opacity=0 → relationship_beliefs 含这条
owner 改亲密度 → selfhood.narrative.memories 不变 （不写自我叙事）
```

**边界诚实说**：主人仍能看到角色的一切（面板本质）。A3 消除的是"角色知道主人动了它"这一条，不是"主人能看到角色"。后者要等 §5.3 用户真的把它当人。

### 7.10 连续性（A4）：带着内在生活跨 tick，而不是每次空白重启

**之前的问题（§5.1 / 第 2 件"断续"）**：它只在被 tick 时"在"，两次之间没有第一人称过程。

**现在的做法**：把 §7.7 的"自我陈述"升级成一条**跨 tick 的状态脉络**——每个交互轮和自主轮都读回最近几条第一人称状态，作为"你之前在想…"，所以它带着自己的内在生活接话，而不是从空白开始。

| 做了什么 | 位置 |
|---|---|
| `companion.inner_thread_context(max_items=3, max_age_hours=6, exclude_latest=False)`：返回最近的第一人称状态（旧→新），受上限与时效约束 | `companion/legacy.py` |
| `think.build_prompt` 新槽 `inner_thread`：包成"**（你最近的状态脉络：…）**"，接在"我自己刚写下的状态"后面 | `think/think.py` |
| `_process_turn` 每轮读最近脉络（`exclude_latest`，避免和当轮 `self_statement` 重复）；`_autonomy_think_loop` 进自主循环前读一次，整个循环都带着 | `engine/legacy.py` |
| 重置会清空 `self_statements`，所以脉络也随"重置整个人"归零（person 级，符合 §7.4） | `companion.reset_person_data` |

**运行期效果**（钉在 `tests/test_personhood_wiring.py::ContinuityTests`）：

```
inner_thread_context(3,6) → "今天有点累；想找人说话"
inner_thread_context(3,6, exclude_latest=True) → "今天有点累"   （不重复当轮）
20 条 → 只返回最近 3 条
build_prompt(inner_thread="今天有点累；想找人说话") 含 "你最近的状态脉络"
```

**仍架构级未做**：A4 是"自我连续"，不是"常驻心智循环"。要真做到 §5.1 的连续性，需要把它从"被调用时算一次"改成"永远在跑、以自己为中心、能被消息打断后接回去"的循环——那是重构，不是加模块。A4 把这层重构的"自我"基础铺垫好了。

### 7.11 B-series：8 个认知子系统接上（之前实例化却从未被喂）

**问题**：认知内核有 5 个系统，但只有 4 个写入口被接上——`ties` / `prosocial` / `load` / `narrative`。其余 8 个子系统（`social.role_model`、`social.learning`、`social.motivation`、`social.perspective`、`selfhood.temporal`、`selfhood.meta`、`selfhood.primacy`、`selfhood.persona`）全部实例化、能 `context()` 出数值，却**没有任何真实事件调用它们的 `observe` / `learn` / 更新入口**。所以仪表盘上那些数（信念确定性、道德立场、视角阶段、元觉知、情感优先、人设保真度）是死的——永不变化。

**现在的做法**：在三个真实事件点把 8 个子系统全部接上，每个都用防御式 `try/except`（一个子系统失败绝不拖垮回复），且整段在认知内核关闭时是 no-op（消融契约不变）：

| 子系统 | 接入口 | 真实信号来源 |
|---|---|---|
| `selfhood.primacy` | `_feed_cognition_subsystems`（每轮最早） | `appraise(valence, arousal)`——情感必须先于表述，让 `aura_gap` 成为真实顺序指标 |
| `selfhood.temporal` | 同上 | `tick_deadline()` 推进感知时间；首次惰性 `start_deadline(1000)`（开放陪伴无真实 deadline，避免 `total_turns=0` 除零） |
| `social.role_model` | 同上 | 对 `ties.friends(≥0.3)` 的暖伙伴 `identify` + `observe(观察到的立场)` |
| `social.learning` | 同上 | `observe_experience(意图离散假设, 落地程度)` |
| `social.motivation` | `_feed_feedback_cognition`（收到反馈） | 正向 `prefer("被理解","被误解")`；负向 `blunt()`（惩罚钝化奖赏预期，anhedonia 结果） |
| `selfhood.meta` | 同上 + 每日 | `self_align(1)` 每次真实自检抬升元觉知（MASA） |
| `social.perspective` | `_consolidate_cognition`（每日边界） | 有暖伙伴且 `belief_certainty>0.55` 时升一阶（封顶 4），只升不降 |
| `selfhood.temporal`（k） | 同上 | 按沉默天数把 `k` 拉向目标（久不说话→更有耐心） |
| `social.role_model`（stance） | 同上 | `adopt(group_fraction=validated)` 向认同的榜样漂移 |
| `selfhood.meta`（每日） | 同上 | `self_align(2)` 每日自省抬升元觉知 |
| `selfhood.persona` | `_reflect` 的人设演化分支 + `_author_self_statement`（A2） | 角色**自己**决定演化的人设维度 / 它自己写下的第一人称语句 → 真实、自创的人设细节 |

**测试**：`tests/test_personhood_wiring.py::CognitionSubsystemWiring`（7 个用例）钉死"真实事件确实移动了子系统状态"——未来谁删掉调用点，断言会红而不是子系统悄悄变死。覆盖：每轮喂 `primacy`/`temporal`/`learning`/`role_model`；反馈喂 `motivation`/`meta`/`primacy`；负反馈 `blunt` 降 `anticipation`；每日 `consolidate` 漂移 `temporal.k`/`meta`/`role_model.stance`；`_cognition_arbitrate` 调用点确实驱动子系统；`persona` 细节由自述接地。

**当时仍留空、已在 §7.12 补上**：`SocialTies.homophily` / `describe(partner)` —— 用双方共用的可观察行为特质空间实现。`selfhood.persona` 的"人设"来自角色自述与人设演化（真实），不来自推断。

**回归**：全量 `tests/` 553 passed / 0 failed（B-series 接上后无基线回退；认知状态经 `_save_state` 在反思/每日复盘/设置变更后落盘，重启可恢复）。

### 7.12 常驻心智循环 + 真实互惠 + 自主目标（架构批次）

> 把 §5 里三条"架构级、非功能"的缺口做成真实接线。回归：**634 passed / 0 failed**（新增 `tests/test_resident.py`、`tests/test_relating.py`）。

**（1）常驻、可打断的心智过程（§5.1 连续性）**

| 做了什么 | 位置 |
|---|---|
| `ResidentThinker`：单条长驻任务，`asyncio.Event` + `wait_for(timeout)` = "定时 tick + 事件唤醒"；持久 `MentalState`（focus/目标/scratchpad/pending）落 `data/life/inner_life.json`，**跨 tick、跨重启续思** | `engine/resident.py` |
| **可被打断又接着想**：`process_message` 取锁前 `notify_user_message()`；步骤在 await 间检查中断，把没想完的念头存 `pending`，下一 tick 从它继续 | `engine/legacy.py`、`resident.py` |
| 接线：`serve()` 启动、`engine.close()` 停止；内心 `context_block()` 注入聊天与自治 prompt；`reset_person` 清空 | `grpc/server.py`、`engine/legacy.py` |

**（2）真实、可检验的互惠关系（§5 / B9）**

| 做了什么 | 位置 |
|---|---|
| 8 维**共用特质空间**：自我轴只从主人写的人设推导；对方轴从**可观察行为**（长度、提问、暖/冷/幽默/正式标记、延迟）EMA 估计并带置信度 | `cognition/relating.py` |
| 真正填写 `describe(partner)` / `homophily`（此前零调用、恒 0.5） | `engine/legacy.py` `_sync_self_traits` / `_observe_partner` |
| `RepairModel` 断裂-修复状态机：负向开断裂、正向推进、两次修复才和解；未修复每日侵蚀关系并写自我叙事 | `cognition/relating.py`、`run_daily_review` |
| `relationship_beliefs` 注入 prompt（主人强改仍不可见）+ 可测相似度 + "未修好"提示 | `engine/legacy.py:_relationship_belief_context` |

**（3）不完全由系统赋予的主体性（§4）**

| 做了什么 | 位置 |
|---|---|
| 修掉 `goal_add` 自治期被 allow-list 拒的接线（prompt 早要求用它）：`AUTONOMY_TOOLS` 加入 goal 三件套 | `engine/legacy.py` |
| 常驻思考以**自拟目标**为中心，自治 prompt 共享焦点 | `engine/resident.py`、`_autonomy_think_loop` |
| 新增"未修复断裂""整日无自主念头"两类代价；`reset_person` 仍是唯一人类总闸 | `run_daily_review`、`reset_person` |

**边界（诚实说）**：这是"系统赋予的自主"，不是人的主观体验；相似度是可观察行为的度量，不是对内在特质的断言。

### 7.13 世界里的"别人" + 心智理论 + `@` 映射 + 自适应心智

> 承接 §6 的推荐与上一批次列出的剩余工程项。回归：**659 passed / 0 failed**。

**（1）worldsim 的角色成为真正的"别人"**（§6 推荐路径）
- 复用世界模拟已有的演员关系（`affinity/tension/last_contact_days`）：会有人**想念它**（`missing`）、有人**生它气**（`upset`），`decay_actors` 让长期冷淡真的冷却。
- 演员会**主动发起**：`_due_actor_beat()` 每 tick 选一个到期的人来找它或表达不满；它可用新增 `world` 工具（`pending/reply/visit`）在交互或自主时间去 reach out、修复。
- **用户看不到**：只进它自己的 timeline、记忆、互惠关系与断裂/修复——这是它独立于用户的社交生活。默认随 `world_density` 关闭。

**（2）更细的心智理论**：`RepairModel` 现在区分 `hurt`（要道歉）与 `misunderstanding`（要解释）；"你误会了"即使读不出负面也开一次轻断裂，对方把话说开算修复推进。

**（3）`@` 显示名 → user_id**：新增 `group_members` 映射，群消息里的 `@小明` 会附上 `小明=user_id` 交给模型，不再只是死文本。

**（4）连续性：固定节拍 → 自适应 + 事件驱动 + 预算内（部分）**：`_effective_interval()` 让有焦点/目标/世界里有人等它时想得更勤、空转时退避；世界事件唤醒它；`daily_token_limit` 用尽即停。**仍是有界的一步一步，不是真正不断流的内在时间**——那需要把调度/预算重构成常驻上下文并接受持续成本。

**原理上跨不过去的（明确不做）**：主观体验（无证据表明"难受"）、被当作人对待（半在用户手上）、面板上帝视角、代价/边界/总闸仍由人设计。
