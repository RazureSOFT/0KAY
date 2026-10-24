package server

import (
	"context"
	"sort"
	"strings"
	"time"

	"0kay/core/internal/messaging"
	"0kay/core/internal/registry"
	corev1 "0kay/gen/core/v1"
	pluginv1 "0kay/gen/plugin/v1"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

const messageSendTimeout = 15 * time.Second

const adapterListTimeout = 3 * time.Second

const gateDecisionTimeout = 2 * time.Second

func (s *CoreServiceServer) messageBus() *messaging.Bus {
	s.busOnce.Do(func() {
		if s.bus == nil {
			s.bus = messaging.NewBus()
		}
	})
	return s.bus
}

func (s *CoreServiceServer) DropPluginMessaging(name string) {
	if name == "" || s.bus == nil {
		return
	}
	s.bus.DropPlugin(name)
}

func (s *CoreServiceServer) MessagingStats() messaging.Stats {
	return s.messageBus().Stats()
}

func (s *CoreServiceServer) MessagingAdapters(ctx context.Context) []*messaging.Adapter {
	if ctx == nil {
		ctx = context.Background()
	}
	s.enumerateAdapters(ctx)
	return s.messageBus().Adapters()
}

func (s *CoreServiceServer) callerScope(ctx context.Context, callerID string) (*registry.PluginInstance, messaging.Scope, error) {
	callerID = strings.TrimSpace(callerID)
	if callerID == "" {
		return nil, messaging.Scope{}, status.Error(codes.InvalidArgument, "caller_id is required")
	}
	inst, ok := s.registry.FindByName(callerID)
	if !ok {
		inst, ok = s.registry.FindByID(callerID)
	}
	if !ok || inst.Info == nil {
		return nil, messaging.Scope{}, status.Error(codes.Unauthenticated, "unknown plugin identity")
	}
	var token string
	if md, mdOK := metadata.FromIncomingContext(ctx); mdOK {
		for _, value := range md.Get("authorization") {
			if len(value) > 7 && strings.EqualFold(value[:7], "Bearer ") {
				token = strings.TrimSpace(value[7:])
				break
			}
		}
	}
	authenticated, valid := s.registry.Authenticate(inst.Info.Name, token)
	if !valid || authenticated.PluginID != inst.PluginID {
		return nil, messaging.Scope{}, status.Error(codes.Unauthenticated, "valid plugin service token required")
	}
	trusted := s.registry.IsTrusted(inst.Info.Name)
	scope := messaging.ScopeFrom(inst.Info.Name, trusted, inst.Info.GetPermissions().GetMessages())
	return inst, scope, nil
}

func (s *CoreServiceServer) PublishInboundMessage(ctx context.Context, req *corev1.PublishInboundMessageRequest) (*corev1.PublishInboundMessageResponse, error) {
	inst, scope, err := s.callerScope(ctx, req.GetCallerId())
	if err != nil {
		return nil, err
	}
	msg := req.GetMessage()
	if msg == nil || strings.TrimSpace(msg.GetAdapterId()) == "" {
		return &corev1.PublishInboundMessageResponse{Error: "message.adapter_id is required"}, nil
	}
	if strings.TrimSpace(msg.GetConversation()) == "" {
		return &corev1.PublishInboundMessageResponse{Error: "message.conversation is required"}, nil
	}
	if !scope.CanPublish(msg.GetAdapterId()) {
		s.messageBus().CountRejected()
		svcLog.WarnContext(ctx, "inbound publish refused",
			"plugin", inst.Info.Name, "adapter", msg.GetAdapterId())
		return &corev1.PublishInboundMessageResponse{
			Error: "adapter " + msg.GetAdapterId() + " is not listed in messages.publish_adapters",
		}, nil
	}
	delivered := s.messageBus().Publish(msg, inst.Info.Name)
	decision := s.arbitrate(ctx, msg)
	if decision.Action == messaging.GateDeny {
		svcLog.InfoContext(ctx, "inbound message vetoed by gate",
			"gate", decision.DecidedBy, "conversation", msg.GetConversation(),
			"reason", decision.Reason)
	}
	return &corev1.PublishInboundMessageResponse{
		Accepted:      true,
		Delivered:     int32(delivered),
		ShouldProcess: decision.ShouldProcess,
		DecidedBy:     decision.DecidedBy,
		Reason:        decision.Reason,
	}, nil
}

type GateDecision struct {
	ShouldProcess bool
	Action        string
	DecidedBy     string
	Reason        string
}

type gateCandidate struct {
	inst  *registry.PluginInstance
	scope messaging.Scope
}

func (s *CoreServiceServer) arbitrate(ctx context.Context, msg *pluginv1.InboundMessage) GateDecision {
	decision := GateDecision{ShouldProcess: msg.GetIsWake(), Action: messaging.GateAbstain}

	for _, gate := range s.gatePlugins(msg) {
		action, reason := s.askGate(ctx, gate, msg)
		switch action {
		case messaging.GateDeny:
			return GateDecision{ShouldProcess: false, Action: messaging.GateDeny,
				DecidedBy: gate.inst.Info.GetName(), Reason: reason}
		case messaging.GateAllow:
			if decision.Action != messaging.GateAllow {
				decision = GateDecision{ShouldProcess: true, Action: messaging.GateAllow,
					DecidedBy: gate.inst.Info.GetName(), Reason: reason}
			}
		}
	}
	return decision
}

func (s *CoreServiceServer) gatePlugins(msg *pluginv1.InboundMessage) []gateCandidate {
	var out []gateCandidate
	for _, plugin := range s.registry.GetAllPlugins() {
		if plugin == nil || plugin.Info == nil || !messagingCapable(plugin) {
			continue
		}
		perms := plugin.Info.GetPermissions().GetMessages()
		if perms == nil || !perms.GetGate() {
			continue
		}
		scope := messaging.ScopeFrom(plugin.Info.GetName(),
			s.registry.IsTrusted(plugin.Info.GetName()), perms)
		if !scope.CanGate(msg) {
			continue
		}
		out = append(out, gateCandidate{inst: plugin, scope: scope})
	}
	return out
}

func (s *CoreServiceServer) askGate(ctx context.Context, gate gateCandidate, msg *pluginv1.InboundMessage) (string, string) {
	name := gate.inst.Info.GetName()
	unreachable := func(err error) (string, string) {
		if gate.scope.GateOnError == messaging.GateDeny {
			svcLog.WarnContext(ctx, "gate unreachable, applying its declared deny",
				"gate", name, "err", err)
			return messaging.GateDeny, "gate unreachable; gate_on_error=deny"
		}
		svcLog.DebugContext(ctx, "gate unreachable, abstaining", "gate", name, "err", err)
		return messaging.GateAbstain, ""
	}
	conn, err := s.lifeDialCached(gate.inst)
	if err != nil {
		return unreachable(err)
	}
	callCtx, cancel := context.WithTimeout(ctx, gateDecisionTimeout)
	defer cancel()
	resp, err := pluginv1.NewMessageServiceClient(conn).DecideInbound(callCtx,
		&pluginv1.DecideInboundRequest{CallerId: "core", Message: msg})
	if err != nil {
		return unreachable(err)
	}
	return messaging.NormaliseGateAction(resp.GetAction()), resp.GetReason()
}

func (s *CoreServiceServer) SubscribeMessages(req *corev1.SubscribeMessagesRequest, stream corev1.CoreService_SubscribeMessagesServer) error {
	ctx := stream.Context()
	inst, scope, err := s.callerScope(ctx, req.GetCallerId())
	if err != nil {
		return err
	}
	if !scope.CanReadAny() {
		return status.Error(codes.PermissionDenied,
			"plugin declares no messages.read_mode (expected \"wake\" or \"all\")")
	}
	bus := s.messageBus()
	sub := bus.Subscribe(scope, int(req.GetReplayLast()))
	defer bus.Unsubscribe(sub)

	svcLog.InfoContext(ctx, "message subscription opened",
		"plugin", inst.Info.Name, "read_mode", scope.ReadMode, "replay", req.GetReplayLast())

	for {
		select {
		case <-ctx.Done():
			return nil
		case msg, ok := <-sub.C():
			if !ok {
				return nil
			}
			if err := stream.Send(&corev1.SubscribeMessagesResponse{
				Message:    msg,
				Subscriber: inst.Info.Name,
			}); err != nil {
				return err
			}
		}
	}
}

func (s *CoreServiceServer) SendMessage(ctx context.Context, req *corev1.SendMessageRequest) (*corev1.SendMessageResponse, error) {
	inst, scope, err := s.callerScope(ctx, req.GetCallerId())
	if err != nil {
		return nil, err
	}
	conversation := strings.TrimSpace(req.GetConversation())
	if conversation == "" {
		return &corev1.SendMessageResponse{Error: "conversation is required"}, nil
	}
	if strings.TrimSpace(req.GetText()) == "" && len(req.GetMedia()) == 0 {
		return &corev1.SendMessageResponse{Error: "text or media is required"}, nil
	}

	adapterID := strings.TrimSpace(req.GetAdapterId())
	if adapterID == "" {
		var candidates []string
		for _, a := range s.messageBus().Adapters() {
			if scope.CanSend(a.ID) {
				candidates = append(candidates, a.ID)
			}
		}
		switch len(candidates) {
		case 1:
			adapterID = candidates[0]
		case 0:
			s.messageBus().CountRejected()
			return &corev1.SendMessageResponse{
				Error: "no adapter available: declare messages.send_adapters",
			}, nil
		default:
			return &corev1.SendMessageResponse{
				Error: "adapter_id is required, choose one of: " + strings.Join(candidates, ", "),
			}, nil
		}
	}
	if !scope.CanSend(adapterID) {
		s.messageBus().CountRejected()
		svcLog.WarnContext(ctx, "outbound send refused",
			"plugin", inst.Info.Name, "adapter", adapterID)
		return &corev1.SendMessageResponse{
			Error: "adapter " + adapterID + " is not listed in messages.send_adapters",
		}, nil
	}

	owner, ok := s.messageBus().Owner(adapterID)
	if !ok {
		return &corev1.SendMessageResponse{Error: "unknown adapter " + adapterID}, nil
	}
	ownerInst, ok := s.registry.FindByName(owner)
	if !ok || ownerInst.Address == "" {
		return &corev1.SendMessageResponse{Error: "adapter owner " + owner + " is not connected"}, nil
	}
	conn, err := s.lifeDialCached(ownerInst)
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "connect adapter owner %s: %v", owner, err)
	}
	callCtx, cancel := context.WithTimeout(ctx, messageSendTimeout)
	defer cancel()
	resp, err := pluginv1.NewMessageServiceClient(conn).SendMessage(callCtx, &pluginv1.SendMessageRequest{
		CallerId:     inst.Info.Name,
		AdapterId:    adapterID,
		Conversation: conversation,
		Text:         req.GetText(),
		Media:        req.GetMedia(),
	})
	if err != nil {
		return nil, status.Errorf(codes.Internal, "adapter send via %s: %v", owner, err)
	}
	return &corev1.SendMessageResponse{
		Success:   resp.GetSuccess(),
		MessageId: resp.GetMessageId(),
		Error:     resp.GetError(),
	}, nil
}

