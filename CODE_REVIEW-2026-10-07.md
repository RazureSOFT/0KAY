# 0KAY 全仓代码审查与修复（2026-10-07）

> 范围：本仓库跟踪的源码与产物 —— `core` / `mocr` / `obs`（Go）、`life`（Python）、
> `webui` / `plugin-web`（Vue3+TS）、`proto`、根 `manifest.json`、发布文档。
> `agent/`、`mcp/`、`minecraft/`、`pm/` 等为独立仓库，不在本次范围内。
> 方法：逐模块通读 + 交叉核对 HTTP/gRPC 契约 + 实际执行 build / vet / gofmt / lint / test。
> 本次目标版本：**0.1.3**。

---

## 0. 实测结果（修复后）

| 组件 | 命令 | 修复前 | 修复后 |
|---|---|---|---|
| Core (Go) | `go build/vet/test ./...`、`gofmt -l` | 1 个 gofmt 违规，测试全过 | ✅ 干净，全过 |
| mocr (Go) | 同上 | 测试全过 | ✅ 干净，全过 |
| obs (Go) | 同上 | 测试全过 | ✅ 干净，全过（新增竞态回归用例） |
| LIFE (Python) | `pytest tests -q` | ❌ **185 failed / 763 passed** | ✅ **948 passed / 0 failed** |
| WebUI (Vue/TS) | `vue-tsc` / `eslint` / `vitest` | 97/97 过，但存在 1 处缺失 i18n 键 | ✅ 干净，97/97 过 |

---

## 1. 问题清单与处置

严重度：CRITICAL / HIGH / MEDIUM / LOW。状态：已修复 / 遗留。

### CRITICAL

| # | 位置 | 问题 | 状态 |
|---|---|---|---|
| C1 | `life/src/life/adapters/chatlog.py:47` | `_connect()` 返回裸连接后用 `with conn:` 使用——该写法只管理**事务**，**从不关闭**句柄。每次读写都泄漏一个连接，Windows 下 `chatlog.db` 被锁住，导致数据目录无法删除。这一处直接造成 **185 个测试失败**。 | 已修复：改为 `@contextmanager`，在同一上下文里 open+close，与 `memory`/`companion` 两处存储写法对齐。 |
| C2 | `obs/hub.go:74`、`obs/trace.go:204` | 日志/跨度扇出在**解锁后**发送；`subscribe` 的 cancel 在删表后 `close(ch)`。发布者若在删除前捕获了 channel，就会向已关闭 channel 发送 → **panic 打挂整个进程**（控制台断开 SSE 即可触发）。 | 已修复：在持锁状态下扇出（发送为非阻塞 `select/default`，不会因慢订阅者阻塞）。新增回归用例 `TestCancelDuringPublishDoesNotPanic`。 |

### HIGH

| # | 位置 | 问题 | 状态 |
|---|---|---|---|
| H1 | `mocr/internal/server/mocr_service.go:266` | 生成超时 ctx 被丢弃：`obs.StartWithID(stream.Context(), …)` 用无 deadline 的父 ctx 覆盖了上一行的 `context.WithTimeout`。所有上游调用都跑在无超时 ctx 上，`MOCR_GENERATION_TIMEOUT` 形同虚设（慢速滴流的上游可无限占用流）。 | 已修复：以超时 ctx 为父。 |
| H2 | `mocr/internal/providers/retry.go:9` | 重试分类正则只认 `provider error (\d{3})`（Anthropic 路径），而 OpenAI 兼容路径抛的是 `upstream HTTP %d: …`。于是**主路径的 429/5xx 从不重试**，`max_retries` 静默失效。 | 已修复：正则同时匹配两种形态，并补充用例。 |
| H3 | `core/internal/pairing/pin.go:472` | `/api/console/level`（PUT）与 `/api/console/clear`（POST）**未纳入 PIN 门禁**——`console.go` 的注释误以为设置规则覆盖了它们。任何已认证调用者可改日志级别、清空日志/跨度缓冲（审计证据）。 | 已修复：新增 `/api/console` 前缀规则，并加表驱动用例；修正错误注释。 |
| H4 | `core/internal/gateway/gateway.go:431` | `/live2d/models/` 用裸 `http.FileServer` 提供上传目录，不校验扩展名。攻击者可在含合法 manifest 的目录里放 `evil.html`，从 **Core 自身源** 以 `text/html` 提供，继承会话 cookie 后可调用已认证 API（存储型 XSS）。 | 已修复：包装 handler，设置 `X-Content-Type-Options: nosniff` + `Content-Security-Policy: sandbox; default-src 'none'`（与 `/api/files` 一致）。 |

