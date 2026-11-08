package gateway

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"strings"
	"time"
)

/*
The rule library, over HTTP.

The library is the stage between the user's message and the model: it classifies
the turn, learns a rule from a correction, and injects the rules that match. All
of that happens inside the agent, in the workspace, because a rule about a
codebase belongs to that codebase.

But a rule the user cannot see is a rule they cannot trust — and one wrong rule
("never touch the auth module") would otherwise steer every future session with
no way to find it. So the settings page reads the list and can delete or add a
line. The work still happens in the agent: Core forwards, it does not keep a
second copy of the rules, because two stores that disagree is exactly the bug
this endpoint exists to avoid.
*/

// handleAgentLibrary lists, adds, and removes library rules for a workspace.
func (g *Gateway) handleAgentLibrary(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet, http.MethodPost) {
		return
	}

	workspace := strings.TrimSpace(r.URL.Query().Get("workspace"))
	action := "list"
	text := ""
	id := ""

	if r.Method == http.MethodPost {
		var body struct {
			Action    string `json:"action"`
			Workspace string `json:"workspace"`
			Text      string `json:"text"`
			ID        string `json:"id"`
		}
		if err := json.NewDecoder(io.LimitReader(r.Body, 1<<20)).Decode(&body); err != nil {
			writeErr(w, http.StatusBadRequest, "invalid_request", "invalid JSON body")
			return
		}
		if v := strings.TrimSpace(body.Workspace); v != "" {
			workspace = v
		}
		if v := strings.TrimSpace(strings.ToLower(body.Action)); v != "" {
			action = v
		}
		text = strings.TrimSpace(body.Text)
		id = strings.TrimSpace(body.ID)
	}

	if workspace == "" {
		writeErr(w, http.StatusBadRequest, "workspace_required", "a workspace path is required: rules are per workspace")
		return
	}
	if action != "list" && action != "add" && action != "remove" {
		writeErr(w, http.StatusBadRequest, "invalid_request", `action must be "list", "add" or "remove"`)
		return
	}
	if action == "add" && text == "" {
		writeErr(w, http.StatusBadRequest, "invalid_request", "text is required to add a rule")
		return
	}
	if action == "remove" && id == "" {
		writeErr(w, http.StatusBadRequest, "invalid_request", "id is required to remove a rule")
		return
	}

	// The agent owns the file, so it does the edit. Core never writes the rules
	// itself: a rule written by Core would not be the list the agent matched
	// against, and the two would drift.
	ctx, cancel := context.WithTimeout(r.Context(), 20*time.Second)
	defer cancel()
	res := g.callAgentDirect(ctx, "library_admin", map[string]string{
		"action":    action,
		"workspace": workspace,
		"text":      text,
		"id":        id,
	})
	if !res.ok {
		writeErr(w, http.StatusServiceUnavailable, "agent_unavailable", res.err)
		return
	}

	if action == "list" {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		_, _ = w.Write([]byte(res.result))
		return
	}

	// add/remove answer with the rules the agent now holds, parsed here rather
	// than embedded as a string, so the page can redraw from one round trip
	// instead of racing a follow-up read.
	var updated struct {
		Rules json.RawMessage `json:"rules"`
	}
	if json.Unmarshal([]byte(res.result), &updated) == nil && len(updated.Rules) > 0 {
		writeJSON(w, http.StatusOK, map[string]interface{}{"action": action, "rules": updated.Rules})
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"action": action, "rules": []interface{}{}})
}
