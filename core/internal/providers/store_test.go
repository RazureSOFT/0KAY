package providers

import (
	"os"
	"path/filepath"
	"testing"
)

func writeStoreFile(t *testing.T, content string) string {
	t.Helper()
	path := filepath.Join(t.TempDir(), "providers.json")
	if err := os.WriteFile(path, []byte(content), 0o600); err != nil {
		t.Fatal(err)
	}
	return path
}

func TestLoadDedupesSameEndpointAndKeepsDefault(t *testing.T) {
	path := writeStoreFile(t, `{
	  "default_provider_id": "custom",
	  "default_model": "m1",
	  "providers": [
	    {"id":"custom_a","provider":"custom","base_url":"http://h:1/v1/","api_key":"k","models":["m1"],"enabled":true},
	    {"id":"custom","provider":"custom","base_url":"http://h:1/v1","api_key":"k","models":["m2"],"enabled":true},
	    {"id":"other","provider":"openai","base_url":"https://api.openai.com/v1","api_key":"x","models":["gpt"],"enabled":true}
	  ]
	}`)
	s := NewStore(path)
	snap := s.Snapshot()
	if len(snap.Providers) != 2 {
		t.Fatalf("want 2 providers after dedupe, got %d: %+v", len(snap.Providers), snap.Providers)
	}
	if snap.DefaultProviderID != "custom" {
		t.Fatalf("default id should stay custom, got %q", snap.DefaultProviderID)
	}
	var custom *ProviderConfig
	for i := range snap.Providers {
		if snap.Providers[i].ID == "custom" {
			custom = &snap.Providers[i]
		}
	}
	if custom == nil {
		t.Fatalf("default provider row missing: %+v", snap.Providers)
	}
	if len(custom.Models) != 2 {
		t.Fatalf("models should be unioned, got %v", custom.Models)
	}
	persisted := NewStore(path).Snapshot()
	if len(persisted.Providers) != 2 {
		t.Fatalf("merged file not persisted, got %d providers", len(persisted.Providers))
	}
}

func TestUpsertReusesExistingEndpointRow(t *testing.T) {
	s := NewStore("")
	if err := s.Replace(File{Providers: []ProviderConfig{
		{ID: "custom_a", Provider: "custom", BaseURL: "http://h/v1", APIKey: "old", Models: []string{"m1"}},
	}}); err != nil {
		t.Fatal(err)
	}
	if err := s.Upsert(ProviderConfig{ID: "custom", Provider: "custom", BaseURL: "http://h/v1/", APIKey: "new", Models: []string{"m2"}}); err != nil {
		t.Fatal(err)
	}
	snap := s.Snapshot()
	raw := s.SnapshotRaw()
	if len(raw.Providers) != 1 {
		t.Fatalf("want 1 provider, got %d: %+v", len(raw.Providers), raw.Providers)
	}
	got := raw.Providers[0]
	if got.ID != "custom_a" {
		t.Fatalf("should reuse existing id, got %q", got.ID)
	}
	if got.APIKey != "new" {
		t.Fatalf("new credentials should win, got %q", got.APIKey)
	}
	if got.APIKeyMasked != "" {
		t.Fatalf("mask must not be persisted, got %q", got.APIKeyMasked)
	}
	if snap.Providers[0].APIKey != "" {
		t.Fatalf("Snapshot leaked api key %q", snap.Providers[0].APIKey)
	}
	if len(got.Models) != 2 {
		t.Fatalf("models should be unioned, got %v", got.Models)
	}
}

func TestUpsertDifferentEndpointAppends(t *testing.T) {
	s := NewStore("")
	if err := s.Upsert(ProviderConfig{ID: "a", Provider: "custom", BaseURL: "http://h1/v1", Models: []string{"m1"}}); err != nil {
		t.Fatal(err)
	}
	if err := s.Upsert(ProviderConfig{ID: "b", Provider: "custom", BaseURL: "http://h2/v1", Models: []string{"m2"}}); err != nil {
		t.Fatal(err)
	}
	snap := s.Snapshot()
	if len(snap.Providers) != 2 {
		t.Fatalf("want 2 providers, got %d", len(snap.Providers))
	}
}

func TestUpsertSameIdReplacesWholesale(t *testing.T) {
	s := NewStore("")
	if err := s.Upsert(ProviderConfig{ID: "a", Provider: "custom", BaseURL: "http://h/v1", Models: []string{"m1", "m2"}}); err != nil {
		t.Fatal(err)
	}
	if err := s.Upsert(ProviderConfig{ID: "a", Provider: "custom", BaseURL: "http://h/v1", Models: []string{"m2"}}); err != nil {
		t.Fatal(err)
	}
	snap := s.Snapshot()
	if len(snap.Providers) != 1 || len(snap.Providers[0].Models) != 1 {
		t.Fatalf("same-id upsert should replace, got %+v", snap.Providers)
	}
}

