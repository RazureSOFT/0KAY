package update

import "testing"

func TestGitHubProxyNormalization(t *testing.T) {
	defer SetGitHubProxy("")

	for _, input := range []string{"https://gh-proxy.com", "https://gh-proxy.com/", "https://gh-proxy.com/https://github.com", "  https://gh-proxy.com  "} {
		SetGitHubProxy(input)
		if got := GitHubProxy(); got != "https://gh-proxy.com" {
			t.Errorf("SetGitHubProxy(%q) → %q, want https://gh-proxy.com", input, got)
		}
		env := gitProxyEnv()
		if len(env) != 3 {
			t.Fatalf("gitProxyEnv() len = %d, want 3", len(env))
		}
		if env[1][1] != "url.https://gh-proxy.com/https://github.com/.insteadOf" {
			t.Errorf("proxy key = %q", env[1][1])
		}
		if env[2][1] != "https://github.com/" {
			t.Errorf("proxy value = %q", env[2][1])
		}
	}

	SetGitHubProxy("")
	if GitHubProxy() != "" {
		t.Errorf("cleared proxy = %q, want empty", GitHubProxy())
	}
	if gitProxyEnv() != nil {
		t.Error("gitProxyEnv() should be nil when no proxy is set")
	}
	if apiBase() != "https://api.github.com" {
		t.Errorf("apiBase() = %q, want direct", apiBase())
	}
}

func TestAPIBaseUsesMirror(t *testing.T) {
	defer SetGitHubProxy("")
	SetGitHubProxy("https://gh-proxy.com")
	if got := apiBase(); got != "https://gh-proxy.com/https://api.github.com" {
		t.Errorf("apiBase() = %q", got)
	}
}
