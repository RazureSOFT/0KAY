package gateway

import (
	"bufio"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"

	"0kay/core/internal/pairing"
	"0kay/obs"
)

// Public wraps the authenticated handler chain with the browser-facing guards.
//
// Order matters:
//
//	hostGuard      - rejects Host headers a DNS-rebinding attacker needs
//	corsMiddleware - emits CORS headers and short-circuits preflights before
//	                 authentication (a preflight never carries credentials)
//	pairs.HTTP     - credential checks + /api/auth/session
//	logMiddleware  - request logging (installed by Gateway.Handler)
//	mux            - routes
func Public(next http.Handler) http.Handler {
	return hostGuard(corsMiddleware(next))
}

// The host allow-list comes from the environment, which does not change while
// the process runs, so it is parsed once and reused on every request. Tests
// that mutate the environment rebuild the snapshot via resetEnvCaches.
var allowedHosts = sync.OnceValue(hostAllowedHosts)

// hostAllowedHosts is the set of dotted hostnames a request may present.
// Single-label names (localhost, docker service names like "core") and IP
// literals cannot be used for DNS rebinding, so they are always accepted.
func hostAllowedHosts() map[string]bool {
	allowed := map[string]bool{}
	add := func(value string) {
		value = strings.ToLower(strings.TrimSpace(value))
		if value != "" {
			allowed[value] = true
		}
	}
	// Entries may be written as a bare hostname, host:port, or a full origin
	// URL. hostAllowed compares bare hostnames, so every form is reduced to
	// one: parse as a URL when a scheme is present, otherwise strip the port.
	addHost := func(value string) {
		value = strings.TrimSuffix(strings.TrimSpace(value), "/")
		if value == "" {
			return
		}
		if strings.Contains(value, "://") {
			if parsed, err := url.Parse(value); err == nil && parsed.Host != "" {
				add(parsed.Hostname())
			}
			return
		}
		if host, _, err := net.SplitHostPort(value); err == nil {
			value = host
		}
		add(strings.Trim(value, "[]"))
	}
	for _, key := range []string{"CORE_ALLOWED_HOSTS", "CORE_ALLOWED_ORIGINS"} {
		for _, entry := range strings.Split(os.Getenv(key), ",") {
			addHost(entry)
		}
	}
	add(pairingHostIdentity())
	return allowed
}

// pairingHostIdentity returns Core's TLS identity (used as the certificate
// common name in LAN mode) so a browser may address Core by that name.
func pairingHostIdentity() string {
	if pairing.Default == nil {
		return ""
	}
	for _, candidate := range []string{pairing.Default.ID, pairing.Default.Name} {
		if strings.Contains(candidate, ".") {
			return candidate
		}
	}
	return ""
}

// resetEnvCaches forces the cached environment snapshots to be recomputed on
// the next use. Only tests change the environment after startup.
func resetEnvCaches() {
	allowedHosts = sync.OnceValue(hostAllowedHosts)
	allowedOrigins = sync.OnceValue(allowedOriginList)
	webuiPorts = sync.OnceValue(allowedWebuiPorts)
}

// hostGuard rejects requests whose Host header cannot belong to this deployment.
func hostGuard(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !hostAllowed(r.Host) {
			writeErr(w, http.StatusForbidden, "host_not_allowed", "host not allowed")
			return
		}
		next.ServeHTTP(w, r)
	})
}

