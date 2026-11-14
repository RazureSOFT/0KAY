package gateway

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestGitHubOAuthStartWithoutConfigSaysSo(t *testing.T) {
	t.Setenv("GITHUB_OAUTH_CLIENT_ID", "")
	t.Setenv("GITHUB_OAUTH_CLIENT_SECRET", "")
	g := &Gateway{}
	rec := httptest.NewRecorder()
	g.handleGitHubOAuthStart(rec, httptest.NewRequest(http.MethodGet, "/api/oauth/github/start", nil))
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 without credentials, got %d", rec.Code)
	}
	if !strings.Contains(rec.Body.String(), "oauth_not_configured") {
		t.Fatalf("expected a reason, got %s", rec.Body.String())
	}
}

func TestGitHubOAuthStartRedirectsWithState(t *testing.T) {
	t.Setenv("GITHUB_OAUTH_CLIENT_ID", "cid-123")
	t.Setenv("GITHUB_OAUTH_CLIENT_SECRET", "secret-123")
	g := &Gateway{}
	rec := httptest.NewRecorder()
	g.handleGitHubOAuthStart(rec, httptest.NewRequest(http.MethodGet, "/api/oauth/github/start", nil))
	if rec.Code != http.StatusFound {
		t.Fatalf("expected 302, got %d: %s", rec.Code, rec.Body.String())
	}
	location := rec.Header().Get("Location")
	if !strings.HasPrefix(location, githubAuthorizeURL) {
		t.Fatalf("unexpected location %s", location)
	}
	for _, want := range []string{"client_id=cid-123", "state=", "scope=repo"} {
		if !strings.Contains(location, want) {
			t.Fatalf("location %s is missing %s", location, want)
		}
	}
	oauthStatesMu.Lock()
	count := len(oauthStates)
	oauthStatesMu.Unlock()
	if count == 0 {
		t.Fatal("start must remember the state it issued")
	}
}

func TestGitHubOAuthCallbackRejectsAnUnknownState(t *testing.T) {
	t.Setenv("GITHUB_OAUTH_CLIENT_ID", "cid-123")
	t.Setenv("GITHUB_OAUTH_CLIENT_SECRET", "secret-123")
	g := &Gateway{}
	rec := httptest.NewRecorder()
	g.handleGitHubOAuthCallback(rec, httptest.NewRequest(http.MethodGet, "/api/oauth/github/callback?code=x&state=nope", nil))
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("an unknown state must be refused, got %d", rec.Code)
	}
}
