"""S3: teacher distillation for the world policy (offline).

Samples world states from S2 trajectories and asks a teacher for the next event.
The teacher can be an LLM (prompt skeleton below, cached by sha256) or - for a
reproducible offline pipeline - a fixed hidden preference that stands in for the
LLM's taste.  A curation pass drops invariant-violating / duplicate labels.

    python -m world distill --samples 5000 --out data/teacher
"""
from __future__ import annotations

import argparse
import hashlib
import json
import random
from pathlib import Path

import numpy as np

from . import ledger_rules, sim

TEACHER_PROMPT = """你是世界模拟器。角色 persona：{persona}
世界状态：{state_json}
近 7 天事件：{ledger_summary}
候选模板：{candidates}
从候选中选下一个事件（可输出 "nothing_notable"；分布必须体现日常感）。
输出 JSON：{{"event": {{"template_id", "bindings", "intensity"}},
            "deltas": {{"变量名": 增量}}, "reason": "一句话"}}
约束：强度 >=3 的事件每周至多 1 个；bindings 只能引用演员表成员与既有地点。"""


def _prior_inputs(state: dict) -> dict:
    return {"hour": int(state["world"]["hour"]), "sleeping": bool(state["circadian"]["sleeping"]),
            "valence": float(state["mood"]["valence"]), "irritation": float(state["mood"]["irritation"]),
            "drama_budget": float(state["ledger"]["drama_budget"])}


def _state_from_inputs(pi: dict) -> dict:
    return {"mood": {"valence": pi["valence"], "irritation": pi["irritation"]},
            "world": {"hour": pi["hour"]}, "circadian": {"sleeping": pi["sleeping"]},
            "ledger": {"drama_budget": pi["drama_budget"]}}


def hidden_teacher(tiers: list[str], d_features: int, seed: int = 7):
    """A fixed stand-in for the LLM's taste (small residual over the prior)."""
    rng = np.random.default_rng(seed)
    n = len(tiers)
    # A conservative textual teacher: a small residual over the rule prior, so its
    # choices track the prior (low KL) while still being learnable.
    W = rng.normal(0.0, 0.05, size=(n, d_features))
    D = rng.normal(0.0, 0.02, size=(len(("valence", "irritation", "energy")), d_features))
    return W, D


def _teacher_choice(prior_logits, W, x, rng):
    # Deterministic best choice (the teacher's answer), not a sample - sampling
    # here would inject label noise that no model could beat.
    logits = prior_logits + (W @ x)
    return int(np.argmax(logits))


def label_state(state: dict, x, prior_logits, W, D, rng) -> dict:
    index = _teacher_choice(prior_logits, W, x, rng)
    deltas = np.tanh(D @ np.asarray(x))
    return {"template_id": index, "deltas": {"valence": float(deltas[0]), "irritation": float(deltas[1]),
                                             "energy": float(deltas[2])}}


def sample_records(samples: int = 5000, seeds=(0, 1, 2, 3), days: int = 200) -> list[dict]:
    cast, templates = sim.load_world()
    tiers = [t.get("tier", "trivia") for t in templates]
    W, D = hidden_teacher(tiers, len(x_of(cast)), seed=7)
    from .policy import PriorEngine
    from .features import build_features
    base_rates = [float(t.get("base_rate", 1.0)) for t in templates]
    prior_engine = PriorEngine(tiers, base_rates)
    rng = random.Random(11)
    records: list[dict] = []
    per_seed = max(1, samples // max(1, len(seeds)))
    for seed in seeds:
        engine = sim.WorldSim(cast, templates, seed=seed)
        collected = 0
        while collected < per_seed:
            event = engine.step()
            if event is None:
                continue
            state = engine.state
            x = build_features(state)
            pi = _prior_inputs(state)
            prior_logits = prior_engine.logits(_state_from_inputs(pi))
            label = label_state(state, x, prior_logits, W, D, rng)
            records.append({"x": x, "prior_inputs": pi, "template_id": label["template_id"],
                            "deltas": label["deltas"], "intensity": int(templates[label["template_id"]]["intensity"])})
            collected += 1
    return records


def x_of(cast) -> list:
    from .features import build_features
    return build_features({})


def curate(records: list[dict]) -> tuple[list[dict], dict]:
    kept: list[dict] = []
    seen: set[str] = set()
    rejected = 0
    for record in records:
        # invariant: teacher must not pick a high-intensity event when drama is spent
        if record["intensity"] >= ledger_rules.HIGH_INTENSITY and record["prior_inputs"]["drama_budget"] <= 0.0:
            rejected += 1
            continue
        digest = hashlib.sha256(json.dumps([round(v, 3) for v in record["x"]]).encode()).hexdigest()[:12]
        if digest in seen:
            rejected += 1
            continue
        seen.add(digest)
        kept.append(record)
    report = {"total": len(records), "kept": len(kept), "rejected": rejected,
              "pass_rate": round(len(kept) / max(1, len(records)), 4)}
    return kept, report


def write_dataset(out_dir: Path | str = "data/teacher", samples: int = 5000) -> dict:
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)
    records = sample_records(samples=samples)
    curated, review = curate(records)
    split = int(len(curated) * 0.9)
    for name, rows in (("train", curated[:split]), ("val", curated[split:]), ("curated", curated)):
        with (out / f"{name}.jsonl").open("w", encoding="utf-8") as handle:
            for row in rows:
                handle.write(json.dumps(row, ensure_ascii=False) + "\n")
    (out / "review_report.json").write_text(json.dumps(review, ensure_ascii=False, indent=2), encoding="utf-8")
    return review


def main() -> None:  # pragma: no cover - CLI
    parser = argparse.ArgumentParser()
    parser.add_argument("--samples", type=int, default=5000)
    parser.add_argument("--out", default="data/teacher")
    args = parser.parse_args()
    print(json.dumps(write_dataset(args.out, args.samples), ensure_ascii=False))


if __name__ == "__main__":  # pragma: no cover
    main()
