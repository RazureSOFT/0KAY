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

