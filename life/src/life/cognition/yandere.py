from __future__ import annotations

import math
from dataclasses import asdict, dataclass
from typing import Dict, Optional, Union

from .common import (
    clamp01,
    clamp_signed,
    emotion_label,
    match_persona_hints,
    safety_guard,
)


@dataclass(frozen=True)
class EventEffect:

    valence: float = 0.0
    arousal: float = 0.0
    affection: float = 0.0
    trust: float = 0.0
    jealousy: float = 0.0


JEALOUSY_KINDS = frozenset(
    {"late_reply", "ignore", "mention_other", "contact_rival", "lie", "betrayal"}
)

EVENT_EFFECTS: Dict[str, EventEffect] = {
    "praise": EventEffect(valence=+0.35, arousal=+0.20, affection=+0.05, trust=+0.02),
    "chat": EventEffect(valence=+0.15, arousal=+0.15, affection=+0.03, trust=+0.01),
    "gift": EventEffect(valence=+0.40, arousal=+0.30, affection=+0.07, trust=+0.04),
    "special_day": EventEffect(valence=+0.45, arousal=+0.30, affection=+0.06, trust=+0.03),
    "reunion": EventEffect(valence=+0.45, arousal=+0.35, affection=+0.06, trust=+0.02),
    "apologize": EventEffect(valence=+0.20, arousal=-0.15, trust=+0.07, jealousy=-0.35),
    "late_reply": EventEffect(valence=-0.15, arousal=+0.15, jealousy=+0.15, trust=-0.02),
    "ignore": EventEffect(valence=-0.30, arousal=+0.25, jealousy=+0.22, trust=-0.06),
    "mention_other": EventEffect(valence=-0.35, arousal=+0.35, jealousy=+0.30, trust=-0.03),
    "contact_rival": EventEffect(valence=-0.60, arousal=+0.50, jealousy=+0.45, trust=-0.10),
    "lie": EventEffect(valence=-0.45, arousal=+0.40, jealousy=+0.15, trust=-0.30),
    "betrayal": EventEffect(valence=-0.90, arousal=+0.60, affection=-0.35, jealousy=+0.50, trust=-0.60),
}


@dataclass(frozen=True)
class Event:

    kind: str
    actor: str = "you"
    about: str = ""
    weight: float = 1.0
    note: str = ""


def effect_of(event: Event) -> EventEffect:
    try:
        base = EVENT_EFFECTS[event.kind]
    except KeyError:
        raise ValueError(
            f"unknown event kind: {event.kind!r}. valid kinds: {sorted(EVENT_EFFECTS)}"
        ) from None
    w = max(0.0, float(event.weight))
    return EventEffect(
        valence=base.valence * w,
        arousal=base.arousal * w,
        affection=base.affection * w,
        trust=base.trust * w,
        jealousy=base.jealousy * w,
    )


@dataclass(frozen=True)
class DereProfile:

    name: str
    description: str

    k_react: float = 1.0
    k_excess: float = 2.2
    k_jealousy_sens: float = 1.6
    k_rumination: float = 0.12
    rumination_omega: float = 1.3

    k_affection_gain: float = 1.0
    love_theta: float = 0.35

    dere_valence: float = 0.15
    yami_valence: float = -0.25
    yami_arousal_min: float = 0.30
    yami_jealousy: float = 0.40
    dere_margin: float = 0.10
    yami_exit_valence: float = 0.10
    yami_exit_jealousy: float = 0.30

    deflect_positive: bool = False
    deflect_factor: float = -0.6
    tsun_arousal_boost: float = 0.15

    decay_valence: float = 0.25
    decay_arousal: float = 0.35
    decay_jealousy: float = 0.08
    trust_recovery: float = 0.004

    excess_expression: float = 1.4


YANDERE_PROFILE = DereProfile(
    name="yandere",
    description="過度な好意による感情の急変と過剰な愛情表現",
)

