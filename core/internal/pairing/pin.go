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

	"golang.org/x/crypto/bcrypt"
)

const (
	loginMaxFailures = 5
	loginLockout     = 15 * time.Minute
)

type loginAttempt struct {
	fails    int
	until    time.Time
	lastSeen time.Time
}

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

func (s *Store) loginFailed(host string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	now := time.Now()
	if len(s.logins) > 4096 {
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

func (s *Store) loginSucceeded(host string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	delete(s.logins, host)
}

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

const PinHeader = "X-0kay-Pin"

const pinLength = 6

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

type pinFile struct {
	Salt         string   `json:"salt"`
	Hash         string   `json:"hash"`
	Algo         string   `json:"algo,omitempty"`
	SessionHash  string   `json:"session_hash,omitempty"`
	Enabled      *bool    `json:"enabled,omitempty"`
	LoginEnabled *bool    `json:"login_enabled,omitempty"`
	Pages        []string `json:"pages,omitempty"`
}

const pinAlgoBcrypt = "bcrypt"

const pinBcryptCost = 10

func (s *Store) securityPath() string {
	return filepath.Join(filepath.Dir(s.path), "security.json")
}

func (s *Store) storePINCredentialsLocked(pin string) error {
	if pin == "" {
		s.pinSalt, s.pinHash, s.pinAlgo, s.pinSessionHash = nil, nil, "", nil
		return nil
	}
	hash, err := bcrypt.GenerateFromPassword([]byte(pin), pinBcryptCost)
	if err != nil {
		return err
	}
	s.pinSalt, s.pinAlgo, s.pinHash, s.pinSessionHash = nil, pinAlgoBcrypt, hash, nil
	return nil
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
	s.pinEnabled = saved.Enabled == nil || *saved.Enabled
	s.loginEnabled = saved.LoginEnabled == nil || *saved.LoginEnabled
	s.pinPages = saved.Pages
	hash, err := hex.DecodeString(saved.Hash)
	if err != nil || len(hash) == 0 {
		return
	}
	if saved.Algo == pinAlgoBcrypt {
		s.pinAlgo = pinAlgoBcrypt
		s.pinHash = hash
	} else {
		salt, saltErr := hex.DecodeString(saved.Salt)
		if saltErr != nil || len(salt) == 0 {
			return
		}
		s.pinAlgo, s.pinSalt, s.pinHash = "", salt, hash
	}
	if saved.SessionHash != "" {
		if session, sessionErr := hex.DecodeString(saved.SessionHash); sessionErr == nil {
			s.pinSessionHash = session
		}
	}
}

func (s *Store) HasPIN() bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	return len(s.pinHash) > 0
}

func (s *Store) PinEnabled() bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.pinEnabled
}

func (s *Store) LoginEnabled() bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.loginEnabled
}

func (s *Store) PinPages() []string {
	s.mu.Lock()
	defer s.mu.Unlock()
	if len(s.pinPages) == 0 {
		return nil
	}
	return append([]string(nil), s.pinPages...)
}

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

