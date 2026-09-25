package server

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"sync"
	"time"

	"0kay/core/internal/pairing"
	"0kay/core/internal/registry"
	agentv1 "0kay/gen/agent/v1"
	corev1 "0kay/gen/core/v1"
	lifev1 "0kay/gen/life/v1"
	mocrv1 "0kay/gen/mocr/v1"
	pluginv1 "0kay/gen/plugin/v1"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/keepalive"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

// CoreServiceServer implements the CoreService gRPC service.
type CoreServiceServer struct {
	corev1.UnimplementedCoreServiceServer
	registry *registry.Registry

	mu               sync.RWMutex
	tasks            map[string]*TaskInfo
	completed        []string
	taskHistoryPath  string
	callbackMu       sync.Mutex
	callbacks        map[string]taskCallback
	taskFingerprints map[string]string
	taskRevision     uint64
	taskChanges      map[string]uint64
	taskRemoved      map[string]uint64

	// sessions: session_id -> conversation history
	sessionMu sync.RWMutex
	sessions  map[string][]*corev1.ChatMessage

	// usage tracker
	usageMu sync.Mutex
	usage   *UsageStore

	// mocr address for direct generation
	mocrAddr string

	// dispatchActivity tracks last ledger progress per dispatched task for the
	// inactivity watchdog (dead/hung executor detection).
	dispatchMu       sync.Mutex
	dispatchActivity map[string]time.Time
	dispatchLastSeen map[string]time.Time

	// life permissions (screen_watch / computer_use / host report)
	permMu      sync.RWMutex
	permissions Permissions

	// providerStore resolves model credentials for real generation (nil = offline).
	providerStore ProviderStore
}

// ProviderStore is the subset of providers.Store CallMocr needs.
type ProviderStore interface {
	ResolveModel(modelID string) (provider, baseURL, apiKey, resolved string, ok bool)
}

// Permissions holds Life capability switches.
type Permissions struct {
	ScreenWatch     bool   `json:"screen_watch"`
	ComputerUse     bool   `json:"computer_use"`
	ReportAgentHost string `json:"report_agent_host"`
}

// TaskInfo holds information about an active task.
type TaskInfo struct {
	TaskID    string
	CallerID  string
	Prompt    string
	AgentID   string
	State     string // pending | running | done | failed | cancelled
	Result    string
	Error     string
	StartedAt time.Time
	EndedAt   time.Time
	CancelFn  context.CancelFunc
	SessionID string
	Kind      string
	ParentID  string
	Args      string
}

type persistedTask struct {
	TaskID    string    `json:"task_id"`
	CallerID  string    `json:"caller_id"`
	Prompt    string    `json:"prompt"`
	AgentID   string    `json:"agent_id"`
	State     string    `json:"state"`
	Result    string    `json:"result,omitempty"`
	Error     string    `json:"error,omitempty"`
	StartedAt time.Time `json:"started_at"`
	EndedAt   time.Time `json:"ended_at,omitempty"`
	SessionID string    `json:"session_id,omitempty"`
	Kind      string    `json:"kind,omitempty"`
	ParentID  string    `json:"parent_id,omitempty"`
	Args      string    `json:"args,omitempty"`
}

// UsageRecord is one token-usage sample.
type UsageRecord struct {
	Timestamp        time.Time `json:"timestamp"`
	RequestID        string    `json:"request_id"`
	SessionID        string    `json:"session_id"`
	Model            string    `json:"model"`
	PromptTokens     int32     `json:"prompt_tokens"`
	CompletionTokens int32     `json:"completion_tokens"`
	TotalTokens      int32     `json:"total_tokens"`
}

// UsageStore accumulates usage totals (in-memory + optional JSONL).
type UsageStore struct {
	records []UsageRecord
	file    string
}

// NewUsageStore creates a usage store, optionally restoring from disk.
func NewUsageStore(path string) *UsageStore {
	u := &UsageStore{file: path, records: nil}
	if path != "" {
		if data, err := os.ReadFile(path); err == nil {
			_ = json.Unmarshal(data, &u.records)
		}
	}
	return u
}

// Add records a usage sample and persists (debounced by caller simplicity: always save).
func (u *UsageStore) Add(rec UsageRecord) {
	u.records = append(u.records, rec)
	if u.file == "" {
		return
	}
	// keep last 10000
	if len(u.records) > 10000 {
		u.records = u.records[len(u.records)-10000:]
	}
	if data, err := json.Marshal(u.records); err == nil {
		_ = os.MkdirAll(filepath.Dir(u.file), 0o755)
		_ = os.WriteFile(u.file, data, 0o644)
	}
}

// Snapshot returns aggregate totals for /api/usage.
func (u *UsageStore) Snapshot() map[string]interface{} {
	type byKey struct {
		Prompt     int32 `json:"prompt"`
		Completion int32 `json:"completion"`
		Total      int32 `json:"total"`
		Count      int32 `json:"count"`
	}
	byModel := map[string]*byKey{}
	byDay := map[string]*byKey{}
	var totalPrompt, totalCompletion, total int32
	sessions := map[string]struct{}{}

	for _, r := range u.records {
		totalPrompt += r.PromptTokens
		totalCompletion += r.CompletionTokens
		total += r.TotalTokens
		if r.SessionID != "" {
			sessions[r.SessionID] = struct{}{}
		}
		m := r.Model
		if m == "" {
			m = "unknown"
		}
		if byModel[m] == nil {
			byModel[m] = &byKey{}
		}
		byModel[m].Prompt += r.PromptTokens
		byModel[m].Completion += r.CompletionTokens
		byModel[m].Total += r.TotalTokens
		byModel[m].Count++

		day := r.Timestamp.Format("2006-01-02")
		if byDay[day] == nil {
			byDay[day] = &byKey{}
		}
		byDay[day].Prompt += r.PromptTokens
		byDay[day].Completion += r.CompletionTokens
		byDay[day].Total += r.TotalTokens
		byDay[day].Count++
	}

	return map[string]interface{}{
		"total_prompt_tokens":     totalPrompt,
		"total_completion_tokens": totalCompletion,
		"total_tokens":            total,
		"request_count":           len(u.records),
		"session_count":           len(sessions),
		"by_model":                byModel,
		"by_day":                  byDay,
		"recent":                  lastN(u.records, 20),
	}
}

