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
				Id:          "mocr",
				Label:       "模型（mocr）",
				Icon:        "cloud",
				Order:       20,
				Description: "mocr 的模型选择策略与运行参数（供应商凭证与模型目录在「供应商」标签）",
				Fields: []*pluginv1.SettingsField{
					{
						Key:          "model_strategy",
						Type:         "select",
						Label:        "模型选择策略",
						DefaultValue: "auto",
						Options:      []string{"auto", "quality", "cost", "pinned"},
						Help:         "auto=按难度与成本自动选型；quality=质量优先（倾向 thinking 模型）；cost=成本优先（用最便宜可用模型）；pinned=只用上面的默认模型（需填默认模型）",
					},
					{
						Key:          "default_model",
						Type:         "text",
						Label:        "默认模型",
						DefaultValue: "",
						Help:         "留空 = 按上面的模型选择策略智能选型；填写后固定使用该模型",
					},
					{
						Key:          "max_retries",
						Type:         "number",
						Label:        "最大重试次数",
						DefaultValue: "2",
						Help:         "供应商瞬时错误（429 / 5xx / 超时）时的同模型重试次数（0-5），失败后才会切换模型",
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
					{
						Key:          "model_prices",
						Type:         "text",
						Label:        "模型价格覆盖",
						DefaultValue: "",
						Help:         "价格由你自己填写，无内置价表。JSON：{\"模型片段\":{\"in\":输入价,\"out\":输出价,\"per_call\":单次价}}，单位 USD/百万 token（per_call = 每次请求固定价）。例：{\"deepseek-flash\":{\"in\":0.14,\"out\":0.28},\"my-model\":{\"per_call\":0.01}}。也兼容旧的 片段:每token价, ...。未填写的模型按模型名粗略估算",
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
