package messaging

import (
	"testing"
	"time"

	pluginv1 "0kay/gen/plugin/v1"
)

func msg(adapter, conversation string, wake bool) *pluginv1.InboundMessage {
	kind := "group"
	if len(conversation) > 8 && conversation[:8] == "private:" {
		kind = "private"
	}
	return &pluginv1.InboundMessage{
		AdapterId:    adapter,
		Conversation: conversation,
		Kind:         kind,
		Text:         "hi",
		IsWake:       wake,
	}
}

// A plugin that never mentions messaging must be able to do nothing. This is
// the default that keeps a manifest omission from becoming a privacy leak.
func TestScopeFrom_NilPermissionsDeniesEverything(t *testing.T) {
	scope := ScopeFrom("third-party", false, nil)
	if scope.CanReadAny() {
		t.Fatalf("read_mode should default to %q, got %q", ReadNone, scope.ReadMode)
	}
	if scope.CanRead(msg("a", "group:1", true)) {
		t.Fatal("nil permissions must not read")
	}
	if scope.CanSend("a") {
		t.Fatal("nil permissions must not send")
	}
	if scope.CanPublish("a") {
		t.Fatal("nil permissions must not publish")
	}
}

// Trusted plugins get the wildcard for the adapter lists, but NOT a read mode:
// being first-party must not silently subscribe a component to every message.
func TestScopeFrom_TrustedWidensListsButNotReadMode(t *testing.T) {
	scope := ScopeFrom("life", true, &pluginv1.PluginMessages{})
	if scope.ReadMode != ReadNone {
		t.Fatalf("trusted plugin without read_mode should still read nothing, got %q", scope.ReadMode)
	}
	if !scope.CanPublish("any-adapter") {
		t.Fatal("trusted plugin should get a wildcard publish list")
	}

	reading := ScopeFrom("life", true, &pluginv1.PluginMessages{ReadMode: ReadAll})
	if !reading.CanRead(msg("any-adapter", "group:1", false)) {
		t.Fatal("trusted plugin declaring read_mode all should read any adapter")
	}
}

// A third-party plugin that declares nothing beyond a read mode must not fall
// through to "all adapters": the lists have to be enumerated explicitly.
func TestScopeFrom_ThirdPartyMustEnumerateAdapters(t *testing.T) {
	scope := ScopeFrom("plugin", false, &pluginv1.PluginMessages{ReadMode: ReadAll})
	if scope.CanRead(msg("some-adapter", "group:1", false)) {
		t.Fatal("empty read_adapters must mean none for a third-party plugin")
	}
	scoped := ScopeFrom("plugin", false, &pluginv1.PluginMessages{
		ReadMode:     ReadAll,
		ReadAdapters: []string{"qq-1"},
	})
	if scoped.CanRead(msg("qq-2", "group:1", false)) {
		t.Fatal("must not read an adapter outside read_adapters")
	}
	if !scoped.CanRead(msg("qq-1", "group:1", false)) {
		t.Fatal("should read a declared adapter")
	}
}

func TestCanRead_WakeModeOnlySeesWakeMessages(t *testing.T) {
	scope := ScopeFrom("plugin", false, &pluginv1.PluginMessages{
		ReadMode:     ReadWake,
		ReadAdapters: []string{Wildcard},
	})
	if scope.CanRead(msg("a", "group:1", false)) {
		t.Fatal("wake mode must not deliver a non-wake message")
	}
	if !scope.CanRead(msg("a", "group:1", true)) {
		t.Fatal("wake mode must deliver a wake message")
	}
}

func TestCanRead_ConversationFilter(t *testing.T) {
	scope := ScopeFrom("plugin", false, &pluginv1.PluginMessages{
		ReadMode:          ReadAll,
		ReadAdapters:      []string{Wildcard},
		ReadConversations: []string{"group:42"},
	})
	if scope.CanRead(msg("a", "group:41", false)) {
		t.Fatal("must not read a conversation outside read_conversations")
	}
	if !scope.CanRead(msg("a", "group:42", false)) {
		t.Fatal("should read a declared conversation")
	}
}

func TestCanGate_RequiresGateAndReadAccess(t *testing.T) {
	base := &pluginv1.PluginMessages{ReadMode: ReadAll, ReadAdapters: []string{Wildcard}}
	if ScopeFrom("p", false, base).CanGate(msg("a", "group:1", true)) {
		t.Fatal("gate must be off unless declared")
	}
	base.Gate = true
	if !ScopeFrom("p", false, base).CanGate(msg("a", "group:1", true)) {
		t.Fatal("declared gate with read access should arbitrate")
	}
	// A gate that cannot read the adapter must not be consulted for it.
	narrow := &pluginv1.PluginMessages{Gate: true, ReadMode: ReadAll, ReadAdapters: []string{"other"}}
	if ScopeFrom("p", false, narrow).CanGate(msg("a", "group:1", true)) {
		t.Fatal("gate must not arbitrate an adapter it cannot read")
	}
}

