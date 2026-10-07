"""Language circuits - acquisition and the language-thought interface (wave 3).

Wave 1 (``circuits.py``) covered decision-making, social cognition, consciousness
and control.  Wave 2 (``affect.py``) covered the body, affect and its pathology.
This wave covers **how language is acquired from a stream, and how language
relates to thought** - the part of the literature that constrains how a persona
should *learn from* and *be shaped by* the language it is addressed in.

As always: each class implements the *computational claim*, not the biology, and
every circuit is gated by a flag on :class:`LanguageConfig` so it can be ablated.

===========================  ==================================================
Paper                        Circuit / mechanism
===========================  ==================================================
17 - Zhao et al.,            :class:`WordSegmenter` - words are carved out of a
Interspeech 2024             continuous stream by **predictive probabilistic
                             statistics**: track transitional probabilities,
                             predict the next unit, and let the prediction error
                             mark the boundary. Two stages: bottom-up
                             segmentation, then top-down prediction from the
                             words already learned.
18 - Cai et al.,             :class:`StructuralLearner` - adjacent *and*
PLOS Biology 2024            **non-adjacent** dependency learning, with
                             **functional reorganization**: the same ability is
                             supported first by a broad, general substrate and
                             later by a selective, specialised one.
19 - Zenodo 8139192 (2023)   :class:`LinguisticFraming` - the language-thought
                             interface as a *bottleneck* of obligatory
                             categories; strength interpolates the whole
                             theoretical spectrum.
20 - Birjandi & Sabah,       :class:`LinguisticFraming` (same class, the debate's
BRAIN 2012                   positions become named coupling modes: Independent
                             Theory, Sapir-Whorf, Cognitive Determinism,
                             Interchanging Roles, Radical Connectionism,
                             Thinking for Speaking)
===========================  ==================================================
"""
from __future__ import annotations

import math
import re
from collections import defaultdict, deque
from dataclasses import dataclass, field
from .common import clamp as _clamp

EPS = 1e-9

_CJK = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff]")
_LATIN_WORD = re.compile(r"[A-Za-z]+")
_SYLLABLE = re.compile(r"[^aeiouy]*[aeiouy]+(?:[^aeiouy]+(?![aeiouy]))?")




def _entropy(probabilities) -> float:
    return -sum(p * math.log(p) for p in probabilities if p > EPS)


def tokenize(text: str, unit: str = "auto") -> list[str]:
    """Split text into the units the segmenter treats as syllables.

    CJK characters are already syllable-sized, so ``"char"`` is right for them;
    Latin words are split with a rough onset/nucleus/coda rule.  ``"auto"``
    picks per run of script, which is what a bilingual persona needs.
    """
    text = str(text or "")
    if unit == "char":
        return [ch for ch in text if not ch.isspace()]
    if unit == "syllable":
        return _SYLLABLE.findall(text.lower())
    units: list[str] = []
    for chunk in re.findall(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff]+|[A-Za-z]+", text):
        if _CJK.match(chunk):
            units.extend(chunk)
        else:
            units.extend(_SYLLABLE.findall(chunk.lower()))
    return units


