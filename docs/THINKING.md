# Thinking Intensity and Execution

Thinking intensity has five levels: off / low / medium / high / max. The pill
slider is continuous while dragging and snaps to a level on release; it expresses
how deeply the model should reason, and does not guarantee the provider supports a
stronger parameter.

| Level | Selection difficulty_hint | thinking |
|---|---:|---|
| off | 0 | false |
| low | 0.2 | true |
| medium | 0.5 | true |
| high | 0.75 | true |
| max | 1 | true |

The Agent forwards the level to mocr as gRPC metadata `x-0kay-thinking-level`.
Automatic selection uses difficulty and require_thinking; a pinned model is never
swapped.

## Provider mapping

- **DeepSeek** uses thinking enabled/disabled; it does not support five distinct
  budgets.
- **OpenAI reasoning models** use `reasoning_effort` low/medium/high, with max
  mapped conservatively to high.
- **GPT-5.1/5.2 and other models that can disable reasoning** use `none`.
- **Fixed reasoning models that cannot disable reasoning** raise an explicit
  error rather than silently degrade.
- **Anthropic** uses a reasoning budget of 1024/2048/4096/8192, raising
  max_tokens when needed.

The top level's visual effects therefore do not imply a provider supports a
parameter stronger than high.

## Execution loop

There is no fixed tool-round limit: the loop runs until a final reply, a failure
or a user cancellation. A single network/tool call still has a timeout.

- `normal` permission: every privileged tool call waits for a whole-site
  approval; the `question` tool waits for a choice or free text.
- `full_access` permission: calls run without prompting, inherited by sub-agents.

After a task ends the Agent produces a short handoff
(artifacts/path/usage/outcome/limitations); the callback Core sends to LIFE
carries only that artifact summary, and the full execution context stays in the
Agent session.

## Usage

mocr records the usage of every generation that passes through the gateway. It
requests OpenAI `stream_options.include_usage` and merges Anthropic
`message_start`/`message_delta`. When a provider omits usage the value is `0` —
not a free call and not an accurate estimate; interrupted calls without usage
cannot be billed accurately.
