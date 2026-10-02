"""Memory dynamics aligned with the CLS / reconsolidation / sleep literature.

- McClelland 1995: slow cortical learning + a real forgetting curve; interleaved
  replay (no catastrophic interference).
- Kumaran 2016: goal/importance-weighted replay; schema-consistent info is
  learned fast.
- Nader & Hardt 2009: reconsolidation only after retrieval opened a labile window,
  and an overturned trace is superseded (not left retrievable).
- Rasch & Born 2013: an SWS transfer phase then an REM stabilisation phase.
"""
import os
import sys
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.memory.memory import Memory, MemorySystem  # noqa: E402


class MemoryDynamics(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.ms = MemorySystem(os.path.join(self.dir.name, "memory"))

    def tearDown(self):
        self.dir.cleanup()

    def test_forgetting_curve_actually_runs(self):
        episode = self.ms.remember("今天在楼下便利店买了杯咖啡", tags=["生活"], memory_type="episode", strength=0.5)
        episode.created_at = datetime.now() - timedelta(days=90)
        self.assertGreater(episode.strength, 0.2)
        self.ms.apply_forgetting()
        self.assertLess(episode.strength, 0.05)

    def test_sleep_archives_forgotten_episodes_but_keeps_facts(self):
        episode = self.ms.remember("某个早就忘掉的琐事分享", tags=["生活"], memory_type="episode", strength=0.5)
        fact = self.ms.remember("我喜欢喝拿铁", tags=["偏好"], memory_type="fact", strength=0.8)
        old = datetime.now() - timedelta(days=120)
        episode.created_at = old
        fact.created_at = old
        self.ms.apply_forgetting()
        self.ms.consolidate()
        ids = {m.id for m in self.ms.short_term.memories + self.ms.long_term.memories}
        self.assertNotIn(episode.id, ids, "a forgotten episode should be archived")
        self.assertIn(fact.id, ids, "durable facts must not be forgotten away")

    def test_reconsolidation_requires_reactivation(self):
        memory = self.ms.remember("一条要更新的旧记忆", tags=["x"], memory_type="episode", strength=1.0)
        refused = self.ms.reconsolidate(memory.id, reward_new=-5.0, surprise=3.0)
        self.assertFalse(refused.get("labile", True))
        self.assertNotEqual(refused.get("branch"), "recreate")

    def test_overturned_trace_is_superseded(self):
        memory = self.ms.remember("会被推翻的记忆内容", tags=["x"], memory_type="episode", strength=1.0)
        self.ms.reactivate(memory.id)
        result = self.ms.reconsolidate(memory.id, reward_new=-5.0, surprise=3.0)
        self.assertEqual(result["branch"], "recreate")
        self.assertTrue(memory.metadata.get("superseded_by"))
        self.assertLessEqual(memory.strength, 0.1)

    def test_schema_consistent_cluster_is_learned_fast(self):
        tokens = MemorySystem._tokens("在便利店买咖啡")
        self.ms.store("已有图式", importance=0.6, tags=["semantic"],
                      metadata={"memory_type": "semantic", "shared_terms": sorted(tokens)[:3]})
        self.ms.remember("在便利店买咖啡 A", tags=["生活"], memory_type="episode", strength=0.6)
        self.ms.remember("在便利店买咖啡 B", tags=["生活"], memory_type="episode", strength=0.6)
        created = self.ms.extract_semantics(min_cluster=3)  # 2 members would normally be too few
        self.assertEqual(len(created), 1, "schema-consistent cluster should be learned fast")

    def test_interleaved_replay_round_robins_groups(self):
        memories = [Memory(id=str(i), content=str(i), importance=0.5,
                           created_at=datetime.now(), last_recalled=datetime.now(),
                           tags=[tag]) for i, tag in enumerate(["a", "b", "a", "b", "a"])]
        ordered = MemorySystem._interleave(memories)
        tags = [m.tags[0] for m in ordered]
        self.assertEqual(tags, ["a", "b", "a", "b", "a"])


if __name__ == "__main__":
    unittest.main()
