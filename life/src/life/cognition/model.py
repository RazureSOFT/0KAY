"""Multi-system computational model of habit, cognitive control and memory.

Faithful implementation of the reference model:

* four learnable subsystems - habit ``H`` (stimulus-response table), model-free
  value ``Q_mf`` (TD(0)), model-based planning ``Q_mb`` (finite-depth lookahead)
  and episodic memory ``Engram``;
* a capacity-limited working memory ``WM``;
* an expected-value-of-control (EVC) arbiter that selects one of four control
  modes (``AUTO`` / ``WM`` / ``PLAN`` / ``FULL``);
* z-score fusion of the enabled subsystems followed by a softmax;
* TD learning, selective episodic encoding, prioritized sleep replay and
  mismatch-thresholded reconsolidation.

The single most important design decision is that **reward is bound to the
outcome, not to the action**: ``r(s, a, s') = V_o(o(s'))``.  Devaluation then
only has to change one entry of ``V_o`` and the model revalues immediately
without any new experience, while habit stays blind to it.
"""
from __future__ import annotations

import json
import math
import random
import threading
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime
from functools import lru_cache
from pathlib import Path
from typing import Callable

from ..logging_setup import get_logger

logger = get_logger("cognition.model")

from .circuits import (
    CerebellarPredictor,
    CogLinksArbiter,
    DistributedEvidence,
    Flexibility,
    GlobalWorkspace,
    GroupCoupling,
    Metacognition,
    OFCValueMap,
    Prospection,
    SelfModel,
)

EPS = 1e-9

# Control modes and the subsystems each one enables (paper, table 4).
# "P" is the prospection signal (paper 4); it joins the planning modes but adds
# no *benefit* of its own (gain 0), so the original mode economics are intact.
MODE_MODULES: dict[str, tuple[str, ...]] = {
    "AUTO": ("H", "MF"),
    "WM": ("H", "MF", "WM"),
    "PLAN": ("H", "MF", "MB", "P"),
    "FULL": ("H", "MF", "MB", "WM", "E", "P"),
}
MODE_ORDER: tuple[str, ...] = ("AUTO", "WM", "PLAN", "FULL")


