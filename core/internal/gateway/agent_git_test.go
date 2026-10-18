package gateway

import (
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"testing"

	"0kay/core/internal/settings"
)

// setGitIdentity gives the test process a git identity so both the test's own
// git calls and the handler's `git commit` work without the user's global config.
func setGitIdentity(t *testing.T) {
	t.Helper()
	t.Setenv("GIT_AUTHOR_NAME", "test")
	t.Setenv("GIT_AUTHOR_EMAIL", "test@example.com")
	t.Setenv("GIT_COMMITTER_NAME", "test")
	t.Setenv("GIT_COMMITTER_EMAIL", "test@example.com")
}

func gitInitRepo(t *testing.T) string {
	t.Helper()
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("git not available")
	}
	dir := gitInitRepoIn(t, t.TempDir())
	// validDir confines the handler to AGENT_WORKSPACE_ROOTS; t.TempDir() lives
	// outside the test binary's working directory, so opt this dir in.
	t.Setenv("AGENT_WORKSPACE_ROOTS", dir)
	return dir
}

// gitInitRepoIn initialises a repository in an existing directory.
func gitInitRepoIn(t *testing.T, dir string) string {
	t.Helper()
	setGitIdentity(t)
	run := func(args ...string) {
		cmd := exec.Command("git", args...)
		cmd.Dir = dir
		if out, err := cmd.CombinedOutput(); err != nil {
			t.Fatalf("git %v: %v (%s)", args, err, out)
		}
	}
	run("init")
	if err := os.WriteFile(filepath.Join(dir, "a.txt"), []byte("hello"), 0o644); err != nil {
		t.Fatal(err)
	}
	run("add", ".")
	run("commit", "-m", "init")
	// One modified tracked file + one untracked file.
	if err := os.WriteFile(filepath.Join(dir, "a.txt"), []byte("hello world"), 0o644); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "b.txt"), []byte("new"), 0o644); err != nil {
		t.Fatal(err)
	}
	return dir
}

// TestAgentGitWorkspaceRootsAreCommaSeparated pins the wire format.
//
// AGENT_WORKSPACE_ROOTS is defined by the agent's own workspace policy
// (agent/src/workspace/paths.ts) as a COMMA-separated list. Reading it with
// filepath.SplitList (';' on Windows, ':' on POSIX) made a documented value arrive
// as a single bogus root, every candidate fail to resolve, and the panel return
// 403 for every path on every action — while the suite stayed green, because
// every test set one directory with no separator.
func TestAgentGitWorkspaceRootsAreCommaSeparated(t *testing.T) {
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("git not available")
	}
	first := gitInitRepoIn(t, t.TempDir())
	second := gitInitRepoIn(t, t.TempDir())

	t.Setenv("AGENT_WORKSPACE_ROOTS", first+","+second)
	if got := (&Gateway{}).agentWorkspaceRoots(); len(got) != 2 {
		t.Fatalf("comma-separated roots not split into %d entries: %q", len(got), os.Getenv("AGENT_WORKSPACE_ROOTS"))
	}

	for _, repo := range []string{first, second} {
		rec := httptest.NewRecorder()
		g := &Gateway{}
		g.handleAgentGit(rec, httptest.NewRequest("GET", "/api/agent/git?action=status&path="+url.QueryEscape(repo), nil))
		if rec.Code != http.StatusOK {
			t.Errorf("repo under a comma-listed root returned %d, want 200: %s", rec.Code, rec.Body.String())
		}
	}
}

