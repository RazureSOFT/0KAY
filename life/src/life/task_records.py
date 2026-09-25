"""Core-owned task ledger; keep a durable outbox when Core is unavailable."""
import asyncio
from contextvars import ContextVar
import json
import os
from pathlib import Path
import uuid
import httpx

from .http_auth import auth_headers

task_context = ContextVar("life_task_context", default={})


class TaskRecorder:
    def __init__(self, data_dir):
        self.path = Path(data_dir) / "task_outbox.json"
        self.lock = asyncio.Lock()
        self.base = (os.getenv("CORE_HTTP_ADDR") or os.getenv("CORE_HTTP") or "http://127.0.0.1:8080").rstrip("/")
        try:
            self.pending = json.loads(self.path.read_text(encoding="utf-8"))
        except FileNotFoundError:
            self.pending = []

    def _save(self):
        self.path.parent.mkdir(parents=True, exist_ok=True)
        temporary = self.path.with_suffix(".tmp")
        temporary.write_text(json.dumps(self.pending, ensure_ascii=False), encoding="utf-8")
        temporary.replace(self.path)

    async def record(self, event):
        event = dict(event)
        for key in ('prompt', 'result', 'error'):
            if isinstance(event.get(key), str) and len(event[key]) > 200000:
                event[key] = event[key][:200000] + '\n[record truncated]'
        async with self.lock:
            self.pending.append(event)
            self._save()
        await self.flush()

    def _headers(self):
        return auth_headers()

    async def flush(self):
        async with self.lock:
            async with httpx.AsyncClient(timeout=2) as client:
                while self.pending:
                    try:
                        response = await client.post(f"{self.base}/api/tasks", json=self.pending[0], headers=self._headers())
                        if response.status_code in (400, 413, 422):
                            with self.path.with_suffix('.rejected.jsonl').open('a', encoding='utf-8') as rejected:
                                rejected.write(json.dumps({'event': self.pending[0], 'status': response.status_code}, ensure_ascii=False)+'\n')
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
