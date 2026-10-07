package gateway

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

// handlePluginProxy forwards an owner/browser request to a registered plugin's
// own HTTP endpoint, injecting the service token Core issued that plugin.
//
//	GET|POST|... /api/plugins/{name}/proxy/{path...}
//
// A plugin that serves an HTTP API registers that base URL as its address (the
// minecraft service registers http://127.0.0.1:8765). Core already holds both
// that address and the plugin's service token, so the browser needs neither:
// the panel calls this same-origin route with its session and Core authenticates
// the machine hop. The target is always a registry entry, never a caller-supplied
// URL, so this cannot be pointed at an arbitrary host.
func (g *Gateway) handlePluginProxy(w http.ResponseWriter, r *http.Request) {
	name := r.PathValue("name")
	rel := r.PathValue("path")
	// Fallback when invoked outside ServeMux (unit tests).
	if name == "" {
		const prefix = "/api/plugins/"
		rest := strings.TrimPrefix(r.URL.Path, prefix)
		parts := strings.SplitN(rest, "/", 3)
		if len(parts) == 3 && parts[1] == "proxy" {
			name, rel = parts[0], parts[2]
		}
	}
	if !validPluginUIName(name) {
		notFound(w, "not found")
		return
	}
	if g.registry == nil {
		notFound(w, "not found")
		return
	}
	if g.registry.IsDisabled(name) {
		notFound(w, "plugin disabled")
		return
	}
	plugin, ok := g.registry.FindByName(name)
	if !ok || plugin == nil {
		notFound(w, "plugin not registered")
		return
	}

	base, err := url.Parse(strings.TrimRight(plugin.Address, "/"))
	if err != nil || (base.Scheme != "http" && base.Scheme != "https") || base.Host == "" {
		writeErr(w, http.StatusBadGateway, "plugin_http_unavailable",
			"plugin "+name+" exposes no HTTP endpoint (address "+plugin.Address+")")
		return
	}

	token := g.registry.Token(plugin.PluginID)
	upstreamPath := strings.TrimRight(base.Path, "/") + "/" + rel

	proxy := &httputil.ReverseProxy{
		// FlushInterval -1 flushes every write, which the plugin's SSE endpoint
		// (/events) needs.
		FlushInterval: -1,
		Rewrite: func(pr *httputil.ProxyRequest) {
			pr.Out.URL.Scheme = base.Scheme
			pr.Out.URL.Host = base.Host
			pr.Out.URL.Path = upstreamPath
			pr.Out.URL.RawQuery = r.URL.RawQuery
			pr.Out.Host = base.Host
			// Authenticate the hop as the plugin's own identity. The service
			// verifies this bearer against the token Core issued it.
			pr.Out.Header.Set("Authorization", "Bearer "+token)
			// Drop caller identity/host headers so nothing leaks and the plugin's
			// own origin allowlist does not reject a server-to-server call.
			pr.Out.Header.Del(PluginHeader)
			pr.Out.Header.Del(pluginHeaderID)
			pr.Out.Header.Del("Cookie")
			pr.Out.Header.Del("Origin")
			pr.Out.Header.Del("Referer")
		},
		ErrorHandler: func(rw http.ResponseWriter, _ *http.Request, err error) {
			writeErr(rw, http.StatusBadGateway, "plugin_proxy_failed", err.Error())
		},
	}
	proxy.ServeHTTP(w, r)
}
