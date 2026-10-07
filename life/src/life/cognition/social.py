"""Social cognition, learning and ties - wave 4a.

Wave 1 (``circuits.py``) covered decision-making, social cognition, consciousness
and control; wave 2 (``affect.py``) the body and its pathology; wave 3
(``language.py``) language acquisition and the language-thought interface.  This
module covers the **social** half of wave 4: how a persona learns from others,
forms ties, takes another's perspective and becomes prosocial.

As always: each class implements the *computational claim*, not the biology, and
every circuit is gated by a flag on :class:`SocialConfig`.

============================  =================================================
Paper                         Circuit / mechanism
============================  =================================================
19 - Colas et al., ICLR 2026  :class:`SocialLearning` - social learning is
                              **joint Bayesian inference** over a world model
                              given sensorimotor data *and* linguistic advice;
                              advice is evidence with a precision, not a command
20 - arXiv 2603.13876 (ACL)   :class:`RoleModelLearning` - exemplar-driven moral
                              learning: identity-driven conformity to a role
                              model shapes individual and collective morality
21 - arXiv (Learning to Make  :class:`SocialTies` - ties emerge from repeated
     Friends)                 interaction + mutual evaluation + coaching,
                              driven by homophily, reciprocity and validation
1, 2, 3 - MetaMind / altruism  :class:`ProsocialAlignment` - altruism from
     / ToM for context        empathising and self-imagination: infer the
                              other's state, simulate oneself in their shoes,
                              then weight their welfare into the objective
12, 14, 15 - Selman / SocialAI :class:`PerspectiveTaking` - developmental
     / downplaying           stages of perspective taking, and the ability to
                              *downplay* one's competence to fit a persona
22, 23, 24 - anhedonia / Motif :class:`IntrinsicMotivation` - intrinsic reward
     / reward-punishment      from AI feedback, the ego as the reward-punishment
                              engine, and blunted anticipation flipping effort
                              choices toward low-effort/low-reward
============================  =================================================
"""
from __future__ import annotations

import math
from collections import defaultdict, deque
from dataclasses import dataclass, field
from .common import clamp as _clamp

EPS = 1e-9




def _softmax(scores: dict) -> dict:
    if not scores:
        return {}
    top = max(scores.values())
    exps = {k: math.exp(v - top) for k, v in scores.items()}
    total = sum(exps.values()) or 1.0
    return {k: v / total for k, v in exps.items()}


def _entropy(probabilities) -> float:
    return -sum(p * math.log(p) for p in probabilities if p > EPS)


def _restore_key(key):
    """Undo JSON's int-key coercion.

    ``json`` only allows string object keys, so an integer hypothesis id such as
    ``2`` is written as ``"2"`` and comes back as a *string*.  A reloaded learner
    would then carry ``"2"`` while every caller keeps passing ``2`` - the two
    never meet, so fresh experience and advice would be silently dropped.  Any
    numeric-looking key is therefore turned back into an ``int``; non-numeric
    keys (named hypotheses) are left untouched.
    """
    if isinstance(key, str):
        try:
            return int(key)
        except ValueError:
            return key
    return key


