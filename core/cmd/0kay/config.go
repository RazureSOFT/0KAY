package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"math/big"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"strconv"
	"strings"
	"time"
)

type Config struct {
	Root      string
	DataDir   string
	HTTPPort  string
	GRPCPort  string
	MocrPort  string
	LifePort  string
	AgentPort string
	BindHost  string
	LAN       bool
	PIN       string

	APIToken   string
	MocrToken  string
	LifeToken  string
	AgentToken string

	values map[string]string
	path   string
}

func (c *Config) uiURL() string {
	return "http://127.0.0.1:" + c.HTTPPort
}

func (c *Config) coreAddr() string {
	return "127.0.0.1:" + c.GRPCPort
}

// AgentEnabled reports whether the install actually contains the Agent. An
// installer component selection is expressed by the files that were copied,
// so presence is the truth here.
func (c *Config) AgentEnabled(root string) bool {
	return fileExists(filepath.Join(root, "agent", "dist", "index.js")) && fileExists(nodeRuntimePath(root))
}

// componentInstalled is what the installer's component page leaves behind:
// files. Core is required; everything else may have been deselected.
func componentInstalled(root, name string) bool {
	switch name {
	case "core":
		return fileExists(binaryPath(root, "core"))
	case "mocr":
		return fileExists(binaryPath(root, "mocr"))
	case "life":
		return fileExists(binaryPath(root, "0kay-life"))
	case "agent":
		return fileExists(filepath.Join(root, "agent", "dist", "index.js")) && fileExists(nodeRuntimePath(root))
	case "webui":
		return fileExists(filepath.Join(root, "webui", "index.html"))
	case "tui":
		return fileExists(binaryPath(root, "0kay-tui"))
	}
	return false
}

func installedLabel(installed bool) string {
	if installed {
		return "installed"
	}
	return "not installed"
}

func loadConfig(root string) (*Config, error) {
	dataDir := resolveDataRoot(root)
	values := map[string]string{}

	// pm writes runtime-env.json at the package root; the launcher writes its
	// own under the data directory. Read both: ports usually come from the root
	// file and the generated tokens from data/, and taking only the first file
	// would regenerate the PIN and enrollment keys on every command.
	paths := []string{
		filepath.Join(dataDir, "runtime-env.json"),
		filepath.Join(root, "runtime-env.json"),
	}
	for _, candidate := range paths {
		raw, err := os.ReadFile(candidate)
		if err != nil {
			continue
		}
		var decoded map[string]any
		if err := json.Unmarshal(raw, &decoded); err != nil {
			return nil, fmt.Errorf("parse %s: %w", candidate, err)
		}
		for key, value := range decoded {
			values[key] = stringify(value)
		}
	}

	cfg := &Config{
		Root:       root,
		DataDir:    dataDir,
		HTTPPort:   firstNonEmpty(values["CORE_HTTP_PORT"], "8080"),
		GRPCPort:   firstNonEmpty(values["CORE_GRPC_PORT"], "50051"),
		MocrPort:   firstNonEmpty(values["MOCR_GRPC_PORT"], "50052"),
		LifePort:   firstNonEmpty(values["LIFE_GRPC_PORT"], "50053"),
		AgentPort:  firstNonEmpty(values["AGENT_GRPC_PORT"], "50054"),
		BindHost:   firstNonEmpty(values["CORE_BIND_HOST"], "127.0.0.1"),
		LAN:        values["CORE_LAN_ENABLED"] == "1",
		PIN:        values["CORE_PIN"],
		APIToken:   values["CORE_API_TOKEN"],
		MocrToken:  values["MOCR_GRPC_TOKEN"],
		LifeToken:  values["CORE_PLUGIN_TOKEN_LIFE"],
		AgentToken: values["CORE_PLUGIN_TOKEN_AGENT"],
		values:     values,
		path:       filepath.Join(dataDir, "runtime-env.json"),
	}
	if cfg.PIN == "" {
		cfg.PIN = randomDigits(6)
	}

	changed := false
	ensure := func(current *string, generator func() string) {
		if *current == "" {
			*current = generator()
			changed = true
		}
	}
	ensure(&cfg.APIToken, randomSecret)
	ensure(&cfg.MocrToken, randomSecret)
	ensure(&cfg.LifeToken, randomSecret)
	ensure(&cfg.AgentToken, randomSecret)
	if values["CORE_PIN"] == "" {
		changed = true
	}

	cfg.values["CORE_HTTP_PORT"] = cfg.HTTPPort
	cfg.values["CORE_GRPC_PORT"] = cfg.GRPCPort
	cfg.values["MOCR_GRPC_PORT"] = cfg.MocrPort
	cfg.values["LIFE_GRPC_PORT"] = cfg.LifePort
	cfg.values["AGENT_GRPC_PORT"] = cfg.AgentPort
	cfg.values["CORE_BIND_HOST"] = cfg.BindHost
	cfg.values["CORE_API_TOKEN"] = cfg.APIToken
	cfg.values["MOCR_GRPC_TOKEN"] = cfg.MocrToken
	cfg.values["CORE_PLUGIN_TOKEN_LIFE"] = cfg.LifeToken
	cfg.values["CORE_PLUGIN_TOKEN_AGENT"] = cfg.AgentToken
	cfg.values["CORE_PLUGIN_TOKEN_MOCR"] = cfg.MocrToken
	cfg.values["CORE_PIN"] = cfg.PIN
	if cfg.LAN {
		cfg.values["CORE_LAN_ENABLED"] = "1"
	} else {
		delete(cfg.values, "CORE_LAN_ENABLED")
	}

	if changed || !fileExists(cfg.path) {
		if err := writeRuntimeEnv(cfg); err != nil {
			return nil, err
		}
	}
	return cfg, nil
}

