package gateway

import (
 "encoding/json"
 "fmt"
 "net/http"
 "strings"
 "time"
 "strconv"
 "math"
 corev1 "0kay/gen/core/v1"
)

func (g *Gateway) handleAgentSessions(w http.ResponseWriter, r *http.Request) {
 if g.localCore == nil { http.Error(w,"Core unavailable",503); return }
 w.Header().Set("Content-Type","application/json")
  if r.Method==http.MethodPatch || r.Method==http.MethodDelete {
   var body struct {SessionID string `json:"session_id"`; Action string `json:"action"`; Title string `json:"title"`}
   if err:=json.NewDecoder(http.MaxBytesReader(w,r.Body,8192)).Decode(&body);err!=nil {http.Error(w,"invalid request",400);return}
   if r.Method==http.MethodDelete {body.Action="delete"}
   if body.Action=="rename" {
    if err:=g.localCore.RenameAgentSession(body.SessionID,body.Title);err!=nil {http.Error(w,err.Error(),409);return}
    json.NewEncoder(w).Encode(map[string]bool{"ok":true});return
   }
   if err:=g.localCore.ManageAgentSession(body.SessionID,body.Action);err!=nil {http.Error(w,err.Error(),409);return}
   json.NewEncoder(w).Encode(map[string]bool{"ok":true});return
  }
 if r.Method == http.MethodGet {
  sessions := []map[string]interface{}{}
  for _, task := range g.localCore.ListTasks() { if task["kind"] == "agent_session" { sessions=append(sessions,task) } }
  json.NewEncoder(w).Encode(map[string]interface{}{"sessions":sessions}); return
 }
 if r.Method != http.MethodPost { http.Error(w,"method not allowed",405); return }
 var body struct { Title string `json:"title"` }
 if err:=json.NewDecoder(http.MaxBytesReader(w,r.Body,8192)).Decode(&body); err!=nil { http.Error(w,"invalid request",400); return }
 id,err:=g.localCore.CreateAgentSession(body.Title)
 if err!=nil { http.Error(w,err.Error(),500);return }
 w.WriteHeader(http.StatusCreated)
 json.NewEncoder(w).Encode(map[string]string{"session_id":id})
}

func (g *Gateway) handleAgentMessage(w http.ResponseWriter, r *http.Request) {
 if r.Method!=http.MethodPost { http.Error(w,"method not allowed",405);return }
  var body struct { SessionID string `json:"session_id"`; Prompt string `json:"prompt"`; AgentType string `json:"agent_type"`; ExecutorID string `json:"executor_id"`; Workdir string `json:"workdir"`; ModelID string `json:"model_id"`; Intensity string `json:"thinking_intensity"`; Permission string `json:"permission_mode"`;Language string `json:"language"` }
 if err:=json.NewDecoder(http.MaxBytesReader(w,r.Body,128<<10)).Decode(&body);err!=nil || strings.TrimSpace(body.Prompt)=="" { http.Error(w,"prompt required",400);return }
 if g.localCore==nil || !g.localCore.HasAgentSession(body.SessionID) { http.Error(w,"session not found",404);return }
 for _, task:= range g.localCore.ListTasks() { if task["session_id"]==body.SessionID && (task["state"]=="running" || task["state"]=="pending") { http.Error(w,"session already has an active task",409);return } }
 id:=fmt.Sprintf("agent-task:%d",time.Now().UnixNano())
  if body.Intensity=="" {body.Intensity="medium"}
   switch body.Intensity {case "off","low","medium","high","max":default:
    value,err:=strconv.ParseFloat(body.Intensity,64);if err!=nil||math.IsNaN(value)||math.IsInf(value,0)||value<0||value>100{http.Error(w,"thinking intensity must be between 0 and 100",400);return}
   }
  if body.ModelID=="" {body.ModelID="MOCR"}
  if body.Permission=="" {body.Permission="normal"};if body.Permission!="normal" && body.Permission!="full_access" {http.Error(w,"invalid permission mode",400);return}
  response,err:=g.coreSvc.UseAgent(r.Context(),&corev1.UseAgentRequest{TaskId:id,CallerId:"webui",Prompt:body.Prompt,AgentType:body.AgentType,Metadata:map[string]string{"session_id":body.SessionID,"executor_id":body.ExecutorID,"workdir":body.Workdir,"model_id":body.ModelID,"thinking_intensity":body.Intensity,"permission_mode":body.Permission,"language":body.Language}})
 if err!=nil { http.Error(w,err.Error(),502);return }
 w.Header().Set("Content-Type","application/json")
 if !response.Accepted { w.WriteHeader(http.StatusServiceUnavailable) } else { w.WriteHeader(http.StatusAccepted) }
 json.NewEncoder(w).Encode(map[string]interface{}{"task_id":response.TaskId,"accepted":response.Accepted,"message":response.Message})
}

func (g *Gateway) handleTaskCancel(w http.ResponseWriter,r *http.Request) {
 if r.Method!=http.MethodPost { http.Error(w,"method not allowed",405);return }
 var body struct { TaskID string `json:"task_id"` }
 if err:=json.NewDecoder(r.Body).Decode(&body);err!=nil { http.Error(w,"invalid request",400);return }
 response,err:=g.coreSvc.CancelAgent(r.Context(),&corev1.CancelAgentRequest{TaskId:body.TaskID,CallerId:"webui"})
 if err!=nil { http.Error(w,err.Error(),502);return }
 w.Header().Set("Content-Type","application/json")
 json.NewEncoder(w).Encode(map[string]interface{}{"success":response.Success,"message":response.Message})
}
