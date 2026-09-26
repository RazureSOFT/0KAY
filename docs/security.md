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
