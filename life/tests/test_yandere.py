"""Verification tests for the ported yandere affect-dynamics circuit.

These are the research engine's falsifiable inferences (``yandere_engine/
tests/test_engine.py``), re-expressed against the LIFE port. Each test maps to
one claim of 柳・米澤 (2023):

* C1 急変   — affection-gated superlinear reaction gain
* C2 過剰   — superlinear expression intensity
* C3 円環   — circumplex state + hysteretic NORMAL/DERE/YAMI machine
"""
from __future__ import annotations

import os
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))

from life.cognition.yandere import (
    EVENT_EFFECTS,
    MODES,
    TYPES,
    BigFive,
    Event,
    YANDERE_SIGNATURE,
    YandereDynamics,
    YandereSystem,
    emotion_label,
    traits_to_profile,
    type_for_persona,
    yandere_signature_score,
)


def warm_love(agent: YandereDynamics, praises: int = 6) -> None:
    """Accumulate affection past the gate (praise +0.05 each, start 0.15)."""
    for _ in range(praises):
        agent.perceive(Event("praise"))


class TestVocabulary(unittest.TestCase):
    def test_unknown_event_raises(self):
        agent = YandereDynamics()
        with self.assertRaises(ValueError):
            agent.perceive(Event("hug"))  # not in the vocabulary

    def test_clamped_state_never_explodes(self):
        agent = YandereDynamics()
        for _ in range(100):
            rec = agent.perceive(Event("betrayal"))
            self.assertLessEqual(rec.valence, 1.0)
            self.assertGreaterEqual(rec.valence, -1.0)
            self.assertLessEqual(rec.jealousy, 1.0)
            self.assertGreaterEqual(rec.affection, 0.0)

    def test_vocabulary_is_twelve_kinds(self):
        self.assertEqual(len(EVENT_EFFECTS), 12)


class TestCoreClaims(unittest.TestCase):
    """The paper's definition: abrupt flips + excessive expression from affection."""

    def test_love_is_a_precondition_of_yami(self):
        """The same coldness does not blacken a heart that is not attached."""
        cold = [Event("ignore"), Event("contact_rival", weight=1.5),
                Event("ignore"), Event("contact_rival", weight=1.5)]
        detached = YandereDynamics()
        detached.run(cold)  # affection stays at the initial 0.15
        self.assertNotEqual(detached.mode, "yami")

        attached = YandereDynamics()
        warm_love(attached)
        attached.run(cold)
        self.assertEqual(attached.mode, "yami")

    def test_sudden_flip(self):
        """One or two heavy negatives flip the highest happiness into YAMI."""
        agent = YandereDynamics()
        warm_love(agent)
        self.assertEqual(agent.mode, "dere")
        agent.perceive(Event("contact_rival", weight=1.5))
        agent.perceive(Event("contact_rival", weight=1.5))
        self.assertEqual(agent.mode, "yami")
        self.assertLessEqual(agent.v, -0.25)

    def test_excessive_love_expression_is_superlinear(self):
        """The same praise yields a superlinearly larger expression when in love."""
        shallow = YandereDynamics()
        i_shallow = shallow.perceive(Event("chat")).intensity  # A = 0.18

        deep = YandereDynamics()
        warm_love(deep, praises=15)  # A ~ 0.9
        i_deep = deep.perceive(Event("chat")).intensity

        self.assertGreater(i_deep, 2.5 * i_shallow)

    def test_hysteresis_no_snap_back(self):
        """Two praises do not immediately restore DERE (the hysteresis exists)."""
        agent = YandereDynamics()
        warm_love(agent)
        agent.run([Event("contact_rival", weight=1.5), Event("contact_rival", weight=1.5)])
        self.assertEqual(agent.mode, "yami")
        agent.perceive(Event("praise"))
        agent.perceive(Event("praise"))
        self.assertEqual(agent.mode, "yami")

    def test_recovery_needs_apology_and_positive_event(self):
        """Repair needs (1) jealousy-lowering apology and (2) a positive event."""
        agent = YandereDynamics()
        warm_love(agent)
        agent.run([Event("contact_rival", weight=1.5), Event("contact_rival", weight=1.5)])
        agent.run([Event("apologize"), Event("apologize"), Event("reunion")])
        self.assertEqual(agent.mode, "dere")
        self.assertLess(agent.jealousy, 0.35)


class TestTsundereContrast(unittest.TestCase):
    def test_early_praise_is_deflected(self):
        """Tsundere deflects praise while affection is immature (the façade)."""
        agent = YandereDynamics("傲娇")
        rec = agent.perceive(Event("praise"))
        self.assertLess(rec.valence, 0.0)

    def test_late_bloom_dere(self):
        """Past the gate the same praise finally lands (the gap)."""
        agent = YandereDynamics("傲娇")
        for _ in range(12):
            rec = agent.perceive(Event("praise"))
        self.assertEqual(agent.mode, "dere")
        self.assertGreater(rec.valence, 0.15)


