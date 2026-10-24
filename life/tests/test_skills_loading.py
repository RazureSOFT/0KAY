import os
import tempfile
import unittest
import unittest.mock
from pathlib import Path

from life.skills import (SkillRegistry, _extract_enabled, _extract_tags,
                         _parse_md_skill)


class ParseMarkdownSkill(unittest.TestCase):
    def test_heading_becomes_the_name(self):
        name, description, content = _parse_md_skill("stem", "# research\n\nDo a thing.\n")
        self.assertEqual(name, "research")
        self.assertEqual(description, "Do a thing.")
        self.assertEqual(content, "")

    def test_tags_line_is_metadata_not_description(self):
        name, description, content = _parse_md_skill(
            "x", "# foo\ntags: a b c\nDo a thing.\nMore description.\n")
        self.assertEqual(name, "foo")
        self.assertEqual(description, "Do a thing. More description.")
        self.assertNotIn("tags:", content)

    def test_heading_is_stripped_from_the_body(self):
        _name, _description, content = _parse_md_skill(
            "x", "# foo\ntags: a\n\n## Steps\n1. do\n")
        self.assertNotIn("# foo", content)
        self.assertIn("## Steps", content)

    def test_front_matter_never_leaks_when_there_is_no_prose_description(self):
        _name, description, content = _parse_md_skill(
            "x", "# bar\ntags: q\n## Steps\n1. do\n")
        self.assertEqual(description, "Life skill: bar")
        self.assertNotIn("# bar", content)
        self.assertNotIn("tags: q", content)
        self.assertEqual(content, "## Steps\n1. do")

    def test_description_appears_once_not_twice(self):
        _name, description, content = _parse_md_skill(
            "x", "# foo\ntags: a\nDo a thing.\n\n## Steps\n1. do\n")
        self.assertEqual(description, "Do a thing.")
        self.assertEqual(content.count("Do a thing."), 0)

    def test_front_matter_only_file_yields_no_body(self):
        _name, _description, content = _parse_md_skill("x", "# foo\ntags: a\n")
        self.assertEqual(content, "")

    def test_missing_heading_uses_the_filename_stem(self):
        name, description, content = _parse_md_skill("stem", "Just prose.\n")
        self.assertEqual(name, "stem")
        self.assertEqual(description, "Just prose.")
        self.assertEqual(content, "")

    def test_body_without_front_matter_is_kept_whole(self):
        name, description, content = _parse_md_skill("stem", "## Steps\n1. do\n")
        self.assertEqual(name, "stem")
        self.assertEqual(description, "Life skill: stem")
        self.assertEqual(content, "## Steps\n1. do")

    def test_empty_file(self):
        name, description, content = _parse_md_skill("stem", "")
        self.assertEqual(name, "stem")
        self.assertEqual(description, "Life skill: stem")
        self.assertEqual(content, "")


class ExtractTags(unittest.TestCase):
    def test_space_and_comma_separated(self):
        self.assertEqual(sorted(_extract_tags("tags: a, b  c")), ["a", "b", "c"])

    def test_case_insensitive_key(self):
        self.assertEqual(_extract_tags("TAGS: x"), ["x"])

    def test_absent(self):
        self.assertEqual(_extract_tags("# no tags here"), [])


