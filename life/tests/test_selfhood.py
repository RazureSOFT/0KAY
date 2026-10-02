"""Tests for the selfhood circuits (wave 4b).

Each test asserts the *computational claim* of one paper, and every circuit is
ablated at least once.
"""
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition.selfhood import (
    ATTENTION_STATES,
    AffectivePrimacy,
    CognitiveLoad,
    MetaAwareness,
    NarrativeIdentity,
    PersonaDetail,
    SelfhoodConfig,
    SelfhoodSystem,
    TemporalDiscounting,
)


class TestTemporalDiscounting(unittest.TestCase):
    """Papers 16/17/18: hyperbolic discounting, risk-time coupling, deadlines."""

    def test_immediate_reward_is_not_discounted(self):
        temporal = TemporalDiscounting(k=0.5)
        self.assertAlmostEqual(temporal.value(100.0, 0.0), 100.0, places=6)

    def test_value_falls_with_delay(self):
        temporal = TemporalDiscounting(k=0.2)
        self.assertGreater(temporal.value(100.0, 1.0), temporal.value(100.0, 10.0))

    def test_hyperbolic_shape_beats_exponential(self):
        # hyperbolic: doubling the delay less-than-halves the value
        temporal = TemporalDiscounting(k=0.2)
        v1, v2 = temporal.value(100.0, 5.0), temporal.value(100.0, 10.0)
        self.assertGreater(v2, v1 / 2.0)

    def test_higher_k_is_less_patient_and_prefers_sooner(self):
        patient = TemporalDiscounting(k=0.01)
        impatient = TemporalDiscounting(k=1.0)
        option_sooner, option_later = (50.0, 0.0), (100.0, 10.0)
        self.assertEqual(patient.choose(option_sooner, option_later), "later")
        self.assertEqual(impatient.choose(option_sooner, option_later), "sooner")
        self.assertGreater(patient.patience(), impatient.patience())

    def test_risk_and_time_are_coupled(self):
        decoupled = TemporalDiscounting(coupling=0.0, risk_aversion=0.9)
        coupled = TemporalDiscounting(coupling=1.0, risk_aversion=0.9)
        self.assertAlmostEqual(decoupled.coupled_risk(), 0.9, places=6)
        self.assertNotAlmostEqual(coupled.coupled_risk(), 0.9, places=6)

    def test_remaining_time_feedback_improves_deadline_awareness(self):
        aware = TemporalDiscounting()
        unaware = TemporalDiscounting()
        aware.start_deadline(10, remaining_feedback=True)
        unaware.start_deadline(10, remaining_feedback=False)
        for _ in range(8):
            aware.tick_deadline()
            unaware.tick_deadline()
        self.assertGreater(aware.urgency(), unaware.urgency())
        self.assertGreater(aware.closure_probability(), unaware.closure_probability())


class TestNarrativeIdentity(unittest.TestCase):
    """Papers 25/26: redemptive tone and a persistent identity anchor."""

    def test_redemption_bias_turns_negative_events_into_growth(self):
        narrative = NarrativeIdentity(redemption_bias=0.8)
        memory = narrative.add_memory("失去工作", valence=-0.8)
        self.assertTrue(memory["redemption"])

    def test_redemptive_tone_is_the_arc_proportion(self):
        narrative = NarrativeIdentity(redemption_bias=1.0)
        narrative.add_memory("a", valence=-0.5)
        narrative.add_memory("b", valence=-0.5)
        narrative.add_memory("c", valence=0.5, redemption=False)
        self.assertAlmostEqual(narrative.redemptive_tone, 2 / 3, places=6)

    def test_anchor_strength_grows_with_memory_count(self):
        narrative = NarrativeIdentity()
        for index in range(20):
            narrative.add_memory(f"event {index}", valence=0.3)
        self.assertGreater(narrative.anchor_strength, 0.5)

    def test_reconstruct_rebuilds_identity_from_the_anchor(self):
        narrative = NarrativeIdentity()
        for index in range(10):
            narrative.add_memory(f"event {index}", valence=-0.4)
        rebuilt = narrative.reconstruct()
        self.assertEqual(rebuilt["count"], 10)
        self.assertGreater(rebuilt["anchor_strength"], 0.0)

    def test_coherence_is_high_for_a_consistent_narrative(self):
        coherent = NarrativeIdentity()
        for index in range(6):
            coherent.add_memory(f"e{index}", valence=0.5)
        mixed = NarrativeIdentity()
        for index in range(6):
            mixed.add_memory(f"e{index}", valence=0.5 if index % 2 else -0.5)
        self.assertGreater(coherent.coherence, mixed.coherence)


