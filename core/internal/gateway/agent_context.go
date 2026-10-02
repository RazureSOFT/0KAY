package gateway

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"0kay/core/internal/pairing"
	"0kay/core/internal/server"
	agentv1 "0kay/gen/agent/v1"
	lifev1 "0kay/gen/life/v1"
	mocrv1 "0kay/gen/mocr/v1"
)

// compactionSystemPrompt is the opencode-style structured handoff schema. The
// summary replaces raw history, so it must be self-contained and lossless on
// facts (but never secrets).
const compactionSystemPrompt = `You maintain a structured handoff summary of an ongoing agent session so work can continue after the raw transcript is dropped. Rewrite it using EXACTLY these Markdown sections, in order, keeping every section:
## Objective
## Important Details
## Work State
## Next Move
## Relevant Files

Rules:
- Objective: the current goal and what done means.
- Important Details: durable facts, decisions, constraints, paths, IDs and answered questions. Never include secrets.
- Work State: group as Completed / Active / Blocked. Report only observed results; never invent success.
- Next Move: the concrete immediate next step(s).
- Relevant Files: file:line references needed to continue.
- Carry the prior summary forward and never drop early facts.
- Start directly with "## Objective"; no preamble; never restate these instructions.
- Be terse and factual; if a section has nothing, write 无. Write in the conversation's language.`

// autoCompactTokens is the session context size (approx tokens) that triggers an
// automatic compaction before the next turn.
func autoCompactTokens() int {
	if value, err := strconv.Atoi(strings.TrimSpace(os.Getenv("AGENT_AUTOCOMPACT_TOKENS"))); err == nil && value > 0 {
		return value
	}
	return 48000
}

// sessionContextTokens estimates the live context size for a session (4 chars ≈ 1 token).
func (g *Gateway) sessionContextTokens(sessionID string) int {
	if g.localCore == nil {
		return 0
	}
	total := 0
	for _, task := range g.localCore.ListTasks() {
		if task["session_id"] != sessionID {
			continue
		}
		state, _ := task["state"].(string)
		if state != "done" {
			continue
		}
		switch task["kind"] {
		case "agent", "compact":
			prompt, _ := task["prompt"].(string)
			result, _ := task["result"].(string)
			total += (len(prompt) + len(result)) / 4
		}
	}
	return total
}

// transcriptFromHistory renders the history array as a plain transcript.
func transcriptFromHistory(history []map[string]string) string {
	var b strings.Builder
	for _, m := range history {
		b.WriteString(m["role"])
		b.WriteString(": ")
		b.WriteString(m["content"])
		b.WriteString("\n\n")
	}
	return strings.TrimSpace(b.String())
}

// compactSession folds a session's history into a structured summary and records
// a `compact` block (with the folded range in Args). Returns the summary. When
// modelID resolves to provider credentials the summary is produced by that
// model via mocr; otherwise it falls back to LIFE's compaction model.
func (g *Gateway) compactSession(ctx context.Context, sessionID, modelID string) (string, error) {
	if g.localCore == nil || !g.localCore.HasAgentSession(sessionID) {
		return "", fmt.Errorf("invalid session")
	}
	tasks := g.localCore.ListTasks()
	history := []map[string]string{}
	foldedIDs := []string{}
	fromID, toID := "", ""
	for i := len(tasks) - 1; i >= 0; i-- {
		task := tasks[i]
		if task["session_id"] != sessionID {
			continue
		}
		state, _ := task["state"].(string)
		if state == "running" || state == "pending" {
			return "", fmt.Errorf("wait for active work to finish")
		}
		if task["kind"] == "compact" && state == "done" {
			history = []map[string]string{{"role": "system", "content": fmt.Sprint(task["result"])}}
		}
		if task["kind"] == "agent" {
			prompt, _ := task["prompt"].(string)
			result, _ := task["result"].(string)
			failure, _ := task["error"].(string)
			history = append(history, map[string]string{"role": "user", "content": prompt}, map[string]string{"role": "assistant", "content": result + "\n" + failure})
			if id, _ := task["task_id"].(string); id != "" {
				if toID == "" {
					toID = id
				}
				fromID = id
				foldedIDs = append(foldedIDs, id)
			}
		}
	}
	if len(history) == 0 {
		return "", fmt.Errorf("no conversation to compact")
	}
	transcript := transcriptFromHistory(history)

	id := fmt.Sprintf("compact:%d", time.Now().UnixNano())
	args, _ := json.Marshal(map[string]any{"model": strings.TrimSpace(modelID), "from": fromID, "to": toID, "ids": foldedIDs})
	event := server.TaskEvent{TaskID: id, SessionID: sessionID, CallerID: "webui", Kind: "compact", Prompt: "/compact", State: "running", Args: string(args)}
	if err := g.localCore.RecordTask(event); err != nil {
		return "", err
	}

	summary, err := g.summarizeSession(ctx, modelID, history, transcript)
	if err != nil {
		event.State = "failed"
		event.Error = err.Error()
		_ = g.localCore.RecordTask(event)
		return "", err
	}
	summary = strings.TrimSpace(summary)
	if summary == "" {
		event.State = "failed"
		event.Error = "empty compaction summary"
		_ = g.localCore.RecordTask(event)
		return "", fmt.Errorf("empty compaction summary")
	}
	event.State = "done"
	event.Result = summary
	if err := g.localCore.RecordTask(event); err != nil {
		return "", err
	}
	return summary, nil
}

