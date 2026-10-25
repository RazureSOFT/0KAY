//go:build windows

package update

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
)

const createNoWindow = 0x08000000

func winQuote(value string) string {
	value = winEnvValue(value)
	return `"` + value + `"`
}

func winEnvValue(value string) string {
	value = strings.ReplaceAll(value, "%", "%%")
	value = strings.ReplaceAll(value, `"`, `""`)
	return strings.NewReplacer("\r", "", "\n", "").Replace(value)
}

func winEnvLines() string {
	var b strings.Builder
	for _, kv := range processProxyEnv() {
		fmt.Fprintf(&b, "set \"%s=%s\"\r\n", kv[0], winEnvValue(kv[1]))
	}
	return b.String()
}

func writeUpdater(dir, pm, pkg, target string) (string, string, error) {
	script := filepath.Join(dir, "update.cmd")
	logPath := filepath.Join(dir, "apply.log")
	body := "@echo off\r\n" + winEnvLines() + fmt.Sprintf(
		"call %s stop %s\r\n"+
			"call %s update %s\r\n"+
			"if errorlevel 1 (echo %s & exit /b 1)\r\n"+
			"call %s start %s\r\n"+
			"if errorlevel 1 (echo %s & exit /b 1)\r\n"+
			"echo %s\r\n",
		winQuote(pm), winQuote(pkg),
		winQuote(pm), winQuote(target), markerFailed,
		winQuote(pm), winQuote(pkg), markerFailed,
		markerDone,
	)
	if err := os.WriteFile(script, []byte(body), 0o644); err != nil {
		return "", "", err
	}
	return script, logPath, nil
}

func writeInstaller(dir, pm, pkg string) (string, string, error) {
	script := filepath.Join(dir, "install.cmd")
	logPath := filepath.Join(dir, "install.log")
	body := "@echo off\r\n" + winEnvLines() + fmt.Sprintf(
		"call %s install %s --no-pair\r\n"+
			"if errorlevel 1 (echo %s & exit /b 1)\r\n"+
			"echo %s\r\n",
		winQuote(pm), winQuote(pkg),
		markerFailed,
		markerDone,
	)
	if err := os.WriteFile(script, []byte(body), 0o644); err != nil {
		return "", "", err
	}
	return script, logPath, nil
}

func writeUninstaller(dir, pm, pkg string) (string, string, error) {
	script := filepath.Join(dir, "uninstall.cmd")
	logPath := filepath.Join(dir, "install.log")
	body := fmt.Sprintf("@echo off\r\n"+
		"call %s uninstall %s\r\n"+
		"if errorlevel 1 (echo %s & exit /b 1)\r\n"+
		"echo %s\r\n",
		winQuote(pm), winQuote(pkg),
		markerFailed,
		markerDone,
	)
	if err := os.WriteFile(script, []byte(body), 0o644); err != nil {
		return "", "", err
	}
	return script, logPath, nil
}

func joinArgsWin(cmd []string) string {
	out := make([]string, 0, len(cmd))
	for i, arg := range cmd {
		if i == 0 {
			out = append(out, strings.TrimPrefix(arg, "./"))
			continue
		}
		out = append(out, winQuote(arg))
	}
	return strings.Join(out, " ")
}

func psQuote(value string) string {
	return "'" + strings.ReplaceAll(value, "'", "''") + "'"
}

func winStartCommand(plan sourcePlan) string {
	command := strings.TrimPrefix(plan.Start[0], "./")
	ps := fmt.Sprintf("Start-Process -FilePath %s", psQuote(command))
	rest := []string{}
	for _, arg := range plan.Start[1:] {
		rest = append(rest, psQuote(arg))
	}
	if len(rest) > 0 {
		ps += " -ArgumentList " + strings.Join(rest, ",")
	}
	ps += fmt.Sprintf(" -WorkingDirectory %s", psQuote(plan.Dir))
	ps += fmt.Sprintf(" -RedirectStandardOutput %s", psQuote(filepath.Join(plan.Dir, "update-run.log")))
	ps += fmt.Sprintf(" -RedirectStandardError %s", psQuote(filepath.Join(plan.Dir, "update-run.err.log")))
	ps += " -WindowStyle Hidden"
	return ps
}

func writeSourceUpdater(dir string, plan sourcePlan) (string, string, error) {
	script := filepath.Join(dir, "source-update.cmd")
	logPath := filepath.Join(dir, "apply.log")
	var b strings.Builder
	b.WriteString("@echo off\r\n")
	b.WriteString("set GIT_TERMINAL_PROMPT=0\r\n")
	b.WriteString("set GIT_HTTP_LOW_SPEED_LIMIT=1000\r\n")
	b.WriteString("set GIT_HTTP_LOW_SPEED_TIME=20\r\n")
	b.WriteString(winEnvLines())
	fmt.Fprintf(&b, "cd /d %s || (echo %s & exit /b 1)\r\n", winQuote(plan.RepoDir), markerFailed)
	b.WriteString("git pull --ff-only\r\n")
	fmt.Fprintf(&b, "if errorlevel 1 (echo %s & exit /b 1)\r\n", markerFailed)
	fmt.Fprintf(&b, "cd /d %s\r\n", winQuote(plan.Dir))
	for key, value := range plan.Env {
		fmt.Fprintf(&b, "set \"%s=%s\"\r\n", key, winEnvValue(value))
	}
	for _, cmd := range plan.Build {
		fmt.Fprintf(&b, "%s\r\n", joinArgsWin(cmd))
		fmt.Fprintf(&b, "if errorlevel 1 (echo %s & exit /b 1)\r\n", markerFailed)
	}
	if plan.Port > 0 {
		// Kill only listeners whose image plausibly belongs to the service this
		// plan restarts; a stray program that grabbed the port must not be shot.
		fmt.Fprintf(&b, "for /f \"tokens=5\" %%%%p in ('netstat -ano ^| findstr :%d ^| findstr LISTENING') do (tasklist /fi \"PID eq %%%%p\" /fo list 2^>nul ^| findstr /i /c:\"%s\" >nul 2>&1 && taskkill /F /PID %%%%p >nul 2>&1)\r\n", plan.Port, startImageBase(plan))
		b.WriteString("ping -n 2 127.0.0.1 >nul\r\n")
	}
	if len(plan.Start) > 0 {
		ps := strings.ReplaceAll(winStartCommand(plan), "%", "%%")
		fmt.Fprintf(&b, "powershell -NoProfile -NonInteractive -WindowStyle Hidden -Command \"%s\"\r\n", ps)
	}
	fmt.Fprintf(&b, "echo %s\r\n", markerDone)
	if err := os.WriteFile(script, []byte(b.String()), 0o644); err != nil {
		return "", "", err
	}
	return script, logPath, nil
}

func launchDetached(script, logPath string) error {
	handle, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o644)
	if err != nil {
		return err
	}
	cmd := exec.Command("cmd", "/c", script)
	cmd.Stdout = handle
	cmd.Stderr = handle
	cmd.SysProcAttr = &syscall.SysProcAttr{CreationFlags: createNoWindow}
	if err := cmd.Start(); err != nil {
		handle.Close()
		return err
	}
	go func() { _ = cmd.Wait(); _ = handle.Close() }()
	return nil
}
