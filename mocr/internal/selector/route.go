package selector

import (
	"fmt"
	"math"
	"os"
	"sort"
	"strings"
	"sync"
	"unicode"
)

// Routing core, ported from jev_router/route.py + models_catalog.py:
//   1) text -> (capability tags, difficulty)   — learned kNN, fallback keywords
//   2) tags/difficulty -> cheapest capable model in the candidate pool
// with four strategies and deterministic tie-breaking (stable order).

// routerModel is one candidate in the routing pool: a Core catalog entry
// enriched with jev catalog metadata (power/ctx/cost/tags).
type routerModel struct {
	core     int    // index into the caller's providers.ModelInfo slice
	id       string // Core model id (bare, e.g. "deepseek-flash")
	provider string // Core provider
	power    float64
	ctx      int64
	cost     float64 // blended $/1M, lower is cheaper
	tags     map[string]struct{}
	jevID    string // matched jev catalog id, "" when synthesized
}

// Strategies (jev semantics):
//
//	economy     cheapest capable, stronger on ties (default)
//	balanced    cheapest among near-strongest (power within 0.5 of the best)
//	performance strongest first, cheaper on ties
//	speed       fast-tagged first, then economy
var strategies = map[string]string{
	"economy":     "经济优先：最便宜达标，同价取更强",
	"balanced":    "均衡：接近最强档里挑最便宜，性价比取向",
	"performance": "效果优先：挑最强，同强取更便宜",
	"speed":       "速度优先：优先低延迟模型，其次比价格",
}

const (
	balancedPowerGap = 0.5
	ctxLong          = 256_000
)

// mapStrategy maps mocr's provider-settings strategy (auto|quality|cost|pinned)
// onto jev strategies; unknown values pass through when valid, else economy.
func mapStrategy(strategy string) string {
	switch strings.ToLower(strings.TrimSpace(strategy)) {
	case "quality", "performance":
		return "performance"
	case "balanced":
		return "balanced"
	case "speed":
		return "speed"
	default: // auto, cost, pinned, ""
		return "economy"
	}
}

// diffThreshold quantizes the difficulty to 0.5 steps so a ±0.25 estimation
// error cannot flip the power gate.
func diffThreshold(difficulty float64) float64 {
	return float64(int(difficulty*2+0.5)) / 2
}

func hasTag(tags map[string]struct{}, tag string) bool {
	_, ok := tags[tag]
	return ok
}

func tagsSubset(required, have map[string]struct{}) bool {
	for t := range required {
		if _, ok := have[t]; !ok {
			return false
		}
	}
	return true
}

// rankModels returns pool indices ordered by strategy, guaranteeing a
// non-empty result via jev's relaxation ladder: drop the rarest required tag,
// then ignore difficulty, then fall back to the strongest model in the pool.
func rankModels(pool []routerModel, tags map[string]struct{}, difficulty float64, strategy string) []int {
	if _, ok := strategies[strategy]; !ok {
		strategy = "economy"
	}
	meets := func(required map[string]struct{}, minPower float64) []int {
		out := []int{}
		for i := range pool {
			if tagsSubset(required, pool[i].tags) && pool[i].power >= minPower {
				out = append(out, i)
			}
		}
		return out
	}
	threshold := diffThreshold(difficulty)
	ok := meets(tags, threshold)
	if len(ok) == 0 && len(tags) > 0 {
		// Drop the rarest required tag first (deterministic: freq, then name).
		freq := map[string]int{}
		for t := range tags {
			for i := range pool {
				if hasTag(pool[i].tags, t) {
					freq[t]++
				}
			}
		}
		ordered := make([]string, 0, len(tags))
		for t := range tags {
			ordered = append(ordered, t)
		}
		sort.Slice(ordered, func(a, b int) bool {
			if freq[ordered[a]] != freq[ordered[b]] {
				return freq[ordered[a]] < freq[ordered[b]]
			}
			return ordered[a] < ordered[b]
		})
		for _, drop := range ordered {
			relaxed := map[string]struct{}{}
			for t := range tags {
				if t != drop {
					relaxed[t] = struct{}{}
				}
			}
			if ok = meets(relaxed, threshold); len(ok) > 0 {
				break
			}
		}
	}
	if len(ok) == 0 {
		ok = meets(tags, 0) // tags only, ignore difficulty
	}
	if len(ok) == 0 {
		// Strongest fallback: capability is unsatisfiable, never pick blind cheap.
		best := -1
		for _, i := range allIndices(pool) {
			if best == -1 || pool[i].power > pool[best].power {
				best = i
			}
		}
		if best == -1 {
			return nil
		}
		return []int{best}
	}

	maxPower := 0.0
	for _, i := range ok {
		if pool[i].power > maxPower {
			maxPower = pool[i].power
		}
	}
	less := func(x, y int) bool {
		ma, mb := pool[ok[x]], pool[ok[y]] // ok holds pool indices; x/y are positions in ok
		switch strategy {
		case "performance":
			if ma.power != mb.power {
				return ma.power > mb.power
			}
			return ma.cost < mb.cost
		case "balanced":
			na, nb := 0, 0
			if ma.power < maxPower-balancedPowerGap {
				na = 1
			}
			if mb.power < maxPower-balancedPowerGap {
				nb = 1
			}
			if na != nb {
				return na < nb
			}
			if ma.cost != mb.cost {
				return ma.cost < mb.cost
			}
			return ma.power > mb.power
		case "speed":
			fa, fb := hasTag(ma.tags, "fast"), hasTag(mb.tags, "fast")
			if fa != fb {
				return fa
			}
			if ma.cost != mb.cost {
				return ma.cost < mb.cost
			}
			return ma.power > mb.power
		default: // economy
			if ma.cost != mb.cost {
				return ma.cost < mb.cost
			}
			return ma.power > mb.power
		}
	}
	sort.SliceStable(ok, less)
	return ok
}

