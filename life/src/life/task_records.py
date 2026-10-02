"""Core-owned task ledger; keep a durable outbox when Core is unavailable."""
import asyncio
from contextvars import ContextVar
import json
import os
from pathlib import Path
import uuid
import httpx

from .http_auth import auth_headers
from .logging_setup import get_logger

log = get_logger("task_records")

task_context = ContextVar("life_task_context", default={})

# Statuses that will never succeed on retry: drop them (after logging) instead
# of letting a permanent failure wedge the whole outbox forever.
_PERMANENT_FAILURES = (400, 401, 403, 404, 413, 422)


class TaskRecorder:
    #: Hard ceiling on the durable outbox so a long Core outage cannot grow it
    #: without bound (the oldest events are dropped first).
    MAX_OUTBOX = 2000

    def __init__(self, data_dir):
        self.path = Path(data_dir) / "task_outbox.json"
        self.lock = asyncio.Lock()
        self.base = (os.getenv("CORE_HTTP_ADDR") or os.getenv("CORE_HTTP") or "http://127.0.0.1:8080").rstrip("/")
        self._flush_task: asyncio.Task | None = None
        try:
            self.pending = json.loads(self.path.read_text(encoding="utf-8"))
        except (FileNotFoundError, json.JSONDecodeError):
            self.pending = []

    def _save(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        temporary = self.path.with_suffix(".tmp")
        temporary.write_text(json.dumps(self.pending, ensure_ascii=False), encoding="utf-8")
        temporary.replace(self.path)

    def _reject(self, event, status) -> None:
        try:
            with self.path.with_suffix('.rejected.jsonl').open('a', encoding='utf-8') as rejected:
                rejected.write(json.dumps({'event': event, 'status': status}, ensure_ascii=False) + '\n')
        except OSError as error:  # pragma: no cover - best-effort logging
            log.warning("could not write rejected task record: %s", error)

    async def record(self, event):
        event = dict(event)
        for key in ('prompt', 'result', 'error'):
            if isinstance(event.get(key), str) and len(event[key]) > 200000:
                event[key] = event[key][:200000] + '\n[record truncated]'
        async with self.lock:
            self.pending.append(event)
            if len(self.pending) > self.MAX_OUTBOX:
                dropped = len(self.pending) - self.MAX_OUTBOX
                del self.pending[:dropped]
                log.warning("task outbox overflow: dropped %d oldest event(s)", dropped)
            self._save()
        self._schedule_flush()

    def _schedule_flush(self) -> None:
        """Drain the outbox in the background instead of on the caller's hot path.

        `record` used to ``await self.flush()`` inline, so every tool call waited
        on a ``timeout=2`` POST (up to +4s per turn for start+finish).  The flush
        now runs as a held background task (so it cannot be GC'd); the server also
        flushes periodically.
        """
        try:
            loop = asyncio.get_running_loop()
        except RuntimeError:
            return  # no running loop — the periodic flush will drain it
        if self._flush_task is not None and not self._flush_task.done():
            return
        self._flush_task = loop.create_task(self.flush())

    def _headers(self):
        return auth_headers()

    async def flush(self):
        async with self.lock:
            async with httpx.AsyncClient(timeout=2) as client:
                while self.pending:
                    try:
                        response = await client.post(f"{self.base}/api/tasks", json=self.pending[0], headers=self._headers())
                        if response.status_code in _PERMANENT_FAILURES:
                            self._reject(self.pending[0], response.status_code)
                            self.pending.pop(0)
                            self._save()
                            continue
                        if response.status_code != 409:
                            response.raise_for_status()
                    except Exception:
                        return
                    self.pending.pop(0)
                    self._save()

    async def start(self, kind, prompt):
        context = task_context.get()
        event = {"task_id": f"life-{kind}:{uuid.uuid4().hex}", "kind": kind, "caller_id": "life",
                 "session_id": context.get("session_id", ""), "parent_id": context.get("task_id", ""),
                 "prompt": prompt, "state": "running"}
        await self.record(event)
        return event

    async def finish(self, event, result="", error="", cancelled=False):
        await self.record({**event, "state": "cancelled" if cancelled else "failed" if error else "done",
                           "result": result, "error": error})
