# Security and Runtime Rules

- Bind services to loopback by default.
- Use an authenticated reverse proxy for public deployments.
- Do not commit provider API keys, OneBot tokens, IMAP passwords, databases, or
  runtime logs.
- Treat Agent shell, filesystem writes, computer-use, MCP, and OneBot sending as
  privileged operations.
- Validate all protobuf map values against their declared types. For
  `map<string,string>`, stringify numbers, booleans, and structured metadata.
- Keep Agent independent from the umbrella repository and pin its expected
  revision in `dependencies.json`.
- Treat generated protocol bindings as build artifacts derived from `proto/`.
- Do not expose hidden model chain-of-thought in WebUI, logs, notifications, or
  plugin callbacks. Expose only safe structured summaries when needed.
