"""Tests for persona -> trait parameters (人设 → 模型数据).

The lexicon path must be deterministic and bounded; the LLM refinement path
must never produce a worse result than the lexicon; the engine chain must
apply (and un-apply) the traits on settings changes.
"""
import asyncio
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))


def asyncio_run(coro):
    return asyncio.run(coro)
from life.cognition.affect import AffectConfig, AffectSystem
from life.cognition.persona_traits import (
    PersonaTraits,
    parse_persona,
    persona_summary,
    refine_persona_with_llm,
)
from life.cognition.somatic import SomaticSymptomSystem
from life.companion import CompanionSystem
from life.engine import LifeEngine

PERSONA = "她体弱多病，容易焦虑，经常心慌失眠，遇到事爱钻牛角尖。"


class TestLexicon(unittest.TestCase):
    def test_empty_text_derives_nothing(self):
        traits = parse_persona("")
        self.assertFalse(traits.present)
        self.assertEqual(traits.evidence, {})

    def test_somatic_markers_open_the_gateway(self):
        traits = parse_persona("她经常心慌，睡不好")
        self.assertTrue(traits.use_somatic)
        self.assertIn("somatic_markers", traits.evidence)

    def test_anxious_words_raise_threat_above_default(self):
        traits = parse_persona("他很容易焦虑，紧张，总感不安")
        self.assertIsNotNone(traits.threat_baseline)
        self.assertGreater(traits.threat_baseline, 0.2)   # affect default
        self.assertLessEqual(traits.threat_baseline, 1.0)

    def test_depressive_words_lower_reward(self):
        traits = parse_persona("她一直很悲观，情绪低落")
        self.assertLess(traits.reward_baseline, 1.0)

    def test_two_depressive_words_pin_the_erq_profile(self):
        one = parse_persona("她有点低落")
        two = parse_persona("她一直很悲观，情绪低落")
        self.assertIsNone(one.erq_profile)
        self.assertEqual(two.erq_profile, "depression")

    def test_night_owl_sets_sleep_hour(self):
        traits = parse_persona("她是个夜猫子，天天熬夜")
        self.assertEqual(traits.sleep_hour, 1)

    def test_all_deltas_are_bounded(self):
        extremes = " ".join(word for spec in
                            __import__("life.cognition.persona_traits",
                                       fromlist=["LEXICON"]).LEXICON.values()
                            for word in spec["keywords"])
        traits = parse_persona(extremes)
        data = traits.to_dict()
        from life.cognition.persona_traits import RANGES
        for name, (low, high) in RANGES.items():
            if data[name] is not None:
                self.assertGreaterEqual(data[name], low, name)
                self.assertLessEqual(data[name], high, name)


class TestApply(unittest.TestCase):
    def test_apply_writes_only_the_mentioned_traits(self):
        traits = parse_persona("她经常心慌失眠")
        config = AffectConfig()
        somatic = SomaticSymptomSystem()
        changed = traits.apply(config, somatic)
        self.assertTrue(config.use_somatic)
        self.assertIn("somatic_catastrophizing", changed)
        self.assertAlmostEqual(config.threat_baseline, 0.2)     # untouched
        self.assertAlmostEqual(somatic.anxiety_gain, 1.0)       # untouched

    def test_apply_writes_circadian_sleep_hour(self):
        class FakeCircadian:
            def __init__(self):
                self.sleep_hour = 23
                self.wake_hour = 7
        circadian = FakeCircadian()
        traits = parse_persona("她天天熬夜")
        traits.apply(AffectConfig(), SomaticSymptomSystem(), circadian)
        self.assertEqual(circadian.sleep_hour, 1)
        self.assertEqual(circadian.wake_hour, 9)

    def test_reset_traits_restores_defaults(self):
        somatic = SomaticSymptomSystem(catastrophizing=0.9)
        somatic.reset_traits()
        self.assertAlmostEqual(somatic.catastrophizing, 0.20)
        self.assertAlmostEqual(somatic.report_threshold, 0.45)

    def test_roundtrip_through_dict(self):
        traits = parse_persona(PERSONA)
        restored = PersonaTraits.from_dict(traits.to_dict())
        self.assertAlmostEqual(restored.threat_baseline, traits.threat_baseline)
        self.assertEqual(restored.evidence, traits.evidence)
        self.assertTrue(restored.present)


