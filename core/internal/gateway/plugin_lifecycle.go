package gateway

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
