"""Datetime helpers for stamps that may or may not carry a UTC offset.

Most of LIFE writes ``datetime.now().isoformat()`` (naive local time), but some
stored strings — a model/tool-supplied ``preferred_at``, a value copied from an
API, a hand-edited settings row — carry an offset (``+08:00`` / ``Z``).  Parsing
those yields an *aware* datetime, and ordering or subtracting it against a naive
``datetime.now()`` raises ``TypeError`` at the exact point a comparison runs.
Routing every parse-and-compare through these helpers normalises both sides to
UTC so the two spellings of "now" can never disagree.
"""
from __future__ import annotations

from datetime import datetime, timezone


def parse_utc(value: object) -> datetime | None:
    """Parse an ISO stamp (or accept a datetime) and return aware UTC, or ``None``.

    A naive stamp is interpreted as local time — that is what ``datetime.now()``
    writes — and an aware stamp is converted from its own offset.  ``Z`` is
    accepted because some writers emit it.  Returns ``None`` for an empty or
    malformed value so a bad stamp degrades to "unknown" instead of raising.
    """
    if isinstance(value, datetime):
        parsed = value
    else:
        raw = str(value or "").strip()
        if not raw:
            return None
        try:
            parsed = datetime.fromisoformat(raw.replace("Z", "+00:00"))
        except ValueError:
            return None
    if parsed.tzinfo is None:
        parsed = parsed.astimezone()
    return parsed.astimezone(timezone.utc)


def now_utc() -> datetime:
    """Timezone-aware "now", the counterpart to :func:`parse_utc`."""
    return datetime.now(timezone.utc)


def to_local_naive(value: datetime) -> datetime:
    """Return ``value`` as naive local time.

    Used at parse sites whose result is compared against ``datetime.now()``
    throughout the codebase: converting an aware stamp to local wall-clock and
    dropping the tzinfo keeps every existing naive subtraction correct instead
    of raising ``TypeError``.
    """
    if value.tzinfo is not None:
        value = value.astimezone()
    return value.replace(tzinfo=None)
