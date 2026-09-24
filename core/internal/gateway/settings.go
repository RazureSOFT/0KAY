package gateway

import (
	"encoding/json"
	"net/http"
	"strings"

	"0kay/core/internal/settings"
)

// handleSettingsSections lists plugin-contributed settings sections.
// Sections owned by an admin-disabled plugin are omitted.
func (g *Gateway) handleSettingsSections(w http.ResponseWriter, r *http.Request) {
	if g.settingsStore == nil {
		http.Error(w, "settings store not ready", http.StatusServiceUnavailable)
		return
	}
	all := g.settingsStore.List()
	out := make([]settings.Section, 0, len(all))
	for _, sec := range all {
		if sec.PluginName != "" && g.registry != nil && g.registry.IsDisabled(sec.PluginName) {
			continue
		}
		out = append(out, sec)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"sections": out,
	})
}

// handleSettingsSection handles GET/POST values for /api/settings/{id}.
func (g *Gateway) handleSettingsSection(w http.ResponseWriter, r *http.Request) {
	if g.settingsStore == nil {
		http.Error(w, "settings store not ready", http.StatusServiceUnavailable)
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/settings/")
	if id == "" || id == "sections" {
		http.Error(w, "section id required", http.StatusBadRequest)
		return
	}

	// Block access to sections owned by an admin-disabled plugin.
	if sec, ok := g.settingsStore.Get(id); ok && sec.PluginName != "" &&
		g.registry != nil && g.registry.IsDisabled(sec.PluginName) {
		http.Error(w, "section disabled", http.StatusForbidden)
		return
	}

	switch r.Method {
	case http.MethodGet:
		sec, ok := g.settingsStore.Get(id)
		if !ok {
			http.Error(w, "section not found", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"section": sec,
			"values":  g.settingsStore.GetValues(id),
		})

	case http.MethodPost, http.MethodPut:
		var body map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}
		// accept either flat values or {values:{...}}
		vals := body
		if v, ok := body["values"].(map[string]interface{}); ok {
			vals = v
		}
		if err := g.settingsStore.SetValues(id, vals); err != nil {
			http.Error(w, "section not found", http.StatusNotFound)
			return
		}
		// Special-case life permissions mirror for backward compatibility
		if id == "life" && g.localCore != nil {
			p := g.localCore.GetPermissions()
			if v, ok := vals["screen_watch"].(bool); ok {
				p.ScreenWatch = v
			}
			if v, ok := vals["computer_use"].(bool); ok {
				p.ComputerUse = v
			}
			if v, ok := vals["report_agent_host"].(string); ok {
				p.ReportAgentHost = v
			}
			g.localCore.SetPermissions(p)
			g.forwardLifePermissions(p)
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"section": mustSection(g, id),
			"values":  g.settingsStore.GetValues(id),
		})

	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func mustSection(g *Gateway, id string) interface{} {
	if sec, ok := g.settingsStore.Get(id); ok {
		return sec
	}
	return nil
}
