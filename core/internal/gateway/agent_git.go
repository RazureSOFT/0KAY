package gateway

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

// A small, safe git manager for the WebUI agent sidebar. It runs a fixed set of
// git subcommands inside a validated work tree — no shell, so there is no
// interpolation risk — and returns structured status/log for the panel.
//
// Unlike the other agent routes this one runs in the *Core* process and talks
// straight to the host filesystem, so it carries its own authorization: the
// path must resolve inside a configured workspace root, and every subcommand is
// denied the config-driven execution surface a repository controls.
//
// GET  /api/agent/git?path=<dir>&action=status|log|branches|diff[&file=&staged=1]
// POST /api/agent/git {path, action: init|stage|unstage|discard|commit, files:[], message}

const (
	gitTimeout = 20 * time.Second
	// `git diff` over a large or vendored tree is unbounded. runGit buffers its
	// output in memory and the handler hands it back as one JSON string, so an
	// unbounded diff is both an allocation spike and a response-size spike.
	maxDiffBytes = 8 << 20
	// stderr only ever carries git's own diagnostics; the interesting part of a
	// failure is the first few lines.
	maxStderrBytes = 8 << 10
	// A single argv element above MAX_ARG_STRLEN (128 KiB on Linux, 32767 chars
	// on Windows) makes execve fail with an opaque "argument list too long"
	// that surfaces to the UI as a git error.
	maxPathspecLen = 8 << 10
)

var (
	errNoPath       = errors.New("path is required")
	errNotDir       = errors.New("path is not a directory")
	errNotRepo      = errors.New("not a git repository")
	errBadAct       = errors.New("unknown git action")
	errOutsideRoots = errors.New("path is outside the configured agent workspace roots")
)

// gitFile mirrors one `git status --porcelain -z` entry.
type gitFile struct {
	Path     string `json:"path"`
	Index    string `json:"index"`
	Worktree string `json:"worktree"`
	Staged   bool   `json:"staged"`
}

// gitCommit mirrors one `git log` line.
type gitCommit struct {
	Hash    string `json:"hash"`
	Author  string `json:"author"`
	Date    string `json:"date"`
	Subject string `json:"subject"`
}

// gitHookScratch is a guaranteed-empty directory used to neutralise
// core.hooksPath. This is the only portable way to disable hooks: --no-verify
// skips only pre-commit and commit-msg (post-commit still runs), and an empty
// config value makes git fall back to .git/hooks.
var gitHookScratch = sync.OnceValue(func() string {
	dir, err := os.MkdirTemp("", "0kay-git-hooks-")
	if err != nil {
		// A path that cannot be a hooks directory is still a safe fallback: git
		// finds nothing to run at it.
		return os.DevNull
	}
	return dir
})

// gitCommand builds a git invocation in dir with the repository-controlled
// execution surface disabled.
//
// A repository the user merely cloned can run code as the Core process user:
// `.git/hooks/*` on `git commit`, and `.git/config`'s diff.external plus
// `.gitattributes`' textconv filters on `git diff`. `--no-verify` does not cover
// this (post-commit still fires), so the switches are prepended once here
// instead of being remembered at each call site.
func gitCommand(ctx context.Context, dir string, args ...string) *exec.Cmd {
	hardened := []string{
		"--no-pager",
		"-c", "core.hooksPath=" + gitHookScratch(),
		"-c", "diff.external=",
		"-c", "diff.trustExitCode=false",
		"-c", "protocol.ext.allow=never",
		// Without this, non-ASCII paths are C-style-quoted in porcelain output
		// and cannot be fed back into stage/unstage/discard.
		"-c", "core.quotepath=false",
	}
	cmd := exec.CommandContext(ctx, "git", append(hardened, args...)...)
	cmd.Dir = dir
	cmd.Env = append(os.Environ(),
		"GIT_TERMINAL_PROMPT=0", // never block waiting on an auth prompt
		"GIT_OPTIONAL_LOCKS=0",  // read-only queries must not take the index lock
		"GIT_PAGER=cat",
	)
	return cmd
}

