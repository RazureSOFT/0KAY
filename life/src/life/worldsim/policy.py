"""Backwards-compatible re-export of :mod:`world.policy`.

See :mod:`life.worldsim.features` for why the implementation lives in ``world``
now (breaking the ``world`` <-> ``life.worldsim`` import cycle).
"""
from __future__ import annotations

from world.policy import (  # noqa: F401
    DELTA_NAMES,
    HIGH_INTENSITY,
    TIER_PRIOR,
    PriorEngine,
    WorldPolicy,
    entropy,
    kl_divergence,
    softmax,
)

__all__ = ["DELTA_NAMES", "HIGH_INTENSITY", "TIER_PRIOR", "PriorEngine", "WorldPolicy",
           "entropy", "kl_divergence", "softmax"]
