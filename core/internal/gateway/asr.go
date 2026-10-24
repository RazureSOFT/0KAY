package gateway

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"0kay/core/internal/netguard"
)

var asrSections = []string{"asr", "soniox", "genieasr", "whisper-asr"}

const (
	asrMaxAudioBytes = 24 << 20
	asrMaxReplyBytes = 1 << 20
)

type asrBackend struct {
	Endpoint string
	Provider string
}

func (g *Gateway) asrConfiguredEndpoint() (asrBackend, bool) {
	if value := strings.TrimSpace(os.Getenv("ASR_ENDPOINT")); value != "" {
		return asrBackend{Endpoint: value, Provider: "env"}, true
	}
	if g.settingsStore == nil {
		return asrBackend{}, false
	}
	for _, section := range g.settingsStore.List() {
		values := g.settingsStore.GetValues(section.ID)
		if sectionDisabled(values) {
			continue
		}
		if endpoint, ok := values["asr_endpoint"].(string); ok && strings.TrimSpace(endpoint) != "" {
			return asrBackend{Endpoint: strings.TrimSpace(endpoint), Provider: section.ID}, true
		}
	}
	for _, id := range asrSections {
		values := g.settingsStore.GetValues(id)
		if len(values) == 0 || sectionDisabled(values) {
			continue
		}
		if endpoint, ok := values["endpoint"].(string); ok && strings.TrimSpace(endpoint) != "" {
			return asrBackend{Endpoint: strings.TrimSpace(endpoint), Provider: id}, true
		}
	}
	if value, ok := g.settingsStore.GetValues("life")["asr_endpoint"].(string); ok && strings.TrimSpace(value) != "" {
		return asrBackend{Endpoint: strings.TrimSpace(value), Provider: "life"}, true
	}
	return asrBackend{}, false
}

func sectionDisabled(values map[string]interface{}) bool {
	raw, ok := values["enabled"]
	if !ok {
		return false
	}
	switch value := raw.(type) {
	case bool:
		return !value
	case string:
		trimmed := strings.TrimSpace(value)
		return strings.EqualFold(trimmed, "false") || trimmed == "0"
	}
	return false
}

type asrResult struct {
	Text     string  `json:"text"`
	Language string  `json:"language,omitempty"`
	Model    string  `json:"model,omitempty"`
	Provider string  `json:"provider,omitempty"`
	Seconds  float64 `json:"seconds,omitempty"`
}

func (g *Gateway) asrTranscribe(ctx context.Context, audio []byte, filename, language, model, prompt string) (asrResult, error) {
	backend, ok := g.asrConfiguredEndpoint()
	if !ok {
		return asrResult{}, fmt.Errorf("ASR is not configured: install a speech-to-text plugin (or set ASR_ENDPOINT)")
	}
	if len(audio) == 0 {
		return asrResult{}, fmt.Errorf("empty audio")
	}
	if filename == "" {
		filename = "audio.webm"
	}
	filename = baseNameOr(filename, "audio.webm")

	var body bytes.Buffer
	writer := multipart.NewWriter(&body)
	part, err := writer.CreateFormFile("file", filename)
	if err != nil {
		return asrResult{}, err
	}
	if _, err := part.Write(audio); err != nil {
		return asrResult{}, err
	}
	_ = writer.WriteField("response_format", "json")
	if language != "" {
		_ = writer.WriteField("language", language)
	}
	if model != "" {
		_ = writer.WriteField("model", model)
	}
	if prompt != "" {
		_ = writer.WriteField("prompt", prompt)
	}
	if err := writer.Close(); err != nil {
		return asrResult{}, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, backend.Endpoint, &body)
	if err != nil {
		return asrResult{}, err
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())
	if token := strings.TrimSpace(os.Getenv("ASR_SERVICE_TOKEN")); token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
	client := &http.Client{
		Timeout:       120 * time.Second,
		Transport:     netguard.Transport(netguard.Strict()),
		CheckRedirect: func(req *http.Request, via []*http.Request) error { return http.ErrUseLastResponse },
	}
	resp, err := client.Do(req)
	if err != nil {
		return asrResult{}, err
	}
	defer resp.Body.Close()
	raw, err := io.ReadAll(io.LimitReader(resp.Body, asrMaxReplyBytes))
	if err != nil {
		return asrResult{}, err
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return asrResult{}, fmt.Errorf("ASR %d: %s", resp.StatusCode, clipText(string(raw), 400))
	}

	result := asrResult{Provider: backend.Provider}
	var payload struct {
		Text     string  `json:"text"`
		Language string  `json:"language"`
		Model    string  `json:"model"`
		Seconds  float64 `json:"duration"`
	}
	if err := json.Unmarshal(raw, &payload); err == nil && (payload.Text != "" || payload.Language != "") {
		result.Text = payload.Text
		result.Language = payload.Language
		result.Model = payload.Model
		result.Seconds = payload.Seconds
	} else {
		result.Text = strings.TrimSpace(string(raw))
	}
	result.Text = strings.TrimSpace(result.Text)
	if result.Text == "" {
		return asrResult{}, fmt.Errorf("ASR returned no text")
	}
	return result, nil
}

