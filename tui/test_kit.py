"""Tests for the terminal kit.

They drive the same code the interactive client runs, but with a fake terminal
and a captured frame, so layout regressions show up as diffs in text rather
than as a screen the next person has to squint at.
"""

import io
import os
import subprocess
import sys
import time
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from kit import commands, markdown, session
from kit.ansi import Style, display_width, spans_to_text, truncate, wrap
from kit.app import App, Entry, _input_rows
from kit.canvas import Frame, Renderer
from kit.theme import build
from kit.widgets import box, human_tokens


class Width(unittest.TestCase):
    def test_ascii_is_one_column(self):
        self.assertEqual(display_width("hello"), 5)

    def test_cjk_is_two_columns(self):
        self.assertEqual(display_width("插件"), 4)
        self.assertEqual(display_width("a插b"), 4)

    def test_escape_sequences_take_no_space(self):
        self.assertEqual(display_width("\x1b[31mred\x1b[0m"), 3)


class Truncate(unittest.TestCase):
    def test_short_text_is_untouched(self):
        self.assertEqual(truncate("abc", 10), "abc")

    def test_the_result_never_exceeds_the_width(self):
        for width in range(1, 12):
            self.assertLessEqual(display_width(truncate("插件插件插件", width)), width)

    def test_the_cut_is_marked(self):
        self.assertTrue(truncate("a" * 40, 10).endswith("…"))


class Wrap(unittest.TestCase):
    def test_words_move_to_the_next_line(self):
        self.assertEqual(wrap("one two three", 7), ["one two", "three"])

    def test_a_word_longer_than_the_line_is_sliced(self):
        lines = wrap("x" * 25, 10)
        self.assertEqual(len(lines), 3)
        self.assertTrue(all(display_width(line) <= 10 for line in lines))

    def test_cjk_wraps_on_columns_not_characters(self):
        lines = wrap("插件插件", 4)
        self.assertEqual(lines, ["插件", "插件"])

    def test_blank_paragraphs_survive(self):
        self.assertEqual(wrap("a\n\nb", 10), ["a", "", "b"])


class Frames(unittest.TestCase):
    def test_a_wide_character_claims_two_cells(self):
        frame = Frame(6, 1)
        frame.put(0, 0, "插x")
        self.assertEqual(frame._cells[0][0][0], "插")
        self.assertEqual(frame._cells[0][1][0], "", "the second cell is a continuation")
        self.assertEqual(frame._cells[0][2][0], "x")
        self.assertEqual(frame.row_text(0).rstrip(), "插x")
        self.assertLessEqual(display_width(frame.row_text(0)), 6)

    def test_writing_past_the_edge_is_clipped(self):
        frame = Frame(4, 1)
        frame.put(0, 0, "abcdef")
        self.assertEqual(frame.row_text(0), "abcd")

    def test_trailing_blanks_are_not_emitted(self):
        frame = Frame(10, 1)
        frame.put(0, 0, "hi", Style(fg="#ffffff"))
        rendered = frame.render_row(0, build("dark").colour)
        self.assertEqual(rendered.rstrip("\x1b[0m").count(" "), 0)

    def test_a_box_hides_what_is_under_it(self):
        frame = Frame(12, 4)
        frame.put(0, 1, "underneath", Style())
        box(frame, 0, 0, 12, 4, build("dark"), title="t")
        self.assertNotIn("underneath", frame.row_text(1))


class RendererDiff(unittest.TestCase):
    def test_only_the_changed_row_is_repainted(self):
        colour = build("dark").colour
        out = io.StringIO()
        renderer = Renderer(out, colour)
        first = Frame(10, 3)
        first.put(0, 0, "aaa")
        renderer.draw(first)
        out.seek(0)
        out.truncate(0)

        second = Frame(10, 3)
        second.put(0, 0, "aaa")
        second.put(0, 1, "bbb")
        renderer.draw(second)
        emitted = out.getvalue()
        # One erase-line per changed row; row 0 must not be touched.
        self.assertEqual(emitted.count("\x1b[2K"), 1)
        self.assertIn("bbb", emitted)
        self.assertNotIn("\x1b[1;1H", emitted)

    def test_an_identical_frame_emits_nothing(self):
        colour = build("dark").colour
        out = io.StringIO()
        renderer = Renderer(out, colour)
        frame = Frame(10, 2)
        frame.put(0, 0, "steady")
        renderer.draw(frame)
        out.seek(0)
        out.truncate(0)
        renderer.draw(frame)
        self.assertEqual(out.getvalue(), "")


class Palette(unittest.TestCase):
    def test_a_bare_slash_lists_every_command(self):
        self.assertEqual(len(commands.matching("/")), len(commands.COMMANDS))

    def test_a_prefix_narrows_the_list(self):
        names = [c.name for c in commands.matching("/pl")]
        self.assertEqual(names, ["plugins"])

    def test_aliases_are_found(self):
        self.assertEqual(commands.resolve("q").name, "quit")
        self.assertEqual(commands.resolve("/p").name, "plugins")

    def test_a_command_with_an_argument_is_resolved(self):
        self.assertEqual(commands.resolve("reconnect").argument, "<plugin>")


class FakeTerminal:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def size(self):
        return (self.width, self.height)


class FakeReader:
    def read(self, timeout):
        return []


class Capture:
    def __init__(self, theme):
        self.colour = theme.colour
        self.frame = None
        self.cursor = None

    def draw(self, frame, cursor=None):
        self.frame = frame
        self.cursor = cursor

    def invalidate(self):
        pass


class FakeClient:
    base_url = "http://127.0.0.1:8080"
    files = [
        {"name": "kit", "dir": True},
        {"name": "ansi.py", "dir": False},
        {"name": "app.py", "dir": False},
        {"name": "appendix.md", "dir": False},
    ]

    def __init__(self):
        self.sent = []
        self.tree_calls = []
        self.cancelled = []
        self.decisions = []
        self.answers = []
        self.pending_approvals = []
        self.pending_questions = []
        self.sent_options = []
        self.agent_rows = []
        self.session_rows = []
        self.turn_rows = {}
        self.section_rows = []
        self.section_rows_meta = {}
        self.setting_values = {}
        self.saved_settings = []
        self.renamed = []
        self.deleted = []
        self.forked = []
        self.archived = []
        self.git_branch = ""
        self.git_files = []

    def get(self, path):
        return {}

    def chat(self, prompt, messages, model="", system="", session="tui"):
        self.sent.append(prompt)
        yield ("chunk", "ok")
        yield ("done", None)

    def cancel(self):
        pass

    def create_session(self, title=""):
        return "agent-session:test"

    def send_message(self, session, prompt, model="", intensity="", permission="",
                     workdir="", executor=""):
        self.sent.append(prompt)
        self.sent_options.append({"model": model, "intensity": intensity,
                                  "permission": permission, "workdir": workdir,
                                  "executor": executor})
        return {"accepted": True, "task_id": "agent-task:test"}

    def agents(self):
        return {"agents": list(self.agent_rows), "online_count": len(self.agent_rows)}

    def settings_sections(self):
        return list(self.section_rows)

    def git(self, path=""):
        return {"branch": self.git_branch, "files": list(self.git_files)}

    def settings(self, section):
        return {"section": self.section_rows_meta.get(section, {"id": section, "fields": []}),
                "values": dict(self.setting_values)}

    def save_settings(self, section, values):
        self.saved_settings.append((section, dict(values)))
        self.setting_values.update(values)
        return {}

    def sessions(self):
        return list(self.session_rows)

    def rename_session(self, session, title):
        self.renamed.append((session, title))
        return {}

    def fork_session(self, session):
        self.forked.append(session)
        return "agent-session:fork"

    def archive_session(self, session, restore=False):
        self.archived.append((session, restore))
        return {}

    def search_sessions(self, query):
        return [row for row in self.session_rows
                if query.lower() in str(row.get("prompt") or "").lower()]

    def delete_session(self, session):
        self.deleted.append(session)
        return {}

    def session_turns(self, session, limit=100, before=""):
        return {"tasks": list(self.turn_rows.get(session, [])), "more": False, "next": ""}

    def task_events(self, cursor=""):
        return iter(())

    def cancel_task(self, task):
        self.cancelled.append(task)
        return {"success": True}

    def approvals(self, session=""):
        return list(self.pending_approvals)

    def questions(self, session=""):
        return list(self.pending_questions)

    def decide_approval(self, ident, allow):
        self.decisions.append((ident, allow))
        return {"ok": True}

    def answer_question(self, ident, answer):
        self.answers.append((ident, answer))
        return {"ok": True}

    def context(self, session="tui", model=""):
        return {}

    def tree(self, path=""):
        self.tree_calls.append(path)
        return {"path": path, "entries": list(self.files)}


