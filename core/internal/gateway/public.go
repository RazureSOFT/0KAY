package gateway

import (
	"bufio"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	"0kay/core/internal/pairing"
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
	trimURL := func(value string) string {
		value = strings.TrimSuffix(strings.TrimSpace(value), "/")
		value = strings.TrimPrefix(value, "https://")
		value = strings.TrimPrefix(value, "http://")
		if parsed, err := url.Parse(value); err == nil && parsed.Host != "" {
			add(parsed.Hostname())
		}
		return value
	}
	for _, entry := range strings.Split(os.Getenv("CORE_ALLOWED_HOSTS"), ",") {
		add(trimURL(entry))
	}
	for _, entry := range strings.Split(os.Getenv("CORE_ALLOWED_ORIGINS"), ",") {
		trimURL(entry)
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
	return hostAllowedHosts()[hostname]
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
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
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

func logMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		started := time.Now()
		recorder := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(recorder, r)
		log.Printf("%s %s %d %s", r.Method, r.URL.Path, recorder.status, time.Since(started).Round(time.Millisecond))
	})
}