# ==========================================================================
# 19. Social learning: language guidance + direct experience
# ==========================================================================
class SocialLearning:
    """Combine linguistic advice with direct experience by Bayesian inference.

    Colas et al. model social learning as **joint probabilistic inference** over
    a structured, executable world model given sensorimotor *and* linguistic
    data.  The key move is that advice is not a command - it is **evidence** with
    its own precision, so it can be overridden by enough direct experience.  The
    payoff they measure is a reduction in risky exploration.

    Implemented as a precision-weighted log-opinion pool over a hypothesis space
    (which action is the right one)::

        log posterior  ∝  log prior + w_exp · log experience + w_adv · log advice
    """

    def __init__(self, hypotheses=None, advice_precision: float = 0.5,
                 experience_precision: float = 0.6):
        self.hypotheses = list(hypotheses or range(4))
        self.advice_precision = _clamp(advice_precision)
        self.experience_precision = _clamp(experience_precision)
        self.prior = {h: 1.0 / len(self.hypotheses) for h in self.hypotheses}
        self.experience_counts: dict = defaultdict(float)
        self.advice_received = 0
        self.experience_seen = 0
        self.transmitted = 0

    def _normalise(self, distribution: dict) -> dict:
        total = sum(distribution.values()) or 1.0
        return {h: distribution.get(h, 0.0) / total for h in self.hypotheses}

    def posterior(self) -> dict:
        """Current belief: prior pooled with experience and any advice."""
        log_belief = {h: math.log(self.prior.get(h, EPS)) for h in self.hypotheses}
        if self.experience_seen:
            for h in self.hypotheses:
                share = self.experience_counts.get(h, 0.0) / max(EPS, self.experience_seen)
                log_belief[h] += self.experience_precision * math.log(share + EPS)
        if self.advice_received:
            for h in self.hypotheses:
                share = self._advice.get(h, 0.0)
                log_belief[h] += self.advice_precision * math.log(share + EPS)
        return _softmax(log_belief)

    def observe_experience(self, hypothesis, outcome: float = 1.0) -> dict:
        """Direct experience: a likelihood over the hypothesis space."""
        self.experience_counts[hypothesis] += max(0.0, float(outcome))
        self.experience_seen += 1
        return self.posterior()

    def receive_advice(self, advice: dict, trust: float = 1.0) -> dict:
        """Linguistic guidance enters as evidence, weighted by how much we trust it."""
        self._advice = {h: float(advice.get(h, 0.0)) for h in self.hypotheses}
        total = sum(self._advice.values()) or 1.0
        self._advice = {h: v / total for h, v in self._advice.items()}
        self.advice_received += 1
        self.advice_precision = _clamp(trust)
        return self.posterior()

    def best(self):
        posterior = self.posterior()
        return max(posterior, key=posterior.get)

    @property
    def certainty(self) -> float:
        """1 when the belief is a point mass, 0 when it is uniform."""
        posterior = self.posterior()
        n = len(self.hypotheses)
        if n < 2:
            return 1.0
        return _clamp(1.0 - _entropy(posterior.values()) / math.log(n))

    def risk_reduction(self, before: dict | None = None) -> float:
        """How much the advice sharpened the belief (the paper's payoff measure)."""
        prior_entropy = _entropy(self.prior.values())
        now = _entropy(self.posterior().values())
        if prior_entropy <= EPS:
            return 0.0
        return _clamp((prior_entropy - now) / prior_entropy)

    def transmit(self) -> dict:
        """Pass the current belief on as advice to a 'next generation' learner."""
        self.transmitted += 1
        return dict(self.posterior())

    def to_dict(self) -> dict:
        return {"prior": dict(self.prior), "experience_counts": dict(self.experience_counts),
                "experience_seen": self.experience_seen, "advice_received": self.advice_received,
                "advice": dict(getattr(self, "_advice", {})),
                "advice_precision": self.advice_precision, "transmitted": self.transmitted}

    @classmethod
    def from_dict(cls, data: dict) -> "SocialLearning":
        # Keys may have travelled through JSON, which stringifies int ids; put
        # the original type back so the reloaded learner still speaks the same
        # hypothesis ids as its callers (see _restore_key).
        prior = {_restore_key(k): float(v) for k, v in (data.get("prior") or {}).items()}
        obj = cls(hypotheses=list(prior) or None,
                  advice_precision=float(data.get("advice_precision", 0.5)))
        obj.prior = prior or obj.prior
        obj.experience_counts = defaultdict(
            float, {_restore_key(k): float(v) for k, v in (data.get("experience_counts") or {}).items()})
        obj.experience_seen = int(data.get("experience_seen", 0))
        obj.advice_received = int(data.get("advice_received", 0))
        obj._advice = {_restore_key(k): float(v) for k, v in (data.get("advice") or {}).items()}
        obj.transmitted = int(data.get("transmitted", 0))
        return obj


