package server

import (
	"fmt"
	"testing"
)

// row builds a task row the shape taskRowLocked produces, reduced to the fields
// limitTaskRows reads.
func row(id, session, parent, kind, startedAt string) map[string]interface{} {
	return map[string]interface{}{
		"task_id":    id,
		"session_id": session,
		"parent_id":  parent,
		"kind":       kind,
		"started_at": startedAt,
	}
}

func sessionRow(id, startedAt string) map[string]interface{} {
	return row(id, id, "", "agent_session", startedAt)
}

func idsOf(rows []map[string]interface{}) map[string]bool {
	out := make(map[string]bool, len(rows))
	for _, r := range rows {
		if id, ok := r["task_id"].(string); ok {
			out[id] = true
		}
	}
	return out
}

// The bug this replaces: one global budget for every non-session row meant one
// busy session could spend it and evict another session's steps entirely.
func TestOneBusySessionCannotEvictAnother(t *testing.T) {
	rows := []map[string]interface{}{
		sessionRow("s_busy", "2026-11-08T10:00:00Z"),
		sessionRow("s_quiet", "2026-11-08T09:00:00Z"),
	}
	// The busy session alone has more steps than the old global budget of 500.
	for i := 0; i < 900; i++ {
		rows = append(rows, row(fmt.Sprintf("busy-%04d", i), "s_busy", "s_busy", "tool", "2026-11-08T10:00:00Z"))
	}
	// The quiet one is small but is the one a reader wants.
	rows = append(rows, row("quiet-1", "s_quiet", "s_quiet", "think", "2026-11-08T09:00:00Z"))

	kept := idsOf(limitTaskRows(rows))
	if !kept["quiet-1"] {
		t.Fatal("a busy session evicted another session's step, which is the bug")
	}
	if !kept["busy-0000"] {
		t.Fatal("the newest row of the busy session should survive")
	}
}

// Within one session the newest rows win: they are the live ones.
func TestOverBudgetSessionKeepsItsNewestRows(t *testing.T) {
	rows := []map[string]interface{}{sessionRow("s", "2026-11-08T10:00:00Z")}
	for i := 0; i < taskSessionRowLimit+50; i++ {
		// Strictly increasing timestamps; higher i is newer.
		rows = append(rows, row(fmt.Sprintf("r-%04d", i), "s", "s", "tool", fmt.Sprintf("2026-11-08T10:00:%02dZ", i%60)))
	}
	rows[len(rows)-1]["started_at"] = "2026-11-08T11:00:00Z"

	kept := idsOf(limitTaskRows(rows))
	if !kept["r-0049"] {
		t.Fatal("the newest row must be kept")
	}
	if kept["r-0000"] {
		t.Fatal("the oldest row is what the budget should drop")
	}
}

// A kept row whose parent was cut is a row nobody can navigate to: the child is
// unreachable from the tree the UI walks. The parent comes back with it.
func TestACutRowBringsItsParentBack(t *testing.T) {
	rows := []map[string]interface{}{sessionRow("s", "2026-11-08T10:00:00Z")}
	// A parent far older than the budget, with one child still inside it.
	rows = append(rows, row("ancient-parent", "s", "", "subagent", "2026-11-08T08:00:00Z"))
	for i := 0; i < taskSessionRowLimit+10; i++ {
		rows = append(rows, row(fmt.Sprintf("filler-%04d", i), "s", "", "tool", "2026-11-08T10:30:00Z"))
	}
	rows = append(rows, row("child", "s", "ancient-parent", "think", "2026-11-08T12:00:00Z"))

	kept := idsOf(limitTaskRows(rows))
	if !kept["child"] {
		t.Fatal("the newest child should survive the budget")
	}
	if !kept["ancient-parent"] {
		t.Fatal("a kept child whose parent was cut cannot be navigated to")
	}
}