// capBuffer collects up to limit bytes and records whether it dropped the rest.
type capBuffer struct {
	buf       bytes.Buffer
	limit     int64
	truncated bool
}

func (c *capBuffer) Write(p []byte) (int, error) {
	remaining := c.limit - int64(c.buf.Len())
	if remaining <= 0 {
		c.truncated = true
		return len(p), nil
	}
	if int64(len(p)) > remaining {
		c.buf.Write(p[:remaining])
		c.truncated = true
		return len(p), nil
	}
	return c.buf.Write(p)
}

func (c *capBuffer) String() string { return c.buf.String() }

// runGit runs a git subcommand in dir with a bounded deadline and output size.
func runGit(ctx context.Context, dir string, args ...string) (string, error) {
	return runGitCapped(ctx, dir, maxDiffBytes, false, args...)
}

// runGitCapped bounds a subcommand's stdout. `notice` appends a truncation marker,
// which only the diff call site wants: appending it unconditionally would turn
// into a bogus file path inside `git status --porcelain` output (which the panel
// feeds straight back into stage/unstage/discard) and into a commit email from
// `git config user.email`.
func runGitCapped(ctx context.Context, dir string, limit int64, notice bool, args ...string) (string, error) {
	cmd := gitCommand(ctx, dir, args...)
	var stdout, stderr capBuffer
	stdout.limit, stderr.limit = limit, maxStderrBytes
	cmd.Stdout, cmd.Stderr = &stdout, &stderr
	err := cmd.Run()
	if err != nil {
		// Surface git's own message rather than "exit status 128" — this text is
		// what the WebUI shows the user.
		if msg := strings.TrimSpace(stderr.String()); msg != "" {
			return msg, err
		}
		return stdout.String(), err
	}
	out := stdout.String()
	if notice && stdout.truncated {
		out += fmt.Sprintf("\n--- output truncated at %d bytes; narrow the request (-- file) ---", limit)
	}
	return out, nil
}

// agentWorkspaceRoots returns the directories the git manager may operate in.
//
// AGENT_WORKSPACE_ROOTS is the same variable the agent's own workspace policy uses
// (agent/src/workspace/paths.ts), so the two must agree or the file browser would
// allow a path the git panel refuses. That implementation:
//
//   - splits on COMMA (not filepath.SplitList, which is `;` on Windows and `:` on
//     POSIX — a documented comma list arrived here as one bogus root and every
//     request 403'd), and
//   - defaults to [cwd, homedir, tmpdir], not cwd alone.
//
// Core runs from a different directory than the agent (start-0kay.sh cds into
// core/ and agent/ separately), so a cwd-only default rejects the agent's own
// home-directory workspaces outright. Both separators are accepted here so a
// value written for either reader works.
// projectRootCache memoizes the git top level of cwd. Keyed by cwd so a test
// that changes directory does not read another test's answer.
var projectRootCache = struct {
	sync.Mutex
	cwd string
	val string
}{}

// projectRoot returns the git top level that contains cwd, or "" when cwd is
// not inside a repository.
//
// The default root set used to be cwd alone (plus home and temp), but every
// 0KAY service is launched from its own subdirectory — start-0kay.sh cds into
// core/ and agent/ separately — so cwd is <repo>/core and the repository the
// user is actually editing sits *outside* its own allowed roots. Every git call
// for the project then failed with "path is outside the configured agent
// workspace roots", and validRepoDir's top-level re-check rejected even a path
// that was itself inside a root (the top level is the parent). Adding the
// containing repository makes the default set match what the UI calls a
// workspace.
func projectRoot() string {
	cwd, err := os.Getwd()
	if err != nil {
		return ""
	}
	projectRootCache.Lock()
	defer projectRootCache.Unlock()
	if projectRootCache.cwd == cwd {
		return projectRootCache.val
	}
	val := ""
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if out, err := runGit(ctx, cwd, "rev-parse", "--show-toplevel"); err == nil {
		val = strings.TrimSpace(out)
	}
	projectRootCache.cwd, projectRootCache.val = cwd, val
	return val
}

