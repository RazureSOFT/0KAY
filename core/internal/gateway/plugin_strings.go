package gateway

import (
	"net/http"
	"path/filepath"

	"0kay/core/internal/i18n"
)

type pluginStringsResponse struct {
	Default string                       `json:"default"`
	Locales map[string]map[string]string `json:"locales"`
}

func (g *Gateway) handlePluginStrings(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet, http.MethodHead) {
		return
	}
	name := r.PathValue("name")
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

func cutBoth(value, prefix, suffix string) (string, bool) {
	if len(value) < len(prefix)+len(suffix) {
		return "", false
	}
	if value[:len(prefix)] != prefix || value[len(value)-len(suffix):] != suffix {
		return "", false
	}
	return value[len(prefix) : len(value)-len(suffix)], true
}
