"""Persona -> trait parameters: turning a free-text 人设 into model data.

The agent's persona is written as free text ("她体弱多病，容易焦虑，经常
心慌失眠").  The cognition core, however, is driven by *numbers* - threat
baselines, catastrophizing traits, ERQ profiles, somatic gains.  This module
is the bridge: it reads the persona text and produces a
:class:`PersonaTraits` - a validated, clamped set of overrides for
:class:`~life.cognition.affect.AffectConfig` and
:class:`~life.cognition.somatic.SomaticSymptomSystem` (and optionally the
circadian sleep hour), so a persona that *says* "anxious and sickly" makes
the model *behave* anxious and sickly.

Two tiers of "understanding", mirroring the worldsim asset pipeline:

* **Lexicon (default, deterministic, zero LLM)** - a Chinese keyword lexicon
  maps persona phrases to bounded trait deltas.  Same input always yields the
  same traits; safe to run on every settings change.
* **LLM refinement (optional, offline)** - ``refine_persona_with_llm`` asks a
  model to emit the same JSON schema, validates/clamps every field, and merges
  the valid ones over the lexicon baseline.  Any error falls back to the
  lexicon result.  Follows the worldsim hard constraint: LLM calls happen
  offline behind a sha256 cache, never in the runtime loop.

Unmentioned dimensions stay ``None`` and leave the runtime defaults untouched
- a persona only *moves* the traits it actually describes.
"""
from __future__ import annotations

import json
from dataclasses import dataclass, field, fields

from .affect import ERQ_PROFILES
from .somatic import SomaticSymptomSystem

# ---------------------------------------------------------------------------
# The lexicon: dimension -> (keywords, trait deltas).  Every delta is a small,
# bounded nudge; nothing here can push a trait outside its documented range.
# ---------------------------------------------------------------------------
LEXICON: dict[str, dict] = {
    "positive_affect": {
        "keywords": ("开朗", "乐观", "阳光", "积极", "活泼", "爱笑", "快乐",
                     "cheerful", "optimistic", "upbeat", "sunny"),
        "deltas": {"reward_baseline": +0.15, "threat_baseline": -0.05},
    },
    "depressive": {
        "keywords": ("抑郁", "低落", "忧郁", "悲观", "消沉", "丧", "郁闷",
                     "depressed", "gloomy", "pessimistic", "feeling down"),
        "deltas": {"reward_baseline": -0.15, "depression_gain": +0.25,
                   "catastrophizing": +0.05},
    },
    "anxious": {
        "keywords": ("焦虑", "紧张", "不安", "担忧", "胆小", "怕生", "容易害怕",
                     "anxious", "nervous", "worried", "fearful", "tense"),
        "deltas": {"threat_baseline": +0.12, "anxiety_gain": +0.2},
    },
    "hypervigilant": {
        "keywords": ("敏感", "多疑", "警觉", "玻璃心", "疑神疑鬼", "防备",
                     "sensitive", "suspicious", "hypervigilant", "on guard"),
        "deltas": {"threat_baseline": +0.08, "catastrophizing": +0.15},
    },
    "ruminative": {
        "keywords": ("内耗", "想太多", "钻牛角尖", "反刍", "胡思乱想", "多思",
                     "overthink", "ruminates", "dwells on things"),
        "deltas": {"catastrophizing": +0.2, "depression_gain": +0.15},
    },
    "somatic_prone": {
        # constitution-level markers: the persona *is* the sickly body
        "keywords": ("体弱", "多病", "虚弱", "体质差", "常生病", "药罐子", "大病初愈",
                     "frail", "sickly", "weak constitution", "often ill", "poor health"),
        "deltas": {"use_somatic": True, "report_threshold": -0.10,
                   "bias_gain": +0.2, "catastrophizing": +0.05},
    },
    "somatic_markers": {
        # symptom-level markers: the persona complains about specific bodies
        "keywords": ("心慌", "心悸", "头晕", "肠胃不好", "胃疼", "头疼", "失眠",
                     "睡不好", "浑身没劲", "乏力", "喘不上气",
                     "palpitations", "dizzy", "insomnia", "headache", "stomach ache",
                     "insomniac", "exhausted", "short of breath"),
        "deltas": {"use_somatic": True, "report_threshold": -0.05,
                   "catastrophizing": +0.10},
    },
    "regulated": {
        "keywords": ("理性", "冷静", "成熟", "稳定", "淡定", "情绪稳定",
                     "calm", "rational", "steady", "level-headed"),
        "deltas": {"baseline_vagal": +0.10, "catastrophizing": -0.10},
    },
    "impulsive": {
        "keywords": ("情绪化", "冲动", "急躁", "易怒", "暴躁",
                     "impulsive", "moody", "irritable", "hot-tempered"),
        "deltas": {"threat_baseline": +0.05, "catastrophizing": +0.05},
    },
    "alexithymic": {
        "keywords": ("麻木", "感觉钝", "说不清感受", "表达不了情绪", "共情少",
                     "numb", "alexithymic", "can't name her feelings"),
        "deltas": {"erq_profile": "alexithymia"},
    },
    "night_owl": {
        "keywords": ("熬夜", "夜猫子", "晚睡", "night owl", "stays up late"),
        "deltas": {"sleep_hour": 1},
    },
    "early_bird": {
        "keywords": ("早睡", "早起", "作息规律", "early bird", "early riser"),
        "deltas": {"sleep_hour": 23},
    },
}

