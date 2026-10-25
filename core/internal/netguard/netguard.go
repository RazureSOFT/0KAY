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

var blockedHosts = map[string]bool{
	"metadata":                 true,
	"metadata.google.internal": true,
	"metadata.goog":            true,
}

var metadataIPv6 = net.ParseIP("fd00:ec2::254")

func Strict() bool {
	switch strings.ToLower(strings.TrimSpace(os.Getenv("CORE_SSRF_STRICT"))) {
	case "1", "true", "yes", "on":
		return true
	}
	return false
}

// EgressStrict reports whether the plugin egress path applies strict network
// policy (block loopback and private ranges). Unlike Strict, the plugin egress
// path is strict BY DEFAULT; only an explicit CORE_SSRF_STRICT=0 (or
// false/no/off) opts out. Core's own outbound traffic keeps using Strict(),
// whose default is permissive, so internal endpoints (e.g. the mocr gRPC
// service on localhost) are unaffected.
func EgressStrict() bool {
	switch strings.ToLower(strings.TrimSpace(os.Getenv("CORE_SSRF_STRICT"))) {
	case "0", "false", "no", "off":
		return false
	}
	return true
}

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
	resolveCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	ips, err := net.DefaultResolver.LookupIPAddr(resolveCtx, host)
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

func BlockedHost(host string) bool {
	return blockedHosts[strings.ToLower(strings.TrimSpace(host))]
}

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

func Transport(strict bool) *http.Transport {
	// In strict mode the HTTP proxy is disabled: routing the connection
	// through a proxy would bypass the dial-time target checks and make the
	// strict policy meaningless.
	proxy := http.ProxyFromEnvironment
	if strict {
		proxy = nil
	}
	return &http.Transport{
		Proxy:               proxy,
		DialContext:         DialContext(strict),
		ForceAttemptHTTP2:   true,
		MaxIdleConns:        100,
		IdleConnTimeout:     90 * time.Second,
		TLSHandshakeTimeout: 10 * time.Second,
	}
}
