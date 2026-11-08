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

import difflib
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
    line = {
        "kind": "tool",
        "text": _first_line(str(row.get("result") or "")),
        "meta": {"name": name, "state": "ok" if state in ("done", "") else state},
    }
    diff = tool_diff(row)
    if diff:
        # A file change is the one tool result worth reading: say what it
        # touched and how much, instead of "edit ok".
        short = diff["path"].replace("\\", "/").rsplit("/", 1)[-1] or "file"
        line["text"] = f"{short}  +{diff['adds']} -{diff['dels']}"
        line["meta"]["diff"] = diff
    return line


# Two lines of context on each side is what makes a hunk readable without
# turning a one-line edit into a screenful.
DIFF_CONTEXT = 2
MAX_DIFF_LINES = 240


def _diff_lines(old: str, new: str) -> list[tuple[str, str]]:
    """Unified diff rows, tagged so the renderer can colour them."""
    out: list[tuple[str, str]] = []
    for line in difflib.unified_diff(old.splitlines(), new.splitlines(),
                                     lineterm="", n=DIFF_CONTEXT):
        if line.startswith("---") or line.startswith("+++"):
            continue
        if line.startswith("@@"):
            out.append(("hunk", line))
        elif line.startswith("+"):
            out.append(("add", line))
        elif line.startswith("-"):
            out.append(("del", line))
        else:
            out.append(("ctx", line))
    return out


def tool_diff(row: dict) -> dict | None:
    """A file change as diff rows, taken from the tool call's own arguments.

    `edit` carries both sides, so this is a real diff. `write` carries only the
    new text, which is shown as additions: claiming what it replaced would be a
    guess, and a wrong diff is worse than none.
    """
    name = str(row.get("prompt") or "")
    if name not in ("edit", "write"):
        return None
    raw = row.get("args")
    if isinstance(raw, str):
        try:
            args = json.loads(raw)
        except (json.JSONDecodeError, ValueError):
            return None
    elif isinstance(raw, dict):
        args = raw
    else:
        return None
    if not isinstance(args, dict):
        return None
    if name == "edit":
        lines = _diff_lines(str(args.get("oldString") or ""),
                            str(args.get("newString") or ""))
    else:
        content = str(args.get("content") or "")
        lines = [("add", "+" + piece) for piece in content.splitlines()]
    if not lines:
        return None
    adds = sum(1 for kind, _ in lines if kind == "add")
    dels = sum(1 for kind, _ in lines if kind == "del")
    return {"path": str(args.get("filePath") or ""),
            "lines": lines[:MAX_DIFF_LINES],
            "adds": adds, "dels": dels,
            "more": max(0, len(lines) - MAX_DIFF_LINES)}


def is_running(row: dict) -> bool:
    return str(row.get("state") or "") in RUNNING


def transcript(rows) -> list[dict]:
    """Render a session to `{kind, text, meta}` lines.

    While a turn runs, the visible answer is the latest `think` row that has
    text: that is the only place the model's words appear before the turn
    ends. Once it ends, the `agent` row carries the final answer and the
    intermediate text is dropped, which is what keeps a multi-step turn from
    printing the same paragraph three times.

    A `subagent` row is one of those turns nested inside another: it gets a
    header, its own tool calls, and its own answer, indented under the parent.
    Dropping them (which is what used to happen) makes a fan-out look like a
    single silent tool call.
    """
    rows = _rows(rows)
    out: list[dict] = []
    for turn in turns(rows):
        prompt = str(turn.get("prompt") or "")
        if prompt:
            out.append({"kind": "user", "text": prompt, "meta": {}})
        _turn_body(rows, turn, 0, out)
    return out


def _turn_body(rows, turn: dict, depth: int, out: list[dict]) -> None:
    """Append one turn's inside: reasoning, tools, sub-agents, answer."""
    parent = str(turn.get("task_id") or "")
    final = str(turn.get("result") or "")
    # `live` is the turn still working; `running` also covers a finished turn
    # whose answer has not arrived in the same frame, which is why the tail of
    # a stream is still treated as text. They differ once a turn ends with no
    # answer at all: that is not a spinner, it is an empty reply.
    live = is_running(turn)
    running = live or not final
    streaming = ""
    reasoning = ""

    for child in children(rows, parent):
        kind = child.get("kind")
        if kind == "think":
            text = str(child.get("result") or "")
            thought = str(child.get("reasoning") or "")
            if running and text:
                streaming = text
            if running and thought:
                reasoning = thought
        elif kind == "tool":
            line = _tool_line(child)
            line["meta"]["depth"] = depth
            out.append(line)
        elif kind == "subagent":
            _subagent_lines(rows, child, depth, out)

    if running and reasoning:
        out.append({"kind": "reason", "text": reasoning, "meta": {"depth": depth}})
    answer = final or streaming
    if answer:
        out.append({"kind": "assistant", "text": answer,
                    "meta": {"depth": depth} if depth else {}})
    elif live and depth == 0:
        out.append({"kind": "assistant", "text": "…", "meta": {"pending": True}})
    elif depth == 0 and str(turn.get("state") or "") in ("done", ""):
        # Finished, and there is nothing to show. A spinner here would never
        # stop, so say what happened instead.
        out.append({"kind": "system", "text": "(empty reply)", "meta": {}})
    if depth == 0 and str(turn.get("state") or "") in ("failed",):
        error = str(turn.get("note") or turn.get("result") or "the turn failed")
        out.append({"kind": "error", "text": error, "meta": {}})


MAX_DEPTH = 3


def _subagent_lines(rows, child: dict, depth: int, out: list[dict]) -> None:
    """One nested sub-agent: a header, its work, and what it reported."""
    if depth >= MAX_DEPTH:
        return
    label = " ".join(str(child.get("prompt") or "").split())
    state = str(child.get("state") or "")
    out.append({
        "kind": "subagent",
        "text": label[:80] or "sub-agent",
        "meta": {"depth": depth, "state": "ok" if state in ("done", "") else state},
    })
    _turn_body(rows, child, depth + 1, out)


def latest_todos(rows) -> list[dict]:
    """The todo list as of the most recent `todowrite` call.

    The tool replaces the whole list every time, so only the newest one counts;
    reading an older row would show work that has since been dropped.
    """
    newest = None
    for row in _rows(rows):
        if row.get("kind") != "tool":
            continue
        if str(row.get("prompt") or "") != "todowrite":
            continue
        if newest is None or _started(row) >= _started(newest):
            newest = row
    if newest is None:
        return []
    raw = str(newest.get("result") or "")
    try:
        payload = json.loads(raw)
    except (json.JSONDecodeError, ValueError):
        return []
    data = payload.get("data") if isinstance(payload, dict) else None
    todos = (data or {}).get("todos") if isinstance(data, dict) else None
    if not isinstance(todos, list):
        return []
    out = []
    for item in todos:
        if not isinstance(item, dict):
            continue
        content = " ".join(str(item.get("content") or "").split())
        if not content:
            continue
        out.append({"content": content,
                    "status": str(item.get("status") or "pending"),
                    "priority": str(item.get("priority") or "")})
    return out


def todo_progress(todos: list[dict]) -> tuple[int, int]:
    """(finished, total) -- cancelled items are not counted as work."""
    counted = [item for item in todos if item.get("status") != "cancelled"]
    done = sum(1 for item in counted if item.get("status") == "completed")
    return done, len(counted)


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
