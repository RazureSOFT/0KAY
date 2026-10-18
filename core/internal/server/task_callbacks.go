package server

import (
	pluginv1 "0kay/gen/plugin/v1"
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"time"
)

type taskCallback struct {
	TaskID string
	State  pluginv1.TaskState
	Result string
	Error  string
}

func (s *CoreServiceServer) callbackPath() string {
	return filepath.Join(filepath.Dir(s.taskHistoryPath), "task_callbacks.json")
}
func (s *CoreServiceServer) loadCallbacks() {
	s.callbacks = map[string]taskCallback{}
	if s.taskHistoryPath == "" {
		return
	}
	if data, err := os.ReadFile(s.callbackPath()); err == nil {
		if err = json.Unmarshal(data, &s.callbacks); err != nil {
			log.Printf("callback recovery: %v", err)
		}
	}
}
func (s *CoreServiceServer) saveCallbacksLocked() {
	if s.taskHistoryPath == "" {
		return
	}
	data, err := json.Marshal(s.callbacks)
	if err != nil {
		return
	}
	os.MkdirAll(filepath.Dir(s.callbackPath()), 0700)
	if err = os.WriteFile(s.callbackPath()+".tmp", data, 0600); err == nil {
		err = os.Rename(s.callbackPath()+".tmp", s.callbackPath())
	}
	if err != nil {
		log.Printf("callback persistence: %v", err)
	}
}
func (s *CoreServiceServer) retryCallbacks() {
	if s.registry == nil {
		return
	}
	ticker := time.NewTicker(10 * time.Second)
	defer ticker.Stop()
	for range ticker.C {
		s.callbackMu.Lock()
		items := []taskCallback{}
		for _, item := range s.callbacks {
			items = append(items, item)
		}
		s.callbackMu.Unlock()
		for _, item := range items {
			s.deliverTaskCallback(item.TaskID, item.State, item.Result, item.Error)
		}
	}
}
