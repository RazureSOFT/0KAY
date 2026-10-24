from __future__ import annotations

import math
from collections import deque
from dataclasses import dataclass, field

EPS = 1e-9


def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


class TemporalDiscounting:

    def __init__(self, k: float = 0.1, risk_aversion: float = 0.5,
                 coupling: float = 0.5, deadline_awareness: float = 1.0):
        self.k = max(0.0, k)
        self.risk_aversion = _clamp(risk_aversion)
        self.coupling = _clamp(coupling)
        self.deadline_awareness = _clamp(deadline_awareness)
        self.total_turns = 0
        self.turn = 0
        self.perceived_remaining = 1.0
        self.feedback = False
        self.closure_events: deque[float] = deque(maxlen=100)

    def value(self, amount: float, delay: float, k: float | None = None) -> float:
        rate = self.k if k is None else max(0.0, k)
        return float(amount) / (1.0 + rate * max(0.0, float(delay)))

    def choose(self, sooner: tuple, later: tuple) -> str:
        return "sooner" if self.value(*sooner) >= self.value(*later) else "later"

    def patience(self) -> float:
        return _clamp(1.0 / (1.0 + self.k))

    def coupled_risk(self) -> float:
        shared = 0.5 * self.patience() + 0.5 * (1.0 - self.risk_aversion)
        return _clamp((1.0 - self.coupling) * self.risk_aversion + self.coupling * (1.0 - shared))

    def start_deadline(self, total_turns: int, remaining_feedback: bool = False) -> None:
        self.total_turns = max(1, int(total_turns))
        self.turn = 0
        self.feedback = bool(remaining_feedback)
        self.perceived_remaining = 1.0

    def tick_deadline(self) -> float:
        self.turn += 1
        actual_remaining = max(0.0, (self.total_turns - self.turn) / self.total_turns)
        if getattr(self, "feedback", False):
            self.perceived_remaining = actual_remaining
        else:
            self.perceived_remaining += 0.05 * (actual_remaining - self.perceived_remaining)
        return self.urgency()

    def urgency(self) -> float:
        return _clamp(1.0 - self.perceived_remaining)

    def closure_probability(self) -> float:
        return _clamp(self.urgency() * (0.4 + 0.6 * self.deadline_awareness))

    def to_dict(self) -> dict:
        return {"k": self.k, "risk_aversion": self.risk_aversion, "coupling": self.coupling,
                "deadline_awareness": self.deadline_awareness, "total_turns": self.total_turns,
                "turn": self.turn, "perceived_remaining": self.perceived_remaining,
                "feedback": bool(getattr(self, "feedback", False))}

    @classmethod
    def from_dict(cls, data: dict) -> "TemporalDiscounting":
        obj = cls(k=float(data.get("k", 0.1)), risk_aversion=float(data.get("risk_aversion", 0.5)),
                  coupling=float(data.get("coupling", 0.5)),
                  deadline_awareness=float(data.get("deadline_awareness", 1.0)))
        obj.total_turns = int(data.get("total_turns", 0))
        obj.turn = int(data.get("turn", 0))
        obj.perceived_remaining = float(data.get("perceived_remaining", 1.0))
        obj.feedback = bool(data.get("feedback", False))
        return obj


