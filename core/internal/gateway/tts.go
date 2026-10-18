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

// ttsSections lists the settings sections a TTS-capable plugin can own, in
// priority order. Each plugin publishes its own `endpoint` into its section when
// it registers, so adding a backend is a plugin-side change plus one line here.
var ttsSections = []string{"genietts", "deepseek-tts"}

func isTTSSection(id string) bool {
	for _, candidate := range ttsSections {
		if id == candidate {
			return true
		}
	}
	return false
}

// ttsEndpoint resolves the text-to-speech backend: the TTS_ENDPOINT env var,
// then the first enabled TTS plugin, then the legacy LIFE `tts_endpoint`.
func (g *Gateway) ttsEndpoint() string {
	if value := strings.TrimSpace(os.Getenv("TTS_ENDPOINT")); value != "" {
		return value
	}
	if g.settingsStore == nil {
		return ""
	}
	for _, id := range ttsSections {
		values := g.settingsStore.GetValues(id)
		if len(values) == 0 {
			continue
		}
		// Installed but switched off in its own settings: skip it so the next
		// backend (or LIFE) can take over.
		if enabled, ok := values["enabled"].(string); ok && strings.EqualFold(strings.TrimSpace(enabled), "false") {
			continue
		}
		if endpoint, ok := values["endpoint"].(string); ok && strings.TrimSpace(endpoint) != "" {
			return strings.TrimSpace(endpoint)
		}
	}
	if value, ok := g.settingsStore.GetValues("life")["tts_endpoint"].(string); ok && strings.TrimSpace(value) != "" {
		return strings.TrimSpace(value)
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
	// Only TTS-backed sections have a synthesise test; anything else is 404 so
	// POST /api/settings/<anything>/test cannot be used as a free TTS endpoint.
	if id := r.PathValue("id"); !isTTSSection(id) {
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
