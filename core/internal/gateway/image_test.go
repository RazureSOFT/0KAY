package gateway

import (
	"encoding/base64"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"0kay/core/internal/settings"
)

// imageTestGateway builds a Gateway whose settings store holds one image plugin
// section — the only thing the resolver looks at.
func imageTestGateway(t *testing.T, id, endpoint string) *Gateway {
	t.Helper()
	store := settings.NewStore("")
	store.RegisterSection(settings.Section{
		ID:    id,
		Order: 70,
		Fields: []settings.Field{
			{Key: "image_endpoint", Type: "text"},
			{Key: "enabled", Type: "bool", DefaultValue: "true"},
		},
	})
	if endpoint != "" {
		if err := store.SetValues(id, map[string]interface{}{"image_endpoint": endpoint}); err != nil {
			t.Fatalf("seed settings: %v", err)
		}
	}
	return &Gateway{settingsStore: store}
}

func TestImageUnconfigured(t *testing.T) {
	g := imageTestGateway(t, "draw", "")
	rec := httptest.NewRecorder()
	g.handleImage(rec, httptest.NewRequest(http.MethodGet, "/api/image", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("GET status = %d", rec.Code)
	}
	if !strings.Contains(rec.Body.String(), `"configured":false`) {
		t.Fatalf("GET body = %s", rec.Body.String())
	}

	rec = httptest.NewRecorder()
	g.handleImage(rec, httptest.NewRequest(http.MethodPost, "/api/image", strings.NewReader(`{"prompt":"a cat"}`)))
	if rec.Code != http.StatusServiceUnavailable && rec.Code != http.StatusBadGateway {
		t.Fatalf("POST with no backend: status = %d body = %s", rec.Code, rec.Body.String())
	}
}

func TestImageResolvesDeclaredSection(t *testing.T) {
	g := imageTestGateway(t, "draw", "http://127.0.0.1:9/v1/images")
	backend, ok := g.imageConfiguredEndpoint()
	if !ok || backend.Endpoint != "http://127.0.0.1:9/v1/images" || backend.Provider != "draw" {
		t.Fatalf("resolver = %+v ok=%v", backend, ok)
	}

	rec := httptest.NewRecorder()
	g.handleImage(rec, httptest.NewRequest(http.MethodGet, "/api/image", nil))
	if !strings.Contains(rec.Body.String(), `"provider":"draw"`) {
		t.Fatalf("GET body = %s", rec.Body.String())
	}
}

func TestImageDisabledSectionFallsThrough(t *testing.T) {
	store := settings.NewStore("")
	store.RegisterSection(settings.Section{
		ID:    "draw",
		Order: 70,
		Fields: []settings.Field{
			{Key: "image_endpoint", Type: "text"},
			{Key: "enabled", Type: "bool", DefaultValue: "true"},
		},
	})
	if err := store.SetValues("draw", map[string]interface{}{
		"image_endpoint": "http://127.0.0.1:9/v1/images",
		"enabled":        false,
	}); err != nil {
		t.Fatalf("seed settings: %v", err)
	}
	g := &Gateway{settingsStore: store}
	if _, ok := g.imageConfiguredEndpoint(); ok {
		t.Fatal("a disabled section must not answer")
	}
}

// A real backend, reached through the public handler: OpenAI envelope in, PNG out.
func TestImageEndToEnd(t *testing.T) {
	raw := []byte("\x89PNG\r\n\x1a\n-fake-image-bytes")
	var gotPrompt, gotSize string
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var body struct {
			Prompt string `json:"prompt"`
			Size   string `json:"size"`
			N      int    `json:"n"`
		}
		_ = json.NewDecoder(r.Body).Decode(&body)
		gotPrompt, gotSize = body.Prompt, body.Size
		_ = json.NewEncoder(w).Encode(map[string]any{
			"data": []map[string]string{{"b64_json": base64.StdEncoding.EncodeToString(raw)}},
		})
	}))
	defer backend.Close()

	g := imageTestGateway(t, "draw", backend.URL)
	rec := httptest.NewRecorder()
	g.handleImage(rec, httptest.NewRequest(http.MethodPost, "/api/image",
		strings.NewReader(`{"prompt":"a selfie in a cafe","size":"1024x1024"}`)))

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d body = %s", rec.Code, rec.Body.String())
	}
	if gotPrompt != "a selfie in a cafe" || gotSize != "1024x1024" {
		t.Fatalf("backend saw prompt=%q size=%q", gotPrompt, gotSize)
	}
	if rec.Body.String() != string(raw) {
		t.Fatalf("body = %q want the decoded png", rec.Body.String())
	}
	if ct := rec.Header().Get("Content-Type"); !strings.HasPrefix(ct, "image/") {
		t.Fatalf("content-type = %q", ct)
	}
}

func TestImageRawBytesBackend(t *testing.T) {
	// A server that ignores the OpenAI contract and just returns bytes must work
	// too, otherwise every local drawer needs a shim.
	raw := []byte("\x89PNG\r\n\x1a\n-raw")
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "image/png")
		_, _ = w.Write(raw)
	}))
	defer backend.Close()

	g := imageTestGateway(t, "draw", backend.URL)
	rec := httptest.NewRecorder()
	g.handleImage(rec, httptest.NewRequest(http.MethodPost, "/api/image", strings.NewReader(`{"prompt":"x"}`)))
	if rec.Code != http.StatusOK || rec.Body.String() != string(raw) {
		t.Fatalf("status=%d body=%q", rec.Code, rec.Body.String())
	}
}

func TestImageBackendError(t *testing.T) {
	backend := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.Error(w, "nope", http.StatusBadRequest)
	}))
	defer backend.Close()

	g := imageTestGateway(t, "draw", backend.URL)
	rec := httptest.NewRecorder()
	g.handleImage(rec, httptest.NewRequest(http.MethodPost, "/api/image", strings.NewReader(`{"prompt":"x"}`)))
	if rec.Code != http.StatusBadGateway {
		t.Fatalf("status = %d body = %s", rec.Code, rec.Body.String())
	}
	if !strings.Contains(rec.Body.String(), "image_failed") {
		t.Fatalf("body = %s", rec.Body.String())
	}
}
