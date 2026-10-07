package obs

import (
	"log/slog"
	"strings"
	"sync"
	"time"
)

// LogRecord is one emitted log line, shaped for the WebUI console.
type LogRecord struct {
	Time    time.Time      `json:"time"`
	Level   string         `json:"level"`
	Message string         `json:"message"`
	Fields  map[string]any `json:"fields,omitempty"`
	TraceID string         `json:"trace_id,omitempty"`
	SpanID  string         `json:"span_id,omitempty"`
	// Source separates records this process emitted from records forwarded by a
	// plugin (LIFE writes its own JSON logs to a file that Core tails).
	Source string `json:"source,omitempty"`
}

// defaultLogBuffer bounds the replay buffer. A console that opens after the fact
// shows the last few hundred lines instead of starting blank, which is what
// makes "it already failed, tell me why" answerable.
const (
	defaultLogBuffer = 500
	logSubscriberBuf = 128
)

type logHub struct {
	mu    sync.RWMutex
	ring  []LogRecord
	next  int
	full  bool
	limit int
	subs  map[int]chan LogRecord
	subID int
}

func newHub() *logHub {
	return &logHub{limit: defaultLogBuffer, subs: map[int]chan LogRecord{}}
}

// record converts a slog record into a LogRecord and fans it out. Called from
// the handler chain, so it must not block.
func (h *logHub) record(r slog.Record) {
	rec := LogRecord{Time: r.Time, Level: r.Level.String(), Message: r.Message}
	if rec.Time.IsZero() {
		rec.Time = time.Now()
	}
	r.Attrs(func(a slog.Attr) bool {
		v := a.Value.Resolve()
		switch a.Key {
		case "trace_id":
			// Note: returning true continues the walk. Returning false here
			// would stop Record.Attrs and silently drop every attribute after
			// this one.
			rec.TraceID = v.String()
			return true
		case "span":
			rec.SpanID = v.String()
			return true
		}
		if rec.Fields == nil {
			rec.Fields = make(map[string]any, 4)
		}
		rec.Fields[a.Key] = v.Any()
		return true
	})
	h.publish(rec)
}

func (h *logHub) publish(rec LogRecord) {
	h.mu.Lock()
	defer h.mu.Unlock()
	if len(h.ring) < h.limit {
		h.ring = append(h.ring, rec)
	} else {
		h.ring[h.next] = rec
		h.next = (h.next + 1) % h.limit
		h.full = true
	}
	// Fan out while still holding the lock. subscribe()'s cancel deletes the
	// subscriber and closes its channel under this same lock, so a publisher
	// that captured the channel before deletion would otherwise send on a
	// closed channel and panic the whole process. The send is non-blocking
	// (the default case), so holding the lock cannot stall on a slow
	// subscriber.
	for _, ch := range h.subs {
		select {
		case ch <- rec:
		default:
		}
	}
}

// Recent returns buffered records, oldest first, filtered by minimum level and
// optional substring match over the message.
func (h *logHub) recent(limit int, minLevel slog.Level, contains string) []LogRecord {
	h.mu.RLock()
	defer h.mu.RUnlock()
	out := make([]LogRecord, 0, len(h.ring))
	// Same wrap rule as the span ring: once the buffer is full, index `next`
	// holds the oldest record, so walking in slice order would come out
	// newest-first and break the console's ordering.
	start := 0
	if len(h.ring) == h.limit {
		start = h.next
	}
	for i := 0; i < len(h.ring); i++ {
		rec := h.ring[(start+i)%len(h.ring)]
		if minLevel > slog.LevelDebug && levelValue(rec.Level) < minLevel {
			continue
		}
		if contains != "" && !containsMatch(rec, contains) {
			continue
		}
		out = append(out, rec)
	}
	if limit > 0 && len(out) > limit {
		out = out[len(out)-limit:]
	}
	return out
}

// Matches reports whether needle appears in the record's message, trace id or
// any string field. Exported so the SSE filter can reuse the same rule as the
// snapshot query instead of drifting from it.
func Matches(rec LogRecord, needle string) bool { return containsMatch(rec, needle) }

// containsMatch reports whether needle appears in the message or in any string
// field, so filtering by an error message or a request id works.
func containsMatch(rec LogRecord, needle string) bool {
	if strings.Contains(rec.Message, needle) || strings.Contains(rec.TraceID, needle) {
		return true
	}
	for _, v := range rec.Fields {
		if s, ok := v.(string); ok && strings.Contains(s, needle) {
			return true
		}
	}
	return false
}

func levelValue(name string) slog.Level {
	switch name {
	case "DEBUG":
		return slog.LevelDebug
	case "WARN":
		return slog.LevelWarn
	case "ERROR":
		return slog.LevelError
	default:
		return slog.LevelInfo
	}
}

func (h *logHub) subscribe() (<-chan LogRecord, func()) {
	ch := make(chan LogRecord, logSubscriberBuf)
	h.mu.Lock()
	defer h.mu.Unlock()
	if h.subs == nil {
		h.subs = map[int]chan LogRecord{}
	}
	h.subID++
	id := h.subID
	h.subs[id] = ch
	var once sync.Once
	return ch, func() {
		once.Do(func() {
			h.mu.Lock()
			delete(h.subs, id)
			h.mu.Unlock()
			close(ch)
		})
	}
}

// RecentLogs returns buffered log records for the console's initial load.
func RecentLogs(limit int, minLevel slog.Level, contains string) []LogRecord {
	return hub.recent(limit, minLevel, contains)
}

// SubscribeLogs streams live log records until cancel is called.
func SubscribeLogs() (<-chan LogRecord, func()) { return hub.subscribe() }

// ResetLogs clears the replay buffer.
func ResetLogs() {
	hub.mu.Lock()
	hub.ring, hub.next, hub.full = nil, 0, false
	hub.mu.Unlock()
}