// extraWorkspaceRoots reads the operator allow-list from Settings → 工作区.
//
// The workspace picker in the agent page browses the whole filesystem, so
// choosing a project on another drive is a normal thing to do — but the default
// root set only covers cwd, the containing repository, home and temp, and the
// git panel then 403s on a directory the user just picked. This setting is the
// supported way to widen the set without touching the environment.
//
// Comma or newline separated, so a pasted multi-line list also works.
func (g *Gateway) extraWorkspaceRoots() []string {
	if g == nil || g.settingsStore == nil {
		return nil
	}
	raw, _ := g.settingsStore.GetValues("workspace")["allowed_roots"].(string)
	if strings.TrimSpace(raw) == "" {
		return nil
	}
	fields := strings.FieldsFunc(raw, func(r rune) bool { return r == ',' || r == '\n' || r == '\r' })
	out := make([]string, 0, len(fields))
	for _, field := range fields {
		if value := strings.TrimSpace(field); value != "" {
			out = append(out, value)
		}
	}
	return out
}

func (g *Gateway) agentWorkspaceRoots() []string {
	var roots []string
	seen := map[string]bool{}
	add := func(value string) {
		value = strings.TrimSpace(value)
		if value == "" {
			return
		}
		if abs, err := filepath.Abs(value); err == nil {
			value = abs
		}
		key := strings.ToLower(value)
		if !seen[key] {
			seen[key] = true
			roots = append(roots, value)
		}
	}

	if raw := strings.TrimSpace(os.Getenv("AGENT_WORKSPACE_ROOTS")); raw != "" {
		for _, part := range strings.Split(raw, ",") {
			add(part)
		}
		// Also accept the platform path separator, so a value written for a
		// filepath.SplitList reader is not silently read as one root.
		if len(roots) == 1 {
			for _, part := range filepath.SplitList(raw) {
				add(part)
			}
		}
	} else {
		// Same default triple as the agent's policy, so the two front-ends never
		// disagree about what a workspace is — plus the repository cwd belongs to,
		// because each service runs from its own subdirectory (see projectRoot).
		if cwd, err := os.Getwd(); err == nil {
			add(cwd)
		}
		if top := projectRoot(); top != "" {
			add(top)
		}
		if home, err := os.UserHomeDir(); err == nil {
			add(home)
		}
		add(os.TempDir())
	}

	// Operator-added roots apply in both modes: they widen the set rather than
	// replace it, so a configured environment list is not silently extended.
	for _, part := range g.extraWorkspaceRoots() {
		add(part)
	}
	return roots
}

// resolvePath canonicalizes p for containment checks: absolute, with symlinks
// resolved, so a symlink planted inside an allowed root cannot escape it.
func resolvePath(p string) (string, error) {
	abs, err := filepath.Abs(p)
	if err != nil {
		return "", err
	}
	return filepath.EvalSymlinks(abs)
}

// withinRoots reports whether abs is one of roots or lives beneath one of them.
func withinRoots(abs string, roots []string) bool {
	for _, root := range roots {
		resolved, err := resolvePath(root)
		if err != nil {
			continue
		}
		if abs == resolved || strings.HasPrefix(abs, resolved+string(filepath.Separator)) {
			return true
		}
	}
	return false
}

// outsideRootsErr names the roots that were actually checked. A bare "outside
// the configured roots" is unactionable: the operator cannot tell whether the
// path is wrong or the root set is, and the default set is not what most people
// guess (cwd + home + temp + the containing repository).
func outsideRootsErr(roots []string) error {
	if len(roots) == 0 {
		return errOutsideRoots
	}
	return fmt.Errorf("%w: allowed roots are %s — set AGENT_WORKSPACE_ROOTS to add one", errOutsideRoots, strings.Join(roots, ", "))
}

