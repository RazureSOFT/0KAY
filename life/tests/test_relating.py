"""Reciprocity: the shared trait space and the rupture/repair state machine.

These pin the two things the audit found missing: ``describe(partner)`` /
``homophily`` had no writer (always 0.5), and a relationship could only be
updated additively - it could never break and recover.
"""
import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition.relating import (
    AXES,
    RepairModel,
    RelatingSystem,
    TraitModel,
    signals_from_message,
)
from life.engine import LifeEngine


class TraitSpace(unittest.TestCase):
    def test_self_axes_come_from_the_persona(self):
        model = TraitModel()
        baseline = dict(model.self_axes)
        model.set_self(evidence={"positive_affect": ["开朗"], "impulsive": ["冲动"]})
        self.assertNotEqual(model.self_axes, baseline)
        self.assertGreater(model.self_axes["humor"], 0.5)
        self.assertGreater(model.self_axes["risk"], 0.5)

    def test_homophily_is_neutral_without_evidence(self):
        model = TraitModel()
        self.assertEqual(model.homophily("stranger"), 0.5)

    def test_homophily_moves_once_there_is_real_evidence(self):
        model = TraitModel()
        model.set_self(evidence={"positive_affect": ["开朗", "乐观", "爱笑"]})
        for _ in range(6):
            model.observe("u1", signals_from_message("谢谢你，哈哈，好开心", sentiment=1, latency=3))
        self.assertGreater(model.confidence("u1"), 0.5)
        self.assertGreater(model.homophily("u1"), 0.5)

    def test_a_cold_partner_scores_lower_than_a_warm_one(self):
        model = TraitModel()
        model.set_self(evidence={"positive_affect": ["开朗", "乐观"]})
        for _ in range(6):
            model.observe("warm", signals_from_message("谢谢你，哈哈", sentiment=1, latency=3))
            model.observe("cold", signals_from_message("闭嘴，别烦我", sentiment=-1, latency=3600))
        self.assertGreater(model.homophily("warm"), model.homophily("cold"))

    def test_axes_are_bounded(self):
        for axis, value in signals_from_message("x" * 10000, sentiment=0, latency=0).items():
            self.assertIn(axis, AXES)
            self.assertGreaterEqual(value, 0.0)
            self.assertLessEqual(value, 1.0)

    def test_trait_model_round_trips(self):
        model = TraitModel()
        model.set_self(evidence={"impulsive": ["冲动"]})
        model.observe("u1", signals_from_message("冲一下试试", sentiment=0, latency=2))
        restored = TraitModel.from_dict(model.to_dict())
        self.assertEqual(restored.self_axes, model.self_axes)
        self.assertEqual(restored.axes_for("u1"), model.axes_for("u1"))


class RepairStateMachine(unittest.TestCase):
    def test_negative_turn_opens_a_rupture(self):
        repair = RepairModel()
        self.assertEqual(repair.observe("u1", -1, "你让我很难过"), "rupture_opened")
        self.assertIn("u1", repair.unresolved())
        self.assertGreater(repair.severity("u1"), 0.0)

    def test_two_positive_turns_repair_it(self):
        repair = RepairModel()
        repair.observe("u1", -1, "生气")
        self.assertEqual(repair.observe("u1", 1, "对不起"), "repair_progress")
        self.assertEqual(repair.observe("u1", 1, "谢谢你的理解"), "repaired")
        self.assertNotIn("u1", repair.unresolved())
        self.assertEqual(repair.severity("u1"), 0.0)

    def test_a_second_negative_deepens_the_rupture(self):
        repair = RepairModel()
        repair.observe("u1", -1)
        severity = repair.severity("u1")
        repair.observe("u1", -1)
        self.assertGreater(repair.severity("u1"), severity)

    def test_repair_model_round_trips(self):
        repair = RepairModel()
        repair.observe("u1", -1, "误会")
        restored = RepairModel.from_dict(repair.to_dict())
        self.assertEqual(restored.unresolved(), ["u1"])

    def test_a_misread_is_labelled_a_misunderstanding(self):
        repair = RepairModel()
        repair.observe("u1", -1, "你误会了，我不是这个意思")
        self.assertTrue(repair.is_misunderstanding("u1"))
        self.assertEqual(repair.cause("u1"), RepairModel.MISUNDERSTANDING)

    def test_a_plain_hurt_is_not_a_misunderstanding(self):
        repair = RepairModel()
        repair.observe("u1", -1, "你太过分了")
        self.assertFalse(repair.is_misunderstanding("u1"))
        self.assertEqual(repair.cause("u1"), RepairModel.HURT)

    def test_clarifying_intent_counts_as_a_repair_step(self):
        repair = RepairModel()
        repair.observe("u1", -1, "你误会了")
        self.assertEqual(repair.observe("u1", 1, "我的意思是帮你"), "repair_progress")
        self.assertEqual(repair.observe("u1", 1, "谢谢你能理解"), "repaired")


class RelatingWiring(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.turn = SimpleNamespace(session_id="s1", user_id="u1")

    def tearDown(self):
        self.directory.cleanup()

    def _exchange(self, user_id, message, seconds_ago=5.0, sentiment=None):
        from datetime import datetime, timedelta
        feedback = self.engine._classify_feedback(message)
        self.engine._awaiting_feedback["s1"] = {
            "sent_at": (datetime.now() - timedelta(seconds=seconds_ago)).isoformat(),
            "user_id": user_id, "context": {}, "control": {}, "valence": 0.0,
            "response": "hi", "tool_success": 0.0, "tool_failure": 0.0}
        # `_receive_feedback` pops and credits using the *next* user message.
        self.turn.user_id = user_id
        self.engine._receive_feedback(self.turn, message)
        return feedback

    def test_describe_and_homophily_are_now_populated(self):
        for _ in range(6):
            self._exchange("u1", "谢谢你，哈哈，今天真开心")
        self.assertIn("__self__", self.engine.social.ties.traits)
        self.assertIn("u1", self.engine.social.ties.traits)
        self.assertNotEqual(self.engine.social.ties.homophily("u1"), 0.5)

    def test_a_negative_message_opens_a_rupture_in_the_engine(self):
        self._exchange("u1", "闭嘴，我讨厌你这样")
        self.assertIn("u1", self.engine.relating.repair.unresolved())

    def test_relationship_belief_context_includes_a_measurable_similarity(self):
        for _ in range(6):
            self._exchange("u1", "谢谢你，哈哈，好开心")
        text = self.engine._relationship_belief_context("u1")
        self.assertIn("相似度", text)

    def test_an_unrepaired_rupture_reaches_the_prompt(self):
        self._exchange("u1", "闭嘴，我讨厌你这样")
        text = self.engine._relationship_belief_context("u1")
        self.assertIn("没修好", text)

    def test_a_misunderstanding_reaches_the_prompt_as_an_explanation(self):
        self._exchange("u1", "你误会了，我不是这个意思")
        self.assertTrue(self.engine.relating.repair.is_misunderstanding("u1"))
        text = self.engine._relationship_belief_context("u1")
        self.assertIn("误解", text)

    def test_relating_state_survives_a_restart(self):
        for _ in range(4):
            self._exchange("u1", "谢谢你，哈哈")
        self.engine._save_state()
        reopened = LifeEngine(self.directory.name)
        self.assertIn("u1", reopened.relating.traits.partner_axes)


if __name__ == "__main__":
    unittest.main()
