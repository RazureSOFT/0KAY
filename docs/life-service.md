# L.I.F.E Service

L.I.F.E exposes `life.v1.LifeService` and owns persona, emotion, memory,
companion domains, OneBot integration and LIFE-registered WebUI surfaces. It is a
`PLUGIN_TYPE_PERSONA` plugin with `requires:mocr`.

## `OnUserMessage`

Server-streaming entry point for WebUI, OneBot and other adapters.

Request fields:

- `session_id`, `user_id`, `message`, `adapter_type`
- `persona_json` — the persona object from the client
- optional `history_json`

Responses contain output chunks plus `done`, emotion state, mental energy, a
started task id and a safe collapsed THINK summary. LIFE may create Agent tasks,
memory proposals, journal/dream entries or proactive candidates. It never
exposes hidden model chain-of-thought.

## Persona and the custom prompt

The persona object carries `name`, `avatar`, `birthDate`, `description`,
`personality`, `greeting` and **`customPrompt`**. `customPrompt` is authored in
Settings → 人设 and is sent **verbatim as the model system prompt**, ahead of the
persona description, for both the THINK and OUTPUT calls. Leave it empty to
disable it. The remaining persona fields are rendered into the persona context
that is embedded in the system prompt.

## `OnTaskCompleted`

Core calls this when an Agent task reaches a terminal state. LIFE updates
emotion, the companion audit log and the session notification queue. The callback
carries the task id, state, result and error; it is idempotent.

## `OnScheduledEvent`

Core can send a circadian tick, memory consolidation or idle check. LIFE runs
bounded maintenance and persists the result.

## Memory APIs

`GetMemories` returns memory projections for the LIFE-owned management UI. The
SQLite fact store is authoritative; BM25, vector and Tantivy indexes are
rebuildable projections.

## Companion APIs

`GetCompanion` returns LIFE-owned relationship, agenda, proactive, group scene,
journal, dream, persona evolution and audit projections.

`ManageCompanion` supports controlled actions:

- `add_agenda`, `confirm_agenda`, `reject_agenda`, `complete_agenda`
- `journal`, `dream`, `memory_maintenance`
- `delete_memory`, `clear_all_memory`, `ack_notifications`

All mutations are auditable and idempotent where possible.

## `CompactConversation`

Summarizes a session through LIFE's configured model. The summary becomes a
client-restored context projection; it is not an irreversible deletion of the
underlying local history until the user clears it.

## `GetNotifications`

Returns session-addressed task-completion notifications for WebUI polling.
Reading does not delete: acknowledge with `ack_notifications` (or
`POST /api/life/notifications`).

## Permissions

`screen_watch`, `computer_use` and `report_agent_host` are off by default. They
gate screen observation, shell/computer operations and host telemetry in
heartbeats. `ReportAgentHost` is also mirrored from `POST /api/settings/life`.
