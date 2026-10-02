# L.I.F.E 全包代码审查报告（v2 · 完整版）

> 审查对象：`D:/0KAY/life/` 下**全部包**
> 覆盖范围：`src/life/`（19 个子包/模块组，约 24,200 行 Python）+ `world/`（独立包，8 个模块）+ `skills/`（2 个 Markdown）
> 审查方法：逐文件静态阅读 + 关键结论源码级复核 + 实际运行测试套件
> 审查时间：2026-10-02
> 说明：本报告取代此前的 `life-review-report.md`（旧报告仅覆盖 `src/life/`，且未包含 `world/`、`skills/` 与测试实测结果）。
> 勘误（2026-10-02 安全审计批次后）：本报告未覆盖的 H-01（gRPC 无鉴权）、H-02（`credential` 作用域泄漏）、H-03（邮件审批 fail-open）与 M-01~M-05 已修复；行号因本轮改动已漂移，执行前请按符号重新定位。回归 **607 passed / 0 failed**，详见 `life-review-fixes.md` §7。

---

## 0. 审查方法与实测结果

### 0.1 测试套件实测（重要）

在本机 venv 中实际执行：

```
PYTHONPATH=src python -m pytest -q --ignore=tests/test_research.py
→ 522 passed in 315.06s (0:05:15)
```

| 实测项 | 结果 | 含义 |
|--------|------|------|
| `tests/test_research.py` | **无法收集**（`ModuleNotFoundError: No module named 'matplotlib'`） | `tools/research/figures.py:12` 硬导入 matplotlib，但 `pyproject.toml` 未声明该依赖 → 研究工具包在声明环境下不可用、不可测 |
| 用例总数 | 522 passed / 0 failed | 核心逻辑回归覆盖良好 |
| 耗时 | **315 秒**（522 用例） | 平均 ~0.6s/用例，明显偏慢，印证记忆/持久化层的重复全量 I/O 问题 |
| 运行期堆栈转储 | 出现 `faulthandler` 转储：`memory.py:421 in _connect` ← `contextlib.__exit__` ← `memory.py:466 in _sync_fact` ← `memory.py:538 in store` ← `memory.py:305 in locked` ← `test_audit_log_is_bounded` | 记忆写入路径存在**锁竞争/阻塞**信号，`MemorySystem.locked` + `_connect` 组合值得排查 |

### 0.2 已源码级复核的关键结论

以下条目均已回读源码确认（非推测）：`model.py` 重复字段、`turn_processor.py` 桩函数、`reflection.py` 重复方法、`space.py` 重复赋值、`config.py` 无引用者、`_LIFE_EVENTS` 三处重复、`memory.py` 作用域绕过与路径穿越、`tools.py` SMTP 降级、`runtime.py` 特征维度 65（实测 `build_features({})` = **68**）、`relationship.py` 空库崩溃、`world ↔ life.worldsim` 循环依赖、`chromadb/pydantic/aiosmtplib` 零引用、`interfaces/` 无实现者、`TurnProcessor/DailyCycle/ReflectionEngine/*Manager` 无实例化点。

---

## 1. 执行摘要

### 1.1 各包健康度总览

| 包 | 行数 | 健康度 | P0 | P1 | P2 | 一句话结论 |
|----|------|--------|----|----|----|-----------|
| `cognition/` | ~5,200 | ★★★★☆ | 3 | 3 | 4 | 学术质量最高的核心，问题集中在并发与少量复制粘贴残留 |
| `engine/` | ~4,270 | ★★☆☆☆ | 6 | 6 | 4 | `legacy.py` 是唯一可用实现，模块化层是未完成骨架 |
| `memory/` | 1,587 | ★★☆☆☆ | 6 | 6 | 6 | 功能完整但**安全漏洞最集中**，且读路径有写副作用 |
| `companion/` | ~3,200 | ★★☆☆☆ | 3 | 4 | 3 | legacy 与模块化管理器双实现并存，已出现行为分歧 |
| `worldsim/` | ~2,100 | ★★★☆☆ | 1 | 2 | 5 | 设计合理，但硬编码维度会在全新安装时崩溃 |
| `tools/`（含 research） | ~1,750 | ★★☆☆☆ | 3 | 6 | 6 | **安全风险最高**：SMTP 明文降级、SSRF、路径穿越 |
| `grpc/` | 696 | ★★★☆☆ | 0 | 3 | 2 | 可用，日志与传输安全需收敛 |
| `adapters/` | 332 | ★★★☆☆ | 0 | 0 | 1 | 基本健康 |
| `interfaces/` | 196 | ★☆☆☆☆ | 0 | 1 | 1 | 死代码：ABC 无实现者且签名与实现不符 |
| 顶层模块 | ~1,800 | ★★☆☆☆ | 0 | 5 | 6 | `config.py` 整文件死代码；依赖声明与实际 import 不符 |
| `world/`（独立包） | ~1,100 | ★★★☆☆ | 0 | 2 | 3 | 无法按 docstring 独立运行；与 `life.worldsim` 循环依赖 |
| `skills/`（Markdown） | 2 文件 | ★★★★☆ | 0 | 0 | 0 | 内容极简，无问题 |

### 1.2 必须优先处理的 10 个问题（P0 排行榜）

