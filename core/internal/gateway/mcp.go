package gateway

import (
	"context"
	"net/http"
	"strings"
	"time"

	"0kay/core/internal/mcp"
)

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
	w.Header().Set("Content-Type", "application/json")
	_, _ = w.Write(result)
}
