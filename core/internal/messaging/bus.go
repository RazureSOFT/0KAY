// Package messaging is Core's chat-message bus.
//
// The bus exists so that "reach the assistant where you already are" stops
// being a L.I.F.E-internal feature. Adapter plugins — L.I.F.E for QQ/OneBot
// today, a third-party bridge tomorrow — report every message they observe with
// CoreService.PublishInboundMessage; the bus fans it out to every subscriber
// whose declared permissions cover it, and routes outbound sends back to the
// adapter's owning plugin.
//
// Two properties matter more than throughput here:
//
//  1. A subscriber can never see more than it declared. Filtering happens on
//     the publish path, from the subscriber's own PluginMessages, so a bug in a
//     plugin cannot widen its own view.
//  2. A slow or wedged subscriber can never stall the bus. Each subscription
//     owns a bounded queue and delivery is a non-blocking send; overflow drops
//     the message for that subscriber and is counted, rather than applying
//     back-pressure to the adapter's read loop.
package messaging

import (
	"sort"
	"strings"
	"sync"

	pluginv1 "0kay/gen/plugin/v1"
)

// Read modes a plugin may declare in PluginMessages.read_mode.
const (
	// ReadNone receives nothing. It is also the meaning of an empty value, so
	// a plugin that never mentions messaging stays silent by default.
	ReadNone = "none"
	// ReadWake receives only messages that already matched a wake rule
	// (@-mention of the bot, a configured keyword, a continuing topic) — the
	// same traffic the bot was going to act on anyway.
	ReadWake = "wake"
	// ReadAll receives every message on the adapters it is allowed to read.
	ReadAll = "all"
)

// Wildcard matches every adapter or conversation.
const Wildcard = "*"

// DefaultQueueDepth bounds one subscriber's pending deliveries. A subscriber
// that falls further behind than this starts losing messages (counted in
// Stats.Dropped) instead of slowing the bus down.
const DefaultQueueDepth = 256

// replayDepth bounds the recent-message ring used by SubscribeMessages'
// replay_last, so a reconnect can catch up without unbounded memory.
const replayDepth = 64

// Scope is one plugin's permission-filtered view of the bus. It is derived from
// the plugin's registered PluginMessages and never mutated afterwards.
type Scope struct {
	// Plugin is the subscriber's registered plugin name.
	Plugin string

	// Trusted marks a first-party / built-in plugin. Trusted plugins may use
	// the wildcard lists without enumerating them: an empty adapter list means
	// "all" for them, where a third-party plugin would mean "none".
	Trusted bool

	// ReadMode is ReadNone, ReadWake or ReadAll.
	ReadMode string

	// ReadAdapters / ReadConversations narrow what ReadMode lets through.
	// Empty means none for a third-party plugin, all for a trusted one.
	ReadAdapters      []string
	ReadConversations []string

	// SendAdapters lists the adapters this plugin may send through.
	SendAdapters []string

	// PublishAdapters lists the adapters this plugin may report inbound
	// messages for. Claiming an adapter is also what makes Core route its
	// outbound sends back to the claiming plugin.
	PublishAdapters []string

	// Gate is true when the plugin asked to arbitrate inbound messages before
	// the default assistant processes them.
	Gate bool

	// GateOnError is the verdict Core assumes when the plugin cannot answer:
	// GateAbstain (default) or GateDeny.
	GateOnError string
}

// Gate verdicts, as declared in PluginMessages.gate_on_error and returned by
// MessageService.DecideInbound.
const (
	// GateAbstain has no opinion: the publisher's own wake rule decides.
	GateAbstain = "abstain"
	// GateAllow asks for the message to be processed, and can force one the
	// publisher's wake rule would have skipped.
	GateAllow = "allow"
	// GateDeny is a hard veto: the assistant must not process the message.
	GateDeny = "deny"
)

// NormaliseGateAction maps an arbitrary verdict string onto the three known
// actions, defaulting to abstain. An unrecognised verdict must not be read as
// consent — or as a veto — so it falls back to the neutral value.
func NormaliseGateAction(action string) string {
	switch strings.ToLower(strings.TrimSpace(action)) {
	case GateAllow:
		return GateAllow
	case GateDeny:
		return GateDeny
	default:
		return GateAbstain
	}
}

