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

const (
	gitTimeout     = 20 * time.Second
	maxDiffBytes   = 8 << 20
	maxStderrBytes = 8 << 10
	maxPathspecLen = 8 << 10
)

var (
	errNoPath       = errors.New("path is required")
	errNotDir       = errors.New("path is not a directory")
	errNotRepo      = errors.New("not a git repository")
	errBadAct       = errors.New("unknown git action")
	errOutsideRoots = errors.New("path is outside the configured agent workspace roots")
)

type gitFile struct {
	Path     string `json:"path"`
	Index    string `json:"index"`
	Worktree string `json:"worktree"`
	Staged   bool   `json:"staged"`
}

type gitCommit struct {
	Hash    string `json:"hash"`
	Author  string `json:"author"`
	Date    string `json:"date"`
	Subject string `json:"subject"`
}

var gitHookScratch = sync.OnceValue(func() string {
	dir, err := os.MkdirTemp("", "0kay-git-hooks-")
	if err != nil {
		return os.DevNull
	}
	return dir
})

func gitCommand(ctx context.Context, dir string, args ...string) *exec.Cmd {
	hardened := []string{
		"--no-pager",
		"-c", "core.hooksPath=" + gitHookScratch(),
		"-c", "diff.external=",
		"-c", "diff.trustExitCode=false",
		"-c", "protocol.ext.allow=never",
		"-c", "core.quotepath=false",
	}
	cmd := exec.CommandContext(ctx, "git", append(hardened, args...)...)
	cmd.Dir = dir
	cmd.Env = append(os.Environ(),
		"GIT_TERMINAL_PROMPT=0",
		"GIT_OPTIONAL_LOCKS=0",
		"GIT_PAGER=cat",
	)
	return cmd
}

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

func runGit(ctx context.Context, dir string, args ...string) (string, error) {
	return runGitCapped(ctx, dir, maxDiffBytes, false, args...)
}

func runGitCapped(ctx context.Context, dir string, limit int64, notice bool, args ...string) (string, error) {
	cmd := gitCommand(ctx, dir, args...)
	var stdout, stderr capBuffer
	stdout.limit, stderr.limit = limit, maxStderrBytes
	cmd.Stdout, cmd.Stderr = &stdout, &stderr
	err := cmd.Run()
	if err != nil {
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

var projectRootCache = struct {
	sync.Mutex
	cwd string
	val string
}{}

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
		if len(roots) == 1 {
			for _, part := range filepath.SplitList(raw) {
				add(part)
			}
		}
	} else {
		// Default roots stay anchored to the gateway process working
		// directory (and its repository top level). $HOME and the system
		// temp dir are deliberately NOT defaults — they would expose the
		// entire user profile to git operations. Set AGENT_WORKSPACE_ROOTS
		// (or the workspace.allowed_roots setting) to widen the scope.
		if cwd, err := os.Getwd(); err == nil {
			add(cwd)
		}
		if top := projectRoot(); top != "" {
			add(top)
		}
	}

	for _, part := range g.extraWorkspaceRoots() {
		add(part)
	}
	return roots
}

func resolvePath(p string) (string, error) {
	abs, err := filepath.Abs(p)
	if err != nil {
		return "", err
	}
	return filepath.EvalSymlinks(abs)
}

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

func outsideRootsErr(roots []string) error {
	if len(roots) == 0 {
		return errOutsideRoots
	}
	return fmt.Errorf("%w: allowed roots are %s — set AGENT_WORKSPACE_ROOTS to add one", errOutsideRoots, strings.Join(roots, ", "))
}

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
		return abs, nil
	}
	resolved, err := resolvePath(strings.TrimSpace(top))
	if err != nil {
		return abs, nil
	}
	if roots := g.agentWorkspaceRoots(); len(roots) == 0 || !withinRoots(resolved, roots) {
		return "", outsideRootsErr(roots)
	}
	return resolved, nil
}

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

func isStaged(index, worktree byte) bool {
	if index == '?' || index == '!' {
		return false
	}
	if index == 'U' || worktree == 'U' || (index == 'A' && worktree == 'A') || (index == 'D' && worktree == 'D') {
		return false
	}
	return index != ' '
}

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
			i++
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

func gitStatusPayload(ctx context.Context, repo string) (map[string]interface{}, error) {
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

func writeGitStatus(w http.ResponseWriter, ctx context.Context, repo string) {
	payload, err := gitStatusPayload(ctx, repo)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "git_failed", "git status failed")
		return
	}
	writeJSON(w, http.StatusOK, payload)
}

func partitionTracked(ctx context.Context, repo string, files []string) (tracked, untracked []string) {
	out, err := runGit(ctx, repo, append([]string{"ls-files", "-z", "--"}, files...)...)
	if err != nil {
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
		args := []string{"diff", "--no-color", "--no-ext-diff", "--no-textconv"}
		if r.URL.Query().Get("staged") == "1" {
			args = append(args, "--cached")
		}
		file := r.URL.Query().Get("file")
		if file != "" {
			if err := validatePaths([]string{file}); err != nil {
				badRequest(w, err.Error())
				return
			}
			args = append(args, "--", file)
		}
		out, err := runGitCapped(ctx, repo, maxDiffBytes, true, args...)
		if err != nil {
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
			if out2, err2 := runGit(ctx, repo, append([]string{"reset", "HEAD", "--"}, body.Files...)...); err2 != nil {
				writeErr(w, http.StatusBadRequest, "git_failed", strings.TrimSpace(out+"\n"+out2))
				return
			}
		}
	case "discard":
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
