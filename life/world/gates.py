"""Executable acceptance gates for the worldsim pipeline (S0..S6).

Thresholds are centralised here so every stage's pass/fail is one constant away
from being tuned, and every gate is a plain function returning
``{"gate", "passed", ...metrics...}`` so it can be called from tests or CI.
"""
from __future__ import annotations

import json
import math
from collections import Counter
from pathlib import Path

SPEC_PATH = Path(__file__).resolve().parent / "spec.json"

THRESHOLDS = {
    # S0
    "state_dim_min": 50,
    "state_dim_max": 150,
    # S1
    "template_count_min": 250,
    "template_count_max": 360,
    "template_dist": {"trivia": 0.70, "small": 0.25, "shareable": 0.04, "upset": 0.01},
    "chi_square_max": 15.0,          # df=3, p~0.001
    "review_pass_rate_min": 0.80,
    # S2 / S4 rollout
    "prior_entropy_ratio_min": 0.60,
    "high_intensity_per_week_max": 1,
    "obligation_echo_days": 14,
    # S3
    "curated_pass_rate_min": 0.60,
    # S4
    "teacher_top3_hit_min": 0.50,
    "kl_to_prior_max": 0.50,         # nats
    "l2": 1.0,
    "ridge_lambda": 10.0,
    "keep_checkpoints": 4,           # rollback: keep the last N weight versions
}


# ---------------------------------------------------------------- spec helpers
def load_spec(path: Path | str = SPEC_PATH) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def expand_features(spec: dict) -> list[dict]:
    """Flatten spec groups (including ``pattern`` groups) into ordered features."""
    features: list[dict] = []
    for group in spec.get("state_groups", []):
        if "features" in group:
            for feature in group["features"]:
                features.append({**feature, "group": group["group"]})
        elif "pattern" in group:
            pattern = group["pattern"]
            for index in range(int(pattern["count"])):
                for field in pattern["fields"]:
                    features.append({
                        "name": f"{pattern['prefix'].format(i=index)}{field['suffix']}",
                        "min": field.get("min", 0.0), "max": field.get("max", 1.0),
                        "group": group["group"]})
    return features


def validate_spec(spec: dict) -> list[str]:
    problems: list[str] = []
    features = expand_features(spec)
    if not features:
        problems.append("spec has no features")
    if not (THRESHOLDS["state_dim_min"] <= len(features) <= THRESHOLDS["state_dim_max"]):
        problems.append(f"feature count {len(features)} outside "
                        f"[{THRESHOLDS['state_dim_min']},{THRESHOLDS['state_dim_max']}]")
    seen: set[str] = set()
    for feature in features:
        name = feature.get("name")
        if not name:
            problems.append("feature without a name")
            continue
        if name in seen:
            problems.append(f"duplicate feature {name}")
        seen.add(name)
        if "min" not in feature or "max" not in feature:
            problems.append(f"{name} has no [min,max]")
        elif not float(feature["min"]) < float(feature["max"]):
            problems.append(f"{name} has an empty range")
    for key in ("event_schema", "ledger_schema", "invariants", "density_modes"):
        if not spec.get(key):
            problems.append(f"missing {key}")
    if tuple(spec.get("density_modes", ())) != ("off", "texture", "full"):
        problems.append("density_modes must be exactly off/texture/full")
    return problems


def validate_state_vector(vector, spec: dict) -> list[str]:
    features = expand_features(spec)
    if len(vector) != len(features):
        return [f"vector length {len(vector)} != spec {len(features)}"]
    problems: list[str] = []
    for value, feature in zip(vector, features):
        try:
            number = float(value)
        except (TypeError, ValueError):
            problems.append(f"{feature['name']} is not numeric")
            continue
        if not (float(feature["min"]) <= number <= float(feature["max"])):
            problems.append(f"{feature['name']}={number} outside [{feature['min']},{feature['max']}]")
    return problems


# ------------------------------------------------------------------- metrics
def entropy(counts) -> float:
    total = float(sum(counts)) or 1.0
    return -sum((c / total) * math.log(c / total) for c in counts if c > 0)


def _chi_square(observed: dict, expected: dict, total: int) -> float:
    statistic = 0.0
    for key, share in expected.items():
        exp = max(1e-9, share * total)
        obs = observed.get(key, 0)
        statistic += (obs - exp) ** 2 / exp
    return statistic


# --------------------------------------------------------------------- S0
def gate_s0(path: Path | str = SPEC_PATH) -> dict:
    spec = load_spec(path)
    problems = validate_spec(spec)
    return {"gate": "S0", "passed": not problems, "problems": problems,
            "features": len(expand_features(spec))}


