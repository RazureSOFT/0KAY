"""S5: runtime integration for the world simulation.

The local policy proposes an event, the ledger executes it, the renderer turns it
into text (offline: template text; with an LLM: 2-3 sentences validated with the
diary ``quality_issues`` pattern), and consumption feeds the result into the
timeline, mood, episodic memory (theta gate) and proactive candidates.

The world is built from the owner's **worldview** when one is configured (a
free-text premise plus an optional actor/place roster); otherwise the stock
assets shipped in ``life/world/`` are used unchanged.

Default is **shadow/texture**: nothing user-facing until ``world_density=full``.
"""
from __future__ import annotations

import json
import random
from pathlib import Path

from .assets import parse_actors_text, parse_places_text
from ..logging_setup import get_logger

logger = get_logger("worldsim")

DENSITY_VALUE = {"off": 0.0, "texture": 0.5, "full": 1.0}


def _load_world(world_dir: str):
    import world.sim as world_sim
    return world_sim.load_world(world_dir)


def _load_policy(models_dir: str, tiers: list[str], base_rates: list[float]):
    from .features import build_features
    from .policy import WorldPolicy
    path = Path(models_dir) / "world_policy.json"
    if path.exists():
        return WorldPolicy.load(path)
    # Derive the width from the feature builder rather than hardcoding 65:
    # build_features() returns 68, so a hardcoded 65 crashed the first matmul
    # on any install without a shipped world_policy.json.
    return WorldPolicy(tiers, len(build_features({})), base_rates=base_rates)


def build_worldview(settings: dict | None, world_dir: str = "world", seed: int = 0):
    """Cast + templates for the given settings.

    Returns ``(cast, templates, premise, used_worldview)``. With no worldview set
    the shipped assets are loaded unchanged.
    """
    settings = settings or {}
    premise = str(settings.get("world_premise") or "").strip()
    actors = parse_actors_text(str(settings.get("world_actors") or ""))
    places = parse_places_text(str(settings.get("world_places") or ""))
    if not (premise or actors or places):
        cast, templates = _load_world(world_dir)
        return cast, templates, "", False
    from world import generate_assets  # offline asset generator, importable as `world`
    cast = generate_assets.build_cast(None, random.Random(seed), actors=actors or None,
                                      places=places or None, premise=premise)
    templates = generate_assets.build_templates(random.Random(seed), places=cast["places"])
    return cast, templates, premise, True


