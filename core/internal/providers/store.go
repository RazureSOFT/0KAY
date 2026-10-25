package providers

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"0kay/core/internal/atomicio"
)

type ProviderConfig struct {
	ID             string            `json:"id"`
	Provider       string            `json:"provider"`
	Name           string            `json:"name,omitempty"`
	BaseURL        string            `json:"base_url"`
	APIKey         string            `json:"api_key"`
	APIKeyMasked   string            `json:"api_key_masked,omitempty"`
	Models         []string          `json:"models"`
	DisabledModels []string          `json:"disabled_models,omitempty"`
	DefaultModel   string            `json:"default_model"`
	Enabled        bool              `json:"enabled"`
	ModelTypes     map[string]string `json:"model_types,omitempty"`
	Format         string            `json:"format,omitempty"`
}

func (p ProviderConfig) EffectiveProvider() string {
	if f := strings.ToLower(strings.TrimSpace(p.Format)); f != "" {
		return f
	}
	return p.Provider
}

const maskFiller = "************"

func MaskKey(key string) string {
	if key == "" {
		return ""
	}
	if len(key) <= 8 {
		return strings.Repeat("*", len(key))
	}
	return key[:4] + maskFiller + key[len(key)-4:]
}

func IsMasked(v, key string) bool {
	if v == "" {
		return true
	}
	if key != "" {
		return v == MaskKey(key)
	}
	if strings.Contains(v, maskFiller) {
		return true
	}
	return strings.Trim(v, "*") == ""
}

func (p ProviderConfig) ModelType(modelID string) string {
	if value := strings.TrimSpace(p.ModelTypes[modelID]); value != "" {
		return strings.ToLower(value)
	}
	return "chat"
}

func (p ProviderConfig) IsModelEnabled(modelID string) bool {
	for _, d := range p.DisabledModels {
		if d == modelID {
			return false
		}
	}
	return true
}

func (p ProviderConfig) EnabledModels() []string {
	out := make([]string, 0, len(p.Models))
	for _, m := range p.Models {
		if p.IsModelEnabled(m) {
			out = append(out, m)
		}
	}
	return out
}

type File struct {
	DefaultProviderID string           `json:"default_provider_id"`
	DefaultModel      string           `json:"default_model"`
	Providers         []ProviderConfig `json:"providers"`
}

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

type Store struct {
	mu   sync.RWMutex
	path string
	data File
}

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
	return atomicio.WriteFileAtomic(s.path, b, 0o600)
}

func (s *Store) Snapshot() File {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return redactFile(s.data)
}

func (s *Store) SnapshotRaw() File {
	s.mu.RLock()
	defer s.mu.RUnlock()
	providers := make([]ProviderConfig, len(s.data.Providers))
	for i, p := range s.data.Providers {
		p.Models = append([]string(nil), p.Models...)
		p.DisabledModels = append([]string(nil), p.DisabledModels...)
		if p.ModelTypes != nil {
			types := make(map[string]string, len(p.ModelTypes))
			for key, value := range p.ModelTypes {
				types[key] = value
			}
			p.ModelTypes = types
		}
		providers[i] = p
	}
	return File{
		DefaultProviderID: s.data.DefaultProviderID,
		DefaultModel:      s.data.DefaultModel,
		Providers:         providers,
	}
}

func (s *Store) Secret(id string) string {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, p := range s.data.Providers {
		if p.ID == id {
			return p.APIKey
		}
	}
	return ""
}

func redactFile(f File) File {
	out := File{
		DefaultProviderID: f.DefaultProviderID,
		DefaultModel:      f.DefaultModel,
		Providers:         make([]ProviderConfig, 0, len(f.Providers)),
	}
	for _, p := range f.Providers {
		out.Providers = append(out.Providers, redactProvider(p))
	}
	return out
}

