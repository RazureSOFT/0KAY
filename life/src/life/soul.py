"""Soul state: four energy channels bent into behaviour parameters.

Inspired by angel-memory's soul system: energy values are mapped (tanh-bent) to
retrieval depth, memory impression count, output length and creativity, and are
nudged by the current affect ("resonance").
"""
import math
from dataclasses import asdict, dataclass


def _clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, value))


@dataclass
class SoulState:
    recall_depth: float = 0.5
    impression_depth: float = 0.4
    expression_desire: float = 0.5
    creativity: float = 0.5

    def recall_limit(self) -> int:
        """How many memories to retrieve (RecallDepth)."""
        return max(1, min(20, round(1 + math.tanh(self.recall_depth - 0.5) * 6 + self.recall_depth * 6)))

    def impression_limit(self) -> int:
        """How many memories to keep per reflection (ImpressionDepth)."""
        return max(0, min(10, round(self.impression_depth * 8)))

    def output_tokens(self, base: int = 1024) -> int:
        """Preferred output budget (ExpressionDesire)."""
        return max(128, int(base * (0.6 + math.tanh(self.expression_desire - 0.5) * 0.5 + self.expression_desire * 0.4)))

    def temperature(self, base: float = 0.7) -> float:
        """Sampling temperature (Creativity)."""
        return round(max(0.0, min(1.5, base * (0.55 + math.tanh(self.creativity - 0.5) * 0.5))), 2)

    def resonate(self, valence: float, arousal: float) -> None:
        """Old-state resonance: current affect bends the channels, then they drift back."""
        self.creativity = _clamp(self.creativity + (arousal - 0.5) * 0.12, 0.1, 1.0)
        self.expression_desire = _clamp(self.expression_desire + (valence - 0.5) * 0.12, 0.1, 1.0)
        self.recall_depth = _clamp(self.recall_depth + (0.5 - valence) * 0.05, 0.1, 1.0)

    def to_dict(self) -> dict:
        return asdict(self)

    def load(self, data: dict) -> None:
        if not isinstance(data, dict):
            return
        for key in ("recall_depth", "impression_depth", "expression_desire", "creativity"):
            value = data.get(key)
            if isinstance(value, (int, float)):
                setattr(self, key, _clamp(float(value), 0.1, 1.0))
