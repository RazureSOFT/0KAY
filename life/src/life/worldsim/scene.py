"""The place the character is standing in, as text.

The world map already knows where everyone is: `world.json` carries actor
locations and `build_map` turns that into a rendered city. What it never did was
reach the prompt, so the character had no idea which café she was sitting in and
would invent a different one every turn.

This module closes that gap without asking the model anything. The scene is
derived from world state (place, hour, weather, who else is there), and only the
parts that need judgement — atmosphere, what is off-limits, what could happen
next — are left for the model to fill through `apply_update`.
"""

from __future__ import annotations

import time
from dataclasses import dataclass, field

# Hour boundaries for the part of the day. The world sim advances an hour at a
# time, so this is the only clock the scene needs.
_DAYPARTS = (
    (5, "late night"),
    (7, "dawn"),
    (11, "morning"),
    (13, "noon"),
    (17, "afternoon"),
    (20, "evening"),
    (23, "night"),
    (24, "late night"),
)

_PLACE_KIND_LABEL = {
    "home": "home",
    "work": "workplace",
    "shop": "shop",
    "food": "place to eat",
    "park": "park",
    "transit": "station",
    "other": "place",
}


def daypart(hour: int) -> str:
    """Turn an hour of the day into a phrase a person would actually use."""
    try:
        value = int(hour) % 24
    except (TypeError, ValueError):
        return "unknown"
    for boundary, label in _DAYPARTS:
        if value < boundary:
            return label
    return "late night"


def _weather(world: dict) -> str:
    world = world if isinstance(world, dict) else {}
    raining = bool(world.get("raining"))
    try:
        temperature = float(world.get("temperature_c"))
    except (TypeError, ValueError):
        temperature = None
    if raining and temperature is not None:
        return f"rain, {temperature:.0f}°C"
    if raining:
        return "rain"
    if temperature is None:
        return ""
    return f"{temperature:.0f}°C"


def _mood_word(mood: dict) -> str:
    """A short phrase for the current mood, without inventing detail."""
    mood = mood if isinstance(mood, dict) else {}
    try:
        valence = float(mood.get("valence", 0.0))
        arousal = float(mood.get("arousal", 0.5))
        irritation = float(mood.get("irritation", 0.0))
    except (TypeError, ValueError):
        return ""
    if irritation >= 0.6:
        return "prickly and short-fused"
    if valence >= 0.55 and arousal >= 0.55:
        return "bright and talkative"
    if valence >= 0.55:
        return "settled, quietly content"
    if valence <= -0.35 and arousal >= 0.55:
        return "wound up and unhappy"
    if valence <= -0.35:
        return "low and withdrawn"
    return "flat, going through the motions"


@dataclass
class Scene:
    place: str = ""
    place_kind: str = ""
    place_desc: str = ""
    part_of_day: str = ""
    weather: str = ""
    present: list[str] = field(default_factory=list)
    mood: str = ""
    # Filled by the model, not derived: what is not acceptable here, and what
    # could plausibly happen next. Kept small on purpose.
    taboo: list[str] = field(default_factory=list)
    hooks: list[str] = field(default_factory=list)
    updated_at: float = 0.0

    def to_dict(self) -> dict:
        return {
            "place": self.place,
            "place_kind": self.place_kind,
            "place_desc": self.place_desc,
            "part_of_day": self.part_of_day,
            "weather": self.weather,
            "present": list(self.present),
            "mood": self.mood,
            "taboo": list(self.taboo),
            "hooks": list(self.hooks),
            "updated_at": self.updated_at,
        }

    @classmethod
    def from_dict(cls, data: dict | None) -> "Scene":
        data = data if isinstance(data, dict) else {}
        return cls(
            place=str(data.get("place") or ""),
            place_kind=str(data.get("place_kind") or ""),
            place_desc=str(data.get("place_desc") or ""),
            part_of_day=str(data.get("part_of_day") or ""),
            weather=str(data.get("weather") or ""),
            present=[str(item) for item in (data.get("present") or []) if str(item).strip()][:8],
            mood=str(data.get("mood") or ""),
            taboo=[str(item)[:120] for item in (data.get("taboo") or []) if str(item).strip()][:5],
            hooks=[str(item)[:160] for item in (data.get("hooks") or []) if str(item).strip()][:5],
            updated_at=float(data.get("updated_at") or 0.0),
        )

    def signature(self) -> str:
        """What makes this scene a different scene: place, time of day, who is here."""
        return "|".join([self.place, self.part_of_day, self.weather, ",".join(sorted(self.present))])


