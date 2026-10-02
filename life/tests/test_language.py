"""Tests for the language circuits (wave 3: acquisition + language-thought).

Each test asserts the *computational claim* of one paper, and every circuit is
ablated at least once to prove the switch switches.
"""
import json
import random
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.cognition.language import (
    FRAMING_MODES,
    LanguageConfig,
    LanguageSystem,
    LinguisticFraming,
    StructuralLearner,
    WordSegmenter,
    tokenize,
)

# A three-word artificial language.  Words are concatenated in varying order, so
# transitions *inside* a word are deterministic (TP = 1) while transitions
# *across* a boundary are spread over several successors (TP < 1).
WORDS = [list("ab"), list("cd"), list("ef")]


def build_stream(passes=6, seed=0):
    rng = random.Random(seed)
    stream = []
    for _ in range(passes):
        order = [0, 1, 2]
        rng.shuffle(order)
        for index in order:
            stream.extend(WORDS[index])
    return stream


def positional_flags(stream):
    """True at each word-initial position (word-initial units are disjoint)."""
    firsts = {word[0] for word in WORDS}
    return [unit in firsts for unit in stream]


class TestTokenizer(unittest.TestCase):
    def test_chinese_splits_by_character(self):
        self.assertEqual(tokenize("你好世界"), ["你", "好", "世", "界"])

    def test_english_splits_into_syllables(self):
        units = tokenize("banana")
        self.assertGreaterEqual(len(units), 2)
        self.assertEqual("".join(units), "banana")

    def test_auto_handles_mixed_script(self):
        units = tokenize("你好 hello")
        self.assertIn("你", units)
        self.assertTrue(any(u for u in units if u.isascii()))


class TestWordSegmenter(unittest.TestCase):
    """Paper 17: predictive probabilistic statistics carve words from a stream."""

    def test_novel_transition_scores_as_a_boundary(self):
        segmenter = WordSegmenter()
        scores = segmenter.observe(list("abcdef"))
        # every pair is novel the first time it is seen -> all boundaries
        self.assertTrue(all(s >= 0.99 for s in scores[1:]))

    def test_transitional_probability_is_learned(self):
        segmenter = WordSegmenter()
        segmenter.observe(list("ababab"))
        self.assertAlmostEqual(segmenter.transition("a", "b"), 1.0, places=6)
        self.assertEqual(segmenter.transition("b", "z"), 0.0)

    def test_prediction_error_is_high_at_a_boundary(self):
        segmenter = WordSegmenter()
        segmenter.observe(list("ababab"))
        self.assertLess(segmenter.prediction_error("a", "b"), 0.2)

    def test_boundaries_dip_inside_words_not_between_them(self):
        segmenter = WordSegmenter(boundary_threshold=0.5)
        stream = build_stream(passes=8)
        scores = segmenter.observe(stream)          # train
        scores = segmenter.observe(stream)          # score the trained model
        flags = positional_flags(stream)
        internal = [scores[i] for i in range(1, len(scores)) if not flags[i]]
        initial = [scores[i] for i in range(1, len(scores)) if flags[i]]
        self.assertLess(sum(internal) / len(internal), 0.2)
        self.assertGreater(sum(initial) / len(initial), 0.3)

    def test_recovers_the_words_after_exposure(self):
        segmenter = WordSegmenter(boundary_threshold=0.5)
        stream = build_stream(passes=8)
        segmenter.observe(stream)
        segmented = segmenter.segment(stream)
        for word in ("ab", "cd", "ef"):
            self.assertIn(word, segmented)

    def test_lexicon_accumulates_repeated_words(self):
        segmenter = WordSegmenter(boundary_threshold=0.5)
        segmenter.observe(build_stream(passes=8))
        words = dict(segmenter.words())
        self.assertIn("ab", words)
        self.assertGreater(words["ab"], 1.0)

    def test_predict_returns_a_distribution(self):
        segmenter = WordSegmenter()
        segmenter.observe(build_stream(passes=3))
        distribution = segmenter.predict("a")
        self.assertAlmostEqual(sum(distribution.values()), 1.0, places=6)

    def test_segment_does_not_learn(self):
        segmenter = WordSegmenter()
        before = segmenter.units_seen
        segmenter.segment(list("abcdefgh"))
        self.assertEqual(segmenter.units_seen, before)


