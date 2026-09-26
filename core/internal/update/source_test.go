package update

import "testing"

func TestComponentForPackage(t *testing.T) {
	for _, tc := range []struct {
		pkg, id string
		ok      bool
	}{
		{"@razuresoft/0kay-core", "core", true},
		{"@razuresoft/0kay-webui", "webui", true},
		{"@razuresoft/0kay-pm", "pm", true},
		{"@razuresoft/0kay", "", false},
		{"@razureink/0kay-compat", "@razureink/0kay-compat", true},
		{"", "", false},
	} {
		id, ok := ComponentForPackage(tc.pkg)
		if id != tc.id || ok != tc.ok {
			t.Errorf("ComponentForPackage(%q) = (%q, %v), want (%q, %v)", tc.pkg, id, ok, tc.id, tc.ok)
		}
	}
}

func TestEverySourceComponentIsAddressable(t *testing.T) {
	for _, name := range []string{"core", "mocr", "life", "agent", "webui", "searxng", "mcp", "minecraft", "pm"} {
		if _, ok := PackageFor(name); !ok {
			t.Errorf("PackageFor(%q) not defined", name)
		}
		if _, ok := componentSubdir(name); !ok {
			t.Errorf("componentSubdir(%q) not defined", name)
		}
		if !CanUpdate(name) {
			t.Errorf("CanUpdate(%q) = false, want true", name)
		}
	}
	if CanUpdate("not-a-real-component") {
		t.Error("CanUpdate(unknown) = true, want false")
	}
}
