package server

import (
	"0kay/mocr/internal/register"
	"context"
	"crypto/subtle"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
	"os"
	"strings"
)

func authorize(ctx context.Context) error {
	md, _ := metadata.FromIncomingContext(ctx)
	values := md.Get("authorization")
	_, identity := register.Identity()
	if len(values) == 1 {
		actual := strings.TrimPrefix(values[0], "Bearer ")
		for _, token := range []string{identity, os.Getenv("MOCR_GRPC_TOKEN"), os.Getenv("CORE_API_TOKEN")} {
			if token != "" && subtle.ConstantTimeCompare([]byte(actual), []byte(token)) == 1 {
				return nil
			}
		}
	}
	return status.Error(codes.Unauthenticated, "model service token required")
}

func AuthUnary(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, next grpc.UnaryHandler) (interface{}, error) {
	if err := authorize(ctx); err != nil {
		return nil, err
	}
	return next(ctx, req)
}

func AuthStream(srv interface{}, stream grpc.ServerStream, info *grpc.StreamServerInfo, next grpc.StreamHandler) error {
	if err := authorize(stream.Context()); err != nil {
		return err
	}
	return next(srv, stream)
}
