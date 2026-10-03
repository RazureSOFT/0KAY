"""Phase 1 "path audit": the dead state -> behaviour links are now wired.

Each test pins one connection that previously existed only as telemetry:
- emotions decay between turns (and a long gap cannot flip their sign);
- circadian energy changes the reply-speed multiplier;
- soul channels survive a restart;
- learned expressions actually reach the prompt;
- personal goals reach the planning context;
- ``reply_deceleration`` actually gates proactive outreach.
"""
import asyncio
import os
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.engine import LifeEngine  # noqa: E402
from life.emotion.emotion import EmotionState  # noqa: E402
from life.circadian.circadian import CircadianSystem  # noqa: E402


class Phase1Wiring(unittest.TestCase):
    def setUp(self):
        self._env = {k: os.environ.pop(k) for k in list(os.environ) if k.startswith("LIFE_COG_")}
        self.dir = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.dir.name)

    def tearDown(self):
        os.environ.update(self._env)
        self.dir.cleanup()

    def test_emotion_decay_is_safe_for_long_gaps(self):
        state = EmotionState(valence=0.8, arousal=0.9, irritation=0.9)
        state.decay(24 * 3600)  # a full day
        self.assertGreaterEqual(state.valence, 0.0)
        self.assertLessEqual(state.valence, 1.0)
        self.assertGreaterEqual(state.arousal, 0.0)
        self.assertGreaterEqual(state.irritation, 0.0)
        # Irritability must fade faster than mood.
        self.assertLess(state.irritation / 0.9, state.valence / 0.8)

    def test_response_delay_scales_with_energy(self):
        system = CircadianSystem()
        system.state.mental_energy = 10
        self.assertEqual(system.get_response_delay(), 3.0)
        system.state.mental_energy = 40
        self.assertEqual(system.get_response_delay(), 2.0)
        system.state.mental_energy = 90
        self.assertEqual(system.get_response_delay(), 1.0)

    def test_soul_persists_across_restart(self):
        self.engine.soul.creativity = 0.93
        self.engine.soul.recall_depth = 0.11
        self.engine.flush_state()
        reloaded = LifeEngine(self.dir.name)
        self.assertAlmostEqual(reloaded.soul.creativity, 0.93, places=2)
        self.assertAlmostEqual(reloaded.soul.recall_depth, 0.11, places=2)

    def test_expressions_reach_the_prompt(self):
        created = self.engine.companion.add_expression("晚安呀", "", "public", "conversation")
        self.engine.companion.review_expression(created["id"], True)
        context = asyncio.run(self.engine._expression_context("u1"))
        self.assertIn("晚安呀", context)

    def test_goals_reach_planning_context(self):
        self.engine.companion.add_goal("学会一首钢琴曲")
        context = asyncio.run(self.engine._daily_context())
        titles = [g.get("title") for g in context.get("goals", [])]
        self.assertIn("学会一首钢琴曲", titles)

    def test_reply_deceleration_setting_gates_outreach(self):
        target = "user:u_decel"
        # Simulate an unanswered-outreach pause by writing the state directly.
        with self.engine.companion.db() as db:
            db.execute("INSERT OR REPLACE INTO outreach_state(target,consecutive_unanswered,last_sent,paused_until) VALUES(?,?,?,?)",
                       (target, 3, datetime.now().isoformat(), (datetime.now() + timedelta(hours=1)).isoformat()))
            db.execute("INSERT INTO settings(key,value) VALUES('reply_deceleration','1') ON CONFLICT(key) DO UPDATE SET value='1'")
        allowed, reason = self.engine.companion.can_proactively_send(target)
        self.assertFalse(allowed)
        self.assertIn("paused", reason)
        # Turning the setting off removes the pause (deceleration is opt-out).
        # Neutralise quiet hours so this test does not depend on the wall clock.
        self.engine.companion.set_settings({"reply_deceleration": "0", "quiet_start": "0", "quiet_end": "0"})
        allowed_off, _ = self.engine.companion.can_proactively_send(target)
        self.assertTrue(allowed_off)


if __name__ == "__main__":
    unittest.main()
