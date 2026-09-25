package providers
import("context";"encoding/json";"net/http";"net/http/httptest";"testing")
func TestUnsupportedTemperatureRetriesAndCaches(t *testing.T){
 calls:=0;server:=httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter,r *http.Request){calls++;var body map[string]interface{};json.NewDecoder(r.Body).Decode(&body);if _,ok:=body["temperature"];ok{w.WriteHeader(400);w.Write([]byte(`{"error":{"message":"Unsupported parameter: 'temperature' is not supported with this model."}}`));return};w.Header().Set("Content-Type","text/event-stream");w.Write([]byte("data: {\"choices\":[{\"delta\":{\"content\":\"ok\"},\"finish_reason\":\"stop\"}]}\n\ndata: [DONE]\n\n"))}));defer server.Close()
 for i:=0;i<2;i++{text:="";_,err:=Generate(context.Background(),GenerateOptions{BaseURL:server.URL,APIKey:"mock",ModelID:"custom-reasoner",Stream:true},func(chunk string)bool{text+=chunk;return true});if err!=nil||text!="ok"{t.Fatalf("text=%s error=%v",text,err)}}
 if calls!=3{t.Fatalf("expected reject+retry then cached request, got %d",calls)}
}
func TestEssentialParametersNotSilentlyRemoved(t *testing.T){
 for _,field:=range []string{"tools","messages","reasoning_effort","max_tokens"}{raw,_:=json.Marshal(map[string]interface{}{"error":map[string]string{"param":field,"message":"parameter not supported"}});if optionalRejectedField(raw)!=""{t.Fatalf("essential field %s removed",field)}}
}
