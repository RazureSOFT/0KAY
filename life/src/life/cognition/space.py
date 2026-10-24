from __future__ import annotations

import json
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime
from functools import lru_cache
from pathlib import Path

from .circuits import SocialCoder, SocialReading
from .model import CognitionConfig, Decision, MultiSystemModel

LIFE_ACTIONS: tuple[str, ...] = ("reply_brief", "reply_warm", "ask_clarify", "plan", "tool", "defer")

ACTION_GUIDANCE: dict[str, str] = {
    "reply_brief": "用一两句简短回应，不展开、不规划、不调用工具。",
    "reply_warm": "先共情、先照顾对方情绪，再简短回应；不要急着解决问题或说教。",
    "ask_clarify": "信息不足，先提一个关键问题澄清，再决定下一步；不要臆测。",
    "plan": "先在心里做一次多步规划（目标—步骤—风险），再给出有条理的回答。",
    "tool": "这一步需要真实执行：选择合适的工具获取信息或完成动作，如实报告结果。",
    "defer": "此刻不适合展开：可以延后、保持安静，或简短表示稍后再说。",
}

_INTENTS: tuple[str, ...] = ("请求", "情绪", "分享", "抱怨", "提问", "闲聊")
_ROLES: tuple[str, ...] = ("owner", "secondary", "other")
_URGENCY_BUCKETS = 3
_MEMORY_BUCKETS = 2
_SLEEP_BUCKETS = 2

N_STATES = (len(_INTENTS) * len(_ROLES) * _URGENCY_BUCKETS * _MEMORY_BUCKETS * _SLEEP_BUCKETS)
N_FEATURES = len(_INTENTS) + len(_ROLES) + _URGENCY_BUCKETS + _MEMORY_BUCKETS + _SLEEP_BUCKETS


def _index(value, options: tuple[str, ...], default: int = 0) -> int:
    try:
        return options.index(value)
    except (ValueError, TypeError):
        return default


def context_factors(context: dict) -> tuple[int, int, int, int, int]:
    context = context or {}
    intent = _index(str(context.get("intent") or "闲聊"), _INTENTS, len(_INTENTS) - 1)
    role = _index(str(context.get("role") or "other"), _ROLES, len(_ROLES) - 1)
    urgency = float(context.get("urgency") or 0.0)
    urgency_bucket = 0 if urgency < 0.34 else (1 if urgency < 0.67 else 2)
    memory_bucket = 1 if int(context.get("memory_hits") or 0) > 0 else 0
    sleeping = 1 if context.get("sleeping") else 0
    return intent, role, urgency_bucket, memory_bucket, sleeping


def _hashable_context(context: dict) -> tuple:
    return tuple(sorted(context.items()))


@lru_cache(maxsize=512)
def _cached_state_index(context_tuple: tuple) -> int:
    context = dict(context_tuple)
    intent, role, urgency_bucket, memory_bucket, sleeping = context_factors(context)
    return ((((intent * len(_ROLES)) + role) * _URGENCY_BUCKETS + urgency_bucket) * _MEMORY_BUCKETS
            + memory_bucket) * _SLEEP_BUCKETS + sleeping


def state_index(context: dict) -> int:
    return _cached_state_index(_hashable_context(context or {}))


def _features_from_factors(intent: int, role: int, urgency: int, memory: int, sleeping: int) -> list[float]:
    vector = [0.0] * N_FEATURES
    offset = 0
    for index, width in ((intent, len(_INTENTS)), (role, len(_ROLES)),
                         (urgency, _URGENCY_BUCKETS), (memory, _MEMORY_BUCKETS),
                         (sleeping, _SLEEP_BUCKETS)):
        vector[offset + min(max(int(index), 0), width - 1)] = 1.0
        offset += width
    return vector


@lru_cache(maxsize=512)
def _cached_context_features(context_tuple: tuple) -> tuple[float, ...]:
    context = dict(context_tuple)
    return tuple(_features_from_factors(*context_factors(context)))


def context_features(context: dict) -> list[float]:
    return list(_cached_context_features(_hashable_context(context or {})))


