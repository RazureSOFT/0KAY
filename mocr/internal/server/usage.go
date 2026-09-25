package server
import("bytes";"context";"crypto/rand";"encoding/hex";"encoding/json";"net/http";"time";"log";"os";"path/filepath";"sync")
const usageOutboxMax=512;const usageOutboxTTL=7*24*time.Hour
var usageLock sync.Mutex
func coreAuth(req *http.Request){if token:=os.Getenv("CORE_API_TOKEN");token!=""{req.Header.Set("Authorization","Bearer "+token)}}
func reportUsage(requestID, sessionID, model string, prompt, completion int32){
 id:=make([]byte,16);rand.Read(id)
 rid:=requestID;if rid==""{rid="mocr:"+hex.EncodeToString(id)}
 raw,_:=json.Marshal(map[string]interface{}{"request_id":rid,"session_id":sessionID,"model":model,"prompt_tokens":prompt,"completion_tokens":completion,"timestamp":time.Now()})
 directory:=os.Getenv("MOCR_DATA_DIR");if directory==""{directory="data"};directory=filepath.Join(directory,"usage-outbox")
 if err:=os.MkdirAll(directory,0700);err!=nil{log.Printf("usage outbox: %v",err);return}
 // One file per logical request so retries overwrite rather than double-count.
 filename:=filepath.Join(directory,hex.EncodeToString([]byte(rid))+".json");if err:=os.WriteFile(filename,raw,0600);err!=nil{log.Printf("usage write: %v",err);return}
 go func(){usageLock.Lock();defer usageLock.Unlock()
  entries,_:=os.ReadDir(directory)
  // Drop oversize backlog (oldest first) and stale files past TTL.
  var files []string
  for _,entry:=range entries{if !entry.IsDir(){files=append(files,filepath.Join(directory,entry.Name()))}}
  sortUsageFilesByAge(files)
  for _,file:=range files{
   info,err:=os.Stat(file);if err!=nil{continue}
   if time.Since(info.ModTime())>usageOutboxTTL{os.Remove(file)}
  }
  entries,_=os.ReadDir(directory);files=files[:0]
  for _,entry:=range entries{if !entry.IsDir(){files=append(files,filepath.Join(directory,entry.Name()))}}
  sortUsageFilesByAge(files)
  for len(files)>usageOutboxMax{os.Remove(files[0]);files=files[1:]}
  failures:=0
  for _,file:=range files{
   data,err:=os.ReadFile(file);if err!=nil{continue}
   ctx,cancel:=context.WithTimeout(context.Background(),3*time.Second)
   request,_:=http.NewRequestWithContext(ctx,"POST",coreHTTPBase()+"/api/usage/record",bytes.NewReader(data))
   request.Header.Set("Content-Type","application/json");coreAuth(request)
   response,err:=http.DefaultClient.Do(request)
   if err==nil{response.Body.Close()}
   cancel()
   if err!=nil{failures++;log.Printf("usage outbox post: %v",err);if failures>=3{return};continue}
   if response.StatusCode>=300{failures++;log.Printf("usage outbox post: HTTP %d",response.StatusCode);if failures>=3{return};if response.StatusCode>=400&&response.StatusCode<500&&response.StatusCode!=429{os.Remove(file)};continue}
   os.Remove(file)
  }
 }()
}
func sortUsageFilesByAge(files []string){
 for i:=1;i<len(files);i++{for j:=i;j>0;j--{a,err:=os.Stat(files[j-1]);b,err2:=os.Stat(files[j]);if err!=nil||err2!=nil{break};if !a.ModTime().Before(b.ModTime()){break};files[j-1],files[j]=files[j],files[j-1]}}
}
