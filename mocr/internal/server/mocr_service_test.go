package server

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"google.golang.org/grpc"

	mocrv1 "0kay/gen/mocr/v1"
	"0kay/mocr/internal/providers"
)

// TestFinishGenerateUsesConfiguredPrices is the regression test for the billing
// bug: finishGenerate resolved the price with a nil override map, so every
// dollar figure reported to Core's ledger was the built-in name-based guess no
// matter what the user had typed into model_prices.
func TestFinishGenerateUsesConfiguredPrices(t *testing.T) {
	previous := rtVal
	t.Cleanup(func() { rtVal = previous })
	// A price that no name-based heuristic would ever produce, so the assertion
	// cannot pass by coincidence.
	rtVal.PriceOverrides = map[string]providers.PriceSpec{
		"gpt-4o-mini": {InPerMillion: 0.14, OutPerMillion: 0.28, Source: "user"},
	}

	captured := captureUsage(t)

	stream := &fakeStream{}
	req := &mocrv1.GenerateRequest{ModelId: "gpt-4o-mini", Messages: []*mocrv1.Message{{Role: "user", Content: "hi"}}}
	// Provider reported usage, so no estimation fallback runs.
	info := &providers.FinishInfo{PromptTokens: 1_000_000, OutputTokens: 1_000_000}

	if err := finishGenerate(req, "gpt-4o-mini", nil, info, new(strings.Builder), "req-1", "sess-1", stream); err != nil {
		t.Fatalf("finishGenerate: %v", err)
	}

	got := captured()
	want := 0.14 + 0.28
	if math.Abs(got.costUSD-want) > 1e-9 {
		t.Fatalf("cost used the wrong price table: got %.6f, want %.6f "+
			"(heuristic guess for this id would be far higher)", got.costUSD, want)
	}
}

// TestFinishGenerateClampsNegativeUsage pins that a provider reporting negative
// token counts cannot drive a negative cost or a negative cache-hit ratio into
// the ledger.
func TestFinishGenerateClampsNegativeUsage(t *testing.T) {
	previous := rtVal
	t.Cleanup(func() { rtVal = previous })
	rtVal.PriceOverrides = map[string]providers.PriceSpec{
		"m": {InPerMillion: 1, OutPerMillion: 1},
	}

	captured := captureUsage(t)

	stream := &fakeStream{}
	req := &mocrv1.GenerateRequest{ModelId: "m", Messages: []*mocrv1.Message{{Role: "user", Content: "hi"}}}
	info := &providers.FinishInfo{PromptTokens: -5000, OutputTokens: -9000, CachedTokens: -7}

	if err := finishGenerate(req, "m", nil, info, new(strings.Builder), "req-2", "sess-2", stream); err != nil {
		t.Fatalf("finishGenerate: %v", err)
	}

	got := captured()
	if got.costUSD < 0 {
		t.Fatalf("negative cost reported: %v", got.costUSD)
	}
	if got.promptTokens < 0 || got.completionTokens < 0 {
		t.Fatalf("negative token counts reported: prompt=%d completion=%d", got.promptTokens, got.completionTokens)
	}
	if got.cachedTokens < 0 {
		t.Fatalf("negative cached tokens reported: %v", got.cachedTokens)
	}
	// A zeroed count falls back to the byte-length estimate rather than staying 0.
	if got.promptTokens != 1 || got.completionTokens != 0 {
		t.Fatalf("expected the estimate fallback, got prompt=%d completion=%d", got.promptTokens, got.completionTokens)
	}
}

// TestFinishGenerateClampsCachedAbovePrompt pins the existing upper clamp still
// holds: a cache hit larger than the prompt itself would imply a >100% hit rate.
func TestFinishGenerateClampsCachedAbovePrompt(t *testing.T) {
	previous := rtVal
	t.Cleanup(func() { rtVal = previous })
	rtVal.PriceOverrides = map[string]providers.PriceSpec{"m": {InPerMillion: 1}}

	captured := captureUsage(t)

	stream := &fakeStream{}
	req := &mocrv1.GenerateRequest{ModelId: "m"}
	info := &providers.FinishInfo{PromptTokens: 100, CachedTokens: 9999}

	if err := finishGenerate(req, "m", nil, info, new(strings.Builder), "req-3", "sess-3", stream); err != nil {
		t.Fatalf("finishGenerate: %v", err)
	}
	if got := captured().cachedTokens; got != 100 {
		t.Fatalf("cached tokens not clamped to prompt: %d", got)
	}
}

// TestResolvePriceIsDeterministic pins longest-match-wins plus a stable
// tiebreak. Iterating the override map directly made the same model resolve to
// different prices across calls, and because the price feeds model ranking that
// flapping changed which model was selected, not just what the ledger said.
func TestResolvePriceIsDeterministic(t *testing.T) {
	overrides := map[string]providers.PriceSpec{
		"gpt-4":  {InPerMillion: 2},
		"gpt-4o": {InPerMillion: 5},
	}
	want := providers.PriceSpec{InPerMillion: 5}
	for i := 0; i < 200; i++ {
		if got := providers.ResolvePrice("gpt-4o-mini", overrides); got.InPerMillion != want.InPerMillion {
			t.Fatalf("iteration %d: got %v, want %v", i, got, want)
		}
	}
}

