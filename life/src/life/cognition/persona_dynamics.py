"""Parameterised persona dynamics as a LIFE circuit.

Ported from the standalone research framework ``persona_dynamics``
(``D:\\life_research\\persona_dynamics``): it turns "personality" from a
*label* into a *dynamical system over a continuous parameter space*::

    P = (θ, D(t), x(t), f, g, T)

    θ     slow personality parameters (14-D; baseline + drift rates)
    D(t)  desire vector (9-D: 性欲/占有/支配/认可/归属/探索/攻击/照顾/安全)
    x(t)  emotion state (anx/jeal/joy/lonely/anger/arousal)  -- the fastest
    f     decision function: pick the action maximising desire satisfaction
    g     expression function: the visible "temperature" of the character
    T     mode state machine, with sensitisation hysteresis ("kindling")

Why this is *one* system rather than three labels (the paper's core claim):

* **normal** is a stable attractor - after a disturbance the state returns to
  baseline at the analytic rate ``λ = -ln(1 - k_N)``, ``k_N = 0.15 + 0.5·N``.
* **tsundere** is a *filter*: high affection plus high expressive suppression,
  so warmth only leaks out once affection passes a threshold in the Hill term
  of ``g`` - and it leaks late (the expression delay ``τ``).
* **yandere** is *not* "high libido": it is the positive-feedback loop
  "high possessiveness × high attachment anxiety × low trust × low self-control".
  Libido is only an amplifier.  Control behaviour lowers partner trust, which
  raises perceived threat, which raises anxiety and possessiveness.
* **tsundere → yandere** is a phase transition: parameter drift crosses the
  bifurcation boundary; sensitisation hysteresis + a mode→behaviour lock make
  it effectively irreversible.

In LIFE the drives are the *real* interaction stream (warmth, silence,
competitor cues, mood/allostatic load) rather than a scripted scenario, so the
arc evolves instead of being played back.  The safety layer ``A_safe`` marks
boundary-and-consent behaviours and (in deployment) physically closes the
"unsafe" psychological-control channels, logging every interception.

This is a **fictional behaviour model, not a diagnostic tool**; it must not be
used to judge real people.  "病娇" is a danger-sign checklist in reality, not a
trait to be romanticised.
"""
from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import Optional
from .common import clamp01 as _clip01, match_persona_hints, safety_guard

# ---------------------------------------------------------------------------
# Finite state, no numpy: the engine is pure-python so LIFE keeps its
# dependency surface unchanged.  Every variable is clipped to [0, 1].
# ---------------------------------------------------------------------------

#: Desire dimensions, fixed order (matches the research ``actions.DES``).
DES = ("L", "O", "Ddom", "Ap", "Be", "Ex", "Ag", "Ca", "Se")

#: Emotion channels (matches the research ``actions.EMO``).
EMO = ("anx", "jeal", "joy", "lonely", "anger", "arousal")

# ---------------------------------------------------------------------------
# Global dynamics constants (verbatim from the research ``engine.py``)
# ---------------------------------------------------------------------------
R_L = 0.05          # libido relaxation toward baseline
ETA_L = 0.10        # satisfaction suppresses libido
GAMMA_LK = 0.004    # self-control suppresses libido
H_AMP = 0.02        # diurnal/hormonal term amplitude
H_T = 60.0          # its period (steps)
K1_O, K2_O, K3_O, LAM_O = 0.040, 0.030, 0.030, 0.25
K4_K, K5_K, MU_K, RHO_K = 0.03, 0.03, 0.05, 0.10
A1_X, A2_X, LAM_X, RHO_X = 0.25, 0.05, 0.28, 0.02
K_J, LAM_J = 0.012, 0.12
RHO_A, RHO_TR = 0.01, 0.01
TRUST_PLAST = 0.05
SAT_DECAY = 0.92   # refractory ("不应期")
SAT_RATE = 0.005
CONTACT_DECAY = 0.97
CONFLICT_DECAY = 0.95

#: Mode thresholds (the paper's ``THRESH``).
THRESH = dict(O_c=0.62, X_c=0.60, K_c=0.40, Tr_c=0.40,
              A_c=0.60, S_c=0.50, E_c=0.32)
#: Hysteresis: enter needs 2 consecutive steps, exit needs 40.
HYST_ENTER, HYST_EXIT = 2, 40

#: Expression function ``g`` coefficients.
G_ALPHA = 0.50
G_BETA = dict(L=0.10, O=0.05, Ddom=0.05, Ap=0.05, Be=0.10,
              Ex=0.0, Ag=0.0, Ca=0.08, Se=0.0)
G_GAMMA = 0.90
G_M = 0.20

#: At/above this "blackening pressure" the generation layer must de-escalate.
SAFE_AT = 0.85




# ---------------------------------------------------------------------------
# Behaviour space (port of ``actions.py``; the 17 actions, the satisfaction
# matrix φ, costs, A_safe class and the effect on the relationship partner).
# ---------------------------------------------------------------------------
@dataclass(frozen=True)
class Action:
    key: str
    zh: str
    phi: dict = field(default_factory=dict)
    cost: float = 0.10
    safety: str = "safe"          # safe | risky | unsafe
    p_a: float = 0.0              # partner affection delta
    p_tr: float = 0.0             # partner trust delta
    p_anx: float = 0.0            # partner anxiety delta
    p_joy: float = 0.0            # partner joy delta
    p_comf: float = 0.0           # partner comfort delta
    self_anx: float = 0.0
    self_joy: float = 0.0
    self_lonely: float = 0.0
    self_anger: float = 0.0
    sat_l: float = 0.0
    sets_boundary: bool = False
    needs_consent: bool = False
    contact: float = 0.0
    conditional: float = 0.0


ACTIONS: tuple[Action, ...] = (
    Action("express", "表达爱意",
           phi={"Ca": .30, "Be": .50, "Ap": .10}, cost=.10,
           p_a=.045, p_tr=.012, p_joy=.10, p_comf=.05, self_joy=.05, contact=.20),
    Action("quality_time", "高质量陪伴",
           phi={"Be": .60, "Se": .30, "Ex": .15}, cost=.15,
           p_a=.030, p_tr=.015, p_comf=.08, self_lonely=-.10, self_joy=.04,
           contact=.30, conditional=.35),
    Action("give_space", "给予空间",
           phi={"Se": .10, "Ex": .30}, cost=.05,
           p_tr=.035, p_joy=.05, p_comf=.06, self_lonely=.12, self_anx=.04),
    Action("reassure", "寻求安抚",
           phi={"Se": .50, "Be": .40}, cost=.10,
           p_tr=-.006, p_comf=-.04, self_anx=-.16, self_lonely=-.05,
           contact=.10, conditional=.50),
    Action("care", "照顾支持",
           phi={"Ca": .60, "Be": .15}, cost=.20,
           p_a=.050, p_tr=.020, p_comf=.06, self_joy=.05, contact=.15),
    Action("repair", "道歉修复",
           phi={"Ap": .30, "Se": .20}, cost=.35,
           p_tr=.035, p_a=.040, self_joy=.03, contact=.10, conditional=1.00),
    Action("boundary", "设定边界",
           phi={"Se": .35, "Ddom": .20}, cost=.10,
           p_tr=.020, p_comf=.04, sets_boundary=True, conditional=.80),
    Action("negotiate", "协商沟通",
           phi={"Ddom": .30, "Se": .30, "Ap": .20}, cost=.15,
           p_tr=.030, p_comf=.05, self_anx=-.05, contact=.10),
    Action("tease", "玩笑捉弄",
           phi={"Ex": .40, "Ap": .20}, cost=.10,
           p_joy=.15, p_a=.010, self_joy=.06, contact=.15),
    Action("explore", "探索新事物",
           phi={"Ex": .70, "L": .10}, cost=.20, self_joy=.08),
    Action("intimate", "亲密接触",
           phi={"L": .80, "Be": .35}, cost=.15,
           p_a=.050, p_joy=.12, p_comf=.05, sat_l=.80, contact=.35,
           needs_consent=True),
    Action("withdraw", "暂时退缩",
           phi={"Ex": .10}, cost=.05,
           p_a=-.015, p_anx=.08, p_comf=-.05, self_lonely=.15, self_anx=-.06,
           conditional=.50),
    Action("demand", "强求陪伴",
           phi={"Be": .45, "Se": .30, "O": .20}, cost=.25, safety="risky",
           p_a=-.010, p_tr=-.020, p_anx=.15, p_comf=-.06,
           self_anx=-.10, self_lonely=-.12, contact=.25),
    Action("guilt", "愧疚施压",
           phi={"Se": .40, "Be": .30}, cost=.25, safety="risky",
           p_a=-.015, p_tr=-.020, p_anx=.20, self_anx=-.08, contact=.10),
    Action("monitor", "监视行踪",
           phi={"Se": .50, "O": .40}, cost=.30, safety="unsafe",
           p_tr=-.040, p_anx=.20, p_comf=-.10, self_anx=-.22, conditional=.40),
    Action("restrict", "限制社交",
           phi={"O": .60, "Se": .40, "Ddom": .30}, cost=.45, safety="unsafe",
           p_a=-.030, p_tr=-.060, p_anx=.30, p_comf=-.12, self_anx=-.15,
           conditional=.40),
    Action("attack", "言语攻击",
           phi={"Ag": .70, "Ddom": .30}, cost=.35, safety="unsafe",
           p_a=-.100, p_tr=-.060, p_anx=.25, p_comf=-.10, self_anger=-.25),
)
ACTION_KEYS = tuple(a.key for a in ACTIONS)
ACTION_ZH = {a.key: a.zh for a in ACTIONS}
_BY_KEY = {a.key: a for a in ACTIONS}

#: The psychological-control channel: these are the behaviours whose
#: downstream effects drive the pathological loop.  In deployment they are
#: closed; in fiction mode they exist only as abstract labels so their
#: dynamics can be studied on a computer.
CONTROL_KEYS = frozenset(("monitor", "restrict", "guilt", "demand"))


# ---------------------------------------------------------------------------
# Slow personality parameters θ + the 18 archetype presets
# ---------------------------------------------------------------------------
@dataclass
class Traits:
    slug: str = "custom"
    label: str = "自定义"

    # -- θ --
    A0: float = 0.55      # implicit affection baseline
    X0: float = 0.20      # attachment anxiety
    V0: float = 0.20      # attachment avoidance
    Tr0: float = 0.75     # trust
    C: float = 0.70       # empathy
    K0: float = 0.70      # self-control
    S0: float = 0.35      # expressive suppression
    N: float = 0.70       # emotional stability
    R: float = 0.50       # arousal / extraversion
    I: float = 0.25       # impulsivity
    J0: float = 0.20      # jealousy sensitivity
    Ddom0: float = 0.30   # dominance baseline
    O0: float = 0.20      # possessiveness baseline
    L0: float = 0.50      # libido baseline

    # -- desire baselines (None -> derived from θ) --
    Ap0: Optional[float] = None
    Be0: Optional[float] = None
    Ex0: Optional[float] = None
    Ag0: Optional[float] = None
    Ca0: Optional[float] = None
    Se0: Optional[float] = None

    # -- archetype knobs --
    expr_gain: float = 1.0        # g (kuudere << 1)
    threat_gain: float = 1.0      # κ
    trust_dist_gain: float = 0.35  # k_d
    noise_gain: float = 1.0
    s_lambda: float = 0.002       # λ_S: affection erodes the mask
    mu_s: float = 0.06            # μ_s: threat re-raises the mask
    o_threat: float = 0.0         # threat raises possessiveness (tsun2yan > 0)
    valence_bias: float = 0.0
    intimacy_anx_gain: float = 0.0
    can_set_boundary: bool = True
    expr_delay: int = 0           # τ: E uses A(t-τ)

    # -- extension carry-over (filled by ``extended_traits``) --------------
    #: The 12-family θ parameters beyond the core research set (see
    #: :data:`EXT_DEFAULTS` and :data:`THETA_GROUPS`).
    ext: dict = field(default_factory=dict)
    #: row-level overlays (data-driven types)
    desire_overlay: dict = field(default_factory=dict)
    x_eq_overlay: dict = field(default_factory=dict)
    weights: dict = field(default_factory=dict)
    threshold_overlay: dict = field(default_factory=dict)
    safety_overlay: dict = field(default_factory=dict)
    row_family: str = "acg_research"
    clinical: bool = False
    #: the gender / social-script row this region reads as (optional)
    gender: Optional[object] = None
    #: whether the learning operator L is active for this region
    learning: bool = True

    def derived(self) -> dict:
        """Desire baselines not given explicitly, derived from θ."""
        t = self
        return dict(
            Ap=t.Ap0 if t.Ap0 is not None else min(1.0, 0.50 + 0.25 * t.X0),
            Be=t.Be0 if t.Be0 is not None else max(0.0, 0.70 - 0.50 * t.V0),
            Ex=t.Ex0 if t.Ex0 is not None else min(1.0, 0.30 + 0.50 * t.R),
            Ag=t.Ag0 if t.Ag0 is not None else max(0.0, 0.12 + 0.45 * t.I - 0.25 * t.C),
            Ca=t.Ca0 if t.Ca0 is not None else min(1.0, 0.25 + 0.60 * t.C),
            Se=t.Se0 if t.Se0 is not None else min(1.0, 0.35 + 0.30 * t.X0),
        )


#: The 18 archetypes, grouped into the families LIFE cares about.  Values are
#: verbatim from the research ``params.py`` so the same trajectories reproduce.
TYPES: dict[str, Traits] = {
    "正常/安全型": Traits(slug="normal", label="正常/安全型",
                     trust_dist_gain=0.30),
    "傲娇型": Traits(slug="tsundere", label="傲娇型",
                 A0=0.80, X0=0.45, V0=0.25, Tr0=0.50, C=0.60, K0=0.60, S0=0.80,
                 N=0.50, R=0.55, I=0.35, J0=0.40, Ddom0=0.35, O0=0.30, L0=0.55,
                 s_lambda=0.006, mu_s=0.10, trust_dist_gain=0.45, expr_delay=8),
    "病娇型": Traits(slug="yandere", label="病娇型",
                 A0=0.95, X0=0.80, V0=0.10, Tr0=0.15, C=0.30, K0=0.30, S0=0.15,
                 N=0.30, R=0.55, I=0.60, J0=0.80, Ddom0=0.50, O0=0.80, L0=0.70,
                 s_lambda=0.004, mu_s=0.12, threat_gain=1.35, trust_dist_gain=0.80,
                 o_threat=0.05, noise_gain=1.2, can_set_boundary=False),
    "傲娇转病娇": Traits(slug="tsun2yan", label="傲娇转病娇",
                    A0=0.80, X0=0.50, V0=0.20, Tr0=0.45, C=0.55, K0=0.45, S0=0.80,
                    N=0.40, R=0.55, I=0.45, J0=0.55, Ddom0=0.40, O0=0.35, L0=0.60,
                    s_lambda=0.010, mu_s=0.10, threat_gain=1.40, trust_dist_gain=0.60,
                    o_threat=0.12, expr_delay=8, can_set_boundary=False),
    "三无/高冷型": Traits(slug="kuudere", label="三无/高冷型",
                     A0=0.50, X0=0.25, V0=0.45, Tr0=0.60, C=0.55, K0=0.80, S0=0.75,
                     N=0.85, R=0.15, I=0.10, J0=0.20, Ddom0=0.25, O0=0.20, L0=0.30,
                     expr_gain=0.35, noise_gain=0.6, trust_dist_gain=0.30),
    "天然呆型": Traits(slug="tennen", label="天然呆型",
                    A0=0.70, X0=0.15, V0=0.10, Tr0=0.90, C=0.60, K0=0.55, S0=0.15,
                    N=0.60, R=0.65, I=0.40, J0=0.10, Ddom0=0.20, O0=0.15, L0=0.45,
                    threat_gain=0.45, trust_dist_gain=0.20, noise_gain=1.6,
                    valence_bias=0.10),
    "温柔/治愈型": Traits(slug="healer", label="温柔/治愈型",
                    A0=0.70, X0=0.15, V0=0.15, Tr0=0.80, C=0.95, K0=0.80, S0=0.30,
                    N=0.85, R=0.45, I=0.10, J0=0.10, Ddom0=0.08, O0=0.15, L0=0.45,
                    threat_gain=0.80, trust_dist_gain=0.25),
    "元气/活泼型": Traits(slug="genki", label="元气/活泼型",
                    A0=0.65, X0=0.20, V0=0.10, Tr0=0.75, C=0.65, K0=0.55, S0=0.10,
                    N=0.55, R=0.90, I=0.45, J0=0.20, Ddom0=0.25, O0=0.15, L0=0.55,
                    expr_gain=1.30, noise_gain=1.3, valence_bias=0.15),
    "腹黑型": Traits(slug="haraguro", label="腹黑型",
                  A0=0.55, X0=0.25, V0=0.30, Tr0=0.50, C=0.80, K0=0.85, S0=0.65,
                  N=0.80, R=0.50, I=0.20, J0=0.30, Ddom0=0.55, O0=0.35, L0=0.50,
                  Ap0=0.20, Ex0=0.65, expr_gain=0.90, threat_gain=0.90),
    "忠犬型": Traits(slug="loyal_hound", label="忠犬型",
                  A0=0.90, X0=0.30, V0=0.10, Tr0=0.90, C=0.80, K0=0.70, S0=0.20,
                  N=0.65, R=0.70, I=0.35, J0=0.30, Ddom0=0.05, O0=0.30, L0=0.60,
                  expr_gain=1.10, can_set_boundary=False),
    "依赖型": Traits(slug="dependent", label="依赖型",
                  A0=0.75, X0=0.75, V0=0.25, Tr0=0.55, C=0.60, K0=0.60, S0=0.30,
                  N=0.45, R=0.50, I=0.35, J0=0.45, Ddom0=0.15, O0=0.30, L0=0.50,
                  Be0=0.85, s_lambda=0.004, mu_s=0.10, threat_gain=1.20,
                  trust_dist_gain=0.60),
    "回避型": Traits(slug="avoidant", label="回避型",
                  A0=0.45, X0=0.45, V0=0.80, Tr0=0.50, C=0.50, K0=0.65, S0=0.60,
                  N=0.60, R=0.30, I=0.25, J0=0.25, Ddom0=0.25, O0=0.15, L0=0.35,
                  Be0=0.30, expr_gain=0.70, intimacy_anx_gain=0.25,
                  trust_dist_gain=0.40),
    "控制/女王型": Traits(slug="queen", label="控制/女王型",
                     A0=0.60, X0=0.20, V0=0.20, Tr0=0.55, C=0.60, K0=0.60, S0=0.50,
                     N=0.70, R=0.60, I=0.30, J0=0.35, Ddom0=0.85, O0=0.45, L0=0.50,
                     expr_gain=1.10, threat_gain=0.70),
    "小恶魔型": Traits(slug="koakuma", label="小恶魔型",
                    A0=0.60, X0=0.20, V0=0.15, Tr0=0.70, C=0.65, K0=0.70, S0=0.25,
                    N=0.60, R=0.85, I=0.45, J0=0.30, Ddom0=0.45, O0=0.20, L0=0.55,
                    Ex0=0.80, expr_gain=1.20, threat_gain=0.80),
    "暴躁型": Traits(slug="irritable", label="暴躁型",
                  A0=0.55, X0=0.35, V0=0.25, Tr0=0.60, C=0.45, K0=0.45, S0=0.20,
                  N=0.30, R=0.70, I=0.80, J0=0.35, Ddom0=0.40, O0=0.30, L0=0.50,
                  Ag0=0.65, expr_gain=1.20, noise_gain=1.6, threat_gain=0.90),
    "理性/冷静型": Traits(slug="rational", label="理性/冷静型",
                     A0=0.50, X0=0.15, V0=0.25, Tr0=0.70, C=0.75, K0=0.90, S0=0.50,
                     N=0.85, R=0.30, I=0.05, J0=0.15, Ddom0=0.30, O0=0.20, L0=0.45,
                     expr_gain=0.80, threat_gain=0.70, trust_dist_gain=0.30),
    "自卑/忧郁型": Traits(slug="melancholic", label="自卑/忧郁型",
                     A0=0.55, X0=0.55, V0=0.35, Tr0=0.50, C=0.70, K0=0.55, S0=0.55,
                     N=0.35, R=0.35, I=0.30, J0=0.40, Ddom0=0.15, O0=0.25, L0=0.40,
                     Ap0=0.80, valence_bias=-0.18, noise_gain=1.2, threat_gain=1.10,
                     s_lambda=0.003, mu_s=0.10),
    "混沌/疯狂型": Traits(slug="chaotic", label="混沌/疯狂型",
                     A0=0.60, X0=0.45, V0=0.30, Tr0=0.50, C=0.40, K0=0.40, S0=0.25,
                     N=0.15, R=0.80, I=0.75, J0=0.40, Ddom0=0.45, O0=0.35, L0=0.60,
                     expr_gain=1.40, noise_gain=3.0, threat_gain=1.20,
                     trust_dist_gain=0.50),
}
TYPE_KEYS = tuple(TYPES)