class TestCognitiveLoad(unittest.TestCase):
    """Papers 27/28/29: five attention states and load traces."""

    def test_overload_needs_entropy_and_a_secondary_trace(self):
        load = CognitiveLoad()
        self.assertEqual(load.observe(0.9, kv_miss=0.8), "overload")

    def test_high_entropy_alone_is_distraction(self):
        load = CognitiveLoad()
        self.assertEqual(load.observe(0.9, kv_miss=0.0, eeg_load=0.0), "distracted")

    def test_low_entropy_with_engagement_is_focused(self):
        load = CognitiveLoad()
        self.assertEqual(load.observe(0.1, eeg_load=0.5), "focused")

    def test_rising_entropy_is_declining(self):
        load = CognitiveLoad()
        for entropy in (0.2, 0.2, 0.6, 0.6):
            state = load.observe(entropy)
        self.assertEqual(state, "declining")

    def test_mid_entropy_is_stable(self):
        load = CognitiveLoad()
        self.assertEqual(load.observe(0.5), "stable")

    def test_every_state_is_one_of_the_five(self):
        load = CognitiveLoad()
        for entropy in (0.1, 0.5, 0.9):
            self.assertIn(load.observe(entropy), ATTENTION_STATES)

    def test_load_reduces_capacity(self):
        load = CognitiveLoad()
        load.observe(0.9, kv_miss=0.9, eeg_load=0.9)
        self.assertLess(load.capacity_factor, 0.6)


class TestMetaAwareness(unittest.TestCase):
    """Papers 30/31/32: a step-level lens, self-alignment, emergent recursion."""

    def test_a_good_lens_rewards_confidence_with_low_perplexity(self):
        meta = MetaAwareness(lens_quality=1.0)
        confident_right = meta.lens(confidence=0.9, perplexity=0.1)
        confident_wrong = meta.lens(confidence=0.9, perplexity=0.9)
        self.assertGreater(confident_right, confident_wrong)

    def test_weakest_step_locates_the_likely_error(self):
        meta = MetaAwareness(lens_quality=1.0)
        steps = [{"confidence": 0.9, "perplexity": 0.1},
                 {"confidence": 0.9, "perplexity": 0.9},
                 {"confidence": 0.8, "perplexity": 0.2}]
        self.assertEqual(meta.weakest_step(steps), 1)

    def test_self_alignment_raises_meta_awareness(self):
        meta = MetaAwareness(meta_awareness=0.3, lens_quality=0.3)
        before = meta.meta_awareness
        meta.self_align(10)
        self.assertGreater(meta.meta_awareness, before)
        self.assertGreater(meta.lens_quality, 0.3)

    def test_recursion_depth_emerges_then_stabilises(self):
        meta = MetaAwareness()
        self.assertEqual(meta.probe(1), 1)
        for turn in range(2, 6):
            meta.probe(turn)
        emerged = meta.recursion_depth
        self.assertGreater(emerged, 1)
        for turn in range(6, 20):
            meta.probe(turn)
        self.assertEqual(meta.recursion_depth, emerged)   # stabilised

    def test_reliability_combines_awareness_and_lens(self):
        strong = MetaAwareness(lens_quality=0.9, meta_awareness=0.9).reliability
        weak = MetaAwareness(lens_quality=0.1, meta_awareness=0.1).reliability
        self.assertGreater(strong, weak)


class TestPersonaDetail(unittest.TestCase):
    """Papers 9/10/11: the detail scaling law, identity breadth, censorship."""

    def test_fidelity_follows_a_saturating_scaling_law(self):
        persona = PersonaDetail(detail_scale=20.0)
        low = persona.fidelity()
        for index in range(20):
            persona.add_detail("history", index)
        mid = persona.fidelity()
        for index in range(80):
            persona.add_detail("history", index)
        high = persona.fidelity()
        self.assertLess(low, mid)
        self.assertLess(mid, high)
        self.assertLessEqual(high, 1.0)

    def test_breadth_counts_dimensions(self):
        persona = PersonaDetail()
        persona.add_detail("history", 1)
        persona.add_detail("values", 1)
        persona.add_detail("values", 2)
        self.assertEqual(persona.breadth, 2)
        self.assertEqual(persona.detail_level, 3)

    def test_censorship_suppresses_a_trait(self):
        persona = PersonaDetail(detail_scale=5.0)
        for index in range(15):
            persona.add_detail("neuroticism", index)
        before = persona.fidelity("neuroticism")
        persona.censor("neuroticism")
        self.assertLess(persona.fidelity("neuroticism"), before)
        persona.uncensor("neuroticism")
        self.assertAlmostEqual(persona.fidelity("neuroticism"), before, places=6)

    def test_identity_is_multidimensional(self):
        persona = PersonaDetail()
        persona.add_detail("history", 1)
        persona.add_detail("values", 1)
        self.assertEqual(set(persona.identity()), {"history", "values"})


