package update

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"
)

var (
	pmPackagePattern = regexp.MustCompile(`^[@a-zA-Z0-9._/+:-]+$`)
	pmVersionPattern = regexp.MustCompile(`^[a-zA-Z0-9._+-]+$`)
)

func validPMPackage(pkg string) bool { return pmPackagePattern.MatchString(pkg) }
func validPMVersion(ver string) bool { return pmVersionPattern.MatchString(ver) }

const (
	markerDone   = "__OKAY_DONE__"
	markerFailed = "__OKAY_FAILED__"
)

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
	case "minecraft":
		return "@razuresoft/0kay-minecraft", true
	case "pm":
		return "@razuresoft/0kay-pm", true
	}
	return "", false
}

type ApplyState struct {
	Plugin  string `json:"plugin"`
	Package string `json:"package"`
	Version string `json:"version,omitempty"`
	Action  string `json:"action,omitempty"`
	Mode    string `json:"mode,omitempty"`
	Status  string `json:"status"`
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
			state.Error = lastLogLine(state.Log)
		}
		if state.Error == "" {
			state.Error = "update script reported a failure"
		}
	default:
		state.Status = "running"
	}
	return state
}

func Start(plugin, version string) (ApplyState, error) {
	plugin = strings.TrimSpace(plugin)
	pkg, known := PackageFor(plugin)
	if !known {
		if _, ok := componentSubdir(plugin); !ok && !pmInstalled(plugin) {
			return ApplyState{Status: "idle"}, fmt.Errorf("unsupported component %q", plugin)
		}
	}
	if current := State(); current.Status == "running" {
		return current, fmt.Errorf("an update is already running")
	}
	dir := updatesDir()
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return ApplyState{Status: "idle"}, err
	}

	startMu.Lock()
	defer startMu.Unlock()

	const umbrella = "@razuresoft/0kay"
	switch {
	case known && pmInstalled(pkg):
		return startPM(dir, plugin, pkg, version)
	case !known && pmInstalled(plugin):
		return startPM(dir, plugin, plugin, version)
	case known && pmInstalled(umbrella) && !SourceAvailable():
		return startPM(dir, plugin, umbrella, version)
	default:
		return startSource(dir, plugin, version)
	}
}

func startPM(dir, plugin, pkg, version string) (ApplyState, error) {
	if !validPMPackage(pkg) {
		return ApplyState{Status: "idle"}, fmt.Errorf("invalid package name %q", pkg)
	}
	ver := strings.TrimPrefix(strings.TrimSpace(version), "v")
	if ver != "" && !validPMVersion(ver) {
		return ApplyState{Status: "idle"}, fmt.Errorf("invalid version %q", version)
	}
	pm, err := PMCommand()
	if err != nil {
		return ApplyState{Status: "idle"}, err
	}
	target := pkg
	if ver != "" {
		target = pkg + "@" + ver
	}
	script, logPath, err := writeUpdater(dir, pm, pkg, target)
	if err != nil {
		return ApplyState{Status: "idle"}, err
	}
	_ = os.Remove(logPath)
	state := ApplyState{
		Plugin:  plugin,
		Package: pkg,
		Version: ver,
		Mode:    "pm",
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

func startSource(dir, plugin, version string) (ApplyState, error) {
	plan, err := sourcePlanFor(plugin)
	if err != nil {
		return ApplyState{Status: "idle"}, err
	}
	script, logPath, err := writeSourceUpdater(dir, *plan)
	if err != nil {
		return ApplyState{Status: "idle"}, err
	}
	_ = os.Remove(logPath)
	state := ApplyState{
		Plugin:  plugin,
		Package: plan.Package,
		Version: strings.TrimPrefix(strings.TrimSpace(version), "v"),
		Mode:    "source",
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

func lastLogLine(text string) string {
	lines := strings.Split(text, "\n")
	for i := len(lines) - 1; i >= 0; i-- {
		if line := strings.TrimSpace(strings.TrimRight(lines[i], "\r")); line != "" {
			return line
		}
	}
	return ""
}

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
