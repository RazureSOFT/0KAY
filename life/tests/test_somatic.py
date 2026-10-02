"""Tests for the somatization gateway (psychological -> bodily).

Each test asserts the *computational claim* of one paper (or small group), and
every pathway is ablated at least once to prove the knob actually switches.
"""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition.affect import AffectConfig, AffectSystem, InteroceptiveChannel
from life.cognition.somatic import SYMPTOM_CHANNELS, SomaticSymptomSystem


SIGNALS = {"cardiorespiratory": 0.55, "fatigue": 0.35, "pain": 0.2,
           "gastrointestinal": 0.25, "dizziness": 0.2}


def observe(system: SomaticSymptomSystem, **overrides) -> dict:
    kwargs = dict(signals=SIGNALS, bias=0.1, accuracy=0.85, threat=0.2,
                  mood=-0.3, rumination=0.4, inflammation=0.0)
    kwargs.update(overrides)
    return system.observe(**kwargs)


class TestPerceptionGateway(unittest.TestCase):
    """Interoceptive bias amplifies symptom perception (PLOS ONE 2022)."""

    def test_bias_amplifies_perceived_intensity(self):
        low = SomaticSymptomSystem()
        high = SomaticSymptomSystem()
        out_low = observe(low, bias=0.0)
        out_high = observe(high, bias=0.6)
        self.assertGreater(out_high["amplification"], out_low["amplification"])
        self.assertGreater(out_high["burden"], out_low["burden"])

    def test_no_bias_no_amplification(self):
        system = SomaticSymptomSystem()
        out = observe(system, bias=0.0)
        self.assertAlmostEqual(out["amplification"], 1.0, places=6)

    def test_threshold_gates_reporting(self):
        system = SomaticSymptomSystem()
        system.report_threshold = 1.1          # nothing can be reported
        out = observe(system, bias=0.6)
        self.assertEqual(out["report_count"], 0)
        self.assertEqual(out["burden"], 0.0)


class TestAnxietyRoute(unittest.TestCase):
    """Anxiety drives the autonomic channels (Mind-Body Interactions, 2016)."""

    def test_anxiety_labile_channels_lead(self):
        calm = SomaticSymptomSystem(comorbidity_gain=0.0)
        anxious = SomaticSymptomSystem(comorbidity_gain=0.0)
        observe(calm, threat=0.05)
        observe(anxious, threat=0.9)
        cardio_gain = (anxious.channels["cardiorespiratory"]
                       - calm.channels["cardiorespiratory"])
        fatigue_gain = (anxious.channels["fatigue"]
                        - calm.channels["fatigue"])
        self.assertGreater(cardio_gain, fatigue_gain * 2)

    def test_anxiety_route_ablates(self):
        system = SomaticSymptomSystem(comorbidity_gain=0.0)
        system.anxiety_gain = 0.0
        observe(system, threat=0.05)
        before = dict(system.channels)
        observe(system, threat=0.95)
        for name in SYMPTOM_CHANNELS:
            self.assertAlmostEqual(system.channels[name] - before[name],
                                   0.0, delta=1e-9)


class TestDepressionRoute(unittest.TestCase):
    """Depression generates symptoms even without peripheral signal (MDD 2026)."""

    def test_negative_mood_generates_symptoms(self):
        system = SomaticSymptomSystem()
        observe(system, mood=0.0, rumination=0.0, inflammation=0.0)
        healthy = dict(system.channels)
        observe(system, mood=-0.9, rumination=0.8, inflammation=0.0)
        for name in ("fatigue", "pain"):
            self.assertGreater(system.channels[name], healthy[name])

    def test_blunted_accuracy_frees_the_depression_route(self):
        sharp = SomaticSymptomSystem()
        blunt = SomaticSymptomSystem()
        observe(sharp, accuracy=1.0, mood=-0.9, rumination=0.8)
        observe(blunt, accuracy=0.0, mood=-0.9, rumination=0.8)
        self.assertGreater(blunt.channels["fatigue"], sharp.channels["fatigue"])

    def test_depression_route_ablates(self):
        system = SomaticSymptomSystem(comorbidity_gain=0.0, anxiety_gain=0.0)
        system.depression_gain = 0.0
        observe(system, mood=-0.9, rumination=0.8)
        before = dict(system.channels)
        observe(system, mood=-0.9, rumination=0.8)
        for name in SYMPTOM_CHANNELS:
            self.assertAlmostEqual(system.channels[name] - before[name],
                                   0.0, delta=1e-9)