func allIndices(pool []routerModel) []int {
	out := make([]int, len(pool))
	for i := range pool {
		out[i] = i
	}
	return out
}

// maxDifficulty is the top of the router's internal difficulty scale. It matches
// the scale `power` is measured on, so a difficulty threshold and a model's
// power are directly comparable.
const maxDifficulty = 5.0

// normalizeDifficultyHint maps a caller-supplied `difficulty_hint` onto the
// router's internal 1..5 difficulty scale.
//
// This has to happen, because the two scales do not agree. The public hint is
// documented and sent as 0..1 (0 = no opinion, 1 = hardest); the kNN predicts
// 1..5 and the gate compares against `power` in 1..5. Comparing a 0..1 hint
// directly against power∈[1,5] yields thresholds of 0.0..1.0, so the gate is
// wide open at every intensity — including "max", which would still admit almost
// everything — and the classifier's difficulty output is overwritten.
//
// A hint already above 1 is assumed to be on the internal scale (the thinking
// floor passes 4.2) and is clamped rather than rescaled. Zero is "no opinion" and
// returns zero, so inferSpec leaves the classifier's own answer in place; the
// caller must not use a non-zero default to mean "unspecified".
func normalizeDifficultyHint(hint float64) float64 {
	if hint <= 0 {
		return 0
	}
	if hint > 1 {
		return math.Min(hint, maxDifficulty)
	}
	return 1 + hint*(maxDifficulty-1)
}

// inferSpec infers (tags, difficulty, hits) for a prompt: learned kNN first
// (ROUTER_MODE=heuristic forces the keyword baseline), keyword fallback, then
// explicit overrides from the caller win per-field (route.py semantics).
func inferSpec(text string, explicitTags map[string]struct{}, explicitDifficulty float64) (map[string]struct{}, float64, []string) {
	var tags map[string]struct{}
	var d float64
	var hits []string
	mode := strings.ToLower(strings.TrimSpace(envOrDefault("ROUTER_MODE", "auto")))
	got := false
	if mode == "" || mode == "auto" || strings.HasPrefix(mode, "learn") {
		if idx := loadLearned(); idx != nil && len(idx.items) > 0 {
			if t, dd, hit, ok := idx.predict(text); ok {
				tags, d, hits, got = t, dd, []string{hit}, true
			}
		}
	}
	if !got {
		tags, d, hits = inferByKeywords(text)
	}
	if explicitTags != nil {
		tags = explicitTags
		hits = append(hits, "explicit:tags")
	}
	if explicitDifficulty > 0 {
		d = normalizeDifficultyHint(explicitDifficulty)
		hits = append(hits, "explicit:difficulty")
	}
	if tags == nil {
		tags = map[string]struct{}{"general": {}}
	}
	return tags, d, hits
}

var (
	aliasOnce sync.Once
	aliasRef  map[string]string
)

// detectModelName reports a model explicitly named in the prompt (highest
// priority in jev routing). Aliases come from the FULL embedded catalog (full
// ids + bare tails + curated brand aliases whose target exists upstream),
// longest match wins on word boundaries (Go regexp has no lookbehind, so
// boundaries are checked manually). The caller decides pool membership —
// mirroring route.py, a named model outside the pool is ignored and inference
// proceeds.
func detectModelName(text string) (string, bool) {
	aliasOnce.Do(func() {
		cat := loadCatalog()
		aliasRef = map[string]string{}
		for lower, m := range cat.byID {
			if _, exists := aliasRef[lower]; !exists {
				aliasRef[lower] = lower
			}
			_ = m
		}
		for lower := range cat.byID {
			tail := idTail(lower)
			if _, exists := aliasRef[tail]; !exists {
				aliasRef[tail] = lower
			}
		}
		for alias, target := range handAliases {
			// jev keeps a hand alias only when its target is literally a
			// catalog key; with the generated catalog (prefixed ids) most
			// hand aliases drop out and full-id/tail aliases dominate.
			if _, ok := cat.byID[strings.ToLower(target)]; ok {
				if _, exists := aliasRef[alias]; !exists {
					aliasRef[alias] = strings.ToLower(target)
				}
			}
		}
	})
	t := strings.ToLower(text)
	bestLen := 0
	best := ""
	// Longest alias wins; equal lengths break lexicographically on the alias so
	// the result does not depend on Go's randomized map iteration order.
	// Without the tiebreak, "use gpt-5.1 or gpt-5.2" pins a different model on
	// different calls.
	for alias, target := range aliasRef {
		if len(alias) < bestLen {
			continue
		}
		if len(alias) == bestLen && best != "" && alias >= best {
			continue
		}
		if matchAliasBoundaried(t, alias) {
			best, bestLen = target, len(alias)
		}
	}
	if best == "" {
		return "", false
	}
	return best, true
}

