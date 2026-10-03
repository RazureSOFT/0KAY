package server

import (
	"encoding/json"
	"fmt"
	"path/filepath"
	"strings"
	"testing"
)

func TestCancelledTaskCannotBecomeDone(t *testing.T) {
	s := &CoreServiceServer{tasks: map[string]*TaskInfo{"task": {State: "cancelled"}}}
	s.finishTask("task", "done", "late result", "")
	if s.tasks["task"].State != "cancelled" {
		t.Fatal("late execution overwrote cancellation")
	}
	if s.tasks["task"].Result != "" {
		t.Fatal("cancelled task accepted a success result")
	}
}

func TestTaskLedgerAndSessionHistory(t *testing.T) {
	s := &CoreServiceServer{tasks: map[string]*TaskInfo{}}
	session, err := s.CreateAgentSession("Coding")
	if err != nil || !s.HasAgentSession(session) {
		t.Fatalf("create session: %v", err)
	}
	if err = s.RecordTask(TaskEvent{TaskID: "first", SessionID: session, Kind: "agent", Prompt: "make file", State: "pending"}); err != nil {
		t.Fatal(err)
	}
	if err = s.RecordTask(TaskEvent{TaskID: "second", SessionID: session, Kind: "agent", State: "pending"}); err == nil {
		t.Fatal("concurrent session turn accepted")
	}
	if err = s.RecordTask(TaskEvent{TaskID: "first", State: "done", Result: "created example.py"}); err != nil {
		t.Fatal(err)
	}
	prompt := s.AgentSessionPrompt(session, "second", "run it")
	if !strings.Contains(prompt, "example.py") || !strings.Contains(prompt, "run it") {
		t.Fatal(prompt)
	}
	for i := 0; i < 60; i++ {
		id := string(rune('a' + i))
		_ = s.RecordTask(TaskEvent{TaskID: id, Kind: "tool", State: "running"})
		s.finishTask(id, "done", "ok", "")
	}
	if len(s.ListTasks()) < 62 {
		t.Fatal("task history was silently truncated")
	}
}

func TestLifeSessionCanBeContinuedByUser(t *testing.T) {
	s := &CoreServiceServer{tasks: map[string]*TaskInfo{}}
	id := s.EnsureAgentSession("webui:original", "life", "Research")
	if !s.HasAgentSession(id) {
		t.Fatal("LIFE session missing")
	}
	if s.EnsureAgentSession("webui:original", "life", "followup") != id {
		t.Fatal("LIFE continuation created a new session")
	}
	if s.EnsureAgentSession(id, "webui", "direct question") != id {
		t.Fatal("user could not join LIFE session")
	}
	_ = s.RecordTask(TaskEvent{TaskID: "life-turn", Kind: "agent", SessionID: id, CallerID: "life", Prompt: "research this", State: "done", Result: "findings"})
	prompt := s.AgentSessionPrompt(id, "user-turn", "explain findings")
	if !strings.Contains(prompt, "LIFE:") || !strings.Contains(prompt, "findings") {
		t.Fatal(prompt)
	}
}

func TestArchiveDeleteAndStableOrdering(t *testing.T) {
	s := &CoreServiceServer{tasks: map[string]*TaskInfo{}}
	id, _ := s.CreateAgentSession("session")
	_ = s.RecordTask(TaskEvent{TaskID: "turn", SessionID: id, Kind: "agent", State: "done", Result: "kept"})
	if err := s.ManageAgentSession(id, "archive"); err != nil {
		t.Fatal(err)
	}
	if s.HasAgentSession(id) {
		t.Fatal("archived session accepts turns")
	}
	if s.tasks["turn"].Result != "kept" {
		t.Fatal("archive deleted messages")
	}
	if err := s.ManageAgentSession(id, "restore"); err != nil {
		t.Fatal(err)
	}
	if !s.HasAgentSession(id) {
		t.Fatal("restore failed")
	}
	first, _ := json.Marshal(s.ListTasks())
	for i := 0; i < 20; i++ {
		next, _ := json.Marshal(s.ListTasks())
		if string(first) != string(next) {
			t.Fatal("unstable ordering")
		}
	}
	if err := s.ManageAgentSession(id, "delete"); err != nil {
		t.Fatal(err)
	}
	if len(s.ListTasks()) != 0 {
		t.Fatal("deleted session visible")
	}
	if err := s.RecordTask(TaskEvent{TaskID: "late", SessionID: id, State: "done"}); err == nil {
		t.Fatal("late event resurrected session")
	}
}

