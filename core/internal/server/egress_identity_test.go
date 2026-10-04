package server

import (
	"0kay/core/internal/registry"
	corev1 "0kay/gen/core/v1"
	pluginv1 "0kay/gen/plugin/v1"
	"context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestEgressBindsIdentityToServiceToken(t *testing.T) {
	upstream := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) { _, _ = w.Write([]byte("ok")) }))
	defer upstream.Close()
	reg := registry.NewRegistry()
	reg.SetSecret([]byte("test-secret"))
	reg.SetTrusted([]string{"webui"})
	id, _ := reg.Register(&pluginv1.PluginInfo{Name: "webui"}, nil, "")
	other, _ := reg.Register(&pluginv1.PluginInfo{Name: "restricted"}, nil, "")
	s := &CoreServiceServer{registry: reg}
	for _, token := range []string{"", "invalid", reg.Token(other)} {
		ctx := metadata.NewIncomingContext(context.Background(), metadata.Pairs("authorization", "Bearer "+token))
		_, err := s.Egress(ctx, &corev1.EgressRequest{PluginId: id, Url: upstream.URL})
		if status.Code(err) != codes.Unauthenticated {
			t.Fatalf("unexpected error: %v", err)
		}
	}
	ctx := metadata.NewIncomingContext(context.Background(), metadata.Pairs("authorization", "Bearer "+reg.Token(id)))
	result, err := s.Egress(ctx, &corev1.EgressRequest{PluginId: id, Url: upstream.URL})
	if err != nil || result.Status != 200 {
		t.Fatalf("authenticated egress: %v %v", result, err)
	}
	ctx = metadata.NewIncomingContext(context.Background(), metadata.Pairs("authorization", "Bearer "+reg.Token(other)))
	result, err = s.Egress(ctx, &corev1.EgressRequest{PluginId: other, Url: upstream.URL})
	if err != nil || result.Error == "" {
		t.Fatalf("allowlist lost: %v %v", result, err)
	}
}