func (s *Store) updateSecurity(pin *string, pinEnabled, loginEnabled *bool, pages *[]string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	var hash []byte
	if pin != nil {
		value := strings.TrimSpace(*pin)
		if value != "" {
			if !validPIN(value) {
				return fmt.Errorf("PIN must be exactly %d digits", pinLength)
			}
			var err error
			if hash, err = bcrypt.GenerateFromPassword([]byte(value), pinBcryptCost); err != nil {
				return err
			}
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
		if strings.TrimSpace(*pin) == "" {
			s.pinSalt, s.pinHash, s.pinAlgo, s.pinSessionHash = nil, nil, "", nil
		} else {
			s.pinSalt, s.pinAlgo, s.pinHash, s.pinSessionHash = nil, pinAlgoBcrypt, hash, nil
		}
	}
	return s.saveSecurityLocked()
}

func allowLoginOff() bool {
	switch strings.ToLower(strings.TrimSpace(os.Getenv("CORE_ALLOW_LOGIN_OFF"))) {
	case "1", "true", "yes":
		return true
	}
	return false
}

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

func (s *Store) SetPIN(pin string) error {
	pin = strings.TrimSpace(pin)
	s.mu.Lock()
	defer s.mu.Unlock()
	if pin != "" && !validPIN(pin) {
		return fmt.Errorf("PIN must be exactly %d digits", pinLength)
	}
	if err := s.storePINCredentialsLocked(pin); err != nil {
		return err
	}
	return s.saveSecurityLocked()
}

func (s *Store) saveSecurityLocked() error {
	enabled, login := s.pinEnabled, s.loginEnabled
	raw, err := json.Marshal(pinFile{
		Salt:         hex.EncodeToString(s.pinSalt),
		Hash:         hex.EncodeToString(s.pinHash),
		Algo:         s.pinAlgo,
		SessionHash:  hex.EncodeToString(s.pinSessionHash),
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

func (s *Store) PinValid(pin string) bool {
	pin = strings.TrimSpace(pin)
	if pin == "" {
		return false
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	return s.verifyPINLocked(pin)
}

func (s *Store) verifyPINLocked(pin string) bool {
	if len(s.pinHash) == 0 {
		return false
	}
	if s.pinAlgo == pinAlgoBcrypt {
		return bcrypt.CompareHashAndPassword(s.pinHash, []byte(pin)) == nil
	}
	digest := sha256.New()
	digest.Write(s.pinSalt)
	digest.Write([]byte(pin))
	if subtle.ConstantTimeCompare(digest.Sum(nil), s.pinHash) != 1 {
		return false
	}
	s.upgradeLegacyPINLocked(pin)
	return true
}

func (s *Store) upgradeLegacyPINLocked(pin string) {
	if err := s.storePINCredentialsLocked(pin); err != nil {
		log.Printf("upgrade stored PIN hash: %v", err)
		return
	}
	if err := s.saveSecurityLocked(); err != nil {
		log.Printf("persist upgraded PIN hash: %v", err)
	}
}

func (s *Store) pinCookieValue() string {
	s.mu.Lock()
	defer s.mu.Unlock()
	if len(s.pinHash) == 0 {
		return ""
	}
	token := make([]byte, 32)
	if _, err := rand.Read(token); err != nil {
		return ""
	}
	value := hex.EncodeToString(token)
	s.pinSessionHash = sessionTokenHash([]byte(value))
	if err := s.saveSecurityLocked(); err != nil {
		log.Printf("persist PIN session token: %v", err)
	}
	return value
}

func (s *Store) pinCookieValid(value string) bool {
	if value == "" {
		return false
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	if len(s.pinSessionHash) == 0 {
		return false
	}
	return subtle.ConstantTimeCompare(sessionTokenHash([]byte(value)), s.pinSessionHash) == 1
}

func sessionTokenHash(token []byte) []byte {
	digest := sha256.Sum256(token)
	return digest[:]
}

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
	case pluginProxyPath(path):
		// The gateway forwards /api/plugins/{name}/proxy/... to the plugin
		// with the plugin service token attached, so it always requires an
		// authenticated (PIN-satisfied) session.
		return true
	case path == "/api/security/pin":
		return !read
	case path == "/api/agent/file", path == "/api/agent/exec", path == "/api/run",
		path == "/api/tools", path == "/api/tools/", path == "/api/tools/call",
		path == "/api/agent/browser/action", path == "/api/agent/compact",
		path == "/api/agent/messages", path == "/api/agent/workspace",
		path == "/api/agent/workspaces", path == "/api/agent/sessions", path == "/api/tasks",
		path == "/api/agent/git":
		return !read
	case strings.HasPrefix(path, "/api/settings/"):
		return !read
	case strings.HasPrefix(path, "/api/live2d"):
		return method == http.MethodPost || method == http.MethodDelete
	}
	return false
}

// pluginProxyPath reports whether path targets the plugin HTTP proxy
// (/api/plugins/{name}/proxy or /api/plugins/{name}/proxy/...).
func pluginProxyPath(path string) bool {
	rest, ok := strings.CutPrefix(path, "/api/plugins/")
	if !ok {
		return false
	}
	name, remainder, found := strings.Cut(rest, "/")
	return found && name != "" && (remainder == "proxy" || strings.HasPrefix(remainder, "proxy/"))
}

func looksLikeBrowser(r *http.Request) bool {
	return r.Header.Get("Sec-Fetch-Site") != "" ||
		r.Header.Get("Origin") != "" ||
		r.Header.Get("Referer") != ""
}

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
	if pin := r.Header.Get(PinHeader); pin != "" {
		host := remoteHost(r)
		if blocked, _ := s.loginBlocked(host); blocked {
			return false
		}
		if s.PinValid(pin) {
			s.loginSucceeded(host)
			return true
		}
		s.loginFailed(host)
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
	pinPath := filepath.Join(filepath.Dir(s.path), "initial-pin.txt")
	if err := os.WriteFile(pinPath, []byte(pin+"\n"), 0600); err != nil {
		log.Printf("write initial PIN file: %v", err)
		return
	}
	log.Printf("==============================================================")
	log.Printf("  0KAY initial access PIN written to: %s", pinPath)
	log.Printf("  Read it, then delete the file. Change it under Settings.")
	log.Printf("==============================================================")
}

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
		if s.HasPIN() && !s.trustedPeer(r.RemoteAddr) {
			current := strings.TrimSpace(r.Header.Get(PinHeader))
			if current == "" {
				var body struct {
					Current string `json:"current"`
				}
				if r.Body != nil {
					_ = json.NewDecoder(http.MaxBytesReader(w, r.Body, 4096)).Decode(&body)
				}
				current = strings.TrimSpace(body.Current)
			}
			if !s.PinValid(current) {
				s.loginFailed(remoteHost(r))
				writeErr(w, http.StatusForbidden, "pin_required", "current PIN required")
				return
			}
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