# 2+ matches on these dimensions additionally pin the ERQ profile, because a
# casually-written word should not silently swap the regulation style.
PROFILE_PIN_DIMENSIONS = {"depressive": "depression", "anxious": "anxiety",
                          "impulsive": "bpd", "alexithymic": "alexithymia"}

# Field ranges for validation / clamping (erq_profile validated by membership).
RANGES = {"threat_baseline": (0.0, 1.0), "reward_baseline": (0.0, 2.0),
          "baseline_vagal": (0.0, 1.0), "catastrophizing": (0.0, 1.0),
          "bias_gain": (0.0, 2.0), "anxiety_gain": (0.0, 2.0),
          "depression_gain": (0.0, 2.0), "report_threshold": (0.0, 1.0)}

TRAIT_FIELDS = tuple(RANGES) + ("erq_profile", "use_somatic", "sleep_hour")


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, float(value)))


@dataclass
class PersonaTraits:
    """Validated persona-derived overrides; ``None`` = leave default alone."""

    threat_baseline: float | None = None
    reward_baseline: float | None = None
    baseline_vagal: float | None = None
    catastrophizing: float | None = None
    bias_gain: float | None = None
    anxiety_gain: float | None = None
    depression_gain: float | None = None
    report_threshold: float | None = None
    erq_profile: str | None = None
    use_somatic: bool | None = None
    sleep_hour: int | None = None
    evidence: dict[str, list[str]] = field(default_factory=dict)
    source: str = "lexicon"

    @property
    def present(self) -> bool:
        """True when at least one trait override was derived."""
        return any(getattr(self, name) is not None
                   for name in TRAIT_FIELDS)

    def apply(self, affect_config, somatic: SomaticSymptomSystem | None = None,
              circadian=None) -> dict:
        """Write the non-None traits into the live objects; returns what moved.

        ``affect_config`` is the *candidate* AffectConfig the engine is about
        to install (so ``use_somatic`` participates in the switch), while
        ``somatic`` is the live SomaticSymptomSystem whose trainable traits
        persist across reconfigures.  ``circadian`` optionally receives the
        persona sleep hour.
        """
        changed: dict[str, float] = {}
        for name in ("threat_baseline", "reward_baseline", "baseline_vagal"):
            value = getattr(self, name)
            if value is not None:
                setattr(affect_config, name, value)
                changed[name] = value
        if self.erq_profile and self.erq_profile in ERQ_PROFILES:
            affect_config.erq_profile = self.erq_profile
            changed["erq_profile"] = self.erq_profile
        if self.use_somatic:
            affect_config.use_somatic = True
            changed["use_somatic"] = True
        if somatic is not None:
            for name in ("catastrophizing", "bias_gain", "anxiety_gain",
                         "depression_gain", "report_threshold"):
                value = getattr(self, name)
                if value is not None:
                    setattr(somatic, name, value)
                    changed[f"somatic_{name}"] = value
        if circadian is not None and self.sleep_hour is not None:
            circadian.sleep_hour = int(self.sleep_hour) % 24
            circadian.wake_hour = (circadian.sleep_hour + 8) % 24
            changed["sleep_hour"] = circadian.sleep_hour
        return changed

    def to_dict(self) -> dict:
        data = {name: getattr(self, name) for name in TRAIT_FIELDS}
        data["evidence"] = dict(self.evidence)
        data["source"] = self.source
        return data

    @classmethod
    def from_dict(cls, data: dict) -> "PersonaTraits":
        traits = cls()
        data = data or {}
        for name in TRAIT_FIELDS:
            if data.get(name) is not None:
                setattr(traits, name, data[name])
        traits.evidence = dict(data.get("evidence") or {})
        traits.source = str(data.get("source") or "lexicon")
        return traits


def parse_persona(text: str) -> PersonaTraits:
    """Deterministic lexicon pass: persona text -> trait overrides."""
    traits = PersonaTraits()
    text = str(text or "")
    if not text.strip():
        return traits
    for dimension, spec in LEXICON.items():
        matched = [word for word in spec["keywords"] if word in text]
        if not matched:
            continue
        traits.evidence[dimension] = matched
        for name, delta in spec["deltas"].items():
            if name == "use_somatic":
                traits.use_somatic = True
            elif name == "sleep_hour":
                traits.sleep_hour = int(delta)
            elif name == "erq_profile":
                traits.erq_profile = str(delta)
            else:
                current = getattr(traits, name) or 0.0
                setattr(traits, name, current + delta)
    # profile pinning: strong evidence (2+ matches) swaps the ERQ style
    for dimension, profile in PROFILE_PIN_DIMENSIONS.items():
        if len(traits.evidence.get(dimension, ())) >= 2 and traits.erq_profile is None:
            traits.erq_profile = profile
    # clamp every numeric trait into its documented range.  The lexicon
    # accumulates pure *deltas*, so each field is re-based onto its module
    # default before clamping.
    defaults = {"threat_baseline": 0.2, "reward_baseline": 1.0, "baseline_vagal": 0.6,
                "catastrophizing": 0.20, "bias_gain": 0.8, "anxiety_gain": 1.0,
                "depression_gain": 0.5, "report_threshold": 0.45}
    for name, (low, high) in RANGES.items():
        value = getattr(traits, name)
        if value is None:
            continue
        setattr(traits, name, _clamp(defaults[name] + value, low, high))
    return traits


