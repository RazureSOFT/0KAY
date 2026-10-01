package update

import (
	"encoding/json"
	"os"
	"path/filepath"
)

// SettingsSpec is a settings section an installed package declares in its
// manifest; Core registers it so the WebUI can render it (used by stdio
// provider plugins, which have no gRPC registration channel).
type SettingsSpec struct {
	Package     string
	ID          string
	Label       string
	Icon        string
	Description string
	Order       int
	Fields      []SettingsFieldSpec
}

// SettingsFieldSpec mirrors settings.Field for a manifest declaration.
type SettingsFieldSpec struct {
	Key          string
	Type         string
	Label        string
	DefaultValue string
	Help         string
	Options      []string
}

// PluginSettingsSpecs reads the `settings` block of every installed manifest.
func PluginSettingsSpecs() []SettingsSpec {
	var out []SettingsSpec
	for _, record := range pmInstalledRoots() {
		raw, err := os.ReadFile(filepath.Join(record.Root, "manifest.json"))
		if err != nil {
			continue
		}
		var manifest struct {
			Settings struct {
				ID          string `json:"id"`
				Label       string `json:"label"`
				Icon        string `json:"icon"`
				Description string `json:"description"`
				Order       int    `json:"order"`
				Fields      []struct {
					Key          string   `json:"key"`
					Type         string   `json:"type"`
					Label        string   `json:"label"`
					DefaultValue string   `json:"default_value"`
					Help         string   `json:"help"`
					Options      []string `json:"options"`
				} `json:"fields"`
			} `json:"settings"`
		}
		if json.Unmarshal(raw, &manifest) != nil {
			continue
		}
		s := manifest.Settings
		if s.ID == "" {
			continue
		}
		fields := make([]SettingsFieldSpec, 0, len(s.Fields))
		for _, f := range s.Fields {
			if f.Key == "" {
				continue
			}
			fields = append(fields, SettingsFieldSpec{
				Key: f.Key, Type: f.Type, Label: f.Label,
				DefaultValue: f.DefaultValue, Help: f.Help, Options: f.Options,
			})
		}
		out = append(out, SettingsSpec{
			Package: record.Name, ID: s.ID, Label: s.Label, Icon: s.Icon,
			Description: s.Description, Order: s.Order, Fields: fields,
		})
	}
	return out
}
