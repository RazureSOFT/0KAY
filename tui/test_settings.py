"""Tests for the settings browser and the approval shortcuts.

The gateway exposes the same settings the WebUI edits (`/api/settings/{id}`),
so the terminal can change them without a browser. These tests cover the three
field shapes -- bool, select, text/number -- and the "never ask again" shortcut.
"""

import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from test_kit import make_app, settle


def _with_settings():
    app, capture = make_app()
    app.client.section_rows = [
        {"id": "agent", "label": "Agent", "fields": [{"key": "a"}, {"key": "b"}]},
        {"id": "mocr", "label": "模型", "fields": [{"key": "c"}]},
    ]
    app.client.section_rows_meta = {"agent": {"id": "agent", "fields": [
        {"key": "always_allow_tools", "type": "text", "label": "Always allow"},
        {"key": "minimal_mode", "type": "bool", "label": "Minimal"},
        {"key": "sandbox_mode", "type": "select", "label": "Sandbox",
         "options": ["read-only", "workspace-write", "danger-full-access"]},
        {"key": "temperature", "type": "number", "label": "Temperature"},
    ]}}
    app.client.setting_values = {
        "always_allow_tools": "read,glob",
        "minimal_mode": False,
        "sandbox_mode": "workspace-write",
        "temperature": 0.5,
    }
    return app, capture


class Settings(unittest.TestCase):
    """The WebUI's settings, editable from the terminal."""

    def test_the_section_list_comes_first(self):
        app, _ = _with_settings()
        app._run_command("/settings")
        settle(app)
        self.assertEqual(app.panel.choices, ["agent", "mocr"])
        self.assertTrue(any("Agent" in line for line in app.panel.lines))

    def test_a_section_lists_its_fields_with_values(self):
        app, _ = _with_settings()
        app._run_command("/settings agent")
        settle(app)
        self.assertEqual(app.panel.choices,
                         ["always_allow_tools", "minimal_mode", "sandbox_mode",
                          "temperature"])
        body = chr(10).join(app.panel.lines)
        self.assertIn("read,glob", body)
        self.assertIn("off", body)
        self.assertIn("workspace-write", body)

    def test_a_bool_flips_and_saves(self):
        app, _ = _with_settings()
        app._run_command("/settings agent")
        settle(app)
        app._edit_field("minimal_mode")
        settle(app)
        self.assertEqual(app.client.saved_settings, [("agent", {"minimal_mode": True})])

    def test_a_select_opens_its_options_on_the_current_one(self):
        app, _ = _with_settings()
        app._run_command("/settings agent")
        settle(app)
        app._edit_field("sandbox_mode")
        self.assertEqual(app.panel.choices,
                         ["read-only", "workspace-write", "danger-full-access"])
        self.assertEqual(app.panel.choices[app.panel.cursor], "workspace-write")
        app._handle_key("down")
        app._handle_key("enter")
        settle(app)
        self.assertEqual(app.client.saved_settings[-1],
                         ("agent", {"sandbox_mode": "danger-full-access"}))

    def test_text_is_typed_in_the_prompt_then_saved(self):
        app, _ = _with_settings()
        app._run_command("/settings agent")
        settle(app)
        app._edit_field("always_allow_tools")
        self.assertEqual(app.manual.get("key"), "always_allow_tools")
        for ch in "read":
            app._handle_key(ch)
        app._handle_key("enter")
        settle(app)
        self.assertEqual(app.client.saved_settings[-1],
                         ("agent", {"always_allow_tools": "read"}))
        self.assertEqual(app.manual, {})

    def test_a_number_is_sent_as_a_number(self):
        app, _ = _with_settings()
        app._run_command("/settings agent")
        settle(app)
        app._edit_field("temperature")
        for ch in "0.9":
            app._handle_key(ch)
        app._handle_key("enter")
        settle(app)
        self.assertEqual(app.client.saved_settings[-1], ("agent", {"temperature": 0.9}))

    def test_a_bad_number_is_rejected_without_saving(self):
        app, _ = _with_settings()
        app._run_command("/settings agent")
        settle(app)
        app._edit_field("temperature")
        for ch in "hot":
            app._handle_key(ch)
        app._handle_key("enter")
        settle(app)
        self.assertEqual(app.client.saved_settings, [])
        self.assertTrue([e for e in app.entries if "needs a number" in e.text])

    def test_escape_cancels_an_edit(self):
        app, _ = _with_settings()
        app._run_command("/settings agent")
        settle(app)
        app._edit_field("always_allow_tools")
        app._handle_key("esc")
        settle(app)
        self.assertEqual(app.manual, {})
        self.assertEqual(app.client.saved_settings, [])

    def test_choosing_a_section_from_the_list_loads_it(self):
        app, _ = _with_settings()
        app._run_command("/settings")
        settle(app)
        app._handle_key("enter")           # first entry is agent
        settle(app)
        self.assertEqual(app.settings_section, "agent")
        self.assertEqual(app.panel.choices[0], "always_allow_tools")

    def test_saving_refreshes_the_list(self):
        app, _ = _with_settings()
        app._run_command("/settings agent")
        settle(app)
        app._edit_field("minimal_mode")
        settle(app)
        self.assertTrue([e for e in app.entries if "minimal_mode → on" in e.text])