class WorldRuntime:
    def __init__(self, world_dir: str = "world", models_dir: str = "models",
                 data_dir: str = "data/worldsim", seed: int = 0, settings: dict | None = None):
        import world.sim as world_sim
        from .worldview import build_map, map_revision
        self.settings = settings or {}
        self.cast, self.templates, self.premise, self.uses_worldview = build_worldview(
            self.settings, world_dir, seed)
        self.world_map = build_map(self.settings)
        self.actor_locations = {
            a["id"]: a["location"] for a in self.world_map.get("actors", [])
            if a.get("id") and a.get("location")}
        self.world_key = json.dumps(
            {"premise": self.premise,
             "actors": [a.get("name") for a in self.cast.get("actors", [])],
             "places": self.cast.get("places", []),
             "map": map_revision(self.settings)},
            ensure_ascii=False, sort_keys=True)
        self.tiers = [t.get("tier", "trivia") for t in self.templates]
        self.base_rates = [float(t.get("base_rate", 1.0)) for t in self.templates]
        policy = _load_policy(models_dir, self.tiers, self.base_rates)
        self.sim = world_sim.WorldSim(self.cast, self.templates, seed=seed, policy=policy)
        self.path = Path(data_dir) / "world.json"
        self.shadow_path = Path(data_dir) / "shadow_log.jsonl"
        self._load()

    def _load(self) -> None:
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
        except (FileNotFoundError, ValueError):
            return
        # A changed worldview must not inherit the previous world's actors.
        if data.get("world_key") not in (None, self.world_key):
            return
        for key in ("state", "ledger", "obligations", "due_echoes"):
            if key in data:
                setattr(self.sim, key, data[key])
        self.sim.now_step = int(data.get("now_step", 0))
        self.sim.events = data.get("events", [])[-200:]
        if data.get("actor_locations"):
            self.actor_locations.update(data["actor_locations"])

    def persist(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        payload = {"state": self.sim.state, "ledger": self.sim.ledger, "obligations": self.sim.obligations,
                   "due_echoes": self.sim.due_echoes, "now_step": self.sim.now_step,
                   "world_key": self.world_key, "actor_locations": self.actor_locations,
                   "events": self.sim.events[-200:]}
        temporary = self.path.with_suffix(".tmp")
        temporary.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
        temporary.replace(self.path)

    # ------------------------------------------------------------------ render
    def _template(self, template_id: str):
        for template in self.templates:
            if template["template_id"] == template_id:
                return template
        return None

    def render(self, event: dict) -> str:
        actor = self.sim.state["actors"].get(event["bindings"].get("actor"), {})
        name = actor.get("name", "TA")
        template = self._template(event.get("template_id", ""))
        if template:
            return template["text"].replace("{actor}", name)
        return f"{name}那边有点小事"

    def validate(self, text: str, event: dict) -> list[str]:
        problems: list[str] = []
        names = [str(a.get("name")) for a in self.cast.get("actors", [])]
        bound = self.sim.state["actors"].get(event["bindings"].get("actor"), {}).get("name")
        if bound and bound not in text:
            problems.append("bound actor missing from render")
        # Reuse the diary质检 idea: no actor name outside the cast may appear.
        for token in set(text.replace("，", " ").replace("。", " ").split()):
            if 2 <= len(token) <= 4 and token.endswith(("先生", "女士")):
                if token not in names:
                    problems.append(f"unknown person {token}")
        return problems

    # ------------------------------------------------------------- map / place
    def _home_of(self, actor_id: str) -> str:
        for actor in self.world_map.get("actors", []):
            if actor.get("id") == actor_id:
                return actor.get("location") or ""
        return ""

    def _move_actor(self, actor_id: str) -> None:
        """Walk an actor one road along, so the map shows where they are now."""
        locations = self.world_map.get("locations") or []
        if not locations or not actor_id:
            return
        current = self.actor_locations.get(actor_id) or self._home_of(actor_id)
        neighbors = [b for a, b in self.world_map.get("edges", []) if a == current]
        neighbors += [a for a, b in self.world_map.get("edges", []) if b == current and a not in neighbors]
        if neighbors:
            self.actor_locations[actor_id] = self.sim.rng.choice(neighbors)
        elif current not in {loc["id"] for loc in locations}:
            self.actor_locations[actor_id] = self.sim.rng.choice([loc["id"] for loc in locations])

    def map_state(self) -> dict:
        return {"map": self.world_map, "actor_locations": dict(self.actor_locations)}

    # -------------------------------------------------------------------- tick
    def _sync_somatic(self, engine) -> None:
        """Feed the real agent's somatic read-out into the world state.

        The fictional world then *conditions its events* on the agent's
        somatization (feature_schema_version 2); a no-op when the gateway is
        off or the engine has no affect core.
        """
        if engine is None:
            return
        try:
            affect = getattr(engine, "affect", None)
            if affect is None or not getattr(affect.config, "use_somatic", False):
                return
            som = self.sim.state.setdefault("somatic", {})
            som["burden"] = float(affect.somatic.burden())
            som["health_anxiety"] = float(affect.somatic.health_anxiety)
            som["index"] = float(affect.somatic.index())
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)

    def tick(self, engine=None, density: str = "texture", llm=None) -> dict | None:
        if density not in ("texture", "full"):
            return None
        self._sync_somatic(engine)
        event = self.sim.step()
        if event is None:
            self.persist()
            return None
        self._move_actor(event["bindings"].get("actor"))
        text = self.render(event)
        problems = self.validate(text, event)
        if llm is not None:
            text = self._render_with_llm(llm, event, text)
            problems = self.validate(text, event)
        self.persist()
        self._log_shadow(event)
        if engine is not None:
            self._consume(engine, event, text, density)
        return {"event": event, "text": text, "problems": problems}

    def _log_shadow(self, event: dict) -> None:
        try:
            from world.shadow import shadow_record, log_event
            log_event(self.shadow_path, shadow_record(self.sim.state, event))
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)

    def _render_with_llm(self, llm, event: dict, fallback: str) -> str:
        premise = f"这个虚构世界的前提：{self.premise}\n" if self.premise else ""
        prompt = f"{premise}把这件事用 2-3 句自然的中文写出来，不要加新的人名或事实：{fallback}"
        try:
            text = str(llm(prompt)).strip() or fallback
        except Exception:
            return fallback
        if self.validate(text, event):
            return fallback  # one rewrite attempt failed -> keep the safe template
        return text

    def _consume(self, engine, event: dict, text: str, density: str) -> None:
        try:
            engine.companion.timeline_add("世界", text[:200])
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        intensity = int(event.get("intensity", 1))
        delta = {"valence": -0.04 * intensity if event.get("tier") == "upset" else 0.02 * intensity}
        try:
            engine.emotion.state.apply_delta(delta)
        except Exception as _exc:
            logger.debug("suppressed error: %s", _exc)
        if intensity >= 3:
            try:
                engine.memory.remember_episode(text[:280], prediction_error=float(intensity),
                                               novelty=0.6, tags=["world"], scope="public")
            except Exception as _exc:
                logger.debug("suppressed error: %s", _exc)
        # Only the more interesting beats become something LIFE may bring up on
        # its own; routine trivia stays in the timeline and never nags the user.
        if density == "full" and (intensity >= 2 or event.get("tier") in ("shareable", "upset")):
            try:
                engine.companion.create_proactive_candidate("user:owner", "world_event", text[:200])
            except Exception as _exc:
                logger.debug("suppressed error: %s", _exc)
