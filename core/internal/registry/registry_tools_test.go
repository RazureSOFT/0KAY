package registry

import (
	"testing"

	pluginv1 "0kay/gen/plugin/v1"
)

func TestListToolsAndOwner(t *testing.T) {
	r := NewRegistry()
	if _, err := r.Register(&pluginv1.PluginInfo{
		Name:    "wiki",
		Version: "1",
		Tools: []*pluginv1.PluginTool{
			{Name: "wiki.search", Description: "search", Scopes: []string{"agent", "life"}},
			{Name: "wiki.write", Description: "write", Scopes: []string{"life"}, Dangerous: true},
		},
	}, []string{"tools"}, "127.0.0.1:9"); err != nil {
		t.Fatalf("register: %v", err)
	}
	if _, err := r.Register(&pluginv1.PluginInfo{
		Name:    "notes",
		Version: "1",
		Tools:   []*pluginv1.PluginTool{{Name: "notes.add"}},
	}, []string{"tools"}, "127.0.0.1:10"); err != nil {
		t.Fatalf("register: %v", err)
	}

	all := r.ListTools("")
	if len(all) != 3 {
		t.Fatalf("ListTools(\"\") = %d, want 3", len(all))
	}
	// Sorted by name: notes.add, wiki.search, wiki.write
	if all[0].Tool.Name != "notes.add" {
		t.Fatalf("expected sorted tools, got %s first", all[0].Tool.Name)
	}

	agent := r.ListTools("agent")
	if len(agent) != 2 { // notes.add (no scopes => all) + wiki.search
		t.Fatalf("ListTools(agent) = %d, want 2", len(agent))
	}
	for _, tool := range agent {
		if tool.Tool.Name == "wiki.write" {
			t.Fatal("wiki.write must not be visible to agent")
		}
	}

	owner, tool, ok := r.ToolOwner("wiki.write")
	if !ok || owner.Info.Name != "wiki" || !tool.Dangerous {
		t.Fatalf("ToolOwner(wiki.write) = %v / %v", owner, tool)
	}
	if _, _, ok := r.ToolOwner("missing"); ok {
		t.Fatal("ToolOwner(missing) should be false")
	}
}
