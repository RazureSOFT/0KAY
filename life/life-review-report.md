# L.I.F.E 包精细 Review 报告

> 审查范围: `D:/0KAY/life/src/life/` 全部源码（72 个 .py 文件，约 22,000 行）
> 审查时间: 2026-10-02
> 勘误（2026-10-02 安全审计批次后）：本报告被 v2 取代；H-01/H-02/H-03、M-01~M-05、T1、B1 已修复，Dockerfile 已改非 root（uid 10001），行号已漂移。回归 **607 passed / 0 failed**，详见 `life-review-fixes.md` §7。

---

## 一、项目概览

`life` 是 0KAY AI Agent 平台的一个 gRPC 插件，实现了一个基于神经科学论文的**人格化仿真代理**。核心架构：

| 模块 | 行数 | 职责 |
|------|------|------|
| `cognition/model.py` | 926 | 多系统计算模型（习惯/认知控制/记忆），映射论文中的 TD(0)、EVC 仲裁、z-score 融合 |
| `cognition/affect.py` | 1117 | 情感/生理回路（内感受、迷走神经、HPA 轴、免疫、情绪调节等） |
| `cognition/circuits.py` | 764 | 15 篇论文的神经回路映射（小脑、MD 丘脑、OFC、前瞻、元认知等） |
| `cognition/space.py` | 385 | L.I.F.E ↔ 模型适配器（216 状态空间、6 动作集） |
| `engine/legacy.py` | 3243 | 主编排引擎（会话管理、附件处理、工具调用、反思、日记） |
| `companion/legacy.py` | 1788 | 伴侣系统（关系追踪、用户画像、主动消息、日历） |
| `memory/memory.py` | 1587 | 三层记忆（工作/短期/长期）+ tantivy 全文索引 + SQLite |
| `grpc/server.py` | 696 | gRPC 服务 + 后台循环 + OneBot 适配器 |
| `worldsim/` | ~1200 | 世界模拟（角色、地图、事件策略、LLM 缓存） |

**测试**: 30 个测试文件，约 5,900 行，覆盖认知、情感、社交、语言、记忆、世界模拟等。

---

## 二、优点

### 1. 论文映射质量极高
`cognition/` 目录下的每个类都精确映射了一篇或多篇论文的**计算主张**（而非生物学细节），docstring 中标注了论文编号和具体发现。例如：
- `CogLinksArbiter` 实现了 MD 丘脑的 `eta_c = max{0.1, f_hebb(x_md) / (6 + N_c)}` 公式
- `OFCValueMap` 用余弦相似度 + floor 门控实现了 OFC 认知地图的泛化
- `Flexibility` 用 switch cost 实现了 set-shifting 的跨诊断标记

### 2. 消融优先设计
每个回路都有 `use_*` 布尔开关（`AffectConfig` 有 16 个，`CognitionConfig` 有 10+ 个），可以独立消融，符合 EASE/SimBench 论文的模块化要求。

### 3. 原子写入与线程安全
- `MultiSystemModel` 使用 `threading.RLock()` 保护 sleep replay 工作线程
- 状态持久化统一使用 `.tmp` + `replace()` 原子写入模式
- `CognitionEngine.save()` / `TurnProcessor._save_state()` 都遵循此模式

### 4. 奖励绑定到结果而非动作
`reward(s, a, s') = V_o(o(s'))` 的设计使得 devaluation 只需改一个 `V_o` 条目，模型立即重新估值——这是论文最核心的设计决策，实现正确。

### 5. 配置集中化
`config.py` 提取了魔法数字到类型化 dataclass 中，便于调参。

---

## 三、问题清单

### P0 — Bug / 正确性问题

#### P0-1: `CognitionConfig` 中 `use_lability_window` / `lability_window_seconds` 重复定义

**文件**: `cognition/model.py:111-112` 和 `:133-134`

