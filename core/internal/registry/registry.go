package registry

import (
	"crypto/hmac"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"fmt"
	"google.golang.org/protobuf/proto"
	"os"
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
	disabled map[string]bool            // plugin name -> disabled by admin
	// secret derives each plugin's service token (HMAC). Empty disables tokens.
	secret []byte
	// registrationToken, when set, must be presented by non-builtin plugins at
	// registration (CORE_PLUGIN_REGISTRATION_TOKEN). Empty keeps the historic
	// network-trust model for backward compatibility.
	registrationToken string
	// trusted holds first-party plugin names exempt from the manifest permission
	// checks (they ship with the platform).
	trusted map[string]bool
}

// NewRegistry creates a new plugin registry.
func NewRegistry() *Registry {
	return &Registry{
		plugins:  make(map[string]*PluginInstance),
		disabled: make(map[string]bool),
		trusted:  make(map[string]bool),
	}
}

// SetTrusted marks first-party plugin names as exempt from permission checks.
func (r *Registry) SetTrusted(names []string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.trusted = make(map[string]bool, len(names))
	for _, n := range names {
		if n != "" {
			r.trusted[n] = true
		}
	}
}

// IsTrusted reports whether a plugin is Core-builtin or part of the first-party
// platform set, both of which bypass the manifest permission allow-lists.
func (r *Registry) IsTrusted(name string) bool {
	if name == "" {
		return false
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	if r.trusted[name] {
		return true
	}
	for _, p := range r.plugins {
		if p.Info != nil && p.Info.Name == name && p.Builtin {
			return true
		}
	}
	return false
}

// IsTrustedName reports whether name is in the first-party trusted set, without
// scanning registered plugins. Hot paths that already hold the PluginInstance
// can check its Builtin flag directly and use this for the name allow-list,
// avoiding the nested scan IsTrusted performs.
func (r *Registry) IsTrustedName(name string) bool {
	if name == "" {
		return false
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.trusted[name]
}

// SetSecret installs the HMAC key used to derive per-plugin service tokens.
// Call before any plugin registers so tokens are stable across process restarts.
func (r *Registry) SetSecret(secret []byte) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.secret = append([]byte(nil), secret...)
}

// SetRegistrationToken installs the shared secret non-builtin plugins must
// present at registration. Empty disables the check.
func (r *Registry) SetRegistrationToken(token string) {
	r.mu.Lock()
	defer r.mu.Unlock()
	r.registrationToken = strings.TrimSpace(token)
}

// RegisterAuthenticated registers a plugin after checking the shared
// registration secret (when one is configured). Built-in registrations bypass
// it via RegisterBuiltin.
func (r *Registry) RegisterAuthenticated(info *pluginv1.PluginInfo, capabilities []string, address, token string) (string, error) {
	if info == nil || info.Name == "" {
		return "", status.Error(codes.InvalidArgument, "plugin name is required")
	}
	r.mu.RLock()
	required := r.registrationToken
	r.mu.RUnlock()
	// An explicit per-plugin key takes precedence over shared enrollment.
	if raw := os.Getenv("CORE_PLUGIN_TOKEN_" + strings.ToUpper(strings.NewReplacer("-", "_", ".", "_").Replace(info.Name))); raw != "" {
		required = strings.TrimSpace(raw)
	} else if r.IsTrusted(info.Name) {
		return "", status.Error(codes.PermissionDenied, "first-party plugin requires a dedicated enrollment key")
	}
	if required == "" || subtle.ConstantTimeCompare([]byte(required), []byte(token)) != 1 {
		return "", status.Error(codes.PermissionDenied, "plugin registration token required")
	}
	r.mu.RLock()
	for _, existing := range r.plugins {
		if existing.Builtin && existing.Info != nil && existing.Info.Name == info.Name {
			r.mu.RUnlock()
			return "", status.Error(codes.PermissionDenied, "reserved builtin plugin name")
		}
	}
	r.mu.RUnlock()
	return r.Register(info, capabilities, address)
}

// Token returns the stable service token for a plugin id. It is issued to the
// plugin at registration and verified on every attributed HTTP/egress call.
func (r *Registry) Token(pluginID string) string {
	r.mu.RLock()
	defer r.mu.RUnlock()
	return r.tokenLocked(pluginID)
}

func (r *Registry) tokenLocked(pluginID string) string {
	if len(r.secret) == 0 || pluginID == "" {
		return ""
	}
	mac := hmac.New(sha256.New, r.secret)
	mac.Write([]byte(pluginID))
	return hex.EncodeToString(mac.Sum(nil))
}

// FindByName returns the plugin instance registered under a plugin name.
func (r *Registry) FindByName(name string) (*PluginInstance, bool) {
	if name == "" {
		return nil, false
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	for _, p := range r.plugins {
		if p.Info != nil && p.Info.Name == name {
			return snapshot(p), true
		}
	}
	return nil, false
}

// FindByID returns the plugin instance registered under a plugin id.
func (r *Registry) FindByID(id string) (*PluginInstance, bool) {
	if id == "" {
		return nil, false
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	if p, ok := r.plugins[id]; ok {
		return snapshot(p), true
	}
	return nil, false
}

// Authenticate resolves a plugin name + service token to its instance. It
// fails closed: when no token secret is configured, attributed calls are not
// accepted (Core always provisions a secret, so this only happens on fault).
func (r *Registry) Authenticate(name, token string) (*PluginInstance, bool) {
	if name == "" {
		return nil, false
	}
	r.mu.RLock()
	defer r.mu.RUnlock()
	if len(r.secret) == 0 {
		return nil, false
	}
	for _, p := range r.plugins {
		if p.Info == nil || p.Info.Name != name {
			continue
		}
		expected := r.tokenLocked(p.PluginID)
		if expected != "" && subtle.ConstantTimeCompare([]byte(expected), []byte(token)) == 1 {
			return snapshot(p), true
		}
	}
	return nil, false
}

// IsBuiltin reports whether the named plugin was registered by Core.
func (r *Registry) IsBuiltin(name string) bool {
	r.mu.RLock()
	defer r.mu.RUnlock()
	for _, p := range r.plugins {
		if p.Info != nil && p.Info.Name == name {
			return p.Builtin
		}
	}
	return false
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

	// Replace any existing instance with the same name (keep its plugin_id) so a
	// restart does not leave a duplicate row. Executors ARE distinct per
	// executor capability; a plain agent is distinct per address so multiple
	// agent hosts can co-exist.
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

// PluginTool is a contributed tool plus its owning plugin.
type PluginTool struct {
	Plugin string
	Tool   *pluginv1.PluginTool
}

// ListTools returns every tool contributed by a non-disabled plugin, filtered
// by consumer scope when scope is non-empty ("agent" / "life").
func (r *Registry) ListTools(scope string) []PluginTool {
	r.mu.RLock()
	defer r.mu.RUnlock()
	var out []PluginTool
	for _, p := range r.plugins {
		if p.Info == nil || len(p.Info.Tools) == 0 {
			continue
		}
		if r.isLockedDisabledLocked(p.Info.Name) {
			continue
		}
		for _, tool := range p.Info.Tools {
			if scope != "" && !toolHasScope(tool, scope) {
				continue
			}
			out = append(out, PluginTool{Plugin: p.Info.Name, Tool: proto.Clone(tool).(*pluginv1.PluginTool)})
		}
	}
	sort.Slice(out, func(i, j int) bool { return out[i].Tool.Name < out[j].Tool.Name })
	return out
}

// ToolOwner finds the plugin that declared a tool name.
func (r *Registry) ToolOwner(name string) (*PluginInstance, *pluginv1.PluginTool, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	for _, p := range r.plugins {
		if p.Info == nil {
			continue
		}
		if r.isLockedDisabledLocked(p.Info.Name) {
			continue
		}
		for _, tool := range p.Info.Tools {
			if tool.Name == name {
				return snapshot(p), proto.Clone(tool).(*pluginv1.PluginTool), true
			}
		}
	}
	return nil, nil, false
}

func toolHasScope(tool *pluginv1.PluginTool, scope string) bool {
	if tool == nil {
		return false
	}
	if len(tool.Scopes) == 0 {
		// No scope declared: usable by both Agent and L.I.F.E.
		return true
	}
	for _, s := range tool.Scopes {
		if s == scope {
			return true
		}
	}
	return false
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
