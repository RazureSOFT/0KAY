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
		// The credentials live in the experiments section (that is where the
		// panel renders them); the agent section is kept as a fallback for
		// values set before that section existed.
		values := g.settingsStore.GetValues("experiments")
		if len(values) == 0 {
			values = g.settingsStore.GetValues("agent")
		}
		// A type assertion, not fmt.Sprint: a missing key formats as "<nil>",
		// which is a non-empty string and would make "not configured" look
		// configured.
		if clientID == "" {
			if value, ok := values["github_oauth_client_id"].(string); ok {
				clientID = strings.TrimSpace(value)
			}
		}
		if clientSecret == "" {
			if value, ok := values["github_oauth_client_secret"].(string); ok {
				clientSecret = strings.TrimSpace(value)
			}
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
	// A GitHub App takes its permissions from the app definition and rejects a
	// scope parameter; an OAuth App needs one. Empty means "do not send it".
	scope := "repo"
	if g.settingsStore != nil {
		if value, ok := g.settingsStore.GetValues("experiments")["github_oauth_scope"].(string); ok {
			scope = strings.TrimSpace(value)
		}
	}
	if scope != "" {
		query.Set("scope", scope)
	}
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

// ---- App manifest flow ----------------------------------------------------
//
// Creating an OAuth App has no API: it is a form on github.com that only a
// logged-in browser can submit. The manifest flow is the closest thing to
// automation GitHub offers: the browser is sent to GitHub with a manifest, the
// user clicks Create once, and GitHub redirects back with a one-time code that
// converts into client_id and client_secret. Those two land in the agent
// settings, and the normal OAuth flow can then run unattended.

const (
	githubManifestURL     = "https://github.com/settings/apps/new"
	githubManifestConvert = "https://api.github.com/app-manifests/%s/conversions"
)

// coreBaseURL is the address GitHub will redirect back to. It has to be the
// address the browser used, not a hard-coded one: the flow runs on localhost in
// development and behind a name in a deployment.
func coreBaseURL(r *http.Request) string {
	if value := strings.TrimSpace(os.Getenv("CORE_PUBLIC_URL")); value != "" {
		return strings.TrimRight(value, "/")
	}
	host := strings.TrimSpace(r.Host)
	if host == "" {
		host = "127.0.0.1:8080"
	}
	return "http://" + host
}

func (g *Gateway) handleGitHubManifest(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	base := coreBaseURL(r)
	state, err := newOAuthState()
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "oauth_state_failed", err.Error())
		return
	}
	oauthStatesMu.Lock()
	oauthStates[state] = oauthStateEntry{created: time.Now()}
	oauthStatesMu.Unlock()

	manifest := map[string]any{
		"name":                     "0KAY",
		"url":                      base,
		"redirect_url":             base + "/api/oauth/github/manifest/callback",
		"callback_urls":            []string{base + "/api/oauth/github/callback"},
		"request_oauth_on_install": true,
		"public":                   false,
		"default_permissions": map[string]string{
			"metadata":      "read",
			"contents":      "write",
			"issues":        "write",
			"pull_requests": "write",
		},
		"default_events": []string{},
	}
	encoded, err := json.Marshal(manifest)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "manifest_failed", err.Error())
		return
	}
	action := githubManifestURL + "?state=" + url.QueryEscape(state)
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	fmt.Fprintf(w, `<!doctype html><meta charset="utf-8"><title>0KAY · GitHub App</title>
<style>body{font:14px/1.6 system-ui,sans-serif;margin:12vh auto;max-width:560px;padding:0 20px;color:#1f2328}p{color:#57606a}</style>
<h1>正在前往 GitHub…</h1><p>如果没有自动跳转，点下面的按钮。</p>
<form id="manifest" method="post" action="%s">
  <input type="hidden" name="manifest" value="%s">
  <button type="submit">Create GitHub App</button>
</form>
<script>document.getElementById('manifest').submit()</script>`,
		htmlEscape(action), htmlEscape(string(encoded)))
}

