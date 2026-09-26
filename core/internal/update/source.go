package update

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
)

// sourcePlan describes a git-based (non-pm) update for one component.
type sourcePlan struct {
	Name    string
	Package string
	RepoDir string // git repository to pull
	Dir     string // component directory (build/start cwd)
	Port    int    // restart: kill whoever listens here (0 = skip)
	Build   [][]string
	Start   []string
	Env     map[string]string
}

// componentSubdir maps a plugin name to its directory inside the source tree.
func componentSubdir(plugin string) (string, bool) {
	switch plugin {
	case "core", "mocr", "life", "agent", "webui", "searxng", "mcp", "minecraft":
		return plugin, true
	}
	return "", false
}

// componentPort is the listen port used to find + restart a running component.
func componentPort(plugin string) int {
	switch plugin {
	case "core":
		return 8080
	case "mocr":
		return 50052
	case "life":
		return 50053
	case "agent":
		return 50054
	case "webui":
		return 3000
	case "searxng":
		return 8888
	case "minecraft":
		return 8765
	}
	return 0
}

// pmInstalled reports whether 0kay-pm has a record for the package.
func pmInstalled(pkg string) bool {
	home := strings.TrimSpace(os.Getenv("OKAY_PM_HOME"))
	if home == "" {
		userHome, err := os.UserHomeDir()
		if err != nil {
			return false
		}
		home = filepath.Join(userHome, ".0kay")
	}
	raw, err := os.ReadFile(filepath.Join(home, "state.json"))
	if err != nil {
		return false
	}
	var state struct {
		Installed map[string]json.RawMessage `json:"installed"`
	}
	if json.Unmarshal(raw, &state) != nil {
		return false
	}
	_, ok := state.Installed[pkg]
	return ok
}

// sourceRoot locates the umbrella checkout (OKAY_SOURCE_ROOT or by walking up
// from the running executable until a manifest.json + .git pair is found).
func sourceRoot() (string, error) {
	if value := strings.TrimSpace(os.Getenv("OKAY_SOURCE_ROOT")); value != "" {
		return value, nil
	}
	executable, err := os.Executable()
	if err != nil {
		return "", err
	}
	dir := filepath.Dir(executable)
	for i := 0; i < 8; i++ {
		if fileExists(filepath.Join(dir, "manifest.json")) && dirExists(filepath.Join(dir, ".git")) {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return "", fmt.Errorf("source root not found (set OKAY_SOURCE_ROOT)")
}

func fileExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && !info.IsDir()
}

func dirExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && info.IsDir()
}

// gitRepoFor returns the closest ancestor directory containing .git.
func gitRepoFor(dir string) string {
	current := dir
	for i := 0; i < 8; i++ {
		if dirExists(filepath.Join(current, ".git")) {
			return current
		}
		parent := filepath.Dir(current)
		if parent == current {
			break
		}
		current = parent
	}
	return dir
}

type sourceManifest struct {
	Name    string     `json:"name"`
	Install [][]string `json:"install"`
	Start   []string   `json:"start"`
}

func loadSourceManifest(dir string) (*sourceManifest, error) {
	raw, err := os.ReadFile(filepath.Join(dir, "manifest.json"))
	if err != nil {
		return nil, fmt.Errorf("read %s/manifest.json: %w", dir, err)
	}
	var manifest sourceManifest
	if err := json.Unmarshal(raw, &manifest); err != nil {
		return nil, fmt.Errorf("parse %s/manifest.json: %w", dir, err)
	}
	return &manifest, nil
}

// isDependencyStep reports install steps that only fetch dependencies; a source
// checkout already has them, and re-running them can disrupt live processes.
func isDependencyStep(cmd []string) bool {
	if len(cmd) < 2 {
		return false
	}
	switch cmd[0] {
	case "npm":
		return cmd[1] == "ci" || cmd[1] == "install" || cmd[1] == "i"
	case "yarn", "pnpm":
		return cmd[1] == "install" || cmd[1] == "i"
	case "pip", "pip3":
		return cmd[1] == "install"
	case "python", "python3":
		return len(cmd) >= 4 && cmd[2] == "-m" && cmd[3] == "pip"
	}
	return false
}

// sourcePlanFor builds the git update plan for a component.
func sourcePlanFor(plugin string) (*sourcePlan, error) {
	subdir, ok := componentSubdir(plugin)
	if !ok {
		return nil, fmt.Errorf("component %q has no source layout", plugin)
	}
	root, err := sourceRoot()
	if err != nil {
		return nil, err
	}
	dir := filepath.Join(root, subdir)
	if !dirExists(dir) {
		return nil, fmt.Errorf("source directory not found: %s", dir)
	}
	manifest, err := loadSourceManifest(dir)
	if err != nil {
		return nil, err
	}
	plan := &sourcePlan{
		Name:    plugin,
		Package: manifest.Name,
		RepoDir: gitRepoFor(dir),
		Dir:     dir,
		Port:    componentPort(plugin),
		Start:   manifest.Start,
		Env:     map[string]string{},
	}
	for _, cmd := range manifest.Install {
		if isDependencyStep(cmd) {
			continue
		}
		plan.Build = append(plan.Build, cmd)
	}
	if plugin == "life" {
		plan.Env["PYTHONPATH"] = filepath.Join(dir, "src")
	}
	if len(plan.Start) == 0 {
		return nil, fmt.Errorf("component %q has no start command", plugin)
	}
	return plan, nil
}
