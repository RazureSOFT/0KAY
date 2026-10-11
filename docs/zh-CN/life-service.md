# L.I.F.E 服务

> **Language / 语言**: [English](../life-service.md) · 简体中文

L.I.F.E 对外暴露 `life.v1.LifeService`，负责人设、情绪、记忆、陪伴各领域、
OneBot 接入以及 LIFE 注册的 WebUI 页面。它是 `PLUGIN_TYPE_PERSONA` 插件，
带 `requires:mocr` 依赖。

## 安装与运行

L.I.F.E 在主仓库（`life/`）内，需要 Python 3.10+。

```sh
make deps-python          # pip install -e ".[dev]"，装入 life/.venv
make dev-life             # cd life && .venv/Scripts/python -m life.main

# 回归测试（约 1068 条；NO_PROXY 避免本地 httpx 被沙箱代理干扰）
NO_PROXY=127.0.0.1,localhost .venv/Scripts/python -m pytest tests -q
```

注册时出示 `CORE_PLUGIN_REGISTRATION_TOKEN`（Core 启用按插件令牌时，使用
L.I.F.E 的专属注册密钥）。关键环境变量：`LIFE_GRPC_PORT`（50053）、
`LIFE_BIND_HOST`（回环；远程绑定需 `LIFE_ALLOW_REMOTE_BIND=1`）、
`LIFE_DATA_DIR`（默认 `./data/life`）、`LIFE_ADDRESS`（对外声明地址）、
`MOCR_ADDRESS`。

它通过 gRPC 向 Core 注册，设置 `CORE_PLUGIN_REGISTRATION_TOKEN` 时会把它放进
`x-0kay-registration-token` 元数据。对 Core HTTP 的调用（包括仅机器可调的
`GET /api/providers/credentials`）带 `X-0KAY-Plugin: life` + 服务令牌署名，
回退到 `CORE_PAIR_TOKEN` / `CORE_API_TOKEN`。

## `OnUserMessage`

WebUI、OneBot 及其他适配器的服务端流式入口。

请求字段：

- `session_id`、`user_id`、`message`、`adapter_type`
- `persona_json` — 客户端的人设对象
- 可选 `history_json`

响应包含输出分片以及 `done`、情绪状态、心理能量、已启动的任务 id 和安全折叠
后的 THINK 摘要。L.I.F.E 可能创建 Agent 任务、记忆提案、日记/梦境条目或
主动消息候选。它从不暴露模型隐藏的思维链。

## 人设与自定义提示词

人设对象包含 `name`、`avatar`、`birthDate`、`description`、`personality`、
`greeting` 和 **`customPrompt`**。`customPrompt` 在「设置 → 人设」中编写，
并**逐字作为模型 system prompt** 发送，位于人设描述之前，THINK 与 OUTPUT
调用均如此。留空即关闭。其余人设字段会被渲染进内嵌在 system prompt 里的
人设上下文。

## `OnTaskCompleted`

Agent 任务进入终态时由 Core 调用。L.I.F.E 更新情绪、陪伴审计日志与会话
通知队列。回调携带任务 id、状态、result 与 error；它是幂等的。

## `OnScheduledEvent`

Core 可以发送昼夜节律 tick、记忆巩固或空闲检查。L.I.F.E 执行有界的维护
工作并持久化结果。

## 记忆 API

`GetMemories` 为 LIFE 自有的管理界面返回记忆投影。SQLite 事实库是权威数据；
BM25、向量与 Tantivy 索引都是可重建的投影。

## 陪伴 API

`GetCompanion` 返回 LIFE 自有的关系、日程、主动消息、群场景、日记、梦境、
人设演化与审计投影。

`ManageCompanion` 支持受控操作：

- `add_agenda`、`confirm_agenda`、`reject_agenda`、`complete_agenda`
- `journal`、`dream`、`memory_maintenance`
- `delete_memory`、`clear_all_memory`、`ack_notifications`

所有变更可审计，并尽可能保证幂等。

## `CompactConversation`

通过 L.I.F.E 配置的模型总结一段会话。摘要是客户端可恢复的上下文投影；在
用户主动清理之前，并不是对底层本地历史的不可逆删除。

## `GetNotifications`

返回按会话寻址的任务完成通知，供 WebUI 轮询。读取不删除：确认请使用
`ack_notifications`（或 `POST /api/life/notifications`）。

## 权限

`screen_watch`、`computer_use`、`report_agent_host` 默认关闭。它们分别门控
屏幕观察、shell/计算机操作与心跳里的主机遥测。`ReportAgentHost` 也会从
`POST /api/settings/life` 同步过来。
