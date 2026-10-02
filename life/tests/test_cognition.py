"""Tests for the multi-system cognition core.

These reproduce the paper's headline results on the two-action / three-state toy
task: devaluation is immediate and depends on the model-based system, reversal is
gradual, replay is priority-driven, encoding is selective and control degrades
with load and fatigue.
"""
import random
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition import CognitionConfig, CognitionEngine, MultiSystemModel, ToyTask
from life.cognition.space import LIFE_ACTIONS, reward_from_signals, state_index


def train(task: ToyTask, model: MultiSystemModel, rounds: int = 400, steps: int = 4, epsilon: float = 0.1):
    """Run the model's own policy (with epsilon exploration) over the task."""
    for _ in range(rounds):
        state = 0
        for _ in range(steps):
            action = model.decide(state, stakes=1.0, explore=True).action
            next_state = task.step(state, action)
            model.learn(state, action, next_state)
            state = next_state


def preference(values) -> int:
    return max(range(len(values)), key=lambda index: values[index])


class DevaluationReversal(unittest.TestCase):
    def test_devaluation_flips_planning_but_not_habit(self):
        task = ToyTask()
        model = task.model(rng=random.Random(0))
        train(task, model)
        # Trained: everything prefers A (action 0).
        self.assertEqual(preference(model.habit_distribution(0)), 0)
        self.assertEqual(preference(model.model_based_values()[0]), 0)
        # Devalue the good outcome: one write, no new experience.
        task.devalue_good()
        model.set_outcome_value(1, 0.0)
        # Planning revalues instantly ...
        self.assertEqual(preference(model.model_based_values()[0]), 1)
        # ... habit does not budge, and model-free value has no new experience.
        self.assertEqual(preference(model.habit_distribution(0)), 0)
        self.assertEqual(preference(model.Q_mf[0]), 0)
        # The full model turns the behaviour around.
        decision = model.decide(0, stakes=1.0)
        self.assertEqual(decision.mode, "FULL")
        self.assertGreater(decision.probabilities[1], decision.probabilities[0])

    def test_reversal_is_gradual(self):
        task = ToyTask()
        model = task.model(rng=random.Random(1))
        train(task, model)
        before = list(model.model_based_values()[0])
        task.reverse()
        # Immediately after reversal the transition model still reflects the old
        # world, so planning is unchanged and behaviour has not moved yet.
        after = list(model.model_based_values()[0])
        self.assertAlmostEqual(before[0], after[0], places=6)
        self.assertEqual(model.decide(0, stakes=1.0).action, 0)
        # Relearning over the new world eventually flips the slow system too.
        train(task, model, rounds=400)
        self.assertEqual(preference(model.habit_distribution(0)), 1)
        self.assertEqual(model.decide(0, stakes=1.0).action, 1)

    def test_ablation_without_planning_loses_devaluation_sensitivity(self):
        task = ToyTask()
        model = task.model(rng=random.Random(2))
        train(task, model)
        task.devalue_good()
        model.set_outcome_value(1, 0.0)
        # Remove the model-based system by restricting the arbiter to AUTO/WM.
        from life.cognition import model as model_module
        original = dict(model_module.MODE_MODULES)
        try:
            model_module.MODE_MODULES["AUTO"] = ("H", "MF")
            model_module.MODE_MODULES["WM"] = ("H", "MF", "WM")
            model_module.MODE_MODULES["PLAN"] = ("H", "MF")
            model_module.MODE_MODULES["FULL"] = ("H", "MF", "WM")
            decision = model.decide(0, stakes=1.0)
        finally:
            model_module.MODE_MODULES.clear()
            model_module.MODE_MODULES.update(original)
        # Without MB every remaining subsystem still points at the old action.
        self.assertGreater(decision.probabilities[0], decision.probabilities[1])


