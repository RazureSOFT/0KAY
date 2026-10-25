package update

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// startImageBase is the expected process name of the service this plan
// restarts. The restart scripts use it to kill only PIDs that plausibly belong
// to the service being updated, never an unrelated program that happened to
// grab the port.
func startImageBase(plan sourcePlan) string {
	if len(plan.Start) == 0 {
		return ""
	}
	first := strings.TrimPrefix(plan.Start[0], "./")
	base := strings.ToLower(filepath.Base(filepath.ToSlash(first)))
	return strings.TrimSuffix(base, ".exe")
}

type sourcePlan struct {
	Name    string
	Package string
	RepoDir string
	Dir     string
	Port    int
	Build   [][]string
	Start   []string
	Env     map[string]string
}

func componentSubdir(plugin string) (string, bool) {
	switch plugin {
	case "core", "mocr", "life", "agent", "webui", "mcp", "minecraft", "pm":
		return plugin, true
	}
	return "", false
}

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
	case "minecraft":
		return 8765
	}
	return 0
}

func pmStatePath() string {
	home := strings.TrimSpace(os.Getenv("OKAY_PM_HOME"))
	if home == "" {
		userHome, err := os.UserHomeDir()
		if err != nil {
			return ""
		}
		home = filepath.Join(userHome, ".0kay")
	}
	return filepath.Join(home, "state.json")
}

func pmInstalledPackages() map[string]bool {
	path := pmStatePath()
	if path == "" {
		return nil
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var state struct {
		Installed map[string]json.RawMessage `json:"installed"`
	}
	if json.Unmarshal(raw, &state) != nil {
		return nil
	}
	set := make(map[string]bool, len(state.Installed))
	for name := range state.Installed {
		set[name] = true
	}
	return set
}

func pmInstalled(pkg string) bool {
	return pmInstalledPackages()[pkg]
}

type InstalledPlugin struct {
	Name       string `json:"name"`
	Version    string `json:"version,omitempty"`
	Repository string `json:"repository,omitempty"`
	Source     string `json:"source,omitempty"`
}

var platformComponents = map[string]struct {
	Dir        string
	Repository string
}{
	"@razuresoft/0kay":           {".", "https://github.com/RazureSOFT/0KAY.git"},
	"@razuresoft/0kay-core":      {"core", "https://github.com/RazureSOFT/0KAY.git"},
	"@razuresoft/0kay-webui":     {"webui", "https://github.com/RazureSOFT/0KAY.git"},
	"@razuresoft/0kay-life":      {"life", "https://github.com/RazureSOFT/0KAY.git"},
	"@razuresoft/0kay-mocr":      {"mocr", "https://github.com/RazureSOFT/0KAY.git"},
	"@razuresoft/0kay-pm":        {"pm", "https://github.com/RazureSOFT/0KAY-pm.git"},
	"@razuresoft/0kay-agent":     {"agent", "https://github.com/RazureSOFT/0KAY-agent.git"},
	"@razuresoft/0kay-mcp":       {"mcp", "https://github.com/RazureSOFT/0KAY-mcp.git"},
	"@razuresoft/0kay-minecraft": {"minecraft", "https://github.com/razureink/0KAY-minecraft.git"},
}

func pmInstalledPluginList() []InstalledPlugin {
	path := pmStatePath()
	if path == "" {
		return nil
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil
	}
	var state struct {
		Installed map[string]struct {
			Version        string `json:"version"`
			Repository     string `json:"repository"`
			RepositoryRoot string `json:"repositoryRoot"`
		} `json:"installed"`
	}
	if json.Unmarshal(raw, &state) != nil {
		return nil
	}
	out := make([]InstalledPlugin, 0, len(state.Installed))
	for name, record := range state.Installed {
		repository := record.Repository
		if repository == "" {
			repository = gitRemoteURL(record.RepositoryRoot)
		}
		if repository == "" {
			repository = packageRepository(record.RepositoryRoot)
		}
		version := packageVersion(record.RepositoryRoot)
		if version == "" {
			version = record.Version
		}
		out = append(out, InstalledPlugin{Name: name, Version: version, Repository: repository, Source: "pm"})
	}
	return out
}

func packageRepository(root string) string {
	if strings.TrimSpace(root) == "" {
		return ""
	}
	for _, name := range []string{"manifest.json", "package.json"} {
		raw, err := os.ReadFile(filepath.Join(root, name))
		if err != nil {
			continue
		}
		var meta struct {
			Repository any `json:"repository"`
		}
		if json.Unmarshal(raw, &meta) != nil {
			continue
		}
		switch value := meta.Repository.(type) {
		case string:
			if strings.TrimSpace(value) != "" {
				return value
			}
		case map[string]any:
			if url, _ := value["url"].(string); strings.TrimSpace(url) != "" {
				return url
			}
		}
	}
	return ""
}

func packageVersion(dir string) string {
	if strings.TrimSpace(dir) == "" {
		return ""
	}
	for _, name := range []string{"manifest.json", "package.json"} {
		raw, err := os.ReadFile(filepath.Join(dir, name))
		if err != nil {
			continue
		}
		var meta struct {
			Version string `json:"version"`
		}
		if json.Unmarshal(raw, &meta) != nil {
			continue
		}
		if strings.TrimSpace(meta.Version) != "" {
			return meta.Version
		}
	}
	return ""
}

func ComponentForPackage(pkg string) (string, bool) {
	if component, ok := platformComponents[pkg]; ok {
		if component.Dir == "." {
			return "", false
		}
		return component.Dir, true
	}
	if strings.TrimSpace(pkg) == "" {
		return "", false
	}
	return pkg, true
}

func CanUpdate(name string) bool {
	if _, ok := PackageFor(name); ok {
		return true
	}
	if _, ok := componentSubdir(name); ok {
		return true
	}
	return pmInstalled(name)
}

func RepositoryURL(name string) (string, bool) {
	if pkg, ok := PackageFor(name); ok {
		if component, found := platformComponents[pkg]; found && strings.TrimSpace(component.Repository) != "" {
			return component.Repository, true
		}
	}
	if owner, repo, ok := RepositoryFor(name); ok {
		return "https://github.com/" + owner + "/" + repo, true
	}
	for _, plugin := range InstalledPlugins() {
		if plugin.Name == name && strings.TrimSpace(plugin.Repository) != "" {
			return plugin.Repository, true
		}
	}
	return "", false
}

func gitRemoteURL(dir string) string {
	if strings.TrimSpace(dir) == "" {
		return ""
	}
	repo := gitRepoFor(dir)
	raw, err := os.ReadFile(filepath.Join(repo, ".git", "config"))
	if err != nil {
		return ""
	}
	inOrigin := false
	for _, line := range strings.Split(string(raw), "\n") {
		trimmed := strings.TrimSpace(line)
		if strings.HasPrefix(trimmed, "[") {
			inOrigin = trimmed == `[remote "origin"]`
			continue
		}
		if !inOrigin {
			continue
		}
		if idx := strings.Index(trimmed, "url"); idx == 0 {
			if eq := strings.Index(trimmed, "="); eq >= 0 {
				return strings.TrimSpace(trimmed[eq+1:])
			}
		}
	}
	return ""
}

func sourceInstalledPluginList() []InstalledPlugin {
	root, err := sourceRoot()
	if err != nil {
		return nil
	}
	out := make([]InstalledPlugin, 0, len(platformComponents))
	for name, component := range platformComponents {
		path := root
		if component.Dir != "." {
			path = filepath.Join(root, component.Dir)
		}
		if info, err := os.Stat(path); err == nil && info.IsDir() {
			out = append(out, InstalledPlugin{Name: name, Version: packageVersion(path), Repository: component.Repository, Source: "platform"})
		}
	}
	return out
}

func InstalledPlugins() []InstalledPlugin {
	merged := map[string]InstalledPlugin{}
	for _, plugin := range pmInstalledPluginList() {
		merged[plugin.Name] = plugin
	}
	for _, plugin := range sourceInstalledPluginList() {
		if _, ok := merged[plugin.Name]; !ok {
			merged[plugin.Name] = plugin
		}
	}
	for name, component := range platformComponents {
		if plugin, ok := merged[name]; ok {
			plugin.Source = "platform"
			if plugin.Repository == "" {
				plugin.Repository = component.Repository
			}
			merged[name] = plugin
		}
	}
	out := make([]InstalledPlugin, 0, len(merged))
	for _, plugin := range merged {
		out = append(out, plugin)
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Name < out[j].Name })
	return out
}

