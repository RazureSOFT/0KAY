package register

import (
	"context"
	"encoding/json"
	"log"
	"os"
	"time"

	corev1 "0kay/gen/core/v1"
	pluginv1 "0kay/gen/plugin/v1"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

// Options configures mocr plugin registration with Core.
type Options struct {
	CoreAddress      string
	MocrAddress      string
	PluginName       string
	Version          string
	Capabilities     []string
	SettingsSections []*pluginv1.SettingsSection
	HeartbeatEvery   time.Duration
}

// ManifestVersion reads the plugin version from manifest.json in the working
// directory, falling back when the manifest is missing (dev builds, tests).
func ManifestVersion(fallback string) string {
	data, err := os.ReadFile("manifest.json")
	if err != nil {
		return fallback
	}
	var manifest struct {
		Version string `json:"version"`
	}
	if err := json.Unmarshal(data, &manifest); err != nil || manifest.Version == "" {
		return fallback
	}
	return manifest.Version
}

// Start registers mocr as a plugin and keeps heartbeating until ctx is done.
// Non-blocking; runs in background goroutines.
func Start(ctx context.Context, opts Options) {
	if opts.CoreAddress == "" {
		opts.CoreAddress = "localhost:50051"
	}
	if opts.MocrAddress == "" {
		opts.MocrAddress = "localhost:50052"
	}
	if opts.PluginName == "" {
		opts.PluginName = "mocr"
	}
	if opts.Version == "" {
		opts.Version = ManifestVersion("0.1.0")
	}
	if len(opts.Capabilities) == 0 {
		opts.Capabilities = []string{"mocr"}
	}
	if opts.HeartbeatEvery <= 0 {
		opts.HeartbeatEvery = 10 * time.Second
	}

	go func() {
		conn, err := grpc.NewClient(opts.CoreAddress, grpc.WithTransportCredentials(insecure.NewCredentials()))
		if err != nil {
			log.Printf("[mocr-register] dial core %s: %v", opts.CoreAddress, err)
			return
		}
		defer conn.Close()

		client := corev1.NewPluginServiceClient(conn)
		pluginID := ""

		register := func() bool {
			cctx, cancel := context.WithTimeout(ctx, 5*time.Second)
			defer cancel()
			resp, err := client.Register(cctx, &corev1.RegisterRequest{
				PluginInfo: &pluginv1.PluginInfo{
					Name:        opts.PluginName,
					Version:     opts.Version,
					Description: "mocr - model selector / multi-provider LLM gateway",
					Author:      "0kay",
					PluginType:  pluginv1.PluginType_PLUGIN_TYPE_SERVICE,
				},
				Capabilities:     opts.Capabilities,
				Address:          opts.MocrAddress,
				SettingsSections: opts.SettingsSections,
			})
			if err != nil {
				log.Printf("[mocr-register] register failed: %v", err)
				return false
			}
			if !resp.Success {
				log.Printf("[mocr-register] rejected: %s", resp.Message)
				return false
			}
			pluginID = resp.PluginId
			log.Printf("[mocr-register] registered with Core: plugin_id=%s", pluginID)
			return true
		}

		// Retry register until Core is up or ctx done.
		for pluginID == "" {
			if ctx.Err() != nil {
				return
			}
			if register() {
				break
			}
			select {
			case <-ctx.Done():
				return
			case <-time.After(2 * time.Second):
			}
		}

		// Heartbeat loop; re-register if Core restarts (unknown id).
		t := time.NewTicker(opts.HeartbeatEvery)
		defer t.Stop()
		for {
			select {
			case <-ctx.Done():
				return
			case <-t.C:
				if pluginID == "" {
					if !register() {
						continue
					}
				}
				cctx, cancel := context.WithTimeout(ctx, 3*time.Second)
				resp, err := client.Heartbeat(cctx, &corev1.HeartbeatRequest{
					PluginId:    pluginID,
					Status:      corev1.PluginStatus_PLUGIN_STATUS_HEALTHY,
					ActiveTasks: 0,
				})
				cancel()
				if err != nil || !resp.Ok {
					pluginID = ""
				}
			}
		}
	}()
}
