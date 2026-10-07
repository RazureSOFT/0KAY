package i18n

import (
	"os"
	"path/filepath"
	"reflect"
	"testing"
)

func TestParseBasic(t *testing.T) {
	got, err := Parse(`<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string name="mcp.title">MCP servers</string>
  <string name="nav.console">Console</string>
</resources>`)
	if err != nil {
		t.Fatal(err)
	}
	want := map[string]string{"mcp.title": "MCP servers", "nav.console": "Console"}
	if !reflect.DeepEqual(got, want) {
		t.Fatalf("got %#v, want %#v", got, want)
	}
}

func TestParsePreservesWhitespace(t *testing.T) {
	// Several strings are padded on purpose. Trimming would change the rendered
	// text, so this is the property the parser most needs to hold.
	got, err := Parse(`<resources>
  <string name="connection.lanMode"> · LAN mode</string>
  <string name="usage.requestsSuffix">requests</string>
</resources>`)
	if err != nil {
		t.Fatal(err)
	}
	if got["connection.lanMode"] != " · LAN mode" {
		t.Fatalf("leading space lost: %q", got["connection.lanMode"])
	}
	if got["usage.requestsSuffix"] != "requests" {
		t.Fatalf("trailing space changed: %q", got["usage.requestsSuffix"])
	}
}

func TestParseDecodesEntities(t *testing.T) {
	got, err := Parse(`<resources>
  <string name="a.amp">Email (IMAP &amp; SMTP)</string>
  <string name="a.lt">a &lt; b &gt; c</string>
  <string name="a.quote">say &quot;hi&quot;</string>
  <string name="a.apos">L.I.F.E's settings</string>
</resources>`)
	if err != nil {
		t.Fatal(err)
	}
	for key, want := range map[string]string{
		"a.amp":   "Email (IMAP & SMTP)",
		"a.lt":    "a < b > c",
		"a.quote": `say "hi"`,
		// A bare apostrophe is not an entity and must come through literally.
		"a.apos": "L.I.F.E's settings",
	} {
		if got[key] != want {
			t.Errorf("%s = %q, want %q", key, got[key], want)
		}
	}
}

func TestParseEmptyValue(t *testing.T) {
	got, err := Parse(`<resources><string name="a.empty"></string></resources>`)
	if err != nil {
		t.Fatal(err)
	}
	if value, ok := got["a.empty"]; !ok || value != "" {
		t.Fatalf("empty string not recorded: %#v", got)
	}
}

func TestParseRejectsMalformedInput(t *testing.T) {
	// Catching these at load time beats serving a half-parsed bundle that renders
	// key paths in the UI.
	if _, err := Parse(`<resources><string>no name</string></resources>`); err == nil {
		t.Fatal("expected an error for a <string> without a name")
	}
	if _, err := Parse(`<resources><string name="x">a</string><string name="x">b</string></resources>`); err == nil {
		t.Fatal("expected an error for a duplicate name")
	}
	if _, err := Parse(`<resources><string name="x">unclosed`); err == nil {
		t.Fatal("expected an error for unclosed XML")
	}
}

func TestLocaleFromValuesDir(t *testing.T) {
	for dir, want := range map[string]string{
		"values":           "en",
		"values-zh":        "zh",
		"values-ja":        "ja",
		"values-b+zh+Hant": "zh-Hant",
		"values-zh-rTW":    "zh-rTW",
	} {
		got, ok := LocaleFromValuesDir(dir)
		if !ok || got != want {
			t.Errorf("LocaleFromValuesDir(%q) = %q,%v want %q,true", dir, got, ok, want)
		}
	}
	for _, dir := range []string{"strings", "drawable", "values", "raw", "values-"} {
		if dir == "values" {
			continue
		}
		if _, ok := LocaleFromValuesDir(dir); ok {
			t.Errorf("LocaleFromValuesDir(%q) unexpectedly accepted", dir)
		}
	}
}

func TestLoadDir(t *testing.T) {
	root := t.TempDir()
	write := func(dir, body string) {
		full := filepath.Join(root, dir)
		if err := os.MkdirAll(full, 0o755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(filepath.Join(full, "strings.xml"), []byte(body), 0o644); err != nil {
			t.Fatal(err)
		}
	}
	write("values", `<resources><string name="a.b">English</string></resources>`)
	write("values-zh", `<resources><string name="a.b">中文</string></resources>`)
	write("values-b+zh+Hant", `<resources><string name="a.b">繁體</string></resources>`)
	// A non-values directory must be ignored, not parsed.
	write("drawable", `<not-strings/>`)

	bundle, err := LoadDir(root)
	if err != nil {
		t.Fatal(err)
	}
	if bundle["en"]["a.b"] != "English" || bundle["zh"]["a.b"] != "中文" || bundle["zh-Hant"]["a.b"] != "繁體" {
		t.Fatalf("bundle = %#v", bundle)
	}
	if len(bundle) != 3 {
		t.Fatalf("expected 3 locales, got %d: %#v", len(bundle), bundle)
	}
	if got := Locales(bundle); !reflect.DeepEqual(got, []string{"en", "zh", "zh-Hant"}) {
		t.Fatalf("Locales = %#v", got)
	}
}

func TestLoadDirMissingRootIsEmpty(t *testing.T) {
	// A plugin that ships no translations must not look like an error.
	bundle, err := LoadDir(filepath.Join(t.TempDir(), "nope"))
	if err != nil {
		t.Fatal(err)
	}
	if len(bundle) != 0 {
		t.Fatalf("expected an empty bundle, got %#v", bundle)
	}
}

func TestLoadDirRejectsBrokenXml(t *testing.T) {
	root := t.TempDir()
	dir := filepath.Join(root, "values")
	if err := os.MkdirAll(dir, 0o755); err != nil {
		t.Fatal(err)
	}
	if err := os.WriteFile(filepath.Join(dir, "strings.xml"), []byte(`<resources><string name="x">`), 0o644); err != nil {
		t.Fatal(err)
	}
	if _, err := LoadDir(root); err == nil {
		t.Fatal("expected an error for malformed XML")
	}
}
