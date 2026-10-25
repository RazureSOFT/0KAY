package server

import (
	"context"
	"encoding/json"
	"fmt"
	"hash/fnv"
	"io"
	"log"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"sync"
	"time"
	"unicode"
	"unicode/utf8"

	"0kay/core/internal/atomicio"
	"0kay/core/internal/egress"
	"0kay/core/internal/messaging"
	"0kay/core/internal/pairing"
	"0kay/core/internal/registry"
	agentv1 "0kay/gen/agent/v1"
	corev1 "0kay/gen/core/v1"
	lifev1 "0kay/gen/life/v1"
	mocrv1 "0kay/gen/mocr/v1"
	pluginv1 "0kay/gen/plugin/v1"
	"0kay/obs"

	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/keepalive"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

var svcLog = obs.Component("grpc")

type CoreServiceServer struct {
	corev1.UnimplementedCoreServiceServer
	registry *registry.Registry

	busOnce sync.Once
	bus     *messaging.Bus

	mu               sync.RWMutex
	tasks            map[string]*TaskInfo
	completed        []string
	taskHistoryPath  string
	callbackMu       sync.Mutex
	callbacks        map[string]taskCallback
	taskFingerprints map[string]uint64
	taskRevision     uint64
	taskChanges      map[string]uint64
	taskRemoved      map[string]uint64
	taskDirty        map[string]struct{}
	lastJournalSync  time.Time

	sessionLog      *SessionLog
	sessionMu       sync.RWMutex
	sessions        map[string][]*corev1.ChatMessage
	sessionActivity map[string]time.Time

	usageMu sync.Mutex
	usage   *UsageStore

	mocrAddr string

	mocrOnce sync.Once
	mocrConn *grpc.ClientConn
	mocrErr  error

	connMu    sync.Mutex
	connPool  map[string]*grpc.ClientConn
	lifeConns map[string]*grpc.ClientConn

	dispatchMu       sync.Mutex
	dispatchActivity map[string]time.Time
	dispatchLastSeen map[string]time.Time

	permMu      sync.RWMutex
	permissions Permissions

	providerStore ProviderStore
}

type ProviderStore interface {
	ResolveModel(modelID string) (provider, baseURL, apiKey, resolved string, ok bool)
}

type Permissions struct {
	ScreenWatch     bool   `json:"screen_watch"`
	ComputerUse     bool   `json:"computer_use"`
	ReportAgentHost string `json:"report_agent_host"`
}

type TaskInfo struct {
	TaskID      string
	CallerID    string
	Prompt      string
	AgentID     string
	State       string
	Result      string
	Error       string
	StartedAt   time.Time
	EndedAt     time.Time
	SessionID   string
	Kind        string
	ParentID    string
	Args        string
	Reasoning   string
	Attachments string
}

type persistedTask struct {
	TaskID      string    `json:"task_id"`
	CallerID    string    `json:"caller_id"`
	Prompt      string    `json:"prompt"`
	AgentID     string    `json:"agent_id"`
	State       string    `json:"state"`
	Result      string    `json:"result,omitempty"`
	Error       string    `json:"error,omitempty"`
	StartedAt   time.Time `json:"started_at"`
	EndedAt     time.Time `json:"ended_at,omitempty"`
	SessionID   string    `json:"session_id,omitempty"`
	Kind        string    `json:"kind,omitempty"`
	ParentID    string    `json:"parent_id,omitempty"`
	Args        string    `json:"args,omitempty"`
	Reasoning   string    `json:"reasoning,omitempty"`
	Attachments string    `json:"attachments,omitempty"`
}

type UsageRecord struct {
	Timestamp        time.Time `json:"timestamp"`
	RequestID        string    `json:"request_id"`
	SessionID        string    `json:"session_id"`
	Model            string    `json:"model"`
	PromptTokens     int32     `json:"prompt_tokens"`
	CompletionTokens int32     `json:"completion_tokens"`
	TotalTokens      int32     `json:"total_tokens"`
	CachedTokens     int32     `json:"cached_tokens,omitempty"`
	CostUSD          float64   `json:"cost_usd,omitempty"`
}

type UsageStore struct {
	records  []UsageRecord
	file     string
	lastSave time.Time
	unsaved  int
	indexed  map[string]struct{}
}

const maxUsageRecords = 10000

func NewUsageStore(path string) *UsageStore {
	u := &UsageStore{file: path, records: nil, indexed: map[string]struct{}{}}
	if path != "" {
		if data, err := os.ReadFile(path); err == nil {
			if err := json.Unmarshal(data, &u.records); err != nil {
				// A truncated or corrupt ledger still loads whatever parsed;
				// silently pretending it was fine hides the data loss.
				log.Printf("usage store %s: ignoring corrupt payload: %v", path, err)
			}
		}
	}
	for _, rec := range u.records {
		if rec.RequestID != "" {
			u.indexed[rec.RequestID] = struct{}{}
		}
	}
	return u
}

func (u *UsageStore) AddIfNew(rec UsageRecord) bool {
	if rec.RequestID != "" {
		// a retried ingest carries the same request id. count it twice and every
		// number on that usage page is a fucking lie.
		if u.indexed == nil {
			u.indexed = map[string]struct{}{}
		}
		if _, seen := u.indexed[rec.RequestID]; seen {
			return false
		}
		u.indexed[rec.RequestID] = struct{}{}
	}
	u.Add(rec)
	return true
}

func (u *UsageStore) Add(rec UsageRecord) {
	if len(u.records) >= maxUsageRecords {
		trim := len(u.records) - (maxUsageRecords - 1)
		for _, old := range u.records[:trim] {
			if old.RequestID != "" && u.indexed != nil {
				delete(u.indexed, old.RequestID)
			}
		}
		u.records = u.records[trim:]
	}
	u.records = append(u.records, rec)
	u.unsaved++
	if u.file == "" {
		return
	}
	if u.unsaved < 50 && time.Since(u.lastSave) < 3*time.Second {
		return
	}
	u.saveLocked()
}

func (u *UsageStore) saveLocked() {
	data, err := json.Marshal(u.records)
	if err != nil {
		return
	}
	_ = os.MkdirAll(filepath.Dir(u.file), 0o755)
	if err := atomicio.WriteFileAtomic(u.file, data, 0o644); err != nil {
		return
	}
	u.lastSave = time.Now()
	u.unsaved = 0
}

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
	var totalCached int32
	var totalCost float64
	sessions := map[string]struct{}{}

	for _, r := range u.records {
		totalPrompt += r.PromptTokens
		totalCompletion += r.CompletionTokens
		total += r.TotalTokens
		totalCached += r.CachedTokens
		totalCost += r.CostUSD
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

	var hitRatio float64
	if totalPrompt > 0 {
		hitRatio = float64(totalCached) / float64(totalPrompt)
	}

	return map[string]interface{}{
		"total_prompt_tokens":     totalPrompt,
		"total_completion_tokens": totalCompletion,
		"total_tokens":            total,
		"total_cached_tokens":     totalCached,
		"cache_hit_ratio":         hitRatio,
		"total_cost_usd":          totalCost,
		"request_count":           len(u.records),
		"session_count":           len(sessions),
		"by_model":                byModel,
		"by_day":                  byDay,
		"recent":                  lastN(u.records, 20),
	}
}

func (u *UsageStore) Clear() {
	u.records = nil
	u.unsaved = 0
	u.lastSave = time.Time{}
	u.indexed = map[string]struct{}{}
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

func NewCoreServiceServer(reg *registry.Registry, dataDir ...string) *CoreServiceServer {
	mocrAddr := os.Getenv("MOCR_ADDRESS")
	if mocrAddr == "" {
		mocrAddr = "localhost:50052"
	}
	root := "data"
	if len(dataDir) > 0 && dataDir[0] != "" {
		root = dataDir[0]
	}
	usagePath := os.Getenv("USAGE_PATH")
	if usagePath == "" {
		usagePath = filepath.Join(root, "usage.json")
	}
	taskPath := os.Getenv("TASKS_PATH")
	if taskPath == "" {
		taskPath = filepath.Join(root, "tasks.json")
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
				tasks[item.TaskID].Reasoning = copy.Reasoning
				tasks[item.TaskID].Attachments = copy.Attachments
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
		sessionLog:       NewSessionLog(filepath.Join(root, "sessions")),
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
	instance.seedTaskFingerprints()
	instance.loadCallbacks()
	for _, task := range tasks {
		if task.Kind == "agent" && task.State == "failed" && task.Error == "Core restarted before execution was acknowledged" {
			instance.callbacks[task.TaskID] = taskCallback{TaskID: task.TaskID, State: pluginv1.TaskState_TASK_STATE_FAILED, Error: task.Error}
		}
	}
	instance.saveCallbacksLocked()
	go instance.retryCallbacks()
	for _, task := range tasks {
		if (task.Kind == "agent" || task.Kind == "") && !strings.HasPrefix(task.SessionID, "agent-session:") {
			task.SessionID = instance.EnsureAgentSession(task.SessionID, task.CallerID, task.Prompt)
			task.Kind = "agent"
			instance.mu.Lock()
			instance.markTaskDirtyLocked(task.TaskID)
			instance.mu.Unlock()
		}
	}
	return instance
}

const journalSyncInterval = 500 * time.Millisecond

func isTerminalTaskState(state string) bool {
	return state == "done" || state == "failed" || state == "cancelled"
}

func (s *CoreServiceServer) shouldSyncJournalLocked(changes []persistedTask, removed []string) bool {
	if len(removed) > 0 {
		return true
	}
	for _, item := range changes {
		if isTerminalTaskState(item.State) {
			return true
		}
		if item.Kind == "agent_session" && (item.State == "deleted" || item.State == "archived") {
			return true
		}
	}
	return time.Since(s.lastJournalSync) >= journalSyncInterval
}

const (
	persistedPromptLimit      = 8000
	persistedResultLimit      = 16000
	persistedErrorLimit       = 4000
	persistedArgsLimit        = 8000
	persistedReasoningLimit   = 8000
	persistedSessionLimit     = 2000
	persistedAttachmentsLimit = 8000
	persistedNonSessionLimit  = 5000
)

func persistedFrom(t *TaskInfo) persistedTask {
	return persistedTask{
		TaskID:      t.TaskID,
		CallerID:    t.CallerID,
		Prompt:      clipField(t.Prompt, persistedPromptLimit),
		AgentID:     t.AgentID,
		State:       t.State,
		Result:      clipField(t.Result, persistedResultLimit),
		Error:       clipField(t.Error, persistedErrorLimit),
		StartedAt:   t.StartedAt,
		EndedAt:     t.EndedAt,
		SessionID:   t.SessionID,
		Kind:        t.Kind,
		ParentID:    t.ParentID,
		Args:        clipField(t.Args, persistedArgsLimit),
		Reasoning:   clipField(t.Reasoning, persistedReasoningLimit),
		Attachments: clipField(t.Attachments, persistedAttachmentsLimit),
	}
}

func snapshotTasks(items []persistedTask) []persistedTask {
	sessions := make([]persistedTask, 0, len(items))
	others := make([]persistedTask, 0, len(items))
	for _, item := range items {
		if item.Kind == "agent_session" {
			sessions = append(sessions, item)
		} else {
			others = append(others, item)
		}
	}
	byNewest := func(list []persistedTask) {
		sort.Slice(list, func(i, j int) bool {
			if list[i].StartedAt.Equal(list[j].StartedAt) {
				return list[i].TaskID < list[j].TaskID
			}
			return list[i].StartedAt.After(list[j].StartedAt)
		})
	}
	byNewest(sessions)
	byNewest(others)
	if len(sessions) > persistedSessionLimit {
		sessions = sessions[:persistedSessionLimit]
	}
	if len(others) > persistedNonSessionLimit {
		others = others[:persistedNonSessionLimit]
	}
	return append(sessions, others...)
}

func (s *CoreServiceServer) pruneFinishedLocked() {
	finished := make([]*TaskInfo, 0, len(s.tasks))
	for _, t := range s.tasks {
		if t.Kind == "agent_session" || t.State == "" || t.State == "running" || t.State == "pending" {
			continue
		}
		finished = append(finished, t)
	}
	if len(finished) > persistedNonSessionLimit {
		sortTasksNewest(finished)
		for _, t := range finished[persistedNonSessionLimit:] {
			delete(s.tasks, t.TaskID)
			s.markTaskDirtyLocked(t.TaskID)
		}
	}
	s.pruneSessionsLocked()
}

func (s *CoreServiceServer) pruneSessionsLocked() {
	total := 0
	candidates := []*TaskInfo{}
	for _, t := range s.tasks {
		if t.Kind != "agent_session" {
			continue
		}
		total++
		if t.State == "deleted" || t.State == "archived" {
			candidates = append(candidates, t)
		}
	}
	if total <= persistedSessionLimit {
		return
	}
	sort.Slice(candidates, func(i, j int) bool {
		deleting := candidates[i].State == "deleted"
		if deleting != (candidates[j].State == "deleted") {
			return deleting
		}
		return candidates[i].StartedAt.Before(candidates[j].StartedAt)
	})
	for _, t := range candidates {
		if total <= persistedSessionLimit {
			break
		}
		delete(s.tasks, t.TaskID)
		s.markTaskDirtyLocked(t.TaskID)
		total--
	}
}

func (s *CoreServiceServer) markTaskDirtyLocked(id string) {
	if s.taskDirty == nil {
		s.taskDirty = map[string]struct{}{}
	}
	s.taskDirty[id] = struct{}{}
}

func taskFingerprint(raw []byte) uint64 {
	hasher := fnv.New64a()
	hasher.Write(raw)
	return hasher.Sum64()
}

func (s *CoreServiceServer) seedTaskFingerprints() {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.taskFingerprints = make(map[string]uint64, len(s.tasks))
	for id, t := range s.tasks {
		raw, _ := json.Marshal(persistedFrom(t))
		s.taskFingerprints[id] = taskFingerprint(raw)
	}
}

func (s *CoreServiceServer) persistTasksLocked() {
	s.pruneFinishedLocked()
	if len(s.taskDirty) == 0 {
		return
	}
	if s.taskFingerprints == nil {
		s.taskFingerprints = map[string]uint64{}
	}
	changes := []persistedTask{}
	removed := []string{}
	fingerprints := make(map[string]uint64, len(s.taskDirty))
	for id := range s.taskDirty {
		task := s.tasks[id]
		if task == nil {
			if _, tracked := s.taskFingerprints[id]; tracked {
				removed = append(removed, id)
			}
			continue
		}
		item := persistedFrom(task)
		raw, _ := json.Marshal(item)
		fingerprint := taskFingerprint(raw)
		fingerprints[id] = fingerprint
		if s.taskFingerprints[id] != fingerprint {
			changes = append(changes, item)
			if item.Kind == "agent_session" && item.State == "deleted" {
				removed = append(removed, id)
			}
		}
	}
	if len(changes) > 0 || len(removed) > 0 {
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
		if len(s.taskRemoved) > resetTaskLimit {
			cutoff := uint64(0)
			if s.taskRevision > resetTaskLimit {
				cutoff = s.taskRevision - resetTaskLimit
			}
			for id, version := range s.taskRemoved {
				if version <= cutoff {
					delete(s.taskRemoved, id)
				}
			}
		}
		if s.taskHistoryPath != "" {
			s.appendTaskJournalLocked(changes, removed)
		}
	}
	for id, fingerprint := range fingerprints {
		s.taskFingerprints[id] = fingerprint
	}
	for id := range s.taskDirty {
		if s.tasks[id] == nil {
			delete(s.taskFingerprints, id)
		}
	}
	s.taskDirty = nil
}

func (s *CoreServiceServer) appendTaskJournalLocked(changes []persistedTask, removed []string) {
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
	if err == nil && s.shouldSyncJournalLocked(changes, removed) {
		err = journal.Sync()
		s.lastJournalSync = time.Now()
	}
	journal.Close()
	if err != nil {
		log.Printf("task journal write: %v", err)
		return
	}
	info, _ := os.Stat(s.taskHistoryPath + ".journal")
	_, snapshotErr := os.Stat(s.taskHistoryPath)
	if snapshotErr == nil && info != nil && info.Size() < 8<<20 {
		return
	}
	snapshotItems := make([]persistedTask, 0, len(s.tasks))
	for _, t := range s.tasks {
		snapshotItems = append(snapshotItems, persistedFrom(t))
	}
	snapshot := snapshotTasks(snapshotItems)
	if data, err := json.MarshalIndent(snapshot, "", "  "); err == nil {
		_ = os.MkdirAll(filepath.Dir(s.taskHistoryPath), 0o755)
		temporary := s.taskHistoryPath + ".tmp"
		if err := writeFileSync(temporary, data, 0o600); err == nil {
			if err = os.Rename(temporary, s.taskHistoryPath); err != nil {
				log.Printf("persist tasks: %v", err)
			} else {
				syncDir(filepath.Dir(s.taskHistoryPath))
				_ = os.WriteFile(s.taskHistoryPath+".journal", nil, 0600)
				s.lastJournalSync = time.Now()
			}
		} else {
			log.Printf("persist tasks: %v", err)
		}
	}
}

func writeFileSync(path string, data []byte, perm os.FileMode) error {
	file, err := os.OpenFile(path, os.O_CREATE|os.O_TRUNC|os.O_WRONLY, perm)
	if err != nil {
		return err
	}
	if _, err = file.Write(data); err == nil {
		err = file.Sync()
	}
	if closeErr := file.Close(); err == nil {
		err = closeErr
	}
	return err
}

func syncDir(path string) {
	dir, err := os.Open(path)
	if err != nil {
		return
	}
	_ = dir.Sync()
	_ = dir.Close()
}

func (s *CoreServiceServer) SetProviderStore(st ProviderStore) {
	s.providerStore = st
}

func (s *CoreServiceServer) GetUsage() map[string]interface{} {
	s.usageMu.Lock()
	defer s.usageMu.Unlock()
	return s.usage.Snapshot()
}

func (s *CoreServiceServer) ClearUsage() {
	s.usageMu.Lock()
	defer s.usageMu.Unlock()
	s.usage.Clear()
}

func (s *CoreServiceServer) RecordUsage(record UsageRecord) {
	s.usageMu.Lock()
	defer s.usageMu.Unlock()
	s.usage.AddIfNew(record)
}

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

func (s *CoreServiceServer) GetPermissions() Permissions {
	s.permMu.RLock()
	defer s.permMu.RUnlock()
	return s.permissions
}

func (s *CoreServiceServer) SetPermissions(p Permissions) {
	s.permMu.Lock()
	s.permissions = p
	s.permMu.Unlock()
}

func (s *CoreServiceServer) SessionMessages(sessionID string) []*corev1.ChatMessage {
	if sessionID == "" {
		return nil
	}
	s.sessionMu.RLock()
	cached := s.sessions[sessionID]
	s.sessionMu.RUnlock()
	if len(cached) > 0 {
		return append([]*corev1.ChatMessage{}, cached...)
	}
	// Cold session (a restart, or an evicted one): rebuild from the log so the
	// conversation survives a deploy instead of starting over.
	restored := s.sessionLog.Read(sessionID, 200)
	if len(restored) == 0 {
		return nil
	}
	s.sessionMu.Lock()
	if len(s.sessions[sessionID]) == 0 {
		s.sessions[sessionID] = restored
	}
	value := append([]*corev1.ChatMessage{}, s.sessions[sessionID]...)
	s.sessionMu.Unlock()
	return value
}

const maxChatSessions = 500

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
	if s.sessionActivity == nil {
		s.sessionActivity = map[string]time.Time{}
	}
	s.sessionActivity[sessionID] = time.Now()
	s.evictIdleSessionsLocked()
	// Persist after the in-memory append: the map is the hot path, the log is
	// the record. A write failure costs history, not the reply.
	_ = s.sessionLog.Append(sessionID, msgs...)
}

// SessionEvents exposes the append-only log for replay and audit. The map shape
// keeps the gateway from importing this package just for a struct.
func (s *CoreServiceServer) SessionEvents(sessionID string, after int) []map[string]interface{} {
	events := s.sessionLog.Events(sessionID, after)
	out := make([]map[string]interface{}, 0, len(events))
	for _, event := range events {
		out = append(out, map[string]interface{}{
			"seq":     event.Seq,
			"at":      event.At,
			"kind":    event.Kind,
			"role":    event.Role,
			"message": json.RawMessage(event.Message),
		})
	}
	return out
}

func (s *CoreServiceServer) evictIdleSessionsLocked() {
	for len(s.sessions) > maxChatSessions {
		oldest, oldestAt := "", time.Time{}
		for id, at := range s.sessionActivity {
			if oldest == "" || at.Before(oldestAt) {
				oldest, oldestAt = id, at
			}
		}
		if oldest == "" {
			return
		}
		delete(s.sessions, oldest)
		delete(s.sessionActivity, oldest)
	}
}

func estimateTokens(text string) int32 {
	n := len(text)
	if n == 0 {
		return 0
	}
	return int32((n + 3) / 4)
}

func (s *CoreServiceServer) mocrClient() (mocrv1.MocrServiceClient, error) {
	s.mocrOnce.Do(func() {
		s.mocrConn, s.mocrErr = grpc.NewClient(s.mocrAddr, grpc.WithTransportCredentials(insecure.NewCredentials()), grpc.WithPerRPCCredentials(registry.NewServiceTokenCredentials(modelServiceToken())))
	})
	if s.mocrErr != nil {
		return nil, s.mocrErr
	}
	return mocrv1.NewMocrServiceClient(s.mocrConn), nil
}

func (s *CoreServiceServer) dialMocr(ctx context.Context) (mocrv1.MocrServiceClient, func(), error) {
	client, err := s.mocrClient()
	if err != nil {
		return nil, nil, err
	}
	return client, func() {}, nil
}

func (s *CoreServiceServer) dialCached(addr string) (*grpc.ClientConn, error) {
	if s.registry != nil {
		for _, plugin := range s.registry.GetPluginsByCapability("agent") {
			if plugin.Address == addr {
				return s.lifeDialCached(plugin)
			}
		}
	}
	s.connMu.Lock()
	defer s.connMu.Unlock()
	if s.connPool == nil {
		s.connPool = map[string]*grpc.ClientConn{}
	}
	if conn, ok := s.connPool[addr]; ok {
		return conn, nil
	}
	conn, err := grpc.NewClient(addr, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, err
	}
	s.connPool[addr] = conn
	return conn, nil
}

func (s *CoreServiceServer) lifeDialCached(life *registry.PluginInstance) (*grpc.ClientConn, error) {
	if life == nil || life.Address == "" {
		return nil, status.Error(codes.Unavailable, "LIFE has no address")
	}
	key := life.Address + "\x00" + life.PluginID
	s.connMu.Lock()
	defer s.connMu.Unlock()
	if s.lifeConns == nil {
		s.lifeConns = map[string]*grpc.ClientConn{}
	}
	if conn, ok := s.lifeConns[key]; ok {
		return conn, nil
	}
	conn, err := grpc.NewClient(
		life.Address,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
		grpc.WithPerRPCCredentials(registry.NewServiceTokenCredentials(s.registry.Token(life.PluginID))),
	)
	if err != nil {
		return nil, err
	}
	s.lifeConns[key] = conn
	return conn, nil
}

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

	var history []*corev1.ChatMessage
	if len(req.Messages) > 0 {
		history = req.Messages
	} else {
		history = s.SessionMessages(sessionID)
	}

	if req.Prompt != "" {
		lastIsUser := len(history) > 0 && history[len(history)-1].Role == "user" && history[len(history)-1].Content == req.Prompt
		if !lastIsUser {
			history = append(append([]*corev1.ChatMessage{}, history...), &corev1.ChatMessage{
				Role:    "user",
				Content: req.Prompt,
			})
		}
	}

	history = s.maybeCompressFrom(sessionID, history, 8000)

	if req.SystemPrompt != "" {
		history = append([]*corev1.ChatMessage{{Role: "system", Content: req.SystemPrompt}}, history...)
	}

	ctx, cancel := context.WithTimeout(stream.Context(), 120*time.Second)
	defer cancel()

	client, closeFn, err := s.dialMocr(ctx)
	if err != nil {
		log.Printf("[CallMocr] dial mocr failed: %v", err)
		return s.failStream(req, stream, "mocr unavailable: "+err.Error())
	}
	defer closeFn()

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

	mocrMsgs := make([]*mocrv1.Message, 0, len(history))
	for _, m := range history {
		mocrMsgs = append(mocrMsgs, &mocrv1.Message{Role: m.Role, Content: m.Content})
	}

	genReq := &mocrv1.GenerateRequest{
		ModelId:  modelID,
		Messages: mocrMsgs,
		Stream:   true,
		Provider: prov,
		BaseUrl:  baseURL,
		ApiKey:   apiKey,
	}
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
		return s.failStream(req, stream, "generation failed to start: "+err.Error())
	}

	var full strings.Builder
	for {
		resp, err := genStream.Recv()
		if err == io.EOF {
			log.Printf("[CallMocr] stream ended without a terminal frame")
			return s.failStream(req, stream, "generation stream ended without a completion frame")
		}
		if err != nil {
			log.Printf("[CallMocr] stream recv: %v", err)
			return s.failStream(req, stream, "generation failed: "+err.Error())
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
		if s.sessionActivity == nil {
			s.sessionActivity = map[string]time.Time{}
		}
		s.sessionActivity[sessionID] = time.Now()
		s.evictIdleSessionsLocked()
		s.sessionMu.Unlock()
	}
	return compressed
}

func (s *CoreServiceServer) failStream(req *corev1.CallMocrRequest, stream corev1.CoreService_CallMocrServer, reason string) error {
	_ = stream.Send(&corev1.CallMocrResponse{
		RequestId: req.RequestId,
		Error:     reason,
		Done:      true,
	})
	return status.Error(codes.Unavailable, reason)
}

func truncateRunes(s string, n int) string {
	r := []rune(s)
	if len(r) <= n {
		return s
	}
	return string(r[:n]) + "…"
}

func foldIndexRunes(content, query string) int {
	if query == "" {
		return -1
	}
	contentRunes := []rune(content)
	queryRunes := []rune(query)
	for i := 0; i+len(queryRunes) <= len(contentRunes); i++ {
		match := true
		for j, qr := range queryRunes {
			if unicode.ToLower(contentRunes[i+j]) != qr {
				match = false
				break
			}
		}
		if match {
			return i
		}
	}
	return -1
}

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

func (s *CoreServiceServer) RunDirect(ctx context.Context, req *corev1.RunDirectRequest) (response *corev1.RunDirectResponse, callErr error) {
	id := fmt.Sprintf("direct-tool:%d", time.Now().UnixNano())
	// UI panels poll some tools every few seconds (recon graph, assessment
	// tasks). Those calls are plumbing, not history: journaling them buried
	// the session's real turns under a pile of poll rows.
	poll := req.Tool == "recon_graph" || req.Tool == "assessments"
	if !poll {
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
	}
	if req.Tool == "" {
		return nil, status.Error(codes.InvalidArgument, "tool is required")
	}

	perm := s.GetPermissions()
	if req.Tool == "computeruse" || req.Tool == "shell" || req.Tool == "terminal_exec" {
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

	// Try every healthy agent, not just the first one. A dead instance keeps its
	// "healthy" flag until the heartbeat expires (a minute, by default), and
	// returning on the first dial error means one crashed agent takes the whole
	// tool surface down with it.
	//
	// A tool that runs and fails is a result, not a transport error: that answer
	// comes back to the caller and the loop stops there.
	var lastErr error
	for _, agent := range agents {
		if agent.Address == "" {
			continue
		}
		conn, err := s.dialCached(agent.Address)
		if err != nil {
			lastErr = fmt.Errorf("connect %s: %w", agent.Address, err)
			continue
		}
		resp, err := agentv1.NewAgentServiceClient(conn).RunDirect(
			pairing.CallbackContext(ctx, agent.Address),
			&agentv1.RunDirectRequest{Tool: req.Tool, Args: req.Args, SessionId: req.SessionId},
		)
		if err != nil {
			lastErr = fmt.Errorf("agent %s: %w", agent.Address, err)
			continue
		}
		return &corev1.RunDirectResponse{Success: resp.Success, Result: resp.Result, Error: resp.Error}, nil
	}
	return nil, status.Errorf(codes.Unavailable, "every agent failed: %v", lastErr)
}

func (s *CoreServiceServer) Egress(ctx context.Context, req *corev1.EgressRequest) (*corev1.EgressResponse, error) {
	info, ok := s.registry.FindByName(req.PluginId)
	if !ok {
		info, ok = s.registry.FindByID(req.PluginId)
	}
	if !ok {
		return nil, status.Error(codes.Unauthenticated, "unknown plugin identity")
	}
	md, _ := metadata.FromIncomingContext(ctx)
	var token string
	for _, value := range md.Get("authorization") {
		if len(value) > 7 && strings.EqualFold(value[:7], "Bearer ") {
			token = strings.TrimSpace(value[7:])
			break
		}
	}
	if info.Info == nil {
		return nil, status.Error(codes.Unauthenticated, "valid plugin identity required")
	}
	authenticated, valid := s.registry.Authenticate(info.Info.Name, token)
	if !valid || authenticated.PluginID != info.PluginID {
		return nil, status.Error(codes.Unauthenticated, "valid plugin service token required")
	}
	allowlist := []string{"*"}
	if info.Info == nil || !s.registry.IsTrusted(info.Info.Name) {
		allowlist = nil
		if info.Info != nil && info.Info.Permissions != nil {
			allowlist = info.Info.Permissions.Egress
		}
	}
	resp, err := egress.Do(ctx, egress.Request{
		Method:  req.Method,
		URL:     req.Url,
		Headers: req.Headers,
		Body:    req.Body,
		Timeout: time.Duration(req.TimeoutMs) * time.Millisecond,
	}, allowlist)
	if err != nil {
		return &corev1.EgressResponse{Error: err.Error()}, nil
	}
	return &corev1.EgressResponse{
		Status:  int32(resp.Status),
		Headers: resp.Headers,
		Body:    resp.Body,
	}, nil
}

func (s *CoreServiceServer) ListPluginTools(ctx context.Context, req *corev1.ListPluginToolsRequest) (*corev1.ListPluginToolsResponse, error) {
	tools := s.registry.ListTools(strings.TrimSpace(req.Scope))
	out := make([]*corev1.PluginToolEntry, 0, len(tools))
	for _, t := range tools {
		out = append(out, &corev1.PluginToolEntry{Plugin: t.Plugin, Tool: t.Tool})
	}
	return &corev1.ListPluginToolsResponse{Tools: out}, nil
}

func (s *CoreServiceServer) callContextTool(req *corev1.CallPluginToolRequest) *corev1.CallPluginToolResponse {
	var args map[string]any
	_ = json.Unmarshal([]byte(req.ArgsJson), &args)
	sessionID := strings.TrimSpace(req.SessionId)
	switch req.Tool {
	case "session_context_search":
		query := strings.ToLower(strings.TrimSpace(fmt.Sprint(args["query"])))
		if sessionID == "" || query == "" {
			return &corev1.CallPluginToolResponse{Error: "session and query are required"}
		}
		payload, _ := json.Marshal(map[string]any{"matches": s.searchSessionContext(sessionID, query)})
		return &corev1.CallPluginToolResponse{Success: true, Result: string(payload)}
	case "session_context_decompress":
		id := strings.TrimSpace(fmt.Sprint(args["id"]))
		content, err := s.decompressSessionContext(sessionID, id)
		if err != nil {
			return &corev1.CallPluginToolResponse{Error: err.Error()}
		}
		payload, _ := json.Marshal(map[string]any{"id": id, "content": content})
		return &corev1.CallPluginToolResponse{Success: true, Result: string(payload)}
	}
	return &corev1.CallPluginToolResponse{Error: "unknown context tool " + req.Tool}
}

func (s *CoreServiceServer) searchSessionContext(sessionID, query string) []map[string]any {
	const snippet = 240
	out := []map[string]any{}
	for _, task := range s.ListTasks() {
		if task["session_id"] != sessionID {
			continue
		}
		kind, _ := task["kind"].(string)
		if kind != "agent" && kind != "compact" {
			continue
		}
		content := fmt.Sprint(task["prompt"]) + "\n" + fmt.Sprint(task["result"])
		runes := []rune(content)
		index := foldIndexRunes(content, query)
		if index < 0 {
			continue
		}
		start := index - snippet/2
		if start < 0 {
			start = 0
		}
		end := start + snippet
		if end > len(runes) {
			end = len(runes)
		}
		out = append(out, map[string]any{
			"id":      task["task_id"],
			"kind":    kind,
			"state":   task["state"],
			"snippet": string(runes[start:end]),
		})
		if len(out) >= 20 {
			break
		}
	}
	return out
}

func (s *CoreServiceServer) decompressSessionContext(sessionID, id string) (string, error) {
	if id == "" {
		return "", fmt.Errorf("id is required")
	}
	byID := map[string]map[string]any{}
	var target map[string]any
	for _, task := range s.ListTasks() {
		if task["session_id"] != sessionID {
			continue
		}
		tid, _ := task["task_id"].(string)
		byID[tid] = task
		if tid == id {
			target = task
		}
	}
	if target == nil {
		return "", fmt.Errorf("id %q not found in this session", id)
	}
	if kind, _ := target["kind"].(string); kind == "compact" {
		var meta struct {
			IDs []string `json:"ids"`
		}
		if raw, _ := target["args"].(string); raw != "" {
			_ = json.Unmarshal([]byte(raw), &meta)
		}
		var b strings.Builder
		for _, fid := range meta.IDs {
			if t := byID[fid]; t != nil {
				fmt.Fprintf(&b, "## %s\nuser: %v\nassistant: %v\n\n", fid, t["prompt"], t["result"])
			}
		}
		if b.Len() == 0 {
			return fmt.Sprint(target["result"]), nil
		}
		return b.String(), nil
	}
	return fmt.Sprintf("user: %v\nassistant: %v\n", target["prompt"], target["result"]), nil
}

func (s *CoreServiceServer) CallPluginTool(ctx context.Context, req *corev1.CallPluginToolRequest) (*corev1.CallPluginToolResponse, error) {
	if strings.TrimSpace(req.Tool) == "" {
		return &corev1.CallPluginToolResponse{Error: "tool is required"}, nil
	}
	info, _, ok := s.registry.ToolOwner(req.Tool)
	if !ok {
		return &corev1.CallPluginToolResponse{Error: "unknown tool " + req.Tool}, nil
	}
	if info.Info != nil && info.Info.GetName() == "context" {
		return s.callContextTool(req), nil
	}
	if info.Address == "" {
		return &corev1.CallPluginToolResponse{Error: "plugin " + info.Info.GetName() + " has no address"}, nil
	}
	conn, err := s.dialCached(info.Address)
	if err != nil {
		return nil, status.Errorf(codes.Unavailable, "connect plugin: %v", err)
	}
	client := pluginv1.NewToolServiceClient(conn)
	resp, err := client.CallTool(pairing.CallbackContext(ctx, info.Address), &pluginv1.CallToolRequest{
		CallerId:  req.CallerId,
		Tool:      req.Tool,
		ArgsJson:  req.ArgsJson,
		SessionId: req.SessionId,
	})
	if err != nil {
		return nil, status.Errorf(codes.Internal, "plugin tool: %v", err)
	}
	return &corev1.CallPluginToolResponse{Success: resp.Success, Result: resp.Result, Error: resp.Error}, nil
}

func (s *CoreServiceServer) UseAgent(ctx context.Context, req *corev1.UseAgentRequest) (*corev1.UseAgentResponse, error) {
	if req.TaskId == "" {
		return nil, status.Error(codes.InvalidArgument, "task_id is required")
	}
	if req.Prompt == "" {
		return nil, status.Error(codes.InvalidArgument, "prompt is required")
	}

	if req.Metadata == nil {
		req.Metadata = map[string]string{}
	}
	originSession := req.Metadata["session_id"]
	req.Metadata["origin_session_id"] = originSession
	sessionID, err := s.startAgentTask(TaskEvent{TaskID: req.TaskId, CallerID: req.CallerId, Prompt: req.Prompt, State: "pending", Kind: "agent", ParentID: req.Metadata["parent_id"], Attachments: req.Metadata["attachments"]}, originSession, req.CallerId, req.Prompt)
	req.Metadata["session_id"] = sessionID
	if err != nil {
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
	s.markTaskDirtyLocked(req.TaskId)
	s.persistTasksLocked()
	s.mu.Unlock()

	log.Printf("[UseAgent] Task %s dispatched to agent %s (addr=%s)",
		req.TaskId, agent.PluginID, agent.Address)

	go s.dispatchToAgent(req, agent)

	return &corev1.UseAgentResponse{
		Accepted: true,
		TaskId:   req.TaskId,
		Message:  "task accepted for processing",
	}, nil
}

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
		grpc.WithPerRPCCredentials(registry.NewServiceTokenCredentials(s.registry.Token(agent.PluginID))),
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
		s.markTaskDirtyLocked(taskID)
	}
	s.persistTasksLocked()
	s.mu.Unlock()
}

func (s *CoreServiceServer) failTask(taskID, errMsg string) {
	s.finishTask(taskID, "failed", "", errMsg)
	s.notifyLifeTaskCompleted(taskID, pluginv1.TaskState_TASK_STATE_FAILED, "", errMsg)
}

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

	conn, err := s.lifeDialCached(life)
	if err != nil {
		log.Printf("[TaskCompleted] Failed to connect to L.I.F.E at %s: %v", life.Address, err)
		return
	}

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

	agents := s.registry.GetAgents(false)
	cancelled := false
	for _, a := range agents {
		if a.PluginID == agentID && a.Address != "" {
			conn, err := s.dialCached(a.Address)
			if err != nil {
				continue
			}
			agentClient := agentv1.NewAgentServiceClient(conn)
			response, callErr := agentClient.CancelTask(pairing.CallbackContext(ctx, a.Address), &agentv1.CancelTaskRequest{TaskId: req.TaskId})
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
		s.markTaskDirtyLocked(req.TaskId)
	}
	s.persistTasksLocked()
	s.mu.Unlock()

	return &corev1.CancelAgentResponse{
		Success: true,
		Message: "task cancelled",
	}, nil
}

var taskBlobPattern = regexp.MustCompile(`("base64"\s*:\s*")[^"]{500,}(")`)

func redactTaskResult(raw string) string {
	const limit = 6_000
	if len(raw) <= limit {
		return raw
	}
	redacted := taskBlobPattern.ReplaceAllString(raw, `${1}[omitted]${2}`)
	if len(redacted) <= limit {
		return redacted
	}
	preview := redacted
	const previewCap = 2_500
	if len(preview) > previewCap {
		preview = preview[:previewCap]
		for len(preview) > 0 && !utf8.ValidString(preview) {
			preview = preview[:len(preview)-1]
		}
	}
	encoded, err := json.Marshal(map[string]any{"truncated": true, "bytes": len(raw), "preview": preview})
	if err != nil {
		return fmt.Sprintf(`{"truncated":true,"bytes":%d}`, len(raw))
	}
	return string(encoded)
}

const taskListLimit = 500

func limitTaskRows(rows []map[string]interface{}) []map[string]interface{} {
	kept := make([]map[string]interface{}, 0, len(rows))
	others := 0
	for _, row := range rows {
		if row["kind"] == "agent_session" {
			kept = append(kept, row)
			continue
		}
		if others < taskListLimit {
			kept = append(kept, row)
			others++
		}
	}
	sortTaskRows(kept)
	return kept
}

func (s *CoreServiceServer) taskRowLocked(t *TaskInfo) map[string]interface{} {
	state := t.State
	if state == "" {
		state = "running"
	}
	item := map[string]interface{}{
		"task_id":    t.TaskID,
		"caller_id":  t.CallerID,
		"prompt":     clipField(t.Prompt, 400),
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
		item["args"] = clipField(t.Args, 800)
	}
	if t.Result != "" {
		item["result"] = redactTaskResult(t.Result)
	}
	if t.Reasoning != "" {
		item["reasoning"] = clipField(t.Reasoning, 3000)
	}
	if t.Error != "" {
		item["error"] = clipField(t.Error, 1500)
	}
	if refs := decodeAttachments(t.Attachments); len(refs) > 0 {
		item["attachments"] = refs
	}
	return item
}

func decodeAttachments(raw string) []map[string]interface{} {
	raw = strings.TrimSpace(raw)
	if raw == "" || raw == "[]" {
		return nil
	}
	var rows []map[string]interface{}
	if json.Unmarshal([]byte(raw), &rows) != nil {
		return nil
	}
	out := make([]map[string]interface{}, 0, len(rows))
	for _, row := range rows {
		name, _ := row["name"].(string)
		url, _ := row["url"].(string)
		if name == "" && url == "" {
			continue
		}
		out = append(out, map[string]interface{}{
			"name": name,
			"url":  url,
			"mime": row["mime"],
			"size": row["size"],
		})
	}
	return out
}

func clipField(value string, max int) string {
	if len(value) <= max {
		return value
	}
	cut := max
	for cut > 0 && !utf8.RuneStart(value[cut]) {
		cut--
	}
	return value[:cut] + "…[truncated]"
}

func (s *CoreServiceServer) sessionDeletedLocked(t *TaskInfo) bool {
	session := s.tasks[t.SessionID]
	return session != nil && session.Kind == "agent_session" && session.State == "deleted"
}

func sortTaskRows(out []map[string]interface{}) {
	sort.Slice(out, func(i, j int) bool {
		a, _ := out[i]["started_at"].(string)
		b, _ := out[j]["started_at"].(string)
		if a == b {
			idA, _ := out[i]["task_id"].(string)
			idB, _ := out[j]["task_id"].(string)
			return idA < idB
		}
		return a > b
	})
}

func (s *CoreServiceServer) ListTasks() []map[string]interface{} {
	s.mu.RLock()
	defer s.mu.RUnlock()
	out := make([]map[string]interface{}, 0, len(s.tasks))
	for _, t := range s.tasks {
		if s.sessionDeletedLocked(t) {
			continue
		}
		out = append(out, s.taskRowLocked(t))
	}
	sortTaskRows(out)
	return limitTaskRows(out)
}