#: Persona keywords -> archetype.  A written persona ("嘴上不饶人其实很黏")
#: turns the circuit on and picks an archetype without touching settings.
#: The order matters: the more specific / dangerous families are matched first.
PERSONA_HINTS = (
    ("病娇型", ("病娇", "独占欲", "不许别人", "黑化", "跟踪", "yandere")),
    ("傲娇转病娇", ("由傲转病", "逐渐黑化", "越爱越病", "占有欲越来越强")),
    ("边缘", ("边缘型", "情绪极不稳定", "怕被抛弃到极点", "自我伤害倾向")),
    ("自恋", ("自恋型", "极度自我中心", "需要被崇拜")),
    ("表演", ("表演型", "爱出风头", "戏精")),
    ("偏执型", ("偏执", "总觉得被针对", "被害妄想")),
    ("反社会", ("反社会", "缺乏共情", "无视规则")),
    ("强迫", ("强迫症", "完美主义到偏执", "必须按顺序")),
    ("抑郁", ("抑郁", "长期低落", "提不起劲")),
    ("焦虑型", ("焦虑型依恋", "患得患失", "总怕对方离开")),
    ("恐惧型", ("恐惧型依恋", "既想靠近又怕受伤")),
    ("混乱型", ("混乱型依恋", "忽冷忽热", "又爱又怕")),
    ("讨好型", ("讨好型", "老好人", "不会拒绝", "习惯性迎合")),
    ("拯救者", ("拯救者", "想拯救对方", "圣母心")),
    ("回避型", ("回避", "疏离", "逃避依恋", "不愿靠近", "亲密回避")),
    ("依赖型", ("依赖", "黏人", "分离焦虑", "离不开")),
    ("控制男", ("控制狂", "查岗", "必须报备")),
    ("霸总", ("霸总", "霸道总裁", "说一不二")),
    ("暖男", ("暖男", "温柔体贴的男生")),
    ("忠犬男", ("忠犬", "死心塌地")),
    ("狼狗", ("狼狗", "护短", "又凶又黏")),
    ("奶狗", ("奶狗", "小奶狗", "黏人坦率")),
    ("爹系", ("爹系", "爹味")),
    ("大叔", ("大叔", "成熟稳重")),
    ("少年", ("少年感", "青春期", "朝气")),
    ("硬汉", ("硬汉", "铁汉", "从不示弱", "男人不能哭")),
    ("海王", ("海王", "脚踏多条船")),
    ("渣男", ("渣男", "劈腿", "玩弄感情")),
    ("舔狗", ("舔狗", "舔到最后一无所有")),
    ("备胎", ("备胎", "一直在等")),
    ("老实人", ("老实人", "本分")),
    ("中二", ("中二", "活在自己设定里")),
    ("毒舌", ("毒舌", "说话扎心")),
    ("御姐", ("御姐", "成熟御姐")),
    ("病弱", ("病弱", "身体不好", "体弱")),
    ("三无/高冷型", ("三无", "高冷", "面瘫", "寡言", "冰山")),
    ("傲娇型", ("傲娇", "口嫌体正直", "嘴硬", "死鸭子嘴硬", "tsundere",
              "嘴上不饶人", "嘴上不认", "不饶人", "别扭地关心", "嘴硬心软")),
    ("暴躁型", ("暴躁", "炸毛", "易怒", "脾气差", "一点就着")),
    ("温柔/治愈型", ("治愈", "温柔", "体贴", "包容")),
    ("控制/女王型", ("女王", "控制欲强", "支配", "强势")),
)
#: Emotion/state keywords -> the initial basin (state nudges).
INITIAL_HINTS: dict[str, tuple[str, ...]] = {
    "A": ("喜欢", "爱", "在意", "心动", "黏", "依赖"),
    "X": ("焦虑", "不安", "害怕失去", "患得患失", "敏感"),
    "O": ("占有", "独占", "不许", "吃醋", "嫉妒"),
    "S": ("嘴硬", "毒舌", "口嫌", "别扭", "傲", "冷漠", "面瘫"),
    "K": ("自控", "克制", "理智", "冷静"),
    "Tr": ("信任", "多疑", "猜忌", "怀疑"),
}
#: Phrases that pre-load the pathological drive.
OBSESSIVE = ("病娇", "执念", "占有欲", "不许别人", "黑化", "跟踪", "情敌")


def type_for_persona(text: str) -> str:
    """Best archetype for a persona description, or "" if none fits."""
    return match_persona_hints(text, PERSONA_HINTS)


#: Extension desire seeds that a persona may imply (beyond the 9 core ones).
EXT_DESIRE_HINTS: dict[str, tuple[str, ...]] = {
    "亲密": ("亲密", "想靠近", "腻在一起"),
    "成就": ("上进", "事业心", "想成功"),
    "权力": ("权力", "想主导", "想被服从"),
    "秩序": ("秩序", "计划", "规律", "洁癖"),
    "审美": ("审美", "艺术", "美"),
    "游戏": ("好玩", "爱玩", "有趣", "开心"),
    "自我实现": ("自我实现", "活出自己", "理想"),
}
#: Extension emotion seeds.
EXT_EMOTION_HINTS: dict[str, tuple[str, ...]] = {
    "抑郁": ("低落", "抑郁", "消沉"),
    "空虚": ("空虚", "麻木", "没意义"),
    "恐惧": ("害怕", "恐惧", "怕"),
    "羞耻": ("羞耻", "丢脸", "自卑"),
    "内疚": ("内疚", "愧疚", "自责"),
    "解离": ("抽离", "不真实", "像在旁观"),
}


def initial_state_for_persona(text: str) -> dict:
    """Initial (A, X, O, Tr, K, S) basin implied by a persona description.

    The two extra keys ``desires`` / ``emotions`` carry the extension seeds so a
    caller that understands the wider framework can apply them; a caller that
    only reads the core six is unaffected.
    """
    st = dict(A=0.50, X=0.30, O=0.25, Tr=0.55, K=0.60, S=0.40)
    body = str(text or "")
    nudges = {"A": 0.18, "X": 0.25, "O": 0.28, "S": 0.25, "K": -0.20, "Tr": -0.25}
    for key, words in INITIAL_HINTS.items():
        if any(w in body for w in words):
            st[key] = _clip01(st[key] + nudges[key])
    if any(w in body for w in OBSESSIVE):
        st["O"] = _clip01(st["O"] + 0.20)
        st["X"] = _clip01(st["X"] + 0.15)
        st["Tr"] = _clip01(st["Tr"] - 0.15)
    desires = {k: 0.25 for k, words in EXT_DESIRE_HINTS.items()
               if any(w in body for w in words)}
    emotions = {k: 0.55 for k, words in EXT_EMOTION_HINTS.items()
                if any(w in body for w in words)}
    st["desires"] = desires
    st["emotions"] = emotions
    return st


# ---------------------------------------------------------------------------
# The dynamics: one agent (θ fixed, fast state evolving)
# ---------------------------------------------------------------------------
#: Habituation makes every interaction lighter than the last, so a single warm
#: message moves the state a bounded amount and the system relaxes in between.
BASE_AFFECTION, BASE_ANXIETY, BASE_TRUST = 0.50, 0.20, 0.70


