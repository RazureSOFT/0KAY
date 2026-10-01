// Package netguard guards outbound HTTP connections against the classic SSRF
// targets: cloud metadata endpoints and link-local addresses. Private and
// loopback ranges stay reachable by default because local model servers
// (Ollama, LM Studio, ...) are a first-class use case; set CORE_SSRF_STRICT=1
// to also block loopback and RFC1918 ranges.
//
// The guard is enforced at dial time (DialContext) so a DNS name cannot rebind
// to a blocked address between the URL check and the connection.
package netguard

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"
)

// alwaysBlocked are non-routable / special-purpose ranges that must never be
// dialed even in non-strict mode: CGNAT (which includes Alibaba Cloud's
// 100.100.100.200 metadata endpoint), IETF protocol assignments, benchmarking
// ranges and the reserved class E block.
var alwaysBlocked = func() []*net.IPNet {
	nets := make([]*net.IPNet, 0, 4)
	for _, cidr := range []string{"100.64.0.0/10", "192.0.0.0/24", "198.18.0.0/15", "240.0.0.0/4"} {
		if _, n, err := net.ParseCIDR(cidr); err == nil {
			nets = append(nets, n)
		}
	}
	return nets
}()

func inAlwaysBlocked(ip net.IP) bool {
	for _, network := range alwaysBlocked {
		if network.Contains(ip) {
			return true
		}
	}
	return false
}

// blockedHosts are metadata hostnames that must never be dialed, even if they
// resolve somewhere unexpected.
var blockedHosts = map[string]bool{
	"metadata":                 true,
	"metadata.google.internal": true,
	"metadata.goog":            true,
}

// metadataIPv6 is the AWS EC2 IPv6 metadata endpoint.
var metadataIPv6 = net.ParseIP("fd00:ec2::254")

// Strict reports whether loopback and private targets are also blocked.
func Strict() bool {
	switch strings.ToLower(strings.TrimSpace(os.Getenv("CORE_SSRF_STRICT"))) {
	case "1", "true", "yes", "on":
		return true
	}
	return false
}

// blockedIP reports whether an address may not be dialed. Metadata and
// link-local addresses are always refused; loopback/private only when strict.
func blockedIP(ip net.IP, strict bool) bool {
	if ip == nil {
		return true
	}
	if ip.IsUnspecified() || ip.IsMulticast() || ip.IsLinkLocalUnicast() || ip.IsLinkLocalMulticast() {
		return true
	}
	if metadataIPv6 != nil && ip.Equal(metadataIPv6) {
		return true
	}
	if inAlwaysBlocked(ip) {
		return true
	}
	if strict && (ip.IsLoopback() || ip.IsPrivate()) {
		return true
	}
	return false
}

// CheckURL validates a target URL's host at request time. Unlike the dial-time
// guard this is not authoritative, but it closes the case where an operator
// proxy (HTTP_PROXY) would otherwise mean the target host is never resolved
// locally. Every redirect should be re-checked with it too.
func CheckURL(raw string, strict bool) error {
	parsed, err := url.Parse(strings.TrimSpace(raw))
	if err != nil {
		return fmt.Errorf("invalid url: %w", err)
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return fmt.Errorf("unsupported scheme %q", parsed.Scheme)
	}
	host := parsed.Hostname()
	if host == "" {
		return fmt.Errorf("url has no host")
	}
	if BlockedHost(host) {
		return fmt.Errorf("egress to %q is not permitted", host)
	}
	if ip := net.ParseIP(host); ip != nil {
		if blockedIP(ip, strict) {
			return fmt.Errorf("egress to %q is not permitted", host)
		}
		return nil
	}
	ips, err := net.DefaultResolver.LookupIPAddr(context.Background(), host)
	if err != nil {
		return err
	}
	for _, candidate := range ips {
		if blockedIP(candidate.IP, strict) {
			return fmt.Errorf("egress to %q is not permitted", host)
		}
	}
	return nil
}

// BlockedHost reports whether host is a known metadata hostname.
func BlockedHost(host string) bool {
	return blockedHosts[strings.ToLower(strings.TrimSpace(host))]
}

// DialContext returns a dialer that resolves the target and refuses to connect
// to a blocked address. The connection is made to the resolved IP (not the
// name), so a rebinding resolver cannot redirect an already-vetted name.
func DialContext(strict bool) func(ctx context.Context, network, addr string) (net.Conn, error) {
	dialer := &net.Dialer{Timeout: 10 * time.Second}
	return func(ctx context.Context, network, addr string) (net.Conn, error) {
		host, port, err := net.SplitHostPort(addr)
		if err != nil {
			return nil, err
		}
		if BlockedHost(host) {
			return nil, fmt.Errorf("egress to %q is not permitted", host)
		}

		// An IP literal resolves to itself.
		if ip := net.ParseIP(host); ip != nil {
			if blockedIP(ip, strict) {
				return nil, fmt.Errorf("egress to %q is not permitted", host)
			}
			return dialer.DialContext(ctx, network, net.JoinHostPort(ip.String(), port))
		}

		ips, err := net.DefaultResolver.LookupIPAddr(ctx, host)
		if err != nil {
			return nil, err
		}
		var lastErr error
		permitted := 0
		for _, candidate := range ips {
			if blockedIP(candidate.IP, strict) {
				continue
			}
			permitted++
			conn, dialErr := dialer.DialContext(ctx, network, net.JoinHostPort(candidate.IP.String(), port))
			if dialErr == nil {
				return conn, nil
			}
			lastErr = dialErr
		}
		if permitted == 0 {
			return nil, fmt.Errorf("egress to %q is not permitted", host)
		}
		return nil, lastErr
	}
}

// Transport returns an http.Transport whose dials are guarded. No
// ResponseHeaderTimeout is set so streaming/long-poll responses are unaffected;
// callers bound the request with a context.
func Transport(strict bool) *http.Transport {
	return &http.Transport{
		Proxy:               http.ProxyFromEnvironment,
		DialContext:         DialContext(strict),
		ForceAttemptHTTP2:   true,
		MaxIdleConns:        100,
		IdleConnTimeout:     90 * time.Second,
		TLSHandshakeTimeout: 10 * time.Second,
	}
}