func sourceRoot() (string, error) {
	if value := strings.TrimSpace(os.Getenv("OKAY_SOURCE_ROOT")); value != "" && dirExists(value) {
		return value, nil
	}
	executable, err := os.Executable()
	if err != nil {
		return "", err
	}
	dir := filepath.Dir(executable)
	for i := 0; i < 8; i++ {
		if isUmbrellaRoot(dir) {
			return dir, nil
		}
		parent := filepath.Dir(dir)
		if parent == dir {
			break
		}
		dir = parent
	}
	return "", fmt.Errorf("source root not found: run 0KAY from a git checkout or set OKAY_SOURCE_ROOT")
}

func SourceAvailable() bool {
	_, err := sourceRoot()
	return err == nil
}

func isUmbrellaRoot(dir string) bool {
	if !gitMarkerExists(dir) {
		return false
	}
	for _, marker := range []string{"manifest.json", "bootstrap.ps1", "buf.gen.yaml", filepath.Join("pm", "package.json")} {
		if fileExists(filepath.Join(dir, marker)) {
			return true
		}
	}
	return false
}

func gitMarkerExists(dir string) bool {
	_, err := os.Stat(filepath.Join(dir, ".git"))
	return err == nil
}

func fileExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && !info.IsDir()
}

func dirExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && info.IsDir()
}

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
	plan := &sourcePlan{
		Name:    plugin,
		RepoDir: gitRepoFor(dir),
		Dir:     dir,
		Port:    componentPort(plugin),
		Env:     map[string]string{},
	}
	if plugin == "pm" {
		plan.Package, _ = PackageFor(plugin)
		return plan, nil
	}
	manifest, err := loadSourceManifest(dir)
	if err != nil {
		return nil, err
	}
	plan.Package = manifest.Name
	plan.Start = manifest.Start
	for _, cmd := range manifest.Install {
		if isDependencyStep(cmd) {
			continue
		}
		plan.Build = append(plan.Build, cmd)
	}
	if plugin == "life" {
		plan.Env["PYTHONPATH"] = filepath.Join(dir, "src")
	}
	return plan, nil
}
