package gateway

import (
	"net/http"
	"time"
)

func (g *Gateway) handleAgentWorkspaces(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		g.agentRunDirect(w, r, "workspace_admin", map[string]string{"action": "list"})
		return
	}
	g.runDirectPost(w, r, "workspace_admin", 30*time.Second)
}
