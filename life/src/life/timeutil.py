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


def as_utc_iso(value: object) -> str:
    """Serialise an instant as UTC ISO-8601.

    Storage format for anything that records when something happened. A naive
    value is taken to be this machine's local time (what older builds wrote);
    anything aware is converted. The offset in the output is what makes the
    value mean the same thing on a machine in another timezone.
    """
    parsed = parse_utc(value)
    if parsed is None:
        parsed = now_utc()
    return parsed.isoformat()
