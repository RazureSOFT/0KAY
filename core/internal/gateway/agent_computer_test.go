package gateway

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"0kay/core/internal/registry"
)

func TestComputerUseEndpointsWithoutExecutor(t *testing.T) {
	g := &Gateway{registry: registry.NewRegistry()}

	status := httptest.NewRecorder()
	g.handleAgentComputerUse(status, httptest.NewRequest(http.MethodGet, "/api/agent/computeruse", nil))
	if status.Code != http.StatusServiceUnavailable || !json.Valid(status.Body.Bytes()) {
		t.Fatalf("status without executor: %d %s", status.Code, status.Body.String())
	}

	stream := httptest.NewRecorder()
	g.handleAgentComputerUseStream(stream, httptest.NewRequest(http.MethodGet, "/api/agent/computeruse/stream", nil))
	if stream.Code != http.StatusServiceUnavailable || !json.Valid(stream.Body.Bytes()) {
		t.Fatalf("stream without executor: %d %s", stream.Code, stream.Body.String())
	}
}

func TestMJPEGFrameMimeWhitelist(t *testing.T) {
	for _, allowed := range []string{"image/jpeg", "image/png", "image/gif", "image/webp", "multipart/x-mixed-replace; boundary=frame"} {
		if got := mjpegFrameMime(allowed); got != allowed {
			t.Errorf("mjpegFrameMime(%q) = %q, want passthrough", allowed, got)
		}
	}
	for _, rejected := range []string{
		"",
		"text/html",
		"image/svg+xml",
		"image/png\r\nX-Evil: 1",
		"image/jpeg\nContent-Length: 0",
		"multipart/x-mixed-replace; boundary=a\r\n\r\nGET / HTTP/1.1",
		"application/octet-stream",
	} {
		if got := mjpegFrameMime(rejected); got != "image/jpeg" {
			t.Errorf("mjpegFrameMime(%q) = %q, want image/jpeg fallback", rejected, got)
		}
	}
}