class TestComorbidity(unittest.TestCase):
    """Comorbid anxiety x depression is super-additive (LMIC 2013 / meta 2003)."""

    def test_interaction_multiplier(self):
        alone = SomaticSymptomSystem()
        out_alone = observe(alone, threat=0.8, mood=-0.8, rumination=0.6)
        self.assertGreater(out_alone["comorbidity"], 1.0)

    def test_comorbidity_route_ablates(self):
        system = SomaticSymptomSystem()
        system.comorbidity_gain = 0.0
        out = observe(system, threat=0.8, mood=-0.8, rumination=0.6)
        self.assertAlmostEqual(out["comorbidity"], 1.0, places=6)

    def test_comorbid_exceeds_either_alone(self):
        s = SomaticSymptomSystem()
        out_both = observe(s, threat=0.7, mood=-0.7, rumination=0.5)
        s2 = SomaticSymptomSystem()
        out_anx = observe(s2, threat=0.7, mood=0.0, rumination=0.0)
        s3 = SomaticSymptomSystem()
        out_dep = observe(s3, threat=0.0, mood=-0.7, rumination=0.5)
        self.assertGreater(out_both["burden"], out_anx["burden"])
        self.assertGreater(out_both["burden"], out_dep["burden"])


class TestViciousCircle(unittest.TestCase):
    """Symptom reports -> health anxiety -> more reports (health-anxiety loop)."""

    def test_pathological_escalates_typical_stays_low(self):
        pathological = SomaticSymptomSystem(catastrophizing=0.85)
        typical = SomaticSymptomSystem(catastrophizing=0.20)
        for _ in range(90):
            pathological.tick(86400)
            typical.tick(86400)
            observe(pathological, bias=0.4, threat=0.2)
            observe(typical, bias=0.1, threat=0.2)
        self.assertGreater(pathological.health_anxiety,
                           typical.health_anxiety * 3)
        self.assertGreater(typical.health_anxiety, 0.0)

    def test_health_anxiety_decays_without_reports(self):
        system = SomaticSymptomSystem()
        system.health_anxiety = 0.8
        for _ in range(30):
            system.tick(86400)
        self.assertLess(system.health_anxiety, 0.05)


class TestSpeechAndNorms(unittest.TestCase):
    """SSSC-style speech markers and PCNtoolkit-style deviation scores."""

    def test_index_suppresses_emotion_words_boosts_body_words(self):
        system = SomaticSymptomSystem()
        base = system.speech_features()
        system.health_anxiety = 1.0
        system.reports.extend([0.5] * 14)
        high = system.speech_features()
        self.assertLess(high["emotion_word_ratio"], base["emotion_word_ratio"])
        self.assertGreater(high["body_word_ratio"], base["body_word_ratio"])
        self.assertGreater(high["somatization_index"], base["somatization_index"])

    def test_deviation_score_scales_with_index(self):
        system = SomaticSymptomSystem()
        low = system.deviation(norm_mean=0.2, norm_sd=0.05)
        system.health_anxiety = 1.0
        high = system.deviation(norm_mean=0.2, norm_sd=0.05)
        self.assertGreater(high - low, 5.0)


class TestInterventions(unittest.TestCase):
    """Reappraisal + accuracy training close the bias (CBT / biofeedback)."""

    def test_reappraisal_lowers_catastrophizing(self):
        system = SomaticSymptomSystem(catastrophizing=0.8)
        system.apply_intervention("reappraisal", strength=1.0)
        self.assertLess(system.catastrophizing, 0.8)

    def test_accuracy_training_moves_awareness_toward_accuracy(self):
        system = SomaticSymptomSystem()
        changed = system.apply_intervention("accuracy_training", strength=1.0,
                                            awareness_gain=1.6, accuracy=0.8)
        self.assertLess(changed["awareness_gain"], 1.6)
        self.assertGreater(changed["awareness_gain"], 0.8)

    def test_body_mind_does_both(self):
        system = SomaticSymptomSystem(catastrophizing=0.8)
        changed = system.apply_intervention("body_mind", strength=1.0,
                                            awareness_gain=1.6, accuracy=0.8)
        self.assertIn("catastrophizing", changed)
        self.assertIn("awareness_gain", changed)


class TestAffectIntegration(unittest.TestCase):
    """The gateway composes into AffectSystem behind use_somatic (default off)."""

    def test_default_config_leaves_somatic_off(self):
        system = AffectSystem(AffectConfig())
        self.assertFalse(system.config.use_somatic)
        before = dict(system.somatic.channels)
        system.observe_message("我很心慌", intent="情绪", body=0.7)
        self.assertEqual(system.somatic.channels, before)

    def test_enabled_gateway_closes_the_loop(self):
        system = AffectSystem(AffectConfig(use_somatic=True))
        first = system.somatic.health_anxiety
        for _ in range(40):
            system.observe_message("总是心慌，睡不好", intent="情绪", body=0.7)
        self.assertGreater(system.somatic.health_anxiety, first)
        context = system.context()
        self.assertIn("somatic_burden", context)
        self.assertIn("speech_features", context)
        self.assertGreater(context["somatic_burden"], 0.0)

    def test_tick_decays_when_enabled(self):
        system = AffectSystem(AffectConfig(use_somatic=True))
        system.somatic.health_anxiety = 0.9
        system.tick(86400.0)
        self.assertLess(system.somatic.health_anxiety, 0.9)

    def test_persistence_roundtrip(self):
        system = AffectSystem(AffectConfig(use_somatic=True))
        for _ in range(10):
            system.observe_message("心慌", intent="情绪", body=0.7)
        restored = AffectSystem.from_dict(system.to_dict())
        self.assertAlmostEqual(restored.somatic.index(), system.somatic.index(),
                               places=9)


