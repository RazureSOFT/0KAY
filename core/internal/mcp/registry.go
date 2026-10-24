package mcp

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
	"time"
)

// Registry owns the configured servers and their live connections.
//
// Servers are declared in the `mcp` settings section as a JSON array, which the
// WebUI panel edits. Core reads it on demand instead of holding state, so adding
// a server from the UI takes effect on the next call without a restart.
type Server struct {
	ID        string            `json:"id"`
	Transport string            `json:"transport,omitempty"`
	Command   []string          `json:"command,omitempty"`
	Args      []string          `json:"args,omitempty"`
	URL       string            `json:"url,omitempty"`
	Headers   map[string]string `json:"headers,omitempty"`
	// Options is what the mail server needs (imap/smtp credentials). It is kept
	// opaque here: Core forwards it, the server interprets it.
	Options json.RawMessage `json:"options,omitempty"`
}

// ParseServers reads the settings value. An empty or invalid value yields an
// empty list rather than an error: a half-written JSON array in the settings
// pane must not take the whole MCP surface down.
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

// Registry is safe for concurrent use; a task and a settings probe can hit it at
// the same time.
type Registry struct {
	mu      sync.Mutex
	entries map[string]*entry
	// toolsTTL keeps a `tools/list` round-trip out of every call. Short enough
	// that a restarted server is noticed quickly.
	toolsTTL time.Duration
}

func NewRegistry() *Registry {
	return &Registry{entries: map[string]*entry{}, toolsTTL: 30 * time.Second}
}

// Client returns a live client for `server`, starting it if needed.
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
	// Another goroutine may have won the race; keep theirs and close ours.
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

// Tools lists the tools of one server, cached for toolsTTL.
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

// Call invokes one tool. A transport failure drops the connection so the next
// call starts a fresh server instead of talking to a corpse.
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

func (r *Registry) drop(id string) {
	r.mu.Lock()
	existing, ok := r.entries[id]
	delete(r.entries, id)
	r.mu.Unlock()
	if ok {
		_ = existing.client.Close()
	}
}

// CloseAll shuts every server down (Core shutdown).
func (r *Registry) CloseAll() {
	r.mu.Lock()
	entries := r.entries
	r.entries = map[string]*entry{}
	r.mu.Unlock()
	for _, item := range entries {
		_ = item.client.Close()
	}
}

// TransportName reports how a server will be reached: the explicit transport,
// or the one implied by its fields. The WebUI shows this so a half-configured
// server is visibly "unknown" instead of silently failing later.
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

// startBuiltin spawns a server that ships in this repository. Today that is the
// mail server: it used to be an in-process shortcut inside the mcp plugin, which
// meant Core could not call it and every consumer needed the plugin linked.
//
// The settings entry owns the credentials (`options`), so they are handed to the
// child through the environment rather than read twice.
func startBuiltin(ctx context.Context, server Server) (Client, error) {
	entry := strings.TrimSpace(os.Getenv("OKAY_MCP_MAIL_ENTRY"))
	if entry == "" {
		// Core's working directory is <repo>/core, so the sibling path is stable.
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
