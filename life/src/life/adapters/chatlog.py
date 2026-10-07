"""Append-only log of the messages exchanged over the message-platform adapters.

The engine keeps rich *semantic* state (relationships, memories, group topics),
but nothing recorded the literal chat transcript — "who said what, and what did
L.I.F.E answer". The QQ-style viewer reads this log, so it is deliberately a
plain, transport-level record of the raw traffic, independent of persona logic.

It lives in its own SQLite file so a corruption there can never take the
companion store (which holds the character's lived state) down with it.
"""
from __future__ import annotations

import json
import sqlite3
import threading
import uuid
from datetime import datetime
from pathlib import Path

from ..logging_setup import get_logger

logger = get_logger("adapters.chatlog")

#: Bound on a stored message body, so one huge paste cannot bloat the file.
MAX_TEXT = 4000


def _now() -> str:
    return datetime.now().isoformat()


def conversation_key(group_id, user_id) -> str:
    """Stable conversation id: a group, or a private chat with one user."""
    return f"group:{group_id}" if group_id else f"private:{user_id}"


class ChatLog:
    """Create/read the ``chatlog.db`` transcript store."""

    def __init__(self, data_dir: str):
        self.path = Path(data_dir) / "chatlog.db"
        # CRUD runs on to_thread workers while the event loop also writes, so a
        # reentrant threading lock (not asyncio) is the right primitive.
        self._lock = threading.RLock()
        self._init()

    def _connect(self) -> sqlite3.Connection:
        conn = sqlite3.connect(self.path, timeout=10)
        conn.row_factory = sqlite3.Row
        return conn

    def _init(self) -> None:
        with self._lock, self._connect() as db:
            db.execute(
                """CREATE TABLE IF NOT EXISTS chat_messages (
                    id TEXT PRIMARY KEY,
                    adapter_id TEXT NOT NULL DEFAULT '',
                    platform TEXT NOT NULL DEFAULT 'aiocqhttp',
                    conversation TEXT NOT NULL,
                    kind TEXT NOT NULL,
                    peer_id TEXT NOT NULL DEFAULT '',
                    peer_name TEXT NOT NULL DEFAULT '',
                    direction TEXT NOT NULL,
                    self_id TEXT NOT NULL DEFAULT '',
                    text TEXT NOT NULL DEFAULT '',
                    media TEXT NOT NULL DEFAULT '[]',
                    message_id TEXT NOT NULL DEFAULT '',
                    created_at TEXT NOT NULL
                )"""
            )
            db.execute(
                "CREATE INDEX IF NOT EXISTS chat_conv_time ON chat_messages(conversation, created_at)"
            )
            # Display name per conversation. Groups have no name in a OneBot
            # message event, so it is resolved once via get_group_info and cached
            # here; a group must never be titled after a member's nickname.
            db.execute(
                "CREATE TABLE IF NOT EXISTS chat_meta (conversation TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT '')"
            )

    def record(self, *, adapter_id: str, platform: str, conversation: str, kind: str,
               peer_id: str, peer_name: str, direction: str, self_id: str = "",
               text: str = "", media=None, message_id: str = "") -> bool:
        """Append one message. Best-effort: a write failure never breaks a turn."""
        row = (
            uuid.uuid4().hex, str(adapter_id or ""), str(platform or "aiocqhttp"),
            str(conversation), str(kind), str(peer_id or ""), str(peer_name or ""),
            str(direction), str(self_id or ""), str(text or "")[:MAX_TEXT],
            json.dumps(media or [], ensure_ascii=False), str(message_id or ""), _now(),
        )
        try:
            with self._lock, self._connect() as db:
                db.execute("INSERT INTO chat_messages VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)", row)
            return True
        except Exception as error:  # pragma: no cover - storage fault
            logger.warning("chatlog write failed: %s", error)
            return False

    def conversations(self, limit: int = 100) -> list:
        """One row per conversation, newest activity first."""
        with self._lock, self._connect() as db:
            rows = db.execute(
                "SELECT conversation, MAX(created_at) AS last_at FROM chat_messages "
                "GROUP BY conversation ORDER BY last_at DESC LIMIT ?", (int(limit),)
            ).fetchall()
            out = []
            for row in rows:
                conv = row["conversation"]
                last = db.execute(
                    "SELECT * FROM chat_messages WHERE conversation=? ORDER BY created_at DESC LIMIT 1",
                    (conv,),
                ).fetchone()
                count = db.execute(
                    "SELECT COUNT(*) FROM chat_messages WHERE conversation=?", (conv,)
                ).fetchone()[0]
                named = db.execute(
                    "SELECT peer_name FROM chat_messages WHERE conversation=? AND peer_name!='' "
                    "ORDER BY created_at DESC LIMIT 1", (conv,),
                ).fetchone()
                meta = db.execute("SELECT name FROM chat_meta WHERE conversation=?", (conv,)).fetchone()
                meta_name = (meta["name"] if meta else "") or ""
                if conv.startswith("group:"):
                    # A group is titled by its own name only; the per-message
                    # peer_name is a *member's* nickname and must not be shown here.
                    display = meta_name
                else:
                    display = meta_name or (named["peer_name"] if named else "")
                out.append({
                    "conversation": conv,
                    "kind": last["kind"] if last else ("group" if conv.startswith("group:") else "private"),
                    "peer_id": conv.split(":", 1)[1] if ":" in conv else conv,
                    "name": display,
                    "adapter_id": last["adapter_id"] if last else "",
                    "last_text": last["text"] if last else "",
                    "last_direction": last["direction"] if last else "",
                    "last_at": row["last_at"],
                    "count": count,
                })
            return out

    def name(self, conversation: str) -> str:
        with self._lock, self._connect() as db:
            row = db.execute("SELECT name FROM chat_meta WHERE conversation=?", (conversation,)).fetchone()
        return (row["name"] if row else "") or ""

    def set_name(self, conversation: str, name: str) -> None:
        name = str(name or "").strip()
        if not name:
            return
        try:
            with self._lock, self._connect() as db:
                db.execute(
                    "INSERT INTO chat_meta(conversation, name) VALUES(?,?) "
                    "ON CONFLICT(conversation) DO UPDATE SET name=excluded.name",
                    (str(conversation), name),
                )
        except Exception as error:  # pragma: no cover - storage fault
            logger.warning("chatlog set_name failed: %s", error)

    def messages(self, conversation: str, limit: int = 200, before: str = "") -> list:
        """Messages of one conversation, oldest-first for display."""
        with self._lock, self._connect() as db:
            params: list = [conversation]
            sql = "SELECT * FROM chat_messages WHERE conversation=?"
            if before:
                sql += " AND created_at < ?"
                params.append(before)
            sql += " ORDER BY created_at DESC LIMIT ?"
            params.append(int(limit))
            rows = db.execute(sql, params).fetchall()
        return [self._row_to_dict(r) for r in reversed(rows)]

    @staticmethod
    def _row_to_dict(row) -> dict:
        try:
            media = json.loads(row["media"])
        except (TypeError, ValueError):
            media = []
        return {
            "id": row["id"], "adapter_id": row["adapter_id"], "platform": row["platform"],
            "conversation": row["conversation"], "kind": row["kind"], "peer_id": row["peer_id"],
            "peer_name": row["peer_name"], "direction": row["direction"], "self_id": row["self_id"],
            "text": row["text"], "media": media, "message_id": row["message_id"],
            "at": row["created_at"],
        }