// TestRetryAfterIsExtracted pins that Retry-After survives from the HTTP
// response into the retry loop. A 429 saying "wait 30s" retried after 400ms
// earns another 429, which is how one user trips the limit for a whole account.
func TestRetryAfterIsExtracted(t *testing.T) {
	cases := []struct {
		name string
		err  error
		want time.Duration
	}{
		{name: "nil", err: nil, want: 0},
		{name: "untyped error carries no delay", err: errors.New("connection reset by peer"), want: 0},
		// The positive case, end to end. Without a real UpstreamError in the
		// table this test asserted only that "nothing yields nothing".
		{name: "upstream 429 with Retry-After", err: &providers.UpstreamError{Status: 429, RetryAfter: 30 * time.Second}, want: 30 * time.Second},
		{name: "wrapped upstream error still surfaces", err: fmt.Errorf("generate: %w", &providers.UpstreamError{Status: 503, RetryAfter: 2 * time.Second}), want: 2 * time.Second},
		{name: "upstream error with no header", err: &providers.UpstreamError{Status: 500}, want: 0},
	}
	for _, tc := range cases {
		if got := providers.RetryAfter(tc.err); got != tc.want {
			t.Errorf("%s: RetryAfter = %v, want %v", tc.name, got, tc.want)
		}
	}
}

// TestRetryBackoffHonoursProviderAndJitters pins the two properties the fixed
// backoff got wrong: a provider-supplied Retry-After wins, and the exponential
// component varies so concurrent turns do not retry in lockstep against a
// shared rate limit.
func TestRetryBackoffHonoursProviderAndJitters(t *testing.T) {
	if got := retryBackoff(0, 30*time.Second); got != 30*time.Second {
		t.Errorf("Retry-After should win: got %v", got)
	}
	if got := retryBackoff(0, time.Minute); got != 30*time.Second {
		t.Errorf("an absurd Retry-After should be capped: got %v", got)
	}

	seen := map[time.Duration]bool{}
	for i := 0; i < 200; i++ {
		d := retryBackoff(2, 0)
		if d < 800*time.Millisecond || d > 1600*time.Millisecond {
			t.Fatalf("try 2 out of the jitter window [800ms,1600ms]: %v", d)
		}
		seen[d] = true
	}
	if len(seen) < 10 {
		t.Fatalf("backoff is effectively deterministic (%d distinct values in 200 draws)", len(seen))
	}

	// The exponential component saturates at the 5s ceiling; jitter then halves
	// it, so a deep try lands in [2.5s, 5s].
	if got := retryBackoff(20, 0); got < 2500*time.Millisecond || got > 5*time.Second {
		t.Errorf("try 20 should be capped near 5s: got %v", got)
	}
}

// TestIdleAbortIsRetryable pins that a stream killed by the idle timer is
// treated as transient. It surfaces as "use of closed network connection", which
// used to match no retryable needle, so a slow-but-healthy provider looked like
// a hard failure with a confusing transport error.
func TestIdleAbortIsRetryable(t *testing.T) {
	err := errors.New("read tcp 127.0.0.1:59391->127.0.0.1:59390: use of closed network connection")
	if !providers.IsRetryable(err) {
		t.Fatal("an idle-timed-out stream should be retryable")
	}
}

type usageRecord struct {
	costUSD          float64
	promptTokens     int32
	completionTokens int32
	cachedTokens     int32
}

// captureUsage redirects the ledger outbox at a temporary directory and returns
// a reader for the single record finishGenerate reports.
//
// CORE_HTTP_ADDR is pointed at a closed port so the background drain cannot
// succeed: reportUsage writes the file synchronously, but it also kicks off a
// drain goroutine, and a drain that succeeded would delete the file out from
// under the assertion.
func captureUsage(t *testing.T) func() usageRecord {
	t.Helper()
	dir := t.TempDir()
	t.Setenv("MOCR_DATA_DIR", dir)
	t.Setenv("CORE_HTTP_ADDR", "http://127.0.0.1:1")
	t.Cleanup(resetUsageDrain)

	outbox := filepath.Join(dir, "usage-outbox")

	return func() usageRecord {
		t.Helper()
		// The file is written before reportUsage returns, so it is already there;
		// the loop only guards against a scheduling surprise.
		var raw []byte
		for i := 0; i < 100; i++ {
			entries, err := os.ReadDir(outbox)
			if err == nil && len(entries) == 1 {
				raw, err = os.ReadFile(filepath.Join(outbox, entries[0].Name()))
				if err == nil {
					break
				}
			}
			time.Sleep(10 * time.Millisecond)
		}
		if len(raw) == 0 {
			t.Fatalf("no usage record was written to %s", outbox)
		}
		var payload struct {
			PromptTokens     int32   `json:"prompt_tokens"`
			CompletionTokens int32   `json:"completion_tokens"`
			CachedTokens     int32   `json:"cached_tokens"`
			CostUSD          float64 `json:"cost_usd"`
		}
		if err := json.Unmarshal(raw, &payload); err != nil {
			t.Fatalf("decode record %s: %v", raw, err)
		}
		return usageRecord{
			costUSD:          payload.CostUSD,
			promptTokens:     payload.PromptTokens,
			completionTokens: payload.CompletionTokens,
			cachedTokens:     payload.CachedTokens,
		}
	}
}

// resetUsageDrain clears the module-level drain flag so one test's out-of-band
// drain cannot make the next test's reportUsage skip its own drain.
func resetUsageDrain() {
	usageLock.Lock()
	usageDraining = false
	usageDirty = false
	usageLock.Unlock()
}

// fakeStream is a mocrv1.MocrService_GenerateServer that records what was sent.
// finishGenerate only sends, so the rest of the streaming interface is inert.
type fakeStream struct {
	grpc.ServerStream
	sent []*mocrv1.GenerateResponse
}

func (f *fakeStream) Send(resp *mocrv1.GenerateResponse) error {
	f.sent = append(f.sent, resp)
	return nil
}

func (f *fakeStream) Context() context.Context { return context.Background() }
