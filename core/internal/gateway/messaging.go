package gateway

import (
	"net/http"
)

// handleMessaging reports the state of Core's chat-message bus: which adapters
// it knows about, which plugin owns each, the conversations seen on them, and
// the delivery counters.
//
// Read-only, and deliberately content-free: it reports that a conversation
// exists, never what was said in it, so it can sit behind the same access as
// the rest of /api without widening what a browser tab can see.
//
// The bus itself is driven over gRPC — adapter plugins report with
// PublishInboundMessage, consumers subscribe with SubscribeMessages and send
// with SendMessage. This route exists so an operator can answer "why is my bot
// not hearing messages?" without reading Core's logs.
func (g *Gateway) handleMessaging(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]interface{}{"error": "method not allowed"})
		return
	}
	if g.localCore == nil {
		writeJSON(w, http.StatusServiceUnavailable, map[string]interface{}{"error": "core service unavailable"})
		return
	}

	adapters := g.localCore.MessagingAdapters()
	out := make([]map[string]interface{}, 0, len(adapters))
	for _, a := range adapters {
		conversations := make([]map[string]interface{}, 0, len(a.Conversations))
		for _, c := range a.Conversations {
			conversations = append(conversations, map[string]interface{}{
				"conversation": c.GetConversation(),
				"kind":         c.GetKind(),
				"name":         c.GetName(),
			})
		}
		out = append(out, map[string]interface{}{
			"adapter_id":    a.ID,
			"platform":      a.Platform,
			"name":          a.Name,
			"owner_plugin":  a.Owner,
			"conversations": conversations,
		})
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"stats":    g.localCore.MessagingStats(),
		"adapters": out,
	})
}
