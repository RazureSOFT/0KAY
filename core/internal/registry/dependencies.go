package registry

import "strings"

// Registration capability convention: requires:<plugin-name>.
func (r *Registry) MissingDependencies(pluginID string) []string {
	r.mu.RLock()
	defer r.mu.RUnlock()
	plugin := r.plugins[pluginID]
	if plugin == nil {
		return nil
	}
	missing := []string{}
	for _, capability := range plugin.Capabilities {
		if !strings.HasPrefix(capability, "requires:") {
			continue
		}
		name := strings.TrimPrefix(capability, "requires:")
		found := false
		for _, candidate := range r.plugins {
			if candidate.Info.GetName() == name && candidate.Status.String() == "PLUGIN_STATUS_HEALTHY" && !r.disabled[name] {
				found = true
				break
			}
		}
		if !found {
			missing = append(missing, name)
		}
	}
	return missing
}

func (r *Registry) dependenciesReadyLocked(plugin *PluginInstance, visiting map[string]bool) bool {
	if visiting[plugin.PluginID] {
		return false
	}
	visiting[plugin.PluginID] = true
	defer delete(visiting, plugin.PluginID)
	for _, capability := range plugin.Capabilities {
		if !strings.HasPrefix(capability, "requires:") {
			continue
		}
		name := strings.TrimPrefix(capability, "requires:")
		found := false
		for _, candidate := range r.plugins {
			if candidate.Info.GetName() == name && candidate.Status.String() == "PLUGIN_STATUS_HEALTHY" && !r.disabled[name] && r.dependenciesReadyLocked(candidate, visiting) {
				found = true
				break
			}
		}
		if !found {
			return false
		}
	}
	return true
}
