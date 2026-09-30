package registry

import (
	"testing"

	pluginv1 "0kay/gen/plugin/v1"
)

func TestPluginTokenAndAuthenticate(t *testing.T) {
	r := NewRegistry()
	r.SetSecret([]byte("test-secret-key-0123456789abcdef"))

	id, err := r.Register(&pluginv1.PluginInfo{
		Name:    "demo",
		Version: "1.0.0",
		Permissions: &pluginv1.PluginPermission{
			ApiRequires: []string{"GET /api/models"},
			Egress:      []string{"example.com"},
		},
	}, []string{"tool"}, "127.0.0.1:1234")
	if err != nil {
		t.Fatalf("register: %v", err)
	}

	token := r.Token(id)
	if token == "" {
		t.Fatal("expected a service token")
	}
	if again := r.Token(id); again != token {
		t.Fatal("token must be stable")
	}

	if _, ok := r.Authenticate("demo", token); !ok {
		t.Fatal("expected authenticate with correct token")
	}
	if _, ok := r.Authenticate("demo", "wrong"); ok {
		t.Fatal("expected authenticate to reject a wrong token")
	}
	if _, ok := r.Authenticate("missing", token); ok {
		t.Fatal("expected authenticate to reject an unknown plugin")
	}

	info, ok := r.FindByName("demo")
	if !ok || info.Info.Permissions == nil {
		t.Fatal("expected stored permissions")
	}
	if got := info.Info.Permissions.Egress; len(got) != 1 || got[0] != "example.com" {
		t.Fatalf("unexpected egress %v", got)
	}
}

func TestIsTrusted(t *testing.T) {
	r := NewRegistry()
	r.SetTrusted([]string{"agent", "life"})
	if !r.IsTrusted("agent") {
		t.Fatal("agent should be trusted")
	}
	if r.IsTrusted("third-party") {
		t.Fatal("third-party should not be trusted")
	}

	if _, err := r.RegisterBuiltin(&pluginv1.PluginInfo{Name: "webui", Version: "1"}, []string{"webui"}, ""); err != nil {
		t.Fatalf("register builtin: %v", err)
	}
	if !r.IsTrusted("webui") {
		t.Fatal("builtin should be trusted")
	}
}
