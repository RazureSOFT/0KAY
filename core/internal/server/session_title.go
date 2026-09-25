package server

import (
	"context"
	"log"
	"strings"
	"time"

	mocrv1 "0kay/gen/mocr/v1"
)

// newTitleRequest builds a single-turn mocr Generate call for session titling.
func newTitleRequest(prompt string) *mocrv1.GenerateRequest {
	return &mocrv1.GenerateRequest{
		ModelId:   "MOCR",
		Stream:    true,
		MaxTokens: 64,
		Messages: []*mocrv1.Message{
			{Role: "user", Content: prompt},
		},
	}
}

// resolveTitleCredentials fills provider/base/api for Generate (same path as CallMocr).
func (s *CoreServiceServer) resolveTitleCredentials(req *mocrv1.GenerateRequest) {
	if s.providerStore == nil {
		return
	}
	if p, u, k, resolved, ok := s.providerStore.ResolveModel(req.ModelId); ok {
		req.Provider, req.BaseUrl, req.ApiKey, req.ModelId = p, u, k, resolved
	}
}

// maybeAutoTitleSession regenerates the session title from the first completed
// agent turn when the title is still a placeholder or a raw prompt slice.
// It runs asynchronously so task completion is never blocked on mocr.
func (s *CoreServiceServer) maybeAutoTitleSession(sessionID string) {
	if sessionID == "" || !strings.HasPrefix(sessionID, "agent-session:") {
		return
	}
	s.mu.Lock()
	session := s.tasks[sessionID]
	if session == nil || session.Kind != "agent_session" || session.State == "deleted" {
		s.mu.Unlock()
		return
	}
	turns := 0
	var firstPrompt, firstResult string
	for _, t := range s.tasks {
		if t.SessionID != sessionID || t.Kind != "agent" || t.TaskID == sessionID {
			continue
		}
		if t.State == "done" {
			turns++
			if turns == 1 {
				firstPrompt, firstResult = t.Prompt, t.Result
			}
		}
	}
	currentTitle := session.Prompt
	s.mu.Unlock()

	// Only title after the first successful turn, and only if the title was
	// never customized away from the creation default / first-message slice.
	if turns != 1 || firstPrompt == "" {
		return
	}
	if !isPlaceholderSessionTitle(currentTitle, firstPrompt) {
		return
	}

	lang := "zh"
	if strings.Contains(firstPrompt, " the ") || strings.Contains(firstPrompt, "?") {
		lang = "en"
	}
	prompt := "Summarize this conversation into a short session title (max 40 characters, no quotes, no newline).\nLanguage: " + lang + "\nUser: " + truncateRunes(firstPrompt, 400) + "\nAssistant: " + truncateRunes(firstResult, 600) + "\nTitle:"

	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
		defer cancel()
		client, closeFn, err := s.dialMocr(ctx)
		if err != nil {
			log.Printf("[session-title] dial mocr: %v", err)
			return
		}
		defer closeFn()
		genReq := newTitleRequest(prompt)
		s.resolveTitleCredentials(genReq)
		stream, err := client.Generate(ctx, genReq)
		if err != nil {
			log.Printf("[session-title] generate: %v", err)
			return
		}
		var title strings.Builder
		for {
			resp, err := stream.Recv()
			if err != nil {
				break
			}
			if resp.Chunk != "" {
				title.WriteString(resp.Chunk)
			}
			if resp.Done {
				break
			}
		}
		clean := sanitizeSessionTitle(title.String())
		if clean == "" {
			return
		}
		if err := s.RenameAgentSession(sessionID, clean); err != nil {
			log.Printf("[session-title] rename: %v", err)
		}
	}()
}

// isPlaceholderSessionTitle reports whether title still looks auto-generated.
func isPlaceholderSessionTitle(title, firstPrompt string) bool {
	t := strings.TrimSpace(title)
	if t == "" || t == "Agent session" || t == "新对话" || t == "New chat" {
		return true
	}
	// Creation path stores message.slice(0,60) — treat short prefixes of the
	// first user message as placeholders so a real summary can replace them.
	fp := strings.TrimSpace(firstPrompt)
	if fp != "" && (t == truncateRunes(fp, 60) || strings.HasPrefix(fp, t)) && len([]rune(t)) <= 60 {
		return true
	}
	return false
}

func sanitizeSessionTitle(raw string) string {
	s := strings.TrimSpace(raw)
	for _, p := range []string{"Title:", "标题:", "title:"} {
		if strings.HasPrefix(s, p) {
			s = strings.TrimSpace(strings.TrimPrefix(s, p))
		}
	}
	s = strings.Trim(s, "\"'“”‘’ \t\n\r")
	s = strings.ReplaceAll(s, "\n", " ")
	s = strings.ReplaceAll(s, "\r", " ")
	s = strings.Join(strings.Fields(s), " ")
	if n := len([]rune(s)); n > 60 {
		s = string([]rune(s)[:60])
	}
	return strings.TrimSpace(s)
}
