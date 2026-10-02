"""Additional neural circuits layered onto the multi-system model.

Each class implements the *computational claim* of one paper, not its biology.
Every docstring names the paper and the specific finding it encodes.

===========  ==================================================================
Paper        Circuit / mechanism
===========  ==================================================================
1            :class:`CogLinksArbiter` - MD arbitrates MF vs MB; model-free is an
             *outcome* of the model-based algorithm when context inference
             fails, giving slow overwriting of the strategy representation
2            :class:`DistributedEvidence` - computations are local and uneven,
             the choice is brain-wide and appears later
3            :class:`OFCValueMap` - OFC as an abstract, generalisable cognitive map
4            :class:`Prospection` (+ framing, retrospection) and
             :class:`Metacognition` - abstract future reward, not impulse control
5            :class:`CerebellarPredictor` - cerebellar output is necessary for
             RL-PE coding, while behaviour stays largely intact
6, 7, 8      :class:`SocialCoder` - compressed basis functions over interaction
             types, a two-part ToM, and pragmatics / communicative function
9, 10        :class:`GlobalWorkspace` - all-or-none, report-invariant ignition
             with a tonic component; five dynamically integrated circuits
11           :class:`GroupCoupling` - identification lifts individual (DLPFC)
             and collective (OFC) performance, bridged by their coupling
12           limbic bias in `MultiSystemModel.learn` / `sleep_replay` - limbic
             structures send twice what they receive, awake *and* asleep
13           :class:`SelfModel` - self-related thought about past and future,
             degrading with episodic-autobiographical memory
14           :class:`Flexibility` - set-shifting with a switch cost and a
             transdiagnostic profile
15           :class:`Metacognition` - context-based selection *plus* monitoring
             and adjustment of ongoing behaviour
===========  ==================================================================
"""
from __future__ import annotations

import math
from collections import deque
from dataclasses import dataclass, field

EPS = 1e-9


def _sigmoid(x: float) -> float:
    if x >= 0:
        return 1.0 / (1.0 + math.exp(-x))
    exponent = math.exp(x)
    return exponent / (1.0 + exponent)


def _entropy(probabilities: list[float]) -> float:
    return -sum(p * math.log(p) for p in probabilities if p > EPS)


def _normalised_entropy(probabilities: list[float], n_actions: int) -> float:
    denominator = math.log(n_actions) if n_actions > 1 else 1.0
    return min(1.0, _entropy(probabilities) / denominator)


def hebbian_gate(x: float) -> float:
    """``f_hebb(x) = [ (1 - e^(4-4x)) / (1 + e^(4-4x)) ]_+`` from paper 1."""
    z = (1.0 - math.exp(4.0 - 4.0 * x)) / (1.0 + math.exp(4.0 - 4.0 * x))
    return max(0.0, z)


# --------------------------------------------------------------------------
# 5. Cerebellum codes prediction error in reinforcement learning
# --------------------------------------------------------------------------
class CerebellarPredictor:
    """Forward model whose residual is the prediction error the forebrain uses.

    Paper 5 (human cerebellar stroke + TMS): learning of action-outcome
    associations stayed **intact** with only minor changes in behavioural
    flexibility, yet **no significant RL-PE processing** survived in the
    feedback-related negativity. So the cerebellum is not needed to learn - it
    is needed for the *prediction-error signal* that makes adaptation selective.
    That is exactly how this class is wired in: ablating it leaves TD learning
    working but removes surprise-driven encoding and the flexibility link.
    """

    def __init__(self, learning_rate: float = 0.25, window: int = 200):
        self.learning_rate = learning_rate
        self.predictions: dict[tuple[int, int], float] = {}
        self.residuals: deque[float] = deque(maxlen=window)

    def predict(self, state: int, action: int) -> float:
        return self.predictions.get((state, action), 0.0)

    def observe(self, state: int, action: int, reward: float) -> float:
        """Update the forward model and return the cerebellar prediction error."""
        predicted = self.predict(state, action)
        residual = float(reward) - predicted
        self.predictions[(state, action)] = predicted + self.learning_rate * residual
        self.residuals.append(residual)
        return residual

    def reliability(self) -> float:
        """1 when the forward model predicts well, 0 when it is all surprise."""
        if not self.residuals:
            return 0.0
        mean_abs = sum(abs(value) for value in self.residuals) / len(self.residuals)
        return 1.0 / (1.0 + mean_abs)

    def to_dict(self) -> dict:
        return {"predictions": {f"{s}:{a}": v for (s, a), v in self.predictions.items()},
                "residuals": list(self.residuals)}

    @classmethod
    def from_dict(cls, data: dict) -> "CerebellarPredictor":
        predictor = cls()
        for key, value in (data.get("predictions") or {}).items():
            state, action = key.split(":")
            predictor.predictions[(int(state), int(action))] = float(value)
        predictor.residuals = deque((float(v) for v in (data.get("residuals") or [])), maxlen=200)
        return predictor