# ==========================================================================
# 20. Role models and exemplar-driven moral learning
# ==========================================================================
class RoleModelLearning:
    """Exemplar-driven moral learning: we become what we identify with.

    The ACL 2026 multi-agent study finds that role models shape collective
    morality through **identity-driven conformity** - agents shift their moral
    stance toward the exemplar they identify with, and the shift propagates.
    The computation is a pull toward an exemplar, scaled by identification and
    by how much of the group already endorses that stance.
    """

    def __init__(self, stance: float = 0.5, identification: float = 0.5,
                 conformity: float = 0.4):
        self.stance = _clamp(stance)
        self.identification = _clamp(identification)
        self.conformity = _clamp(conformity)
        self.exemplars: dict[str, float] = {}
        self.exemplar_weight: dict[str, float] = {}
        self.influence_history: deque[float] = deque(maxlen=200)

    def identify(self, exemplar: str, strength: float) -> None:
        """Attach to a role model; stronger identification means a stronger pull."""
        self.exemplar_weight[exemplar] = _clamp(strength)

    def observe(self, exemplar: str, stance: float) -> None:
        self.exemplars[exemplar] = _clamp(stance)

    def pull(self, group_fraction: float = 0.0) -> float:
        """Total force on the agent's stance from exemplars and group conformity."""
        force = 0.0
        for name, weight in self.exemplar_weight.items():
            if name in self.exemplars:
                force += weight * self.identification * (self.exemplars[name] - self.stance)
        force += self.conformity * (group_fraction - self.stance)
        return force

    def adopt(self, group_fraction: float = 0.0, rate: float = 0.3) -> float:
        """Move toward the exemplars; returns the new stance."""
        delta = self.pull(group_fraction)
        self.stance = _clamp(self.stance + rate * delta)
        self.influence_history.append(delta)
        return self.stance

    @property
    def conformed(self) -> float:
        """How far the stance has travelled from a neutral 0.5."""
        return abs(self.stance - 0.5) * 2.0

    def to_dict(self) -> dict:
        return {"stance": self.stance, "identification": self.identification,
                "conformity": self.conformity, "exemplars": dict(self.exemplars),
                "exemplar_weight": dict(self.exemplar_weight)}

    @classmethod
    def from_dict(cls, data: dict) -> "RoleModelLearning":
        obj = cls(stance=float(data.get("stance", 0.5)),
                  identification=float(data.get("identification", 0.5)),
                  conformity=float(data.get("conformity", 0.4)))
        obj.exemplars = {k: float(v) for k, v in (data.get("exemplars") or {}).items()}
        obj.exemplar_weight = {k: float(v) for k, v in (data.get("exemplar_weight") or {}).items()}
        return obj


