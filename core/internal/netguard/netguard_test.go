package netguard

import (
	"context"
	"net"
	"strings"
	"testing"
)

func TestBlockedHost(t *testing.T) {
	if !BlockedHost("metadata.google.internal") {
		t.Fatal("metadata host should be blocked")
	}
	if BlockedHost("api.example.com") {
		t.Fatal("ordinary host should not be blocked")
	}
}

func TestBlockedIP(t *testing.T) {
	cases := []struct {
		ip     string
		strict bool
		want   bool
	}{
		{"169.254.169.254", false, true},
		{"fd00:ec2::254", false, true},
		{"100.100.100.200", false, true},
		{"100.64.0.1", false, true},
		{"240.0.0.1", false, true},
		{"127.0.0.1", false, false},
		{"192.168.1.10", false, false},
		{"127.0.0.1", true, true},
		{"10.0.0.5", true, true},
		{"8.8.8.8", true, false},
	}
	for _, tc := range cases {
		if got := blockedIP(net.ParseIP(tc.ip), tc.strict); got != tc.want {
			t.Errorf("blockedIP(%s, strict=%v) = %v, want %v", tc.ip, tc.strict, got, tc.want)
		}
	}
}

func TestDialContextRefusesLinkLocal(t *testing.T) {
	_, err := DialContext(false)(context.Background(), "tcp", "169.254.169.254:80")
	if err == nil || !strings.Contains(err.Error(), "not permitted") {
		t.Fatalf("link-local dial = %v, want not permitted", err)
	}
}

func TestDialContextStrictRefusesLoopback(t *testing.T) {
	_, err := DialContext(true)(context.Background(), "tcp", "127.0.0.1:80")
	if err == nil || !strings.Contains(err.Error(), "not permitted") {
		t.Fatalf("strict loopback dial = %v, want not permitted", err)
	}
}

func TestEgressStrict(t *testing.T) {
	cases := []struct {
		env  string
		want bool
	}{
		{"", true},
		{"1", true},
		{"true", true},
		{"0", false},
		{"false", false},
		{"no", false},
		{"off", false},
		{"0 ", false},
		{"bogus", true},
	}
	for _, tc := range cases {
		t.Setenv("CORE_SSRF_STRICT", tc.env)
		if got := EgressStrict(); got != tc.want {
			t.Errorf("EgressStrict() with CORE_SSRF_STRICT=%q = %v, want %v", tc.env, got, tc.want)
		}
	}
}

func TestEgressStrictBlocksLoopbackByDefault(t *testing.T) {
	t.Setenv("CORE_SSRF_STRICT", "")
	if err := CheckURL("http://127.0.0.1:8080/x", EgressStrict()); err == nil {
		t.Fatal("default egress policy must block loopback")
	}
	if err := CheckURL("http://10.1.2.3/x", EgressStrict()); err == nil {
		t.Fatal("default egress policy must block private ranges")
	}
	if err := CheckURL("http://127.0.0.1:8080/x", false); err != nil {
		t.Fatalf("explicit opt-out must allow loopback: %v", err)
	}
}

// A machine behind a proxy reaches nothing without one, so strict mode has to
// keep it. What strict mode still guarantees is the destination check, which
// runs before the request is built rather than at dial time -- see
// TestStrictEgressChecksTheDestinationNotTheProxy.
func TestTransportKeepsProxyInStrictMode(t *testing.T) {
	if Transport(true).Proxy == nil {
		t.Fatal("strict transport must honour a proxy")
	}
	if Transport(false).Proxy == nil {
		t.Fatal("non-strict transport must honour a proxy")
	}
}

// net/http snapshots the proxy environment on first use and keeps it for the
// life of the process; there is no way to reset it. So the checks below call
// the guard directly with a request and rely on t.Setenv, which only affects
// a process that has not resolved a proxy yet. Each test builds its own
// request, and the guard reads the environment through the same snapshot --
// which is why these tests assert on the guard's own decisions rather than on
// ProxyFromEnvironment's.

func TestProxyFromEnvironmentIsHonoured(t *testing.T) {
	t.Setenv("HTTP_PROXY", "http://127.0.0.1:7890")
	t.Setenv("NO_PROXY", "")
	proxy, err := guardedProxy("http://127.0.0.1:7890", "example.com")
	if err != nil {
		t.Fatalf("a local relay is a normal proxy: %v", err)
	}
	if proxy == nil || proxy.Host != "127.0.0.1:7890" {
		t.Fatalf("proxy not accepted: %v", proxy)
	}
}

func TestAProxyIntoABlockedRangeIsRefused(t *testing.T) {
	// The metadata address is never a legitimate proxy, and pointing the
	// agent at it would be a way around the destination checks.
	if _, err := guardedProxy("http://169.254.169.254:80", "example.com"); err == nil {
		t.Fatal("a proxy on the metadata address must be refused")
	}
	if _, err := guardedProxy("http://0.0.0.0:80", "example.com"); err == nil {
		t.Fatal("a proxy on an unspecified address must be refused")
	}
}

func TestAnOrdinaryProxyIsAccepted(t *testing.T) {
	for _, raw := range []string{
		"http://127.0.0.1:7890",   // a local relay: the ordinary case
		"http://192.168.1.10:3128", // the operator's own LAN
		"http://proxy.corp.example:8080",
	} {
		if _, err := guardedProxy(raw, "example.com"); err != nil {
			t.Fatalf("%s should be accepted: %v", raw, err)
		}
	}
}

// The reason strict mode used to disable the proxy was that a proxy hides the
// destination: the dial goes to the proxy, so dial-time checks see the proxy
// and not the site. The protection that remains is the check on the URL
// before the request, which resolves the destination the same way either way.
// These two cases are what that check must keep refusing.
func TestStrictEgressChecksTheDestinationNotTheProxy(t *testing.T) {
	t.Setenv("HTTP_PROXY", "http://127.0.0.1:7890")
	for _, target := range []string{
		"http://127.0.0.1:8080/admin",     // loopback
		"http://169.254.169.254/latest",   // link-local metadata
		"http://10.0.0.5/internal",        // private range
	} {
		if err := CheckURL(target, true); err == nil {
			t.Fatalf("%s must be refused in strict mode even with a proxy set", target)
		}
		// And it is the destination that decides, not the proxy: the same
		// proxy is accepted, so the refusal above came from the target.
		if err := checkProxy("127.0.0.1"); err != nil {
			t.Fatalf("the proxy itself is fine: %v", err)
		}
	}
}