# --------------------------------------------------------------------------
# 1. Thalamic (MD) regulation of reinforcement-learning strategies - CogLinks
# --------------------------------------------------------------------------
class CogLinksArbiter:
    """Mediodorsal thalamus arbitrating model-free against model-based control.

    Paper 1 findings encoded here:

    * the **lateral MD** couples to dorsal PFC and engages the *model-based*
      mode; the **medial MD** couples to ventral PFC and engages the
      *model-free* mode;
    * prefrontal transthalamic processing **rises during the shift from stable
      rule use to model-based updating**, with model-free at intermediate
      levels;
    * the CogLinks result: **model-free is not a separate algorithm** but an
      outcome of the same model-based algorithm when prefrontal-thalamic
      *context inference* fails, producing **slow overwriting of prefrontal
      strategy representations** (MB toggles between simultaneously held
      strategies; MF overwrites one slowly).

    The update rate follows the paper's formula
    ``eta_c = max{0.1, f_hebb(x_c^md) / (6 + N_c)}``.
    """

    def __init__(self, floor: float = 0.1, context_decay: float = 0.85, md_gain: float = 2.0):
        self.floor = float(floor)
        self.context_decay = float(context_decay)
        # ``f_hebb`` is flat at zero until its argument passes 1, so the normalised
        # lateral drive in [0, 1] is mapped onto the MD input scale [0, 2].
        self.md_gain = float(md_gain)
        self.context_inference = 1.0
        self.strategy: dict[str, list[float]] = {}
        self.counts: dict[str, int] = {}
        self.switches = 0

    def observe(self, surprise: float, switched: bool) -> None:
        """Context inference degrades with surprise and recovers while stable."""
        surprise = min(1.0, abs(float(surprise)))
        self.context_inference = max(0.0, min(1.0, self.context_decay * self.context_inference
                                               + (1.0 - self.context_decay) * (1.0 - surprise)))
        if switched:
            self.switches += 1

    def md_signals(self, need: float) -> tuple[float, float]:
        """``(lateral, medial)`` MD drive: lateral -> model-based, medial -> model-free."""
        lateral = max(0.0, min(1.0, self.context_inference * (0.35 + 0.65 * float(need))))
        return lateral, 1.0 - lateral

    def update_rate(self, context: str, lateral: float) -> float:
        """``eta_c = max{0.1, f_hebb(x_md) / (6 + N_c)}`` - decays with use."""
        return max(self.floor, hebbian_gate(self.md_gain * lateral) / (6.0 + self.counts.get(context, 0)))

    def update_strategy(self, context: str, target: list[float], lateral: float) -> float:
        """Overwrite the strategy representation at rate ``eta``; returns eta."""
        eta = self.update_rate(context, lateral)
        current = self.strategy.get(context)
        if current is None or len(current) != len(target):
            current = [0.0] * len(target)
        self.strategy[context] = [(1.0 - eta) * c + eta * t for c, t in zip(current, target)]
        self.counts[context] = self.counts.get(context, 0) + 1
        return eta

    def to_dict(self) -> dict:
        return {"context_inference": self.context_inference, "strategy": self.strategy,
                "counts": self.counts, "switches": self.switches}

    @classmethod
    def from_dict(cls, data: dict) -> "CogLinksArbiter":
        arbiter = cls()
        arbiter.context_inference = float(data.get("context_inference", 1.0))
        arbiter.strategy = {str(k): [float(v) for v in vals] for k, vals in (data.get("strategy") or {}).items()}
        arbiter.counts = {str(k): int(v) for k, v in (data.get("counts") or {}).items()}
        arbiter.switches = int(data.get("switches", 0))
        return arbiter


