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
