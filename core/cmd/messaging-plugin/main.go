// Command messaging-plugin is a runnable reference implementation of a 0KAY
// messaging plugin. It exercises all three sides of the chat-message bus so a
// plugin author has something that actually connects:
//
//  1. Listens   — SubscribeMessages, logging every message it is allowed to see
//  2. Sends     — replies in the conversation it just saw, via SendMessage
//  3. Gates     — vetoes messages containing a configured word, so L.I.F.E
//     never answers them (the plugin owns those instead)
//
// It also serves plugin.v1.MessageService because Core calls DecideInbound on
// it. SendMessage/ListAdapters are implemented as thin forwards so the file
// shows the whole surface in one place; a plugin that only wants to consume can
// leave them Unimplemented.
//
// Run Core first, then:
//
//	go run ./cmd/messaging-plugin -deny 广告 -reply "（示例插件已收到）"
//
// Watch Core's console for the subscription line, and GET /api/messaging to see
// the bus state.
package main

import (
	"context"
	"flag"
	"fmt"
	"io"
	"log"
	"net"
	"os"
	"strings"
	"time"

	corev1 "0kay/gen/core/v1"
	pluginv1 "0kay/gen/plugin/v1"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"google.golang.org/grpc/metadata"
)

const pluginName = "messaging-plugin"

// messagePlugin serves plugin.v1.MessageService and holds the plugin's state.
type messagePlugin struct {
	pluginv1.UnimplementedMessageServiceServer

	core corev1.CoreServiceClient
	// denyWords are the substrings that make this plugin veto a message.
	denyWords []string
	// reply, when non-empty, is sent back into any conversation the plugin
	// sees a wake message in.
	reply string
	// token is the service token Core issued at registration; every call back
	// to Core must present it.
	token string
}

// DecideInbound is the arbitration hook. Returning "deny" stops L.I.F.E from
// processing the message — this plugin is taking responsibility for it.
func (p *messagePlugin) DecideInbound(_ context.Context, req *pluginv1.DecideInboundRequest) (*pluginv1.DecideInboundResponse, error) {
	text := req.GetMessage().GetText()
	for _, word := range p.denyWords {
		if word != "" && strings.Contains(text, word) {
			log.Printf("gate: vetoing %s (matched %q)", req.GetMessage().GetConversation(), word)
			return &pluginv1.DecideInboundResponse{
				Action: "deny",
				Reason: "matched the plugin's blocklist word " + word,
			}, nil
		}
	}
	// Abstain: no opinion, so the message's own wake verdict stands.
	return &pluginv1.DecideInboundResponse{Action: "abstain"}, nil
}

// ListAdapters is empty: this plugin consumes an adapter, it does not drive
// one. Returning an empty list (rather than Unimplemented) keeps Core's
// enumeration cheap and explicit.
func (p *messagePlugin) ListAdapters(context.Context, *pluginv1.ListAdaptersRequest) (*pluginv1.ListAdaptersResponse, error) {
	return &pluginv1.ListAdaptersResponse{}, nil
}

// SendMessage forwards to Core so the plugin speaks through whatever adapter
// owns the conversation, rather than needing its own platform connection.
func (p *messagePlugin) SendMessage(ctx context.Context, req *pluginv1.SendMessageRequest) (*pluginv1.SendMessageResponse, error) {
	resp, err := p.core.SendMessage(p.authed(ctx), &corev1.SendMessageRequest{
		CallerId:     pluginName,
		AdapterId:    req.GetAdapterId(),
		Conversation: req.GetConversation(),
		Text:         req.GetText(),
	})
	if err != nil {
		return nil, err
	}
	return &pluginv1.SendMessageResponse{
		Success:   resp.GetSuccess(),
		MessageId: resp.GetMessageId(),
		Error:     resp.GetError(),
	}, nil
}

// authed attaches the service token Core issued at registration. Without it
// Core answers Unauthenticated — the token is what stops a plugin from acting
// as another just by naming itself.
func (p *messagePlugin) authed(ctx context.Context) context.Context {
	if p.token == "" {
		return ctx
	}
	return metadata.AppendToOutgoingContext(ctx, "authorization", "Bearer "+p.token)
}

