package server

import (
	"bufio"
	"encoding/json"
	"os"
	"path/filepath"
	"regexp"
	"sync"
	"time"

	"google.golang.org/protobuf/encoding/protojson"

	corev1 "0kay/gen/core/v1"
)

// Append-only session log.
//
// Chat sessions used to live in a map with a 200-message cap and nothing on
// disk: restart Core and every conversation is gone, which makes "the companion
// remembers you" true only until the next deploy.
//
// This is the smallest thing that fixes it and the shape a replay needs: one
// JSONL file per session, one line per message, ordered by an increasing seq.
// Reading is a scan; the in-memory slice stays the hot path, this is the truth.

const sessionLogLimit = 400

var sessionIDPattern = regexp.MustCompile(`^[A-Za-z0-9_.:-]{1,128}$`)

// SessionEvent is one durable fact about a session.
type SessionEvent struct {
	Seq     int             `json:"seq"`
	At      time.Time       `json:"at"`
	Kind    string          `json:"kind"`
	Role    string          `json:"role,omitempty"`
	Message json.RawMessage `json:"message,omitempty"`
}

type SessionLog struct {
	dir string
	mu  sync.Mutex
}

func NewSessionLog(dir string) *SessionLog {
	_ = os.MkdirAll(dir, 0o700)
	return &SessionLog{dir: dir}
}

// A session id arrives from the network, so it never reaches the filesystem
// unvalidated: "../../etc/passwd" is a valid-looking id.
func (l *SessionLog) path(sessionID string) (string, bool) {
	if l == nil || !sessionIDPattern.MatchString(sessionID) {
		return "", false
	}
	return filepath.Join(l.dir, sessionID+".jsonl"), true
}

// Append writes the messages as events. A failure is logged by the caller's
// discipline: the chat still works, the history is just thinner.
func (l *SessionLog) Append(sessionID string, msgs ...*corev1.ChatMessage) error {
	file, ok := l.path(sessionID)
	if !ok || len(msgs) == 0 {
		return nil
	}
	l.mu.Lock()
	defer l.mu.Unlock()

	seq := l.lastSeqLocked(file)
	handle, err := os.OpenFile(file, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o600)
	if err != nil {
		return err
	}
	defer handle.Close()

	writer := bufio.NewWriter(handle)
	now := time.Now().UTC()
	for _, msg := range msgs {
		if msg == nil {
			continue
		}
		payload, err := protojson.Marshal(msg)
		if err != nil {
			continue
		}
		seq++
		line, err := json.Marshal(SessionEvent{
			Seq:     seq,
			At:      now,
			Kind:    "message",
			Role:    msg.Role,
			Message: payload,
		})
		if err != nil {
			continue
		}
		if _, err := writer.Write(append(line, '\n')); err != nil {
			return err
		}
	}
	return writer.Flush()
}

// Read returns the last `limit` messages, oldest first.
func (l *SessionLog) Read(sessionID string, limit int) []*corev1.ChatMessage {
	events := l.Events(sessionID, 0)
	if limit > 0 && len(events) > limit {
		events = events[len(events)-limit:]
	}
	out := make([]*corev1.ChatMessage, 0, len(events))
	for _, event := range events {
		msg := &corev1.ChatMessage{}
		if err := protojson.Unmarshal(event.Message, msg); err != nil {
			continue
		}
		out = append(out, msg)
	}
	return out
}

// Events returns every event with Seq > after. Used by the replay endpoint.
func (l *SessionLog) Events(sessionID string, after int) []SessionEvent {
	file, ok := l.path(sessionID)
	if !ok {
		return nil
	}
	l.mu.Lock()
	defer l.mu.Unlock()

	handle, err := os.Open(file)
	if err != nil {
		return nil
	}
	defer handle.Close()

	var out []SessionEvent
	scanner := bufio.NewScanner(handle)
	scanner.Buffer(make([]byte, 0, 64*1024), 8*1024*1024)
	for scanner.Scan() {
		var event SessionEvent
		if err := json.Unmarshal(scanner.Bytes(), &event); err != nil {
			continue
		}
		if event.Seq <= after {
			continue
		}
		out = append(out, event)
		if len(out) > sessionLogLimit*4 {
			break
		}
	}
	return out
}

// lastSeqLocked finds the current tail so appends stay ordered across restarts.
// The file is small enough to scan; a separate index file is not worth the way
// it can disagree with the log.
func (l *SessionLog) lastSeqLocked(file string) int {
	handle, err := os.Open(file)
	if err != nil {
		return 0
	}
	defer handle.Close()
	last := 0
	scanner := bufio.NewScanner(handle)
	scanner.Buffer(make([]byte, 0, 64*1024), 8*1024*1024)
	for scanner.Scan() {
		var event SessionEvent
		if err := json.Unmarshal(scanner.Bytes(), &event); err == nil && event.Seq > last {
			last = event.Seq
		}
	}
	return last
}

// Delete removes a session's history. Called when the session itself is deleted.
func (l *SessionLog) Delete(sessionID string) {
	if file, ok := l.path(sessionID); ok {
		_ = os.Remove(file)
	}
}