class LearningMechanisms(unittest.TestCase):
    def test_replay_priority_follows_prediction_error(self):
        task = ToyTask()
        model = task.model(rng=random.Random(3))
        train(task, model, rounds=15)  # deliberately undertrained
        priorities = [model.replay_priority(e) for e in model.engrams]
        self.assertTrue(priorities)
        top = sorted(model.engrams, key=lambda e: model.replay_priority(e), reverse=True)[:3]
        top_pe = [abs(e.prediction_error) for e in top]
        all_pe = sorted((abs(e.prediction_error) for e in model.engrams), reverse=True)
        # The three most-replayed traces are among the highest-error traces.
        self.assertGreaterEqual(min(top_pe), all_pe[min(5, len(all_pe) - 1)])

    def test_sleep_replay_updates_model_free_value(self):
        task = ToyTask()
        model = task.model(rng=random.Random(4))
        train(task, model, rounds=15)
        before = list(model.Q_mf[0])
        model.sleep_replay(steps=300)
        after = list(model.Q_mf[0])
        self.assertNotEqual(before, after)
        self.assertTrue(any(e.replays > 0 for e in model.engrams))

    def test_encoding_is_selective(self):
        task = ToyTask()
        model = task.model(rng=random.Random(5))
        train(task, model, rounds=400)
        # Far fewer traces than experiences: most steps are neither surprising
        # nor novel once the task is learned.
        self.assertLess(len(model.engrams), 400 * 4)
        self.assertGreater(len(model.engrams), 0)

    def test_reconsolidation_three_branches(self):
        task = ToyTask()
        model = task.model(rng=random.Random(6))
        train(task, model, rounds=40)
        engram = model.engrams[0]
        self.assertEqual(model.reconsolidate(engram, engram.reward, engram.next_cue), "strengthen")
        self.assertEqual(model.reconsolidate(engram, engram.reward + 1.0, engram.next_cue), "update")
        self.assertEqual(model.reconsolidate(engram, engram.reward + 50.0, engram.next_cue), "recreate")


class ControlArbitration(unittest.TestCase):
    def test_control_degrades_with_load_and_fatigue(self):
        task = ToyTask()
        model = task.model(rng=random.Random(7))
        train(task, model)
        task.devalue_good()
        model.set_outcome_value(1, 0.0)  # create habit-vs-model conflict
        fresh = model.decide(0, stakes=1.0, fatigue=0.0, load=0.0)
        loaded = model.decide(0, stakes=1.0, fatigue=0.0, load=0.9)
        tired = model.decide(0, stakes=1.0, fatigue=0.8, load=0.0)
        self.assertEqual(fresh.mode, "FULL")
        self.assertEqual(loaded.mode, "AUTO")
        self.assertEqual(tired.mode, "AUTO")
        # Capacity collapses as load rises.
        self.assertLess(loaded.capacity, fresh.capacity)

    def test_plan_is_dominated_by_full(self):
        task = ToyTask()
        model = task.model(rng=random.Random(8))
        train(task, model)
        task.devalue_good()
        model.set_outcome_value(1, 0.0)
        chosen = set()
        for stakes in (0.5, 1.0, 2.0):
            for load in (0.0, 0.25, 0.5):
                for fatigue in (0.0, 0.4):
                    chosen.add(model.decide(0, stakes=stakes, load=load, fatigue=fatigue).mode)
        # The nominal four modes collapse to three: PLAN is never selected.
        self.assertNotIn("PLAN", chosen)


