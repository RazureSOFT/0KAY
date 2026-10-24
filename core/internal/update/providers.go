package update

import (
	"encoding/json"
	"os"
	"path/filepath"
)

type ProviderSpec struct {
	Package      string
	ID           string
	Name         string
	Models       []string
	DefaultModel string
	Route        string
	Dir          string
	Command      []string
}

func ProviderSpecs() []ProviderSpec {
	var out []ProviderSpec
	for _, record := range pmInstalledRoots() {
		raw, err := os.ReadFile(filepath.Join(record.Root, "manifest.json"))
		if err != nil {
			continue
		}
		var manifest struct {
			Provider struct {
				ID           string   `json:"id"`
				Name         string   `json:"name"`
				Models       []string `json:"models"`
				DefaultModel string   `json:"default_model"`
				Route        string   `json:"route"`
				Stdio        []string `json:"stdio"`
			} `json:"provider"`
		}
		if json.Unmarshal(raw, &manifest) != nil {
			continue
		}
		p := manifest.Provider
		if p.ID == "" || len(p.Stdio) == 0 {
			continue
		}
		route := p.Route
		if route == "" {
			route = "/v1"
		}
		defaultModel := p.DefaultModel
		if defaultModel == "" && len(p.Models) > 0 {
			defaultModel = p.Models[0]
		}
		out = append(out, ProviderSpec{
			Package: record.Name, ID: p.ID, Name: p.Name, Models: p.Models,
			DefaultModel: defaultModel, Route: route, Dir: record.Root, Command: p.Stdio,
		})
	}
	return out
}
