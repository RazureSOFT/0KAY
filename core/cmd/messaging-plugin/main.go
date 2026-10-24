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

type messagePlugin struct {
	pluginv1.UnimplementedMessageServiceServer

	core      corev1.CoreServiceClient
	denyWords []string
	reply     string
	token     string
}

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
	return &pluginv1.DecideInboundResponse{Action: "abstain"}, nil
}

func (p *messagePlugin) ListAdapters(context.Context, *pluginv1.ListAdaptersRequest) (*pluginv1.ListAdaptersResponse, error) {
	return &pluginv1.ListAdaptersResponse{}, nil
}

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

	registered, err := corev1.NewPluginServiceClient(conn).Register(context.Background(), &corev1.RegisterRequest{
		PluginInfo: &pluginv1.PluginInfo{
			Name:        pluginName,
			Version:     "0.1.0",
			Description: "Reference messaging plugin: subscribes, sends and gates",
			Author:      "0kay",
			PluginType:  pluginv1.PluginType_PLUGIN_TYPE_MESSAGING,
			Permissions: &pluginv1.PluginPermission{
				Messages: &pluginv1.PluginMessages{
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
