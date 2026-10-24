package gateway

import (
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

func (g *Gateway) handlePluginProxy(w http.ResponseWriter, r *http.Request) {
	name := r.PathValue("name")
	rel := r.PathValue("path")
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
		FlushInterval: -1,
		Rewrite: func(pr *httputil.ProxyRequest) {
			pr.Out.URL.Scheme = base.Scheme
			pr.Out.URL.Host = base.Host
			pr.Out.URL.Path = upstreamPath
			pr.Out.URL.RawQuery = r.URL.RawQuery
			pr.Out.Host = base.Host
			pr.Out.Header.Set("Authorization", "Bearer "+token)
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
