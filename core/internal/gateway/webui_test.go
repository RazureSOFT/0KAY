package gateway

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func newWebUITestTree(t *testing.T) string {
	t.Helper()
	root := t.TempDir()
	if err := os.MkdirAll(filepath.Join(root, "assets"), 0o755); err != nil {
		t.Fatal(err)
	}
	files := map[string]string{
		"index.html":           `<!doctype html><title>0KAY</title>`,
		"favicon.svg":          `<svg xmlns="http://www.w3.org/2000/svg"/>`,
		"assets/index-abc1.js": `export const ok = true`,
	}
	for name, body := range files {
		if err := os.WriteFile(filepath.Join(root, filepath.FromSlash(name)), []byte(body), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	t.Setenv("CORE_WEBUI_DIR", root)
	return root
}

func TestWebUIServesSPAAndAssets(t *testing.T) {
	newWebUITestTree(t)
	g := &Gateway{}

	index := httptest.NewRecorder()
	g.handleWebUI(index, httptest.NewRequest("GET", "/", nil))
	if index.Code != 200 || !strings.Contains(index.Body.String(), "0KAY") {
		t.Fatalf("index status=%d body=%q", index.Code, index.Body.String())
	}
	if cc := index.Header().Get("Cache-Control"); !strings.Contains(cc, "no-cache") {
		t.Fatalf("index cache-control=%q", cc)
	}
	if index.Header().Get("Content-Security-Policy") == "" {
		t.Fatal("missing CSP header")
	}

	// Client-side routes fall back to the shell.
	route := httptest.NewRecorder()
	g.handleWebUI(route, httptest.NewRequest("GET", "/pet", nil))
	if route.Code != 200 || !strings.Contains(route.Body.String(), "0KAY") {
		t.Fatalf("spa route status=%d body=%q", route.Code, route.Body.String())
	}

	asset := httptest.NewRecorder()
	g.handleWebUI(asset, httptest.NewRequest("GET", "/assets/index-abc1.js", nil))
	if asset.Code != 200 || !strings.Contains(asset.Body.String(), "export const ok") {
		t.Fatalf("asset status=%d body=%q", asset.Code, asset.Body.String())
	}
	if ct := asset.Header().Get("Content-Type"); !strings.Contains(ct, "javascript") {
		t.Fatalf("asset content-type=%q", ct)
	}
	if cc := asset.Header().Get("Cache-Control"); !strings.Contains(cc, "immutable") {
		t.Fatalf("asset cache-control=%q", cc)
	}

	// Public files keep a stable name and must not be cached forever.
	public := httptest.NewRecorder()
	g.handleWebUI(public, httptest.NewRequest("GET", "/favicon.svg", nil))
	if cc := public.Header().Get("Cache-Control"); !strings.Contains(cc, "no-cache") {
		t.Fatalf("public cache-control=%q", cc)
	}
}

func TestWebUIRejectsAPIMissesAndMethods(t *testing.T) {
	newWebUITestTree(t)
	g := &Gateway{}

	api := httptest.NewRecorder()
	g.handleWebUI(api, httptest.NewRequest("GET", "/api/does-not-exist", nil))
	if api.Code != 404 {
		t.Fatalf("api miss status=%d", api.Code)
	}

	post := httptest.NewRecorder()
	g.handleWebUI(post, httptest.NewRequest("POST", "/", nil))
	if post.Code != 405 {
		t.Fatalf("post status=%d", post.Code)
	}

	missing := httptest.NewRecorder()
	g.handleWebUI(missing, httptest.NewRequest("GET", "/assets/missing-def4.js", nil))
	if missing.Code != 404 {
		t.Fatalf("missing asset status=%d", missing.Code)
	}
}

func TestWebUIDisabledWithoutDirectory(t *testing.T) {
	t.Setenv("CORE_WEBUI_DIR", "")
	g := &Gateway{}
	rec := httptest.NewRecorder()
	g.handleWebUI(rec, httptest.NewRequest("GET", "/", nil))
	if rec.Code != 404 {
		t.Fatalf("status=%d, want 404 when CORE_WEBUI_DIR is unset", rec.Code)
	}
}

// The shell's inline scripts are hashed on the way out, not pinned in the
// header. A pinned hash is correct until someone edits index.html, and then
// every inline script is blocked: the page comes up blank with one CSP line in
// the console. This asserts the policy follows the document.
func TestWebUICSPFollowsTheInlineScripts(t *testing.T) {
	html := `<html><head>
		<script>window.theme='dark'</script>
		<script type="application/json">{"a":1}</script>
		<script type="importmap">{"imports":{}}</script>
		<script src="/assets/index.js"></script>
		<script type="module">boot()</script>
		</head><body></body></html>`

	policy := webuiCSP(html)
	hashes := inlineScriptHashes(html)
	// The two classic scripts and the importmap. Not the JSON data block, and
	// not the script that has a src.
	if len(hashes) != 3 {
		t.Fatalf("got %d hashes, want 3: %v", len(hashes), hashes)
	}
	for _, hash := range hashes {
		if !strings.Contains(policy, hash) {
			t.Fatalf("policy is missing %s: %s", hash, policy)
		}
	}

	// A different body must produce a different policy, or the check above is
	// passing for the wrong reason.
	changed := webuiCSP(`<script>window.theme='light'</script>`)
	if changed == policy {
		t.Fatal("the policy did not change when the inline script did")
	}
}

func TestWebUICSPWithoutInlineScriptsStaysStrict(t *testing.T) {
	policy := webuiCSP(`<html><body><script src="/assets/index.js"></script></body></html>`)
	if !strings.Contains(policy, "script-src 'self';") {
		t.Fatalf("no inline scripts should leave script-src at 'self': %s", policy)
	}
	if strings.Contains(policy, "'unsafe-eval'") || strings.Contains(policy, "script-src 'self' 'unsafe-inline'") {
		t.Fatalf("the policy must not be broadened to make inline code work: %s", policy)
	}
}

// The served shell and its policy have to agree; this is the regression that
// produced a white window.
func TestWebUIServesMatchingCSP(t *testing.T) {
	root := t.TempDir()
	body := `<html><head><script>preboot()</script></head><body></body></html>`
	if err := os.WriteFile(filepath.Join(root, "index.html"), []byte(body), 0o644); err != nil {
		t.Fatal(err)
	}
	t.Setenv("CORE_WEBUI_DIR", root)
	g := &Gateway{}
	rec := httptest.NewRecorder()
	g.handleWebUI(rec, httptest.NewRequest(http.MethodGet, "/agents", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
	policy := rec.Header().Get("Content-Security-Policy")
	for _, hash := range inlineScriptHashes(body) {
		if !strings.Contains(policy, hash) {
			t.Fatalf("served policy does not allow the script it just served: %s", policy)
		}
	}
}
