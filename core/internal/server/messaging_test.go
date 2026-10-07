package server

import (
	"context"
	"net"
	"sync/atomic"
	"testing"

	"0kay/core/internal/messaging"
	"0kay/core/internal/registry"
	pluginv1 "0kay/gen/plugin/v1"

	"google.golang.org/grpc"
)

// fakeGate is a MessageService that only implements DecideInbound, so the
// arbitration rules can be exercised without a real plugin.
type fakeGate struct {
	pluginv1.UnimplementedMessageServiceServer
	action string
	reason string
	calls  int32
}

func (f *fakeGate) DecideInbound(context.Context, *pluginv1.DecideInboundRequest) (*pluginv1.DecideInboundResponse, error) {
	atomic.AddInt32(&f.calls, 1)
	return &pluginv1.DecideInboundResponse{Action: f.action, Reason: f.reason}, nil
}

// startGate serves a fake gate on a loopback port and returns its address.
func startGate(t *testing.T, gate *fakeGate) string {
	t.Helper()
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	server := grpc.NewServer()
	pluginv1.RegisterMessageServiceServer(server, gate)
	go func() { _ = server.Serve(listener) }()
	t.Cleanup(server.Stop)
	return listener.Addr().String()
}

// registerGate adds a messaging-capable gate plugin with the given messaging
// permissions and returns the server under test.
func registerGate(t *testing.T, gate *fakeGate, perms *pluginv1.PluginMessages) *CoreServiceServer {
	t.Helper()
	reg := registry.NewRegistry()
	address := startGate(t, gate)
	info := &pluginv1.PluginInfo{
		Name:       "gate-plugin",
		Version:    "1.0.0",
		PluginType: pluginv1.PluginType_PLUGIN_TYPE_MESSAGING,
		Permissions: &pluginv1.PluginPermission{
			Messages: perms,
		},
	}
	if _, err := reg.Register(info, []string{"messaging"}, address); err != nil {
		t.Fatalf("register gate: %v", err)
	}
	return NewCoreServiceServer(reg, t.TempDir())
}

func wakeMsg() *pluginv1.InboundMessage {
	return &pluginv1.InboundMessage{
		AdapterId: "qq-1", Conversation: "group:1", Kind: "group", Text: "hi", IsWake: true,
	}
}

// With no gate installed, arbitration must return the publisher's own wake
// verdict and spend no RPC — this is the zero-configuration path.
func TestArbitrate_NoGatesFallsBackToWakeFlag(t *testing.T) {
	server := NewCoreServiceServer(registry.NewRegistry(), t.TempDir())
	ctx := context.Background()

	if got := server.arbitrate(ctx, wakeMsg()); !got.ShouldProcess {
		t.Fatal("a wake message should process when no gate objects")
	}
	quiet := wakeMsg()
	quiet.IsWake = false
	if got := server.arbitrate(ctx, quiet); got.ShouldProcess {
		t.Fatal("a non-wake message should not process when no gate objects")
	}
}

// A deny is a hard veto: it must win even though the message is a wake message
// L.I.F.E would otherwise have answered.
func TestArbitrate_DenyVetoesAWakeMessage(t *testing.T) {
	gate := &fakeGate{action: "deny", reason: "muted by policy"}
	server := registerGate(t, gate, &pluginv1.PluginMessages{
		ReadMode: "all", ReadAdapters: []string{"*"}, Gate: true,
	})

	got := server.arbitrate(context.Background(), wakeMsg())
	if got.ShouldProcess {
		t.Fatal("deny must stop the assistant from processing")
	}
	if got.Action != messaging.GateDeny || got.DecidedBy != "gate-plugin" {
		t.Fatalf("expected a deny attributed to gate-plugin, got %+v", got)
	}
	if got.Reason != "muted by policy" {
		t.Fatalf("reason should be surfaced, got %q", got.Reason)
	}
}

// An allow can force processing of a message the wake rule skipped, which is
// what lets a gate pull something into the assistant's attention.
func TestArbitrate_AllowForcesANonWakeMessage(t *testing.T) {
	gate := &fakeGate{action: "allow", reason: "mentions an open incident"}
	server := registerGate(t, gate, &pluginv1.PluginMessages{
		ReadMode: "all", ReadAdapters: []string{"*"}, Gate: true,
	})

	quiet := wakeMsg()
	quiet.IsWake = false
	if got := server.arbitrate(context.Background(), quiet); !got.ShouldProcess {
		t.Fatal("allow should force processing")
	}
}

// Abstain leaves the wake verdict untouched in both directions.
func TestArbitrate_AbstainDefersToWakeFlag(t *testing.T) {
	gate := &fakeGate{action: "abstain"}
	server := registerGate(t, gate, &pluginv1.PluginMessages{
		ReadMode: "all", ReadAdapters: []string{"*"}, Gate: true,
	})
	ctx := context.Background()

	if got := server.arbitrate(ctx, wakeMsg()); !got.ShouldProcess {
		t.Fatal("abstain should leave a wake message processing")
	}
	quiet := wakeMsg()
	quiet.IsWake = false
	if got := server.arbitrate(ctx, quiet); got.ShouldProcess {
		t.Fatal("abstain should leave a non-wake message skipped")
	}
}

