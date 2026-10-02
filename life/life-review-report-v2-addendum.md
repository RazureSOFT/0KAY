# L.I.F.E Review 增补报告（v2-addendum）

> 定位：本文是 `life-review-report.md`（v1）与 `life-review-report-v2.md`（并行会话产出）的**交叉验证 + 增量发现**，不取代两者。
> 审查时间：2026-10-02
> 勘误（2026-10-02 安全审计批次后）：本增补的 H-01（gRPC 无鉴权）、H-02（`credential` 作用域泄漏）、H-03（邮件审批 fail-open）与 M-01~M-05 已修复；`or 0.5` 类零值吞没问题已由 `_coerce()` 统一处理，行号已漂移。回归 **607 passed / 0 failed**，详见 `life-review-fixes.md` §7。
> 方法：对 v1 的全部 P0 断言逐条 grep/读码复核；对 4 个子系统（网络/安全、engine/companion、memory/tools/output、cognition/worldsim）做独立深审；实测测试套件。

---

## 一、测试实测

```
python -m pytest tests/ -q --ignore=tests/test_research.py
→ 499 passed in 54.43s
```

- `tests/test_research.py` 因缺 `matplotlib` 无法收集（与 v2 报告结论一致：`pyproject.toml` 缺声明）。
- v2 报告记录 522 passed / 315s；本次 499 passed / 54s。通过数差异（23 例）大概率是收集范围不同（v2 从仓库根收集，可能多收了 `tests/` 之外的用例）；两者均为 0 failed，回归覆盖结论一致。

---

## 二、对 v1 报告的复核结果

| v1 编号 | 断言 | 复核结果 |
|---|---|---|
| P0-1 | `CognitionConfig` 重复字段（`cognition/model.py:111-112` vs `:133-134`） | ✅ 属实 |
| P0-2 | `TurnProcessor` 全桩函数 | ✅ 桩属实，但**级别应降**：运行时 `grpc/server.py:18,27` 只用 `LifeEngine`，`TurnProcessor` 仅在 `life/__init__.py:19` 导出，不在运行链路。但桩中 `_approve_tool` 恒 `True` 与 `ToolRegistry` 的 `approval_tools={"getmail","sendmail"}`（`turn_processor.py:94`）组合意味着：**一旦接通 TurnProcessor，邮件审批静默旁路**（LifeEngine 里有真实的 300s WebUI 审批门） |
| P0-3 | `turn_processor.py:429/553` `_emotion_phrase` 重复定义 | ✅ 属实 |
| P1-1 | `chromadb` 零引用 | ✅ 属实（全 src 0 处 import） |

---

## 三、对 v2 报告的交叉验证

v2 的核心结论本次均独立复核成立：`model_client.fetch_file` 携带 Token 的 SSRF（v2 T0-3）、`worldsim/runtime.py:35` 维度 65 vs 实际 68（v2 W0-1，实测 `feature_names()`=68）、SMTP STARTTLS 失败仍明文登录（v2 T0-1）、`read_note`/`import_snapshot` 路径与作用域问题（v2 M0-1/M0-2）、`relationship.py:120-121` 空库崩溃（v2 P0-1）、死模块层（v2 3.2 节）等。**v2 的第 0 波安全清单与修复路线图可直接采纳。**

以下为 v2 **未覆盖**、本次深审新发现的问题（均经读码核实，关键项经运行验证）。

---

## 四、新增发现（v2 未覆盖）

### P0

#### N0-1: 情绪 valence 量纲错误——中性心情被判"低落/受伤"，主动触达被整体锁死

**位置**：`emotion/emotion.py:11,19`（valence 定义域 **[-1,1]**、向 0 衰减）vs `engine/legacy.py:1509` 与 `companion/legacy.py:547`（按 **[0,1]** 取阈值）

- `_emotion_phrase`：`mood = "心情不错" if valence >= 0.65 else "情绪有些低落" if valence <= 0.35 ...` —— 静息态 valence≈0 在所有日记/日志提示词里永远写作"情绪有些低落"。
- `relationship_expression`：`elif valence <= 0.32: interaction = "受伤"` —— 心情低于 +0.32（常态）即判"受伤"；而 `can_proactively_send`（`companion/legacy.py:900-902`）对 proactive_limit<=0 的 interaction 直接 `return False`（已核实原文），即**主动消息在任何常规情绪状态下都发不出去**。
- 同文件 `_response_posture`（`legacy.py:1354`）用 `valence < -0.2` 判断，证明 [-1,1] 才是正确量纲，这两处是漏改。
- 连带：`float(getattr(state, "valence", 0.5) or 0.5)`（`legacy.py:1301,1509-1510`）——`or` 把合法的 0.0 也吞成 0.5。

**修复**：两处阈值重标定到 [-1,1]（如 `valence <= -0.15` 判"受伤"）；`or 0.5` 改显式 `is None` 判断。

### P1

