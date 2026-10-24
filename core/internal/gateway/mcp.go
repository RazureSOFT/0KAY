package gateway

import (
	"context"
	"net/http"
	"strings"
	"time"

	"0kay/core/internal/mcp"
)

// MCP lives in Core now.
//
// Before, every consumer brought its own client: the agent spawned servers, the
// mail server shipped as a plugin, and nothing agreed on which servers existed.
// These three endpoints are the single surface — the agent, L.I.F.E and any
// WebUI page read the same registry and talk to the same live connections.
//
//	GET  /api/mcp/servers -> [{id, transport, tools?}]
//	GET  /api/mcp/tools?server=<id> -> [{server, name, description, inputSchema}]
//	POST /api/mcp/call {"server":"mail","tool":"send","args":{...}} -> raw MCP result

// mcpServers reads the shared settings list. Read on every request on purpose:
// adding a server in the settings pane takes effect immediately.
func (g *Gateway) mcpServers() []mcp.Server {
	if g.settingsStore == nil {
		return nil
	}
	raw, _ := g.settingsStore.GetValues("mcp")["servers"].(string)
	return mcp.ParseServers(raw)
}

func (g *Gateway) mcpServer(id string) (mcp.Server, bool) {
	for _, server := range g.mcpServers() {
		if server.ID == id {
			return server, true
		}
	}
	return mcp.Server{}, false
}

func (g *Gateway) handleMCPServers(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	servers := g.mcpServers()
	out := make([]map[string]any, 0, len(servers))
	for _, server := range servers {
		out = append(out, map[string]any{
			"id":        server.ID,
			"transport": mcp.TransportName(server),
		})
	}
	writeJSON(w, http.StatusOK, map[string]any{"servers": out})
}

// handleMCPTools lists tools. Starting a server is the expensive part, so an
// unreachable one is reported per-server instead of failing the whole call.
func (g *Gateway) handleMCPTools(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 45*time.Second)
	defer cancel()

	only := strings.TrimSpace(r.URL.Query().Get("server"))
	servers := g.mcpServers()
	if only != "" {
		server, ok := g.mcpServer(only)
		if !ok {
			writeErr(w, http.StatusNotFound, "not_found", "unknown mcp server: "+only)
			return
		}
		servers = []mcp.Server{server}
	}

	tools := make([]map[string]any, 0, 16)
	errors := map[string]string{}
	for _, server := range servers {
		list, err := g.mcp.Tools(ctx, server)
		if err != nil {
			errors[server.ID] = err.Error()
			continue
		}
		for _, tool := range list {
			tools = append(tools, map[string]any{
				"server":      server.ID,
				"name":        tool.Name,
				"description": tool.Description,
				"inputSchema": tool.InputSchema,
			})
		}
	}
	writeJSON(w, http.StatusOK, map[string]any{"tools": tools, "errors": errors})
}

func (g *Gateway) handleMCPCall(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var body struct {
		Server string         `json:"server"`
		Tool   string         `json:"tool"`
		Args   map[string]any `json:"args"`
	}
	if !decodeBody(w, r, &body, 1<<20) {
		return
	}
	server, ok := g.mcpServer(strings.TrimSpace(body.Server))
	if !ok {
		writeErr(w, http.StatusNotFound, "not_found", "unknown mcp server: "+body.Server)
		return
	}
	if strings.TrimSpace(body.Tool) == "" {
		badRequest(w, "tool required")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 120*time.Second)
	defer cancel()
	result, err := g.mcp.Call(ctx, server, body.Tool, body.Args)
	if err != nil {
		writeErr(w, http.StatusBadGateway, "mcp_failed", err.Error())
		return
	}
	// The MCP result is opaque to Core (it may be content blocks or a plain
	// object); pass it through untouched rather than inventing a shape.
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(result)
}
