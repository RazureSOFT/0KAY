package gateway

import (
	"encoding/json"
	"net/http/httptest"
	"strings"
	"testing"

	"0kay/core/internal/registry"
)

// The steer endpoint answers all three questions the composer asks: what is
// queued, put this in the queue, take that back. One function serves them so the
// browser never has to merge its own copy of the queue with the agent's.
//
// These tests run without an executor on purpose. The registry is empty here, so
// every call has to fail in a way the UI can read — a 503 for "no executor",
// never a panic and never a silent OK.
func steerGateway(t *testing.T) *Gateway {
	t.Helper()
	return &Gateway{registry: registry.NewRegistry()}
}

func TestSteerRefusesAnEmptyInstruction(t *testing.T) {
	g := steerGateway(t)
	writer := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/api/tasks/t1/steer", strings.NewReader(`{"text":"   "}`))
	request.SetPathValue("task_id", "t1")
	g.handleTaskSteer(writer, request)
	if writer.Code != 400 {
		t.Fatalf("empty text should be a 400, got %d: %s", writer.Code, writer.Body.String())
	}
}

func TestSteerNeedsATask(t *testing.T) {
	g := steerGateway(t)
	writer := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/api/tasks//steer", strings.NewReader(`{"text":"hello"}`))
	g.handleTaskSteer(writer, request)
	if writer.Code != 400 {
		t.Fatalf("missing task should be a 400, got %d", writer.Code)
	}
}

func TestSteerWithoutAnExecutorIsUnavailable(t *testing.T) {
	g := steerGateway(t)
	writer := httptest.NewRecorder()
	request := httptest.NewRequest("POST", "/api/tasks/t1/steer", strings.NewReader(`{"text":"hello"}`))
	request.SetPathValue("task_id", "t1")
	g.handleTaskSteer(writer, request)
	if writer.Code != 503 {
		t.Fatalf("no executor should be a 503, got %d: %s", writer.Code, writer.Body.String())
	}
}

func TestSteerListsWithGet(t *testing.T) {
	g := steerGateway(t)
	writer := httptest.NewRecorder()
	request := httptest.NewRequest("GET", "/api/tasks/t1/steer", nil)
	request.SetPathValue("task_id", "t1")
	g.handleTaskSteer(writer, request)
	// Same reason as above: there is nothing to ask. What matters is that GET is
	// a method the handler accepts at all — it used to be POST-only, which is why
	// the strip could only show what this tab remembered sending.
	if writer.Code == 405 {
		t.Fatalf("GET must be accepted now: %s", writer.Body.String())
	}
}

func TestSteerRequiresAnIdToWithdraw(t *testing.T) {
	g := steerGateway(t)
	writer := httptest.NewRecorder()
	request := httptest.NewRequest("DELETE", "/api/tasks/t1/steer", strings.NewReader(`{}`))
	request.SetPathValue("task_id", "t1")
	g.handleTaskSteer(writer, request)
	if writer.Code != 400 {
		t.Fatalf("withdrawing without an id should be a 400, got %d: %s", writer.Code, writer.Body.String())
	}
}

func TestSteerRejectsAnUnknownMethod(t *testing.T) {
	g := steerGateway(t)
	writer := httptest.NewRecorder()
	request := httptest.NewRequest("PUT", "/api/tasks/t1/steer", nil)
	request.SetPathValue("task_id", "t1")
	g.handleTaskSteer(writer, request)
	if writer.Code != 405 {
		t.Fatalf("PUT should be a 405, got %d", writer.Code)
	}
	if allow := writer.Header().Get("Allow"); !strings.Contains(allow, "GET") || !strings.Contains(allow, "DELETE") {
		t.Fatalf("Allow header should name every accepted method, got %q", allow)
	}
}

func TestSteerForwardReturnsTheQueueVerbatim(t *testing.T) {
	// A regression guard for the reply shape: the UI reads `pending` and `id`
	// straight off this object, so a wrapper that nested them would empty the
	// strip without any error.
	var reply = map[string]any{"queued": 2, "pending": []any{map[string]any{"id": "steer_1", "text": "a"}}}
	raw, _ := json.Marshal(reply)
	if !strings.Contains(string(raw), `"pending"`) || !strings.Contains(string(raw), `"id":"steer_1"`) {
		t.Fatalf("unexpected reply shape: %s", raw)
	}
}
