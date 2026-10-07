# Changelog

All notable changes to 0KAY are documented here. Releases are tagged `v<version>`
and every module manifest carries the same version.

## Unreleased

### LIFE — consolidation

- New `cognition/common.py` holds the primitives the circuits kept re-inventing:
  `clamp` / `clamp01` / `clamp_signed`, the Russell circumplex + `emotion_label`,
  `match_persona_hints`, and the private `SAFETY_GUARD` directive with its
  `safety_guard()` threshold helper.
  - `_clamp` was defined **nine** times across the package, the safety directive
    **three** times verbatim, and the persona-keyword loop **four** times.
- `attachment` / `tsundere` / `yandere` now share that one implementation; the
  circuits keep their own archetypes, prompts and thresholds.
- The engine's four opt-in circuits are driven by one table
  (`CIRCUIT_KEYS` + `CIRCUIT_PROMPT_LABELS`) instead of four hand-written
  copies: `apply_cognition_settings`, the dashboard read-out, the prompt render,
  the safety-guard injection and the reset now iterate the table. The apply
  precedence (explicit setting > restored state > persona keyword > owner
  override) moved into one `_resolve_circuit()` — the four blocks were
  structurally identical and are now ~4.5 KB smaller.
- `test_chat_quality.SafetyGuardVoiceTests` now drives each circuit into its safe
  band and reads the guard it actually emits, instead of grepping source files
  for the marker (which only proved the literal existed somewhere).

### LIFE — performance

- `CompanionSystem.relationship_expression` read the whole settings table three
  times per call and `user_role` twice; one read is now threaded through both.
  Measured: **2.0× faster** (200 calls: 0.874s → 0.439s; 600 → 200 reads), and
  `user_role` likewise (0.429s → 0.211s; 400 → 200 reads). This is on the
  per-outgoing-message path.

### LIFE — yandere affect dynamics

- New opt-in cognition circuit: **yandere affect dynamics**
  (`life/src/life/cognition/yandere.py`), a port of the standalone research
  engine `life_research/yandere_engine` — the computational reconstruction of
  柳朋輝・米澤朋子 (2023), HAI シンポジウム 2023 P-60.
  - C1 急変: reaction gain is superlinear in affection
    (`g⁻` further amplified by jealousy), so the same event moves an attached
    heart far more violently.
  - C2 過剰: expression intensity is superlinear in affection.
  - C3 円環: Russell (1980) circumplex state with a hysteretic
    NORMAL/DERE/YAMI mode machine (separate entry/exit thresholds + a
    jealousy-calming exit condition).
  - 12-event vocabulary with raw psychological impacts, four archetypes
    (病娇 / 傲娇 / 中性 / 傲娇→病娇), and an OCEAN → dynamics-parameter mapping.
  - Wired like the existing tsundere circuit: `cog_yandere_enabled` /
    `cog_yandere_type` settings, persona-keyword auto-enable, prompt
    contribution, status read-out, persistence and the private safety guard.
  - **Default off**, so existing installs are unchanged.
- `life/README_yandere.md` records what was ported, what was deliberately not
  (the 30-paper "full stack" role stand-ins), how the circuit differs from
  `attachment` / `tsundere` / `persona_dynamics`, and the honest limitations.
- Tests: 23 unit tests porting the research engine's falsifiable inferences,
  plus 10 engine-wiring tests.

## 0.1.3

### Core

- The console's log-level write (`PUT /api/console/level`) and buffer clear
  (`POST /api/console/clear`) now require the PIN like every other mutating
  route; the comment claiming the settings rule covered them was wrong.
- `/live2d/models/` responses carry `X-Content-Type-Options: nosniff` and a
  sandbox CSP, so an uploaded HTML/JS file dropped beside a valid manifest can
  no longer run script from Core's origin.
- `disabled_plugins.json` is written atomically (tmp + rename) and a corrupt
  file is logged instead of silently re-enabling every disabled plugin.
- Fixed a data race on the UI-patch store's `loaded` timestamp.

### mocr

- `MOCR_GENERATION_TIMEOUT` is no longer discarded: the request span and every
  provider call are parented on the deadline context, so a provider that
  trickles bytes can no longer hold the stream open indefinitely.
- Retry classification also recognises the OpenAI-compatible error shape
  (`upstream HTTP <code>`), so `max_retries` actually fires for 429/5xx on that
  path instead of only the Anthropic-style `provider error <code>`.
- SSE line cap raised from 1 MiB to 8 MiB so a large streamed tool call is not
  reported as a stream failure.
