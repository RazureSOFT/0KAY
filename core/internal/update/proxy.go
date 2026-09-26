package update

import "strings"

// githubProxy is the global GitHub mirror/reverse-proxy prefix (for example
// "https://gh-proxy.com"). Empty means direct access.
var githubProxy string

// SetGitHubProxy sets the mirror used for every git operation Core performs
// (source updates and 0kay-pm installs/updates). It accepts a bare prefix such
// as "https://gh-proxy.com" or a value that already carries the github.com
// suffix, and normalises the trailing slash. An empty value disables it.
func SetGitHubProxy(proxy string) {
	proxy = strings.TrimSpace(proxy)
	proxy = strings.TrimSuffix(proxy, "https://github.com")
	proxy = strings.TrimSuffix(proxy, "http://github.com")
	githubProxy = strings.TrimRight(proxy, "/")
}

// GitHubProxy returns the configured mirror prefix ("" when disabled).
func GitHubProxy() string { return githubProxy }

// gitProxyEnv rewrites github.com requests through the configured mirror using
// git's environment config (GIT_CONFIG_COUNT/KEY/VALUE). Child processes — such
// as the git invocations inside 0kay-pm — inherit it, so no global git config is
// touched. Returns nil when no mirror is configured.
func gitProxyEnv() [][2]string {
	if githubProxy == "" {
		return nil
	}
	return [][2]string{
		{"GIT_CONFIG_COUNT", "1"},
		{"GIT_CONFIG_KEY_0", "url." + githubProxy + "/https://github.com/.insteadOf"},
		{"GIT_CONFIG_VALUE_0", "https://github.com/"},
	}
}
