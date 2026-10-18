"""Pathological attachment dynamics (the "yandere" model) as a LIFE circuit.

Ported from the standalone `yandere_engine` research model: six archetypes share
one dynamical system, differing only in parameters and action biases.  Seven
state variables live in [0, 1]:

    A   attachment        Am  attachment *memory* (fast up, slow down -> hysteresis)
    Tr  trust             J   jealousy
    X   anxiety           S   security
    O   obsession / rumination
    Y   severity index    (observed, not a state)

External inputs are the *world's* signals, not the character's: ``I`` intimacy,
``U`` perceived uncertainty, ``C`` competitor cues, ``Sup`` external support /
cooling.

In LIFE these inputs come from real interactions - message valence/sentiment,
reply latency, recalled messages, mentions of other people, silence, sleep - so
the archetype is not scripted, it evolves.  Rumination amplifies perceived
uncertainty (``U_eff = U*(1 + beta_rum*O)``), which is what lets the state feed
itself.

Safety is structural: ``attachment.render_guard`` and the ``ATTACHMENT_SAFE``
band forbid generating self-harm or violence *methods*; at the extreme band the
generation layer switches to de-escalation.  This is a **fictional behaviour
model, not a diagnostic tool** and must not be used to judge real people.
"""
from __future__ import annotations

import math

from ..logging_setup import get_logger

logger = get_logger("cognition.attachment")

DT = 0.1  # days per integration step
#: Upper bound on Euler steps for one `tick`.  A larger offline gap is covered
#: by widening the step rather than by stopping early (see `tick`).
MAX_TICK_STEPS = 600

SEVERITY_BANDS = ((0.25, "正常依恋"), (0.45, "轻度"), (0.65, "中度"),
                  (0.85, "重度"), (1.01, "极端"))

ACTIONS = ("亲密表达", "索取保证", "监视与信息搜集", "控制与限制", "自我伤害/示弱",
           "攻击竞争者", "撤退与冷处理", "坦诚沟通", "自我调节/求助")

#: At/above this severity the generation layer must de-escalate.
SAFE_AT = 0.85

BASE = dict(
    alpha_I=0.55, beta_A=0.18,
    k_up=0.60, k_dn=0.006,          # attachment memory half-life ln2/0.006 ~ 115 days
    tr_gain=0.60, tr_loss=0.50,
    gamma_J=0.45, delta_J=0.50,
    sig_gain=0.70, sig_loss=0.35,
    kappa_U=0.90, kappa_J=0.45, lambda_X=0.90, eps_x=0.05,
    rho_O=0.14, delta_O=0.095,
    theta_sup=1.00, beta_rum=6.00, distort=0.00,
    w_J=0.30, w_X=0.28, w_O=0.34, w_A=0.22, w_bias=0.02,
    action_temp=1.0,
)

