package gateway

import (
	"net/http"
	"net/url"
	"os"
	"strings"
)

// allowedOrigin limits browser cross-origin access to loopback frontends served
// from known ports. Non-browser callers (plugins, CLI) send no Origin header and
// are governed by the authentication middleware instead.
func allowedOrigin(r *http.Request) bool {
	origin := r.Header.Get("Origin")
	if origin == "" {
		return true
	}
	parsed, err := url.Parse(origin)
	if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") {
		return false
	}
	for _, allowed := range strings.Split(os.Getenv("CORE_ALLOWED_ORIGINS"), ",") {
		if trimmed := strings.TrimSpace(allowed); trimmed != "" && trimmed == origin {
			return true
		}
	}
	// Same host as the request is same-origin (e.g. Core serving the frontend).
	if parsed.Host == r.Host {
		return true
	}
	if !loopbackHost(parsed.Hostname()) {
		return false
	}
	port := parsed.Port()
	if port == "" {
		if parsed.Scheme == "https" {
			port = "443"
		} else {
			port = "80"
		}
	}
	return allowedWebuiPorts()[port]
}

func loopbackHost(host string) bool {
	return host == "localhost" || host == "127.0.0.1" || host == "::1"
}

// allowedWebuiPorts is the set of loopback ports a browser frontend may use.
// WEBUI_PORT tracks the 0kay-pm port choice; CORE_ALLOWED_ORIGINS remains the
// escape hatch for custom hosts.
func allowedWebuiPorts() map[string]bool {
	ports := map[string]bool{"3000": true}
	for _, key := range []string{"WEBUI_PORT", "CORE_WEBUI_PORT"} {
		if value := strings.TrimSpace(os.Getenv(key)); value != "" {
			ports[value] = true
		}
	}
	return ports
}
