# 0KAY

**在自己电脑上跑的 AI 伙伴：它记得你，而且真能替你干活。**

*English: [README.md](README.md)*

大多数「AI 陪伴」应用，本质只是一个套了人设提示词的聊天框。0KAY 想做的是聊天框做不到的两件事：

- **伙伴会「记事」。** 情绪、短期/长期记忆、作息节律、关系与主动消息——它会记得你上周说过什么，也会主动来找你。
- **它同时是一个真正的 Agent。** 改文件、跑命令、上网、操作桌面，危险操作先等你批准。陪你聊天的同一个角色，可以真的帮你把活干完。

它是本地优先的：你自己填模型 API Key（兼容 OpenAI / Anthropic 格式的供应商都行），数据以普通文件存在你自己的磁盘上。

## 你能用它做什么

- **和一个记得你的伙伴聊天。** 对话会写进它的记忆与情绪；它有自己的状态，会写日记、做梦，也会主动发消息。
- **给它一张脸和一副嗓子。** Live2D 形象 + TTS 语音。
- **把活交给它。** 一个带文件、终端、网页抓取/搜索、整桌面操作工具的编码 / 调研 Agent；敏感操作会先弹审批。
- **在顺手的地方找它。** WebUI 里聊，或接入 QQ / OneBot。
- **什么都能插。** 除了一个很小的 Go 核心，其它能力全是插件：模型网关、人格、Agent、TTS、搜索、Minecraft，以及插件自己的 WebUI 页面。每个都能单独装、停、换。
- **数据留在自己手里。** 默认只绑定本机回环地址；供应商密钥只存在 Core；数据是你自己的普通文件。

## 这个项目是给谁用的

**适合你，如果——**

- 你想要一个记忆和人格都**属于你自己**、而不是属于某个厂商的 AI 伙伴，并且在意它留在你自己的机器上。
- 你不介意在本地跑几个服务（Go / Python / Node，或者 Docker），并愿意自己填模型 API Key。
- 你喜欢折腾：换模型、加插件、接到 QQ、写自己的页面。

**大概率不适合你，如果——**

- 你想要一个开箱即用、什么都不用配的云端应用——0KAY 是刻意做成自托管的。
- 你不想管 API Key 和端口。

## 截图

| 聊天 | 通用设置 | 供应商设置 |
|---|---|---|
| ![Chat](assets/chat.png) | ![General settings](assets/settings-general.png) | ![Provider settings](assets/settings-provider.png) |

截图来自运行中的 WebUI（`webui`，Vite 开发服务器）。

## 快速开始

> 用包管理器安装只需要 Node.js 22+；容器方式用 Docker Compose；从源码运行才需要
> Go 1.27+ 和 Python 3.10+。

**三选一**，不要混用。

### Docker Compose

```bash
docker-compose up -d      # 构建并启动所有服务
docker-compose ps         # 查看状态
docker-compose logs -f    # 跟踪日志
docker-compose down       # 停止
```

### 包管理器安装（推荐）

```sh
# 安装 0kay-pm 命令行工具（Node.js 22+，不需要 git）
npm install -g https://codeload.github.com/RazureSOFT/0KAY-pm/tar.gz/main
# ……或者从本仓库安装：
npm install -g ./pm

0kay-pm install @razuresoft/0kay@0.1.2        # Core、mocr、L.I.F.E、WebUI
0kay-pm install @razuresoft/0kay-agent@0.1.2  # 任务 Agent
```

`0kay-pm install` 会构建每个模块并把它作为**后台服务**启动（Linux systemd user
unit / macOS LaunchAgent / Windows 登录任务），所以之后**不需要**再手动运行任何东西。
用 `0kay-pm status <包名>` 查看状态、`0kay-pm stop <包名>` 停止。

### 从源码运行（开发）

```sh
# 一次性准备
make deps-python           # 为 L.I.F.E 执行 pip install -e .
make deps-node             # 为 Agent 执行 npm install
npm --prefix webui install # WebUI 依赖
make proto                 # 生成 Protobuf 代码
```

然后在**各自的终端**里分别启动：