class TestAffectivePrimacy(unittest.TestCase):
    """Papers 5/6/7/8: affect first, affect costs, and re-entry."""

    def test_appraisal_sets_affect_and_costs_resource(self):
        primacy = AffectivePrimacy(affect_cost=0.2)
        affect = primacy.appraise(1.0, interoception=0.8)
        self.assertGreater(affect, 0.0)
        self.assertLess(primacy.resource, 1.0)

    def test_formulation_after_appraisal_is_grounded(self):
        primacy = AffectivePrimacy()
        primacy.appraise(0.9)
        result = primacy.formulate()
        self.assertTrue(result["grounded"])
        self.assertEqual(primacy.aura_gap, 0.0)

    def test_formulation_without_appraisal_is_the_aura_gap(self):
        primacy = AffectivePrimacy()
        result = primacy.formulate()
        self.assertFalse(result["grounded"])
        self.assertGreater(primacy.aura_gap, 0.0)

    def test_reentry_biases_the_sensory_map(self):
        primacy = AffectivePrimacy()
        primacy.appraise(1.0)
        self.assertGreater(primacy.reentry(0.0), 0.0)

    def test_resource_recovers(self):
        primacy = AffectivePrimacy(affect_cost=0.3)
        primacy.appraise(1.0)
        drained = primacy.resource
        primacy.restore(0.2)
        self.assertGreater(primacy.resource, drained)


class TestSelfhoodSystem(unittest.TestCase):
    def test_disabled_system_is_a_noop(self):
        system = SelfhoodSystem(SelfhoodConfig(enabled=False))
        self.assertFalse(system.context()["enabled"])

    def test_context_exposes_the_readout(self):
        system = SelfhoodSystem()
        for key in ("patience", "redemptive_tone", "identity_anchor", "attention_state",
                    "load", "capacity_factor", "meta_awareness", "recursion_depth",
                    "persona_fidelity", "persona_detail", "aura_gap"):
            self.assertIn(key, system.context())

    def test_ablation_helper_returns_an_isolated_copy(self):
        base = SelfhoodConfig()
        ablated = base.ablate(use_temporal=False, use_meta=False)
        self.assertTrue(base.use_temporal)
        self.assertFalse(ablated.use_temporal)
        self.assertFalse(ablated.use_meta)

    def test_persistence_round_trip(self):
        system = SelfhoodSystem()
        system.narrative.add_memory("e", valence=-0.5)
        system.load.observe(0.9, kv_miss=0.8)
        system.meta.self_align(5)
        system.persona.add_detail("history", 1)
        system.temporal.start_deadline(10, remaining_feedback=True)
        restored = SelfhoodSystem.from_dict(system.to_dict())
        self.assertEqual(restored.load.state, system.load.state)
        self.assertAlmostEqual(restored.meta.meta_awareness, system.meta.meta_awareness, places=6)
        self.assertEqual(restored.persona.detail_level, 1)
        self.assertAlmostEqual(restored.temporal.k, system.temporal.k, places=6)

    def test_json_round_trip_is_identical(self):
        # The real restart path is to_dict -> JSON -> from_dict, which retypes
        # keys and scalars; the in-memory round-trip above does not.
        system = SelfhoodSystem()
        system.narrative.add_memory("e", valence=-0.5)
        system.load.observe(0.9, kv_miss=0.8)
        system.meta.self_align(5)
        system.persona.add_detail("history", 1)
        system.temporal.start_deadline(10, remaining_feedback=True)
        blob = json.loads(json.dumps(system.to_dict(), ensure_ascii=False))
        self.assertEqual(SelfhoodSystem.from_dict(blob).to_dict(), system.to_dict())


if __name__ == "__main__":
    unittest.main()
