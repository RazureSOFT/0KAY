# L.I.F.E 接线审计 + 行为差距分析

> **状态：本报告列出的接线问题与能力缺口已全部落地，见 `life-wiring-fixes-implemented.md`。**
> 本文保留为问题基线（审计当时的证据与判断），其中的"假开关 / 半接线 / 默认关闭"等描述已不再反映当前代码。
>
> 对象：`D:/0KAY/life/`（`src/life/` 72 个模块 + `world/` 独立包）
> 时间：2026-10-02（在"全部修复"批次之后）
> 方法：静态可达性分析（调用点/消费点 grep + AST 级方法引用统计）、运行期开关清单、prompt 组装路径追踪、工具与 gRPC action 清单比对
> 回归基线：`pytest tests/ -q` → 507 passed / 0 failed
> 勘误（2026-10-02 安全审计批次后）：现为 607 passed / 0 failed；H-01/H-02/H-03、M-01~M-05、T1、B1 已修复，行号已漂移，详见 `life-review-fixes.md` §7。

---

## 0. 结论速览

**接线面**：主链路（gRPC → LifeEngine → cognition/memory/companion/tools/worldsim）是通的，115 个 gRPC action 全部有实现，16 个工具全部注册，没有 TODO/NotImplemented 残留。
问题集中在三类：**整层没接线**、**声明了但没人消费的"假开关"**、**半接线（读得到写不进 / 写得到读不出）**。

**能力面**：真正的差距不是"少写了功能"，而是**已经写好的能力默认关着、或者算完没接到模型**。
- 认知核心（全项目质量最高的部分）默认只做"每轮花多少脑力"的仲裁，**不积累**——不写情景记忆、不回放、不重新巩固、不抽语义。
- wave3/wave4 的 `language` / `social` / `selfhood` 状态**只进面板，从不进 prompt**。
- 4 个 `cog_modulate_*` 开关**是装饰性的**：拨动只改面板，不改行为。

---

## 一、接线问题

### A. 整层没有接线（dead layer）

| # | 项 | 证据 | 影响 |
|---|---|---|---|
| A1 | 模块化层 **7 个类全部 0 实例化点**：`TurnProcessor` / `ReflectionEngine` / `DailyCycle` / `RelationshipManager` / `CalendarManager` / `ProactiveManager` / `UserModelManager` | 全仓 grep 实例化调用 = 0 | 约 4,000 行永不执行；`TurnProcessor` 的仲裁/反馈/模型路由/工具 schema 仍是桩 |
| A2 | `life/__init__.py` **仍导出 4 个 Manager** | `from .companion import RelationshipManager, ...` + `__all__` | `engine` 三件套已从导出里摘掉，但 companion 的 4 个 Manager 还在。它们与 `CompanionSystem` 是双实现且**已出现行为分歧**（`add_social_edge` 一处抛 `ValueError`、一处返回 `{"status":"ignored"}`），调用方可能走到不一致路径 |
| A3 | `interfaces/` 5 个 ABC **无任何实现者**，签名与真实实现不符 | 已标废弃 docstring，但模块仍在包里 | 误导后续开发者以为存在统一契约 |
| A4 | `worldsim/fictionmap.py` **整文件死代码**（131 行） | 全仓零引用（含非 .py 文件） | 已标废弃；其 `build_city` 签名与现行调用契约不匹配 |

### B. 声明了但没人消费（"假开关"）

| # | 项 | 证据 | 影响 |
|---|---|---|---|
| B1 | **`cog_modulate_affect` / `cog_modulate_language` / `cog_modulate_social` / `cog_modulate_selfhood`** 4 个开关 | `_affect_modulates` 等 4 个变量：只在 `__init__` 赋值 + `apply_cognition_settings` 赋值 + **只被 `cognition_status()` 读进展示 dict**。除此之外零消费 | **拨动开关只改面板，不改行为**。面板上的"语言/社交/自我 调制：开"是假的 |
| B2 | **`language.context()` / `social.context()` / `selfhood.context()`** 从不进 prompt | 三者仅出现在 `cognition_status()`（面板）；THINK prompt 里只有 `control_mode` / `strategy`（wave1）+ `emotion_context`（emotion 模块）+ `energy_context` | wave3/wave4a **完全白算**；wave4b 只有 `load` 经 `capacity_factor` 进了仲裁器的 `load` 参数，`context()` 仍然没人读 |
| B3 | `tts_endpoint` 设置 + `MediaPipeline.synthesize()` | `synthesize()` 无调用方；`has_tts()` 只被 `media_status` action 用于显示 | 自建 TTS 通道是死代码；实际 TTS 走 OneBot 的 `[CQ:tts,text=...]`，与 `tts_endpoint` 无关 |
| B4 | `qzone` 扩展 | `self.extensions.register("qzone", probe=lambda: False, ...)`，且 `qzone` 全仓只此一处 | 恒不可用的死声明 |
| B5 | `comfyui` / `tts` / `content` / `vision` 扩展 | 注册后**只有 `image` 被 `extensions.is_available()` 用于 gate**（`generate_image`）；其余 4 个只做状态展示 | 扩展系统 ≈ 状态面板，不是能力门控 |

