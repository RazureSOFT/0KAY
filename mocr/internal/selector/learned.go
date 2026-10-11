package selector

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"regexp"
	"sort"
	"strings"
	"sync"
	"unicode/utf8"
)

// Learned intent inference: char 3-gram + kNN over the embedded training set,
// ported from jev_router/router_learned.py. Zero dependencies, CPU-only:
// similar tasks map to similar (capability tags, difficulty). A confidence
// guard (minSim) gives up on unseen task shapes so routing falls back to the
// keyword heuristic instead of guessing.

const (
	knnNGram  = 3
	knnK      = 5
	knnMinSim = 0.20
)

type knnItem struct {
	grams      map[string]struct{}
	tags       map[string]struct{}
	difficulty float64
}

type learnedIndex struct {
	items []knnItem
}

var (
	learnedOnce sync.Once
	learnedRef  *learnedIndex
)

func loadLearned() *learnedIndex {
	learnedOnce.Do(func() {
		idx := &learnedIndex{}
		scanner := bufio.NewScanner(bytes.NewReader(trainJSONL))
		scanner.Buffer(make([]byte, 0, 1024*1024), 8*1024*1024)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" {
				continue
			}
			var row struct {
				State      string   `json:"state"`
				Text       string   `json:"text"`
				Tags       []string `json:"_tags"`
				Difficulty float64  `json:"_difficulty"`
			}
			if err := json.Unmarshal([]byte(line), &row); err != nil {
				continue
			}
			state := row.State
			if state == "" {
				state = row.Text
			}
			grams := charGrams(state, knnNGram)
			if len(grams) == 0 {
				continue
			}
			tags := make(map[string]struct{}, len(row.Tags))
			for _, t := range row.Tags {
				tags[t] = struct{}{}
			}
			d := row.Difficulty
			if d == 0 {
				d = 1.0
			}
			idx.items = append(idx.items, knnItem{grams: grams, tags: tags, difficulty: d})
		}
		learnedRef = idx
	})
	return learnedRef
}

var wsRe = regexp.MustCompile(`\s+`)

// charGrams returns the set of character n-grams over runes (whitespace runs
// collapsed), so mixed zh/en signals like "通读/800页/竞赛题" are captured.
func charGrams(text string, n int) map[string]struct{} {
	s := wsRe.ReplaceAllString(strings.TrimSpace(text), " ")
	out := map[string]struct{}{}
	if s == "" {
		return out
	}
	runes := []rune(s)
	if len(runes) < n {
		out[s] = struct{}{}
		return out
	}
	for i := 0; i+n <= len(runes); i++ {
		out[string(runes[i:i+n])] = struct{}{}
	}
	return out
}

// predict returns (tags, difficulty, hit-label, ok). ok=false means "never
// saw a task like this" (top similarity below the guard) and the caller must
// fall back to the keyword heuristic.
func (ix *learnedIndex) predict(text string) (map[string]struct{}, float64, string, bool) {
	g := charGrams(text, knnNGram)
	if len(g) == 0 || len(ix.items) == 0 {
		return nil, 0, "", false
	}
	type scored struct {
		sim  float64
		item *knnItem
	}
	hits := make([]scored, 0, len(ix.items))
	for i := range ix.items {
		item := &ix.items[i]
		inter := 0
		for gram := range g {
			if _, ok := item.grams[gram]; ok {
				inter++
			}
		}
		union := len(g) + len(item.grams) - inter
		var sim float64
		if union > 0 {
			sim = float64(inter) / float64(union)
		}
		hits = append(hits, scored{sim: sim, item: item})
	}
	// Stable sort by similarity desc: ties keep training order, matching
	// Python's stable sort so routing stays reproducible.
	sort.SliceStable(hits, func(a, b int) bool { return hits[a].sim > hits[b].sim })
	best := hits[0].sim
	if best < knnMinSim {
		return nil, 0, "", false
	}
	top := hits[:knnK]

	// Tags: majority vote across the top-k.
	need := (knnK + 1) / 2
	votes := map[string]int{}
	order := []string{} // deterministic tie handling by first-seen order
	for _, h := range top {
		for t := range h.item.tags {
			if _, seen := votes[t]; !seen {
				order = append(order, t)
			}
			votes[t]++
		}
	}
	tags := map[string]struct{}{}
	for _, t := range order {
		if votes[t] >= need {
			tags[t] = struct{}{}
		}
	}
	if len(tags) == 0 {
		for t := range top[0].item.tags {
			tags[t] = struct{}{}
		}
	}

	// Difficulty: mean of the top-k, clamped to [1,5].
	sum := 0.0
	for _, h := range top {
		sum += h.item.difficulty
	}
	d := sum / float64(len(top))
	if d < 1.0 {
		d = 1.0
	}
	if d > 5.0 {
		d = 5.0
	}
	return tags, d, fmt.Sprintf("learned-knn(k=%d,sim=%.2f)", knnK, best), true
}

// runeLen mirrors Python's len() on str (code points, not bytes).
func runeLen(s string) int { return utf8.RuneCountInString(s) }