// Clear removes all usage records and deletes the on-disk file.
func (u *UsageStore) Clear() {
	u.records = nil
	if u.file != "" {
		_ = os.Remove(u.file)
	}
}

func lastN(in []UsageRecord, n int) []UsageRecord {
	if len(in) <= n {
		return in
	}
	return in[len(in)-n:]
}

// NewCoreServiceServer creates a new CoreServiceServer.
func NewCoreServiceServer(reg *registry.Registry) *CoreServiceServer {
	mocrAddr := os.Getenv("MOCR_ADDRESS")
	if mocrAddr == "" {
		mocrAddr = "localhost:50052"
	}
	usagePath := os.Getenv("USAGE_PATH")
	if usagePath == "" {
		usagePath = "data/usage.json"
	}
	taskPath := os.Getenv("TASKS_PATH")
	if taskPath == "" {
		taskPath = "data/tasks.json"
	}
	tasks := make(map[string]*TaskInfo)
	if data, err := os.ReadFile(taskPath); err == nil {
		var saved []persistedTask
		if json.Unmarshal(data, &saved) == nil {
			for _, item := range saved {
				copy := item
				tasks[item.TaskID] = &TaskInfo{TaskID: copy.TaskID, CallerID: copy.CallerID, Prompt: copy.Prompt, AgentID: copy.AgentID, State: copy.State, Result: copy.Result, Error: copy.Error, StartedAt: copy.StartedAt, EndedAt: copy.EndedAt}
				tasks[item.TaskID].SessionID = copy.SessionID
				tasks[item.TaskID].Kind = copy.Kind
				tasks[item.TaskID].ParentID = copy.ParentID
				tasks[item.TaskID].Args = copy.Args
				if copy.State == "running" || copy.State == "pending" {
					tasks[item.TaskID].State = "failed"
					tasks[item.TaskID].Error = "Core restarted before execution was acknowledged"
					tasks[item.TaskID].EndedAt = time.Now()
				}
			}
		}
	}
	instance := &CoreServiceServer{
		registry:         reg,
		tasks:            tasks,
		taskHistoryPath:  taskPath,
		sessions:         make(map[string][]*corev1.ChatMessage),
		usage:            NewUsageStore(usagePath),
		mocrAddr:         mocrAddr,
		dispatchActivity: make(map[string]time.Time),
		dispatchLastSeen: make(map[string]time.Time),
		permissions: Permissions{
			ScreenWatch: false,
			ComputerUse: false,
		},
	}
	instance.replayTaskJournal()
	instance.loadCallbacks()
	for _, task := range tasks {
		if task.Kind == "agent" && task.State == "failed" && task.Error == "Core restarted before execution was acknowledged" {
			instance.callbacks[task.TaskID] = taskCallback{TaskID: task.TaskID, State: pluginv1.TaskState_TASK_STATE_FAILED, Error: task.Error}
		}
	}
	instance.saveCallbacksLocked()
	go instance.retryCallbacks()
	// Upgrade existing LIFE-dispatched task history into browsable sessions.
	for _, task := range tasks {
		if (task.Kind == "agent" || task.Kind == "") && !strings.HasPrefix(task.SessionID, "agent-session:") {
			task.SessionID = instance.EnsureAgentSession(task.SessionID, task.CallerID, task.Prompt)
			task.Kind = "agent"
		}
	}
	return instance
}

