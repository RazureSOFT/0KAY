"""Runtime world policy: rules-first prior + a zero-initialised numpy residual.

``softmax(log prior_weights(state) + scale * (W @ x + b))``.  With ``W = b = 0``
the output is *exactly* the rule-based prior (S2 simulator), which is the
rollback guarantee.  A ridge head emits bounded continuous deltas.
Pure numpy; weights serialise to JSON.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

import numpy as np

TIER_PRIOR = {"trivia": 0.70, "small": 0.25, "shareable": 0.04, "upset": 0.01}
HIGH_INTENSITY = 3
DELTA_NAMES = ("valence", "irritation", "energy")


class PriorEngine:
    """State-dependent rule prior over templates (hard constraint: rules first)."""

    def __init__(self, tiers: list[str], base_rates=None):
        self.tiers = list(tiers)
        self.n = len(tiers)
        self.base = np.asarray(base_rates, dtype=float) if base_rates is not None else np.ones(len(tiers))
        self._mask = {tier: np.array([t == tier for t in tiers], dtype=float) for tier in TIER_PRIOR}
        self._intensity = np.array([{"trivia": 1, "small": 2, "shareable": 3, "upset": 4}[t] for t in tiers])

    def weights(self, state: dict) -> np.ndarray:
        w = np.array([TIER_PRIOR[tier] for tier in self.tiers], dtype=float) * self.base
        mood = state.get("mood") or {}
        world = state.get("world") or {}
        circadian = state.get("circadian") or {}
        ledger = state.get("ledger") or {}
        hour = float(world.get("hour", 12) or 0) % 24
        quiet = bool(circadian.get("sleeping")) or hour >= 23 or hour < 8
        if quiet:
            w[self._mask["shareable"] > 0] *= 0.2
            w[self._mask["upset"] > 0] *= 0.2
        if float(ledger.get("drama_budget", 1.0)) < 0.2:
            w[self._mask["upset"] > 0] *= 0.0
            w[self._mask["shareable"] > 0] *= 0.3
        tense = float(mood.get("irritation", 0.0)) > 0.5 or float(mood.get("valence", 0.0)) < -0.3
        w[self._mask["upset"] > 0] *= 2.0 if tense else 0.5
        return w / max(w.sum(), 1e-12)

    def logits(self, state: dict) -> np.ndarray:
        return np.log(np.maximum(self.weights(state), 1e-12))


class WorldPolicy:
    def __init__(self, tiers: list[str], d_features: int, scale: float = 1.0, base_rates=None):
        self.prior = PriorEngine(tiers, base_rates)
        self.n = len(tiers)
        self.d = int(d_features)
        self.scale = float(scale)
        self.W = np.zeros((self.n, self.d))
        self.b = np.zeros(self.n)
        self.D = np.zeros((len(DELTA_NAMES), self.d))
        self.feature_schema_version = 1

    def logits(self, state: dict, x) -> np.ndarray:
        return self.prior.logits(state) + self.scale * (self.W @ np.asarray(x, dtype=float) + self.b)

    def probs(self, state: dict, x) -> np.ndarray:
        z = self.logits(state, x)
        z = z - z.max()
        p = np.exp(z)
        return p / max(p.sum(), 1e-12)

    def deltas(self, x) -> dict:
        out = np.tanh(self.D @ np.asarray(x, dtype=float))
        return {name: float(out[i]) for i, name in enumerate(DELTA_NAMES)}

    # ---- persistence (JSON; prior_logits kept for provenance/rollback) ----
    def to_dict(self) -> dict:
        return {"feature_schema_version": self.feature_schema_version, "scale": self.scale,
                "prior_logits": self.prior.logits({}).tolist(), "tiers": self.prior.tiers,
                "base_rates": self.prior.base.tolist(),
                "W": self.W.tolist(), "b": self.b.tolist(), "D": self.D.tolist(),
                "delta_names": list(DELTA_NAMES)}

    def save(self, path) -> None:
        path = Path(path)
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(".tmp")
        temporary.write_text(json.dumps(self.to_dict(), ensure_ascii=False), encoding="utf-8")
        temporary.replace(path)

    @classmethod
    def load(cls, path) -> "WorldPolicy":
        data = json.loads(Path(path).read_text(encoding="utf-8"))
        policy = cls(data["tiers"], len(data["W"][0]), data.get("scale", 1.0), data.get("base_rates"))
        policy.W = np.array(data["W"], dtype=float)
        policy.b = np.array(data["b"], dtype=float)
        policy.D = np.array(data["D"], dtype=float)
        policy.feature_schema_version = int(data.get("feature_schema_version", 1))
        return policy


def softmax(z: np.ndarray) -> np.ndarray:
    z = z - z.max()
    p = np.exp(z)
    return p / max(p.sum(), 1e-12)


def kl_divergence(p: np.ndarray, q: np.ndarray) -> float:
    p = np.clip(p, 1e-12, 1.0)
    q = np.clip(q, 1e-12, 1.0)
    return float(np.sum(p * np.log(p / q)))


def entropy(p: np.ndarray) -> float:
    p = np.clip(p, 1e-12, 1.0)
    return float(-np.sum(p * np.log(p)))