func main() {
	coreAddress := flag.String("core", "localhost:50051", "Core gRPC address")
	denyFlag := flag.String("deny", "广告", "comma-separated substrings this plugin vetoes")
	reply := flag.String("reply", "", "text to send back into conversations with wake messages")
	flag.Parse()

	var denyWords []string
	for _, word := range strings.Split(*denyFlag, ",") {
		if word = strings.TrimSpace(word); word != "" {
			denyWords = append(denyWords, word)
		}
	}

	// Serve MessageService on a loopback port so Core can call DecideInbound.
	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		log.Fatalf("listen: %v", err)
	}
	address := listener.Addr().String()
	server := grpc.NewServer()

	conn, err := grpc.NewClient(*coreAddress, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("connect to Core: %v", err)
	}
	defer conn.Close()

	plugin := &messagePlugin{
		core:      corev1.NewCoreServiceClient(conn),
		denyWords: denyWords,
		reply:     *reply,
	}
	pluginv1.RegisterMessageServiceServer(server, plugin)
	go func() {
		if err := server.Serve(listener); err != nil {
			log.Fatalf("serve: %v", err)
		}
	}()
	defer server.Stop()

	// Register. The permissions block is what Core enforces: without it this
	// plugin could neither read nor send, and the gate would never be consulted.
	registered, err := corev1.NewPluginServiceClient(conn).Register(context.Background(), &corev1.RegisterRequest{
		PluginInfo: &pluginv1.PluginInfo{
			Name:        pluginName,
			Version:     "0.1.0",
			Description: "Reference messaging plugin: subscribes, sends and gates",
			Author:      "0kay",
			PluginType:  pluginv1.PluginType_PLUGIN_TYPE_MESSAGING,
			Permissions: &pluginv1.PluginPermission{
				Messages: &pluginv1.PluginMessages{
					// "all" so the gate also sees messages the wake rule would
					// have skipped and can force them. "wake" would be the
					// privacy-minimal choice for a pure observer.
					ReadMode:     "all",
					ReadAdapters: []string{"*"},
					SendAdapters: []string{"*"},
					Gate:         true,
					GateOnError:  "abstain",
				},
			},
		},
		Capabilities: []string{"messaging"},
		Address:      address,
	})
	if err != nil {
		log.Fatalf("register: %v", err)
	}
	if !registered.GetSuccess() {
		log.Fatalf("Core refused registration: %s", registered.GetMessage())
	}
	plugin.token = registered.GetServiceToken()
	fmt.Printf("registered as %s (callback %s)\n", registered.GetPluginId(), address)

	go heartbeat(conn, registered.GetPluginId())
	subscribe(plugin)
}

// heartbeat keeps the plugin healthy in Core's registry. A plugin that stops
// heartbeating is eventually dropped, which also releases its bus state.
func heartbeat(conn *grpc.ClientConn, pluginID string) {
	client := corev1.NewPluginServiceClient(conn)
	for {
		time.Sleep(10 * time.Second)
		if _, err := client.Heartbeat(context.Background(), &corev1.HeartbeatRequest{
			PluginId: pluginID,
			Status:   corev1.PluginStatus_PLUGIN_STATUS_HEALTHY,
		}); err != nil {
			log.Printf("heartbeat failed: %v", err)
		}
	}
}

// subscribe opens the inbound stream and handles messages until Core closes it.
func subscribe(plugin *messagePlugin) {
	stream, err := plugin.core.SubscribeMessages(plugin.authed(context.Background()),
		&corev1.SubscribeMessagesRequest{CallerId: pluginName, ReplayLast: 5})
	if err != nil {
		log.Fatalf("subscribe: %v", err)
	}
	fmt.Println("listening for messages (Ctrl-C to stop)")

	for {
		delivery, err := stream.Recv()
		if err == io.EOF {
			fmt.Println("Core closed the stream")
			return
		}
		if err != nil {
			log.Fatalf("stream: %v", err)
		}
		message := delivery.GetMessage()
		fmt.Printf("[%s] %s %s/%s: %s (wake=%v)\n",
			message.GetPlatform(), message.GetAdapterId(),
			message.GetConversation(), message.GetSenderName(),
			message.GetText(), message.GetIsWake())

		if plugin.reply != "" && message.GetIsWake() {
			respond(plugin, message)
		}
	}
}

// respond answers a conversation through Core, which routes the send to the
// adapter that owns it.
func respond(plugin *messagePlugin, message *pluginv1.InboundMessage) {
	resp, err := plugin.core.SendMessage(plugin.authed(context.Background()), &corev1.SendMessageRequest{
		CallerId:     pluginName,
		AdapterId:    message.GetAdapterId(),
		Conversation: message.GetConversation(),
		Text:         plugin.reply,
	})
	if err != nil {
		log.Printf("send failed: %v", err)
		return
	}
	if !resp.GetSuccess() {
		fmt.Fprintf(os.Stderr, "send refused: %s\n", resp.GetError())
		return
	}
	fmt.Printf("replied in %s (message id %s)\n", message.GetConversation(), resp.GetMessageId())
}
