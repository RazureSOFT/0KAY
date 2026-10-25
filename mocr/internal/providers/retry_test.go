package providers

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
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

func TestIsRetryableUpstreamError(t *testing.T) {
	for code, want := range map[int]bool{
		408: true, 409: true, 425: true, 429: true,
		500: true, 502: true, 503: true, 504: true,
		400: false, 401: false, 403: false, 404: false, 422: false,
	} {
		err := &UpstreamError{Status: code, Body: "upstream said no"}
		if got := IsRetryable(err); got != want {
			t.Errorf("IsRetryable(UpstreamError{Status: %d}) = %v, want %v", code, got, want)
		}
	}
	// Wrapped UpstreamError still classifies structurally.
	wrapped := fmt.Errorf("generate: %w", &UpstreamError{Status: 429, Body: "slow down"})
	if !IsRetryable(wrapped) {
		t.Error("wrapped UpstreamError(429) should be retryable")
	}
	// Text still carries the status for logs and gRPC surfaces.
	if msg := (&UpstreamError{Status: 429, Body: "x"}).Error(); msg != "provider error 429: x" {
		t.Errorf("UpstreamError.Error() = %q", msg)
	}
}

// TestCompatibilityPathHTTPErrorIsRetryable pins that errors surfaced by the
// compatibility retry loop (formerly "upstream HTTP %d", invisible to the
// retry regex) are typed and classified as retryable for 429/5xx.
func TestCompatibilityPathHTTPErrorIsRetryable(t *testing.T) {
	for _, code := range []int{429, 500, 503} {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(code)
			_, _ = w.Write([]byte(`{"error":{"message":"overloaded"}}`))
		}))
		_, err := Generate(context.Background(), GenerateOptions{
			BaseURL: server.URL, APIKey: "mock", ModelID: "m", Stream: true,
		}, func(string) bool { return true })
		server.Close()
		if err == nil {
			t.Fatalf("code %d: expected error", code)
		}
		var up *UpstreamError
		if !errors.As(err, &up) || up.Status != code {
			t.Fatalf("code %d: error is not UpstreamError: %v", code, err)
		}
		if !IsRetryable(err) {
			t.Fatalf("code %d: error not retryable: %v", code, err)
		}
	}
	// 4xx validation failures stay non-retryable on the same path.
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(401)
		_, _ = w.Write([]byte(`{"error":{"message":"bad key"}}`))
	}))
	_, err := Generate(context.Background(), GenerateOptions{
		BaseURL: server.URL, APIKey: "mock", ModelID: "m", Stream: true,
	}, func(string) bool { return true })
	server.Close()
	if err == nil || IsRetryable(err) {
		t.Fatalf("401 should be non-retryable, got %v", err)
	}
}

// TestAnthropicPathHTTPErrorIsRetryable pins the same for the Anthropic
// request path.
func TestAnthropicPathHTTPErrorIsRetryable(t *testing.T) {
	for _, code := range []int{429, 500} {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(code)
			_, _ = w.Write([]byte(`{"type":"error","error":{"message":"overloaded"}}`))
		}))
		_, err := Generate(context.Background(), GenerateOptions{
			Provider: "anthropic", BaseURL: server.URL, APIKey: "mock", ModelID: "claude-3", Stream: true,
			Messages: []ChatMessage{{Role: "user", Content: "hi"}},
		}, func(string) bool { return true })
		server.Close()
		if err == nil {
			t.Fatalf("code %d: expected error", code)
		}
		var up *UpstreamError
		if !errors.As(err, &up) || up.Status != code {
			t.Fatalf("code %d: error is not UpstreamError: %v", code, err)
		}
		if !IsRetryable(err) {
			t.Fatalf("code %d: error not retryable: %v", code, err)
		}
	}
}
