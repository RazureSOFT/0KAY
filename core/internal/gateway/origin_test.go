package gateway

import (
	"net/http/httptest"
	"testing"
)

func TestOriginBoundary(t *testing.T) {
	t.Setenv("WEBUI_PORT", "")
	t.Setenv("CORE_WEBUI_PORT", "")
	t.Setenv("CORE_ALLOWED_ORIGINS", "")
	resetEnvCaches()
	request := httptest.NewRequest("GET", "http://127.0.0.1:8080/api/providers", nil)
	request.Header.Set("Origin", "https://untrusted.example")
	if allowedOrigin(request) {
		t.Fatal("foreign origin accepted")
	}
	request.Header.Set("Origin", "http://localhost:3000")
	if allowedOrigin(request) {
		t.Fatal("default 3000 origin accepted without WEBUI_PORT opt-in")
	}
}

func TestOriginAllowedWebuiPort(t *testing.T) {
	t.Setenv("WEBUI_PORT", "3000")
	t.Setenv("CORE_WEBUI_PORT", "")
	t.Setenv("CORE_ALLOWED_ORIGINS", "")
	resetEnvCaches()
	request := httptest.NewRequest("GET", "http://127.0.0.1:8080/api/providers", nil)
	request.Header.Set("Origin", "http://localhost:3000")
	if !allowedOrigin(request) {
		t.Fatal("local UI on WEBUI_PORT rejected")
	}
	request.Header.Set("Origin", "http://localhost:5173")
	if allowedOrigin(request) {
		t.Fatal("port outside allowlist accepted")
	}
}

func TestOriginAllowedOriginsEnv(t *testing.T) {
	t.Setenv("WEBUI_PORT", "")
	t.Setenv("CORE_WEBUI_PORT", "")
	t.Setenv("CORE_ALLOWED_ORIGINS", "http://localhost:5173")
	resetEnvCaches()
	request := httptest.NewRequest("GET", "http://127.0.0.1:8080/api/providers", nil)
	request.Header.Set("Origin", "http://localhost:5173")
	if !allowedOrigin(request) {
		t.Fatal("CORE_ALLOWED_ORIGINS origin rejected")
	}
}
