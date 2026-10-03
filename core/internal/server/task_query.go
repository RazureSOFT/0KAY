package server

import (
	"sort"
	"time"
)

// SessionTasks returns every task row belonging to a session, newest first.
//
// It is the full view used by server-side compaction, context accounting and
// search. The browser does not receive this list: it gets the recent rows from
// /api/tasks and fetches an older session's turns on demand.
func (s *CoreServiceServer) SessionTasks(sessionID string) []map[string]interface{} {
	if sessionID == "" {
		return nil
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	list := make([]*TaskInfo, 0, 8)
	for _, t := range s.tasks {
		if t.SessionID == sessionID && !s.sessionDeletedLocked(t) {
			list = append(list, t)
		}
	}
	sortTasksNewest(list)
	out := make([]map[string]interface{}, 0, len(list))
	for _, t := range list {
		out = append(out, s.taskRowLocked(t))
	}
	return out
}

// SessionTasksPage returns one page of a session's rows, newest first. The
// opaque `before` cursor is the started_at of the oldest row the client already
// holds; pass "" for the newest page. `more` reports whether older rows remain
// and `next` is the cursor to request them.
func (s *CoreServiceServer) SessionTasksPage(sessionID, before string, limit int) (rows []map[string]interface{}, more bool, next string) {
	if limit <= 0 {
		limit = 50
	}
	if limit > 200 {
		limit = 200
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	list := make([]*TaskInfo, 0, 8)
	for _, t := range s.tasks {
		if t.SessionID == sessionID && !s.sessionDeletedLocked(t) {
			list = append(list, t)
		}
	}
	sortTasksNewest(list)
	start := 0
	if before != "" {
		if cursor, err := time.Parse(time.RFC3339Nano, before); err == nil {
			for start < len(list) && !list[start].StartedAt.Before(cursor) {
				start++
			}
		}
	}
	end := start + limit
	if end > len(list) {
		end = len(list)
	}
	rows = make([]map[string]interface{}, 0, end-start)
	for _, t := range list[start:end] {
		rows = append(rows, s.taskRowLocked(t))
	}
	if end < len(list) {
		more = true
		next = list[end-1].StartedAt.Format("2006-01-02T15:04:05.000000000Z07:00")
	}
	return rows, more, next
}

// sortTasksNewest orders tasks newest-first, tie-broken by id.
func sortTasksNewest(list []*TaskInfo) {
	sort.Slice(list, func(i, j int) bool {
		if list[i].StartedAt.Equal(list[j].StartedAt) {
			return list[i].TaskID < list[j].TaskID
		}
		return list[i].StartedAt.After(list[j].StartedAt)
	})
}
