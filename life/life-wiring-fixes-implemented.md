# L.I.F.E 接线修复 + 能力实现记录

> 对象：`D:/0KAY/life/`（+ `world/`、`plugin-web/life`、`Makefile`）
> 时间：2026-10-02
> 依据：`life-wiring-and-capability-audit.md` 的接线审计与能力差距清单
> 回归：`pytest tests/ -q` → **507 passed / 0 failed**
> 勘误（2026-10-02 安全审计批次后）：现为 **607 passed / 0 failed**；H-01/H-02/H-03、M-01~M-05、T1、B1 已修复，行号已漂移，详见 `life-review-fixes.md` §7。

---

## 一、接线修复（W1–W6）

### W1 · wave2/3/4 认知状态接入 prompt，`cog_modulate_*` 真正生效

**问题**：`language.context()` / `social.context()` / `selfhood.context()` 只进状态面板，从不进 prompt；4 个 `cog_modulate_*` 开关只被 `cognition_status()` 读进展示 dict，不 gate 任何逻辑 —— 拨动只改面板。

**实现**
- `think/think.py`：新增 `ThinkStage.cognition_context(affect, language, social, selfhood, modulate)`，把四波读数渲染成紧凑的"认知状态"块（身体/人际/自我/用词），并明确指示模型**自然地表现出来、不要复述**。
- 模板新增 `{cognition_context}` 槽位（紧跟 `{control_context}`），`build_prompt` 新增同名参数。
- `engine/legacy.py`：新增 `_render_wave_context()`；`_cognition_arbitrate` 每轮刷新 `self._last_wave_context`；`_process_turn` 与 `_autonomous_think_loop` 两处 `build_prompt` 都传入。
- 每波**只在自己 `cog_modulate_*` 打开时才渲染**；全部关闭时返回 `""`，prompt 与"没有认知核心"时逐字节一致（回归契约不变）。

### W2 · 学习电路默认打开

**问题**：`cog_memory_encode` / `cog_sleep_replay` / `cog_memory_reconsolidate` / `cog_cls_interleave` 全为 `0`。认知核心只做"这轮花多少脑力"的仲裁，**不积累**：不写情景记忆、不回放、不重新巩固、不抽语义 → 人格被 persona 冻住，经历不留痕。

**实现**
- `companion/legacy.py` 的 `SETTING_DEFAULTS` 四项改为 `"1"`，并重写注释说明：它们就是"是否从经历中学习"的开关；置 0 仍可完整消融（消融契约不变）。
- `engine/legacy.py` 的 `_cog_bool(get(...), False)` 兜底改为 `True`。
- `plugin-web/life/src/CompanionPage.vue` 的 `COG_DEFAULTS` 与已构建产物 `core/data/plugin-ui/life/companion.js` 同步为 `"1"`（前端本地默认需与后端一致）。

### W3 · OneBot 图片接视觉模型

**问题**：`media.describe_segments(message, vision)` 明确支持视觉回调，但 OneBot 从不传 → QQ 图片永远只是 `[图片：url]`。

**实现**
- `OneBotConfig` 新增 `vision_handler`；`_handle_event` 改走新的 `OneBotAdapter._describe()`：**先异步**把图片解析成 caption（`get_image` + 视觉模型都是 async），**再用**同步的 `describe_segments` 渲染。
- `OneBotAdapter.fetch_image_base64(ref)`：走 OneBot 服务端自己的 `get_image`（**由 OneBot 服务端下载，LIFE 不抓任何 URL → 无 SSRF 面**），支持 `data:` / `base64://` / 本地路径，拒绝远端 URL，做魔数嗅探 + 8 MiB 上限。
- `LifeEngine.describe_onebot_image(ref)`：取 `_model_for("vision")`，无视觉模型时返回 `""`（回退到原占位符）。
- `grpc/server.py` 的 `_start_onebot` 接线 `vision_handler=lambda ref: engine.describe_onebot_image(ref)`。

### W4 · goal 工具 + 群内人际关系

