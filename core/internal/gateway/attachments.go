package gateway

import (
	"encoding/json"
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

const (
	attachmentMarkerStart = "<attachments>"
	attachmentMarkerEnd   = "</attachments>"
)

// attachmentPrompt wraps the attachment references in a machine-parseable
// marker. LIFE reads it, fetches each file from Core and folds the real content
// (text inline, images via the vision model) into the model context, then
// strips the marker from the visible message.
func attachmentPrompt(attachments []Attachment) string {
	if len(attachments) == 0 {
		return ""
	}
	encoded, err := json.Marshal(attachments)
	if err != nil {
		return ""
	}
	return "\n\n" + attachmentMarkerStart + string(encoded) + attachmentMarkerEnd
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
