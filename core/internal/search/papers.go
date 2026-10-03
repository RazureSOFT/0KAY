package search

import (
	"context"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"net/http"
	"net/url"
	"strings"
)

// Papers searches academic literature. arXiv is preferred (fast, open), with
// Crossref and OpenAlex as fallback/coverage. Results carry authors, year and
// venue in the snippet so the model can cite them.
func Papers(ctx context.Context, query string, limit int) ([]Result, []string) {
	query = strings.TrimSpace(query)
	if query == "" {
		return nil, []string{"empty query"}
	}
	if limit <= 0 || limit > maxResults {
		limit = 8
	}
	return runSources(ctx, query, limit, []source{
		{"arxiv", fetchArXiv},
		{"crossref", fetchCrossref},
		{"openalex", fetchOpenAlex},
	})
}

func fetchArXiv(ctx context.Context, query string, limit int) ([]Result, error) {
	params := url.Values{
		"search_query": {"all:" + query},
		"start":        {"0"},
		"max_results":  {itoa(limit)},
		"sortBy":       {"relevance"},
	}
	req, err := http.NewRequest(http.MethodGet, "https://export.arxiv.org/api/query?"+params.Encode(), nil)
	if err != nil {
		return nil, err
	}
	body, err := get(ctx, req, "en-US,en;q=0.9")
	if err != nil {
		return nil, err
	}
	var feed struct {
		Entries []struct {
			ID        string `xml:"id"`
			Title     string `xml:"title"`
			Summary   string `xml:"summary"`
			Published string `xml:"published"`
			Authors   []struct {
				Name string `xml:"name"`
			} `xml:"author"`
			Links []struct {
				Href string `xml:"href,attr"`
				Rel  string `xml:"rel,attr"`
			} `xml:"link"`
		} `xml:"entry"`
	}
	if err := xml.Unmarshal([]byte(body), &feed); err != nil {
		return nil, err
	}
	out := make([]Result, 0, limit)
	for _, e := range feed.Entries {
		href := strings.TrimSpace(e.ID)
		for _, l := range e.Links {
			if l.Rel == "alternate" && l.Href != "" {
				href = l.Href
				break
			}
		}
		authors := make([]string, 0, len(e.Authors))
		for _, a := range e.Authors {
			authors = append(authors, strings.TrimSpace(a.Name))
		}
		year := ""
		if len(e.Published) >= 4 {
			year = e.Published[:4]
		}
		out = append(out, Result{
			Title:   stripTags(e.Title),
			URL:     href,
			Snippet: paperSnippet(authors, year, "", e.Summary),
			Engine:  "arxiv",
		})
		if len(out) >= limit {
			break
		}
	}
	return out, nil
}

func fetchCrossref(ctx context.Context, query string, limit int) ([]Result, error) {
	params := url.Values{"query": {query}, "rows": {itoa(limit)}, "select": {"title,DOI,URL,abstract,container-title,author,issued,published-print,type"}}
	req, err := http.NewRequest(http.MethodGet, "https://api.crossref.org/works?"+params.Encode(), nil)
	if err != nil {
		return nil, err
	}
	body, err := get(ctx, req, "en-US,en;q=0.9")
	if err != nil {
		return nil, err
	}
	var payload struct {
		Message struct {
			Items []struct {
				Title          []string `json:"title"`
				DOI            string   `json:"DOI"`
				URL            string   `json:"URL"`
				Abstract       string   `json:"abstract"`
				ContainerTitle []string `json:"container-title"`
				Author         []struct {
					Given  string `json:"given"`
					Family string `json:"family"`
				} `json:"author"`
				Issued struct {
					DateParts [][]int `json:"date-parts"`
				} `json:"issued"`
				PublishedPrint struct {
					DateParts [][]int `json:"date-parts"`
				} `json:"published-print"`
			} `json:"items"`
		} `json:"message"`
	}
	if err := json.Unmarshal([]byte(body), &payload); err != nil {
		return nil, err
	}
	out := make([]Result, 0, limit)
	for _, item := range payload.Message.Items {
		title := first(item.Title)
		if title == "" {
			continue
		}
		href := item.URL
		if href == "" && item.DOI != "" {
			href = "https://doi.org/" + item.DOI
		}
		authors := make([]string, 0, len(item.Author))
		for _, a := range item.Author {
			name := strings.TrimSpace(strings.TrimSpace(a.Given) + " " + strings.TrimSpace(a.Family))
			if name != "" {
				authors = append(authors, name)
			}
		}
		year := ""
		if y := yearFromParts(item.Issued.DateParts); y != "" {
			year = y
		} else {
			year = yearFromParts(item.PublishedPrint.DateParts)
		}
		out = append(out, Result{
			Title:   stripTags(title),
			URL:     href,
			Snippet: paperSnippet(authors, year, first(item.ContainerTitle), stripTags(item.Abstract)),
			Engine:  "crossref",
		})
		if len(out) >= limit {
			break
		}
	}
	return out, nil
}

