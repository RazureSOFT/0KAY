package main

import (
	"context"
	"crypto/rand"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"0kay/core/internal/config"
	"0kay/core/internal/gateway"
	"0kay/core/internal/pairing"
	"0kay/core/internal/providers"
	"0kay/core/internal/registry"
	"0kay/core/internal/server"
	"0kay/core/internal/settings"
	"0kay/core/internal/stdioprovider"
	"0kay/core/internal/update"
	"0kay/core/internal/version"
	corev1 "0kay/gen/core/v1"
	mocrv1 "0kay/gen/mocr/v1"
	pluginv1 "0kay/gen/plugin/v1"
	"crypto/tls"
	"google.golang.org/grpc/credentials"
	"google.golang.org/grpc/keepalive"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func main() {
	cfg := config.LoadConfig()

	// Initialize registry
	reg := registry.NewRegistry()

	// Multi-provider config + plugin settings stores
	dataDir := os.Getenv("CORE_DATA_DIR")
	if dataDir == "" {
		dataDir = "data"
	}
	provStore := providers.NewStore(dataDir + "/providers.json")
	setStore := settings.NewStore(dataDir + "/settings.json")

	// Per-plugin service tokens derive from a persisted key so they survive
	// Core restarts (a plugin keeps working without re-registering).
	if secret, err := loadPluginTokenSecret(dataDir); err != nil {
		log.Printf("plugin token secret: %v (plugin identity disabled)", err)
	} else {
		reg.SetSecret(secret)
	}
	// Optional shared secret non-builtin plugins must present at registration.
	// Unset keeps the historic network-trust model; set it on exposed cores.
	reg.SetRegistrationToken(os.Getenv("CORE_PLUGIN_REGISTRATION_TOKEN"))
	// First-party platform plugins bypass the manifest permission allow-lists
	// (their egress is fully permitted). Third-party plugins are enforced.
	reg.SetTrusted([]string{
		"webui", "agent", "life", "mocr", "mcp", "minecraft",
		"pm", "0kay-pm", "fluentui", "liquidglass", "free-model", "marketplace",
	})

	// GitHub mirror for plugin/update fetches (Settings → Plugin updates).
	registerUpdateSettings(setStore)
	applyGitHubProxy(setStore)

	// Create gRPC server
	pairs, err := pairing.New(dataDir)
	if err != nil {
		log.Fatalf("pairing state: %v", err)
	}
	pairing.Default = pairs
	grpcServer := grpc.NewServer(
		grpc.UnaryInterceptor(pairs.Unary),
		grpc.StreamInterceptor(pairs.Stream),
		grpc.KeepaliveParams(keepalive.ServerParameters{Time: 30 * time.Second, Timeout: 10 * time.Second}),
		grpc.KeepaliveEnforcementPolicy(keepalive.EnforcementPolicy{MinTime: 10 * time.Second, PermitWithoutStream: true}),
	)

	// Register services
	pluginSvc := server.NewPluginServiceServer(reg, setStore)
	coreSvc := server.NewCoreServiceServer(reg)
	coreSvc.SetProviderStore(provStore)

	corev1.RegisterPluginServiceServer(grpcServer, pluginSvc)
	corev1.RegisterCoreServiceServer(grpcServer, coreSvc)

	// Enable reflection for debugging
	reflection.Register(grpcServer)

	// Start gRPC listener
	grpcListener, err := net.Listen("tcp", cfg.GRPCAddr())
	if err != nil {
		log.Fatalf("Failed to listen gRPC: %v", err)
	}

	// Create HTTP gateway (built once for loopback + optional LAN servers)
	gw, err := gateway.NewGateway(&gateway.Config{
		GRPCAddr: cfg.GRPCAddr(),
		HTTPAddr: cfg.HTTPAddr(),
	}, reg)
	if err != nil {
		log.Fatalf("Failed to create gateway: %v", err)
	}
	gw.SetCoreService(coreSvc)
	gw.SetProviderStore(provStore)
	gw.SetSettingsStore(setStore)
	// Public = Host allow-list (DNS-rebinding defence) + CORS, then pairing
	// authentication, then the routes themselves. Both loopback and the optional
	// LAN listener share this stack so the two surfaces cannot drift apart.
	handler := gateway.Public(pairs.HTTP(gw.Handler()))

	// Create HTTP server. WriteTimeout stays unset so SSE streams are not cut off;
	// ReadHeaderTimeout/IdleTimeout limit slowloris-style connections.
	httpServer := &http.Server{
		Addr:              cfg.HTTPAddr(),
		Handler:           handler,
		ReadHeaderTimeout: 10 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	// Built-in plugins managed by Core (WebUI + local SearXNG when present)
	registerBuiltins(reg, setStore)

	// Provider-adapter plugins: host manifest-declared stdio providers as child
	// processes and expose them on Core's own HTTP port (no extra port).
	stdioRunner := stdioprovider.NewRunner()
	gw.SetStdioRunner(stdioRunner)
	registerStdioProviders(stdioRunner, provStore, cfg.HTTPAddr())

	// Settings sections declared by installed packages (used by stdio plugins,
	// which have no gRPC registration channel).
	registerPluginSettings(setStore)

	// Start heartbeat checker
	go startHeartbeatChecker(reg, cfg)

	// Graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	go startLifeScheduler(ctx, reg)
	if os.Getenv("CORE_LAN_ENABLED") == "1" {
		lanHTTP := &http.Server{Addr: ":8443", Handler: handler, TLSConfig: pairs.TLS, ReadHeaderTimeout: 10 * time.Second, IdleTimeout: 120 * time.Second}
		listener, err := tls.Listen("tcp", lanHTTP.Addr, pairs.TLS)
		if err != nil {
			log.Fatal(err)
		}
		go func() {
			if err := lanHTTP.Serve(listener); err != nil && err != http.ErrServerClosed {
				log.Printf("LAN HTTP: %v", err)
			}
		}()
		lanGRPC := grpc.NewServer(
			grpc.Creds(credentials.NewTLS(pairs.TLS)),
			grpc.UnaryInterceptor(pairs.Unary),
			grpc.StreamInterceptor(pairs.Stream),
			grpc.KeepaliveParams(keepalive.ServerParameters{Time: 30 * time.Second, Timeout: 10 * time.Second}),
			grpc.KeepaliveEnforcementPolicy(keepalive.EnforcementPolicy{MinTime: 10 * time.Second, PermitWithoutStream: true}),
		)
		corev1.RegisterPluginServiceServer(lanGRPC, pluginSvc)
		corev1.RegisterCoreServiceServer(lanGRPC, coreSvc)
		mocrAddress := os.Getenv("MOCR_ADDRESS")
		if mocrAddress == "" {
			mocrAddress = "127.0.0.1:50052"
		}
		mocrv1.RegisterMocrServiceServer(lanGRPC, &pairing.MocrProxy{Address: mocrAddress})
		lanListener, err := net.Listen("tcp", ":5443")
		if err != nil {
			log.Fatal(err)
		}
		go lanGRPC.Serve(lanListener)
		if err := pairs.Discover(ctx, 8443, 5443); err != nil {
			log.Printf("LAN discovery: %v", err)
		}
		go func() { <-ctx.Done(); lanHTTP.Close(); lanGRPC.Stop() }()
	}

	go func() {
		sigCh := make(chan os.Signal, 1)
		signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
		<-sigCh
		fmt.Println("\nShutting down...")

		// Stop HTTP server. Bound the drain so a stuck SSE/WS connection cannot
		// hang shutdown forever; force-close whatever is left when it expires.
		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
		if err := httpServer.Shutdown(shutdownCtx); err != nil {
			log.Printf("HTTP shutdown: %v", err)
			_ = httpServer.Close()
		}
		shutdownCancel()

		// Stop gRPC server
		grpcServer.GracefulStop()

		// Kill provider child processes so they are not orphaned.
		stdioRunner.Stop()

		cancel()
	}()

	// Start gRPC server in background
	go func() {
		fmt.Printf("Core gRPC server starting on %s\n", cfg.GRPCAddr())
		if err := grpcServer.Serve(grpcListener); err != nil {
			log.Fatalf("gRPC serve failed: %v", err)
		}
	}()

	// Start HTTP server (blocking)
	fmt.Printf("Core HTTP gateway starting on %s\n", cfg.HTTPAddr())
	if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("HTTP serve failed: %v", err)
	}

	_ = ctx
}

// registerBuiltins registers Core-managed plugins (webui adapter, etc.).
func registerBuiltins(reg *registry.Registry, setStore *settings.Store) {
	webuiAddr := os.Getenv("WEBUI_ADDR")
	if webuiAddr == "" {
		webuiAddr = "http://127.0.0.1:3000"
	}
	if _, err := reg.RegisterBuiltin(&pluginv1.PluginInfo{
		Name:        "webui",
		Version:     version.Version,
		Description: "0kay WebUI - Vue3 frontend adapter",
		Author:      "0kay",
		PluginType:  pluginv1.PluginType_PLUGIN_TYPE_ADAPTER,
	}, []string{"webui"}, webuiAddr); err != nil {
		log.Printf("register webui builtin: %v", err)
	}

	// 0kay-pm (the package manager) registers as a built-in service plugin so it
	// appears in the Plugins page and its permission surface is auditable. It has
	// no process of its own; Core exposes the install/lifecycle APIs it drives.
	if _, err := reg.RegisterBuiltin(&pluginv1.PluginInfo{
		Name:        "pm",
		Version:     version.Version,
		Description: "0kay-pm - package manager (install/update/uninstall plugins)",
		Author:      "0kay",
		PluginType:  pluginv1.PluginType_PLUGIN_TYPE_SERVICE,
		Permissions: &pluginv1.PluginPermission{
			ApiExposes: []string{
				"POST /api/plugins/pm/install",
				"POST /api/plugins/pm/uninstall",
				"POST /api/plugins/pm/update",
				"GET /api/plugins/pm/installed",
				"GET /api/plugins/pm/status",
				"GET /api/plugins/pm/check",
				"GET /api/plugins/pm/check-plugins",
			},
			Egress: []string{"github.com", "codeload.github.com", "registry.npmjs.org", "*.githubusercontent.com"},
		},
	}, []string{"package-manager"}, ""); err != nil {
		log.Printf("register pm builtin: %v", err)
	}

	// Core-native session-context tools: folded-history search/decompress served
	// in-process (CoreServiceServer.callContextTool). Exposed to the Agent so the
	// model can recall what /compact folded away.
	if _, err := reg.RegisterBuiltin(&pluginv1.PluginInfo{
		Name:        "context",
		Version:     version.Version,
		Description: "Core-native session context tools (compressed history search / decompress)",
		Author:      "0kay",
		PluginType:  pluginv1.PluginType_PLUGIN_TYPE_TOOL,
		Tools: []*pluginv1.PluginTool{
			{
				Name:           "session_context_search",
				Description:    "Keyword search over this session's earlier turns and compressed summaries; use it to recall details that were folded away.",
				Scopes:         []string{"agent"},
				ParametersJson: `{"type":"object","required":["query"],"properties":{"query":{"type":"string","description":"keywords to find"}}}`,
			},
			{
				Name:           "session_context_decompress",
				Description:    "Return the full text behind an id from session_context_search (an earlier turn or a compressed block).",
				Scopes:         []string{"agent"},
				ParametersJson: `{"type":"object","required":["id"],"properties":{"id":{"type":"string","description":"a turn id or block id returned by session_context_search"}}}`,
			},
		},
	}, []string{"context"}, ""); err != nil {
		log.Printf("register context builtin: %v", err)
	}

	// MCP server configuration is core-owned: the 0kay-mcp package is a client
	// library with no process, so Core stores the shared server list and Agent /
	// L.I.F.E. read it back (`GET /api/settings/mcp`).
	registerMcpSettings(setStore)

	// Fluent Design theme: a patch-only plugin, i.e. it has no process to
	// register itself from. Core materializes the registry row so the Plugins
	// page can switch it. The patch is not shipped in core/data/ui — 0kay-pm
	// copies plugin-web/fluentui/patches/fluentui.patch there on install, so
	// this row only exists on machines that installed the theme. The file names
	// `plugin: "fluentui"` and is therefore served only while this row is on.
	if gateway.HasUIPatch("fluentui.patch") {
		if _, err := reg.RegisterBuiltin(&pluginv1.PluginInfo{
			Name:        "fluentui",
			Version:     version.Version,
			Description: "Fluent Design theme for the WebUI (patch-only)",
			Author:      "0kay",
			PluginType:  pluginv1.PluginType_PLUGIN_TYPE_ADAPTER,
		}, []string{"fluentui"}, ""); err != nil {
			log.Printf("register fluentui builtin: %v", err)
		}
	}

	// Web search is built into Core now (no standalone searxng plugin/process):
	// the engine preference is a core-owned settings section.
	registerSearchSettings(setStore)
}

// registerStdioProviders spawns each installed package's manifest-declared
// stdio provider and registers it with the provider store, pointed at Core's
// own HTTP route (so the plugin opens no port).
func registerStdioProviders(runner *stdioprovider.Runner, store *providers.Store, httpAddr string) {
	if store == nil {
		return
	}
	_, port, err := net.SplitHostPort(httpAddr)
	if err != nil || port == "" {
		port = "8080"
	}
	for _, spec := range update.ProviderSpecs() {
		if err := runner.Start(spec.ID, spec.Dir, spec.Command); err != nil {
			log.Printf("[stdio] start provider %s: %v", spec.ID, err)
			continue
		}
		go registerOneStdioProvider(runner, store, port, spec)
	}
}

// registerOneStdioProvider discovers a provider's models (retrying while the
// child warms up) and registers it with the provider store. Runs in the
// background so Core startup is never blocked by a slow plugin.
func registerOneStdioProvider(runner *stdioprovider.Runner, store *providers.Store, port string, spec update.ProviderSpec) {
	models := spec.Models
	for attempt := 0; attempt < 36 && len(models) == 0; attempt++ {
		if attempt > 0 {
			time.Sleep(5 * time.Second)
		}
		models = queryStdioModels(runner, spec.ID, spec.Route)
	}
	if len(models) == 0 {
		models = spec.Models
	}
	defaultModel := spec.DefaultModel
	if defaultModel == "" && len(models) > 0 {
		defaultModel = models[0]
	}
	baseURL := fmt.Sprintf("http://127.0.0.1:%s/api/stdio-provider/%s%s", port, spec.ID, spec.Route)
	if err := store.Upsert(providers.ProviderConfig{
		ID:           spec.ID,
		Provider:     "custom",
		Name:         spec.Name,
		BaseURL:      baseURL,
		APIKey:       "stdio-local",
		Models:       models,
		DefaultModel: defaultModel,
		Enabled:      true,
		Format:       "openai",
	}); err != nil {
		log.Printf("[stdio] register provider %s: %v", spec.ID, err)
		return
	}
	log.Printf("[stdio] hosting provider %q for %s at %s (%d models)", spec.ID, spec.Package, baseURL, len(models))
}

// queryStdioModels asks a running stdio provider for its model list.
func queryStdioModels(runner *stdioprovider.Runner, id, route string) []string {
	ctx, cancel := context.WithTimeout(context.Background(), 4*time.Second)
	defer cancel()
	status, _, chunks, err := runner.Do(ctx, id, http.MethodGet, route+"/models", map[string]string{"Accept": "application/json"}, nil)
	if err != nil || status != http.StatusOK {
		return nil
	}
	var buf []byte
	reading := true
	for reading {
		select {
		case <-ctx.Done():
			return nil
		case chunk, ok := <-chunks:
			if !ok {
				reading = false
				break
			}
			if chunk.Err != nil {
				return nil
			}
			buf = append(buf, chunk.Data...)
		}
	}
	var payload struct {
		Data []struct {
			ID string `json:"id"`
		} `json:"data"`
	}
	if json.Unmarshal(buf, &payload) != nil {
		return nil
	}
	models := make([]string, 0, len(payload.Data))
	for _, m := range payload.Data {
		if m.ID != "" {
			models = append(models, m.ID)
		}
	}
	return models
}

// registerPluginSettings registers settings sections declared by installed
// packages in their manifest `settings` block.
func registerPluginSettings(setStore *settings.Store) {
	if setStore == nil {
		return
	}
	for _, spec := range update.PluginSettingsSpecs() {
		fields := make([]settings.Field, 0, len(spec.Fields))
		for _, f := range spec.Fields {
			fields = append(fields, settings.Field{
				Key: f.Key, Type: f.Type, Label: f.Label,
				DefaultValue: f.DefaultValue, Help: f.Help, Options: f.Options,
			})
		}
		setStore.RegisterSection(settings.Section{
			ID:          spec.ID,
			Label:       spec.Label,
			Icon:        spec.Icon,
			Order:       int32(spec.Order),
			Description: spec.Description,
			Fields:      fields,
			PluginName:  spec.ID,
		})
	}
}

// registerUpdateSettings contributes the updates panel preferences. The section
// is core-owned (no plugin name) so it is always visible under Settings.
func registerUpdateSettings(setStore *settings.Store) {
	setStore.RegisterSection(settings.Section{
		ID:          "updates",
		Label:       "插件更新",
		Icon:        "cloud",
		Order:       105,
		Description: "更新平台与插件，并配置全局插件源",
		Fields: []settings.Field{
			{
				Key:          "github_proxy",
				Type:         "text",
				Label:        "全局插件源（GitHub 代理）",
				DefaultValue: "",
				Help:         "留空为直连 GitHub；填写加速前缀（如 https://gh-proxy.com）后，源码同步与 0kay-pm 安装/更新都会走该代理。",
			},
		},
	})
}

// applyGitHubProxy pushes the saved mirror into the update package.
func applyGitHubProxy(setStore *settings.Store) {
	if setStore == nil {
		return
	}
	proxy, _ := setStore.GetValues("updates")["github_proxy"].(string)
	update.SetGitHubProxy(proxy)
}

// registerMcpSettings contributes the shared MCP server list. The value is a
// JSON array edited by the WebUI MCP panel and read by Agent / L.I.F.E.
func registerMcpSettings(setStore *settings.Store) {
	setStore.RegisterSection(settings.Section{
		ID:          "mcp",
		Label:       "MCP",
		Icon:        "plug",
		Order:       78,
		Description: "外部 MCP 服务（模型上下文协议）共享配置",
		PluginName:  "mcp",
		Fields: []settings.Field{
			{
				Key:          "servers",
				Type:         "text",
				Label:        "MCP 服务",
				DefaultValue: "[]",
				Help: "JSON 数组；由 WebUI 的 MCP 面板编辑，Agent 与 L.I.F.E 共用。" +
					"内置邮件服务器示例：{\"id\":\"mail\",\"transport\":\"builtin\"," +
					"\"options\":{\"imap\":{\"host\":\"\",\"port\":993,\"ssl\":true,\"user\":\"\",\"password\":\"\"}," +
					"\"smtp\":{\"host\":\"\",\"port\":465,\"secure\":true,\"user\":\"\",\"password\":\"\",\"from\":\"\",\"fromName\":\"0KAY\"}}}",
			},
		},
	})
}

// registerSearchSettings contributes the built-in web-search engine picker.
// Search runs inside Core (no standalone service or port).
func registerSearchSettings(setStore *settings.Store) {
	setStore.RegisterSection(settings.Section{
		ID:          "search",
		Label:       "搜索",
		Icon:        "search",
		Order:       80,
		Description: "内置网页搜索（Core 原生长能力，无需独立服务/端口）",
		Fields: []settings.Field{
			{
				Key:          "engine",
				Type:         "select",
				Label:        "搜索引擎",
				DefaultValue: "cnbing",
				Options:      []string{"cnbing", "bing", "so360", "duckduckgo"},
				Help:         "默认 cnbing（中国区 Bing）；可切换 bing / 360 搜索 / duckduckgo",
			},
		},
	})
}

// loadPluginTokenSecret reads (or creates) the 32-byte HMAC key used to derive
// plugin service tokens.
func loadPluginTokenSecret(dataDir string) ([]byte, error) {
	path := dataDir + "/plugin-token.key"
	if raw, err := os.ReadFile(path); err == nil && len(raw) >= 32 {
		return raw, nil
	}
	secret := make([]byte, 32)
	if _, err := rand.Read(secret); err != nil {
		return nil, err
	}
	if err := os.MkdirAll(dataDir, 0o700); err != nil {
		return nil, err
	}
	if err := os.WriteFile(path, secret, 0o600); err != nil {
		return nil, err
	}
	return secret, nil
}

func startHeartbeatChecker(reg *registry.Registry, cfg *config.Config) {
	ticker := time.NewTicker(cfg.HeartbeatTimeout / 2)
	defer ticker.Stop()

	for range ticker.C {
		reg.TouchBuiltins()
		stale := reg.CheckStalePlugins(cfg.HeartbeatTimeout)
		for _, id := range stale {
			log.Printf("Plugin %s marked as unhealthy (no heartbeat)", id)
		}
	}
}
