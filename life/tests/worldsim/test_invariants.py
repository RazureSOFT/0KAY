"""S2 gate: the prior simulator obeys the world invariant set.

Also pins hard constraint #3: an untrained policy is *exactly* the rule prior.
"""
import sys
import unittest
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from world import gates, sim  # noqa: E402
from life.worldsim import features  # noqa: E402
from life.worldsim.policy import PriorEngine, entropy  # noqa: E402


class Invariants(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.cast, cls.templates = sim.load_world(ROOT / "world")
        cls.base_rates = [float(t.get("base_rate", 1.0)) for t in cls.templates]
        cls.sims = {}
        for seed in (0, 1):
            engine = sim.WorldSim(cls.cast, cls.templates, seed=seed)
            engine.run(days=200)
            cls.sims[seed] = engine

    def test_untrained_policy_equals_prior(self):
        engine = sim.WorldSim(self.cast, self.templates, seed=0)
        x = features.build_features(engine.state)
        probs = engine.policy.probs(engine.state, x)
        prior = PriorEngine(engine.tiers, self.base_rates).weights(engine.state)
        self.assertLess(max(abs(a - b) for a, b in zip(probs, prior)), 1e-9)

    def test_state_stays_in_range(self):
        spec = gates.load_spec()
        for engine in self.sims.values():
            problems = gates.validate_state_vector(features.build_features(engine.state), spec)
            self.assertEqual(problems, [], problems)

    def test_high_intensity_at_most_weekly(self):
        for engine in self.sims.values():
            highs = sorted(e["time_hours"] for e in engine.events if e["intensity"] >= gates.THRESHOLDS["high_intensity_per_week_max"] + 2)
            for earlier, later in zip(highs, highs[1:]):
                self.assertGreaterEqual(later - earlier, 7 * 24 - 1e-6)

    def test_open_obligations_are_echoed_within_window(self):
        for engine in self.sims.values():
            for obligation in engine.obligations:
                # Any obligation whose due time has passed must already be echoed.
                self.assertGreater(obligation["due_hours"], engine.now_hours)
                self.assertLessEqual(obligation["due_hours"] - obligation["created_hours"],
                                     gates.THRESHOLDS["obligation_echo_days"] * 24 + 1e-6)

    def test_rolling_entropy_beats_the_prior_floor(self):
        engine = self.sims[0]
        horizon = engine.now_hours
        window = [e for e in engine.events if e["time_hours"] >= horizon - 30 * 24]
        counts = _np(list(Counter(e["template_id"] for e in window).values()))
        window_probs = counts / max(1e-9, float(counts.sum()))
        prior = PriorEngine(engine.tiers, self.base_rates).weights(sim.initial_state(self.cast))
        ratio = entropy(window_probs) / max(1e-9, entropy(prior))
        self.assertGreaterEqual(ratio, gates.THRESHOLDS["prior_entropy_ratio_min"])


def _np(values):
    import numpy as np
    return np.asarray(values, dtype=float)


if __name__ == "__main__":
    unittest.main()
