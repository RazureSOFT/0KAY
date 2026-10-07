"""Yandere affect dynamics — a LIFE circuit ported from the ``yandere_engine`` research model.

Provenance
----------
This is a faithful port of the standalone research engine at ``life_research/
yandere_engine``, itself a computational reconstruction of:

    柳朋輝・米澤朋子 (2023)「仮想エージェントにおけるヤンデレの実装」
    (HAI シンポジウム 2023, P-60)

which defines ヤンデレ as *「過度な好意による感情の急変と過剰な愛情表現」* —
"abrupt emotional swings and excessive expressions of love, both caused by
excessive affection". The paper is decomposed into three computable claims:

* **C1 急変 (sudden flip)** — the affective reaction gain is a superlinear
  function of affection ``A``::

      g⁺(A)   = k_react · (1 + k_excess · A²)
      g⁻(A,J) = k_react · (1 + k_excess · A² · (0.6 + 1.4·J))

  so the *same* event moves a deeply-attached character far more violently than
  a detached one, and negative shocks are amplified further by jealousy ``J``.
* **C2 過剰 (excess)** — expression intensity is superlinear in affection::

      I = max(v, 0) · (1 + excess_expression · A²)

* **C3 円環 (circumplex + hysteresis)** — the internal state is a point
  ``(valence, arousal)`` on Russell's (1980) circumplex, and a *hysteretic*
  mode machine switches between NORMAL / DERE / YAMI (病み), with separate
  entry and exit thresholds plus a jealousy-calming condition for the exit.

Relationship to the rest of the cognition layer
-----------------------------------------------
LIFE already carries three neighbouring models, and this circuit is deliberately
kept separate from all of them:

* ``cognition/attachment.py`` — *pathological attachment styles* (a static
  taxonomy: 依存型 / 妄想型 / …).
* ``cognition/tsundere.py`` — a three-variable ODE (A/T/Y) whose blackening is
  driven by ``k_y·A·r`` (rejection of an attached heart).
* ``cognition/persona_dynamics.py`` — a Q-learning action-selection layer that
  *also* names a ``yandere`` mode.

This module is the **published-paper formalisation**: an event vocabulary with
raw psychological impacts, a superlinear reaction gain, and a circumplex mode
machine. It is **opt-in** (``enabled=False`` by default) so a default install is
byte-for-byte unchanged, exactly like the tsundere circuit.

Honest limitations (carried over from the research engine)
----------------------------------------------------------
The gains, thresholds and event magnitudes are **documented assumptions chosen
to reproduce the direction of the paper's claims**, not values fitted to the
paper's data (the paper is four pages and reports no fitted coefficients). The
mechanism *directions* — circumplex state, affection-gated sudden flips,
yandere/dere switching, per-user identification — are faithful to the paper.

This is a **fictional behaviour model, not a diagnostic tool**, and must never
be used to judge real people.
"""
from __future__ import annotations

import math
from dataclasses import asdict, dataclass, field
from typing import Dict, Optional, Union

from .common import (
    clamp01,
    clamp_signed,
    emotion_label,
    match_persona_hints,
    safety_guard,
)

# The internal state lives on Russell's (1980) affect circumplex; the coordinate
# system and its octant labelling are shared with the rest of the package (see
# ``cognition/common.py``). ``clamp_signed`` is the -1..1 bounds of that plane
# and ``clamp01`` the 0..1 bounds of affection / trust / jealousy.

# --------------------------------------------------------------------------- #
# event vocabulary — the "user identification / state recognition" input layer
# --------------------------------------------------------------------------- #


@dataclass(frozen=True)
class EventEffect:
    """Raw psychological impact of one event, before personality amplifies it."""

    valence: float = 0.0
    arousal: float = 0.0
    affection: float = 0.0
    trust: float = 0.0
    jealousy: float = 0.0


#: Event kinds that move jealousy.
JEALOUSY_KINDS = frozenset(
    {"late_reply", "ignore", "mention_other", "contact_rival", "lie", "betrayal"}
)

