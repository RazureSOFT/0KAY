package update

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
)

// These types mirror the manifest `capabilities` block (DeepSeek-Harness-style
// "everything is a plugin"): a package can contribute commands, skills, hooks,
// MCP servers and agents, which Core aggregates and hands to consumers.

type PluginCommand struct {
	Package     string `json:"package"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	Prompt      string `json:"prompt"`
}

type PluginSkill struct {
	Package string `json:"package"`
	Name    string `json:"name"`
	Path    string `json:"path"`
}

type PluginHook struct {
	Package string   `json:"package"`
	Event   string   `json:"event"`
	Command []string `json:"command"`
}

type PluginMCPServer struct {
	Package string         `json:"package"`
	Config  map[string]any `json:"config"`
}

type PluginAgent struct {
	Package     string `json:"package"`
	Name        string `json:"name"`
	Description string `json:"description,omitempty"`
	Prompt      string `json:"prompt"`
}

// Contributions is the aggregated capability set across installed packages.
type Contributions struct {
	Commands   []PluginCommand   `json:"commands"`
	Skills     []PluginSkill     `json:"skills"`
	Hooks      []PluginHook      `json:"hooks"`
	MCPServers []PluginMCPServer `json:"mcp_servers"`
	Agents     []PluginAgent     `json:"agents"`
}

// PluginContributions reads every 0kay-pm-installed package's manifest and
// aggregates its declared capabilities. Skill paths are resolved to absolute
// paths on this host so an in-process consumer (the Agent) can load them.
func PluginContributions() Contributions {
	out := Contributions{
		Commands:   []PluginCommand{},
		Skills:     []PluginSkill{},
		Hooks:      []PluginHook{},
		MCPServers: []PluginMCPServer{},
		Agents:     []PluginAgent{},
	}
	roots := pmInstalledRoots()
	for _, record := range roots {
		raw, err := os.ReadFile(filepath.Join(record.Root, "manifest.json"))
		if err != nil {
			continue
		}
		var manifest struct {
			Capabilities struct {
				Commands   []PluginCommandManifest `json:"commands"`
				Skills     []string                `json:"skills"`
				Hooks      []PluginHook            `json:"hooks"`
				MCPServers []map[string]any        `json:"mcpServers"`
				Agents     []PluginCommandManifest `json:"agents"`
			} `json:"capabilities"`
		}
		if json.Unmarshal(raw, &manifest) != nil {
			continue
		}
		caps := manifest.Capabilities
		for _, command := range caps.Commands {
			out.Commands = append(out.Commands, PluginCommand{Package: record.Name, Name: command.Name, Description: command.Description, Prompt: command.Prompt})
		}
		for _, agent := range caps.Agents {
			out.Agents = append(out.Agents, PluginAgent{Package: record.Name, Name: agent.Name, Description: agent.Description, Prompt: agent.Prompt})
		}
		for _, hook := range caps.Hooks {
			out.Hooks = append(out.Hooks, PluginHook{Package: record.Name, Event: hook.Event, Command: append([]string(nil), hook.Command...)})
		}
		for _, server := range caps.MCPServers {
			out.MCPServers = append(out.MCPServers, PluginMCPServer{Package: record.Name, Config: server})
		}
		for _, rel := range caps.Skills {
			absolute := filepath.Clean(filepath.Join(record.Root, filepath.FromSlash(rel)))
			if !strings.HasPrefix(absolute, filepath.Clean(record.Root)) {
				continue
			}
			if info, err := os.Stat(absolute); err != nil || !info.IsDir() {
				continue
			}
			out.Skills = append(out.Skills, PluginSkill{Package: record.Name, Name: filepath.Base(absolute), Path: absolute})
		}
	}
	return out
}

// PluginCommandManifest is a command/agent entry as it appears in a manifest.
type PluginCommandManifest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
	Prompt      string `json:"prompt"`
}

type installedRoot struct {
	Name string
	Root string
}

func pmInstalledRoots() []installedRoot {
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
			RepositoryRoot string `json:"repositoryRoot"`
		} `json:"installed"`
	}
	if json.Unmarshal(raw, &state) != nil {
		return nil
	}
	out := make([]installedRoot, 0, len(state.Installed))
	for name, record := range state.Installed {
		if strings.TrimSpace(record.RepositoryRoot) == "" {
			continue
		}
		out = append(out, installedRoot{Name: name, Root: record.RepositoryRoot})
	}
	return out
}