| # | 位置 | 问题 | 影响 |
|---|------|------|------|
| 1 | `tools/tools.py:107-111,148-152` | STARTTLS 失败被 `except: pass` 吞掉，继续明文登录发信 | **SMTP 密码明文泄漏**（安全） |
| 2 | `tools/tools.py:488-510` | 模型可控 URL 服务端抓取，`follow_redirects=True`、无内网/元数据地址拦截 | **SSRF**（安全） |
| 3 | `model_client.py:30-38` | 任意 `http` URL 携带 Bearer Token 抓取，响应无大小上限 | **Token 泄漏型 SSRF + 内存耗尽** |
| 4 | `memory/memory.py:1134-1158` | `read_note` 用**原始** note_id 查作用域、用**净化后**名字读文件 | **私有笔记作用域绕过** |
| 5 | `memory/memory.py:1488-1495` | `import_snapshot` 用未净化 `note_id` 拼路径写文件 | **任意路径写入（穿越）** |
| 6 | `worldsim/runtime.py:35` | `WorldPolicy(tiers, 65, ...)` 硬编码 65，实际特征 **68** | 无模型文件时 `matmul` 崩溃 |
| 7 | `companion/relationship.py:120-121` | 对不存在 settings 行 `.fetchone()[0]` | 全新数据库 `TypeError` 崩溃 |
| 8 | `engine/turn_processor.py` 全文 | 仲裁/反馈/模型路由/工具 schema/审批全为桩 | 认知核心被静默绕过 |
| 9 | `memory/memory.py:195-206` | `consolidate` 把 `strength<=0.2` 的记忆**直接丢弃** | 静默数据丢失 |
| 10 | `engine/legacy.py:1202` | 每轮只执行 `calls[0]`，其余工具调用被丢弃 | 多工具计划静默截断 |

---

## 2. 逐包审查

## 2.1 `cognition/` —— 认知/情感计算核心

**总体评价**：全项目质量最高的模块。论文计算主张映射精确（TD(0)、EVC 仲裁、z-score 融合、CLS、lability window），消融开关设计完善，docstring 标注论文编号。问题集中在**并发一致性**和**复制粘贴残留**。

### P0

**C0-1 `model.py:111-112` 与 `133-134` 重复定义 dataclass 字段**
```python
use_lability_window: bool = True          # 111
lability_window_seconds: float = 21600.0  # 112
# ...中间其它字段...
use_lability_window: bool = True          # 133 ← 覆盖上面
lability_window_seconds: float = 21600.0  # 134 ← 覆盖上面
```
dataclass 不报错，但 `__dataclass_fields__` 只保留最后一份。**当前无实际危害仅因两处默认值相同**——任何一次只改一处都会静默失效。`to_dict()` 同样在 `:152` 与 `:158-159` 出现重复 dict key，后者覆盖前者。
**修复**：删除 133-134 与 158-159。

**C0-2 `model.py:585-628` `decide()` 未持锁却修改共享状态**
类注释明确写“sleep replay 在工作线程运行，与会话回合并发修改值表，所有读写必须串行化”，且 `learn()`(`:631`)、`sleep_replay()`(`:766`)、`to_dict()` 都用了 `self._lock`；但 `decide()` 在事件循环上读取 `Q_mf`、写入 `_q_mb_cache`/`_retrieve_cache`、并修改 `flexibility`、`metacognition`、`workspace`、`coglinks.strategy`，**完全没有加锁**。并发 `sleep_replay` 会造成 `Q_mf` 撕裂读与 `flexibility.previous_mode`/`workspace.tonic` 损坏。
**修复**：`decide()` 主体包 `with self._lock:`（RLock 可重入），或显式声明 `decide` 单线程约束并在文档与调用点强制。

**C0-3 `space.py:381` 与 `:385` 重复赋值**
```python
self.turns = int(data.get("turns", 0))   # 381
...
self.turns = int(data.get("turns", 0))   # 385
```
无害但说明 load 路径被草率修改。**修复**：删一处。

### P1

- **C1-1 `space.py:89,118` 模块级 `lru_cache` + 可变返回值**：`_cached_context_features` 返回 `list`，被缓存后由 `context_features()` 直接交还调用方；任何调用方就地修改都会污染全进程缓存（当前仅因 `set_features` 会复制才侥幸安全）。且 `_hashable_context`（`:85`）用 `tuple(sorted(context.items()))`，若 value 含 list/dict 会抛 `TypeError`。**修复**：缓存并返回 `tuple`，边界处再转 `list`；对不可哈希值做归一化。
- **C1-2 `affect.py:153` `InteroceptiveChannel.from_dict` 硬编码 `maxlen=50`**：构造函数接受 `window`，但反序列化不读取已保存的 window，运行时改过的窗口会被重置。**修复**：读取并透传 `window`。
- **C1-3 `interfaces/cognition.py` 契约与实现不符**：ABC 的 `observe_outcome(outcome, reward)` / `frame(text)->dict` / `conforms(text)->bool` / `reconsolidate` 实例方法，与真实实现（`AffectSystem.observe_outcome(success, reward, stressor)`、`LanguageSystem.frame(concept, coupling)`、`conforms->float`、`IMemorySystem.from_dict` 为 classmethod）全部不一致；且**没有任何实现继承这些 ABC**（全仓仅 `__init__.py` 的再导出引用）。**修复**：要么让各系统继承并统一签名，要么删除该模块与导出。

### P2

- 死导入：`model.py:22,29,30`（`json`/`lru_cache`/`Path`）、`space.py:31`（`datetime`）、`affect.py:65`/`social.py:42`/`selfhood.py:38`/`language.py:43`（`field`）、`persona_traits.py:30`（`fields`）。
- 死代码：`model.py:317 habit_distribution`、`:471 _module_distributions`、`affect.py:76 _sigmoid` 均无调用者。
- 重复工具函数：`_clamp` 在 6 个模块各写一份（`somatic._clamp` 还会 catch `TypeError`，行为已分歧），`_sigmoid`/`_softmax`/`_entropy` 同样分散。**修复**：抽 `cognition/_math.py` 统一。
- `cognition/__init__.py` 导出 80+ 符号，公共 API 面过大。建议只导出顶层系统类。

---

## 2.2 `engine/` —— 编排引擎

