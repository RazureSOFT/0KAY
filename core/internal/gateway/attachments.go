package gateway

import (
	"encoding/json"
)

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
