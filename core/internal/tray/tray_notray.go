//go:build notray

// The tray, compiled out.
//
// The real implementation depends on a system tray library that needs GTK and
// AppIndicator headers at build time. That is reasonable on a desktop and not
// reasonable everywhere the code is built: a Linux CI runner, a slim container,
// a headless server. Without this file the only way to build those is to install
// a GUI toolkit they will never show.
//
// So the tray is behind `notray`. Build with `-tags notray` and this file stands
// in: the same API, no window, no cgo. Core runs exactly as it does with an
// icon; it just cannot be reached by clicking it, which on a headless box was
// never possible anyway.

package tray

import "fmt"

type Actions struct {
	OpenUI func() error
	Quit   func()
	Status func() string
}

// Run reports that no tray exists. Callers already treat the tray as optional,
// which is what makes this safe to return an error from.
func Run(actions Actions) error {
	return fmt.Errorf("tray support is not built into this binary (built with -tags notray)")
}

// Stop is a no-op: there is nothing to shut down.
func Stop() {}
