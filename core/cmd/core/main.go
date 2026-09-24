package main

import (
	"context"
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
	"0kay/core/internal/providers"
	"0kay/core/internal/registry"
	"0kay/core/internal/server"
	"0kay/core/internal/settings"
	corev1 "0kay/gen/core/v1"
	pluginv1 "0kay/gen/plugin/v1"

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

	// Create gRPC server
	grpcServer := grpc.NewServer()

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

	// Create HTTP gateway
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

	// Create HTTP server
	httpServer := &http.Server{
		Addr:    cfg.HTTPAddr(),
		Handler: gw.Handler(),
	}

	// Built-in plugins managed by Core (WebUI + local SearXNG when present)
	registerBuiltins(reg, setStore)

	// Start heartbeat checker
	go startHeartbeatChecker(reg, cfg)

	// Graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		sigCh := make(chan os.Signal, 1)
		signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
		<-sigCh
		fmt.Println("\nShutting down...")

		// Stop HTTP server
		httpServer.Shutdown(context.Background())

		// Stop gRPC server
		grpcServer.GracefulStop()

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
		Version:     "0.1.0",
		Description: "0kay WebUI - Vue3 frontend adapter",
		Author:      "0kay",
		PluginType:  pluginv1.PluginType_PLUGIN_TYPE_ADAPTER,
	}, []string{"webui"}, webuiAddr); err != nil {
		log.Printf("register webui builtin: %v", err)
	}

	// Optional: local SearXNG (searxng service) if enabled
	if os.Getenv("SEARXNG_ENABLED") == "1" || os.Getenv("SEARXNG_URL") != "" {
		searxAddr := os.Getenv("SEARXNG_URL")
		if searxAddr == "" {
			searxAddr = "http://127.0.0.1:8888"
		}
		if _, err := reg.RegisterBuiltin(&pluginv1.PluginInfo{
			Name:        "searxng",
			Version:     "0.1.0",
			Description: "SearXNG meta-search engine (local)",
			Author:      "0kay",
			PluginType:  pluginv1.PluginType_PLUGIN_TYPE_TOOL,
		}, []string{"search"}, searxAddr); err != nil {
			log.Printf("register searxng builtin: %v", err)
		}
		registerSearxngSettings(setStore)
	}
}

// registerSearxngSettings contributes the engine picker under Settings.
func registerSearxngSettings(setStore *settings.Store) {
	setStore.RegisterSection(settings.Section{
		ID:          "searxng",
		Label:       "搜索",
		Icon:        "search",
		Order:       80,
		Description: "SearXNG 元搜索引擎设置",
		PluginName:  "searxng",
		Fields: []settings.Field{
			{
				Key:          "engine",
				Type:         "select",
				Label:        "搜索引擎",
				DefaultValue: "cnbing",
				Options:      []string{"cnbing", "bing", "duckduckgo", "marginalia"},
				Help:         "默认 cnbing（中国区 Bing）；可切换 bing / duckduckgo / marginalia",
			},
		},
	})
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