// ScopeFrom builds a Scope from a plugin's registration data. A nil
// PluginMessages — the common case for plugins that never mention messaging —
// yields a scope that can neither read nor send.
func ScopeFrom(plugin string, trusted bool, p *pluginv1.PluginMessages) Scope {
	s := Scope{Plugin: plugin, Trusted: trusted, ReadMode: ReadNone}
	if p == nil {
		return s
	}
	switch strings.ToLower(strings.TrimSpace(p.GetReadMode())) {
	case ReadAll:
		s.ReadMode = ReadAll
	case ReadWake:
		s.ReadMode = ReadWake
	default:
		s.ReadMode = ReadNone
	}
	s.ReadAdapters = normaliseList(p.GetReadAdapters(), trusted)
	s.ReadConversations = normaliseList(p.GetReadConversations(), trusted)
	s.SendAdapters = normaliseList(p.GetSendAdapters(), trusted)
	s.PublishAdapters = normaliseList(p.GetPublishAdapters(), trusted)
	s.Gate = p.GetGate()
	if NormaliseGateAction(p.GetGateOnError()) == GateDeny {
		s.GateOnError = GateDeny
	} else {
		s.GateOnError = GateAbstain
	}
	return s
}

// CanGate reports whether this plugin is consulted for msg. A gate is only
// asked about messages it could itself read: arbitrating traffic you are not
// allowed to see would let a plugin influence conversations it has no business
// knowing about.
func (s Scope) CanGate(msg *pluginv1.InboundMessage) bool {
	return s.Gate && s.CanRead(msg)
}

// normaliseList trims entries and drops blanks. An empty list widens to the
// wildcard for trusted plugins only: the platform's own components should not
// have to enumerate every adapter they drive, but a third-party plugin that
// declared nothing must stay denied.
func normaliseList(in []string, trusted bool) []string {
	out := make([]string, 0, len(in))
	for _, v := range in {
		v = strings.TrimSpace(v)
		if v != "" {
			out = append(out, v)
		}
	}
	if len(out) == 0 && trusted {
		return []string{Wildcard}
	}
	return out
}

// CanRead reports whether msg may be delivered to this scope.
func (s Scope) CanRead(msg *pluginv1.InboundMessage) bool {
	if msg == nil {
		return false
	}
	switch s.ReadMode {
	case ReadAll:
		// every message on the allowed adapters
	case ReadWake:
		// Only the traffic the bot was already going to act on. This is the
		// default-shaped grant: it exposes nothing the user did not address to
		// the bot.
		if !msg.GetIsWake() {
			return false
		}
	default:
		return false
	}
	if !matches(s.ReadAdapters, msg.GetAdapterId()) {
		return false
	}
	if len(s.ReadConversations) > 0 && !matches(s.ReadConversations, msg.GetConversation()) {
		return false
	}
	return true
}

// CanSend reports whether this scope may send through adapter.
func (s Scope) CanSend(adapter string) bool {
	return matches(s.SendAdapters, adapter)
}

// CanPublish reports whether this scope may report inbound messages for
// adapter.
func (s Scope) CanPublish(adapter string) bool {
	return matches(s.PublishAdapters, adapter)
}

// MayReadAdapter reports whether adapter is readable at all, ignoring the
// per-message wake filter. ListAdapters uses it to tell a plugin which adapters
// it could subscribe to.
func (s Scope) MayReadAdapter(adapter string) bool {
	if s.ReadMode == ReadNone {
		return false
	}
	return matches(s.ReadAdapters, adapter)
}

// matches reports whether value is covered by list. An empty list covers
// nothing; the wildcard covers everything.
func matches(list []string, value string) bool {
	for _, entry := range list {
		if entry == Wildcard || entry == value {
			return true
		}
	}
	return false
}

// Adapter is one adapter instance the bus knows about.
type Adapter struct {
	// ID is the stable adapter instance id.
	ID string
	// Platform is the platform family ("onebot", "bilibili", …).
	Platform string
	// Name is the instance's display name.
	Name string
	// Owner is the plugin that reported messages for this adapter and
	// therefore receives its outbound sends.
	Owner string
	// Conversations are the conversations seen on (or advertised by) this
	// adapter, keyed by the "group:<id>" / "private:<id>" addressing key.
	Conversations map[string]*pluginv1.AdapterConversation
}

// Clone returns a copy safe to hand to a caller.
func (a *Adapter) Clone() *Adapter {
	if a == nil {
		return nil
	}
	out := &Adapter{ID: a.ID, Platform: a.Platform, Name: a.Name, Owner: a.Owner,
		Conversations: make(map[string]*pluginv1.AdapterConversation, len(a.Conversations))}
	for k, v := range a.Conversations {
		out.Conversations[k] = &pluginv1.AdapterConversation{
			Conversation: v.GetConversation(), Kind: v.GetKind(), Name: v.GetName(),
		}
	}
	return out
}

