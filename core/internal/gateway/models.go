package gateway

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"0kay/core/internal/providers"
)

// ModelsRequest is the request for fetching models.
type ModelsRequest struct {
	ID       string `json:"id"`
	Provider string `json:"provider"`
	BaseURL  string `json:"base_url"`
	APIKey   string `json:"api_key"`
	Format   string `json:"format"`
}

// effectiveFormat maps a provider preset + explicit format to the wire protocol
// used for the model-catalog request.
func effectiveFormat(provider, format string) string {
	if f := strings.ToLower(strings.TrimSpace(format)); f != "" {
		return f
	}
	return strings.ToLower(strings.TrimSpace(provider))
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
	if !allowMethod(w, r, http.MethodPost) {
		return
	}

	var req ModelsRequest
	if !decodeBody(w, r, &req, maxSmallBody) {
		return
	}

	if req.BaseURL == "" {
		badRequest(w, "Base URL is required")
		return
	}

	resp := ModelsResponse{Models: []string{}, Source: "fallback"}
	format := effectiveFormat(req.Provider, req.Format)
	models, err := fetchModelsFromProvider(format, req.BaseURL, g.resolveModelAPIKey(req))
	if err != nil {
		resp.Models = getDefaultModels(format)
		resp.Error = err.Error()
	} else {
		resp.Models = models
		resp.Source = "api"
	}

	writeJSON(w, http.StatusOK, resp)
}

// resolveModelAPIKey returns the credential to send upstream for a model-catalog
// fetch. GET /api/providers is masked now, so the browser only ever holds a
// masked (or empty) key; resolve it server-side by id, then by (provider,
// base_url). A masked key is never forwarded: leaking the mask upstream would
// turn a working endpoint into a confusing 401 from the provider.
func (g *Gateway) resolveModelAPIKey(req ModelsRequest) string {
	if req.APIKey != "" && !providers.IsMasked(req.APIKey, "") {
		return req.APIKey
	}
	if g.providerStore == nil {
		return ""
	}
	if req.ID != "" {
		if key := g.providerStore.Secret(req.ID); key != "" {
			return key
		}
	}
	norm := func(u string) string { return strings.TrimSuffix(strings.TrimSpace(u), "/") }
	target := norm(req.BaseURL)
	if target == "" {
		return ""
	}
	for _, p := range g.providerStore.SnapshotRaw().Providers {
		if req.Provider != "" && p.Provider != req.Provider {
			continue
		}
		if norm(p.BaseURL) != target {
			continue
		}
		if key := g.providerStore.Secret(p.ID); key != "" {
			return key
		}
	}
	return ""
}

// modelClient bounds provider model-list requests so a slow provider cannot hang
// the gateway. The base URL is user supplied, so it is validated and responses
// are size limited.
var modelClient = &http.Client{Timeout: 15 * time.Second}

const maxModelsResponseBytes = 1 << 20

// blockedModelHosts are link-local cloud metadata endpoints that must never be
// reachable through a user-supplied base URL.
var blockedModelHosts = map[string]bool{
	"169.254.169.254":          true,
	"metadata.google.internal": true,
	"metadata":                 true,
	"fd00:ec2::254":            true,
}

// validateModelsURL rejects non-HTTP(S) schemes, hosts without a name, and
// cloud metadata endpoints.
func validateModelsURL(raw string) error {
	parsed, err := url.Parse(raw)
	if err != nil {
		return fmt.Errorf("invalid base url")
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return fmt.Errorf("base url must use http or https")
	}
	if parsed.Hostname() == "" {
		return fmt.Errorf("base url has no host")
	}
	if blockedModelHosts[strings.ToLower(parsed.Hostname())] {
		return fmt.Errorf("base url host is not allowed")
	}
	return nil
}

// fetchModelsFromProvider fetches models from the provider's API. format is the
// effective wire protocol ("anthropic" or anything else for OpenAI-compatible).
func fetchModelsFromProvider(format, baseURL, apiKey string) ([]string, error) {
	// Normalize base URL
	baseURL = strings.TrimSuffix(baseURL, "/")

	isAnthropic := format == "anthropic" || strings.Contains(strings.ToLower(baseURL), "anthropic.com")

	var modelsURL string
	if isAnthropic {
		modelsURL = baseURL + "/v1/models"
	} else {
		// OpenAI-compatible API
		modelsURL = baseURL + "/models"
	}

	if err := validateModelsURL(modelsURL); err != nil {
		return nil, err
	}

	req, err := http.NewRequest("GET", modelsURL, nil)
	if err != nil {
		return nil, err
	}

	// Set headers
	if apiKey != "" {
		req.Header.Set("Authorization", "Bearer "+apiKey)
	}
	if isAnthropic {
		req.Header.Set("x-api-key", apiKey)
		req.Header.Set("anthropic-version", "2023-06-01")
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := modelClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return nil, fmt.Errorf("API error %d: %s", resp.StatusCode, string(body))
	}

	// Parse response
	body, err := io.ReadAll(io.LimitReader(resp.Body, maxModelsResponseBytes))
	if err != nil {
		return nil, err
	}

	return parseModelsResponse(format, body)
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
