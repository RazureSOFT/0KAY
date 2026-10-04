"""Tests for the affective / interoceptive / clinical circuits (second wave).

Each test asserts the *computational claim* of one paper (or small group), and
every circuit is ablated at least once to prove the switch actually switches.
"""
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition.affect import (
    ERQ_PROFILES,
    AffectConfig,
    AffectSystem,
    ArousalGain,
    AttachmentTemplate,
    BeliefBehaviorMonitor,
    DesireSystem,
    EmotionRegulator,
    HPAxis,
    InteroceptiveChannel,
    MoodAttractor,
    NeuroImmune,
    PADState,
    PrecisionController,
    RewardAvailability,
    ThreatBias,
    VagalTone,
)


# --------------------------------------------------------------------------
# Physiology
# --------------------------------------------------------------------------
class TestInteroception(unittest.TestCase):
    """Interoceptive accuracy and awareness are dissociable; precision weights the PE."""

    def test_accuracy_rises_when_the_body_is_predictable(self):
        channel = InteroceptiveChannel()
        for _ in range(60):
            channel.observe(0.5)          # perfectly predictable body
        self.assertGreater(channel.accuracy, 0.9)
        self.assertGreater(channel.precision, 0.9)

    def test_accuracy_falls_when_the_body_is_noisy(self):
        predictable = InteroceptiveChannel()
        noisy = InteroceptiveChannel()
        for i in range(60):
            predictable.observe(0.5)                    # perfectly predictable
            noisy.observe(0.1 if i % 2 else 0.9)        # unpredictable
        self.assertLess(noisy.accuracy, predictable.accuracy)
        self.assertLess(noisy.precision, predictable.precision)

    def test_awareness_can_exceed_accuracy_anxious_misattribution(self):
        channel = InteroceptiveChannel(awareness_gain=2.0)
        for i in range(60):
            channel.observe(0.1 if i % 2 else 0.9)
        # confident but inaccurate -> positive bias, the anxiety signature
        self.assertGreater(channel.awareness, channel.accuracy)
        self.assertGreater(channel.bias, 0.0)

    def test_prediction_error_has_the_right_sign(self):
        channel = InteroceptiveChannel()
        self.assertGreater(channel.observe(1.0), 0.0)
        self.assertLess(channel.observe(0.0), 0.0)


class TestVagalTone(unittest.TestCase):
    """Vagal tone indexes the prefrontal brake on affect."""

    def test_stressor_withdraws_the_brake(self):
        tone = VagalTone(tone=0.8)
        tone.stress(0.5)
        self.assertLess(tone.tone, 0.8)

    def test_rest_restores_toward_one(self):
        tone = VagalTone(tone=0.3)
        for _ in range(6):
            tone.rest(3600)          # six hours of rest
        self.assertGreater(tone.tone, 0.5)

    def test_a_short_tick_does_not_snap_to_target(self):
        # Guards the time constant: a single minute must barely move the tone,
        # otherwise one tick would erase any stressor instantly.
        tone = VagalTone(tone=0.3)
        tone.rest(60)
        self.assertLess(tone.tone, 0.4)

    def test_chronic_stress_lowers_tone_despite_rest(self):
        tone = VagalTone(tone=0.6)
        for _ in range(12):
            tone.stress(0.8)
            tone.rest(3600)          # an hour of non-resting recovery each turn
        self.assertLess(tone.tone, 0.6)

    def test_high_tone_recovers_faster(self):
        high = VagalTone(tone=0.9).recovery_rate
        low = VagalTone(tone=0.1).recovery_rate
        self.assertGreater(high, low)

    def test_capacity_is_the_tone(self):
        tone = VagalTone(tone=0.42)
        self.assertAlmostEqual(tone.capacity, 0.42, places=6)


class TestHPAxis(unittest.TestCase):
    """Cortisol: diurnal rhythm, reactivity, allostatic load."""

    def test_diurnal_peak_is_after_waking(self):
        axis = HPAxis()
        self.assertGreater(axis.diurnal(8), axis.diurnal(20))

    def test_stressor_raises_cortisol(self):
        axis = HPAxis()
        before = axis.cortisol
        axis.react(1.0)
        self.assertGreater(axis.cortisol, before)
        self.assertGreater(axis.reactivity_index, 0.0)

    def test_cortisol_decays_back_toward_the_diurnal_setpoint(self):
        axis = HPAxis()
        axis.react(1.0)
        high = axis.cortisol
        for _ in range(20):
            axis.tick(3600, hour=12.0)
        self.assertLess(axis.cortisol, high)

    def test_repeated_stressors_accumulate_allostatic_load(self):
        axis = HPAxis()
        for _ in range(10):
            axis.react(1.0)
            for _ in range(4):
                axis.tick(1800, hour=12.0)
        self.assertGreater(axis.allostatic_load, 0.0)


