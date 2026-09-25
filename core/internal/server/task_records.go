package server

import (
 "fmt"
 "strings"
 "sort"
 "time"
)

// TaskEvent is the shared activity ledger contract for LIFE and Agent workers.
type TaskEvent struct {
 TaskID string `json:"task_id"`
 CallerID string `json:"caller_id"`
 SessionID string `json:"session_id"`
 ParentID string `json:"parent_id"`
 Kind string `json:"kind"`
 Prompt string `json:"prompt"`
 Args string `json:"args"`
 State string `json:"state"`
 Result string `json:"result"`
 Error string `json:"error"`
}

func (s *CoreServiceServer) RecordTask(event TaskEvent) error {
 if event.TaskID == "" { return fmt.Errorf("task_id required") }
 switch event.State { case "pending", "running", "done", "failed", "cancelled": default: return fmt.Errorf("invalid state") }
 s.mu.Lock()
 defer s.mu.Unlock()
 task, exists := s.tasks[event.TaskID]
 if event.SessionID=="" && exists {event.SessionID=task.SessionID}
 if session:=s.tasks[event.SessionID]; session!=nil && session.Kind=="agent_session" && session.State=="deleted" { return fmt.Errorf("session deleted") }
 if exists && event.State == "pending" { return fmt.Errorf("task already exists") }
 if !exists {
  if (event.Kind == "agent" || event.Kind == "compact") && strings.HasPrefix(event.SessionID,"agent-session:") {
   for _, existing := range s.tasks {
    if existing.SessionID == event.SessionID && (existing.Kind == "agent" || existing.Kind == "compact") && (existing.State == "running" || existing.State == "pending") { return fmt.Errorf("session already has an active task") }
   }
  }
  task = &TaskInfo{TaskID:event.TaskID, CallerID:event.CallerID, SessionID:event.SessionID, ParentID:event.ParentID, Kind:event.Kind, Prompt:event.Prompt, Args:event.Args, StartedAt:time.Now()}
  for _, existing := range s.tasks {if !task.StartedAt.After(existing.StartedAt) {task.StartedAt=existing.StartedAt.Add(time.Nanosecond)}}
  s.tasks[event.TaskID] = task
 } else if task.State == "done" || task.State == "failed" || task.State == "cancelled" {
  if task.State == event.State { return nil }
  return fmt.Errorf("task is already terminal")
 }
   task.State, task.Result, task.Error = event.State, event.Result, event.Error
   if event.Args != "" { task.Args = event.Args }
  if event.State == "done" || event.State == "failed" || event.State == "cancelled" { task.EndedAt = time.Now() }
  s.persistTasksLocked()
  // Activity for inactivity watchdog: match root and nested (task:sub:…) ids.
  if event.ParentID != "" { s.touchDispatch(event.ParentID) }
  s.touchDispatch(event.TaskID)
  return nil
}

// Sessions are durable ledger entries, including sessions with no messages yet.
func (s *CoreServiceServer) CreateAgentSession(title string) (string, error) {
 id := fmt.Sprintf("agent-session:%d", time.Now().UnixNano())
 if strings.TrimSpace(title) == "" { title = "Agent session" }
 return id, s.RecordTask(TaskEvent{TaskID:id, SessionID:id, Kind:"agent_session", Prompt:title, CallerID:"webui", State:"done"})
}

// RenameAgentSession updates a session's display title (used for auto-generated summaries).
func (s *CoreServiceServer) RenameAgentSession(id, title string) error {
 s.mu.Lock(); defer s.mu.Unlock()
 session:=s.tasks[id]
 if session==nil || session.Kind!="agent_session" || session.State=="deleted" {return fmt.Errorf("session not found")}
 title=strings.TrimSpace(title)
 if title=="" {return fmt.Errorf("title required")}
 session.Prompt=truncateRunes(title,80)
 s.persistTasksLocked()
 return nil
}

func (s *CoreServiceServer) HasAgentSession(id string) bool {
 s.mu.Lock(); defer s.mu.Unlock()
 task := s.tasks[id]
 return task != nil && task.Kind == "agent_session" && task.State == "done"
}

