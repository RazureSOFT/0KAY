package gateway
import("encoding/json";"net/http";"time";"0kay/core/internal/server")
func(g *Gateway)handleUsageRecord(w http.ResponseWriter,r *http.Request){
 if r.Method!="POST"{http.Error(w,"method not allowed",405);return};var record server.UsageRecord
 if json.NewDecoder(http.MaxBytesReader(w,r.Body,16384)).Decode(&record)!=nil||record.RequestID==""||record.PromptTokens<0||record.CompletionTokens<0{http.Error(w,"invalid usage",400);return}
 record.TotalTokens=record.PromptTokens+record.CompletionTokens;if record.Timestamp.IsZero(){record.Timestamp=time.Now()}
 if g.localCore==nil{http.Error(w,"Core unavailable",503);return};g.localCore.RecordUsage(record);w.WriteHeader(204)
}
