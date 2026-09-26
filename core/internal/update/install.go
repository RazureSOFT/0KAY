package update

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// StartInstall runs `0kay-pm install <package> --no-pair` as a detached script
// so a plugin UI (for example the marketplace) can install third-party plugins
// without the user touching a terminal. --no-pair installs into the local Core.
func StartInstall(pkg string) (ApplyState, error) {
	pkg = strings.TrimSpace(pkg)
	if !validInstallTarget(pkg) {
		return ApplyState{Status: "idle"}, fmt.Errorf("invalid package %q", pkg)
	}
	if current := InstallStatus(); current.Status == "running" {
		return current, fmt.Errorf("an install is already running")
	}
	pm, err := PMCommand()
	if err != nil {
		return ApplyState{Status: "idle"}, err
	}
	dir := updatesDir()
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return ApplyState{Status: "idle"}, err
	}

	startMu.Lock()
	defer startMu.Unlock()

	script, logPath, err := writeInstaller(dir, pm, pkg)
	if err != nil {
		return ApplyState{Status: "idle"}, err
	}
	_ = os.Remove(logPath)
	state := ApplyState{
		Plugin:  pkg,
		Package: pkg,
		Action:  "install",
		Mode:    "pm",
		Status:  "running",
		Started: time.Now().UTC().Format(time.RFC3339),
	}
	writeInstallStateFile(dir, state)
	if err := launchDetached(script, logPath); err != nil {
		state.Status = "failed"
		state.Error = err.Error()
		writeInstallStateFile(dir, state)
		return state, err
	}
	return state, nil
}

// StartUninstall removes a plugin installed via 0kay-pm as a detached script.
func StartUninstall(pkg string) (ApplyState, error) {
	pkg = strings.TrimSpace(pkg)
	if !validInstallTarget(pkg) {
		return ApplyState{Status: "idle"}, fmt.Errorf("invalid package %q", pkg)
	}
	if current := InstallStatus(); current.Status == "running" {
		return current, fmt.Errorf("an operation is already running")
	}
	pm, err := PMCommand()
	if err != nil {
		return ApplyState{Status: "idle"}, err
	}
	dir := updatesDir()
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return ApplyState{Status: "idle"}, err
	}

	startMu.Lock()
	defer startMu.Unlock()

	script, logPath, err := writeUninstaller(dir, pm, pkg)
	if err != nil {
		return ApplyState{Status: "idle"}, err
	}
	_ = os.Remove(logPath)
	state := ApplyState{
		Plugin:  pkg,
		Package: pkg,
		Action:  "uninstall",
		Mode:    "pm",
		Status:  "running",
		Started: time.Now().UTC().Format(time.RFC3339),
	}
	writeInstallStateFile(dir, state)
	if err := launchDetached(script, logPath); err != nil {
		state.Status = "failed"
		state.Error = err.Error()
		writeInstallStateFile(dir, state)
		return state, err
	}
	return state, nil
}

// PlatformPackage reports whether a package is part of the 0KAY platform and so
// must not be uninstalled through the marketplace.
func PlatformPackage(pkg string) bool {
	_, ok := platformComponents[pkg]
	return ok
}

// InstallStatus reports the latest install request from the status files.
func InstallStatus() ApplyState {
	dir := updatesDir()
	raw, err := os.ReadFile(filepath.Join(dir, "install.json"))
	if err != nil {
		return ApplyState{Status: "idle"}
	}
	var state ApplyState
	if err := json.Unmarshal(raw, &state); err != nil {
		return ApplyState{Status: "idle"}
	}
	logRaw, _ := os.ReadFile(filepath.Join(dir, "install.log"))
	text := string(logRaw)
	state.Log = sanitizeLog(text)
	switch {
	case strings.Contains(text, markerDone):
		state.Status = "done"
		state.Error = ""
	case strings.Contains(text, markerFailed):
		state.Status = "failed"
		if state.Error == "" {
			state.Error = lastLogLine(state.Log)
		}
		if state.Error == "" {
			state.Error = "install script reported a failure"
		}
	default:
		state.Status = "running"
	}
	return state
}

func writeInstallStateFile(dir string, state ApplyState) {
	raw, _ := json.MarshalIndent(state, "", "  ")
	_ = os.WriteFile(filepath.Join(dir, "install.json"), raw, 0o644)
}

// validInstallTarget accepts scoped names, owner/repo and repo URLs, rejecting
// whitespace and shell metacharacters since the value reaches a shell script.
func validInstallTarget(pkg string) bool {
	if pkg == "" || len(pkg) > 200 {
		return false
	}
	if strings.ContainsAny(pkg, " \t\r\n\"'`$&|<>^;\\") {
		return false
	}
	if strings.HasPrefix(pkg, "https://") || strings.HasPrefix(pkg, "git@") {
		return true
	}
	return strings.Contains(pkg, "/")
}
