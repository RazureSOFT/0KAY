package main

import (
	"context"
	"fmt"
	"log"
	"time"

	corev1 "0kay/gen/core/v1"
	pluginv1 "0kay/gen/plugin/v1"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	// Connect to Core gRPC server
	conn, err := grpc.NewClient("localhost:50051", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("Failed to connect: %v", err)
	}
	defer conn.Close()

	// Create plugin client
	client := corev1.NewPluginServiceClient(conn)

	// Register plugin
	registerResp, err := client.Register(context.Background(), &corev1.RegisterRequest{
		PluginInfo: &pluginv1.PluginInfo{
			Name:        "echo-plugin",
			Version:     "0.1.0",
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

	// Send heartbeats
	for i := 0; i < 3; i++ {
		heartbeatResp, err := client.Heartbeat(context.Background(), &corev1.HeartbeatRequest{
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
