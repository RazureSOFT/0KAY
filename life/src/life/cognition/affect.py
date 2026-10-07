"""Affective, interoceptive and clinical circuits - the *second wave* of papers.

Wave 1 (``circuits.py``) mapped 15 papers about decision-making, social
cognition, consciousness and control onto the multi-system model.  This module
does the same for the second batch, which is about **the body, affect and its
pathology** plus the **LLM social-simulation** literature that constrains how an
artificial persona should be built.

Each class implements the *computational claim* of one paper (or a small group),
not its biology.  Every docstring names the paper and the finding it encodes.
Every circuit is gated by a flag on :class:`AffectConfig`, so it can be ablated
in isolation - the whole point of a "mechanism layer".

============================  =================================================
Paper                         Circuit / mechanism
============================  =================================================
physio - orexin / layer 6b    :class:`ArousalGain` - a wake-promoting gain that
                              scales cognitive throughput; orexin tone falls
                              with sleep debt, brainstem chemosensation
                              (VLM astrocytes, CO2) adds arousal
physio - baroreflex / vagus   :class:`VagalTone` - vagal tone indexes prefrontal
                              inhibitory control over affect; high tone = fast
                              recovery, low tone = chronic arousal
physio - diurnal cortisol     :class:`HPAxis` - slow cortisol with a diurnal
                              rhythm, stressor reactivity and cumulative
                              allostatic load
physio - interoception/insula :class:`InteroceptiveChannel` - interoceptive
                              *accuracy* and *awareness* are dissociable; the
                              precision (inverse variance) weights the PE
physio - cytokine/sickness    :class:`NeuroImmune` - cytokines drive sickness
                              behaviour (fatigue, withdrawal, anhedonia); vagal
                              tone is anti-inflammatory
psych - emotion regulation    :class:`EmotionRegulator` - reappraisal vs
                              suppression, a transdiagnostic difficulty profile,
                              and emotion *dynamics* (instability, inertia)
psych - rumination / DMN      :class:`MoodAttractor` - depression as a deep
                              negative attractor that rumination keeps deepening
psych - anhedonia             :class:`RewardAvailability` - blunted reward
                              responsiveness scales the effective reward
psych - anxiety circuits      :class:`ThreatBias` - over-generalised threat
                              reading of ambiguous cues, amplified by load
psych - attachment/loneliness :class:`AttachmentTemplate` - anxious/avoidant
                              working models and perceived social isolation
psych - active inference      :class:`PrecisionController` - precision-weighted
                              arbitration between prior and sensory evidence
LLM - Sentipolis              :class:`PADState` - continuous
                              Pleasure-Arousal-Dominance, dual-speed dynamics,
                              emotion-memory coupling
LLM - desire-driven           :class:`DesireSystem` - an explicit desire
                              generation stage between state and objective
LLM - belief-behaviour        :class:`BeliefBehaviorMonitor` - the gap between
                              a stated belief and the executed behaviour
psych - somatization          :class:`SomaticSymptomSystem` - the
                              psychological -> bodily gateway: interoceptive
                              bias, catastrophizing, the anxiety/depression
                              routes and the health-anxiety vicious circle
LLM - EASE / SimBench         :class:`AffectConfig` ablation switches + the
                              ``ablate`` helper - modular, reproducible design
============================  =================================================
"""
from __future__ import annotations

import math
from collections import deque
from dataclasses import dataclass, field

from .somatic import SomaticSymptomSystem
from .common import clamp as _clamp

EPS = 1e-9




def _sigmoid(x: float) -> float:
    if x >= 0:
        return 1.0 / (1.0 + math.exp(-x))
    exponent = math.exp(x)
    return exponent / (1.0 + exponent)


def _stdev(values) -> float:
    values = list(values)
    if len(values) < 2:
        return 0.0
    mean = sum(values) / len(values)
    return math.sqrt(sum((v - mean) ** 2 for v in values) / (len(values) - 1))


# ==========================================================================
# PHYSIOLOGY
# ==========================================================================
class InteroceptiveChannel:
    """Interoceptive accuracy and awareness are dissociable (insula papers).

    Interoception is not one signal.  *Accuracy* is how well the body signal is
    tracked; *awareness* is the subjective belief about it.  Anxiety is the
    signature of high awareness with low accuracy (a confident misreading of the
    body); depression of blunted accuracy.  The channel emits a prediction error
    and, following active-inference accounts, a **precision** (inverse variance)
    that weights how much that error should move belief.
    """

    def __init__(self, learning_rate: float = 0.3, window: int = 50,
                 awareness_gain: float = 1.0):
        self.learning_rate = learning_rate
        self.prediction = 0.5
        self.errors: deque[float] = deque(maxlen=window)
        self.awareness_gain = awareness_gain

    def observe(self, actual: float) -> float:
        """Feed one bodily reading; return the interoceptive prediction error."""
        error = float(actual) - self.prediction
        self.prediction += self.learning_rate * error
        self.errors.append(error)
        return error

    @property
    def precision(self) -> float:
        """Inverse variance of recent errors, in [0, 1]."""
        if len(self.errors) < 2:
            return 0.5
        variance = sum(e * e for e in self.errors) / len(self.errors)
        return 1.0 / (1.0 + variance)

    @property
    def accuracy(self) -> float:
        """1 when the body is tracked well, 0 when it is all surprise."""
        if not self.errors:
            return 0.5
        mean_abs = sum(abs(e) for e in self.errors) / len(self.errors)
        return 1.0 / (1.0 + mean_abs)

    @property
    def awareness(self) -> float:
        """Subjective confidence, decoupled from accuracy by ``awareness_gain``."""
        return _clamp(self.accuracy * self.awareness_gain)

    @property
    def bias(self) -> float:
        """Positive = anxious misattribution (aware but inaccurate)."""
        return self.awareness - self.accuracy

    def to_dict(self) -> dict:
        return {"prediction": self.prediction, "errors": list(self.errors),
                "awareness_gain": self.awareness_gain, "window": self.errors.maxlen,
                "learning_rate": self.learning_rate}

    @classmethod
    def from_dict(cls, data: dict) -> "InteroceptiveChannel":
        # Read the saved window back: hardcoding maxlen=50 silently reset a
        # runtime-configured window on every reload.
        try:
            window = max(1, int(data.get("window") or 50))
        except (TypeError, ValueError):
            window = 50
        channel = cls(learning_rate=float(data.get("learning_rate", 0.3)),
                      window=window,
                      awareness_gain=float(data.get("awareness_gain", 1.0)))
        channel.prediction = float(data.get("prediction", 0.5))
        channel.errors = deque((float(v) for v in (data.get("errors") or [])), maxlen=window)
        return channel


