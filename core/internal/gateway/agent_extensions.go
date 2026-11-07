package gateway

import (
	"archive/zip"
	"bytes"
	"compress/gzip"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"time"

	"0kay/core/internal/pairing"
	agentv1 "0kay/gen/agent/v1"
)

/*
Agent extension plugins.

These are not the same thing as a Core plugin: a Core plugin is a process that
speaks gRPC and adds tools to the platform. An extension changes the agent's own
behaviour — its prompt, its rules, the tools it can see — and lives as a
directory on disk. Installing one is therefore a file copy, not a service.

Core owns the directory because that is where the operator already looks for
things, and because the agent may be running on another machine.
*/

// extensionDir is where agent extensions live, next to the rest of Core's data.
//
// Always absolute: the agent runs with its own working directory, so a relative
// "data/extensions" would resolve to a different place in the agent process and
// the plugins would look installed but never load.
func (g *Gateway) extensionDir() string {
	if dir := strings.TrimSpace(os.Getenv("CORE_EXTENSIONS_DIR")); dir != "" {
		if abs, err := filepath.Abs(dir); err == nil {
			return abs
		}
		return dir
	}
	dataDir := strings.TrimSpace(os.Getenv("CORE_DATA_DIR"))
	if dataDir == "" {
		dataDir = "data"
	}
	dataDir, err := filepath.Abs(dataDir)
	if err != nil {
		return filepath.Join("data", "extensions")
	}
	return filepath.Join(dataDir, "extensions")
}

var extensionNamePattern = regexp.MustCompile(`^[a-z0-9][a-z0-9._-]*$`)

// handleExtensions lists what is installed. Enabling is a separate call because
// reading a directory must never be the thing that loads code.
func (g *Gateway) handleExtensions(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	dir := g.extensionDir()
	type entry struct {
		Name        string          `json:"name"`
		Title       string          `json:"title,omitempty"`
		Version     string          `json:"version,omitempty"`
		Description string          `json:"description,omitempty"`
		Author      string          `json:"author,omitempty"`
		Entry       string          `json:"entry,omitempty"`
		Permissions []string        `json:"permissions,omitempty"`
		Behaviour   json.RawMessage `json:"behaviour,omitempty"`
		Enabled     bool            `json:"enabled"`
		Dir         string          `json:"dir"`
		// Problem is why this directory is not usable. The row still appears, so
		// a broken plugin is visible instead of silently absent.
		Problem string `json:"problem,omitempty"`
	}
	enabled := g.enabledExtensions()
	items := []entry{}
	entries, err := os.ReadDir(dir)
	if err == nil {
		for _, item := range entries {
			if !item.IsDir() || strings.HasPrefix(item.Name(), ".") {
				continue
			}
			full := filepath.Join(dir, item.Name())
			manifestPath := filepath.Join(full, "manifest.json")
			raw, readErr := os.ReadFile(manifestPath)
			if readErr != nil {
				items = append(items, entry{Name: item.Name(), Dir: full, Problem: "missing manifest.json"})
				continue
			}
			var manifest struct {
				Name        string          `json:"name"`
				Title       string          `json:"title"`
				Version     string          `json:"version"`
				Description string          `json:"description"`
				Author      string          `json:"author"`
				Entry       string          `json:"entry"`
				Permissions []string        `json:"permissions"`
				Behaviour   json.RawMessage `json:"behaviour"`
			}
			if parseErr := json.Unmarshal(raw, &manifest); parseErr != nil {
				items = append(items, entry{Name: item.Name(), Dir: full, Problem: "manifest.json is not valid JSON"})
				continue
			}
			name := manifest.Name
			if name == "" {
				name = item.Name()
			}
			items = append(items, entry{
				Name:        name,
				Title:       manifest.Title,
				Version:     manifest.Version,
				Description: manifest.Description,
				Author:      manifest.Author,
				Entry:       manifest.Entry,
				Permissions: manifest.Permissions,
				Behaviour:   manifest.Behaviour,
				Dir:         full,
				Enabled:     len(enabled) == 0 || enabled[name],
			})
		}
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"dir":        dir,
		"extensions": items,
		// An empty list means "everything found is on", which is what a fresh
		// install has; the UI says so rather than implying nothing is enabled.
		"explicit": len(enabled) > 0,
	})
}

