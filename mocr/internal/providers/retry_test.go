package providers

import (
	"errors"
	"testing"
)

func TestIsRetryable(t *testing.T) {
	cases := map[string]bool{
		"provider error 429: rate limited":    true,
		"provider error 500: internal":        true,
		"provider error 503: unavailable":     true,
		"provider error 400: bad parameter":   false,
		"provider error 401: unauthorized":    false,
		"Post \"https://x\": i/o timeout":     true,
		"read tcp: connection reset by peer":  true,
		"some deterministic validation error": false,
	}
	for message, want := range cases {
		if got := IsRetryable(errors.New(message)); got != want {
			t.Errorf("IsRetryable(%q) = %v, want %v", message, got, want)
		}
	}
	if IsRetryable(nil) {
		t.Error("nil error must not be retryable")
	}
}
