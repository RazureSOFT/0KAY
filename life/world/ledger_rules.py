"""Deterministic consequence rules for the worldsim ledger (S2+).

The model only *proposes* an event; these rules clamp and debounce it, then the
ledger applies the result.  Kept dependency-free and pure so it is trivially
testable and identical between the prior simulator and the trained policy.
"""
from __future__ import annotations

MAX_RELATION_DELTA = 0.20
DAILY_RELATION_CAP = 0.35
COOLDOWN_HOURS = 12
QUIET_START, QUIET_END = 23, 8
INTENSITY_DELTA = {  # base relationship delta by intensity tier
    1: 0.005, 2: 0.02, 3: 0.06, 4: 0.12, 5: 0.20,
}
HIGH_INTENSITY = 3
OBLIGATION_ECHO_DAYS = 14


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, float(value)))


def clamp_relation_delta(delta: float) -> float:
    return clamp(delta, -MAX_RELATION_DELTA, MAX_RELATION_DELTA)


def within_daily_cap(used: float, delta: float, cap: float = DAILY_RELATION_CAP) -> bool:
    return abs(used + delta) <= cap


def debounce(last_times: dict, template_id: str, now_hours: float, cooldown_hours: float = COOLDOWN_HOURS) -> bool:
    """True if the template may fire (cooldown elapsed)."""
    last = last_times.get(template_id)
    return last is None or (now_hours - float(last)) >= float(cooldown_hours)


def in_quiet_hours(hour: int) -> bool:
    hour = int(hour) % 24
    if QUIET_START == QUIET_END:
        return False
    return hour >= QUIET_START or hour < QUIET_END


def event_relation_delta(intensity: int, *, negative: bool = False) -> float:
    base = INTENSITY_DELTA.get(int(intensity), 0.01)
    return clamp_relation_delta(-base if negative else base)


def drama_budget_after(budget: float, intensity: int, floor: float = 0.0) -> float:
    """High-drama events spend budget; the ledger refuses them below the floor."""
    if int(intensity) >= HIGH_INTENSITY and budget <= floor:
        return budget  # not allowed to spend; caller should drop the event
    cost = 0.0 if int(intensity) < HIGH_INTENSITY else 0.05 * int(intensity)
    return clamp(budget - cost, 0.0, 1.0)


def apply_event(ledger: dict, event: dict, now_hours: float) -> dict:
    """Pure consequence application; returns the ledger deltas for one event.

    ``ledger`` is expected to expose ``last_times``, ``daily_relation`` and
    ``drama_budget``.  The caller persists the returned deltas.
    """
    intensity = int(event.get("intensity", 1))
    template_id = str(event.get("template_id", ""))
    if not debounce(ledger.get("last_times", {}), template_id, now_hours):
        return {"applied": False, "reason": "cooldown"}
    if intensity >= HIGH_INTENSITY and float(ledger.get("drama_budget", 1.0)) <= 0.0:
        return {"applied": False, "reason": "drama_floor"}
    delta = event_relation_delta(intensity)
    used = float(ledger.get("daily_relation", 0.0))
    if not within_daily_cap(used, delta):
        return {"applied": False, "reason": "daily_cap"}
    return {
        "applied": True,
        "relation_delta": delta,
        "drama_budget": drama_budget_after(float(ledger.get("drama_budget", 1.0)), intensity),
        "mark_time": now_hours,
    }