class VagalTone:
    """Vagal tone indexes prefrontal inhibitory control over affect.

    The neurovisceral-integration model (Thayer & Lane) treats high-frequency
    heart-rate variability as a peripheral readout of the prefrontal brake on
    subcortical arousal.  High tone means a stressor is *inhibited* quickly and
    arousal returns to baseline; low tone means arousal lingers.  Cholinergic
    vagal signalling is also the anti-inflammatory reflex, so tone damps
    :class:`NeuroImmune` too.
    """

    def __init__(self, tone: float = 0.6, recovery: float = 0.5,
                 stress_sensitivity: float = 0.4, baseline: float = 0.7):
        self.tone = _clamp(tone)
        self.recovery = recovery
        self.stress_sensitivity = stress_sensitivity
        self.baseline = baseline

    def stress(self, load: float) -> float:
        """A stressor withdraws the brake; return the new tone."""
        self.tone = _clamp(self.tone - self.stress_sensitivity * max(0.0, float(load)))
        return self.tone

    def rest(self, seconds: float, resting: bool = True) -> float:
        """Exponential recovery toward the personal baseline (or 1 while asleep).

        ``recovery`` is a per-hour time constant, so a tick of a few minutes
        moves the tone only slightly - otherwise a single tick would snap the
        tone to target and every stressor would be erased instantly.
        """
        target = 1.0 if resting else self.baseline
        fraction = 1.0 - math.exp(-self.recovery * max(0.0, seconds) / 3600.0)
        self.tone += (target - self.tone) * _clamp(fraction)
        self.tone = _clamp(self.tone)
        return self.tone

    @property
    def capacity(self) -> float:
        """Regulatory capacity = the tone itself."""
        return self.tone

    @property
    def recovery_rate(self) -> float:
        """How fast arousal decays after a stressor."""
        return 0.2 + 0.8 * self.tone

    def to_dict(self) -> dict:
        return {"tone": self.tone, "recovery": self.recovery,
                "stress_sensitivity": self.stress_sensitivity, "baseline": self.baseline}

    @classmethod
    def from_dict(cls, data: dict) -> "VagalTone":
        return cls(tone=float(data.get("tone", 0.6)),
                   recovery=float(data.get("recovery", 0.5)),
                   stress_sensitivity=float(data.get("stress_sensitivity", 0.4)),
                   baseline=float(data.get("baseline", 0.7)))


class HPAxis:
    """Slow cortisol: diurnal rhythm, stressor reactivity, allostatic load.

    Cortisol peaks shortly after waking and declines through the day, spikes in
    response to a stressor, and decays over hours.  Repeated activation leaves a
    residue - *allostatic load* (McEwen) - that progressively degrades the
    regulatory capacity of :class:`VagalTone`.
    """

    def __init__(self, baseline: float = 0.4, amplitude: float = 0.3,
                 peak_hour: float = 8.0, decay_half_life_h: float = 1.5,
                 reactivity: float = 0.3, load_gain: float = 1.0,
                 load_recovery: float = 0.02):
        self.baseline = baseline
        self.amplitude = amplitude
        self.peak_hour = peak_hour
        self.decay_half_life_h = decay_half_life_h
        self.reactivity = reactivity
        self.load_gain = load_gain
        self.load_recovery = load_recovery
        self.cortisol = baseline
        self.load = 0.0
        self.peak_seen = baseline

    def diurnal(self, hour: float) -> float:
        """Expected cortisol for a given hour (peak just after waking)."""
        phase = 2.0 * math.pi * (hour - self.peak_hour) / 24.0
        return max(0.0, self.baseline + self.amplitude * math.cos(phase))

    def react(self, stressor: float) -> float:
        """A stressor raises cortisol above the diurnal set point."""
        self.cortisol += self.reactivity * max(0.0, float(stressor))
        self.peak_seen = max(self.peak_seen, self.cortisol)
        return self.cortisol

    def tick(self, seconds: float, hour: float, sleeping: bool = False) -> float:
        """Decay toward the diurnal set point and accumulate allostatic load.

        Allostatic load is a slow accumulator, but it must also *recover*: with
        only the ``abs(excess)`` term it ratcheted monotonically to 1.0 within
        weeks and permanently biased threat appraisal, somatic pain and
        ``extra_need`` -- locking the persona into chronic anxiety regardless of
        what actually happened.  Recovery is faster during sleep.
        """
        target = self.diurnal(hour)
        half_lives = max(0.0, seconds) / 3600.0 / max(EPS, self.decay_half_life_h)
        fraction = 1.0 - 0.5 ** half_lives
        excess = self.cortisol - target
        self.cortisol += (target - self.cortisol) * _clamp(fraction)
        span = max(0.0, seconds) / 36000.0
        recovery = self.load_recovery * (3.0 if sleeping else 1.0) * span
        self.load = _clamp(self.load + self.load_gain * abs(excess) * span - recovery)
        self.cortisol = max(0.0, self.cortisol)
        return self.cortisol

    @property
    def reactivity_index(self) -> float:
        return max(0.0, self.peak_seen - self.baseline)

    @property
    def allostatic_load(self) -> float:
        return self.load

    def to_dict(self) -> dict:
        return {"cortisol": self.cortisol, "load": self.load, "peak_seen": self.peak_seen}

    @classmethod
    def from_dict(cls, data: dict) -> "HPAxis":
        axis = cls()
        axis.cortisol = float(data.get("cortisol", 0.4))
        axis.load = float(data.get("load", 0.0))
        axis.peak_seen = float(data.get("peak_seen", axis.cortisol))
        return axis


class ArousalGain:
    """A wake-promoting gain that scales cognitive throughput.

    Orexin/hypocretin neurons and cortical layer 6b set an arousal gain; loss of
    orexin produces unstable wakefulness.  Brainstem (ventrolateral medulla)
    astrocytes chemosense CO2 and add arousal drive.  Sleep debt lowers the gain.
    The output multiplies working-memory capacity rather than changing values.
    """

    def __init__(self, orexin: float = 0.7, sleep_debt: float = 0.0,
                 chemosensitivity: float = 0.5):
        self.orexin = _clamp(orexin)
        self.sleep_debt = _clamp(sleep_debt)
        self.chemosensitivity = chemosensitivity

    def tick(self, seconds: float, sleeping: bool) -> float:
        """Orexin falls while awake, recovers in sleep; sleep debt tracks it."""
        hours = max(0.0, seconds) / 3600.0
        if sleeping:
            self.orexin = _clamp(self.orexin + hours * 0.25)
            self.sleep_debt = _clamp(self.sleep_debt - hours * 0.15)
        else:
            self.orexin = _clamp(self.orexin - hours * 0.06)
            self.sleep_debt = _clamp(self.sleep_debt + hours * 0.04)
        return self.orexin

    def chemosensation(self, co2: float) -> float:
        """Brainstem CO2 sensing adds arousal (paper: VLM astrocytes / breathing)."""
        return _clamp(self.chemosensitivity * max(0.0, float(co2)))

    def gain(self, co2: float = 0.0) -> float:
        """Cognitive gain in [0, 1]."""
        return _clamp(self.orexin * (1.0 - 0.5 * self.sleep_debt) + self.chemosensation(co2))

    def to_dict(self) -> dict:
        return {"orexin": self.orexin, "sleep_debt": self.sleep_debt}

    @classmethod
    def from_dict(cls, data: dict) -> "ArousalGain":
        return cls(orexin=float(data.get("orexin", 0.7)),
                   sleep_debt=float(data.get("sleep_debt", 0.0)))


class NeuroImmune:
    """Cytokines drive sickness behaviour; vagal tone is anti-inflammatory.

    Peripheral inflammation signals the brain and produces the sickness
    syndrome - fatigue, low mood, social withdrawal and anhedonia.  The
    cholinergic anti-inflammatory reflex means vagal tone (see
    :class:`VagalTone`) actively damps it.  Chronic inflammation therefore looks
    like a treatment-resistant depression.
    """

    def __init__(self, inflammation: float = 0.0, decay: float = 0.08,
                 sickness_gain: float = 1.0):
        self.inflammation = _clamp(inflammation)
        self.decay = decay
        self.sickness_gain = sickness_gain

    def challenge(self, load: float) -> float:
        """An immune challenge raises inflammation."""
        self.inflammation = _clamp(self.inflammation + max(0.0, float(load)))
        return self.inflammation

    def tick(self, seconds: float, vagal_tone: float) -> float:
        """Inflammation decays over hours; vagal tone accelerates the decay."""
        rate = self.decay * (1.0 + vagal_tone)
        self.inflammation = _clamp(self.inflammation - rate * max(0.0, seconds) / 3600.0)
        return self.inflammation

    @property
    def fatigue(self) -> float:
        return _clamp(self.sickness_gain * self.inflammation)

    @property
    def withdrawal(self) -> float:
        """Social withdrawal / reduced social drive."""
        return _clamp(0.8 * self.sickness_gain * self.inflammation)

    @property
    def mood_drag(self) -> float:
        """Negative pull on valence."""
        return _clamp(0.6 * self.sickness_gain * self.inflammation)

    def to_dict(self) -> dict:
        return {"inflammation": self.inflammation}

    @classmethod
    def from_dict(cls, data: dict) -> "NeuroImmune":
        return cls(inflammation=float(data.get("inflammation", 0.0)))


