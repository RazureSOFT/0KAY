// Package stdioprovider hosts provider-adapter plugins as child processes over
// stdio, so a plugin can contribute an OpenAI-compatible provider without
// listening on a port. Core owns the provider's base_url (its own HTTP route)
// and forwards each request to the child.
package stdioprovider

import (
	"bufio"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"os/exec"
	"sync"
	"time"
)

// Runner manages the stdio provider children, keyed by provider id.
type Runner struct {
	mu       sync.Mutex
	children map[string]*child
}

// NewRunner creates an empty runner.
func NewRunner() *Runner {
	return &Runner{children: map[string]*child{}}
}

type event struct {
	ID      string            `json:"id"`
	Type    string            `json:"type"`
	Status  int               `json:"status"`
	Headers map[string]string `json:"headers"`
	Data    string            `json:"data"`
	Error   string            `json:"error"`
}

type pendingReq struct {
	status  int
	headers map[string]string
	ready   chan struct{}
	chunks  chan Chunk
	ctx     context.Context
	err     error
	once    sync.Once
}

// Chunk carries terminal transport failures as well as data. A broken stream
// must never look like a successfully completed model response.
type Chunk struct {
	Data []byte
	Err  error
}

type child struct {
	id      string
	cmd     *exec.Cmd
	stdin   io.WriteCloser
	mu      sync.Mutex
	writeMu sync.Mutex
	pending map[string]*pendingReq
}

func randomID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

// Start launches a stdio provider child (cwd = dir) and begins reading its
// newline-delimited JSON responses.
func (r *Runner) Start(id, dir string, command []string) error {
	if id == "" || len(command) == 0 {
		return fmt.Errorf("invalid stdio provider spec")
	}
	cmd := exec.Command(command[0], command[1:]...)
	cmd.Dir = dir
	stdin, err := cmd.StdinPipe()
	if err != nil {
		return err
	}
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		return err
	}
	cmd.Stderr = os.Stderr
	if err := cmd.Start(); err != nil {
		return err
	}
	c := &child{id: id, cmd: cmd, stdin: stdin, pending: map[string]*pendingReq{}}
	r.mu.Lock()
	if old := r.children[id]; old != nil {
		_ = old.cmd.Process.Kill()
	}
	r.children[id] = c
	r.mu.Unlock()
	go c.readLoop(stdout)
	go func() { _ = cmd.Wait() }()
	return nil
}

func (c *child) readLoop(r io.Reader) {
	scanner := bufio.NewScanner(r)
	scanner.Buffer(make([]byte, 0, 64*1024), 8*1024*1024)
	for scanner.Scan() {
		var ev event
		if json.Unmarshal(scanner.Bytes(), &ev) != nil || ev.ID == "" {
			continue
		}
		c.mu.Lock()
		req := c.pending[ev.ID]
		if req == nil {
			c.mu.Unlock()
			continue
		}
		switch ev.Type {
		case "head":
			req.once.Do(func() {
				req.status = ev.Status
				req.headers = ev.Headers
				close(req.ready)
			})
		case "chunk":
			c.mu.Unlock()
			// Apply cancellable backpressure outside the registry lock.
			select {
			case req.chunks <- Chunk{Data: []byte(ev.Data)}:
			case <-req.ctx.Done():
			}
			continue
		case "end":
			delete(c.pending, ev.ID)
			req.once.Do(func() { close(req.ready) })
			close(req.chunks)
		case "error":
			req.err = fmt.Errorf("%s", ev.Error)
			delete(c.pending, ev.ID)
			req.once.Do(func() { close(req.ready) })
			c.mu.Unlock()
			select {
			case req.chunks <- Chunk{Err: req.err}:
			case <-req.ctx.Done():
			}
			close(req.chunks)
			continue
		}
		c.mu.Unlock()
	}
	// EOF, an oversized frame, or a child crash must terminate every waiter.
	err := scanner.Err()
	if err == nil {
		err = io.ErrUnexpectedEOF
	}
	c.mu.Lock()
	pending := c.pending
	c.pending = map[string]*pendingReq{}
	for _, req := range pending {
		req.err = err
		req.once.Do(func() { close(req.ready) })
	}
	c.mu.Unlock()
	for _, req := range pending {
		select {
		case req.chunks <- Chunk{Err: err}:
		case <-req.ctx.Done():
		}
		close(req.chunks)
	}
}

// Do forwards one HTTP-shaped request to the child and returns the status,
// headers and a chunk stream. The caller must drain chunks.
func (r *Runner) Do(ctx context.Context, id, method, url string, headers map[string]string, body []byte) (int, map[string]string, <-chan Chunk, error) {
	r.mu.Lock()
	c := r.children[id]
	r.mu.Unlock()
	if c == nil {
		return 0, nil, nil, fmt.Errorf("stdio provider %q is not running", id)
	}
	reqID := randomID()
	req := &pendingReq{ready: make(chan struct{}), chunks: make(chan Chunk, 256), ctx: ctx}
	c.mu.Lock()
	c.pending[reqID] = req
	c.mu.Unlock()
	context.AfterFunc(ctx, func() {
		c.mu.Lock()
		delete(c.pending, reqID)
		c.mu.Unlock()
	})

	payload, _ := json.Marshal(map[string]any{
		"id": reqID, "method": method, "url": url, "headers": headers, "body": string(body),
	})
	c.writeMu.Lock()
	_, err := c.stdin.Write(append(payload, '\n'))
	c.writeMu.Unlock()
	if err != nil {
		c.mu.Lock()
		delete(c.pending, reqID)
		c.mu.Unlock()
		return 0, nil, nil, err
	}

	select {
	case <-req.ready:
	case <-ctx.Done():
		c.mu.Lock()
		delete(c.pending, reqID)
		c.mu.Unlock()
		return 0, nil, nil, ctx.Err()
	case <-time.After(60 * time.Second):
		c.mu.Lock()
		delete(c.pending, reqID)
		c.mu.Unlock()
		return 0, nil, nil, fmt.Errorf("stdio provider %q timed out", id)
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	if req.err != nil {
		return 0, nil, nil, req.err
	}
	return req.status, req.headers, req.chunks, nil
}

// Running reports whether a provider child is registered.
func (r *Runner) Running(id string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()
	return r.children[id] != nil
}

// Stop kills every child process.
func (r *Runner) Stop() {
	r.mu.Lock()
	defer r.mu.Unlock()
	for _, c := range r.children {
		if c.cmd.Process != nil {
			_ = c.cmd.Process.Kill()
		}
	}
	r.children = map[string]*child{}
}
