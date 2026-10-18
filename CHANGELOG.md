# Changelog

All notable changes to 0KAY are documented here. Releases are tagged `v<version>`
and every module manifest carries the same version.

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
