package gateway

import "testing"

func TestPluginPhase(t *testing.T) {
	cases := []struct {
		name string
		in   pluginPhaseInputs
		want string
	}{
		{"not registered yet", pluginPhaseInputs{Health: "unknown"}, PhaseInstalled},
		{"registered, no beat", pluginPhaseInputs{Registered: true, Health: "unknown"}, PhaseStarting},
		{"registered, blank health", pluginPhaseInputs{Registered: true}, PhaseStarting},
		{"beating on time", pluginPhaseInputs{Registered: true, Health: "healthy", Status: "PLUGIN_STATUS_HEALTHY"}, PhaseHealthy},
		{"beating late", pluginPhaseInputs{Registered: true, Health: "degraded"}, PhaseDegraded},
		{"past the stale threshold", pluginPhaseInputs{Registered: true, Health: "stale"}, PhaseFailed},
		{"reaped by the registry", pluginPhaseInputs{Registered: true, Health: "unhealthy", Status: "PLUGIN_STATUS_UNHEALTHY"}, PhaseFailed},
		{"unhealthy even with a recent beat", pluginPhaseInputs{Registered: true, Health: "healthy", Status: "PLUGIN_STATUS_UNHEALTHY"}, PhaseFailed},
		{"switched off", pluginPhaseInputs{Disabled: true, Health: "disabled"}, PhaseStopped},
		{"switched off wins over everything", pluginPhaseInputs{Disabled: true, Registered: true, Health: "healthy", Status: "PLUGIN_STATUS_UNHEALTHY"}, PhaseStopped},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := pluginPhase(tc.in); got != tc.want {
				t.Fatalf("pluginPhase(%+v) = %q, want %q", tc.in, got, tc.want)
			}
		})
	}
}

func TestOnlyRealTroubleNeedsAttention(t *testing.T) {
	for _, phase := range []string{PhaseHealthy, PhaseStopped, PhaseInstalled, PhaseStarting} {
		if phaseNeedsAttention(phase) {
			t.Fatalf("%q should not be flagged as needing attention", phase)
		}
	}
	for _, phase := range []string{PhaseDegraded, PhaseFailed} {
		if !phaseNeedsAttention(phase) {
			t.Fatalf("%q should be flagged as needing attention", phase)
		}
	}
}
