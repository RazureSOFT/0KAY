package update

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// Update scripts print these markers so status survives a Core restart
// (the file, not process memory, is the source of truth).
const (
	markerDone   = "__OKAY_DONE__"
	markerFailed = "__OKAY_FAILED__"
)

// PackageFor maps a component name to its published 0kay-pm package.
func PackageFor(plugin string) (string, bool) {
	switch plugin {
	case "core":
		return "@razuresoft/0kay-core", true
	case "webui":
		return "@razuresoft/0kay-webui", true
	case "life":
		return "@razuresoft/0kay-life", true
	case "mocr":
		return "@razuresoft/0kay-mocr", true
	case "agent":
		return "@razuresoft/0kay-agent", true
	case "mcp":
		return "@razuresoft/0kay-mcp", true
	case "searxng":
		return "@razuresoft/0kay-searxng", true
	}
	return "", false
}

// ApplyState is the progress of the most recent update request.
type ApplyState struct {
	Plugin  string `json:"plugin"`
	Package string `json:"package"`
	Version string `json:"version,omitempty"`
	Status  string `json:"status"` // idle|running|done|failed
	Started string `json:"started,omitempty"`
	Error   string `json:"error,omitempty"`
	Log     string `json:"log,omitempty"`
}

var startMu sync.Mutex

func dataDir() string {
	if dir := os.Getenv("CORE_DATA_DIR"); dir != "" {
		return dir
	}
	return "data"
}

func updatesDir() string { return filepath.Join(dataDir(), "updates") }

// PMCommand resolves the 0kay-pm executable (OKAY_PM_BIN override, else PATH).
func PMCommand() (string, error) {
	if value := strings.TrimSpace(os.Getenv("OKAY_PM_BIN")); value != "" {
		return value, nil
	}
	path, err := exec.LookPath("0kay-pm")
	if err != nil {
		return "", fmt.Errorf("0kay-pm not found on PATH (install it with `npm install -g ./pm`): %w", err)
	}
	return path, nil
}

// State reports the latest update request by reading the status files.
func State() ApplyState {
	dir := updatesDir()
	raw, err := os.ReadFile(filepath.Join(dir, "apply.json"))
	if err != nil {
		return ApplyState{Status: "idle"}
	}
	var state ApplyState
	if err := json.Unmarshal(raw, &state); err != nil {
		return ApplyState{Status: "idle"}
	}
	logRaw, _ := os.ReadFile(filepath.Join(dir, "apply.log"))
	text := string(logRaw)
	state.Log = sanitizeLog(text)
	switch {
	case strings.Contains(text, markerDone):
		state.Status = "done"
		state.Error = ""
	case strings.Contains(text, markerFailed):
		state.Status = "failed"
		if state.Error == "" {
			state.Error = "update script reported a failure"
		}
	default:
		state.Status = "running"
	}
	return state
}

// Start launches stop -> update -> start for a component as a detached script,
// so Core can replace and restart itself without killing the updater.
func Start(plugin, version string) (ApplyState, error) {
	pkg, ok := PackageFor(plugin)
	if !ok {
		return ApplyState{Status: "idle"}, fmt.Errorf("unsupported component %q", plugin)
	}
	if current := State(); current.Status == "running" {
		return current, fmt.Errorf("an update is already running")
	}
	pm, err := PMCommand()
	if err != nil {
		return ApplyState{Status: "idle"}, err
	}
	ver := strings.TrimPrefix(strings.TrimSpace(version), "v")
	target := pkg
	if ver != "" {
		target = pkg + "@" + ver
	}

	dir := updatesDir()
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return ApplyState{Status: "idle"}, err
	}

	startMu.Lock()
	defer startMu.Unlock()

	script, logPath, err := writeUpdater(dir, pm, pkg, target)
	if err != nil {
		return ApplyState{Status: "idle"}, err
	}
	_ = os.Remove(logPath) // discard stale markers before the new run

	state := ApplyState{
		Plugin:  plugin,
		Package: pkg,
		Version: ver,
		Status:  "running",
		Started: time.Now().UTC().Format(time.RFC3339),
	}
	writeStateFile(dir, state)
	if err := launchDetached(script, logPath); err != nil {
		state.Status = "failed"
		state.Error = err.Error()
		writeStateFile(dir, state)
		return state, err
	}
	return state, nil
}

func writeStateFile(dir string, state ApplyState) {
	raw, _ := json.MarshalIndent(state, "", "  ")
	_ = os.WriteFile(filepath.Join(dir, "apply.json"), raw, 0o644)
}

// sanitizeLog strips the status markers and keeps the tail readable.
func sanitizeLog(text string) string {
	lines := strings.Split(text, "\n")
	kept := make([]string, 0, len(lines))
	for _, line := range lines {
		if strings.Contains(line, markerDone) || strings.Contains(line, markerFailed) {
			continue
		}
		kept = append(kept, line)
	}
	joined := strings.TrimRight(strings.Join(kept, "\n"), "\n")
	if len(joined) > 8000 {
		joined = joined[len(joined)-8000:]
	}
	return joined
}