# --------------------------------------------------------------------------
# 3. OFC as a cognitive map: prediction, inference and generalisation
# --------------------------------------------------------------------------
class OFCValueMap:
    """Orbitofrontal value representation that generalises across similar states.

    Paper 3: OFC has moved from "value-signal encoder" to an **abstract
    cognitive map** used for prediction and inference, whose representations can
    be abstracted and generalised to serve immediate *and* future needs, much
    like the hippocampal map.  Identity matching (the toy-task default) is kept
    as the fallback when no features have been supplied.
    """

    def __init__(self, n_states: int, n_features: int = 8, temperature: float = 0.5,
                 floor: float = 0.5, persist: bool = True):
        self.n_states = int(n_states)
        self.n_features = int(n_features)
        self.temperature = temperature
        # Only genuinely close states transfer value.  Without a floor two
        # contexts that share nothing but "awake" would leak value into each
        # other, which is exactly the noise the review says the map avoids.
        self.floor = max(0.0, min(0.99, float(floor)))
        self.persist = bool(persist)
        self.features: dict[int, list[float]] = {}

    def set_features(self, state: int, vector: list[float]) -> None:
        self.features[int(state)] = [float(v) for v in vector[:self.n_features]]

    def similarity(self, a: int, b: int) -> float:
        """Cosine similarity in the map, gated by the generalisation floor.

        Identity returns 1.0; states whose cosine falls below ``floor`` return
        0.0, i.e. they are treated as unrelated rather than weakly related.
        """
        if a == b:
            return 1.0
        left, right = self.features.get(a), self.features.get(b)
        if not left or not right:
            return 0.0
        dot = sum(x * y for x, y in zip(left, right))
        norm = math.sqrt(sum(x * x for x in left)) * math.sqrt(sum(y * y for y in right))
        if norm <= EPS:
            return 0.0
        cosine = dot / norm
        if cosine <= self.floor:
            return 0.0
        return (cosine - self.floor) / (1.0 - self.floor)

    def generalise(self, state: int, known: dict[int, list[float]]) -> list[float]:
        """Infer a value vector for an unseen state from similar known states.

        This is the "inference" half of the cognitive map: the abstraction is
        what allows the map to serve states it has never experienced.
        """
        if state in known:
            return list(known[state])
        if not known:
            return []
        weights = [(self.similarity(state, other), values) for other, values in known.items()]
        weights = [(w, values) for w, values in weights if w > 0]
        if not weights:
            return []
        top = max(w for w, _ in weights)
        exps = [(math.exp((w - top) / max(self.temperature, EPS)), values) for w, values in weights]
        total = sum(e for e, _ in exps) or 1.0
        length = max(len(values) for _, values in exps)
        return [sum((e / total) * (values[index] if index < len(values) else 0.0)
                    for e, values in exps) for index in range(length)]

    def to_dict(self) -> dict:
        # Derived embeddings are recomputed from the state index on load, so
        # persisting all 216 x 16 floats would only bloat the save file.
        return {"features": {str(k): v for k, v in self.features.items()}} if self.persist else {}

    @classmethod
    def from_dict(cls, data: dict, n_states: int) -> "OFCValueMap":
        value_map = cls(n_states)
        for key, vector in (data.get("features") or {}).items():
            value_map.features[int(key)] = [float(v) for v in vector]
        return value_map


