"""Phase 3 core: commitment ledger, structured user model, slow values layer."""
import asyncio
import os
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.engine import LifeEngine  # noqa: E402


class Phase3Parts(unittest.TestCase):
    def setUp(self):
        self._env = {k: os.environ.pop(k) for k in list(os.environ) if k.startswith("LIFE_COG_")}
        self.dir = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.dir.name)
        self.companion = self.engine.companion

    def tearDown(self):
        os.environ.update(self._env)
        self.dir.cleanup()

    def test_commitment_ledger_round_trip(self):
        self.companion.add_commitment("u1", "明天提醒你交材料")
        open_items = self.companion.list_commitments("u1", "open")
        self.assertEqual(len(open_items), 1)
        # Duplicates are not re-added.
        self.companion.add_commitment("u1", "明天提醒你交材料")
        self.assertEqual(len(self.companion.list_commitments("u1", "open")), 1)
        resolved = self.companion.resolve_commitments("u1", ["交材料"])
        self.assertEqual(resolved, 1)
        self.assertEqual(self.companion.list_commitments("u1", "open"), [])
        self.assertEqual(len(self.companion.list_commitments("u1", "done")), 1)

    def test_commitments_are_per_user(self):
        self.companion.add_commitment("u1", "答应 A 的事")
        self.companion.add_commitment("u2", "答应 B 的事")
        self.assertEqual([c["text"] for c in self.companion.list_commitments("u1")], ["答应 A 的事"])

    def test_user_model_merges_and_dedups(self):
        self.companion.upsert_user_model("u1", preferences=["科幻"], taboos=["别催睡"], concerns=["赶报告"])
        self.companion.upsert_user_model("u1", preferences=["科幻", "猫"], taboos=["别催睡"])
        model = self.companion.get_user_model("u1")
        self.assertEqual(model["preferences"], ["科幻", "猫"])
        self.assertEqual(model["taboos"], ["别催睡"])
        self.assertEqual(model["concerns"], ["赶报告"])

    def test_values_drift_and_clamp(self):
        self.companion.nudge_values({"温柔": 0.05, "诚实": 0.05})
        self.companion.nudge_values({"温柔": 0.05})
        values = self.companion.get_values()
        self.assertAlmostEqual(values["温柔"], 0.10, places=3)
        for _ in range(40):
            self.companion.nudge_values({"温柔": 0.5})
        self.assertLessEqual(self.companion.get_values()["温柔"], 1.0)

    def test_commitments_and_model_survive_restart(self):
        self.companion.add_commitment("u1", "下次一起看电影")
        self.companion.upsert_user_model("u1", concerns=["准备考试"])
        self.companion.nudge_values({"陪伴": 0.05})
        reloaded = LifeEngine(self.dir.name)
        self.assertEqual(len(reloaded.companion.list_commitments("u1")), 1)
        self.assertEqual(reloaded.companion.get_user_model("u1")["concerns"], ["准备考试"])
        self.assertGreater(reloaded.companion.get_values().get("陪伴", 0), 0)


    def test_life_event_runs_once_a_day(self):
        first = asyncio.run(self.engine.maybe_life_event())
        self.assertTrue(first.get("event"))
        self.assertEqual(self.engine._last_event_date, datetime.now().date().isoformat())
        second = asyncio.run(self.engine.maybe_life_event())
        self.assertEqual(second.get("skipped"), "done")

    def test_anticipation_from_important_dates(self):
        soon = (datetime.now() + timedelta(days=2)).strftime("%m-%d")
        self.companion.add_important_date("生日", soon, repeat_yearly=True)
        before = self.engine.emotion.state.valence
        result = asyncio.run(self.engine.maybe_life_event(force=True))
        self.assertIn("生日", result.get("anticipation", []))
        self.assertGreater(self.engine.emotion.state.valence, before)


if __name__ == "__main__":
    unittest.main()
