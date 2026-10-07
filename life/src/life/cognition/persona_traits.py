"""Persona -> trait parameters: turning a free-text 人设 into model data.

The agent's persona is written as free text ("她体弱多病，容易焦虑，经常
心慌失眠").  The cognition core, however, is driven by *numbers* - threat
baselines, catastrophizing traits, ERQ profiles, somatic gains.  This module
is the bridge: it reads the persona text and produces a
:class:`PersonaTraits` - a validated, clamped set of overrides for
:class:`~life.cognition.affect.AffectConfig`,
:class:`~life.cognition.somatic.SomaticSymptomSystem` (optionally the circadian
sleep hour) and the reciprocity trait space in
:mod:`~life.cognition.relating`, so a persona that *says* "anxious and sickly"
makes the model *behave* anxious and sickly.

Two tiers of "understanding", mirroring the worldsim asset pipeline:

* **Lexicon (default, deterministic, zero LLM)** - a Chinese keyword lexicon
  maps persona phrases to bounded trait deltas; the character/relationship
  lexicons in :mod:`~life.cognition.persona_style` add the style layer.  Same
  input always yields the same traits; safe to run on every settings change.
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
from .persona_style import (
    AXES,
    CHARACTER_TYPES,
    RELATIONSHIP_TYPES,
    character_spec,
    classify_character,
    classify_relationship,
    relationship_spec,
    style_axes,
)
from .somatic import SomaticSymptomSystem
from .common import clamp as _clamp

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

# Numeric ranges for validation / clamping (erq_profile validated by membership).
RANGES = {
    "threat_baseline": (0.0, 1.0), "reward_baseline": (0.0, 2.0),
    "baseline_vagal": (0.0, 1.0), "catastrophizing": (0.0, 1.0),
    "bias_gain": (0.0, 2.0), "anxiety_gain": (0.0, 2.0),
    "depression_gain": (0.0, 2.0), "report_threshold": (0.0, 1.0),
    # -- personality / style dimensions (all 0-1) --
    "extraversion": (0.0, 1.0), "agreeableness": (0.0, 1.0),
    "conscientiousness": (0.0, 1.0), "openness": (0.0, 1.0),
    "attach_anxiety": (0.0, 1.0), "attach_avoidance": (0.0, 1.0),
    "expressiveness": (0.0, 1.0), "initiative": (0.0, 1.0),
    "humor": (0.0, 1.0), "warmth": (0.0, 1.0),
    "formality": (0.0, 1.0), "assertiveness": (0.0, 1.0),
}

# Defaults used to re-base lexicon *deltas* before clamping.  A delta lexicon
# adds a nudge on top of the module default, so each field needs its neutral.
DEFAULTS = {"threat_baseline": 0.2, "reward_baseline": 1.0, "baseline_vagal": 0.6,
            "catastrophizing": 0.20, "bias_gain": 0.8, "anxiety_gain": 1.0,
            "depression_gain": 0.5, "report_threshold": 0.45,
            "extraversion": 0.5, "agreeableness": 0.5, "conscientiousness": 0.5,
            "openness": 0.5, "attach_anxiety": 0.35, "attach_avoidance": 0.35,
            "expressiveness": 0.5, "initiative": 0.5, "humor": 0.5,
            "warmth": 0.5, "formality": 0.5, "assertiveness": 0.5}

TRAIT_FIELDS = tuple(RANGES) + ("erq_profile", "use_somatic", "sleep_hour")

#: Allowed gender values; "" / unknown leaves it undecided.
GENDERS = ("female", "male", "other")
_FEMALE_WORDS = ("她", "女生", "女孩", "少女", "姐姐", "妹妹", "妈妈", "母亲",
                 "女儿", "太太", "老婆", "女友", "女朋友", "女王", "御姐", "f", "female", "girl", "woman")
_MALE_WORDS = ("他", "男生", "男孩", "少年", "哥哥", "弟弟", "爸爸", "父亲",
               "儿子", "先生", "老公", "男友", "男朋友", "少年", "m", "male", "boy", "man")

# How the personality fields fold onto relating's behavioural axes: (field, axis,
# weight), applied as (value - 0.5) * weight.  This is what keeps the extra
# knobs from being decorative - they genuinely shape the self trait vector.
FIELD_AXES = (
    ("warmth", "warmth", 1.0),
    ("formality", "formality", 1.0),
    ("humor", "humor", 1.0),
    ("openness", "openness", 1.0),
    ("assertiveness", "directness", 0.8),
    ("extraversion", "pace", 0.5),
    ("extraversion", "openness", 0.3),
    ("extraversion", "humor", 0.2),
    ("agreeableness", "warmth", 0.6),
    ("agreeableness", "formality", -0.2),
    ("conscientiousness", "formality", 0.3),
    ("conscientiousness", "risk", -0.2),
    ("initiative", "pace", 0.4),
    ("initiative", "risk", 0.3),
    ("attach_anxiety", "risk", -0.2),
    ("attach_avoidance", "warmth", -0.3),
    ("attach_avoidance", "openness", -0.2),
)




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
    # -- personality / style dimensions --
    extraversion: float | None = None
    agreeableness: float | None = None
    conscientiousness: float | None = None
    openness: float | None = None
    attach_anxiety: float | None = None
    attach_avoidance: float | None = None
    expressiveness: float | None = None
    initiative: float | None = None
    humor: float | None = None
    warmth: float | None = None
    formality: float | None = None
    assertiveness: float | None = None
    erq_profile: str | None = None
    use_somatic: bool | None = None
    sleep_hour: int | None = None
    # -- style layer --
    gender: str | None = None
    character: str | None = None
    relationship: str | None = None
    expression: str | None = None
    axes: dict[str, float] = field(default_factory=dict)
    confidence: float | None = None
    evidence: dict[str, list[str]] = field(default_factory=dict)
    source: str = "lexicon"

    @property
    def present(self) -> bool:
        """True when at least one trait override was derived."""
        return (any(getattr(self, name) is not None for name in TRAIT_FIELDS)
                or bool(self.character) or bool(self.relationship))

    def axis_vector(self, base: float = 0.5) -> dict[str, float]:
        """Relating trait axes in [0, 1] implied by this persona.

        Combines the character/relationship lexicon deltas with the explicit
        personality fields; unmentioned axes stay at ``base`` (neutral).
        """
        axes = {axis: base for axis in AXES}
        for axis, delta in (self.axes or {}).items():
            if axis in axes:
                axes[axis] = axes[axis] + float(delta)
        for name, axis, weight in FIELD_AXES:
            value = getattr(self, name)
            if value is not None and axis in axes:
                axes[axis] = axes[axis] + (float(value) - 0.5) * weight
        return {axis: round(_clamp(value, 0.0, 1.0), 4) for axis, value in axes.items()}

    def apply(self, affect_config, somatic: SomaticSymptomSystem | None = None,
              circadian=None) -> dict:
        """Write the affect/somatic/circadian traits into the live objects.

        ``affect_config`` is the *candidate* AffectConfig the engine is about
        to install (so ``use_somatic`` participates in the switch), while
        ``somatic`` is the live SomaticSymptomSystem whose trainable traits
        persist across reconfigures.  ``circadian`` optionally receives the
        persona sleep hour.  (The personality/style fields are consumed by
        :meth:`axis_vector`, not here.)
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
        data["gender"] = self.gender
        data["character"] = self.character
        data["relationship"] = self.relationship
        data["expression"] = self.expression
        data["axes"] = dict(self.axes)
        if self.confidence is not None:
            data["confidence"] = self.confidence
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
        for name in ("character", "relationship", "expression"):
            value = data.get(name)
            if value:
                setattr(traits, name, str(value))
        if data.get("gender") in GENDERS:
            traits.gender = str(data["gender"])
        traits.axes = {str(k): float(v) for k, v in (data.get("axes") or {}).items()
                       if k in AXES}
        if data.get("confidence") is not None:
            try:
                traits.confidence = _clamp(data["confidence"], 0.0, 1.0)
            except (TypeError, ValueError):
                pass
        traits.evidence = dict(data.get("evidence") or {})
        traits.source = str(data.get("source") or "lexicon")
        return traits


