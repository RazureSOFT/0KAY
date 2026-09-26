package gateway

import (
	"net/http"
	"strings"

	"0kay/core/internal/settings"
	"0kay/core/internal/update"
)

// handleSettingsSections lists plugin-contributed settings sections.
// Sections owned by an admin-disabled plugin are omitted.
//
//	GET /api/settings/sections            → { sections: [...] }
//	GET /api/settings/sections?values=1   → { sections: [ {..., values: {...}} ] }
//
// The ?values=1 form exists so the settings page can render section values in
// one round trip instead of issuing one GET per section.
func (g *Gateway) handleSettingsSections(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	if g.settingsStore == nil {
		unavailable(w, "settings store not ready")
		return
	}
	withValues := r.URL.Query().Get("values") == "1"
	all := g.settingsStore.List()
	type sectionRow struct {
		settings.Section
		Values map[string]interface{} `json:"values,omitempty"`
	}
	out := make([]sectionRow, 0, len(all))
	for _, sec := range all {
		if sec.PluginName != "" && g.registry != nil && g.registry.IsDisabled(sec.PluginName) {
			continue
		}
		row := sectionRow{Section: sec}
		if withValues {
			row.Values = g.settingsStore.GetValues(sec.ID)
		}
		out = append(out, row)
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"sections": out})
}

// handleSettingsSection handles GET/POST values for /api/settings/{id}.
func (g *Gateway) handleSettingsSection(w http.ResponseWriter, r *http.Request) {
	if g.settingsStore == nil {
		unavailable(w, "settings store not ready")
		return
	}
	id := strings.TrimPrefix(r.URL.Path, "/api/settings/")
	if id == "" || id == "sections" {
		badRequest(w, "section id required")
		return
	}

	// Block access to sections owned by an admin-disabled plugin.
	if sec, ok := g.settingsStore.Get(id); ok && sec.PluginName != "" &&
		g.registry != nil && g.registry.IsDisabled(sec.PluginName) {
		writeErr(w, http.StatusForbidden, "section_disabled", "section disabled")
		return
	}

	switch r.Method {
	case http.MethodGet:
		sec, ok := g.settingsStore.Get(id)
		if !ok {
			notFound(w, "section not found")
			return
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"section": sec,
			"values":  g.settingsStore.GetValues(id),
		})

	case http.MethodPost, http.MethodPut:
		var body map[string]interface{}
		if !decodeBody(w, r, &body, maxSmallBody) {
			return
		}
		// accept either flat values or {values:{...}}
		vals := body
		if v, ok := body["values"].(map[string]interface{}); ok {
			vals = v
		}
		if err := g.settingsStore.SetValues(id, vals); err != nil {
			notFound(w, "section not found")
			return
		}
		// Plugin updates settings drive the global git mirror; push it live so
		// the next source sync / 0kay-pm run uses it without a restart.
		if id == "updates" {
			proxy, _ := g.settingsStore.GetValues("updates")["github_proxy"].(string)
			update.SetGitHubProxy(proxy)
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
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"section": mustSection(g, id),
			"values":  g.settingsStore.GetValues(id),
		})

	default:
		allowMethod(w, r, http.MethodGet, http.MethodPost, http.MethodPut)
	}
}

func mustSection(g *Gateway, id string) interface{} {
	if sec, ok := g.settingsStore.Get(id); ok {
		return sec
	}
	return nil
}
