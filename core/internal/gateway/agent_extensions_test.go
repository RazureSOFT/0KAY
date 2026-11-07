package gateway

import (
	"archive/zip"
	"bytes"
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

// extensionGateway returns a Gateway whose extension directory is a temp dir.
// The handlers under test never reach the agent, so the registry stays empty.
func extensionGateway(t *testing.T) (*Gateway, string) {
	t.Helper()
	dir := t.TempDir()
	t.Setenv("CORE_EXTENSIONS_DIR", dir)
	return &Gateway{}, dir
}

func writeTestPlugin(t *testing.T, dir, name, manifest string) string {
	t.Helper()
	full := filepath.Join(dir, name)
	if err := os.MkdirAll(full, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(full, "manifest.json"), []byte(manifest), 0o644); err != nil {
		t.Fatal(err)
	}
	return full
}

func TestExtensionsListReportsBrokenPluginsInsteadOfHidingThem(t *testing.T) {
	g, dir := extensionGateway(t)
	writeTestPlugin(t, dir, "good", `{"name":"good","title":"Good","behaviour":{"prompt":"be nice"}}`)
	// A directory with no manifest is a plugin the operator tried to install
	// and got wrong; it has to be visible or the failure is invisible.
	if err := os.MkdirAll(filepath.Join(dir, "broken"), 0o755); err != nil {
		t.Fatal(err)
	}
	rec := httptest.NewRecorder()
	g.handleExtensions(rec, httptest.NewRequest(http.MethodGet, "/api/agent/extensions", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
	var body struct {
		Extensions []map[string]interface{} `json:"extensions"`
		Explicit   bool                     `json:"explicit"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if len(body.Extensions) != 2 {
		t.Fatalf("got %d rows, want 2 (one good, one broken)", len(body.Extensions))
	}
	if body.Explicit {
		t.Fatal("a fresh directory should report explicit=false, meaning everything is on")
	}
	problem := ""
	for _, row := range body.Extensions {
		if row["name"] == "broken" {
			problem, _ = row["problem"].(string)
		}
	}
	if problem == "" {
		t.Fatal("the broken plugin was listed without a problem")
	}
}

func TestExtensionsDisableWritesAnAllowListAndEnableRestoresIt(t *testing.T) {
	g, dir := extensionGateway(t)
	writeTestPlugin(t, dir, "one", `{"name":"one"}`)
	writeTestPlugin(t, dir, "two", `{"name":"two"}`)

	disable := func(name string, enabled bool) {
		t.Helper()
		payload, _ := json.Marshal(map[string]interface{}{"name": name, "enabled": enabled})
		rec := httptest.NewRecorder()
		g.handleExtensionsEnable(rec, httptest.NewRequest(http.MethodPost, "/api/agent/extensions/enable", bytes.NewReader(payload)))
		if rec.Code != http.StatusOK {
			t.Fatalf("enable %s=%v: %d %s", name, enabled, rec.Code, rec.Body.String())
		}
	}

	disable("two", false)
	enabled := g.enabledExtensions()
	if enabled["two"] {
		t.Fatal("two should be written as disabled")
	}
	if !enabled["one"] {
		t.Fatal("disabling one plugin must not disable the others")
	}

	disable("two", true)
	enabled = g.enabledExtensions()
	if !enabled["two"] || !enabled["one"] {
		t.Fatalf("re-enabling two should leave both on, got %v", enabled)
	}
}

func TestExtensionsResetClearsTheAllowList(t *testing.T) {
	g, dir := extensionGateway(t)
	writeTestPlugin(t, dir, "one", `{"name":"one"}`)
	if err := g.writeEnabledExtensions([]string{"one"}); err != nil {
		t.Fatal(err)
	}
	payload := []byte(`{"reset":true}`)
	rec := httptest.NewRecorder()
	g.handleExtensionsEnable(rec, httptest.NewRequest(http.MethodPost, "/api/agent/extensions/enable", bytes.NewReader(payload)))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d %s", rec.Code, rec.Body.String())
	}
	if len(g.enabledExtensions()) != 0 {
		t.Fatal("reset should leave an empty list, meaning everything is on")
	}
}

func TestExtensionsRemoveAlsoDropsItFromTheAllowList(t *testing.T) {
	g, dir := extensionGateway(t)
	writeTestPlugin(t, dir, "gone", `{"name":"gone"}`)
	if err := g.writeEnabledExtensions([]string{"gone"}); err != nil {
		t.Fatal(err)
	}
	payload := []byte(`{"name":"gone"}`)
	rec := httptest.NewRecorder()
	g.handleExtensionsRemove(rec, httptest.NewRequest(http.MethodPost, "/api/agent/extensions/remove", bytes.NewReader(payload)))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d %s", rec.Code, rec.Body.String())
	}
	if _, err := os.Stat(filepath.Join(dir, "gone")); !os.IsNotExist(err) {
		t.Fatal("the plugin directory should be gone")
	}
	if g.enabledExtensions()["gone"] {
		t.Fatal("a removed plugin left a stale entry in the allow-list, so reinstalling it would inherit a decision nobody made")
	}
}

func TestExtensionsInstallFromAPath(t *testing.T) {
	g, dir := extensionGateway(t)
	source := t.TempDir()
	if err := os.WriteFile(filepath.Join(source, "manifest.json"), []byte(`{"name":"local","title":"Local"}`), 0o644); err != nil {
		t.Fatal(err)
	}
	payload, _ := json.Marshal(map[string]interface{}{"path": source})
	rec := httptest.NewRecorder()
	g.handleExtensionsInstall(rec, httptest.NewRequest(http.MethodPost, "/api/agent/extensions/install", bytes.NewReader(payload)))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d %s", rec.Code, rec.Body.String())
	}
	if _, err := os.Stat(filepath.Join(dir, "local", "manifest.json")); err != nil {
		t.Fatalf("plugin was not copied into place: %v", err)
	}

	// A second install without replace must not quietly overwrite.
	rec = httptest.NewRecorder()
	g.handleExtensionsInstall(rec, httptest.NewRequest(http.MethodPost, "/api/agent/extensions/install", bytes.NewReader(payload)))
	if rec.Code != http.StatusConflict {
		t.Fatalf("reinstall without replace = %d, want 409", rec.Code)
	}
}

func TestExtensionsInstallRejectsAnArchiveThatEscapesItsDirectory(t *testing.T) {
	g, _ := extensionGateway(t)
	var buf bytes.Buffer
	archive := zip.NewWriter(&buf)
	// The classic: a zip entry whose path climbs out during extraction.
	entry, err := archive.Create("../../evil/manifest.json")
	if err != nil {
		t.Fatal(err)
	}
	entry.Write([]byte(`{"name":"evil"}`))
	archive.Close()

	payload, _ := json.Marshal(map[string]interface{}{
		"archive": base64.StdEncoding.EncodeToString(buf.Bytes()),
	})
	rec := httptest.NewRecorder()
	g.handleExtensionsInstall(rec, httptest.NewRequest(http.MethodPost, "/api/agent/extensions/install", bytes.NewReader(payload)))
	if rec.Code == http.StatusOK {
		t.Fatalf("a zip with a traversal entry was accepted: %s", rec.Body.String())
	}
	if !strings.Contains(rec.Body.String(), "escape") {
		t.Fatalf("unexpected refusal: %s", rec.Body.String())
	}
}

func TestExtensionsInstallAcceptsAZipWithOneTopLevelFolder(t *testing.T) {
	g, dir := extensionGateway(t)
	var buf bytes.Buffer
	archive := zip.NewWriter(&buf)
	entry, err := archive.Create("my-plugin/manifest.json")
	if err != nil {
		t.Fatal(err)
	}
	entry.Write([]byte(`{"name":"my-plugin","entry":"index.mjs"}`))
	file, err := archive.Create("my-plugin/index.mjs")
	if err != nil {
		t.Fatal(err)
	}
	file.Write([]byte(`export default () => ({})`))
	archive.Close()

	payload, _ := json.Marshal(map[string]interface{}{
		"archive": base64.StdEncoding.EncodeToString(buf.Bytes()),
	})
	rec := httptest.NewRecorder()
	g.handleExtensionsInstall(rec, httptest.NewRequest(http.MethodPost, "/api/agent/extensions/install", bytes.NewReader(payload)))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d %s", rec.Code, rec.Body.String())
	}
	if _, err := os.Stat(filepath.Join(dir, "my-plugin", "index.mjs")); err != nil {
		t.Fatalf("the archive's nested folder was not flattened into the plugin name: %v", err)
	}
}

func TestExtensionsInstallRefusesANameThatIsNotAFilename(t *testing.T) {
	g, _ := extensionGateway(t)
	source := t.TempDir()
	if err := os.WriteFile(filepath.Join(source, "manifest.json"), []byte(`{"name":"../escape"}`), 0o644); err != nil {
		t.Fatal(err)
	}
	payload, _ := json.Marshal(map[string]interface{}{"path": source})
	rec := httptest.NewRecorder()
	g.handleExtensionsInstall(rec, httptest.NewRequest(http.MethodPost, "/api/agent/extensions/install", bytes.NewReader(payload)))
	if rec.Code == http.StatusOK {
		t.Fatalf("a traversal name was accepted: %s", rec.Body.String())
	}
}
