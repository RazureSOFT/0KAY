import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life import prompt as prompt_sections
from life.engine import LifeEngine
from life.extensions import ExtensionRegistry, ExtensionUnavailable


class PromptSections(unittest.TestCase):
    def test_render_modes(self):
        sections = [prompt_sections.section("a", "标题A", "正文A"),
                    prompt_sections.section("b", "标题B", "正文B")]
        self.assertEqual(prompt_sections.render(sections), "正文A\n\n正文B")
        labeled = prompt_sections.render(sections, prompt_sections.RenderMode.LABELED_BLOCK)
        self.assertIn("### 标题A\n正文A", labeled)
        self.assertIn("### 标题B\n正文B", labeled)

    def test_empty_sections_are_skipped(self):
        self.assertEqual(prompt_sections.render([prompt_sections.section("a", "t", "  ")]), "")


class ExtensionRegistryTests(unittest.TestCase):
    def test_fail_closed_defaults(self):
        registry = ExtensionRegistry()
        registry.register("tts", probe=lambda: False, detail="no endpoint")
        registry.register("image", probe=lambda: True)
        self.assertFalse(registry.is_available("tts"))
        self.assertTrue(registry.is_available("image"))
        self.assertFalse(registry.is_available("unknown"))
        self.assertEqual(registry.status()["tts"]["reason"], "no endpoint")

    def test_call_raises_when_unavailable(self):
        registry = ExtensionRegistry()
        registry.register("tts", probe=lambda: False)
        with self.assertRaises(ExtensionUnavailable):
            registry.call("tts", lambda: "audio")

    def test_engine_registers_known_extensions(self):
        with tempfile.TemporaryDirectory() as directory:
            engine = LifeEngine(directory)
            status = engine.extension_status()
            for name in ("tts", "image", "content", "qzone", "vision"):
                self.assertIn(name, status)
            self.assertFalse(status["qzone"]["available"])


if __name__ == "__main__":
    unittest.main()