#: The twelve event kinds. Magnitudes are the research engine's documented
#: assumptions (see the module docstring's limitations note).
EVENT_EFFECTS: Dict[str, EventEffect] = {
    # --- building affection ---
    "praise": EventEffect(valence=+0.35, arousal=+0.20, affection=+0.05, trust=+0.02),
    "chat": EventEffect(valence=+0.15, arousal=+0.15, affection=+0.03, trust=+0.01),
    "gift": EventEffect(valence=+0.40, arousal=+0.30, affection=+0.07, trust=+0.04),
    "special_day": EventEffect(valence=+0.45, arousal=+0.30, affection=+0.06, trust=+0.03),
    "reunion": EventEffect(valence=+0.45, arousal=+0.35, affection=+0.06, trust=+0.02),
    # --- repair ---
    "apologize": EventEffect(valence=+0.20, arousal=-0.15, trust=+0.07, jealousy=-0.35),
    # --- mild negatives (jealousy accrues) ---
    "late_reply": EventEffect(valence=-0.15, arousal=+0.15, jealousy=+0.15, trust=-0.02),
    "ignore": EventEffect(valence=-0.30, arousal=+0.25, jealousy=+0.22, trust=-0.06),
    "mention_other": EventEffect(valence=-0.35, arousal=+0.35, jealousy=+0.30, trust=-0.03),
    # --- heavy negatives ---
    "contact_rival": EventEffect(valence=-0.60, arousal=+0.50, jealousy=+0.45, trust=-0.10),
    "lie": EventEffect(valence=-0.45, arousal=+0.40, jealousy=+0.15, trust=-0.30),
    "betrayal": EventEffect(valence=-0.90, arousal=+0.60, affection=-0.35, jealousy=+0.50, trust=-0.60),
}


@dataclass(frozen=True)
class Event:
    """One user-side action.

    ``kind``   — a key of :data:`EVENT_EFFECTS`
    ``actor``  — who acted (the identification target; the beloved ``primary``)
    ``about``  — whom the action was directed at (a rival's name, for records)
    ``weight`` — intensity multiplier ("praised *a lot*" = 1.5)
    ``note``   — free-form memo
    """

    kind: str
    actor: str = "you"
    about: str = ""
    weight: float = 1.0
    note: str = ""


def effect_of(event: Event) -> EventEffect:
    """Turn an event into its raw impact (scaled by ``weight``, vocabulary-checked)."""
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


# --------------------------------------------------------------------------- #
# personality profiles — the individual-difference parameters of the dynamics
# --------------------------------------------------------------------------- #


@dataclass(frozen=True)
class DereProfile:
    """The dynamics parameters that separate one archetype from another."""

    name: str
    description: str

    # --- reactivity (C1: the sudden flip) ---
    k_react: float = 1.0          # base gain applied to every impact
    k_excess: float = 2.2         # superlinear amplification by A²
    k_jealousy_sens: float = 1.6  # sensitivity to jealousy
    k_rumination: float = 0.12    # agitation swing while in YAMI
    rumination_omega: float = 1.3

    # --- affection dynamics ---
    k_affection_gain: float = 1.0
    love_theta: float = 0.35      # below this affection, neither dere nor yami

    # --- mode thresholds (on the circumplex) ---
    dere_valence: float = 0.15
    yami_valence: float = -0.25
    yami_arousal_min: float = 0.30
    yami_jealousy: float = 0.40
    dere_margin: float = 0.10     # dere-exit hysteresis
    yami_exit_valence: float = 0.10
    yami_exit_jealousy: float = 0.30

    # --- façade deflection (tsundere only) ---
    deflect_positive: bool = False
    deflect_factor: float = -0.6
    tsun_arousal_boost: float = 0.15

    # --- decay ---
    decay_valence: float = 0.25
    decay_arousal: float = 0.35
    decay_jealousy: float = 0.08
    trust_recovery: float = 0.004

    # --- expression (C2: the excess) ---
    excess_expression: float = 1.4


