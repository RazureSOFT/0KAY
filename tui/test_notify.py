"""Task-complete notifications: when to speak, and through what channel.

The rule that matters: a notification is only worth anything when the window
is in the background, which is why that is the default.
"""

import contextlib
import os
import time
import unittest

from test_kit import make_app

OSC = chr(27) + "]9;"
BELL = chr(7)


@contextlib.contextmanager
def terminal_program(name):
    """Pretend to run inside a particular terminal, for one block."""
    saved = os.environ.get("TERM_PROGRAM")
    popped = {key: os.environ.pop(key, None) for key in ("WT_SESSION", "KITTY_WINDOW_ID")}
    if name is not None:
        os.environ["TERM_PROGRAM"] = name
    else:
        os.environ.pop("TERM_PROGRAM", None)
    try:
        yield
    finally:
        if saved is None:
            os.environ.pop("TERM_PROGRAM", None)
        else:
            os.environ["TERM_PROGRAM"] = saved
        for key, value in popped.items():
            if value is not None:
                os.environ[key] = value


class Recorder:
    """A terminal that remembers what was written to it."""

    def __init__(self):
        self.written = []

    def size(self):
        return (100, 30)

    def write(self, text):
        self.written.append(text)

    def text(self):
        return "".join(self.written)


def notifying_app(mode="unfocused", focused=True):
    app, capture = make_app()
    terminal = Recorder()
    app.terminal = terminal
    app.notify_mode = mode
    app.focused = focused
    return app, terminal


class Modes(unittest.TestCase):
    def test_off_writes_nothing(self):
        app, terminal = notifying_app("off", focused=False)
        app._notify("title", "body")
        self.assertEqual(terminal.text(), "")

    def test_unfocused_stays_quiet_when_the_window_is_in_front(self):
        app, terminal = notifying_app("unfocused", focused=True)
        app._notify("title", "body")
        self.assertEqual(terminal.text(), "")

    def test_unfocused_speaks_when_the_window_is_behind(self):
        app, terminal = notifying_app("unfocused", focused=False)
        app._notify("title", "body")
        self.assertNotEqual(terminal.text(), "")

    def test_always_speaks_even_in_front(self):
        app, terminal = notifying_app("always", focused=True)
        app._notify("title", "body")
        self.assertNotEqual(terminal.text(), "")

    def test_the_title_and_the_body_both_travel(self):
        app, terminal = notifying_app("always")
        with terminal_program("WezTerm"):
            app._notify("0KAY · task complete", "it worked")
        text = terminal.text()
        self.assertIn("0KAY · task complete", text)
        self.assertIn("it worked", text)


class Channels(unittest.TestCase):
    def test_a_known_terminal_gets_an_osc_notification(self):
        app, terminal = notifying_app("always")
        with terminal_program("WezTerm"):
            app._notify("title")
        self.assertTrue(terminal.text().startswith(OSC))

    def test_an_unknown_terminal_gets_the_bell(self):
        app, terminal = notifying_app("always")
        with terminal_program("some-unknown-terminal"):
            app._notify("title")
        self.assertEqual(terminal.text(), BELL)

    def test_the_bell_is_the_fallback_when_nothing_is_known(self):
        app, terminal = notifying_app("always")
        with terminal_program(None):
            app._notify("title")
        self.assertEqual(terminal.text(), BELL)

    def test_windows_terminal_counts_as_known(self):
        app, terminal = notifying_app("always")
        with terminal_program(None):
            os.environ["WT_SESSION"] = "1"
            try:
                app._notify("title")
            finally:
                os.environ.pop("WT_SESSION", None)
        self.assertTrue(terminal.text().startswith(OSC))


class TurnEnd(unittest.TestCase):
    def _finished(self, seconds):
        app, terminal = notifying_app("always")
        app.busy = True
        app.started_at = time.monotonic() - seconds
        app.entries = []
        from kit.app import Entry
        app.entries = [Entry("assistant", "the answer is 42")]
        app._end_turn()
        return app, terminal

    def test_a_long_turn_notifies_with_the_last_answer(self):
        # A bare bell carries no text, so the preview needs a terminal that
        # speaks OSC 9.
        with terminal_program("WezTerm"):
            app, terminal = self._finished(30)
        self.assertIn("the answer is 42", terminal.text())

    def test_a_quick_turn_does_not(self):
        app, terminal = self._finished(0.2)
        # The window title is written either way; what must not happen is a
        # notification.
        self.assertNotIn("task complete", terminal.text())

    def test_a_queued_prompt_still_starts_after_the_notice(self):
        app, terminal = notifying_app("always")
        app.busy = True
        app.started_at = time.monotonic() - 30
        app.queued = ["next"]
        app._end_turn()
        self.assertTrue(app.busy, "the queued prompt takes over the turn")
        self.assertEqual(app.queued, [])


class Focus(unittest.TestCase):
    def test_focus_events_update_the_flag(self):
        app, _ = make_app()
        app._handle_key("focus_out")
        self.assertFalse(app.focused)
        app._handle_key("focus_in")
        self.assertTrue(app.focused)


class Command(unittest.TestCase):
    def test_an_argument_sets_the_mode(self):
        app, _ = make_app()
        app._run_command("/notify always")
        self.assertEqual(app.notify_mode, "always")

    def test_a_bad_argument_lists_the_modes(self):
        app, _ = make_app()
        app._run_command("/notify sometimes")
        self.assertTrue([e for e in app.entries
                         if "unfocused, always, off" in e.text])

    def test_no_argument_opens_the_picker(self):
        app, _ = make_app()
        app._run_command("/notify")
        self.assertEqual(app.panel.choices, ["unfocused", "always", "off"])
        self.assertEqual(app.panel.choices[app.panel.cursor], "unfocused")

    def test_choosing_from_the_picker_applies(self):
        app, _ = make_app()
        app._run_command("/notify")
        app._handle_key("down")
        app._handle_key("enter")
        self.assertEqual(app.notify_mode, "always")
        self.assertIsNone(app.panel)


if __name__ == "__main__":
    unittest.main()
