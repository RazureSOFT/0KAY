"""HTTP client for the Core gateway, including the streaming chat endpoint.

The client speaks the same API the WebUI speaks, so the terminal cannot
disagree with what the browser shows.
"""

from __future__ import annotations

import json
import threading
import urllib.error
import urllib.parse
import urllib.request


class CoreError(Exception):
    """A failure the user should see as one line, not a traceback."""


def _set_read_timeout(response, seconds: float) -> None:
    """Lengthen the socket timeout of an already-open response.

    urllib applies one timeout to both connect and every read. Streaming wants
    a short connect and a long read, so the socket is adjusted after the
    handshake. The attribute path is internal to http.client, hence the
    defensive walk: if it is not there, the original timeout simply stays.
    """
    try:
        connection = response.fp.raw._sock
    except AttributeError:
        return
    try:
        connection.settimeout(seconds)
    except OSError:
        pass


class Client:
    def __init__(self, base_url: str, token: str = "", timeout: float = 8.0):
        self.base_url = (base_url or "http://127.0.0.1:8080").rstrip("/")
        self.token = token
        self.timeout = timeout
        # A single generation can pause for a long time between chunks; the
        # read timeout only has to catch a dead connection, not a slow model.
        self.stream_timeout = 900.0
        self._lock = threading.Lock()
        self._active = None

    # -- plumbing ----------------------------------------------------------
    def _headers(self, json_body: bool = False) -> dict:
        headers = {"Accept": "application/json"}
        if json_body:
            headers["Content-Type"] = "application/json"
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    def _open(self, path: str, payload: dict | None = None, stream: bool = False):
        url = self.base_url + path
        body = json.dumps(payload).encode("utf-8") if payload is not None else None
        request = urllib.request.Request(
            url, data=body,
            headers=self._headers(json_body=payload is not None),
            method="POST" if payload is not None else "GET",
        )
        try:
            # urlopen takes one timeout, not a (connect, read) pair -- the pair
            # only exists on http.client. Connect on the short one, then give
            # the stream room to think: a model can take a minute before its
            # first token, and a read timeout there would look like a failure.
            response = urllib.request.urlopen(request, timeout=self.timeout)
        except urllib.error.HTTPError as error:
            detail = error.read().decode("utf-8", "replace")[:300]
            raise CoreError(f"HTTP {error.code} from {path}: {detail}") from None
        except urllib.error.URLError as error:
            raise CoreError(f"cannot reach {self.base_url}: {error.reason}") from None
        if stream:
            _set_read_timeout(response, self.stream_timeout)
        return response

    def get(self, path: str):
        with self._open(path) as response:
            raw = response.read().decode("utf-8", "replace")
        if not raw.strip():
            return {}
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            raise CoreError(f"invalid JSON from {path}") from None

    def post(self, path: str, payload: dict | None = None):
        with self._open(path, payload or {}) as response:
            raw = response.read().decode("utf-8", "replace")
        if not raw.strip():
            return {}
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {}

    # -- chat --------------------------------------------------------------
    def cancel(self) -> None:
        with self._lock:
            active = self._active
        if active is not None:
            try:
                active.close()
            except Exception:
                pass

    def chat(self, prompt: str, messages: list[dict], model: str = "",
             system: str = "", session: str = "tui"):
        """Yield (`event`, payload) tuples from the SSE stream.

        Events: "chunk" with str, "usage" with dict, "done", "error" with str.
        """
        payload = {
            "prompt": prompt,
            "stream": True,
            "session_id": session,
            "messages": messages,
        }
        if model:
            payload["model_id"] = model
        if system:
            payload["system_prompt"] = system
        response = self._open("/api/chat", payload, stream=True)
        with self._lock:
            self._active = response
        try:
            event = ""
            for raw in response:
                line = raw.decode("utf-8", "replace").rstrip("\r\n")
                if not line:
                    event = ""
                    continue
                if line.startswith(":"):
                    continue
                if line.startswith("event:"):
                    event = line[6:].strip()
                    continue
                if not line.startswith("data:"):
                    continue
                data = line[5:].strip()
                if not data:
                    continue
                try:
                    body = json.loads(data)
                except json.JSONDecodeError:
                    continue
                if event == "error" or (isinstance(body, dict) and body.get("error")):
                    message = body.get("error") if isinstance(body, dict) else str(body)
                    yield ("error", str(message))
                    return
                if event == "done" or (isinstance(body, dict) and body.get("done")):
                    usage = body.get("usage") if isinstance(body, dict) else None
                    if usage:
                        yield ("usage", usage)
                    yield ("done", None)
                    return
                if isinstance(body, dict):
                    if body.get("usage"):
                        yield ("usage", body["usage"])
                    chunk = body.get("chunk")
                    if chunk:
                        yield ("chunk", chunk)
            yield ("error", "stream ended without a completion")
        finally:
            with self._lock:
                self._active = None
            try:
                response.close()
            except Exception:
                pass

    # -- agent sessions ----------------------------------------------------
    def settings_sections(self) -> list[dict]:
        """Every settings section the gateway knows, with current values."""
        payload = self.get("/api/settings/sections?values=1")
        sections = payload.get("sections") if isinstance(payload, dict) else None
        return list(sections or [])

    def settings(self, section: str) -> dict:
        payload = self.get(f"/api/settings/{urllib.parse.quote(section)}")
        return payload if isinstance(payload, dict) else {}

    def save_settings(self, section: str, values: dict) -> dict:
        """Merge values into one section. The gateway keeps the rest."""
        return self.post(f"/api/settings/{urllib.parse.quote(section)}", dict(values))

    def agents(self) -> dict:
        """Registered agents, with the host details the picker needs.

        A turn only runs if one of these is online: the gateway accepts the
        task and then has nothing to hand it to.
        """
        payload = self.get("/api/agents")
        return payload if isinstance(payload, dict) else {}

    def create_session(self, title: str = "") -> str:
        """Start an agent session and return its id.

        A session is what makes the conversation an agent's: tools, workspace
        and history all hang off it. /api/chat is a bare model call and has
        none of that.
        """
        payload = self.post("/api/agent/sessions", {"title": title})
        session = payload.get("session_id") if isinstance(payload, dict) else None
        if not session:
            raise CoreError("the gateway did not return a session id")
        return str(session)

    def sessions(self) -> list[dict]:
        """Every agent session the gateway knows, newest first."""
        payload = self.get("/api/agent/sessions")
        rows = payload.get("sessions") if isinstance(payload, dict) else None
        sessions = [row for row in rows or [] if row.get("session_id")]
        sessions.sort(key=lambda row: str(row.get("started_at") or ""), reverse=True)
        return sessions

    def session_turns(self, session: str, limit: int = 100, before: str = "") -> dict:
        """Task rows for one session, newest first."""
        query = f"?limit={int(limit)}"
        if before:
            query += "&before=" + urllib.parse.quote(before)
        payload = self.get(f"/api/agent/sessions/{urllib.parse.quote(session)}/turns" + query)
        return payload if isinstance(payload, dict) else {}

    def send_message(self, session: str, prompt: str, model: str = "",
                     intensity: str = "", permission: str = "",
                     workdir: str = "", executor: str = "") -> dict:
        body = {"session_id": session, "prompt": prompt}
        if executor:
            body["executor_id"] = executor
        if model:
            body["model_id"] = model
        if intensity:
            body["thinking_intensity"] = intensity
        if permission:
            body["permission_mode"] = permission
        if workdir:
            body["workdir"] = workdir
        return self.post("/api/agent/messages", body)

    def task_events(self, cursor: str = ""):
        """Server-sent task rows: `{tasks, removed, reset, cursor}`.

        This is the only live feed: it pushes every task row that changed,
        including the running `think` row whose text grows as the model
        writes. Rows for other sessions are filtered by the caller.
        """
        path = "/api/tasks/events?cursor=" + urllib.parse.quote(cursor or "")
        response = self._open(path, stream=True)
        try:
            after = cursor
            for raw in response:
                line = raw.decode("utf-8", "replace").rstrip("\r\n")
                if not line.startswith("data:"):
                    continue
                data = line[5:].strip()
                if not data:
                    continue
                try:
                    payload = json.loads(data)
                except json.JSONDecodeError:
                    continue
                if not isinstance(payload, dict):
                    continue
                after = str(payload.get("cursor") or after)
                yield payload
        finally:
            try:
                response.close()
            except Exception:
                pass

    def cancel_task(self, task: str) -> dict:
        """Ask the gateway to stop a running turn."""
        return self.post("/api/tasks/cancel", {"task_id": task})

    def approvals(self, session: str = "") -> list:
        query = f"?session_id={urllib.parse.quote(session)}" if session else ""
        payload = self.get("/api/agent/approvals" + query)
        if isinstance(payload, dict):
            payload = payload.get("approvals")
        return list(payload or [])

    def decide_approval(self, ident: str, allow: bool) -> dict:
        return self.post("/api/agent/approvals", {"id": ident, "allow": bool(allow)})

    def questions(self, session: str = "") -> list:
        query = f"?session_id={urllib.parse.quote(session)}" if session else ""
        payload = self.get("/api/agent/questions" + query)
        # The gateway reuses the "approvals" key for questions.
        if isinstance(payload, dict):
            payload = payload.get("approvals") or payload.get("questions")
        return list(payload or [])

    def answer_question(self, ident: str, answer: str) -> dict:
        return self.post("/api/agent/questions", {"id": ident, "answer": answer})

    # -- convenience -------------------------------------------------------
    def plugins(self) -> list:
        payload = self.get("/api/plugins")
        if isinstance(payload, dict):
            payload = payload.get("plugins")
        return list(payload or [])

    def tasks(self) -> list:
        payload = self.get("/api/tasks")
        if isinstance(payload, dict):
            payload = payload.get("tasks")
        return list(payload or [])

    def usage(self) -> dict:
        payload = self.get("/api/usage")
        return payload if isinstance(payload, dict) else {}

    def context(self, session: str = "tui", model: str = "") -> dict:
        """The context ceiling and the current occupancy for a session.

        This is the only endpoint that reports them: /api/models carries a
        context_window field that the provider store never fills in.
        """
        query = f"?session_id={urllib.parse.quote(session or 'tui')}"
        if model:
            query += f"&model_id={urllib.parse.quote(model)}"
        payload = self.get("/api/agent/context" + query)
        return payload if isinstance(payload, dict) else {}

    def tree(self, path: str = "") -> dict:
        """Entries under `path`, for @-completion.

        The workspace endpoint only lists directories; this runs the agent's
        `workspace_tree` tool, whose result arrives as a JSON string inside a
        JSON response and has to be decoded twice. The resolved directory comes
        back with the entries because `""` means "the agent's own working
        directory", which the client cannot guess.
        """
        payload = self.post("/api/run", {
            "tool": "workspace_tree",
            "args": json.dumps({"path": path or "."}),
        })
        if isinstance(payload, dict) and payload.get("error"):
            raise CoreError(str(payload["error"]))
        raw = payload.get("result") if isinstance(payload, dict) else None
        if not raw:
            return {"path": path, "entries": []}
        try:
            data = json.loads(raw) if isinstance(raw, str) else raw
        except json.JSONDecodeError:
            return {"path": path, "entries": []}
        if not isinstance(data, dict):
            return {"path": path, "entries": []}
        return {"path": str(data.get("path") or path),
                "entries": list(data.get("entries") or [])}

    def models(self) -> dict:
        payload = self.get("/api/models")
        return payload if isinstance(payload, dict) else {}

    def reconnect(self, name: str):
        return self.post(f"/api/plugins/{name}/reconnect")

    def health(self) -> bool:
        try:
            self.get("/health")
            return True
        except CoreError:
            return False
