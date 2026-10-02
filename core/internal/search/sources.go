package search

import (
	"context"
	"strings"
	"sync"
	"time"
)

// source is one queryable backend (engine or API).
type source struct {
	name  string
	fetch func(context.Context, string, int) ([]Result, error)
}

// runSources queries several sources concurrently and merges the results,
// biased to the first source. It stops as soon as the first source has settled
// and enough results are collected, otherwise at overallBudget.
func runSources(ctx context.Context, query string, limit int, sources []source) ([]Result, []string) {
	if len(sources) == 0 {
		return []Result{}, nil
	}
	budget := overallBudget
	if deadline, ok := ctx.Deadline(); ok {
		if remaining := time.Until(deadline); remaining < budget {
			budget = remaining
		}
	}
	if budget <= 0 {
		budget = time.Second
	}
	runCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	type outcome struct {
		idx  int
		rows []Result
		err  error
	}
	results := make(chan outcome, len(sources))
	var wg sync.WaitGroup
	for i, src := range sources {
		wg.Add(1)
		go func(i int, src source) {
			defer wg.Done()
			rows, err := src.fetch(runCtx, query, limit)
			results <- outcome{idx: i, rows: rows, err: err}
		}(i, src)
	}
	go func() { wg.Wait(); close(results) }()

	seen := map[string]bool{}
	collected := map[int][]Result{}
	var errs []string
	total := 0
	firstDone := false
	timer := time.NewTimer(budget)
	defer timer.Stop()

loop:
	for {
		select {
		case <-timer.C:
			break loop
		case out, ok := <-results:
			if !ok {
				break loop
			}
			if out.idx == 0 {
				firstDone = true
			}
			if out.err != nil {
				errs = append(errs, sources[out.idx].name+": "+out.err.Error())
				continue
			}
			for _, r := range out.rows {
				key := dedupeKey(r)
				if key == "" || seen[key] {
					continue
				}
				seen[key] = true
				collected[out.idx] = append(collected[out.idx], r)
				total++
			}
			if firstDone && total >= limit {
				break loop
			}
		}
	}
	cancel()

	out := make([]Result, 0, limit)
	for len(out) < limit {
		progressed := false
		for i := range sources {
			rows := collected[i]
			if len(rows) == 0 {
				continue
			}
			out = append(out, rows[0])
			collected[i] = rows[1:]
			progressed = true
			if len(out) >= limit {
				break
			}
		}
		if !progressed {
			break
		}
	}
	return out, errs
}

func dedupeKey(r Result) string {
	if u := strings.TrimRight(strings.ToLower(strings.TrimSpace(r.URL)), "/"); u != "" {
		return u
	}
	return strings.ToLower(strings.TrimSpace(r.Title))
}
