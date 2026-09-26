package gateway

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func (g *Gateway) handleTaskEvents(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	if g.localCore == nil {
		unavailable(w, "core not ready")
		return
	}
	flusher, ok := w.(http.Flusher)
	if !ok {
		writeErr(w, http.StatusInternalServerError, "stream_unsupported", "streaming unavailable")
		return
	}
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("X-Accel-Buffering", "no")
	cursor := r.URL.Query().Get("cursor")
	ticker := time.NewTicker(200 * time.Millisecond)
	defer ticker.Stop()
	heartbeat := time.NewTicker(15 * time.Second)
	defer heartbeat.Stop()
	send := func() bool {
		delta := g.localCore.TaskDelta(cursor)
		next, _ := delta["cursor"].(string)
		if next == cursor {
			return true
		}
		raw, err := json.Marshal(delta)
		if err != nil {
			return false
		}
		if _, err = fmt.Fprintf(w, "event: tasks\ndata: %s\n\n", raw); err != nil {
			return false
		}
		cursor = next
		flusher.Flush()
		return true
	}
	if !send() {
		return
	}
	for {
		select {
		case <-r.Context().Done():
			return
		case <-ticker.C:
			if !send() {
				return
			}
		case <-heartbeat.C:
			if _, err := fmt.Fprint(w, ": heartbeat\n\n"); err != nil {
				return
			}
			flusher.Flush()
		}
	}
}
