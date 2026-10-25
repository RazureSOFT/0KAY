package gateway

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"0kay/core/internal/pairing"
	"0kay/core/internal/server"
	agentv1 "0kay/gen/agent/v1"
)

func (g *Gateway) handleAgentApprovals(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet, http.MethodPost) {
		return
	}
	questions := r.URL.Path == "/api/agent/questions"
	var body struct {
		ExecutorID string  `json:"executor_id"`
		ID         string  `json:"id"`
		Allow      *bool   `json:"allow"`
		Answer     *string `json:"answer"`
	}
	if r.Method == http.MethodPost {
		if !decodeBody(w, r, &body, maxSmallBody) {
			return
		}
		if (!questions && body.Allow == nil) || (questions && body.Answer == nil) {
			badRequest(w, "invalid decision")
			return
		}
	}

	tool := "approval_list"
	if questions {
		tool = "question_list"
	}
	var decide func() (string, map[string]any, bool)
	if r.Method == http.MethodPost {
		decide = func() (string, map[string]any, bool) {
			if questions {
				return "question_answer", map[string]any{"id": body.ID, "answer": *body.Answer}, true
			}
			return "approval_decide", map[string]any{"id": body.ID, "allow": *body.Allow}, true
		}
	}
	items, failed := g.collectAgentItems(r, body.ExecutorID, tool, decide)
	if failed != nil {
		writeAgentErr(w, failed)
		return
	}
	if r.Method == http.MethodPost {
		writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"approvals": items})
}

func (g *Gateway) handleAgentInbox(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	approvals, err := g.collectAgentItems(r, "", "approval_list", nil)
	if err != nil {
		writeAgentErr(w, err)
		return
	}
	questions, err := g.collectAgentItems(r, "", "question_list", nil)
	if err != nil {
		writeAgentErr(w, err)
		return
	}
	// Session cosmetics ride the same poll: an agent-side `session` tool call
	// (set_title, notify) queues a directive, and this drains it — the UI sees
	// a rename or a toast within one inbox interval, no matter how deep inside
	// a task run the tool was called.
	g.applySessionDirectives(r)
	writeJSON(w, http.StatusOK, map[string]any{
		"approvals": approvals,
		"questions": questions,
	})
}

// applySessionDirectives drains each agent's queued session directives and
// applies them: a title renames the session, a toast is recorded as a task
// event so the UI's task stream carries it to whichever page is open. Calls
// the agent's RunDirect RPC directly — CoreServiceServer.RunDirect would
// journal every poll as a tool event, and the inbox fires every 1.5 seconds.
// Best-effort end to end: a rename that cannot apply (unknown session) is
// acked and dropped rather than retried forever.
func (g *Gateway) applySessionDirectives(r *http.Request) {
	for _, agent := range g.registry.GetAgents(true) {
		conn, err := g.dial(agent.Address)
		if err != nil {
			continue
		}
		ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
		raw, _ := json.Marshal(map[string]any{})
		result, err := agentv1.NewAgentServiceClient(conn).RunDirect(
			pairing.CallbackContext(ctx, agent.Address),
			&agentv1.RunDirectRequest{Tool: "session_directives", Args: string(raw)},
		)
		cancel()
		if err != nil || !result.Success || result.Result == "" {
			continue
		}
		var directives []struct {
			ID        string `json:"id"`
			SessionID string `json:"session_id"`
			Kind      string `json:"kind"`
			Title     string `json:"title"`
			Text      string `json:"text"`
			Level     string `json:"level"`
		}
		if err := json.Unmarshal([]byte(result.Result), &directives); err != nil || len(directives) == 0 {
			continue
		}
		applied := []string{}
		for _, directive := range directives {
			switch directive.Kind {
			case "title":
				if directive.Title != "" {
					_ = g.localCore.RenameAgentSession(directive.SessionID, directive.Title)
				}
				applied = append(applied, directive.ID)
			case "toast":
				if directive.Text == "" {
					continue
				}
				payload, _ := json.Marshal(map[string]any{"text": directive.Text, "level": directive.Level})
				_ = g.localCore.RecordTask(server.TaskEvent{
					TaskID: fmt.Sprintf("notify:%s", directive.ID),
					Kind:   "notification",
					Prompt: directive.Text,
					State:  "done",
					Result: string(payload),
				})
				applied = append(applied, directive.ID)
			}
		}
		if len(applied) == 0 {
			continue
		}
		ackCtx, ackCancel := context.WithTimeout(r.Context(), 3*time.Second)
		ackRaw, _ := json.Marshal(map[string]any{"ids": applied})
		_, _ = agentv1.NewAgentServiceClient(conn).RunDirect(
			pairing.CallbackContext(ackCtx, agent.Address),
			&agentv1.RunDirectRequest{Tool: "session_directives_ack", Args: string(ackRaw)},
		)
		ackCancel()
	}
}

type agentError struct {
	status int
	code   string
	err    error
}

func (e *agentError) Error() string { return e.err.Error() }
func (e *agentError) Unwrap() error { return e.err }

var errNoExecutor = errors.New("executor unavailable")

func writeAgentErr(w http.ResponseWriter, err error) {
	var agentErr *agentError
	if errors.As(err, &agentErr) {
		writeErr(w, agentErr.status, agentErr.code, agentErr.Error())
		return
	}
	upstreamError(w, err.Error())
}

func (g *Gateway) collectAgentItems(
	r *http.Request,
	executorID string,
	readTool string,
	decide func() (string, map[string]any, bool),
) ([]map[string]any, error) {
	items := []map[string]any{}
	sessionID := r.URL.Query().Get("session_id")
	for _, agent := range g.registry.GetAgents(true) {
		if executorID != "" && agent.PluginID != executorID {
			continue
		}
		tool, args, proceed := readTool, map[string]any{"session_id": sessionID}, false
		if decide != nil {
			tool, args, proceed = decide()
			if !proceed {
				continue
			}
		}
		conn, err := g.dial(agent.Address)
		if err != nil {
			continue
		}
		ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
		raw, _ := json.Marshal(args)
		result, err := agentv1.NewAgentServiceClient(conn).RunDirect(
			pairing.CallbackContext(ctx, agent.Address),
			&agentv1.RunDirectRequest{Tool: tool, Args: string(raw)},
		)
		cancel()
		if err != nil {
			return nil, &agentError{status: http.StatusBadGateway, code: "upstream_error", err: err}
		}
		if decide != nil {
			if !result.Success {
				return nil, &agentError{
					status: http.StatusConflict,
					code:   "conflict",
					err:    errors.New(result.Error),
				}
			}
			return items, nil
		}
		if result.Success {
			var rows []map[string]any
			if json.Unmarshal([]byte(result.Result), &rows) == nil {
				for _, row := range rows {
					row["executor_id"] = agent.PluginID
					row["executor_name"] = agent.Info.GetName()
					items = append(items, row)
				}
			}
		}
	}
	if decide != nil {
		return nil, &agentError{
			status: http.StatusServiceUnavailable,
			code:   "unavailable",
			err:    errNoExecutor,
		}
	}
	return items, nil
}