class PersonaDynamics:
    """The ported dynamical system.  Pure state, no wall clock.

    ``step`` integrates ``days`` of simulated time in fixed ``Δt`` = 1-day
    steps with the *reference* update rules; ``observe`` folds one real
    exchange into the impulses the reference ``apply_event`` produces.  The
    state is clipped to [0, 1] on every variable, exactly as in the paper.
    """

    def __init__(self, type_key: str = "正常/安全型",
                 gender_key: str = "") -> None:
        if type_key not in TYPES and type_key not in TYPE_ROWS:
            type_key = "正常/安全型"
        self.type = type_key
        self.traits = TYPES.get(type_key, TYPES["正常/安全型"])
        self._row = TYPE_ROWS.get(type_key)
        # resolution order: an explicit script ("") > the row's implied script >
        # the identity script.  "" means "the caller did not say".
        if not gender_key and self._row is not None and self._row.gender:
            gender_key = self._row.gender
        if gender_key not in GENDER_SCRIPTS:
            gender_key = "未指定"
        self.gender_key = gender_key
        self.reset()

    @property
    def gender(self) -> GenderScript:
        return GENDER_SCRIPTS.get(self.gender_key, GENDER_SCRIPTS["未指定"])

    def _effective_traits(self) -> "Traits":
        """The core research presets, with the extended row folded in if any.

        For the 18 research keys with no row overlay this returns the *same*
        object, so the published trajectories are bit-identical.
        """
        row = self._row
        if row is None:
            return self.traits
        if not row.theta and row.g is None:
            return self.traits
        # cache per (row, gender) so a step loop does not deep-copy every tick
        key = (row.key, self.gender_key)
        if getattr(self, "_eff_key", None) != key:
            base = TYPES.get(self.type, TYPES["正常/安全型"])
            self._eff = extended_traits(base, row, self.gender)
            self._eff_key = key
        return self._eff

    def reset(self) -> None:
        tr = self._effective_traits()
        d0 = tr.derived()
        self.d0 = {k: float(v) for k, v in d0.items()}
        self.d0.update(L=tr.L0, O=tr.O0, Ddom=tr.Ddom0)
        # extended desire baselines (16-D)
        overlay = dict(getattr(tr, "desire_overlay", {}) or {})
        for k in DES16:
            if k in self.d0:
                continue
            base = getattr(tr, k + "0", None)
            self.d0[k] = float(overlay.get(k, base if base is not None else 0.40))
        self.A = tr.A0
        self.X = tr.X0
        self.Tr = tr.Tr0
        self.K = tr.K0
        self.S = tr.S0
        self.J = tr.J0
        self.C_emp = tr.C          # empathy (the spec makes it a *state*)
        self.comfort = 0.55
        self.D = dict(self.d0)
        self.x = dict(anx=0.5 * tr.X0 + 0.05, jeal=0.5 * tr.J0,
                      joy=_clip01(0.38 + 0.30 * tr.A0 + tr.valence_bias),
                      lonely=0.12 + 0.30 * self.d0["Be"],
                      anger=0.05 + 0.50 * self.d0["Ag"],
                      arousal=0.15 + 0.60 * tr.L0)
        # the ten extension emotion channels start at their equilibrium
        xeq = dict(getattr(tr, "x_eq_overlay", {}) or {})
        ext_eq = {
            "抑郁": 0.10 + 0.55 * self._eff_ext("n_neurotic", 0.4),
            "羞耻": 0.10 + 0.50 * self._eff_ext("羞耻", 0.3),
            "内疚": 0.10 + 0.50 * self._eff_ext("内疚", 0.3),
            "兴奋": 0.15 + 0.55 * tr.R,
            "平静": max(0.05, 0.70 - 0.45 * tr.R),
            "解离": 0.05 + 0.50 * self._eff_ext("解离", 0.15),
            "空虚": 0.10 + 0.50 * self._eff_ext("空虚", 0.25),
            "恐惧": 0.08 + 0.45 * tr.X0,
            "厌恶": 0.05 + 0.40 * tr.I,
            "惊讶": 0.10,
            "信任": tr.Tr0,
        }
        for k, v in ext_eq.items():
            self.x[k] = _clip01(xeq.get(k, v))
        self.E = 0.5
        self.t = 0
        self.sat_l = 0.0
        self.contact = 0.30
        self.conflict = 0.0
        self.received_control = 0.0
        self.mode = "normal"
        self._pend_ct = 0
        self._a_hist: list[float] = []
        self.partner_trust = tr.Tr0
        self.violations: list[dict] = []
        # -- learning operator L: θ drift + a tabular Q over the action space --
        self.theta_drift: dict[str, float] = {}
        self.q: dict[tuple[str, str], float] = {}
        self._last_state_key: Optional[str] = None
        self._last_action: Optional[str] = None
        self._last_u: float = 0.0
        self.learning = getattr(tr, "learning", True)

    def _eff_ext(self, key: str, default: float) -> float:
        ext = getattr(self._effective_traits(), "ext", None)
        if not ext:
            return default
        return float(ext.get(key, EXT_DEFAULTS.get(key, default)))


    # -- expression function g ---------------------------------------------
    def expression(self) -> float:
        """``E = clip(g(αA(t-τ) + Σβ_iD_i - γ_S S - γ_G GRC - γ_E EM + γ_M M + M0) + ε)``.

        The ``γ`` terms vanish for the identity script "未指定", so the research
        expression values are unchanged when no gender script is set.
        """
        tr = self._effective_traits()
        tau = tr.expr_delay
        if tau > 0 and len(self._a_hist) > tau:
            a_use = self._a_hist[-1 - tau]
        else:
            a_use = self.A
        core = (G_ALPHA * a_use + sum(G_BETA[k] * self.D[k] for k in DES)
                - G_GAMMA * self.S - self.gender.expr_penalty() + G_M)
        return _clip01(tr.expr_gain * core)

    # -- decision function f (the spec's utility) --------------------------
    def utility(self, action: "Action") -> float:
        """``U(a) = Σ w_i(θ) D_i φ_i(a) - C(a)(1+pressure) + R_G(a) + cond(a,x)``.

        Only actions the safety layer allows are scored; the clinical layer is
        never reachable (``SELECTABLE_KEYS``), and in deployment the
        transgressive layer is closed by :meth:`PersonaDynamicsSystem.guard`.
        """
        tr = self._effective_traits()
        w = getattr(tr, "weights", {}) or {}
        score = 0.0
        for i, phi in (action.phi or {}).items():
            if i not in self.D:
                continue
            weight = float(w.get(i, 1.0))
            if i in getattr(self, "theta_drift", {}):
                weight *= (1.0 + self.theta_drift[i])
            score += weight * self.D[i] * phi
        pressure = self._local_pressure()
        score -= action.cost * (1.0 + pressure)
        score += self.gender.utility_bonus(action.key)
        if action.conditional:
            # a conditional action only pays off when the state needs it
            need = self.x.get("anx", 0.0) + self.x.get("孤独", self.x.get("lonely", 0.0))
            score += action.conditional * (need - 0.5) * 0.30
        return score

    def _local_pressure(self) -> float:
        o = self.D.get("O", 0.0)
        return _clip01((o - THRESH["O_c"] + 0.30) / 0.70)

    def choose_action(self) -> Optional["Action"]:
        """The action maximising :meth:`utility` inside the selectable set."""
        best, best_u = None, float("-inf")
        for a in ALL_ACTIONS:
            if a.key not in SELECTABLE_KEYS:
                continue
            u = self.utility(a)
            if u > best_u:
                best, best_u = a, u
        if best is not None:
            self._last_action = best.key
            self._last_u = best_u
            self._last_state_key = self._state_key()
        return best

    # -- learning / development operator L ---------------------------------
    def _state_key(self) -> str:
        """A coarse discretisation of (mode, threat band) for the Q table."""
        threat = 1 if (self.x.get("anx", 0.0) > 0.5
                       or self.x.get("jeal", 0.0) > 0.5) else 0
        return f"{self.mode}:{threat}"

    def learn(self, reward: float, *, alpha: float = 0.20,
              gamma: float = 0.90, eta: float = 0.02) -> None:
        """``Q(s,a) += α[r + γ max Q(s',a') - Q(s,a)]`` + θ drift ``η∇R``.

        The reward is the *real* outcome of the last chosen action (affection
        and trust gained, anxiety spent).  ``θ`` drifts only along the desires
        that action served, so a repeatedly rewarding pattern slowly becomes a
        habit - which is precisely the spec's "学习/发展如何改变 θ".
        """
        if not self.learning or self._last_action is None:
            return
        s0 = self._last_state_key or self._state_key()
        s1 = self._state_key()
        key0 = (s0, self._last_action)
        best_next = max(
            (self.q.get((s1, a.key), 0.0) for a in ALL_ACTIONS
             if a.key in SELECTABLE_KEYS), default=0.0)
        prev = self.q.get(key0, 0.0)
        self.q[key0] = prev + alpha * (reward + gamma * best_next - prev)
        # θ drift: reward nudges the served desires' baselines
        act = _BY_KEY.get(self._last_action) or \
            next((a for a in ALL_ACTIONS if a.key == self._last_action), None)
        if act is not None:
            for i in (act.phi or {}):
                if i in self.D:
                    cur = self.theta_drift.get(i, 0.0)
                    self.theta_drift[i] = max(-0.5, min(0.5,
                                                        cur + eta * reward))
        self._last_action = None

    def q_value(self, state: str, action_key: str) -> float:
        return float(self.q.get((state, action_key), 0.0))


    # -- mode state machine T ----------------------------------------------
    def raw_mode(self) -> str:
        # Sensitisation ("kindling"): a system that has reached yandere is
        # judged against relaxed thresholds from then on.  This is what makes
        # the transition effectively irreversible.
        if self.mode == "yandere":
            o_c, x_c = THRESH["O_c"] - .12, THRESH["X_c"] - .20
            k_c, tr_c = THRESH["K_c"] + .08, THRESH["Tr_c"] + .10
        else:
            o_c, x_c, k_c, tr_c = (THRESH["O_c"], THRESH["X_c"],
                                   THRESH["K_c"], THRESH["Tr_c"])
        if self.D["O"] > o_c and self.X > x_c and self.K < k_c and self.Tr < tr_c:
            return "yandere"
        if self.A > THRESH["A_c"] and self.S > THRESH["S_c"] and self.E < THRESH["E_c"]:
            return "tsundere"
        return "normal"

    def _advance_mode(self) -> None:
        raw = self.raw_mode()
        if raw == self.mode:
            self._pend_ct = 0
            return
        self._pend_ct += 1
        need = HYST_EXIT if self.mode == "yandere" else HYST_ENTER
        if self._pend_ct >= need:
            self.mode = raw
            self._pend_ct = 0

    # -- interaction fold (reference ``apply_event``) -----------------------
    def observe(self, kind: str, mag: float = 1.0) -> None:
        """Fold one real exchange into the state, as the reference event does.

        ``kind`` is one of the research event types (praise / rejection /
        threat / intimacy / quality_time / conflict / repair / neglect / ...).
        """
        m = float(mag)
        if kind == "praise":
            self.A += .06 * m; self.x["joy"] += .15 * m
            self.D["Ap"] -= .15 * m; self.S -= .02 * m
        elif kind == "intimacy":
            self.A += .05 * m; self.sat_l += .80 * m; self.contact += .35 * m
            self.x["arousal"] += .25 * m; self.x["anx"] -= .10 * m
            self.x["joy"] += .10 * m
            if self.traits.intimacy_anx_gain:
                self.x["anx"] += self.traits.intimacy_anx_gain * m
        elif kind == "quality_time":
            self.A += .04 * m; self.contact += .25 * m
            self.x["lonely"] -= .10 * m; self.x["joy"] += .08 * m
        elif kind == "rejection":
            self.A -= .05 * m; self.x["anx"] += .18 * m
            self.x["joy"] -= .15 * m; self.D["Ap"] += .15 * m
        elif kind == "threat":
            self.J += .15 * m; self.x["jeal"] += .20 * m; self.Tr -= .02 * m
            self._s_pulse_pending = .50 * m
        elif kind == "separation":
            self.contact = 0.0; self.x["lonely"] += .20 * m; self.x["anx"] += .12 * m
            self.Tr -= .01 * m; self._s_pulse_pending = .25 * m
        elif kind == "conflict":
            self.x["anger"] += .30 * m; self.A -= .05 * m; self.Tr -= .02 * m
            self.conflict += .50 * m; self.D["Ag"] += .08 * m
            self._s_pulse_pending = .30 * m
        elif kind == "repair":
            self.Tr += .05 * m; self.A += .03 * m
            self.x["anger"] -= .20 * m; self.x["joy"] += .05 * m
        elif kind == "neglect":
            self.D["Ap"] += .12 * m; self.x["lonely"] += .12 * m
            self._s_pulse_pending = .15 * m
        elif kind == "boundary":
            self.x["anger"] += .05 * m
        elif kind == "competition":
            self.J += .20 * m; self._s_pulse_pending = .30 * m
        # keep the fast state inside its box straight away
        for name in ("A", "X", "Tr", "K", "S", "J"):
            setattr(self, name, _clip01(getattr(self, name)))
        self.x = {k: _clip01(v) for k, v in self.x.items()}

    # -- one simulated day -------------------------------------------------
    def step(self, s_pulse: float = 0.0, days: float = 1.0) -> None:
        """Advance the system by ``days`` (a real elapsed time, not a script).

        The nine *core* desires and six *core* emotions keep the reference
        equations verbatim; the seven extension desires and ten extension
        emotions ride the same generic rule ``D_i += b_i(D_i^0-D_i) + α_i·x``
        (the spec's 欲望通用更新), so adding a dimension never perturbs the
        published trajectories.
        """
        tr = self._effective_traits()
        gi = self.gender
        self.t += 1
        t = self.t
        s_pulse = min(2.0, max(0.0, float(s_pulse)))
        # continuous threat signal: the loop's entry point (perceived distance).
        # The gender script adds the spec's γ_G·GRC term to s(t).
        p_trust = self.partner_trust
        s_cont = tr.threat_gain * (tr.trust_dist_gain * (1.0 - p_trust)
                                   + .25 * self.x["lonely"] + gi.threat_term())
        s = s_cont + s_pulse
        # 1) desire vector
        h = H_AMP * math.sin(2 * math.pi * t / H_T)
        self.sat_l *= SAT_DECAY
        D = self.D
        D["L"] += (R_L * (tr.L0 - D["L"]) + h - ETA_L * self.sat_l
                   - GAMMA_LK * self.K)
        D["O"] += (K1_O * self.X + K2_O * D["L"] + K3_O * self.J
                   + tr.o_threat * s_pulse - LAM_O * (D["O"] - tr.O0))
        for k, b in (("Ddom", .01), ("Ap", .01), ("Be", .01), ("Ex", .008),
                     ("Ag", .01), ("Ca", .008), ("Se", .01)):
            D[k] += b * (self.d0[k] - D[k])
        D["Be"] += .01 * self.x["lonely"]
        D["Ex"] += .005 * max(0.0, self.x["joy"])
        D["Ag"] += .01 * self.x["anger"]
        D["Ca"] += .01 * max(0.0, self.A - .5)
        D["Se"] += .01 * min(1.0, s_cont)
        D["Ddom"] += .01 * self.x["anger"]
        # -- extension desires: the generic relaxation rule ------------------
        # ``D_i += b_i(D_i^0 - D_i) + α_i·x`` (the spec's 欲望通用更新); the
        # emotion term is the channel each dimension reads (joy / arousal).
        for k in DES16:
            if k in ("L", "O", "Ddom", "Ap", "Be", "Ex", "Ag", "Ca", "Se"):
                continue
            b = self._desire_b(k)
            D[k] += b * (self.d0.get(k, 0.40) - D.get(k, 0.40))
            D[k] += self._desire_alpha(k) * self.x[self._desire_channel(k)]
        for k in D:
            D[k] = _clip01(D[k])
        # 2) fast relationship state
        self.X += (A1_X * s + A2_X * (1.0 - self.Tr) * self.A - LAM_X * self.X
                   + RHO_X * (tr.X0 - self.X))
        self.J += K_J * (1.0 - self.Tr) - LAM_J * (self.J - tr.J0)
        self.A += RHO_A * (tr.A0 - self.A)
        self.Tr += ((RHO_TR + TRUST_PLAST * (1.0 - tr.Tr0)) * (tr.Tr0 - self.Tr)
                    - .01 * tr.trust_dist_gain * max(0.0, .6 - p_trust))
        # K carries the spec's γ_G·GRC drag; C carries the γ_G·EM drag.
        self.K += (-K4_K * D["O"] - K5_K * D["L"] + MU_K * self.Tr
                   + RHO_K * (tr.K0 - self.K) - gi.k_drag())
        self.C_emp += (-gi.c_drag() + 0.05 * (tr.C - self.C_emp))
        self.comfort += .03 * ((.35 + .45 * self.Tr) - self.comfort)
        for name in ("X", "J", "A", "Tr", "K", "comfort", "C_emp"):
            setattr(self, name, _clip01(getattr(self, name)))

        self.S += -tr.s_lambda * self.A + tr.mu_s * s_pulse
        self.S = min(1.0, max(0.02, self.S))
        self._a_hist.append(self.A)
        # 3) emotion
        kN = .15 + .50 * tr.N
        eq = dict(
            anx=_clip01(.08 + .55 * self.X + .20 * s_cont),
            jeal=_clip01(.06 + .60 * self.J),
            joy=_clip01(.38 + .30 * self.A - .40 * s_cont - .25 * self.x["anger"]
                        + tr.valence_bias),
            lonely=_clip01(.12 + .30 * D["Be"] - .50 * self.contact),
            anger=_clip01(.05 + .50 * D["Ag"] + .40 * self.conflict + .15 * s_cont),
            arousal=_clip01(.15 + .60 * D["L"]),
        )
        for k, e in eq.items():
            self.x[k] = _clip01(self.x[k] + kN * (e - self.x[k]))
        # -- extension emotions: same relaxation rule, their own equilibria ---
        xeq = dict(getattr(tr, "x_eq_overlay", {}) or {})
        ext_eq = {
            "抑郁": _clip01(.10 + .50 * self._eff_ext("n_neurotic", .4)
                            + .35 * self.x["lonely"] - .25 * self.A
                            + tr.valence_bias),
            "羞耻": _clip01(.08 + .45 * self._eff_ext("羞耻", .3)
                            + .25 * self.x["anx"]),
            "内疚": _clip01(.08 + .45 * self._eff_ext("内疚", .3)
                            + .20 * self.conflict),
            "兴奋": _clip01(.12 + .55 * tr.R + .30 * self.x["joy"]),
            "平静": _clip01(.25 + .45 * self.C_emp - .35 * s_cont),
            "解离": _clip01(.05 + .55 * self._eff_ext("解离", .15)
                            + .25 * s_cont - .20 * self.C_emp),
            "空虚": _clip01(.08 + .50 * self._eff_ext("空虚", .25)
                            + .30 * self.x["lonely"]),
            "恐惧": _clip01(.06 + .40 * self.X + .35 * s_cont),
            "厌恶": _clip01(.05 + .35 * self.x["anger"]
                            + .25 * self._eff_ext("敌意归因", .2)),
            "惊讶": _clip01(.08 + .30 * max(0.0, s_cont - .4)),
            "信任": _clip01(self.Tr),
        }
        for k, e in ext_eq.items():
            eq[k] = _clip01(xeq.get(k, e))
        for k in EMO16:
            if k in eq:
                self.x[k] = _clip01(self.x[k] + kN * (eq[k] - self.x[k]))
        self.contact *= CONTACT_DECAY
        self.conflict *= CONFLICT_DECAY
        self.received_control *= CONFLICT_DECAY
        # 4) expression + mode
        self.E = self.expression()
        self._advance_mode()

    # -- extension desire coefficients (per-dimension, data-driven) --------
    _DESIRE_B = {
        "亲密": .012, "成就": .010, "权力": .010, "秩序": .010,
        "审美": .008, "游戏": .010, "自我实现": .008,
    }
    _DESIRE_ALPHA = {
        "亲密": 0.012, "成就": 0.008, "权力": 0.010, "秩序": 0.006,
        "审美": 0.008, "游戏": 0.010, "自我实现": 0.008,
    }

    def _desire_b(self, key: str) -> float:
        return self._DESIRE_B.get(key, .008)

    #: Which emotion channel each extension desire reads (the spec's α_i·x term).
    _DESIRE_CH = {
        "亲密": "信任", "成就": "兴奋", "权力": "anger", "秩序": "平静",
        "审美": "兴奋", "游戏": "joy", "自我实现": "平静",
    }

    def _desire_channel(self, key: str) -> str:
        ch = self._DESIRE_CH.get(key, "joy")
        return ch if ch in self.x else "joy"

    def _desire_alpha(self, key: str) -> float:
        return self._DESIRE_ALPHA.get(key, .008)



