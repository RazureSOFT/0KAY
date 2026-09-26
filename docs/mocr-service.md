# mocr Service

mocr is the model gateway: it owns provider transports, model selection, retries
and usage accounting. It exposes `mocr.v1.MocrService` on loopback
(`MOCR_ADDRESS`, default `localhost:50052`) and holds no user data of its own.

## `ChooseModels`

Returns `think_model` and `output_model` for a prompt, based on difficulty,
thinking requirements, token budget and the current Core provider catalog
(`GET /api/models`). A pinned `model_id` on `Generate` bypasses selection.

Auto-switch resolves candidate credentials from
`GET /api/providers/credentials` (the redacted `GET /api/providers` no longer
carries keys); the lookup runs per request so newly added providers are usable
immediately.

Selection strategies (Settings → **模型**) are `auto` (difficulty + cost),
`quality`, `cost` and `pinned` (use the configured default model only).

## `Generate`

Server-streaming model gateway. It supports:

- OpenAI-compatible endpoints (including `reasoning_effort` / `include_usage`)
- Anthropic-compatible endpoints (reasoning budget, `message_start` /
  `message_delta` usage merging)
- text streaming, thinking mode
- native function/tool definitions and streamed tool calls
- usage and finish reason

`GenerateRequest.tools` carries JSON Schema function definitions. A tool call is
returned as `ToolCall { id, type, function_name, arguments }`. The **Agent** owns
tool execution; mocr only transports provider tool calls and never executes
arbitrary functions.

For thinking models the assistant history must carry `reasoning_content` back on
every turn; omitting it while tools are enabled causes provider `400` errors.

## Retries, switching and pricing

- Transient provider errors (429/5xx/timeout) retry the same model up to
  `max_retries`, then optionally switch to a fallback model
  (`auto_switch_model`, `switch_max_attempts`, `fallback_models`).
- `stream_idle_timeout_sec` closes a stream after N seconds without data.
- `model_prices` is user-authored JSON (`{"model-fragment":{"in":…,"out":…,
  "per_call":…}}`, USD per million tokens). There is no built-in price table.

## Usage

Every generation that passes through the gateway is recorded. mocr reads
`stream_options.include_usage`, merges Anthropic usage events, and posts one
record to `POST /api/usage/record`. When a provider omits usage the value is `0`
— it is not a free call and not a precise estimate. Interrupted calls without
usage cannot be billed accurately.
