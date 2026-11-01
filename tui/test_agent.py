"""Tests for the agent-facing controls: permission, effort, approvals, questions.

Kept apart from `test_kit` because these are about what the client does with a
blocked agent, not about how a row is drawn. The fixtures live in `test_kit`.
"""

import os
import socket
import sys
import time
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from test_kit import make_app, settle, wait_for


def pump_until(app, predicate, timeout=3.0):
    """Drain the queue until `predicate` holds -- events need a drain pass."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        app._drain()
        if predicate():
            return True
        time.sleep(0.01)
    return predicate()
from kit.app import EFFORT_GLYPHS, EFFORT_OVERDRIVE, EFFORT_SPIN, EFFORT_STEPS


class Permission(unittest.TestCase):
    """Ask-before-acting versus full access, and what each sends."""

    def test_the_default_is_normal(self):
        app, _ = make_app()
        self.assertEqual(app.permission, "normal")

    def test_the_picker_offers_both_modes(self):
        app, _ = make_app()
        app._run_command("/permission")
        self.assertEqual(app.panel.choices, ["normal", "full_access"])

    def test_full_access_is_warned_about(self):
        app, capture = make_app()
        app._run_command("/permission full")
        self.assertEqual(app.permission, "full_access")
        self.assertTrue([entry for entry in app.entries if entry.kind == "warn"])
        app._draw()
        self.assertIn("full access", chr(10).join(capture.frame.lines()))

    def test_the_mode_is_sent_with_the_turn(self):
        app, _ = make_app()
        app._run_command("/permission full")
        for ch in "hi":
            app._handle_key(ch)
        app._handle_key("enter")
        self.assertTrue(wait_for(lambda: app.client.sent_options))
        self.assertEqual(app.client.sent_options[-1]["permission"], "full_access")

    def test_normal_does_not_warn(self):
        app, _ = make_app()
        app._run_command("/permission normal")
        self.assertEqual(app.permission, "normal")
        self.assertFalse([entry for entry in app.entries if entry.kind == "warn"])

    def test_picking_from_the_list_applies(self):
        app, _ = make_app()
        app._run_command("/permission")
        app._handle_key("down")
        app._handle_key("enter")
        self.assertEqual(app.permission, "full_access")


class Intensity(unittest.TestCase):
    """Five stops with a flourish between them, not a continuum."""

    def test_a_level_name_is_accepted_directly(self):
        app, _ = make_app()
        app._run_command("/intensity high")
        self.assertEqual(app.intensity, "high")

    def test_a_number_snaps_to_the_nearest_stop(self):
        app, _ = make_app()
        app._run_command("/intensity 70")
        self.assertEqual(app.intensity, "high")

    def test_a_bad_value_lists_the_stops(self):
        app, _ = make_app()
        app._run_command("/intensity turbo")
        self.assertEqual(app.intensity, "")
        self.assertTrue([e for e in app.entries
                         if "off, low, medium, high, max" in e.text])

    def test_the_panel_opens_on_a_stop(self):
        app, _ = make_app()
        app._run_command("/intensity")
        self.assertIn(app.panel.slider, (0, 20, 50, 75, 100))

    def test_arrows_jump_a_whole_level(self):
        app, _ = make_app()
        app._run_command("/intensity")           # opens at medium
        app._handle_key("right")
        self.assertEqual(app.panel.slider, 75, "right goes medium -> high")
        app._handle_key("right")
        self.assertEqual(app.panel.slider, 100)
        app._handle_key("left")
        self.assertEqual(app.panel.slider, 75)

    def test_it_cannot_go_past_the_ends(self):
        app, _ = make_app()
        app._run_command("/intensity")
        for _ in range(9):
            app._handle_key("left")
        self.assertEqual(app.panel.slider, 0)
        for _ in range(9):
            app._handle_key("right")
        self.assertEqual(app.panel.slider, 100)

    def test_home_and_end_pick_the_extremes(self):
        app, _ = make_app()
        app._run_command("/intensity")
        app._handle_key("home")
        self.assertEqual(app.panel.slider, 0)
        app._handle_key("end")
        self.assertEqual(app.panel.slider, 100)

    def test_changing_a_level_plays_an_animation(self):
        app, _ = make_app()
        app._run_command("/intensity")
        self.assertFalse(app.animating())
        app._handle_key("right")
        self.assertTrue(app.animating())
        self.assertEqual(app.anim_level, "high")

    def test_the_animation_spins_through_frames(self):
        app, _ = make_app()
        # Deterministic: the frame is a function of the elapsed time.
        self.assertIn(app.effort_frame(), EFFORT_SPIN + EFFORT_OVERDRIVE
                      + tuple(EFFORT_GLYPHS.values()))
        frames = set()
        app._start_effort_animation("high")
        for step in range(6):
            app.anim_started = time.monotonic() - step * 0.03
            frames.add(app.effort_frame())
        self.assertGreater(len(frames), 1, "the knob should turn while animating")

    def test_max_gets_its_own_loud_effect(self):
        app, _ = make_app()
        app._start_effort_animation("max")
        self.assertTrue(app.animating())
        self.assertIn("max", app.anim_level)
        # The overdrive frames are not the quiet level glyph.
        app.anim_started = time.monotonic() - 0.02
        self.assertIn(app.effort_frame(), EFFORT_OVERDRIVE)

    def test_the_overdrive_lasts_longer_than_a_normal_change(self):
        app, _ = make_app()
        app._start_effort_animation("high")
        normal = app.anim_until - app.anim_started
        app._start_effort_animation("max")
        loud = app.anim_until - app.anim_started
        self.assertGreater(loud, normal)

    def test_the_settled_glyph_is_the_level(self):
        app, _ = make_app()
        app.anim_until = 0.0
        app.anim_level = "high"
        self.assertEqual(app.effort_frame(), EFFORT_GLYPHS["high"])

    def test_enter_applies_and_stops_animating_the_panel(self):
        app, _ = make_app()
        app._run_command("/intensity")
        app._handle_key("end")
        app._handle_key("enter")
        self.assertIsNone(app.panel)
        self.assertEqual(app.intensity, "max")
        note = [e for e in app.entries if "effort →" in e.text][0]
        self.assertIn("max", note.text)

    def test_max_is_warned_about(self):
        app, _ = make_app()
        app._run_command("/intensity max")
        self.assertEqual(app.entries[-1].kind, "warn")

    def test_the_panel_draws_every_stop(self):
        app, capture = make_app(width=100, height=30)
        app._run_command("/intensity")
        app._draw()
        body = chr(10).join(capture.frame.lines())
        for level in EFFORT_STEPS:
            self.assertIn(level, body)

    def test_the_effort_is_sent_with_the_turn(self):
        app, _ = make_app()
        app._run_command("/intensity high")
        for ch in "hi":
            app._handle_key(ch)
        app._handle_key("enter")
        self.assertTrue(wait_for(lambda: app.client.sent_options))
        self.assertEqual(app.client.sent_options[-1]["intensity"], "high")


class Approvals(unittest.TestCase):
    def _with_approval(self):
        app, _ = make_app()
        app.session_id = "s1"
        app.client.pending_approvals = [{
            "id": "a1", "tool": "bash", "session_id": "s1",
            "args": {"command": "rm -rf build"},
        }]
        app._apply_pending(app.client.approvals(), [])
        return app

    def test_a_waiting_approval_is_announced_once(self):
        app = self._with_approval()
        waiting = [e for e in app.entries if "approval waiting" in e.text]
        self.assertEqual(len(waiting), 1)
        self.assertIn("bash", waiting[0].text)
        app._apply_pending(app.client.approvals(), [])
        self.assertEqual(
            len([e for e in app.entries if "approval waiting" in e.text]), 1)

    def test_the_status_line_says_how_many(self):
        app = self._with_approval()
        app._draw()
        self.assertIn("1 approval", chr(10).join(app.renderer.frame.lines()))

    def test_the_panel_shows_the_command_and_allows_it(self):
        app = self._with_approval()
        app._run_command("/approvals")
        self.assertEqual(app.panel.choices, ["a1"])
        self.assertIn("rm -rf build", app.panel.lines[0])
        app._handle_key("enter")
        settle(app)
        self.assertEqual(app.client.decisions, [("a1", True)])
        self.assertEqual(app.approvals, [])
        self.assertFalse([e for e in app.entries if "approval waiting" in e.text])

    def test_d_denies(self):
        app = self._with_approval()
        app._run_command("/approvals")
        app._handle_key("d")
        settle(app)
        self.assertEqual(app.client.decisions, [("a1", False)])

    def test_escape_leaves_it_pending(self):
        app = self._with_approval()
        app._run_command("/approvals")
        app._handle_key("esc")
        settle(app)
        self.assertEqual(app.client.decisions, [])
        self.assertEqual(len(app.approvals), 1)

    def test_nothing_waiting_says_so(self):
        app, _ = make_app()
        app._run_command("/approvals")
        self.assertIsNone(app.panel)
        self.assertTrue([e for e in app.entries if "nothing waiting" in e.text])


class Questions(unittest.TestCase):
    def _with_question(self):
        app, _ = make_app()
        app.session_id = "s1"
        app.client.pending_questions = [{
            "id": "q1", "session_id": "s1",
            "question": "Which branch should I use?",
            "options": ["main", "dev"],
        }]
        app._apply_pending([], app.client.questions())
        return app

    def test_a_question_is_announced_and_listed(self):
        app = self._with_question()
        self.assertTrue([e for e in app.entries if "question waiting" in e.text])
        app._run_command("/questions")
        body = chr(10).join(app.panel.lines)
        self.assertIn("Which branch", body)
        self.assertIn("main", body)

    def test_a_single_question_numbers_its_options(self):
        app = self._with_question()
        app._run_command("/questions")
        self.assertEqual(app.panel.action, "question")
        self.assertIn("  2. dev", app.panel.lines)

    def test_a_digit_answers_that_option(self):
        app = self._with_question()
        app._run_command("/questions")
        app._handle_key("2")
        settle(app)
        self.assertEqual(app.client.answers, [("q1", "dev")])

    def test_enter_hands_the_keyboard_back_to_the_prompt(self):
        app = self._with_question()
        app._run_command("/questions")
        app._handle_key("enter")
        self.assertIsNone(app.panel)
        # The prompt is now an answer box for this question.
        self.assertIsNotNone(app._answer_target())

    def test_typing_in_the_prompt_answers_the_question(self):
        app = self._with_question()
        for ch in "dev":
            app._handle_key(ch)
        app._handle_key("enter")
        settle(app)
        self.assertEqual(app.client.answers, [("q1", "dev")])
        self.assertEqual(app.buffer, [])

    def test_a_slash_command_still_runs_instead_of_answering(self):
        app = self._with_question()
        for ch in "/questions":
            app._handle_key(ch)
        app._handle_key("enter")
        settle(app)
        self.assertEqual(app.client.answers, [])
        self.assertIsNotNone(app.panel)

    def test_escape_closes_the_dialog_and_keeps_the_question(self):
        app = self._with_question()
        app._handle_key("esc")                 # close the dialog
        self.assertIsNone(app.panel)
        app._handle_key("esc")                 # leave answering mode
        self.assertTrue([e for e in app.entries if "left the question pending" in e.text])
        self.assertIsNotNone(app._answer_target())

    def test_typing_through_the_dialog_starts_the_answer(self):
        app = self._with_question()
        self.assertIsNotNone(app.panel)
        for ch in "dev":
            app._handle_key(ch)
        self.assertIsNone(app.panel, "the first keystroke closes the dialog")
        self.assertEqual("".join(app.buffer), "dev")

    def test_answering_by_number(self):
        app = self._with_question()
        app._run_command("/answer 1 dev")
        settle(app)
        self.assertEqual(app.client.answers, [("q1", "dev")])

    def test_an_unknown_number_is_rejected(self):
        app = self._with_question()
        app._run_command("/answer 9 dev")
        settle(app)
        self.assertEqual(app.client.answers, [])
        self.assertTrue([e for e in app.entries if "no question 9" in e.text])

    def test_an_empty_answer_is_rejected(self):
        app = self._with_question()
        app._run_command("/answer 1")
        settle(app)
        self.assertEqual(app.client.answers, [])
        self.assertTrue([e for e in app.entries if "usage: /answer" in e.text])


if __name__ == "__main__":
    unittest.main()


class AgentChoice(unittest.TestCase):
    """Which machine runs the turn, and the directory it works in."""

    def _with_agents(self, workdir=""):
        app, _ = make_app()
        app.client.agent_rows = [
            {"plugin_id": "plugin_local", "name": "agent", "status": "PLUGIN_STATUS_HEALTHY",
             "address": "localhost:50054",
             "host": {"hostname": socket.gethostname(), "workdir": "D:/work/here"}},
            {"plugin_id": "plugin_far", "name": "agent", "status": "PLUGIN_STATUS_HEALTHY",
             "address": "10.0.0.9:50054",
             "host": {"hostname": "far", "workdir": "/srv/project"}},
        ]
        app.workdir = workdir
        app.workdir_explicit = bool(workdir)
        app._load_agents()
        return app

    def test_a_local_agent_works_in_this_directory(self):
        app = self._with_agents()
        self.assertEqual(app.workdir, os.getcwd())

    def test_a_remote_agent_brings_its_own_directory(self):
        app = self._with_agents()
        app._run_command("/agent plugin_far")
        self.assertEqual(app.workdir, "/srv/project")

    def test_an_explicit_workdir_wins_over_the_agent(self):
        app = self._with_agents(workdir="C:/mine")
        self.assertEqual(app.workdir, "C:/mine")

    def test_the_picker_offers_auto_and_every_agent(self):
        app = self._with_agents()
        app._run_command("/agent")
        self.assertEqual(app.panel.choices, ["", "plugin_local", "plugin_far"])
        self.assertIn("far", app.panel.lines[2])

    def test_choosing_an_agent_switches_the_workdir_with_it(self):
        app = self._with_agents()
        app._run_command("/agent")
        app._handle_key("down")
        app._handle_key("down")
        app._handle_key("enter")
        self.assertEqual(app.executor, "plugin_far")
        self.assertEqual(app.workdir, "/srv/project")
        self.assertIn("far", [e.text for e in app.entries if "agent →" in e.text][0])

    def test_auto_sends_no_executor(self):
        app = self._with_agents()
        app._run_command("/agent auto")
        for ch in "hi":
            app._handle_key(ch)
        app._handle_key("enter")
        self.assertTrue(wait_for(lambda: app.client.sent_options))
        self.assertEqual(app.client.sent_options[-1]["executor"], "")

    def test_a_chosen_agent_is_sent_with_the_turn(self):
        app = self._with_agents()
        app._run_command("/agent plugin_far")
        for ch in "hi":
            app._handle_key(ch)
        app._handle_key("enter")
        self.assertTrue(wait_for(lambda: app.client.sent_options))
        self.assertEqual(app.client.sent_options[-1]["executor"], "plugin_far")

    def test_no_agent_at_all_is_reported_before_the_first_prompt(self):
        app, _ = make_app()
        app.client.agent_rows = []
        app._load_agents()
        self.assertTrue([e for e in app.entries if "no agent registered" in e.text])
        self.assertEqual(app.entries[-1].kind, "warn")

    def test_an_offline_agent_is_called_out(self):
        app, _ = make_app()
        app.client.agent_rows = [
            {"plugin_id": "p1", "name": "agent", "status": "PLUGIN_STATUS_UNHEALTHY",
             "host": {"hostname": "far", "workdir": "/srv"}}]
        app._load_agents()
        self.assertTrue([e for e in app.entries if "no agent online" in e.text])


class Resume(unittest.TestCase):
    """Picking up an earlier conversation instead of starting over."""

    def _with_history(self, state_path=None):
        app, _ = make_app()
        app.client.session_rows = [
            {"session_id": "agent-session:new", "prompt": "the newer one",
             "started_at": "2026-10-31T22:00:00+08:00"},
            {"session_id": "agent-session:old", "prompt": "the older one",
             "started_at": "2026-10-31T20:00:00+08:00"},
            {"session_id": "agent-session:life:s1:1", "prompt": "",
             "started_at": "2026-10-31T19:00:00+08:00"},
        ]
        app.client.turn_rows = {
            "agent-session:old": [
                {"task_id": "t1", "kind": "agent", "state": "done",
                 "prompt": "hello", "result": "hi there",
                 "started_at": "2026-10-31T20:00:01+08:00"}],
        }
        return app

    def test_the_list_is_newest_first_and_skips_plugin_sessions(self):
        app = self._with_history()
        app._run_command("/resume")
        settle(app)
        self.assertEqual(app.panel.choices, ["agent-session:new", "agent-session:old"])
        self.assertIn("the newer one", app.panel.lines[0])

    def test_choosing_one_loads_its_conversation(self):
        app = self._with_history()
        app._run_command("/resume")
        settle(app)
        app._handle_key("down")
        app._handle_key("enter")
        settle(app)
        self.assertEqual(app.session_id, "agent-session:old")
        self.assertEqual([e.text for e in app.entries if e.kind == "user"], ["hello"])
        self.assertEqual([e.text for e in app.entries if e.kind == "assistant"],
                         ["hi there"])
        self.assertTrue([e for e in app.entries if "resumed" in e.text])

    def test_resuming_drops_the_previous_conversation(self):
        app = self._with_history()
        app.task_rows = {"x": {"task_id": "x", "kind": "agent", "state": "done",
                               "prompt": "stale", "result": "stale",
                               "session_id": "agent-session:other"}}
        app._view_dirty = True
        app._sync_view()
        app._run_command("/resume agent-session:old")
        settle(app)
        self.assertNotIn("x", app.task_rows)
        self.assertFalse([e for e in app.entries if "stale" in e.text])

    def test_the_session_id_survives_for_the_next_launch(self):
        import tempfile
        from kit import state
        with tempfile.TemporaryDirectory() as folder:
            os.environ["OKAY_TUI_STATE"] = os.path.join(folder, "state.json")
            try:
                app = self._with_history()
                app._run_command("/resume agent-session:old")
                settle(app)
                self.assertEqual(state.last_session(), "agent-session:old")
            finally:
                os.environ.pop("OKAY_TUI_STATE", None)

    def test_r_renames_the_selected_session(self):
        app = self._with_history()
        app._run_command("/resume")
        settle(app)
        app._handle_key("r")
        self.assertEqual(app.manual.get("kind"), "rename")
        for ch in "new name":
            app._handle_key(ch)
        app._handle_key("enter")
        settle(app)
        self.assertEqual(app.client.renamed, [("agent-session:new", "new name")])
        self.assertTrue([e for e in app.entries if "renamed" in e.text])

    def test_x_needs_two_presses_to_delete(self):
        app = self._with_history()
        app._run_command("/resume")
        settle(app)
        app._handle_key("x")
        settle(app)
        self.assertEqual(app.client.deleted, [], "one press must not delete")
        self.assertIn("again", app._panel_hint)
        app._handle_key("x")
        settle(app)
        self.assertEqual(app.client.deleted, ["agent-session:new"])

    def test_deleting_the_current_session_clears_it(self):
        app = self._with_history()
        app.session_id = "agent-session:new"
        app._run_command("/resume")
        settle(app)
        app._handle_key("x")
        app._handle_key("x")
        settle(app)
        self.assertEqual(app.session_id, "")

    def test_escape_after_one_x_keeps_the_session(self):
        app = self._with_history()
        app._run_command("/resume")
        settle(app)
        app._handle_key("x")
        app._handle_key("esc")
        settle(app)
        self.assertEqual(app.client.deleted, [])

    def test_fork_switches_to_the_copy(self):
        app = self._with_history()
        app.session_id = "agent-session:new"
        app._run_command("/fork")
        self.assertTrue(pump_until(app, lambda: app.session_id == "agent-session:fork"))
        self.assertEqual(app.client.forked, ["agent-session:new"])
        self.assertTrue([e for e in app.entries if "forked" in e.text])

    def test_forking_nothing_says_so(self):
        app, _ = make_app()
        app.session_id = ""
        app._run_command("/fork")
        self.assertTrue([e for e in app.entries if "nothing to fork" in e.text])
        self.assertEqual(app.client.forked, [])

    def test_a_archives_and_u_restores(self):
        app = self._with_history()
        app._run_command("/resume")
        settle(app)
        app._handle_key("a")
        settle(app)
        self.assertEqual(app.client.archived, [("agent-session:new", False)])
        app._run_command("/resume")
        settle(app)
        app._handle_key("u")
        settle(app)
        self.assertEqual(app.client.archived[-1], ("agent-session:new", True))

    def test_search_filters_the_list(self):
        app = self._with_history()
        app._run_command("/resume")
        settle(app)
        app._handle_key("/")
        self.assertEqual(app.manual.get("kind"), "search")
        for ch in "old":
            app._handle_key(ch)
        app._handle_key("enter")
        settle(app)
        self.assertEqual(app.sessions_query, "old")
        self.assertEqual(app.panel.choices, ["agent-session:old"])

    def test_archived_sessions_are_hidden_until_asked(self):
        app = self._with_history()
        app.client.session_rows.append({
            "session_id": "agent-session:gone", "prompt": "archived one",
            "started_at": "2026-10-30T10:00:00+08:00", "state": "archived"})
        app._run_command("/resume")
        settle(app)
        self.assertNotIn("agent-session:gone", app.panel.choices)
        self.assertTrue(any("archived" in line for line in app.panel.lines))
        app._run_command("/resume archived")
        settle(app)
        self.assertIn("agent-session:gone", app.panel.choices)

    def test_a_session_can_be_named_directly(self):
        app = self._with_history()
        app._run_command("/resume agent-session:new")
        settle(app)
        self.assertEqual(app.session_id, "agent-session:new")


class WhereItRuns(unittest.TestCase):
    """The agent and the working directory have to be visible, not implied."""

    def _with_agent(self, remote=False, chosen=False):
        app, capture = make_app()
        app.client.agent_rows = [{
            "plugin_id": "plugin_local", "name": "agent",
            "status": "PLUGIN_STATUS_HEALTHY",
            "host": {"hostname": "elsewhere" if remote else socket.gethostname(),
                     "workdir": "/srv/project" if remote else "D:/here"},
        }]
        app._load_agents()
        if chosen:
            app._run_command("/agent plugin_local")
        return app, capture

    def test_the_landing_names_the_agent_and_the_workdir(self):
        app, capture = self._with_agent()
        app._draw()
        body = chr(10).join(capture.frame.lines())
        self.assertIn(app.workdir, body)
        self.assertIn("(auto)", body, "auto is shown only next to who it resolved to")

    def test_the_prompt_border_carries_the_workdir(self):
        app, capture = self._with_agent()
        app._draw()
        top = [line for line in capture.frame.lines() if line.startswith("╭─")]
        self.assertTrue(top)
        self.assertIn(app._workdir_title(), top[0])

    def test_a_chosen_agent_is_named_in_the_status_line(self):
        app, capture = self._with_agent(chosen=True)
        app._draw()
        status = [line for line in capture.frame.lines() if "ready" in line][0]
        self.assertIn(socket.gethostname(), status)

    def test_an_implicit_single_agent_does_not_crowd_the_status_line(self):
        app, capture = self._with_agent()
        app.model = "deepseek-flash"
        app._draw()
        status = [line for line in capture.frame.lines() if "ready" in line][0]
        self.assertIn("deepseek-flash", status)
        self.assertNotIn(socket.gethostname(), status)

    def test_a_remote_agent_brings_its_own_directory_into_view(self):
        app, _ = self._with_agent(remote=True, chosen=True)
        app._draw()
        self.assertEqual(app.workdir, "/srv/project")
        self.assertEqual(app._workdir_title(), "/srv/project")

    def test_a_long_path_is_trimmed_from_the_left(self):
        app, _ = make_app()
        app.workdir = "C:/a/very/long/path/that/keeps/going/and/going/project"
        title = app._workdir_title()
        self.assertLessEqual(len(title), 28)
        self.assertTrue(title.startswith("…"))
        self.assertTrue(title.endswith("project"))

    def test_no_agent_at_all_is_shown_in_red_on_the_status_line(self):
        app, capture = make_app()
        app.client.agent_rows = []
        app._load_agents()
        app._draw()
        status = [line for line in capture.frame.lines() if "ready" in line][0]
        self.assertIn("no agent", status)



class Export(unittest.TestCase):
    """The conversation, written out as markdown."""

    def test_it_writes_the_transcript(self):
        import tempfile
        from kit import state
        with tempfile.TemporaryDirectory() as folder:
            os.environ["OKAY_TUI_STATE"] = os.path.join(folder, "state.json")
            try:
                app, _ = make_app()
                app.session_id = "agent-session:x"
                app.task_rows = {
                    "t": {"task_id": "t", "kind": "agent", "state": "done",
                          "prompt": "fix the bug", "result": "**fixed**",
                          "session_id": "agent-session:x", "started_at": "1"},
                    "w": {"task_id": "w", "kind": "tool", "state": "done",
                          "parent_id": "t", "prompt": "bash", "result": "ok",
                          "started_at": "2"},
                }
                app._view_dirty = True
                app._sync_view()
                app._run_command("/export demo.md")
                path = os.path.join(folder, "exports", "demo.md")
                self.assertTrue(os.path.exists(path))
                with open(path, encoding="utf-8") as handle:
                    body = handle.read()
                self.assertIn("fix the bug", body)
                self.assertIn("fixed", body)
                self.assertIn("`bash`", body)
                self.assertIn("agent-session:x", body)
            finally:
                os.environ.pop("OKAY_TUI_STATE", None)

    def test_an_empty_conversation_is_refused(self):
        app, _ = make_app()
        app._run_command("/export")
        self.assertTrue([e for e in app.entries if "nothing to export" in e.text])


class HistorySearch(unittest.TestCase):
    """ctrl+r walks back through what was typed before."""

    def _app(self):
        app, _ = make_app()
        app.history = ["git status", "npm test", "git commit -m x"]
        return app

    def test_it_finds_the_newest_match(self):
        app = self._app()
        for ch in "git":
            app._handle_key(ch)
        app._handle_key("ctrl+r")
        self.assertEqual("".join(app.buffer), "git commit -m x")

    def test_repeating_walks_further_back(self):
        app = self._app()
        for ch in "git":
            app._handle_key(ch)
        app._handle_key("ctrl+r")
        app._handle_key("ctrl+r")
        self.assertEqual("".join(app.buffer), "git status")

    def test_typing_ends_the_walk(self):
        app = self._app()
        for ch in "git":
            app._handle_key(ch)
        app._handle_key("ctrl+r")
        app._handle_key("x")
        self.assertIsNone(app.search_index)

    def test_no_match_says_so(self):
        app = self._app()
        for ch in "zzz":
            app._handle_key(ch)
        app._handle_key("ctrl+r")
        self.assertTrue([e for e in app.entries if "no earlier match" in e.text])


class Todos(unittest.TestCase):
    """todowrite returns a list; the transcript only ever showed its JSON."""

    def _with_todos(self, todos):
        import json
        app, capture = make_app()
        app.session_id = "s"
        app.task_rows = {
            "t": {"task_id": "t", "kind": "agent", "state": "done",
                  "prompt": "go", "result": "done", "session_id": "s",
                  "started_at": "0"},
            "w": {"task_id": "w", "kind": "tool", "state": "done",
                  "parent_id": "t", "prompt": "todowrite", "started_at": "1",
                  "result": json.dumps({"success": True, "data": {"todos": todos}})},
        }
        app._view_dirty = True
        app._sync_view()
        return app, capture

    def test_the_panel_marks_each_state(self):
        app, capture = self._with_todos([
            {"content": "read code", "status": "completed"},
            {"content": "change it", "status": "in_progress"},
            {"content": "test it", "status": "pending"},
            {"content": "dropped", "status": "cancelled"}])
        app._run_command("/todo")
        self.assertEqual(app.panel.title, "todos · 1/3")
        body = chr(10).join(app.panel.lines)
        self.assertIn("✓ read code", body)
        self.assertIn("▸ change it", body)
        self.assertIn("· test it", body)
        self.assertIn("(dropped)", body)

    def test_the_status_line_shows_progress(self):
        app, capture = self._with_todos([
            {"content": "a", "status": "completed"},
            {"content": "b", "status": "pending"}])
        app._draw()
        status = [line for line in capture.frame.lines() if "ready" in line][0]
        self.assertIn("☑ 1/2", status)

    def test_only_the_newest_list_counts(self):
        import json
        app, _ = self._with_todos([{"content": "old", "status": "pending"}])
        app.task_rows["w2"] = {
            "task_id": "w2", "kind": "tool", "state": "done", "parent_id": "t",
            "prompt": "todowrite", "started_at": "9",
            "result": json.dumps({"success": True, "data": {"todos": [
                {"content": "new", "status": "completed"}]}})}
        app._run_command("/todo")
        body = chr(10).join(app.panel.lines)
        self.assertIn("new", body)
        self.assertNotIn("old", body)

    def test_no_list_says_so(self):
        app, _ = make_app()
        app._run_command("/todo")
        self.assertIsNone(app.panel)
        self.assertTrue([e for e in app.entries if "no todo list" in e.text])
