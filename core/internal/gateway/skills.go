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
//	GET    /api/skills          → { dir, skills: [{name,description,tags,source}] }
//	POST   /api/skills          → { name, content } save/overwrite
//	DELETE /api/skills?name=…   → delete a file-backed skill
func (g *Gateway) handleSkills(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet && r.Method != http.MethodPost && r.Method != http.MethodDelete {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
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
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 2<<20)).Decode(&body); err != nil {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}
		args["name"] = body.Name
		args["content"] = body.Content
	case http.MethodDelete:
		action = "delete"
		args["name"] = r.URL.Query().Get("name")
		if args["name"] == "" {
			var body struct {
				Name string `json:"name"`
			}
			_ = json.NewDecoder(http.MaxBytesReader(w, r.Body, 64<<10)).Decode(&body)
			args["name"] = body.Name
		}
		if args["name"] == "" {
			http.Error(w, "name required", http.StatusBadRequest)
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
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	if !resp.Success && action == "delete" {
		w.WriteHeader(http.StatusNotFound)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]any{
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