func TestLoadMigratesLegacyProvidersToLLMKindWithEntries(t *testing.T) {
	path := writeStoreFile(t, `{
	  "default_provider_id": "custom",
	  "default_model": "m1",
	  "providers": [
	    {"id":"custom","provider":"custom","base_url":"http://h:1/v1","api_key":"k","models":["m1","m2"],"enabled":true,
	     "model_types":{"m2":"embedding"}}
	  ]
	}`)
	s := NewStore(path)
	p := s.Snapshot().Providers[0]
	if p.Kind != KindLLM {
		t.Fatalf("legacy provider kind = %q, want %q", p.Kind, KindLLM)
	}
	if len(p.Entries) != 2 {
		t.Fatalf("entries = %d, want 2", len(p.Entries))
	}
	if got := p.Entries[1].Kind; got != KindEmbedding {
		t.Fatalf("m2 kind = %q, want %q", got, KindEmbedding)
	}
	// Migration is persisted once, so a second load sees the same shape.
	reloaded := NewStore(path).Snapshot().Providers[0]
	if len(reloaded.Entries) != 2 || reloaded.Kind != KindLLM {
		t.Fatalf("migration was not persisted: %+v", reloaded)
	}
}

func TestByKindFiltersAndDefaultForKindSkipsDisabled(t *testing.T) {
	path := writeStoreFile(t, `{"providers":[]}`)
	s := NewStore(path)
	must := func(err error) {
		t.Helper()
		if err != nil {
			t.Fatal(err)
		}
	}
	must(s.Upsert(ProviderConfig{ID: "llm", Provider: "custom", Kind: KindLLM, BaseURL: "http://h/llm", Models: []string{"m1"}, Enabled: true}))
	must(s.Upsert(ProviderConfig{ID: "tts-off", Provider: "custom", Kind: KindTTS, BaseURL: "http://h/tts-off", Enabled: false}))
	must(s.Upsert(ProviderConfig{ID: "tts", Provider: "custom", Kind: KindTTS, BaseURL: "http://h/tts", APIKey: "secret", Enabled: true}))

	if got := len(s.ByKind(KindTTS)); got != 2 {
		t.Fatalf("ByKind(tts) = %d, want 2 (disabled included)", got)
	}
	if got := len(s.ByKind("speech")); got != 2 {
		t.Fatalf("ByKind alias speech = %d, want 2", got)
	}
	p, ok := s.DefaultForKind(KindTTS)
	if !ok || p.ID != "tts" {
		t.Fatalf("DefaultForKind(tts) = %+v/%v, want enabled provider", p, ok)
	}
	if p.APIKey != "secret" {
		t.Fatalf("DefaultForKind must keep the secret for internal callers")
	}
	if _, ok := s.DefaultForKind(KindASR); ok {
		t.Fatalf("DefaultForKind(asr) should report missing")
	}
}

func TestUpsertReconcilesEntriesAndKeepsContextWindow(t *testing.T) {
	path := writeStoreFile(t, `{"providers":[]}`)
	s := NewStore(path)
	if err := s.Upsert(ProviderConfig{
		ID: "p", Provider: "custom", BaseURL: "http://h/v1", Enabled: true,
		Models:  []string{"m1"},
		Entries: []ModelEntry{{ID: "m1", ContextWindow: 131072, MaxOutput: 8192}},
	}); err != nil {
		t.Fatal(err)
	}
	// A later save that only knows the model id must not wipe the metadata.
	if err := s.Upsert(ProviderConfig{
		ID: "p", Provider: "custom", BaseURL: "http://h/v1", Enabled: true,
		Models: []string{"m1", "m2"},
	}); err != nil {
		t.Fatal(err)
	}
	p := s.Snapshot().Providers[0]
	if len(p.Entries) != 2 {
		t.Fatalf("entries = %d, want 2", len(p.Entries))
	}
	if p.Entries[0].ContextWindow != 131072 {
		t.Fatalf("context window lost on re-upsert: %+v", p.Entries[0])
	}
	if p.Entries[1].Kind != KindLLM {
		t.Fatalf("new entry kind = %q, want llm", p.Entries[1].Kind)
	}
	if got := s.ContextWindow("m1"); got != 131072 {
		t.Fatalf("ContextWindow(m1) = %d, want 131072", got)
	}
	if got := s.ContextWindow("nope"); got != 0 {
		t.Fatalf("ContextWindow(unknown) = %d, want 0", got)
	}
}

func TestCatalogCarriesKindAndContextWindow(t *testing.T) {
	path := writeStoreFile(t, `{"providers":[]}`)
	s := NewStore(path)
	if err := s.Upsert(ProviderConfig{
		ID: "p", Provider: "custom", Kind: KindLLM, BaseURL: "http://h/v1", Enabled: true,
		Models:  []string{"m1"},
		Entries: []ModelEntry{{ID: "m1", ContextWindow: 65536}},
	}); err != nil {
		t.Fatal(err)
	}
	entry := s.Catalog()[0]
	if entry.Kind != KindLLM || entry.ContextWindow != 65536 {
		t.Fatalf("catalog entry = %+v", entry)
	}
}
