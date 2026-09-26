# Core Services

Plugins call `core.v1.CoreService` for platform orchestration: model access,
agent dispatch, task control and direct tool execution. Core is the only
component that holds provider credentials and the plugin registry.

## `CallMocr`

Proxies a generation request to the model gateway and returns a server stream.
Use `model_id` to pin a model; leave it empty only when the caller intentionally
wants Core/mocr model selection.

Important fields:

- `request_id` — caller correlation id.
- `caller_id` — plugin or session owner.
- `prompt` — current user/task prompt.
- `session_id` — conversation/session key.
- `messages` — optional full history.
- `model_id` — optional pinned model (`MOCR` means “let mocr choose”).
- `system_prompt` — domain instructions. LIFE sends the persona and the
  user-authored **custom prompt** here (see [L.I.F.E Service](life-service.md)).
- `context` — difficulty, token, temperature and task metadata.

## `UseAgent`

Dispatches asynchronous work to an independent Agent. The response only confirms
acceptance; read `/api/tasks`, poll Agent task status, or wait for the LIFE
completion callback for the result.

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

`metadata` is `map<string,string>`. Always stringify numbers, booleans and
objects before constructing the protobuf request.

- `permission_mode`: `normal` waits for a user decision on every privileged tool
  call; `full_access` runs without prompts. Sub-agents inherit the mode.
- `thinking_intensity`: `off`/`low`/`medium`/`high`/`max` or `0`–`100`.

## `CancelAgent`

Cancels a task by `task_id` and `caller_id`. Cancellation is best effort and
must be treated as a state transition, not proof that the underlying process has
already stopped.

## `ListAgents`

Returns registered Agent instances with health, callback address, active task
count, heartbeat age and host information. Pass `include_unhealthy` to see
executors that have stopped heartbeating.

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
data as untrusted external output. Management operations such as
`workspace_browse`, `workspace_mkdir`, `host_status`, `approval_list` and
`approval_decide` also go through `RunDirect` but are never exposed to the model
as callable tools.
