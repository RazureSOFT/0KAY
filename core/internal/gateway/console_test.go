package gateway

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"0kay/obs"
)

func TestConsoleLogsSnapshot(t *testing.T) {
	obs.Component("test").Info("first message", "n", 1)
	obs.Component("test").Error("second message")

	g := &Gateway{}
	req := httptest.NewRequest(http.MethodGet, "/api/console/logs?limit=10", nil)
	rec := httptest.NewRecorder()
	g.handleConsoleLogs(rec, req)
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
	var payload struct {
		Level string          `json:"level"`
		Logs  []obs.LogRecord `json:"logs"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
		t.Fatal(err)
	}
	if len(payload.Logs) != 2 {
		t.Fatalf("got %d logs, want 2", len(payload.Logs))
	}
	// Oldest first, so the console can append without re-sorting.
	if payload.Logs[0].Message != "first message" {
		t.Fatalf("first = %q", payload.Logs[0].Message)
	}
	if payload.Logs[0].Fields["component"] != "test" {
		t.Fatalf("component missing: %#v", payload.Logs[0].Fields)
	}
	if payload.Level == "" {
		t.Fatal("level not reported")
	}
}

func TestConsoleLogsFiltersAndLimit(t *testing.T) {
	obs.ResetLogs()
	t.Cleanup(obs.ResetLogs)
	original := obs.GetLevel()
	// Debug records are filtered out below the active level, so the level has to
	// be lowered before this test can assert anything about them.
	obs.SetLevel(obs.ParseLevel("debug"))
	t.Cleanup(func() { obs.SetLevel(original) })
	obs.Component("mocr").Debug("cache miss abc")
	obs.Component("mocr").Error("refused the request")

	g := &Gateway{}
	get := func(query string) []obs.LogRecord {
		rec := httptest.NewRecorder()
		g.handleConsoleLogs(rec, httptest.NewRequest(http.MethodGet, "/api/console/logs"+query, nil))
		var payload struct {
			Logs []obs.LogRecord `json:"logs"`
		}
		if err := json.Unmarshal(rec.Body.Bytes(), &payload); err != nil {
			t.Fatal(err)
		}
		return payload.Logs
	}
	if got := get("?level=error"); len(got) != 1 || got[0].Level != "ERROR" {
		t.Fatalf("level filter: %#v", got)
	}
	// level=debug is required here: the default minimum is info, which correctly
	// hides the very DEBUG record this search is looking for.
	if got := get("?q=abc&level=debug"); len(got) != 1 || got[0].Level != "DEBUG" {
		t.Fatalf("search filter: %#v", got)
	}
	if got := get("?q=nothing-matches"); len(got) != 0 {
		t.Fatalf("search matched %d records", len(got))
	}
	if got := get("?limit=1"); len(got) != 1 {
		t.Fatalf("limit: got %d", len(got))
	}
	// An absurd limit must be clamped rather than dumping the whole buffer.
	if got := get("?limit=100000"); len(got) > 1000 {
		t.Fatalf("limit not clamped: %d", len(got))
	}
	// Nonsense parameters fall back to defaults instead of erroring: limit goes
	// back to 200 and an unknown level becomes info (which still hides the DEBUG
	// record, leaving the error).
	if got := get("?limit=abc&level=nope"); len(got) != 1 || got[0].Level != "ERROR" {
		t.Fatalf("bad params: %#v", got)
	}
}

func TestConsoleSpansFilterByTrace(t *testing.T) {
	obs.ResetSpans()
	t.Cleanup(obs.ResetSpans)
	_, a := obs.Start(t.Context(), "op-a", obs.KindServer)
	a.End()
	_, b := obs.Start(t.Context(), "op-b", obs.KindClient)
	b.End()

	g := &Gateway{}
	rec := httptest.NewRecorder()
	g.handleConsoleSpans(rec, httptest.NewRequest(http.MethodGet, "/api/console/spans", nil))
	var all struct {
		Spans []obs.SpanRecord `json:"spans"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &all); err != nil {
		t.Fatal(err)
	}
	if len(all.Spans) != 2 {
		t.Fatalf("got %d spans, want 2", len(all.Spans))
	}

	rec = httptest.NewRecorder()
	g.handleConsoleSpans(rec, httptest.NewRequest(http.MethodGet, "/api/console/spans?trace_id="+a.TraceID(), nil))
	var one struct {
		Spans []obs.SpanRecord `json:"spans"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &one); err != nil {
		t.Fatal(err)
	}
	if len(one.Spans) != 1 || one.Spans[0].Name != "op-a" {
		t.Fatalf("trace filter: %#v", one.Spans)
	}
}

func TestConsoleStreamPrimesAndStreams(t *testing.T) {
	obs.ResetLogs()
	obs.ResetSpans()
	t.Cleanup(func() { obs.ResetLogs(); obs.ResetSpans() })
	obs.Component("test").Info("before the stream opened")

	g := &Gateway{}
	server := httptest.NewServer(http.HandlerFunc(g.handleConsoleStream))
	defer server.Close()

	req, err := http.NewRequest(http.MethodGet, server.URL+"?limit=50", nil)
	if err != nil {
		t.Fatal(err)
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()
	if ct := resp.Header.Get("Content-Type"); ct != "text/event-stream" {
		t.Fatalf("content-type = %q", ct)
	}
	if resp.Header.Get("X-Accel-Buffering") != "no" {
		t.Fatal("missing X-Accel-Buffering: a buffering proxy would freeze the console")
	}

	buf := make([]byte, 4096)
	n, err := resp.Body.Read(buf)
	if err != nil {
		t.Fatal(err)
	}
	primed := string(buf[:n])
	if !strings.Contains(primed, "before the stream opened") {
		t.Fatalf("history not replayed: %q", primed)
	}
	// The primed history and the ready marker may arrive in separate reads.
	deadlineReady := time.Now().Add(3 * time.Second)
	for !strings.Contains(primed, "event: ready") && time.Now().Before(deadlineReady) {
		n, err = resp.Body.Read(buf)
		if err != nil {
			t.Fatal(err)
		}
		primed += string(buf[:n])
	}
	if !strings.Contains(primed, "event: ready") {
		t.Fatalf("no ready marker: %q", primed)
	}

	// A record emitted after the stream opened must arrive on it.
	go func() {
		time.Sleep(50 * time.Millisecond)
		obs.Component("test").Error("after the stream opened")
	}()
	deadline := time.Now().Add(3 * time.Second)
	for time.Now().Before(deadline) {
		n, err = resp.Body.Read(buf)
		if err != nil {
			t.Fatal(err)
		}
		if strings.Contains(string(buf[:n]), "after the stream opened") {
			return
		}
	}
	t.Fatal("live record never arrived on the stream")
}

func TestConsoleStreamStopsWithClient(t *testing.T) {
	obs.ResetLogs()
	t.Cleanup(obs.ResetLogs)
	g := &Gateway{}
	server := httptest.NewServer(http.HandlerFunc(g.handleConsoleStream))

	req, _ := http.NewRequest(http.MethodGet, server.URL, nil)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	resp.Body.Close()
	server.CloseClientConnections()
	// The handler must return on context cancellation; the test binary failing
	// to exit is the symptom if it does not.
}

func TestConsoleLevelRoundTrip(t *testing.T) {
	original := obs.GetLevel()
	t.Cleanup(func() { obs.SetLevel(original) })

	g := &Gateway{}
	rec := httptest.NewRecorder()
	g.handleConsoleLevel(rec, httptest.NewRequest(http.MethodPut, "/api/console/level",
		strings.NewReader(`{"level":"warn"}`)))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d body=%s", rec.Code, rec.Body)
	}
	if obs.GetLevel().String() != "WARN" {
		t.Fatalf("level = %v", obs.GetLevel())
	}

	rec = httptest.NewRecorder()
	g.handleConsoleLevel(rec, httptest.NewRequest(http.MethodPut, "/api/console/level",
		strings.NewReader(`{"level":"nonsense"}`)))
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("bogus level accepted: %d", rec.Code)
	}
	if obs.GetLevel().String() != "WARN" {
		t.Fatal("a rejected level must not be applied")
	}

	rec = httptest.NewRecorder()
	g.handleConsoleLevel(rec, httptest.NewRequest(http.MethodGet, "/api/console/level", nil))
	if rec.Code != http.StatusMethodNotAllowed {
		t.Fatalf("GET accepted: %d", rec.Code)
	}
}

func TestConsoleClear(t *testing.T) {
	obs.Component("test").Info("will be cleared")
	_, s := obs.Start(t.Context(), "will be cleared", obs.KindServer)
	s.End()

	g := &Gateway{}
	rec := httptest.NewRecorder()
	g.handleConsoleClear(rec, httptest.NewRequest(http.MethodPost, "/api/console/clear", nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d", rec.Code)
	}
	if got := len(obs.RecentLogs(10, obs.GetLevel(), "")); got != 0 {
		t.Fatalf("%d logs survived the clear", got)
	}
	if got := len(obs.RecentSpans(10, "")); got != 0 {
		t.Fatalf("%d spans survived the clear", got)
	}
}

func TestMiddlewareAssignsAndEchoesRequestID(t *testing.T) {
	obs.ResetSpans()
	t.Cleanup(obs.ResetSpans)

	var seen string
	handler := logMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		seen = obs.TraceID(r.Context())
		w.WriteHeader(http.StatusOK)
	}))

	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, httptest.NewRequest(http.MethodGet, "/api/thing", nil))
	echoed := rec.Header().Get(RequestIDHeader)
	if echoed == "" {
		t.Fatal("no request id echoed on the response")
	}
	if seen != echoed {
		t.Fatalf("handler saw trace %q, response echoed %q", seen, echoed)
	}
	spans := obs.RecentSpans(10, "")
	if len(spans) != 1 {
		t.Fatalf("got %d spans, want 1", len(spans))
	}
	if spans[0].TraceID != echoed {
		t.Fatalf("span trace %q != echoed %q", spans[0].TraceID, echoed)
	}
	// The span's trace id *is* the request id, so it is not duplicated into an
	// attribute as well.
	if spans[0].Attrs["method"] != "GET" || spans[0].Attrs["path"] != "/api/thing" {
		t.Fatalf("span attrs = %#v", spans[0].Attrs)
	}
	if _, dup := spans[0].Attrs["request_id"]; dup {
		t.Fatalf("request_id duplicated as an attribute: %#v", spans[0].Attrs)
	}
}

func TestMiddlewareHonoursInboundRequestID(t *testing.T) {
	obs.ResetSpans()
	t.Cleanup(obs.ResetSpans)
	// An agent retrying a call must keep its own id so the two attempts are
	// distinguishable in the console.
	handler := logMiddleware(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	req := httptest.NewRequest(http.MethodPost, "/api/thing", nil)
	req.Header.Set(RequestIDHeader, "caller-supplied-id")
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	if got := rec.Header().Get(RequestIDHeader); got != "caller-supplied-id" {
		t.Fatalf("inbound id not preserved: %q", got)
	}
	if spans := obs.RecentSpans(10, "caller-supplied-id"); len(spans) != 1 {
		t.Fatalf("trace not indexed under the inbound id: %d", len(spans))
	}
}

func TestMiddlewareMarksErrorStatusOnSpan(t *testing.T) {
	obs.ResetLogs()
	obs.ResetSpans()
	t.Cleanup(func() { obs.ResetLogs(); obs.ResetSpans() })

	handler := logMiddleware(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		writeErr(w, http.StatusInternalServerError, "internal", "boom")
	}))
	handler.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest(http.MethodGet, "/api/boom", nil))

	spans := obs.RecentSpans(10, "")
	if len(spans) != 1 || spans[0].Status != obs.StatusError {
		t.Fatalf("span status = %#v", spans)
	}
	if !strings.Contains(spans[0].Error, "500") {
		t.Fatalf("span error = %q", spans[0].Error)
	}
}

func TestMiddlewareNeverLogsThePin(t *testing.T) {
	obs.ResetLogs()
	t.Cleanup(obs.ResetLogs)
	handler := logMiddleware(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	req := httptest.NewRequest(http.MethodGet, "/api/providers", nil)
	req.Header.Set("X-0kay-Pin", "424242")
	handler.ServeHTTP(httptest.NewRecorder(), req)

	for _, rec := range obs.RecentLogs(50, obs.GetLevel(), "") {
		blob, _ := json.Marshal(rec)
		if strings.Contains(string(blob), "424242") {
			t.Fatalf("the PIN leaked into a log record: %s", blob)
		}
	}
}

func TestMiddlewareTreatsStreamsSeparately(t *testing.T) {
	obs.ResetLogs()
	obs.ResetSpans()
	t.Cleanup(func() { obs.ResetLogs(); obs.ResetSpans() })

	handler := logMiddleware(http.HandlerFunc(func(w http.ResponseWriter, _ *http.Request) {
		w.WriteHeader(http.StatusOK)
	}))
	handler.ServeHTTP(httptest.NewRecorder(), httptest.NewRequest(http.MethodGet, "/api/life/chat", nil))
	spans := obs.RecentSpans(10, "")
	if len(spans) != 1 {
		t.Fatalf("got %d spans", len(spans))
	}
	// A stream's duration is its length, so it is flagged rather than reported
	// as a slow request.
	if spans[0].Attrs["stream"] != "true" {
		t.Fatalf("stream not marked: %#v", spans[0].Attrs)
	}
	for _, rec := range obs.RecentLogs(50, obs.GetLevel(), "") {
		if rec.Message == "request" || rec.Message == "request rejected" || rec.Message == "request failed" {
			t.Fatalf("stream reported as a normal request: %#v", rec)
		}
	}
}
