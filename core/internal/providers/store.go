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

// Provider kinds. A provider is not "a chat API" by definition: the same
// base_url + api_key pair can serve speech synthesis, transcription or image
// generation. The kind is what the rest of the system routes on, so it is a
// first-class field rather than something inferred from a model name.
const (
	KindLLM       = "llm"
	KindTTS       = "tts"
	KindASR       = "asr"
	KindImage     = "image"
	KindEmbedding = "embedding"
)

var knownKinds = map[string]bool{
	KindLLM:       true,
	KindTTS:       true,
	KindASR:       true,
	KindImage:     true,
	KindEmbedding: true,
}

// NormalizeKind maps the vocabulary people actually type onto the five kinds we
// route on. Anything unrecognised falls back to llm, which is what every
// provider record written before this field existed meant.
func NormalizeKind(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "llm", "chat", "text", "language", "completion":
		return KindLLM
	case "tts", "speech", "voice", "audio-out", "synthesis":
		return KindTTS
	case "asr", "stt", "transcribe", "transcription", "audio-in":
		return KindASR
	case "image", "img", "vision", "draw", "picture":
		return KindImage
	case "embedding", "embed", "embeddings":
		return KindEmbedding
	}
	return KindLLM
}

// ModelEntry carries the per-model facts the router needs without a network
// call: what kind of model it is, how much context it accepts, how much it can
// emit, and what it can do.
type ModelEntry struct {
	ID            string   `json:"id"`
	Kind          string   `json:"kind,omitempty"`
	ContextWindow int      `json:"context_window,omitempty"`
	MaxOutput     int      `json:"max_output,omitempty"`
	Capabilities  []string `json:"capabilities,omitempty"`
}

type ProviderConfig struct {
	ID             string            `json:"id"`
	Provider       string            `json:"provider"`
	Kind           string            `json:"kind,omitempty"`
	Name           string            `json:"name,omitempty"`
	BaseURL        string            `json:"base_url"`
	APIKey         string            `json:"api_key"`
	APIKeyMasked   string            `json:"api_key_masked,omitempty"`
	Models         []string          `json:"models"`
	Entries        []ModelEntry      `json:"entries,omitempty"`
	DisabledModels []string          `json:"disabled_models,omitempty"`
	DefaultModel   string            `json:"default_model"`
	Enabled        bool              `json:"enabled"`
	ModelTypes     map[string]string `json:"model_types,omitempty"`
	Format         string            `json:"format,omitempty"`
}

// EffectiveKind is the kind used for routing; empty means llm.
func (p ProviderConfig) EffectiveKind() string {
	if strings.TrimSpace(p.Kind) == "" {
		return KindLLM
	}
	return NormalizeKind(p.Kind)
}

// Entry returns the metadata for one model, if the provider knows it.
func (p ProviderConfig) Entry(modelID string) (ModelEntry, bool) {
	for _, entry := range p.Entries {
		if entry.ID == modelID {
			if entry.Kind == "" {
				entry.Kind = p.EffectiveKind()
			}
			return entry, true
		}
	}
	return ModelEntry{}, false
}

// reconcileEntries keeps Entries aligned with Models while preserving metadata
// someone already set (context window, capabilities). Called on every write path
// so the two lists cannot drift.
func reconcileEntries(p *ProviderConfig) bool {
	changed := false
	kind := p.EffectiveKind()
	if p.Kind != kind {
		p.Kind = kind
		changed = true
	}
	existing := make(map[string]ModelEntry, len(p.Entries))
	for _, entry := range p.Entries {
		if entry.ID != "" {
			existing[entry.ID] = entry
		}
	}
	next := make([]ModelEntry, 0, len(p.Models))
	for _, model := range p.Models {
		entry, ok := existing[model]
		if !ok {
			entry = ModelEntry{ID: model}
			if declared := strings.TrimSpace(p.ModelTypes[model]); declared != "" {
				entry.Kind = NormalizeKind(declared)
			} else {
				entry.Kind = kind
			}
			changed = true
		}
		if entry.Kind == "" {
			entry.Kind = kind
			changed = true
		}
		if len(entry.Capabilities) > 0 {
			entry.Capabilities = append([]string(nil), entry.Capabilities...)
		}
		next = append(next, entry)
	}
	if len(next) != len(p.Entries) {
		changed = true
	}
	if changed || len(next) > 0 {
		p.Entries = next
	}
	return changed
}