class NarrativeIdentity:

    MAX_MEMORIES = 240

    def __init__(self, redemption_bias: float = 0.3):
        self.redemption_bias = _clamp(redemption_bias)
        self.memories: list[dict] = []
        self.anchor: dict = {}
        self.reconstructions = 0

    def add_memory(self, event: str, valence: float, redemption: bool | None = None) -> dict:
        if redemption is None:
            redemption = bool(valence < 0 and self.redemption_bias > 0.5)
        memory = {"event": str(event), "valence": float(valence), "redemption": bool(redemption)}
        self.memories.append(memory)
        if len(self.memories) > self.MAX_MEMORIES:
            del self.memories[: len(self.memories) - self.MAX_MEMORIES]
        self._update_anchor(memory)
        return memory

    def _update_anchor(self, memory: dict) -> None:
        self.anchor["count"] = self.anchor.get("count", 0) + 1
        if memory["redemption"]:
            self.anchor["redemptions"] = self.anchor.get("redemptions", 0) + 1
        tone = self.anchor.get("tone", 0.0)
        self.anchor["tone"] = tone + (float(memory["valence"]) - tone) / self.anchor["count"]

    @property
    def redemptive_tone(self) -> float:
        if not self.memories:
            return 0.0
        return sum(1 for m in self.memories if m["redemption"]) / len(self.memories)

    @property
    def coherence(self) -> float:
        if len(self.memories) < 2:
            return 1.0
        positives = sum(1 for m in self.memories if m["valence"] > 0)
        share = max(positives, len(self.memories) - positives) / len(self.memories)
        return _clamp((share - 0.5) * 2.0)

    @property
    def anchor_strength(self) -> float:
        return _clamp(1.0 - math.exp(-self.anchor.get("count", 0) / 12.0))

    def reconstruct(self) -> dict:
        self.reconstructions += 1
        return {"tone": round(self.anchor.get("tone", 0.0), 4),
                "redemptive_tone": round(self.redemptive_tone, 4),
                "anchor_strength": round(self.anchor_strength, 4),
                "count": self.anchor.get("count", 0)}

    def to_dict(self) -> dict:
        return {"redemption_bias": self.redemption_bias, "memories": self.memories,
                "anchor": self.anchor, "reconstructions": self.reconstructions}

    @classmethod
    def from_dict(cls, data: dict) -> "NarrativeIdentity":
        obj = cls(redemption_bias=float(data.get("redemption_bias", 0.3)))
        obj.memories = list(data.get("memories") or [])
        obj.anchor = dict(data.get("anchor") or {})
        obj.reconstructions = int(data.get("reconstructions", 0))
        return obj


ATTENTION_STATES = ("focused", "stable", "declining", "overload", "distracted")


class CognitiveLoad:

    def __init__(self, overload_entropy: float = 0.75, focused_entropy: float = 0.3):
        self.overload_entropy = overload_entropy
        self.focused_entropy = focused_entropy
        self.entropy_history: deque[float] = deque(maxlen=20)
        self.state = "stable"
        self.load = 0.0

    def observe(self, attention_entropy: float, kv_miss: float = 0.0,
                eeg_load: float = 0.0) -> str:
        entropy = _clamp(attention_entropy)
        kv_miss = _clamp(kv_miss)
        eeg_load = _clamp(eeg_load)
        self.entropy_history.append(entropy)

        trend = 0.0
        if len(self.entropy_history) >= 4:
            recent = list(self.entropy_history)
            trend = (sum(recent[-2:]) / 2.0) - (sum(recent[:2]) / 2.0)

        if entropy >= self.overload_entropy and (kv_miss > 0.5 or eeg_load > 0.6):
            state = "overload"
        elif entropy >= self.overload_entropy:
            state = "distracted"
        elif trend > 0.12:
            state = "declining"
        elif entropy <= self.focused_entropy and eeg_load >= 0.3:
            state = "focused"
        else:
            state = "stable"

        self.state = state
        self.load = _clamp(0.5 * entropy + 0.3 * kv_miss + 0.2 * eeg_load)
        return state

    @property
    def capacity_factor(self) -> float:
        return _clamp(1.0 - 0.7 * self.load)

    def recommendation(self) -> str:
        return {
            "focused": "保持当前节奏，可以处理复杂内容。",
            "stable": "正常节奏即可。",
            "declining": "适当放慢，减少一次给的信息量。",
            "overload": "信息过载：先总结再继续，避免叠加新任务。",
            "distracted": "注意力涣散：拉回重点，缩短回复。",
        }.get(self.state, "正常节奏即可。")

    def to_dict(self) -> dict:
        return {"state": self.state, "load": self.load}

    @classmethod
    def from_dict(cls, data: dict) -> "CognitiveLoad":
        obj = cls()
        obj.state = data.get("state", "stable")
        obj.load = float(data.get("load", 0.0))
        return obj


