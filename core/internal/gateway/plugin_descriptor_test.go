package gateway

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"testing"
	"time"

	"0kay/core/internal/registry"
	corev1 "0kay/gen/core/v1"
	pluginv1 "0kay/gen/plugin/v1"
)

func TestDescriptorKind(t *testing.T) {
	cases := map[string]string{
		"PLUGIN_TYPE_PERSONA":     "service",
		"PLUGIN_TYPE_SERVICE":     "service",
		"PLUGIN_TYPE_TOOL":        "tool",
		"PLUGIN_TYPE_ADAPTER":     "bridge",
		"PLUGIN_TYPE_MESSAGING":   "bridge",
		"PLUGIN_TYPE_UNSPECIFIED": "unknown",
	}
	for pluginType, want := range cases {
		if got := descriptorKind(pluginType); got != want {
			t.Fatalf("descriptorKind(%q) = %q, want %q", pluginType, got, want)
		}
	}
}

func TestPluginSurfacesListsPageModules(t *testing.T) {
	dataDir := t.TempDir()
	t.Setenv("CORE_DATA_DIR", dataDir)

	root := filepath.Join(dataDir, "plugin-ui", "demo")
	mustWrite(t, filepath.Join(root, "index.js"), "export default {}")
	mustWrite(t, filepath.Join(root, "memory.js"), "export default {}")
	mustWrite(t, filepath.Join(root, "strings", "values", "strings.xml"), "<resources/>")
	mustWrite(t, filepath.Join(root, "notes.txt"), "not a module")

	surfaces := pluginSurfaces("demo")
	if len(surfaces) != 2 {
		t.Fatalf("want 2 page modules, got %d: %+v", len(surfaces), surfaces)
	}
	if surfaces[0].ID != "index" || surfaces[1].ID != "memory" {
		t.Fatalf("surfaces are not sorted by id: %+v", surfaces)
	}
	if surfaces[0].Module != "/api/plugins/demo/ui/index.js" {
		t.Fatalf("unexpected module path %q", surfaces[0].Module)
	}
	if surfaces[0].Target != "page" {
		t.Fatalf("unexpected target %q", surfaces[0].Target)
	}
}

func TestPluginSurfacesForAMissingPluginIsEmpty(t *testing.T) {
	t.Setenv("CORE_DATA_DIR", t.TempDir())
	if got := pluginSurfaces("nobody"); len(got) != 0 {
		t.Fatalf("want no surfaces, got %+v", got)
	}
}

func TestDescriptorCarriesIdentityAndThresholds(t *testing.T) {
	dataDir := t.TempDir()
	t.Setenv("CORE_DATA_DIR", dataDir)
	plugin := testPluginInstance("life", "0.1.2", "PLUGIN_TYPE_PERSONA")

	descriptor := descriptorFor(plugin, false)
	if descriptor.ID != "life" || descriptor.Name != "life" || descriptor.Version != "0.1.2" {
		t.Fatalf("identity is wrong: %+v", descriptor)
	}
	if descriptor.Kind != "service" {
		t.Fatalf("kind = %q, want service", descriptor.Kind)
	}
	if descriptor.Health.DegradedAfterSeconds != pluginDegradedAfter.Seconds() {
		t.Fatalf("degraded threshold does not match the gateway's")
	}
	if descriptor.Health.StaleAfterSeconds != pluginStaleAfter.Seconds() {
		t.Fatalf("stale threshold does not match the gateway's")
	}
	if descriptor.Lifecycle != PhaseStarting {
		t.Fatalf("a fresh registration with no heartbeat should be starting, got %q", descriptor.Lifecycle)
	}
}

func TestDescriptorOfADisabledPluginReadsStopped(t *testing.T) {
	t.Setenv("CORE_DATA_DIR", t.TempDir())
	plugin := testPluginInstance("agent", "0.1.2", "PLUGIN_TYPE_TOOL")
	if got := descriptorFor(plugin, true).Lifecycle; got != PhaseStopped {
		t.Fatalf("lifecycle = %q, want stopped", got)
	}
}

func mustWrite(t *testing.T, path string, body string) {
	t.Helper()
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		t.Fatalf("mkdir: %v", err)
	}
	if err := os.WriteFile(path, []byte(body), 0o644); err != nil {
		t.Fatalf("write: %v", err)
	}
}

func testPluginInstance(name, version, pluginType string) *registry.PluginInstance {
	return &registry.PluginInstance{
		PluginID:     "plugin_" + name,
		Capabilities: []string{"agent"},
		Status:       corev1.PluginStatus_PLUGIN_STATUS_HEALTHY,
		RegisteredAt: time.Now(),
		Info: &pluginv1.PluginInfo{
			Name:       name,
			Version:    version,
			PluginType: pluginv1.PluginType(pluginv1.PluginType_value[pluginType]),
			Permissions: &pluginv1.PluginPermission{
				ApiRequires: []string{"GET /api/files"},
				Egress:      []string{"*"},
			},
		},
	}
}

func TestDescriptorEndpointServesJSON(t *testing.T) {
	dataDir := t.TempDir()
	t.Setenv("CORE_DATA_DIR", dataDir)
	mustWrite(t, filepath.Join(dataDir, "plugin-ui", "life", "companion.js"), "export default {}")

	g := &Gateway{registry: registry.NewRegistry()}
	g.registry.SetEnabled("life", false)
	request := httptest.NewRequest(http.MethodGet, "/api/plugins/life/descriptor", nil)
	request.SetPathValue("name", "life")
	recorder := httptest.NewRecorder()
	g.handlePluginDescriptor(recorder, request)

	// Nothing is registered in this process, so this is the "installed but not
	// running" answer — which still describes the plugin and finds its pages.
	if recorder.Code != http.StatusOK || !json.Valid(recorder.Body.Bytes()) {
		t.Fatalf("descriptor: %d %s", recorder.Code, recorder.Body.String())
	}
	var body PluginDescriptor
	if err := json.Unmarshal(recorder.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if body.Name != "life" || body.Lifecycle != PhaseStopped {
		t.Fatalf("unexpected descriptor: %+v", body)
	}
	if len(body.Surfaces) != 1 || body.Surfaces[0].ID != "companion" {
		t.Fatalf("surfaces not discovered: %+v", body.Surfaces)
	}
}

func TestDescriptorEndpointRejectsWritesAndUnknownPlugins(t *testing.T) {
	t.Setenv("CORE_DATA_DIR", t.TempDir())
	g := &Gateway{registry: registry.NewRegistry()}

	post := httptest.NewRequest(http.MethodPost, "/api/plugins/life/descriptor", nil)
	post.SetPathValue("name", "life")
	recorder := httptest.NewRecorder()
	g.handlePluginDescriptor(recorder, post)
	if recorder.Code != http.StatusMethodNotAllowed {
		t.Fatalf("POST should be rejected, got %d", recorder.Code)
	}

	get := httptest.NewRequest(http.MethodGet, "/api/plugins/nobody/descriptor", nil)
	get.SetPathValue("name", "nobody")
	missing := httptest.NewRecorder()
	g.handlePluginDescriptor(missing, get)
	if missing.Code != http.StatusNotFound {
		t.Fatalf("unknown plugin should be 404, got %d", missing.Code)
	}
}
