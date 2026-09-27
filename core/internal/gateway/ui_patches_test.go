package gateway

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"testing"

	pluginv1 "0kay/gen/plugin/v1"

	"0kay/core/internal/registry"
)

func writePatch(t *testing.T, dir, name string, doc map[string]any) {
	t.Helper()
	raw, err := json.Marshal(doc)
	if err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, name), raw, 0o644); err != nil {
		t.Fatal(err)
	}
}

// A patch that names an owning plugin must disappear the moment that plugin is
// admin-disabled — that is what makes the Plugins page switch authoritative.
func TestUIPatchStoreDropsDisabledOwner(t *testing.T) {
	dir := t.TempDir()
	writePatch(t, dir, "fluentui.patch", map[string]any{
		"id":      "fluentui-theme",
		"plugin":  "fluentui",
		"enabled": true,
		"patches": []map[string]any{
			{"target": "theme", "op": "insert", "id": "fluentui", "item": map[string]any{"id": "fluentui"}},
		},
	})
	writePatch(t, dir, "platform.patch", map[string]any{
		"id":      "platform-chrome",
		"enabled": true,
		"patches": []map[string]any{
			{"target": "nav", "op": "insert", "id": "x", "item": map[string]any{"id": "x"}},
		},
	})

	store := NewUIPatchStore(dir)
	disabled := map[string]bool{}
	store.SetPluginDisabledHook(func(plugin string) bool { return disabled[plugin] })

	ids := func() []string {
		var out []string
		for _, p := range store.List(false) {
			out = append(out, p.ID)
		}
		return out
	}
	if got := ids(); len(got) != 2 {
		t.Fatalf("expected both patches while enabled, got %v", got)
	}

	disabled["fluentui"] = true
	got := ids()
	if len(got) != 1 || got[0] != "platform-chrome" {
		t.Fatalf("expected the owner's patch to drop, got %v", got)
	}
	for _, op := range store.FlattenOps() {
		if op["patchId"] == "fluentui-theme" {
			t.Fatal("disabled owner's op still served")
		}
	}
	// includeDisabled only lifts the file-level `enabled` flag: an owner that
	// an admin switched off is gone from every view.
	if len(store.List(true)) != 1 {
		t.Fatalf("List(true) must not resurrect a disabled owner, got %v", store.List(true))
	}

	disabled["fluentui"] = false
	if len(ids()) != 2 {
		t.Fatal("re-enabling the owner did not restore its patch")
	}
}

func TestHasUIPatchLooksInCoreDataDir(t *testing.T) {
	data := t.TempDir()
	t.Setenv("CORE_DATA_DIR", data)
	if HasUIPatch("fluentui.patch") {
		t.Fatal("reported a patch that does not exist")
	}
	writePatch(t, filepath.Join(data, "ui"), "fluentui.patch", map[string]any{"id": "fluentui-theme"})
	if !HasUIPatch("fluentui.patch") {
		t.Fatal("did not find the patch in CORE_DATA_DIR/ui")
	}
}

// The package patch must name the builtin row Core registers for it
// (cmd/core/registerBuiltins), otherwise the Plugins page switch cannot reach
// it: ops are filtered through GetPluginsByCapability(plugin). It must NOT
// ship inside core/data/ui — 0kay-pm copies it there on install, and only then
// does the row (and the theme) appear.
func TestPackageFluentPatchIsOwnedByItsPanelRow(t *testing.T) {
	raw, err := os.ReadFile(filepath.Join("..", "..", "..", "plugin-web", "fluentui", "patches", "fluentui.patch"))
	if err != nil {
		t.Fatalf("read package patch: %v", err)
	}
	var doc UIPatchFile
	if err := json.Unmarshal(raw, &doc); err != nil {
		t.Fatalf("parse package patch: %v", err)
	}
	if doc.Plugin != "fluentui" {
		t.Fatalf("plugin=%q, want fluentui", doc.Plugin)
	}
	if doc.Enabled == nil || !*doc.Enabled {
		t.Fatal("file-level enabled must stay true, otherwise the panel switch cannot turn it on")
	}
	if doc.Capability != "" && doc.Capability != doc.Plugin {
		t.Fatalf("capability=%q does not resolve through the fluentui row", doc.Capability)
	}
	hasTheme := false
	for _, op := range doc.Patches {
		if op.Target == "theme" {
			hasTheme = true
		}
	}
	if !hasTheme {
		t.Fatal("package patch carries no theme op")
	}

	// The pm manifest is what carries the patch into CORE_DATA_DIR/ui on
	// install; without that entry the package would install inert.
	manifest, err := os.ReadFile(filepath.Join("..", "..", "..", "plugin-web", "fluentui", "manifest.json"))
	if err != nil {
		t.Fatalf("read package manifest: %v", err)
	}
	var pm struct {
		Patches []string `json:"patches"`
	}
	if err := json.Unmarshal(manifest, &pm); err != nil {
		t.Fatalf("parse package manifest: %v", err)
	}
	if len(pm.Patches) != 1 || pm.Patches[0] != "patches/fluentui.patch" {
		t.Fatalf("manifest patches=%v, want [patches/fluentui.patch]", pm.Patches)
	}

	// The platform must not commit a runtime copy: a plain `git pull` would
	// activate the theme before anyone installs it. Checked through git so an
	// 0kay-pm install landing in the same directory stays legal.
	cmd := exec.Command("git", "ls-files", "--error-unmatch", filepath.Join("core", "data", "ui", "fluentui.patch"))
	cmd.Dir = filepath.Join("..", "..")
	if out, err := cmd.CombinedOutput(); err == nil {
		t.Fatalf("core/data/ui/fluentui.patch is tracked by git, it must only arrive on install: %s", out)
	} else if len(out) > 0 && strings.Contains(string(out), "not a git repository") {
		t.Skip("outside a git checkout")
	}
}

