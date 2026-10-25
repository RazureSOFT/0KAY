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
	"sync"
	"time"

	"0kay/core/internal/netguard"
)

const maxResponseBytes = 32 << 20

// The plugin egress path is strict by default (loopback and private ranges
// are blocked); only an explicit CORE_SSRF_STRICT=0 opts out. The flag is
// read per call so tests and runtime changes are honored. Transports are
// cached per strictness so connection pooling still works.
var (
	transportsMu sync.Mutex
	transports   = map[bool]*http.Transport{}
)

func guardedTransport(strict bool) *http.Transport {
	transportsMu.Lock()
	defer transportsMu.Unlock()
	if t, ok := transports[strict]; ok {
		return t
	}
	t := netguard.Transport(strict)
	transports[strict] = t
	return t
}

type Request struct {
	Method  string
	URL     string
	Headers map[string]string
	Body    []byte
	Timeout time.Duration
}

type Response struct {
	Status  int
	Headers map[string]string
	Body    []byte
}

func Allowed(patterns []string, rawURL string) bool {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return false
	}
	return HostAllowed(patterns, parsed)
}

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
		suffix := pattern[1:]
		return host == pattern[2:] || strings.HasSuffix(host, suffix)
	}
	return host == pattern
}

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
	strict := netguard.EgressStrict()
	if err := netguard.CheckURL(parsed.String(), strict); err != nil {
		return Response{}, err
	}

	timeout := req.Timeout
	if timeout <= 0 {
		timeout = 60 * time.Second
	}
	client := &http.Client{
		Timeout:   timeout,
		Transport: guardedTransport(strict),
		CheckRedirect: func(next *http.Request, via []*http.Request) error {
			if len(via) >= 10 {
				return fmt.Errorf("too many redirects")
			}
			if !HostAllowed(allowlist, next.URL) {
				return fmt.Errorf("redirect to %q is not permitted", next.URL.Host)
			}
			if err := netguard.CheckURL(next.URL.String(), strict); err != nil {
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