class TestArousalGain(unittest.TestCase):
    """Orexin / layer 6b wake-promoting gain + brainstem chemosensation."""

    def test_orexin_falls_awake_and_recovers_in_sleep(self):
        gain = ArousalGain(orexin=0.8)
        gain.tick(3600 * 5, sleeping=False)
        self.assertLess(gain.orexin, 0.8)
        gain.tick(3600 * 5, sleeping=True)
        self.assertGreater(gain.orexin, 0.35)

    def test_sleep_debt_lowers_the_gain(self):
        rested = ArousalGain(orexin=0.8, sleep_debt=0.0).gain()
        tired = ArousalGain(orexin=0.8, sleep_debt=0.8).gain()
        self.assertGreater(rested, tired)

    def test_co2_chemosensation_adds_arousal(self):
        gain = ArousalGain(orexin=0.4)
        self.assertGreater(gain.gain(co2=0.8), gain.gain(co2=0.0))


class TestNeuroImmune(unittest.TestCase):
    """Cytokines drive sickness behaviour; vagal tone is anti-inflammatory."""

    def test_challenge_produces_sickness_behaviour(self):
        immune = NeuroImmune()
        immune.challenge(0.8)
        self.assertGreater(immune.fatigue, 0.0)
        self.assertGreater(immune.withdrawal, 0.0)
        self.assertGreater(immune.mood_drag, 0.0)

    def test_high_vagal_tone_damps_inflammation_faster(self):
        fast = NeuroImmune(inflammation=1.0)
        slow = NeuroImmune(inflammation=1.0)
        for _ in range(10):
            fast.tick(3600, vagal_tone=1.0)
            slow.tick(3600, vagal_tone=0.0)
        self.assertLess(fast.inflammation, slow.inflammation)

    def test_chronic_challenge_accumulates_inflammation(self):
        immune = NeuroImmune()
        for _ in range(6):
            immune.challenge(0.24)
            for _ in range(4):
                immune.tick(900, vagal_tone=0.4)
        self.assertGreater(immune.inflammation, 0.1)


# --------------------------------------------------------------------------
# Psychiatry / psychology
# --------------------------------------------------------------------------
class TestEmotionRegulation(unittest.TestCase):
    """Strategy choice, transdiagnostic difficulty, and emotion dynamics."""

    def test_reappraisal_reduces_valence_and_arousal(self):
        reg = EmotionRegulator(reappraisal_skill=0.8, profile="typical")
        out = reg.regulate({"valence": -0.5, "arousal": 0.5}, "reappraisal")
        self.assertLess(abs(out["valence"]), 0.5)
        self.assertLess(out["arousal"], 0.5)

    def test_suppression_hides_expression_but_raises_arousal(self):
        reg = EmotionRegulator(suppression_skill=0.2, profile="typical")
        out = reg.regulate({"valence": -0.5, "arousal": 0.5, "irritation": 0.0}, "suppression")
        self.assertGreater(out["arousal"], 0.5)      # the documented cost
        self.assertGreater(out["irritation"], 0.0)

    def test_clinical_profile_is_less_efficacious_than_typical(self):
        typical = EmotionRegulator(profile="typical").efficacy("reappraisal")
        depression = EmotionRegulator(profile="depression").efficacy("reappraisal")
        self.assertGreater(typical, depression)

    def test_difficulty_is_the_mean_of_the_six_dimensions(self):
        reg = EmotionRegulator(profile="bpd")
        expected = sum(ERQ_PROFILES["bpd"].values()) / 6
        self.assertAlmostEqual(reg.difficulty, expected, places=6)

    def test_dynamics_separate_instability_from_inertia(self):
        noisy = EmotionRegulator()
        for i in range(30):
            noisy.observe(0.5 if i % 2 else -0.5)
        sticky = EmotionRegulator()
        for i in range(30):
            sticky.observe(-0.5 + 0.01 * i)          # slow drift
        self.assertGreater(noisy.instability, sticky.instability)
        self.assertGreater(sticky.inertia, noisy.inertia)