```python
# 第一次定义 (line 111-112)
use_lability_window: bool = True
lability_window_seconds: float = 21600.0

# ... 中间有其他字段 ...

# 第二次定义 (line 133-134) — 覆盖了第一次
use_lability_window: bool = True
lability_window_seconds: float = 21600.0  # 6 h
```

`to_dict()` 也在 line 152-153 和 158-159 两次序列化同一字段，生成重复的 dict key（JSON 序列化时后者覆盖前者，不崩溃但语义混乱）。

**影响**: dataclass 的 `__init__` 会接收两次同名参数，Python 允许但 `__annotations__` 中只保留最后一个。实际上这里没有崩溃是因为 Python dataclass 不检查重复字段名，但这几乎肯定是一次合并冲突的遗留物。

**修复**: 删除 line 133-134 的重复定义，以及 `to_dict()` 中 line 158-159 的重复序列化。

---

#### P0-2: `TurnProcessor` 认知仲裁是完全的桩函数

**文件**: `engine/turn_processor.py:491-500`

```python
def _cognition_arbitrate(self, message, turn, memory_context, emotion_delta) -> dict:
    """Run cognitive arbitration (EVC-based mode selection)."""
    control = {"mode": "FULL", "action": "reply_warm"}  # 永远返回相同值
    self._last_control = control
    ...
    return control
```

`TurnProcessor` 是从 `LifeEngine`（`legacy.py`）中提取的"模块化"版本，但核心方法全是桩：
- `_cognition_arbitrate` → 永远返回 `FULL / reply_warm`
- `_cognition_settle` → 只做 dict.pop，不学习
- `_receive_feedback` → `pass`
- `_record_awaiting` → `pass`
- `get_tools_schema` → 返回 `[]`
- `_model_for` → 返回 `""`
- `_approve_tool` → 永远返回 `True`

**影响**: 如果 `TurnProcessor` 被实际使用（`life/__init__.py` 无条件导出了它），整个认知仲裁管道（论文的核心贡献）被完全绕过。Think 阶段拿不到工具 schema，LLM 无法发起工具调用；模型 ID 为空字符串可能导致请求失败。

**根因**: `engine/__init__.py` 用 try/except 守护了 `TurnProcessor` 的导入，但 `life/__init__.py`（顶层包）直接 `from .engine.turn_processor import TurnProcessor`，绕过了守护。实际运行时 `LifeEngine`（来自 `legacy.py`）才是权威实现。

**修复**: 要么完成 `TurnProcessor` 的实现（将 `LifeEngine` 中对应逻辑迁入），要么在 `life/__init__.py` 中也用 try/except 守护导入，并标注 `TurnProcessor` 为 WIP。

---

#### P0-3: `_emotion_phrase` 方法重复定义

**文件**: `engine/turn_processor.py:429` 和 `:553`

同一类中 `_emotion_phrase` 定义了两次，实现完全相同。第二个覆盖第一个。这是明显的合并遗留物。

---

### P1 — 设计问题

#### P1-1: `chromadb` 是声明了但从未使用的依赖

**文件**: `pyproject.toml:16`

```toml
dependencies = [
    ...
    "chromadb>=0.4.0",   # ← 从未 import
    ...
    "tantivy>=0.26.2",   # ← 实际使用的全文搜索引擎
]
```

`grep -r "import chromadb" src/life/` 返回零结果。记忆系统使用 `tantivy` 作为全文索引。`chromadb` 安装约 500MB，是纯死重。

**修复**: 从 `pyproject.toml` 删除 `chromadb` 依赖。

---

#### P1-2: `config.py` 与 `model.py` 的配置重复且会漂移

**文件**: `config.py` vs `cognition/model.py`

`config.py` 中的 `CognitionDefaults` 复制了 `CognitionConfig` 的部分字段，但 `CognitionConfig` 后来新增了 CLS（interleaved replay、consistency gating）、lability window 等字段，`CognitionDefaults` 没有跟踪。同样，`MemoryThresholds` 复制了 `CognitionConfig` 中的 `theta_pe`、`theta_n` 等字段。

