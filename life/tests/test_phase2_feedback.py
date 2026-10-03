"""Phase 2: the learning reward comes from the user's real reaction.

The arbiter credits a turn only when the user's next message arrives, and the
reward is a function of whether / how fast / how long / how positively they
replied and whether they recalled - never the bot's own reply length.
"""
import os
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.engine import LifeEngine  # noqa: E402


def _turn(session_id="s1", user_id="u1"):
    return SimpleNamespace(user_id=user_id, intent="闲聊", session_id=session_id)


class Phase2Feedback(unittest.TestCase):
    def setUp(self):
        self._env = {k: os.environ.pop(k) for k in list(os.environ) if k.startswith("LIFE_COG_")}
        self.dir = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.dir.name)

    def tearDown(self):
        os.environ.update(self._env)
        self.dir.cleanup()

    def test_classify_feedback(self):
        self.assertEqual(self.engine._classify_feedback("谢谢你，好棒")["sentiment"], 1)
        self.assertEqual(self.engine._classify_feedback("讨厌死了，别烦我")["sentiment"], -1)
        self.assertTrue(self.engine._classify_feedback("你撤回了一条消息")["recalled"])

    def test_fast_positive_reward_beats_slow_negative(self):
        entry = {"tool_success": 0.0, "tool_failure": 0.0}
        fast = self.engine._feedback_reward(entry, 5.0, {"length": 60, "sentiment": 1, "recalled": False})
        slow = self.engine._feedback_reward(entry, 6000.0, {"length": 2, "sentiment": -1, "recalled": False})
        self.assertGreater(fast, slow)

    def test_reply_credits_the_previous_turn(self):
        turn = _turn()
        self.engine._cognition_arbitrate("你好", turn, "", {})
        self.engine._record_awaiting(turn, "我在呢")
        self.assertIn("s1", self.engine._awaiting_feedback)
        self.engine._receive_feedback(turn, "谢谢你，好棒")
        self.assertEqual(self.engine.cognition.turns, 1, "the user's reply must settle exactly one decision")
        self.assertNotIn("s1", self.engine._awaiting_feedback)
        self.assertEqual(self.engine._feedback_stats["u1"]["positive"], 1)

    def test_no_feedback_without_a_reply(self):
        turn = _turn()
        self.engine._cognition_arbitrate("你好", turn, "", {})
        self.engine._record_awaiting(turn, "我在呢")
        # A brand-new session with no parked turn must not learn anything.
        other = _turn(session_id="s2", user_id="u2")
        self.engine._receive_feedback(other, "在吗")
        self.assertEqual(self.engine.cognition.turns, 0)

    def test_feedback_stats_persist(self):
        turn = _turn()
        self.engine._cognition_arbitrate("你好", turn, "", {})
        self.engine._record_awaiting(turn, "我在呢")
        self.engine._receive_feedback(turn, "谢谢")
        self.engine.flush_state()
        reloaded = LifeEngine(self.dir.name)
        self.assertGreaterEqual(reloaded._feedback_stats.get("u1", {}).get("positive", 0), 1)


if __name__ == "__main__":
    unittest.main()
