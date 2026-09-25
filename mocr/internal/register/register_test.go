package register

import "testing"

func TestManifestVersionFallsBackWithoutManifest(t *testing.T) {
	if got := ManifestVersion("0.1.0"); got != "0.1.0" {
		t.Fatalf("ManifestVersion fallback = %q, want %q", got, "0.1.0")
	}
}