func TestGateOnError_DefaultsToAbstain(t *testing.T) {
	if got := ScopeFrom("p", false, &pluginv1.PluginMessages{Gate: true}).GateOnError; got != GateAbstain {
		t.Fatalf("default gate_on_error should be %q, got %q", GateAbstain, got)
	}
	if got := ScopeFrom("p", false, &pluginv1.PluginMessages{Gate: true, GateOnError: "DENY"}).GateOnError; got != GateDeny {
		t.Fatalf("gate_on_error deny should survive normalisation, got %q", got)
	}
}

// An unknown verdict must land on the neutral value, not on allow (which would
// hand a typo the power to force processing) and not on deny (which would let a
// typo mute the assistant).
func TestNormaliseGateAction_UnknownIsAbstain(t *testing.T) {
	for _, in := range []string{"", "maybe", "ALLOWED", "true"} {
		if got := NormaliseGateAction(in); got != GateAbstain {
			t.Fatalf("NormaliseGateAction(%q) = %q, want %q", in, got, GateAbstain)
		}
	}
	if got := NormaliseGateAction(" Deny "); got != GateDeny {
		t.Fatalf("expected deny, got %q", got)
	}
}

func TestPublish_FansOutOnlyToMatchingSubscribers(t *testing.T) {
	bus := NewBus()
	all := bus.Subscribe(ScopeFrom("all-reader", false, &pluginv1.PluginMessages{
		ReadMode: ReadAll, ReadAdapters: []string{Wildcard},
	}), 0)
	defer bus.Unsubscribe(all)
	wakeOnly := bus.Subscribe(ScopeFrom("wake-reader", false, &pluginv1.PluginMessages{
		ReadMode: ReadWake, ReadAdapters: []string{Wildcard},
	}), 0)
	defer bus.Unsubscribe(wakeOnly)

	if delivered := bus.Publish(msg("qq-1", "group:1", true), "life"); delivered != 2 {
		t.Fatalf("wake message should reach both subscribers, got %d", delivered)
	}
	if delivered := bus.Publish(msg("qq-1", "group:1", false), "life"); delivered != 1 {
		t.Fatalf("non-wake message should reach only the all-reader, got %d", delivered)
	}

	if got := len(all.C()); got != 2 {
		t.Fatalf("all-reader should have 2 queued, got %d", got)
	}
	if got := len(wakeOnly.C()); got != 1 {
		t.Fatalf("wake-reader should have 1 queued, got %d", got)
	}
}

// The publisher owns the adapter it reported on, which is what makes a later
// SendMessage routable back to it.
func TestPublish_ClaimsAdapterOwnershipAndLearnsConversations(t *testing.T) {
	bus := NewBus()
	bus.Publish(msg("qq-1", "group:100", true), "life")

	owner, ok := bus.Owner("qq-1")
	if !ok || owner != "life" {
		t.Fatalf("expected life to own qq-1, got %q ok=%v", owner, ok)
	}
	adapter, ok := bus.Adapter("qq-1")
	if !ok {
		t.Fatal("adapter should be recorded")
	}
	if _, ok := adapter.Conversations["group:100"]; !ok {
		t.Fatalf("expected group:100 to be learned, got %v", adapter.Conversations)
	}
}

// A different plugin must not be able to steal an adapter by reporting on it.
func TestPublish_DoesNotStealOwnership(t *testing.T) {
	bus := NewBus()
	bus.Publish(msg("qq-1", "group:1", true), "life")
	bus.Publish(msg("qq-1", "group:1", true), "impostor")

	if owner, _ := bus.Owner("qq-1"); owner != "life" {
		t.Fatalf("ownership should stay with the first reporter, got %q", owner)
	}
}

func TestRegisterAdapter_AddsConversationsForDiscovery(t *testing.T) {
	bus := NewBus()
	bus.RegisterAdapter("life", &pluginv1.AdapterDescriptor{
		AdapterId: "qq-1", Platform: "onebot", Name: "bot",
		Conversations: []*pluginv1.AdapterConversation{{Conversation: "group:7", Kind: "group", Name: "dev"}},
	})
	adapter, ok := bus.Adapter("qq-1")
	if !ok {
		t.Fatal("adapter should exist after registration")
	}
	if adapter.Platform != "onebot" || adapter.Name != "bot" {
		t.Fatalf("descriptor fields not applied: %+v", adapter)
	}
	if _, ok := adapter.Conversations["group:7"]; !ok {
		t.Fatal("declared conversation should be listed")
	}
	if owner, _ := bus.Owner("qq-1"); owner != "life" {
		t.Fatalf("expected life owner, got %q", owner)
	}
}

