"""The Ctrl+B side panel: context, todos, git, live state.

It is a split view, so most of these tests are about what the column says and
what it does when the terminal cannot afford the split.
"""

import json
import unittest

from test_kit import make_app


def panel_app(width=124, height=30):
    app, capture = make_app(width=width, height=height)
    app.online = True
    app.side_panel = True
    return app, capture


def body(app, capture):
    app._draw()
    return chr(10).join(capture.frame.lines())


def with_todos(app, todos):
    app.task_rows = {
        "t": {"task_id": "t", "kind": "agent", "state": "running",
              "prompt": "work", "session_id": "s", "started_at": "1"},
        "w": {"task_id": "w", "kind": "tool", "state": "done",
              "parent_id": "t", "prompt": "todowrite", "started_at": "2",
              "result": json.dumps({"success": True, "data": {"todos": todos}})},
    }
    app._view_dirty = True
    app._sync_view()
    return app


class Layout(unittest.TestCase):
    def test_ctrl_b_toggles_the_panel(self):
        app, capture = make_app(width=124, height=30)
        app._draw()
        self.assertNotIn("│ context", chr(10).join(capture.frame.lines()))
        app._handle_key("ctrl+b")
        app._draw()
        self.assertTrue(app.side_panel)
        self.assertIn("│ context", chr(10).join(capture.frame.lines()))
        app._handle_key("ctrl+b")
        app._draw()
        self.assertFalse(app.side_panel)

    def test_a_narrow_terminal_keeps_the_full_width_transcript(self):
        app, capture = make_app(width=90, height=30)
        app.side_panel = True
        text = body(app, capture)
        self.assertNotIn("│ context", text)
        self.assertEqual(app._side_width(90), 0)

    def test_a_modal_panel_wins_the_screen(self):
        app, capture = make_app(width=124, height=30)
        app.side_panel = True
        app._run_command("/permission")
        app._draw()
        self.assertEqual(app._side_width(124), 0, "a dialog gets the whole width")

    def test_nothing_exceeds_the_terminal_width(self):
        for width in (100, 124, 160):
            app, capture = panel_app(width=width, height=30)
            with_todos(app, [{"content": "a very long todo item " * 4,
                              "status": "in_progress"}])
            app.git_branch = "feature/a-really-long-branch-name"
            app.git_files = [{"path": "x" * 80, "index": "M", "worktree": " "}]
            app._draw()
            for line in capture.frame.lines():
                self.assertLessEqual(len(line), width)


class Content(unittest.TestCase):
    def test_context_shows_the_bar_and_the_breakdown(self):
        app, capture = panel_app()
        app.context_used = 3217
        app.context_window = 128000
        app.context_breakdown = {"system": 817, "tools": 1418, "skills": 831,
                                 "mcp": 140, "conversation": 3217,
                                 "compact_tier": "none"}
        app.context_threshold = 48000
        text = body(app, capture)
        self.assertIn("context", text)
        self.assertIn("817", text)
        self.assertIn("1.4k", text)
        self.assertIn("compacts at", text)

    def test_todos_are_listed_with_their_state(self):
        app, capture = panel_app()
        with_todos(app, [
            {"content": "read code", "status": "completed"},
            {"content": "change it", "status": "in_progress"},
            {"content": "test it", "status": "pending"}])
        text = body(app, capture)
        self.assertIn("todos · 1/3", text)
        self.assertIn("✓ read code", text)
        self.assertIn("▸ change it", text)

    def test_git_shows_the_branch_and_the_dirty_files(self):
        app, capture = panel_app()
        app.git_branch = "main"
        app.git_files = [{"path": "kit/app.py", "index": " ", "worktree": "M"},
                         {"path": "docs/x.md", "index": "D", "worktree": " "}]
        text = body(app, capture)
        self.assertIn("git · main · 2 changed", text)
        self.assertIn("kit/app.py", text)
        self.assertIn("D  docs/x.md", text)

    def test_a_clean_tree_says_so(self):
        app, capture = panel_app()
        app.git_branch = "main"
        app.git_files = []
        self.assertIn("clean", body(app, capture))

    def test_live_state_names_the_agent_and_the_permission(self):
        app, capture = panel_app()
        app.model = "glm-5.3"
        app.queued = ["later"]
        text = body(app, capture)
        self.assertIn("glm-5.3", text)
        self.assertIn("normal", text)
        self.assertIn("queued", text)

    def test_a_full_access_session_is_flagged(self):
        app, capture = panel_app()
        app.permission = "full_access"
        self.assertIn("full access", body(app, capture))


class Refresh(unittest.TestCase):
    def test_the_branch_arrives_through_the_queue(self):
        import time
        app, _ = panel_app()
        app.client.git_branch = "dev"
        app.client.git_files = [{"path": "a.py", "index": " ", "worktree": "M"}]
        app.git_at = 0.0
        app._refresh_git()
        deadline = time.monotonic() + 3
        while time.monotonic() < deadline and app.git_branch != "dev":
            app._drain()
            time.sleep(0.01)
        self.assertEqual(app.git_branch, "dev")
        self.assertEqual(app.git_files[0]["path"], "a.py")

    def test_it_does_not_ask_again_immediately(self):
        app, _ = panel_app()
        calls = []
        app.client.git = lambda path="": calls.append(path) or {"branch": "x"}
        app.git_at = 0.0
        app._refresh_git()
        app._refresh_git()
        self.assertEqual(len(calls), 1, "the panel must not poll on every frame")

    def test_no_panel_no_request(self):
        app, _ = make_app()
        app.side_panel = False
        calls = []
        app.client.git = lambda path="": calls.append(path) or {}
        app.git_at = 0.0
        app._refresh_git()
        self.assertEqual(calls, [])


if __name__ == "__main__":
    unittest.main()
