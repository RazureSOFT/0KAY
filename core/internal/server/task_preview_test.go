package server

import (
	"encoding/json"
	"strings"
	"testing"
)

func TestOversizedTaskResultKeepsRedactedPreview(t *testing.T) {
	raw := `{"summary":"useful result","base64":"` + strings.Repeat("A", 900) + `","details":"` + strings.Repeat("内容", 4000) + `"}`
	got := redactTaskResult(raw)
	var payload struct {
		Truncated bool   `json:"truncated"`
		Preview   string `json:"preview"`
	}
	if err := json.Unmarshal([]byte(got), &payload); err != nil {
		t.Fatal(err)
	}
	if !payload.Truncated || !strings.Contains(payload.Preview, "useful result") {
		t.Fatalf("missing summary: %s", got)
	}
	if strings.Contains(payload.Preview, strings.Repeat("A", 500)) || len(got) > 6000 {
		t.Fatal("preview leaked blob or exceeded task-list limit")
	}
}
