package registry
import("testing";pluginv1 "0kay/gen/plugin/v1")
func TestExecutorIdentityAndSnapshot(t *testing.T){
 r:=NewRegistry();info:=&pluginv1.PluginInfo{Name:"agent"}
 a,_:=r.Register(info,[]string{"agent","executor:one"},"host1:50054")
 b,_:=r.Register(info,[]string{"agent","executor:two"},"host2:50054")
 if a==b || len(r.GetAgents(true))!=2 {t.Fatal("executors collided")}
 fresh:=NewRegistry();again,_:=fresh.Register(info,[]string{"agent","executor:one"},"new-address:50054");if again!=a {t.Fatal("identity changed")}
 snapshot,_:=r.GetPlugin(a);snapshot.Address="changed";snapshot.Info.Name="changed"
 original,_:=r.GetPlugin(a);if original.Address=="changed" || original.Info.Name=="changed" {t.Fatal("registry leaked mutable pointers")}
}