// validDir normalizes dir, confirms it is an existing directory, and confirms it
// resolves inside a configured workspace root.
func (g *Gateway) validDir(dir string) (string, error) {
	if strings.TrimSpace(dir) == "" {
		return "", errNoPath
	}
	abs, err := resolvePath(dir)
	if err != nil {
		return "", errNotDir
	}
	info, err := os.Stat(abs)
	if err != nil || !info.IsDir() {
		return "", errNotDir
	}
	roots := g.agentWorkspaceRoots()
	if len(roots) == 0 || !withinRoots(abs, roots) {
		return "", outsideRootsErr(roots)
	}
	return abs, nil
}

// validRepoDir normalizes dir, confirms it is an allowed work tree, and returns
// the repository TOP LEVEL.
//
// It must be the top level, not the requested directory. `git status --porcelain`
// always prints paths relative to the repository root regardless of the working
// directory, so returning a subdirectory would hand the WebUI paths rooted at the
// repo top while every mutating subcommand resolved its pathspec against the
// subdirectory — "pathspec did not match", or worse, the wrong file.
func (g *Gateway) validRepoDir(ctx context.Context, dir string) (string, error) {
	abs, err := g.validDir(dir)
	if err != nil {
		return "", err
	}
	if out, err := runGit(ctx, abs, "rev-parse", "--is-inside-work-tree"); err != nil || strings.TrimSpace(out) != "true" {
		return "", errNotRepo
	}
	top, err := runGit(ctx, abs, "rev-parse", "--show-toplevel")
	if err != nil || strings.TrimSpace(top) == "" {
		// A work tree without a top level is a bare repo or a submodule mount
		// point; fall back to the requested directory rather than refusing.
		return abs, nil
	}
	resolved, err := resolvePath(strings.TrimSpace(top))
	if err != nil {
		return abs, nil
	}
	// The top level must itself be allowed: it can differ from the directory the
	// caller named only by being an ancestor, but re-checking keeps the
	// invariant that everything git touches is inside a configured root.
	if roots := g.agentWorkspaceRoots(); len(roots) == 0 || !withinRoots(resolved, roots) {
		return "", outsideRootsErr(roots)
	}
	return resolved, nil
}

// validatePaths rejects pathspecs git could never accept as a single argv
// element, so the caller gets a clear 400 instead of an exec failure.
func validatePaths(files []string) error {
	for _, f := range files {
		if strings.TrimSpace(f) == "" {
			return errors.New("empty pathspec")
		}
		if len(f) > maxPathspecLen {
			return errors.New("pathspec is too long")
		}
	}
	return nil
}

// writeGitPathErr writes the path/repo error envelope. A non-repo gets its own
// stable code so the WebUI can offer a one-click `git init`; a path outside the
// workspace roots is a 403 and must not be confused with "no repository here".
func writeGitPathErr(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, errNotRepo):
		writeErr(w, http.StatusBadRequest, "not_a_repo", err.Error())
	case errors.Is(err, errOutsideRoots):
		writeErr(w, http.StatusForbidden, "git_forbidden", err.Error())
	default:
		writeErr(w, http.StatusBadRequest, "git_path", err.Error())
	}
}

// isStaged reports whether the index column means "this change is in the index".
func isStaged(index, worktree byte) bool {
	if index == '?' || index == '!' {
		return false
	}
	// Merge conflicts occupy both columns and are never committable as they
	// stand; reporting them as staged would invite committing conflict markers.
	if index == 'U' || worktree == 'U' || (index == 'A' && worktree == 'A') || (index == 'D' && worktree == 'D') {
		return false
	}
	return index != ' '
}

