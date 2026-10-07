package server

import (
	"context"
	"net"
	"testing"
	"time"

	"0kay/core/internal/registry"
	corev1 "0kay/gen/core/v1"
	pluginv1 "0kay/gen/plugin/v1"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

// startCore serves a real CoreService over gRPC so the tests exercise the
// authenticated path (caller identity, service token) rather than calling the
// handlers directly.
func startCore(t *testing.T, reg *registry.Registry) (*CoreServiceServer, string) {
	t.Helper()
	instance := NewCoreServiceServer(reg, t.TempDir())
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	server := grpc.NewServer()
	corev1.RegisterCoreServiceServer(server, instance)
	go func() { _ = server.Serve(listener) }()
	t.Cleanup(server.Stop)
	return instance, listener.Addr().String()
}

func dialCore(t *testing.T, address string) *grpc.ClientConn {
	t.Helper()
	conn, err := grpc.NewClient(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	t.Cleanup(func() { _ = conn.Close() })
	return conn
}

// tokenCtx presents the service token Core derives for a plugin id. Without it
// Core answers Unauthenticated, which is the point of the check.
func tokenCtx(token string) context.Context {
	return metadata.AppendToOutgoingContext(context.Background(), "authorization", "Bearer "+token)
}

// messagingPlugin registers a plugin with the given messaging permissions and
// returns its id.
func messagingPlugin(t *testing.T, reg *registry.Registry, name, address string, perms *pluginv1.PluginMessages) string {
	t.Helper()
	id, err := reg.Register(&pluginv1.PluginInfo{
		Name:        name,
		Version:     "1.0.0",
		PluginType:  pluginv1.PluginType_PLUGIN_TYPE_MESSAGING,
		Permissions: &pluginv1.PluginPermission{Messages: perms},
	}, []string{"messaging"}, address)
	if err != nil {
		t.Fatalf("register %s: %v", name, err)
	}
	return id
}

func inbound(adapter, conversation, text string, wake bool) *pluginv1.InboundMessage {
	return &pluginv1.InboundMessage{
		AdapterId: adapter, Conversation: conversation, Kind: "group",
		Text: text, IsWake: wake, SenderName: "tester",
	}
}

// The whole path in one test: an adapter reports a message, a subscriber
// receives it, and a gate vetoes the assistant's processing of it.
func TestMessaging_PublishSubscribeAndGateOverGRPC(t *testing.T) {
	reg := registry.NewRegistry()
	reg.SetSecret([]byte("integration-secret"))

	gate := &fakeGate{action: "deny", reason: "blocked by policy"}
	gateAddress := startGate(t, gate)
	gateID := messagingPlugin(t, reg, "gate-plugin", gateAddress, &pluginv1.PluginMessages{
		ReadMode: "all", ReadAdapters: []string{"*"}, Gate: true,
	})
	publisherID := messagingPlugin(t, reg, "life", "127.0.0.1:1", &pluginv1.PluginMessages{
		PublishAdapters: []string{"qq-1"},
	})
	observerID := messagingPlugin(t, reg, "observer", "127.0.0.1:2", &pluginv1.PluginMessages{
		ReadMode: "all", ReadAdapters: []string{"qq-1"},
	})

	_, address := startCore(t, reg)
	core := corev1.NewCoreServiceClient(dialCore(t, address))

	// A subscriber that declared read access receives the message.
	//
	// gRPC's SubscribeMessages returns as soon as the stream object exists, not
	// when the server handler has registered the subscription, so the first
	// publish can legitimately land before the subscription is live. replay_last
	// covers exactly that gap — and once the first delivery has arrived the
	// subscription is provably live, so the second publish tests live fan-out
	// without a race.
	streamCtx, cancel := context.WithCancel(tokenCtx(reg.Token(observerID)))
	defer cancel()
	stream, err := core.SubscribeMessages(streamCtx, &corev1.SubscribeMessagesRequest{
		CallerId: "observer", ReplayLast: 5,
	})
	if err != nil {
		t.Fatalf("subscribe: %v", err)
	}
	received := make(chan *pluginv1.InboundMessage, 4)
	go func() {
		for {
			delivery, err := stream.Recv()
			if err != nil {
				close(received)
				return
			}
			received <- delivery.GetMessage()
		}
	}()

	awaitMessage := func(want string) *pluginv1.InboundMessage {
		t.Helper()
		deadline := time.After(5 * time.Second)
		for {
			select {
			case message, ok := <-received:
				if !ok {
					t.Fatalf("stream closed while waiting for %q", want)
				}
				if message.GetText() == want {
					return message
				}
			case <-deadline:
				t.Fatalf("subscriber never received %q", want)
			}
		}
	}

	first, err := core.PublishInboundMessage(tokenCtx(reg.Token(publisherID)),
		&corev1.PublishInboundMessageRequest{CallerId: "life", Message: inbound("qq-1", "group:1", "hello", true)})
	if err != nil {
		t.Fatalf("publish: %v", err)
	}
	if !first.GetAccepted() {
		t.Fatalf("publish refused: %s", first.GetError())
	}
	// The gate denied, so the assistant must not process a message the wake
	// rule would otherwise have handed it.
	if first.GetShouldProcess() {
		t.Fatal("a denying gate must veto the assistant")
	}
	if first.GetDecidedBy() != "gate-plugin" {
		t.Fatalf("expected the gate to be credited, got %q", first.GetDecidedBy())
	}
	if message := awaitMessage("hello"); message.GetAdapterId() != "qq-1" {
		t.Fatalf("unexpected delivery: %+v", message)
	}

	// Now that the subscription is provably live, the second publish must fan
	// out synchronously.
	second, err := core.PublishInboundMessage(tokenCtx(reg.Token(publisherID)),
		&corev1.PublishInboundMessageRequest{CallerId: "life", Message: inbound("qq-1", "group:1", "world", true)})
	if err != nil {
		t.Fatalf("publish: %v", err)
	}
	if second.GetDelivered() != 1 {
		t.Fatalf("expected 1 live delivery, got %d", second.GetDelivered())
	}
	awaitMessage("world")

	// An abstaining gate leaves the publisher's own wake verdict standing.
	abstaining := &fakeGate{action: "abstain"}
	messagingPlugin(t, reg, "abstaining-gate", startGate(t, abstaining), &pluginv1.PluginMessages{
		ReadMode: "all", ReadAdapters: []string{"*"}, Gate: true,
	})

	quiet, err := core.PublishInboundMessage(tokenCtx(reg.Token(publisherID)),
		&corev1.PublishInboundMessageRequest{CallerId: "life", Message: inbound("qq-1", "group:1", "chatter", false)})
	if err != nil {
		t.Fatalf("publish: %v", err)
	}
	if quiet.GetShouldProcess() {
		t.Fatal("a non-wake message should not be forced through by abstaining gates")
	}
	_ = gateID
}

// An unauthenticated caller must be refused: naming yourself is not identity.
func TestMessaging_UnauthenticatedCallerIsRefused(t *testing.T) {
	reg := registry.NewRegistry()
	reg.SetSecret([]byte("integration-secret"))
	messagingPlugin(t, reg, "life", "127.0.0.1:1", &pluginv1.PluginMessages{
		PublishAdapters: []string{"qq-1"},
	})

	_, address := startCore(t, reg)
	core := corev1.NewCoreServiceClient(dialCore(t, address))

	_, err := core.PublishInboundMessage(context.Background(),
		&corev1.PublishInboundMessageRequest{CallerId: "life", Message: inbound("qq-1", "group:1", "hi", true)})
	if err == nil {
		t.Fatal("a call with no service token must be refused")
	}
}

// Reporting on an adapter the plugin never claimed is refused, and counted, so
// a misconfigured manifest is visible rather than silent.
func TestMessaging_PublishOutsideDeclaredAdaptersIsRefused(t *testing.T) {
	reg := registry.NewRegistry()
	reg.SetSecret([]byte("integration-secret"))
	publisherID := messagingPlugin(t, reg, "life", "127.0.0.1:1", &pluginv1.PluginMessages{
		PublishAdapters: []string{"qq-1"},
	})

	instance, address := startCore(t, reg)
	core := corev1.NewCoreServiceClient(dialCore(t, address))

	resp, err := core.PublishInboundMessage(tokenCtx(reg.Token(publisherID)),
		&corev1.PublishInboundMessageRequest{CallerId: "life", Message: inbound("qq-OTHER", "group:1", "hi", true)})
	if err != nil {
		t.Fatalf("publish: %v", err)
	}
	if resp.GetAccepted() {
		t.Fatal("publishing for an undeclared adapter must be refused")
	}
	if resp.GetError() == "" {
		t.Fatal("the refusal should explain itself")
	}
	if got := instance.MessagingStats().Rejected; got != 1 {
		t.Fatalf("expected the refusal to be counted, got %d", got)
	}
}

// A plugin that declared no read_mode cannot subscribe — declaring nothing must
// not quietly mean "everything".
func TestMessaging_SubscribeWithoutReadModeIsDenied(t *testing.T) {
	reg := registry.NewRegistry()
	reg.SetSecret([]byte("integration-secret"))
	quietID := messagingPlugin(t, reg, "quiet", "127.0.0.1:1", &pluginv1.PluginMessages{})

	_, address := startCore(t, reg)
	core := corev1.NewCoreServiceClient(dialCore(t, address))

	stream, err := core.SubscribeMessages(tokenCtx(reg.Token(quietID)),
		&corev1.SubscribeMessagesRequest{CallerId: "quiet"})
	if err == nil {
		if _, recvErr := stream.Recv(); recvErr == nil {
			t.Fatal("a plugin without read_mode must not receive messages")
		}
	}
}

// Sending through an adapter outside send_adapters is refused.
func TestMessaging_SendOutsideDeclaredAdaptersIsRefused(t *testing.T) {
	reg := registry.NewRegistry()
	reg.SetSecret([]byte("integration-secret"))
	senderID := messagingPlugin(t, reg, "sender", "127.0.0.1:1", &pluginv1.PluginMessages{
		SendAdapters: []string{"qq-1"},
	})

	_, address := startCore(t, reg)
	core := corev1.NewCoreServiceClient(dialCore(t, address))

	resp, err := core.SendMessage(tokenCtx(reg.Token(senderID)), &corev1.SendMessageRequest{
		CallerId: "sender", AdapterId: "qq-1", Conversation: "group:1", Text: "hi",
	})
	if err != nil {
		t.Fatalf("send: %v", err)
	}
	// The adapter was declared but no plugin has claimed it, so the send cannot
	// be routed — the refusal must say so rather than silently succeed.
	if resp.GetSuccess() {
		t.Fatal("sending through an unclaimed adapter must not report success")
	}
	if resp.GetError() == "" {
		t.Fatal("the refusal should explain itself")
	}

	undeclared, err := core.SendMessage(tokenCtx(reg.Token(senderID)), &corev1.SendMessageRequest{
		CallerId: "sender", AdapterId: "qq-OTHER", Conversation: "group:1", Text: "hi",
	})
	if err != nil {
		t.Fatalf("send: %v", err)
	}
	if undeclared.GetSuccess() {
		t.Fatal("sending through an undeclared adapter must be refused")
	}
}