class TestLLMRefinement(unittest.TestCase):
    def test_valid_llm_json_merges_over_lexicon(self):
        def llm(prompt):
            return '{"threat_baseline": 0.9, "erq_profile": "anxiety", "sleep_hour": 2}'
        traits = refine_persona_with_llm(PERSONA, llm)
        self.assertEqual(traits.source, "llm")
        self.assertAlmostEqual(traits.threat_baseline, 0.9)
        self.assertEqual(traits.erq_profile, "anxiety")
        self.assertEqual(traits.sleep_hour, 2)
        self.assertTrue(traits.use_somatic)          # lexicon baseline kept

    def test_invalid_json_falls_back_to_lexicon(self):
        traits = refine_persona_with_llm(PERSONA, lambda prompt: "这不是JSON")
        self.assertEqual(traits.source, "lexicon")
        self.assertTrue(traits.use_somatic)

    def test_llm_failure_falls_back_to_lexicon(self):
        def boom(prompt):
            raise RuntimeError("offline")
        traits = refine_persona_with_llm(PERSONA, boom)
        self.assertEqual(traits.source, "lexicon")
        self.assertTrue(traits.present)

    def test_out_of_range_llm_values_are_clamped(self):
        def llm(prompt):
            return '{"threat_baseline": 42, "report_threshold": -5}'
        traits = refine_persona_with_llm(PERSONA, llm)
        self.assertLessEqual(traits.threat_baseline, 1.0)
        self.assertGreaterEqual(traits.report_threshold, 0.0)

    def test_cache_is_used(self):
        calls = []

        def llm(prompt):
            calls.append(prompt)
            return '{"threat_baseline": 0.9}'

        with tempfile.TemporaryDirectory() as directory:
            from life.worldsim.llm_cache import LLMCache
            cache = LLMCache(directory)
            first = refine_persona_with_llm(PERSONA, llm, cache=cache)
            second = refine_persona_with_llm(PERSONA, llm, cache=cache)
        self.assertEqual(len(calls), 1)              # second call served by cache
        self.assertAlmostEqual(first.threat_baseline, second.threat_baseline)

    def test_summary_shape(self):
        self.assertEqual(persona_summary(None), {"applied": False})
        summary = persona_summary(parse_persona(PERSONA))
        self.assertTrue(summary["applied"])
        self.assertIn("traits", summary)
        self.assertIn("evidence", summary)


class TestWebUIPersonaChain(unittest.TestCase):
    """The WebUI persona object (gRPC persona_json) -> trait data chain."""

    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)

    def tearDown(self):
        self.directory.cleanup()

    def test_persona_object_flips_somatic_and_traits(self):
        summary = self.engine.apply_persona_object(
            {"name": "小雨", "description": "她体弱多病，经常心慌失眠",
             "personality": "容易焦虑，爱钻牛角尖"})
        self.assertTrue(summary["applied"])
        self.assertTrue(self.engine.affect.config.use_somatic)
        self.assertGreater(self.engine.affect.config.threat_baseline, 0.2)
        self.assertGreater(self.engine.affect.somatic.catastrophizing, 0.20)
        self.assertEqual(summary["evidence"]["somatic_markers"], ["心慌", "失眠"])

    def test_same_persona_is_a_fast_path(self):
        persona = {"description": "她体弱多病，经常心慌失眠", "personality": ""}
        self.engine.apply_persona_object(persona)
        # a runtime intervention lowers catastrophizing; an unchanged persona
        # must NOT re-apply (which would reset the trait)
        self.engine.affect.somatic.apply_intervention("reappraisal")
        lowered = self.engine.affect.somatic.catastrophizing
        self.engine.apply_persona_object(persona)
        self.assertAlmostEqual(self.engine.affect.somatic.catastrophizing, lowered)

    def test_changed_persona_reapplies(self):
        self.engine.apply_persona_object({"description": "她体弱多病，经常心慌失眠",
                                          "personality": ""})
        self.engine.affect.somatic.apply_intervention("reappraisal")
        self.engine.apply_persona_object({"description": "她体弱多病，经常心慌失眠，爱钻牛角尖",
                                          "personality": ""})
        self.assertGreater(self.engine.affect.somatic.catastrophizing, 0.20)

    def test_removing_persona_reverts_to_settings(self):
        self.engine.apply_persona_object({"description": "她体弱多病，经常心慌失眠",
                                          "personality": ""})
        self.assertTrue(self.engine.affect.config.use_somatic)
        self.engine.apply_persona_object(None)
        self.assertFalse(self.engine.affect.config.use_somatic)
        self.assertAlmostEqual(self.engine.affect.somatic.report_threshold, 0.45)

    def test_settings_apply_invalidates_the_digest(self):
        self.engine.companion.set_settings({"cog_affect_threat": 0.1})
        persona = {"description": "她很容易焦虑，紧张", "personality": ""}
        self.engine.apply_persona_object(persona)
        self.assertGreater(self.engine.affect.config.threat_baseline, 0.2)
        # re-applying settings resets the threat baseline to the setting...
        self.engine.apply_cognition_settings()
        self.assertAlmostEqual(self.engine.affect.config.threat_baseline, 0.1)
        # ...and the next persona message re-layers the override on top
        self.engine.apply_persona_object(persona)
        self.assertGreater(self.engine.affect.config.threat_baseline, 0.2)

    def test_process_message_calls_the_chain(self):
        source = (Path(__file__).resolve().parents[1] / "src" / "life" / "engine"
                  / "legacy.py").read_text(encoding="utf-8")
        self.assertIn("apply_persona_object_async(persona", source)


