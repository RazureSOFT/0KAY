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


SYMPTOM_CHANNELS = ("fatigue", "pain", "cardiorespiratory",
                    "gastrointestinal", "dizziness", "sleep")

ANXIETY_PROFILE = {"cardiorespiratory": 0.40, "dizziness": 0.30,
                   "gastrointestinal": 0.20, "pain": 0.07, "fatigue": 0.03}
DEPRESSION_PROFILE = {"fatigue": 0.34, "pain": 0.22, "sleep": 0.20,
                      "gastrointestinal": 0.12, "dizziness": 0.06}

REASSURANCE_CUES = ("别担心", "没事的", "别怕", "多休息", "好好休息", "心疼",
                    "抱抱", "会好的", "陪你", "不要紧", "别多想", "放松点",
                    "早点睡", "don't worry", "it's okay", "rest more",
                    "i'm here", "you'll be fine")


class SomaticSymptomSystem:

    def __init__(self, catastrophizing: float = 0.20,
                 bias_gain: float = 0.8, anxiety_gain: float = 1.0,
                 depression_gain: float = 0.5, comorbidity_gain: float = 0.6,
                 report_threshold: float = 0.45, health_anxiety: float = 0.10,
                 anxiety_feedback: float = 0.20, mood_drag: float = 0.05,
                 anxiety_sensitivity: float = 1.3, decay_rate: float = 0.02,
                 speech_gain: float = 0.5, window: int = 14):
        self.catastrophizing = _clamp(catastrophizing)
        self.bias_gain = bias_gain
        self.anxiety_gain = anxiety_gain
        self.depression_gain = depression_gain
        self.comorbidity_gain = comorbidity_gain
        self.report_threshold = report_threshold
        self.anxiety_feedback = anxiety_feedback
        self.mood_drag = mood_drag
        self.anxiety_sensitivity = anxiety_sensitivity
        self.decay_rate = decay_rate
        self.speech_gain = speech_gain
        self.health_anxiety = _clamp(health_anxiety)
        self.channels: dict[str, float] = {name: 0.0 for name in SYMPTOM_CHANNELS}
        self.reports: deque[float] = deque(maxlen=window)
        self.report_counts: deque[int] = deque(maxlen=window)
        self.sensitivity: dict[str, float] = {name: 0.0 for name in SYMPTOM_CHANNELS}
        self.reassurance_pull: float = 0.0

    def observe(self, signals: dict[str, float], bias: float, accuracy: float,
                threat: float, mood: float, rumination: float,
                inflammation: float = 0.0) -> dict:
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
            perceived += (self.depression_gain * depressive_drive
                          * DEPRESSION_PROFILE.get(name, 0.0) * (1.0 + (1.0 - _clamp(accuracy))))
            perceived += 0.3 * _clamp(inflammation) * DEPRESSION_PROFILE.get(name, 0.0)
            perceived *= comorbidity
            perceived = _clamp(perceived)
            self.channels[name] = perceived
            effective = self.report_threshold * (1.0 - 0.3 * self.sensitivity.get(name, 0.0))
            if perceived > effective:
                burden += perceived - effective
                count += 1
                self.sensitivity[name] = _clamp(
                    self.sensitivity.get(name, 0.0) + 0.04 * (perceived - effective))
        burden /= len(SYMPTOM_CHANNELS)
        self.reports.append(burden)
        self.report_counts.append(count)

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
        self.health_anxiety = _clamp(
            self.health_anxiety * math.exp(-max(0.0, seconds) / 3600.0 * self.decay_rate))
        fade = math.exp(-max(0.0, seconds) / 3600.0 * 0.002)
        for name in self.sensitivity:
            self.sensitivity[name] *= fade
        self.reassurance_pull *= math.exp(-max(0.0, seconds) / 3600.0 * 0.001)
        return self.health_anxiety

    @classmethod
    def is_reassurance(cls, text: str) -> bool:
        text = str(text or "")
        return any(cue in text for cue in REASSURANCE_CUES)

    def apply_reassurance(self, strength: float = 1.0) -> dict:
        strength = _clamp(strength)
        relief = 0.05 * strength * (1.0 - 0.5 * self.reassurance_pull)
        self.health_anxiety = _clamp(self.health_anxiety - relief)
        self.reassurance_pull = _clamp(self.reassurance_pull + 0.12 * strength)
        return {"relief": relief, "health_anxiety": self.health_anxiety,
                "reassurance_pull": self.reassurance_pull}

    def burden(self) -> float:
        if not self.reports:
            return 0.0
        return _clamp(sum(self.reports) / len(self.reports))

    def index(self) -> float:
        return _clamp(0.6 * self.burden() + 0.4 * self.health_anxiety)

    def chronicity(self) -> float:
        values = list(self.sensitivity.values()) or [0.0]
        return _clamp(sum(values) / len(values))

    def speech_features(self) -> dict:
        s = self.index()
        emotion_word_ratio = _clamp(0.30 * (1.0 - self.speech_gain * s), 0.02, 1.0)
        body_word_ratio = _clamp(0.10 + 0.25 * self.speech_gain * s, 0.0, 1.0)
        return {"somatization_index": round(s, 4),
                "emotion_word_ratio": round(emotion_word_ratio, 4),
                "body_word_ratio": round(body_word_ratio, 4)}

    def deviation(self, norm_mean: float, norm_sd: float) -> float:
        return (self.index() - float(norm_mean)) / (float(norm_sd) + _EPS)

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
        for name in self.TRAIT_FIELDS:
            setattr(self, name, self.TRAIT_DEFAULTS[name])

    def apply_intervention(self, kind: str, strength: float = 1.0,
                           awareness_gain: float | None = None,
                           accuracy: float | None = None) -> dict:
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
