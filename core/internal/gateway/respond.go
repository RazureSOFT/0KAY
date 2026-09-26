package gateway

import (
	"encoding/json"
	"net/http"
	"strings"
)

// Request body limits. Uploading files goes through /api/images and
// /api/live2d, which have their own (much larger) bounds.
const (
	maxChatBody      = 4 << 20 // chat history + prompt
	maxLifeChatBody  = 4 << 20
	maxDirectRunBody = 64 << 10
	maxSmallBody     = 64 << 10
	maxAgentBody     = 128 << 10
	maxTaskBody      = 2 << 20
)

// writeJSON writes an application/json payload with an explicit status code.
func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

// writeErr writes the canonical Core error envelope:
//
//	{"error": "<human readable message>", "code": "<machine readable code>"}
//
// Every non-2xx JSON response uses this shape so clients can render a message
// and still branch on a stable code. It is deliberately always JSON (never
// text/plain) so `data?.error` style handling works for every endpoint.
func writeErr(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, map[string]string{"error": message, "code": code})
}

// deprecated marks a legacy alias route before its response is written.
//
// It emits the standard Deprecation/Link pair so tooling and logs can see that
// the caller should move to the successor route, while the alias itself keeps
// working (no forced migration).
func deprecated(w http.ResponseWriter, successor string) {
	w.Header().Set("Deprecation", "true")
	w.Header().Set("Link", "<"+successor+`>; rel="successor-version"`)
}

// allowMethod reports whether r.Method is one of allowed. Otherwise it writes
// a 405 with an Allow header using the JSON error envelope.
func allowMethod(w http.ResponseWriter, r *http.Request, allowed ...string) bool {
	for _, method := range allowed {
		if r.Method == method {
			return true
		}
	}
	list := make([]string, 0, len(allowed)+1)
	list = append(list, allowed...)
	list = append(list, http.MethodOptions)
	w.Header().Set("Allow", strings.Join(list, ", "))
	writeErr(w, http.StatusMethodNotAllowed, "method_not_allowed", "method not allowed")
	return false
}

// decodeBody reads a bounded JSON body into dst and reports whether it was
// valid, writing the canonical 400 envelope itself when it was not. The default
// limit is 1 MiB; callers handling uploads or large history must pass a larger
// bound.
func decodeBody(w http.ResponseWriter, r *http.Request, dst any, limit int64) bool {
	if limit <= 0 {
		limit = 1 << 20
	}
	r.Body = http.MaxBytesReader(w, r.Body, limit)
	if err := json.NewDecoder(r.Body).Decode(dst); err != nil {
		badRequest(w, "invalid request body")
		return false
	}
	return true
}

// writeRawJSON forwards a JSON document produced upstream (gRPC string fields
// that already contain JSON). If it is empty or malformed a JSON error envelope
// is written instead, so a 200 response can never carry an unparseable body.
func writeRawJSON(w http.ResponseWriter, status int, body string) {
	if strings.TrimSpace(body) == "" {
		writeJSON(w, status, map[string]any{})
		return
	}
	if !json.Valid([]byte(body)) {
		writeErr(w, http.StatusBadGateway, "upstream_error", "upstream returned invalid json")
		return
	}
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_, _ = w.Write([]byte(body))
}

func badRequest(w http.ResponseWriter, message string) {
	writeErr(w, http.StatusBadRequest, "bad_request", message)
}

func notFound(w http.ResponseWriter, message string) {
	writeErr(w, http.StatusNotFound, "not_found", message)
}

func unavailable(w http.ResponseWriter, message string) {
	writeErr(w, http.StatusServiceUnavailable, "unavailable", message)
}

func upstreamError(w http.ResponseWriter, message string) {
	writeErr(w, http.StatusBadGateway, "upstream_error", message)
}
