package gateway

import (
	"encoding/json"
	"net/http"
	"sort"
	"strings"

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
	Package    string `json:"package,omitempty"`
	CanUpdate  bool   `json:"can_update"`
	Error      string `json:"error,omitempty"`
}

func (g *Gateway) handleUpdateCheck(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
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

// handleUpdateApply starts a stop -> update -> start run for one component.
func (g *Gateway) handleUpdateApply(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var req struct {
		Plugin  string `json:"plugin"`
		Version string `json:"version"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid JSON body"})
		return
	}
	state, err := update.Start(req.Plugin, req.Version)
	if err != nil {
		status := http.StatusBadGateway
		switch {
		case strings.Contains(err.Error(), "already running"):
			status = http.StatusConflict
		case strings.Contains(err.Error(), "unsupported component"):
			status = http.StatusBadRequest
		}
		writeJSON(w, status, map[string]any{"error": err.Error(), "state": state})
		return
	}
	writeJSON(w, http.StatusAccepted, state)
}

// handleUpdateStatus reports the latest update request.
func (g *Gateway) handleUpdateStatus(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	writeJSON(w, http.StatusOK, update.State())
}

func (g *Gateway) handleUpdateCheckPlugins(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	type repositoryRelease struct {
		release *update.Release
		err     error
	}
	releases := map[string]*repositoryRelease{}
	seen := map[string]bool{}
	result := []pluginUpdateCheck{}

	// add records one updatable component exactly once. Every installed
	// component is listed (registered plugins AND packages found in the source
	// checkout or installed through 0kay-pm), so the About page can update the
	// whole platform, not just services that happen to be running.
	add := func(name, version, pkg, repository string) {
		if name == "" || seen[name] {
			return
		}
		seen[name] = true
		row := pluginUpdateCheck{Name: name, Version: version, Package: pkg, Repository: repository, CanUpdate: update.CanUpdate(name)}
		if owner, repo, ok := githubSlug(repository); ok {
			key := owner + "/" + repo
			state, cached := releases[key]
			if !cached {
				state = &repositoryRelease{}
				state.release, state.err = update.Latest(owner, repo)
				releases[key] = state
			}
			if state.err != nil {
				row.Error = state.err.Error()
			} else if state.release != nil {
				row.Latest = update.Normalize(state.release.TagName)
				row.HasUpdate = update.Newer(state.release.TagName, version)
			}
		} else if repository == "" {
			row.Error = "unknown repository"
		}
		result = append(result, row)
	}

	for _, plugin := range g.registry.GetAllPlugins() {
		if plugin.Info == nil || plugin.Info.Name == "" {
			continue
		}
		pkg, _ := update.PackageFor(plugin.Info.Name)
		repository, _ := update.RepositoryURL(plugin.Info.Name)
		add(plugin.Info.Name, plugin.Info.Version, pkg, repository)
	}
	for _, plugin := range update.InstalledPlugins() {
		name, ok := update.ComponentForPackage(plugin.Name)
		if !ok {
			continue
		}
		pkg := ""
		if update.PlatformPackage(plugin.Name) {
			pkg = plugin.Name
		}
		add(name, plugin.Version, pkg, plugin.Repository)
	}
	sort.Slice(result, func(i, j int) bool { return result[i].Name < result[j].Name })
	writeJSON(w, http.StatusOK, map[string]any{"plugins": result})
}

// githubSlug extracts owner/repo from a github.com repository URL.
func githubSlug(url string) (owner, repo string, ok bool) {
	url = strings.TrimSuffix(strings.TrimSpace(url), ".git")
	const prefix = "https://github.com/"
	if !strings.HasPrefix(url, prefix) {
		return "", "", false
	}
	parts := strings.Split(strings.TrimPrefix(url, prefix), "/")
	if len(parts) < 2 || parts[0] == "" || parts[1] == "" {
		return "", "", false
	}
	return parts[0], parts[1], true
}
