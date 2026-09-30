package egress

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestAllowed(t *testing.T) {
	cases := []struct {
		name     string
		patterns []string
		url      string
		want     bool
	}{
		{"exact", []string{"api.example.com"}, "https://api.example.com/v1/x", true},
		{"exact mismatch", []string{"api.example.com"}, "https://evil.example.com/x", false},
		{"wildcard subdomain", []string{"*.example.com"}, "https://a.example.com/x", true},
		{"wildcard apex", []string{"*.example.com"}, "https://example.com/x", true},
		{"wildcard no partial", []string{"*.example.com"}, "https://notexample.com/x", false},
		{"host with port", []string{"127.0.0.1:8888"}, "http://127.0.0.1:8888/search", true},
		{"host with wrong port", []string{"127.0.0.1:8888"}, "http://127.0.0.1:9999/search", false},
		{"host ignores port", []string{"example.com"}, "https://example.com:8443/x", true},
		{"scheme in pattern", []string{"https://example.com"}, "https://example.com/x", true},
		{"empty denies", nil, "https://example.com/x", false},
		{"star allows all", []string{"*"}, "https://anything.test/x", true},
		{"path stripped", []string{"example.com/api"}, "https://example.com/api/x", true},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := Allowed(tc.patterns, tc.url); got != tc.want {
				t.Fatalf("Allowed(%v, %q) = %v, want %v", tc.patterns, tc.url, got, tc.want)
			}
		})
	}
}

func TestDoAllowAndDeny(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("X-Test", "ok")
		_, _ = w.Write([]byte("hello " + r.URL.Path))
	}))
	defer upstream.Close()
	host := strings.TrimPrefix(upstream.URL, "http://")

	resp, err := Do(context.Background(), Request{Method: "GET", URL: upstream.URL + "/x"}, []string{host})
	if err != nil {
		t.Fatalf("allowed Do: %v", err)
	}
	if resp.Status != 200 || string(resp.Body) != "hello /x" {
		t.Fatalf("unexpected response: %+v", resp)
	}

	if _, err := Do(context.Background(), Request{Method: "GET", URL: upstream.URL}, []string{"other.example"}); err == nil {
		t.Fatal("expected egress denial")
	}
}

func TestDoRedirectRechecked(t *testing.T) {
	target := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("should not reach"))
	}))
	defer target.Close()
	redirector := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Redirect(w, r, target.URL, http.StatusFound)
	}))
	defer redirector.Close()
	host := strings.TrimPrefix(redirector.URL, "http://")

	if _, err := Do(context.Background(), Request{Method: "GET", URL: redirector.URL}, []string{host}); err == nil {
		t.Fatal("expected redirect target to be denied")
	}
}

func TestDoRejectsScheme(t *testing.T) {
	if _, err := Do(context.Background(), Request{URL: "file:///etc/passwd"}, []string{"*"}); err == nil {
		t.Fatal("expected unsupported scheme error")
	}
}
