"""Phase 4 (interaction realism) + Phase 5 (guardrails / consistency).

- posture: tired/sleepy/irritated turns become brief; urgent ones stay full;
- the LLM can only *evidence* emotion, it cannot drive it (delta is clamped);
- emotion cannot spiral (irritation/valence are clamped);
- the prompt has an injection budget;
- a tiny persona-consistency regression set (same input -> same state).
"""
import os
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.engine import LifeEngine  # noqa: E402


def _turn(intent="闲聊", adapter_type="webui"):
    return SimpleNamespace(user_id="u1", intent=intent, session_id="s1", adapter_type=adapter_type)


class Phase45(unittest.TestCase):
    def setUp(self):
        self._env = {k: os.environ.pop(k) for k in list(os.environ) if k.startswith("LIFE_COG_")}
        self.dir = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.dir.name)

    def tearDown(self):
        os.environ.update(self._env)
        self.dir.cleanup()

    def test_posture_is_brief_when_exhausted(self):
        self.engine.circadian.state.mental_energy = 10
        posture = self.engine._response_posture(_turn("闲聊"))
        self.assertEqual(posture["mode"], "brief")
        self.assertLess(posture["budget_factor"], 1.0)

    def test_posture_stays_full_for_an_urgent_request(self):
        self.engine.circadian.state.mental_energy = 10
        posture = self.engine._response_posture(_turn("请求"))
        self.assertEqual(posture["mode"], "reply")

    def test_model_emotion_is_only_evidence(self):
        sanitized = self.engine._sanitize_emotion_delta({"valence": 1.0, "arousal": -5.0, "irritation": 0.9})
        self.assertLessEqual(sanitized["valence"], 0.05)
        self.assertGreaterEqual(sanitized["arousal"], -0.05)
        self.assertLessEqual(sanitized["irritation"], 0.05)

    def test_emotion_spiral_is_clamped(self):
        self.engine.emotion.state.irritation = 0.99
        self.engine.emotion.state.valence = -0.99
        self.engine._clamp_emotion_spiral()
        self.assertLessEqual(self.engine.emotion.state.irritation, 0.85)
        self.assertGreaterEqual(self.engine.emotion.state.valence, -0.7)

    def test_prompt_budget_keeps_head_and_tail(self):
        text = "HEAD" + ("x" * 20000) + "TAIL"
        budgeted = self.engine._budget_context(text, limit=2000, keep_tail=500)
        self.assertLessEqual(len(budgeted), 2000 + 8)
        self.assertTrue(budgeted.startswith("HEAD"))
        self.assertTrue(budgeted.endswith("TAIL"))

    def test_persona_consistency_same_input_same_state(self):
        # Two fresh engines must classify/emote identically for the same input.
        other = LifeEngine(tempfile.mkdtemp())
        try:
            a = self.engine.emotion.on_user_message("我今天好累，烦死了")
            b = other.emotion.on_user_message("我今天好累，烦死了")
            self.assertEqual(a, b)
            self.assertEqual(self.engine.emotion.classify_intent("谢谢你"), other.emotion.classify_intent("谢谢你"))
        finally:
            import shutil
            shutil.rmtree(other.data_dir, ignore_errors=True)

    def test_repeated_hostility_does_not_spiral(self):
        for _ in range(20):
            self.engine.emotion.state.apply_delta({"irritation": 0.2, "valence": -0.2})
            self.engine._clamp_emotion_spiral()
        self.assertLessEqual(self.engine.emotion.state.irritation, 0.85)
        self.assertGreaterEqual(self.engine.emotion.state.valence, -0.7)


if __name__ == "__main__":
    unittest.main()
