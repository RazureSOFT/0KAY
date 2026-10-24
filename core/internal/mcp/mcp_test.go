package mcp

import (
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"os/exec"
	"path/filepath"
	"testing"
	"time"
)

func TestParseServers(t *testing.T) {
	cases := []struct {
		name string
		raw  string
		want int
	}{
		{"empty", "", 0},
		{"empty array", "[]", 0},
		{"broken json", "[{", 0},
		{"one stdio", `[{"id":"mail","transport":"stdio","command":["node","mail.js"]}]`, 1},
		{"one http", `[{"id":"docs","transport":"http","url":"http://127.0.0.1:9000/mcp"}]`, 1},
		{"missing id is dropped", `[{"transport":"http","url":"http://x"},{"id":"ok"}]`, 1},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := ParseServers(tc.raw); len(got) != tc.want {
				t.Fatalf("ParseServers(%q) = %d servers, want %d", tc.raw, len(got), tc.want)
			}
		})
	}
}

func TestTransportName(t *testing.T) {
	if got := TransportName(Server{Transport: "http"}); got != "http" {
		t.Fatalf("explicit transport = %q", got)
	}
	if got := TransportName(Server{Command: []string{"node"}}); got != "stdio" {
		t.Fatalf("command implies stdio, got %q", got)
	}
	if got := TransportName(Server{URL: "http://x"}); got != "http" {
		t.Fatalf("url implies http, got %q", got)
	}
}

func fakeHTTPMCP(t *testing.T, session string) *httptest.Server {
	t.Helper()
	return httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var message struct {
			ID     *int            `json:"id"`
			Method string          `json:"method"`
			Params json.RawMessage `json:"params"`
		}
		if err := json.NewDecoder(r.Body).Decode(&message); err != nil {
			http.Error(w, "bad json", http.StatusBadRequest)
			return
		}
		if message.Method == "initialize" {
			w.Header().Set("Mcp-Session-Id", session)
		} else if got := r.Header.Get("Mcp-Session-Id"); got != session {
			http.Error(w, "missing session", http.StatusBadRequest)
			return
		}
		if message.ID == nil {
			w.WriteHeader(http.StatusAccepted)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		switch message.Method {
		case "initialize":
			_ = json.NewEncoder(w).Encode(map[string]any{"jsonrpc": "2.0", "id": *message.ID, "result": map[string]any{"protocolVersion": protocolVersion, "capabilities": map[string]any{}}})
		case "tools/list":
			_ = json.NewEncoder(w).Encode(map[string]any{"jsonrpc": "2.0", "id": *message.ID, "result": map[string]any{"tools": []map[string]any{
				{"name": "echo", "description": "echo back", "inputSchema": map[string]any{"type": "object"}},
			}}})
		case "tools/call":
			var params struct {
				Name      string         `json:"name"`
				Arguments map[string]any `json:"arguments"`
			}
			_ = json.Unmarshal(message.Params, &params)
			_ = json.NewEncoder(w).Encode(map[string]any{"jsonrpc": "2.0", "id": *message.ID, "result": map[string]any{
				"content": []map[string]any{{"type": "text", "text": "echo:" + params.Name}},
			}})
		default:
			_ = json.NewEncoder(w).Encode(map[string]any{"jsonrpc": "2.0", "id": *message.ID, "error": map[string]any{"code": -32601, "message": "no such method"}})
		}
	}))
}

func TestHTTPClientRoundTrip(t *testing.T) {
	server := fakeHTTPMCP(t, "sess-1")
	defer server.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := StartHTTP(ctx, server.URL, nil)
	if err != nil {
		t.Fatalf("StartHTTP: %v", err)
	}
	defer client.Close()

	tools, err := client.ListTools(ctx)
	if err != nil {
		t.Fatalf("ListTools: %v", err)
	}
	if len(tools) != 1 || tools[0].Name != "echo" {
		t.Fatalf("tools = %+v", tools)
	}

	result, err := client.CallTool(ctx, "echo", map[string]any{"x": 1})
	if err != nil {
		t.Fatalf("CallTool: %v", err)
	}
	if !json.Valid(result) {
		t.Fatalf("result is not JSON: %s", result)
	}
}

func TestStdioClientRoundTrip(t *testing.T) {
	node, err := exec.LookPath("node")
	if err != nil {
		t.Skip("node not installed")
	}
	dir := t.TempDir()
	script := filepath.Join(dir, "server.mjs")
	source := `
let buffer = ''
process.stdin.on('data', (chunk) => {
  buffer += chunk.toString()
  let index
  while ((index = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, index).trim()
    buffer = buffer.slice(index + 1)
    if (!line) continue
    const message = JSON.parse(line)
    if (message.id === undefined) continue
    let result
    if (message.method === 'initialize') result = { protocolVersion: '2024-11-05', capabilities: {} }
    else if (message.method === 'tools/list') result = { tools: [{ name: 'ping' }] }
    else if (message.method === 'tools/call') result = { content: [{ type: 'text', text: 'pong' }] }
    else { process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: message.id, error: { code: -32601, message: 'nope' } }) + '\n'); continue }
    process.stdout.write(JSON.stringify({ jsonrpc: '2.0', id: message.id, result }) + '\n')
  }
})
`
	if err := os.WriteFile(script, []byte(source), 0o644); err != nil {
		t.Fatalf("write fake server: %v", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	client, err := StartStdio(ctx, []string{node, script})
	if err != nil {
		t.Fatalf("StartStdio: %v", err)
	}
	defer client.Close()

	tools, err := client.ListTools(ctx)
	if err != nil || len(tools) != 1 || tools[0].Name != "ping" {
		t.Fatalf("ListTools = %+v, %v", tools, err)
	}
	result, err := client.CallTool(ctx, "ping", nil)
	if err != nil {
		t.Fatalf("CallTool: %v", err)
	}
	if string(result) == "" {
		t.Fatal("empty result")
	}
}

func TestStdioClientReportsAMissingBinary(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if _, err := StartStdio(ctx, []string{"definitely-not-a-real-binary-0kay"}); err == nil {
		t.Fatal("expected an error for a missing binary")
	}
}