# --------------------------------------------------------------------------
# 4. Future-oriented decision making
# --------------------------------------------------------------------------
class Prospection:
    """Construction of abstract future reward values.

    Paper 4: prefrontal cortex contributes to future-oriented decisions **not by
    impulse control** but by *constructing and updating the value of abstract
    future rewards*, interacting with the reward system, prospection
    (hippocampus / temporal cortex), metacognition (frontopolar) and habitual
    behaviour (dorsal striatum).  The review also lists **framing** and
    **retrospection** as dissociable influences, both modelled here.
    """

    def __init__(self, horizon: int = 4, discount: float = 0.7):
        self.horizon = int(horizon)
        self.discount = float(discount)
        self.retrospection = 0.0

    def observe_outcome(self, reward: float, expected: float) -> None:
        """Retrospection: past outcomes bias the value of imagined futures."""
        self.retrospection = 0.8 * self.retrospection + 0.2 * (float(reward) - float(expected))

    def values(self, state: int, transition_fn, reward_fn, n_actions: int, framing: float = 1.0) -> list[float]:
        """Discounted imagined return of each action from `state`.

        ``Q_d(s,a) = sum_s' P(s'|s,a) * [r(s') + gamma * V_{d-1}(s')]`` with
        ``V_d(s) = max_a Q_d(s,a)``, memoised per ``(state, depth)``.  ``framing``
        scales the constructed value (gain vs loss framing) and the retrospective
        term is added uniformly.
        """
        memo: dict[tuple[int, int], float] = {}

        def best_value(current: int, depth: int) -> float:
            if depth <= 0:
                return 0.0
            key = (current, depth)
            if key in memo:
                return memo[key]
            value = max(self._action_value(current, action, depth, best_value, transition_fn, reward_fn)
                        for action in range(n_actions))
            memo[key] = value
            return value

        return [framing * self._action_value(state, action, self.horizon, best_value, transition_fn, reward_fn)
                + self.retrospection
                for action in range(n_actions)]

    def _action_value(self, state: int, action: int, depth: int, best_value, transition_fn, reward_fn) -> float:
        return sum(probability * (reward_fn(next_state) + self.discount * best_value(next_state, depth - 1))
                   for next_state, probability in transition_fn(state, action))

    def to_dict(self) -> dict:
        return {"retrospection": self.retrospection}

    @classmethod
    def from_dict(cls, data: dict) -> "Prospection":
        model = cls()
        model.retrospection = float(data.get("retrospection", 0.0))
        return model


class Metacognition:
    """Confidence monitoring and post-error adjustment.

    Paper 4 (frontopolar metacognition in future-oriented decisions) and paper
    15, whose abstract states cognitive control has two primary features: "the
    ability to select new behaviours based on context" and "the ability to
    monitor ongoing behaviour and adjust accordingly".  Confidence is the
    inverse normalised entropy of the policy; a large prediction error raises
    control demand on the next step (post-error slowing).
    """

    def __init__(self, n_actions: int, boost: float = 0.35, decay: float = 0.6):
        self.n_actions = max(2, int(n_actions))
        self.boost = boost
        self.decay = decay
        self.error_signal = 0.0
        self.history: deque[float] = deque(maxlen=50)

    def confidence(self, probabilities: list[float]) -> float:
        return max(0.0, min(1.0, 1.0 - _normalised_entropy(probabilities, self.n_actions)))

    def monitor(self, prediction_error: float, outcome_good: bool = True) -> float:
        """Track the error signal; returns the control adjustment to apply."""
        self.history.append(float(prediction_error))
        if not outcome_good or abs(prediction_error) > 0.5:
            self.error_signal = min(1.0, self.error_signal + self.boost * min(1.0, abs(prediction_error)))
        else:
            self.error_signal *= self.decay
        return self.adjustment()

    def adjustment(self) -> float:
        return self.error_signal

    def to_dict(self) -> dict:
        return {"error_signal": self.error_signal, "history": list(self.history)}

    @classmethod
    def from_dict(cls, data: dict, n_actions: int) -> "Metacognition":
        meta = cls(n_actions)
        meta.error_signal = float(data.get("error_signal", 0.0))
        meta.history = deque((float(v) for v in (data.get("history") or [])), maxlen=50)
        return meta


# --------------------------------------------------------------------------
# 6, 7, 8. Social cognition: basis functions, ToM split, pragmatics
# --------------------------------------------------------------------------
SOCIAL_BASIS: tuple[str, ...] = ("cooperation", "competition", "exchange", "instruction", "affiliation")
COMMUNICATIVE_FUNCTIONS: tuple[str, ...] = ("request", "promise", "question", "statement")

