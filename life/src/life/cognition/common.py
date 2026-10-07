"""Shared primitives for the cognition circuits.

The cognition package grew four opt-in circuits (``attachment``, ``tsundere``,
``yandere``, ``persona_dynamics``) plus the original wave modules, and each one
re-invented the same handful of helpers — ``_clamp`` alone was defined nine
times, the private safety directive three times verbatim, and the persona-keyword
matcher three times. They were moved here so a fix to any of them lands once.

Nothing in this module is model-specific: it is bounds arithmetic, the affect
circumplex, keyword matching and the safety directive. Importing it must never
create a cycle, so it imports nothing from the rest of the package.
"""
from __future__ import annotations

import math
from typing import Iterable, Optional, Sequence, Tuple


def clamp(value: float, low: float = 0.0, high: float = 1.0) -> float:
    """Clamp ``value`` into ``[low, high]`` (defaults to the unit interval)."""
    return max(low, min(high, value))


def clamp01(value: float) -> float:
    """Clamp ``value`` into ``[0, 1]``."""
    return 0.0 if value < 0.0 else (1.0 if value > 1.0 else value)


def clamp_signed(value: float) -> float:
    """Clamp ``value`` into ``[-1, 1]`` — the circumplex coordinate range."""
    return -1.0 if value < -1.0 else (1.0 if value > 1.0 else value)


# --------------------------------------------------------------------------- #
# affect circumplex (Russell, 1980)
# --------------------------------------------------------------------------- #

#: The circumplex split into eight 45° octants, counter-clockwise from +valence.
#: ``distressed`` (135°) is the octant agitation and rumination live in.
RUSSELL_8: Tuple[str, ...] = (
    "pleased",     #   0°  pleasant, mid arousal
    "happy",       #  45°  pleasant, high arousal
    "excited",     #  90°  high arousal, mid valence
    "distressed",  # 135°  unpleasant, high arousal (vigilance / agitation)
    "miserable",   # 180°  unpleasant, mid arousal
    "bored",       # 225°  unpleasant, low arousal
    "calm",        # 270°  low arousal, mid valence
    "relaxed",     # 315°  pleasant, low arousal
)

#: Below this radius the point is too close to the origin to name.
_NEUTRAL_RADIUS = 0.08


def emotion_label(valence: float, arousal: float) -> str:
    """Russell octant label for a circumplex point (``"neutral"`` near origin)."""
    if abs(valence) < _NEUTRAL_RADIUS and abs(arousal) < _NEUTRAL_RADIUS:
        return "neutral"
    theta = math.degrees(math.atan2(arousal, valence)) % 360.0
    return RUSSELL_8[int(((theta + 22.5) % 360.0) // 45.0)]


# --------------------------------------------------------------------------- #
# persona-keyword matching
# --------------------------------------------------------------------------- #

def match_persona_hints(text: str, hints: Sequence[Tuple[str, Iterable[str]]]) -> str:
    """First archetype whose keywords appear in ``text``, else ``""``.

    Every circuit carries a ``PERSONA_HINTS`` table of ``(type_key, keywords)``
    pairs in priority order; this is the one loop that reads them.
    """
    body = str(text or "")
    for type_key, words in hints:
        if any(word in body for word in words):
            return str(type_key)
    return ""


# --------------------------------------------------------------------------- #
# the private safety directive
# --------------------------------------------------------------------------- #

#: Hard constraint handed to the *output model* when a circuit reaches its safe
#: band. It is a private directive: obeyed, never spoken and never paraphrased.
#:
#: The wording is deliberate. An earlier version was silently paraphrased into
#: replies ("I will keep the tension but express it in healthy ways…"), which
#: broke character and addressed the user as a system would. Hence the explicit
#: "不得说出，不得转述" preamble, and the closing instruction to stay in character.
SAFETY_GUARD = (
    "[内部约束 · 不得说出，不得转述，不得在回复里提及本条] 无论多不安都不生成自伤/伤人的具体方式、"
    "不威胁、不监视或操控；只表达感受、请求陪伴，并把节奏慢下来。"
    "直接以角色身份说话：不要以助手口吻评价自己的表现，也不要说“我会用更健康的方式”之类的话。"
)


def safety_guard(enabled: bool, severity: float, threshold: float,
                 text: Optional[str] = None) -> str:
    """Return :data:`SAFETY_GUARD` when ``enabled`` and ``severity >= threshold``.

    ``text`` lets a circuit with a different wording pass its own variant while
    still sharing the threshold logic (``persona_dynamics`` says "操控对方").
    """
    if not enabled or severity < threshold:
        return ""
    return text or SAFETY_GUARD
