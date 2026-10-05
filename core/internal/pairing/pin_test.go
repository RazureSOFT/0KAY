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
	// A browser tab with no session is stopped at the door (401) — it cannot
	// even reach the sensitive-action check, let alone dismiss past it.
	for _, header := range []string{"Sec-Fetch-Site", "Origin", "Referer"} {
		if code := call(header, "http://localhost:3000/"); code != http.StatusUnauthorized {
			t.Fatalf("browser %s = %d, want 401", header, code)
		}
	}
}

func boolPtr(value bool) *bool { return &value }

// Turning the PIN off keeps it stored but stops every challenge; the page scope
// is a WebUI guard only and must not relax the sensitive-action check.
func TestPINSwitchAndPageScope(t *testing.T) {
	s, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := s.SetPIN("424242"); err != nil {
		t.Fatal(err)
	}
	handler := s.HTTP(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK) }))

	// A browser tab first signs in with the PIN, then keeps the session cookie
	// the way the WebUI does.
	login := httptest.NewRequest(http.MethodPost, "/api/auth/session", strings.NewReader(`{"pin":"424242"}`))
	login.RemoteAddr = "127.0.0.1:50000"
	login.Header.Set("Referer", "http://localhost:3000/")
	lw := httptest.NewRecorder()
	handler.ServeHTTP(lw, login)
	if lw.Code != http.StatusOK {
		t.Fatalf("login: %d %s", lw.Code, lw.Body.String())
	}
	cookies := lw.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatal("login did not set a session cookie")
	}

	call := func(page string) int {
		req := httptest.NewRequest(http.MethodPost, "/api/providers", strings.NewReader("{}"))
		req.RemoteAddr = "127.0.0.1:50000"
		req.Header.Set("Referer", "http://localhost:3000/")
		for _, c := range cookies {
			req.AddCookie(c)
		}
		if page != "" {
			req.Header.Set("X-0kay-Page", page)
		}
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
		return w.Code
	}

	if code := call(""); code != http.StatusForbidden {
		t.Fatalf("PIN on, no scope = %d, want 403", code)
	}
	if err := s.SetSecurityPrefs(boolPtr(false), nil, nil); err != nil {
		t.Fatal(err)
	}
	if code := call(""); code != http.StatusOK {
		t.Fatalf("PIN off = %d, want 200", code)
	}
	if !s.HasPIN() {
		t.Fatal("switching the PIN off must keep it stored")
	}
	if err := s.SetSecurityPrefs(boolPtr(true), nil, &[]string{"/settings"}); err != nil {
		t.Fatal(err)
	}
	// X-0kay-Page is client-asserted: neither dropping it nor claiming an
	// unscoped route may relax the sensitive-action gate. Only a real PIN (or a
	// machine credential) does.
	if code := call(""); code != http.StatusForbidden {
		t.Fatalf("missing page header = %d, want 403", code)
	}
	if code := call("/chat"); code != http.StatusForbidden {
		t.Fatalf("forged unscoped page = %d, want 403", code)
	}
	if code := call("/settings"); code != http.StatusForbidden {
		t.Fatalf("scoped page = %d, want 403", code)
	}
	if code := call("/settings?tab=security"); code != http.StatusForbidden {
		t.Fatalf("scoped page with query = %d, want 403", code)
	}

	reloaded, err := New(filepath.Dir(s.path))
	if err != nil {
		t.Fatal(err)
	}
	if !reloaded.PinEnabled() {
		t.Fatal("PIN switch not persisted")
	}
	if pages := reloaded.PinPages(); len(pages) != 1 || pages[0] != "/settings" {
		t.Fatalf("page scope not persisted: %v", pages)
	}
}

