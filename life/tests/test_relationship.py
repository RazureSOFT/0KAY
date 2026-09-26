import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.companion import CompanionSystem


class RelationshipExpression(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.companion = CompanionSystem(self.directory.name)

    def tearDown(self):
        self.directory.cleanup()

    def _set_stage(self, user_id, affinity, stage):
        self.companion.relationship(user_id)
        with self.companion.db() as db:
            db.execute("UPDATE relationship_accounts SET affinity=?, stage=?, last_seen=? WHERE user_id=?",
                       (affinity, stage, "2026-09-26T12:00:00", user_id))

    def test_roles_from_settings(self):
        self.companion.set_settings({"owner_user_ids": "u1, u2", "secondary_user_ids": "u3"})
        self.assertEqual(self.companion.user_role("u1"), "owner")
        self.assertTrue(self.companion.is_owner("u2"))
        self.assertEqual(self.companion.user_role("u3"), "secondary")
        self.assertEqual(self.companion.user_role("u9"), "other")

    def test_stage_ordering_and_hysteresis(self):
        self.assertEqual(self.companion.stage_for_score(-0.8), "警惕")
        self.assertEqual(self.companion.stage_for_score(0.0), "陌生")
        self.assertEqual(self.companion.stage_for_score(0.95), "亲密")
        # A small dip below the band keeps the earned stage; a real drop releases it.
        self.assertEqual(self.companion._hysteresis("亲近", 0.80), "亲近")
        self.assertEqual(self.companion._hysteresis("亲近", 0.60), "友好")

    def test_owner_reaches_close_interaction_others_do_not(self):
        self.companion.set_settings({"owner_user_ids": "owner"})
        self._set_stage("owner", 0.9, "亲密")
        self._set_stage("stranger", 0.9, "亲密")
        owner = self.companion.relationship_expression("owner", valence=0.7, arousal=0.6)
        other = self.companion.relationship_expression("stranger", valence=0.7, arousal=0.6)
        self.assertEqual(owner["role"], "owner")
        self.assertIn(owner["interaction"], ("亲近", "爱意"))
        self.assertEqual(other["role"], "other")
        self.assertNotIn(other["interaction"], ("亲近", "爱意"))

    def test_irritation_blocks_outreach(self):
        self.companion.set_settings({"owner_user_ids": "owner"})
        expression = self.companion.relationship_expression("owner", valence=0.6, irritation=0.9)
        self.assertEqual(expression["interaction"], "回避")
        self.assertEqual(expression["proactive_limit"], 0)
        self._set_stage("wounded", -0.7, "警惕")
        allowed, reason = self.companion.can_proactively_send("user:wounded")
        self.assertFalse(allowed)
        self.assertIn("blocks", reason)

    def test_decay_only_toward_zero_once_per_day(self):
        self.companion.apply_relationship_event("u1", "k", "chat", "private", 0.12)
        with self.companion.db() as db:
            db.execute("UPDATE relationship_accounts SET last_seen='2000-01-01T00:00:00' WHERE user_id='u1'")
        first = self.companion.decay_relationships()
        self.assertEqual(first["decayed"], 1)
        self.assertLess(self.companion.relationship("u1")["affinity"], 0.12)
        second = self.companion.decay_relationships()
        self.assertEqual(second.get("skipped"), "done")


if __name__ == "__main__":
    unittest.main()
