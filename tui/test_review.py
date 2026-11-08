"""Regressions for defects found in review.

Each test here failed before its fix. They are kept because every one of them
is invisible in normal use until it ruins a session: a picture that never
draws, a spinner that clears while the agent is still working, an Enter that
turns into a newline.
"""

import os
import struct
import tempfile
import time
import unittest
import zlib

from kit import app as app_module
from kit import markdown, session
from kit.app import Entry, MAX_ANSWER_ROWS
from test_kit import make_app


def png(path, width=20, height=10, colour=(200, 40, 90)):
    def chunk(kind, body):
        return (struct.pack(">I", len(body)) + kind + body
                + struct.pack(">I", zlib.crc32(kind + body) & 0xFFFFFFFF))
    raw = b"".join(b"\x00" + bytes(colour) * width for _ in range(height))
    with open(path, "wb") as handle:
        handle.write(b"\x89PNG\r\n\x1a\n"
                     + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height,
                                                  8, 2, 0, 0, 0))
                     + chunk(b"IDAT", zlib.compress(raw))
                     + chunk(b"IEND", b""))


class PictureRows(unittest.TestCase):
    """The rectangle a picture is painted into must exist in the transcript."""

    def setUp(self):
        self.folder = tempfile.mkdtemp()
        self.image = os.path.join(self.folder, "a.png")
        png(self.image)
        # The rectangle branch is the one with rows to place; without a
        # terminal that speaks a protocol, markdown draws half blocks and
        # there is nothing to position.
        self._saved = markdown.graphics.kind
        markdown.graphics.kind = lambda: "kitty"

    def tearDown(self):
        markdown.graphics.kind = self._saved

    def _rows(self, body, width=80):
        app, _ = make_app(width=width, height=40)
        app.entries = [Entry("assistant", body)]
        app._view_dirty = False
        lines = app._transcript_lines(width - 4)
        return app, lines

    def test_the_reserved_rows_are_not_trimmed_away(self):
        # A picture at the very end of an answer used to lose every one of the
        # blank rows it needs: markdown trimmed trailing whitespace and could
        # not tell a reserved row from padding.
        images = []
        rows = markdown.render(f"看：\n\n![图]({self.image})", 60,
                               make_theme(), images=images, protocol=True)
        self.assertEqual(len(images), 1)
        picture = images[0]
        self.assertGreaterEqual(len(rows), picture["row"] + picture["rows"])

    def test_a_picture_at_the_end_stays_inside_the_transcript(self):
        app, lines = self._rows(f"看：\n\n![图]({self.image})")
        self.assertTrue(app._image_slots, "the picture is placed at all")
        for slot in app._image_slots:
            self.assertLessEqual(slot["line"] + slot["rows"], len(lines))

    def test_a_picture_after_long_prose_is_not_painted_over_the_prompt(self):
        body = ("\n\n".join(f"第 {i} 段" for i in range(40))
                + f"\n\n![图]({self.image})\n")
        app, lines = self._rows(body)
        for slot in app._image_slots:
            self.assertLessEqual(slot["line"] + slot["rows"], len(lines),
                                 "a folded-away picture must not be drawn")

    def test_folding_still_folds(self):
        # Turning a long answer into a scrollback would be a worse bug than
        # the one being fixed here.
        body = "\n\n".join(f"第 {i} 段" for i in range(40))
        _app, lines = self._rows(body)
        self.assertLessEqual(len(lines), MAX_ANSWER_ROWS)

    def test_a_picture_in_the_fold_keeps_its_place(self):
        body = f"短。\n\n![图]({self.image})\n\n后面一句。"
        app, lines = self._rows(body)
        self.assertTrue(app._image_slots)
        self.assertEqual(app._image_slots[0]["line"], 2)


class BusyState(unittest.TestCase):
    """A failure that is not about this turn must not end this turn."""

    def test_a_failed_cancel_leaves_the_running_turn_alone(self):
        app, _ = make_app()
        app.busy = True
        app.activity = "thinking"
        app.turn_task = "agent-task:current"
        app.queue.put(("error", {"message": "cancel failed", "task": "agent-task:other"},
                       None))
        app._drain()
        self.assertTrue(app.busy, "the spinner belongs to the running turn")
        self.assertEqual(app.activity, "thinking")
        self.assertTrue([n for n in app.notices if "cancel failed" in n.text],
                        "the failure is still reported")

    def test_a_failure_about_this_turn_does_end_it(self):
        app, _ = make_app()
        app.busy = True
        app.turn_task = "agent-task:current"
        app.queue.put(("error", {"message": "model refused",
                                 "task": "agent-task:current"}, None))
        app._drain()
        self.assertFalse(app.busy)

    def test_a_plain_error_still_ends_a_turn(self):
        app, _ = make_app()
        app.busy = True
        app.queue.put(("error", "cannot reach the gateway", None))
        app._drain()
        self.assertFalse(app.busy)


