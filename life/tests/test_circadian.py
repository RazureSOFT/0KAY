from datetime import datetime, timedelta
import unittest
from test_regression import LifeEngine
from life.circadian.circadian import CircadianSystem


class CircadianTests(unittest.TestCase):
    def test_learning_is_bounded_and_persisted(self):
        rhythm = CircadianSystem()
        start = datetime(2026, 9, 1, 23)
        for day in range(5):
            before = rhythm.sleep_hour
            for hour in (23, 0, 1):
                rhythm.observe_interaction((start + timedelta(days=day)).replace(hour=hour))
            self.assertLessEqual(abs((rhythm.sleep_hour-before+12)%24-12), 1)
        self.assertNotEqual(rhythm.sleep_hour, 23)
        restored = CircadianSystem()
        restored.restore(rhythm.to_dict())
        self.assertEqual(restored.sleep_hour, rhythm.sleep_hour)
        self.assertEqual(restored.activity_days, rhythm.activity_days)

    def test_one_day_does_not_change_schedule(self):
        rhythm = CircadianSystem()
        for _ in range(100): rhythm.observe_interaction(datetime(2026, 9, 1, 2))
        self.assertEqual(rhythm.sleep_hour, 23)
        self.assertEqual(len(rhythm.activity_days['2026-09-01']), 1)
        self.assertTrue(rhythm.in_sleep_window(datetime(2026, 9, 1, 2)))
        self.assertFalse(rhythm.in_sleep_window(datetime(2026, 9, 1, 12)))

    def test_persona_includes_age_and_time(self):
        context = LifeEngine._persona({'name':'Test', 'birthDate':'2000-01-01'})
        self.assertIn('Current age:', context)
        self.assertIn('Current local time:', context)
