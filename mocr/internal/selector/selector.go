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
	return s.selectFrom(allModels, prompt, difficulty, requireThinking, maxTokens, costBudget)
}

// SelectFrom chooses the best models from a caller-supplied catalog (Core /api/models).
func (s *Selector) SelectFrom(allModels []providers.ModelInfo, prompt string, difficulty float64, requireThinking bool, maxTokens int, costBudget float64) *SelectionResult {
	if len(allModels) == 0 {
		return s.Select(prompt, difficulty, requireThinking, maxTokens, costBudget)
	}
	return s.selectFrom(allModels, prompt, difficulty, requireThinking, maxTokens, costBudget)
}

func (s *Selector) selectFrom(allModels []providers.ModelInfo, prompt string, difficulty float64, requireThinking bool, maxTokens int, costBudget float64) *SelectionResult {
	// Select think model (strong model with thinking support)
	var thinkModel *providers.ModelInfo
	if requireThinking || difficulty > 0.7 {
		// Need strong reasoning - pick thinking model
		for i := range allModels {
			m := &allModels[i]
			if m.SupportsThinking {
				if thinkModel == nil || m.EstimatedCostPerToken < thinkModel.EstimatedCostPerToken {
					thinkModel = m
				}
			}
		}
	}
	if thinkModel == nil {
		// Fallback to strongest non-thinking model
		for i := range allModels {
			m := &allModels[i]
			if thinkModel == nil || m.EstimatedCostPerToken > thinkModel.EstimatedCostPerToken {
				thinkModel = m
			}
		}
	}

	// Select output model (cheap, fast, no thinking needed)
	var outputModel *providers.ModelInfo
	for i := range allModels {
		m := &allModels[i]
		if !m.SupportsThinking {
			if outputModel == nil || m.EstimatedCostPerToken < outputModel.EstimatedCostPerToken {
				outputModel = m
			}
		}
	}
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
