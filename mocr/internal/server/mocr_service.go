package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"

	mocrv1 "0kay/gen/mocr/v1"
	prov "0kay/mocr/internal/providers"
	"0kay/mocr/internal/selector"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

// isFakeKey reports placeholder keys that must not hit the network.
func isFakeKey(key string) bool {
	k := strings.ToLower(strings.TrimSpace(key))
	if k == "" {
		return true
	}
	return strings.HasPrefix(k, "sk-test") ||
		strings.HasPrefix(k, "sk-placeholder") ||
		k == "test" ||
		k == "changeme"
}

// coreCatalog caches Core's model list (GET /api/models).
type coreCatalog struct {
	mu      sync.RWMutex
	entries []prov.ModelInfo
	loaded  time.Time
}

var catalog = &coreCatalog{}

func coreHTTPBase() string {
	if v := os.Getenv("CORE_HTTP_ADDR"); v != "" {
		return strings.TrimRight(v, "/")
	}
	return "http://127.0.0.1:8080"
}

// refreshCatalog pulls the model catalog from Core (best-effort, 15s cache).
func refreshCatalog() []prov.ModelInfo {
	catalog.mu.RLock()
	if time.Since(catalog.loaded) < 15*time.Second && len(catalog.entries) > 0 {
		entries := catalog.entries
		catalog.mu.RUnlock()
		return entries
	}
	catalog.mu.RUnlock()

	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, coreHTTPBase()+"/api/models", nil)
	if err != nil {
		return cachedCatalog()
	}
	coreAuth(req)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return cachedCatalog()
	}
	defer resp.Body.Close()
	var body struct {
		Models []struct {
			ID               string `json:"id"`
			Provider         string `json:"provider"`
			SupportsThinking bool   `json:"supports_thinking"`
		} `json:"models"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil || len(body.Models) == 0 {
		return cachedCatalog()
	}
	entries := make([]prov.ModelInfo, 0, len(body.Models))
	for _, m := range body.Models {
		cost := 0.000001
		switch {
		case strings.Contains(strings.ToLower(m.ID), "o1"):
			cost = 0.000015
		case strings.Contains(strings.ToLower(m.ID), "opus"):
			cost = 0.000015
		case strings.Contains(strings.ToLower(m.ID), "sonnet"):
			cost = 0.000003
		case strings.Contains(strings.ToLower(m.ID), "mini") || strings.Contains(strings.ToLower(m.ID), "haiku"):
			cost = 0.0000002
		}
		entries = append(entries, prov.ModelInfo{
			ID:                    m.ID,
			Provider:              m.Provider,
			SupportsThinking:      m.SupportsThinking,
			MaxContextLength:      128000,
			EstimatedCostPerToken: cost,
		})
	}
	catalog.mu.Lock()
	catalog.entries = entries
	catalog.loaded = time.Now()
	catalog.mu.Unlock()
	return entries
}

func cachedCatalog() []prov.ModelInfo {
	catalog.mu.RLock()
	defer catalog.mu.RUnlock()
	if len(catalog.entries) > 0 {
		return catalog.entries
	}
	// Last resort: hardcoded so ChooseModels never returns empty offline.
	return append(prov.GetModels("openai"), prov.GetModels("anthropic")...)
}

// MocrServiceServer implements the MocrService gRPC service.
type MocrServiceServer struct {
	mocrv1.UnimplementedMocrServiceServer
	selector *selector.Selector
}

// NewMocrServiceServer creates a new MocrServiceServer.
func NewMocrServiceServer(sel *selector.Selector) *MocrServiceServer {
	startRuntimePoll()
	return &MocrServiceServer{
		selector: sel,
	}
}

// ChooseModels selects the best models for a request (agent-only intelligent selection).
// Catalog comes from Core (/api/models) so it tracks providers.json, not a hardcoded list.
func (s *MocrServiceServer) ChooseModels(ctx context.Context, req *mocrv1.ChooseModelsRequest) (*mocrv1.ChooseModelsResponse, error) {
	if req.Prompt == "" {
		return nil, fmt.Errorf("prompt is required")
	}

	// Pinned default model (provider settings) overrides intelligent selection.
	if dm := strings.TrimSpace(currentRuntime().DefaultModel); dm != "" {
		for _, e := range refreshCatalog() {
			if strings.EqualFold(e.ID, dm) {
				spec := &mocrv1.ModelSpec{
					ModelId:               e.ID,
					Provider:              e.Provider,
					EstimatedCostPerToken: e.EstimatedCostPerToken,
					SupportsThinking:      e.SupportsThinking,
					MaxContextLength:      int32(e.MaxContextLength),
				}
				return &mocrv1.ChooseModelsResponse{
					ThinkModel:  spec,
					OutputModel: spec,
					Reasoning:   "default_model pinned in provider settings",
				}, nil
			}
		}
		log.Printf("[mocr] default_model %q not found in catalog; falling back to selector", dm)
	}

	difficulty := 0.5
	requireThinking := false
	maxTokens := 1024
	costBudget := 1.0

	if req.Context != nil {
		difficulty = req.Context.DifficultyHint
		requireThinking = req.Context.RequireThinking
		maxTokens = int(req.Context.MaxTokens)
		costBudget = req.Context.CostBudget
	}

	result := s.selector.SelectFrom(refreshCatalog(), req.Prompt, difficulty, requireThinking, maxTokens, costBudget)

	return &mocrv1.ChooseModelsResponse{
		ThinkModel: &mocrv1.ModelSpec{
			ModelId:               result.ThinkModel.ID,
			Provider:              result.ThinkModel.Provider,
			EstimatedCostPerToken: result.ThinkModel.EstimatedCostPerToken,
			SupportsThinking:      result.ThinkModel.SupportsThinking,
			MaxContextLength:      int32(result.ThinkModel.MaxContextLength),
		},
		OutputModel: &mocrv1.ModelSpec{
			ModelId:               result.OutputModel.ID,
			Provider:              result.OutputModel.Provider,
			EstimatedCostPerToken: result.OutputModel.EstimatedCostPerToken,
			SupportsThinking:      result.OutputModel.SupportsThinking,
			MaxContextLength:      int32(result.OutputModel.MaxContextLength),
		},
		Reasoning: result.Reasoning,
	}, nil
}

// Generate streams text generation from the selected model (real provider when credentials present).
func (s *MocrServiceServer) Generate(req *mocrv1.GenerateRequest, stream mocrv1.MocrService_GenerateServer) error {
	if req.ModelId == "" {
		return fmt.Errorf("model_id is required")
	}

	// Real path: credentials passed by Core (or agent with provider config)
	if req.ApiKey != "" && req.BaseUrl != "" {
		return s.generateReal(req, stream)
	}

	// No credentials configured — surface an explicit offline marker (not a silent echo).
	log.Printf("[mocr] no credentials for model=%s, offline fallback", req.ModelId)
	return status.Error(codes.FailedPrecondition, "no provider credentials configured")
}

func (s *MocrServiceServer) generateReal(req *mocrv1.GenerateRequest, stream mocrv1.MocrService_GenerateServer) error {
	msgs := make([]prov.ChatMessage, 0, len(req.Messages))
	for _, m := range req.Messages {
		cm := prov.ChatMessage{Role: m.Role, Content: m.Content, ToolCallID: m.ToolCallId, ReasoningContent: m.ReasoningContent}
		// Legacy agents carried prior thinking through tool_call_id (unused
		// for role=assistant); keep decoding it during the transition.
		if m.Role == "assistant" && cm.ReasoningContent == "" && cm.ToolCallID != "" {
			cm.ReasoningContent = cm.ToolCallID
			cm.ToolCallID = ""
		}
		for _, tc := range m.ToolCalls {
			cm.ToolCalls = append(cm.ToolCalls, prov.ToolCall{
				ID:        tc.Id,
				Name:      tc.FunctionName,
				Arguments: tc.Arguments,
			})
		}
		msgs = append(msgs, cm)
	}

	// Fake/test keys hang or 401 on the wire; fail fast offline (explicit, not echo)
	if isFakeKey(req.ApiKey) {
		log.Printf("[mocr] fake key, offline fallback model=%s", req.ModelId)
		return status.Error(codes.FailedPrecondition, "placeholder API key")
	}

	// Overall deadline so a hung provider cannot block the SSE forever
	// (shared across auto-switch attempts).
	timeout := 5 * time.Minute
	if configured, err := time.ParseDuration(os.Getenv("MOCR_GENERATION_TIMEOUT")); err == nil && configured > 0 {
		timeout = configured
	}
	ctx, cancel := context.WithTimeout(stream.Context(), timeout)
	defer cancel()

	thinkingLevel := ""
	if headers, ok := metadata.FromIncomingContext(stream.Context()); ok {
		if values := headers.Get("x-0kay-thinking-level"); len(values) > 0 {
			thinkingLevel = values[0]
		}
	}
	requestID := firstMeta(stream.Context(), "x-0kay-request-id")
	sessionID := firstMeta(stream.Context(), "x-0kay-session-id")

	// Model/credentials actually in use (swapped on auto-switch).
	curModel, curProvider, curBaseURL, curKey := req.ModelId, req.Provider, req.BaseUrl, req.ApiKey

	buildOpts := func(r *mocrv1.GenerateRequest) prov.GenerateOptions {
		opts := prov.GenerateOptions{
			Provider:      curProvider,
			BaseURL:       curBaseURL,
			APIKey:        curKey,
			ModelID:       curModel,
			Messages:      msgs,
			SystemPrompt:  r.SystemPrompt,
			MaxTokens:     int(r.MaxTokens),
			Temperature:   r.Temperature,
			Stream:        true,
			Thinking:      r.Thinking,
			ToolChoice:    r.ToolChoice,
			ThinkingLevel: thinkingLevel,
		}
		for _, t := range r.Tools {
			fn := t.GetFunction()
			if fn == nil || fn.GetName() == "" {
				continue
			}
			opts.Tools = append(opts.Tools, prov.ToolDef{
				Name:           fn.GetName(),
				Description:    fn.GetDescription(),
				ParametersJSON: fn.GetParametersJson(),
			})
		}
		if opts.MaxTokens <= 0 {
			opts.MaxTokens = 1024
		}
		return opts
	}

	rt := currentRuntime()
	attempts := 1
	if rt.AutoSwitch {
		attempts += rt.SwitchMaxAttempts
	}

	var targets []swapTarget
	var targetsReady bool
	var lastErr error
	sawEmpty := false

	for attempt := 0; attempt < attempts; attempt++ {
		if attempt > 0 {
			if !targetsReady {
				targetsReady = true
				if snap, ok := fetchProviderSnapshot(); ok {
					targets = swapTargets(req.ModelId, rt.FallbackModels, snap)
				}
			}
			if attempt-1 >= len(targets) {
				break
			}
			t := targets[attempt-1]
			log.Printf("[mocr] auto-switch %d/%d: model %s -> %s", attempt, attempts-1, curModel, t.model)
			curModel, curProvider, curBaseURL, curKey = t.model, t.cred.Provider, t.cred.BaseURL, t.cred.APIKey
		}

		var fullText strings.Builder
		chunks := 0
		info, err := prov.Generate(ctx, buildOpts(req), func(chunk string) bool {
			chunks++
			fullText.WriteString(chunk)
			if sendErr := stream.Send(&mocrv1.GenerateResponse{Chunk: chunk}); sendErr != nil {
				return false
			}
			return true
		})

		if err == nil {
			hasPayload := chunks > 0 || (info != nil && (len(info.ToolCalls) > 0 || info.ReasoningContent != ""))
			if hasPayload {
				return finishGenerate(req, curModel, info, &fullText, requestID, sessionID, stream)
			}
			// Empty response (no text / tool calls / reasoning) → switch model.
			log.Printf("[mocr] empty response model=%s; trying next model", curModel)
			sawEmpty = true
			continue
		}
		if chunks > 0 {
			// Content was already streamed — retrying would duplicate output.
			log.Printf("[mocr] provider failed mid-stream model=%s: %v", curModel, err)
			return status.Error(codes.Unavailable, "provider error: "+err.Error())
		}
		log.Printf("[mocr] real generate failed model=%s: %v", curModel, err)
		lastErr = err
		sawEmpty = false
	}

	if lastErr != nil {
		return status.Error(codes.Unavailable, "provider error: "+lastErr.Error())
	}
	if sawEmpty {
		return status.Error(codes.Unavailable, "empty response from all candidate models")
	}
	return status.Error(codes.Unavailable, "provider error")
}

// finishGenerate reports usage (on the model actually used) and sends the final Done response.
func finishGenerate(req *mocrv1.GenerateRequest, modelID string, info *prov.FinishInfo, fullText *strings.Builder, requestID, sessionID string, stream mocrv1.MocrService_GenerateServer) error {

	if info == nil {
		info = &prov.FinishInfo{FinishReason: "stop"}
	}

	promptTokens := info.PromptTokens
	completionTokens := info.OutputTokens
	if promptTokens == 0 {
		n := len(req.SystemPrompt)
		for _, m := range req.Messages {
			n += len(m.Content)
		}
		promptTokens = int32((n + 3) / 4)
	}
	if completionTokens == 0 {
		completionTokens = int32((len(fullText.String()) + 3) / 4)
	}
	reportUsage(requestID, sessionID, modelID, promptTokens, completionTokens)

	final := &mocrv1.GenerateResponse{
		Done:            true,
		FinishReason:    mapFinish(info.FinishReason),
		ThinkingContent: info.ReasoningContent,
		Usage: &mocrv1.TokenUsage{
			PromptTokens:     promptTokens,
			CompletionTokens: completionTokens,
			TotalTokens:      promptTokens + completionTokens,
		},
	}
	if len(info.ToolCalls) > 0 {
		final.Role = "assistant"
		final.Text = fullText.String()
		for _, tc := range info.ToolCalls {
			final.ToolCalls = append(final.ToolCalls, &mocrv1.ToolCall{
				Id:           tc.ID,
				Type:         "function",
				FunctionName: tc.Name,
				Arguments:    tc.Arguments,
			})
		}
	}
	return stream.Send(final)
}

func mapFinish(reason string) mocrv1.FinishReason {
	switch strings.ToLower(reason) {
	case "length", "max_tokens":
		return mocrv1.FinishReason_FINISH_REASON_LENGTH
	case "content_filter", "content_filter_result":
		return mocrv1.FinishReason_FINISH_REASON_CONTENT_FILTER
	case "error":
		return mocrv1.FinishReason_FINISH_REASON_ERROR
	default:
		return mocrv1.FinishReason_FINISH_REASON_STOP
	}
}

func firstMeta(ctx context.Context, key string) string {
	if headers, ok := metadata.FromIncomingContext(ctx); ok {
		if values := headers.Get(key); len(values) > 0 {
			return values[0]
		}
	}
	return ""
}

// splitIntoChunks splits text into chunks of approximately size n.
func splitIntoChunks(text string, n int) []string {
	var chunks []string
	for len(text) > 0 {
		if len(text) <= n {
			chunks = append(chunks, text)
			break
		}
		chunks = append(chunks, text[:n])
		text = text[n:]
	}
	return chunks
}