class TestProfilesContrast(unittest.TestCase):
    def test_neutral_never_yami_under_cruelty(self):
        agent = YandereDynamics("中性")
        cruel = [Event("ignore"), Event("contact_rival")] * 8
        agent.run(cruel)
        self.assertNotEqual(agent.mode, "yami")

    def test_determinism(self):
        """Same script -> identical trajectory (no hidden RNG)."""
        script = [Event(k) for k in
                  ["chat", "praise", "gift", "ignore", "mention_other", "apologize", "praise"]]
        a1 = YandereDynamics()
        a2 = YandereDynamics()
        sig = lambda rs: [(r.valence, r.arousal, r.mode, r.intensity) for r in rs]
        self.assertEqual(sig(a1.run(script)), sig(a2.run(script)))

    def test_profile_parameters_change_outcome(self):
        """Same stream: the yandere falls to YAMI, the neutral one does not."""
        script = [Event(k) for k in
                  ["praise"] * 6 + ["contact_rival", "contact_rival", "ignore"]]
        yan = YandereDynamics("病娇")
        yan.run(script)
        neu = YandereDynamics("中性")
        neu.run(script)
        self.assertEqual(yan.mode, "yami")
        self.assertNotEqual(neu.mode, "yami")

    def test_all_types_load(self):
        for key in TYPES:
            agent = YandereDynamics(key)
            self.assertEqual(agent.type, key)
            agent.perceive(Event("chat"))
            self.assertIn(agent.mode, MODES)


class TestTraitsBridge(unittest.TestCase):
    def test_signature_scores_high(self):
        self.assertGreater(yandere_signature_score(YANDERE_SIGNATURE), 0.95)

    def test_signature_traits_reach_yami(self):
        """[2] -> [17] -> [1]: the trait signature derives the behavioural one."""
        profile = traits_to_profile(YANDERE_SIGNATURE)
        agent = YandereDynamics("病娇", params={
            "k_excess": profile.k_excess,
            "k_jealousy_sens": profile.k_jealousy_sens,
            "k_rumination": profile.k_rumination,
            "love_theta": profile.love_theta,
            "dere_valence": profile.dere_valence,
            "yami_valence": profile.yami_valence,
            "yami_jealousy": profile.yami_jealousy,
            "dere_margin": profile.dere_margin,
            "excess_expression": profile.excess_expression,
        })
        warm_love(agent)
        agent.run([Event("contact_rival", weight=1.5), Event("contact_rival", weight=1.5)])
        self.assertEqual(agent.mode, "yami")

    def test_low_neuroticism_does_not_blacken(self):
        calm = BigFive(openness=0.5, conscientiousness=0.5, extraversion=0.7,
                       agreeableness=0.9, neuroticism=0.1)
        profile = traits_to_profile(calm)
        self.assertLess(profile.k_excess, traits_to_profile(YANDERE_SIGNATURE).k_excess)
        self.assertLess(yandere_signature_score(calm), 0.5)


class TestCircumplex(unittest.TestCase):
    def test_octant_labels(self):
        self.assertEqual(emotion_label(0.0, 0.0), "neutral")
        self.assertEqual(emotion_label(0.8, 0.8), "happy")
        self.assertEqual(emotion_label(-0.8, 0.8), "distressed")
        self.assertEqual(emotion_label(0.8, -0.8), "relaxed")


class TestFacade(unittest.TestCase):
    def test_disabled_is_inert(self):
        system = YandereSystem(enabled=False)
        system.observe_interaction(valence=0.9)
        system.tick(3.0, neglect_days=10)
        self.assertEqual(system.context(), {"enabled": False})
        self.assertEqual(system.mode(), "normal")
        self.assertEqual(system.guard(), "")
        self.assertEqual(system.distress(), 0.0)

    def test_mentions_other_raises_jealousy(self):
        system = YandereSystem(enabled=True, type_key="病娇")
        for _ in range(6):
            system.observe_interaction(valence=0.6)
        before = system.jealousy()
        system.observe_interaction(valence=0.1, mentions_other=True)
        self.assertGreater(system.jealousy(), before)

    def test_context_shape_and_guard(self):
        system = YandereSystem(enabled=True, type_key="病娇")
        for _ in range(8):
            system.observe_interaction(valence=0.8)
        for _ in range(4):
            system.observe_interaction(valence=0.0, sentiment=-0.9, mentions_other=True)
        ctx = system.context()
        for key in ("enabled", "type", "mode", "affection", "jealousy", "intensity",
                    "darkness", "prompt", "safe_mode", "label_russell"):
            self.assertIn(key, ctx)
        self.assertIn(ctx["mode"], MODES)
        if ctx["safe_mode"]:
            self.assertIn("内部约束", system.guard())

    def test_persistence_round_trip(self):
        system = YandereSystem(enabled=True, type_key="傲娇")
        system.observe_interaction(valence=0.5, mentions_other=True)
        system.tick(1.0, neglect_days=2)
        restored = YandereSystem.from_dict(system.to_dict())
        self.assertEqual(restored.to_dict(), system.to_dict())

    def test_persona_hint_selects_type(self):
        self.assertEqual(type_for_persona("她有点病娇，占有欲很强"), "病娇")
        self.assertEqual(type_for_persona("嘴上不饶人的傲娇"), "傲娇→病娇")
        self.assertEqual(type_for_persona("温柔随和"), "")


if __name__ == "__main__":
    unittest.main()
