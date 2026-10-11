# mocr Service

mocr is the model gateway: it owns provider transports, model selection, retries
and usage accounting. It exposes `mocr.v1.MocrService` on loopback
(`MOCR_ADDRESS`, default `localhost:50052`) and holds no user data of its own.

> **Language / 语言**: English · [简体中文](zh-CN/mocr-service.md)

## Install and run

mocr is part of the main 0KAY repository (`mocr/`). It needs Go 1.27+.

```sh
make dev-mocr                    # cd mocr && go run ./cmd/mocr

# or build a binary once and run it
go -C mocr build -o ../.run/mocr ./cmd/mocr
```

Docker Compose starts it as the `mocr` service, and
`0kay-pm install @razuresoft/0kay` installs it as a managed background service.
Registration is automatic: mocr dials Core on `CORE_ADDRESS` (default
`localhost:50051`) and presents `CORE_PLUGIN_REGISTRATION_TOKEN`
(`x-0kay-registration-token` metadata). Attributed Core HTTP calls carry
`X-0KAY-Plugin: mocr` + the issued service token, falling back to a
`CORE_API_TOKEN` bearer.

Useful environment variables: `MOCR_GRPC_PORT` (50052), `MOCR_BIND_HOST`
(loopback), `MOCR_ADDRESS` (advertised address), `MOCR_GENERATION_TIMEOUT`,
`MOCR_GRPC_TOKEN` (serving-side auth).

## `ChooseModels`

Returns `think_model` and `output_model` for a prompt, based on difficulty,
thinking requirements, token budget and the current Core provider catalog
(`GET /api/models`). A pinned `model_id` on `Generate` bypasses selection.

Auto-switch resolves candidate credentials from
`GET /api/providers/credentials` (the redacted `GET /api/providers` no longer
carries keys); the lookup runs per request so newly added providers are usable
immediately. That endpoint is machine-only, so mocr attributes the call with
`X-0KAY-Plugin: mocr` + its service token, falling back to `CORE_API_TOKEN`.

Since the jev-router integration, selection runs a two-stage router embedded
in the mocr binary (ported from the jev_router project; no sidecar process):

1. **Intent inference** — the prompt is classified into capability tags
   (`vision`, `long_ctx`, `agentic`, `reasoning`, …) plus a 1–5 difficulty by a
   char-3-gram kNN over an embedded training set, with a keyword-heuristic
   fallback when the confidence guard decides the task shape was never seen
   (`ROUTER_MODE=heuristic` forces the keyword baseline).
2. **Deterministic pick** — the cheapest model in the caller's pool that meets
   (tags ∧ power ≥ difficulty) wins, with tag relaxation and a strongest-model
   fallback. Pool metadata comes from an embedded ~356-model catalog
   (power/context/cost/tags, matched by bare model id); models the catalog does
   not know get synthesized metadata so they stay routable.

Selection strategies (Settings → **模型**) map onto the router's strategies:
`auto`/`cost` → `economy` (cheapest capable, stronger on ties), `quality` →
`performance` (strongest first); `pinned` uses the configured default model
only. The gRPC contract is unchanged — `ChooseModelsRequest{prompt, context}`
→ `{think_model, output_model, reasoning}` — and `reasoning` now carries the
router's rationale (inferred difficulty, tags, strategy, evidence hits). The
think model routes with the full inferred spec (a `reasoning` gate is added
when thinking is required); the output model routes with the hard capability
gates lifted and the difficulty capped at the light tier, which is what makes
it the cheap "expression" model.

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
