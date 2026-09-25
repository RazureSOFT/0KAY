# Agent 思考强度与执行

五档为 off / low / medium / high / max。胶囊滑块只是选择方式，拖动时连续，松开吸附到档位。

| 档位 | 选型 difficulty_hint | thinking |
|---|---:|---|
| off | 0 | false |
| low | 0.2 | true |
| medium | 0.5 | true |
| high | 0.75 | true |
| max | 1 | true |

Agent 经 gRPC metadata `x-0kay-thinking-level` 传给 mocr。MOCR 自动选型使用难度与 require_thinking；固定模型不更换模型。
供应商映射：DeepSeek 使用 thinking enabled/disabled（不支持五种独立预算）；OpenAI 推理模型使用 reasoning_effort low/medium/high，max 保守映射 high；可关闭推理的 GPT-5.1/5.2 使用 none，不能关闭的固定推理模型明确报错。Anthropic 使用 1024/2048/4096/8192 reasoning budget，必要时提高 max_tokens。
因此最高档特效不代表供应商支持“比 high 更强”的参数。

工具轮数不再设置固定上限；一直执行到最终回复、失败或用户取消。单次网络/工具调用仍有超时。Normal 权限等待全站审批，question 工具等待选项或自由文本。任务结束后 Agent 另行生成简短 handoff（artifacts/path/usage/outcome/limitations），Core 给 LIFE 的回调仅携带该产物信息，完整执行上下文留在 Agent 会话。

mocr 统一记录所有经过网关的生成 usage；请求 OpenAI stream_options.include_usage，按 Anthropic message_start/message_delta 合并。不再伪造 10/1 token。供应商未提供 usage 时为 0，不能当作免费或精确估算；中断且没有 usage 的调用仍无法得知实际账单。
