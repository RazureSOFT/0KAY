# worldsim — autonomous fictional world (staged build)

> Part of **[0KAY](../README.md)** — a self-hosted AI companion that remembers
> you, with a real agent underneath. `worldsim` is a L.I.F.E subsystem: the
> fictional life world the companion lives in.

A fictional life world whose evolution is driven at runtime by a **local numpy
model** (zero LLM calls); the LLM is used only offline (asset generation, teacher
labelling, event text rendering). Built in stages S0..S6, each behind an
executable acceptance gate in `world/gates.py`.

## Hard constraints (any violation = rework)

1. Runtime world evolution makes **no LLM calls**. The policy is pure numpy;
   weights live in JSON (`models/world_policy.json`).
2. **Model proposes, ledger decides.** Policy output passes a constraint layer
   (cooldown / caps / debounce / clamps); a deterministic ledger executes it and
   the policy is re-fed from the ledger each step (open loop, no AR drift).
3. **Residual structure**: `event distribution = softmax(prior_logits + W @ x)`,
   `W` initialised to 0 (untrained == prior rules exactly). Incremental head is
   ridge regression, each output `tanh`-bounded.
4. `life.worldsim.features.build_features` is the **single** feature code path
   shared by training and runtime.
5. Everything hangs behind the `world_density` setting (`off`/`texture`/`full`,
   default **off**) using the existing `SETTING_DEFAULTS` + `validate_setting`.
6. Offline LLM calls are cached by prompt `sha256` under `data/teacher/cache/`;
   fixed seeds throughout.
7. Creative decisions derive from persona/settings; when unsure, pick the
   conservative default and record it here.

## Reference verification (as built)

Verified against the code; notes where the task description differed:

- `engine.py`: turn orchestration in `_process_turn`; `enqueue_reflection` is
  called at the end of a turn; `_reflect` extracts durable facts.
  **Discrepancy:** `_cognition_settle` still exists but is *no longer called by
  the turn path* since the Phase 2 real-feedback change — the turn is settled
  later by `_receive_feedback` (delayed reward). Kept for tests/back-compat.
- `companion.py`: `SETTING_DEFAULTS` / `CONFIG_SCHEMA` / `validate_setting`
  (+`CHOICE_SETS`) as expected; `world_knowledge` table + `upsert_world_knowledge`
  /`list_world_knowledge`; `personal_goals`; `proactive_candidates`.
- `memory/memory.py`: `remember_episode` gates on `|pe| > theta_pe or n > theta_n`
  via `_thresholds()` (now fed the live cognition config).
- `diary.py`: **Discrepancy:** `quality_issues` is a *module-level function*
  (`diary.quality_issues`), not a method; `generate_journal` reuses it to decide
  a rewrite. The worldsim renderer reuses the same pattern.
- `circadian/circadian.py` and `emotion/emotion.py` provide the state sources.
- `grpc/server.py`: scheduled events are dispatched in `OnScheduledEvent`
  (`CIRCADIAN_TICK`, `MEMORY_CONSOLIDATION`, `IDLE_CHECK`); the autonomy cycle
  runs inside `IDLE_CHECK`. Worldsim hooks in there (S5).
- LLM access: `model_client.MocrClient.generate` (the mocr gateway).

## Stage status

- **S0 — spec + gates: DONE.** `world/spec.json` (65 normalized features across
  circadian/mood/actors/plots/ledger/world/agenda/meta), event + ledger schemas,
  invariants; `world/gates.py` (all gate functions + thresholds);
  `life/worldsim/features.py` (shared builder). Gate: `pytest tests/worldsim/test_spec.py`.
- **S1 — assets: DONE (offline).** `world/generate_assets.py` deterministically
  builds `world/cast.json` (6 actors / 8 places / 4 plots) and
  `world/templates.jsonl` (300 templates: trivia 210 / small 75 / shareable 12 /
  upset 3, exact `template_dist`), plus `world/ledger_rules.py` (clamp/cooldown/
  daily-cap/drama-budget). `life/worldsim/llm_cache.py` (sha256 cache) and
  `life/worldsim/assets.py` (validators) added. An optional ``llm`` callable
  enriches/reviews; the offline default is the schema+duplicate review
  (pass_rate 1.0) and the persona/settings defaults are conservative.
  Gate: `pytest tests/worldsim/test_assets.py` (13 worldsim tests total).
- **S2 — prior simulator: DONE.** `world/sim.py` (200d x 4 seeds ->
  `data/trajectories/`); `tests/worldsim/test_invariants.py` green (range,
  high-intensity weekly, obligation echo, entropy>=60% prior, untrained==prior).
- **S3 — teacher distillation: DONE (offline).** `world/distill.py` with the
  prompt skeleton + sha256 cache; `data/teacher/{curated,train,val}.jsonl`,
  pass rate 1.0.
- **S4 — training: DONE.** `world/train.py` numpy residual softmax (L2=1.0) +
  ridge head (lambda=10), label smoothing to keep KL low; `models/world_policy.json`
  + `models/eval_report.json`. Four gates: top3 0.997 / KL 0.032 / entropy 0.811
  / invariants OK -> promoted, checkpoints rotated (keep 4).
- **S5 — runtime integration: DONE.** `life/worldsim/runtime.py` (ledger +
  renderer + consumption), engine `worldsim_tick()` wired into IDLE_CHECK;
  `tests/worldsim/test_runtime.py` green; off by default; no regressions.
- **S6 — shadow + guarded weekly update: DONE.** `world/shadow.py`
  (`log_event`, `shadow_record`, `weekly_update` promoting only on the four
  gates, rollback to the last 4 versions); `tests/worldsim/test_shadow.py` green.
  Online (user-facing) still requires `world_density=full` **and an explicit user
  confirmation** - not enabled.

## Thresholds (from `world/gates.py`)

| key | value | meaning |
|---|---|---|
| `state_dim_min/max` | 50 / 150 | spec feature count bounds |
| `template_dist` | trivia .70 / small .25 / shareable .04 / upset .01 | S1 tier mix |
| `chi_square_max` | 15.0 | S1 tier distribution test |
| `review_pass_rate_min` | 0.80 | S1 second-pass review |
| `prior_entropy_ratio_min` | 0.60 | rollout entropy vs prior (S2/S4) |
| `high_intensity_per_week_max` | 1 | intensity>=3 events per rolling week |
| `obligation_echo_days` | 14 | an open obligation must echo within this |
| `curated_pass_rate_min` | 0.60 | S3 teacher curation |
| `teacher_top3_hit_min` | 0.50 | S4 val top-3 hit rate |
| `kl_to_prior_max` | 0.50 nats | S4 divergence from prior |
| `l2` / `ridge_lambda` | 1.0 / 10.0 | S4 regularisation |
| `keep_checkpoints` | 4 | rollback: keep last N weight files |

## Rollback

`models/world_policy.json` is versioned; the last `keep_checkpoints` versions are
kept. Reverting to the newest checkpoint whose `models/eval_report.json` passes
all four S4 gates restores the previous behaviour. With `W = 0` (or a missing
weights file) the system is exactly the prior-rule version. Setting
`world_density = off` disables the whole subsystem regardless of weights.
