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

func TestTransportDisablesProxyInStrictMode(t *testing.T) {
	if Transport(true).Proxy != nil {
		t.Fatal("strict transport Proxy must be nil")
	}
	if Transport(false).Proxy == nil {
		t.Fatal("non-strict transport Proxy must stay ProxyFromEnvironment")
	}
}