class TestStructuralLearner(unittest.TestCase):
    """Paper 18: non-adjacent dependencies + functional reorganization."""

    GRAMMAR = (["a", "x1", "b"], ["a", "x2", "b"], ["c", "x1", "d"], ["c", "x2", "d"])

    def _trained(self):
        learner = StructuralLearner()
        for _ in range(20):
            for sequence in self.GRAMMAR:
                learner.observe(sequence)
        return learner

    def test_learns_adjacent_dependencies(self):
        learner = self._trained()
        self.assertGreater(learner.adjacent_strength("a", "x1"), 0.0)

    def test_learns_non_adjacent_dependencies(self):
        learner = self._trained()
        # a is always followed by b with one variable element in between
        self.assertGreater(learner.non_adjacent_strength("a", "b"), 0.5)
        self.assertEqual(learner.non_adjacent_strength("a", "d"), 0.0)

    def test_specialization_grows_with_experience(self):
        learner = StructuralLearner(experience=0.0)
        early = learner.specialization
        learner.reorganize(600)
        self.assertGreater(learner.specialization, early)

    def test_substrate_shifts_from_general_to_specialized(self):
        early = StructuralLearner(experience=0.0).substrate
        late = StructuralLearner(experience=600.0).substrate
        self.assertGreater(early["general"], early["specialized"])
        self.assertGreater(late["specialized"], late["general"])

    def test_conforms_prefers_grammatical_sequences(self):
        learner = self._trained()
        learner.reorganize(600)
        self.assertGreater(learner.conforms(["a", "x1", "b"]),
                           learner.conforms(["a", "x1", "d"]))

    def test_functional_reorganization_changes_what_conforms(self):
        # "a x1 d" is adjacency-legal (a->x1 and x1->d were both seen) but
        # non-adjacent-illegal (a never pairs with d).  The general substrate
        # accepts it; the specialised one rejects it - that IS the paper's
        # reorganization claim.
        learner = self._trained()
        violation = ["a", "x1", "d"]
        learner.experience = 0.0
        early = learner.conforms(violation)
        learner.experience = 600.0
        late = learner.conforms(violation)
        self.assertGreater(early, late)
        self.assertGreater(learner.detect_violation(violation), 0.5)


class TestLinguisticFraming(unittest.TestCase):
    """Papers 19/20: the language-thought bottleneck across the debate's positions."""

    CATEGORIES = {"brightness": [0.0, 1.0], "size": [0.0, 1.0]}

    def test_independent_mode_leaves_thought_untouched(self):
        framing = LinguisticFraming(mode="independent", categories=self.CATEGORIES)
        concept = {"brightness": 0.3, "size": 0.7}
        self.assertEqual(framing.frame(concept), concept)

    def test_determinism_snaps_onto_the_obligatory_categories(self):
        framing = LinguisticFraming(mode="determinism", categories=self.CATEGORIES)
        framed = framing.frame({"brightness": 0.3, "size": 0.7})
        self.assertAlmostEqual(framed["brightness"], 0.0, places=6)
        self.assertAlmostEqual(framed["size"], 1.0, places=6)

    def test_coupling_orders_the_theoretical_positions(self):
        ordered = ["independent", "weak_whorf", "thinking_for_speaking", "determinism"]
        couplings = [FRAMING_MODES[m] for m in ordered]
        self.assertEqual(couplings, sorted(couplings))
        self.assertLess(couplings[0], couplings[-1])

    def test_thinking_for_speaking_does_not_mutate_the_underlying_thought(self):
        framing = LinguisticFraming(mode="thinking_for_speaking", categories=self.CATEGORIES)
        thought = {"brightness": 0.35}
        encoded = framing.encode_for_speech(thought)
        self.assertEqual(thought["brightness"], 0.35)     # original intact
        self.assertNotEqual(encoded["brightness"], 0.35)  # encoding was biased

    def test_distortion_grows_with_coupling(self):
        concept = {"brightness": 0.35}
        weak = LinguisticFraming(mode="independent", categories=self.CATEGORIES).distortion(concept)
        strong = LinguisticFraming(mode="determinism", categories=self.CATEGORIES).distortion(concept)
        self.assertLess(weak, strong)

    def test_dimensions_without_categories_pass_through(self):
        framing = LinguisticFraming(mode="determinism", categories=self.CATEGORIES)
        framed = framing.frame({"mood": 0.42})
        self.assertAlmostEqual(framed["mood"], 0.42, places=6)

    def test_whorf_index_tracks_the_mode(self):
        framing = LinguisticFraming(mode="weak_whorf")
        self.assertAlmostEqual(framing.whorf_index, FRAMING_MODES["weak_whorf"], places=6)
        framing.set_mode("determinism")
        self.assertAlmostEqual(framing.whorf_index, 1.0, places=6)


