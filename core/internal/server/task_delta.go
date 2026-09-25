package server
import("fmt";"crypto/rand";"encoding/hex")
var taskGeneration=func()string{value:=make([]byte,16);_,_=rand.Read(value);return hex.EncodeToString(value)}()
func(s *CoreServiceServer) TaskDelta(cursor string) map[string]interface{} {
 s.mu.Lock();generation:=taskGeneration;var previous uint64
 prefix:=generation+":"
 valid:=len(cursor)>len(prefix) && cursor[:len(prefix)]==prefix
 if valid {_,err:=fmt.Sscanf(cursor[len(prefix):],"%d",&previous);valid=err==nil}
 revision:=s.taskRevision
 if valid && previous==revision {s.mu.Unlock();return map[string]interface{}{"tasks":[]map[string]interface{}{},"removed":[]string{},"reset":false,"cursor":cursor}}
 ids:=map[string]bool{};removed:=[]string{}
 if valid {for id,version:=range s.taskChanges {if version>previous {ids[id]=true}};for id,version:=range s.taskRemoved {if version>previous {removed=append(removed,id)}}}
 s.mu.Unlock()
 rows:=s.ListTasks();result:=[]map[string]interface{}{}
 for _,row:=range rows {if !valid || ids[row["task_id"].(string)] {result=append(result,row)}}
 return map[string]interface{}{"tasks":result,"removed":removed,"reset":!valid,"cursor":fmt.Sprintf("%s:%d",generation,revision)}
}
