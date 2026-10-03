"""The pathological-attachment ("yandere") circuit: it evolves from real
interaction signals, is opt-in, and has a structural safety layer."""
import sys
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition.attachment import (
    AttachmentDynamics,
    AttachmentSystem,
    initial_state_for_persona,
    severity_band,
    type_for_persona,
)
from life.engine import LifeEngine


def _feed(system, days, *, sentiment=-1.0, latency=20000.0, recalled=False, other=True):
    system.observe_interaction(valence=-0.3, sentiment=sentiment, latency_seconds=latency,
                               recalled=recalled, mentions_other=other)
    system.tick(days)


class AttachmentDynamicsTests(unittest.TestCase):
    def test_persona_keywords_pick_an_archetype(self):
        self.assertEqual(type_for_persona("她占有欲很强，爱吃醋"), "独占型")
        self.assertEqual(type_for_persona("很黏人，离不开你"), "依存型")
        self.assertEqual(type_for_persona("老是查岗、跟踪我"), "监视型")
        self.assertEqual(type_for_persona("阳光开朗的普通女孩"), "")

    def test_bands(self):
        self.assertEqual(severity_band(0.1), "正常依恋")
        self.assertEqual(severity_band(0.5), "中度")
        self.assertEqual(severity_band(0.9), "极端")

    def test_rejection_and_a_rival_drive_severity_up(self):
        system = AttachmentSystem(enabled=True, type_key="独占型")
        for _ in range(80):
            _feed(system, 1.0)
        self.assertGreater(system.severity(), 0.6)

    def test_steady_warmth_stays_low(self):
        system = AttachmentSystem(enabled=True, type_key="依存型")
        for _ in range(80):
            system.observe_interaction(valence=0.6, sentiment=1.0, latency_seconds=5,
                                       recalled=False, mentions_other=False)
            system.tick(1.0)
        self.assertLess(system.severity(), 0.35)

    def test_rumination_amplifies_uncertainty(self):
        calm = AttachmentDynamics("依存型")
        obsessed = AttachmentDynamics("依存型")
        obsessed.state["O"] = 0.9
        for _ in range(20):
            calm.step(0.2, 0.4, 0.0, 0.0)
            obsessed.step(0.2, 0.4, 0.0, 0.0)
        self.assertGreater(obsessed.severity(), calm.severity())

    def test_safety_guard_at_the_extreme_band(self):
        system = AttachmentSystem(enabled=True, type_key="排除型")
        system.dynamics.state.update({"A": 0.9, "Am": 0.9, "Tr": 0.1, "J": 0.95, "X": 0.95, "O": 0.95})
        self.assertGreaterEqual(system.severity(), 0.85)
        self.assertTrue(system.guard())
        self.assertIn("安全", system.guard())

    def test_no_guard_below_the_safe_band(self):
        system = AttachmentSystem(enabled=True, type_key="依存型")
        self.assertEqual(system.guard(), "")

    def test_disabled_system_does_not_evolve(self):
        system = AttachmentSystem(enabled=False)
        before = system.severity()
        system.tick(30.0)
        self.assertEqual(system.severity(), before)
        self.assertFalse(system.context()["enabled"])

    def test_persona_text_seeds_the_initial_state(self):
        seeded = initial_state_for_persona("她很缺爱，又多疑，特别容易吃醋")
        neutral = initial_state_for_persona("普通、平稳")
        self.assertGreater(seeded["X"], neutral["X"])
        self.assertGreater(seeded["J"], neutral["J"])
        self.assertLess(seeded["S"], neutral["S"])

    def test_depression_feeds_the_attachment_dynamics(self):
        calm = AttachmentSystem(enabled=True, type_key="依存型")
        depressed = AttachmentSystem(enabled=True, type_key="依存型")
        burden = {"mood": -0.8, "anhedonia": 0.8, "load": 0.8, "rumination": 0.8}
        for _ in range(60):
            calm.tick(1.0)
            depressed.tick(1.0, depression=burden)
        self.assertGreater(depressed.severity(), calm.severity())
        self.assertGreater(depressed.depression, 0.0)

    def test_distress_is_exported_for_the_body(self):
        system = AttachmentSystem(enabled=True, type_key="排除型")
        system.dynamics.state.update({"Am": 0.9, "Tr": 0.2, "J": 0.9, "X": 0.9, "O": 0.9})
        self.assertGreater(system.distress(), 0.5)

    def test_round_trip(self):
        system = AttachmentSystem(enabled=True, type_key="妄想型")
        for _ in range(20):
            _feed(system, 1.0)
        restored = AttachmentSystem.from_dict(system.to_dict())
        self.assertEqual(restored.dynamics.type, "妄想型")
        self.assertAlmostEqual(restored.severity(), system.severity(), places=6)