func (s *CoreServiceServer) persistTasksLocked() {
	if s.taskHistoryPath == "" {
		return
	}
	items := make([]persistedTask, 0, len(s.tasks))
	for _, t := range s.tasks {
		items = append(items, persistedTask{TaskID: t.TaskID, CallerID: t.CallerID, Prompt: t.Prompt, AgentID: t.AgentID, State: t.State, Result: t.Result, Error: t.Error, StartedAt: t.StartedAt, EndedAt: t.EndedAt, SessionID: t.SessionID, Kind: t.Kind, ParentID: t.ParentID, Args: t.Args})
	}
	if s.taskFingerprints == nil {
		s.taskFingerprints = map[string]string{}
	}
	changes := []persistedTask{}
	for _, item := range items {
		raw, _ := json.Marshal(item)
		if s.taskFingerprints[item.TaskID] != string(raw) {
			changes = append(changes, item)
		}
	}
	removed := []string{}
	for id := range s.taskFingerprints {
		if s.tasks[id] == nil {
			removed = append(removed, id)
		}
	}
	if len(changes) == 0 && len(removed) == 0 {
		return
	}
	if s.taskChanges == nil {
		s.taskChanges = map[string]uint64{}
		s.taskRemoved = map[string]uint64{}
	}
	s.taskRevision++
	for _, item := range changes {
		s.taskChanges[item.TaskID] = s.taskRevision
		if item.Kind == "agent_session" && item.State == "deleted" {
			removed = append(removed, item.TaskID)
		}
	}
	for _, id := range removed {
		s.taskRemoved[id] = s.taskRevision
		delete(s.taskChanges, id)
	}
	_ = os.MkdirAll(filepath.Dir(s.taskHistoryPath), 0700)
	journal, err := os.OpenFile(s.taskHistoryPath+".journal", os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0600)
	if err != nil {
		log.Printf("task journal: %v", err)
		return
	}
	raw, _ := json.Marshal(struct {
		Tasks   []persistedTask `json:"tasks"`
		Removed []string        `json:"removed"`
	}{changes, removed})
	_, err = journal.Write(append(raw, '\n'))
	if err == nil {
		err = journal.Sync()
	}
	journal.Close()
	if err != nil {
		log.Printf("task journal write: %v", err)
		return
	}
	for _, item := range changes {
		raw, _ := json.Marshal(item)
		s.taskFingerprints[item.TaskID] = string(raw)
	}
	for _, id := range removed {
		if s.tasks[id] == nil {
			delete(s.taskFingerprints, id)
		}
	}
	info, _ := os.Stat(s.taskHistoryPath + ".journal")
	_, snapshotErr := os.Stat(s.taskHistoryPath)
	if snapshotErr == nil && info != nil && info.Size() < 8<<20 {
		return
	}
	if data, err := json.MarshalIndent(items, "", "  "); err == nil {
		_ = os.MkdirAll(filepath.Dir(s.taskHistoryPath), 0o755)
		temporary := s.taskHistoryPath + ".tmp"
		if err := os.WriteFile(temporary, data, 0o600); err == nil {
			if err = os.Rename(temporary, s.taskHistoryPath); err != nil {
				log.Printf("persist tasks: %v", err)
			} else {
				_ = os.WriteFile(s.taskHistoryPath+".journal", nil, 0600)
			}
		} else {
			log.Printf("persist tasks: %v", err)
		}
	}
}

// SetProviderStore wires multi-provider credential resolution.
func (s *CoreServiceServer) SetProviderStore(st ProviderStore) {
	s.providerStore = st
}

// GetUsage returns the usage snapshot for the HTTP gateway.
func (s *CoreServiceServer) GetUsage() map[string]interface{} {
	s.usageMu.Lock()
	defer s.usageMu.Unlock()
	return s.usage.Snapshot()
}

// ClearUsage wipes all recorded usage (in-memory + disk).
func (s *CoreServiceServer) ClearUsage() {
	s.usageMu.Lock()
	defer s.usageMu.Unlock()
	s.usage.Clear()
}

func (s *CoreServiceServer) RecordUsage(record UsageRecord) {
	s.usageMu.Lock()
	defer s.usageMu.Unlock()
	if record.RequestID != "" {
		for _, existing := range s.usage.records {
			if existing.RequestID == record.RequestID {
				return
			}
		}
	}
	s.usage.Add(record)
}

// touchDispatch records ledger activity for a dispatched root task tree.
func (s *CoreServiceServer) touchDispatch(root string) {
	if root == "" {
		return
	}
	s.dispatchMu.Lock()
	if _, ok := s.dispatchActivity[root]; ok {
		s.dispatchActivity[root] = time.Now()
	}
	s.dispatchMu.Unlock()
}

// beginDispatch registers an in-flight dispatch; returns a stop function.
func (s *CoreServiceServer) beginDispatch(taskID string) func() {
	s.dispatchMu.Lock()
	if s.dispatchActivity == nil {
		s.dispatchActivity = map[string]time.Time{}
	}
	s.dispatchActivity[taskID] = time.Now()
	s.dispatchMu.Unlock()
	return func() {
		s.dispatchMu.Lock()
		delete(s.dispatchActivity, taskID)
		delete(s.dispatchLastSeen, taskID)
		s.dispatchMu.Unlock()
	}
}

// GetPermissions returns current Life permissions.
func (s *CoreServiceServer) GetPermissions() Permissions {
	s.permMu.RLock()
	defer s.permMu.RUnlock()
	return s.permissions
}

// SetPermissions updates Life permissions.
func (s *CoreServiceServer) SetPermissions(p Permissions) {
	s.permMu.Lock()
	s.permissions = p
	s.permMu.Unlock()
}

// SessionMessages returns history for a session.
func (s *CoreServiceServer) SessionMessages(sessionID string) []*corev1.ChatMessage {
	if sessionID == "" {
		return nil
	}
	s.sessionMu.RLock()
	defer s.sessionMu.RUnlock()
	return append([]*corev1.ChatMessage{}, s.sessions[sessionID]...)
}

func (s *CoreServiceServer) appendSession(sessionID string, msgs ...*corev1.ChatMessage) {
	if sessionID == "" {
		return
	}
	s.sessionMu.Lock()
	defer s.sessionMu.Unlock()
	s.sessions[sessionID] = append(s.sessions[sessionID], msgs...)
	if len(s.sessions[sessionID]) > 200 {
		s.sessions[sessionID] = s.sessions[sessionID][len(s.sessions[sessionID])-200:]
	}
}

// estimateTokens approximates tokens as ~4 chars/token.
func estimateTokens(text string) int32 {
	n := len(text)
	if n == 0 {
		return 0
	}
	return int32((n + 3) / 4)
}

