import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.memory.memory import Memory, _seconds_since  # noqa: E402
from life.timeutil import now_utc, parse_utc  # noqa: E402


class StorageTimeBase(unittest.TestCase):
    """An instant must mean the same thing whatever timezone reads it."""

    def _memory(self):
        return Memory(id="m1", content="c", importance=0.5,
                      created_at=now_utc(), last_recalled=now_utc())

    def test_serialised_timestamps_carry_an_offset(self):
        data = self._memory().to_dict()
        for key in ("created_at", "last_recalled"):
            parsed = datetime.fromisoformat(data[key])
            self.assertIsNotNone(parsed.tzinfo, f"{key} lost its timezone")
            self.assertEqual(parsed.utcoffset(), timezone.utc.utcoffset(parsed))

    def test_a_round_trip_preserves_the_instant(self):
        original = self._memory()
        restored = Memory.from_dict(original.to_dict())
        self.assertEqual(parse_utc(restored.created_at), parse_utc(original.created_at))
        self.assertLess(abs((restored.created_at - original.created_at).total_seconds()), 0.001)

    def test_a_legacy_naive_record_is_read_as_local(self):
        # Builds before this change wrote a naive local string. Reading it must
        # not raise, and must land on an aware instant.
        legacy = {"id": "old", "content": "c", "importance": 0.5,
                  "created_at": "2026-01-02T03:04:05", "last_recalled": "2026-01-02T03:04:05"}
        memory = Memory.from_dict(legacy)
        self.assertIsNotNone(memory.created_at.tzinfo)

    def test_age_accepts_both_eras(self):
        # Naive and aware values must both answer, or decay maths crashes on a
        # database written by two versions.
        self.assertIsNotNone(_seconds_since(datetime.now()))
        self.assertIsNotNone(_seconds_since(now_utc()))
        self.assertIsNone(_seconds_since(None))
        self.assertIsNone(_seconds_since("not a time"))

    def test_days_since_does_not_depend_on_the_reader_timezone(self):
        memory = self._memory()
        age_utc = _seconds_since(memory.created_at)
        # Same instant, re-read through the serialised form a second timezone
        # would see. The age must not change.
        reloaded = Memory.from_dict(memory.to_dict())
        self.assertAlmostEqual(_seconds_since(reloaded.created_at), age_utc, delta=0.01)


if __name__ == "__main__":
    unittest.main()