def detect_gender(text: str) -> str:
    """Best-effort gender from pronouns/角色词; "" when ambiguous.

    Chinese 他/她 are the strongest signal, then gendered role words.  A tie
    (both used, or neither) stays undecided so the owner can pick.
    """
    body = str(text or "")
    female = sum(1 for word in _FEMALE_WORDS if word in body)
    male = sum(1 for word in _MALE_WORDS if word in body)
    if female > male:
        return "female"
    if male > female:
        return "male"
    return ""


def _add_style_deltas(deltas: dict[str, float], spec: dict) -> None:
    """Fold a character/relationship spec's numeric ``traits`` into ``deltas``."""
    for name, delta in (spec.get("traits") or {}).items():
        if name in RANGES:
            deltas[name] = deltas.get(name, 0.0) + float(delta)


def parse_persona(text: str, gender_hint: str = "") -> PersonaTraits:
    """Deterministic lexicon pass: persona text -> trait overrides.

    ``gender_hint`` is an explicit owner choice ("female"/"male"/"other") that
    overrides the pronoun/role-word detection when valid.
    """
    traits = PersonaTraits()
    text = str(text or "")
    hint = str(gender_hint or "").strip().lower()
    if hint in GENDERS:
        traits.gender = hint
    if not text.strip():
        return traits
    if traits.gender is None:
        detected = detect_gender(text)
        if detected:
            traits.gender = detected
    # numeric dimensions accumulate pure deltas; explicit values (the
    # relationship anxiety/avoidance pair) are final and skip the re-basing.
    deltas: dict[str, float] = {}
    explicit: set[str] = set()
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
            elif name in RANGES:
                deltas[name] = deltas.get(name, 0.0) + float(delta)
    # character archetype: style deltas + expression note
    character = classify_character(text)
    if character["key"]:
        traits.character = character["key"]
        traits.evidence["character"] = character["evidence"]
        _add_style_deltas(deltas, character_spec(character["key"]))
    # relationship/attachment style: explicit anxiety/avoidance pair (a value,
    # not a delta) plus affect nudges; healthy styles never set the ODE type.
    relationship = classify_relationship(text)
    if relationship["key"]:
        traits.relationship = relationship["key"]
        traits.evidence["relationship"] = relationship["evidence"]
        spec = relationship_spec(relationship["key"])
        _add_style_deltas(deltas, spec)
        if spec.get("attach_anxiety") is not None:
            traits.attach_anxiety = float(spec["attach_anxiety"])
            explicit.add("attach_anxiety")
        if spec.get("attach_avoidance") is not None:
            traits.attach_avoidance = float(spec["attach_avoidance"])
            explicit.add("attach_avoidance")
    # style axes: character + relationship lexicon deltas
    traits.axes = style_axes(traits.character or "", traits.relationship or "")
    # profile pinning: strong evidence (2+ matches) swaps the ERQ style
    for dimension, profile in PROFILE_PIN_DIMENSIONS.items():
        if len(traits.evidence.get(dimension, ())) >= 2 and traits.erq_profile is None:
            traits.erq_profile = profile
    # clamp every numeric trait into its documented range.  Delta fields are
    # re-based onto their module default first; explicit fields are clamped as-is.
    for name, value in deltas.items():
        if name in explicit:
            continue
        low, high = RANGES[name]
        setattr(traits, name, _clamp(DEFAULTS[name] + value, low, high))
    for name in explicit:
        low, high = RANGES[name]
        setattr(traits, name, _clamp(getattr(traits, name), low, high))
    return traits


