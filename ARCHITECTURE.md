# 0KAY 架构说明

> 执行状态、会话隔离、记忆存储与部署的最新实现约定见 [RUNTIME_CONTRACTS.md](RUNTIME_CONTRACTS.md)。旧有聊天镜像和技能预取描述以该文档及当前代码为准。

> 本文描述 0KAY 平台的组件划分、通信边界、数据流与扩展机制。
> `core/`、`mocr/`、`life/`、`webui/`、`searxng/`、`proto/`、`gen/` 和 `mcp/` 位于 umbrella 仓库；`agent/` 保持在独立的 `0KAY-agent` 仓库。

## 文档约定

本仓库的架构、运行约定、模型目录和插件说明统一使用 Markdown。

- 代码行为以当前实现和 `RUNTIME_CONTRACTS.md` 为准。
- 模型名称以实时供应商目录为准，`MODEL_CATALOG.md` 只提供 fallback 快照。
- 插件 UI 必须通过 `*.patch` 注册；插件禁用后对应页面、路由和导航必须撤销。
- Agent 是独立仓库，通过 `dependencies.json` 记录平台所需版本。

---

## 1. 总览

0kay 是一个本地优先的 AI 助手平台：**Core 负责编排与真相源，插件各司其职，WebUI 通过 HTTP 拼装界面**。

```
                        ┌─────────────────────────────────────┐
                        │              Browser                │
                        │         WebUI (Vue3 SPA :3000)      │
                        └───────────────┬─────────────────────┘
                                        │ HTTP + SSE + WS
                                        ▼
┌───────────────────────────────────────────────────────────────────┐
│                         Core (Go)                                 │
│   HTTP :8080                          gRPC :50051                 │
│   ┌─────────────────────┐   ┌──────────────────────────────┐      │
│   │ Gateway (REST/WS)   │   │ Plugin Registry + Heartbeat  │      │
│   │ Providers/Settings  │◄──┤  PluginService / AgentSvc    │      │
│   │ UI Patch Store      │   └──────────────┬───────────────┘      │
│   │ State / Health      │                  │ gRPC/Protobuf        │
│   └─────────────────────┘                  │                      │
└────────────────────────────────────────────┼──────────────────────┘
             ▲                               │
             │ HTTP (optional)               │
   ┌─────────┴─────────┐         ┌───────────┼───────────┬──────────┐
   │ SearXNG :8888     │         ▼           ▼           ▼          │
   │ (meta search)     │    mocr :50052  life :50053  agent :50054   │
   │ cnbing/bing/...   │    (Go model     (Python     (TS task      │
   └───────────────────┘     gateway)     persona)    engine)       │
                                                          │
                                                          ▼
                                                   tools / shell /
                                                   filesystem / skills
```

**设计原则**

| 原则 | 含义 |
|------|------|
| Core 是真相源 | 插件、任务、凭证、设置只在 Core 注册/落盘 |
| 浏览器不直连插件 | WebUI 只打 Core HTTP；插件只暴露 gRPC |
| 插件可热插拔 | 停用插件会联动过滤其 settings 与 UI patches |
| UI 可扩展 | 导航/路由/状态/设置 tab 由 `*.patch` 声明式注入 |
| 选型与聊天分离 | Chat 钉默认模型；`ChooseModels` 仅 Agent 使用 |

---

## 2. 组件职责

### 2.1 Core（Go）— 编排中枢

| 面 | 端口 | 职责 |
|----|------|------|
| HTTP Gateway | `:8080` | REST API、健康检查、代理转发、UI patches |
| gRPC Server | `:50051` | 插件注册、心跳、Agent/任务/搜索等服务 |

**关键模块**

- **Plugin Registry** — 插件注册与生命周期；`disabled_plugins.json` 控制启停
- **Providers Store** — `core/data/providers.json`：多供应商、模型目录、`disabled_models`、默认模型
- **Settings Store** — `core/data/settings.json` + 插件贡献的 section（agent / life / mocr / searxng…）
- **UI Patch Store** — 扫描 `CORE_DATA_DIR/ui/*.patch` 与 `webui/patches/*.patch`，展平后下发给 WebUI；原生页静态资源在 `CORE_DATA_DIR/plugin-ui/{name}/`
- **State / Health** — `/health` 聚合插件心跳；`/api/state` 合并 Core + L.I.F.E 情绪状态

