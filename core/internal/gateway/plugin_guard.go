package gateway

import (
	"0kay/core/internal/authctx"
	"net/http"
	"strings"
)

const (
	PluginHeader     = "X-0KAY-Plugin"
	pluginHeaderID   = "X-0KAY-Plugin-Id"
	egressAPIPath    = "/api/net/egress"
	pluginIDRequired = "plugin_identity_required"
)

func bearerToken(header string) string {
	const prefix = "Bearer "
	if len(header) > len(prefix) && strings.EqualFold(header[:len(prefix)], prefix) {
		return strings.TrimSpace(header[len(prefix):])
	}
	return ""
}

func looksLikePluginBrowser(r *http.Request) bool {
	return r.Header.Get("Sec-Fetch-Site") != "" ||
		r.Header.Get("Origin") != "" ||
		r.Header.Get("Referer") != ""
}

func splitAPI(entry string) (method, path string) {
	entry = strings.TrimSpace(entry)
	if i := strings.IndexByte(entry, ' '); i > 0 {
		return strings.TrimSpace(entry[:i]), strings.TrimSpace(entry[i+1:])
	}
	return "", entry
}

func apiPathMatch(pattern, path string) bool {
	switch {
	case pattern == "":
		return false
	case pattern == "*":
		return true
	case strings.HasSuffix(pattern, "*"):
		return strings.HasPrefix(path, strings.TrimSuffix(pattern, "*"))
	default:
		return pattern == path
	}
}

func apiAllowed(declared []string, method, path string) bool {
	for _, entry := range declared {
		dm, dp := splitAPI(entry)
		if dm != "" && dm != "*" && !strings.EqualFold(dm, method) {
			continue
		}
		if apiPathMatch(dp, path) {
			return true
		}
	}
	return false
}

func (g *Gateway) apiRequiresIdentity(method, path string) bool {
	if path == egressAPIPath {
		return true
	}
	if g.registry == nil {
		return false
	}
	for _, p := range g.registry.GetAllPlugins() {
		if p.Info == nil || p.Info.Permissions == nil {
			continue
		}
		if p.Builtin || g.registry.IsTrustedName(p.Info.Name) {
			continue
		}
		if apiAllowed(p.Info.Permissions.ApiRequires, method, path) {
			return true
		}
	}
	return false
}

func (g *Gateway) pluginGuard(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasPrefix(r.URL.Path, "/api/") {
			next.ServeHTTP(w, r)
			return
		}
		name := strings.TrimSpace(r.Header.Get(PluginHeader))
		if name != "" {
			info, ok := g.registry.Authenticate(name, bearerToken(r.Header.Get("Authorization")))
			if !ok {
				writeErr(w, http.StatusUnauthorized, "plugin_auth_failed", "invalid plugin identity or token")
				return
			}
			if !g.registry.IsTrusted(name) {
				var declared []string
				if info.Info != nil && info.Info.Permissions != nil {
					declared = info.Info.Permissions.ApiRequires
				}
				if !apiAllowed(declared, r.Method, r.URL.Path) {
					writeErr(w, http.StatusForbidden, "api_not_permitted",
						"plugin "+name+" did not declare access to "+r.Method+" "+r.URL.Path)
					return
				}
			}
			r.Header.Set(pluginHeaderID, info.PluginID)
			next.ServeHTTP(w, r)
			return
		}
		// Order matters here, and it used to be wrong.
		//
		// The browser branch ran before the identity check, so any client that
		// set an Origin header — a header the client chooses — skipped
		// apiRequiresIdentity entirely. The plugin permission model was
		// therefore optional: "declare what you need or you get a 403" became
		// "declare it, or just add Origin and get everything".
		//
		// Identity is now decided first, and a browser-shaped request no longer
		// bypasses the check. The one thing a browser does get is the benefit of
		// the auth middleware that already ran in front of this handler: a
		// request that reached here without a plugin header has been
		// authenticated by pairing (loopback, token, or session cookie), so it is
		// the user's own UI and not an anonymous caller.
		if g.apiRequiresIdentity(r.Method, r.URL.Path) && !g.requestAuthenticated(r) {
			writeErr(w, http.StatusForbidden, pluginIDRequired,
				"this API requires a plugin identity")
			return
		}
		next.ServeHTTP(w, r)
	})
}

// requestAuthenticated reports whether the auth layer in front of this guard
// has already established a caller.
//
// The flag is set by the pairing middleware: it runs first and records its
// verdict on the request. Reading the flag keeps this file from re-deriving
// identity from headers, which is exactly the mistake the old branch made.
func (g *Gateway) requestAuthenticated(r *http.Request) bool {
	return authctx.Authenticated(r.Context())
}