# ==========================================================================
# 17. Predictive probabilistic statistics in word segmentation
# ==========================================================================
class WordSegmenter:
    """Carve words out of a continuous stream with transitional probabilities.

    Zhao et al. (Interspeech 2024) had listeners hear streams of novel
    tri-syllable words versus random syllables.  The middle temporal gyrus did
    the *initial* segmentation; the anterior temporal lobe did the *top-down
    prediction* from already-established word structures.  So segmentation is
    two-staged and predictive: you track ``P(syllable | previous syllable)``,
    predict the next unit, and the **prediction error marks the boundary**.

    Concretely, within a word the transitional probability is high; across a
    word boundary it dips.  A boundary score is therefore ``1 - TP`` computed
    *before* the pair is counted (predict, then update) - that ordering is what
    makes it predictive rather than retrospective.
    """

    def __init__(self, min_observations: int = 1, boundary_threshold: float = 0.6,
                 max_lexicon: int = 2000, max_pairs: int = 20000):
        self.min_observations = min_observations
        self.boundary_threshold = boundary_threshold
        self.max_lexicon = max_lexicon
        self.max_pairs = max_pairs
        self.pair_counts: dict[tuple[str, str], float] = defaultdict(float)
        self.out_counts: dict[str, float] = defaultdict(float)
        self.lexicon: dict[str, float] = {}
        self.boundary_history: deque[float] = deque(maxlen=500)
        self.units_seen = 0

    # -- transitional probability -----------------------------------------
    def transition(self, previous: str, current: str) -> float:
        """``P(current | previous)`` from the counts accumulated so far."""
        total = self.out_counts.get(previous, 0.0)
        if total <= 0:
            return 0.0
        return self.pair_counts.get((previous, current), 0.0) / total

    def predict(self, previous: str) -> dict[str, float]:
        """Distribution over the next unit given the previous one."""
        total = self.out_counts.get(previous, 0.0)
        if total <= 0:
            return {}
        return {b: count / total for (a, b), count in self.pair_counts.items() if a == previous}

    def prediction_error(self, previous: str, actual: str) -> float:
        """``1 - P(actual | previous)``; high at word boundaries."""
        return 1.0 - self.transition(previous, actual)

    # -- online segmentation ----------------------------------------------
    def observe(self, units) -> list[float]:
        """Feed a stream of units; return a boundary score after each position.

        The score at position *i* is computed from counts that exclude the pair
        ``(i-1, i)`` itself, so the first time a pair is seen the score is 1.0
        (a novel transition is a boundary until proven otherwise).
        """
        units = list(units)
        scores: list[float] = []
        run: list[str] = []
        for index, unit in enumerate(units):
            self.units_seen += 1
            if index == 0:
                run = [unit]
                scores.append(0.0)
                continue
            previous = units[index - 1]
            score = self.prediction_error(previous, unit)
            scores.append(score)
            self.boundary_history.append(score)
            if score >= self.boundary_threshold:
                self._commit(run)
                run = [unit]
            else:
                run.append(unit)
            # update *after* scoring - predict first, then learn
            self.pair_counts[(previous, unit)] += 1.0
            self.out_counts[previous] += 1.0
        self._trim()
        self._commit(run)
        return scores

    def _trim(self) -> None:
        """Bound the transition tables (they are otherwise unbounded dicts)."""
        if len(self.pair_counts) > self.max_pairs:
            keep = sorted(self.pair_counts.items(), key=lambda kv: kv[1], reverse=True)[:self.max_pairs]
            self.pair_counts = defaultdict(float, dict(keep))
        if len(self.out_counts) > self.max_pairs:
            keep = sorted(self.out_counts.items(), key=lambda kv: kv[1], reverse=True)[:self.max_pairs]
            self.out_counts = defaultdict(float, dict(keep))

    def _commit(self, run: list[str]) -> None:
        if len(run) < 2:
            return
        word = "".join(run)
        self.lexicon[word] = self.lexicon.get(word, 0.0) + 1.0
        if len(self.lexicon) > self.max_lexicon:
            weakest = min(self.lexicon, key=self.lexicon.get)
            self.lexicon.pop(weakest, None)

    def segment(self, units) -> list[str]:
        """Return the current best segmentation of a stream, without learning."""
        units = list(units)
        words, run = [], []
        for index, unit in enumerate(units):
            if index == 0:
                run = [unit]
                continue
            if self.prediction_error(units[index - 1], unit) >= self.boundary_threshold:
                words.append("".join(run))
                run = [unit]
            else:
                run.append(unit)
        words.append("".join(run))
        return [w for w in words if w]

    def words(self, limit: int = 20) -> list[tuple[str, float]]:
        """The lexicon, strongest first."""
        return sorted(self.lexicon.items(), key=lambda kv: kv[1], reverse=True)[:limit]

    @property
    def mean_boundary_error(self) -> float:
        if not self.boundary_history:
            return 0.0
        return sum(self.boundary_history) / len(self.boundary_history)

    def to_dict(self) -> dict:
        return {"pairs": {f"{a}\t{b}": v for (a, b), v in self.pair_counts.items()},
                "outs": dict(self.out_counts), "lexicon": dict(self.lexicon),
                "units_seen": self.units_seen}

    @classmethod
    def from_dict(cls, data: dict) -> "WordSegmenter":
        segmenter = cls()
        for key, value in (data.get("pairs") or {}).items():
            a, b = key.split("\t")
            segmenter.pair_counts[(a, b)] = float(value)
        segmenter.out_counts = defaultdict(float, {k: float(v) for k, v in (data.get("outs") or {}).items()})
        segmenter.lexicon = {k: float(v) for k, v in (data.get("lexicon") or {}).items()}
        segmenter.units_seen = int(data.get("units_seen", 0))
        return segmenter


