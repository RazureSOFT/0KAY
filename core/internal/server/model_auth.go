package server

import "os"

func modelServiceToken() string {
	if token := os.Getenv("MOCR_GRPC_TOKEN"); token != "" {
		return token
	}
	return os.Getenv("CORE_API_TOKEN")
}
