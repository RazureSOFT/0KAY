package gateway

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"

	"0kay/core/internal/netguard"
)

// ttsEndpoint resolves the text-to-speech backend: the LIFE `tts_endpoint`
// setting, or the TTS_ENDPOINT env var.
func (g *Gateway) ttsEndpoint() string {
	if value := strings.TrimSpace(os.Getenv("TTS_ENDPOINT")); value != "" {
		return value
	}
	if g.settingsStore != nil {
		// The DeepSeek TTS plugin records its own URL in its settings section.
		if value, ok := g.settingsStore.GetValues("deepseek-tts")["endpoint"].(string); ok && strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
		if value, ok := g.settingsStore.GetValues("life")["tts_endpoint"].(string); ok && strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}
	return ""
}

// ttsSynthesize posts text to the configured backend and returns the audio
// content type + bytes.
func (g *Gateway) ttsSynthesize(ctx context.Context, text, voice string) (string, []byte, error) {
	endpoint := g.ttsEndpoint()
	if endpoint == "" {
		return "", nil, fmt.Errorf("TTS is not configured (Settings → LIFE → TTS endpoint)")
	}
	payload, _ := json.Marshal(map[string]string{"text": text, "voice": voice})
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(payload))
	if err != nil {
		return "", nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	if token := os.Getenv("TTS_SERVICE_TOKEN"); token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	client := &http.Client{Timeout: 90 * time.Second, Transport: netguard.Transport(netguard.Strict()), CheckRedirect: func(req *http.Request, via []*http.Request) error { return http.ErrUseLastResponse }}
	resp, err := client.Do(req)
	if err != nil {
		return "", nil, err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		detail, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return "", nil, fmt.Errorf("TTS %d: %s", resp.StatusCode, strings.TrimSpace(string(detail)))
	}
	audio, err := io.ReadAll(io.LimitReader(resp.Body, (32<<20)+1))
	if err != nil {
		return "", nil, err
	}
	if len(audio) > 32<<20 {
		return "", nil, fmt.Errorf("TTS response too large")
	}
	contentType := resp.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "audio/wav"
	}
	return contentType, audio, nil
}

// handleTTS proxies a synthesis request to the configured TTS backend and
// returns the audio bytes so the browser can play it (Live2D lip-sync).
//
//	POST /api/tts {"text":"...","voice":"mira"} -> audio/*
func (g *Gateway) handleTTS(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var body struct {
		Text  string `json:"text"`
		Voice string `json:"voice"`
	}
	if !decodeBody(w, r, &body, 64<<10) {
		return
	}
	if strings.TrimSpace(body.Text) == "" {
		badRequest(w, "text required")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 90*time.Second)
	defer cancel()
	contentType, audio, err := g.ttsSynthesize(ctx, body.Text, body.Voice)
	if err != nil {
		writeErr(w, http.StatusBadGateway, "tts_failed", err.Error())
		return
	}
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Cache-Control", "no-store")
	_, _ = w.Write(audio)
}

// handleSettingsTest runs a backend test for a settings section and returns the
// synthesized sample as audio (so the user hears it), or a JSON error.
//
//	POST /api/settings/{id}/test
func (g *Gateway) handleSettingsTest(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	// Only the TTS-backed section has a synthesise test; anything else is 404 so
	// POST /api/settings/<anything>/test cannot be used as a free TTS endpoint.
	if id := r.PathValue("id"); id != "deepseek-tts" {
		writeErr(w, http.StatusNotFound, "not_found", "no test available for this section")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 90*time.Second)
	defer cancel()
	contentType, audio, err := g.ttsSynthesize(ctx, "你好，这是一段语音测试。", "")
	if err != nil {
		writeErr(w, http.StatusBadGateway, "tts_test_failed", err.Error())
		return
	}
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Cache-Control", "no-store")
	_, _ = w.Write(audio)
}
