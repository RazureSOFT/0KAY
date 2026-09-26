// Package pairing provides opt-in TLS LAN discovery and locally approved devices.
package pairing

import (
	"context"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"crypto/subtle"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/hex"
	"encoding/json"
	"encoding/pem"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/peer"
	"google.golang.org/grpc/status"
	"math/big"
	"net"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

type Device struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Token string `json:"token"`
}
type Request struct {
	ID       string    `json:"id"`
	Name     string    `json:"name"`
	Code     string    `json:"code"`
	Secret   string    `json:"-"`
	Expires  time.Time `json:"expires"`
	Approved bool      `json:"approved"`
	Token    string    `json:"-"`
}
type Store struct {
	mu          sync.Mutex
	ID          string
	Name        string
	Certificate []byte
	Fingerprint string
	path        string
	Devices     map[string]Device
	requests    map[string]*Request
	addresses   map[string]string
	TLS         *tls.Config
	// enforce requires a paired token for non-trusted callers. It is only enabled
	// with LAN mode; a loopback-only deployment keeps using CORE_API_TOKEN.
	enforce bool
	// trusted holds networks whose callers are treated like loopback: reverse
	// proxies and container networks that terminate the local UI.
	trusted []*net.IPNet
}

var Default *Store

func randomID() string {
	value := make([]byte, 24)
	if _, err := rand.Read(value); err != nil {
		panic(err)
	}
	return hex.EncodeToString(value)
}
func trustedNetworks(value string) []*net.IPNet {
	networks := []*net.IPNet{}
	for _, entry := range strings.Split(value, ",") {
		entry = strings.TrimSpace(entry)
		if entry == "" {
			continue
		}
		if _, network, err := net.ParseCIDR(entry); err == nil {
			networks = append(networks, network)
			continue
		}
		if ip := net.ParseIP(entry); ip != nil {
			bits := 32
			if ip.To4() == nil {
				bits = 128
			}
			networks = append(networks, &net.IPNet{IP: ip, Mask: net.CIDRMask(bits, bits)})
		}
	}
	return networks
}
func New(directory string) (*Store, error) {
	if err := os.MkdirAll(directory, 0700); err != nil {
		return nil, err
	}
	name, _ := os.Hostname()
	s := &Store{Name: name, path: filepath.Join(directory, "paired_devices.json"), Devices: map[string]Device{}, requests: map[string]*Request{}, addresses: map[string]string{}, enforce: os.Getenv("CORE_LAN_ENABLED") == "1", trusted: trustedNetworks(os.Getenv("CORE_TRUSTED_NETWORKS"))}
	if data, err := os.ReadFile(s.path); err == nil {
		var saved struct {
			ID      string
			Devices map[string]Device
		}
		if err = json.Unmarshal(data, &saved); err != nil {
			return nil, err
		}
		s.ID = saved.ID
		if saved.Devices != nil {
			s.Devices = saved.Devices
		}
	}
	if s.ID == "" {
		s.ID = randomID()
		if err := s.save(); err != nil {
			return nil, err
		}
	}
	certPath, keyPath := filepath.Join(directory, "core.crt"), filepath.Join(directory, "core.key")
	if _, err := os.Stat(certPath); os.IsNotExist(err) {
		key, err := rsa.GenerateKey(rand.Reader, 2048)
		if err != nil {
			return nil, err
		}
		serial, _ := rand.Int(rand.Reader, new(big.Int).Lsh(big.NewInt(1), 128))
		cert := &x509.Certificate{SerialNumber: serial, Subject: pkix.Name{CommonName: s.ID}, NotBefore: time.Now().Add(-time.Hour), NotAfter: time.Now().AddDate(5, 0, 0), KeyUsage: x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment, ExtKeyUsage: []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth}, DNSNames: []string{s.ID, "localhost"}, IPAddresses: []net.IP{net.ParseIP("127.0.0.1")}}
		raw, err := x509.CreateCertificate(rand.Reader, cert, cert, &key.PublicKey, key)
		if err != nil {
			return nil, err
		}
		if err = os.WriteFile(certPath, pem.EncodeToMemory(&pem.Block{Type: "CERTIFICATE", Bytes: raw}), 0600); err != nil {
			return nil, err
		}
		if err = os.WriteFile(keyPath, pem.EncodeToMemory(&pem.Block{Type: "RSA PRIVATE KEY", Bytes: x509.MarshalPKCS1PrivateKey(key)}), 0600); err != nil {
			return nil, err
		}
	}
	pair, err := tls.LoadX509KeyPair(certPath, keyPath)
	if err != nil {
		return nil, err
	}
	s.Certificate, _ = os.ReadFile(certPath)
	fingerprint := sha256.Sum256(pair.Certificate[0])
	s.Fingerprint = hex.EncodeToString(fingerprint[:])
	s.TLS = &tls.Config{Certificates: []tls.Certificate{pair}, MinVersion: tls.VersionTLS12}
	return s, nil
}
func (s *Store) save() error {
	raw, err := json.Marshal(struct {
		ID      string
		Devices map[string]Device
	}{s.ID, s.Devices})
	if err != nil {
		return err
	}
	if err = os.WriteFile(s.path+".tmp", raw, 0600); err != nil {
		return err
	}
	return os.Rename(s.path+".tmp", s.path)
}
func local(address string) bool {
	host, _, err := net.SplitHostPort(address)
	if err != nil {
		return false
	}
	ip := net.ParseIP(host)
	return ip != nil && ip.IsLoopback()
}

