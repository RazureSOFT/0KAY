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

func TestSensitivePluginProxy(t *testing.T) {
	for _, path := range []string{"/api/plugins/tool/proxy", "/api/plugins/tool/proxy/v1/data", "/api/plugins/tool/proxy/"} {
		if !sensitiveRequest(httptest.NewRequest("GET", path, nil)) {
			t.Errorf("PIN gate misses plugin proxy %s", path)
		}
		if !sensitiveRequest(httptest.NewRequest("POST", path, nil)) {
			t.Errorf("PIN gate misses plugin proxy POST %s", path)
		}
	}
	for _, path := range []string{"/api/plugins/tool", "/api/plugins/tool/ui/index.html", "/api/plugins/strings", "/api/plugins/tool/strings"} {
		if sensitiveRequest(httptest.NewRequest("GET", path, nil)) {
			t.Errorf("PIN gate should not cover %s", path)
		}
	}
}

func TestSensitiveAgentWritePaths(t *testing.T) {
	for _, path := range []string{"/api/agent/file", "/api/agent/exec", "/api/run", "/api/tools", "/api/tools/", "/api/tools/call", "/api/agent/browser/action", "/api/agent/compact", "/api/agent/messages", "/api/agent/workspace", "/api/agent/workspaces", "/api/agent/sessions", "/api/tasks", "/api/agent/git"} {
		if !sensitiveRequest(httptest.NewRequest("POST", path, nil)) {
			t.Errorf("PIN gate misses POST %s", path)
		}
		if sensitiveRequest(httptest.NewRequest("GET", path, nil)) {
			t.Errorf("PIN gate should not cover GET %s", path)
		}
	}
}