#: 柳・米澤 (2023)'s definition, as an implementation.
YANDERE_PROFILE = DereProfile(
    name="yandere",
    description="過度な好意による感情の急変と過剰な愛情表現",
)

#: Contrast: tsundere — a façade gate, restrained jealousy and flips.
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

#: Contrast: a neutral character that never reaches YAMI.
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

#: Exploratory: tsundere façade + yandere jealousy/flip ("傲娇→病娇" hypothesis).
#: **No published paper corresponds to this** — it is an engine-only hypothesis,
#: to be used for speculation, never cited as a literature result.
HYBRID_PROFILE = DereProfile(
    name="hybrid_tsun_yan",
    description="探索的拡張: 建前で始まり、好意が溜まると急変・病みうる（非論文準拠）",
    k_excess=2.0,
    k_jealousy_sens=1.4,
    k_rumination=0.10,
    love_theta=0.45,
    deflect_positive=True,
)

#: Archetype key -> {label, hint, profile, prompt tone}. LIFE picks one by name;
#: the four share one system and differ only in parameters.
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

#: Persona keywords -> archetype. Lets a written persona turn the circuit on and
#: pick a type without the owner touching settings.
PERSONA_HINTS = (
    ("病娇", ("病娇", "执念", "占有欲", "黑化", "情敌", "不许别人", "ヤンデレ")),
    ("傲娇→病娇", ("傲娇", "口嫌体正直", "嘴硬", "毒舌", "tsundere")),
)

#: Persona phrase -> initial state nudges, so "嘴硬但很黏" and "嘴硬但很疏离"
#: start from different basins.
INITIAL_HINTS: Dict[str, tuple] = {
    "affection": ("喜欢", "爱", "在意", "心动", "黏", "粘", "依赖"),
    "jealousy": ("病娇", "执念", "占有", "黑化", "复仇", "吃醋", "嫉妒"),
}


def type_for_persona(text: str) -> str:
    """Best archetype for a persona description, or "" when none fits."""
    return match_persona_hints(text, PERSONA_HINTS)


def initial_state_for_persona(text: str, base: Optional[dict] = None) -> dict:
    """Initial dynamics state derived from a persona description.

    A persona that already says "病娇、占有欲强" starts with jealousy seeded, so
    it sits closer to the YAMI basin from the first turn.
    """
    state = dict(base or {"affection": 0.15, "trust": 0.50, "jealousy": 0.0})
    body = str(text or "")
    if any(word in body for word in INITIAL_HINTS["affection"]):
        state["affection"] = clamp01(state["affection"] + 0.20)
    if any(word in body for word in INITIAL_HINTS["jealousy"]):
        state["jealousy"] = clamp01(state["jealousy"] + 0.25)
    return state


# --------------------------------------------------------------------------- #
# traits bridge — OCEAN -> dynamics parameters
# --------------------------------------------------------------------------- #


@dataclass(frozen=True)
class BigFive:
    """OCEAN, each component in 0..1."""

    openness: float
    conscientiousness: float
    extraversion: float
    agreeableness: float
    neuroticism: float

    def as_dict(self) -> dict:
        return {k: round(v, 3) for k, v in asdict(self).items()}


#: The psychological-scale signature reported for yandere: low agreeableness,
#: high neuroticism, high conscientiousness (which acts as the suppression
#: force in the "suppression and acting" paper).
YANDERE_SIGNATURE = BigFive(
    openness=0.50,
    conscientiousness=0.70,
    extraversion=0.60,
    agreeableness=0.25,
    neuroticism=0.85,
)


