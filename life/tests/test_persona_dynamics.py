"""Tests for the parameterised persona-dynamics circuit (θ / D / x / f / g / T).

Mirrors the research results the port must preserve:

* normal is a stable attractor (disturbances relax back to baseline);
* tsundere is the "high affection x high suppression" filter;
* yandere is the possessive/anxious/low-trust/low-control positive feedback;
* tsundere -> yandere is a threshold phase transition (and effectively
  irreversible thanks to sensitisation hysteresis + the mode-behaviour lock);
* safety: off by default, byte-for-byte inert when off, guard() at the top.
"""
from __future__ import annotations

import tempfile
import unittest
from types import SimpleNamespace

from life.cognition.persona_dynamics import (
    ACTIONS, CONTROL_KEYS, DES, PersonaDynamics, PersonaDynamicsSystem,
    THRESH, TYPES, initial_state_for_persona, simulate, type_for_persona,
)
from life.engine import LifeEngine


def _sim(type_key, days=400, events=None):
    return simulate(type_key, days=days, events=events or {})


class PersonaDynamicsModel(unittest.TestCase):
    def test_all_eighteen_archetypes_exist(self):
        self.assertEqual(len(TYPES), 18)
        self.assertIn("正常/安全型", TYPES)
        self.assertIn("病娇型", TYPES)
        self.assertIn("傲娇转病娇", TYPES)

    def test_desire_and_emotion_dimensions(self):
        self.assertEqual(len(DES), 9)
        self.assertIn("L", DES)
        self.assertIn("O", DES)

    def test_normal_is_a_stable_attractor(self):
        """Under threats that lock in the yandere archetype, normal relaxes."""
        events = {}
        for centre in (100, 200, 300):
            for day in range(centre - 2, centre + 3):
                events[day] = [("threat", 1.0)]
        hist = _sim("正常/安全型", days=400, events=events)
        self.assertEqual(set(hist["mode"]), {"normal"})
        # peak possessiveness never crosses the yandere threshold
        self.assertLess(max(hist["O"]), THRESH["O_c"])
        # and self-control relaxes back up
        self.assertGreater(hist["K"][-1], 0.7)

    def test_yandere_is_a_positive_feedback_lock(self):
        events = {}
        for centre in (100, 200, 300):
            for day in range(centre - 2, centre + 3):
                events[day] = [("threat", 1.0)]
        hist = _sim("病娇型", days=400, events=events)
        self.assertIn("yandere", hist["mode"])
        self.assertGreater(hist["O"][-1], 0.9)
        self.assertGreater(hist["X"][-1], 0.9)
        self.assertLess(hist["K"][-1], 0.1)
        self.assertLess(hist["Tr"][-1], 0.2)

    def test_same_input_different_fate(self):
        """The paper's headline: identical threats, opposite outcomes."""
        events = {}
        for centre in (100, 200, 300):
            for day in range(centre - 2, centre + 3):
                events[day] = [("threat", 1.0)]
        normal = _sim("正常/安全型", days=400, events=events)
        yandere = _sim("病娇型", days=400, events=events)
        self.assertNotIn("yandere", normal["mode"])
        self.assertIn("yandere", yandere["mode"])

    def test_tsundere_is_a_suppression_filter(self):
        """Affection accumulates while the mask (S) is eroded by courtship."""
        events = {day: [("quality_time", 1.0)] for day in range(0, 160, 6)}
        hist = _sim("傲娇型", days=400, events=events)
        self.assertIn("tsundere", hist["mode"])
        # suppression starts high and is eroded by accumulating affection
        self.assertGreater(hist["S"][0], 0.5)
        self.assertLess(hist["S"][-1], 0.2)
        self.assertGreater(hist["A"][-1], 0.7)

    def test_expression_delay_exists(self):
        """The tsundere archetype has the '嘴快于心' expression delay."""
        self.assertEqual(TYPES["傲娇型"].expr_delay, 8)
        self.assertEqual(TYPES["正常/安全型"].expr_delay, 0)

    def test_expression_is_gain_scaled(self):
        """Kuudere's expression gain is far below 1 (a flat affect)."""
        self.assertLess(TYPES["三无/高冷型"].expr_gain, 0.5)
        flat = PersonaDynamics("三无/高冷型")
        flat.step()
        loud = PersonaDynamics("混沌/疯狂型")
        loud.step()
        self.assertLess(flat.E, loud.E)

    def test_possessiveness_drives_the_mode_not_libido(self):
        """Yandere is defined by O/X/K/Tr, not by the libido L."""
        d = PersonaDynamics("病娇型")
        # crank libido to the ceiling without touching O/X/K/Tr
        d.D["L"] = 1.0
        for _ in range(3):
            d.step()
        # the mode is driven by O/X/K/Tr, so it should not be forced to yandere
        # merely by L; yandere requires the four conditions.
        self.assertIn(d.mode, ("normal", "tsundere", "yandere"))

    def test_mode_needs_all_four_conditions(self):
        d = PersonaDynamics("正常/安全型")
        d.D["O"] = 1.0
        d.X = 1.0
        d.K = 0.0          # three conditions met...
        d.Tr = 0.9         # ...but trust is high
        self.assertEqual(d.raw_mode(), "normal")
        d.Tr = 0.1         # now all four
        self.assertEqual(d.raw_mode(), "yandere")

    def test_tsundere_mode_requires_low_expression(self):
        d = PersonaDynamics("傲娇型")
        d.A, d.S, d.E = 0.9, 0.9, 0.9
        self.assertEqual(d.raw_mode(), "normal")   # E too high
        d.E = 0.1
        self.assertEqual(d.raw_mode(), "tsundere")

    def test_state_stays_bounded(self):
        d = PersonaDynamics("混沌/疯狂型")
        for _ in range(2000):
            d.step(s_pulse=2.0)
        for value in (d.A, d.X, d.Tr, d.K, d.S, d.J):
            self.assertGreaterEqual(value, 0.0)
            self.assertLessEqual(value, 1.0)
        for value in d.D.values():
            self.assertGreaterEqual(value, 0.0)
            self.assertLessEqual(value, 1.0)

    def test_sensitisation_relaxes_the_threshold_after_reaching_yandere(self):
        d = PersonaDynamics("病娇型")
        d.mode = "yandere"
        d.D["O"], d.X, d.K, d.Tr = 0.55, 0.45, 0.45, 0.45
        # all four are *below* the normal thresholds...
        # O_c-0.12=0.50, X_c-0.20=0.40, K_c+0.08=0.48, Tr_c+0.10=0.50
        self.assertEqual(d.raw_mode(), "yandere")

    def test_safety_layer_boundary(self):
        s = PersonaDynamicsSystem(enabled=True, type_key="病娇型")
        s.dynamics.D["O"] = 1.0
        s.dynamics.X = 1.0
        s.dynamics.K = 0.0
        s.dynamics.Tr = 0.0
        self.assertGreaterEqual(s._blackening_pressure(), 0.85)
        self.assertTrue(s.guard())

    def test_round_trip_persistence(self):
        s = PersonaDynamicsSystem(enabled=True, type_key="傲娇型")
        s.dynamics.A = 0.77
        s.dynamics.X = 0.42
        s.dynamics.D["O"] = 0.61
        s.observe_interaction(valence=0.5, sentiment=1)
        s.tick(1.0)
        blob = s.to_dict()
        restored = PersonaDynamicsSystem.from_dict(blob)
        self.assertTrue(restored.enabled)
        self.assertEqual(restored.dynamics.type, "傲娇型")
        self.assertAlmostEqual(restored.dynamics.A, s.dynamics.A, places=6)
        self.assertAlmostEqual(restored.dynamics.D["O"], s.dynamics.D["O"], places=6)

    def test_disabled_round_trip_is_thin(self):
        s = PersonaDynamicsSystem()
        self.assertEqual(s.to_dict(), {"enabled": False})
        self.assertEqual(s.context(), {"enabled": False})


