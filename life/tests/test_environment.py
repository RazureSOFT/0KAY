import sys
import tempfile
import unittest
from datetime import date, datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.environment import EnvironmentSystem
from life.engine import LifeEngine


class EnvironmentTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.settings = {"env_city": "杭州", "env_timezone": "Asia/Shanghai"}
        self.env = EnvironmentSystem(self.directory.name, settings_getter=lambda: self.settings)

    def tearDown(self):
        self.directory.cleanup()

    def test_fixed_holidays_and_upcoming(self):
        self.assertEqual(self.env.holiday_on(date(2026, 10, 1)), "国庆节")
        self.assertEqual(self.env.holiday_on(date(2026, 9, 26)), "")
        upcoming = self.env.upcoming_holiday(10)
        self.assertIsNotNone(upcoming)
        self.assertIn("in_days", upcoming)

    def test_weather_degrades_without_fetch(self):
        self.assertEqual(self.env.weather_text(), "杭州")
        context = self.env.env_context()
        self.assertEqual(context["location"], "杭州")
        self.assertIn("local_time", context)

    def test_agenda_position(self):
        agenda = [
            {"title": "早起", "start_at": "2026-09-26 07:30"},
            {"title": "读书", "start_at": "2026-09-26 14:00"},
            {"title": "散步", "start_at": "2026-09-26 17:30"},
        ]
        current, following = LifeEngine._agenda_position(agenda, datetime(2026, 9, 26, 15, 0))
        self.assertEqual(current["title"], "读书")
        self.assertEqual(following["title"], "散步")


if __name__ == "__main__":
    unittest.main()