// enabledExtensions returns the explicit allow-list. Empty means "all".
func (g *Gateway) enabledExtensions() map[string]bool {
	out := map[string]bool{}
	raw, err := os.ReadFile(filepath.Join(g.extensionDir(), "enabled.json"))
	if err != nil {
		return out
	}
	var names []string
	if json.Unmarshal(raw, &names) != nil {
		return out
	}
	for _, name := range names {
		if name = strings.TrimSpace(name); name != "" {
			out[name] = true
		}
	}
	return out
}

func (g *Gateway) writeEnabledExtensions(names []string) error {
	dir := g.extensionDir()
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return err
	}
	if names == nil {
		names = []string{}
	}
	raw, err := json.MarshalIndent(names, "", "  ")
	if err != nil {
		return err
	}
	// Write-then-rename: a crash mid-write must not leave a partial JSON that
	// silently disables every plugin on the next start.
	tmp := filepath.Join(dir, "enabled.json.tmp")
	if err := os.WriteFile(tmp, append(raw, '\n'), 0o644); err != nil {
		return err
	}
	return os.Rename(tmp, filepath.Join(dir, "enabled.json"))
}

// handleExtensionsEnable turns a plugin on or off and tells the agent to
// re-read its directory, so the change applies to the next task.
func (g *Gateway) handleExtensionsEnable(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var body struct {
		Name    string `json:"name"`
		Enabled *bool  `json:"enabled"`
		// All replaces the list wholesale, which is what the settings page sends.
		All *[]string `json:"all"`
		// Reset clears the allow-list so everything installed is on.
		Reset bool `json:"reset"`
	}
	if err := json.NewDecoder(io.LimitReader(r.Body, 1<<20)).Decode(&body); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_request", "invalid JSON body")
		return
	}

	current := g.enabledExtensions()
	all := g.listExtensionNames()

	var next []string
	switch {
	case body.Reset:
		next = nil
	case body.All != nil:
		seen := map[string]bool{}
		for _, name := range *body.All {
			if name = strings.TrimSpace(name); name != "" && !seen[name] {
				seen[name] = true
				next = append(next, name)
			}
		}
	default:
		name := strings.TrimSpace(body.Name)
		if !extensionNamePattern.MatchString(name) || body.Enabled == nil {
			writeErr(w, http.StatusBadRequest, "invalid_request", "name and enabled are required")
			return
		}
		if len(current) == 0 {
			// First explicit toggle: everything currently installed was on.
			for _, existing := range all {
				if existing != name {
					next = append(next, existing)
				}
			}
			if *body.Enabled {
				next = append(next, name)
			}
		} else {
			for _, existing := range all {
				if existing == name {
					if *body.Enabled {
						next = append(next, existing)
					}
					continue
				}
				if current[existing] {
					next = append(next, existing)
				}
			}
		}
	}

	if err := g.writeEnabledExtensions(next); err != nil {
		writeErr(w, http.StatusInternalServerError, "write_failed", err.Error())
		return
	}
	loaded := g.reloadAgentExtensions(r.Context())
	g.respondExtensions(w, next, loaded)
}

