import os
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.companion import CompanionSystem  # noqa: E402


class RelationshipDailyBudget(unittest.TestCase):
    def setUp(self):
        self.dir = tempfile.TemporaryDirectory()
        self.cs = CompanionSystem(self.dir.name)

    def tearDown(self):
        self.dir.cleanup()

    def _apply(self, key: str, delta: float, exempt: bool = False) -> dict:
        return self.cs.apply_relationship_event(
            "u1", key, "test", "private", delta, "event", exempt)

    def _spend_budget(self) -> None:
        for index in range(3):
            self._apply(f"nudge-{index}", 0.12)
        self.assertGreaterEqual(self._used_today(), 0.30)

    def _used_today(self) -> float:
        import datetime
        day = datetime.date.today().isoformat()
        with self.cs.db() as db:
            return float(db.execute(
                "SELECT COALESCE(SUM(ABS(delta)),0) FROM relationship_ledger "
                "WHERE user_id=? AND created_at LIKE ?", ("u1", f"{day}%")).fetchone()[0])

    def test_discarded_adjustment_is_reported(self):
        self._spend_budget()
        before = self.cs.relationship("u1")["affinity"]
        result = self._apply("nudge-3", 0.12)
        self.assertTrue(result["suppressed"])
        self.assertAlmostEqual(result["requested_delta"], 0.12)
        self.assertAlmostEqual(result["affinity"], before)

    def test_discarded_adjustment_is_audited(self):
        self._spend_budget()
        self._apply("nudge-3", 0.12)
        with self.cs.db() as db:
            row = db.execute(
                "SELECT 1 FROM audit_events WHERE kind='relationship_budget_exhausted'"
            ).fetchone()
        self.assertIsNotNone(row, "a dropped adjustment left no trace")

    def test_exempt_event_survives_exhausted_budget(self):
        self._spend_budget()
        before = self.cs.relationship("u1")["affinity"]
        result = self._apply("breach:abc", -0.06, exempt=True)
        after = self.cs.relationship("u1")["affinity"]
        self.assertFalse(result["suppressed"])
        self.assertLess(after, before)

    def test_ordinary_events_still_capped(self):
        for index in range(10):
            self._apply(f"many-{index}", 0.12)
        self.assertLessEqual(self._used_today(), 0.30 + 0.12 + 1e-9)
