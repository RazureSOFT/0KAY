import asyncio
import sys
import unittest
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from life.tools.tools import RuntimeToolConfig, ToolRegistry, LookWatchTool, create_default_registry  # noqa: E402


class FakeCompanion:
    def __init__(self, rows):
        self.rows = rows

    def agenda_for_day(self, day):
        return list(self.rows)


def run(coro):
    return asyncio.run(coro)


class LookWatch(unittest.TestCase):
    def _clock(self):
        return datetime(2026, 10, 31, 15, 40)

    def test_it_reports_the_clock_and_the_daypart(self):
        tool = LookWatchTool(clock=self._clock)
        result = run(tool.execute())
        self.assertTrue(result.success)
        self.assertEqual(result.data["now"], "2026-10-31 15:40")
        self.assertEqual(result.data["weekday"], "Saturday")
        self.assertEqual(result.data["part_of_day"], "afternoon")
        self.assertIsNone(result.data["next"])

    def test_it_lists_today_and_counts_down_to_the_next_item(self):
        companion = FakeCompanion([
            {"title": "Dentist", "start_at": "2026-10-31T16:10", "detail": "", "status": "pending"},
            {"title": "Coffee", "start_at": "2026-10-31 09:00", "detail": "", "status": "done"},
        ])
        result = run(LookWatchTool(companion=companion, clock=self._clock).execute())
        self.assertTrue(result.success)
        self.assertEqual([item["title"] for item in result.data["agenda_today"]], ["Coffee", "Dentist"])
        self.assertEqual(result.data["next"]["title"], "Dentist")
        self.assertEqual(result.data["next"]["in_minutes"], 30)

    def test_a_broken_schedule_does_not_break_the_clock(self):
        class Broken:
            def agenda_for_day(self, day):
                raise RuntimeError("db is locked")

        result = run(LookWatchTool(companion=Broken(), clock=self._clock).execute())
        self.assertTrue(result.success)
        self.assertEqual(result.data["now"], "2026-10-31 15:40")
        self.assertIn("db is locked", result.data["agenda_error"])
        self.assertTrue(LookWatchTool(clock=self._clock).name == "look_watch")


class ActionAliases(unittest.TestCase):
    def test_send_computer_is_the_advertised_name(self):
        registry = create_default_registry(config=RuntimeToolConfig())
        advertised = {tool["name"] for tool in registry.list_tools()}
        self.assertIn("send_computer", advertised)
        self.assertIn("look_watch", advertised)
        self.assertNotIn("computeruse", advertised)

    def test_the_old_name_still_dispatches(self):
        registry = create_default_registry(config=RuntimeToolConfig())
        tool = registry.get("computeruse")
        self.assertIsNotNone(tool)
        self.assertEqual(tool.name, "send_computer")
        self.assertEqual(registry.resolve("computeruse"), "send_computer")

    def test_approval_looks_through_aliases(self):
        registry = ToolRegistry()
        registry.register_alias("computeruse", "send_computer")
        registry.approval_tools = {"send_computer"}
        self.assertTrue(registry.needs_approval("computeruse", {}))

    def test_an_unknown_tool_still_fails_loudly(self):
        registry = create_default_registry(config=RuntimeToolConfig())
        result = run(registry.call("no_such_tool"))
        self.assertFalse(result.success)
        self.assertIn("not found", result.error)


if __name__ == "__main__":
    unittest.main()