// handleExtensionsInstall copies a plugin directory into place.
//
// The body is either {"path": "..."} for a local directory the operator already
// has, or {"archive": "<base64 zip>"} from an upload. Both end the same way: a
// directory named after the manifest, and no half-installed copies.
func (g *Gateway) handleExtensionsInstall(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var body struct {
		Path    string `json:"path"`
		Archive string `json:"archive"`
		Replace bool   `json:"replace"`
	}
	if err := json.NewDecoder(io.LimitReader(r.Body, 64<<20)).Decode(&body); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_request", "invalid JSON body")
		return
	}
	dir := g.extensionDir()
	if err := os.MkdirAll(dir, 0o755); err != nil {
		writeErr(w, http.StatusInternalServerError, "write_failed", err.Error())
		return
	}

	var source string
	cleanup := func() {}
	switch {
	case strings.TrimSpace(body.Path) != "":
		source = strings.TrimSpace(body.Path)
		info, err := os.Stat(source)
		if err != nil || !info.IsDir() {
			writeErr(w, http.StatusBadRequest, "not_found", "path is not a directory")
			return
		}
	case strings.TrimSpace(body.Archive) != "":
		tmp, err := extractExtensionArchive(dir, body.Archive)
		if err != nil {
			writeErr(w, http.StatusBadRequest, "bad_archive", err.Error())
			return
		}
		source = tmp
		cleanup = func() { os.RemoveAll(tmp) }
	default:
		writeErr(w, http.StatusBadRequest, "invalid_request", "path or archive is required")
		return
	}
	defer cleanup()

	raw, err := os.ReadFile(filepath.Join(source, "manifest.json"))
	if err != nil {
		writeErr(w, http.StatusBadRequest, "missing_manifest", "the directory has no manifest.json")
		return
	}
	var manifest struct {
		Name string `json:"name"`
	}
	if json.Unmarshal(raw, &manifest) != nil {
		writeErr(w, http.StatusBadRequest, "bad_manifest", "manifest.json is not valid JSON")
		return
	}
	name := manifest.Name
	if name == "" {
		name = filepath.Base(filepath.Clean(source))
	}
	if !extensionNamePattern.MatchString(name) || name == "enabled" {
		writeErr(w, http.StatusBadRequest, "bad_name", fmt.Sprintf("%q is not a usable plugin name", name))
		return
	}
	target := filepath.Join(dir, name)
	if _, err := os.Stat(target); err == nil && !body.Replace {
		writeErr(w, http.StatusConflict, "exists", "a plugin with this name is already installed; send replace to overwrite")
		return
	}
	// Copy into a temporary directory first, so replacing a plugin cannot leave
	// half of the old one and half of the new one when the copy fails.
	staging := target + ".installing"
	os.RemoveAll(staging)
	if err := copyDir(source, staging); err != nil {
		os.RemoveAll(staging)
		writeErr(w, http.StatusInternalServerError, "copy_failed", err.Error())
		return
	}
	if err := os.RemoveAll(target); err != nil {
		os.RemoveAll(staging)
		writeErr(w, http.StatusInternalServerError, "replace_failed", err.Error())
		return
	}
	if err := os.Rename(staging, target); err != nil {
		os.RemoveAll(staging)
		writeErr(w, http.StatusInternalServerError, "install_failed", err.Error())
		return
	}
	loaded := g.reloadAgentExtensions(r.Context())
	writeJSON(w, http.StatusOK, map[string]interface{}{"name": name, "dir": target, "loaded": loaded})
}

func (g *Gateway) handleExtensionsRemove(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodPost) {
		return
	}
	var body struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(io.LimitReader(r.Body, 1<<20)).Decode(&body); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid_request", "invalid JSON body")
		return
	}
	name := strings.TrimSpace(body.Name)
	if !extensionNamePattern.MatchString(name) {
		writeErr(w, http.StatusBadRequest, "invalid_request", "invalid name")
		return
	}
	target := filepath.Join(g.extensionDir(), name)
	info, err := os.Stat(target)
	if err != nil || !info.IsDir() {
		writeErr(w, http.StatusNotFound, "not_found", "no such plugin")
		return
	}
	if err := os.RemoveAll(target); err != nil {
		writeErr(w, http.StatusInternalServerError, "remove_failed", err.Error())
		return
	}
	// Drop it from the allow-list too, or the next install of the same name
	// would inherit a stale decision.
	current := g.enabledExtensions()
	if current[name] {
		next := []string{}
		for existing := range current {
			if existing != name {
				next = append(next, existing)
			}
		}
		_ = g.writeEnabledExtensions(next)
	}
	loaded := g.reloadAgentExtensions(r.Context())
	writeJSON(w, http.StatusOK, map[string]interface{}{"removed": name, "loaded": loaded})
}

