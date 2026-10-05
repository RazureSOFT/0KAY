package gateway

import (
	corev1 "0kay/gen/core/v1"
	"fmt"
	"math"
	"net/http"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"
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

// handleAgentSessionTurns GET /api/agent/sessions/{session_id}/turns?before=&limit=
// returns one page of a session's rows (newest first) so the browser can load an
// old conversation on demand instead of receiving the whole history up front.
func (g *Gateway) handleAgentSessionTurns(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	if g.localCore == nil {
		unavailable(w, "core not ready")
		return
	}
	sessionID := r.PathValue("session_id")
	if sessionID == "" {
		badRequest(w, "session_id required")
		return
	}
	limit := 50
	if raw := strings.TrimSpace(r.URL.Query().Get("limit")); raw != "" {
		if value, err := strconv.Atoi(raw); err == nil {
			limit = value
		}
	}
	rows, more, next := g.localCore.SessionTasksPage(sessionID, strings.TrimSpace(r.URL.Query().Get("before")), limit)
	writeJSON(w, http.StatusOK, map[string]interface{}{"tasks": rows, "more": more, "next": next})
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
		SessionID   string       `json:"session_id"`
		Prompt      string       `json:"prompt"`
		AgentType   string       `json:"agent_type"`
		ExecutorID  string       `json:"executor_id"`
		Workdir     string       `json:"workdir"`
		ModelID     string       `json:"model_id"`
		Intensity   string       `json:"thinking_intensity"`
		Permission  string       `json:"permission_mode"`
		Language    string       `json:"language"`
		MinimalMode bool         `json:"minimal_mode"`
		Attachments []Attachment `json:"attachments"`
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
	for _, task := range g.localCore.SessionTasks(body.SessionID) {
		if task["state"] == "running" || task["state"] == "pending" {
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
	// Auto-compact (opencode-style): when the live context approaches the
	// threshold, fold it in the background so up to 120s of summarisation never
	// blocks the request. Best effort — a failure must not affect the turn.
	compactNeeded := g.sessionContextTokens(body.SessionID) >= autoCompactTokens()
	// Carry an earlier /compact summary into this turn: the agent has no
	// cross-turn memory, so without prepending it the summary would be cosmetic.
	if summary := g.latestCompactSummary(body.SessionID); summary != "" {
		body.Prompt = "Summary of earlier context in this session (carry it forward). If you need exact details that were folded away, call session_context_search with keywords and then session_context_decompress with a returned id.\n" + summary + "\n\n---\n\n" + body.Prompt
	}
	metadata := map[string]string{"session_id": body.SessionID, "executor_id": body.ExecutorID, "workdir": body.Workdir, "model_id": body.ModelID, "thinking_intensity": body.Intensity, "permission_mode": body.Permission, "language": body.Language}
	if body.MinimalMode {
		metadata["minimal_mode"] = "1"
	}
	if encoded := encodeAttachments(body.Attachments); encoded != "" {
		metadata["attachments"] = encoded
	}
	response, err := g.coreSvc.UseAgent(r.Context(), &corev1.UseAgentRequest{TaskId: id, CallerId: "webui", Prompt: body.Prompt, AgentType: body.AgentType, Metadata: metadata})
	if err != nil {
		writeErr(w, http.StatusBadGateway, "upstream_error", err.Error())
		return
	}
	if compactNeeded {
		g.autoCompactAsync(body.SessionID, body.ModelID)
	}
	status := http.StatusAccepted
	if !response.Accepted {
		status = http.StatusServiceUnavailable
	}
	writeJSON(w, status, map[string]interface{}{"task_id": response.TaskId, "accepted": response.Accepted, "message": response.Message})
}

// latestCompactSummary returns the most recent successful /compact summary for
// a session ("" when none). ListTasks is ordered newest-first.
func (g *Gateway) latestCompactSummary(sessionID string) string {
	if g.localCore == nil || sessionID == "" {
		return ""
	}
	for _, task := range g.localCore.SessionTasks(sessionID) {
		if task["kind"] != "compact" || task["state"] != "done" {
			continue
		}
		if result, _ := task["result"].(string); strings.TrimSpace(result) != "" {
			return result
		}
	}
	return ""
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

// handleAgentSessionsFork POST /api/agent/sessions/fork {"session_id":…} — copy
// a session's completed turns into a new session with an incremented title.
func (g *Gateway) handleAgentSessionsFork(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	if g.localCore == nil {
		unavailable(w, "core not ready")
		return
	}
	var body struct {
		SessionID string `json:"session_id"`
	}
	if !decodeBody(w, r, &body, maxSmallBody) {
		return
	}
	if strings.TrimSpace(body.SessionID) == "" {
		badRequest(w, "session_id required")
		return
	}
	id, err := g.localCore.ForkAgentSession(body.SessionID)
	if err != nil {
		writeErr(w, http.StatusConflict, "conflict", err.Error())
		return
	}
	writeJSON(w, http.StatusCreated, map[string]string{"session_id": id})
}

// handleAgentSessionsSearch GET /api/agent/sessions/search?q=&limit= — literal,
// case-insensitive search over session titles and turn text. Metadata (title)
// matches come first, then content matches carry a snippet.
func (g *Gateway) handleAgentSessionsSearch(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	if g.localCore == nil {
		unavailable(w, "core not ready")
		return
	}
	query := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("q")))
	matches := []map[string]any{}
	if query == "" {
		writeJSON(w, http.StatusOK, map[string]any{"matches": matches})
		return
	}
	limit := 20
	titles := map[string]string{}
	snippets := map[string]string{}
	seen := map[string]bool{}
	add := func(sessionID, snippet string) {
		if sessionID == "" || seen[sessionID] || len(matches) >= limit {
			return
		}
		seen[sessionID] = true
		matches = append(matches, map[string]any{"session_id": sessionID, "title": titles[sessionID], "snippet": snippet})
	}
	tasks := g.localCore.ListTasks()
	for _, task := range tasks {
		if task["kind"] != "agent_session" {
			continue
		}
		sessionID, _ := task["session_id"].(string)
		title, _ := task["prompt"].(string)
		if sessionID == "" {
			continue
		}
		titles[sessionID] = title
		if strings.Contains(strings.ToLower(title), query) {
			add(sessionID, title)
		}
	}
	for _, task := range tasks {
		sessionID, _ := task["session_id"].(string)
		kind, _ := task["kind"].(string)
		if sessionID == "" || seen[sessionID] || (kind != "agent" && kind != "compact") {
			continue
		}
		prompt, _ := task["prompt"].(string)
		result, _ := task["result"].(string)
		text := strings.TrimSpace(strings.Join([]string{prompt, result}, "\n"))
		if !strings.Contains(strings.ToLower(text), query) {
			continue
		}
		if snippets[sessionID] == "" {
			snippets[sessionID] = snippetAround(text, query)
		}
		add(sessionID, snippets[sessionID])
	}
	writeJSON(w, http.StatusOK, map[string]any{"matches": matches})
}

// snippetAround returns a rune-safe window of text around the first match of
// query (already lowercased), bracketed with ellipses when trimmed.
func snippetAround(text, query string) string {
	lower := strings.ToLower(text)
	index := strings.Index(lower, query)
	if index < 0 {
		index = 0
	}
	start := index - 40
	if start < 0 {
		start = 0
	}
	end := index + len(query) + 60
	if end > len(text) {
		end = len(text)
	}
	for start > 0 && !utf8.RuneStart(text[start]) {
		start--
	}
	for end < len(text) && !utf8.RuneStart(text[end]) {
		end++
	}
	snippet := strings.TrimSpace(text[start:end])
	if start > 0 {
		snippet = "…" + snippet
	}
	if end < len(text) {
		snippet += "…"
	}
	return snippet
}
