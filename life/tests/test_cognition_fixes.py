"""Regression tests for the cognition-core bug fixes.

Each test pins one of the defects found in review so it cannot silently return:

1. the arbiter's learned state is persisted (``CognitionEngine.save`` is called);
2. a terminal turn records *no* transition (no self-loop in ``N``);
3. reconsolidation compares against the stored reward, not the importance;
4. ``wm_capacity`` / ``prospection_horizon`` take effect live;
5. after a load, ``reconfigure`` mutates the config the model actually reads;
6. concurrent sessions cannot cross-contaminate their settle;
7. sleep replay is serialized against live learning;
8. the audit log and episodic store are bounded;
9. the language tables are bounded;
10. engram thresholds follow the live config;
11. an empty module distribution does not raise;
12. the pending-decision map is bounded.
"""
import os
import tempfile
import threading
import unittest
from pathlib import Path
from types import SimpleNamespace

import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.companion import CompanionSystem  # noqa: E402
from life.engine import LifeEngine  # noqa: E402
from life.cognition.circuits import DistributedEvidence  # noqa: E402
from life.cognition.language import WordSegmenter, StructuralLearner  # noqa: E402


def _turn(session_id="s1", user_id="u1", intent="闲聊"):
    return SimpleNamespace(user_id=user_id, intent=intent, session_id=session_id)