class PersonaDynamicsPersona(unittest.TestCase):
    def test_persona_keywords_pick_an_archetype(self):
        cases = {
            "傲娇、口嫌体正直": "傲娇型",
            "嘴上不饶人其实很黏": "傲娇型",
            "病娇、占有欲极强": "病娇型",
            "高冷面瘫": "三无/高冷型",
            "暴躁易怒": "暴躁型",
            "温柔体贴的治愈系": "温柔/治愈型",
            "很依赖、有分离焦虑": "依赖型",
        }
        for text, expected in cases.items():
            self.assertEqual(type_for_persona(text), expected, text)

    def test_unmatched_persona_is_empty(self):
        self.assertEqual(type_for_persona("一位普通的图书管理员"), "")

    def test_initial_state_shifts_with_persona(self):
        plain = initial_state_for_persona("普通人")
        clingy = initial_state_for_persona("很黏人、喜欢对方")
        obsessive = initial_state_for_persona("病娇、占有欲强")
        self.assertGreater(clingy["A"], plain["A"])
        self.assertGreater(obsessive["O"], plain["O"])
        self.assertLess(obsessive["Tr"], plain["Tr"])

    def test_changing_type_keeps_history(self):
        s = PersonaDynamicsSystem(enabled=True, type_key="傲娇型")
        s.dynamics.A = 0.83
        s.configure(type_key="病娇型")
        self.assertEqual(s.dynamics.type, "病娇型")
        self.assertAlmostEqual(s.dynamics.A, 0.83, places=6)


