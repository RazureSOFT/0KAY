package mcp

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"sync"
	"time"
)

// Streamable-HTTP transport: one POST per JSON-RPC message, one JSON answer
// (optionally preceded by SSE frames, which are skipped). The session id the
// server hands back on initialize must be echoed on every later request, or a
// stateful server treats each call as a new client.
type httpClient struct {
	url     string
	headers map[string]string
	client  *http.Client

	mu        sync.Mutex
	nextID    int
	sessionID string
}

// StartHTTP connects to an HTTP MCP endpoint and completes the handshake.
func StartHTTP(ctx context.Context, url string, headers map[string]string) (Client, error) {
	if strings.TrimSpace(url) == "" {
		return nil, fmt.Errorf("empty url")
	}
	c := &httpClient{
		url:     url,
		headers: headers,
		// No redirects: a server that redirects is either misconfigured or
		// pointing somewhere the caller did not authorise.
		client: &http.Client{Timeout: 120 * time.Second, CheckRedirect: func(*http.Request, []*http.Request) error { return http.ErrUseLastResponse }},
	}
	initCtx, cancel := context.WithTimeout(ctx, 20*time.Second)
	defer cancel()
	if _, err := c.call(initCtx, "initialize", map[string]any{
		"protocolVersion": protocolVersion,
		"capabilities":    map[string]any{},
		"clientInfo":      map[string]any{"name": "0kay-core", "version": "1.0.0"},
	}); err != nil {
		return nil, fmt.Errorf("initialize: %w", err)
	}
	if err := c.notify(ctx, "notifications/initialized", nil); err != nil {
		return nil, err
	}
	return c, nil
}

func (c *httpClient) post(ctx context.Context, payload map[string]any) (*http.Response, error) {
	encoded, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, c.url, bytes.NewReader(encoded))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json, text/event-stream")
	for key, value := range c.headers {
		req.Header.Set(key, value)
	}
	c.mu.Lock()
	session := c.sessionID
	c.mu.Unlock()
	if session != "" {
		req.Header.Set("Mcp-Session-Id", session)
	}
	return c.client.Do(req)
}

func (c *httpClient) call(ctx context.Context, method string, params any) (json.RawMessage, error) {
	c.mu.Lock()
	c.nextID++
	id := c.nextID
	c.mu.Unlock()

	payload := map[string]any{"jsonrpc": "2.0", "id": id, "method": method}
	if params != nil {
		payload["params"] = params
	}
	resp, err := c.post(ctx, payload)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	if session := resp.Header.Get("Mcp-Session-Id"); session != "" {
		c.mu.Lock()
		c.sessionID = session
		c.mu.Unlock()
	}
	body, err := io.ReadAll(io.LimitReader(resp.Body, 8<<20))
	if err != nil {
		return nil, err
	}
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return nil, fmt.Errorf("mcp http %d: %s", resp.StatusCode, strings.TrimSpace(string(body)))
	}
	message, err := decodeBody(body)
	if err != nil {
		return nil, err
	}
	if message.Error != nil {
		return nil, fmt.Errorf("%s (code %d)", message.Error.Message, message.Error.Code)
	}
	return message.Result, nil
}

// decodeBody accepts a bare JSON-RPC message or an SSE stream carrying one.
func decodeBody(body []byte) (*rpcMessage, error) {
	trimmed := bytes.TrimSpace(body)
	if len(trimmed) == 0 {
		return nil, fmt.Errorf("empty response")
	}
	if trimmed[0] == '{' {
		var message rpcMessage
		if err := json.Unmarshal(trimmed, &message); err != nil {
			return nil, err
		}
		return &message, nil
	}
	for _, line := range strings.Split(string(trimmed), "\n") {
		line = strings.TrimSpace(line)
		if !strings.HasPrefix(line, "data:") {
			continue
		}
		var message rpcMessage
		if err := json.Unmarshal([]byte(strings.TrimSpace(strings.TrimPrefix(line, "data:"))), &message); err == nil {
			return &message, nil
		}
	}
	return nil, fmt.Errorf("no JSON-RPC message in response")
}

func (c *httpClient) notify(ctx context.Context, method string, params any) error {
	payload := map[string]any{"jsonrpc": "2.0", "method": method}
	if params != nil {
		payload["params"] = params
	}
	resp, err := c.post(ctx, payload)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	_, _ = io.Copy(io.Discard, resp.Body)
	return nil
}

func (c *httpClient) ListTools(ctx context.Context) ([]Tool, error) {
	raw, err := c.call(ctx, "tools/list", map[string]any{})
	if err != nil {
		return nil, err
	}
	var body struct {
		Tools []Tool `json:"tools"`
	}
	if err := json.Unmarshal(raw, &body); err != nil {
		return nil, fmt.Errorf("tools/list: %w", err)
	}
	return body.Tools, nil
}

func (c *httpClient) CallTool(ctx context.Context, name string, args map[string]any) (json.RawMessage, error) {
	if args == nil {
		args = map[string]any{}
	}
	return c.call(ctx, "tools/call", map[string]any{"name": name, "arguments": args})
}

func (c *httpClient) Close() error { return nil }
