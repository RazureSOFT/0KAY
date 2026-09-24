package gateway
import("net/http/httptest";"testing")
func TestOriginBoundary(t *testing.T){
 request:=httptest.NewRequest("GET","http://127.0.0.1:8080/api/providers",nil)
 request.Header.Set("Origin","https://untrusted.example");if allowedOrigin(request){t.Fatal("foreign origin accepted")}
 request.Header.Set("Origin","http://localhost:3000");if !allowedOrigin(request){t.Fatal("local UI rejected")}
}
