package providers

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

// ProviderConfig is one configured AI provider (multi-provider support).
type ProviderConfig struct {
	ID             string   `json:"id"`
	Provider       string   `json:"provider"`
	BaseURL        string   `json:"base_url"`
	APIKey         string   `json:"api_key"`
	Models         []string `json:"models"`
	DisabledModels []string `json:"disabled_models,omitempty"`
	DefaultModel   string   `json:"default_model"`
	Enabled        bool     `json:"enabled"`
}

// IsModelEnabled reports whether a model is active on this provider.
func (p ProviderConfig) IsModelEnabled(modelID string) bool {
	for _, d := range p.DisabledModels {
		if d == modelID {
			return false
		}
	}
	return true
}

// EnabledModels returns models with per-model toggles applied.
func (p ProviderConfig) EnabledModels() []string {
	out := make([]string, 0, len(p.Models))
	for _, m := range p.Models {
		if p.IsModelEnabled(m) {
			out = append(out, m)
		}
	}
	return out
}

// File is the on-disk providers.json shape.
type File struct {
	DefaultProviderID string           `json:"default_provider_id"`
	DefaultModel      string           `json:"default_model"`
	Providers         []ProviderConfig `json:"providers"`
}

// normalizeBaseURL trims whitespace and trailing slashes so the same endpoint
// written as "http://host/v1" and "http://host/v1/" compares equal.
func normalizeBaseURL(u string) string {
	return strings.TrimRight(strings.TrimSpace(u), "/")
}

func unionStrings(lists ...[]string) []string {
	var out []string
	seen := map[string]bool{}
	for _, list := range lists {
		for _, s := range list {
			if s == "" || seen[s] {
				continue
			}
			seen[s] = true
			out = append(out, s)
		}
	}
	return out
}

func contains(list []string, s string) bool {
	for _, x := range list {
		if x == s {
			return true
		}
	}
	return false
}

// dedupeFile collapses providers that share provider+base_url. The default
// provider wins as survivor (otherwise the first entry); model lists are unioned.
// Returns whether anything changed.
func dedupeFile(f *File) bool {
	if len(f.Providers) < 2 {
		return false
	}
	order := []string{}
	groups := map[string][]ProviderConfig{}
	for _, p := range f.Providers {
		key := p.Provider + "|" + normalizeBaseURL(p.BaseURL)
		if _, ok := groups[key]; !ok {
			order = append(order, key)
		}
		groups[key] = append(groups[key], p)
	}
	changed := false
	out := make([]ProviderConfig, 0, len(order))
	for _, key := range order {
		items := groups[key]
		if len(items) == 1 {
			out = append(out, items[0])
			continue
		}
		changed = true
		survivor := items[0]
		for _, it := range items {
			if it.ID == f.DefaultProviderID {
				survivor = it
				break
			}
		}
		var models, disabled []string
		for _, it := range items {
			models = unionStrings(models, it.Models)
			disabled = unionStrings(disabled, it.DisabledModels)
		}
		survivor.Models = models
		for _, d := range disabled {
			if contains(models, d) && !contains(survivor.DisabledModels, d) {
				survivor.DisabledModels = append(survivor.DisabledModels, d)
			}
		}
		out = append(out, survivor)
	}
	f.Providers = out
	if f.DefaultProviderID != "" {
		found := false
		for _, p := range out {
			if p.ID == f.DefaultProviderID {
				found = true
				break
			}
		}
		if !found {
			if len(out) > 0 {
				f.DefaultProviderID = out[0].ID
			} else {
				f.DefaultProviderID = ""
			}
		}
	}
	return changed
}

// Store persists multi-provider config under data/providers.json.
type Store struct {
	mu   sync.RWMutex
	path string
	data File
}

// NewStore loads (or initializes) the providers store.
func NewStore(path string) *Store {
	s := &Store{path: path, data: File{Providers: []ProviderConfig{}}}
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
	var f File
	if err := json.Unmarshal(b, &f); err != nil {
		return
	}
	if f.Providers == nil {
		f.Providers = []ProviderConfig{}
	}
	s.data = f
	if dedupeFile(&s.data) {
		// Persist the merged file so stale duplicates do not resurface.
		_ = s.saveLocked()
	}
}

func (s *Store) saveLocked() error {
	if s.path == "" {
		return nil
	}
	if err := os.MkdirAll(filepath.Dir(s.path), 0o755); err != nil {
		return err
	}
	b, err := json.MarshalIndent(s.data, "", "  ")
	if err != nil {
		return err
	}
	// Write to a temporary file and rename so a crash never leaves half a JSON file.
	temporary := s.path + ".tmp"
	if err := os.WriteFile(temporary, b, 0o600); err != nil {
		return err
	}
	return os.Rename(temporary, s.path)
}

// Snapshot returns a copy of the current config (API keys included for admin UI).
func (s *Store) Snapshot() File {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := File{
		DefaultProviderID: s.data.DefaultProviderID,
		DefaultModel:      s.data.DefaultModel,
		Providers:         append([]ProviderConfig{}, s.data.Providers...),
	}
	return out
}

// Replace overwrites the entire store.
func (s *Store) Replace(f File) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if f.Providers == nil {
		f.Providers = []ProviderConfig{}
	}
	dedupeFile(&f)
	s.data = f
	return s.saveLocked()
}

