package gateway

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"0kay/core/internal/registry"
	pluginv1 "0kay/gen/plugin/v1"
)

func TestPluginProxyInjectsServiceToken(t *testing.T) {
	var gotAuth, gotPath string
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		gotAuth = r.Header.Get("Authorization")
		gotPath = r.URL.Path
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"ok":true}`))
	}))
	defer backend.Close()

	reg := registry.NewRegistry()
	reg.SetSecret([]byte("test-secret"))
	id, err := reg.Register(&pluginv1.PluginInfo{Name: "minecraft", Version: "0.1.0"}, []string{"minecraft"}, backend.URL)
	if err != nil {
		t.Fatalf("register: %v", err)
	}

	g := &Gateway{registry: reg}
	rec := httptest.NewRecorder()
	g.handlePluginProxy(rec, httptest.NewRequest(http.MethodGet, "/api/plugins/minecraft/proxy/status", nil))

	if rec.Code != http.StatusOK {
		t.Fatalf("status=%d body=%q", rec.Code, rec.Body.String())
	}
	if want := "Bearer " + reg.Token(id); gotAuth != want {
		t.Fatalf("upstream auth=%q want %q", gotAuth, want)
	}
	if gotPath != "/status" {
		t.Fatalf("upstream path=%q", gotPath)
	}
	if rec.Body.String() != `{"ok":true}` {
		t.Fatalf("body=%q", rec.Body.String())
	}
}

func TestPluginProxyRejectsUnknownAndNonHTTP(t *testing.T) {
	reg := registry.NewRegistry()
	reg.SetSecret([]byte("s"))
	if _, err := reg.Register(&pluginv1.PluginInfo{Name: "life", Version: "0.1.0"}, []string{"life"}, "127.0.0.1:50053"); err != nil {
		t.Fatal(err)
	}
	g := &Gateway{registry: reg}

	unknown := httptest.NewRecorder()
	g.handlePluginProxy(unknown, httptest.NewRequest(http.MethodGet, "/api/plugins/ghost/proxy/status", nil))
	if unknown.Code != http.StatusNotFound {
		t.Fatalf("unknown plugin status=%d", unknown.Code)
	}

	nonHTTP := httptest.NewRecorder()
	g.handlePluginProxy(nonHTTP, httptest.NewRequest(http.MethodGet, "/api/plugins/life/proxy/status", nil))
	if nonHTTP.Code != http.StatusBadGateway {
		t.Fatalf("non-http address status=%d", nonHTTP.Code)
	}
}