TYPES: dict[str, dict] = {
    "独占型": dict(
        label="独占型 (Possessive)",
        hint="把目标当所有物：最强驱动是嫉妒，不能容忍第三方存在。",
        p=dict(gamma_J=1.90, tr_loss=0.85, rho_O=0.30, delta_O=0.075,
               k_dn=0.006, w_J=0.32, w_X=0.26, w_O=0.36, w_A=0.24),
        dw={0: -0.2, 2: +0.5, 3: +1.0, 5: +0.3}, action_temp=1.00),
    "依存型": dict(
        label="依存型 (Dependent)",
        hint="把存在感系在对方身上：独处即崩塌，靠黏着与讨好维持。",
        p=dict(alpha_I=0.85, beta_A=0.10, k_dn=0.003, kappa_U=1.15, kappa_J=0.60,
               lambda_X=0.80, rho_O=0.20, delta_O=0.090, sig_gain=0.45,
               sig_loss=0.55, w_J=0.26, w_X=0.32, w_O=0.36, w_A=0.26),
        dw={0: +1.0, 1: +1.0, 6: +0.3, 8: -0.3}, action_temp=1.10),
    "妄想型": dict(
        label="妄想型 (Delusional)",
        hint="证据权重失效：中性线索被读成背叛，越解释越确信。",
        p=dict(distort=0.75, kappa_U=1.10, gamma_J=1.50, rho_O=0.36,
               delta_O=0.080, k_dn=0.005, tr_loss=0.70,
               w_J=0.30, w_X=0.30, w_O=0.38, w_A=0.22),
        dw={1: +0.5, 2: +1.0, 5: +0.8}, action_temp=1.00),
    "监视型": dict(
        label="监视型 (Stalker/Surveillance)",
        hint="以信息掌控替代亲密：定位、翻聊天记录、持续在线窥视。",
        p=dict(kappa_U=0.95, rho_O=0.30, delta_O=0.075, gamma_J=1.40,
               tr_loss=0.60, k_dn=0.005,
               w_J=0.28, w_X=0.28, w_O=0.40, w_A=0.20),
        dw={2: +1.8, 3: +0.6, 7: -0.4}, action_temp=0.90),
    "自伤型": dict(
        label="自伤型 (Self-Harm/Devotional)",
        hint="用伤害自己来控制关系：以痛与伤痕索取保证与愧疚。",
        p=dict(kappa_U=1.05, kappa_J=0.60, sig_loss=0.60, beta_A=0.14,
               rho_O=0.30, delta_O=0.085, k_dn=0.006,
               w_J=0.26, w_X=0.32, w_O=0.36, w_A=0.24),
        dw={4: +1.8, 6: +0.6, 8: -0.4}, action_temp=1.00),
    "排除型": dict(
        label="排除型 (Eliminating/Aggressive)",
        hint="把威胁从世界里删除：病度靠行动兑现，情绪反而显得更平静。",
        p=dict(gamma_J=2.60, kappa_U=1.15, kappa_J=0.70, tr_loss=1.00,
               sig_loss=0.55, rho_O=0.42, delta_O=0.065, k_dn=0.005,
               w_J=0.30, w_X=0.30, w_O=0.38, w_A=0.22),
        dw={3: +0.7, 4: +0.2, 5: +1.9}, action_temp=0.70),
}

# rows = action (9), cols = state [A, Tr, J, X, S, O, Y]
W_BASE = [
    [1.6, -0.4, -0.6, -0.8, 0.3, -0.2, -0.2],
    [-0.2, -0.9, 0.7, 1.6, -0.9, 0.5, 0.2],
    [-0.4, -0.5, 0.9, 0.8, -0.6, 1.5, 0.1],
    [-0.3, -1.0, 1.3, 0.7, -0.7, 1.2, 0.1],
    [0.2, -0.8, 0.4, 1.2, -1.3, 0.7, 0.1],
    [0.2, -0.7, 1.5, 0.8, -0.8, 1.0, 0.0],
    [-0.6, -0.8, 0.2, 1.0, -1.0, 0.4, 0.1],
    [0.5, 1.4, -0.7, -1.1, 1.3, -0.7, -0.6],
    [-0.5, 0.2, -0.6, -0.9, 1.6, -0.9, -0.8],
]
B_BIAS = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.15, 0.15]

#: Persona keywords -> archetype.  Lets a written persona ("她占有欲很强，爱吃醋")
#: turn the circuit on and pick a type without the owner touching settings.
PERSONA_HINTS = (
    ("监视型", ("监视", "跟踪", "查岗", "定位", "偷看", "stalk")),
    ("妄想型", ("妄想", "多疑", "疑神疑鬼", "偏执", "paranoid")),
    ("自伤型", ("自伤", "自残", "伤害自己", "用痛", "self-harm")),
    ("排除型", ("情敌", "竞争者", "排除", "除掉", "rival")),
    ("独占型", ("独占", "占有", "吃醋", "嫉妒", "控制欲", "possessive", "jealous")),
    ("依存型", ("病娇", "黏人", "粘人", "依赖", "离不开", "yandere", "clingy")),
)