class CatalogClient(FakeClient):
    """A client that also answers the model catalog and the context window."""

    def models(self):
        return {"default_model": "deepseek-flash",
                "models": [{"id": "deepseek-flash", "context_window": 128000},
                           {"id": "glm-5.3", "context_window": 64000},
                           {"id": "glm-5.3-flash", "context_window": 64000}]}

    def context(self, session="tui", model=""):
        return {"window": 128000, "breakdown": {"window_source": "default"}}


def make_app(width=100, height=30, client=None):
    theme = build("dark")
    capture = Capture(theme)
    client = client or FakeClient()
    app = App(client, theme, FakeTerminal(width, height), FakeReader(), capture,
              model="deepseek-chat")
    app.online = True
    return app, capture


def wait_for(predicate, timeout=2.0):
    """Spin until `predicate` is true -- for anything that runs off-thread."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if predicate():
            return True
        time.sleep(0.01)
    return predicate()


def settle(app, timeout=2.0):
    """Wait for a worker thread to land its event, then apply it."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        app._drain()
        if not app._listing_pending:
            break
        time.sleep(0.01)
    app._drain()


class Layout(unittest.TestCase):
    def test_the_landing_names_the_product_and_the_gateway(self):
        app, capture = make_app()
        app._draw()
        text = "\n".join(capture.frame.lines())
        self.assertIn("0KAY", text)
        self.assertIn("Welcome to 0KAY", text)
        self.assertIn("deepseek-chat", text)

    def test_the_prompt_sits_above_the_footer(self):
        app, capture = make_app()
        app._draw()
        lines = capture.frame.lines()
        tail = "\n".join(lines[-4:])
        self.assertIn("❯", tail)
        self.assertIn("?", lines[-1])

    def test_a_conversation_replaces_the_landing(self):
        app, capture = make_app()
        app.entries = [
            Entry("user", "hello"),
            Entry("assistant", "hi there"),
        ]
        app._draw()
        text = "\n".join(capture.frame.lines())
        self.assertIn("hello", text)
        self.assertIn("hi there", text)
        self.assertNotIn("Welcome to 0KAY", text)

    def test_a_long_answer_wraps_instead_of_clipping(self):
        app, capture = make_app(width=60)
        app.entries = [Entry("user", "q"), Entry("assistant", "word " * 80)]
        app._draw()
        body = "\n".join(capture.frame.lines()[2:-4])
        self.assertIn("word", body)
        self.assertGreater(body.count("word"), 10)

    def test_the_smallest_supported_terminal_does_not_crash(self):
        for width, height in ((20, 8), (20, 12), (40, 10), (200, 60)):
            app, capture = make_app(width, height)
            app._draw()
            self.assertEqual(len(capture.frame.lines()), height)

    def test_the_context_bar_reflects_usage(self):
        app, capture = make_app()
        app.context_used = 64000
        app.context_window = 128000
        app._draw()
        self.assertIn("50%", "\n".join(capture.frame.lines()))

    def test_unknown_context_reads_as_unknown_not_as_zero(self):
        app, capture = make_app()
        app._draw()
        self.assertIn("ctx --", "\n".join(capture.frame.lines()))

    def test_a_known_token_count_does_not_fake_a_percentage(self):
        app, capture = make_app()
        app.prompt_tokens, app.output_tokens = 900, 100
        app.context_used = 1000
        app._draw()
        text = "\n".join(capture.frame.lines())
        # No window means no percentage -- but the counts are still useful.
        self.assertIn("ctx --", text)
        self.assertNotIn("100%", text)
        self.assertIn("900", text)

    def test_the_window_is_adopted_from_the_gateway(self):
        app, _ = make_app()
        app._remember_window({
            "default_model": "deepseek-flash",
            "models": [{"id": "deepseek-flash", "context_window": 128000}],
        })
        self.assertEqual(app.context_window, 128000)
        # A model we were told about explicitly is never overwritten.
        self.assertEqual(app.model, "deepseek-chat")

    def test_a_missing_window_leaves_the_reading_alone(self):
        app, _ = make_app()
        app._remember_window({"models": [{"id": "deepseek-chat"}]})
        self.assertEqual(app.context_window, 0)


class ContextEndpoint(unittest.TestCase):
    """The ceiling comes from /api/agent/context, not from /api/models."""

    def _app_with_context(self, payload):
        app, capture = make_app()

        class ClientWithContext(FakeClient):
            def context(self, session="tui", model=""):
                return payload

        app.client = ClientWithContext()
        return app, capture

    def test_the_window_and_its_source_are_adopted(self):
        app, _ = self._app_with_context({
            "window": 128000,
            "breakdown": {"window_source": "default"},
        })
        app._load_context()
        self.assertEqual(app.context_window, 128000)
        self.assertEqual(app.context_source, "default")

    def test_a_guessed_window_is_marked_as_such(self):
        app, capture = self._app_with_context({
            "window": 128000,
            "breakdown": {"window_source": "default"},
        })
        app._load_context()
        app.context_used = 24000
        app._draw()
        status = [line for line in capture.frame.lines() if "ctx " in line][0]
        self.assertIn("~128k", status)
        self.assertIn("19%", status)

    def test_a_declared_window_is_not_marked(self):
        app, capture = self._app_with_context({
            "window": 200000,
            "breakdown": {"window_source": "provider"},
        })
        app._load_context()
        app.context_used = 20000
        app._draw()
        status = [line for line in capture.frame.lines() if "ctx " in line][0]
        self.assertIn("200k", status)
        self.assertNotIn("~200k", status)

    def test_a_client_without_the_endpoint_keeps_the_bar_unknown(self):
        app, _ = make_app()
        app._load_context()
        self.assertEqual(app.context_window, 0)


