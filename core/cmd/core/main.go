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

	reg := registry.NewRegistry()

	dataDir := os.Getenv("CORE_DATA_DIR")
	if dataDir == "" {
		dataDir = "data"
	}
	provStore := providers.NewStore(dataDir + "/providers.json")
	setStore := settings.NewStore(dataDir + "/settings.json")

	if secret, err := loadPluginTokenSecret(dataDir); err != nil {
		log.Printf("plugin token secret: %v (plugin identity disabled)", err)
	} else {
		reg.SetSecret(secret)
	}
	reg.SetRegistrationToken(os.Getenv("CORE_PLUGIN_REGISTRATION_TOKEN"))
	reg.SetTrusted([]string{
		"webui", "agent", "life", "mocr", "mcp", "minecraft",
		"pm", "0kay-pm", "fluentui", "liquidglass", "free-model", "marketplace",
	})

	registerUpdateSettings(setStore)
	applyGitHubProxy(setStore)

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

	pluginSvc := server.NewPluginServiceServer(reg, setStore)
	coreSvc := server.NewCoreServiceServer(reg, dataDir)
	coreSvc.SetProviderStore(provStore)

	corev1.RegisterPluginServiceServer(grpcServer, pluginSvc)
	corev1.RegisterCoreServiceServer(grpcServer, coreSvc)

	reflection.Register(grpcServer)

	grpcListener, err := net.Listen("tcp", cfg.GRPCAddr())
	if err != nil {
		log.Fatalf("Failed to listen gRPC: %v", err)
	}

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
	handler := gateway.Public(pairs.HTTP(gw.Handler()))

	httpServer := &http.Server{
		Addr:              cfg.HTTPAddr(),
		Handler:           handler,
		ReadHeaderTimeout: 10 * time.Second,
		IdleTimeout:       120 * time.Second,
	}

	registerBuiltins(reg, setStore)

	stdioRunner := stdioprovider.NewRunner()
	gw.SetStdioRunner(stdioRunner)
	registerStdioProviders(stdioRunner, provStore, cfg.HTTPAddr())

	registerPluginSettings(setStore)

	go startHeartbeatChecker(reg, cfg)

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

		shutdownCtx, shutdownCancel := context.WithTimeout(context.Background(), 10*time.Second)
		if err := httpServer.Shutdown(shutdownCtx); err != nil {
			log.Printf("HTTP shutdown: %v", err)
			_ = httpServer.Close()
		}
		shutdownCancel()

		grpcServer.GracefulStop()

		stdioRunner.Stop()

		cancel()
	}()

	go func() {
		fmt.Printf("Core gRPC server starting on %s\n", cfg.GRPCAddr())
		if err := grpcServer.Serve(grpcListener); err != nil {
			log.Fatalf("gRPC serve failed: %v", err)
		}
	}()

	fmt.Printf("Core HTTP gateway starting on %s\n", cfg.HTTPAddr())
	if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("HTTP serve failed: %v", err)
	}

	_ = ctx
}

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

	registerMcpSettings(setStore)

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

	registerSearchSettings(setStore)
	registerWorkspaceSettings(setStore)
}

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

func applyGitHubProxy(setStore *settings.Store) {
	if setStore == nil {
		return
	}
	proxy, _ := setStore.GetValues("updates")["github_proxy"].(string)
	update.SetGitHubProxy(proxy)
}

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

func registerWorkspaceSettings(setStore *settings.Store) {
	setStore.RegisterSection(settings.Section{
		ID:          "workspace",
		Label:       "工作区",
		Icon:        "folder",
		Order:       12,
		Description: "额外允许 Agent 与 Git 面板访问的目录",
		Fields: []settings.Field{
			{
				Key:          "allowed_roots",
				Type:         "text",
				Label:        "额外允许的目录",
				DefaultValue: "",
				Help:         "逗号或换行分隔，例如 D:/mio；留空则只允许默认范围。",
			},
		},
	})
}

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
	timeout := cfg.HeartbeatTimeout
	if timeout <= 0 {
		timeout = 30 * time.Second
	}
	period := timeout / 2
	if period <= 0 {
		period = 15 * time.Second
	}
	ticker := time.NewTicker(period)
	defer ticker.Stop()

	for range ticker.C {
		reg.TouchBuiltins()
		stale := reg.CheckStalePlugins(timeout)
		for _, id := range stale {
			log.Printf("Plugin %s marked as unhealthy (no heartbeat)", id)
		}
	}
}
