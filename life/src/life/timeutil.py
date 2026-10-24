from __future__ import annotations

from datetime import datetime, timezone


def parse_utc(value: object) -> datetime | None:
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
    return datetime.now(timezone.utc)


def to_local_naive(value: datetime) -> datetime:
    if value.tzinfo is not None:
        value = value.astimezone()
    return value.replace(tzinfo=None)