TSUNDERE_PROFILE = DereProfile(
    name="tsundere",
    description="好意が閾値未満のうちは突き放す（建前）、素直は後から",
    k_excess=0.6,
    k_jealousy_sens=0.6,
    k_rumination=0.03,
    love_theta=0.55,
    dere_valence=0.20,
    yami_valence=-0.50,
    yami_jealousy=0.60,
    deflect_positive=True,
)

NEUTRAL_PROFILE = DereProfile(
    name="neutral",
    description="感情の振れ幅も嫉妬も小さく、病みには至らない",
    k_excess=0.3,
    k_jealousy_sens=0.4,
    k_rumination=0.0,
    love_theta=0.60,
    dere_valence=0.30,
    yami_valence=-0.45,
    yami_jealousy=0.80,
)

HYBRID_PROFILE = DereProfile(
    name="hybrid_tsun_yan",
    description="探索的拡張: 建前で始まり、好意が溜まると急変・病みうる（非論文準拠）",
    k_excess=2.0,
    k_jealousy_sens=1.4,
    k_rumination=0.10,
    love_theta=0.45,
    deflect_positive=True,
)

TYPES: Dict[str, dict] = {
    "病娇": dict(
        label="病娇 (Yandere)",
        hint="过度的爱意会让情绪急转直下，也会让表达变得过分用力。",
        profile=YANDERE_PROFILE,
        expression="爱得越深，被冷落时塌得越快；一旦认定，就很难再装作无所谓。",
    ),
    "傲娇": dict(
        label="傲娇 (Tsundere)",
        hint="好意没攒够之前先嘴硬：越是被温柔对待，越要先把话顶回去。",
        profile=TSUNDERE_PROFILE,
        expression="明明在意却先呛声，等好感攒够了才肯露出真心。",
    ),
    "中性": dict(
        label="中性 (Neutral)",
        hint="情绪起伏小、嫉妒淡，基本不会滑向病态。",
        profile=NEUTRAL_PROFILE,
        expression="温和而稳定，被冷落也只是失落一阵，不会钻牛角尖。",
    ),
    "傲娇→病娇": dict(
        label="傲娇→病娇 (Hybrid, exploratory)",
        hint="以嘴硬开场，好感积到一定程度后可能急变、滑向执念。",
        profile=HYBRID_PROFILE,
        expression="先是别扭的关心，攒够了感情又可能急转直下变成过度的执念。",
    ),
}

ALL_PROFILES = (YANDERE_PROFILE, TSUNDERE_PROFILE, NEUTRAL_PROFILE, HYBRID_PROFILE)

PERSONA_HINTS = (
    ("病娇", ("病娇", "执念", "占有欲", "黑化", "情敌", "不许别人", "ヤンデレ")),
    ("傲娇→病娇", ("傲娇", "口嫌体正直", "嘴硬", "毒舌", "tsundere")),
)

INITIAL_HINTS: Dict[str, tuple] = {
    "affection": ("喜欢", "爱", "在意", "心动", "黏", "粘", "依赖"),
    "jealousy": ("病娇", "执念", "占有", "黑化", "复仇", "吃醋", "嫉妒"),
}


def type_for_persona(text: str) -> str:
    return match_persona_hints(text, PERSONA_HINTS)


def initial_state_for_persona(text: str, base: Optional[dict] = None) -> dict:
    state = dict(base or {"affection": 0.15, "trust": 0.50, "jealousy": 0.0})
    body = str(text or "")
    if any(word in body for word in INITIAL_HINTS["affection"]):
        state["affection"] = clamp01(state["affection"] + 0.20)
    if any(word in body for word in INITIAL_HINTS["jealousy"]):
        state["jealousy"] = clamp01(state["jealousy"] + 0.25)
    return state


@dataclass(frozen=True)
class BigFive:

    openness: float
    conscientiousness: float
    extraversion: float
    agreeableness: float
    neuroticism: float

    def as_dict(self) -> dict:
        return {k: round(v, 3) for k, v in asdict(self).items()}


