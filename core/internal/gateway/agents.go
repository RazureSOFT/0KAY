package gateway

import (
	"net/http"
	"time"

	corev1 "0kay/gen/core/v1"
)

// AgentInfo is the JSON shape for an agent in API responses.
type AgentInfo struct {
	PluginID            string         `json:"plugin_id"`
	Name                string         `json:"name"`
	Version             string         `json:"version"`
	Address             string         `json:"address"`
	Status              string         `json:"status"`
	ActiveTasks         int32          `json:"active_tasks"`
	LastHeartbeatAgeSec int64          `json:"last_heartbeat_age_seconds"`
	Host                map[string]any `json:"host,omitempty"`
	MissingDependencies []string       `json:"missing_dependencies"`
}

// AgentsResponse is the response for /api/agents.
type AgentsResponse struct {
	Agents      []AgentInfo `json:"agents"`
	OnlineCount int         `json:"online_count"`
}

// handleAgents returns the list of registered Agent plugins.
func (g *Gateway) handleAgents(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	agents := g.registry.GetAgents(false)
	onlineCount := g.registry.CountOnlineAgents()

	result := make([]AgentInfo, 0, len(agents))
	for _, a := range agents {
		age := time.Since(a.LastHeartbeat).Seconds()
		var host map[string]any
		if a.Host != nil {
			host = map[string]any{
				"hostname":               a.Host.Hostname,
				"os":                     a.Host.Os,
				"arch":                   a.Host.Arch,
				"cpu_model":              a.Host.CpuModel,
				"cpu_cores":              a.Host.CpuCores,
				"memory_total_bytes":     a.Host.MemoryTotalBytes,
				"memory_available_bytes": a.Host.MemoryAvailableBytes,
				"workdir":                a.Host.Workdir,
			}
		}
		result = append(result, AgentInfo{
			PluginID:            a.PluginID,
			Name:                a.Info.GetName(),
			Version:             a.Info.GetVersion(),
			Address:             a.Address,
			Status:              a.Status.String(),
			ActiveTasks:         a.ActiveTasks,
			LastHeartbeatAgeSec: int64(age),
			Host:                host,
			MissingDependencies: g.registry.MissingDependencies(a.PluginID),
		})
	}

	writeJSON(w, http.StatusOK, AgentsResponse{
		Agents:      result,
		OnlineCount: onlineCount,
	})
}

// ensure registry import is used
var _ = corev1.PluginStatus_PLUGIN_STATUS_HEALTHY
