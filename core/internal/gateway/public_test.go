package gateway

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

// A deployment on a real domain must be reachable once the operator lists it,
// in any of the three documented spellings.
func TestHostAllowedAcceptsConfiguredForms(t *testing.T) {
	cases := []struct {
		name  string
		env   string
		value string
	}{
		{"bare hostname", "CORE_ALLOWED_HOSTS", "core.example.com"},
		{"host and port", "CORE_ALLOWED_HOSTS", "core.example.com:8443"},
		{"origin url", "CORE_ALLOWED_HOSTS", "https://core.example.com"},
		{"origin url via origins", "CORE_ALLOWED_ORIGINS", "https://core.example.com"},
		{"origin url with port via origins", "CORE_ALLOWED_ORIGINS", "https://core.example.com:8443"},
		{"bare hostname via origins", "CORE_ALLOWED_ORIGINS", "core.example.com"},
		{"trailing slash", "CORE_ALLOWED_ORIGINS", "https://core.example.com/"},
		{"list entry", "CORE_ALLOWED_HOSTS", "other.example.net,core.example.com"},
	}
	for _, testCase := range cases {
		t.Run(testCase.name, func(t *testing.T) {
			t.Setenv("CORE_ALLOWED_HOSTS", "")
			t.Setenv("CORE_ALLOWED_ORIGINS", "")
			t.Setenv(testCase.env, testCase.value)
			for _, host := range []string{"core.example.com", "core.example.com:8443", "CORE.example.com."} {
				if !hostAllowed(host) {
					t.Fatalf("%s=%q rejected Host %q", testCase.env, testCase.value, host)
				}
			}
		})
	}
}

func TestHostAllowedRejectsUnlistedDottedHost(t *testing.T) {
	t.Setenv("CORE_ALLOWED_HOSTS", "core.example.com")
	t.Setenv("CORE_ALLOWED_ORIGINS", "")
	for _, host := range []string{"evil.example", "attacker.test:8080", ""} {
		if hostAllowed(host) {
			t.Fatalf("unlisted host %q accepted", host)
		}
	}
}

// Loopback, IP literals and single-label service names cannot be used for DNS
// rebinding, so they stay reachable with no configuration at all.
func TestHostAllowedAcceptsLiteralsAndSingleLabel(t *testing.T) {
	t.Setenv("CORE_ALLOWED_HOSTS", "")
	t.Setenv("CORE_ALLOWED_ORIGINS", "")
	for _, host := range []string{"localhost", "localhost:3000", "core", "127.0.0.1:8080", "[::1]:8080", "::1"} {
		if !hostAllowed(host) {
			t.Fatalf("host %q should always be allowed", host)
		}
	}
}

func TestHostGuardRejectsRebindingHost(t *testing.T) {
	t.Setenv("CORE_ALLOWED_HOSTS", "")
	t.Setenv("CORE_ALLOWED_ORIGINS", "")
	reached := false
	handler := hostGuard(http.HandlerFunc(func(http.ResponseWriter, *http.Request) { reached = true }))

	request := httptest.NewRequest("GET", "/api/providers", nil)
	request.Host = "rebind.attacker.test"
	recorder := httptest.NewRecorder()
	handler.ServeHTTP(recorder, request)

	if reached {
		t.Fatal("handler reached for rejected host")
	}
	if recorder.Code != http.StatusForbidden {
		t.Fatalf("want 403, got %d", recorder.Code)
	}
}
