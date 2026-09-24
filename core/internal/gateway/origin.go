package gateway

import("net/http";"net/url";"net";"os";"strings")

func allowedOrigin(r *http.Request) bool {
 origin:=r.Header.Get("Origin")
 if origin=="" {return true}
 parsed,err:=url.Parse(origin)
 if err!=nil || (parsed.Scheme!="http" && parsed.Scheme!="https") {return false}
 if parsed.Host==r.Host {return true}
 host,_,err:=net.SplitHostPort(r.Host);if err!=nil {host=r.Host}
 local:=func(value string)bool{return value=="localhost" || value=="127.0.0.1" || value=="::1"}
 if local(host) && local(parsed.Hostname()) {return true}
 for _,allowed:=range strings.Split(os.Getenv("CORE_ALLOWED_ORIGINS"),",") {if strings.TrimSpace(allowed)==origin {return true}}
 return false
}
