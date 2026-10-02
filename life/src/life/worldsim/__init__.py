"""Autonomous world simulation (worldsim).

The world evolves with a *local* model (pure numpy) at runtime: the model only
proposes, a deterministic ledger decides, and the model is re-fed from the ledger
next step (open loop) so autoregressive error cannot accumulate.

This package is created in stages (S0..S6).  ``features.build_features`` is the
single source of truth shared by training and runtime.
"""
from .features import build_features, feature_names, MAX_ACTORS, MAX_PLOTS

__all__ = ["build_features", "feature_names", "MAX_ACTORS", "MAX_PLOTS"]