### MEDIUM

| # | 位置 | 问题 | 状态 |
|---|---|---|---|
| M1 | `core/internal/gateway/state.go:110` | 无锁读取 `uiPatches.loaded`，而写入在 `ui_patches.go:135` 持锁进行 → 数据竞态。 | 已修复：新增持 `RLock` 的 `LoadedAt()`。 |
| M2 | `core/internal/gateway/gateway.go:641` | `disabled_plugins.json` 非原子写（无 tmp+rename）、错误被吞、0644；文件损坏时**静默重新启用全部已停用插件**。 | 已修复：tmp+rename、0600、损坏时告警。 |
| M3 | `life/src/life/engine/legacy.py:4213` | `preferred_at.replace("Z","")` 丢弃 UTC 标记，把真实 UTC 时间当成本地时间 → 主动消息排期偏移。 | 已修复：改走 `timeutil.parse_utc` + `to_local_naive`。 |
| M4 | `life/src/life/engine/legacy.py:809` | `life_state.json` 裸 `write_text`，崩溃会截断 alive/born 标志。 | 已修复：tmp+replace。 |
| M5 | `life/src/life/adapters/platforms.py:111` | `adapters.json`（含明文 `ws_token`/`access_token`）按 umask 默认 0644 落盘，POSIX 共享主机上人人可读。 | 已修复：以 0600 创建。 |
| M6 | `life/src/life/memory/memory.py:483` | `memory_center.db`（含 credential 作用域事实）按默认权限落盘。 | 已修复：目录 0700 / 库 0600（Windows 上仅影响只读位，无害）。 |
| M7 | `life/src/life/environment.py:117` | 天气缓存非对象 JSON 时 `weather()` 直接 `AttributeError`。 | 已修复：`isinstance` 兜底。 |
| M8 | `life/src/life/engine/resident.py:457`、`worldsim/runtime.py:93`、`worldsim/llm_cache.py:32` | 同类「JSON 合法但不是对象」崩溃点。 | 已修复：三处加类型/异常兜底。 |
| M9 | `life/src/life/core_client.py:600` | `get_core_client()` 单例 check-then-set 无锁，事件循环与 `to_thread` 并发首次调用会建两个 client/channel。 | 已修复：双重检查加锁。 |
| M10 | `webui/src/stores/chat.ts:484` | 清空对话会 abort 流，而 `readSSE` 吞掉 AbortError 正常返回 → `!sawDone` 分支重新创建一条带「已中断」标记的幽灵气泡并持久化。 | 已修复：引入 `streamEpoch` 世代号，abort 后不再重建。 |
| M11 | `webui/src/components/LifeSettingsPanel.vue:58` | 使用 `lifeSettings.save` / `saving`，这两个键**任何语言文件里都不存在**，按钮渲染原始键名。 | 已修复：改用与同类 `McpPanel` 一致的 `common.save` / `common.saving`。 |
| M12 | `webui/src/components/Live2DStage.vue:176` | TTS 每条回复生成一个 blob URL，`audioEl.src` 直接覆盖，从不 `revokeObjectURL` → 整页会话持续泄漏。 | 已修复：替换与卸载时回收。 |
| M13 | `webui/src/pages/PluginsPage.vue:111` | README 拉取无请求令牌，快速切换插件时 A 的迟到响应覆盖 B 的内容。 | 已修复：加入单调令牌。 |
| M14 | `webui/src/components/MinecraftConsentDialog.vue:24` | `reply()` 清 timer 后不置空并再次 `poll()`，两个 finally 各自 `schedule()` → 孤儿定时器在卸载后继续轮询。 | 已修复：`inFlight` 守卫 + `unmounted` 标志 + 置空。 |
| M15 | `mocr/internal/server/usage.go:66` | 每次生成起一个 goroutine 排在同一把锁上（无界增长），且 `usageWg` 从不 `Wait()`。 | 已修复：合并为单一 drainer（dirty 标志合并突发）。 |
| M16 | `mocr/internal/providers/generate.go:445` | SSE 单行上限 1 MiB，大 tool-call 参数会触发 `bufio.ErrTooLong` 被报成流失败。 | 已修复：上限提到 8 MiB（惰性分配，无额外成本）。 |
| M17 | `obs/logger.go:138` | 重复调用 `Init()` 会新开文件句柄却不关旧的 → fd 泄漏。 | 已修复：`Init` 先 `closeOpenFiles()`。 |

