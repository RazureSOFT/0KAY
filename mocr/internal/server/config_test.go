package server

import (
	"testing"

	"0kay/mocr/internal/providers"
)

func TestRuntimePriceOverridesSnapshot(t *testing.T) {
	rtMu.Lock()
	rtVal.PriceOverrides = map[string]providers.PriceSpec{"m": {InPerMillion: 1}}
	rtMu.Unlock()

	out := currentRuntime()
	if out.PriceOverrides["m"].InPerMillion != 1 {
		t.Fatal("override was not copied into the snapshot")
	}
	// Mutating the snapshot must not alias the stored map.
	out.PriceOverrides["m"] = providers.PriceSpec{}
	if currentRuntime().PriceOverrides["m"].InPerMillion != 1 {
		t.Fatal("snapshot aliased the stored override map")
	}
}
