package obs

import (
	"context"
	"sync"
	"time"
)

// Span status values.
const (
	StatusOK    = "ok"
	StatusError = "error"
)

// Span kinds, mirroring the usual tracing vocabulary.
const (
	KindServer   = "server"
	KindClient   = "client"
	KindInternal = "internal"
	KindPlugin   = "plugin"
)

// SpanEvent is a timestamped marker inside a span (a retry, a cache hit, a
// model switch). Events are what make a slow turn explainable without needing a
// full trace backend.
type SpanEvent struct {
	UnixNano int64             `json:"unix_nano"`
	Name     string            `json:"name"`
	Attrs    map[string]string `json:"attrs,omitempty"`
}

// SpanRecord is the immutable form of a finished span: what the store retains
// and what subscribers receive. It deliberately holds no lock, so it can be
// copied, marshalled and ranged over freely.
//
// The live, mutable handle is Span; SpanRecord is what it degrades into on End.
type SpanRecord struct {
	TraceID    string            `json:"trace_id"`
	SpanID     string            `json:"span_id"`
	ParentID   string            `json:"parent_id,omitempty"`
	Name       string            `json:"name"`
	Kind       string            `json:"kind"`
	StartUnix  int64             `json:"start_unix_nano"`
	DurationNs int64             `json:"duration_ns"`
	Status     string            `json:"status"`
	Error      string            `json:"error,omitempty"`
	Attrs      map[string]string `json:"attrs,omitempty"`
	Events     []SpanEvent       `json:"events,omitempty"`
}

// Span is the in-flight handle a request goroutine holds. Every method is safe
// for concurrent use because a span may be annotated from a callback while the
// owner is still running.
type Span struct {
	mu       sync.Mutex
	record   SpanRecord
	ended    bool
	start    time.Time
	children int
}