func writeRuntimeEnv(cfg *Config) error {
	if err := os.MkdirAll(filepath.Dir(cfg.path), 0o700); err != nil {
		return fmt.Errorf("create runtime dir: %w", err)
	}
	data, err := json.MarshalIndent(cfg.values, "", "  ")
	if err != nil {
		return err
	}
	// Tokens: 0600 is enforced on Unix. Windows ignores the mode bits, so the
	// file stays under the user's profile ACL, which is the same protection
	// 0kay-pm's runtime-env.json has.
	if err := os.WriteFile(cfg.path, data, 0o600); err != nil {
		return fmt.Errorf("write runtime env: %w", err)
	}
	return os.Chmod(cfg.path, 0o600)
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}

func stringify(value any) string {
	switch typed := value.(type) {
	case string:
		return typed
	case float64:
		return strconv.FormatFloat(typed, 'f', -1, 64)
	case bool:
		return strconv.FormatBool(typed)
	case nil:
		return ""
	default:
		return fmt.Sprint(typed)
	}
}

func randomSecret() string {
	buffer := make([]byte, 32)
	if _, err := rand.Read(buffer); err != nil {
		return fmt.Sprintf("%d", time.Now().UnixNano())
	}
	return hex.EncodeToString(buffer)
}

func randomDigits(n int) string {
	out := make([]byte, n)
	for i := range out {
		value, err := rand.Int(rand.Reader, big.NewInt(10))
		if err != nil {
			out[i] = byte('0' + (time.Now().UnixNano()+int64(i))%10)
			continue
		}
		out[i] = byte('0' + value.Int64())
	}
	return string(out)
}

func binaryPath(root, name string) string {
	if runtime.GOOS == "windows" {
		candidate := filepath.Join(root, "bin", name+".exe")
		if fileExists(candidate) {
			return candidate
		}
	}
	return filepath.Join(root, "bin", name)
}

