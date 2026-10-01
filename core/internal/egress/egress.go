// Package egress performs plugin outbound HTTP requests on Core's behalf and
// enforces each plugin's declared host allow-list. It is the single sanctioned
// path for plugin network access; direct plugin sockets are discouraged by
// contract (a plugin must declare `permissions.egress` in its manifest).
package egress

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/url"
	"strings"
	"time"

	"0kay/core/internal/netguard"
)

// maxResponseBytes caps a proxied response body.
const maxResponseBytes = 32 << 20

// guardedTransport is reused across egress calls so connections are pooled; its
// dialer refuses metadata/link-local (and, in strict mode, private) addresses.
var guardedTransport = netguard.Transport(netguard.Strict())

// Request is a plugin's outbound HTTP request.
type Request struct {
	Method  string
	URL     string
	Headers map[string]string
	Body    []byte
	Timeout time.Duration
}

// Response is the upstream result.
type Response struct {
	Status  int
	Headers map[string]string
	Body    []byte
}

// Allowed reports whether rawURL's host matches one of the allow-list patterns.
// A pattern is a hostname, "host:port" or IP; a leading "*." matches any
// subdomain. An empty allow-list denies everything (built-ins bypass this in
// the callers).
func Allowed(patterns []string, rawURL string) bool {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return false
	}
	return HostAllowed(patterns, parsed)
}

// HostAllowed is Allowed for an already-parsed URL.
func HostAllowed(patterns []string, parsed *url.URL) bool {
	if parsed == nil {
		return false
	}
	host := strings.ToLower(parsed.Hostname())
	port := parsed.Port()
	for _, pattern := range patterns {
		if matchHost(strings.TrimSpace(pattern), host, port) {
			return true
		}
	}
	return false
}

func matchHost(pattern, host, port string) bool {
	if pattern == "" {
		return false
	}
	pattern = strings.ToLower(pattern)
	// Strip a scheme if the author wrote a URL.
	if i := strings.Index(pattern, "://"); i >= 0 {
		pattern = pattern[i+3:]
	}
	pattern = strings.TrimSuffix(pattern, "/")
	if strings.Contains(pattern, "/") {
		pattern = pattern[:strings.Index(pattern, "/")]
	}

	patternPort := ""
	if h, p, err := net.SplitHostPort(pattern); err == nil {
		pattern = h
		patternPort = p
	}
	if patternPort != "" && patternPort != port {
		return false
	}
	if pattern == "*" {
		return true
	}
	if strings.HasPrefix(pattern, "*.") {
		suffix := pattern[1:] // ".example.com"
		return host == pattern[2:] || strings.HasSuffix(host, suffix)
	}
	return host == pattern
}

// Do validates the request against the allow-list, then executes it. Every
// redirect is re-checked so a permitted host cannot bounce to a forbidden one.
func Do(ctx context.Context, req Request, allowlist []string) (Response, error) {
	method := strings.ToUpper(strings.TrimSpace(req.Method))
	if method == "" {
		method = http.MethodGet
	}
	parsed, err := url.Parse(strings.TrimSpace(req.URL))
	if err != nil {
		return Response{}, fmt.Errorf("invalid url: %w", err)
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return Response{}, fmt.Errorf("unsupported scheme %q", parsed.Scheme)
	}
	if !HostAllowed(allowlist, parsed) {
		return Response{}, fmt.Errorf("egress to %q is not permitted", parsed.Host)
	}
	if err := netguard.CheckURL(parsed.String(), netguard.Strict()); err != nil {
		return Response{}, err
	}

	timeout := req.Timeout
	if timeout <= 0 {
		timeout = 60 * time.Second
	}
	client := &http.Client{
		Timeout:   timeout,
		Transport: guardedTransport,
		CheckRedirect: func(next *http.Request, via []*http.Request) error {
			if len(via) >= 10 {
				return fmt.Errorf("too many redirects")
			}
			if !HostAllowed(allowlist, next.URL) {
				return fmt.Errorf("redirect to %q is not permitted", next.URL.Host)
			}
			if err := netguard.CheckURL(next.URL.String(), netguard.Strict()); err != nil {
				return err
			}
			return nil
		},
	}

	outbound, err := http.NewRequestWithContext(ctx, method, parsed.String(), bytes.NewReader(req.Body))
	if err != nil {
		return Response{}, err
	}
	for key, value := range req.Headers {
		// Host is derived from the URL; forbidding it blocks an allow-list bypass.
		if strings.EqualFold(key, "Host") || strings.EqualFold(key, "Content-Length") {
			continue
		}
		outbound.Header.Set(key, value)
	}
	if len(req.Body) > 0 && outbound.Header.Get("Content-Type") == "" {
		outbound.Header.Set("Content-Type", "application/json")
	}

	resp, err := client.Do(outbound)
	if err != nil {
		return Response{}, err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(io.LimitReader(resp.Body, maxResponseBytes))
	if err != nil {
		return Response{}, err
	}
	headers := make(map[string]string, len(resp.Header))
	for key := range resp.Header {
		headers[key] = resp.Header.Get(key)
	}
	return Response{Status: resp.StatusCode, Headers: headers, Body: body}, nil
}
