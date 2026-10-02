package gateway

import (
	"bytes"
	"encoding/json"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestCubismVersionsAndDelete(t *testing.T) {
	root := t.TempDir()
	t.Setenv("LIVE2D_DIR", root)
	for _, name := range []string{"old/old.model.json", "new/new.model3.json"} {
		target := filepath.Join(root, filepath.FromSlash(name))
		os.MkdirAll(filepath.Dir(target), 0700)
		os.WriteFile(target, []byte(`{}`), 0600)
	}
	models := listLive2DModels()
	if len(models) != 2 {
		t.Fatalf("models=%v", models)
	}
	if err := deleteLive2DModel("../escape"); err == nil {
		t.Fatal("path escape accepted")
	}
	if err := deleteLive2DModel("old/old"); err != nil {
		t.Fatal(err)
	}
	if len(listLive2DModels()) != 1 {
		t.Fatal("delete failed")
	}
}
func TestLive2DResourcesMustExist(t *testing.T) {
	root := t.TempDir()
	manifest := filepath.Join(root, "model.model.json")
	os.WriteFile(manifest, []byte(`{"model":"model.moc","textures":["texture.png"]}`), 0600)
	if validateLive2DManifest(manifest) == nil {
		t.Fatal("missing resources accepted")
	}
	os.WriteFile(filepath.Join(root, "model.moc"), []byte("test"), 0600)
	os.WriteFile(filepath.Join(root, "texture.png"), []byte("test"), 0600)
	if err := validateLive2DManifest(manifest); err != nil {
		t.Fatal(err)
	}
}

// live2dUploadRequest builds a multipart POST like the browser folder picker:
// file parts with basename filenames plus a paths field of webkitRelativePath
// values aligned by index.
func live2dUploadRequest(t *testing.T, paths []string, contents map[string][]byte) *http.Request {
	t.Helper()
	var buf bytes.Buffer
	writer := multipart.NewWriter(&buf)
	for _, p := range paths {
		part, err := writer.CreateFormFile("files", filepath.Base(p))
		if err != nil {
			t.Fatalf("create form file: %v", err)
		}
		if _, err := part.Write(contents[p]); err != nil {
			t.Fatalf("write part: %v", err)
		}
	}
	if err := writer.WriteField("paths", string(mustJSON(t, paths))); err != nil {
		t.Fatalf("write paths field: %v", err)
	}
	if err := writer.Close(); err != nil {
		t.Fatalf("close writer: %v", err)
	}
	req := httptest.NewRequest(http.MethodPost, "/api/live2d", &buf)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	return req
}

func mustJSON(t *testing.T, v interface{}) []byte {
	t.Helper()
	data, err := json.Marshal(v)
	if err != nil {
		t.Fatal(err)
	}
	return data
}

// Model folders often keep stale manifests whose referenced resources were
// renamed away; the upload must still succeed when any uploaded manifest is
// fully self-consistent.
func TestHandleLive2DUploadPicksValidManifest(t *testing.T) {
	t.Setenv("LIVE2D_DIR", t.TempDir())
	g := &Gateway{}
	folder := "阿洛娜4.6"
	staleManifest := `{"Version":3,"FileReferences":{"Moc":"missing.moc3","Textures":["missing.png"]}}`
	goodManifest := `{"Version":3,"FileReferences":{"Moc":"model.moc3","Textures":["textures/tex.png"]}}`
	paths := []string{
		folder + "/stale.model3.json",
		folder + "/good.model3.json",
		folder + "/model.moc3",
		folder + "/textures/tex.png",
		folder + "/expressions/happy.exp3.json",
	}
	contents := map[string][]byte{
		paths[0]: []byte(staleManifest),
		paths[1]: []byte(goodManifest),
		paths[2]: []byte("moc3-bytes"),
		paths[3]: []byte("png-bytes"),
		paths[4]: []byte("{}"),
	}

	w := httptest.NewRecorder()
	g.handleLive2D(w, live2dUploadRequest(t, paths, contents))
	if w.Code != http.StatusOK {
		t.Fatalf("upload: %d %s", w.Code, w.Body.String())
	}
	var body struct {
		ModelURL string `json:"model_url"`
	}
	if err := json.Unmarshal(w.Body.Bytes(), &body); err != nil {
		t.Fatal(err)
	}
	if !strings.HasSuffix(body.ModelURL, "/good.model3.json") {
		t.Fatalf("model_url=%q, want the valid manifest", body.ModelURL)
	}
	if _, err := os.Stat(filepath.Join(live2DRoot(), folder, "model.moc3")); err != nil {
		t.Fatalf("uploaded files missing: %v", err)
	}
}

func TestHandleLive2DUploadRejectsWhenNoManifestIsValid(t *testing.T) {
	t.Setenv("LIVE2D_DIR", t.TempDir())
	g := &Gateway{}
	folder := "阿洛娜4.6"
	staleManifest := `{"Version":3,"FileReferences":{"Moc":"missing.moc3","Textures":["missing.png"]}}`
	paths := []string{
		folder + "/stale.model3.json",
		folder + "/model.moc3",
	}
	contents := map[string][]byte{
		paths[0]: []byte(staleManifest),
		paths[1]: []byte("moc3-bytes"),
	}

	w := httptest.NewRecorder()
	g.handleLive2D(w, live2dUploadRequest(t, paths, contents))
	if w.Code != http.StatusBadRequest {
		t.Fatalf("upload: %d %s", w.Code, w.Body.String())
	}
	if !strings.Contains(w.Body.String(), "stale.model3.json") || !strings.Contains(w.Body.String(), "missing.moc3") {
		t.Fatalf("error should name the manifest and the missing resource: %s", w.Body.String())
	}
	if _, err := os.Stat(filepath.Join(live2DRoot(), folder)); !os.IsNotExist(err) {
		t.Fatalf("rejected upload should be cleaned up, err=%v", err)
	}
}
