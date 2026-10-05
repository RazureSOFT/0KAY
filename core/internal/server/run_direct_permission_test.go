package server

import (
	"context"
	"strings"
	"testing"

	corev1 "0kay/gen/core/v1"
)

// terminal_exec runs the same shell capability as shell/computeruse, so the
// ComputerUse switch must reject it too.
func TestRunDirectGatesTerminalExec(t *testing.T) {
	s := &CoreServiceServer{tasks: map[string]*TaskInfo{}}
	s.SetPermissions(Permissions{ComputerUse: false})
	for _, tool := range []string{"computeruse", "shell", "terminal_exec"} {
		resp, err := s.RunDirect(context.Background(), &corev1.RunDirectRequest{Tool: tool})
		if err != nil {
			t.Fatalf("%s: unexpected error: %v", tool, err)
		}
		if resp.Success || !strings.Contains(resp.Error, "computer_use") {
			t.Fatalf("%s not gated: %+v", tool, resp)
		}
	}
}