### LOW

| # | 位置 | 问题 | 状态 |
|---|---|---|---|
| L1 | `core/cmd/messaging-plugin/main.go` | 注释缩进不符 `gofmt` → `make lint` 会失败。 | 已修复。 |
| L2 | `webui/src/stores/chat.ts:38` | `seenL2DMarkers` 每条消息一份 Set，随会话无界增长。 | 已修复：清空/压缩时清理。 |
| L3 | `mocr/internal/providers/network.go:40` | `host == "metadata"` 大小写敏感（前缀分支已 lowercase）。 | 已修复：`strings.EqualFold`。 |
| L4 | `life/tests/test_cognition_settings.py` | 测试自身缺陷：`panel_cog_keys()` 正则不识别 `get key()` 写法，误报 4 个键缺失；且断言 JS bundle 里含中文字面量「认知内核」，而标签已迁到 `strings.xml`。 | 已修复：修正正则与断言（面板实际 47 键全覆盖，无真实漂移）。 |

---

## 2. 遗留项（本次未改，建议后续处理）

| 位置 | 问题 | 为何未改 |
|---|---|---|
| `core/internal/gateway/plugin_guard.go:41` | 浏览器豁免同时接受 `Sec-Fetch-Site` 等 Fetch 元数据；恶意的插件进程可手工伪造该头，绕过 manifest 声明校验。 | 现有实现已在代码注释中明确论证，且敏感端点（`/api/net/egress`、`/api/providers/credentials`）会二次鉴权；改豁免模型有破坏真实浏览器跨站流量的风险，需产品/安全决策。 |
| `core/internal/gateway/gateway.go`、`plugin_ui.go` | 27 处 `http.Error` 返回 `text/plain`，偏离 `docs/HTTP_API.md` 约定的 `{"error","code"}` 错误信封。 | 多数位于文件/图片/Live2D 上传与静态托管路径，`text/plain` 是合理选择；统一改造涉及面广、回归风险高，且当前前端不依赖这些端点的 `code`。 |
| `life/src/life/memory/memory.py:1035,1757` | `replay_lambda` 在持久化记忆里按**秒**、在认知核心里按**回合**，同一常量两种量纲，注释「与 recall_engrams 同衰减率」不成立。 | 属领域语义问题，改单位会改变检索排序与既有行为，需先确认设计意图与基线。 |
| `mocr/manifest.json` | 声明了 `POST /api/net/egress` 权限，但代码直接拨号，未走 Core 出口代理，该权限名不副实。 | 需要产品决策：要么接入 Core 出口，要么删声明。 |

---

## 3. 一句话总评

本次审查的最大收获是 **C1**：一个「`with conn:` 不关连接」的经典 Python 陷阱，在 Windows 上把 185 个测试变成失败——它是真实缺陷，而非环境噪声。其余问题集中在三处：**并发/资源**（obs panic、usage goroutine、单例竞态）、**安全边界**（console PIN、Live2D 存储型 XSS、密钥文件权限）、以及**契约一致性**（mocr 超时与重试分类、错误信封、i18n 键）。修复后 Core / mocr / obs / WebUI 全绿，LIFE **948/948**。
