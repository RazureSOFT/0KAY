"""Tests for key decoding, with the emphasis on paste.

Pasting used to be the dangerous path: the text arrived as keystrokes, so a
pasted newline submitted half a message. These cover both halves of the fix --
the terminal telling us where the paste starts, and the client inserting it as
text.
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from kit.app import App, _looks_like_paste
from kit.screen import KeyReader
from kit.theme import build


class _Client:
    base_url = "http://127.0.0.1:8080"

    def get(self, path):
        return {}


def _app():
    return App(_Client(), build("dark"), None, None, None)


class BracketedPaste(unittest.TestCase):
    """The escape sequences themselves."""

    def _keys(self, text):
        reader = KeyReader()
        reader._buffer = text
        return reader._drain_buffer()

    def test_the_paste_body_arrives_as_one_key(self):
        keys = self._keys("a\x1b[200~hello\x1b[201~b")
        self.assertEqual(keys, ["a", "paste:hello", "b"])

    def test_newlines_inside_a_paste_stay_text(self):
        keys = self._keys("\x1b[200~one\ntwo\thtree\x1b[201~")
        self.assertEqual(keys, ["paste:one\ntwo\thtree"])

    def test_escape_sequences_inside_a_paste_are_not_keys(self):
        # Pasting text that happens to contain \x1b[A must not move a cursor.
        keys = self._keys("\x1b[200~literal \x1b[A here\x1b[201~")
        self.assertEqual(keys, ["paste:literal \x1b[A here"])

    def test_an_unfinished_paste_is_held(self):
        reader = KeyReader()
        reader._buffer = "\x1b[200~half"
        self.assertEqual(reader._drain_buffer(), [])
        reader._buffer = " a\x1b[201~"
        self.assertEqual(reader._drain_buffer(), ["paste:half a"])

    def test_a_normal_csi_is_still_a_key(self):
        self.assertEqual(self._keys("\x1b[A"), ["up"])


class Wheel(unittest.TestCase):
    """The wheel arrives as SGR mouse reports, not as keys."""

    def _keys(self, text):
        reader = KeyReader()
        reader._buffer = text
        return reader._drain_buffer()

    def test_wheel_up_and_down_are_named(self):
        self.assertEqual(self._keys(chr(27) + "[<64;10;5M"), ["wheel_up"])
        self.assertEqual(self._keys(chr(27) + "[<65;10;5M"), ["wheel_down"])

    def test_clicks_are_recognised_and_ignored(self):
        self.assertEqual(self._keys(chr(27) + "[<0;10;5M"), ["mouse"])

    def test_the_wheel_scrolls_the_transcript(self):
        app = _app()
        app._handle_key("wheel_up")
        self.assertEqual(app.scroll, 3)
        app._handle_key("wheel_down")
        self.assertEqual(app.scroll, 0)
        app._handle_key("wheel_down")
        self.assertEqual(app.scroll, 0, "it cannot scroll past the bottom")


class InsertingText(unittest.TestCase):
    """What the client does with the pasted text."""

    def test_a_paste_lands_in_the_buffer_without_submitting(self):
        app = _app()
        app._handle_key("paste:hello\nworld")
        self.assertEqual("".join(app.buffer), "hello\nworld")
        self.assertFalse(app.busy, "a paste must never send the prompt")

    def test_carriage_returns_become_newlines(self):
        app = _app()
        app._handle_key("paste:one\r\ntwo\rthree")
        self.assertEqual("".join(app.buffer), "one\ntwo\nthree")

    def test_control_characters_are_dropped(self):
        app = _app()
        app._handle_key("paste:a\x07b\x00c")
        self.assertEqual("".join(app.buffer), "abc")

    def test_it_inserts_at_the_cursor(self):
        app = _app()
        for ch in "ad":
            app._handle_key(ch)
        app._handle_key("left")
        app._handle_key("paste:bc")
        self.assertEqual("".join(app.buffer), "abcd")
        self.assertEqual(app.cursor, 3)


class BurstHeuristic(unittest.TestCase):
    """Terminals without bracketed paste hand over a run of characters."""

    def test_a_run_of_characters_is_a_paste(self):
        self.assertTrue(_looks_like_paste(list("hello world")))

    def test_a_few_keystrokes_are_not(self):
        self.assertFalse(_looks_like_paste(list("hi")))

    def test_a_trailing_newline_stays_in_the_run(self):
        # The Enter at the end of a pasted line is part of the paste; reading
        # it as a submit is what sent one message per pasted line.
        self.assertTrue(_looks_like_paste(list("helloworld") + ["enter"]))

    def test_a_named_key_breaks_the_run(self):
        self.assertFalse(_looks_like_paste(list("helloworld") + ["left"]))


if __name__ == "__main__":
    unittest.main()
