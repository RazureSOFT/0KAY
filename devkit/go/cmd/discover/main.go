// Discover the running 0kay Core and write ../surface.json.
//
//	go run ./cmd/discover
//	OKAY_CORE_PORT=8080 go run ./cmd/discover
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"time"

	"okaydevkit"
)

func main() {
	okay := okaydevkit.New(0)
	surface, err := okay.Surface()
	if err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
	surface["generated_at"] = time.Now().Format(time.RFC3339)

	data, err := json.MarshalIndent(surface, "", "  ")
	if err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}
	if err := os.WriteFile("../surface.json", data, 0o644); err != nil {
		fmt.Fprintln(os.Stderr, "error:", err)
		os.Exit(1)
	}

	health := surface["health"].(okaydevkit.Core)
	plugins := surface["plugins"].([]okaydevkit.Plugin)
	fmt.Printf("0kay Core at %s\n", okay.BaseURL)
	fmt.Printf("  status:  %s  healthy=%d plugins=%d\n", health.Status, health.Healthy, health.Plugins)
	fmt.Printf("  settings sections: %d\n", len(surface["settings_sections"].([]map[string]any)))
	fmt.Printf("  plugins: %d, wrote ../surface.json\n", len(plugins))
}
