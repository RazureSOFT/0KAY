"""Tests for the social circuits (wave 4a).

Each test asserts the *computational claim* of one paper, and every circuit is
ablated at least once.
"""
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition.social import (
    SELMAN_STAGES,
    IntrinsicMotivation,
    PerspectiveTaking,
    ProsocialAlignment,
    RoleModelLearning,
    SocialConfig,
    SocialLearning,
    SocialSystem,
    SocialTies,
)


class TestSocialLearning(unittest.TestCase):
    """Paper 19: language guidance and experience combine by Bayesian inference."""

    def test_prior_is_uniform_and_uncertain(self):
        learner = SocialLearning(hypotheses=[0, 1, 2, 3])
        self.assertAlmostEqual(learner.posterior()[0], 0.25, places=6)
        self.assertAlmostEqual(learner.certainty, 0.0, places=6)

    def test_experience_concentrates_belief(self):
        learner = SocialLearning(hypotheses=[0, 1, 2, 3])
        for _ in range(12):
            learner.observe_experience(2)
        self.assertEqual(learner.best(), 2)
        self.assertGreater(learner.certainty, 0.5)

    def test_advice_reduces_risk(self):
        learner = SocialLearning(hypotheses=[0, 1, 2, 3])
        before = learner.risk_reduction()
        learner.receive_advice({0: 0.05, 1: 0.05, 2: 0.85, 3: 0.05}, trust=1.0)
        self.assertGreater(learner.risk_reduction(), before)
        self.assertEqual(learner.best(), 2)

    def test_experience_can_override_advice(self):
        learner = SocialLearning(hypotheses=[0, 1, 2, 3], experience_precision=0.9)
        learner.receive_advice({0: 0.9, 1: 0.03, 2: 0.03, 3: 0.03}, trust=0.3)
        for _ in range(20):
            learner.observe_experience(3)
        self.assertEqual(learner.best(), 3)

    def test_transmit_returns_the_belief(self):
        learner = SocialLearning(hypotheses=[0, 1, 2, 3])
        learner.observe_experience(1)
        transmitted = learner.transmit()
        self.assertAlmostEqual(sum(transmitted.values()), 1.0, places=6)


class TestRoleModelLearning(unittest.TestCase):
    """Paper 20: exemplar-driven moral learning via identity-driven conformity."""

    def test_identification_pulls_stance_toward_the_exemplar(self):
        model = RoleModelLearning(stance=0.5, identification=1.0)
        model.identify("mentor", 1.0)
        model.observe("mentor", 0.9)
        for _ in range(20):
            model.adopt()
        self.assertGreater(model.stance, 0.5)

    def test_stronger_identification_means_a_stronger_pull(self):
        weak = RoleModelLearning(stance=0.5, identification=0.1)
        strong = RoleModelLearning(stance=0.5, identification=1.0)
        for model in (weak, strong):
            model.identify("mentor", 1.0)
            model.observe("mentor", 1.0)
            model.adopt()
        self.assertGreater(strong.stance, weak.stance)

    def test_group_conformity_pulls_without_any_exemplar(self):
        model = RoleModelLearning(stance=0.5, conformity=1.0)
        for _ in range(20):
            model.adopt(group_fraction=1.0)
        self.assertGreater(model.stance, 0.6)

    def test_conformed_measures_distance_from_neutral(self):
        model = RoleModelLearning(stance=0.8)
        self.assertAlmostEqual(model.conformed, 0.6, places=6)


class TestSocialTies(unittest.TestCase):
    """Paper 21: ties emerge from interaction, evaluation and coaching."""

    def test_repeated_interaction_builds_a_tie(self):
        ties = SocialTies()
        for _ in range(6):
            ties.interact("alice", 0.8)
        self.assertGreater(ties.ties["alice"], 0.4)

    def test_reciprocity_raises_the_tie(self):
        warm = SocialTies()
        cold = SocialTies()
        for _ in range(6):
            warm.interact("bob", 0.6)
            warm.received_evaluation("bob", 0.9)
            cold.interact("bob", 0.6)
            cold.received_evaluation("bob", 0.1)
        self.assertGreater(warm.ties["bob"], cold.ties["bob"])

    def test_homophily_raises_the_tie(self):
        similar = SocialTies(homophily_weight=0.8)
        different = SocialTies(homophily_weight=0.8)
        similar.describe("__self__", {"a": 0.9, "b": 0.9})
        similar.describe("carol", {"a": 0.9, "b": 0.9})
        different.describe("__self__", {"a": 0.9, "b": 0.9})
        different.describe("carol", {"a": 0.1, "b": 0.1})
        for ties in (similar, different):
            for _ in range(5):
                ties.interact("carol", 0.5)
        self.assertGreater(similar.ties["carol"], different.ties["carol"])

    def test_coaching_accelerates_tie_formation(self):
        ties = SocialTies()
        before = ties.ties.get("dave", 0.0)
        ties.coach("dave", 1.0)
        self.assertGreater(ties.ties["dave"], before)

    def test_friends_are_the_strong_ties(self):
        ties = SocialTies()
        for _ in range(8):
            ties.interact("close", 0.9)
            ties.interact("distant", 0.05)
        self.assertIn("close", [p for p, _ in ties.friends(0.5)])


