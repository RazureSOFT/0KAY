"""state.json writes are coalesced: a burst inside the debounce window becomes
one atomic snapshot, and flush_state()/close() force it out."""
import sys
import tempfile
import time
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.engine import LifeEngine


class StateDebounceTests(unittest.TestCase):
    def test_burst_collapses_into_one_write(self):
        with tempfile.TemporaryDirectory() as directory:
            engine = LifeEngine(directory)
            engine._state_debounce = 0.3
            writes = []
            original = engine._save_state_locked

            def counting():
                writes.append(1)
                original()

            engine._save_state_locked = counting
            for _ in range(6):
                engine._save_state()
            self.assertEqual(writes, [], "a save happened before the window elapsed")
            time.sleep(0.7)
            self.assertEqual(len(writes), 1, "burst was not coalesced into a single write")

    def test_flush_writes_pending_state_immediately(self):
        with tempfile.TemporaryDirectory() as directory:
            engine = LifeEngine(directory)
            engine._state_debounce = 5.0
            engine.soul.creativity = 0.42
            engine._save_state()
            self.assertFalse((Path(directory) / "state.json").exists())
            engine.flush_state()
            self.assertTrue((Path(directory) / "state.json").exists())
            self.assertAlmostEqual(LifeEngine(directory).soul.creativity, 0.42, places=2)

    def test_zero_window_is_write_through(self):
        with tempfile.TemporaryDirectory() as directory:
            engine = LifeEngine(directory)
            engine._state_debounce = 0.0
            engine.soul.recall_depth = 0.33
            engine._save_state()
            self.assertTrue((Path(directory) / "state.json").exists())


if __name__ == "__main__":
    unittest.main()
