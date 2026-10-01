package gateway

import (
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strings"
	"testing"

	"0kay/core/internal/providers"
	"0kay/core/internal/registry"
	pluginv1 "0kay/gen/plugin/v1"
)

// A browser session (even same-origin, e.g. a plugin's WebUI bundle) must not
// be able to read plaintext provider credentials; only machine credentials may.
func TestProviderCredentialsRequiresMachineCredential(t *testing.T) {
	reg := registry.NewRegistry()
	reg.SetSecret([]byte("credentials-test-secret-0123456789"))
	if _, err := reg.Register(&pluginv1.PluginInfo{Name: "tool", Version: "1"}, []string{"tool"}, "127.0.0.1:1"); err != nil {
		t.Fatalf("register: %v", err)
	}
	info, _ := reg.FindByName("tool")

	store := providers.NewStore(filepath.Join(t.TempDir(), "providers.json"))
	if err := store.Upsert(providers.ProviderConfig{
		ID: "p1", Provider: "openai", BaseURL: "https://api.example.com",
		APIKey: "sk-secret-value", Models: []string{"m"},
	}); err != nil {
		t.Fatalf("upsert: %v", err)
	}
	g := &Gateway{registry: reg, providerStore: store}

	browser := httptest.NewRequest(http.MethodGet, "/api/providers/credentials", nil)
	browser.Header.Set("Sec-Fetch-Site", "same-origin")
	browser.Header.Set("Origin", "http://localhost:3000")
	rec := httptest.NewRecorder()
	g.handleProviderCredentials(rec, browser)
	if rec.Code != http.StatusForbidden {
		t.Fatalf("browser credential read = %d, want 403", rec.Code)
	}

	machine := httptest.NewRequest(http.MethodGet, "/api/providers/credentials", nil)
	machine.Header.Set(PluginHeader, "tool")
	machine.Header.Set("Authorization", "Bearer "+reg.Token(info.PluginID))
	rec2 := httptest.NewRecorder()
	g.handleProviderCredentials(rec2, machine)
	if rec2.Code != http.StatusOK {
		t.Fatalf("machine credential read = %d (%s), want 200", rec2.Code, rec2.Body.String())
	}
	if !strings.Contains(rec2.Body.String(), "sk-secret-value") {
		t.Fatalf("expected plaintext key for machine client, got %s", rec2.Body.String())
	}
}
