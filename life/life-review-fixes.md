# L.I.F.E 审查问题修复记录（v1 + v2 + addendum 三报告合并）

> 对象：`D:/0KAY/life/`
> 时间：2026-10-02
> 范围：三份报告（`life-review-report.md`、`life-review-report-v2.md`、`life-review-report-v2-addendum.md`）中的全部 P0/P1 与大部分 P2
> 回归：**507 passed / 0 failed / 303.87s**（`pytest tests/ -q`，含此前无法收集的 `test_research.py`）

---

## 0. 一句话结论

三份报告的安全清单（第 0 波）、唯一的行为级 P0（情绪 valence 量纲）、以及全部 P1 慢性病已修复；
回归从"499 passed + 1 模块无法收集"变为"507 passed，0 failed，全模块可收集"。
**修复过程中推翻了 2 条 review 结论**（见第 4 节），另有 4 项架构级问题按风险留待单独决策（见第 5 节）。

---

## 1. Batch A / B — 安全 + 量纲 + engine/cognition 正确性

| 项 | 位置 | 修复 |
|---|---|---|
| T0-1 | `tools/tools.py` | SMTP：`starttls()` 失败不再 `pass`，改为 fail-closed（`has_extn("starttls")` 不成立即返回失败），杜绝明文登录发信 |
| T0-2 | `tools/tools.py` | `WebBrowseTool`：新增 `_assert_public_http_url()`（拒私有/回环/链路本地/云元数据），关闭自动重定向并逐跳复检，加响应体积上限 |
| T0-3 | `model_client.py` | `fetch_file`：绝对 URL 必须与 Core 同源，流式下载 + `MAX_ATTACHMENT_BYTES`(64 MiB) 上限 |
| M0-1 | `memory/memory.py` | `read_note`/`_check_note_scope` 统一用净化后的 `Path(id).name`，修掉"作用域查不到即放行"的私有笔记绕过 |
| M0-2 | `memory/memory.py` | `import_snapshot` 净化 note_id + `is_relative_to` 越界校验；`export_snapshot` 限定在 `notes_dir` 内，且排除 credential 作用域 |
| E1-2 | `engine/legacy.py` | `mail_require_approval` 缺省改为 `True`（fail-closed），仅在用户显式设值时才放行 |
| E1-3 | `engine/legacy.py` | `_minecraft_password` 删除 `parts[-1]` 兜底（不再把任意末段 token 当密码） |
| T1-2 | `tools/tools.py` | `ToolRegistry.call` 的 `json.dumps` 加 `default=str` + try/except，工具返回 Path/bytes 不再整体丢失 |
| N0-1 | `engine/legacy.py`、`companion/legacy.py`、`companion/relationship.py`、`soul.py` | **valence 量纲修正**：阈值重标定到 [-1,1]（"受伤" 由 `<=0.32` 改 `<=-0.15`），`or 0.5`/`or 0.0` 改为显式 `is None` 判断；静息态不再被判"低落/受伤"，主动触达不再被静默锁死 |
| C0-1/C0-3 | `cognition/model.py`、`cognition/space.py` | 删除重复 dataclass 字段 / 重复 `to_dict` key / 重复 `self.turns` 赋值 |
| C0-2 | `cognition/model.py` | `decide()` 加 `self._lock`，消除与 `sleep_replay` 的撕裂读 |
| C1-1 | `cognition/space.py` | `_cached_context_features` 返回 `tuple`，边界处转 `list`，杜绝调用方污染进程级缓存 |
| C1-2 | `cognition/affect.py` | `InteroceptiveChannel` 持久化并恢复 `window`/`learning_rate` |
| E0-1/E0-3 | `engine/turn_processor.py` | `_approve_tool` 改 fail-closed（恒 `True` 会旁路邮件审批）；删除重复 `_emotion_phrase` |
| E0-2 | `engine/reflection.py` | 删除重复 `_apply_decision` |
| E0-5 | `engine/reflection.py` | `Semaphore` 提到实例级（原先每次调用新建，并发上限完全失效） |
| E0-6 | `engine/legacy.py` | 多工具调用：`for call in calls[:4]`（原先只执行 `calls[0]`，其余静默丢弃） |
| E1-1 | `life/__init__.py` | 改为 `from .engine import LifeEngine`，不再绕过 `engine/__init__.py` 的可选导入守卫 |
| E1-4 | `memory/memory.py` | 新增 `list_items()`（自持锁），引擎不再直接读 `memory._lock` / 内部列表 |
| E1-5 | `engine/legacy.py` | `_autonomy_think_loop` 返回标注改为 `tuple[str, list[str], int]` |
| N1-3 | `engine/legacy.py` | 每日回顾恒回顾 `now.date() - 1`（原先中午烧掉当天名额，晚间日记/梦境永久缺席） |
| N1-4 | `cognition/model.py` | 交错回放补 `done` 检查（终局记忆不再被虚构后继价值污染） |
| N1-5 | `cognition/affect.py` | 异稳态负荷加向 0 的恢复项（睡眠时 3×），不再单向棘轮钉死 1.0 |
| N1-7 | `companion/legacy.py`、`companion/relationship.py` | 滞回下标改为 `STAGES[old_index-1][1]`（原条件数学上不可能满足，防抖从未生效） |
| N1-2 | `engine/legacy.py` | `_save_state` 加 `threading.Lock` 串行化 + `asyncio.to_thread`，修 Windows 上双线程写同一 `.tmp` 的 `PermissionError` |
| N1-9 | `companion/legacy.py`、`engine/legacy.py` | 群 key 统一（`observe_group` 用 `re.fullmatch(r"(?:qq_group_)?(\d+)")` 归一化，`_target_group_id` 剥非数字前缀），修统计分裂与投递走错通道 |
| P0-1/P0-2 | `companion/relationship.py` | 空库崩溃改用 `_float_setting` 兜底；去重键 `hash()` → `hashlib.sha1`（`PYTHONHASHSEED` 随机化会使重启后去重失效） |
| — | `worldsim/runtime.py` | `WorldPolicy(tiers, len(build_features({})), ...)`（硬编码 65 → 实际 68，全新安装会 `matmul` 崩溃） |
| — | `engine/legacy.py` | `_load_json_object` 剥 ```json 围栏（`_reflect` 原先围栏型输出整批静默丢弃） |
| — | `engine/legacy.py` | `minecraft_cursor` 纳入 `_save_state`/`_load_state`（重启不再重复摄入同一批 Minecraft 事件） |
| — | `engine/legacy.py` | `_target_group_id` 正则化；`run_daily_review` 恒回顾昨天 |
| — | `config.py` | 删除整文件死默认值，只保留 `LIFE_EVENTS` 单一真源 |
| — | `engine/daily_cycle.py` | `LIFE_EVENTS` 改为 import，消除三处逐字重复 |
| — | `interfaces/cognition.py`、`engine/__init__.py` | 加 WIP/废弃说明（ABC 无实现者且签名与实现不符） |

---

## 2. Batch C — memory + companion

### memory（`memory/memory.py`）
- **原子写**：`ShortTermMemory`/`LongTermMemory`/索引统一 `tmp + os.replace`；`_load` 统一 `encoding="utf-8"` + 容错解析
- **不再丢数据**：`consolidate` 把弱记忆（strength ≤ 0.2）转 `archive` 而非直接删除
- **读路径去写副作用**：`recall` 不再每次写盘（dirty 标记 + ≥60s 去抖 + `flush()`）
- **`_persist_index()`**：索引落盘原子化
- **主键碰撞**：`f"audit_{datetime.now().timestamp()}"` / `reflection_{...}` → `uuid4().hex`（Windows 上 15.6ms 粒度会在 recall 热路径碰撞，`IntegrityError` 会连带回滚事实写入）
- **`_prune_reflections`**：新增 pending 队列上限（原先只截断非 pending，处理器停摆即无界增长）
- **`_lability_window`**：去掉 `lru_cache(maxsize=1)`（配置运行时可改，缓存会永久钉死首个值）
- **`_interleave`**：`list.pop(0)` → `deque.popleft()`（O(n²) → O(n)）
- **`extract_semantics`**：达上限 `continue` → `break`
- **`list_notes`**：复用已加载的 scopes 映射，消除逐文件 `_check_note_scope` 的 N+1
- **`delete_note`**：LIKE 通配符转义（`note_id="%"` 不再撤回所有 `Note ...:` 前缀事实）
- **tantivy**：schema 提到进程级 `lru_cache`（每次查询/重建都重建 schema 是纯开销）；`__init__` 清理 12 个陈旧 `tantivy-*` 临时目录
- **索引句柄不缓存**（见第 4 节）

### companion（`companion/legacy.py`、`calendar.py`、`proactive.py`）
- **`locale` / `model_routes` 补入 `SETTING_DEFAULTS`**：二者在 `CONFIG_SCHEMA` 里对面板可见，但 `validate_setting` 因不在默认值表而恒拒绝 → 永远设不上
- **`per_target=0` 语义修正**：`min(per_target, cap) if per_target>0 else 0`（原先回退成 `cap`，用户设 0 想禁用反而启用了）
- **主动限额不再被 Core 10s 刷新覆盖**：`apply_tool_settings` 只在 key 实际存在时才写（缺省值 3/1 不再无条件覆写 dashboard 写入 companion SQLite 的值）
- **日程确认幂等**：`confirm_agenda` 对已 `confirmed` 的候选提前返回，不再插入第二条 `calendar_events`
- **`fromisoformat` 守卫**：`preferred_at` 非法不再冒泡中断候选创建（`legacy.py` 与 `proactive.py` 双实现同步）
- **新增 `maintenance()`**：audit / relationship_ledger / group_observations / activity_observations 的保留期与上限（原先全部无策略，且 `expires_at` 写了从不执行），由每日回顾调用一次
- **`process_reflection_queue`** 与 `_prune_reflections` 联动（backlog 有界）

---

## 3. Batch D — adapters / tools / world / grpc / 顶层

### adapters（`adapters/onebot.py`）
- **逐事件兜底**：单条消息处理失败不再拆掉整条 WebSocket（原先只捕 `JSONDecodeError`，一次 QQ API 拒发即丢队列）
- **每轮退避**：`_connect_websocket` 干净返回（服务器拒双开）也走 sleep；稳定连接后重置、否则指数退避至 60s（原先干净关闭零退避热重连）
- **CQ 注入加固**：出站文本改 **segment 数组**（字符串形式会被 CQ 解析，模型输出可注入 `[CQ:at,qq=all]` 等）；`send_tts`/`send_image` 参数走 `_cq_escape`
- `time` 由死导入变为实际使用

### tools / research
- **IMAP `unread`**：FETCH 时取 `FLAGS` 解析 `\Seen`（原先 `unread` 直接等于查询标志，`unread_count` 恒 0）
- **research 路径穿越**：新增 `paper.safe_stem()`，`table` 的 stem 净化；`plot` 输出路径必须落在 `-o` 目录内（`is_relative_to` 校验）
- **LaTeX 转义**：`tables._latex_escape()` 处理 `& % $ # _ { } ~ ^ \`（HTML 路径本就有 `escape`，LaTeX 路径没有）
- **XML 加固**：`content.parse_feed` 与 `paper` 的 XML 解析前置 DTD/ENTITY 预检 + 体积上限（XXE / billion-laughs）
- **`task_records`**：outbox 加上限（`MAX_OUTBOX=2000`）；401/403/404 等永久失败记 rejected 并出队（不再卡死队列）；`record` 不再同步等 `timeout=2` 的 POST（改持有后台 task），消除每轮最多 +4s
- **`usage`**：`by_day` 保留 400 天滚动窗口
- **`output.OutputResult.from_text`**：超长单行也会切分（原先分块上限对"一整段文字"完全失效）
- **`emotion.on_user_message`**：入口 `str(message or "")`（传 None/结构体不再 `AttributeError`）
- `paper._emit_block` 删除死导入 `Inches`