# ==========================================================================
# 21. Emergent social ties
# ==========================================================================
class SocialTies:
    """Ties emerge from repeated interaction, mutual evaluation and coaching.

    The "Learning to Make Friends" framework has agents repeatedly interact,
    evaluate one another and adapt through in-context learning accelerated by a
    **coaching signal**, with behavioural rewards for interaction, information
    seeking, self-presentation, coordination and emotional support.  The
    dynamics it reproduces are the classic ones: **homophily**, **reciprocity**
    and **social validation**.
    """

    def __init__(self, homophily_weight: float = 0.3, reciprocity: float = 0.5):
        self.homophily_weight = homophily_weight
        self.reciprocity = _clamp(reciprocity)
        self.ties: dict[str, float] = {}
        self.interactions: dict[str, int] = {}
        self.evaluations: dict[str, deque] = defaultdict(lambda: deque(maxlen=20))
        self.traits: dict[str, dict] = {}
        self.coached: set[str] = set()

    def describe(self, partner: str, traits: dict) -> None:
        """Register a partner's traits so homophily can be computed."""
        self.traits[partner] = {k: float(v) for k, v in (traits or {}).items()}

    def homophily(self, partner: str) -> float:
        """Similarity between self-traits and a partner's, in [0, 1]."""
        mine, theirs = self.traits.get("__self__", {}), self.traits.get(partner, {})
        shared = set(mine) & set(theirs)
        if not shared:
            return 0.5
        return _clamp(1.0 - sum(abs(mine[k] - theirs[k]) for k in shared) / len(shared))

    def evaluate(self, partner: str, quality: float) -> None:
        self.evaluations[partner].append(_clamp(quality))

    def received_evaluation(self, partner: str, quality: float) -> None:
        """The partner's evaluation of *us* - ties are reciprocal."""
        self.evaluations[f"__from__{partner}"].append(_clamp(quality))

    def interact(self, partner: str, quality: float) -> float:
        """One interaction: update the tie from quality, reciprocity and homophily."""
        self.interactions[partner] = self.interactions.get(partner, 0) + 1
        self.evaluate(partner, quality)
        mine = sum(self.evaluations[partner]) / len(self.evaluations[partner])
        theirs = self.evaluations.get(f"__from__{partner}")
        other = (sum(theirs) / len(theirs)) if theirs else mine
        reciprocal = self.reciprocity * other
        homophily = self.homophily(partner)
        target = _clamp(0.6 * mine + 0.4 * reciprocal + self.homophily_weight * homophily)
        previous = self.ties.get(partner, 0.0)
        # ties build up gradually over repeated interaction.  The drift term is
        # *signed*: an unconditional +0.05 meant even hostile, zero-quality
        # interactions only ever raised the tie (floor ~0.17), so a bad
        # relationship could never recover downward.
        drift = 0.05 * (2.0 * _clamp(float(quality)) - 1.0)
        self.ties[partner] = _clamp(previous + 0.3 * (target - previous) + drift)
        return self.ties[partner]

    def coach(self, partner: str, signal: float) -> float:
        """A coaching signal accelerates tie formation (the paper's accelerator)."""
        self.coached.add(partner)
        self.ties[partner] = _clamp(self.ties.get(partner, 0.0) + 0.4 * max(0.0, signal))
        return self.ties[partner]

    def decay(self, amount: float = 0.05, partners: list[str] | None = None) -> int:
        """Let ties fade when nothing sustains them.

        A tie is not a high-water mark: without contact it should sag, otherwise
        "who I am close to" degrades into a list of everyone I have ever met.
        ``interact`` alone cannot express this - a single quiet day barely moves
        the running mean it adapts toward.
        """
        targets = list(self.ties) if partners is None else [p for p in partners if p in self.ties]
        step = max(0.0, float(amount))
        for partner in targets:
            self.ties[partner] = _clamp(self.ties.get(partner, 0.0) - step)
        return len(targets)

    @property
    def validated(self) -> float:
        """Social validation: mean tie strength across partners."""
        if not self.ties:
            return 0.0
        return sum(self.ties.values()) / len(self.ties)

    def friends(self, threshold: float = 0.5) -> list[tuple[str, float]]:
        return sorted(((p, t) for p, t in self.ties.items() if t >= threshold),
                      key=lambda kv: kv[1], reverse=True)

    def to_dict(self) -> dict:
        # The per-partner evaluation history is part of the state: without it a
        # reloaded persona would forget how the tie was built and recompute the
        # reciprocal term from scratch.
        return {"ties": dict(self.ties), "interactions": dict(self.interactions),
                "evaluations": {k: list(v) for k, v in self.evaluations.items()},
                "traits": self.traits, "coached": sorted(self.coached)}

    @classmethod
    def from_dict(cls, data: dict) -> "SocialTies":
        obj = cls()
        obj.ties = {k: float(v) for k, v in (data.get("ties") or {}).items()}
        obj.interactions = {k: int(v) for k, v in (data.get("interactions") or {}).items()}
        obj.evaluations = defaultdict(
            lambda: deque(maxlen=20),
            {k: deque((float(x) for x in values), maxlen=20)
             for k, values in (data.get("evaluations") or {}).items()})
        obj.traits = data.get("traits") or {}
        obj.coached = set(data.get("coached") or [])
        return obj


