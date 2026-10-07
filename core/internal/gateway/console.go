package gateway

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"strconv"
	"strings"
	"time"

	"0kay/obs"
)

// RequestIDHeader carries the correlation id for one logical operation across
// every hop: browser -> Core -> gRPC -> mocr/agent/LIFE. Core echoes it on the
// response so a user can paste one value into the console and find the whole
// trace.
const RequestIDHeader = "X-0kay-Request-Id"

var consoleLog = obs.Component("console")

// obsRoutes serves the WebUI console: a bounded snapshot of recent logs and
// spans, a live SSE feed of both, and a level control.
//
// Everything here is read-only except the level and clear endpoints, and the
// level write is a PUT so it is covered by the PIN gate's settings rule.
func (g *Gateway) obsRoutes(mux *http.ServeMux) {
	mux.HandleFunc("GET /api/console/logs", g.handleConsoleLogs)
	mux.HandleFunc("GET /api/console/spans", g.handleConsoleSpans)
	mux.HandleFunc("GET /api/console/stream", g.handleConsoleStream)
	mux.HandleFunc("PUT /api/console/level", g.handleConsoleLevel)
	mux.HandleFunc("POST /api/console/clear", g.handleConsoleClear)
}

func consoleParams(r *http.Request) (limit int, minLevel slog.Level, contains string) {
	q := r.URL.Query()
	limit = 200
	if raw := strings.TrimSpace(q.Get("limit")); raw != "" {
		if n, err := strconv.Atoi(raw); err == nil && n > 0 {
			limit = n
		}
	}
	// Cap the page so one request cannot ask for the whole buffer.
	if limit > 1000 {
		limit = 1000
	}
	minLevel = obs.ParseLevel(q.Get("level"))
	contains = strings.TrimSpace(q.Get("q"))
	return limit, minLevel, contains
}

func (g *Gateway) handleConsoleLogs(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet, http.MethodHead) {
		return
	}
	limit, minLevel, contains := consoleParams(r)
	writeJSON(w, http.StatusOK, map[string]any{
		"level": GetConsoleLevel(),
		"logs":  obs.RecentLogs(limit, minLevel, contains),
	})
}

func (g *Gateway) handleConsoleSpans(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet, http.MethodHead) {
		return
	}
	limit, _, _ := consoleParams(r)
	writeJSON(w, http.StatusOK, map[string]any{
		"spans": obs.RecentSpans(limit, strings.TrimSpace(r.URL.Query().Get("trace_id"))),
	})
}

// handleConsoleStream multiplexes logs and spans onto one SSE connection. Two
// separate endpoints would mean two EventSource connections in the browser for
// no benefit, and a single stream keeps their ordering relative to each other.
func (g *Gateway) handleConsoleStream(w http.ResponseWriter, r *http.Request) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		writeErr(w, http.StatusInternalServerError, "stream_unsupported", "streaming unavailable")
		return
	}
	_, minLevel, contains := consoleParams(r)

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	// Tells nginx not to buffer, without which the console appears frozen.
	w.Header().Set("X-Accel-Buffering", "no")

	logs, cancelLogs := obs.SubscribeLogs()
	defer cancelLogs()
	spans, cancelSpans := obs.SubscribeSpans(256)
	defer cancelSpans()

	send := func(event string, value any) bool {
		raw, err := json.Marshal(value)
		if err != nil {
			return false
		}
		if _, err := w.Write([]byte("event: " + event + "\ndata: " + string(raw) + "\n\n")); err != nil {
			return false
		}
		flusher.Flush()
		return true
	}

	// Prime the client so opening the console shows recent history rather than
	// an empty pane waiting for the next error.
	for _, rec := range obs.RecentLogs(200, minLevel, contains) {
		if !send("log", rec) {
			return
		}
	}
	for _, rec := range obs.RecentSpans(200, "") {
		if !send("span", rec) {
			return
		}
	}
	if !send("ready", map[string]string{"level": GetConsoleLevel()}) {
		return
	}

	heartbeat := time.NewTicker(15 * time.Second)
	defer heartbeat.Stop()
	for {
		select {
		case <-r.Context().Done():
			return
		case rec, open := <-logs:
			if !open {
				return
			}
			if minLevel > slog.LevelDebug && consoleLevelValue(rec.Level) < minLevel {
				continue
			}
			if contains != "" && !obs.Matches(rec, contains) {
				continue
			}
			if !send("log", rec) {
				return
			}
		case rec, open := <-spans:
			if !open {
				return
			}
			if !send("span", rec) {
				return
			}
		case <-heartbeat.C:
			// A comment frame keeps proxies from reaping an idle connection and
			// gives the client something to reset its idle timer on.
			if _, err := w.Write([]byte(": heartbeat\n\n")); err != nil {
				return
			}
			flusher.Flush()
		}
	}
}

func (g *Gateway) handleConsoleLevel(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPut) {
		return
	}
	var body struct {
		Level string `json:"level"`
	}
	if !decodeBody(w, r, &body, maxSmallBody) {
		return
	}
	parsed, ok := obs.ParseLevelStrict(body.Level)
	if !ok {
		badRequest(w, "unknown level")
		return
	}
	obs.SetLevel(parsed)
	obs.Component("console").Info("log level changed", "level", parsed.String())
	writeJSON(w, http.StatusOK, map[string]string{"level": GetConsoleLevel()})
}

func (g *Gateway) handleConsoleClear(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	obs.ResetLogs()
	obs.ResetSpans()
	writeJSON(w, http.StatusOK, map[string]bool{"cleared": true})
}

// GetConsoleLevel reports the current level name for the console header.
func GetConsoleLevel() string { return obs.GetLevel().String() }

func consoleLevelValue(name string) slog.Level { return obs.ParseLevel(name) }

// sessionIDOf normalises an absent session for logging: an empty string in a
// log line reads like a missing field rather than the "default" bucket it is.
func sessionIDOf(id string) string {
	if id == "" {
		return "default"
	}
	return id
}
