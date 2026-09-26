package gateway

import (
	"net/http/httptest"
	"strings"
	"testing"

	"0kay/core/internal/settings"
	"0kay/core/internal/update"
)

func TestSettingsUpdatesSectionDrivesGitHubProxy(t *testing.T) {
	defer update.SetGitHubProxy("")

	store := settings.NewStore("")
	store.RegisterSection(settings.Section{
		ID:     "updates",
		Fields: []settings.Field{{Key: "github_proxy", Type: "text"}},
	})
	g := &Gateway{settingsStore: store}

	body := `{"values":{"github_proxy":"https://gh-proxy.com"}}`
	req := httptest.NewRequest("POST", "/api/settings/updates", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	g.handleSettingsSection(w, req)

	if w.Code != 200 {
		t.Fatalf("status = %d, body = %s", w.Code, w.Body.String())
	}
	if got := update.GitHubProxy(); got != "https://gh-proxy.com" {
		t.Errorf("GitHubProxy() = %q, want https://gh-proxy.com", got)
	}

	// Clearing the field disables the mirror again.
	req = httptest.NewRequest("POST", "/api/settings/updates", strings.NewReader(`{"values":{"github_proxy":""}}`))
	req.Header.Set("Content-Type", "application/json")
	w = httptest.NewRecorder()
	g.handleSettingsSection(w, req)
	if got := update.GitHubProxy(); got != "" {
		t.Errorf("GitHubProxy() after clear = %q, want empty", got)
	}
}