// TraceID returns the trace this span belongs to.
func (s *Span) TraceID() string {
	if s == nil {
		return ""
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.record.TraceID
}

// SpanID returns this span's id.
func (s *Span) SpanID() string {
	if s == nil {
		return ""
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.record.SpanID
}

// ParentID returns the enclosing span's id, or "" for a root span.
func (s *Span) ParentID() string {
	if s == nil {
		return ""
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.record.ParentID
}

// Duration is how long the span ran, or has been running if it is still open.
func (s *Span) Duration() time.Duration {
	if s == nil {
		return 0
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.record.DurationNs > 0 {
		return time.Duration(s.record.DurationNs)
	}
	if s.start.IsZero() {
		return 0
	}
	return time.Since(s.start)
}

// Attr sets a key on the span. A late Attr (after End) still lands, because the
// value is occasionally only known once the body has been decoded.
func (s *Span) Attr(key, value string) {
	if s == nil || value == "" {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.record.Attrs == nil {
		s.record.Attrs = make(map[string]string, 4)
	}
	s.record.Attrs[key] = value
}

// Event records a marker inside the span.
func (s *Span) Event(name string, attrs map[string]string) {
	if s == nil {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.record.Events = append(s.record.Events, SpanEvent{UnixNano: time.Now().UnixNano(), Name: name, Attrs: attrs})
}

// Fail marks the span errored and records the message. Kept separate from End so
// the caller does not have to decide the status itself.
func (s *Span) Fail(err error) {
	if s == nil || err == nil {
		return
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	s.record.Status = StatusError
	s.record.Error = err.Error()
}

// End closes the span and publishes it to the store. Calling End twice is a
// no-op, so a deferred End alongside an early explicit End is safe.
func (s *Span) End() {
	if s == nil {
		return
	}
	s.mu.Lock()
	if s.ended {
		s.mu.Unlock()
		return
	}
	s.ended = true
	if s.record.Status == "" {
		s.record.Status = StatusOK
	}
	s.record.DurationNs = time.Since(s.start).Nanoseconds()
	rec := s.record
	s.mu.Unlock()
	store.publish(rec)
}

// Record returns the immutable snapshot of the span as it currently stands.
func (s *Span) Record() SpanRecord {
	if s == nil {
		return SpanRecord{}
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	rec := s.record
	if len(s.record.Events) > 0 {
		rec.Events = append([]SpanEvent(nil), s.record.Events...)
	}
	if len(s.record.Attrs) > 0 {
		rec.Attrs = make(map[string]string, len(s.record.Attrs))
		for k, v := range s.record.Attrs {
			rec.Attrs[k] = v
		}
	}
	return rec
}

// defaultSpans bounds the retained span history. The WebUI trace view pages
// through this; the number is a memory/latency trade, and 2000 spans covers a
// busy agent run or a couple of hours of an idle server.
const defaultSpans = 2000

type spanStore struct {
	mu    sync.RWMutex
	ring  []SpanRecord
	next  int
	limit int
	subs  map[int]chan SpanRecord
	subID int
}

// store is the process-wide span ring. subs is initialised here rather than
// left nil: assigning into a nil map panics, and that panic would land while
// holding the mutex, turning every later Reset into a deadlock.
var store = &spanStore{limit: defaultSpans, subs: map[int]chan SpanRecord{}}

func (s *spanStore) publish(rec SpanRecord) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if len(s.ring) < s.limit {
		s.ring = append(s.ring, rec)
	} else {
		s.ring[s.next] = rec
		s.next = (s.next + 1) % s.limit
	}
	// Fan out under the lock: Subscribe()'s cancel closes the channel under the
	// same lock, so a snapshot-then-send outside it could send on a closed
	// channel and panic. The send is non-blocking, so a slow subscriber only
	// drops records here; it cannot stall the request that produced the span.
	for _, ch := range s.subs {
		select {
		case ch <- rec:
		default:
		}
	}
}

// Recent returns up to limit spans, oldest first. A limit <= 0 returns
// everything retained; traceID, when set, restricts to one trace.
func (s *spanStore) Recent(limit int, traceID string) []SpanRecord {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]SpanRecord, 0, len(s.ring))
	// Once the ring has wrapped, the oldest entry is the one at `next`, not the
	// one at index 0. Walking in slice order would return the window newest-first
	// and break every consumer that assumes chronological order.
	start := 0
	if len(s.ring) == s.limit {
		start = s.next
	}
	for i := 0; i < len(s.ring); i++ {
		rec := s.ring[(start+i)%len(s.ring)]
		if traceID != "" && rec.TraceID != traceID {
			continue
		}
		out = append(out, rec)
	}
	if limit > 0 && len(out) > limit {
		out = out[len(out)-limit:]
	}
	return out
}

// Subscribe returns a channel of live spans plus a cancel func. The channel is
// buffered; overflow drops spans for this subscriber rather than blocking.
func (s *spanStore) Subscribe(buffer int) (<-chan SpanRecord, func()) {
	if buffer <= 0 {
		buffer = 256
	}
	ch := make(chan SpanRecord, buffer)
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.subs == nil {
		s.subs = map[int]chan SpanRecord{}
	}
	s.subID++
	id := s.subID
	s.subs[id] = ch
	var once sync.Once
	return ch, func() {
		once.Do(func() {
			s.mu.Lock()
			delete(s.subs, id)
			s.mu.Unlock()
			close(ch)
		})
	}
}

// RecentSpans returns retained spans, oldest first.
func RecentSpans(limit int, traceID string) []SpanRecord { return store.Recent(limit, traceID) }

// SubscribeSpans streams live spans until cancel is called.
func SubscribeSpans(buffer int) (<-chan SpanRecord, func()) { return store.Subscribe(buffer) }

// ResetSpans clears the retained spans. Used by tests and the console's clear.
func ResetSpans() {
	store.mu.Lock()
	store.ring, store.next = nil, 0
	store.mu.Unlock()
}

// Start begins a root span and returns a ctx carrying it. The caller must End.
func Start(ctx context.Context, name, kind string) (context.Context, *Span) {
	return StartWithID(ctx, "", name, kind)
}

// StartWithID begins a root span whose trace id is the supplied one. An empty
// id generates a fresh trace.
//
// This exists so an HTTP layer that has already decided on a correlation id (an
// inbound X-0kay-Request-Id, or the chat body's request_id the UI echoes back)
// can make the span, the access log and the response all agree on one value.
// Letting Start mint its own id in that case produced two identifiers for a
// single request, and only one of them was visible to the user.
func StartWithID(ctx context.Context, traceID, name, kind string) (context.Context, *Span) {
	if traceID == "" {
		traceID = NewID()
	}
	now := time.Now()
	span := &Span{
		start: now,
		record: SpanRecord{
			TraceID:   traceID,
			SpanID:    NewID(),
			Name:      name,
			Kind:      kind,
			StartUnix: now.UnixNano(),
		},
	}
	return withSpan(WithTraceID(ctx, traceID), span), span
}

// Child begins a nested span under whichever span ctx already carries. With no
// parent it degrades to a root span rather than dropping the measurement,
// because losing a measurement is worse than having a slightly flat trace.
func Child(ctx context.Context, name, kind string) (context.Context, *Span) {
	parent := spanFrom(ctx)
	if parent == nil {
		return Start(ctx, name, kind)
	}
	parentID := parent.SpanID()
	parent.mu.Lock()
	parent.children++
	parent.mu.Unlock()
	span := &Span{
		start: time.Now(),
		record: SpanRecord{
			TraceID:   parent.TraceID(),
			SpanID:    NewID(),
			ParentID:  parentID,
			Name:      name,
			Kind:      kind,
			StartUnix: time.Now().UnixNano(),
		},
	}
	return withSpan(ctx, span), span
}

// SpanFrom returns the span ctx carries, or nil.
func SpanFrom(ctx context.Context) *Span { return spanFrom(ctx) }