func nodeRuntimePath(root string) string {
	names := []string{filepath.Join(root, "runtimes", "node", "node"), filepath.Join(root, "runtimes", "node", "bin", "node")}
	if runtime.GOOS == "windows" {
		names = []string{
			filepath.Join(root, "runtimes", "node", "node.exe"),
			filepath.Join(root, "runtimes", "node", "bin", "node.exe"),
		}
	}
	for _, candidate := range names {
		if fileExists(candidate) {
			return candidate
		}
	}
	return names[0]
}

func fileExists(path string) bool {
	info, err := os.Stat(path)
	return err == nil && !info.IsDir()
}

func coreHealthy(cfg *Config) bool {
	client := http.Client{Timeout: 1500 * time.Millisecond}
	response, err := client.Get(cfg.uiURL() + "/health")
	if err != nil {
		return false
	}
	defer response.Body.Close()
	return response.StatusCode == http.StatusOK
}

func waitHealthy(cfg *Config, timeout time.Duration) bool {
	deadline := time.Now().Add(timeout)
	for time.Now().Before(deadline) {
		if coreHealthy(cfg) {
			return true
		}
		time.Sleep(250 * time.Millisecond)
	}
	return false
}

// resolveDataRoot keeps runtime state out of read-only install trees.
// AppImages and /opt (Linux) and /Applications (.app) cannot be written by the
// user, so data/, runtime-env.json and logs fall back to ~/.0kay/data. The
// portable tar and Windows installs stay self-contained.
func resolveDataRoot(root string) string {
	if value := strings.TrimSpace(os.Getenv("OKAY_DATA_DIR")); value != "" {
		if abs, err := filepath.Abs(value); err == nil {
			return abs
		}
		return value
	}
	local := filepath.Join(root, "data")
	if directoryWritable(local) {
		return local
	}
	if home, err := os.UserHomeDir(); err == nil && home != "" {
		return filepath.Join(home, ".0kay", "data")
	}
	return local
}

func directoryWritable(dir string) bool {
	if err := os.MkdirAll(dir, 0o700); err != nil {
		return false
	}
	probe := filepath.Join(dir, ".write-test")
	handle, err := os.OpenFile(probe, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0o600)
	if err != nil {
		return false
	}
	_ = handle.Close()
	_ = os.Remove(probe)
	return true
}

func readDaemonPID(dataDir string) int {
	raw, err := os.ReadFile(filepath.Join(dataDir, "0kay.pid"))
	if err != nil {
		return 0
	}
	pid, _ := strconv.Atoi(strings.TrimSpace(string(raw)))
	return pid
}

func writeDaemonPID(dataDir string, pid int) {
	path := filepath.Join(dataDir, "0kay.pid")
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return
	}
	_ = os.WriteFile(path, []byte(strconv.Itoa(pid)), 0o644)
}

func readServicePIDs(dataDir string) map[string]int {
	out := map[string]int{}
	raw, err := os.ReadFile(filepath.Join(dataDir, "0kay.pids"))
	if err != nil {
		return out
	}
	_ = json.Unmarshal(raw, &out)
	return out
}

func writeServicePIDs(dataDir string, pids map[string]int) {
	value := map[string]int{}
	for name, pid := range pids {
		if pid > 0 && processAlive(pid) {
			value[name] = pid
		}
	}
	path := filepath.Join(dataDir, "0kay.pids")
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return
	}
	data, err := json.Marshal(value)
	if err != nil {
		return
	}
	_ = os.WriteFile(path, data, 0o644)
}

func removeDaemonFiles(dataDir string) {
	_ = os.Remove(filepath.Join(dataDir, "0kay.pid"))
	_ = os.Remove(filepath.Join(dataDir, "0kay.pids"))
}

// processAlive is a cheap liveness probe; a stopped process's pid may be
// reused, so callers only use it to avoid killing a live supervisor twice.
func processAlive(pid int) bool {
	if pid <= 0 {
		return false
	}
	return probeAlive(pid)
}
