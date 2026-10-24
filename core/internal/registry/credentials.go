package registry

import "context"

type ServiceTokenCredentials struct {
	token string
}

func NewServiceTokenCredentials(token string) ServiceTokenCredentials {
	return ServiceTokenCredentials{token: token}
}

func (c ServiceTokenCredentials) GetRequestMetadata(ctx context.Context, uri ...string) (map[string]string, error) {
	if c.token == "" {
		return nil, nil
	}
	return map[string]string{"authorization": "Bearer " + c.token}, nil
}

func (c ServiceTokenCredentials) RequireTransportSecurity() bool { return false }
