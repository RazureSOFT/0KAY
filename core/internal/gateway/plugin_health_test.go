package gateway

import (
	"testing"
	"time"
)

// The plugins page used to show "healthy" for a plugin that had stopped
// heartbeating ten minutes ago, because nothing ever flipped the enum. Health is
// the derived view: status plus how long ago we last heard from it.

func TestPluginHealthSeparatesSlowFromDead(t *testing.T) {
	cases := []struct {
		name   string
		status string
		age    time.Duration
		want   string
	}{
		{"fresh heartbeat", "PLUGIN_STATUS_HEALTHY", 2 * time.Second, "healthy"},
		{"a little late", "PLUGIN_STATUS_HEALTHY", pluginDegradedAfter + time.Second, "degraded"},
		{"long gone", "PLUGIN_STATUS_HEALTHY", pluginStaleAfter + time.Second, "stale"},
		{"already reaped", "PLUGIN_STATUS_UNHEALTHY", time.Second, "unhealthy"},
		{"switched off", "PLUGIN_STATUS_DISABLED", time.Second, "disabled"},
		{"never heard from", "PLUGIN_STATUS_HEALTHY", 0, "unknown"},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := pluginHealth(tc.status, tc.age); got != tc.want {
				t.Fatalf("pluginHealth(%s, %s) = %q, want %q", tc.status, tc.age, got, tc.want)
			}
		})
	}
}

func TestPluginHealthThresholdsAreOrdered(t *testing.T) {
	if !(pluginDegradedAfter < pluginStaleAfter) {
		t.Fatalf("degraded threshold must be reached before the stale one")
	}
}
