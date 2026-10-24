package server

import (
	"os"
	"path/filepath"
	"testing"

	corev1 "0kay/gen/core/v1"

	"0kay/core/internal/registry"
)

// The log is the only durable copy of a conversation, so the tests are about
// what survives: a restart, a bad session id, and a truncated file.

func TestSessionLogAppendsAndReadsBack(t *testing.T) {
	dir := t.TempDir()
	log := NewSessionLog(filepath.Join(dir, "sessions"))

	if err := log.Append("s1", &corev1.ChatMessage{Role: "user", Content: "hello"}); err != nil {
		t.Fatalf("append: %v", err)
	}
	if err := log.Append("s1", &corev1.ChatMessage{Role: "assistant", Content: "hi"}); err != nil {
		t.Fatalf("append: %v", err)
	}

	messages := log.Read("s1", 0)
	if len(messages) != 2 {
		t.Fatalf("expected 2 messages, got %d", len(messages))
	}
	if messages[0].Content != "hello" || messages[1].Role != "assistant" {
		t.Fatalf("wrong round trip: %+v", messages)
	}
}

func TestSessionLogSurvivesANewInstance(t *testing.T) {
	dir := t.TempDir()
	first := NewSessionLog(dir)
	if err := first.Append("s1", &corev1.ChatMessage{Role: "user", Content: "before restart"}); err != nil {
		t.Fatalf("append: %v", err)
	}

	// A new instance is what a restart looks like: nothing in memory, one file.
	second := NewSessionLog(dir)
	messages := second.Read("s1", 10)
	if len(messages) != 1 || messages[0].Content != "before restart" {
		t.Fatalf("history lost across restart: %+v", messages)
	}
}

func TestSessionLogKeepsSeqIncreasingAcrossInstances(t *testing.T) {
	dir := t.TempDir()
	if err := NewSessionLog(dir).Append("s1", &corev1.ChatMessage{Role: "user", Content: "one"}); err != nil {
		t.Fatalf("append: %v", err)
	}
	second := NewSessionLog(dir)
	if err := second.Append("s1", &corev1.ChatMessage{Role: "user", Content: "two"}); err != nil {
		t.Fatalf("append: %v", err)
	}
	events := second.Events("s1", 0)
	if len(events) != 2 {
		t.Fatalf("expected 2 events, got %d", len(events))
	}
	if events[0].Seq >= events[1].Seq {
		t.Fatalf("seq did not increase: %d then %d", events[0].Seq, events[1].Seq)
	}
}

func TestSessionLogRejectsPathTraversal(t *testing.T) {
	log := NewSessionLog(t.TempDir())
	for _, id := range []string{"../../etc/passwd", "a/b", "", "x y"} {
		if err := log.Append(id, &corev1.ChatMessage{Role: "user", Content: "x"}); err != nil {
			t.Fatalf("append %q should be a silent no-op, got %v", id, err)
		}
		if got := log.Read(id, 0); len(got) != 0 {
			t.Fatalf("id %q was written somewhere", id)
		}
	}
}

func TestSessionLogEventsAfterCursor(t *testing.T) {
	log := NewSessionLog(t.TempDir())
	for _, text := range []string{"a", "b", "c"} {
		if err := log.Append("s1", &corev1.ChatMessage{Role: "user", Content: text}); err != nil {
			t.Fatalf("append: %v", err)
		}
	}
	events := log.Events("s1", 2)
	if len(events) != 1 || events[0].Seq != 3 {
		t.Fatalf("after=2 should return only seq 3, got %+v", events)
	}
}

func TestSessionLogSkipsCorruptLines(t *testing.T) {
	dir := t.TempDir()
	log := NewSessionLog(dir)
	if err := log.Append("s1", &corev1.ChatMessage{Role: "user", Content: "good"}); err != nil {
		t.Fatalf("append: %v", err)
	}
	// A half-written line is what a crash leaves behind. It must not take the
	// rest of the history with it.
	file := filepath.Join(dir, "s1.jsonl")
	if err := appendLine(file, "{\"seq\":99,\"kind\":\"message\""); err != nil {
		t.Fatalf("corrupt: %v", err)
	}
	messages := log.Read("s1", 0)
	if len(messages) != 1 || messages[0].Content != "good" {
		t.Fatalf("corrupt line broke the read: %+v", messages)
	}
}

func appendLine(path, line string) error {
	handle, err := os.OpenFile(path, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o600)
	if err != nil {
		return err
	}
	defer handle.Close()
	_, err = handle.WriteString(line + "\n")
	return err
}

// The wiring, not the file format: appending through the service must land on
// disk, and reading it back through the service must see it even after the
// in-memory map is gone.
func TestCoreServicePersistsSessionMessages(t *testing.T) {
	dir := t.TempDir()
	service := NewCoreServiceServer(registry.NewRegistry(), dir)

	service.appendSession("sess-1", &corev1.ChatMessage{Role: "user", Content: "remember this"})
	service.appendSession("sess-1", &corev1.ChatMessage{Role: "assistant", Content: "remembered"})

	// Drop the cache the way an eviction or a restart would.
	service.sessionMu.Lock()
	service.sessions = map[string][]*corev1.ChatMessage{}
	service.sessionMu.Unlock()

	messages := service.SessionMessages("sess-1")
	if len(messages) != 2 {
		t.Fatalf("expected the log to restore 2 messages, got %d", len(messages))
	}
	if messages[0].Content != "remember this" {
		t.Fatalf("wrong restore order: %+v", messages)
	}

	events := service.SessionEvents("sess-1", 0)
	if len(events) != 2 {
		t.Fatalf("expected 2 events, got %d", len(events))
	}
}