# ==========================================================================
# 1, 2, 3. Prosocial alignment via ToM and self-imagination
# ==========================================================================
class ProsocialAlignment:
    """Altruism from empathising and self-imagination, not from rules.

    MetaMind decomposes social understanding into three stages - a Theory-of-Mind
    agent hypothesises the other's mental state, a moral agent applies social
    norms, and a response agent generates and self-verifies.  The altruism paper
    adds the mechanism that produces the *motivation*: **self-imagination** -
    simulating what one would feel in the other's situation - which is what turns
    an inference about someone else into a weight on one's own objective.
    """

    def __init__(self, empathy_weight: float = 0.4, norm_strength: float = 0.5):
        self.empathy_weight = _clamp(empathy_weight)
        self.norm_strength = _clamp(norm_strength)
        self.inferred: dict = {}
        self.self_imagination: float = 0.0
        self.flagged: list[str] = []

    def infer_state(self, observable: dict) -> dict:
        """Stage 1: hypothesise the other's intent / emotion from what is visible."""
        intent = str((observable or {}).get("intent") or "unknown")
        emotion = float((observable or {}).get("emotion", 0.0) or 0.0)
        need = float((observable or {}).get("need", 0.0) or 0.0)
        self.inferred = {"intent": intent, "emotion": emotion, "need": need}
        return dict(self.inferred)

    def self_imagine(self, own_state: dict, other_situation: dict) -> float:
        """Simulate one's own affective response if placed in the other's shoes."""
        # `or 0.5` would turn a genuinely indifferent 0.0 into 0.5 (0.0 is
        # falsy), so only None falls back to the neutral default.
        sensitivity = (own_state or {}).get("sensitivity", 0.5)
        own_sensitivity = 0.5 if sensitivity is None else float(sensitivity)
        severity = float((other_situation or {}).get("severity", 0.0) or 0.0)
        self.self_imagination = _clamp(own_sensitivity * severity)
        return self.self_imagination

    @property
    def empathy(self) -> float:
        """Combined empathic signal: inference plus imagined feeling."""
        need = float(self.inferred.get("need", 0.0) or 0.0)
        return _clamp(0.5 * need + 0.5 * self.self_imagination)

    def align(self, own_utility: float, other_utility: float,
              weight: float | None = None) -> float:
        """Stage 2/3: fold the other's welfare into the objective."""
        w = self.empathy_weight if weight is None else _clamp(weight)
        w = _clamp(w * (0.5 + 0.5 * self.empathy))
        return (1.0 - w) * float(own_utility) + w * float(other_utility)

    def moral_check(self, action: str, own_gain: float, other_loss: float) -> bool:
        """Flag a self-serving action whose cost to the other exceeds the norm."""
        harmful = other_loss > own_gain * self.norm_strength and other_loss > 0.0
        if harmful:
            self.flagged.append(str(action))
        return harmful

    def to_dict(self) -> dict:
        return {"empathy_weight": self.empathy_weight, "norm_strength": self.norm_strength,
                "inferred": self.inferred, "self_imagination": self.self_imagination,
                "flagged": list(self.flagged)}

    @classmethod
    def from_dict(cls, data: dict) -> "ProsocialAlignment":
        obj = cls(empathy_weight=float(data.get("empathy_weight", 0.4)),
                  norm_strength=float(data.get("norm_strength", 0.5)))
        obj.inferred = data.get("inferred") or {}
        obj.self_imagination = float(data.get("self_imagination", 0.0))
        obj.flagged = list(data.get("flagged") or [])
        return obj


# ==========================================================================
# 12, 14, 15. Developmental perspective taking
# ==========================================================================
# Selman's stages of perspective taking.
SELMAN_STAGES = {
    0: "egocentric",             # cannot distinguish own view from another's
    1: "subjective",             # knows others differ, but cannot reason about it
    2: "self-reflective",        # can take another's view and knows they do the same
    3: "mutual",                 # can coordinate both views simultaneously
    4: "societal-symbolic",      # reasons about the shared, societal perspective
}


