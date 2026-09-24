package server

import (
	"context"
	"log"

	corev1 "0kay/gen/core/v1"
	"0kay/core/internal/registry"
	"0kay/core/internal/settings"

	"google.golang.org/grpc/codes"
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

	pluginID, err := s.registry.Register(req.PluginInfo, req.Capabilities, req.Address)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "failed to register plugin: %v", err)
	}

	// Register contributed settings sections
	if s.settings != nil {
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

	return &corev1.RegisterResponse{
		Success:  true,
		PluginId: pluginID,
		Message:  "registered successfully",
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
