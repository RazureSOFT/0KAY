package gateway

import (
	"encoding/json"
	"net/http"
	"strings"
)

const (
	maxChatBody      = 4 << 20
	maxLifeChatBody  = 4 << 20
	maxDirectRunBody = 64 << 10
	maxSmallBody     = 64 << 10
	maxAgentBody     = 128 << 10
	maxTaskBody      = 2 << 20
)

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func writeErr(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, map[string]string{"error": message, "code": code})
}

func deprecated(w http.ResponseWriter, successor string) {
	w.Header().Set("Deprecation", "true")
	w.Header().Set("Link", "<"+successor+`>; rel="successor-version"`)
}

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
