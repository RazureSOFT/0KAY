package providers

import (
	"errors"
	"fmt"
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var providerStatusRe = regexp.MustCompile(`provider error (\d{3})`)

// UpstreamError is a non-2xx upstream response. It carries the HTTP status and
// the provider's Retry-After so the retry loop can classify it structurally
// instead of parsing the message (the compatibility path used to format it as
// "upstream HTTP %d", which the status regex never matched, so 429/5xx from
// that path were silently unretryable).
type UpstreamError struct {
	Status     int
	RetryAfter time.Duration
	Body       string
}

func (e *UpstreamError) Error() string {
	return fmt.Sprintf("provider error %d: %s", e.Status, e.Body)
}

// newUpstreamError builds an UpstreamError from a failed response, parsing the
// Retry-After header when the provider sent one (integer seconds; HTTP-date is
// not worth the parsing for our retry horizon).
func newUpstreamError(resp *http.Response, body []byte) *UpstreamError {
	up := &UpstreamError{Status: resp.StatusCode, Body: string(body)}
	if raw := strings.TrimSpace(resp.Header.Get("Retry-After")); raw != "" {
		if seconds, err := strconv.Atoi(raw); err == nil && seconds > 0 {
			up.RetryAfter = time.Duration(seconds) * time.Second
		}
	}
	return up
}

// RetryAfter returns the provider-requested delay carried by the error, if any.
// It unwraps so wrapped UpstreamErrors still surface their delay.
func RetryAfter(err error) time.Duration {
	var up *UpstreamError
	if errors.As(err, &up) {
		return up.RetryAfter
	}
	return 0
}

// retryableStatus classifies an HTTP status code as transient (429/5xx and
// the retryable 4xx conflict-family codes).
func retryableStatus(code int) bool {
	switch {
	case code == 408, code == 409, code == 425, code == 429:
		return true
	case code >= 500 && code <= 599:
		return true
	default:
		return false
	}
}

// IsRetryable reports whether a Generate error is transient and worth retrying
// against the same model (429/5xx and network/timeout failures). Typed
// *UpstreamError values are classified by status code; the regex over the
// message remains as a fallback for plain fmt.Errorf errors.
func IsRetryable(err error) bool {
	if err == nil {
		return false
	}
	var up *UpstreamError
	if errors.As(err, &up) {
		return retryableStatus(up.Status)
	}
	msg := err.Error()
	if match := providerStatusRe.FindStringSubmatch(msg); match != nil {
		if code, convErr := strconv.Atoi(match[1]); convErr == nil {
			return retryableStatus(code)
		}
	}
	low := strings.ToLower(msg)
	for _, needle := range []string{
		"timeout", "timed out", "i/o timeout", "connection reset", "connection refused",
		"reset by peer", "broken pipe", "unexpected eof", "temporarily unavailable",
		"server misbehaving", "no such host", "tls handshake timeout",
		"closed network connection",
	} {
		if strings.Contains(low, needle) {
			return true
		}
	}
	return false
}
