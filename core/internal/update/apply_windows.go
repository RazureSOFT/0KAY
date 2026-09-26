//go:build windows

package update

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
)

const (
	detachedProcess       = 0x00000008
	createNewProcessGroup = 0x00000200
)

func winQuote(value string) string {
	return `"` + strings.ReplaceAll(value, `"`, `""`) + `"`
}

// writeUpdater writes the batch script that stops, updates and starts a
// component, then prints a status marker for State() to read.
func writeUpdater(dir, pm, pkg, target string) (string, string, error) {
	script := filepath.Join(dir, "update.cmd")
	logPath := filepath.Join(dir, "apply.log")
	body := fmt.Sprintf("@echo off\r\n"+
		"call %s stop %s\r\n"+
		"call %s update %s\r\n"+
		"if errorlevel 1 (echo %s & exit /b 1)\r\n"+
		"call %s start %s\r\n"+
		"if errorlevel 1 (echo %s & exit /b 1)\r\n"+
		"echo %s\r\n",
		winQuote(pm), winQuote(pkg),
		winQuote(pm), winQuote(target), markerFailed,
		winQuote(pm), winQuote(pkg), markerFailed,
		markerDone,
	)
	if err := os.WriteFile(script, []byte(body), 0o644); err != nil {
		return "", "", err
	}
	return script, logPath, nil
}

// launchDetached runs the script with no console and its own process group.
func launchDetached(script, logPath string) error {
	handle, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o644)
	if err != nil {
		return err
	}
	cmd := exec.Command("cmd", "/c", script)
	cmd.Stdout = handle
	cmd.Stderr = handle
	cmd.SysProcAttr = &syscall.SysProcAttr{CreationFlags: detachedProcess | createNewProcessGroup}
	if err := cmd.Start(); err != nil {
		handle.Close()
		return err
	}
	go func() { _ = cmd.Wait(); _ = handle.Close() }()
	return nil
}
