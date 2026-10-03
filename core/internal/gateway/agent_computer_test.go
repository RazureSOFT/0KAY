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
