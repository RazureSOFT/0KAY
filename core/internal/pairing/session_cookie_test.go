package pairing

import (
	"crypto/tls"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"
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

// loginWithToken posts a token login and returns the issued session cookie.
func loginWithToken(t *testing.T, store *Store, token string) *http.Cookie {
	t.Helper()
	r := httptest.NewRequest(http.MethodPost, "/api/auth/session", strings.NewReader(`{"token":"`+token+`"}`))
	r.RemoteAddr = "203.0.113.9:5000"
	w := httptest.NewRecorder()
	store.handleSession(w, r)
	if w.Code != http.StatusOK {
		t.Fatalf("login failed: %d %s", w.Code, w.Body.String())
	}
	cookies := w.Result().Cookies()
	if len(cookies) != 1 {
		t.Fatalf("expected one session cookie, got %d", len(cookies))
	}
	return cookies[0]
}

func TestTokenLoginIssuesServerSessionNotRawToken(t *testing.T) {
	const apiTokenValue = "secret-main-token"
	t.Setenv("CORE_API_TOKEN", apiTokenValue)
	store, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	cookie := loginWithToken(t, store, apiTokenValue)
	if cookie.Value == apiTokenValue {
		t.Fatal("cookie carries the raw main API token")
	}
	if !cookie.HttpOnly {
		t.Fatal("session cookie must be HttpOnly")
	}
	if cookie.SameSite != http.SameSiteLaxMode {
		t.Fatalf("session cookie SameSite = %v, want Lax", cookie.SameSite)
	}
	if want := 30 * 24 * 3600; cookie.MaxAge != want {
		t.Fatalf("session cookie MaxAge = %d, want %d", cookie.MaxAge, want)
	}

	// The session id alone must authorize later requests...
	r := httptest.NewRequest(http.MethodGet, "/api/anything", nil)
	r.RemoteAddr = "203.0.113.9:5000"
	r.AddCookie(cookie)
	if ok, method := store.authorized(r); !ok || method != "cookie" {
		t.Fatalf("session cookie not accepted: ok=%v method=%q", ok, method)
	}

	// ...and signing out must invalidate it server-side.
	out := httptest.NewRequest(http.MethodDelete, "/api/auth/session", nil)
	out.RemoteAddr = "203.0.113.9:5000"
	out.AddCookie(cookie)
	ow := httptest.NewRecorder()
	store.handleSession(ow, out)
	r2 := httptest.NewRequest(http.MethodGet, "/api/anything", nil)
	r2.RemoteAddr = "203.0.113.9:5000"
	r2.AddCookie(cookie)
	if ok, _ := store.authorized(r2); ok {
		t.Fatal("session still valid after logout")
	}
}

func TestLegacyRawTokenCookieStillAccepted(t *testing.T) {
	const apiTokenValue = "secret-main-token"
	t.Setenv("CORE_API_TOKEN", apiTokenValue)
	store, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	r := httptest.NewRequest(http.MethodGet, "/api/anything", nil)
	r.RemoteAddr = "203.0.113.9:5000"
	r.AddCookie(&http.Cookie{Name: SessionCookie, Value: apiTokenValue})
	if ok, method := store.authorized(r); !ok || method != "cookie" {
		t.Fatalf("legacy raw-token cookie rejected: ok=%v method=%q", ok, method)
	}
}

func TestDeviceTokenLoginIssuesSessionAndRevocationKillsIt(t *testing.T) {
	store, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	deviceToken := randomID()
	store.mu.Lock()
	store.Devices["dev1"] = Device{ID: "dev1", Name: "dev", Token: deviceToken}
	store.mu.Unlock()

	cookie := loginWithToken(t, store, deviceToken)
	if cookie.Value == deviceToken {
		t.Fatal("cookie carries the raw device token")
	}

	// Session invalid once the paired device (its token) is revoked.
	store.mu.Lock()
	delete(store.Devices, "dev1")
	store.mu.Unlock()
	r := httptest.NewRequest(http.MethodGet, "/api/anything", nil)
	r.RemoteAddr = "203.0.113.9:5000"
	r.AddCookie(cookie)
	if ok, _ := store.authorized(r); ok {
		t.Fatal("session survived device revocation")
	}
}

func TestWebSessionLazyExpiry(t *testing.T) {
	const apiTokenValue = "secret-main-token"
	t.Setenv("CORE_API_TOKEN", apiTokenValue)
	store, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	origTTL := webSessionTTL
	webSessionTTL = -time.Minute
	defer func() { webSessionTTL = origTTL }()

	cookie := loginWithToken(t, store, apiTokenValue)
	r := httptest.NewRequest(http.MethodGet, "/api/anything", nil)
	r.RemoteAddr = "203.0.113.9:5000"
	r.AddCookie(cookie)
	if ok, _ := store.authorized(r); ok {
		t.Fatal("expired session accepted")
	}
	store.mu.Lock()
	remaining := len(store.sessions)
	store.mu.Unlock()
	if remaining != 0 {
		t.Fatalf("expired session not lazily cleaned up: %d left", remaining)
	}
}

func TestWebSessionRejectsForgedIDs(t *testing.T) {
	store, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	for _, value := range []string{"", "forged", strings.Repeat("a", 64)} {
		if store.webSessionValid(value) {
			t.Fatalf("forged session id %q accepted", value)
		}
	}
}
