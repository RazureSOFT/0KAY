"""Tests for the circuits derived from the 15 follow-up papers.

Each test asserts the *computational claim* of one paper, not its biology.
"""
import math
import random
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition import (
    CIRCUITS,
    CognitionEngine,
    DistributedEvidence,
    Flexibility,
    GlobalWorkspace,
    GroupCoupling,
    Metacognition,
    MultiSystemModel,
    OFCValueMap,
    Prospection,
    SelfModel,
    SocialCoder,
    ToyTask,
    hebbian_gate,
)
from life.cognition.circuits import CerebellarPredictor, CogLinksArbiter
from life.cognition.model import CognitionConfig
from life.cognition.space import N_STATES, state_index


def train(task, model, rounds=200, steps=4):
    for _ in range(rounds):
        state = 0
        for _ in range(steps):
            action = model.decide(state, stakes=1.0, explore=True).action
            next_state = task.step(state, action)
            model.learn(state, action, next_state)
            state = next_state


class Paper1Thalamus(unittest.TestCase):
    """MD arbitrates model-free vs model-based; CogLinks gives the update rule."""

    def test_hebbian_gate_matches_the_paper_formula(self):
        for x in (0.0, 0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0):
            expected = max(0.0, (1 - math.exp(4 - 4 * x)) / (1 + math.exp(4 - 4 * x)))
            self.assertAlmostEqual(hebbian_gate(x), expected, places=10)
        # It is a threshold nonlinearity: silent until x passes 1, then rising.
        self.assertEqual(hebbian_gate(0.0), 0.0)
        self.assertEqual(hebbian_gate(0.5), 0.0)
        self.assertEqual(hebbian_gate(1.0), 0.0)
        self.assertGreater(hebbian_gate(1.5), hebbian_gate(1.1))
        self.assertAlmostEqual(hebbian_gate(2.0), 1.0, places=1)

    def test_model_based_overwrites_faster_than_model_free(self):
        arbiter = CogLinksArbiter()
        # lateral MD (dorsal PFC) drives the model-based mode; medial the model-free
        lateral_mb, medial_mf = arbiter.md_signals(need=1.0)
        self.assertGreater(lateral_mb, medial_mf)
        fast = arbiter.update_rate("ctx", lateral_mb)
        slow = arbiter.update_rate("ctx", medial_mf)
        self.assertGreater(fast, slow)
        # Same starting point, same context: MB toggles further than MF.
        mb = CogLinksArbiter(); mb.update_strategy("c", [0.0, 1.0], lateral_mb)
        mf = CogLinksArbiter(); mf.update_strategy("c", [0.0, 1.0], medial_mf)
        self.assertGreater(mb.strategy["c"][1], mf.strategy["c"][1])

    def test_update_rate_decays_with_repetitions(self):
        arbiter = CogLinksArbiter()
        first = arbiter.update_rate("c", 1.0)
        for _ in range(20):
            arbiter.update_strategy("c", [1.0, 0.0], 1.0)
        later = arbiter.update_rate("c", 1.0)
        self.assertLess(later, first)
        self.assertGreaterEqual(later, arbiter.floor)  # the paper's max{0.1, ...}

    def test_context_inference_failure_lowers_the_gate(self):
        good = CogLinksArbiter()
        bad = CogLinksArbiter()
        for _ in range(30):
            good.observe(surprise=0.0, switched=False)
            bad.observe(surprise=1.0, switched=True)
        self.assertGreater(good.context_inference, bad.context_inference)
        self.assertGreater(good.md_signals(1.0)[0], bad.md_signals(1.0)[0])