**总体评价**：`legacy.py`（3,243 行）是**唯一真正可用**的引擎，`grpc/server.py` 只使用它；`turn_processor.py` / `reflection.py` / `daily_cycle.py` 是**未完成的模块化重构骨架**，且**在全仓没有任何实例化点**（已 grep 确认）。

### P0

**E0-1 `turn_processor.py` 整个模块化层是桩函数**
```python
def _cognition_arbitrate(self, message, turn, memory_context, emotion_delta) -> dict:
    control = {"mode": "FULL", "action": "reply_warm"}   # 永远返回同一值
    return control
def _receive_feedback(self, turn, message) -> None: pass
def _record_awaiting(self, turn, response, tool_success, tool_failure) -> None: pass
def _model_for(self, stage: str) -> str: return ""
def get_tools_schema(self) -> list[dict]: return []
async def _approve_tool(self, name, args) -> bool: return True   # 审批永远通过
```
后果：认知仲裁（论文核心贡献）被绕过；Think 阶段拿不到工具 schema，LLM 无法发起工具调用；模型 ID 为空串；工具审批被无条件放行。**修复**：从 `legacy.LifeEngine` 迁入真实实现，或删除该模块并停止导出。

**E0-2 `reflection.py:87` 与 `:165` `_apply_decision` 定义两次**（第二份静默覆盖第一份，两者近乎相同）。**修复**：删一份。

**E0-3 `turn_processor.py:429` 与 `:553` `_emotion_phrase` 定义两次**（实现完全相同）。**修复**：删一份。

**E0-4 `daily_cycle.py:214-220` `_generate_diary` / `_generate_dream` 返回空串**
```python
async def _generate_diary(self, day, companion, mocr) -> str: return ""
async def _generate_dream(self, day, companion, mocr) -> str: return ""
```
调用方用 `if text:` 守卫（`:88`/`:101`），因此日记与梦境**永远不会生成**；`maybe_daily_agenda`（`:185-200`）只设日期、返回 `{"created": 0}`。**修复**：接入 `LifeEngine` 的生成逻辑或删除该类。

**E0-5 `reflection.py:47` 每次调用新建 Semaphore**
```python
async with asyncio.Semaphore(2):
```
并发上限完全失效（`LifeEngine` 用 `self._reflection_limit` 才是对的）。**修复**：在 `__init__` 建 `self._limit = asyncio.Semaphore(2)`。

**E0-6 `legacy.py:1199-1202` 每轮只执行第一个工具调用**
```python
calls = plan.tool_calls or ([plan.tool_call] if plan.tool_call else [])
if not calls: break
call = calls[0]          # ← 其余全部丢弃，无日志
```
**修复**：`for call in calls:`（加上限）或显式记录截断。

### P1

- **E1-1 `src/life/__init__.py:19` 绕过可选导入守卫**：`engine/__init__.py:12-21` 用 `try/except ImportError` 让模块化层可选（失败时置 `None`），但顶层包直接 `from .engine.turn_processor import ...`，一旦模块化层不可用即抛异常，守卫形同虚设。**修复**：改为 `from .engine import ...`。
- **E1-2 `legacy.py:2930,2977` 邮件审批默认放行**：`mail_require_approval = bool(values.get("mail_require_approval", False))`，且 `_approve_tool` 在其为假值时 `return True`，即缺省情况下 `getmail/sendmail` **无需 WebUI 确认**。**修复**：默认 `True`（fail-closed）。
- **E1-3 `legacy.py:3232-3240` Minecraft 密码明文入库**：生成的/回忆出的 `/login` 密码被写入可检索、可导出的记忆库，`_minecraft_password`（`:3213`）还会退化为 `parts[-1]` 返回任意末段 token 当密码。**修复**：改用独立密钥存储；删除 `parts[-1]` 兜底；审计导出/日志不含密钥。
- **E1-4 `legacy.py:2888-2890` 引擎穿透访问记忆内部**：直接 `with self.memory._lock:` 并读 `short_term.memories` / `long_term.memories`。**修复**：`MemorySystem` 提供 `list_items()` 公共方法自持锁。
- **E1-5 `legacy.py:2509` 返回类型标注与实现不符**：标注 `-> tuple[str, list[str]]`，实际 `return message, taken, after_minutes`（三元组），调用点 `:2604` 也按三元组解包。**修复**：改为 `tuple[str, list[str], int]`。
- **E1-6 大量 `except Exception: pass`**：`legacy.py:1013,1022,1684-1689,1776-1777,1794-1795,2970-2971` 等（全仓同类 40+ 处），在情感更新、关系衰减、备份、时间线写入、插件刷新等路径静默吞错。**修复**：至少 `logger.debug/warning`。

### P2

- **上帝类/上帝方法**：`LifeEngine` 约 3,000 行；`_process_turn`（`:1083-1320`）约 237 行；`grpc/server.py:364-632` 的 `ManageCompanion` 是约 270 行 `if/elif` 长链。建议拆分。
- **`_LIFE_EVENTS` 三处逐字重复**：`config.py:11`、`engine/daily_cycle.py:18`、`engine/legacy.py:39`（已确认内容一致）。**修复**：定义一处并 import。
- 魔法数字：`legacy.py:1170`、`:1264`、`:1338-1360`、`model.py:619`、`language.py:264`。

---

## 2.3 `grpc/` + `adapters/` —— 服务与适配层

### P1

- **G1-1 `server.py:76,79,111,147,230,232,238,258,262` 用 `print()` 而非 logger**：项目已有 `logging_setup.py`，服务诊断输出却被 stdout 丢弃。**修复**：改用 `get_logger(...)`。
- **G1-2 `server.py:670` 明文端口可被外部暴露**：
  ```python
  server.add_insecure_port(f"{os.getenv('LIFE_BIND_HOST','127.0.0.1')}:{port}")
  ```
  默认回环安全，但一旦 `LIFE_BIND_HOST` 设为非回环地址，gRPC 无鉴权即对外。**修复**：非回环时要求显式 opt-in / TLS。
