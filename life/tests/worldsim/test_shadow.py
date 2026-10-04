"""S6 gate: shadow logging + guarded weekly update with rollback."""
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))
sys.path.insert(0, str(ROOT / "src"))

from world import gates, shadow  # noqa: E402


class ShadowGate(unittest.TestCase):
    def test_shadow_log_and_guarded_update(self):
        curated_path = ROOT / "data" / "teacher" / "curated.jsonl"
        if not curated_path.exists():
            self.skipTest("teacher/curated.jsonl is local data (gitignored) and not present")
        templates = [json.loads(line) for line in (ROOT / "world" / "templates.jsonl").read_text(encoding="utf-8").splitlines() if line.strip()]
        curated = [json.loads(line) for line in curated_path.read_text(encoding="utf-8").splitlines() if line.strip()]

        with tempfile.TemporaryDirectory() as tmp:
            log_path = Path(tmp) / "shadow_log.jsonl"
            for row in curated[:60]:
                shadow.log_event(log_path, {"x": row["x"], "template_id": templates[row["template_id"]]["template_id"],
                                            "intensity": row["intensity"], "valence_delta": 0.0})
            result = shadow.weekly_update(log_path, models_dir=str(Path(tmp) / "models"), world_dir=str(ROOT / "world"))
            self.assertTrue(result["updated"])
            self.assertIsInstance(result["promoted"], bool)
            versions_dir = Path(tmp) / "models" / "versions"
            versions = list(versions_dir.glob("*.json")) if versions_dir.exists() else []
            self.assertLessEqual(len(versions), gates.THRESHOLDS["keep_checkpoints"])

    def test_weekly_update_needs_data(self):
        with tempfile.TemporaryDirectory() as tmp:
            result = shadow.weekly_update(Path(tmp) / "missing.jsonl", models_dir=str(Path(tmp) / "models"),
                                          world_dir=str(ROOT / "world"))
            self.assertFalse(result["updated"])


if __name__ == "__main__":
    unittest.main()
