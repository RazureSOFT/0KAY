package gateway

import (
	"encoding/json"
	"net/http"

	"0kay/core/internal/update"
	"0kay/core/internal/version"
)

type updateCheck struct {
	Current   string `json:"current"`
	Latest    string `json:"latest,omitempty"`
	HasUpdate bool   `json:"has_update"`
	URL       string `json:"url,omitempty"`
}

type pluginUpdateCheck struct {
	Name       string `json:"name"`
	Version    string `json:"version"`
	Latest     string `json:"latest,omitempty"`
	HasUpdate  bool   `json:"has_update"`
	Repository string `json:"repository,omitempty"`
	Error      string `json:"error,omitempty"`
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func (g *Gateway) handleUpdateCheck(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	owner, repo := update.PlatformRepository()
	result := updateCheck{Current: version.Version}
	release, err := update.Latest(owner, repo)
	if err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
		return
	}
	if release != nil {
		result.Latest = update.Normalize(release.TagName)
		result.HasUpdate = update.Newer(release.TagName, version.Version)
		result.URL = release.HTMLURL
	}
	writeJSON(w, http.StatusOK, result)
}

func (g *Gateway) handleUpdateCheckPlugins(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		w.Header().Set("Allow", http.MethodGet)
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	type repositoryRelease struct {
		owner, repo string
		release     *update.Release
		err         error
	}
	plugins := g.registry.GetAllPlugins()
	releases := map[string]*repositoryRelease{}
	seen := map[string]bool{}
	result := []pluginUpdateCheck{}
	for _, plugin := range plugins {
		if plugin.Info == nil || seen[plugin.Info.Name] {
			continue
		}
		seen[plugin.Info.Name] = true
		row := pluginUpdateCheck{Name: plugin.Info.Name, Version: plugin.Info.Version}
		owner, repo, known := update.RepositoryFor(plugin.Info.Name)
		if known {
			key := owner + "/" + repo
			state, ok := releases[key]
			if !ok {
				state = &repositoryRelease{owner: owner, repo: repo}
				state.release, state.err = update.Latest(owner, repo)
				releases[key] = state
			}
			row.Repository = "https://github.com/" + key
			if state.err != nil {
				row.Error = state.err.Error()
			} else if state.release != nil {
				row.Latest = update.Normalize(state.release.TagName)
				row.HasUpdate = update.Newer(state.release.TagName, plugin.Info.Version)
			}
		} else {
			row.Error = "unknown repository"
		}
		result = append(result, row)
	}
	writeJSON(w, http.StatusOK, map[string]any{"plugins": result})
}