**问题 A**：`personal_goals` 进了 THINK prompt（角色看得见），但 16 个工具里没有 goal 工具，`add_goal_log` 只有 UI action → **角色无法推进自己的目标**。

**实现**：新增 `goal_list` / `goal_log` 两个工具（`tools/tools.py`），在 `create_default_registry` 中随 companion 注册（工具数 16 → 18）；THINK 模板补一条行为指引（"有空时查看自己的目标并记录真实进展，不许把打算当成绩"）。

**问题 B**：群内关系只有"连续发言人插一条 `social_edges`、插一次永不再更新"，是二值的、不累计、且从不进 prompt。

**实现**
- 新表 `group_edges(group_id, user_a, user_b, weight, interactions, last_at)`，`user_a < user_b` 保持对称；`observe_group` 每次相邻发言累积 `weight += 0.15`（上限 1.0）、`interactions += 1`（保留原 `social_edges` 写入以兼容面板图谱）。
- 新增 `group_relations(group_id, limit, min_weight=0.3)` 与 `group_relation_context(group_id)`。
- 新增 gRPC action `group_relations`；`_process_turn` 在群聊场景把"群里常一起说话的人"注入 `persona_context`。

### W5 · shadow 调度 / TTS 通道 / scope / 死扩展

| 项 | 问题 | 实现 |
|---|---|---|
| shadow 周更 | `world.shadow.weekly_update` 只能手动跑，运行期只写日志 → S6 闭环断在最后一步 | 新增 `LifeEngine.worldsim_shadow_tick(force=False)`：最多每 7 天尝试一次，`_last_shadow_date` 进 `state.json`；由 IDLE_CHECK 自主循环调用；新增 gRPC action `world_shadow_tick`（可 `force`）。晋升本身仍由 S4 四道 gate 决定 |
| TTS 通道 | `MediaPipeline.synthesize()` 无调用方，`tts_endpoint` 只用于状态显示 | `send_media("tts", ...)`：配了 `tts_endpoint` 就先 `synthesize()` 出音频、经新增的 `OneBotAdapter.send_record()`（`[CQ:record,file=base64://…]`，4 MiB 上限）发出；否则回退 OneBot 自身的 CQ TTS |
| 记忆 scope | `_reflect` 抽取的记忆硬编码 `scope="public"`，私聊事实变全局可召回（群聊可能检索到） | 改为 `session:<session_id>`，与 `enqueue_reflection` / `review_reflection` 的隐私语义对齐 |
| 死扩展 | `qzone` 以 `probe=lambda: False` 注册，恒不可用且无人消费 | 删除该注册 |
| 世界资源路径 | `WorldRuntime("world", "models", …)` 相对**进程 CWD** 解析 → 换 CWD 会静默退回未训练先验与默认 cast | 新增 `_PLUGIN_ROOT` / `_plugin_path()`，优先按插件根解析 `world/` 与 `models/` |

### W6 · 清死层 / 解循环依赖 / 修本地安装

**删除（全部 0 实例化点、且已与权威实现分歧）**

| 删除 | 原因 |
|---|---|
| `engine/turn_processor.py`、`engine/reflection.py`、`engine/daily_cycle.py` | 模块化引擎层从未被实例化（gRPC 直接驱动 `LifeEngine`），仲裁是桩、工具审批 fail-open、`_emotion_phrase` 重复 |
| `companion/relationship.py`、`calendar.py`、`proactive.py`、`user_model.py` | 与 `CompanionSystem` 重复实现同一批表与方法，已分歧（空库崩溃、`add_social_edge` 契约不同、重复 `CREATE TABLE`） |
| `interfaces/`（5 个 ABC） | 无实现者且签名与真实实现不符 |
| `worldsim/fictionmap.py` | 全仓零引用 |

`life/__init__.py` / `engine/__init__.py` / `companion/__init__.py` 同步收窄为单一权威导出（`__all__` 只剩 `LifeEngine` + 少量 helper）。

