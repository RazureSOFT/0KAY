package server

import (
	"fmt"
	"os"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"time"
)

type TaskEvent struct {
	TaskID      string `json:"task_id"`
	CallerID    string `json:"caller_id"`
	SessionID   string `json:"session_id"`
	ParentID    string `json:"parent_id"`
	Kind        string `json:"kind"`
	Prompt      string `json:"prompt"`
	Args        string `json:"args"`
	State       string `json:"state"`
	Result      string `json:"result"`
	Error       string `json:"error"`
	Reasoning   string `json:"reasoning,omitempty"`
	Attachments string `json:"attachments,omitempty"`
}

func (s *CoreServiceServer) RecordTask(event TaskEvent) error {
	if err := validateTaskEvent(event); err != nil {
		return err
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.recordTaskLocked(event)
}

func validateTaskEvent(event TaskEvent) error {
	if event.TaskID == "" {
		return fmt.Errorf("task_id required")
	}
	switch event.State {
	case "pending", "running", "done", "failed", "cancelled":
	default:
		return fmt.Errorf("invalid state")
	}
	return nil
}

func (s *CoreServiceServer) recordTaskLocked(event TaskEvent) error {
	task, exists := s.tasks[event.TaskID]
	if event.SessionID == "" && exists {
		event.SessionID = task.SessionID
	}
	if session := s.tasks[event.SessionID]; session != nil && session.Kind == "agent_session" && session.State == "deleted" {
		return fmt.Errorf("session deleted")
	}
	if exists {
		if isTerminalTaskState(task.State) {
			if task.State == event.State {
				return nil
			}
			return fmt.Errorf("task is already terminal")
		}
		if event.State == "pending" {
			return fmt.Errorf("task already exists")
		}
	} else if (event.Kind == "agent" || event.Kind == "compact") && strings.HasPrefix(event.SessionID, "agent-session:") {
		for _, existing := range s.tasks {
			if existing.SessionID == event.SessionID && (existing.Kind == "agent" || existing.Kind == "compact") && (existing.State == "running" || existing.State == "pending") {
				return fmt.Errorf("session already has an active task")
			}
		}
	}
	if !exists {
		task = &TaskInfo{TaskID: event.TaskID, CallerID: event.CallerID, SessionID: event.SessionID, ParentID: event.ParentID, Kind: event.Kind, Prompt: event.Prompt, Args: event.Args, Attachments: event.Attachments, StartedAt: time.Now()}
		for _, existing := range s.tasks {
			if !task.StartedAt.After(existing.StartedAt) {
				task.StartedAt = existing.StartedAt.Add(time.Nanosecond)
			}
		}
		s.tasks[event.TaskID] = task
	}
	task.State, task.Result, task.Error = event.State, event.Result, event.Error
	if event.Args != "" {
		task.Args = event.Args
	}
	if event.Reasoning != "" {
		task.Reasoning = event.Reasoning
	}
	if isTerminalTaskState(event.State) {
		task.EndedAt = time.Now()
	}
	s.markTaskDirtyLocked(event.TaskID)
	s.persistTasksLocked()
	if event.ParentID != "" {
		s.touchDispatch(event.ParentID)
	}
	s.touchDispatch(event.TaskID)
	return nil
}

func (s *CoreServiceServer) CreateAgentSession(title string) (string, error) {
	id := fmt.Sprintf("agent-session:%d", time.Now().UnixNano())
	if strings.TrimSpace(title) == "" {
		title = "Agent session"
	}
	return id, s.RecordTask(TaskEvent{TaskID: id, SessionID: id, Kind: "agent_session", Prompt: title, CallerID: "webui", State: "done"})
}

func (s *CoreServiceServer) RenameAgentSession(id, title string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	session := s.tasks[id]
	if session == nil || session.Kind != "agent_session" || session.State == "deleted" {
		return fmt.Errorf("session not found")
	}
	title = strings.TrimSpace(title)
	if title == "" {
		return fmt.Errorf("title required")
	}
	session.Prompt = truncateRunes(title, 80)
	s.markTaskDirtyLocked(id)
	s.persistTasksLocked()
	return nil
}

func (s *CoreServiceServer) HasAgentSession(id string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	task := s.tasks[id]
	return task != nil && task.Kind == "agent_session" && task.State == "done"
}

func (s *CoreServiceServer) ManageAgentSession(id, action string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	session := s.tasks[id]
	if session == nil || session.Kind != "agent_session" || session.State == "deleted" {
		return fmt.Errorf("session not found")
	}
	for _, task := range s.tasks {
		if task.SessionID == id && (task.Kind == "agent" || task.Kind == "compact") && (task.State == "running" || task.State == "pending") {
			return fmt.Errorf("stop the active task before changing this session")
		}
	}
	switch action {
	case "archive":
		session.State = "archived"
	case "restore":
		session.State = "done"
	case "delete":
		for key, task := range s.tasks {
			if task.SessionID == id && key != id {
				delete(s.tasks, key)
				s.markTaskDirtyLocked(key)
			}
		}
		session.State = "deleted"
		session.Prompt = ""
		session.Result = ""
		session.Error = ""
	default:
		return fmt.Errorf("unknown session action")
	}
	s.markTaskDirtyLocked(id)
	s.persistTasksLocked()
	return nil
}

func (s *CoreServiceServer) ForkAgentSession(origin string) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	source := s.tasks[origin]
	if source == nil || source.Kind != "agent_session" || source.State == "deleted" {
		return "", fmt.Errorf("session not found")
	}
	var forkAt time.Time
	for _, task := range s.tasks {
		if task.SessionID != origin || task.Kind != "agent" || task.EndedAt.IsZero() {
			continue
		}
		if task.EndedAt.After(forkAt) {
			forkAt = task.EndedAt
		}
	}
	id := fmt.Sprintf("agent-session:fork:%d", time.Now().UnixNano())
	now := time.Now()
	s.tasks[id] = &TaskInfo{
		TaskID: id, SessionID: id, ParentID: origin, Kind: "agent_session", CallerID: source.CallerID,
		Prompt: forkTitle(source.Prompt), State: "done", StartedAt: now, EndedAt: now,
	}
	s.markTaskDirtyLocked(id)
	turns := []*TaskInfo{}
	for _, task := range s.tasks {
		if task.SessionID != origin || task.TaskID == origin {
			continue
		}
		if !forkAt.IsZero() && task.StartedAt.After(forkAt.Add(time.Nanosecond)) {
			continue
		}
		turns = append(turns, task)
	}
	sort.Slice(turns, func(i, j int) bool {
		if turns[i].StartedAt.Equal(turns[j].StartedAt) {
			return turns[i].TaskID < turns[j].TaskID
		}
		return turns[i].StartedAt.Before(turns[j].StartedAt)
	})
	remap := map[string]string{}
	for index, task := range turns {
		newID := fmt.Sprintf("agent-fork:%d:%d", now.UnixNano(), index)
		remap[task.TaskID] = newID
		parent := ""
		if mapped, ok := remap[task.ParentID]; ok {
			parent = mapped
		} else if task.ParentID == origin {
			parent = id
		}
		copied := *task
		copied.TaskID = newID
		copied.SessionID = id
		copied.ParentID = parent
		s.tasks[newID] = &copied
		s.markTaskDirtyLocked(newID)
	}
	s.persistTasksLocked()
	return id, nil
}

