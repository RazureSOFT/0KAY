package gateway

import (
	"context"
	"net/http"
	"strings"
	"time"

	"0kay/core/internal/egress"
)

type egressRequest struct {
	Method    string            `json:"method"`
	URL       string            `json:"url"`
	Headers   map[string]string `json:"headers"`
	Body      string            `json:"body"`
	TimeoutMS int               `json:"timeout_ms"`
}

func (g *Gateway) handleEgress(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	name := strings.TrimSpace(r.Header.Get(PluginHeader))
	info, ok := g.registry.Authenticate(name, bearerToken(r.Header.Get("Authorization")))
	if !ok {
		writeErr(w, http.StatusUnauthorized, "plugin_auth_failed", "valid plugin identity required")
		return
	}
	var req egressRequest
	if !decodeBody(w, r, &req, maxChatBody) {
		return
	}
	if strings.TrimSpace(req.URL) == "" {
		badRequest(w, "url is required")
		return
	}

	allowlist := []string{"*"}
	if !g.registry.IsTrusted(name) {
		allowlist = nil
		if info.Info != nil && info.Info.Permissions != nil {
			allowlist = info.Info.Permissions.Egress
		}
	}

	ctx, cancel := context.WithCancel(r.Context())
	defer cancel()
	resp, err := egress.Do(ctx, egress.Request{
		Method:  req.Method,
		URL:     req.URL,
		Headers: req.Headers,
		Body:    []byte(req.Body),
		Timeout: time.Duration(req.TimeoutMS) * time.Millisecond,
	}, allowlist)
	if err != nil {
		writeJSON(w, http.StatusOK, map[string]any{"status": 0, "error": err.Error()})
		return
	}
	body := string(resp.Body)
	writeJSON(w, http.StatusOK, map[string]any{
		"status":  resp.Status,
		"headers": resp.Headers,
		"body":    body,
	})
}