**内置插件注册**（`registerBuiltins`）：

- `webui` — 指向 `http://127.0.0.1:3000`
- `searxng` — 当 `SEARXNG_ENABLED=1` 或设置了 `SEARXNG_URL` 时注册，并贡献引擎设置项

### 2.2 mocr（Go）— 模型网关

- gRPC `:50052`（无 HTTP）
- 对上游 OpenAI 兼容 API 做统一接入：重试、SSE 流式、空闲超时
- **ChooseModels**：按供应商模型目录 + Agent 意图做智能选型（仅 Agent 调用）
- Chat 路径钉默认模型；假 key / 上游失败时可走离线兜底（`generateOffline`）
- 设置：默认模型、最大重试、SSE idle timeout

### 2.3 L.I.F.E（Python）— 人格与情绪内核

- gRPC `:50053`
- 职责：人设、情绪轴（valence/arousal…）、记忆（短期/长期）、权限（录屏/计算机使用）
- **THINK 循环**：产出 `memory_query`、`output_guidance`、可选 `skill_call`
- **Skill 系统（与 Agent 分离）**
  - 内置：`empathy` / `research` / `summarize` / `dispatch`
  - 文件：`life/skills/*.md`（或 `LIFE_SKILLS_DIR`）
  - 自动上下文：① 消息匹配 skill 预取；② THINK 的 `memory_query` 二次 recall；③ `skill_call` 拼入 guidance
- 输出还驱动 WebUI 状态面板（mood / energy / emotions / tasks / memory）

### 2.4 Agent（TypeScript）— 任务执行引擎

- gRPC `:50054`（`node dist/index.js`）
- 通过 Core `PluginService` 注册，周期心跳
- **TaskManager** — 并发上限、迭代上限
- **ToolRegistry** — shell / filesystem 等工具（可按设置开关）
- **Skill 系统（与 LIFE 分离）**
  - 内置：`code` / `research` / `general`
  - 文件：`agent/skills/*.md`（或 `AGENT_SKILLS_DIR` / 设置项 `skills_dir`）
  - 注入 system prompt：`contextBlock(task)`；设置 `enable_skills` 可关
- 所有 LLM 调用经 **mocr**（ChooseModels + 流式）
- 设置项：`model_id`、`temperature`、`max_iterations`、`max_concurrent_tasks`、`default_agent_type`、工具与技能开关

### 2.5 WebUI（Vue 3 + TS）— 单页应用

- Vite 开发服 `:3000`（生产 `vite build` → `dist/`）
- 只依赖 Core HTTP：
  - `/health`、`/api/state`、`/api/chat`（SSE）、`/api/models*`、`/api/providers*`
  - `/api/settings/*`、`/api/plugins/*`、`/api/ui/patches`、`/api/usage*`、`/api/agents`、`/api/agent/inbox`、`/api/tasks`
  - `/api/auth/session`（浏览器会话 cookie；`main.ts` 的 fetch 包装器遇 401 弹出登录层并重放一次请求）
- **Patch 驱动 UI**：
  - `BUILTIN_NAV` / `BUILTIN_SETTINGS` / `BUILTIN_STATUS` + patch 合并
  - `registerPatchRoutes()` 把 patch 里的 `router` 项注册进 vue-router
  - `component: "agents"` 映射到内置 `AgentsPage`
  - 首屏 race：patch 未就绪时落在 catch-all，加载后 `router.replace` 重解析
- 设置页多 tab：通用 / 供应商 / 人设 / Live2D / 权限 / 危险区 + 插件段（agent、searxng…）
- 供应商面板：logo（`/providers/*.svg`）、编辑表单、**模型列表 + 开关合并卡片**、获取模型列表（显示 `source=api|fallback`）

### 2.6 SearXNG（Python）— 元搜索

- HTTP `:8888`
- 引擎：`cnbing`（中文 Bing，`zh-CN`/`mkt=zh-CN`）、`bing`、`duckduckgo`、`marginalia`
- 默认 **cnbing**；顺序：preferred 在前，其余作 fallback
- 偏好读取：Core `/api/settings/searxng` → 环境变量 `SEARXNG_ENGINE` → 内置默认
- UI：侧栏「搜索」由 `searxng-nav` patch 注入 iframe 路由 `/search`

---

