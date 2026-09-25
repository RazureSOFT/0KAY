package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"
	"time"

	mocrv1 "0kay/gen/mocr/v1"
	pluginv1 "0kay/gen/plugin/v1"
	"0kay/mocr/internal/register"
	"0kay/mocr/internal/selector"
	"0kay/mocr/internal/server"

	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
)

func main() {
	port := os.Getenv("MOCR_GRPC_PORT")
	if port == "" {
		port = "50052"
	}
	coreAddr := os.Getenv("CORE_ADDRESS")
	if coreAddr == "" {
		coreAddr = "localhost:50051"
	}

	// Initialize selector
	sel := selector.NewSelector()

	// Create gRPC server
	grpcServer := grpc.NewServer()

	// Register service
	mocrSvc := server.NewMocrServiceServer(sel)
	mocrv1.RegisterMocrServiceServer(grpcServer, mocrSvc)

	// Enable reflection
	reflection.Register(grpcServer)

	// Start listener
	bindHost := os.Getenv("MOCR_BIND_HOST")
	if bindHost == "" {
		bindHost = "127.0.0.1"
	}
	listener, err := net.Listen("tcp", bindHost+":"+port)
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	// Graceful shutdown
	ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
	defer stop()

	go func() {
		<-ctx.Done()
		fmt.Println("\nShutting down mocr...")
		grpcServer.GracefulStop()
	}()

	// Register mocr as a Core plugin (capability: mocr) + heartbeat.
	mocrAddr := os.Getenv("MOCR_ADDRESS")
	if mocrAddr == "" {
		mocrAddr = "localhost:" + port
	}
	// mocr owns the Provider settings section (credentials + model catalog + runtime knobs).
	register.Start(ctx, register.Options{
		CoreAddress:  coreAddr,
		MocrAddress:  mocrAddr,
		PluginName:   "mocr",
		Capabilities: []string{"mocr"},
		SettingsSections: []*pluginv1.SettingsSection{
			{Id: "usage", Label: "用量", Icon: "usage", Order: 90, Description: "由 mocr 提供的模型用量统计"},
			{
				Id:          "provider",
				Label:       "供应商",
				Icon:        "cloud",
				Order:       20,
				Description: "AI 供应商凭证、模型目录与 mocr 运行参数",
				Fields: []*pluginv1.SettingsField{
					{
						Key:          "default_model",
						Type:         "text",
						Label:        "默认模型",
						DefaultValue: "",
						Help:         "留空 = 由 Agent 每次通过 ChooseModels 智能选型",
					},
					{
						Key:          "max_retries",
						Type:         "number",
						Label:        "最大重试次数",
						DefaultValue: "2",
						Help:         "供应商瞬时错误时的重试次数",
					},
					{
						Key:          "stream_idle_timeout_sec",
						Type:         "number",
						Label:        "SSE 空闲超时（秒）",
						DefaultValue: "60",
						Help:         "超过 N 秒无数据则关闭流",
					},
					{
						Key:          "auto_switch_model",
						Type:         "bool",
						Label:        "失败/不回复时自动切换模型",
						DefaultValue: "true",
						Help:         "供应商报错或返回空回复时自动换一个模型重试（已发出内容则不重试）",
					},
					{
						Key:          "switch_max_attempts",
						Type:         "number",
						Label:        "最大切换次数",
						DefaultValue: "2",
						Help:         "单次生成最多允许切换几个候选模型（0-5）",
					},
					{
						Key:          "fallback_models",
						Type:         "text",
						Label:        "备选模型",
						DefaultValue: "",
						Help:         "逗号分隔的模型 ID，如 gpt-4o-mini,claude-haiku；留空 = 按供应商目录顺序依次尝试",
					},
				},
			},
		},
		HeartbeatEvery: 10 * time.Second,
	})

	fmt.Printf("mocr gRPC server starting on :%s\n", port)
	if err := grpcServer.Serve(listener); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