class TestPersonaLLMRefinementChain(unittest.TestCase):
    """The agent's own model re-reads a changed persona into trait JSON."""

    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.companion.set_settings({"cog_affect_persona_llm": 1})

    def tearDown(self):
        self.directory.cleanup()

    def _fake_mocr(self, reply="{}", fail=False):
        calls = []

        class FakeMocr:
            async def generate(self, model_id, messages, system="",
                               thinking=False, max_tokens=1024):
                calls.append((model_id, messages[0]["content"], system))
                if fail:
                    raise RuntimeError("mocr down")
                yield reply

        fake = FakeMocr()
        fake.calls = calls
        return fake

    def test_llm_refinement_wins_and_keeps_lexicon_baseline(self):
        self.engine.mocr = self._fake_mocr(
            reply='{"threat_baseline": 0.9, "erq_profile": "anxiety", "sleep_hour": 2}')
        persona = {"description": PERSONA, "personality": ""}
        summary = asyncio_run(self.engine.apply_persona_object_async(persona))
        self.assertEqual(summary["source"], "llm")
        self.assertAlmostEqual(summary["traits"]["threat_baseline"], 0.9)
        self.assertEqual(summary["traits"]["erq_profile"], "anxiety")
        self.assertEqual(self.engine.circadian.sleep_hour, 2)
        self.assertTrue(self.engine.affect.config.use_somatic)   # lexicon baseline kept
        self.assertEqual(len(self.engine.mocr.calls), 1)
        self.assertIn(PERSONA, self.engine.mocr.calls[0][1])     # prompt carries the persona

    def test_same_persona_calls_the_model_once(self):
        self.engine.mocr = self._fake_mocr(reply="{}")
        persona = {"description": PERSONA, "personality": ""}
        asyncio_run(self.engine.apply_persona_object_async(persona))
        asyncio_run(self.engine.apply_persona_object_async(persona))
        self.assertEqual(len(self.engine.mocr.calls), 1)

    def test_llm_failure_falls_back_to_lexicon(self):
        self.engine.mocr = self._fake_mocr(fail=True)
        summary = asyncio_run(self.engine.apply_persona_object_async(
            {"description": PERSONA, "personality": ""}))
        self.assertEqual(summary["source"], "lexicon")
        self.assertTrue(summary["applied"])
        self.assertTrue(self.engine.affect.config.use_somatic)

    def test_mode_off_skips_the_model(self):
        self.engine.companion.set_settings({"cog_affect_persona_llm": 0})
        self.engine.mocr = self._fake_mocr(reply='{"threat_baseline": 0.9}')
        summary = asyncio_run(self.engine.apply_persona_object_async(
            {"description": PERSONA, "personality": ""}))
        self.assertEqual(len(self.engine.mocr.calls), 0)
        self.assertEqual(summary["source"], "lexicon")

    def test_fenced_llm_reply_is_parsed(self):
        from life.cognition.persona_traits import merge_persona_llm_json
        baseline = parse_persona(PERSONA)
        merged = merge_persona_llm_json(
            baseline, '好的，解析如下：\n```json\n{"threat_baseline": 0.85}\n```')
        self.assertIsNotNone(merged)
        self.assertAlmostEqual(merged.threat_baseline, 0.85)
        self.assertEqual(merged.source, "llm")


