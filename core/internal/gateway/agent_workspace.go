package gateway

import (
 "context"
 "encoding/json"
 "fmt"
 "net/http"
 "time"
 "0kay/core/internal/server"
 agentv1 "0kay/gen/agent/v1"
 lifev1 "0kay/gen/life/v1"
 "google.golang.org/grpc"
 "google.golang.org/grpc/credentials/insecure"
)

func (g *Gateway) handleAgentWorkspace(w http.ResponseWriter,r *http.Request) {
 if r.Method!="GET" && !(r.Method=="POST" && r.URL.Path=="/api/agent/workspace") {http.Error(w,"method not allowed",405);return}
 id:=r.URL.Query().Get("executor_id")
 agents:=g.registry.GetAgents(true)
 for _,agent:=range agents {
  if id!="" && agent.PluginID!=id {continue}
  conn,err:=grpc.NewClient(agent.Address,grpc.WithTransportCredentials(insecure.NewCredentials()))
  if err!=nil {http.Error(w,err.Error(),502);return};defer conn.Close()
  tool:="workspace_browse";if r.URL.Path=="/api/agent/host" {tool="host_status"}
  args,_:=json.Marshal(map[string]string{"path":r.URL.Query().Get("path")})
  if r.Method=="POST" {
   var body struct{Path string `json:"path"`;Name string `json:"name"`}
   if json.NewDecoder(http.MaxBytesReader(w,r.Body,8192)).Decode(&body)!=nil {http.Error(w,"invalid folder request",400);return}
   tool="workspace_mkdir";args,_=json.Marshal(body)
  }
  ctx,cancel:=context.WithTimeout(r.Context(),10*time.Second);defer cancel()
  result,err:=agentv1.NewAgentServiceClient(conn).RunDirect(ctx,&agentv1.RunDirectRequest{Tool:tool,Args:string(args)})
  if err!=nil {http.Error(w,err.Error(),502);return};if !result.Success {http.Error(w,result.Error,400);return}
  w.Header().Set("Content-Type","application/json");fmt.Fprint(w,result.Result);return
 }
 http.Error(w,"selected executor unavailable",503)
}

func (g *Gateway) handleAgentCompact(w http.ResponseWriter,r *http.Request) {
 if r.Method!="POST" {http.Error(w,"method not allowed",405);return}
 var body struct{SessionID string `json:"session_id"`}
 if json.NewDecoder(r.Body).Decode(&body)!=nil || g.localCore==nil || !g.localCore.HasAgentSession(body.SessionID) {http.Error(w,"invalid session",400);return}
 tasks:=g.localCore.ListTasks()
 history:=[]map[string]string{}
 for i:=len(tasks)-1;i>=0;i-- {
  task:=tasks[i];if task["session_id"]!=body.SessionID {continue}
  if task["state"]=="running" || task["state"]=="pending" {http.Error(w,"wait for active work to finish",409);return}
  if task["kind"]=="compact" && task["state"]=="done" {history=[]map[string]string{{"role":"system","content":fmt.Sprint(task["result"])}}}
   if task["kind"]=="agent" {
    prompt,_:=task["prompt"].(string);result,_:=task["result"].(string);failure,_:=task["error"].(string)
    history=append(history,map[string]string{"role":"user","content":prompt},map[string]string{"role":"assistant","content":result+"\n"+failure})
   }
 }
 if len(history)==0 {http.Error(w,"no conversation to compact",400);return}
 lifes:=g.registry.GetPluginsByCapability("life");if len(lifes)==0 {http.Error(w,"LIFE unavailable",503);return}
 id:=fmt.Sprintf("compact:%d",time.Now().UnixNano())
 event:=server.TaskEvent{TaskID:id,SessionID:body.SessionID,CallerID:"webui",Kind:"compact",Prompt:"/compact",State:"running"}
 if err:=g.localCore.RecordTask(event);err!=nil {http.Error(w,err.Error(),409);return}
 conn,err:=grpc.NewClient(lifes[0].Address,grpc.WithTransportCredentials(insecure.NewCredentials()))
 if err!=nil {event.State="failed";event.Error=err.Error();g.localCore.RecordTask(event);http.Error(w,err.Error(),502);return};defer conn.Close()
 data,_:=json.Marshal(history)
 ctx,cancel:=context.WithTimeout(r.Context(),120*time.Second);defer cancel()
 response,err:=lifev1.NewLifeServiceClient(conn).CompactConversation(ctx,&lifev1.CompactConversationRequest{SessionId:body.SessionID,HistoryJson:string(data)})
 if err!=nil || !response.GetOk() {event.State="failed";event.Error=fmt.Sprint(err);if err==nil {event.Error=response.GetError()};g.localCore.RecordTask(event);http.Error(w,event.Error,502);return}
  if response.Summary=="" {event.State="failed";event.Error="empty compaction summary";g.localCore.RecordTask(event);http.Error(w,event.Error,502);return}
  event.State="done";event.Result=response.Summary;if err:=g.localCore.RecordTask(event);err!=nil {http.Error(w,err.Error(),409);return}
 w.Header().Set("Content-Type","application/json");json.NewEncoder(w).Encode(map[string]string{"summary":response.Summary})
}