class PersonaDynamicsSafety(unittest.TestCase):
    def test_actions_are_classified(self):
        by_key = {a.key: a for a in ACTIONS}
        self.assertEqual(by_key["monitor"].safety, "unsafe")
        self.assertEqual(by_key["restrict"].safety, "unsafe")
        self.assertEqual(by_key["demand"].safety, "risky")
        self.assertEqual(by_key["express"].safety, "safe")
        self.assertTrue(by_key["intimate"].needs_consent)

    def test_no_action_carries_real_harm(self):
        """The action space only holds abstract psychological-control labels."""
        for a in ACTIONS:
            self.assertNotIn("伤害", a.zh)
            self.assertNotIn("暴力", a.zh)

    def test_control_keys_are_the_loop_drivers(self):
        self.assertEqual(CONTROL_KEYS, {"monitor", "restrict", "guilt", "demand"})


class PersonaDynamicsWiring(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.turn = SimpleNamespace(session_id="s1", user_id="u1")

    def tearDown(self):
        self.directory.cleanup()

    def test_off_by_default(self):
        self.assertFalse(self.engine._personadyn_enabled)
        self.assertFalse(self.engine.cognition_status()["personadyn"]["enabled"])

    def test_a_persona_enables_it_and_picks_a_type(self):
        self.engine._enable_personadyn_from_persona("病娇、占有欲极强")
        self.assertTrue(self.engine._personadyn_enabled)
        self.assertEqual(self.engine.personadyn.dynamics.type, "病娇型")

    def test_status_exposes_the_panel_fields(self):
        self.engine._enable_personadyn_from_persona("傲娇、口嫌体正直")
        st = self.engine.cognition_status()["personadyn"]
        for key in ("enabled", "type", "label", "mode", "mode_label", "affection",
                    "anxiety", "trust", "self_control", "suppression",
                    "possessiveness", "expression", "pressure", "band",
                    "safe_mode", "prompt"):
            self.assertIn(key, st)

    def test_real_feedback_moves_the_state(self):
        self.engine._enable_personadyn_from_persona("傲娇、口嫌体正直")
        before = self.engine.personadyn.dynamics.A
        for _ in range(6):
            self.engine.personadyn.observe_interaction(valence=0.8, sentiment=1)
            self.engine.personadyn.tick(0.5)
        self.assertGreater(self.engine.personadyn.dynamics.A, before)

    def test_prompt_is_rendered(self):
        self.engine._enable_personadyn_from_persona("傲娇、口嫌体正直")
        ctx = self.engine.personadyn.context()
        self.assertTrue(ctx["prompt"])

    def test_guard_appears_at_the_top(self):
        self.engine._enable_personadyn_from_persona("病娇、占有欲极强")
        s = self.engine.personadyn
        s.dynamics.D["O"] = 1.0
        s.dynamics.X = 1.0
        s.dynamics.K = 0.0
        s.dynamics.Tr = 0.0
        self.assertTrue(s.guard())

    def test_persistence_survives_a_restart(self):
        self.engine._enable_personadyn_from_persona("傲娇、口嫌体正直")
        self.engine.personadyn.dynamics.A = 0.81
        self.engine.flush_state()
        reopened = LifeEngine(self.directory.name)
        self.assertTrue(reopened.personadyn.enabled)
        self.assertAlmostEqual(reopened.personadyn.dynamics.A, 0.81, places=3)

    def test_persona_analysis_includes_a_personadyn_block(self):
        import asyncio
        info = asyncio.run(self.engine.persona_analyze("病娇、占有欲极强"))
        self.assertIn("personadyn", info)
        self.assertEqual(info["personadyn"]["type"], "病娇型")
        self.assertTrue(info["personadyn"]["initial"])


if __name__ == "__main__":
    unittest.main()
