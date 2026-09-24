package gateway

import("context";"encoding/json";"net/http";"time";agentv1 "0kay/gen/agent/v1";"google.golang.org/grpc";"google.golang.org/grpc/credentials/insecure")

func (g *Gateway) handleAgentApprovals(w http.ResponseWriter,r *http.Request) {
 if r.Method!="GET" && r.Method!="POST" {http.Error(w,"method not allowed",405);return}
 var body struct{ExecutorID string `json:"executor_id"`;ID string `json:"id"`;Allow *bool `json:"allow"`}
 if r.Method=="POST" && (json.NewDecoder(http.MaxBytesReader(w,r.Body,8192)).Decode(&body)!=nil || body.Allow==nil) {http.Error(w,"invalid decision",400);return}
 items:=[]map[string]interface{}{}
 for _,agent:=range g.registry.GetAgents(true) {
  if r.Method=="POST" && agent.PluginID!=body.ExecutorID {continue}
  conn,err:=grpc.NewClient(agent.Address,grpc.WithTransportCredentials(insecure.NewCredentials()));if err!=nil {continue}
  ctx,cancel:=context.WithTimeout(r.Context(),3*time.Second)
  tool:="approval_list";args:=map[string]interface{}{"session_id":r.URL.Query().Get("session_id")}
  if r.Method=="POST" {tool="approval_decide";args=map[string]interface{}{"id":body.ID,"allow":*body.Allow}}
  raw,_:=json.Marshal(args)
  result,err:=agentv1.NewAgentServiceClient(conn).RunDirect(ctx,&agentv1.RunDirectRequest{Tool:tool,Args:string(raw)})
  cancel();conn.Close()
  if r.Method=="POST" {
   if err!=nil {http.Error(w,err.Error(),502);return};if !result.Success {http.Error(w,result.Error,409);return}
   w.Header().Set("Content-Type","application/json");json.NewEncoder(w).Encode(map[string]bool{"ok":true});return
  }
  if err==nil && result.Success {var rows []map[string]interface{};if json.Unmarshal([]byte(result.Result),&rows)==nil {for _,row:=range rows {row["executor_id"]=agent.PluginID;row["executor_name"]=agent.Info.GetName();items=append(items,row)}}}
 }
 if r.Method=="POST" {http.Error(w,"executor unavailable",503);return}
 w.Header().Set("Content-Type","application/json");json.NewEncoder(w).Encode(map[string]interface{}{"approvals":items})
}
