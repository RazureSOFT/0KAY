package gateway

import (
	"os"
	"path/filepath"
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
