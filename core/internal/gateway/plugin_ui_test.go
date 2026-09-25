package gateway

import (
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestPluginUIServesBundleAndBlocksEscape(t *testing.T) {
	data := t.TempDir()
	t.Setenv("CORE_DATA_DIR", data)
	dir := filepath.Join(data, "plugin-ui", "demo")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "index.js"), []byte("export default {}"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.MkdirAll(filepath.Join(dir, "assets"), 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "assets", "chunk-abc123.js"), []byte("export const x=1"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(data, "secret.txt"), []byte("nope"), 0o644); err != nil {
		t.Fatal(err)
	}

	g := &Gateway{}

	ok := httptest.NewRecorder()
	g.handlePluginUI(ok, httptest.NewRequest("GET", "/api/plugins/demo/ui/index.js", nil))
	if ok.Code != 200 || !strings.Contains(ok.Body.String(), "export default") {
		t.Fatalf("status=%d body=%q", ok.Code, ok.Body.String())
	}
	if ct := ok.Header().Get("Content-Type"); !strings.Contains(ct, "javascript") {
		t.Fatalf("content-type=%q", ct)
	}

	chunk := httptest.NewRecorder()
	g.handlePluginUI(chunk, httptest.NewRequest("GET", "/api/plugins/demo/ui/assets/chunk-abc123.js", nil))
	if chunk.Code != 200 || !strings.Contains(chunk.Body.String(), "export const x") {
		t.Fatalf("chunk status=%d body=%q", chunk.Code, chunk.Body.String())
	}
	if cc := chunk.Header().Get("Cache-Control"); !strings.Contains(cc, "immutable") {
		t.Fatalf("hashed asset cache-control=%q", cc)
	}
	if ie := ok.Header().Get("Cache-Control"); !strings.Contains(ie, "no-cache") {
		t.Fatalf("entry cache-control=%q", ie)
	}

	escaped := httptest.NewRecorder()
	g.handlePluginUI(escaped, httptest.NewRequest("GET", "/api/plugins/demo/ui/../../secret.txt", nil))
	if escaped.Code == 200 && strings.Contains(escaped.Body.String(), "nope") {
		t.Fatal("path escape served secret")
	}

	bad := httptest.NewRecorder()
	g.handlePluginUI(bad, httptest.NewRequest("GET", "/api/plugins/../ui/index.js", nil))
	if bad.Code != 404 && bad.Code != 400 {
		t.Fatalf("bad name status=%d", bad.Code)
	}
}
