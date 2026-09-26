import sys
import tempfile
import unittest
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life import diary
from life.companion import CompanionSystem
from life.engine import LifeEngine


class DiariesAreNeverWrittenForAFutureDay(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)

    def tearDown(self):
        self.directory.cleanup()

    def test_target_day_rules(self):
        engine = self.engine
        self.assertEqual(engine._journal_target_day(datetime(2026, 9, 26, 0, 8), True), "2026-09-25")
        self.assertEqual(engine._journal_target_day(datetime(2026, 9, 25, 23, 28), True), "2026-09-25")
        self.assertEqual(engine._journal_target_day(datetime(2026, 9, 26, 8, 0), False), "2026-09-25")
        self.assertEqual(engine._journal_target_day(datetime(2026, 9, 26, 22, 30), False), "2026-09-26")

    def test_morning_catch_up_stops_once_the_day_is_recorded(self):
        self.engine.companion.journal("已写", "journal", "2026-09-25T23:58:00")
        self.assertEqual(self.engine._journal_target_day(datetime(2026, 9, 26, 8, 0), False), "2026-09-26")

    def test_dream_night_key_spans_midnight(self):
        self.assertEqual(self.engine._dream_night_key(datetime(2026, 9, 25, 23, 30)), "2026-09-25")
        self.assertEqual(self.engine._dream_night_key(datetime(2026, 9, 26, 0, 8)), "2026-09-25")


class JournalGrounding(unittest.TestCase):
    def test_planned_items_are_never_narrated_as_done(self):
        entries = [
            {"level": "planned", "source": "日程", "text": "09:00 整理书桌"},
            {"level": "confirmed", "source": "日程", "text": "07:30 起床拉伸"},
        ]
        bad = "凌晨醒了一下，早上把书桌整理好了，然后拉伸了一下。"
        self.assertTrue(diary.planned_written_as_done(bad, entries))
        good = "早上做了拉伸，打算晚点再整理书桌。"
        self.assertFalse(diary.planned_written_as_done(good, entries))

    def test_quality_flags_internal_terms_and_duplicates(self):
        entries = [{"level": "confirmed", "source": "日程", "text": "07:30 拉伸"}]
        issues = diary.quality_issues("今天系统里精力值是 97，拉伸完成。", entries, [], 20, 200)
        self.assertTrue(any("后台术语" in item for item in issues))
        prior = ["今天把书桌收拾干净了，充电线也理好了，看着很舒服。"]
        issues = diary.quality_issues("今天把书桌收拾干净了，充电线也理好了，看着很舒服。", entries, prior, 20, 200)
        self.assertTrue(any("过于相似" in item for item in issues))

    def test_has_journal_for_is_day_scoped(self):
        with tempfile.TemporaryDirectory() as directory:
            companion = CompanionSystem(directory)
            companion.journal("内容", "journal", "2026-09-25T23:58:00")
            self.assertTrue(companion.has_journal_for("2026-09-25", "journal"))
            self.assertFalse(companion.has_journal_for("2026-09-26", "journal"))
            self.assertFalse(companion.has_journal_for("2026-09-25", "dream"))


if __name__ == "__main__":
    unittest.main()
