package gateway

import (
	"bufio"
	"fmt"
	"log"
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

func Public(next http.Handler) http.Handler {
	return hostGuard(corsMiddleware(next))
}

var allowedHosts = sync.OnceValue(hostAllowedHosts)

func hostAllowedHosts() map[string]bool {
	allowed := map[string]bool{}
	add := func(value string) {
		value = strings.ToLower(strings.TrimSpace(value))
		if value != "" {
			allowed[value] = true
		}
	}
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

func resetEnvCaches() {
	allowedHosts = sync.OnceValue(hostAllowedHosts)
	allowedOrigins = sync.OnceValue(allowedOriginList)
	webuiPorts = sync.OnceValue(allowedWebuiPorts)
}

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

// these never finish on their own. an hour-long "slow request" tells nobody
// a fucking thing, so they get a span and no log line.
var streamPaths = []string{"/api/life/chat", "/api/tasks/events", "/api/chat"}

func isStreamPath(path string) bool {
	for _, prefix := range streamPaths {
		if path == prefix || strings.HasPrefix(path, prefix+"/") {
			return true
		}
	}
	return false
}

func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		started := time.Now()
		inbound := strings.TrimSpace(r.Header.Get(RequestIDHeader))
		ctx, span := obs.StartWithID(r.Context(), inbound, r.Method+" "+r.URL.Path, "http")
		span.Attr("method", r.Method)
		span.Attr("path", r.URL.Path)
		stream := isStreamPath(r.URL.Path)
		if stream {
			span.Attr("stream", "true")
		}
		traceID := inbound
		if traceID == "" {
			traceID = span.TraceID()
		}
		w.Header().Set(RequestIDHeader, traceID)

		recorder := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(recorder, r.WithContext(ctx))

		elapsed := time.Since(started)
		if recorder.status >= 400 {
			span.Fail(fmt.Errorf("status %d", recorder.status))
		}
		span.End()
		if !stream {
			log.Printf("%s %s %d %s", r.Method, r.URL.Path, recorder.status, elapsed.Round(time.Millisecond))
		}
	})
}
