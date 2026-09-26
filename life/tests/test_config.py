import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.companion import CompanionSystem
from life.engine import LifeEngine
from life.i18n import translate
from life.usage import UsageLedger


class ConfigValidation(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.companion = CompanionSystem(self.directory.name)

    def tearDown(self):
        self.directory.cleanup()

    def test_validate_coerces_and_rejects(self):
        self.assertEqual(self.companion.validate_setting("quiet_start", 99), "23")
        self.assertEqual(self.companion.validate_setting("enable_dream", "no"), "0")
        self.assertIsNone(self.companion.validate_setting("other_stage_cap", "不存在的阶段"))
        self.assertEqual(self.companion.validate_setting("other_stage_cap", "友好"), "友好")

    def test_set_settings_reports_rejected(self):
        result = self.companion.set_settings({"quiet_start": 1, "other_stage_cap": "??", "unknown": 2})
        self.assertEqual(result["quiet_start"], "1")
        self.assertIn("other_stage_cap", result["rejected"])
        self.assertNotIn("unknown", result)

    def test_migrate_renames_and_bumps(self):
        migrated = self.companion.migrate_config({"version": 1, "settings": {"daily_limit": 7, "per_target_limit": 2}})
        self.assertEqual(migrated["settings"]["proactive_daily_limit"], 7)
        self.assertEqual(migrated["schema_version"], CompanionSystem.SCHEMA_VERSION)

    def test_audit_query_filters(self):
        self.companion.audit("goal_add", "added", "g1", "ok")
        self.companion.audit("settings_update", "changed", "", "ok")
        page = self.companion.audit_query(kind="goal", limit=10)
        self.assertEqual(page["total"], 1)
        self.assertEqual(page["items"][0]["kind"], "goal_add")
        self.assertIn("settings_update", self.companion.audit_kinds())


class UsageAndRouting(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()

    def tearDown(self):
        self.directory.cleanup()

    def test_usage_summary(self):
        ledger = UsageLedger(self.directory.name)
        ledger.record("m1", 10, 20, "conversation")
        ledger.record("m1", 5, 5, "conversation")
        ledger.record("m2", 1, 1, "plan")
        summary = ledger.summary()
        self.assertEqual(summary["totals"]["requests"], 3)
        self.assertEqual(summary["totals"]["tokens"], 42)
        self.assertEqual(summary["by_model"]["m1"]["tasks"]["conversation"], 2)

    def test_model_routes(self):
        engine = LifeEngine(self.directory.name)
        engine.think_model, engine.output_model = "base-think", "base-out"
        self.assertEqual(engine._model_for("think"), "base-think")
        engine.apply_model_routes({"think": "special", "output": "special-out"})
        self.assertEqual(engine._model_for("think"), "special")
        self.assertEqual(engine._model_for("output"), "special-out")

    def test_translate(self):
        self.assertEqual(translate("diag.integrity", "en-US"), "Database integrity")
        self.assertEqual(translate("diag.detail_count", "zh-CN", count=3), "3 条")
        self.assertEqual(translate("missing.key", "zh-CN"), "missing.key")


if __name__ == "__main__":
    unittest.main()