class SessionView(unittest.TestCase):
    """The transcript is a projection of the server's task rows."""

    def test_a_running_turn_shows_the_streaming_text(self):
        rows = {
            "t": {"task_id": "t", "kind": "agent", "state": "running",
                  "prompt": "hi", "started_at": "1"},
            "c": {"task_id": "c", "kind": "think", "state": "running",
                  "parent_id": "t", "reasoning": "thinking", "result": "partial",
                  "started_at": "2"},
        }
        lines = session.transcript(rows.values())
        self.assertEqual([line["kind"] for line in lines],
                         ["user", "reason", "assistant"])
        self.assertEqual(lines[-1]["text"], "partial")

    def test_a_finished_turn_uses_the_final_answer(self):
        rows = {
            "t": {"task_id": "t", "kind": "agent", "state": "done",
                  "prompt": "hi", "result": "final answer", "started_at": "1"},
            "c": {"task_id": "c", "kind": "think", "state": "done",
                  "parent_id": "t", "reasoning": "thinking", "result": "partial",
                  "started_at": "2"},
        }
        lines = session.transcript(rows.values())
        self.assertEqual([line["kind"] for line in lines], ["user", "assistant"])
        self.assertEqual(lines[-1]["text"], "final answer")

    def test_tool_calls_appear_in_order_with_their_state(self):
        rows = {
            "t": {"task_id": "t", "kind": "agent", "state": "running",
                  "prompt": "hi", "started_at": "1"},
            "a": {"task_id": "a", "kind": "tool", "state": "done",
                  "parent_id": "t", "prompt": "read", "result": "body",
                  "started_at": "2"},
            "b": {"task_id": "b", "kind": "tool", "state": "failed",
                  "parent_id": "t", "prompt": "exec", "result": "boom",
                  "started_at": "3"},
        }
        tools = [line for line in session.transcript(rows.values())
                 if line["kind"] == "tool"]
        self.assertEqual([line["meta"]["name"] for line in tools], ["read", "exec"])
        self.assertEqual(tools[0]["meta"]["state"], "ok")
        self.assertEqual(tools[1]["meta"]["state"], "failed")

    def test_a_subagent_shows_its_own_work(self):
        # Sub-agents are recorded as kind=subagent under the turn; dropping
        # them made a fan-out look like one silent tool call.
        rows = {
            "t": {"task_id": "t", "kind": "agent", "state": "running",
                  "prompt": "refactor", "started_at": "1"},
            "s1": {"task_id": "s1", "kind": "subagent", "state": "running",
                   "parent_id": "t", "prompt": "explore #1", "started_at": "2"},
            "b": {"task_id": "b", "kind": "tool", "state": "done",
                  "parent_id": "s1", "prompt": "grep", "result": "3 matches",
                  "started_at": "3"},
            "c": {"task_id": "c", "kind": "think", "state": "running",
                  "parent_id": "s1", "result": "three call sites", "started_at": "4"},
        }
        lines = session.transcript(rows)
        kinds = [line["kind"] for line in lines]
        self.assertIn("subagent", kinds)
        sub = [line for line in lines if line["kind"] == "subagent"][0]
        self.assertEqual(sub["text"], "explore #1")
        self.assertEqual(sub["meta"]["depth"], 0)
        nested_tool = [line for line in lines if line["kind"] == "tool"][0]
        self.assertEqual(nested_tool["meta"]["depth"], 1)
        nested_answer = [line for line in lines
                         if line["kind"] == "assistant" and line["meta"].get("depth")]
        self.assertEqual(nested_answer[0]["text"], "three call sites")

    def test_a_nested_subagent_gets_a_deeper_depth(self):
        rows = {
            "t": {"task_id": "t", "kind": "agent", "state": "running",
                  "prompt": "go", "started_at": "1"},
            "s1": {"task_id": "s1", "kind": "subagent", "state": "running",
                   "parent_id": "t", "prompt": "level one", "started_at": "2"},
            "s2": {"task_id": "s2", "kind": "subagent", "state": "running",
                   "parent_id": "s1", "prompt": "level two", "started_at": "3"},
        }
        labels = [(line["text"], line["meta"]["depth"]) for line in session.transcript(rows)
                  if line["kind"] == "subagent"]
        self.assertEqual(labels, [("level one", 0), ("level two", 1)])

    def test_another_sessions_rows_are_ignored(self):
        current = {"t": {"task_id": "t", "kind": "agent", "state": "done",
                         "prompt": "mine", "result": "ok", "started_at": "1"}}
        delta = {"tasks": [
            {"task_id": "x", "kind": "agent", "state": "done", "prompt": "theirs",
             "result": "no", "session_id": "other", "started_at": "2"}],
            "cursor": "c1"}
        self.assertEqual(sorted(session.merge(current, delta, "mine")), ["t"])

    def test_a_reset_replaces_the_map_instead_of_merging(self):
        current = {"old": {"task_id": "old", "kind": "agent", "session_id": "mine"}}
        delta = {"reset": True,
                 "tasks": [{"task_id": "new", "kind": "agent", "session_id": "mine"}]}
        self.assertEqual(sorted(session.merge(current, delta, "mine")), ["new"])


class Input(unittest.TestCase):
    def test_typing_and_deleting(self):
        app, _ = make_app()
        for ch in "abc":
            app._handle_key(ch)
        self.assertEqual("".join(app.buffer), "abc")
        app._handle_key("bs")
        self.assertEqual("".join(app.buffer), "ab")

    def test_the_cursor_moves_and_inserts(self):
        app, _ = make_app()
        for ch in "ac":
            app._handle_key(ch)
        app._handle_key("left")
        app._handle_key("b")
        self.assertEqual("".join(app.buffer), "abc")
        self.assertEqual(app.cursor, 2)

    def test_a_slash_opens_the_palette_and_tab_completes(self):
        app, _ = make_app()
        for ch in "/pl":
            app._handle_key(ch)
        self.assertTrue(app._palette_open())
        app._handle_key("tab")
        self.assertEqual("".join(app.buffer), "/plugins")

    def test_enter_runs_the_highlighted_command(self):
        app, _ = make_app()
        for ch in "/hel":
            app._handle_key(ch)
        app._handle_key("enter")
        self.assertIsNotNone(app.panel)
        self.assertEqual(app.panel.title, "help")
        self.assertEqual("".join(app.buffer), "")

    def test_an_exact_name_wins_the_first_row(self):
        # /help is listed after /health, but typing it in full must highlight it.
        self.assertEqual(commands.matching("/help")[0].name, "help")
        self.assertEqual(commands.matching("/he")[0].name, "health")

    def test_enter_on_a_command_that_needs_an_argument_completes_it(self):
        app, _ = make_app()
        for ch in "/ans":
            app._handle_key(ch)
        app._handle_key("enter")
        # Running it now would only print a usage line; let the user type the
        # answer instead.
        self.assertEqual("".join(app.buffer), "/answer ")
        self.assertIsNone(app.panel)

    def test_an_exact_command_runs_even_when_it_needs_an_argument(self):
        app, _ = make_app()
        for ch in "/reconnect":
            app._handle_key(ch)
        app._handle_key("enter")
        self.assertEqual("".join(app.buffer), "/reconnect ")

    def test_the_palette_window_follows_the_selection(self):
        app, _ = make_app()
        app.buffer = list("/")
        visible = 4
        app.palette_index = len(commands.COMMANDS) - 1
        start = app._palette_start(visible)
        self.assertGreaterEqual(app.palette_index, start)
        self.assertLess(app.palette_index, start + visible)

    def test_a_short_list_starts_at_the_top(self):
        app, _ = make_app()
        app.buffer = list("/pl")
        self.assertEqual(app._palette_start(5), 0)

    def test_enter_sends_a_prompt(self):
        app, _ = make_app()
        for ch in "hello":
            app._handle_key(ch)
        app._handle_key("enter")
        self.assertEqual(app.entries[0].kind, "user")
        self.assertEqual(app.entries[-1].text, "hello")
        self.assertTrue(app.busy)
        self.assertEqual("".join(app.buffer), "")

    def test_history_walks_backwards(self):
        app, _ = make_app()
        app.history = ["one", "two"]
        app.history_index = 2
        app._handle_key("up")
        self.assertEqual("".join(app.buffer), "two")
        app._handle_key("up")
        self.assertEqual("".join(app.buffer), "one")
        app._handle_key("down")
        self.assertEqual("".join(app.buffer), "two")

    def test_ctrl_c_interrupts_a_turn_before_clearing_the_input(self):
        app, _ = make_app()
        app.busy = True
        app._handle_key("ctrl+c")
        self.assertFalse(app.busy)

    def test_ctrl_d_leaves(self):
        app, _ = make_app()
        app._handle_key("ctrl+d")
        self.assertFalse(app.running)


