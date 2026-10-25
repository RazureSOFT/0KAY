package server

import (
	"0kay/core/internal/pairing"
	"context"
	"crypto/subtle"
	"log"
	"strings"

	"0kay/core/internal/registry"
	"0kay/core/internal/settings"
	corev1 "0kay/gen/core/v1"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

type PluginServiceServer struct {
	corev1.UnimplementedPluginServiceServer
	registry *registry.Registry
	settings *settings.Store
}

func NewPluginServiceServer(reg *registry.Registry, setStore *settings.Store) *PluginServiceServer {
	return &PluginServiceServer{
		registry: reg,
		settings: setStore,
	}
}

func (s *PluginServiceServer) Register(ctx context.Context, req *corev1.RegisterRequest) (*corev1.RegisterResponse, error) {
	if req.PluginInfo == nil {
		return &corev1.RegisterResponse{
			Success: false,
			Message: "plugin_info is required",
		}, nil
	}

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

	if s.settings != nil {
		// Re-registration must not wipe the plugin's stored values first:
		// plugins register on every start, so the previous "unregister then
		// register" order discarded user-configured settings each boot.
		// Values are dropped only on explicit unregistration.
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

func (s *PluginServiceServer) Heartbeat(ctx context.Context, req *corev1.HeartbeatRequest) (*corev1.HeartbeatResponse, error) {
	if req.PluginId == "" {
		return nil, status.Error(codes.InvalidArgument, "plugin_id is required")
	}

	// The heartbeat must carry the service token issued to this plugin at
	// registration (metadata "authorization: Bearer <token>"), so a third
	// party cannot keep an arbitrary plugin id alive by spoofing heartbeats.
	expected := s.registry.Token(req.PluginId)
	if expected == "" {
		return nil, status.Error(codes.PermissionDenied, "plugin service token required")
	}
	token := ""
	if md, ok := metadata.FromIncomingContext(ctx); ok {
		for _, value := range md.Get("authorization") {
			if len(value) > 7 && strings.EqualFold(value[:7], "Bearer ") {
				token = strings.TrimSpace(value[7:])
				break
			}
		}
	}
	if subtle.ConstantTimeCompare([]byte(expected), []byte(token)) != 1 {
		return nil, status.Error(codes.PermissionDenied, "plugin service token mismatch")
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
