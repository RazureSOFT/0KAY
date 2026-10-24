from __future__ import annotations

import math
import re
from collections import defaultdict, deque
from dataclasses import dataclass, field

EPS = 1e-9

_CJK = re.compile(r"[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\u3040-\u30ff]")
_LATIN_WORD = re.compile(r"[A-Za-z]+")
_SYLLABLE = re.compile(r"[^aeiouy]*[aeiouy]+(?:[^aeiouy]+(?![aeiouy]))?")


def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def _entropy(probabilities) -> float:
    return -sum(p * math.log(p) for p in probabilities if p > EPS)


def tokenize(text: str, unit: str = "auto") -> list[str]:
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


class WordSegmenter:

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

    def transition(self, previous: str, current: str) -> float:
        total = self.out_counts.get(previous, 0.0)
        if total <= 0:
            return 0.0
        return self.pair_counts.get((previous, current), 0.0) / total

    def predict(self, previous: str) -> dict[str, float]:
        total = self.out_counts.get(previous, 0.0)
        if total <= 0:
            return {}
        return {b: count / total for (a, b), count in self.pair_counts.items() if a == previous}

    def prediction_error(self, previous: str, actual: str) -> float:
        return 1.0 - self.transition(previous, actual)

    def observe(self, units) -> list[float]:
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
            self.pair_counts[(previous, unit)] += 1.0
            self.out_counts[previous] += 1.0
        self._trim()
        self._commit(run)
        return scores

    def _trim(self) -> None:
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


class StructuralLearner:

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

    @property
    def specialization(self) -> float:
        return 1.0 - math.exp(-self.experience / 120.0)

    @property
    def substrate(self) -> dict[str, float]:
        specialized = self.specialization
        return {"general": 1.0 - specialized, "specialized": specialized}

    def reorganize(self, steps: int = 1) -> float:
        self.experience += float(steps)
        return self.specialization

    def observe(self, units) -> None:
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


FRAMING_MODES = {
    "independent": 0.0,
    "interchanging": 0.2,
    "cognitive_determinism": 0.25,
    "weak_whorf": 0.4,
    "thinking_for_speaking": 0.6,
    "radical_connectionism": 0.75,
    "determinism": 1.0,
}


class LinguisticFraming:

    def __init__(self, mode: str = "weak_whorf", categories: dict | None = None):
        self.mode = mode if mode in FRAMING_MODES else "weak_whorf"
        self.categories = dict(categories or {})
        self.history: deque[float] = deque(maxlen=200)

    @property
    def coupling(self) -> float:
        return FRAMING_MODES.get(self.mode, 0.4)

    def set_mode(self, mode: str) -> None:
        if mode in FRAMING_MODES:
            self.mode = mode

    def nearest_category(self, dimension: str, value: float) -> float | None:
        prototypes = self.categories.get(dimension)
        if not prototypes:
            return None
        return min(prototypes, key=lambda p: abs(p - value))

    def frame(self, concept: dict, coupling: float | None = None) -> dict:
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
        return self.frame(thought, coupling=coupling)

    def distortion(self, concept: dict) -> float:
        framed = self.frame(concept)
        if not framed:
            return 0.0
        return sum(abs(framed[k] - float(v)) for k, v in concept.items()) / len(framed)

    @property
    def whorf_index(self) -> float:
        return self.coupling

    def to_dict(self) -> dict:
        return {"mode": self.mode, "categories": {k: list(v) for k, v in self.categories.items()}}

    @classmethod
    def from_dict(cls, data: dict) -> "LinguisticFraming":
        return cls(mode=data.get("mode", "weak_whorf"),
                   categories={k: list(v) for k, v in (data.get("categories") or {}).items()})


@dataclass
class LanguageConfig:

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

    def __init__(self, config: LanguageConfig | None = None):
        self.config = config or LanguageConfig()
        self.segmenter = WordSegmenter(boundary_threshold=self.config.boundary_threshold)
        self.structure = StructuralLearner()
        self.framing = LinguisticFraming(mode=self.config.framing_mode)

    def reconfigure(self, config: LanguageConfig) -> None:
        self.config = config
        self.framing.mode = (config.framing_mode if config.framing_mode in FRAMING_MODES
                             else "weak_whorf")
        self.segmenter.boundary_threshold = config.boundary_threshold

    def observe_text(self, text: str) -> dict:
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
