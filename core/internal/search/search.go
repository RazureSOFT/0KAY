// Package search is the built-in web search capability. It replaces the former
// standalone SearXNG-compatible plugin: search now runs inside Core (no plugin,
// no extra port) and all engines are reached through Core's own outbound
// client. Agent and L.I.F.E. call GET /api/search.
package search

import (
	"context"
	"fmt"
	"html"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strconv"
	"strings"
	"sync"
	"time"
)

// Result is one search hit.
type Result struct {
	Title   string `json:"title"`
	URL     string `json:"url"`
	Snippet string `json:"snippet"`
	Engine  string `json:"engine"`
}

// Engines lists the supported engine names in default preference order.
var Engines = []string{"cnbing", "bing", "so360", "duckduckgo"}

const (
	userAgent  = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
	maxResults = 50
)

var client = &http.Client{Timeout: 6 * time.Second}

// overallBudget caps how long a single Search may wait across all engines.
const overallBudget = 5 * time.Second

// --- engine circuit breaker: a blocked/slow engine is skipped briefly so it
// does not drag every search down to the deadline. ---
var (
	breakerMu    sync.Mutex
	breakerUntil = map[string]time.Time{}
)

const breakerCooldown = 90 * time.Second

func engineSkipped(name string) bool {
	breakerMu.Lock()
	defer breakerMu.Unlock()
	until, ok := breakerUntil[name]
	return ok && time.Now().Before(until)
}

func markEngineResult(name string, failed bool) {
	breakerMu.Lock()
	defer breakerMu.Unlock()
	if failed {
		breakerUntil[name] = time.Now().Add(breakerCooldown)
	} else {
		delete(breakerUntil, name)
	}
}

// --- short-lived result cache for repeated identical queries. ---
type cacheEntry struct {
	at   time.Time
	rows []Result
}

var (
	cacheMu sync.Mutex
	cache   = map[string]cacheEntry{}
)

const cacheTTL = 90 * time.Second

func cacheKey(preferred string, limit int, query string) string {
	return fmt.Sprintf("%s|%d|%s", preferred, limit, strings.ToLower(query))
}

func cacheGet(key string) ([]Result, bool) {
	cacheMu.Lock()
	defer cacheMu.Unlock()
	entry, ok := cache[key]
	if !ok || time.Since(entry.at) > cacheTTL {
		return nil, false
	}
	return entry.rows, true
}

func cachePut(key string, rows []Result) {
	if len(rows) == 0 {
		return
	}
	cacheMu.Lock()
	defer cacheMu.Unlock()
	if len(cache) > 500 {
		cache = map[string]cacheEntry{}
	}
	cache[key] = cacheEntry{time.Now(), rows}
}

var (
	reTags    = regexp.MustCompile(`(?s)<[^>]+>`)
	reSpaces  = regexp.MustCompile(`[ \t]+`)
	reBlankLn = regexp.MustCompile(`\n{2,}`)

	reDDG      = regexp.MustCompile(`(?is)<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>(.*?)</a>`)
	reDDGSnip  = regexp.MustCompile(`(?is)class="result__snippet"[^>]*>(.*?)</(?:a|td|div)>`)
	reBing     = regexp.MustCompile(`(?is)<h2[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>`)
	reBingSnip = regexp.MustCompile(`(?is)<p[^>]*>(.*?)</p>`)
	re360Item  = regexp.MustCompile(`(?is)<h3[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>`)
	re360URL   = regexp.MustCompile(`(?i)\bdata-mdurl="([^"]+)"`)
	re360Snip  = regexp.MustCompile(`(?is)class="res-desc[^"]*"[^>]*>(.*?)</(?:p|span|div)>`)
)

