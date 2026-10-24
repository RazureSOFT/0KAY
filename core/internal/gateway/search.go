package gateway

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"0kay/core/internal/search"
)

func (g *Gateway) handleSearch(w http.ResponseWriter, r *http.Request) {
	var query, engine string
	limit := 10
	switch r.Method {
	case http.MethodGet:
		params := r.URL.Query()
		query = strings.TrimSpace(params.Get("q"))
		if query == "" {
			query = strings.TrimSpace(params.Get("query"))
		}
		engine = strings.TrimSpace(params.Get("engine"))
		if raw := params.Get("n"); raw != "" {
			if parsed, err := strconv.Atoi(raw); err == nil {
				limit = parsed
			}
		}
	case http.MethodPost:
		var body struct {
			Query  string `json:"query"`
			Q      string `json:"q"`
			Engine string `json:"engine"`
			N      int    `json:"n"`
		}
		if !decodeBody(w, r, &body, maxSmallBody) {
			return
		}
		query = strings.TrimSpace(body.Query)
		if query == "" {
			query = strings.TrimSpace(body.Q)
		}
		engine = strings.TrimSpace(body.Engine)
		if body.N > 0 {
			limit = body.N
		}
	default:
		allowMethod(w, r, http.MethodGet, http.MethodPost)
		return
	}
	if query == "" {
		badRequest(w, "query is required")
		return
	}
	if engine == "" && g.settingsStore != nil {
		if value, ok := g.settingsStore.GetValues("search")["engine"].(string); ok {
			engine = strings.TrimSpace(value)
		}
	}

	ctx, cancel := context.WithTimeout(r.Context(), 8*time.Second)
	defer cancel()
	results, errs := search.Search(ctx, query, limit, engine)
	if results == nil {
		results = []search.Result{}
	}
	if errs == nil {
		errs = []string{}
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"query":   query,
		"engine":  engine,
		"results": results,
		"errors":  errs,
	})
}

type searchFunc func(context.Context, string, int) ([]search.Result, []string)

func (g *Gateway) handleSpecializedSearch(w http.ResponseWriter, r *http.Request, run searchFunc) {
	var query string
	limit := 8
	switch r.Method {
	case http.MethodGet:
		params := r.URL.Query()
		query = strings.TrimSpace(params.Get("q"))
		if query == "" {
			query = strings.TrimSpace(params.Get("query"))
		}
		if raw := params.Get("n"); raw != "" {
			if parsed, err := strconv.Atoi(raw); err == nil {
				limit = parsed
			}
		}
	case http.MethodPost:
		var body struct {
			Query string `json:"query"`
			Q     string `json:"q"`
			N     int    `json:"n"`
		}
		if !decodeBody(w, r, &body, maxSmallBody) {
			return
		}
		query = strings.TrimSpace(body.Query)
		if query == "" {
			query = strings.TrimSpace(body.Q)
		}
		if body.N > 0 {
			limit = body.N
		}
	default:
		allowMethod(w, r, http.MethodGet, http.MethodPost)
		return
	}
	if query == "" {
		badRequest(w, "query is required")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 8*time.Second)
	defer cancel()
	results, errs := run(ctx, query, limit)
	if results == nil {
		results = []search.Result{}
	}
	if errs == nil {
		errs = []string{}
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"query":   query,
		"results": results,
		"errors":  errs,
	})
}

func (g *Gateway) handlePapersSearch(w http.ResponseWriter, r *http.Request) {
	g.handleSpecializedSearch(w, r, search.Papers)
}

func (g *Gateway) handleApiDocsSearch(w http.ResponseWriter, r *http.Request) {
	g.handleSpecializedSearch(w, r, search.ApiDocs)
}