func (s *CoreServiceServer) dialMocr(ctx context.Context) (mocrv1.MocrServiceClient, func(), error) {
	conn, err := grpc.NewClient(s.mocrAddr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, nil, err
	}
	return mocrv1.NewMocrServiceClient(conn), func() { conn.Close() }, nil
}

// CallMocr proxies a request to the mocr service (real gRPC when available).
func (s *CoreServiceServer) CallMocr(req *corev1.CallMocrRequest, stream corev1.CoreService_CallMocrServer) (callErr error) {
	id := fmt.Sprintf("core-model:%d", time.Now().UnixNano())
	_ = s.RecordTask(TaskEvent{TaskID: id, CallerID: req.CallerId, SessionID: req.SessionId, Kind: "output", Prompt: req.Prompt, State: "running"})
	defer func() {
		if callErr != nil {
			s.finishTask(id, "failed", "", callErr.Error())
		} else {
			s.finishTask(id, "done", "Generation completed", "")
		}
	}()
	if req.RequestId == "" {
		return status.Error(codes.InvalidArgument, "request_id is required")
	}

	sessionID := req.SessionId
	if sessionID == "" {
		sessionID = "default"
	}

	// Build history: prefer client-provided messages, else session store
	var history []*corev1.ChatMessage
	if len(req.Messages) > 0 {
		history = req.Messages
	} else {
		history = s.SessionMessages(sessionID)
	}

	// Append current user prompt if not already last
	if req.Prompt != "" {
		lastIsUser := len(history) > 0 && history[len(history)-1].Role == "user" && history[len(history)-1].Content == req.Prompt
		if !lastIsUser {
			history = append(append([]*corev1.ChatMessage{}, history...), &corev1.ChatMessage{
				Role:    "user",
				Content: req.Prompt,
			})
		}
	}

	// Context compression based on soft limit
	history = s.maybeCompressFrom(sessionID, history, 8000)

	if req.SystemPrompt != "" {
		history = append([]*corev1.ChatMessage{{Role: "system", Content: req.SystemPrompt}}, history...)
	}

	ctx, cancel := context.WithTimeout(stream.Context(), 120*time.Second)
	defer cancel()

	client, closeFn, err := s.dialMocr(ctx)
	if err != nil {
		// Fallback: echo so UI still works without mocr
		log.Printf("[CallMocr] dial mocr failed: %v", err)
		return s.fallbackStream(req, history, stream, err.Error())
	}
	defer closeFn()

	// Resolve model: pin to configured default (ChooseModels is agent-only).
	// Chat never auto-selects via mocr selector.
	modelID := req.ModelId
	var prov, baseURL, apiKey string
	if s.providerStore != nil {
		p, u, k, resolved, ok := s.providerStore.ResolveModel(modelID)
		if ok {
			prov, baseURL, apiKey, modelID = p, u, k, resolved
		} else if modelID == "" {
			modelID = "default-model"
		}
	} else if modelID == "" {
		modelID = "default-model"
	}

	// Map history to mocr messages
	mocrMsgs := make([]*mocrv1.Message, 0, len(history))
	for _, m := range history {
		mocrMsgs = append(mocrMsgs, &mocrv1.Message{Role: m.Role, Content: m.Content})
	}

	// Forward optional generation params (temperature/max_tokens/system_prompt already in history).
	genReq := &mocrv1.GenerateRequest{
		ModelId:  modelID,
		Messages: mocrMsgs,
		Stream:   true,
		Provider: prov,
		BaseUrl:  baseURL,
		ApiKey:   apiKey,
	}
	// Propagate correlation ids so mocr can attribute usage to session/request.
	pairs := []string{}
	if req.RequestId != "" {
		pairs = append(pairs, "x-0kay-request-id", req.RequestId)
	}
	if sessionID != "" {
		pairs = append(pairs, "x-0kay-session-id", sessionID)
	}
	if len(pairs) > 0 {
		ctx = metadata.NewOutgoingContext(ctx, metadata.Pairs(pairs...))
	}
	if req.SystemPrompt != "" {
		// System prompt is already prepended to history; also pass for providers that prefer the field.
		genReq.SystemPrompt = req.SystemPrompt
	}
	if req.Context != nil {
		if req.Context.Temperature > 0 {
			genReq.Temperature = req.Context.Temperature
		}
		if req.Context.MaxTokens > 0 {
			genReq.MaxTokens = req.Context.MaxTokens
		}
	}

	genStream, err := client.Generate(ctx, genReq)
	if err != nil {
		log.Printf("[CallMocr] generate failed: %v", err)
		return s.fallbackStream(req, history, stream, err.Error())
	}

	var full strings.Builder
	for {
		resp, err := genStream.Recv()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Printf("[CallMocr] stream recv: %v", err)
			break
		}
		if resp.Chunk != "" {
			full.WriteString(resp.Chunk)
			if err := stream.Send(&corev1.CallMocrResponse{
				RequestId: req.RequestId,
				Chunk:     resp.Chunk,
				Done:      false,
			}); err != nil {
				return err
			}
		}
		if resp.Done {
			usage := resp.Usage
			if usage == nil {
				pt := estimateTokens(req.Prompt)
				ct := estimateTokens(full.String())
				usage = &mocrv1.TokenUsage{
					PromptTokens:     pt,
					CompletionTokens: ct,
					TotalTokens:      pt + ct,
				}
			}
			// mocr reports all provider calls centrally; do not double-count here.

			// Persist session turns
			if req.Prompt != "" {
				s.appendSession(sessionID, &corev1.ChatMessage{Role: "user", Content: req.Prompt})
			}
			if full.Len() > 0 {
				s.appendSession(sessionID, &corev1.ChatMessage{Role: "assistant", Content: full.String()})
			}

			return stream.Send(&corev1.CallMocrResponse{
				RequestId: req.RequestId,
				Done:      true,
				Usage: &corev1.TokenUsage{
					PromptTokens:     usage.PromptTokens,
					CompletionTokens: usage.CompletionTokens,
					TotalTokens:      usage.TotalTokens,
				},
			})
		}
	}

	// EOF without explicit done
	pt := estimateTokens(req.Prompt)
	ct := estimateTokens(full.String())
	if req.Prompt != "" {
		s.appendSession(sessionID, &corev1.ChatMessage{Role: "user", Content: req.Prompt})
	}
	if full.Len() > 0 {
		s.appendSession(sessionID, &corev1.ChatMessage{Role: "assistant", Content: full.String()})
	}
	return stream.Send(&corev1.CallMocrResponse{
		RequestId: req.RequestId,
		Done:      true,
		Usage: &corev1.TokenUsage{
			PromptTokens:     pt,
			CompletionTokens: ct,
			TotalTokens:      pt + ct,
		},
	})
}