// listExtensionNames reads the directory names, which is what the allow-list is
// keyed by after install.
func (g *Gateway) listExtensionNames() []string {
	entries, err := os.ReadDir(g.extensionDir())
	if err != nil {
		return nil
	}
	names := []string{}
	for _, item := range entries {
		if !item.IsDir() || strings.HasPrefix(item.Name(), ".") {
			continue
		}
		names = append(names, item.Name())
	}
	return names
}

// reloadAgentExtensions asks the running agent to re-read its plugin directory.
// A failure is reported but does not fail the request: the file change already
// happened, and the next agent restart picks it up.
func (g *Gateway) reloadAgentExtensions(ctx context.Context) map[string]interface{} {
	listed := g.callAgentDirect(ctx, "extensions_list", map[string]string{})
	if !listed.ok {
		return map[string]interface{}{"ok": false, "error": listed.err}
	}
	// The enabled list lives in the agent's settings, which is what its loader
	// reads. Send it explicitly so Core and the agent cannot disagree.
	names := []string{}
	for name := range g.enabledExtensions() {
		names = append(names, name)
	}
	// An empty allow-list means "everything", which the agent encodes as an
	// empty string rather than an empty set.
	enabled := ""
	if len(names) > 0 {
		enabled = strings.Join(names, ",")
	}
	reloaded := g.callAgentDirect(ctx, "extensions_reload", map[string]string{"enabled": enabled})
	if !reloaded.ok {
		return map[string]interface{}{"ok": false, "error": reloaded.err}
	}
	return map[string]interface{}{"ok": true, "report": json.RawMessage(reloaded.result)}
}

type directResult struct {
	ok     bool
	result string
	err    string
}

// callAgentDirect runs one RunDirect tool on the first live agent.
//
// Args are strings because that is the shape RunDirect takes; the tools on the
// other side parse them.
func (g *Gateway) callAgentDirect(ctx context.Context, tool string, args map[string]string) directResult {
	if args == nil {
		args = map[string]string{}
	}
	// No registry means this gateway was built without plugins; there is no
	// agent to ask, and that is a normal state rather than a fault.
	if g.registry == nil {
		return directResult{err: "no agent is connected"}
	}
	raw, _ := json.Marshal(args)
	var lastErr string
	for _, agent := range g.registry.GetAgents(true) {
		conn, err := g.dial(agent.Address)
		if err != nil {
			lastErr = err.Error()
			continue
		}
		callCtx, cancel := context.WithTimeout(ctx, 20*time.Second)
		result, err := agentv1.NewAgentServiceClient(conn).RunDirect(
			pairing.CallbackContext(callCtx, agent.Address),
			&agentv1.RunDirectRequest{Tool: tool, Args: string(raw)},
		)
		cancel()
		if err != nil {
			lastErr = err.Error()
			continue
		}
		if !result.Success {
			return directResult{err: result.Error}
		}
		return directResult{ok: true, result: result.Result}
	}
	if lastErr == "" {
		lastErr = "no agent is connected"
	}
	return directResult{err: lastErr}
}

// respondExtensions returns the list after a change, with the agent's own view
// attached so the page can show a difference between "installed" and "loaded".
func (g *Gateway) respondExtensions(w http.ResponseWriter, enabled []string, loaded map[string]interface{}) {
	writeJSON(w, http.StatusOK, map[string]interface{}{
		"dir":        g.extensionDir(),
		"enabled":    enabled,
		"explicit":   len(enabled) > 0,
		"agent":      loaded,
		"extensions": g.extensionEntries(),
	})
}