// parsePorcelain decodes `git status --porcelain -z`.
//
// The NUL form is what makes the panel usable with non-ASCII paths: the newline
// form C-style-quotes them, so the UI would display "src/\346\226\207/…" and
// could not feed that string back to git. Rename and copy entries are followed
// by a second NUL-terminated field holding the source path.
func parsePorcelain(out string) []gitFile {
	fields := strings.Split(out, "\x00")
	files := make([]gitFile, 0, len(fields))
	for i := 0; i < len(fields); i++ {
		entry := fields[i]
		if len(entry) < 4 {
			continue
		}
		index, worktree := entry[0], entry[1]
		path := strings.TrimPrefix(entry[3:], " ")
		if index == 'R' || index == 'C' {
			i++ // skip the rename/copy source field
		}
		files = append(files, gitFile{
			Path:     path,
			Index:    string(index),
			Worktree: string(worktree),
			Staged:   isStaged(index, worktree),
		})
	}
	return files
}

// parseLog decodes `git log --pretty=format:...%x00`. NUL is the separator
// because it cannot appear in a commit subject, so an author or subject
// containing the previous \x1f delimiter can no longer shift every field.
func parseLog(out string) []gitCommit {
	fields := strings.Split(strings.Trim(out, "\x00"), "\x00")
	commits := make([]gitCommit, 0, len(fields)/4)
	for i := 0; i+3 < len(fields); i += 4 {
		hash, author, date, subject := fields[i], fields[i+1], fields[i+2], fields[i+3]
		if strings.TrimSpace(hash) == "" {
			continue
		}
		commits = append(commits, gitCommit{Hash: hash, Author: author, Date: date, Subject: subject})
	}
	return commits
}

// gitIdentity reports the effective commit identity, falling back to a local
// default (override with OKAY_GIT_AUTHOR_NAME / OKAY_GIT_AUTHOR_EMAIL) when git
// has none configured — otherwise `git commit` fails on a fresh machine.
func gitIdentity(ctx context.Context, repo string) (name, email string, configured bool) {
	if out, err := runGit(ctx, repo, "config", "user.email"); err == nil && strings.TrimSpace(out) != "" {
		n, _ := runGit(ctx, repo, "config", "user.name")
		return strings.TrimSpace(n), strings.TrimSpace(out), true
	}
	name = strings.TrimSpace(os.Getenv("OKAY_GIT_AUTHOR_NAME"))
	if name == "" {
		name = "0KAY"
	}
	email = strings.TrimSpace(os.Getenv("OKAY_GIT_AUTHOR_EMAIL"))
	if email == "" {
		email = "0kay@localhost"
	}
	return name, email, false
}

// gitStatusPayload returns {root, branch, files} for the panel. A failing
// `git status` is reported instead of rendered as an empty change list, which
// the panel would otherwise show as "all clean" during an error.
func gitStatusPayload(ctx context.Context, repo string) (map[string]interface{}, error) {
	// `branch --show-current` works on an unborn branch (a repo with no commits),
	// where `rev-parse --abbrev-ref HEAD` would return a fatal error instead.
	branch, _ := runGit(ctx, repo, "branch", "--show-current")
	porcelain, err := runGit(ctx, repo, "status", "--porcelain", "-z")
	if err != nil {
		return nil, err
	}
	return map[string]interface{}{
		"root":   repo,
		"branch": strings.TrimSpace(branch),
		"files":  parsePorcelain(porcelain),
	}, nil
}

// writeGitStatus renders the status payload or the git error behind it.
func writeGitStatus(w http.ResponseWriter, ctx context.Context, repo string) {
	payload, err := gitStatusPayload(ctx, repo)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "git_failed", "git status failed")
		return
	}
	writeJSON(w, http.StatusOK, payload)
}