class PersistenceAndAdapter(unittest.TestCase):
    def test_model_round_trip(self):
        task = ToyTask()
        model = task.model(rng=random.Random(9))
        train(task, model, rounds=60)
        restored = MultiSystemModel.from_dict(model.to_dict())
        self.assertEqual(restored.H, model.H)
        self.assertEqual(restored.Q_mf, model.Q_mf)
        self.assertEqual(len(restored.engrams), len(model.engrams))

    def test_engine_persists_and_decides(self):
        with tempfile.TemporaryDirectory() as directory:
            engine = CognitionEngine(directory)
            outcome = engine.control({"intent": "提问", "role": "owner", "urgency": 0.8, "memory_hits": 2})
            self.assertIn(outcome.action, LIFE_ACTIONS)
            self.assertIn(outcome.mode, ("AUTO", "WM", "PLAN", "FULL"))
            engine.remember_decision("s1", outcome)
            engine.observe("s1", {"intent": "提问"}, {"intent": "闲聊"}, reward=1.2)
            engine.save()
            reloaded = CognitionEngine(directory)
            self.assertEqual(reloaded.turns, 1)

    def test_state_index_is_bounded(self):
        for intent in ("请求", "情绪", "分享", "抱怨", "提问", "闲聊", "unknown"):
            for role in ("owner", "secondary", "other"):
                index = state_index({"intent": intent, "role": role, "urgency": 0.5, "memory_hits": 1})
                self.assertGreaterEqual(index, 0)
                self.assertLess(index, 216)

    def test_reward_binds_to_outcome(self):
        good = reward_from_signals(valence_delta=0.4, task_success=1.0)
        bad = reward_from_signals(valence_delta=-0.4, task_failure=1.0, friction=0.5)
        self.assertGreater(good, bad)


class EngramMemory(unittest.TestCase):
    """The durable memory store now encodes selectively and reconsolidates."""

    def test_selective_encoding(self):
        from life.memory.memory import MemorySystem
        with tempfile.TemporaryDirectory() as directory:
            memory = MemorySystem(directory)
            self.assertIsNone(memory.remember_episode("平常的一句闲聊", prediction_error=0.05, novelty=0.1))
            encoded = memory.remember_episode("完全没想到的事", prediction_error=0.9)
            self.assertIsNotNone(encoded)
            self.assertIn(encoded.id, [m.id for m in memory.short_term.memories])

    def test_retrieval_prefers_recent_strong_traces(self):
        from life.memory.memory import MemorySystem
        with tempfile.TemporaryDirectory() as directory:
            memory = MemorySystem(directory)
            strong = memory.remember_episode("量子计算与神经科学交叉", prediction_error=1.0, strength=0.9)
            weak = memory.remember_episode("量子计算与神经科学交叉", prediction_error=1.0, strength=0.2)
            hits = memory.recall_engrams("量子计算 神经科学", top_k=5)
            self.assertTrue(hits)
            self.assertEqual(hits[0]["id"], strong.id)

    def test_reconsolidation_branches(self):
        from life.memory.memory import MemorySystem
        with tempfile.TemporaryDirectory() as directory:
            memory = MemorySystem(directory)
            # Nader & Hardt 2009: a trace has to be *reactivated* before it can
            # be re-written, so each branch is reached through a real retrieval.
            stable = memory.remember("稳定的事实", strength=0.5)
            memory.reactivate(stable.id)
            self.assertEqual(memory.reconsolidate(stable.id, 0.5)["branch"], "strengthen")
            shifted = memory.remember("被改写的事实", strength=0.2)
            memory.reactivate(shifted.id)
            self.assertEqual(memory.reconsolidate(shifted.id, 1.0)["branch"], "update")
            broken = memory.remember("被推翻的事实", strength=0.5)
            memory.reactivate(broken.id)
            result = memory.reconsolidate(broken.id, 1.0, surprise=10.0)
            self.assertEqual(result["branch"], "recreate")
            superseding = [m for m in memory.short_term.memories if m.metadata.get("supersedes_id") == broken.id]
            self.assertEqual(len(superseding), 1)


class ThinkIntegration(unittest.TestCase):
    """The arbiter's decision must reach the planner prompt."""

    def test_think_prompt_surfaces_control_mode(self):
        from life.think.think import ThinkStage
        stage = ThinkStage()
        prompt = stage.build_prompt(user_message="hi", emotion_context="{}", energy_context="ok",
                                    memory_context="none", control_mode="FULL", strategy="plan")
        self.assertIn("FULL", prompt)
        self.assertIn("规划", prompt)
        quiet = stage.build_prompt(user_message="hi", emotion_context="{}", energy_context="ok",
                                   memory_context="none", control_mode="AUTO", strategy="reply_brief")
        self.assertIn("AUTO", quiet)
        self.assertIn("不要规划", quiet)


if __name__ == "__main__":
    unittest.main()
