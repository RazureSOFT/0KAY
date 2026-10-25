package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	corev1 "0kay/gen/core/v1"
	pluginv1 "0kay/gen/plugin/v1"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

func main() {
	conn, err := grpc.NewClient("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}
	defer conn.Close()

	client := corev1.NewPluginServiceClient(conn)

	registerCtx := context.Background()
	if token := strings.TrimSpace(os.Getenv("CORE_PLUGIN_REGISTRATION_TOKEN")); token != "" {
		registerCtx = metadata.AppendToOutgoingContext(registerCtx, "x-0kay-registration-token", token)
	}
	registerResp, err := client.Register(registerCtx, &corev1.RegisterRequest{
		PluginInfo: &pluginv1.PluginInfo{
			Name:        "echo-plugin",
			Version:     "0.1.2",
			Description: "A simple echo plugin for testing",
			Author:      "0kay",
			PluginType:  pluginv1.PluginType_PLUGIN_TYPE_TOOL,
		},
		Capabilities: []string{"echo", "test"},
	})
	if err != nil {
		log.Fatalf("Register failed: %v", err)
	}

	fmt.Printf("Registered with ID: %s\n", registerResp.PluginId)
	fmt.Printf("Success: %v\n", registerResp.Success)
	fmt.Printf("Message: %s\n", registerResp.Message)

	heartbeatCtx := context.Background()
	if registerResp.ServiceToken != "" {
		heartbeatCtx = metadata.AppendToOutgoingContext(heartbeatCtx, "authorization", "Bearer "+registerResp.ServiceToken)
	}
	for i := 0; i < 3; i++ {
		heartbeatResp, err := client.Heartbeat(heartbeatCtx, &corev1.HeartbeatRequest{
			PluginId:    registerResp.PluginId,
			Status:      corev1.PluginStatus_PLUGIN_STATUS_HEALTHY,
			ActiveTasks: 0,
		})
		if err != nil {
			log.Fatalf("Heartbeat failed: %v", err)
		}

		fmt.Printf("Heartbeat %d: ok=%v, shutdown=%v\n", i+1, heartbeatResp.Ok, heartbeatResp.ShutdownSignal)

		time.Sleep(2 * time.Second)
	}

	fmt.Println("Echo plugin completed successfully!")
}