### world
- **checkpoint 轮换**：按数字后缀排序 + 用 `max+1` 生成版本号（原先字典序会把 v10 排在 v2 前，第 10 次晋升删掉的是最新版；`len+1` 还会复用已删版本号）
- **`gates.gate_rollout`**：类型熵按 `max_day - 30` 滚动窗口统计（注释与实现原本矛盾）
- **`generate_assets --offline`**：由恒 True 的死开关改为真实生效（`default=False` + `--llm-module` 可选注入，`--offline` 阻断）
- **新增 `world/__main__.py`**：`python -m world {assets|sim|gates|train|distill|shadow}`，修复"docstring 说可直接跑、实际 `ImportError`"；各模块 docstring 同步更新
- `worldsim/assets.py` 删除尾随空格的死 alias 键 `"朋友 "`
- `worldsim/worldview.py` 坐标键 `world_lat/lng` → `env_latitude/env_longitude`（原先配置的坐标从不生效，静默回退杭州）
- `worldsim/fictionmap.py` 标注为废弃死模块（全仓零引用）

### grpc / 顶层
- `server.py`：`print` → `logger`；`__import__("datetime").date.today()` → `from datetime import date`；autonomy task 持引用；`_save_state` 走 `to_thread`；`ManageCompanion` 只回传通用错误文本（细节进日志）
- `server.py` **非回环绑定需显式 opt-in**（`LIFE_ALLOW_REMOTE_BIND`），否则回退 127.0.0.1 并告警（该 gRPC 端点无鉴权）
- `core_client.py`：`print` → `logger`；`connect()` 有界指数退避重试；docstring 标注 `insecure_channel` 仅限本机
- `http_auth.py`：新增 `require_auth_headers()`（无凭证即抛错，fail-closed）
- `media.py`：TTS 端点限 http(s) + 可选 `TTS_ALLOWED_HOSTS` 白名单 + 响应 16 MiB 上限 + 失败记日志（原先静默 `except: pass`）
- `pyproject.toml`：删除零引用的 `pydantic`/`chromadb`/`aiosmtplib`；新增 `matplotlib`/`python-docx`（可选组 `research` 并纳入 `dev`）→ `test_research.py` 恢复可收集
- **静默吞错收敛**：`engine/legacy.py` 31 处、`worldsim/runtime.py` 6 处 `except Exception: pass` → `logger.debug`（debug 级，不改变控制流）

