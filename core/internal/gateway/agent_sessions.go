package gateway

import (
	corev1 "0kay/gen/core/v1"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"
)

func (g *Gateway) handleAgentSessions(w http.ResponseWriter, r *http.Request) {
	if g.localCore == nil {
		unavailable(w, "core not ready")
		return
	}
	switch r.Method {
	case http.MethodPatch, http.MethodDelete:
		// Legacy body-parameter form of DELETE/PATCH /api/agent/sessions/{session_id}.
		deprecated(w, "/api/agent/sessions/{session_id}")
		var body struct {
			SessionID string `json:"session_id"`
			Action    string `json:"action"`
			Title     string `json:"title"`
		}
		if !decodeBody(w, r, &body, 8192) {
			return
		}
		if body.SessionID == "" {
			badRequest(w, "session_id required")
			return
		}
		g.manageAgentSession(w, r.Method, body.SessionID, body.Action, body.Title)
	case http.MethodGet:
		sessions := []map[string]interface{}{}
		for _, task := range g.localCore.ListTasks() {
			if task["kind"] == "agent_session" {
				sessions = append(sessions, task)
			}
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{"sessions": sessions})
	case http.MethodPost:
		var body struct {
			Title string `json:"title"`
		}
		if !decodeBody(w, r, &body, 8192) {
			return
		}
		id, err := g.localCore.CreateAgentSession(body.Title)
		if err != nil {
			writeErr(w, http.StatusInternalServerError, "internal_error", err.Error())
			return
		}
		writeJSON(w, http.StatusCreated, map[string]string{"session_id": id})
	default:
		allowMethod(w, r, http.MethodGet, http.MethodPost, http.MethodPatch, http.MethodDelete)
	}
}

// handleAgentSessionItem is the REST form of the session mutations:
//
//	PATCH  /api/agent/sessions/{session_id}  {"action":"rename","title":"…"}
//	DELETE /api/agent/sessions/{session_id}
func (g *Gateway) handleAgentSessionItem(w http.ResponseWriter, r *http.Request) {
	if g.localCore == nil {
		unavailable(w, "core not ready")
		return
	}
	sessionID := r.PathValue("session_id")
	if sessionID == "" {
		badRequest(w, "session_id required")
		return
	}
	switch r.Method {
	case http.MethodDelete:
		g.manageAgentSession(w, r.Method, sessionID, "delete", "")
	case http.MethodPatch:
		var body struct {
			Action string `json:"action"`
			Title  string `json:"title"`
		}
		if !decodeBody(w, r, &body, 8192) {
			return
		}
		g.manageAgentSession(w, r.Method, sessionID, body.Action, body.Title)
	default:
		allowMethod(w, r, http.MethodPatch, http.MethodDelete)
	}
}

func (g *Gateway) manageAgentSession(w http.ResponseWriter, method, sessionID, action, title string) {
	if method == http.MethodDelete {
		action = "delete"
	}
	if action == "rename" {
		if err := g.localCore.RenameAgentSession(sessionID, title); err != nil {
			writeErr(w, http.StatusConflict, "conflict", err.Error())
			return
		}
		writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
		return
	}
	if err := g.localCore.ManageAgentSession(sessionID, action); err != nil {
		writeErr(w, http.StatusConflict, "conflict", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
}

func (g *Gateway) handleAgentMessage(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var body struct {
		SessionID  string `json:"session_id"`
		Prompt     string `json:"prompt"`
		AgentType  string `json:"agent_type"`
		ExecutorID string `json:"executor_id"`
		Workdir    string `json:"workdir"`
		ModelID    string `json:"model_id"`
		Intensity  string `json:"thinking_intensity"`
		Permission string `json:"permission_mode"`
		Language   string `json:"language"`
	}
	if !decodeBody(w, r, &body, maxAgentBody) {
		return
	}
	if strings.TrimSpace(body.Prompt) == "" {
		badRequest(w, "prompt required")
		return
	}
	if g.localCore == nil || !g.localCore.HasAgentSession(body.SessionID) {
		writeErr(w, http.StatusNotFound, "not_found", "session not found")
		return
	}
	for _, task := range g.localCore.ListTasks() {
		if task["session_id"] == body.SessionID && (task["state"] == "running" || task["state"] == "pending") {
			writeErr(w, http.StatusConflict, "conflict", "session already has an active task")
			return
		}
	}
	id := fmt.Sprintf("agent-task:%d", time.Now().UnixNano())
	if body.Intensity == "" {
		body.Intensity = "medium"
	}
	switch body.Intensity {
	case "off", "low", "medium", "high", "max":
	default:
		value, err := strconv.ParseFloat(body.Intensity, 64)
		if err != nil || math.IsNaN(value) || math.IsInf(value, 0) || value < 0 || value > 100 {
			badRequest(w, "thinking intensity must be between 0 and 100")
			return
		}
	}
	if body.ModelID == "" {
		body.ModelID = "MOCR"
	}
	if body.Permission == "" {
		body.Permission = "normal"
	}
	if body.Permission != "normal" && body.Permission != "full_access" {
		badRequest(w, "invalid permission mode")
		return
	}
	response, err := g.coreSvc.UseAgent(r.Context(), &corev1.UseAgentRequest{TaskId: id, CallerId: "webui", Prompt: body.Prompt, AgentType: body.AgentType, Metadata: map[string]string{"session_id": body.SessionID, "executor_id": body.ExecutorID, "workdir": body.Workdir, "model_id": body.ModelID, "thinking_intensity": body.Intensity, "permission_mode": body.Permission, "language": body.Language}})
	if err != nil {
		writeErr(w, http.StatusBadGateway, "upstream_error", err.Error())
		return
	}
	status := http.StatusAccepted
	if !response.Accepted {
		status = http.StatusServiceUnavailable
	}
	writeJSON(w, status, map[string]interface{}{"task_id": response.TaskId, "accepted": response.Accepted, "message": response.Message})
}

// handleTaskCancel POST /api/tasks/cancel {"task_id": …} — legacy alias for
// POST /api/tasks/{task_id}/cancel.
func (g *Gateway) handleTaskCancel(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	deprecated(w, "/api/tasks/{task_id}/cancel")
	var body struct {
		TaskID string `json:"task_id"`
	}
	if !decodeBody(w, r, &body, maxSmallBody) {
		return
	}
	if body.TaskID == "" {
		badRequest(w, "task_id required")
		return
	}
	g.cancelTask(w, r, body.TaskID)
}

// handleTaskCancelPath POST /api/tasks/{task_id}/cancel
func (g *Gateway) handleTaskCancelPath(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	taskID := r.PathValue("task_id")
	if taskID == "" {
		badRequest(w, "task_id required")
		return
	}
	g.cancelTask(w, r, taskID)
}

func (g *Gateway) cancelTask(w http.ResponseWriter, r *http.Request, taskID string) {
	response, err := g.coreSvc.CancelAgent(r.Context(), &corev1.CancelAgentRequest{TaskId: taskID, CallerId: "webui"})
	if err != nil {
		writeErr(w, http.StatusBadGateway, "upstream_error", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"success": response.Success, "message": response.Message})
}
