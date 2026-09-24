package gateway

import (
 "encoding/json"
 "net/http/httptest"
 "path/filepath"
 "strings"
 "testing"
 "0kay/core/internal/server"
)

func TestAgentSessionCanBeCreatedWithoutExecutor(t *testing.T) {
 t.Setenv("TASKS_PATH",filepath.Join(t.TempDir(),"tasks.json"))
 t.Setenv("USAGE_PATH",filepath.Join(t.TempDir(),"usage.json"))
 core:=server.NewCoreServiceServer(nil)
 gateway:=&Gateway{localCore:core}
 writer:=httptest.NewRecorder()
 gateway.handleAgentSessions(writer,httptest.NewRequest("POST","/api/agent/sessions",strings.NewReader(`{"title":"offline session"}`)))
 if writer.Code!=201 {t.Fatal(writer.Code,writer.Body.String())}
 var created map[string]string
 if err:=json.Unmarshal(writer.Body.Bytes(),&created);err!=nil {t.Fatal(err)}
 if !core.HasAgentSession(created["session_id"]) {t.Fatal("session not created")}
 restored:=server.NewCoreServiceServer(nil)
 if !restored.HasAgentSession(created["session_id"]) {t.Fatal("session did not survive restart")}
}
