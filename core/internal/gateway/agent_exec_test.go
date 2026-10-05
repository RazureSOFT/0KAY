package gateway

import (
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strings"
	"testing"

	"0kay/core/internal/server"
)

// /api/agent/exec proxies straight to the agent, so it must enforce the
// ComputerUse permission itself rather than rely on RunDirect's gate.
func TestAgentExecRequiresComputerUse(t *testing.T) {
	t.Setenv("TASKS_PATH", filepath.Join(t.TempDir(), "tasks.json"))
	t.Setenv("USAGE_PATH", filepath.Join(t.TempDir(), "usage.json"))
	core := server.NewCoreServiceServer(nil)
	core.SetPermissions(server.Permissions{ComputerUse: false})
	g := &Gateway{localCore: core}
	rec := httptest.NewRecorder()
	g.handleAgentExec(rec, httptest.NewRequest(http.MethodPost, "/api/agent/exec", strings.NewReader(`{"command":"ls"}`)))
	if rec.Code != http.StatusForbidden {
		t.Fatalf("exec with computer_use off = %d, want 403", rec.Code)
	}
}
