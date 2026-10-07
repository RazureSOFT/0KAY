// Package i18n reads Android-style string resources.
//
// Every user-facing string in the platform lives in a strings.xml, and plugins
// ship theirs the same way. Using Android's resource format is deliberate: the
// project already has an Android client that consumes these files directly, and
// a plugin author writing Go, Python or TypeScript all author the same format.
//
// This package is the Go half of the contract — Core parses a plugin's
// resources and serves them to the WebUI, which merges them into vue-i18n.
//
// Layout mirrors Android's, one directory per locale:
//
//	strings/values/strings.xml             (default, English)
//	strings/values-zh/strings.xml
//	strings/values-ja/strings.xml
//	strings/values-b+zh+Hant/strings.xml   (script-only tag, BCP-47 form)
package i18n

import (
	"encoding/xml"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// DefaultLocale is the locale reported for a bare `values` directory.
const DefaultLocale = "en"

// Parse decodes a strings.xml into a flat `key -> value` map.
//
// Values are taken verbatim from the character data: several strings are
// deliberately padded with spaces (a leading " · LAN mode"), and trimming here
// would silently change the rendered text. Standard XML entities are decoded by
// encoding/xml. Note that aapt's own escapes (\' and %%) are *not* used by these
// files — a standard parser would not undo them — so apostrophes and percent
// signs stay literal.
func Parse(text string) (map[string]string, error) {
	out := map[string]string{}
	decoder := xml.NewDecoder(strings.NewReader(text))
	var current string
	var value strings.Builder
	inString := false

	for {
		token, err := decoder.Token()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("parse strings.xml: %w", err)
		}
		switch element := token.(type) {
		case xml.StartElement:
			if element.Name.Local != "string" {
				continue
			}
			name := ""
			for _, attr := range element.Attr {
				if attr.Name.Local == "name" {
					name = attr.Value
				}
			}
			if name == "" {
				return nil, fmt.Errorf("parse strings.xml: <string> without a name attribute")
			}
			if _, duplicate := out[name]; duplicate {
				return nil, fmt.Errorf("parse strings.xml: duplicate string name %q", name)
			}
			current, value, inString = name, strings.Builder{}, true
		case xml.CharData:
			if inString {
				value.Write([]byte(element))
			}
		case xml.EndElement:
			if element.Name.Local == "string" && inString {
				out[current] = value.String()
				inString = false
			}
		}
	}
	return out, nil
}

// LocaleFromValuesDir maps an Android resource directory name to an app locale
// code. A bare "values" is the default locale; "values-zh" is zh; a script-only
// tag arrives in its BCP-47 form as "values-b+zh+Hant" and becomes "zh-Hant".
//
// It returns false for anything that is not a values directory.
func LocaleFromValuesDir(dir string) (string, bool) {
	if dir == "values" {
		return DefaultLocale, true
	}
	qualifier, ok := strings.CutPrefix(dir, "values-")
	if !ok || qualifier == "" {
		return "", false
	}
	if bcp47, isBCP47 := strings.CutPrefix(qualifier, "b+"); isBCP47 {
		// b+zh+Hant -> zh-Hant
		return strings.ReplaceAll(bcp47, "+", "-"), true
	}
	return qualifier, true
}

// LoadDir reads every `<root>/values*/strings.xml` into a `locale -> (key ->
// value)` map. A missing or empty root yields an empty map rather than an error:
// a plugin simply may not ship translations.
func LoadDir(root string) (map[string]map[string]string, error) {
	entries, err := os.ReadDir(root)
	if err != nil {
		if os.IsNotExist(err) {
			return map[string]map[string]string{}, nil
		}
		return nil, err
	}
	out := map[string]map[string]string{}
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		locale, ok := LocaleFromValuesDir(entry.Name())
		if !ok {
			continue
		}
		raw, err := os.ReadFile(filepath.Join(root, entry.Name(), "strings.xml"))
		if err != nil {
			if os.IsNotExist(err) {
				continue
			}
			return nil, err
		}
		// Guard against a plugin pointing at a path outside its own tree.
		parsed, err := Parse(string(raw))
		if err != nil {
			return nil, fmt.Errorf("%s/%s: %w", entry.Name(), "strings.xml", err)
		}
		out[locale] = parsed
	}
	return out, nil
}

// Locales returns the locale codes present, sorted, for stable JSON output.
func Locales(bundle map[string]map[string]string) []string {
	codes := make([]string, 0, len(bundle))
	for code := range bundle {
		codes = append(codes, code)
	}
	sort.Strings(codes)
	return codes
}