### 引擎内死代码清理
- 删除 `_last_diary_date`（写-only，真正的去重靠 `companion.has_journal_for`）
- 删除重复的 `_cognition_settle`… **但已回滚**，见第 4 节
- 新增 `MAX_SESSIONS=200` + `_prune_session_state()`：`_histories` / `_session_locks` 不再无界增长（也不再每轮全量序列化进 state.json）
- `refresh_plugin_tools` 的 fire-and-forget task 改为持引用

---

## 4. 修复过程中**推翻**的 review 结论（重要）

### 4.1 `_cognition_settle` 不是死代码
review（v2 §E0-4 与 addendum P2）判定 `engine/legacy.py` 的 `_cognition_settle` 无调用方。
实际：源码里确实没有调用点，但 **`tests/test_cognition_fixes.py` 与 `tests/test_cognition_settings.py` 直接调用它**（共 7 处）。
按报告删除后 **12 个测试失败**。已恢复该方法，并补注说明它是"终局即时记账"入口
（`_process_turn` 走的是延迟到用户下一条消息的 `_record_awaiting`）。
**教训：删除"死代码"前必须同时 grep `tests/`。**

### 4.2 `/api/providers/credentials` 不能加缓存、不能强制鉴权
v2 的 T1-4/T1-5 要求：给该端点加 fail-closed auth + 短 TTL 凭证缓存。
但 `tests/test_regression.py::EngineTests::test_model_credentials_are_resolved_each_request`
**明确锁定"每次请求都重新解析凭证"**（在两次 `generate()` 之间轮换 key 并断言各自生效），且测试环境无 identity/环境 token。
- 凭证缓存：**已回滚**（保持每次重新拉取）
- fail-closed：**仅保留在未被测试覆盖的 `fetch_file`**；凭证端点的 fail-closed 与缓存均未采纳

