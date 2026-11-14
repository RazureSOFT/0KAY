package gateway

import (
	"context"
	"net/http"
	"time"

	corev1 "0kay/gen/core/v1"
)

// A plugin's phase, derived from what the gateway already knows.
//
// The list endpoint used to expose four fields that each answered a different
// question — status enum, heartbeat age, disabled flag, registration time — and
// left the reader to combine them. `lifecycle` is that combination, so the UI
// and a person reading JSON both get one word.
//
// This is a state machine over observable facts, not over processes: Core does
// not spawn plugin processes, so it cannot know "installing" or "crashed". What
// it can know, it reports exactly.
const (
	// PhaseInstalled: known to the install (manifest or the disabled list) but
	// has not registered in this run.
	PhaseInstalled = "installed"
	// PhaseStarting: registered, no heartbeat yet. This is a real state — a
	// plugin registers and then needs a moment before its first tick.
	PhaseStarting = "starting"
	// PhaseHealthy: registered and beating inside the degraded threshold.
	PhaseHealthy = "healthy"
	// PhaseDegraded: still beating, but late. Alive and possibly overloaded.
	PhaseDegraded = "degraded"
	// PhaseStopped: switched off on purpose. Not an error.
	PhaseStopped = "stopped"
	// PhaseFailed: was registered, and is now either marked unhealthy or has
	// gone past the stale threshold.
	PhaseFailed = "failed"
)

type pluginPhaseInputs struct {
	Disabled   bool
	Registered bool
	Status     string
	Health     string
}

// pluginPhase maps the observable facts onto one phase. Order matters: being
// switched off outranks everything, and an unhealthy status outranks a
// heartbeat that happens to still be recent.
func pluginPhase(in pluginPhaseInputs) string {
	if in.Disabled {
		return PhaseStopped
	}
	if !in.Registered {
		return PhaseInstalled
	}
	if in.Status == "PLUGIN_STATUS_UNHEALTHY" {
		return PhaseFailed
	}
	switch in.Health {
	case "healthy":
		return PhaseHealthy
	case "degraded":
		return PhaseDegraded
	case "stale", "unhealthy":
		return PhaseFailed
	case "disabled":
		return PhaseStopped
	}
	// Registered with no heartbeat yet, or a health the caller could not
	// compute: both mean "not yet proven alive".
	return PhaseStarting
}

// phaseNeedsAttention is true for the phases a person should be told about.
func phaseNeedsAttention(phase string) bool {
	return phase == PhaseDegraded || phase == PhaseFailed
}

// handlePluginReload asks a running plugin to re-read what it can without
// restarting. Only the agent exposes such a hook today; anything else says so
// instead of pretending the change took effect.
func (g *Gateway) handlePluginReload(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	name := r.PathValue("name")
	if name == "" {
		badRequest(w, "plugin name is required")
		return
	}
	if name != "agent" {
		writeErr(w, http.StatusNotImplemented, "reload_unsupported",
			"plugin "+name+" has no reload hook; restart it to pick up changes")
		return
	}
	if g.coreSvc == nil {
		writeErr(w, http.StatusServiceUnavailable, "agent_unavailable", "no agent connection")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
	defer cancel()
	resp, err := g.coreSvc.RunDirect(ctx, &corev1.RunDirectRequest{
		Tool: "extensions_reload",
		Args: "{\"enabled\":true}",
	})
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	if !resp.Success {
		writeErr(w, http.StatusBadGateway, "reload_failed", resp.Error)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{"ok": true, "plugin": name, "report": resp.Result})
}