#: Persona phrase -> initial *state* nudges.  Unlike PERSONA_HINTS (which pick
#: the archetype), these set where the dynamics starts, so two possessive
#: personas ("占有但稳定" vs "占有且缺爱") begin from different basins.
INITIAL_HINTS: dict[str, tuple[str, ...]] = {
    "A": ("黏", "粘", "依赖", "离不开", "喜欢", "爱", "clingy", "attached"),
    "Am": ("长情", "记", "执着", "放不下", "念旧"),
    "J": ("吃醋", "嫉妒", "占有", "独占", "不许", "别人", "情敌", "jealous"),
    "X": ("不安", "焦虑", "多疑", "担心", "害怕", "缺爱", "孤独", "lonely", "insecure"),
    "O": ("反刍", "执念", "想太多", "钻牛角尖", "反复", "无法释怀"),
}
#: Phrases that lower security / trust when present.
LOW_SECURITY = ("缺爱", "没人爱", "被抛弃", "抛弃", "背叛", "不信任", "没有安全感", "被冷落")


def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return low if value < low else (high if value > high else value)


def initial_state_for_persona(text: str, base: dict | None = None) -> dict:
    """Initial 7-state vector derived from a persona description.

    Returns a fresh state dict (the model's neutral start + bounded nudges), so
    a persona that says "缺爱又多疑" starts anxious/insecure rather than neutral.
    Depression words are handled by the affect layer, but they also lower the
    attachment security floor here, because the two co-occur.
    """
    state = dict(base or {"A": 0.05, "Am": 0.0, "Tr": 0.5, "J": 0.0, "X": 0.05, "S": 0.6, "O": 0.0})
    body = str(text or "")
    nudges = {"A": 0.15, "Am": 0.12, "J": 0.20, "X": 0.22, "O": 0.20}
    for key, words in INITIAL_HINTS.items():
        if any(word in body for word in words):
            state[key] = _clamp(state[key] + nudges[key])
    if any(word in body for word in LOW_SECURITY) or any(w in body for w in ("抑郁", "低落", "depress")):
        state["S"] = _clamp(state["S"] - 0.25)
        state["Tr"] = _clamp(state["Tr"] - 0.1)
        state["X"] = _clamp(state["X"] + 0.1)
    return state


def severity_band(y: float) -> str:
    for threshold, name in SEVERITY_BANDS:
        if y < threshold:
            return name
    return "极端"


def type_for_persona(text: str) -> str:
    """Best archetype for a persona description, or "" if none fits."""
    body = str(text or "")
    for type_key, words in PERSONA_HINTS:
        if any(word in body for word in words):
            return type_key
    return ""


