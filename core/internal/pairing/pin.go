package pairing

import (
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"math/big"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"
)

// loginMaxFailures is how many failed PIN/token attempts a host may make before
// it is locked out for loginLockout.
const (
	loginMaxFailures = 5
	loginLockout     = 15 * time.Minute
)

// loginAttempt tracks consecutive credential failures for one remote host.
type loginAttempt struct {
	fails    int
	until    time.Time
	lastSeen time.Time
}

// remoteHost is the lockout key: the client IP without its ephemeral port.
// IPv6 is grouped by /64 so an attacker cannot rotate through a routed prefix.
func remoteHost(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		host = r.RemoteAddr
	}
	ip := net.ParseIP(host)
	if ip == nil {
		return host
	}
	if ip4 := ip.To4(); ip4 != nil {
		return ip4.String()
	}
	return ip.Mask(net.CIDRMask(64, 128)).String() + "/64"
}

// loginBlocked reports whether a host is currently locked out.
func (s *Store) loginBlocked(host string) (bool, time.Duration) {
	s.mu.Lock()
	defer s.mu.Unlock()
	attempt := s.logins[host]
	if attempt == nil {
		return false, 0
	}
	if attempt.until.IsZero() {
		return false, 0
	}
	if time.Now().Before(attempt.until) {
		return true, time.Until(attempt.until)
	}
	delete(s.logins, host)
	return false, 0
}

// loginFailed records a rejected credential and locks the host out once the
// failure budget is spent.
func (s *Store) loginFailed(host string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	now := time.Now()
	if len(s.logins) > 4096 {
		// Evict by age regardless of lock state so IP-rotating abusers cannot
		// grow the map without bound.
		for key, attempt := range s.logins {
			if now.Sub(attempt.lastSeen) > loginLockout {
				delete(s.logins, key)
			}
		}
	}
	attempt := s.logins[host]
	if attempt == nil {
		attempt = &loginAttempt{}
		s.logins[host] = attempt
	}
	attempt.fails++
	attempt.lastSeen = now
	if attempt.fails >= loginMaxFailures {
		attempt.fails = 0
		attempt.until = now.Add(loginLockout)
	}
}

// loginSucceeded clears the failure budget for a host.
func (s *Store) loginSucceeded(host string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.logins, host)
}

// enforceLoginLimit writes a 429 and returns true when host is locked out.
func (s *Store) enforceLoginLimit(w http.ResponseWriter, r *http.Request) bool {
	host := remoteHost(r)
	blocked, wait := s.loginBlocked(host)
	if !blocked {
		return false
	}
	seconds := int(wait.Seconds()) + 1
	w.Header().Set("Retry-After", strconv.Itoa(seconds))
	writeErr(w, http.StatusTooManyRequests, "too_many_attempts",
		fmt.Sprintf("too many failed attempts; retry in %d seconds", seconds))
	return true
}

// PinHeader carries the access PIN on a sensitive request.
const PinHeader = "X-0kay-Pin"

// pinLength is the exact number of digits an access PIN has.
const pinLength = 6

// validPIN reports whether pin is exactly six digits.
func validPIN(pin string) bool {
	if len(pin) != pinLength {
		return false
	}
	for _, r := range pin {
		if r < '0' || r > '9' {
			return false
		}
	}
	return true
}

// pinFile is the on-disk security.json shape.
//
// Enabled/LoginEnabled are pointers so an omitted field keeps the default
// (on) instead of silently turning protection off on an older file.
type pinFile struct {
	Salt         string   `json:"salt"`
	Hash         string   `json:"hash"`
	Enabled      *bool    `json:"enabled,omitempty"`
	LoginEnabled *bool    `json:"login_enabled,omitempty"`
	Pages        []string `json:"pages,omitempty"`
}

func (s *Store) securityPath() string {
	return filepath.Join(filepath.Dir(s.path), "security.json")
}

func (s *Store) hashPIN(pin string, salt []byte) []byte {
	digest := sha256.New()
	digest.Write(salt)
	digest.Write([]byte(pin))
	return digest.Sum(nil)
}

func (s *Store) loadPIN() {
	raw, err := os.ReadFile(s.securityPath())
	if err != nil {
		return
	}
	var saved pinFile
	if json.Unmarshal(raw, &saved) != nil {
		return
	}
	// Scope flags live next to the PIN and apply even when no PIN is set.
	s.pinEnabled = saved.Enabled == nil || *saved.Enabled
	s.loginEnabled = saved.LoginEnabled == nil || *saved.LoginEnabled
	s.pinPages = saved.Pages
	salt, err1 := hex.DecodeString(saved.Salt)
	hash, err2 := hex.DecodeString(saved.Hash)
	if err1 != nil || err2 != nil || len(salt) == 0 || len(hash) == 0 {
		return
	}
	s.pinSalt, s.pinHash = salt, hash
}