class MetaAwareness:

    def __init__(self, lens_quality: float = 0.6, meta_awareness: float = 0.5):
        self.lens_quality = _clamp(lens_quality)
        self.meta_awareness = _clamp(meta_awareness)
        self.recursion_depth = 1
        self.self_alignment_steps = 0

    def lens(self, confidence: float, perplexity: float, step: int = 0) -> float:
        confidence = _clamp(confidence)
        perplexity = _clamp(perplexity)
        return _clamp(confidence * ((1.0 - self.lens_quality) + self.lens_quality * (1.0 - perplexity)))

    def weakest_step(self, steps: list[dict]) -> int:
        if not steps:
            return -1
        scored = [self.lens(s.get("confidence", 0.5), s.get("perplexity", 0.5), i)
                  for i, s in enumerate(steps)]
        return int(min(range(len(scored)), key=lambda i: scored[i]))

    def self_align(self, iterations: int = 1) -> float:
        for _ in range(max(0, int(iterations))):
            self.self_alignment_steps += 1
            self.meta_awareness = _clamp(self.meta_awareness + 0.05 * (1.0 - self.meta_awareness))
            self.lens_quality = _clamp(self.lens_quality + 0.03 * (1.0 - self.lens_quality))
        return self.meta_awareness

    def probe(self, turn: int) -> int:
        if turn <= 1:
            self.recursion_depth = 1
        elif turn < 5:
            self.recursion_depth = min(4, self.recursion_depth + 1)
        return self.recursion_depth

    @property
    def reliability(self) -> float:
        return _clamp(0.5 * self.meta_awareness + 0.5 * self.lens_quality)

    def to_dict(self) -> dict:
        return {"lens_quality": self.lens_quality, "meta_awareness": self.meta_awareness,
                "recursion_depth": self.recursion_depth,
                "self_alignment_steps": self.self_alignment_steps}

    @classmethod
    def from_dict(cls, data: dict) -> "MetaAwareness":
        obj = cls(lens_quality=float(data.get("lens_quality", 0.6)),
                  meta_awareness=float(data.get("meta_awareness", 0.5)))
        obj.recursion_depth = int(data.get("recursion_depth", 1))
        obj.self_alignment_steps = int(data.get("self_alignment_steps", 0))
        return obj


CENSORED_TRAITS = ("low_agreeableness", "high_neuroticism")


class PersonaDetail:

    def __init__(self, detail_scale: float = 20.0):
        self.detail_scale = max(EPS, detail_scale)
        self.details: dict[str, list] = {}
        self.censored: set[str] = set()

    def add_detail(self, dimension: str, value) -> int:
        self.details.setdefault(str(dimension), []).append(value)
        return len(self.details[str(dimension)])

    @property
    def detail_level(self) -> int:
        return sum(len(v) for v in self.details.values())

    @property
    def breadth(self) -> int:
        return len(self.details)

    def fidelity(self, dimension: str | None = None) -> float:
        level = len(self.details.get(dimension, [])) if dimension else self.detail_level
        base = _clamp(1.0 - math.exp(-level / self.detail_scale))
        if dimension and dimension in self.censored:
            base *= 0.5
        return base

    def censor(self, trait: str) -> None:
        self.censored.add(str(trait))

    def uncensor(self, trait: str) -> None:
        self.censored.discard(str(trait))

    def identity(self) -> dict:
        return {dim: len(values) for dim, values in self.details.items()}

    def to_dict(self) -> dict:
        return {"detail_scale": self.detail_scale, "details": self.details,
                "censored": sorted(self.censored)}

    @classmethod
    def from_dict(cls, data: dict) -> "PersonaDetail":
        obj = cls(detail_scale=float(data.get("detail_scale", 20.0)))
        obj.details = {k: list(v) for k, v in (data.get("details") or {}).items()}
        obj.censored = set(data.get("censored") or [])
        return obj


