package registry

import "context"

// ServiceTokenCredentials is a gRPC PerRPCCredentials that attributes every
// outgoing call to a plugin with the service token Core issued at registration
// (`authorization: Bearer <token>`), the same value the plugin stores from its
// Register response. The receiving plugin validates it with a constant-time
// compare and rejects anything else, so a shared/unauthenticated channel is not
// enough on its own.
type ServiceTokenCredentials struct {
	token string
}

// NewServiceTokenCredentials returns credentials carrying one plugin's token.
// An empty token yields metadata-less calls, which plugins that have not
// configured a token still accept.
func NewServiceTokenCredentials(token string) ServiceTokenCredentials {
	return ServiceTokenCredentials{token: token}
}

// GetRequestMetadata implements grpc.PerRPCCredentials.
func (c ServiceTokenCredentials) GetRequestMetadata(ctx context.Context, uri ...string) (map[string]string, error) {
	if c.token == "" {
		return nil, nil
	}
	return map[string]string{"authorization": "Bearer " + c.token}, nil
}

// RequireTransportSecurity reports whether the channel must be TLS-secured
// before this credential may be attached. Core talks to plugins over loopback
// with insecure credentials by design, so the service token rides an
// unencrypted channel on the assumption that only local processes can observe it.
func (c ServiceTokenCredentials) RequireTransportSecurity() bool { return false }
