package gateway

import (
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
)

var (
	allowedOrigins = sync.OnceValue(allowedOriginList)
	webuiPorts     = sync.OnceValue(allowedWebuiPorts)
)

func allowedOrigin(r *http.Request) bool {
	origin := r.Header.Get("Origin")
	if origin == "" {
		return true
	}
	parsed, err := url.Parse(origin)
	if err != nil || (parsed.Scheme != "http" && parsed.Scheme != "https") {
		return false
	}
	for _, allowed := range allowedOrigins() {
		if allowed == origin {
			return true
		}
	}
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
	return webuiPorts()[port]
}

func loopbackHost(host string) bool {
	return host == "localhost" || host == "127.0.0.1" || host == "::1"
}

func allowedOriginList() []string {
	out := []string{}
	for _, allowed := range strings.Split(os.Getenv("CORE_ALLOWED_ORIGINS"), ",") {
		if trimmed := strings.TrimSpace(allowed); trimmed != "" {
			out = append(out, trimmed)
		}
	}
	return out
}

// allowedWebuiPorts builds the loopback webui port allowlist. Only ports
// explicitly opted in via WEBUI_PORT / CORE_WEBUI_PORT (or full origins via
// CORE_ALLOWED_ORIGINS) are accepted; there is no unconditional default. For
// local development on the default Vite port, set WEBUI_PORT=3000 or add the
// origin to CORE_ALLOWED_ORIGINS.
func allowedWebuiPorts() map[string]bool {
	ports := map[string]bool{}
	for _, key := range []string{"WEBUI_PORT", "CORE_WEBUI_PORT"} {
		if value := strings.TrimSpace(os.Getenv(key)); value != "" {
			ports[value] = true
		}
	}
	return ports
}