class Paper5Cerebellum(unittest.TestCase):
    """Cerebellar output is needed for PE coding, not for learning itself."""

    def test_forward_model_converges_and_reliability_rises(self):
        predictor = CerebellarPredictor()
        first = abs(predictor.observe(0, 0, 1.0))
        for _ in range(20):
            residual = predictor.observe(0, 0, 1.0)
        self.assertLess(abs(residual), first)
        self.assertGreater(predictor.reliability(), 0.5)

    def test_ablation_keeps_learning_but_removes_the_pe_signal(self):
        task = ToyTask()
        intact = task.model(rng=random.Random(0))
        ablated = task.model(rng=random.Random(0))
        ablated.config.use_cerebellum = False
        train(task, intact, rounds=30)
        train(task, ablated, rounds=30)
        # Behaviour (and TD learning) survives the lesion ...
        self.assertTrue(any(value != 0.0 for value in ablated.Q_mf[0]))
        self.assertGreater(max(ablated.habit_distribution(0)), 0.5)
        # ... but the cerebellar PE coder never runs.
        self.assertTrue(intact.cerebellum.predictions)
        self.assertFalse(ablated.cerebellum.predictions)


class Paper3OFC(unittest.TestCase):
    """OFC is a cognitive map: similar states are close, unseen states generalise."""

    def test_similarity_and_generalisation(self):
        value_map = OFCValueMap(3, n_features=3)
        value_map.set_features(0, [1.0, 0.0, 0.0])
        value_map.set_features(1, [0.9, 0.1, 0.0])
        value_map.set_features(2, [0.0, 0.0, 1.0])
        self.assertGreater(value_map.similarity(0, 1), value_map.similarity(0, 2))
        self.assertEqual(value_map.similarity(0, 0), 1.0)
        inferred = value_map.generalise(2, {0: [1.0, 0.0], 1: [1.0, 0.0]})
        # A state with no neighbours close enough returns nothing rather than noise.
        self.assertEqual(inferred, [])
        inferred_near = value_map.generalise(2, {0: [1.0, 0.0]})
        self.assertEqual(inferred_near, [])

    def test_life_states_generalise_across_urgency(self):
        with tempfile.TemporaryDirectory() as directory:
            engine = CognitionEngine(directory)
            model = engine.model
            source = state_index({"intent": "提问", "role": "owner", "urgency": 0.9, "memory_hits": 1})
            near = state_index({"intent": "提问", "role": "owner", "urgency": 0.1, "memory_hits": 1})
            far = state_index({"intent": "抱怨", "role": "other", "urgency": 0.1, "memory_hits": 0})
            model.learn(source, 0, source)
            model.learn(source, 0, source)
            near_values = model.engram_values(near)
            far_values = model.engram_values(far)
            self.assertGreater(sum(near_values), 0.0)   # generalised from a similar context
            self.assertEqual(sum(far_values), 0.0)      # a dissimilar context does not inherit


class Paper4Prospection(unittest.TestCase):
    """PFC constructs abstract future value; framing and retrospection matter."""

    def test_horizon_and_framing(self):
        # A four-state chain with the reward only at the far end: looking further
        # ahead is the only way to see it.
        n_states = 4

        def transition(state, action):
            return [(state + 1, 1.0)] if state + 1 < n_states else []

        def reward(state):
            return 1.0 if state == n_states - 1 else 0.0

        short = Prospection(horizon=1).values(0, transition, reward, 1)
        long = Prospection(horizon=3).values(0, transition, reward, 1)
        self.assertEqual(short[0], 0.0)          # one step cannot see the reward
        self.assertGreater(long[0], 0.0)         # three steps can
        framed = Prospection(horizon=3).values(0, transition, reward, 1, framing=2.0)
        self.assertAlmostEqual(framed[0], 2.0 * long[0], places=6)

    def test_retrospection_biases_future_value(self):
        task = ToyTask()
        model = task.model()
        model.N[(0, 0)] = {1: 5.0}
        before = Prospection(horizon=3).values(0, model._successors, model.reward, 2)
        prospect = Prospection(horizon=3)
        for _ in range(10):
            prospect.observe_outcome(2.0, 0.0)
        after = prospect.values(0, model._successors, model.reward, 2)
        self.assertGreater(after[0], before[0])


