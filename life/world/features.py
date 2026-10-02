"""Shared feature builder for the worldsim policy.

Hard constraint: this module is imported by BOTH training and runtime, so the
feature order must never diverge from ``world/spec.json``.  ``feature_names``
expands the spec; ``build_features`` emits one normalized float per name, in the
same order.  Pure python, no numpy - the policy itself is the numpy part.
"""
from __future__ import annotations

import math

MAX_ACTORS = 8
MAX_PLOTS = 5


def _clamp(value, low: float, high: float) -> float:
    try:
        value = float(value)
    except (TypeError, ValueError):
        value = low
    return max(low, min(high, value))


def _norm(value, low: float, high: float) -> float:
    if high <= low:
        return 0.0
    return _clamp((float(value) - low) / (high - low), 0.0, 1.0)


def _recency(days) -> float:
    """Exponential recency in [0, 1]: 0 days -> 1, 7 days -> ~0.37."""
    return math.exp(-max(0.0, float(days or 0.0)) / 7.0)


def feature_names() -> list[str]:
    """The exact ordered feature names implied by ``world/spec.json``."""
    names = ["energy_norm", "hunger_norm", "health_norm", "sleeping",
             "valence_norm", "arousal", "connection", "irritation"]
    for index in range(MAX_ACTORS):
        for suffix in ("affinity", "warmth", "tension", "recency"):
            names.append(f"actor_{index}_{suffix}")
    for index in range(MAX_PLOTS):
        for suffix in ("progress", "tension"):
            names.append(f"plot_{index}_{suffix}")
    names += ["obligations_norm", "days_since_salient_norm", "drama_budget", "due_soon_norm"]
    names += ["temperature_norm", "raining", "season_sin", "season_cos", "hour_sin", "hour_cos"]
    names += ["agenda_count_norm", "agenda_remaining_norm", "weekday_sin", "weekday_cos"]
    # somatic group (feature_schema_version 2): the psychological -> bodily
    # gateway read-outs; absent keys default to 0 so old states stay valid
    names += ["somatization_index", "health_anxiety", "somatic_burden"]
    names += ["density"]
    return names


def build_features(world_state: dict) -> list[float]:
    """Normalize a runtime world state into the fixed feature vector."""
    state = world_state or {}
    circadian = state.get("circadian") or {}
    mood = state.get("mood") or {}
    features: list[float] = [
        _norm(circadian.get("energy", 0), 0.0, 100.0),
        _norm(circadian.get("hunger", 0), 0.0, 100.0),
        _norm(circadian.get("health", 100), 0.0, 100.0),
        1.0 if circadian.get("sleeping") else 0.0,
        _norm(mood.get("valence", 0.0), -1.0, 1.0),
        _clamp(mood.get("arousal", 0.5), 0.0, 1.0),
        _clamp(mood.get("connection", 0.5), 0.0, 1.0),
        _clamp(mood.get("irritation", 0.0), 0.0, 1.0),
    ]

    actors = state.get("actors") or {}
    actor_ids = sorted(actors.keys())[:MAX_ACTORS]
    for index in range(MAX_ACTORS):
        if index < len(actor_ids):
            actor = actors[actor_ids[index]] or {}
            features += [
                _clamp(actor.get("affinity", 0.5), 0.0, 1.0),
                _clamp(actor.get("warmth", 0.5), 0.0, 1.0),
                _clamp(actor.get("tension", 0.0), 0.0, 1.0),
                _recency(actor.get("last_contact_days", 30.0)),
            ]
        else:
            features += [0.0, 0.0, 0.0, 0.0]

    plots = state.get("plots") or {}
    plot_ids = sorted(plots.keys())[:MAX_PLOTS]
    for index in range(MAX_PLOTS):
        if index < len(plot_ids):
            plot = plots[plot_ids[index]] or {}
            features += [_clamp(plot.get("progress", 0.0), 0.0, 1.0),
                         _clamp(plot.get("tension", 0.0), 0.0, 1.0)]
        else:
            features += [0.0, 0.0]

    ledger = state.get("ledger") or {}
    features += [
        _norm(ledger.get("open_obligations", 0), 0.0, 10.0),
        _recency(ledger.get("days_since_salient", 30.0)),
        _clamp(ledger.get("drama_budget", 1.0), 0.0, 1.0),
        _norm(ledger.get("due_soon", 0), 0.0, 5.0),
    ]

    world = state.get("world") or {}
    hour = float(world.get("hour", 12) or 0) % 24.0
    season = float(world.get("season", 0) or 0)
    weekday = float(world.get("weekday", 0) or 0) % 7.0
    features += [
        _norm(world.get("temperature_c", 20), -30.0, 45.0),
        1.0 if world.get("raining") else 0.0,
        math.sin(2 * math.pi * season / 4.0),
        math.cos(2 * math.pi * season / 4.0),
        math.sin(2 * math.pi * hour / 24.0),
        math.cos(2 * math.pi * hour / 24.0),
    ]

    agenda = state.get("agenda") or {}
    features += [
        _norm(agenda.get("count", 0), 0.0, 8.0),
        _norm(agenda.get("remaining", 0), 0.0, 8.0),
        math.sin(2 * math.pi * weekday / 7.0),
        math.cos(2 * math.pi * weekday / 7.0),
    ]

    somatic = state.get("somatic") or {}
    features += [
        _clamp(somatic.get("index", 0.0), 0.0, 1.0),
        _clamp(somatic.get("health_anxiety", 0.0), 0.0, 1.0),
        _clamp(somatic.get("burden", 0.0), 0.0, 1.0),
    ]

    features += [_clamp(state.get("density", 0.0), 0.0, 1.0)]
    return features