class FullAccess(unittest.TestCase):
    """Turning approvals off, and staying off across launches."""

    def _sandboxed(self):
        import tempfile
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        os.environ["OKAY_TUI_STATE"] = os.path.join(folder.name, "state.json")
        self.addCleanup(lambda: os.environ.pop("OKAY_TUI_STATE", None))
        return folder.name

    def test_the_command_sets_it(self):
        app, _ = make_app()
        app._run_command("/permission full")
        self.assertEqual(app.permission, "full_access")

    def test_it_is_sent_with_the_turn(self):
        app, _ = make_app()
        app._run_command("/permission full")
        for ch in "hi":
            app._handle_key(ch)
        app._handle_key("enter")
        from test_kit import wait_for
        self.assertTrue(wait_for(lambda: app.client.sent_options))
        self.assertEqual(app.client.sent_options[-1]["permission"], "full_access")

    def test_the_picker_offers_it(self):
        app, _ = make_app()
        app._run_command("/permission")
        self.assertEqual(app.panel.choices, ["normal", "full_access"])

    def test_it_survives_a_restart(self):
        self._sandboxed()
        app, _ = make_app()
        app._run_command("/permission full")
        again, _ = make_app()
        again.restore()
        self.assertEqual(again.permission, "full_access")
        self.assertTrue([e for e in again.entries if "full access" in e.text])

    def test_normal_is_remembered_too(self):
        self._sandboxed()
        app, _ = make_app()
        app._run_command("/permission full")
        app._run_command("/permission normal")
        again, _ = make_app()
        again.restore()
        self.assertEqual(again.permission, "normal")
        self.assertFalse([e for e in again.entries if "full access" in e.text])


class ApprovalShortcuts(unittest.TestCase):
    """y allows one, a allows everything waiting, A also remembers the tool."""

    def _pending(self, *tools):
        app, _ = make_app()
        app.session_id = "s1"
        app.client.setting_values = {"always_allow_tools": "read,glob"}
        app.client.pending_approvals = [
            {"id": f"a{index}", "tool": tool, "session_id": "s1", "args": {"command": "x"}}
            for index, tool in enumerate(tools, start=1)]
        app._apply_pending(app.client.approvals(), [])
        app._run_command("/approvals")
        return app

    def test_a_allows_everything_waiting(self):
        app = self._pending("bash", "write")
        app._handle_key("a")
        settle(app)
        self.assertEqual(app.client.decisions, [("a1", True), ("a2", True)])

    def test_shift_a_also_remembers_the_tool(self):
        app = self._pending("bash")
        app._handle_key("A")
        settle(app)
        self.assertEqual(app.client.decisions, [("a1", True)])
        self.assertEqual(app.client.saved_settings,
                         [("agent", {"always_allow_tools": "read,glob,bash"})])
        self.assertTrue([e for e in app.entries if "will not ask again" in e.text])

    def test_a_tool_already_allowed_is_not_duplicated(self):
        app = self._pending("glob")
        app._handle_key("A")
        settle(app)
        self.assertEqual(app.client.saved_settings, [])

    def test_y_and_n_still_act_on_the_selection_only(self):
        app = self._pending("bash", "write")
        app._handle_key("y")
        settle(app)
        self.assertEqual(app.client.decisions, [("a1", True)])


if __name__ == "__main__":
    unittest.main()