# ==========================================================================
# 18. Artificial grammar learning and its functional reorganization
# ==========================================================================
class StructuralLearner:
    """Learn adjacent *and* non-adjacent dependencies; reorganize with experience.

    Cai et al. (PLOS Biology 2024) showed neonates already detect **non-adjacent
    dependencies** (``A _ B`` with a variable element between), and that the
    supporting substrate **reorganizes** across the first half year: neonates
    rely on a broad, general left-prefrontal mechanism, while 6-7 month olds
    recruit specialised left fronto-temporo-parietal language areas.

    Computationally the interesting claims are (a) the relation being learned is
    *non-adjacent*, so a plain bigram model is insufficient, and (b) the same
    ability is served by a **broad then selective** substrate - early learning
    generalises widely, later learning is sharply tuned.
    """

    def __init__(self, experience: float = 0.0, general_rate: float = 0.5,
                 specialized_rate: float = 0.15, max_pairs: int = 20000, max_units: int = 8000):
        self.experience = float(experience)
        self.general_rate = general_rate
        self.specialized_rate = specialized_rate
        self.max_pairs = max_pairs
        self.max_units = max_units
        self.adjacent: dict[tuple[str, str], float] = defaultdict(float)
        self.non_adjacent: dict[tuple[str, str], float] = defaultdict(float)
        self.out_adjacent: dict[str, float] = defaultdict(float)
        self.out_non_adjacent: dict[str, float] = defaultdict(float)
        self.observations = 0

    # -- substrate ---------------------------------------------------------
    @property
    def specialization(self) -> float:
        """How selective the current substrate is, in [0, 1].

        Grows with experience on a saturating curve: at birth the substrate is
        broad (low selectivity), by ~6 months it is sharply tuned.
        """
        return 1.0 - math.exp(-self.experience / 120.0)

    @property
    def substrate(self) -> dict[str, float]:
        specialized = self.specialization
        return {"general": 1.0 - specialized, "specialized": specialized}

    def reorganize(self, steps: int = 1) -> float:
        """Advance development; returns the new specialization index."""
        self.experience += float(steps)
        return self.specialization

    # -- learning ----------------------------------------------------------
    def observe(self, units) -> None:
        """Count adjacent pairs and gap-1 non-adjacent pairs."""
        units = list(units)
        for index in range(len(units) - 1):
            a, b = units[index], units[index + 1]
            self.adjacent[(a, b)] += 1.0
            self.out_adjacent[a] += 1.0
        for index in range(len(units) - 2):
            a, b = units[index], units[index + 2]
            self.non_adjacent[(a, b)] += 1.0
            self.out_non_adjacent[a] += 1.0
        self.observations += len(units)
        self.experience += 1.0
        self._trim()

    def _trim(self) -> None:
        """Bound the dependency and outgoing-count tables."""
        for name, cap in (("adjacent", self.max_pairs), ("non_adjacent", self.max_pairs),
                          ("out_adjacent", self.max_units), ("out_non_adjacent", self.max_units)):
            table = getattr(self, name)
            if len(table) > cap:
                keep = sorted(table.items(), key=lambda kv: kv[1], reverse=True)[:cap]
                setattr(self, name, defaultdict(float, dict(keep)))

    def adjacent_strength(self, a: str, b: str) -> float:
        total = self.out_adjacent.get(a, 0.0)
        return self.adjacent.get((a, b), 0.0) / total if total > 0 else 0.0

    def non_adjacent_strength(self, a: str, b: str) -> float:
        total = self.out_non_adjacent.get(a, 0.0)
        return self.non_adjacent.get((a, b), 0.0) / total if total > 0 else 0.0

    def conforms(self, units) -> float:
        """Score how grammatical a sequence is under the current substrate.

        The general substrate reads local transitions (broad); the specialised
        one reads the non-adjacent relation (selective).  The mix *is* the
        functional reorganization.
        """
        units = list(units)
        if len(units) < 2:
            return 0.0
        adjacent = sum(self.adjacent_strength(units[i], units[i + 1])
                       for i in range(len(units) - 1)) / (len(units) - 1)
        non_adjacent = 0.0
        if len(units) >= 3:
            non_adjacent = sum(self.non_adjacent_strength(units[i], units[i + 2])
                               for i in range(len(units) - 2)) / (len(units) - 2)
        weights = self.substrate
        return _clamp(weights["general"] * adjacent + weights["specialized"] * non_adjacent)

    def detect_violation(self, units) -> float:
        """1 = clearly ungrammatical, 0 = clearly grammatical."""
        return _clamp(1.0 - self.conforms(units))

    def to_dict(self) -> dict:
        return {"experience": self.experience, "observations": self.observations,
                "adjacent": {f"{a}\t{b}": v for (a, b), v in self.adjacent.items()},
                "non_adjacent": {f"{a}\t{b}": v for (a, b), v in self.non_adjacent.items()},
                "out_adjacent": dict(self.out_adjacent),
                "out_non_adjacent": dict(self.out_non_adjacent)}

    @classmethod
    def from_dict(cls, data: dict) -> "StructuralLearner":
        learner = cls(experience=float(data.get("experience", 0.0)))
        learner.observations = int(data.get("observations", 0))
        for key, value in (data.get("adjacent") or {}).items():
            a, b = key.split("\t")
            learner.adjacent[(a, b)] = float(value)
        for key, value in (data.get("non_adjacent") or {}).items():
            a, b = key.split("\t")
            learner.non_adjacent[(a, b)] = float(value)
        learner.out_adjacent = defaultdict(float, {k: float(v) for k, v in (data.get("out_adjacent") or {}).items()})
        learner.out_non_adjacent = defaultdict(float, {k: float(v) for k, v in (data.get("out_non_adjacent") or {}).items()})
        return learner