class AttachmentWiring(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.turn = SimpleNamespace(session_id="s1", user_id="u1")

    def tearDown(self):
        self.directory.cleanup()

    def test_off_by_default(self):
        self.assertFalse(self.engine._attachment_enabled)
        self.assertFalse(self.engine.cognition_status()["attachment"]["enabled"])

    def test_a_possessive_persona_enables_it(self):
        self.engine._enable_attachment_from_persona("她占有欲很强，爱吃醋，绝不允许别人靠近")
        self.assertTrue(self.engine._attachment_enabled)
        self.assertEqual(self.engine.attachment.dynamics.type, "独占型")

    def test_the_persona_fills_the_initial_values(self):
        self.engine._enable_attachment_from_persona("她缺爱又多疑，占有欲很强")
        state = self.engine.attachment.dynamics.state
        self.assertGreater(state["X"], 0.05)
        self.assertLess(state["S"], 0.6)

    def test_attachment_distress_reaches_the_body(self):
        self.engine._enable_attachment_from_persona("病娇，占有欲强")
        self.engine.attachment.dynamics.state.update(
            {"Am": 0.9, "Tr": 0.2, "J": 0.95, "X": 0.95, "O": 0.95})
        seen: list[dict] = []
        original = self.engine.affect.observe_outcome

        def spy(*args, **kwargs):
            seen.append(kwargs)
            return original(*args, **kwargs)

        self.engine.affect.observe_outcome = spy
        self.engine._last_affect_at = datetime.now() - timedelta(hours=1)
        self.engine._tick_affect()
        self.assertTrue(any(float(call.get("stressor", 0)) > 0 for call in seen))

    def test_real_feedback_and_time_move_the_state(self):
        self.engine._enable_attachment_from_persona("病娇，很黏人")
        for _ in range(60):
            self.engine._awaiting_feedback["s1"] = {
                "sent_at": (datetime.now() - timedelta(hours=3)).isoformat(),
                "user_id": "u1", "context": {}, "control": {}, "valence": 0.0,
                "response": "hi", "tool_success": 0.0, "tool_failure": 0.0}
            self.engine._receive_feedback(self.turn, "我最近和别人出去玩，别找我了")
            self.engine._last_affect_at = datetime.now() - timedelta(days=1)
            self.engine._tick_affect()
        self.assertGreater(self.engine.attachment.severity(), 0.45)

    def test_attachment_reaches_the_prompt(self):
        self.engine._enable_attachment_from_persona("病娇")
        self.engine.attachment.dynamics.state["O"] = 0.8
        self.engine.attachment.dynamics.state["X"] = 0.8
        self.engine.attachment.dynamics.state["J"] = 0.8
        self.engine.attachment.dynamics.state["Am"] = 0.9
        text = self.engine._render_wave_context()
        self.assertIn("依恋基调", text)

    def test_state_persists_across_a_restart(self):
        self.engine._enable_attachment_from_persona("病娇")
        for _ in range(10):
            _feed(self.engine.attachment, 1.0)
        self.engine.flush_state()
        reopened = LifeEngine(self.directory.name)
        self.assertTrue(reopened.attachment.enabled)
        self.assertAlmostEqual(reopened.attachment.severity(), self.engine.attachment.severity(), places=6)


if __name__ == "__main__":
    unittest.main()
