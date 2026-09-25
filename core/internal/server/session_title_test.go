package server

import (
	"encoding/json"
	"path/filepath"
	"testing"
	"time"
)

func TestUsageSnapshotAggregatesByLocalDay(t *testing.T) {
	u := NewUsageStore(filepath.Join(t.TempDir(), "usage.json"))
	// Local midnight-adjacent timestamp (+08) must stay on its local calendar day.
	local := time.Date(2026, 9, 24, 1, 30, 0, 0, time.FixedZone("CST", 8*3600))
	u.Add(UsageRecord{Timestamp: local, RequestID: "a", SessionID: "s1", Model: "m", PromptTokens: 10, CompletionTokens: 5, TotalTokens: 15})
	snap := u.Snapshot()
	raw, err := json.Marshal(snap["by_day"])
	if err != nil {
		t.Fatal(err)
	}
	var byDay map[string]struct {
		Prompt     int32 `json:"prompt"`
		Completion int32 `json:"completion"`
		Total      int32 `json:"total"`
		Count      int32 `json:"count"`
	}
	if err := json.Unmarshal(raw, &byDay); err != nil {
		t.Fatal(err)
	}
	if byDay["2026-09-24"].Count != 1 {
		t.Fatalf("expected local day 2026-09-24, got %#v", byDay)
	}
	if snap["session_count"].(int) != 1 {
		t.Fatalf("session_count=%v", snap["session_count"])
	}
	if snap["request_count"].(int) != 1 {
		t.Fatalf("request_count=%v", snap["request_count"])
	}
}

func TestRenameAgentSession(t *testing.T) {
	s := &CoreServiceServer{tasks: map[string]*TaskInfo{}}
	id, err := s.CreateAgentSession("Agent session")
	if err != nil {
		t.Fatal(err)
	}
	if err := s.RenameAgentSession(id, "  Fix login bug  "); err != nil {
		t.Fatal(err)
	}
	if s.tasks[id].Prompt != "Fix login bug" {
		t.Fatalf("title=%q", s.tasks[id].Prompt)
	}
	if err := s.RenameAgentSession(id, "   "); err == nil {
		t.Fatal("empty title accepted")
	}
	if err := s.RenameAgentSession("agent-session:missing", "x"); err == nil {
		t.Fatal("missing session accepted")
	}
}

func TestSanitizeSessionTitle(t *testing.T) {
	got := sanitizeSessionTitle("Title: \"Fix  login\nbug\"")
	if got != "Fix login bug" {
		t.Fatalf("got %q", got)
	}
	long := sanitizeSessionTitle(string(make([]rune, 100)))
	if len([]rune(long)) != 60 {
		t.Fatalf("len=%d", len([]rune(long)))
	}
}

func TestIsPlaceholderSessionTitle(t *testing.T) {
	if !isPlaceholderSessionTitle("Agent session", "anything") {
		t.Fatal("default not placeholder")
	}
	if !isPlaceholderSessionTitle("新对话", "anything") {
		t.Fatal("新对话 not placeholder")
	}
	if !isPlaceholderSessionTitle("帮我写一个爬虫", "帮我写一个爬虫抓取新闻列表并保存到 CSV") {
		t.Fatal("first-message slice not placeholder")
	}
	if isPlaceholderSessionTitle("自定义标题", "帮我写一个爬虫") {
		t.Fatal("custom title treated as placeholder")
	}
}