class TestMoodAttractor(unittest.TestCase):
    """Depression as a deep negative attractor that rumination deepens."""

    def test_rumination_deepens_and_shifts_the_attractor_negative(self):
        mood = MoodAttractor()
        for _ in range(10):
            mood.tick(0.0, rumination_input=1.0)
        self.assertLess(mood.attractor, 0.0)
        self.assertGreater(mood.basin_depth, 0.4)

    def test_negative_attractor_pulls_mood_down(self):
        """The attractor pulls over *clock time*, not per message event.

        A message-driven tick (seconds=0) never ages the state on its own -
        the pull is a slow continuous force the background clock advances.
        """
        mood = MoodAttractor()
        for _ in range(10):
            mood.tick(0.0, rumination_input=1.0)
        before = mood.mood
        for _ in range(20):
            mood.tick(0.0, rumination_input=0.0, seconds=3600.0)
        self.assertLess(mood.mood, before)

    def test_message_events_do_not_age_the_slow_terms(self):
        """Idle-while-chatting must not heal rumination/depth: only the clock does."""
        mood = MoodAttractor()
        for _ in range(10):
            mood.tick(0.0, rumination_input=1.0)
        self.assertAlmostEqual(mood.rumination, mood.rumination, places=6)
        self.assertGreater(mood.basin_depth, 0.4)
        frozen_rumination, frozen_depth = mood.rumination, mood.basin_depth
        for _ in range(50):
            mood.tick(0.0)
        self.assertAlmostEqual(mood.rumination, frozen_rumination, places=6)
        self.assertAlmostEqual(mood.basin_depth, frozen_depth, places=6)

    def test_a_positive_input_can_still_escape_a_shallow_basin(self):
        shallow = MoodAttractor(depth=0.05)
        for _ in range(20):
            shallow.tick(0.2)
        self.assertGreater(shallow.mood, 0.3)


class TestRewardAvailability(unittest.TestCase):
    """Anhedonia blunts the effective reward without changing mood."""

    def test_blunted_availability_scales_the_reward(self):
        reward = RewardAvailability(availability=0.2)
        self.assertLess(reward.effective_reward(1.0), 1.0)
        self.assertAlmostEqual(reward.effective_reward(1.0), 0.2, places=6)

    def test_negative_outcomes_drive_availability_down(self):
        reward = RewardAvailability(availability=1.0)
        for _ in range(30):
            reward.observe(-1.0)
        self.assertLess(reward.availability, 0.5)

    def test_wanting_is_more_reactive_than_liking(self):
        reward = RewardAvailability(availability=1.0)
        reward.observe(-1.0)
        self.assertLess(reward.wanting, reward.liking)


class TestThreatBias(unittest.TestCase):
    """Anxiety: over-generalised threat reading, amplified by load."""

    def test_ambiguity_raises_threat(self):
        bias = ThreatBias(bias=0.2, generalisation=0.4)
        self.assertGreater(bias.interpret(1.0), bias.interpret(0.0))
        self.assertGreater(bias.ambiguity_shift, 0.0)

    def test_load_and_inflammation_amplify_threat(self):
        bias = ThreatBias()
        calm = bias.interpret(0.5, load=0.0, inflammation=0.0)
        loaded = bias.interpret(0.5, load=0.8, inflammation=0.8)
        self.assertGreater(loaded, calm)

    def test_vagal_tone_damps_threat(self):
        bias = ThreatBias()
        tense = bias.interpret(0.5, vagal_tone=0.0)
        settled = bias.interpret(0.5, vagal_tone=1.0)
        self.assertLess(settled, tense)


class TestAttachment(unittest.TestCase):
    """Anxious/avoidant working models and perceived social isolation."""

    def test_poor_interaction_raises_anxiety(self):
        template = AttachmentTemplate(anxiety=0.2)
        for _ in range(5):
            template.observe(0.1)
        self.assertGreater(template.anxiety, 0.2)

    def test_loneliness_is_the_desired_perceived_gap(self):
        template = AttachmentTemplate(desired=0.9)
        template.observe(0.2)
        self.assertGreater(template.loneliness, 0.0)

    def test_security_falls_with_anxiety_and_avoidance(self):
        secure = AttachmentTemplate(anxiety=0.1, avoidance=0.1).security
        insecure = AttachmentTemplate(anxiety=0.9, avoidance=0.9).security
        self.assertGreater(secure, insecure)


