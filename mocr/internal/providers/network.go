package providers

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

func blockedAddress(ip net.IP) bool {
	if ip == nil || ip.IsUnspecified() || ip.IsMulticast() || ip.IsLinkLocalUnicast() || ip.IsLinkLocalMulticast() {
		return true
	}
	for _, cidr := range []string{"100.64.0.0/10", "192.0.0.0/24", "198.18.0.0/15", "240.0.0.0/4", "fd00:ec2::254/128"} {
		_, network, _ := net.ParseCIDR(cidr)
		if network.Contains(ip) {
			return true
		}
	}
	return os.Getenv("MOCR_SSRF_STRICT") == "1" && (ip.IsPrivate() || ip.IsLoopback())
}

func guardedDial(ctx context.Context, network, address string) (net.Conn, error) {
	host, port, err := net.SplitHostPort(address)
	if err != nil {
		return nil, err
	}
	if strings.HasPrefix(strings.ToLower(host), "metadata.") || host == "metadata" {
		return nil, fmt.Errorf("metadata host blocked")
	}
	ips, err := net.DefaultResolver.LookupIPAddr(ctx, host)
	if err != nil {
		return nil, err
	}
	dialer := net.Dialer{Timeout: 10 * time.Second}
	for _, ip := range ips {
		if blockedAddress(ip.IP) {
			return nil, fmt.Errorf("outbound address blocked")
		}
	}
	for _, ip := range ips {
		conn, dialErr := dialer.DialContext(ctx, network, net.JoinHostPort(ip.IP.String(), port))
		if dialErr == nil {
			return conn, nil
		}
		err = dialErr
	}
	if err == nil {
		err = fmt.Errorf("no usable address")
	}
	return nil, err
}

func validateProviderURL(raw string) error {
	parsed, err := url.Parse(raw)
	if err != nil || parsed.Hostname() == "" || (parsed.Scheme != "http" && parsed.Scheme != "https") || parsed.User != nil {
		return fmt.Errorf("invalid provider URL")
	}
	return nil
}

func noProviderRedirect(req *http.Request, via []*http.Request) error { return http.ErrUseLastResponse }