# --------------------------------------------------------------------- S1
def gate_s1(cast_path, templates_path, review_path=None) -> dict:
    cast_path, templates_path = Path(cast_path), Path(templates_path)
    missing = [str(p) for p in (cast_path, templates_path) if not p.exists()]
    if missing:
        return {"gate": "S1", "passed": False, "missing": missing}
    templates = [json.loads(line) for line in templates_path.read_text(encoding="utf-8").splitlines() if line.strip()]
    problems: list[str] = []
    if not (THRESHOLDS["template_count_min"] <= len(templates) <= THRESHOLDS["template_count_max"]):
        problems.append(f"template count {len(templates)} outside range")
    tiers = Counter(t.get("tier", "trivia") for t in templates)
    if templates:
        chi = _chi_square(tiers, THRESHOLDS["template_dist"], len(templates))
        if chi > THRESHOLDS["chi_square_max"]:
            problems.append(f"tier distribution chi-square {chi:.2f} > {THRESHOLDS['chi_square_max']}")
    if review_path and Path(review_path).exists():
        review = json.loads(Path(review_path).read_text(encoding="utf-8"))
        if float(review.get("pass_rate", 0.0)) < THRESHOLDS["review_pass_rate_min"]:
            problems.append("review pass rate below threshold")
    return {"gate": "S1", "passed": not problems, "problems": problems, "templates": len(templates)}


# --------------------------------------------------------------- S2 / S4
def gate_rollout(events, spec: dict | None = None) -> dict:
    """Invariant + entropy checks shared by S2 (prior) and S4 (trained)."""
    spec = spec or load_spec()
    events = list(events)
    problems: list[str] = []
    # high-intensity events <= 1 per rolling 7 days (timestamps in days)
    highs = sorted(float(e.get("time_day", 0.0)) for e in events if int(e.get("intensity", 1)) >= 3)
    for earlier, later in zip(highs, highs[1:]):
        if later - earlier < 7.0:
            problems.append(f"two high-intensity events {later - earlier:.1f} days apart")
            break
    # 30-day rolling type entropy vs prior entropy
    max_day = max((float(e.get("time_day", 0.0)) for e in events), default=0.0)
    window = [e for e in events if float(e.get("time_day", 0.0)) >= max_day - 30.0]
    kinds = Counter(str(e.get("template_id", "")) for e in window)
    if kinds:
        prior = {k: 1.0 for k in kinds}
        if entropy(list(kinds.values())) < THRESHOLDS["prior_entropy_ratio_min"] * entropy(list(prior.values())):
            problems.append("event-type entropy below 60% of prior")
    return {"gate": "rollout", "passed": not problems, "problems": problems, "events": len(events)}


# --------------------------------------------------------------------- S3
def gate_s3(curated_path) -> dict:
    curated_path = Path(curated_path)
    if not curated_path.exists():
        return {"gate": "S3", "passed": False, "missing": [str(curated_path)]}
    records = [json.loads(line) for line in curated_path.read_text(encoding="utf-8").splitlines() if line.strip()]
    passed = [r for r in records if r.get("passed", r.get("curated", False))]
    rate = (len(passed) / len(records)) if records else 0.0
    return {"gate": "S3", "passed": rate > THRESHOLDS["curated_pass_rate_min"],
            "pass_rate": round(rate, 4), "records": len(records)}


# --------------------------------------------------------------------- S4
def gate_s4(report_path) -> dict:
    report_path = Path(report_path)
    if not report_path.exists():
        return {"gate": "S4", "passed": False, "missing": [str(report_path)]}
    report = json.loads(report_path.read_text(encoding="utf-8"))
    problems: list[str] = []
    if float(report.get("teacher_top3_hit", 0.0)) < THRESHOLDS["teacher_top3_hit_min"]:
        problems.append("teacher top-3 hit below threshold")
    if float(report.get("kl_to_prior", 1e9)) > THRESHOLDS["kl_to_prior_max"]:
        problems.append("KL to prior above threshold")
    if float(report.get("rollout_entropy_ratio", 0.0)) < THRESHOLDS["prior_entropy_ratio_min"]:
        problems.append("rollout entropy below threshold")
    if not bool(report.get("invariants_passed", False)):
        problems.append("rollout invariants failed")
    return {"gate": "S4", "passed": not problems, "problems": problems}


if __name__ == "__main__":
    result = gate_s0()
    print(json.dumps(result, ensure_ascii=False, indent=2))
    raise SystemExit(0 if result["passed"] else 1)