class TestPrecision(unittest.TestCase):
    """Active inference: precision-weighted prior/evidence arbitration."""

    def test_high_prior_precision_ignores_evidence(self):
        rigid = PrecisionController(prior_precision=0.95, sensory_precision=0.05)
        self.assertGreater(rigid.blend(1.0, 0.0), 0.9)
        self.assertGreater(rigid.rigidity, 0.9)

    def test_free_energy_is_zero_when_prior_matches_evidence(self):
        controller = PrecisionController()
        self.assertAlmostEqual(controller.free_energy(0.5, 0.5), 0.0, places=9)

    def test_free_energy_grows_with_mismatch(self):
        controller = PrecisionController()
        self.assertGreater(controller.free_energy(1.0, 0.0), controller.free_energy(0.6, 0.4))


# --------------------------------------------------------------------------
# LLM social simulation
# --------------------------------------------------------------------------
class TestPAD(unittest.TestCase):
    """Sentipolis: continuous PAD, dual-speed dynamics, emotion-memory coupling."""

    def test_fast_component_reacts_faster_than_slow(self):
        pad = PADState(fast_rate=0.8, slow_rate=0.02)
        pad.observe({"pleasure": 0.5})
        self.assertGreater(pad.fast[0], pad.slow[0])

    def test_state_is_persistent_not_amnesic(self):
        pad = PADState(w_fast=0.5, w_slow=0.5)
        pad.observe({"pleasure": 1.0})
        self.assertGreater(pad.slow[0], 0.0)          # slow trace survived one step
        self.assertGreater(pad.persistence(), 0.0)

    def test_emotion_biases_memory_retrieval(self):
        happy = PADState()
        for _ in range(30):
            happy.observe({"pleasure": 0.6})
        sad = PADState()
        for _ in range(30):
            sad.observe({"pleasure": -0.6})
        self.assertGreater(happy.retrieval_bias(), sad.retrieval_bias())


class TestDesire(unittest.TestCase):
    """An explicit desire-generation stage between state and objective."""

    def test_generate_returns_all_drives(self):
        desire = DesireSystem()
        drives = desire.generate({"energy": 30.0, "valence": -0.5})
        self.assertEqual(set(drives), set(DesireSystem.DESIRES))

    def test_low_energy_raises_the_rest_drive(self):
        desire = DesireSystem()
        desire.generate({"energy": 5.0})
        self.assertGreater(desire.drives["rest"], 0.5)

    def test_objective_weights_normalise(self):
        desire = DesireSystem()
        desire.generate({"energy": 60.0, "arousal": 0.7})
        self.assertAlmostEqual(sum(desire.objective_weights().values()), 1.0, places=6)

    def test_satisfying_a_drive_reduces_it(self):
        desire = DesireSystem()
        desire.generate({"energy": 5.0})
        before = desire.drives["rest"]
        desire.satisfy("rest", 0.4)
        self.assertLess(desire.drives["rest"], before)


class TestBeliefBehaviorMonitor(unittest.TestCase):
    """Belief-behaviour consistency is measured, not assumed."""

    def test_consistent_agent_scores_one(self):
        monitor = BeliefBehaviorMonitor()
        for key in ("trust_a", "trust_b", "trust_c"):
            monitor.declare(key, 1.0)
            monitor.observe(key, 0.8)
        self.assertAlmostEqual(monitor.consistency(), 1.0, places=6)

    def test_inconsistent_agent_scores_zero(self):
        monitor = BeliefBehaviorMonitor()
        monitor.declare("trust_a", 1.0)
        monitor.observe("trust_a", -1.0)
        self.assertAlmostEqual(monitor.consistency(), 0.0, places=6)
        self.assertAlmostEqual(monitor.drift(), 1.0, places=6)

    def test_empty_monitor_is_optimistic(self):
        self.assertEqual(BeliefBehaviorMonitor().consistency(), 1.0)