func (s *CoreServiceServer) ListAdapters(ctx context.Context, req *corev1.ListAdaptersRequest) (*corev1.ListAdaptersResponse, error) {
	_, scope, err := s.callerScope(ctx, req.GetCallerId())
	if err != nil {
		return nil, err
	}
	s.enumerateAdapters(ctx)

	out := &corev1.ListAdaptersResponse{Adapters: []*corev1.AdapterInfo{}}
	for _, adapter := range s.messageBus().Adapters() {
		canRead := scope.MayReadAdapter(adapter.ID)
		canSend := scope.CanSend(adapter.ID)
		if !canRead && !canSend {
			continue
		}
		info := &corev1.AdapterInfo{
			AdapterId:   adapter.ID,
			Platform:    adapter.Platform,
			Name:        adapter.Name,
			OwnerPlugin: adapter.Owner,
			CanRead:     canRead,
			CanSend:     canSend,
		}
		if canSend {
			keys := make([]string, 0, len(adapter.Conversations))
			for k := range adapter.Conversations {
				keys = append(keys, k)
			}
			sort.Strings(keys)
			for _, k := range keys {
				c := adapter.Conversations[k]
				info.Conversations = append(info.Conversations, &corev1.ConversationInfo{
					Conversation: c.GetConversation(),
					Kind:         c.GetKind(),
					Name:         c.GetName(),
				})
			}
		}
		out.Adapters = append(out.Adapters, info)
	}
	return out, nil
}

