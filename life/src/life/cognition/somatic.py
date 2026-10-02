"""Somatization: psychological distress expressed as bodily complaints.

躯体化（somatisation）是临床与流行病学研究里最稳定的跨文化发现之一：焦虑与
抑郁的痛苦经常不（只）以情绪主诉出现，而是以疲劳、疼痛、心慌、头晕等身体
主诉出现。本模块把这一现象写成一条可计算的心理→身体通路，挂在
:mod:`life.cognition.affect` 的情感栈之下，每个组件对应一组文献的计算主张：

* **内感受通路（焦虑路径）** — ``InteroceptiveChannel`` 已经把内感受拆成
  accuracy（身体信号跟得多准）与 awareness（主观置信）两个可分离的量；
  躯体症状障碍研究的关键发现是「低准确 × 高觉察」的自信误读最能预测症状
  报告（PLOS ONE 2022, interoceptive accuracy and bias in somatic symptom
  disorder）。本模块用该偏差（bias = awareness − accuracy）作为放大器，
  把良性的身体波动放大成症状感知。
* **灾难化解释（焦虑路径）** — 焦虑不只是「更多恐惧」，而是把模糊线索解读
  成威胁的偏置（affect.ThreatBias）；「心身交互」研究（Mind-Body
  Interactions in Anxiety and Somatic Symptoms, 2016）进一步指出症状感知
  = 生理唤醒 × 焦虑性解释。灾难化特质 ``catastrophizing`` 决定同样的偏差
  会把信号放大到什么程度，并放大健康焦虑的自反馈。
* **抑郁的躯体出口（抑郁路径）** — 重性抑郁常以躯体症状为主诉（Why the
  body matters in MDD, 2026；中西医治疗抑郁症伴躯体化症状, 2024）：情绪
  低落 + 反刍 + 炎症性疲劳在准确度钝化时**无中生有**地生成疲劳/疼痛/睡眠
  主诉，即使外周信号并不强。
* **共病放大（流行病学）** — 躯体形式障碍与焦虑/抑郁的关联呈剂量-反应，
  且共病个体的负担超可加（LMIC women 2013；MUS meta-analysis 2003；躯体
  症状障碍与抑郁障碍共病, 2024）。本模块用焦虑×抑郁的交互乘子实现这一点。
* **语音标记（SSSC）** — 深圳躯体化语音语料库（2024）显示躯体化可以通过
  语音检测：情绪词汇减少、身体词汇增多（「情感躯体化」）。:meth:
  ``SomaticSymptomSystem.speech_features`` 生成这一标记的生成式版本。
* **规范化建模（PCNtoolkit / CPC_ML_tutorial）** — 真实数据分析的入口：
  :meth:`SomaticSymptomSystem.deviation` 把个体指标转成对规范分布的 z 偏差，
  供后续接 PCNtoolkit 式规范模型。

恶性循环的闭合：症状报告 → 健康焦虑（health anxiety）→ 威胁解释抬高 +
唤醒升高 → 真实身体信号变强 + 偏差放大 → 更多症状报告。整个循环不需要
任何 LLM 调用，纯状态推进。

与其它情感回路一致，本模块是**可选**的（``AffectConfig.use_somatic``，
默认关闭），关闭时对现有行为零影响；开启后也只增加读出与提示，不改变
底层生理回路。
"""
from __future__ import annotations

import math
from collections import deque

_EPS = 1e-9


def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    try:
        value = float(value)
    except (TypeError, ValueError):
        value = low
    return max(low, min(high, value))


# Symptom channels and their labelling for prompt / speech rendering.
#   fatigue, pain, sleep: depression-labile (MDD somatic route)
#   cardio, dizziness:    anxiety-labile (autonomic misattribution route)
#   gastrointestinal:     both, classically the strongest somatic presentation
SYMPTOM_CHANNELS = ("fatigue", "pain", "cardiorespiratory",
                    "gastrointestinal", "dizziness", "sleep")

# How much each route moves each channel (route profiles, sum-normalised
# weights inside each route; the route drives, the profile distributes).
ANXIETY_PROFILE = {"cardiorespiratory": 0.40, "dizziness": 0.30,
                   "gastrointestinal": 0.20, "pain": 0.07, "fatigue": 0.03}