## 3. 通信矩阵

| 从 → 到 | 协议 | 用途 |
|---------|------|------|
| Browser → WebUI | HTTP | 加载 SPA 静态资源 |
| WebUI → Core | HTTP REST | 状态、设置、插件、模型、用量… |
| WebUI → Core | SSE | 聊天流式输出 |
| Core → LIFE / Agent / mocr | gRPC | 转发、选型、任务、权限同步 |
| LIFE / Agent → Core | gRPC | 注册、心跳、上报 |
| Agent → mocr | gRPC | ChooseModels + 推理 |
| Core → SearXNG | HTTP | （可选）搜索代理 / 设置回读 |
| WebUI iframe → SearXNG | HTTP | `/search` 内嵌页 |

**Protobuf** 定义在 `proto/`（Buf/手写生成物在 `gen/`）。Agent 用 `@grpc/proto-loader` 动态加载同一套 proto。

---

## 4. 关键数据流

### 4.1 聊天（SSE）

```
User → ChatPanel → POST /api/chat (Core)
                 → Core 读 providers 默认模型
                 → mocr 流式推理
                 → SSE 回浏览器
                 （同时可镜像到 L.I.F.E 更新情绪/记忆）
```

### 4.2 Agent 任务

```
ExecuteTask (gRPC / Core → Agent)
  → TaskManager 排队（max_concurrent）
  → 每轮：Skill context + Tool list → system prompt
  → mocr ChooseModels + 推理
  → 解析 tool JSON → ToolRegistry 执行
  → finish → 结果回报 Core → WebUI 轮询 /api/tasks
```

### 4.3 模型获取

```
Settings → 获取模型列表
  → POST /api/models/fetch {id?, provider, base_url, api_key?}
  → Core 解析密钥（api_key 为空或是掩码时按 id / (provider,base_url) 查库）
  → Core 向上游 GET /models
  → success: source="api"；fail: 默认列表 source="fallback"
  → UI 显示来源；可写入 provider.models 并持久化
```

`GET /api/providers` 返回脱敏数据（`api_key` 置空、附 `api_key_masked`）；
明文密钥只经 `GET /api/providers/credentials` 提供给进程内服务（LIFE / Agent /
mocr），且每次调用都重新读取，保证改配置即时生效。

### 4.4 插件停用联动

```
PATCH /api/plugins/{name} {enabled:false}   （别名：POST /api/plugins/disable {plugin}）
  → registry.IsDisabled(plugin)=true
  → 该插件的 settings sections 返回 403/过滤
  → 该插件的 *.patch 从 FlattenOps 剔除
  → WebUI 导航/路由/状态段消失（如停用 agent → 无「Agent」）
```

---

## 5. UI Patch 机制

**文件格式**（JSON，尽管扩展名是 `.patch`）：

```json
{
  "id": "agent-nav",
  "name": "Agent navigation",
  "plugin": "agent",
  "enabled": true,
  "patches": [
    { "target": "nav", "op": "insert", "id": "agents", "anchor": "plugins", "position": "before", "item": { ... } },
    { "target": "router", "op": "insert", "id": "agents", "item": { "path": "/agents", "component": "agents", ... } }
  ]
}
```

| 字段 | 说明 |
|------|------|
| `target` | `nav` \| `router` \| `settings` \| `status` \| `chat` |
| `op` | `insert` \| `remove` \| `replace` |
| `anchor` / `position` | 相对兄弟项定位：`before` / `after` |
| `plugin` | 所属插件；插件停用时整文件被过滤 |
| `item.module` | 插件原生 ESM 入口（如 `/api/plugins/{name}/ui/index.js`），优先于 `component` / iframe |

**查找顺序（patch）**：`CORE_DATA_DIR/ui/` →（cwd）`ui/` → `../webui/patches/` → `data/ui/`；同 id 先加载者胜。

**热更新**：`GET /api/ui/patches` 每请求最多 3s 重扫磁盘；WebUI 15s 轮询。

**原生插件页（Scheme C）**：构建产物在 `CORE_DATA_DIR/plugin-ui/{name}/`，由
`GET /api/plugins/{name}/ui/{path…}` 托管；WebUI importmap 将 `vue` 指到
`/vendor/vue-bridge.js`（宿主 `window.__0KAY_VUE__`）。构建约定见
`plugin-web/README.md`。

