package gateway

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"0kay/core/internal/providers"
	"0kay/core/internal/registry"
	"0kay/core/internal/server"
	"0kay/core/internal/settings"
	corev1 "0kay/gen/core/v1"
	lifev1 "0kay/gen/life/v1"

	"github.com/gorilla/websocket"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/status"
)

// Gateway is the HTTP API gateway.
type Gateway struct {
	cfg      *Config
	registry *registry.Registry
	coreSvc  corev1.CoreServiceClient
	// localCore is the in-process CoreServiceServer for usage/permissions/session access.
	localCore LocalCore
	upgrader  websocket.Upgrader
	sessions  map[string]*Session
	mu        sync.RWMutex

	// Cached outbound gRPC connections, keyed by plugin address.
	connMu sync.Mutex
	conns  map[string]*grpc.ClientConn

	// providerStore holds multi-provider API configs (data/providers.json).
	providerStore *providers.Store
	// settingsStore holds plugin-contributed settings sections/values.
	settingsStore *settings.Store
	// uiPatches holds WebUI extension *.patch files (nav/router/status).
	uiPatches *uiPatchStore
}

// LocalCore is the subset of CoreServiceServer the gateway needs.
type LocalCore interface {
	GetUsage() map[string]interface{}
	ClearUsage()
	RecordUsage(server.UsageRecord)
	GetPermissions() server.Permissions
	SetPermissions(p server.Permissions)
	ListTasks() []map[string]interface{}
	TaskDelta(string) map[string]interface{}
	RecordTask(server.TaskEvent) error
	CreateAgentSession(string) (string, error)
	HasAgentSession(string) bool
	ManageAgentSession(string, string) error
	RenameAgentSession(string, string) error
}

// Config holds gateway configuration.
type Config struct {
	GRPCAddr string
	HTTPAddr string
}

// Session represents a WebSocket session.
type Session struct {
	ID       string
	Conn     *websocket.Conn
	Send     chan []byte
	Done     chan struct{}
	Registry *registry.Registry

	// ctx bounds every chat stream started by this socket; it is cancelled as
	// soon as the reader stops so no orphaned generation keeps running.
	ctx    context.Context
	cancel context.CancelFunc
	once   sync.Once
}

// shutdown ends the session exactly once (read pump exit, write pump exit or
// an error), closing Done so both pumps and any in-flight chat stop.
func (s *Session) shutdown() {
	s.once.Do(func() {
		close(s.Done)
		if s.cancel != nil {
			s.cancel()
		}
	})
}

// push queues a payload unless the session is already closing.
func (s *Session) push(payload []byte) bool {
	select {
	case <-s.Done:
		return false
	default:
	}
	select {
	case s.Send <- payload:
		return true
	case <-s.Done:
		return false
	}
}

// dial returns a cached gRPC client connection for a plugin address.
func (g *Gateway) dial(address string) (*grpc.ClientConn, error) {
	g.connMu.Lock()
	defer g.connMu.Unlock()
	if g.conns == nil {
		g.conns = map[string]*grpc.ClientConn{}
	}
	if connection, ok := g.conns[address]; ok {
		return connection, nil
	}
	connection, err := grpc.NewClient(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, err
	}
	g.conns[address] = connection
	return connection, nil
}

// lifeClient returns the first registered LIFE plugin's client.
func (g *Gateway) lifeClient() (lifev1.LifeServiceClient, bool) {
	lifes := g.registry.GetPluginsByCapability("life")
	if len(lifes) == 0 || lifes[0].Address == "" {
		return nil, false
	}
	conn, err := g.dial(lifes[0].Address)
	if err != nil {
		return nil, false
	}
	return lifev1.NewLifeServiceClient(conn), true
}

// isTransientLifeError reports dial/availability failures worth retrying.
func isTransientLifeError(err error) bool {
	if err == nil {
		return false
	}
	switch status.Code(err) {
	case codes.Unavailable, codes.DeadlineExceeded, codes.ResourceExhausted:
		return true
	}
	msg := err.Error()
	return strings.Contains(msg, "connection refused") ||
		strings.Contains(msg, "actively refused") ||
		strings.Contains(msg, "Unavailable")
}

// lifeCall retries transient dial failures so a short LIFE restart is not
// surfaced to the WebUI as a hard error. Non-transient errors return at once.
func (g *Gateway) lifeCall(ctx context.Context, fn func(lifev1.LifeServiceClient) error) error {
	var last error
	for attempt := 0; attempt < 3; attempt++ {
		client, ok := g.lifeClient()
		if !ok {
			last = fmt.Errorf("life unavailable")
		} else {
			last = fn(client)
			if last == nil {
				return nil
			}
			if !isTransientLifeError(last) {
				return last
			}
		}
		select {
		case <-ctx.Done():
			return last
		case <-time.After(time.Duration(200*(1<<attempt)) * time.Millisecond):
		}
	}
	return last
}

// NewGateway creates a new HTTP gateway.
func NewGateway(cfg *Config, reg *registry.Registry) (*Gateway, error) {
	conn, err := grpc.NewClient(cfg.GRPCAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, fmt.Errorf("failed to connect to core: %w", err)
	}

	coreSvc := corev1.NewCoreServiceClient(conn)

	return &Gateway{
		cfg:      cfg,
		registry: reg,
		coreSvc:  coreSvc,
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return allowedOrigin(r)
			},
		},
		sessions: make(map[string]*Session),
	}, nil
}

// SetCoreService wires the in-process CoreServiceServer for usage/permissions.
func (g *Gateway) SetCoreService(s LocalCore) {
	g.localCore = s
}

// SetProviderStore wires the multi-provider config store.
func (g *Gateway) SetProviderStore(s *providers.Store) {
	g.providerStore = s
}

// SetSettingsStore wires the plugin settings store.
func (g *Gateway) SetSettingsStore(s *settings.Store) {
	g.settingsStore = s
}

// ProviderStore exposes the store for CallMocr credential resolution.
func (g *Gateway) ProviderStore() *providers.Store {
	return g.providerStore
}

// SettingsStore exposes the settings store.
func (g *Gateway) SettingsStore() *settings.Store {
	return g.settingsStore
}