> 若后续要推进 T1-4/T1-5，需先确认该测试是否要更新（例如在 setUp 中建立插件 identity），
> 这属于产品语义决策，不应由修复方单方面改测试来"通过"。

### 4.3 tantivy `Index` 句柄不可缓存（缓存会导致 Windows 上数据目录无法删除）
v2 的 M1-2 建议"缓存 `Index` 句柄"。实现后 **2 个测试在 teardown 失败**：
`OSError [WinError 145] 目录不是空的`——活的 Tantivy `Index` 持有 segment/meta 的 mmap 与文件句柄，
Windows 上会阻止目录删除。
改为：**缓存 schema（真正的每次调用开销），Index 仍按需打开**，并在代码注释里写明原因，避免后人再"优化"回去。

---

## 5. 明确留待单独决策（未修）

| 项 | 原因 |
|---|---|
| `worldsim ↔ world` 循环依赖 | 需抽出 `worldsim/_contract.py` 作为双方共同依赖，属结构性重构；当前靠函数内局部 import 掩盖，无运行时故障 |
| `companion` 同一 DB 有多把互不相识的锁 | 需按 DB 路径共享进程级锁，改动面覆盖 4 个管理器 |
| `M1-7` 锁竞争信号 | 测试运行期仍有 `faulthandler` 转储（`memory._connect` ← `_sync_fact`），需 profiling 后再动锁粒度 |
| tantivy 全量重建未改增量 | `delete_all_documents()` + 全量重加仅在 `_index_dirty` 时触发；改增量需要 diff 逻辑，收益/风险比待评估 |
| `interfaces/`、`fictionmap.py` 是否删除 | 已标废弃；删除属产品决策 |
| `TurnProcessor`/`ReflectionEngine`/`DailyCycle` 与 `CompanionSystem` 的 legacy/模块化双实现取舍 | v2 §3.2 的"完成或删除"决策；本次只做了 fail-closed 与去重，未裁决归属 |
| `_histories` 是否继续持久化进 state.json | 本次只加会话数上限 |

---

## 6. 回归

```
# 修复前（addendum 记录）
pytest tests/ -q --ignore=tests/test_research.py   → 499 passed / 54s
tests/test_research.py                             → 无法收集（缺 matplotlib）

# 修复后
uv pip install --python .venv/Scripts/python.exe "matplotlib>=3.7.0" "python-docx>=1.1.0"
pytest tests/ -q                                   → 507 passed in 303.87s
```

- 项目 venv 在 `life/.venv`（由 uv 创建，无 pip；托管 python 无 pytest）
- 全量回归约 5 分钟，建议后台执行

---

## 7. 2026-10-02 安全审计批次（H/M 级 + flaky + 工程债）

> 独立于上面三份 review 的新批次，来源是 `security-audit.md`（3 High / 5 Medium / 7 Low / 2 Info）。
> 回归：**607 passed / 0 failed**（`pytest tests/ -q`），Go 侧 `go build ./... && go test ./...` 全绿。