func fetchOpenAlex(ctx context.Context, query string, limit int) ([]Result, error) {
	params := url.Values{"search": {query}, "per-page": {itoa(limit)}}
	req, err := http.NewRequest(http.MethodGet, "https://api.openalex.org/works?"+params.Encode(), nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("User-Agent", userAgent)
	if u := req.URL.Query(); u.Get("mailto") == "" {
		u.Set("mailto", "agent@0kay.local")
		req.URL.RawQuery = u.Encode()
	}
	body, err := get(ctx, req, "en-US,en;q=0.9")
	if err != nil {
		return nil, err
	}
	var payload struct {
		Results []struct {
			Title       string `json:"title"`
			DOI         string `json:"doi"`
			Publication int    `json:"publication_year"`
			Authorships []struct {
				Author struct {
					DisplayName string `json:"display_name"`
				} `json:"author"`
			} `json:"authorships"`
			PrimaryLocation struct {
				LandingPageURL string `json:"landing_page_url"`
			} `json:"primary_location"`
			AbstractIndex map[string][]int `json:"abstract_inverted_index"`
		} `json:"results"`
	}
	if err := json.Unmarshal([]byte(body), &payload); err != nil {
		return nil, err
	}
	out := make([]Result, 0, limit)
	for _, item := range payload.Results {
		if strings.TrimSpace(item.Title) == "" {
			continue
		}
		href := item.PrimaryLocation.LandingPageURL
		if href == "" && item.DOI != "" {
			href = item.DOI
		}
		authors := make([]string, 0, len(item.Authorships))
		for _, a := range item.Authorships {
			if name := strings.TrimSpace(a.Author.DisplayName); name != "" {
				authors = append(authors, name)
			}
		}
		year := ""
		if item.Publication > 0 {
			year = fmt.Sprintf("%d", item.Publication)
		}
		out = append(out, Result{
			Title:   stripTags(item.Title),
			URL:     href,
			Snippet: paperSnippet(authors, year, "", invertedAbstract(item.AbstractIndex)),
			Engine:  "openalex",
		})
		if len(out) >= limit {
			break
		}
	}
	return out, nil
}

// invertedAbstract rebuilds OpenAlex's abstract_inverted_index into text.
func invertedAbstract(index map[string][]int) string {
	if len(index) == 0 {
		return ""
	}
	positions := map[int]string{}
	max := 0
	for word, slots := range index {
		for _, p := range slots {
			positions[p] = word
			if p > max {
				max = p
			}
		}
	}
	parts := make([]string, 0, max+1)
	for i := 0; i <= max; i++ {
		if w, ok := positions[i]; ok {
			parts = append(parts, w)
		}
	}
	return strings.Join(parts, " ")
}

func paperSnippet(authors []string, year, venue, abstract string) string {
	meta := ""
	if len(authors) > 0 {
		if len(authors) > 3 {
			meta = strings.Join(authors[:3], ", ") + " et al."
		} else {
			meta = strings.Join(authors, ", ")
		}
	}
	if year != "" {
		if meta != "" {
			meta += " "
		}
		meta += "(" + year + ")"
	}
	if venue != "" {
		if meta != "" {
			meta += " · "
		}
		meta += venue
	}
	body := stripTags(abstract)
	if len(body) > 320 {
		body = body[:320] + "…"
	}
	switch {
	case meta != "" && body != "":
		return meta + " — " + body
	case meta != "":
		return meta
	default:
		return body
	}
}

func first(list []string) string {
	if len(list) == 0 {
		return ""
	}
	return strings.TrimSpace(list[0])
}

func yearFromParts(parts [][]int) string {
	if len(parts) == 0 || len(parts[0]) == 0 {
		return ""
	}
	return fmt.Sprintf("%d", parts[0][0])
}
