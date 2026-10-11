package selector

import (
	"fmt"
	"sort"
	"strings"

	prov "0kay/mocr/internal/providers"
)

// Selector selects the best think_model and output_model for a task.
//
// The selection logic is the jev_router model router (ported to Go and
// embedded): the prompt is classified into (capability tags, difficulty) by a
// char-3-gram kNN over the embedded training set with a keyword-heuristic
// fallback, then the cheapest pool model meeting the capability/difficulty
// bar wins, flavored by the configured strategy. Pool metadata comes from the
// embedded OpenRouter-sourced catalog (matched by bare model id); models the
// catalog does not know are synthesized conservative metadata.
type Selector struct{}

// NewSelector creates a new model selector.
func NewSelector() *Selector {
	return &Selector{}
}

// SelectionResult contains the selected models.
type SelectionResult struct {
	ThinkModel  prov.ModelInfo
	OutputModel prov.ModelInfo
	Reasoning   string
}

// Select chooses the best models based on context (hardcoded catalog fallback).
func (s *Selector) Select(prompt string, difficulty float64, requireThinking bool, maxTokens int, costBudget float64) *SelectionResult {
	allModels := append(prov.GetModels("openai"), prov.GetModels("anthropic")...)
	return s.selectFrom(allModels, "auto", prompt, difficulty, requireThinking, maxTokens, costBudget)
}

// SelectFrom chooses the best models from a caller-supplied catalog (Core /api/models).
func (s *Selector) SelectFrom(allModels []prov.ModelInfo, prompt string, difficulty float64, requireThinking bool, maxTokens int, costBudget float64) *SelectionResult {
	return s.SelectWithStrategy("auto", allModels, prompt, difficulty, requireThinking, maxTokens, costBudget)
}

// SelectWithStrategy applies a caller-chosen strategy (auto|quality|cost;
// balanced/speed pass through). The gRPC contract is unchanged — only the
// selection brain underneath moved to the jev router.
func (s *Selector) SelectWithStrategy(strategy string, allModels []prov.ModelInfo, prompt string, difficulty float64, requireThinking bool, maxTokens int, costBudget float64) *SelectionResult {
	if len(allModels) == 0 {
		allModels = append(prov.GetModels("openai"), prov.GetModels("anthropic")...)
	}
	return s.selectFrom(allModels, strategy, prompt, difficulty, requireThinking, maxTokens, costBudget)
}

func (s *Selector) selectFrom(allModels []prov.ModelInfo, strategy string, prompt string, difficulty float64, requireThinking bool, maxTokens int, costBudget float64) *SelectionResult {
	pool := enrichPool(allModels)
	thinkIdx, outIdx, rationale, ok := routeThinkOutput(pool, prompt, difficulty, requireThinking, strategy)
	if !ok {
		// Empty/unsatisfiable pool must never yield an empty response: keep the
		// historical "first model" last resort.
		fallback := allModels[0]
		return &SelectionResult{
			ThinkModel:  fallback,
			OutputModel: fallback,
			Reasoning:   "jev-router: pool unsatisfiable; fell back to the first catalog entry",
		}
	}
	_ = maxTokens // reserved: the router prices per-token, not per-request budget
	_ = costBudget
	return &SelectionResult{
		ThinkModel:  allModels[pool[thinkIdx].core],
		OutputModel: allModels[pool[outIdx].core],
		Reasoning:   rationale,
	}
}

// enrichPool maps Core catalog entries onto routing candidates. Entries the
// embedded catalog knows inherit its power/cost/tags; unknown entries get
// conservative synthesized metadata so they stay routable.
func enrichPool(allModels []prov.ModelInfo) []routerModel {
	cat := loadCatalog()
	pool := make([]routerModel, 0, len(allModels))
	for i := range allModels {
		m := &allModels[i]
		cand := routerModel{
			core:     i,
			id:       m.ID,
			provider: m.Provider,
			ctx:      int64(m.MaxContextLength),
		}
		if cand.ctx <= 0 {
			cand.ctx = 128_000
		}
		if jev, ok := cat.lookup(m.ID); ok {
			cand.jevID = m.ID
			cand.power = jev.Power
			cand.cost = jev.Cost
			cand.tags = make(map[string]struct{}, len(jev.TagSet)+1)
			for t := range jev.TagSet {
				cand.tags[t] = struct{}{}
			}
			if m.SupportsThinking {
				cand.tags["thinking"] = struct{}{}
			}
			if m.MaxContextLength > 0 {
				cand.ctx = int64(m.MaxContextLength)
			}
		} else {
			cand.power = 3.0
			if m.SupportsThinking {
				cand.power = 3.3
			}
			cand.cost = blendedCostPerMillion(m)
			cand.tags = tagSet(universalTags...)
			cand.tags["general"] = struct{}{}
			if m.SupportsThinking {
				cand.tags["thinking"] = struct{}{}
				cand.tags["reasoning"] = struct{}{}
			}
		}
		if cand.ctx >= ctxLong {
			cand.tags["long_ctx"] = struct{}{}
		}
		pool = append(pool, cand)
	}
	return pool
}

// blendedCostPerMillion approximates jev's blended $/1M cost from the pricing
// spec Core attached to the model; mid-tier when nothing is known.
func blendedCostPerMillion(m *prov.ModelInfo) float64 {
	in, out := m.Price.InPerMillion, m.Price.OutPerMillion
	if in <= 0 && out <= 0 {
		if m.EstimatedCostPerToken > 0 {
			return m.EstimatedCostPerToken * 1_000_000
		}
		return 3.0
	}
	if in <= 0 {
		return out
	}
	if out <= 0 {
		return in
	}
	return (in + out) / 2
}

// describePool renders a short pool summary for debugging (model ids only).
func describePool(pool []routerModel) string {
	ids := make([]string, 0, len(pool))
	for i := range pool {
		ids = append(ids, pool[i].id)
	}
	sort.Strings(ids)
	return strings.Join(ids, ",")
}

var _ = fmt.Sprintf