# ==========================================================================
# PSYCHIATRY / PSYCHOLOGY
# ==========================================================================
# Six difficulty dimensions from the emotion-regulation-difficulties literature.
ERQ_PROFILES = {
    "typical":     {"nonaccept": 0.20, "goals": 0.25, "impulse": 0.25, "awareness": 0.20, "strategies": 0.30, "clarity": 0.20},
    "depression":  {"nonaccept": 0.55, "goals": 0.60, "impulse": 0.45, "awareness": 0.50, "strategies": 0.70, "clarity": 0.55},
    "anxiety":     {"nonaccept": 0.55, "goals": 0.50, "impulse": 0.55, "awareness": 0.45, "strategies": 0.65, "clarity": 0.50},
    "bpd":         {"nonaccept": 0.80, "goals": 0.70, "impulse": 0.85, "awareness": 0.55, "strategies": 0.80, "clarity": 0.65},
    "alexithymia": {"nonaccept": 0.40, "goals": 0.40, "impulse": 0.35, "awareness": 0.80, "strategies": 0.60, "clarity": 0.85},
}


class EmotionRegulator:
    """Regulation *strategies*, a transdiagnostic difficulty profile, and dynamics.

    Emotion regulation is a transdiagnostic treatment construct: the same
    difficulties (non-acceptance, goal interference, impulsivity, lack of
    awareness, limited strategies, poor clarity) appear across anxiety,
    depression and personality pathology, and the choice of strategy matters -
    antecedent **reappraisal** is adaptive, response-focused **suppression** is
    not.  Emotion also has *dynamics*: instability (how variable affect is) and
    inertia (how strongly it autocorrelates).
    """

    def __init__(self, reappraisal_skill: float = 0.6, suppression_skill: float = 0.4,
                 profile: str = "typical"):
        self.reappraisal_skill = reappraisal_skill
        self.suppression_skill = suppression_skill
        self.profile_name = profile
        self.profile = dict(ERQ_PROFILES.get(profile, ERQ_PROFILES["typical"]))
        self.history: deque[float] = deque(maxlen=100)
        self._last: float | None = None

    @property
    def difficulty(self) -> float:
        """Mean across the six difficulty dimensions, in [0, 1]."""
        return sum(self.profile.values()) / len(self.profile)

    def efficacy(self, strategy: str) -> float:
        """How well a strategy works for this profile (difficulty hurts)."""
        skill = self.reappraisal_skill if strategy == "reappraisal" else self.suppression_skill
        return _clamp(skill * (1.0 - 0.7 * self.difficulty))

    def regulate(self, delta: dict, strategy: str = "reappraisal") -> dict:
        """Return a *regulated* copy of an emotion delta.

        Reappraisal reinterprets the antecedent, so it reduces valence and
        arousal together.  Suppression only hides the expression: valence is
        damped but arousal and irritation *rise* (the well-documented cost).
        """
        power = self.efficacy(strategy)
        out = dict(delta)
        if strategy == "reappraisal":
            for key in ("valence", "arousal", "irritation"):
                if key in out:
                    out[key] = out[key] * (1.0 - power)
        else:  # suppression
            for key in ("valence",):
                if key in out:
                    out[key] = out[key] * (1.0 - 0.5 * power)
            out["arousal"] = out.get("arousal", 0.0) + 0.05 * (1.0 - power) + 0.03
            out["irritation"] = out.get("irritation", 0.0) + 0.04 * (1.0 - power) + 0.02
        return out

    def observe(self, valence: float) -> None:
        self.history.append(float(valence))
        self._last = float(valence)

    @property
    def instability(self) -> float:
        """Variability of recent affect (0 = flat)."""
        return _clamp(_stdev(self.history))

    @property
    def inertia(self) -> float:
        """Lag-1 autocorrelation of affect (1 = stuck, 0 = noisy)."""
        values = list(self.history)
        if len(values) < 4:
            return 0.0
        mean = sum(values) / len(values)
        num = sum((values[i] - mean) * (values[i - 1] - mean) for i in range(1, len(values)))
        den = sum((v - mean) ** 2 for v in values)
        return _clamp(num / den) if den > EPS else 0.0

    def set_profile(self, profile: str) -> None:
        self.profile_name = profile
        self.profile = dict(ERQ_PROFILES.get(profile, ERQ_PROFILES["typical"]))

    def to_dict(self) -> dict:
        return {"reappraisal_skill": self.reappraisal_skill,
                "suppression_skill": self.suppression_skill,
                "profile_name": self.profile_name, "profile": dict(self.profile),
                "history": list(self.history)}

    @classmethod
    def from_dict(cls, data: dict) -> "EmotionRegulator":
        reg = cls(reappraisal_skill=float(data.get("reappraisal_skill", 0.6)),
                  suppression_skill=float(data.get("suppression_skill", 0.4)),
                  profile=data.get("profile_name", "typical"))
        if data.get("profile"):
            reg.profile = dict(data["profile"])
        reg.history = deque((float(v) for v in (data.get("history") or [])), maxlen=100)
        return reg


class MoodAttractor:
    """Depression as a deep negative attractor that rumination keeps deepening.

    Depressive rumination is repetitive self-referential negative thought that
    couples to the default-mode network.  The useful computation is a *double
    well*: mood sits in one of two basins and resists displacement; rumination
    deepens the negative well, so recovery needs proportionally more positive
    input.  This yields the characteristic inertia of depressed mood.
    """

    def __init__(self, mood: float = 0.0, attractor: float = 0.0,
                 rumination: float = 0.0, depth: float = 0.4):
        self.mood = float(mood)
        self.attractor = float(attractor)
        self.rumination = _clamp(rumination)
        self.depth = _clamp(depth)

    def tick(self, delta: float, rumination_input: float = 0.0, pull: float = 0.3,
             seconds: float = 0.0) -> float:
        """Update mood; rumination deepens and shifts the negative attractor.

        Event terms (``delta``, ``rumination_input``) are per call; the slow
        terms are per *time*: rumination fades at 0.12/h, basin depth heals at
        0.02/h, and the attractor's restoration force acts continuously (a
        ~8h time constant at depth 0.4).  ``seconds=0`` (message-driven
        calls) never ages the state on its own - only the clock does.
        """
        hours = max(0.0, float(seconds)) / 3600.0
        # Ruminative content arrives with events and fades on the clock.
        self.rumination = _clamp(self.rumination + 0.5 * max(0.0, rumination_input) - 0.12 * hours)
        # Only ruminative *events* deepen the basin and shift the attractor -
        # keying these to the standing rumination made every no-op message
        # deepen the depression basin while nothing was actually happening.
        self.attractor = _clamp(self.attractor - 0.15 * max(0.0, rumination_input), -1.0, 0.5)
        self.depth = _clamp(self.depth + 0.05 * max(0.0, rumination_input) - 0.02 * hours)
        # restore force toward the attractor, scaled by basin depth and elapsed time
        self.mood += delta + pull * self.depth * (self.attractor - self.mood) * min(1.0, 2.0 * hours)
        self.mood = max(-1.0, min(1.0, self.mood))
        return self.mood

    @property
    def basin_depth(self) -> float:
        return self.depth

    @property
    def pull(self) -> float:
        """Downward force currently exerted on mood."""
        return _clamp(self.depth * max(0.0, -self.attractor))

    def to_dict(self) -> dict:
        return {"mood": self.mood, "attractor": self.attractor,
                "rumination": self.rumination, "depth": self.depth}

    @classmethod
    def from_dict(cls, data: dict) -> "MoodAttractor":
        return cls(mood=float(data.get("mood", 0.0)), attractor=float(data.get("attractor", 0.0)),
                   rumination=float(data.get("rumination", 0.0)), depth=float(data.get("depth", 0.4)))


