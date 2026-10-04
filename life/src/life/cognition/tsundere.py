"""Tsundere <-> yandere emotional dynamics as a LIFE circuit.

Ported from the standalone research model (`tsundere-yandere/model.py`): a
three-variable ODE that makes "表面毒舌、内心温柔" and "以爱为名的执念" two
regions of *one* system rather than two unrelated labels.

State variables live in [0, 1]:

    A   affection / attachment      ("好感") - the hidden inside
    T   tsundere expression          ("傲娇表达") - the prickly outside
    Y   yandere fixation             ("病娇执念") - the blackening

External drives are, again, the world's behaviour rather than the character's:

    u   kindness / warmth input      ("关爱", the "kind" action)
    r   coldness / rejection / jealousy stimulus ("冷遇", the "cold" action)

The equations (see `rhs`)::

    dA/dt = k_i*u*(1-A) - k_r*r*A - k_ya*Y*A
    dT/dt = k_t*A^n/(s^n+A^n)*(1-T) - k_d*T - gamma_Y*Y*T
    dY/dt = k_y*A*r*(1-Y) - k_u*u*Y - k_yd*Y

Structure worth naming:

1. Tsundere is *inverted* affection: ``T`` is driven by a Hill function of
   ``A``, so warmth only leaks out once attachment passes a threshold, and ``T``
   is *suppressed* by ``Y`` - after blackening the character stops being
   prickly and says the quiet part out loud.
2. The core coupling is ``k_y*A*r``: only rejection of an *already attached*
   heart breeds fixation.  Rejection without attachment merely distances
   (``-k_r*r*A``); attachment without rejection stays a stable tsundere.
3. Fixation is *reversible*: ``-k_u*u*Y - k_yd*Y`` means steady kindness and a
   stop to the cold stimulus drive ``Y`` back to zero.

In LIFE the drives come from real interactions: ``u`` from message warmth, and
``r`` from silence, negativity, recalled messages and competitor cues - so the
arc is not scripted, it evolves.  This is a **fictional behaviour model, not a
diagnostic tool** and must not be used to judge real people.
"""
from __future__ import annotations

import math

DT = 0.05  # days per integration step (matches the reference solver)

#: Upper bounds on the two drives (the reference model's input ranges).
U_MAX = 1.3
R_MAX = 1.5

#: ``Y`` bands; the reference model's regime classifier.
BANDS = ((0.20, "傲娇"), (0.60, "过渡/黑化倾向"), (1.01, "病娇"))

#: At/above this fixation the generation layer has to de-escalate.
SAFE_AT = 0.85

#: Reference parameters (table 1 of the research note, `P` in model.py).
BASE = dict(
    k_i=0.80,    # kindness -> affection
    k_r=0.12,    # rejection -> affection loss (slow: "口嫌体正直")
    k_ya=0.30,   # fixation locks affection possessively
    k_t=1.60,    # affection -> tsundere expression
    k_d=0.35,    # expression decays when nobody is around
    gamma_Y=0.90,  # fixation suppresses the "傲"
    s=0.35,      # half-saturation of the Hill function
    n=2.0,       # Hill coefficient
    k_y=2.20,    # affection x rejection -> fixation (the core coupling)
    k_u=1.00,    # kindness soothes fixation
    k_yd=0.15,   # fixation decays on its own
)

