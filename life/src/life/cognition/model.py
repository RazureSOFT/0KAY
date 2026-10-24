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

MODE_MODULES: dict[str, tuple[str, ...]] = {
    "AUTO": ("H", "MF"),
    "WM": ("H", "MF", "WM"),
    "PLAN": ("H", "MF", "MB", "P"),
    "FULL": ("H", "MF", "MB", "WM", "E", "P"),
}
MODE_ORDER: tuple[str, ...] = ("AUTO", "WM", "PLAN", "FULL")


@dataclass
class CognitionConfig:

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
    alpha0: float = 0.1
    reliability_divisor: float = 5.0
    replay_pe_exp: float = 0.8
    replay_novelty_exp: float = 0.4
    replay_lambda: float = 0.01
    mismatch_medium: float = 0.6
    mismatch_severe: float = 1.4
    outcome_lr: float = 0.25
    max_engrams: int = 2000
    weights: dict = field(default_factory=lambda: {"H": 0.6, "MF": 0.8, "MB": 1.6, "WM": 0.5, "E": 0.5, "P": 0.7})
    gains: dict = field(default_factory=lambda: {"H": 0.0, "MF": 0.0, "MB": 1.5, "WM": 0.6, "E": 0.9, "P": 0.0})
    base_cost: dict = field(default_factory=lambda: {"AUTO": 0.05, "WM": 0.15, "PLAN": 0.28, "FULL": 0.50})
    use_cerebellum: bool = True
    use_thalamic_gate: bool = True
    use_ofc_map: bool = True
    use_prospection: bool = True
    flexibility: float = 0.6
    limbic_bias: float = 2.0
    use_limbic_bias: bool = True
    prospection_horizon: int = 4
    need_scale: float = 0.7
    use_lability_window: bool = True
    lability_window_seconds: float = 21600.0
    use_interleaved_replay: bool = True
    interleave_steps: int = 2
    alpha_interleave: float = 0.02
    use_consistency_gating: bool = True
    consistency_gain: float = 0.5
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

    cue: int
    action: int
    reward: float
    next_cue: int
    prediction_error: float
    strength: float = 1.0
    timestamp: float = 0.0
    replays: int = 0
    novelty: float = 1.0
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
    confidence: float = 0.0
    gate: float = 1.0
    eta: float = 0.0
    ignition: dict = field(default_factory=dict)
    distributed: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {"mode": self.mode, "action": self.action, "probabilities": [round(p, 6) for p in self.probabilities],
                "conflict": round(self.conflict, 4), "disagreement": round(self.disagreement, 4),
                "need": round(self.need, 4), "reliability": round(self.reliability, 4),
                "capacity": round(self.capacity, 4), "ops": self.ops,
                "confidence": round(self.confidence, 4), "gate": round(self.gate, 4),
                "eta": round(self.eta, 4), "ignition": self.ignition, "distributed": self.distributed,
                "scores": {k: round(v, 4) for k, v in self.scores.items()}}


