package gateway

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"0kay/core/internal/registry"
)

func TestApprovalReadsWithoutExecutor(t *testing.T) {
	g := &Gateway{registry: registry.NewRegistry()}
	for _, path := range []string{"/api/agent/approvals", "/api/agent/questions"} {
		w := httptest.NewRecorder()
		g.handleAgentApprovals(w, httptest.NewRequest(http.MethodGet, path, nil))
		if w.Code != http.StatusOK || !json.Valid(w.Body.Bytes()) {
			t.Fatalf("GET %s: %d %s", path, w.Code, w.Body.String())
		}
	}
	w := httptest.NewRecorder()
	g.handleAgentApprovals(w, httptest.NewRequest(http.MethodPost, "/api/agent/approvals", strings.NewReader(`{"executor_id":"missing","id":"one","allow":true}`)))
	if w.Code != http.StatusServiceUnavailable {
		t.Fatalf("decision without executor: %d %s", w.Code, w.Body.String())
	}
}

func TestMalformedBodiesWriteOneEnvelope(t *testing.T) {
	g := &Gateway{}
	for name, handler := range map[string]http.HandlerFunc{
		"toggle":       g.handlePluginEnable,
		"patch":        g.handlePluginPatch,
		"notification": g.handleLifeNotifications,
	} {
		t.Run(name, func(t *testing.T) {
			method := http.MethodPost
			if name == "patch" {
				method = http.MethodPatch
			}
			r := httptest.NewRequest(method, "/", strings.NewReader("{"))
			r.SetPathValue("name", "test")
			w := httptest.NewRecorder()
			handler(w, r)
			if w.Code != http.StatusBadRequest || !json.Valid(w.Body.Bytes()) {
				t.Fatalf("expected one JSON error: %d %s", w.Code, w.Body.String())
			}
		})
	}
}
