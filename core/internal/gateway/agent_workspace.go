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

func (g *Gateway) agentRunDirect(w http.ResponseWriter, r *http.Request, tool string, args map[string]string) {
	g.agentRunDirectWithTimeout(w, r, tool, args, 15*time.Second)
}

func (g *Gateway) agentRunDirectWithTimeout(w http.ResponseWriter, r *http.Request, tool string, args map[string]string, timeout time.Duration) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	id := r.URL.Query().Get("executor_id")
	raw, _ := json.Marshal(args)
	for _, agent := range g.registry.GetAgents(true) {
		if id != "" && agent.PluginID != id {
			continue
		}
		conn, err := g.dial(agent.Address)
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		ctx, cancel := context.WithTimeout(r.Context(), timeout)
		defer cancel()
		result, err := agentv1.NewAgentServiceClient(conn).RunDirect(
			pairing.CallbackContext(ctx, agent.Address),
			&agentv1.RunDirectRequest{Tool: tool, Args: string(raw)},
		)
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		if !result.Success {
			writeErr(w, http.StatusBadRequest, "agent_error", result.Error)
			return
		}
		writeRawJSON(w, http.StatusOK, result.Result)
		return
	}
	unavailable(w, "selected executor unavailable")
}

func (g *Gateway) handleAgentFileConvert(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirectWithTimeout(w, r, "workspace_convert", map[string]string{
		"path":   r.URL.Query().Get("path"),
		"target": r.URL.Query().Get("target"),
	}, 160*time.Second)
}

func (g *Gateway) handleAgentFileText(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirectWithTimeout(w, r, "workspace_extract_text", map[string]string{"path": r.URL.Query().Get("path")}, 40*time.Second)
}

func (g *Gateway) handleAgentTree(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirect(w, r, "workspace_tree", map[string]string{"path": r.URL.Query().Get("path")})
}

func (g *Gateway) handleAgentFile(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirect(w, r, "workspace_read", map[string]string{
		"path":   r.URL.Query().Get("path"),
		"offset": r.URL.Query().Get("offset"),
		"limit":  r.URL.Query().Get("limit"),
	})
}

func (g *Gateway) handleAgentFileRaw(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirect(w, r, "workspace_read_binary", map[string]string{"path": r.URL.Query().Get("path")})
}

func (g *Gateway) runDirectPost(w http.ResponseWriter, r *http.Request, tool string, timeout time.Duration) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var body map[string]interface{}
	if !decodeBody(w, r, &body, maxTaskBody) {
		return
	}
	id, _ := body["executor_id"].(string)
	delete(body, "executor_id")
	args, err := json.Marshal(body)
	if err != nil {
		badRequest(w, "invalid request body")
		return
	}
	for _, agent := range g.registry.GetAgents(true) {
		if id != "" && agent.PluginID != id {
			continue
		}
		conn, err := g.dial(agent.Address)
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		ctx, cancel := context.WithTimeout(r.Context(), timeout)
		defer cancel()
		result, err := agentv1.NewAgentServiceClient(conn).RunDirect(
			pairing.CallbackContext(ctx, agent.Address),
			&agentv1.RunDirectRequest{Tool: tool, Args: string(args)},
		)
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		if !result.Success {
			writeErr(w, http.StatusBadRequest, "agent_error", result.Error)
			return
		}
		writeRawJSON(w, http.StatusOK, result.Result)
		return
	}
	unavailable(w, "selected executor unavailable")
}

func (g *Gateway) handleAgentFileWrite(w http.ResponseWriter, r *http.Request) {
	g.runDirectPost(w, r, "workspace_write", 30*time.Second)
}

func (g *Gateway) handleAgentExec(w http.ResponseWriter, r *http.Request) {
	if g.localCore != nil && !g.localCore.GetPermissions().ComputerUse {
		writeErr(w, http.StatusForbidden, "computer_use_disabled", "computer_use permission is disabled")
		return
	}
	g.runDirectPost(w, r, "terminal_exec", 320*time.Second)
}

func (g *Gateway) handleAgentPickFolder(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirectWithTimeout(w, r, "workspace_pick", map[string]string{
		"title": r.URL.Query().Get("title"),
	}, 300*time.Second)
}
