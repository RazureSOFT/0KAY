"""S6: shadow mode + guarded weekly weight update with rollback.

Runtime events are logged while density is texture/full (shadow).  A weekly job
can take one training step from the accumulated (features, chosen event, user
reaction, valence delta) log, but it only promotes the new weights if all four S4
gates pass; otherwise the old checkpoint is kept.  The last
``keep_checkpoints`` versions are retained for rollback.

This never enables user-facing behaviour by itself: that still requires
``world_density=full`` and an explicit user decision.
"""
from __future__ import annotations

import json
from pathlib import Path

from . import sim, train as train_mod
from .features import build_features
from .policy import PriorEngine


def log_event(path, record: dict) -> None:
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(record, ensure_ascii=False) + "\n")


def shadow_record(state: dict, event: dict, valence_delta: float = 0.0, reaction: str = "") -> dict:
    # prior_inputs snapshot the state the *rule prior* reads, so a weekly
    # update can train against the same prior the runtime used instead of a
    # neutralised placeholder.
    mood = state.get("mood") or {}
    world = state.get("world") or {}
    circadian = state.get("circadian") or {}
    ledger = state.get("ledger") or {}
    return {"x": build_features(state), "template_id": event.get("template_id", ""),
            "intensity": int(event.get("intensity", 1)), "valence_delta": float(valence_delta),
            "reaction": reaction,
            "prior_inputs": {"hour": world.get("hour", 12), "sleeping": bool(circadian.get("sleeping")),
                             "valence": mood.get("valence", 0.0), "irritation": mood.get("irritation", 0.0),
                             "drama_budget": ledger.get("drama_budget", 1.0)}}


def _load_log(path) -> list[dict]:
    path = Path(path)
    if not path.exists():
        return []
    return [json.loads(line) for line in path.read_text(encoding="utf-8").splitlines() if line.strip()]


def weekly_update(log_path, models_dir: str = "models", world_dir: str = "world",
                  epochs: int = 30, lr: float = 0.5) -> dict:
    """One guarded update from the shadow log; promotes only if gates pass."""
    import numpy as np
    cast, templates = sim.load_world(world_dir)
    templates_by_id = {t["template_id"]: i for i, t in enumerate(templates)}
    tiers = [t.get("tier", "trivia") for t in templates]
    base_rates = [float(t.get("base_rate", 1.0)) for t in templates]
    prior_engine = PriorEngine(tiers, base_rates)

    raw = _load_log(log_path)
    records: list[dict] = []
    for row in raw:
        index = templates_by_id.get(str(row.get("template_id")))
        if index is None:
            continue
        prior = row.get("prior_inputs") or {}
        records.append({"x": row["x"],
                        "prior_inputs": {"hour": prior.get("hour", 12), "sleeping": bool(prior.get("sleeping", False)),
                                         "valence": prior.get("valence", 0.0), "irritation": prior.get("irritation", 0.0),
                                         "drama_budget": prior.get("drama_budget", 1.0)},
                        "template_id": index, "deltas": {"valence": float(row.get("valence_delta", 0.0)),
                                                         "irritation": 0.0, "energy": 0.0},
                        "intensity": int(row.get("intensity", 1))})
    if len(records) < 25:
        return {"updated": False, "reason": "not enough shadow data", "records": len(records)}
    # Evaluate on a held-out tail (25%, min 5 records): scoring the trained
    # policy on its own training rows inflated the S4 gates instead of
    # guarding them.
    n_eval = max(5, len(records) // 4)
    train_records, eval_records = records[:-n_eval], records[-n_eval:] if n_eval < len(records) else records

    policy = train_mod.train(train_records, prior_engine, l2=train_mod.gates.THRESHOLDS["l2"],
                             ridge_lambda=train_mod.gates.THRESHOLDS["ridge_lambda"],
                             epochs=epochs, lr=lr)
    report = train_mod.evaluate(policy, eval_records, cast, templates, prior_engine)
    report["source"] = "shadow_weekly"
    report["train_size"] = len(train_records)
    report["eval_size"] = len(eval_records)
    promoted = train_mod.promote(policy, report, Path(models_dir))
    return {"updated": True, "promoted": promoted, "records": len(records), "report": report}
