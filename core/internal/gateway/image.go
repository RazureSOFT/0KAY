package gateway

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"0kay/core/internal/netguard"
)

// same table as tts and asr: one endpoint, whatever the fuck you point at it.
var imageSections = []string{"image", "draw", "sd-webui", "comfyui-openai"}

const (
	imageMaxPromptBytes = 8 << 10
	imageMaxReplyBytes  = 24 << 20
)

type imageBackend struct {
	Endpoint string
	Provider string
}

func (g *Gateway) imageConfiguredEndpoint() (imageBackend, bool) {
	if value := strings.TrimSpace(os.Getenv("IMAGE_ENDPOINT")); value != "" {
		return imageBackend{Endpoint: value, Provider: "env"}, true
	}
	if g.settingsStore == nil {
		return imageBackend{}, false
	}
	for _, section := range g.settingsStore.List() {
		values := g.settingsStore.GetValues(section.ID)
		if sectionDisabled(values) {
			continue
		}
		if endpoint, ok := values["image_endpoint"].(string); ok && strings.TrimSpace(endpoint) != "" {
			return imageBackend{Endpoint: strings.TrimSpace(endpoint), Provider: section.ID}, true
		}
	}
	for _, id := range imageSections {
		values := g.settingsStore.GetValues(id)
		if len(values) == 0 || sectionDisabled(values) {
			continue
		}
		if endpoint, ok := values["endpoint"].(string); ok && strings.TrimSpace(endpoint) != "" {
			return imageBackend{Endpoint: strings.TrimSpace(endpoint), Provider: id}, true
		}
	}
	if value, ok := g.settingsStore.GetValues("life")["image_endpoint"].(string); ok && strings.TrimSpace(value) != "" {
		return imageBackend{Endpoint: strings.TrimSpace(value), Provider: "life"}, true
	}
	return imageBackend{}, false
}

func (g *Gateway) imageDraw(ctx context.Context, prompt, size string) (string, []byte, error) {
	backend, ok := g.imageConfiguredEndpoint()
	if !ok {
		return "", nil, fmt.Errorf("image generation is not configured (set IMAGE_ENDPOINT, or a plugin's image_endpoint)")
	}
	if strings.TrimSpace(prompt) == "" {
		return "", nil, fmt.Errorf("prompt required")
	}
	payload, _ := json.Marshal(map[string]any{
		"prompt":          prompt,
		"n":               1,
		"size":            size,
		"response_format": "b64_json",
	})
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, backend.Endpoint, bytes.NewReader(payload))
	if err != nil {
		return "", nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	if token := os.Getenv("IMAGE_SERVICE_TOKEN"); token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	client := &http.Client{Timeout: 120 * time.Second, Transport: netguard.Transport(netguard.Strict()), CheckRedirect: func(req *http.Request, via []*http.Request) error { return http.ErrUseLastResponse }}
	resp, err := client.Do(req)
	if err != nil {
		return "", nil, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(io.LimitReader(resp.Body, imageMaxReplyBytes+1))
	if err != nil {
		return "", nil, err
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", nil, fmt.Errorf("image backend %d: %s", resp.StatusCode, strings.TrimSpace(string(body)))
	}
	if len(body) > imageMaxReplyBytes {
		return "", nil, fmt.Errorf("image backend response too large")
	}
	contentType := resp.Header.Get("Content-Type")
	if strings.Contains(contentType, "application/json") || strings.HasPrefix(strings.TrimSpace(string(body)), "{") {
		var envelope struct {
			Data []struct {
				B64JSON string `json:"b64_json"`
				URL     string `json:"url"`
			} `json:"data"`
		}
		if err := json.Unmarshal(body, &envelope); err == nil && len(envelope.Data) > 0 {
			if envelope.Data[0].B64JSON != "" {
				raw, err := decodeBase64Image(envelope.Data[0].B64JSON)
				if err != nil {
					return "", nil, err
				}
				return "image/png", raw, nil
			}
			if envelope.Data[0].URL != "" {
				return "", nil, fmt.Errorf("image backend returned a URL; configure it with response_format=b64_json")
			}
		}
		return "", nil, fmt.Errorf("image backend returned no image")
	}
	if contentType == "" {
		contentType = "image/png"
	}
	return contentType, body, nil
}

func decodeBase64Image(encoded string) ([]byte, error) {
	cleaned := strings.TrimSpace(encoded)
	if idx := strings.Index(cleaned, ","); idx > 0 && strings.HasPrefix(cleaned, "data:") {
		cleaned = cleaned[idx+1:]
	}
	raw, err := base64.StdEncoding.DecodeString(cleaned)
	if err != nil {
		return nil, fmt.Errorf("image backend returned invalid base64: %w", err)
	}
	return raw, nil
}

func (g *Gateway) handleImage(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		backend, ok := g.imageConfiguredEndpoint()
		writeJSON(w, http.StatusOK, map[string]any{"configured": ok, "provider": backend.Provider})
		return
	}
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var body struct {
		Prompt string `json:"prompt"`
		Size   string `json:"size"`
	}
	if !decodeBody(w, r, &body, imageMaxPromptBytes) {
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 120*time.Second)
	defer cancel()
	contentType, image, err := g.imageDraw(ctx, body.Prompt, body.Size)
	if err != nil {
		writeErr(w, http.StatusBadGateway, "image_failed", err.Error())
		return
	}
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Cache-Control", "no-store")
	_, _ = w.Write(image)
}
