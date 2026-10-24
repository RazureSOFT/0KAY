import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.memory.memory import MemorySystem, tantivy  # noqa: E402


@unittest.skipIf(tantivy is None, "tantivy package unavailable")
class TantivyIncremental(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.ms = MemorySystem(os.path.join(self.dir.name, "memory"))

    def tearDown(self):
        try:
            self.ms.close()
        except Exception:
            pass
        self.dir.cleanup()

    def _ids(self, query: str, limit: int = 20) -> list:
        return [mid for mid, _ in self.ms._tantivy_search(query, limit)]

    def test_store_is_searchable_without_full_rebuild(self):
        self.ms.rebuild_index()
        mem = self.ms.store("bicycle riding lesson", tags=["bike"])
        self.assertIn(mem.id, self._ids("bicycle"))

    def test_delete_drops_from_projection(self):
        mem = self.ms.store("kayaking trip notes", tags=["water"])
        self.assertIn(mem.id, self._ids("kayaking"))
        self.ms.delete_fact(mem.id)
        self.assertNotIn(mem.id, self._ids("kayaking"))

    def test_repeated_upsert_does_not_duplicate(self):
        mem = self.ms.store("telescope observation log", tags=["astro"])
        self.ms._index_upsert_doc(mem)
        self.ms._index_upsert_doc(mem)
        self.assertEqual(self._ids("telescope").count(mem.id), 1)

    def test_failed_incremental_write_marks_projection_dirty(self):
        mem = self.ms.store("pottery class notes", tags=["clay"])
        self.ms._tantivy_upsert_doc = lambda _memory: False
        try:
            self.ms._index_upsert_doc(mem)
            self.assertTrue(self.ms._tantivy_dirty)
        finally:
            del self.ms._tantivy_upsert_doc
        self.ms.search("pottery")
        self.assertFalse(self.ms._tantivy_dirty)
