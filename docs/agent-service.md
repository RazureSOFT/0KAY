# Agent Service

The independent `0KAY-agent` repository exposes `agent.v1.AgentService` to Core
and registers itself with `agent` plus `executor:<uuid>` capabilities and
`requires:mocr`. All model calls go through mocr.

> **Language / 语言**: English · [简体中文](zh-CN/agent-service.md)

## Install and run

Agent lives in the independent [0KAY-agent](https://github.com/RazureSOFT/0KAY-agent)
repository (cloned to `agent/` by `bootstrap.ps1`). It needs Node.js 22+.

```sh
cd agent
npm install            # or: make deps-node from the 0KAY root
npm test               # regression suite
npm run build          # tsc -> dist/
npm run dev            # tsx src/index.ts — Agent gRPC on :50054
```

Docker Compose profile `agent` starts it (`docker-compose --profile agent up -d`),
and `0kay-pm install @razuresoft/0kay-agent` installs it as a managed service.
Registration is automatic: it dials Core (`CORE_ADDRESS`, default
`localhost:50051`) and presents `CORE_PLUGIN_REGISTRATION_TOKEN`; set that
variable to the agent's dedicated enrollment key (`CORE_PLUGIN_TOKEN_AGENT`)
when Core enforces per-plugin tokens. `AGENT_GRPC_PORT` (50054) and
`AGENT_BIND_HOST` (loopback) control the listener; `AGENT_DATA_DIR` holds the
executor identity.
It registers over Core's `core.v1.PluginService.Register` and, when
`CORE_PLUGIN_REGISTRATION_TOKEN` is set, forwards that value as the
`x-0kay-registration-token` gRPC metadata. Attributed Core HTTP/egress calls
carry `X-0KAY-Plugin: agent` + the service token (falling back to a
`CORE_API_TOKEN` bearer).

## `ExecuteTask`

Runs a task to completion:

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

Task states: `TASK_STATE_PENDING`, `TASK_STATE_RUNNING`, `TASK_STATE_DONE`,
`TASK_STATE_FAILED`, `TASK_STATE_CANCELLED`. A cancelled or truncated run is
never reported as `DONE`. There is no fixed tool-round limit: the loop continues
until a final reply, a failure or a user cancellation.

## `CancelTask`

Requests cancellation. The Agent stops starting new iterations and reports the
final cancellation state.

## `GetTaskStatus`

Returns the task state, result and error for a task ID.

## `RunDirect`

Executes one registered Agent tool. Arguments are a JSON object encoded as a
string. Management operations (`workspace_browse`, `workspace_mkdir`,
`host_status`, `approval_list`, `approval_decide`) are also served here but are
not added to the model tool list.

## Tool contract

Agent tools expose `name`, `description`, a JSON Schema `parameters` object and
an asynchronous execution returning `{ success, data, error? }`. Dangerous tools
stay disabled by default unless the user or plugin permission explicitly enables
them. Built-in tools include file read/write/edit, `apply_patch`, glob, grep,
shell (`bash`), web fetch/search, todo, sub-agent (`task`), MCP and computer-use.
The `computeruse` tool drives the whole desktop — screenshot, window list, mouse
move/click, typing and key presses — on Windows (`powershell`), macOS
(`screencapture`/`osascript`/`cliclick`) and Linux
(`grim`/`scrot`/ImageMagick, `xdotool`), and stays disabled until the user grants
computer-use permission. Uploaded task attachments (see `attachments` on
`/api/agent/messages`) are fetched into memory — nothing is written to disk:
text files are inlined into the task prompt and images are sent to the model as
native multimodal image parts (`Message.content_parts` over mocr).

## Approvals and questions

In `normal` permission mode every privileged tool call waits for a user decision
(`Approval`), and the `question` tool waits for a choice or free text. Core
exposes the outstanding items through `/api/agent/approvals` and
`/api/agent/questions` (the WebUI inbox reads the merged `/api/agent/inbox`).
In `full_access` mode calls run without prompting.

## File edits and diffs

`edit` and `apply_patch` return a unified diff per touched file. The diff starts
with `--- a/<path>` / `+++ b/<path>` and emits `@@ -old +new @@` hunk headers so
the WebUI can show the source file and the exact changed line numbers, with
added lines in green and deleted lines in red. Sub-agent (`task`) calls render as
collapsible nested cards in the same workspace view.

## Task kinds: Plan / Agent / Work

The WebUI composer (and `agent_type` on `ExecuteTask`) offers three top-level
kinds:

| Kind | `agent_type` | Behavior |
|---|---|---|
| **Plan** | `plan` | Planning-only run: read-only research, then a structured plan document. Files are never modified. |
| **Agent** | sub-kind | Autonomous multi-step execution. Only this kind has second-level options (sub-kinds). |
| **Work** | `work` | Focused single-pass execution: direct edits, minimal questions, cheap verification. |

Agent sub-kinds map to skill-named agent types (`skills/<name>.md` is force-applied):
`general` (通用), `code` (编程), `code_explore` (exploration fan-out to
independent explorer sub-agents), `research` (调研) and `science` (科研).
Adding a new sub-kind is just a new skill file.

## Duet mode: big model plans, small model implements

Settings expose `duet_mode` (per-task option `duet_mode=1|0` wins). When
enabled and no model is pinned manually, `ChooseModels` returns a think/output
pair and the run splits in two:

1. **Plan phase** — the think (big) model drafts the implementation plan plus a
   self-contained implementation prompt inside
   `<implementation_prompt>…</implementation_prompt>`. The plan appears in the
   transcript as an assistant message.
2. **Implement phase** — the loop runs pinned to the output (small) model with
   the plan in history; it implements and verifies, without re-planning.

Planning failures fall back to the normal single-model loop. The mode exists so
the expensive model reasons once while the cheap model does the typing.

## Thinking intensity

See [Thinking Intensity](THINKING.md). Agent forwards the level to mocr as gRPC
metadata `x-0kay-thinking-level`; mocr maps it to provider-specific reasoning
parameters.
