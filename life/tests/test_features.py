import sys
import tempfile
import unittest
from datetime import date, datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.companion import CompanionSystem
from life.emotion.emotion import EmotionEngine
from life.engine import LifeEngine


class OutfitAndImages(unittest.IsolatedAsyncioTestCase):
    async def test_outfit_needs_wardrobe_and_is_fail_closed_for_images(self):
        with tempfile.TemporaryDirectory() as directory:
            engine = LifeEngine(directory)
            self.assertEqual(await engine.outfit_tick(True), {"skipped": "no_wardrobe"})
            engine.companion.upsert_world_knowledge("wardrobe", "风衣", "米色长款风衣")

            class Model:
                async def generate(self, *args, **kwargs):
                    yield "今天有风，套件米色风衣正好。"

            engine.mocr = Model()
            result = await engine.outfit_tick(True)
            self.assertIn("风衣", result["outfit"])
            self.assertTrue(engine.companion.has_journal_for(date.today().isoformat(), "outfit"))
            image = await engine.generate_image("一只猫")
            self.assertFalse(image["ok"])


class TopicsAndPortrait(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.companion = CompanionSystem(self.directory.name)

    def tearDown(self):
        self.directory.cleanup()

    def test_open_topics_roundtrip(self):
        self.companion.record_open_topics("u1", ["周末要不要看电影", "还没交的报告"])
        self.companion.record_open_topics("u1", ["周末要不要看电影"])  # dedup
        self.assertEqual(len(self.companion.list_open_topics("u1")), 2)
        self.companion.resolve_open_topics("u1", ["周末要不要看电影"])
        self.assertEqual(self.companion.list_open_topics("u1"), ["还没交的报告"])

    def test_portrait_upsert(self):
        self.companion.set_user_portrait("u1", "喜欢深夜聊科幻", "夜猫子")
        portrait = self.companion.get_user_portrait("u1")
        self.assertIn("科幻", portrait["summary"])
        self.assertEqual(portrait["traits"], "夜猫子")


class OutreachDeceleration(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.companion = CompanionSystem(self.directory.name)
        self.companion.set_settings({"owner_user_ids": "u1", "quiet_start": "0", "quiet_end": "0", "proactive_daily_limit": "99"})

    def tearDown(self):
        self.directory.cleanup()

    def test_unanswered_streak_pauses_and_reply_resets(self):
        for index in range(2):
            candidate = self.companion.create_proactive_candidate("user:u1", "care", f"hi {index}")
            self.companion.mark_proactive_delivered(candidate["id"], f"hi {index}")
        allowed, reason = self.companion.can_proactively_send("user:u1")
        self.assertFalse(allowed)
        self.assertIn("paused", reason)
        self.companion.note_outreach_reply("u1")
        _, reason = self.companion.can_proactively_send("user:u1")
        self.assertNotIn("paused", reason)

    def test_proactive_window(self):
        now = datetime(2026, 9, 26, 12, 0)
        self.assertTrue(LifeEngine._proactive_due({"preferred_at": "2026-09-26T11:00:00"}, now))
        self.assertFalse(LifeEngine._proactive_due({"preferred_at": "2026-09-26T13:00:00"}, now))
        self.assertFalse(LifeEngine._proactive_due({"best_until": "2026-09-26T11:00:00"}, now))
        self.assertFalse(LifeEngine._proactive_due({"expires_at": "2026-09-25T11:00:00"}, now))


class GroupUnderstanding(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.companion = CompanionSystem(self.directory.name)
        self.companion.group_upsert("g1", "observe")

    def tearDown(self):
        self.directory.cleanup()

    def test_mood_threads_and_social_graph(self):
        self.companion.observe_group("g1", "u1", "大家今天开心吗哈哈")
        self.companion.observe_group("g1", "u2", "我好烦啊无语了")
        atmosphere = self.companion.group_atmosphere("g1")
        self.assertIn(atmosphere["label"], ("热闹", "平稳", "有点低沉"))
        self.assertTrue(atmosphere["threads"])
        edges = self.companion.list_social_edges()
        self.assertTrue(any(edge["source_id"] == "u1" and edge["target_id"] == "u2" for edge in edges))

    def test_interest_match(self):
        self.companion.observe_group("g1", "u1", "有人玩钢琴吗")
        self.assertIn("钢琴", self.companion.group_interest_match("g1", ["钢琴"]))
        self.assertEqual(self.companion.group_interest_match("g1", ["爬山"]), [])


class GrowthAndTimeline(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.companion = CompanionSystem(self.directory.name)

    def tearDown(self):
        self.directory.cleanup()

    def test_self_timeline(self):
        self.companion.timeline_add("日记", "写下今天的日记")
        self.companion.timeline_add("任务", "任务已完成")
        self.assertEqual(len(self.companion.timeline_list()), 2)
        self.assertEqual(self.companion.timeline_list(topic="日记")[0]["summary"], "写下今天的日记")

    def test_goal_logs_advance_progress(self):
        goal = self.companion.add_goal("学一首钢琴曲")
        self.companion.add_goal_log(goal["id"], "练了前四小节", 0.4)
        logs = self.companion.goal_logs(goal["id"])
        self.assertEqual(logs[0]["evidence"], "练了前四小节")
        self.assertAlmostEqual(self.companion.list_goals()[0]["progress"], 0.4)

    def test_skill_growth_caps_at_ten(self):
        self.companion.add_skill("piano", level=9)
        self.companion.grow_skill("piano")
        self.assertEqual(self.companion.grow_skill("piano")["level"], 10)
        self.assertEqual(self.companion.grow_skill("piano")["level"], 10)


class IntentRouting(unittest.TestCase):
    def test_intent_classification(self):
        engine = EmotionEngine()
        self.assertEqual(engine.classify_intent("帮我查一下明天的天气"), "请求")
        self.assertEqual(engine.classify_intent("你今天怎么不开心"), "情绪")
        self.assertEqual(engine.classify_intent("为什么天空是蓝的？"), "提问")
        self.assertEqual(engine.classify_intent("嗯"), "闲聊")


if __name__ == "__main__":
    unittest.main()