// Upsert adds or updates a provider by id. When the id is unknown but another
// entry points at the same endpoint (provider + base_url), that entry is
// updated instead of appending a duplicate row.
func (s *Store) Upsert(p ProviderConfig) error {
	if p.ID == "" {
		return fmt.Errorf("provider id is required")
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	found := false
	for i := range s.data.Providers {
		if s.data.Providers[i].ID == p.ID {
			s.data.Providers[i] = p
			found = true
			break
		}
	}
	if !found {
		key := normalizeBaseURL(p.BaseURL)
		for i := range s.data.Providers {
			existing := &s.data.Providers[i]
			if existing.Provider != p.Provider || normalizeBaseURL(existing.BaseURL) != key {
				continue
			}
			p.ID = existing.ID
			models := unionStrings(existing.Models, p.Models)
			disabled := unionStrings(existing.DisabledModels, p.DisabledModels)
			p.Models = models
			p.DisabledModels = nil
			for _, d := range disabled {
				if contains(models, d) {
					p.DisabledModels = append(p.DisabledModels, d)
				}
			}
			*existing = p
			found = true
			break
		}
	}
	if !found {
		s.data.Providers = append(s.data.Providers, p)
	}
	if s.data.DefaultProviderID == "" {
		s.data.DefaultProviderID = p.ID
	}
	if s.data.DefaultModel == "" && p.DefaultModel != "" {
		s.data.DefaultModel = p.DefaultModel
	}
	return s.saveLocked()
}

// Delete removes a provider by id.
func (s *Store) Delete(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	next := s.data.Providers[:0]
	for _, p := range s.data.Providers {
		if p.ID != id {
			next = append(next, p)
		}
	}
	s.data.Providers = next
	if s.data.DefaultProviderID == id {
		s.data.DefaultProviderID = ""
		if len(s.data.Providers) > 0 {
			s.data.DefaultProviderID = s.data.Providers[0].ID
		}
	}
	return s.saveLocked()
}

// SetDefaults sets default provider/model.
func (s *Store) SetDefaults(providerID, model string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data.DefaultProviderID = providerID
	s.data.DefaultModel = model
	return s.saveLocked()
}

// ResolveModel finds credentials for a model_id (or the default when empty).
// Returns provider, baseURL, apiKey, modelID.
func (s *Store) ResolveModel(modelID string) (provider, baseURL, apiKey, resolved string, ok bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Prefer default when modelID empty
	if modelID == "" {
		modelID = s.data.DefaultModel
		if modelID == "" {
			// pick first model of default provider
			for _, p := range s.data.Providers {
				if p.ID == s.data.DefaultProviderID || s.data.DefaultProviderID == "" {
					if len(p.Models) > 0 {
						modelID = p.Models[0]
						if p.DefaultModel != "" {
							modelID = p.DefaultModel
						}
						return p.Provider, p.BaseURL, p.APIKey, modelID, true
					}
				}
			}
			if len(s.data.Providers) > 0 {
				p := s.data.Providers[0]
				if len(p.Models) > 0 {
					m := p.DefaultModel
					if m == "" {
						m = p.Models[0]
					}
					return p.Provider, p.BaseURL, p.APIKey, m, true
				}
			}
			return "", "", "", "", false
		}
	}

	// Find model in any provider (skip per-model disabled entries)
	for _, p := range s.data.Providers {
		for _, m := range p.Models {
			if m == modelID && p.IsModelEnabled(m) {
				return p.Provider, p.BaseURL, p.APIKey, modelID, true
			}
		}
		if p.DefaultModel == modelID && p.IsModelEnabled(modelID) {
			return p.Provider, p.BaseURL, p.APIKey, modelID, true
		}
	}

	// Fallback: default provider first model
	for _, p := range s.data.Providers {
		if p.ID == s.data.DefaultProviderID && len(p.Models) > 0 {
			m := p.DefaultModel
			if m == "" {
				m = p.Models[0]
			}
			return p.Provider, p.BaseURL, p.APIKey, m, true
		}
	}
	return "", "", "", "", false
}

// AllModels returns every enabled model id (for ChooseModels catalog).
func (s *Store) AllModels() []string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	var out []string
	seen := map[string]bool{}
	for _, p := range s.data.Providers {
		for _, m := range p.EnabledModels() {
			if !seen[m] {
				seen[m] = true
				out = append(out, m)
			}
		}
	}
	return out
}

// Catalog returns model entries with provider metadata for mocr ChooseModels.
type CatalogEntry struct {
	ID               string `json:"id"`
	Provider         string `json:"provider"`
	SupportsThinking bool   `json:"supports_thinking"`
}

// Catalog returns the enabled model catalog (deduped by model id).
func (s *Store) Catalog() []CatalogEntry {
	s.mu.RLock()
	defer s.mu.RUnlock()
	seen := map[string]bool{}
	var out []CatalogEntry
	for _, p := range s.data.Providers {
		for _, m := range p.EnabledModels() {
			if seen[m] {
				continue
			}
			seen[m] = true
			thinking := strings.Contains(strings.ToLower(m), "o1") ||
				strings.Contains(strings.ToLower(m), "reasoner") ||
				strings.Contains(strings.ToLower(m), "think")
			out = append(out, CatalogEntry{
				ID:               m,
				Provider:         p.Provider,
				SupportsThinking: thinking,
			})
		}
	}
	return out
}