class PasteWindow(unittest.TestCase):
    """The paste window must close as soon as somebody starts typing."""

    def test_typing_after_a_paste_ends_the_window(self):
        app, _ = make_app()
        app._absorb_paste(["x"] * 20)
        for _ in range(20):
            time.sleep(0.03)
            if not app._absorb_paste(["a"]):
                break
        else:
            self.fail("the window renewed for every keystroke")

    def test_enter_sends_after_typing_between_pastes(self):
        app, _ = make_app()
        app._absorb_paste(["x"] * 20)
        for _ in range(20):
            time.sleep(0.03)
            if not app._absorb_paste(["a"]):
                break
        app._handle_key("enter")
        self.assertTrue(app.pending or app.busy,
                        "Enter must send once the paste is over")

    def test_a_paste_that_arrives_in_pieces_stays_one_paste(self):
        app, _ = make_app()
        app._absorb_paste(["x"] * 20)
        for _ in range(5):
            self.assertTrue(app._absorb_paste(list("bcdef")))
        self.assertEqual("".join(app.buffer), "x" * 20 + "bcdef" * 5)

    def test_enter_inside_a_paste_is_still_text(self):
        app, _ = make_app()
        burst = ["a"] * 10 + ["enter"] + ["b"] * 10
        self.assertTrue(app._absorb_paste(burst))
        self.assertEqual("".join(app.buffer), "a" * 10 + "\n" + "b" * 10)
        self.assertEqual(app.pending, [])


class QuestionRouting(unittest.TestCase):
    """Digits belong to the question on screen, not to the first one listed."""

    def _two_questions(self):
        app, _ = make_app()
        app.questions = [
            {"id": "q1", "prompt": "first?", "options": ["A", "B"]},
            {"id": "q2", "prompt": "second?", "options": ["X", "Y"]},
        ]
        return app

    def test_the_options_shown_are_the_selected_questions(self):
        app = self._two_questions()
        app.answering = "q2"
        self.assertEqual(app._question_options(), ["X", "Y"])

    def test_a_digit_answers_the_selected_question(self):
        app = self._two_questions()
        app.answering = "q2"
        answered = []
        app._send_answer = lambda item, answer: answered.append((item["id"], answer))
        app.panel = app_module.Panel("questions", ["1 X", "2 Y"],
                                     choices=["1", "2"], action="question")
        app._handle_panel_key("1")
        self.assertEqual(answered, [("q2", "X")])

    def test_without_a_selection_the_first_one_is_answered(self):
        app = self._two_questions()
        answered = []
        app._send_answer = lambda item, answer: answered.append((item["id"], answer))
        app.panel = app_module.Panel("questions", ["1 A"], choices=["1"],
                                     action="question")
        app._handle_panel_key("1")
        self.assertEqual(answered, [("q1", "A")])


class EmptyAnswer(unittest.TestCase):
    """A finished turn with no answer is an empty reply, not a spinner."""

    def _entries(self, row):
        return session.transcript({row["task_id"]: row})

    def test_a_done_turn_with_no_answer_says_so(self):
        row = {"task_id": "t1", "session_id": "s", "kind": "agent",
               "state": "done", "prompt": "hi", "result": ""}
        entries = self._entries(row)
        assistant = [e for e in entries if e["kind"] == "assistant"]
        self.assertFalse(assistant, "no spinner for a turn that ended")
        self.assertTrue([e for e in entries if e["kind"] == "system"])

    def test_a_running_turn_still_shows_the_placeholder(self):
        row = {"task_id": "t1", "session_id": "s", "kind": "agent",
               "state": "running", "prompt": "hi", "result": ""}
        entries = self._entries(row)
        assistant = [e for e in entries if e["kind"] == "assistant"]
        self.assertTrue(assistant)
        self.assertTrue(assistant[0]["meta"].get("pending"))


