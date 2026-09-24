package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

// Config holds the Core server configuration.
type Config struct {
	// GRPCPort is the port for the gRPC server.
	GRPCPort int

	// HTTPPort is the port for the HTTP API gateway.
	HTTPPort int

	// HeartbeatTimeout is the duration after which a plugin is considered unhealthy.
	HeartbeatTimeout time.Duration

	// MaxPlugins is the maximum number of plugins allowed.
	MaxPlugins int
}

// DefaultConfig returns a Config with default values.
func DefaultConfig() *Config {
	return &Config{
		GRPCPort:         50051,
		HTTPPort:         8080,
		HeartbeatTimeout: 30 * time.Second,
		MaxPlugins:       100,
	}
}

// LoadConfig loads configuration from environment variables.
func LoadConfig() *Config {
	cfg := DefaultConfig()

	if v := os.Getenv("CORE_GRPC_PORT"); v != "" {
		if port, err := strconv.Atoi(v); err == nil {
			cfg.GRPCPort = port
		}
	}

	if v := os.Getenv("CORE_HTTP_PORT"); v != "" {
		if port, err := strconv.Atoi(v); err == nil {
			cfg.HTTPPort = port
		}
	}

	if v := os.Getenv("CORE_HEARTBEAT_TIMEOUT"); v != "" {
		if d, err := time.ParseDuration(v); err == nil {
			cfg.HeartbeatTimeout = d
		}
	}

	return cfg
}

// GRPCAddr returns the gRPC listen address.
func (c *Config) GRPCAddr() string {
	return fmt.Sprintf(":%d", c.GRPCPort)
}

// HTTPAddr returns the HTTP listen address.
func (c *Config) HTTPAddr() string {
	return fmt.Sprintf(":%d", c.HTTPPort)
}
