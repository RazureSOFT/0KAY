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
		if value, ok := g.settingsStore.GetValues("life")["tts_endpoint"].(string); ok && strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}
	return ""
}

// handleTTS proxies a synthesis request to the configured TTS backend and
// returns the audio bytes so the browser can play it (Live2D lip-sync).
//
//	POST /api/tts {"text":"...","voice":"mira"} -> audio/*
func (g *Gateway) handleTTS(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	endpoint := g.ttsEndpoint()
	if endpoint == "" {
		unavailable(w, "TTS is not configured (Settings → LIFE → TTS endpoint)")
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
	payload, _ := json.Marshal(map[string]string{"text": body.Text, "voice": body.Voice})
	ctx, cancel := context.WithTimeout(r.Context(), 90*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, endpoint, bytes.NewReader(payload))
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	req.Header.Set("Content-Type", "application/json")
	client := &http.Client{Timeout: 90 * time.Second, Transport: netguard.Transport(netguard.Strict())}
	resp, err := client.Do(req)
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		detail, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		writeErr(w, http.StatusBadGateway, "tts_failed", fmt.Sprintf("TTS %d: %s", resp.StatusCode, string(detail)))
		return
	}
	contentType := resp.Header.Get("Content-Type")
	if contentType == "" {
		contentType = "audio/wav"
	}
	w.Header().Set("Content-Type", contentType)
	w.Header().Set("Cache-Control", "no-store")
	_, _ = io.Copy(w, io.LimitReader(resp.Body, 32<<20))
}