// Subscription is one open SubscribeMessages stream.
type Subscription struct {
	scope Scope
	ch    chan *pluginv1.InboundMessage
	bus   *Bus
	once  sync.Once
}

// Scope returns the subscription's permission-filtered view.
func (s *Subscription) Scope() Scope { return s.scope }

// C is the delivery channel. It is closed by Unsubscribe.
func (s *Subscription) C() <-chan *pluginv1.InboundMessage { return s.ch }

// Stats is a snapshot of bus activity, for the console and /api/messaging.
type Stats struct {
	Subscribers int            `json:"subscribers"`
	Adapters    int            `json:"adapters"`
	Published   uint64         `json:"published"`
	Delivered   uint64         `json:"delivered"`
	Dropped     uint64         `json:"dropped"`
	Rejected    uint64         `json:"rejected"`
	ByAdapter   map[string]int `json:"by_adapter"`
}

// Bus is the message bus. The zero value is not usable; call NewBus.
type Bus struct {
	mu       sync.RWMutex
	subs     map[*Subscription]struct{}
	adapters map[string]*Adapter
	recent   []*pluginv1.InboundMessage

	published uint64
	delivered uint64
	dropped   uint64
	rejected  uint64
}

// NewBus creates an empty bus.
func NewBus() *Bus {
	return &Bus{
		subs:     make(map[*Subscription]struct{}),
		adapters: make(map[string]*Adapter),
	}
}

// Subscribe registers a subscriber. replayLast asks for up to that many of the
// most recent matching messages to be delivered immediately, so a plugin that
// reconnects can catch up; pass 0 to start from now.
func (b *Bus) Subscribe(scope Scope, replayLast int) *Subscription {
	sub := &Subscription{
		scope: scope,
		ch:    make(chan *pluginv1.InboundMessage, DefaultQueueDepth),
		bus:   b,
	}
	b.mu.Lock()
	b.subs[sub] = struct{}{}
	var replay []*pluginv1.InboundMessage
	if replayLast > 0 && scope.CanReadAny() {
		if replayLast > replayDepth {
			replayLast = replayDepth
		}
		for i := len(b.recent) - 1; i >= 0 && len(replay) < replayLast; i-- {
			if scope.CanRead(b.recent[i]) {
				replay = append(replay, b.recent[i])
			}
		}
	}
	b.mu.Unlock()

	// Oldest-first, so the subscriber replays history in order. Queued before
	// the caller can read from C, so there is no interleaving with live
	// traffic.
	for i := len(replay) - 1; i >= 0; i-- {
		sub.ch <- replay[i]
	}
	return sub
}

// CanReadAny reports whether this scope could ever receive a message. It avoids
// walking the replay ring for a subscriber that declared nothing.
func (s Scope) CanReadAny() bool { return s.ReadMode != ReadNone }

// Unsubscribe removes a subscription and closes its channel. Safe to call more
// than once and from any goroutine.
func (b *Bus) Unsubscribe(sub *Subscription) {
	if sub == nil {
		return
	}
	sub.once.Do(func() {
		b.mu.Lock()
		delete(b.subs, sub)
		b.mu.Unlock()
		close(sub.ch)
	})
}

// Publish records an inbound message and fans it out. It returns how many
// subscribers received it — zero is normal and simply means nobody declared an
// interest.
//
// The publisher claims ownership of the adapter it reported on, which is what
// later lets SendMessage route back to it. Publishers are expected to have been
// checked against Scope.CanPublish by the caller.
func (b *Bus) Publish(msg *pluginv1.InboundMessage, publisher string) int {
	if msg == nil || msg.GetAdapterId() == "" {
		return 0
	}
	b.mu.Lock()
	b.published++
	if a := b.adapters[msg.GetAdapterId()]; a != nil {
		// Re-reported by the same plugin: refresh platform/name and learn any
		// conversation this message names.
		if a.Owner == publisher {
			if msg.GetPlatform() != "" {
				a.Platform = msg.GetPlatform()
			}
			b.learnConversationLocked(a, msg)
		}
	} else {
		a := &Adapter{
			ID:            msg.GetAdapterId(),
			Platform:      msg.GetPlatform(),
			Owner:         publisher,
			Conversations: map[string]*pluginv1.AdapterConversation{},
		}
		b.learnConversationLocked(a, msg)
		b.adapters[a.ID] = a
	}
	b.recent = append(b.recent, msg)
	if len(b.recent) > replayDepth {
		b.recent = append(b.recent[:0], b.recent[len(b.recent)-replayDepth:]...)
	}

	delivered := 0
	for sub := range b.subs {
		if !sub.scope.CanRead(msg) {
			continue
		}
		select {
		case sub.ch <- msg:
			delivered++
		default:
			// Subscriber is behind. Dropping here keeps the adapter's read loop
			// at full speed; the counter makes the loss visible instead of
			// silently stalling the conversation.
			b.dropped++
		}
	}
	b.delivered += uint64(delivered)
	b.mu.Unlock()
	return delivered
}