_SOCIAL_CUES: dict[str, tuple[str, ...]] = {
    "cooperation": ("一起", "合作", "配合", "共同", "帮", "组队", "搭把手", "team", "together", "cooperate"),
    "competition": ("比", "赢", "输", "竞争", "对抗", "谁更强", "pk", "beat", "compete", "versus"),
    "exchange": ("换", "交易", "报酬", "回报", "互换", "条件", "deal", "trade", "exchange", "in return"),
    "instruction": ("应该", "必须", "请", "要求", "命令", "规则", "务必", "不许", "must", "should", "require"),
    "affiliation": ("喜欢", "亲近", "朋友", "关心", "想念", "在乎", "陪", "friend", "care", "miss you"),
}

_COGNITIVE_TOM_CUES = ("认为", "以为", "知道", "相信", "觉得", "打算", "计划", "记得", "猜到",
                       "think", "believe", "know", "expect", "intend", "remember")
_AFFECTIVE_TOM_CUES = ("感受", "难过", "开心", "害怕", "担心", "在乎", "心情", "委屈", "感动",
                       "feel", "emotion", "afraid", "worry", "hurt", "happy", "sad")
_INDIRECT_CUES = ("能不能", "可以吗", "是不是", "要不", "方便的话", "如果可以", "也许", "大概",
                  "会不会", "要不要", "could you", "would you", "maybe", "perhaps", "if you don't mind",
                  "i wonder", "is it possible")
_FUNCTION_CUES: dict[str, tuple[str, ...]] = {
    "request": ("帮我", "请帮", "能不能", "可以帮我", "替我", "麻烦", "could you", "please", "can you"),
    "promise": ("我会", "我保证", "一定", "答应", "承诺", "i will", "i promise", "i'll"),
    "question": ("?", "？", "怎么", "为什么", "什么", "哪里", "如何", "吗", "what", "why", "how", "where"),
    "statement": (),
}


@dataclass
class SocialReading:
    """One reading of a message through the social circuits."""

    basis: dict = field(default_factory=dict)
    combinations: dict = field(default_factory=dict)
    cognitive_tom: float = 0.0
    affective_tom: float = 0.0
    indirectness: float = 0.0
    function: str = "statement"
    dominant: str = ""

    def to_dict(self) -> dict:
        return {"basis": {k: round(v, 3) for k, v in self.basis.items()},
                "combinations": {k: round(v, 3) for k, v in self.combinations.items()},
                "cognitive_tom": round(self.cognitive_tom, 3),
                "affective_tom": round(self.affective_tom, 3),
                "indirectness": round(self.indirectness, 3),
                "function": self.function, "dominant": self.dominant}


class SocialCoder:
    """Social basis functions, a two-part theory of mind, and pragmatics.

    Paper 6: dmPFC/ACC represent the **combinatorial possibilities** for social
    interaction "in a compressed format resembling the basis functions used in
    spatial, visual and motor domains", and those basis functions "align with
    social interaction types, as opposed to individual identities".  Basis
    functions "reduce the dimensionality by representing a limited set of
    feature dimensions" that can be combined **linearly** - so a social situation
    here is a coefficient vector over interaction types plus its pairwise
    combinations, never a per-person table.

    Paper 7: theory of mind is not one ability but several subsystems with
    cognitive and affective components - kept separate below.

    Paper 8: mentalising regions support **direct and indirect** speech acts, and
    the same areas fire for communicative *functions* (requests, promises,
    questions) even when expressed directly - hence both axes are reported.
    """

    def encode(self, text: str) -> SocialReading:
        lowered = str(text or "").lower()
        raw = {}
        for name, cues in _SOCIAL_CUES.items():
            hits = sum(1 for cue in cues if cue in lowered)
            raw[name] = hits / (hits + 1.0) if hits else 0.0
        total = sum(raw.values())
        basis = {name: (value / total if total else 1.0 / len(SOCIAL_BASIS)) for name, value in raw.items()}
        # Combinatorial possibilities: pairwise co-activation of interaction types.
        names = [name for name in SOCIAL_BASIS if raw.get(name, 0.0) > 0.0]
        combinations = {}
        for index, left in enumerate(names):
            for right in names[index + 1:]:
                combinations[f"{left}+{right}"] = round(math.sqrt(raw[left] * raw[right]), 4)
        cognitive = min(1.0, sum(1 for cue in _COGNITIVE_TOM_CUES if cue in lowered) / 3.0)
        affective = min(1.0, sum(1 for cue in _AFFECTIVE_TOM_CUES if cue in lowered) / 3.0)
        indirect = min(1.0, sum(1 for cue in _INDIRECT_CUES if cue in lowered) / 2.0)
        function = "statement"
        for name, cues in _FUNCTION_CUES.items():
            if name == "statement":
                continue
            if any(cue in lowered for cue in cues):
                function = name
                break
        dominant = max(raw, key=lambda name: raw[name]) if total else ""
        return SocialReading(basis=basis, combinations=combinations, cognitive_tom=cognitive,
                             affective_tom=affective, indirectness=indirect, function=function,
                             dominant=dominant)

    @staticmethod
    def control_demand(reading: SocialReading) -> float:
        """Indirect speech acts and mentalising load raise the control demand.

        An indirect request ("could you possibly...") needs inference about the
        speaker's intention, which is what the mentalising system is for.
        """
        function_load = 0.15 if reading.function in ("request", "promise") else 0.0
        combination_load = 0.1 * min(1.0, len(reading.combinations) / 2.0)
        return min(1.0, 0.45 * reading.indirectness
                   + 0.25 * max(reading.cognitive_tom, reading.affective_tom)
                   + function_load + combination_load)