// extensionEntries is the read side of handleExtensions, shared with the
// post-change responses.
func (g *Gateway) extensionEntries() []map[string]interface{} {
	dir := g.extensionDir()
	enabled := g.enabledExtensions()
	items := []map[string]interface{}{}
	entries, err := os.ReadDir(dir)
	if err != nil {
		return items
	}
	for _, item := range entries {
		if !item.IsDir() || strings.HasPrefix(item.Name(), ".") {
			continue
		}
		full := filepath.Join(dir, item.Name())
		row := map[string]interface{}{"name": item.Name(), "dir": full}
		raw, readErr := os.ReadFile(filepath.Join(full, "manifest.json"))
		if readErr != nil {
			row["problem"] = "missing manifest.json"
			items = append(items, row)
			continue
		}
		var manifest map[string]interface{}
		if json.Unmarshal(raw, &manifest) != nil {
			row["problem"] = "manifest.json is not valid JSON"
			items = append(items, row)
			continue
		}
		for _, key := range []string{"name", "title", "version", "description", "author", "entry", "permissions", "behaviour"} {
			if value, present := manifest[key]; present {
				row[key] = value
			}
		}
		if name, _ := manifest["name"].(string); name != "" {
			row["name"] = name
		}
		row["enabled"] = len(enabled) == 0 || enabled[item.Name()]
		items = append(items, row)
	}
	return items
}

// extractExtensionArchive writes an uploaded zip into a temporary directory and
// returns the directory holding the manifest.
//
// Zip for uploads (one file, no external tool) and gzip-wrapped tar for the
// release bundles, which are already tar.gz everywhere else in this project.
func extractExtensionArchive(dir, payload string) (string, error) {
	raw, err := base64.StdEncoding.DecodeString(strings.TrimSpace(payload))
	if err != nil {
		return "", fmt.Errorf("archive is not base64: %w", err)
	}
	tmp, err := os.MkdirTemp(dir, ".install-")
	if err != nil {
		return "", err
	}
	if len(raw) > 2 && raw[0] == 0x1f && raw[1] == 0x8b {
		gz, err := gzip.NewReader(bytes.NewReader(raw))
		if err != nil {
			os.RemoveAll(tmp)
			return "", fmt.Errorf("not a gzip stream: %w", err)
		}
		defer gz.Close()
		if err := untar(gz, tmp); err != nil {
			os.RemoveAll(tmp)
			return "", err
		}
	} else {
		reader, err := zip.NewReader(bytes.NewReader(raw), int64(len(raw)))
		if err != nil {
			os.RemoveAll(tmp)
			return "", fmt.Errorf("not a zip or tar.gz archive: %w", err)
		}
		for _, file := range reader.File {
			target, err := safeJoin(tmp, file.Name)
			if err != nil {
				os.RemoveAll(tmp)
				return "", err
			}
			if file.FileInfo().IsDir() {
				os.MkdirAll(target, 0o755)
				continue
			}
			os.MkdirAll(filepath.Dir(target), 0o755)
			src, err := file.Open()
			if err != nil {
				os.RemoveAll(tmp)
				return "", err
			}
			dst, err := os.Create(target)
			if err != nil {
				src.Close()
				os.RemoveAll(tmp)
				return "", err
			}
			_, copyErr := io.Copy(dst, io.LimitReader(src, 32<<20))
			dst.Close()
			src.Close()
			if copyErr != nil {
				os.RemoveAll(tmp)
				return "", copyErr
			}
		}
	}
	return rootWithManifest(tmp)
}

// rootWithManifest handles the usual archive shape: the plugin inside one
// top-level folder. It returns that folder rather than the scratch directory.
func rootWithManifest(tmp string) (string, error) {
	if _, err := os.Stat(filepath.Join(tmp, "manifest.json")); err == nil {
		return tmp, nil
	}
	entries, _ := os.ReadDir(tmp)
	var dirs []string
	for _, entry := range entries {
		if entry.IsDir() {
			dirs = append(dirs, entry.Name())
		}
	}
	if len(dirs) == 1 {
		nested := filepath.Join(tmp, dirs[0])
		if _, err := os.Stat(filepath.Join(nested, "manifest.json")); err == nil {
			return nested, nil
		}
	}
	return "", fmt.Errorf("no manifest.json at the archive root or inside a single top-level folder")
}

