"""Per-person context for the cast of the world simulation.

The world simulator already knows who exists, where they are, and how each of
them feels about the user. What it never had was a memory *per person*, so every
character line was written from the same global pool. That is both bland and a
leak: something one character said in confidence could surface when a different
character spoke.

`CastContexts` keeps a small separate record for each actor:

- the last few exchanges with that actor, and nobody else's,
- facts that actor knows, private to them by default,
- how that actor reads the others — affinity only, never their secrets.

Rendering for actor A reads A's record and nothing else, so isolation is a
property of the data layout rather than a filter bolted on afterwards.
"""

from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path

MAX_TURNS = 8
MAX_FACTS = 12
MAX_TURN_CHARS = 400
MAX_FACT_CHARS = 240

_CLOSENESS = ((0.75, "close"), (0.55, "friendly"), (0.35, "civil"), (0.0, "distant"))


def closeness(affinity: float) -> str:
    try:
        value = float(affinity)
    except (TypeError, ValueError):
        value = 0.5
    for floor, label in _CLOSENESS:
        if value >= floor:
            return label
    return "distant"


@dataclass
class ActorContext:
    """What one person remembers, knows, and how they read the others."""

    actor_id: str
    name: str = ""
    turns: list[dict] = field(default_factory=list)
    facts: list[str] = field(default_factory=list)
    relations: dict[str, float] = field(default_factory=dict)

    def observe(self, speaker: str, text: str, *, limit: int = MAX_TURNS) -> None:
        body = str(text or "").strip()[:MAX_TURN_CHARS]
        if not body:
            return
        self.turns.append({"speaker": "actor" if speaker == "actor" else "user", "text": body})
        if len(self.turns) > limit:
            del self.turns[: len(self.turns) - limit]

    def add_fact(self, text: str, *, limit: int = MAX_FACTS) -> None:
        body = str(text or "").strip()[:MAX_FACT_CHARS]
        if not body or body in self.facts:
            return
        self.facts.append(body)
        if len(self.facts) > limit:
            del self.facts[: len(self.facts) - limit]

    def relate(self, other_id: str, affinity: float) -> None:
        key = str(other_id or "").strip()
        if not key or key == self.actor_id:
            return
        try:
            self.relations[key] = max(0.0, min(1.0, float(affinity)))
        except (TypeError, ValueError):
            return

    def to_dict(self) -> dict:
        return {
            "actor_id": self.actor_id,
            "name": self.name,
            "turns": list(self.turns),
            "facts": list(self.facts),
            "relations": dict(self.relations),
        }

    @classmethod
    def from_dict(cls, data: dict | None) -> "ActorContext":
        data = data if isinstance(data, dict) else {}
        actor = cls(actor_id=str(data.get("actor_id") or ""), name=str(data.get("name") or ""))
        for turn in data.get("turns") or []:
            if isinstance(turn, dict):
                actor.observe(str(turn.get("speaker") or ""), str(turn.get("text") or ""))
        for fact in data.get("facts") or []:
            actor.add_fact(str(fact))
        relations = data.get("relations")
        if isinstance(relations, dict):
            for key, value in relations.items():
                actor.relate(str(key), value)
        return actor

    def render(self, names: dict[str, str] | None = None) -> str:
        """Prompt text for this actor only. Empty when nothing is known yet."""
        names = names or {}
        lines: list[str] = []
        if self.turns:
            lines.append("What you remember of your last conversation with them:")
            for turn in self.turns[-MAX_TURNS:]:
                who = "you" if turn.get("speaker") == "actor" else "them"
                lines.append(f"- {who}: {turn.get('text', '')}")
        if self.facts:
            lines.append("Things you know (they are yours; do not volunteer them unprompted):")
            lines.extend(f"- {fact}" for fact in self.facts)
        if self.relations:
            rows = sorted(self.relations.items(), key=lambda item: item[1], reverse=True)[:6]
            described = ", ".join(
                f"{names.get(other, other)} ({closeness(value)})" for other, value in rows
            )
            lines.append(f"People you know: {described}")
        return "\n".join(lines)


