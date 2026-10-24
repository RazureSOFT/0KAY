# 0KAY vs DeepSeek Harness (dsh)

对比基于本机 `D:\deepseek-harness`（v0.1.1-rc.2 源码，2104 个 TS 文件、55 个包）与本仓库当前状态。
不是评测报告，是给下一次架构决策用的差异清单。

## 一句话定位

| | 它 | 我们 |
|---|---|---|
| 是什么 | Agent **运行时**（Model + Harness = Agent） | 自托管 **AI 伙伴**，底下挂一个 agent |
| 谁在用 | 开发者日常干活 | 一个人和自己机器上的角色相处，顺便让它干活 |
| 成功标准 | 换掉任何一层都不影响其它层 | 角色记得你、能说话、能做事，数据在自己盘上 |

这不是同一场比赛。它比我们"更通用"，我们比它"更像一个活物"。下面按层拆。

## 结构对比

| 维度 | dsh | 0KAY | 差距 |
|---|---|---|---|
| 内核 | Cordis 插件树，**连 agent loop 都是插件**，可热替换 | Go Core + gRPC 插件；agent loop 写死在 agent 进程里 | **明显落后** |
| 插件粒度 | 55 个包，一个工具一个包（`tool-bash`、`tool-lsp`、`tool-subagent`…） | 8 个插件，工具全塞在 `agent/src/tools/` 一个进程 | 落后 |
| 工具数 | 22 个工具包 | ~40 个工具（多出来的是逆向/渗透/爬虫/截图转码这类分析工具） | 数量我们多，**组织度我们差** |
| 会话 | append-only `SessionEvent` 事件流，jsonl/sqlite 双后端 + projection 缓存 | SQLite 表 + JSON 文件，无事件溯源 | 落后 |
| 沙箱 | `sandbox` / `sandbox-local`（平台级）/ `sandbox-policy`（按会话）/ `e2b`（隔离环境） | 路径白名单 + 审批门，**没有进程隔离** | **最大安全差距** |
| 审批 | 规则/模型分类 + `allow/deny`，`--yolo` 显式降级 | 审批门 + `always_allow_tools`，粒度粗 | 落后 |
| 多 agent | `tool-subagent` ×3 + agent-team，原生 | 多实例注册 + executor 路由（本轮刚修好 failover） | 落后 |
| 扩展分发 | npm/git spec，`dsh plugin add`，profile+bundle+patch 三层 | `0kay-pm` + manifest.json + 区域镜像 | 各有千秋 |
| 生态 | 社区 700+ 仓库、5100+ 插件 | 自研为主 | 落后（但这是规模问题，不是设计问题） |
| 陪伴层 | **没有**，全靠插件拼 | 原生：情绪、短期/长期记忆、关系、昼夜节律、主动消息 | **我们独有** |
| 多模态 | 插件（modlens 转视觉） | 原生：ASR/TTS/Live2D/自拍/语音通话，一直打通到 prompt 和气泡 | **我们领先** |
| 部署 | `npx dsh web` 一行；另有 Electron、Docker、Python SDK | `start-0kay.sh` / docker-compose / `0kay-pm`；要 Go+Python+Node 三件套 | 落后（我们在补） |

## 我们明显更强的地方

1. **陪伴是一个系统，不是一个 prompt**。情绪状态、记忆分层、睡眠/醒来、主动发消息、关系进展——dsh 的 `memory` 是社区插件，`persona` 根本没有这一层。
2. **多模态是链路而不是接口**。角色可以在句子里藏 `[[selfie:…]]`，UI 渲染成图，TTS 念出来，通话模式还能双向说话。dsh 的多模态是"把图转给视觉模型"。
3. **自我迭代有明确的安全边界**。`evolve_*` 只在 `self/<slug>` 的 worktree 里改自己，不碰用户工作区，不提 PR 就等于没发生。dsh 说 agent loop 可热替换，但没说替换失败怎么办。
4. **本地数据是纯文件**。SQLite + JSON，可以直接 `cat`、`git diff`、拷走。

## 它明显更强、且我们应该抄的地方

按"投入产出比"排序：

### 1. 进程沙箱（最该做）
它把沙箱做成三层：能力定义（`sandbox`）、平台后端（`sandbox-local`）、按会话策略（`sandbox-policy`），fail-closed。我们只有路径白名单——`shell` 工具一旦被批准，就是用户权限下的任意命令。

**能落地的版本**：Windows 用 Job Object + 受限令牌，Linux 用 `bwrap`/`landlock`，macOS 用 `sandbox-exec`。不需要 e2b 那层云沙箱。

### 2. 会话事件流
它的 `SessionEvent` 是 append-only，能回放、能 projection、能被插件读。我们的会话是可变行，做不了"重放到第 3 步看看当时模型看到了什么"。

**能落地的版本**：先加一张 `session_events` 表（seq, kind, payload），现有表改成 projection。不动 UI。

### 3. 工具按包拆
它一个工具一个包，我们 40 个工具在一个 1400 行的注册表里。拆开之后：工具可以独立版本、独立权限、独立测试，也才能做到"用户只装他要的工具"。

**能落地的版本**：不必真拆成 22 个 npm 包，先把 `tools.ts` 按领域拆成 `tools/fs.ts`、`tools/web.ts`、`tools/analysis.ts`、`tools/evolve.ts`，注册表只做装配。

### 4. 子 agent 作为工具
`tool-subagent` 是普通工具，模型自己决定要不要开子 agent、开几个。我们现在是"多实例注册"——运维视角，不是模型视角。

## 不建议抄的

- **Cordis 那种"一切皆插件"**：连 agent loop 都能换，代价是所有东西都要通过 ctx 拿，读代码要先理解框架。我们的 Go Core + gRPC 边界更笨但更好 debug。真要换 loop，加一个 interface 就够，不必把整个内核变成插件树。
- **55 个包的拆分粒度**：它是给 5100 个社区插件准备的，我们没这个生态，拆太细只是增加发布成本。
- **事件总线的复杂度**：`agent/*`、`fs/*`、`tools/*` 三套事件域，学起来很贵。我们要事件溯源就只做 SessionEvent 一层。

## 结论

我们在"陪伴"这个维度上没有对手，在"agent 运行时"这个维度上落后一整代。
下一步不该去追它的插件生态（追不上，也没意义），而应该补三件**和我们自己的定位直接相关**的事：

1. 沙箱——因为我们的角色有 `shell` 和桌面控制权限，这是真实风险；
2. 会话事件流——因为"角色记得你"这件事，需要能回放和审计；
3. 工具拆包——因为它决定用户能不能只装自己需要的部分。

生态规模是结果，不是目标。
