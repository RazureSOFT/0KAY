// Command 0kay is the launcher/supervisor for a packaged 0KAY install.
//
// A source checkout starts services with start-0kay.sh; an installed build has
// no Go, Node or Python on the machine, so this binary owns the things the
// shell script used to: locate the bundled services, generate the shared
// enrollment tokens once, start them in the right order, and stop them.
//
//	0kay            start the stack if needed, then open the TUI
//	0kay run        supervise the stack in this terminal (service unit)
//	0kay up         start the stack detached
//	0kay down       stop everything
//	0kay status     health, ports, pids
//	0kay url        print the WebUI URL
//	0kay logs NAME  show a service log
package main

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"
)

var version = "0.1.4"

func main() {
	args := os.Args[1:]
	// Flags before a command (`0kay --version`) are not the TUI.
	if len(args) > 0 {
		switch args[0] {
		case "version", "--version", "-v":
			fmt.Printf("0kay %s\n", version)
			return
		case "help", "--help", "-h":
			fmt.Print(helpText)
			return
		}
	}
	command := "tui"
	if len(args) > 0 && !strings.HasPrefix(args[0], "-") {
		command = args[0]
		args = args[1:]
	}
	opts := parseOptions(args)

	switch command {
	case "tui":
		os.Exit(runTUI(opts))
	case "run":
		os.Exit(runSupervisor(opts))
	case "up", "start":
		os.Exit(runUp(opts))
	case "down", "stop":
		os.Exit(runDown(opts))
	case "restart":
		if code := runDown(opts); code != 0 {
			os.Exit(code)
		}
		time.Sleep(500 * time.Millisecond)
		os.Exit(runUp(opts))
	case "status":
		os.Exit(runStatus(opts))
	case "url":
		cfg, err := loadConfig(rootDir(opts.root))
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			os.Exit(1)
		}
		fmt.Println(cfg.uiURL())
	case "logs":
		os.Exit(runLogs(opts, args))
	default:
		fmt.Fprintf(os.Stderr, "unknown command %q\n\n%s", command, helpText)
		os.Exit(2)
	}
}

const helpText = `0KAY

  0kay                  start the stack if needed and open the TUI
  0kay run              run the supervisor in this terminal (Ctrl+C stops it)
  0kay up               start the stack in the background
  0kay down             stop the stack
  0kay restart          restart the stack
  0kay status           show health, ports and pids
  0kay url              print the WebUI URL
  0kay logs <service>   show <core|mocr|life|agent|supervisor> log
  0kay version

Options:
  --root <dir>    install root (default: the folder above bin/)
  --no-agent      do not start the Agent even if it is installed
`

type options struct {
	root    string
	noAgent bool
}

func parseOptions(args []string) options {
	var opts options
	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--root":
			if i+1 < len(args) {
				opts.root = args[i+1]
				i++
			}
		case "--no-agent":
			opts.noAgent = true
		}
	}
	return opts
}

// rootDir is the install root: the directory that holds bin/, webui/, data/.
// A packaged launcher lives in <root>/bin; running it from a source checkout
// without --root falls back to the working directory so `go run ./cmd/0kay`
// still finds the repository.
func rootDir(flagValue string) string {
	if flagValue != "" {
		return absolute(flagValue)
	}
	if home := os.Getenv("OKAY_HOME"); home != "" {
		return absolute(home)
	}
	exe, err := os.Executable()
	if err == nil {
		exe, _ = filepath.EvalSymlinks(exe)
		dir := filepath.Dir(exe)
		if strings.EqualFold(filepath.Base(dir), "bin") {
			return filepath.Dir(dir)
		}
		// A macOS .app puts the launcher in Contents/Resources/0kay/bin.
		if filepath.Base(dir) == "0kay" {
			return dir
		}
	}
	wd, err := os.Getwd()
	if err != nil {
		return "."
	}
	return wd
}

func absolute(p string) string {
	if abs, err := filepath.Abs(p); err == nil {
		return abs
	}
	return p
}

func runUp(opts options) int {
	root := rootDir(opts.root)
	cfg, err := loadConfig(root)
	if err != nil {
		fail(err)
		return 1
	}
	if coreHealthy(cfg) {
		fmt.Printf("0KAY is already running: %s\n", cfg.uiURL())
		return 0
	}
	if pid := readDaemonPID(cfg.DataDir); pid > 0 && processAlive(pid) {
		fmt.Println("waiting for the running supervisor ...")
		if waitHealthy(cfg, 30*time.Second) {
			fmt.Printf("0KAY is up: %s\n", cfg.uiURL())
			return 0
		}
		fmt.Fprintln(os.Stderr, "supervisor is running but Core is not healthy; see 0kay logs supervisor")
		return 1
	}

	self, err := os.Executable()
	if err != nil {
		fail(fmt.Errorf("locate launcher: %w", err))
		return 1
	}
	args := []string{"run", "--root", root}
	if opts.noAgent {
		args = append(args, "--no-agent")
	}
	logDir := filepath.Join(cfg.DataDir, "logs")
	if err := os.MkdirAll(logDir, 0o755); err != nil {
		fail(err)
		return 1
	}
	logFile, err := os.OpenFile(filepath.Join(logDir, "supervisor.log"), os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o644)
	if err != nil {
		fail(err)
		return 1
	}
	defer logFile.Close()

	cmd := exec.Command(self, args...)
	cmd.Dir = root
	cmd.Stdout = logFile
	cmd.Stderr = logFile
	cmd.Stdin = nil
	configureDetached(cmd)
	if err := cmd.Start(); err != nil {
		fail(fmt.Errorf("start supervisor: %w", err))
		return 1
	}
	pid := cmd.Process.Pid
	_ = cmd.Process.Release()
	writeDaemonPID(cfg.DataDir, pid)
	fmt.Printf("starting 0KAY (supervisor pid %d) ...\n", pid)
	if !waitHealthy(cfg, 60*time.Second) {
		fmt.Fprintln(os.Stderr, "Core did not become healthy; see 0kay logs supervisor")
		return 1
	}
	fmt.Printf("0KAY is up: %s\n", cfg.uiURL())
	if cfg.PIN != "" {
		fmt.Printf("Setup PIN: %s\n", cfg.PIN)
	}
	return 0
}