func (s *CoreServiceServer) maybeCompressFrom(sessionID string, history []*corev1.ChatMessage, maxContext int) []*corev1.ChatMessage {
	if maxContext <= 0 {
		maxContext = 8000
	}
	threshold := int32(float64(maxContext) * 0.7)
	total := int32(0)
	for _, m := range history {
		total += estimateTokens(m.Content)
	}
	if total <= threshold || len(history) <= 6 {
		return history
	}
	keepFrom := len(history) - 12
	if keepFrom < 1 {
		keepFrom = 1
	}
	summary := &corev1.ChatMessage{
		Role:    "system",
		Content: fmt.Sprintf("[context compressed: dropped %d older messages]", keepFrom),
	}
	compressed := append([]*corev1.ChatMessage{summary}, history[keepFrom:]...)
	if sessionID != "" {
		s.sessionMu.Lock()
		s.sessions[sessionID] = compressed
		s.sessionMu.Unlock()
	}
	return compressed
}

func (s *CoreServiceServer) fallbackStream(req *corev1.CallMocrRequest, history []*corev1.ChatMessage, stream corev1.CoreService_CallMocrServer, reason string) error {
	// Build a deterministic offline reply so the UI keeps working.
	lastUser := req.Prompt
	for i := len(history) - 1; i >= 0; i-- {
		if history[i].Role == "user" {
			lastUser = history[i].Content
			break
		}
	}
	if lastUser == "" {
		lastUser = "(empty)"
	}
	reply := "0kay offline reply (mocr unreachable): " + truncateRunes(lastUser, 120)
	chunks := splitRunes(reply, 40)
	for _, c := range chunks {
		if err := stream.Send(&corev1.CallMocrResponse{
			RequestId: req.RequestId,
			Chunk:     c,
		}); err != nil {
			return err
		}
	}
	pt := estimateTokens(req.Prompt)
	ct := estimateTokens(reply)
	sessionID := req.SessionId
	if sessionID == "" {
		sessionID = "default"
	}
	if req.Prompt != "" {
		s.appendSession(sessionID, &corev1.ChatMessage{Role: "user", Content: req.Prompt})
	}
	s.appendSession(sessionID, &corev1.ChatMessage{Role: "assistant", Content: reply})
	// Offline text is not provider token usage and must not enter billed totals.

	return stream.Send(&corev1.CallMocrResponse{
		RequestId: req.RequestId,
		Error:     reason,
		Done:      true,
		Usage: &corev1.TokenUsage{
			PromptTokens:     pt,
			CompletionTokens: ct,
			TotalTokens:      pt + ct,
		},
	})
}

func truncateRunes(s string, n int) string {
	r := []rune(s)
	if len(r) <= n {
		return s
	}
	return string(r[:n]) + "…"
}

func splitRunes(s string, n int) []string {
	r := []rune(s)
	var out []string
	for i := 0; i < len(r); i += n {
		end := i + n
		if end > len(r) {
			end = len(r)
		}
		out = append(out, string(r[i:end]))
	}
	return out
}

// ListAgents returns all registered Agent plugins.
func (s *CoreServiceServer) ListAgents(ctx context.Context, req *corev1.ListAgentsRequest) (*corev1.ListAgentsResponse, error) {
	onlineOnly := !req.IncludeUnhealthy
	agents := s.registry.GetAgents(onlineOnly)

	onlineCount := int32(s.registry.CountOnlineAgents())

	result := make([]*corev1.AgentInfo, 0, len(agents))
	for _, a := range agents {
		age := time.Since(a.LastHeartbeat).Seconds()
		result = append(result, &corev1.AgentInfo{
			PluginId:                a.PluginID,
			Name:                    a.Info.GetName(),
			Version:                 a.Info.GetVersion(),
			Address:                 a.Address,
			Status:                  a.Status,
			ActiveTasks:             a.ActiveTasks,
			LastHeartbeatAgeSeconds: int64(age),
			Host:                    a.Host,
		})
	}

	return &corev1.ListAgentsResponse{
		Agents:      result,
		OnlineCount: onlineCount,
	}, nil
}

