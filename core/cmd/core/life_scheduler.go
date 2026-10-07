package main

import (
	"context"
	"time"

	"0kay/core/internal/registry"
	lifev1 "0kay/gen/life/v1"
	"0kay/obs"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

// schedLog tags the LIFE heartbeat scheduler's records. The tickers fire
// unattended, so a failure here is invisible unless it is logged.
var schedLog = obs.Component("life-scheduler")

// startLifeScheduler drives L.I.F.E's periodic events so it reinforces memory,
// ticks circadian state and can autonomously plan what to do next. Without this
// the OnScheduledEvent RPC was never called and LIFE stayed purely reactive.
func startLifeScheduler(ctx context.Context, reg *registry.Registry) {
	idle := time.NewTicker(20 * time.Minute)
	hourly := time.NewTicker(time.Hour)
	daily := time.NewTicker(24 * time.Hour)
	defer idle.Stop()
	defer hourly.Stop()
	defer daily.Stop()

	send := func(event lifev1.ScheduledEventType) {
		lifes := reg.GetPluginsByCapability("life")
		if len(lifes) == 0 || lifes[0].Address == "" {
			return
		}
		conn, err := grpc.NewClient(
			lifes[0].Address,
			grpc.WithTransportCredentials(insecure.NewCredentials()),
			grpc.WithPerRPCCredentials(registry.NewServiceTokenCredentials(reg.Token(lifes[0].PluginID))),
		)
		if err != nil {
			return
		}
		defer conn.Close()
		callCtx, cancel := context.WithTimeout(ctx, 45*time.Second)
		defer cancel()
		if _, err := lifev1.NewLifeServiceClient(conn).OnScheduledEvent(callCtx, &lifev1.OnScheduledEventRequest{EventType: event}); err != nil {
			schedLog.ErrorContext(callCtx, "scheduled event failed", "event", event.String(), "err", err)
		}
	}

	for {
		select {
		case <-ctx.Done():
			return
		case <-idle.C:
			send(lifev1.ScheduledEventType_SCHEDULED_EVENT_TYPE_IDLE_CHECK)
		case <-hourly.C:
			send(lifev1.ScheduledEventType_SCHEDULED_EVENT_TYPE_CIRCADIAN_TICK)
		case <-daily.C:
			send(lifev1.ScheduledEventType_SCHEDULED_EVENT_TYPE_MEMORY_CONSOLIDATION)
		}
	}
}