- **G1-3 `server.py:137` `__import__("datetime").date.today()`**：晦涩且为本地朴素时间。**修复**：模块顶部 `from datetime import date`。

### P2

- `server.py:364-632` `ManageCompanion` 巨型 `if/elif`，建议按领域拆 handler。
- `adapters/onebot.py:5` 死导入 `time`。

---

## 2.4 `memory/` —— 三层记忆系统

**总体评价**：功能最完整，但**安全问题最集中**，且“读操作产生写副作用”贯穿设计。

### P0

**M0-1 `memory.py:1134-1158` 笔记作用域绕过**
```python
def read_note(self, note_id, offset=1, limit=200, scope=""):
    self._check_note_scope(note_id, scope)              # 用原始 note_id 查作用域
    candidate = self.notes_dir / f"{Path(note_id).name}.md"   # 用净化名读文件
...
def _check_note_scope(self, note_id, scope):
    row = db.execute('SELECT scope FROM note_scopes WHERE note_id=?', (note_id,)).fetchone()
    stored = row[0] if row else "public"                # 查不到 → 默认 public
```
传入 `note_id="x/<私有笔记名>"`：读文件时 `Path(...).name` 取到私有笔记 → 打开成功；查作用域时用 `"x/<私有笔记名>"` 查不到 → 默认 `public` → 放行。该路径经 `tools/tools.py:862` 与 `grpc/server.py:407` 对外可达。
**修复**：只净化一次 `safe = Path(note_id).name`，路径与作用域查询统一用 `safe`。

**M0-2 `memory.py:1488-1495` `import_snapshot` 路径穿越**
```python
note_id = str(note.get("id") or "")
note_path = self.notes_dir / f"{note_id}.md"
if content: note_path.write_text(content, encoding="utf-8")
```
`note_id="../evil"` 可写出 `notes_dir` 之外。对称地 `export_snapshot`（`:1452`）对库中 `path` 直接 `read_text()`，构成任意读。经 `grpc/server.py:422` 可达。**修复**：`note_id = Path(note_id).name`，并校验 `note_path.resolve().is_relative_to(self.notes_dir)`。

**M0-3 `memory.py:195-206` `consolidate` 静默丢弃弱记忆**
```python
if m.strength > 0.7: to_consolidate.append(m)
elif m.strength > 0.2: remaining.append(m)
self.memories = remaining      # strength <= 0.2 直接消失
```
docstring 说“归档弱记忆”，实际是删除并 `_save()` 落盘。**修复**：转入 `archive` 表/列表。

**M0-4 `memory.py:148-185` `recall` 在读路径写盘**
每次召回都更新 `recall_count/last_recalled/strength` 并 `self._save()`（全量 JSON 重写），且无锁，并发召回存在数据竞争。**修复**：召回保持只读，或异步/批量持久化。

**M0-5 `memory.py:122,130,232,239,245,247` `open()` 未指定 encoding**
Windows 默认 cp936，写入中文/emoji 会 `UnicodeEncodeError` 或损坏文件；同文件其它写入均用 `utf-8`。**修复**：统一 `encoding="utf-8"`。

**M0-6 `memory.py:399-404` / `:240` JSON/DB 加载无校验**
`json.loads(row["metadata_json"])` 与 `Memory.from_dict` 直接取 `data["id"]/["created_at"]`；畸形数据或空 `created_at` 会抛未捕获异常导致**启动即崩**；`LongTermMemory._load` 对顶层非 dict 文件 `.get()` 会 `AttributeError`。**修复**：try/except + 默认值 + 键校验。

### P1

- **M1-1 `memory.py:1306-1313` 每次检索都写库**：`search()` 内对每个命中做 `recall_count+1`、`strength+0.03`、`_sync_fact`（INSERT + 标签删改 + 审计行），而 `search` 在每次构建提示时被调用（`legacy.py:1157`、`turn_processor.py:279`）。**修复**：检索与强化解耦，批量/异步更新。
- **M1-2 `memory.py:1223-1250` 全量重建 Tantivy 索引**：`_rebuild_tantivy_projection` 先 `delete_all_documents()` 再全量重加，且被 `__init__`/`consolidate`/`maintenance`/`import_snapshot`/`delete_fact`/`delete_note` 多处调用；`_tantivy_search`（`:1324-1325`）每次查询都重新打开索引。**修复**：增量 commit + 缓存 `Index` 句柄。
- **M1-3 `memory.py:316` `@lru_cache(maxsize=1)` 冻结配置**：`_lability_window()` 首次调用后进程内不可变。**修复**：去掉缓存或按配置值作 key。
- **M1-4 `memory.py:1102-1115` pending 反思队列无上限**：`_prune_reflections` 只删 `status != 'pending'`，处理器停摆时无限增长。**修复**：同时按最旧优先截断 pending。
- **M1-5 非原子持久化**：`memory.py:130`、`:1222`、`:1347`、`circadian.py:223` 均就地写文件，崩溃即损坏（而 `llm_cache.py:38`、`policy.py:88`、`runtime.py:106` 已正确用 `.tmp`+`replace`）。**修复**：统一原子写。
- **M1-6 12 个 `tantivy-*` 残留临时目录**（`src/data/life/memory/`）：现行代码只打开 `tantivy_memory`，这些是旧代码路径的 Tantivy 默认临时目录残留，无人清理。**修复**：在 `__init__`/`_rebuild_tantivy_projection` 做一次陈旧目录清理。
- **M1-7 实测锁竞争信号**：测试运行期出现 `memory.py:421 _connect` ← `_sync_fact` ← `store` ← `locked` 的 faulthandler 转储，提示 `locked` 装饰器 + `_connect` 存在阻塞/竞争。**修复**：核查锁粒度与连接生命周期。