// summarizeSession prefers the session's own model (via mocr) and falls back to
// LIFE's compaction model when the model has no usable credentials.
func (g *Gateway) summarizeSession(ctx context.Context, modelID string, history []map[string]string, transcript string) (string, error) {
	if g.providerStore != nil {
		if provider, baseURL, apiKey, resolved, ok := g.providerStore.ResolveModel(modelID); ok && apiKey != "" && baseURL != "" {
			text, err := g.generateViaMocr(ctx, resolved, provider, baseURL, apiKey, compactionSystemPrompt, "Conversation transcript:\n"+transcript)
			if err == nil && strings.TrimSpace(text) != "" {
				return text, nil
			}
		}
	}
	return g.summarizeViaLIFE(ctx, history)
}

// generateViaMocr runs one generation on the model gateway and returns the text.
func (g *Gateway) generateViaMocr(ctx context.Context, modelID, provider, baseURL, apiKey, systemPrompt, userPrompt string) (string, error) {
	addr := strings.TrimSpace(os.Getenv("MOCR_ADDRESS"))
	if addr == "" {
		addr = "127.0.0.1:50052"
	}
	conn, err := g.dial(addr)
	if err != nil {
		return "", err
	}
	stream, err := mocrv1.NewMocrServiceClient(conn).Generate(ctx, &mocrv1.GenerateRequest{
		ModelId:      modelID,
		Provider:     provider,
		BaseUrl:      baseURL,
		ApiKey:       apiKey,
		SystemPrompt: systemPrompt,
		MaxTokens:    2048,
		Stream:       true,
		Messages:     []*mocrv1.Message{{Role: "user", Content: userPrompt}},
	})
	if err != nil {
		return "", err
	}
	var out strings.Builder
	for {
		resp, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			return out.String(), err
		}
		if resp.Chunk != "" {
			out.WriteString(resp.Chunk)
		}
		if resp.Done {
			if resp.Text != "" {
				return resp.Text, nil
			}
			break
		}
	}
	return out.String(), nil
}

func (g *Gateway) summarizeViaLIFE(ctx context.Context, history []map[string]string) (string, error) {
	lifes := g.registry.GetPluginsByCapability("life")
	if len(lifes) == 0 {
		return "", fmt.Errorf("LIFE unavailable and no model credentials for compaction")
	}
	conn, err := g.lifeDial(lifes[0])
	if err != nil {
		return "", err
	}
	data, _ := json.Marshal(history)
	resp, err := lifev1.NewLifeServiceClient(conn).CompactConversation(ctx, &lifev1.CompactConversationRequest{HistoryJson: string(data)})
	if err != nil {
		return "", err
	}
	if !resp.GetOk() {
		return "", fmt.Errorf("%s", resp.GetError())
	}
	return resp.GetSummary(), nil
}

// compactBlocks lists successful compaction blocks for a session (newest first).
func (g *Gateway) compactBlocks(sessionID string) []map[string]any {
	if g.localCore == nil {
		return nil
	}
	out := []map[string]any{}
	for _, task := range g.localCore.ListTasks() {
		if task["session_id"] != sessionID || task["kind"] != "compact" {
			continue
		}
		if state, _ := task["state"].(string); state != "done" {
			continue
		}
		meta := map[string]string{}
		if raw, _ := task["args"].(string); raw != "" {
			_ = json.Unmarshal([]byte(raw), &meta)
		}
		out = append(out, map[string]any{
			"id":         task["task_id"],
			"summary":    task["result"],
			"model":      meta["model"],
			"from":       meta["from"],
			"to":         meta["to"],
			"created_at": task["started_at"],
		})
	}
	return out
}