class RewardAvailability:
    """Anhedonia: blunted reward responsiveness, dissociable from mood.

    Anhedonia is a reduction in *wanting* (incentive salience) and *liking*
    (hedonic impact) that can occur with normal mood.  Computationally the clean
    move is to scale the **effective reward** that reaches the value systems, so
    a blunted agent learns flatter value gradients without any change to mood.
    """

    def __init__(self, availability: float = 1.0, inertia: float = 0.9):
        self.availability = _clamp(availability)
        self.inertia = inertia
        self.wanting = _clamp(availability)
        self.liking = _clamp(availability)

    def observe(self, reward: float) -> float:
        """Availability drifts slowly toward recently experienced reward."""
        target = _clamp(0.5 + 0.5 * float(reward))
        self.availability = _clamp(self.inertia * self.availability + (1.0 - self.inertia) * target)
        self.wanting = _clamp(0.7 * self.wanting + 0.3 * self.availability)
        self.liking = _clamp(0.85 * self.liking + 0.15 * self.availability)
        return self.availability

    def effective_reward(self, reward: float) -> float:
        return float(reward) * self.availability

    def to_dict(self) -> dict:
        return {"availability": self.availability, "wanting": self.wanting, "liking": self.liking}

    @classmethod
    def from_dict(cls, data: dict) -> "RewardAvailability":
        obj = cls(availability=float(data.get("availability", 1.0)))
        obj.wanting = float(data.get("wanting", obj.availability))
        obj.liking = float(data.get("liking", obj.availability))
        return obj


class DepressiveEpisode:
    """The *course* of depression on top of its dynamics: onset, remission, relapse.

    The circuits above supply the dynamics (a deep mood attractor, anhedonia,
    allostatic load, sickness behaviour).  This turns their read-out into the
    thing a clinician would actually name - the character can be *in* an
    episode, *recovering* from one, or *relapse* - instead of "mood is a bit
    low today".  Severity is a weighted index of the observable state, amplified
    by the persona's **vulnerability** (high threat baseline / low reward
    baseline): the diathesis x stress interaction.

    Thresholds are deliberately coarse, and every transition needs to be
    sustained, so a single bad day never counts as an episode.
    """

    EUTHYMIC = "euthymic"
    SUBTHRESHOLD = "subthreshold"
    EPISODE = "episode"
    RELAPSE_WINDOW_DAYS = 60

    def __init__(self, onset: float = 0.55, remission: float = 0.32, sustain: int = 2,
                 min_sustained_hours: float = 6.0):
        self.onset_threshold = float(onset)
        self.remission_threshold = float(remission)
        self.sustain = max(1, int(sustain))
        # A transition needs ``sustain`` consecutive assessments *spanning* at
        # least this much clock time: assessments fire per message as well as
        # per clock tick, so a burst of messages in one conversation must not
        # count as "sustained".
        self.min_sustained_hours = max(0.0, float(min_sustained_hours))
        self.state = self.EUTHYMIC
        self.severity = 0.0
        self.clock_seconds = 0.0
        self.onset_clock: float | None = None
        self.remission_clock: float | None = None
        self.episodes = 0
        self.relapses = 0
        self._low = 0
        self._high = 0
        self._low_since: float | None = None
        self._high_since: float | None = None

    def assess(self, *, mood: float, anhedonia: float, allostatic_load: float, rumination: float,
               fatigue: float, sleep_debt: float, vagal_tone: float, vulnerability: float = 0.5) -> float:
        """Score the current observable state into a [0, 1] severity index."""
        low_mood = _clamp(-float(mood))
        anhed = _clamp(1.0 - float(anhedonia))
        load = _clamp(allostatic_load)
        rum = _clamp(rumination)
        fat = _clamp(fatigue)
        sleep = _clamp(sleep_debt)
        low_vagal = _clamp(1.0 - float(vagal_tone))
        raw = (0.30 * low_mood + 0.18 * anhed + 0.16 * load + 0.12 * rum
               + 0.10 * fat + 0.06 * sleep + 0.08 * low_vagal)
        # vulnerability amplifies (high-neuroticism persona deepens faster)
        self.severity = round(_clamp(raw * (0.7 + 0.6 * _clamp(vulnerability))), 4)
        return self.severity

    def update(self, dt_seconds: float = 0.0) -> str:
        """Advance the course one assessment; returns the (possibly new) state."""
        self.clock_seconds += max(0.0, float(dt_seconds))
        span_ok = (self.min_sustained_hours <= 0.0 or
                   (self.clock_seconds - (self._low_since if self._low_since is not None
                                          else self.clock_seconds)) >= self.min_sustained_hours * 3600.0)
        if self.severity >= self.onset_threshold:
            if self._low == 0:
                self._low_since = self.clock_seconds
            self._low += 1
            self._high = 0
            if self.state != self.EPISODE and self._low >= self.sustain and span_ok:
                remitted = self.remission_clock is not None
                self.state = self.EPISODE
                self.onset_clock = self.clock_seconds
                self.episodes += 1
                if remitted and (self.clock_seconds - self.remission_clock) <= self.RELAPSE_WINDOW_DAYS * 86400:
                    self.relapses += 1
        elif self.severity <= self.remission_threshold:
            if self._high == 0:
                self._high_since = self.clock_seconds
            self._high += 1
            self._low = 0
            high_span_ok = (self.min_sustained_hours <= 0.0 or
                            (self.clock_seconds - (self._high_since if self._high_since is not None
                                                   else self.clock_seconds)) >= self.min_sustained_hours * 3600.0)
            if self.state in (self.EPISODE, self.SUBTHRESHOLD) and self._high >= self.sustain and high_span_ok:
                self.state = self.EUTHYMIC
                self.remission_clock = self.clock_seconds
        else:
            self._low = 0
            self._high = 0
            self._low_since = None
            self._high_since = None
            if self.state == self.EUTHYMIC:
                self.state = self.SUBTHRESHOLD
        return self.state

    @property
    def days_in_episode(self) -> float:
        if self.state != self.EPISODE or self.onset_clock is None:
            return 0.0
        return round((self.clock_seconds - self.onset_clock) / 86400.0, 2)

    def snapshot(self) -> dict:
        return {"state": self.state, "severity": round(self.severity, 4),
                "episodes": self.episodes, "relapses": self.relapses,
                "days_in_episode": self.days_in_episode,
                "remitted": self.remission_clock is not None and self.state != self.EPISODE}

    def to_dict(self) -> dict:
        return {"onset_threshold": self.onset_threshold, "remission_threshold": self.remission_threshold,
                "sustain": self.sustain, "min_sustained_hours": self.min_sustained_hours,
                "state": self.state, "severity": self.severity,
                "clock_seconds": self.clock_seconds, "onset_clock": self.onset_clock,
                "remission_clock": self.remission_clock, "episodes": self.episodes,
                "relapses": self.relapses, "low": self._low, "high": self._high,
                "low_since": self._low_since, "high_since": self._high_since}

    @classmethod
    def from_dict(cls, data: dict) -> "DepressiveEpisode":
        data = data or {}
        obj = cls(onset=float(data.get("onset_threshold", 0.55)),
                  remission=float(data.get("remission_threshold", 0.32)),
                  sustain=int(data.get("sustain", 2)),
                  min_sustained_hours=float(data.get("min_sustained_hours", 6.0)))
        obj.state = str(data.get("state", cls.EUTHYMIC))
        obj.severity = float(data.get("severity", 0.0))
        obj.clock_seconds = float(data.get("clock_seconds", 0.0))
        obj.onset_clock = data.get("onset_clock")
        obj.remission_clock = data.get("remission_clock")
        obj.episodes = int(data.get("episodes", 0))
        obj.relapses = int(data.get("relapses", 0))
        obj._low = int(data.get("low", 0))
        obj._high = int(data.get("high", 0))
        obj._low_since = data.get("low_since")
        obj._high_since = data.get("high_since")
        return obj


