package messaging

import (
	"sort"
	"strings"
	"sync"

	pluginv1 "0kay/gen/plugin/v1"
)

const (
	ReadNone = "none"
	ReadWake = "wake"
	ReadAll  = "all"
)

const Wildcard = "*"

const DefaultQueueDepth = 256

const replayDepth = 64

type Scope struct {
	Plugin string

	Trusted bool

	ReadMode string

	ReadAdapters      []string
	ReadConversations []string

	SendAdapters []string

	PublishAdapters []string

	Gate bool

	GateOnError string
}

const (
	GateAbstain = "abstain"
	GateAllow   = "allow"
	GateDeny    = "deny"
)

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

func (s Scope) CanGate(msg *pluginv1.InboundMessage) bool {
	return s.Gate && s.CanRead(msg)
}

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

func (s Scope) CanRead(msg *pluginv1.InboundMessage) bool {
	if msg == nil {
		return false
	}
	switch s.ReadMode {
	case ReadAll:
	case ReadWake:
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

func (s Scope) CanSend(adapter string) bool {
	return matches(s.SendAdapters, adapter)
}

func (s Scope) CanPublish(adapter string) bool {
	return matches(s.PublishAdapters, adapter)
}

func (s Scope) MayReadAdapter(adapter string) bool {
	if s.ReadMode == ReadNone {
		return false
	}
	return matches(s.ReadAdapters, adapter)
}

func matches(list []string, value string) bool {
	for _, entry := range list {
		if entry == Wildcard || entry == value {
			return true
		}
	}
	return false
}

type Adapter struct {
	ID            string
	Platform      string
	Name          string
	Owner         string
	Conversations map[string]*pluginv1.AdapterConversation
}

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

type Subscription struct {
	scope Scope
	ch    chan *pluginv1.InboundMessage
	bus   *Bus
	once  sync.Once
}

func (s *Subscription) Scope() Scope { return s.scope }

func (s *Subscription) C() <-chan *pluginv1.InboundMessage { return s.ch }

type Stats struct {
	Subscribers int            `json:"subscribers"`
	Adapters    int            `json:"adapters"`
	Published   uint64         `json:"published"`
	Delivered   uint64         `json:"delivered"`
	Dropped     uint64         `json:"dropped"`
	Rejected    uint64         `json:"rejected"`
	ByAdapter   map[string]int `json:"by_adapter"`
}

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

func NewBus() *Bus {
	return &Bus{
		subs:     make(map[*Subscription]struct{}),
		adapters: make(map[string]*Adapter),
	}
}

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

	for i := len(replay) - 1; i >= 0; i-- {
		sub.ch <- replay[i]
	}
	return sub
}

func (s Scope) CanReadAny() bool { return s.ReadMode != ReadNone }

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

func (b *Bus) Publish(msg *pluginv1.InboundMessage, publisher string) int {
	if msg == nil || msg.GetAdapterId() == "" {
		return 0
	}
	b.mu.Lock()
	b.published++
	if a := b.adapters[msg.GetAdapterId()]; a != nil {
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
			b.dropped++
		}
	}
	b.delivered += uint64(delivered)
	b.mu.Unlock()
	return delivered
}

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

func (b *Bus) Owner(adapter string) (string, bool) {
	b.mu.RLock()
	defer b.mu.RUnlock()
	a, ok := b.adapters[adapter]
	if !ok || a.Owner == "" {
		return "", false
	}
	return a.Owner, true
}

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

func (b *Bus) Adapter(id string) (*Adapter, bool) {
	b.mu.RLock()
	defer b.mu.RUnlock()
	a, ok := b.adapters[id]
	if !ok {
		return nil, false
	}
	return a.Clone(), true
}

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

func (b *Bus) CountRejected() {
	b.mu.Lock()
	b.rejected++
	b.mu.Unlock()
}
