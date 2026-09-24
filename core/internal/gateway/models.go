package gateway

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
)

// ModelsRequest is the request for fetching models.
type ModelsRequest struct {
	Provider string `json:"provider"`
	BaseURL  string `json:"base_url"`
	APIKey   string `json:"api_key"`
}

// ModelsResponse is the response containing model list.
type ModelsResponse struct {
	Models []string `json:"models"`
	// Source is "api" when fetched live from the provider, "fallback" when defaults used.
	Source string `json:"source"`
	Error  string `json:"error,omitempty"`
}

// handleFetchModels fetches available models from provider API.
func (g *Gateway) handleFetchModels(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req ModelsRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request", http.StatusBadRequest)
		return
	}

	if req.BaseURL == "" {
		http.Error(w, "Base URL is required", http.StatusBadRequest)
		return
	}

	resp := ModelsResponse{Models: []string{}, Source: "fallback"}
	models, err := fetchModelsFromProvider(req.Provider, req.BaseURL, req.APIKey)
	if err != nil {
		resp.Models = getDefaultModels(req.Provider)
		resp.Error = err.Error()
	} else {
		resp.Models = models
		resp.Source = "api"
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

// fetchModelsFromProvider fetches models from the provider's API.
func fetchModelsFromProvider(provider, baseURL, apiKey string) ([]string, error) {
	// Normalize base URL
	baseURL = strings.TrimSuffix(baseURL, "/")

	var modelsURL string
	switch provider {
	case "anthropic":
		modelsURL = baseURL + "/v1/models"
	default:
		// OpenAI-compatible API
		modelsURL = baseURL + "/models"
	}

	req, err := http.NewRequest("GET", modelsURL, nil)
	if err != nil {
		return nil, err
	}

	// Set headers
	if apiKey != "" {
		req.Header.Set("Authorization", "Bearer "+apiKey)
	}
	if provider == "anthropic" {
		req.Header.Set("x-api-key", apiKey)
		req.Header.Set("anthropic-version", "2023-06-01")
	}
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("API error %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return parseModelsResponse(provider, body)
}

// parseModelsResponse parses the models list from API response.
func parseModelsResponse(provider string, body []byte) ([]string, error) {
	var result struct {
		Data []struct {
			ID string `json:"id"`
		} `json:"data"`
		Models []string `json:"models"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	var models []string
	if len(result.Data) > 0 {
		for _, m := range result.Data {
			models = append(models, m.ID)
		}
	} else if len(result.Models) > 0 {
		models = result.Models
	}

	if len(models) == 0 {
		return nil, fmt.Errorf("no models found")
	}

	return models, nil
}

// getDefaultModels returns default models for a provider.
func getDefaultModels(provider string) []string {
	switch provider {
	case "openai":
		return []string{"gpt-5", "gpt-5-mini", "gpt-4.1", "gpt-4.1-mini", "o3", "o4-mini"}
	case "anthropic":
		return []string{"claude-opus-4-1-20250805", "claude-sonnet-4-20250514", "claude-3-7-sonnet-20250219", "claude-3-5-haiku-20241022"}
	case "deepseek":
		return []string{"deepseek-flash", "deepseek-v4-pro"}
	case "kimi":
		return []string{"kimi-k3", "kimi-k2.7-code", "kimi-k2.7-code-highspeed", "kimi-k2.6"}
	case "xai":
		return []string{"grok-4.1", "grok-4.1-fast", "grok-4", "grok-3-mini"}
	default:
		return []string{"default-model"}
	}
}