class Paper6to8Social(unittest.TestCase):
    """Basis functions over interaction types, split ToM, pragmatics."""

    def setUp(self):
        self.coder = SocialCoder()

    def test_basis_functions_are_over_interaction_types(self):
        reading = self.coder.encode("我们一起合作做这个吧")
        self.assertEqual(set(reading.basis), {"cooperation", "competition", "exchange",
                                              "instruction", "affiliation"})
        self.assertEqual(reading.dominant, "cooperation")
        self.assertAlmostEqual(sum(reading.basis.values()), 1.0, places=6)

    def test_combinatorial_possibilities_are_encoded(self):
        reading = self.coder.encode("我们一起合作，但也要竞争一下")
        self.assertTrue(reading.combinations)
        self.assertTrue(any("cooperation" in key and "competition" in key for key in reading.combinations))

    def test_theory_of_mind_has_two_components(self):
        cognitive = self.coder.encode("他以为我知道这件事")
        affective = self.coder.encode("他很难过，我有点担心他的心情")
        self.assertGreater(cognitive.cognitive_tom, 0.0)
        self.assertGreater(affective.affective_tom, 0.0)
        self.assertGreater(affective.affective_tom, affective.cognitive_tom)

    def test_pragmatics_and_communicative_function(self):
        direct = self.coder.encode("帮我倒杯水")
        indirect = self.coder.encode("能不能帮我倒杯水，方便的话")
        self.assertGreater(indirect.indirectness, direct.indirectness)
        self.assertEqual(indirect.function, "request")
        # An indirect request needs more control than a plain statement.
        self.assertGreater(SocialCoder.control_demand(indirect),
                           SocialCoder.control_demand(self.coder.encode("今天天气不错")))

    def test_social_demand_reaches_the_arbiter(self):
        with tempfile.TemporaryDirectory() as directory:
            engine = CognitionEngine(directory)
            plain = engine.control({"intent": "闲聊", "message": "今天天气不错", "urgency": 0.0})
            indirect = engine.control({"intent": "闲聊", "message": "能不能帮我看看这个，方便的话", "urgency": 0.0})
            self.assertGreater(indirect.need, plain.need)
            self.assertEqual(indirect.social["function"], "request")


class Paper9and10Consciousness(unittest.TestCase):
    """All-or-none, report-invariant ignition over five integrated circuits."""

    def test_ignition_is_all_or_none(self):
        workspace = GlobalWorkspace(threshold=0.5)
        low = workspace.ignite({name: 0.1 for name in CIRCUITS})
        for _ in range(10):
            low = workspace.ignite({name: 0.1 for name in CIRCUITS})
        self.assertFalse(low.ignited)
        for _ in range(10):
            high = workspace.ignite({name: 0.9 for name in CIRCUITS})
        self.assertTrue(high.ignited)
        self.assertLess(low.activation, 0.5)
        self.assertGreater(high.activation, 0.5)

    def test_tonic_component_is_sustained(self):
        workspace = GlobalWorkspace(threshold=0.5)
        first = workspace.ignite({name: 0.9 for name in CIRCUITS})
        # A single high sample does not immediately reach the sustained level.
        self.assertLess(first.tonic, 0.9)
        for _ in range(20):
            sustained = workspace.ignite({name: 0.9 for name in CIRCUITS})
        self.assertGreater(sustained.tonic, first.tonic)

    def test_report_invariance_by_construction(self):
        import inspect
        signature = inspect.signature(GlobalWorkspace.ignite)
        self.assertNotIn("report", signature.parameters)
        self.assertNotIn("reporting", signature.parameters)

    def test_integration_measures_agreement_across_circuits(self):
        workspace = GlobalWorkspace()
        coherent = workspace.ignite({name: 0.8 for name in CIRCUITS})
        workspace2 = GlobalWorkspace()
        mixed = workspace2.ignite({**{name: 0.0 for name in CIRCUITS}, "sensory": 1.0})
        self.assertGreater(coherent.integration, mixed.integration)


