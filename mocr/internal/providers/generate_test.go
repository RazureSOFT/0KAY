package providers

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"reflect"
	"testing"
)

// TestMain allows loopback httptest servers, which the SSRF guard blocks by
// default (same as a user running a local model server).
func TestMain(m *testing.M) {
	os.Setenv("MOCR_SSRF_ALLOW_PRIVATE", "1")
	os.Exit(m.Run())
}

func TestIncompleteStreamAndThinking(t *testing.T) {
	var body map[string]interface{}
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		json.NewDecoder(r.Body).Decode(&body)
		w.Header().Set("Content-Type", "text/event-stream")
		w.Write([]byte("data: {\"choices\":[{\"delta\":{\"content\":\"partial\"}}]}\n\n"))
	}))
	defer upstream.Close()
	_, err := Generate(context.Background(), GenerateOptions{Provider: "deepseek", BaseURL: upstream.URL, APIKey: "mock", ModelID: "deepseek", Stream: true, Thinking: true}, func(string) bool { return true })
	if err == nil {
		t.Fatal("truncated stream succeeded")
	}
	if body["thinking"].(map[string]interface{})["type"] != "enabled" {
		t.Fatal("thinking missing")
	}
}

func TestOpenAIUsageFromStream(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var body map[string]interface{}
		json.NewDecoder(r.Body).Decode(&body)
		if body["stream_options"] == nil {
			t.Error("usage not requested")
		}
		w.Header().Set("Content-Type", "text/event-stream")
		w.Write([]byte("data: {\"choices\":[{\"delta\":{\"content\":\"ok\"},\"finish_reason\":\"stop\"}]}\n\ndata: {\"choices\":[],\"usage\":{\"prompt_tokens\":123,\"completion_tokens\":45}}\n\ndata: [DONE]\n\n"))
	}))
	defer upstream.Close()
	info, err := Generate(context.Background(), GenerateOptions{Provider: "openai", BaseURL: upstream.URL, APIKey: "mock", ModelID: "mock", Stream: true}, func(string) bool { return true })
	if err != nil {
		t.Fatal(err)
	}
	if info.PromptTokens != 123 || info.OutputTokens != 45 {
		t.Fatalf("usage: %+v", info)
	}
}

func TestOpenAIMessagesRoundTripsReasoning(t *testing.T) {
	msgs := []ChatMessage{{Role: "assistant", Content: "hello", ReasoningContent: "prior thought"}, {Role: "assistant", Content: "tool next", ToolCalls: []ToolCall{{ID: "1", Name: "bash", Arguments: "{}"}}, ReasoningContent: "call thought"}}
	out := openAIMessages(msgs, true, false)
	if got := out[0]["reasoning_content"]; got != "prior thought" {
		t.Fatalf("plain assistant reasoning=%v", got)
	}
	if got := out[1]["reasoning_content"]; got != "call thought" {
		t.Fatalf("tool assistant reasoning=%v", got)
	}
	off := openAIMessages(msgs, false, true)
	if _, ok := off[0]["reasoning_content"]; ok {
		t.Fatal("reasoning sent when thinking disabled")
	}
	tool := openAIMessages([]ChatMessage{{Role: "tool", Content: "ok", ToolCallID: "1"}}, true, false)
	want := []map[string]interface{}{{"role": "tool", "content": "ok", "tool_call_id": "1"}}
	if !reflect.DeepEqual(tool, want) {
		t.Fatalf("tool messages changed: %#v", tool)
	}
}

func TestOpenAIMessagesStructuralEmptyReasoning(t *testing.T) {
	msgs := []ChatMessage{{Role: "assistant", Content: "compacted summary", ToolCalls: []ToolCall{{ID: "1", Name: "bash", Arguments: "{}"}}}}
	ds := openAIMessages(msgs, true, true)
	got, ok := ds[0]["reasoning_content"]
	if !ok || got != "" {
		t.Fatalf("deepseek empty reasoning=%v present=%v", got, ok)
	}
	other := openAIMessages(msgs, true, false)
	if _, present := other[0]["reasoning_content"]; present {
		t.Fatal("non-deepseek should omit empty reasoning")
	}
	plain := openAIMessages([]ChatMessage{{Role: "assistant", Content: "hi"}}, true, true)
	if _, present := plain[0]["reasoning_content"]; !present {
		t.Fatal("deepseek structural key missing on plain assistant")
	}
}

