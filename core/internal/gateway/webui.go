package gateway

import (
	"crypto/sha256"
	"encoding/base64"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

// The packaged desktop/TUI builds ship the built WebUI next to Core and set
// CORE_WEBUI_DIR. Serving it from the same origin as /api removes the dev
// proxy (Vite) or reverse proxy (nginx) from the runtime, so a native install
// is one process and one port. A source checkout leaves it unset and behaves
// exactly as before.
func webuiDir() string {
	return strings.TrimSpace(os.Getenv("CORE_WEBUI_DIR"))
}

// Only files Vite emitted under assets/ carry a content hash in the filename.
// Public files (favicon, live2d models) keep a stable name and must revalidate.
func webuiAssetCacheable(rel string) bool {
	base := path.Base(rel)
	return strings.HasPrefix(rel, "assets/") && strings.Contains(base, "-")
}

func (g *Gateway) handleWebUI(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	root := webuiDir()
	if root == "" {
		http.NotFound(w, r)
		return
	}
	// API, WebSocket and model routes are owned by their handlers. A miss on
	// those must stay a 404 instead of returning the SPA shell, which would
	// turn a typo'd API call into a confusing 200.
	for _, prefix := range []string{"/api", "/ws", "/live2d", "/health"} {
		if r.URL.Path == prefix || strings.HasPrefix(r.URL.Path, prefix+"/") {
			http.NotFound(w, r)
			return
		}
	}

	rootAbs, err := filepath.Abs(root)
	if err != nil {
		http.NotFound(w, r)
		return
	}
	clean := path.Clean("/" + r.URL.Path)
	rel := strings.TrimPrefix(clean, "/")
	full := filepath.Join(rootAbs, filepath.FromSlash(rel))
	if full != rootAbs && !strings.HasPrefix(full, rootAbs+string(filepath.Separator)) {
		http.NotFound(w, r)
		return
	}

	setWebUIHeaders(w)
	if info, statErr := os.Stat(full); statErr == nil && !info.IsDir() {
		if webuiAssetCacheable(rel) {
			w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
		} else {
			w.Header().Set("Cache-Control", "no-cache")
		}
		// index.html may be requested directly at /index.html, in which case it
		// is served here rather than by the SPA fallback below; its inline
		// scripts need the same policy either way.
		if rel == "index.html" {
			if body, readErr := os.ReadFile(full); readErr == nil {
				serveShell(w, r, body)
				return
			}
		}
		http.ServeFile(w, r, full)
		return
	}

	// SPA routes (/pet, /agents, ...) are handled by the client router. A
	// missing file with an extension is a real miss, not a route.
	if filepath.Ext(rel) != "" {
		http.NotFound(w, r)
		return
	}
	index := filepath.Join(rootAbs, "index.html")
	body, readErr := os.ReadFile(index)
	if readErr != nil {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Cache-Control", "no-cache")
	serveShell(w, r, body)
}

// serveShell writes index.html with a policy derived from its own contents.
func serveShell(w http.ResponseWriter, r *http.Request, body []byte) {
	w.Header().Set("Content-Security-Policy", webuiCSP(string(body)))
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(http.StatusOK)
	if r.Method == http.MethodHead {
		return
	}
	w.Write(body)
}

func setWebUIHeaders(w http.ResponseWriter) {
	h := w.Header()
	h.Set("X-Content-Type-Options", "nosniff")
	h.Set("X-Frame-Options", "DENY")
	h.Set("Referrer-Policy", "strict-origin-when-cross-origin")
	h.Set("Content-Security-Policy", webuiCSP(""))
}

// The shell carries a few inline scripts — the pre-paint theme and language
// choice, and the boot shim — that have to run before any module loads. They
// cannot move to files without losing that property.
//
// Their hashes used to be written into the header by hand. That works exactly
// until someone edits index.html, at which point every inline script is blocked
// and the window is blank with nothing in the console but a CSP rule. So the
// hashes are computed from the file being served, on the way out: the policy and
// the document cannot disagree.
func webuiCSP(html string) string {
	scriptSrc := "'self'"
	for _, hash := range inlineScriptHashes(html) {
		scriptSrc += " '" + hash + "'"
	}
	return "default-src 'self'; script-src " + scriptSrc + "; " +
		"style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; " +
		"font-src 'self' data:; " +
		"connect-src 'self' ws: wss: https://api.github.com https://raw.githubusercontent.com; " +
		"worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'"
}

// inlineScriptHashes returns sha256-… for every <script> in the document that
// has no src. A malformed or empty body is skipped: an empty hash would be a
// hash of nothing, which is not a policy anyone asked for.
func inlineScriptHashes(html string) []string {
	if html == "" {
		return nil
	}
	var out []string
	lower := strings.ToLower(html)
	for cursor := 0; ; {
		open := strings.Index(lower[cursor:], "<script")
		if open < 0 {
			break
		}
		open += cursor
		tagEnd := strings.IndexByte(lower[open:], '>')
		if tagEnd < 0 {
			break
		}
		tagEnd += open
		opening := lower[open : tagEnd+1]
		closeRel := strings.Index(lower[tagEnd+1:], "</script>")
		if closeRel < 0 {
			break
		}
		body := html[tagEnd+1 : tagEnd+1+closeRel]
		cursor = tagEnd + 1 + closeRel + len("</script>")
		if strings.Contains(opening, "src=") {
			continue
		}
		// A type attribute decides whether the browser executes the block.
		// An importmap is executed (it configures module resolution), so it
		// needs a hash exactly like a classic script; a data block does not.
		if typeStart := strings.Index(opening, "type="); typeStart >= 0 {
			rest := opening[typeStart+len("type="):]
			rest = strings.TrimLeft(rest, `"' `)
			end := strings.IndexAny(rest, `"' >`)
			if end >= 0 {
				rest = rest[:end]
			}
			kind := strings.ToLower(strings.TrimSpace(rest))
			executable := kind == "" ||
				strings.Contains(kind, "javascript") ||
				strings.Contains(kind, "ecmascript") ||
				strings.Contains(kind, "module") ||
				strings.Contains(kind, "importmap")
			if !executable {
				continue
			}
		}
		sum := sha256.Sum256([]byte(body))
		out = append(out, "sha256-"+base64.StdEncoding.EncodeToString(sum[:]))
	}
	return out
}