// Approval and device listing stay loopback-only; proxies only gain API access.
func (s *Store) trustedPeer(address string) bool {
	if local(address) {
		return true
	}
	host, _, err := net.SplitHostPort(address)
	if err != nil {
		host = address
	}
	ip := net.ParseIP(host)
	if ip == nil {
		return false
	}
	for _, network := range s.trusted {
		if network.Contains(ip) {
			return true
		}
	}
	return false
}
func (s *Store) valid(token string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, device := range s.Devices {
		if subtle.ConstantTimeCompare([]byte(token), []byte(device.Token)) == 1 {
			return true
		}
	}
	return false
}
func apiToken(token string) bool {
	expected := os.Getenv("CORE_API_TOKEN")
	return expected != "" && token != "" && subtle.ConstantTimeCompare([]byte(token), []byte(expected)) == 1
}

// SessionCookie carries a paired-device or API token so a browser frontend can
// authenticate once instead of attaching an Authorization header to every call
// (EventSource and WebSocket cannot send headers at all).
const SessionCookie = "0kay_session"

func bearerToken(header string) string {
	if len(header) > 7 && strings.EqualFold(header[:7], "Bearer ") {
		return strings.TrimSpace(header[7:])
	}
	return ""
}

// authorized reports whether the caller may reach the API and names the method
// that satisfied the check. Trusted (loopback / CORE_TRUSTED_NETWORKS) callers
// always pass; everyone else needs a paired-device token, the API token, or the
// session cookie minted by POST /api/auth/session.
func (s *Store) authorized(r *http.Request) (bool, string) {
	if s.trustedPeer(r.RemoteAddr) {
		return true, "trusted"
	}
	if token := bearerToken(r.Header.Get("Authorization")); token != "" && (s.valid(token) || apiToken(token)) {
		return true, "token"
	}
	if cookie, err := r.Cookie(SessionCookie); err == nil && cookie.Value != "" {
		if s.valid(cookie.Value) || apiToken(cookie.Value) {
			return true, "cookie"
		}
	}
	return false, ""
}

// secureCookie reports whether the session cookie may carry the Secure flag.
//
// The cookie value is the bearer token itself, so it must not travel in clear
// text. r.TLS alone is not enough: with a TLS-terminating reverse proxy the
// hop into Core is plain HTTP even though the browser used HTTPS. The forwarded
// scheme is only believed from a trusted peer (a hostile client could otherwise
// set the header itself, which would just make its own cookie stricter, but the
// check keeps the signal honest). CORE_COOKIE_SECURE forces either answer for
// deployments the heuristic cannot see.
func (s *Store) secureCookie(r *http.Request) bool {
	switch strings.ToLower(strings.TrimSpace(os.Getenv("CORE_COOKIE_SECURE"))) {
	case "1", "true", "yes":
		return true
	case "0", "false", "no":
		return false
	}
	if r.TLS != nil {
		return true
	}
	if !s.trustedPeer(r.RemoteAddr) {
		return false
	}
	proto := r.Header.Get("X-Forwarded-Proto")
	if proto == "" {
		return false
	}
	// A proxy chain sends a comma separated list; the first entry is the client.
	if index := strings.Index(proto, ","); index >= 0 {
		proto = proto[:index]
	}
	return strings.EqualFold(strings.TrimSpace(proto), "https")
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}

func writeErr(w http.ResponseWriter, status int, code, message string) {
	writeJSON(w, status, map[string]string{"error": message, "code": code})
}