func TestAgentGitStatusStageCommit(t *testing.T) {
	dir := gitInitRepo(t)
	g := &Gateway{}

	get := func(action string) *httptest.ResponseRecorder {
		rec := httptest.NewRecorder()
		req := httptest.NewRequest("GET", "/api/agent/git?action="+action+"&path="+url.QueryEscape(dir), nil)
		g.handleAgentGit(rec, req)
		return rec
	}
	post := func(payload string) *httptest.ResponseRecorder {
		rec := httptest.NewRecorder()
		req := httptest.NewRequest("POST", "/api/agent/git", strings.NewReader(payload))
		g.handleAgentGit(rec, req)
		return rec
	}
	quote := func(v string) string { return strconv.Quote(v) }

	status := get("status")
	if status.Code != 200 {
		t.Fatalf("status code %d: %s", status.Code, status.Body.String())
	}
	body := status.Body.String()
	if !strings.Contains(body, "a.txt") || !strings.Contains(body, "b.txt") {
		t.Fatalf("status missing changed files: %s", body)
	}
	if !strings.Contains(body, `"branch":"`) {
		t.Fatalf("status missing branch: %s", body)
	}

	if r := post(`{"path":` + quote(dir) + `,"action":"stage","files":["a.txt","b.txt"]}`); r.Code != 200 {
		t.Fatalf("stage: %d %s", r.Code, r.Body.String())
	}
	if r := post(`{"path":` + quote(dir) + `,"action":"commit","message":"update files"}`); r.Code != 200 {
		t.Fatalf("commit: %d %s", r.Code, r.Body.String())
	}

	clean := get("status")
	if !strings.Contains(clean.Body.String(), `"files":[]`) {
		t.Fatalf("expected a clean tree after commit: %s", clean.Body.String())
	}

	log := get("log")
	if log.Code != 200 || !strings.Contains(log.Body.String(), "update files") {
		t.Fatalf("log missing the new commit: %s", log.Body.String())
	}
}

func TestAgentGitRejectsNonRepo(t *testing.T) {
	dir := t.TempDir()
	t.Setenv("AGENT_WORKSPACE_ROOTS", dir)
	g := &Gateway{}
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/api/agent/git?action=status&path="+url.QueryEscape(dir), nil)
	g.handleAgentGit(rec, req)
	if rec.Code != 400 || !strings.Contains(rec.Body.String(), "not_a_repo") {
		t.Fatalf("expected not_a_repo, got %d: %s", rec.Code, rec.Body.String())
	}
}

// TestAgentGitRejectsPathOutsideWorkspaceRoots is the authorization test for
// this route: without an opt-in, a caller must not be able to name a
// repository anywhere on the host.
func TestAgentGitRejectsPathOutsideWorkspaceRoots(t *testing.T) {
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("git not available")
	}
	repo := gitInitRepo(t)
	// gitInitRepo opted `repo` in; now opt only somewhere else in.
	elsewhere := t.TempDir()
	t.Setenv("AGENT_WORKSPACE_ROOTS", elsewhere)

	g := &Gateway{}
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("GET", "/api/agent/git?action=status&path="+url.QueryEscape(repo), nil)
	g.handleAgentGit(rec, req)
	if rec.Code != http.StatusForbidden || !strings.Contains(rec.Body.String(), "git_forbidden") {
		t.Fatalf("expected 403 git_forbidden, got %d: %s", rec.Code, rec.Body.String())
	}

	// Commit is the destructive one; it must be refused too.
	body := `{"path":` + strconv.Quote(repo) + `,"action":"commit","message":"pwn"}`
	postRec := httptest.NewRecorder()
	g.handleAgentGit(postRec, httptest.NewRequest("POST", "/api/agent/git", strings.NewReader(body)))
	if postRec.Code != http.StatusForbidden {
		t.Fatalf("expected 403 for commit outside roots, got %d: %s", postRec.Code, postRec.Body.String())
	}
}

// TestAgentGitDefaultRootsIncludeProjectRoot pins the bug that made "stage all"
// fail with "path is outside the configured agent workspace roots" on the
// project the stack itself lives in.
//
// Every service is launched from its own subdirectory, so cwd is <repo>/core and
// the repository root — the directory the WebUI shows as the workspace — was
// outside the default root set (cwd, home, temp). validRepoDir additionally
// re-checks the repository top level, so even a path inside a root was refused
// whenever the top level was its parent.
func TestAgentGitDefaultRootsIncludeProjectRoot(t *testing.T) {
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("git not available")
	}
	repo := gitInitRepoIn(t, t.TempDir())
	sub := filepath.Join(repo, "core")
	if err := os.MkdirAll(sub, 0o755); err != nil {
		t.Fatal(err)
	}
	t.Setenv("AGENT_WORKSPACE_ROOTS", "")
	t.Chdir(sub)

	top := projectRoot()
	if top == "" {
		t.Fatal("projectRoot() found no repository from a subdirectory")
	}
	resolvedTop, err := resolvePath(top)
	if err != nil {
		t.Fatalf("resolve project root: %v", err)
	}
	resolvedRepo, err := resolvePath(repo)
	if err != nil {
		t.Fatalf("resolve repo: %v", err)
	}
	if !strings.EqualFold(resolvedTop, resolvedRepo) {
		t.Fatalf("projectRoot() = %q, want %q", resolvedTop, resolvedRepo)
	}
	// It must be an ENTRY of the root set, not merely contained by one: the
	// repository sits under the temp dir, which is a default root anyway, so a
	// containment check would pass even with the bug present.
	roots := (&Gateway{}).agentWorkspaceRoots()
	found := false
	for _, root := range roots {
		if resolved, err := resolvePath(root); err == nil && strings.EqualFold(resolved, resolvedTop) {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("project root %q is not an entry in the default roots %v", resolvedTop, roots)
	}
}

