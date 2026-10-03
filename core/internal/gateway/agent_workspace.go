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

// agentRunDirect proxies one read-only RunDirect tool to a reachable agent.
func (g *Gateway) agentRunDirect(w http.ResponseWriter, r *http.Request, tool string, args map[string]string) {
	g.agentRunDirectWithTimeout(w, r, tool, args, 15*time.Second)
}

// agentRunDirectWithTimeout is agentRunDirect with a caller-chosen deadline
// (used by document conversion, which can take a while).
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

// handleAgentFileConvert GET /api/agent/file/convert?executor_id=&path=&target= —
// convert a legacy Office file (LibreOffice) for preview, e.g. .doc/.ppt → pdf.
func (g *Gateway) handleAgentFileConvert(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirectWithTimeout(w, r, "workspace_convert", map[string]string{
		"path":   r.URL.Query().Get("path"),
		"target": r.URL.Query().Get("target"),
	}, 160*time.Second)
}

// handleAgentFileText GET /api/agent/file/text?executor_id=&path= — best-effort
// plain-text extraction from a legacy Office file (fallback when conversion is
// unavailable).
func (g *Gateway) handleAgentFileText(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirectWithTimeout(w, r, "workspace_extract_text", map[string]string{"path": r.URL.Query().Get("path")}, 40*time.Second)
}

// handleAgentTree GET /api/agent/tree?executor_id=&path= — one directory level
// of the workspace, for the WebUI project-tree window.
func (g *Gateway) handleAgentTree(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirect(w, r, "workspace_tree", map[string]string{"path": r.URL.Query().Get("path")})
}

// handleAgentFile GET /api/agent/file?executor_id=&path=&offset=&limit= — read a
// workspace text file for preview.
func (g *Gateway) handleAgentFile(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirect(w, r, "workspace_read", map[string]string{
		"path":   r.URL.Query().Get("path"),
		"offset": r.URL.Query().Get("offset"),
		"limit":  r.URL.Query().Get("limit"),
	})
}

// handleAgentFileRaw GET /api/agent/file/raw?executor_id=&path= — read a file as
// base64 (binary-safe) so the WebUI can render PDF/Office/images.
func (g *Gateway) handleAgentFileRaw(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirect(w, r, "workspace_read_binary", map[string]string{"path": r.URL.Query().Get("path")})
}

// runDirectPost forwards a JSON body (minus executor_id) to an agent RunDirect
// tool. Shared by the terminal console and the editable file preview.
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

// handleAgentFileWrite POST /api/agent/file {executor_id,path,content} — save the
// WebUI's editable file preview back to the executor.
func (g *Gateway) handleAgentFileWrite(w http.ResponseWriter, r *http.Request) {
	g.runDirectPost(w, r, "workspace_write", 30*time.Second)
}

// handleAgentExec POST /api/agent/exec {executor_id,command,cwd,timeout} — run a
// shell command on the chosen executor for the WebUI terminal console.
func (g *Gateway) handleAgentExec(w http.ResponseWriter, r *http.Request) {
	g.runDirectPost(w, r, "terminal_exec", 320*time.Second)
}

// handleAgentPickFolder GET /api/agent/pick-folder?executor_id=&title= — open
// the executor host's native OS folder dialog and return the chosen path. The
// request blocks until the user picks or cancels (cancelling returns 400 with
// {"cancelled":true} in the agent payload).
func (g *Gateway) handleAgentPickFolder(w http.ResponseWriter, r *http.Request) {
	g.agentRunDirectWithTimeout(w, r, "workspace_pick", map[string]string{
		"title": r.URL.Query().Get("title"),
	}, 300*time.Second)
}
