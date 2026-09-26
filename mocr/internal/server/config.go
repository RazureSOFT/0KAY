package server

import (
	"context"
	"encoding/json"
	"io"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"

	"0kay/mocr/internal/providers"
)

// runtimeSettings mirrors the Core "provider" settings section (15s poll).
type runtimeSettings struct {
	DefaultModel      string
	Strategy          string
	MaxRetries        int
	PriceOverrides    map[string]providers.PriceSpec
	AutoSwitch        bool
	SwitchMaxAttempts int
	FallbackModels    []string
}

var (
	rtMu   sync.RWMutex
	rtVal  = runtimeSettings{AutoSwitch: true, SwitchMaxAttempts: 2, Strategy: "auto", MaxRetries: 2}
	rtOnce sync.Once
)

// currentRuntime returns a snapshot of the polled provider settings.
func currentRuntime() runtimeSettings {
	rtMu.RLock()
	defer rtMu.RUnlock()
	out := rtVal
	out.FallbackModels = append([]string(nil), rtVal.FallbackModels...)
	if rtVal.PriceOverrides != nil {
		out.PriceOverrides = make(map[string]providers.PriceSpec, len(rtVal.PriceOverrides))
		for k, v := range rtVal.PriceOverrides {
			out.PriceOverrides[k] = v
		}
	}
	return out
}

// startRuntimePoll begins the background poll of GET /api/settings/provider.
func startRuntimePoll() {
	rtOnce.Do(func() {
		go func() {
			pollRuntimeSettings()
			t := time.NewTicker(15 * time.Second)
			defer t.Stop()
			for range t.C {
				pollRuntimeSettings()
			}
		}()
	})
}

func jsonBool(raw json.RawMessage, def bool) bool {
	var b bool
	if err := json.Unmarshal(raw, &b); err == nil {
		return b
	}
	var s string
	if err := json.Unmarshal(raw, &s); err == nil {
		switch strings.ToLower(strings.TrimSpace(s)) {
		case "true", "1", "yes", "on":
			return true
		case "false", "0", "no", "off", "":
			return false
		}
	}
	return def
}

func jsonInt(raw json.RawMessage, def int) int {
	var n float64
	if err := json.Unmarshal(raw, &n); err == nil {
		return int(n)
	}
	var s string
	if err := json.Unmarshal(raw, &s); err == nil {
		if v, err := strconv.Atoi(strings.TrimSpace(s)); err == nil {
			return v
		}
	}
	return def
}

