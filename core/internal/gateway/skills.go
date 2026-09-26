package gateway

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	corev1 "0kay/gen/core/v1"
)

// handleSkills proxies Agent skill administration via RunDirect (no LLM):
//
//	GET    /api/skills              → { dir, skills: [{name,description,tags,source}] }
//	POST   /api/skills              → { name, content } save/overwrite
//	DELETE /api/skills?name=…       → delete a file-backed skill (legacy alias)
//	DELETE /api/skills/{name...}    → delete a file-backed skill
func (g *Gateway) handleSkills(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet, http.MethodPost, http.MethodDelete) {
		return
	}
	action := "list"
	args := map[string]any{}
	switch r.Method {
	case http.MethodPost:
		action = "save"
		var body struct {
			Name    string `json:"name"`
			Content string `json:"content"`
		}
		if !decodeBody(w, r, &body, 2<<20) {
			return
		}
		args["name"] = body.Name
		args["content"] = body.Content
	case http.MethodDelete:
		action = "delete"
		args["name"] = r.PathValue("name")
		if args["name"] == "" {
			deprecated(w, "/api/skills/{name}")
			args["name"] = r.URL.Query().Get("name")
		}
		if args["name"] == "" {
			var body struct {
				Name string `json:"name"`
			}
			if !decodeBody(w, r, &body, maxSmallBody) {
				return
			}
			args["name"] = body.Name
		}
		if args["name"] == "" {
			badRequest(w, "name required")
			return
		}
	}
	args["action"] = action
	raw, _ := json.Marshal(args)

	ctx, cancel := context.WithTimeout(r.Context(), 30*time.Second)
	defer cancel()
	resp, err := g.coreSvc.RunDirect(ctx, &corev1.RunDirectRequest{
		Tool:      "skills_admin",
		Args:      string(raw),
		SessionId: "skills-ui",
	})
	if err != nil {
		writeErr(w, http.StatusBadGateway, "upstream_error", err.Error())
		return
	}
	// A failed delete is a real error, so it uses the canonical envelope
	// (docs/HTTP_API.md) instead of a 404 carrying a success-shaped body.
	if !resp.Success && action == "delete" {
		message := resp.Error
		if message == "" {
			message = "skill not found"
		}
		notFound(w, message)
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"success": resp.Success,
		"result":  json.RawMessage(orEmptyJSON(resp.Result)),
		"error":   resp.Error,
	})
}

func orEmptyJSON(s string) string {
	if s == "" {
		return "null"
	}
	if json.Valid([]byte(s)) {
		return s
	}
	b, _ := json.Marshal(s)
	return string(b)
}