def _place_index(world_map: dict) -> dict:
    out = {}
    for location in (world_map or {}).get("locations") or []:
        if isinstance(location, dict) and location.get("id"):
            out[str(location["id"])] = location
    return out


def build_scene(
    world_state: dict,
    world_map: dict | None = None,
    *,
    actor_id: str = "",
    focus_actor_id: str = "",
    previous: Scene | None = None,
    now: float | None = None,
) -> Scene:
    """Derive the current scene from world state. Deterministic, no model call.

    `actor_id` is the character herself when the world tracks her as an actor.
    When it does not — the companion is not part of the cast — `focus_actor_id`
    supplies the person she is with, and their location becomes the scene, which
    is the closest thing to "where she is" the world actually knows.
    """
    world_state = world_state if isinstance(world_state, dict) else {}
    world = world_state.get("world") if isinstance(world_state.get("world"), dict) else {}
    hour = world.get("hour")

    scene = Scene(
        part_of_day=daypart(hour) if hour is not None else (previous.part_of_day if previous else ""),
        weather=_weather(world),
        mood=_mood_word(world_state.get("mood") if isinstance(world_state.get("mood"), dict) else {}),
        updated_at=now if now is not None else time.time(),
    )

    places = _place_index(world_map or {})
    actors = [a for a in ((world_map or {}).get("actors") or []) if isinstance(a, dict)]
    me = next((a for a in actors if str(a.get("id")) == actor_id), None) if actor_id else None
    exclude = actor_id
    if me is None and focus_actor_id:
        me = next((a for a in actors if str(a.get("id")) == focus_actor_id), None)
        # She is with that person, so they count as present rather than as her.
        exclude = ""
    location_id = str((me or {}).get("location") or "")
    location = places.get(location_id) or {}
    if location:
        scene.place = str(location.get("name") or "")
        scene.place_kind = _PLACE_KIND_LABEL.get(str(location.get("kind") or ""), "place")
        scene.place_desc = str(location.get("desc") or "")
    elif previous is not None:
        scene.place, scene.place_kind, scene.place_desc = previous.place, previous.place_kind, previous.place_desc

    scene.present = [
        str(a.get("name"))
        for a in actors
        if location_id and str(a.get("location") or "") == location_id and str(a.get("id")) != exclude and a.get("name")
    ][:8]

    # The model-authored parts survive a rebuild as long as the place has not
    # changed; a new place means the old atmosphere no longer applies.
    if previous is not None and previous.place == scene.place:
        scene.taboo = list(previous.taboo)
        scene.hooks = list(previous.hooks)
        if not scene.place_desc:
            scene.place_desc = previous.place_desc
    return scene


def apply_update(scene: Scene, update: dict) -> Scene:
    """Apply a model-proposed scene change, whitelisted.

    Place and time come from the world, not from the model — otherwise the
    character could teleport by describing it. What the model may change is the
    atmosphere it is standing in.
    """
    update = update if isinstance(update, dict) else {}
    if "place_desc" in update:
        scene.place_desc = str(update.get("place_desc") or "")[:400]
    if isinstance(update.get("taboo"), list):
        scene.taboo = [str(item)[:120] for item in update["taboo"] if str(item).strip()][:5]
    if isinstance(update.get("hooks"), list):
        scene.hooks = [str(item)[:160] for item in update["hooks"] if str(item).strip()][:5]
    if "mood" in update and str(update.get("mood") or "").strip():
        scene.mood = str(update["mood"]).strip()[:120]
    scene.updated_at = time.time()
    return scene


def render_block(scene: Scene | None) -> str:
    """Prompt-ready text. Empty when the world has nothing to say."""
    if scene is None or not (scene.place or scene.part_of_day):
        return ""
    lines = ["Scene (where you physically are right now — do not invent a different place):"]
    if scene.place:
        kind = f" ({scene.place_kind})" if scene.place_kind else ""
        lines.append(f"- Place: {scene.place}{kind}")
        if scene.place_desc:
            lines.append(f"- What it is like: {scene.place_desc}")
    if scene.part_of_day:
        lines.append(f"- Time of day: {scene.part_of_day}")
    if scene.weather:
        lines.append(f"- Weather: {scene.weather}")
    if scene.present:
        lines.append("- Here with you: " + ", ".join(scene.present))
    if scene.mood:
        lines.append(f"- How you come across right now: {scene.mood}")
    if scene.taboo:
        lines.append("- Not appropriate here: " + "; ".join(scene.taboo))
    if scene.hooks:
        lines.append("- Could plausibly happen next: " + "; ".join(scene.hooks))
    return "\n".join(lines) + "\n\n"