// Handler returns the HTTP handler. Browser-facing guards (Host allow-list,
// CORS, authentication) are layered on by Public/Handler composition in main.
func (g *Gateway) Handler() http.Handler {
	g.initUIPatches()
	g.loadDisabledPlugins()
	mux := http.NewServeMux()

	// Health / registry reads (GET only; a wrong method now returns 405).
	mux.HandleFunc("/health", g.handleHealth)
	mux.HandleFunc("/api/plugins", g.handlePlugins)
	mux.HandleFunc("/api/update/check", g.handleUpdateCheck)
	mux.HandleFunc("/api/update/check-plugins", g.handleUpdateCheckPlugins)
	mux.HandleFunc("/api/update/apply", g.handleUpdateApply)
	mux.HandleFunc("/api/update/status", g.handleUpdateStatus)
	// REST plugin lifecycle: PATCH /api/plugins/{name} {"enabled":bool}
	mux.HandleFunc("PATCH /api/plugins/{name}", g.handlePluginPatch)
	mux.HandleFunc("/api/plugins/enable", g.handlePluginEnable)
	mux.HandleFunc("/api/plugins/disable", g.handlePluginDisable)
	mux.HandleFunc("/api/plugins/install", g.handlePluginInstall)
	mux.HandleFunc("/api/plugins/install/status", g.handlePluginInstallStatus)
	mux.HandleFunc("/api/plugins/uninstall", g.handlePluginUninstall)
	mux.HandleFunc("/api/plugins/installed", g.handlePluginInstalled)
	// Plugin front-end ESM bundles (scheme C): CORE_DATA_DIR/plugin-ui/{name}/
	mux.HandleFunc("/api/plugins/{name}/ui/{path...}", g.handlePluginUI)
	mux.HandleFunc("/api/agents", g.handleAgents)
	mux.HandleFunc("/api/agent/sessions", g.handleAgentSessions)
	mux.HandleFunc("PATCH /api/agent/sessions/{session_id}", g.handleAgentSessionItem)
	mux.HandleFunc("DELETE /api/agent/sessions/{session_id}", g.handleAgentSessionItem)
	mux.HandleFunc("/api/agent/messages", g.handleAgentMessage)
	mux.HandleFunc("/api/agent/workspace", g.handleAgentWorkspace)
	mux.HandleFunc("/api/agent/approvals", g.handleAgentApprovals)
	mux.HandleFunc("/api/agent/questions", g.handleAgentApprovals)
	mux.HandleFunc("/api/agent/inbox", g.handleAgentInbox)
	mux.HandleFunc("/api/agent/host", g.handleAgentWorkspace)
	mux.HandleFunc("/api/agent/compact", g.handleAgentCompact)
	mux.HandleFunc("/api/skills", g.handleSkills)
	mux.HandleFunc("DELETE /api/skills/{name...}", g.handleSkills)
	mux.HandleFunc("/api/tasks/cancel", g.handleTaskCancel)
	mux.HandleFunc("POST /api/tasks/{task_id}/cancel", g.handleTaskCancelPath)
	mux.HandleFunc("/api/chat", g.handleChat)
	mux.HandleFunc("/api/life/chat", g.handleLifeChat)
	mux.HandleFunc("/api/life/compact", g.handleLifeCompact)
	mux.HandleFunc("/api/life/notifications", g.handleLifeNotifications)
	mux.HandleFunc("/api/mocr/generate", g.handleMocrGenerate)
	mux.HandleFunc("/api/models/fetch", g.handleFetchModels)
	mux.HandleFunc("/api/life/state", g.handleLifeState)
	mux.HandleFunc("/api/state", g.handleState)
	mux.HandleFunc("/api/ui/patches", g.handleUIPatches)
	mux.HandleFunc("/api/life/permissions", g.handleLifePermissions)
	mux.HandleFunc("/api/life/memories", g.handleLifeMemories)
	mux.HandleFunc("/api/life/companion", g.handleLifeCompanion)
	mux.HandleFunc("/api/usage", g.handleUsage)
	mux.HandleFunc("DELETE /api/usage", g.handleUsageClear)
	mux.HandleFunc("/api/usage/record", g.handleUsageRecord)
	mux.HandleFunc("/api/usage/clear", g.handleUsageClear)
	mux.HandleFunc("/api/models", g.handleModelsList)
	mux.HandleFunc("/api/run", g.handleRunDirect)
	mux.HandleFunc("/api/live2d", g.handleLive2D)
	mux.HandleFunc("DELETE /api/live2d/{path...}", g.handleLive2DDeletePath)
	mux.HandleFunc("/api/images", g.handleImages)
	mux.Handle("/live2d/models/", http.StripPrefix("/live2d/models/", http.FileServer(http.Dir(live2DRoot()))))
	mux.HandleFunc("/api/tasks", g.handleTasks)
	mux.HandleFunc("/api/tasks/events", g.handleTaskEvents)
	mux.HandleFunc("/api/providers", g.handleProviders)
	mux.HandleFunc("DELETE /api/providers/{id}", g.handleProviderDeletePath)
	mux.HandleFunc("/api/providers/delete", g.handleProviderDelete)
	mux.HandleFunc("/api/providers/credentials", g.handleProviderCredentials)
	mux.HandleFunc("/api/providers/defaults", g.handleProviderDefaults)
	mux.HandleFunc("/api/settings/sections", g.handleSettingsSections)
	mux.HandleFunc("/api/settings/", g.handleSettingsSection)
	mux.HandleFunc("/ws", g.handleWebSocket)

	return logMiddleware(mux)
}

func (g *Gateway) handleHealth(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	plugins := g.registry.GetAllPlugins()
	healthy := 0
	for _, p := range plugins {
		if p.Status == corev1.PluginStatus_PLUGIN_STATUS_HEALTHY {
			healthy++
		}
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"status":  "ok",
		"plugins": len(plugins),
		"healthy": healthy,
	})
}

