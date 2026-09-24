# mocr Service

mocr exposes `mocr.v1.MocrService`.

## `ChooseModels`

Returns `think_model` and `output_model` based on prompt difficulty, thinking
requirements, token budget, and the current Core provider catalog.

## `Generate`

Server-streaming model gateway. It supports:

- OpenAI-compatible providers
- Anthropic-compatible providers
- text streaming
- thinking mode
- native function/tool definitions
- streamed/native tool calls
- usage and finish reason

`GenerateRequest.tools` carries JSON Schema function definitions. A tool call is
returned as `ToolCall { id, type, function_name, arguments }`.

The Agent owns tool execution. mocr only transports provider tool calls and does
not execute arbitrary functions.