class MultiSystemModel:

    def __init__(self, n_states: int, n_actions: int, config: CognitionConfig | None = None,
                 state_outcome: dict[int, int] | None = None, outcome_value: dict[int, float] | None = None,
                 rng: random.Random | None = None,
                 feature_fn: Callable[[int], list[float]] | None = None):
        self.n_states = int(n_states)
        self.n_actions = int(n_actions)
        self.config = config or CognitionConfig()
        self.rng = rng or random.Random()
        self._lock = threading.RLock()
        self.state_outcome = {s: int(state_outcome[s]) if state_outcome and s in state_outcome else s
                              for s in range(self.n_states)}
        self.outcome_value = {int(k): float(v) for k, v in (outcome_value or {}).items()}
        for outcome in set(self.state_outcome.values()):
            self.outcome_value.setdefault(outcome, 0.5)

        n, a = self.n_states, self.n_actions
        self.H = [[0.0] * a for _ in range(n)]
        self.Q_mf = [[0.0] * a for _ in range(n)]
        self.N: dict[tuple[int, int], dict[int, float]] = {}
        self.visits = [[0] * a for _ in range(n)]
        self.wm: deque[tuple[int, int, float]] = deque(maxlen=self.config.wm_capacity)
        self.engrams: list[Engram] = []
        self._clock = 0.0
        self._q_mb_cache: dict[tuple[int, int], list[float]] = {}
        self._retrieve_cache: dict[tuple[int, int], list[tuple[float, Engram]]] = {}
        self.cerebellum = CerebellarPredictor()
        self.coglinks = CogLinksArbiter()
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

    def outcome_of(self, state: int) -> int:
        return self.state_outcome.get(int(state), int(state))

    def reward(self, next_state: int) -> float:
        return float(self.outcome_value.get(self.outcome_of(next_state), 0.0))

    def set_outcome_value(self, outcome: int, value: float) -> None:
        self.outcome_value[int(outcome)] = float(value)
        self._q_mb_cache.clear()
        self._retrieve_cache.clear()

    def habit_distribution(self, state: int) -> list[float]:
        row = self.H[state]
        total = sum(row) + self.n_actions * EPS
        return [(value + EPS) / total for value in row]

    def td_error(self, state: int, action: int, reward: float, next_state: int, done: bool = False) -> float:
        target = reward if done else reward + self.config.gamma * max(self.Q_mf[next_state])
        return target - self.Q_mf[state][action]

    def transition(self, state: int, action: int) -> list[float]:
        counts = self.N.get((state, action), {})
        total = sum(counts.values()) + self.n_states * self.config.alpha0
        return [(counts.get(next_state, 0.0) + self.config.alpha0) / total
                for next_state in range(self.n_states)]

    def _successors(self, state: int, action: int) -> list[tuple[int, float]]:
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
        values = []
        for action in range(self.n_actions):
            successors = self._successors(state, action)
            values.append(self._prior_reward() if not successors
                          else sum(probability * self.reward(next_state) for next_state, probability in successors))
        return values

    def model_based_values_at(self, state: int, depth: int | None = None) -> list[float]:
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
        return [self.model_based_values_at(state, depth) for state in range(self.n_states)]

    def model_reliability(self) -> float:
        total = sum(sum(counts.values()) for counts in self.N.values())
        observed = sum(1 for state in range(self.n_states) for action in range(self.n_actions)
                       if self.visits[state][action] > 0)
        if observed == 0:
            return 0.0
        return min(1.0, (total / observed) / self.config.reliability_divisor)

    def wm_values(self, state: int) -> list[float]:
        values = [0.0] * self.n_actions
        for cue, action, reward in self.wm:
            if cue == state:
                values[action] += reward
        return values

    def engram_values(self, state: int) -> list[float]:
        values = [0.0] * self.n_actions
        for score, engram in self.retrieve(state, top_k=self.n_actions * 4):
            values[engram.action] += score
        return values

    def retrieve(self, cue: int, top_k: int = 5) -> list[tuple[float, Engram]]:
        key = (cue, top_k)
        if key in self._retrieve_cache:
            return self._retrieve_cache[key]
        now = self._clock
        scored = []
        for engram in self.engrams:
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

    def prospection_values(self, state: int) -> list[float]:
        if not self.config.use_prospection:
            return [0.0] * self.n_actions
        return self.prospection.values(state, self._successors, self.reward, self.n_actions)

    def module_values(self, state: int) -> dict[str, list[float]]:
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
        denominator = math.log(self.n_actions) if self.n_actions > 1 else 1.0
        entropies = []
        for probabilities in distributions.values():
            entropy = -sum(p * math.log(p) for p in probabilities if p > EPS)
            entropies.append(entropy / denominator)
        return sum(entropies) / len(entropies) if entropies else 0.0

    def disagreement(self, distributions: dict[str, list[float]]) -> float:
        preferred = [max(range(self.n_actions), key=lambda action: probs[action]) for probs in distributions.values()]
        if not preferred:
            return 0.0
        counts: dict[int, int] = {}
        for action in preferred:
            counts[action] = counts.get(action, 0) + 1
        return 1.0 - max(counts.values()) / len(preferred)

    def _ops(self, mode: str) -> int:
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
            cost = (self.config.base_cost.get(mode, 0.0) + self.config.c_f * fatigue
                    + self.config.c_l * load + self.config.c_ops * self._ops(mode)
                    + self.flexibility.switch_cost(mode))
            scores[mode] = benefit * capacity - cost
        best = max(MODE_ORDER, key=lambda mode: (scores[mode], -MODE_ORDER.index(mode)))
        return best, scores, need, capacity

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

    def decide(self, state: int, stakes: float = 1.0, fatigue: float = 0.0, load: float = 0.0,
               explore: bool = False, group_id: str = "", framing: float = 1.0,
               extra_need: float = 0.0) -> Decision:
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
        coupling = self.groups.coupling(group_id)
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

    def learn(self, state: int, action: int, next_state: int, done: bool = False,
              reward: float | None = None) -> dict:
        with self._lock:
            return self._learn_unlocked(state, action, next_state, done, reward)

    def _learn_unlocked(self, state: int, action: int, next_state: int, done: bool = False,
                        reward: float | None = None) -> dict:
        state, action, next_state = int(state), int(action), int(next_state)
        reward = self.reward(next_state) if reward is None else float(reward)
        alpha_h = self.config.alpha_habit
        row = self.H[state]
        for candidate in range(self.n_actions):
            row[candidate] = (1 - alpha_h) * row[candidate] + alpha_h * (1.0 if candidate == action else 0.0)
        delta = self.td_error(state, action, reward, next_state, done)
        cerebellar_pe = (self.cerebellum.observe(state, action, reward)
                         if self.config.use_cerebellum else delta)
        surprise = abs(cerebellar_pe)
        self.Q_mf[state][action] += self.config.alpha_mf * self._consistency_rate(surprise) * delta
        self.coglinks.observe(surprise, switched=surprise > 0.5)
        good = reward >= self._prior_reward()
        self.metacognition.monitor(cerebellar_pe, outcome_good=good)
        self.flexibility.adapt(good)
        self.prospection.observe_outcome(reward, self._prior_reward())
        if not done:
            self.N.setdefault((state, action), {})
            self.N[(state, action)][next_state] = self.N[(state, action)].get(next_state, 0.0) + 1.0
            self.visits[state][action] += 1
        self._q_mb_cache.clear()
        self._retrieve_cache.clear()
        outcome = self.outcome_of(next_state)
        self.outcome_value[outcome] += self.config.outcome_lr * (reward - self.outcome_value[outcome])
        self.wm.append((state, action, reward))
        encoded = self._maybe_encode(state, action, reward, next_state, surprise, done)
        if encoded and self.config.use_limbic_bias:
            share = self.config.limbic_bias / (1.0 + self.config.limbic_bias)
            self.Q_mf[state][action] += 0.25 * self.config.alpha_mf * share * (reward - self.Q_mf[state][action])
        self.self_model.update(len(self.engrams), sum(e.strength for e in self.engrams))
        self._clock += 1.0
        interleaved = 0
        if self.config.use_interleaved_replay and self.engrams:
            interleaved = self._interleaved_replay(self.config.interleave_steps)
        return {"reward": reward, "td_error": delta, "cerebellar_pe": cerebellar_pe, "encoded": encoded,
                "novelty": self.novelty(state, action), "interleaved": interleaved,
                "context_inference": self.coglinks.context_inference}

    def _consistency_rate(self, surprise: float) -> float:
        if not self.config.use_consistency_gating:
            return 1.0
        consistency = math.exp(-abs(float(surprise)))
        return 1.0 + self.config.consistency_gain * (2.0 * consistency - 1.0)

    def _interleaved_replay(self, steps: int) -> int:
        count = 0
        for _ in range(max(0, int(steps))):
            if not self.engrams:
                break
            weights = [self.replay_priority(engram) for engram in self.engrams]
            engram = self.rng.choices(self.engrams, weights=weights, k=1)[0]
            target = engram.reward + (0.0 if engram.done
                                      else self.config.gamma * max(self.Q_mf[engram.next_cue]))
            delta = target - self.Q_mf[engram.cue][engram.action]
            self.Q_mf[engram.cue][engram.action] += self.config.alpha_interleave * delta
            engram.replays += 1
            count += 1
        return count

    def _maybe_encode(self, state: int, action: int, reward: float, next_state: int, surprise: float,
                      done: bool = False) -> bool:
        novelty = self.novelty(state, action)
        if abs(surprise) <= self.config.theta_pe and novelty <= self.config.theta_n:
            return False
        self.engrams.append(Engram(cue=state, action=action, reward=reward, next_cue=next_state,
                                   prediction_error=surprise, strength=1.0, timestamp=self._clock,
                                   novelty=novelty, done=done))
        if len(self.engrams) > self.config.max_engrams:
            self.engrams.sort(key=self.replay_priority, reverse=True)
            del self.engrams[self.config.max_engrams:]
        return True

    def replay_priority(self, engram: Engram, goal_states: set[int] | None = None) -> float:
        priority = ((EPS + abs(engram.prediction_error)) ** self.config.replay_pe_exp
                    * (EPS + engram.novelty) ** self.config.replay_novelty_exp
                    * engram.strength)
        if goal_states and int(engram.cue) in goal_states:
            priority *= self.config.goal_replay_bias
        return priority

    def sleep_replay(self, steps: int = 100, goal_states: set[int] | None = None) -> dict:
        with self._lock:
            return self._sleep_replay_unlocked(steps, goal_states)

    def _sleep_replay_unlocked(self, steps: int = 100, goal_states: set[int] | None = None) -> dict:
        if not self.engrams:
            return {"replayed": 0, "before": [], "after": [], "top": []}
        replay_count = min(int(steps), max(1, len(self.engrams) * 4))
        forward = self.config.limbic_bias if self.config.use_limbic_bias else 1.0
        backward = 1.0
        for _ in range(replay_count):
            weights = [self.replay_priority(engram, goal_states) for engram in self.engrams]
            engram = self.rng.choices(self.engrams, weights=weights, k=1)[0]
            target = engram.reward + (0.0 if engram.done
                                      else self.config.gamma * max(self.Q_mf[engram.next_cue]))
            delta = target - self.Q_mf[engram.cue][engram.action]
            self.Q_mf[engram.cue][engram.action] += self.config.alpha_sleep * forward * delta
            engram.strength = min(4.0, engram.strength + 0.05 * backward)
            engram.replays += 1
        self._q_mb_cache.clear()
        self._retrieve_cache.clear()
        top = sorted(self.engrams, key=lambda item: item.replays, reverse=True)[:5]
        return {"replayed": replay_count,
                "top": [{"pe": round(item.prediction_error, 3), "replays": item.replays,
                         "strength": round(item.strength, 3)} for item in top]}

    def mismatch(self, engram: Engram, reward_new: float, next_cue_new: int) -> float:
        if engram.done:
            return abs(float(reward_new) - engram.reward)
        probability = self.transition(engram.cue, engram.action)[int(next_cue_new)]
        return abs(float(reward_new) - engram.reward) + 0.1 * (-math.log(max(probability, EPS)))

    def reconsolidate(self, engram: Engram, reward_new: float, next_cue_new: int) -> str:
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
