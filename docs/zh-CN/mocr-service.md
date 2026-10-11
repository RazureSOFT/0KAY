# mocr 服务

> **Language / 语言**: [English](../mocr-service.md) · 简体中文

mocr 是模型网关：负责供应商传输、模型选型、重试与用量记账。它在回环地址上
暴露 `mocr.v1.MocrService`（`MOCR_ADDRESS`，默认 `localhost:50052`），自身
不持有任何用户数据。

## 安装与运行

mocr 在主仓库（`mocr/`）内，需要 Go 1.27+。

```sh
make dev-mocr                    # cd mocr && go run ./cmd/mocr

# 或一次性构建二进制后运行
go -C mocr build -o ../.run/mocr ./cmd/mocr
```

Docker Compose 以 `mocr` 服务启动它，`0kay-pm install @razuresoft/0kay`
则把它安装为托管后台服务。注册是自动的：mocr 拨连 `CORE_ADDRESS`（默认
`localhost:50051`），出示 `CORE_PLUGIN_REGISTRATION_TOKEN`
（`x-0kay-registration-token` 元数据）。对 Core HTTP 的署名调用带
`X-0KAY-Plugin: mocr` + 下发的服务令牌，回退到 `CORE_API_TOKEN` bearer。

常用环境变量：`MOCR_GRPC_PORT`（50052）、`MOCR_BIND_HOST`（回环）、
`MOCR_ADDRESS`（对外声明地址）、`MOCR_GENERATION_TIMEOUT`、
`MOCR_GRPC_TOKEN`（服务端鉴权）。

## `ChooseModels`

为一个 prompt 返回 `think_model` 与 `output_model`。`Generate` 上钉住的
`model_id` 会绕过选型。

自 jev-router 集成后，选型运行内嵌在 mocr 二进制里的两段式路由器（从
jev_router 项目移植，无需旁路进程）：

1. **意图推断** — 把 prompt 分类为能力标签（`vision`、`long_ctx`、
   `agentic`、`reasoning` 等）与 1–5 的难度：字符 3-gram kNN（训练集内嵌），
   置信度守卫判定"没见过这类任务"时回退到关键词启发式
   （`ROUTER_MODE=heuristic` 可强制关键词基线）。
2. **确定性挑选** — 在调用方给的候选池里，满足（标签齐全 ∧ power ≥ 难度）
   的最便宜模型胜出，带标签松弛与"池内最强"兜底。候选池元数据来自内嵌的
   ~356 模型目录（power/context/cost/tags，按裸模型 id 匹配）；目录里没有的
   模型会合成保守元数据，保证始终可选。

选型策略（设置 → **模型**）映射到路由器策略：`auto`/`cost` → `economy`
（最便宜达标，同价取更强），`quality` → `performance`（最强优先）；`pinned`
只用配置的默认模型。gRPC 契约不变——`ChooseModelsRequest{prompt, context}`
→ `{think_model, output_model, reasoning}`——且 `reasoning` 字段现在携带
路由依据（推断难度、标签、策略、证据命中）。think 模型按完整推断规格路由
（要求思考时追加 `reasoning` 硬门槛）；output 模型在解除刚性能力门槛、难度
压到轻量档的条件下路由，这正是它作为便宜"表达"模型的定位。

自动切换的候选凭据来自 `GET /api/providers/credentials`（脱敏的
`GET /api/providers` 不再携带密钥）；该查找每次请求实时执行，新增供应商
立即可用。

## `Generate`

服务端流式模型网关。支持：

- OpenAI 兼容端点（含 `reasoning_effort` / `include_usage`）
- Anthropic 兼容端点（推理预算、`message_start` / `message_delta` 用量合并）
- 文本流式、思考模式
- 原生函数/工具定义与流式工具调用
- 用量与结束原因

`GenerateRequest.tools` 携带 JSON Schema 函数定义。工具调用以
`ToolCall { id, type, function_name, arguments }` 返回。**Agent** 负责工具
执行；mocr 只传输供应商的工具调用，从不执行任意函数。

思考型模型的助手历史必须在每一轮回传 `reasoning_content`；启用工具时漏掉
它会导致供应商 `400` 错误。

## 重试、切换与定价

- 瞬态供应商错误（429/5xx/超时）先在同一模型上重试至 `max_retries`，随后
  可选切换到回退模型（`auto_switch_model`、`switch_max_attempts`、
  `fallback_models`）。
- `stream_idle_timeout_sec` 在 N 秒无数据后关闭流。
- `model_prices` 是用户编写的 JSON
  （`{"模型片段":{"in":…,"out":…,"per_call":…}}`，美元/百万 token）。没有
  内置价格表。

## 用量

经过网关的每次生成都会计量。mocr 读取 `stream_options.include_usage`，合并
Anthropic 用量事件，并向 `POST /api/usage/record` 上报一条记录。供应商未
返回用量时值为 `0`——这不代表免费调用，也不是精确估算。被打断且无用量的
调用无法准确计费。
