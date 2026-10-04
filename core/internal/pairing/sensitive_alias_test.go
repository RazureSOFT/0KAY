package pairing

import (
	"net/http/httptest"
	"testing"
)

func TestSensitiveOperationAliases(t *testing.T) {
	for _, path := range []string{"/api/plugins/install", "/api/plugins/pm/install", "/api/plugins/pm/uninstall", "/api/plugins/pm/update", "/api/life/permissions"} {
		if !sensitiveRequest(httptest.NewRequest("POST", path, nil)) {
			t.Errorf("PIN gate misses %s", path)
		}
	}
	if sensitiveRequest(httptest.NewRequest("GET", "/api/life/permissions", nil)) {
		t.Fatal("permission reads should not prompt")
	}
}
