package gateway

import (
	"encoding/json"
	"net/http"
	"strings"

	"0kay/core/internal/update"
)

// handlePluginInstall installs a third-party plugin with 0kay-pm.
//
//	POST /api/plugins/install  {"package":"owner/repo" | "@scope/name"}
func (g *Gateway) handlePluginInstall(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Package string `json:"package"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
		return
	}
	state, err := update.StartInstall(req.Package)
	if err != nil {
		status := http.StatusBadGateway
		switch {
		case strings.Contains(err.Error(), "already running"):
			status = http.StatusConflict
		case strings.Contains(err.Error(), "invalid package"):
			status = http.StatusBadRequest
		}
		writeJSON(w, status, map[string]any{"error": err.Error(), "state": state})
		return
	}
	writeJSON(w, http.StatusAccepted, state)
}

// handlePluginUninstall removes a plugin installed via 0kay-pm.
//
//	POST /api/plugins/uninstall  {"package":"owner/repo" | "@scope/name"}
func (g *Gateway) handlePluginUninstall(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		w.Header().Set("Allow", http.MethodPost)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	var req struct {
		Package string `json:"package"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
		return
	}
	if update.PlatformPackage(req.Package) {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "cannot uninstall a platform component"})
		return
	}
	state, err := update.StartUninstall(req.Package)
	if err != nil {
		status := http.StatusBadGateway
		switch {
		case strings.Contains(err.Error(), "already running"):
			status = http.StatusConflict
		case strings.Contains(err.Error(), "invalid package"):
			status = http.StatusBadRequest
		}
		writeJSON(w, status, map[string]any{"error": err.Error(), "state": state})
		return
	}
	writeJSON(w, http.StatusAccepted, state)
}

// handlePluginInstalled lists packages already installed via 0kay-pm, so the
// marketplace can mark them as installed.
//
//	GET /api/plugins/installed
func (g *Gateway) handlePluginInstalled(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	installed := update.InstalledPlugins()
	names := make([]string, 0, len(installed))
	for _, plugin := range installed {
		names = append(names, plugin.Name)
	}
	writeJSON(w, http.StatusOK, map[string]any{"packages": names, "installed": installed})
}

// handlePluginInstallStatus reports the latest install request and, once it
// finishes, reloads UI patches so a freshly installed plugin appears.
//
//	GET /api/plugins/install/status
func (g *Gateway) handlePluginInstallStatus(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	state := update.InstallStatus()
	if state.Status == "done" {
		g.uiPatches.Reload()
	}
	writeJSON(w, http.StatusOK, state)
}
