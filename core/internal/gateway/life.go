package gateway

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"0kay/core/internal/server"
	lifev1 "0kay/gen/life/v1"
)

// overlayLifeState fills emotion/energy/permissions from Life when available.
// Agent/plugin/task fields must already be set by the caller (Core registry).
func (g *Gateway) overlayLifeState(r *http.Request, state map[string]interface{}) {
	lifes := g.registry.GetPluginsByCapability("life")
	if len(lifes) == 0 || lifes[0].Address == "" {
		return
	}
	conn, err := g.dial(lifes[0].Address)
	if err != nil {
		return
	}
	client := lifev1.NewLifeServiceClient(conn)
	ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
	defer cancel()
	resp, err := client.GetState(ctx, &lifev1.GetStateRequest{})
	if err != nil || resp == nil {
		return
	}

	tasks := make([]string, 0, len(resp.ActiveTasks))
	tasks = append(tasks, resp.ActiveTasks...)
	// Prefer Core task list if non-empty; else Life's view.
	if existing, ok := state["activeTasks"].([]string); !ok || len(existing) == 0 {
		state["activeTasks"] = tasks
	}

	state["emotion"] = map[string]float64{
		"valence":    resp.GetEmotion().GetValence(),
		"arousal":    resp.GetEmotion().GetArousal(),
		"connection": resp.GetEmotion().GetConnection(),
		"irritation": resp.GetEmotion().GetIrritation(),
	}
	state["mentalEnergy"] = resp.MentalEnergy
	state["isSleeping"] = resp.IsSleeping
	state["lifeSource"] = "life"

	if g.localCore != nil {
		p := g.localCore.GetPermissions()
		state["screenWatch"] = p.ScreenWatch
		state["computerUse"] = p.ComputerUse
		state["reportAgentHost"] = p.ReportAgentHost
	} else {
		state["screenWatch"] = resp.ScreenWatch
		state["computerUse"] = resp.ComputerUse
		state["reportAgentHost"] = resp.ReportAgentHost
	}
}

// handleLifeState is the legacy path; now delegates to platform state.
func (g *Gateway) handleLifeState(w http.ResponseWriter, r *http.Request) {
	g.handleState(w, r)
}

// forwardLifePermissions pushes Core permission changes to the Life plugin.
func (g *Gateway) forwardLifePermissions(p server.Permissions) {
	lifes := g.registry.GetPluginsByCapability("life")
	if len(lifes) == 0 || lifes[0].Address == "" {
		return
	}
	conn, err := g.dial(lifes[0].Address)
	if err != nil {
		return
	}
	client := lifev1.NewLifeServiceClient(conn)
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	_, _ = client.SetPermissions(ctx, &lifev1.SetPermissionsRequest{
		ScreenWatch:     p.ScreenWatch,
		ComputerUse:     p.ComputerUse,
		ReportAgentHost: p.ReportAgentHost,
	})
}

// jsonOK writes a JSON body with 200.
func jsonOK(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(v)
}