// Search runs the preferred engine first and returns as soon as it has enough
// results, instead of waiting for every engine. The remaining engines run
// concurrently as fallback, bounded by overallBudget; results are merged,
// de-duplicated by URL and interleaved by engine preference. Engines that fail
// are skipped for a cooldown, and successful queries are cached briefly.
func Search(ctx context.Context, query string, limit int, preferred string) ([]Result, []string) {
	query = strings.TrimSpace(query)
	if query == "" {
		return nil, []string{"empty query"}
	}
	if limit <= 0 || limit > maxResults {
		limit = 10
	}
	preferred = normalizeEngine(preferred)
	if cached, ok := cacheGet(cacheKey(preferred, limit, query)); ok {
		return cached, nil
	}
	order := append([]string{preferred}, excluding(Engines, preferred)...)

	// Drop engines that failed recently, unless that leaves us with none.
	active := make([]string, 0, len(order))
	for _, name := range order {
		if !engineSkipped(name) {
			active = append(active, name)
		}
	}
	if len(active) == 0 {
		active = order
	}

	budget := overallBudget
	if deadline, ok := ctx.Deadline(); ok {
		if remaining := time.Until(deadline); remaining < budget {
			budget = remaining
		}
	}
	if budget <= 0 {
		budget = time.Second
	}
	runCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	type outcome struct {
		name string
		idx  int
		rows []Result
		err  error
	}
	results := make(chan outcome, len(active))
	var wg sync.WaitGroup
	for i, name := range active {
		wg.Add(1)
		go func(i int, name string) {
			defer wg.Done()
			rows, err := runEngine(runCtx, name, query, limit)
			results <- outcome{name: name, idx: i, rows: rows, err: err}
		}(i, name)
	}
	go func() { wg.Wait(); close(results) }()

	terms := queryTerms(query)
	seen := map[string]bool{}
	collected := map[int][]Result{}
	var errs []string
	total := 0
	preferredDone := false
	timer := time.NewTimer(budget)
	defer timer.Stop()

loop:
	for {
		select {
		case <-timer.C:
			break loop
		case out, ok := <-results:
			if !ok {
				break loop
			}
			if out.idx == 0 {
				preferredDone = true
			}
			markEngineResult(out.name, out.err != nil)
			if out.err != nil {
				errs = append(errs, out.name+": "+out.err.Error())
				continue
			}
			for _, r := range out.rows {
				key := strings.TrimRight(strings.ToLower(strings.TrimSpace(r.URL)), "/")
				if key == "" || seen[key] {
					continue
				}
				hay := strings.ToLower(r.Title + " " + r.URL + " " + r.Snippet)
				if !anchorMatch(hay, terms) {
					continue
				}
				seen[key] = true
				collected[out.idx] = append(collected[out.idx], r)
				total++
			}
			// Enough results from the preferred engine (or after it settled) —
			// stop waiting on the rest.
			if preferredDone && total >= limit {
				break loop
			}
		}
	}
	cancel()

	// Interleave engines so one fast source cannot fill every slot.
	out := make([]Result, 0, limit)
	for len(out) < limit {
		progressed := false
		for i := range active {
			rows := collected[i]
			if len(rows) == 0 {
				continue
			}
			out = append(out, rows[0])
			collected[i] = rows[1:]
			progressed = true
			if len(out) >= limit {
				break
			}
		}
		if !progressed {
			break
		}
	}
	cachePut(cacheKey(preferred, limit, query), out)
	return out, errs
}

func normalizeEngine(name string) string {
	name = strings.ToLower(strings.TrimSpace(name))
	for _, e := range Engines {
		if e == name {
			return name
		}
	}
	return "cnbing"
}

func excluding(list []string, skip string) []string {
	out := make([]string, 0, len(list))
	for _, e := range list {
		if e != skip {
			out = append(out, e)
		}
	}
	return out
}

func runEngine(ctx context.Context, name, query string, limit int) ([]Result, error) {
	switch name {
	case "duckduckgo":
		return fetchDuckDuckGo(ctx, query, limit)
	case "so360":
		return fetch360(ctx, query, limit)
	case "bing":
		return fetchBing(ctx, query, limit, false)
	default:
		return fetchBing(ctx, query, limit, true)
	}
}

func get(ctx context.Context, req *http.Request, acceptLang string) (string, error) {
	req = req.WithContext(ctx)
	req.Header.Set("User-Agent", userAgent)
	req.Header.Set("Accept", "text/html,application/json;q=0.9,*/*;q=0.8")
	if acceptLang != "" {
		req.Header.Set("Accept-Language", acceptLang)
	}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(io.LimitReader(resp.Body, 4<<20))
	if err != nil {
		return "", err
	}
	return string(body), nil
}

func fetchBing(ctx context.Context, query string, limit int, cn bool) ([]Result, error) {
	params := url.Values{"q": {query}, "count": {itoa(max(limit, 10))}}
	lang := "en-US,en;q=0.9"
	engine := "bing"
	if cn {
		params.Set("setlang", "zh-Hans")
		params.Set("mkt", "zh-CN")
		params.Set("cc", "CN")
		lang = "zh-CN,zh;q=0.9"
		engine = "cnbing"
	} else {
		params.Set("setlang", "en")
		params.Set("cc", "US")
	}
	req, err := http.NewRequest(http.MethodGet, "https://www.bing.com/search?"+params.Encode(), nil)
	if err != nil {
		return nil, err
	}
	text, err := get(ctx, req, lang)
	if err != nil {
		return nil, err
	}
	out := make([]Result, 0, limit)
	// Each organic result is a <li class="b_algo"> block. Split on the class so
	// nested markup cannot truncate the block before its snippet <p>.
	for _, block := range strings.Split(text, `class="b_algo"`)[1:] {
		m := reBing.FindStringSubmatch(block)
		if m == nil {
			continue
		}
		href := html.UnescapeString(m[1])
		if !strings.HasPrefix(href, "http") || strings.Contains(href, "bing.com") || strings.Contains(href, "microsoft.com") {
			continue
		}
		snippet := ""
		if s := reBingSnip.FindStringSubmatch(block); s != nil {
			snippet = stripTags(s[1])
		}
		out = append(out, Result{Title: stripTags(m[2]), URL: href, Snippet: snippet, Engine: engine})
		if len(out) >= limit {
			break
		}
	}
	return out, nil
}

