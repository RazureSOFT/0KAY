"""Typing while the agent is working: steer, or queue.

The gateway refuses a second turn in one session, so steering is
"interrupt, then send" and queueing is purely local.
"""

import time
import unittest

from kit.client import CoreError
from test_kit import make_app, wait_for


def busy_app():
    """An app whose turn is running and whose task id is known."""
    app, _ = make_app()
    app.session_id = "s1"
    app.busy = True
    app.turn_task = "agent-task:1"
    app.started_at = time.monotonic()
    return app


def type_and(app, text, key="enter"):
    for char in text:
        app._handle_key(char)
    app._handle_key(key)


def wait_for_entries(app, predicate, timeout=4.0):
    """Queue events only become entries when the app drains them."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        app._drain()
        if predicate():
            return True
        time.sleep(0.01)
    app._drain()
    return predicate()


class Steering(unittest.TestCase):
    def test_enter_interrupts_the_turn_and_sends_the_new_prompt(self):
        app = busy_app()
        type_and(app, "do it differently")
        self.assertTrue(wait_for(lambda: app.client.sent))
        self.assertEqual(app.client.sent, ["do it differently"])
        self.assertTrue(wait_for(lambda: app.client.cancelled))
        self.assertEqual(app.client.cancelled, ["agent-task:1"],
                         "the old turn has to stop, or the send is refused")

    def test_the_input_is_cleared_after_steering(self):
        app = busy_app()
        type_and(app, "again")
        self.assertEqual("".join(app.buffer), "")

    def test_steering_says_what_it_is_doing(self):
        app = busy_app()
        type_and(app, "x")
        self.assertTrue([e for e in app.entries if "steering" in e.text])
        self.assertEqual([e.kind for e in app.entries if "steering" in e.text], ["warn"])

    def test_a_conflict_while_steering_is_retried(self):
        # The cancel and the submit race: the gateway answers 409 until the
        # old task is really gone, and that is not an error worth showing.
        app = busy_app()
        attempts = []

        def flaky(session, prompt, **kwargs):
            attempts.append(prompt)
            if len(attempts) < 3:
                raise CoreError("HTTP 409 from /api/agent/messages: "
                                "session already has an active task")
            app.client.sent.append(prompt)
            return {"accepted": True, "task_id": "agent-task:2"}

        app.client.send_message = flaky
        type_and(app, "go")
        self.assertTrue(wait_for(lambda: app.client.sent, timeout=4))
        self.assertEqual(len(attempts), 3)
        self.assertFalse([e for e in app.entries if e.kind == "error"])

    def test_a_real_failure_is_still_reported(self):
        app = busy_app()

        def broken(session, prompt, **kwargs):
            raise CoreError("cannot reach http://127.0.0.1:8080: refused")

        app.client.send_message = broken
        type_and(app, "go")
        self.assertTrue(wait_for_entries(
            app, lambda: [e for e in app.entries if e.kind == "error"]))


class Queueing(unittest.TestCase):
    def test_tab_queues_instead_of_completing(self):
        app = busy_app()
        type_and(app, "then run the tests", key="tab")
        self.assertEqual(app.queued, ["then run the tests"])
        self.assertEqual(app.client.sent, [])
        self.assertEqual("".join(app.buffer), "")

    def test_the_status_line_counts_what_is_waiting(self):
        app, capture = make_app(width=120, height=30)
        app.queued = ["a", "b"]
        app._draw()
        status = [line for line in capture.frame.lines() if "ready" in line][0]
        self.assertIn("⋯ 2 queued", status)

    def test_the_next_prompt_starts_when_the_turn_ends(self):
        app = busy_app()
        app.queued = ["second"]
        app._end_turn()
        self.assertTrue(wait_for(lambda: app.client.sent))
        self.assertEqual(app.client.sent, ["second"])
        self.assertEqual(app.queued, [])

    def test_the_queue_is_first_in_first_out(self):
        app = busy_app()
        app.queued = ["one", "two"]
        app._end_turn()
        self.assertTrue(wait_for(lambda: app.client.sent))
        self.assertEqual(app.client.sent, ["one"])
        self.assertEqual(app.queued, ["two"])

    def test_an_empty_draft_does_not_queue(self):
        app = busy_app()
        app._handle_key("tab")
        self.assertEqual(app.queued, [])

    def test_a_command_while_busy_is_queued_too(self):
        # Unlike Enter, Tab is explicit: the user is asking for it to wait.
        app = busy_app()
        type_and(app, "/todo", key="tab")
        self.assertEqual(app.queued, ["/todo"])


if __name__ == "__main__":
    unittest.main()
