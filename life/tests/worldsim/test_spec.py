"""S0 gate: the worldsim spec schema is valid and the shared feature builder agrees."""
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]          # life/
sys.path.insert(0, str(ROOT))                        # import `world`
sys.path.insert(0, str(ROOT / "src"))                # import `life`

from world import gates  # noqa: E402
from life.worldsim.features import build_features, feature_names  # noqa: E402
from life.companion import CompanionSystem  # noqa: E402


def _sample_state() -> dict:
    return {
        "circadian": {"energy": 62, "hunger": 40, "health": 90, "sleeping": False},
        "mood": {"valence": 0.2, "arousal": 0.6, "connection": 0.7, "irritation": 0.1},
        "actors": {f"a{i}": {"affinity": 0.5, "warmth": 0.4, "tension": 0.1, "last_contact_days": i} for i in range(6)},
        "plots": {f"p{i}": {"progress": 0.3, "tension": 0.2} for i in range(3)},
        "ledger": {"open_obligations": 2, "days_since_salient": 3, "drama_budget": 0.8, "due_soon": 1},
        "world": {"temperature_c": 18, "raining": True, "season": 1, "hour": 20, "weekday": 3},
        "agenda": {"count": 4, "remaining": 2},
        "density": 0.5,
    }


class SpecGate(unittest.TestCase):
    def test_spec_is_valid(self):
        problems = gates.validate_spec(gates.load_spec())
        self.assertEqual(problems, [], f"spec problems: {problems}")

    def test_feature_count_in_range(self):
        features = gates.expand_features(gates.load_spec())
        self.assertGreaterEqual(len(features), gates.THRESHOLDS["state_dim_min"])
        self.assertLessEqual(len(features), gates.THRESHOLDS["state_dim_max"])

    def test_builder_matches_spec_order(self):
        spec_names = [f["name"] for f in gates.expand_features(gates.load_spec())]
        self.assertEqual(feature_names(), spec_names)

    def test_build_features_stays_in_range(self):
        spec = gates.load_spec()
        vector = build_features(_sample_state())
        self.assertEqual(len(vector), len(gates.expand_features(spec)))
        problems = gates.validate_state_vector(vector, spec)
        self.assertEqual(problems, [], f"feature range problems: {problems}")

    def test_build_features_handles_empty_state(self):
        vector = build_features({})
        self.assertEqual(len(vector), len(feature_names()))
        self.assertTrue(all(v == v for v in vector))  # no NaN

    def test_invariants_are_documented(self):
        spec = gates.load_spec()
        self.assertGreaterEqual(len(spec["invariants"]), 4)

    def test_density_setting_registered_off_by_default(self):
        self.assertEqual(CompanionSystem.SETTING_DEFAULTS["world_density"], "off")
        self.assertIsNotNone(CompanionSystem.validate_setting("world_density", "off"))
        self.assertIsNotNone(CompanionSystem.validate_setting("world_density", "full"))
        self.assertIsNone(CompanionSystem.validate_setting("world_density", "loud"))

    def test_worldview_settings_registered(self):
        """The panel's worldview box maps to real, validated text settings."""
        for key in ("world_premise", "world_actors", "world_places", "world_country",
                    "world_city", "world_district"):
            self.assertIn(key, CompanionSystem.SETTING_DEFAULTS, key)
            self.assertIn(key, CompanionSystem.CONFIG_SCHEMA, key)
            self.assertIsNotNone(CompanionSystem.validate_setting(key, "一段设定"))
        self.assertEqual(CompanionSystem.SETTING_DEFAULTS["world_premise"], "")
        # Choice + JSON fields: the map must round-trip through validate_setting.
        for key, value in (("world_fictional", "fictional"), ("world_fictional", "real"),
                           ("world_map", '{"locations": []}')):
            self.assertIsNotNone(CompanionSystem.validate_setting(key, value), f"{key}={value}")
        self.assertIsNone(CompanionSystem.validate_setting("world_fictional", "maybe"))
        self.assertIsNotNone(CompanionSystem.validate_setting("world_map", CompanionSystem.SETTING_DEFAULTS["world_map"]))


if __name__ == "__main__":
    unittest.main()
