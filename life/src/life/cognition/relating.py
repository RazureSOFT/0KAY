from __future__ import annotations

import math
from datetime import datetime

AXES: tuple[str, ...] = (
    "warmth",
    "directness",
    "openness",
    "humor",
    "curiosity",
    "formality",
    "pace",
    "risk",
)

POSITIVE_WORDS = ("谢谢", "喜欢", "好棒", "开心", "哈哈", "可爱", "厉害", "抱抱", "想你",
                  "thanks", "love", "great", "haha", "nice")
NEGATIVE_WORDS = ("讨厌", "烦", "生气", "难过", "无语", "滚", "别烦", "闭嘴",
                  "hate", "angry", "bad", "stupid")
HUMOR_WORDS = ("哈哈", "笑死", "233", "hhh", "😂", "🤣", "嘿嘿", "乐")
FORMAL_WORDS = ("您", "请", "感谢", "麻烦", "劳驾", "谢谢您")
CASUAL_WORDS = ("嘿", "哈喽", "hi", "hello", "在吗", "~", "呀", "啦")
QUESTION_WORDS = ("吗", "呢", "为什么", "怎么", "如何", "?", "？")
RISK_WORDS = ("试试", "试一下", "赌", "冲", "冒险", "不管了", "豁出去")
DIRECT_WORDS = ("直接", "快点", "赶紧", "马上", "就现在")


AXIS_WEIGHTS: dict[str, float] = {
    "warmth": 2.0, "humor": 1.5, "openness": 1.0, "curiosity": 1.0,
    "directness": 1.0, "formality": 1.0, "pace": 0.75, "risk": 0.75,
}


def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


def _hit(text: str, words) -> bool:
    return any(word in text for word in words)


def signals_from_message(text: str, sentiment: float = 0.0, latency: float | None = None,
                         length: int | None = None) -> dict[str, float]:
    body = str(text or "")
    lowered = body.lower()
    size = len(body) if length is None else int(length)
    questions = sum(1 for word in QUESTION_WORDS if word in body) + body.count("?") + body.count("？")
    warm = _hit(lowered, POSITIVE_WORDS) or sentiment > 0
    cold = _hit(lowered, NEGATIVE_WORDS) or sentiment < 0
    return {
        "warmth": 0.85 if warm else 0.2 if cold else 0.5,
        "directness": _clamp(0.5 + (0.25 if size <= 20 else -0.2) + (0.2 if _hit(lowered, DIRECT_WORDS) else 0.0)),
        "openness": _clamp(0.3 + 0.5 * min(1.0, size / 200.0) + (0.2 if questions else 0.0)),
        "humor": 0.8 if _hit(lowered, HUMOR_WORDS) else 0.5,
        "curiosity": _clamp(0.3 + 0.4 * min(1.0, questions / 2.0) + (0.2 if size > 40 else 0.0)),
        "formality": 0.8 if _hit(lowered, FORMAL_WORDS) else 0.2 if _hit(lowered, CASUAL_WORDS) else 0.5,
        "pace": 0.8 if (latency is not None and latency < 60) else 0.4 if (latency is not None and latency > 1800) else 0.5,
        "risk": 0.8 if _hit(lowered, RISK_WORDS) else 0.45,
    }


