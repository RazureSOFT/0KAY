package config

import (
	"fmt"
	"os"
	"strconv"
	"time"
)

type Config struct {
	GRPCPort int

	HTTPPort int

	HeartbeatTimeout time.Duration

	MaxPlugins int
}

func DefaultConfig() *Config {
	return &Config{
		GRPCPort:         50051,
		HTTPPort:         8080,
		HeartbeatTimeout: 30 * time.Second,
		MaxPlugins:       100,
	}
}

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
		if d, err := time.ParseDuration(v); err == nil && d > 0 {
			cfg.HeartbeatTimeout = d
		}
	}

	return cfg
}

func (c *Config) GRPCAddr() string {
	return fmt.Sprintf("%s:%d", bindHost(), c.GRPCPort)
}

func (c *Config) HTTPAddr() string {
	return fmt.Sprintf("%s:%d", bindHost(), c.HTTPPort)
}

func bindHost() string {
	if host := os.Getenv("CORE_BIND_HOST"); host != "" {
		return host
	}
	return "127.0.0.1"
}
