package gateway

import (
	"net/http"
	"strings"

	"0kay/core/internal/pairing"
	"0kay/core/internal/providers"
)

func (g *Gateway) machineCredential(r *http.Request) bool {
	token := bearerToken(r.Header.Get("Authorization"))
	if token == "" {
		return false
	}
	if name := strings.TrimSpace(r.Header.Get(PluginHeader)); name != "" {
		if g.registry == nil {
			return false
		}
		_, ok := g.registry.Authenticate(name, token)
		return ok
	}
	return pairing.Default != nil && pairing.Default.ValidMachineToken(token)
}

func (g *Gateway) handleProviders(w http.ResponseWriter, r *http.Request) {
	if g.providerStore == nil {
		unavailable(w, "provider store not ready")
		return
	}

	switch r.Method {
	case http.MethodGet:
		writeJSON(w, http.StatusOK, g.providerStore.Snapshot())

	case http.MethodPost, http.MethodPut:
		var body struct {
			Providers         []providers.ProviderConfig `json:"providers"`
			DefaultProviderID string                     `json:"default_provider_id"`
			DefaultModel      string                     `json:"default_model"`
			Provider          *providers.ProviderConfig  `json:"provider"`
		}
		if !decodeBody(w, r, &body, maxSmallBody) {
			return
		}

		if body.Provider != nil {
			if err := g.providerStore.Upsert(*body.Provider); err != nil {
				badRequest(w, err.Error())
				return
			}
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
	if !g.machineCredential(r) {
		writeErr(w, http.StatusForbidden, "machine_credential_required",
			"a plugin identity or machine token is required to read credentials")
		return
	}
	snap := g.providerStore.SnapshotRaw()
	for i := range snap.Providers {
		if eff := snap.Providers[i].EffectiveProvider(); eff != snap.Providers[i].Provider {
			snap.Providers[i].Provider = eff
		}
	}
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

func (g *Gateway) handleProviderDelete(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodDelete) {
		return
	}
	deprecated(w, "/api/providers/{id}")
	g.deleteProvider(w, r.URL.Query().Get("id"))
}

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
