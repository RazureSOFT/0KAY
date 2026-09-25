package registry

import (
	pluginv1 "0kay/gen/plugin/v1"
	"testing"
)

func TestExecutorIdentityAndSnapshot(t *testing.T) {
	r := NewRegistry()
	info := &pluginv1.PluginInfo{Name: "agent"}
	a, _ := r.Register(info, []string{"agent", "executor:one"}, "host1:50054")
	b, _ := r.Register(info, []string{"agent", "executor:two"}, "host2:50054")
	if a == b || len(r.GetAgents(true)) != 2 {
		t.Fatal("executors collided")
	}
	fresh := NewRegistry()
	again, _ := fresh.Register(info, []string{"agent", "executor:one"}, "new-address:50054")
	if again != a {
		t.Fatal("identity changed")
	}
	snapshot, _ := r.GetPlugin(a)
	snapshot.Address = "changed"
	snapshot.Info.Name = "changed"
	original, _ := r.GetPlugin(a)
	if original.Address == "changed" || original.Info.Name == "changed" {
		t.Fatal("registry leaked mutable pointers")
	}
}

func TestDependenciesGateDiscovery(t *testing.T) {
	r := NewRegistry()
	agent, _ := r.Register(&pluginv1.PluginInfo{Name: "agent"}, []string{"agent", "requires:mocr"}, "localhost:50054")
	if len(r.GetAgents(true)) != 0 || len(r.MissingDependencies(agent)) != 1 {
		t.Fatal("missing dependency did not block scheduling")
	}
	r.Register(&pluginv1.PluginInfo{Name: "mocr"}, []string{"mocr"}, "localhost:50052")
	if len(r.GetAgents(true)) != 1 {
		t.Fatal("dependency restoration did not enable executor")
	}
	r.SetEnabled("mocr", false)
	if len(r.GetAgents(true)) != 0 {
		t.Fatal("disabled dependency was ignored")
	}
}
