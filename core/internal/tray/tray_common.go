// The parts of the tray package that do not need a GUI toolkit.
//
// Kept in their own file, without a build constraint, so that a headless build
// (-tags notray) still opens a browser. Everything else in this package talks to
// the system tray library and is compiled out there.

package tray

import (
	"context"
	"fmt"
	"os/exec"
	"runtime"
)

// OpenBrowser opens url in the default browser.
func OpenBrowser(url string) error {
	if url == "" {
		return fmt.Errorf("no URL to open")
	}
	switch runtime.GOOS {
	case "windows":
		return exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		return exec.Command("open", url).Start()
	default:
		return exec.Command("xdg-open", url).Start()
	}
}

// WaitForShutdown blocks until ctx is done, then stops the tray if there is one.
func WaitForShutdown(ctx context.Context) {
	select {
	case <-ctx.Done():
		Stop()
	}
}