func TestStreamAccumulatesReasoningContent(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/event-stream")
		w.Write([]byte("data: {\"choices\":[{\"delta\":{\"reasoning_content\":\"think \"}}]}\n\ndata: {\"choices\":[{\"delta\":{\"reasoning_content\":\"more\",\"content\":\"hi\"},\"finish_reason\":\"stop\"}]}\n\ndata: [DONE]\n\n"))
	}))
	defer upstream.Close()
	info, err := Generate(context.Background(), GenerateOptions{Provider: "deepseek", BaseURL: upstream.URL, APIKey: "mock", ModelID: "deepseek", Stream: true, Thinking: true}, func(string) bool { return true })
	if err != nil {
		t.Fatal(err)
	}
	if info.ReasoningContent != "think more" {
		t.Fatalf("reasoning=%q", info.ReasoningContent)
	}
}

func TestOpenAIMultimodalContent(t *testing.T) {
	textOnly := openAIMessages([]ChatMessage{{Role: "user", Content: "hi"}}, false, false)
	if _, ok := textOnly[0]["content"].(string); !ok {
		t.Fatalf("text-only content must stay a string, got %#v", textOnly[0]["content"])
	}
	msg := ChatMessage{Role: "user", Parts: []MessagePart{
		{Type: "text", Text: "look at this"},
		{Type: "image", ImageURL: "data:image/png;base64,AAAA", MimeType: "image/png"},
	}}
	wire := openAIMessages([]ChatMessage{msg}, false, false)
	parts, ok := wire[0]["content"].([]map[string]interface{})
	if !ok || len(parts) != 2 {
		t.Fatalf("expected 2 parts, got %#v", wire[0]["content"])
	}
	if parts[1]["type"] != "image_url" {
		t.Fatalf("second part not image_url: %#v", parts[1])
	}
}

func TestAnthropicMultimodalContent(t *testing.T) {
	msg := ChatMessage{Role: "user", Parts: []MessagePart{
		{Type: "text", Text: "hi"},
		{Type: "image", ImageURL: "data:image/png;base64,ZZZZ", MimeType: "image/png"},
	}}
	wire := anthropicMessages([]ChatMessage{msg})
	blocks, ok := wire[0]["content"].([]map[string]interface{})
	if !ok || len(blocks) != 2 || blocks[1]["type"] != "image" {
		t.Fatalf("bad blocks %#v", wire[0]["content"])
	}
	src, _ := blocks[1]["source"].(map[string]interface{})
	if src["media_type"] != "image/png" || src["data"] != "ZZZZ" {
		t.Fatalf("bad image source %#v", src)
	}
}

func TestReasoningEffortForwardedFromThinkingLevel(t *testing.T) {
	var got map[string]any
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_ = json.NewDecoder(r.Body).Decode(&got)
		w.Header().Set("Content-Type", "text/event-stream")
		_, _ = w.Write([]byte("data: {\"choices\":[{\"delta\":{\"content\":\"ok\"},\"finish_reason\":\"stop\"}]}\n\ndata: [DONE]\n\n"))
	}))
	defer upstream.Close()
	_, err := Generate(context.Background(), GenerateOptions{Provider: "custom", BaseURL: upstream.URL, APIKey: "mock", ModelID: "deepseek-v4-flash-free", Thinking: true, ThinkingLevel: "max", Stream: true}, func(string) bool { return true })
	if err != nil {
		t.Fatal(err)
	}
	if got["reasoning_effort"] != "high" {
		t.Fatalf("reasoning_effort=%v", got["reasoning_effort"])
	}
	if _, ok := got["thinking"]; !ok {
		t.Fatalf("deepseek thinking toggle missing")
	}
}

func TestReasoningEffortForwardedForGenericProvider(t *testing.T) {
	var got map[string]any
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		_ = json.NewDecoder(r.Body).Decode(&got)
		w.Header().Set("Content-Type", "text/event-stream")
		_, _ = w.Write([]byte("data: {\"choices\":[{\"delta\":{\"content\":\"ok\"},\"finish_reason\":\"stop\"}]}\n\ndata: [DONE]\n\n"))
	}))
	defer upstream.Close()
	_, err := Generate(context.Background(), GenerateOptions{Provider: "custom", BaseURL: upstream.URL, APIKey: "mock", ModelID: "glm-5", Thinking: true, ThinkingLevel: "low", Stream: true}, func(string) bool { return true })
	if err != nil {
		t.Fatal(err)
	}
	if got["reasoning_effort"] != "low" {
		t.Fatalf("generic reasoning_effort=%v", got["reasoning_effort"])
	}
}
