package pairing

import (
	"net/http/httptest"
	"testing"
)

func TestSensitiveOperationAliases(t *testing.T) {
	for _, path := range []string{"/api/plugins/install", "/api/plugins/pm/install", "/api/plugins/pm/uninstall", "/api/plugins/pm/update", "/api/life/permissions"} {
		if !sensitiveRequest(httptest.NewRequest("POST", path, nil)) {
			t.Errorf("PIN gate misses %s", path)
		}
	}
	if sensitiveRequest(httptest.NewRequest("GET", "/api/life/permissions", nil)) {
		t.Fatal("permission reads should not prompt")
	}
}

// The agent/tool write endpoints reach the same capabilities (chat turns with
// full_access, file writes, mkdir, shell, plugin tools, browser actions,
// compaction, session/task mutation) as the routes already gated, so a
// configured PIN must cover their writes but not the reads the WebUI polls.
func TestSensitiveAgentWritePaths(t *testing.T) {
	for _, path := range []string{"/api/agent/file", "/api/agent/exec", "/api/run", "/api/tools", "/api/tools/", "/api/tools/call", "/api/agent/browser/action", "/api/agent/compact", "/api/agent/messages", "/api/agent/workspace", "/api/agent/workspaces", "/api/agent/sessions", "/api/tasks"} {
		if !sensitiveRequest(httptest.NewRequest("POST", path, nil)) {
			t.Errorf("PIN gate misses POST %s", path)
		}
		if sensitiveRequest(httptest.NewRequest("GET", path, nil)) {
			t.Errorf("PIN gate should not cover GET %s", path)
		}
	}
}