class CognitionFixes(unittest.TestCase):
    def setUp(self):
        self._env = {k: os.environ.pop(k) for k in list(os.environ) if k.startswith("LIFE_COG_")}
        self.dir = tempfile.TemporaryDirectory()
        self.engine = LifeEngine(self.dir.name)

    def tearDown(self):
        os.environ.update(self._env)
        self.dir.cleanup()

    def _drive(self, session_id="s1", message="你好", response="嗯，我在"):
        turn = _turn(session_id=session_id)
        self.engine._cognition_arbitrate(message, turn, "", {})
        self.engine._cognition_settle(session_id, turn, response, "", 0.0, 0.0)
        return turn

    # 1 ------------------------------------------------------------------
    def test_state_is_persisted_and_reloaded(self):
        self._drive()
        self._drive(session_id="s2")
        self.engine._save_state()
        path = Path(self.dir.name) / "cognition" / "cognition.json"
        self.assertTrue(path.exists(), "cognition state was never written to disk")
        reloaded = LifeEngine(self.dir.name)
        self.assertGreater(reloaded.cognition.turns, 0)
        self.assertEqual(reloaded.cognition.turns, self.engine.cognition.turns)

    # 2 ------------------------------------------------------------------
    def test_terminal_turn_records_no_self_loop(self):
        self._drive()
        model = self.engine.cognition.model
        self.assertEqual(model.N, {}, "a terminal turn must not record a transition")
        self.assertEqual(sum(sum(row) for row in model.visits), 0)

    # 3 ------------------------------------------------------------------
    def test_reconsolidation_uses_stored_reward(self):
        memory = self.engine.memory
        trace = memory.remember_episode("那次我们吵得很厉害", prediction_error=2.0, novelty=1.0,
                                        strength=1.0, metadata={"reward": -5.0})
        self.assertIsNotNone(trace)
        memory.reactivate(trace.id)  # Nader & Hardt 2009: retrieval opens the window
        result = memory.reconsolidate(trace.id, reward_new=-5.0)
        self.assertEqual(result["branch"], "strengthen",
                         "a matching outcome must strengthen, not look like a mismatch")

    # 4 ------------------------------------------------------------------
    def test_live_tuning_takes_effect(self):
        cognition = self.engine.cognition
        config = cognition.config
        config.wm_capacity = 9
        config.prospection_horizon = 8
        cognition.reconfigure(config)
        self.assertEqual(cognition.model.wm.maxlen, 9)
        self.assertEqual(cognition.model.prospection.horizon, 8)

    # 5 ------------------------------------------------------------------
    def test_reconfigure_after_load_hits_the_live_config(self):
        self._drive()
        self.engine._save_state()
        reloaded = LifeEngine(self.dir.name)
        cognition = reloaded.cognition
        self.assertIs(cognition.config, cognition.model.config)
        config = cognition.config
        config.plan_depth = 6
        cognition.reconfigure(config)
        self.assertEqual(cognition.model.config.plan_depth, 6)

    # 6 ------------------------------------------------------------------
    def test_concurrent_sessions_settle_independently(self):
        turn_a = _turn(session_id="a")
        turn_b = _turn(session_id="b")
        self.engine._cognition_arbitrate("甲", turn_a, "", {})
        self.engine._cognition_arbitrate("乙", turn_b, "", {})
        self.engine._cognition_settle("a", turn_a, "回复甲", "", 0.0, 0.0)
        self.assertIn("b", self.engine._session_cognition,
                      "settling session a must not consume session b's snapshot")

    # 7 ------------------------------------------------------------------
    def test_sleep_replay_serialized_against_learning(self):
        model = self.engine.cognition.model
        # Seed a few traces so replay has work to do.
        for index in range(40):
            model.learn(index % model.n_states, 0, (index + 1) % model.n_states,
                        reward=float(index % 3))
        errors = []

        def replayer():
            try:
                for _ in range(50):
                    model.sleep_replay(20)
            except Exception as error:  # pragma: no cover - failure path
                errors.append(error)

        def learner():
            try:
                for index in range(200):
                    model.learn(index % model.n_states, index % model.n_actions,
                                (index + 1) % model.n_states, reward=1.0)
            except Exception as error:  # pragma: no cover - failure path
                errors.append(error)

        threads = [threading.Thread(target=replayer), threading.Thread(target=learner)]
        for thread in threads:
            thread.start()
        for thread in threads:
            thread.join()
        self.assertEqual(errors, [], f"concurrent replay/learning raised: {errors}")

    # 8a -----------------------------------------------------------------
    def test_audit_log_is_bounded(self):
        memory = self.engine.memory
        for index in range(1200):
            memory.store(f"笔记 {index}")
        memory._prune_audit(cap=100)
        with memory._connect() as db:
            remaining = db.execute("SELECT COUNT(*) FROM memory_audit").fetchone()[0]
        self.assertLessEqual(remaining, 200)

    # 8b -----------------------------------------------------------------
    def test_episode_store_is_bounded(self):
        memory = self.engine.memory
        memory._episode_cap = 5
        for index in range(30):
            memory.remember_episode(f"第 {index} 件难忘的事", prediction_error=2.0, novelty=1.0)
        episodes = [m for m in memory.short_term.memories + memory.long_term.memories
                    if m.metadata.get("memory_type") == "episode"]
        self.assertLessEqual(len(episodes), 6)

    # 9 ------------------------------------------------------------------
    def test_language_tables_are_bounded(self):
        segmenter = WordSegmenter(max_pairs=10)
        segmenter.observe([f"u{i}" for i in range(60)])
        self.assertLessEqual(len(segmenter.pair_counts), 10)
        learner = StructuralLearner(max_pairs=10, max_units=5)
        learner.observe([f"u{i}" for i in range(60)])
        self.assertLessEqual(len(learner.adjacent), 10)
        self.assertLessEqual(len(learner.out_adjacent), 5)

    # 10 -----------------------------------------------------------------
    def test_engram_thresholds_follow_live_config(self):
        config = self.engine.cognition.config
        config.theta_pe = 0.77
        self.engine.memory.set_engram_config(config)
        self.assertEqual(self.engine.memory._thresholds()[0], 0.77)

    # 11 -----------------------------------------------------------------
    def test_empty_distribution_does_not_raise(self):
        readout = DistributedEvidence.read({"empty": [], "ok": [0.5, 0.5]})
        self.assertIsNotNone(readout)

    # 12 -----------------------------------------------------------------
    def test_pending_decisions_are_bounded(self):
        outcome = SimpleNamespace(state=0, action_index=0)
        for index in range(700):
            self.engine.cognition.remember_decision(f"s{index}", outcome)
        self.assertLessEqual(len(self.engine.cognition._pending), 512)


class ZeroIsARealValue(unittest.TestCase):
    """`value or default` must not swallow an at-rest 0.0 on a signed scale."""

    def test_coerce_keeps_zero_and_only_falls_back_on_none(self):
        from life.engine.legacy import _coerce

        self.assertEqual(_coerce(0.0, 0.5), 0.0)
        self.assertEqual(_coerce(None, 0.5), 0.5)
        self.assertEqual(_coerce("0", 0.5), 0.0)
        self.assertEqual(_coerce(-0.25, 0.5), -0.25)
        self.assertEqual(_coerce(0.0, 1.0), 0.0)

    def test_self_imagination_treats_neutral_sensitivity_as_zero(self):
        from life.cognition.social import ProsocialAlignment

        alignment = ProsocialAlignment()
        self.assertEqual(alignment.self_imagine({"sensitivity": 0.0}, {"severity": 1.0}), 0.0)
        self.assertEqual(alignment.self_imagine({}, {"severity": 1.0}), 0.5)
        self.assertEqual(alignment.self_imagine({"sensitivity": None}, {"severity": 1.0}), 0.5)


if __name__ == "__main__":
    unittest.main()