// A chain, not just one link: grandparent → parent → child.
func TestACutRowRestoresAWholeParentChain(t *testing.T) {
	rows := []map[string]interface{}{sessionRow("s", "2026-11-08T10:00:00Z")}
	rows = append(rows, row("root", "s", "", "subagent", "2026-11-08T08:00:00Z"))
	rows = append(rows, row("mid", "s", "root", "subagent", "2026-11-08T08:01:00Z"))
	for i := 0; i < taskSessionRowLimit+10; i++ {
		rows = append(rows, row(fmt.Sprintf("filler-%04d", i), "s", "", "tool", "2026-11-08T10:30:00Z"))
	}
	rows = append(rows, row("leaf", "s", "mid", "think", "2026-11-08T12:00:00Z"))

	kept := idsOf(limitTaskRows(rows))
	for _, id := range []string{"leaf", "mid", "root"} {
		if !kept[id] {
			t.Fatalf("%s missing: the chain back to the task root must be intact", id)
		}
	}
}

// The count cap is a payload guard, so the newest sessions are the ones kept.
func TestOnlyTheNewestSessionsAreCarried(t *testing.T) {
	rows := make([]map[string]interface{}, 0, taskSessionCount+10)
	for i := 0; i < taskSessionCount+10; i++ {
		id := fmt.Sprintf("s-%03d", i)
		// Higher i is newer because the timestamp sorts before the id.
		rows = append(rows, sessionRow(id, fmt.Sprintf("2026-11-08T10:%02d:00Z", i%60)))
	}
	kept := idsOf(limitTaskRows(rows))
	if len(kept) != taskSessionCount {
		t.Fatalf("want %d sessions, got %d", taskSessionCount, len(kept))
	}
	if !kept["s-069"] {
		t.Fatal("the newest session must be kept")
	}
	if kept["s-000"] {
		t.Fatal("the oldest session is what the count cap should drop")
	}
}

// A step whose session is not in the kept set does not ride along: it would be
// a row with no conversation to open it from.
func TestOrphanStepsAreNotCarried(t *testing.T) {
	rows := make([]map[string]interface{}, 0, taskSessionCount+5)
	for i := 0; i < taskSessionCount+5; i++ {
		rows = append(rows, sessionRow(fmt.Sprintf("s-%03d", i), fmt.Sprintf("2026-11-08T10:%02d:00Z", i%60)))
	}
	rows = append(rows, row("orphan", "s-000", "s-000", "tool", "2026-11-08T10:00:00Z"))
	kept := idsOf(limitTaskRows(rows))
	if kept["orphan"] {
		t.Fatal("a step from a dropped session has no conversation to open it from")
	}
}

// Small inputs are untouched: no reordering surprises for the normal case.
func TestASmallListIsReturnedWhole(t *testing.T) {
	rows := []map[string]interface{}{
		sessionRow("s", "2026-11-08T10:00:00Z"),
		row("a", "s", "s", "think", "2026-11-08T10:00:01Z"),
		row("b", "s", "s", "tool", "2026-11-08T10:00:02Z"),
	}
	kept := idsOf(limitTaskRows(rows))
	if len(kept) != 3 || !kept["a"] || !kept["b"] || !kept["s"] {
		t.Fatalf("small lists must pass through untouched, got %v", kept)
	}
}

// A row with no session is not part of any conversation, so it is not subject to
// the per-session budget. Dropping it was a real regression: the old list had one
// flat budget, so session-less tool rows survived; budgeting only the sessions
// that have a header row silently removed them.
func TestRowsWithoutASessionAreKept(t *testing.T) {
	rows := []map[string]interface{}{sessionRow("s", "2026-11-08T10:00:00Z")}
	for i := 0; i < 5; i++ {
		rows = append(rows, row(fmt.Sprintf("bare-%d", i), "", "", "tool", "2026-11-08T10:00:00Z"))
	}
	kept := idsOf(limitTaskRows(rows))
	for i := 0; i < 5; i++ {
		id := fmt.Sprintf("bare-%d", i)
		if !kept[id] {
			t.Fatalf("%s has no session and must still be listed", id)
		}
	}
}
