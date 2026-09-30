package gateway

import (
	"encoding/json"
	"strings"
)

// Attachment is an uploaded-file reference handed from a client to an agent
// task or a LIFE turn. The bytes are uploaded separately through POST
// /api/files; only this lightweight reference travels with the message.
type Attachment struct {
	Name string `json:"name"`
	URL  string `json:"url"`
	Mime string `json:"mime"`
	Size int64  `json:"size"`
}

func (a Attachment) label() string {
	name := strings.TrimSpace(a.Name)
	if name == "" {
		name = "file"
	}
	parts := []string{name}
	if a.URL != "" {
		parts = append(parts, a.URL)
	}
	if a.Mime != "" {
		parts = append(parts, a.Mime)
	}
	return "[" + strings.Join(parts, " | ") + "]"
}

// attachmentPrompt renders attachments so text-only models can still refer to
// them. Uploaded files live on the Core host and are addressable by URL.
func attachmentPrompt(attachments []Attachment) string {
	if len(attachments) == 0 {
		return ""
	}
	lines := make([]string, 0, len(attachments))
	for _, a := range attachments {
		lines = append(lines, a.label())
	}
	return "\n\nAttachments (uploaded to Core; fetch with the webfetch tool by URL):\n" + strings.Join(lines, "\n")
}

// encodeAttachments serializes references for the agent metadata passthrough.
// It returns "" when there is nothing to send or the payload is malformed.
func encodeAttachments(attachments []Attachment) string {
	if len(attachments) == 0 {
		return ""
	}
	encoded, err := json.Marshal(attachments)
	if err != nil {
		return ""
	}
	return string(encoded)
}
