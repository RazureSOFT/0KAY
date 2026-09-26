//go:build windows

package update

import (
	"os"
	"strings"
	"testing"
)

func TestScriptsEmbedGitHubProxy(t *testing.T) {
	defer SetGitHubProxy("")
	SetGitHubProxy("https://gh-proxy.com")

	dir := t.TempDir()
	plan := sourcePlan{Name: "x", RepoDir: dir, Dir: dir, Env: map[string]string{}}
	script, _, err := writeSourceUpdater(dir, plan)
	if err != nil {
		t.Fatal(err)
	}
	raw, _ := os.ReadFile(script)
	want := `set "GIT_CONFIG_KEY_0=url.https://gh-proxy.com/https://github.com/.insteadOf"`
	if !strings.Contains(string(raw), want) {
		t.Fatalf("source updater missing proxy env:\n%s", raw)
	}

	up, _, err := writeUpdater(dir, "0kay-pm", "@razureink/0kay-compat", "@razureink/0kay-compat@1")
	if err != nil {
		t.Fatal(err)
	}
	rawUp, _ := os.ReadFile(up)
	if !strings.Contains(string(rawUp), "gh-proxy.com") {
		t.Fatalf("pm updater missing proxy env:\n%s", rawUp)
	}

	installer, _, err := writeInstaller(dir, "0kay-pm", "@razureink/0kay-compat")
	if err != nil {
		t.Fatal(err)
	}
	rawInstaller, _ := os.ReadFile(installer)
	if !strings.Contains(string(rawInstaller), "gh-proxy.com") {
		t.Fatalf("installer missing proxy env:\n%s", rawInstaller)
	}
}
