"""Two interface languages, and the promise that neither goes blank."""

import os
import tempfile
import unittest

from kit import i18n
from test_kit import make_app


class Dictionary(unittest.TestCase):
    def tearDown(self):
        i18n.set_language("en")

    def test_english_and_chinese_differ(self):
        i18n.set_language("en")
        english = i18n.t("status.ready")
        i18n.set_language("zh")
        self.assertNotEqual(i18n.t("status.ready"), english)

    def test_every_english_key_has_a_chinese_one(self):
        missing = sorted(set(i18n.EN) - set(i18n.ZH))
        self.assertEqual(missing, [], "an untranslated label would fall back")

    def test_chinese_has_no_keys_english_lacks(self):
        extra = sorted(set(i18n.ZH) - set(i18n.EN))
        self.assertEqual(extra, [], "a typo in a key name shows up here")

    def test_a_missing_key_returns_the_key_not_an_empty_string(self):
        i18n.set_language("zh")
        self.assertEqual(i18n.t("nothing.like.this"), "nothing.like.this")
        self.assertFalse(i18n.has("nothing.like.this"))

    def test_placeholders_are_filled(self):
        i18n.set_language("zh")
        self.assertIn("3", i18n.t("notice.queued", count=3))

    def test_a_broken_placeholder_does_not_raise(self):
        self.assertIn("{count}", i18n.t("notice.queued"))

    def test_an_unknown_language_keeps_the_current_one(self):
        i18n.set_language("zh")
        self.assertEqual(i18n.set_language("klingon"), "zh")


class Interface(unittest.TestCase):
    def tearDown(self):
        i18n.set_language("en")

    def test_the_footer_follows_the_language(self):
        app, capture = make_app(width=110, height=30)
        app._draw()
        english = capture.frame.lines()[-1]
        i18n.set_language("zh")
        app.dirty = True
        app._draw()
        chinese = capture.frame.lines()[-1]
        self.assertNotEqual(english, chinese)
        self.assertIn("帮助", chinese)

    def test_the_status_line_follows_too(self):
        app, capture = make_app(width=110, height=30)
        i18n.set_language("zh")
        app._draw()
        status = [line for line in capture.frame.lines() if "上下文" in line]
        self.assertTrue(status)

    def test_the_command_list_is_translated(self):
        app, _ = make_app()
        i18n.set_language("zh")
        app._run_command("/help")
        body = chr(10).join(app.panel.lines)
        self.assertIn("开一个新会话", body)
        self.assertIn("命令", body)

    def test_a_command_without_a_translation_keeps_its_own_description(self):
        app, _ = make_app()
        app._run_command("/help")
        body = chr(10).join(app.panel.lines)
        self.assertIn("/", body)
        self.assertNotIn("cmd.", body)


class Command(unittest.TestCase):
    def tearDown(self):
        i18n.set_language("en")

    def test_slash_lang_switches(self):
        app, _ = make_app()
        app._run_command("/lang zh")
        self.assertEqual(i18n.language(), "zh")
        self.assertTrue([e for e in app.entries if "语言" in e.text])

    def test_a_bad_value_is_refused(self):
        app, _ = make_app()
        app._run_command("/lang klingon")
        self.assertEqual(i18n.language(), "en")
        self.assertTrue([e for e in app.entries if "/lang zh" in e.text])

    def test_the_picker_offers_both(self):
        app, _ = make_app()
        app._run_command("/lang")
        self.assertEqual(app.panel.choices, ["en", "zh"])

    def test_choosing_from_the_picker_applies(self):
        app, _ = make_app()
        app._run_command("/lang")
        app._handle_key("down")
        app._handle_key("enter")
        self.assertEqual(i18n.language(), "zh")
        self.assertIsNone(app.panel)


class Persistence(unittest.TestCase):
    def tearDown(self):
        i18n.set_language("en")
        os.environ.pop("OKAY_TUI_STATE", None)

    def test_the_choice_survives_a_restart(self):
        with tempfile.TemporaryDirectory() as folder:
            os.environ["OKAY_TUI_STATE"] = os.path.join(folder, "state.json")
            app, _ = make_app()
            app._run_command("/lang zh")
            i18n.set_language("en")
            again, _ = make_app()
            again.restore()
            self.assertEqual(i18n.language(), "zh")


if __name__ == "__main__":
    unittest.main()
