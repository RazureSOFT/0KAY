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
	"0kay/mocr/internal/selector"
	prov "0kay/mocr/internal/providers"
	"google.golang.org/grpc/codes"
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
			ID:                   m.ID,
			Provider:             m.Provider,
			SupportsThinking:     m.SupportsThinking,
			MaxContextLength:     128000,
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
			ModelId:                result.ThinkModel.ID,
			Provider:               result.ThinkModel.Provider,
			EstimatedCostPerToken: result.ThinkModel.EstimatedCostPerToken,
			SupportsThinking:       result.ThinkModel.SupportsThinking,
			MaxContextLength:       int32(result.ThinkModel.MaxContextLength),
		},
		OutputModel: &mocrv1.ModelSpec{
			ModelId:                result.OutputModel.ID,
			Provider:               result.OutputModel.Provider,
			EstimatedCostPerToken: result.OutputModel.EstimatedCostPerToken,
			SupportsThinking:       result.OutputModel.SupportsThinking,
			MaxContextLength:       int32(result.OutputModel.MaxContextLength),
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
		cm := prov.ChatMessage{Role: m.Role, Content: m.Content, ToolCallID: m.ToolCallId}
		for _, tc := range m.ToolCalls {
			cm.ToolCalls = append(cm.ToolCalls, prov.ToolCall{
				ID:        tc.Id,
				Name:      tc.FunctionName,
				Arguments: tc.Arguments,
			})
		}
		msgs = append(msgs, cm)
	}

	opts := prov.GenerateOptions{
		Provider:     req.Provider,
		BaseURL:      req.BaseUrl,
		APIKey:       req.ApiKey,
		ModelID:      req.ModelId,
		Messages:     msgs,
		SystemPrompt: req.SystemPrompt,
		MaxTokens:    int(req.MaxTokens),
		Temperature:  req.Temperature,
		Stream:       true,
		Thinking:     req.Thinking,
		ToolChoice:   req.ToolChoice,
	}
	for _, t := range req.Tools {
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

	// Fake/test keys hang or 401 on the wire; fail fast offline (explicit, not echo)
	if isFakeKey(req.ApiKey) {
		log.Printf("[mocr] fake key, offline fallback model=%s", req.ModelId)
		return status.Error(codes.FailedPrecondition, "placeholder API key")
	}

	// Overall deadline so a hung provider cannot block the SSE forever
	timeout:=5*time.Minute
	if configured,err:=time.ParseDuration(os.Getenv("MOCR_GENERATION_TIMEOUT"));err==nil && configured>0 {timeout=configured}
	ctx, cancel := context.WithTimeout(stream.Context(), timeout)
	defer cancel()

	var fullText strings.Builder
	info, err := prov.Generate(ctx, opts, func(chunk string) bool {
		fullText.WriteString(chunk)
		if err := stream.Send(&mocrv1.GenerateResponse{Chunk: chunk}); err != nil {
			return false
		}
		return true
	})
	if err != nil {
		// Real credentials were present but the provider failed — surface the error
		// instead of silently echoing so callers can distinguish offline/failure.
		log.Printf("[mocr] real generate failed model=%s: %v", req.ModelId, err)
		return status.Error(codes.Unavailable, "provider error: "+err.Error())
	}

	if info == nil {
		info = &prov.FinishInfo{FinishReason: "stop"}
	}

	promptTokens := info.PromptTokens
	if promptTokens == 0 {
		promptTokens = 10
	}
	completionTokens := info.OutputTokens
	if completionTokens == 0 {
		completionTokens = 1
	}

	final := &mocrv1.GenerateResponse{
		Done:         true,
		FinishReason: mapFinish(info.FinishReason),
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

// generateOffline streams an explicit offline/error notice (never pretends to be a real reply).
func (s *MocrServiceServer) generateOffline(req *mocrv1.GenerateRequest, stream mocrv1.MocrService_GenerateServer, reason string) error {
	response := fmt.Sprintf("[mocr offline] model=%s reason=%s", req.ModelId, reason)
	for _, chunk := range splitIntoChunks(response, 40) {
		if err := stream.Send(&mocrv1.GenerateResponse{Chunk: chunk}); err != nil {
			return err
		}
	}
	completionTokens := int32(len(response) / 4)
	return stream.Send(&mocrv1.GenerateResponse{
		Done:         true,
		FinishReason: mocrv1.FinishReason_FINISH_REASON_ERROR,
		Usage: &mocrv1.TokenUsage{
			PromptTokens:     0,
			CompletionTokens: completionTokens,
			TotalTokens:      completionTokens,
		},
	})
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
