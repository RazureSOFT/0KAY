# Model Catalog

This is a dated fallback catalog. At runtime Core prefers the configured
provider's `/models` response; these entries are used when that endpoint is
unavailable or the provider has not been configured yet.

Last checked: 2026-09-24

## Official Sources

- DeepSeek: https://api-docs.deepseek.com/quick_start/pricing
- OpenAI: https://platform.openai.com/docs/models
- xAI: https://docs.x.ai/docs/models
- Anthropic: https://docs.anthropic.com/en/docs/about-claude/models
- Moonshot/Kimi: https://platform.kimi.ai/docs/quickstart

## Fallback IDs

- DeepSeek: `deepseek-flash`, `deepseek-v4-pro`
- OpenAI: `gpt-5`, `gpt-5-mini`, `gpt-4.1`, `gpt-4.1-mini`, `o3`, `o4-mini`
- xAI: `grok-4.1`, `grok-4.1-fast`, `grok-4`, `grok-3-mini`
- Anthropic: `claude-opus-4-1-20250805`, `claude-sonnet-4-20250514`, `claude-3-7-sonnet-20250219`, `claude-3-5-haiku-20241022`
- Moonshot/Kimi: `kimi-k3`, `kimi-k2.7-code`, `kimi-k2.7-code-highspeed`, `kimi-k2.6`

The catalog is intentionally not treated as authoritative. Provider APIs are
the source of truth whenever credentials and a live endpoint are available.
