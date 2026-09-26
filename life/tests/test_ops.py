import sys
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.companion import CompanionSystem
from life.engine import LifeEngine


class BackupAndMigration(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.companion = CompanionSystem(self.directory.name)

    def tearDown(self):
        self.directory.cleanup()

    def test_backup_creates_file_and_prunes(self):
        for _ in range(3):
            result = self.companion.backup(keep=2)
            self.assertTrue(result["backup"])
        backups = list((Path(self.directory.name) / "companion" / "backups").glob("companion-*.db"))
        self.assertLessEqual(len(backups), 2)

    def test_backup_if_due_once_per_day(self):
        first = self.companion.backup_if_due()
        self.assertNotIn("skipped", first)
        second = self.companion.backup_if_due()
        self.assertEqual(second.get("skipped"), "done")

    def test_schema_version_set(self):
        with self.companion.db() as db:
            version = db.execute("PRAGMA user_version").fetchone()[0]
        self.assertEqual(version, CompanionSystem.DB_SCHEMA_VERSION)


class GroupContinuation(unittest.TestCase):
    def test_recent_topic_enables_continuation(self):
        with tempfile.TemporaryDirectory() as directory:
            companion = CompanionSystem(directory)
            companion.note_group_bot_spoke("g1", "有人玩钢琴吗")
            self.assertTrue(companion.group_should_continue("g1", "我也想学钢琴"))
            self.assertFalse(companion.group_should_continue("g1", "今天天气不错"))
            self.assertFalse(companion.group_should_continue("g2", "钢琴"))

    def test_stale_conversation_does_not_continue(self):
        with tempfile.TemporaryDirectory() as directory:
            companion = CompanionSystem(directory)
            companion.note_group_bot_spoke("g1", "钢琴")
            with companion.db() as db:
                old = (datetime.now() - timedelta(hours=2)).isoformat()
                db.execute("UPDATE group_bot_state SET last_spoke=? WHERE group_id='g1'", (old,))
            self.assertFalse(companion.group_should_continue("g1", "钢琴"))


class DailyReviewAndMedia(unittest.IsolatedAsyncioTestCase):
    async def test_daily_review_runs(self):
        with tempfile.TemporaryDirectory() as directory:
            engine = LifeEngine(directory)

            class Model:
                async def generate(self, *args, **kwargs):
                    yield "ok"

            engine.mocr = Model()
            result = await engine.run_daily_review(True)
            self.assertIn("date", result)
            self.assertIn("summary", result)
            reviews = engine.companion.list_daily_reviews()
            self.assertEqual(reviews[0]["date"], result["date"])

    async def test_send_media_fail_closed_without_onebot(self):
        with tempfile.TemporaryDirectory() as directory:
            engine = LifeEngine(directory)
            result = await engine.send_media("tts", "user:1", {"text": "hi"})
            self.assertFalse(result["ok"])
            self.assertIn("onebot", result["reason"])

    async def test_autonomy_actions_are_allowlisted(self):
        from life.tools.tools import ToolResult
        with tempfile.TemporaryDirectory() as directory:
            engine = LifeEngine(directory)
            calls: list[dict] = []

            async def fake_minecraft(args):
                calls.append(args)
                return ToolResult(True, {"ok": True})

            engine._call_minecraft = fake_minecraft

            # Disabled: nothing runs, action is audited as blocked.
            ran = await engine._run_autonomy_actions([{"tool": "minecraft", "arguments": {"action": "autopilot_start"}}])
            self.assertEqual(ran, 0)
            self.assertEqual(calls, [])

            engine.tool_config.minecraft_enabled = True
            ran = await engine._run_autonomy_actions([
                {"tool": "minecraft", "arguments": {"action": "nope"}},    # unknown action
                {"tool": "minecraft", "arguments": {"action": "autopilot_start"}},
            ])
            self.assertEqual(ran, 1)
            self.assertEqual(calls, [{"action": "autopilot_start"}])
            # Unknown tools are ignored even when minecraft is enabled.
            ran = await engine._run_autonomy_actions([{"tool": "shell", "arguments": {"action": "rm"}}])
            self.assertEqual(ran, 0)
            self.assertEqual(len(calls), 1)
            self.assertTrue(any(item["topic"] == "游戏" for item in engine.companion.snapshot()["timeline"]))


if __name__ == "__main__":
    unittest.main()