func hostAllowed(host string) bool {
	hostname := host
	if split, _, err := net.SplitHostPort(host); err == nil {
		hostname = split
	}
	hostname = strings.TrimSuffix(strings.ToLower(strings.TrimSpace(hostname)), ".")
	hostname = strings.Trim(hostname, "[]")
	if hostname == "" {
		return false
	}
	// IP literals (including IPv6) and single-label service names are not
	// usable for DNS rebinding: an attacker needs a resolvable dotted name.
	if net.ParseIP(hostname) != nil || !strings.Contains(hostname, ".") {
		return true
	}
	return allowedHosts()[hostname]
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !allowedOrigin(r) {
			writeErr(w, http.StatusForbidden, "origin_not_allowed", "origin not allowed")
			return
		}
		if origin := r.Header.Get("Origin"); origin != "" {
			// The origin has already been validated by allowedOrigin, and it is
			// echoed (not reflected blindly) so credentialed cookie auth works
			// for explicitly allowed frontends only.
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.Header().Add("Vary", "Origin")
		}
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-0kay-Pin")
		w.Header().Set("Access-Control-Max-Age", "600")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// statusRecorder remembers the status code for access logging while keeping
// the streaming (Flusher), upgrade (Hijacker) and HTTP/2 (Pusher) contracts
// the SSE and WebSocket handlers rely on.
type statusRecorder struct {
	http.ResponseWriter
	status      int
	wroteHeader bool
}

func (r *statusRecorder) WriteHeader(code int) {
	if !r.wroteHeader {
		r.status = code
		r.wroteHeader = true
	}
	r.ResponseWriter.WriteHeader(code)
}

func (r *statusRecorder) Write(body []byte) (int, error) {
	r.wroteHeader = true
	return r.ResponseWriter.Write(body)
}

func (r *statusRecorder) Flush() {
	if flusher, ok := r.ResponseWriter.(http.Flusher); ok {
		flusher.Flush()
	}
}

func (r *statusRecorder) Hijack() (net.Conn, *bufio.ReadWriter, error) {
	if hijacker, ok := r.ResponseWriter.(http.Hijacker); ok {
		return hijacker.Hijack()
	}
	return nil, nil, http.ErrNotSupported
}

func (r *statusRecorder) Push(target string, opts *http.PushOptions) error {
	if pusher, ok := r.ResponseWriter.(http.Pusher); ok {
		return pusher.Push(target, opts)
	}
	return http.ErrNotSupported
}

// Unwrap lets http.ResponseController reach the underlying writer. Without it
// every optional-capability check fails, including the SetWriteDeadline and
// Flush calls that long-lived stream handlers depend on.
func (r *statusRecorder) Unwrap() http.ResponseWriter { return r.ResponseWriter }

// streamPaths are the long-lived responses whose measured duration is the length
// of the stream rather than the cost of serving the request. Logging them as a
// single "slow request" would be noise, so they are marked and logged at debug.
var streamPaths = map[string]bool{
	"/api/chat":                     true,
	"/api/life/chat":                true,
	"/api/tasks/events":             true,
	"/api/agent/browser/stream":     true,
	"/api/agent/computeruse/stream": true,
	"/ws":                           true,
}

// obsLog is the access logger. It is a package var rather than an inline call so
// tests can swap it, and so the component tag lives in one place.
var obsLog = obs.Component("http")

// logMiddleware gives every request an id, a root span and a structured access
// log line. The id is taken from an inbound X-0kay-Request-Id when present so a
// browser retry or the agent's own correlation id survives the hop into Core,
// and is echoed back on the response.
func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		requestID := strings.TrimSpace(r.Header.Get(RequestIDHeader))
		if requestID == "" {
			requestID = obs.NewID()
		}
		w.Header().Set(RequestIDHeader, requestID)

		ctx, span := obs.StartWithID(r.Context(), requestID, r.Method+" "+r.URL.Path, obs.KindServer)
		span.Attr("method", r.Method)
		span.Attr("path", r.URL.Path)
		if v := r.Header.Get(PluginHeader); v != "" {
			span.Attr("plugin", v)
		}
		if v := r.Header.Get(pairing.PinHeader); v != "" {
			// Presence only. The value is a credential and must never be logged.
			span.Attr("pin", "presented")
		}

		started := time.Now()
		recorder := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(recorder, r.WithContext(ctx))
		elapsed := time.Since(started)

		status := recorder.status
		attrs := []any{
			"method", r.Method,
			"path", r.URL.Path,
			"status", status,
			"duration_ms", elapsed.Milliseconds(),
		}
		if q := r.URL.RawQuery; q != "" {
			attrs = append(attrs, "query", q)
		}
		switch {
		case streamPaths[r.URL.Path]:
			// Duration here is the stream length, not the handler cost.
			span.Event("stream_closed", nil)
			span.Attr("stream", "true")
			obsLog.DebugContext(ctx, "stream closed", attrs...)
		case status >= 500:
			span.Fail(fmt.Errorf("http %d", status))
			obsLog.ErrorContext(ctx, "request failed", attrs...)
		case status >= 400:
			obsLog.WarnContext(ctx, "request rejected", attrs...)
		default:
			obsLog.DebugContext(ctx, "request", attrs...)
		}
		span.End()
	})
}
