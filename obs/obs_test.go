package obs

import (
	"bytes"
	"context"
	"encoding/json"
	"log"
	"log/slog"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"testing"
	"time"
)

func TestInitRoutesStdlibLogIntoSlog(t *testing.T) {
	// The whole point of slog.SetDefault: an unmigrated log.Printf call site
	// still produces a structured record, which is what makes the logging
	// migration incremental rather than a big-bang rewrite. The assertion reads
	// the file sink because the stderr handler binds os.Stderr at Init time and
	// cannot be swapped afterwards.
	path := filepath.Join(t.TempDir(), "legacy.log")
	t.Setenv("CORE_LOG_FILE", path)
	t.Setenv("CORE_LOG_LEVEL", "debug")
	Init()
	t.Cleanup(func() { _ = Close() })

	// Exactly what an existing call site in this repository does today.
	log.Printf("[core] legacy call site")
	if err := Close(); err != nil {
		t.Fatal(err)
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	line := strings.TrimSpace(string(raw))
	if !strings.Contains(line, "legacy call site") {
		t.Fatalf("stdlib log did not reach the handler: %q", line)
	}
	var decoded map[string]any
	if err := json.Unmarshal([]byte(line), &decoded); err != nil {
		t.Fatalf("record is not structured JSON: %v (%q)", err, line)
	}
	if decoded["level"] != "INFO" {
		t.Fatalf("level = %v, want INFO", decoded["level"])
	}
}

func TestLevelFiltering(t *testing.T) {
	t.Setenv("CORE_LOG_LEVEL", "warn")
	Init()
	t.Cleanup(func() { _ = Close() })
	if got := GetLevel(); got != slog.LevelWarn {
		t.Fatalf("level = %v, want WARN", got)
	}
	// A bad value must not stop the process from booting.
	if got := ParseLevel("nonsense"); got != slog.LevelInfo {
		t.Fatalf("ParseLevel(nonsense) = %v, want INFO", got)
	}
	for name, want := range map[string]slog.Level{
		"debug": slog.LevelDebug, "TRACE": slog.LevelDebug,
		"info": slog.LevelInfo, "warn": slog.LevelWarn, "warning": slog.LevelWarn,
		"error": slog.LevelError, "": slog.LevelInfo,
	} {
		if got := ParseLevel(name); got != want {
			t.Errorf("ParseLevel(%q) = %v, want %v", name, got, want)
		}
	}
}

func TestComponentLoggerTagsComponent(t *testing.T) {
	t.Setenv("CORE_LOG_FORMAT", "json")
	Init()
	t.Cleanup(func() { _ = Close() })

	ResetLogs()
	Component("mocr").Info("choosing model", "model", "kimi-k3")
	recs := RecentLogs(10, slog.LevelDebug, "")
	if len(recs) != 1 {
		t.Fatalf("got %d records, want 1", len(recs))
	}
	rec := recs[0]
	if rec.Message != "choosing model" {
		t.Fatalf("message = %q", rec.Message)
	}
	if rec.Fields["component"] != "mocr" || rec.Fields["model"] != "kimi-k3" {
		t.Fatalf("fields = %#v", rec.Fields)
	}
}

func TestTraceContextPropagatesToLogRecords(t *testing.T) {
	t.Setenv("CORE_LOG_FORMAT", "json")
	Init()
	t.Cleanup(func() { _ = Close() })

	ResetLogs()
	ctx, span := Start(context.Background(), "chat", KindServer)
	defer span.End()
	Component("gateway").InfoContext(ctx, "calling mocr")
	recs := RecentLogs(10, slog.LevelDebug, "")
	if len(recs) != 1 {
		t.Fatalf("got %d records, want 1", len(recs))
	}
	if recs[0].TraceID != span.TraceID() {
		t.Fatalf("record trace = %q, want %q", recs[0].TraceID, span.TraceID())
	}
	if recs[0].SpanID != span.SpanID() {
		t.Fatalf("record span = %q, want %q", recs[0].SpanID, span.SpanID())
	}
}

func TestSpanLifecycle(t *testing.T) {
	ResetSpans()
	ctx, root := Start(context.Background(), "POST /api/chat", KindServer)
	defer root.End()
	root.Attr("session", "webui")

	childCtx, child := Child(ctx, "mocr.generate", KindClient)
	child.Attr("model", "gpt-5")
	child.Event("retry", map[string]string{"attempt": "2"})
	if child.TraceID() != root.TraceID() {
		t.Fatalf("child trace %q != parent %q", child.TraceID(), root.TraceID())
	}
	if child.ParentID() != root.SpanID() {
		t.Fatal("child is not linked to its parent")
	}
	if got := obs_SpanFrom(childCtx); got != child {
		t.Fatal("Child did not put the span on the context")
	}
	child.Fail(context.DeadlineExceeded)
	// Windows' default timer granularity is coarse enough that a very fast span
	// can measure 0ns, so give it something to measure.
	time.Sleep(2 * time.Millisecond)
	child.End()
	root.End()

	spans := RecentSpans(10, "")
	if len(spans) != 2 {
		t.Fatalf("got %d spans, want 2", len(spans))
	}
	byName := map[string]SpanRecord{}
	for _, s := range spans {
		byName[s.Name] = s
	}
	got := byName["mocr.generate"]
	if got.Status != StatusError || !strings.Contains(got.Error, "deadline") {
		t.Fatalf("child status=%q error=%q", got.Status, got.Error)
	}
	if got.DurationNs <= 0 {
		t.Fatal("child has no duration")
	}
	if len(got.Events) != 1 || got.Events[0].Name != "retry" {
		t.Fatalf("events = %#v", got.Events)
	}
	if got.Attrs["model"] != "gpt-5" {
		t.Fatalf("attrs = %#v", got.Attrs)
	}
	if parent := byName["POST /api/chat"]; parent.Status != StatusOK || parent.ParentID != "" {
		t.Fatalf("root = %#v", parent)
	}
}

func TestSpanEndIsIdempotent(t *testing.T) {
	ResetSpans()
	_, span := Start(context.Background(), "once", KindInternal)
	span.End()
	span.End()
	span.End()
	if got := len(RecentSpans(10, "")); got != 1 {
		t.Fatalf("span recorded %d times, want 1", got)
	}
}

func TestChildWithoutParentBecomesRoot(t *testing.T) {
	ResetSpans()
	// A measurement lost is worse than a flat trace, so a child of a bare
	// context still reports.
	_, span := Child(context.Background(), "orphan", KindClient)
	defer span.End()
	if span.ParentID() != "" {
		t.Fatalf("orphan has parent %q", span.ParentID())
	}
	if span.TraceID() == "" {
		t.Fatal("orphan has no trace id")
	}
}

func TestRecentSpansFiltersByTraceAndRingIsBounded(t *testing.T) {
	ResetSpans()
	t.Cleanup(ResetSpans)
	ctxA, a := Start(context.Background(), "a", KindServer)
	a.Attr("id", "A")
	_, b := Child(ctxA, "b", KindClient)
	a.End()
	b.End()
	_, c := Start(context.Background(), "c", KindServer)
	c.End()

	if got := RecentSpans(10, a.TraceID()); len(got) != 2 {
		t.Fatalf("trace filter returned %d spans, want 2", len(got))
	}
	if got := RecentSpans(1, ""); len(got) != 1 || got[0].Name != "c" {
		t.Fatalf("limit not applied to the newest: %#v", got)
	}
}

func TestSpanRingEvictsOldest(t *testing.T) {
	ResetSpans()
	t.Cleanup(ResetSpans)
	store.mu.Lock()
	store.limit = 4
	store.mu.Unlock()
	t.Cleanup(func() {
		store.mu.Lock()
		store.limit = defaultSpans
		store.mu.Unlock()
	})
	for i := 0; i < 10; i++ {
		_, s := Start(context.Background(), string(rune('a'+i)), KindInternal)
		s.End()
	}
	spans := RecentSpans(0, "")
	if len(spans) != 4 {
		t.Fatalf("ring holds %d, want the cap of 4", len(spans))
	}
	if spans[0].Name != "g" || spans[3].Name != "j" {
		t.Fatalf("ring kept the wrong window: %q..%q", spans[0].Name, spans[3].Name)
	}
}

func TestSubscribeSpansAndLogs(t *testing.T) {
	ResetSpans()
	ResetLogs()
	t.Cleanup(func() { ResetSpans(); ResetLogs() })

	spanCh, cancelSpans := SubscribeSpans(8)
	defer cancelSpans()
	logCh, cancelLogs := SubscribeLogs()
	defer cancelLogs()

	go func() {
		_, s := Start(context.Background(), "streamed", KindPlugin)
		s.Attr("plugin", "life")
		s.End()
	}()
	select {
	case rec := <-spanCh:
		if rec.Name != "streamed" || rec.Attrs["plugin"] != "life" {
			t.Fatalf("received %#v", rec)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("no span delivered to subscriber")
	}

	Component("test").Info("streamed log")
	select {
	case rec := <-logCh:
		if rec.Message != "streamed log" {
			t.Fatalf("received %#v", rec)
		}
	case <-time.After(2 * time.Second):
		t.Fatal("no log delivered to subscriber")
	}
}

func TestSubscribeDropDoesNotBlockProducer(t *testing.T) {
	ResetSpans()
	t.Cleanup(ResetSpans)
	// A subscriber that never reads must not stall the request that emitted the
	// span; the overflow is dropped for that subscriber instead.
	_, cancel := SubscribeSpans(1)
	defer cancel()
	done := make(chan struct{})
	go func() {
		for i := 0; i < 500; i++ {
			_, s := Start(context.Background(), "flood", KindInternal)
			s.End()
		}
		close(done)
	}()
	select {
	case <-done:
	case <-time.After(5 * time.Second):
		t.Fatal("producer blocked on a slow subscriber")
	}
}

func TestLogLevelFilterAndSearch(t *testing.T) {
	t.Setenv("CORE_LOG_LEVEL", "debug")
	Init()
	t.Cleanup(func() { _ = Close() })
	ResetLogs()
	t.Cleanup(ResetLogs)

	Component("gateway").Debug("cache miss for session abc")
	Component("gateway").Error("mocr refused the request", "code", "unavailable")

	if got := RecentLogs(10, slog.LevelError, ""); len(got) != 1 || got[0].Level != "ERROR" {
		t.Fatalf("level filter returned %#v", got)
	}
	if got := RecentLogs(10, slog.LevelDebug, "abc"); len(got) != 1 || got[0].Level != "DEBUG" {
		t.Fatalf("search returned %#v", got)
	}
	if got := RecentLogs(10, slog.LevelDebug, "nothing-matches"); len(got) != 0 {
		t.Fatalf("search matched %d records", len(got))
	}
}

func TestLogRecordIsJSONSerialisable(t *testing.T) {
	t.Setenv("CORE_LOG_FORMAT", "json")
	Init()
	t.Cleanup(func() { _ = Close() })
	ResetLogs()
	t.Cleanup(ResetLogs)
	Component("server").Error("boom", "attempt", 3, "retrying", true)
	recs := RecentLogs(1, slog.LevelDebug, "")
	raw, err := json.Marshal(recs[0])
	if err != nil {
		t.Fatal(err)
	}
	for _, key := range []string{`"time"`, `"level"`, `"message"`, `"component"`, `"attempt"`} {
		if !strings.Contains(string(raw), key) {
			t.Fatalf("payload missing %s: %s", key, raw)
		}
	}
}

func TestFileSinkWritesJSONLines(t *testing.T) {
	path := filepath.Join(t.TempDir(), "logs", "core.log")
	t.Setenv("CORE_LOG_FILE", path)
	t.Setenv("CORE_LOG_LEVEL", "debug")
	Init()
	t.Cleanup(func() { _ = Close() })

	Component("core").Info("persisted line", "n", 1)
	if err := Close(); err != nil {
		t.Fatal(err)
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	lines := strings.Split(strings.TrimSpace(string(raw)), "\n")
	if len(lines) != 1 {
		t.Fatalf("got %d lines, want 1: %q", len(lines), raw)
	}
	var decoded map[string]any
	if err := json.Unmarshal([]byte(lines[0]), &decoded); err != nil {
		t.Fatalf("line is not JSON: %v (%q)", err, lines[0])
	}
	if decoded["msg"] != "persisted line" {
		t.Fatalf("decoded = %#v", decoded)
	}
}

func TestFileSinkRotates(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "rotate.log")
	w := &rotatingFile{path: path}
	if err := w.open(); err != nil {
		t.Fatal(err)
	}
	defer w.Close()
	// Push past the cap in one write to force a rotation, then keep writing so
	// the fresh file is used afterwards.
	chunk := bytes.Repeat([]byte("a"), 1<<20)
	for i := 0; i < 10; i++ {
		if _, err := w.Write(chunk); err != nil {
			t.Fatal(err)
		}
	}
	if _, err := os.Stat(path + ".1"); err != nil {
		t.Fatalf("no rotated file: %v", err)
	}
	if _, err := os.Stat(path); err != nil {
		t.Fatalf("active file missing after rotation: %v", err)
	}
	// The active file must have been reopened for writing, not left stale.
	if _, err := w.Write([]byte("tail")); err != nil {
		t.Fatal(err)
	}
	raw, _ := os.ReadFile(path)
	if !strings.HasSuffix(string(raw), "tail") {
		t.Fatal("write after rotation did not reach the active file")
	}
}

func TestConcurrentLoggingAndTracing(t *testing.T) {
	t.Setenv("CORE_LOG_LEVEL", "debug")
	Init()
	t.Cleanup(func() { _ = Close() })
	ResetLogs()
	ResetSpans()
	t.Cleanup(func() { ResetLogs(); ResetSpans() })

	// Race detector territory: handler fanout, ring buffer and subscriber
	// channels all touched from many goroutines.
	var wg sync.WaitGroup
	for i := 0; i < 40; i++ {
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			ctx, span := Start(context.Background(), "concurrent", KindServer)
			for j := 0; j < 5; j++ {
				_, child := Child(ctx, "child", KindClient)
				child.Attr("j", "x")
				child.Event("step", nil)
				Component("worker").InfoContext(ctx, "working", "i", i)
				child.End()
			}
			span.End()
		}(i)
	}
	wg.Wait()
	if got := len(RecentLogs(0, slog.LevelDebug, "")); got != 200 {
		t.Fatalf("buffered %d logs, want 200", got)
	}
	if got := len(RecentSpans(0, "")); got == 0 {
		t.Fatal("no spans retained")
	}
}

func obs_SpanFrom(ctx context.Context) *Span { return SpanFrom(ctx) }
