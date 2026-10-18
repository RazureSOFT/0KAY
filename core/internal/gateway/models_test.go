package gateway

import "testing"

func TestCatalogURLAddsVersionOnce(t *testing.T) {
	for _, tc := range []struct{ base, want string }{
		{"https://api.nuwaflux.com", "https://api.nuwaflux.com/v1/models"},
		{"https://api.nuwaflux.com/", "https://api.nuwaflux.com/v1/models"},
		{"https://api.anthropic.com", "https://api.anthropic.com/v1/models"},
		{"https://api.anthropic.com/v1", "https://api.anthropic.com/v1/models"},
		{"https://api.deepseek.com/v1", "https://api.deepseek.com/v1/models"},
		{"http://192.168.1.100:11220/v1", "http://192.168.1.100:11220/v1/models"},
		{"https://host/v1beta", "https://host/v1beta/models"},
	} {
		if got := catalogURL(tc.base); got != tc.want {
			t.Errorf("catalogURL(%q) = %q, want %q", tc.base, got, tc.want)
		}
	}
}
