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

// The architecture map, as the web UI needs it.
//
// The extraction lives in the agent — it is the component that knows how to read
// a codebase — so this is a thin forward, the same shape as the browser panel's:
// find an agent executor, ask it to run the tool, hand the answer back.
//
// It does not go through the model. `/api/agent/messages` would have worked and
// would have been wrong: a compute job dressed as a conversation costs a turn,
// can be reworded by the model, and needs a session to exist before anyone can
// look at their own code's structure.
func (g *Gateway) handleAgentArchitecture(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	query := r.URL.Query()
	args := map[string]interface{}{
		"action":     orDefault(query.Get("action"), "scan"),
		"path":       query.Get("path"),
		"maxModules": numberOr(query.Get("max_modules"), 24),
	}
	if format := query.Get("format"); format != "" {
		args["format"] = format
	}
	if theme := query.Get("theme"); theme != "" {
		args["theme"] = theme
	}
	encoded, err := json.Marshal(args)
	if err != nil {
		badRequest(w, err.Error())
		return
	}
	g.forwardToAgent(w, r, "architecture", string(encoded), 120*time.Second)
}

// gitStatusSummary is the shape the map panel shows beside the diagram: enough
// to say "this snapshot predates three uncommitted changes" without a second
// round trip.
func (g *Gateway) handleAgentArchitectureSaved(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	args, err := json.Marshal(map[string]interface{}{
		"action":     "diff",
		"path":       r.URL.Query().Get("path"),
		"maxModules": numberOr(r.URL.Query().Get("max_modules"), 24),
	})
	if err != nil {
		badRequest(w, err.Error())
		return
	}
	g.forwardToAgent(w, r, "architecture", string(args), 120*time.Second)
}

// forwardToAgent runs a tool on the first available agent executor.
//
// `executor_id` picks one explicitly; without it the first healthy executor
// answers, which is what a single-machine install has.
func (g *Gateway) forwardToAgent(w http.ResponseWriter, r *http.Request, tool, args string, timeout time.Duration) {
	wanted := r.URL.Query().Get("executor_id")
	for _, agent := range g.registry.GetAgents(true) {
		if wanted != "" && agent.PluginID != wanted {
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
			&agentv1.RunDirectRequest{Tool: tool, Args: args},
		)
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		if !result.Success {
			writeErr(w, http.StatusBadRequest, "tool_failed", result.Error)
			return
		}
		// The tool already returns JSON; pass it through rather than wrapping it
		// in a second envelope the caller would have to unwrap.
		body := strings.TrimSpace(result.Result)
		if !json.Valid([]byte(body)) {
			writeErr(w, http.StatusBadGateway, "bad_tool_output", "the tool did not return JSON")
			return
		}
		writeRawJSON(w, http.StatusOK, body)
		return
	}
	unavailable(w, "selected executor unavailable")
}

func orDefault(value, fallback string) string {
	if strings.TrimSpace(value) == "" {
		return fallback
	}
	return value
}

func numberOr(value string, fallback int) int {
	if strings.TrimSpace(value) == "" {
		return fallback
	}
	var parsed int
	if err := json.Unmarshal([]byte(value), &parsed); err != nil || parsed <= 0 {
		return fallback
	}
	return parsed
}