@dataclass
class CognitionConfig:
    """Hyper-parameters (paper, table 7).  Relative order matters more than the
    absolute values: ``alpha_sleep < alpha_habit < alpha_mf`` encodes
    "sleep consolidates slowest, habit next, model-free value fastest"."""

    gamma: float = 0.9
    alpha_habit: float = 0.08
    alpha_mf: float = 0.2
    alpha_sleep: float = 0.05
    plan_depth: int = 2
    wm_capacity: int = 5
    tau: float = 0.4
    theta_pe: float = 0.25
    theta_n: float = 0.35
    c_f: float = 0.35
    c_l: float = 0.25
    c_ops: float = 0.01
    alpha0: float = 0.1              # Laplace smoothing for the transition model
    reliability_divisor: float = 5.0  # observations per (s, a) for full trust
    replay_pe_exp: float = 0.8
    replay_novelty_exp: float = 0.4
    replay_lambda: float = 0.01      # engram retrieval time decay
    mismatch_medium: float = 0.6
    mismatch_severe: float = 1.4
    outcome_lr: float = 0.25         # learning rate for V_o on observed states
    max_engrams: int = 2000          # bound the episodic store
    weights: dict = field(default_factory=lambda: {"H": 0.6, "MF": 0.8, "MB": 1.6, "WM": 0.5, "E": 0.5, "P": 0.7})
    gains: dict = field(default_factory=lambda: {"H": 0.0, "MF": 0.0, "MB": 1.5, "WM": 0.6, "E": 0.9, "P": 0.0})
    base_cost: dict = field(default_factory=lambda: {"AUTO": 0.05, "WM": 0.15, "PLAN": 0.28, "FULL": 0.50})
    # --- circuits from the follow-up papers (all on by default) ---
    use_cerebellum: bool = True      # paper 5: cerebellar prediction-error coding
    use_thalamic_gate: bool = True   # paper 1: MD arbitrates MF vs MB
    use_ofc_map: bool = True         # paper 3: OFC cognitive map / generalisation
    use_prospection: bool = True     # paper 4: abstract future reward
    flexibility: float = 0.6         # paper 14: set-shifting, higher = cheaper to switch
    limbic_bias: float = 2.0         # paper 12: limbic -> cortical outweighs the reverse
    use_limbic_bias: bool = True     # paper 12
    prospection_horizon: int = 4
    # Conflict and disagreement are each normalised entropies, so on a cold or
    # maximally-uncertain state their plain sum already saturates at 1 and any
    # external demand (pragmatics, paper 8) would be invisible.  Scaling the
    # internal terms below 1 leaves headroom for `extra_need` without changing
    # the ordering of the four modes.
    need_scale: float = 0.7
    # Nader & Hardt 2009: a consolidated trace is only writable inside the window
    # a retrieval opened.  Exposed so the durable store can read it live.
    use_lability_window: bool = True
    lability_window_seconds: float = 21600.0
    # --- CLS: complementary learning systems (McClelland 1995, Kumaran 2016) ---
    # McClelland's headline claim is not "replay exists", it is that the
    # neocortex only discovers the structure in an ensemble of experiences when
    # learning of each item is *gradual and interleaved* with learning about the
    # others.  A nightly batch fails that: new items arrive blocked, and the
    # first ones are overwritten before the structure is ever extracted.  So
    # replay is interleaved into online learning, with a much smaller per-
    # reinstatement step than sleep uses.
    use_interleaved_replay: bool = True
    interleave_steps: int = 2        # reinstatements per online learning event
    alpha_interleave: float = 0.02   # neocortical change per reinstatement (small)
    # Kumaran 2016: neocortical learning can be *fast* for information that is
    # consistent with known structure.  Surprising items stay hippocampal.
    use_consistency_gating: bool = True
    consistency_gain: float = 0.5     # +/-50% on the neocortical rate at the extremes
    # Kumaran 2016: replay permits *goal-dependent* weighting of experience
    # statistics - cues on the current path are rehearsed more often.
    goal_replay_bias: float = 2.0

    def to_dict(self) -> dict:
        return {
            "gamma": self.gamma, "alpha_habit": self.alpha_habit, "alpha_mf": self.alpha_mf,
            "alpha_sleep": self.alpha_sleep, "plan_depth": self.plan_depth, "wm_capacity": self.wm_capacity,
            "tau": self.tau, "theta_pe": self.theta_pe, "theta_n": self.theta_n,
            "c_f": self.c_f, "c_l": self.c_l, "c_ops": self.c_ops, "alpha0": self.alpha0,
            "reliability_divisor": self.reliability_divisor, "replay_pe_exp": self.replay_pe_exp,
            "replay_novelty_exp": self.replay_novelty_exp, "replay_lambda": self.replay_lambda,
            "mismatch_medium": self.mismatch_medium, "mismatch_severe": self.mismatch_severe,
            "outcome_lr": self.outcome_lr, "weights": dict(self.weights), "gains": dict(self.gains),
            "base_cost": dict(self.base_cost), "max_engrams": self.max_engrams,
            "use_cerebellum": self.use_cerebellum, "use_thalamic_gate": self.use_thalamic_gate,
            "use_ofc_map": self.use_ofc_map, "use_prospection": self.use_prospection,
            "flexibility": self.flexibility, "limbic_bias": self.limbic_bias,
            "use_limbic_bias": self.use_limbic_bias, "prospection_horizon": self.prospection_horizon,
            "need_scale": self.need_scale,
            "use_lability_window": self.use_lability_window, "lability_window_seconds": self.lability_window_seconds,
            # CLS (McClelland 1995 / Kumaran 2016) + lability (Nader & Hardt 2009)
            "use_interleaved_replay": self.use_interleaved_replay,
            "interleave_steps": self.interleave_steps, "alpha_interleave": self.alpha_interleave,
            "use_consistency_gating": self.use_consistency_gating,
            "consistency_gain": self.consistency_gain, "goal_replay_bias": self.goal_replay_bias,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "CognitionConfig":
        config = cls()
        for key, value in (data or {}).items():
            if hasattr(config, key):
                setattr(config, key, value)
        return config


@dataclass
class Engram:
    """One episodic trace: cue state, action, reward, successor, surprise."""

    cue: int
    action: int
    reward: float
    next_cue: int
    prediction_error: float
    strength: float = 1.0
    timestamp: float = 0.0
    replays: int = 0
    novelty: float = 1.0
    # A terminal trace has no observed successor, so replay must not bootstrap
    # from ``next_cue`` (which only exists to carry the transition otherwise).
    done: bool = False

    def to_dict(self) -> dict:
        return {"cue": self.cue, "action": self.action, "reward": self.reward, "next_cue": self.next_cue,
                "prediction_error": self.prediction_error, "strength": self.strength,
                "timestamp": self.timestamp, "replays": self.replays, "novelty": self.novelty,
                "done": bool(self.done)}

    @classmethod
    def from_dict(cls, data: dict) -> "Engram":
        return cls(cue=int(data["cue"]), action=int(data["action"]), reward=float(data["reward"]),
                   next_cue=int(data["next_cue"]), prediction_error=float(data.get("prediction_error", 0.0)),
                   strength=float(data.get("strength", 1.0)), timestamp=float(data.get("timestamp", 0.0)),
                   replays=int(data.get("replays", 0)), novelty=float(data.get("novelty", 1.0)),
                   done=bool(data.get("done", False)))


@dataclass
class Decision:
    """The result of one arbitration + fusion cycle."""

    mode: str
    action: int
    probabilities: list[float]
    conflict: float
    disagreement: float
    need: float
    reliability: float
    capacity: float
    ops: int
    scores: dict
    module_values: dict
    confidence: float = 0.0           # paper 4/15: metacognitive confidence
    gate: float = 1.0                 # paper 1: MD gate on the model-based system
    eta: float = 0.0                  # paper 1: strategy overwrite rate
    ignition: dict = field(default_factory=dict)     # papers 9/10
    distributed: dict = field(default_factory=dict)  # paper 2

    def to_dict(self) -> dict:
        return {"mode": self.mode, "action": self.action, "probabilities": [round(p, 6) for p in self.probabilities],
                "conflict": round(self.conflict, 4), "disagreement": round(self.disagreement, 4),
                "need": round(self.need, 4), "reliability": round(self.reliability, 4),
                "capacity": round(self.capacity, 4), "ops": self.ops,
                "confidence": round(self.confidence, 4), "gate": round(self.gate, 4),
                "eta": round(self.eta, 4), "ignition": self.ignition, "distributed": self.distributed,
                "scores": {k: round(v, 4) for k, v in self.scores.items()}}


class MultiSystemModel:
    """The paper's model, usable on any small tabular MDP.

    The environment is described by ``state_outcome`` (state -> outcome id) and
    ``outcome_value`` (outcome id -> current subjective value).  Both are plain
    dicts so a devaluation is literally ``model.outcome_value[o] = 0.0``.
    """

    def __init__(self, n_states: int, n_actions: int, config: CognitionConfig | None = None,
                 state_outcome: dict[int, int] | None = None, outcome_value: dict[int, float] | None = None,
                 rng: random.Random | None = None,
                 feature_fn: Callable[[int], list[float]] | None = None):
        self.n_states = int(n_states)
        self.n_actions = int(n_actions)
        self.config = config or CognitionConfig()
        self.rng = rng or random.Random()
        # Sleep replay runs on a worker thread while conversation turns mutate
        # the value tables on the event loop; serialize every mutation/read.
        self._lock = threading.RLock()
        # Identity outcome mapping by default: every state is its own outcome.
        self.state_outcome = {s: int(state_outcome[s]) if state_outcome and s in state_outcome else s
                              for s in range(self.n_states)}
        self.outcome_value = {int(k): float(v) for k, v in (outcome_value or {}).items()}
        for outcome in set(self.state_outcome.values()):
            self.outcome_value.setdefault(outcome, 0.5)

        n, a = self.n_states, self.n_actions
        self.H = [[0.0] * a for _ in range(n)]
        self.Q_mf = [[0.0] * a for _ in range(n)]
        # Sparse transition counts: {(s, a): {s': count}}.  A dense nS x nA x nS
        # tensor would be 279k floats for the persona state space and would make
        # every save expensive.
        self.N: dict[tuple[int, int], dict[int, float]] = {}
        self.visits = [[0] * a for _ in range(n)]
        self.wm: deque[tuple[int, int, float]] = deque(maxlen=self.config.wm_capacity)
        self.engrams: list[Engram] = []
        self._clock = 0.0
        self._q_mb_cache: dict[tuple[int, int], list[float]] = {}
        self._retrieve_cache: dict[tuple[int, int], list[tuple[float, Engram]]] = {}
        # --- circuits from the follow-up papers ---
        self.cerebellum = CerebellarPredictor()
        self.coglinks = CogLinksArbiter()
        # Paper 3: the OFC cognitive map.  With a ``feature_fn`` (the LIFE
        # adapter supplies one) every state is embedded in factor space, so
        # value and episodic retrieval generalise across similar contexts.  The
        # embeddings are derived, so they are recomputed rather than persisted.
        self.feature_fn = feature_fn
        n_features = len(feature_fn(0)) if feature_fn else self.n_states
        self.ofc = OFCValueMap(self.n_states, n_features=n_features, persist=feature_fn is None)
        if feature_fn:
            for state in range(self.n_states):
                self.ofc.set_features(state, feature_fn(state))
        self.prospection = Prospection(horizon=self.config.prospection_horizon)
        self.metacognition = Metacognition(self.n_actions)
        self.flexibility = Flexibility(self.config.flexibility)
        self.workspace = GlobalWorkspace()
        self.self_model = SelfModel()
        self.groups = GroupCoupling()
        self._last_need = 0.0
        self._last_gate = 1.0
        self._last_confidence = 0.0
        self._last_ignition = None
        self._last_readout = None

    # ------------------------------------------------------------------ reward
    def outcome_of(self, state: int) -> int:
        return self.state_outcome.get(int(state), int(state))

    def reward(self, next_state: int) -> float:
        """``r(s, a, s') = V_o(o(s'))`` - the reward is bound to the outcome."""
        return float(self.outcome_value.get(self.outcome_of(next_state), 0.0))

    def set_outcome_value(self, outcome: int, value: float) -> None:
        """Devaluation / inflation: one write, no new experience required.

        Invalidates the planning cache so ``Q_mb`` reflects the new value on the
        very next decision - this is what makes devaluation *immediate*.
        """
        self.outcome_value[int(outcome)] = float(value)
        self._q_mb_cache.clear()
        self._retrieve_cache.clear()

    # -------------------------------------------------------------- subsystems
    def habit_distribution(self, state: int) -> list[float]:
        """``P_H(a|s) = (H + eps) / (sum H + nA*eps)``."""
        row = self.H[state]
        total = sum(row) + self.n_actions * EPS
        return [(value + EPS) / total for value in row]

    def td_error(self, state: int, action: int, reward: float, next_state: int, done: bool = False) -> float:
        """``delta = r + gamma * max Q_mf(s') - Q_mf(s, a)``."""
        target = reward if done else reward + self.config.gamma * max(self.Q_mf[next_state])
        return target - self.Q_mf[state][action]

    def transition(self, state: int, action: int) -> list[float]:
        """``P(s'|s,a)`` with Laplace smoothing over the transition counts."""
        counts = self.N.get((state, action), {})
        total = sum(counts.values()) + self.n_states * self.config.alpha0
        return [(counts.get(next_state, 0.0) + self.config.alpha0) / total
                for next_state in range(self.n_states)]

    def _successors(self, state: int, action: int) -> list[tuple[int, float]]:
        """Sparse ``(s', P(s'|s,a))`` over *observed* successors.

        The paper's smoothed transition spreads ``alpha0`` over every state.  On
        the toy task (every successor observed) this is identical to that.  On
        the persona state space spreading mass over 216 unseen successors is both
        meaningless and quadratic, so an unobserved pair is treated as an unknown
        whose immediate value is the prior mean and which has no continuation -
        the paper itself notes the tabular model only scales to small ``nS``.
        """
        counts = self.N.get((state, action), {})
        if not counts:
            return []
        total = sum(counts.values()) + len(counts) * self.config.alpha0
        return [(next_state, (count + self.config.alpha0) / total) for next_state, count in counts.items()]

    def _prior_reward(self) -> float:
        if not self.outcome_value:
            return 0.0
        return sum(self.outcome_value.values()) / len(self.outcome_value)

    def immediate_value(self, state: int) -> list[float]:
        """``I(s, a) = sum_s' P(s'|s,a) * V_o(o(s'))`` - uses the *current*
        outcome values, which is why planning revalues instantly on devaluation."""
        values = []
        for action in range(self.n_actions):
            successors = self._successors(state, action)
            values.append(self._prior_reward() if not successors
                          else sum(probability * self.reward(next_state) for next_state, probability in successors))
        return values

    def model_based_values_at(self, state: int, depth: int | None = None) -> list[float]:
        """``Q_mb^(d)(s,·)`` for a single state, memoised (this is what the paper's
        ``O(nA * nS * d)`` single-step complexity refers to)."""
        depth = self.config.plan_depth if depth is None else int(depth)
        key = (state, depth)
        if key in self._q_mb_cache:
            return self._q_mb_cache[key]
        memo: dict[tuple[int, int], list[float]] = {}

        def row(current_state: int, remaining: int) -> list[float]:
            memo_key = (current_state, remaining)
            if memo_key in memo:
                return memo[memo_key]
            immediate = self.immediate_value(current_state)
            if remaining <= 0:
                memo[memo_key] = immediate
                return immediate
            values = []
            for action in range(self.n_actions):
                continuation = 0.0
                for next_state, probability in self._successors(current_state, action):
                    continuation += probability * max(row(next_state, remaining - 1))
                values.append(immediate[action] + self.config.gamma * continuation)
            memo[memo_key] = values
            return values

        result = row(state, depth)
        self._q_mb_cache.update(memo)
        if len(self._q_mb_cache) > self.config.max_engrams:
            self._q_mb_cache.clear()
        return result

    def model_based_values(self, depth: int | None = None) -> list[list[float]]:
        """Full ``Q_mb`` table (convenience for inspection and the toy task)."""
        return [self.model_based_values_at(state, depth) for state in range(self.n_states)]

    def model_reliability(self) -> float:
        """``rho = min(1, (total transitions / observed (s,a) pairs) / 5)``."""
        total = sum(sum(counts.values()) for counts in self.N.values())
        observed = sum(1 for state in range(self.n_states) for action in range(self.n_actions)
                       if self.visits[state][action] > 0)
        if observed == 0:
            return 0.0
        return min(1.0, (total / observed) / self.config.reliability_divisor)

    def wm_values(self, state: int) -> list[float]:
        """``Q_wm(s,a) = sum of rewards of WM entries matching (s, a)``."""
        values = [0.0] * self.n_actions
        for cue, action, reward in self.wm:
            if cue == state:
                values[action] += reward
        return values

    def engram_values(self, state: int) -> list[float]:
        """Retrieved episodic value: ``sum score(e)`` grouped by action."""
        values = [0.0] * self.n_actions
        for score, engram in self.retrieve(state, top_k=self.n_actions * 4):
            values[engram.action] += score
        return values

    def retrieve(self, cue: int, top_k: int = 5) -> list[tuple[float, Engram]]:
        """``score(e) = sim(cue, e.cue) * strength(e) * exp(-lambda * (t - e.t))``."""
        key = (cue, top_k)
        if key in self._retrieve_cache:
            return self._retrieve_cache[key]
        now = self._clock
        scored = []
        for engram in self.engrams:
            # Paper 3: OFC is a cognitive map, so retrieval generalises across
            # *similar* cues rather than matching identity. Without embedded
            # features the map degrades to exact matching (the toy task).
            similarity = (self.ofc.similarity(cue, engram.cue) if self.config.use_ofc_map
                          else (1.0 if engram.cue == cue else 0.0))
            if similarity <= 0.0:
                continue
            decay = math.exp(-self.config.replay_lambda * max(0.0, now - engram.timestamp))
            scored.append((similarity * engram.strength * decay, engram))
        scored.sort(key=lambda item: item[0], reverse=True)
        result = scored[:max(1, top_k)]
        self._retrieve_cache[key] = result
        if len(self._retrieve_cache) > self.config.max_engrams:
            self._retrieve_cache.clear()
        return result

    def novelty(self, state: int, action: int) -> float:
        return 1.0 / (1.0 + self.visits[state][action])

    # ---------------------------------------------------------------- arbiter
    def prospection_values(self, state: int) -> list[float]:
        """Abstract future reward, rolled out over a longer horizon than Q_mb."""
        if not self.config.use_prospection:
            return [0.0] * self.n_actions
        return self.prospection.values(state, self._successors, self.reward, self.n_actions)

    def module_values(self, state: int) -> dict[str, list[float]]:
        """Raw per-module action values for one state (computed once per turn)."""
        return {
            "H": list(self.H[state]),
            "MF": list(self.Q_mf[state]),
            "MB": list(self.model_based_values_at(state)),
            "WM": self.wm_values(state),
            "E": self.engram_values(state),
            "P": self.prospection_values(state),
        }

    def _module_distributions(self, state: int) -> dict[str, list[float]]:
        values = self.module_values(state)
        return {module: self._softmax(vals) for module, vals in values.items()}

    def conflict(self, distributions: dict[str, list[float]]) -> float:
        """Mean normalised entropy of the module distributions."""
        denominator = math.log(self.n_actions) if self.n_actions > 1 else 1.0
        entropies = []
        for probabilities in distributions.values():
            entropy = -sum(p * math.log(p) for p in probabilities if p > EPS)
            entropies.append(entropy / denominator)
        return sum(entropies) / len(entropies) if entropies else 0.0

    def disagreement(self, distributions: dict[str, list[float]]) -> float:
        """``1 - (max_c n_c) / |M|`` over the modules' preferred actions."""
        preferred = [max(range(self.n_actions), key=lambda action: probs[action]) for probs in distributions.values()]
        if not preferred:
            return 0.0
        counts: dict[int, int] = {}
        for action in preferred:
            counts[action] = counts.get(action, 0) + 1
        return 1.0 - max(counts.values()) / len(preferred)

    def _ops(self, mode: str) -> int:
        """Normalised operation count for costing.

        The paper writes ``ops = depth x nS`` and prices it with a fixed
        coefficient.  That is fine for the 3-state toy but makes planning
        unreachable for a 216-state persona space purely because the
        discretisation is finer.  Normalising keeps the economics scale-free
        while preserving the ordering ``AUTO < WM < PLAN < FULL`` (planning is
        still the expensive option).
        """
        if mode == "FULL":
            return self.config.plan_depth + 1
        if mode == "PLAN":
            return self.config.plan_depth
        if mode == "WM":
            return 1
        return 0

    def arbitrate(self, state: int, stakes: float, fatigue: float, load: float,
                  distributions: dict[str, list[float]], reliability: float,
                  coupling: float = 1.0, extra_need: float = 0.0) -> tuple[str, dict, float, float]:
        """Return ``(mode, scores, need, capacity)``.

        ``coupling`` is the DLPFC-OFC coupling set by group identification
        (paper 11); it scales the benefit of the control modes only.
        """
        # Paper 15: monitoring adjusts ongoing control - a recent error raises
        # control demand on the following step (post-error slowing).
        # ``extra_need`` carries demands that do not come from the value tables -
        # notably the mentalising/pragmatic load of an indirect speech act
        # (paper 8), which is exactly the kind of situation that recruits control.
        internal = self.conflict(distributions) + self.disagreement(distributions)
        need = min(1.0, self.config.need_scale * internal
                   + self.metacognition.adjustment() + float(extra_need))
        capacity = (1.0 - max(0.0, min(1.0, fatigue))) ** 2 * (1.0 - max(0.0, min(1.0, load))) ** 2
        scores: dict[str, float] = {}
        for mode in MODE_ORDER:
            gain = sum(self.config.gains.get(module, 0.0) for module in MODE_MODULES[mode])
            benefit = stakes * need * gain * reliability
            if mode in ("PLAN", "FULL"):
                benefit *= coupling
            # Paper 14: changing set costs something; a less flexible system
            # therefore sticks to the mode it was already in.
            cost = (self.config.base_cost.get(mode, 0.0) + self.config.c_f * fatigue
                    + self.config.c_l * load + self.config.c_ops * self._ops(mode)
                    + self.flexibility.switch_cost(mode))
            scores[mode] = benefit * capacity - cost
        # Deterministic tie-break: cheaper (earlier) mode first.
        best = max(MODE_ORDER, key=lambda mode: (scores[mode], -MODE_ORDER.index(mode)))
        return best, scores, need, capacity

    # ------------------------------------------------------------------ fusion
    @staticmethod
    def _softmax(values: list[float], temperature: float = 1.0) -> list[float]:
        if not values:
            return []
        top = max(values)
        exps = [math.exp((value - top) / max(temperature, EPS)) for value in values]
        total = sum(exps) or 1.0
        return [value / total for value in exps]

    @staticmethod
    def _zscore(values: list[float]) -> list[float]:
        mean = sum(values) / len(values) if values else 0.0
        variance = sum((value - mean) ** 2 for value in values) / len(values) if values else 0.0
        deviation = math.sqrt(variance)
        return [(value - mean) / (deviation + EPS) for value in values]

    def fuse(self, mode: str, module_values: dict[str, list[float]], reliability: float,
             gate: float = 1.0, coupling: float = 1.0) -> list[float]:
        """z-score each enabled module, weight-sum, then softmax.

        ``gate`` is the thalamic MF/MB gate (paper 1) and ``coupling`` the
        DLPFC-OFC coupling set by group identification (paper 11).
        """
        logits = [0.0] * self.n_actions
        for module in MODE_MODULES[mode]:
            weight = self.config.weights.get(module, 0.0)
            if module == "MB":
                weight *= reliability * gate
            elif module == "WM":
                weight *= coupling
            for action, z in enumerate(self._zscore(module_values[module])):
                logits[action] += weight * z
        return self._softmax(logits, self.config.tau)

    # ----------------------------------------------------------------- decide
    def decide(self, state: int, stakes: float = 1.0, fatigue: float = 0.0, load: float = 0.0,
               explore: bool = False, group_id: str = "", framing: float = 1.0,
               extra_need: float = 0.0) -> Decision:
        """Thread-safe entry point.

        ``decide`` runs on the event loop while ``sleep_replay`` runs on a worker
        thread; both read/mutate the shared value tables, circuits and caches, so
        the whole arbitration must hold the same lock ``learn`` uses.  Without it
        a concurrent replay produced torn reads of ``Q_mf`` and corrupted
        ``flexibility`` / ``workspace``.
        """
        with self._lock:
            return self._decide_unlocked(state, stakes, fatigue, load, explore, group_id, framing, extra_need)

    def _decide_unlocked(self, state: int, stakes: float = 1.0, fatigue: float = 0.0, load: float = 0.0,
                         explore: bool = False, group_id: str = "", framing: float = 1.0,
                         extra_need: float = 0.0) -> Decision:
        state = int(state)
        module_values = self.module_values(state)
        if framing != 1.0:
            module_values["P"] = [framing * value for value in module_values["P"]]
        distributions = {module: self._softmax(values) for module, values in module_values.items()}
        reliability = self.model_reliability()
        # Paper 11: group identification scales the DLPFC-OFC bridge.
        coupling = self.groups.coupling(group_id)
        # Paper 1: the MD gate is derived from the freshly estimated need (the
        # arbitration below returns it), then lets the MD overwrite the
        # strategy representation at the CogLinks rate.
        mode, scores, need, capacity = self.arbitrate(state, stakes, fatigue, load, distributions,
                                                      reliability, coupling, extra_need)
        lateral, _ = self.coglinks.md_signals(need)
        gate = lateral if self.config.use_thalamic_gate else 1.0
        eta = self.coglinks.update_strategy(str(state), list(distributions["H"]), lateral)
        probabilities = self.fuse(mode, module_values, reliability, gate, coupling)
        confidence = self.metacognition.confidence(probabilities)
        readout = DistributedEvidence.read(distributions)
        ignition = self.workspace.ignite({
            "sensory": min(1.0, stakes / 2.0),
            "perceptual": reliability,
            "cognitive": confidence,
            "affective": need,
            "reflective": self.self_model.reference_weight(),
        })
        self.flexibility.commit(mode)
        self._last_need = need
        self._last_gate = gate
        self._last_confidence = confidence
        self._last_ignition = ignition
        self._last_readout = readout
        if explore and self.rng.random() < 0.1:
            action = self.rng.randrange(self.n_actions)
        else:
            action = max(range(self.n_actions), key=lambda index: probabilities[index])
        return Decision(mode=mode, action=action, probabilities=probabilities,
                        conflict=self.conflict(distributions), disagreement=self.disagreement(distributions),
                        need=need, reliability=reliability, capacity=capacity, ops=self._ops(mode),
                        scores=scores, module_values={k: [round(v, 4) for v in vals] for k, vals in module_values.items()},
                        confidence=confidence, gate=gate, eta=eta,
                        ignition=ignition.to_dict(), distributed=readout.to_dict())

    # ------------------------------------------------------------------ learn
    def learn(self, state: int, action: int, next_state: int, done: bool = False,
              reward: float | None = None) -> dict:
        """Thread-safe entry point (sleep replay runs off the event loop)."""
        with self._lock:
            return self._learn_unlocked(state, action, next_state, done, reward)

    def _learn_unlocked(self, state: int, action: int, next_state: int, done: bool = False,
                        reward: float | None = None) -> dict:
        """One learning step over every subsystem.  Returns the internals that
        the caller (and the experiments) need to inspect."""
        state, action, next_state = int(state), int(action), int(next_state)
        reward = self.reward(next_state) if reward is None else float(reward)
        # habit: chosen action accumulates, others decay at the same rate
        alpha_h = self.config.alpha_habit
        row = self.H[state]
        for candidate in range(self.n_actions):
            row[candidate] = (1 - alpha_h) * row[candidate] + alpha_h * (1.0 if candidate == action else 0.0)
        # model-free TD(0)
        delta = self.td_error(state, action, reward, next_state, done)
        # Paper 5: the cerebellum supplies the prediction-error signal. Ablating
        # it leaves TD learning intact (as in cerebellar-stroke patients) but
        # removes the surprise signal that drives selective encoding.
        cerebellar_pe = (self.cerebellum.observe(state, action, reward)
                         if self.config.use_cerebellum else delta)
        surprise = abs(cerebellar_pe)
        # Kumaran 2016: the neocortex can learn *fast* about experience that is
        # consistent with structure it already holds, while genuinely surprising
        # experience stays hippocampal (slow).  The signal is the same surprise
        # the cerebellum just produced, so no new quantity is invented.
        self.Q_mf[state][action] += self.config.alpha_mf * self._consistency_rate(surprise) * delta
        # Paper 1: MD tracks context inference and the strategy overwrite.
        self.coglinks.observe(surprise, switched=surprise > 0.5)
        # Papers 4/15: monitoring and adjustment of ongoing behaviour.
        good = reward >= self._prior_reward()
        self.metacognition.monitor(cerebellar_pe, outcome_good=good)
        self.flexibility.adapt(good)
        # Paper 4: retrospection biases the construction of future value.
        self.prospection.observe_outcome(reward, self._prior_reward())
        # transition + visit counts.  A *terminal* step has no observed successor:
        # recording one would teach the planner a self-loop the environment never
        # produced, so it is skipped and the trace is flagged ``done``.
        if not done:
            self.N.setdefault((state, action), {})
            self.N[(state, action)][next_state] = self.N[(state, action)].get(next_state, 0.0) + 1.0
            self.visits[state][action] += 1
        # Invalidate unconditionally: a terminal step still moves Q_mf (the limbic
        # term below) and encodes an engram, so leaving the caches warm served
        # stale model-based values on the next decide().
        self._q_mb_cache.clear()
        self._retrieve_cache.clear()
        # outcome value follows observed rewards (keeps planning meaningful)
        outcome = self.outcome_of(next_state)
        self.outcome_value[outcome] += self.config.outcome_lr * (reward - self.outcome_value[outcome])
        # working memory
        self.wm.append((state, action, reward))
        # selective episodic encoding
        encoded = self._maybe_encode(state, action, reward, next_state, surprise, done)
        # Paper 12: limbic structures send twice what they receive, awake as well
        # as asleep, so a freshly encoded episode already leans on cortical value.
        if encoded and self.config.use_limbic_bias:
            share = self.config.limbic_bias / (1.0 + self.config.limbic_bias)
            self.Q_mf[state][action] += 0.25 * self.config.alpha_mf * share * (reward - self.Q_mf[state][action])
        # Paper 13: self-related thought tracks the episodic store.
        self.self_model.update(len(self.engrams), sum(e.strength for e in self.engrams))
        self._clock += 1.0
        # McClelland 1995: the neocortex only discovers the structure in an
        # ensemble of experiences when each item is revisited *interleaved* with
        # the others.  A nightly batch is the blocked condition the paper warns
        # about, so replay is mixed into online learning as well.
        interleaved = 0
        if self.config.use_interleaved_replay and self.engrams:
            interleaved = self._interleaved_replay(self.config.interleave_steps)
        return {"reward": reward, "td_error": delta, "cerebellar_pe": cerebellar_pe, "encoded": encoded,
                "novelty": self.novelty(state, action), "interleaved": interleaved,
                "context_inference": self.coglinks.context_inference}

    def _consistency_rate(self, surprise: float) -> float:
        """Kumaran 2016: `1 +/- gain` on the neocortical rate, by consistency.

        ``consistency = exp(-|surprise|)`` is 1 for exactly-predicted experience
        and falls toward 0 as the outcome departs from what the model expected.
        """
        if not self.config.use_consistency_gating:
            return 1.0
        consistency = math.exp(-abs(float(surprise)))
        return 1.0 + self.config.consistency_gain * (2.0 * consistency - 1.0)

    def _interleaved_replay(self, steps: int) -> int:
        """A few reinstatements interleaved into online learning.

        Each is a *small* neocortical update (``alpha_interleave``) — exactly
        McClelland's point that the neocortical synapse changes a little on every
        reinstatement and structured knowledge accumulates over many of them.
        """
        count = 0
        for _ in range(max(0, int(steps))):
            if not self.engrams:
                break
            weights = [self.replay_priority(engram) for engram in self.engrams]
            engram = self.rng.choices(self.engrams, weights=weights, k=1)[0]
            # Terminal traces observed no successor: bootstrapping from a
            # fabricated next_cue dragged their value toward a fictitious
            # successor.  Mirror the guard sleep_replay already has.
            target = engram.reward + (0.0 if engram.done
                                      else self.config.gamma * max(self.Q_mf[engram.next_cue]))
            delta = target - self.Q_mf[engram.cue][engram.action]
            self.Q_mf[engram.cue][engram.action] += self.config.alpha_interleave * delta
            engram.replays += 1
            count += 1
        return count

    def _maybe_encode(self, state: int, action: int, reward: float, next_state: int, surprise: float,
                      done: bool = False) -> bool:
        """``encode <=> |surprise| > theta_pe or novelty(s,a) > theta_n``."""
        novelty = self.novelty(state, action)
        if abs(surprise) <= self.config.theta_pe and novelty <= self.config.theta_n:
            return False
        self.engrams.append(Engram(cue=state, action=action, reward=reward, next_cue=next_state,
                                   prediction_error=surprise, strength=1.0, timestamp=self._clock,
                                   novelty=novelty, done=done))
        if len(self.engrams) > self.config.max_engrams:
            # Keep the most surprising traces; drop the least useful ones.
            self.engrams.sort(key=self.replay_priority, reverse=True)
            del self.engrams[self.config.max_engrams:]
        return True

    # ------------------------------------------------------- sleep / reconsol.
    def replay_priority(self, engram: Engram, goal_states: set[int] | None = None) -> float:
        """``prio(e) = (eps+|delta_e|)^0.8 * (eps+novelty_e)^0.4 * strength_e``.

        Kumaran 2016 broadens replay: it allows **goal-dependent weighting of
        experience statistics**, so traces whose cue lies on the currently
        relevant path are rehearsed more often than their raw priority alone
        would warrant.  ``goal_states`` empty or None leaves the original.
        """
        priority = ((EPS + abs(engram.prediction_error)) ** self.config.replay_pe_exp
                    * (EPS + engram.novelty) ** self.config.replay_novelty_exp
                    * engram.strength)
        if goal_states and int(engram.cue) in goal_states:
            priority *= self.config.goal_replay_bias
        return priority

    def sleep_replay(self, steps: int = 100, goal_states: set[int] | None = None) -> dict:
        """Thread-safe entry point (runs on a worker thread)."""
        with self._lock:
            return self._sleep_replay_unlocked(steps, goal_states)

    def _sleep_replay_unlocked(self, steps: int = 100, goal_states: set[int] | None = None) -> dict:
        """Prioritized replay of episodic traces into the model-free value."""
        if not self.engrams:
            return {"replayed": 0, "before": [], "after": [], "top": []}
        replay_count = min(int(steps), max(1, len(self.engrams) * 4))
        # Paper 12: limbic structures send twice as many signals as they receive,
        # in wakefulness *and* sleep - so consolidation into cortical value is
        # weighted twice as heavily as the write-back into the traces.
        forward = self.config.limbic_bias if self.config.use_limbic_bias else 1.0
        backward = 1.0
        for _ in range(replay_count):
            weights = [self.replay_priority(engram, goal_states) for engram in self.engrams]
            engram = self.rng.choices(self.engrams, weights=weights, k=1)[0]
            target = engram.reward + (0.0 if engram.done
                                      else self.config.gamma * max(self.Q_mf[engram.next_cue]))
            delta = target - self.Q_mf[engram.cue][engram.action]
            # limbic -> cortical
            self.Q_mf[engram.cue][engram.action] += self.config.alpha_sleep * forward * delta
            # cortical -> limbic (half as strong)
            engram.strength = min(4.0, engram.strength + 0.05 * backward)
            engram.replays += 1
        # Replay rewrote Q_mf, so any memoised model-based value is stale.
        self._q_mb_cache.clear()
        self._retrieve_cache.clear()
        top = sorted(self.engrams, key=lambda item: item.replays, reverse=True)[:5]
        return {"replayed": replay_count,
                "top": [{"pe": round(item.prediction_error, 3), "replays": item.replays,
                         "strength": round(item.strength, 3)} for item in top]}

    def mismatch(self, engram: Engram, reward_new: float, next_cue_new: int) -> float:
        """``|r_new - r_e| + 0.1 * (-ln P(s'_new | e.cue, e.a))``."""
        if engram.done:
            # A terminal trace observed no successor; only the reward can surprise.
            return abs(float(reward_new) - engram.reward)
        probability = self.transition(engram.cue, engram.action)[int(next_cue_new)]
        return abs(float(reward_new) - engram.reward) + 0.1 * (-math.log(max(probability, EPS)))

    def reconsolidate(self, engram: Engram, reward_new: float, next_cue_new: int) -> str:
        """Three-branch reconsolidation: strengthen / update / recreate."""
        score = self.mismatch(engram, reward_new, next_cue_new)
        if score <= self.config.mismatch_medium:
            engram.strength = min(4.0, engram.strength + 0.15)
            return "strengthen"
        if score <= self.config.mismatch_severe:
            engram.reward = float(reward_new)
            engram.next_cue = int(next_cue_new)
            engram.strength = max(0.2, engram.strength * 0.7)
            return "update"
        self.engrams.append(Engram(cue=engram.cue, action=engram.action, reward=float(reward_new),
                                   next_cue=int(next_cue_new), prediction_error=score, strength=1.0,
                                   timestamp=self._clock, novelty=1.0))
        return "recreate"

    # ------------------------------------------------------------- persistence
    def to_dict(self) -> dict:
        with self._lock:
            return self._to_dict_unlocked()

    def _to_dict_unlocked(self) -> dict:
        return {
            "schema": 1, "n_states": self.n_states, "n_actions": self.n_actions,
            "config": self.config.to_dict(), "state_outcome": {str(k): v for k, v in self.state_outcome.items()},
            "outcome_value": {str(k): v for k, v in self.outcome_value.items()},
            "H": self.H, "Q_mf": self.Q_mf,
            "N": [[state, action, {str(next_state): count for next_state, count in counts.items()}]
                  for (state, action), counts in self.N.items()],
            "visits": self.visits,
            "wm": [list(item) for item in self.wm],
            "engrams": [item.to_dict() for item in self.engrams],
            "circuits": {
                "cerebellum": self.cerebellum.to_dict(),
                "coglinks": self.coglinks.to_dict(),
                "ofc": self.ofc.to_dict(),
                "prospection": self.prospection.to_dict(),
                "metacognition": self.metacognition.to_dict(),
                "flexibility": self.flexibility.to_dict(),
                "workspace": self.workspace.to_dict(),
                "self_model": self.self_model.to_dict(),
                "groups": self.groups.to_dict(),
            },
            "clock": self._clock, "saved_at": datetime.now().isoformat(),
        }

    @classmethod
    def from_dict(cls, data: dict, feature_fn: Callable[[int], list[float]] | None = None) -> "MultiSystemModel":
        model = cls(int(data.get("n_states", 1)), int(data.get("n_actions", 1)),
                    CognitionConfig.from_dict(data.get("config") or {}),
                    state_outcome={int(k): v for k, v in (data.get("state_outcome") or {}).items()},
                    outcome_value={int(k): float(v) for k, v in (data.get("outcome_value") or {}).items()},
                    feature_fn=feature_fn)
        if data.get("H"):
            model.H = [[float(v) for v in row] for row in data["H"]]
        if data.get("Q_mf"):
            model.Q_mf = [[float(v) for v in row] for row in data["Q_mf"]]
        for entry in data.get("N") or []:
            state, action, counts = int(entry[0]), int(entry[1]), entry[2]
            model.N[(state, action)] = {int(k): float(v) for k, v in counts.items()}
        if data.get("visits"):
            model.visits = [[int(v) for v in row] for row in data["visits"]]
        model.wm = deque([(int(c), int(a), float(r)) for c, a, r in (data.get("wm") or [])],
                         maxlen=model.config.wm_capacity)
        model.engrams = [Engram.from_dict(item) for item in (data.get("engrams") or [])]
        model._clock = float(data.get("clock", 0.0))
        circuits = data.get("circuits") or {}
        if circuits:
            model.cerebellum = CerebellarPredictor.from_dict(circuits.get("cerebellum") or {})
            model.coglinks = CogLinksArbiter.from_dict(circuits.get("coglinks") or {})
            # ``OFCValueMap.from_dict`` would rebuild the map at the default
            # width (8), truncating the LIFE adapter's 16-factor embedding, so
            # keep the map the constructor already sized correctly.
            saved_ofc = circuits.get("ofc") or {}
            if feature_fn:
                for state in range(model.n_states):
                    model.ofc.set_features(state, feature_fn(state))
            elif saved_ofc.get("features"):
                model.ofc = OFCValueMap.from_dict(saved_ofc, model.n_states)
            model.prospection = Prospection.from_dict(circuits.get("prospection") or {})
            model.prospection.horizon = model.config.prospection_horizon
            model.metacognition = Metacognition.from_dict(circuits.get("metacognition") or {}, model.n_actions)
            model.flexibility = Flexibility.from_dict(circuits.get("flexibility") or {})
            model.workspace = GlobalWorkspace.from_dict(circuits.get("workspace") or {})
            model.self_model = SelfModel.from_dict(circuits.get("self_model") or {})
            model.groups = GroupCoupling.from_dict(circuits.get("groups") or {})
        return model


class ToyTask:
    """The paper's two-action, three-state task.

    ``s0 --A--> s1`` (good outcome), ``s0 --B--> s2`` (second-best outcome);
    any action from ``s1`` / ``s2`` returns to ``s0``.  Reversal swaps the
    transition targets of A and B on ``s0``.
    """

    def __init__(self, good: float = 1.0, second: float = 0.5):
        self.n_states, self.n_actions = 3, 2
        self.good_value = good
        self.second_value = second
        self.state_outcome = {0: 0, 1: 1, 2: 2}
        self.outcome_value = {0: 0.0, 1: good, 2: second}
        self.reversed = False

    def model(self, config: CognitionConfig | None = None, rng: random.Random | None = None) -> MultiSystemModel:
        return MultiSystemModel(self.n_states, self.n_actions, config,
                                state_outcome=dict(self.state_outcome),
                                outcome_value=dict(self.outcome_value), rng=rng)

    def step(self, state: int, action: int) -> int:
        if state == 0:
            if self.reversed:
                return 2 if action == 0 else 1
            return 1 if action == 0 else 2
        return 0

    def devalue_good(self) -> None:
        self.outcome_value[1] = 0.0

    def reverse(self) -> None:
        self.reversed = not self.reversed
