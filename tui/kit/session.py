"""Project the agent's task rows into transcript lines.

The server session is the source of truth. The client keeps a map of task rows
and re-derives the conversation from them on every update, so a reconnect, a
reset or a late event cannot duplicate a turn or lose one -- refreshing is the
same operation as rendering.

Row shapes, as the gateway actually sends them:

    agent          one turn: `prompt` is what the user typed, `result` the
                   final answer (empty until the turn ends)
    think          one model call: `reasoning` streams first, then `result`
                   grows with the text the model is writing
    tool           one tool call: `prompt` is the tool name, `result` its output
    agent_session  the session record itself; not part of the transcript
"""

from __future__ import annotations

import json

RUNNING = ("running", "pending")
FINISHED = ("done", "failed", "cancelled", "error")

TOOL_RESULT_PREVIEW = 60


def _rows(rows):
    """Rows as a list, whether a map of task id -> row or an iterable."""
    return list(rows.values()) if hasattr(rows, "values") else list(rows)


def _started(row: dict) -> str:
    return str(row.get("started_at") or "")


def turns(rows) -> list[dict]:
    """`agent` rows, oldest first."""
    found = [row for row in _rows(rows) if row.get("kind") == "agent"]
    found.sort(key=_started)
    return found


def children(rows, parent: str) -> list[dict]:
    """Rows belonging to one turn, in the order they happened."""
    found = [row for row in _rows(rows) if row.get("parent_id") == parent]
    found.sort(key=_started)
    return found


def _first_line(result: str) -> str:
    """A readable one-liner out of a tool's JSON result.

    Tools return `{"success":…, "data":…}`; printing that raw turns the
    transcript into a wall of escaped JSON, which is worse than useless when
    the point of a card is to say what happened.
    """
    text = result.strip()
    if text.startswith("{"):
        try:
            payload = json.loads(text)
        except (json.JSONDecodeError, ValueError):
            payload = None
        if isinstance(payload, dict):
            data = payload.get("data", payload)
            for key in ("output", "text", "content", "result", "message", "error"):
                value = data.get(key) if isinstance(data, dict) else None
                if isinstance(value, str) and value.strip():
                    return " ".join(value.split())[:TOOL_RESULT_PREVIEW]
            if isinstance(data, list):
                return f"{len(data)} items"
            if isinstance(data, dict):
                parts = []
                for key, value in list(data.items())[:4]:
                    if isinstance(value, list):
                        parts.append(f"{key}: {len(value)}")
                    elif isinstance(value, str) and value.strip():
                        parts.append(" ".join(value.split())[:24])
                return " · ".join(parts)[:TOOL_RESULT_PREVIEW] or ", ".join(list(data)[:5])
    return " ".join(text.split())[:TOOL_RESULT_PREVIEW]


def _tool_line(row: dict) -> dict:
    name = str(row.get("prompt") or "tool")
    state = str(row.get("state") or "")
    return {
        "kind": "tool",
        "text": _first_line(str(row.get("result") or "")),
        "meta": {"name": name, "state": "ok" if state in ("done", "") else state},
    }


def is_running(row: dict) -> bool:
    return str(row.get("state") or "") in RUNNING


def transcript(rows) -> list[dict]:
    """Render a session to `{kind, text, meta}` lines.

    While a turn runs, the visible answer is the latest `think` row that has
    text: that is the only place the model's words appear before the turn
    ends. Once it ends, the `agent` row carries the final answer and the
    intermediate text is dropped, which is what keeps a multi-step turn from
    printing the same paragraph three times.
    """
    rows = _rows(rows)
    out: list[dict] = []
    for turn in turns(rows):
        prompt = str(turn.get("prompt") or "")
        if prompt:
            out.append({"kind": "user", "text": prompt, "meta": {}})

        final = str(turn.get("result") or "")
        running = is_running(turn) or not final
        streaming = ""
        reasoning = ""
        for child in children(rows, str(turn.get("task_id") or "")):
            kind = child.get("kind")
            if kind == "think":
                text = str(child.get("result") or "")
                thought = str(child.get("reasoning") or "")
                if running and text:
                    streaming = text
                if running and thought:
                    reasoning = thought
            elif kind == "tool":
                out.append(_tool_line(child))

        if running and reasoning:
            out.append({"kind": "reason", "text": reasoning, "meta": {}})
        answer = final or streaming
        if answer:
            out.append({"kind": "assistant", "text": answer, "meta": {}})
        elif running:
            out.append({"kind": "assistant", "text": "…", "meta": {"pending": True}})
        if str(turn.get("state") or "") in ("failed",):
            error = str(turn.get("note") or turn.get("result") or "the turn failed")
            out.append({"kind": "error", "text": error, "meta": {}})
    return out


def merge(current: dict, delta: dict, session: str = "") -> dict:
    """Fold one task-events frame into the row map.

    `reset` means the client's cursor was too old and the frame is a full
    snapshot: keeping stale rows would resurrect deleted tasks, so the map is
    rebuilt from what this session still has.
    """
    rows = {key: value for key, value in current.items()}
    if delta.get("reset"):
        keep = {}
        for row in delta.get("tasks") or []:
            if session and row.get("session_id") != session:
                continue
            keep[str(row.get("task_id"))] = row
        rows = keep
    for row in delta.get("tasks") or []:
        if session and row.get("session_id") != session:
            continue
        ident = str(row.get("task_id") or "")
        if ident:
            rows[ident] = dict(rows.get(ident) or {}, **row)
    for ident in delta.get("removed") or []:
        rows.pop(str(ident), None)
    return rows


def busy(rows) -> bool:
    """True while any turn in this session is still running."""
    return any(is_running(row) for row in turns(rows))


def running_turn(rows) -> str:
    """Task id of the running turn, or "" -- what Ctrl+C has to cancel."""
    for row in turns(rows):
        if is_running(row):
            return str(row.get("task_id") or "")
    return ""