// fetchSectionValues pulls one settings section's values from Core (best-effort).
func fetchSectionValues(section string) (map[string]json.RawMessage, bool) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, coreHTTPBase()+"/api/settings/"+section, nil)
	if err != nil {
		return nil, false
	}
	coreAuth(req)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, false
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		io.Copy(io.Discard, io.LimitReader(resp.Body, 4096))
		return nil, false
	}
	var body struct {
		Values map[string]json.RawMessage `json:"values"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil || body.Values == nil {
		return nil, false
	}
	return body.Values, true
}

// pollRuntimeSettings fetches provider section values from Core (best-effort).
func pollRuntimeSettings() {
	// mocr has its own "mocr" section; fall back to the legacy "provider" section.
	body := struct {
		Values map[string]json.RawMessage `json:"values"`
	}{}
	values, ok := fetchSectionValues("mocr")
	if !ok || len(values) == 0 {
		if legacy, legacyOK := fetchSectionValues("provider"); legacyOK {
			values = legacy
		}
	}
	if values == nil {
		return
	}
	body.Values = values

	next := runtimeSettings{AutoSwitch: true, SwitchMaxAttempts: 2, Strategy: "auto", MaxRetries: 2}
	if raw, ok := body.Values["default_model"]; ok {
		_ = json.Unmarshal(raw, &next.DefaultModel)
	}
	if raw, ok := body.Values["max_retries"]; ok {
		next.MaxRetries = jsonInt(raw, 2)
	}
	if raw, ok := body.Values["model_prices"]; ok {
		var s string
		if json.Unmarshal(raw, &s) == nil {
			next.PriceOverrides = providers.ParsePriceOverrides(s)
		}
	}
	if raw, ok := body.Values["model_strategy"]; ok {
		var s string
		if json.Unmarshal(raw, &s) == nil {
			switch strings.ToLower(strings.TrimSpace(s)) {
			case "quality", "cost", "pinned", "auto":
				next.Strategy = strings.ToLower(strings.TrimSpace(s))
			}
		}
	}
	if raw, ok := body.Values["auto_switch_model"]; ok {
		next.AutoSwitch = jsonBool(raw, true)
	}
	if raw, ok := body.Values["switch_max_attempts"]; ok {
		next.SwitchMaxAttempts = jsonInt(raw, 2)
	}
	if raw, ok := body.Values["fallback_models"]; ok {
		var s string
		if json.Unmarshal(raw, &s) == nil {
			for _, p := range strings.Split(s, ",") {
				if t := strings.TrimSpace(p); t != "" {
					next.FallbackModels = append(next.FallbackModels, t)
				}
			}
		}
	}
	if next.SwitchMaxAttempts < 0 {
		next.SwitchMaxAttempts = 0
	}
	if next.SwitchMaxAttempts > 5 {
		next.SwitchMaxAttempts = 5
	}
	if next.MaxRetries < 0 {
		next.MaxRetries = 0
	}
	if next.MaxRetries > 5 {
		next.MaxRetries = 5
	}

	rtMu.Lock()
	rtVal = next
	rtMu.Unlock()
}

// provCred is one provider's credentials for model swapping.
type provCred struct {
	Provider string
	BaseURL  string
	APIKey   string
}

// provSnapshot maps model -> credentials plus directory order (GET /api/providers).
type provSnapshot struct {
	creds map[string]provCred
	order []string
}

// fetchProviderSnapshot pulls the live provider catalog (model -> credentials).
func fetchProviderSnapshot() (*provSnapshot, bool) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, coreHTTPBase()+"/api/providers", nil)
	if err != nil {
		return nil, false
	}
	coreAuth(req)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, false
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		io.Copy(io.Discard, io.LimitReader(resp.Body, 4096))
		return nil, false
	}
	var body struct {
		Providers []struct {
			Provider string   `json:"provider"`
			BaseURL  string   `json:"base_url"`
			APIKey   string   `json:"api_key"`
			Models   []string `json:"models"`
			Enabled  bool     `json:"enabled"`
		} `json:"providers"`
	}
	if err := json.NewDecoder(resp.Body).Decode(&body); err != nil {
		return nil, false
	}
	snap := &provSnapshot{creds: make(map[string]provCred)}
	seenOrder := map[string]bool{}
	for _, p := range body.Providers {
		if !p.Enabled || isFakeKey(p.APIKey) || p.BaseURL == "" {
			continue
		}
		cred := provCred{Provider: p.Provider, BaseURL: p.BaseURL, APIKey: p.APIKey}
		for _, m := range p.Models {
			m = strings.TrimSpace(m)
			if m == "" {
				continue
			}
			if _, dup := snap.creds[m]; !dup {
				snap.creds[m] = cred
			}
			if !seenOrder[m] {
				seenOrder[m] = true
				snap.order = append(snap.order, m)
			}
		}
	}
	return snap, len(snap.order) > 0
}

// swapTarget is a candidate model for an auto-switch retry.
type swapTarget struct {
	model string
	cred  provCred
}

// swapTargets lists candidates in preference order: fallback_models first
// (directory order when unset), excluding the current model; falls back to
// the full directory when none of the preferred models have credentials.
func swapTargets(current string, preferred []string, snap *provSnapshot) []swapTarget {
	if snap == nil {
		return nil
	}
	seen := map[string]bool{current: true}
	var out []swapTarget
	add := func(m string) {
		m = strings.TrimSpace(m)
		if m == "" || seen[m] {
			return
		}
		seen[m] = true
		if cred, ok := snap.creds[m]; ok {
			out = append(out, swapTarget{model: m, cred: cred})
		}
	}
	for _, m := range preferred {
		add(m)
	}
	if len(out) == 0 {
		for _, m := range snap.order {
			add(m)
		}
	}
	return out
}