// Disabling L.I.F.E. must reach the permissions API too: it reads Core's own
// store, so without this gate the panel switch would not turn everything off.
func TestLifePermissionsRefusesWhenDisabled(t *testing.T) {
	reg := registry.NewRegistry()
	reg.LoadDisabled([]string{"life"})
	g := &Gateway{registry: reg}

	rec := httptest.NewRecorder()
	g.handleLifePermissions(rec, httptest.NewRequest(http.MethodGet, "/api/life/permissions", nil))
	if rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("status=%d, want 503 while life is disabled", rec.Code)
	}
}

// The user story end to end: register the row, flip the switch the way
// PluginsPage does, and watch the theme ops leave /api/ui/patches.
func TestThemeOpsFollowThePluginSwitch(t *testing.T) {
	data := t.TempDir()
	t.Setenv("CORE_DATA_DIR", data)
	writePatch(t, filepath.Join(data, "ui"), "fluentui.patch", map[string]any{
		"id":      "fluentui-theme",
		"plugin":  "fluentui",
		"enabled": true,
		"patches": []map[string]any{
			{"target": "theme", "op": "insert", "id": "fluentui", "item": map[string]any{"id": "fluentui"}},
		},
	})

	reg := registry.NewRegistry()
	if _, err := reg.RegisterBuiltin(&pluginv1.PluginInfo{Name: "fluentui"}, []string{"fluentui"}, ""); err != nil {
		t.Fatal(err)
	}
	g := &Gateway{registry: reg}
	g.uiPatches = NewUIPatchStore(filepath.Join(data, "ui"))
	g.uiPatches.SetPluginDisabledHook(func(plugin string) bool { return reg.IsDisabled(plugin) })

	themeOps := func() int {
		rec := httptest.NewRecorder()
		g.handleUIPatches(rec, httptest.NewRequest(http.MethodGet, "/api/ui/patches", nil))
		if rec.Code != http.StatusOK {
			t.Fatalf("GET /api/ui/patches status=%d", rec.Code)
		}
		var body struct {
			Ops []struct {
				Target string `json:"target"`
			} `json:"ops"`
		}
		if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
			t.Fatal(err)
		}
		n := 0
		for _, op := range body.Ops {
			if op.Target == "theme" {
				n++
			}
		}
		return n
	}

	if got := themeOps(); got != 1 {
		t.Fatalf("enabled: %d theme ops, want 1", got)
	}

	off := httptest.NewRecorder()
	g.setPluginEnabled("fluentui", false, off)
	if off.Code != http.StatusOK {
		t.Fatalf("disable status=%d body=%s", off.Code, off.Body.String())
	}
	if got := themeOps(); got != 0 {
		t.Fatalf("disabled: %d theme ops, want 0", got)
	}

	on := httptest.NewRecorder()
	g.setPluginEnabled("fluentui", true, on)
	if on.Code != http.StatusOK {
		t.Fatalf("enable status=%d", on.Code)
	}
	if got := themeOps(); got != 1 {
		t.Fatalf("re-enabled: %d theme ops, want 1", got)
	}
}
