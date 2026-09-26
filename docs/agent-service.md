# Agent Service

The independent `0KAY-agent` repository exposes `agent.v1.AgentService` to Core
and registers itself with `agent` plus `executor:<uuid>` capabilities and
`requires:mocr`. All model calls go through mocr.

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
shell (`bash`), web fetch/search, todo, sub-agent (`task`), MCP and Windows
computer-use.

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

## Thinking intensity

See [Thinking Intensity](THINKING.md). Agent forwards the level to mocr as gRPC
metadata `x-0kay-thinking-level`; mocr maps it to provider-specific reasoning
parameters.