class TestSensitisation(unittest.TestCase):
    """Repeated reports sensitise a channel - the acute -> chronic trajectory."""

    ZERO = {name: 0.0 for name in SYMPTOM_CHANNELS}

    def test_sensitised_channel_reports_earlier(self):
        system = SomaticSymptomSystem(comorbidity_gain=0.0)
        loud = dict(self.ZERO, cardiorespiratory=0.9)
        for _ in range(40):
            observe(system, **{"signals": loud, "bias": 0.0, "accuracy": 1.0,
                               "threat": 0.0, "mood": 0.0, "rumination": 0.0})
        mild = dict(self.ZERO, cardiorespiratory=0.42)   # below the base threshold
        naive = SomaticSymptomSystem(comorbidity_gain=0.0)
        naive.health_anxiety = 0.0
        system.health_anxiety = 0.0                      # isolate the threshold effect
        out_naive = observe(naive, **{"signals": mild, "bias": 0.0, "accuracy": 1.0,
                                      "threat": 0.0, "mood": 0.0, "rumination": 0.0})
        out_sensitised = observe(system, **{"signals": mild, "bias": 0.0, "accuracy": 1.0,
                                            "threat": 0.0, "mood": 0.0, "rumination": 0.0})
        self.assertGreater(system.sensitivity["cardiorespiratory"], 0.3)
        self.assertEqual(out_naive["report_count"], 0)   # naive stays silent
        self.assertGreater(out_sensitised["report_count"], 0)

    def test_sensitisation_is_state_and_decays_slowly(self):
        system = SomaticSymptomSystem(comorbidity_gain=0.0)
        loud = dict(self.ZERO, cardiorespiratory=0.9)
        for _ in range(20):
            observe(system, **{"signals": loud, "bias": 0.0, "accuracy": 1.0,
                               "threat": 0.0, "mood": 0.0, "rumination": 0.0})
        before = system.sensitivity["cardiorespiratory"]
        for _ in range(30):
            system.tick(86400)
        self.assertLess(system.sensitivity["cardiorespiratory"], before)
        self.assertGreater(system.sensitivity["cardiorespiratory"], 0.0)

    def test_sleep_channel_exists_and_is_depression_labile(self):
        self.assertIn("sleep", SYMPTOM_CHANNELS)
        system = SomaticSymptomSystem(comorbidity_gain=0.0, anxiety_gain=0.0)
        observe(system, signals=dict(self.ZERO, sleep=0.0),
                mood=0.0, rumination=0.0)
        healthy = system.channels["sleep"]
        observe(system, signals=dict(self.ZERO, sleep=0.0),
                mood=-0.9, rumination=0.8)
        self.assertGreater(system.channels["sleep"], healthy)


class TestReassuranceTrap(unittest.TestCase):
    def test_reassurance_relieves_health_anxiety_now(self):
        system = SomaticSymptomSystem()
        system.health_anxiety = 0.8
        out = system.apply_reassurance()
        self.assertLess(system.health_anxiety, 0.8)
        self.assertAlmostEqual(out["relief"], 0.05)

    def test_reassurance_trains_the_loop(self):
        def run(with_reassurance):
            system = SomaticSymptomSystem(comorbidity_gain=0.0, anxiety_sensitivity=1.3)
            if with_reassurance:
                # three comforting replies leave a learned pull behind
                for _ in range(3):
                    system.apply_reassurance()
            # equalise the level so the comparison isolates the *multiplier*
            # effect, not the immediate relief
            system.health_anxiety = 0.5
            for _ in range(4):
                observe(system, bias=0.2, threat=0.2, mood=-0.2)
                system.tick(3600)
            return system.health_anxiety
        self.assertGreater(run(True), run(False) + 0.01)

    def test_reassurance_cue_detection(self):
        self.assertTrue(SomaticSymptomSystem.is_reassurance("别担心，多休息一下就好"))
        self.assertFalse(SomaticSymptomSystem.is_reassurance("你到底怎么回事，又说这些"))

    def test_persistence_keeps_sensitisation(self):
        system = SomaticSymptomSystem()
        system.sensitivity["pain"] = 0.5
        system.reassurance_pull = 0.3
        restored = SomaticSymptomSystem.from_dict(system.to_dict())
        self.assertAlmostEqual(restored.sensitivity["pain"], 0.5)
        self.assertAlmostEqual(restored.reassurance_pull, 0.3)


if __name__ == "__main__":
    unittest.main()
