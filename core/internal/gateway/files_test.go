package gateway

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func uploadRequest(t *testing.T, field, filename, body string) *http.Request {
	t.Helper()
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	part, err := writer.CreateFormFile(field, filename)
	if err != nil {
		t.Fatalf("create form file: %v", err)
	}
	if _, err := part.Write([]byte(body)); err != nil {
		t.Fatalf("write part: %v", err)
	}
	if err := writer.Close(); err != nil {
		t.Fatalf("close writer: %v", err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/files", &buf)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	return req
}

func TestHandleFilesRoundTrip(t *testing.T) {
	t.Setenv("UPLOAD_FILE_DIR", t.TempDir())
	g := &Gateway{}

	w := httptest.NewRecorder()
	g.handleFiles(w, uploadRequest(t, "file", "notes.txt", "hello attachment"))
	if w.Code != http.StatusOK {
		t.Fatalf("upload: %d %s", w.Code, w.Body.String())
	}
	var uploaded struct {
		File string `json:"file"`
		URL  string `json:"url"`
		Name string `json:"name"`
		Size int64  `json:"size"`
		Mime string `json:"mime"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &uploaded); err != nil {
		t.Fatalf("decode: %v", err)
	}
	if uploaded.Name != "notes.txt" || uploaded.Size != int64(len("hello attachment")) {
		t.Fatalf("unexpected metadata: %+v", uploaded)
	}
	if !strings.HasPrefix(uploaded.File, "file_") || !strings.HasSuffix(uploaded.File, ".txt") {
		t.Fatalf("unexpected generated name: %q", uploaded.File)
	}
	if !strings.HasPrefix(uploaded.URL, "/api/files?file=") {
		t.Fatalf("unexpected url: %q", uploaded.URL)
	}

	w = httptest.NewRecorder()
	g.handleFiles(w, httptest.NewRequest(http.MethodGet, uploaded.URL, nil))
	if w.Code != http.StatusOK || w.Body.String() != "hello attachment" {
		t.Fatalf("read back: %d %q", w.Code, w.Body.String())
	}
}

func TestHandleFilesRejectsTraversal(t *testing.T) {
	t.Setenv("UPLOAD_FILE_DIR", t.TempDir())
	g := &Gateway{}
	for _, name := range []string{"../secret", "file_1/../../x", "notes.txt", "file_1.exe.sh"} {
		w := httptest.NewRecorder()
		g.handleFiles(w, httptest.NewRequest(http.MethodGet, "/api/files?file="+name, nil))
		if w.Code != http.StatusBadRequest {
			t.Fatalf("GET ?file=%s: expected 400, got %d", name, w.Code)
		}
	}
}

func TestHandleFilesMethodNotAllowed(t *testing.T) {
	g := &Gateway{}
	w := httptest.NewRecorder()
	g.handleFiles(w, httptest.NewRequest(http.MethodPut, "/api/files", nil))
	if w.Code != http.StatusMethodNotAllowed || w.Header().Get("Allow") == "" {
		t.Fatalf("PUT /api/files: %d allow=%q", w.Code, w.Header().Get("Allow"))
	}
}

func TestAttachmentsPassthrough(t *testing.T) {
	refs := []Attachment{{Name: "a.txt", URL: "/api/files?file=file_1.txt", Mime: "text/plain", Size: 12}}
	encoded := encodeAttachments(refs)
	if !strings.Contains(encoded, "file_1.txt") {
		t.Fatalf("encodeAttachments lost the url: %s", encoded)
	}
	if encodeAttachments(nil) != "" {
		t.Fatal("nil attachments must encode to empty string")
	}
	prompt := attachmentPrompt(refs)
	if !strings.Contains(prompt, attachmentMarkerStart) || !strings.Contains(prompt, attachmentMarkerEnd) {
		t.Fatalf("attachmentPrompt missing marker: %q", prompt)
	}
	if !strings.Contains(prompt, `"name":"a.txt"`) || !strings.Contains(prompt, `"url":"/api/files?file=file_1.txt"`) {
		t.Fatalf("attachmentPrompt missing reference: %q", prompt)
	}
	if attachmentPrompt(nil) != "" {
		t.Fatal("nil attachments must produce no prompt text")
	}
}