`config.py` 中的 `COGNITION_DEFAULTS = CognitionDefaults()` 实例化后似乎没有被任何地方使用（`CognitionConfig` 有自己的默认值）。

**修复**: 删除 `config.py` 中未使用的 `CognitionDefaults` / `MemoryThresholds`，或让 `CognitionConfig` 从它们继承。

---

#### P1-3: `_LIFE_EVENTS` 在两处重复定义

**文件**: `config.py:11-20` (`LIFE_EVENTS`) 和 `engine/legacy.py:39-48` (`_LIFE_EVENTS`)

内容完全相同的 8 条生活事件，一处应该引用另一处。

---

#### P1-4: `lru_cache` 的模块级缓存永不清理

**文件**: `cognition/space.py:89, 118`

```python
@lru_cache(maxsize=512)
def _cached_state_index(context_tuple: tuple) -> int:
    ...
```

这些缓存是模块级的，跨引擎实例和测试持久化。虽然 216 个状态 < 512 上限，但如果测试中传入各种不同的 context dict（包含不同的 message、role 等），缓存会快速填满且永不释放。更关键的是，`_hashable_context` 将 dict 转为 `tuple(sorted(context.items()))`，如果 context 的 value 包含 list/dict，会抛 `TypeError`。

**修复**: 考虑将缓存移到实例级别，或在 `_hashable_context` 中处理不可哈希的值。

---

#### P1-5: `InteroceptiveChannel.from_dict` 硬编码 `maxlen=50`

**文件**: `cognition/affect.py:153`

```python
@classmethod
def from_dict(cls, data: dict) -> "InteroceptiveChannel":
    channel = cls(awareness_gain=float(data.get("awareness_gain", 1.0)))
    # ← 没有传 window 参数，用默认值 50
    channel.errors = deque((float(v) for v in (data.get("errors") or [])), maxlen=50)
    return channel
```

构造函数接受 `window` 参数（默认 50），但 `from_dict` 不读取保存的 window 值，也不传给构造函数。如果运行时修改了 `window`，反序列化后会被重置为 50。

---

#### P1-6: `ShortTermMemory.recall` 在读操作中修改状态并保存

**文件**: `memory/memory.py:148-185`

`recall()` 方法在每次召回时更新 `recall_count`、`last_recalled`、`strength`，然后调用 `_save()`。这意味着：
1. 每次 recall 都触发磁盘写入（性能问题）
2. 一个语义上的"读"操作实际产生了副作用
3. 并发 recall 可能导致数据竞争（无锁保护）

---

#### P1-7: `TurnProcessor` 与 `LifeEngine` 的架构分裂

`engine/legacy.py`（3243 行）是权威实现，`TurnProcessor`（560 行）是未完成的提取重构。两者的 `__init__` 签名、方法名高度重叠但实现深度不同。`engine/__init__.py` 的 docstring 明确说"权威实现保存在 legacy.py"，但顶层 `life/__init__.py` 却无条件导出了 `TurnProcessor`。

这造成了混乱：开发者不确定该用哪个，而 `TurnProcessor` 的桩函数可能导致功能静默失效。

**修复**: 明确 `TurnProcessor` 的地位——要么完成它并废弃 `LifeEngine` 中对应的逻辑，要么删除它并从 `life/__init__.py` 中移除导出。

---

### P2 — 风格 / 小问题

#### P2-1: `_clamp` / `_sigmoid` / `_softmax` 在多个文件中重复定义

| 函数 | 出现位置 |
|------|---------|
| `_clamp` | `affect.py`, `circuits.py`(无), `somatic.py`, `social.py`, `selfhood.py` |
| `_sigmoid` | `affect.py`, `circuits.py` (完全相同) |
| `_softmax` | `model.py`(静态方法), `social.py`(模块函数) |

应提取到一个共享的 `utils.py`。

#### P2-2: `grpc/server.py` 使用 `print()` 而非 logger

`server.py` 第 76、79、111、147 行使用 `print()` 输出日志信息，而项目已有完善的 `logging_setup.py`。

