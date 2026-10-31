package gateway

import (
	"os"
	"path/filepath"
	"sort"
	"strings"

	"0kay/core/internal/registry"
)

// PluginDescriptor is one object that describes a plugin completely.
//
// The pieces already existed but were scattered across four responses: identity
// and capabilities in /api/plugins, permissions inside that row, health in two
// derived strings, and the actual front-end modules only discoverable by walking
// data/plugin-ui. A caller that wants to show "what is this plugin and where is
// its page" had to join all of that itself.
type PluginDescriptor struct {
	ID           string           `json:"id"`
	PluginID     string           `json:"plugin_id,omitempty"`
	Name         string           `json:"name"`
	Version      string           `json:"version"`
	Kind         string           `json:"kind"`
	Builtin      bool             `json:"builtin"`
	Capabilities []string         `json:"capabilities,omitempty"`
	Permissions  map[string]any   `json:"permissions,omitempty"`
	Health       PluginHealthSpec `json:"health"`
	Lifecycle    string           `json:"lifecycle"`
	Surfaces     []PluginSurface  `json:"surfaces,omitempty"`
}

// PluginHealthSpec is how a caller decides for itself whether the plugin is
// alive, using the same thresholds the gateway uses.
type PluginHealthSpec struct {
	DegradedAfterSeconds float64 `json:"degraded_after_seconds"`
	StaleAfterSeconds    float64 `json:"stale_after_seconds"`
}

// PluginSurface is one place the plugin puts its front-end.
type PluginSurface struct {
	Target string `json:"target"`
	ID     string `json:"id"`
	Module string `json:"module"`
}

// descriptorKind maps the plugin type enum onto the word used in the descriptor.
func descriptorKind(pluginType string) string {
	switch pluginType {
	case "PLUGIN_TYPE_ADAPTER", "PLUGIN_TYPE_MESSAGING":
		return "bridge"
	case "PLUGIN_TYPE_PERSONA", "PLUGIN_TYPE_SERVICE":
		return "service"
	case "PLUGIN_TYPE_TOOL":
		return "tool"
	}
	return "unknown"
}

// pluginSurfaces lists the front-end entry points that actually exist on disk.
// Each *.js file directly inside data/plugin-ui/<name> is a page module; the
// strings/ subdirectory is not, so it is skipped by the extension filter.
func pluginSurfaces(name string) []PluginSurface {
	root := pluginUIRoot(name)
	entries, err := os.ReadDir(root)
	if err != nil {
		return nil
	}
	var surfaces []PluginSurface
	for _, entry := range entries {
		if entry.IsDir() {
			continue
		}
		file := entry.Name()
		if !strings.HasSuffix(file, ".js") {
			continue
		}
		id := strings.TrimSuffix(file, ".js")
		surfaces = append(surfaces, PluginSurface{
			Target: "page",
			ID:     id,
			Module: "/api/plugins/" + name + "/ui/" + filepath.ToSlash(file),
		})
	}
	sort.Slice(surfaces, func(i, j int) bool { return surfaces[i].ID < surfaces[j].ID })
	return surfaces
}

// descriptorFor assembles the descriptor for one registered plugin instance.
func descriptorFor(p *registry.PluginInstance, disabled bool) PluginDescriptor {
	descriptor := PluginDescriptor{
		PluginID: p.PluginID,
		Builtin:  p.Builtin,
		Health: PluginHealthSpec{
			DegradedAfterSeconds: pluginDegradedAfter.Seconds(),
			StaleAfterSeconds:    pluginStaleAfter.Seconds(),
		},
	}
	if p.Info != nil {
		descriptor.Name = p.Info.Name
		descriptor.Version = p.Info.Version
		descriptor.Kind = descriptorKind(p.Info.PluginType.String())
		if p.Info.Permissions != nil {
			descriptor.Permissions = map[string]any{
				"api_requires": p.Info.Permissions.ApiRequires,
				"api_exposes":  p.Info.Permissions.ApiExposes,
				"egress":       p.Info.Permissions.Egress,
			}
		}
	}
	descriptor.ID = descriptor.Name
	if descriptor.ID == "" {
		descriptor.ID = p.PluginID
	}
	descriptor.Capabilities = append([]string(nil), p.Capabilities...)

	age := pluginHeartbeatAge(p.LastHeartbeat)
	health := pluginHealth(p.Status.String(), age)
	descriptor.Lifecycle = pluginPhase(pluginPhaseInputs{
		Disabled:   disabled,
		Registered: !p.RegisteredAt.IsZero(),
		Status:     p.Status.String(),
		Health:     health,
	})
	descriptor.Surfaces = pluginSurfaces(descriptor.Name)
	return descriptor
}