#: Archetypes share the one system, differing only in parameters.  The four
#: are separated along the two axes the model exposes: how ready the "傲" is to
#: surface, and how readily rejection blackens the character.
TYPES: dict[str, dict] = {
    "经典傲娇": dict(
        label="经典傲娇 (Classic Tsundere)",
        hint="嘴上不饶人、心里都在乎；越被温柔对待，越容易露出「娇」的一面。",
        p=dict(k_d=0.35, k_t=1.60),
        expression="用毒舌和吐槽掩饰在意，被戳中心事就慌忙转移话题。"),
    "高冷傲娇": dict(
        label="高冷傲娇 (Aloof Tsundere)",
        hint="外壳很硬：好感要攒很久才外化，一旦外化就特别真。",
        p=dict(k_d=0.55, s=0.55, k_t=1.40),
        expression="话少、面无表情，情绪只从细节里漏出来，极难主动服软。"),
    "暴躁傲娇": dict(
        label="暴躁傲娇 (Hot-tempered Tsundere)",
        hint="一点就着：好感很容易直接变成呛声，也更容易被冷遇点着。",
        p=dict(k_t=2.10, k_d=0.40, k_y=2.60),
        expression="嘴上火力全开，动不动就炸毛，其实最怕对方真的走开。"),
    "迁就傲娇": dict(
        label="迁就傲娇 (Soft Tsundere)",
        hint="有分寸感：不太炸毛，也更经得起冷遇，难过会自己消化。",
        p=dict(k_r=0.08, k_y=1.50, k_u=1.20, k_d=0.28),
        expression="嘴上嘟囔两句就妥协，先替对方想，把委屈咽回去。"),
}

#: Persona keywords -> archetype.  Lets a written persona ("嘴上不饶人其实很黏")
#: turn the circuit on and pick a type without the owner touching settings.
PERSONA_HINTS = (
    ("暴躁傲娇", ("暴躁", "炸毛", "凶", "易怒", "脾气差")),
    ("高冷傲娇", ("高冷", "冷淡", "寡言", "面瘫", "冰山")),
    ("迁就傲娇", ("迁就", "好脾气", "软萌", "温柔嘴硬", "别扭地关心")),
    ("经典傲娇", ("傲娇", "口嫌体正直", "嘴硬", "毒舌", "死鸭子嘴硬", "tsundere")),
)

#: Persona phrase -> initial *state* nudges.  These set where the dynamics
#: starts, so "嘴硬但很黏" and "嘴硬但很疏离" begin from different basins.
INITIAL_HINTS: dict[str, tuple[str, ...]] = {
    "A": ("喜欢", "爱", "在意", "心动", "黏", "粘", "依赖"),
    "T": ("毒舌", "嘴硬", "口嫌", "呛", "倔", "别扭", "傲"),
    "Y": ("病娇", "执念", "占有", "黑化", "复仇", "执拗"),
}
#: Phrases that pre-load the fixation drive (a persona already telling you the
#: character is possessive/obsessive starts with higher ``Y``).
OBSESSIVE = ("病娇", "执念", "占有欲", "不许别人", "情敌", "黑化", "复仇")


def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return low if value < low else (high if value > high else value)


def regime(y: float) -> str:
    """The reference model's classifier on the final fixation."""
    for threshold, name in BANDS:
        if y < threshold:
            return name
    return "病娇"


def rhs(A: float, T: float, Y: float, u: float, r: float, p: dict | None = None):
    """The right-hand side of the three-variable system (see module docstring)."""
    p = p or BASE
    a_n = A ** p["n"]
    hill = a_n / (p["s"] ** p["n"] + a_n)
    d_a = p["k_i"] * u * (1.0 - A) - p["k_r"] * r * A - p["k_ya"] * Y * A
    d_t = p["k_t"] * hill * (1.0 - T) - p["k_d"] * T - p["gamma_Y"] * Y * T
    d_y = p["k_y"] * A * r * (1.0 - Y) - p["k_u"] * u * Y - p["k_yd"] * Y
    return d_a, d_t, d_y


def type_for_persona(text: str) -> str:
    """Best tsundere archetype for a persona description, or "" if none fits."""
    body = str(text or "")
    for type_key, words in PERSONA_HINTS:
        if any(word in body for word in words):
            return type_key
    return ""