// Regression: a browser holding a session cookie but no PIN must not reach a
// sensitive action by forging X-0kay-Page. The header is client-asserted, so an
// attacker on a shared, unlocked browser can set it to any route they like —
// including one the owner left unscoped. Only a real PIN may satisfy the gate.
func TestForgedPageHeaderCannotBypassPin(t *testing.T) {
	s, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := s.SetPIN("424242"); err != nil {
		t.Fatal(err)
	}
	if err := s.SetSecurityPrefs(boolPtr(true), nil, &[]string{"/settings"}); err != nil {
		t.Fatal(err)
	}
	handler := s.HTTP(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK) }))

	// Session cookie only: the owner signed in once, this tab never saw the PIN.
	login := httptest.NewRequest(http.MethodPost, "/api/auth/session", strings.NewReader(`{"pin":"424242"}`))
	login.RemoteAddr = "127.0.0.1:50000"
	login.Header.Set("Referer", "http://localhost:3000/")
	lw := httptest.NewRecorder()
	handler.ServeHTTP(lw, login)
	if lw.Code != http.StatusOK {
		t.Fatalf("login: %d %s", lw.Code, lw.Body.String())
	}
	cookies := lw.Result().Cookies()

	call := func(page, pin string) int {
		req := httptest.NewRequest(http.MethodPost, "/api/providers", strings.NewReader("{}"))
		req.RemoteAddr = "127.0.0.1:50000"
		req.Header.Set("Referer", "http://localhost:3000/")
		for _, c := range cookies {
			req.AddCookie(c)
		}
		req.Header.Set("X-0kay-Page", page)
		if pin != "" {
			req.Header.Set(PinHeader, pin)
		}
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
		return w.Code
	}

	for _, page := range []string{"/chat", "/", "/usage", "/settings"} {
		if code := call(page, ""); code != http.StatusForbidden {
			t.Fatalf("forged page %q without PIN = %d, want 403", page, code)
		}
	}
	if code := call("/chat", "000000"); code != http.StatusForbidden {
		t.Fatalf("forged page with wrong PIN = %d, want 403", code)
	}
	if code := call("/chat", "424242"); code != http.StatusOK {
		t.Fatalf("forged page with the real PIN = %d, want 200", code)
	}
}

// "Not now" on the sign-in overlay must not hand over the API: a browser tab on
// loopback still has to prove the PIN. Machine clients stay exempt.
func TestBrowserNeedsSessionWhenPINSet(t *testing.T) {
	s, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := s.SetPIN("424242"); err != nil {
		t.Fatal(err)
	}
	handler := s.HTTP(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK) }))

	browser := func(cookie *http.Cookie, browserHeaders bool) int {
		req := httptest.NewRequest(http.MethodGet, "/api/state", nil)
		req.RemoteAddr = "127.0.0.1:50000"
		if browserHeaders {
			req.Header.Set("Referer", "http://localhost:3000/")
		}
		if cookie != nil {
			req.AddCookie(cookie)
		}
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
		return w.Code
	}

	if code := browser(nil, true); code != http.StatusUnauthorized {
		t.Fatalf("browser without a session = %d, want 401", code)
	}

	login := httptest.NewRequest(http.MethodPost, "/api/auth/session", strings.NewReader(`{"pin":"424242"}`))
	login.RemoteAddr = "127.0.0.1:50000"
	lw := httptest.NewRecorder()
	handler.ServeHTTP(lw, login)
	if lw.Code != http.StatusOK {
		t.Fatalf("login: %d %s", lw.Code, lw.Body.String())
	}
	cookies := lw.Result().Cookies()
	if len(cookies) == 0 {
		t.Fatal("login did not set a session cookie")
	}
	if code := browser(cookies[0], true); code != http.StatusOK {
		t.Fatalf("browser with a session = %d, want 200", code)
	}

	// LIFE / agent / scripts send no browser metadata and stay trusted.
	if code := browser(nil, false); code != http.StatusOK {
		t.Fatalf("machine client = %d, want 200", code)
	}
	// Switching the PIN off reopens loopback for browsers, as the owner asked.
	if err := s.SetSecurityPrefs(boolPtr(false), nil, nil); err != nil {
		t.Fatal(err)
	}
	if code := browser(nil, true); code != http.StatusOK {
		t.Fatalf("PIN off = %d, want 200", code)
	}
}

