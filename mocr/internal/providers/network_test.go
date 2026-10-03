package providers

import (
	"context"
	"net"
	"testing"
)

func TestMetadataCannotBeDialed(t *testing.T) {
	for _, address := range []string{"169.254.169.254:80", "100.100.100.200:80", "[fd00:ec2::254]:80"} {
		if conn, err := guardedDial(context.Background(), "tcp", address); err == nil {
			conn.Close()
			t.Fatal("metadata admitted", address)
		}
	}
	t.Setenv("MOCR_SSRF_STRICT", "1")
	if !blockedAddress(net.ParseIP("127.0.0.1")) {
		t.Fatal("strict loopback admitted")
	}
}
