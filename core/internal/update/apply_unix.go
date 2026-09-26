//go:build !windows

package update

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
)

func shQuote(value string) string {
	return "'" + strings.ReplaceAll(value, "'", `'\''`) + "'"
}

// writeUpdater writes the shell script that stops, updates and starts a
// component, then prints a status marker for State() to read.
func writeUpdater(dir, pm, pkg, target string) (string, string, error) {
	script := filepath.Join(dir, "update.sh")
	logPath := filepath.Join(dir, "apply.log")
	body := fmt.Sprintf(`#!/bin/sh
%s stop %s
%s update %s
code=$?
if [ $code -eq 0 ]; then
  %s start %s
  code=$?
fi
if [ $code -eq 0 ]; then echo %s; else echo %s; fi
exit $code
`,
		shQuote(pm), shQuote(pkg),
		shQuote(pm), shQuote(target),
		shQuote(pm), shQuote(pkg),
		markerDone, markerFailed,
	)
	if err := os.WriteFile(script, []byte(body), 0o755); err != nil {
		return "", "", err
	}
	return script, logPath, nil
}

// launchDetached runs the script in its own session with output to the log.
func launchDetached(script, logPath string) error {
	handle, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o644)
	if err != nil {
		return err
	}
	cmd := exec.Command("/bin/sh", script)
	cmd.Stdout = handle
	cmd.Stderr = handle
	cmd.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	if err := cmd.Start(); err != nil {
		handle.Close()
		return err
	}
	go func() { _ = cmd.Wait(); _ = handle.Close() }()
	return nil
}
