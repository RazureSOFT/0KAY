"""L.I.F.E <-> model adapter.

The paper's model is a tabular MDP.  To let a persona agent use it we need a
bounded state space and a small, meaningful action set:

* **state** = discretised decision context (intent x relationship role x urgency
  x whether memory fired x asleep-or-awake), capped at 216 cells;
* **action** = the response *strategy* the agent commits to (brief reply, warm
  reply, clarifying question, multi-step plan, tool use, defer).

The arbiter then answers "how much brain to spend" and the fused distribution
answers "what to do", while the language model only renders the chosen strategy
in character.

The follow-up papers add four context channels on top of that core:

* a **social reading** (interaction basis, cognitive/affective theory of mind,
  indirectness and communicative function) that raises the control demand and
  the stakes of an indirect speech act (papers 6-8);
* an **OFC cognitive-map embedding** so episodic retrieval generalises across
  similar contexts instead of matching them by identity (paper 3);
* **group identification**, which scales the DLPFC-OFC bridge (paper 11);
* the **self model**, driven by how much episodic-autobiographical memory the
  agent actually holds (paper 13).
"""
from __future__ import annotations

import json
from collections import deque
from dataclasses import dataclass, field
from datetime import datetime
from functools import lru_cache
from pathlib import Path

from .circuits import SocialCoder, SocialReading
from .model import CognitionConfig, Decision, MultiSystemModel

# Response strategies (actions).
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

# The full discretised state space (6 x 3 x 3 x 2 x 2).
N_STATES = (len(_INTENTS) * len(_ROLES) * _URGENCY_BUCKETS * _MEMORY_BUCKETS * _SLEEP_BUCKETS)
# Feature width of the OFC cognitive map (paper 3): one slot per factor value.
N_FEATURES = len(_INTENTS) + len(_ROLES) + _URGENCY_BUCKETS + _MEMORY_BUCKETS + _SLEEP_BUCKETS


def _index(value, options: tuple[str, ...], default: int = 0) -> int:
    try:
        return options.index(value)
    except (ValueError, TypeError):
        return default


def context_factors(context: dict) -> tuple[int, int, int, int, int]:
    """Discretise a live context into ``(intent, role, urgency, memory, sleep)``.

    Every other function in this module derives from these five factors, so the
    state index, the OFC embedding and the habit table always agree.
    """
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
    """Fold a live decision context into one of the model's 216 states.

    ``context`` keys (all optional): ``intent``, ``role``, ``urgency`` (0..1),
    ``memory_hits`` (int), ``sleeping`` (bool).
    """
    return _cached_state_index(_hashable_context(context or {}))


def _features_from_factors(intent: int, role: int, urgency: int, memory: int, sleeping: int) -> list[float]:
    """One-hot factor vector - the shared core of the OFC embedding."""
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
    # Cache an immutable tuple: returning the cached list let any caller mutate
    # it in place and poison the cache for every other context.
    return tuple(_features_from_factors(*context_factors(context)))


def context_features(context: dict) -> list[float]:
    """One-hot factor embedding used as the OFC cognitive map (paper 3).

    Paper 3's claim is that OFC holds an *abstract, generalisable* map rather
    than a table of individual values.  A one-hot over the five context factors
    gives exactly that: two contexts that agree on four of five factors have a
    cosine similarity of 0.8, so value and episodic retrieval transfer between
    them, while contexts that agree on nothing are orthogonal.
    """
    return list(_cached_context_features(_hashable_context(context or {})))


def state_factors(index: int) -> tuple[int, int, int, int, int]:
    """Inverse of :func:`state_index` - a state index back to its five factors."""
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
    """OFC embedding of a *state index*.

    This is the ``feature_fn`` hook handed to :class:`MultiSystemModel`, so the
    cognitive map is derived from the state space itself and never has to be
    persisted or kept in sync by hand.
    """
    return _features_from_factors(*state_factors(index))


def reward_from_signals(valence_delta: float = 0.0, task_success: float = 0.0, task_failure: float = 0.0,
                        user_engagement: float = 0.0, friction: float = 0.0) -> float:
    """Reward bound to *outcomes*, not actions: how the interaction actually went.

    Clamped to [-1.5, 2.5] so a single wild signal cannot blow up the TD
    target (Q would scale as r/(1-gamma) otherwise); the z-score fusion is
    scale-invariant, this only keeps the value tables human-readable.
    """
    raw = float(0.5 + 2.0 * valence_delta + 1.0 * task_success - 1.0 * task_failure
                + 0.5 * user_engagement - 1.0 * friction)
    return max(-1.5, min(2.5, raw))


