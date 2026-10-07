package server

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"sync"
	"time"

	"0kay/mocr/internal/register"
	"0kay/obs"
)

// usageLog tags the usage-ledger records. The ledger is best-effort telemetry:
// failures are logged and dropped rather than failing a generation.
var usageLog = obs.Component("usage")

const usageOutboxMax = 512
const usageOutboxTTL = 7 * 24 * time.Hour

var usageLock sync.Mutex
var usageWg sync.WaitGroup

func coreAuth(req *http.Request) {
	// Attribute the call with the plugin identity issued at registration so Core
	// can enforce mocr's declared API allow-list. Fall back to the shared service
	// token when mocr has not registered yet (early startup).
	if name, token := register.Identity(); name != "" && token != "" {
		req.Header.Set("X-0KAY-Plugin", name)
		req.Header.Set("Authorization", "Bearer "+token)
		return
	}
	if token := os.Getenv("CORE_API_TOKEN"); token != "" {
		req.Header.Set("Authorization", "Bearer "+token)
	}
}
func reportUsage(requestID, sessionID, model string, prompt, completion int32) {
	id := make([]byte, 16)
	rand.Read(id)
	rid := requestID
	if rid == "" {
		rid = "mocr:" + hex.EncodeToString(id)
	}
	raw, _ := json.Marshal(map[string]interface{}{"request_id": rid, "session_id": sessionID, "model": model, "prompt_tokens": prompt, "completion_tokens": completion, "timestamp": time.Now()})
	directory := os.Getenv("MOCR_DATA_DIR")
	if directory == "" {
		directory = "data"
	}
	directory = filepath.Join(directory, "usage-outbox")
	if err := os.MkdirAll(directory, 0700); err != nil {
		usageLog.Error("load usage outbox", "err", err)
		return
	}
	// One file per logical request so retries overwrite rather than double-count.
	filename := filepath.Join(directory, hex.EncodeToString([]byte(rid))+".json")
	if err := os.WriteFile(filename, raw, 0600); err != nil {
		usageLog.Error("write usage", "err", err)
		return
	}
	usageWg.Add(1)
	go func() {
		defer usageWg.Done()
		usageLock.Lock()
		defer usageLock.Unlock()
		entries, _ := os.ReadDir(directory)
		var files []string
		for _, entry := range entries {
			if !entry.IsDir() {
				files = append(files, filepath.Join(directory, entry.Name()))
			}
		}
		sortUsageFilesByAge(files)
		for _, file := range files {
			info, err := os.Stat(file)
			if err != nil {
				continue
			}
			if time.Since(info.ModTime()) > usageOutboxTTL {
				os.Remove(file)
			}
		}
		entries, _ = os.ReadDir(directory)
		files = files[:0]
		for _, entry := range entries {
			if !entry.IsDir() {
				files = append(files, filepath.Join(directory, entry.Name()))
			}
		}
		sortUsageFilesByAge(files)
		for len(files) > usageOutboxMax {
			os.Remove(files[0])
			files = files[1:]
		}
		failures := 0
		for _, file := range files {
			data, err := os.ReadFile(file)
			if err != nil {
				continue
			}
			ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
			request, _ := http.NewRequestWithContext(ctx, "POST", coreHTTPBase()+"/api/usage/record", bytes.NewReader(data))
			request.Header.Set("Content-Type", "application/json")
			coreAuth(request)
			response, err := http.DefaultClient.Do(request)
			if err == nil {
				response.Body.Close()
			}
			cancel()
			if err != nil {
				failures++
				usageLog.Error("post usage outbox", "err", err)
				if failures >= 3 {
					return
				}
				continue
			}
			if response.StatusCode >= 300 {
				failures++
				usageLog.Error("post usage outbox", "status", response.StatusCode)
				if failures >= 3 {
					return
				}
				if response.StatusCode >= 400 && response.StatusCode < 500 && response.StatusCode != 429 {
					os.Remove(file)
				}
				continue
			}
			os.Remove(file)
		}
	}()
}
func sortUsageFilesByAge(files []string) {
	type fileInfo struct {
		path    string
		modTime time.Time
	}
	infos := make([]fileInfo, 0, len(files))
	for _, f := range files {
		info, err := os.Stat(f)
		if err != nil {
			continue
		}
		infos = append(infos, fileInfo{path: f, modTime: info.ModTime()})
	}
	sort.Slice(infos, func(i, j int) bool {
		return infos[i].modTime.Before(infos[j].modTime)
	})
	for i, fi := range infos {
		files[i] = fi.path
	}
}