class ThreatBias:
    """Anxiety: over-generalised threat reading, amplified by load.

    Pathological anxiety is not just more fear - it is a shift in the
    interpretation of *ambiguous* cues toward threat, with over-generalisation to
    cues that resemble the threat.  Allostatic load and inflammation amplify it;
    vagal tone damps it.  That gives a single knob whose position reproduces the
    anxious phenotype without changing the world.
    """

    def __init__(self, bias: float = 0.2, generalisation: float = 0.2):
        self.bias = _clamp(bias)
        self.generalisation = _clamp(generalisation)

    def interpret(self, ambiguity: float, load: float = 0.0, inflammation: float = 0.0,
                  vagal_tone: float = 0.6) -> float:
        """Return the threat value read into a cue of given ambiguity, in [0, 1]."""
        raw = self.bias + self.generalisation * _clamp(ambiguity)
        raw += 0.3 * _clamp(load) + 0.3 * _clamp(inflammation)
        raw -= 0.4 * _clamp(vagal_tone)
        return _clamp(raw)

    @property
    def ambiguity_shift(self) -> float:
        """How far a fully ambiguous cue is pushed toward threat."""
        return self.interpret(1.0) - self.interpret(0.0)

    def to_dict(self) -> dict:
        return {"bias": self.bias, "generalisation": self.generalisation}

    @classmethod
    def from_dict(cls, data: dict) -> "ThreatBias":
        return cls(bias=float(data.get("bias", 0.2)),
                   generalisation=float(data.get("generalisation", 0.2)))


class AttachmentTemplate:
    """Anxious/avoidant working models and *perceived* social isolation.

    Attachment style is an internal working model with two axes - anxiety about
    abandonment and avoidance of closeness.  Loneliness is the *perceived* gap
    between desired and actual connection, which is why it tracks inflammation
    and mortality independently of objective network size.
    """

    def __init__(self, anxiety: float = 0.3, avoidance: float = 0.3,
                 desired: float = 0.7):
        self.anxiety = _clamp(anxiety)
        self.avoidance = _clamp(avoidance)
        self.desired = _clamp(desired)
        self.perceived = 0.5

    def observe(self, quality: float) -> None:
        """Update the working model from an interaction's quality (0..1)."""
        self.perceived = _clamp(0.8 * self.perceived + 0.2 * _clamp(quality))
        # a poor interaction with an anxious model raises anxiety
        if quality < 0.4:
            self.anxiety = _clamp(self.anxiety + 0.05 * (1.0 - quality))
        else:
            self.anxiety = _clamp(self.anxiety - 0.02 * quality)

    @property
    def security(self) -> float:
        return _clamp(1.0 - 0.5 * (self.anxiety + self.avoidance))

    @property
    def loneliness(self) -> float:
        """Perceived isolation = gap between desired and perceived connection."""
        return _clamp(self.desired - self.perceived)

    def to_dict(self) -> dict:
        return {"anxiety": self.anxiety, "avoidance": self.avoidance,
                "desired": self.desired, "perceived": self.perceived}

    @classmethod
    def from_dict(cls, data: dict) -> "AttachmentTemplate":
        obj = cls(anxiety=float(data.get("anxiety", 0.3)), avoidance=float(data.get("avoidance", 0.3)),
                  desired=float(data.get("desired", 0.7)))
        obj.perceived = float(data.get("perceived", 0.5))
        return obj


class PrecisionController:
    """Active inference: precision-weighted arbitration of prior vs evidence.

    Under active inference, belief updating is gated by *precision* - the
    inverse variance of each source.  Low sensory precision (or inflated prior
    precision) produces the rigid, delusion-like updating seen in
    psychopathology; balanced precision produces flexible updating.  This is the
    "Predict-to-Control" claim: control is the minimisation of precision-weighted
    prediction error.
    """

    def __init__(self, prior_precision: float = 0.5, sensory_precision: float = 0.5):
        self.prior_precision = _clamp(prior_precision)
        self.sensory_precision = _clamp(sensory_precision)

    def blend(self, prior: float, evidence: float) -> float:
        """Precision-weighted posterior between prior and sensory evidence."""
        total = self.prior_precision + self.sensory_precision + EPS
        return (self.prior_precision * prior + self.sensory_precision * evidence) / total

    def free_energy(self, prior: float, evidence: float) -> float:
        """Precision-weighted prediction error (a proxy for free energy)."""
        error = prior - evidence
        return 0.5 * (self.sensory_precision * error * error)

    @property
    def rigidity(self) -> float:
        """1 = ignores evidence entirely, 0 = ignores the prior."""
        total = self.prior_precision + self.sensory_precision + EPS
        return self.prior_precision / total

    def to_dict(self) -> dict:
        return {"prior_precision": self.prior_precision, "sensory_precision": self.sensory_precision}

    @classmethod
    def from_dict(cls, data: dict) -> "PrecisionController":
        return cls(prior_precision=float(data.get("prior_precision", 0.5)),
                   sensory_precision=float(data.get("sensory_precision", 0.5)))