// Turning the login gate off opens the API to callers that have no credential.
func TestLoginSwitchOff(t *testing.T) {
	s, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	handler := s.HTTP(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusOK) }))

	remote := func() int {
		req := httptest.NewRequest(http.MethodGet, "/api/state", nil)
		req.RemoteAddr = "203.0.113.9:5000"
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
		return w.Code
	}

	if code := remote(); code != http.StatusUnauthorized {
		t.Fatalf("login on = %d, want 401", code)
	}
	if err := s.SetSecurityPrefs(nil, boolPtr(false), nil); err != nil {
		t.Fatal(err)
	}
	if code := remote(); code != http.StatusOK {
		t.Fatalf("login off = %d, want 200", code)
	}
	if err := s.SetSecurityPrefs(nil, boolPtr(true), nil); err != nil {
		t.Fatal(err)
	}
	if code := remote(); code != http.StatusUnauthorized {
		t.Fatalf("login back on = %d, want 401", code)
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

// Reading settings must not ask for the PIN: the WebUI loads all sections on
// most pages, so gating reads made the browser prompt on every navigation.
// Fetching the values needs a session; changing them still needs the PIN.
func TestSettingsReadsAreNotPINGated(t *testing.T) {
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

	call := func(method, path string) int {
		req := httptest.NewRequest(method, path, strings.NewReader("{}"))
		req.RemoteAddr = "192.168.1.50:1234"
		for _, c := range cookies {
			req.AddCookie(c)
		}
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
		return w.Code
	}

	if code := call(http.MethodGet, "/api/settings/sections?values=1"); code != http.StatusOK {
		t.Fatalf("settings sections read = %d, want 200", code)
	}
	if code := call(http.MethodGet, "/api/settings/life"); code != http.StatusOK {
		t.Fatalf("settings section read = %d, want 200", code)
	}
	if code := call(http.MethodPost, "/api/settings/life"); code != http.StatusForbidden {
		t.Fatalf("settings write without PIN = %d, want 403", code)
	}
}

// A request that carries both an invalid new PIN and a switch change must be
// rejected atomically: reporting 400 while still persisting the switch is a
// silent partial write (the probe that found it used {"pin":"bad","enabled":false}).
func TestInvalidPinLeavesSwitchesUntouched(t *testing.T) {
	s, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	if err := s.SetPIN("424242"); err != nil {
		t.Fatal(err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/security/pin",
		strings.NewReader(`{"pin":"bad","enabled":false}`))
	req.RemoteAddr = "127.0.0.1:50000"
	rec := httptest.NewRecorder()
	s.handlePIN(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("invalid PIN = %d, want 400", rec.Code)
	}
	if !s.PinEnabled() {
		t.Fatal("switches were persisted despite the rejected PIN")
	}
	if !s.PinValid("424242") {
		t.Fatal("stored PIN was replaced despite the rejected request")
	}
}

// Clearing the PIN removes the global second factor, so a paired-device/API
// session must re-prove the current PIN; a trusted peer (loopback) may still
// clear it without one, which is what the WebUI's body-less clearPin relies on.
func TestClearPinRequiresCurrentPin(t *testing.T) {
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

	clear := func(remote string, cookie *http.Cookie, pin string) int {
		req := httptest.NewRequest(http.MethodDelete, "/api/security/pin", nil)
		req.RemoteAddr = remote
		if cookie != nil {
			req.AddCookie(cookie)
		}
		if pin != "" {
			req.Header.Set(PinHeader, pin)
		}
		w := httptest.NewRecorder()
		handler.ServeHTTP(w, req)
		return w.Code
	}

	if code := clear("192.168.1.50:1234", cookies[0], ""); code != http.StatusForbidden {
		t.Fatalf("clear without PIN = %d, want 403", code)
	}
	if !s.HasPIN() {
		t.Fatal("PIN cleared without proof")
	}
	if code := clear("192.168.1.50:1234", cookies[0], "000000"); code != http.StatusForbidden {
		t.Fatalf("clear with wrong PIN = %d, want 403", code)
	}
	if code := clear("192.168.1.50:1234", cookies[0], "424242"); code != http.StatusOK {
		t.Fatalf("clear with PIN = %d, want 200", code)
	}
	if s.HasPIN() {
		t.Fatal("PIN not cleared")
	}

	if err := s.SetPIN("424242"); err != nil {
		t.Fatal(err)
	}
	if code := clear("127.0.0.1:50000", nil, ""); code != http.StatusOK {
		t.Fatalf("loopback clear = %d, want 200", code)
	}
}

// The sign-in gate may not be opened to the whole LAN without an explicit
// opt-in, since that exposes the API to every host on the network.
func TestLoginGateCannotBeOpenedInLANMode(t *testing.T) {
	s, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	s.enforce = true
	req := httptest.NewRequest(http.MethodPost, "/api/security/pin",
		strings.NewReader(`{"login_enabled":false}`))
	req.RemoteAddr = "127.0.0.1:50000"
	rec := httptest.NewRecorder()
	s.handlePIN(rec, req)
	if rec.Code != http.StatusBadRequest {
		t.Fatalf("login off in LAN mode = %d, want 400", rec.Code)
	}
	if !s.LoginEnabled() {
		t.Fatal("sign-in gate was disabled in LAN mode")
	}
	t.Setenv("CORE_ALLOW_LOGIN_OFF", "1")
	rec = httptest.NewRecorder()
	allowed := httptest.NewRequest(http.MethodPost, "/api/security/pin",
		strings.NewReader(`{"login_enabled":false}`))
	allowed.RemoteAddr = "127.0.0.1:50000"
	s.handlePIN(rec, allowed)
	if rec.Code != http.StatusOK {
		t.Fatalf("explicit opt-in = %d, want 200", rec.Code)
	}
	if s.LoginEnabled() {
		t.Fatal("sign-in gate not disabled after explicit opt-in")
	}
}
