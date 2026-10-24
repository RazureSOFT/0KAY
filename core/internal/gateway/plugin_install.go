package gateway

import (
	"encoding/json"
	"net/http"
	"strings"

	"0kay/core/internal/update"
)

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

func (g *Gateway) handlePluginCapabilities(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	writeJSON(w, http.StatusOK, update.PluginContributions())
}

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
