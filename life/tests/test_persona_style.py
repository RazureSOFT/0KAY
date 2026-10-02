"""Character archetypes + relationship styles: the many-kinds style layer.

Not every persona is a yandere: the personality dimension and the (healthy and
pathological) relationship dimension are independent, and only the
pathological family may switch the attachment ODE on."""
import asyncio
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition import (
    CHARACTER_TYPES,
    RELATIONSHIP_TYPES,
    classify_character,
    classify_relationship,
    parse_persona,
)
from life.engine import LifeEngine


class StyleLexicon(unittest.TestCase):
    def test_character_archetypes(self):
        self.assertEqual(classify_character("她是个傲娇，嘴硬心软")["key"], "傲娇")
        self.assertEqual(classify_character("温柔体贴，很会照顾人")["key"], "温柔")
        self.assertEqual(classify_character("高冷寡言，惜字如金")["key"], "高冷")
        self.assertEqual(classify_character("完全看不出性格")["key"], "")

    def test_relationship_healthy_vs_pathological(self):
        self.assertEqual(classify_relationship("患得患失，很依赖我")["key"], "焦虑型")
        self.assertFalse(classify_relationship("患得患失，很依赖我")["pathological"])
        self.assertEqual(classify_relationship("她是病娇，离不开我")["key"], "依存型")
        self.assertTrue(classify_relationship("她是病娇，离不开我")["pathological"])

    def test_pathological_marker_wins_over_shared_word(self):
        # "依赖" is a healthy anxious word, but "病娇" must still win.
        result = classify_relationship("病娇，而且很依赖")
        self.assertTrue(result["pathological"])
        self.assertEqual(result["key"], "依存型")

    def test_taxonomies_have_many_kinds(self):
        self.assertGreaterEqual(len(CHARACTER_TYPES), 15)
        self.assertGreaterEqual(len(RELATIONSHIP_TYPES), 15)


class ExpandedTraits(unittest.TestCase):
    def test_style_axes_are_derived_and_bounded(self):
        traits = parse_persona("元气活泼，自来熟，话很多")
        self.assertEqual(traits.character, "元气")
        self.assertGreater(traits.axis_vector()["pace"], 0.5)
        for value in traits.axis_vector().values():
            self.assertGreaterEqual(value, 0.0)
            self.assertLessEqual(value, 1.0)

    def test_relationship_sets_attachment_pair(self):
        traits = parse_persona("她很焦虑，患得患失，很依赖我")
        self.assertEqual(traits.relationship, "焦虑型")
        self.assertAlmostEqual(traits.attach_anxiety, 0.80, places=6)
        self.assertIsNotNone(traits.axis_vector()["warmth"])

    def test_new_fields_survive_round_trip(self):
        traits = parse_persona("高冷、理性、话少")
        restored = type(traits).from_dict(traits.to_dict())
        self.assertEqual(restored.character, traits.character)
        self.assertEqual(restored.axes, traits.axes)
        self.assertEqual(restored.axis_vector(), traits.axis_vector())


class EngineStyleWiring(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()

    def tearDown(self):
        self.directory.cleanup()

    def test_healthy_style_does_not_enable_the_ode(self):
        self.assertEqual(self.engine._persona_attachment_type("她患得患失，很依赖我"), "")
        self.assertEqual(self.engine._persona_attachment_type("她占有欲很强，爱吃醋"), "独占型")

    def test_analyze_reports_character_and_relationship(self):
        result = asyncio.run(self.engine.persona_analyze("她是个傲娇，患得患失，很依赖我"))
        self.assertEqual(result["character"]["key"], "傲娇")
        self.assertEqual(result["relationship"]["key"], "焦虑型")
        self.assertFalse(result["relationship"]["pathological"])
        # A healthy style must never pre-select an attachment archetype.
        self.assertEqual(result["attachment"]["type"], "")
        self.assertTrue(result["options"]["character"])
        self.assertTrue(result["options"]["relationship"])

    def test_applying_a_healthy_style_turns_the_ode_off(self):
        self.engine.persona_apply({
            "text": "她是病娇，离不开我",
            "traits": {},
            "attachment": {"type": "依存型"},
        })
        self.assertTrue(self.engine._attachment_enabled)
        self.engine.persona_apply({
            "text": "换成安全型，情绪稳定",
            "traits": {},
            "attachment": {"type": ""},
        })
        self.assertFalse(self.engine._attachment_enabled)
        self.assertEqual(
            self.engine.companion.get_settings().get("cog_attachment_enabled"), "0")


if __name__ == "__main__":
    unittest.main()
