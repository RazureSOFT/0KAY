package update

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestReleaseOrdering(t *testing.T) {
	for _, tc := range []struct {
		candidate, current string
		newer              bool
	}{
		{"v0.1.0", "0.1.0", false},
		{"0.2.0", "0.1.9", true},
		{"0.1.0-rc.1", "0.1.0", false},
		{"0.1.0", "0.1.0-rc.1", true},
		{"0.1.0+build.2", "0.1.0", false},
		{"0.1.0-rc.10", "0.1.0-rc.2", true},
	} {
		if got := Newer(tc.candidate, tc.current); got != tc.newer {
			t.Errorf("Newer(%q, %q) = %v", tc.candidate, tc.current, got)
		}
	}
}

func TestLatestFallsBackToTags(t *testing.T) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		switch {
		case strings.HasSuffix(r.URL.Path, "/releases/latest"):
			w.WriteHeader(http.StatusNotFound)
		case strings.HasSuffix(r.URL.Path, "/tags"):
			_, _ = w.Write([]byte(`[{"name":"v0.0.6"},{"name":"v0.0.8"},{"name":"v0.0.4"}]`))
		default:
			http.NotFound(w, r)
		}
	}))
	defer server.Close()
	previous := githubProxy
	githubProxy = server.URL
	defer func() { githubProxy = previous }()

	release, err := Latest("razureink", "0KAY-free-model")
	if err != nil {
		t.Fatal(err)
	}
	if release == nil || release.TagName != "v0.0.8" {
		t.Fatalf("Latest tag fallback = %+v, want tag v0.0.8", release)
	}
}