# ==========================================================================
# LLM SOCIAL SIMULATION
# ==========================================================================
class PADState:
    """Continuous Pleasure-Arousal-Dominance with dual-speed dynamics.

    Sentipolis argues that treating emotion as a transient cue causes "emotional
    amnesia"; the fix is a continuous PAD representation with **two time
    constants** (a fast reaction and a slow mood) and an explicit
    **emotion-memory coupling** so affective state biases what is recalled.  This
    class implements exactly those three claims.
    """

    def __init__(self, fast_rate: float = 0.5, slow_rate: float = 0.05,
                 w_fast: float = 0.6, w_slow: float = 0.4):
        self.fast_rate = fast_rate
        self.slow_rate = slow_rate
        self.w_fast = w_fast
        self.w_slow = w_slow
        self.fast = [0.0, 0.5, 0.5]   # pleasure, arousal, dominance
        self.slow = [0.0, 0.5, 0.5]

    def observe(self, delta: dict) -> list[float]:
        """Update both speeds; return the blended PAD vector."""
        target = [
            _clamp(self.fast[0] + delta.get("pleasure", delta.get("valence", 0.0)), -1.0, 1.0),
            _clamp(self.fast[1] + delta.get("arousal", 0.0)),
            _clamp(self.fast[2] + delta.get("dominance", 0.0)),
        ]
        for i in range(3):
            self.fast[i] += self.fast_rate * (target[i] - self.fast[i])
            self.slow[i] += self.slow_rate * (target[i] - self.slow[i])
        return self.blend

    def decay(self, seconds: float) -> None:
        """Homeostatic leak toward the neutral baseline (0, 0.5, 0.5).

        Without it the PAD is a leak-free integrator: any run of same-sign
        deltas saturates it and nothing pulls it back.  The fast component
        relaxes over ~0.5h, the slow (non-amnesic) mood over ~24h.
        """
        hours = max(0.0, float(seconds)) / 3600.0
        if hours <= 0.0:
            return
        fast_rate = 1.0 - math.exp(-hours / 0.5)
        slow_rate = 1.0 - math.exp(-hours / 24.0)
        baseline = (0.0, 0.5, 0.5)
        for index in range(3):
            self.fast[index] += fast_rate * (baseline[index] - self.fast[index])
            self.slow[index] += slow_rate * (baseline[index] - self.slow[index])

    @property
    def blend(self) -> list[float]:
        return [self.w_fast * f + self.w_slow * s for f, s in zip(self.fast, self.slow)]

    @property
    def pleasure(self) -> float:
        return self.blend[0]

    @property
    def arousal(self) -> float:
        return self.blend[1]

    @property
    def dominance(self) -> float:
        return self.blend[2]

    def retrieval_bias(self) -> float:
        """Emotion-memory coupling: positive affect favours positive recall."""
        return _clamp(0.5 + 0.5 * self.pleasure)

    def persistence(self) -> float:
        """How much of the state is the slow (non-amnesic) component."""
        return self.w_slow

    def to_dict(self) -> dict:
        return {"fast": list(self.fast), "slow": list(self.slow)}

    @classmethod
    def from_dict(cls, data: dict) -> "PADState":
        obj = cls()
        if data.get("fast"):
            obj.fast = [float(v) for v in data["fast"]]
        if data.get("slow"):
            obj.slow = [float(v) for v in data["slow"]]
        return obj


class DesireSystem:
    """An explicit *desire generation* stage between state and objective.

    The desire-driven framework inserts desire generation between state
    evolution and objective optimisation: the agent first forms drives
    (affiliation, achievement, rest, safety, curiosity) from its state and
    emotion, then optimises objectives against those drives.  Making the desire
    layer explicit is what lets an agent behave congruently with its emotional
    state instead of jumping straight from state to action.
    """

    DESIRES = ("affiliation", "achievement", "rest", "safety", "curiosity")

    def __init__(self):
        self.drives = {name: 0.5 for name in self.DESIRES}
        self.satisfaction = 0.5

    def generate(self, state: dict) -> dict:
        """Derive drive intensities from a state/emotion snapshot."""
        valence = float(state.get("valence", 0.0))
        arousal = float(state.get("arousal", 0.5))
        connection = float(state.get("connection", 0.5))
        energy = float(state.get("energy", 100.0)) / 100.0
        threat = float(state.get("threat", 0.0))
        self.drives["affiliation"] = _clamp(0.8 - connection + 0.3 * max(0.0, -valence))
        self.drives["achievement"] = _clamp(0.3 + 0.5 * arousal + 0.3 * valence)
        self.drives["rest"] = _clamp(0.9 - energy)
        self.drives["safety"] = _clamp(0.3 + threat)
        self.drives["curiosity"] = _clamp(0.4 + 0.4 * arousal * (1.0 - max(0.0, -valence)))
        return dict(self.drives)

    def objective_weights(self) -> dict:
        """Normalise drives into objective weights (sum to 1)."""
        total = sum(self.drives.values()) + EPS
        return {name: value / total for name, value in self.drives.items()}

    def satisfy(self, name: str, amount: float = 0.3) -> float:
        """Reduce a drive; raise overall satisfaction."""
        if name in self.drives:
            self.drives[name] = _clamp(self.drives[name] - amount)
            self.satisfaction = _clamp(0.7 * self.satisfaction + 0.3 * (1.0 - self.drives[name]))
        return self.satisfaction

    @property
    def dominant(self) -> str:
        return max(self.drives, key=self.drives.get)

    def to_dict(self) -> dict:
        return {"drives": dict(self.drives), "satisfaction": self.satisfaction}

    @classmethod
    def from_dict(cls, data: dict) -> "DesireSystem":
        obj = cls()
        if data.get("drives"):
            obj.drives.update({k: float(v) for k, v in data["drives"].items()})
        obj.satisfaction = float(data.get("satisfaction", 0.5))
        return obj


class BeliefBehaviorMonitor:
    """The gap between a stated belief and the executed behaviour.

    Role-playing agents frequently fail to "practice what they preach": their
    elicited beliefs do not predict their simulated behaviour.  Rather than
    trusting the belief, this monitor records stated beliefs and observed
    behaviours and reports a **consistency** score, so the system can detect its
    own drift instead of assuming coherence.
    """

    def __init__(self, window: int = 100):
        self.beliefs: deque[tuple[str, float]] = deque(maxlen=window)
        self.behaviours: deque[tuple[str, float]] = deque(maxlen=window)

    def declare(self, key: str, value: float) -> None:
        self.beliefs.append((str(key), float(value)))

    def observe(self, key: str, value: float) -> None:
        self.behaviours.append((str(key), float(value)))

    def consistency(self) -> float:
        """Fraction of matched belief/behaviour pairs that agree in sign."""
        behaviour_map = dict(self.behaviours)
        pairs = [(v, behaviour_map[k]) for k, v in self.beliefs if k in behaviour_map]
        if not pairs:
            return 1.0
        agree = sum(1 for b, a in pairs if (b >= 0) == (a >= 0))
        return agree / len(pairs)

    def drift(self) -> float:
        """1 - consistency, i.e. how much stated belief fails to predict action."""
        return 1.0 - self.consistency()

    def to_dict(self) -> dict:
        return {"beliefs": [list(p) for p in self.beliefs],
                "behaviours": [list(p) for p in self.behaviours]}

    @classmethod
    def from_dict(cls, data: dict) -> "BeliefBehaviorMonitor":
        obj = cls()
        obj.beliefs = deque((str(k), float(v)) for k, v in (data.get("beliefs") or []))
        obj.behaviours = deque((str(k), float(v)) for k, v in (data.get("behaviours") or []))
        return obj


# ==========================================================================
# CONFIG + FAÇADE
# ==========================================================================
@dataclass
class AffectConfig:
    """Ablation switches for every circuit above (EASE-style modularity).

    Each flag turns one circuit on or off so its contribution can be isolated -
    the property the EASE / SimBench papers argue simulations need to be
    scientifically useful.
    """

    enabled: bool = True
    use_interoception: bool = True
    use_vagal: bool = True
    use_hpa: bool = True
    use_arousal_gain: bool = True
    use_neuroimmune: bool = True
    use_regulation: bool = True
    use_mood_attractor: bool = True
    use_reward_availability: bool = True
    use_threat_bias: bool = True
    use_attachment: bool = True
    use_precision: bool = True
    use_pad: bool = True
    use_desire: bool = True
    use_belief_monitor: bool = True
    # clinical course (onset/remission/relapse) on top of the mood dynamics
    use_episode: bool = True
    # somatization (psychological -> bodily gateway); opt-in, default off so
    # the pre-existing behaviour is bit-for-bit preserved until enabled
    use_somatic: bool = False
    # phenotype knobs
    erq_profile: str = "typical"
    baseline_vagal: float = 0.6
    threat_baseline: float = 0.2
    reward_baseline: float = 1.0
    # interoceptive awareness gain: >1 makes the persona "aware but
    # inaccurate" (awareness > accuracy), which is what gives
    # InteroceptiveChannel.bias a positive value for the somatization
    # amplifier.  1.0 (default) keeps bias structurally at zero.
    awareness_gain: float = 1.0

    def to_dict(self) -> dict:
        return {k: getattr(self, k) for k in self.__dataclass_fields__}

    @classmethod
    def from_dict(cls, data: dict) -> "AffectConfig":
        config = cls()
        for key, value in (data or {}).items():
            if hasattr(config, key):
                setattr(config, key, value)
        return config

    def ablate(self, **flags) -> "AffectConfig":
        """Return a copy with the named circuits switched off (EASE helper)."""
        clone = AffectConfig.from_dict(self.to_dict())
        for key, value in flags.items():
            if hasattr(clone, key):
                setattr(clone, key, value)
        return clone


