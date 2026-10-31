"""One budget, shared by every part of the prompt.

The prompt used to be assembled from unbounded pieces: recalled memories, the
skill block and the scene were appended in full, and only the persona block was
cut, at a hard-coded 8000 characters. That is backwards — the persona block is
the part that has to survive, and the recalled memories are the part that grows
without limit as the database fills up.

Every part now gets a share of one budget and a floor it may not fall below;
when the total is exceeded the biggest part is shrunk first, never the smallest.
"""

from __future__ import annotations

from typing import Iterable

# Shares of the total, in the order they appear in the prompt.
SHARES: tuple[tuple[str, float], ...] = (
    ("persona", 0.34),
    ("memory", 0.30),
    ("world", 0.16),
    ("skills", 0.10),
    ("history", 0.10),
)

# What a part keeps even when everything else is competing for room. The persona
# floor carries the commitments and the relationship belief; memory keeps enough
# for a couple of episodes.
FLOORS = {"persona": 1400, "memory": 700, "world": 0, "skills": 0, "history": 0}

DEFAULT_TOTAL = 9000

ELLIPSIS = "\n…\n"


def split_totals(total: int, shares: Iterable[tuple[str, float]] | None = None,
                 floors: dict[str, int] | None = None) -> dict[str, int]:
    """Turn one total into a per-part allowance, honouring floors where possible."""
    shares = tuple(shares or SHARES)
    floors = dict(FLOORS if floors is None else floors)
    total = max(0, int(total))
    want = {name: max(0, int(total * share)) for name, share in shares}
    floor_map = {name: max(0, int(floors.get(name, 0))) for name, _ in shares}

    if sum(floor_map.values()) > total:
        # The floors alone do not fit. Scale them rather than pretending the
        # budget is bigger than it is.
        ratio = total / float(sum(floor_map.values()) or 1)
        return {name: int(floor_map.get(name, 0) * ratio) for name, _ in shares}

    over = sum(want.values()) - total
    if over > 0:
        # Largest first, and stop at the floor: shrinking the smallest part
        # first would delete exactly the specific detail the turn needs.
        for name in sorted(want, key=lambda key: want[key], reverse=True):
            if over <= 0:
                break
            room = max(0, want[name] - floor_map[name])
            take = min(room, over)
            want[name] -= take
            over -= take
    for name, floor in floor_map.items():
        want[name] = max(want.get(name, 0), floor)
    return want


def fit(text: str, limit: int, keep_tail: int | None = None) -> str:
    """Cut text to `limit` characters, keeping the head and the tail.

    The head carries the framing and the tail carries whatever was appended last
    (usually the most specific fact), so both survive the cut.
    """
    body = str(text or "")
    limit = max(0, int(limit))
    if len(body) <= limit:
        return body
    if limit <= 0:
        return ""
    tail = int(limit * 0.35) if keep_tail is None else max(0, min(int(keep_tail), limit))
    head = max(0, limit - tail)
    if head <= 0:
        return ELLIPSIS + body[-tail:] if tail else ""
    return body[:head] + ELLIPSIS + (body[-tail:] if tail else "")


def apply(parts: dict[str, str], total: int | None = None,
          shares: Iterable[tuple[str, float]] | None = None,
          floors: dict[str, int] | None = None) -> dict[str, str]:
    """Fit every part into its share of one total."""
    table = split_totals(DEFAULT_TOTAL if total is None else total, shares, floors)
    return {name: fit(text, table.get(name, 0)) for name, text in parts.items()}


def recall_top_k(chars: int, *, per_item: int = 220, low: int = 3, high: int = 6) -> int:
    """How many memories fit in the memory share, clamped to a sane range."""
    if high < low:
        high = low
    try:
        budget = int(chars)
    except (TypeError, ValueError):
        budget = 0
    if budget <= 0:
        return low
    return max(low, min(high, budget // max(1, int(per_item))))
