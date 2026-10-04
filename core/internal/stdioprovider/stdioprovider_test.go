package stdioprovider

import (
	"context"
	"strings"
	"testing"
	"time"
)

func TestSlowConsumerReceivesEveryChunk(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()
	req := &pendingReq{ready: make(chan struct{}), chunks: make(chan Chunk, 4), ctx: ctx}
	c := &child{pending: map[string]*pendingReq{"test": req}}
	wire := strings.Repeat("{\"id\":\"test\",\"type\":\"chunk\",\"data\":\"x\"}\n", 300) + "{\"id\":\"test\",\"type\":\"end\"}\n"
	done := make(chan struct{})
	go func() { c.readLoop(strings.NewReader(wire)); close(done) }()
	count := 0
	for chunk := range req.chunks {
		if chunk.Err != nil {
			t.Fatal(chunk.Err)
		}
		count++
		if count%20 == 0 {
			time.Sleep(time.Millisecond)
		}
	}
	if count != 300 {
		t.Fatalf("got %d chunks", count)
	}
	<-done
}

func TestCancellationUnblocksBackpressure(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	req := &pendingReq{ready: make(chan struct{}), chunks: make(chan Chunk, 1), ctx: ctx}
	c := &child{pending: map[string]*pendingReq{"test": req}}
	done := make(chan struct{})
	go func() {
		c.readLoop(strings.NewReader(strings.Repeat("{\"id\":\"test\",\"type\":\"chunk\",\"data\":\"x\"}\n", 10)))
		close(done)
	}()
	cancel()
	select {
	case <-done:
	case <-time.After(time.Second):
		t.Fatal("reader remained blocked")
	}
}

func TestChildEOFIsAnErrorNotSuccessfulCompletion(t *testing.T) {
	req := &pendingReq{ready: make(chan struct{}), chunks: make(chan Chunk, 1), ctx: context.Background()}
	c := &child{pending: map[string]*pendingReq{"test": req}}
	c.readLoop(strings.NewReader(""))
	if chunk := <-req.chunks; chunk.Err == nil {
		t.Fatal("EOF was hidden")
	}
}
