package atomicio

import (
	"os"
	"path/filepath"
)

func WriteFileAtomic(path string, data []byte, perm os.FileMode) error {
	dir := filepath.Dir(path)
	handle, err := os.CreateTemp(dir, filepath.Base(path)+".tmp-*")
	if err != nil {
		return err
	}
	temporary := handle.Name()
	defer func() {
		if err != nil {
			os.Remove(temporary)
		}
	}()

	if _, err = handle.Write(data); err != nil {
		handle.Close()
		return err
	}
	if err = handle.Chmod(perm); err != nil {
		handle.Close()
		return err
	}
	if err = handle.Sync(); err != nil {
		handle.Close()
		return err
	}
	if err = handle.Close(); err != nil {
		return err
	}
	if err = os.Rename(temporary, path); err != nil {
		return err
	}
	if dirHandle, openErr := os.Open(dir); openErr == nil {
		_ = dirHandle.Sync()
		_ = dirHandle.Close()
	}
	return nil
}
