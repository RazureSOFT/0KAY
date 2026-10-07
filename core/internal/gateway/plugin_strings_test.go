package gateway

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"

	"0kay/core/internal/registry"
)

// writePluginStrings lays down CORE_DATA_DIR/plugin-ui/{name}/strings/values*/
// for a plugin, the way the plugin's build would.
func writePluginStrings(t *testing.T, name string, locales map[string]string) {
	t.Helper()
	dataDir := t.TempDir()
	t.Setenv("CORE_DATA_DIR", dataDir)
	for dir, body := range locales {
		full := filepath.Join(dataDir, "plugin-ui", name, "strings", dir)
		if err := os.MkdirAll(full, 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(filepath.Join(full, "strings.xml"), []byte(body), 0o644); err != nil {
			t.Fatal(err)
		}
	}
}

func TestPluginStringsServesEveryLocale(t *testing.T) {
	writePluginStrings(t, "demo", map[string]string{
		"values":           `<resources><string name="panel.title">Demo panel</string><string name="panel.run">Run</string></resources>`,
		"values-zh":        `<resources><string name="panel.title">演示面板</string><string name="panel.run">运行</string></resources>`,
		"values-b+zh+Hant": `<resources><string name="panel.title">示範面板</string><string name="panel.run">執行</string></resources>`,
	})

	g := &Gateway{registry: registry.NewRegistry()}
	rec := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/plugins/demo/strings", nil)
	req.SetPathValue("name", "demo")
	g.handlePluginStrings(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d body=%s", rec.Code, rec.Body)
	}
	var payload struct {
		Default string                       `json:"default"`
		Locales map[string]map[string]string `json:"locales"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatal(err)
	}
	if payload.Default != "en" {
		t.Fatalf("default = %q, want en", payload.Default)
	}
	// The BCP-47 directory name must arrive as the app's own locale code.
	if payload.Locales["zh-Hant"]["panel.title"] != "示範面板" {
		t.Fatalf("zh-Hant not mapped from values-b+zh+Hant: %#v", payload.Locales)
	}
	if len(payload.Locales["zh"]) != 2 || payload.Locales["en"]["panel.run"] != "Run" {
		t.Fatalf("locales = %#v", payload.Locales)
	}
}

func TestPluginStringsMissingIsNotFound(t *testing.T) {
	// A plugin with a UI bundle but no strings is a legitimate 404, not a 500.
	writePluginStrings(t, "other", map[string]string{"values": `<resources/>`})
	g := &Gateway{registry: registry.NewRegistry()}
	rec := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/plugins/silent/strings", nil)
	req.SetPathValue("name", "silent")
	g.handlePluginStrings(rec, req)
	if rec.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want 404", rec.Code)
	}
}

func TestPluginStringsRejectsMalformedXML(t *testing.T) {
	// Loud, not silent: a broken bundle must not render key paths in the UI.
	writePluginStrings(t, "broken", map[string]string{
		"values": `<resources><string name="x">unclosed`,
	})
	g := &Gateway{registry: registry.NewRegistry()}
	rec := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/plugins/broken/strings", nil)
	req.SetPathValue("name", "broken")
	g.handlePluginStrings(rec, req)
	if rec.Code != http.StatusInternalServerError {
		t.Fatalf("status = %d, want 500", rec.Code)
	}
	var body map[string]string
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if body["code"] != "invalid_strings" {
		t.Fatalf("code = %q", body["code"])
	}
}

func TestPluginStringsRejectsTraversalAndBadNames(t *testing.T) {
	writePluginStrings(t, "demo", map[string]string{"values": `<resources><string name="a">b</string></resources>`})
	g := &Gateway{registry: registry.NewRegistry()}
	for _, name := range []string{"../secret", "a/b", "", "with space", "x.y"} {
		rec := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodGet, "/api/plugins/x/strings", nil)
		req.SetPathValue("name", name)
		g.handlePluginStrings(rec, req)
		if rec.Code != http.StatusNotFound {
			t.Errorf("name %q: status = %d, want 404", name, rec.Code)
		}
	}
}

func TestPluginStringsMethodNotAllowed(t *testing.T) {
	g := &Gateway{registry: registry.NewRegistry()}
	rec := httptest.NewRecorder()
	g.handlePluginStrings(rec, httptest.NewRequest(http.MethodPost, "/api/plugins/demo/strings", nil))
	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("status = %d, want 405", rec.Code)
	}
}

func TestPluginStringsDisabledPluginIsHidden(t *testing.T) {
	writePluginStrings(t, "demo", map[string]string{"values": `<resources><string name="a">b</string></resources>`})
	reg := registry.NewRegistry()
	reg.LoadDisabled([]string{"demo"})
	g := &Gateway{registry: reg}
	rec := httptest.NewRecorder()
	req := httptest.NewRequest(http.MethodGet, "/api/plugins/demo/strings", nil)
	req.SetPathValue("name", "demo")
	g.handlePluginStrings(rec, req)
	if rec.Code != http.StatusNotFound {
		t.Fatalf("status = %d, want 404 for a disabled plugin", rec.Code)
	}
}