// RunDirect dispatches a direct tool call to the first healthy agent (no LLM).
func (s *CoreServiceServer) RunDirect(ctx context.Context, req *corev1.RunDirectRequest) (response *corev1.RunDirectResponse, callErr error) {
	id := fmt.Sprintf("direct-tool:%d", time.Now().UnixNano())
	_ = s.RecordTask(TaskEvent{TaskID: id, CallerID: "core", SessionID: req.SessionId, Kind: "tool", Prompt: req.Tool, State: "running"})
	defer func() {
		if callErr != nil {
			s.finishTask(id, "failed", "", callErr.Error())
		} else if response != nil && response.Success {
			s.finishTask(id, "done", response.Result, "")
		} else if response != nil {
			s.finishTask(id, "failed", response.Result, response.Error)
		}
	}()
	if req.Tool == "" {
		return nil, status.Error(codes.InvalidArgument, "tool is required")
	}

	// Permission gates for dangerous tools
	perm := s.GetPermissions()
	if req.Tool == "computeruse" || req.Tool == "shell" {
		if !perm.ComputerUse {
			return &corev1.RunDirectResponse{
				Success: false,
				Error:   "computer_use permission is disabled",
			}, nil
		}
	}

	agents := s.registry.GetAgents(true)
	if len(agents) == 0 || agents[0].Address == "" {
		return &corev1.RunDirectResponse{
			Success: false,
			Error:   "no healthy agents available",
		}, nil
	}

	conn, err := grpc.NewClient(agents[0].Address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "connect agent: %v", err)
	}
	defer conn.Close()

	client := agentv1.NewAgentServiceClient(conn)
	resp, err := client.RunDirect(pairing.CallbackContext(ctx, agents[0].Address), &agentv1.RunDirectRequest{
		Tool:      req.Tool,
		Args:      req.Args,
		SessionId: req.SessionId,
	})
	if err != nil {
		return nil, status.Errorf(codes.Internal, "agent run: %v", err)
	}
	return &corev1.RunDirectResponse{
		Success: resp.Success,
		Result:  resp.Result,
		Error:   resp.Error,
	}, nil
}

// UseAgent dispatches a task to a healthy Agent asynchronously.
func (s *CoreServiceServer) UseAgent(ctx context.Context, req *corev1.UseAgentRequest) (*corev1.UseAgentResponse, error) {
	if req.TaskId == "" {
		return nil, status.Error(codes.InvalidArgument, "task_id is required")
	}
	if req.Prompt == "" {
		return nil, status.Error(codes.InvalidArgument, "prompt is required")
	}

	// Find a healthy agent
	if req.Metadata == nil {
		req.Metadata = map[string]string{}
	}
	originSession := req.Metadata["session_id"]
	req.Metadata["origin_session_id"] = originSession
	req.Metadata["session_id"] = s.EnsureAgentSession(originSession, req.CallerId, req.Prompt)
	if err := s.RecordTask(TaskEvent{TaskID: req.TaskId, CallerID: req.CallerId, Prompt: req.Prompt, State: "pending", Kind: "agent", SessionID: req.Metadata["session_id"], ParentID: req.Metadata["parent_id"]}); err != nil {
		return nil, status.Error(codes.AlreadyExists, err.Error())
	}
	agents := s.registry.GetAgents(true)
	if len(agents) == 0 {
		s.finishTask(req.TaskId, "failed", "", "no healthy agents available")
		return &corev1.UseAgentResponse{
			Accepted: false,
			TaskId:   req.TaskId,
			Message:  "no healthy agents available",
		}, nil
	}

	// Simple round-robin: pick first agent (could be improved)
	agent := agents[0]
	if requested := req.Metadata["executor_id"]; requested != "" {
		found := false
		for _, candidate := range agents {
			if candidate.PluginID == requested {
				agent = candidate
				found = true
				break
			}
		}
		if !found {
			s.finishTask(req.TaskId, "failed", "", "selected executor is offline or unavailable")
			return &corev1.UseAgentResponse{Accepted: false, TaskId: req.TaskId, Message: "selected executor is offline or unavailable"}, nil
		}
	}

	s.mu.Lock()
	s.tasks[req.TaskId].AgentID = agent.PluginID
	s.tasks[req.TaskId].State = "running"
	s.mu.Unlock()
	s.mu.Lock()
	s.persistTasksLocked()
	s.mu.Unlock()

	log.Printf("[UseAgent] Task %s dispatched to agent %s (addr=%s)",
		req.TaskId, agent.PluginID, agent.Address)

	// Dispatch asynchronously
	go s.dispatchToAgent(req, agent)

	return &corev1.UseAgentResponse{
		Accepted: true,
		TaskId:   req.TaskId,
		Message:  "task accepted for processing",
	}, nil
}

