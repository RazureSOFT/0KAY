package server

import (
	"testing"
)

func TestUsageSnapshotTracksCacheAndCost(t *testing.T) {
	u := NewUsageStore("")
	u.AddIfNew(UsageRecord{RequestID: "a", SessionID: "s1", Model: "m1", PromptTokens: 1000, CompletionTokens: 100, TotalTokens: 1100, CachedTokens: 800, CostUSD: 0.012})
	u.AddIfNew(UsageRecord{RequestID: "b", SessionID: "s1", Model: "m1", PromptTokens: 1000, CompletionTokens: 200, TotalTokens: 1200, CachedTokens: 600, CostUSD: 0.02})

	snap := u.Snapshot()

	if got := snap["total_cached_tokens"]; got != int32(1400) {
		t.Fatalf("total_cached_tokens = %v, want 1400", got)
	}
	if got := snap["cache_hit_ratio"]; got != 0.7 {
		t.Fatalf("cache_hit_ratio = %v, want 0.7", got)
	}
	cost, ok := snap["total_cost_usd"].(float64)
	if !ok || cost < 0.0319 || cost > 0.0321 {
		t.Fatalf("total_cost_usd = %v, want ~0.032", snap["total_cost_usd"])
	}
}

func TestUsageDedupeCoversCacheAndCost(t *testing.T) {
	u := NewUsageStore("")
	rec := UsageRecord{RequestID: "dup", Model: "m", PromptTokens: 100, CompletionTokens: 10, TotalTokens: 110, CachedTokens: 90, CostUSD: 0.5}
	u.AddIfNew(rec)
	u.AddIfNew(rec)
	snap := u.Snapshot()
	if got := snap["total_cost_usd"]; got != 0.5 {
		t.Fatalf("dedupe failed, total_cost_usd = %v, want 0.5", got)
	}
	if got := snap["total_cached_tokens"]; got != int32(90) {
		t.Fatalf("dedupe failed, total_cached_tokens = %v, want 90", got)
	}
}

func TestUsageCacheRatioWithNoPrompt(t *testing.T) {
	u := NewUsageStore("")
	u.AddIfNew(UsageRecord{RequestID: "z", Model: "m", CompletionTokens: 5, TotalTokens: 5})
	if got := u.Snapshot()["cache_hit_ratio"]; got != 0.0 {
		t.Fatalf("cache_hit_ratio = %v, want 0.0", got)
	}
}
