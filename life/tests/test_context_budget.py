import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from life import context_budget as cb  # noqa: E402


class SplitTotals(unittest.TestCase):
    def test_the_allowances_add_up_to_the_total(self):
        table = cb.split_totals(9000)
        self.assertLessEqual(sum(table.values()), 9000)
        self.assertGreater(sum(table.values()), 9000 * 0.95)

    def test_the_persona_keeps_the_largest_share(self):
        table = cb.split_totals(9000)
        self.assertEqual(max(table, key=table.get), "persona")

    def test_shrinking_takes_from_the_biggest_part_first(self):
        shares = (("big", 0.8), ("small", 0.2))
        table = cb.split_totals(500, shares, {"big": 0, "small": 0})
        self.assertLessEqual(sum(table.values()), 500)
        self.assertGreater(table["small"], 0)

    def test_a_floor_is_never_undercut(self):
        shares = (("big", 0.95), ("tiny", 0.05))
        table = cb.split_totals(1000, shares, {"big": 0, "tiny": 300})
        self.assertGreaterEqual(table["tiny"], 300)

    def test_floors_larger_than_the_budget_are_scaled_instead_of_ignored(self):
        shares = (("a", 0.5), ("b", 0.5))
        table = cb.split_totals(200, shares, {"a": 400, "b": 400})
        self.assertLessEqual(sum(table.values()), 200)
        self.assertGreater(table["a"], 0)
        self.assertGreater(table["b"], 0)


class Fit(unittest.TestCase):
    def test_short_text_is_untouched(self):
        self.assertEqual(cb.fit("short", 100), "short")

    def test_long_text_keeps_head_and_tail(self):
        text = "HEAD" + "x" * 20000 + "TAIL"
        out = cb.fit(text, 2000)
        self.assertTrue(out.startswith("HEAD"))
        self.assertTrue(out.endswith("TAIL"))
        self.assertLessEqual(len(out), 2000 + len(cb.ELLIPSIS))

    def test_an_explicit_tail_matches_the_old_behaviour(self):
        text = "HEAD" + "x" * 20000 + "TAIL"
        out = cb.fit(text, 2000, keep_tail=500)
        self.assertLessEqual(len(out), 2000 + len(cb.ELLIPSIS))
        self.assertTrue(out.startswith("HEAD"))
        self.assertTrue(out.endswith("TAIL"))

    def test_a_zero_limit_yields_nothing(self):
        self.assertEqual(cb.fit("anything", 0), "")


class Apply(unittest.TestCase):
    def test_every_part_is_cut_to_its_own_allowance(self):
        parts = {"persona": "p" * 50000, "memory": "m" * 50000, "world": "w" * 50000}
        out = cb.apply(parts, 9000)
        table = cb.split_totals(9000)
        for name, text in out.items():
            self.assertLessEqual(len(text), table[name] + len(cb.ELLIPSIS))

    def test_an_empty_part_stays_empty(self):
        out = cb.apply({"persona": "", "world": ""}, 9000)
        self.assertEqual(out["persona"], "")
        self.assertEqual(out["world"], "")


class RecallTopK(unittest.TestCase):
    def test_a_small_budget_still_returns_the_floor(self):
        self.assertEqual(cb.recall_top_k(100), 3)

    def test_a_large_budget_stops_at_the_ceiling(self):
        self.assertEqual(cb.recall_top_k(100000), 6)

    def test_the_middle_tracks_the_budget(self):
        self.assertEqual(cb.recall_top_k(220 * 5), 5)

    def test_a_broken_budget_falls_back_to_the_floor(self):
        self.assertEqual(cb.recall_top_k("not a number"), 3)


if __name__ == "__main__":
    unittest.main()
