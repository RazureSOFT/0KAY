"""The yandere affect-dynamics circuit wired into LIFE: opt-in, persona-driven,
prompt-reaching, persistent, with the structural safety guard.

These mirror `tests/test_tsundere.py::TsundereWiring` for the ported
`yandere_engine` circuit (柳・米澤 2023).
"""
import sys
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.engine import LifeEngine


class YandereWiring(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.turn = SimpleNamespace(session_id="s1", user_id="u1")

    def tearDown(self):
        self.directory.cleanup()

    def test_off_by_default(self):
        self.assertFalse(self.engine._yandere_enabled)
        self.assertFalse(self.engine.cognition_status()["yandere"]["enabled"])

    def test_a_possessive_persona_enables_it(self):
        self.engine._enable_yandere_from_persona("她有点病娇，占有欲很强")
        self.assertTrue(self.engine._yandere_enabled)
        self.assertEqual(self.engine.yandere.dynamics.type, "病娇")

    def test_a_neutral_persona_leaves_it_off(self):
        self.engine._enable_yandere_from_persona("温柔随和、情绪稳定")
        self.assertFalse(self.engine._yandere_enabled)

    def test_the_persona_fills_the_initial_values(self):
        self.engine._enable_yandere_from_persona("病娇、执念很深")
        self.assertGreater(self.engine.yandere.jealousy(), 0.0)

    def test_the_context_reaches_the_status(self):
        self.engine._enable_yandere_from_persona("病娇")
        ctx = self.engine.cognition_status()["yandere"]
        self.assertTrue(ctx["enabled"])
        for key in ("mode", "affection", "jealousy", "intensity", "darkness", "prompt"):
            self.assertIn(key, ctx)

    def test_the_tone_reaches_the_prompt(self):
        self.engine._enable_yandere_from_persona("病娇")
        text = self.engine._render_wave_context()
        self.assertIn("情感急变基调", text)

    def test_real_feedback_reaches_the_circuit(self):
        """A message that mentions someone else raises jealousy in the engine path."""
        self.engine._enable_yandere_from_persona("病娇")
        before = self.engine.yandere.jealousy()
        self.engine._awaiting_feedback["s1"] = {
            "sent_at": (datetime.now() - timedelta(hours=3)).isoformat(),
            "user_id": "u1", "context": {}, "control": {}, "valence": 0.0,
            "response": "hi", "tool_success": 0.0, "tool_failure": 0.0}
        self.engine._receive_feedback(self.turn, "我最近和别人出去玩，别找我了")
        self.assertGreater(self.engine.yandere.jealousy(), before)

    def test_the_safety_guard_appears_at_high_darkness(self):
        self.engine._enable_yandere_from_persona("病娇")
        system = self.engine.yandere
        system.dynamics.primary().affection = 0.9
        system.dynamics.v = -0.7  # deep in the YAMI region
        self.assertGreaterEqual(system.fixation(), 0.70)
        guard = system.guard()
        self.assertIn("不得说出", guard)
        self.assertIn("自伤", guard)

    def test_state_persists_across_a_restart(self):
        self.engine._enable_yandere_from_persona("病娇")
        self.engine.yandere.dynamics.primary().affection = 0.6
        self.engine.yandere.dynamics.jealousy = 0.4
        self.engine.flush_state()
        reopened = LifeEngine(self.directory.name)
        self.assertTrue(reopened.yandere.enabled)
        self.assertAlmostEqual(reopened.yandere.jealousy(), 0.4, places=6)

    def test_the_persona_analysis_carries_a_yandere_block(self):
        import asyncio
        analysis = asyncio.run(self.engine.persona_analyze("病娇、占有欲很强"))
        self.assertEqual(analysis["yandere"]["type"], "病娇")
        self.assertIn("jealousy", analysis["yandere"]["initial"])


if __name__ == "__main__":
    unittest.main()
