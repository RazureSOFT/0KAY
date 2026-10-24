from dataclasses import dataclass, field
from datetime import datetime
import json

from . import lexicon


@dataclass
class EmotionState:
    valence: float = 0.0
    arousal: float = 0.5
    connection: float = 0.5
    irritation: float = 0.0
    last_updated: datetime = field(default_factory=datetime.now)

    def apply_delta(self, delta: dict) -> None:
        self.valence = max(-1.0, min(1.0, self.valence + delta.get("valence", 0.0)))
        self.arousal = max(0.0, min(1.0, self.arousal + delta.get("arousal", 0.0)))
        self.connection = max(0.0, min(1.0, self.connection + delta.get("connection", 0.0)))
        self.irritation = max(0.0, min(1.0, self.irritation + delta.get("irritation", 0.0)))
        self.last_updated = datetime.now()

    def decay(self, seconds: float) -> None:
        seconds = max(0.0, float(seconds))
        rate = min(0.5, 0.001 * seconds)
        self.valence *= (1.0 - rate)
        self.arousal *= (1.0 - rate * 0.5)
        self.irritation *= (1.0 - min(0.9, rate * 2))

    def to_dict(self) -> dict:
        return {
            "valence": round(self.valence, 3),
            "arousal": round(self.arousal, 3),
            "connection": round(self.connection, 3),
            "irritation": round(self.irritation, 3),
        }

    @classmethod
    def from_dict(cls, data: dict) -> "EmotionState":
        return cls(
            valence=data.get("valence", 0.0),
            arousal=data.get("arousal", 0.5),
            connection=data.get("connection", 0.5),
            irritation=data.get("irritation", 0.0),
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
