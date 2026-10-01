package search

import "testing"

func TestStripTagsAndTerms(t *testing.T) {
	if got := stripTags("<b>Hello</b> &amp; <i>world</i>"); got != "Hello & world" {
		t.Fatalf("stripTags = %q", got)
	}
	terms := queryTerms("How to deploy a Go service, with Docker")
	// stopwords removed, deduped, lowercased, order preserved.
	want := []string{"deploy", "go", "service", "docker"}
	if len(terms) != len(want) {
		t.Fatalf("terms = %v, want %v", terms, want)
	}
	for i := range want {
		if terms[i] != want[i] {
			t.Fatalf("terms = %v, want %v", terms, want)
		}
	}
}

func TestAnchorMatchAndScore(t *testing.T) {
	terms := queryTerms("go concurrency")
	if !anchorMatch("learning go concurrency patterns", terms) {
		t.Fatal("expected anchor match")
	}
	if anchorMatch("python asyncio tutorial", terms) {
		t.Fatal("expected anchor miss")
	}
	if anchorMatch("anything", queryTerms("the and of")) != true {
		t.Fatal("stopword-only query should pass everything")
	}
	if got := Score("go concurrency in practice", "go concurrency"); got != 2 {
		t.Fatalf("Score = %d, want 2", got)
	}
}

func TestNormalizeEngine(t *testing.T) {
	if normalizeEngine("bing") != "bing" {
		t.Fatal("bing should stay")
	}
	if normalizeEngine("nonsense") != "cnbing" {
		t.Fatal("unknown engine -> cnbing default")
	}
}