// promptModelPinningEnabled reports whether a model id appearing in the prompt
// may select the model. Off by default: the prompt is untrusted input.
func promptModelPinningEnabled() bool {
	return strings.EqualFold(strings.TrimSpace(os.Getenv("ROUTER_TRUST_PROMPT_MODEL")), "1") ||
		strings.EqualFold(strings.TrimSpace(os.Getenv("ROUTER_TRUST_PROMPT_MODEL")), "true")
}

// matchAliasBoundaried finds alias in t with non-alphanumeric neighbours.
func matchAliasBoundaried(t, alias string) bool {
	for start := 0; ; {
		idx := strings.Index(t[start:], alias)
		if idx < 0 {
			return false
		}
		idx += start
		beforeOK := true
		if idx > 0 {
			r := []rune(t[:idx])
			beforeOK = !isAlnumASCII(r[len(r)-1])
		}
		afterOK := true
		end := idx + len(alias)
		if end < len(t) {
			r := []rune(t[end : end+1])
			afterOK = !isAlnumASCII(r[0])
		}
		if beforeOK && afterOK {
			return true
		}
		start = idx + 1
	}
}

func isAlnumASCII(r rune) bool {
	return (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || unicode.IsDigit(r)
}

func envOrDefault(key, def string) string {
	if v := strings.TrimSpace(getenv(key)); v != "" {
		return v
	}
	return def
}

// routeThinkOutput runs the full jev decision for mocr's two-model contract:
// the think model routes with the full inferred spec (reasoning added when the
// caller requires thinking), the output model routes with the hard
// capability gates lifted (its job is expression, not perception) and a
// difficulty capped at the light tier.
func routeThinkOutput(pool []routerModel, prompt string, explicitDifficulty float64, requireThinking bool, strategy string) (think, output int, rationale string, ok bool) {
	if len(pool) == 0 {
		return -1, -1, "", false
	}
	tags, d, hits := inferSpec(prompt, nil, explicitDifficulty)
	if requireThinking {
		tags = copyTags(tags)
		tags["reasoning"] = struct{}{}
		if d < 4.2 {
			d = 4.2
		}
	}

	// A model named in the prompt wins outright (user pointed at it) — pool
	// membership by bare tail, since the catalog uses prefixed ids while the
	// Core pool uses bare names. Named-but-absent falls through to inference.
	//
	// Opt-in only. The prompt is untrusted input: it carries tool output,
	// retrieved documents and pasted file contents, any of which may mention a
	// model id. Letting that text pin the selection silently overrides the cost
	// and quality strategy the user actually chose — a summary of a document
	// mentioning claude-opus-4 would bill Opus for the output model. Set
	// ROUTER_TRUST_PROMPT_MODEL=1 to restore the behaviour.
	if explicitDifficulty <= 0 && promptModelPinningEnabled() {
		if named, found := detectModelName(prompt); found {
			namedTail := idTail(named)
			for i := range pool {
				if idTail(pool[i].id) == namedTail {
					return i, i, fmt.Sprintf("任务中显式指定了模型 %s", pool[i].id), true
				}
			}
		}
	}

	strategy = mapStrategy(strategy)
	thinkRank := rankModels(pool, tags, d, strategy)
	if len(thinkRank) == 0 {
		return -1, -1, "", false
	}
	think = thinkRank[0]

	lightTags := copyTags(tags)
	for _, hard := range []string{"reasoning", "long_ctx", "vision", "agentic"} {
		delete(lightTags, hard)
	}
	if len(lightTags) == 0 {
		lightTags["general"] = struct{}{}
	}
	lightD := d
	if lightD > 2.0 {
		lightD = 2.0
	}
	outRank := rankModels(pool, lightTags, lightD, strategy)
	if len(outRank) == 0 {
		output = think
	} else {
		output = outRank[0]
	}

	tagList := sortedTags(tags)
	rationale = fmt.Sprintf("jev-router: 难度≈%.1f，需要能力 %s；策略[%s]下 think=%s、output=%s；线索: %s",
		d, tagList, strategy, pool[think].id, pool[output].id, strings.Join(hits, ", "))
	return think, output, rationale, true
}

func copyTags(tags map[string]struct{}) map[string]struct{} {
	out := make(map[string]struct{}, len(tags))
	for t := range tags {
		out[t] = struct{}{}
	}
	return out
}

func sortedTags(tags map[string]struct{}) []string {
	out := make([]string, 0, len(tags))
	for t := range tags {
		out = append(out, t)
	}
	sort.Strings(out)
	return out
}