class TestEngineChain(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)

    def tearDown(self):
        self.directory.cleanup()

    def test_persona_flips_somatic_and_traits(self):
        self.engine.companion.set_settings({"persona_text": PERSONA})
        self.engine.apply_cognition_settings()
        self.assertTrue(self.engine.affect.config.use_somatic)
        self.assertGreater(self.engine.affect.config.threat_baseline, 0.2)
        self.assertGreater(self.engine.affect.somatic.catastrophizing, 0.20)
        self.assertLess(self.engine.affect.somatic.report_threshold, 0.45)
        status = self.engine.cognition_status()["persona"]
        self.assertTrue(status["applied"])
        self.assertIn("somatic_markers", status["evidence"])

    def test_clearing_persona_resets_the_traits(self):
        self.engine.companion.set_settings({"persona_text": PERSONA})
        self.engine.apply_cognition_settings()
        self.engine.companion.set_settings({"persona_text": ""})
        self.engine.apply_cognition_settings()
        self.assertFalse(self.engine.affect.config.use_somatic)
        self.assertAlmostEqual(self.engine.affect.somatic.catastrophizing, 0.20)
        self.assertAlmostEqual(self.engine.affect.somatic.report_threshold, 0.45)
        self.assertFalse(self.engine.cognition_status()["persona"]["applied"])

    def test_master_switch_forces_somatic_without_persona(self):
        self.engine.companion.set_settings({"cog_affect_somatic": 1})
        self.engine.apply_cognition_settings()
        self.assertTrue(self.engine.affect.config.use_somatic)

    def test_settings_are_registered_and_validated(self):
        self.assertIn("cog_affect_somatic", CompanionSystem.SETTING_DEFAULTS)
        self.assertIn("persona_text", CompanionSystem.SETTING_DEFAULTS)
        self.assertIsNotNone(CompanionSystem.validate_setting("cog_affect_somatic", "1"))
        self.assertIsNotNone(CompanionSystem.validate_setting("persona_text", "她体弱多病"))
        self.assertIsNone(CompanionSystem.validate_setting("cog_affect_somatic", "maybe"))


class TestPersonaDiskCache(unittest.TestCase):
    """LLM trait results persist by persona digest: restarts never re-pay."""

    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.companion.set_settings({"cog_affect_persona_llm": 1})

    def tearDown(self):
        self.directory.cleanup()

    def _fake_mocr(self, reply="{}"):
        calls = []

        class FakeMocr:
            async def generate(self, model_id, messages, system="",
                               thinking=False, max_tokens=1024):
                calls.append(model_id)
                yield reply

        fake = FakeMocr()
        fake.calls = calls
        return fake

    def test_cached_traits_survive_digest_invalidation(self):
        self.engine.mocr = self._fake_mocr(reply='{"threat_baseline": 0.9}')
        persona = {"description": PERSONA, "personality": ""}
        asyncio_run(self.engine.apply_persona_object_async(persona))
        cache_path = Path(self.engine.data_dir) / "persona_traits_cache.json"
        self.assertTrue(cache_path.exists())
        # a settings change invalidates the digest; the cached result is
        # re-applied without calling the model again
        self.engine.apply_cognition_settings()
        summary = asyncio_run(self.engine.apply_persona_object_async(persona))
        self.assertEqual(len(self.engine.mocr.calls), 1)
        self.assertEqual(summary["source"], "llm")
        self.assertAlmostEqual(summary["traits"]["threat_baseline"], 0.9)

    def test_english_persona_derives_traits(self):
        traits = parse_persona("She is cheerful and optimistic but often anxious, "
                               "with insomnia and a frail constitution")
        self.assertTrue(traits.use_somatic)
        self.assertIn("anxious", traits.evidence)
        self.assertGreater(traits.threat_baseline, 0.2)
        self.assertGreater(traits.reward_baseline, 1.0)   # cheerful side


if __name__ == "__main__":
    unittest.main()
