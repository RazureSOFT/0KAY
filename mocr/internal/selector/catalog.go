package selector

import (
	"bytes"
	_ "embed"
	"encoding/json"
	"strings"
	"sync"
)

// The model-routing catalog and the kNN training set are ported from the
// jev_router project (WorkBuddy AI/mocr_modelchooser): a catalog of ~356
// OpenRouter-sourced models with power/context/cost/tags plus a choice-style
// training set for "text -> (capability tags, difficulty)" inference.
// Both files are embedded so the gateway needs no sidecar process.

//go:embed data/catalog.json
var catalogJSON []byte

//go:embed data/train.jsonl
var trainJSONL []byte

// jevModel mirrors one catalog.json entry. Tags arrive as a JSON list and are
// indexed into TagSet after unmarshal.
type jevModel struct {
	Provider string   `json:"provider"`
	Power    float64  `json:"power"`
	Ctx      int64    `json:"ctx"`
	Cost     float64  `json:"cost"`
	Tags     []string `json:"tags"`
	Price    string   `json:"price"`
	Desc     string   `json:"desc"`

	TagSet map[string]struct{} `json:"-"`
}

type jevCatalog struct {
	keys   []string             // catalog keys in JSON order (pool=None determinism)
	byID   map[string]*jevModel // full id, e.g. "openai/gpt-6.1-sol-pro"
	byTail map[string]*jevModel // bare tail after the last '/', leading '~' stripped
	// byTailLoose additionally strips the OpenRouter "-latest" suffix so a
	// Core model named "deepseek-flash" still resolves to
	// "~deepseek/deepseek-flash-latest". Only consulted on exact-tail miss.
	byTailLoose map[string]*jevModel
}

var (
	catalogOnce sync.Once
	catalogRef  *jevCatalog
)

func loadCatalog() *jevCatalog {
	catalogOnce.Do(func() {
		cat := &jevCatalog{
			byID:        map[string]*jevModel{},
			byTail:      map[string]*jevModel{},
			byTailLoose: map[string]*jevModel{},
		}
		// Decode token-by-token to preserve the JSON key order: the router's
		// determinism on ties depends on the pool's original order.
		dec := json.NewDecoder(bytes.NewReader(catalogJSON))
		if tok, err := dec.Token(); err == nil {
			if delim, ok := tok.(json.Delim); ok && delim == '{' {
				for dec.More() {
					keyTok, err := dec.Token()
					if err != nil {
						break
					}
					key, _ := keyTok.(string)
					var m jevModel
					if err := dec.Decode(&m); err != nil {
						break
					}
					model := m
					model.TagSet = make(map[string]struct{}, len(model.Tags))
					for _, t := range model.Tags {
						model.TagSet[t] = struct{}{}
					}
					model.Tags = nil
					lower := strings.ToLower(key)
					cat.keys = append(cat.keys, key)
					if _, exists := cat.byID[lower]; !exists {
						cat.byID[lower] = &model
					}
					tail := idTail(key)
					if _, exists := cat.byTail[tail]; !exists {
						cat.byTail[tail] = &model
					}
					loose := strings.TrimSuffix(tail, "-latest")
					if _, exists := cat.byTailLoose[loose]; !exists {
						cat.byTailLoose[loose] = &model
					}
				}
			}
		}
		catalogRef = cat
	})
	return catalogRef
}

// idTail extracts the bare model name from a provider-prefixed catalog id
// ("openai/gpt-6-astra" -> "gpt-6-astra"), mirroring jev_router's alias tail
// (lower-cased, leading '~' stripped from approximated ids).
func idTail(id string) string {
	tail := id
	if i := strings.LastIndex(id, "/"); i >= 0 {
		tail = id[i+1:]
	}
	return strings.TrimLeft(strings.ToLower(tail), "~")
}

// lookup resolves a bare model id (Core's /api/models shape) to its catalog
// entry: exact tail first, then the "-latest"-tolerant index; ok=false when
// the catalog has no such model.
func (c *jevCatalog) lookup(bareID string) (*jevModel, bool) {
	id := strings.ToLower(strings.TrimSpace(bareID))
	if m, ok := c.byTail[id]; ok {
		return m, true
	}
	m, ok := c.byTailLoose[strings.TrimSuffix(id, "-latest")]
	return m, ok
}