// partitionTracked splits files into the ones the index already knows and the
// ones it does not. `git restore` fails its whole batch when any pathspec is
// unknown to the index, which is why an untracked file cannot simply be added
// to the list — it would take the entire request down with it.
func partitionTracked(ctx context.Context, repo string, files []string) (tracked, untracked []string) {
	out, err := runGit(ctx, repo, append([]string{"ls-files", "-z", "--"}, files...)...)
	if err != nil {
		// Cannot tell; let `restore` report the real error on the full batch.
		return files, nil
	}
	known := make(map[string]bool)
	for _, p := range strings.Split(out, "\x00") {
		if p != "" {
			known[p] = true
		}
	}
	for _, f := range files {
		if known[f] {
			tracked = append(tracked, f)
		} else {
			untracked = append(untracked, f)
		}
	}
	return tracked, untracked
}

func (g *Gateway) handleAgentGit(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		g.handleAgentGitGet(w, r)
	case http.MethodPost:
		g.handleAgentGitPost(w, r)
	default:
		allowMethod(w, r, http.MethodGet, http.MethodPost)
	}
}

func (g *Gateway) handleAgentGitGet(w http.ResponseWriter, r *http.Request) {
	// One budget for the whole request: validating the work tree runs a
	// `git rev-parse`, and the action below runs at least one more subcommand.
	ctx, cancel := context.WithTimeout(r.Context(), gitTimeout)
	defer cancel()
	repo, err := g.validRepoDir(ctx, r.URL.Query().Get("path"))
	if err != nil {
		writeGitPathErr(w, err)
		return
	}
	switch action := r.URL.Query().Get("action"); action {
	case "", "status":
		writeGitStatus(w, ctx, repo)
	case "log":
		out, err := runGit(ctx, repo, "log", "-n", "30", "--date=short", "--pretty=format:%h%x00%an%x00%ad%x00%s%x00")
		if err != nil {
			// Only an unborn branch is a legitimate empty list. A corrupt object
			// store or an unreadable repository is a failure and must not be
			// reported as "no commits yet".
			if !strings.Contains(out, "does not have any commits yet") {
				writeErr(w, http.StatusBadRequest, "git_failed", strings.TrimSpace(out))
				return
			}
			writeJSON(w, http.StatusOK, map[string]interface{}{"commits": []gitCommit{}})
			return
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{"commits": parseLog(out)})
	case "branches":
		out, err := runGit(ctx, repo, "branch", "--format=%(refname:short)")
		if err != nil {
			writeErr(w, http.StatusBadRequest, "git_failed", "git branch failed")
			return
		}
		branches := []string{}
		for _, line := range strings.Split(out, "\n") {
			if trimmed := strings.TrimSpace(line); trimmed != "" {
				branches = append(branches, trimmed)
			}
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{"branches": branches})
	case "diff":
		// --no-ext-diff/--no-textconv repeat the config-level switches as
		// command-line flags: authoritative even if a future refactor drops
		// gitHardenArgs.
		args := []string{"diff", "--no-color", "--no-ext-diff", "--no-textconv"}
		if r.URL.Query().Get("staged") == "1" {
			args = append(args, "--cached")
		}
		file := r.URL.Query().Get("file")
		if file != "" {
			// The GET pathspec is just as much an argv element as a POST one, and
			// an over-long value fails execve with an opaque "argument list too
			// long" that would surface to the user as a git error.
			if err := validatePaths([]string{file}); err != nil {
				badRequest(w, err.Error())
				return
			}
			args = append(args, "--", file)
		}
		out, err := runGitCapped(ctx, repo, maxDiffBytes, true, args...)
		if err != nil {
			// Same envelope as every other git failure here. upstreamError would
			// report a purely local failure as HTTP 502 with a raw stderr body,
			// which the WebUI's error mapping does not recognise.
			writeErr(w, http.StatusBadRequest, "git_failed", strings.TrimSpace(out))
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{"diff": out})
	default:
		writeErr(w, http.StatusBadRequest, "git_action", errBadAct.Error())
	}
}

