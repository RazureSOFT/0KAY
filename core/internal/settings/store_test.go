package settings

import (
	"errors"
	"os"
	"path/filepath"
	"testing"
)

func demoSection() Section {
	return Section{ID: "demo", Label: "Demo", Fields: []Field{
		{Key: "enabled", Type: "bool", DefaultValue: "true"},
		{Key: "name", Type: "text", DefaultValue: "hello"},
	}}
}

func TestDefaultsMergeAndPersist(t *testing.T) {
	path := filepath.Join(t.TempDir(), "settings.json")
	store := NewStore(path)
	store.RegisterSection(demoSection())

	values := store.GetValues("demo")
	if values["enabled"] != true || values["name"] != "hello" {
		t.Fatalf("defaults not applied: %v", values)
	}
	if err := store.SetValues("demo", map[string]interface{}{"name": "world"}); err != nil {
		t.Fatalf("SetValues: %v", err)
	}

	reloaded := NewStore(path)
	reloaded.RegisterSection(demoSection())
	got := reloaded.GetValues("demo")
	if got["name"] != "world" {
		t.Fatalf("persisted value not reloaded: %v", got)
	}
	if got["enabled"] != true {
		t.Fatalf("default lost after reload: %v", got)
	}
	if _, err := os.Stat(path + ".tmp"); !os.IsNotExist(err) {
		t.Fatalf("temporary file left behind: %v", err)
	}
}

func TestSetValuesUnknownSection(t *testing.T) {
	store := NewStore(filepath.Join(t.TempDir(), "settings.json"))
	err := store.SetValues("missing", map[string]interface{}{"a": 1})
	if !errors.Is(err, os.ErrNotExist) {
		t.Fatalf("expected os.ErrNotExist, got %v", err)
	}
}

func TestUnregisterPluginSections(t *testing.T) {
	store := NewStore(filepath.Join(t.TempDir(), "settings.json"))
	store.RegisterSection(Section{ID: "a", PluginID: "p1"})
	store.RegisterSection(Section{ID: "b", PluginID: "p2"})
	store.UnregisterPluginSections("p1")
	if _, ok := store.Get("a"); ok {
		t.Fatal("section a should be removed")
	}
	if _, ok := store.Get("b"); !ok {
		t.Fatal("section b should remain")
	}
}
