"""S2: headless prior-driven world simulator.

Runs the world forward with no LLM and no user: the rule prior (plus an untrained
zero residual) picks events, the ledger executes them, and the resulting state
trajectories are written to ``data/trajectories/``.  Used by S2 (invariants),
S3 (teacher sampling) and S4 (rollout gates).

    python -m world sim
"""
from __future__ import annotations

import json
import random
from pathlib import Path

from . import ledger_rules

STEPS_PER_DAY = 4
HOURS_PER_STEP = 24 // STEPS_PER_DAY


def initial_state(cast: dict, rng: random.Random | None = None) -> dict:
    rng = rng or random.Random(0)
    actors = {}
    for actor in cast.get("actors", []):
        actors[actor["id"]] = {
            "affinity": float(actor.get("affinity", 0.5)),
            "warmth": float(actor.get("warmth", 0.5)),
            "tension": float(actor.get("tension", 0.0)),
            "last_contact_days": round(rng.uniform(0, 10), 2),
            "name": actor.get("name", actor["id"]),
        }
    plots = {p["id"]: {"progress": float(p.get("progress", 0.0)), "tension": float(p.get("tension", 0.1))}
             for p in cast.get("plots", [])}
    return {
        "circadian": {"energy": 80.0, "hunger": 20.0, "health": 100.0, "sleeping": False},
        "mood": {"valence": 0.0, "arousal": 0.5, "connection": 0.5, "irritation": 0.0},
        "actors": actors,
        "plots": plots,
        "ledger": {"open_obligations": 0, "days_since_salient": 0, "drama_budget": 1.0, "due_soon": 0},
        "world": {"temperature_c": 18.0, "raining": False, "season": 1, "hour": 8, "weekday": 0},
        "agenda": {"count": 3, "remaining": 3},
        "somatic": {"burden": 0.0, "health_anxiety": 0.1, "index": 0.04},
        "density": 0.5,
    }