// learnConversationLocked records the conversation a message names, so
// ListAdapters can offer it as a send target. Caller holds b.mu.
func (b *Bus) learnConversationLocked(a *Adapter, msg *pluginv1.InboundMessage) {
	key := msg.GetConversation()
	if key == "" {
		return
	}
	if _, ok := a.Conversations[key]; ok {
		return
	}
	a.Conversations[key] = &pluginv1.AdapterConversation{
		Conversation: key,
		Kind:         msg.GetKind(),
		Name:         firstNonEmpty(msg.GetPeerName(), msg.GetSenderName()),
	}
}

func firstNonEmpty(values ...string) string {
	for _, v := range values {
		if v != "" {
			return v
		}
	}
	return ""
}

// RegisterAdapter records an adapter a plugin advertised via
// MessageService.ListAdapters, so it is offerable before any message arrives.
func (b *Bus) RegisterAdapter(owner string, d *pluginv1.AdapterDescriptor) {
	if d == nil || d.GetAdapterId() == "" {
		return
	}
	b.mu.Lock()
	defer b.mu.Unlock()
	a := b.adapters[d.GetAdapterId()]
	if a == nil {
		a = &Adapter{ID: d.GetAdapterId(), Conversations: map[string]*pluginv1.AdapterConversation{}}
		b.adapters[a.ID] = a
	}
	// A descriptor is authoritative for its owner; a different plugin claiming
	// the same id does not steal it.
	if a.Owner == "" || a.Owner == owner {
		a.Owner = owner
		if d.GetPlatform() != "" {
			a.Platform = d.GetPlatform()
		}
		if d.GetName() != "" {
			a.Name = d.GetName()
		}
	}
	for _, c := range d.GetConversations() {
		if c.GetConversation() == "" {
			continue
		}
		a.Conversations[c.GetConversation()] = c
	}
}

// Owner returns the plugin that owns adapter.
func (b *Bus) Owner(adapter string) (string, bool) {
	b.mu.RLock()
	defer b.mu.RUnlock()
	a, ok := b.adapters[adapter]
	if !ok || a.Owner == "" {
		return "", false
	}
	return a.Owner, true
}

// Adapters returns a snapshot of every known adapter, sorted by id.
func (b *Bus) Adapters() []*Adapter {
	b.mu.RLock()
	defer b.mu.RUnlock()
	out := make([]*Adapter, 0, len(b.adapters))
	for _, a := range b.adapters {
		out = append(out, a.Clone())
	}
	sort.Slice(out, func(i, j int) bool { return out[i].ID < out[j].ID })
	return out
}

// Adapter returns one adapter snapshot.
func (b *Bus) Adapter(id string) (*Adapter, bool) {
	b.mu.RLock()
	defer b.mu.RUnlock()
	a, ok := b.adapters[id]
	if !ok {
		return nil, false
	}
	return a.Clone(), true
}

// DropPlugin removes a plugin's subscriptions and the adapters it owned. Called
// when a plugin disconnects or is disabled, so a stale owner cannot keep
// receiving sends it can no longer deliver.
func (b *Bus) DropPlugin(name string) {
	if name == "" {
		return
	}
	b.mu.Lock()
	for sub := range b.subs {
		if sub.scope.Plugin == name {
			delete(b.subs, sub)
			sub.once.Do(func() { close(sub.ch) })
		}
	}
	for id, a := range b.adapters {
		if a.Owner == name {
			delete(b.adapters, id)
		}
	}
	b.mu.Unlock()
}

// Stats returns a snapshot of bus activity.
func (b *Bus) Stats() Stats {
	b.mu.RLock()
	defer b.mu.RUnlock()
	out := Stats{
		Subscribers: len(b.subs),
		Adapters:    len(b.adapters),
		Published:   b.published,
		Delivered:   b.delivered,
		Dropped:     b.dropped,
		Rejected:    b.rejected,
		ByAdapter:   make(map[string]int, len(b.adapters)),
	}
	for id, a := range b.adapters {
		out.ByAdapter[id] = len(a.Conversations)
	}
	return out
}

// CountRejected records a publish/send the permission layer refused, so a
// misconfigured plugin is visible in the console rather than silently ignored.
func (b *Bus) CountRejected() {
	b.mu.Lock()
	b.rejected++
	b.mu.Unlock()
}