### P2

- O(n²)：`memory.py:924 queue.pop(0)`；`_tier_of`(1361)、`reinforce`/`periodic_reinforce`(671-695) 逐项线性查成员。建议改 set/dict。
- 主键用 `datetime.now().timestamp()` 拼接（`:468,1051,1077,1098`），同微秒并发会 `IntegrityError`。建议 `uuid4().hex`。
- 内联 `__import__('uuid')`（`:535,1021`）。
- `list_notes`(1163-1174) 已取到 scopes dict 却仍逐文件 `_check_note_scope` → N+1。
- `extract_semantics`(975-976) 达上限后应 `break` 却 `continue`，继续无谓计算。

---

## 2.5 `companion/` —— 伴侣系统

**总体评价**：`legacy.py`（1,788 行）与 4 个模块化管理器**双实现并存**，已出现行为分歧，是最大的维护风险。

### P0

**P0-1 `relationship.py:120-121` 全新数据库崩溃**
```python
rate = float(db.execute("SELECT value FROM settings WHERE key='affinity_decay_per_day'").fetchone()[0] or 0.02)
after = float(db.execute("SELECT value FROM settings WHERE key='affinity_decay_after_days'").fetchone()[0] or 3)
```
`_init` 只种 4 个 settings，`affinity_decay_*` 仅存在于 Python 侧 `SETTING_DEFAULTS`，从未落库 → `.fetchone()` 为 `None` → `None[0]` `TypeError`。legacy 孪生实现用 `_setting(db, ..., "0.02")` 是安全的。**修复**：改用带默认值的 `_setting` 或 SQL `COALESCE`。

**P0-2 `legacy.py:250` / `relationship.py:108` 用 `hash()` 做去重键**
```python
f"message:{hash((user_id, message, datetime.now().strftime('%Y%m%d%H%M')))}"
```
`PYTHONHASHSEED` 随机化使同一消息在重启后哈希不同 → `UNIQUE(user_id,event_key)` 去重失效 → 亲密度重复累加。**修复**：`hashlib.sha1(...)`。

**P0-3 `legacy.py:272-284` / `calendar.py:107-138` 重复确认日程会产生重复事件**
`confirm_agenda` 未校验候选当前状态，连点两次即插入两条 `calendar_events`。**修复**：`row["status"] != "pending_confirmation"` 时提前返回。

### P1

- **P1-1 `legacy.py:439-441`+`:390` `locale` 永远无法设置**：`locale` 在 `CONFIG_SCHEMA` 但不在 `SETTING_DEFAULTS`，`validate_setting` 恒返回 `None`，`set_settings` 拒绝，`migrate_config` 的默认值导入时被丢弃。**修复**：加入 `SETTING_DEFAULTS`。
- **P1-2 `proactive.py:68-69` 未守护 `fromisoformat`**：非法 `preferred_at` 抛 `ValueError` 冒泡出 `create_proactive_candidate`。**修复**：try/except 回退 `start`。
- **P1-3 legacy 与模块化管理器重复实现同一批方法与 `CREATE TABLE`**（`relationship.py`/`calendar.py`/`proactive.py`/`user_model.py` 与 `legacy.py:84-126` 重复建 `skills`/`expressions`/`social_nodes`/`commitments`/`user_model`/`values_profile` 等表），且 `__init__.py:9-27` 同时导出两套。已出现分歧：`add_social_edge` 在 legacy 抛 `ValueError`、在 `user_model.py:600` 返回 `{"status":"ignored"}`；`decay_relationships` 在 legacy 安全、在 `relationship.py` 崩溃。**修复**：保留唯一 owner。
- **P1-4 并发：同一 `companion.db` 有 N 把独立锁**：`legacy.CompanionSystem._lock` 与各管理器 `_lock` 互不相识，WAL `-wal/-shm` 拆除竞争只对同锁调用者有效。**修复**：按 DB 路径共享进程级锁。

### P2

- 全程朴素 `datetime.now()`，忽略 `env_timezone`（Asia/Shanghai），跨时区宿主机上静默时段/每日上限判定错误；`upcoming_important_dates`（`legacy.py:1020`、`calendar.py:235`）对 2-29 年度日期在非闰年 `replace(year=...)` 抛错被 `continue` 跳过。
- ID 用时间戳拼接（`relationship.py:94`）存在同微秒碰撞。

---

## 2.6 `worldsim/` —— 世界模拟

### P0

**W0-1 `runtime.py:35` 硬编码特征维度 65（实际 68）**
```python
return WorldPolicy(tiers, 65, base_rates=base_rates)
```
实测 `build_features({})` 返回 **68** 维（`world/sim.py:54` 用的是 `len(build_features({}))`，正确）。当 `models/world_policy.json` 不存在时 `WorldPolicy` 拿到 `d=65`，`policy.py:65` 的 `self.W @ x`（`W.shape=(n,65)` vs `x.shape=(68,)`）首次调用即 `ValueError`。当前仅因随附模型恰为 `300×68` 而侥幸不崩。**修复**：`WorldPolicy(tiers, len(build_features({})), ...)`。

### P1

- **W1-1 `worldview.py:62-63` 读取错误的设置键**：`settings.get("world_lat")` / `"world_lng"`，而真实键是 `env_latitude`/`env_longitude`（`legacy.py:393`、`environment.py:90`）→ 配置的坐标从不生效，静默回退杭州默认值。**修复**：改读 `env_latitude`/`env_longitude`。
- **W1-2 `worldsim ↔ world` 循环依赖**（已确认）：`runtime.py:26,51,61,204`、`worldview.py:118` 导入 `world.*`；而 `world/shadow.py:18-19`、`sim.py:48-49`、`train.py:20-21`、`distill.py:73-74,99`、`generate_assets.py:226` 导入 `life.worldsim.*`。当前靠函数内局部 import 打破。**修复**：把共享的特征/策略契约抽到中立模块，双方共同依赖。