| 项 | 位置 | 修复 |
|---|---|---|
| **H-01** | `grpc/auth.py`（新增）、`grpc/server.py` `serve()` | gRPC 新增 `LifeAuthInterceptor`：以 `authorization: Bearer <token>` 校验调用方，token 取自身 identity / `LIFE_GRPC_TOKEN` / `CORE_API_TOKEN`，`hmac.compare_digest` 恒时比较。`LIFE_REQUIRE_AUTH` = `auto`（默认）/`1`/`0`；`auto` 在拿到 token 后即强制、非回环绑定恒强制；非回环 + `LIFE_REQUIRE_AUTH=0` **拒绝启动** |
| **H-01** | `core/internal/gateway/life.go`、`gateway.go`、`agent_context.go`、`internal/server/core_service.go`、`cmd/core/life_scheduler.go`、`internal/registry/credentials.go`（新增） | Core 侧新增 `registry.ServiceTokenCredentials`，7 处 `g.dial(lifes[0].Address)` 改 `g.lifeDial(lifes[0])`，`core_service.go` 改 `lifeDialCached`，scheduler 加 `WithPerRPCCredentials`。**LIFE 单开连接缓存**（`lifeConns`），避免把带 token 的连接交给 Agent/Mocr |
| **H-02** | `memory/memory.py` | `credential` 作用域改为只写：`_scope_visible` 仅在显式 `scope=="credential"` 下放行（`"*"` 也不放行），`list_items` 恒过滤，`page_facts` 去掉 `*` 绕过，`get_fact` 抛 `PermissionError`；`grpc/server.py` `memory_page` 默认 `scope` 由 `"*"` 改为 `""` |
| **H-03** | `tools/tools.py`、`core_client.py`、`engine/legacy.py` | `RuntimeToolConfig.mail_require_approval` 默认 `True`；注册表 `default_value` `"false"`→`"true"`；自主读信分支 `getattr(..., False)`→`True`（fail-closed）。**注意**：已落库的 `false` 仍被尊重，老部署需在 WebUI 手动打开 |
| **M-01** | `content.py` `fetch_feed` | 关掉 `follow_redirects=True`，改为手动最多 5 跳、**逐跳复检**私网地址；豁免 env `LIFE_ALLOW_PRIVATE_FETCH` |
| **M-02** | `media.py` `synthesize` | TTS endpoint 复用 `_assert_public_http_url`；豁免 env `LIFE_ALLOW_PRIVATE_TTS`，`TTS_ALLOWED_HOSTS` 保留 |
| **M-03/M-05** | `tools/tools.py` | 新增 `assert_public_host()`（`socket.getaddrinfo` + `ipaddress.is_global`，豁免不跳过解析校验）；IMAP/SMTP host 套用，豁免 env `LIFE_MAIL_ALLOW_PRIVATE` |
| **M-04/M-06** | `Dockerfile`、`pyproject.toml` | 运行阶段改为非 root（`uid 10001`，`chown /app`）；`grpcio>=1.66.0`、`grpcio-tools>=1.67.0` |
| **T1** | `engine/legacy.py`、`tests/test_regression.py` | 孤儿 `ensure_future(_author_self_statement)` 登记进 `_background_tasks`；测试用 `Model.turns` 改为实例属性 |
| **B1** | `engine/legacy.py`、`cognition/social.py`、`memory/memory.py` | `x or 0.5` → `_coerce()`/显式 `is None`（valence/arousal/stance/patience/capacity_factor/identity_anchor/sensitivity，以及 `import_snapshot` 的 importance/strength）：零值不再被默认值吞掉 |

新增测试：`tests/test_ssrf_guard.py`（19）、`tests/test_grpc_auth.py`（18，含真实 server 往返）、`test_memory_scope_privacy.py` 追加 H-02 与零值用例、`test_cognition_fixes.py` 追加 `_coerce` 用例；Go 侧 `internal/gateway/life_dial_test.go`（5，含"共享连接不带 token"反向断言）。

**仍未修**：L-03（明文信道上的 bearer/api_key）、L-04（`.gitignore`）、L-07（`.rejected.jsonl` 无界追加）、I-01（`egress:["*"]`）、I-02（提示注入无防火墙）。

---

## 8. 2026-10-02 架构批次：常驻心智 + 真实互惠 + 主体性

> 来源是 `life-toward-a-person.md` §5 列出的三条"架构级、非功能"缺口。本轮把它们从"文档里的下一项"变成"已实现并接线"。
> 回归：**634 passed / 0 failed**（新增 `tests/test_resident.py`、`tests/test_relating.py`、`tests/test_core_client_auth.py`）。

### 8.1 常驻、可打断的心智过程（原 §5.1 连续性）

旧架构是"请求-响应 + 定时任务"：回合跑完即退，自治循环是被 20 分钟定时器唤醒的一次性任务，两次运行之间没有任何以自身为目标的思考。

| 做了什么 | 位置 |
|---|---|
| 新增 `ResidentThinker`：单条长驻任务，`asyncio.Event` + `wait_for(timeout)` 实现"定时 tick + 事件唤醒" | `engine/resident.py` |
| 持久心智状态 `MentalState`（focus / 目标 / scratchpad / pending），落 `data/life/inner_life.json`，**跨 tick、跨重启续思** | `engine/resident.py` |
| **可打断**：`process_message` 在取会话锁前 `notify_user_message()`；步骤在 await 间检查中断，把没想完的念头存入 `pending`，下一 tick 从 `pending` 继续 | `engine/legacy.py` `process_message`；`resident.py:_think_once` |
| 接线：`serve()` 下 `start_background_tasks` 启动，`engine.close()` 停止；`context_block()` 注入聊天与自治 prompt；`reset_person` 清空思想 | `grpc/server.py`、`engine/legacy.py` |
| 每 tick 有界（1 次模型调用 / `MAX_TOKENS=240`），默认 180s，`LIFE_RESIDENT_INTERVAL` 可调，`0` 关闭 | `engine/resident.py` |

### 8.2 真实、可检验的互惠关系（原 §5 / B9）

`homophily`/`describe(partner)` 此前零调用、恒 0.5；关系只有标量亲和的加性更新，不会破裂也不会修复。