class CastContexts:
    """The whole cast, each with their own record. Persisted as one JSON file."""

    def __init__(self, path: str | Path | None = None, names: dict[str, str] | None = None):
        self.path = Path(path) if path else None
        self.names = {str(key): str(value) for key, value in (names or {}).items() if key}
        self.actors: dict[str, ActorContext] = {}
        self.load()

    # -- access -----------------------------------------------------------
    def ensure(self, actor_id: str, name: str = "") -> ActorContext:
        key = str(actor_id or "").strip()
        if not key:
            key = "unknown"
        actor = self.actors.get(key)
        if actor is None:
            actor = ActorContext(actor_id=key, name=str(name or self.names.get(key) or key))
            self.actors[key] = actor
        elif name and not actor.name:
            actor.name = str(name)
        if name:
            self.names[key] = str(name)
        return actor

    def get(self, actor_id: str) -> ActorContext | None:
        return self.actors.get(str(actor_id or "").strip())

    def actor_ids(self) -> list[str]:
        return sorted(self.actors)

    # -- writes -----------------------------------------------------------
    def observe(self, actor_id: str, speaker: str, text: str) -> None:
        self.ensure(actor_id).observe(speaker, text)

    def add_fact(self, actor_id: str, text: str) -> None:
        self.ensure(actor_id).add_fact(text)

    def relate(self, actor_id: str, other_id: str, affinity: float) -> None:
        self.ensure(actor_id).relate(other_id, affinity)

    # -- reads ------------------------------------------------------------
    def render(self, actor_id: str) -> str:
        actor = self.get(actor_id)
        return actor.render(self.names) if actor else ""

    def prompt_for(self, actor_id: str, *, self_name: str = "the user") -> str:
        """A ready-to-use system block for one actor's line.

        Only that actor's material is included. If the actor is unknown the
        result still names them, so the model cannot silently borrow someone
        else's history.
        """
        actor = self.ensure(actor_id)
        who = actor.name or "this person"
        head = f"You are {who}, speaking with {self_name}."
        body = actor.render(self.names)
        rules = ("Reply in first person, in character, one or two sentences. "
                 "Use only what you know here; never mention another person's secrets.")
        return "\n".join(part for part in (head, body, rules) if part)

    def last_line(self, actor_id: str) -> str:
        actor = self.get(actor_id)
        if not actor or not actor.turns:
            return ""
        return str(actor.turns[-1].get("text") or "")

    # -- persistence -------------------------------------------------------
    def load(self) -> None:
        if self.path is None:
            return
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
        except (FileNotFoundError, ValueError, OSError):
            return
        rows = data.get("actors") if isinstance(data, dict) else None
        if isinstance(rows, list):
            for row in rows:
                actor = ActorContext.from_dict(row)
                if actor.actor_id:
                    self.actors[actor.actor_id] = actor
        if isinstance(data, dict) and isinstance(data.get("names"), dict):
            for key, value in data["names"].items():
                self.names.setdefault(str(key), str(value))

    def save(self) -> None:
        if self.path is None:
            return
        try:
            self.path.parent.mkdir(parents=True, exist_ok=True)
            payload = {
                "names": self.names,
                "actors": [self.actors[key].to_dict() for key in sorted(self.actors)],
            }
            temporary = self.path.with_suffix(".tmp")
            temporary.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
            temporary.replace(self.path)
        except OSError:
            return


def minor_model(settings: dict | None, actor_id: str, important: set[str] | list[str] | None = None) -> str:
    """Which model should write this actor's lines.

    Important actors keep the main model; everyone else can be routed to a
    cheaper one. The route lives in the existing `model_routes` setting as
    `minor_actor`, so there is one place to configure model routing.
    """
    if actor_id and actor_id in set(important or ()):
        return ""
    routes = (settings or {}).get("model_routes") if isinstance(settings, dict) else None
    if isinstance(routes, str):
        try:
            routes = json.loads(routes or "{}")
        except ValueError:
            routes = {}
    if isinstance(routes, dict):
        return str(routes.get("minor_actor") or "").strip()
    return ""
