package server

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"sort"
	"sync"
	"time"

	"0kay/mocr/internal/register"
)

const usageOutboxMax = 512
const usageOutboxTTL = 7 * 24 * time.Hour

var usageLock sync.Mutex
var usageWg sync.WaitGroup

// Drain state: at most one drain goroutine runs at a time; a reportUsage call
// that lands while a drain is in flight only marks the outbox dirty so the
// finishing drain starts another pass instead of silently skipping the new
// record.
var usageDraining bool
var usageDirty bool

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

func reportUsage(requestID, sessionID, model string, prompt, completion, cached int32, costUSD float64) {
	id := make([]byte, 16)
	rand.Read(id)
	rid := requestID
	if rid == "" {
		rid = "mocr:" + hex.EncodeToString(id)
	}
	raw, _ := json.Marshal(map[string]interface{}{
		"request_id": rid, "session_id": sessionID, "model": model,
		"prompt_tokens": prompt, "completion_tokens": completion, "cached_tokens": cached,
		"cost_usd": costUSD, "timestamp": time.Now(),
	})
	directory := os.Getenv("MOCR_DATA_DIR")
	if directory == "" {
		directory = "data"
	}
	directory = filepath.Join(directory, "usage-outbox")
	if err := os.MkdirAll(directory, 0700); err != nil {
		log.Printf("usage outbox: %v", err)
		return
	}
	// One file per logical request so retries overwrite rather than double-count.
	filename := filepath.Join(directory, hex.EncodeToString([]byte(rid))+".json")
	if err := os.WriteFile(filename, raw, 0600); err != nil {
		log.Printf("usage write: %v", err)
		return
	}
	usageLock.Lock()
	usageDirty = true
	if usageDraining {
		usageLock.Unlock()
		return
	}
	usageDraining = true
	usageDirty = false
	usageLock.Unlock()
	usageWg.Add(1)
	go func() {
		defer usageWg.Done()
		for {
			drainUsageOutbox(directory)
			usageLock.Lock()
			if !usageDirty {
				usageDraining = false
				usageLock.Unlock()
				return
			}
			usageDirty = false
			usageLock.Unlock()
		}
	}()
}

func drainUsageOutbox(directory string) {
	usageLock.Lock()
	defer usageLock.Unlock()
	entries, _ := os.ReadDir(directory)
	var files []string
	for _, entry := range entries {
		if !entry.IsDir() {
			files = append(files, filepath.Join(directory, entry.Name()))
		}
	}
	files = sortUsageFilesByAge(files)
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
	files = sortUsageFilesByAge(files)
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
		cancel()
		if err == nil {
			response.Body.Close()
		}
		if err != nil {
			failures++
			log.Printf("usage outbox post: %v", err)
			if failures >= 3 {
				return
			}
			continue
		}
		if response.StatusCode >= 300 {
			failures++
			log.Printf("usage outbox post: HTTP %d", response.StatusCode)
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
}

// sortUsageFilesByAge returns the files sorted oldest-first. Files that cannot
// be stat'ed are dropped from the result entirely — writing the shrunken list
// back into the caller's slice used to leave stale tail entries behind, which
// could remove the same file twice or keep expired names alive.
func sortUsageFilesByAge(files []string) []string {
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
	out := make([]string, 0, len(infos))
	for _, fi := range infos {
		out = append(out, fi.path)
	}
	return out
}

// WaitUsage blocks until any in-flight usage drain goroutine has finished.
func WaitUsage() {
	usageWg.Wait()
}
