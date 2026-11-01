package main

import (
	"fmt"
	"io/fs"
	"os"
	"os/exec"
	"os/signal"
	"path/filepath"
	"strings"
	"sync"
	"syscall"
	"time"
)

type serviceSpec struct {
	name string
	path string
	args []string
	cwd  string
	env  []string
}

func startEnv(root string, cfg *Config) []string {
	base := []string{
		"CORE_ADDRESS=" + cfg.coreAddr(),
		"CORE_HTTP_ADDR=" + cfg.uiURL(),
		"CORE_API_TOKEN=" + cfg.APIToken,
		"MOCR_GRPC_TOKEN=" + cfg.MocrToken,
		"MOCR_ADDRESS=127.0.0.1:" + cfg.MocrPort,
		"OKAY_HOME=" + root,
	}
	return append(os.Environ(), base...)
}

func withEnv(base []string, extra ...string) []string {
	return append(append([]string{}, base...), extra...)
}

func (cfg *Config) services(root string, noAgent bool) []serviceSpec {
	env := startEnv(root, cfg)
	specs := []serviceSpec{
		{
			name: "core",
			path: binaryPath(root, "core"),
			cwd:  root,
			env: withEnv(env,
				"CORE_DATA_DIR="+filepath.Join(cfg.DataDir, "core"),
				"CORE_WEBUI_DIR="+filepath.Join(root, "webui"),
				"LIVE2D_DIR="+filepath.Join(root, "webui", "live2d", "models"),
				"CORE_HTTP_PORT="+cfg.HTTPPort,
				"CORE_GRPC_PORT="+cfg.GRPCPort,
				"CORE_BIND_HOST="+cfg.BindHost,
				"CORE_PIN="+cfg.PIN,
				"CORE_PLUGIN_TOKEN_LIFE="+cfg.LifeToken,
				"CORE_PLUGIN_TOKEN_AGENT="+cfg.AgentToken,
				"CORE_PLUGIN_TOKEN_MOCR="+cfg.MocrToken,
			),
		},
		{
			name: "mocr",
			path: binaryPath(root, "mocr"),
			cwd:  root,
			env: withEnv(env,
				"MOCR_GRPC_PORT="+cfg.MocrPort,
				"MOCR_BIND_HOST=127.0.0.1",
				"MOCR_DATA_DIR="+filepath.Join(cfg.DataDir, "mocr"),
				"CORE_PLUGIN_REGISTRATION_TOKEN="+cfg.MocrToken,
			),
		},
		{
			name: "life",
			path: binaryPath(root, "0kay-life"),
			cwd:  root,
			env: withEnv(env,
				"LIFE_GRPC_PORT="+cfg.LifePort,
				"LIFE_BIND_HOST=127.0.0.1",
				"LIFE_ADDRESS=127.0.0.1:"+cfg.LifePort,
				"LIFE_DATA_DIR="+filepath.Join(cfg.DataDir, "life"),
				"LIFE_SKILLS_DIR="+filepath.Join(root, "skills"),
				"CORE_PLUGIN_REGISTRATION_TOKEN="+cfg.LifeToken,
				"PYTHONUNBUFFERED=1",
				"PYTHONUTF8=1",
			),
		},
	}
	if !noAgent && cfg.AgentEnabled(root) {
		specs = append(specs, serviceSpec{
			name: "agent",
			path: nodeRuntimePath(root),
			args: []string{filepath.Join(root, "agent", "dist", "index.js")},
			cwd:  filepath.Join(root, "agent"),
			env: withEnv(env,
				"PROTO_DIR="+filepath.Join(root, "proto"),
				"AGENT_GRPC_PORT="+cfg.AgentPort,
				"AGENT_ADDRESS=127.0.0.1:"+cfg.AgentPort,
				"AGENT_BIND_HOST=127.0.0.1",
				"AGENT_DATA_DIR="+filepath.Join(cfg.DataDir, "agent"),
				"CORE_PLUGIN_REGISTRATION_TOKEN="+cfg.AgentToken,
				"NODE_ENV=production",
			),
		})
	}
	if cfg.LAN {
		specs[0].env = append(specs[0].env, "CORE_LAN_ENABLED=1")
	}
	return specs
}

// seedRuntimeData copies the shipped plugin UI modules and built-in UI patches
// into Core's writable data dir. They are build artifacts, so the bundle's copy
// wins on every start; user customisations live elsewhere (e.g. fluentui.patch).
func seedRuntimeData(cfg *Config) error {
	source := filepath.Join(cfg.Root, "seed", "core")
	if _, err := os.Stat(source); err != nil {
		return nil
	}
	destination := filepath.Join(cfg.DataDir, "core")
	return filepath.WalkDir(source, func(path string, entry fs.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		relative, err := filepath.Rel(source, path)
		if err != nil {
			return err
		}
		target := filepath.Join(destination, relative)
		if entry.IsDir() {
			return os.MkdirAll(target, 0o755)
		}
		data, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		if err := os.MkdirAll(filepath.Dir(target), 0o755); err != nil {
			return err
		}
		return os.WriteFile(target, data, 0o644)
	})
}

