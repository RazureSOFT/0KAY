"""Emotion system for L.I.F.E - Multi-dimensional emotional state."""

from dataclasses import dataclass, field
from datetime import datetime
import json


@dataclass
class EmotionState:
    """Multi-dimensional emotional state."""
    valence: float = 0.0      # -1.0 to 1.0 (pleasure)
    arousal: float = 0.5      # 0.0 to 1.0 (activation)
    connection: float = 0.5   # 0.0 to 1.0 (social bonding)
    irritation: float = 0.0   # 0.0 to 1.0 (annoyance)
    last_updated: datetime = field(default_factory=datetime.now)

    def apply_delta(self, delta: dict) -> None:
        """Apply emotion delta to current state."""
        self.valence = max(-1.0, min(1.0, self.valence + delta.get("valence", 0.0)))
        self.arousal = max(0.0, min(1.0, self.arousal + delta.get("arousal", 0.0)))
        self.connection = max(0.0, min(1.0, self.connection + delta.get("connection", 0.0)))
        self.irritation = max(0.0, min(1.0, self.irritation + delta.get("irritation", 0.0)))
        self.last_updated = datetime.now()

    def decay(self, seconds: float) -> None:
        """Apply natural decay to emotions over time."""
        decay_rate = 0.001 * seconds  # Slow decay
        self.valence *= (1.0 - decay_rate)
        self.arousal *= (1.0 - decay_rate * 0.5)
        self.irritation *= (1.0 - decay_rate * 2)  # Irritability decays faster

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
    """Manages emotional state transitions."""

    def __init__(self, initial_state: EmotionState | None = None):
        self.state = initial_state or EmotionState()

    def on_user_message(self, message: str) -> dict:
        """Calculate emotion delta from user message."""
        delta = {"valence": 0.0, "arousal": 0.0, "connection": 0.0, "irritation": 0.0}

        # Simple sentiment analysis
        positive_words = ["thanks", "good", "great", "love", "happy", "nice", "awesome"]
        negative_words = ["bad", "hate", "stupid", "annoying", "terrible", "angry"]

        msg_lower = message.lower()
        for word in positive_words:
            if word in msg_lower:
                delta["valence"] += 0.1
                delta["connection"] += 0.05

        for word in negative_words:
            if word in msg_lower:
                delta["valence"] -= 0.1
                delta["irritation"] += 0.1

        # Increase arousal with longer messages
        delta["arousal"] += min(0.1, len(message) / 1000)

        return delta

    def on_task_completed(self, success: bool) -> dict:
        """Calculate emotion delta from task completion."""
        if success:
            return {"valence": 0.1, "arousal": -0.05}
        else:
            return {"valence": -0.1, "irritation": 0.05}

    def on_forced_wake(self) -> dict:
        """Calculate emotion delta from forced wake during sleep."""
        return {"irritation": 0.3, "arousal": 0.2}

    def get_emotional_prompt_context(self) -> str:
        """Get emotional state as prompt context for THINK stage."""
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
