//go:build windows

package main

import (
	"os/exec"
	"strconv"
	"syscall"
)

const (
	createNewProcessGroup = 0x00000200
	detachedProcess       = 0x00000008
	hideWindow            = 0x08000000
	processQueryLimited   = 0x1000
)

func configureDetached(cmd *exec.Cmd) {
	cmd.SysProcAttr = &syscall.SysProcAttr{
		CreationFlags: detachedProcess | createNewProcessGroup | hideWindow,
		HideWindow:    true,
	}
}

// Children get their own process group so a Ctrl+C in the supervisor's
// terminal does not race the orderly shutdown, and stopProcessTree can take
// the whole tree down with taskkill /T.
func configureChild(cmd *exec.Cmd) {
	cmd.SysProcAttr = &syscall.SysProcAttr{
		CreationFlags: createNewProcessGroup | hideWindow,
		HideWindow:    true,
	}
}

func stopProcessTree(pid int) {
	if pid <= 0 {
		return
	}
	_ = exec.Command("taskkill", "/PID", strconv.Itoa(pid), "/T", "/F").Run()
}

func probeAlive(pid int) bool {
	handle, err := syscall.OpenProcess(processQueryLimited, false, uint32(pid))
	if err != nil {
		return false
	}
	_ = syscall.CloseHandle(handle)
	return true
}
