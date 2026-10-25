package update

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"
)

func StartInstall(pkg string) (ApplyState, error) {
	pkg = strings.TrimSpace(pkg)
	if !validInstallTarget(pkg) {
		return ApplyState{Status: "idle"}, fmt.Errorf("invalid package %q", pkg)
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
	if current := InstallStatus(); current.Status == "running" {
		return current, fmt.Errorf("an install is already running")
	}

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
		markLaunchFailed(logPath)
		state.Status = "failed"
		state.Error = err.Error()
		writeInstallStateFile(dir, state)
		return state, err
	}
	return state, nil
}

func StartUninstall(pkg string) (ApplyState, error) {
	pkg = strings.TrimSpace(pkg)
	if !validInstallTarget(pkg) {
		return ApplyState{Status: "idle"}, fmt.Errorf("invalid package %q", pkg)
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
	if current := InstallStatus(); current.Status == "running" {
		return current, fmt.Errorf("an operation is already running")
	}

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
		markLaunchFailed(logPath)
		state.Status = "failed"
		state.Error = err.Error()
		writeInstallStateFile(dir, state)
		return state, err
	}
	return state, nil
}

func PlatformPackage(pkg string) bool {
	_, ok := platformComponents[pkg]
	return ok
}

func PMStatus() ApplyState {
	install := InstallStatus()
	apply := State()
	switch {
	case install.Status == "running":
		return install
	case apply.Status == "running":
		return apply
	case install.Started > apply.Started:
		return install
	default:
		return apply
	}
}

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
	resolveStatus(&state, text, "install")
	return state
}

func writeInstallStateFile(dir string, state ApplyState) {
	raw, _ := json.MarshalIndent(state, "", "  ")
	_ = os.WriteFile(filepath.Join(dir, "install.json"), raw, 0o644)
}

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
