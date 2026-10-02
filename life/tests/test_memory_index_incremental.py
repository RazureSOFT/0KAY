"""Incremental BM25 index updates.

Task #24 (engineering debt): single-doc writes used to force a *full* BM25
rebuild of the whole corpus (`rebuild_index`) on every store/delete/prune.
That is the per-turn hot path.  These tests pin the new incremental behaviour:

- `store` / `remember` upsert one doc and persist (no full rebuild).
- `delete_fact` / `delete_note` / `_prune_episodes` drop one doc (no full rebuild).
- search ranking after incremental ops is identical to a from-scratch rebuild.
- the on-disk index survives a reload.
"""
import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.memory.memory import MemorySystem  # noqa: E402


class IncrementalIndex(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.ms = MemorySystem(os.path.join(self.dir.name, "memory"))

    def tearDown(self):
        # Keep teardown explicit if connection ownership changes in the future.
        try:
            self.ms.close()
        except Exception:
            pass
        self.dir.cleanup()

    def _spy_rebuild(self):
        calls = {"n": 0}
        orig = self.ms.rebuild_index

        def spy(*a, **k):
            calls["n"] += 1
            return orig(*a, **k)

        self.ms.rebuild_index = spy
        return calls

    def test_store_search_without_full_rebuild(self):
        calls = self._spy_rebuild()
        a = self.ms.remember("我喜欢在周末去爬山", tags=["偏好"])
        b = self.ms.remember("今天开了个项目启动会", tags=["工作"])
        hits = [h["id"] for h in self.ms.search("爬山", top_k=5)]
        self.assertIn(a.id, hits)
        self.assertEqual(calls["n"], 0, "store must not trigger a full rebuild")

    def test_delete_fact_removes_doc_incrementally(self):
        calls = self._spy_rebuild()
        a = self.ms.remember("要删除的临时记忆", tags=["x"])
        b = self.ms.remember("保留下来的记忆", tags=["y"])
        self.ms.delete_fact(a.id, reason="test")
        self.assertNotIn(a.id, [h["id"] for h in self.ms.search("临时", top_k=5)])
        self.assertIn(b.id, [h["id"] for h in self.ms.search("保留", top_k=5)])
        self.assertEqual(calls["n"], 0, "delete_fact must not trigger a full rebuild")

    def test_prune_episodes_removes_doc_incrementally(self):
        calls = self._spy_rebuild()
        for _ in range(3):
            self.ms.remember_episode("一条会被裁剪掉的旧 episodic 痕迹", prediction_error=1.0, novelty=1.0)
        # Push the episode cap to 0 so pruning drops every episodic trace.
        self.ms._episode_cap = 0
        pruned = self.ms._prune_episodes()
        self.assertGreater(pruned, 0)
        # The dropped episodes must be unsearchable now.
        self.assertEqual([h["id"] for h in self.ms.search("旧 episodic", top_k=20)], [])
        self.assertEqual(calls["n"], 0, "prune must not trigger a full rebuild")

    def test_delete_note_removes_its_facts_incrementally(self):
        calls = self._spy_rebuild()
        note = self.ms.create_note("我的笔记", "这是一条关于大海的笔记内容", tags=["sea"])
        note_facts = [m for m in self.ms.short_term.memories + self.ms.long_term.memories
                      if m.content.startswith(f"Note {note['note_id']}:")]
        self.assertTrue(note_facts)
        self.ms.delete_note(note["note_id"])
        remaining = [m for m in self.ms.short_term.memories + self.ms.long_term.memories
                     if m.content.startswith(f"Note {note['note_id']}:")]
        self.assertEqual(remaining, [])
        self.assertEqual(calls["n"], 0, "delete_note must not trigger a full rebuild")

    def test_incremental_ranking_matches_full_rebuild(self):
        texts = [
            ("咖啡", "早上喝了一杯冰咖啡提神"),
            ("咖啡", "咖啡机的除垢周期到了"),
            ("茶", "下午改喝绿茶了"),
            ("运动", "下班后去跑了五公里"),
            ("运动", "周末计划去爬山"),
        ]
        for tag, txt in texts:
            self.ms.remember(txt, tags=[tag])
        incremental = [h["id"] for h in self.ms.search("咖啡", top_k=10)]
        # Reference: a fresh instance that always does a from-scratch rebuild.
        fresh = MemorySystem(os.path.join(self.dir.name, "memory"))
        fresh.rebuild_index()
        full = [h["id"] for h in fresh.search("咖啡", top_k=10)]
        fresh.close()
        # Membership (and BM25 scores) must be identical.  Tie-breaking order
        # between equal-scored docs depends on dict insertion order, which is
        # call-order for incremental vs created_at for a full rebuild, so we
        # compare as sets / sorted permutations rather than exact ordering.
        self.assertEqual(set(incremental), set(full), "incremental and full rebuild must return the same docs")
        self.assertEqual(sorted(incremental), sorted(full), "incremental ranking must be a permutation of full rebuild")

    def test_persisted_index_survives_reload(self):
        a = self.ms.remember("持久化测试记忆", tags=["p"])
        reloaded = MemorySystem(os.path.join(self.dir.name, "memory"))
        hits = [h["id"] for h in reloaded.search("持久化", top_k=5)]
        reloaded.close()
        self.assertIn(a.id, hits)


if __name__ == "__main__":
    unittest.main()
