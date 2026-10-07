package obs

import (
	"fmt"
	"log/slog"
	"os"
	"path/filepath"
	"sync"
)

// maxFileBytes and maxFiles bound the on-disk log. Keeping a file sink is
// opt-in (CORE_LOG_FILE) and the cap is deliberately small: this is a
// self-hosted box, and an unbounded log is how you fill one.
const (
	maxFileBytes = 8 << 20 // 8 MiB per file
	maxFiles     = 5
)

// newFileHandler opens path for append and returns a JSON-lines handler writing
// to it. slog already emits one JSON object per line to any io.Writer, so all
// this needs to add is size-bounded rotation underneath.
func newFileHandler(path string) slog.Handler {
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0o755); err != nil {
		fmt.Fprintf(os.Stderr, "obs: cannot create log dir: %v\n", err)
		return discardHandler{}
	}
	w := &rotatingFile{path: path}
	if err := w.open(); err != nil {
		fmt.Fprintf(os.Stderr, "obs: cannot open log file: %v\n", err)
		return discardHandler{}
	}
	w.track()
	return slog.NewJSONHandler(w, &slog.HandlerOptions{Level: level})
}

// rotatingFile owns the open file and its size accounting. The mutex serialises
// writes because slog handlers may be called from any number of goroutines.
type rotatingFile struct {
	mu   sync.Mutex
	path string
	f    *os.File
	size int64
}

func (w *rotatingFile) open() error {
	f, err := os.OpenFile(w.path, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0o600)
	if err != nil {
		return err
	}
	info, err := f.Stat()
	if err != nil {
		f.Close()
		return err
	}
	w.f, w.size = f, info.Size()
	return nil
}

func (w *rotatingFile) Write(p []byte) (int, error) {
	w.mu.Lock()
	defer w.mu.Unlock()
	if w.f == nil {
		return 0, os.ErrClosed
	}
	if w.size+int64(len(p)) > maxFileBytes {
		if err := w.rotate(); err != nil {
			return 0, err
		}
	}
	n, err := w.f.Write(p)
	w.size += int64(n)
	return n, err
}

// rotate shifts path.{n-1} up to path.{n} and starts a fresh path. The file that
// would become path.maxFiles is removed rather than shifted past the cap.
func (w *rotatingFile) rotate() error {
	if w.f != nil {
		w.f.Close()
		w.f = nil
	}
	os.Remove(fmt.Sprintf("%s.%d", w.path, maxFiles))
	for i := maxFiles - 1; i >= 1; i-- {
		from := fmt.Sprintf("%s.%d", w.path, i)
		if _, err := os.Stat(from); err == nil {
			if err := os.Rename(from, fmt.Sprintf("%s.%d", w.path, i+1)); err != nil {
				return err
			}
		}
	}
	if _, err := os.Stat(w.path); err == nil {
		if err := os.Rename(w.path, w.path+".1"); err != nil {
			return err
		}
	}
	return w.open()
}

// Close is called from obs.Close via the tappingHandler unwrap chain.
func (w *rotatingFile) Close() error {
	w.mu.Lock()
	defer w.mu.Unlock()
	if w.f == nil {
		return nil
	}
	err := w.f.Close()
	w.f = nil
	return err
}

// openFiles tracks every rotatingFile handed out so obs.Close can release the
// descriptors. Tracked here rather than unwrapped from the handler chain: the
// chain is fanout -> tapping -> json and only the innermost sink knows the file.
var (
	openMu    sync.Mutex
	openFiles []*rotatingFile
)

func (w *rotatingFile) track() {
	openMu.Lock()
	defer openMu.Unlock()
	openFiles = append(openFiles, w)
}

func closeOpenFiles() error {
	openMu.Lock()
	files := openFiles
	openFiles = nil
	openMu.Unlock()
	var firstErr error
	for _, f := range files {
		if err := f.Close(); err != nil && firstErr == nil {
			firstErr = err
		}
	}
	return firstErr
}
