package gateway

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

// pluginUIRoot resolves CORE_DATA_DIR/plugin-ui/{name} for browser-served ESM bundles.
func pluginUIRoot(name string) string {
	dataDir := os.Getenv("CORE_DATA_DIR")
	if dataDir == "" {
		dataDir = "data"
	}
	return filepath.Join(dataDir, "plugin-ui", name)
}

func validPluginUIName(name string) bool {
	if name == "" || len(name) > 64 {
		return false
	}
	for _, r := range name {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '-' || r == '_' {
			continue
		}
		return false
	}
	return true
}

// handlePluginUI serves static plugin front-end assets:
//
//	GET /api/plugins/{name}/ui/{path...}
//
// Assets live under CORE_DATA_DIR/plugin-ui/{name}/. Disabled plugins 404.
// Path traversal is rejected. Entry files use no-cache so patch module URLs
// can be updated; content-hashed chunks may be cached by the client.
func (g *Gateway) handlePluginUI(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodHead {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	name := r.PathValue("name")
	rel := r.PathValue("path")
	// Fallback when invoked outside ServeMux (unit tests).
	if name == "" || rel == "" {
		const prefix = "/api/plugins/"
		rest := strings.TrimPrefix(r.URL.Path, prefix)
		parts := strings.SplitN(rest, "/", 3)
		if len(parts) == 3 && parts[1] == "ui" {
			name, rel = parts[0], parts[2]
		}
	}
	if !validPluginUIName(name) || rel == "" {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	if g.registry != nil && g.registry.IsDisabled(name) {
		http.Error(w, "plugin disabled", http.StatusNotFound)
		return
	}

	root := pluginUIRoot(name)
	// Clean then ensure the resolved file stays under root.
	cleanRel := filepath.Clean("/" + filepath.FromSlash(rel))
	full := filepath.Join(root, cleanRel)
	rootAbs, err := filepath.Abs(root)
	if err != nil {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	fullAbs, err := filepath.Abs(full)
	if err != nil || (fullAbs != rootAbs && !strings.HasPrefix(fullAbs, rootAbs+string(filepath.Separator))) {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	info, err := os.Stat(fullAbs)
	if err != nil || info.IsDir() {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}

	// Hashed assets can cache; bare entry names must revalidate so module
	// URL changes (or rebuilds) are picked up without hard refresh.
	base := filepath.Base(fullAbs)
	if strings.Contains(base, "-") && (strings.HasSuffix(base, ".js") || strings.HasSuffix(base, ".css")) {
		w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
	} else {
		w.Header().Set("Cache-Control", "no-cache")
	}
	http.ServeFile(w, r, fullAbs)
}
