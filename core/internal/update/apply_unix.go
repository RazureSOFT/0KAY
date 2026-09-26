//go:build !windows

package update

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"syscall"
)

func shQuote(value string) string {
	return "'" + strings.ReplaceAll(value, "'", `'\''`) + "'"
}

// shEnvLines renders the git mirror environment for a shell script (empty when
// no mirror is configured).
func shEnvLines() string {
	var b strings.Builder
	for _, kv := range gitProxyEnv() {
		fmt.Fprintf(&b, "export %s=%s\n", kv[0], shQuote(kv[1]))
	}
	return b.String()
}

// writeUpdater writes the shell script that stops, updates and starts a
// component, then prints a status marker for State() to read.
func writeUpdater(dir, pm, pkg, target string) (string, string, error) {
	script := filepath.Join(dir, "update.sh")
	logPath := filepath.Join(dir, "apply.log")
	body := fmt.Sprintf(`#!/bin/sh
%s%s stop %s
%s update %s
code=$?
if [ $code -eq 0 ]; then
  %s start %s
  code=$?
fi
if [ $code -eq 0 ]; then echo %s; else echo %s; fi
exit $code
`,
		shEnvLines(),
		shQuote(pm), shQuote(pkg),
		shQuote(pm), shQuote(target),
		shQuote(pm), shQuote(pkg),
		markerDone, markerFailed,
	)
	if err := os.WriteFile(script, []byte(body), 0o755); err != nil {
		return "", "", err
	}
	return script, logPath, nil
}

// writeInstaller writes the shell script that installs a plugin via 0kay-pm.
func writeInstaller(dir, pm, pkg string) (string, string, error) {
	script := filepath.Join(dir, "install.sh")
	logPath := filepath.Join(dir, "install.log")
	body := fmt.Sprintf(`#!/bin/sh
%s%s install %s --no-pair
code=$?
if [ $code -eq 0 ]; then echo %s; else echo %s; fi
exit $code
`,
		shEnvLines(),
		shQuote(pm), shQuote(pkg),
		markerDone, markerFailed,
	)
	if err := os.WriteFile(script, []byte(body), 0o755); err != nil {
		return "", "", err
	}
	return script, logPath, nil
}

// writeUninstaller writes the shell script that removes a plugin via 0kay-pm.
func writeUninstaller(dir, pm, pkg string) (string, string, error) {
	script := filepath.Join(dir, "uninstall.sh")
	logPath := filepath.Join(dir, "install.log")
	body := fmt.Sprintf(`#!/bin/sh
%s uninstall %s
code=$?
if [ $code -eq 0 ]; then echo %s; else echo %s; fi
exit $code
`,
		shQuote(pm), shQuote(pkg),
		markerDone, markerFailed,
	)
	if err := os.WriteFile(script, []byte(body), 0o755); err != nil {
		return "", "", err
	}
	return script, logPath, nil
}

func joinArgs(cmd []string) string {
	out := make([]string, 0, len(cmd))
	for i, arg := range cmd {
		if i == 0 {
			arg = strings.TrimPrefix(arg, "./")
		}
		out = append(out, shQuote(arg))
	}
	return strings.Join(out, " ")
}

// writeSourceUpdater writes the git-sync + rebuild + restart script.
func writeSourceUpdater(dir string, plan sourcePlan) (string, string, error) {
	script := filepath.Join(dir, "source-update.sh")
	logPath := filepath.Join(dir, "apply.log")
	startLog := filepath.Join(plan.Dir, "update-run.log")
	var b strings.Builder
	b.WriteString("#!/bin/sh\n")
	b.WriteString("set -e\n")
	fmt.Fprintf(&b, "trap 'echo %s' EXIT\n", markerFailed)
	b.WriteString("export GIT_TERMINAL_PROMPT=0\n")
	b.WriteString("export GIT_HTTP_LOW_SPEED_LIMIT=1000\n")
	b.WriteString("export GIT_HTTP_LOW_SPEED_TIME=20\n")
	b.WriteString(shEnvLines())
	fmt.Fprintf(&b, "cd %s\n", shQuote(plan.RepoDir))
	b.WriteString("git pull --ff-only\n")
	fmt.Fprintf(&b, "cd %s\n", shQuote(plan.Dir))
	for key, value := range plan.Env {
		fmt.Fprintf(&b, "export %s=%s\n", key, shQuote(value))
	}
	for _, cmd := range plan.Build {
		fmt.Fprintf(&b, "%s\n", joinArgs(cmd))
	}
	if plan.Port > 0 {
		fmt.Fprintf(&b, "for pid in $(lsof -ti tcp:%d -sTCP:LISTEN 2>/dev/null); do kill \"$pid\" 2>/dev/null || true; done\n", plan.Port)
		b.WriteString("sleep 1\n")
	}
	if len(plan.Start) > 0 {
		fmt.Fprintf(&b, "setsid %s >>%s 2>&1 &\n", joinArgs(plan.Start), shQuote(startLog))
	}
	b.WriteString("trap - EXIT\n")
	fmt.Fprintf(&b, "echo %s\n", markerDone)
	if err := os.WriteFile(script, []byte(b.String()), 0o755); err != nil {
		return "", "", err
	}
	return script, logPath, nil
}

// launchDetached runs the script in its own session with output to the log.
func launchDetached(script, logPath string) error {
	handle, err := os.OpenFile(logPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o644)
	if err != nil {
		return err
	}
	cmd := exec.Command("/bin/sh", script)
	cmd.Stdout = handle
	cmd.Stderr = handle
	cmd.SysProcAttr = &syscall.SysProcAttr{Setsid: true}
	if err := cmd.Start(); err != nil {
		handle.Close()
		return err
	}
	go func() { _ = cmd.Wait(); _ = handle.Close() }()
	return nil
}