# --------------------------------------------------------------------------
# 9, 10. Consciousness: all-or-none ignition and multi-circuit integration
# --------------------------------------------------------------------------
CIRCUITS: tuple[str, ...] = ("sensory", "perceptual", "cognitive", "affective", "reflective")


@dataclass
class Ignition:
    """Whether a representation gained conscious access, and how integrated it is."""

    ignited: bool
    activation: float
    tonic: float
    integration: float
    dominant: str

    def to_dict(self) -> dict:
        return {"ignited": self.ignited, "activation": round(self.activation, 3),
                "tonic": round(self.tonic, 3), "integration": round(self.integration, 3),
                "dominant": self.dominant}


class GlobalWorkspace:
    """All-or-none, report-invariant conscious access over five circuits.

    Paper 9: the somatosensory NCC showed **tonic** (sustained) responses in
    posterior perisylvian regions that were **invariant to reporting**, showed an
    **all-or-nothing** pattern at threshold, and diverged most between perceived
    and non-perceived stimuli.  Paper 10 (multi-circuit theory): consciousness is
    the dynamic integration of five core circuits - sensory, perceptual,
    cognitive, affective and reflective - each mapping onto a behavioural domain.

    The tonic component is what makes access *sustained* rather than momentary,
    and ignition is decided on that sustained signal (report is never an input,
    which is how report-invariance is enforced by construction).
    """

    def __init__(self, threshold: float = 0.5, tonic_leak: float = 0.6):
        self.threshold = float(threshold)
        self.tonic_leak = float(tonic_leak)
        self.tonic = 0.0

    def ignite(self, activations: dict[str, float]) -> Ignition:
        values = {name: max(0.0, min(1.0, float(activations.get(name, 0.0)))) for name in CIRCUITS}
        instantaneous = sum(values.values()) / len(CIRCUITS)
        self.tonic = self.tonic_leak * self.tonic + (1.0 - self.tonic_leak) * instantaneous
        spread = max(values.values()) - min(values.values())
        integration = max(0.0, 1.0 - spread)
        dominant = max(values, key=lambda name: values[name])
        return Ignition(ignited=self.tonic >= self.threshold, activation=instantaneous,
                        tonic=self.tonic, integration=integration, dominant=dominant)

    def to_dict(self) -> dict:
        return {"tonic": self.tonic}

    @classmethod
    def from_dict(cls, data: dict) -> "GlobalWorkspace":
        workspace = cls()
        workspace.tonic = float(data.get("tonic", 0.0))
        return workspace