def state_factors(index: int) -> tuple[int, int, int, int, int]:
    index = int(index) % N_STATES
    sleeping = index % _SLEEP_BUCKETS
    index //= _SLEEP_BUCKETS
    memory = index % _MEMORY_BUCKETS
    index //= _MEMORY_BUCKETS
    urgency = index % _URGENCY_BUCKETS
    index //= _URGENCY_BUCKETS
    role = index % len(_ROLES)
    index //= len(_ROLES)
    intent = index % len(_INTENTS)
    return intent, role, urgency, memory, sleeping


def state_features(index: int) -> list[float]:
    return _features_from_factors(*state_factors(index))


def reward_from_signals(valence_delta: float = 0.0, task_success: float = 0.0, task_failure: float = 0.0,
                        user_engagement: float = 0.0, friction: float = 0.0) -> float:
    raw = float(0.5 + 2.0 * valence_delta + 1.0 * task_success - 1.0 * task_failure
                + 0.5 * user_engagement - 1.0 * friction)
    return max(-1.5, min(2.5, raw))


@dataclass
class ControlOutcome:

    mode: str
    action: str
    action_index: int
    guidance: str
    need: float
    reliability: float
    capacity: float
    probabilities: list[float]
    scores: dict = field(default_factory=dict)
    state: int = 0
    plan_depth: int = 1
    allow_tools: bool = True
    confidence: float = 0.0
    gate: float = 1.0
    eta: float = 0.0
    extra_need: float = 0.0
    social_demand: float = 0.0
    social: dict = field(default_factory=dict)
    ignition: dict = field(default_factory=dict)
    distributed: dict = field(default_factory=dict)
    group: dict = field(default_factory=dict)
    self_thought: float = 1.0
    self_microstate: str = "C"

    def to_dict(self) -> dict:
        return {"mode": self.mode, "action": self.action, "need": round(self.need, 4),
                "reliability": round(self.reliability, 4), "capacity": round(self.capacity, 4),
                "plan_depth": self.plan_depth, "allow_tools": self.allow_tools,
                "confidence": round(self.confidence, 4), "gate": round(self.gate, 4),
                "eta": round(self.eta, 4), "extra_need": round(self.extra_need, 4),
                "social": self.social, "ignition": self.ignition, "distributed": self.distributed,
                "group": self.group, "self_thought": round(self.self_thought, 4),
                "self_microstate": self.self_microstate,
                "probabilities": [round(p, 4) for p in self.probabilities],
                "scores": {k: round(v, 4) for k, v in self.scores.items()}}