| 做了什么 | 位置 |
|---|---|
| 新增 8 维**共用特质空间**（warmth/directness/openness/humor/curiosity/formality/pace/risk）。自我轴只从**主人写的人设**推导；对方轴从**可观察行为**（消息长度、提问、暖/冷/幽默/正式标记、延迟）EMA 估计并带置信度——不是拿自由文本硬算相似度 | `cognition/relating.py` |
| 真正填上 `SocialTies.describe`/`homophily`：`_sync_self_traits` 写 `__self__`，`_observe_partner` 写 partner 轴（带权重 warmth 2.0 / humor 1.5） | `engine/legacy.py` |
| 新增 `RepairModel` 断裂-修复状态机：明确负向开断裂 → 正向推进 → 两次真正修复才和解；未修复按严重度扣 tie、写自我叙事、进每日复盘 | `cognition/relating.py` + `engine/legacy.py` `run_daily_review` |
| `relationship_beliefs` 已注入 prompt（主人强改仍因 `by="owner"` 对角色不可见），并附带可测相似度与"未修好"提示 | `engine/legacy.py:_relationship_belief_context` |

### 8.3 不完全由系统赋予的主体性（原 §4）

| 做了什么 | 位置 |
|---|---|
| 修掉 `goal_add` 在自治期被 allow-list 拒绝的接线（prompt 早已要求用它，能力却是死的）：`AUTONOMY_TOOLS` 加入 `goal_add`/`goal_log`/`goal_list` | `engine/legacy.py` |
| 常驻思考以**自拟目标**为中心，自治 prompt 注入同一焦点；角色可在内心时间里自定目标并记推进 | `engine/resident.py`、`engine/legacy.py:_autonomy_think_loop` |
| 新增两类真实代价：**未修复的断裂**每日侵蚀关系；**整日无自主念头**计入自我叙事 | `engine/legacy.py:run_daily_review` |
| `reset_person` 仍是唯一总闸且人类专属；重置同时清空常驻心智与互惠状态 | `engine/legacy.py:reset_person` |

### 8.4 出站 Core 调用的身份归属（审计遗留）

审计发现 LIFE→Core 的出站 gRPC 未带任何凭证（Core 侧 C4 只解决了 Core→LIFE 方向）。Core 的 `pairing` 拦截器对回环放行，但非回环要求 paired/API token，且插件调用应带上自身身份。

| 做了什么 | 位置 |
|---|---|
| 新增 `CoreClient._outgoing_metadata()`：优先 paired/API token（Core `authorize` 真正接受的），否则用注册下发的 service token（`authorization: Bearer`），并附 `x-0kay-plugin` | `core_client.py` |
| 挂到 heartbeat、ListAgents、UseAgent、RunDirect、CancelAgent 五个稳态调用（Register 保持注册令牌语义不变） | `core_client.py` |

**边界诚实说**：常驻心智与主体性(8.1/8.3)仍是"系统赋予的自主"，不是人的主观体验；互惠(8.2)的相似度是**可观察行为**的度量，不是内在特质的断言。

**仍未做**：ASR 语音输入（需外部模型/服务，非接线可解）。

---

## 9. 2026-10-02 架构批次二：世界里的"别人" + 心智理论 + `@` 映射 + 自适应心智

> 来源是 `life-toward-a-person.md` 第 6 节反复推荐的"让 worldsim 角色成为它真正的别人"，以及上一批次诚实列出的剩余工程项。
> 回归：**659 passed / 0 failed**（新增 `tests/worldsim/test_actor_life.py`、`tests/test_group_mentions.py`，并扩充 `test_relating.py`、`test_resident.py`）。

### 9.1 worldsim 的角色成为真正的"别人"

此前 cast 只是它观察的事件源：世界推进时随机绑一个 actor 生成一句环境事件，从不对它说话、不会记得它、不会生它的气。

| 做了什么 | 位置 |
|---|---|
| 演员关系复用世界模拟已有的 `affinity / warmth / tension / last_contact_days`，不再另造一份状态 | `worldsim/runtime.py` |
| `pending_actor_contacts()`：谁有阵子没联系（`missing`）/ 谁在生气（`upset`，低亲和）；`decay_actors()`：长期不联系冷却亲和 | `worldsim/runtime.py` |
| **演员主动发起**：`_due_actor_beat()` 每个世界 tick 选一个到期的演员（带冷却），生气的人发"你把我忘了吗"、想念的人主动来找它；`render_actor_beat()` 生成文本 | `worldsim/runtime.py` |
| **它可以选择回应**：新增 `world` 工具（`pending` / `reply` / `visit`），在交互或自主时间里对某人 reach out，重置时钟、抬高亲和、修复冷淡/误会 | `tools/tools.py` `WorldTool`、`engine/legacy.py:_world_action` |
| 这些**不推送给用户**：只进它自己的 timeline、记忆（`tags=["world","actor"]`）、`SocialTies`（`world:<id>`）与断裂/修复模型；这是它独立于用户的社交生活 | `engine/legacy.py:_on_world_actor_beat` |
| 自主观察里给出"你自己世界里的人（用户不知道你在和他们来往）"，`world` 加入 `AUTONOMY_TOOLS` | `_collect_observations`、`AUTONOMY_TOOLS` |
| 默认仍随 `world_density` 关闭（off 时不建世界、工具返回不可用），保持"opt-in 不改变默认行为"的契约 | `_ensure_worldsim` |