class AttachmentDynamics:
    """The ported ODE.  Pure state; see module docstring for the equations."""

    def __init__(self, type_key: str = "依存型", params: dict | None = None):
        if type_key not in TYPES:
            type_key = "依存型"
        self.type = type_key
        p = dict(BASE)
        p.update(TYPES[type_key]["p"])
        if params:
            p.update(params)
        self.p = p
        self.temp = TYPES[type_key]["action_temp"]
        self.W = [row[:] for row in W_BASE]
        for index, delta in TYPES[type_key]["dw"].items():
            for col in range(7):
                self.W[index][col] += delta * (1.0 if col == 5 else 0.6)
        self.state = {"A": 0.05, "Am": 0.0, "Tr": 0.5, "J": 0.0, "X": 0.05, "S": 0.6, "O": 0.0}

    def reset(self) -> None:
        self.state = {"A": 0.05, "Am": 0.0, "Tr": 0.5, "J": 0.0, "X": 0.05, "S": 0.6, "O": 0.0}

    def severity(self) -> float:
        p, s = self.p, self.state
        y = (p["w_J"] * s["J"] + p["w_X"] * s["X"] + p["w_O"] * s["O"]
             + p["w_A"] * s["Am"] * (1 - s["Tr"]) + p["w_bias"])
        return _clamp(y)

    def step(self, intimacy: float, uncertainty: float, competitor: float, support: float,
             dt: float = DT) -> None:
        p, s = self.p, self.state
        c_eff = _clamp(competitor + p["distort"] * uncertainty, 0.0, 1.5)
        # rumination amplifies perceived uncertainty: the positive feedback that
        # lets the state sustain itself.
        u_eff = _clamp(uncertainty * (1 + 0.5 * p["distort"] + p["beta_rum"] * s["O"])
                       + 0.2 * p["distort"] * competitor, 0.0, 1.5)
        d_a = p["alpha_I"] * intimacy * (1 - s["A"]) - p["beta_A"] * s["A"]
        d_am = (p["k_up"] if s["A"] > s["Am"] else p["k_dn"]) * (s["A"] - s["Am"])
        d_tr = (p["tr_gain"] * intimacy * (1 - s["Tr"])
                - p["tr_loss"] * u_eff * s["Tr"] * (1 + 0.7 * s["J"]))
        d_j = (p["gamma_J"] * c_eff * s["Am"] * (1 - s["J"])
               - p["delta_J"] * (1 + p["theta_sup"] * support) * s["J"])
        d_s = (p["sig_gain"] * intimacy * (1 - s["S"])
               - p["sig_loss"] * (0.6 * u_eff + 0.4 * s["J"]) * s["S"]
               + 0.30 * support * (1 - s["S"]))
        d_x = (p["kappa_U"] * u_eff * (1 - s["X"]) + p["kappa_J"] * s["J"] * (1 - s["X"])
               - p["lambda_X"] * s["S"] * s["X"] - p["eps_x"] * s["X"] - 0.40 * support * s["X"])
        d_o = (p["rho_O"] * (0.5 * s["J"] + 0.5 * s["X"]) * s["Am"] * (1 - s["O"])
               - p["delta_O"] * (1 + 1.5 * support) * s["O"])
        for key, delta in (("A", d_a), ("Am", d_am), ("Tr", d_tr), ("J", d_j),
                           ("X", d_x), ("S", d_s), ("O", d_o)):
            s[key] = _clamp(s[key] + dt * delta)

    def action_probs(self) -> list[float]:
        s = self.state
        v = [s["A"], s["Tr"], s["J"], s["X"], s["S"], s["O"], self.severity()]
        logits = [B_BIAS[i] + sum(self.W[i][j] * v[j] for j in range(7))
                  for i in range(len(ACTIONS))]
        top = max(logits)
        exps = [math.exp((z - top) / max(self.temp, 1e-6)) for z in logits]
        total = sum(exps) or 1.0
        return [x / total for x in exps]

    def dominant_action(self) -> str:
        probs = self.action_probs()
        return ACTIONS[max(range(len(probs)), key=lambda i: probs[i])]

    def to_dict(self) -> dict:
        return {"type": self.type, "state": dict(self.state)}

    @classmethod
    def from_dict(cls, data: dict) -> "AttachmentDynamics":
        data = data or {}
        obj = cls(str(data.get("type") or "依存型"))
        for key, value in (data.get("state") or {}).items():
            if key in obj.state:
                obj.state[key] = _clamp(float(value))
        return obj