func redactProvider(p ProviderConfig) ProviderConfig {
	p.Models = append([]string(nil), p.Models...)
	p.DisabledModels = append([]string(nil), p.DisabledModels...)
	if p.ModelTypes != nil {
		types := make(map[string]string, len(p.ModelTypes))
		for key, value := range p.ModelTypes {
			types[key] = value
		}
		p.ModelTypes = types
	}
	if p.APIKey != "" {
		p.APIKeyMasked = MaskKey(p.APIKey)
	}
	p.APIKey = ""
	return p
}

func preserveSecret(incoming *ProviderConfig, existing string) {
	if IsMasked(incoming.APIKey, existing) {
		incoming.APIKey = existing
	}
	incoming.APIKeyMasked = ""
}

func (s *Store) Replace(f File) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if f.Providers == nil {
		f.Providers = []ProviderConfig{}
	}
	previous := map[string]string{}
	for _, p := range s.data.Providers {
		previous[p.ID] = p.APIKey
	}
	for i := range f.Providers {
		f.Providers[i].Format = strings.ToLower(strings.TrimSpace(f.Providers[i].Format))
		preserveSecret(&f.Providers[i], previous[f.Providers[i].ID])
	}
	dedupeFile(&f)
	s.data = f
	return s.saveLocked()
}

func (s *Store) Upsert(p ProviderConfig) error {
	if p.ID == "" {
		return fmt.Errorf("provider id is required")
	}
	p.Format = strings.ToLower(strings.TrimSpace(p.Format))
	s.mu.Lock()
	defer s.mu.Unlock()
	found := false
	for i := range s.data.Providers {
		if s.data.Providers[i].ID == p.ID {
			preserveSecret(&p, s.data.Providers[i].APIKey)
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
			preserveSecret(&p, existing.APIKey)
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

func (s *Store) SetDefaults(providerID, model string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.data.DefaultProviderID = providerID
	s.data.DefaultModel = model
	return s.saveLocked()
}

func (s *Store) ResolveModel(modelID string) (provider, baseURL, apiKey, resolved string, ok bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if modelID == "" {
		modelID = s.data.DefaultModel
		if modelID == "" {
			for _, p := range s.data.Providers {
				if p.ID == s.data.DefaultProviderID || s.data.DefaultProviderID == "" {
					if len(p.Models) > 0 {
						modelID = p.Models[0]
						if p.DefaultModel != "" {
							modelID = p.DefaultModel
						}
						return p.EffectiveProvider(), p.BaseURL, p.APIKey, modelID, true
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
					return p.EffectiveProvider(), p.BaseURL, p.APIKey, m, true
				}
			}
			return "", "", "", "", false
		}
	}

	for _, p := range s.data.Providers {
		for _, m := range p.Models {
			if m == modelID && p.IsModelEnabled(m) {
				return p.EffectiveProvider(), p.BaseURL, p.APIKey, modelID, true
			}
		}
		if p.DefaultModel == modelID && p.IsModelEnabled(modelID) {
			return p.EffectiveProvider(), p.BaseURL, p.APIKey, modelID, true
		}
	}

	for _, p := range s.data.Providers {
		if p.ID == s.data.DefaultProviderID && len(p.Models) > 0 {
			m := p.DefaultModel
			if m == "" {
				m = p.Models[0]
			}
			return p.EffectiveProvider(), p.BaseURL, p.APIKey, m, true
		}
	}
	return "", "", "", "", false
}

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

type CatalogEntry struct {
	ID               string `json:"id"`
	Provider         string `json:"provider"`
	ProviderID       string `json:"provider_id,omitempty"`
	ProviderName     string `json:"provider_name,omitempty"`
	SupportsThinking bool   `json:"supports_thinking"`
	Type             string `json:"type"`
}

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
				ProviderID:       p.ID,
				ProviderName:     p.Name,
				SupportsThinking: thinking,
				Type:             p.ModelType(m),
			})
		}
	}
	return out
}
