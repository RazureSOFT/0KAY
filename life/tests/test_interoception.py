"""The body must be able to push on the mind (ascending interoception).

`cognition/somatic.py` models the *descending* limb — psychological distress
presenting as bodily symptoms. Nothing carried the other direction: hunger,
exhaustion and ill health were tracked by `circadian` but only ever changed the
wording of a reply and the reply delay. `affect.tick()` even declared a
`fatigue` parameter and never read it.

These tests pin the ascending limb: the composed signal, and that a tired body
drags mood down more than a rested one over the same elapsed time.
"""
import sys
import types
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition.affect import AffectConfig, AffectSystem  # noqa: E402
from life.engine.legacy import LifeEngine  # noqa: E402


class InteroceptiveFatigue(unittest.TestCase):
    @staticmethod
    def _engine(energy: float = 100.0, hunger: float = 0.0, health: float = 100.0):
        # Built without __init__: that would open databases and clients.
        engine = LifeEngine.__new__(LifeEngine)
        engine.circadian = types.SimpleNamespace(state=types.SimpleNamespace(
            mental_energy=energy, hunger=hunger, health=health))
        return engine

    def test_rested_body_reports_no_fatigue(self):
        self.assertEqual(self._engine()._interoceptive_fatigue(), 0.0)

    def test_each_channel_contributes(self):
        self.assertAlmostEqual(self._engine(energy=0.0)._interoceptive_fatigue(), 0.6)
        self.assertAlmostEqual(self._engine(hunger=100.0)._interoceptive_fatigue(), 0.25)
        self.assertAlmostEqual(self._engine(health=0.0)._interoceptive_fatigue(), 0.15)

    def test_worst_case_saturates_at_one(self):
        self.assertEqual(self._engine(0.0, 100.0, 0.0)._interoceptive_fatigue(), 1.0)

    def test_missing_circadian_is_safe(self):
        engine = LifeEngine.__new__(LifeEngine)
        engine.circadian = None
        self.assertEqual(engine._interoceptive_fatigue(), 0.0)


class AscendingFatigueDrive(unittest.TestCase):
    def _mood_after(self, fatigue: float) -> float:
        affect = AffectSystem(AffectConfig())
        affect.tick(3600.0, hour=12.0, sleeping=False, fatigue=fatigue)
        return affect.mood.mood

    def test_tired_body_drags_mood_below_rested_body(self):
        rested = self._mood_after(0.0)
        exhausted = self._mood_after(1.0)
        self.assertLess(exhausted, rested,
                        "a tired body must cost the mind something, not just the wording")

    def test_fatigue_scales_with_dose(self):
        mild = self._mood_after(0.25)
        severe = self._mood_after(1.0)
        self.assertLess(severe, mild)

    def test_zero_fatigue_changes_nothing(self):
        """Backwards compatibility: callers that omit it are unaffected."""
        affect = AffectSystem(AffectConfig())
        affect.tick(3600.0, hour=12.0, sleeping=False)
        self.assertAlmostEqual(affect.mood.mood, self._mood_after(0.0))


if __name__ == "__main__":
    unittest.main()
