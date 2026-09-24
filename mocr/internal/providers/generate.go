package providers

import (
	"bufio"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"sort"
	"strings"
	"time"
)

// ToolDef is a provider-agnostic callable function definition.
type ToolDef struct {
	Name           string
	Description    string
	ParametersJSON string
}

// ToolCall is a model-requested function invocation.
type ToolCall struct {
	ID        string
	Name      string
	Arguments string
}

// ChatMessage is a provider-agnostic chat message (supports tool turns).
type ChatMessage struct {
	Role       string     `json:"role"`
	Content    string     `json:"content"`
	ToolCallID string     `json:"tool_call_id,omitempty"`
	ToolCalls  []ToolCall `json:"-"`
}

// GenerateOptions configures a real provider call.
type GenerateOptions struct {
	Provider     string
	BaseURL      string
	APIKey       string
	ModelID      string
	Messages     []ChatMessage
	SystemPrompt string
	MaxTokens    int
	Temperature  float64
	Stream       bool
	Thinking     bool
	Tools        []ToolDef
	ToolChoice   string
	// OnToolCall is invoked for each tool call the model requests.
	OnToolCall func(ToolCall) bool
}

// StreamFunc receives text chunks; return false to stop.
type StreamFunc func(chunk string) bool

// FinishInfo is reported after a successful generate.
type FinishInfo struct {
	FinishReason string
	PromptTokens int32
	OutputTokens int32
	ToolCalls    []ToolCall
}

// Generate streams from a real provider (OpenAI-compatible or Anthropic).
func Generate(ctx context.Context, opts GenerateOptions, onChunk StreamFunc) (*FinishInfo, error) {
	if opts.BaseURL == "" || opts.APIKey == "" {
		return nil, fmt.Errorf("missing base_url or api_key")
	}
	if opts.ModelID == "" {
		return nil, fmt.Errorf("model_id is required")
	}
	if opts.MaxTokens <= 0 {
		opts.MaxTokens = 1024
	}
	if opts.Temperature == 0 {
		opts.Temperature = 0.7
	}

	prov := strings.ToLower(strings.TrimSpace(opts.Provider))
	isAnthropic := prov == "anthropic" || strings.Contains(strings.ToLower(opts.BaseURL), "anthropic.com")

	msgs := opts.Messages
	if opts.SystemPrompt != "" {
		// Anthropic uses system field; OpenAI can use system role
		if !isAnthropic {
			msgs = append([]ChatMessage{{Role: "system", Content: opts.SystemPrompt}}, msgs...)
		}
	}

	if isAnthropic {
		return generateAnthropic(ctx, opts, msgs, onChunk)
	}
	return generateOpenAICompatible(ctx, opts, msgs, onChunk)
}

// emitTools fires the OnToolCall callback for each call.
func emitTools(opts GenerateOptions, calls []ToolCall) {
	if opts.OnToolCall == nil {
		return
	}
	for _, tc := range calls {
		if !opts.OnToolCall(tc) {
			return
		}
	}
}

func openAITools(tools []ToolDef) []map[string]interface{} {
	out := make([]map[string]interface{}, 0, len(tools))
	for _, t := range tools {
		var params interface{} = map[string]interface{}{"type": "object", "properties": map[string]interface{}{}}
		if strings.TrimSpace(t.ParametersJSON) != "" {
			var parsed interface{}
			if err := json.Unmarshal([]byte(t.ParametersJSON), &parsed); err == nil {
				params = parsed
			}
		}
		out = append(out, map[string]interface{}{
			"type": "function",
			"function": map[string]interface{}{
				"name":        t.Name,
				"description": t.Description,
				"parameters":  params,
			},
		})
	}
	return out
}

