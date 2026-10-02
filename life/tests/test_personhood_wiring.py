"""The "personhood" wiring: partners, wants, and costs.

These pin the three things the audit found missing, all of which are invisible
unless something actually feeds them:

1. **Partners.**  ``SocialTies`` (reciprocity / evaluation / coaching) and
   ``NarrativeIdentity`` had no writers at all, so ``friends`` was permanently
   empty and ``anchor_strength`` was permanently 0.  The person on the other side
   of the conversation is the partner.
2. **Wants.**  ``add_goal`` was reachable only from the dashboard, so every goal
   was written *for* the character.
3. **Costs.**  Nothing made silence or a broken promise cost anything.
"""
import asyncio
import json
import sys
import tempfile
import unittest
from datetime import datetime, timedelta
from pathlib import Path
from types import SimpleNamespace

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.engine import LifeEngine
from life.tools.tools import GoalAddTool, GoalListTool, GoalLogTool


def _awaiting(user_id: str, seconds_ago: float = 5.0) -> dict:
    return {"sent_at": (datetime.now() - timedelta(seconds=seconds_ago)).isoformat(),
            "user_id": user_id, "context": {}, "control": {}, "valence": 0.0,
            "response": "hi", "tool_success": 0.0, "tool_failure": 0.0}


class PartnerWiring(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.turn = SimpleNamespace(session_id="s1", user_id="u1")

    def tearDown(self):
        self.directory.cleanup()

    def _exchange(self, user_id: str, message: str, seconds_ago: float = 5.0):
        self.engine._awaiting_feedback["s1"] = _awaiting(user_id, seconds_ago)
        self.engine._receive_feedback(self.turn, message)

    def test_friends_are_no_longer_permanently_empty(self):
        self.assertEqual(self.engine.social.ties.ties, {})
        self._exchange("u1", "谢谢你，今天真好")
        self.assertIn("u1", self.engine.social.ties.ties)
        self.assertIn("u1", [p for p, _ in self.engine.social.ties.friends()])

    def test_a_hostile_partner_ends_up_below_a_warm_one(self):
        self._exchange("warm", "谢谢你，真棒")
        self._exchange("cold", "闭嘴 别烦我 讨厌")
        ties = self.engine.social.ties.ties
        self.assertGreater(ties["warm"], ties["cold"])

    def test_reciprocal_evaluation_is_recorded(self):
        """`received_evaluation` is what makes a tie reciprocal, not one-sided."""
        self._exchange("u1", "谢谢你")
        self.assertTrue(self.engine.social.ties.evaluations.get("__from__u1"))

    def test_identity_anchor_accumulates_from_conversation(self):
        self.assertEqual(self.engine.selfhood.narrative.anchor_strength, 0.0)
        self._exchange("u1", "谢谢你")
        self.assertGreater(self.engine.selfhood.narrative.anchor_strength, 0.0)

    def test_self_narrative_is_bounded(self):
        for index in range(self.engine.selfhood.narrative.MAX_MEMORIES + 40):
            self.engine._record_self_narrative(f"事件{index}", 0.1)
        self.assertEqual(len(self.engine.selfhood.narrative.memories),
                         self.engine.selfhood.narrative.MAX_MEMORIES)


class WantWiring(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.companion = self.engine.companion

    def tearDown(self):
        self.directory.cleanup()

    def test_the_character_can_invent_its_own_goal(self):
        result = asyncio.run(GoalAddTool(self.companion).execute("学会做手冲咖啡", "每周练一次"))
        self.assertTrue(result.success)
        self.assertEqual(result.data["kind"], "self")
        titles = [g["title"] for g in self.companion.list_goals("")]
        self.assertIn("学会做手冲咖啡", titles)

    def test_self_set_goals_are_capped(self):
        tool = GoalAddTool(self.companion)
        for index in range(tool.MAX_SELF_GOALS):
            self.assertTrue(asyncio.run(tool.execute(f"自拟{index}")).success)
        blocked = asyncio.run(tool.execute("再一个"))
        self.assertFalse(blocked.success)
        self.assertIn("self-set goals", blocked.error)

    def test_duplicate_titles_are_rejected(self):
        tool = GoalAddTool(self.companion)
        self.assertTrue(asyncio.run(tool.execute("学吉他")).success)
        self.assertFalse(asyncio.run(tool.execute("学吉他")).success)

    def test_goal_tools_can_advance_a_goal(self):
        goal = self.companion.add_goal("学吉他", "", "growth")
        self.assertTrue(asyncio.run(GoalLogTool(self.companion).execute(goal["id"], "练了 20 分钟", 0.3)).success)
        listed = asyncio.run(GoalListTool(self.companion).execute()).data["goals"]
        self.assertEqual(listed[0]["progress"], 0.3)


class CostWiring(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()

    def tearDown(self):
        self.directory.cleanup()

    def test_neglect_clock_tracks_real_silence(self):
        self.assertEqual(self.engine.neglect_days(), 0.0)
        self.engine._last_interaction_at = (datetime.now() - timedelta(days=3)).isoformat()
        self.assertAlmostEqual(self.engine.neglect_days(), 3.0, places=2)

    def test_a_talking_partner_resets_the_clock(self):
        self.engine._last_interaction_at = (datetime.now() - timedelta(days=3)).isoformat()
        self.engine._note_interaction()
        self.assertLess(self.engine.neglect_days(), 0.01)

    def test_silence_decays_ties_and_is_recorded(self):
        self.engine.social.ties.interact("u1", 0.9)
        before = self.engine.social.ties.ties["u1"]
        self.engine._last_interaction_at = (datetime.now() - timedelta(days=4)).isoformat()
        report = asyncio.run(self.engine.run_daily_review(force=True))
        self.assertLess(self.engine.social.ties.ties["u1"], before)
        self.assertTrue(any(f["title"] == "很久没人说话" for f in report["findings"]))
        self.assertGreater(self.engine.selfhood.narrative.anchor_strength, 0.0)

    def test_neglect_is_surfaced_as_a_need_to_the_autonomous_pass(self):
        self.engine._last_interaction_at = (datetime.now() - timedelta(days=2)).isoformat()
        text, signals = asyncio.run(self.engine._collect_observations())
        self.assertIn("lonely", signals)
        self.assertIn("没有和任何人真正说过话", text)

    def test_a_broken_promise_costs_the_relationship(self):
        self.engine.companion.add_commitment("u1", "答应帮对方看简历")
        with self.engine.companion.db() as db:
            db.execute("UPDATE commitments SET created_at='2000-01-01T00:00:00'")
        before = self.engine.companion.relationship("u1")["affinity"]
        report = asyncio.run(self.engine.run_daily_review(force=True))
        after = self.engine.companion.relationship("u1")["affinity"]
        self.assertLess(after, before)
        self.assertEqual(self.engine.companion.list_commitments("u1", "open"), [])
        self.assertTrue(any(f["title"] == "没能兑现承诺" for f in report["findings"]))
        self.assertTrue(any("却没做到" in m["event"] for m in self.engine.selfhood.narrative.memories))

    def test_a_fresh_promise_is_not_expired(self):
        self.engine.companion.add_commitment("u1", "明天提醒我开会")
        self.assertEqual(self.engine.companion.expire_commitments(7.0), [])
        self.assertEqual(len(self.engine.companion.list_commitments("u1", "open")), 1)


class IrreversibilityTests(unittest.TestCase):
    """Withdrawing something is one of the few acts that cannot be undone."""

    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.memory = self.engine.memory

    def tearDown(self):
        self.directory.cleanup()

    def _stored_content(self, fact_id: str):
        with self.memory._connect() as db:
            row = db.execute("SELECT status, content FROM memory_facts WHERE id=?", (fact_id,)).fetchone()
        return dict(row) if row else None

    def test_withdrawal_purges_the_content(self):
        fact = self.memory.remember("用户说过他很怕黑", memory_type="fact")
        self.assertTrue(self.memory.delete_fact(fact.id, "test"))
        row = self._stored_content(fact.id)
        self.assertEqual(row["status"], "retracted")
        self.assertNotIn("怕黑", row["content"])

    def test_withdrawal_scrubs_the_backups(self):
        """Backups are what used to make a deletion recoverable."""
        fact = self.memory.remember("用户说过他很怕黑", memory_type="fact")
        self.memory.daily_backup()
        self.assertTrue(self.memory.delete_fact(fact.id, "test"))
        for backup in self.memory.backup_dir.glob("memory-*.json"):
            payload = json.loads(backup.read_text(encoding="utf-8"))
            for tier in ("short_term", "long_term"):
                self.assertFalse(any(str(i.get("id")) == fact.id for i in (payload.get(tier) or [])))

    def test_a_withdrawn_fact_cannot_be_exported(self):
        fact = self.memory.remember("用户说过他很怕黑", memory_type="fact")
        self.memory.delete_fact(fact.id, "test")
        self.assertNotIn(fact.id, [str(x["id"]) for x in self.memory.export_snapshot()["facts"]])

    def test_the_audit_row_survives_without_the_content(self):
        """It can know something was taken back, not what it said."""
        fact = self.memory.remember("用户说过他很怕黑", memory_type="fact")
        self.memory.delete_fact(fact.id, "test")
        with self.memory._connect() as db:
            rows = db.execute("SELECT detail FROM memory_audit WHERE fact_id=?", (fact.id,)).fetchall()
        self.assertTrue(rows)


class PersonResetTests(unittest.TestCase):
    """`reset_person` is the one deliberate escape hatch."""

    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.companion = self.engine.companion

    def tearDown(self):
        self.directory.cleanup()

    def _build_a_life(self):
        self.engine.memory.remember("用户怕黑", memory_type="fact")
        self.companion.add_goal("学会做手冲咖啡", "", "self")
        self.companion.add_commitment("u1", "明天提醒开会")
        self.companion.apply_relationship_event("u1", "k1", "chat", "private", 0.1)
        self.engine.social.ties.interact("u1", 0.9)
        self.engine._record_self_narrative("有人很认真地谢过我", 0.4)
        self.engine._histories["s1"] = [{"role": "user", "content": "hi"}]
        self.companion.set_settings({"quiet_start": "22"})

    def test_reset_wipes_the_character(self):
        self._build_a_life()
        result = asyncio.run(self.engine.reset_person())
        self.assertTrue(result)
        self.assertEqual(self.companion.list_goals(""), [])
        self.assertEqual(self.companion.list_commitments("u1", "open"), [])
        self.assertEqual(self.engine.social.ties.ties, {})
        self.assertEqual(self.engine.selfhood.narrative.anchor_strength, 0.0)
        self.assertEqual(self.engine._histories, {})
        self.assertEqual(self.companion.relationship("u1")["affinity"], 0.0)
        self.assertEqual(len(self.engine.memory.short_term.memories
                            + self.engine.memory.long_term.memories), 0)

    def test_reset_keeps_the_owners_configuration(self):
        self._build_a_life()
        asyncio.run(self.engine.reset_person())
        self.assertEqual(self.companion.get_settings()["quiet_start"], "22")

    def test_reset_rebuilds_the_cognition_core(self):
        self._build_a_life()
        asyncio.run(self.engine.reset_person())
        self.assertIsNotNone(self.engine.cognition)
        self.assertEqual(self.engine.selfhood.narrative.memories, [])


if __name__ == "__main__":
    unittest.main()


class OwnerOpacityTests(unittest.TestCase):
    """A3 信息不对称性: dashboard edits shape the character but stay invisible to it.

    The character may experience the *effect* of an owner override (affinity
    moved) but must never learn the *cause* ("the owner rewrote my affinity").
    """

    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.companion = self.engine.companion

    def tearDown(self):
        self.directory.cleanup()

    def test_owner_override_is_opaque_by_default(self):
        self.assertTrue(self.companion.owner_override_opaque())

    def test_owner_event_is_tagged_in_the_ledger(self):
        self.companion.apply_relationship_event("u1", "k1", "dashboard", "webui", 0.1, "owner")
        # The character is not allowed to believe an owner-forced edit.
        self.assertEqual(self.companion.relationship_beliefs("u1"), [])

    def test_partner_event_is_believed(self):
        self.companion.apply_relationship_event("u1", "k1", "message_sentiment", "private", 0.1)
        beliefs = self.companion.relationship_beliefs("u1")
        self.assertEqual(len(beliefs), 1)
        self.assertEqual(beliefs[0]["by"], "event")

    def test_opacity_can_be_turned_off(self):
        self.companion.apply_relationship_event("u1", "k1", "dashboard", "webui", 0.1, "owner")
        self.companion.set_settings({"owner_opacity": "0"})
        self.assertFalse(self.companion.owner_override_opaque())
        # With opacity off, the owner edit is visible to the self.
        self.assertEqual(len(self.companion.relationship_beliefs("u1")), 1)

    def test_owner_edit_does_not_write_a_self_narrative(self):
        before = len(self.engine.selfhood.narrative.memories)
        self.companion.apply_relationship_event("u1", "k1", "dashboard", "webui", 0.1, "owner")
        self.assertEqual(len(self.engine.selfhood.narrative.memories), before)


class ContinuityTests(unittest.TestCase):
    """A4 连续性: the character carries its inner life across ticks, not blank."""

    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.companion = self.engine.companion
        self.think = self.engine.think

    def tearDown(self):
        self.directory.cleanup()

    def test_inner_thread_returns_recent_states(self):
        self.companion.record_self_statement("今天有点累")
        self.companion.record_self_statement("想找人说话")
        self.assertEqual(self.companion.inner_thread_context(3, 6), "今天有点累；想找人说话")

    def test_inner_thread_excludes_the_latest_when_asked(self):
        self.companion.record_self_statement("今天有点累")
        self.companion.record_self_statement("想找人说话")
        self.assertEqual(self.companion.inner_thread_context(3, 6, exclude_latest=True), "今天有点累")

    def test_inner_thread_is_cap_bounded(self):
        for index in range(20):
            self.companion.record_self_statement(f"状态{index}")
        self.assertEqual(len(self.companion.inner_thread_context(3, 6).split("；")), 3)

    def test_prompt_injects_the_continuity_thread(self):
        prompt = self.think.build_prompt(user_message="hi", emotion_context="{}", energy_context="",
                                         memory_context="", self_statement="现在挺好",
                                         inner_thread="今天有点累；想找人说话")
        self.assertIn("你最近的状态脉络", prompt)
        self.assertIn("今天有点累", prompt)

    def test_prompt_skips_continuity_when_absent(self):
        prompt = self.think.build_prompt(user_message="hi", emotion_context="{}", energy_context="",
                                         memory_context="", self_statement="现在挺好", inner_thread="")
        self.assertNotIn("你最近的状态脉络", prompt)



class FirstPersonWiring(unittest.TestCase):
    """A2 第一人称: the character authors its own state line, not the engine.

    Pins that (1) the companion persists and returns the character's own voice,
    (2) the engine actually writes that line from its wave read-outs, and (3) the
    THINK prompt injects it as a first-person statement the model must not echo.
    """

    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.engine._cognition_enabled = True
        if self.engine.cognition is None:
            self.engine.cognition = SimpleNamespace()
        self.companion = self.engine.companion

    def tearDown(self):
        self.directory.cleanup()

    async def _fake_generate(self, model, messages, system, **kwargs):
        yield "今天有点想找人说话，又怕自己太黏。"

    def test_companion_stores_and_returns_the_characters_own_voice(self):
        self.assertEqual(self.companion.latest_self_statement(24), "")
        self.assertEqual(self.companion.record_self_statement("我有点想你", "daily"), 1)
        self.assertEqual(self.companion.latest_self_statement(24), "我有点想你")

    def test_stale_statements_are_not_returned(self):
        self.companion.record_self_statement("早上还行", "tick")
        with self.companion.db() as db:
            db.execute("UPDATE self_statements SET created_at='2000-01-01T00:00:00'")
        self.assertEqual(self.companion.latest_self_statement(24), "")

    def test_reset_wipes_the_self_statements(self):
        self.companion.record_self_statement("我有点想你", "daily")
        asyncio.run(self.engine.reset_person())
        self.assertEqual(self.companion.latest_self_statement(24), "")

    def test_the_engine_authors_from_its_own_waves(self):
        """Not the engine narrating — the character writes it (persisted + read back)."""
        self.engine.mocr = SimpleNamespace(generate=self._fake_generate)
        text = asyncio.run(self.engine._author_self_statement(reason="test"))
        self.assertEqual(text, "今天有点想找人说话，又怕自己太黏。")
        self.assertEqual(self.companion.latest_self_statement(24), text)
        self.assertEqual(self.engine._last_self_statement, text)

    def test_authoring_is_gated_by_the_cognition_core(self):
        self.engine._cognition_enabled = False
        self.engine.cognition = None
        self.assertEqual(asyncio.run(self.engine._author_self_statement(reason="test")), "")

    def test_the_prompt_injects_it_as_first_person(self):
        prompt = self.engine.think.build_prompt(
            user_message="hi", emotion_context="{}", energy_context="",
            memory_context="", self_statement="今天有点想你")
        self.assertIn("我自己刚写下的状态", prompt)
        self.assertIn("今天有点想你", prompt)

    def test_no_self_statement_keeps_the_prompt_clean(self):
        prompt = self.engine.think.build_prompt(
            user_message="hi", emotion_context="{}", energy_context="",
            memory_context="", self_statement="")
        self.assertNotIn("我自己刚写下的状态", prompt)


class CognitionSubsystemWiring(unittest.TestCase):
    """B-series: the 8 cognition subsystems that were instantiated but never fed.

    Each test pins that a real engine event actually moves the subsystem's state
    - not that the class exists.  If a future refactor drops a call site, the
    assertion fails instead of the subsystem silently going dead again.
    """

    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.directory.name)
        self.engine.apply_cognition_settings()
        self.turn = SimpleNamespace(session_id="s1", user_id="u1")

    def tearDown(self):
        self.directory.cleanup()

    def test_per_turn_feeds_primacy_learning_temporal_and_role_model(self):
        # a warm partner so role-model identification has someone to attach to
        self.engine.social.ties.interact("bob", 0.9)
        self.engine.social.ties.interact("bob", 0.9)
        self.engine._feed_cognition_subsystems(self.turn, "谢谢你今天陪我", {})
        # affective primacy: appraisal ran (affect is no longer the init 0.0)
        self.assertNotEqual(self.engine.selfhood.primacy.affect, 0.0)
        # temporal discounting: perceived time advanced one turn
        self.assertGreater(self.engine.selfhood.temporal.turn, 0)
        # social learning: one direct experience recorded
        self.assertGreater(self.engine.social.learning.experience_seen, 0)
        # role-model learning: identified with + observed the warm partner
        self.assertIn("bob", self.engine.social.role_model.exemplar_weight)
        self.assertIn("bob", self.engine.social.role_model.exemplars)

    def test_per_turn_feed_is_a_noop_when_core_off(self):
        self.engine._cognition_enabled = False
        self.engine.cognition = None
        self.engine.social.ties.interact("bob", 0.9)
        before_turn = self.engine.selfhood.temporal.turn
        before_seen = self.engine.social.learning.experience_seen
        self.engine._feed_cognition_subsystems(self.turn, "hi", {})
        self.assertEqual(self.engine.selfhood.temporal.turn, before_turn)
        self.assertEqual(self.engine.social.learning.experience_seen, before_seen)

    def test_feedback_feeds_motivation_meta_and_primacy(self):
        # positive feedback: a preference is recorded and meta-awareness rises
        self.engine._observe_partner("u1", {"sentiment": 1}, 5.0)
        self.engine._awaiting_feedback["s1"] = _awaiting("u1")
        self.engine._receive_feedback(self.turn, "谢谢你，真棒")
        self.assertIn(("被理解", "被误解"), self.engine.social.motivation.preferences)
        self.assertGreater(self.engine.selfhood.meta.self_alignment_steps, 0)
        self.assertNotEqual(self.engine.selfhood.primacy.affect, 0.0)

    def test_negative_feedback_blunts_anticipation(self):
        # punishment reduces reward anticipation (the anhedonia result)
        self.engine._observe_partner("u1", {"sentiment": -1}, 5.0)
        self.engine._awaiting_feedback["s1"] = _awaiting("u1")
        before = self.engine.social.motivation.anticipation
        self.engine._receive_feedback(self.turn, "闭嘴 讨厌 别烦我")
        self.assertLess(self.engine.social.motivation.anticipation, before)

    def test_daily_consolidate_drifts_slow_traits(self):
        before_k = self.engine.selfhood.temporal.k
        before_meta = self.engine.selfhood.meta.meta_awareness
        before_stance = self.engine.social.role_model.stance
        self.engine._consolidate_cognition(neglect=5.0)
        # patience is learned from cadence: long silence pulls k toward target
        self.assertNotEqual(self.engine.selfhood.temporal.k, before_k)
        # daily self-reflection raises meta-awareness
        self.assertGreater(self.engine.selfhood.meta.meta_awareness, before_meta)
        # moral stance drifts toward the identified exemplars
        self.assertNotEqual(self.engine.social.role_model.stance, before_stance)

    def test_arbitrate_drives_the_subsystems(self):
        # proves the call site (not just the method) is wired into a real turn
        self.engine.cognition.control = (
            lambda *a, **k: SimpleNamespace(state={}, action_index=0, to_dict=lambda: {}))
        self.engine.social.ties.interact("bob", 0.9)
        self.engine.social.ties.interact("bob", 0.9)
        self.engine._cognition_arbitrate("谢谢你", self.turn, "", {})
        self.assertGreater(self.engine.selfhood.temporal.turn, 0)
        self.assertGreater(self.engine.social.learning.experience_seen, 0)
        self.assertIn("bob", self.engine.social.role_model.exemplar_weight)

    def test_persona_detail_is_grounded_by_self_statement(self):
        # A2 wiring: every first-person line the character authors becomes a
        # grounded persona detail.  (mocr.generate is mocked so no model call.)
        async def _fake_generate(*args, **kwargs):
            yield "今天有点想被人记得。"

        self.engine.mocr.generate = _fake_generate
        before = self.engine.selfhood.persona.detail_level
        text = asyncio.run(self.engine._author_self_statement(reason="tick"))
        self.assertTrue(text)
        self.assertGreater(self.engine.selfhood.persona.detail_level, before)
        self.assertIn("self_view", self.engine.selfhood.persona.details)