---

## 6. 两套 Skill 系统（刻意分离）

| | L.I.F.E Skills | Agent Skills |
|--|----------------|--------------|
| 代码 | `life/src/life/skills/` | `agent/src/skills/skills.ts` |
| 内置 | empathy, research, summarize, dispatch | code, research, general |
| 文件目录 | `life/skills/*.md` 或 `LIFE_SKILLS_DIR` | `agent/skills/*.md` 或 `AGENT_SKILLS_DIR` |
| 注入点 | THINK prompt `{skills_context}` + `skill_call` | Agent system prompt `contextBlock(task)` |
| 语义 | 人格/共情/对话过程 | 任务过程（写码、调研…） |
| 开关 | 始终加载 | 设置 `enable_skills` / `skills_dir` |

Markdown 约定：

```markdown
# skill-name
tags: a b c

一句话 description（不含 tags 行）

1. 步骤…
```

---

## 7. 端口与进程（本地默认）

| 服务 | 端口 | 技术 | 入口 |
|------|------|------|------|
| Core HTTP | 8080 | Go | `core/cmd/core` → `core.exe` |
| Core gRPC | 50051 | Go | 同上 |
| mocr gRPC | 50052 | Go | `mocr/cmd/mocr` → `mocr.exe` |
| L.I.F.E gRPC | 50053 | Python | `python -m life.main`（cwd `life/src`） |
| Agent gRPC | 50054 | Node | `node agent/dist/index.js` |
| SearXNG | 8888 | Python | `searxng/server.py` |
| WebUI | 3000 | Vite | `webui`（`npm run dev` / 静态托管 dist） |
| CDP（测试） | 9333 | Edge | 可选，用于 `webui/scripts/cdp-*.cjs` |

健康检查：`GET http://127.0.0.1:8080/health` → `{ healthy, plugins, status }`（5/5 为全绿）。

---

## 8. 目录地图

```
0KAY/
├── core/                 # Go 编排中枢
│   ├── cmd/core/         # main、内置插件、searxng 设置
│   ├── internal/gateway/ # HTTP、providers、settings、ui_patches、state
│   └── data/             # providers.json、settings.json、disabled_plugins.json、ui/*.patch
├── mocr/                 # Go 模型网关
├── life/                 # Python 人格/情绪/记忆
│   ├── src/life/         # engine、think、skills、grpc
│   └── skills/           # *.md 外置技能
├── agent/                # TS 任务引擎
│   ├── src/              # agent、tools、task、skills、plugin
│   ├── skills/           # *.md 外置技能
│   └── dist/             # tsc 产物
├── webui/                # Vue3 SPA
│   ├── src/pages|stores|router|locales
│   ├── patches/          # 随仓库的 *.patch
│   └── scripts/          # api-check / cdp-* 验证脚本
├── searxng/              # 元搜索兼容层
├── proto/                # 共享 Protobuf
└── gen/                  # 生成代码（go / python …）
```

---

## 9. 扩展指南（短）

**加一个插件设置 tab**  
在插件 `settings section` 或 `settings` patch 插入 tab + fields；WebUI `SettingsPage` 按 id 渲染。

**加侧栏入口**  
写 `nav` insert patch（带 `to`/`labelKey`/`order`），必要时补 `router` insert；`component` 若是内置页名则映射组件，否则 `PatchPage`（可 iframe `src`）。

**加状态面板**  
`status` insert：`kind` 支持 mood/bar/bars/count/tasks/memory/kv/connection。

**加 LIFE 技能**  
丢一个 `life/skills/foo.md`（`# foo` + prose），重启 life 或设 `LIFE_SKILLS_DIR`。

**加 Agent 技能**  
丢 `agent/skills/foo.md`，或设置里填自定义 `skills_dir`，重启 agent。

---

## 10. 非目标 / 边界

- 当前 **不** 做多租户与远程集群；单机本地部署
- WebUI **不** 直连 mocr/life/agent 的 gRPC
- 插件停用 ≠ 杀进程（进程可仍在，但 registry/HTTP 层拒绝并隐藏其 UI）
- Chat 与 Agent 的模型策略刻意不对称（见 §1 设计原则）

---

*文档随实现演进；与代码冲突时以 `core/internal/gateway`、`webui/src/stores/uiPatches.ts` 与各插件入口为准。*
