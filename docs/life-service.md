# L.I.F.E Service

L.I.F.E exposes `life.v1.LifeService` and owns persona, emotion, memory,
companion domains, OneBot integration, and LIFE-registered WebUI surfaces.

## `OnUserMessage`

Server-streaming entry point for WebUI, OneBot, and other adapters.

The request includes:

- `session_id`
- `user_id`
- `message`
- `adapter_type`
- `persona_json`
- optional `history_json`

Responses contain:

- output chunks
- `done`
- emotion state
- mental energy
- started task ID
- safe collapsed THINK summary

LIFE may create Agent tasks, memory proposals, journal/dream entries, or
proactive candidates. It must not expose hidden model chain-of-thought.

## `OnTaskCompleted`

Core calls this when an Agent task reaches a terminal state. LIFE uses the
callback to update emotion, companion audit, and the session notification queue.

## `OnScheduledEvent`

Core can send:

- circadian tick
- memory consolidation
- idle check

LIFE runs bounded maintenance and persists the result.

## Memory APIs

`GetMemories` returns memory projections for the LIFE-owned management UI.
The SQLite fact store is authoritative; BM25, vector, and Tantivy indexes are
rebuildable projections.

## Companion APIs

`GetCompanion` returns LIFE-owned relationship, agenda, proactive, group scene,
journal, dream, persona evolution, and audit projections.

`ManageCompanion` supports controlled actions such as:

- `add_agenda`
- `confirm_agenda`
- `reject_agenda`
- `complete_agenda`
- `journal`
- `dream`
- `memory_maintenance`
- `delete_memory`
- `clear_all_memory`

All mutations must be auditable and should be idempotent where possible.

## `CompactConversation`

Summarizes a session through LIFE's configured model. The summary becomes a
client-restored context projection; it is not an irreversible deletion of the
underlying local message history until the user chooses to clear it.

## `GetNotifications`

Returns session-addressed task completion notifications for WebUI polling.