class AffectSystem:
    """Composes every affective/physiological circuit behind one façade.

    ``observe_message`` and ``observe_outcome`` push events in; ``tick``
    advances the slow systems; ``context`` returns the affective read-out that
    the engine folds into the prompt and into the control arbiter.  With
    ``config.enabled = False`` every method is a no-op, so the pre-existing
    behaviour is bit-for-bit preserved.
    """

    def __init__(self, config: AffectConfig | None = None):
        self.config = config or AffectConfig()
        self.interoception = InteroceptiveChannel()
        self.vagal = VagalTone(tone=self.config.baseline_vagal)
        self.hpa = HPAxis()
        self.arousal = ArousalGain()
        self.immune = NeuroImmune()
        self.regulator = EmotionRegulator(profile=self.config.erq_profile)
        self.mood = MoodAttractor()
        self.reward = RewardAvailability(availability=self.config.reward_baseline)
        self.threat = ThreatBias(bias=self.config.threat_baseline)
        self.attachment = AttachmentTemplate()
        self.precision = PrecisionController()
        self.pad = PADState()
        self.desire = DesireSystem()
        self.belief_monitor = BeliefBehaviorMonitor()
        self.somatic = SomaticSymptomSystem()
        self.episode = DepressiveEpisode()

    def _vulnerability(self) -> float:
        """Diathesis: a high threat / low reward baseline deepens faster."""
        threat = _clamp(float(getattr(self.config, "threat_baseline", 0.2)))
        reward = _clamp(float(getattr(self.config, "reward_baseline", 1.0)) / 2.0)
        return _clamp(0.5 * threat + 0.5 * (1.0 - reward))

    def _assess_episode(self, dt_seconds: float = 0.0) -> None:
        if not (self.config.enabled and getattr(self.config, "use_episode", True)):
            return
        self.episode.assess(
            mood=self.mood.mood, anhedonia=self.reward.availability,
            allostatic_load=self.hpa.allostatic_load, rumination=self.mood.rumination,
            fatigue=self.immune.fatigue, sleep_debt=self.arousal.sleep_debt,
            vagal_tone=self.vagal.tone, vulnerability=self._vulnerability())
        self.episode.update(dt_seconds)

    def reconfigure(self, config: AffectConfig) -> None:
        """Apply a new config **in place**, preserving accumulated state.

        The ``enabled`` / ``use_*`` gates are read on every call, so swapping
        ``self.config`` takes effect immediately.  A few knobs were baked into a
        circuit at construction, so they are re-derived here too.  The
        *baselines* only seed a circuit's initial value - re-imposing them would
        erase live physiological state, so they apply from the next start.
        """
        self.config = config
        self.regulator.profile_name = config.erq_profile
        self.regulator.profile = dict(ERQ_PROFILES.get(config.erq_profile,
                                                       ERQ_PROFILES["typical"]))

    # ---- event ingestion -------------------------------------------------
    def observe_message(self, message: str, intent: str = "", emotion_delta: dict | None = None,
                        body: float = 0.5, ambiguity: float = 0.3,
                        strategy: str = "reappraisal") -> dict:
        """Run the fast affective circuits for one incoming message.

        ``strategy`` selects the regulation style (``"reappraisal"`` or
        ``"suppression"``); the caller - not the sign of the delta - decides,
        because strategy choice is a trait, not a reaction.
        """
        if not self.config.enabled:
            return {}
        delta = dict(emotion_delta or {})
        if self.config.use_interoception:
            self.interoception.observe(body)
        if self.config.use_pad:
            self.pad.observe(delta)
        if self.config.use_regulation:
            delta = self.regulator.regulate(delta, strategy)
            self.regulator.observe(float(delta.get("valence", 0.0)) + self.mood.mood)
        if self.config.use_mood_attractor:
            rumination = 1.0 if intent in ("抱怨", "情绪") else 0.0
            self.mood.tick(float(delta.get("valence", 0.0)), rumination_input=rumination)
        if self.config.use_threat_bias:
            threat = self.threat.interpret(
                ambiguity, load=self.hpa.allostatic_load if self.config.use_hpa else 0.0,
                inflammation=self.immune.inflammation if self.config.use_neuroimmune else 0.0,
                vagal_tone=self.vagal.tone if self.config.use_vagal else 0.6)
        else:
            threat = 0.0
        if self.config.use_somatic:
            # The somatic gateway runs *after* the raw threat read so the
            # vicious circle can close: health anxiety biases threat upward,
            # and the symptom burden drags mood (both only when enabled).
            somatic = self.somatic.observe(
                signals={"cardiorespiratory": body,
                         "fatigue": max(self.immune.fatigue if self.config.use_neuroimmune else 0.0,
                                        1.0 - self.arousal.gain() if self.config.use_arousal_gain else 0.0),
                         "pain": 0.5 * (self.hpa.allostatic_load if self.config.use_hpa else 0.0)
                                 + 0.3 * (self.immune.inflammation if self.config.use_neuroimmune else 0.0),
                         "gastrointestinal": 0.4 * (self.hpa.allostatic_load if self.config.use_hpa else 0.0),
                         "dizziness": abs(self.arousal.gain() - 0.5) if self.config.use_arousal_gain else 0.0,
                         "sleep": self.arousal.sleep_debt if self.config.use_arousal_gain else 0.0},
                bias=self.interoception.bias, accuracy=self.interoception.accuracy,
                threat=threat + self.somatic.health_anxiety,
                mood=self.mood.mood, rumination=self.mood.rumination,
                inflammation=self.immune.inflammation if self.config.use_neuroimmune else 0.0)
            threat = _clamp(threat + somatic["anxiety_feedback"])
            self.mood.tick(-somatic["mood_drag"])
        if self.config.use_desire:
            self.desire.generate({
                "valence": float(delta.get("valence", 0.0)), "arousal": float(delta.get("arousal", 0.0)),
                "connection": float(delta.get("connection", 0.0)), "threat": threat,
                "energy": 100.0 * self.arousal.orexin})
        if self.config.use_attachment:
            # The interaction's felt quality updates the relationship working model.
            quality = _clamp(0.5 + float(delta.get("connection", 0.0)) + 0.5 * float(delta.get("valence", 0.0)))
            self.attachment.observe(quality)
        self._assess_episode()
        return delta

    def observe_outcome(self, success: bool, reward: float = 0.0, stressor: float = 0.0) -> None:
        if not self.config.enabled:
            return
        if self.config.use_reward_availability:
            self.reward.observe(reward if success else -abs(reward))
        if self.config.use_hpa and stressor:
            self.hpa.react(stressor)
            if self.config.use_vagal:
                self.vagal.stress(stressor)
        if self.config.use_neuroimmune and stressor > 0.5:
            self.immune.challenge(0.3 * stressor)
        self._assess_episode()

    def tick(self, seconds: float, hour: float = 12.0, sleeping: bool = False,
             fatigue: float = 0.0) -> None:
        """Advance the slow systems: arousal, vagal, HPA, mood, immune."""
        if not self.config.enabled:
            return
        if self.config.use_arousal_gain:
            self.arousal.tick(seconds, sleeping)
        if self.config.use_hpa:
            self.hpa.tick(seconds, hour, sleeping=sleeping)
        if self.config.use_vagal:
            self.vagal.rest(seconds, resting=sleeping)
        if self.config.use_neuroimmune:
            self.immune.tick(seconds, self.vagal.tone if self.config.use_vagal else 0.5)
        if self.config.use_mood_attractor:
            # a low tone + high load exert a slow downward pull even with no
            # event; scaled by real elapsed time (per-hour rates), never per
            # tick, so the loop interval cannot change mood dynamics.
            hours = max(0.0, seconds) / 3600.0
            drag = -(0.05 * self.hpa.allostatic_load + 0.025 * (1.0 - self.vagal.tone)) * hours
            self.mood.tick(drag, seconds=seconds)
        if self.config.use_pad:
            self.pad.decay(seconds)
        if self.config.use_somatic:
            self.somatic.tick(seconds)
        # Ascending interoception: the body pushes on the mind.
        #
        # `somatic` models the *descending* limb (distress presenting as bodily
        # symptoms), but nothing carried the other direction - hunger,
        # exhaustion and ill health only ever changed the wording of a reply.
        # A tired or hurting body drags mood down on its own, scaled by real
        # elapsed hours so the loop cadence cannot change the dynamics.
        if fatigue > 0.0 and self.config.use_mood_attractor:
            hours = max(0.0, seconds) / 3600.0
            self.mood.tick(-(0.06 * _clamp(fatigue)) * hours, seconds=seconds)
        self._assess_episode(seconds)

    # ---- read-out --------------------------------------------------------
    def context(self) -> dict:
        """Affective read-out for the prompt and the control arbiter."""
        if not self.config.enabled:
            return {"enabled": False, "extra_need": 0.0, "reliability_scale": 1.0,
                    "capacity_scale": 1.0, "prompt": ""}
        arousal_gain = self.arousal.gain() if self.config.use_arousal_gain else 1.0
        threat = (self.threat.interpret(0.5, load=self.hpa.allostatic_load,
                                        inflammation=self.immune.inflammation,
                                        vagal_tone=self.vagal.tone)
                  if self.config.use_threat_bias else 0.0)
        # More threat + a deeper negative mood raise the demand for control;
        # a blunted arousal gain and low vagal tone lower reliability/capacity.
        extra_need = _clamp(0.5 * threat + 0.4 * max(0.0, -self.mood.mood) + 0.3 * self.immune.withdrawal)
        reliability_scale = _clamp(0.4 + 0.6 * arousal_gain)
        capacity_scale = _clamp(0.3 + 0.7 * arousal_gain) * _clamp(0.5 + 0.5 * self.vagal.tone)
        prompt = self._prompt()
        return {"enabled": True, "extra_need": extra_need, "reliability_scale": reliability_scale,
                "capacity_scale": capacity_scale, "threat": threat, "prompt": prompt,
                "pad": self.pad.blend, "mood": self.mood.mood, "arousal_gain": arousal_gain,
                "vagal_tone": self.vagal.tone, "allostatic_load": self.hpa.allostatic_load,
                "inflammation": self.immune.inflammation, "loneliness": self.attachment.loneliness,
                "dominant_desire": self.desire.dominant, "belief_consistency": self.belief_monitor.consistency(),
                "somatic_burden": self.somatic.burden(),
                "health_anxiety": self.somatic.health_anxiety,
                "somatization_index": self.somatic.index(),
                "somatic_channels": dict(self.somatic.channels),
                "somatic_chronicity": self.somatic.chronicity(),
                "reassurance_pull": self.somatic.reassurance_pull,
                "speech_features": self.somatic.speech_features(),
                "episode": self.episode.snapshot()}

    def _prompt(self) -> str:
        notes = []
        if self.config.use_arousal_gain and self.arousal.gain() < 0.35:
            notes.append("你有点提不起劲，反应偏慢。")
        if self.config.use_threat_bias and self.threat.bias > 0.4:
            notes.append("你隐约有点不安，容易往坏处想。")
        if self.config.use_mood_attractor and self.mood.mood < -0.3:
            notes.append("你情绪偏低，容易反复想同一件事。")
        if self.config.use_neuroimmune and self.immune.fatigue > 0.4:
            notes.append("你身体有点不舒服，不太想说话。")
        if self.config.use_attachment and self.attachment.loneliness > 0.4:
            notes.append("你有点孤单，想有人陪。")
        if self.config.use_somatic and self.somatic.burden() > 0.3:
            notes.append("你最近总觉得身体这里那里不太舒服，容易担心自己的健康，说话时更多谈身体感受而不是情绪。")
        if getattr(self.config, "use_episode", True):
            episode = self.episode
            if episode.state == DepressiveEpisode.EPISODE:
                days = episode.days_in_episode
                span = f"已经第 {days:.0f} 天" if days >= 1 else "这段时间"
                notes.append(f"你正处在一段持续的低落里（{span}），做什么都提不起劲、也没什么意思，"
                             "这不是一两句安慰能解决的，别硬撑着装作没事。")
            elif episode.state == DepressiveEpisode.SUBTHRESHOLD:
                notes.append("你最近状态在往下滑，有点低落，但还没到最难的时候。")
            elif episode.snapshot().get("remitted") and episode.severity < 0.2:
                notes.append("你刚从一段低落里缓过来，还在慢慢恢复，别一下子用力过猛。")
        return " ".join(notes)

    # ---- persistence -----------------------------------------------------
    def to_dict(self) -> dict:
        return {
            "config": self.config.to_dict(),
            "interoception": self.interoception.to_dict(), "vagal": self.vagal.to_dict(),
            "hpa": self.hpa.to_dict(), "arousal": self.arousal.to_dict(),
            "immune": self.immune.to_dict(), "regulator": self.regulator.to_dict(),
            "mood": self.mood.to_dict(), "reward": self.reward.to_dict(),
            "threat": self.threat.to_dict(), "attachment": self.attachment.to_dict(),
            "precision": self.precision.to_dict(), "pad": self.pad.to_dict(),
            "desire": self.desire.to_dict(), "belief_monitor": self.belief_monitor.to_dict(),
            "somatic": self.somatic.to_dict(), "episode": self.episode.to_dict(),
        }

    @classmethod
    def from_dict(cls, data: dict) -> "AffectSystem":
        system = cls(AffectConfig.from_dict((data or {}).get("config") or {}))
        for key, factory in (("interoception", InteroceptiveChannel), ("vagal", VagalTone),
                             ("hpa", HPAxis), ("arousal", ArousalGain), ("immune", NeuroImmune),
                             ("regulator", EmotionRegulator), ("mood", MoodAttractor),
                             ("reward", RewardAvailability), ("threat", ThreatBias),
                             ("attachment", AttachmentTemplate), ("precision", PrecisionController),
                             ("pad", PADState), ("desire", DesireSystem),
                             ("belief_monitor", BeliefBehaviorMonitor),
                             ("somatic", SomaticSymptomSystem), ("episode", DepressiveEpisode)):
            if (data or {}).get(key):
                setattr(system, key, factory.from_dict(data[key]))
        return system