// migrate fills in kind and entries for records written before either existed.
// It reports whether anything changed so the caller can persist once.
func (f *File) migrate() bool {
	changed := false
	for i := range f.Providers {
		if reconcileEntries(&f.Providers[i]) {
			changed = true
		}
	}
	return changed
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

// mergeEntries unions two entry lists by id, keeping the richer record when both
// describe the same model.
func mergeEntries(into, from []ModelEntry) []ModelEntry {
	index := make(map[string]int, len(into))
	for i, entry := range into {
		index[entry.ID] = i
	}
	for _, entry := range from {
		if entry.ID == "" {
			continue
		}
		if at, ok := index[entry.ID]; ok {
			current := &into[at]
			if current.Kind == "" {
				current.Kind = entry.Kind
			}
			if current.ContextWindow == 0 {
				current.ContextWindow = entry.ContextWindow
			}
			if current.MaxOutput == 0 {
				current.MaxOutput = entry.MaxOutput
			}
			if len(current.Capabilities) == 0 && len(entry.Capabilities) > 0 {
				current.Capabilities = append([]string(nil), entry.Capabilities...)
			}
			continue
		}
		index[entry.ID] = len(into)
		into = append(into, entry)
	}
	return into
}

func cloneEntries(entries []ModelEntry) []ModelEntry {
	if entries == nil {
		return nil
	}
	out := make([]ModelEntry, len(entries))
	for i, entry := range entries {
		if len(entry.Capabilities) > 0 {
			entry.Capabilities = append([]string(nil), entry.Capabilities...)
		}
		out[i] = entry
	}
	return out
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
		entries := []ModelEntry{}
		for _, it := range items {
			models = unionStrings(models, it.Models)
			disabled = unionStrings(disabled, it.DisabledModels)
			entries = mergeEntries(entries, it.Entries)
		}
		survivor.Models = models
		survivor.Entries = entries
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
	changed := dedupeFile(&f)
	if f.migrate() {
		changed = true
	}
	s.data = f
	if changed {
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
		p.Entries = cloneEntries(p.Entries)
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
	p.Entries = cloneEntries(p.Entries)
	if p.Kind == "" {
		p.Kind = p.EffectiveKind()
	}
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
		reconcileEntries(&f.Providers[i])
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
	p.Kind = NormalizeKind(p.Kind)
	reconcileEntries(&p)
	s.mu.Lock()
	defer s.mu.Unlock()
	found := false
	for i := range s.data.Providers {
		if s.data.Providers[i].ID == p.ID {
			// A partial save (the UI sends what it knows) must not drop model
			// metadata it never mentioned — context windows in particular.
			p.Entries = mergeEntries(p.Entries, s.data.Providers[i].Entries)
			reconcileEntries(&p)
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
			p.Entries = mergeEntries(p.Entries, existing.Entries)
			reconcileEntries(&p)
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
	Kind             string `json:"kind,omitempty"`
	ContextWindow    int    `json:"context_window,omitempty"`
	MaxOutput        int    `json:"max_output,omitempty"`
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
			entry, _ := p.Entry(m)
			kind := entry.Kind
			if kind == "" {
				kind = p.EffectiveKind()
			}
			out = append(out, CatalogEntry{
				ID:               m,
				Provider:         p.Provider,
				ProviderID:       p.ID,
				ProviderName:     p.Name,
				SupportsThinking: thinking,
				Type:             p.ModelType(m),
				Kind:             kind,
				ContextWindow:    entry.ContextWindow,
				MaxOutput:        entry.MaxOutput,
			})
		}
	}
	return out
}

// ByKind lists providers that route one kind of traffic, in file order. Disabled
// providers are included so the settings UI can show and re-enable them; callers
// that are about to make a request should use DefaultForKind.
func (s *Store) ByKind(kind string) []ProviderConfig {
	want := NormalizeKind(kind)
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]ProviderConfig, 0, len(s.data.Providers))
	for _, p := range s.data.Providers {
		if p.EffectiveKind() == want {
			out = append(out, redactProvider(p))
		}
	}
	return out
}

// DefaultForKind returns the first enabled provider serving kind, with its
// secret intact. This is the lookup the gateway uses for TTS/ASR/image so those
// paths stop inventing their own settings keys.
func (s *Store) DefaultForKind(kind string) (ProviderConfig, bool) {
	want := NormalizeKind(kind)
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, p := range s.data.Providers {
		if p.EffectiveKind() != want || !p.Enabled {
			continue
		}
		p.Models = append([]string(nil), p.Models...)
		p.Entries = cloneEntries(p.Entries)
		return p, true
	}
	return ProviderConfig{}, false
}

// ContextWindow reports the context window declared for a model, or 0 when the
// provider does not know. The agent uses 0 as "infer it yourself".
func (s *Store) ContextWindow(modelID string) int {
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, p := range s.data.Providers {
		if entry, ok := p.Entry(modelID); ok && entry.ContextWindow > 0 {
			return entry.ContextWindow
		}
	}
	return 0
}