func (g *Gateway) handleASR(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet || r.Method == http.MethodHead {
		backend, ok := g.asrConfiguredEndpoint()
		payload := map[string]interface{}{"configured": ok}
		if ok {
			payload["provider"] = backend.Provider
		}
		writeJSON(w, http.StatusOK, payload)
		return
	}
	if !allowMethod(w, r, http.MethodPost) {
		return
	}

	language := strings.TrimSpace(r.URL.Query().Get("language"))
	model := strings.TrimSpace(r.URL.Query().Get("model"))
	prompt := strings.TrimSpace(r.URL.Query().Get("prompt"))
	filename := ""

	var audio []byte
	contentType := strings.ToLower(r.Header.Get("Content-Type"))
	if strings.HasPrefix(contentType, "multipart/form-data") {
		r.Body = http.MaxBytesReader(w, r.Body, asrMaxAudioBytes+(1<<20))
		if err := r.ParseMultipartForm(8 << 20); err != nil {
			badRequest(w, "invalid multipart form: "+err.Error())
			return
		}
		file, header, err := r.FormFile("audio")
		if err != nil {
			file, header, err = r.FormFile("file")
		}
		if err != nil {
			badRequest(w, "audio is required")
			return
		}
		defer file.Close()
		if header.Size > asrMaxAudioBytes {
			writeErr(w, http.StatusRequestEntityTooLarge, "audio_too_large", fmt.Sprintf("audio exceeds %d bytes", asrMaxAudioBytes))
			return
		}
		if audio, err = io.ReadAll(io.LimitReader(file, asrMaxAudioBytes+1)); err != nil {
			badRequest(w, "could not read audio: "+err.Error())
			return
		}
		if filename = header.Filename; filename == "" {
			filename = "audio" + extensionForMime(header.Header.Get("Content-Type"))
		}
		if value := strings.TrimSpace(r.FormValue("language")); value != "" {
			language = value
		}
		if value := strings.TrimSpace(r.FormValue("model")); value != "" {
			model = value
		}
		if value := strings.TrimSpace(r.FormValue("prompt")); value != "" {
			prompt = value
		}
	} else {
		var body struct {
			AudioBase64 string `json:"audio_base64"`
			Mime        string `json:"mime"`
			Filename    string `json:"filename"`
			Language    string `json:"language"`
			Model       string `json:"model"`
			Prompt      string `json:"prompt"`
		}
		if !decodeBody(w, r, &body, 4*(asrMaxAudioBytes/3)+4096) {
			return
		}
		decoded, err := base64.StdEncoding.DecodeString(strings.TrimSpace(body.AudioBase64))
		if err != nil {
			badRequest(w, "audio_base64 is not valid base64")
			return
		}
		if len(decoded) == 0 {
			badRequest(w, "audio_base64 is empty")
			return
		}
		if len(decoded) > asrMaxAudioBytes {
			writeErr(w, http.StatusRequestEntityTooLarge, "audio_too_large", fmt.Sprintf("audio exceeds %d bytes", asrMaxAudioBytes))
			return
		}
		audio = decoded
		filename = strings.TrimSpace(body.Filename)
		if filename == "" {
			filename = "audio" + extensionForMime(body.Mime)
		}
		if value := strings.TrimSpace(body.Language); value != "" {
			language = value
		}
		if value := strings.TrimSpace(body.Model); value != "" {
			model = value
		}
		if value := strings.TrimSpace(body.Prompt); value != "" {
			prompt = value
		}
	}
	if len(audio) == 0 {
		badRequest(w, "audio is empty")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 120*time.Second)
	defer cancel()
	result, err := g.asrTranscribe(ctx, audio, filename, language, model, prompt)
	if err != nil {
		status := http.StatusBadGateway
		if strings.Contains(err.Error(), "not configured") {
			status = http.StatusServiceUnavailable
		}
		writeErr(w, status, "asr_failed", err.Error())
		return
	}
	w.Header().Set("Cache-Control", "no-store")
	writeJSON(w, http.StatusOK, result)
}

func extensionForMime(mime string) string {
	switch strings.ToLower(strings.TrimSpace(strings.Split(mime, ";")[0])) {
	case "audio/wav", "audio/x-wav", "audio/wave":
		return ".wav"
	case "audio/mpeg", "audio/mp3":
		return ".mp3"
	case "audio/ogg":
		return ".ogg"
	case "audio/webm", "audio/webm;codecs=opus":
		return ".webm"
	case "audio/mp4", "audio/m4a", "audio/x-m4a":
		return ".m4a"
	case "audio/flac", "audio/x-flac":
		return ".flac"
	}
	return ".webm"
}

func clipText(value string, limit int) string {
	value = strings.TrimSpace(value)
	if len(value) <= limit {
		return value
	}
	return value[:limit] + "…"
}

func baseNameOr(name, fallback string) string {
	name = filepath.Base(strings.TrimSpace(name))
	if name == "" || name == "." || name == string(filepath.Separator) {
		return fallback
	}
	return name
}