func (g *Gateway) handleAgentGitPost(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Path    string   `json:"path"`
		Action  string   `json:"action"`
		Files   []string `json:"files"`
		Message string   `json:"message"`
		Amend   bool     `json:"amend"`
	}
	if !decodeBody(w, r, &body, maxTaskBody) {
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), gitTimeout)
	defer cancel()

	// `init` is the one action allowed outside an existing repo, so the WebUI can
	// turn a plain folder into a repository in one click. It is still confined to
	// a workspace root.
	if body.Action == "init" {
		dir, err := g.validDir(body.Path)
		if err != nil {
			writeGitPathErr(w, err)
			return
		}
		if out, err := runGit(ctx, dir, "init"); err != nil {
			writeErr(w, http.StatusBadRequest, "git_failed", strings.TrimSpace(out))
			return
		}
		writeGitStatus(w, ctx, dir)
		return
	}

	repo, err := g.validRepoDir(ctx, body.Path)
	if err != nil {
		writeGitPathErr(w, err)
		return
	}

	switch body.Action {
	case "stage", "unstage", "discard":
		if len(body.Files) == 0 {
			badRequest(w, "no files to "+body.Action)
			return
		}
		if err := validatePaths(body.Files); err != nil {
			badRequest(w, err.Error())
			return
		}
	}
	switch body.Action {
	case "stage":
		if out, err := runGit(ctx, repo, append([]string{"add", "--"}, body.Files...)...); err != nil {
			writeErr(w, http.StatusBadRequest, "git_failed", strings.TrimSpace(out))
			return
		}
	case "unstage":
		if out, err := runGit(ctx, repo, append([]string{"restore", "--staged", "--"}, body.Files...)...); err != nil {
			// Older git (< 2.23) has no `restore`; fall back to `reset`.
			if out2, err2 := runGit(ctx, repo, append([]string{"reset", "HEAD", "--"}, body.Files...)...); err2 != nil {
				writeErr(w, http.StatusBadRequest, "git_failed", strings.TrimSpace(out+"\n"+out2))
				return
			}
		}
	case "discard":
		// Revert working-tree changes to the given files (destructive; the WebUI
		// confirms first). Tracked paths go through `git restore`; untracked ones
		// have to go through `git clean -f`, which cannot recurse into a
		// directory without -d and so cannot silently delete a whole tree.
		tracked, untracked := partitionTracked(ctx, repo, body.Files)
		if len(tracked) > 0 {
			if out, err := runGit(ctx, repo, append([]string{"restore", "--worktree", "--"}, tracked...)...); err != nil {
				if out2, err2 := runGit(ctx, repo, append([]string{"checkout", "--"}, tracked...)...); err2 != nil {
					writeErr(w, http.StatusBadRequest, "git_failed", strings.TrimSpace(out+"\n"+out2))
					return
				}
			}
		}
		if len(untracked) > 0 {
			if out, err := runGit(ctx, repo, append([]string{"clean", "-f", "--"}, untracked...)...); err != nil {
				writeErr(w, http.StatusBadRequest, "git_failed", strings.TrimSpace(out))
				return
			}
		}
	case "commit":
		message := strings.TrimSpace(body.Message)
		if message == "" {
			badRequest(w, "empty commit message")
			return
		}
		args := []string{}
		// Prepend a fallback identity only when git has none configured, so an
		// existing global/local identity is respected.
		if name, email, ok := gitIdentity(ctx, repo); !ok {
			args = append(args, "-c", "user.name="+name, "-c", "user.email="+email)
		}
		args = append(args, "commit", "-m", message)
		if body.Amend {
			args = append(args, "--amend")
		}
		if out, err := runGit(ctx, repo, args...); err != nil {
			writeErr(w, http.StatusBadRequest, "git_commit", strings.TrimSpace(out))
			return
		}
	default:
		writeErr(w, http.StatusBadRequest, "git_action", errBadAct.Error())
		return
	}
	writeGitStatus(w, ctx, repo)
}
