package gateway

import (
	"path/filepath"
	"testing"

	"0kay/core/internal/providers"
)

func TestCatalogURLAddsVersionOnce(t *testing.T) {
	for _, tc := range []struct{ base, want string }{
		{"https://api.nuwaflux.com", "https://api.nuwaflux.com/v1/models"},
		{"https://api.nuwaflux.com/", "https://api.nuwaflux.com/v1/models"},
		{"https://api.anthropic.com", "https://api.anthropic.com/v1/models"},
		{"https://api.anthropic.com/v1", "https://api.anthropic.com/v1/models"},
		{"https://api.deepseek.com/v1", "https://api.deepseek.com/v1/models"},
		{"http://192.168.1.100:11220/v1", "http://192.168.1.100:11220/v1/models"},
		{"https://host/v1beta", "https://host/v1beta/models"},
	} {
		if got := catalogURL(tc.base); got != tc.want {
			t.Errorf("catalogURL(%q) = %q, want %q", tc.base, got, tc.want)
		}
	}
}

func TestSameEndpoint(t *testing.T) {
	same := [][2]string{
		{"https://api.openai.com/v1", "https://api.openai.com/v1/"},
		{"https://api.openai.com/v1", "https://API.OpenAI.com/v1"},
		{"https://api.openai.com/v1", "https://api.openai.com/v1?x=1"},
		{"http://localhost:11434/v1", "http://localhost:11434/v1"},
	}
	for _, pair := range same {
		if !sameEndpoint(pair[0], pair[1]) {
			t.Errorf("sameEndpoint(%q, %q) = false, want true", pair[0], pair[1])
		}
	}
	// Every one of these would route a stored secret somewhere it was not
	// registered for, so none of them may compare equal.
	differ := [][2]string{
		{"https://api.openai.com/v1", "https://evil.example/v1"},
		{"https://api.openai.com/v1", "https://api.openai.com.attacker.net/v1"},
		{"https://api.openai.com/v1", "http://api.openai.com/v1"},
		{"https://api.openai.com/v1", "https://api.openai.com/v2"},
		{"https://api.openai.com/v1", "https://api.openai.com/v1/other"},
		{"https://api.openai.com/v1", ""},
		{"", ""},
	}
	for _, pair := range differ {
		if sameEndpoint(pair[0], pair[1]) {
			t.Errorf("sameEndpoint(%q, %q) = true, want false", pair[0], pair[1])
		}
	}
}

// A stored provider secret must only ever be sent to the endpoint it was
// registered for. The request carries both the credential id and the destination
// URL, so resolving by id alone let any caller that can reach the route aim a
// real key at a host of their choosing.
func TestResolveModelAPIKeyBindsSecretToEndpoint(t *testing.T) {
	store := providers.NewStore(filepath.Join(t.TempDir(), "providers.json"))
	if err := store.Upsert(providers.ProviderConfig{
		ID:       "real",
		Provider: "openai",
		BaseURL:  "https://api.openai.com/v1",
		APIKey:   "sk-real-secret",
		Enabled:  true,
	}); err != nil {
		t.Fatal(err)
	}
	g := &Gateway{providerStore: store}

	// The legitimate case: the endpoint the key belongs to.
	if got := g.resolveModelAPIKey(ModelsRequest{ID: "real", BaseURL: "https://api.openai.com/v1"}); got != "sk-real-secret" {
		t.Fatalf("legitimate fetch = %q, want the stored secret", got)
	}
	// The attack: a real id paired with someone else's endpoint.
	for _, base := range []string{
		"https://evil.example/v1",
		"https://api.openai.com.attacker.net/v1",
		"http://api.openai.com/v1",
	} {
		if got := g.resolveModelAPIKey(ModelsRequest{ID: "real", BaseURL: base}); got != "" {
			t.Fatalf("fetch against %s = %q, want no secret", base, got)
		}
	}
	// An explicit plaintext key from the caller is still honoured: that is how a
	// brand-new provider is added, and the caller already holds it.
	if got := g.resolveModelAPIKey(ModelsRequest{BaseURL: "https://new.example/v1", APIKey: "sk-fresh"}); got != "sk-fresh" {
		t.Fatalf("explicit key = %q, want sk-fresh", got)
	}
	// A masked key is never forwarded upstream: leaking the mask would just turn
	// a working endpoint into a confusing 401 from the provider. The store's
	// real secret is resolved instead.
	masked := providers.MaskKey("sk-real-secret")
	if got := g.resolveModelAPIKey(ModelsRequest{ID: "real", BaseURL: "https://api.openai.com/v1", APIKey: masked}); got != "sk-real-secret" {
		t.Fatalf("masked key = %q, want the resolved secret", got)
	}
}