func TestCompactionReplacesContextButKeepsTranscript(t *testing.T) {
	s := &CoreServiceServer{tasks: map[string]*TaskInfo{}}
	id, _ := s.CreateAgentSession("compact")
	_ = s.RecordTask(TaskEvent{TaskID: "before", SessionID: id, Kind: "agent", Prompt: "old verbose text", State: "done", Result: "old result"})
	_ = s.RecordTask(TaskEvent{TaskID: "summary", SessionID: id, Kind: "compact", State: "done", Result: "important retained facts"})
	_ = s.RecordTask(TaskEvent{TaskID: "after", SessionID: id, Kind: "agent", Prompt: "new question", State: "done", Result: "new answer"})
	prompt := s.AgentSessionPrompt(id, "next", "continue")
	if strings.Contains(prompt, "old verbose text") || !strings.Contains(prompt, "important retained facts") || !strings.Contains(prompt, "new answer") {
		t.Fatal(prompt)
	}
	if s.tasks["before"] == nil {
		t.Fatal("compaction deleted transcript")
	}
}

func TestTaskDeltaResetIsLightweight(t *testing.T) {
	s := &CoreServiceServer{tasks: map[string]*TaskInfo{}}
	session, _ := s.CreateAgentSession("s")
	for i := 0; i < 300; i++ {
		id := fmt.Sprintf("tool-%03d", i)
		_ = s.RecordTask(TaskEvent{TaskID: id, Kind: "tool", State: "running"})
		s.finishTask(id, "done", "ok", "")
	}
	rows, _ := s.TaskDelta("")["tasks"].([]map[string]interface{})
	if len(rows) > resetTaskLimit+10 {
		t.Fatalf("reset dumped %d rows; want <= %d", len(rows), resetTaskLimit+10)
	}
	seen := false
	for _, row := range rows {
		if row["task_id"] == session {
			seen = true
		}
	}
	if !seen {
		t.Fatal("reset omitted the session row")
	}
}

func TestSessionTurnsPageAndPersistenceAcrossRestart(t *testing.T) {
	path := filepath.Join(t.TempDir(), "tasks.json")
	t.Setenv("TASKS_PATH", path)
	t.Setenv("USAGE_PATH", filepath.Join(t.TempDir(), "usage.json"))
	s := NewCoreServiceServer(nil)
	id, err := s.CreateAgentSession("paging")
	if err != nil {
		t.Fatal(err)
	}
	for i := 0; i < 120; i++ {
		_ = s.RecordTask(TaskEvent{TaskID: fmt.Sprintf("turn-%03d", i), SessionID: id, Kind: "agent", Prompt: fmt.Sprintf("ask %d", i), State: "done", Result: fmt.Sprintf("answer %d", i)})
	}
	big := strings.Repeat("x", 100000)
	_ = s.RecordTask(TaskEvent{TaskID: "big", SessionID: id, Kind: "agent", State: "done", Result: big, Reasoning: big})

	first, more, next := s.SessionTasksPage(id, "", 50)
	if len(first) != 50 || !more || next == "" {
		t.Fatalf("page1 len=%d more=%v next=%q", len(first), more, next)
	}
	second, more2, _ := s.SessionTasksPage(id, next, 50)
	if len(second) != 50 || !more2 {
		t.Fatalf("page2 len=%d more=%v", len(second), more2)
	}
	if first[len(first)-1]["task_id"] == second[0]["task_id"] {
		t.Fatal("pages overlap")
	}

	restored := NewCoreServiceServer(nil)
	if !restored.HasAgentSession(id) {
		t.Fatal("session lost across restart")
	}
	rows, _, _ := restored.SessionTasksPage(id, "", 200)
	foundBig := false
	for _, row := range rows {
		if row["task_id"] != "big" {
			continue
		}
		foundBig = true
		if result, _ := row["result"].(string); len(result) > persistedResultLimit+32 {
			t.Fatalf("persisted result not clipped: %d", len(result))
		}
		if reasoning, _ := row["reasoning"].(string); len(reasoning) > persistedReasoningLimit+32 {
			t.Fatalf("persisted reasoning not clipped: %d", len(reasoning))
		}
	}
	if !foundBig {
		t.Fatal("task row lost across restart")
	}
}

func TestRenameSessionAndUsageDedup(t *testing.T) {
	s := &CoreServiceServer{tasks: map[string]*TaskInfo{}, usage: NewUsageStore("")}
	id, _ := s.CreateAgentSession("Agent session")
	if err := s.RenameAgentSession(id, "修复登录"); err != nil {
		t.Fatal(err)
	}
	if s.tasks[id].Prompt != "修复登录" {
		t.Fatalf("title=%q", s.tasks[id].Prompt)
	}
	s.RecordUsage(UsageRecord{RequestID: "dup", Model: "m", PromptTokens: 1, CompletionTokens: 1})
	s.RecordUsage(UsageRecord{RequestID: "dup", Model: "m", PromptTokens: 1, CompletionTokens: 1})
	if len(s.usage.records) != 1 {
		t.Fatalf("duplicate request recorded: %d", len(s.usage.records))
	}
}