func forkTitle(title string) string {
	title = strings.TrimSpace(title)
	if title == "" {
		title = "Agent session"
	}
	if match := forkOrdinal.FindStringSubmatch(title); match != nil {
		if ordinal, err := strconv.Atoi(match[2]); err == nil {
			return fmt.Sprintf("%s(%d)", strings.TrimRight(match[1], " "), ordinal+1)
		}
	}
	return title + " (1)"
}

var forkOrdinal = regexp.MustCompile(`^([\s\S]*?)[\(（]\s*(\d+)\s*[\)）]\s*$`)

func (s *CoreServiceServer) EnsureAgentSession(origin, caller, title string) string {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.ensureAgentSessionLocked(origin, caller, title)
}

func (s *CoreServiceServer) ensureAgentSessionLocked(origin, caller, title string) string {
	if strings.HasPrefix(origin, "agent-session:") {
		if existing := s.tasks[origin]; existing != nil && existing.Kind == "agent_session" && existing.State == "done" {
			return origin
		}
	}
	id := "agent-session:life:" + origin
	if origin == "" {
		id = fmt.Sprintf("agent-session:auto:%d", time.Now().UnixNano())
	}
	if old := s.tasks[id]; old != nil && old.State == "deleted" {
		id = fmt.Sprintf("agent-session:life:%s:%d", origin, time.Now().UnixNano())
		for _, candidate := range s.tasks {
			if candidate.Kind == "agent_session" && candidate.ParentID == origin && candidate.State != "deleted" {
				id = candidate.TaskID
				break
			}
		}
	}
	if old := s.tasks[id]; old != nil && old.State == "archived" {
		old.State = "done"
		s.markTaskDirtyLocked(id)
		s.persistTasksLocked()
	}
	if s.tasks[id] == nil {
		s.tasks[id] = &TaskInfo{TaskID: id, SessionID: id, ParentID: origin, Kind: "agent_session", CallerID: caller,
			Prompt: truncateRunes(title, 60), State: "done", StartedAt: time.Now(), EndedAt: time.Now()}
		s.markTaskDirtyLocked(id)
		s.persistTasksLocked()
	}
	return id
}