def yandere_signature_score(bf: BigFive) -> float:
    """Closeness to :data:`YANDERE_SIGNATURE` (0..1)."""
    diffs = (
        abs(bf.openness - YANDERE_SIGNATURE.openness) * 0.5,
        abs(bf.conscientiousness - YANDERE_SIGNATURE.conscientiousness) * 1.0,
        abs(bf.extraversion - YANDERE_SIGNATURE.extraversion) * 0.5,
        abs(bf.agreeableness - YANDERE_SIGNATURE.agreeableness) * 1.5,
        abs(bf.neuroticism - YANDERE_SIGNATURE.neuroticism) * 1.5,
    )
    return round(clamp01(1.0 - sum(diffs) / 2.5), 3)


def traits_to_profile(bf: BigFive, name: str = "derived") -> DereProfile:
    """Map OCEAN traits onto the dynamics parameters.

    Feeding :data:`YANDERE_SIGNATURE` (high N, low A, high C) yields the
    parameters that produce the paper's behavioural signature (sudden flips,
    jealousy, YAMI) — the "[2] -> [17] -> [1]" composite inference of the
    research engine.
    """
    return DereProfile(
        name=name,
        description=f"traits→dynamics mapping from OCEAN {bf.as_dict()}",
        # neuroticism drives the sudden-flip amplification (C1)
        k_excess=0.8 + 3.0 * bf.neuroticism ** 2,
        # low agreeableness drives jealousy sensitivity
        k_jealousy_sens=0.3 + 1.8 * (1.0 - bf.agreeableness),
        k_rumination=0.16 * bf.neuroticism,
        rumination_omega=1.3,
        k_affection_gain=1.0,
        # extraversion: how easily affection accrues and how low the dere gate is
        love_theta=max(0.15, 0.45 - 0.15 * bf.extraversion),
        dere_valence=0.25 - 0.15 * bf.extraversion,
        # neuroticism: how low the YAMI gate is
        yami_valence=-0.10 - 0.30 * bf.neuroticism,
        yami_arousal_min=0.28 + 0.65 * (1.0 - bf.neuroticism),
        yami_jealousy=0.55 - 0.25 * bf.neuroticism,
        # conscientiousness (suppression): the width of the hysteresis
        dere_margin=0.05 + 0.20 * bf.conscientiousness,
        yami_exit_valence=0.10,
        yami_exit_jealousy=0.30,
        # the excess expression (C2) is also neuroticism-driven
        excess_expression=0.8 + 1.0 * bf.neuroticism,
    )


# --------------------------------------------------------------------------- #
# the dynamics — C1 / C2 / C3
# --------------------------------------------------------------------------- #

#: The three modes the paper names: 日常 / デレ / 病み.
MODES = ("normal", "dere", "yami")

#: Jealousy band names for the read-out.
JEALOUSY_BANDS = ((0.25, "平静"), (0.55, "在意"), (1.01, "紧绷"))


@dataclass
class PersonState:
    """The agent's internal state *about one person* (user identification)."""

    affection: float = 0.15  # 好意 A_p
    trust: float = 0.50      # 信頼 T_p


@dataclass
class StepRecord:
    """A complete record of one perception step (the unit of verification)."""

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
    intensity: float  # C2 expression intensity
    darkness: float   # yami concentration

    def as_dict(self) -> dict:
        return dict(self.__dict__)


