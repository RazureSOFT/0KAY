// Package okaydevkit is a small, dependency-free client for the 0kay Core HTTP API.
//
//	ok := okaydevkit.New(0)            // resolves the port (arg > CORE_HTTP > OKAY_CORE_PORT > 8080)
//	core, _ := ok.GetCore()            // { Status, Healthy, Plugins }
//	plugin, _ := ok.GetPlugin("agent") // by name or plugin_id
//	plugin.IsEnabled()                 // -> bool
package okaydevkit

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"
)

const DefaultPort = 8080

// ResolveBaseURL resolves the Core base URL.
// Order: explicit port > CORE_HTTP / CORE_HTTP_ADDR > OKAY_CORE_PORT > default.
func ResolveBaseURL(port int) string {
	if port > 0 {
		return fmt.Sprintf("http://127.0.0.1:%d", port)
	}
	for _, key := range []string{"CORE_HTTP", "CORE_HTTP_ADDR"} {
		if value := strings.TrimSpace(os.Getenv(key)); value != "" {
			return strings.TrimRight(value, "/")
		}
	}
	if value := strings.TrimSpace(os.Getenv("OKAY_CORE_PORT")); value != "" {
		if parsed, err := strconv.Atoi(value); err == nil {
			return fmt.Sprintf("http://127.0.0.1:%d", parsed)
		}
	}
	return fmt.Sprintf("http://127.0.0.1:%d", DefaultPort)
}

// Plugin mirrors one entry of GET /api/plugins.
type Plugin struct {
	PluginID     string   `json:"plugin_id"`
	Name         string   `json:"name"`
	Version      string   `json:"version"`
	Type         string   `json:"type"`
	Status       string   `json:"status"`
	Capabilities []string `json:"capabilities"`
	ActiveTasks  int      `json:"active_tasks"`
	Disabled     bool     `json:"disabled"`
	Builtin      bool     `json:"builtin"`
}

func (p Plugin) IsEnabled() bool { return !p.Disabled }
func (p Plugin) IsHealthy() bool { return p.Status == "PLUGIN_STATUS_HEALTHY" }

// Core mirrors GET /health.
type Core struct {
	Status  string `json:"status"`
	Healthy int    `json:"healthy"`
	Plugins int    `json:"plugins"`
	BaseURL string `json:"-"`
}

// Okay is a thin client over the Core HTTP API.
type Okay struct {
	BaseURL string
	Client  *http.Client
}

// New builds a client. Pass 0 to resolve the port from the environment.
func New(port int) *Okay {
	return &Okay{BaseURL: ResolveBaseURL(port), Client: &http.Client{Timeout: 10 * time.Second}}
}

// Get fetches a path and returns the raw body.
func (o *Okay) Get(path string, params url.Values) ([]byte, error) {
	endpoint := o.BaseURL + path
	if len(params) > 0 {
		endpoint += "?" + params.Encode()
	}
	response, err := o.Client.Get(endpoint)
	if err != nil {
		return nil, err
	}
	defer response.Body.Close()
	body, _ := io.ReadAll(response.Body)
	if response.StatusCode >= 300 {
		return nil, fmt.Errorf("%s: %s", response.Status, string(body))
	}
	return body, nil
}

func (o *Okay) Health() (Core, error) {
	var core Core
	body, err := o.Get("/health", nil)
	if err != nil {
		return core, err
	}
	if err := json.Unmarshal(body, &core); err != nil {
		return core, err
	}
	core.BaseURL = o.BaseURL
	return core, nil
}

func (o *Okay) GetCore() (*Core, error) {
	core, err := o.Health()
	if err != nil {
		return nil, err
	}
	return &core, nil
}

func (o *Okay) Plugins() ([]Plugin, error) {
	body, err := o.Get("/api/plugins", nil)
	if err != nil {
		return nil, err
	}
	var plugins []Plugin
	if err := json.Unmarshal(body, &plugins); err != nil {
		return nil, err
	}
	return plugins, nil
}

// GetPlugin finds a plugin by plugin_id or name (case-insensitive); nil if absent.
func (o *Okay) GetPlugin(key string) (*Plugin, error) {
	plugins, err := o.Plugins()
	if err != nil {
		return nil, err
	}
	needle := strings.ToLower(strings.TrimSpace(key))
	for index := range plugins {
		plugin := &plugins[index]
		if strings.ToLower(plugin.PluginID) == needle || strings.ToLower(plugin.Name) == needle {
			return plugin, nil
		}
	}
	return nil, nil
}

func (o *Okay) SettingsSections() ([]map[string]any, error) {
	body, err := o.Get("/api/settings/sections", nil)
	if err != nil {
		return nil, err
	}
	var payload struct {
		Sections []map[string]any `json:"sections"`
	}
	if err := json.Unmarshal(body, &payload); err != nil {
		return nil, err
	}
	return payload.Sections, nil
}

// Surface is a snapshot of everything the devkit discovered.
func (o *Okay) Surface() (map[string]any, error) {
	health, err := o.Health()
	if err != nil {
		return nil, err
	}
	plugins, err := o.Plugins()
	if err != nil {
		return nil, err
	}
	sections, err := o.SettingsSections()
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"base_url":          o.BaseURL,
		"health":            health,
		"plugins":           plugins,
		"settings_sections": sections,
	}, nil
}
