package registry

import (
	"testing"

	corev1 "0kay/gen/core/v1"
	pluginv1 "0kay/gen/plugin/v1"
)

// Reconnect has to be able to clear a stale UNHEALTHY mark without pretending a
// heartbeat arrived. If it faked one, a plugin that is still dead would look
// alive for another timeout window.

func TestResetHealthClearsUnhealthyButKeepsTheClock(t *testing.T) {
	r := NewRegistry()
	inst := &PluginInstance{
		Info:     &pluginv1.PluginInfo{Name: "messaging"},
		PluginID: "messaging",
		Status:   corev1.PluginStatus_PLUGIN_STATUS_UNHEALTHY,
	}
	r.plugins["messaging"] = inst
	before := inst.LastHeartbeat

	if !r.ResetHealth("messaging") {
		t.Fatal("ResetHealth should find the plugin by name")
	}
	if inst.Status != corev1.PluginStatus_PLUGIN_STATUS_UNSPECIFIED {
		t.Fatalf("status = %v, want unspecified", inst.Status)
	}
	if !inst.LastHeartbeat.Equal(before) {
		t.Fatal("ResetHealth must not move the heartbeat clock")
	}
}

func TestResetHealthLeavesHealthyAloneAndReportsUnknownNames(t *testing.T) {
	r := NewRegistry()
	inst := &PluginInstance{
		Info:     &pluginv1.PluginInfo{Name: "life"},
		PluginID: "life",
		Status:   corev1.PluginStatus_PLUGIN_STATUS_HEALTHY,
	}
	r.plugins["life"] = inst
	if !r.ResetHealth("life") {
		t.Fatal("known plugin should report true")
	}
	if inst.Status != corev1.PluginStatus_PLUGIN_STATUS_HEALTHY {
		t.Fatal("a healthy plugin must keep its status")
	}
	if r.ResetHealth("nope") {
		t.Fatal("unknown plugin should report false")
	}
	if r.ResetHealth("") {
		t.Fatal("empty name should report false")
	}
}
