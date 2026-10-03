package server

import (
	"0kay/mocr/internal/register"
	"context"
	"google.golang.org/grpc/metadata"
	"testing"
)

func TestAuthFailClosed(t *testing.T) {
	register.SetIdentity("", "")
	t.Setenv("MOCR_GRPC_TOKEN", "")
	t.Setenv("CORE_API_TOKEN", "")
	if authorize(context.Background()) == nil {
		t.Fatal("empty credentials admitted")
	}
	t.Setenv("MOCR_GRPC_TOKEN", "test-model-secret")
	if authorize(metadata.NewIncomingContext(context.Background(), metadata.Pairs("authorization", "Bearer wrong"))) == nil {
		t.Fatal("wrong token admitted")
	}
	if err := authorize(metadata.NewIncomingContext(context.Background(), metadata.Pairs("authorization", "Bearer test-model-secret"))); err != nil {
		t.Fatal(err)
	}
}
