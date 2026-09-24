package providers
import("testing";"context";"net/http";"net/http/httptest";"encoding/json")
func TestIncompleteStreamAndThinking(t *testing.T){
 var body map[string]interface{}
 upstream:=httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter,r *http.Request){json.NewDecoder(r.Body).Decode(&body);w.Header().Set("Content-Type","text/event-stream");w.Write([]byte("data: {\"choices\":[{\"delta\":{\"content\":\"partial\"}}]}\n\n"))}));defer upstream.Close()
 _,err:=Generate(context.Background(),GenerateOptions{Provider:"deepseek",BaseURL:upstream.URL,APIKey:"mock",ModelID:"deepseek",Stream:true,Thinking:true},func(string)bool{return true})
 if err==nil {t.Fatal("truncated stream succeeded")}
 if body["thinking"].(map[string]interface{})["type"]!="enabled" {t.Fatal("thinking missing")}
}
