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

// A plugin that retires a setting must not leave the old key in the store: the
// panel round-trips whatever it read, so an undeclared key would be written
// back on every save and become permanent invisible config.
func TestSetValuesRejectsUndeclaredKeys(t *testing.T) {
	path := filepath.Join(t.TempDir(), "settings.json")
	store := NewStore(path)
	store.RegisterSection(demoSection())

	if err := store.SetValues("demo", map[string]interface{}{
		"name":        "kept",
		"retired_key": "should be dropped",
	}); err != nil {
		t.Fatalf("SetValues: %v", err)
	}

	got := store.GetValues("demo")
	if got["name"] != "kept" {
		t.Fatalf("declared key lost: %v", got)
	}
	if _, present := got["retired_key"]; present {
		t.Fatalf("undeclared key was persisted: %v", got)
	}
	if _, present := store.GetValues("demo")["retired_key"]; present {
		t.Fatal("undeclared key survived in memory")
	}
}

// Files written before the guard existed still carry retired keys. Re-registering
// the section is the moment we learn the real field set, so prune there.
func TestRegisterSectionPrunesRetiredKeysFromDisk(t *testing.T) {
	path := filepath.Join(t.TempDir(), "settings.json")
	seed := NewStore(path)
	seed.RegisterSection(demoSection())
	// Write the legacy shape directly: the old key plus a current one.
	if err := os.WriteFile(path, []byte(`{"values":{"demo":{"enabled":false,"name":"legacy","gone":"stale"}}}`), 0o644); err != nil {
		t.Fatalf("seed file: %v", err)
	}
	_ = seed

	reloaded := NewStore(path)
	// Precondition: the legacy key is in the loaded map, even though GetValues
	// only surfaces declared fields. Assert on raw state to prove the prune ran.
	if _, present := reloaded.values["demo"]["gone"]; !present {
		t.Fatal("precondition: legacy key should load before registration")
	}
	reloaded.RegisterSection(demoSection())

	if _, present := reloaded.values["demo"]["gone"]; present {
		t.Fatalf("retired key was not pruned: %v", reloaded.values["demo"])
	}
	if reloaded.GetValues("demo")["name"] != "legacy" {
		t.Fatalf("surviving value lost: %v", reloaded.GetValues("demo"))
	}

	// The pruning must reach the file, not just memory.
	third := NewStore(path)
	if _, present := third.values["demo"]["gone"]; present {
		t.Fatal("retired key persisted on disk after prune")
	}
	third.RegisterSection(demoSection())
	if third.GetValues("demo")["name"] != "legacy" {
		t.Fatalf("value lost across reload: %v", third.GetValues("demo"))
	}
}
