// Package obs is 0KAY's observability layer: structured logging, request
// tracing, and the live event hub the WebUI console subscribes to.
//
// The central trick is that Init calls slog.SetDefault, which routes the
// standard library's log package into the same handler. Every existing
// log.Printf("[core"] ...) call site therefore becomes a structured record with
// no edit at all, and each can then be migrated to a named component logger one
// at a time. That is why there is no big-bang logging rewrite in this commit:
// new code uses obs.Component("x").Info(...), old code keeps working and is
// greppable for later migration.
package obs

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log/slog"
	"os"
	"strings"
	"sync"
	"time"
)

// Level is the process-wide log level.
var (
	levelMu sync.RWMutex
	level   = new(slog.LevelVar)
)

// defaultLogger is the root logger. Component loggers derive from it, so
// replacing it in Init propagates without re-registration.
//
// It is wired to a real stderr sink at startup rather than a discard handler:
// a package that silently throws away every log until someone remembers to
// initialise it is a trap, and the zero-configuration case has to work (tests,
// the echo plugin, any future entrypoint).
var (
	loggerMu sync.RWMutex
	hub      = newHub()
	root     = slog.New(&tappingHandler{
		inner: slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{Level: level}),
	})
)

type discardHandler struct{}

func (discardHandler) Enabled(context.Context, slog.Level) bool  { return false }
func (discardHandler) Handle(context.Context, slog.Record) error { return nil }
func (h discardHandler) WithAttrs([]slog.Attr) slog.Handler      { return h }
func (h discardHandler) WithGroup(string) slog.Handler           { return h }

// fanout sends every record to several handlers. slog has no multi-handler, and
// the two sinks here want different encodings: stderr stays human-readable
// (that is what ends up in `docker logs`) while the file is JSON so it can be
// machine-read without a regex pass.
type fanout struct{ handlers []slog.Handler }

func (f fanout) Enabled(ctx context.Context, l slog.Level) bool {
	for _, h := range f.handlers {
		if h.Enabled(ctx, l) {
			return true
		}
	}
	return false
}

func (f fanout) Handle(ctx context.Context, r slog.Record) error {
	// A failing sink must not stop the others, and the error itself goes to
	// stderr so a full disk is not silently invisible.
	var firstErr error
	for _, h := range f.handlers {
		if !h.Enabled(ctx, r.Level) {
			continue
		}
		if err := h.Handle(ctx, r.Clone()); err != nil && firstErr == nil {
			firstErr = err
		}
	}
	if firstErr != nil {
		fmt.Fprintf(os.Stderr, "obs: log sink failed: %v\n", firstErr)
	}
	return nil
}

func (f fanout) WithAttrs(attrs []slog.Attr) slog.Handler {
	out := make([]slog.Handler, len(f.handlers))
	for i, h := range f.handlers {
		out[i] = h.WithAttrs(attrs)
	}
	return fanout{handlers: out}
}

func (f fanout) WithGroup(name string) slog.Handler {
	out := make([]slog.Handler, len(f.handlers))
	for i, h := range f.handlers {
		out[i] = h.WithGroup(name)
	}
	return fanout{handlers: out}
}

// ParseLevel maps a level name to slog's. An unrecognised value falls back to
// info rather than failing startup: a typo in an env var should not stop the
// process from booting. Use ParseLevelStrict where the caller can report the
// mistake back (an interactive control rather than a config file).
func ParseLevel(name string) slog.Level {
	if parsed, ok := ParseLevelStrict(name); ok {
		return parsed
	}
	return slog.LevelInfo
}

// ParseLevelStrict is ParseLevel with an explicit ok, for callers that must
// reject an unrecognised level instead of quietly substituting info.
func ParseLevelStrict(name string) (slog.Level, bool) {
	switch strings.ToLower(strings.TrimSpace(name)) {
	case "debug", "trace":
		return slog.LevelDebug, true
	case "", "info":
		return slog.LevelInfo, true
	case "warn", "warning":
		return slog.LevelWarn, true
	case "error", "fatal", "panic":
		return slog.LevelError, true
	default:
		return slog.LevelInfo, false
	}
}

// Init installs the process logger. It is safe to call more than once; later
// calls replace the sinks.
//
// Env:
//
//	CORE_LOG_LEVEL  debug | info | warn | error      (default info)
//	CORE_LOG_FORMAT json | text                      (default text for stderr)
//	CORE_LOG_FILE   path; enables the rotating JSON file sink
func Init() {
	level.Set(ParseLevel(os.Getenv("CORE_LOG_LEVEL")))

	var handlers []slog.Handler
	if file := strings.TrimSpace(os.Getenv("CORE_LOG_FILE")); file != "" {
		handlers = append(handlers, newFileHandler(file))
	}
	if path := strings.TrimSpace(os.Getenv("CORE_LOG_FORMAT")); strings.EqualFold(path, "json") {
		handlers = append(handlers, slog.NewJSONHandler(os.Stderr, &slog.HandlerOptions{Level: level}))
	} else {
		handlers = append(handlers, slog.NewTextHandler(os.Stderr, &slog.HandlerOptions{Level: level}))
	}

	loggerMu.Lock()
	root = slog.New(&tappingHandler{inner: fanout{handlers: handlers}})
	loggerMu.Unlock()

	// Route the standard log package (log.Printf, and every un-migrated call
	// site in this repository) through the same handler. This is what lets the
	// existing 60-odd log.Printf calls produce structured output for free.
	slog.SetDefault(root)
}

