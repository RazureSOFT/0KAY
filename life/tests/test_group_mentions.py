"""Group "@displayname" resolves to the stable user_id the rest of the system
keys on, so a typed name becomes relationship data instead of dead text."""
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.companion import CompanionSystem


class GroupMentions(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.companion = CompanionSystem(self.directory.name)

    def tearDown(self):
        self.directory.cleanup()

    def test_observing_a_message_stores_the_name_mapping(self):
        self.companion.observe_group("123", "u42", "早上好", name="小明")
        found = self.companion.resolve_group_mentions("123", "小明你在吗")
        self.assertEqual(found, [{"user_id": "u42", "name": "小明"}])

    def test_annotate_replaces_a_bare_name_with_its_id(self):
        self.companion.observe_group("123", "u42", "早起", name="小明")
        annotated = self.companion.annotate_group_mentions("123", "@小明 你怎么看")
        self.assertIn("小明=u42", annotated)

    def test_an_unknown_name_is_not_invented(self):
        self.assertEqual(self.companion.resolve_group_mentions("123", "@小红"), [])
        self.assertEqual(self.companion.annotate_group_mentions("123", "@小红 在吗"), "@小红 在吗")

    def test_names_are_scoped_per_group(self):
        self.companion.observe_group("123", "u42", "hi", name="小明")
        self.assertEqual(self.companion.resolve_group_mentions("456", "小明"), [])

    def test_renaming_the_same_user_updates_the_mapping(self):
        self.companion.observe_group("123", "u42", "hi", name="小明")
        self.companion.observe_group("123", "u42", "hi", name="明明")
        self.assertEqual(self.companion.resolve_group_mentions("123", "明明")[0]["user_id"], "u42")
        self.assertEqual(self.companion.resolve_group_mentions("123", "小明"), [])


if __name__ == "__main__":
    unittest.main()
