package gateway

import (
	"encoding/json"
	"net/http"
	"strings"

	corev1 "0kay/gen/core/v1"
)

// handleTools exposes the plugin tool catalog and a call endpoint so Agent and
// L.I.F.E. can discover and invoke tools contributed by plugins.
//
//	GET  /api/tools?scope=agent|life
//	POST /api/tools/call  {"tool":"...","args":{...},"args_json":"...","session_id":"...","caller":"..."}
func (g *Gateway) handleTools(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		g.handleToolsList(w, r)
	case http.MethodPost:
		g.handleToolsCall(w, r)
	default:
		allowMethod(w, r, http.MethodGet, http.MethodPost)
	}
}

func (g *Gateway) handleToolsList(w http.ResponseWriter, r *http.Request) {
	scope := strings.TrimSpace(r.URL.Query().Get("scope"))
	resp, err := g.coreSvc.ListPluginTools(r.Context(), &corev1.ListPluginToolsRequest{Scope: scope})
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	type toolJSON struct {
		Plugin      string   `json:"plugin"`
		Name        string   `json:"name"`
		Description string   `json:"description"`
		Parameters  any      `json:"parameters"`
		Dangerous   bool     `json:"dangerous"`
		Scopes      []string `json:"scopes"`
	}
	tools := make([]toolJSON, 0, len(resp.Tools))
	for _, entry := range resp.Tools {
		if entry.Tool == nil {
			continue
		}
		var params any
		if entry.Tool.ParametersJson != "" {
			_ = json.Unmarshal([]byte(entry.Tool.ParametersJson), &params)
		}
		tools = append(tools, toolJSON{
			Plugin:      entry.Plugin,
			Name:        entry.Tool.Name,
			Description: entry.Tool.Description,
			Parameters:  params,
			Dangerous:   entry.Tool.Dangerous,
			Scopes:      entry.Tool.Scopes,
		})
	}
	writeJSON(w, http.StatusOK, map[string]any{"tools": tools})
}

func (g *Gateway) handleToolsCall(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Tool      string          `json:"tool"`
		Args      json.RawMessage `json:"args"`
		ArgsJSON  string          `json:"args_json"`
		SessionID string          `json:"session_id"`
		Caller    string          `json:"caller"`
	}
	if !decodeBody(w, r, &req, maxSmallBody) {
		return
	}
	if strings.TrimSpace(req.Tool) == "" {
		badRequest(w, "tool is required")
		return
	}
	argsJSON := req.ArgsJSON
	if argsJSON == "" && len(req.Args) > 0 {
		argsJSON = string(req.Args)
	}
	if argsJSON == "" {
		argsJSON = "{}"
	}
	resp, err := g.coreSvc.CallPluginTool(r.Context(), &corev1.CallPluginToolRequest{
		Tool:      req.Tool,
		ArgsJson:  argsJSON,
		SessionId: req.SessionID,
		CallerId:  req.Caller,
	})
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	var result any
	if resp.Result != "" {
		if err := json.Unmarshal([]byte(resp.Result), &result); err != nil {
			result = resp.Result
		}
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"success": resp.Success,
		"result":  result,
		"error":   resp.Error,
	})
}