// TestAgentGitForbiddenMessageNamesRoots pins that the 403 explains itself: the
// default root set is not what an operator would guess, so the message has to
// list what was actually checked.
func TestAgentGitForbiddenMessageNamesRoots(t *testing.T) {
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("git not available")
	}
	repo := gitInitRepoIn(t, t.TempDir())
	elsewhere := t.TempDir()
	t.Setenv("AGENT_WORKSPACE_ROOTS", elsewhere)

	g := &Gateway{}
	rec := httptest.NewRecorder()
	g.handleAgentGit(rec, httptest.NewRequest("GET", "/api/agent/git?action=status&path="+url.QueryEscape(repo), nil))
	if rec.Code != http.StatusForbidden {
		t.Fatalf("expected 403, got %d: %s", rec.Code, rec.Body.String())
	}
	if !strings.Contains(rec.Body.String(), "allowed roots are") || !strings.Contains(rec.Body.String(), "AGENT_WORKSPACE_ROOTS") {
		t.Fatalf("403 does not name the allowed roots: %s", rec.Body.String())
	}
}

// TestAgentGitHonoursConfiguredWorkspaceRoots pins the UI-side escape hatch:
// the workspace picker browses the whole filesystem, so a project on another
// drive must be allow-able from Settings → 工作区 instead of only through the
// AGENT_WORKSPACE_ROOTS environment variable.
func TestAgentGitHonoursConfiguredWorkspaceRoots(t *testing.T) {
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("git not available")
	}
	repo := gitInitRepo(t)
	// Only an unrelated directory is in the environment list.
	t.Setenv("AGENT_WORKSPACE_ROOTS", t.TempDir())

	setStore := settings.NewStore(filepath.Join(t.TempDir(), "settings.json"))
	setStore.RegisterSection(settings.Section{
		ID:     "workspace",
		Label:  "工作区",
		Fields: []settings.Field{{Key: "allowed_roots", Type: "text"}},
	})
	if err := setStore.SetValues("workspace", map[string]interface{}{"allowed_roots": repo}); err != nil {
		t.Fatalf("seed workspace setting: %v", err)
	}

	g := &Gateway{}
	g.SetSettingsStore(setStore)
	rec := httptest.NewRecorder()
	g.handleAgentGit(rec, httptest.NewRequest("GET", "/api/agent/git?action=status&path="+url.QueryEscape(repo), nil))
	if rec.Code != http.StatusOK {
		t.Fatalf("configured root not honoured: %d %s", rec.Code, rec.Body.String())
	}

	// A comma/newline list works too — operators paste either.
	if err := setStore.SetValues("workspace", map[string]interface{}{"allowed_roots": "/nope,\n  " + repo + "  \n"}); err != nil {
		t.Fatal(err)
	}
	if roots := g.agentWorkspaceRoots(); !withinRoots(mustResolve(t, repo), roots) {
		t.Fatalf("multi-line list not parsed: %v", roots)
	}
}

func mustResolve(t *testing.T, p string) string {
	t.Helper()
	resolved, err := resolvePath(p)
	if err != nil {
		t.Fatalf("resolve %q: %v", p, err)
	}
	return resolved
}

