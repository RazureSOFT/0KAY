"""S4: train the world policy (pure numpy) and enforce the four gates.

Residual softmax head (L2) + ridge incremental head (lambda), exported to
``models/world_policy.json`` with ``models/eval_report.json``.  A checkpoint is
only promoted if all four gates pass; otherwise the previous weights are kept
and the version is retained for rollback (last ``keep_checkpoints``).

    python -m world train
    # (a bare ``python world/train.py`` fails: the module uses relative imports)
"""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path

import numpy as np

from . import gates, sim
from .features import build_features
from .policy import DELTA_NAMES, PriorEngine, WorldPolicy, entropy

DELTA_ORDER = list(DELTA_NAMES)


def _version_number(name: str) -> int:
    """Numeric version from a ``world_policy.v<N>.json`` filename (0 if absent)."""
    match = re.search(r"\.v(\d+)\.json$", str(name))
    return int(match.group(1)) if match else 0


def _load_jsonl(path: Path) -> list[dict]:
    return [json.loads(line) for line in Path(path).read_text(encoding="utf-8").splitlines() if line.strip()]


def _state_from_inputs(pi: dict) -> dict:
    return {"mood": {"valence": pi["valence"], "irritation": pi["irritation"]},
            "world": {"hour": pi["hour"]}, "circadian": {"sleeping": pi["sleeping"]},
            "ledger": {"drama_budget": pi["drama_budget"]}}


def _matrices(records: list[dict], prior_engine: PriorEngine):
    X = np.array([r["x"] for r in records], dtype=float)
    prior = np.array([prior_engine.logits(_state_from_inputs(r["prior_inputs"])) for r in records], dtype=float)
    labels = np.array([int(r["template_id"]) for r in records], dtype=int)
    targets = np.array([[float(r["deltas"].get(name, 0.0)) for name in DELTA_ORDER] for r in records], dtype=float)
    return X, prior, labels, targets


def train(records: list[dict], prior_engine: PriorEngine, *, l2: float, ridge_lambda: float,
          epochs: int = 60, lr: float = 0.1) -> WorldPolicy:
    X, prior, labels, targets = _matrices(records, prior_engine)
    M, D = X.shape
    N = len(prior_engine.tiers)
    # Label smoothing toward the rule prior keeps the residual from overshooting
    # confidence, so the trained policy stays close to the prior (low KL) while
    # still ranking the teacher's choice first (top-3).
    prior_probs = np.exp(prior - prior.max(axis=1, keepdims=True))
    prior_probs = prior_probs / prior_probs.sum(axis=1, keepdims=True)
    onehot = np.zeros((M, N))
    onehot[np.arange(M), labels] = 1.0
    smoothing = 0.9
    Y = (1.0 - smoothing) * onehot + smoothing * prior_probs
    W = np.zeros((N, D))
    b = np.zeros(N)
    for _ in range(epochs):
        Z = prior + (X @ W.T + b)
        Z = Z - Z.max(axis=1, keepdims=True)
        P = np.exp(Z)
        P = P / P.sum(axis=1, keepdims=True)
        G = P - Y
        grad_w = G.T @ X / M + l2 * W
        grad_b = G.mean(axis=0)
        W -= lr * grad_w
        b -= lr * grad_b
    # ridge incremental head
    ridge = X.T @ X + ridge_lambda * np.eye(D)
    Dmat = np.linalg.solve(ridge, X.T @ targets).T  # (len(DELTA_ORDER), D)
    policy = WorldPolicy(prior_engine.tiers, D, base_rates=prior_engine.base)
    policy.W = W
    policy.b = b
    policy.D = Dmat
    return policy


def _trained_probs(policy: WorldPolicy, records: list[dict]) -> np.ndarray:
    out = []
    for record in records:
        out.append(policy.probs(_state_from_inputs(record["prior_inputs"]), record["x"]))
    return np.array(out, dtype=float)