// dispatchToAgent calls AgentService.ExecuteTask and notifies L.I.F.E on completion.
func (s *CoreServiceServer) dispatchToAgent(req *corev1.UseAgentRequest, agent *registry.PluginInstance) {
	agentAddr := agent.Address
	if agentAddr == "" {
		log.Printf("[UseAgent] Agent %s has no address, failing task %s", agent.PluginID, req.TaskId)
		s.failTask(req.TaskId, "agent has no address")
		return
	}

	stopDispatch := s.beginDispatch(req.TaskId)
	defer stopDispatch()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Keepalive detects half-open TCP to a dead executor; the inactivity
	// watchdog catches a hung-but-connected agent (no ledger progress).
	idleTimeout := 60 * time.Minute
	if v := os.Getenv("CORE_AGENT_INACTIVITY_TIMEOUT"); v != "" {
		if d, err := time.ParseDuration(v); err == nil && d > 0 {
			idleTimeout = d
		}
	}
	go func() {
		defer func() {
			if recovered := recover(); recovered != nil {
				log.Printf("[UseAgent] inactivity watcher recovered from panic: %v", recovered)
			}
		}()
		ticker := time.NewTicker(time.Minute)
		defer ticker.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
			}
			s.dispatchMu.Lock()
			last, active := s.dispatchActivity[req.TaskId]
			s.dispatchMu.Unlock()
			if !active {
				return
			}
			if time.Since(last) > idleTimeout {
				log.Printf("[UseAgent] Task %s inactivity timeout after %s", req.TaskId, idleTimeout)
				cancel()
				return
			}
		}
	}()

	conn, err := grpc.NewClient(agentAddr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithKeepaliveParams(keepalive.ClientParameters{
			Time:                30 * time.Second,
			Timeout:             10 * time.Second,
			PermitWithoutStream: true,
		}),
	)
	if err != nil {
		log.Printf("[UseAgent] Failed to connect to agent %s: %v", agentAddr, err)
		s.failTask(req.TaskId, fmt.Sprintf("failed to connect to agent: %v", err))
		return
	}
	defer conn.Close()

	client := agentv1.NewAgentServiceClient(conn)

	agentType := req.AgentType
	if agentType == "" {
		agentType = "general"
	}

	executionPrompt := req.Prompt
	if strings.HasPrefix(req.Metadata["session_id"], "agent-session:") {
		executionPrompt = s.AgentSessionPrompt(req.Metadata["session_id"], req.TaskId, req.Prompt)
	}
	metadata := map[string]string{}
	for k, v := range req.Metadata {
		metadata[k] = v
	}
	if req.CallerId != "" && metadata["caller_id"] == "" {
		metadata["caller_id"] = req.CallerId
	}
	if _, ok := metadata["language"]; !ok {
		if req.CallerId == "webui" || metadata["caller_id"] == "webui" {
			metadata["language"] = "zh"
		}
	}
	resp, err := client.ExecuteTask(pairing.CallbackContext(ctx, agentAddr), &agentv1.ExecuteTaskRequest{
		TaskId:    req.TaskId,
		Prompt:    executionPrompt,
		AgentType: agentType,
		Metadata:  metadata,
	})

	if err != nil {
		log.Printf("[UseAgent] Task %s failed: %v", req.TaskId, err)
		s.finishTask(req.TaskId, "failed", "", err.Error())
		s.notifyLifeTaskCompleted(req.TaskId, pluginv1.TaskState_TASK_STATE_FAILED, "", err.Error())
		return
	}

	log.Printf("[UseAgent] Task %s completed with state %s", req.TaskId, resp.State.String())
	stateName := "done"
	switch resp.State {
	case pluginv1.TaskState_TASK_STATE_FAILED:
		stateName = "failed"
	case pluginv1.TaskState_TASK_STATE_CANCELLED:
		stateName = "cancelled"
	case pluginv1.TaskState_TASK_STATE_RUNNING, pluginv1.TaskState_TASK_STATE_PENDING:
		stateName = "running"
	}
	s.finishTask(req.TaskId, stateName, resp.Result, resp.Error)
	if stateName == "done" {
		s.maybeAutoTitleSession(req.Metadata["session_id"])
	}
	// Handoff summary JSON is only meaningful to LIFE; keep Core's fallback
	// localized for LIFE-dispatched tasks when the agent returned none.
	handoff := resp.Metadata["handoff"]
	if isLifeCaller(req.CallerId) {
		if handoff == "" {
			if metadata["language"] == "en" {
				handoff = `{"artifacts":[],"outcome":"Agent did not provide an artifact list; review the Agent session."}`
			} else {
				handoff = `{"artifacts":[],"outcome":"Agent 未提供产物清单，请查看 Agent 会话。"}`
			}
		}
	} else {
		handoff = ""
	}
	s.notifyLifeTaskCompleted(req.TaskId, resp.State, handoff, resp.Error)
}

func isLifeCaller(caller string) bool {
	c := strings.ToLower(strings.TrimSpace(caller))
	return c == "life" || strings.HasPrefix(c, "life:") || strings.HasPrefix(c, "plugin:life")
}

// finishTask records terminal state on TaskInfo (kept for ListTasks history).
func (s *CoreServiceServer) finishTask(taskID, state, result, errMsg string) {
	s.mu.Lock()
	if t, ok := s.tasks[taskID]; ok {
		if t.State == "cancelled" && state != "cancelled" {
			s.mu.Unlock()
			return
		}
		t.State = state
		t.Result = result
		t.Error = errMsg
		t.EndedAt = time.Now()
	}
	s.persistTasksLocked()
	s.mu.Unlock()
}

// failTask marks a task as failed and notifies L.I.F.E.
func (s *CoreServiceServer) failTask(taskID, errMsg string) {
	s.finishTask(taskID, "failed", "", errMsg)
	s.notifyLifeTaskCompleted(taskID, pluginv1.TaskState_TASK_STATE_FAILED, "", errMsg)
}

// notifyLifeTaskCompleted calls LifeService.OnTaskCompleted on the registered L.I.F.E plugin.
func (s *CoreServiceServer) notifyLifeTaskCompleted(taskID string, state pluginv1.TaskState, result, errMsg string) {
	s.callbackMu.Lock()
	if s.callbacks == nil {
		s.callbacks = map[string]taskCallback{}
	}
	s.callbacks[taskID] = taskCallback{TaskID: taskID, State: state, Result: result, Error: errMsg}
	s.saveCallbacksLocked()
	s.callbackMu.Unlock()
	s.deliverTaskCallback(taskID, state, result, errMsg)
}