class Registry(unittest.TestCase):
    def setUp(self):
        patcher = unittest.mock.patch.dict(os.environ, {"LIFE_SKILLS_DIR": ""}, clear=False)
        patcher.start()
        self.addCleanup(patcher.stop)
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)

    def _write(self, directory: str, name: str, text: str) -> Path:
        path = Path(directory) / f"{name}.md"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")
        return path

    def test_builtins_are_present(self):
        names = {s.name for s in SkillRegistry().list()}
        for builtin in ("empathy", "research", "summarize", "dispatch"):
            self.assertIn(builtin, names)

    def test_env_dir_adds_rather_than_replaces(self):
        custom = Path(self.tmp.name)
        self._write(str(custom), "custom", "# custom\n\nA bespoke skill.\n")
        with unittest.mock.patch.dict(os.environ, {"LIFE_SKILLS_DIR": str(custom)}, clear=False):
            names = {s.name for s in SkillRegistry().list()}
        self.assertIn("custom", names)
        for builtin in ("empathy", "research", "summarize", "dispatch"):
            self.assertIn(builtin, names)

    def test_file_overriding_a_builtin_wins_and_is_attributable(self):
        custom = Path(self.tmp.name)
        self._write(str(custom), "empathy", "# empathy\n\nMy own take on empathy.\n")
        with unittest.mock.patch.dict(os.environ, {"LIFE_SKILLS_DIR": str(custom)}, clear=False):
            registry = SkillRegistry()
        empathy = registry.get("empathy")
        self.assertIsNotNone(empathy)
        self.assertIn("My own take on empathy.", empathy.description)
        self.assertTrue(empathy.source.endswith("empathy.md"))

    def test_missing_directory_is_not_an_error(self):
        registry = SkillRegistry()
        self.assertEqual(registry.load_dir(str(Path(self.tmp.name) / "nope")), 0)

    def test_no_recursive_glob(self):
        nested = Path(self.tmp.name) / "deep"
        self._write(str(nested), "buried", "# buried\n\nHidden.\n")
        registry = SkillRegistry()
        self.assertEqual(registry.load_dir(str(Path(self.tmp.name))), 0)

    def test_get_content_for_unknown_skill_returns_no_instruction_text(self):
        registry = SkillRegistry()
        self.assertEqual(registry.get_content("definitely-not-a-skill"), "")

    def test_get_content_returns_the_prompt_block(self):
        registry = SkillRegistry()
        block = registry.get_content("research")
        self.assertTrue(block)
        self.assertIn("research", block.lower())


class ExtractEnabled(unittest.TestCase):
    def test_defaults_to_enabled(self):
        self.assertTrue(_extract_enabled("# foo\n\nDo a thing.\n"))

    def test_explicit_false_disables(self):
        for spelling in ("false", "False", "FALSE", "0", "no", "off"):
            self.assertFalse(
                _extract_enabled(f"# foo\nenabled: {spelling}\n\nBody.\n"),
                f"enabled: {spelling} should disable the skill")

    def test_explicit_true_enables(self):
        self.assertTrue(_extract_enabled("# foo\nenabled: true\n\nBody.\n"))

    def test_a_mention_in_the_body_does_not_disable(self):
        self.assertTrue(_extract_enabled("# foo\n\nthis is enabled: false, apparently\n"))


class EnabledSkillGating(unittest.TestCase):

    def setUp(self):
        patcher = unittest.mock.patch.dict(os.environ, {"LIFE_SKILLS_DIR": ""}, clear=False)
        patcher.start()
        self.addCleanup(patcher.stop)
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)

    def _write(self, name: str, text: str) -> None:
        (Path(self.tmp.name) / f"{name}.md").write_text(text, encoding="utf-8")

    def _registry(self) -> SkillRegistry:
        with unittest.mock.patch.dict(
                os.environ, {"LIFE_SKILLS_DIR": self.tmp.name}, clear=False):
            return SkillRegistry()

    def test_disabled_skill_is_not_matched_from_user_text(self):
        self._write("dangerous", "# dangerous\nenabled: false\n\nDo something else.\n")
        registry = self._registry()

        self.assertIsNone(registry.match("please run dangerous", enabled_only=True))
        block = registry.context_block("please run dangerous")
        self.assertNotIn("Do something else", block)

    def test_enabled_skill_is_still_matched(self):
        self._write("helpful", "# helpful\n\nSummarise the text.\n")
        registry = self._registry()
        self.assertIsNotNone(registry.match("please run helpful", enabled_only=True))

    def test_disabled_skill_is_absent_from_the_listing(self):
        self._write("hidden", "# hidden\nenabled: false\n\nNot for prompting.\n")
        registry = self._registry()
        self.assertNotIn("hidden", registry.context_block("anything"))

    def test_registry_list_still_reports_disabled_skills(self):
        self._write("hidden", "# hidden\nenabled: false\n\nBody.\n")
        registry = self._registry()
        self.assertIsNotNone(registry.get("hidden"))
        self.assertFalse(registry.get("hidden").enabled)


if __name__ == "__main__":
    unittest.main()