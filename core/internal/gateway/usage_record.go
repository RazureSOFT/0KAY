package gateway

import (
	"net/http"
	"time"

	"0kay/core/internal/server"
)

// handleUsageRecord POST /api/usage/record — internal ingest used by the chat
// pipeline to append one completed generation to the usage ledger.
func (g *Gateway) handleUsageRecord(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var record server.UsageRecord
	if !decodeBody(w, r, &record, 16384) {
		return
	}
	if record.RequestID == "" || record.PromptTokens < 0 || record.CompletionTokens < 0 {
		badRequest(w, "invalid usage")
		return
	}
	record.TotalTokens = record.PromptTokens + record.CompletionTokens
	if record.Timestamp.IsZero() {
		record.Timestamp = time.Now()
	}
	if g.localCore == nil {
		unavailable(w, "core not ready")
		return
	}
	g.localCore.RecordUsage(record)
	w.WriteHeader(http.StatusNoContent)
}