# --------------------------------------------------------------------------
# 13. Self-related thought tied to autobiographical episodic memory
# --------------------------------------------------------------------------
class SelfModel:
    """Self-referential processing grounded in episodic-autobiographical memory.

    Paper 13: in mild cognitive impairment, self-related thought is reduced, and
    specifically the components concerning **personal past experiences and future
    thinking**.  The change tracked hdEEG microstate C (self-related) and was
    localised to episodic-autobiographical memory and the default-mode network.
    So self-reference is not a fixed trait: it degrades with the episodic store,
    and it has a retrospective and a prospective half.
    """

    def __init__(self, threshold: float = 0.4):
        self.threshold = float(threshold)
        self.self_thought = 1.0
        self.past = 1.0
        self.future = 1.0
        # The paper contrasts patients with healthy controls, so impairment is a
        # *decline* from this agent's own episodic baseline - a brand-new agent
        # with an empty store is not "impaired".
        self.baseline = 0.0

    def update(self, engram_count: int, engram_strength: float, episodic_target: int = 40,
               retrospection: float = 0.5, prospection: float = 0.5) -> float:
        availability = (min(1.0, engram_count / max(1, episodic_target))
                        * min(1.0, engram_strength / max(1, episodic_target)))
        self.baseline = max(self.baseline * 0.995, availability)
        relative = availability / self.baseline if self.baseline > EPS else 1.0
        self.past = relative * float(retrospection)
        self.future = relative * float(prospection)
        self.self_thought = _sigmoid(8.0 * (0.5 * (self.past + self.future) - self.threshold))
        return self.self_thought

    def microstate(self) -> str:
        """Microstate C when self-related thought dominates, A when it does not."""
        return "C" if self.self_thought >= 0.5 else "A"

    def reference_weight(self) -> float:
        """How strongly first-person framing should colour the response."""
        return self.self_thought

    def to_dict(self) -> dict:
        return {"self_thought": self.self_thought, "past": self.past, "future": self.future,
                "baseline": self.baseline}

    @classmethod
    def from_dict(cls, data: dict) -> "SelfModel":
        model = cls()
        model.self_thought = float(data.get("self_thought", 1.0))
        model.past = float(data.get("past", 1.0))
        model.future = float(data.get("future", 1.0))
        model.baseline = float(data.get("baseline", 0.0))
        return model


# --------------------------------------------------------------------------
# 11. Group identification couples control and value
# --------------------------------------------------------------------------
class GroupCoupling:
    """Group identity lifts both individual and collective performance.

    Paper 11: high-identification groups performed better **individually**
    (dorsolateral prefrontal cortex) *and* **collectively**, the latter supported
    by within-group neural synchronisation in the **orbitofrontal cortex**, with
    **DLPFC-OFC connectivity** linking the two levels.  So identification scales
    the control pathway, the value pathway, and the bridge between them.
    """

    def __init__(self, base: float = 1.0, span: float = 0.5):
        self.base = float(base)
        self.span = float(span)
        self.identities: dict[str, float] = {}

    def identify(self, group_id: str, strength: float) -> None:
        if not group_id:
            return
        current = self.identities.get(group_id, 0.0)
        self.identities[group_id] = max(0.0, min(1.0, 0.7 * current + 0.3 * float(strength)))

    def coupling(self, group_id: str = "") -> float:
        """Bridge strength applied to the control modes (DLPFC-OFC coupling)."""
        return self.base + self.span * self.identities.get(group_id or "", 0.0)

    def profile(self, group_id: str = "") -> dict:
        """The three quantities the paper separates."""
        strength = self.identities.get(group_id or "", 0.0)
        return {"individual": 1.0 + 0.3 * strength,
                "collective": 1.0 + 0.5 * strength,
                "bridge": self.base + self.span * strength}

    def to_dict(self) -> dict:
        return {"identities": dict(self.identities)}

    @classmethod
    def from_dict(cls, data: dict) -> "GroupCoupling":
        coupling = cls()
        coupling.identities = {str(k): float(v) for k, v in (data.get("identities") or {}).items()}
        return coupling


