package selector

import "testing"

// TestNormalizeDifficultyHintScale pins the translation between the public
// `difficulty_hint` (documented 0..1) and the router's internal 1..5 scale, which
// is the scale `power` is measured on.
//
// The bug this guards: comparing a 0..1 hint against power∈[1,5] directly yields
// thresholds of 0.0..1.0, so the difficulty gate is wide open at every intensity
// and "max" still admits almost everything.
func TestNormalizeDifficultyHintScale(t *testing.T) {
	cases := []struct {
		name string
		hint float64
		want float64
	}{
		// 0 is "no opinion" and must stay 0, so inferSpec leaves the
		// classifier's own difficulty in place.
		{name: "zero is no opinion", hint: 0, want: 0},
		{name: "negative is no opinion", hint: -1, want: 0},
		{name: "off", hint: 0.0, want: 0},
		{name: "low", hint: 0.2, want: 1.8},
		{name: "medium", hint: 0.5, want: 3.0},
		{name: "high", hint: 0.75, want: 4.0},
		{name: "max", hint: 1.0, want: 5.0},
		// Already on the internal scale (the thinking floor passes 4.2).
		{name: "internal scale passes through", hint: 4.2, want: 4.2},
		{name: "internal scale is clamped", hint: 99, want: maxDifficulty},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			if got := normalizeDifficultyHint(tc.hint); got != tc.want {
				t.Fatalf("normalizeDifficultyHint(%v) = %v, want %v", tc.hint, got, tc.want)
			}
		})
	}
}

// TestHintOnlyOverridesWhenActuallySupplied pins that a caller who expresses no
// preference does not overwrite the classifier. Before the default was changed to
// 0, a "no opinion" default of 0.5 arrived as a gate of power >= 3.0 and
// silently disabled the kNN on every unhinted call.
func TestHintOnlyOverridesWhenActuallySupplied(t *testing.T) {
	prompt := "explain how a binary search tree rebalances"

	_, inferred, _ := inferSpec(prompt, nil, 0)
	if inferred <= 0 {
		t.Fatalf("expected the classifier to infer a positive difficulty, got %v", inferred)
	}

	_, withDefault, hits := inferSpec(prompt, nil, 0.5)
	if withDefault != normalizeDifficultyHint(0.5) {
		t.Fatalf("an explicit hint must win: got %v", withDefault)
	}
	var sawExplicit bool
	for _, hit := range hits {
		if hit == "explicit:difficulty" {
			sawExplicit = true
		}
	}
	if !sawExplicit {
		t.Errorf("expected an explicit:difficulty hit, got %v", hits)
	}
}

// TestMaxIntensityActuallyGates pins that "hardest" is a real constraint: the
// rescaled hint must reach the top of the power scale.
func TestMaxIntensityActuallyGates(t *testing.T) {
	if got := normalizeDifficultyHint(1.0); got != maxDifficulty {
		t.Fatalf("max intensity maps to %v, want %v", got, maxDifficulty)
	}
}