// HasPIN reports whether an access PIN is configured.
func (s *Store) HasPIN() bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.pinHash) > 0
}

// PinEnabled reports whether the PIN is enforced. Turning it off keeps the PIN
// stored, so it can be switched back on without setting a new one.
func (s *Store) PinEnabled() bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.pinEnabled
}

// LoginEnabled reports whether HTTP callers must present a paired-device token,
// the API token, or a session cookie. Turning it off opens the API to every
// caller that can reach Core (intended for a loopback-only deployment).
func (s *Store) LoginEnabled() bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.loginEnabled
}

// PinPages returns the routes that require the PIN when entered. An empty list
// keeps the historical behaviour: only sensitive actions ask for it.
func (s *Store) PinPages() []string {
	s.mu.Lock()
	defer s.mu.Unlock()
	if len(s.pinPages) == 0 {
		return nil
	}
	return append([]string(nil), s.pinPages...)
}

// SetSecurityPrefs persists the PIN/login switches and the per-page scope.
// A nil argument leaves that value untouched.
func (s *Store) SetSecurityPrefs(pinEnabled, loginEnabled *bool, pages *[]string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if pinEnabled != nil {
		s.pinEnabled = *pinEnabled
	}
	if loginEnabled != nil {
		s.loginEnabled = *loginEnabled
	}
	if pages != nil {
		s.pinPages = append([]string(nil), *pages...)
	}
	return s.saveSecurityLocked()
}

// updateSecurity applies a new PIN and/or the master switches in one locked,
// all-or-nothing step: a rejected PIN is reported before any field is changed
// or written, so an invalid request can never leave the switches half-applied.
// A nil argument leaves that value untouched; a non-nil empty PIN clears it.
func (s *Store) updateSecurity(pin *string, pinEnabled, loginEnabled *bool, pages *[]string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	var salt, hash []byte
	if pin != nil {
		value := strings.TrimSpace(*pin)
		if value != "" {
			if !validPIN(value) {
				return fmt.Errorf("PIN must be exactly %d digits", pinLength)
			}
			salt = make([]byte, 16)
			if _, err := rand.Read(salt); err != nil {
				return err
			}
			hash = s.hashPIN(value, salt)
		}
	}
	if pinEnabled != nil {
		s.pinEnabled = *pinEnabled
	}
	if loginEnabled != nil {
		s.loginEnabled = *loginEnabled
	}
	if pages != nil {
		s.pinPages = append([]string(nil), *pages...)
	}
	if pin != nil {
		s.pinSalt, s.pinHash = salt, hash
	}
	return s.saveSecurityLocked()
}

// allowLoginOff is the explicit escape hatch for disabling the sign-in gate
// while LAN mode is on.
func allowLoginOff() bool {
	switch strings.ToLower(strings.TrimSpace(os.Getenv("CORE_ALLOW_LOGIN_OFF"))) {
	case "1", "true", "yes":
		return true
	}
	return false
}

// securityState is the GET /api/security/pin payload.
func (s *Store) securityState() map[string]interface{} {
	pages := s.PinPages()
	if pages == nil {
		pages = []string{}
	}
	return map[string]interface{}{
		"configured":    s.HasPIN(),
		"enabled":       s.PinEnabled(),
		"login_enabled": s.LoginEnabled(),
		"pages":         pages,
	}
}

// SetPIN hashes and persists a new PIN. An empty PIN clears it.
func (s *Store) SetPIN(pin string) error {
	pin = strings.TrimSpace(pin)
	s.mu.Lock()
	defer s.mu.Unlock()
	if pin == "" {
		s.pinSalt, s.pinHash = nil, nil
	} else {
		if !validPIN(pin) {
			return fmt.Errorf("PIN must be exactly %d digits", pinLength)
		}
		salt := make([]byte, 16)
		if _, err := rand.Read(salt); err != nil {
			return err
		}
		s.pinSalt, s.pinHash = salt, s.hashPIN(pin, salt)
	}
	return s.saveSecurityLocked()
}

func (s *Store) saveSecurityLocked() error {
	enabled, login := s.pinEnabled, s.loginEnabled
	raw, err := json.Marshal(pinFile{
		Salt:         hex.EncodeToString(s.pinSalt),
		Hash:         hex.EncodeToString(s.pinHash),
		Enabled:      &enabled,
		LoginEnabled: &login,
		Pages:        s.pinPages,
	})
	if err != nil {
		return err
	}
	path := s.securityPath()
	if err := os.MkdirAll(filepath.Dir(path), 0700); err != nil {
		return err
	}
	if err := os.WriteFile(path+".tmp", raw, 0600); err != nil {
		return err
	}
	return os.Rename(path+".tmp", path)
}