DEPRESSION_PROFILE = {"fatigue": 0.34, "pain": 0.22, "sleep": 0.20,
                      "gastrointestinal": 0.12, "dizziness": 0.06}

# Comforting replies after a complaint turn.  Clinically the trap: reassurance
# relieves health anxiety *now* and trains the loop to seek it again.
REASSURANCE_CUES = ("别担心", "没事的", "别怕", "多休息", "好好休息", "心疼",
                    "抱抱", "会好的", "陪你", "不要紧", "别多想", "放松点",
                    "早点睡", "don't worry", "it's okay", "rest more",
                    "i'm here", "you'll be fine")


class SomaticSymptomSystem:
    """The psychological -> bodily gateway with its vicious circle.

    ``observe`` runs the perception gateway for one "day" (or one message in
    runtime); ``tick`` advances the slow health-anxiety decay; ``index`` and
    ``speech_features`` are read-outs.  No LLM calls, no numpy - like the rest
    of the cognition core, plain python state.
    """

    def __init__(self, catastrophizing: float = 0.20,
                 bias_gain: float = 0.8, anxiety_gain: float = 1.0,
                 depression_gain: float = 0.5, comorbidity_gain: float = 0.6,
                 report_threshold: float = 0.45, health_anxiety: float = 0.10,
                 anxiety_feedback: float = 0.20, mood_drag: float = 0.05,
                 anxiety_sensitivity: float = 1.3, decay_rate: float = 0.02,
                 speech_gain: float = 0.5, window: int = 14):
        # -- traits (mutable by interventions) --------------------------------
        self.catastrophizing = _clamp(catastrophizing)
        # -- gains -------------------------------------------------------------
        self.bias_gain = bias_gain            # interoceptive bias -> amplification
        self.anxiety_gain = anxiety_gain      # anxiety drive -> anxiety-labile channels
        self.depression_gain = depression_gain
        self.comorbidity_gain = comorbidity_gain
        self.report_threshold = report_threshold
        self.anxiety_feedback = anxiety_feedback
        self.mood_drag = mood_drag
        self.anxiety_sensitivity = anxiety_sensitivity
        self.decay_rate = decay_rate
        self.speech_gain = speech_gain
        # -- state ---------------------------------------------------------------
        self.health_anxiety = _clamp(health_anxiety)
        self.channels: dict[str, float] = {name: 0.0 for name in SYMPTOM_CHANNELS}
        self.reports: deque[float] = deque(maxlen=window)   # daily burden history
        self.report_counts: deque[int] = deque(maxlen=window)
        # chronicity: repeated reports sensitise a channel (its effective
        # threshold drifts down, capped) - the acute -> chronic SSD trajectory
        self.sensitivity: dict[str, float] = {name: 0.0 for name in SYMPTOM_CHANNELS}
        # the reassurance trap: comforting replies relieve now and train the
        # loop to need them again
        self.reassurance_pull: float = 0.0

    # ---- perception gateway ------------------------------------------------
    def observe(self, signals: dict[str, float], bias: float, accuracy: float,
                threat: float, mood: float, rumination: float,
                inflammation: float = 0.0) -> dict:
        """One gateway pass; returns the read-out incl. the feedback terms.

        ``signals`` maps (a subset of) :data:`SYMPTOM_CHANNELS` (+ ``sleep``)
        to the *true* bodily signal in [0, 1]; ``bias``/``accuracy`` come from
        ``InteroceptiveChannel``; ``threat`` is the pre-feedback threat level
        **plus** the current health anxiety (the caller closes that loop).
        """
        anxiety_drive = _clamp(threat) + self.health_anxiety
        depressive_drive = _clamp(max(0.0, -float(mood)) + 0.5 * _clamp(rumination))
        amplification = 1.0 + self.bias_gain * _clamp(bias)
        comorbidity = 1.0 + self.comorbidity_gain * _clamp(anxiety_drive) * depressive_drive

        burden = 0.0
        count = 0
        for name in SYMPTOM_CHANNELS:
            true_signal = _clamp(float((signals or {}).get(name, 0.0)))
            perceived = true_signal * amplification
            perceived += self.anxiety_gain * anxiety_drive * ANXIETY_PROFILE.get(name, 0.0)
            # depression generates symptoms *without* peripheral signal when
            # accuracy is blunted - the worse the tracking, the freer the route
            perceived += (self.depression_gain * depressive_drive
                          * DEPRESSION_PROFILE.get(name, 0.0) * (1.0 + (1.0 - _clamp(accuracy))))
            perceived += 0.3 * _clamp(inflammation) * DEPRESSION_PROFILE.get(name, 0.0)
            perceived *= comorbidity
            perceived = _clamp(perceived)
            self.channels[name] = perceived
            # sensitised channels report earlier: the effective threshold
            # drifts down with repeated reports (capped at -30%)
            effective = self.report_threshold * (1.0 - 0.3 * self.sensitivity.get(name, 0.0))
            if perceived > effective:
                burden += perceived - effective
                count += 1
                self.sensitivity[name] = _clamp(
                    self.sensitivity.get(name, 0.0) + 0.04 * (perceived - effective))
        # mean excess across channels keeps the burden in [0, ~0.55] so the
        # vicious circle escalates without instantly saturating
        burden /= len(SYMPTOM_CHANNELS)
        self.reports.append(burden)
        self.report_counts.append(count)

        # health anxiety: reports feed it, catastrophizing multiplies the
        # worry - and past reassurance makes the loop more reactive
        self.health_anxiety = _clamp(
            self.health_anxiety
            + self.anxiety_sensitivity * burden
            * (0.5 + self.catastrophizing + 0.5 * self.reassurance_pull))
        feedback = _clamp(self.anxiety_feedback * self.health_anxiety)
        return {"burden": burden, "report_count": count,
                "health_anxiety": self.health_anxiety,
                "anxiety_feedback": feedback,
                "mood_drag": self.mood_drag * burden,
                "amplification": amplification, "comorbidity": comorbidity}

    def tick(self, seconds: float) -> float:
        """Slow exponential decay of health anxiety toward baseline."""
        self.health_anxiety = _clamp(
            self.health_anxiety * math.exp(-max(0.0, seconds) / 3600.0 * self.decay_rate))
        # sensitisation and the reassurance habit are *learned* state: they
        # decay far more slowly than health anxiety (days, not hours)
        fade = math.exp(-max(0.0, seconds) / 3600.0 * 0.002)
        for name in self.sensitivity:
            self.sensitivity[name] *= fade
        self.reassurance_pull *= math.exp(-max(0.0, seconds) / 3600.0 * 0.001)
        return self.health_anxiety

    # ---- the reassurance trap ------------------------------------------------
    @classmethod
    def is_reassurance(cls, text: str) -> bool:
        """True when a reply reads as comforting (see :data:`REASSURANCE_CUES`)."""
        text = str(text or "")
        return any(cue in text for cue in REASSURANCE_CUES)

    def apply_reassurance(self, strength: float = 1.0) -> dict:
        """A comforting reply after a complaint turn.

        Relief is immediate; the cost is a stronger loop - the next reports
        move health anxiety more (see the ``reassurance_pull`` term in
        :meth:`observe`).  This is the reassurance-seeking trap, not a bug.
        """
        strength = _clamp(strength)
        # tolerance: the same comfort buys less relief each time it is used
        relief = 0.05 * strength * (1.0 - 0.5 * self.reassurance_pull)
        self.health_anxiety = _clamp(self.health_anxiety - relief)
        self.reassurance_pull = _clamp(self.reassurance_pull + 0.12 * strength)
        return {"relief": relief, "health_anxiety": self.health_anxiety,
                "reassurance_pull": self.reassurance_pull}

    # ---- read-outs -----------------------------------------------------------
    def burden(self) -> float:
        """Mean recent symptom burden in [0, 1]."""
        if not self.reports:
            return 0.0
        return _clamp(sum(self.reports) / len(self.reports))

    def index(self) -> float:
        """Somatization index: burden + health anxiety, in [0, 1]."""
        return _clamp(0.6 * self.burden() + 0.4 * self.health_anxiety)

    def chronicity(self) -> float:
        """Mean channel sensitisation in [0, 1]: 0 acute, high = chronic."""
        values = list(self.sensitivity.values()) or [0.0]
        return _clamp(sum(values) / len(values))

    def speech_features(self) -> dict:
        """SSSC-inspired speech markers: affect labelling yields to body talk.

        The corpus paper *detects* somatisation from speech; this is the
        generative mirror: the higher the index, the fewer emotion words and
        the more body words a rendered utterance should contain.
        """
        s = self.index()
        emotion_word_ratio = _clamp(0.30 * (1.0 - self.speech_gain * s), 0.02, 1.0)
        body_word_ratio = _clamp(0.10 + 0.25 * self.speech_gain * s, 0.0, 1.0)
        return {"somatization_index": round(s, 4),
                "emotion_word_ratio": round(emotion_word_ratio, 4),
                "body_word_ratio": round(body_word_ratio, 4)}

    def deviation(self, norm_mean: float, norm_sd: float) -> float:
        """z-deviation of the index from a normative model (PCNtoolkit-style)."""
        return (self.index() - float(norm_mean)) / (float(norm_sd) + _EPS)

    # ---- interventions -------------------------------------------------------
    TRAIT_FIELDS = ("catastrophizing", "bias_gain", "anxiety_gain",
                    "depression_gain", "comorbidity_gain", "report_threshold",
                    "anxiety_feedback", "mood_drag", "anxiety_sensitivity",
                    "speech_gain")

    TRAIT_DEFAULTS = {"catastrophizing": 0.20, "bias_gain": 0.8, "anxiety_gain": 1.0,
                      "depression_gain": 0.5, "comorbidity_gain": 0.6,
                      "report_threshold": 0.45, "anxiety_feedback": 0.20,
                      "mood_drag": 0.05, "anxiety_sensitivity": 1.3,
                      "speech_gain": 0.5}

    def reset_traits(self) -> None:
        """Restore the trainable traits to their constructor defaults.

        Used by the engine's settings apply so a persona change recomputes a
        deterministic trait set (defaults + persona overrides) instead of
        inheriting whatever the previous persona (or an intervention) left.
        Runtime *state* (health anxiety, channels, report history) is kept.
        """
        for name in self.TRAIT_FIELDS:
            setattr(self, name, self.TRAIT_DEFAULTS[name])

    def apply_intervention(self, kind: str, strength: float = 1.0,
                           awareness_gain: float | None = None,
                           accuracy: float | None = None) -> dict:
        """Mutate the trainable traits; returns the changed knobs.

        * ``reappraisal`` (CBT / 认知重建): catastrophizing drops.
        * ``accuracy_training`` (内感受生物反馈 / 心身医学): the *belief* about
          the body recalibrates toward what the body actually shows - the
          awareness gain moves toward the measured accuracy, closing the bias.
        * ``body_mind`` (中西医/心身联合): both, at half strength each.
        """
        strength = _clamp(strength)
        changed: dict[str, float] = {}
        if kind in ("reappraisal", "body_mind"):
            factor = 1.0 - (0.35 if kind == "reappraisal" else 0.18) * strength
            self.catastrophizing = _clamp(self.catastrophizing * factor, 0.0, 1.0)
            changed["catastrophizing"] = self.catastrophizing
        if kind in ("accuracy_training", "body_mind"):
            if awareness_gain is not None and accuracy is not None:
                blend = 0.25 * strength
                new_gain = awareness_gain + (accuracy - awareness_gain) * blend
                changed["awareness_gain"] = new_gain
        return changed

    # ---- persistence -----------------------------------------------------------
    def to_dict(self) -> dict:
        return {"catastrophizing": self.catastrophizing,
                "health_anxiety": self.health_anxiety,
                "channels": dict(self.channels),
                "reports": list(self.reports),
                "report_counts": list(self.report_counts),
                "sensitivity": dict(self.sensitivity),
                "reassurance_pull": self.reassurance_pull}

    @classmethod
    def from_dict(cls, data: dict) -> "SomaticSymptomSystem":
        system = cls()
        data = data or {}
        system.catastrophizing = _clamp(data.get("catastrophizing", 0.20))
        system.health_anxiety = _clamp(data.get("health_anxiety", 0.10))
        for name, value in (data.get("channels") or {}).items():
            if name in system.channels:
                system.channels[name] = _clamp(value)
        for name, value in (data.get("sensitivity") or {}).items():
            if name in system.sensitivity:
                system.sensitivity[name] = _clamp(value)
        system.reassurance_pull = _clamp(data.get("reassurance_pull", 0.0))
        system.reports = deque((_clamp(v) for v in (data.get("reports") or [])), maxlen=14)
        system.report_counts = deque((int(v) for v in (data.get("report_counts") or [])), maxlen=14)
        return system