def evaluate(policy: WorldPolicy, val: list[dict], cast: dict, templates: list[dict],
             prior_engine: PriorEngine) -> dict:
    probs = _trained_probs(policy, val)
    prior = np.array([prior_engine.weights(_state_from_inputs(r["prior_inputs"])) for r in val])
    labels = np.array([int(r["template_id"]) for r in val])
    top3 = np.argsort(-probs, axis=1)[:, :3]
    hit = float(np.mean([labels[i] in top3[i] for i in range(len(labels))]))
    kl = float(np.mean([float(np.sum(np.clip(probs[i], 1e-12, 1) *
                                      np.log(np.clip(probs[i], 1e-12, 1) / np.clip(prior[i], 1e-12, 1))))
                        for i in range(len(labels))]))
    engine = sim.WorldSim(cast, templates, seed=99, policy=policy)
    engine.run(days=100)
    horizon = engine.now_hours
    window = [e for e in engine.events if e["time_hours"] >= horizon - 30 * 24]
    counts = np.array(list(Counter(e["template_id"] for e in window).values()), dtype=float)
    window_probs = counts / max(1e-9, counts.sum())
    prior_entropy = entropy(prior_engine.weights(sim.initial_state(cast)))
    entropy_ratio = float(entropy(window_probs) / max(1e-9, prior_entropy))
    invariants = not gates.gate_rollout(engine.events, gates.load_spec())["problems"]
    return {"teacher_top3_hit": round(hit, 4), "kl_to_prior": round(kl, 4),
            "rollout_entropy_ratio": round(entropy_ratio, 4), "invariants_passed": bool(invariants)}


def promote(policy: WorldPolicy, report: dict, models_dir: Path) -> bool:
    models_dir.mkdir(parents=True, exist_ok=True)
    (models_dir / "eval_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    problems = []
    if report["teacher_top3_hit"] < gates.THRESHOLDS["teacher_top3_hit_min"]:
        problems.append("top3")
    if report["kl_to_prior"] > gates.THRESHOLDS["kl_to_prior_max"]:
        problems.append("kl")
    if report["rollout_entropy_ratio"] < gates.THRESHOLDS["prior_entropy_ratio_min"]:
        problems.append("entropy")
    if not report["invariants_passed"]:
        problems.append("invariants")
    report["promoted"] = not problems
    report["problems"] = problems
    (models_dir / "eval_report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
    if problems:
        return False
    versions = models_dir / "versions"
    versions.mkdir(parents=True, exist_ok=True)
    # Sort by the *numeric* version suffix, not lexicographically: a plain
    # `sorted(glob(...))` puts v10 before v2, so the rotation below would delete
    # the newest checkpoint instead of the oldest.  The next version is derived
    # from the max suffix (not `len(existing) + 1`), otherwise once rotation has
    # pruned older files the counter would reuse a version number and overwrite
    # a live checkpoint.
    existing = sorted(versions.glob("world_policy.v*.json"), key=lambda p: _version_number(p.name))
    next_version = max((_version_number(p.name) for p in existing), default=0) + 1
    policy.save(versions / f"world_policy.v{next_version}.json")
    for stale in existing[: max(0, len(existing) + 1 - gates.THRESHOLDS["keep_checkpoints"])]:
        stale.unlink(missing_ok=True)
    policy.save(models_dir / "world_policy.json")
    return True


def main() -> None:  # pragma: no cover - CLI
    parser = argparse.ArgumentParser()
    parser.add_argument("--teacher", default="data/teacher")
    parser.add_argument("--models", default="models")
    args = parser.parse_args()
    cast, templates = sim.load_world()
    tiers = [t.get("tier", "trivia") for t in templates]
    base_rates = [float(t.get("base_rate", 1.0)) for t in templates]
    prior_engine = PriorEngine(tiers, base_rates)
    train_records = _load_jsonl(Path(args.teacher) / "train.jsonl")
    val_records = _load_jsonl(Path(args.teacher) / "val.jsonl")
    policy = train(train_records, prior_engine, l2=gates.THRESHOLDS["l2"],
                   ridge_lambda=gates.THRESHOLDS["ridge_lambda"])
    report = evaluate(policy, val_records, cast, templates, prior_engine)
    report["train_size"] = len(train_records)
    report["val_size"] = len(val_records)
    promoted = promote(policy, report, Path(args.models))
    print(json.dumps({"report": report, "promoted": promoted}, ensure_ascii=False, indent=2))


if __name__ == "__main__":  # pragma: no cover
    main()
