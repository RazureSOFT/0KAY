package mcp

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

type Server struct {
	ID        string            `json:"id"`
	Transport string            `json:"transport,omitempty"`
	Command   []string          `json:"command,omitempty"`
	Args      []string          `json:"args,omitempty"`
	URL       string            `json:"url,omitempty"`
	Headers   map[string]string `json:"headers,omitempty"`
	Options   json.RawMessage   `json:"options,omitempty"`
}

func ParseServers(raw string) []Server {
	trimmed := strings.TrimSpace(raw)
	if trimmed == "" || trimmed == "[]" {
		return nil
	}
	var servers []Server
	if err := json.Unmarshal([]byte(trimmed), &servers); err != nil {
		return nil
	}
	out := make([]Server, 0, len(servers))
	for _, server := range servers {
		if strings.TrimSpace(server.ID) == "" {
			continue
		}
		out = append(out, server)
	}
	return out
}

type entry struct {
	client Client
	tools  []Tool
	at     time.Time
}

// one registry, one set of live connections. everything else is a client.
type Registry struct {
	mu       sync.Mutex
	entries  map[string]*entry
	toolsTTL time.Duration
}

func NewRegistry() *Registry {
	return &Registry{entries: map[string]*entry{}, toolsTTL: 30 * time.Second}
}

func (r *Registry) Client(ctx context.Context, server Server) (Client, error) {
	r.mu.Lock()
	if existing, ok := r.entries[server.ID]; ok {
		r.mu.Unlock()
		return existing.client, nil
	}
	r.mu.Unlock()

	client, err := start(ctx, server)
	if err != nil {
		return nil, err
	}
	r.mu.Lock()
	if existing, ok := r.entries[server.ID]; ok {
		r.mu.Unlock()
		_ = client.Close()
		return existing.client, nil
	}
	r.entries[server.ID] = &entry{client: client, at: time.Now()}
	r.mu.Unlock()
	return client, nil
}

func start(ctx context.Context, server Server) (Client, error) {
	transport := strings.ToLower(strings.TrimSpace(server.Transport))
	switch transport {
	case "http", "streamable-http", "sse":
		return StartHTTP(ctx, server.URL, server.Headers)
	case "builtin":
		return startBuiltin(ctx, server)
	case "stdio", "":
		command := append([]string{}, server.Command...)
		command = append(command, server.Args...)
		if len(command) == 0 && server.URL != "" {
			return StartHTTP(ctx, server.URL, server.Headers)
		}
		return StartStdio(ctx, command)
	default:
		return nil, fmt.Errorf("unsupported transport %q", server.Transport)
	}
}

func (r *Registry) Tools(ctx context.Context, server Server) ([]Tool, error) {
	r.mu.Lock()
	if existing, ok := r.entries[server.ID]; ok && time.Since(existing.at) < r.toolsTTL && existing.tools != nil {
		tools := existing.tools
		r.mu.Unlock()
		return tools, nil
	}
	r.mu.Unlock()

	client, err := r.Client(ctx, server)
	if err != nil {
		return nil, err
	}
	tools, err := client.ListTools(ctx)
	if err != nil {
		r.drop(server.ID)
		return nil, err
	}
	r.mu.Lock()
	if existing, ok := r.entries[server.ID]; ok {
		existing.tools = tools
		existing.at = time.Now()
	}
	r.mu.Unlock()
	return tools, nil
}

func (r *Registry) Call(ctx context.Context, server Server, tool string, args map[string]any) (json.RawMessage, error) {
	client, err := r.Client(ctx, server)
	if err != nil {
		return nil, err
	}
	result, err := client.CallTool(ctx, tool, args)
	if err != nil {
		r.drop(server.ID)
		return nil, err
	}
	return result, nil
}

// a dead connection is worse than none. every call after it just sits there
// waiting out a timeout, so fuck it — drop it and start a fresh server.
func (r *Registry) drop(id string) {
	r.mu.Lock()
	existing, ok := r.entries[id]
	delete(r.entries, id)
	r.mu.Unlock()
	if ok {
		_ = existing.client.Close()
	}
}

func (r *Registry) CloseAll() {
	r.mu.Lock()
	entries := r.entries
	r.entries = map[string]*entry{}
	r.mu.Unlock()
	for _, item := range entries {
		_ = item.client.Close()
	}
}

func TransportName(server Server) string {
	if strings.TrimSpace(server.Transport) != "" {
		return server.Transport
	}
	if len(server.Command) > 0 {
		return "stdio"
	}
	if server.URL != "" {
		return "http"
	}
	return "unknown"
}

func startBuiltin(ctx context.Context, server Server) (Client, error) {
	entry := strings.TrimSpace(os.Getenv("OKAY_MCP_MAIL_ENTRY"))
	if entry == "" {
		entry = filepath.Join("..", "mcp", "dist", "mail-server.js")
	}
	if _, err := os.Stat(entry); err != nil {
		return nil, fmt.Errorf("bundled mcp server is not built (%s); run npm run build in mcp/", entry)
	}
	node := "node"
	if _, err := exec.LookPath(node); err != nil {
		return nil, fmt.Errorf("node is required for the bundled mcp server")
	}
	return StartStdioEnv(ctx, []string{node, entry}, map[string]string{"OKAY_MAIL_OPTIONS": string(server.Options)})
}
