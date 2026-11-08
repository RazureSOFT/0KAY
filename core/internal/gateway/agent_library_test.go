package gateway

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

// The library endpoint forwards to the agent, so these tests cover the part
// Core owns: what it refuses, and that it does not invent a second list when
// there is no agent to ask.

func TestLibraryRefusesARequestWithNoWorkspace(t *testing.T) {
	g := &Gateway{}
	req := httptest.NewRequest(http.MethodGet, "/api/agent/library", nil)
	rec := httptest.NewRecorder()
	g.handleAgentLibrary(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("want 400, got %d (%s)", rec.Code, rec.Body.String())
	}
	if !strings.Contains(rec.Body.String(), "workspace") {
		t.Fatalf("the error should name what is missing: %s", rec.Body.String())
	}
}

func TestLibraryRefusesAnUnknownAction(t *testing.T) {
	g := &Gateway{}
	body := strings.NewReader(`{"action":"delete_everything","workspace":"/tmp/x"}`)
	req := httptest.NewRequest(http.MethodPost, "/api/agent/library", body)
	rec := httptest.NewRecorder()
	g.handleAgentLibrary(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("want 400, got %d (%s)", rec.Code, rec.Body.String())
	}
}

func TestLibraryRefusesAnAddWithoutText(t *testing.T) {
	g := &Gateway{}
	body := strings.NewReader(`{"action":"add","workspace":"/tmp/x"}`)
	req := httptest.NewRequest(http.MethodPost, "/api/agent/library", body)
	rec := httptest.NewRecorder()
	g.handleAgentLibrary(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("want 400, got %d (%s)", rec.Code, rec.Body.String())
	}
}

// A fresh install has no agent running yet. Reading the rules must say so
// instead of returning an empty list, which would look like "you have no rules"
// and hide the ones already learned in the workspace.
func TestLibraryReportsAMissingAgentInsteadOfAnEmptyList(t *testing.T) {
	g := &Gateway{}
	req := httptest.NewRequest(http.MethodGet, "/api/agent/library?workspace=/tmp/x", nil)
	rec := httptest.NewRecorder()
	g.handleAgentLibrary(rec, req)
	if rec.Code != http.StatusServiceUnavailable {
		t.Fatalf("want 503, got %d (%s)", rec.Code, rec.Body.String())
	}
	var body map[string]interface{}
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatalf("response is not JSON: %s", rec.Body.String())
	}
	if body["code"] != "agent_unavailable" {
		t.Fatalf("want code agent_unavailable, got %v (%v)", body["code"], body["error"])
	}
	if msg, _ := body["error"].(string); msg == "" {
		t.Fatal("the error should explain that no agent is connected")
	}
}

func TestLibraryAcceptsOnlyGetAndPost(t *testing.T) {
	g := &Gateway{}
	req := httptest.NewRequest(http.MethodDelete, "/api/agent/library?workspace=/tmp/x", nil)
	rec := httptest.NewRecorder()
	g.handleAgentLibrary(rec, req)
	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("want 405, got %d", rec.Code)
	}
}