func (s *CoreServiceServer) enumerateAdapters(ctx context.Context) {
	for _, plugin := range s.registry.GetAllPlugins() {
		if !messagingCapable(plugin) {
			continue
		}
		conn, err := s.lifeDialCached(plugin)
		if err != nil {
			continue
		}
		callCtx, cancel := context.WithTimeout(ctx, adapterListTimeout)
		resp, err := pluginv1.NewMessageServiceClient(conn).ListAdapters(callCtx,
			&pluginv1.ListAdaptersRequest{CallerId: "core"})
		cancel()
		if err != nil {
			if status.Code(err) != codes.Unimplemented {
				svcLog.DebugContext(ctx, "adapter enumeration skipped",
					"plugin", plugin.Info.GetName(), "err", err)
			}
			continue
		}
		for _, descriptor := range resp.GetAdapters() {
			s.messageBus().RegisterAdapter(plugin.Info.GetName(), descriptor)
		}
	}
}

func messagingCapable(plugin *registry.PluginInstance) bool {
	if plugin == nil || plugin.Info == nil || plugin.Address == "" {
		return false
	}
	for _, c := range plugin.Capabilities {
		if strings.EqualFold(strings.TrimSpace(c), "messaging") {
			return true
		}
	}
	switch plugin.Info.GetPluginType() {
	case pluginv1.PluginType_PLUGIN_TYPE_ADAPTER, pluginv1.PluginType_PLUGIN_TYPE_MESSAGING:
		return true
	}
	return false
}
