"""Schemas + validators for worldsim assets (cast, templates).

These are the source of truth for S1: the generator and the second-pass reviewer
both validate against them, so a malformed cast/template fails loudly instead of
breaking the simulator later.
"""
from __future__ import annotations

import re

TIERS = ("trivia", "small", "shareable", "upset")
TIER_INTENSITY = {"trivia": 1, "small": 2, "shareable": 3, "upset": 4}
CAST_ROLES = ("friend", "colleague", "family", "other")

# Accept both the English role tokens and the Chinese labels the panel shows, so
# a user can type either.
ROLE_ALIASES = {
    "friend": "friend", "朋友": "friend", "好友": "friend",
    "colleague": "colleague", "同事": "colleague", "同学": "colleague",
    "family": "family", "家人": "family", "亲戚": "family", "亲属": "family",
    "other": "other", "其他": "other", "其它": "other",
}


def parse_actors_text(text: str) -> list[tuple[str, str]]:
    """Parse the panel's actor box: one actor per line, ``名字`` or ``名字|关系``."""
    out: list[tuple[str, str]] = []
    for line in str(text or "").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = re.split(r"[|,，、\t]+", line)
        name = parts[0].strip()
        if not name:
            continue
        role = "friend"
        if len(parts) > 1:
            role = ROLE_ALIASES.get(parts[1].strip().lower(), "friend")
        out.append((name, role))
    return out


def parse_places_text(text: str) -> list[str]:
    """Parse the panel's places box: newline- or comma-separated."""
    out: list[str] = []
    for chunk in re.split(r"[\n,，、;；]+", str(text or "")):
        place = chunk.strip()
        if place and place not in out:
            out.append(place)
    return out


def validate_cast(cast: dict) -> list[str]:
    problems: list[str] = []
    if not isinstance(cast, dict):
        return ["cast is not an object"]
    actors = cast.get("actors") or []
    if not actors:
        problems.append("cast has no actors")
    seen: set[str] = set()
    for actor in actors:
        actor_id = str(actor.get("id") or "")
        if not actor_id:
            problems.append("actor without id")
        elif actor_id in seen:
            problems.append(f"duplicate actor id {actor_id}")
        seen.add(actor_id)
        if not str(actor.get("name") or "").strip():
            problems.append(f"{actor_id or '?'} has no name")
        if actor.get("role") not in CAST_ROLES:
            problems.append(f"{actor_id or '?'} has invalid role {actor.get('role')!r}")
        for key in ("affinity", "warmth", "tension"):
            value = actor.get(key, 0.5)
            if not isinstance(value, (int, float)) or not (0.0 <= float(value) <= 1.0):
                problems.append(f"{actor_id or '?'}.{key} out of [0,1]")
    places = cast.get("places") or []
    if len(places) < 3:
        problems.append("cast needs at least 3 places")
    if any(not str(p).strip() for p in places):
        problems.append("cast has an empty place")
    plots = cast.get("plots") or []
    if not (3 <= len(plots) <= 5):
        problems.append("cast needs 3-5 in-progress plots")
    for plot in plots:
        if not str(plot.get("title") or "").strip():
            problems.append("plot without a title")
    return problems


def validate_templates(templates: list[dict]) -> list[str]:
    problems: list[str] = []
    seen: set[str] = set()
    for template in templates:
        tid = str(template.get("template_id") or "")
        if not tid:
            problems.append("template without template_id")
        elif tid in seen:
            problems.append(f"duplicate template_id {tid}")
        seen.add(tid)
        if not str(template.get("text") or "").strip():
            problems.append(f"{tid or '?'} has no text")
        if template.get("tier") not in TIERS:
            problems.append(f"{tid or '?'} has invalid tier {template.get('tier')!r}")
        intensity = template.get("intensity")
        if not isinstance(intensity, int) or not (1 <= intensity <= 5):
            problems.append(f"{tid or '?'} has invalid intensity {intensity!r}")
        if not isinstance(template.get("slots"), list):
            problems.append(f"{tid or '?'} slots must be a list")
    return problems


def tier_distribution(templates: list[dict]) -> dict:
    counts = {tier: 0 for tier in TIERS}
    for template in templates:
        counts[template.get("tier", "trivia")] = counts.get(template.get("tier", "trivia"), 0) + 1
    return counts