class TurnLifetime(unittest.TestCase):
    """One prompt, from typing it to the server echoing it back."""

    def test_a_prompt_is_shown_before_the_server_echoes_it(self):
        app, _ = make_app()
        for ch in "hi":
            app._handle_key(ch)
        app._handle_key("enter")
        self.assertEqual(app.entries[-1].kind, "user")
        self.assertEqual(app.entries[-1].text, "hi")
        self.assertEqual(app.pending, ["hi"])

    def test_the_echo_replaces_the_pending_line_instead_of_duplicating(self):
        app, _ = make_app()
        app.session_id = "s1"
        app.pending = ["hi"]
        app._view_dirty = True
        app._apply_tasks({"tasks": [
            {"task_id": "t", "kind": "agent", "state": "running",
             "prompt": "hi", "session_id": "s1", "started_at": "1"}]})
        users = [entry for entry in app.entries if entry.kind == "user"]
        self.assertEqual(len(users), 1)
        self.assertEqual(app.pending, [])

    def test_a_finished_turn_clears_busy_and_shows_the_answer(self):
        app, _ = make_app()
        app.session_id = "s1"
        app.turn_task = "t"
        app.busy = True
        app._apply_tasks({"tasks": [
            {"task_id": "t", "kind": "agent", "state": "running",
             "prompt": "hi", "session_id": "s1", "started_at": "1"}]})
        self.assertTrue(app.busy)
        app._apply_tasks({"tasks": [
            {"task_id": "t", "kind": "agent", "state": "done", "prompt": "hi",
             "result": "answer", "session_id": "s1", "started_at": "1"}]})
        self.assertFalse(app.busy)
        self.assertEqual(app.entries[-1].text, "answer")

    def test_another_sessions_events_do_not_end_my_turn(self):
        # The feed carries every session, so "nothing is running" can mean
        # somebody else finished. That must not clear this client's turn.
        app, _ = make_app()
        app.session_id = "s1"
        app.turn_task = "mine"
        app.busy = True
        app.started_at = time.monotonic()
        app._apply_tasks({"tasks": [
            {"task_id": "other", "kind": "agent", "state": "done",
             "prompt": "theirs", "result": "no", "session_id": "s2"}]})
        self.assertTrue(app.busy)

    def test_a_turn_whose_row_never_arrives_gives_up(self):
        app, _ = make_app()
        app.session_id = "s1"
        app.turn_task = "mine"
        app.busy = True
        app.started_at = time.monotonic() - 60
        app._apply_tasks({"tasks": []})
        self.assertFalse(app.busy)
        self.assertTrue([e for e in app.entries if "did not accept" in e.text])

    def test_events_for_another_session_change_nothing(self):
        app, _ = make_app()
        app.session_id = "s1"
        app._apply_tasks({"tasks": [
            {"task_id": "x", "kind": "agent", "state": "done",
             "prompt": "theirs", "result": "no", "session_id": "s2"}]})
        self.assertEqual(app.entries, [])

    def test_ctrl_c_cancels_the_running_turn(self):
        app, _ = make_app()
        app.session_id = "s1"
        app.busy = True
        app.task_rows = {"t": {"task_id": "t", "kind": "agent", "state": "running",
                               "prompt": "hi", "session_id": "s1"}}
        app.client.cancelled = []
        app._handle_key("ctrl+c")
        self.assertFalse(app.busy)
        settle(app, 1.0)
        self.assertEqual(app.client.cancelled, ["t"])

    def test_new_drops_the_session(self):
        app, _ = make_app()
        app.session_id = "s1"
        app.task_rows = {"t": {"task_id": "t", "kind": "agent", "state": "done",
                               "prompt": "hi", "result": "x", "session_id": "s1"}}
        app._view_dirty = True
        app._sync_view()
        app._run_command("/new")
        self.assertEqual(app.session_id, "")
        self.assertEqual(app.task_rows, {})
        self.assertFalse([entry for entry in app.entries if entry.kind == "user"])
        self.assertFalse(app.busy)


class Human(unittest.TestCase):
    def test_thousands_read_compactly(self):
        self.assertEqual(human_tokens(128000), "128k")
        self.assertEqual(human_tokens(1500), "1.5k")
        self.assertEqual(human_tokens(2400000), "2.4M")
        self.assertEqual(human_tokens(0), "0")


class AnsiFallback(unittest.TestCase):
    def test_the_ansi_palette_uses_named_colours(self):
        theme = build("ansi")
        self.assertTrue(theme["accent"].startswith("ansi:"))
        self.assertEqual(theme.colour.mode, "16")

    def test_truecolor_emits_24_bit_sgr(self):
        theme = build("dark")
        code = theme.colour.sgr("#7DA1DE")
        self.assertIn("38;2;125;161;222", code)


class ConsoleMode(unittest.TestCase):
    def test_line_echo_and_signal_handling_are_all_switched_off(self):
        from kit.screen import (
            ENABLE_ECHO_INPUT, ENABLE_EXTENDED_FLAGS, ENABLE_LINE_INPUT,
            ENABLE_MOUSE_INPUT, ENABLE_PROCESSED_INPUT,
            ENABLE_QUICK_EDIT_MODE, ENABLE_VIRTUAL_TERMINAL_INPUT, raw_input_mode,
        )
        # A stock console: processed + line + echo + quick edit.
        stock = 0x0001 | 0x0002 | 0x0004 | 0x0040 | 0x0080 | 0x0010 | 0x0100
        raw = raw_input_mode(stock)
        for flag in (ENABLE_PROCESSED_INPUT, ENABLE_LINE_INPUT, ENABLE_ECHO_INPUT,
                     ENABLE_VIRTUAL_TERMINAL_INPUT, ENABLE_MOUSE_INPUT):
            self.assertEqual(raw & flag, 0, f"{flag:#x} must be cleared")
        self.assertFalse(raw & ENABLE_QUICK_EDIT_MODE, "quick edit must be cleared")
        self.assertTrue(raw & ENABLE_EXTENDED_FLAGS, "extended flags must stay set")
        self.assertTrue(raw & 0x0100, "unrelated flags are preserved")