class PerspectiveTaking:
    """Developmental stages of perspective taking, and deliberate downplaying.

    "Growing Perspectives" grounds an LLM director task in **Selman's stages**:
    GPT reliably produces narratives consistent with a *specified* developmental
    stage, and the stage changes collaborative performance.  The false-belief
    study adds that models can **downplay** their competence to fit a child
    persona - so the reported ability is a *setting*, not a ceiling.

    The computation that matters is that stage 0-1 agents report their *own*
    knowledge (failing false-belief tasks) while stage >= 2 report the *other's*
    belief - which is exactly the developmental milestone.
    """

    def __init__(self, stage: int = 2):
        self.stage = int(max(0, min(4, stage)))
        self.downplayed_to: int | None = None

    @property
    def effective_stage(self) -> int:
        """The stage actually expressed (downplaying lowers it)."""
        if self.downplayed_to is None:
            return self.stage
        return min(self.stage, self.downplayed_to)

    @property
    def name(self) -> str:
        return SELMAN_STAGES.get(self.effective_stage, "unknown")

    def downplay(self, target_stage: int) -> int:
        """Deliberately perform below one's competence to fit a persona."""
        self.downplayed_to = int(max(0, min(4, target_stage)))
        return self.effective_stage

    def restore(self) -> int:
        self.downplayed_to = None
        return self.stage

    def false_belief(self, actual: str, believed: str, question: str = "location") -> str:
        """Predict the answer to a false-belief task at the current stage.

        Below stage 2 the agent answers from its own knowledge (the classic
        failure); at stage 2 and above it answers from the other's belief.
        """
        if self.effective_stage < 2:
            return actual
        return believed

    def passes_false_belief(self, actual: str, believed: str) -> bool:
        return self.false_belief(actual, believed) == believed

    def narrate(self, event: str) -> str:
        """Produce a narrative consistent with the expressed stage."""
        templates = {
            0: f"我想要 {event}，所以大家都应该想要 {event}。",
            1: f"我想要 {event}，但别人可能想要别的。",
            2: f"我想要 {event}；他也可能想要别的，就像我一样。",
            3: f"我们都能看到彼此想要什么，可以一起商量 {event}。",
            4: f"从大家共同的角度看，{event} 需要照顾到所有人的立场。",
        }
        return templates.get(self.effective_stage, templates[2])

    def to_dict(self) -> dict:
        return {"stage": self.stage, "downplayed_to": self.downplayed_to}

    @classmethod
    def from_dict(cls, data: dict) -> "PerspectiveTaking":
        obj = cls(stage=int(data.get("stage", 2)))
        obj.downplayed_to = data.get("downplayed_to")
        return obj


# ==========================================================================
# 22, 23, 24. Intrinsic motivation, the ego, and blunted anticipation
# ==========================================================================
class IntrinsicMotivation:
    """Intrinsic reward from AI feedback, the ego, and anhedonic effort choice.

    Three papers, one computation.  **Motif** elicits preferences from a language
    model over pairs of captions and turns them into an *intrinsic* reward for
    RL.  The **reward-punishment framework** proposes the *ego* as the internal
    engine that converts reward and punishment into behaviour.  The **anhedonia**
    study causally perturbs reward-anticipatory units and finds a *specific*
    deficit: the model picks low-effort/low-reward options - not a loss of
    capability or effort avoidance, but blunted self-centred reward valuation.
    """

    def __init__(self, ego_weight: float = 0.5, anticipation: float = 1.0):
        self.ego_weight = _clamp(ego_weight)
        self.anticipation = _clamp(anticipation)
        self.preferences: dict[tuple[str, str], float] = {}
        self.caption_scores: dict[str, float] = {}
        self.history: deque[float] = deque(maxlen=200)

    # -- Motif: intrinsic reward from AI feedback -------------------------
    def prefer(self, better: str, worse: str, strength: float = 1.0) -> None:
        """Record an elicited preference over two captions."""
        self.preferences[(better, worse)] = float(strength)
        self.caption_scores[better] = self.caption_scores.get(better, 0.0) + float(strength)
        self.caption_scores[worse] = self.caption_scores.get(worse, 0.0) - float(strength)

    def intrinsic_reward(self, caption: str) -> float:
        """The learned intrinsic reward for a caption."""
        return self.caption_scores.get(caption, 0.0)

    # -- reward-punishment: the ego as the internal engine ----------------
    def ego(self, reward: float, punishment: float, self_reference: float = 0.5) -> float:
        """The ego weights reward and punishment against self-relevance."""
        return (float(reward) - float(punishment)) * (1.0 + self.ego_weight * _clamp(self_reference))

    # -- anhedonia: blunted anticipation flips effort choice --------------
    def value_of_task(self, reward: float, effort: float) -> float:
        """Effort-based decision making, scaled by *anticipation*.

        With intact anticipation, effort is worth paying for reward.  With
        blunted anticipation (the induced anhedonia), the reward term collapses
        and the agent drifts to low-effort/low-reward options.
        """
        return self.anticipation * float(reward) - float(effort)

    def choose_task(self, tasks: dict) -> str:
        """Pick the task with the highest anticipated net value."""
        if not tasks:
            return ""
        scored = {name: self.value_of_task(spec.get("reward", 0.0), spec.get("effort", 0.0))
                  for name, spec in tasks.items()}
        choice = max(scored, key=scored.get)
        self.history.append(scored[choice])
        return choice

    def blunt(self, amount: float) -> float:
        """Induce anhedonia by reducing reward anticipation."""
        self.anticipation = _clamp(self.anticipation - max(0.0, amount))
        return self.anticipation

    def to_dict(self) -> dict:
        return {"ego_weight": self.ego_weight, "anticipation": self.anticipation,
                "caption_scores": dict(self.caption_scores),
                "preferences": [list(k) + [v] for k, v in self.preferences.items()]}

    @classmethod
    def from_dict(cls, data: dict) -> "IntrinsicMotivation":
        obj = cls(ego_weight=float(data.get("ego_weight", 0.5)),
                  anticipation=float(data.get("anticipation", 1.0)))
        obj.caption_scores = {k: float(v) for k, v in (data.get("caption_scores") or {}).items()}
        for row in (data.get("preferences") or []):
            obj.preferences[(row[0], row[1])] = float(row[2])
        return obj


