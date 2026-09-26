package providers

import (
	"encoding/json"
	"strconv"
	"strings"
)

// PriceSpec describes a model's price: USD per request and/or USD per 1M tokens.
// Source is "user" | "heuristic" and is informational only. All prices are
// user-authored from the model settings; there is no built-in price table.
type PriceSpec struct {
	PerCall       float64 `json:"per_call,omitempty"`
	InPerMillion  float64 `json:"in,omitempty"`
	OutPerMillion float64 `json:"out,omitempty"`
	Source        string  `json:"-"`
}

// EstimateCost returns the estimated USD cost for one request.
func (p PriceSpec) EstimateCost(promptTokens, outputTokens int) float64 {
	return p.PerCall +
		float64(promptTokens)/1_000_000*p.InPerMillion +
		float64(outputTokens)/1_000_000*p.OutPerMillion
}

// ParsePriceOverrides accepts JSON {"pattern":{"in":..,"out":..,"per_call":..}}
// or the legacy "pattern:costPerToken" (comma separated) form.
func ParsePriceOverrides(raw string) map[string]PriceSpec {
	out := map[string]PriceSpec{}
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return out
	}
	if strings.HasPrefix(raw, "{") {
		var parsed map[string]PriceSpec
		if json.Unmarshal([]byte(raw), &parsed) == nil {
			for key, spec := range parsed {
				spec.Source = "user"
				out[strings.ToLower(strings.TrimSpace(key))] = spec
			}
			return out
		}
	}
	for _, part := range strings.Split(raw, ",") {
		part = strings.TrimSpace(part)
		idx := strings.LastIndex(part, ":")
		if idx <= 0 {
			continue
		}
		key := strings.ToLower(strings.TrimSpace(part[:idx]))
		if key == "" {
			continue
		}
		if value, err := strconv.ParseFloat(strings.TrimSpace(part[idx+1:]), 64); err == nil && value > 0 {
			out[key] = PriceSpec{InPerMillion: value * 1_000_000, OutPerMillion: value * 1_000_000, Source: "user"}
		}
	}
	return out
}

// ResolvePrice returns the user-configured price for a model (substring match).
// Unconfigured models fall back to a name-based guess so cost ordering still
// works; set a price to make it authoritative.
func ResolvePrice(modelID string, overrides map[string]PriceSpec) PriceSpec {
	low := strings.ToLower(modelID)
	for key, spec := range overrides {
		if key != "" && strings.Contains(low, key) {
			return spec
		}
	}
	return heuristicPrice(modelID)
}

func heuristicPrice(modelID string) PriceSpec {
	low := strings.ToLower(modelID)
	spec := PriceSpec{Source: "heuristic"}
	switch {
	case hasAnyPrice(low, "mini", "haiku", "flash", "turbo", "small", "lite", "air", "fast", "highspeed", "nano"):
		spec.InPerMillion, spec.OutPerMillion = 0.2, 0.8
	case hasAnyPrice(low, "opus", "o1", "o3", "pro", "max", "ultra", "reasoner"):
		spec.InPerMillion, spec.OutPerMillion = 10, 30
	case hasAnyPrice(low, "sonnet", "gpt-4", "gpt-5", "grok", "kimi", "qwen", "glm", "4.1"):
		spec.InPerMillion, spec.OutPerMillion = 2, 8
	default:
		spec.InPerMillion, spec.OutPerMillion = 1, 3
	}
	return spec
}

func hasAnyPrice(value string, needles ...string) bool {
	for _, needle := range needles {
		if strings.Contains(value, needle) {
			return true
		}
	}
	return false
}