# ---------------------------------------------------------------------------
# Optional offline LLM refinement (world/generate_assets.py pattern)
# ---------------------------------------------------------------------------
def _build_contract() -> str:
    chars = "、".join(f"{key}({spec['label']})" for key, spec in CHARACTER_TYPES.items())
    rels = "、".join(f"{key}({spec['label']})" for key, spec in RELATIONSHIP_TYPES.items())
    return (
        "你是人设结构化解析器。阅读「人设文本」，把它转成**一个 JSON 对象**，"
        "只输出 JSON，不要解释、不要 Markdown 代码块。\n"
        "规则：\n"
        "1) 只填文本明确支持的字段；确实没提到的字段填 null，不要脑补。\n"
        "2) 数值越界会被裁剪；宁可保守，也不要为了填满而乱给。\n"
        "3) 尽量在 evidence 里给出判断依据词，在 confidence 里给出整体置信度(0-1)。\n"
        "字段说明：\n"
        "gender: 角色性别，female|male|other；文本用「她/女孩/姐/妹」多为 female，「他/男孩/哥/弟」多为 male，"
        "确实无法判断才 null。\n"
        "character: 性格原型，从下面[性格原型候选]里选**一个最贴切**的 key，没有就 null。\n"
        "relationship: 关系/依恋类型，从[关系类型候选]里选**一个最贴切**的 key，没有就 null；"
        "注意「病娇族」(独占/依存/妄想/监视/自伤/排除) 与健康型(安全/焦虑/回避/恐惧回避/独立/家人/损友/合作伙伴/暗恋/守护/青梅竹马) 是并列的，"
        "不要把人设都判成病娇。\n"
        "expression: 一句话(中文)概括她/他的说话风格与语气。\n"
        "threat_baseline (0-1 威胁/焦虑基线)、reward_baseline (0-2 奖励敏感度)、\n"
        "baseline_vagal (0-1 情绪调节生理基础)、catastrophizing (0-1 灾难化)、\n"
        "bias_gain (0-2 内感受偏差放大)、anxiety_gain (0-2 焦虑躯体通路)、\n"
        "depression_gain (0-2 抑郁躯体通路)、report_threshold (0-1 症状报告阈值, 越低越易报告症状)。\n"
        "extraversion/agreeableness/conscientiousness/openness (0-1 性格维度，未提及可省略)；\n"
        "attach_anxiety/attach_avoidance (0-1 依恋焦虑/回避，对应上面的 relationship)；\n"
        "expressiveness (0-1 表达欲)、initiative (0-1 主动/粘人程度)、humor (0-1 幽默)、\n"
        "warmth (0-1 亲和) 、formality (0-1 正式程度)、assertiveness (0-1 强势/支配)。\n"
        "erq_profile (typical|depression|anxiety|bpd|alexithymia)、\n"
        "use_somatic (true|false 是否启用躯体化)、sleep_hour (0-23 或 null 作息)。\n"
        "[性格原型候选] " + chars + "\n"
        "[关系类型候选] " + rels + "\n"
        "示例：{\"gender\":\"female\",\"character\":\"傲娇\",\"relationship\":\"焦虑型\","
        "\"expression\":\"嘴硬心软，爱用反话试探\",\"threat_baseline\":0.35,\"attach_anxiety\":0.8,"
        "\"evidence\":{\"character\":[\"傲娇\"]},\"confidence\":0.7}\n"
        "人设文本：\n"
    )


