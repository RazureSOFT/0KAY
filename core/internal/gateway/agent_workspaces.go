package gateway

import (
	"net/http"
	"time"
)

// handleAgentWorkspaces proxies the agent's dsh-style workspace registry.
//
//	GET  /api/agent/workspaces[?executor_id=]             → { workspaces: [...] }
//	POST /api/agent/workspaces {executor_id?, action, …}  → one mutation/read
//
// The agent owns the durable registry (workspaces, order, archive set and
// session accounting); this route only forwards to its `workspace_admin` tool.
func (g *Gateway) handleAgentWorkspaces(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		g.agentRunDirect(w, r, "workspace_admin", map[string]string{"action": "list"})
		return
	}
	g.runDirectPost(w, r, "workspace_admin", 30*time.Second)
}