**N1-1 OneBot：单条消息处理失败就拆掉整条 WebSocket，且干净关闭零退避热重连**
`adapters/onebot.py:98-103` 收循环只捕获 `JSONDecodeError`；`_send_message`（:232-234）与 engine 错误向上抛到 `start()` 的 `while self._running` → sleep 5 → **重连 WS**，丢弃队列中所有后续事件。一次 QQ API 拒发/模型 300s 超时即触发。另外 `_connect_websocket` 正常返回（服务器接受后立刻干净关闭，如拒双开）时**无任何 sleep** 直接热重连（已核实 ：78-83 结构）。修：逐事件兜底 try/except；每次循环都退避。

**N1-2 `_save_state` 事件循环上阻塞 + 多线程写同一 `.tmp` 无锁**
`grpc/server.py:134,265` 每 10s 在事件循环上同步 json.dumps 全量 state（含无界 `_histories`）；`push_notification`（`legacy.py:664-692` 的 `_save_state`）经 `asyncio.to_thread` 在 worker 线程执行——两路写者交错写同一 `state.json.tmp`，Windows 上 `os.replace` 可 `PermissionError`，proactive_tick 中未捕获会中断当轮全部候选投递；且 worker 的 dumps 与循环线程对 `_histories` 的修改存在竞态。修：`threading.Lock` 串行化 + `asyncio.to_thread`。

**N1-3 每日回顾日期边界：中午烧掉名额，晚间内容永久缺席**
`legacy.py:1832`：`target = 昨天 if now.hour < 12 else 今天` + `_last_review_date` 去重。IDLE_CHECK 周期 tick 下，12:00 后第一个 tick 回顾**只过了半天的"今天"**并写 marker；次日凌晨 00:30 的补回顾被 marker 挡掉。`daily_reviews` 按 date UNIQUE 覆盖 → 永久记录永远只有上午，晚间日记/梦境/投递缺席，且天天记"缺少日记"告警。docstring 自己写着"review of the most recently completed day"，代码与文档矛盾。修：恒回顾 `now.date() - 1`。

**N1-4 交错回放（interleaved replay）不看 `done`，终局记忆被凭空续值污染**
`cognition/model.py:728`：`target = engram.reward + gamma * max(self.Q_mf[engram.next_cue])`——睡眠回放（:784-785）有 `0.0 if engram.done else ...` 保护，此处没有（已核实原文）。终局 engram 每次被采样都把 Q 往虚构后继价值拉（alpha_interleave=0.02，单向、难恢复），违反 model.py:184-186 自己声明的"replay 不得从 next_cue bootstrap"不变量。修：照抄 sleep replay 的 done 条件。

**N1-5 异稳态负荷（allostatic load）单向棘轮，数周内钉死 1.0**
`cognition/affect.py:251`：`load` 只加不减（`abs(excess)` 连上升相也计入），全文件无恢复/睡眠衰减项。钉死后永久 +0.3 威胁偏置、体感疼痛与 extra_need 上调——人格被锁进与经历无关的慢性焦虑表型。修：加向 0 的慢恢复项（睡眠时更快）。

**N1-6 时间戳字符串主键在 Windows 上碰撞 → 连带回滚事实写入**
`memory/memory.py:468,1051,1077,1098-1099`：`f"audit_{datetime.now().timestamp()}"` 作 TEXT PRIMARY KEY。项目要求 Python>=3.10，Windows 上 `time.time()` 粒度 ~15.6ms，`_sync_fact` 在 recall/search 热路径高频调用，同一时钟 tick 两次 → `IntegrityError` → 与 fact upsert 同事务 → **事实写入一并回滚**，异常中断整次 recall/search；reflection 行同理丢行。比 v2 的 P2 定级更严重。修：`uuid4().hex`。

**N1-7 亲密度阶段滞回条件数学上不可能满足**
`companion/legacy.py:490-496`（`relationship.py:158-166` 复制了同一 bug）：`score > STAGES[old_index][1] - 0.06` 应为 `STAGES[old_index - 1][1] - 0.06`。相邻阶段间隔 >=0.16 使现有两个条件互斥，防抖从未生效，亲密度跨阈值自由抖动。修：改下标。

**N1-8 主动消息限额双数据源 + 10s 刷新互相覆盖；`per_target=0` 反而启用**
`legacy.py:2943` `apply_tool_settings` 用 Core 文档缺省值 3/1 无条件覆写 dashboard 写进 companion SQLite 的值（`server.py:149-153` 每 10s 刷新一次）→ 用户设置 10 秒内被打回。且 `can_proactively_send`（`companion/legacy.py:902`）：`per_target = min(per_target, cap) if per_target > 0 else cap` —— 设 0 想禁用，结果变成 `cap`（已核实原文）。修：key 存在才写；`==0` 视为封禁。