func (g *Gateway) handlePlugins(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	plugins := g.registry.GetAllPlugins()

	type PluginInfo struct {
		PluginID     string   `json:"plugin_id"`
		Name         string   `json:"name"`
		Version      string   `json:"version"`
		Type         string   `json:"type"`
		Capabilities []string `json:"capabilities"`
		Status       string   `json:"status"`
		ActiveTasks  int32    `json:"active_tasks"`
		Disabled     bool     `json:"disabled"`
	}

	// Include currently disabled plugins as hidden rows for admin UI.
	disabledNames := g.registry.DisabledNames()
	seen := map[string]bool{}
	var result []PluginInfo
	for _, p := range plugins {
		result = append(result, PluginInfo{
			PluginID:     p.PluginID,
			Name:         p.Info.Name,
			Version:      p.Info.Version,
			Type:         p.Info.PluginType.String(),
			Capabilities: p.Capabilities,
			Status:       p.Status.String(),
			ActiveTasks:  p.ActiveTasks,
			Disabled:     false,
		})
		if p.Info != nil {
			seen[p.Info.Name] = true
		}
	}
	for _, name := range disabledNames {
		if seen[name] {
			continue
		}
		result = append(result, PluginInfo{
			PluginID: "disabled:" + name,
			Name:     name,
			Disabled: true,
			Status:   "PLUGIN_STATUS_DISABLED",
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

type pluginToggleReq struct {
	Plugin string `json:"plugin"`
	Name   string `json:"name"`
}

func (g *Gateway) handlePluginEnable(w http.ResponseWriter, r *http.Request) {
	g.handlePluginToggle(w, r, true)
}

func (g *Gateway) handlePluginDisable(w http.ResponseWriter, r *http.Request) {
	g.handlePluginToggle(w, r, false)
}

func (g *Gateway) handlePluginToggle(w http.ResponseWriter, r *http.Request, enable bool) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	deprecated(w, "/api/plugins/{name}")
	var req pluginToggleReq
	if !decodeBody(w, r, &req, 64<<10) {
		badRequest(w, "invalid request body")
		return
	}
	name := req.Plugin
	if name == "" {
		name = req.Name
	}
	if name == "" {
		badRequest(w, "plugin name required")
		return
	}
	g.setPluginEnabled(name, enable, w)
}

// handlePluginPatch is the REST form of enable/disable:
//
//	PATCH /api/plugins/{name}  {"enabled": true|false}
func (g *Gateway) handlePluginPatch(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPatch) {
		return
	}
	name := r.PathValue("name")
	if name == "" {
		badRequest(w, "plugin name required")
		return
	}
	var req struct {
		Enabled *bool `json:"enabled"`
	}
	if !decodeBody(w, r, &req, 64<<10) || req.Enabled == nil {
		badRequest(w, "enabled is required")
		return
	}
	g.setPluginEnabled(name, *req.Enabled, w)
}

// setPluginEnabled flips a plugin and reports 404 for names Core never knew.
func (g *Gateway) setPluginEnabled(name string, enable bool, w http.ResponseWriter) {
	if !g.knownPlugin(name) {
		notFound(w, "plugin not found")
		return
	}
	g.registry.SetEnabled(name, enable)
	g.persistDisabledPlugins()
	// Re-evaluate patch/settings visibility for the toggled plugin.
	if g.uiPatches != nil {
		g.uiPatches.Reload()
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"plugin":  name,
		"enabled": enable,
		"ok":      true,
	})
}

// knownPlugin reports whether name refers to a registered or disabled plugin.
func (g *Gateway) knownPlugin(name string) bool {
	for _, plugin := range g.registry.GetAllPlugins() {
		if plugin.Info != nil && plugin.Info.Name == name {
			return true
		}
	}
	for _, disabled := range g.registry.DisabledNames() {
		if disabled == name {
			return true
		}
	}
	return false
}

func (g *Gateway) persistDisabledPlugins() {
	dataDir := os.Getenv("CORE_DATA_DIR")
	if dataDir == "" {
		dataDir = "data"
	}
	path := filepath.Join(dataDir, "disabled_plugins.json")
	names := g.registry.DisabledNames()
	if len(names) == 0 {
		_ = os.Remove(path)
		return
	}
	b, _ := json.Marshal(names)
	_ = os.MkdirAll(dataDir, 0o755)
	_ = os.WriteFile(path, b, 0o644)
}

func (g *Gateway) loadDisabledPlugins() {
	dataDir := os.Getenv("CORE_DATA_DIR")
	if dataDir == "" {
		dataDir = "data"
	}
	b, err := os.ReadFile(filepath.Join(dataDir, "disabled_plugins.json"))
	if err != nil {
		return
	}
	var names []string
	if json.Unmarshal(b, &names) == nil {
		g.registry.LoadDisabled(names)
	}
}

func (g *Gateway) handleChat(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}

	var req struct {
		RequestID    string  `json:"request_id"`
		Prompt       string  `json:"prompt"`
		Stream       bool    `json:"stream"`
		SessionID    string  `json:"session_id"`
		ModelID      string  `json:"model_id"`
		SystemPrompt string  `json:"system_prompt"`
		Temperature  float64 `json:"temperature"`
		MaxTokens    int32   `json:"max_tokens"`
		Messages     []struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"messages"`
	}

	if !decodeBody(w, r, &req, maxChatBody) {
		return
	}

	if req.RequestID == "" {
		req.RequestID = fmt.Sprintf("chat_%d", time.Now().UnixNano())
	}
	sessionID := req.SessionID
	if sessionID == "" {
		sessionID = "default"
	}

	var history []*corev1.ChatMessage
	for _, m := range req.Messages {
		history = append(history, &corev1.ChatMessage{Role: m.Role, Content: m.Content})
	}

	opts := chatOpts{
		RequestID:    req.RequestID,
		Prompt:       req.Prompt,
		SessionID:    sessionID,
		ModelID:      req.ModelID,
		SystemPrompt: req.SystemPrompt,
		Temperature:  req.Temperature,
		MaxTokens:    req.MaxTokens,
		Messages:     history,
	}

	if req.Stream {
		g.handleChatStream(w, r, opts)
	} else {
		g.handleChatSync(w, r, opts)
	}
}

// chatOpts carries optional generation parameters from the HTTP body into CallMocr.
type chatOpts struct {
	RequestID    string
	Prompt       string
	SessionID    string
	ModelID      string
	SystemPrompt string
	Temperature  float64
	MaxTokens    int32
	Messages     []*corev1.ChatMessage
}

func (o chatOpts) toCallMocrRequest(stream bool) *corev1.CallMocrRequest {
	req := &corev1.CallMocrRequest{
		RequestId:    o.RequestID,
		Prompt:       o.Prompt,
		Stream:       stream,
		SessionId:    o.SessionID,
		ModelId:      o.ModelID,
		SystemPrompt: o.SystemPrompt,
		Messages:     o.Messages,
	}
	if o.Temperature > 0 || o.MaxTokens > 0 {
		req.Context = &corev1.MocrContext{
			Temperature: o.Temperature,
			MaxTokens:   o.MaxTokens,
		}
	}
	return req
}

// handleChatSync collects a non-streaming completion. Provider failures are
// surfaced as 502 with the standard error envelope rather than a 200 with an
// empty response (docs/PLUGIN_API.md: a network failure is not success).
func (g *Gateway) handleChatSync(w http.ResponseWriter, r *http.Request, opts chatOpts) {
	stream, err := g.coreSvc.CallMocr(r.Context(), opts.toCallMocrRequest(false))
	if err != nil {
		upstreamError(w, err.Error())
		return
	}

	var result strings.Builder
	var streamErr string
	var usage *corev1.TokenUsage
	for {
		resp, err := stream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			upstreamError(w, err.Error())
			return
		}
		if resp.Error != "" {
			streamErr = resp.Error
		}
		result.WriteString(resp.Chunk)
		if resp.Done {
			usage = resp.Usage
		}
	}
	if streamErr != "" {
		writeErr(w, http.StatusBadGateway, "generation_failed", streamErr)
		return
	}

	payload := map[string]interface{}{
		"request_id": opts.RequestID,
		"response":   result.String(),
	}
	if usage != nil {
		payload["usage"] = map[string]int32{
			"prompt_tokens":     usage.PromptTokens,
			"completion_tokens": usage.CompletionTokens,
			"total_tokens":      usage.TotalTokens,
		}
	}
	writeJSON(w, http.StatusOK, payload)
}

func (g *Gateway) handleChatStream(w http.ResponseWriter, r *http.Request, opts chatOpts) {
	flusher, ok := w.(http.Flusher)
	if !ok {
		unavailable(w, "streaming not supported")
		return
	}

	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	w.Header().Set("X-Accel-Buffering", "no")

	stream, err := g.coreSvc.CallMocr(r.Context(), opts.toCallMocrRequest(true))
	if err != nil {
		fmt.Fprintf(w, "event: error\ndata: %s\n\n", jsonEscape(err.Error()))
		flusher.Flush()
		return
	}

	completed := false
	for {
		resp, err := stream.Recv()
		if err == io.EOF {
			if completed {
				fmt.Fprintf(w, "event: done\ndata: {}\n\n")
			} else {
				fmt.Fprintf(w, "event: error\ndata: %s\n\n", jsonEscape("stream ended without completion"))
			}
			flusher.Flush()
			return
		}
		if err != nil {
			fmt.Fprintf(w, "event: error\ndata: %s\n\n", jsonEscape(err.Error()))
			flusher.Flush()
			return
		}
		if resp.Error != "" {
			data, _ := json.Marshal(map[string]string{
				"request_id": resp.RequestId,
				"error":      resp.Error,
			})
			fmt.Fprintf(w, "event: error\ndata: %s\n\n", data)
			flusher.Flush()
			return
		}

		data, _ := json.Marshal(resp)
		fmt.Fprintf(w, "event: chunk\ndata: %s\n\n", data)
		flusher.Flush()

		if resp.Done {
			completed = true
			fmt.Fprintf(w, "event: done\ndata: {}\n\n")
			flusher.Flush()
			return
		}
	}
}

func jsonEscape(s string) string {
	b, err := json.Marshal(s)
	if err != nil {
		return `"` + s + `"`
	}
	return string(b)
}

// handleMocrGenerate is the legacy name for POST /api/chat. Kept as an alias so
// prebuilt plugin bundles keep working; see docs/HTTP_API.md for the mapping.
func (g *Gateway) handleMocrGenerate(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Deprecation", "true")
	w.Header().Set("Link", `</api/chat>; rel="successor-version"`)
	g.handleChat(w, r)
}

// handleLifeChat is the WebUI chat path. LIFE owns persona expression, memory,
// emotions, tools, and companion behavior; Core only proxies its gRPC stream.
func (g *Gateway) handleLifeChat(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var req struct {
		RequestID string          `json:"request_id"`
		SessionID string          `json:"session_id"`
		UserID    string          `json:"user_id"`
		Prompt    string          `json:"prompt"`
		Persona   json.RawMessage `json:"persona"`
		History   json.RawMessage `json:"history"`
	}
	if !decodeBody(w, r, &req, maxLifeChatBody) {
		return
	}
	if req.Prompt == "" {
		badRequest(w, "prompt required")
		return
	}
	if req.RequestID == "" {
		req.RequestID = fmt.Sprintf("life_%d", time.Now().UnixNano())
	}
	if req.SessionID == "" {
		req.SessionID = "webui:default"
	}
	if req.UserID == "" {
		req.UserID = "webui"
	}
	lifes := g.registry.GetPluginsByCapability("life")
	if len(lifes) == 0 || lifes[0].Address == "" {
		unavailable(w, "LIFE is unavailable")
		return
	}
	conn, err := g.dial(lifes[0].Address)
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	stream, err := lifev1.NewLifeServiceClient(conn).OnUserMessage(r.Context(), &lifev1.OnUserMessageRequest{
		SessionId: req.SessionID, UserId: req.UserID, Message: req.Prompt, AdapterType: "webui", PersonaJson: string(req.Persona), HistoryJson: string(req.History),
	})
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	flusher, ok := w.(http.Flusher)
	if !ok {
		unavailable(w, "streaming unavailable")
		return
	}
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")
	completed := false
	for {
		resp, err := stream.Recv()
		if err == io.EOF {
			if !completed {
				data, _ := json.Marshal(map[string]string{"request_id": req.RequestID, "error": "stream ended without completion"})
				fmt.Fprintf(w, "event: error\ndata: %s\n\n", data)
				flusher.Flush()
			}
			return
		}
		if err != nil {
			data, _ := json.Marshal(map[string]string{"request_id": req.RequestID, "error": err.Error()})
			fmt.Fprintf(w, "event: error\ndata: %s\n\n", data)
			flusher.Flush()
			return
		}
		data, _ := json.Marshal(map[string]interface{}{
			"request_id": req.RequestID, "chunk": resp.Chunk, "done": resp.Done, "task_id": resp.TaskStarted,
			"think_summary": resp.ThinkSummary,
			"emotion":       map[string]float64{"valence": resp.EmotionState.Valence, "arousal": resp.EmotionState.Arousal, "connection": resp.EmotionState.Connection, "irritation": resp.EmotionState.Irritation}, "mental_energy": resp.MentalEnergy,
		})
		fmt.Fprintf(w, "event: chunk\ndata: %s\n\n", data)
		flusher.Flush()
		if resp.Done {
			completed = true
			fmt.Fprint(w, "event: done\ndata: {}\n\n")
			flusher.Flush()
			return
		}
	}
}

func (g *Gateway) handleLifeCompact(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var req struct {
		SessionID string          `json:"session_id"`
		History   json.RawMessage `json:"history"`
		Persona   json.RawMessage `json:"persona"`
	}
	if !decodeBody(w, r, &req, maxLifeChatBody) {
		return
	}
	lifes := g.registry.GetPluginsByCapability("life")
	if len(lifes) == 0 || lifes[0].Address == "" {
		unavailable(w, "LIFE is unavailable")
		return
	}
	conn, err := g.dial(lifes[0].Address)
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 90*time.Second)
	defer cancel()
	resp, err := lifev1.NewLifeServiceClient(conn).CompactConversation(ctx, &lifev1.CompactConversationRequest{SessionId: req.SessionID, HistoryJson: string(req.History), PersonaJson: string(req.Persona)})
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	if !resp.Ok {
		writeErr(w, http.StatusBadRequest, "compact_failed", resp.Error)
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"summary": resp.Summary})
}

func (g *Gateway) handleLifeNotifications(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet, http.MethodPost) {
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 6*time.Second)
	defer cancel()
	if r.Method == http.MethodPost {
		var body struct {
			SessionID string   `json:"session_id"`
			IDs       []string `json:"ids"`
		}
		if !decodeBody(w, r, &body, maxSmallBody) || body.SessionID == "" {
			badRequest(w, "invalid acknowledgement")
			return
		}
		payload, _ := json.Marshal(body)
		var response *lifev1.ManageCompanionResponse
		if err := g.lifeCall(ctx, func(client lifev1.LifeServiceClient) error {
			var callErr error
			response, callErr = client.ManageCompanion(ctx, &lifev1.ManageCompanionRequest{Action: "ack_notifications", PayloadJson: string(payload)})
			return callErr
		}); err != nil || !response.GetOk() {
			upstreamError(w, "notification acknowledgement failed")
			return
		}
		writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
		return
	}
	var resp *lifev1.GetNotificationsResponse
	if err := g.lifeCall(ctx, func(client lifev1.LifeServiceClient) error {
		var callErr error
		resp, callErr = client.GetNotifications(ctx, &lifev1.GetNotificationsRequest{SessionId: r.URL.Query().Get("session_id")})
		return callErr
	}); err != nil {
		upstreamError(w, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"notifications": resp.Notifications})
}

func (g *Gateway) handleWebSocket(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	conn, err := g.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("WebSocket upgrade failed: %v", err)
		return
	}

	ctx, cancel := context.WithCancel(r.Context())
	session := &Session{
		ID:       fmt.Sprintf("ws_%d", time.Now().UnixNano()),
		Conn:     conn,
		Send:     make(chan []byte, 256),
		Done:     make(chan struct{}),
		Registry: g.registry,
		ctx:      ctx,
		cancel:   cancel,
	}

	g.mu.Lock()
	g.sessions[session.ID] = session
	g.mu.Unlock()

	go session.writePump()
	go session.readPump(g)
}

// forgetSession removes a closed session from the registry so the map does not
// grow for the lifetime of the process.
func (g *Gateway) forgetSession(session *Session) {
	g.mu.Lock()
	if g.sessions[session.ID] == session {
		delete(g.sessions, session.ID)
	}
	g.mu.Unlock()
}

func (s *Session) readPump(g *Gateway) {
	defer func() {
		s.shutdown()
		s.Conn.Close()
		g.forgetSession(s)
		s.Registry = nil
	}()

	for {
		_, message, err := s.Conn.ReadMessage()
		if err != nil {
			break
		}

		var req struct {
			Type      string `json:"type"`
			RequestID string `json:"request_id"`
			SessionID string `json:"session_id"`
			Prompt    string `json:"prompt"`
			Messages  []struct {
				Role    string `json:"role"`
				Content string `json:"content"`
			} `json:"messages"`
		}

		if err := json.Unmarshal(message, &req); err != nil {
			continue
		}

		switch req.Type {
		case "chat":
			sessionID := req.SessionID
			if sessionID == "" {
				sessionID = "default"
			}
			var history []*corev1.ChatMessage
			for _, m := range req.Messages {
				history = append(history, &corev1.ChatMessage{Role: m.Role, Content: m.Content})
			}
			go s.handleChatRequest(g.coreSvc, req.RequestID, req.Prompt, sessionID, history)
		case "ping":
			s.push([]byte(`{"type":"pong"}`))
		}
	}
}

func (s *Session) handleChatRequest(coreSvc corev1.CoreServiceClient, requestID, prompt, sessionID string, history []*corev1.ChatMessage) {
	stream, err := coreSvc.CallMocr(s.ctx, &corev1.CallMocrRequest{
		RequestId: requestID,
		Prompt:    prompt,
		Stream:    true,
		SessionId: sessionID,
		Messages:  history,
	})
	if err != nil {
		errResp, _ := json.Marshal(map[string]string{
			"type":       "error",
			"request_id": requestID,
			"error":      err.Error(),
		})
		s.push(errResp)
		return
	}

	completed := false
	for {
		resp, err := stream.Recv()
		if err == io.EOF {
			payload := map[string]string{"type": "done", "request_id": requestID}
			if !completed {
				payload["type"] = "error"
				payload["error"] = "stream ended without completion"
			}
			raw, _ := json.Marshal(payload)
			s.push(raw)
			break
		}
		if err != nil {
			errResp, _ := json.Marshal(map[string]string{
				"type":       "error",
				"request_id": requestID,
				"error":      err.Error(),
			})
			s.push(errResp)
			break
		}
		if resp.Error != "" {
			errResp, _ := json.Marshal(map[string]string{
				"type":       "error",
				"request_id": requestID,
				"error":      resp.Error,
			})
			s.push(errResp)
			break
		}

		data, _ := json.Marshal(map[string]interface{}{
			"type":       "chunk",
			"request_id": requestID,
			"chunk":      resp.Chunk,
			"done":       resp.Done,
		})
		s.push(data)

		if resp.Done {
			completed = true
			if resp.Usage != nil {
				usageResp, _ := json.Marshal(map[string]interface{}{
					"type":       "usage",
					"request_id": requestID,
					"usage": map[string]int32{
						"prompt_tokens":     resp.Usage.PromptTokens,
						"completion_tokens": resp.Usage.CompletionTokens,
						"total_tokens":      resp.Usage.TotalTokens,
					},
				})
				s.push(usageResp)
			}
			break
		}
	}
}

func (s *Session) writePump() {
	defer func() {
		s.shutdown()
		s.Conn.Close()
	}()

	for {
		select {
		case message := <-s.Send:
			_ = s.Conn.SetWriteDeadline(time.Now().Add(30 * time.Second))
			if err := s.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
				return
			}
		case <-s.Done:
			_ = s.Conn.WriteControl(websocket.CloseMessage,
				websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""),
				time.Now().Add(time.Second))
			return
		}
	}
}

func (g *Gateway) handleUsage(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if g.localCore == nil {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"total_tokens": 0,
			"by_model":     map[string]interface{}{},
			"by_day":       map[string]interface{}{},
		})
		return
	}
	json.NewEncoder(w).Encode(g.localCore.GetUsage())
}

// handleUsageClear wipes recorded usage.
//
//	DELETE /api/usage          (current)
//	POST   /api/usage/clear    (legacy alias)
func (g *Gateway) handleUsageClear(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodPost {
		deprecated(w, "/api/usage")
	}
	if !allowMethod(w, r, http.MethodPost, http.MethodDelete) {
		return
	}
	if g.localCore == nil {
		unavailable(w, "core not ready")
		return
	}
	g.localCore.ClearUsage()
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"ok":    true,
		"usage": g.localCore.GetUsage(),
	})
}

// handleModelsList GET /api/models —enabled model catalog for mocr/WebUI.
func (g *Gateway) handleModelsList(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	if g.providerStore == nil {
		http.Error(w, "provider store not ready", http.StatusServiceUnavailable)
		return
	}
	catalog := g.providerStore.Catalog()
	if catalog == nil {
		catalog = []providers.CatalogEntry{}
	}
	// Attach per-model enable flag + full provider snapshot for UI toggles.
	snap := g.providerStore.Snapshot()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"models":              catalog,
		"all_model_ids":       g.providerStore.AllModels(),
		"default_provider_id": snap.DefaultProviderID,
		"default_model":       snap.DefaultModel,
		"providers":           snap.Providers,
	})
}

func (g *Gateway) handleLifePermissions(w http.ResponseWriter, r *http.Request) {
	if g.localCore == nil {
		http.Error(w, "core not ready", http.StatusServiceUnavailable)
		return
	}
	switch r.Method {
	case http.MethodGet:
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(g.localCore.GetPermissions())
	case http.MethodPost, http.MethodPut:
		var p server.Permissions
		if err := json.NewDecoder(r.Body).Decode(&p); err != nil {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}
		g.localCore.SetPermissions(p)
		g.forwardLifePermissions(p)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(g.localCore.GetPermissions())
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (g *Gateway) handleLifeMemories(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	emptyMemories := map[string]interface{}{
		"memories": []interface{}{},
		"stats": map[string]interface{}{
			"working": 0, "shortTerm": map[string]int{"total": 0}, "longTerm": 0, "avgStrength": 0,
		},
	}
	// Proxy to registered L.I.F.E plugin if present; otherwise empty.
	lifes := g.registry.GetPluginsByCapability("life")
	if len(lifes) == 0 || lifes[0].Address == "" {
		writeJSON(w, http.StatusOK, emptyMemories)
		return
	}

	conn, err := g.dial(lifes[0].Address)
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	client := lifev1.NewLifeServiceClient(conn)
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	limit := int32(100)
	if raw := r.URL.Query().Get("limit"); raw != "" {
		var parsed int
		if _, err := fmt.Sscanf(raw, "%d", &parsed); err == nil && parsed > 0 && parsed <= 500 {
			limit = int32(parsed)
		}
	}
	resp, err := client.GetMemories(ctx, &lifev1.GetMemoriesRequest{Limit: limit, Query: r.URL.Query().Get("query")})
	if err != nil {
		// Soft-fail so the sidebar never breaks
		payload := map[string]interface{}{}
		for k, v := range emptyMemories {
			payload[k] = v
		}
		payload["error"] = err.Error()
		writeJSON(w, http.StatusOK, payload)
		return
	}

	items := make([]map[string]interface{}, 0, len(resp.Memories))
	for _, m := range resp.Memories {
		items = append(items, map[string]interface{}{
			"id":         m.Id,
			"content":    m.Content,
			"importance": m.Importance,
			"strength":   m.Strength,
			"created_at": m.CreatedAt,
			"tags":       m.Tags,
			"tier":       m.Tier,
		})
	}

	writeJSON(w, http.StatusOK, map[string]interface{}{
		"memories": items,
		"stats": map[string]interface{}{
			"working":     resp.WorkingCount,
			"shortTerm":   map[string]int{"total": int(resp.ShortTermCount)},
			"longTerm":    int(resp.LongTermCount),
			"avgStrength": resp.AvgStrength,
		},
	})
}

// handleLifeCompanion proxies LIFE-owned companion dashboards and actions.
func (g *Gateway) handleLifeCompanion(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 12*time.Second)
	defer cancel()
	if r.Method == http.MethodGet {
		var resp *lifev1.GetCompanionResponse
		if err := g.lifeCall(ctx, func(client lifev1.LifeServiceClient) error {
			var callErr error
			resp, callErr = client.GetCompanion(ctx, &lifev1.GetCompanionRequest{})
			return callErr
		}); err != nil {
			upstreamError(w, err.Error())
			return
		}
		writeRawJSON(w, http.StatusOK, resp.Json)
		return
	}
	if r.Method != http.MethodPost {
		allowMethod(w, r, http.MethodGet, http.MethodPost)
		return
	}
	var body struct {
		Action  string                 `json:"action"`
		Payload map[string]interface{} `json:"payload"`
	}
	if !decodeBody(w, r, &body, maxSmallBody) {
		return
	}
	payload, _ := json.Marshal(body.Payload)
	var resp *lifev1.ManageCompanionResponse
	if err := g.lifeCall(ctx, func(client lifev1.LifeServiceClient) error {
		var callErr error
		resp, callErr = client.ManageCompanion(ctx, &lifev1.ManageCompanionRequest{Action: body.Action, PayloadJson: string(payload)})
		return callErr
	}); err != nil {
		upstreamError(w, err.Error())
		return
	}
	if !resp.Ok {
		writeErr(w, http.StatusBadRequest, "companion_error", resp.Error)
		return
	}
	writeRawJSON(w, http.StatusOK, resp.Json)
}

func (g *Gateway) handleRunDirect(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var req struct {
		Tool      string `json:"tool"`
		Args      string `json:"args"`
		SessionID string `json:"session_id"`
	}
	if !decodeBody(w, r, &req, maxDirectRunBody) {
		return
	}
	if req.Tool == "" {
		badRequest(w, "tool required")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 60*time.Second)
	defer cancel()
	resp, err := g.coreSvc.RunDirect(ctx, &corev1.RunDirectRequest{
		Tool:      req.Tool,
		Args:      req.Args,
		SessionId: req.SessionID,
	})
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"success": resp.Success,
		"result":  resp.Result,
		"error":   resp.Error,
	})
}

// live2DRoot is where uploaded Live2D models are stored (served by Vite as /live2d/models/...).
func live2DRoot() string {
	if p := os.Getenv("LIVE2D_DIR"); p != "" {
		return p
	}
	if _, err := os.Stat(filepath.Join("..", "webui", "public")); err == nil {
		return filepath.Join("..", "webui", "public", "live2d", "models")
	}
	return filepath.Join("data", "live2d", "models")
}

// imagesRoot stores chat image uploads.
func imagesRoot() string {
	if p := os.Getenv("CHAT_IMAGE_DIR"); p != "" {
		return p
	}
	dataDir := os.Getenv("CORE_DATA_DIR")
	if dataDir == "" {
		dataDir = "data"
	}
	return filepath.Join(dataDir, "uploads", "images")
}

var allowedImageExt = map[string]bool{
	".png": true, ".jpg": true, ".jpeg": true, ".gif": true, ".webp": true,
}

// handleImages POST saves a chat image; GET streams one by ?file=name.
func (g *Gateway) handleImages(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		r.Body = http.MaxBytesReader(w, r.Body, 16<<20)
		if err := r.ParseMultipartForm(8 << 20); err != nil {
			badRequest(w, "invalid multipart form: "+err.Error())
			return
		}
		file, hdr, err := r.FormFile("file")
		if err != nil {
			http.Error(w, "file is required", http.StatusBadRequest)
			return
		}
		defer file.Close()

		ext := strings.ToLower(filepath.Ext(hdr.Filename))
		if !allowedImageExt[ext] {
			http.Error(w, "unsupported image type", http.StatusBadRequest)
			return
		}

		root := imagesRoot()
		if err := os.MkdirAll(root, 0o755); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		name := fmt.Sprintf("img_%d%s", time.Now().UnixNano(), ext)
		dstPath := filepath.Join(root, name)
		dst, err := os.Create(dstPath)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		if _, err := io.Copy(dst, file); err != nil {
			dst.Close()
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		dst.Close()

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"file": name,
			"url":  "/api/images?file=" + name,
		})

	case http.MethodGet:
		name := r.URL.Query().Get("file")
		if name == "" || strings.ContainsAny(name, `/\`) || strings.Contains(name, "..") {
			http.Error(w, "invalid file", http.StatusBadRequest)
			return
		}
		ext := strings.ToLower(filepath.Ext(name))
		if !allowedImageExt[ext] {
			http.Error(w, "unsupported image type", http.StatusBadRequest)
			return
		}
		path := filepath.Join(imagesRoot(), name)
		if _, err := os.Stat(path); err != nil {
			http.Error(w, "not found", http.StatusNotFound)
			return
		}
		w.Header().Set("Cache-Control", "public, max-age=86400")
		http.ServeFile(w, r, path)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

// handleTasks lists Core task-state machine entries (active + recent).
func (g *Gateway) handleTasks(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		if g.localCore == nil {
			unavailable(w, "core not ready")
			return
		}
		var event server.TaskEvent
		if !decodeBody(w, r, &event, maxTaskBody) {
			return
		}
		if err := g.localCore.RecordTask(event); err != nil {
			writeErr(w, http.StatusConflict, "conflict", err.Error())
			return
		}
		writeJSON(w, http.StatusOK, map[string]bool{"ok": true})
	case http.MethodGet:
		if g.localCore == nil {
			writeJSON(w, http.StatusOK, map[string]interface{}{"tasks": []interface{}{}})
			return
		}
		if r.URL.Query().Get("incremental") == "1" {
			writeJSON(w, http.StatusOK, g.localCore.TaskDelta(r.URL.Query().Get("cursor")))
			return
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"tasks": g.localCore.ListTasks(),
		})
	default:
		allowMethod(w, r, http.MethodGet, http.MethodPost)
	}
}

// listLive2DModels scans for *.model3.json under live2DRoot.
func listLive2DModels() []map[string]string {
	root := live2DRoot()
	var out []map[string]string
	_ = filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
		if err != nil || d.IsDir() {
			return nil
		}
		if !isLive2DManifest(d.Name()) {
			return nil
		}
		rel, relErr := filepath.Rel(root, path)
		if relErr != nil {
			return nil
		}
		rel = filepath.ToSlash(rel)
		id := strings.TrimSuffix(strings.TrimSuffix(rel, ".model3.json"), ".model.json")
		label := filepath.Base(id)
		out = append(out, map[string]string{
			"id":    id,
			"label": label,
			"url":   "/live2d/models/" + rel,
		})
		return nil
	})
	if out == nil {
		out = []map[string]string{}
	}
	return out
}

// handleLive2D GET lists uploaded models; POST accepts multipart folder upload.
func (g *Gateway) handleLive2D(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"models": listLive2DModels(),
		})
	case http.MethodPost:
		r.Body = http.MaxBytesReader(w, r.Body, 512<<20)
		if err := r.ParseMultipartForm(32 << 20); err != nil {
			http.Error(w, "invalid multipart form: "+err.Error(), http.StatusBadRequest)
			return
		}
		defer r.MultipartForm.RemoveAll()
		root := live2DRoot()
		if err := os.MkdirAll(root, 0o755); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		files := r.MultipartForm.File["files"]
		if len(files) == 0 {
			// also accept any file field
			for _, v := range r.MultipartForm.File {
				files = append(files, v...)
				break
			}
		}
		if len(files) == 0 {
			http.Error(w, "no files", http.StatusBadRequest)
			return
		}

		// Optional paths field: JSON array of relative paths aligned with files.
		// Browsers strip directory info from multipart filenames, so the client
		// sends webkitRelativePath separately.
		var relPaths []string
		if vals, ok := r.MultipartForm.Value["paths"]; ok && len(vals) > 0 {
			_ = json.Unmarshal([]byte(vals[0]), &relPaths)
		}

		// Normalize relative paths to posix form.
		normPaths := make([]string, len(files))
		for i := range files {
			raw := ""
			if i < len(relPaths) {
				raw = relPaths[i]
			} else if files[i] != nil {
				raw = files[i].Filename
			}
			raw = strings.ReplaceAll(raw, "\\", "/")
			for strings.HasPrefix(raw, "/") {
				raw = raw[1:]
			}
			// Drop leading "./" segments
			for strings.HasPrefix(raw, "./") {
				raw = raw[2:]
			}
			// Reject path escapes
			parts := strings.Split(raw, "/")
			cleanParts := make([]string, 0, len(parts))
			bad := false
			for _, p := range parts {
				if p == "" || p == "." || p == ".." || strings.Contains(p, ":") {
					bad = true
					break
				}
				cleanParts = append(cleanParts, p)
			}
			if bad || len(cleanParts) == 0 {
				normPaths[i] = ""
				continue
			}
			normPaths[i] = strings.Join(cleanParts, "/")
		}

		// Determine a single root folder name (first path segment shared by all).
		// Files without a directory segment are placed under that root as-is.
		rootNames := map[string]struct{}{}
		for _, p := range normPaths {
			if p == "" {
				continue
			}
			if idx := strings.Index(p, "/"); idx > 0 {
				rootNames[p[:idx]] = struct{}{}
			} else {
				rootNames[p] = struct{}{}
			}
		}
		if len(rootNames) == 0 {
			http.Error(w, "no valid files", http.StatusBadRequest)
			return
		}
		// Prefer a name that is a pure directory prefix (has subpaths).
		rootName := ""
		for n := range rootNames {
			if rootName == "" {
				rootName = n
			}
		}
		// If multiple roots, pick the one most common / first seen in order.
		counts := map[string]int{}
		order := []string{}
		for _, p := range normPaths {
			if p == "" {
				continue
			}
			var top string
			if idx := strings.Index(p, "/"); idx > 0 {
				top = p[:idx]
			} else {
				top = p
			}
			if counts[top] == 0 {
				order = append(order, top)
			}
			counts[top]++
		}
		if len(order) > 0 {
			rootName = order[0]
			for _, n := range order {
				if counts[n] > counts[rootName] {
					rootName = n
				}
			}
		}

		// Unique target dir under root: rootName, rootName-2, ...
		targetDir := filepath.Join(root, rootName)
		for i := 2; ; i++ {
			if _, err := os.Stat(targetDir); os.IsNotExist(err) {
				break
			}
			targetDir = filepath.Join(root, fmt.Sprintf("%s-%d", rootName, i))
		}
		if err := os.MkdirAll(targetDir, 0o755); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		finalRootName := filepath.Base(targetDir)

		firstModelURL := ""
		saved := 0
		for i, fh := range files {
			rel := normPaths[i]
			if rel == "" {
				continue
			}
			// Strip the shared root folder; write under finalRootName/remainder.
			// If path has no directory (single file), keep basename under root.
			remainder := rel
			if idx := strings.Index(rel, "/"); idx > 0 && rel[:idx] == rootName {
				remainder = rel[idx+1:]
				if remainder == "" {
					continue
				}
			} else if idx := strings.Index(rel, "/"); idx <= 0 {
				// bare filename: place it under the root folder
				remainder = rel
			}
			dstPath := filepath.Join(targetDir, filepath.FromSlash(remainder))
			// Ensure still under targetDir
			if !strings.HasPrefix(dstPath, targetDir) {
				continue
			}
			if err := os.MkdirAll(filepath.Dir(dstPath), 0o755); err != nil {
				continue
			}
			src, err := fh.Open()
			if err != nil {
				continue
			}
			data, err := io.ReadAll(io.LimitReader(src, 64<<20))
			src.Close()
			if err != nil {
				continue
			}
			if err := os.WriteFile(dstPath, data, 0o644); err != nil {
				continue
			}
			saved++
			if isLive2DManifest(remainder) && firstModelURL == "" {
				firstModelURL = "/live2d/models/" + filepath.ToSlash(filepath.Join(finalRootName, remainder))
			}
		}
		if saved == 0 || firstModelURL == "" {
			os.RemoveAll(targetDir)
			http.Error(w, "No Live2D manifest found. Upload the complete folder containing .model.json or .model3.json and its textures/model files.", http.StatusBadRequest)
			return
		}
		manifest := filepath.Join(root, filepath.FromSlash(strings.TrimPrefix(firstModelURL, "/live2d/models/")))
		if err := validateLive2DManifest(manifest); err != nil {
			os.RemoveAll(targetDir)
			http.Error(w, err.Error(), 400)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":        true,
			"models":    listLive2DModels(),
			"model_url": firstModelURL,
		})
	case http.MethodDelete:
		deprecated(w, "/api/live2d/{path...}")
		g.deleteLive2DModelByID(w, r.URL.Query().Get("id"))
	default:
		allowMethod(w, r, http.MethodGet, http.MethodPost, http.MethodDelete)
	}
}

// handleLive2DDeletePath DELETE /api/live2d/{path...} — REST form of
// DELETE /api/live2d?id=<path>. Ids contain "/" (folder/manifest), hence the
// trailing wildcard.
func (g *Gateway) handleLive2DDeletePath(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodDelete) {
		return
	}
	g.deleteLive2DModelByID(w, r.PathValue("path"))
}

func (g *Gateway) deleteLive2DModelByID(w http.ResponseWriter, id string) {
	if err := deleteLive2DModel(id); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_model", err.Error())
		return
	}
	if g.settingsStore != nil {
		values := g.settingsStore.GetValues("live2d")
		current, _ := values["model_url"].(string)
		folder := strings.Split(id, "/")[0]
		if strings.HasPrefix(current, "/live2d/models/"+folder+"/") {
			_ = g.settingsStore.SetValues("live2d", map[string]interface{}{"enabled": false, "model_url": ""})
		}
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"ok": true, "models": listLive2DModels()})
}