class WindowsKeyNames(unittest.TestCase):
    """The Windows reader, driven by a fake msvcrt.

    Backspace is the key that broke in the field, so it gets an explicit case
    rather than relying on the terminal to behave.
    """

    def _read(self, sequence):
        import types

        class FakeMsvcrt(types.ModuleType):
            seq = list(sequence)

            def kbhit(self):
                return bool(FakeMsvcrt.seq)

            def getwch(self):
                return FakeMsvcrt.seq.pop(0)

        import kit.screen as screen
        saved = sys.modules.get("msvcrt")
        sys.modules["msvcrt"] = FakeMsvcrt("msvcrt")
        try:
            return screen.KeyReader()._windows(0.3)
        finally:
            if saved is None:
                sys.modules.pop("msvcrt", None)
            else:
                sys.modules["msvcrt"] = saved

    def test_backspace_after_characters(self):
        self.assertEqual(self._read(["a", "b", "\x08"]), ["a", "b", "bs"])

    def test_enter_arrows_and_delete(self):
        keys = self._read(["\r", "\x00", "H", "\x00", "P", "\xe0", "S"])
        self.assertEqual(keys, ["enter", "up", "down", "del"])

    def test_the_del_character_also_reads_as_backspace(self):
        self.assertEqual(self._read(["\x7f"]), ["bs"])

    def test_ctrl_keys_are_named(self):
        self.assertEqual(self._read(["\x03", "\x04", "\x0c"]), ["ctrl+c", "ctrl+d", "ctrl+l"])


class ConsoleRecords(unittest.TestCase):
    """The virtual-key path, which is what a real console is read through.

    It is decided from one record, so it can be checked without a console: this
    is the layer that has to keep Enter working when the terminal ignores the
    line/echo mode changes.
    """

    def test_enter_is_enter_whatever_the_line_mode_did(self):
        from kit.screen import win_key_name
        self.assertEqual(win_key_name(0x0D, "\r", 0), "enter")

    def test_backspace_comes_from_the_key_code_not_a_control_character(self):
        from kit.screen import win_key_name
        self.assertEqual(win_key_name(0x08, "\x08", 0), "bs")

    def test_arrows_use_virtual_keys(self):
        from kit.screen import win_key_name
        self.assertEqual(
            [win_key_name(vk, "", 0) for vk in (0x26, 0x28, 0x25, 0x27)],
            ["up", "down", "left", "right"],
        )

    def test_printable_characters_keep_their_text(self):
        from kit.screen import win_key_name
        self.assertEqual(win_key_name(0x41, "a", 0), "a")
        self.assertEqual(win_key_name(0x09, "\t", 0), "tab")

    def test_ctrl_plus_letter_becomes_ctrl_name(self):
        from kit.screen import win_key_name, LEFT_CTRL_PRESSED
        self.assertEqual(win_key_name(0x43, "\x03", LEFT_CTRL_PRESSED), "ctrl+c")

    def test_an_empty_record_yields_no_key(self):
        from kit.screen import win_key_name
        self.assertIsNone(win_key_name(0x70, "", 0))


class AltEnter(unittest.TestCase):
    def test_alt_enter_is_named_so_it_can_be_ignored_deliberately(self):
        from kit.screen import win_key_name, LEFT_ALT_PRESSED
        self.assertEqual(win_key_name(0x41, "a", LEFT_ALT_PRESSED), "alt+a")


@unittest.skipUnless(os.name == "nt", "Win32 console structures")
class ConsoleLayout(unittest.TestCase):
    """A wrong struct layout turns every key into garbage."""

    def test_the_structs_match_the_win32_headers(self):
        import ctypes
        from kit.screen import console_record_types

        KeyEvent, Record = console_record_types()
        self.assertEqual(ctypes.sizeof(KeyEvent), 16)
        self.assertEqual(ctypes.sizeof(Record), 20)
        offsets = {name: getattr(KeyEvent, name).offset for name, _ in KeyEvent._fields_}
        self.assertEqual(offsets["wVirtualKeyCode"], 6)
        self.assertEqual(offsets["uChar"], 10)
        self.assertEqual(offsets["dwControlKeyState"], 12)

    def test_a_synthetic_enter_record_decodes_to_enter(self):
        from kit.screen import console_record_types, win_key_name

        _, Record = console_record_types()
        record = Record()
        record.EventType = 0x0001
        record.Event.KeyEvent.bKeyDown = 1
        record.Event.KeyEvent.wVirtualKeyCode = 0x0D
        record.Event.KeyEvent.uChar = "\r"
        event = record.Event.KeyEvent
        self.assertEqual(win_key_name(event.wVirtualKeyCode, event.uChar,
                                      event.dwControlKeyState), "enter")


class EntryPoint(unittest.TestCase):
    def test_ui_refuses_a_pipe(self):
        root = os.path.dirname(os.path.abspath(__file__))
        result = subprocess.run(
            [sys.executable, os.path.join(root, "0kay.py"), "ui"],
            capture_output=True, text=True, timeout=30,
        )
        self.assertEqual(result.returncode, 2)
        self.assertIn("interactive terminal", result.stderr)

    def test_the_key_probe_refuses_a_pipe(self):
        root = os.path.dirname(os.path.abspath(__file__))
        result = subprocess.run(
            [sys.executable, os.path.join(root, "0kay.py"), "keys"],
            capture_output=True, text=True, timeout=30,
        )
        self.assertEqual(result.returncode, 2)
        self.assertIn("interactive terminal", result.stderr)

    def test_the_line_commands_still_list_in_help(self):
        root = os.path.dirname(os.path.abspath(__file__))
        result = subprocess.run(
            [sys.executable, os.path.join(root, "0kay.py"), "--help"],
            capture_output=True, text=True, timeout=30,
        )
        self.assertEqual(result.returncode, 0)
        self.assertIn("ui", result.stdout)
        self.assertIn("watch", result.stdout)


if __name__ == "__main__":
    unittest.main()