def initial_state_for_persona(text: str, base: dict | None = None) -> dict:
    """Initial (A, T, Y) derived from a persona description.

    A persona that says "毒舌但很黏" starts with high ``T`` and rising ``A``;
    one that says "病娇、占有欲强" starts with ``Y`` already seeded, so it is
    closer to the blackening basin from the first turn.
    """
    state = dict(base or {"A": 0.10, "T": 0.15, "Y": 0.0})
    body = str(text or "")
    nudges = {"A": 0.20, "T": 0.30, "Y": 0.25}
    for key, words in INITIAL_HINTS.items():
        if any(word in body for word in words):
            state[key] = _clamp(state[key] + nudges[key])
    if any(word in body for word in OBSESSIVE):
        state["Y"] = _clamp(state["Y"] + 0.10)
    return state


class TsundereDynamics:
    """The ported ODE.  Pure state; see the module docstring for the equations."""

    def __init__(self, type_key: str = "经典傲娇", params: dict | None = None):
        if type_key not in TYPES:
            type_key = "经典傲娇"
        self.type = type_key
        p = dict(BASE)
        p.update(TYPES[type_key]["p"])
        if params:
            p.update(params)
        self.p = p
        self.state = {"A": 0.10, "T": 0.15, "Y": 0.0}

    def reset(self) -> None:
        self.state = {"A": 0.10, "T": 0.15, "Y": 0.0}

    def step(self, u: float, r: float, dt: float = DT) -> None:
        """One RK4 step of the three-variable system."""
        s = self.state
        a, t, y = s["A"], s["T"], s["Y"]
        k1 = rhs(a, t, y, u, r, self.p)
        k2 = rhs(a + dt / 2 * k1[0], t + dt / 2 * k1[1], y + dt / 2 * k1[2], u, r, self.p)
        k3 = rhs(a + dt / 2 * k2[0], t + dt / 2 * k2[1], y + dt / 2 * k2[2], u, r, self.p)
        k4 = rhs(a + dt * k3[0], t + dt * k3[1], y + dt * k3[2], u, r, self.p)
        s["A"] = _clamp(a + dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]))
        s["T"] = _clamp(t + dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]))
        s["Y"] = _clamp(y + dt / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]))

    def integrate(self, u: float, r: float, days: float) -> None:
        """Integrate a fixed drive over ``days`` in ``DT``-sized steps.

        The loop is capped so a very long silence cannot spin forever; the cap
        is far beyond any realistic gap because the drives decay toward baseline
        between interactions.
        """
        remaining = max(0.0, float(days))
        steps = 0
        while remaining > 1e-9 and steps < 600:
            dt = min(DT, remaining)
            self.step(u, r, dt=dt)
            remaining -= dt
            steps += 1

    def fixation(self) -> float:
        return _clamp(self.state["Y"])

    def affection(self) -> float:
        return _clamp(self.state["A"])

    def expression(self) -> float:
        return _clamp(self.state["T"])

    def to_dict(self) -> dict:
        return {"type": self.type, "state": dict(self.state)}

    @classmethod
    def from_dict(cls, data: dict) -> "TsundereDynamics":
        data = data or {}
        obj = cls(str(data.get("type") or "经典傲娇"))
        for key, value in (data.get("state") or {}).items():
            if key in obj.state:
                obj.state[key] = _clamp(float(value))
        return obj