class TestProsocialAlignment(unittest.TestCase):
    """Papers 1-3: altruism from empathising and self-imagination."""

    def test_infer_state_reads_intent_emotion_and_need(self):
        align = ProsocialAlignment()
        state = align.infer_state({"intent": "请求", "emotion": -0.4, "need": 0.8})
        self.assertEqual(state["intent"], "请求")
        self.assertGreater(align.empathy, 0.0)

    def test_self_imagination_requires_both_sensitivity_and_severity(self):
        align = ProsocialAlignment()
        self.assertEqual(align.self_imagine({"sensitivity": 0.9}, {"severity": 0.0}), 0.0)
        self.assertGreater(align.self_imagine({"sensitivity": 0.9}, {"severity": 0.9}), 0.0)

    def test_empathy_shifts_the_objective_toward_the_other(self):
        selfish = ProsocialAlignment(empathy_weight=0.0)
        altruistic = ProsocialAlignment(empathy_weight=1.0)
        for align in (selfish, altruistic):
            align.infer_state({"need": 1.0})
            align.self_imagine({"sensitivity": 1.0}, {"severity": 1.0})
        # high empathy pulls the objective off one's own utility toward the other's
        self.assertGreater(selfish.align(1.0, 0.0), altruistic.align(1.0, 0.0))

    def test_moral_check_flags_an_exploitative_action(self):
        align = ProsocialAlignment(norm_strength=0.5)
        self.assertTrue(align.moral_check("exploit", own_gain=0.2, other_loss=0.9))
        self.assertFalse(align.moral_check("share", own_gain=0.8, other_loss=0.1))


class TestPerspectiveTaking(unittest.TestCase):
    """Papers 12/14/15: Selman stages and deliberate downplaying."""

    def test_below_stage_two_fails_false_belief(self):
        for stage in (0, 1):
            agent = PerspectiveTaking(stage=stage)
            self.assertFalse(agent.passes_false_belief("basket", "box"))

    def test_stage_two_and_above_passes_false_belief(self):
        for stage in (2, 3, 4):
            agent = PerspectiveTaking(stage=stage)
            self.assertTrue(agent.passes_false_belief("basket", "box"))

    def test_downplaying_lowers_the_expressed_stage(self):
        agent = PerspectiveTaking(stage=4)
        self.assertTrue(agent.passes_false_belief("basket", "box"))
        agent.downplay(0)
        self.assertEqual(agent.effective_stage, 0)
        self.assertFalse(agent.passes_false_belief("basket", "box"))
        agent.restore()
        self.assertTrue(agent.passes_false_belief("basket", "box"))

    def test_stage_names_come_from_selman(self):
        agent = PerspectiveTaking(stage=3)
        self.assertEqual(agent.name, SELMAN_STAGES[3])

    def test_narratives_differ_by_stage(self):
        egocentric = PerspectiveTaking(stage=0).narrate("玩球")
        mutual = PerspectiveTaking(stage=3).narrate("玩球")
        self.assertNotEqual(egocentric, mutual)


class TestIntrinsicMotivation(unittest.TestCase):
    """Papers 22/23/24: intrinsic reward, the ego, and anhedonic effort choice."""

    TASKS = {"easy_low": {"reward": 0.3, "effort": 0.1},
             "hard_high": {"reward": 1.0, "effort": 0.5}}

    def test_preference_builds_an_intrinsic_reward(self):
        motive = IntrinsicMotivation()
        motive.prefer("explore", "wait")
        self.assertGreater(motive.intrinsic_reward("explore"), 0.0)
        self.assertLess(motive.intrinsic_reward("wait"), 0.0)

    def test_ego_weights_reward_against_self_reference(self):
        motive = IntrinsicMotivation(ego_weight=1.0)
        low = motive.ego(reward=1.0, punishment=0.2, self_reference=0.0)
        high = motive.ego(reward=1.0, punishment=0.2, self_reference=1.0)
        self.assertGreater(high, low)

    def test_intact_anticipation_chooses_the_high_reward_task(self):
        motive = IntrinsicMotivation(anticipation=1.0)
        self.assertEqual(motive.choose_task(self.TASKS), "hard_high")

    def test_blunted_anticipation_flips_to_low_effort_low_reward(self):
        # the paper's headline: perturbing reward anticipation makes the agent
        # prefer low-effort/low-reward options - not a capability loss.
        motive = IntrinsicMotivation(anticipation=1.0)
        motive.blunt(0.8)
        self.assertEqual(motive.choose_task(self.TASKS), "easy_low")