class Paper13SelfModel(unittest.TestCase):
    """Self-related thought tracks the episodic store, past and future."""

    def test_self_thought_degrades_without_episodic_memory(self):
        model = SelfModel()
        rich = model.update(engram_count=40, engram_strength=40.0)
        poor = model.update(engram_count=0, engram_strength=0.0)
        self.assertGreater(rich, poor)
        self.assertLess(poor, 0.5)
        self.assertEqual(model.microstate(), "A")

    def test_past_and_future_halves(self):
        model = SelfModel()
        model.update(40, 40.0, retrospection=1.0, prospection=0.0)
        self.assertGreater(model.past, model.future)
        model.update(40, 40.0, retrospection=0.0, prospection=1.0)
        self.assertGreater(model.future, model.past)


class Paper11Groups(unittest.TestCase):
    """Identification lifts individual and collective performance, bridged."""

    def test_identification_raises_all_three_quantities(self):
        coupling = GroupCoupling()
        baseline = coupling.profile("g1")
        for _ in range(10):
            coupling.identify("g1", 1.0)
        boosted = coupling.profile("g1")
        for key in ("individual", "collective", "bridge"):
            self.assertGreater(boosted[key], baseline[key])
        self.assertGreater(coupling.coupling("g1"), coupling.coupling("unknown"))


class Paper14Flexibility(unittest.TestCase):
    """Set-shifting carries a switch cost; profiles are transdiagnostic."""

    def test_switch_cost_only_when_the_set_changes(self):
        flex = Flexibility(flexibility=0.5)
        flex.commit("AUTO")
        self.assertEqual(flex.switch_cost("AUTO"), 0.0)
        self.assertGreater(flex.switch_cost("FULL"), 0.0)

    def test_less_flexible_costs_more(self):
        typical = Flexibility(); typical.set_profile("typical")
        clinical = Flexibility(); clinical.set_profile("schizophrenia")
        typical.commit("AUTO"); clinical.commit("AUTO")
        self.assertGreater(clinical.switch_cost("FULL"), typical.switch_cost("FULL"))

    def test_adaptation(self):
        flex = Flexibility(flexibility=0.5)
        for _ in range(5):
            flex.adapt(True)
        self.assertGreater(flex.flexibility, 0.5)


class Paper2and15Distributed(unittest.TestCase):
    """Computations are local and uneven; the choice is distributed and later."""

    def test_local_computations_vs_distributed_choice(self):
        distributions = {
            "H": [0.9, 0.1],
            "MF": [0.9, 0.1],
            "MB": [0.1, 0.9],
            "WM": [0.4, 0.6],
            "E": [0.3, 0.7],
        }
        readout = DistributedEvidence.read(distributions)
        # Local computations differ per module (uneven) ...
        self.assertNotEqual(readout.computations["H"], readout.computations["WM"])
        # A peaked module is "certain" locally, a flat one is not.
        self.assertLess(readout.computations["H"], readout.computations["WM"])
        # ... while the choice is an aggregate, and a split choice coalesces later.
        self.assertAlmostEqual(readout.choice, 0.6, places=6)
        self.assertAlmostEqual(readout.latency, 0.4, places=6)
        self.assertGreater(readout.breadth, 0.0)

    def test_metacognition_confidence_and_post_error(self):
        meta = Metacognition(2)
        self.assertGreater(meta.confidence([0.95, 0.05]), meta.confidence([0.5, 0.5]))
        before = meta.adjustment()
        meta.monitor(prediction_error=1.0, outcome_good=False)
        self.assertGreater(meta.adjustment(), before)