**解开 `worldsim ↔ world` 环（结构性）**
- `features.py` / `policy.py` / `assets.py` 从 `life/worldsim/` **移入 `world/`**（三者只依赖 `math` / `json` / `pathlib` / `numpy` / `re`，与 life 无关）。
- `world/*.py` 改为包内相对导入；`life/worldsim/{features,policy,assets}.py` 变成**薄再导出 shim**，现有 import 路径继续可用。
- 结果：**依赖单向** `life.worldsim → world`。验证：全新解释器里 `import world.train, world.sim, world.shadow, world.gates, world.distill, world.generate_assets` 成功且 `'life' not in sys.modules`。

**本地安装**
- `manifest.json` 的 `python -m pip install -e .` 与生态其它插件一致（Docker 用官方 python 镜像带 pip），因此**未改动**。
- 真正的问题是本地 dev：本仓库 `.venv` 由 uv 创建、无 `pip`。`Makefile` 新增 `LIFE_PY` 解析（优先 `life/.venv`，否则 PATH 上的 `python`），修正 `dev-life` / `deps-python`（pip 失败回退 uv），并新增 `test-life` 目标。

---

## 二、行为实现小结（对照"像人"的缺口）

| 缺口 | 状态 |
|---|---|
| 会学习（encode/replay/reconsolidate/CLS） | ✅ 默认打开 |
| 认知状态进入表达（wave2/3/4） | ✅ 已接入 prompt，`cog_modulate_*` 真生效 |
| 看得见群里的图片 | ✅ OneBot → 视觉模型 |
| 推进自己的目标 | ✅ `goal_list` / `goal_log` + prompt 指引 |
| 群内人际关系 | ✅ 加权累积 + 进 prompt + 面板 action |
| 影子日志闭环训练 | ✅ 周更调度 |
| 说话有声音 | ✅ `tts_endpoint` 通道打通（仍默认关，需配 endpoint） |
| 私聊记忆不外泄到群 | ✅ scope 修正 |
| 语音输入（ASR） | ❌ 未实现（需要外部 ASR 模型/服务，代码里完全没有） |
| 群成员显示名 | ⚠️ `group_edges` 用 user_id（稳定）；`@名字` 是显示名，未做 id↔名字映射 |
| 世界观的 `world_density` / `enable_environment_fetch` / `enable_content_fetch` | ⏸ 仍默认关：属于"要不要给角色外部输入"的产品选择，不是接线问题 |

---

## 三、测试契约的变更（重要，请确认）

改默认值等于改产品契约，以下 4 个测试**被有意更新**，其余 503 个未动：

| 测试 | 变更 |
|---|---|
| `test_consolidation_switches_default_off` | → `test_consolidation_switches_default_on_and_master_gated`：断言默认开、可单独消融、仍受 `cog_enabled` 总闸约束 |
| `test_cls_interleave_is_opt_in` | → `test_cls_interleave_defaults_on_and_ablates`：断言默认开且可关 |
| `test_memory_encode_is_skipped_when_off` | 显式 `set_settings({"cog_memory_encode": 0})`（原来靠默认值是 0 才成立，属测试自身的隐式依赖） |
| `test_engine_registers_known_extensions` | 期望集合去掉 `qzone`，改为断言 `{tts, image, comfyui, content, vision}` 且每项都有 `available` |

另外为让 `test_panel_cog_keys_exist_on_backend` 的解析器不误判，`CompanionPage.vue` 与已构建的 `companion.js` 里那条注释改写了措辞（原注释含 `default:`，被正则当成了一个键）。

---

## 四、回归

```
# 改造前
pytest tests/ -q  →  507 passed

# 改造后（W1–W6 全部落地）
pytest tests/ -q  →  507 passed / 0 failed
```

- `life` 模块数 72 → **62**（删掉 10 个死模块）
- 工具数 16 → **18**（+ `goal_list` / `goal_log`）
- gRPC action 115 → **117**（+ `group_relations` / `world_shadow_tick`）
- 全模块导入：62/62 通过；`world.*` 可在不导入 `life` 的前提下独立导入
