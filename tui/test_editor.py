"""Editing the draft: by word, and in a box that fits a long prompt."""

import unittest

from kit.app import MAX_INPUT_ROWS
from test_kit import make_app


def typed(text):
    app, capture = make_app(width=84, height=24)
    for char in text:
        app._handle_key(char)
    return app, capture


class ByWord(unittest.TestCase):
    def test_alt_left_moves_to_the_start_of_the_word(self):
        app, _ = typed("fix the parser now")
        app._handle_key("alt+left")
        self.assertEqual(app.cursor, len("fix the parser "))
        app._handle_key("alt+left")
        self.assertEqual(app.cursor, len("fix the "))
        app._handle_key("alt+left")
        self.assertEqual(app.cursor, len("fix "))

    def test_alt_right_moves_past_the_word(self):
        app, _ = typed("fix the parser now")
        app.cursor = 0
        app._handle_key("alt+right")
        self.assertEqual(app.cursor, len("fix "))
        app._handle_key("alt+right")
        self.assertEqual(app.cursor, len("fix the "))

    def test_moving_by_word_stops_at_the_ends(self):
        app, _ = typed("one")
        app.cursor = 0
        app._handle_key("alt+left")
        self.assertEqual(app.cursor, 0)
        app.cursor = 3
        app._handle_key("alt+right")
        self.assertEqual(app.cursor, 3)

    def test_ctrl_w_deletes_the_word_before_the_caret(self):
        app, _ = typed("fix the parser")
        app._handle_key("ctrl+w")
        self.assertEqual("".join(app.buffer), "fix the ")
        self.assertEqual(app.cursor, len("fix the "))

    def test_alt_backspace_does_the_same(self):
        app, _ = typed("fix the parser")
        app._handle_key("alt+bs")
        self.assertEqual("".join(app.buffer), "fix the ")

    def test_alt_d_deletes_the_word_after_the_caret(self):
        app, _ = typed("fix the parser")
        app.cursor = len("fix ")
        app._handle_key("alt+d")
        self.assertEqual("".join(app.buffer), "fix parser")

    def test_it_works_across_a_newline(self):
        app, _ = typed("first line")
        app._handle_key("shift+enter")
        app._handle_key("a")
        app._handle_key("b")
        app._handle_key("alt+left")
        self.assertEqual("".join(app.buffer)[app.cursor:], "ab")


class EditorMode(unittest.TestCase):
    def _open(self):
        app, capture = typed("")
        app._handle_key("f2")
        return app, capture

    def test_f2_opens_the_editor(self):
        app, _ = self._open()
        self.assertTrue(app.editor)
        self.assertTrue([n for n in app.notices if "draft editor" in n.text])

    def test_enter_adds_a_line_instead_of_sending(self):
        app, _ = self._open()
        for char in "first":
            app._handle_key(char)
        app._handle_key("enter")
        for char in "second":
            app._handle_key(char)
        self.assertTrue(app.editor)
        self.assertEqual("".join(app.buffer), "first" + chr(10) + "second")
        self.assertEqual(app.client.sent, [])

    def test_f2_closes_it_and_keeps_the_text(self):
        app, _ = self._open()
        for char in "keep me":
            app._handle_key(char)
        app._handle_key("f2")
        self.assertFalse(app.editor)
        self.assertEqual("".join(app.buffer), "keep me")

    def test_escape_also_closes_it(self):
        app, _ = self._open()
        app._handle_key("esc")
        self.assertFalse(app.editor)

    def test_the_prompt_grows_to_fit_a_long_draft(self):
        app, capture = typed("")
        app._handle_key("f2")
        for index in range(30):
            for char in f"line {index}":
                app._handle_key(char)
            app._handle_key("enter")
        app._draw()
        # The box is measured by its border rows: top, content, bottom.
        borders = [line for line in capture.frame.lines() if line.startswith("╭")]
        self.assertTrue(borders, "the prompt is still drawn")
        box_height = sum(1 for line in capture.frame.lines()
                         if line.startswith("│")) + 1
        self.assertGreater(box_height, MAX_INPUT_ROWS + 2,
                           "the editor box is taller than the one-line prompt")

    def test_the_footer_says_how_to_leave(self):
        app, capture = self._open()
        app._draw()
        footer = capture.frame.lines()[-1]
        self.assertIn("draft editor", footer)
        self.assertIn("f2", footer)

    def test_submitting_after_leaving_sends_the_whole_text(self):
        app, _ = typed("")
        app._handle_key("f2")
        for char in "one":
            app._handle_key(char)
        app._handle_key("enter")
        for char in "two":
            app._handle_key(char)
        app._handle_key("f2")
        app._handle_key("enter")
        from test_kit import wait_for
        self.assertTrue(wait_for(lambda: app.client.sent))
        self.assertEqual(app.client.sent[-1], "one" + chr(10) + "two")


if __name__ == "__main__":
    unittest.main()
