from dataclasses import dataclass, field
from datetime import datetime
import json

from . import lexicon

# Where each axis settles when nothing is happening. Arousal and connection
# settle at the middle of their range, not at zero: zero arousal is not "calm",
# it is flatlined, and a character that drifts there stops feeling like a person.
NEUTRAL = {"valence": 0.0, "arousal": 0.5, "connection": 0.5, "irritation": 0.0}
RANGE = {"valence": (-1.0, 1.0), "arousal": (0.0, 1.0), "connection": (0.0, 1.0), "irritation": (0.0, 1.0)}


def _number(value, default: float) -> float:
    """Coerce anything to a usable float. None, NaN and junk all mean `default`."""
    if value is None:
        return default
    try:
        number = float(value)
    except (TypeError, ValueError):
        return default
    if number != number:  # NaN
        return default
    return number


def _clamp(axis: str, value: float) -> float:
    low, high = RANGE[axis]
    return max(low, min(high, value))


@dataclass
class EmotionState:
    valence: float = 0.0
    arousal: float = 0.5
    connection: float = 0.5
    irritation: float = 0.0
    last_updated: datetime = field(default_factory=datetime.now)

    def apply_delta(self, delta: dict) -> None:
        delta = delta if isinstance(delta, dict) else {}
        for axis in ("valence", "arousal", "connection", "irritation"):
            current = _number(getattr(self, axis), NEUTRAL[axis])
            self.__dict__[axis] = _clamp(axis, current + _number(delta.get(axis), 0.0))
        self.last_updated = datetime.now()

    def decay(self, seconds: float) -> None:
        seconds = max(0.0, _number(seconds, 0.0))
        rate = min(0.5, 0.001 * seconds)
        if rate <= 0.0:
            return
        # Each axis relaxes toward its own neutral. Valence and irritation move
        # fastest; arousal and connection are slower, so a good evening is not
        # erased by the next morning.
        self.valence = _clamp("valence", self.valence + (NEUTRAL["valence"] - self.valence) * rate)
        self.arousal = _clamp("arousal", self.arousal + (NEUTRAL["arousal"] - self.arousal) * rate * 0.5)
        self.connection = _clamp("connection", self.connection + (NEUTRAL["connection"] - self.connection) * rate * 0.5)
        self.irritation = _clamp("irritation", self.irritation + (NEUTRAL["irritation"] - self.irritation) * min(0.9, rate * 2))

    def to_dict(self) -> dict:
        return {
            "valence": round(self.valence, 3),
            "arousal": round(self.arousal, 3),
            "connection": round(self.connection, 3),
            "irritation": round(self.irritation, 3),
        }

    @classmethod
    def from_dict(cls, data: dict) -> "EmotionState":
        data = data if isinstance(data, dict) else {}
        return cls(
            valence=_clamp("valence", _number(data.get("valence"), NEUTRAL["valence"])),
            arousal=_clamp("arousal", _number(data.get("arousal"), NEUTRAL["arousal"])),
            connection=_clamp("connection", _number(data.get("connection"), NEUTRAL["connection"])),
            irritation=_clamp("irritation", _number(data.get("irritation"), NEUTRAL["irritation"])),
        )


class EmotionEngine:

    def __init__(self, initial_state: EmotionState | None = None):
        self.state = initial_state or EmotionState()

    INTENT_RULES = (
        ("请求", ("帮我", "能不能", "可以吗", "麻烦", "替我", "请帮", "帮忙")),
        ("情绪", ("难过", "开心", "生气", "很累", "好累", "烦", "害怕", "焦虑", "孤独", "想你", "喜欢你", "讨厌", "郁闷", "崩溃", "委屈")),
        ("分享", ("我今天", "刚刚", "我去了", "给你看", "你看", "分享", "我发现", "我买了")),
        ("抱怨", ("总是", "烦死", "受不了", "气死", "无语", "又这样")),
        ("提问", ("怎么", "为什么", "什么", "哪里", "是不是", "如何", "吗?", "吗？", "?", "？")),
    )

    def classify_intent(self, message: str) -> str:
        text = str(message or "")
        for intent, words in self.INTENT_RULES:
            if any(word in text for word in words):
                return intent
        return "闲聊"

    def on_user_message(self, message: str) -> dict:
        message = str(message or "")
        delta = {"valence": 0.0, "arousal": 0.0, "connection": 0.0, "irritation": 0.0}

        hits = lexicon.scan(message)
        delta["valence"] += 0.1 * hits["positive"]
        delta["connection"] += 0.05 * hits["positive"]
        delta["valence"] -= 0.1 * hits["negative"]
        delta["irritation"] += 0.1 * hits["negative"]
        if hits["rejection"]:
            delta["valence"] -= 0.15 * min(2, hits["rejection"])
            delta["connection"] -= 0.12 * min(2, hits["rejection"])
            delta["irritation"] += 0.08 * min(2, hits["rejection"])
        if hits["reassurance"]:
            delta["connection"] += 0.08 * hits["reassurance"]
            delta["valence"] += 0.05 * hits["reassurance"]

        delta["arousal"] += min(0.1, len(message) / 1000)

        return delta

    def on_task_completed(self, success: bool) -> dict:
        if success:
            return {"valence": 0.1, "arousal": -0.05}
        else:
            return {"valence": -0.1, "irritation": 0.05}

    def on_forced_wake(self) -> dict:
        return {"irritation": 0.3, "arousal": 0.2}

    def get_emotional_prompt_context(self) -> str:
        state = self.state
        if state.irritation > 0.7:
            return "You are feeling quite irritated. Your responses may be shorter and more direct."
        elif state.valence > 0.5:
            return "You are feeling happy and positive. Your responses are warm and enthusiastic."
        elif state.valence < -0.3:
            return "You are feeling down. Your responses are more subdued."
        elif state.arousal < 0.2:
            return "You are feeling drowsy. Your responses are slow and brief."
        else:
            return "You are in a neutral emotional state."
