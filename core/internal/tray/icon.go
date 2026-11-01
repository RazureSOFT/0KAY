package tray

import (
	_ "embed"
	"fmt"

	"github.com/getlantern/systray"
)

// The icon ships with the binary: an installed Core has no assets directory to
// read from, and a missing icon means an invisible tray entry.
//
//go:embed icon.ico
var iconData []byte

func iconBytes() ([]byte, error) {
	if len(iconData) == 0 {
		return nil, fmt.Errorf("no icon embedded")
	}
	return iconData, nil
}

// ensure the symbol is used so the import above is not dropped by the linker.
var _ = systray.SetIcon