// handleSession implements the browser session endpoints. They run ahead of the
// authentication gate so an unauthenticated caller can still discover that a
// credential is required and supply one.
//
//	GET    /api/auth/session  -> {authenticated, method, requires_auth, core_id}
//	POST   /api/auth/session  {"token": "..."} -> sets the HttpOnly session cookie
//	DELETE /api/auth/session  -> clears the session cookie
func (s *Store) handleSession(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet, http.MethodHead:
		ok, method := s.authorized(r)
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"authenticated": ok,
			"method":        method,
			"requires_auth": !s.trustedPeer(r.RemoteAddr),
			"core_id":       s.ID,
			"lan_enabled":   s.enforce,
		})
	case http.MethodPost:
		var body struct {
			Token string `json:"token"`
		}
		if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 4096)).Decode(&body); err != nil {
			writeErr(w, http.StatusBadRequest, "bad_request", "invalid request")
			return
		}
		token := strings.TrimSpace(body.Token)
		if token == "" {
			if !s.trustedPeer(r.RemoteAddr) {
				writeErr(w, http.StatusUnauthorized, "unauthenticated", "paired device or API token required")
				return
			}
		} else if !s.valid(token) && !apiToken(token) {
			writeErr(w, http.StatusUnauthorized, "unauthenticated", "invalid token")
			return
		}
		if token != "" {
			http.SetCookie(w, &http.Cookie{
				Name:     SessionCookie,
				Value:    token,
				Path:     "/",
				MaxAge:   30 * 24 * 3600,
				HttpOnly: true,
				SameSite: http.SameSiteStrictMode,
				Secure:   s.secureCookie(r),
			})
		}
		ok, method := s.authorized(r)
		if token != "" {
			// The freshly minted cookie is not on this request, so report the
			// credential that was just accepted.
			ok, method = true, "cookie"
		}
		writeJSON(w, http.StatusOK, map[string]interface{}{
			"authenticated": ok,
			"method":        method,
			"requires_auth": !s.trustedPeer(r.RemoteAddr),
			"core_id":       s.ID,
		})
	case http.MethodDelete:
		http.SetCookie(w, &http.Cookie{
			Name:     SessionCookie,
			Value:    "",
			Path:     "/",
			MaxAge:   -1,
			HttpOnly: true,
			SameSite: http.SameSiteStrictMode,
			Secure:   s.secureCookie(r),
		})
		writeJSON(w, http.StatusOK, map[string]interface{}{"authenticated": false, "method": ""})
	default:
		w.Header().Set("Allow", "GET, HEAD, POST, DELETE, OPTIONS")
		writeErr(w, http.StatusMethodNotAllowed, "method_not_allowed", "method not allowed")
	}
}

