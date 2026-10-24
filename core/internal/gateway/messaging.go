package gateway

import (
	"net/http"
)

func (g *Gateway) handleMessaging(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	if g.localCore == nil {
		unavailable(w, "core service unavailable")
		return
	}

	adapters := g.localCore.MessagingAdapters(r.Context())
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
