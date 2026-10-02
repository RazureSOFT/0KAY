package search

import (
	"context"
	"encoding/json"
	"net/http"
	"net/url"
	"strings"
)

// ApiDocs searches API documentation across MDN, Microsoft Learn and Stack
// Overflow, then falls back to a documentation-domain-filtered web search when
// those are thin. Separate from general web search on purpose.
func ApiDocs(ctx context.Context, query string, limit int) ([]Result, []string) {
	query = strings.TrimSpace(query)
	if query == "" {
		return nil, []string{"empty query"}
	}
	if limit <= 0 || limit > maxResults {
		limit = 8
	}
	out, errs := runSources(ctx, query, limit, []source{
		{"mdn", fetchMDN},
		{"mslearn", fetchMSLearn},
		{"stackoverflow", fetchStackOverflow},
	})
	if len(out) < limit {
		web, _ := Search(ctx, query+" API documentation", limit-len(out), "cnbing")
		for _, r := range web {
			if isDocDomain(r.URL) {
				out = append(out, r)
			}
		}
	}
	if out == nil {
		out = []Result{}
	}
	return out, errs
}

func fetchMDN(ctx context.Context, query string, limit int) ([]Result, error) {
	params := url.Values{"q": {query}, "locale": {"en-US"}}
	req, err := http.NewRequest(http.MethodGet, "https://developer.mozilla.org/api/v1/search?"+params.Encode(), nil)
	if err != nil {
		return nil, err
	}
	body, err := get(ctx, req, "en-US,en;q=0.9")
	if err != nil {
		return nil, err
	}
	var payload struct {
		Documents []struct {
			Title   string `json:"title"`
			MDNURL  string `json:"mdn_url"`
			Summary string `json:"summary"`
		} `json:"documents"`
	}
	if err := json.Unmarshal([]byte(body), &payload); err != nil {
		return nil, err
	}
	out := make([]Result, 0, limit)
	for _, doc := range payload.Documents {
		href := strings.TrimSpace(doc.MDNURL)
		if href == "" {
			continue
		}
		if strings.HasPrefix(href, "/") {
			href = "https://developer.mozilla.org" + href
		}
		out = append(out, Result{Title: stripTags(doc.Title), URL: href, Snippet: stripTags(doc.Summary), Engine: "mdn"})
		if len(out) >= limit {
			break
		}
	}
	return out, nil
}

func fetchMSLearn(ctx context.Context, query string, limit int) ([]Result, error) {
	params := url.Values{"search": {query}, "locale": {"en-us"}}
	req, err := http.NewRequest(http.MethodGet, "https://learn.microsoft.com/api/search?"+params.Encode(), nil)
	if err != nil {
		return nil, err
	}
	body, err := get(ctx, req, "en-US,en;q=0.9")
	if err != nil {
		return nil, err
	}
	var payload struct {
		Results []struct {
			Title       string `json:"title"`
			URL         string `json:"url"`
			Description string `json:"description"`
		} `json:"results"`
	}
	if err := json.Unmarshal([]byte(body), &payload); err != nil {
		return nil, err
	}
	out := make([]Result, 0, limit)
	for _, item := range payload.Results {
		if strings.TrimSpace(item.URL) == "" {
			continue
		}
		out = append(out, Result{Title: stripTags(item.Title), URL: item.URL, Snippet: stripTags(item.Description), Engine: "mslearn"})
		if len(out) >= limit {
			break
		}
	}
	return out, nil
}

func fetchStackOverflow(ctx context.Context, query string, limit int) ([]Result, error) {
	params := url.Values{
		"order":    {"desc"},
		"sort":     {"relevance"},
		"q":        {query},
		"site":     {"stackoverflow"},
		"pagesize": {itoa(limit)},
		"filter":   {"withbody"},
	}
	req, err := http.NewRequest(http.MethodGet, "https://api.stackexchange.com/2.3/search/advanced?"+params.Encode(), nil)
	if err != nil {
		return nil, err
	}
	body, err := get(ctx, req, "en-US,en;q=0.9")
	if err != nil {
		return nil, err
	}
	var payload struct {
		Items []struct {
			Title string `json:"title"`
			Link  string `json:"link"`
			Body  string `json:"body"`
		} `json:"items"`
	}
	if err := json.Unmarshal([]byte(body), &payload); err != nil {
		return nil, err
	}
	out := make([]Result, 0, limit)
	for _, item := range payload.Items {
		if strings.TrimSpace(item.Link) == "" {
			continue
		}
		snippet := stripTags(item.Body)
		if len(snippet) > 320 {
			snippet = snippet[:320] + "…"
		}
		out = append(out, Result{Title: stripTags(item.Title), URL: item.Link, Snippet: snippet, Engine: "stackoverflow"})
		if len(out) >= limit {
			break
		}
	}
	return out, nil
}

var docDomains = []string{
	"developer.mozilla.org", "docs.python.org", "pypi.org", "nodejs.org", "npmjs.com",
	"docs.rs", "pkg.go.dev", "golang.org", "rust-lang.org", "learn.microsoft.com",
	"react.dev", "vuejs.org", "devdocs.io", "stackoverflow.com", "cppreference.com",
	"man7.org", "kubernetes.io", "postgresql.org", "redis.io", "developer.android.com",
	"docs.aws.amazon.com", "spring.io", "docs.oracle.com", "docs.docker.com", "git-scm.com",
	"developer.apple.com", "ruby-doc.org", "php.net", "www.php.net", "readthedocs.io",
	"doc.rust-lang.org", "python.readthedocs.io", "django.readthedocs.io", "fastapi.tiangolo.com",
	"docs.djangoproject.com", "flask.palletsprojects.com", "numpy.org", "pandas.pydata.org",
	"matplotlib.org", "pytorch.org", "tensorflow.org", "scikit-learn.org",
}

func isDocDomain(rawURL string) bool {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return false
	}
	host := strings.ToLower(parsed.Host)
	for _, domain := range docDomains {
		if host == domain || strings.HasSuffix(host, "."+domain) {
			return true
		}
	}
	return false
}
