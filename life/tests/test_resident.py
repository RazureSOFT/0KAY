"""The resident, interruptible thinking process.

Pins the architectural gap: between runs nothing thought about the character's
own goals, and a message could not cut into an in-flight run.  These tests drive
the thinker with a fake model (no network) and assert the state persists, the
mind resumes, and an interrupt parks the thought instead of losing it.
"""
import asyncio
import json
import sys
import tempfile
import types
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.engine import LifeEngine
from life.engine.resident import MentalState, ResidentThinker


def _fake_model(payload, hook=None):
    async def generate(self, model_id, messages, system_prompt="", thinking=False,
                       max_tokens=1024, temperature=None, usage=None):
        if hook is not None:
            hook()
        yield json.dumps(payload, ensure_ascii=False)
    return generate


class MentalStateTests(unittest.TestCase):
    def test_scratchpad_is_bounded(self):
        state = MentalState()
        for index in range(50):
            state.add_thought(f"念头{index}")
        self.assertLessEqual(len(state.scratchpad), 12)
        self.assertEqual(state.last_thought, "念头49")

    def test_round_trip(self):
        state = MentalState()
        state.focus = "在想一个问题"
        state.add_thought("我今天有点累")
        state.ticks = 3
        restored = MentalState.from_dict(state.to_dict())
        self.assertEqual(restored.focus, "在想一个问题")
        self.assertEqual(restored.scratchpad, state.scratchpad)
        self.assertEqual(restored.ticks, 3)


class ResidentThinkerTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.resident = self.engine.resident

    def tearDown(self):
        self.directory.cleanup()

    def _patch(self, payload, hook=None):
        self.engine.mocr.generate = types.MethodType(_fake_model(payload, hook), self.engine.mocr)

    def test_a_thought_is_recorded_and_persisted(self):
        self._patch({"thought": "我有点想他了", "focus": "想想今天要做什么"})
        self.assertTrue(asyncio.run(self.resident._think_once()))
        self.assertEqual(self.resident.state.last_thought, "我有点想他了")
        self.assertEqual(self.resident.state.focus, "想想今天要做什么")
        # Persisted, and readable back as the character's own voice.
        self.assertEqual(self.engine.companion.latest_self_statement(), "我有点想他了")
        self.assertTrue(self.resident.state_path.exists())

    def test_the_character_can_set_its_own_goal_while_thinking(self):
        self._patch({"thought": "我想把身体养好", "goal_add": [{"title": "每天散步二十分钟", "detail": "自己定的"}]})
        asyncio.run(self.resident._think_once())
        titles = [g["title"] for g in self.engine.companion.list_goals("")]
        self.assertIn("每天散步二十分钟", titles)

    def test_goal_log_advances_an_existing_goal(self):
        goal = self.engine.companion.add_goal("学会做手冲咖啡", kind="self")
        self._patch({"thought": "今天练了手冲",
                     "goal_log": [{"title": "学会做手冲咖啡", "evidence": "练了一次", "progress": 0.3}]})
        asyncio.run(self.resident._think_once())
        logs = self.engine.companion.goal_logs(goal["id"])
        self.assertTrue(logs)

    def test_an_interrupt_parks_the_thought_instead_of_losing_it(self):
        def interrupt():
            self.resident._interrupted = True
        self._patch({"thought": "被打断的念头", "focus": "某件事"}, hook=interrupt)
        self.assertFalse(asyncio.run(self.resident._think_once()))
        self.assertEqual(self.resident.state.pending, "被打断的念头")
        self.assertEqual(self.resident.state.last_thought, "")
        self.assertEqual(self.resident.state.ticks, 0)

    def test_context_block_reports_the_current_focus(self):
        self.resident.state.focus = "在想怎么修好关系"
        self.assertIn("在想怎么修好关系", self.resident.context_block())

    def test_notify_marks_the_user_as_present(self):
        self.resident.notify_user_message("s1", "u1", "在吗")
        self.assertTrue(self.resident._interrupted)
        self.assertTrue(self.resident._in_user_cooldown())

    def test_the_loop_runs_and_stops(self):
        calls = []

        async def scenario():
            self.resident.interval = 0.01
            async def fake_once():
                calls.append(1)
                return True
            self.resident._think_once = fake_once
            self.assertTrue(self.resident.start())
            # The tick now also runs the body clock, which touches real SQLite
            # files before the first thought. On a loaded machine that can eat
            # the whole window, so wait on the observable outcome instead of
            # guessing a sleep duration (this test was the suite's one flaky).
            for _ in range(200):
                if calls:
                    break
                await asyncio.sleep(0.01)
            await self.resident.stop()
        asyncio.run(scenario())
        self.assertTrue(calls, "the resident loop never produced a tick")
        self.assertFalse(self.resident.running)

    def test_state_survives_a_restart(self):
        self._patch({"thought": "记住这个念头", "focus": "延续的焦点"})
        asyncio.run(self.resident._think_once())
        reopened = ResidentThinker(self.engine)
        self.assertEqual(reopened.state.last_thought, "记住这个念头")
        self.assertEqual(reopened.state.focus, "延续的焦点")

    def test_disabled_when_interval_is_zero(self):
        thinker = ResidentThinker(self.engine, interval_seconds=0)
        self.assertFalse(thinker.enabled)
        self.assertFalse(thinker.start())

    def test_autonomous_time_can_now_use_self_set_goals(self):
        # The prompt already told the character to use these, but the allow-list
        # rejected them, so the capability was dead.
        for name in ("goal_add", "goal_log", "goal_list"):
            self.assertIn(name, self.engine.AUTONOMY_TOOLS)

    def test_cadence_shortens_when_something_is_live(self):
        self.resident.interval = 100.0
        settling = asyncio.run(self.resident._effective_interval())
        self.resident.state.focus = "我在想一件没做完的事"
        engaged = asyncio.run(self.resident._effective_interval())
        self.assertLess(engaged, settling)

    def test_empty_thoughts_back_the_cadence_off(self):
        self.resident.interval = 100.0
        baseline = asyncio.run(self.resident._effective_interval())
        self.resident._idle_streak = 3
        self.assertGreater(asyncio.run(self.resident._effective_interval()), baseline)

    def test_daily_budget_stops_thinking(self):
        self.engine.companion.set_settings({"daily_token_limit": "10"})
        self.engine.usage.summary = lambda: {"today": {"input": 100, "output": 0}}
        self.assertFalse(self.resident._should_think())


if __name__ == "__main__":
    unittest.main()
