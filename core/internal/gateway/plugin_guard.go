package gateway

import (
	"net/http"
	"strings"

	"0kay/core/internal/pairing"
)

// Plugin identity headers. A plugin attributes every Core call by naming itself
// (PluginHeader) and presenting the service token Core issued it at registration
// (Authorization: Bearer <token>). Core checks the call against the plugin's
// declared `permissions.api.requires`; built-in plugins are exempt.
const (
	PluginHeader     = "X-0KAY-Plugin"
	pluginHeaderID   = "X-0KAY-Plugin-Id"
	egressAPIPath    = "/api/net/egress"
	pluginIDRequired = "plugin_identity_required"
)

// bearerToken extracts the token from an Authorization header.
func bearerToken(header string) string {
	const prefix = "Bearer "
	if len(header) > len(prefix) && strings.EqualFold(header[:len(prefix)], prefix) {
		return strings.TrimSpace(header[len(prefix):])
	}
	return ""
}

// looksLikePluginBrowser identifies the owner's browser tab so the plugin guard
// never demands a plugin identity from it (the tab authenticates with a session
// cookie, not a plugin token).
//
// This gate hands out an exemption, so it must fail closed: it only returns true
// on positive proof of a browser. Accepting "any of Sec-Fetch-Site / Origin /
// Referer is present" did not, because a plugin process can set any of those by
// hand — one `Referer` header was enough to skip attribution entirely and reach
// APIs the plugin never declared, including the egress proxy. Proof is either
// Fetch metadata (which no HTTP client library emits) or possession of the
// owner's session cookie (which a machine client does not have).
func looksLikePluginBrowser(r *http.Request) bool {
	if pairing.HasBrowserFetchMetadata(r) {
		return true
	}
	_, err := r.Cookie(pairing.SessionCookie)
	return err == nil
}

// splitAPI splits a declared API entry into method + path. Entries with no space
// (e.g. "core.v1.CoreService/CallMocr") return an empty method.
func splitAPI(entry string) (method, path string) {
	entry = strings.TrimSpace(entry)
	if i := strings.IndexByte(entry, ' '); i > 0 {
		return strings.TrimSpace(entry[:i]), strings.TrimSpace(entry[i+1:])
	}
	return "", entry
}

// apiPathMatch reports whether a declared path pattern matches a request path.
// A trailing "*" matches any suffix; "*" alone matches everything.
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

// apiAllowed reports whether (method, path) matches any declared entry. A method
// of "*" (or omitted) matches any HTTP method.
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

// apiRequiresIdentity reports whether any registered plugin declares this HTTP
// API in its allow-list. Such an endpoint must be called with a plugin identity
// (machine callers); browser/owner requests and endpoints no plugin declares are
// left to the normal auth gate.
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
		// Builtin is already on the snapshot; check the trusted-name set directly
		// so this hot path does not re-scan every plugin via IsTrusted.
		if p.Builtin || g.registry.IsTrustedName(p.Info.Name) {
			continue
		}
		if apiAllowed(p.Info.Permissions.ApiRequires, method, path) {
			return true
		}
	}
	return false
}

// pluginGuard enforces the manifest permission model on the /api surface.
//
//   - An attributed call (X-0KAY-Plugin present) must carry a valid service
//     token; non-builtin plugins may only reach APIs they declared in
//     `permissions.api.requires`.
//   - An unattributed machine call to an API some plugin declared is rejected:
//     attribution is mandatory, so a plugin cannot borrow the shared token.
//   - Owner/browser traffic (cookie session, Fetch metadata) is untouched.
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
		if looksLikePluginBrowser(r) {
			next.ServeHTTP(w, r)
			return
		}
		if g.apiRequiresIdentity(r.Method, r.URL.Path) {
			writeErr(w, http.StatusForbidden, pluginIDRequired,
				"this API requires a plugin identity")
			return
		}
		next.ServeHTTP(w, r)
	})
}
