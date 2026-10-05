package gateway

import (
	"context"
	"encoding/json"
	"net/http"
	"sort"
	"strings"
	"sync"
	"time"

	"0kay/core/internal/update"
	"0kay/core/internal/version"
)

// Update checks hit GitHub, so results are cached briefly and a batch of plugin
// checks is bounded in both concurrency and total time.
const (
	updateCacheTTL      = 5 * time.Minute
	updateErrorTTL      = 30 * time.Second
	updateFetchTimeout  = 20 * time.Second
	updateMaxConcurrent = 4
)

type repositoryRelease struct {
	release *update.Release
	err     error
}

type cachedRelease struct {
	release *update.Release
	err     error
	at      time.Time
}

var (
	releaseCacheMu sync.Mutex
	releaseCache   = map[string]cachedRelease{}
)

// latestCached returns the newest release for owner/repo, reusing a recent
// result so repeated checks (and repeated plugin rows) do not each hit GitHub.
func latestCached(ctx context.Context, owner, repo string) (*update.Release, error) {
	key := owner + "/" + repo
	releaseCacheMu.Lock()
	if entry, ok := releaseCache[key]; ok {
		ttl := updateCacheTTL
		if entry.err != nil {
			ttl = updateErrorTTL
		}
		if time.Since(entry.at) < ttl {
			releaseCacheMu.Unlock()
			return entry.release, entry.err
		}
	}
	releaseCacheMu.Unlock()
	release, err := update.LatestContext(ctx, owner, repo)
	// Do not cache our own deadline/cancellation: the next request should retry.
	if ctx.Err() == nil {
		releaseCacheMu.Lock()
		releaseCache[key] = cachedRelease{release: release, err: err, at: time.Now()}
		releaseCacheMu.Unlock()
	}
	return release, err
}

type updateCheck struct {
	Current         string `json:"current"`
	Latest          string `json:"latest,omitempty"`
	HasUpdate       bool   `json:"has_update"`
	URL             string `json:"url,omitempty"`
	Name            string `json:"name,omitempty"`
	Notes           string `json:"notes,omitempty"`
	PublishedAt     string `json:"published_at,omitempty"`
	SourceAvailable bool   `json:"source_available"`
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
	result := updateCheck{Current: version.Version, SourceAvailable: update.SourceAvailable()}
	ctx, cancel := context.WithTimeout(r.Context(), updateFetchTimeout)
	defer cancel()
	release, err := latestCached(ctx, owner, repo)
	if err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]string{"error": err.Error()})
		return
	}
	if release != nil {
		result.Latest = update.Normalize(release.TagName)
		result.HasUpdate = update.Newer(release.TagName, version.Version)
		result.URL = release.HTMLURL
		result.Name = release.Name
		result.Notes = release.Body
		result.PublishedAt = release.PublishedAt
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
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&req); err != nil {
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
	type component struct {
		name, version, pkg, repository string
	}
	seen := map[string]bool{}
	components := []component{}

	// add records one updatable component exactly once. Every installed
	// component is listed (registered plugins AND packages found in the source
	// checkout or installed through 0kay-pm), so the About page can update the
	// whole platform, not just services that happen to be running.
	add := func(name, version, pkg, repository string) {
		if name == "" || seen[name] {
			return
		}
		seen[name] = true
		components = append(components, component{name: name, version: version, pkg: pkg, repository: repository})
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

	// Resolve each distinct repository once, with bounded concurrency and a
	// single overall deadline so the fan-out cannot take minutes.
	type slug struct{ owner, repo string }
	unique := map[string]slug{}
	for _, c := range components {
		if owner, repo, ok := githubSlug(c.repository); ok {
			unique[owner+"/"+repo] = slug{owner: owner, repo: repo}
		}
	}
	releases := map[string]*repositoryRelease{}
	ctx, cancel := context.WithTimeout(r.Context(), updateFetchTimeout)
	defer cancel()
	var mu sync.Mutex
	var wg sync.WaitGroup
	sem := make(chan struct{}, updateMaxConcurrent)
	for key, s := range unique {
		wg.Add(1)
		go func(key string, s slug) {
			defer wg.Done()
			sem <- struct{}{}
			defer func() { <-sem }()
			release, err := latestCached(ctx, s.owner, s.repo)
			mu.Lock()
			releases[key] = &repositoryRelease{release: release, err: err}
			mu.Unlock()
		}(key, s)
	}
	wg.Wait()

	result := []pluginUpdateCheck{}
	for _, c := range components {
		row := pluginUpdateCheck{Name: c.name, Version: c.version, Package: c.pkg, Repository: c.repository, CanUpdate: update.CanUpdate(c.name)}
		if owner, repo, ok := githubSlug(c.repository); ok {
			if state := releases[owner+"/"+repo]; state != nil {
				if state.err != nil {
					row.Error = state.err.Error()
				} else if state.release != nil {
					row.Latest = update.Normalize(state.release.TagName)
					row.HasUpdate = update.Newer(state.release.TagName, c.version)
				}
			}
		} else if c.repository == "" {
			row.Error = "unknown repository"
		}
		result = append(result, row)
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
