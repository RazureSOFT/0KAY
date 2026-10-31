import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parent
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from life.companion.legacy import CompanionSystem  # noqa: E402

PANEL = REPO / "plugin-web" / "life" / "src" / "CompanionPage.vue"
STRINGS = [
    REPO / "plugin-web" / "life" / "strings" / "values" / "strings.xml",
    REPO / "plugin-web" / "life" / "strings" / "values-zh" / "strings.xml",
    REPO / "plugin-web" / "life" / "strings" / "values-b+zh+Hant" / "strings.xml",
    REPO / "plugin-web" / "life" / "strings" / "values-ja" / "strings.xml",
]


class SettingsCoverage(unittest.TestCase):
    """Every setting the backend accepts must be editable somewhere in the panel.

    A key with a default but no input is invisible: it silently keeps whatever
    the backend shipped and users have no way to change it.
    """

    def setUp(self):
        self.panel = PANEL.read_text(encoding="utf-8")

    def test_every_backend_setting_is_exposed_in_the_panel(self):
        missing = sorted(key for key in CompanionSystem.SETTING_DEFAULTS if key not in self.panel)
        self.assertEqual(missing, [], f"settings with no panel input: {missing}")

    def test_the_behaviour_table_has_no_duplicate_keys(self):
        table = self.panel.split("const BEHAVIOR_GROUPS", 1)[1]
        keys = re.findall(r"\{ key: '([a-z_0-9]+)'", table)
        self.assertEqual(len(keys), len(set(keys)), "a behaviour key is listed twice")

    def test_every_behaviour_label_has_all_four_locales(self):
        labels = set(re.findall(r"label: 'life\.companion\.(beh\.[A-Za-z]+)'", self.panel))
        self.assertTrue(labels)
        for path in STRINGS:
            with self.subTest(locale=path.parent.name):
                text = path.read_text(encoding="utf-8")
                missing = sorted(name for name in labels if f'<string name="companion.{name}">' not in text)
                self.assertEqual(missing, [], f"{path.parent.name} is missing labels: {missing}")

    def test_behaviour_labels_are_translated_not_copied(self):
        """The English file must not be the only real translation."""
        english = STRINGS[0].read_text(encoding="utf-8")

        def value(text, name):
            match = re.search(r'<string name="companion\.beh\.%s">([^<]*)</string>' % name, text)
            return match.group(1) if match else ""

        chinese = STRINGS[1].read_text(encoding="utf-8")
        for name in ("title", "hint", "enableProactive", "groupEnvironment"):
            with self.subTest(name=name):
                self.assertTrue(value(english, name))
                self.assertNotEqual(value(english, name), value(chinese, name))


if __name__ == "__main__":
    unittest.main()