class CognitionEngine:

    def __init__(self, data_dir: str = "./data/life", config: CognitionConfig | None = None):
        self.data_dir = Path(data_dir) / "cognition"
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.path = self.data_dir / "cognition.json"
        self.config = config or CognitionConfig()
        self.model = MultiSystemModel(N_STATES, len(LIFE_ACTIONS), self.config, feature_fn=state_features)
        self.social = SocialCoder()
        self.turns = 0
        self._pending: dict[str, dict] = {}
        self._last_reading: SocialReading | None = None
        self.load()

    def reconfigure(self, config: CognitionConfig) -> None:
        for key, value in vars(config).items():
            if hasattr(self.config, key):
                setattr(self.config, key, value)
        self.model.wm = deque(self.model.wm, maxlen=max(1, int(self.config.wm_capacity)))
        if getattr(self.model, "prospection", None) is not None:
            self.model.prospection.horizon = max(1, int(self.config.prospection_horizon))

    def social_reading(self, message: str) -> SocialReading:
        reading = self.social.encode(message or "")
        self._last_reading = reading
        return reading

    def identify_group(self, group_id: str, strength: float) -> None:
        self.model.groups.identify(group_id, strength)

    def control(self, context: dict, fatigue: float = 0.0, load: float = 0.0,
                stakes: float = 1.0, explore: bool = False, group_id: str = "",
                message: str = "", social: SocialReading | None = None,
                affect_need: float = 0.0) -> ControlOutcome:
        state = state_index(context)
        self.model.ofc.set_features(state, context_features(context))
        text = message or str((context or {}).get("message") or "")
        reading = social if social is not None else (self.social_reading(text) if text else None)
        extra_need = max(0.0, float(affect_need or 0.0))
        if reading is not None:
            extra_need += 0.5 * SocialCoder.control_demand(reading)
            stakes = stakes * (1.0 + 0.4 * reading.indirectness)
        decision: Decision = self.model.decide(state, stakes=stakes, fatigue=fatigue, load=load,
                                               explore=explore, group_id=group_id, extra_need=extra_need)
        action = LIFE_ACTIONS[decision.action]
        depth = {"AUTO": 1, "WM": 1, "PLAN": 2, "FULL": self.config.plan_depth + 1}.get(decision.mode, 1)
        return ControlOutcome(mode=decision.mode, action=action, action_index=decision.action,
                              guidance=ACTION_GUIDANCE.get(action, ""), need=decision.need,
                              reliability=decision.reliability, capacity=decision.capacity,
                              probabilities=decision.probabilities, scores=decision.scores, state=state,
                              plan_depth=depth, allow_tools=decision.mode in ("PLAN", "FULL"),
                              confidence=decision.confidence, gate=decision.gate, eta=decision.eta,
                              extra_need=extra_need, social_demand=extra_need,
                              social=reading.to_dict() if reading is not None else {},
                              ignition=decision.ignition, distributed=decision.distributed,
                              group=self.model.groups.profile(group_id),
                              self_thought=self.model.self_model.reference_weight(),
                              self_microstate=self.model.self_model.microstate())

    def observe(self, session_id: str, context: dict, next_context: dict, reward: float,
                action_index: int | None = None, done: bool = False) -> dict:
        pending = self._pending.get(session_id or "")
        if pending is None:
            state = state_index(context)
            if action_index is None:
                habit = self.model.H[state]
                action_index = max(range(len(habit)), key=lambda index: habit[index])
        else:
            state = pending["state"]
            action_index = pending["action"] if action_index is None else int(action_index)
        next_state = state_index(next_context)
        self.model.ofc.set_features(next_state, context_features(next_context))
        result = self.model.learn(state, int(action_index), next_state, done=done, reward=reward)
        self.turns += 1
        self._pending.pop(session_id or "", None)
        return result

    def remember_decision(self, session_id: str, outcome: ControlOutcome) -> None:
        if len(self._pending) >= 512:
            self._pending.pop(next(iter(self._pending)), None)
        self._pending[session_id or ""] = {"state": outcome.state, "action": outcome.action_index}

    def sleep_replay(self, steps: int = 120, goal_states: set[int] | None = None) -> dict:
        return self.model.sleep_replay(steps, goal_states)

    def reconsolidate_recent(self, reward_new: float, next_cue: int) -> list[str]:
        results = []
        for engram in self.model.engrams[-3:]:
            results.append(self.model.reconsolidate(engram, reward_new, next_cue))
        return results

    def stats(self) -> dict:
        model = self.model
        return {
            "turns": self.turns,
            "states": model.n_states,
            "actions": model.n_actions,
            "engrams": len(model.engrams),
            "engram_strength": round(sum(e.strength for e in model.engrams), 3),
            "reliability": round(model.model_reliability(), 4),
            "working_memory": len(model.wm),
            "observed_pairs": sum(1 for s in range(model.n_states) for a in range(model.n_actions)
                                  if model.visits[s][a] > 0),
            "context_inference": round(model.coglinks.context_inference, 4),
            "strategy_contexts": len(model.coglinks.strategy),
            "strategy_overwrites": model.coglinks.switches,
            "gate": round(model._last_gate, 4),
            "confidence": round(model._last_confidence, 4),
            "self_thought": round(model.self_model.self_thought, 4),
            "microstate": model.self_model.microstate(),
            "flexibility": round(model.flexibility.flexibility, 4),
            "ignition": model._last_ignition.to_dict() if model._last_ignition else {},
            "distributed": model._last_readout.to_dict() if model._last_readout else {},
        }

    def last_decision(self) -> dict:
        return {"pending": dict(self._pending)} if self._pending else {}

    def save(self) -> None:
        payload = self.model.to_dict()
        payload["turns"] = self.turns
        temporary = self.path.with_suffix(".tmp")
        temporary.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
        temporary.replace(self.path)

    def load(self) -> None:
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
        except (FileNotFoundError, json.JSONDecodeError):
            return
        self.model = MultiSystemModel.from_dict(data, feature_fn=state_features)
        self.turns = int(data.get("turns", 0))
        self.config = self.model.config
