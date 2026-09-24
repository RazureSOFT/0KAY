package settings

import (
	"encoding/json"
	"os"
	"path/filepath"
	"sync"
)

// Field is one declarative settings field.
type Field struct {
	Key          string   `json:"key"`
	Type         string   `json:"type"`
	Label        string   `json:"label"`
	DefaultValue string   `json:"default_value"`
	Options      []string `json:"options,omitempty"`
	Help         string   `json:"help,omitempty"`
}

// Section is a plugin-contributed settings tab.
type Section struct {
	ID          string  `json:"id"`
	Label       string  `json:"label"`
	Icon        string  `json:"icon,omitempty"`
	Order       int32   `json:"order"`
	Description string  `json:"description,omitempty"`
	Fields      []Field `json:"fields"`
	PluginID    string  `json:"plugin_id,omitempty"`
	PluginName  string  `json:"plugin_name,omitempty"`
}

// Store holds registered sections + saved values.
type Store struct {
	mu       sync.RWMutex
	path     string
	sections map[string]Section
	values   map[string]map[string]interface{} // sectionID -> key -> value
}

// NewStore loads persisted values from disk.
func NewStore(path string) *Store {
	s := &Store{
		path:     path,
		sections: map[string]Section{},
		values:   map[string]map[string]interface{}{},
	}
	s.load()
	return s
}

func (s *Store) load() {
	if s.path == "" {
		return
	}
	b, err := os.ReadFile(s.path)
	if err != nil {
		return
	}
	var payload struct {
		Values map[string]map[string]interface{} `json:"values"`
	}
	if err := json.Unmarshal(b, &payload); err != nil {
		return
	}
	if payload.Values != nil {
		s.values = payload.Values
	}
}

func (s *Store) saveLocked() error {
	if s.path == "" {
		return nil
	}
	if err := os.MkdirAll(filepath.Dir(s.path), 0o755); err != nil {
		return err
	}
	b, err := json.MarshalIndent(map[string]interface{}{"values": s.values}, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.path, b, 0o600)
}

// RegisterSection adds/replaces a section contributed by a plugin.
func (s *Store) RegisterSection(sec Section) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.sections[sec.ID] = sec

	// seed defaults for missing keys
	if _, ok := s.values[sec.ID]; !ok {
		s.values[sec.ID] = map[string]interface{}{}
	}
	for _, f := range sec.Fields {
		if _, ok := s.values[sec.ID][f.Key]; !ok && f.DefaultValue != "" {
			switch f.Type {
			case "bool":
				s.values[sec.ID][f.Key] = f.DefaultValue == "true" || f.DefaultValue == "1"
			case "number":
				var n float64
				if err := json.Unmarshal([]byte(f.DefaultValue), &n); err == nil {
					s.values[sec.ID][f.Key] = n
				} else {
					s.values[sec.ID][f.Key] = f.DefaultValue
				}
			default:
				s.values[sec.ID][f.Key] = f.DefaultValue
			}
		}
	}
	_ = s.saveLocked()
}

// UnregisterPluginSections removes sections owned by a plugin id.
func (s *Store) UnregisterPluginSections(pluginID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	for id, sec := range s.sections {
		if sec.PluginID == pluginID {
			delete(s.sections, id)
		}
	}
}

// List returns all sections sorted by order then id.
func (s *Store) List() []Section {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]Section, 0, len(s.sections))
	for _, sec := range s.sections {
		out = append(out, sec)
	}
	// simple insertion by order
	for i := 1; i < len(out); i++ {
		for j := i; j > 0 && out[j].Order < out[j-1].Order; j-- {
			out[j], out[j-1] = out[j-1], out[j]
		}
	}
	return out
}

// Get returns one section.
func (s *Store) Get(id string) (Section, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sec, ok := s.sections[id]
	return sec, ok
}

// GetValues returns saved values for a section (with defaults applied).
func (s *Store) GetValues(id string) map[string]interface{} {
	s.mu.RLock()
	defer s.mu.RUnlock()
	sec, ok := s.sections[id]
	if !ok {
		return map[string]interface{}{}
	}
	out := map[string]interface{}{}
	for _, f := range sec.Fields {
		switch f.Type {
		case "bool":
			out[f.Key] = false
		case "number":
			out[f.Key] = float64(0)
		default:
			out[f.Key] = ""
		}
		if f.DefaultValue != "" {
			switch f.Type {
			case "bool":
				out[f.Key] = f.DefaultValue == "true" || f.DefaultValue == "1"
			case "number":
				var n float64
				if err := json.Unmarshal([]byte(f.DefaultValue), &n); err == nil {
					out[f.Key] = n
				}
			default:
				out[f.Key] = f.DefaultValue
			}
		}
	}
	if saved, ok := s.values[id]; ok {
		for k, v := range saved {
			out[k] = v
		}
	}
	return out
}

// SetValues merges partial values into a section.
func (s *Store) SetValues(id string, vals map[string]interface{}) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if _, ok := s.sections[id]; !ok {
		return os.ErrNotExist
	}
	if s.values[id] == nil {
		s.values[id] = map[string]interface{}{}
	}
	for k, v := range vals {
		s.values[id][k] = v
	}
	return s.saveLocked()
}
