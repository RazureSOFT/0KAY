package gateway

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"0kay/core/internal/pairing"
	agentv1 "0kay/gen/agent/v1"
)

func (g *Gateway) handleAgentWorkspace(w http.ResponseWriter, r *http.Request) {
	// GET browses; POST creates a folder — but only on /api/agent/workspace
	// (/api/agent/host is read-only).
	if r.Method == http.MethodPost && r.URL.Path != "/api/agent/workspace" {
		allowMethod(w, r, http.MethodGet)
		return
	}
	if !allowMethod(w, r, http.MethodGet, http.MethodPost) {
		return
	}
	id := r.URL.Query().Get("executor_id")
	agents := g.registry.GetAgents(true)
	for _, agent := range agents {
		if id != "" && agent.PluginID != id {
			continue
		}
		conn, err := g.dial(agent.Address)
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		tool := "workspace_browse"
		if r.URL.Path == "/api/agent/host" {
			tool = "host_status"
		}
		args, _ := json.Marshal(map[string]string{"path": r.URL.Query().Get("path")})
		if r.Method == http.MethodPost {
			var body struct {
				Path string `json:"path"`
				Name string `json:"name"`
			}
			if !decodeBody(w, r, &body, maxSmallBody) {
				return
			}
			tool = "workspace_mkdir"
			args, _ = json.Marshal(body)
		}
		ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
		defer cancel()
		result, err := agentv1.NewAgentServiceClient(conn).RunDirect(pairing.CallbackContext(ctx, agent.Address), &agentv1.RunDirectRequest{Tool: tool, Args: string(args)})
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		if !result.Success {
			writeErr(w, http.StatusBadRequest, "workspace_error", result.Error)
			return
		}
		writeRawJSON(w, http.StatusOK, result.Result)
		return
	}
	unavailable(w, "selected executor unavailable")
}

// handleAgentCompact POST /api/agent/compact {session_id, model_id?} — folds the
// session history into a structured summary (see compactSession).
func (g *Gateway) handleAgentCompact(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var body struct {
		SessionID string `json:"session_id"`
		ModelID   string `json:"model_id"`
	}
	if !decodeBody(w, r, &body, maxSmallBody) {
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 120*time.Second)
	defer cancel()
	summary, err := g.compactSession(ctx, body.SessionID, body.ModelID)
	if err != nil {
		message := err.Error()
		switch {
		case strings.Contains(message, "invalid session"), strings.Contains(message, "no conversation"):
			badRequest(w, message)
		case strings.Contains(message, "wait for active work"):
			writeErr(w, http.StatusConflict, "conflict", message)
		default:
			upstreamError(w, message)
		}
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"summary": summary})
}