# ==========================================================================
# 19/20. The language-thought interface
# ==========================================================================
# The named positions from Birjandi & Sabah's review, mapped to a coupling
# strength.  0 = thought is entirely independent of language; 1 = language
# fully determines the categories thought may use.
FRAMING_MODES = {
    "independent": 0.0,             # Chomsky: separate modules
    "interchanging": 0.2,           # Vygotsky: separate then merge (inner speech)
    "cognitive_determinism": 0.25,  # Piaget: thought precedes language
    "weak_whorf": 0.4,              # Sapir-Whorf, weak form
    "thinking_for_speaking": 0.6,   # Slobin: online encoding bias
    "radical_connectionism": 0.75,  # O'Brien & Opie: language scaffolds thought
    "determinism": 1.0,             # Sapir-Whorf, strong form
}


class LinguisticFraming:
    """The language-thought interface as a bottleneck of obligatory categories.

    Papers 19 and 20 both circle the same question - does language come before
    thought, or thought before language - and paper 20 lays out the whole
    spectrum of answers.  The one computation that can represent *all* of them
    is a **bottleneck**: a language forces certain categories to be marked
    (obligatory distinctions), so whatever passes through is quantised onto
    those categories.  A single coupling strength interpolates from "thought is
    untouched" (Chomsky) to "thought is only the categories the language
    supplies" (strong Whorf).

    ``thinking_for_speaking`` is the interesting middle case: the bias is
    applied *online*, at the moment of encoding for expression, so it shapes the
    framing of a message without permanently overwriting the underlying concept.
    """

    def __init__(self, mode: str = "weak_whorf", categories: dict | None = None):
        self.mode = mode if mode in FRAMING_MODES else "weak_whorf"
        self.categories = dict(categories or {})
        self.history: deque[float] = deque(maxlen=200)

    @property
    def coupling(self) -> float:
        """How strongly language constrains thought, in [0, 1]."""
        return FRAMING_MODES.get(self.mode, 0.4)

    def set_mode(self, mode: str) -> None:
        if mode in FRAMING_MODES:
            self.mode = mode

    def nearest_category(self, dimension: str, value: float) -> float | None:
        """The language's closest obligatory category for this value."""
        prototypes = self.categories.get(dimension)
        if not prototypes:
            return None
        return min(prototypes, key=lambda p: abs(p - value))

    def frame(self, concept: dict, coupling: float | None = None) -> dict:
        """Quantise a concept onto the language's categories.

        With coupling 0 the concept passes through unchanged; with coupling 1 it
        is snapped entirely onto the nearest obligatory category.
        """
        weight = self.coupling if coupling is None else _clamp(coupling)
        framed = {}
        for dimension, value in (concept or {}).items():
            prototype = self.nearest_category(dimension, float(value))
            if prototype is None:
                framed[dimension] = float(value)
            else:
                framed[dimension] = (1.0 - weight) * float(value) + weight * float(prototype)
        self.history.append(weight)
        return framed

    def encode_for_speech(self, thought: dict, coupling: float | None = None) -> dict:
        """Thinking-for-Speaking: the *online* encoding bias, not a permanent shift.

        The underlying thought is untouched; only the version handed to
        expression is reframed - which is exactly Slobin's claim, and the reason
        this is separable from :meth:`frame`.
        """
        return self.frame(thought, coupling=coupling)

    def distortion(self, concept: dict) -> float:
        """Mean absolute shift the language imposes on a concept, in [0, 1]."""
        framed = self.frame(concept)
        if not framed:
            return 0.0
        return sum(abs(framed[k] - float(v)) for k, v in concept.items()) / len(framed)

    @property
    def whorf_index(self) -> float:
        """A single number for "how Whorfian is the current setting"."""
        return self.coupling

    def to_dict(self) -> dict:
        return {"mode": self.mode, "categories": {k: list(v) for k, v in self.categories.items()}}

    @classmethod
    def from_dict(cls, data: dict) -> "LinguisticFraming":
        return cls(mode=data.get("mode", "weak_whorf"),
                   categories={k: list(v) for k, v in (data.get("categories") or {}).items()})


