package providers

import "testing"

func TestParsePriceOverridesJSON(t *testing.T) {
	overrides := ParsePriceOverrides(`{"deepseek-flash":{"in":0.14,"out":0.28},"x":{"per_call":0.01}}`)
	if overrides["deepseek-flash"].InPerMillion != 0.14 || overrides["deepseek-flash"].OutPerMillion != 0.28 {
		t.Errorf("json per-million not parsed: %+v", overrides["deepseek-flash"])
	}
	if overrides["x"].PerCall != 0.01 {
		t.Errorf("per_call not parsed: %+v", overrides["x"])
	}
	if overrides["x"].Source != "user" {
		t.Errorf("source = %q", overrides["x"].Source)
	}
}

func TestParsePriceOverridesLegacy(t *testing.T) {
	overrides := ParsePriceOverrides("m1:0.000001, bad, m2:0")
	if len(overrides) != 1 {
		t.Fatalf("expected 1 entry, got %+v", overrides)
	}
	if in := overrides["m1"].InPerMillion; in < 0.99 || in > 1.01 {
		t.Errorf("legacy per-token should become ~1 USD/1M, got %v", in)
	}
}

func TestResolvePricePrecedence(t *testing.T) {
	overrides := map[string]PriceSpec{"flash": {InPerMillion: 9, Source: "user"}}
	// user override wins (substring match)
	if spec := ResolvePrice("deepseek-flash", overrides); spec.InPerMillion != 9 || spec.Source != "user" {
		t.Errorf("user override expected, got %+v", spec)
	}
	// unconfigured models fall back to the heuristic
	if spec := ResolvePrice("my-flash-model", nil); spec.Source != "heuristic" {
		t.Errorf("expected heuristic, got %+v", spec)
	}
}

func TestEstimateCost(t *testing.T) {
	spec := PriceSpec{PerCall: 0.01, InPerMillion: 1, OutPerMillion: 2}
	got := spec.EstimateCost(1_000_000, 1_000_000)
	if got != 0.01+1+2 {
		t.Errorf("estimate = %v", got)
	}
}
