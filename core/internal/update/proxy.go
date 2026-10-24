package update

import (
	"log"
	"strings"
)

var githubProxy string

func SetGitHubProxy(proxy string) {
	proxy = strings.TrimSpace(proxy)
	proxy = strings.TrimSuffix(proxy, "https://github.com")
	proxy = strings.TrimSuffix(proxy, "http://github.com")
	proxy = strings.TrimRight(proxy, "/")
	if strings.ContainsAny(proxy, "\"'` \t\r\n") {
		log.Printf("ignoring invalid GitHub proxy value")
		githubProxy = ""
		return
	}
	githubProxy = proxy
}

func GitHubProxy() string { return githubProxy }

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

func pmProxyEnv() [][2]string {
	if githubProxy == "" {
		return nil
	}
	return [][2]string{{"OKAY_GITHUB_PROXY", githubProxy}}
}

func processProxyEnv() [][2]string {
	return append(gitProxyEnv(), pmProxyEnv()...)
}