### C. 半接线（读得到写不进 / 写得到读不出）

| # | 项 | 证据 | 影响 |
|---|---|---|---|
| C1 | **shadow 周更无调度器** | `world.shadow.weekly_update()` 只被新加的 `python -m world shadow <log>` CLI 调用；运行期只有 `runtime._log_shadow()` 在**写日志** | S6 的"guarded weekly weight update"永不自动执行 → 影子日志只涨不训练 |
| C2 | **OneBot 图片/语音不接 vision** | `onebot.py:57` 调 `media.describe_segments(self.message)`，**不传 `vision=` 回调**；而 `describe_segments(message, vision)` 明确支持回调 | QQ 图片永远只变成 `[图片：<url>]` 文本、语音变成 `[语音]`；视觉模型在主人类通道上拿不到图。（Core 上传附件那条路是接好的：`_ingest_attachments` → data-URL image part → THINK 视觉回退） |
| C3 | **两条学习路径重复且强弱倒挂** | `_reflect`（每轮后台任务，LLM 抽取 memories/preferences/taboos/concerns/commitments/open_topics/values/expressions/portrait）与 `reflection_queue`（正则 `我喜欢\|我不喜欢\|我的名字是\|我叫` → proposal → **必须 WebUI 人工 accept**）并存 | 主力学习走 `_reflect`；`reflection_queue` 是更弱、更窄、还需人工的遗留路径，价值可疑 |
| C4 | **`_reflect` 抽取的记忆 scope 硬编码 `"public"`** | `engine/legacy.py:1515` `memory.remember(text, "", ["extracted"], 0.6, "fact", "public")`；而 `enqueue_reflection` 正确算 `scope=f"session:{sid}"`、`review_reflection` 也保留 origin scope | 私聊里抽取的事实变成**全局可召回**，群聊里可能被检索出来。同一件事两条路径隐私语义不一致 |
| C5 | `_histories` 进 `state.json` 且每轮全量序列化 | 已加 `MAX_SESSIONS=200` 上限，但仍是每轮全量 JSON 重写 | 已缓解，未根治 |

### D. 结构性

| # | 项 | 影响 |
|---|---|---|
| D1 | **`worldsim ↔ world` 循环依赖** | `life.worldsim.runtime` 函数内 import `world.*`；`world.train/shadow/sim/distill` 模块级 import `life.worldsim.*`。靠局部 import 掩盖，无运行时故障，但违反分层 |
| D2 | `manifest.json` 的 `install: ["python","-m","pip","install","-e","."]` | 本仓库 `.venv` 由 **uv** 创建、**无 pip**；按 manifest 安装会失败。（Docker 用官方 python 镜像带 pip，所以只影响本地/uv 环境） |
| D3 | `manifest.json` 声明 `permissions.egress: ["*"]` | 插件自称可出网到任意地址，与 SSRF 加固的意图相反（加固仍必要，因为 egress 是全开的） |

### E. 已核对**不是**问题（避免误报）

- `LifeEngine` 的 113 个方法**全部有调用点**（`get_memory_stats`/`get_state`/`group_should_reply`/`list_memories`/`mail_test`/`push_notification`/`resolve_approval`/`set_permissions`/`sync_agents` 都经 `asyncio.to_thread(self.engine.X)` 以**可调用引用**形式传入，朴素 grep 会漏判）。
- `set_user_portrait` **有写入方**：`_reflect` 从 LLM 抽取 `portrait` 字段后写入（`legacy.py:1520`）。面板只有 `portrait_get` 没有 `portrait_set` 是正常的——写入走自动抽取。
- `_render_with_llm` 的 `if self.validate(text, event): return fallback` **不是反向 bug**：`validate()` 返回**问题列表**（空列表 = 通过），falsy 才走 LLM 文本，逻辑正确。
- 115 个 gRPC action **全部有实现**，无 `not_implemented`/占位返回。
- 全仓 **无 TODO/FIXME/NotImplementedError**。
- `MediaPipeline`/`media.describe_segments` 的 Core 附件路径是通的（图片 → 视觉模型）。

---

## 二、实现"大部分人"的行为还差什么

分四层，按"投入产出比"从高到低。

### 1️⃣ 会学习的能力**默认全关**（最大的差距）

| 开关 | 默认 | 关掉意味着 |
|---|---|---|
| `cog_memory_encode` | `0` | 对话**不写情景记忆**（`_encode_episode` 直接 return） |
| `cog_sleep_replay` | `0` | 睡眠**不回放**（`_run_sleep_replay` 直接 return） |
| `cog_memory_reconsolidate` | `0` | 旧记忆**不被重新巩固**（每日回顾里的再巩固分支跳过） |
| `cog_cls_interleave` | `0` | **不做 CLS 语义提取**、不做交错回放 |