// PinValid reports whether pin matches the configured PIN.
func (s *Store) PinValid(pin string) bool {
	pin = strings.TrimSpace(pin)
	if pin == "" {
		return false
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if len(s.pinHash) == 0 {
		return false
	}
	return subtle.ConstantTimeCompare(s.hashPIN(pin, s.pinSalt), s.pinHash) == 1
}

// pinCookieValue is the session-cookie value minted by a PIN login.
func (s *Store) pinCookieValue() string {
	s.mu.Lock()
	defer s.mu.Unlock()
	if len(s.pinHash) == 0 {
		return ""
	}
	return "pin:" + hex.EncodeToString(s.pinHash)
}

func (s *Store) pinCookieValid(value string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	if len(s.pinHash) == 0 || value == "" {
		return false
	}
	return subtle.ConstantTimeCompare([]byte(value), []byte("pin:"+hex.EncodeToString(s.pinHash))) == 1
}

// sensitiveRequest reports whether a request targets an action a configured PIN
// must protect: provider/secret/model writes, update and plugin lifecycle,
// setting changes, Live2D file writes. Reads are authenticated by the session
// gate but are not re-confirmed, or the WebUI (which loads settings sections on
// most pages) would prompt for the PIN on every navigation.
func sensitiveRequest(r *http.Request) bool {
	path, method := r.URL.Path, r.Method
	read := method == http.MethodGet || method == http.MethodHead
	switch {
	case path == "/api/providers":
		return method == http.MethodPost || method == http.MethodPut
	case path == "/api/providers/defaults", path == "/api/providers/credentials":
		return true
	case strings.HasPrefix(path, "/api/providers/"):
		return method == http.MethodDelete
	case path == "/api/models/fetch", path == "/api/update/apply":
		return method == http.MethodPost
	case path == "/api/plugins/install", path == "/api/plugins/uninstall", path == "/api/plugins/enable", path == "/api/plugins/disable":
		return true
	case path == "/api/plugins/pm/install", path == "/api/plugins/pm/uninstall", path == "/api/plugins/pm/update", path == "/api/life/permissions":
		return !read
	case strings.HasPrefix(path, "/api/plugins/") && method == http.MethodPatch:
		return true
	case path == "/api/security/pin":
		return !read
	case strings.HasPrefix(path, "/api/settings/"):
		return !read
	case strings.HasPrefix(path, "/api/live2d"):
		return method == http.MethodPost || method == http.MethodDelete
	}
	return false
}

// looksLikeBrowser distinguishes a browser tab (sends Fetch metadata / Origin)
// from a machine client such as LIFE, the agent or a script. Browser callers
// face the PIN even when they reach Core over loopback.
//
// Sec-Fetch-Mode alone is deliberately ignored: Node's undici fetch (used by
// the agent and plugin proxies) always sends "Sec-Fetch-Mode: cors" without any
// of the other signals, so treating it as a browser would deny every Node
// machine client. Real browsers additionally send Sec-Fetch-Site, and their
// same-origin fetch/XHR also carries Referer (and Origin for cross-origin).
func looksLikeBrowser(r *http.Request) bool {
	return r.Header.Get("Sec-Fetch-Site") != "" ||
		r.Header.Get("Origin") != "" ||
		r.Header.Get("Referer") != ""
}

// pinSatisfied reports whether a sensitive request may proceed: the PIN is off
// or unset, the caller is a trusted *machine* client, uses a machine credential,
// or presents the PIN header. Browser callers from loopback are not exempt.
//
// The per-page scope in PinPages is a WebUI convenience only: X-0kay-Page is
// client-asserted and cannot be verified, so it must never relax this server
// check. Scoped pages are challenged by the frontend route guard instead.
func (s *Store) pinSatisfied(r *http.Request) bool {
	if !s.HasPIN() || !s.PinEnabled() {
		return true
	}
	if s.trustedPeer(r.RemoteAddr) && !looksLikeBrowser(r) {
		return true
	}
	if token := bearerToken(r.Header.Get("Authorization")); token != "" && (s.valid(token) || apiToken(token)) {
		return true
	}
	if pin := r.Header.Get(PinHeader); pin != "" && s.PinValid(pin) {
		return true
	}
	return false
}

func randomPIN() string {
	n, err := rand.Int(rand.Reader, big.NewInt(1000000))
	if err != nil {
		panic(err)
	}
	return fmt.Sprintf("%06d", n.Int64())
}

// seedPIN loads the PIN, seeding it from CORE_PIN or generating one on a fresh
// install. An existing installation upgrading to PIN support is left unset so the
// UI can ask the owner to choose a PIN ("set up once").
func (s *Store) seedPIN(existingInstall bool) {
	s.loadPIN()
	if s.HasPIN() {
		return
	}
	if env := strings.TrimSpace(os.Getenv("CORE_PIN")); env != "" {
		if err := s.SetPIN(env); err != nil {
			log.Printf("CORE_PIN rejected: %v", err)
		} else {
			log.Printf("PIN initialised from CORE_PIN")
		}
		return
	}
	if existingInstall {
		log.Printf("No access PIN set. Open the WebUI and set a 6-digit PIN to continue.")
		return
	}
	pin := randomPIN()
	if err := s.SetPIN(pin); err != nil {
		log.Printf("generate PIN: %v", err)
		return
	}
	log.Printf("==============================================================")
	log.Printf("  0KAY initial access PIN: %s", pin)
	log.Printf("  Change it under Settings, or set CORE_PIN to override.")
	log.Printf("==============================================================")
}

// handlePIN serves GET/POST/PUT/DELETE /api/security/pin. The route doubles as
// the security-settings endpoint: besides the PIN itself it stores the two
// master switches and the per-page scope.
//
//	GET    -> {configured, enabled, login_enabled, pages}   (no secret)
//	POST   {"pin": "...", "current": "..."}                 set/replace the PIN
//	POST   {"enabled": bool, "login_enabled": bool, "pages": [...]}  change the scope
//	DELETE                                                  clear the PIN
//
// Both writes need the current PIN unless the caller is a trusted peer.
func (s *Store) handlePIN(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet, http.MethodHead:
		writeJSON(w, http.StatusOK, s.securityState())
	case http.MethodPost, http.MethodPut:
		if ok, _ := s.authorized(r); !ok {
			writeErr(w, http.StatusUnauthorized, "unauthenticated", "sign in first")
			return
		}
		if s.enforceLoginLimit(w, r) {
			return
		}
		var body struct {
			Pin          string    `json:"pin"`
			Current      string    `json:"current"`
			Enabled      *bool     `json:"enabled"`
			LoginEnabled *bool     `json:"login_enabled"`
			Pages        *[]string `json:"pages"`
		}
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 4096)).Decode(&body); err != nil {
			writeErr(w, http.StatusBadRequest, "bad_request", "invalid request")
			return
		}
		wantsPin := strings.TrimSpace(body.Pin) != ""
		wantsPrefs := body.Enabled != nil || body.LoginEnabled != nil || body.Pages != nil
		if !wantsPin && !wantsPrefs {
			writeErr(w, http.StatusBadRequest, "bad_request", "nothing to update")
			return
		}
		if s.HasPIN() && !s.trustedPeer(r.RemoteAddr) {
			current := strings.TrimSpace(body.Current)
			if current == "" {
				current = r.Header.Get(PinHeader)
			}
			if !s.PinValid(current) {
				s.loginFailed(remoteHost(r))
				writeErr(w, http.StatusForbidden, "pin_required", "current PIN required")
				return
			}
		}
		// Opening the API to the whole LAN is a deliberate, dangerous change:
		// refuse it while LAN mode is on unless the operator opts in.
		if s.enforce && body.LoginEnabled != nil && !*body.LoginEnabled && !allowLoginOff() {
			writeErr(w, http.StatusBadRequest, "lan_login_required",
				"the sign-in gate cannot be disabled while LAN mode is on (set CORE_ALLOW_LOGIN_OFF=1 to override)")
			return
		}
		var pinArg *string
		if wantsPin {
			pin := body.Pin
			pinArg = &pin
		}
		if wantsPin || wantsPrefs {
			if err := s.updateSecurity(pinArg, body.Enabled, body.LoginEnabled, body.Pages); err != nil {
				if wantsPin {
					writeErr(w, http.StatusBadRequest, "invalid_pin", err.Error())
					return
				}
				writeErr(w, http.StatusInternalServerError, "internal", err.Error())
				return
			}
		}
		s.loginSucceeded(remoteHost(r))
		if wantsPin {
			http.SetCookie(w, &http.Cookie{
				Name: SessionCookie, Value: s.pinCookieValue(), Path: "/",
				MaxAge: 30 * 24 * 3600, HttpOnly: true, SameSite: http.SameSiteStrictMode, Secure: s.secureCookie(r),
			})
		}
		writeJSON(w, http.StatusOK, s.securityState())
	case http.MethodDelete:
		if ok, _ := s.authorized(r); !ok {
			writeErr(w, http.StatusUnauthorized, "unauthenticated", "sign in first")
			return
		}
		if err := s.SetPIN(""); err != nil {
			writeErr(w, http.StatusInternalServerError, "internal", err.Error())
			return
		}
		writeJSON(w, http.StatusOK, s.securityState())
	default:
		w.Header().Set("Allow", "GET, HEAD, POST, PUT, DELETE, OPTIONS")
		writeErr(w, http.StatusMethodNotAllowed, "method_not_allowed", "method not allowed")
	}
}
