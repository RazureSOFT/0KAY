package gateway

import (
	"0kay/core/internal/pairing"
	agentv1 "0kay/gen/agent/v1"
	"context"
	"encoding/json"
	"net/http"
	"time"
)

func (g *Gateway) handleAgentApprovals(w http.ResponseWriter, r *http.Request) {
	if r.Method != "GET" && r.Method != "POST" {
		http.Error(w, "method not allowed", 405)
		return
	}
	questions := r.URL.Path == "/api/agent/questions"
	var body struct {
		ExecutorID string  `json:"executor_id"`
		ID         string  `json:"id"`
		Allow      *bool   `json:"allow"`
		Answer     *string `json:"answer"`
	}
	if r.Method == "POST" && (json.NewDecoder(http.MaxBytesReader(w, r.Body, 65536)).Decode(&body) != nil || (!questions && body.Allow == nil) || (questions && body.Answer == nil)) {
		http.Error(w, "invalid decision", 400)
		return
	}
	items := []map[string]interface{}{}
	for _, agent := range g.registry.GetAgents(true) {
		if r.Method == "POST" && agent.PluginID != body.ExecutorID {
			continue
		}
		conn, err := g.dial(agent.Address)
		if err != nil {
			continue
		}
		ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
		tool := "approval_list"
		args := map[string]interface{}{"session_id": r.URL.Query().Get("session_id")}
		if questions {
			tool = "question_list"
		}
		if r.Method == "POST" {
			if questions {
				tool = "question_answer"
				args = map[string]interface{}{"id": body.ID, "answer": *body.Answer}
			} else {
				tool = "approval_decide"
				args = map[string]interface{}{"id": body.ID, "allow": *body.Allow}
			}
		}
		raw, _ := json.Marshal(args)
		result, err := agentv1.NewAgentServiceClient(conn).RunDirect(pairing.CallbackContext(ctx, agent.Address), &agentv1.RunDirectRequest{Tool: tool, Args: string(raw)})
		cancel()
		conn.Close()
		if r.Method == "POST" {
			if err != nil {
				http.Error(w, err.Error(), 502)
				return
			}
			if !result.Success {
				http.Error(w, result.Error, 409)
				return
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]bool{"ok": true})
			return
		}
		if err == nil && result.Success {
			var rows []map[string]interface{}
			if json.Unmarshal([]byte(result.Result), &rows) == nil {
				for _, row := range rows {
					row["executor_id"] = agent.PluginID
					row["executor_name"] = agent.Info.GetName()
					items = append(items, row)
				}
			}
		}
	}
	if r.Method == "POST" {
		http.Error(w, "executor unavailable", 503)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{"approvals": items})
}