// Close releases the file sink, if any. Safe to call more than once.
func Close() error { return closeOpenFiles() }

// Component returns a logger tagged with the emitting component. Prefer this
// over the package-level functions so records can be filtered and so a
// component can later get its own level.
func Component(name string) *slog.Logger {
	loggerMu.RLock()
	defer loggerMu.RUnlock()
	return root.With("component", name)
}

// L is the untagged root logger.
func L() *slog.Logger {
	loggerMu.RLock()
	defer loggerMu.RUnlock()
	return root
}

// SetLevel adjusts the level at runtime.
func SetLevel(l slog.Level) { level.Set(l) }

// GetLevel reports the current level.
func GetLevel() slog.Level { return level.Level() }

// NewID returns a short random hex identifier. It reads crypto/rand directly
// rather than pulling in a uuid dependency for something this small; the value
// only has to be unique within one process's trace buffer.
func NewID() string {
	var b [8]byte
	if _, err := rand.Read(b[:]); err != nil {
		// crypto/rand does not fail in practice. A time-based fallback keeps
		// tracing working (with a uniqueness caveat) instead of taking the
		// request down over a diagnostic identifier.
		return fmt.Sprintf("t%d", time.Now().UnixNano())
	}
	return hex.EncodeToString(b[:])
}

type ctxKey int

const (
	ctxKeyTraceID ctxKey = iota
	ctxKeySpan
)

// WithTraceID attaches a trace id to ctx so every log record emitted downstream
// carries it without threading a logger argument through each call.
func WithTraceID(ctx context.Context, id string) context.Context {
	if id == "" {
		return ctx
	}
	return context.WithValue(ctx, ctxKeyTraceID, id)
}

// TraceID returns the trace id attached to ctx, or "".
func TraceID(ctx context.Context) string {
	if ctx == nil {
		return ""
	}
	if v, ok := ctx.Value(ctxKeyTraceID).(string); ok {
		return v
	}
	return ""
}

func withSpan(ctx context.Context, s *Span) context.Context {
	return context.WithValue(ctx, ctxKeySpan, s)
}

func spanFrom(ctx context.Context) *Span {
	if ctx == nil {
		return nil
	}
	if v, ok := ctx.Value(ctxKeySpan).(*Span); ok {
		return v
	}
	return nil
}

// tapHandler feeds every accepted record to the hub as well as to the real
// sinks, which is how the WebUI console gets a live stream without a second
// logger instance.
//
// It also has to re-apply the attributes captured by WithAttrs/WithGroup.
// slog stores those on the handler rather than on each Record, so a plain
// r.Attrs() walk would never see them and every console record would be missing
// its component tag.
type tappingHandler struct {
	inner slog.Handler
	attrs []slog.Attr
	group string
}

func (t *tappingHandler) Enabled(ctx context.Context, l slog.Level) bool {
	return t.inner.Enabled(ctx, l)
}

func (t *tappingHandler) Handle(ctx context.Context, r slog.Record) error {
	if tap := spanFrom(ctx); tap != nil {
		r.AddAttrs(slog.String("span", tap.SpanID()))
	}
	if id := TraceID(ctx); id != "" {
		r.AddAttrs(slog.String("trace_id", id))
	}
	// The hub gets a copy carrying the handler-level attrs, because slog stores
	// those on the handler and Record.Attrs would never see them. The record
	// handed to the real sinks is left alone: they already have the attrs via
	// WithAttrs, and adding them again would emit every key twice in the JSON.
	if len(t.attrs) > 0 {
		fed := r.Clone()
		fed.AddAttrs(t.attrs...)
		hub.record(fed)
	} else {
		hub.record(r)
	}
	return t.inner.Handle(ctx, r)
}

func (t *tappingHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	if len(attrs) == 0 {
		return t
	}
	merged := make([]slog.Attr, 0, len(t.attrs)+len(attrs))
	merged = append(merged, t.attrs...)
	for _, a := range attrs {
		if t.group != "" && a.Key != "" {
			a.Key = t.group + "." + a.Key
		}
		merged = append(merged, a)
	}
	return &tappingHandler{inner: t.inner.WithAttrs(attrs), attrs: merged, group: t.group}
}

func (t *tappingHandler) WithGroup(name string) slog.Handler {
	group := name
	if t.group != "" {
		group = t.group + "." + name
	}
	return &tappingHandler{inner: t.inner.WithGroup(name), attrs: t.attrs, group: group}
}