func runDown(opts options) int {
	root := rootDir(opts.root)
	dataDir := resolveDataRoot(root)
	pid := readDaemonPID(dataDir)
	// Read the children before removing anything: the daemon's bookkeeping file
	// is the only list of what it started, and a forced kill (Windows has no
	// SIGTERM for a detached process) skips the supervisor's own cleanup.
	pids := readServicePIDs(dataDir)
	if pid > 0 {
		stopProcessTree(pid)
	}
	for _, child := range pids {
		stopProcessTree(child)
	}
	removeDaemonFiles(dataDir)
	if pid <= 0 && len(pids) == 0 {
		fmt.Println("0KAY is not running.")
		return 0
	}
	fmt.Println("0KAY stopped.")
	return 0
}

func runStatus(opts options) int {
	root := rootDir(opts.root)
	cfg, err := loadConfig(root)
	if err != nil {
		fail(err)
		return 1
	}
	healthy := coreHealthy(cfg)
	ownDaemon := readDaemonPID(cfg.DataDir) > 0 || len(readServicePIDs(cfg.DataDir)) > 0
	state := "stopped"
	switch {
	case healthy && ownDaemon:
		state = "running"
	case healthy:
		state = "running (started outside this install)"
	}
	fmt.Printf("0KAY %s  %s\n", version, state)
	fmt.Printf("root     %s\n", root)
	fmt.Printf("data     %s\n", cfg.DataDir)
	fmt.Printf("webui    %s\n", cfg.uiURL())
	fmt.Printf("core     http :%s  grpc :%s\n", cfg.HTTPPort, cfg.GRPCPort)
	fmt.Printf("mocr     :%s\n", cfg.MocrPort)
	fmt.Printf("life     :%s\n", cfg.LifePort)
	if cfg.AgentEnabled(root) {
		fmt.Printf("agent    :%s\n", cfg.AgentPort)
	} else {
		fmt.Printf("agent    not installed\n")
	}
	pids := readServicePIDs(cfg.DataDir)
	for _, svc := range []string{"core", "mocr", "life", "agent"} {
		line := fmt.Sprintf("%-8s", svc)
		if !componentInstalled(root, svc) {
			line += " not installed"
			fmt.Println(line)
			continue
		}
		pid := pids[svc]
		if pid > 0 && processAlive(pid) {
			line += fmt.Sprintf(" pid %-8d running", pid)
		} else {
			line += " pid -        stopped"
		}
		fmt.Println(line)
	}
	fmt.Printf("%-8s %s\n", "webui", installedLabel(componentInstalled(root, "webui")))
	fmt.Printf("%-8s %s\n", "tui", installedLabel(componentInstalled(root, "tui")))
	if cfg.PIN != "" && healthy {
		fmt.Printf("setup PIN %s\n", cfg.PIN)
	}
	return 0
}

func runTUI(opts options) int {
	root := rootDir(opts.root)
	cfg, err := loadConfig(root)
	if err != nil {
		fail(err)
		return 1
	}
	if !coreHealthy(cfg) {
		if code := runUp(opts); code != 0 {
			return code
		}
	}
	tui := binaryPath(root, "0kay-tui")
	if _, err := os.Stat(tui); err != nil {
		fmt.Fprintf(os.Stderr, "TUI binary not found: %s\nThis install only ships the desktop shell; use it, or install the TUI package.\n", tui)
		return 1
	}
	cmd := exec.Command(tui)
	cmd.Dir = root
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Env = append(os.Environ(),
		"CORE_HTTP_ADDR="+cfg.uiURL(),
		"CORE_API_TOKEN="+cfg.APIToken,
	)
	if err := cmd.Run(); err != nil {
		if exit, ok := err.(*exec.ExitError); ok {
			fmt.Fprintf(os.Stderr, "TUI exited: %v\n", err)
			fmt.Println("The stack is still running. Stop it with: 0kay down")
			return exit.ExitCode()
		}
		fail(err)
		return 1
	}
	fmt.Println("The stack is still running. Stop it with: 0kay down")
	return 0
}

func runLogs(opts options, args []string) int {
	root := rootDir(opts.root)
	name := "supervisor"
	if len(args) > 0 && !strings.HasPrefix(args[0], "-") {
		name = args[0]
	}
	switch name {
	case "core", "mocr", "life", "agent", "supervisor":
	default:
		fmt.Fprintf(os.Stderr, "unknown service %q (core|mocr|life|agent|supervisor)\n", name)
		return 2
	}
	dataDir := resolveDataRoot(root)
	file := filepath.Join(dataDir, "logs", name+".log")
	f, err := os.Open(file)
	if err != nil {
		fmt.Fprintf(os.Stderr, "no log yet: %s\n", file)
		return 1
	}
	defer f.Close()
	// Last ~64 KiB is enough to explain a failed start without paging a
	// multi-megabyte log into a terminal.
	if info, statErr := f.Stat(); statErr == nil && info.Size() > 64*1024 {
		_, _ = f.Seek(-64*1024, io.SeekEnd)
	}
	_, _ = io.Copy(os.Stdout, f)
	return 0
}

func fail(err error) {
	fmt.Fprintln(os.Stderr, "0kay:", err)
}