- Usage-outbox flushes coalesce into a single drainer instead of one goroutine
  per generation; the `metadata` host block is now case-insensitive.

### LIFE

- Fixed a SQLite connection leak in the chat-log store: `with conn:` manages the
  transaction but never closes the handle, which kept `chatlog.db` locked on
  Windows and made the owning data directory undeletable. On its own this turned
  185 failing tests green.
- `preferred_at` normalisation routes through `timeutil`, so a `Z`/offset stamp
  is no longer mis-read as naive local time (which shifted proactive timing).
- `life_state.json` is written tmp + rename; `adapters.json` and
  `memory_center.db` are created owner-only (0o600 / 0o700) on POSIX.
- Malformed-but-valid JSON caches (weather, resident state, worldsim runtime and
  LLM cache) degrade to "unknown" instead of raising on load.
- The Core-client singleton is created under a lock.

### WebUI

- Clearing the chat mid-reply no longer resurrects a phantom "interrupted"
  bubble; an epoch guard stops the aborted stream's continuation.
- `LifeSettingsPanel` referenced `lifeSettings.save` / `saving`, which exist in
  no locale (the button rendered raw keys); it now uses `common.save` / `saving`
  like the sibling MCP panel.
- TTS blob URLs are revoked when replaced and on unmount; the plugin README
  fetch and the Minecraft consent poll can no longer race or leak timers after
  unmount.

### obs

- Fixed a send-on-closed-channel panic in the log/span hubs (a console
  disconnect racing an active publisher could crash the process), and a file-fd
  leak when `Init` is called more than once.

### Tests / Docs

- Cognition-settings contract tests now parse getter-style `COG_DEFAULTS` entries
  and assert the localised cognition label in `strings.xml` rather than a
  hardcoded literal in the JS bundle.
- Version bumped to `0.1.3` across every manifest, `package.json`, `pyproject`
  and the version constant; release docs and README refreshed.

## 0.1.2

### Core

- Plugin identity fails closed when its token secret is unavailable; re-registering
  a name replaces its registry row instead of duplicating it.
- Opt-in `CORE_PLUGIN_REGISTRATION_TOKEN`: non-builtin plugins must present the
  shared secret (`x-0kay-registration-token`) at gRPC registration.
- `GET /api/providers/credentials` is machine-only — a browser session cookie is
  no longer accepted, so a plugin WebUI bundle cannot read plaintext keys.
- SSRF guard (`netguard`) for the provider model fetch and plugin egress:
  metadata/link-local/CGNAT are always blocked, redirects re-checked;
  `CORE_SSRF_STRICT=1` also blocks loopback/RFC1918.
- Failed PIN/token attempts are rate-limited (5 → 15-minute lockout, `429`).
- GitHub-proxy and Windows update-script inputs are validated.

### LIFE

- An empty memory scope now means public-only; admin queries use `"*"`.

### WebUI

- Heavy vendor/Live2D/markdown chunks are split out of the main bundle.

### CI

- `go test -race` and the LIFE test suite run in CI.

## 0.1.1

### Core

- The browser PIN gate no longer misclassifies Node machine clients (the agent
  and plugin proxies send `Sec-Fetch-Mode: cors` via undici) as browsers, so
  service-to-service calls keep working while browsers still face the PIN.

### Access PIN

- Browser access now requires a 6-digit PIN. Sign-in uses six auto-advancing
  boxes and submits as soon as the sixth digit is entered.
- The PIN is stored as a salted SHA-256 hash in `core/data/security.json`
  (never committed) and is required again for sensitive actions.
- Existing installs are asked to set a PIN once; fresh installs generate one and
  `0kay-pm` prints it after installation.

### LIFE

- Configurable mail sender name (`mail_from_name`, default `0KAY`), so outgoing
  mail no longer shows `L.I.F.E`.
- New "auto-approve all" switch that passes every approval request without a
  dialog.

### WebUI

- Settings → **About** now checks and applies the 0KAY platform (本体) update and
  shows the new version's release notes.
- Settings → **Plugin updates** keeps the GitHub mirror and per-component
  updates.
- Provider settings keep the stored API key when the field is left blank.

### Agent

- In-run context compaction uses a fixed structured handoff schema shared with
  LIFE (Objective / Important Details / Work State / Next Move / Relevant
  Files). The Agent page renders the latest context summary for a session.

### Docs

- README screenshots refreshed; the plugin and marketplace images were removed.

## 0.1.0

First release of Core, MOCR, LIFE, WebUI, the plugin web UIs and the local search
service, with module manifests, Settings update checks and an HTTP API reference.
