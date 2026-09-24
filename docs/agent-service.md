# Agent Service

The independent `0KAY-agent` repository exposes `agent.v1.AgentService` to
Core.

## `ExecuteTask`

Runs a task to completion:

```json
{
  "task_id": "task_123",
  "prompt": "Inspect the repository and implement the requested change.",
  "agent_type": "code",
  "metadata": {
    "thinking_intensity": "medium"
  }
}
```

Task states are:

- `TASK_STATE_PENDING`
- `TASK_STATE_RUNNING`
- `TASK_STATE_DONE`
- `TASK_STATE_FAILED`
- `TASK_STATE_CANCELLED`

## `CancelTask`

Requests cancellation of a task. The Agent must stop new iterations and report
the final cancellation state.

## `GetTaskStatus`

Returns the task state, result, and error for a task ID.

## `RunDirect`

Executes one registered Agent tool. Arguments are a JSON object encoded as a
string. Current built-in tools include file reading/writing/editing, patching,
glob/grep, shell, web fetch/search, todo, sub-agent, MCP, and Windows
computer-use tools.

## Tool Contract

Agent tools expose:

- `name`
- `description`
- JSON Schema `parameters`
- asynchronous execution returning `{ success, data, error? }`

Dangerous tools must remain disabled by default unless the user or plugin
permission explicitly enables them.
