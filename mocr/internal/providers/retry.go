package providers

import (
	"regexp"
	"strconv"
	"strings"
)

// The status code reaches us in two shapes: the Anthropic/OpenAI SDK-style
// path wraps it as "provider error <code>", while the OpenAI-compatible request
// path (compatibility.go) returns "upstream HTTP <code>". Both must be
// recognised, or max_retries silently does nothing for the compatible path.
var providerStatusRe = regexp.MustCompile(`(?:provider error|upstream HTTP) (\d{3})`)

// IsRetryable reports whether a Generate error is transient and worth retrying
// against the same model (429/5xx and network/timeout failures).
func IsRetryable(err error) bool {
	if err == nil {
		return false
	}
	msg := err.Error()
	if match := providerStatusRe.FindStringSubmatch(msg); match != nil {
		if code, convErr := strconv.Atoi(match[1]); convErr == nil {
			switch {
			case code == 408, code == 409, code == 425, code == 429:
				return true
			case code >= 500 && code <= 599:
				return true
			default:
				return false
			}
		}
	}
	low := strings.ToLower(msg)
	for _, needle := range []string{
		"timeout", "timed out", "i/o timeout", "connection reset", "connection refused",
		"reset by peer", "broken pipe", "unexpected eof", "temporarily unavailable",
		"server misbehaving", "no such host", "tls handshake timeout",
	} {
		if strings.Contains(low, needle) {
			return true
		}
	}
	return false
}