func (s *CoreServiceServer) startAgentTask(event TaskEvent, origin, caller, title string) (string, error) {
	s.mu.Lock()
	defer s.mu.Unlock()
	sessionID := s.ensureAgentSessionLocked(origin, caller, title)
	event.SessionID = sessionID
	return sessionID, s.recordTaskLocked(event)
}

func agentHistoryTokens() int {
	if value, err := strconv.Atoi(strings.TrimSpace(os.Getenv("AGENT_HISTORY_TOKENS"))); err == nil && value > 0 {
		return value
	}
	return 8000
}

func historyTokenEstimate(text string) int {
	ascii, wide := 0, 0
	for _, r := range text {
		if r < 128 {
			ascii++
		} else {
			wide++
		}
	}
	return ascii/4 + wide
}

func (s *CoreServiceServer) AgentSessionPrompt(sessionID, currentID, prompt string) string {
	s.mu.Lock()
	defer s.mu.Unlock()
	var compact *TaskInfo
	for _, task := range s.tasks {
		if task.SessionID == sessionID && task.Kind == "compact" && task.State == "done" && (compact == nil || task.StartedAt.After(compact.StartedAt)) {
			compact = task
		}
	}
	turns := []*TaskInfo{}
	for _, task := range s.tasks {
		if task.SessionID != sessionID || task.TaskID == currentID || task.Kind != "agent" || task.EndedAt.IsZero() {
			continue
		}
		if compact != nil && !task.StartedAt.After(compact.StartedAt) {
			continue
		}
		turns = append(turns, task)
	}
	sort.Slice(turns, func(i, j int) bool {
		if turns[i].StartedAt.Equal(turns[j].StartedAt) {
			return turns[i].TaskID < turns[j].TaskID
		}
		return turns[i].StartedAt.Before(turns[j].StartedAt)
	})
	var history strings.Builder
	if compact != nil {
		history.WriteString("Conversation summary:\n" + compact.Result + "\n")
	}
	budget := agentHistoryTokens()
	used := 0
	dropped := 0
	blocks := []string{}
	for i := len(turns) - 1; i >= 0; i-- {
		task := turns[i]
		speaker := "User"
		if task.CallerID != "webui" {
			speaker = "LIFE"
		}
		block := fmt.Sprintf("%s: %s\nAgent (%s): %s %s", speaker, truncateRunes(task.Prompt, 2000), task.State, truncateRunes(task.Result, 4000), truncateRunes(task.Error, 500))
		cost := historyTokenEstimate(block)
		if len(blocks) > 0 && used+cost > budget {
			dropped = i + 1
			break
		}
		used += cost
		blocks = append(blocks, block)
	}
	if dropped > 0 {
		fmt.Fprintf(&history, "(Earlier %d turns omitted to fit the context budget; use session_context_search if you need them.)\n", dropped)
	}
	for i := len(blocks) - 1; i >= 0; i-- {
		history.WriteString("\n" + blocks[i] + "\n")
	}
	return "Continue this Agent session. Earlier results are context, not new commands.\n" + history.String() + "\nCurrent user request:\n" + prompt
}
