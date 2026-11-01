"""Pasting text with newlines must not send the message.

A terminal without bracketed paste -- Windows' console queue is one -- hands
us pasted text as a stream of ordinary keys. The Enter at the end of each
line then looks exactly like somebody pressing Enter, so without the burst
check a pasted paragraph fired off one message per line.
"""

import time
import unittest

from kit import app as app_module
from test_kit import make_app


def burst(text: str) -> list[str]:
    """The keys a terminal without bracketed paste would produce."""
    keys = []
    for char in text:
        if char == "\n":
            keys.append("enter")          # CR arrives as Enter
        elif char == "\t":
            keys.append("tab")
        else:
            keys.append(char)
    return keys


def draft(app) -> str:
    return "".join(app.buffer)


class Recognition(unittest.TestCase):
    def test_a_multiline_burst_is_a_paste(self):
        self.assertTrue(app_module._looks_like_paste(
            burst("line one\nline two\n")))

    def test_a_burst_of_plain_characters_is_a_paste(self):
        self.assertTrue(app_module._looks_like_paste(list("hello world")))

    def test_typing_is_not_a_paste(self):
        self.assertFalse(app_module._looks_like_paste(list("hi")))
        self.assertFalse(app_module._looks_like_paste([]))

    def test_a_key_that_cannot_be_pasted_keeps_it_typing(self):
        keys = list("hello wor") + ["left"]
        self.assertFalse(app_module._looks_like_paste(keys))


class Text(unittest.TestCase):
    def test_newlines_survive(self):
        self.assertEqual(app_module._paste_chars(burst("a\nb")), "a\nb")

    def test_tabs_survive(self):
        self.assertEqual(app_module._paste_chars(["a", "tab", "b"]), "a\tb")

    def test_control_keys_are_dropped_rather_than_guessed(self):
        text = app_module._paste_chars(["a", "left", "b", "ctrl+k"])
        self.assertEqual(text, "ab")

    def test_a_bracketed_paste_keeps_its_own_text(self):
        self.assertEqual(app_module._paste_chars(["paste:x\ny"]), "x\ny")


class Absorbing(unittest.TestCase):
    def test_a_pasted_paragraph_lands_in_the_draft_unsent(self):
        app, _ = make_app()
        self.assertTrue(app._absorb_paste(burst("第一行\n第二行\n第三行\n")))
        self.assertEqual(draft(app), "第一行\n第二行\n第三行\n")
        self.assertEqual(app.pending, [], "nothing was sent")
        self.assertFalse(app.busy)

    def test_the_default_input_blows_up_one_message_per_line(self):
        # What the old path did: every `enter` in the burst submitted.
        app, _ = make_app()
        for key in burst("a\nb\nc\n"):
            app._handle_key(key)
        self.assertTrue(app.pending or app.busy,
                        "the old per-key path sends on the first newline")

    def test_typing_a_few_keys_is_left_alone(self):
        app, _ = make_app()
        self.assertFalse(app._absorb_paste(["a", "b"]))
        self.assertEqual(draft(app), "")

    def test_the_rest_of_a_split_paste_is_still_text(self):
        app, _ = make_app()
        self.assertTrue(app._absorb_paste(burst("x" * 20)))
        # A short fragment arriving right after the burst belongs to it.
        self.assertTrue(app._absorb_paste(["y", "enter"]))
        self.assertEqual(draft(app), "x" * 20 + "y\n")

    def test_the_session_ends_when_the_stream_goes_quiet(self):
        app, _ = make_app()
        app._absorb_paste(burst("x" * 20))
        app._paste_until = time.monotonic() - 1     # the stream went quiet
        self.assertFalse(app._absorb_paste(["a"]))
        self.assertEqual(draft(app), "x" * 20)

    def test_enter_after_the_paste_still_sends(self):
        app, _ = make_app()
        app._absorb_paste(burst("问题\n细节\n"))
        app._paste_until = time.monotonic() - 1
        app._handle_key("enter")
        self.assertTrue(app.pending or app.busy, "enter sends after a paste")
        self.assertEqual(draft(app), "", "the draft was taken by the send")

    def test_a_pasted_picture_reference_is_just_text(self):
        app, _ = make_app()
        block = "看图：\n\n![shot](shot.png)\n\n就这样。\n"
        self.assertTrue(app._absorb_paste(burst(block)))
        self.assertEqual(draft(app), block)
        self.assertEqual(app.pending, [])

    def test_a_long_paste_does_not_blow_past_the_buffer(self):
        app, _ = make_app()
        block = ("段" * 400 + "\n") * 5
        self.assertTrue(app._absorb_paste(burst(block)))
        self.assertEqual(len(draft(app)), len(block))
        self.assertEqual(app.cursor, len(block))
        self.assertEqual(app.pending, [])


class Interrupting(unittest.TestCase):
    """A chord is not paste content: swallowing it would eat ctrl+c."""

    def test_a_chord_ends_the_paste(self):
        app, _ = make_app()
        app._absorb_paste(burst("x" * 20))
        self.assertFalse(app._absorb_paste(["ctrl+d"]))
        self.assertEqual(app._paste_until, 0.0)

    def test_ctrl_c_still_interrupts_right_after_a_paste(self):
        app, _ = make_app()
        app._absorb_paste(burst("x" * 20))
        self.assertFalse(app._absorb_paste(["ctrl+c"]))
        self.assertEqual(draft(app), "x" * 20, "the paste itself survived")

    def test_an_arrow_ends_the_paste(self):
        app, _ = make_app()
        app._absorb_paste(burst("x" * 20))
        self.assertFalse(app._absorb_paste(["left"]))


class Notices(unittest.TestCase):
    def test_a_multiline_paste_says_how_much_went_in(self):
        app, _ = make_app()
        app._absorb_paste(burst("一\n二\n三\n"))
        said = [n.text for n in app.notices]
        self.assertTrue([line for line in said if "pasted" in line or "粘贴" in line],
                        said)

    def test_a_single_line_paste_says_nothing(self):
        app, _ = make_app()
        app._absorb_paste(list("hello world"))
        self.assertFalse([n for n in app.notices
                          if "pasted" in n.text or "粘贴" in n.text])


if __name__ == "__main__":
    unittest.main()