// safeJoin refuses an entry whose path would leave the extraction directory.
// An archive is untrusted input; ".." in a filename is the whole attack.
//
// The check runs on the entry name before any cleaning. Cleaning first would
// turn "../../evil" into "evil" inside the root — a silent rewrite of an
// attacker's path into a harmless one, which passes the test and hides the
// attempt. A name that contains a traversal segment is refused outright.
func safeJoin(root, name string) (string, error) {
	normalised := strings.ReplaceAll(name, "\\", "/")
	if strings.HasPrefix(normalised, "/") || filepath.IsAbs(name) {
		return "", fmt.Errorf("archive entry is absolute: %s", name)
	}
	for _, segment := range strings.Split(normalised, "/") {
		if segment == ".." {
			return "", fmt.Errorf("archive entry escapes the plugin directory: %s", name)
		}
	}
	target := filepath.Join(root, filepath.FromSlash(normalised))
	rel, err := filepath.Rel(root, target)
	if err != nil || strings.HasPrefix(rel, "..") {
		return "", fmt.Errorf("archive entry escapes the plugin directory: %s", name)
	}
	return target, nil
}

func untar(reader io.Reader, dir string) error {
	// A minimal tar reader: the release bundles use plain ustar entries with no
	// long names, and pulling in a dependency for that is not worth it.
	header := make([]byte, 512)
	for {
		if _, err := io.ReadFull(reader, header); err != nil {
			if err == io.EOF {
				return nil
			}
			return err
		}
		if header[0] == 0 {
			return nil
		}
		name := strings.TrimRight(string(header[0:100]), "\x00")
		sizeField := strings.TrimSpace(string(header[124:136]))
		var size int64
		fmt.Sscanf(sizeField, "%o", &size)
		kind := header[156]
		if name == "" {
			return nil
		}
		target, err := safeJoin(dir, name)
		if err != nil {
			return err
		}
		padded := (size + 511) / 512 * 512
		if kind == '5' {
			os.MkdirAll(target, 0o755)
			if _, err := io.CopyN(io.Discard, reader, padded); err != nil {
				return err
			}
			continue
		}
		if kind != '0' && kind != 0 {
			// Symlinks and devices are refused: a plugin is files, and a link is
			// how an archive reaches outside its own directory.
			if _, err := io.CopyN(io.Discard, reader, padded); err != nil {
				return err
			}
			continue
		}
		os.MkdirAll(filepath.Dir(target), 0o755)
		out, err := os.Create(target)
		if err != nil {
			return err
		}
		// Copy the declared size, then discard the padding to the next 512-byte
		// boundary. Skipping `size` bytes after already copying them would walk
		// the reader into the next header.
		if _, err := io.CopyN(out, reader, size); err != nil {
			out.Close()
			return err
		}
		out.Close()
		if _, err := io.CopyN(io.Discard, reader, padded-size); err != nil {
			return err
		}
	}
}

func copyDir(source, target string) error {
	return filepath.Walk(source, func(full string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}
		rel, err := filepath.Rel(source, full)
		if err != nil {
			return err
		}
		dest := filepath.Join(target, rel)
		if info.IsDir() {
			return os.MkdirAll(dest, 0o755)
		}
		if info.Mode()&os.ModeSymlink != 0 {
			// Copying a link out of a plugin would make the plugin's contents
			// depend on wherever the link pointed on the machine that built it.
			return nil
		}
		in, err := os.Open(full)
		if err != nil {
			return err
		}
		defer in.Close()
		out, err := os.Create(dest)
		if err != nil {
			return err
		}
		if _, err := io.Copy(out, in); err != nil {
			out.Close()
			return err
		}
		return out.Close()
	})
}