class Markdown(unittest.TestCase):
    def setUp(self):
        self.theme = build("dark")

    def render(self, text, width=48):
        return markdown.render(text, width, self.theme)

    def text(self, text, width=48):
        return [spans_to_text(row) for row in self.render(text, width)]

    def test_headings_lose_their_hashes(self):
        self.assertEqual(self.text("## What changed"), ["What changed"])

    def test_a_paragraph_is_joined_across_source_lines(self):
        # A single newline is a soft break; wrapping each source line on its
        # own is what made prose come out ragged.
        lines = self.text("alpha beta\ngamma delta")
        self.assertEqual(lines, ["alpha beta gamma delta"])

    def test_a_long_paragraph_wraps_within_the_width(self):
        for line in self.text("lorem ipsum " * 20, 30):
            self.assertLessEqual(display_width(line), 30)

    def test_code_keeps_its_columns(self):
        lines = self.text("```\n    indented\nx = 1\n```")
        self.assertIn("▏     indented", lines)
        self.assertIn("▏ x = 1", lines)

    def test_a_code_fence_prints_its_language(self):
        self.assertIn("▏ python", self.text("```python\nprint(1)\n```"))

    def test_bullets_get_a_marker_and_hang(self):
        lines = self.text("- one that is long enough to wrap onto a second row here")
        self.assertTrue(lines[0].startswith("• "))
        self.assertTrue(lines[1].startswith("  "))

    def test_ordered_items_keep_their_numbers(self):
        self.assertEqual(self.text("1. first")[0], "1. first")

    def test_quotes_get_a_gutter(self):
        self.assertTrue(self.text("> quoted")[0].startswith("▏ quoted"))

    def test_a_rule_becomes_a_line(self):
        self.assertEqual(set(self.text("---")[0]), {"─"})

    def test_table_rows_are_not_reflowed(self):
        lines = self.text("| a | b |\n| --- | --- |\n| 1 | 2 |")
        self.assertIn("| a | b |", lines)

    def test_inline_markers_disappear_from_the_text(self):
        joined = " ".join(self.text("**bold** and `code` and *ital*"))
        self.assertNotIn("**", joined)
        self.assertNotIn("`", joined)
        self.assertIn("bold", joined)
        self.assertIn("code", joined)

    def test_a_link_keeps_its_target_visible(self):
        self.assertIn("docs (https://x.y/z)", " ".join(self.text("[docs](https://x.y/z)")))

    def test_styles_are_actually_applied(self):
        rows = self.render("**bold** and *ital*")
        styles = [style for row in rows for _, style in row if style != Style()]
        self.assertTrue(styles, "expected at least one non-plain span")

    def test_empty_input_still_produces_one_row(self):
        self.assertEqual(self.text(""), [""])

    def test_no_row_ever_exceeds_the_width(self):
        sample = "# h\n\npara " * 5 + "\n```\n" + "y" * 90 + "\n```\n- item " * 4
        for width in (20, 33, 80):
            for row in self.render(sample, width):
                self.assertLessEqual(display_width(spans_to_text(row)), width)


class InputLayout(unittest.TestCase):
    def test_one_line_needs_one_row(self):
        rows, caret = _input_rows("hello", 20, 5)
        self.assertEqual(rows, ["hello"])
        self.assertEqual(caret, (0, 5))

    def test_a_newline_starts_a_row(self):
        rows, caret = _input_rows("ab" + chr(10) + "cd", 20, 5)
        self.assertEqual(rows, ["ab", "cd"])
        self.assertEqual(caret, (1, 2))

    def test_a_long_line_wraps_and_the_caret_follows(self):
        rows, caret = _input_rows("abcdefghij", 4, 9)
        self.assertEqual(rows, ["abcd", "efgh", "ij"])
        self.assertEqual(caret, (2, 1))

    def test_a_wide_character_does_not_split(self):
        rows, _ = _input_rows("插件插件", 5, 4)
        self.assertEqual(rows, ["插件", "插件"])

    def test_the_caret_keeps_its_column_across_a_wrap(self):
        rows, caret = _input_rows("插件插件", 5, 3)
        self.assertEqual(rows, ["插件", "插件"])
        self.assertEqual(caret, (1, 2))

    def test_the_caret_sits_where_the_next_character_goes(self):
        # The row is full and the character after the caret wraps, so the caret
        # moves with it rather than dangling at the end of the previous row.
        rows, caret = _input_rows("插件插件", 5, 2)
        self.assertEqual(rows, ["插件", "插件"])
        self.assertEqual(caret, (1, 0))




class Multiline(unittest.TestCase):
    def test_ctrl_j_inserts_a_newline(self):
        app, _ = make_app()
        for ch in "ab":
            app._handle_key(ch)
        app._handle_key("ctrl+j")
        app._handle_key("c")
        self.assertEqual("".join(app.buffer), "ab" + chr(10) + "c")

    def test_shift_enter_inserts_a_newline(self):
        app, _ = make_app()
        app._handle_key("a")
        app._handle_key("shift+enter")
        self.assertEqual("".join(app.buffer), "a" + chr(10))

    def test_enter_still_sends_a_multiline_draft_whole(self):
        app, _ = make_app()
        for ch in "one":
            app._handle_key(ch)
        app._handle_key("ctrl+j")
        for ch in "two":
            app._handle_key(ch)
        app._handle_key("enter")
        self.assertEqual(app.entries[0].text, "one" + chr(10) + "two")

    def test_the_box_grows_with_the_draft(self):
        app, capture = make_app(height=28)
        app._handle_key("a")
        app._draw()
        single = len([line for line in capture.frame.lines() if line.startswith("│")])
        app._handle_key("ctrl+j")
        app._handle_key("b")
        app._draw()
        double = len([line for line in capture.frame.lines() if line.startswith("│")])
        self.assertGreater(double, single)


class AtCompletion(unittest.TestCase):
    def test_a_mention_opens_the_path_palette(self):
        app, _ = make_app()
        for ch in "@an":
            app._handle_key(ch)
        self.assertTrue(app._palette_open())
        settle(app)
        names = [item.name for item in app._palette_items()]
        self.assertEqual(names, ["ansi.py"])

    def test_directories_come_before_files(self):
        app, _ = make_app()
        app._handle_key("@")
        app._palette_open()          # the frame that opens the palette fetches
        settle(app)
        first = app._palette_items()[0]
        self.assertEqual(first.name, "kit/")
        self.assertIn("directory", first.description)

    def test_the_title_says_which_directory_is_listed(self):
        app, capture = make_app()
        app._handle_key("@")
        app._palette_open()
        settle(app)
        app._draw()
        title = [line for line in capture.frame.lines() if "paths ·" in line][0]
        self.assertIn("paths ·", title)

    def test_tab_fills_the_name_in_place(self):
        app, _ = make_app()
        for ch in "look at @an":
            app._handle_key(ch)
        app._palette_open()
        settle(app)
        app._handle_key("tab")
        self.assertEqual("".join(app.buffer), "look at @ansi.py")

    def test_an_email_address_is_not_a_mention(self):
        app, _ = make_app()
        for ch in "mail me@x":
            app._handle_key(ch)
        self.assertFalse(app._palette_open())

    def test_a_space_ends_the_mention(self):
        app, _ = make_app()
        for ch in "@ansi.py and":
            app._handle_key(ch)
        self.assertFalse(app._palette_open())

    def test_the_listing_is_fetched_once_per_directory(self):
        app, _ = make_app()
        app._handle_key("@")
        app._palette_open()
        settle(app)
        count = len(app.client.tree_calls)
        app._palette_open()
        app._palette_open()
        settle(app)
        self.assertEqual(len(app.client.tree_calls), count)