func fetchDuckDuckGo(ctx context.Context, query string, limit int) ([]Result, error) {
	form := url.Values{"q": {query}}
	req, err := http.NewRequest(http.MethodPost, "https://html.duckduckgo.com/html/", strings.NewReader(form.Encode()))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	text, err := get(ctx, req, "en-US,en;q=0.9")
	if err != nil {
		return nil, err
	}
	links := reDDG.FindAllStringSubmatch(text, -1)
	snips := reDDGSnip.FindAllStringSubmatch(text, -1)
	out := make([]Result, 0, limit)
	for i, m := range links {
		href := html.UnescapeString(m[1])
		if strings.Contains(href, "uddg=") {
			if parsed, err := url.Parse(href); err == nil {
				if target := parsed.Query().Get("uddg"); target != "" {
					if decoded, err := url.QueryUnescape(target); err == nil {
						href = decoded
					}
				}
			}
		}
		snippet := ""
		if i < len(snips) {
			snippet = stripTags(snips[i][1])
		}
		out = append(out, Result{Title: stripTags(m[2]), URL: href, Snippet: snippet, Engine: "duckduckgo"})
		if len(out) >= limit {
			break
		}
	}
	return out, nil
}

func fetch360(ctx context.Context, query string, limit int) ([]Result, error) {
	req, err := http.NewRequest(http.MethodGet, "https://www.so.com/s?"+url.Values{"q": {query}}.Encode(), nil)
	if err != nil {
		return nil, err
	}
	text, err := get(ctx, req, "zh-CN,zh;q=0.9")
	if err != nil {
		return nil, err
	}
	out := make([]Result, 0, limit)
	for _, m := range re360Item.FindAllStringSubmatch(text, -1) {
		href := html.UnescapeString(m[1])
		if u := re360URL.FindStringSubmatch(m[0]); u != nil {
			href = html.UnescapeString(u[1])
		}
		title := stripTags(m[2])
		if title == "" || len(title) < 2 || !strings.HasPrefix(href, "http") {
			continue
		}
		snippet := ""
		if s := re360Snip.FindStringSubmatch(m[0]); s != nil {
			snippet = stripTags(s[1])
		}
		out = append(out, Result{Title: title, URL: href, Snippet: snippet, Engine: "so360"})
		if len(out) >= limit {
			break
		}
	}
	return out, nil
}

func stripTags(value string) string {
	value = reTags.ReplaceAllString(value, " ")
	value = html.UnescapeString(value)
	value = reSpaces.ReplaceAllString(value, " ")
	value = reBlankLn.ReplaceAllString(value, "\n")
	return strings.TrimSpace(value)
}

var stopwords = map[string]bool{
	"a": true, "an": true, "and": true, "are": true, "as": true, "at": true, "be": true, "by": true,
	"for": true, "from": true, "has": true, "have": true, "how": true, "in": true, "is": true, "it": true,
	"its": true, "of": true, "on": true, "or": true, "that": true, "the": true, "their": true, "then": true,
	"there": true, "these": true, "they": true, "this": true, "to": true, "was": true, "we": true, "were": true,
	"what": true, "when": true, "where": true, "which": true, "who": true, "why": true, "will": true, "with": true,
	"you": true, "your": true,
}

var reToken = regexp.MustCompile(`[\p{L}\p{N}]+`)

func queryTerms(query string) []string {
	var terms []string
	seen := map[string]bool{}
	for _, tok := range reToken.FindAllString(strings.ToLower(query), -1) {
		if stopwords[tok] || seen[tok] {
			continue
		}
		seen[tok] = true
		terms = append(terms, tok)
	}
	return terms
}

// anchorMatch keeps a result only if the first meaningful query term appears;
// stopword-only queries pass everything through.
func anchorMatch(haystack string, terms []string) bool {
	if len(terms) == 0 {
		return true
	}
	return strings.Contains(haystack, terms[0])
}

// Score is the number of query terms present (for callers that want ranking).
func Score(text string, query string) int {
	hay := strings.ToLower(text)
	score := 0
	for _, term := range queryTerms(query) {
		if strings.Contains(hay, term) {
			score++
		}
	}
	return score
}

func itoa(n int) string {
	return strconv.Itoa(n)
}

func max(a, b int) int {
	if a > b {
		return a
	}
	return b
}