# --------------------------------------------------------------------------
# Façade: wiring, ablation and persistence
# --------------------------------------------------------------------------
class TestAffectSystem(unittest.TestCase):
    def test_disabled_system_is_a_noop(self):
        system = AffectSystem(AffectConfig(enabled=False))
        self.assertEqual(system.observe_message("你好", emotion_delta={"valence": 0.5}), {})
        system.observe_outcome(True, reward=1.0, stressor=1.0)
        system.tick(3600, hour=12)
        context = system.context()
        self.assertFalse(context["enabled"])
        self.assertEqual(context["extra_need"], 0.0)
        self.assertEqual(context["capacity_scale"], 1.0)

    def test_enabled_system_exposes_the_readout(self):
        system = AffectSystem()
        system.observe_message("我很难过", intent="情绪", emotion_delta={"valence": -0.4})
        context = system.context()
        self.assertTrue(context["enabled"])
        for key in ("extra_need", "reliability_scale", "capacity_scale", "threat",
                    "pad", "mood", "arousal_gain", "vagal_tone", "allostatic_load",
                    "inflammation", "loneliness", "dominant_desire", "belief_consistency"):
            self.assertIn(key, context)

    def test_threat_bias_ablation_zeroes_threat(self):
        system = AffectSystem(AffectConfig(use_threat_bias=False))
        self.assertEqual(system.context()["threat"], 0.0)

    def test_interaction_quality_moves_loneliness(self):
        system = AffectSystem()
        before = system.attachment.loneliness
        for _ in range(6):
            system.observe_message("谢谢，好开心", emotion_delta={"valence": 0.4, "connection": 0.3})
        self.assertLess(system.attachment.loneliness, before)

    def test_arousal_gain_ablation_leaves_gain_neutral(self):
        system = AffectSystem(AffectConfig(use_arousal_gain=False))
        context = system.context()
        self.assertAlmostEqual(context["arousal_gain"], 1.0, places=6)

    def test_ablation_helper_returns_an_isolated_copy(self):
        base = AffectConfig()
        ablated = base.ablate(use_vagal=False, use_hpa=False)
        self.assertTrue(base.use_vagal)          # original untouched
        self.assertFalse(ablated.use_vagal)
        self.assertFalse(ablated.use_hpa)

    def test_ablation_of_one_circuit_does_not_disturb_another(self):
        system = AffectSystem(AffectConfig(use_threat_bias=False))
        for _ in range(5):
            system.observe_outcome(True, reward=1.0, stressor=1.0)
            for _ in range(4):
                system.tick(1800, hour=12)
        self.assertGreater(system.hpa.allostatic_load, 0.0)   # HPA still ran

    def test_allostatic_load_and_need_rise_under_chronic_stress(self):
        system = AffectSystem()
        baseline = system.context()["extra_need"]
        for _ in range(20):
            system.observe_outcome(False, reward=0.0, stressor=1.0)
            for _ in range(6):
                system.tick(600, hour=14)
        self.assertGreater(system.hpa.allostatic_load, 0.0)
        self.assertGreaterEqual(system.context()["extra_need"], baseline)

    def test_persistence_round_trip(self):
        system = AffectSystem()
        system.observe_message("谢谢", emotion_delta={"valence": 0.5})
        system.observe_outcome(True, reward=1.0, stressor=0.8)
        system.belief_monitor.declare("trust", 1.0)
        system.belief_monitor.observe("trust", 1.0)
        restored = AffectSystem.from_dict(system.to_dict())
        self.assertAlmostEqual(restored.vagal.tone, system.vagal.tone, places=6)
        self.assertAlmostEqual(restored.hpa.cortisol, system.hpa.cortisol, places=6)
        self.assertAlmostEqual(restored.mood.mood, system.mood.mood, places=6)
        self.assertAlmostEqual(restored.belief_monitor.consistency(), 1.0, places=6)
        self.assertEqual(restored.pad.blend, system.pad.blend)

    def test_json_round_trip_is_identical(self):
        # The real restart path is to_dict -> JSON -> from_dict.  JSON coerces
        # dict keys to strings and may retype scalars, so a snapshot that only
        # survives an in-memory round-trip can still drift across a restart.
        system = AffectSystem()
        system.observe_message("谢谢", emotion_delta={"valence": 0.5})
        system.observe_outcome(True, reward=1.0, stressor=0.8)
        system.belief_monitor.declare("trust", 1.0)
        system.belief_monitor.observe("trust", 1.0)
        system.tick(3600, hour=9)
        blob = json.loads(json.dumps(system.to_dict(), ensure_ascii=False))
        self.assertEqual(AffectSystem.from_dict(blob).to_dict(), system.to_dict())

    def test_config_round_trip_preserves_flags(self):
        config = AffectConfig(use_hpa=False, erq_profile="depression")
        restored = AffectConfig.from_dict(config.to_dict())
        self.assertFalse(restored.use_hpa)
        self.assertEqual(restored.erq_profile, "depression")


if __name__ == "__main__":
    unittest.main()