// A gate is only consulted for traffic its own read scope covers, so it cannot
// influence conversations it is not allowed to see.
func TestArbitrate_GateScopedToItsReadableAdapters(t *testing.T) {
	gate := &fakeGate{action: "deny"}
	server := registerGate(t, gate, &pluginv1.PluginMessages{
		ReadMode: "all", ReadAdapters: []string{"other-adapter"}, Gate: true,
	})

	if got := server.arbitrate(context.Background(), wakeMsg()); !got.ShouldProcess {
		t.Fatal("a gate must not veto an adapter outside its read scope")
	}
	if calls := atomic.LoadInt32(&gate.calls); calls != 0 {
		t.Fatalf("out-of-scope gate should not be called, got %d calls", calls)
	}
}

// A gate that cannot answer falls back to its declared gate_on_error. The
// default is fail-open so a crashed gate cannot mute the assistant forever.
func TestArbitrate_UnreachableGateAbstainsByDefault(t *testing.T) {
	gate := &fakeGate{action: "deny"}
	server := registerGate(t, gate, &pluginv1.PluginMessages{
		ReadMode: "all", ReadAdapters: []string{"*"}, Gate: true,
	})

	// A cancelled context makes the gate call fail immediately instead of
	// waiting out gateDecisionTimeout.
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	if got := server.arbitrate(ctx, wakeMsg()); !got.ShouldProcess {
		t.Fatal("an unreachable gate should abstain, leaving the wake verdict in place")
	}
}

// A gate that declared gate_on_error "deny" keeps its veto even while down —
// the right default for moderation, and the reason the knob exists.
func TestArbitrate_UnreachableGateKeepsDeclaredDeny(t *testing.T) {
	gate := &fakeGate{action: "allow"}
	server := registerGate(t, gate, &pluginv1.PluginMessages{
		ReadMode: "all", ReadAdapters: []string{"*"}, Gate: true, GateOnError: "deny",
	})

	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	if got := server.arbitrate(ctx, wakeMsg()); got.ShouldProcess {
		t.Fatal("gate_on_error=deny must veto when the gate cannot answer")
	}
}

// The combination rule: a veto is not overridable by another plugin's allow, so
// the outcome cannot depend on which gate happened to be consulted last.
func TestArbitrate_DenyBeatsAllow(t *testing.T) {
	deny := &fakeGate{action: "deny", reason: "blocked"}
	server := registerGate(t, deny, &pluginv1.PluginMessages{
		ReadMode: "all", ReadAdapters: []string{"*"}, Gate: true,
	})

	// A second, permissive gate on the same registry.
	allow := &fakeGate{action: "allow"}
	address := startGate(t, allow)
	if _, err := server.registry.Register(&pluginv1.PluginInfo{
		Name:       "permissive-gate",
		Version:    "1.0.0",
		PluginType: pluginv1.PluginType_PLUGIN_TYPE_MESSAGING,
		Permissions: &pluginv1.PluginPermission{Messages: &pluginv1.PluginMessages{
			ReadMode: "all", ReadAdapters: []string{"*"}, Gate: true,
		}},
	}, []string{"messaging"}, address); err != nil {
		t.Fatalf("register second gate: %v", err)
	}

	got := server.arbitrate(context.Background(), wakeMsg())
	if got.ShouldProcess {
		t.Fatal("a deny must not be cancelled by another gate's allow")
	}
	if got.Action != messaging.GateDeny {
		t.Fatalf("expected deny to win, got %q", got.Action)
	}
}

// A plugin that declared no gate is never consulted, even if it is otherwise
// messaging-capable.
func TestGatePlugins_IgnoresPluginsWithoutTheGatePermission(t *testing.T) {
	gate := &fakeGate{action: "deny"}
	server := registerGate(t, gate, &pluginv1.PluginMessages{
		ReadMode: "all", ReadAdapters: []string{"*"},
	})
	if got := server.gatePlugins(wakeMsg()); len(got) != 0 {
		t.Fatalf("expected no gates, got %d", len(got))
	}
}

func TestMessagingCapable_RequiresCapabilityOrType(t *testing.T) {
	plain := &registry.PluginInstance{Address: "127.0.0.1:1", Info: &pluginv1.PluginInfo{Name: "plain"}}
	if messagingCapable(plain) {
		t.Fatal("a plugin with neither the capability nor the type is not messaging-capable")
	}
	plain.Capabilities = []string{"messaging"}
	if !messagingCapable(plain) {
		t.Fatal("the messaging capability should mark a plugin as messaging-capable")
	}
	typed := &registry.PluginInstance{Address: "127.0.0.1:1", Info: &pluginv1.PluginInfo{
		Name: "typed", PluginType: pluginv1.PluginType_PLUGIN_TYPE_ADAPTER,
	}}
	if !messagingCapable(typed) {
		t.Fatal("an adapter plugin type should be messaging-capable")
	}
	noAddress := &registry.PluginInstance{Info: &pluginv1.PluginInfo{
		Name: "n", PluginType: pluginv1.PluginType_PLUGIN_TYPE_MESSAGING,
	}}
	if messagingCapable(noAddress) {
		t.Fatal("a plugin with no callback address cannot be called")
	}
}
