package gateway

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// UIPatchFile is a single *.patch document loaded from disk.
// Format is JSON (despite the .patch extension) so plugins can drop files
// into CORE_DATA_DIR/ui/ or webui/patches/ without a build step.
type UIPatchFile struct {
	// ID uniquely identifies the patch (stable across restarts).
	ID string `json:"id"`
	// Name is a human-readable label.
	Name string `json:"name,omitempty"`
	// Version is optional semantic version.
	Version string `json:"version,omitempty"`
	// Plugin is the owning plugin name (optional).
	Plugin string `json:"plugin,omitempty"`
	// Capability is the registry capability required for this patch to show
	// (defaults to Plugin when empty; kept in data rather than hardcoded ids).
	Capability string `json:"capability,omitempty"`
	// Enabled toggles the patch without deleting the file.
	Enabled *bool `json:"enabled,omitempty"`
	// Patches is the ordered list of operations.
	Patches []UIPatchOp `json:"patches"`
}

// UIPatchOp is one mutation against a WebUI extension target.
//
// Targets:
//   - "nav"     — sidebar items in App.vue
//   - "router"  — extra SPA routes (component: "iframe" | "external" | path)
//   - "settings"— extra settings tabs (mirrors settings sections)
//   - "status"  — StatusPanel sections
type UIPatchOp struct {
	// Target is one of nav | router | settings | status.
	Target string `json:"target"`
	// Op is insert | remove | replace.
	Op string `json:"op"`
	// Anchor is the sibling id to insert relative to (builtin or prior patch id).
	Anchor string `json:"anchor,omitempty"`
	// Position is "before" | "after" (default after) for insert.
	Position string `json:"position,omitempty"`
	// ID identifies the item for remove/replace (and as nav item id).
	ID string `json:"id,omitempty"`
	// Item is the full object for insert/replace.
	Item map[string]any `json:"item,omitempty"`
}

type uiPatchStore struct {
	mu      sync.RWMutex
	dirs    []string
	patches []UIPatchFile
	loaded  time.Time
	// isPluginDisabled reports whether an owning plugin is admin-disabled.
	// When true, that plugin's patches are excluded from List/FlattenOps.
	isPluginDisabled func(plugin string) bool
}

// NewUIPatchStore creates a store that watches the given directories.
func NewUIPatchStore(dirs ...string) *uiPatchStore {
	s := &uiPatchStore{dirs: dirs}
	s.Reload()
	return s
}

// SetPluginDisabledHook wires registry.IsDisabled so disable toggles hide patches.
func (s *uiPatchStore) SetPluginDisabledHook(fn func(plugin string) bool) {
	s.mu.Lock()
	s.isPluginDisabled = fn
	s.mu.Unlock()
}

// Reload re-reads all *.patch files from disk.
func (s *uiPatchStore) Reload() {
	var out []UIPatchFile
	seen := map[string]bool{}

	for _, dir := range s.dirs {
		if dir == "" {
			continue
		}
		entries, err := os.ReadDir(dir)
		if err != nil {
			continue
		}
		for _, e := range entries {
			if e.IsDir() || !strings.HasSuffix(strings.ToLower(e.Name()), ".patch") {
				continue
			}
			path := filepath.Join(dir, e.Name())
			raw, err := os.ReadFile(path)
			if err != nil {
				continue
			}
			var f UIPatchFile
			if err := json.Unmarshal(raw, &f); err != nil {
				// Also accept a bare array of ops.
				var ops []UIPatchOp
				if err2 := json.Unmarshal(raw, &ops); err2 == nil && len(ops) > 0 {
					f = UIPatchFile{
						ID:      strings.TrimSuffix(e.Name(), filepath.Ext(e.Name())),
						Name:    e.Name(),
						Patches: ops,
					}
				} else {
					continue
				}
			}
			if f.ID == "" {
				f.ID = strings.TrimSuffix(e.Name(), filepath.Ext(e.Name()))
			}
			if seen[f.ID] {
				continue
			}
			seen[f.ID] = true
			out = append(out, f)
		}
	}

	s.mu.Lock()
	s.patches = out
	s.loaded = time.Now()
	s.mu.Unlock()
}

// List returns enabled patches (or all when includeDisabled).
// Patches owned by an admin-disabled plugin are always omitted.
func (s *uiPatchStore) List(includeDisabled bool) []UIPatchFile {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]UIPatchFile, 0, len(s.patches))
	for _, p := range s.patches {
		if !includeDisabled && p.Enabled != nil && !*p.Enabled {
			continue
		}
		if p.Plugin != "" && s.isPluginDisabled != nil && s.isPluginDisabled(p.Plugin) {
			continue
		}
		out = append(out, p)
	}
	return out
}

// FlattenOps returns all enabled ops in order (for WebUI apply).
func (s *uiPatchStore) FlattenOps() []map[string]any {
	patches := s.List(false)
	var ops []map[string]any
	for _, p := range patches {
		for _, op := range p.Patches {
			m := map[string]any{
				"patchId":    p.ID,
				"plugin":     p.Plugin,
				"capability": p.Capability,
				"target":     op.Target,
				"op":         op.Op,
				"anchor":     op.Anchor,
				"position":   op.Position,
				"id":         op.ID,
				"item":       op.Item,
			}
			ops = append(ops, m)
		}
	}
	return ops
}