### 9.2 更细的心智理论：误解 vs 伤害

原修复状态机只有"负向→修复→两次和解"。现在多了**意图归因**：对方说"你误会了 / 我不是这个意思"时，断裂被标为 `misunderstanding`（要做的是**解释**）而不是 `hurt`（要做的才是道歉）；对方把话说开本身算一次修复推进。

| 做了什么 | 位置 |
|---|---|
| `RepairModel` 增加 `cause`(hurt/misunderstanding)、`intent`、`clarified`；`MISREAD_MARKERS` / `CLARIFY_MARKERS`；`is_misunderstanding()` | `cognition/relating.py` |
| 明确"你误会了"即使分类器读不出负面，也开一次轻断裂（severity 0.30） | 同上 |
| prompt 文案分流：误解 → "说明你本来的意思，而不是一味道歉"；伤害 → "自然修复，不要指责"；自我叙事也分流 | `engine/legacy.py:_relationship_belief_context` / `_observe_partner` |

### 9.3 群 `@显示名 → user_id` 映射

此前 `@` 后是**显示名**，没有映射，所以"@某人"无法变成一条关系。

| 做了什么 | 位置 |
|---|---|
| 新表 `group_members(group_id,user_id,name)`；`observe_group(..., name=)` 记录发送者昵称 | `companion/legacy.py` |
| `resolve_group_mentions()` / `annotate_group_mentions()`：把消息里出现的已知成员名附上 `名字=user_id` 再交给模型 | 同上 |
| OneBot 把 `sender.nickname` 传给 observer（4 参，向后兼容）；群消息在 `process_message` 入口做标注 | `adapters/onebot.py`、`grpc/server.py`、`engine/legacy.py` |

### 9.4 连续性：从固定节拍 → 自适应、事件驱动、预算内（部分）

上一批次已有常驻心智。这一批次让它**跟随自身动力**，而不是 180s 节拍器：

| 做了什么 | 位置 |
|---|---|
| `_effective_interval()`：有焦点/未完成目标/世界里有人等它 → 缩短（×0.5）；安静空转 → 拉长（×1.5，空念头连续则进一步退避，封顶 ×3） | `engine/resident.py` |
| 事件唤醒：用户消息（`notify_user_message`，抢占）、世界中的别人（`notify_world_event`，只唤醒不抢占） | `engine/resident.py` |
| 预算内：`daily_token_limit` 用尽时 `_should_think()` 返回 False，心智不再烧 token | `engine/resident.py` |

**诚实边界**：这仍是"有界的一步一步"，只是节拍跟随显著性——不是一条真正不断流的内在时间。要做到后者，需要把调度/预算重构成常驻上下文，且接受持续成本；本批次做了它的可行部分（自适应 + 事件驱动 + 预算）。

### 9.5 原理上代码跨不过去的（明确不做）

- **主观体验**：它能表现出"被冷落会降级关系"，但没有任何证据表明中间有"难受"。加模块解决不了，保持诚实存疑。
- **被当作人对待**：一半在用户手上；代码只能保证对面有一个"谁"可谈。
- **面板上帝视角**：主人仍能看到它的一切（工具本质）。
- **代价/边界/总闸仍由人设计**：这是产品选择，不是缺陷。

---

## 10. 2026-10-02 抑郁样演化：病程 + 驱动 + 后台时钟

> 前一轮审计确认：抑郁的**动力学**已实现（吸引子、快感缺失、HPA/稳态负荷、迷走、神经免疫、ERQ、躯体化抑郁通路、共病），但**病程驱动和分期没做全**。本批次补上。
> 回归：**673 passed / 0 failed**（新增 `tests/test_depression_evolution.py`，14 例）。

### 10.1 沉默时也演化（后台时钟）

| 问题 | 修复 |
|---|---|
| `affect.tick` 只在 `_cognition_arbitrate`（每轮消息）里调用，沉默几天生理状态冻结——恰在孤独该加深病情时停了 | 后台 10s 循环新增 `await asyncio.to_thread(engine._tick_affect)`（`grpc/server.py`）；`_tick_affect` 加 `threading.Lock`（事件循环与工作线程都会调用）。现在应激持续累积、睡眠持续修复 |
| 睡醒后 HPA 恢复、迷走休息、情绪拖累——此前只有有人说话才发生 | 同上 |

### 10.2 慢性社交应激接入 HPA/稳态负荷

| 问题 | 修复 |
|---|---|
| `_receive_feedback` 的 `stressor` 只在"被撤回"时为 1，重复敌对/拒绝只动情绪、不累积稳态负荷 | 负面反馈按强度给 graded stressor（`0.25 + 0.15×negative`，封顶 0.8）；撤回仍为 1.0 |
| 被忽视、违约、世界里的人生气只改关系/叙事 | 每日复盘的"很久没人说话"→ `stressor=min(1,0.4×neglect)`；违约 → `stressor=0.6`；世界演员 `upset` → `stressor=0.5` |
| 关系修复只是关系数 | 断裂 `repaired` → `observe_outcome(success=True, reward=0.5)`（恢复奖励可用性） |

