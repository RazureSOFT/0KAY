package pairing

import (
	"crypto/tls"
	"net/http/httptest"
	"testing"
)

func TestSessionCookieTransport(t *testing.T) {
	for _, tc := range []struct {
		name, peer, proto, override string
		tls, want                   bool
	}{
		{"local HTTP", "127.0.0.1:1234", "", "", false, false},
		{"direct TLS", "192.0.2.1:1234", "", "", true, true},
		{"trusted proxy", "127.0.0.1:1234", "https", "", false, true},
		{"untrusted header", "192.0.2.1:1234", "https", "", false, false},
		{"explicit secure", "192.0.2.1:1234", "", "1", false, true},
	} {
		t.Run(tc.name, func(t *testing.T) {
			t.Setenv("CORE_COOKIE_SECURE", tc.override)
			r := httptest.NewRequest("DELETE", "/api/auth/session", nil)
			r.RemoteAddr = tc.peer
			r.Header.Set("X-Forwarded-Proto", tc.proto)
			if tc.tls {
				r.TLS = &tls.ConnectionState{}
			}
			w := httptest.NewRecorder()
			(&Store{}).handleSession(w, r)
			cookies := w.Result().Cookies()
			if len(cookies) != 1 || cookies[0].Secure != tc.want {
				t.Fatalf("unexpected cookie: %s", w.Header().Get("Set-Cookie"))
			}
		})
	}
}