// openAIMessages converts normalized messages to OpenAI request JSON.
func openAIMessages(msgs []ChatMessage) []map[string]interface{} {
	out := make([]map[string]interface{}, 0, len(msgs))
	for _, m := range msgs {
		role := m.Role
		if role == "" {
			role = "user"
		}
		switch {
		case role == "assistant" && len(m.ToolCalls) > 0:
			calls := make([]map[string]interface{}, 0, len(m.ToolCalls))
			for _, tc := range m.ToolCalls {
				calls = append(calls, map[string]interface{}{
					"id":   tc.ID,
					"type": "function",
					"function": map[string]interface{}{
						"name":      tc.Name,
						"arguments": tc.Arguments,
					},
				})
			}
			entry := map[string]interface{}{"role": "assistant", "tool_calls": calls}
			if m.Content != "" {
				entry["content"] = m.Content
			}
			out = append(out, entry)
		case role == "tool":
			entry := map[string]interface{}{"role": "tool", "content": m.Content}
			if m.ToolCallID != "" {
				entry["tool_call_id"] = m.ToolCallID
			}
			out = append(out, entry)
		default:
			out = append(out, map[string]interface{}{"role": role, "content": m.Content})
		}
	}
	return out
}

func generateOpenAICompatible(ctx context.Context, opts GenerateOptions, msgs []ChatMessage, onChunk StreamFunc) (*FinishInfo, error) {
	base := strings.TrimSuffix(opts.BaseURL, "/")
	url := base + "/chat/completions"

	body := map[string]interface{}{
		"model":       opts.ModelID,
		"messages":    openAIMessages(msgs),
		"max_tokens":  opts.MaxTokens,
		"temperature": opts.Temperature,
		"stream":      opts.Stream,
	}
	if len(opts.Tools) > 0 {
		body["tools"] = openAITools(opts.Tools)
		switch opts.ToolChoice {
		case "", "auto":
			body["tool_choice"] = "auto"
		case "none":
			body["tool_choice"] = "none"
		case "required":
			body["tool_choice"] = "required"
		default:
			body["tool_choice"] = map[string]interface{}{
				"type": "function", "function": map[string]interface{}{"name": opts.ToolChoice},
			}
		}
	}

	payload, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+opts.APIKey)

	// Dial + header timeout; full body relies on ctx
	client := &http.Client{
		Timeout: 0,
		Transport: &http.Transport{
			DialContext:           (&net.Dialer{Timeout: 10 * time.Second}).DialContext,
			TLSHandshakeTimeout:   10 * time.Second,
			ResponseHeaderTimeout: 45 * time.Second,
		},
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		b, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return nil, fmt.Errorf("provider error %d: %s", resp.StatusCode, string(b))
	}

	if !opts.Stream {
		var parsed struct {
			Choices []struct {
				Message struct {
					Content   string `json:"content"`
					ToolCalls []struct {
						ID       string `json:"id"`
						Type     string `json:"type"`
						Function struct {
							Name      string `json:"name"`
							Arguments string `json:"arguments"`
						} `json:"function"`
					} `json:"tool_calls"`
				} `json:"message"`
				FinishReason string `json:"finish_reason"`
			} `json:"choices"`
			Usage struct {
				PromptTokens     int32 `json:"prompt_tokens"`
				CompletionTokens int32 `json:"completion_tokens"`
			} `json:"usage"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&parsed); err != nil {
			return nil, err
		}
		info := &FinishInfo{FinishReason: "stop"}
		if len(parsed.Choices) > 0 {
			text := parsed.Choices[0].Message.Content
			info.FinishReason = parsed.Choices[0].FinishReason
			if info.FinishReason == "" {
				info.FinishReason = "stop"
			}
			if text != "" {
				onChunk(text)
			}
			for _, tc := range parsed.Choices[0].Message.ToolCalls {
				info.ToolCalls = append(info.ToolCalls, ToolCall{
					ID:        tc.ID,
					Name:      tc.Function.Name,
					Arguments: tc.Function.Arguments,
				})
			}
			emitTools(opts, info.ToolCalls)
		}
		info.PromptTokens = parsed.Usage.PromptTokens
		info.OutputTokens = parsed.Usage.CompletionTokens
		return info, nil
	}

	// SSE stream with idle timeout (context has no deadline for streaming)
	idleCtx, cancelIdle := context.WithTimeout(ctx, 60*time.Second)
	defer cancelIdle()
	go func() {
		select {
		case <-idleCtx.Done():
			if resp.Body != nil {
				resp.Body.Close()
			}
		}
	}()
	scanner := bufio.NewScanner(resp.Body)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)
	var finish string
	var pt, ot int32
	toolAcc := map[int]*ToolCall{}

	for scanner.Scan() {
		line := scanner.Text()
		if !strings.HasPrefix(line, "data:") {
			continue
		}
		data := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		if data == "[DONE]" {
			break
		}
		var chunk struct {
			Choices []struct {
				Delta struct {
					Content   string `json:"content"`
					ToolCalls []struct {
						Index    *int   `json:"index"`
						ID       string `json:"id"`
						Type     string `json:"type"`
						Function struct {
							Name      string `json:"name"`
							Arguments string `json:"arguments"`
						} `json:"function"`
					} `json:"tool_calls"`
				} `json:"delta"`
				FinishReason *string `json:"finish_reason"`
			} `json:"choices"`
			Usage *struct {
				PromptTokens     int32 `json:"prompt_tokens"`
				CompletionTokens int32 `json:"completion_tokens"`
			} `json:"usage"`
		}
		if err := json.Unmarshal([]byte(data), &chunk); err != nil {
			continue
		}
		if chunk.Usage != nil {
			pt = chunk.Usage.PromptTokens
			ot = chunk.Usage.CompletionTokens
		}
		for _, c := range chunk.Choices {
			if c.Delta.Content != "" {
				if !onChunk(c.Delta.Content) {
					return &FinishInfo{FinishReason: "stop", PromptTokens: pt, OutputTokens: ot, ToolCalls: sortedToolCalls(toolAcc)}, nil
				}
			}
			for _, tc := range c.Delta.ToolCalls {
				idx := 0
				if tc.Index != nil {
					idx = *tc.Index
				}
				acc := toolAcc[idx]
				if acc == nil {
					acc = &ToolCall{}
					toolAcc[idx] = acc
				}
				if tc.ID != "" {
					acc.ID = tc.ID
				}
				if tc.Function.Name != "" {
					acc.Name = tc.Function.Name
				}
				if tc.Function.Arguments != "" {
					acc.Arguments += tc.Function.Arguments
				}
			}
			if c.FinishReason != nil && *c.FinishReason != "" {
				finish = *c.FinishReason
			}
		}
	}
	if err := scanner.Err(); err != nil {
		return nil, err
	}
	if finish == "" {
		finish = "stop"
	}
	calls := sortedToolCalls(toolAcc)
	emitTools(opts, calls)
	return &FinishInfo{FinishReason: finish, PromptTokens: pt, OutputTokens: ot, ToolCalls: calls}, nil
}

// sortedToolCalls flattens the index-keyed accumulator in stable order.
func sortedToolCalls(acc map[int]*ToolCall) []ToolCall {
	if len(acc) == 0 {
		return nil
	}
	idxs := make([]int, 0, len(acc))
	for i := range acc {
		idxs = append(idxs, i)
	}
	sort.Ints(idxs)
	out := make([]ToolCall, 0, len(idxs))
	for _, i := range idxs {
		out = append(out, *acc[i])
	}
	return out
}

func anthropicTools(tools []ToolDef) []map[string]interface{} {
	out := make([]map[string]interface{}, 0, len(tools))
	for _, t := range tools {
		var schema interface{} = map[string]interface{}{"type": "object", "properties": map[string]interface{}{}}
		if strings.TrimSpace(t.ParametersJSON) != "" {
			var parsed interface{}
			if err := json.Unmarshal([]byte(t.ParametersJSON), &parsed); err == nil {
				schema = parsed
			}
		}
		out = append(out, map[string]interface{}{
			"name":         t.Name,
			"description":  t.Description,
			"input_schema": schema,
		})
	}
	return out
}

func anthropicToolChoice(choice string) interface{} {
	switch choice {
	case "", "auto":
		return map[string]interface{}{"type": "auto"}
	case "none":
		return map[string]interface{}{"type": "none"}
	case "required":
		return map[string]interface{}{"type": "any"}
	default:
		return map[string]interface{}{"type": "tool", "name": choice}
	}
}

// anthropicMessages builds Anthropic message content blocks (tool_use/tool_result aware).
func anthropicMessages(msgs []ChatMessage) []map[string]interface{} {
	out := make([]map[string]interface{}, 0, len(msgs))
	var pendingToolResults []map[string]interface{}
	flushResults := func() {
		if len(pendingToolResults) > 0 {
			out = append(out, map[string]interface{}{"role": "user", "content": pendingToolResults})
			pendingToolResults = nil
		}
	}
	for _, m := range msgs {
		switch {
		case m.Role == "system":
			continue
		case m.Role == "tool":
			pendingToolResults = append(pendingToolResults, map[string]interface{}{
				"type":        "tool_result",
				"tool_use_id": m.ToolCallID,
				"content":     m.Content,
			})
		case m.Role == "assistant" && len(m.ToolCalls) > 0:
			flushResults()
			blocks := make([]map[string]interface{}, 0, len(m.ToolCalls)+1)
			if m.Content != "" {
				blocks = append(blocks, map[string]interface{}{"type": "text", "text": m.Content})
			}
			for _, tc := range m.ToolCalls {
				var input interface{} = map[string]interface{}{}
				if strings.TrimSpace(tc.Arguments) != "" {
					_ = json.Unmarshal([]byte(tc.Arguments), &input)
				}
				blocks = append(blocks, map[string]interface{}{
					"type":  "tool_use",
					"id":    tc.ID,
					"name":  tc.Name,
					"input": input,
				})
			}
			out = append(out, map[string]interface{}{"role": "assistant", "content": blocks})
		default:
			flushResults()
			role := m.Role
			if role != "assistant" {
				role = "user"
			}
			out = append(out, map[string]interface{}{"role": role, "content": m.Content})
		}
	}
	flushResults()
	return out
}

func generateAnthropic(ctx context.Context, opts GenerateOptions, msgs []ChatMessage, onChunk StreamFunc) (*FinishInfo, error) {
	base := strings.TrimSuffix(opts.BaseURL, "/")
	// Accept both https://api.anthropic.com and .../v1
	if !strings.HasSuffix(base, "/v1") {
		base += "/v1"
	}
	url := base + "/messages"

	system := opts.SystemPrompt
	for _, m := range msgs {
		if m.Role == "system" && system == "" {
			system = m.Content
		}
	}
	anthMsgs := anthropicMessages(msgs)
	if len(anthMsgs) == 0 {
		return nil, fmt.Errorf("no messages")
	}

	body := map[string]interface{}{
		"model":      opts.ModelID,
		"messages":   anthMsgs,
		"max_tokens": opts.MaxTokens,
		"stream":     opts.Stream,
	}
	if system != "" {
		body["system"] = system
	}
	if len(opts.Tools) > 0 {
		body["tools"] = anthropicTools(opts.Tools)
		if opts.ToolChoice != "" {
			body["tool_choice"] = anthropicToolChoice(opts.ToolChoice)
		}
	}

	payload, err := json.Marshal(body)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(payload))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("x-api-key", opts.APIKey)
	req.Header.Set("anthropic-version", "2023-06-01")

	client := &http.Client{
		Timeout: 0,
		Transport: &http.Transport{
			DialContext:           (&net.Dialer{Timeout: 10 * time.Second}).DialContext,
			TLSHandshakeTimeout:   10 * time.Second,
			ResponseHeaderTimeout: 45 * time.Second,
		},
	}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		b, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
		return nil, fmt.Errorf("provider error %d: %s", resp.StatusCode, string(b))
	}

	if !opts.Stream {
		var parsed struct {
			Content []struct {
				Type  string          `json:"type"`
				Text  string          `json:"text"`
				ID    string          `json:"id"`
				Name  string          `json:"name"`
				Input json.RawMessage `json:"input"`
			} `json:"content"`
			StopReason string `json:"stop_reason"`
			Usage      struct {
				InputTokens  int32 `json:"input_tokens"`
				OutputTokens int32 `json:"output_tokens"`
			} `json:"usage"`
		}
		if err := json.NewDecoder(resp.Body).Decode(&parsed); err != nil {
			return nil, err
		}
		var text strings.Builder
		info := &FinishInfo{FinishReason: parsed.StopReason}
		for _, c := range parsed.Content {
			switch c.Type {
			case "text":
				text.WriteString(c.Text)
			case "tool_use":
				info.ToolCalls = append(info.ToolCalls, ToolCall{
					ID:        c.ID,
					Name:      c.Name,
					Arguments: string(c.Input),
				})
			}
		}
		if text.Len() > 0 {
			onChunk(text.String())
		}
		if info.FinishReason == "" {
			info.FinishReason = "stop"
		}
		emitTools(opts, info.ToolCalls)
		return &FinishInfo{FinishReason: info.FinishReason, PromptTokens: parsed.Usage.InputTokens, OutputTokens: parsed.Usage.OutputTokens, ToolCalls: info.ToolCalls}, nil
	}

	// SSE stream
	idleCtx, cancelIdle := context.WithTimeout(ctx, 60*time.Second)
	defer cancelIdle()
	go func() {
		<-idleCtx.Done()
		_ = resp.Body.Close()
	}()
	scanner := bufio.NewScanner(resp.Body)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)
	var finish string
	var pt, ot int32
	// current tool_use block being streamed
	var curCall *ToolCall
	var calls []ToolCall

	for scanner.Scan() {
		line := scanner.Text()
		if !strings.HasPrefix(line, "data:") {
			continue
		}
		data := strings.TrimSpace(strings.TrimPrefix(line, "data:"))
		if data == "" || data == "[DONE]" {
			continue
		}
		var evt struct {
			Type         string `json:"type"`
			Index        int    `json:"index"`
			ContentBlock struct {
				Type  string `json:"type"`
				ID    string `json:"id"`
				Name  string `json:"name"`
			} `json:"content_block"`
			Delta struct {
				Type        string `json:"type"`
				Text        string `json:"text"`
				PartialJSON string `json:"partial_json"`
				StopReason  string `json:"stop_reason"`
			} `json:"delta"`
			Usage *struct {
				InputTokens  int32 `json:"input_tokens"`
				OutputTokens int32 `json:"output_tokens"`
			} `json:"usage"`
		}
		if err := json.Unmarshal([]byte(data), &evt); err != nil {
			continue
		}
		if evt.Usage != nil {
			pt = evt.Usage.InputTokens
			ot = evt.Usage.OutputTokens
		}
		switch evt.Type {
		case "content_block_start":
			if evt.ContentBlock.Type == "tool_use" {
				curCall = &ToolCall{ID: evt.ContentBlock.ID, Name: evt.ContentBlock.Name}
			}
		case "content_block_delta":
			if evt.Delta.Type == "input_json_delta" && curCall != nil {
				curCall.Arguments += evt.Delta.PartialJSON
			} else if evt.Delta.Text != "" {
				if !onChunk(evt.Delta.Text) {
					return &FinishInfo{FinishReason: "stop", PromptTokens: pt, OutputTokens: ot, ToolCalls: calls}, nil
				}
			}
		case "content_block_stop":
			if curCall != nil {
				calls = append(calls, *curCall)
				curCall = nil
			}
		case "message_delta":
			if evt.Delta.StopReason != "" {
				finish = evt.Delta.StopReason
			}
		}
	}
	if err := scanner.Err(); err != nil {
		return nil, err
	}
	if finish == "" {
		finish = "end_turn"
	}
	emitTools(opts, calls)
	return &FinishInfo{FinishReason: finish, PromptTokens: pt, OutputTokens: ot, ToolCalls: calls}, nil
}

// Ensure time is referenced if needed later.
var _ = time.Second