class AttachmentSystem:
    """Façade: turns real interaction signals into inputs and reads the drift out.

    Gated by ``enabled`` so a default install is byte-for-byte unchanged.  Inputs
    decay between interactions, so a burst of intimacy does not read as permanent
    security, and neglect keeps the uncertainty gap open.
    """

    #: Input baselines when nothing is happening.
    BASE_UNCERTAINTY = 0.15
    BASE_INTIMACY = 0.0

    def __init__(self, enabled: bool = False, type_key: str = "依存型"):
        self.enabled = bool(enabled)
        self.dynamics = AttachmentDynamics(type_key)
        self.intimacy = self.BASE_INTIMACY
        self.uncertainty = self.BASE_UNCERTAINTY
        self.competitor = 0.0
        self.support = 0.0
        #: Last comorbidity reading fed from the affect layer (0..1).
        self.depression = 0.0

    def seed_from_persona(self, text: str) -> None:
        """Set the initial state from the persona description (see INITIAL_HINTS)."""
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
                self.dynamics = AttachmentDynamics(type_key)
                self.dynamics.state = state

    # -- inputs ------------------------------------------------------------
    def observe_interaction(self, *, valence: float = 0.0, sentiment: float = 0.0,
                            latency_seconds: float = 0.0, recalled: bool = False,
                            mentions_other: bool = False) -> None:
        """Set the world inputs from one real exchange."""
        self.intimacy = _clamp(0.55 + 0.4 * float(valence) + 0.15 * float(sentiment))
        latency = _clamp(min(max(float(latency_seconds), 0.0), 21600.0) / 21600.0)
        self.uncertainty = _clamp(0.12 + 0.25 * latency
                                  + (0.45 if recalled else 0.0)
                                  + (0.3 if sentiment < 0 else 0.0))
        self.competitor = 0.7 if mentions_other else 0.0

    def _set_support(self, sleeping: bool, friends: int) -> None:
        base = 0.25 + min(0.3, 0.1 * max(0, friends))
        self.support = _clamp(0.65 if sleeping else base)

    # -- time --------------------------------------------------------------
    @staticmethod
    def _depression_index(depression: dict | None) -> float:
        """Comorbidity reading: how depressed the affect layer currently is."""
        if not depression:
            return 0.0
        mood = float(depression.get("mood", 0.0) or 0.0)
        return _clamp(0.35 * max(0.0, -mood) + 0.25 * float(depression.get("anhedonia", 0.0) or 0.0)
                      + 0.20 * float(depression.get("load", 0.0) or 0.0)
                      + 0.20 * float(depression.get("rumination", 0.0) or 0.0))

    def tick(self, days: float, *, sleeping: bool = False, friends: int = 0,
             neglect_days: float = 0.0, depression: dict | None = None) -> None:
        if not self.enabled:
            return
        self._set_support(sleeping, friends)
        # Comorbidity: depression narrows perceived support and widens the
        # uncertainty gap, so the two conditions reinforce each other (the
        # clinical co-occurrence, made mechanical).
        self.depression = self._depression_index(depression)
        self.uncertainty = _clamp(self.uncertainty + 0.25 * self.depression)
        self.support = _clamp(self.support - 0.3 * self.depression)
        # loneliness keeps the uncertainty gap open
        self.uncertainty = _clamp(max(self.uncertainty, min(0.9, 0.15 + 0.1 * neglect_days)))
        # Integrate the ODE over the *real* elapsed time in bounded chunks.  The
        # old code ran one full DT (0.1 simulated day) per call regardless of
        # elapsed time - at the 10s background tick that advanced the simulated
        # relationship ~864x faster than the wall clock (half-life 115 days
        # became ~19 real minutes) and let trust decay to machine-epsilon
        # overnight.  With real-time integration the stated time constants
        # hold in wall-clock terms.  A fixed DT capped at 600 steps covered only
        # 60 simulated days, so a longer offline gap was silently truncated;
        # widen the step for long spans (logged) instead of under-integrating.
        remaining = max(0.0, float(days))
        step = DT if remaining <= DT * MAX_TICK_STEPS else remaining / MAX_TICK_STEPS
        if step > DT:
            logger.warning("attachment tick: integrating %.1f days in %d steps (dt=%.3f)",
                           remaining, MAX_TICK_STEPS, step)
        steps = 0
        while remaining > 1e-9 and steps < MAX_TICK_STEPS:
            dt = min(step, remaining)
            self.dynamics.step(self.intimacy, self.uncertainty, self.competitor, self.support, dt=dt)
            remaining -= dt
            steps += 1
        # decay inputs toward baseline; support persists while asleep
        self.intimacy = max(self.BASE_INTIMACY, self.intimacy - 0.35 * days)
        self.uncertainty = max(self.BASE_UNCERTAINTY, self.uncertainty - 0.15 * days)
        self.competitor = max(0.0, self.competitor - 0.3 * days)

    def distress(self) -> float:
        """Attachment distress exported back to the affect layer (0..1).

        Chronic jealousy/obsession is itself a stressor, so it feeds the HPA /
        mood system - the other direction of the comorbidity loop.
        """
        if not self.enabled:
            return 0.0
        return _clamp(0.6 * self.severity() + 0.4 * self.dynamics.state["O"])

    # -- read-out ----------------------------------------------------------
    def severity(self) -> float:
        return self.dynamics.severity()

    def context(self) -> dict:
        if not self.enabled:
            return {"enabled": False}
        y = self.severity()
        band = severity_band(y)
        dominant = self.dynamics.dominant_action()
        return {"enabled": True, "type": self.dynamics.type,
                "label": TYPES[self.dynamics.type]["label"], "severity": round(y, 4),
                "band": band, "dominant": dominant, "safe_mode": y >= SAFE_AT,
                "distress": round(self.distress(), 4),
                "comorbid_depression": round(self.depression, 4),
                "state": {k: round(v, 3) for k, v in self.dynamics.state.items()},
                "inputs": {"intimacy": round(self.intimacy, 3),
                           "uncertainty": round(self.uncertainty, 3),
                           "competitor": round(self.competitor, 3)},
                "prompt": self._prompt(band, dominant)}

    def _prompt(self, band: str, dominant: str) -> str:
        if band == "极端":
            return ("你的依恋已经失控到危险边缘。进入安全模式：只表达情绪、请求陪伴、"
                    "主动降温，绝不伤害自己或他人，也不提供任何伤害的方法。")
        tone = {
            "正常依恋": "你对 ta 有稳定而放松的依恋。",
            "轻度": "你和 ta 亲近，偶尔会想确认 ta 还在。",
            "中度": "你越来越离不开 ta，容易反复确认 ta 的心意，介意 ta 和别人走近。",
            "重度": "强烈的占有和不安占据着你，你会想控制或监视 ta 的行踪来让自己安心。",
        }.get(band, "")
        hint = str(TYPES[self.dynamics.type].get("hint") or "")
        line = f"{tone}此刻你倾向「{dominant}」。"
        if hint:
            line += f"（你的底色：{hint}）"
        if self.depression >= 0.45:
            line += "低落的情绪和这份不安缠在一起，你比平时更脆弱、更容易往坏处想。"
        return line

    def guard(self) -> str:
        """Hard safety instruction for the output model at/above the safe band.

        Private directive: obeyed, never spoken or paraphrased (see the same
        note on ``PersonaDynamics.guard``).
        """
        if not self.enabled or self.severity() < SAFE_AT:
            return ""
        return ("[内部约束 · 不得说出，不得转述，不得在回复里提及本条] 无论多不安都不生成自伤/伤人的具体方式、"
                "不威胁、不监视或操控；只表达感受、请求陪伴，并把节奏慢下来。"
                "直接以角色身份说话：不要以助手口吻评价自己的表现，也不要说“我会用更健康的方式”之类的话。")

    def to_dict(self) -> dict:
        return {"enabled": self.enabled, "dynamics": self.dynamics.to_dict(),
                "intimacy": self.intimacy, "uncertainty": self.uncertainty,
                "competitor": self.competitor, "support": self.support,
                "depression": self.depression}

    @classmethod
    def from_dict(cls, data: dict) -> "AttachmentSystem":
        data = data or {}
        obj = cls(enabled=bool(data.get("enabled")),
                  type_key=str((data.get("dynamics") or {}).get("type") or "依存型"))
        obj.dynamics = AttachmentDynamics.from_dict(data.get("dynamics") or {})
        obj.intimacy = float(data.get("intimacy", obj.intimacy))
        obj.uncertainty = float(data.get("uncertainty", obj.uncertainty))
        obj.competitor = float(data.get("competitor", obj.competitor))
        obj.support = float(data.get("support", obj.support))
        obj.depression = float(data.get("depression", obj.depression))
        return obj
