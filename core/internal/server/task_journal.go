package server

import (
	"bufio"
	"encoding/json"
	"os"
	"time"
)

func (s *CoreServiceServer) replayTaskJournal() {
	file, err := os.Open(s.taskHistoryPath + ".journal")
	if err != nil {
		return
	}
	defer file.Close()
	scanner := bufio.NewScanner(file)
	scanner.Buffer(make([]byte, 65536), 8<<20)
	for scanner.Scan() {
		var record struct {
			Tasks   []persistedTask `json:"tasks"`
			Removed []string        `json:"removed"`
		}
		if json.Unmarshal(scanner.Bytes(), &record) != nil {
			continue
		}
		for _, item := range record.Tasks {
			s.tasks[item.TaskID] = &TaskInfo{TaskID: item.TaskID, CallerID: item.CallerID, Prompt: item.Prompt, AgentID: item.AgentID, State: item.State, Result: item.Result, Error: item.Error, StartedAt: item.StartedAt, EndedAt: item.EndedAt, SessionID: item.SessionID, Kind: item.Kind, ParentID: item.ParentID, Args: item.Args}
		}
		for _, id := range record.Removed {
			if task := s.tasks[id]; task == nil || task.State != "deleted" {
				delete(s.tasks, id)
			}
		}
	}
	for _, task := range s.tasks {
		if task.State == "running" || task.State == "pending" {
			task.State = "failed"
			task.Error = "Core restarted before execution was acknowledged"
			task.EndedAt = time.Now()
		}
	}
}