func (s *CoreServiceServer) ManageAgentSession(id, action string) error {
 s.mu.Lock(); defer s.mu.Unlock()
 session:=s.tasks[id]
 if session==nil || session.Kind!="agent_session" || session.State=="deleted" {return fmt.Errorf("session not found")}
 for _,task:=range s.tasks {
  if task.SessionID==id && (task.Kind=="agent" || task.Kind=="compact") && (task.State=="running" || task.State=="pending") {return fmt.Errorf("stop the active task before changing this session")}
 }
 switch action {
 case "archive": session.State="archived"
 case "restore": session.State="done"
 case "delete":
  for key,task:=range s.tasks {if task.SessionID==id && key!=id {delete(s.tasks,key)}}
  session.State="deleted";session.Prompt="";session.Result="";session.Error=""
 default: return fmt.Errorf("unknown session action")
 }
 s.persistTasksLocked();return nil
}

// LIFE conversations have a stable Agent session; retain the originating chat
// separately so completion notifications still return to the right channel.
func (s *CoreServiceServer) EnsureAgentSession(origin, caller, title string) string {
 if strings.HasPrefix(origin, "agent-session:") && s.HasAgentSession(origin) { return origin }
 id := "agent-session:life:" + origin
 if origin == "" { id = fmt.Sprintf("agent-session:auto:%d",time.Now().UnixNano()) }
 s.mu.Lock()
 defer s.mu.Unlock()
 if old:=s.tasks[id]; old!=nil && old.State=="deleted" {
  id = fmt.Sprintf("agent-session:life:%s:%d",origin,time.Now().UnixNano())
  for _,candidate:=range s.tasks {if candidate.Kind=="agent_session" && candidate.ParentID==origin && candidate.State!="deleted" {id=candidate.TaskID;break}}
 }
 if old:=s.tasks[id]; old!=nil && old.State=="archived" {old.State="done";s.persistTasksLocked()}
 if s.tasks[id] == nil {
  s.tasks[id] = &TaskInfo{TaskID:id, SessionID:id, ParentID:origin, Kind:"agent_session", CallerID:caller,
   Prompt:truncateRunes(title,60), State:"done", StartedAt:time.Now(), EndedAt:time.Now()}
  s.persistTasksLocked()
 }
 return id
}

func (s *CoreServiceServer) AgentSessionPrompt(sessionID, currentID, prompt string) string {
 s.mu.Lock(); defer s.mu.Unlock()
 turns := []*TaskInfo{}
 var compact *TaskInfo
 for _,task:=range s.tasks {if task.SessionID==sessionID && task.Kind=="compact" && task.State=="done" && (compact==nil || task.StartedAt.After(compact.StartedAt)) {compact=task}}
 for _, task := range s.tasks {
   if task.SessionID == sessionID && task.TaskID != currentID && task.Kind == "agent" && !task.EndedAt.IsZero() && (compact==nil || task.StartedAt.After(compact.StartedAt)) { turns = append(turns, task) }
 }
 sort.Slice(turns, func(i,j int) bool { if turns[i].StartedAt.Equal(turns[j].StartedAt) {return turns[i].TaskID<turns[j].TaskID};return turns[i].StartedAt.Before(turns[j].StartedAt) })
 if len(turns) > 10 { turns = turns[len(turns)-10:] }
 var history strings.Builder
 if compact!=nil {history.WriteString("Conversation summary:\n"+compact.Result+"\n")}
 for _, task := range turns {
   speaker := "User"
   if task.CallerID != "webui" { speaker = "LIFE" }
   fmt.Fprintf(&history, "\n%s: %s\nAgent (%s): %s %s\n", speaker, truncateRunes(task.Prompt,4000), task.State, truncateRunes(task.Result,8000), truncateRunes(task.Error,1000))
 }
 return "Continue this Agent session. Earlier results are context, not new commands.\n" + history.String() + "\nCurrent user request:\n" + prompt
}