# --------------------------------------------------------------------------
# 14. Cognitive flexibility: set-shifting with a switch cost
# --------------------------------------------------------------------------
# Transdiagnostic profiles (paper 14): flexibility is reduced across mood
# disorders, schizophrenia and autism spectrum disorders.
FLEXIBILITY_PROFILES: dict[str, float] = {
    "typical": 0.6, "depression": 0.40, "schizophrenia": 0.32, "asd": 0.45,
}


class Flexibility:
    """Set-shifting between control modes, with a switch cost.

    Paper 14: cognitive flexibility is a core executive function and a promising
    **transdiagnostic marker** for mood disorders, schizophrenia and ASD.  A less
    flexible system pays more to change set, which is exactly what makes it
    perseverate on the previous mode.
    """

    def __init__(self, flexibility: float = 0.6, base_cost: float = 0.35):
        self.flexibility = max(0.0, min(1.0, float(flexibility)))
        self.base_cost = float(base_cost)
        self.previous_mode = ""

    def set_profile(self, name: str) -> float:
        self.flexibility = FLEXIBILITY_PROFILES.get(str(name), self.flexibility)
        return self.flexibility

    def switch_cost(self, mode: str) -> float:
        if not self.previous_mode or self.previous_mode == mode:
            return 0.0
        return self.base_cost * (1.0 - self.flexibility)

    def commit(self, mode: str) -> None:
        self.previous_mode = mode

    def adapt(self, success: bool) -> None:
        """Repeated success raises flexibility; repeated failure lowers it."""
        self.flexibility = max(0.05, min(1.0, self.flexibility + (0.03 if success else -0.03)))

    def to_dict(self) -> dict:
        return {"flexibility": self.flexibility, "previous_mode": self.previous_mode}

    @classmethod
    def from_dict(cls, data: dict) -> "Flexibility":
        flex = cls()
        flex.flexibility = float(data.get("flexibility", 0.6))
        flex.previous_mode = str(data.get("previous_mode", ""))
        return flex


# --------------------------------------------------------------------------
# 2. Distributed decision-making
# --------------------------------------------------------------------------
@dataclass
class DistributedReadout:
    """Local computations versus the distributed choice (paper 2)."""

    computations: dict = field(default_factory=dict)
    choice: float = 0.0
    latency: float = 0.0
    breadth: float = 0.0

    def to_dict(self) -> dict:
        return {"computations": {k: round(v, 3) for k, v in self.computations.items()},
                "choice": round(self.choice, 3), "latency": round(self.latency, 3),
                "breadth": round(self.breadth, 3)}


class DistributedEvidence:
    """Decision signals are distributed rather than local to one circuit.

    Paper 2: high-frequency activity carries both *choice-related computations*
    (risk, win probability) and *choice* itself, but they differ in prevalence and
    regional representation - **computations are locally and unevenly present**,
    whereas **choice information is widely distributed and appears later** across
    all regions examined.  The readout below keeps that distinction: per-module
    uncertainty is the local computation, and agreement across modules is the
    later, distributed choice.
    """

    @staticmethod
    def read(distributions: dict[str, list[float]]) -> DistributedReadout:
        # A module with an empty action distribution carries no evidence; drop it
        # so ``max()`` / ``range(0)`` cannot raise on the empty sequence.
        distributions = {module: probs for module, probs in (distributions or {}).items() if probs}
        if not distributions:
            return DistributedReadout()
        n_actions = max(len(probs) for probs in distributions.values())
        computations = {module: round(_normalised_entropy(probs, n_actions), 4)
                        for module, probs in distributions.items()}
        preferred = [max(range(len(probs)), key=lambda index: probs[index]) for probs in distributions.values()]
        counts: dict[int, int] = {}
        for action in preferred:
            counts[action] = counts.get(action, 0) + 1
        choice = max(counts.values()) / len(preferred)
        breadth = len(counts) / max(1, len(preferred))
        # A weakly distributed choice takes longer to coalesce.
        latency = 1.0 - choice
        return DistributedReadout(computations=computations, choice=choice, latency=latency, breadth=breadth)

    # Backwards-compatible scalar summary.
    @staticmethod
    def index(distributions: dict[str, list[float]]) -> dict:
        readout = DistributedEvidence.read(distributions)
        return {"agreement": readout.choice, "latency": readout.latency, "breadth": readout.breadth}