class YandereDynamics:
    """The circumplex dynamics: C1 gain, C2 expression, C3 hysteretic modes.

    Pure state — no I/O, no rendering, no RNG. Deterministic given the event
    sequence, which is what makes the research claims testable.
    """

    def __init__(self, type_key: str = "病娇", params: Optional[dict] = None):
        if type_key not in TYPES:
            type_key = "病娇"
        self.type = type_key
        profile = TYPES[type_key]["profile"]
        self.p = profile
        if params:
            self.p = _replace(self.p, params)
        self.v = 0.0            # circumplex valence
        self.a = 0.0            # circumplex arousal
        self.jealousy = 0.0     # 嫉妬 J (global)
        self.mode = "normal"
        self.t = 0
        self._phase = 0.0       # rumination oscillator phase
        self.persons: Dict[str, PersonState] = {}

    # -- perception --------------------------------------------------------
    def perceive(self, event: Union[Event, str]) -> StepRecord:
        """Perceive one event, advance the state one step, return the record."""
        if isinstance(event, str):
            event = Event(kind=event)
        eff = effect_of(event)
        p = self.p
        person = self._person(event.actor)
        love = person.affection
        love2 = love * love

        # --- C1: affection-gated reaction gain (the "sudden flip") ---
        gain_pos = p.k_react * (1.0 + p.k_excess * love2)
        gain_neg = p.k_react * (1.0 + p.k_excess * love2 * (0.6 + 1.4 * self.jealousy))
        gain = gain_pos if eff.valence >= 0 else gain_neg
        dv = eff.valence * gain
        da = eff.arousal * gain

        # Façade (tsundere): deflect positive events while affection is immature.
        if p.deflect_positive and eff.valence > 0 and love < p.love_theta:
            dv *= p.deflect_factor
            da += p.tsun_arousal_boost

        # Jealousy moves more readily the more attached the character is.
        dj = eff.jealousy * p.k_jealousy_sens * (0.3 + 0.7 * love)

        # --- integration on the circumplex (impact -> damped relaxation) ---
        self.v = clamp_signed((self.v + dv) * (1.0 - p.decay_valence))
        self.a = clamp_signed((self.a + da) * (1.0 - p.decay_arousal))

        # Rumination while in YAMI: low-frequency oscillation of the state.
        if self.mode == "yami":
            self._phase += p.rumination_omega
            swing = p.k_rumination * (0.4 + 0.6 * love) * (0.4 + 0.6 * self.jealousy)
            self.v = clamp_signed(self.v + swing * math.sin(self._phase))
            self.a = clamp_signed(self.a + 0.6 * swing * math.cos(self._phase))

        # --- relationship state ---
        person.affection = clamp01(person.affection + eff.affection * p.k_affection_gain)
        person.trust = clamp01(person.trust + eff.trust + p.trust_recovery)
        self.jealousy = clamp01(self.jealousy + dj - p.decay_jealousy * self.jealousy)

        # --- C3: hysteretic mode transition ---
        self._update_mode(person.affection)

        # --- C2: output (excess expression / yami darkness) ---
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
        """Perceive an event sequence in order."""
        return [self.perceive(e) for e in events]

    # -- internals ---------------------------------------------------------
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
            # The exit needs a *higher* valence than the entry (hysteresis) and
            # a calmed jealousy.
            if self.v > p.yami_exit_valence and self.jealousy < p.yami_exit_jealousy:
                dere = love >= p.love_theta and self.v >= p.dere_valence
                self.mode = "dere" if dere else "normal"
        elif self.mode == "dere":
            if love < p.love_theta or self.v < p.dere_valence - p.dere_margin:
                self.mode = "normal"
        else:  # normal
            if love >= p.love_theta and self.v >= p.dere_valence:
                self.mode = "dere"

    # -- state -------------------------------------------------------------
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
    """Return ``profile`` with the given field overrides applied."""
    known = {f: getattr(profile, f) for f in profile.__dataclass_fields__}
    for key, value in (params or {}).items():
        if key in known:
            known[key] = value
    return DereProfile(**known)


# --------------------------------------------------------------------------- #
# the façade — real interaction signals in, prompt/status out
# --------------------------------------------------------------------------- #

#: At/above this darkness the generation layer has to de-escalate.
SAFE_AT = 0.70

#: Mode -> prompt tone, in the same voice the other LIFE circuits use.
_TONE = {
    "normal": "你的情绪大体平稳，对 ta 有好感但还没有到牵动心神的地步。",
    "dere": "你对 ta 的好感已经很明显：会主动靠近、想被回应，语气里藏不住在意。",
    "yami": "强烈的占有和不安压过了其它情绪：你会反复想确认 ta 在不在、会不会走，"
            "语气里带着紧绷和患得患失，但仍在克制，不越界。",
}


