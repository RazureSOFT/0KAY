package gateway

import (
	"net/http"
	"path/filepath"

	"0kay/core/internal/i18n"
)

// pluginStringsResponse is the payload for GET /api/plugins/{name}/strings.
type pluginStringsResponse struct {
	// Default is the locale a bare `values` directory provides, so a client can
	// fall back even if it has no translation for the active locale.
	Default string `json:"default"`
	// Locales maps an app locale code to a flat `key -> value` map. Keys are
	// dotted and the client merges them under the plugin's namespace, so a plugin
	// string is addressed as `t('<plugin>.<key>')`.
	Locales map[string]map[string]string `json:"locales"`
}

// handlePluginStrings serves a plugin's string resources:
//
//	GET /api/plugins/{name}/strings
//
// The resources live next to the plugin's UI bundle
// (CORE_DATA_DIR/plugin-ui/{name}/strings/values*/strings.xml), which is where
// the plugin build already copies its ESM assets. A plugin that ships no
// strings is not an error at the transport level, but there is nothing to
// return, so it is a 404 — the same shape the UI route uses for a missing asset.
func (g *Gateway) handlePluginStrings(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet, http.MethodHead) {
		return
	}
	name := r.PathValue("name")
	// Fallback when invoked outside ServeMux (unit tests).
	if name == "" {
		const prefix = "/api/plugins/"
		const suffix = "/strings"
		rest := r.URL.Path
		if trimmed, ok := cutBoth(rest, prefix, suffix); ok {
			name = trimmed
		}
	}
	if !validPluginUIName(name) {
		notFound(w, "not found")
		return
	}
	if g.registry != nil && g.registry.IsDisabled(name) {
		notFound(w, "plugin disabled")
		return
	}

	root := filepath.Join(pluginUIRoot(name), "strings")
	bundle, err := i18n.LoadDir(root)
	if err != nil {
		// A malformed resource is a plugin bug worth surfacing, not a silent 404:
		// serving a partial bundle would render key paths in the UI.
		writeErr(w, http.StatusInternalServerError, "invalid_strings", err.Error())
		return
	}
	if len(bundle) == 0 {
		notFound(w, "no strings for this plugin")
		return
	}

	writeJSON(w, http.StatusOK, pluginStringsResponse{
		Default: i18n.DefaultLocale,
		Locales: bundle,
	})
}

// cutBoth trims prefix and suffix when both are present.
func cutBoth(value, prefix, suffix string) (string, bool) {
	if len(value) < len(prefix)+len(suffix) {
		return "", false
	}
	if value[:len(prefix)] != prefix || value[len(value)-len(suffix):] != suffix {
		return "", false
	}
	return value[len(prefix) : len(value)-len(suffix)], true
}