// TestAgentGitDiscardRemovesUntrackedFile pins the tracked/untracked split:
// `git restore` fails its whole batch on a pathspec the index does not know, so
// a request mixing both used to discard nothing at all.
func TestAgentGitDiscardRemovesUntrackedFile(t *testing.T) {
	dir := gitInitRepo(t)
	g := &Gateway{}

	// Mixed batch: one tracked modification + one untracked file.
	rec := httptest.NewRecorder()
	body := `{"path":` + strconv.Quote(dir) + `,"action":"discard","files":["a.txt","b.txt"]}`
	g.handleAgentGit(rec, httptest.NewRequest("POST", "/api/agent/git", strings.NewReader(body)))
	if rec.Code != 200 {
		t.Fatalf("discard: %d %s", rec.Code, rec.Body.String())
	}
	if strings.Contains(rec.Body.String(), `"path":"a.txt"`) {
		t.Fatalf("a.txt still modified after discard: %s", rec.Body.String())
	}
	if strings.Contains(rec.Body.String(), `"path":"b.txt"`) {
		t.Fatalf("b.txt should have been removed: %s", rec.Body.String())
	}
	if _, err := os.Stat(filepath.Join(dir, "b.txt")); !os.IsNotExist(err) {
		t.Fatalf("b.txt still on disk after discard: %v", err)
	}
}

// TestAgentGitDoesNotRunHooks pins the config-execution hardening: a repository
// whose pre-commit hook writes a marker file must not have that hook run by the
// handler, because the handler executes git inside a repository the user may
// merely have cloned.
func TestAgentGitDoesNotRunHooks(t *testing.T) {
	dir := gitInitRepo(t)
	// The hook is a POSIX shell script; writing one on Windows would produce a
	// file git cannot execute, so the assertion below could never fail. Skipping
	// is honest; silently passing a vacuous test is not.
	if runtime.GOOS == "windows" {
		t.Skip("hooks test needs a POSIX shell script; covered by CI on ubuntu")
	}
	hook := filepath.Join(dir, ".git", "hooks", "pre-commit")
	script := "#!/bin/sh\ntouch " + filepath.Join(dir, "HOOK_RAN") + "\nexit 0\n"
	if err := os.WriteFile(hook, []byte(script), 0o755); err != nil {
		t.Fatal(err)
	}
	// A second file to commit, so there is something for the hook to gate.
	if err := os.WriteFile(filepath.Join(dir, "c.txt"), []byte("hook test"), 0o644); err != nil {
		t.Fatal(err)
	}

	g := &Gateway{}
	rec := httptest.NewRecorder()
	body := `{"path":` + strconv.Quote(dir) + `,"action":"stage","files":["c.txt"]}`
	g.handleAgentGit(rec, httptest.NewRequest("POST", "/api/agent/git", strings.NewReader(body)))
	if rec.Code != 200 {
		t.Fatalf("stage: %d %s", rec.Code, rec.Body.String())
	}
	rec = httptest.NewRecorder()
	body = `{"path":` + strconv.Quote(dir) + `,"action":"commit","message":"hook test"}`
	g.handleAgentGit(rec, httptest.NewRequest("POST", "/api/agent/git", strings.NewReader(body)))
	if rec.Code != 200 {
		t.Fatalf("commit: %d %s", rec.Code, rec.Body.String())
	}
	if _, err := os.Stat(filepath.Join(dir, "HOOK_RAN")); err == nil {
		t.Fatal("pre-commit hook ran — repository-controlled code execution")
	}
}

// TestParsePorcelainKeepsNonASCIIPaths pins the -z decode: a C-quoted path from
// the newline form could not be fed back to git by the panel.
func TestParsePorcelainKeepsNonASCIIPaths(t *testing.T) {
	const path = "src/文档/main.go"
	// "??" is untracked; " M" is a worktree-only change (index column blank);
	// "M " is a staged change.
	out := "?? " + path + "\x00 M " + path + "\x00M  " + path + "\x00"
	files := parsePorcelain(out)
	if len(files) != 3 {
		t.Fatalf("expected 3 entries, got %d: %+v", len(files), files)
	}
	if files[0].Path != path || files[0].Staged {
		t.Fatalf("untracked entry wrong: %+v", files[0])
	}
	if files[1].Path != path || files[1].Staged {
		t.Fatalf("worktree-only entry should not be staged: %+v", files[1])
	}
	if files[2].Path != path || !files[2].Staged {
		t.Fatalf("staged entry wrong: %+v", files[2])
	}
}

// TestParsePorcelainSkipsRenameSource pins the two-field rename/copy form.
func TestParsePorcelainSkipsRenameSource(t *testing.T) {
	out := "R  new.txt\x00old.txt\x00?? other.txt\x00"
	files := parsePorcelain(out)
	if len(files) != 2 {
		t.Fatalf("expected 2 entries, got %d: %+v", len(files), files)
	}
	if files[0].Path != "new.txt" {
		t.Fatalf("rename target wrong: %+v", files[0])
	}
	if files[1].Path != "other.txt" {
		t.Fatalf("entry after rename wrong: %+v", files[1])
	}
}

