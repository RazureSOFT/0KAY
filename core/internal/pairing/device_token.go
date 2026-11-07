package pairing

// The device token: one secret per installation, created on first start.
//
// Core used to accept exactly one machine credential, CORE_API_TOKEN, and only
// if the process was launched with that variable set. That works for a
// developer starting the stack from a shell and fails for everyone else: an
// installed app launches Core itself, the variable is never set, and the local
// client is locked out of its own Core on first run.
//
// So Core now mints its own token, once, and keeps it beside its data. The
// launcher, the agent and the IDE read it from there. The environment variable
// still works and still wins where it is set, because scripts and CI rely on it.
//
// The file is written 0600 where the OS supports it: it is a bearer credential,
// and a token that any local account can read is not a token.

import (
	"crypto/rand"
	"crypto/subtle"
	"encoding/base64"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

const deviceTokenFile = "device-token"

var (
	deviceTokenMu    sync.RWMutex
	deviceTokenValue string
)

// LoadDeviceToken reads the persisted token, creating it when absent. Called
// once during startup; a write failure is reported rather than hidden, because
// silently running without a device token is the bug this file exists to fix.
func LoadDeviceToken(dataDir string) (string, error) {
	if dataDir == "" {
		return "", nil
	}
	path := filepath.Join(dataDir, deviceTokenFile)
	raw, err := os.ReadFile(path)
	if err == nil {
		value := strings.TrimSpace(string(raw))
		if value != "" {
			setDeviceToken(value)
			return value, nil
		}
	} else if !os.IsNotExist(err) {
		return "", err
	}

	buffer := make([]byte, 32)
	if _, err := rand.Read(buffer); err != nil {
		return "", err
	}
	value := base64.RawURLEncoding.EncodeToString(buffer)
	if err := os.MkdirAll(dataDir, 0o700); err != nil {
		return "", err
	}
	// Write through a temp file so a crash mid-write cannot leave a truncated
	// token that would then be read back as valid.
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, []byte(value+"\n"), 0o600); err != nil {
		return "", err
	}
	if err := os.Rename(tmp, path); err != nil {
		return "", err
	}
	setDeviceToken(value)
	return value, nil
}

func setDeviceToken(value string) {
	deviceTokenMu.Lock()
	deviceTokenValue = value
	deviceTokenMu.Unlock()
}

// DeviceToken returns the current token, or "" when startup could not create one.
func DeviceToken() string {
	deviceTokenMu.RLock()
	defer deviceTokenMu.RUnlock()
	return deviceTokenValue
}

// apiToken accepts the environment token when it is set, and Core's own device
// token otherwise — so a shell-launched stack and an installed app both work.
func apiToken(token string) bool {
	if token == "" {
		return false
	}
	if expected := os.Getenv("CORE_API_TOKEN"); expected != "" {
		if subtle.ConstantTimeCompare([]byte(token), []byte(expected)) == 1 {
			return true
		}
	}
	device := DeviceToken()
	return device != "" && subtle.ConstantTimeCompare([]byte(token), []byte(device)) == 1
}