class Integration(unittest.TestCase):
    """The circuits have to change model behaviour, not just exist."""

    def test_limbic_bias_strengthens_replay(self):
        task = ToyTask()
        strong = task.model(rng=random.Random(3))
        weak = task.model(rng=random.Random(3))
        weak.config.use_limbic_bias = False
        train(task, strong, rounds=15)
        weak.engrams = [type(e)(**e.to_dict()) for e in strong.engrams]
        weak.Q_mf = [list(row) for row in strong.Q_mf]
        before_strong = [list(row) for row in strong.Q_mf]
        before_weak = [list(row) for row in weak.Q_mf]
        strong.sleep_replay(steps=200)
        weak.sleep_replay(steps=200)
        moved_strong = sum(abs(a - b) for ra, rb in zip(strong.Q_mf, before_strong) for a, b in zip(ra, rb))
        moved_weak = sum(abs(a - b) for ra, rb in zip(weak.Q_mf, before_weak) for a, b in zip(ra, rb))
        self.assertGreater(moved_strong, moved_weak)

    def test_circuits_survive_a_round_trip(self):
        task = ToyTask()
        model = task.model(rng=random.Random(4))
        train(task, model, rounds=40)
        model.groups.identify("g1", 1.0)
        restored = MultiSystemModel.from_dict(model.to_dict())
        self.assertAlmostEqual(restored.coglinks.context_inference, model.coglinks.context_inference, places=6)
        self.assertEqual(restored.coglinks.strategy, model.coglinks.strategy)
        self.assertAlmostEqual(restored.flexibility.flexibility, model.flexibility.flexibility, places=6)
        self.assertEqual(restored.groups.identities, model.groups.identities)
        self.assertAlmostEqual(restored.self_model.self_thought, model.self_model.self_thought, places=6)

    def test_engine_reports_the_new_signals(self):
        with tempfile.TemporaryDirectory() as directory:
            engine = CognitionEngine(directory)
            outcome = engine.control({"intent": "请求", "role": "owner", "urgency": 0.8,
                                      "message": "能不能帮我一下，方便的话"})
            self.assertIn("basis", outcome.social)
            self.assertIn("individual", outcome.group)
            self.assertIn("ignited", outcome.ignition)
            self.assertIn("choice", outcome.distributed)
            self.assertGreater(outcome.eta, 0.0)
            stats = engine.stats()
            self.assertIn("context_inference", stats)
            self.assertIn("self_thought", stats)

    def test_life_state_space_is_bounded(self):
        self.assertEqual(N_STATES, 216)
        for context in ({"intent": "请求"}, {"intent": "闲聊", "role": "owner", "urgency": 1.0},
                        {"intent": "unknown", "role": "unknown", "urgency": 5.0, "memory_hits": 9,
                         "sleeping": True}):
            index = state_index(context)
            self.assertGreaterEqual(index, 0)
            self.assertLess(index, N_STATES)

    def test_ofc_embedding_survives_a_reload(self):
        """A reload must not truncate the 16-factor LIFE embedding (paper 3)."""
        with tempfile.TemporaryDirectory() as directory:
            engine = CognitionEngine(directory)
            width = engine.model.ofc.n_features
            outcome = engine.control({"intent": "提问", "role": "owner", "urgency": 0.8,
                                      "message": "帮我查一下"})
            engine.remember_decision("s1", outcome)
            engine.observe("s1", {"intent": "提问", "role": "owner"},
                           {"intent": "闲聊", "role": "owner"}, reward=1.0)
            engine.save()
            reloaded = CognitionEngine(directory)
            self.assertEqual(reloaded.model.ofc.n_features, width)
            source = state_index({"intent": "提问", "role": "owner", "urgency": 0.9, "memory_hits": 1})
            near = state_index({"intent": "提问", "role": "owner", "urgency": 0.1, "memory_hits": 1})
            far = state_index({"intent": "抱怨", "role": "other", "urgency": 0.1, "memory_hits": 0})
            self.assertGreater(reloaded.model.ofc.similarity(source, near), 0.0)
            self.assertEqual(reloaded.model.ofc.similarity(source, far), 0.0)


if __name__ == "__main__":
    unittest.main()
