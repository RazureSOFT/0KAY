package gateway

import (
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
	if _, statErr := os.Stat(index); statErr != nil {
		http.NotFound(w, r)
		return
	}
	w.Header().Set("Cache-Control", "no-cache")
	http.ServeFile(w, r, index)
}

func setWebUIHeaders(w http.ResponseWriter) {
	h := w.Header()
	h.Set("X-Content-Type-Options", "nosniff")
	h.Set("X-Frame-Options", "DENY")
	h.Set("Referrer-Policy", "strict-origin-when-cross-origin")
	h.Set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'sha256-wN3WWRWGP7wKZRuoNamhg0C6dKUORsacwGyO+O5xUE4='; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self' data:; connect-src 'self' ws: wss: https://api.github.com https://raw.githubusercontent.com; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'")
}