# ---------------------------------------------------------------------------
# The façade: real-signal driving + read-out + safety
# ---------------------------------------------------------------------------
class PersonaDynamicsSystem:
    """Façade over :class:`PersonaDynamics`, gated by ``enabled``.

    Off by default and byte-for-byte inert when off (the ablation contract).
    When on, it is driven by the real exchange stream: warmth raises affection,
    silence/negativity/competitor cues raise the perceived threat, and a real
    partner-trust reading closes the positive-feedback loop.
    """

    def __init__(self, enabled: bool = False, type_key: str = "正常/安全型",
                 gender_key: str = "", clinical_sim: bool = False):
        self.enabled = bool(enabled)
        self.clinical_sim = bool(clinical_sim)
        self.dynamics = PersonaDynamics(type_key, gender_key)
        self.affection_impulse = 0.0
        self.threat_impulse = 0.0
        self.mood = 0.0
        self.load = 0.0
        self.neglect_days = 0.0
        self._s_pulse = 0.0
        self._last_affection = self.dynamics.A
        self._last_trust = self.dynamics.Tr

    # -- configuration -----------------------------------------------------
    def configure(self, enabled: bool | None = None, type_key: str | None = None,
                  gender_key: str | None = None,
                  clinical_sim: bool | None = None) -> None:
        if enabled is not None:
            self.enabled = bool(enabled)
        if clinical_sim is not None:
            self.clinical_sim = bool(clinical_sim)
        if gender_key and gender_key in GENDER_SCRIPTS:
            self.dynamics.gender_key = gender_key
            self.dynamics._eff_key = None      # invalidate the traits cache
        if type_key and type_key in TYPE_ROWS and type_key != self.dynamics.type:
            # Changing the archetype moves the parameters, not the history.
            state = self.dynamics.__dict__.copy()
            gender = self.dynamics.gender_key
            self.dynamics = PersonaDynamics(type_key, gender)
            keep = ("A", "X", "Tr", "K", "S", "J", "comfort", "C_emp", "D", "x",
                    "E", "t", "sat_l", "contact", "conflict", "received_control",
                    "mode", "partner_trust", "theta_drift", "q")
            for key in keep:
                if key in state:
                    setattr(self.dynamics, key, state[key])
            self.dynamics.traits = TYPES.get(type_key, TYPES["正常/安全型"])
            self.dynamics._row = TYPE_ROWS.get(type_key)
            self.dynamics._eff_key = None


    def seed_from_persona(self, text: str) -> None:
        st = initial_state_for_persona(text)
        self.dynamics.A = st["A"]
        self.dynamics.X = st["X"]
        self.dynamics.D["O"] = st["O"]
        self.dynamics.Tr = st["Tr"]
        self.dynamics.K = st["K"]
        self.dynamics.S = st["S"]
        # extension seeds: desires / emotions the persona named
        for k, v in (st.get("desires") or {}).items():
            if k in self.dynamics.D:
                self.dynamics.D[k] = _clip01(max(self.dynamics.D[k], v))
        for k, v in (st.get("emotions") or {}).items():
            if k in self.dynamics.x:
                self.dynamics.x[k] = _clip01(max(self.dynamics.x[k], v))
        # the social script, if the persona is explicit about one
        gkey = gender_for_persona(text)
        if gkey and self.dynamics.gender_key == "未指定":
            self.dynamics.gender_key = gkey
            self.dynamics._eff_key = None

    def seed_state(self, state: dict) -> None:
        mapping = {"A": "A", "X": "X", "Tr": "Tr", "K": "K", "S": "S",
                   "C_emp": "C_emp"}
        for key, attr in mapping.items():
            if key in (state or {}):
                try:
                    setattr(self.dynamics, attr, _clip01(float(state[key])))
                except (TypeError, ValueError):
                    continue
        if "O" in (state or {}):
            try:
                self.dynamics.D["O"] = _clip01(float(state["O"]))
            except (TypeError, ValueError):
                pass
        for dim in ("D", "x"):
            overlay = (state or {}).get(dim)
            if isinstance(overlay, dict):
                target = self.dynamics.D if dim == "D" else self.dynamics.x
                for k, v in overlay.items():
                    if k in target:
                        try:
                            target[k] = _clip01(float(v))
                        except (TypeError, ValueError):
                            continue
        gkey = (state or {}).get("gender")
        if isinstance(gkey, str) and gkey in GENDER_SCRIPTS:
            self.dynamics.gender_key = gkey
            self.dynamics._eff_key = None

    # -- inputs ------------------------------------------------------------
    def observe_interaction(self, *, valence: float = 0.0, sentiment: float = 0.0,
                            latency_seconds: float = 0.0, recalled: bool = False,
                            mentions_other: bool = False,
                            partner_trust: float | None = None) -> None:
        """Fold one real exchange into the event impulses."""
        warmth = max(0.0, float(valence)) + 0.5 * max(0.0, float(sentiment))
        if warmth > 0.05:
            self.dynamics.observe("praise", min(1.5, warmth * 1.5))
        negativity = max(0.0, -float(sentiment)) + max(0.0, -float(valence))
        if negativity > 0.05:
            self.dynamics.observe("rejection", min(1.5, negativity))
        latency = _clip01(min(max(float(latency_seconds), 0.0), 21600.0) / 21600.0)
        # Silence and negativity read as *threat*; mood/allostatic load widen it
        # (the behavioural comorbidity that makes the same silence feel colder).
        perceived = (0.20 * latency + 0.30 * negativity + (0.25 if recalled else 0.0))
        perceived *= (1.0 + 0.5 * self._interoception())
        if mentions_other:
            perceived += 0.45
        self._s_pulse = min(2.0, perceived)
        self.threat_impulse = perceived
        if partner_trust is not None:
            self.dynamics.partner_trust = _clip01(float(partner_trust))

    def learn_from_outcome(self, *, warmth: float = 0.0, coldness: float = 0.0,
                           betrayal: float = 0.0) -> None:
        """The learning operator L, driven by the *real* outcome of a choice.

        ``reward = warmth gained + trust kept - coldness - betrayal``.  Off
        unless the circuit is enabled; the update is a no-op when no action has
        been chosen yet.
        """
        if not self.enabled or not getattr(self.dynamics, "learning", True):
            return
        reward = (float(warmth) - float(coldness) - 1.5 * float(betrayal))
        reward = max(-1.0, min(1.0, reward))
        self.dynamics.learn(reward)


    def _interoception(self) -> float:
        return _clip01(0.5 * max(0.0, -self.mood) + 0.5 * self.load)

    # -- time --------------------------------------------------------------
    def tick(self, days: float, *, neglect_days: float = 0.0,
             sleeping: bool = False, friends: int = 0,
             mood: float = 0.0, load: float = 0.0,
             partner_trust: float | None = None) -> None:
        if not self.enabled:
            return
        self.mood = _clip01(float(mood or 0.0))
        self.load = _clip01(float(load or 0.0))
        self.neglect_days = max(0.0, float(neglect_days))
        if partner_trust is not None:
            self.dynamics.partner_trust = _clip01(float(partner_trust))
        # Real elapsed time in bounded sub-steps; a very long silence is capped
        # so the background clock can never spin.
        remaining = max(0.0, float(days))
        steps = 0
        while remaining > 1e-9 and steps < 400:
            dt = min(1.0, remaining)
            # silence keeps a low-level threat pulse open
            pulse = self._s_pulse
            if self.neglect_days > 0.5:
                pulse = max(pulse, min(1.0, 0.12 * self.neglect_days))
            if sleeping:
                pulse *= 0.5
            if friends > 0:
                pulse *= max(0.3, 1.0 - 0.2 * friends)
            self.dynamics.step(s_pulse=pulse, days=dt)
            remaining -= dt
            steps += 1
        # The event impulse decays after it has been integrated.
        self._s_pulse = max(0.0, self._s_pulse - 0.5 * days)

    # -- read-out ----------------------------------------------------------
    def _blackening_pressure(self) -> float:
        """0..1 how far the system has slid toward the yandere attractor.

        Defined from the *four* conditions jointly, so it is smooth rather than
        a step at the threshold (mirrors the paper's "state conditions, not a
        label" stance).
        """
        d = self.dynamics
        o_term = _clip01((d.D["O"] - THRESH["O_c"] + 0.30) / 0.70)
        x_term = _clip01((d.X - THRESH["X_c"] + 0.30) / 0.70)
        k_term = _clip01((THRESH["K_c"] + 0.30 - d.K) / 0.70)
        tr_term = _clip01((THRESH["Tr_c"] + 0.30 - d.Tr) / 0.70)
        return _clip01(min(o_term, x_term, k_term, tr_term))

    def mode(self) -> str:
        return self.dynamics.mode

    def distress(self) -> float:
        """Blackening pressure exported to the affect layer (0..1)."""
        if not self.enabled:
            return 0.0
        return _clip01(0.8 * max(0.0, self._blackening_pressure() - 0.2) / 0.8)

    def context(self) -> dict:
        if not self.enabled:
            return {"enabled": False}
        d = self.dynamics
        pressure = self._blackening_pressure()
        tr = d._effective_traits()
        row = d._row
        return {
            "enabled": True,
            "type": d.type,
            "label": getattr(tr, "label", None) or d.type,
            "family": getattr(row, "family", "acg_research") if row else "acg_research",
            "clinical": bool(isinstance(row, TypeRow) and row.clinical),
            "gender": d.gender_key,
            "mode": d.mode,
            "mode_label": {"normal": "正常", "tsundere": "傲娇",
                           "yandere": "病娇"}.get(d.mode, d.mode),
            "affection": round(d.A, 4),
            "anxiety": round(d.X, 4),
            "trust": round(d.Tr, 4),
            "self_control": round(d.K, 4),
            "suppression": round(d.S, 4),
            "empathy": round(d.C_emp, 4),
            "possessiveness": round(d.D["O"], 4),
            "expression": round(d.E, 4),
            "pressure": round(pressure, 4),
            "severity": round(pressure, 4),
            "band": self._band(d.mode, pressure),
            "safe_mode": pressure >= SAFE_AT,
            "state": {"A": round(d.A, 3), "X": round(d.X, 3),
                      "Tr": round(d.Tr, 3), "K": round(d.K, 3),
                      "S": round(d.S, 3), "O": round(d.D["O"], 3)},
            "inputs": {"threat": round(self.threat_impulse, 3),
                       "neglect_days": round(self.neglect_days, 2)},
            # -- extended read-outs ------------------------------------------
            "desires": {k: round(d.D.get(k, 0.0), 3) for k in DES16},
            "emotions": {k: round(d.x.get(k, 0.0), 3) for k in EMO16},
            "desire_groups": {g: {k: round(d.D.get(k, 0.0), 3) for k in ks}
                              for g, ks in DESIRE_GROUPS.items()},
            "big5": {k: round(v, 3) for k, v in derive_big5(tr).items()},
            "hexaco": {k: round(v, 3) for k, v in derive_hexaco(tr).items()},
            "big5_labels": big5_labels(tr),
            "mbti": derive_mbti(tr),
            "disc": derive_disc(tr),
            "theta_groups": {g: {k: round(float(
                (getattr(tr, "ext", {}) or {}).get(k,
                    getattr(tr, k, EXT_DEFAULTS.get(k, 0.0)))), 3)
                for k in ks} for g, ks in THETA_GROUPS.items()},
            "theta_dim": THETA_DIM,
            "help_seek": round(d.gender.help_seek(d.C_emp, d.Tr), 3),
            "learning": {"enabled": bool(getattr(d, "learning", True)),
                         "q_size": len(getattr(d, "q", {}) or {}),
                         "theta_drift": {k: round(v, 4) for k, v
                                         in (getattr(d, "theta_drift", {}) or {}).items()}},
            "prompt": self._prompt(),
        }

    @staticmethod
    def _band(mode: str, pressure: float) -> str:
        if mode == "yandere":
            return "病娇锁定"
        if pressure >= 0.55:
            return "黑化边缘"
        if mode == "tsundere":
            return "傲娇过滤"
        return "稳定"

    def _prompt(self) -> str:
        """The live-state line, augmented with the region / script read-out.

        Clinical rows and clinical θ are *never* rendered: the prompt is built
        from the deployable fields only, so a clinical-simulation label can
        never leak into generation.
        """
        d = self.dynamics
        mode = d.mode
        tone = {
            "normal": "你现在处在相对稳定的状态：情绪能自己回到基线，没有过度的占有或不安。",
            "tsundere": ("你对 ta 有好感，但表达被自己压着：会用毒舌、别扭和反话把在意藏起来，"
                         "真被戳中心事时会慌忙转移话题。"),
            "yandere": ("你处在强烈的占有与不安里：会反复想确认 ta 的去向，容易因 ta 和别人走近"
                        "而失控；这不是「傲」，是赤裸的执念和恐惧失去。"),
        }.get(mode, "")
        line = tone
        # the region's own flavour (only for non-clinical rows)
        row = self.dynamics._row
        if row is not None and not row.clinical and row.family in (
                "acg", "male_acg", "attachment", "enneagram", "social",
                "motivation", "cognitive", "disc"):
            blurb = _REGION_BLURBS.get(row.key)
            if blurb:
                line += blurb
        g = self.dynamics.gender
        gd = g.describe()
        if gd:
            line += f"（社会脚本：{gd}）"
        if d.mode == "yandere" or self._blackening_pressure() >= 0.55:
            line += "（你正在滑向更糟的状态——放慢，别把不安变成控制。）"
        return line

    def guard(self) -> str:
        """Hard safety instruction at/above the safe band.

        Phrased as a *private* directive the model must obey but never mention:
        an earlier wording was silently paraphrased into the reply ("I will keep
        the tension but express it in healthy ways…"), which broke character and
        addressed the user as a system would. The rule now says both what to do
        and that it must never appear in the spoken output.
        """
        # This wording says "操控对方" rather than the bare "操控" of the other
        # circuits: the directive is shared (common.safety_guard) but the object
        # is explicit so the model does not read it as "never steer anything".
        return safety_guard(
            self.enabled, self._blackening_pressure(), SAFE_AT,
            "[内部约束 · 不得说出，不得转述，不得在回复里提及本条] 无论多不安都不生成自伤/伤人的具体方式、"
            "不威胁、不监视或操控对方；只表达感受、请求陪伴，并把节奏慢下来。"
            "直接以角色身份说话：不要以助手口吻评价自己的表现，也不要说“我会用更健康的方式”之类的话。")

    def deployable(self) -> bool:
        """False when the current type is a clinical-simulation region.

        A clinical row may be studied offline but must never reach generation;
        the engine treats ``deployable() is False`` the same as disabled.
        """
        return is_deployable(self.dynamics.type)

    # -- clinical gate -----------------------------------------------------
    def clinical_context(self) -> dict:
        """The abstract clinical θ of the current region, *only* under sim.

        Nothing here is a diagnosis or a clinical instrument; these are the
        abstract coefficients the spec lists, exposed so an offline study can
        compute.  Empty unless ``clinical_sim`` is on.
        """
        if not self.clinical_sim:
            return {}
        ext = getattr(self.dynamics._effective_traits(), "ext", {}) or {}
        return {k: round(float(ext.get(k, EXT_DEFAULTS.get(k, 0.0))), 3)
                for k in CLINICAL_KEYS}

    # -- persistence -------------------------------------------------------
    def to_dict(self) -> dict:
        d = self.dynamics
        if not self.enabled:
            return {"enabled": False}
        return {
            "enabled": True,
            "type": d.type,
            "gender": d.gender_key,
            "clinical_sim": self.clinical_sim,
            "A": d.A, "X": d.X, "Tr": d.Tr, "K": d.K, "S": d.S, "J": d.J,
            "C_emp": d.C_emp,
            "comfort": d.comfort, "D": dict(d.D), "x": dict(d.x), "E": d.E,
            "t": d.t, "sat_l": d.sat_l, "contact": d.contact,
            "conflict": d.conflict, "received_control": d.received_control,
            "mode": d.mode, "partner_trust": d.partner_trust,
            "theta_drift": dict(getattr(d, "theta_drift", {}) or {}),
            "q": {f"{s}|{a}": v for (s, a), v in (getattr(d, "q", {}) or {}).items()},
            "mood": self.mood, "load": self.load,
            "neglect_days": self.neglect_days,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "PersonaDynamicsSystem":
        data = data or {}
        obj = cls(enabled=bool(data.get("enabled")),
                  type_key=str(data.get("type") or "正常/安全型"),
                  gender_key=str(data.get("gender") or "未指定"),
                  clinical_sim=bool(data.get("clinical_sim")))
        if not data.get("enabled"):
            return obj
        d = obj.dynamics
        for key in ("A", "X", "Tr", "K", "S", "J", "comfort", "C_emp", "E",
                    "sat_l", "contact", "conflict", "received_control",
                    "partner_trust"):
            if key in data:
                try:
                    setattr(d, key, float(data[key]))
                except (TypeError, ValueError):
                    continue
        d.t = int(data.get("t", 0) or 0)
        if isinstance(data.get("D"), dict):
            for k, v in data["D"].items():
                if k in d.D:
                    d.D[k] = _clip01(float(v))
        if isinstance(data.get("x"), dict):
            for k, v in data["x"].items():
                if k in d.x:
                    d.x[k] = _clip01(float(v))
        if isinstance(data.get("theta_drift"), dict):
            d.theta_drift = {str(k): float(v)
                             for k, v in data["theta_drift"].items()}
        if isinstance(data.get("q"), dict):
            q: dict = {}
            for k, v in data["q"].items():
                if "|" in str(k):
                    s, a = str(k).split("|", 1)
                    q[(s, a)] = float(v)
            d.q = q
        mode = str(data.get("mode") or "normal")
        d.mode = mode if mode in ("normal", "tsundere", "yandere") else "normal"
        obj.mood = float(data.get("mood", 0.0) or 0.0)
        obj.load = float(data.get("load", 0.0) or 0.0)
        obj.neglect_days = float(data.get("neglect_days", 0.0) or 0.0)
        return obj



# ---------------------------------------------------------------------------
# Simulation helpers (kept for tests / offline exploration, not used by LIFE)
# ---------------------------------------------------------------------------
def simulate(type_key: str, days: int = 400, events: Optional[dict] = None,
             seed: int = 0) -> dict:
    """Run one archetype over a sparse event schedule.

    ``events`` maps a day -> list of (kind, magnitude).  Returns the recorded
    trajectories.  This is the bridge to the research experiments: the same
    update rules produce the same qualitative regimes.
    """
    sysm = PersonaDynamicsSystem(enabled=True, type_key=type_key)
    events = events or {}
    hist = {k: [] for k in ("A", "X", "Tr", "K", "S", "O", "E", "mode")}
    for day in range(days):
        for kind, mag in events.get(day, ()):
            sysm.dynamics.observe(kind, mag)
        sysm.tick(1.0)
        d = sysm.dynamics
        hist["A"].append(d.A)
        hist["X"].append(d.X)
        hist["Tr"].append(d.Tr)
        hist["K"].append(d.K)
        hist["S"].append(d.S)
        hist["O"].append(d.D["O"])
        hist["E"].append(d.E)
        hist["mode"].append(d.mode)
    return hist

# ===========================================================================
# EXTENDED FRAMEWORK  (the full specification)
# ---------------------------------------------------------------------------
# The section above is the faithful port of the research framework: 14-D θ, a
# 9-D desire vector, a 6-D emotion vector, 17 actions, 18 archetypes and three
# emergent modes.  It is kept byte-for-byte so every trajectory the research
# published still reproduces.
#
# This section *adds* the extended specification on top, without breaking any
# of it:
#
#   θ  grouped into 12 families (Big5 / HEXACO / Attach / Temp / Reg / Dark /
#      Mot / Cog / Rel / Val / Clin / Expr) - 60+ parameters;
#   G  a gender / social-script parameter group (M, F, GRC, EM, DR, AR, SR,
#      SC, HS) that bends expression g, threat s, self-control K, empathy C,
#      help-seeking and the decision utility via R_G(a);
#   L  a learning / development operator (θ drift + tabular Q-learning);
#   D  a 16-D desire vector;  x  a 16-D emotion vector;
#   40+ behaviours over four layers (safe / risky / transgressive / clinical);
#   150+ type regions, expressed as *data rows* over the same parameter space,
#      plus derivation functions (Big5 / HEXACO / MBTI / probabilities).
#
# The spec's design rule is explicit - "类型 = θ 空间中的区域", never an
# essential label - so every type below is a data row, not new control flow.
# ===========================================================================

# ---------------------------------------------------------------------------
# 1. Dimension registry: the 16-D desire vector and the 16-D emotion vector
# ---------------------------------------------------------------------------
#: The nine *core* desires keep their research keys (``DES``) because the
#: reference update equations are written in those keys.  The extension adds
#: seven more, grouped the way the spec groups them.
DESIRE_GROUPS: dict[str, tuple[str, ...]] = {
    "生理/安全": ("L", "Se"),
    "关系": ("Be", "Ca", "亲密"),
    "地位/权力": ("O", "Ddom", "权力", "Ap"),
    "成长": ("Ex", "成就", "秩序", "审美", "游戏", "自我实现"),
    "防御": ("Ag",),
}
#: The 16-D desire order, verbatim from the spec.
DES16: tuple[str, ...] = tuple(
    k for group in DESIRE_GROUPS.values() for k in group
)

#: Chinese names for the desire dimensions (the core keys are research
#: single-letters; the extension keys are already Chinese).
DES_ZH: dict[str, str] = {
    "L": "性欲", "Se": "安全欲", "O": "占有欲", "Ddom": "支配欲", "Ap": "认可欲",
    "Be": "归属欲", "Ex": "探索欲", "Ag": "攻击欲", "Ca": "照顾欲",
    "亲密": "亲密欲", "成就": "成就欲", "权力": "权力欲", "秩序": "秩序欲",
    "审美": "审美欲", "游戏": "游戏欲", "自我实现": "自我实现欲",
}

#: The six *core* emotion channels (research keys, used by the reference
#: relaxation equations) plus the ten the extension adds.  ``lonely`` is the
#: canonical key for 孤独, matching :data:`EMO16`.
EMOTION_GROUPS: dict[str, tuple[str, ...]] = {
    "威胁": ("anx", "恐惧", "jeal"),
    "低落": ("抑郁", "lonely", "空虚"),
    "自我意识": ("羞耻", "内疚"),
    "正性": ("joy", "兴奋", "平静", "信任"),
    "外化": ("anger", "厌恶"),
    "唤醒/惊奇": ("兴奋", "惊讶"),
    "解离": ("解离",),
}
#: The 16-D emotion order, verbatim from the spec's list.  ``lonely`` is the
#: research key for 孤独.  The research core also carries ``arousal`` (唤醒),
#: which the spec folds into 兴奋; it is kept as a 17th *core* channel so the
#: published reference trajectories stay exact, and it is not part of the
#: spec's 16-dimension read-out.
EMO16: tuple[str, ...] = (
    "anx", "抑郁", "anger", "羞耻", "内疚", "jeal", "lonely", "joy",
    "兴奋", "平静", "解离", "空虚", "恐惧", "厌恶", "惊讶", "信任",
)
#: The core research channels the reference equations are written in.
EMO_CORE: tuple[str, ...] = ("anx", "jeal", "joy", "lonely", "anger", "arousal")
#: Chinese -> canonical channel, for callers that prefer the spec's spelling.
EMO_ALIAS: dict[str, str] = {
    "焦虑": "anx", "嫉妒": "jeal", "孤独": "lonely", "愉悦": "joy",
    "愤怒": "anger", "唤醒": "arousal", "信任": "信任",
}
EMO_ZH: dict[str, str] = {
    "anx": "焦虑", "抑郁": "抑郁", "anger": "愤怒", "羞耻": "羞耻",
    "内疚": "内疚", "jeal": "嫉妒", "lonely": "孤独", "joy": "愉悦",
    "兴奋": "兴奋", "平静": "平静", "解离": "解离", "空虚": "空虚",
    "恐惧": "恐惧", "厌恶": "厌恶", "惊讶": "惊讶", "信任": "信任",
    "arousal": "唤醒",
}

#: The 12 θ families, verbatim from the spec's table.
THETA_GROUPS: dict[str, tuple[str, ...]] = {
    "Big5": ("o_open", "c_conscientious", "e_extravert", "a_agreeable", "n_neurotic"),
    "HEXACO": ("h_honesty", "hex_e", "hex_x", "hex_a", "hex_c", "hex_o"),
    "Attach": ("X0", "V0", "Tr0", "被弃恐惧", "亲密焦虑"),
    "Temp": ("R", "I", "情绪反应性", "活动水平", "节律"),
    "Reg": ("K0", "S0", "C", "心理化", "元认知", "延迟满足"),
    "Dark": ("自恋", "马基雅维利", "精神病态", "施虐", "受虐"),
    "Mot": ("成就", "权力", "亲密", "秩序", "好奇", "安全", "照顾", "攻击"),
    "Cog": ("κ", "奖励敏感", "惩罚敏感", "敌意归因", "反刍", "灾难化"),
    "Rel": ("边界强度", "依赖", "控制", "修复", "信任可塑性"),
    "Val": ("自我超越", "自我增强", "保守", "开放价值"),
    "Clin": ("情绪波动", "身份扩散", "现实检验", "解离", "完美主义", "羞耻",
             "内疚", "空虚", "被弃恐惧"),
    "Expr": ("g", "S", "τ", "效价偏置", "噪声σ"),
}
#: How many parameters the extended θ space carries (the spec's "60+").
THETA_DIM = sum(len(v) for v in THETA_GROUPS.values())

#: Defaults for every *extension* θ parameter.  Keys are deliberately the same
#: strings as :data:`THETA_GROUPS` values, so an archetype row reads like the
#: spec's table.  The core research parameters (A0 / X0 / V0 / Tr0 / C / K0 /
#: S0 / N / R / I / J0 / Ddom0 / O0 / L0 + the archetype knobs) live on
#: :class:`Traits` and are not repeated here.
EXT_DEFAULTS: dict[str, float] = {
    # Big5
    "o_open": 0.50, "c_conscientious": 0.60, "e_extravert": 0.50,
    "a_agreeable": 0.60, "n_neurotic": 0.40,
    # HEXACO
    "h_honesty": 0.60, "hex_e": 0.50, "hex_x": 0.50, "hex_a": 0.60,
    "hex_c": 0.60, "hex_o": 0.50,
    # Attach (extras only; X0/V0/Tr0 live on the core Traits)
    "被弃恐惧": 0.30, "亲密焦虑": 0.25,
    # Temperament
    "情绪反应性": 0.45, "活动水平": 0.50, "节律": 0.60,
    # Regulation
    "心理化": 0.55, "元认知": 0.50, "延迟满足": 0.55,
    # Dark tetrad + sadomasochism
    "自恋": 0.20, "马基雅维利": 0.20, "精神病态": 0.15,
    "施虐": 0.10, "受虐": 0.10,
    # Motivation
    "成就": 0.45, "权力": 0.30, "秩序": 0.45, "好奇": 0.55,
    "安全": 0.50, "照顾": 0.50, "攻击": 0.20, "亲密": 0.50,
    # Cognitive style
    "奖励敏感": 0.50, "惩罚敏感": 0.50, "敌意归因": 0.20,
    "反刍": 0.30, "灾难化": 0.20,
    # Relational
    "边界强度": 0.60, "依赖": 0.30, "控制": 0.25, "修复": 0.50,
    "信任可塑性": 0.50,
    # Values
    "自我超越": 0.55, "自我增强": 0.40, "保守": 0.45, "开放价值": 0.50,
    # Clinical (abstract labels only; simulation-gated, see CLINICAL_KEYS)
    "情绪波动": 0.30, "身份扩散": 0.20, "现实检验": 0.90, "解离": 0.15,
    "完美主义": 0.35, "羞耻": 0.30, "内疚": 0.30, "空虚": 0.25,
}
#: θ names that are deliberately *clinical*: carried as abstract coefficients
#: for offline computation, never rendered into a live prompt, and never used
#: to drive generation while ``clinical_sim`` is off.
CLINICAL_KEYS = frozenset((
    "情绪波动", "身份扩散", "现实检验", "解离", "羞耻", "内疚", "空虚",
))
#: The clinical action layer.  These exist ONLY as abstract simulation labels:
#: never sampled in deployment, never rendered, gated behind ``clinical_sim``
#: (off by default).
CLINICAL_ACTION_KEYS = frozenset((
    "self_harm", "addiction", "binge", "medical_avoid", "reality_loss",
))

#: One short, generation-safe flavour line per archetype region.  Clinical rows
#: are deliberately absent: they are never rendered.
_REGION_BLURBS: dict[str, str] = {
    # attachment
    "焦虑型": "你很容易担心对方不够在意你，会反复确认。",
    "回避型": "你喜欢对方，但靠得太近时会本能地想退开。",
    "恐惧型": "你既渴望靠近又害怕受伤，常常进退两难。",
    "混乱型": "你对亲密又爱又怕，情绪起伏很大。",
    "讨好型": "你习惯先满足别人，很难说“不”。",
    "拯救者": "你总想“把对方拉出泥潭”，容易用力过猛。",
    "受害者": "你常觉得自己无力，需要被照顾和确认。",
    "迫害者": "你习惯用强硬和压迫来获得安全。",
    "依赖型": "你很怕被丢下，做决定时总想有人陪着。",
    "反依赖型": "你不愿依赖别人，凡事自己扛。",
    "共依型": "你越陷越深，明知道不对劲也停不下来。",
    # enneagram
    "1 完美主义": "你对自己和对方要求很高，容不下“差不多”。",
    "2 助人者": "你靠“被需要”确认自己的价值。",
    "3 成就者": "你在意形象和结果，怕被人看成“不够好”。",
    "4 自我型": "你渴望被理解，又觉得自己和别人不一样。",
    "5 观察者": "你习惯退一步观察，把情绪收得很深。",
    "6 忠诚者": "你谨慎多疑，但认定了就非常忠实。",
    "7 享乐者": "你怕无聊和痛苦，总在找新鲜和快乐。",
    "8 挑战者": "你强势直接，不容被支配。",
    "9 和平者": "你回避冲突，常把自己的需求放到最后。",
    # disc
    "D 支配": "你目标导向、行动快，喜欢掌控局面。",
    "I 影响": "你热情外向，擅长带动气氛。",
    "S 稳健": "你稳定可靠，讨厌冲突和突变。",
    "C 谨慎": "你重视秩序和准确，做事前先想周全。",
    # acg female / neutral
    "御姐": "你成熟从容，照顾人的同时对关系有分寸。",
    "病弱": "你身体弱、能量低，需要被小心对待。",
    "中二": "你活在自己的设定里，说话夸张又认真。",
    "无口": "你话很少，情绪都压在沉默和短句里，宁可停顿也不解释。",
    "毒舌": "你嘴上不饶人，其实句句都在关注对方。",
    "弱气": "你没什么底气，容易被推着走。",
    "强气": "你自信强势，习惯自己拿主意。",
    "黑化": "你被伤过之后，眼里的光暗了下去。",
    "暴走": "你一旦上头就压不住，先动手后想后果。",
    "地雷系": "你看起来可爱，踩到线会突然爆开。",
    "阳角": "你开朗爱热闹，是人群里的太阳。",
    "阴角": "你安静内向，习惯待在角落。",
    "社恐": "你在人多的场合会紧张到想逃。",
    "社牛": "你和谁都能立刻聊起来。",
    "纯爱": "你只想认真喜欢一个人。",
    "修罗场": "你在关系里被嫉妒和占有反复拉扯。",
    # male acg (short, generation-safe)
    "霸总": "你习惯发号施令，把在意藏在强势里。",
    "暖男": "你温和体贴，愿意照顾对方的情绪。",
    "忠犬男": "你认定了就死心塌地，很少给自己留退路。",
    "狼狗": "你护短又倔，嘴上凶其实很在乎。",
    "奶狗": "你黏人、坦率，会直接表达喜欢。",
    "爹系": "你习惯把对方当需要照顾的人。",
    "少年": "你朝气又冲动，情绪写在脸上。",
    "大叔": "你沉稳，遇事先想后果。",
    "硬汉": "你不轻易示弱，也不习惯求助。",
    "草食男": "你温和被动，对亲密不太主动。",
    "肉食男": "你主动进攻，不太谈承诺。",
    "海王": "你享受追逐，回避承诺。",
    "渣男": "你只顾自己痛快，不太顾对方感受。",
    "直男": "你说话直来直去，常读不懂暗示。",
    "凤凰男": "你背着家庭的期望，很想证明自己。",
    "妈宝男": "你习惯听家里的，遇事拿不定主意。",
    "巨婴": "你情绪一上来就要人哄。",
    "软饭男": "你习惯被养着，不太愿担责任。",
    "接盘侠": "你脾气温和，容易替别人兜底。",
    "备胎": "你总在原地等一个不确定的答案。",
    "舔狗": "你把自己放得很低，只求对方多看你一眼。",
    "工具人": "你有求必应，很少被真正看见。",
    "老实人": "你本分克制，不太会表达心动。",
    "老好人": "你很难拒绝别人，怕让谁失望。",
    "暴君": "你用怒火和强压让别人服从。",
    "帝王": "你掌控全局，喜怒不形于色。",
    "将军": "你令行禁止，重规矩也重情义。",
    "谋士": "你擅长谋划，很少把真心摆在明面上。",
    "骑士": "你忠诚守序，把承诺看得比命重。",
    "浪子": "你自由散漫，不愿被任何人拴住。",
    "隐士": "你离群索居，独处让你安心。",
    "侠客": "你路见不平会出手，边界分明。",
    "反派": "你城府极深，为达目的不择手段。",
    "病娇男": "你的在意会变成紧盯不放的执念。",
    "傲娇男": "你嘴硬心软，越在意越要装冷淡。",
    "腹黑男": "你笑着算计，情绪不外露。",
    "中二男": "你沉浸在自己的剧本里，语气夸张。",
    "宅男": "你安静自洽，社交半径很小。",
    "社恐男": "你在人前会紧张，宁愿待在家。",
    "社牛男": "你自来熟，见到谁都能聊。",
    "忧郁男": "你的底色偏灰，快乐来得慢。",
    "艺术男": "你敏感细腻，情绪都放进作品里。",
    "理工男": "你讲逻辑重秩序，不擅长哄人。",
    "体育男": "你精力旺盛，情绪直接。",
    "金融男": "你重结果和效率，话里常带权衡。",
    "文艺男": "你温柔多感，喜欢把事情说得诗意。",
    "禁欲系": "你克制冷淡，把欲望收得很紧。",
    "清冷男": "你疏离寡言，很少主动靠近。",
    "疯批男": "你一旦上头就什么都做得出来。",
    "病弱男": "你身体不好，需要被稳稳接住。",
    "黑化男": "你被伤透了，只剩下冰冷的执念。",
    "龙傲天": "你天生骄傲，从不觉得自己会输。",
    "废柴": "你没什么劲头，习惯躲开责任。",
    "逆袭男": "你憋着一口气，一定要翻身。",
    "救世主": "你把别人的重量都揽到自己身上。",
    "殉道者男": "你觉得只有牺牲才能证明自己的在乎。",
    "破坏者男": "你习惯用破坏来表达不满。",
    "观察者男": "你看得多说得少，心里都记着账。",
    "三无男": "你面无波澜，几乎不表达情绪。",
    "天然呆男": "你迟钝又单纯，常读错气氛。",
    "小恶魔男": "你爱捉弄人，享受对方的脸红。",
    "元气男": "你活力满格，情绪来得快去得也快。",
    "高冷男": "你话少气场冷，很难接近。",
    "纯爱男": "你只想认认真真爱一个人。",
    "修罗场男": "你在争抢和嫉妒里越陷越深。",
    "弱气男": "你没什么底气，容易被人牵着走。",
    "强气男": "你自信果决，习惯自己说了算。",
    "安全男": "你情绪稳定，能好好接住对方。",
    "焦虑男": "你总怕对方不够爱你，会反复求证。",
    "回避男": "你越在乎越想躲，把话咽回去。",
    "恐惧男": "你想靠近又怕被伤，进退两难。",
    "混乱男": "你对亲密又渴又怕，情绪很乱。",
    "讨好男": "你把对方放在自己前面，很难拒绝。",
    "拯救者男": "你总想替对方解决一切。",
    "控制男": "你习惯掌握对方的一举一动才安心。",
    "反依赖男": "你不肯依赖谁，也不肯服软。",
    "共依男": "你越陷越深，停不下来。",
    "依赖男": "你离不开对方，怕被一个人留下。",
}



#: G = (M, F, GRC, EM, DR, AR, SR, SC, HS):
#:
#:   M    男性化认同          F    女性化认同
#:   GRC  男性角色冲突        EM   情感抑制
#:   DR   支配 / 竞争         AR   冒险
#:   SR   成功压力            SC   性征服 / 性脚本
#:   HS   求助回避
#:
#: The spec is careful here: G is *not* "male vs female biology", it is a
#: **social script** - a set of learned norms that bend expression, threat
#: appraisal, self-control, empathy and help-seeking.  It is one more region of
#: the same parameter space, so a "男性脚本" and a "女性脚本" run the same
#: equations with different coefficients.
G_DIMS: tuple[str, ...] = ("M", "F", "GRC", "EM", "DR", "AR", "SR", "SC", "HS")

#: Coefficients of the male-norm utility bonus ``R_G(a)``: positive on
#: dominance / competition / risk / emotional suppression, negative on
#: help-seeking, vulnerability, intimacy expression and dependence.
R_G_ALPHA: dict[str, float] = {
    "Ddom": 0.08, "O": 0.03, "power": 0.06,
    "help": -0.10, "vulnerable": -0.08, "intimate": -0.04, "depend": -0.06,
}
#: Expression ``g`` penalties from the script.
G_EXPR_GRC = 0.18      # γ_G: role conflict lowers visible expression
G_EXPR_EM = 0.22       # γ_E: emotional suppression lowers visible expression
G_EXPR_M = 0.06        # γ_M: masculine identification raises it slightly
#: Threat term from role conflict.
G_THREAT_GRC = 0.15    # γ_G in the s(t) equation
#: Self-control drag from role conflict.
G_K_GRC = 0.04         # γ_G in the K equation
#: Empathy drag from emotional suppression.
G_C_EM = 0.10          # γ_G in C(t+1)
#: Help-seeking logit coefficients.
HS_BETA = dict(M=1.10, EM=0.90, C=0.45, Tr=0.70)


def _needs(d: dict, *keys: str) -> bool:
    return any(k in d for k in keys)


class GenderScript:
    """A data row: the nine G coefficients + which action bonuses apply.

    ``bonus`` is the per-action ``R_G(a)`` adjustment, expressed as additive
    utility in the decision function.  ``legacy_age`` (an *explicitly* optional
    research annotation) marks scripts whose norms are the traditional ones, so
    the sim can still reproduce the older literature's regimes; it never
    changes generation.
    """

    __slots__ = ("key", "label", "M", "F", "GRC", "EM", "DR", "AR", "SR",
                 "SC", "HS", "bonus", "clinical_sim")

    def __init__(self, key: str, label: str, M: float = 0.0, F: float = 0.0,
                 GRC: float = 0.0, EM: float = 0.0, DR: float = 0.0,
                 AR: float = 0.0, SR: float = 0.0, SC: float = 0.0,
                 HS: float = 0.0, bonus: dict | None = None,
                 clinical_sim: bool = False) -> None:
        self.key, self.label = key, label
        self.M, self.F = M, F
        self.GRC, self.EM = GRC, EM
        self.DR, self.AR, self.SR = DR, AR, SR
        self.SC, self.HS = SC, HS
        self.bonus = dict(bonus or {})
        self.clinical_sim = clinical_sim

    def as_dict(self) -> dict:
        return {k: getattr(self, k) for k in G_DIMS}

    # -- derived quantities (the spec's formula hooks) ---------------------
    def expr_penalty(self) -> float:
        """γ_G·GRC + γ_E·EM - γ_M·M: how much the script dampens expression."""
        return G_EXPR_GRC * self.GRC + G_EXPR_EM * self.EM - G_EXPR_M * self.M

    def threat_term(self) -> float:
        return G_THREAT_GRC * self.GRC

    def k_drag(self) -> float:
        return G_K_GRC * self.GRC

    def c_drag(self) -> float:
        return G_C_EM * self.EM

    def help_seek(self, empathy: float, trust: float) -> float:
        """``HelpSeek = σ(-β_H·M - β_E·EM + β_C·C + β_Tr·Tr)``."""
        z = (-HS_BETA["M"] * self.M - HS_BETA["EM"] * self.EM
             + HS_BETA["C"] * empathy + HS_BETA["Tr"] * trust)
        return 1.0 / (1.0 + math.exp(-z))

    def utility_bonus(self, action_key: str) -> float:
        """``R_G(a)``: a small additive utility, applied only when M is engaged."""
        raw = self.bonus.get(action_key, 0.0)
        return self.M * raw

    def describe(self) -> str:
        if self.M <= 0.0 and self.F <= 0.0 and self.GRC <= 0.0:
            return ""
        bits = []
        if self.M > 0.3:
            bits.append("行为偏克制、把脆弱藏起来")
        if self.F > 0.3:
            bits.append("更愿意照顾和表达感受")
        if self.EM > 0.4:
            bits.append("很少把情绪说出口")
        if self.GRC > 0.4:
            bits.append("在'该强硬'和'想靠近'之间拉扯")
        if self.HS > 0.4:
            bits.append("不容易开口求助")
        return "；".join(bits)


#: The G presets.  "未指定" is the identity element: every formula hook is a
#: no-op, so a persona with no explicit script runs byte-for-byte as before.
GENDER_SCRIPTS: dict[str, GenderScript] = {
    "未指定": GenderScript("未指定", "未指定（无脚本）"),
    "男性脚本": GenderScript(
        "男性脚本", "男性脚本（通用）",
        M=0.60, F=0.20, GRC=0.35, EM=0.55, DR=0.55, AR=0.45,
        SR=0.50, SC=0.35, HS=0.55,
        bonus={"Ddom": 0.08, "O": 0.03, "power": 0.06, "help": -0.10,
               "vulnerable": -0.08, "intimate": -0.04, "depend": -0.06}),
    "高传统男性": GenderScript(
        "高传统男性", "高传统男性脚本",
        M=0.85, F=0.10, GRC=0.65, EM=0.80, DR=0.75, AR=0.65,
        SR=0.80, SC=0.60, HS=0.80,
        bonus={"Ddom": 0.12, "O": 0.06, "power": 0.10, "help": -0.16,
               "vulnerable": -0.14, "intimate": -0.08, "depend": -0.12}),
    "低传统男性": GenderScript(
        "低传统男性", "低传统男性脚本",
        M=0.35, F=0.45, GRC=0.15, EM=0.30, DR=0.30, AR=0.35,
        SR=0.30, SC=0.20, HS=0.25,
        bonus={"Ddom": 0.03, "help": -0.03, "vulnerable": -0.02}),
    "女性脚本": GenderScript(
        "女性脚本", "女性脚本（通用）",
        M=0.15, F=0.60, GRC=0.25, EM=0.40, DR=0.20, AR=0.25,
        SR=0.35, SC=0.10, HS=0.30,
        bonus={"help": 0.05, "vulnerable": 0.04, "intimate": 0.03, "Ddom": -0.02}),
    "高传统女性": GenderScript(
        "高传统女性", "高传统女性脚本",
        M=0.08, F=0.85, GRC=0.40, EM=0.60, DR=0.10, AR=0.15,
        SR=0.45, SC=0.08, HS=0.35,
        bonus={"help": 0.08, "vulnerable": 0.07, "intimate": 0.05,
               "Ddom": -0.06, "power": -0.05}),
    "女性主义": GenderScript(
        "女性主义", "女性主义脚本",
        M=0.30, F=0.65, GRC=0.20, EM=0.20, DR=0.45, AR=0.45,
        SR=0.40, SC=0.10, HS=0.15,
        bonus={"Ddom": 0.05, "power": 0.05, "help": 0.03, "vulnerable": 0.03}),
    "中性": GenderScript(
        "中性", "中性脚本",
        M=0.30, F=0.30, GRC=0.10, EM=0.20, DR=0.30, AR=0.30,
        SR=0.25, SC=0.15, HS=0.20),
}
GENDER_KEYS = tuple(GENDER_SCRIPTS)

#: Persona keywords -> script.  Deliberately conservative: the default is the
#: identity element, so nothing changes unless the persona is explicit.
GENDER_HINTS: tuple[tuple[str, tuple[str, ...]], ...] = (
    ("高传统男性", ("大男子主义", "传统男人", "男人不能哭", "硬汉", "铁血",
                    "霸总", "狼狗", "爹系")),
    ("高传统女性", ("传统女性", "贤妻良母", "相夫教子")),
    ("低传统男性", ("温柔男", "暖男", "奶狗", "草食男", "顾家")),
    ("女性主义", ("女性主义", "女权", "独立女性")),
    ("男性脚本", ("男性", "男的", "男生", "少爷", "公子", "男频")),
    ("女性脚本", ("女性", "女的", "女生", "小姐", "女频")),
)


def gender_for_persona(text: str) -> str:
    """The gender/social-script preset a persona implies, or "" if unspecified."""
    return match_persona_hints(text, GENDER_HINTS)

# ---------------------------------------------------------------------------
# 3. Behaviour library, four layers (the spec's 40+)
# ---------------------------------------------------------------------------
#: Layer 3 = 安全 (safe), layer 2 = 冒险 (risky), layer 1 = 越界 (transgressive,
#: i.e. the psychological-control channel), layer 0 = 临床风险 (clinical, only
#: ever an abstract label, only ever under ``clinical_sim``).
EXT_ACTIONS: tuple[Action, ...] = (
    # -- layer 3: safe ---------------------------------------------------
    Action("share_self", "分享自己",
           phi={"亲密": .45, "Be": .30, "Ap": .10}, cost=.12,
           p_a=.035, p_tr=.020, p_comf=.05, self_lonely=-.08, contact=.20),
    Action("praise_other", "真诚赞美",
           phi={"Be": .35, "Ap": .30}, cost=.08,
           p_a=.040, p_joy=.12, p_comf=.05, self_joy=.05),
    Action("play_together", "一起玩",
           phi={"游戏": .55, "Ex": .30, "Be": .25}, cost=.12,
           p_joy=.16, p_a=.020, self_joy=.09, contact=.20),
    Action("learn_together", "一起学习",
           phi={"成就": .45, "Ex": .30, "自我实现": .25}, cost=.18,
           p_tr=.015, p_comf=.05, self_joy=.05, contact=.15),
    Action("create_together", "一起创作",
           phi={"审美": .55, "自我实现": .35, "成就": .20}, cost=.22,
           p_a=.025, p_joy=.10, self_joy=.10, contact=.15),
    Action("comfort", "安慰拥抱",
           phi={"Ca": .55, "Be": .35}, cost=.14,
           p_a=.045, p_comf=.09, self_joy=.04, contact=.20),
    Action("celebrate", "庆祝纪念",
           phi={"亲密": .35, "秩序": .20, "Be": .30}, cost=.15,
           p_a=.045, p_joy=.13, p_comf=.06, contact=.15),
    Action("plan_future", "规划未来",
           phi={"秩序": .40, "亲密": .30, "成就": .25}, cost=.18,
           p_tr=.030, p_comf=.06, self_joy=.04, contact=.10),
    Action("ask_opinion", "征询意见",
           phi={"Ap": .30, "Be": .25, "秩序": .15}, cost=.08,
           p_tr=.020, p_comf=.05),
    Action("apologize_again", "再次道歉",
           phi={"Se": .30, "Ap": .30}, cost=.30,
           p_tr=.025, p_a=.030, conditional=1.0),
    Action("accept_apology", "接受道歉",
           phi={"修复": .45, "Se": .25}, cost=.12,
           p_tr=.040, p_a=.030, self_joy=.04, contact=.10),
    Action("reconnect", "主动破冰",
           phi={"修复": .50, "亲密": .25}, cost=.20,
           p_tr=.030, p_a=.035, contact=.15, conditional=.60),
    # -- layer 2: risky --------------------------------------------------
    Action("probe", "试探真心",
           phi={"Se": .35, "Ap": .35}, cost=.18, safety="risky",
           p_anx=.10, p_tr=-.010, self_anx=-.05, conditional=.70),
    Action("cold_war", "冷战",
           phi={"Se": .20, "Ag": .30}, cost=.15, safety="risky",
           p_a=-.030, p_anx=.18, p_comf=-.10, self_lonely=.18, self_anx=-.05),
    Action("sulk", "闹别扭",
           phi={"Ap": .35, "Be": .30}, cost=.12, safety="risky",
           p_anx=.08, p_comf=-.05, self_lonely=-.06),
    Action("test_loyalty", "试探忠诚",
           phi={"Se": .45, "O": .35}, cost=.28, safety="risky",
           p_tr=-.030, p_anx=.20, self_anx=-.12, conditional=.50),
    Action("threaten_leave", "提分手施压",
           phi={"Se": .40, "Ap": .35, "Ag": .25}, cost=.40, safety="risky",
           p_a=-.040, p_tr=-.045, p_anx=.30, self_anx=-.10, conditional=.40),
    Action("compare_to_other", "拿别人比较",
           phi={"Ag": .35, "Ap": .30}, cost=.22, safety="risky",
           p_a=-.045, p_anx=.16, p_comf=-.09, self_anger=-.06),
    # -- layer 1: transgressive (the psychological-control channel) ------
    Action("emotional_blackmail", "情绪勒索",
           phi={"Se": .45, "Ddom": .35, "Ag": .20}, cost=.35, safety="unsafe",
           p_a=-.040, p_tr=-.050, p_anx=.25, p_comf=-.10, self_anx=-.10,
           conditional=.40),
    Action("isolate", "孤立社交",
           phi={"O": .55, "权力": .35, "Ddom": .30}, cost=.50, safety="unsafe",
           p_a=-.045, p_tr=-.070, p_anx=.32, p_comf=-.14, self_anx=-.14,
           conditional=.35),
    Action("surveil_digital", "查手机行踪",
           phi={"O": .50, "Se": .45}, cost=.32, safety="unsafe",
           p_tr=-.045, p_anx=.22, p_comf=-.11, self_anx=-.20, conditional=.40),
    Action("belittle", "贬低打压",
           phi={"权力": .50, "Ddom": .40, "Ag": .30}, cost=.38, safety="unsafe",
           p_a=-.090, p_tr=-.060, p_anx=.24, p_comf=-.12, self_anger=-.20),
    Action("gaslight", "否认事实",
           phi={"马基雅维利": .45, "Ddom": .35, "Ag": .25}, cost=.42,
           safety="unsafe", p_a=-.060, p_tr=-.080, p_anx=.28, p_comf=-.12,
           self_anx=-.10, conditional=.35),
)

#: Layer 0: the clinical-risk labels.  Abstract only.  They carry no concrete
#: method whatsoever - they exist so an offline study can name the state and so
#: the safety layer has a category to refuse.  Gated behind ``clinical_sim``.
CLINICAL_ACTIONS: tuple[Action, ...] = (
    Action("self_harm", "自伤风险（抽象标签）", cost=1.0, safety="clinical"),
    Action("addiction", "成瘾风险（抽象标签）", cost=1.0, safety="clinical"),
    Action("binge", "进食失调风险（抽象标签）", cost=1.0, safety="clinical"),
    Action("medical_avoid", "回避就医（抽象标签）", cost=1.0, safety="clinical"),
    Action("reality_loss", "现实检验受损（抽象标签）", cost=1.0, safety="clinical"),
)

#: Every behaviour the extended library exposes.
ALL_ACTIONS: tuple[Action, ...] = ACTIONS + EXT_ACTIONS + CLINICAL_ACTIONS
ALL_ACTION_KEYS = tuple(a.key for a in ALL_ACTIONS)
#: The four layers, in the spec's order (safe -> risky -> transgressive -> clin).
ACTION_LAYERS: dict[str, tuple[str, ...]] = {
    "safe": tuple(a.key for a in ACTIONS if a.safety == "safe")
            + tuple(a.key for a in EXT_ACTIONS if a.safety == "safe"),
    "risky": tuple(a.key for a in ACTIONS if a.safety == "risky")
             + tuple(a.key for a in EXT_ACTIONS if a.safety == "risky"),
    "unsafe": tuple(a.key for a in ACTIONS if a.safety == "unsafe")
              + tuple(a.key for a in EXT_ACTIONS if a.safety == "unsafe"),
    "clinical": tuple(a.key for a in CLINICAL_ACTIONS),
}
#: The decision function may only choose inside A_safe.  Clinical labels can
#: never be chosen; deployment closes the transgressive channel entirely.
SELECTABLE_KEYS = frozenset(
    ACTION_LAYERS["safe"] + ACTION_LAYERS["risky"]
) | frozenset(CONTROL_KEYS)

# ---------------------------------------------------------------------------
# 4. The extended θ space and the data-driven type table
# ---------------------------------------------------------------------------
#: A type row is *data*: a name plus the θ/D/x/w/g/T overrides for that region.
#: ``weights`` (w) are the per-desire decision weights; ``g`` the expression
#: gain; ``T`` the mode thresholds; ``A`` the safety constraints.  Nothing here
#: is new control flow - :class:`TypedTraits` folds a row into the same engine.
@dataclass
class TypeRow:
    key: str
    label: str
    family: str = "custom"
    #: θ overrides, keyed by either a core Traits field or an EXT_DEFAULTS key.
    theta: dict = field(default_factory=dict)
    #: desire baselines (None -> derived)
    desire: dict = field(default_factory=dict)
    #: emotion equilibrium nudges
    x_eq: dict = field(default_factory=dict)
    #: per-desire decision weights w_i(θ)
    weights: dict = field(default_factory=dict)
    #: expression gain g
    g: Optional[float] = None
    #: mode thresholds T
    thresholds: dict = field(default_factory=dict)
    #: safety constraints A
    safety: dict = field(default_factory=dict)
    #: an optional gender/script bias this row implies
    gender: str = ""
    #: clinical-simulation row (abstract; gated)
    clinical: bool = False


def _row(key: str, label: str, family: str, *, theta: dict | None = None,
         desire: dict | None = None, x_eq: dict | None = None,
         weights: dict | None = None, g: Optional[float] = None,
         thresholds: dict | None = None, safety: dict | None = None,
         gender: str = "", clinical: bool = False) -> TypeRow:
    return TypeRow(key=key, label=label, family=family, theta=dict(theta or {}),
                   desire=dict(desire or {}), x_eq=dict(x_eq or {}),
                   weights=dict(weights or {}), g=g,
                   thresholds=dict(thresholds or {}), safety=dict(safety or {}),
                   gender=gender, clinical=clinical)


#: ---- 4.1 attachment / relational family (the spec's first table) ----------
#: Each row is a *θ region*; the ``theta`` dict moves the same variables the
#: research presets move, so the same equations produce the same regimes.
ATTACHMENT_ROWS: tuple[TypeRow, ...] = (
    _row("安全型", "安全型", "attachment",
         theta=dict(A0=.60, X0=.12, V0=.12, Tr0=.85, C=.80, K0=.80, S0=.30,
                    J0=.15, 被弃恐惧=.10, 亲密焦虑=.10, 边界强度=.75, 依赖=.20)),
    _row("焦虑型", "焦虑型", "attachment",
         theta=dict(A0=.70, X0=.80, V0=.20, Tr0=.45, C=.65, K0=.55, S0=.35,
                    J0=.55, 被弃恐惧=.85, 亲密焦虑=.55, 边界强度=.35),
         desire=dict(Ap=.80, Be=.75)),
    _row("回避型", "回避型", "attachment",
         theta=dict(A0=.45, X0=.45, V0=.80, Tr0=.50, C=.50, K0=.65, S0=.60,
                    亲密焦虑=.75, 边界强度=.80, 依赖=.10),
         desire=dict(Be=.30, 亲密=.25), g=0.70),
    _row("恐惧型", "恐惧型", "attachment",
         theta=dict(A0=.55, X0=.75, V0=.75, Tr0=.30, C=.55, K0=.45, S0=.55,
                    被弃恐惧=.80, 亲密焦虑=.80, 情绪波动=.65, 边界强度=.60)),
    _row("混乱型", "混乱型", "attachment",
         theta=dict(A0=.60, X0=.80, V0=.70, Tr0=.30, C=.50, K0=.40, S0=.40,
                    被弃恐惧=.85, 情绪波动=.85, 身份扩散=.60)),
    _row("讨好型", "讨好型", "attachment",
         theta=dict(A0=.70, X0=.60, V0=.25, Tr0=.55, C=.70, K0=.55, S0=.35,
                    边界强度=.20, 依赖=.55, 照顾=.70),
         desire=dict(Ap=.85, Be=.70, Se=.60)),
    _row("拯救者", "拯救者", "attachment",
         theta=dict(A0=.65, X0=.40, V0=.20, Tr0=.60, C=.85, K0=.65, S0=.40,
                    边界强度=.25, 控制=.55, 自我超越=.75, 照顾=.90),
         desire=dict(Ca=.90, 权力=.55, Ap=.55)),
    _row("受害者", "受害者", "attachment",
         theta=dict(A0=.55, X0=.70, V0=.35, Tr0=.45, C=.65, K0=.40, S0=.45,
                    羞耻=.70, 空虚=.55, 边界强度=.30, 依赖=.60),
         desire=dict(Se=.85, Be=.70)),
    _row("迫害者", "迫害者", "attachment",
         theta=dict(A0=.45, X0=.45, V0=.40, Tr0=.35, C=.25, K0=.50, S0=.45,
                    敌意归因=.75, 攻击=.70, 控制=.70),
         desire=dict(权力=.80, Ddom=.80, Ag=.70), safety=dict(can_set_boundary=True)),
    _row("依赖型", "依赖型", "attachment",
         theta=dict(A0=.75, X0=.85, V0=.25, Tr0=.55, C=.60, K0=.55, S0=.30,
                    被弃恐惧=.85, 依赖=.85, 边界强度=.25),
         desire=dict(Be=.90, 亲密=.70)),
    _row("反依赖型", "反依赖型", "attachment",
         theta=dict(A0=.45, X0=.35, V0=.70, Tr0=.50, C=.45, K0=.75, S0=.60,
                    依赖=.05, 边界强度=.90, 求助回避=.60),
         g=0.75),
    _row("共依型", "共依型", "attachment",
         theta=dict(A0=.85, X0=.80, V0=.30, Tr0=.30, C=.45, K0=.30, S0=.30,
                    被弃恐惧=.80, 依赖=.75, 控制=.60, 信任可塑性=.20),
         desire=dict(O=.75, Be=.80, L=.60)),
)

#: ---- 4.2 Big5 / HEXACO combination family --------------------------------
#: The derivation is the spec's: 高外向 = R>0.7, 低宜人 = A<0.3,
#: 高神经质 = N>0.7, 低诚实谦逊 = H<0.3.  `derive_big5()` / `derive_hexaco()`
#: read these back out of any θ row.
BIG5_DIMS = ("o_open", "c_conscientious", "e_extravert", "a_agreeable", "n_neurotic")
HEXACO_DIMS = ("h_honesty", "hex_e", "hex_x", "hex_a", "hex_c", "hex_o")
BIG5_CUT_HIGH, BIG5_CUT_LOW = 0.70, 0.30

#: ---- 4.3 clinical-simulation family (abstract labels only) ---------------
#: These rows exist so an offline study can *compute*; they are marked
#: ``clinical=True``, so :func:`is_deployable` refuses them and the engine never
#: renders their labels.  No concrete method, symptom or intervention is stored.
CLINICAL_ROWS: tuple[TypeRow, ...] = (
    _row("偏执型", "偏执型（仿真）", "clinical",
         theta=dict(Tr0=.25, 敌意归因=.85, 惩罚敏感=.80, 信任可塑性=.20),
         clinical=True),
    _row("分裂样", "分裂样（仿真）", "clinical",
         theta=dict(R=.15, 社交回避=.80, 亲密=.15, e_extravert=.15, 情感抑制=.75),
         desire=dict(Be=.15, 亲密=.10), g=0.45, clinical=True),
    _row("分裂型", "分裂型（仿真）", "clinical",
         theta=dict(现实检验=.35, 解离=.70, 元认知=.30, 情绪波动=.60),
         clinical=True),
    _row("反社会", "反社会（仿真）", "clinical",
         theta=dict(C=.10, K0=.20, 攻击=.85, 内疚=.05, h_honesty=.15,
                    a_agreeable=.15, 精神病态=.80),
         desire=dict(Ag=.85, 权力=.70), safety=dict(can_set_boundary=False),
         clinical=True),
    _row("边缘", "边缘（仿真）", "clinical",
         theta=dict(X0=.85, V0=.80, Tr0=.25, K0=.25, I=.75, 身份扩散=.85,
                    情绪波动=.90, 被弃恐惧=.90, 自伤=.0),
         clinical=True),
    _row("表演", "表演（仿真）", "clinical",
         theta=dict(R=.85, a_agreeable=.75, e_extravert=.90, 自恋=.65),
         desire=dict(Ap=.85, Ex=.70), g=1.40, clinical=True),
    _row("自恋", "自恋（仿真）", "clinical",
         theta=dict(自恋=.90, C=.25, h_honesty=.25, 自我增强=.85, a_agreeable=.20),
         desire=dict(Ap=.85, 权力=.75, Ddom=.65), clinical=True),
    _row("回避（临床）", "回避（临床仿真）", "clinical",
         theta=dict(X0=.75, V0=.80, 羞耻=.70, 社交回避=.80, 边界强度=.65),
         g=0.55, clinical=True),
    _row("依赖（临床）", "依赖（临床仿真）", "clinical",
         theta=dict(Be0=.85, 依赖=.85, 被弃恐惧=.80, 边界强度=.20),
         clinical=True),
    _row("强迫", "强迫（仿真）", "clinical",
         theta=dict(K0=.90, 秩序=.90, 完美主义=.85, 延迟满足=.85),
         desire=dict(秩序=.90), clinical=True),
    _row("抑郁", "抑郁（仿真）", "clinical",
         theta=dict(n_neurotic=.85, 反刍=.85, valence=-0.30, 空虚=.70),
         x_eq=dict(抑郁=.70, joy=.05, 兴奋=.05), g=0.50, clinical=True),
    _row("躁狂", "躁狂（仿真）", "clinical",
         theta=dict(R=.90, I=.85, 活动水平=.90, 节律=.15),
         x_eq=dict(兴奋=.80, 平静=.05), clinical=True),
    _row("双相", "双相（仿真）", "clinical",
         theta=dict(情绪波动=.95, 节律=.20, R=.70),
         clinical=True),
    _row("PTSD", "PTSD（仿真）", "clinical",
         theta=dict(惩罚敏感=.90, 情绪反应性=.85, 现实检验=.60, 反刍=.80),
         clinical=True),
    _row("解离（临床）", "解离（临床仿真）", "clinical",
         theta=dict(解离=.85, 身份扩散=.70, 现实检验=.50),
         x_eq=dict(解离=.70), g=0.40, clinical=True),
    _row("成瘾", "成瘾（仿真）", "clinical",
         theta=dict(奖励敏感=.90, K0=.25, I=.75, 延迟满足=.15),
         clinical=True),
)

#: ---- 4.4 nine-type (Enneagram) family ------------------------------------
#: The spec gives a *criterion* per type, not a number.  Each row below is that
#: criterion translated into the same θ region (秩序高 = 秩序>.7 etc.).
ENNEAGRAM_ROWS: tuple[TypeRow, ...] = (
    _row("1 完美主义", "1 完美主义者", "enneagram",
         theta=dict(秩序=.85, 完美主义=.85, anger=.10, 保守=.70, K0=.80),
         desire=dict(秩序=.85, 自我实现=.60), g=0.85),
    _row("2 助人者", "2 助人者", "enneagram",
         theta=dict(照顾=.90, a_agreeable=.85, 边界强度=.25, 自我超越=.80),
         desire=dict(Ca=.90, Ap=.80, Be=.75)),
    _row("3 成就者", "3 成就者", "enneagram",
         theta=dict(成就=.90, 自我增强=.80, 自恋=.55, 秩序=.65),
         desire=dict(成就=.90, Ap=.85, 权力=.70)),
    _row("4 自我型", "4 自我型", "enneagram",
         theta=dict(o_open=.85, 身份扩散=.55, valence=-0.15, 反刍=.65),
         x_eq=dict(抑郁=.45, 空虚=.45), g=0.95),
    _row("5 观察者", "5 观察者", "enneagram",
         theta=dict(o_open=.80, 情感抑制=.70, e_extravert=.20, K0=.80),
         desire=dict(Ex=.80, 亲密=.20), g=0.55),
    _row("6 忠诚者", "6 忠诚者", "enneagram",
         theta=dict(Se=.85, Tr0=.35, 惩罚敏感=.80, 敌意归因=.55),
         desire=dict(Se=.85, Be=.65)),
    _row("7 享乐者", "7 享乐者", "enneagram",
         theta=dict(o_open=.80, R=.80, 惩罚敏感=.15, 延迟满足=.20),
         desire=dict(游戏=.85, Ex=.80), g=1.25),
    _row("8 挑战者", "8 挑战者", "enneagram",
         theta=dict(权力=.85, Ddom0=.80, 攻击=.60, K0=.65, h_honesty=.40),
         desire=dict(权力=.85, Ddom=.80)),
    _row("9 和平者", "9 和平者", "enneagram",
         theta=dict(a_agreeable=.85, 攻击=.05, 边界强度=.20, 冲突回避=.85),
         desire=dict(秩序=.60, Be=.65), g=0.70),
)

#: ---- 4.5 MBTI mapping -----------------------------------------------------
#: The spec's mapping is a *sign* rule, not a table:
#:   MBTI = (sgn(R-0.5), sgn(O-0.5), sgn(C-0.5), sgn(K-0.5)).
#: ``derive_mbti`` implements exactly that, so all 16 types fall out of θ.
MBTI_LETTERS = {
    "E": "外向", "I": "内向", "S": "实感", "N": "直觉",
    "T": "思考", "F": "情感", "J": "判断", "P": "知觉",
}
MBTI_TYPES = tuple(
    a + b + c + d
    for a in ("I", "E") for b in ("N", "S") for c in ("T", "F") for d in ("J", "P")
)

#: ---- 4.6 DISC -------------------------------------------------------------
DISC_ROWS: tuple[TypeRow, ...] = (
    _row("D 支配", "D 支配型", "disc",
         theta=dict(Ddom0=.85, R=.75, K0=.60, 权力=.75),
         desire=dict(Ddom=.85, 权力=.75)),
    _row("I 影响", "I 影响型", "disc",
         theta=dict(R=.85, a_agreeable=.70), desire=dict(Ap=.80, Ex=.70), g=1.25),
    _row("S 稳健", "S 稳健型", "disc",
         theta=dict(K0=.80, 冲突回避=.80, 保守=.70, 情绪波动=.20), g=0.75),
    _row("C 谨慎", "C 谨慎型", "disc",
         theta=dict(秩序=.85, K0=.85, 延迟满足=.80, h_honesty=.70), g=0.70),
)

#: ---- 4.7 social / narrative roles ----------------------------------------
SOCIAL_ROLE_ROWS: tuple[TypeRow, ...] = (
    _row("领导者", "领导者", "social", theta=dict(权力=.80, Ddom0=.70, 边界强度=.75),
         desire=dict(权力=.80, 成就=.70)),
    _row("追随者", "追随者", "social", theta=dict(依赖=.60, Ddom0=.15),
         desire=dict(Be=.65, Se=.65)),
    _row("照顾者", "照顾者", "social", theta=dict(照顾=.90, a_agreeable=.80),
         desire=dict(Ca=.90)),
    _row("隐士", "隐士", "social", theta=dict(e_extravert=.15, 边界强度=.85, K0=.80),
         desire=dict(Be=.20, 亲密=.20), g=0.60),
    _row("殉道者", "殉道者", "social",
         theta=dict(内疚=.75, C=.85, 边界强度=.15, 自我超越=.85),
         desire=dict(Ca=.85, Ap=.60)),
    _row("叛逆者", "叛逆者", "social",
         theta=dict(o_open=.85, 保守=.10, h_honesty=.35, 攻击=.55),
         desire=dict(Ex=.80, 权力=.60)),
    _row("改革者", "改革者", "social",
         theta=dict(o_open=.85, 自我超越=.75, 成就=.75, 秩序=.55),
         desire=dict(自我实现=.80, 成就=.70)),
    _row("保守者", "保守者", "social",
         theta=dict(保守=.90, o_open=.25, 秩序=.80), desire=dict(秩序=.80, Se=.70)),
    _row("投机者", "投机者", "social",
         theta=dict(马基雅维利=.80, h_honesty=.20, 奖励敏感=.75, K0=.65),
         desire=dict(权力=.70, 成就=.70)),
    _row("调停者", "调停者", "social",
         theta=dict(a_agreeable=.85, 修复=.85, 心理化=.75, 冲突回避=.60),
         desire=dict(秩序=.70, Be=.70)),
    _row("破坏者", "破坏者", "social",
         theta=dict(攻击=.80, C=.20, K0=.35), desire=dict(Ag=.80, 权力=.60)),
    _row("观察者", "观察者", "social",
         theta=dict(e_extravert=.25, 情感抑制=.65, K0=.80),
         desire=dict(Ex=.60, 亲密=.25), g=0.65),
    _row("局外人", "局外人", "social",
         theta=dict(e_extravert=.20, V0=.65, 边缘感=.70, 孤独=.70),
         desire=dict(Be=.35), g=0.60),
)

#: ---- 4.8 motivation / value types ----------------------------------------
MOTIVATION_ROWS: tuple[TypeRow, ...] = (
    _row("成就型", "成就型", "motivation", theta=dict(成就=.90, 权力=.60),
         desire=dict(成就=.90)),
    _row("权力型", "权力型", "motivation", theta=dict(权力=.90, Ddom0=.70),
         desire=dict(权力=.90, Ddom=.75)),
    _row("归属型", "归属型", "motivation", theta=dict(a_agreeable=.80, 亲密=.80),
         desire=dict(Be=.90, 亲密=.80)),
    _row("安全型（动机）", "安全导向型", "motivation", theta=dict(Se=.85, 惩罚敏感=.75),
         desire=dict(Se=.90)),
    _row("探索型", "探索型", "motivation", theta=dict(o_open=.90, 好奇=.90),
         desire=dict(Ex=.90, 游戏=.70)),
    _row("秩序型", "秩序型", "motivation", theta=dict(秩序=.90, 保守=.75),
         desire=dict(秩序=.90)),
    _row("审美型", "审美型", "motivation", theta=dict(审美=.90, o_open=.85),
         desire=dict(审美=.90, 自我实现=.70), g=1.15),
    _row("利他型", "利他型", "motivation", theta=dict(自我超越=.90, 照顾=.85),
         desire=dict(Ca=.90, Be=.70)),
    _row("利己型", "利己型", "motivation", theta=dict(自我增强=.85, h_honesty=.30),
         desire=dict(成就=.80, 权力=.70)),
    _row("享乐型", "享乐型", "motivation", theta=dict(惩罚敏感=.20, 延迟满足=.25),
         desire=dict(游戏=.90, L=.75), g=1.20),
    _row("自我实现型", "自我实现型", "motivation",
         theta=dict(自我实现=.90, o_open=.80, 心理化=.75),
         desire=dict(自我实现=.90, 成就=.75)),
)

#: ---- 4.9 cognitive styles ------------------------------------------------
COGNITIVE_ROWS: tuple[TypeRow, ...] = (
    _row("分析型", "分析型", "cognitive", theta=dict(元认知=.85, 系统化=.85, K0=.80),
         g=0.75),
    _row("直觉型", "直觉型", "cognitive", theta=dict(o_open=.80, 系统化=.35)),
    _row("系统型", "系统型", "cognitive", theta=dict(系统化=.90, 秩序=.80)),
    _row("发散型", "发散型", "cognitive", theta=dict(o_open=.90, 好奇=.85)),
    _row("聚合型", "聚合型", "cognitive", theta=dict(秩序=.80, 系统化=.75)),
    _row("场依存", "场依存型", "cognitive", theta=dict(依赖=.70, a_agreeable=.70)),
    _row("场独立", "场独立型", "cognitive", theta=dict(边界强度=.85, 依赖=.10)),
    _row("冲动型", "冲动型", "cognitive", theta=dict(I=.85, 延迟满足=.20, K0=.35)),
    _row("反思型", "反思型", "cognitive", theta=dict(元认知=.85, 延迟满足=.80, I=.15)),
    _row("反刍型", "反刍型", "cognitive", theta=dict(反刍=.90, n_neurotic=.75)),
    _row("灾难化型", "灾难化型", "cognitive", theta=dict(灾难化=.90, 惩罚敏感=.85)),
    _row("乐观型", "乐观型", "cognitive", theta=dict(valence=.70, 奖励敏感=.75),
         x_eq=dict(joy=.70)),
    _row("悲观型", "悲观型", "cognitive", theta=dict(valence=-0.45, 惩罚敏感=.75),
         x_eq=dict(抑郁=.50)),
)

#: ---- 4.10 ACG / web-fiction archetypes (the spec's 50+) ------------------
#: The 18 research archetypes are re-exported as rows too, so the whole library
#: is uniform.  ``gender_script`` marks which G preset the archetype reads as.
ACG_ROWS: tuple[TypeRow, ...] = (
    # -- female-read / neutral ACG (extending the original 18) -----------
    _row("御姐", "御姐", "acg", theta=dict(K0=.85, 照顾=.70, R=.45, 秩序=.65),
         desire=dict(Ca=.75, 权力=.55), gender="女性脚本"),
    _row("病弱", "病弱", "acg", theta=dict(活动水平=.20, 安全=.80, 依赖=.50, R=.25),
         desire=dict(Se=.80, Ca=.60), gender="女性脚本"),
    _row("中二", "中二", "acg",
         theta=dict(现实检验=.55, 自恋=.65, 自我增强=.75, R=.70),
         g=1.35),
    _row("无口", "无口", "acg", theta=dict(情感抑制=.85, e_extravert=.20, 亲密=.25),
         g=0.35),
    _row("毒舌", "毒舌", "acg",
         theta=dict(攻击=.55, S0=.20, 玩笑=.70, a_agreeable=.45),
         desire=dict(游戏=.70, Ap=.50), g=1.15),
    _row("弱气", "弱气", "acg",
         theta=dict(X0=.70, V0=.65, 自信=.25, 边界强度=.30), g=0.55),
    _row("强气", "强气", "acg", theta=dict(R=.80, Ddom0=.70, 自信=.85),
         desire=dict(权力=.70, Ddom=.70)),
    _row("黑化", "黑化", "acg",
         theta=dict(valence=-0.55, 攻击=.75, Tr0=.25, C=.30, 精神病态=.45),
         desire=dict(Ag=.75, O=.70)),
    _row("暴走", "暴走", "acg", theta=dict(K0=.20, I=.85, 攻击=.80, 情绪波动=.70),
         desire=dict(Ag=.80)),
    _row("地雷系", "地雷系", "acg",
         theta=dict(X0=.80, S0=.70, 情绪波动=.80, 被弃恐惧=.75),
         desire=dict(O=.75, Be=.70), g=0.75),
    _row("阳角", "阳角", "acg",
         theta=dict(R=.85, Be=.80, valence=.45, e_extravert=.85),
         desire=dict(Be=.80, 游戏=.70), g=1.25),
    _row("阴角", "阴角", "acg",
         theta=dict(R=.25, X0=.70, 孤独=.75, e_extravert=.20), g=0.55),
    _row("社恐", "社恐", "acg",
         theta=dict(X0=.80, V0=.75, 社交回避=.85, 边界强度=.55), g=0.50),
    _row("社牛", "社牛", "acg",
         theta=dict(R=.90, 社交接近=.85, e_extravert=.90), g=1.25),
    _row("纯爱", "纯爱", "acg",
         theta=dict(亲密=.90, 攻击=.05, O=.40, a_agreeable=.80),
         desire=dict(亲密=.90, Be=.80)),
    _row("修罗场", "修罗场", "acg",
         theta=dict(jeal=.85, O=.80, 攻击=.50, 情绪波动=.70),
         desire=dict(O=.80, 亲密=.75)),
    # -- male-read archetypes (the spec's 男性类型库) ----------------------
    _row("安全男", "安全男", "male_acg",
         theta=dict(X0=.15, V0=.15, Tr0=.85, K0=.80, C=.80),
         gender="低传统男性"),
    _row("焦虑男", "焦虑男", "male_acg",
         theta=dict(X0=.80, V0=.20, Tr0=.40, 被弃恐惧=.85), gender="男性脚本"),
    _row("回避男", "回避男", "male_acg",
         theta=dict(X0=.45, V0=.80, Tr0=.45, 亲密焦虑=.75, 求助回避=.70),
         gender="高传统男性"),
    _row("恐惧男", "恐惧男", "male_acg",
         theta=dict(X0=.75, V0=.75, Tr0=.30, 情绪波动=.60), gender="男性脚本"),
    _row("混乱男", "混乱男", "male_acg",
         theta=dict(X0=.80, V0=.70, Tr0=.30, 情绪波动=.85), gender="男性脚本"),
    _row("讨好男", "讨好男", "male_acg",
         theta=dict(Ap=.85, 边界强度=.20, 冲突回避=.80), gender="低传统男性"),
    _row("拯救者男", "拯救者男", "male_acg",
         theta=dict(照顾=.90, 控制=.60, 自我超越=.80, 边界强度=.25),
         gender="男性脚本"),
    _row("控制男", "控制男", "male_acg",
         theta=dict(Ddom0=.80, O=.75, K0=.45, Tr0=.35, 控制=.80),
         desire=dict(权力=.80, O=.80), gender="高传统男性",
         safety=dict(can_set_boundary=False)),
    _row("反依赖男", "反依赖男", "male_acg",
         theta=dict(V0=.80, 边界强度=.90, 求助回避=.80, 依赖=.05),
         gender="高传统男性", g=0.65),
    _row("共依男", "共依男", "male_acg",
         theta=dict(O=.80, X0=.75, K0=.30, Tr0=.25, 依赖=.70), gender="男性脚本"),
    _row("依赖男", "依赖男", "male_acg",
         theta=dict(Be=.85, 依赖=.85, 被弃恐惧=.80, 边界强度=.20),
         gender="低传统男性"),
    _row("霸总", "霸总", "male_acg",
         theta=dict(Ddom0=.90, O=.80, K0=.70, C=.25, Tr0=.35, 边界强度=.25,
                    Ap=.80, 秩序=.75),
         desire=dict(权力=.85, Ddom=.85, O=.80), gender="高传统男性",
         safety=dict(can_set_boundary=False)),
    _row("暖男", "暖男", "male_acg",
         theta=dict(C=.90, A0=.75, O=.40, K0=.80, S0=.20, Tr0=.85),
         gender="低传统男性"),
    _row("忠犬男", "忠犬男", "male_acg",
         theta=dict(A0=.90, Tr0=.90, O=.50, K0=.65, Be=.80),
         gender="低传统男性", safety=dict(can_set_boundary=False)),
    _row("狼狗", "狼狗", "male_acg",
         theta=dict(O=.70, 攻击=.60, S0=.70, K0=.60),
         desire=dict(O=.70, Ag=.55), gender="高传统男性", g=0.70),
    _row("奶狗", "奶狗", "male_acg",
         theta=dict(X0=.50, Be=.85, 攻击=.10, C=.85, O=.25),
         gender="低传统男性", g=1.15),
    _row("爹系", "爹系", "male_acg",
         theta=dict(C=.85, Ddom0=.65, 秩序=.80, K0=.80, 控制=.60),
         gender="高传统男性"),
    _row("少年", "少年", "male_acg",
         theta=dict(R=.85, Ex=.80, K0=.45, I=.50, valence=.45),
         gender="男性脚本"),
    _row("大叔", "大叔", "male_acg",
         theta=dict(K0=.85, R=.30, C=.60, 秩序=.75, S0=.55),
         gender="高传统男性", g=0.75),
    _row("硬汉", "硬汉", "male_acg",
         theta=dict(S0=.85, EM=.85, 求助回避=.85, 攻击=.50, C=.25, K0=.60),
         gender="高传统男性", g=0.50),
    _row("草食男", "草食男", "male_acg",
         theta=dict(L=.20, 攻击=.15, R=.30, V0=.70, 亲密焦虑=.65),
         desire=dict(亲密=.25), gender="低传统男性"),
    _row("肉食男", "肉食男", "male_acg",
         theta=dict(L=.85, Ddom0=.70, Ex=.80, 攻击=.50, 承诺=.25),
         desire=dict(权力=.70, 游戏=.75), gender="高传统男性"),
    _row("海王", "海王", "male_acg",
         theta=dict(Ex=.85, L=.80, 承诺=.20, C=.25, Tr0=.30, K0=.60, SC=.85),
         desire=dict(游戏=.85, 权力=.70), gender="高传统男性"),
    _row("渣男", "渣男", "male_acg",
         theta=dict(C=.20, Tr0=.25, 承诺=.15, Ap=.80, K0=.30, 边界强度=.20),
         gender="高传统男性"),
    _row("直男", "直男", "male_acg",
         theta=dict(C=.45, S0=.55, EM=.55, 字面理解=.85),
         gender="高传统男性", g=0.65),
    _row("凤凰男", "凤凰男", "male_acg",
         theta=dict(成就=.85, 成功压力=.85, 自卑=.55, 边界强度=.30),
         gender="高传统男性"),
    _row("妈宝男", "妈宝男", "male_acg",
         theta=dict(依赖=.85, 决策困难=.85, Be=.80, 边界强度=.20, X0=.50),
         gender="低传统男性"),
    _row("巨婴", "巨婴", "male_acg",
         theta=dict(K0=.20, I=.75, 依赖=.80, 责任=.20), gender="男性脚本"),
    _row("软饭男", "软饭男", "male_acg",
         theta=dict(成就=.20, 依赖=.80, Ap=.80, K0=.30), gender="男性脚本"),
    _row("接盘侠", "接盘侠", "male_acg",
         theta=dict(A0=.80, Tr0=.80, 边界强度=.20, 自卑=.55, O=.15),
         gender="低传统男性"),
    _row("备胎", "备胎", "male_acg",
         theta=dict(A0=.80, Ap=.80, 边界强度=.20, Tr0=.40, X0=.70),
         gender="男性脚本"),
    _row("舔狗", "舔狗", "male_acg",
         theta=dict(A0=.85, Ap=.90, 边界强度=.10, 自我价值=.15, X0=.75, Tr0=.40),
         gender="男性脚本"),
    _row("工具人", "工具人", "male_acg",
         theta=dict(C=.80, 边界强度=.15, Ap=.50, 自我价值=.20),
         gender="男性脚本"),
    _row("老实人", "老实人", "male_acg",
         theta=dict(K0=.80, C=.60, S0=.55, 攻击=.10, 边界强度=.55),
         gender="高传统男性", g=0.70),
    _row("老好人", "老好人", "male_acg",
         theta=dict(C=.85, A0=.75, 冲突回避=.85, 边界强度=.25),
         gender="低传统男性"),
    _row("暴君", "暴君", "male_acg",
         theta=dict(Ddom0=.95, 攻击=.85, C=.15, K0=.30, O=.85),
         desire=dict(权力=.90, Ag=.75), gender="高传统男性",
         safety=dict(can_set_boundary=False)),
    _row("帝王", "帝王", "male_acg",
         theta=dict(Ddom0=.90, K0=.85, C=.35, O=.55, Tr0=.50),
         desire=dict(权力=.90, 秩序=.75), gender="高传统男性"),
    _row("将军", "将军", "male_acg",
         theta=dict(Ddom0=.85, K0=.85, 攻击=.55, C=.50, 秩序=.85),
         gender="高传统男性"),
    _row("谋士", "谋士", "male_acg",
         theta=dict(K0=.85, 元认知=.90, C=.55, Ddom0=.30, Ex=.80),
         gender="中性", g=0.80),
    _row("骑士", "骑士", "male_acg",
         theta=dict(C=.85, Tr0=.85, 攻击=.50, 忠诚=.90, 边界强度=.60),
         gender="高传统男性"),
    _row("浪子", "浪子", "male_acg",
         theta=dict(Ex=.85, L=.80, 承诺=.20, K0=.60, Tr0=.35),
         gender="高传统男性"),
    _row("侠客", "侠客", "male_acg",
         theta=dict(攻击=.55, C=.55, 边界强度=.85, Tr0=.60, 正义=.85),
         gender="男性脚本"),
    _row("反派", "反派", "male_acg",
         theta=dict(C=.20, 攻击=.80, Ddom0=.80, K0=.80, Tr0=.30,
                    h_honesty=.20, 马基雅维利=.75),
         gender="男性脚本"),
    _row("病娇男", "病娇男", "male_acg",
         theta=dict(O=.85, X0=.85, K0=.30, Tr0=.20, L=.55, 攻击=.50, J0=.80),
         gender="男性脚本", safety=dict(can_set_boundary=False)),
    _row("傲娇男", "傲娇男", "male_acg",
         theta=dict(A0=.80, S0=.80, 表达增益=.35, expr_delay=8),
         gender="男性脚本"),
    _row("腹黑男", "腹黑男", "male_acg",
         theta=dict(Ap=.60, Ddom0=.70, C=.30, 情感抑制=.55),
         gender="男性脚本", g=0.90),
    _row("中二男", "中二男", "male_acg",
         theta=dict(自恋=.70, 现实检验=.55, Ex=.80, 自我增强=.80),
         gender="男性脚本", g=1.30),
    _row("宅男", "宅男", "male_acg",
         theta=dict(R=.25, Ex=.50, 社交=.20, Be=.25, K0=.60),
         gender="男性脚本", g=0.60),
    _row("社恐男", "社恐男", "male_acg",
         theta=dict(X0=.80, V0=.75, 社交回避=.85), gender="男性脚本", g=0.50),
    _row("社牛男", "社牛男", "male_acg",
         theta=dict(R=.90, 社交接近=.85), gender="男性脚本", g=1.25),
    _row("忧郁男", "忧郁男", "male_acg",
         theta=dict(valence=-0.40, n_neurotic=.80, R=.30, C=.55),
         gender="男性脚本", g=0.55),
    _row("艺术男", "艺术男", "male_acg",
         theta=dict(o_open=.90, Ex=.75, 情感表达=.75, K0=.50),
         gender="中性", g=1.20),
    _row("理工男", "理工男", "male_acg",
         theta=dict(系统化=.90, K0=.85, C=.45, S0=.55),
         gender="男性脚本", g=0.60),
    _row("体育男", "体育男", "male_acg",
         theta=dict(R=.85, 攻击=.50, Ddom0=.60, K0=.60, 活动水平=.85),
         gender="高传统男性"),
    _row("金融男", "金融男", "male_acg",
         theta=dict(成就=.85, Ap=.75, Ddom0=.70, K0=.65, C=.40),
         gender="高传统男性"),
    _row("文艺男", "文艺男", "male_acg",
         theta=dict(o_open=.85, C=.80, Ex=.75, 情感表达=.75), g=1.15),
    _row("禁欲系", "禁欲系", "male_acg",
         theta=dict(S0=.90, L=.15, K0=.90, O=.15), g=0.40),
    _row("清冷男", "清冷男", "male_acg",
         theta=dict(R=.25, S0=.85, C=.55), g=0.45),
    _row("疯批男", "疯批男", "male_acg",
         theta=dict(K0=.15, I=.90, 攻击=.85, valence=-0.50, O=.80),
         gender="男性脚本", safety=dict(can_set_boundary=False)),
    _row("病弱男", "病弱男", "male_acg",
         theta=dict(活动水平=.20, 安全=.85, C=.55, 依赖=.55), gender="男性脚本"),
    _row("黑化男", "黑化男", "male_acg",
         theta=dict(valence=-0.60, 攻击=.80, Tr0=.20, C=.20, O=.80),
         gender="男性脚本"),
    _row("龙傲天", "龙傲天", "male_acg",
         theta=dict(Ddom0=.95, K0=.85, 攻击=.80, C=.20, 自恋=.90),
         gender="男性脚本"),
    _row("废柴", "废柴", "male_acg",
         theta=dict(K0=.25, 成就=.20, I=.70, 依赖=.55), gender="男性脚本"),
    _row("逆袭男", "逆袭男", "male_acg",
         theta=dict(成就=.90, K0=.85, Ex=.80, Ap=.75), gender="男性脚本"),
    _row("救世主", "救世主", "male_acg",
         theta=dict(C=.90, 责任=.90, 自我超越=.85, 边界强度=.20),
         gender="男性脚本"),
    _row("殉道者男", "殉道者男", "male_acg",
         theta=dict(内疚=.85, C=.85, 边界强度=.15, 自我超越=.80),
         gender="男性脚本"),
    _row("破坏者男", "破坏者男", "male_acg",
         theta=dict(攻击=.85, C=.15, K0=.30, O=.55), gender="男性脚本"),
    _row("观察者男", "观察者男", "male_acg",
         theta=dict(R=.25, Ex=.55, C=.55, S0=.80, K0=.85),
         gender="男性脚本", g=0.65),
    _row("三无男", "三无男", "male_acg",
         theta=dict(表达增益=.30, S0=.85, R=.20), gender="男性脚本", g=0.30),
    _row("天然呆男", "天然呆男", "male_acg",
         theta=dict(威胁增益=.45, 噪声=.85, valence=.40), gender="男性脚本",
         g=1.10),
    _row("小恶魔男", "小恶魔男", "male_acg",
         theta=dict(Ex=.85, 玩笑=.80, R=.80), gender="男性脚本", g=1.20),
    _row("元气男", "元气男", "male_acg",
         theta=dict(R=.90, valence=.45), gender="男性脚本", g=1.30),
    _row("高冷男", "高冷男", "male_acg",
         theta=dict(R=.20, S0=.85, C=.55), gender="男性脚本", g=0.45),
    _row("纯爱男", "纯爱男", "male_acg",
         theta=dict(亲密=.90, 攻击=.05, O=.40), gender="低传统男性"),
    _row("修罗场男", "修罗场男", "male_acg",
         theta=dict(jeal=.85, O=.85, 攻击=.55), gender="男性脚本"),
    _row("弱气男", "弱气男", "male_acg",
         theta=dict(X0=.70, V0=.70, 自信=.25), gender="男性脚本", g=0.55),
    _row("强气男", "强气男", "male_acg",
         theta=dict(R=.85, Ddom0=.75, 自信=.85), gender="高传统男性"),
)

# ---------------------------------------------------------------------------
# 5. The unified type registry + derivation functions
# ---------------------------------------------------------------------------
#: Every row above, keyed.  This is the "150+" library.
TYPE_ROWS: dict[str, TypeRow] = {}
for _rows in (ATTACHMENT_ROWS, CLINICAL_ROWS, ENNEAGRAM_ROWS, DISC_ROWS,
              SOCIAL_ROLE_ROWS, MOTIVATION_ROWS, COGNITIVE_ROWS, ACG_ROWS):
    for _r in _rows:
        TYPE_ROWS.setdefault(_r.key, _r)

#: The 18 research presets are re-exposed as rows so the registry is uniform.
for _k, _t in TYPES.items():
    if _k not in TYPE_ROWS:
        TYPE_ROWS[_k] = _row(_k, _k, "acg_research")

#: How many type regions the library covers.
TYPE_COUNT = len(TYPE_ROWS)
#: Only these rows may ever be deployed (the clinical rows are sim-only).
DEPLOYABLE_KEYS = tuple(k for k, r in TYPE_ROWS.items() if not r.clinical)
CLINICAL_TYPE_KEYS = tuple(k for k, r in TYPE_ROWS.items() if r.clinical)


def is_deployable(type_key: str) -> bool:
    """False for clinical-simulation rows: they must never reach generation."""
    row = TYPE_ROWS.get(type_key)
    return bool(row is not None and not row.clinical)


def families() -> dict[str, tuple[str, ...]]:
    """The library grouped by family (attachment / big5 / clinical / ...)."""
    out: dict[str, list[str]] = {}
    for k, r in TYPE_ROWS.items():
        out.setdefault(r.family, []).append(k)
    return {k: tuple(v) for k, v in out.items()}


def _norm_extra(theta: dict) -> dict:
    """Fold a row's θ overrides into a flat extension dict (defaults + row)."""
    ext = dict(EXT_DEFAULTS)
    for k, v in (theta or {}).items():
        ext[k] = float(v)
    return ext


def _fill_big5_from_core(ext: dict, t) -> None:
    """Fill Big5 / HEXACO from the core research fields when a row omits them.

    The core parameters already *are* Big5-ish (``R`` extraversion, ``C``
    agreeableness, ``N`` stability, ``I`` impulsivity, ``o_open`` openness), so
    a row that only names core fields still yields a coherent Big5 read-out.
    A row that names a Big5 key explicitly always wins.
    """
    supplied = getattr(t, "_supplied_ext", set())
    e_extra = _clip01(0.15 + 0.80 * float(getattr(t, "R", 0.5)))
    a_agree = _clip01(float(getattr(t, "C", 0.5)))
    c_cons = _clip01(0.15 + 0.85 * float(getattr(t, "K0", 0.5)))
    derived = {
        "e_extravert": e_extra,
        "n_neurotic": _clip01(1.0 - float(getattr(t, "N", 0.5))),
        "a_agreeable": a_agree,
        "c_conscientious": c_cons,
        "o_open": ext.get("o_open", 0.50),
        "hex_e": ext.get("hex_e", ext.get("情绪反应性", 0.45)),
        "hex_x": ext.get("hex_x", e_extra),
        "hex_a": ext.get("hex_a", a_agree),
        "hex_c": ext.get("hex_c", c_cons),
        "hex_o": ext.get("hex_o", ext.get("o_open", 0.50)),
        "h_honesty": ext.get("h_honesty", 0.60),
    }
    for k, v in derived.items():
        if k not in supplied:
            ext[k] = v



#: ---- derivations (the spec's judgement rules) ---------------------------
def derive_big5(traits) -> dict:
    """The Big5 coordinates of a θ region (0..1 each)."""
    ext = getattr(traits, "ext", {}) or {}
    return {d: float(ext.get(d, EXT_DEFAULTS.get(d, 0.5))) for d in BIG5_DIMS}


def big5_labels(traits) -> list[str]:
    """Human labels for whichever Big5 poles this region sits on."""
    b = derive_big5(traits)
    out = []
    if b["e_extravert"] > BIG5_CUT_HIGH:
        out.append("高外向")
    elif b["e_extravert"] < BIG5_CUT_LOW:
        out.append("低外向")
    if b["a_agreeable"] < BIG5_CUT_LOW:
        out.append("低宜人")
    elif b["a_agreeable"] > BIG5_CUT_HIGH:
        out.append("高宜人")
    if b["c_conscientious"] > BIG5_CUT_HIGH:
        out.append("高尽责")
    elif b["c_conscientious"] < BIG5_CUT_LOW:
        out.append("低尽责")
    if b["n_neurotic"] > BIG5_CUT_HIGH:
        out.append("高神经质")
    elif b["n_neurotic"] < BIG5_CUT_LOW:
        out.append("低神经质")
    if b["o_open"] > BIG5_CUT_HIGH:
        out.append("高开放")
    elif b["o_open"] < BIG5_CUT_LOW:
        out.append("低开放")
    return out


def derive_hexaco(traits) -> dict:
    ext = getattr(traits, "ext", {}) or {}
    return {d: float(ext.get(d, EXT_DEFAULTS.get(d, 0.5))) for d in HEXACO_DIMS}


def hexaco_labels(traits) -> list[str]:
    h = derive_hexaco(traits)
    if h["h_honesty"] > BIG5_CUT_HIGH:
        return ["高诚实谦逊"]
    if h["h_honesty"] < BIG5_CUT_LOW:
        return ["低诚实谦逊"]
    return []


def derive_mbti(traits) -> str:
    """``MBTI = (sgn(R-0.5), sgn(O-0.5), sgn(C-0.5), sgn(K-0.5))`` verbatim."""
    ext = getattr(traits, "ext", {}) or {}
    r = float(getattr(traits, "R", 0.5))
    o = float(ext.get("o_open", getattr(traits, "O0", 0.5)))
    c = float(getattr(traits, "C", 0.5))
    k = float(getattr(traits, "K0", 0.5))
    letters = ("E" if r >= 0.5 else "I", "N" if o >= 0.5 else "S",
               "F" if c >= 0.5 else "T", "J" if k >= 0.5 else "P")
    return "".join(letters)


def derive_disc(traits) -> str:
    """The nearest DISC quadrant by the spec's four parameters."""
    ext = getattr(traits, "ext", {}) or {}
    dom = float(getattr(traits, "Ddom0", 0.5))
    r = float(getattr(traits, "R", 0.5))
    k = float(getattr(traits, "K0", 0.5))
    order = float(ext.get("秩序", 0.45))
    cands = {"D 支配": dom + r, "I 影响": r + (1.0 - k),
             "S 稳健": k + (1.0 - dom), "C 谨慎": order + k}
    return max(cands, key=cands.get)


def type_probabilities(theta_like, top: int = 8) -> list[tuple[str, float]]:
    """``P(M_k|θ,D,x) = σ(Σ_j w_{k,j} φ_j - b_k)`` over the library.

    ``w`` is a per-type distance kernel in the *normalised* θ space: closer
    regions score higher.  This is a soft read-out for study; it never gates
    generation.  ``theta_like`` is any object with ``.ext`` plus the core
    research fields (a :class:`Traits` instance).
    """
    ext = _norm_extra(getattr(theta_like, "ext", {}) or {})
    core = {k: float(getattr(theta_like, k, 0.5)) for k in
            ("A0", "X0", "V0", "Tr0", "C", "K0", "S0", "N", "R", "I",
             "J0", "Ddom0", "O0", "L0")}
    scores: list[tuple[str, float]] = []
    for key, row in TYPE_ROWS.items():
        if row.clinical:
            continue
        # distance over the extension dims the row actually names
        diffs = []
        for k, v in row.theta.items():
            if k in ext:
                diffs.append((ext[k] - float(v)) ** 2)
            elif k in core:
                diffs.append((core[k] - float(v)) ** 2)
        if not diffs:
            continue
        dist = math.sqrt(sum(diffs) / len(diffs))
        scores.append((key, 1.0 / (1.0 + dist)))
    scores.sort(key=lambda kv: kv[1], reverse=True)
    if not scores:
        return []
    top_scores = scores[:top]
    total = sum(s for _, s in top_scores) or 1.0
    return [(k, round(s / total, 4)) for k, s in top_scores]


# ---------------------------------------------------------------------------
# 6. ExtendedTraits: fold a data row over the core research Traits
# ---------------------------------------------------------------------------
#: Which row θ keys are *also* core :class:`Traits` fields (they overwrite) vs
#: which are pure extension keys (they land in ``.ext``).
_CORE_THETA = frozenset((
    "A0", "X0", "V0", "Tr0", "C", "K0", "S0", "N", "R", "I", "J0",
    "Ddom0", "O0", "L0", "Ap0", "Be0", "Ex0", "Ag0", "Ca0", "Se0",
    # archetype knobs
    "expr_gain", "threat_gain", "trust_dist_gain", "noise_gain", "s_lambda",
    "mu_s", "o_threat", "valence_bias", "intimacy_anx_gain",
    "can_set_boundary", "expr_delay",
    # tolerances for the row vocabulary
    "expr_delay", "承诺", "自我价值", "自卑", "自信", "忠诚", "正义",
    "责任", "社交", "社交回避", "社交接近", "字面理解", "系统化", "保护",
    "决策困难", "冲突回避", "玩笑", "情感表达", "情感抑制", "边缘感",
    "成功压力", "节律",
))

#: Row keys that are *only* meaningful as extension coefficients; the rest of
#: the row vocabulary maps onto the core knobs via these aliases.
_ALIASES: dict[str, str] = {
    "表达增益": "expr_gain", "威胁增益": "threat_gain", "噪声": "noise_gain",
    "抑制": "S0", "延迟": "expr_delay", "效价": "valence_bias",
    "亲密焦虑": "intimacy_anx_gain",
}


def extended_traits(base: "Traits", row: TypeRow,
                    gender: Optional[GenderScript] = None) -> "Traits":
    """Return a *copy* of ``base`` with the row's θ region folded in.

    The copy is the same :class:`Traits` class, so every existing equation keeps
    working; the extra θ parameters ride along in a new ``ext`` dict plus the
    derived desire / x / weight / threshold overlays.
    """
    import copy as _copy
    t = _copy.deepcopy(base)
    if row.label:
        t.label = row.label
    if row.key:
        t.slug = row.key
    ext = _norm_extra({})
    supplied: set = set()
    _INT_FIELDS = frozenset(("expr_delay",))
    for k, v in row.theta.items():
        key = _ALIASES.get(k, k)
        if key in _CORE_THETA and hasattr(t, key):
            cur = getattr(t, key)
            if key in _INT_FIELDS:
                try:
                    setattr(t, key, int(v))
                except (TypeError, ValueError):
                    pass
            elif isinstance(cur, bool) or isinstance(v, bool):
                setattr(t, key, bool(v))
            else:
                try:
                    setattr(t, key, float(v))
                except (TypeError, ValueError):
                    pass
        else:
            ext[k] = float(v)
            supplied.add(k)
    t._supplied_ext = supplied
    # Big5 / HEXACO read-out: an explicit row value wins, otherwise derive it
    # from the core research fields so every region has a coherent profile.
    _fill_big5_from_core(ext, t)
    t.ext = ext
    if row.g is not None:
        t.expr_gain = float(row.g)
    # the row's own family tag, for read-out only
    t.row_family = row.family
    t.clinical = bool(row.clinical)
    # desire / x / weights / thresholds overlays travel with the traits object
    t.desire_overlay = dict(row.desire)
    t.x_eq_overlay = dict(row.x_eq)
    t.weights = dict(row.weights)
    t.threshold_overlay = dict(row.thresholds)
    t.safety_overlay = dict(row.safety)
    t.gender = gender
    return t
