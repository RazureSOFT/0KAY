package gateway

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"0kay/core/internal/registry"
	pluginv1 "0kay/gen/plugin/v1"
)

func egressTestGateway(t *testing.T, egressList []string) (*Gateway, string) {
	t.Helper()
	reg := registry.NewRegistry()
	reg.SetSecret([]byte("egress-test-secret-0123456789abcdef"))
	if _, err := reg.Register(&pluginv1.PluginInfo{
		Name:    "tool",
		Version: "1",
		Permissions: &pluginv1.PluginPermission{
			ApiRequires: []string{"POST /api/net/egress"},
			Egress:      egressList,
		},
	}, []string{"tool"}, "127.0.0.1:1"); err != nil {
		t.Fatalf("register: %v", err)
	}
	info, _ := reg.FindByName("tool")
	return &Gateway{registry: reg}, reg.Token(info.PluginID)
}

func TestHandleEgress(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("pong"))
	}))
	defer upstream.Close()
	host := strings.TrimPrefix(upstream.URL, "http://")

	g, token := egressTestGateway(t, []string{host})

	body, _ := json.Marshal(map[string]any{"method": "GET", "url": upstream.URL + "/ping"})
	req := httptest.NewRequest(http.MethodPost, "/api/net/egress", bytes.NewReader(body))
	req.Header.Set(PluginHeader, "tool")
	req.Header.Set("Authorization", "Bearer "+token)
	rec := httptest.NewRecorder()
	g.handleEgress(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("allowed egress: got %d (%s)", rec.Code, rec.Body.String())
	}
	var payload struct {
		Status int    `json:"status"`
		Body   string `json:"body"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if payload.Status != 200 || payload.Body != "pong" {
		t.Fatalf("unexpected payload: %+v", payload)
	}

	// A host outside the allow-list is blocked and never reaches upstream.
	blocked, _ := json.Marshal(map[string]any{"method": "GET", "url": "http://blocked.example/x"})
	req2 := httptest.NewRequest(http.MethodPost, "/api/net/egress", bytes.NewReader(blocked))
	req2.Header.Set(PluginHeader, "tool")
	req2.Header.Set("Authorization", "Bearer "+token)
	rec2 := httptest.NewRecorder()
	g.handleEgress(rec2, req2)
	// Consistent with CoreService.Egress: the failure travels in the payload's
	// error field (status 0) instead of a transport error.
	if rec2.Code != http.StatusOK {
		t.Fatalf("blocked egress: got %d, want 200", rec2.Code)
	}
	var blockedPayload struct {
		Status int    `json:"status"`
		Error  string `json:"error"`
	}
	if err := json.Unmarshal(rec2.Body.Bytes(), &blockedPayload); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if blockedPayload.Status != 0 || blockedPayload.Error == "" {
		t.Fatalf("blocked egress payload: %+v", blockedPayload)
	}
}

func TestHandleEgressRequiresIdentity(t *testing.T) {
	g, _ := egressTestGateway(t, []string{"*"})
	req := httptest.NewRequest(http.MethodPost, "/api/net/egress", strings.NewReader(`{"url":"http://x/"}`))
	rec := httptest.NewRecorder()
	g.handleEgress(rec, req)
	if rec.Code != http.StatusUnauthorized {
		t.Fatalf("no identity: got %d, want 401", rec.Code)
	}
}