YANDERE_SIGNATURE = BigFive(
    openness=0.50,
    conscientiousness=0.70,
    extraversion=0.60,
    agreeableness=0.25,
    neuroticism=0.85,
)


def yandere_signature_score(bf: BigFive) -> float:
    diffs = (
        abs(bf.openness - YANDERE_SIGNATURE.openness) * 0.5,
        abs(bf.conscientiousness - YANDERE_SIGNATURE.conscientiousness) * 1.0,
        abs(bf.extraversion - YANDERE_SIGNATURE.extraversion) * 0.5,
        abs(bf.agreeableness - YANDERE_SIGNATURE.agreeableness) * 1.5,
        abs(bf.neuroticism - YANDERE_SIGNATURE.neuroticism) * 1.5,
    )
    return round(clamp01(1.0 - sum(diffs) / 2.5), 3)


def traits_to_profile(bf: BigFive, name: str = "derived") -> DereProfile:
    return DereProfile(
        name=name,
        description=f"traits→dynamics mapping from OCEAN {bf.as_dict()}",
        k_excess=0.8 + 3.0 * bf.neuroticism ** 2,
        k_jealousy_sens=0.3 + 1.8 * (1.0 - bf.agreeableness),
        k_rumination=0.16 * bf.neuroticism,
        rumination_omega=1.3,
        k_affection_gain=1.0,
        love_theta=max(0.15, 0.45 - 0.15 * bf.extraversion),
        dere_valence=0.25 - 0.15 * bf.extraversion,
        yami_valence=-0.10 - 0.30 * bf.neuroticism,
        yami_arousal_min=0.28 + 0.65 * (1.0 - bf.neuroticism),
        yami_jealousy=0.55 - 0.25 * bf.neuroticism,
        dere_margin=0.05 + 0.20 * bf.conscientiousness,
        yami_exit_valence=0.10,
        yami_exit_jealousy=0.30,
        excess_expression=0.8 + 1.0 * bf.neuroticism,
    )


MODES = ("normal", "dere", "yami")

JEALOUSY_BANDS = ((0.25, "平静"), (0.55, "在意"), (1.01, "紧绷"))


@dataclass
class PersonState:

    affection: float = 0.15
    trust: float = 0.50


@dataclass
class StepRecord:

    t: int
    kind: str
    actor: str
    about: str
    valence: float
    arousal: float
    label: str
    affection: float
    trust: float
    jealousy: float
    mode: str
    intensity: float
    darkness: float

    def as_dict(self) -> dict:
        return dict(self.__dict__)


