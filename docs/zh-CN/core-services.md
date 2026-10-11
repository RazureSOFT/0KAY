# Core 服务


插件通过 `core.v1.CoreService` 获得平台编排能力：模型访问、Agent 派发、任务
控制与直接工具执行。Core 是唯一持有供应商凭据与插件注册表的组件。

> **Language / 语言**: [English](../core-services.md) · 简体中文

Core 自身还提供 HTTP 网关（[HTTP_API](HTTP_API.md) 中的全部路由，:8080）与
gRPC（:50051）。源码运行用 `make dev-core`，Docker Compose 用 `core` 服务，
或作为 `0kay-pm` 托管服务运行。所有插件都通过 `core.v1.PluginService.Register`
注册，携带 `x-0kay-registration-token` 元数据；配置了按插件令牌时，可信的
第一方插件必须出示各自的 `CORE_PLUGIN_TOKEN_<NAME>` 注册密钥。

## `CallMocr`

把生成请求代理给模型网关，返回服务端流。用 `model_id` 钉住模型；仅当调用方
明确想要 Core/mocr 选型时才留空。

重要字段：

- `request_id` — 调用方关联 id。
- `caller_id` — 插件或会话所有者。
- `prompt` — 当前用户/任务 prompt。
- `session_id` — 会话键。
- `messages` — 可选的完整历史。
- `model_id` — 可选的钉住模型（`MOCR` 表示"由 mocr 选择"）。
- `system_prompt` — 领域指令。L.I.F.E 把人设与用户编写的**自定义提示词**
  放在这里（见 [L.I.F.E 服务](life-service.md)）。
- `context` — 难度、令牌、温度与任务元数据。

## `UseAgent`

向独立的 Agent 派发异步工作。响应只确认受理；结果请读 `/api/tasks`、轮询
Agent 任务状态，或等待 LIFE 的完成回调。

```json
{
  "task_id": "task_123",
  "caller_id": "life",
  "prompt": "Create and run a Python connectivity check.",
  "agent_type": "code",
  "metadata": {
    "thinking_intensity": "medium",
    "difficulty_hint": "0.5",
    "require_thinking": "false",
    "session_id": "webui:default",
    "executor_id": "",
    "workdir": "",
    "model_id": "MOCR",
    "permission_mode": "normal"
  }
}
```

`metadata` 是 `map<string,string>`。构造 protobuf 请求前，数字、布尔与对象
都要先字符串化。

- `permission_mode`：`normal` 下每个特权工具调用都等待用户决定；
  `full_access` 不弹窗直接执行。子 Agent 继承该模式。
- `thinking_intensity`：`off`/`low`/`medium`/`high`/`max` 或 `0`–`100`。

## `CancelAgent`

按 `task_id` 与 `caller_id` 取消任务。取消是尽力而为，应视为一次状态迁移，
而不是底层进程已停止的证明。

## `ListAgents`

返回已注册的 Agent 实例及其健康状态、回调地址、活动任务数、心跳时长与主机
信息。传 `include_unhealthy` 可以看到已停止心跳的执行器。

## `RunDirect`

不经 LLM 循环直接运行一个 Agent 宿主工具：

```json
{
  "tool": "computeruse",
  "args": "{\"action\":\"screenshot\"}",
  "session_id": "life-computeruse"
}
```

敏感工具需要对应的 LIFE/Core 权限。返回的工具数据应视为不可信的外部输出。
`workspace_browse`、`workspace_mkdir`、`host_status`、`approval_list`、
`approval_decide` 等管理操作同样走 `RunDirect`，但绝不作为可调用工具暴露给
模型。