// A wedged subscriber must lose messages, not stall the bus. The drop is
// counted so the loss is visible rather than silent.
func TestPublish_DropsForSlowSubscriberInsteadOfBlocking(t *testing.T) {
	bus := NewBus()
	sub := bus.Subscribe(ScopeFrom("slow", false, &pluginv1.PluginMessages{
		ReadMode: ReadAll, ReadAdapters: []string{Wildcard},
	}), 0)
	defer bus.Unsubscribe(sub)

	done := make(chan struct{})
	go func() {
		defer close(done)
		for i := 0; i < DefaultQueueDepth+50; i++ {
			bus.Publish(msg("qq-1", "group:1", true), "life")
		}
	}()
	select {
	case <-done:
	case <-time.After(5 * time.Second):
		t.Fatal("Publish blocked on a full subscriber queue")
	}

	stats := bus.Stats()
	if stats.Dropped == 0 {
		t.Fatal("expected overflow to be counted as dropped")
	}
	if got := len(sub.C()); got != DefaultQueueDepth {
		t.Fatalf("queue should be full at %d, got %d", DefaultQueueDepth, got)
	}
}

func TestUnsubscribe_ClosesChannelAndIsIdempotent(t *testing.T) {
	bus := NewBus()
	sub := bus.Subscribe(ScopeFrom("p", false, &pluginv1.PluginMessages{
		ReadMode: ReadAll, ReadAdapters: []string{Wildcard},
	}), 0)
	bus.Unsubscribe(sub)
	bus.Unsubscribe(sub) // must not panic on a double close

	if _, ok := <-sub.C(); ok {
		t.Fatal("channel should be closed")
	}
	if bus.Stats().Subscribers != 0 {
		t.Fatalf("expected no subscribers, got %d", bus.Stats().Subscribers)
	}
}

func TestSubscribe_ReplaysRecentMatchingMessages(t *testing.T) {
	bus := NewBus()
	bus.Publish(msg("qq-1", "group:1", true), "life")
	bus.Publish(msg("qq-1", "group:2", true), "life")
	bus.Publish(msg("qq-2", "group:3", true), "life")

	sub := bus.Subscribe(ScopeFrom("p", false, &pluginv1.PluginMessages{
		ReadMode: ReadAll, ReadAdapters: []string{"qq-1"},
	}), 5)
	defer bus.Unsubscribe(sub)

	if got := len(sub.C()); got != 2 {
		t.Fatalf("replay should be scoped to the allowed adapter, got %d", got)
	}
}

// Disabling a plugin must take its subscriptions and its adapter ownership with
// it, or Core keeps handing sends to a process that will never deliver them.
func TestDropPlugin_RemovesSubscriptionsAndOwnedAdapters(t *testing.T) {
	bus := NewBus()
	sub := bus.Subscribe(ScopeFrom("life", false, &pluginv1.PluginMessages{
		ReadMode: ReadAll, ReadAdapters: []string{Wildcard},
	}), 0)
	bus.Publish(msg("qq-1", "group:1", true), "life")

	bus.DropPlugin("life")

	if bus.Stats().Subscribers != 0 {
		t.Fatalf("subscription should be gone, got %d", bus.Stats().Subscribers)
	}
	if _, ok := bus.Owner("qq-1"); ok {
		t.Fatal("adapter ownership should be released")
	}
	// The channel is closed, but the message published before the drop is still
	// buffered, so drain until the close is actually observed.
	drained := 0
	for range sub.C() {
		drained++
	}
	if drained != 1 {
		t.Fatalf("expected the one buffered message then a close, drained %d", drained)
	}
}

func TestPublish_IgnoresMessagesWithoutAdapterOrConversationIdentity(t *testing.T) {
	bus := NewBus()
	if n := bus.Publish(nil, "life"); n != 0 {
		t.Fatalf("nil message should not publish, got %d", n)
	}
	if n := bus.Publish(&pluginv1.InboundMessage{Conversation: "group:1"}, "life"); n != 0 {
		t.Fatalf("message without adapter_id should not publish, got %d", n)
	}
	if bus.Stats().Published != 0 {
		t.Fatalf("nothing should have been counted as published, got %d", bus.Stats().Published)
	}
}
