package mcp

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"strings"
	"sync"
	"time"
)

type Tool struct {
	Name        string          `json:"name"`
	Description string          `json:"description,omitempty"`
	InputSchema json.RawMessage `json:"inputSchema,omitempty"`
}

type Client interface {
	ListTools(ctx context.Context) ([]Tool, error)
	CallTool(ctx context.Context, name string, args map[string]any) (json.RawMessage, error)
	Close() error
}

const protocolVersion = "2024-11-05"

type stdioClient struct {
	cmd    *exec.Cmd
	stdin  io.WriteCloser
	stdout *bufio.Reader

	// answers come back out of order and notifications interleave, so a
	// naive write-then-read deadlocks the moment two calls overlap.
	mu      sync.Mutex
	nextID  int
	pending map[int]chan rpcReply
	readErr error
	closed  bool
}

type rpcReply struct {
	result json.RawMessage
	err    error
}

type rpcMessage struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      *int            `json:"id,omitempty"`
	Method  string          `json:"method,omitempty"`
	Params  json.RawMessage `json:"params,omitempty"`
	Result  json.RawMessage `json:"result,omitempty"`
	Error   *struct {
		Code    int    `json:"code"`
		Message string `json:"message"`
	} `json:"error,omitempty"`
}

func StartStdio(ctx context.Context, command []string) (Client, error) {
	return StartStdioEnv(ctx, command, nil)
}

func StartStdioEnv(ctx context.Context, command []string, env map[string]string) (Client, error) {
	if len(command) == 0 {
		return nil, fmt.Errorf("empty command")
	}
	cmd := exec.Command(command[0], command[1:]...)
	if len(env) > 0 {
		cmd.Env = os.Environ()
		for key, value := range env {
			cmd.Env = append(cmd.Env, key+"="+value)
		}
	}
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return nil, err
	}
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return nil, err
	}
	stderr, err := cmd.StderrPipe()
	if err != nil {
		return nil, err
	}
	if err := cmd.Start(); err != nil {
		return nil, err
	}
	go func() { _, _ = io.Copy(io.Discard, stderr) }()

	client := &stdioClient{cmd: cmd, stdin: stdin, stdout: bufio.NewReaderSize(stdout, 1<<20), pending: map[int]chan rpcReply{}}
	go client.readLoop()

	if err := client.initialize(ctx); err != nil {
		_ = client.Close()
		return nil, err
	}
	return client, nil
}

func (c *stdioClient) readLoop() {
	for {
		line, err := c.stdout.ReadBytes('\n')
		if err != nil {
			c.fail(err)
			return
		}
		trimmed := strings.TrimSpace(string(line))
		if trimmed == "" {
			continue
		}
		var message rpcMessage
		if err := json.Unmarshal([]byte(trimmed), &message); err != nil {
			continue
		}
		if message.ID == nil {
			continue
		}
		c.mu.Lock()
		ch, ok := c.pending[*message.ID]
		delete(c.pending, *message.ID)
		c.mu.Unlock()
		if !ok {
			continue
		}
		if message.Error != nil {
			ch <- rpcReply{err: fmt.Errorf("%s (code %d)", message.Error.Message, message.Error.Code)}
		} else {
			ch <- rpcReply{result: message.Result}
		}
	}
}

func (c *stdioClient) fail(err error) {
	c.mu.Lock()
	c.readErr = err
	pending := c.pending
	c.pending = map[int]chan rpcReply{}
	c.mu.Unlock()
	for _, ch := range pending {
		ch <- rpcReply{err: err}
	}
}

func (c *stdioClient) call(ctx context.Context, method string, params any) (json.RawMessage, error) {
	c.mu.Lock()
	if c.readErr != nil {
		err := c.readErr
		c.mu.Unlock()
		return nil, err
	}
	if c.closed {
		c.mu.Unlock()
		return nil, fmt.Errorf("client closed")
	}
	c.nextID++
	id := c.nextID
	ch := make(chan rpcReply, 1)
	c.pending[id] = ch
	c.mu.Unlock()

	payload := map[string]any{"jsonrpc": "2.0", "id": id, "method": method}
	if params != nil {
		payload["params"] = params
	}
	encoded, err := json.Marshal(payload)
	if err != nil {
		return nil, err
	}
	if _, err := c.stdin.Write(append(encoded, '\n')); err != nil {
		return nil, err
	}
	select {
	case reply := <-ch:
		return reply.result, reply.err
	case <-ctx.Done():
		c.mu.Lock()
		delete(c.pending, id)
		c.mu.Unlock()
		return nil, ctx.Err()
	}
}

func (c *stdioClient) notify(method string, params any) error {
	payload := map[string]any{"jsonrpc": "2.0", "method": method}
	if params != nil {
		payload["params"] = params
	}
	encoded, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	_, err = c.stdin.Write(append(encoded, '\n'))
	return err
}

func (c *stdioClient) initialize(ctx context.Context) error {
	initCtx, cancel := context.WithTimeout(ctx, 20*time.Second)
	defer cancel()
	_, err := c.call(initCtx, "initialize", map[string]any{
		"protocolVersion": protocolVersion,
		"capabilities":    map[string]any{},
		"clientInfo":      map[string]any{"name": "0kay-core", "version": "1.0.0"},
	})
	if err != nil {
		return fmt.Errorf("initialize: %w", err)
	}
	return c.notify("notifications/initialized", nil)
}

func (c *stdioClient) ListTools(ctx context.Context) ([]Tool, error) {
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

func (c *stdioClient) CallTool(ctx context.Context, name string, args map[string]any) (json.RawMessage, error) {
	if args == nil {
		args = map[string]any{}
	}
	return c.call(ctx, "tools/call", map[string]any{"name": name, "arguments": args})
}

func (c *stdioClient) Close() error {
	c.mu.Lock()
	if c.closed {
		c.mu.Unlock()
		return nil
	}
	c.closed = true
	c.mu.Unlock()
	_ = c.stdin.Close()
	if c.cmd.Process != nil {
		_ = c.cmd.Process.Kill()
	}
	return c.cmd.Wait()
}