func runSupervisor(opts options) int {
	root := rootDir(opts.root)
	cfg, err := loadConfig(root)
	if err != nil {
		fail(err)
		return 1
	}
	logDir := filepath.Join(cfg.DataDir, "logs")
	if err := os.MkdirAll(logDir, 0o755); err != nil {
		fail(err)
		return 1
	}
	writeDaemonPID(cfg.DataDir, os.Getpid())
	if err := seedRuntimeData(cfg); err != nil {
		fmt.Fprintf(os.Stderr, "0kay: seed plugin UI: %v\n", err)
	}

	specs := cfg.services(root, opts.noAgent)
	var runnable []serviceSpec
	for _, spec := range specs {
		if fileExists(spec.path) {
			runnable = append(runnable, spec)
			continue
		}
		if spec.name == "core" {
			fmt.Fprintf(os.Stderr, "missing core binary at %s\n", spec.path)
			fmt.Fprintln(os.Stderr, "this install is incomplete; reinstall 0KAY or run packaging/build.py")
			return 1
		}
		// Installers let people omit LIFE or mocr; the launcher starts what is
		// there instead of refusing to run.
		fmt.Printf("0kay: %s is not installed; skipping\n", spec.name)
	}
	specs = runnable

	stop := make(chan struct{})
	var stopOnce sync.Once
	stopping := func() bool {
		select {
		case <-stop:
			return true
		default:
			return false
		}
	}

	pids := map[string]int{}
	var mu sync.Mutex
	children := map[string]*exec.Cmd{}

	var startOne func(spec serviceSpec)
	startOne = func(spec serviceSpec) {
		logPath := filepath.Join(logDir, spec.name+".log")
		logFile, openErr := os.OpenFile(logPath, os.O_CREATE|os.O_APPEND|os.O_WRONLY, 0o644)
		if openErr != nil {
			fmt.Fprintf(os.Stderr, "%s: open log: %v\n", spec.name, openErr)
			return
		}
		cmd := exec.Command(spec.path, spec.args...)
		cmd.Dir = spec.cwd
		cmd.Env = spec.env
		cmd.Stdout = logFile
		cmd.Stderr = logFile
		configureChild(cmd)
		if startErr := cmd.Start(); startErr != nil {
			fmt.Fprintf(os.Stderr, "%s: %v\n", spec.name, startErr)
			_ = logFile.Close()
			return
		}
		mu.Lock()
		children[spec.name] = cmd
		pids[spec.name] = cmd.Process.Pid
		mu.Unlock()
		writeServicePIDs(cfg.DataDir, snapshot(pids, &mu))
		fmt.Printf("0kay: %s started (pid %d)\n", spec.name, cmd.Process.Pid)

		go func() {
			waitErr := cmd.Wait()
			_ = logFile.Close()
			mu.Lock()
			delete(children, spec.name)
			if pids[spec.name] == cmd.Process.Pid {
				delete(pids, spec.name)
			}
			mu.Unlock()
			writeServicePIDs(cfg.DataDir, snapshot(pids, &mu))
			if stopping() {
				return
			}
			fmt.Printf("0kay: %s exited (%v); restarting in 2s\n", spec.name, waitErr)
			select {
			case <-time.After(2 * time.Second):
				startOne(spec)
			case <-stop:
			}
		}()
	}

	startOne(specs[0])
	if !waitHealthy(cfg, 45*time.Second) {
		fmt.Fprintln(os.Stderr, "0kay: Core did not become healthy")
		tailLog(filepath.Join(logDir, "core.log"))
		stopOnce.Do(func() { close(stop) })
		stopChildren(children, &mu)
		return 1
	}
	for _, spec := range specs[1:] {
		startOne(spec)
	}

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt, syscall.SIGTERM)
	fmt.Printf("0kay: up at %s\n", cfg.uiURL())
	if cfg.PIN != "" {
		fmt.Printf("0kay: setup PIN %s\n", cfg.PIN)
	}
	<-signals
	fmt.Println("\n0kay: stopping")
	stopOnce.Do(func() { close(stop) })
	stopChildren(children, &mu)
	removeDaemonFiles(cfg.DataDir)
	return 0
}

func snapshot(pids map[string]int, mu *sync.Mutex) map[string]int {
	mu.Lock()
	defer mu.Unlock()
	out := make(map[string]int, len(pids))
	for name, pid := range pids {
		out[name] = pid
	}
	return out
}

func stopChildren(children map[string]*exec.Cmd, mu *sync.Mutex) {
	mu.Lock()
	procs := make([]*os.Process, 0, len(children))
	for _, cmd := range children {
		procs = append(procs, cmd.Process)
	}
	mu.Unlock()

	for _, proc := range procs {
		stopProcessTree(proc.Pid)
	}
	deadline := time.Now().Add(5 * time.Second)
	for time.Now().Before(deadline) {
		mu.Lock()
		remaining := len(children)
		mu.Unlock()
		if remaining == 0 {
			return
		}
		time.Sleep(100 * time.Millisecond)
	}
}

func tailLog(path string) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return
	}
	lines := strings.Split(strings.TrimRight(string(raw), "\n"), "\n")
	if len(lines) > 30 {
		lines = lines[len(lines)-30:]
	}
	fmt.Fprintln(os.Stderr, "--- "+path+" ---")
	fmt.Fprintln(os.Stderr, strings.Join(lines, "\n"))
}
