// Package tray puts 0kay-core in the notification area.
//
// Core is meant to run in the background: the WebUI talks to it over HTTP and
// nothing on screen says it is there. Without an icon the only way to stop it is
// Task Manager, and the only way to open the UI is remembering a URL.
//
// The tray is optional and must never be the reason Core fails to start: every
// entry point here reports an error the caller may ignore, and nothing blocks.
package tray

import (
	"context"
	"fmt"
	"os/exec"
	"runtime"
	"sync"

	"github.com/getlantern/systray"
)

// Actions the menu can trigger. Supplied by the caller so this package stays
// ignorant of the gateway and the browser.
type Actions struct {
	// OpenUI opens the WebUI in the default browser.
	OpenUI func() error
	// Quit stops Core cleanly.
	Quit func()
	// Status returns a short line for the tooltip, e.g. the listen address.
	Status func() string
}

type runner struct {
	actions Actions
	done    chan struct{}
	once    sync.Once
}

var current *runner

// Run starts the tray icon and blocks until it is removed.
//
// Call it from a goroutine: systray owns the main thread's message loop on
// Windows, and Core's HTTP server has to keep serving while it does.
func Run(actions Actions) error {
	// The message loop wants the OS thread that created the windows.
	runtime.LockOSThread()
	defer runtime.UnlockOSThread()

	r := &runner{actions: actions, done: make(chan struct{})}
	current = r
	systray.Run(r.onReady, r.onExit)
	return nil
}

// Stop removes the icon and lets Run return. Safe to call before Run.
func Stop() {
	if current == nil {
		return
	}
	current.once.Do(func() {
		systray.Quit()
		close(current.done)
	})
}

func (r *runner) onReady() {
	systray.SetTitle("0KAY")
	systray.SetTooltip(tooltip(r.actions))
	icon, err := iconBytes()
	if err == nil {
		systray.SetIcon(icon)
	}

	open := systray.AddMenuItem("打开 0KAY", "在浏览器里打开界面")
	status := systray.AddMenuItem("状态", "")
	status.Disable()
	systray.AddSeparator()
	quit := systray.AddMenuItem("退出", "停止 0kay-core")

	if text := statusText(r.actions); text != "" {
		status.SetTitle(text)
	}

	go func() {
		for {
			select {
			case <-open.ClickedCh:
				if r.actions.OpenUI != nil {
					_ = r.actions.OpenUI()
				}
			case <-status.ClickedCh:
				if text := statusText(r.actions); text != "" {
					status.SetTitle(text)
				}
			case <-quit.ClickedCh:
				if r.actions.Quit != nil {
					r.actions.Quit()
				} else {
					Stop()
				}
				return
			case <-r.done:
				return
			}
		}
	}()
}

func (r *runner) onExit() {
	r.once.Do(func() { close(r.done) })
}

func tooltip(actions Actions) string {
	base := "0kay-core"
	if actions.Status == nil {
		return base
	}
	if text := actions.Status(); text != "" {
		return base + " · " + text
	}
	return base
}

func statusText(actions Actions) string {
	if actions.Status == nil {
		return ""
	}
	if text := actions.Status(); text != "" {
		return "监听 " + text
	}
	return ""
}

// openBrowser is exported for callers that want the same behaviour outside the
// tray (the "打开界面" menu item and the --open flag share it).
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

// WaitForShutdown is a convenience for callers that want a blocking wait.
func WaitForShutdown(ctx context.Context) {
	select {
	case <-ctx.Done():
		Stop()
	}
}
