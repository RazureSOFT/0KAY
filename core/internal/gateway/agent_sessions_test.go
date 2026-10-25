package gateway

import (
	"context"
	"encoding/json"
	"net/http/httptest"
	"path/filepath"
	"strings"
	"testing"

	"0kay/core/internal/registry"
	"0kay/core/internal/server"
)

func TestAgentSessionCanBeCreatedWithoutExecutor(t *testing.T) {
	t.Setenv("TASKS_PATH", filepath.Join(t.TempDir(), "tasks.json"))
	t.Setenv("USAGE_PATH", filepath.Join(t.TempDir(), "usage.json"))
	core := server.NewCoreServiceServer(nil)
	gateway := &Gateway{localCore: core}
	writer := httptest.NewRecorder()
	gateway.handleAgentSessions(writer, httptest.NewRequest("POST", "/api/agent/sessions", strings.NewReader(`{"title":"offline session"}`)))
	if writer.Code != 201 {
		t.Fatal(writer.Code, writer.Body.String())
	}
	var created map[string]string
	if err := json.Unmarshal(writer.Body.Bytes(), &created); err != nil {
		t.Fatal(err)
	}
	if !core.HasAgentSession(created["session_id"]) {
		t.Fatal("session not created")
	}
	restored := server.NewCoreServiceServer(nil)
	if !restored.HasAgentSession(created["session_id"]) {
		t.Fatal("session history should survive a restart")
	}
}

func newCompactionCore(t *testing.T) (*Gateway, *server.CoreServiceServer, string) {
	t.Setenv("TASKS_PATH", filepath.Join(t.TempDir(), "tasks.json"))
	t.Setenv("USAGE_PATH", filepath.Join(t.TempDir(), "usage.json"))
	core := server.NewCoreServiceServer(nil)
	g := &Gateway{localCore: core, registry: registry.NewRegistry()}
	sessionID, err := core.CreateAgentSession("compaction")
	if err != nil {
		t.Fatal(err)
	}
	return g, core, sessionID
}

func recordDoneTask(t *testing.T, core *server.CoreServiceServer, sessionID, id, kind, prompt, result string) {
	t.Helper()
	if err := core.RecordTask(server.TaskEvent{TaskID: id, SessionID: sessionID, CallerID: "webui", Kind: kind, Prompt: prompt, State: "done", Result: result}); err != nil {
		t.Fatal(err)
	}
}

func TestSessionContextTokensSkipsFoldedTurns(t *testing.T) {
	g, core, sessionID := newCompactionCore(t)
	recordDoneTask(t, core, sessionID, "t-old", "agent", "old prompt folded away", "old result folded away")
	recordDoneTask(t, core, sessionID, "c-1", "compact", "/compact", "carried summary")
	recordDoneTask(t, core, sessionID, "t-new", "agent", "new prompt", "new result")

	want := estimateTextTokens("new prompt") + estimateTextTokens("new result") + estimateTextTokens("carried summary")
	if got := g.sessionContextTokens(sessionID); got != want {
		t.Fatalf("sessionContextTokens = %d, want %d (folded turns must not count)", got, want)
	}
}

func TestSessionContextTokensWithoutCompactCountsAll(t *testing.T) {
	g, core, sessionID := newCompactionCore(t)
	recordDoneTask(t, core, sessionID, "t-a", "agent", "prompt a", "result a")
	recordDoneTask(t, core, sessionID, "t-b", "agent", "prompt b", "result b")

	want := estimateTextTokens("prompt a") + estimateTextTokens("result a") + estimateTextTokens("prompt b") + estimateTextTokens("result b")
	if got := g.sessionContextTokens(sessionID); got != want {
		t.Fatalf("sessionContextTokens = %d, want %d", got, want)
	}
}

func recordedCompactArgs(t *testing.T, core *server.CoreServiceServer, sessionID string) map[string]any {
	t.Helper()
	for _, task := range core.SessionTasks(sessionID) {
		if task["kind"] != "compact" {
			continue
		}
		raw, _ := task["args"].(string)
		var args map[string]any
		if err := json.Unmarshal([]byte(raw), &args); err != nil {
			t.Fatal(err)
		}
		return args
	}
	t.Fatal("no compact task recorded")
	return nil
}

func TestCompactSessionStopsAtPreviousCompact(t *testing.T) {
	g, core, sessionID := newCompactionCore(t)
	recordDoneTask(t, core, sessionID, "t-old", "agent", "already folded prompt", "already folded result")
	recordDoneTask(t, core, sessionID, "c-1", "compact", "/compact", "earlier summary")
	recordDoneTask(t, core, sessionID, "t-new", "agent", "fresh prompt", "fresh result")

	// No LIFE plugin and no credentials: compaction fails downstream, but the
	// recorded args still reveal which turns were fed into the attempt.
	if _, err := g.compactSession(context.Background(), sessionID, ""); err == nil {
		t.Fatal("expected compaction to fail without a summarizer")
	}
	args := recordedCompactArgs(t, core, sessionID)
	ids, _ := args["ids"].([]any)
	if len(ids) != 1 || ids[0] != "t-new" {
		t.Fatalf("folded ids = %#v, want only [t-new]; already-folded turns leaked back in", ids)
	}
	if args["from"] != "t-new" || args["to"] != "t-new" {
		t.Fatalf("from/to = %#v/%#v, want t-new/t-new", args["from"], args["to"])
	}
}

func TestCompactSessionFoldsFullWindowWithoutEarlierCompact(t *testing.T) {
	g, core, sessionID := newCompactionCore(t)
	recordDoneTask(t, core, sessionID, "t-a", "agent", "prompt a", "result a")
	recordDoneTask(t, core, sessionID, "t-b", "agent", "prompt b", "result b")

	if _, err := g.compactSession(context.Background(), sessionID, ""); err == nil {
		t.Fatal("expected compaction to fail without a summarizer")
	}
	args := recordedCompactArgs(t, core, sessionID)
	if args["from"] != "t-a" || args["to"] != "t-b" {
		t.Fatalf("from/to = %#v/%#v, want t-a/t-b", args["from"], args["to"])
	}
	ids, _ := args["ids"].([]any)
	if len(ids) != 2 || ids[0] != "t-a" || ids[1] != "t-b" {
		t.Fatalf("folded ids = %#v, want [t-a t-b]", ids)
	}
}

func TestCompactSessionWaitsForActiveWork(t *testing.T) {
	g, core, sessionID := newCompactionCore(t)
	recordDoneTask(t, core, sessionID, "t-a", "agent", "prompt a", "result a")
	if err := core.RecordTask(server.TaskEvent{TaskID: "t-live", SessionID: sessionID, CallerID: "webui", Kind: "agent", Prompt: "in flight", State: "running"}); err != nil {
		t.Fatal(err)
	}
	if _, err := g.compactSession(context.Background(), sessionID, ""); err == nil || !strings.Contains(err.Error(), "active work") {
		t.Fatalf("err = %v, want active work error", err)
	}
}
