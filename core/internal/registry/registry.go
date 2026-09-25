package registry

import (
	"crypto/sha256"
	"fmt"
	"google.golang.org/protobuf/proto"
	"sort"
	"strings"
	"sync"
	"time"

	corev1 "0kay/gen/core/v1"
	pluginv1 "0kay/gen/plugin/v1"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

// PluginInstance represents a registered plugin.
type PluginInstance struct {
	Info         *pluginv1.PluginInfo
	PluginID     string
	Capabilities []string
	// Address is the gRPC callback address where Core can reach this plugin.
	Address       string
	Status        corev1.PluginStatus
	ActiveTasks   int32
	RegisteredAt  time.Time
	LastHeartbeat time.Time
	// Host is the host machine info reported via heartbeat.
	Host *corev1.HostInfo
	// Builtin plugins are registered by Core itself and are exempt from stale checks.
	Builtin bool
}

// Registry manages plugin registration and service discovery.
type Registry struct {
	mu       sync.RWMutex
	plugins  map[string]*PluginInstance // plugin_id -> PluginInstance
	counter  int64
	disabled map[string]bool // plugin name -> disabled by admin
}

// NewRegistry creates a new plugin registry.
func NewRegistry() *Registry {
	return &Registry{
		plugins:  make(map[string]*PluginInstance),
		disabled: make(map[string]bool),
	}
}

// SetEnabled enables or disables a plugin by name. Disabled plugins are
// hidden from listing/discovery until re-enabled.
func (r *Registry) SetEnabled(name string, enabled bool) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if name == "" {
		return
	}
	if enabled {
		delete(r.disabled, name)
		for _, p := range r.plugins {
			if p.Info != nil && p.Info.Name == name {
				if p.Builtin {
					p.Status = corev1.PluginStatus_PLUGIN_STATUS_HEALTHY
					p.LastHeartbeat = time.Now()
				} else {
					// Non-builtin will re-assert health on next heartbeat.
					p.Status = corev1.PluginStatus_PLUGIN_STATUS_UNHEALTHY
				}
			}
		}
	} else {
		r.disabled[name] = true
		for _, p := range r.plugins {
			if p.Info != nil && p.Info.Name == name {
				p.Status = corev1.PluginStatus_PLUGIN_STATUS_UNHEALTHY
			}
		}
	}
}

// IsDisabled reports whether a plugin name is admin-disabled.
func (r *Registry) IsDisabled(name string) bool {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.disabled[name]
}

// DisabledNames returns a copy of currently disabled plugin names.
func (r *Registry) DisabledNames() []string {
	r.mu.RLock()
	defer r.mu.RUnlock()
	out := make([]string, 0, len(r.disabled))
	for n := range r.disabled {
		out = append(out, n)
	}
	return out
}

// LoadDisabled replaces the disabled set (startup restore).
func (r *Registry) LoadDisabled(names []string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.disabled = make(map[string]bool, len(names))
	for _, n := range names {
		if n != "" {
			r.disabled[n] = true
		}
	}
}

func (r *Registry) isLockedDisabledLocked(name string) bool {
	return r.disabled[name]
}

// Register registers a plugin. Re-registering the same name replaces the
// previous entry (same plugin_id) so restarts do not leave duplicate rows.
func (r *Registry) Register(info *pluginv1.PluginInfo, capabilities []string, address string) (string, error) {
	if info == nil {
		return "", status.Error(codes.InvalidArgument, "plugin_info is required")
	}
	if info.Name == "" {
		return "", status.Error(codes.InvalidArgument, "plugin name is required")
	}

	r.mu.Lock()
	defer r.mu.Unlock()

	// Replace any existing instance with the same name (keep its plugin_id).
	identity := info.Name
	for _, capability := range capabilities {
		if strings.HasPrefix(capability, "executor:") {
			identity = capability
			break
		}
	}
	if identity == info.Name {
		for _, capability := range capabilities {
			if capability == "agent" {
				identity = "agent@" + address
				break
			}
		}
	}
	hash := sha256.Sum256([]byte(identity))
	stableID := fmt.Sprintf("plugin_%x", hash[:12])
	for id, p := range r.plugins {
		if id != stableID {
			continue
		}
		now := time.Now()
		wasUnhealthy := p.Status == corev1.PluginStatus_PLUGIN_STATUS_UNHEALTHY
		p.Info = proto.Clone(info).(*pluginv1.PluginInfo)
		p.Capabilities = append([]string(nil), capabilities...)
		p.Address = address
		p.Status = corev1.PluginStatus_PLUGIN_STATUS_HEALTHY
		p.ActiveTasks = 0
		p.LastHeartbeat = now
		if wasUnhealthy {
			p.RegisteredAt = now
		}
		return id, nil
	}

	r.counter++
	pluginID := stableID

	now := time.Now()
	instance := &PluginInstance{
		Info:          proto.Clone(info).(*pluginv1.PluginInfo),
		PluginID:      pluginID,
		Capabilities:  append([]string(nil), capabilities...),
		Address:       address,
		Status:        corev1.PluginStatus_PLUGIN_STATUS_HEALTHY,
		RegisteredAt:  now,
		LastHeartbeat: now,
	}

	r.plugins[pluginID] = instance
	return pluginID, nil
}

// RegisterBuiltin registers a Core-managed built-in plugin (e.g. webui).
// Builtin entries are never marked stale by heartbeat timeout.
func (r *Registry) RegisterBuiltin(info *pluginv1.PluginInfo, capabilities []string, address string) (string, error) {
	id, err := r.Register(info, capabilities, address)
	if err != nil {
		return "", err
	}
	r.mu.Lock()
	defer r.mu.Unlock()
	if p, ok := r.plugins[id]; ok {
		p.Builtin = true
	}
	return id, nil
}

