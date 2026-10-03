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
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var req struct {
		Package string `json:"package"`
	}
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
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
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var req struct {
		Package string `json:"package"`
	}
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
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

// handlePluginCapabilities reports the capabilities contributed by installed
// packages (commands/skills/hooks/mcp_servers/agents), aggregated from their
// manifests so Agent, L.I.F.E. and the WebUI can consume them.
//
//	GET /api/plugins/capabilities
func (g *Gateway) handlePluginCapabilities(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	writeJSON(w, http.StatusOK, update.PluginContributions())
}

// handlePluginInstalled lists packages already installed via 0kay-pm, so the
// marketplace can mark them as installed.
//
//	GET /api/plugins/installed
func (g *Gateway) handlePluginInstalled(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
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
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	state := update.InstallStatus()
	if state.Status == "done" {
		g.uiPatches.Reload()
	}
	writeJSON(w, http.StatusOK, state)
}

// handlePMStatus reports the unified status of the most recent pm-plugin
// operation (install/uninstall/update), so all three install surfaces poll one
// endpoint.
//
//	GET /api/plugins/pm/status
func (g *Gateway) handlePMStatus(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	state := update.PMStatus()
	if state.Status == "done" {
		g.uiPatches.Reload()
	}
	writeJSON(w, http.StatusOK, state)
}
