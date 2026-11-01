"""What a turn costs: tokens, cache hits, and the money.

Every number here comes from the model proxy's own ledger (`/api/usage`), so
the tests are about the arithmetic between two snapshots, not about estimates.
"""

import unittest

from test_kit import make_app


def snapshot(prompt=1000, completion=100, cached=0, cost=0.01, requests=1):
    return {
        "total_prompt_tokens": prompt,
        "total_completion_tokens": completion,
        "total_cached_tokens": cached,
        "total_cost_usd": cost,
        "cache_hit_ratio": (cached / prompt) if prompt else 0.0,
        "request_count": requests,
        "session_count": 1,
        "by_model": {"deepseek-flash": {"prompt": prompt, "completion": completion,
                                        "total": prompt + completion, "count": requests}},
        "recent": [{"model": "deepseek-flash", "prompt_tokens": prompt,
                    "completion_tokens": completion, "cached_tokens": cached,
                    "cost_usd": cost, "timestamp": "2026-11-01T08:00:00+08:00"}],
    }


def used_app(base, now):
    app, capture = make_app(width=124, height=30)
    app.usage_base = base
    app.usage = now
    return app, capture


class TheTurnDelta(unittest.TestCase):
    def test_it_subtracts_the_two_snapshots(self):
        base = snapshot(prompt=1000, completion=100, cached=200, cost=0.01)
        now = snapshot(prompt=3000, completion=400, cached=900, cost=0.03)
        app, _ = used_app(base, now)
        turn = app._turn_usage()
        self.assertEqual(turn["prompt"], 2000)
        self.assertEqual(turn["completion"], 300)
        self.assertEqual(turn["cached"], 700)
        self.assertAlmostEqual(turn["cost"], 0.02)

    def test_the_cache_rate_is_over_the_prompt_tokens(self):
        empty = snapshot(prompt=0, completion=0, cached=0, cost=0.0)
        app, _ = used_app(empty, snapshot(prompt=2000, cached=1000))
        self.assertAlmostEqual(app._turn_usage()["cache_rate"], 0.5)

    def test_no_baseline_means_no_number(self):
        app, _ = make_app()
        app.usage = snapshot()
        app.usage_base = {}
        self.assertEqual(app._turn_usage(), {})

    def test_a_flat_ledger_is_not_invented(self):
        app, _ = used_app(snapshot(), snapshot())
        turn = app._turn_usage()
        self.assertEqual((turn["prompt"], turn["completion"]), (0, 0))


class StatusLine(unittest.TestCase):
    def test_a_running_turn_shows_real_tokens_per_second(self):
        app, capture = used_app(snapshot(), snapshot(completion=1100))
        app.busy = True
        app.started_at = __import__("time").monotonic() - 10
        app._draw()
        status = [line for line in capture.frame.lines() if "t/s" in line]
        self.assertTrue(status, "a rate should be on the status line")
        self.assertIn("100.0 t/s", status[0])

    def test_a_finished_turn_shows_the_cache_and_the_cost(self):
        empty = snapshot(prompt=0, completion=0, cached=0, cost=0.0)
        app, capture = used_app(empty, snapshot(prompt=2000, cached=1000, cost=0.02))
        app.busy = False
        app._draw()
        status = [line for line in capture.frame.lines() if "ready" in line][0]
        self.assertIn("cache 50%", status)
        self.assertIn("$0.0200", status)

    def test_without_numbers_the_line_says_nothing_invented(self):
        app, capture = make_app(width=124, height=30)
        app._draw()
        status = [line for line in capture.frame.lines() if "ready" in line][0]
        self.assertNotIn("t/s", status)
        self.assertNotIn("$", status)


class Panel(unittest.TestCase):
    def _open(self, payload):
        app, capture = make_app(width=124, height=30)
        app.client.usage_payload = payload
        app._run_command("/usage")
        from test_kit import settle
        settle(app)
        app._draw()
        return app, capture

    def test_the_panel_shows_the_ledger_and_its_requests(self):
        app, capture = self._open(snapshot(prompt=276885, completion=11028,
                                           cached=67840, cost=0.0642, requests=53))
        body = chr(10).join(capture.frame.lines())
        self.assertIn("ledger", body)
        self.assertIn("276.9k", body)
        self.assertIn("requests", body)
        self.assertIn("53", body)

    def test_it_lists_the_recent_requests_with_a_cache_rate(self):
        app, capture = self._open(snapshot(prompt=1000, cached=250))
        body = chr(10).join(capture.frame.lines())
        self.assertIn("recent", body)
        self.assertIn("25%", body)

    def test_this_turn_comes_first_when_there_is_one(self):
        app, capture = make_app(width=124, height=30)
        app.client.usage_payload = snapshot(prompt=2000, completion=300, cost=0.02)
        app.usage_base = snapshot(prompt=1000, completion=100, cost=0.01)
        app._run_command("/usage")
        from test_kit import settle
        settle(app)
        app._draw()
        body = chr(10).join(capture.frame.lines())
        self.assertIn("this turn", body)
        self.assertLess(body.index("this turn"), body.index("ledger"))


class SidePanel(unittest.TestCase):
    def test_usage_is_a_section_of_the_side_panel(self):
        app, capture = used_app(snapshot(), snapshot(prompt=2000, cached=500, cost=0.02))
        app.side_panel = True
        app._draw()
        body = chr(10).join(capture.frame.lines())
        self.assertIn("usage", body)
        self.assertIn("this turn", body)
        self.assertIn("ledger", body)


if __name__ == "__main__":
    unittest.main()