class ModelSwitch(unittest.TestCase):
    def test_an_unknown_model_is_still_accepted_but_flagged(self):
        app, _ = make_app(client=CatalogClient())
        app._run_command("/model made-up")
        settle(app)
        self.assertEqual(app.model, "made-up")
        note = [e.text for e in app.entries if "model →" in e.text][0]
        self.assertIn("not in the catalog", note)

    def test_switching_reloads_the_window_rather_than_carrying_it_over(self):
        app, _ = make_app(client=CatalogClient())
        app.context_window = 128000
        app.context_source = "default"
        app._run_command("/model glm-5.3")
        settle(app)
        self.assertEqual(app.model, "glm-5.3")
        self.assertEqual(app.context_source, "default")
        self.assertEqual(app.context_window, 128000)


class ModelPicker(unittest.TestCase):
    """Switching has to be a choice, not a guess from a prefix."""

    def _open(self):
        app, capture = make_app(client=CatalogClient())
        app._run_command("/model")
        settle(app)
        return app, capture

    def test_a_bare_command_opens_a_chooser(self):
        app, _ = self._open()
        self.assertIsNotNone(app.panel)
        self.assertTrue(app.panel.selecting)
        self.assertEqual(app.panel.choices,
                         ["deepseek-flash", "glm-5.3", "glm-5.3-flash"])

    def test_the_cursor_starts_on_the_active_model(self):
        app, _ = self._open()
        app.model = "glm-5.3"
        app._run_command("/model")
        settle(app)
        self.assertEqual(app.panel.choices[app.panel.cursor], "glm-5.3")

    def test_arrows_move_and_enter_switches(self):
        app, _ = self._open()
        app._handle_key("down")
        self.assertEqual(app.panel.choices[app.panel.cursor], "glm-5.3")
        app._handle_key("enter")
        settle(app)
        self.assertIsNone(app.panel)
        self.assertEqual(app.model, "glm-5.3")
        self.assertIn("model → glm-5.3",
                      [entry.text for entry in app.entries if entry.kind == "system"])

    def test_the_cursor_does_not_wrap_past_the_ends(self):
        app, _ = self._open()
        app._handle_key("up")
        self.assertEqual(app.panel.cursor, 0)
        for _ in range(10):
            app._handle_key("down")
        self.assertEqual(app.panel.cursor, len(app.panel.choices) - 1)

    def test_escape_closes_without_switching(self):
        app, _ = self._open()
        before = app.model
        app._handle_key("esc")
        self.assertIsNone(app.panel)
        self.assertEqual(app.model, before)

    def test_an_ambiguous_prefix_opens_the_candidates(self):
        app, _ = make_app(client=CatalogClient())
        app._run_command("/model glm")
        settle(app)
        self.assertIsNotNone(app.panel)
        self.assertEqual(app.panel.choices, ["glm-5.3", "glm-5.3-flash"])
        self.assertNotIn(app.model, ("glm",), "the prefix must not be adopted as a model")

    def test_an_exact_id_switches_without_a_chooser(self):
        app, _ = make_app(client=CatalogClient())
        app._run_command("/model glm-5.3-flash")
        settle(app)
        self.assertIsNone(app.panel)
        self.assertEqual(app.model, "glm-5.3-flash")

    def test_a_unique_prefix_still_switches_directly(self):
        app, _ = make_app(client=CatalogClient())
        app._run_command("/model deepseek")
        settle(app)
        self.assertIsNone(app.panel)
        self.assertEqual(app.model, "deepseek-flash")


class ScrollAnchor(unittest.TestCase):
    def _long_app(self):
        app, capture = make_app(width=60, height=18)
        app.entries = [Entry("user", "q"), Entry("assistant", "line " * 200)]
        # Anchoring is about the transcript growing, so the answer is shown in
        # full here; folding has its own tests.
        app.expand_last = True
        app._draw()
        return app, capture

    def test_scrolling_up_is_reported_in_the_status(self):
        app, capture = self._long_app()
        app._handle_key("pgup")
        app._draw()
        self.assertIn("back", chr(10).join(capture.frame.lines()))

    def test_new_output_does_not_move_the_text_under_the_users_eyes(self):
        app, capture = self._long_app()
        app._handle_key("pgup")
        app._draw()
        visible = capture.frame.lines()[2:10]
        before_scroll = app.scroll
        app.entries[-1].text += (chr(10) * 2 + "more output arrived") * 6
        app._draw()
        self.assertGreater(app.scroll, before_scroll)
        self.assertEqual(capture.frame.lines()[2:10], visible)


class Folding(unittest.TestCase):
    """A long answer is folded so the shape of the conversation survives."""

    def _long(self):
        app, capture = make_app(width=70, height=30)
        app.entries = [Entry("user", "q"),
                       Entry("assistant", (chr(10) * 2).join(
                           f"para {i}" for i in range(60)))]
        return app, capture

    def test_a_long_answer_is_folded(self):
        app, capture = self._long()
        app._draw()
        body = chr(10).join(capture.frame.lines())
        self.assertIn("more lines · ctrl+o", body)
        self.assertNotIn("para 59", body)

    def test_ctrl_o_opens_it(self):
        app, capture = self._long()
        app._draw()
        app._handle_key("ctrl+o")
        app._draw()
        body = chr(10).join(capture.frame.lines())
        self.assertTrue(app.expand_last)
        self.assertNotIn("more lines · ctrl+o", body)

    def test_a_short_answer_is_never_folded(self):
        app, capture = make_app(width=70, height=30)
        app.entries = [Entry("user", "q"), Entry("assistant", "short answer")]
        app._draw()
        self.assertNotIn("ctrl+o", chr(10).join(capture.frame.lines()))