func (s *Store) HTTP(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/pairing/") {
			s.handle(w, r)
			return
		}
		if r.URL.Path == "/api/auth/session" {
			s.handleSession(w, r)
			return
		}
		// Any non-loopback caller (LAN or container network) must present a paired-device
		// token, the API token, or the session cookie. Loopback and
		// CORE_TRUSTED_NETWORKS callers stay exempt.
		if ok, _ := s.authorized(r); !ok {
			w.Header().Set("WWW-Authenticate", `Bearer realm="0kay"`)
			writeErr(w, http.StatusUnauthorized, "unauthenticated", "paired device or API token required")
			return
		}
		next.ServeHTTP(w, r)
	})
}
func (s *Store) handle(w http.ResponseWriter, r *http.Request) {
	if origin := r.Header.Get("Origin"); origin != "" {
		parsed, err := url.Parse(origin)
		if err != nil || !local(r.RemoteAddr) || (parsed.Scheme != "http" && parsed.Scheme != "https") || (parsed.Hostname() != "localhost" && parsed.Hostname() != "127.0.0.1") {
			http.Error(w, "local pairing UI required", 403)
			return
		}
	}
	w.Header().Set("Content-Type", "application/json")
	s.mu.Lock()
	defer s.mu.Unlock()
	for id, request := range s.requests {
		if time.Now().After(request.Expires) {
			delete(s.requests, id)
		}
	}
	switch r.URL.Path {
	case "/api/pairing/request":
		if r.Method != "POST" {
			http.Error(w, "method not allowed", 405)
			return
		}
		if len(s.requests) >= 32 {
			http.Error(w, "too many pairing requests", 429)
			return
		}
		var body struct {
			Name string `json:"name"`
		}
		if json.NewDecoder(http.MaxBytesReader(w, r.Body, 4096)).Decode(&body) != nil {
			http.Error(w, "invalid request", 400)
			return
		}
		number, _ := rand.Int(rand.Reader, big.NewInt(1000000))
		request := &Request{ID: randomID(), Name: body.Name, Code: fmt.Sprintf("%06d", number), Secret: randomID(), Expires: time.Now().Add(5 * time.Minute)}
		s.requests[request.ID] = request
		json.NewEncoder(w).Encode(map[string]interface{}{"id": request.ID, "code": request.Code, "secret": request.Secret, "expires": request.Expires})
	case "/api/pairing/pending":
		if !local(r.RemoteAddr) || r.Method != "GET" {
			http.Error(w, "local access only", 403)
			return
		}
		requests := []*Request{}
		for _, request := range s.requests {
			requests = append(requests, request)
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"requests": requests})
	case "/api/pairing/approve":
		if !local(r.RemoteAddr) || r.Method != "POST" {
			http.Error(w, "local access only", 403)
			return
		}
		var body struct {
			ID    string `json:"id"`
			Code  string `json:"code"`
			Allow bool   `json:"allow"`
		}
		if json.NewDecoder(r.Body).Decode(&body) != nil {
			http.Error(w, "invalid request", 400)
			return
		}
		request := s.requests[body.ID]
		if request == nil || request.Code != body.Code {
			http.Error(w, "pairing code mismatch", 400)
			return
		}
		if !body.Allow {
			delete(s.requests, body.ID)
			json.NewEncoder(w).Encode(map[string]bool{"ok": true})
			return
		}
		request.Token = randomID()
		request.Approved = true
		s.Devices[request.ID] = Device{ID: request.ID, Name: request.Name, Token: request.Token}
		if err := s.save(); err != nil {
			http.Error(w, err.Error(), 500)
			return
		}
		json.NewEncoder(w).Encode(map[string]bool{"ok": true})
	case "/api/pairing/status":
		if r.Method != "POST" {
			http.Error(w, "method not allowed", 405)
			return
		}
		var body struct {
			ID     string `json:"id"`
			Secret string `json:"secret"`
		}
		if json.NewDecoder(r.Body).Decode(&body) != nil {
			http.Error(w, "invalid request", 400)
			return
		}
		request := s.requests[body.ID]
		if request == nil || subtle.ConstantTimeCompare([]byte(request.Secret), []byte(body.Secret)) != 1 {
			http.Error(w, "pairing expired", 404)
			return
		}
		if !request.Approved {
			json.NewEncoder(w).Encode(map[string]bool{"approved": false})
			return
		}
		json.NewEncoder(w).Encode(map[string]interface{}{"approved": true, "core_id": s.ID, "token": request.Token, "certificate": string(s.Certificate), "server_name": s.ID})
		delete(s.requests, body.ID)
	default:
		http.NotFound(w, r)
	}
}
func (s *Store) authorize(ctx context.Context) error {
	// Loopback and explicitly trusted networks pass; every other caller must present
	// a paired-device or API token, regardless of LAN mode.
	p, _ := peer.FromContext(ctx)
	if p != nil && s.trustedPeer(p.Addr.String()) {
		return nil
	}
	md, _ := metadata.FromIncomingContext(ctx)
	values := md.Get("authorization")
	if len(values) > 0 {
		token := strings.TrimPrefix(values[0], "Bearer ")
		if s.valid(token) || apiToken(token) {
			return nil
		}
	}
	return status.Error(codes.Unauthenticated, "paired device or API token required")
}
func (s *Store) Unary(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, next grpc.UnaryHandler) (interface{}, error) {
	if err := s.authorize(ctx); err != nil {
		return nil, err
	}
	return next(ctx, req)
}
func (s *Store) Stream(srv interface{}, stream grpc.ServerStream, info *grpc.StreamServerInfo, next grpc.StreamHandler) error {
	if err := s.authorize(stream.Context()); err != nil {
		return err
	}
	return next(srv, stream)
}
func (s *Store) Bind(ctx context.Context, address string) {
	md, _ := metadata.FromIncomingContext(ctx)
	values := md.Get("authorization")
	if len(values) > 0 {
		s.mu.Lock()
		s.addresses[address] = values[0]
		s.mu.Unlock()
	}
}
func CallbackContext(ctx context.Context, address string) context.Context {
	if Default == nil {
		return ctx
	}
	Default.mu.Lock()
	token := Default.addresses[address]
	Default.mu.Unlock()
	if token != "" {
		return metadata.AppendToOutgoingContext(ctx, "authorization", token)
	}
	return ctx
}
func (s *Store) Discover(ctx context.Context, httpPort, grpcPort int) error {
	conn, err := net.ListenUDP("udp4", &net.UDPAddr{Port: 50050})
	if err != nil {
		return err
	}
	go func() { <-ctx.Done(); conn.Close() }()
	go func() {
		buffer := make([]byte, 2048)
		for {
			n, source, err := conn.ReadFromUDP(buffer)
			if err != nil {
				return
			}
			var request struct {
				Protocol string `json:"protocol"`
				Nonce    string `json:"nonce"`
			}
			if json.Unmarshal(buffer[:n], &request) != nil || request.Protocol != "0kay-discover-v1" {
				continue
			}
			raw, _ := json.Marshal(map[string]interface{}{"protocol": "0kay-core-v1", "nonce": request.Nonce, "id": s.ID, "name": s.Name, "http_port": httpPort, "grpc_port": grpcPort, "fingerprint": s.Fingerprint})
			conn.WriteToUDP(raw, source)
		}
	}()
	return nil
}
