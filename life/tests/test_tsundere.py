"""The tsundere <-> yandere circuit: a three-variable ODE (affection /
tsundere-expression / fixation) driven by real interaction signals, opt-in,
with a structural safety layer.

Ported from `research/tsundere-yandere/model.py`; these tests reproduce the
reference note's five scenarios against the LIFE façade.
"""
import sys
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition.tsundere import (
    TsundereDynamics,
    TsundereSystem,
    initial_state_for_persona,
    regime,
    type_for_persona,
)
from life.engine import LifeEngine


def _simulate(system, days, dt=0.1, **observe):
    """Advance `days` in dt steps, re-applying one interaction each step."""
    steps = int(round(days / dt))
    for _ in range(steps):
        if observe:
            system.observe_interaction(**observe)
        system.tick(dt)


class TsundereDynamicsTests(unittest.TestCase):
    def test_persona_keywords_pick_an_archetype(self):
        self.assertEqual(type_for_persona("嘴上不饶人的经典傲娇"), "经典傲娇")
        self.assertEqual(type_for_persona("高冷、寡言、冰山"), "高冷傲娇")
        self.assertEqual(type_for_persona("一点就炸，脾气很暴躁"), "暴躁傲娇")
        self.assertEqual(type_for_persona("好脾气，别扭地关心"), "迁就傲娇")
        self.assertEqual(type_for_persona("阳光开朗的普通女孩"), "")

    def test_bands(self):
        self.assertEqual(regime(0.1), "傲娇")
        self.assertEqual(regime(0.4), "过渡/黑化倾向")
        self.assertEqual(regime(0.7), "病娇")

    def test_scenario_1_stable_tsundere(self):
        """Steady kindness + light coldness stays a stable tsundere."""
        system = TsundereSystem(enabled=True)
        _simulate(system, 40, valence=0.4, sentiment=0.2, latency_seconds=600)
        self.assertGreater(system.affection(), 0.7)
        self.assertGreater(system.expression(), 0.6)
        self.assertLess(system.fixation(), 0.20)
        self.assertEqual(system.band(), "傲娇")

    def test_scenario_2_blackening_under_rejection(self):
        """Courtship then withdrawal + rejection -> the character blackens."""
        system = TsundereSystem(enabled=True)
        _simulate(system, 8, valence=0.8, sentiment=1.0, latency_seconds=5)
        self.assertGreater(system.affection(), 0.7)
        _simulate(system, 30, valence=-0.5, sentiment=-1.0,
                  latency_seconds=20000, mentions_other=True)
        self.assertGreater(system.fixation(), 0.45)
        self.assertEqual(system.band(), "病娇")

    def test_scenario_3_reversibility(self):
        """Steady kindness after a blackening drives the fixation back down."""
        system = TsundereSystem(enabled=True)
        _simulate(system, 8, valence=0.8, sentiment=1.0, latency_seconds=5)
        _simulate(system, 30, valence=-0.5, sentiment=-1.0,
                  latency_seconds=20000, mentions_other=True)
        peak = system.fixation()
        self.assertGreater(peak, 0.45)
        _simulate(system, 40, valence=0.8, sentiment=1.0, latency_seconds=5)
        self.assertLess(system.fixation(), 0.25)
        self.assertEqual(system.band(), "傲娇")

    def test_affection_without_rejection_does_not_blacken(self):
        """The core coupling is affection x rejection: warmth alone is safe."""
        system = TsundereSystem(enabled=True)
        _simulate(system, 40, valence=1.0, sentiment=1.0, latency_seconds=5)
        self.assertLess(system.fixation(), 0.10)
        self.assertGreater(system.affection(), 0.8)

    def test_rejection_without_affection_merely_distances(self):
        """Coldness before any attachment must not breed fixation."""
        system = TsundereSystem(enabled=True)
        system.observe_interaction(valence=-1.0, sentiment=-1.0,
                                   latency_seconds=20000, mentions_other=True)
        for _ in range(200):
            # force coldness with the affection driven low
            system.kindness = 0.0
            system.rejection = 1.0
            system.tick(0.1)
        self.assertLess(system.fixation(), 0.30)

    def test_expression_is_suppressed_after_blackening(self):
        """After blackening the '傲' collapses: no more prickly denial."""
        system = TsundereSystem(enabled=True)
        system.dynamics.state.update({"A": 0.95, "T": 0.8, "Y": 0.0})
        t_before = system.expression()
        system.dynamics.state["Y"] = 0.85
        for _ in range(50):
            system.dynamics.step(0.0, 0.8)
        self.assertLess(system.expression(), t_before)

    def test_silence_holds_the_rejection_drive_open(self):
        neglected = TsundereSystem(enabled=True)
        attended = TsundereSystem(enabled=True)
        for _ in range(100):
            neglected.tick(0.1, neglect_days=4.0)
            attended.tick(0.1, neglect_days=0.0)
        self.assertGreater(neglected.rejection, attended.rejection)

    def test_mood_and_load_widen_perceived_rejection(self):
        calm = TsundereSystem(enabled=True)
        low = TsundereSystem(enabled=True)
        # The background tick keeps the interoceptive reading current; the next
        # observed exchange is then *perceived* through it.
        calm.tick(0.1, mood=0.0, load=0.0)
        low.tick(0.1, mood=-0.8, load=0.8)
        for system in (calm, low):
            system.observe_interaction(valence=0.0, sentiment=-0.5, latency_seconds=6000)
        self.assertGreater(low.rejection, calm.rejection)

    def test_safety_guard_at_the_extreme_band(self):
        system = TsundereSystem(enabled=True, type_key="暴躁傲娇")
        system.dynamics.state.update({"A": 0.95, "T": 0.5, "Y": 0.9})
        self.assertGreaterEqual(system.fixation(), 0.85)
        guard = system.guard()
        self.assertTrue(guard)
        # The directive is a *private* one (it is injected into the output
        # prompt), so it is worded to describe the constraint without naming
        # it — "安全" is deliberately absent, or the character would start
        # talking about safety in its own voice.
        self.assertIn("自伤", guard)
        self.assertIn("不得说出", guard)
        self.assertNotIn("安全", guard)

    def test_no_guard_below_the_safe_band(self):
        system = TsundereSystem(enabled=True)
        self.assertEqual(system.guard(), "")

    def test_disabled_system_does_not_evolve(self):
        system = TsundereSystem(enabled=False)
        before = system.fixation()
        system.tick(30.0)
        self.assertEqual(system.fixation(), before)
        self.assertFalse(system.context()["enabled"])

    def test_persona_text_seeds_the_initial_state(self):
        seeded = initial_state_for_persona("毒舌、嘴硬，其实很黏人")
        neutral = initial_state_for_persona("普通、平稳")
        self.assertGreater(seeded["T"], neutral["T"])
        self.assertGreater(seeded["A"], neutral["A"])

    def test_distress_is_exported_for_the_body(self):
        system = TsundereSystem(enabled=True)
        system.dynamics.state["Y"] = 0.9
        self.assertGreater(system.distress(), 0.5)

    def test_round_trip(self):
        system = TsundereSystem(enabled=True, type_key="暴躁傲娇")
        _simulate(system, 5, valence=-0.5, sentiment=-1.0, latency_seconds=9000)
        restored = TsundereSystem.from_dict(system.to_dict())
        self.assertEqual(restored.dynamics.type, "暴躁傲娇")
        self.assertAlmostEqual(restored.fixation(), system.fixation(), places=6)


