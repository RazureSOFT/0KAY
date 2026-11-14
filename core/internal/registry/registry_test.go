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

func TestRegisterRefusesAnUnknownAPIMajor(t *testing.T) {
	r := NewRegistry()
	if _, err := r.Register(&pluginv1.PluginInfo{Name: "future", ApiVersion: "2.0"}, []string{"tts"}, "127.0.0.1:1"); err == nil {
		t.Fatal("a 2.x plugin must not register against a 1.x Core")
	}
	// An empty version is what every existing plugin sends; it means 1.x.
	if _, err := r.Register(&pluginv1.PluginInfo{Name: "old"}, []string{"tts"}, "127.0.0.1:2"); err != nil {
		t.Fatalf("a plugin without api_version must still register: %v", err)
	}
	if _, err := r.Register(&pluginv1.PluginInfo{Name: "current", ApiVersion: "1.4"}, []string{"tts"}, "127.0.0.1:3"); err != nil {
		t.Fatalf("1.x must register: %v", err)
	}
}

func TestFirstWithCapabilityNeedsAnHTTPEndpoint(t *testing.T) {
	r := NewRegistry()
	if _, err := r.Register(&pluginv1.PluginInfo{Name: "silent"}, []string{"tts"}, "127.0.0.1:1"); err != nil {
		t.Fatal(err)
	}
	if _, ok := r.FirstWithCapability("tts"); ok {
		t.Fatal("a plugin without an HTTP surface cannot serve a routed request")
	}
	if _, err := r.Register(&pluginv1.PluginInfo{Name: "speaker", HttpEndpoint: "http://127.0.0.1:9"}, []string{"tts"}, "127.0.0.1:2"); err != nil {
		t.Fatal(err)
	}
	plugin, ok := r.FirstWithCapability("tts")
	if !ok || plugin.Info.Name != "speaker" {
		t.Fatalf("expected speaker, got %#v", plugin)
	}
	if _, ok := r.FirstWithCapability("asr"); ok {
		t.Fatal("a tts plugin must not answer for asr")
	}
}