#### P2-3: `cognition/__init__.py` 导出 80+ 符号

公共 API 表面过大，增加了模块间耦合。考虑只导出顶层系统类（`CognitionEngine`, `AffectSystem`, `SocialSystem` 等），让使用者通过属性访问子组件。

#### P2-4: `Memory` dataclass 的 `importance` 无验证

`importance: float` 标注为 0.0-1.0，但无运行时验证。负数或 >1 的值会静默通过，影响遗忘曲线计算。

#### P2-5: `model.py` 导入 `lru_cache` 但未使用

```python
from functools import lru_cache  # ← 从未在 model.py 中使用
```

#### P2-6: `from __future__ import annotations` 一致性

全部 .py 文件都使用了 `from __future__ import annotations`，这很好，但 `pyproject.toml` 要求 `>=3.10` 而 Dockerfile 使用 3.12——保持一致即可，没有实际问题。

---

## 四、架构观察

### 4.1 认知管道的数据流

```
用户消息
  → EmotionEngine.on_user_message() → emotion_delta
  → CognitionEngine.control(context) → ControlOutcome (mode, action, guidance)
  → ThinkStage.build_prompt() + MocrClient.generate() → ThinkResult
  → ToolRegistry.call() → ToolResult
  → OutputStage.build_prompt() + MocrClient.generate() → 最终回复
  → CognitionEngine.observe() → 学习更新
  → MemorySystem.enqueue_reflection() → 异步反思
```

这个管道在 `LifeEngine`（legacy.py）中是完整实现的，但 `TurnProcessor` 中只实现了外壳。

### 4.2 状态空间设计

`space.py` 将对话上下文离散化为 5 因子 × 3 × 3 × 2 × 2 = 216 个状态，配 6 个动作策略。OFC 认知地图用 one-hot 因子向量（16 维），两个状态共享 4/5 因子时余弦相似度为 0.8，实现了合理的泛化。这个设计是合理的。

### 4.3 持久化层

- 状态文件: `state.json`（原子写入）
- 认知模型: `cognition/cognition.json`
- 记忆: SQLite (`memory_center.db`) + tantivy 索引 + JSON 备份
- 伴侣数据: SQLite (`companion.db`)
- 日记: JSON 文件

多层持久化增加了复杂性，但每层都有明确职责。tantivy 索引目录有 12 个 `tantivy-*` 临时目录残留（在 `src/data/life/memory/` 下），看起来是测试或崩溃后未清理的残留。

---

## 五、优先级建议

| 优先级 | 问题 | 工作量 |
|--------|------|--------|
| **P0** | 删除 `CognitionConfig` 重复字段 | 5 分钟 |
| **P0** | 修复 `TurnProcessor` 桩函数或移除导出 | 1-2 天（完成）或 5 分钟（移除导出） |
| **P0** | 删除重复的 `_emotion_phrase` | 1 分钟 |
| **P1** | 移除 `chromadb` 依赖 | 1 分钟 |
| **P1** | 清理 `config.py` 重复的 defaults 类 | 15 分钟 |
| **P1** | 修复 `InteroceptiveChannel.from_dict` maxlen | 5 分钟 |
| **P1** | `ShortTermMemory.recall` 去除写副作用 | 30 分钟 |
| **P2** | 提取共享 utils | 30 分钟 |
| **P2** | `grpc/server.py` 改用 logger | 10 分钟 |

---

## 六、总结

`life` 包的**学术设计质量极高**——论文映射精确、消融设计完善、状态空间合理。主要问题集中在**工程实现层面**：

1. `TurnProcessor` 是一个半成品重构，桩函数可能导致功能静默失效
2. 多处配置/常量重复定义，存在漂移风险
3. `chromadb` 死依赖
4. 几个小的反序列化 bug

核心的 `cognition/` 模块（model + circuits + affect + space）质量很高，是整个包的灵魂所在。建议优先修复 P0 问题，然后逐步清理 P1。
