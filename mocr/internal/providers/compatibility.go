package providers

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"
	"sync"
	"time"
)

var unsupportedPattern = regexp.MustCompile(`(?i)(?:unsupported parameter|unrecognized request argument|unknown parameter)\s*:?\s*['"` + "`" + `]?([a-z_]+)`)
var compatibilityCache = struct {
	sync.Mutex
	entries map[string]map[string]time.Time
}{entries: map[string]map[string]time.Time{}}

// Only retry explicit parameter-validation failures before a response stream
// starts. Never drop messages, tools, tool choice, or reasoning controls.
func optionalRejectedField(data []byte) string {
	var payload struct {
		Error struct {
			Message string `json:"message"`
			Param   string `json:"param"`
			Code    string `json:"code"`
		} `json:"error"`
	}
	if json.Unmarshal(data, &payload) != nil {
		return ""
	}
	message := strings.ToLower(payload.Error.Message)
	field := payload.Error.Param
	match := unsupportedPattern.FindStringSubmatch(payload.Error.Message)
	if len(match) > 1 {
		field = match[1]
	}
	if field == "" || !(strings.Contains(message, "not supported") || strings.Contains(message, "unsupported") || strings.Contains(message, "unrecognized") || strings.Contains(message, "unknown parameter")) {
		return ""
	}
	switch field {
	case "temperature", "top_p", "frequency_penalty", "presence_penalty", "stream_options":
		return field
	}
	return ""
}

func compatibleRequest(ctx context.Context, client *http.Client, url, key, model string, body map[string]interface{}) (*http.Response, error) {
	cacheKey := url + "\x00" + model
	compatibilityCache.Lock()
	for field, expires := range compatibilityCache.entries[cacheKey] {
		if time.Now().Before(expires) {
			delete(body, field)
		}
	}
	compatibilityCache.Unlock()
	for attempt := 0; attempt < 6; attempt++ {
		raw, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		request, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(raw))
		if err != nil {
			return nil, err
		}
		request.Header.Set("Content-Type", "application/json")
		request.Header.Set("Authorization", "Bearer "+key)
		response, err := client.Do(request)
		if err != nil {
			return nil, err
		}
		if response.StatusCode >= 200 && response.StatusCode < 300 {
			return response, nil
		}
		data, readErr := io.ReadAll(io.LimitReader(response.Body, 16384))
		response.Body.Close()
		if readErr != nil {
			return nil, readErr
		}
		field := optionalRejectedField(data)
		_, present := body[field]
		if (response.StatusCode == 400 || response.StatusCode == 422) && field != "" && present && attempt < 5 {
			log.Printf("compatibility: dropping optional field %q for model %q after HTTP %d", field, model, response.StatusCode)
			delete(body, field)
			compatibilityCache.Lock()
			if len(compatibilityCache.entries) >= 512 {
				compatibilityCache.entries = map[string]map[string]time.Time{}
			}
			if compatibilityCache.entries[cacheKey] == nil {
				compatibilityCache.entries[cacheKey] = map[string]time.Time{}
			}
			compatibilityCache.entries[cacheKey][field] = time.Now().Add(time.Hour)
			compatibilityCache.Unlock()
			continue
		}
		return nil, fmt.Errorf("upstream HTTP %d: %s", response.StatusCode, string(data))
	}
	return nil, fmt.Errorf("parameter compatibility attempts exhausted")
}
