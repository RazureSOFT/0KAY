"""File changes: the edit tool's own arguments, drawn as a diff.

The transcript used to say "edit ok", which tells the reader nothing about
what changed.
"""

import json
import unittest

from kit import session
from test_kit import make_app

OLD = "def add(a, b):\n    return a + b\n\ndef sub(a, b):\n    return a - b\n"
NEW = ("def add(a, b):\n    return a + b\n\ndef sub(a, b):\n"
       "    if a < b:\n        return 0\n    return a - b\n")


def edit_row(old=OLD, new=NEW, path="kit/mathx.py", name="edit"):
    args = {"filePath": path}
    args["oldString" if name == "edit" else "content"] = old if name == "edit" else new
    if name == "edit":
        args["newString"] = new
    return {"task_id": "e", "kind": "tool", "state": "done", "prompt": name,
            "started_at": "2", "result": '{"success":true}',
            "args": json.dumps(args)}


class Parsing(unittest.TestCase):
    def test_an_edit_becomes_additions_and_deletions(self):
        diff = session.tool_diff(edit_row())
        self.assertEqual((diff["adds"], diff["dels"]), (2, 0))
        kinds = [kind for kind, _ in diff["lines"]]
        self.assertIn("add", kinds)
        self.assertIn("ctx", kinds)
        self.assertIn("hunk", kinds)

    def test_a_removal_is_counted(self):
        diff = session.tool_diff(edit_row(old="a\nb\nc\n", new="a\nc\n"))
        self.assertEqual(diff["dels"], 1)

    def test_a_replacement_has_both_sides(self):
        diff = session.tool_diff(edit_row(old="value = 1\n", new="value = 2\n"))
        self.assertEqual((diff["adds"], diff["dels"]), (1, 1))

    def test_write_is_all_additions(self):
        diff = session.tool_diff(edit_row(name="write", new="one\ntwo\n", old=""))
        self.assertEqual((diff["adds"], diff["dels"]), (2, 0))
        self.assertTrue(all(kind == "add" for kind, _ in diff["lines"]))

    def test_other_tools_have_no_diff(self):
        row = edit_row()
        row["prompt"] = "bash"
        row["args"] = json.dumps({"command": "ls"})
        self.assertIsNone(session.tool_diff(row))

    def test_broken_arguments_are_ignored(self):
        row = edit_row()
        row["args"] = "{not json"
        self.assertIsNone(session.tool_diff(row))

    def test_a_missing_file_path_still_diffs(self):
        row = edit_row()
        args = json.loads(row["args"])
        del args["filePath"]
        row["args"] = json.dumps(args)
        self.assertEqual(session.tool_diff(row)["path"], "")

    def test_a_huge_diff_is_capped(self):
        diff = session.tool_diff(edit_row(old="", new="line\n" * 400))
        self.assertEqual(len(diff["lines"]), session.MAX_DIFF_LINES)
        self.assertGreater(diff["more"], 0)


class Rendering(unittest.TestCase):
    def _app(self, row=None):
        app, capture = make_app(width=90, height=30)
        app.session_id = "s"
        app.task_rows = {
            "t": {"task_id": "t", "kind": "agent", "state": "done",
                  "prompt": "go", "result": "done", "session_id": "s",
                  "started_at": "1"},
            "e": dict(row or edit_row(), parent_id="t"),
        }
        app._view_dirty = True
        app._sync_view()
        return app, capture

    def _body(self, app, capture):
        app._draw()
        return chr(10).join(capture.frame.lines())

    def test_the_tool_line_says_what_changed(self):
        app, capture = self._app()
        self.assertIn("mathx.py  +2 -0", self._body(app, capture))

    def test_the_lines_are_drawn_with_signs(self):
        app, capture = self._app()
        body = self._body(app, capture)
        self.assertIn("+     if a < b:", body)
        self.assertIn("@@ -3,3 +3,5 @@", body)

    def test_a_long_diff_folds_until_details_are_open(self):
        row = edit_row(old="", new="line\n" * 40)
        app, capture = self._app(row)
        body = self._body(app, capture)
        self.assertIn("more lines · ctrl+o", body)
        app._handle_key("ctrl+o")
        body = self._body(app, capture)
        self.assertNotIn("more lines · ctrl+o", body)

    def test_a_short_diff_never_folds(self):
        app, capture = self._app()
        self.assertNotIn("more lines · ctrl+o", self._body(app, capture))

    def test_nothing_exceeds_the_width(self):
        row = edit_row(old="", new="x" * 300 + "\n")
        for width in (60, 90, 140):
            app, capture = make_app(width=width, height=30)
            app.session_id = "s"
            app.task_rows = {
                "t": {"task_id": "t", "kind": "agent", "state": "done",
                      "prompt": "go", "result": "done", "session_id": "s",
                      "started_at": "1"},
                "e": dict(row, parent_id="t"),
            }
            app._view_dirty = True
            app._sync_view()
            app._draw()
            for line in capture.frame.lines():
                self.assertLessEqual(len(line), width)


if __name__ == "__main__":
    unittest.main()
