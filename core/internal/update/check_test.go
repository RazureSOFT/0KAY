package update

import "testing"

func TestReleaseOrdering(t *testing.T) {
	for _, tc := range []struct {
		candidate, current string
		newer              bool
	}{
		{"v0.1.0", "0.1.0", false},
		{"0.2.0", "0.1.9", true},
		{"0.1.0-rc.1", "0.1.0", false},
		{"0.1.0", "0.1.0-rc.1", true},
		{"0.1.0+build.2", "0.1.0", false},
		{"0.1.0-rc.10", "0.1.0-rc.2", true},
	} {
		if got := Newer(tc.candidate, tc.current); got != tc.newer {
			t.Errorf("Newer(%q, %q) = %v", tc.candidate, tc.current, got)
		}
	}
}
