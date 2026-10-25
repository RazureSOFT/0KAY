package gateway

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"0kay/core/internal/pairing"
	agentv1 "0kay/gen/agent/v1"
)

type computerUseFrame struct {
	Running bool   `json:"running"`
	Enabled bool   `json:"enabled"`
	Image   string `json:"image"`
	Mime    string `json:"mime"`
	At      int64  `json:"at"`
}

// mjpegFrameMime sanitizes a plugin-reported frame MIME type before it is
// written into an MJPEG stream part header. Only well-known image types (and
// a CRLF-free multipart/x-mixed-replace; boundary= value) pass through;
// anything else — including header-injection attempts containing CR or LF —
// falls back to image/jpeg.
func mjpegFrameMime(mime string) string {
	if strings.ContainsAny(mime, "\r\n") {
		return "image/jpeg"
	}
	switch mime {
	case "image/jpeg", "image/png", "image/gif", "image/webp":
		return mime
	}
	if strings.HasPrefix(mime, "multipart/x-mixed-replace; boundary=") {
		return mime
	}
	return "image/jpeg"
}

func (g *Gateway) handleAgentComputerUse(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	id := r.URL.Query().Get("executor_id")
	agents := g.registry.GetAgents(true)
	for _, agent := range agents {
		if id != "" && agent.PluginID != id {
			continue
		}
		conn, err := g.dial(agent.Address)
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
		defer cancel()
		result, err := agentv1.NewAgentServiceClient(conn).RunDirect(
			pairing.CallbackContext(ctx, agent.Address),
			&agentv1.RunDirectRequest{Tool: "computeruse_status", Args: "{}"},
		)
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		writeRawJSON(w, http.StatusOK, result.Result)
		return
	}
	unavailable(w, "selected executor unavailable")
}

func (g *Gateway) handleAgentComputerUseStream(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	flusher, ok := w.(http.Flusher)
	if !ok {
		upstreamError(w, "streaming unsupported")
		return
	}
	id := r.URL.Query().Get("executor_id")
	addr := ""
	for _, agent := range g.registry.GetAgents(true) {
		if id != "" && agent.PluginID != id {
			continue
		}
		addr = agent.Address
		break
	}
	if addr == "" {
		unavailable(w, "selected executor unavailable")
		return
	}
	conn, err := g.dial(addr)
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	w.Header().Set("Content-Type", "multipart/x-mixed-replace; boundary=okayframe")
	w.Header().Set("Cache-Control", "no-store, no-cache, must-revalidate")
	w.Header().Set("Pragma", "no-cache")
	w.Header().Set("X-Accel-Buffering", "no")
	w.WriteHeader(http.StatusOK)
	flusher.Flush()

	client := agentv1.NewAgentServiceClient(conn)
	ctx := r.Context()
	var lastAt int64
	for ctx.Err() == nil {
		callCtx, cancel := context.WithTimeout(ctx, 8*time.Second)
		result, err := client.RunDirect(pairing.CallbackContext(callCtx, addr), &agentv1.RunDirectRequest{Tool: "computeruse_frame", Args: fmt.Sprintf(`{"after":%d}`, lastAt)})
		cancel()
		if err != nil {
			break
		}
		var payload computerUseFrame
		if result.Success && result.Result != "" && json.Unmarshal([]byte(result.Result), &payload) == nil {
			if !payload.Running {
				break
			}
			if payload.Image != "" && payload.At != 0 && payload.At != lastAt {
				lastAt = payload.At
				if raw, derr := base64.StdEncoding.DecodeString(payload.Image); derr == nil && len(raw) > 0 {
					fmt.Fprintf(w, "--okayframe\r\nContent-Type: %s\r\nContent-Length: %d\r\n\r\n", mjpegFrameMime(payload.Mime), len(raw))
					if _, werr := w.Write(raw); werr != nil {
						return
					}
					fmt.Fprint(w, "\r\n")
					flusher.Flush()
				}
			}
		}
		select {
		case <-ctx.Done():
			return
		case <-time.After(35 * time.Millisecond):
		}
	}
}
