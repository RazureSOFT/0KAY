package pairing

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestPINLifecycle(t *testing.T) {
	dir := t.TempDir()
	s, err := New(dir)
	if err != nil {
		t.Fatal(err)
	}
	if !s.HasPIN() {
		t.Fatal("expected a generated PIN on first run")
	}
	if err := s.SetPIN("246813"); err != nil {
		t.Fatal(err)
	}
	if !s.PinValid("246813") {
		t.Fatal("valid PIN rejected")
	}
	if s.PinValid("000000") || s.PinValid("") {
		t.Fatal("wrong/empty PIN accepted")
	}
	reloaded, err := New(dir)
	if err != nil {
		t.Fatal(err)
	}
	if !reloaded.PinValid("246813") {
		t.Fatal("PIN not persisted")
	}
	if err := reloaded.SetPIN(""); err != nil {
		t.Fatal(err)
	}
	if reloaded.HasPIN() {
		t.Fatal("PIN not cleared")
	}
}

func TestPINSeedsFromEnv(t *testing.T) {
	t.Setenv("CORE_PIN", "135790")
	s, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if !s.PinValid("135790") {
		t.Fatal("CORE_PIN not applied")
	}
}

func TestUpgradeLeavesPINUnset(t *testing.T) {
	dir := t.TempDir()
	// An existing install (paired devices present) with no security.json.
	if err := os.WriteFile(filepath.Join(dir, "paired_devices.json"), []byte(`{"ID":"x","Devices":{}}`), 0600); err != nil {
		t.Fatal(err)
	}
	s, err := New(dir)
	if err != nil {
		t.Fatal(err)
	}
	if s.HasPIN() {
		t.Fatal("upgrade should not auto-generate a PIN; the UI must ask for one")
	}
}

func TestSetPINRequiresSixDigits(t *testing.T) {
	s, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	for _, bad := range []string{"123", "12345", "1234567", "12a456", "abcdef"} {
		if err := s.SetPIN(bad); err == nil {
			t.Errorf("SetPIN(%q) accepted, want error", bad)
		}
	}
	if err := s.SetPIN("012345"); err != nil {
		t.Fatalf("SetPIN(valid) failed: %v", err)
	}
}

func TestSensitiveGate(t *testing.T) {
	s, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := s.SetPIN("424242"); err != nil {
		t.Fatal(err)
	}
	handler := s.HTTP(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK) }))

	login := httptest.NewRequest(http.MethodPost, "/api/auth/session", strings.NewReader(`{"pin":"424242"}`))
	login.RemoteAddr = "192.168.1.50:1234"
	lw := httptest.NewRecorder()
	handler.ServeHTTP(lw, login)
	if lw.Code != http.StatusOK {
		t.Fatalf("login: %d %s", lw.Code, lw.Body.String())
	}
	cookies := lw.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatal("login did not set a session cookie")
	}

	call := func(method, path, pin string) int {
		req := httptest.NewRequest(method, path, strings.NewReader("{}"))
		req.RemoteAddr = "192.168.1.50:1234"
		for _, c := range cookies {
			req.AddCookie(c)
		}
		if pin != "" {
			req.Header.Set(PinHeader, pin)
		}
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
		return w.Code
	}

	if code := call(http.MethodPost, "/api/providers", ""); code != http.StatusForbidden {
		t.Fatalf("sensitive write without PIN = %d, want 403", code)
	}
	if code := call(http.MethodPost, "/api/providers", "424242"); code != http.StatusOK {
		t.Fatalf("sensitive write with PIN = %d, want 200", code)
	}
	if code := call(http.MethodGet, "/health", ""); code != http.StatusOK {
		t.Fatalf("non-sensitive read = %d, want 200", code)
	}
}

// Node's undici fetch (the agent and plugin proxies) always sends
// "Sec-Fetch-Mode: cors" without any real browser signals, so it must stay
// exempt; genuine browser metadata still has to face the PIN.
func TestNodeFetchIsNotABrowser(t *testing.T) {
	s, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := s.SetPIN("424242"); err != nil {
		t.Fatal(err)
	}
	handler := s.HTTP(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK) }))

	call := func(header, value string) int {
		req := httptest.NewRequest(http.MethodGet, "/api/providers/credentials", nil)
		req.RemoteAddr = "127.0.0.1:50000"
		if header != "" {
			req.Header.Set(header, value)
		}
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
		return w.Code
	}

	if code := call("Sec-Fetch-Mode", "cors"); code != http.StatusOK {
		t.Fatalf("undici-style loopback request = %d, want 200", code)
	}
	for _, header := range []string{"Sec-Fetch-Site", "Origin", "Referer"} {
		if code := call(header, "http://localhost:3000/"); code != http.StatusForbidden {
			t.Fatalf("browser %s = %d, want 403", header, code)
		}
	}
}

// A remote host must not be able to brute-force the 6-digit PIN.
func TestPINBruteForceLockout(t *testing.T) {
	s, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := s.SetPIN("424242"); err != nil {
		t.Fatal(err)
	}
	attempt := func(pin string) int {
		req := httptest.NewRequest(http.MethodPost, "/api/auth/session", strings.NewReader(`{"pin":"`+pin+`"}`))
		req.RemoteAddr = "203.0.113.9:5000"
		rec := httptest.NewRecorder()
		s.handleSession(rec, req)
		return rec.Code
	}
	for i := 0; i < loginMaxFailures; i++ {
		if code := attempt("000000"); code != http.StatusUnauthorized {
			t.Fatalf("attempt %d = %d, want 401", i, code)
		}
	}
	if code := attempt("424242"); code != http.StatusTooManyRequests {
		t.Fatalf("after lockout = %d, want 429", code)
	}
}