// TouchBuiltins refreshes LastHeartbeat for builtin plugins so they stay healthy.
func (r *Registry) TouchBuiltins() {
	r.mu.Lock()
	defer r.mu.Unlock()
	now := time.Now()
	for _, p := range r.plugins {
		if p.Builtin {
			p.LastHeartbeat = now
			p.Status = corev1.PluginStatus_PLUGIN_STATUS_HEALTHY
		}
	}
}

// Heartbeat updates the heartbeat timestamp and status of a plugin.
func (r *Registry) Heartbeat(pluginID string, status_ corev1.PluginStatus, activeTasks int32, host *corev1.HostInfo) (bool, bool, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	plugin, ok := r.plugins[pluginID]
	if !ok {
		return false, false, status.Errorf(codes.NotFound, "plugin %s not found", pluginID)
	}

	plugin.LastHeartbeat = time.Now()
	plugin.Status = status_
	plugin.ActiveTasks = activeTasks
	if host != nil {
		plugin.Host = proto.Clone(host).(*corev1.HostInfo)
	}

	return true, false, nil
}

// GetPlugin returns a plugin by ID.
func (r *Registry) GetPlugin(pluginID string) (*PluginInstance, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	plugin, ok := r.plugins[pluginID]
	return snapshot(plugin), ok
}

// GetPluginsByCapability returns all healthy plugins with a given capability.
func (r *Registry) GetPluginsByCapability(capability string) []*PluginInstance {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*PluginInstance
	for _, p := range r.plugins {
		if p.Info != nil && r.isLockedDisabledLocked(p.Info.Name) {
			continue
		}
		if p.Status == corev1.PluginStatus_PLUGIN_STATUS_HEALTHY && r.dependenciesReadyLocked(p, map[string]bool{}) {
			for _, c := range p.Capabilities {
				if c == capability {
					result = append(result, snapshot(p))
					break
				}
			}
		}
	}
	sortPlugins(result)
	return result
}

// GetAgents returns all registered Agent plugins.
// When onlineOnly is true, only healthy agents are returned.
func (r *Registry) GetAgents(onlineOnly bool) []*PluginInstance {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var result []*PluginInstance
	for _, p := range r.plugins {
		if p.Info != nil && r.isLockedDisabledLocked(p.Info.Name) {
			continue
		}
		isAgent := false
		for _, c := range p.Capabilities {
			if c == "agent" {
				isAgent = true
				break
			}
		}
		if !isAgent {
			continue
		}
		if onlineOnly && p.Status != corev1.PluginStatus_PLUGIN_STATUS_HEALTHY {
			continue
		}
		if onlineOnly && !r.dependenciesReadyLocked(p, map[string]bool{}) {
			continue
		}
		result = append(result, snapshot(p))
	}
	sortPlugins(result)
	return result
}

// CountOnlineAgents returns the number of healthy Agent plugins.
func (r *Registry) CountOnlineAgents() int {
	return len(r.GetAgents(true))
}

// GetAllPlugins returns all registered plugins (excluding admin-disabled).
func (r *Registry) GetAllPlugins() []*PluginInstance {
	r.mu.RLock()
	defer r.mu.RUnlock()

	result := make([]*PluginInstance, 0, len(r.plugins))
	for _, p := range r.plugins {
		if p.Info != nil && r.isLockedDisabledLocked(p.Info.Name) {
			continue
		}
		result = append(result, snapshot(p))
	}
	sortPlugins(result)
	return result
}

func sortPlugins(items []*PluginInstance) {
	sort.Slice(items, func(i, j int) bool {
		if items[i].Info.GetName() != items[j].Info.GetName() {
			return items[i].Info.GetName() < items[j].Info.GetName()
		}
		return items[i].PluginID < items[j].PluginID
	})
}

func snapshot(p *PluginInstance) *PluginInstance {
	if p == nil {
		return nil
	}
	copy := *p
	copy.Capabilities = append([]string(nil), p.Capabilities...)
	if p.Info != nil {
		copy.Info = proto.Clone(p.Info).(*pluginv1.PluginInfo)
	}
	if p.Host != nil {
		copy.Host = proto.Clone(p.Host).(*corev1.HostInfo)
	}
	return &copy
}

// RemovePlugin removes a plugin from the registry.
func (r *Registry) RemovePlugin(pluginID string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	_, ok := r.plugins[pluginID]
	if ok {
		delete(r.plugins, pluginID)
	}
	return ok
}

// CheckStalePlugins marks plugins as unhealthy if they haven't sent a heartbeat
// within the given timeout. Returns IDs of plugins marked unhealthy.
func (r *Registry) CheckStalePlugins(timeout time.Duration) []string {
	r.mu.Lock()
	defer r.mu.Unlock()

	var stale []string
	now := time.Now()

	for id, p := range r.plugins {
		if p.Builtin {
			continue
		}
		if p.Status != corev1.PluginStatus_PLUGIN_STATUS_UNHEALTHY &&
			now.Sub(p.LastHeartbeat) > timeout {
			p.Status = corev1.PluginStatus_PLUGIN_STATUS_UNHEALTHY
			stale = append(stale, id)
		}
	}
	return stale
}

// SendShutdownSignal marks a plugin for shutdown (placeholder for actual signal).
func (r *Registry) SendShutdownSignal(pluginID string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	_, ok := r.plugins[pluginID]
	return ok
}
