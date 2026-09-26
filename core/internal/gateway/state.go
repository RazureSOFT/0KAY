package gateway

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"sync"
	"time"

	corev1 "0kay/gen/core/v1"
)

// handleState returns the platform state that WebUI StatusPanel uses.
// Core is the single source of truth for agents/plugins/tasks;
// emotion/energy are optionally merged from Life via handleLifeState.
func (g *Gateway) handleState(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	plugins := g.registry.GetAllPlugins()
	healthy := 0
	for _, p := range plugins {
		if p.Status == corev1.PluginStatus_PLUGIN_STATUS_HEALTHY {
			healthy++
		}
	}
	onlineAgents := g.registry.CountOnlineAgents()
	allAgents := g.registry.GetAgents(false)
	agentIDs := make([]string, 0, len(allAgents))
	for _, a := range allAgents {
		agentIDs = append(agentIDs, a.PluginID)
	}

	var tasks []map[string]interface{}
	if g.localCore != nil {
		tasks = g.localCore.ListTasks()
	}
	taskIDs := make([]string, 0, len(tasks))
	for _, t := range tasks {
		if id, ok := t["id"].(string); ok && id != "" {
			taskIDs = append(taskIDs, id)
		} else if id, ok := t["task_id"].(string); ok && id != "" {
			taskIDs = append(taskIDs, id)
		}
	}

	state := map[string]interface{}{
		"source":         "core",
		"emotion":        map[string]float64{"valence": 0, "arousal": 0.5, "connection": 0.5, "irritation": 0},
		"mentalEnergy":   100.0,
		"isSleeping":     false,
		"activeTasks":    taskIDs,
		"onlineAgents":   onlineAgents,
		"totalAgents":    len(allAgents),
		"agentIds":       agentIDs,
		"pluginCount":    len(plugins),
		"healthyPlugins": healthy,
		"updatedAt":      time.Now().UTC().Format(time.RFC3339),
	}

	// Overlay Life emotion when the persona plugin is healthy.
	g.overlayLifeState(r, state)

	writeJSON(w, http.StatusOK, state)
}

// handleUIPatches serves flattened UI extension ops for WebUI.
// Sources: CORE_DATA_DIR/ui/*.patch and webui/patches/*.patch
func (g *Gateway) handleUIPatches(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		g.uiPatches.Reload()
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]any{"ok": true, "count": len(g.uiPatches.List(true))})
		return
	}

	// Hot-reload cheaply when files change (mtime scan every request is fine at UI scale).
	g.maybeReloadUIPatches()

	ops := g.uiPatches.FlattenOps()
	// Surface ops only when their owning plugin capability is registered
	// (capability defaults to plugin name; overrides live in patch data).
	filtered := make([]map[string]any, 0, len(ops))
	for _, op := range ops {
		capability, _ := op["capability"].(string)
		if capability == "" {
			capability, _ = op["plugin"].(string)
		}
		if capability != "" && len(g.registry.GetPluginsByCapability(capability)) == 0 {
			continue
		}
		filtered = append(filtered, op)
	}
	ops = filtered
	if ops == nil {
		ops = []map[string]any{}
	}
	files := g.uiPatches.List(true)
	names := make([]string, 0, len(files))
	for _, f := range files {
		names = append(names, f.ID)
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(map[string]any{
		"ops":    ops,
		"files":  names,
		"count":  len(ops),
		"loaded": g.uiPatches.loaded.UTC().Format(time.RFC3339),
	})
}

func (g *Gateway) uiPatchDirs() []string {
	var dirs []string
	dataDir := os.Getenv("CORE_DATA_DIR")
	if dataDir == "" {
		dataDir = "data"
	}
	dirs = append(dirs, filepath.Join(dataDir, "ui"))
	// Repo-relative webui patches (dev layout).
	if wd, err := os.Getwd(); err == nil {
		dirs = append(dirs,
			filepath.Join(wd, "ui"),
			filepath.Join(wd, "..", "webui", "patches"),
			filepath.Join(wd, "data", "ui"),
		)
	}
	return dirs
}

var (
	uiPatchMu       sync.Mutex
	uiPatchLastScan time.Time
)

func (g *Gateway) maybeReloadUIPatches() {
	uiPatchMu.Lock()
	defer uiPatchMu.Unlock()
	if time.Since(uiPatchLastScan) < 3*time.Second {
		return
	}
	uiPatchLastScan = time.Now()
	g.uiPatches.Reload()
}

// ensureUIPatchStore lazily constructs the patch store.
func (g *Gateway) ensureUIPatchStore() {
	if g.uiPatches != nil {
		return
	}
	uiPatchMu.Lock()
	defer uiPatchMu.Unlock()
	if g.uiPatches == nil {
		g.uiPatches = NewUIPatchStore(g.uiPatchDirs()...)
		g.uiPatches.SetPluginDisabledHook(func(plugin string) bool {
			return g.registry != nil && g.registry.IsDisabled(plugin)
		})
	}
}

// initUIPatches is called once from Handler setup paths.
func (g *Gateway) initUIPatches() {
	g.ensureUIPatchStore()
}
