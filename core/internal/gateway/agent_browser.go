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

func (g *Gateway) handleAgentBrowser(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	tool := "browser_status"
	if strings.HasSuffix(r.URL.Path, "/view") {
		tool = "browser_view"
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
			&agentv1.RunDirectRequest{Tool: tool, Args: "{}"},
		)
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		if !result.Success {
			writeErr(w, http.StatusBadRequest, "browser_error", result.Error)
			return
		}
		writeRawJSON(w, http.StatusOK, result.Result)
		return
	}
	unavailable(w, "selected executor unavailable")
}

func (g *Gateway) handleAgentBrowserAction(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var body map[string]interface{}
	if !decodeBody(w, r, &body, maxSmallBody) {
		return
	}
	id, _ := body["executor_id"].(string)
	delete(body, "executor_id")
	args, _ := json.Marshal(body)
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
		ctx, cancel := context.WithTimeout(r.Context(), 60*time.Second)
		defer cancel()
		result, err := agentv1.NewAgentServiceClient(conn).RunDirect(
			pairing.CallbackContext(ctx, agent.Address),
			&agentv1.RunDirectRequest{Tool: "browser", Args: string(args)},
		)
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		if !result.Success {
			writeErr(w, http.StatusBadRequest, "browser_error", result.Error)
			return
		}
		writeRawJSON(w, http.StatusOK, result.Result)
		return
	}
	unavailable(w, "selected executor unavailable")
}

func (g *Gateway) handleAgentBrowserStream(w http.ResponseWriter, r *http.Request) {
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
		result, err := client.RunDirect(pairing.CallbackContext(callCtx, addr), &agentv1.RunDirectRequest{Tool: "browser_frame", Args: "{}"})
		cancel()
		if err != nil {
			break
		}
		var payload struct {
			Running bool   `json:"running"`
			Image   string `json:"image"`
			Mime    string `json:"mime"`
			At      int64  `json:"at"`
		}
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
		case <-time.After(66 * time.Millisecond):
		}
	}
}