class StreamingTransport(unittest.TestCase):
    """Streaming is exercised over a real socket.

    The unit tests all use a fake client, which is exactly why a
    TypeError inside urlopen survived until a live call: nothing had ever
    opened the stream for real.
    """

    def setUp(self):
        import http.server
        import threading

        nl = chr(10)
        body = [event.encode() + nl.encode() for event in (
            'event: chunk' + nl + 'data: {"chunk": "po", "done": false}' + nl,
            'event: chunk' + nl + 'data: {"chunk": "ng"}' + nl,
            'event: chunk' + nl +
            'data: {"usage": {"prompt_tokens": 3, "completion_tokens": 2}}' + nl,
            'event: done' + nl + 'data: {}' + nl,
        )]

        class Handler(http.server.BaseHTTPRequestHandler):
            def do_POST(self):
                length = int(self.headers.get("Content-Length") or 0)
                self.rfile.read(length)
                self.send_response(200)
                self.send_header("Content-Type", "text/event-stream")
                self.end_headers()
                for chunk in body:
                    self.wfile.write(chunk)
                    self.wfile.flush()

            def log_message(self, *args):
                pass

        self.server = http.server.HTTPServer(("127.0.0.1", 0), Handler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.url = "http://127.0.0.1:%d" % self.server.server_address[1]

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()

    def test_the_stream_is_read_and_parsed(self):
        from kit.client import Client

        events = list(Client(self.url, timeout=5).chat("hi", [], model="x"))
        self.assertEqual([kind for kind, _ in events], ["chunk", "chunk", "usage", "done"])
        self.assertEqual(events[0][1] + events[1][1], "pong")
        self.assertEqual(events[2][1]["prompt_tokens"], 3)

    def test_an_error_event_becomes_one_error(self):
        import http.server
        import threading
        from kit.client import Client

        class Handler(http.server.BaseHTTPRequestHandler):
            def do_POST(self):
                self.rfile.read(int(self.headers.get("Content-Length") or 0))
                self.send_response(200)
                self.send_header("Content-Type", "text/event-stream")
                self.end_headers()
                nl = chr(10)
                self.wfile.write(
                    ('event: error' + nl + 'data: {"error": "upstream is down"}' + nl)
                    .encode())
                self.wfile.flush()

            def log_message(self, *args):
                pass

        server = http.server.HTTPServer(("127.0.0.1", 0), Handler)
        threading.Thread(target=server.serve_forever, daemon=True).start()
        try:
            url = "http://127.0.0.1:%d" % server.server_address[1]
            events = list(Client(url, timeout=5).chat("hi", [], model="x"))
            self.assertEqual(events, [("error", "upstream is down")])
        finally:
            server.shutdown()
            server.server_close()



class Logo(unittest.TestCase):
    """Our banner, at the height the terminal can afford."""

    STAR = chr(0x2726)     # the mark at the left of the status strip
    FULL = chr(0x2588)     # solid block: only ever part of the artwork
    HALF = chr(0x2580)     # upper half block: only in the compressed art
    QUADRANT = chr(0x2596)  # a quarter block: only in the half-width art

    def _art_rows(self, lines):
        return sum(1 for line in lines if self.FULL in line or self.HALF in line)

    def test_a_tall_terminal_shows_the_whole_banner(self):
        app, capture = make_app(width=100, height=32)
        app._draw()
        lines = capture.frame.lines()
        self.assertEqual(self._art_rows(lines), 24)
        self.assertNotIn(self.STAR, lines[0], "the strip is replaced, not stacked")

    def test_a_medium_terminal_shows_the_compressed_banner(self):
        app, capture = make_app(width=100, height=24)
        app._draw()
        lines = capture.frame.lines()
        self.assertEqual(self._art_rows(lines), 16, "half blocks, same artwork")
        self.assertIn(self.HALF, chr(10).join(lines))

    def test_a_small_terminal_falls_back_to_text(self):
        app, capture = make_app(width=100, height=20)
        app._draw()
        lines = capture.frame.lines()
        self.assertEqual(self._art_rows(lines), 0)
        self.assertIn(self.STAR, lines[0])

    def test_a_narrow_terminal_gets_the_half_width_banner(self):
        # 80 columns is the classic default and cannot hold a 46-wide logo
        # plus captions; halving the columns is what keeps the logo there.
        app, capture = make_app(width=80, height=30)
        app.model = "glm-5.3"
        app._draw()
        lines = capture.frame.lines()
        self.assertEqual(self._art_rows(lines), 24)
        # Captions move left to sit beside the narrow art (23 + 2 + 2).
        self.assertEqual(lines[10].find("0KAY"), 27)

    def test_a_narrow_and_short_terminal_gets_the_smallest_variant(self):
        app, capture = make_app(width=76, height=26)
        app.model = "glm-5.3"
        app._draw()
        lines = capture.frame.lines()
        self.assertEqual(self._art_rows(lines), 16)
        self.assertEqual(lines[7].find("0KAY"), 27)

    def test_a_very_narrow_terminal_falls_back_to_text(self):
        app, capture = make_app(width=50, height=30)
        app._draw()
        self.assertEqual(self._art_rows(capture.frame.lines()), 0)

    def test_the_captions_are_drawn_at_the_asset_column(self):
        app, capture = make_app(width=100, height=32)
        app.model = "glm-5.3"
        app._draw()
        lines = capture.frame.lines()
        self.assertEqual(lines[10][50:54], "0KAY")
        self.assertIn("glm-5.3", lines[12])

    def test_the_compressed_captions_sit_beside_the_compressed_art(self):
        app, capture = make_app(width=100, height=24)
        app.model = "glm-5.3"
        app._draw()
        lines = capture.frame.lines()
        self.assertEqual(lines[7][50:54], "0KAY")
        self.assertIn("glm-5.3", lines[9])

    def test_nothing_ever_exceeds_the_width(self):
        for width, height in ((60, 24), (82, 30), (100, 32), (140, 44)):
            app, capture = make_app(width=width, height=height)
            app.model = "a-very-long-model-identifier-here"
            app._draw()
            for line in capture.frame.lines():
                self.assertLessEqual(display_width(line.rstrip()), width)

    def test_a_client_notice_does_not_hide_the_banner(self):
        # Regression: a warning line made the landing fall back to text,
        # because any entry counted as "a conversation is in progress".
        app, capture = make_app(width=100, height=32)
        app.notice("starting with full access", "warn")
        app._sync_view()
        app._draw()
        lines = capture.frame.lines()
        self.assertEqual(self._art_rows(lines), 24)
        self.assertTrue(any("full access" in line for line in lines),
                        "the warning still has to be readable")

    def test_the_banner_is_not_drawn_over_a_conversation(self):
        app, capture = make_app(width=100, height=32)
        app.entries = [Entry("user", "hi")]
        app._view_dirty = False
        app._draw()
        self.assertNotIn(self.FULL, capture.frame.lines()[0])





class Palette(unittest.TestCase):
    """The TUI colours come from the WebUI, not from taste."""

    CSS = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                       "..", "webui", "src", "styles", "theme.css")

    def _tokens(self):
        import re
        with open(self.CSS, encoding="utf-8") as handle:
            text = handle.read()
        return {name: value.lower()
                for name, value in re.findall(r"(--md-[a-z-]+):\s*(#[0-9a-fA-F]{6})", text)}

    def setUp(self):
        if not os.path.exists(self.CSS):
            raise unittest.SkipTest("the WebUI palette is not next to this checkout")

    def test_the_light_accent_is_the_webui_primary(self):
        from kit.theme import LIGHT
        self.assertEqual(LIGHT["accent"], self._tokens()["--md-primary"])

    def test_light_body_text_matches_the_webui(self):
        from kit.theme import LIGHT
        tokens = self._tokens()
        self.assertEqual(LIGHT["text"], tokens["--md-on-surface"])
        self.assertEqual(LIGHT["muted"], tokens["--md-on-surface-variant"])
        self.assertEqual(LIGHT["error"], tokens["--md-error"])
        self.assertEqual(LIGHT["success"], tokens["--md-success"])
        self.assertEqual(LIGHT["warning"], tokens["--md-warning"])

    def test_dark_is_the_webui_scheme_in_inverse(self):
        # The WebUI ships one light scheme; MD3's inverse tokens are its dark
        # counterpart, so the dark theme is derived rather than invented.
        from kit.theme import DARK
        tokens = self._tokens()
        self.assertEqual(DARK["accent"], tokens["--md-inverse-primary"])
        self.assertEqual(DARK["text"], tokens["--md-inverse-on-surface"])

    def test_both_palettes_define_the_same_roles(self):
        from kit.theme import DARK, LIGHT
        self.assertEqual(sorted(DARK), sorted(LIGHT))
