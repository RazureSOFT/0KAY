package gateway

import (
	"context"
	"net"
	"sync"
	"testing"

	"0kay/core/internal/registry"
	lifev1 "0kay/gen/life/v1"
	pluginv1 "0kay/gen/plugin/v1"

	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
)

// recordingLifeServer stands in for the LIFE plugin and remembers the
// `authorization` metadata each call arrived with.
type recordingLifeServer struct {
	lifev1.UnimplementedLifeServiceServer

	mu   sync.Mutex
	auth []string
}

func (s *recordingLifeServer) GetState(ctx context.Context, _ *lifev1.GetStateRequest) (*lifev1.GetStateResponse, error) {
	md, _ := metadata.FromIncomingContext(ctx)
	value := ""
	if values := md.Get("authorization"); len(values) > 0 {
		value = values[0]
	}
	s.mu.Lock()
	s.auth = append(s.auth, value)
	s.mu.Unlock()
	return &lifev1.GetStateResponse{}, nil
}

func (s *recordingLifeServer) tokens() []string {
	s.mu.Lock()
	defer s.mu.Unlock()
	return append([]string(nil), s.auth...)
}

func startFakeLife(t *testing.T) (*recordingLifeServer, string) {
	t.Helper()
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	recorder := &recordingLifeServer{}
	server := grpc.NewServer()
	lifev1.RegisterLifeServiceServer(server, recorder)
	go func() { _ = server.Serve(listener) }()
	t.Cleanup(server.Stop)
	return recorder, listener.Addr().String()
}

// lifeTestGateway registers a LIFE plugin at addr with a token secret in place.
func lifeTestGateway(t *testing.T, addr string) (*Gateway, *registry.Registry) {
	t.Helper()
	reg := registry.NewRegistry()
	reg.SetSecret([]byte("life-dial-test-secret-0123456789"))
	if _, err := reg.Register(&pluginv1.PluginInfo{Name: "life", Version: "1"}, []string{"life"}, addr); err != nil {
		t.Fatalf("register: %v", err)
	}
	return &Gateway{registry: reg}, reg
}

func callState(t *testing.T, g *Gateway, life *registry.PluginInstance) {
	t.Helper()
	conn, err := g.lifeDial(life)
	if err != nil {
		t.Fatalf("lifeDial: %v", err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	if _, err := lifev1.NewLifeServiceClient(conn).GetState(ctx, &lifev1.GetStateRequest{}); err != nil {
		t.Fatalf("GetState: %v", err)
	}
}

func TestLifeDialAttachesServiceToken(t *testing.T) {
	recorder, addr := startFakeLife(t)
	g, reg := lifeTestGateway(t, addr)
	lifes := reg.GetPluginsByCapability("life")
	if len(lifes) != 1 {
		t.Fatalf("registered lifes = %d, want 1", len(lifes))
	}

	callState(t, g, lifes[0])

	want := "Bearer " + reg.Token(lifes[0].PluginID)
	if want == "Bearer " {
		t.Fatal("registry issued an empty token; SetSecret was not applied")
	}
	got := recorder.tokens()
	if len(got) != 1 || got[0] != want {
		t.Fatalf("authorization metadata = %q, want %q", got, want)
	}
}

// The shared `dial` pool is used for Agent/Mocr too, so a connection created
// through it must never carry LIFE's service token.
func TestLifeDialDoesNotLeakTokenIntoSharedPool(t *testing.T) {
	recorder, addr := startFakeLife(t)
	g, _ := lifeTestGateway(t, addr)

	conn, err := g.dial(addr)
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	if _, err := lifev1.NewLifeServiceClient(conn).GetState(ctx, &lifev1.GetStateRequest{}); err != nil {
		t.Fatalf("GetState: %v", err)
	}

	if got := recorder.tokens(); len(got) != 1 || got[0] != "" {
		t.Fatalf("shared connection leaked credentials: %q", got)
	}
}

// ...and the reverse: a token-bearing connection must not be served to a caller
// that went through the shared pool for a different address.
func TestLifeDialKeepsItsOwnCache(t *testing.T) {
	_, addr := startFakeLife(t)
	g, reg := lifeTestGateway(t, addr)
	life := reg.GetPluginsByCapability("life")[0]

	tokenConn, err := g.lifeDial(life)
	if err != nil {
		t.Fatalf("lifeDial: %v", err)
	}
	plainConn, err := g.dial(addr)
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	if tokenConn == plainConn {
		t.Fatal("lifeDial and dial returned the same connection; credentials would be shared across plugins")
	}
	again, err := g.lifeDial(life)
	if err != nil {
		t.Fatalf("lifeDial second call: %v", err)
	}
	if again != tokenConn {
		t.Fatal("lifeDial is not caching; a new token-bearing connection is built per call")
	}
}

func TestLifeDialRejectsMissingAddress(t *testing.T) {
	g, _ := lifeTestGateway(t, "127.0.0.1:1")
	if _, err := g.lifeDial(nil); err == nil {
		t.Fatal("lifeDial(nil) succeeded, want an error")
	}
	if _, err := g.lifeDial(&registry.PluginInstance{PluginID: "x"}); err == nil {
		t.Fatal("lifeDial with an empty address succeeded, want an error")
	}
}

func TestServiceTokenCredentials(t *testing.T) {
	creds := registry.NewServiceTokenCredentials("abc")
	meta, err := creds.GetRequestMetadata(context.Background(), "/life.v1.LifeService/GetState")
	if err != nil {
		t.Fatalf("GetRequestMetadata: %v", err)
	}
	if meta["authorization"] != "Bearer abc" {
		t.Fatalf("authorization = %q, want %q", meta["authorization"], "Bearer abc")
	}
	if creds.RequireTransportSecurity() {
		t.Fatal("RequireTransportSecurity = true; Core's plugin channels are insecure by design")
	}

	empty := registry.NewServiceTokenCredentials("")
	meta, err = empty.GetRequestMetadata(context.Background())
	if err != nil {
		t.Fatalf("GetRequestMetadata: %v", err)
	}
	if meta != nil {
		t.Fatalf("empty token produced metadata %v, want none", meta)
	}
}
