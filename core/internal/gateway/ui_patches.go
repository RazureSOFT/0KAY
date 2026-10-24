package gateway

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

type UIPatchFile struct {
	ID         string      `json:"id"`
	Name       string      `json:"name,omitempty"`
	Version    string      `json:"version,omitempty"`
	Plugin     string      `json:"plugin,omitempty"`
	Capability string      `json:"capability,omitempty"`
	Enabled    *bool       `json:"enabled,omitempty"`
	Patches    []UIPatchOp `json:"patches"`
}

type UIPatchOp struct {
	Target   string         `json:"target"`
	Op       string         `json:"op"`
	Anchor   string         `json:"anchor,omitempty"`
	Position string         `json:"position,omitempty"`
	ID       string         `json:"id,omitempty"`
	Item     map[string]any `json:"item,omitempty"`
}

type uiPatchStore struct {
	mu               sync.RWMutex
	dirs             []string
	patches          []UIPatchFile
	loaded           time.Time
	isPluginDisabled func(plugin string) bool
}

func NewUIPatchStore(dirs ...string) *uiPatchStore {
	s := &uiPatchStore{dirs: dirs}
	s.Reload()
	return s
}

func (s *uiPatchStore) SetPluginDisabledHook(fn func(plugin string) bool) {
	s.mu.Lock()
	s.isPluginDisabled = fn
	s.mu.Unlock()
}

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
