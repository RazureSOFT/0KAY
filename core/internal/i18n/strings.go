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

const DefaultLocale = "en"

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

func LocaleFromValuesDir(dir string) (string, bool) {
	if dir == "values" {
		return DefaultLocale, true
	}
	qualifier, ok := strings.CutPrefix(dir, "values-")
	if !ok || qualifier == "" {
		return "", false
	}
	if bcp47, isBCP47 := strings.CutPrefix(qualifier, "b+"); isBCP47 {
		return strings.ReplaceAll(bcp47, "+", "-"), true
	}
	return qualifier, true
}

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
		parsed, err := Parse(string(raw))
		if err != nil {
			return nil, fmt.Errorf("%s/%s: %w", entry.Name(), "strings.xml", err)
		}
		out[locale] = parsed
	}
	return out, nil
}

func Locales(bundle map[string]map[string]string) []string {
	codes := make([]string, 0, len(bundle))
	for code := range bundle {
		codes = append(codes, code)
	}
	sort.Strings(codes)
	return codes
}