# ==========================================================================
# CONFIG + FAÇADE
# ==========================================================================
@dataclass
class LanguageConfig:
    """Ablation switches for the language circuits (EASE-style modularity)."""

    enabled: bool = True
    use_segmenter: bool = True
    use_structure: bool = True
    use_framing: bool = True
    framing_mode: str = "weak_whorf"
    boundary_threshold: float = 0.6

    def to_dict(self) -> dict:
        return {k: getattr(self, k) for k in self.__dataclass_fields__}

    @classmethod
    def from_dict(cls, data: dict) -> "LanguageConfig":
        config = cls()
        for key, value in (data or {}).items():
            if hasattr(config, key):
                setattr(config, key, value)
        return config

    def ablate(self, **flags) -> "LanguageConfig":
        clone = LanguageConfig.from_dict(self.to_dict())
        for key, value in flags.items():
            if hasattr(clone, key):
                setattr(clone, key, value)
        return clone


class LanguageSystem:
    """Composes the acquisition + framing circuits behind one façade.

    ``observe_text`` pushes a message in (segmenting it and updating the
    structural learner); ``frame`` runs a concept through the language's
    obligatory categories; ``context`` returns the read-out the engine folds
    into the prompt.  With ``config.enabled = False`` every method is a no-op.
    """

    def __init__(self, config: LanguageConfig | None = None):
        self.config = config or LanguageConfig()
        self.segmenter = WordSegmenter(boundary_threshold=self.config.boundary_threshold)
        self.structure = StructuralLearner()
        self.framing = LinguisticFraming(mode=self.config.framing_mode)

    def reconfigure(self, config: LanguageConfig) -> None:
        """Apply a new config in place, preserving the learned lexicon/grammar."""
        self.config = config
        self.framing.mode = (config.framing_mode if config.framing_mode in FRAMING_MODES
                             else "weak_whorf")
        self.segmenter.boundary_threshold = config.boundary_threshold

    def observe_text(self, text: str) -> dict:
        """Learn from one incoming message."""
        if not self.config.enabled:
            return {}
        units = tokenize(text)
        if len(units) < 2:
            return {"units": len(units), "boundaries": 0, "novel_words": []}
        before = set(self.segmenter.lexicon)
        boundaries = self.segmenter.observe(units) if self.config.use_segmenter else []
        if self.config.use_structure:
            self.structure.observe(units)
        novel = [w for w in self.segmenter.lexicon if w not in before]
        return {"units": len(units),
                "boundaries": sum(1 for s in boundaries if s >= self.config.boundary_threshold),
                "novel_words": novel}

    def segment(self, text: str) -> list[str]:
        if not self.config.enabled or not self.config.use_segmenter:
            return []
        return self.segmenter.segment(tokenize(text))

    def frame(self, concept: dict, coupling: float | None = None) -> dict:
        if not self.config.enabled or not self.config.use_framing:
            return dict(concept or {})
        return self.framing.frame(concept, coupling=coupling)

    def conforms(self, text: str) -> float:
        if not self.config.enabled or not self.config.use_structure:
            return 0.0
        return self.structure.conforms(tokenize(text))

    def context(self) -> dict:
        """Read-out for the prompt and the state snapshot."""
        if not self.config.enabled:
            return {"enabled": False, "lexicon_size": 0, "top_words": [], "specialization": 0.0,
                    "whorf_index": 0.0, "mean_boundary_error": 0.0}
        return {"enabled": True,
                "lexicon_size": len(self.segmenter.lexicon),
                "top_words": [w for w, _ in self.segmenter.words(8)],
                "mean_boundary_error": round(self.segmenter.mean_boundary_error, 4),
                "specialization": round(self.structure.specialization, 4),
                "substrate": self.structure.substrate,
                "whorf_index": self.framing.whorf_index,
                "framing_mode": self.framing.mode}

    def to_dict(self) -> dict:
        return {"config": self.config.to_dict(), "segmenter": self.segmenter.to_dict(),
                "structure": self.structure.to_dict(), "framing": self.framing.to_dict()}

    @classmethod
    def from_dict(cls, data: dict) -> "LanguageSystem":
        system = cls(LanguageConfig.from_dict((data or {}).get("config") or {}))
        if (data or {}).get("segmenter"):
            system.segmenter = WordSegmenter.from_dict(data["segmenter"])
        if (data or {}).get("structure"):
            system.structure = StructuralLearner.from_dict(data["structure"])
        if (data or {}).get("framing"):
            system.framing = LinguisticFraming.from_dict(data["framing"])
        return system