class TraitModel:

    MIN_LEARNING_RATE = 0.12

    def __init__(self):
        self.self_axes: dict[str, float] = {axis: 0.5 for axis in AXES}
        self.partner_axes: dict[str, dict[str, float]] = {}
        self.partner_counts: dict[str, int] = {}
        self.self_source: str = "default"

    def set_self(self, evidence: dict | None = None, breadth: int = 0,
                 values: dict | None = None,
                 axes_override: dict | None = None) -> dict[str, float]:
        axes = {axis: 0.5 for axis in AXES}
        for axis, value in (axes_override or {}).items():
            if axis in axes:
                try:
                    axes[axis] = _clamp(float(value))
                except (TypeError, ValueError):
                    continue
        hints = {
            "positive_affect": {"warmth": 0.15, "humor": 0.12, "openness": 0.08, "curiosity": 0.05},
            "depressive": {"warmth": -0.05, "humor": -0.12, "openness": -0.05, "risk": -0.08},
            "anxious": {"risk": -0.15, "directness": -0.08, "pace": 0.05},
            "hypervigilant": {"risk": -0.10, "openness": -0.08, "warmth": -0.05},
            "ruminative": {"directness": -0.06, "openness": 0.04},
            "regulated": {"formality": 0.10, "pace": -0.05, "risk": -0.05},
            "impulsive": {"directness": 0.12, "risk": 0.12, "pace": 0.08, "warmth": 0.05},
            "alexithymic": {"openness": -0.10, "warmth": -0.05},
            "night_owl": {"pace": -0.08},
            "early_bird": {"pace": 0.08},
            "somatic_prone": {"risk": -0.05, "openness": -0.04},
            "somatic_markers": {"risk": -0.05},
        }
        for dimension in (evidence or {}):
            for axis, delta in hints.get(dimension, {}).items():
                axes[axis] += delta
        if breadth:
            axes["openness"] = _clamp(axes["openness"] + min(0.15, breadth * 0.01))
        if values:
            top = max(values.items(), key=lambda kv: abs(float(kv[1])), default=("", 0.0))
            if "亲近" in str(top[0]) or "陪伴" in str(top[0]) or "爱" in str(top[0]):
                axes["warmth"] = _clamp(axes["warmth"] + 0.05)
        self.self_axes = {axis: round(_clamp(value), 4) for axis, value in axes.items()}
        self.self_source = "persona"
        return dict(self.self_axes)

    def observe(self, partner: str, signals: dict[str, float]) -> dict[str, float]:
        partner = str(partner or "").strip()
        if not partner or not signals:
            return {}
        current = self.partner_axes.get(partner) or {axis: 0.5 for axis in AXES}
        count = self.partner_counts.get(partner, 0) + 1
        rate = max(self.MIN_LEARNING_RATE, 1.0 / count)
        updated = {}
        for axis in AXES:
            target = _clamp(float(signals.get(axis, current.get(axis, 0.5)) or 0.0))
            updated[axis] = _clamp(current.get(axis, 0.5) + rate * (target - current.get(axis, 0.5)))
        self.partner_axes[partner] = {axis: round(value, 4) for axis, value in updated.items()}
        self.partner_counts[partner] = count
        return dict(self.partner_axes[partner])

    def confidence(self, partner: str) -> float:
        count = self.partner_counts.get(str(partner or ""), 0)
        if count <= 0:
            return 0.0
        return round(_clamp(1.0 - math.exp(-count / 6.0)), 4)

    def axes_for(self, partner: str) -> dict[str, float]:
        return dict(self.partner_axes.get(str(partner or ""), {}))

    def homophily(self, partner: str) -> float:
        partner = str(partner or "")
        theirs = self.partner_axes.get(partner)
        if not theirs:
            return 0.5
        shared = [axis for axis in AXES if axis in theirs]
        if not shared:
            return 0.5
        weight_total = sum(AXIS_WEIGHTS.get(axis, 1.0) for axis in shared) or 1.0
        distance = sum(AXIS_WEIGHTS.get(axis, 1.0) * abs(self.self_axes.get(axis, 0.5) - theirs[axis])
                       for axis in shared) / weight_total
        similarity = _clamp(1.0 - distance)
        confidence = self.confidence(partner)
        return round(_clamp(0.5 + confidence * (similarity - 0.5)), 4)

    def to_dict(self) -> dict:
        return {"self_axes": dict(self.self_axes), "partner_axes": self.partner_axes,
                "partner_counts": dict(self.partner_counts), "self_source": self.self_source}

    @classmethod
    def from_dict(cls, data: dict) -> "TraitModel":
        obj = cls()
        data = data or {}
        saved = data.get("self_axes") or {}
        for axis in AXES:
            if axis in saved:
                obj.self_axes[axis] = _clamp(float(saved[axis]))
        obj.partner_axes = {str(k): {axis: _clamp(float(v.get(axis, 0.5)))
                                     for axis in AXES if isinstance(v, dict)}
                            for k, v in (data.get("partner_axes") or {}).items()}
        obj.partner_counts = {str(k): int(v) for k, v in (data.get("partner_counts") or {}).items()}
        obj.self_source = str(data.get("self_source") or "default")
        return obj


MISREAD_MARKERS = ("不是这个意思", "不是那个意思", "你误会", "你误解", "理解错",
                   "我没那个意思", "我没这意思", "不是你想的那样")
CLARIFY_MARKERS = ("我的意思是", "我是想说", "我本来是想", "我的本意", "其实我是")