```sh
make dev-core     # Core：:50051 (gRPC) / :8080 (HTTP)
make dev-mocr     # mocr：:50052
make dev-life     # L.I.F.E：:50053
make dev-agent    # Agent：:50054
npm --prefix webui run dev   # WebUI：:3000
```

打开 WebUI，在「设置 → 供应商」里添加供应商和模型 API Key 即可。
健康检查：`GET http://127.0.0.1:8080/health`。

### 安全

默认只绑定回环地址；只有在可信网络里才用 `CORE_BIND_HOST`、`AGENT_BIND_HOST`、`MOCR_BIND_HOST`、`LIFE_BIND_HOST` 放开。要对公网暴露 HTTP，请在前置一层带鉴权的反向代理。`CORE_API_TOKEN` 会让 Core 要求 Bearer Token（可在 `POST /api/auth/session` 换成 HttpOnly 的 `0kay_session` Cookie），浏览器访问还有 PIN 门禁，且 `GET /api/providers` 永远不返回供应商密钥。详见 [docs/security.md](docs/security.md)。

## 它是怎么搭起来的

```
WebUI (TS) ──HTTP/WebSocket──┐
QQ/OneBot ──WebSocket───────┤
                             ▼
                       ┌──────────┐
                       │   Core   │  Go —— 网关、任务、插件注册
                       └────┬─────┘
                            │ gRPC
             ┌──────────────┼──────────────┐
             ▼              ▼              ▼
        ┌────────┐    ┌──────────┐   ┌──────────┐
        │  mocr  │    │  L.I.F.E │   │  Agent   │
        │  Go    │    │ (Python) │   │  (TS)    │
        │ 模型   │    │  人格    │   │  任务    │
        └────────┘    └──────────┘   └──────────┘
```

- **Core**（Go）——HTTP/WebSocket 网关、插件注册与健康检查、任务调度、设置、供应商凭证。它是唯一的真相源。
- **mocr**（Go）——模型网关：接入供应商、流式输出、重试，以及 think/output 双模型选型。
- **L.I.F.E**（Python）——伙伴本体：人格、情绪、记忆、作息节律、主动消息与陪伴工具。
- **Agent**（TypeScript，[独立仓库](https://github.com/RazureSOFT/0KAY-agent)）——任务引擎与工具集。
- **WebUI**（Vue 3）——单页应用，只通过 HTTP 和 Core 通信。

除 Core 之外，每个组件都是插件，可以单独安装、更新或停用。细节见 [ARCHITECTURE.md](ARCHITECTURE.md) 与 [RUNTIME_CONTRACTS.md](RUNTIME_CONTRACTS.md)。

## 文档

- [架构说明](ARCHITECTURE.md) —— 组件边界、数据流、UI patch。
- [运行约定](RUNTIME_CONTRACTS.md) —— 任务标识、会话隔离、审批、持久化。
- [插件 API](docs/PLUGIN_API.md) —— 所有插件共用的 Protobuf 契约。
- [写一个插件](docs/writing-a-plugin.md) —— 端到端插件指南。
- [HTTP API](docs/HTTP_API.md) —— Core 网关全部路由。
- [模型目录](MODEL_CATALOG.md) —— fallback 模型 ID。
- [发布与更新](docs/RELEASES.md) —— 安装与一键更新。

## 环境要求

- Go 1.27+
- Python 3.10+
- Node.js 22+
- Docker 与 Docker Compose

## 目录结构

```
0KAY/
├── proto/       # 共享 Protobuf 契约
├── core/        # Go —— 网关、注册、调度
├── mocr/        # Go —— 模型网关
├── life/        # Python —— 伙伴（人格、记忆、情绪）
├── agent/       # TypeScript —— 任务引擎（独立仓库）
├── webui/       # Vue 3 单页应用
├── plugin-web/  # 插件自带的前端
├── gen/         # 生成代码
└── docker-compose.yml
```

## 开发

```powershell
python -B -m unittest discover -s life/tests -v   # L.I.F.E 测试
# agent/: npm test; npx tsc --noEmit
# core/ 与 mocr/: go test ./...
```

## 许可证

MIT