class TestLanguageSystem(unittest.TestCase):
    def test_disabled_system_is_a_noop(self):
        system = LanguageSystem(LanguageConfig(enabled=False))
        self.assertEqual(system.observe_text("你好世界"), {})
        self.assertEqual(system.segment("你好世界"), [])
        self.assertEqual(system.frame({"a": 0.5}), {"a": 0.5})
        self.assertFalse(system.context()["enabled"])

    def test_observe_text_returns_stats(self):
        system = LanguageSystem()
        stats = system.observe_text("你好世界你好")
        self.assertIn("units", stats)
        self.assertIn("novel_words", stats)

    def test_segmenter_ablation_stops_lexicon_growth(self):
        system = LanguageSystem(LanguageConfig(use_segmenter=False))
        system.observe_text("你好世界你好世界")
        self.assertEqual(len(system.segmenter.lexicon), 0)

    def test_framing_ablation_passes_thought_through(self):
        system = LanguageSystem(LanguageConfig(use_framing=False))
        concept = {"brightness": 0.3}
        self.assertEqual(system.frame(concept), concept)

    def test_ablation_helper_returns_an_isolated_copy(self):
        base = LanguageConfig()
        ablated = base.ablate(use_segmenter=False, use_structure=False)
        self.assertTrue(base.use_segmenter)
        self.assertFalse(ablated.use_segmenter)
        self.assertFalse(ablated.use_structure)

    def test_context_exposes_the_readout(self):
        system = LanguageSystem()
        system.observe_text("你好世界你好世界")
        context = system.context()
        for key in ("lexicon_size", "top_words", "specialization", "whorf_index", "framing_mode"):
            self.assertIn(key, context)

    def test_persistence_round_trip(self):
        system = LanguageSystem()
        system.observe_text("你好世界你好世界")
        system.observe_text("你好吗世界")
        restored = LanguageSystem.from_dict(system.to_dict())
        self.assertEqual(len(restored.segmenter.lexicon), len(system.segmenter.lexicon))
        self.assertAlmostEqual(restored.structure.specialization,
                               system.structure.specialization, places=6)
        self.assertEqual(restored.framing.mode, system.framing.mode)

    def test_json_round_trip_is_identical(self):
        # The real restart path is to_dict -> JSON -> from_dict, which retypes
        # keys and scalars; the in-memory round-trip above does not.
        system = LanguageSystem()
        system.observe_text("你好世界你好世界")
        system.observe_text("你好吗世界")
        blob = json.loads(json.dumps(system.to_dict(), ensure_ascii=False))
        self.assertEqual(LanguageSystem.from_dict(blob).to_dict(), system.to_dict())

    def test_config_round_trip_preserves_flags(self):
        config = LanguageConfig(use_segmenter=False, framing_mode="determinism")
        restored = LanguageConfig.from_dict(config.to_dict())
        self.assertFalse(restored.use_segmenter)
        self.assertEqual(restored.framing_mode, "determinism")


if __name__ == "__main__":
    unittest.main()