# ---------------------------------------------------------------------------
# Optional offline LLM refinement (world/generate_assets.py pattern)
# ---------------------------------------------------------------------------
PERSONA_JSON_CONTRACT = (
    "把下面的人设文本转换成 JSON 特质卡，只输出 JSON，不要解释。字段与取值范围：\n"
    "threat_baseline (0-1, 威胁/焦虑基线), reward_baseline (0-2, 奖励敏感度),\n"
    "baseline_vagal (0-1, 情绪调节生理基础), catastrophizing (0-1, 灾难化),\n"
    "bias_gain (0-2, 内感受偏差放大), anxiety_gain (0-2, 焦虑躯体通路),\n"
    "depression_gain (0-2, 抑郁躯体通路), report_threshold (0-1, 症状报告阈值, 越低越容易报告),\n"
    "erq_profile (typical|depression|anxiety|bpd|alexithymia),\n"
    "use_somatic (true|false, 是否启用躯体化), sleep_hour (0-23 或 null, 作息),\n"
    "不确定的字段用 null。人设文本：\n"
)


def _extract_json_object(raw: str) -> str | None:
    """Pull the outermost JSON object out of an LLM reply.

    Models love to wrap JSON in prose or ```json fences; the braces scan is
    deliberately forgiving because the result is validated field-by-field
    afterwards anyway.
    """
    text = str(raw or "").strip()
    if text.startswith("```"):
        first_newline = text.find("\n")
        if first_newline != -1:
            text = text[first_newline + 1:]
        if text.rstrip().endswith("```"):
            text = text.rstrip()[:-3]
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end <= start:
        return None
    return text[start:end + 1]


def merge_persona_llm_json(baseline: PersonaTraits, raw: str) -> PersonaTraits | None:
    """Validate an LLM reply against the trait schema and merge it.

    Every field is checked independently: out-of-range numbers are clamped,
    unknown profiles/values are skipped, and the lexicon baseline fills any
    gap.  Returns ``None`` when the reply contains no usable JSON at all.
    """
    try:
        data = json.loads(_extract_json_object(raw) or "")
        if not isinstance(data, dict):
            raise ValueError("persona LLM response is not a JSON object")
    except (ValueError, TypeError):
        return None
    merged = PersonaTraits.from_dict(baseline.to_dict())
    merged.source = "llm"
    for name in TRAIT_FIELDS:
        value = data.get(name)
        if value is None:
            continue
        if name == "erq_profile":
            if value in ERQ_PROFILES:
                merged.erq_profile = str(value)
        elif name == "use_somatic":
            merged.use_somatic = bool(value)
        elif name == "sleep_hour":
            try:
                merged.sleep_hour = int(value) % 24
            except (TypeError, ValueError):
                pass
        else:
            low, high = RANGES[name]
            try:
                merged.__setattr__(name, _clamp(value, low, high))
            except (TypeError, ValueError):
                pass
    return merged


def refine_persona_with_llm(text: str, llm, model: str = "",
                            cache=None) -> PersonaTraits:
    """Offline refinement: ask an LLM for the trait JSON, validate, merge.

    ``llm(prompt) -> str`` is a synchronous callable (offline use only, per
    the worldsim constraint); ``cache`` is an optional
    :class:`life.worldsim.llm_cache.LLMCache`.  Any failure - network, JSON,
    validation - falls back to the deterministic lexicon result, so this can
    never produce a worse persona than the lexicon alone.
    """
    baseline = parse_persona(text)
    if not str(text or "").strip() or llm is None:
        return baseline
    prompt = PERSONA_JSON_CONTRACT + str(text)
    try:
        response = cache.get(prompt, model) if cache is not None else None
        if response is None:
            response = llm(prompt)
            if cache is not None:
                cache.put(prompt, response, model)
    except Exception:
        return baseline
    merged = merge_persona_llm_json(baseline, response)
    return merged if merged is not None else baseline


def persona_summary(traits: PersonaTraits | None) -> dict:
    """Compact read-out for the dashboard / status endpoint."""
    if traits is None or not traits.present:
        return {"applied": False}
    data = traits.to_dict()
    return {"applied": True, "source": traits.source,
            "traits": {k: v for k, v in data.items()
                       if k in TRAIT_FIELDS and v is not None},
            "evidence": traits.evidence}
