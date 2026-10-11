# Agent 服务

> **Language / 语言**: [English](../agent-service.md) · 简体中文

独立的 [0KAY-agent](https://github.com/RazureSOFT/0KAY-agent) 仓库向 Core
暴露 `agent.v1.AgentService`，以 `agent` + `executor:<uuid>` 能力注册并声明
`requires:mocr`。所有模型调用都经过 mocr。

它通过 Core 的 `core.v1.PluginService.Register` 注册；设置
`CORE_PLUGIN_REGISTRATION_TOKEN` 时会把它放进 `x-0kay-registration-token`
元数据。对 Core HTTP/出口的署名调用带 `X-0KAY-Plugin: agent` + 服务令牌
（回退 `CORE_API_TOKEN` bearer）。

## 安装与运行

Agent 在独立的 0KAY-agent 仓库中（`bootstrap.ps1` 会克隆到 `agent/`），
需要 Node.js 22+。

```sh
cd agent
npm install            # 或在 0KAY 根目录执行 make deps-node
npm test               # 回归测试
npm run build          # tsc -> dist/
npm run dev            # tsx src/index.ts — Agent gRPC :50054
```

Docker Compose 的 `agent` profile 可启动它
（`docker-compose --profile agent up -d`），`0kay-pm install
@razuresoft/0kay-agent` 把它安装为托管服务。注册是自动的：拨连 Core
（`CORE_ADDRESS`，默认 `localhost:50051`）并出示
`CORE_PLUGIN_REGISTRATION_TOKEN`；Core 启用按插件令牌时，把该变量设为
agent 的专属注册密钥（`CORE_PLUGIN_TOKEN_AGENT`）。`AGENT_GRPC_PORT`
（50054）与 `AGENT_BIND_HOST`（回环）控制监听；`AGENT_DATA_DIR` 存放执行器
身份。

## `ExecuteTask`

把任务执行到完成：

```json
{
  "task_id": "task_123",
  "prompt": "Inspect the repository and implement the requested change.",
  "agent_type": "code",
  "metadata": {
    "thinking_intensity": "medium",
    "permission_mode": "normal"
  }
}
```

任务状态：`TASK_STATE_PENDING`、`TASK_STATE_RUNNING`、`TASK_STATE_DONE`、
`TASK_STATE_FAILED`、`TASK_STATE_CANCELLED`。被取消或截断的运行永远不会
上报为 `DONE`。没有固定的工具轮数上限：循环持续到最终回复、失败或用户
取消。

## `CancelTask`

请求取消。Agent 停止开始新的迭代并上报最终取消状态。

## `GetTaskStatus`

按任务 id 返回任务状态、result 与 error。

## `RunDirect`

执行一个已注册的 Agent 工具。参数是编码为字符串的 JSON 对象。管理操作
（`workspace_browse`、`workspace_mkdir`、`host_status`、`approval_list`、
`approval_decide`）也在此提供，但不会加入模型工具列表。

## 任务类型：计划 / 智能体 / 工作

WebUI 输入区（以及 `ExecuteTask` 的 `agent_type`）提供三个顶层类型：

| 类型 | `agent_type` | 行为 |
|---|---|---|
| **计划（Plan）** | `plan` | 只做规划：只读调研后产出结构化方案文档，从不修改文件。 |
| **智能体（Agent）** | 子类型 | 自主多步执行。只有此类型有二级子选项。 |
| **工作（Work）** | `work` | 单遍专注执行：直接修改、少提问、廉价验证。 |

智能体子类型映射到技能名（强制启用 `skills/<name>.md`）：`general`（通用）、
`code`（编程）、`code_explore`（探索扇出，派发独立探索者子代理后择优）、
`research`（调研）、`science`（科研）。新增子类型只需新增一个技能文件。

## Duet 模式：大模型定方案，小模型写实现

设置里有 `duet_mode`（每任务选项 `duet_mode=1|0` 优先）。开启且未手动钉住
模型时，`ChooseModels` 返回 think/output 模型对，运行一分为二：

1. **方案阶段** — 大模型（think）起草实现方案，并在
   `<implementation_prompt>…</implementation_prompt>` 内写出自包含的实现
   提示词。方案作为 assistant 消息出现在会话记录里。
2. **实现阶段** — 主循环钉在小模型（output）上，带着方案历史进行实现与
   验证，不再重新规划。

方案阶段失败会回退到普通的单模型循环。该模式的意义：贵的模型只推理一次，
便宜的模型负责打字。

## 工具契约

Agent 工具暴露 `name`、`description`、JSON Schema 的 `parameters` 对象与
异步执行，返回 `{ success, data, error? }`。危险工具默认禁用，除非用户或
插件权限显式开启。内置工具包括文件读/写/编辑、`apply_patch`、glob、grep、
shell（`bash`）、网页抓取/搜索、todo、子代理（`task`）、MCP 与 computer-use。
`computeruse` 工具可驱动整个桌面——截图、窗口列表、鼠标移动/点击、打字与
按键——覆盖 Windows（`powershell`）、macOS
（`screencapture`/`osascript`/`cliclick`）与 Linux
（`grim`/`scrot`/ImageMagick、`xdotool`），并在用户授予 computer-use 权限前
保持禁用。任务附件（见 `/api/agent/messages` 的 `attachments`）被读入内存
——不落盘：文本文件内联进任务 prompt，图片作为原生多模态图像分片
（经 mocr 的 `Message.content_parts`）发给模型。

## 审批与提问

`normal` 权限模式下，每个特权工具调用都等待用户决定（`Approval`），
`question` 工具等待选项或自由文本。Core 通过 `/api/agent/approvals` 与
`/api/agent/questions` 暴露待处理项（WebUI 收件箱轮询合并后的
`/api/agent/inbox`）。`full_access` 模式下调用直接执行。

## 文件编辑与 diff

`edit` 与 `apply_patch` 对每个被改文件返回统一 diff。diff 以
`--- a/<path>` / `+++ b/<path>` 开头，`@@ -old +new @@` 的 hunk 头让 WebUI
可以同时展示源文件与精确改动行号，新增行绿色、删除行红色。子代理（`task`）
调用在同一工作区视图中渲染为可折叠的嵌套卡片。

## 思考强度

见 [Thinking Intensity](THINKING.md)。Agent 以 gRPC 元数据
`x-0kay-thinking-level` 把强度传给 mocr；mocr 映射为各家供应商的推理参数。