**N1-9 群身份 key 双轨：统计分裂 + 兴趣唤醒投递必走错通道**
`legacy.py:1106` 用 `session_id="qq_group_<id>"` observe_group，`grpc/server.py:70` 用裸数字 id —— 同一条群消息记到两个 key，统计行分裂；`group_wake_tick` 生成的 `group:qq_group_123` 在 `_target_group_id`（:2782-2788）`int("qq_group_123")` → ValueError → 落入 `push_notification("")` 通用分支而非 OneBot 发送器。修：统一群 key；`_target_group_id` 剥非数字前缀。

### P2（v2 未覆盖，择机修）

- **CQ 码注入**：`onebot.py:221` 出站文本按 OneBot v11 原样发送，模型输出里的 CQ 码（可由任意聊天用户 prompt 注入）被执行（`[CQ:at,qq=all]`、图片等）；`send_image`(:283)/`send_tts`(:274) 参数未转义。修：转义或改 segment 数组。
- **cache 失效缺口**：`model.py:672-684,788-790` —— `done=True` 步与睡眠回放后不清 `_q_mb_cache`/`_retrieve_cache`，下个 decide 读陈旧值。修：无条件清理。
- **selfhood feedback 标志不持久化**：`selfhood.py:96,107,122-135` —— `to_dict`/`from_dict` 丢 `feedback` 字段，重载后 deadline 中的 agent 退回"脆弱"感知模式（恰是该类文档写明的失败态）。
- **checkpoint 轮换字典序排序会删掉最新版**：`world/train.py:129-132` —— `sorted(glob("world_policy.v*.json"))` 使 v10 排在 v2 前，第 10 次晋升时删除的恰是 README 回滚方案依赖的最新版。修：按数字后缀排序。
- **社交 ties 只升不降**：`social.py:312` —— 无条件 `+0.05`，零质量互动也收敛到 ~0.32，坏互动无法减低。修：改为 `0.05 * (quality - 0.5)` 之类的有符号漂移。
- **`observe()` 簿记回退带完整仲裁副作用**：`space.py:303-306` —— 无 pending 决策时发起带 commit/ignite 的完整 `decide()`，虚构动作被 learn 记账，污染 flexibility/workspace 状态。
- **`minecraft_cursor` 不持久化**：`legacy.py:3109` 不在 `_save_state`/`_load_state` payload 中 —— 每次重启 Minecraft 事件全部重新摄入为重复记忆（对比 `last_diary_date` 等都有显式持久化）。
- **`_reflect` 不剥 JSON 围栏**：`legacy.py:1445-1447` 直接 `json.loads`；同文件 `learn_from_minecraft:3160-3165` 有现成的剥围栏+取外层花括号写法。围栏型模型上整批反思静默丢弃。
- **`delete_note` LIKE 通配符**：`memory.py:1523` —— `note_id="%"` 会撤回所有 `Note ...:` 前缀事实。修：转义 `%`/`_`。
- **TaskRecorder flush 在热路径**：`task_records.py:31-61` + `tools.py:883` —— 每次工具调用同步等 `timeout=2` 的 POST（start+finish 最多 +4s/turn）；对 401/404 等永久失败无限重试、outbox 无界。
- **fire-and-forget 任务无引用**：`server.py:260`、`legacy.py:2945` —— `asyncio.create_task` 返回值丢弃，任务可能被 GC 静默回收。修：像 `_sync_task` 一样持集合。
- **设置拉取失败静默**：`server.py:96-97` `except Exception: return {}` —— Core 不可达时插件以过期默认值静默运行，零日志。
- **`ManageCompanion` 回传原始异常文本**：`server.py:631-632` —— 内部路径/协议细节流向 dashboard。
- **无界增长**：`legacy.py:796,1295` `_histories`/`_session_locks` 永不淘汰且每 turn 全量序列化；`companion/legacy.py:213,236,1193` `audit_events`/`relationship_ledger`（含零增量行）/`group_observations`（`expires_at` 从不执行）永不清理。
- **死代码（活引擎内）**：`legacy.py:913-937` `_cognition_settle` 无调用方；`_last_diary_date`（:1701/:231）只写不读。
- **dev 依赖缺 matplotlib**：`pyproject.toml` 未声明，`test_research.py` 无法收集。

---

## 五、结论

三份报告合并后的整体图景一致：**算法/学术设计质量高，工程层问题集中在安全（v2 第 0 波清单）、双实现漂移（死模块层）、读路径写副作用**。本增补的主要增量是：

1. **N0-1（valence 量纲）是三份报告中唯一的行为级 P0**：一行阈值错误连锁封死主动触达、扭曲全部日记基调，且完全静默——建议与 v2 的第 0 波安全项同批修复。
2. OneBot 连接脆弱性、`_save_state` 竞态、每日回顾边界、交错回放 done 缺失、异稳态棘轮——这些是 v2 未覆盖的 P1，多数是"运行数周才显形"的慢性病。
3. v1 的 P0-2（TurnProcessor）应降级为 P1 处理（运行时未接通，但导出与 sendmail 审批桩需要清掉）。