class TestSocialSystem(unittest.TestCase):
    def test_disabled_system_is_a_noop(self):
        system = SocialSystem(SocialConfig(enabled=False))
        self.assertFalse(system.context()["enabled"])

    def test_context_exposes_the_readout(self):
        system = SocialSystem()
        for key in ("belief_certainty", "stance", "friends", "validated",
                    "empathy", "perspective_stage", "perspective_name", "anticipation"):
            self.assertIn(key, system.context())

    def test_ablation_helper_returns_an_isolated_copy(self):
        base = SocialConfig()
        ablated = base.ablate(use_social_ties=False, use_prosocial=False)
        self.assertTrue(base.use_social_ties)
        self.assertFalse(ablated.use_social_ties)
        self.assertFalse(ablated.use_prosocial)

    def test_persistence_round_trip(self):
        system = SocialSystem()
        system.learning.observe_experience(2)
        system.ties.interact("alice", 0.9)
        system.perspective.downplay(1)
        system.motivation.blunt(0.5)
        restored = SocialSystem.from_dict(system.to_dict())
        self.assertEqual(restored.learning.best(), system.learning.best())
        self.assertAlmostEqual(restored.ties.ties["alice"], system.ties.ties["alice"], places=6)
        self.assertEqual(restored.perspective.effective_stage, 1)
        self.assertAlmostEqual(restored.motivation.anticipation, system.motivation.anticipation, places=6)


class TestPersistenceThroughJSON(unittest.TestCase):
    """The real restart path is ``to_dict`` -> JSON -> ``from_dict``.

    JSON only allows string object keys, so an integer hypothesis id such as
    ``2`` is written as ``"2"``.  The in-memory round-trip test above never
    exercises this, which is exactly how a bug slipped through: a reloaded
    learner used to carry *string* hypothesis ids, so every later call with an
    int id (the whole public API) silently created a second key and dropped the
    evidence - advice received after a restart was quietly ignored.
    """

    def test_hypothesis_ids_survive_a_json_round_trip(self):
        learner = SocialLearning(hypotheses=[0, 1, 2, 3])
        for _ in range(12):
            learner.observe_experience(2)
        restored = SocialLearning.from_dict(json.loads(json.dumps(learner.to_dict())))
        self.assertEqual(restored.hypotheses, [0, 1, 2, 3])
        self.assertEqual(restored.best(), 2)
        self.assertIsInstance(restored.best(), int)

    def test_advice_is_not_dropped_after_a_reload(self):
        learner = SocialLearning(hypotheses=[0, 1, 2, 3])
        restored = SocialLearning.from_dict(json.loads(json.dumps(learner.to_dict())))
        restored.receive_advice({0: 0.05, 1: 0.05, 2: 0.85, 3: 0.05}, trust=1.0)
        self.assertEqual(restored.best(), 2)

    def test_experience_does_not_split_into_a_second_key(self):
        learner = SocialLearning(hypotheses=[0, 1, 2, 3])
        restored = SocialLearning.from_dict(json.loads(json.dumps(learner.to_dict())))
        restored.observe_experience(2)
        restored.observe_experience(2)
        self.assertEqual(dict(restored.experience_counts), {2: 2.0})

    def test_named_hypotheses_keep_their_string_keys(self):
        learner = SocialLearning(hypotheses=["left", "right"])
        learner.observe_experience("right")
        restored = SocialLearning.from_dict(json.loads(json.dumps(learner.to_dict())))
        self.assertEqual(restored.hypotheses, ["left", "right"])
        self.assertEqual(restored.best(), "right")

    def test_tie_evaluation_history_survives_a_reload(self):
        ties = SocialTies()
        ties.interact("alice", 0.9)
        ties.interact("alice", 0.7)
        restored = SocialTies.from_dict(json.loads(json.dumps(ties.to_dict())))
        self.assertEqual(list(restored.evaluations["alice"]), [0.9, 0.7])

    def test_social_system_json_round_trip_is_identical(self):
        system = SocialSystem()
        system.learning.observe_experience(2)
        system.learning.receive_advice({0: 0.1, 1: 0.1, 2: 0.7, 3: 0.1}, trust=0.8)
        system.role_model.identify("mentor", 0.8)
        system.role_model.observe("mentor", 0.9)
        system.ties.interact("alice", 0.9)
        system.ties.received_evaluation("alice", 0.7)
        system.prosocial.infer_state({"intent": "情绪", "emotion": -0.5, "need": 0.7})
        system.motivation.prefer("bright cat", "dull cat", 0.8)
        system.motivation.blunt(0.4)
        blob = json.loads(json.dumps(system.to_dict(), ensure_ascii=False))
        self.assertEqual(SocialSystem.from_dict(blob).to_dict(), system.to_dict())


if __name__ == "__main__":
    unittest.main()