// handleAgentContext GET /api/agent/context?session_id=… — the compaction state.
func (g *Gateway) handleAgentContext(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	sessionID := strings.TrimSpace(r.URL.Query().Get("session_id"))
	if sessionID == "" {
		badRequest(w, "session_id required")
		return
	}
	tokens := g.sessionContextTokens(sessionID)
	window := modelContextWindow(strings.TrimSpace(r.URL.Query().Get("model_id")))
	breakdown := map[string]any{"window": window, "system": 0, "tools": 0, "skills": 0, "mcp": 0, "conversation": tokens, "used": tokens}
	// Ask the live agent to split the stable parts (system/tools/skills/mcp).
	if agents := g.registry.GetAgents(true); len(agents) > 0 {
		agent := agents[0]
		if conn, err := g.dial(agent.Address); err == nil {
			args, _ := json.Marshal(map[string]any{"conversation_tokens": tokens, "window": window})
			ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
			res, err := agentv1.NewAgentServiceClient(conn).RunDirect(pairing.CallbackContext(ctx, agent.Address), &agentv1.RunDirectRequest{Tool: "context_usage", Args: string(args)})
			cancel()
			if err == nil && res.Success {
				var parsed map[string]any
				if json.Unmarshal([]byte(res.Result), &parsed) == nil && len(parsed) > 0 {
					breakdown = parsed
					if value, ok := parsed["window"].(float64); ok && value > 0 {
						window = int(value)
					}
					if value, ok := parsed["used"].(float64); ok {
						tokens = int(value)
					}
				}
			}
		}
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"summary":   g.latestCompactSummary(sessionID),
		"tokens":    tokens,
		"window":    window,
		"threshold": autoCompactTokens(),
		"breakdown": breakdown,
		"blocks":    g.compactBlocks(sessionID),
	})
}

// modelWindow is one entry of the built-in context-window table.
type modelWindow struct {
	match  string
	window int
}

// modelWindowTable maps a model-id substring to its context window (tokens).
// Order matters: the first matching entry wins, so put more specific patterns
// first. Override the whole thing with AGENT_CONTEXT_WINDOW.
var modelWindowTable = []modelWindow{
	{"gpt-4.1", 1000000},
	{"gpt-5", 400000},
	{"o3", 200000},
	{"o4", 200000},
	{"claude", 200000},
	{"gemini", 1000000},
	{"kimi", 256000},
	{"grok", 131072},
	{"qwen", 131072},
	{"glm", 128000},
	{"deepseek", 128000},
	{"llama", 128000},
	{"mistral", 128000},
	{"muse-spark", 128000},
}

// modelContextWindow resolves the context window for a model id. It is a
// best-effort table (providers do not report the window uniformly) and can be
// overridden globally with AGENT_CONTEXT_WINDOW.
func modelContextWindow(modelID string) int {
	if value, err := strconv.Atoi(strings.TrimSpace(os.Getenv("AGENT_CONTEXT_WINDOW"))); err == nil && value > 0 {
		return value
	}
	id := strings.ToLower(strings.TrimSpace(modelID))
	if id == "" {
		return 128000
	}
	for _, entry := range modelWindowTable {
		if strings.Contains(id, entry.match) {
			return entry.window
		}
	}
	return 128000
}

// handleAgentContextSearch GET /api/agent/context/search?session_id=&q=… —
// keyword search over the session's turns and folded summaries.
func (g *Gateway) handleAgentContextSearch(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	sessionID := strings.TrimSpace(r.URL.Query().Get("session_id"))
	query := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("q")))
	if sessionID == "" || query == "" {
		badRequest(w, "session_id and q required")
		return
	}
	if g.localCore == nil {
		writeJSON(w, http.StatusOK, map[string]any{"matches": []any{}})
		return
	}
	const snippet = 240
	matches := []map[string]any{}
	for _, task := range g.localCore.ListTasks() {
		if task["session_id"] != sessionID {
			continue
		}
		kind, _ := task["kind"].(string)
		if kind != "agent" && kind != "compact" {
			continue
		}
		content := fmt.Sprint(task["prompt"]) + "\n" + fmt.Sprint(task["result"])
		index := strings.Index(strings.ToLower(content), query)
		if index < 0 {
			continue
		}
		start := index - snippet/2
		if start < 0 {
			start = 0
		}
		end := start + snippet
		if end > len(content) {
			end = len(content)
		}
		matches = append(matches, map[string]any{
			"id":      task["task_id"],
			"kind":    kind,
			"state":   task["state"],
			"snippet": content[start:end],
		})
		if len(matches) >= 20 {
			break
		}
	}
	writeJSON(w, http.StatusOK, map[string]any{"matches": matches})
}
