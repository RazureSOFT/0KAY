package gateway

// GitHub OAuth, so a token does not have to be pasted by hand.
//
// The flow is the standard authorization-code one: /start redirects to GitHub
// with a state value, GitHub sends the browser back to /callback with a code,
// and Core exchanges that code for a token and stores it where the agent reads
// its settings. The client id and secret come from the environment or from the
// agent settings; without both, /start says so instead of sending the user to a
// page that will fail.

import (
	"crypto/rand"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"

	"0kay/core/internal/netguard"
)

const (
	githubAuthorizeURL = "https://github.com/login/oauth/authorize"
	githubTokenURL     = "https://github.com/login/oauth/access_token"
	oauthStateTTL      = 10 * time.Minute
)

type oauthStateEntry struct {
	created time.Time
}

var (
	oauthStatesMu sync.Mutex
	oauthStates   = map[string]oauthStateEntry{}
)

func newOAuthState() (string, error) {
	buf := make([]byte, 24)
	if _, err := rand.Read(buf); err != nil {
		return "", err
	}
	return fmt.Sprintf("%x", buf), nil
}

// githubOAuthConfig resolves the client credentials and the callback URL.
// Environment wins over settings so a deployment can be configured without the
// UI, and the settings path is what the panel writes.
func (g *Gateway) githubOAuthConfig() (clientID, clientSecret, redirect string, ok bool) {
	clientID = strings.TrimSpace(os.Getenv("GITHUB_OAUTH_CLIENT_ID"))
	clientSecret = strings.TrimSpace(os.Getenv("GITHUB_OAUTH_CLIENT_SECRET"))
	if g.settingsStore != nil {
		values := g.settingsStore.GetValues("agent")
		if clientID == "" {
			clientID = strings.TrimSpace(fmt.Sprint(values["github_oauth_client_id"]))
		}
		if clientSecret == "" {
			clientSecret = strings.TrimSpace(fmt.Sprint(values["github_oauth_client_secret"]))
		}
	}
	redirect = strings.TrimSpace(os.Getenv("GITHUB_OAUTH_REDIRECT"))
	if redirect == "" {
		redirect = "http://127.0.0.1:8080/api/oauth/github/callback"
	}
	return clientID, clientSecret, redirect, clientID != "" && clientSecret != ""
}

func (g *Gateway) handleGitHubOAuthStart(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	clientID, _, redirect, ok := g.githubOAuthConfig()
	if !ok {
		writeErr(w, http.StatusBadRequest, "oauth_not_configured",
			"set GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET, or fill them in the agent settings")
		return
	}
	state, err := newOAuthState()
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "oauth_state_failed", err.Error())
		return
	}
	oauthStatesMu.Lock()
	// Drop anything that would have expired anyway; this map only ever holds a
	// handful of entries.
	for key, entry := range oauthStates {
		if time.Since(entry.created) > oauthStateTTL {
			delete(oauthStates, key)
		}
	}
	oauthStates[state] = oauthStateEntry{created: time.Now()}
	oauthStatesMu.Unlock()

	query := url.Values{}
	query.Set("client_id", clientID)
	query.Set("redirect_uri", redirect)
	query.Set("scope", "repo")
	query.Set("state", state)
	http.Redirect(w, r, githubAuthorizeURL+"?"+query.Encode(), http.StatusFound)
}

func (g *Gateway) handleGitHubOAuthCallback(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	state := r.URL.Query().Get("state")
	code := r.URL.Query().Get("code")
	if state == "" || code == "" {
		oauthPage(w, http.StatusBadRequest, "GitHub 没有返回授权码", "请重新点击「用 GitHub 登录」。")
		return
	}
	oauthStatesMu.Lock()
	entry, known := oauthStates[state]
	delete(oauthStates, state)
	oauthStatesMu.Unlock()
	if !known || time.Since(entry.created) > oauthStateTTL {
		oauthPage(w, http.StatusBadRequest, "授权已过期", "请重新点击「用 GitHub 登录」。")
		return
	}
	_, clientSecret, redirect, ok := g.githubOAuthConfig()
	if !ok {
		oauthPage(w, http.StatusBadRequest, "OAuth 未配置", "缺少 client id 或 secret。")
		return
	}
	clientID, _, _, _ := g.githubOAuthConfig()
	token, err := exchangeGitHubCode(r, clientID, code, redirect, clientSecret)
	if err != nil {
		oauthPage(w, http.StatusBadGateway, "换取 token 失败", err.Error())
		return
	}
	if g.settingsStore != nil {
		if err := g.settingsStore.SetValues("agent", map[string]interface{}{"github_token": token}); err != nil {
			oauthPage(w, http.StatusInternalServerError, "保存 token 失败", err.Error())
			return
		}
	}
	oauthPage(w, http.StatusOK, "已连接 GitHub", "token 已保存，可以关闭这个窗口回到设置页。")
}

// exchangeGitHubCode trades the code for an access token. GitHub answers with
// JSON when asked for it, which is why the Accept header matters here.
func exchangeGitHubCode(r *http.Request, clientID, code, redirect, clientSecret string) (string, error) {
	if clientID == "" {
		return "", fmt.Errorf("oauth client id is not configured")
	}
	form := url.Values{}
	form.Set("client_id", clientID)
	form.Set("client_secret", clientSecret)
	form.Set("code", code)
	form.Set("redirect_uri", redirect)

	request, err := http.NewRequestWithContext(r.Context(), http.MethodPost, githubTokenURL, strings.NewReader(form.Encode()))
	if err != nil {
		return "", err
	}
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	request.Header.Set("Accept", "application/json")
	client := &http.Client{Timeout: 20 * time.Second, Transport: netguard.Transport(netguard.Strict())}
	response, err := client.Do(request)
	if err != nil {
		return "", err
	}
	defer response.Body.Close()
	var payload struct {
		AccessToken string `json:"access_token"`
		Error       string `json:"error"`
		Description string `json:"error_description"`
	}
	if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
		return "", fmt.Errorf("github answered %d with an unreadable body", response.StatusCode)
	}
	if payload.Error != "" {
		return "", fmt.Errorf("%s: %s", payload.Error, payload.Description)
	}
	if payload.AccessToken == "" {
		return "", fmt.Errorf("github returned no access_token")
	}
	return payload.AccessToken, nil
}

// oauthPage renders a small page for the browser tab the flow opened. It is
// deliberately not part of the SPA: the user is meant to close it.
func oauthPage(w http.ResponseWriter, status int, title, detail string) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.WriteHeader(status)
	fmt.Fprintf(w, `<!doctype html><meta charset="utf-8"><title>%s</title>
<style>body{font:14px/1.6 system-ui,sans-serif;margin:12vh auto;max-width:520px;padding:0 20px;color:#1f2328}
h1{font-size:18px;margin:0 0 8px}p{color:#57606a}</style>
<h1>%s</h1><p>%s</p>`, title, title, detail)
}
