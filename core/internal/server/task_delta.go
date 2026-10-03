package server

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
)

var taskGeneration = func() string { value := make([]byte, 16); _, _ = rand.Read(value); return hex.EncodeToString(value) }()

// resetTaskLimit bounds how many finished (non-session) rows a fresh client
// receives in the initial snapshot. In-flight rows and every session row are
// always included; older turns are fetched per session on demand.
const resetTaskLimit = 100

// resetTaskIDsLocked selects the rows a client without a cursor needs. Callers
// must hold s.mu.
func (s *CoreServiceServer) resetTaskIDsLocked() map[string]bool {
	ids := map[string]bool{}
	finished := make([]*TaskInfo, 0, len(s.tasks))
	for id, t := range s.tasks {
		if t.Kind == "agent_session" {
			ids[id] = true
			continue
		}
		if t.State == "running" || t.State == "pending" {
			ids[id] = true
			continue
		}
		finished = append(finished, t)
	}
	sortTasksNewest(finished)
	for i := 0; i < len(finished) && i < resetTaskLimit; i++ {
		ids[finished[i].TaskID] = true
	}
	return ids
}

func (s *CoreServiceServer) TaskDelta(cursor string) map[string]interface{} {
	s.mu.Lock()
	generation := taskGeneration
	var previous uint64
	prefix := generation + ":"
	valid := len(cursor) > len(prefix) && cursor[:len(prefix)] == prefix
	if valid {
		_, err := fmt.Sscanf(cursor[len(prefix):], "%d", &previous)
		valid = err == nil
	}
	revision := s.taskRevision
	if valid && previous == revision {
		s.mu.Unlock()
		return map[string]interface{}{"tasks": []map[string]interface{}{}, "removed": []string{}, "reset": false, "cursor": cursor}
	}
	ids := map[string]bool{}
	removed := []string{}
	if valid {
		for id, version := range s.taskChanges {
			if version > previous {
				ids[id] = true
			}
		}
		for id, version := range s.taskRemoved {
			if version > previous {
				removed = append(removed, id)
			}
		}
	} else {
		// Reset: the client has no cursor, so it needs the lightweight snapshot
		// (sessions + in-flight work + the newest finished rows). Older turns are
		// fetched per session on demand instead of dumping the whole history.
		for id := range s.resetTaskIDsLocked() {
			ids[id] = true
		}
	}
	// Build rows only for changed tasks; rebuilding the whole list on every
	// change is what made the ledger slow while a task was running.
	result := make([]map[string]interface{}, 0, len(ids))
	for id := range ids {
		t := s.tasks[id]
		if t == nil || s.sessionDeletedLocked(t) {
			continue
		}
		result = append(result, s.taskRowLocked(t))
	}
	s.mu.Unlock()
	sortTaskRows(result)
	result = limitTaskRows(result)
	return map[string]interface{}{"tasks": result, "removed": removed, "reset": !valid, "cursor": fmt.Sprintf("%s:%d", generation, revision)}
}
