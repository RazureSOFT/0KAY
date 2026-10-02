"""Backwards-compatible re-export of :mod:`world.features`.

The implementation moved into the ``world`` package so that ``world`` no longer
imports ``life`` -- the two used to be mutually dependent (``life.worldsim``
imports ``world.sim``, and ``world.*`` imported ``life.worldsim.features``),
which made import order significant.  ``life.worldsim`` now depends on ``world``
one-way; this module only exists so existing import paths keep working.
"""
from __future__ import annotations

from world.features import MAX_ACTORS, MAX_PLOTS, build_features, feature_names  # noqa: F401

__all__ = ["MAX_ACTORS", "MAX_PLOTS", "build_features", "feature_names"]