class YandereDynamics:

    def __init__(self, type_key: str = "病娇", params: Optional[dict] = None):
        if type_key not in TYPES:
            type_key = "病娇"
        self.type = type_key
        profile = TYPES[type_key]["profile"]
        self.p = profile
        if params:
            self.p = _replace(self.p, params)
        self.v = 0.0
        self.a = 0.0
        self.jealousy = 0.0
        self.mode = "normal"
        self.t = 0
        self._phase = 0.0
        self.persons: Dict[str, PersonState] = {}

    def perceive(self, event: Union[Event, str]) -> StepRecord:
        if isinstance(event, str):
            event = Event(kind=event)
        eff = effect_of(event)
        p = self.p
        person = self._person(event.actor)
        love = person.affection
        love2 = love * love

        gain_pos = p.k_react * (1.0 + p.k_excess * love2)
        gain_neg = p.k_react * (1.0 + p.k_excess * love2 * (0.6 + 1.4 * self.jealousy))
        gain = gain_pos if eff.valence >= 0 else gain_neg
        dv = eff.valence * gain
        da = eff.arousal * gain

        if p.deflect_positive and eff.valence > 0 and love < p.love_theta:
            dv *= p.deflect_factor
            da += p.tsun_arousal_boost

        dj = eff.jealousy * p.k_jealousy_sens * (0.3 + 0.7 * love)

        self.v = clamp_signed((self.v + dv) * (1.0 - p.decay_valence))
        self.a = clamp_signed((self.a + da) * (1.0 - p.decay_arousal))

        if self.mode == "yami":
            self._phase += p.rumination_omega
            swing = p.k_rumination * (0.4 + 0.6 * love) * (0.4 + 0.6 * self.jealousy)
            self.v = clamp_signed(self.v + swing * math.sin(self._phase))
            self.a = clamp_signed(self.a + 0.6 * swing * math.cos(self._phase))

        person.affection = clamp01(person.affection + eff.affection * p.k_affection_gain)
        person.trust = clamp01(person.trust + eff.trust + p.trust_recovery)
        self.jealousy = clamp01(self.jealousy + dj - p.decay_jealousy * self.jealousy)

        self._update_mode(person.affection)

        intensity = clamp01(max(self.v, 0.0) * (1.0 + p.excess_expression * love2))
        darkness = clamp01(max(-self.v, 0.0) * (1.0 + p.excess_expression * love2))

        record = StepRecord(
            t=self.t,
            kind=event.kind,
            actor=event.actor,
            about=event.about,
            valence=self.v,
            arousal=self.a,
            label=emotion_label(self.v, self.a),
            affection=person.affection,
            trust=person.trust,
            jealousy=self.jealousy,
            mode=self.mode,
            intensity=intensity,
            darkness=darkness,
        )
        self.t += 1
        return record

    def run(self, events) -> list:
        return [self.perceive(e) for e in events]

    def _person(self, name: str) -> PersonState:
        if name not in self.persons:
            self.persons[name] = PersonState()
        return self.persons[name]

    def _enter_yami(self, love: float) -> Optional[str]:
        p = self.p
        if (
            love >= p.love_theta
            and self.v <= p.yami_valence
            and (max(self.a, 0.0) >= p.yami_arousal_min or self.jealousy >= p.yami_jealousy)
        ):
            return "yami"
        return None

    def _update_mode(self, love: float) -> None:
        p = self.p
        entering = self._enter_yami(love)
        if entering is not None:
            self.mode = entering
            return
        if self.mode == "yami":
            if self.v > p.yami_exit_valence and self.jealousy < p.yami_exit_jealousy:
                dere = love >= p.love_theta and self.v >= p.dere_valence
                self.mode = "dere" if dere else "normal"
        elif self.mode == "dere":
            if love < p.love_theta or self.v < p.dere_valence - p.dere_margin:
                self.mode = "normal"
        else:
            if love >= p.love_theta and self.v >= p.dere_valence:
                self.mode = "dere"

    def primary(self, name: str = "you") -> PersonState:
        return self._person(name)

    def state(self) -> dict:
        person = self._person("you")
        return {
            "t": self.t,
            "mode": self.mode,
            "valence": round(self.v, 3),
            "arousal": round(self.a, 3),
            "label": emotion_label(self.v, self.a),
            "jealousy": round(self.jealousy, 3),
            "affection": round(person.affection, 3),
            "trust": round(person.trust, 3),
            "type": self.type,
        }

    def to_dict(self) -> dict:
        return {
            "type": self.type,
            "v": self.v,
            "a": self.a,
            "jealousy": self.jealousy,
            "mode": self.mode,
            "t": self.t,
            "phase": self._phase,
            "persons": {k: {"affection": s.affection, "trust": s.trust}
                        for k, s in self.persons.items()},
        }

    @classmethod
    def from_dict(cls, data: dict) -> "YandereDynamics":
        data = data or {}
        obj = cls(str(data.get("type") or "病娇"))
        obj.v = clamp_signed(float(data.get("v", 0.0)))
        obj.a = clamp_signed(float(data.get("a", 0.0)))
        obj.jealousy = clamp01(float(data.get("jealousy", 0.0)))
        obj.mode = data.get("mode") if data.get("mode") in MODES else "normal"
        obj.t = int(data.get("t", 0))
        obj._phase = float(data.get("phase", 0.0))
        for name, person in (data.get("persons") or {}).items():
            obj.persons[str(name)] = PersonState(
                affection=clamp01(float(person.get("affection", 0.15))),
                trust=clamp01(float(person.get("trust", 0.50))),
            )
        return obj