class RepairModel:

    OPEN = "open"
    REPAIRING = "repairing"
    RESOLVED = "resolved"
    REPAIR_STEPS = 2
    HURT = "hurt"
    MISUNDERSTANDING = "misunderstanding"

    def __init__(self):
        self.events: dict[str, dict] = {}

    @staticmethod
    def _cause_of(text: str) -> str:
        return RepairModel.MISUNDERSTANDING if _hit(str(text or ""), MISREAD_MARKERS) else RepairModel.HURT

    def observe(self, partner: str, sentiment: float, text: str = "", intent: str = "") -> str:
        partner = str(partner or "").strip()
        try:
            sentiment = float(sentiment or 0.0)
        except (TypeError, ValueError):
            sentiment = 0.0
        if not partner:
            return ""
        event = self.events.get(partner)
        misread = _hit(str(text or ""), MISREAD_MARKERS)
        opening = sentiment < 0 or (sentiment == 0 and misread)
        if opening and (event is None or event.get("status") == self.RESOLVED):
            self.events[partner] = {"status": self.OPEN,
                                    "severity": 0.45 if sentiment < 0 else 0.30,
                                    "repairs": 0, "cause": self._cause_of(text),
                                    "intent": str(intent or "")[:40],
                                    "clarified": False,
                                    "opened_at": datetime.now().isoformat(),
                                    "resolved_at": ""}
            return "rupture_opened"
        if sentiment < 0 and event and event.get("status") != self.RESOLVED:
            event["severity"] = _clamp(float(event.get("severity", 0.45)) + 0.2)
            event["status"] = self.OPEN
            if misread:
                event["cause"] = self.MISUNDERSTANDING
            return "rupture_deepened"
        if event and event.get("status") in (self.OPEN, self.REPAIRING) and (sentiment > 0 or misread):
            if sentiment > 0 and _hit(str(text or ""), CLARIFY_MARKERS):
                event["clarified"] = True
            event["repairs"] = int(event.get("repairs", 0)) + 1
            event["status"] = self.REPAIRING
            if event["repairs"] >= self.REPAIR_STEPS:
                event["status"] = self.RESOLVED
                event["resolved_at"] = datetime.now().isoformat()
                return "repaired"
            return "repair_progress"
        return ""

    def cause(self, partner: str) -> str:
        event = self.events.get(str(partner or ""))
        return str(event.get("cause") or "") if event else ""

    def is_misunderstanding(self, partner: str) -> bool:
        return self.cause(partner) == self.MISUNDERSTANDING and self.severity(partner) > 0

    def severity(self, partner: str) -> float:
        event = self.events.get(str(partner or ""))
        if not event or event.get("status") == self.RESOLVED:
            return 0.0
        return round(_clamp(float(event.get("severity", 0.0))), 4)

    def status(self, partner: str) -> str:
        event = self.events.get(str(partner or ""))
        return str(event.get("status")) if event else ""

    def unresolved(self) -> list[str]:
        return [p for p, e in self.events.items() if e.get("status") in (self.OPEN, self.REPAIRING)]

    def summary(self) -> dict:
        unresolved = self.unresolved()
        return {"open": len(unresolved), "partners": unresolved[:8],
                "worst": round(max((self.severity(p) for p in unresolved), default=0.0), 4)}

    def to_dict(self) -> dict:
        return {"events": {k: dict(v) for k, v in self.events.items()}}

    @classmethod
    def from_dict(cls, data: dict) -> "RepairModel":
        obj = cls()
        for key, value in ((data or {}).get("events") or {}).items():
            if isinstance(value, dict):
                obj.events[str(key)] = dict(value)
        return obj


class RelatingSystem:

    def __init__(self):
        self.traits = TraitModel()
        self.repair = RepairModel()

    def context(self) -> dict:
        return {"homophily_source": self.traits.self_source,
                "open_repairs": len(self.repair.unresolved()),
                "repairs": self.repair.summary()}

    def to_dict(self) -> dict:
        return {"traits": self.traits.to_dict(), "repair": self.repair.to_dict()}

    @classmethod
    def from_dict(cls, data: dict) -> "RelatingSystem":
        system = cls()
        data = data or {}
        if data.get("traits"):
            system.traits = TraitModel.from_dict(data["traits"])
        if data.get("repair"):
            system.repair = RepairModel.from_dict(data["repair"])
        return system
