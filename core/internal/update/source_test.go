package update

import (
	"fmt"
	"os"
	"path/filepath"
	"testing"
)

func TestIsUmbrellaRootAcceptsGitFileAndMarkers(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, ".git"), []byte("gitdir: /elsewhere\n"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "manifest.json"), []byte("{}"), 0o644); err != nil {
		t.Fatal(err)
	}
	if !isUmbrellaRoot(dir) {
		t.Fatal("git file + manifest should be an umbrella root")
	}
	if err := os.Remove(filepath.Join(dir, "manifest.json")); err != nil {
		t.Fatal(err)
	}
	if isUmbrellaRoot(dir) {
		t.Fatal("git file without an umbrella marker is not a root")
	}
}

func TestComponentForPackage(t *testing.T) {
	for _, tc := range []struct {
		pkg, id string
		ok      bool
	}{
		{"@razuresoft/0kay-core", "core", true},
		{"@razuresoft/0kay-webui", "webui", true},
		{"@razuresoft/0kay-pm", "pm", true},
		{"@razuresoft/0kay", "", false},
		{"@razureink/0kay-compat", "@razureink/0kay-compat", true},
		{"", "", false},
	} {
		id, ok := ComponentForPackage(tc.pkg)
		if id != tc.id || ok != tc.ok {
			t.Errorf("ComponentForPackage(%q) = (%q, %v), want (%q, %v)", tc.pkg, id, ok, tc.id, tc.ok)
		}
	}
}

func TestEverySourceComponentIsAddressable(t *testing.T) {
	for _, name := range []string{"core", "mocr", "life", "agent", "webui", "mcp", "minecraft", "pm"} {
		if _, ok := PackageFor(name); !ok {
			t.Errorf("PackageFor(%q) not defined", name)
		}
		if _, ok := componentSubdir(name); !ok {
			t.Errorf("componentSubdir(%q) not defined", name)
		}
		if !CanUpdate(name) {
			t.Errorf("CanUpdate(%q) = false, want true", name)
		}
	}
	if CanUpdate("not-a-real-component") {
		t.Error("CanUpdate(unknown) = true, want false")
	}
}

func TestPmInstalledPluginListPrefersManifestVersion(t *testing.T) {
	root := t.TempDir()
	manifest := `{"name":"@razureink/0kay-free-model","version":"0.0.8","repository":"https://github.com/razureink/0KAY-free-model.git"}`
	if err := os.WriteFile(filepath.Join(root, "manifest.json"), []byte(manifest), 0o644); err != nil {
		t.Fatal(err)
	}
	home := t.TempDir()
	state := fmt.Sprintf(
		`{"installed":{"@razureink/0kay-free-model":{"version":"0.0.4","repository":"https://github.com/razureink/0KAY-free-model.git","repositoryRoot":%q}}}`,
		root,
	)
	if err := os.WriteFile(filepath.Join(home, "state.json"), []byte(state), 0o644); err != nil {
		t.Fatal(err)
	}
	t.Setenv("OKAY_PM_HOME", home)

	plugins := pmInstalledPluginList()
	if len(plugins) != 1 {
		t.Fatalf("got %d plugins, want 1", len(plugins))
	}
	if plugins[0].Version != "0.0.8" {
		t.Errorf("version = %q, want 0.0.8 (manifest must win over the stale record)", plugins[0].Version)
	}
}
