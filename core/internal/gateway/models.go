package gateway

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"0kay/core/internal/netguard"
	"0kay/core/internal/providers"
)

type ModelsRequest struct {
	ID       string `json:"id"`
	Provider string `json:"provider"`
	BaseURL  string `json:"base_url"`
	APIKey   string `json:"api_key"`
	Format   string `json:"format"`
}

func effectiveFormat(provider, format string) string {
	if f := strings.ToLower(strings.TrimSpace(format)); f != "" {
		return f
	}
	return strings.ToLower(strings.TrimSpace(provider))
}

type ModelsResponse struct {
	Models []string `json:"models"`
	Source string   `json:"source"`
	Error  string   `json:"error,omitempty"`
}

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

var modelClient = &http.Client{
	Timeout:   15 * time.Second,
	Transport: netguard.Transport(netguard.Strict()),
}

const maxModelsResponseBytes = 1 << 20

var blockedModelHosts = map[string]bool{
	"169.254.169.254":          true,
	"metadata.google.internal": true,
	"metadata":                 true,
	"fd00:ec2::254":            true,
}

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

var versionedPath = regexp.MustCompile(`(?i)/v\d+[a-z0-9.]*$`)

func catalogURL(baseURL string) string {
	base := strings.TrimSuffix(strings.TrimSpace(baseURL), "/")
	if !versionedPath.MatchString(base) {
		base += "/v1"
	}
	return base + "/models"
}

func fetchModelsFromProvider(format, baseURL, apiKey string) ([]string, error) {
	isAnthropic := format == "anthropic" || strings.Contains(strings.ToLower(baseURL), "anthropic.com")

	modelsURL := catalogURL(baseURL)

	if err := validateModelsURL(modelsURL); err != nil {
		return nil, err
	}
	if err := netguard.CheckURL(modelsURL, netguard.Strict()); err != nil {
		return nil, err
	}

	req, err := http.NewRequest("GET", modelsURL, nil)
	if err != nil {
		return nil, err
	}

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

	body, err := io.ReadAll(io.LimitReader(resp.Body, maxModelsResponseBytes))
	if err != nil {
		return nil, err
	}

	return parseModelsResponse(format, body)
}

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
