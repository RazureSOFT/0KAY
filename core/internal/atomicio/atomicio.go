package atomicio

import (
	"os"
	"path/filepath"
)

// writeFileAtomic writes data to a temp file in the same directory and renames it
// over path, so a crash never leaves a half-written JSON document behind.
//
// The temp name is unique per call rather than a fixed "<path>.tmp". An
// in-process mutex makes a fixed name safe for one writer, but two of these files
// are documented as human-editable (providers.json is the file an operator edits
// to add a provider) and `core_service.go` explicitly contemplates a second Core
// instance pointed at the same CORE_DATA_DIR. Either situation interleaves two
// writers into one temp file and produces a truncated or spliced result.
//
// Same-directory is required: os.Rename is only atomic within a filesystem, and a
// temp file under the OS temp dir could land on a different volume.
//
// Callers are responsible for holding whatever lock protects their store.
func WriteFileAtomic(path string, data []byte, perm os.FileMode) error {
	dir := filepath.Dir(path)
	handle, err := os.CreateTemp(dir, filepath.Base(path)+".tmp-*")
	if err != nil {
		return err
	}
	temporary := handle.Name()
	// Any failure past this point must not leave the scratch file behind.
	defer func() {
		if err != nil {
			os.Remove(temporary)
		}
	}()

	if _, err = handle.Write(data); err != nil {
		handle.Close()
		return err
	}
	// CreateTemp makes 0600; widen to the requested mode explicitly.
	if err = handle.Chmod(perm); err != nil {
		handle.Close()
		return err
	}
	// fsync before rename. Without it the rename can land before the contents do,
	// which on a power loss leaves a correctly-named but empty file.
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
	// Sync the directory so the rename itself is durable.
	if dirHandle, openErr := os.Open(dir); openErr == nil {
		_ = dirHandle.Sync()
		_ = dirHandle.Close()
	}
	return nil
}
