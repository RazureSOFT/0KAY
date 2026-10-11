package selector

import (
	"os"
	"strings"
)

// getenv is a small indirection so tests can pin the environment.
var getenv = os.Getenv

// handAliases are jev_router's curated brand aliases ("deepseek" ->
// deepseek-flash, "claude" -> claude-sonnet-4-6, ...). Only aliases whose
// canonical model exists in the active pool take effect; company names and
// ultra-short aliases that misfire inside ordinary sentences were dropped
// upstream. Hand aliases that name models absent from the pool are inert.
var handAliases = map[string]string{
	"gpt-6-astra": "gpt-6-astra", "gpt-6.1-sol": "gpt-6.1-sol", "gpt-6-mini": "gpt-6-mini",
	"gpt-6-luna": "gpt-6-luna", "gpt6": "gpt-6-astra", "astra": "gpt-6-astra",
	"deepseek-v4-pro": "deepseek-v4-pro", "deepseek-r1": "deepseek-r1",
	"deepseek-flash": "deepseek-flash", "deepseek": "deepseek-flash",
	"kimi-k3": "kimi-k3", "kimi-k2.7-code": "kimi-k2.7-code", "kimi-k2.6": "kimi-k2.6",
	"kimi": "kimi-k3", "moonshot": "kimi-k3",
	"claude-opus-4-8": "claude-opus-4-8", "claude-sonnet-4-6": "claude-sonnet-4-6",
	"claude-haiku-5-5": "claude-haiku-5-5", "claude": "claude-sonnet-4-6",
	"opus": "claude-opus-4-8", "sonnet": "claude-sonnet-4-6", "haiku": "claude-haiku-5-5",
	"grok-4.7": "grok-4.7", "grok": "grok-4.7", "xai": "grok-4.7",
	"glm-5.3-prime": "glm-5.3-prime", "glm-5": "glm-5", "glm-air": "glm-air",
	"glm-flash": "glm-flash", "glm": "glm-5", "zhipu": "glm-5", "z.ai": "glm-5", "zai": "glm-5",
	"gemini-3-pro": "gemini-3-pro", "gemini-3-flash": "gemini-3-flash",
	"gemini-3-nano": "gemini-3-nano", "gemini": "gemini-3-pro",
	"qwen3.5-max": "qwen3.5-max", "qwen3.5-coder": "qwen3.5-coder", "qwen3.5-flash": "qwen3.5-flash",
	"qwen": "qwen3.5-max", "qwen3": "qwen3.5-max",
	"llama-4-maverick": "llama-4-maverick", "llama-4-scout": "llama-4-scout",
	"llama": "llama-4-maverick", "meta": "llama-4-maverick",
	"mistral-large": "mistral-large", "ministral": "ministral", "mistral": "mistral-large",
	"command-r-plus": "command-r-plus", "cohere": "command-r-plus",
	"hunyuan-pro": "hunyuan-pro", "hunyuan-turbo": "hunyuan-turbo", "hunyuan": "hunyuan-pro",
	"ernie-5.0": "ernie-5.0", "ernie": "ernie-5.0",
}

// handAlias zh brand names (matched on runes, same boundary rule).
func init() {
	for alias, target := range map[string]string{
		"通义": "qwen3.5-max",
		"混元": "hunyuan-pro",
		"文心": "ernie-5.0",
	} {
		handAliases[alias] = target
	}
}

// universalTags are capabilities essentially every modern model has; treating
// them as hard gates would push trivial tasks onto flagships. Only rigid
// differences (vision/long_ctx/agentic/reasoning) stay hard gates upstream.
var universalTags = []string{"tools", "writing", "code", "multilingual", "chinese_strong"}

func tagSet(tags ...string) map[string]struct{} {
	out := make(map[string]struct{}, len(tags))
	for _, t := range tags {
		if t = strings.TrimSpace(t); t != "" {
			out[t] = struct{}{}
		}
	}
	return out
}
