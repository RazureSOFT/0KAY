package gateway

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"0kay/core/internal/settings"
)

func asrTestGateway(t *testing.T, id, endpoint string) *Gateway {
	t.Helper()
	store := settings.NewStore("")
	store.RegisterSection(settings.Section{
		ID:    id,
		Order: 70,
		Fields: []settings.Field{
			{Key: "asr_endpoint", Type: "text"},
			{Key: "enabled", Type: "bool", DefaultValue: "true"},
		},
	})
	if endpoint != "" {
		if err := store.SetValues(id, map[string]interface{}{"asr_endpoint": endpoint}); err != nil {
			t.Fatalf("seed settings: %v", err)
		}
	}
	return &Gateway{settingsStore: store}
}

func asrMultipart(t *testing.T, field, filename, audio string, extra map[string]string) *http.Request {
	t.Helper()
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	part, err := writer.CreateFormFile(field, filename)
	if err != nil {
		t.Fatalf("create form file: %v", err)
	}
	if _, err := part.Write([]byte(audio)); err != nil {
		t.Fatalf("write audio: %v", err)
	}
	for key, value := range extra {
		if err := writer.WriteField(key, value); err != nil {
			t.Fatalf("write field: %v", err)
		}
	}
	if err := writer.Close(); err != nil {
		t.Fatalf("close writer: %v", err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/asr", &buf)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	return req
}

func TestASRStatusReportsUnconfigured(t *testing.T) {
	g := asrTestGateway(t, "asr", "")
	w := httptest.NewRecorder()
	g.handleASR(w, httptest.NewRequest(http.MethodGet, "/api/asr", nil))
	if w.Code != http.StatusOK {
		t.Fatalf("status = %d", w.Code)
	}
	var payload map[string]interface{}
	if err := json.Unmarshal(w.Body.Bytes(), &payload); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if payload["configured"] != false {
		t.Fatalf("configured = %v, want false", payload["configured"])
	}
}

func TestASRResolvesExplicitSectionWithoutCoreChanges(t *testing.T) {
	g := asrTestGateway(t, "my-speech-plugin", "http://127.0.0.1:9001/v1/audio/transcriptions")
	backend, ok := g.asrConfiguredEndpoint()
	if !ok {
		t.Fatal("endpoint not resolved")
	}
	if backend.Provider != "my-speech-plugin" || backend.Endpoint != "http://127.0.0.1:9001/v1/audio/transcriptions" {
		t.Fatalf("unexpected backend: %+v", backend)
	}
}

func TestASRDisabledSectionIsSkipped(t *testing.T) {
	store := settings.NewStore("")
	store.RegisterSection(settings.Section{
		ID:     "my-speech-plugin",
		Fields: []settings.Field{{Key: "asr_endpoint", Type: "text"}, {Key: "enabled", Type: "bool", DefaultValue: "true"}},
	})
	if err := store.SetValues("my-speech-plugin", map[string]interface{}{
		"asr_endpoint": "http://127.0.0.1:9001/",
		"enabled":      false,
	}); err != nil {
		t.Fatalf("seed: %v", err)
	}
	g := &Gateway{settingsStore: store}
	if _, ok := g.asrConfiguredEndpoint(); ok {
		t.Fatal("a disabled section must not be used")
	}
}

func TestASREnvOverrideWins(t *testing.T) {
	t.Setenv("ASR_ENDPOINT", "http://127.0.0.1:9999/transcribe")
	g := asrTestGateway(t, "asr", "http://127.0.0.1:9001/")
	backend, ok := g.asrConfiguredEndpoint()
	if !ok || backend.Provider != "env" || backend.Endpoint != "http://127.0.0.1:9999/transcribe" {
		t.Fatalf("unexpected backend: %+v ok=%v", backend, ok)
	}
}

func TestASRMultipartForwardsOpenAIShapedRequest(t *testing.T) {
	var gotField, gotFilename, gotModel, gotLanguage string
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := r.ParseMultipartForm(1 << 20); err != nil {
			t.Errorf("backend parse: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		file, header, err := r.FormFile("file")
		if err != nil {
			t.Errorf("backend form file: %v", err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		defer file.Close()
		gotFilename = header.Filename
		gotField = r.FormValue("response_format")
		gotModel = r.FormValue("model")
		gotLanguage = r.FormValue("language")
		_ = json.NewEncoder(w).Encode(map[string]string{"text": "你好，美玖"})
	}))
	defer backend.Close()

	g := asrTestGateway(t, "asr", backend.URL)
	w := httptest.NewRecorder()
	g.handleASR(w, asrMultipart(t, "audio", "chunk.webm", "fake-opus-bytes", map[string]string{"language": "zh", "model": "whisper-1"}))

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, body = %s", w.Code, w.Body.String())
	}
	var result asrResult
	if err := json.Unmarshal(w.Body.Bytes(), &result); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if result.Text != "你好，美玖" || result.Provider != "asr" {
		t.Fatalf("unexpected result: %+v", result)
	}
	if gotFilename != "chunk.webm" || gotField != "json" || gotModel != "whisper-1" || gotLanguage != "zh" {
		t.Fatalf("backend saw file=%q format=%q model=%q language=%q", gotFilename, gotField, gotModel, gotLanguage)
	}
}

func TestASRBase64BodyAndPlainTextReply(t *testing.T) {
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("  plain transcript\n"))
	}))
	defer backend.Close()

	g := asrTestGateway(t, "asr", backend.URL)
	audio := base64.StdEncoding.EncodeToString([]byte("wav-bytes"))
	body := `{"audio_base64":"` + audio + `","mime":"audio/wav","language":"ja"}`
	req := httptest.NewRequest(http.MethodPost, "/api/asr", strings.NewReader(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	g.handleASR(w, req)

	if w.Code != http.StatusOK {
		t.Fatalf("status = %d, body = %s", w.Code, w.Body.String())
	}
	var result asrResult
	if err := json.Unmarshal(w.Body.Bytes(), &result); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if result.Text != "plain transcript" {
		t.Fatalf("text = %q", result.Text)
	}
}

func TestASRReportsNotConfiguredAs503(t *testing.T) {
	g := asrTestGateway(t, "asr", "")
	w := httptest.NewRecorder()
	g.handleASR(w, asrMultipart(t, "audio", "chunk.webm", "bytes", nil))
	if w.Code != http.StatusServiceUnavailable {
		t.Fatalf("status = %d, body = %s", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), "asr_failed") {
		t.Fatalf("unexpected body: %s", w.Body.String())
	}
}

func TestASRRejectsEmptyAndOversizedAudio(t *testing.T) {
	g := asrTestGateway(t, "asr", "http://127.0.0.1:9001/")
	w := httptest.NewRecorder()
	g.handleASR(w, asrMultipart(t, "audio", "chunk.webm", "", nil))
	if w.Code != http.StatusBadRequest {
		t.Fatalf("empty audio status = %d", w.Code)
	}

	req := asrMultipart(t, "file", "chunk.webm", "abc", nil)
	w = httptest.NewRecorder()
	g.handleASR(w, req)
	if w.Code != http.StatusBadGateway {
		t.Fatalf("file-field status = %d, body = %s", w.Code, w.Body.String())
	}
}