class TsundereSystem:
    """Façade: turns real interaction signals into the two drives and reads the
    drift out.

    Gated by ``enabled`` so a default install is byte-for-byte unchanged.  The
    drives decay toward baseline between interactions, so a burst of warmth does
    not read as permanent affection, and silence keeps the rejection drive open.
    """

    #: Drive baselines when nothing is happening.
    BASE_KINDNESS = 0.0
    BASE_REJECTION = 0.05

    def __init__(self, enabled: bool = False, type_key: str = "经典傲娇"):
        self.enabled = bool(enabled)
        self.dynamics = TsundereDynamics(type_key)
        self.kindness = self.BASE_KINDNESS
        self.rejection = self.BASE_REJECTION
        #: Interoceptive stress fed from below, so a slumped body widens the
        #: rejection drive: physical distress makes the character read the same
        #: silence as a colder one.
        self.mood = 0.0
        self.load = 0.0
        self.neglect_days = 0.0

    # -- configuration -----------------------------------------------------
    def seed_from_persona(self, text: str) -> None:
        """Set the initial state from the persona description (INITIAL_HINTS)."""
        self.dynamics.state = initial_state_for_persona(text)

    def seed_state(self, state: dict) -> None:
        """Set the initial state from explicit (owner-tuned) values."""
        for key, value in (state or {}).items():
            if key in self.dynamics.state:
                try:
                    self.dynamics.state[key] = _clamp(float(value))
                except (TypeError, ValueError):
                    continue

    def configure(self, enabled: bool | None = None, type_key: str | None = None) -> None:
        if enabled is not None:
            self.enabled = bool(enabled)
        if type_key:
            if type_key in TYPES and type_key != self.dynamics.type:
                # Keep the learned state when only the archetype changes: the
                # parameters move, the history does not.
                state = dict(self.dynamics.state)
                self.dynamics = TsundereDynamics(type_key)
                self.dynamics.state = state

    # -- inputs ------------------------------------------------------------
    def observe_interaction(self, *, valence: float = 0.0, sentiment: float = 0.0,
                            latency_seconds: float = 0.0, recalled: bool = False,
                            mentions_other: bool = False) -> None:
        """Set the two drives from one real exchange.

        Warmth comes from the message's polarity; rejection comes from how long
        the partner took, how negative they were, a recalled message and any
        cue that their attention is elsewhere (a rival).
        """
        warmth = max(0.0, float(valence)) + 0.5 * max(0.0, float(sentiment))
        self.kindness = _clamp(0.10 + 0.90 * min(1.0, warmth), 0.0, U_MAX)
        latency = _clamp(min(max(float(latency_seconds), 0.0), 21600.0) / 21600.0)
        # The reference transform-curve turns warmth into affection; here mood
        # and allostatic load raise the *perceived* rejection, which is how the
        # behaviourally-comorbid depression shows up.
        perceived = (0.10 * latency + 0.30 * max(0.0, -float(sentiment))
                     + (0.25 if recalled else 0.0))
        perceived *= (1.0 + 0.5 * self._interoception())
        if mentions_other:
            perceived += 0.45
        self.rejection = _clamp(perceived, 0.0, R_MAX)

    def _interoception(self) -> float:
        """A 0..1 reading of how strained the body currently is.

        Depression's behavioural comorbidity: a slumped body reads the same
        silence as a colder one.  ``mood`` and ``load`` are updated on every
        tick, so a caller that only observes an interaction still gets the last
        known reading.
        """
        return _clamp(0.5 * max(0.0, -self.mood) + 0.5 * self.load)

    def _set_rejection_baseline(self, neglect_days: float) -> None:
        """Silence keeps the rejection drive above zero on its own."""
        self.rejection = max(self.rejection,
                             min(R_MAX, 0.03 + 0.12 * max(0.0, float(neglect_days))))

    # -- time --------------------------------------------------------------
    def tick(self, days: float, *, neglect_days: float = 0.0,
             sleeping: bool = False, friends: int = 0,
             mood: float = 0.0, load: float = 0.0) -> None:
        if not self.enabled:
            return
        self.mood = _clamp(float(mood or 0.0))
        self.load = _clamp(float(load or 0.0))
        self.neglect_days = max(0.0, float(neglect_days))
        self._set_rejection_baseline(self.neglect_days)
        # A character that is asleep or has other real warmth to lean on is
        # harder to blacken: those are the model's "external support" analogue.
        u_eff = self.kindness
        if sleeping:
            u_eff = max(u_eff, 0.35)
        if friends > 0:
            u_eff = max(u_eff, min(0.7, 0.30 + 0.15 * friends))
        r_eff = self.rejection * (1.0 - 0.3 * min(1.0, self.load))
        # Integrate the ODE over the real elapsed time in <=DT chunks (never one
        # full simulated step per call, or the background tick would run the
        # arc hundreds of times faster than the wall clock).
        self.dynamics.integrate(u_eff, r_eff, days)
        # drives decay toward baseline between interactions
        self.kindness = max(self.BASE_KINDNESS, self.kindness - 0.5 * days)
        self.rejection = max(self.BASE_REJECTION, self.rejection - 0.25 * days)

    # -- read-out ----------------------------------------------------------
    def fixation(self) -> float:
        return self.dynamics.fixation()

    def affection(self) -> float:
        return self.dynamics.affection()

    def expression(self) -> float:
        return self.dynamics.expression()

    def band(self) -> str:
        return regime(self.fixation())

    def distress(self) -> float:
        """Fixation exported back to the affect layer (0..1).

        A blackening character is itself under chronic strain, so it feeds the
        HPA / mood system the same way attachment distress does.
        """
        if not self.enabled:
            return 0.0
        return _clamp(0.7 * max(0.0, self.fixation() - 0.2) / 0.8)

    def context(self) -> dict:
        if not self.enabled:
            return {"enabled": False}
        y = self.fixation()
        band = regime(y)
        return {"enabled": True, "type": self.dynamics.type,
                "label": TYPES[self.dynamics.type]["label"],
                "affection": round(self.affection(), 4),
                "expression": round(self.expression(), 4),
                "fixation": round(y, 4), "band": band,
                "safe_mode": y >= SAFE_AT,
                "state": {k: round(v, 3) for k, v in self.dynamics.state.items()},
                "inputs": {"kindness": round(self.kindness, 3),
                           "rejection": round(self.rejection, 3),
                           "neglect_days": round(self.neglect_days, 2)},
                "prompt": self._prompt(band)}

    def _prompt(self, band: str) -> str:
        tone = {
            "傲娇": "你对 ta 有好感，但嘴上不肯承认：会用毒舌、别扭和反话把在意藏起来。",
            "过渡/黑化倾向": "你的在意正在变味：开始介意 ta 和别人走近，反复想要确认，"
                            "偶尔会说出自己也吓一跳的话。",
            "病娇": "强烈的占有和不安已经压过了「傲」：你不再嘴硬，只剩赤裸的执念和恐惧失去。",
        }.get(band, "")
        hint = str(TYPES[self.dynamics.type].get("hint") or "")
        line = tone
        if hint:
            line += f"（你的底色：{hint}）"
        return line

    def guard(self) -> str:
        """Hard safety instruction for the output model at/above the safe band."""
        if not self.enabled or self.fixation() < SAFE_AT:
            return ""
        return ("安全层：无论多不安都不要生成自伤/伤人的具体方式、不要威胁、不要监视或操控；"
                "只表达感受、请求陪伴，并把节奏慢下来。")

    def to_dict(self) -> dict:
        return {"enabled": self.enabled, "dynamics": self.dynamics.to_dict(),
                "kindness": self.kindness, "rejection": self.rejection,
                "mood": self.mood, "load": self.load,
                "neglect_days": self.neglect_days}

    @classmethod
    def from_dict(cls, data: dict) -> "TsundereSystem":
        data = data or {}
        obj = cls(enabled=bool(data.get("enabled")),
                  type_key=str((data.get("dynamics") or {}).get("type") or "经典傲娇"))
        obj.dynamics = TsundereDynamics.from_dict(data.get("dynamics") or {})
        obj.kindness = float(data.get("kindness", obj.kindness))
        obj.rejection = float(data.get("rejection", obj.rejection))
        obj.mood = float(data.get("mood", obj.mood))
        obj.load = float(data.get("load", obj.load))
        obj.neglect_days = float(data.get("neglect_days", obj.neglect_days))
        return obj