PERSONA_JSON_CONTRACT = _build_contract()


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


def _clean_axes(raw) -> dict[str, float]:
    if not isinstance(raw, dict):
        return {}
    axes: dict[str, float] = {}
    for key, value in raw.items():
        if key not in AXES:
            continue
        try:
            axes[str(key)] = round(_clamp(value, -0.5, 0.5), 4)
        except (TypeError, ValueError):
            continue
    return axes


def merge_persona_llm_json(baseline: PersonaTraits, raw: str) -> PersonaTraits | None:
    """Validate an LLM reply against the trait schema and merge it.

    Every field is checked independently: out-of-range numbers are clamped,
    unknown profiles/archetypes/values are skipped, and the lexicon baseline
    fills any gap.  Returns ``None`` when the reply contains no usable JSON.
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
    # style layer: only accept keys that exist in the taxonomies
    if data.get("gender") in GENDERS:
        merged.gender = str(data["gender"])
    if data.get("character") in CHARACTER_TYPES:
        merged.character = str(data["character"])
        spec = character_spec(merged.character)
        if spec.get("label"):
            merged.evidence["character"] = list(spec.get("keywords", ())[:2])
    if data.get("relationship") in RELATIONSHIP_TYPES:
        merged.relationship = str(data["relationship"])
        spec = relationship_spec(merged.relationship)
        if spec.get("label"):
            merged.evidence["relationship"] = list(spec.get("keywords", ())[:2])
    if isinstance(data.get("expression"), str) and data["expression"].strip():
        merged.expression = data["expression"].strip()
    axes = _clean_axes(data.get("axes"))
    if axes:
        merged.axes = axes
    elif merged.character or merged.relationship:
        # The caller changed an archetype without supplying axes (the companion
        # UI does this): recompute the relating axes so they follow the pick
        # instead of staying on the raw-text parse.
        merged.axes = style_axes(merged.character or "", merged.relationship or "")
    if data.get("confidence") is not None:
        try:
            merged.confidence = _clamp(data["confidence"], 0.0, 1.0)
        except (TypeError, ValueError):
            pass
    if isinstance(data.get("evidence"), dict):
        for key, value in data["evidence"].items():
            if isinstance(value, list):
                merged.evidence[str(key)] = [str(v) for v in value][:6]
            elif isinstance(value, str) and value:
                merged.evidence[str(key)] = [value]
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
    summary = {"applied": True, "source": traits.source,
               "traits": {k: v for k, v in data.items()
                          if k in TRAIT_FIELDS and v is not None},
               "evidence": traits.evidence}
    if traits.character:
        summary["character"] = traits.character
    if traits.relationship:
        summary["relationship"] = traits.relationship
    if traits.expression:
        summary["expression"] = traits.expression
    return summary
