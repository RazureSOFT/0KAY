# Security and Runtime Rules

- Bind services to loopback by default. Use an authenticated reverse proxy for
  any public deployment.
- Do not commit provider API keys, OneBot tokens, IMAP passwords, databases or
  runtime logs.
- Treat Agent shell, filesystem writes, `apply_patch`, computer-use, MCP and
  OneBot sending as privileged operations. They stay disabled or prompt-for-
  approval by default; `full_access` is an explicit opt-in.
- Validate all protobuf map values against their declared types. For
  `map<string,string>`, stringify numbers, booleans and structured metadata.
- Keep the Agent, MCP and Minecraft repositories independent from the umbrella
  and pin expected revisions in `dependencies.json`.
- Treat generated protocol bindings as build artifacts derived from `proto/`.
- Do not expose hidden model chain-of-thought in the WebUI, logs, notifications
  or plugin callbacks. Expose only safe structured summaries.
- The user-authored persona **custom prompt** is sent to the model as the system
  prompt. It is user-owned content stored locally; never inject or auto-load it
  from untrusted sources.

## Plugin permissions and egress

- Every plugin declares `permissions` in its manifest: the Core APIs it calls
  (`api.requires`), the APIs it exposes (`api.exposes`) and the hosts it may
  reach (`egress`). Core enforces these at runtime; first-party platform plugins
  and Core-registered builtins are exempt.
- A plugin attributes its Core calls with `X-0KAY-Plugin` + its service token
  (issued at registration). An attributed call with a bad token is rejected and,
  for third-party plugins, any API not declared is denied
  (`403 api_not_permitted`).
- Plugins must not dial the internet directly. All outbound traffic goes through
  Core (`POST /api/net/egress` / `CoreService.Egress`), which checks the declared
  egress allow-list and re-checks every redirect. A direct-socket block is a
  deployment hardening step, not the enforcement boundary.
- The per-plugin service-token key lives at `CORE_DATA_DIR/plugin-token.key`
  (never commit it); tokens are derived (HMAC) and stable across restarts.
  Plugin identity fails closed when that secret is unavailable, and re-registering
  a plugin name replaces its previous row rather than duplicating it.
- **Registration token (opt-in).** Set `CORE_PLUGIN_REGISTRATION_TOKEN` on Core
  and on every plugin to require each non-builtin plugin to present the shared
  secret at registration (gRPC metadata `x-0kay-registration-token`). This closes
  name-impersonation on an exposed Core. Unset keeps the historic network-trust
  model. LIFE / Agent / mocr forward the value automatically.

## Credentials, sessions and the access PIN

- `GET /api/providers/credentials` returns **plaintext** provider keys and is
  restricted to machine callers: it requires a valid plugin identity
  (`X-0KAY-Plugin` + service token) or a paired-device / `CORE_API_TOKEN`
  bearer. A browser session cookie is not accepted, so an in-origin plugin WebUI
  bundle cannot exfiltrate credentials. Cross-site reads are rejected outright.
- The WebUI authenticates with an HttpOnly `0kay_session` cookie; the PIN is
  kept in memory only and sent as `X-0kay-Pin` on sensitive requests.
- Failed PIN/token attempts are rate-limited per client (5 failures → 15-minute
  lockout, `429 too_many_attempts`). IPv6 clients are keyed by `/64` so a routed
  prefix cannot rotate around the limit.

## Outbound request guard (SSRF)

- Core's outbound HTTP (the provider model fetch and the plugin egress proxy)
  runs through a guarded transport (`core/internal/netguard`). It refuses
  link-local/metadata addresses (`169.254.0.0/16`, `fd00:ec2::254`, known
  metadata hostnames), CGNAT (`100.64.0.0/10`, including Alibaba Cloud's
  `100.100.100.200`), benchmark/reserved ranges, and settles DNS once at dial
  time so a name cannot rebind to a blocked address. Every redirect is re-checked.
- Private and loopback targets stay reachable by default so local model servers
  (Ollama, LM Studio, …) keep working. Set `CORE_SSRF_STRICT=1` to also block
  loopback and RFC1918 ranges.

## Updates and the package manager

- Components installed with 0kay-pm are updated through `0kay-pm`
  (`stop → update → start`). A plain source checkout is updated by pulling its
  git repository, rebuilding, and restarting the component.
- The About panel can trigger updates through `POST /api/update/apply`. It only
  ever runs the package manager or a git pull/build/restart for a known
  component; it never executes arbitrary user input.
- `git pull` runs with `GIT_TERMINAL_PROMPT=0` and low-speed limits so a
  blocked or unauthenticated remote fails fast instead of hanging.
- On Windows the updater and its children run with no console window
  (`CREATE_NO_WINDOW`).
- The previous installation is retained as an `.old-<id>` recovery copy.