@dataclass
class ControlOutcome:
    """What the engine consumes after an arbitration cycle."""

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
    # --- circuits from the follow-up papers ---
    confidence: float = 0.0        # papers 4/15: metacognitive confidence
    gate: float = 1.0              # paper 1: MD gate on the model-based system
    eta: float = 0.0               # paper 1: strategy overwrite rate
    extra_need: float = 0.0        # paper 8: demand contributed by pragmatics
    social_demand: float = 0.0     # paper 8: same value, explicit name
    social: dict = field(default_factory=dict)      # papers 6-8
    ignition: dict = field(default_factory=dict)    # papers 9/10
    distributed: dict = field(default_factory=dict)  # paper 2
    group: dict = field(default_factory=dict)       # paper 11
    self_thought: float = 1.0                       # paper 13
    self_microstate: str = "C"                      # paper 13

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
    """Stateful wrapper: arbitrate per turn, learn from real outcomes, replay on sleep."""

    def __init__(self, data_dir: str = "./data/life", config: CognitionConfig | None = None):
        self.data_dir = Path(data_dir) / "cognition"
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.path = self.data_dir / "cognition.json"
        self.config = config or CognitionConfig()
        # Paper 3: the model is given the factor embedding of every state, so the
        # OFC value map generalises across similar contexts instead of matching
        # them by identity.
        self.model = MultiSystemModel(N_STATES, len(LIFE_ACTIONS), self.config, feature_fn=state_features)
        self.social = SocialCoder()
        self.turns = 0
        self._pending: dict[str, dict] = {}
        self._last_reading: SocialReading | None = None
        self.load()

    def reconfigure(self, config: CognitionConfig) -> None:
        """Apply a new config **in place**.

        ``MultiSystemModel`` was handed a *reference* to this object, so the
        fields must be updated in place - rebinding ``self.config`` would leave
        the model pointing at the stale instance.  Learned value tables, habit
        strengths and the engram store are untouched; only tunables change.
        """
        for key, value in vars(config).items():
            if hasattr(self.config, key):
                setattr(self.config, key, value)
        # `wm` and `prospection` snapshot their size at construction, so a live
        # change must rebuild them - otherwise the dashboard sliders silently do
        # nothing until the process restarts.
        self.model.wm = deque(self.model.wm, maxlen=max(1, int(self.config.wm_capacity)))
        if getattr(self.model, "prospection", None) is not None:
            self.model.prospection.horizon = max(1, int(self.config.prospection_horizon))

    # ------------------------------------------------------------------ decide
    def social_reading(self, message: str) -> SocialReading:
        """Read a message through the social circuits (papers 6-8)."""
        reading = self.social.encode(message or "")
        self._last_reading = reading
        return reading

    def identify_group(self, group_id: str, strength: float) -> None:
        """Record how strongly the agent identifies with a group (paper 11)."""
        self.model.groups.identify(group_id, strength)

    def control(self, context: dict, fatigue: float = 0.0, load: float = 0.0,
                stakes: float = 1.0, explore: bool = False, group_id: str = "",
                message: str = "", social: SocialReading | None = None,
                affect_need: float = 0.0) -> ControlOutcome:
        """Arbitrate one turn.

        ``message`` (or a pre-computed ``social`` reading) adds the social and
        pragmatic demand of papers 6-8: an indirect speech act costs more to
        misread, so it both raises the stakes and adds control demand that the
        value tables alone cannot express.

        ``affect_need`` adds the demand contributed by the affective system
        (threat bias, negative-mood pull, sickness withdrawal) - the body and
        its pathologies make control more urgent, not less.
        """
        state = state_index(context)
        # Paper 3: publish the context embedding so episodic retrieval and the
        # OFC map generalise across similar contexts.
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
        """Learn from a completed turn: the previous arbitration is credited with
        the *outcome* it produced."""
        pending = self._pending.get(session_id or "")
        if pending is None:
            state = state_index(context)
            if action_index is None:
                # Nothing was arbitrated for this session.  Pick the habit-
                # preferred action directly instead of running a full decide():
                # decide() commits to flexibility, ignites the workspace and
                # updates metacognition, so crediting a *fabricated* decision
                # polluted that state.
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
        # A turn cancelled before `observe` would otherwise leak its entry, so the
        # map is bounded (evicting the oldest pending turn is harmless - it merely
        # loses the credit for an abandoned arbitration).
        if len(self._pending) >= 512:
            self._pending.pop(next(iter(self._pending)), None)
        self._pending[session_id or ""] = {"state": outcome.state, "action": outcome.action_index}

    # ------------------------------------------------------------------- sleep
    def sleep_replay(self, steps: int = 120, goal_states: set[int] | None = None) -> dict:
        """Offline replay.  ``goal_states`` biases it toward the cues that matter
        now (Kumaran 2016 - goal-dependent weighting of experience statistics)."""
        return self.model.sleep_replay(steps, goal_states)

    def reconsolidate_recent(self, reward_new: float, next_cue: int) -> list[str]:
        """Reconsolidate the freshest traces against a newly observed outcome."""
        results = []
        for engram in self.model.engrams[-3:]:
            results.append(self.model.reconsolidate(engram, reward_new, next_cue))
        return results

    # -------------------------------------------------------------- inspection
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
            # --- circuit telemetry (papers 1-15) ---
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

    # ------------------------------------------------------------ persistence
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
        # `from_dict` builds a fresh config object; adopt it so later
        # `reconfigure` mutates the same object the model actually reads.
        self.config = self.model.config
