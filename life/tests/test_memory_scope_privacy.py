"""Privacy/scope + hygiene fixes for the memory system (review H2/H3/H4/H5/M2/M4/M6/M7/M8)."""
import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.memory.memory import MemorySystem  # noqa: E402
from life.cognition.model import CognitionConfig  # noqa: E402


class MemoryScopePrivacy(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.ms = MemorySystem(os.path.join(self.dir.name, "memory"))

    def tearDown(self):
        self.dir.cleanup()

    # H3 -----------------------------------------------------------------
    def test_page_facts_empty_scope_is_public_only(self):
        public = self.ms.remember("公开的事实内容", tags=["a"], memory_type="fact", strength=0.6)
        self.ms.remember("私密会话里的内容", tags=["a"], memory_type="fact", strength=0.6, scope="session:s1")
        ids_public = {item["id"] for item in self.ms.page_facts(scope="")["items"]}
        ids_all = {item["id"] for item in self.ms.page_facts(scope="*")["items"]}
        self.assertIn(public.id, ids_public)
        self.assertEqual(len(ids_all), 2)

    def test_page_facts_scope_is_exact_not_substring(self):
        self.ms.remember("属于会话十", tags=["a"], memory_type="fact", scope="session:10")
        items = self.ms.page_facts(scope="session:1")["items"]
        self.assertEqual(items, [], "session:1 must not match session:10 by substring")

    # H4 -----------------------------------------------------------------
    def test_accepted_reflection_preserves_scope(self):
        self.ms.enqueue_reflection("s1", "我喜欢猫", "好呀")
        self.ms.process_reflection_queue()
        proposed = self.ms.list_reflections("proposed")
        self.assertTrue(proposed)
        result = self.ms.review_reflection(proposed[0]["id"], True)
        self.assertEqual(result["scope"], "session:s1")
        created = [m for m in self.ms.short_term.memories + self.ms.long_term.memories if "猫" in m.content]
        self.assertTrue(created)
        self.assertEqual(created[0].metadata.get("scope"), "session:s1")

    # H5 -----------------------------------------------------------------
    def test_note_scope_is_enforced_by_default(self):
        note = self.ms.create_note("秘密", "只有 s1 能看到的内容", scope="session:s1")
        with self.assertRaises(PermissionError):
            self.ms.read_note(note["note_id"])  # empty scope == public only
        with self.assertRaises(PermissionError):
            self.ms.read_note(note["note_id"], scope="session:s2")
        content = self.ms.read_note(note["note_id"], scope="session:s1")
        self.assertIn("只有 s1", content["content"])

    # H2 -----------------------------------------------------------------
    def test_reflection_queue_is_bounded(self):
        for index in range(20):
            self.ms.enqueue_reflection("s1", f"第 {index} 条", "ok")
        self.ms.process_reflection_queue(max_items=50)
        self.ms._prune_reflections(cap=5)
        remaining = self.ms.list_reflections(limit=100)
        self.assertLessEqual(len(remaining), 5)

    # M2 -----------------------------------------------------------------
    def test_snapshot_round_trip_keeps_tags_and_notes(self):
        fact = self.ms.remember("导出导入测试事实", tags=["导出一", "导入二"], memory_type="fact", strength=0.6)
        note = self.ms.create_note("便签", "便签正文内容", scope="public")
        snapshot = self.ms.export_snapshot()
        self.ms.clear_all()
        self.ms.import_snapshot(snapshot)
        restored = [m for m in self.ms.short_term.memories + self.ms.long_term.memories if m.id == fact.id]
        self.assertTrue(restored)
        self.assertIn("导出一", restored[0].tags)
        self.assertTrue(Path(self.ms.notes_dir / f"{note['note_id']}.md").is_file())
        self.assertTrue(any(n["note_id"] == note["note_id"] for n in self.ms.list_notes()))

    # M4 -----------------------------------------------------------------
    def test_tantivy_fallback_keeps_in_scope_hits(self):
        public = self.ms.remember("本地检索应当命中的独特词语", tags=["q"], memory_type="fact", strength=0.7)
        self.ms.rebuild_index()
        # Tantivy returns only an out-of-scope id: the local in-scope BM25 must survive.
        self.ms._tantivy_search = lambda query, limit: [("not-in-scope", 9.0)]
        hits = self.ms.search("独特词语", top_k=5, scope="")
        self.assertTrue(any(hit["id"] == public.id for hit in hits))

    # M6 -----------------------------------------------------------------
    def test_source_kind_column_follows_metadata(self):
        memory = self.ms.store("由工具写入的内容", metadata={"memory_type": "fact", "scope": "public", "source_kind": "tool"})
        with self.ms._connect() as db:
            stored = db.execute("SELECT source_kind FROM memory_facts WHERE id=?", (memory.id,)).fetchone()[0]
        self.assertEqual(stored, "tool")

    # M8 -----------------------------------------------------------------
    def test_lability_window_reads_live_config(self):
        memory = self.ms.remember("可重新巩固的记忆", tags=["x"], memory_type="episode", strength=1.0)
        config = CognitionConfig()
        config.use_lability_window = True
        config.lability_window_seconds = 10.0
        self.ms.set_engram_config(config)
        self.ms.reactivate(memory.id)
        report = self.ms.lability_of(memory.id)
        self.assertEqual(report.get("window_seconds"), 10.0)


class CredentialScopeIsWriteOnly(unittest.TestCase):
    """H-02: a generated server password must never come back out of a read API."""

    SECRET = "Minecraft server mc.example.com 登录密码：hunter2"

    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.ms = MemorySystem(os.path.join(self.dir.name, "memory"))
        self.credential = self.ms.remember(
            self.SECRET, tags=["minecraft", "credential"], memory_type="fact",
            strength=0.9, scope="credential")

    def tearDown(self):
        self.dir.cleanup()

    def test_list_items_hides_credentials(self):
        self.ms.remember("一条普通的公开事实", tags=["a"], memory_type="fact")
        contents = [item["content"] for item in self.ms.list_items()]
        self.assertTrue(any("公开事实" in c for c in contents))
        self.assertFalse(any(self.SECRET in c for c in contents))

    def test_page_facts_hides_credentials_even_for_admin_scope(self):
        # "*" is the admin browse; it must still not render a password.
        ids = {item["id"] for item in self.ms.page_facts(scope="*")["items"]}
        self.assertNotIn(self.credential.id, ids)
        ids_public = {item["id"] for item in self.ms.page_facts(scope="")["items"]}
        self.assertNotIn(self.credential.id, ids_public)

    def test_get_fact_refuses_credentials(self):
        with self.assertRaises(PermissionError):
            self.ms.get_fact(self.credential.id)

    def test_admin_query_reinforcement_does_not_leak_the_secret(self):
        results = self.ms.reinforce_facts(query="登录密码")
        self.assertFalse(any(self.SECRET in item["content"] for item in results))

    def test_explicit_credential_scope_still_serves_the_login_lookup(self):
        # The Minecraft join flow reads the password back through recall(); that
        # path must keep working or servers become unreachable.
        hits = self.ms.recall("Minecraft server mc.example.com login password 登录密码",
                              top_k=5, scope="credential")
        self.assertTrue(any(self.SECRET in hit.content for hit in hits))

    def test_snapshot_export_excludes_credentials(self):
        exported = [f["content"] for f in self.ms.export_snapshot().get("facts", [])]
        self.assertFalse(any(self.SECRET in c for c in exported))


class ImportKeepsRealZeros(unittest.TestCase):
    """`value or 0.5` turned a stored 0.0 importance/strength back into 0.5."""

    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.ms = MemorySystem(os.path.join(self.dir.name, "memory"))

    def tearDown(self):
        self.dir.cleanup()

    def test_zero_scores_survive_an_import(self):
        self.ms.import_snapshot({"facts": [{
            "id": "zero-score-fact",
            "content": "重要性为零的事实",
            "importance": 0.0,
            "strength": 0.0,
            "tier": "long_term",
        }]})
        with self.ms._connect() as db:
            row = db.execute(
                "SELECT importance, strength FROM memory_facts WHERE id=?",
                ("zero-score-fact",)).fetchone()
        self.assertEqual(float(row["importance"]), 0.0)
        self.assertEqual(float(row["strength"]), 0.0)

    def test_absent_scores_still_fall_back_to_the_default(self):
        self.ms.import_snapshot({"facts": [{"id": "no-score-fact", "content": "没有分数的事实"}]})
        with self.ms._connect() as db:
            row = db.execute(
                "SELECT importance, strength FROM memory_facts WHERE id=?",
                ("no-score-fact",)).fetchone()
        self.assertEqual(float(row["importance"]), 0.5)
        self.assertEqual(float(row["strength"]), 0.5)


if __name__ == "__main__":
    unittest.main()