class TsundereDynamicsArchetypeTests(unittest.TestCase):
    def test_archetypes_diverge(self):
        """Same drives, different archetypes -> different fixation."""
        tame = TsundereDynamics("迁就傲娇")
        fiery = TsundereDynamics("暴躁傲娇")
        for _ in range(200):
            tame.step(0.0, 0.6)
            fiery.step(0.0, 0.6)
        self.assertGreater(fiery.fixation(), tame.fixation())

    def test_integrate_matches_a_manual_loop(self):
        a = TsundereDynamics("经典傲娇")
        b = TsundereDynamics("经典傲娇")
        a.integrate(0.5, 0.3, 2.0)
        for _ in range(40):
            b.step(0.5, 0.3)
        self.assertAlmostEqual(a.state["Y"], b.state["Y"], places=9)


class TsundereWiring(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.turn = SimpleNamespace(session_id="s1", user_id="u1")

    def tearDown(self):
        self.directory.cleanup()

    def test_off_by_default(self):
        self.assertFalse(self.engine._tsundere_enabled)
        self.assertFalse(self.engine.cognition_status()["tsundere"]["enabled"])

    def test_a_tsundere_persona_enables_it(self):
        self.engine._enable_tsundere_from_persona("嘴上不饶人的经典傲娇")
        self.assertTrue(self.engine._tsundere_enabled)
        self.assertEqual(self.engine.tsundere.dynamics.type, "经典傲娇")

    def test_the_persona_fills_the_initial_values(self):
        self.engine._enable_tsundere_from_persona("毒舌、嘴硬、别扭")
        self.assertGreater(self.engine.tsundere.dynamics.state["T"], 0.15)

    def test_real_feedback_and_time_blacken_it(self):
        self.engine._enable_tsundere_from_persona("傲娇、口嫌体正直")
        self.engine.tsundere.dynamics.state["A"] = 0.85
        for _ in range(80):
            self.engine._awaiting_feedback["s1"] = {
                "sent_at": (datetime.now() - timedelta(hours=3)).isoformat(),
                "user_id": "u1", "context": {}, "control": {}, "valence": 0.0,
                "response": "hi", "tool_success": 0.0, "tool_failure": 0.0}
            self.engine._receive_feedback(self.turn, "我最近和别人出去玩，别找我了")
            self.engine._last_affect_at = datetime.now() - timedelta(days=1)
            self.engine._tick_affect()
        self.assertGreater(self.engine.tsundere.fixation(), 0.4)

    def test_tsundere_reaches_the_prompt(self):
        self.engine._enable_tsundere_from_persona("傲娇")
        self.engine.tsundere.dynamics.state.update({"A": 0.8, "T": 0.7, "Y": 0.5})
        text = self.engine._render_wave_context()
        self.assertIn("傲娇底色", text)

    def test_tsundere_distress_reaches_the_body(self):
        self.engine._enable_tsundere_from_persona("傲娇")
        self.engine.tsundere.dynamics.state["Y"] = 0.95
        seen: list[dict] = []
        original = self.engine.affect.observe_outcome

        def spy(*args, **kwargs):
            seen.append(kwargs)
            return original(*args, **kwargs)

        self.engine.affect.observe_outcome = spy
        self.engine._last_affect_at = datetime.now() - timedelta(hours=1)
        self.engine._tick_affect()
        self.assertTrue(any(float(call.get("stressor", 0)) > 0 for call in seen))

    def test_state_persists_across_a_restart(self):
        self.engine._enable_tsundere_from_persona("傲娇")
        self.engine.tsundere.dynamics.state.update({"A": 0.6, "T": 0.5, "Y": 0.4})
        self.engine.flush_state()
        reopened = LifeEngine(self.directory.name)
        self.assertTrue(reopened.tsundere.enabled)
        self.assertAlmostEqual(reopened.tsundere.fixation(), 0.4, places=6)

    def test_the_persona_analysis_carries_a_tsundere_block(self):
        import asyncio
        analysis = asyncio.run(self.engine.persona_analyze("嘴上不饶人的经典傲娇"))
        self.assertEqual(analysis["tsundere"]["type"], "经典傲娇")
        self.assertIn("T", analysis["tsundere"]["initial"])


if __name__ == "__main__":
    unittest.main()