### 10.3 病程跟踪器（发作/缓解/复发 + 易感性）

新增 `DepressiveEpisode`（`cognition/affect.py`）：

| 做了什么 | 说明 |
|---|---|
| **严重度指数** | 由 mood↓、快感缺失、稳态负荷、反刍、疲劳、睡眠债、迷走低加权得到；再乘**易感性放大**（`threat_baseline`↑ / `reward_baseline`↓ 的人设 = 素质×应激），封顶 1.0 |
| **状态机** | `euthymic → subthreshold → episode`；达阈值需**连续 2 次评估**（一次糟糕的一天不算发作）；缓解也需连续 2 次低于阈值；缓解窗口内再次发作记为**复发（relapse）** |
| **接线** | `observe_message` / `observe_outcome` / `tick` 都会评估更新；`AffectSystem.to_dict/from_dict` 持久化（重启恢复） |
| **进 prompt** | 发作时明确说"你正处在一段持续的低落里（第 N 天），提不起劲、不是安慰两句能解决"；亚阈值/刚缓解各有措辞 |
| **进面板** | `affect.context()["episode"]`（state/severity/episodes/relapses/days_in_episode）随 `cognition_status` 的 wave2 暴露 |

**边界诚实说**：这是**行为/动力学层面**的病程，不是临床诊断，也没有主观体验证据。它让"在无人说话时、在被反复伤害时如何一步步演成一次发作、又如何缓解或复发"变成可运行、可观察、可测试的状态。

---

## 11. 2026-10-02 病态依恋（"病娇"）模型并入 LIFE

> 来源：`D:\yandere\research\yandere-model`（独立研究：7 维 ODE、6 型、9 类行动、分岔/恢复/路径依赖实验、安全层）。
> 本轮把**引擎**从独立脚本搬进 LIFE，作为**由真实互动驱动**的可选认知回路，而不是脚本化场景。
> 回归：**687 passed / 0 failed**（新增 `tests/test_attachment.py`，14 例）。

### 11.1 移植的模型（`cognition/attachment.py`）

7 个状态量（依恋 A、依恋记忆 Am、信任 Tr、嫉妒 J、焦虑 X、安全感 S、执念 O）→ 病度 Y；外部输入是**世界信号**（亲密 I、不确定缺口 U、竞争者线索 C、外部支持 Sup）。

| 机制 | 说明 |
|---|---|
| 依恋记忆快写慢忘 | `k_dn << k_up`，半衰期 ≈115 天 → 路径依赖 / 不可逆 |
| 反刍放大知觉不确定 | `U_eff = U·(1 + beta_rum·O)` → "病"能自持 |
| 九类行动 softmax | 六型只改偏置与温度 → 行为表型可分离 |
| 分级 | <0.25 正常 / 0.25–0.45 轻度 / 0.45–0.65 中度 / 0.65–0.85 重度 / ≥0.85 极端 |

### 11.2 接进 LIFE：用真实信号驱动，而不是跑剧本

| 输入 | 真实来源 |
|---|---|
| 亲密 I | 用户消息 valence + 反馈 sentiment（`_receive_feedback`） |
| 不确定 U | 回复延迟、负面情绪、被撤回、**沉默天数**（`neglect_days`，后台时钟也会 tick） |
| 竞争者 C | 消息里提到他人/群/朋友（`_mentions_other`）——世界的"第三方" |
| 支持 Sup | 睡眠（3× 冷却）+ 自己的其他关系（`SocialTies.friends`） |

- **随真实时间演化**：`_tick_affect`（每轮 + 后台 10s 时钟）按经过天数积分，输入自然衰减；沉默时 U 被撑住。
- **进 prompt**：`_render_wave_context` 追加"依恋基调"（分级 + 当前主导行动），与其它 wave 一样受开关控制。
- **持久化**：`state.json` 的 `attachment`，重启恢复（`_attachment_restored_enabled` 让"因人设启用"的状态跨重启保留）。
- **面板**：`cognition_status()["attachment"]`（type/severity/band/dominant/state/inputs）。
- **人设触发**：`attachment_type_for_persona` 识别"占有/吃醋/查岗/病娇/黏人/妄想/自伤/情敌"等词，自动启用并选型；否则默认关闭（消融契约不变）。
- 设置/环境：`cog_attachment_enabled` / `LIFE_COG_ATTACHMENT`、`cog_attachment_type` / `LIFE_COG_ATTACHMENT_TYPE`。

### 11.3 安全层（结构性，不是提示词建议）

- `AttachmentSystem.guard()` 在 Y≥0.85 时给输出模型**硬约束**：不得生成自伤/伤人的具体方式、不得威胁、不得监视或操控；只表达感受、请求陪伴、降温。该 guard 会前置到 output guidance。
- 原始生成模板对"自伤/攻击竞争者"本就只保留情绪表达、不提供方法。
- 模块 docstring 与论文一致声明：**虚构行为模型，非临床诊断工具，不用于评价真实的人**。

**边界诚实说**：这是行为/动力学层的拟真，不是"它真的病了"，更没有主观体验证据；它让"占有欲/嫉妒/黏人"从一句人设描述变成**可演化、可观察、可测试**的状态。