class WorldSim:
    def __init__(self, cast: dict, templates: list[dict], seed: int = 0, density: float = 0.5, policy=None):
        from .policy import WorldPolicy  # local import to avoid cycles
        from .features import build_features
        self.cast = cast
        self.templates = templates
        self.tiers = [t.get("tier", "trivia") for t in templates]
        base_rates = [float(t.get("base_rate", 1.0)) for t in templates]
        self.policy = policy or WorldPolicy(self.tiers, len(build_features({})), base_rates=base_rates)
        self.rng = random.Random(seed)
        self.state = initial_state(cast, self.rng)
        self.state["density"] = density
        self.ledger = {"last_times": {}, "daily_relation": 0.0, "drama_budget": 1.0}
        self.events: list[dict] = []
        self.obligations: list[dict] = []
        self.due_echoes: list[dict] = []
        self.now_step = 0
        self._features = build_features

    # ------------------------------------------------------------------ time
    @property
    def now_hours(self) -> float:
        return self.now_step * HOURS_PER_STEP

    def _advance_clock(self) -> None:
        self.now_step += 1
        total_hours = self.now_step * HOURS_PER_STEP
        self.state["world"]["hour"] = int(total_hours % 24)
        self.state["world"]["weekday"] = int((total_hours // 24) % 7)
        self.state["world"]["season"] = int((total_hours // (24 * 90)) % 4)
        self.state["world"]["temperature_c"] = round(15 + 10 * self.rng.uniform(-1, 1), 1)
        self.state["world"]["raining"] = self.rng.random() < 0.2
        sleeping = self.state["world"]["hour"] >= 23 or self.state["world"]["hour"] < 8
        self.state["circadian"]["sleeping"] = sleeping
        # energy / mood drift
        self.state["circadian"]["energy"] = max(5.0, min(100.0, self.state["circadian"]["energy"] + (6 if sleeping else -3)))
        mood = self.state["mood"]
        mood["valence"] *= 0.985
        mood["arousal"] = 0.5 + (mood["arousal"] - 0.5) * 0.98
        mood["irritation"] *= 0.97
        for actor in self.state["actors"].values():
            actor["last_contact_days"] = round(actor["last_contact_days"] + HOURS_PER_STEP / 24.0, 2)
        for plot in self.state["plots"].values():
            plot["tension"] = max(0.0, plot["tension"] * 0.99)
        # the world's own somatic state: slow drift, stirred by recent drama
        som = self.state["somatic"]
        som["health_anxiety"] = min(1.0, max(0.0, som["health_anxiety"] * 0.99
                                             + (0.01 if mood["valence"] < -0.3 else 0.0)))
        som["burden"] = min(1.0, max(0.0, som["burden"] * 0.97 + 0.008 * self.rng.random()))
        som["index"] = min(1.0, max(0.0, 0.6 * som["burden"] + 0.4 * som["health_anxiety"]))
        self.ledger["drama_budget"] = ledger_rules.clamp(self.ledger["drama_budget"] + 0.0125, 0.0, 1.0)

    # --------------------------------------------------------------- selection
    def _recent_high(self) -> bool:
        cutoff = self.now_hours - 7 * 24
        return any(int(e.get("intensity", 1)) >= ledger_rules.HIGH_INTENSITY and e["time_hours"] >= cutoff
                   for e in self.events)

    def _select(self) -> int:
        from .policy import softmax
        x = self._features(self.state)
        probs = self.policy.probs(self.state, x)
        if self._recent_high():
            probs = probs.copy()
            for i, template in enumerate(self.templates):
                if int(template.get("intensity", 1)) >= ledger_rules.HIGH_INTENSITY:
                    probs[i] = 0.0
            probs = softmax(np_log(probs))
        r = self.rng.random()
        cumulative = 0.0
        for i, p in enumerate(probs):
            cumulative += float(p)
            if r <= cumulative:
                return i
        return int(max(range(len(probs)), key=lambda k: probs[k]))

    def _bind(self, template: dict) -> dict:
        actor_id = self.rng.choice(list(self.state["actors"].keys()))
        return {"actor": actor_id}

    # ------------------------------------------------------------------ step
    def step(self) -> dict | None:
        self._advance_clock()
        # 1) fire any due obligation echoes (guarantees the echo invariant)
        for echo in list(self.due_echoes):
            if echo["due_hours"] <= self.now_hours:
                self._record_echo(echo)
                self.due_echoes.remove(echo)
        # 2) normal event
        index = self._select()
        template = self.templates[index]
        bindings = self._bind(template)
        event = {"template_id": template["template_id"], "bindings": bindings,
                 "time": f"day{self.now_step // STEPS_PER_DAY}-h{self.state['world']['hour']}",
                 "time_hours": self.now_hours, "time_day": self.now_hours / 24.0,
                 "intensity": int(template.get("intensity", 1)), "source": "prior",
                 "tier": template.get("tier", "trivia")}
        applied = ledger_rules.apply_event(
            {"last_times": self.ledger["last_times"], "daily_relation": self.ledger["daily_relation"],
             "drama_budget": self.ledger["drama_budget"]}, event, self.now_hours)
        if not applied.get("applied"):
            return None
        self.ledger["last_times"][event["template_id"]] = applied["mark_time"]
        self.ledger["daily_relation"] += abs(applied["relation_delta"])
        self.ledger["drama_budget"] = applied["drama_budget"]
        self._apply_consequences(event, applied["relation_delta"])
        self._record(event)
        self._maybe_obligation(event)
        if self.state["world"]["hour"] == 0:
            self.ledger["daily_relation"] = 0.0
        return event

    def _apply_consequences(self, event: dict, relation_delta: float) -> None:
        actor = self.state["actors"].get(event["bindings"]["actor"])
        if actor:
            actor["affinity"] = ledger_rules.clamp(actor["affinity"] + relation_delta, 0.0, 1.0)
            actor["last_contact_days"] = 0.0
        tier = event["tier"]
        intensity = event["intensity"]
        mood = self.state["mood"]
        som = self.state["somatic"]
        if tier == "upset":
            mood["valence"] = max(-1.0, mood["valence"] - 0.05 * intensity)
            mood["irritation"] = min(1.0, mood["irritation"] + 0.04 * intensity)
            # interpersonal stress shows up in the body (see cognition/somatic)
            som["health_anxiety"] = min(1.0, som["health_anxiety"] + 0.04 * intensity)
            som["burden"] = min(1.0, som["burden"] + 0.02 * intensity)
        else:
            mood["valence"] = min(1.0, mood["valence"] + 0.01 * intensity)
            som["health_anxiety"] = max(0.0, som["health_anxiety"] - 0.01)
        if intensity >= ledger_rules.HIGH_INTENSITY:
            self.state["ledger"]["days_since_salient"] = 0
            if self.state["plots"]:
                plot = self.rng.choice(list(self.state["plots"].values()))
                plot["progress"] = min(1.0, plot["progress"] + 0.02)
                plot["tension"] = min(1.0, plot["tension"] + 0.03)
        self.state["ledger"]["drama_budget"] = self.ledger["drama_budget"]
        self.state["ledger"]["open_obligations"] = len(self.obligations)

    def _maybe_obligation(self, event: dict) -> None:
        if event["tier"] not in ("shareable", "upset"):
            return
        if self.rng.random() > 0.5:
            return
        due_days = self.rng.uniform(1.0, float(ledger_rules.OBLIGATION_ECHO_DAYS))
        obligation = {"id": f"ob{len(self.obligations)}", "actor_id": event["bindings"]["actor"],
                      "created_hours": self.now_hours, "due_hours": self.now_hours + due_days * 24}
        self.obligations.append(obligation)
        self.due_echoes.append(obligation)

    def _record_echo(self, obligation: dict) -> None:
        actor_id = obligation["actor_id"]
        event = {"template_id": f"echo-{obligation['id']}", "bindings": {"actor": actor_id},
                 "time": f"day{self.now_step // STEPS_PER_DAY}", "time_hours": self.now_hours,
                 "time_day": self.now_hours / 24.0, "intensity": 2, "source": "echo", "tier": "small"}
        self._record(event)
        self.obligations = [o for o in self.obligations if o["id"] != obligation["id"]]
        self.state["ledger"]["open_obligations"] = len(self.obligations)

    def _record(self, event: dict) -> None:
        self.events.append(event)

    def run(self, days: int = 200) -> list[dict]:
        for _ in range(days * STEPS_PER_DAY):
            self.step()
        return self.events

    def trajectory(self) -> list[dict]:
        return [{"state": self.state, "event": event} for event in self.events]


def np_log(values):
    import numpy as np
    return np.log(np.maximum(np.asarray(values, dtype=float), 1e-12))


def load_world(world_dir: Path | str = "world") -> tuple[dict, list[dict]]:
    world_dir = Path(world_dir)
    cast = json.loads((world_dir / "cast.json").read_text(encoding="utf-8"))
    templates = [json.loads(line) for line in (world_dir / "templates.jsonl").read_text(encoding="utf-8").splitlines() if line.strip()]
    return cast, templates


def run_seeds(world_dir: Path | str = "world", days: int = 200, seeds=(0, 1, 2, 3),
              out_dir: Path | str = "data/trajectories") -> dict:
    cast, templates = load_world(world_dir)
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    summary = {}
    for seed in seeds:
        sim = WorldSim(cast, templates, seed=seed)
        events = sim.run(days=days)
        path = out / f"seed_{seed}.jsonl"
        with path.open("w", encoding="utf-8") as handle:
            for event in events:
                handle.write(json.dumps(event, ensure_ascii=False) + "\n")
        summary[seed] = len(events)
    return summary


if __name__ == "__main__":  # pragma: no cover - CLI
    print(json.dumps(run_seeds(), ensure_ascii=False))