### P2

- **`fictionmap.py`（131 行）整文件死代码**，全仓零引用；其签名（`build_city(*, country, city, districts, ...)`）若接入会 `TypeError`。建议删除或标废弃。
- `assets.py:18` `"朋友 ": "friend"` 键尾随空格，调用方已 `.strip()` → 永不可达。
- `runtime.py:179,206,214,223,229,235,242` 六处 `except Exception: pass`，`_consume` 的失败不可见。
- `worldview._MAP_CACHE`（`:370,393-395`）是无锁模块级全局，被面板轮询线程修改；`build_map` 每次 `deepcopy` 整张地图。
- 魔法数字：`runtime.py:35` 的 65、`worldview.py:28 MAX_LOCATIONS`、`citymap.py:30 _MIN_BLOCK_AREA`。

---

## 2.7 `tools/`（含 `research/`）—— 工具层【安全重灾区】

### P0（安全）

**T0-1 `tools.py:107-111` 与 `:148-152` SMTP 明文降级**
```python
server.ehlo()
try:
    server.starttls()
    server.ehlo()
except Exception:
    pass            # ← 失败后继续
server.login(user, password)      # 明文 TCP 上传密码
server.sendmail(...)
```
STARTTLS 被中间人剥离或服务器拒绝时异常被吞，继续以明文提交密码。`test_smtp`（`:107-111`）同样问题。**修复**：非 465 端口要求 `starttls()` 成功，失败即 `raise`/返回失败；或用 `ssl.create_default_context()` 并校验。

**T0-2 `tools.py:488-510` SSRF**
```python
async with httpx.AsyncClient(follow_redirects=True, timeout=30) as client:
    resp = await client.get(url)
```
`url` 直接来自模型工具调用：无协议/主机白名单，未拦截 `127.0.0.1`、RFC1918、云元数据 `169.254.169.254`，且 `follow_redirects=True` 允许公网地址 302 跳内网。**修复**：仅允许 `http/https`；解析并拒绝私有/回环/链路本地 IP；关闭重定向或逐跳复检。

**T0-3 `model_client.py:30-38` 携带 Token 的 SSRF + 无上限下载**
```python
target = url if url.startswith("http") else f"{self.core_http}{url}"
async with httpx.AsyncClient(timeout=timeout) as http:
    response = await http.get(target, headers=auth_headers())
    return response.content
```
任意绝对 `http` URL 会绕过 Core 前缀，却仍附带插件 Bearer Token；响应全量缓冲无大小上限。**修复**：只接受相对 `/api/files/...` 并强制拼接在 `core_http` 下；校验解析后主机等于 Core；流式下载 + 字节上限。

### P1

- **T1-1 `research/__main__.py:31,34-39`（及 `:49-50`、`paper.py:319-327`）路径穿越**：`spec["stem"]` / `spec["path"]` 未净化即拼路径，`stem="../../etc/x"` 可逃出 `--out`（`experiment.py:51` 已有正确净化可复用）。
- **T1-2 `tools.py:903-904` 序列化崩溃使工具结果整体丢失**：`json.dumps(result.data)` 无 `default=` 且不在 try 内，工具返回 Path/bytes/datetime/set 即抛 `TypeError` 逃出 `ToolRegistry.call`。**修复**：`default=str` + try/except。
- **T1-3 `tools.py:281,306` `unread` 字段语义错误**：`unread` 直接等于查询标志 `unread_only`，`unread_only=False` 时所有邮件都报 `unread: False`，`unread_count` 恒 0。**修复**：FETCH 时取 `FLAGS` 解析 `\Seen`。
- **T1-4 `http_auth.py:13-19` 无凭证时 fail-open**：`auth_headers()` 在无身份/无环境 token 时返回 `{}`，于是 `GET /api/providers/credentials`（返回原始 provider `api_key`）**不带任何 Authorization** 被调用。**修复**：无凭证应报错，不得裸发。
- **T1-5 `model_client.py:135-139` 明文 HTTP 反复取密钥**：默认 `core_http=http://127.0.0.1:8080`，`api_key` 明文传输，且每次 `_generate` 都重新拉取、无缓存。**修复**：支持 https；按 provider 配置版本做短期缓存。
- **T1-6 `core_client.py:68` `grpc.insecure_channel`**：注册 token 与 prompt 明文过网。**修复**：`secure_channel` + Core CA，或明确限定回环并文档化。
- **T1-7 `content.py:33-37` / `paper.py:304-306` 用 `xml.etree` 解析不可信输入**：RSS/Atom 与模型生成标记，存在实体膨胀/深嵌套 DoS。**修复**：`defusedxml`，或预检 `<!DOCTYPE`/`<!ENTITY`。

### P2

