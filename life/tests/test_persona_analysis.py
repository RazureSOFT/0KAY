"""Persona analysis + tuning: the model reads the persona into parameters, the
owner reviews/tunes them, and only then are they persisted (and applied)."""
import asyncio
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.engine import LifeEngine


class PersonaAnalysis(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()

    def tearDown(self):
        self.directory.cleanup()

    def test_analyze_returns_traits_and_attachment_without_saving(self):
        result = asyncio.run(self.engine.persona_analyze("她占有欲很强，爱吃醋，缺乏安全感"))
        self.assertIn("traits", result)
        self.assertEqual(result["attachment"]["type"], "独占型")
        self.assertIn("X", result["attachment"]["initial"])
        # Analysing must not persist anything.
        self.assertEqual(self.engine.companion.get_settings().get("persona_text"), "")
        self.assertFalse(self.engine._attachment_enabled)

    def test_tuned_parameters_are_applied_and_persisted(self):
        self.engine.persona_apply({
            "text": "她占有欲很强",
            "traits": {"threat_baseline": 0.9, "reward_baseline": 0.4, "erq_profile": "depression"},
            "attachment": {"type": "独占型", "initial": {"X": 0.8, "S": 0.1}},
        })
        # Persisted...
        settings = self.engine.companion.get_settings()
        self.assertEqual(settings.get("persona_text"), "她占有欲很强")
        self.assertIn("独占型", settings.get("attachment_override"))
        # ...and applied to the live systems (clamped to valid ranges).
        self.assertAlmostEqual(self.engine.affect.config.threat_baseline, 0.9, places=6)
        self.assertEqual(self.engine.affect.config.erq_profile, "depression")
        self.assertTrue(self.engine._attachment_enabled)
        self.assertEqual(self.engine.attachment.dynamics.type, "独占型")
        self.assertAlmostEqual(self.engine.attachment.dynamics.state["X"], 0.8, places=6)
        self.assertAlmostEqual(self.engine.attachment.dynamics.state["S"], 0.1, places=6)

    def test_the_override_survives_a_webui_persona_message(self):
        self.engine.persona_apply({
            "text": "她占有欲很强",
            "traits": {"threat_baseline": 0.9},
            "attachment": {"type": "独占型", "initial": {"X": 0.8}},
        })
        # A different persona object arrives with the next chat message.
        asyncio.run(self.engine.apply_persona_object_async(
            {"description": "普通、阳光的女孩", "personality": "开朗"}))
        # The tuned value still wins over the raw parse of the new text.
        self.assertAlmostEqual(self.engine.affect.config.threat_baseline, 0.9, places=6)

    def test_attachment_settings_are_settable(self):
        result = self.engine.companion.set_settings(
            {"cog_attachment_enabled": "1", "cog_attachment_type": "妄想型"})
        self.assertNotIn("cog_attachment_enabled", result.get("rejected", []))
        self.assertNotIn("cog_attachment_type", result.get("rejected", []))
        saved = self.engine.companion.get_settings()
        self.assertEqual(saved["cog_attachment_enabled"], "1")
        self.assertEqual(saved["cog_attachment_type"], "妄想型")


if __name__ == "__main__":
    unittest.main()
