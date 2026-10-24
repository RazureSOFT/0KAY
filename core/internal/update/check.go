package update

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
)

const (
	ownerUmbrella  = "RazureSOFT"
	repoUmbrella   = "0KAY"
	repoAgent      = "0KAY-agent"
	ownerRazureink = "razureink"
	repoMinecraft  = "0KAY-minecraft"
)

var client = &http.Client{Timeout: 10 * time.Second}

type Release struct {
	TagName     string `json:"tag_name"`
	Name        string `json:"name"`
	Body        string `json:"body"`
	PublishedAt string `json:"published_at"`
	HTMLURL     string `json:"html_url"`
}

func apiBase() string {
	if githubProxy == "" {
		return "https://api.github.com"
	}
	return githubProxy + "/https://api.github.com"
}

func Latest(owner, repo string) (*Release, error) {
	return LatestContext(context.Background(), owner, repo)
}

func LatestContext(ctx context.Context, owner, repo string) (*Release, error) {
	url := fmt.Sprintf("%s/repos/%s/%s/releases/latest", apiBase(), owner, repo)
	release, status, err := getJSONContext[Release](ctx, url)
	if err != nil {
		return nil, err
	}
	switch status {
	case http.StatusOK:
		return release, nil
	case http.StatusNotFound:
		return latestTagContext(ctx, owner, repo)
	default:
		return nil, fmt.Errorf("github releases: HTTP %d", status)
	}
}

func latestTagContext(ctx context.Context, owner, repo string) (*Release, error) {
	url := fmt.Sprintf("%s/repos/%s/%s/tags?per_page=100", apiBase(), owner, repo)
	tags, status, err := getJSONContext[[]struct {
		Name string `json:"name"`
	}](ctx, url)
	if err != nil {
		return nil, err
	}
	if status == http.StatusNotFound {
		return nil, nil
	}
	if status != http.StatusOK {
		return nil, fmt.Errorf("github tags: HTTP %d", status)
	}
	best := ""
	for _, tag := range *tags {
		name := strings.TrimSpace(tag.Name)
		if name == "" {
			continue
		}
		if best == "" || Newer(name, best) {
			best = name
		}
	}
	if best == "" {
		return nil, nil
	}
	return &Release{
		TagName: best,
		HTMLURL: fmt.Sprintf("https://github.com/%s/%s/releases/tag/%s", owner, repo, best),
	}, nil
}

func getJSONContext[T any](ctx context.Context, url string) (*T, int, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, 0, err
	}
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "0kay-core")
	resp, err := client.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		return nil, resp.StatusCode, nil
	}
	var value T
	if err := json.NewDecoder(resp.Body).Decode(&value); err != nil {
		return nil, resp.StatusCode, err
	}
	return &value, resp.StatusCode, nil
}

func Normalize(version string) string {
	return strings.TrimPrefix(strings.TrimSpace(version), "v")
}

func Newer(candidate, current string) bool {
	a, b := Normalize(candidate), Normalize(current)
	a = strings.SplitN(a, "+", 2)[0]
	b = strings.SplitN(b, "+", 2)[0]
	ap, bp := strings.SplitN(a, "-", 2), strings.SplitN(b, "-", 2)
	if n := compareVersions(ap[0], bp[0]); n != 0 {
		return n > 0
	}
	if len(ap) != len(bp) {
		return len(ap) == 1
	}
	if len(ap) == 1 {
		return false
	}
	ax, bx := strings.Split(ap[1], "."), strings.Split(bp[1], ".")
	for i := 0; i < len(ax) && i < len(bx); i++ {
		if ax[i] == bx[i] {
			continue
		}
		x, xe := strconv.Atoi(ax[i])
		y, ye := strconv.Atoi(bx[i])
		if xe == nil && ye == nil {
			return x > y
		}
		if (xe == nil) != (ye == nil) {
			return xe != nil
		}
		return ax[i] > bx[i]
	}
	return len(ax) > len(bx)
}

func compareVersions(a, b string) int {
	left, right := strings.Split(a, "."), strings.Split(b, ".")
	for i := 0; i < len(left) || i < len(right); i++ {
		var x, y int
		if i < len(left) {
			x = numeric(left[i])
		}
		if i < len(right) {
			y = numeric(right[i])
		}
		if x != y {
			if x > y {
				return 1
			}
			return -1
		}
	}
	return 0
}

func numeric(part string) int {
	if dash := strings.IndexByte(part, '-'); dash >= 0 {
		part = part[:dash]
	}
	value, err := strconv.Atoi(part)
	if err != nil {
		return 0
	}
	return value
}

func RepositoryFor(plugin string) (owner, repo string, known bool) {
	switch plugin {
	case "mocr", "life", "webui", "mcp", "core":
		return ownerUmbrella, repoUmbrella, true
	case "agent":
		return ownerUmbrella, repoAgent, true
	case "pm":
		return ownerUmbrella, "0KAY-pm", true
	case "minecraft":
		return ownerRazureink, repoMinecraft, true
	}
	return "", "", false
}

func PlatformRepository() (string, string) { return ownerUmbrella, repoUmbrella }
