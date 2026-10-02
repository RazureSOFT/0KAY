"""Backwards-compatible re-export of :mod:`world.assets`.

See :mod:`life.worldsim.features` for why the implementation lives in ``world``
now (breaking the ``world`` <-> ``life.worldsim`` import cycle).
"""
from __future__ import annotations

from world.assets import (  # noqa: F401
    CAST_ROLES,
    ROLE_ALIASES,
    TIERS,
    TIER_INTENSITY,
    parse_actors_text,
    parse_places_text,
    tier_distribution,
    validate_cast,
    validate_templates,
)

__all__ = ["CAST_ROLES", "ROLE_ALIASES", "TIERS", "TIER_INTENSITY", "parse_actors_text",
           "parse_places_text", "tier_distribution", "validate_cast", "validate_templates"]