后果：认知核心（TD(0) 值表、EVC 仲裁、CLS、OFC 认知地图、HPA 轴、时间折扣……）默认只做了**"这一轮花多少脑力"的仲裁**（wave1 → `control` → prompt）。
**人格由 persona 固定，经历不留痕**：没有"因为我上次被凶过，所以这次我更谨慎"这种跨天演化。

这是"像人"的第一块缺口，而且**开关已经写好、算法已经写好、回归也已覆盖**——只是默认 `0`。

### 2️⃣ "有生活"的能力默认全关

| 开关 | 默认 | 关掉意味着 |
|---|---|---|
| `world_density` | `off` | 虚构内心世界不跑（`worldsim_tick` 直接 skip） |
| `enable_environment_fetch` | `0` | 不知道天气、不感知时间地点 |
| `enable_content_fetch` + `news_feeds` | `0` / 空 | 不读新闻、没有外部谈资 |
| `proactive_tts` | `0` | 不主动发语音 |

后果：角色**没有"今天发生了什么"的外部输入**，只能被动回应。

### 3️⃣ 代码里**根本没有**的能力

| 缺口 | 证据 |
|---|---|
| **语音输入（ASR）** | 全仓无 `asr`/`whisper`/`transcribe`；QQ 语音永远是 `[语音]` |
| **群聊内的人际关系** | 有 `group_observations`/`group_scenes`/`group_topics`（观察层），但没有"群里谁和谁什么关系"的群像；`social_nodes`/`social_edges` 只有 UI 写入 |
| **目标推进 / 承诺兑现** | `personal_goals` 进了 THINK prompt（看得见），但**没有 goal 工具**（16 个工具里没有），`add_goal_log` 只有 UI action → 角色**无法推进自己的目标** |
| **用户画像自动生成** | 有（`_reflect` 抽取 portrait）✅ 不算缺口 |
| **图像生成** | 有 `generate_image`，依赖 `IMAGE_ENDPOINT`（默认未配） |
| **文件级 skill 数量** | 只有 `empathy.md` + `research.md`；ARCHITECTURE.md 声称内置 `empathy`/`research`/`summarize`/`dispatch`（后两个只在代码内置表里，无 md） |
| **多智能体/自我反思闭环** | `ReflectionEngine`（模块化）是死层；现有 `_reflect` 是单轮抽取，不做"回顾—修正—再试" |

### 4️⃣ 已经算出来、但**没接到行为上**的

- wave3 `language`（语言习得 / framing mode）：算了、存了、显示了，**prompt 里没有**。
- wave4a `social`（共情 / ties / 亲社会对齐）：同上。
- wave4b `selfhood`（时间折扣 / 异稳态负荷 / 元认知）：只有 `load` 间接进了仲裁器；`context()` 没人读。
- `affect`（wave2）：只有 `extra_need` 进仲裁器 + 躯体化 reassurance 循环；`context()` 其余部分没人读。

也就是说：**四波认知系统里有三波半的输出没有行为出口**。这是"看起来很强但用不上"的典型。

---

## 三、建议的推进顺序（按性价比）

1. **打开 4 个学习开关**（`cog_memory_encode` / `cog_sleep_replay` / `cog_memory_reconsolidate` / `cog_cls_interleave`），跑一遍长会话回归看记忆曲线。→ 直接决定"会不会从经历里学"，成本≈改默认值。
2. **把 wave3/4 的 `context()` 接进 THINK prompt**（像 `control_mode` 那样拼一段）。→ 把已算好的状态变成行为，改动量小、收益大。
3. **OneBot 图片接 `vision=` 回调**（`media.describe_segments(msg, vision=...)` 已经支持，只差传参 + 一个 `describe_image` 桥）。→ 让主人类通道"看得见"。
4. **`_reflect` 的记忆改带 session scope**（与 `enqueue_reflection` 对齐）。→ 修私聊事实外泄到群聊。
5. **给 shadow 周更加调度**（复用现有 IDLE_CHECK/每日回顾钩子）。→ 让 S6 真正闭环。
6. **清理假开关与死扩展**：`cog_modulate_*`（要么接上、要么删）、`qzone`、`tts_endpoint`/`synthesize`、`fictionmap.py`、模块化层 7 个类 + `life/__init__.py` 的 4 个 Manager 导出。
7. **补 goal 工具**（`goal_log` / `goal_update`），让 `personal_goals` 从"提示词装饰"变成可推进的对象。
8. **结构**：抽 `worldsim/_contract.py` 解环；`manifest.json` 的 install 改为兼容无 pip 环境（`uv pip install -e .` 或 `ensurepip` 兜底）。
