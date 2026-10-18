package selector

import (
	"0kay/mocr/internal/providers"
)

// Selector selects the best think_model and output_model.
type Selector struct{}

// NewSelector creates a new model selector.
func NewSelector() *Selector {
	return &Selector{}
}

// SelectionResult contains the selected models.
type SelectionResult struct {
	ThinkModel  providers.ModelInfo
	OutputModel providers.ModelInfo
	Reasoning   string
}

// Select chooses the best models based on context (hardcoded catalog fallback).
func (s *Selector) Select(prompt string, difficulty float64, requireThinking bool, maxTokens int, costBudget float64) *SelectionResult {
	allModels := append(providers.GetModels("openai"), providers.GetModels("anthropic")...)
	return s.selectFrom(allModels, "auto", prompt, difficulty, requireThinking, maxTokens, costBudget)
}

// SelectFrom chooses the best models from a caller-supplied catalog (Core /api/models).
func (s *Selector) SelectFrom(allModels []providers.ModelInfo, prompt string, difficulty float64, requireThinking bool, maxTokens int, costBudget float64) *SelectionResult {
	return s.SelectWithStrategy("auto", allModels, prompt, difficulty, requireThinking, maxTokens, costBudget)
}

// SelectWithStrategy applies a caller-chosen strategy (auto|quality|cost).
// quality prefers thinking models; cost prefers the cheapest usable model.
func (s *Selector) SelectWithStrategy(strategy string, allModels []providers.ModelInfo, prompt string, difficulty float64, requireThinking bool, maxTokens int, costBudget float64) *SelectionResult {
	if len(allModels) == 0 {
		allModels = append(providers.GetModels("openai"), providers.GetModels("anthropic")...)
	}
	return s.selectFrom(allModels, strategy, prompt, difficulty, requireThinking, maxTokens, costBudget)
}

func (s *Selector) selectFrom(allModels []providers.ModelInfo, strategy string, prompt string, difficulty float64, requireThinking bool, maxTokens int, costBudget float64) *SelectionResult {
	// Estimate the cost of one request: prompt tokens + expected output.
	promptTokens := len(prompt)/4 + 1
	outputTokens := maxTokens
	if outputTokens <= 0 {
		outputTokens = 512
	}
	costOf := func(m *providers.ModelInfo) float64 {
		if m.Price.PerCall == 0 && m.Price.InPerMillion == 0 && m.Price.OutPerMillion == 0 {
			return m.EstimatedCostPerToken * float64(promptTokens+outputTokens)
		}
		return m.Price.EstimateCost(promptTokens, outputTokens)
	}
	cheapest := func(thinkingOnly bool) *providers.ModelInfo {
		var best *providers.ModelInfo
		for i := range allModels {
			m := &allModels[i]
			if thinkingOnly && !m.SupportsThinking {
				continue
			}
			if best == nil || costOf(m) < costOf(best) {
				best = m
			}
		}
		return best
	}
	strongest := func(thinkingOnly bool) *providers.ModelInfo {
		var best *providers.ModelInfo
		for i := range allModels {
			m := &allModels[i]
			if thinkingOnly && !m.SupportsThinking {
				continue
			}
			if best == nil || costOf(m) > costOf(best) {
				best = m
			}
		}
		return best
	}

	switch strategy {
	case "cost":
		think := cheapest(false)
		if think == nil {
			think = cheapest(true)
		}
		output := cheapest(false)
		if output == nil {
			output = think
		}
		return &SelectionResult{ThinkModel: *think, OutputModel: *output, Reasoning: "cost strategy: cheapest estimated request"}
	case "quality":
		think := strongest(true)
		if think == nil {
			think = strongest(false)
		}
		output := strongest(false)
		if output == nil {
			output = think
		}
		return &SelectionResult{ThinkModel: *think, OutputModel: *output, Reasoning: "quality strategy: strongest model"}
	}

	// auto: reasoning when needed, otherwise cheapest thinking; output stays cheap.
	var thinkModel *providers.ModelInfo
	if requireThinking || difficulty > 0.7 {
		thinkModel = cheapest(true)
	}
	if thinkModel == nil {
		thinkModel = strongest(false)
	}
	if thinkModel == nil {
		thinkModel = &allModels[0]
	}
	outputModel := cheapest(false)
	if outputModel == nil {
		outputModel = thinkModel
	}

	reasoning := "selected based on cost optimization"
	if requireThinking {
		reasoning = "thinking required, selected reasoning model"
	} else if difficulty > 0.7 {
		reasoning = "high difficulty, selected reasoning model"
	}
	return &SelectionResult{
		ThinkModel:  *thinkModel,
		OutputModel: *outputModel,
		Reasoning:   reasoning,
	}
}