class YandereSystem:
    """Façade: turns real interaction signals into events, reads the drift out.

    Gated by ``enabled`` so a default install is unchanged. The drives decay
    toward baseline between interactions, so a burst of warmth does not read as
    permanent affection.
    """

    def __init__(self, enabled: bool = False, type_key: str = "病娇"):
        self.enabled = bool(enabled)
        self.dynamics = YandereDynamics(type_key)
        #: Set by :meth:`observe_interaction`; consumed by :meth:`tick`.
        self.pending_events: list = []
        self.neglect_days = 0.0
        self.mood = 0.0
        self.load = 0.0

    # -- configuration -----------------------------------------------------
    def configure(self, enabled: Optional[bool] = None, type_key: Optional[str] = None) -> None:
        if enabled is not None:
            self.enabled = bool(enabled)
        if type_key and type_key in TYPES and type_key != self.dynamics.type:
            # Keep the learned state when only the archetype changes: the
            # parameters move, the history does not.
            state = self.dynamics.to_dict()
            self.dynamics = YandereDynamics(type_key)
            restored = YandereDynamics.from_dict(state)
            restored.type = type_key
            restored.p = TYPES[type_key]["profile"]
            self.dynamics = restored

    def seed_from_persona(self, text: str) -> None:
        """Set the initial relationship state from a persona description."""
        state = initial_state_for_persona(text)
        person = self.dynamics.primary()
        person.affection = state["affection"]
        person.trust = state["trust"]
        self.dynamics.jealousy = state["jealousy"]

    def seed_state(self, state: dict) -> None:
        """Set the initial relationship state from explicit (owner-tuned) values."""
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

    # -- inputs ------------------------------------------------------------
    def observe_interaction(self, *, valence: float = 0.0, sentiment: float = 0.0,
                            latency_seconds: float = 0.0, recalled: bool = False,
                            mentions_other: bool = False) -> None:
        """Map one real exchange onto an event and apply it.

        Warmth becomes ``chat``/``praise``; negativity, a slow reply, a recalled
        message and a rival cue become the jealousy-bearing negatives.
        """
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
        """Silence keeps the state drifting on its own."""
        if neglect_days <= 0:
            return
        # A long silence is a slow accumulation of the "late reply" signal,
        # applied at most once per tick so it cannot runaway.
        self._perceive("late_reply", weight=min(1.0, 0.25 * neglect_days))

    # -- time --------------------------------------------------------------
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
            self.dynamics.perceive(Event("chat", weight=0.0))  # decay-only step
        # A character that is asleep or has other real warmth to lean on is
        # harder to blacken: those are the model's "external support" analogue,
        # which show up as a calm-down of jealousy.
        if sleeping:
            self.dynamics.jealousy = clamp01(self.dynamics.jealousy - 0.05 * max(0.0, days))
        if friends > 0:
            self.dynamics.jealousy = clamp01(
                self.dynamics.jealousy - 0.03 * min(3, friends) * max(0.0, days))
        self.dynamics.v = clamp_signed(self.dynamics.v * (1.0 - 0.10 * max(0.0, days)))

    # -- read-out ----------------------------------------------------------
    def mode(self) -> str:
        return self.dynamics.mode if self.enabled else "normal"

    def intensity(self) -> float:
        return self._expression()[0]

    def darkness(self) -> float:
        return self._expression()[1]

    def fixation(self) -> float:
        """YAMI concentration in 0..1 (``darkness`` under a friendlier name)."""
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
        """Fixation exported back to the affect layer (0..1).

        A blackening character is itself under chronic strain, so it feeds the
        mood system the way attachment distress does.
        """
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
        """Hard safety instruction for the output model at/above the safe band.

        Private directive: obeyed, never spoken or paraphrased (see the same
        note on ``TsundereSystem.guard``).
        """
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
