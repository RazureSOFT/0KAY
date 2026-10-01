package server

import (
	"0kay/core/internal/pairing"
	"context"
	"log"
	"strings"

	"0kay/core/internal/registry"
	"0kay/core/internal/settings"
	corev1 "0kay/gen/core/v1"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

// PluginServiceServer implements the PluginService gRPC service.
type PluginServiceServer struct {
	corev1.UnimplementedPluginServiceServer
	registry *registry.Registry
	settings *settings.Store
}

// NewPluginServiceServer creates a new PluginServiceServer.
func NewPluginServiceServer(reg *registry.Registry, setStore *settings.Store) *PluginServiceServer {
	return &PluginServiceServer{
		registry: reg,
		settings: setStore,
	}
}

// Register handles plugin registration (including optional settings sections).
func (s *PluginServiceServer) Register(ctx context.Context, req *corev1.RegisterRequest) (*corev1.RegisterResponse, error) {
	if req.PluginInfo == nil {
		return &corev1.RegisterResponse{
			Success: false,
			Message: "plugin_info is required",
		}, nil
	}

	// Non-builtin plugins may be required to present a shared registration
	// secret (CORE_PLUGIN_REGISTRATION_TOKEN); built-ins bypass it. The secret
	// travels in the x-0kay-registration-token metadata, falling back to the
	// Authorization bearer for compatibility.
	registrationToken := ""
	if md, ok := metadata.FromIncomingContext(ctx); ok {
		if values := md.Get("x-0kay-registration-token"); len(values) > 0 {
			registrationToken = strings.TrimSpace(values[0])
		} else if values := md.Get("authorization"); len(values) > 0 {
			registrationToken = strings.TrimPrefix(values[0], "Bearer ")
		}
	}
	pluginID, err := s.registry.RegisterAuthenticated(req.PluginInfo, req.Capabilities, req.Address, registrationToken)
	if err != nil {
		if _, ok := status.FromError(err); ok {
			return nil, err
		}
		return nil, status.Errorf(codes.Internal, "failed to register plugin: %v", err)
	}
	if pairing.Default != nil {
		pairing.Default.Bind(ctx, req.Address)
	}

	// Register contributed settings sections. Drop this plugin's previous
	// sections first so a re-register (e.g. renamed section id) is not stale.
	if s.settings != nil {
		s.settings.UnregisterPluginSections(pluginID)
		for _, sec := range req.SettingsSections {
			if sec == nil || sec.Id == "" {
				continue
			}
			fields := make([]settings.Field, 0, len(sec.Fields))
			for _, f := range sec.Fields {
				if f == nil {
					continue
				}
				fields = append(fields, settings.Field{
					Key:          f.Key,
					Type:         f.Type,
					Label:        f.Label,
					DefaultValue: f.DefaultValue,
					Options:      f.Options,
					Help:         f.Help,
				})
			}
			s.settings.RegisterSection(settings.Section{
				ID:          sec.Id,
				Label:       sec.Label,
				Icon:        sec.Icon,
				Order:       sec.Order,
				Description: sec.Description,
				Fields:      fields,
				PluginID:    pluginID,
				PluginName:  req.PluginInfo.Name,
			})
		}
	}

	log.Printf("[Registry] Plugin registered: %s (id=%s, addr=%s, caps=%v, settings=%d)",
		req.PluginInfo.Name, pluginID, req.Address, req.Capabilities, len(req.SettingsSections))

	message := "registered successfully"
	if missing := s.registry.MissingDependencies(pluginID); len(missing) > 0 {
		message = "registered; waiting for dependencies: " + strings.Join(missing, ", ")
	}
	return &corev1.RegisterResponse{
		Success:      true,
		PluginId:     pluginID,
		Message:      message,
		ServiceToken: s.registry.Token(pluginID),
	}, nil
}

// Heartbeat handles plugin heartbeats.
func (s *PluginServiceServer) Heartbeat(ctx context.Context, req *corev1.HeartbeatRequest) (*corev1.HeartbeatResponse, error) {
	if req.PluginId == "" {
		return nil, status.Error(codes.InvalidArgument, "plugin_id is required")
	}

	ok, shutdownSignal, err := s.registry.Heartbeat(req.PluginId, req.Status, req.ActiveTasks, req.Host)
	if err != nil {
		return nil, status.Errorf(codes.NotFound, "heartbeat failed: %v", err)
	}

	return &corev1.HeartbeatResponse{
		Ok:             ok,
		ShutdownSignal: shutdownSignal,
	}, nil
}
