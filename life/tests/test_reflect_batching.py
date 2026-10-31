import sys
import tempfile
import unittest
from pathlib import Path
from types import SimpleNamespace

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from life.engine import LifeEngine  # noqa: E402
from life.engine.resident import ResidentThinker  # noqa: E402


class ReflectBatching(unittest.TestCase):
    """Reflection is a background LLM call; it must not run on every turn."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.tmp.name)

    def tearDown(self):
        self.tmp.cleanup()

    def test_ordinary_chat_waits_for_the_batch(self):
        turn = SimpleNamespace(intent="闲聊")
        self.engine._turns_since_reflect = 0
        self.assertFalse(self.engine._should_reflect(turn))
        self.engine._turns_since_reflect = self.engine.REFLECT_EVERY_TURNS - 1
        self.assertFalse(self.engine._should_reflect(turn))

    def test_the_batch_fires_on_schedule(self):
        self.engine._turns_since_reflect = self.engine.REFLECT_EVERY_TURNS
        self.assertTrue(self.engine._should_reflect(SimpleNamespace(intent="闲聊")))

    def test_a_turn_that_did_something_is_reflected_at_once(self):
        self.engine._turns_since_reflect = 0
        self.assertTrue(self.engine._should_reflect(SimpleNamespace(intent="闲聊"), tool_calls=1))

    def test_an_emotional_turn_is_reflected_at_once(self):
        self.engine._turns_since_reflect = 0
        for intent in ("情绪", "抱怨"):
            with self.subTest(intent=intent):
                self.assertTrue(self.engine._should_reflect(SimpleNamespace(intent=intent)))

    def test_a_missing_intent_does_not_crash(self):
        self.engine._turns_since_reflect = 0
        self.assertFalse(self.engine._should_reflect(SimpleNamespace()))


class ResidentCadence(unittest.TestCase):
    def test_the_inner_life_ticks_every_five_minutes(self):
        self.assertEqual(ResidentThinker.DEFAULT_INTERVAL, 300.0)

    def test_a_zero_interval_disables_it(self):
        tmp = tempfile.TemporaryDirectory()
        try:
            engine = LifeEngine(tmp.name)
            thinker = ResidentThinker(engine, interval_seconds=0)
            self.assertFalse(thinker.enabled)
        finally:
            tmp.cleanup()


if __name__ == "__main__":
    unittest.main()
