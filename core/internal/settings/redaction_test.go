package settings

import (
	"encoding/json"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func secretSection() Section {
	return Section{
		ID:    "tts",
		Label: "TTS",
		Fields: []Field{
			{Key: "endpoint", Type: "string", Label: "Endpoint"},
			// Declared secret.
			{Key: "service_token", Type: "string", Label: "Token", Secret: true},
			// Not declared, but the key looks like a credential: the denylist has
			// to cover plugins that predate Field.Secret.
			{Key: "imap_password", Type: "string", Label: "IMAP password"},
			// A secret whose default_value is itself a credential.
			{Key: "api_key", Type: "string", Label: "Key", Secret: true, DefaultValue: "sk-leaked-in-default"},
			{Key: "voice", Type: "string", Label: "Voice", DefaultValue: "alloy"},
		},
	}
}

func newSecretStore(t *testing.T) *Store {
	t.Helper()
	path := filepath.Join(t.TempDir(), "settings.json")
	store := NewStore(path)
	store.RegisterSection(secretSection())
	return store
}

func TestIsSecretKey(t *testing.T) {
	secret := []string{"password", "imap_password", "api_key", "apikey", "service_token",
		"CLIENT_SECRET", "private_key", "aws_access_key", "auth_header"}
	for _, key := range secret {
		if !IsSecretKey(key) {
			t.Errorf("%q should be treated as a credential", key)
		}
	}
	ordinary := []string{"endpoint", "voice", "enabled", "model_url", "engine", "temperature"}
	for _, key := range ordinary {
		if IsSecretKey(key) {
			t.Errorf("%q should not be treated as a credential", key)
		}
	}
}

// TestGetValuesRedactsCredentials is the regression test: GetValues returned
// every stored value verbatim, so /api/settings/{id} shipped the TTS token and
// the IMAP password in cleartext to anything holding a browser session.
func TestGetValuesRedactsCredentials(t *testing.T) {
	store := newSecretStore(t)
	if err := store.SetValues("tts", map[string]interface{}{
		"service_token": "tok-abcdef123456",
		"imap_password": "hunter2hunter2",
		"api_key":       "sk-real-key-value",
	}); err != nil {
		t.Fatal(err)
	}

	values := store.GetValues("tts")
	for _, key := range []string{"service_token", "imap_password", "api_key"} {
		if got, _ := values[key].(string); got != "" {
			t.Errorf("%s leaked: %q", key, got)
		}
	}
	// A non-empty credential gets a non-reversible hint so the UI can render
	// "configured" rather than "unset".
	if mask, _ := values["service_token_masked"].(string); !strings.Contains(mask, "3456") || strings.Contains(mask, "tok-abc") {
		t.Errorf("service_token_masked = %q", mask)
	}
	// Non-credentials are untouched.
	if values["endpoint"] != "" || values["voice"] != "alloy" {
		t.Errorf("non-credential values disturbed: %#v", values)
	}
	// A secret's default_value is a credential too.
	if got, _ := values["api_key"].(string); got == "sk-leaked-in-default" {
		t.Error("a secret default_value was echoed to the client")
	}
}

func TestUnconfiguredSecretIsEmptyNotMasked(t *testing.T) {
	store := newSecretStore(t)
	values := store.GetValues("tts")
	if got, _ := values["service_token"].(string); got != "" {
		t.Errorf("unset secret should read as empty, got %q", got)
	}
	if _, present := values["service_token_masked"]; present {
		t.Error("an unset secret should not report a mask; the UI must be able to say 'unset'")
	}
}

// TestGetValuesRawIsThePluginPath pins that in-process consumers still get real
// values: plugins legitimately need their own credentials.
func TestGetValuesRawIsThePluginPath(t *testing.T) {
	store := newSecretStore(t)
	if err := store.SetValues("tts", map[string]interface{}{"service_token": "tok-abcdef123456"}); err != nil {
		t.Fatal(err)
	}
	if got, _ := store.GetValuesRaw("tts")["service_token"].(string); got != "tok-abcdef123456" {
		t.Fatalf("GetValuesRaw = %q", got)
	}
}

// TestSetValuesPreservesSecretOnMaskRoundTrip is the other half. The WebUI reads
// a masked value and POSTs it back; without this the round-trip erased every
// password on the next unrelated settings save.
func TestSetValuesPreservesSecretOnMaskRoundTrip(t *testing.T) {
	store := newSecretStore(t)
	const real = "tok-abcdef123456"
	if err := store.SetValues("tts", map[string]interface{}{"service_token": real}); err != nil {
		t.Fatal(err)
	}

	// Exactly what a browser does: read, then write back unchanged.
	read := store.GetValues("tts")
	if err := store.SetValues("tts", read); err != nil {
		t.Fatal(err)
	}
	if got, _ := store.GetValuesRaw("tts")["service_token"].(string); got != real {
		t.Fatalf("mask round-trip erased the credential: %q", got)
	}

	// Also for an explicitly empty submission, which some panels send.
	if err := store.SetValues("tts", map[string]interface{}{"service_token": ""}); err != nil {
		t.Fatal(err)
	}
	if got, _ := store.GetValuesRaw("tts")["service_token"].(string); got != real {
		t.Fatalf("an empty submission erased the credential: %q", got)
	}
}

func TestSetValuesCanClearASecret(t *testing.T) {
	store := newSecretStore(t)
	if err := store.SetValues("tts", map[string]interface{}{"service_token": "tok-abcdef123456"}); err != nil {
		t.Fatal(err)
	}
	// Clearing is a two-step: the mask round-trip above preserves, so an operator
	// removing a credential must be able to force it. An explicit non-masked
	// empty write is accepted when the field is currently unset, and a real
	// replacement works here.
	if err := store.SetValues("tts", map[string]interface{}{"service_token": "   "}); err != nil {
		t.Fatal(err)
	}
	if got, _ := store.GetValuesRaw("tts")["service_token"].(string); strings.TrimSpace(got) != "" {
		t.Fatalf("a whitespace submission did not clear the credential: %q", got)
	}
}

func TestNonSecretRoundTripIsUnaffected(t *testing.T) {
	store := newSecretStore(t)
	if err := store.SetValues("tts", map[string]interface{}{"endpoint": "http://127.0.0.1:9000"}); err != nil {
		t.Fatal(err)
	}
	read := store.GetValues("tts")
	if read["endpoint"] != "http://127.0.0.1:9000" {
		t.Fatalf("endpoint = %v", read["endpoint"])
	}
	if err := store.SetValues("tts", read); err != nil {
		t.Fatal(err)
	}
	if got, _ := store.GetValues("tts")["endpoint"].(string); got != "http://127.0.0.1:9000" {
		t.Fatalf("round-trip lost the endpoint: %q", got)
	}
}

// TestSecretsAreStillPersistedToDisk pins the distinction the redaction is
// about: it must not become a write-path filter. A plugin needs its credential on
// the next boot.
func TestSecretsAreStillPersistedToDisk(t *testing.T) {
	store := newSecretStore(t)
	if err := store.SetValues("tts", map[string]interface{}{"service_token": "tok-abcdef123456"}); err != nil {
		t.Fatal(err)
	}
	raw, err := os.ReadFile(store.path)
	if err != nil {
		t.Fatal(err)
	}
	var onDisk struct {
		Values map[string]map[string]interface{} `json:"values"`
	}
	if err := json.Unmarshal(raw, &onDisk); err != nil {
		t.Fatal(err)
	}
	if onDisk.Values["tts"]["service_token"] != "tok-abcdef123456" {
		t.Fatal("the credential must still be persisted for the plugin to read in-process")
	}
}

func TestIsSecretSection(t *testing.T) {
	store := newSecretStore(t)
	if !store.IsSecret("tts") {
		t.Error("a section with credential fields should report itself as secret")
	}
	store.RegisterSection(Section{ID: "plain", Fields: []Field{{Key: "engine", Type: "string"}}})
	if store.IsSecret("plain") {
		t.Error("a section with no credential fields should not report itself as secret")
	}
}

func TestMaskSecret(t *testing.T) {
	if got := MaskSecret(""); got != "" {
		t.Errorf("MaskSecret(\"\") = %q", got)
	}
	if got := MaskSecret("abcd"); got != "****" {
		t.Errorf("a 4-char secret should not reveal its body: %q", got)
	}
	if got := MaskSecret("abcdefgh"); got != "****efgh" {
		t.Errorf("MaskSecret = %q", got)
	}
}

func TestIsMaskedSecret(t *testing.T) {
	const existing = "tok-abcdef123456"
	if !IsMaskedSecret("", existing) {
		t.Error("an empty submission must preserve the stored secret")
	}
	if !IsMaskedSecret(MaskSecret(existing), existing) {
		t.Error("the mask must preserve the stored secret")
	}
	if !IsMaskedSecret("****whatever", existing) {
		t.Error("a mask-shaped value must preserve the stored secret")
	}
	if IsMaskedSecret("a-new-token", existing) {
		t.Error("a real replacement must be accepted")
	}
}
