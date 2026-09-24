# Core Services

Plugins use `core.v1.CoreService` for platform orchestration.

## `CallMocr`

Calls the model gateway and returns a server stream. Use `model_id` to pin a
model; leave it empty only when the caller intentionally wants Core/mocr model
selection.

Important fields:

- `request_id`: caller correlation ID.
- `caller_id`: plugin or session owner.
- `prompt`: current user/task prompt.
- `session_id`: conversation/session key.
- `messages`: optional full history.
- `model_id`: optional pinned model.
- `system_prompt`: domain instructions.
- `context`: difficulty, token, temperature, and task metadata.

## `UseAgent`

Dispatches asynchronous work to an independent Agent:

```json
{
  "task_id": "task_123",
  "caller_id": "life",
  "prompt": "Create and run a Python connectivity check.",
  "agent_type": "code",
  "metadata": {
    "thinking_intensity": "medium",
    "difficulty_hint": "0.5",
    "require_thinking": "false"
  }
}
```

`metadata` is `map<string,string>`. Always stringify numbers, booleans, and
objects before constructing the protobuf request.

The response only confirms acceptance. Read `/api/tasks`, use Agent task status,
or consume the L.I.F.E completion callback for the result.

## `CancelAgent`

Cancels a task by `task_id` and `caller_id`. Cancellation is best effort and
must be treated as a state transition, not proof that the underlying process
has already stopped.

## `ListAgents`

Returns registered Agent instances, health, callback address, active task count,
heartbeat age, and host information.

## `RunDirect`

Runs one Agent-host tool without an LLM loop:

```json
{
  "tool": "computeruse",
  "args": "{\"action\":\"screenshot\"}",
  "session_id": "life-computeruse"
}
```

Sensitive tools require the relevant LIFE/Core permission. Treat returned tool
data as untrusted external output.