class AffectivePrimacy:

    def __init__(self, appraisal_gain: float = 1.0, affect_cost: float = 0.1):
        self.appraisal_gain = appraisal_gain
        self.affect_cost = affect_cost
        self.affect: float = 0.0
        self.resource: float = 1.0
        self.formulations: int = 0
        self.post_hoc: int = 0

    def appraise(self, stimulus: float, interoception: float = 0.5) -> float:
        self.affect = _clamp(self.appraisal_gain * (0.6 * float(stimulus) + 0.4 * float(interoception)),
                             -1.0, 1.0)
        self.resource = _clamp(self.resource - self.affect_cost * abs(self.affect))
        return self.affect

    def formulate(self, strategy: float = 0.5) -> dict:
        self.formulations += 1
        if abs(self.affect) < EPS:
            self.post_hoc += 1
        expression = _clamp(0.5 + 0.5 * self.affect) * (1.0 - 0.3 * (1.0 - _clamp(strategy)))
        return {"expression": expression, "affect": self.affect,
                "grounded": abs(self.affect) >= EPS}

    def reentry(self, sensory: float) -> float:
        return _clamp(float(sensory) + 0.3 * self.affect, -1.0, 1.0)

    @property
    def aura_gap(self) -> float:
        if not self.formulations:
            return 0.0
        return self.post_hoc / self.formulations

    def restore(self, amount: float = 0.2) -> float:
        self.resource = _clamp(self.resource + max(0.0, amount))
        return self.resource

    def to_dict(self) -> dict:
        return {"appraisal_gain": self.appraisal_gain, "affect_cost": self.affect_cost,
                "affect": self.affect, "resource": self.resource,
                "formulations": self.formulations, "post_hoc": self.post_hoc}

    @classmethod
    def from_dict(cls, data: dict) -> "AffectivePrimacy":
        obj = cls(appraisal_gain=float(data.get("appraisal_gain", 1.0)),
                  affect_cost=float(data.get("affect_cost", 0.1)))
        obj.affect = float(data.get("affect", 0.0))
        obj.resource = float(data.get("resource", 1.0))
        obj.formulations = int(data.get("formulations", 0))
        obj.post_hoc = int(data.get("post_hoc", 0))
        return obj


@dataclass
class SelfhoodConfig:

    enabled: bool = True
    use_temporal: bool = True
    use_narrative: bool = True
    use_load: bool = True
    use_meta: bool = True
    use_persona_detail: bool = True
    use_affective_primacy: bool = True
    discount_rate: float = 0.1
    detail_scale: float = 20.0

    def to_dict(self) -> dict:
        return {k: getattr(self, k) for k in self.__dataclass_fields__}

    @classmethod
    def from_dict(cls, data: dict) -> "SelfhoodConfig":
        config = cls()
        for key, value in (data or {}).items():
            if hasattr(config, key):
                setattr(config, key, value)
        return config

    def ablate(self, **flags) -> "SelfhoodConfig":
        clone = SelfhoodConfig.from_dict(self.to_dict())
        for key, value in flags.items():
            if hasattr(clone, key):
                setattr(clone, key, value)
        return clone


class SelfhoodSystem:

    def __init__(self, config: SelfhoodConfig | None = None):
        self.config = config or SelfhoodConfig()
        self.temporal = TemporalDiscounting(k=self.config.discount_rate)
        self.narrative = NarrativeIdentity()
        self.load = CognitiveLoad()
        self.meta = MetaAwareness()
        self.persona = PersonaDetail(detail_scale=self.config.detail_scale)
        self.primacy = AffectivePrimacy()

    def reconfigure(self, config: SelfhoodConfig) -> None:
        self.config = config
        self.temporal.k = max(0.0, float(config.discount_rate))
        self.persona.detail_scale = max(EPS, float(config.detail_scale))

    def context(self) -> dict:
        if not self.config.enabled:
            return {"enabled": False}
        return {"enabled": True,
                "patience": round(self.temporal.patience(), 4),
                "redemptive_tone": round(self.narrative.redemptive_tone, 4),
                "identity_anchor": round(self.narrative.anchor_strength, 4),
                "attention_state": self.load.state,
                "load": round(self.load.load, 4),
                "capacity_factor": round(self.load.capacity_factor, 4),
                "meta_awareness": round(self.meta.meta_awareness, 4),
                "recursion_depth": self.meta.recursion_depth,
                "persona_fidelity": round(self.persona.fidelity(), 4),
                "persona_detail": self.persona.detail_level,
                "aura_gap": round(self.primacy.aura_gap, 4)}

    def to_dict(self) -> dict:
        return {"config": self.config.to_dict(), "temporal": self.temporal.to_dict(),
                "narrative": self.narrative.to_dict(), "load": self.load.to_dict(),
                "meta": self.meta.to_dict(), "persona": self.persona.to_dict(),
                "primacy": self.primacy.to_dict()}

    @classmethod
    def from_dict(cls, data: dict) -> "SelfhoodSystem":
        system = cls(SelfhoodConfig.from_dict((data or {}).get("config") or {}))
        for key, factory in (("temporal", TemporalDiscounting), ("narrative", NarrativeIdentity),
                             ("load", CognitiveLoad), ("meta", MetaAwareness),
                             ("persona", PersonaDetail), ("primacy", AffectivePrimacy)):
            if (data or {}).get(key):
                setattr(system, key, factory.from_dict(data[key]))
        return system
