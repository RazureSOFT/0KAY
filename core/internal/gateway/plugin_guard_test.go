package gateway

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"0kay/core/internal/pairing"
	"0kay/core/internal/registry"
	pluginv1 "0kay/gen/plugin/v1"
)

func guardTestGateway(t *testing.T) *Gateway {
	t.Helper()
	reg := registry.NewRegistry()
	reg.SetSecret([]byte("guard-test-secret-0123456789abcdef"))
	if _, err := reg.Register(&pluginv1.PluginInfo{
		Name:    "thirdparty",
		Version: "1",
		Permissions: &pluginv1.PluginPermission{
			ApiRequires: []string{"GET /api/models", "POST /api/net/egress"},
			Egress:      []string{"example.com"},
		},
	}, []string{"tool"}, "127.0.0.1:1"); err != nil {
		t.Fatalf("register thirdparty: %v", err)
	}
	if _, err := reg.Register(&pluginv1.PluginInfo{
		Name:    "life",
		Version: "1",
	}, []string{"life"}, "127.0.0.1:2"); err != nil {
		t.Fatalf("register life: %v", err)
	}
	reg.SetTrusted([]string{"life"})
	return &Gateway{registry: reg}
}

func doGuarded(g *Gateway, r *http.Request) *httptest.ResponseRecorder {
	rec := httptest.NewRecorder()
	g.pluginGuard(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	})).ServeHTTP(rec, r)
	return rec
}

func TestPluginGuardAllowsDeclaredAPI(t *testing.T) {
	g := guardTestGateway(t)
	token := g.registry.Token(mustID(t, g, "thirdparty"))
	req := httptest.NewRequest(http.MethodGet, "/api/models", nil)
	req.Header.Set(PluginHeader, "thirdparty")
	req.Header.Set("Authorization", "Bearer "+token)
	if rec := doGuarded(g, req); rec.Code != http.StatusOK {
		t.Fatalf("declared API: got %d, want 200", rec.Code)
	}
}

func TestPluginGuardRejectsUndeclaredAPI(t *testing.T) {
	g := guardTestGateway(t)
	token := g.registry.Token(mustID(t, g, "thirdparty"))
	req := httptest.NewRequest(http.MethodPost, "/api/settings/agent", nil)
	req.Header.Set(PluginHeader, "thirdparty")
	req.Header.Set("Authorization", "Bearer "+token)
	if rec := doGuarded(g, req); rec.Code != http.StatusForbidden {
		t.Fatalf("undeclared API: got %d, want 403", rec.Code)
	}
}

func TestPluginGuardRejectsBadToken(t *testing.T) {
	g := guardTestGateway(t)
	req := httptest.NewRequest(http.MethodGet, "/api/models", nil)
	req.Header.Set(PluginHeader, "thirdparty")
	req.Header.Set("Authorization", "Bearer nope")
	if rec := doGuarded(g, req); rec.Code != http.StatusUnauthorized {
		t.Fatalf("bad token: got %d, want 401", rec.Code)
	}
}

func TestPluginGuardTrustedPluginBypasses(t *testing.T) {
	g := guardTestGateway(t)
	token := g.registry.Token(mustID(t, g, "life"))
	req := httptest.NewRequest(http.MethodGet, "/api/anything", nil)
	req.Header.Set(PluginHeader, "life")
	req.Header.Set("Authorization", "Bearer "+token)
	if rec := doGuarded(g, req); rec.Code != http.StatusOK {
		t.Fatalf("trusted plugin: got %d, want 200", rec.Code)
	}
}

func TestPluginGuardRequiresIdentityForDeclaredAPI(t *testing.T) {
	g := guardTestGateway(t)
	req := httptest.NewRequest(http.MethodGet, "/api/models", nil) // machine caller, no browser markers
	if rec := doGuarded(g, req); rec.Code != http.StatusForbidden {
		t.Fatalf("unattributed machine call: got %d, want 403", rec.Code)
	}
}

func TestPluginGuardAllowsBrowser(t *testing.T) {
	g := guardTestGateway(t)
	// Fetch metadata: what a browser actually sends, and something no HTTP
	// client library emits.
	req := httptest.NewRequest(http.MethodGet, "/api/models", nil)
	req.Header.Set("Sec-Fetch-Site", "same-origin")
	if rec := doGuarded(g, req); rec.Code != http.StatusOK {
		t.Fatalf("browser call: got %d, want 200", rec.Code)
	}
	// The owner's session cookie is the other proof of a browser.
	withCookie := httptest.NewRequest(http.MethodGet, "/api/models", nil)
	withCookie.AddCookie(&http.Cookie{Name: pairing.SessionCookie, Value: "v"})
	if rec := doGuarded(g, withCookie); rec.Code != http.StatusOK {
		t.Fatalf("session-cookie call: got %d, want 200", rec.Code)
	}
}

// Regression: attribution used to be skippable by setting any one of
// Sec-Fetch-Site / Origin / Referer, so an unattributed machine caller could
// reach APIs a plugin never declared — including the egress proxy — by adding a
// single forged header. Every one of them must now be treated as a machine
// client that owes Core an identity.
func TestPluginGuardRejectsForgedBrowserHeaders(t *testing.T) {
	for _, header := range []string{"Sec-Fetch-Site", "Origin", "Referer"} {
		t.Run(header, func(t *testing.T) {
			g := guardTestGateway(t)
			req := httptest.NewRequest(http.MethodGet, "/api/models", nil)
			// A URL is not a valid Sec-Fetch-Site value; the enum is
			// same-origin / same-site / cross-site / none.
			req.Header.Set(header, "http://127.0.0.1:3000/")
			if rec := doGuarded(g, req); rec.Code != http.StatusForbidden {
				t.Fatalf("forged %s: got %d, want 403", header, rec.Code)
			}
		})
	}
}

func mustID(t *testing.T, g *Gateway, name string) string {
	t.Helper()
	info, ok := g.registry.FindByName(name)
	if !ok {
		t.Fatalf("plugin %s not registered", name)
	}
	return info.PluginID
}