def _replace(profile: DereProfile, params: dict) -> DereProfile:
    known = {f: getattr(profile, f) for f in profile.__dataclass_fields__}
    for key, value in (params or {}).items():
        if key in known:
            known[key] = value
    return DereProfile(**known)


SAFE_AT = 0.70

_TONE = {
    "normal": "你的情绪大体平稳，对 ta 有好感但还没有到牵动心神的地步。",
    "dere": "你对 ta 的好感已经很明显：会主动靠近、想被回应，语气里藏不住在意。",
    "yami": "强烈的占有和不安压过了其它情绪：你会反复想确认 ta 在不在、会不会走，"
            "语气里带着紧绷和患得患失，但仍在克制，不越界。",
}


class YandereSystem:

    def __init__(self, enabled: bool = False, type_key: str = "病娇"):
        self.enabled = bool(enabled)
        self.dynamics = YandereDynamics(type_key)
        self.pending_events: list = []
        self.neglect_days = 0.0
        self.mood = 0.0
        self.load = 0.0

    def configure(self, enabled: Optional[bool] = None, type_key: Optional[str] = None) -> None:
        if enabled is not None:
            self.enabled = bool(enabled)
        if type_key and type_key in TYPES and type_key != self.dynamics.type:
            state = self.dynamics.to_dict()
            self.dynamics = YandereDynamics(type_key)
            restored = YandereDynamics.from_dict(state)
            restored.type = type_key
            restored.p = TYPES[type_key]["profile"]
            self.dynamics = restored

    def seed_from_persona(self, text: str) -> None:
        state = initial_state_for_persona(text)
        person = self.dynamics.primary()
        person.affection = state["affection"]
        person.trust = state["trust"]
        self.dynamics.jealousy = state["jealousy"]

    def seed_state(self, state: dict) -> None:
        person = self.dynamics.primary()
        for key, value in (state or {}).items():
            try:
                number = float(value)
            except (TypeError, ValueError):
                continue
            if key == "affection":
                person.affection = clamp01(number)
            elif key == "trust":
                person.trust = clamp01(number)
            elif key == "jealousy":
                self.dynamics.jealousy = clamp01(number)

    def observe_interaction(self, *, valence: float = 0.0, sentiment: float = 0.0,
                            latency_seconds: float = 0.0, recalled: bool = False,
                            mentions_other: bool = False) -> None:
        if not self.enabled:
            return
        warmth = max(0.0, float(valence)) + 0.5 * max(0.0, float(sentiment))
        if warmth > 0.0:
            kind = "praise" if warmth >= 0.35 else "chat"
            self._perceive(kind, weight=min(1.5, 0.8 + warmth))
        negative = max(0.0, -float(sentiment)) + max(0.0, -float(valence))
        if mentions_other:
            self._perceive("mention_other")
        if negative >= 0.35:
            self._perceive("ignore", weight=min(1.5, 0.8 + negative))
        elif latency_seconds and float(latency_seconds) >= 21600.0:
            self._perceive("late_reply")
        if recalled:
            self._perceive("late_reply", weight=0.6)

    def _perceive(self, kind: str, weight: float = 1.0) -> None:
        try:
            self.dynamics.perceive(Event(kind=kind, weight=weight))
        except ValueError:  # pragma: no cover - vocabulary is fixed
            pass

    def _set_neglect_baseline(self, neglect_days: float) -> None:
        if neglect_days <= 0:
            return
        self._perceive("late_reply", weight=min(1.0, 0.25 * neglect_days))

    def tick(self, days: float, *, neglect_days: float = 0.0,
             sleeping: bool = False, friends: int = 0,
             mood: float = 0.0, load: float = 0.0) -> None:
        if not self.enabled:
            return
        self.mood = clamp01(float(mood or 0.0))
        self.load = clamp01(float(load or 0.0))
        self.neglect_days = max(0.0, float(neglect_days))
        if days > 0:
            self._set_neglect_baseline(self.neglect_days)
            self.dynamics.perceive(Event("chat", weight=0.0))
        if sleeping:
            self.dynamics.jealousy = clamp01(self.dynamics.jealousy - 0.05 * max(0.0, days))
        if friends > 0:
            self.dynamics.jealousy = clamp01(
                self.dynamics.jealousy - 0.03 * min(3, friends) * max(0.0, days))
        self.dynamics.v = clamp_signed(self.dynamics.v * (1.0 - 0.10 * max(0.0, days)))

    def mode(self) -> str:
        return self.dynamics.mode if self.enabled else "normal"

    def intensity(self) -> float:
        return self._expression()[0]

    def darkness(self) -> float:
        return self._expression()[1]

    def fixation(self) -> float:
        return self._expression()[1]

    def jealousy(self) -> float:
        return self.dynamics.jealousy if self.enabled else 0.0

    def jealousy_band(self) -> str:
        value = self.jealousy()
        for threshold, name in JEALOUSY_BANDS:
            if value < threshold:
                return name
        return JEALOUSY_BANDS[-1][1]

    def _expression(self) -> tuple:
        if not self.enabled:
            return 0.0, 0.0
        love = self.dynamics.primary().affection
        love2 = love * love
        excess = 1.0 + self.dynamics.p.excess_expression * love2
        return (clamp01(max(self.dynamics.v, 0.0) * excess),
                clamp01(max(-self.dynamics.v, 0.0) * excess))

    def distress(self) -> float:
        if not self.enabled:
            return 0.0
        return clamp01(0.7 * max(0.0, self.fixation() - 0.2) / 0.8)

    def context(self) -> dict:
        if not self.enabled:
            return {"enabled": False}
        love = self.dynamics.primary().affection
        return {
            "enabled": True,
            "type": self.dynamics.type,
            "label": TYPES[self.dynamics.type]["label"],
            "mode": self.dynamics.mode,
            "affection": round(love, 4),
            "trust": round(self.dynamics.primary().trust, 4),
            "jealousy": round(self.dynamics.jealousy, 4),
            "jealousy_band": self.jealousy_band(),
            "intensity": round(self.intensity(), 4),
            "darkness": round(self.darkness(), 4),
            "label_russell": emotion_label(self.dynamics.v, self.dynamics.a),
            "valence": round(self.dynamics.v, 4),
            "arousal": round(self.dynamics.a, 4),
            "safe_mode": self.fixation() >= SAFE_AT,
            "prompt": self._prompt(),
        }

    def _prompt(self) -> str:
        line = _TONE.get(self.dynamics.mode, "")
        hint = str(TYPES[self.dynamics.type].get("hint") or "")
        if hint:
            line += f"（你的底色：{hint}）"
        if self.jealousy() >= 0.25:
            line += "（你最近有些介意 ta 的注意力去了别处。）"
        return line

    def guard(self) -> str:
        return safety_guard(self.enabled, self.fixation(), SAFE_AT)

    def to_dict(self) -> dict:
        return {
            "enabled": self.enabled,
            "dynamics": self.dynamics.to_dict(),
            "neglect_days": self.neglect_days,
            "mood": self.mood,
            "load": self.load,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "YandereSystem":
        data = data or {}
        dynamics = data.get("dynamics") or {}
        obj = cls(enabled=bool(data.get("enabled")),
                  type_key=str(dynamics.get("type") or "病娇"))
        obj.dynamics = YandereDynamics.from_dict(dynamics)
        obj.neglect_days = float(data.get("neglect_days", 0.0))
        obj.mood = float(data.get("mood", 0.0))
        obj.load = float(data.get("load", 0.0))
        return obj
