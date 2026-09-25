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
	// The merged result must be persisted so it does not resurface.
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
	if len(snap.Providers) != 1 {
		t.Fatalf("want 1 provider, got %d: %+v", len(snap.Providers), snap.Providers)
	}
	got := snap.Providers[0]
	if got.ID != "custom_a" {
		t.Fatalf("should reuse existing id, got %q", got.ID)
	}
	if got.APIKey != "new" {
		t.Fatalf("new credentials should win, got %q", got.APIKey)
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