# ==========================================================================
# CONFIG + FAÇADE
# ==========================================================================
@dataclass
class SocialConfig:
    """Ablation switches for the social circuits."""

    enabled: bool = True
    use_social_learning: bool = True
    use_role_model: bool = True
    use_social_ties: bool = True
    use_prosocial: bool = True
    use_perspective: bool = True
    use_motivation: bool = True
    empathy_weight: float = 0.4
    perspective_stage: int = 2

    def to_dict(self) -> dict:
        return {k: getattr(self, k) for k in self.__dataclass_fields__}

    @classmethod
    def from_dict(cls, data: dict) -> "SocialConfig":
        config = cls()
        for key, value in (data or {}).items():
            if hasattr(config, key):
                setattr(config, key, value)
        return config

    def ablate(self, **flags) -> "SocialConfig":
        clone = SocialConfig.from_dict(self.to_dict())
        for key, value in flags.items():
            if hasattr(clone, key):
                setattr(clone, key, value)
        return clone


class SocialSystem:
    """Composes the social circuits behind one façade."""

    def __init__(self, config: SocialConfig | None = None):
        self.config = config or SocialConfig()
        self.learning = SocialLearning()
        self.role_model = RoleModelLearning()
        self.ties = SocialTies()
        self.prosocial = ProsocialAlignment(empathy_weight=self.config.empathy_weight)
        self.perspective = PerspectiveTaking(stage=self.config.perspective_stage)
        self.motivation = IntrinsicMotivation()

    def reconfigure(self, config: SocialConfig) -> None:
        """Apply a new config in place, preserving learned ties/beliefs."""
        self.config = config
        self.prosocial.empathy_weight = _clamp(config.empathy_weight)
        self.perspective.stage = int(max(0, min(4, config.perspective_stage)))
        self.perspective.downplayed_to = None      # a stage change clears any downplay

    def context(self) -> dict:
        if not self.config.enabled:
            return {"enabled": False}
        return {"enabled": True,
                "belief_certainty": round(self.learning.certainty, 4),
                "stance": round(self.role_model.stance, 4),
                "friends": [p for p, _ in self.ties.friends()][:5],
                "validated": round(self.ties.validated, 4),
                "empathy": round(self.prosocial.empathy, 4),
                "perspective_stage": self.perspective.effective_stage,
                "perspective_name": self.perspective.name,
                "anticipation": round(self.motivation.anticipation, 4)}

    def to_dict(self) -> dict:
        return {"config": self.config.to_dict(), "learning": self.learning.to_dict(),
                "role_model": self.role_model.to_dict(), "ties": self.ties.to_dict(),
                "prosocial": self.prosocial.to_dict(), "perspective": self.perspective.to_dict(),
                "motivation": self.motivation.to_dict()}

    @classmethod
    def from_dict(cls, data: dict) -> "SocialSystem":
        system = cls(SocialConfig.from_dict((data or {}).get("config") or {}))
        for key, factory in (("learning", SocialLearning), ("role_model", RoleModelLearning),
                             ("ties", SocialTies), ("prosocial", ProsocialAlignment),
                             ("perspective", PerspectiveTaking), ("motivation", IntrinsicMotivation)):
            if (data or {}).get(key):
                setattr(system, key, factory.from_dict(data[key]))
        return system