func (s *CoreServiceServer) deliverTaskCallback(taskID string, state pluginv1.TaskState, result, errMsg string) {
	lifes := s.registry.GetPluginsByCapability("life")
	if len(lifes) == 0 {
		log.Printf("[TaskCompleted] No L.I.F.E plugin registered, skipping notification for task %s", taskID)
		return
	}

	life := lifes[0]
	if life.Address == "" {
		log.Printf("[TaskCompleted] L.I.F.E has no address, skipping")
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	conn, err := grpc.NewClient(life.Address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Printf("[TaskCompleted] Failed to connect to L.I.F.E at %s: %v", life.Address, err)
		return
	}
	defer conn.Close()

	client := lifev1.NewLifeServiceClient(conn)

	resp, err := client.OnTaskCompleted(ctx, &lifev1.OnTaskCompletedRequest{
		TaskId: taskID,
		State:  state,
		Result: result,
		Error:  errMsg,
	})
	if err != nil {
		log.Printf("[TaskCompleted] Failed to notify L.I.F.E for task %s: %v", taskID, err)
		return
	}

	log.Printf("[TaskCompleted] L.I.F.E acknowledged task %s: %s", taskID, resp.ResponseText)
	if resp.Acknowledged {
		s.callbackMu.Lock()
		delete(s.callbacks, taskID)
		s.saveCallbacksLocked()
		s.callbackMu.Unlock()
	}
}

// CancelAgent cancels a running Agent task.
func (s *CoreServiceServer) CancelAgent(ctx context.Context, req *corev1.CancelAgentRequest) (*corev1.CancelAgentResponse, error) {
	if req.TaskId == "" {
		return nil, status.Error(codes.InvalidArgument, "task_id is required")
	}

	s.mu.Lock()
	task, ok := s.tasks[req.TaskId]
	if !ok {
		s.mu.Unlock()
		return &corev1.CancelAgentResponse{
			Success: false,
			Message: fmt.Sprintf("task %s not found", req.TaskId),
		}, nil
	}
	agentID := task.AgentID
	if task.State != "running" && task.State != "pending" {
		s.mu.Unlock()
		return &corev1.CancelAgentResponse{Success: false, Message: "task is already terminal"}, nil
	}
	s.mu.Unlock()

	// Find agent and call CancelTask
	agents := s.registry.GetAgents(false)
	cancelled := false
	for _, a := range agents {
		if a.PluginID == agentID && a.Address != "" {
			conn, err := grpc.NewClient(a.Address, grpc.WithTransportCredentials(insecure.NewCredentials()))
			if err != nil {
				continue
			}
			agentClient := agentv1.NewAgentServiceClient(conn)
			response, callErr := agentClient.CancelTask(pairing.CallbackContext(ctx, a.Address), &agentv1.CancelTaskRequest{TaskId: req.TaskId})
			conn.Close()
			if callErr != nil {
				return nil, callErr
			}
			cancelled = response.Success
			break
		}
	}

	if !cancelled {
		return &corev1.CancelAgentResponse{Success: false, Message: "agent did not cancel the task"}, nil
	}
	s.mu.Lock()
	if t, ok := s.tasks[req.TaskId]; ok {
		t.State = "cancelled"
		t.EndedAt = time.Now()
	}
	s.persistTasksLocked()
	s.mu.Unlock()

	return &corev1.CancelAgentResponse{
		Success: true,
		Message: "task cancelled",
	}, nil
}

// GetTask returns task info (internal helper).
func (s *CoreServiceServer) GetTask(taskID string) (*TaskInfo, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	task, ok := s.tasks[taskID]
	return task, ok
}

// ListTasks returns JSON-friendly task state-machine entries for the gateway.
func (s *CoreServiceServer) ListTasks() []map[string]interface{} {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]map[string]interface{}, 0, len(s.tasks))
	for _, t := range s.tasks {
		if session := s.tasks[t.SessionID]; session != nil && session.Kind == "agent_session" && session.State == "deleted" {
			continue
		}
		state := t.State
		if state == "" {
			state = "running"
		}
		item := map[string]interface{}{
			"task_id":    t.TaskID,
			"caller_id":  t.CallerID,
			"prompt":     t.Prompt,
			"agent_id":   t.AgentID,
			"state":      state,
			"started_at": t.StartedAt.Format("2006-01-02T15:04:05.000000000Z07:00"),
			"session_id": t.SessionID,
			"kind":       t.Kind,
			"parent_id":  t.ParentID,
		}
		if !t.EndedAt.IsZero() {
			item["ended_at"] = t.EndedAt.Format(time.RFC3339)
		}
		if t.Args != "" {
			item["args"] = t.Args
		}
		if t.Result != "" {
			item["result"] = t.Result
		}
		if t.Error != "" {
			item["error"] = t.Error
		}
		out = append(out, item)
	}
	sort.Slice(out, func(i, j int) bool {
		a, b := out[i]["started_at"].(string), out[j]["started_at"].(string)
		if a == b {
			return out[i]["task_id"].(string) < out[j]["task_id"].(string)
		}
		return a > b
	})
	return out
}

// RemoveTask removes a task (internal helper).
func (s *CoreServiceServer) RemoveTask(taskID string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.tasks, taskID)
}
