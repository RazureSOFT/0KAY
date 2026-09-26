package providers

import (
	"context"
	"io"
)

// ModelProvider is the interface for AI model providers.
type ModelProvider interface {
	// Name returns the provider name.
	Name() string

	// Generate streams text generation from the model.
	Generate(ctx context.Context, req *GenerateRequest) (io.ReadCloser, error)

	// SupportsModel checks if the provider supports a given model.
	SupportsModel(modelID string) bool
}

// GenerateRequest is the request for model generation.
type GenerateRequest struct {
	ModelID      string
	Messages     []Message
	SystemPrompt string
	MaxTokens    int
	Temperature  float64
	Stream       bool
	Thinking     bool
}

// Message represents a conversation message.
type Message struct {
	Role    string
	Content string
}

// ModelInfo contains metadata about a model.
type ModelInfo struct {
	ID                    string
	Provider              string
	SupportsThinking      bool
	MaxContextLength      int
	EstimatedCostPerToken float64
	Price                 PriceSpec
}

// GetModels returns available models for a provider.
func GetModels(provider string) []ModelInfo {
	switch provider {
	case "openai":
		return []ModelInfo{
			{ID: "gpt-5", Provider: "openai", SupportsThinking: true, MaxContextLength: 400000, EstimatedCostPerToken: 0.00001},
			{ID: "gpt-5-mini", Provider: "openai", SupportsThinking: true, MaxContextLength: 400000, EstimatedCostPerToken: 0.000003},
			{ID: "gpt-4.1", Provider: "openai", SupportsThinking: false, MaxContextLength: 1000000, EstimatedCostPerToken: 0.000005},
			{ID: "o3", Provider: "openai", SupportsThinking: true, MaxContextLength: 200000, EstimatedCostPerToken: 0.00001},
			{ID: "o4-mini", Provider: "openai", SupportsThinking: true, MaxContextLength: 200000, EstimatedCostPerToken: 0.000003},
		}
	case "anthropic":
		return []ModelInfo{
			{ID: "claude-opus-4-1-20250805", Provider: "anthropic", SupportsThinking: true, MaxContextLength: 200000, EstimatedCostPerToken: 0.000015},
			{ID: "claude-sonnet-4-20250514", Provider: "anthropic", SupportsThinking: true, MaxContextLength: 200000, EstimatedCostPerToken: 0.000006},
			{ID: "claude-3-7-sonnet-20250219", Provider: "anthropic", SupportsThinking: true, MaxContextLength: 200000, EstimatedCostPerToken: 0.000006},
			{ID: "claude-3-5-haiku-20241022", Provider: "anthropic", SupportsThinking: false, MaxContextLength: 200000, EstimatedCostPerToken: 0.000001},
		}
	default:
		return nil
	}
}
