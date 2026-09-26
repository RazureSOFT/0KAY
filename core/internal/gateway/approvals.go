package gateway

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"0kay/core/internal/pairing"
	agentv1 "0kay/gen/agent/v1"
)

// handleAgentApprovals backs both
//
//	GET|POST /api/agent/approvals  (decide via {"allow":bool})
//	GET|POST /api/agent/questions  (answer via {"answer":string})
//
// GET /api/agent/inbox is served by handleAgentInbox, which merges the two.
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
	items, failed := g.collectAgentItems(r, body.ExecutorID, tool, func() (string, map[string]any, bool) {
		if r.Method != http.MethodPost {
			return "", nil, false
		}
		if questions {
			return "question_answer", map[string]any{"id": body.ID, "answer": *body.Answer}, true
		}
		return "approval_decide", map[string]any{"id": body.ID, "allow": *body.Allow}, true
	})
	if failed != nil {
		writeErr(w, http.StatusBadGateway, "upstream_error", failed.Error())
		return
	}
	if r.Method == http.MethodPost {
		writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"approvals": items})
}

// handleAgentInbox GET /api/agent/inbox — one round trip for everything the
// global inbox renders, so the UI no longer fans out into N requests.
//
//	{ "approvals": [...], "questions": [...] }
func (g *Gateway) handleAgentInbox(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	approvals, err := g.collectAgentItems(r, "", "approval_list", nil)
	if err != nil {
		writeErr(w, http.StatusBadGateway, "upstream_error", err.Error())
		return
	}
	questions, err := g.collectAgentItems(r, "", "question_list", nil)
	if err != nil {
		writeErr(w, http.StatusBadGateway, "upstream_error", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"approvals": approvals,
		"questions": questions,
	})
}

// collectAgentItems fans a RunDirect tool call out to every reachable agent.
// decide is nil for reads; when set it returns the (tool, args, proceed) to use
// instead of the read tool. A non-nil error means at least one executor failed
// and the HTTP status must reflect it.
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
			return nil, err
		}
		if decide != nil {
			if !result.Success {
				return nil, errors.New(result.Error)
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
		return nil, errors.New("executor unavailable")
	}
	return items, nil
}
