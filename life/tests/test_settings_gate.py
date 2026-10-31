import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from life.companion.legacy import CompanionSystem  # noqa: E402


class SettingsValidation(unittest.TestCase):
    """Every declared default must survive the gate that validates saved values.

    A default that its own validator rejects means the panel cannot re-save the
    setting at all: the value round-trips back as "ignored".
    """

    def test_every_default_validates(self):
        broken = []
        for key, default in CompanionSystem.SETTING_DEFAULTS.items():
            if CompanionSystem.validate_setting(key, default) is None:
                kind, spec = CompanionSystem.CONFIG_SCHEMA.get(key, ("text", None))
                broken.append((key, default, kind, spec))
        self.assertEqual(broken, [])

    def test_stage_caps_accept_the_relationship_ladder(self):
        for key in ("other_stage_cap", "secondary_stage_cap"):
            for stage in CompanionSystem.STAGE_ORDER:
                with self.subTest(key=key, stage=stage):
                    self.assertEqual(CompanionSystem.validate_setting(key, stage), stage)

    def test_a_stage_cap_outside_the_ladder_is_rejected(self):
        self.assertIsNone(CompanionSystem.validate_setting("other_stage_cap", "en-US"))
        self.assertIsNone(CompanionSystem.validate_setting("secondary_stage_cap", "best friend"))

    def test_stage_caps_reach_the_relationship_gate(self):
        system = CompanionSystem.__new__(CompanionSystem)
        system.get_settings = lambda: {"other_stage_cap": "认识", "secondary_stage_cap": "熟悉"}
        capped = CompanionSystem._cap_stage(system, "亲密", "other")
        self.assertEqual(capped, "认识")
        self.assertEqual(CompanionSystem._cap_stage(system, "陌生", "other"), "陌生")


if __name__ == "__main__":
    unittest.main()
