package gateway

import (
	"encoding/json"
	"net/http"

	"0kay/core/internal/providers"
)

func (g *Gateway) handleProviders(w http.ResponseWriter, r *http.Request) {
	if g.providerStore == nil {
		http.Error(w, "provider store not ready", http.StatusServiceUnavailable)
		return
	}

	switch r.Method {
	case http.MethodGet:
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(g.providerStore.Snapshot())

	case http.MethodPost, http.MethodPut:
		var body struct {
			// Full replace when providers array present without single provider
			Providers         []providers.ProviderConfig `json:"providers"`
			DefaultProviderID string                     `json:"default_provider_id"`
			DefaultModel      string                     `json:"default_model"`
			// Single upsert
			Provider *providers.ProviderConfig `json:"provider"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}

		if body.Provider != nil {
			if err := g.providerStore.Upsert(*body.Provider); err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
			// optional default update in same call
			if body.DefaultProviderID != "" || body.DefaultModel != "" {
				cur := g.providerStore.Snapshot()
				dp := cur.DefaultProviderID
				dm := cur.DefaultModel
				if body.DefaultProviderID != "" {
					dp = body.DefaultProviderID
				}
				if body.DefaultModel != "" {
					dm = body.DefaultModel
				}
				_ = g.providerStore.SetDefaults(dp, dm)
			}
		} else {
			f := providers.File{
				DefaultProviderID: body.DefaultProviderID,
				DefaultModel:      body.DefaultModel,
				Providers:         body.Providers,
			}
			if err := g.providerStore.Replace(f); err != nil {
				http.Error(w, err.Error(), http.StatusBadRequest)
				return
			}
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(g.providerStore.Snapshot())

	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (g *Gateway) handleProviderDelete(w http.ResponseWriter, r *http.Request) {
	if g.providerStore == nil {
		http.Error(w, "provider store not ready", http.StatusServiceUnavailable)
		return
	}
	if r.Method != http.MethodDelete {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "id is required", http.StatusBadRequest)
		return
	}
	if err := g.providerStore.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(g.providerStore.Snapshot())
}

// handleProviderDefaults sets default provider/model for chat.
func (g *Gateway) handleProviderDefaults(w http.ResponseWriter, r *http.Request) {
	if g.providerStore == nil {
		http.Error(w, "provider store not ready", http.StatusServiceUnavailable)
		return
	}
	switch r.Method {
	case http.MethodGet:
		snap := g.providerStore.Snapshot()
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"default_provider_id": snap.DefaultProviderID,
			"default_model":      snap.DefaultModel,
		})
	case http.MethodPost, http.MethodPut:
		var body struct {
			DefaultProviderID string `json:"default_provider_id"`
			DefaultModel      string `json:"default_model"`
		}
		if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}
		if err := g.providerStore.SetDefaults(body.DefaultProviderID, body.DefaultModel); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"default_provider_id": body.DefaultProviderID,
			"default_model":      body.DefaultModel,
		})
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}