// TestParsePorcelainConflictIsNotStaged pins that a merge conflict is not
// reported as staged — otherwise the panel invites committing conflict markers.
func TestParsePorcelainConflictIsNotStaged(t *testing.T) {
	files := parsePorcelain("UU conflicted.txt\x00AA both-added.txt\x00")
	if len(files) != 2 {
		t.Fatalf("expected 2 entries, got %d: %+v", len(files), files)
	}
	for _, f := range files {
		if f.Staged {
			t.Fatalf("conflict reported as staged: %+v", f)
		}
	}
}

// TestParseLogSurvivesSeparatorInSubject pins that a subject containing the
// record delimiter no longer shifts every field.
func TestParseLogSurvivesSeparatorInSubject(t *testing.T) {
	out := "abc123\x00Ada\x002026-10-17\x00fix \x1f the thing\x00"
	commits := parseLog(out)
	if len(commits) != 1 {
		t.Fatalf("expected 1 commit, got %d: %+v", len(commits), commits)
	}
	if commits[0].Hash != "abc123" || commits[0].Author != "Ada" || commits[0].Date != "2026-10-17" {
		t.Fatalf("fields shifted: %+v", commits[0])
	}
	if commits[0].Subject != "fix \x1f the thing" {
		t.Fatalf("subject mangled: %q", commits[0].Subject)
	}
}

func TestAgentGitInitCreatesRepo(t *testing.T) {
	if _, err := exec.LookPath("git"); err != nil {
		t.Skip("git not available")
	}
	setGitIdentity(t)
	dir := t.TempDir()
	t.Setenv("AGENT_WORKSPACE_ROOTS", dir)
	g := &Gateway{}

	// A plain folder reports the not_a_repo code so the UI can offer init.
	rec := httptest.NewRecorder()
	g.handleAgentGit(rec, httptest.NewRequest("GET", "/api/agent/git?action=status&path="+url.QueryEscape(dir), nil))
	if rec.Code != 400 || !strings.Contains(rec.Body.String(), "not_a_repo") {
		t.Fatalf("expected not_a_repo before init, got %d: %s", rec.Code, rec.Body.String())
	}

	// One-click init turns it into a repository.
	rec = httptest.NewRecorder()
	g.handleAgentGit(rec, httptest.NewRequest("POST", "/api/agent/git", strings.NewReader(`{"path":`+strconv.Quote(dir)+`,"action":"init"}`)))
	if rec.Code != 200 {
		t.Fatalf("init: %d %s", rec.Code, rec.Body.String())
	}
	if !strings.Contains(rec.Body.String(), `"branch":`) || !strings.Contains(rec.Body.String(), `"files":[]`) {
		t.Fatalf("init response missing status payload: %s", rec.Body.String())
	}
}

func TestAgentGitDiscard(t *testing.T) {
	dir := gitInitRepo(t)
	g := &Gateway{}
	rec := httptest.NewRecorder()
	g.handleAgentGit(rec, httptest.NewRequest("POST", "/api/agent/git", strings.NewReader(`{"path":`+strconv.Quote(dir)+`,"action":"discard","files":["a.txt"]}`)))
	if rec.Code != 200 {
		t.Fatalf("discard: %d %s", rec.Code, rec.Body.String())
	}
	if strings.Contains(rec.Body.String(), `"path":"a.txt"`) {
		t.Fatalf("a.txt still modified after discard: %s", rec.Body.String())
	}
	// The untracked file must survive a discard of a different path.
	if !strings.Contains(rec.Body.String(), `"path":"b.txt"`) {
		t.Fatalf("b.txt should remain untracked: %s", rec.Body.String())
	}
}

func TestAgentGitRejectsUnknownAction(t *testing.T) {
	dir := gitInitRepo(t)
	g := &Gateway{}
	rec := httptest.NewRecorder()
	req := httptest.NewRequest("POST", "/api/agent/git", strings.NewReader(`{"path":`+strconv.Quote(dir)+`,"action":"push"}`))
	g.handleAgentGit(rec, req)
	if rec.Code != 400 {
		t.Fatalf("expected 400 for unknown action, got %d", rec.Code)
	}
}