class Recall(unittest.TestCase):
    """History is a convenience with a bound, not an ever-growing log."""

    def test_a_pasted_page_does_not_go_in_whole(self):
        app, _ = make_app()
        page = "日志第一行\n" + "\n".join(f"第 {i} 行输出" for i in range(400))
        app._remember(page)
        self.assertEqual(len(app.history), 1)
        self.assertLessEqual(len(app.history[0]), app_module.HISTORY_ENTRY_MAX + 1)
        self.assertTrue(app.history[0].endswith("…"), "it is cut, and says so")

    def test_the_list_has_an_end(self):
        app, _ = make_app()
        for i in range(app_module.HISTORY_MAX + 50):
            app._remember(f"prompt {i}")
        self.assertEqual(len(app.history), app_module.HISTORY_MAX)
        self.assertEqual(app.history[-1], f"prompt {app_module.HISTORY_MAX + 49}",
                         "the newest is kept")

    def test_the_same_prompt_twice_is_one_entry(self):
        app, _ = make_app()
        app._remember("再看一遍")
        app._remember("再看一遍")
        self.assertEqual(app.history, ["再看一遍"])

    def test_ctrl_r_finds_the_prompt_not_the_page(self):
        app, _ = make_app()
        app._remember("旧的一个问题")
        app._remember("另一段很长的粘贴\n" + "x" * 5000)
        app.buffer = list("旧")
        app._history_search()
        self.assertEqual("".join(app.buffer), "旧的一个问题")


class Reconnect(unittest.TestCase):
    """A cursor the gateway forgot must be dropped, not retried for ever."""

    def test_a_rejected_cursor_is_recognised(self):
        from kit.client import CoreError
        self.assertTrue(app_module._cursor_rejected(
            CoreError("HTTP 400 from /api/tasks/events: bad cursor", 400)))
        self.assertTrue(app_module._cursor_rejected(
            CoreError("HTTP 404 from /api/tasks/events: gone", 404)))

    def test_a_broken_gateway_is_not_a_rejected_cursor(self):
        from kit.client import CoreError
        self.assertFalse(app_module._cursor_rejected(
            CoreError("HTTP 500 from /api/tasks/events: boom", 500)))
        self.assertFalse(app_module._cursor_rejected(
            CoreError("cannot reach http://127.0.0.1:8080: refused")))

    def test_the_message_alone_does_not_count(self):
        # The old check read the status back out of the message, which broke
        # the moment anybody reworded it.
        from kit.client import CoreError
        self.assertFalse(app_module._cursor_rejected(
            CoreError("HTTP 400 from /api/tasks/events: bad cursor")))


class PictureCache(unittest.TestCase):
    """More pictures than the cache holds must not re-decode all of them."""

    def test_the_oldest_entry_goes_not_the_whole_cache(self):
        from kit import graphics
        saved = graphics._PIXEL_CACHE.copy()
        graphics._PIXEL_CACHE.clear()
        try:
            with tempfile.TemporaryDirectory() as folder:
                paths = []
                for i in range(graphics._CACHE_LIMIT + 3):
                    path = os.path.join(folder, f"{i}.png")
                    png(path, 4, 2, colour=(i * 20 % 256, 40, 90))
                    paths.append(path)
                    graphics.pixels(path)
            kept = len(graphics._PIXEL_CACHE)
            self.assertEqual(kept, graphics._CACHE_LIMIT)
            newest = [k for k in graphics._PIXEL_CACHE if paths[-1] in k]
            self.assertTrue(newest, "the newest picture is still cached")
            oldest = [k for k in graphics._PIXEL_CACHE if paths[0] in k]
            self.assertFalse(oldest, "the oldest was the one evicted")
        finally:
            graphics._PIXEL_CACHE.clear()
            graphics._PIXEL_CACHE.update(saved)

    def test_a_hit_moves_the_entry_to_the_end(self):
        from kit import graphics
        saved = graphics._PIXEL_CACHE.copy()
        graphics._PIXEL_CACHE.clear()
        try:
            with tempfile.TemporaryDirectory() as folder:
                first = os.path.join(folder, "a.png")
                png(first, 4, 2)
                graphics.pixels(first)
                for i in range(graphics._CACHE_LIMIT - 1):
                    graphics.pixels(_spare_png(folder, i))
                graphics.pixels(first)          # touch the oldest
                graphics.pixels(_spare_png(folder, 999))   # force one eviction
            self.assertTrue([k for k in graphics._PIXEL_CACHE if first in k],
                            "a picture still on screen must not be evicted")
        finally:
            graphics._PIXEL_CACHE.clear()
            graphics._PIXEL_CACHE.update(saved)


def _spare_png(folder, index):
    path = os.path.join(folder, f"spare-{index}.png")
    png(path, 4, 2, colour=(index % 256, 10, 10))
    return path


def make_theme():
    from kit.theme import build
    return build("dark")


if __name__ == "__main__":
    unittest.main()