- **`research/__main__.py:63,66` 用 `importlib.util.spec_from_file_location` 加载 spec 指定的任意 Python 模块**——按设计属代码执行面，建议文档化并在受信目录白名单内加载。
- `tables.py:52,55` LaTeX 单元格未转义（HTML 路径有 `escape()`，LaTeX 路径没有）：`& % _ # \` 会破坏编译或注入。**修复**：`_latex_escape()`。
- `task_records.py:31-39` 离线 outbox 无上限增长（`flush()` 失败仍持续 append，仅截断单个字符串字段）。
- `usage.py:44` 每条 token 事件全量重写 `usage.json`（O(n) I/O/次），`by_day` 无限增长。建议 JSONL 追加 + 读取时压缩。
- `paper.py:218` `from docx.shared import Inches` 在 `_emit_block` 内死导入。
- `output.py:18-24` 单行超过 `max_chunk_size` 时不切分，分块上限形同虚设。
- `emotion.py:87-99` `on_user_message` 假定 `message` 是 str，传 `None`/结构体即 `AttributeError`（`classify_intent` 已做 `str(message or "")`）。**修复**：入口统一强转。
- **依赖声明与实际 import 不符（打包缺陷）**：`pyproject.toml:10-21` 声明了 `pydantic`、`chromadb`、`aiosmtplib` 但**全仓零 import**（已 grep 确认）；而实际 import 的 **`matplotlib`（`research/figures.py:12`）与 `python-docx`（`paper.py:187+`）未声明** → 直接导致 `tests/test_research.py` 无法收集。**修复**：删 3 个死依赖，补 2 个缺失依赖（或列为 `research` 可选组）。

---

## 2.8 `think/` · `output/` · `emotion/` · `skills/`

- `think/think.py`（240 行）：结构清晰，未见 P0；建议补齐超时与失败回退。
- `output/output.py`：见 T2 分块缺陷（P2-6）。
- `emotion/emotion.py`：见 P2 非 str 崩溃；`config.py` 中的 `EmotionDecayRates` 与实现常量重复（见 2.10）。
- `skills/__init__.py`（235 行）：技能加载器，属正常规模；`skills/*.md`（`empathy.md`、`research.md`）为极简提示词，无问题。

---

## 2.9 `interfaces/`

- **死代码**：`cognition.py` 的 5 个 ABC **无任何实现者**（全仓仅 `__init__.py` 再导出引用），且签名与真实实现不符（见 C1-3）。当前它会**误导后续开发者**以为存在统一契约。
  **修复**：让各系统继承并统一签名，或删除该模块及 5 个导出。

---

## 2.10 `src/life/` 顶层模块

### P1

- **F1-1 `config.py` 整文件是死代码**：全仓**无任何模块 import `config`**（已 grep 确认）。它同时复制了 `cognition/model.py` 的 `CognitionDefaults`（且是**过时子集**——缺 `weights`/`gains`/`base_cost`/`use_*`/`need_scale`/`lability_window_seconds`）、`emotion`、`circadian`、`soul`、`relationship` 的常量，必然漂移。**修复**：删除，或反过来让实现模块从它取值作为唯一真源。
- **F1-2 `_LIFE_EVENTS` 三处逐字重复**（见 2.2 P2）。
- **F1-3 `core_client.py:76,345,348,367,398,436` 用 `print` 而非 logger**；且 `connect`/`heartbeat`/`list_agents` 单次尝试、**无重试/退避**，Core 重启即掉线。**修复**：`get_logger` + 有界指数退避。
- **F1-4 `media.py:94-113` 出站端点由设置控制**（`tts_endpoint` 来自用户设置/环境），无白名单、无鉴权、响应原样返回——SSRF 的弱化变体。**修复**：限定 `http(s)` + 运维配置主机 + 响应大小上限。
- **F1-5 `http_auth.py` fail-open**（见 T1-4）。

### P2

- 版本一致性良好：`pyproject.toml:7`、`manifest.json`、`core_client.py:18` 回退值均为 `0.1.2`，Dockerfile 未固定版本，无冲突。
- `main.py` / `__init__.py:8` 的 `gen/python` 三级 `sys.path` 拼接经核对指向 `D:/0KAY/gen/python`，**正确**（非 off-by-one）。
- 全仓无 `subprocess`/`os.system`/`shell=True`/`eval`/`exec`/`pickle`/`verify=False`（已 grep 干净）。

---

## 2.11 `world/`（独立包）

- **W-1 无法按 docstring 独立运行**：`sim.py:14`、`train.py:19-21`、`distill.py:20`、`shadow.py:17-19` 使用相对 import（`from . import ledger_rules`），而 docstring 宣称 `python world/sim.py` 可直接跑 → 实际抛 `ImportError: attempted relative import with no known parent package`（`generate_assets.py` 用绝对 import 所以能跑）。**修复**：加 `sys.path` 引导，或文档改为 `python -m world.sim` 并补 `world/__main__.py`。
- **W-2 `generate_assets.py:266` `--offline` 是空开关**：`action="store_true", default=True` → 恒为 `True` 且从未被读取。**修复**：`default=False` 并真正生效，或删除。
- **W-3 `gates.py:166-171` 注释与实现矛盾**：注释称“30 天滚动类型熵”，代码用**全量**事件历史统计，门控行为与文档不符。**修复**：先按 `time_day >= max_day - 30` 过滤。
- **W-4 与 `life.worldsim` 循环依赖**（见 W1-2）。
- `distill.py:72,88` `build_features` 重复计算 + 循环内重复 import，5000 采样热路径上有额外开销。

---

## 3. 包间依赖关系与架构评估

### 3.1 依赖方向

```
                     ┌──────────────────────────────┐
                     │        grpc/server.py        │  ← 进程入口
                     └───────────────┬──────────────┘
                                     │
                     ┌───────────────▼──────────────┐
                     │   engine/legacy.LifeEngine   │  ← 唯一权威编排器（hub）
                     └──┬────┬────┬────┬────┬────────┘
            ┌───────────┘    │    │    │    └──────────────┐
            ▼                ▼    ▼    ▼                   ▼
      cognition/        memory/  companion/  worldsim/  tools/
      （纯计算）        （持久化）（持久化）  （模拟）   （副作用）
            ▲                │         │         │
            │                │         │         ▼
       interfaces/       （lazy）   （lazy）   world/  ← 循环！world → life.worldsim
        （死代码）        cognition  cognition
```

### 3.2 结论

1. **整体分层是清晰的**：`grpc` → `engine` → {`cognition`, `memory`, `companion`, `worldsim`, `tools`}，`cognition` 是纯计算叶子，`memory`/`companion` 是持久化叶子，`engine` 作为 hub 组装一切。**没有 `memory ↔ companion` 耦合**，这是好设计。
2. **唯一的真环：`worldsim ↔ world`**（已确认）。`life.worldsim.runtime` 依赖 `world.sim/generate_assets/shadow`，而 `world.*` 又依赖 `life.worldsim.features/policy`。目前靠函数内局部 import 掩盖。**建议**：抽出 `worldsim/_contract.py`（特征构造 + 策略接口 + 常量）作为双方共同依赖，消除环。
3. **`memory → cognition` 的向上依赖**（`memory.py:327,344`，惰性 + try 守护）方向不佳：持久化层读认知配置。虽无环，但建议抽共享 `config` 模块下沉。
4. **最大架构风险：legacy / 模块化"双实现"**——`engine`（`LifeEngine` vs `TurnProcessor`/`ReflectionEngine`/`DailyCycle`）与 `companion`（`CompanionSystem` vs 4 个 Manager）都存在两套并存实现，其中模块化层**要么是桩、要么已经与 legacy 行为分歧**，却仍被 `__init__.py` 无条件导出（`life/__init__.py:19-22`）。这会让调用方无法判断该用哪个，且可能静默走到失效路径。
   **建议**：做一次明确取舍——**要么完成并切换，要么删除**。在完成前，至少从 `__init__.py` 移除导出并在 docstring 标注 WIP。
5. `interfaces/` 作为"契约层"目前是**负资产**（无实现者 + 签名不符），要么落地要么删除。

---

## 4. 修复优先级路线图

### 第 0 波：安全（建议 1 天内）
| 项 | 位置 | 动作 |
|----|------|------|
| T0-1 | `tools.py:107-111,148-152` | STARTTLS 失败即失败，禁止明文登录 |
| T0-2 | `tools.py:488-510` | URL 白名单 + 内网/元数据拦截 + 关闭重定向 |
| T0-3 | `model_client.py:30-38` | 强制 Core 前缀 + 大小上限 |
| M0-1 | `memory.py:1134-1158` | 作用域与路径统一用净化名 |
| M0-2 | `memory.py:1488-1495` | note_id 净化 + 路径越界校验 |
| T1-4/T1-5 | `http_auth.py`、`model_client.py` | 无凭证 fail-closed；支持 https |
| E1-2/E1-3 | `legacy.py:2930,3232` | 邮件审批默认关闭放行；密钥移出记忆库 |

### 第 1 波：正确性（建议 3 天内）
- `worldsim/runtime.py:35` 维度改 68（1 行）
- `companion/relationship.py:120-121` 空库崩溃（用 `_setting` 兜底）
- `model.py:111-134,152-159` 删重复字段/键
- `reflection.py:87/165`、`turn_processor.py:429/553`、`space.py:381/385` 删重复定义
- `memory.py:195-206` 弱记忆改归档而非删除
- `legacy.py:1202` 支持多工具调用
- `pyproject.toml` 删 3 个死依赖、补 `matplotlib`/`python-docx`（恢复 `test_research` 可收集）

### 第 2 波：性能与并发（建议 1 周内）
- `memory.py`：读路径去副作用（M0-4/M1-1）、Tantivy 增量索引（M1-2）、原子写（M1-5）、编码统一（M0-5）、清理残留目录（M1-6）
- `model.py decide()` 加锁（C0-2）
- `companion` 统一 DB 锁（P1-4）
- `reflection.py:47` Semaphore 提到实例级（E0-5）
- `usage.py` / `task_records.py` 改追加式写入

### 第 3 波：架构收敛（建议 2 周内）
- 裁决 `TurnProcessor`/`ReflectionEngine`/`DailyCycle` 与 `companion` 模块化管理器：完成或删除；`__init__.py` 同步
- 消除 `worldsim ↔ world` 环
- 删除 `config.py`、`fictionmap.py`、`interfaces/`（或落地）
- 抽 `cognition/_math.py` 统一 `_clamp/_sigmoid/_softmax`
- 拆分 `LifeEngine` 上帝类与 `ManageCompanion` 巨型分支
- 全仓 `except Exception: pass` 补日志；`print` 换 logger

---

## 5. 结论

`life` 的**学术与算法设计质量很高**：`cognition/` 对论文计算主张的映射精确、消融开关完备、状态空间（216 态 × 6 动作）与 OFC 泛化设计合理；测试套件 **522 用例全绿**，回归覆盖扎实。

问题几乎全部集中在**工程实现层面**，可归纳为四类：

1. **安全**（最紧迫）：`tools/` 的 SMTP 明文降级、SSRF、路径穿越，以及 `memory/` 的笔记作用域绕过与快照路径穿越——这些是真实可利用的漏洞，应最先修复。
2. **未完成的模块化重构**：`TurnProcessor`/`ReflectionEngine`/`DailyCycle`/`companion` 管理器与 legacy 双轨并存，模块化层是桩或已分歧，却仍对外导出，存在功能静默失效风险。
3. **读路径写副作用 + 重复全量 I/O**：`recall`/`search` 每次读都写库、每次重建 Tantivy 索引、每次全量重写 JSON——这是测试套件耗时 315 秒的主因，也带来并发风险（实测已出现锁竞争堆栈）。
4. **复制粘贴残留与配置漂移**：重复 dataclass 字段、重复方法定义、`_LIFE_EVENTS` 三处重复、`config.py` 整文件死代码、`pyproject.toml` 依赖声明与实际 import 不符（已导致研究工具包不可测）。

按第 0→3 波路线推进即可在两周内把工程风险降到与算法质量相称的水平。核心 `cognition/` 模块本身质量很高，是这套系统的灵魂，值得保留其设计。