func (g *Gateway) handleGitHubManifestCallback(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	code := r.URL.Query().Get("code")
	state := r.URL.Query().Get("state")
	if code == "" {
		oauthPage(w, http.StatusBadRequest, "GitHub 没有返回 code", "请重新点击「自动创建 GitHub App」。")
		return
	}
	oauthStatesMu.Lock()
	entry, known := oauthStates[state]
	delete(oauthStates, state)
	oauthStatesMu.Unlock()
	if !known || time.Since(entry.created) > oauthStateTTL {
		oauthPage(w, http.StatusBadRequest, "创建流程已过期", "请重新点击「自动创建 GitHub App」。")
		return
	}

	clientID, clientSecret, err := convertManifest(r, code)
	if err != nil {
		oauthPage(w, http.StatusBadGateway, "创建失败", err.Error())
		return
	}
	if g.settingsStore != nil {
		if err := g.settingsStore.SetValues("agent", map[string]interface{}{
			"github_oauth_client_id":     clientID,
			"github_oauth_client_secret": clientSecret,
		}); err != nil {
			oauthPage(w, http.StatusInternalServerError, "保存失败", err.Error())
			return
		}
	}
	oauthPage(w, http.StatusOK, "GitHub App 已创建", "client id 和 secret 已保存，回到设置页点「用 GitHub 登录」即可。")
}

// convertManifest trades the one-time code for the app's credentials.
func convertManifest(r *http.Request, code string) (string, string, error) {
	endpoint := fmt.Sprintf(githubManifestConvert, url.PathEscape(code))
	request, err := http.NewRequestWithContext(r.Context(), http.MethodPost, endpoint, nil)
	if err != nil {
		return "", "", err
	}
	request.Header.Set("Accept", "application/vnd.github+json")
	request.Header.Set("X-GitHub-Api-Version", "2022-11-28")
	client := &http.Client{Timeout: 20 * time.Second, Transport: netguard.Transport(netguard.Strict())}
	response, err := client.Do(request)
	if err != nil {
		return "", "", err
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusCreated {
		return "", "", fmt.Errorf("github answered %d; the code is single-use and expires in an hour", response.StatusCode)
	}
	var payload struct {
		ClientID     string `json:"client_id"`
		ClientSecret string `json:"client_secret"`
	}
	if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
		return "", "", fmt.Errorf("unreadable response: %w", err)
	}
	if payload.ClientID == "" || payload.ClientSecret == "" {
		return "", "", fmt.Errorf("github returned no client credentials")
	}
	return payload.ClientID, payload.ClientSecret, nil
}

// htmlEscape is the small subset of escaping the manifest page needs.
func htmlEscape(value string) string {
	replacer := strings.NewReplacer(
		"&", "&amp;",
		"<", "&lt;",
		">", "&gt;",
		`"`, "&quot;",
		"'", "&#39;",
	)
	return replacer.Replace(value)
}

// ---- who is signed in -----------------------------------------------------
//
// The token alone says nothing to a person looking at the panel: "connected"
// without a name is indistinguishable from "connected as someone else". This
// asks GitHub who the token belongs to and returns the avatar and display name.

func fetchGitHubUser(r *http.Request, token string) (login, name, avatar string, err error) {
	request, err := http.NewRequestWithContext(r.Context(), http.MethodGet, "https://api.github.com/user", nil)
	if err != nil {
		return "", "", "", err
	}
	request.Header.Set("Authorization", "Bearer "+token)
	request.Header.Set("Accept", "application/vnd.github+json")
	request.Header.Set("User-Agent", "0kay-agent")
	client := &http.Client{Timeout: 15 * time.Second, Transport: netguard.Transport(netguard.Strict())}
	response, err := client.Do(request)
	if err != nil {
		return "", "", "", err
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return "", "", "", fmt.Errorf("github answered %d", response.StatusCode)
	}
	var payload struct {
		Login     string `json:"login"`
		Name      string `json:"name"`
		AvatarURL string `json:"avatar_url"`
	}
	if err := json.NewDecoder(response.Body).Decode(&payload); err != nil {
		return "", "", "", err
	}
	return payload.Login, payload.Name, payload.AvatarURL, nil
}

func (g *Gateway) handleGitHubProfile(w http.ResponseWriter, r *http.Request) {
	if !allowMethod(w, r, http.MethodGet) {
		return
	}
	if g.settingsStore == nil {
		unavailable(w, "settings store not ready")
		return
	}
	token := ""
	if value, ok := g.settingsStore.GetValues("experiments")["github_token"].(string); ok {
		token = strings.TrimSpace(value)
	}
	if token == "" {
		writeJSON(w, http.StatusOK, map[string]any{"connected": false})
		return
	}
	login, name, avatar, err := fetchGitHubUser(r, token)
	if err != nil {
		// The token can be stale or revoked; say so without failing the panel.
		writeJSON(w, http.StatusOK, map[string]any{"connected": false, "error": err.Error()})
		return
	}
	writeJSON(w, http.StatusOK, map[string]any{
		"connected":  true,
		"login":      login,
		"name":       name,
		"avatar_url": avatar,
	})
}
