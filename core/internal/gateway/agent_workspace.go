package gateway

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"0kay/core/internal/pairing"
	"0kay/core/internal/server"
	agentv1 "0kay/gen/agent/v1"
	lifev1 "0kay/gen/life/v1"
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

func (g *Gateway) handleAgentCompact(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var body struct {
		SessionID string `json:"session_id"`
	}
	if !decodeBody(w, r, &body, maxSmallBody) {
		return
	}
	if g.localCore == nil || !g.localCore.HasAgentSession(body.SessionID) {
		badRequest(w, "invalid session")
		return
	}
	tasks := g.localCore.ListTasks()
	history := []map[string]string{}
	for i := len(tasks) - 1; i >= 0; i-- {
		task := tasks[i]
		if task["session_id"] != body.SessionID {
			continue
		}
		if task["state"] == "running" || task["state"] == "pending" {
			writeErr(w, http.StatusConflict, "conflict", "wait for active work to finish")
			return
		}
		if task["kind"] == "compact" && task["state"] == "done" {
			history = []map[string]string{{"role": "system", "content": fmt.Sprint(task["result"])}}
		}
		if task["kind"] == "agent" {
			prompt, _ := task["prompt"].(string)
			result, _ := task["result"].(string)
			failure, _ := task["error"].(string)
			history = append(history, map[string]string{"role": "user", "content": prompt}, map[string]string{"role": "assistant", "content": result + "\n" + failure})
		}
	}
	if len(history) == 0 {
		badRequest(w, "no conversation to compact")
		return
	}
	lifes := g.registry.GetPluginsByCapability("life")
	if len(lifes) == 0 {
		unavailable(w, "LIFE unavailable")
		return
	}
	id := fmt.Sprintf("compact:%d", time.Now().UnixNano())
	event := server.TaskEvent{TaskID: id, SessionID: body.SessionID, CallerID: "webui", Kind: "compact", Prompt: "/compact", State: "running"}
	if err := g.localCore.RecordTask(event); err != nil {
		writeErr(w, http.StatusConflict, "conflict", err.Error())
		return
	}
	conn, err := g.dial(lifes[0].Address)
	if err != nil {
		event.State = "failed"
		event.Error = err.Error()
		g.localCore.RecordTask(event)
		upstreamError(w, err.Error())
		return
	}
	data, _ := json.Marshal(history)
	ctx, cancel := context.WithTimeout(r.Context(), 120*time.Second)
	defer cancel()
	response, err := lifev1.NewLifeServiceClient(conn).CompactConversation(ctx, &lifev1.CompactConversationRequest{SessionId: body.SessionID, HistoryJson: string(data)})
	if err != nil || !response.GetOk() {
		event.State = "failed"
		event.Error = fmt.Sprint(err)
		if err == nil {
			event.Error = response.GetError()
		}
		g.localCore.RecordTask(event)
		upstreamError(w, event.Error)
		return
	}
	if response.Summary == "" {
		event.State = "failed"
		event.Error = "empty compaction summary"
		g.localCore.RecordTask(event)
		upstreamError(w, event.Error)
		return
	}
	event.State = "done"
	event.Result = response.Summary
	if err := g.localCore.RecordTask(event); err != nil {
		writeErr(w, http.StatusConflict, "conflict", err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"summary": response.Summary})
}
