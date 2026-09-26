package gateway

import (
	"net/http"
	"strings"

	"0kay/core/internal/providers"
)

func (g *Gateway) handleProviders(w http.ResponseWriter, r *http.Request) {
	if g.providerStore == nil {
		unavailable(w, "provider store not ready")
		return
	}

	switch r.Method {
	case http.MethodGet:
		// Masked view: never returns plaintext API keys.
		writeJSON(w, http.StatusOK, g.providerStore.Snapshot())

	case http.MethodPost, http.MethodPut:
		var body struct {
			// Full replace when providers array present without single provider
			Providers         []providers.ProviderConfig `json:"providers"`
			DefaultProviderID string                     `json:"default_provider_id"`
			DefaultModel      string                     `json:"default_model"`
			// Single upsert
			Provider *providers.ProviderConfig `json:"provider"`
		}
		if !decodeBody(w, r, &body, maxSmallBody) {
			return
		}

		if body.Provider != nil {
			if err := g.providerStore.Upsert(*body.Provider); err != nil {
				badRequest(w, err.Error())
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
				badRequest(w, err.Error())
				return
			}
		}

		writeJSON(w, http.StatusOK, g.providerStore.Snapshot())

	default:
		allowMethod(w, r, http.MethodGet, http.MethodPost, http.MethodPut)
	}
}

// handleProviderCredentials GET /api/providers/credentials[?id=…]
//
// Deliberate, authenticated escape hatch for in-repo services (life / agent /
// mocr) that must forward a provider key upstream. It is not reachable from a
// cross-site browser context (Sec-Fetch-Site is rejected) and is not part of
// the anonymous/trusted-network surface beyond the normal auth gate.
//
// Without ?id= it returns exactly the legacy plaintext shape of
// GET /api/providers, so migrating a caller is a one-line URL change.
func (g *Gateway) handleProviderCredentials(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	if g.providerStore == nil {
		unavailable(w, "provider store not ready")
		return
	}
	if strings.EqualFold(r.Header.Get("Sec-Fetch-Site"), "cross-site") {
		writeErr(w, http.StatusForbidden, "cross_site_denied", "cross-site credential reads are not allowed")
		return
	}
	snap := g.providerStore.SnapshotRaw()
	id := r.URL.Query().Get("id")
	if id == "" {
		writeJSON(w, http.StatusOK, snap)
		return
	}
	for _, p := range snap.Providers {
		if p.ID == id {
			writeJSON(w, http.StatusOK, p)
			return
		}
	}
	writeErr(w, http.StatusNotFound, "not_found", "provider not found")
}

// handleProviderDelete DELETE /api/providers/delete?id=… (legacy query form).
func (g *Gateway) handleProviderDelete(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodDelete) {
		return
	}
	deprecated(w, "/api/providers/{id}")
	g.deleteProvider(w, r.URL.Query().Get("id"))
}

// handleProviderDeletePath DELETE /api/providers/{id} (REST form).
func (g *Gateway) handleProviderDeletePath(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodDelete) {
		return
	}
	g.deleteProvider(w, r.PathValue("id"))
}

func (g *Gateway) deleteProvider(w http.ResponseWriter, id string) {
	if g.providerStore == nil {
		unavailable(w, "provider store not ready")
		return
	}
	if id == "" {
		badRequest(w, "id is required")
		return
	}
	if err := g.providerStore.Delete(id); err != nil {
		badRequest(w, err.Error())
		return
	}
	writeJSON(w, http.StatusOK, g.providerStore.Snapshot())
}

// handleProviderDefaults sets default provider/model for chat.
func (g *Gateway) handleProviderDefaults(w http.ResponseWriter, r *http.Request) {
	if g.providerStore == nil {
		unavailable(w, "provider store not ready")
		return
	}
	switch r.Method {
	case http.MethodGet:
		snap := g.providerStore.Snapshot()
		writeJSON(w, http.StatusOK, map[string]string{
			"default_provider_id": snap.DefaultProviderID,
			"default_model":       snap.DefaultModel,
		})
	case http.MethodPost, http.MethodPut:
		var body struct {
			DefaultProviderID string `json:"default_provider_id"`
			DefaultModel      string `json:"default_model"`
		}
		if !decodeBody(w, r, &body, maxSmallBody) {
			return
		}
		if err := g.providerStore.SetDefaults(body.DefaultProviderID, body.DefaultModel); err != nil {
			badRequest(w, err.Error())
			return
		}
		writeJSON(w, http.StatusOK, map[string]string{
			"default_provider_id": body.DefaultProviderID,
			"default_model":       body.DefaultModel,
		})
	default:
		allowMethod(w, r, http.MethodGet, http.MethodPost, http.MethodPut)
	}
}
