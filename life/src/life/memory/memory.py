"""Memory system for L.I.F.E - Three-tier memory with forgetting curve and persistence."""

from dataclasses import dataclass, field
from datetime import datetime, timedelta
import json
import math
import os
import hashlib
import shutil
import re
import sqlite3
import threading
import time
import uuid
from functools import wraps, lru_cache
from collections import deque
from contextlib import contextmanager
from ..logging_setup import get_logger
from ..timeutil import now_utc, parse_utc, to_local_naive

logger = get_logger("memory")

#: What a withdrawn fact's content is replaced with.  Withdrawal is one of the
#: few irreversible acts in the system, so the payload is purged rather than
#: hidden behind a status flag - only the audit row (that it happened, and why)
#: survives.  The character can know something was taken back, not what it said.
RETRACTED_TOMBSTONE = "[已撤回]"
try:
    import tantivy
except ImportError:
    tantivy = None
from pathlib import Path
from typing import Optional


@lru_cache(maxsize=256)
def _cached_query_words(query: str) -> frozenset[str]:
    return frozenset(query.lower().split())


@lru_cache(maxsize=1)
def _tantivy_schema():
    """Tantivy schema for the memory projection, built once per process.

    The schema (three stored text fields) was rebuilt on every search and every
    projection rebuild — pure per-call overhead, since it never changes.  The
    *Index* itself is deliberately **not** cached: a live Tantivy ``Index`` holds
    OS file handles / mmap on the segment and meta files, and on Windows those
    block deletion of the data directory (e.g. temp-dir cleanup), so the index is
    opened per use instead.
    """
    schema_builder = tantivy.SchemaBuilder()
    schema_builder.add_text_field("id", stored=True)
    schema_builder.add_text_field("content", stored=True)
    schema_builder.add_text_field("tags", stored=True)
    return schema_builder.build()


@dataclass
class Memory:
    """A single memory entry."""
    id: str
    content: str
    importance: float  # 0.0 to 1.0
    created_at: datetime
    last_recalled: datetime
    recall_count: int = 0
    strength: float = 1.0
    tags: list[str] = field(default_factory=list)
    metadata: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "content": self.content,
            "importance": self.importance,
            "created_at": self.created_at.isoformat(),
            "last_recalled": self.last_recalled.isoformat(),
            "recall_count": self.recall_count,
            "strength": self.strength,
            "tags": self.tags,
            "metadata": self.metadata,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "Memory":
        return cls(
            id=data["id"],
            content=data["content"],
            importance=data["importance"],
            created_at=to_local_naive(datetime.fromisoformat(data["created_at"])),
            last_recalled=to_local_naive(datetime.fromisoformat(data["last_recalled"])),
            recall_count=data.get("recall_count", 0),
            strength=data.get("strength", 1.0),
            tags=data.get("tags", []),
            metadata=data.get("metadata", {}),
        )


class WorkingMemory:
    """Current conversation context (short-term)."""

    def __init__(self, max_turns: int = 20):
        self.max_turns = max_turns
        self.messages: list[dict] = []
        self.session_start = datetime.now()

    def add(self, role: str, content: str) -> None:
        self.messages.append({
            "role": role,
            "content": content,
            "timestamp": datetime.now().isoformat(),
        })
        if len(self.messages) > self.max_turns:
            self.messages = self.messages[-self.max_turns:]

    def get_context(self) -> str:
        return "\n".join(f"{m['role']}: {m['content']}" for m in self.messages)

    def get_recent(self, n: int = 5) -> list[dict]:
        return self.messages[-n:]

    def clear(self) -> None:
        self.messages.clear()
        self.session_start = datetime.now()

    def to_dict(self) -> dict:
        return {
            "messages": self.messages,
            "session_start": self.session_start.isoformat(),
        }


class ShortTermMemory:
    """Recent memories with persistence."""

    def __init__(self, db_path: str = "./data/memory/short_term"):
        self.db_path = db_path
        self.memories: list[Memory] = []
        self.archive: list[Memory] = []
        self._file = f"{db_path}/memories.json"
        self._dirty = False
        self._last_save = 0.0
        self._ensure_dir()
        self._load()

    def _ensure_dir(self):
        os.makedirs(self.db_path, exist_ok=True)

    def _load(self):
        """Load memories from disk, tolerating a corrupt or foreign file."""
        try:
            with open(self._file, "r", encoding="utf-8") as f:
                data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError, OSError, UnicodeDecodeError):
            self.memories = []
            return
        raw = data.get("memories", []) if isinstance(data, dict) else []
        loaded: list[Memory] = []
        for item in raw:
            try:
                loaded.append(Memory.from_dict(item))
            except (KeyError, TypeError, ValueError) as error:
                logger.warning("skipping malformed short-term memory: %s", error)
        self.memories = loaded

    def _save(self):
        """Atomically save memories (UTF-8, tmp + replace)."""
        self._ensure_dir()
        temporary = Path(self._file).with_suffix(".tmp")
        payload = {"memories": [m.to_dict() for m in self.memories]}
        temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        os.replace(temporary, self._file)
        self._dirty = False
        self._last_save = time.monotonic()

    def flush(self) -> None:
        """Persist pending recall reinforcement, if any."""
        if self._dirty:
            self._save()

    def store(self, content: str, importance: float = 0.5, tags: list[str] = None, metadata: dict = None) -> Memory:
        now = datetime.now()
        memory = Memory(
            id=f"stm_{now.strftime('%Y%m%d_%H%M%S_%f')}",
            content=content,
            importance=importance,
            created_at=now,
            last_recalled=now,
            tags=tags or [],
            metadata=metadata or {},
        )
        self.memories.append(memory)
        self._save()
        return memory

    def recall(self, query: str, top_k: int = 5) -> list[Memory]:
        """Recall relevant memories."""
        scored = []
        query_lower = query.lower()
        query_words = _cached_query_words(query)

        for m in self.memories:
            score = 0.0
            content_lower = m.content.lower()
            content_words = set(content_lower.split())

            # Word overlap
            overlap = query_words & content_words
            score += len(overlap) * 1.0

            # Tag match
            for tag in m.tags:
                if tag.lower() in query_lower:
                    score += 2.0

            # Phrase match
            if query_lower in content_lower:
                score += 3.0

            if score > 0:
                score *= m.strength
                scored.append((score, m))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = []
        for _, m in scored[:top_k]:
            m.recall_count += 1
            m.last_recalled = datetime.now()
            m.strength = self._calculate_strength(m)
            results.append(m)

        # A recall is a read path: mark the reinforcement dirty and persist at
        # most once a minute instead of rewriting every memory on every call.
        self._dirty = True
        if time.monotonic() - self._last_save >= 60.0:
            self._save()
        return results

    def _calculate_strength(self, memory: Memory) -> float:
        """Ebbinghaus forgetting curve."""
        days = (datetime.now() - memory.created_at).total_seconds() / 86400
        effective_lambda = 0.1
        strength = memory.importance * math.exp(-effective_lambda * days)
        strength *= (1 + memory.recall_count * 0.2)
        return min(1.0, max(0.0, strength))

    def consolidate(self) -> list[Memory]:
        """Move strong memories to long-term, archive weak ones (never drop)."""
        to_consolidate = []
        remaining = []
        for m in self.memories:
            if m.strength > 0.7:
                to_consolidate.append(m)
            elif m.strength > 0.2:
                remaining.append(m)
            else:
                # Below the retention floor: archive rather than delete.  The old
                # code dropped these from the list and persisted the loss, so a
                # low-strength memory silently ceased to exist.
                self.archive.append(m)
        self.memories = remaining
        self._save()
        return to_consolidate

    def get_stats(self) -> dict:
        return {
            "total": len(self.memories),
            "archived": len(self.archive),
            "avg_strength": sum(m.strength for m in self.memories) / max(len(self.memories), 1),
        }


class LongTermMemory:
    """Important memories with graph relationships."""

    def __init__(self, db_path: str = "./data/memory/long_term"):
        self.db_path = db_path
        self.memories: list[Memory] = []
        self.relations: list[tuple[str, str, str]] = []
        self._file = f"{db_path}/memories.json"
        self._relations_file = f"{db_path}/relations.json"
        self._ensure_dir()
        self._load()

    def _ensure_dir(self):
        os.makedirs(self.db_path, exist_ok=True)

    def _load(self):
        try:
            with open(self._file, "r", encoding="utf-8") as f:
                data = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError, OSError, UnicodeDecodeError):
            data = {}
        raw = data.get("memories", []) if isinstance(data, dict) else []
        loaded: list[Memory] = []
        for item in raw:
            try:
                loaded.append(Memory.from_dict(item))
            except (KeyError, TypeError, ValueError) as error:
                logger.warning("skipping malformed long-term memory: %s", error)
        self.memories = loaded

        try:
            with open(self._relations_file, "r", encoding="utf-8") as f:
                relations = json.load(f)
        except (FileNotFoundError, json.JSONDecodeError, OSError, UnicodeDecodeError):
            relations = {}
        raw_relations = relations.get("relations", []) if isinstance(relations, dict) else []
        self.relations = []
        for item in raw_relations:
            try:
                self.relations.append(tuple(item))
            except TypeError:
                continue

    def _save(self):
        for path, payload in ((self._file, {"memories": [m.to_dict() for m in self.memories]}),
                              (self._relations_file, {"relations": self.relations})):
            temporary = Path(path).with_suffix(".tmp")
            temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
            os.replace(temporary, path)

    def store(self, memory: Memory) -> None:
        self.memories.append(memory)
        self._save()

    def recall(self, query: str, top_k: int = 5) -> list[Memory]:
        scored = []
        query_lower = query.lower()
        query_words = _cached_query_words(query)

        for m in self.memories:
            score = 0.0
            content_lower = m.content.lower()
            for word in query_words:
                if word in content_lower:
                    score += 1.0
            if score > 0:
                score *= m.strength
                scored.append((score, m))

        scored.sort(key=lambda x: x[0], reverse=True)
        results = []
        for _, m in scored[:top_k]:
            m.recall_count += 1
            m.last_recalled = datetime.now()
            results.append(m)
        return results

    def add_relation(self, id1: str, relation: str, id2: str) -> None:
        self.relations.append((id1, relation, id2))
        self._save()

    def get_related(self, memory_id: str) -> list[tuple[str, str, str]]:
        return [(r[0], r[1], r[2]) for r in self.relations if memory_id in (r[0], r[2])]


def _scope_visible(stored: object, scope: str) -> bool:
    """Whether a memory with `stored` scope is visible to `scope`.

    An empty scope means "public only" — private (session-scoped) facts must be
    requested explicitly, so a caller that forgets to pass a session scope can
    never recall another session's private conversation. Use "*" for an explicit
    all-scopes (admin) query.

    ``credential`` is special: those facts hold generated server passwords, so
    they are write-only secrets.  Only an explicit ``credential`` request (the
    Minecraft login lookup) may read them back — even ``"*"`` does not, matching
    ``export_snapshot`` which already excludes the scope entirely.
    """
    value = str(stored or "public")
    if value == "credential":
        return scope == "credential"
    if scope == "*":
        return True
    if not scope:
        return value == "public"
    return value in ("public", scope)


def _is_credential(memory) -> bool:
    """True when a stored memory holds a write-only secret."""
    return str(memory.metadata.get("scope") or "public") == "credential"


def _default_num(value: object, default: float) -> float:
    """``float(value)`` that keeps a real ``0.0``.

    ``value or default`` is wrong for importance/strength: a legitimate 0.0 is
    falsy and would be replaced by the default on every import round-trip.
    """
    return default if value is None else float(value)


def synchronized(method):
    @wraps(method)
    def locked(self, *args, **kwargs):
        with self._lock:
            return method(self, *args, **kwargs)
    return locked


def _clamp01(value: object) -> float:
    try:
        return max(0.0, min(1.0, float(value)))
    except (TypeError, ValueError):
        return 0.0


def _lability_window() -> tuple[bool, float]:
    """Nader & Hardt 2009: a trace only becomes plastic again after reactivation.

    Consolidated memories "re-enter states of transient instability following
    reactivation, from which they must again stabilize in order to persist".  So
    reconsolidation is not a free operation on any stored trace — it is only
    available inside a window that *retrieval* opens.  Read from
    ``CognitionConfig`` for the same reason the encoding thresholds are.

    Deliberately *not* cached: ``CognitionConfig`` can be reconfigured at
    runtime (the engine adopts live thresholds via ``set_engram_config``), and a
    ``lru_cache`` would pin the very first value read forever, so a config
    change — or a test that monkeypatches the config — would silently keep using
    the stale window.
    """
    try:
        from ..cognition import CognitionConfig
        config = CognitionConfig()
        return (bool(config.use_lability_window), float(config.lability_window_seconds))
    except Exception:  # pragma: no cover - cognition core is optional
        return (True, 21600.0)


def _engram_thresholds() -> tuple[float, float, float, float, float]:
    """The cognition core's encoding / reconsolidation thresholds.

    The durable store must agree with the in-memory trace store about what is
    worth encoding and where the strengthen/update/recreate boundaries sit, so
    these are read from ``CognitionConfig`` rather than duplicated.  The import
    is guarded because the cognition core is an optional layer; the literals are
    its documented defaults.
    """
    try:
        from ..cognition import CognitionConfig
        config = CognitionConfig()
        return (float(config.theta_pe), float(config.theta_n),
                float(config.mismatch_medium), float(config.mismatch_severe),
                float(config.replay_lambda))
    except Exception:  # pragma: no cover - cognition core is optional
        return (0.25, 0.35, 0.6, 1.4, 0.01)


class MemorySystem:
    """Unified memory system with three tiers."""

    def __init__(self, data_dir: str = "./data/memory"):
        self._lock = threading.RLock()
        self.data_dir = str(Path(data_dir).resolve())
        # Live cognition thresholds (adopted via `set_engram_config`) so the
        # durable store and the in-memory trace store cannot drift apart.
        self._engram_cfg = None
        self._audit_writes = 0
        self._episode_cap = 2000
        self.working = WorkingMemory()
        self.short_term = ShortTermMemory(f"{self.data_dir}/short_term")
        self.long_term = LongTermMemory(f"{self.data_dir}/long_term")
        self.notes_dir = Path(self.data_dir) / "notes"
        self.notes_dir.mkdir(parents=True, exist_ok=True)
        self.index_path = Path(self.data_dir) / "memory_index.json"
        self.backup_dir = Path(self.data_dir) / "backups"
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        self._index: dict = {"documents": {}, "avgdl": 0.0, "df": {}, "updated_at": ""}
        self._index_dirty = False
        # Set when an incremental Tantivy write fails: the projection may then be
        # missing or duplicating a document, and the next rebuild must redo it
        # wholesale. A silently stale lexical index is worse than a slow one.
        self._tantivy_dirty = False
        # Per-memory token sets, keyed by id and guarded by the content string:
        # the rerank recomputed `_tokens(memory.content)` for up to ~20 candidates
        # on every query.  A changed content invalidates the entry, so no write
        # path has to remember to clear it.
        self._token_cache: dict[str, tuple[str, frozenset[str]]] = {}
        self.db_path = Path(self.data_dir) / "memory_center.db"
        self.tantivy_dir = Path(self.data_dir) / "tantivy_memory"
        self._cleanup_stale_tantivy_dirs()
        self._init_fact_store()
        self._migrate_json_projection()
        self._reload_facts()
        with self._connect() as db:
            # Old notes lacked ownership. Keep them available to the dashboard,
            # but do not expose them to arbitrary conversation sessions.
            if not db.execute("SELECT 1 FROM memory_migrations WHERE name='note_scope_v1'").fetchone():
                for memory in self.short_term.memories+self.long_term.memories:
                    if memory.metadata.get('memory_type')=='note' and memory.metadata.get('scope','public')=='public':
                        memory.metadata['scope']='legacy:unassigned'
                        self._upsert_fact_tx(db,memory,'long_term' if memory in self.long_term.memories else 'short_term')
                db.execute("INSERT INTO memory_migrations VALUES('note_scope_v1')")
        self.rebuild_index()

    def _reload_facts(self):
        """SQLite is authoritative; JSON files are legacy projections."""
        self.short_term.memories = []
        self.long_term.memories = []
        with self._connect() as db:
            # One batched tag query instead of one per fact (was N+1 on every
            # restart and every daily consolidate).
            tag_map: dict[str, list[str]] = {}
            for tag_row in db.execute("SELECT fact_id, tag FROM memory_tags").fetchall():
                tag_map.setdefault(tag_row["fact_id"], []).append(tag_row["tag"])
            for row in db.execute("SELECT * FROM memory_facts WHERE status='active' ORDER BY created_at"):
                value = dict(row)
                value["metadata"] = json.loads(row["metadata_json"])
                value["tags"] = tag_map.get(row["id"], [])
                memory = Memory.from_dict(value)
                (self.long_term if row["tier"] == "long_term" else self.short_term).memories.append(memory)

    @contextmanager
    def _connect(self):
        # Close each SQLite handle after use: a long-lived connection holds a
        # file lock on Windows even after the caller has finished with
        # MemorySystem.  Serialise the whole transaction so concurrent calls
        # cannot close/reopen the handle underneath one another.
        #
        # journal_mode=PERSIST, deliberately NOT WAL: SQLite deletes a WAL
        # database's ``-wal``/``-shm`` sidecars whenever the *last* connection
        # closes, so a connect-per-operation loop churns two sidecar files on
        # every call.  On Windows those deletions surface as Recycle-Bin litter
        # (thousands of ``.db-wal``/``.db-shm`` entries) and add two syscalls per
        # operation.  PERSIST keeps one rollback-journal file that is truncated
        # in place and reused, so there is no per-call churn while commit
        # atomicity and crash-safety are unchanged.
        with self._lock:
            conn = sqlite3.connect(self.db_path, timeout=30.0)
            conn.row_factory = sqlite3.Row
            try:
                conn.execute("PRAGMA journal_mode=PERSIST")
                conn.execute("PRAGMA busy_timeout=30000")
                with conn:
                    yield conn
            finally:
                conn.close()

    def close(self, release_index: bool = False) -> None:
        """Checkpoint the store, deleting nothing on the normal path.

        The store runs in ``PERSIST`` mode (see ``_connect``), so a close is
        side-effect free: the rollback journal is reused in place rather than
        deleted, and there are no ``-wal``/``-shm`` sidecars.  Only a database
        written by an older WAL build still has sidecars, and those are removed
        so the legacy files do not linger.

        ``release_index=True`` additionally drops the Tantivy projection, which
        is what a temp-dir-backed caller wants before it removes the directory.
        It is off by default because deleting a few thousand index files on
        every close is pure churn for a long-lived install — the projection is
        derived data and is rebuilt lazily whenever it is missing.
        """
        try:
            conn = sqlite3.connect(self.db_path, timeout=30.0)
            try:
                # Migrates a legacy WAL database to PERSIST and checkpoints it.
                conn.execute("PRAGMA journal_mode=PERSIST")
            finally:
                conn.close()
        except sqlite3.Error as error:  # pragma: no cover - best effort
            logger.warning("journal cleanup failed: %s", error)
        # Only touch a sidecar that actually exists: an unconditional unlink
        # would itself be a deletion (visible as Recycle-Bin litter on Windows)
        # on every single close, for a file PERSIST never creates.
        for suffix in ("-wal", "-shm"):
            sidecar = Path(str(self.db_path) + suffix)
            if sidecar.exists():
                sidecar.unlink(missing_ok=True)
        if release_index:
            self._release_tantivy_dir()

    def _release_tantivy_dir(self) -> None:
        """Delete the Tantivy projection so the data dir can actually be removed.

        Only called from ``close(release_index=True)`` — a temp-dir-backed
        MemorySystem wants the directory gone before its caller removes it, and
        Tantivy keeps OS file handles open on its segment files, which on
        Windows makes the containing directory undeletable.  A long-lived
        install does NOT want this: the projection is derived data (SQLite holds
        the facts), deleting thousands of segment files on every close is pure
        churn, and a missing projection is simply rebuilt on the next search.
        """
        import gc
        gc.collect()  # drop any lingering Index/writer objects before unlinking
        try:
            shutil.rmtree(self.tantivy_dir, ignore_errors=True)
        except OSError as error:  # pragma: no cover - best effort
            logger.warning("tantivy dir cleanup failed: %s", error)
            return
        self._tantivy_dirty = True

    def _cleanup_stale_tantivy_dirs(self) -> None:
        """Remove leftover ``tantivy-*`` temp dirs left by older code paths.

        Tantivy creates a randomly-named ``tantivy-<id>`` directory whenever an
        index is opened without an explicit path.  The current code always uses
        ``tantivy_memory``, so any sibling ``tantivy-*`` directory is stale and
        was previously never cleaned up.
        """
        try:
            pattern = re.compile(r"^tantivy-[A-Za-z0-9_]+$")
            for stale in Path(self.data_dir).glob("tantivy-*"):
                if stale.is_dir() and pattern.match(stale.name):
                    shutil.rmtree(stale, ignore_errors=True)
        except OSError as error:  # pragma: no cover - best-effort cleanup
            logger.warning("stale tantivy dir cleanup failed: %s", error)

    def _init_fact_store(self) -> None:
        with self._connect() as db:
            db.executescript("""
            CREATE TABLE IF NOT EXISTS memory_facts (id TEXT PRIMARY KEY, content TEXT NOT NULL, importance REAL NOT NULL, strength REAL NOT NULL, tier TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', scope TEXT NOT NULL DEFAULT 'public', metadata_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, last_recalled TEXT NOT NULL, recall_count INTEGER NOT NULL DEFAULT 0, source_kind TEXT NOT NULL DEFAULT 'conversation', source_ref TEXT, supersedes_id TEXT);
            CREATE TABLE IF NOT EXISTS memory_tags (fact_id TEXT NOT NULL, tag TEXT NOT NULL, PRIMARY KEY(fact_id,tag));
            CREATE TABLE IF NOT EXISTS note_files (id TEXT PRIMARY KEY, path TEXT NOT NULL, title TEXT NOT NULL, content_hash TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS note_chunks (id TEXT PRIMARY KEY, note_id TEXT NOT NULL, chunk_no INTEGER NOT NULL, start_line INTEGER NOT NULL, end_line INTEGER NOT NULL, content TEXT NOT NULL, token_count INTEGER NOT NULL, UNIQUE(note_id,chunk_no));
            CREATE TABLE IF NOT EXISTS memory_projection_state (name TEXT PRIMARY KEY, version INTEGER NOT NULL, updated_at TEXT NOT NULL, detail_json TEXT NOT NULL DEFAULT '{}');
            CREATE TABLE IF NOT EXISTS reflection_queue (id TEXT PRIMARY KEY, session_id TEXT NOT NULL, user_text TEXT NOT NULL, assistant_text TEXT NOT NULL, status TEXT NOT NULL, proposal_json TEXT, created_at TEXT NOT NULL, processed_at TEXT, scope TEXT NOT NULL DEFAULT 'public');
            CREATE TABLE IF NOT EXISTS memory_audit (id TEXT PRIMARY KEY, fact_id TEXT, kind TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS memory_migrations (name TEXT PRIMARY KEY);
            CREATE TABLE IF NOT EXISTS note_scopes (note_id TEXT PRIMARY KEY, scope TEXT NOT NULL);
            """)
            # Additive migration for installs created before reflection scopes.
            self._ensure_column(db, "reflection_queue", "scope", "TEXT NOT NULL DEFAULT 'public'")

    @staticmethod
    def _ensure_column(db, table: str, column: str, ddl: str) -> None:
        columns = {row[1] for row in db.execute(f"PRAGMA table_info({table})").fetchall()}
        if column not in columns:
            db.execute(f"ALTER TABLE {table} ADD COLUMN {column} {ddl}")

    def _migrate_json_projection(self) -> None:
        # One-way, first-boot import of the legacy JSON projection.  It is
        # intentionally not re-run after `clear_all` (marker stays), so a purge is
        # permanent rather than resurrecting the old JSON files.
        with self._connect() as db:
            if db.execute("SELECT 1 FROM memory_migrations WHERE name='json_import'").fetchone():
                return
            if not db.execute("SELECT COUNT(*) FROM memory_facts").fetchone()[0]:
                for tier, records in (("short_term", self.short_term.memories), ("long_term", self.long_term.memories)):
                    for record in records:
                        self._upsert_fact_tx(db, record, tier)
            db.execute("INSERT INTO memory_migrations VALUES('json_import')")

    def _upsert_fact_tx(self, db, memory: Memory, tier: str) -> None:
        scope = str(memory.metadata.get("scope") or "public")
        source_kind = str(memory.metadata.get("source_kind") or "conversation")
        db.execute("INSERT OR REPLACE INTO memory_facts VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (memory.id,memory.content,memory.importance,memory.strength,tier,"active",scope,json.dumps(memory.metadata,ensure_ascii=False),memory.created_at.isoformat(),memory.last_recalled.isoformat(),memory.recall_count,source_kind,memory.metadata.get("source_ref"),memory.metadata.get("supersedes_id")))
        db.execute("DELETE FROM memory_tags WHERE fact_id=?",(memory.id,))
        db.executemany("INSERT INTO memory_tags VALUES(?,?)",[(memory.id,tag) for tag in memory.tags])

    def _sync_fact(self, memory: Memory, tier: str) -> None:
        with self._connect() as db:
            self._upsert_fact_tx(db,memory,tier)
            db.execute("INSERT INTO memory_audit VALUES(?,?,?,?,?)",(f"audit_{uuid.uuid4().hex}",memory.id,"upsert",tier,datetime.now().isoformat()))
        # The audit log is append-only; bound it so long-running installs do not
        # grow without limit.  Pruning is throttled because every write would be
        # an extra query.
        self._audit_writes += 1
        if self._audit_writes % 200 == 0:
            try:
                self._prune_audit()
            except Exception as error:
                logger.warning("Audit prune failed: %s", error)

    def _prune_audit(self, cap: int = 5000) -> None:
        with self._connect() as db:
            db.execute("DELETE FROM memory_audit WHERE created_at < "
                       "(SELECT created_at FROM memory_audit ORDER BY created_at DESC LIMIT 1 OFFSET ?)",
                       (max(0, int(cap)),))

    def set_engram_config(self, config) -> None:
        """Adopt the live cognition thresholds (called by the engine on reconfigure)."""
        self._engram_cfg = config

    def _thresholds(self) -> tuple[float, float, float, float, float]:
        config = self._engram_cfg
        if config is None:
            return _engram_thresholds()
        try:
            return (float(config.theta_pe), float(config.theta_n),
                    float(config.mismatch_medium), float(config.mismatch_severe),
                    float(config.replay_lambda))
        except Exception:
            return _engram_thresholds()

    def _lability_settings(self) -> tuple[bool, float]:
        """Live lability-window config (falls back to the module default)."""
        config = self._engram_cfg
        if config is not None and hasattr(config, "use_lability_window"):
            try:
                return (bool(config.use_lability_window), float(config.lability_window_seconds))
            except Exception:
                pass
        return _lability_window()

    def _prune_episodes(self, cap: int | None = None) -> int:
        cap = self._episode_cap if cap is None else int(cap)
        episodes = [m for m in self.short_term.memories if m.metadata.get("memory_type") == "episode"]
        if len(episodes) <= cap:
            return 0
        episodes.sort(key=lambda m: (float(m.strength), m.created_at))
        dropped = episodes[:len(episodes) - cap]
        ids = {m.id for m in dropped}
        if not ids:
            return 0
        self.short_term.memories = [m for m in self.short_term.memories if m.id not in ids]
        with self._connect() as db:
            db.executemany("DELETE FROM memory_facts WHERE id=?", [(i,) for i in ids])
            db.executemany("DELETE FROM memory_tags WHERE fact_id=?", [(i,) for i in ids])
        # Incremental index update: drop each pruned doc instead of a full rebuild.
        for fact_id in ids:
            self._index_remove_doc(fact_id)
        self._index["updated_at"] = datetime.now().isoformat()
        self._persist_index()
        self._persist_projection_state({"available": tantivy is not None, "note": "incremental remove"})
        return len(ids)

    @synchronized
    def add_working(self, role: str, content: str) -> None:
        self.working.add(role, content)

    @synchronized
    def store(self, content: str, importance: float = 0.5, tags: list[str] = None, metadata: dict = None,
              strength: float = 1.0) -> Memory:
        now = datetime.now()
        memory = Memory(id=f"stm_{__import__('uuid').uuid4().hex}", content=content, importance=importance,
                        created_at=now, last_recalled=now, tags=tags or [], metadata=metadata or {},
                        strength=_clamp01(strength))
        self._sync_fact(memory, "short_term")
        self.short_term.memories.append(memory)
        # Incremental index update: add the one new doc instead of forcing a
        # full re-tokenise of the whole corpus on the next search.  The old
        # `_index_dirty` flag made every stored memory pay a full BM25 rebuild
        # (the per-turn hot path); this touches only the single document.
        self._index_upsert_doc(memory)
        self._index["updated_at"] = now.isoformat()
        self._persist_index()
        self._persist_projection_state({"available": tantivy is not None, "note": "incremental upsert"})
        return memory

    @synchronized
    def recall(self, query: str, top_k: int = 5, scope: str = "") -> list[Memory]:
        ranked = self.search(query, top_k=top_k, scope=scope)
        lookup = {m.id: m for m in self.short_term.memories + self.long_term.memories}
        return [lookup[item["id"]] for item in ranked if item["id"] in lookup]

    @synchronized
    def apply_forgetting(self, lam: float = 0.05) -> int:
        """Ebbinghaus decay over the durable store (McClelland 1995: slow cortex).

        ``s(t) = importance * exp(-lam * days) * (1 + 0.2 * recall_count)``, so a
        trace that is never revisited fades while a recalled/important one holds.
        Historically ``store`` pinned every trace at strength 1.0, so this curve
        never ran and tiering collapsed into one ever-growing tier.
        """
        now = datetime.now()
        changed = 0
        with self._connect() as db:
            for memory in self.short_term.memories + self.long_term.memories:
                days = max(0.0, (now - memory.created_at).total_seconds() / 86400.0)
                decayed = float(memory.importance) * math.exp(-float(lam) * days) * (1 + memory.recall_count * 0.2)
                new_strength = _clamp01(decayed)
                if abs(new_strength - float(memory.strength)) > 1e-4:
                    memory.strength = new_strength
                    self._upsert_fact_tx(db, memory, self._tier_of(memory))
                    changed += 1
        return changed

    # Memory types whose *semantic/factual* content must not be forgotten away.
    _DURABLE_TYPES = ("fact", "semantic", "reflection", "note", "credential")

    @synchronized
    def consolidate(self) -> None:
        """SWS half: transfer strong traces to long-term, archive forgotten ones."""
        with self._connect() as db:
            for m in self.short_term.memories:
                if m.strength > 0.7:
                    self._upsert_fact_tx(db, m, "long_term")
                elif (m.strength < 0.05 and m.recall_count == 0
                      and str(m.metadata.get("memory_type")) not in self._DURABLE_TYPES):
                    db.execute("UPDATE memory_facts SET status='archived' WHERE id=?", (m.id,))
        self._reload_facts()
        self.rebuild_index()
        self.daily_backup()

    @synchronized
    def rem_stabilize(self, window_hours: float = 24.0, boost: float = 0.1) -> int:
        """REM half (Rasch & Born 2013): stabilise what was replayed/recalled.

        Anything recalled inside the window is consolidated by strengthening it;
        this is the "then stabilise them" step after the SWS transfer.
        """
        now = datetime.now()
        stabilized = 0
        with self._connect() as db:
            for memory in self.short_term.memories + self.long_term.memories:
                age = (now - memory.last_recalled).total_seconds() / 3600.0
                if memory.recall_count > 0 and age <= float(window_hours):
                    memory.strength = _clamp01(float(memory.strength) + float(boost))
                    self._upsert_fact_tx(db, memory, self._tier_of(memory))
                    stabilized += 1
        return stabilized

    @synchronized
    def sleep_cycle(self, lam: float = 0.05) -> dict:
        """One night of sleep: SWS (forget + transfer structure) then REM (stabilise)."""
        report = {"forgotten": self.apply_forgetting(lam), "semantics": self.extract_semantics()}
        self.consolidate()
        report["consolidated"] = len(self.long_term.memories)
        report["stabilized"] = self.rem_stabilize()
        report["reinforced"] = self.periodic_reinforce()
        report["reflections_pruned"] = self._prune_reflections()
        return report

    def get_memory_context(self, query: str, scope: str = "", top_k: int = 3) -> str:
        memories = self.recall(query, top_k=max(1, min(int(top_k), 20)), scope=scope)
        if not memories:
            return "No relevant memories found."

        lines = ["Relevant memories:"]
        for m in memories:
            lines.append(f"- {m.content}")
        return "\n".join(lines)

    @synchronized
    def get_stats(self) -> dict:
        return {
            "working": len(self.working.messages),
            "short_term": self.short_term.get_stats(),
            "long_term": len(self.long_term.memories),
        }

    @synchronized
    def list_items(self) -> list[dict]:
        """All live memories with their tier, owned by the memory system.

        Callers (e.g. the engine's console read-out) used to reach into
        ``short_term.memories`` / ``long_term.memories`` under this class's
        private ``_lock``; this method owns the locking instead so the internals
        stay encapsulated.
        """
        return [
            {**memory.to_dict(), "tier": tier}
            for tier, records in (("short_term", self.short_term.memories),
                                  ("long_term", self.long_term.memories))
            for memory in records
            # Credential facts are never part of a listing: this feeds the WebUI
            # sidebar and the engine's memory read-out, neither of which should
            # render a plaintext server password.
            if not _is_credential(memory)
        ]

    @synchronized
    def dashboard(self) -> dict:
        """Read-out for the memory console: tiers, TMD strength profile, RRF meta."""
        import collections
        memories = self.short_term.memories + self.long_term.memories
        histogram = [0] * 10
        for memory in memories:
            histogram[min(9, int(max(0.0, min(0.999, float(memory.strength))) * 10))] += 1
        types = collections.Counter(str(m.metadata.get("memory_type") or "knowledge") for m in memories)
        with self._connect() as db:
            reflections = {row["status"]: row["c"] for row in
                           db.execute("SELECT status, COUNT(*) AS c FROM reflection_queue GROUP BY status").fetchall()}
            audit = db.execute("SELECT COUNT(*) FROM memory_audit").fetchone()[0]
            notes = db.execute("SELECT COUNT(*) FROM note_files WHERE status='active'").fetchone()[0]
        curve = [{"day": day, "strength": round(0.7 * math.exp(-0.05 * day), 4)} for day in range(0, 91, 5)]
        return {
            "tiers": {"short_term": len(self.short_term.memories), "long_term": len(self.long_term.memories)},
            "total": len(memories),
            "avg_strength": round(sum(float(m.strength) for m in memories) / max(1, len(memories)), 4),
            "low_strength": sum(1 for m in memories if float(m.strength) < 0.35),
            "strength_histogram": histogram,
            "types": dict(types),
            "notes": notes, "audit": audit, "reflections": reflections,
            "decay_curve": curve, "rrf_k": 60,
        }

    @synchronized
    def reinforce(self, query: str, max_items: int = 5, scope: str = "") -> list[Memory]:
        """Actively strengthen memories related to query (forgetting-curve reinforcement)."""
        candidates = self.recall(query, top_k=max_items, scope=scope)
        for m in candidates:
            # Active recall bumps strength beyond normal recall path
            m.strength = min(1.0, m.strength + 0.15)
            m.recall_count += 1
            m.last_recalled = datetime.now()
            # Persist back into owning tier
            if any(x.id == m.id for x in self.short_term.memories):
                self._sync_fact(m, "short_term")
            elif any(x.id == m.id for x in self.long_term.memories):
                self._sync_fact(m, "long_term")
        return candidates

    def low_strength_memories(self, threshold: float = 0.35, limit: int = 10) -> list[Memory]:
        """Memories at risk of being forgotten (need reinforcement)."""
        pool = [m for m in self.short_term.memories + self.long_term.memories if m.strength < threshold]
        pool.sort(key=lambda m: m.strength)
        return pool[:limit]

    @synchronized
    def periodic_reinforce(self) -> int:
        """Background pass: reinforce weak but important memories."""
        reinforced = 0
        for m in self.low_strength_memories(threshold=0.35, limit=10):
            if m.importance >= 0.5:
                m.strength = min(1.0, m.strength + 0.2)
                m.recall_count += 1
                reinforced += 1
                if any(x.id == m.id for x in self.short_term.memories):
                    self._sync_fact(m, "short_term")
                elif any(x.id == m.id for x in self.long_term.memories):
                    self._sync_fact(m, "long_term")
        return reinforced

    # Angel-Memory-inspired active memory API. These operations are deliberately
    # explicit LLM tools rather than silently stuffing long documents in prompts.
    def remember(self, content: str, judgment: str = "", tags: list[str] | None = None,
                 strength: float = 0.8, memory_type: str = "knowledge", scope: str = "public") -> Memory:
        text = (content or judgment).strip()
        if not text:
            raise ValueError("content or judgment is required")
        normalized_tags = [str(tag).strip() for tag in (tags or []) if str(tag).strip()]
        # Deduplicate: reinforce an identical existing memory instead of storing a copy.
        duplicate = self._find_duplicate(text)
        if duplicate is not None:
            duplicate.strength = min(1.0, max(duplicate.strength, float(strength)) + 0.05)
            duplicate.importance = max(duplicate.importance, min(1.0, float(strength)))
            duplicate.recall_count += 1
            duplicate.last_recalled = datetime.now()
            for tag in normalized_tags:
                if tag not in duplicate.tags:
                    duplicate.tags.append(tag)
            self._sync_fact(duplicate, self._tier_of(duplicate))
            # The duplicate's tags may have grown, which changes its index
            # tokens; refresh that one doc incrementally rather than waiting
            # for a full rebuild.
            self._index_upsert_doc(duplicate)
            self._index["updated_at"] = datetime.now().isoformat()
            self._persist_index()
            self._persist_projection_state({"available": tantivy is not None, "note": "incremental upsert"})
            return duplicate
        metadata = {"memory_type": memory_type or "knowledge", "scope": scope or "public", "judgment": judgment}
        return self.store(text, importance=max(0.0, min(1.0, float(strength))), tags=normalized_tags,
                          metadata=metadata, strength=float(strength))

    def _find_duplicate(self, text: str) -> Memory | None:
        normalized = re.sub(r"\s+", "", text).lower()
        if not normalized:
            return None
        normalized_map = {re.sub(r"\s+", "", m.content).lower(): m
                          for m in self.short_term.memories + self.long_term.memories}
        return normalized_map.get(normalized)

    def active_recall(self, query: str = "", limit: int = 5, scope: str = "") -> list[Memory]:
        records = self.recall(query or " ", top_k=max(1, min(int(limit), 20)), scope=scope)
        return records

    # --- episodic / engram layer ------------------------------------------
    # Hippocampal-style traces: selectively encoded, retrieved by match x
    # strength x recency, and re-opened against new outcomes.  Thresholds come
    # from the cognition core (see `_engram_thresholds`) so this durable store
    # and the in-memory trace store never disagree.

    def _find_memory(self, memory_id: str) -> Optional[Memory]:
        for memory in self.short_term.memories + self.long_term.memories:
            if memory.id == memory_id:
                return memory
        return None

    @synchronized
    def remember_episode(self, content: str, prediction_error: float = 0.0, novelty: float = 0.0,
                         strength: float = 1.0, tags: list[str] | None = None,
                         scope: str = "public", supersedes_id: str = "",
                         metadata: dict | None = None) -> Optional[Memory]:
        """Encode one episodic trace, but only if it is worth encoding.

        Selective encoding gates on surprise *or* novelty:
        ``encode <=> |prediction_error| > theta_pe or novelty > theta_n``.
        A routine turn returns ``None`` and leaves no durable trace, which is
        what stops the store filling up with the unremarkable.

        Unlike :meth:`remember` this never deduplicates — two visits to the same
        content are two distinct traces and both must survive, because their
        strength and recency differ.
        """
        text = (content or "").strip()
        if not text:
            raise ValueError("content is required")
        theta_pe, theta_n, _medium, _severe, _decay = self._thresholds()
        if abs(float(prediction_error)) <= theta_pe and float(novelty) <= theta_n:
            return None
        payload = dict(metadata or {})
        payload.update({"memory_type": "episode", "scope": scope or "public",
                        "prediction_error": float(prediction_error), "novelty": float(novelty)})
        # `reconsolidate` compares a new reward against the reward the trace
        # *recorded*.  Persist it here (defaulting to the same importance the
        # reader falls back to) so an episode without an explicit reward is not
        # silently compared against ~1.0 and pushed into the recreate branch.
        payload.setdefault("reward", _clamp01(strength))
        if supersedes_id:
            payload["supersedes_id"] = supersedes_id
        memory = self.store(text, importance=_clamp01(strength), tags=list(tags or []), metadata=payload)
        memory.strength = _clamp01(strength)
        self._sync_fact(memory, "short_term")
        self._prune_episodes()
        return memory

    @synchronized
    def recall_engrams(self, query: str, top_k: int = 5, scope: str = "") -> list[dict]:
        """Retrieve episodic traces by match, trace strength and recency.

        ``priority = lexical_overlap * strength * exp(-lambda * age_seconds)``,
        so between two traces of identical content the one that was encoded more
        strongly (and more recently) wins.
        """
        wanted = set(self._tokens(query or " "))
        if not wanted:
            return []
        _pe, _n, _medium, _severe, decay = self._thresholds()
        now = datetime.now()
        ranked: list[tuple[float, Memory]] = []
        for memory in self.short_term.memories + self.long_term.memories:
            if memory.metadata.get("memory_type") != "episode":
                continue
            if not _scope_visible(memory.metadata.get("scope"), scope):
                continue
            overlap = len(wanted & set(self._tokens(memory.content)))
            if not overlap:
                continue
            age = max(0.0, (now - memory.created_at).total_seconds())
            recency = math.exp(-max(0.0, decay) * age)
            ranked.append((overlap * max(0.0, float(memory.strength)) * recency, memory))
        ranked.sort(key=lambda pair: pair[0], reverse=True)
        hits = []
        for score, memory in ranked[:max(1, int(top_k))]:
            memory.recall_count += 1
            memory.last_recalled = now
            # Nader & Hardt 2009: retrieval is what makes the trace labile again.
            # Marking it here is what opens the reconsolidation window.
            memory.metadata["last_reactivated"] = now.isoformat()
            self._sync_fact(memory, self._tier_of(memory))
            hits.append({"id": memory.id, "content": memory.content, "score": round(score, 6),
                         "strength": round(float(memory.strength), 4),
                         "prediction_error": memory.metadata.get("prediction_error", 0.0),
                         "novelty": memory.metadata.get("novelty", 0.0),
                         "tier": self._tier_of(memory), "tags": list(memory.tags),
                         "created_at": memory.created_at.isoformat(),
                         "labile": True})
        return hits

    @synchronized
    def reactivate(self, memory_id: str) -> dict:
        """Re-activate one trace, opening its reconsolidation window (Nader & Hardt 2009).

        Retrieval is the operation that destabilises a consolidated memory; this
        exposes it directly so a caller can make a trace writable without having
        to run a full retrieval pass.
        """
        memory = self._find_memory(memory_id)
        if memory is None:
            return {"branch": "missing", "id": memory_id}
        now = datetime.now()
        memory.metadata["last_reactivated"] = now.isoformat()
        memory.recall_count += 1
        memory.last_recalled = now
        self._sync_fact(memory, self._tier_of(memory))
        return {"branch": "reactivated", "id": memory_id, "at": now.isoformat()}

    def lability_of(self, memory_id: str) -> dict:
        """Is this trace currently writable?  (window opened by reactivation)."""
        memory = self._find_memory(memory_id)
        if memory is None:
            return {"labile": False, "branch": "missing", "id": memory_id}
        enabled, window = self._lability_settings()
        if not enabled:
            return {"labile": True, "branch": "window_disabled", "id": memory_id}
        stamp = str(memory.metadata.get("last_reactivated") or "")
        if not stamp:
            return {"labile": False, "branch": "not_reactivated", "id": memory_id}
        reactivated = parse_utc(stamp)
        age = float("inf") if reactivated is None else (now_utc() - reactivated).total_seconds()
        return {"labile": age <= window, "branch": "labile" if age <= window else "expired",
                "id": memory_id, "age_seconds": round(age, 1), "window_seconds": window}

    @synchronized
    def reconsolidate(self, memory_id: str, reward_new: float, surprise: float = 0.0) -> dict:
        """Re-open a stored trace against a new outcome — three branches.

        ``score = |reward_new - reward_e| + 0.1 * surprise`` mirrors the
        cognition core's mismatch measure, and the branches are
        ``strengthen <= medium < update <= severe < recreate``.  ``recreate``
        writes a *new* trace carrying ``supersedes_id``, so the trace that was
        overturned stays auditable instead of being overwritten.

        Nader & Hardt 2009: this is only possible while the trace is *labile*,
        i.e. inside the transient window that a retrieval opened.  Outside it the
        call is refused rather than silently applied — rewriting a consolidated
        trace that was never reactivated is exactly what the paper says does not
        happen.
        """
        memory = self._find_memory(memory_id)
        if memory is None:
            return {"branch": "missing", "id": memory_id}
        lability = self.lability_of(memory_id)
        if not lability.get("labile"):
            return {"branch": lability.get("branch", "not_labile"), "id": memory_id, "labile": False}
        _pe, _n, medium, severe, _decay = self._thresholds()
        # Compare against the reward the trace *recorded*, not its importance
        # (which `remember_episode` pins to the strength, i.e. always ~1.0).
        stored_reward = float(memory.metadata.get("reward", memory.importance))
        score = abs(float(reward_new) - stored_reward) + 0.1 * abs(float(surprise))
        if score <= medium:
            memory.strength = min(1.0, float(memory.strength) + 0.15)
            branch = "strengthen"
        elif score <= severe:
            memory.importance = _clamp01(reward_new)
            memory.strength = max(0.2, float(memory.strength) * 0.7)
            branch = "update"
        else:
            revised = self.store(memory.content, importance=_clamp01(reward_new), tags=list(memory.tags),
                                 metadata={**memory.metadata, "supersedes_id": memory.id,
                                           "prediction_error": float(surprise),
                                           "reconsolidated_at": datetime.now().isoformat()})
            revised.strength = 1.0
            self._sync_fact(revised, "short_term")
            # Nader 2009: the overturned trace is not silently left retrievable -
            # mark it superseded and let it fade (the forgetting curve archives it).
            memory.metadata["superseded_by"] = revised.id
            memory.strength = min(float(memory.strength), 0.1)
            branch = "recreate"
        self._sync_fact(memory, self._tier_of(memory))
        return {"branch": branch, "id": memory.id, "score": round(score, 4)}

    @staticmethod
    def _interleave(memories: list[Memory]) -> list[Memory]:
        """Round-robin across tag groups (McClelland 1995: interleaved replay).

        Replaying one topic's traces back-to-back lets the cortex overfit the
        recent cluster (catastrophic interference); interleaving forces it to find
        the structure shared across experiences instead.
        """
        groups: dict[str, list[Memory]] = {}
        for memory in memories:
            key = str((memory.tags or ["_"])[0])
            groups.setdefault(key, []).append(memory)
        # deque.popleft() is O(1); list.pop(0) is O(n), which made the whole
        # interleave O(n^2) on the replay buffer.
        queues = [deque(group) for group in groups.values()]
        out: list[Memory] = []
        while any(queues):
            for queue in queues:
                if queue:
                    out.append(queue.popleft())
        return out

    @synchronized
    def extract_semantics(self, min_cluster: int = 3, limit: int = 40,
                          cohesion: float = 0.34) -> list[dict]:
        """Neocortical half of CLS: pull the structure out of the traces.

        McClelland 1995 / Kumaran 2016 hold that the hippocampus keeps the
        specifics of individual experiences while the neocortex *gradually*
        acquires structured knowledge over the ensemble of them.  The fast half
        (``remember_episode``) was already there; this is the slow half.
        Episodes that keep recurring together are collapsed into one semantic
        memory carrying the gist plus the cluster statistics, the contributing
        traces are marked ``generalized_into`` so they are never re-generalised,
        and the result is filed in the long-term tier (the neocortex analogue)
        rather than the short-term one.

        Clustering is a single greedy pass over token-set Jaccard similarity —
        cheap, deterministic, and enough to express "these experiences share a
        structure" without a vector index.
        """
        episodes = [m for m in self.short_term.memories + self.long_term.memories
                    if m.metadata.get("memory_type") == "episode"
                    and not m.metadata.get("generalized_into")]
        episodes = self._interleave(episodes)
        schemas = [set(m.metadata.get("shared_terms") or [])
                   for m in self.short_term.memories + self.long_term.memories
                   if m.metadata.get("memory_type") == "semantic"]
        needed = max(2, int(min_cluster))
        if len(episodes) < 2:
            return []  # a lone trace forms no structure (fast-track needs >=2)
        clusters: list[list[Memory]] = []
        token_sets: list[set[str]] = []
        for memory in episodes:
            tokens = set(self._tokens(memory.content))
            if not tokens:
                continue
            best, best_score = -1, 0.0
            for index, existing in enumerate(token_sets):
                score = len(tokens & existing) / max(1, len(tokens | existing))
                if score > best_score:
                    best, best_score = index, score
            if best >= 0 and best_score >= float(cohesion):
                clusters[best].append(memory)
                token_sets[best] |= tokens
            else:
                clusters.append([memory])
                token_sets.append(set(tokens))
        created: list[dict] = []
        for members in clusters:
            if len(created) >= max(1, int(limit)):
                break  # limit reached — no point scanning the remaining clusters
            shared = set(self._tokens(members[0].content))
            for other in members[1:]:
                shared &= set(self._tokens(other.content))
            # Kumaran 2016: schema-consistent information is learned fast, so a
            # cluster matching an existing semantic schema needs fewer members.
            schema_matched = any(len(shared & schema) >= 2 for schema in schemas)
            if len(members) < needed and not schema_matched:
                continue
            representative = max(members, key=lambda m: float(m.strength))
            # Goal/importance-dependent replay weighting (Kumaran 2016): weight the
            # cluster statistics by how strongly each trace is held.
            weight = sum(float(m.strength) for m in members) or 1.0
            importance = sum(float(m.importance) * float(m.strength) for m in members) / weight
            # The stored *content* is the strongest member (a readable, concrete
            # exemplar); the structure the neocortex actually extracted is the
            # intersection, kept in `shared_terms` where it stays inspectable
            # instead of being mangled into an unreadable bag of n-grams.
            gist = representative.content
            tags = sorted(shared)[:8] + ["semantic"]
            semantic = self.store(gist, importance=_clamp01(importance), tags=tags,
                                  metadata={"memory_type": "semantic",
                                            "cluster_size": len(members),
                                            "shared_terms": sorted(shared),
                                            "schema_matched": schema_matched,
                                            "derived_from": [m.id for m in members],
                                            "extracted_at": datetime.now().isoformat()})
            semantic.strength = _clamp01(importance + (0.2 if schema_matched else 0.0))
            # The neocortex analogue is the long-term tier: file it there and
            # take it back out of the short-term store `store()` just used.
            self.short_term.memories = [m for m in self.short_term.memories if m.id != semantic.id]
            self.long_term.memories.append(semantic)
            self._sync_fact(semantic, "long_term")
            for member in members:
                member.metadata["generalized_into"] = semantic.id
                self._sync_fact(member, self._tier_of(member))
            created.append({"id": semantic.id, "content": gist, "cluster_size": len(members),
                            "importance": round(float(semantic.importance), 4),
                            "derived_from": [m.id for m in members],
                            "shared_terms": sorted(shared)[:12]})
        return created

    @synchronized
    def create_note(self, title: str, content: str, tags: list[str] | None = None, scope: str = "public") -> dict:
        title = re.sub(r"[^\w\-\u4e00-\u9fff]+", "-", (title or "note").strip()).strip("-") or "note"
        note_id = f"{uuid.uuid4().hex}-{title[:48]}"
        path = self.notes_dir / f"{note_id}.md"
        path.write_text(content.strip() + "\n", encoding="utf-8")
        note_id = path.stem
        chunks = self._chunk_note(content)
        with self._connect() as db:
            db.execute("INSERT OR REPLACE INTO note_files VALUES(?,?,?,?,?,?,?)",(note_id,str(path),title,hashlib.sha256(content.encode("utf-8")).hexdigest(),"active",datetime.now().isoformat(),datetime.now().isoformat()))
            db.execute("DELETE FROM note_chunks WHERE note_id=?",(note_id,))
            db.executemany("INSERT INTO note_chunks VALUES(?,?,?,?,?,?,?)",[(f"{note_id}:{index}",note_id,index,start,end,text,max(1,len(text)//4)) for index,start,end,text in chunks])
            db.execute("INSERT INTO note_scopes(note_id,scope) VALUES(?,?)",(note_id,scope))
        self.remember(
            content=f"Note {note_id}: {(content or '').strip()[:240]}",
            tags=["note", *(tags or [])],
            strength=0.9,
            memory_type="note",
            scope=scope,
        )
        return {"note_id": note_id, "path": str(path), "title": title, "bytes": path.stat().st_size}

    @staticmethod
    def _chunk_note(content: str, lines_per_chunk: int = 24) -> list[tuple[int,int,int,str]]:
        lines = content.splitlines()
        return [(index // lines_per_chunk, index + 1, min(len(lines), index + lines_per_chunk), "\n".join(lines[index:index + lines_per_chunk])) for index in range(0,len(lines),lines_per_chunk)]

    @synchronized
    def delete_fact(self, fact_id: str, reason: str = "user_delete") -> bool:
        """Withdraw a fact **permanently**.

        The content is purged from the fact store, the in-memory tiers, the
        search projection *and* every JSON backup, so nothing can bring it back.
        Backups were what used to make a deletion recoverable; scrubbing them is
        what makes it irreversible.  Only the audit row (that something was
        withdrawn, and why) survives.

        ``clear_all()`` is the memory-wide wipe, and ``LifeEngine.reset_person()``
        is the one deliberate "start over" escape hatch.
        """
        with self._connect() as db:
            exists = db.execute("SELECT 1 FROM memory_facts WHERE id=? AND status='active'",(fact_id,)).fetchone()
            if not exists: return False
            db.execute("UPDATE memory_facts SET status='retracted', content=?, metadata_json='{}' WHERE id=?",
                       (RETRACTED_TOMBSTONE, fact_id))
            db.execute("DELETE FROM memory_tags WHERE fact_id=?", (fact_id,))
            db.execute("INSERT INTO memory_audit VALUES(?,?,?,?,?)",(f"audit_{uuid.uuid4().hex}",fact_id,"retract",reason,datetime.now().isoformat()))
        self.short_term.memories=[m for m in self.short_term.memories if m.id != fact_id]; self.long_term.memories=[m for m in self.long_term.memories if m.id != fact_id]
        self.short_term._save(); self.long_term._save()
        self._scrub_backups(fact_id)
        # Incremental index update: drop the one doc instead of re-tokenising the
        # whole corpus (the old full `rebuild_index` per retract was the hot path).
        self._index_remove_doc(fact_id)
        self._index["updated_at"] = datetime.now().isoformat()
        self._persist_index()
        self._persist_projection_state({"available": tantivy is not None, "note": "incremental remove"})
        return True

    def _scrub_backups(self, fact_id: str) -> None:
        """Remove a withdrawn fact from every JSON backup (see `delete_fact`)."""
        for backup in self.backup_dir.glob("memory-*.json"):
            try:
                payload = json.loads(backup.read_text(encoding="utf-8"))
            except (OSError, json.JSONDecodeError):
                continue
            if not isinstance(payload, dict):
                continue
            changed = False
            for tier in ("short_term", "long_term"):
                items = payload.get(tier)
                if isinstance(items, list):
                    kept = [item for item in items
                            if not (isinstance(item, dict) and str(item.get("id")) == fact_id)]
                    if len(kept) != len(items):
                        payload[tier] = kept
                        changed = True
            documents = (payload.get("index") or {}).get("documents")
            if isinstance(documents, dict) and fact_id in documents:
                documents.pop(fact_id, None)
                changed = True
            if not changed:
                continue
            try:
                temporary = backup.with_name(backup.name + ".tmp")
                temporary.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
                os.replace(temporary, backup)
            except OSError as error:  # pragma: no cover - best-effort
                logger.warning("could not scrub backup %s: %s", backup.name, error)

    @synchronized
    def delete_episodes_by_tag(self, tag: str, reason: str = "world_clear") -> int:
        """Delete episodic traces carrying ``tag`` (e.g. world events)."""
        wanted = str(tag or "").strip()
        if not wanted:
            return 0
        ids = [m.id for m in (self.short_term.memories + self.long_term.memories)
               if m.metadata.get("memory_type") == "episode" and wanted in (m.tags or [])]
        return sum(1 for fact_id in ids if self.delete_fact(fact_id, reason))

    @synchronized
    def clear_all(self) -> dict:
        """Purge all LIFE memory facts, notes, proposals, and projections."""
        with self._connect() as db:
            counts = {
                "facts": db.execute("SELECT COUNT(*) FROM memory_facts WHERE status='active'").fetchone()[0],
                "notes": db.execute("SELECT COUNT(*) FROM note_files WHERE status='active'").fetchone()[0],
                "proposals": db.execute("SELECT COUNT(*) FROM reflection_queue").fetchone()[0],
            }
            for table in ("memory_tags", "memory_facts", "note_chunks", "note_files", "note_scopes", "reflection_queue", "memory_audit", "memory_projection_state"):
                db.execute(f"DELETE FROM {table}")
            db.execute("INSERT INTO memory_audit VALUES(?,?,?,?,?)", (f"audit_{uuid.uuid4().hex}", None, "clear_all", "dashboard_full_clear", datetime.now().isoformat()))
        self.working.clear()
        self.short_term.memories = []; self.long_term.memories = []
        self.short_term._save(); self.long_term._save()
        for note in self.notes_dir.glob("*.md"):
            note.unlink(missing_ok=True)
        for backup in self.backup_dir.glob('memory-*.json'):
            backup.unlink(missing_ok=True)
        try:
            if tantivy and self.tantivy_dir.exists():
                index = tantivy.Index.open(str(self.tantivy_dir))
                writer = index.writer(); writer.delete_all_documents(); writer.commit(); writer.wait_merging_threads()
        except Exception as error:
            logger.warning("Tantivy index clear failed: %s", error)
        self._index = {"documents": {}, "avgdl": 0.0, "df": {}, "updated_at": datetime.now().isoformat()}
        self._persist_index()
        return counts

    def enqueue_reflection(self, session_id: str, user_text: str, assistant_text: str) -> None:
        scope = f"session:{session_id}" if session_id else "public"
        with self._connect() as db:
            db.execute("INSERT INTO reflection_queue(id,session_id,user_text,assistant_text,status,proposal_json,created_at,processed_at,scope) VALUES(?,?,?,?,?,?,?,?,?)",
                       (f"reflection_{uuid.uuid4().hex}", session_id, user_text[:4000], assistant_text[:4000],
                        "pending", None, datetime.now().isoformat(), None, scope))

    def _prune_reflections(self, cap: int = 2000, retention_days: float = 7.0,
                           pending_cap: int = 500) -> int:
        """Bound the reflection queue: expire old processed rows and cap backlog.

        Both the processed backlog *and* the pending backlog are capped.  The
        pending queue was previously unbounded, so a processor that never drained
        it (throttled, disabled, or simply outpaced by ingest) would grow the
        table without limit.
        """
        cutoff = (datetime.now() - timedelta(days=float(retention_days))).isoformat()
        removed = 0
        with self._connect() as db:
            cursor = db.execute("DELETE FROM reflection_queue WHERE status IN ('applied','rejected') AND created_at < ?", (cutoff,))
            removed += cursor.rowcount
            rows = db.execute("SELECT id FROM reflection_queue WHERE status != 'pending' ORDER BY created_at ASC").fetchall()
            excess = len(rows) - max(0, int(cap))
            if excess > 0:
                ids = [row[0] for row in rows[:excess]]
                db.executemany("DELETE FROM reflection_queue WHERE id=?", [(i,) for i in ids])
                removed += len(ids)
            # Keep only the newest `pending_cap` unprocessed turns; the oldest
            # pending rows are the least likely to still be worth a proposal.
            pending = db.execute("SELECT id FROM reflection_queue WHERE status='pending' ORDER BY created_at ASC").fetchall()
            pending_excess = len(pending) - max(0, int(pending_cap))
            if pending_excess > 0:
                ids = [row[0] for row in pending[:pending_excess]]
                db.executemany("DELETE FROM reflection_queue WHERE id=?", [(i,) for i in ids])
                removed += len(ids)
        return removed

    def process_reflection_queue(self, max_items: int = 3) -> int:
        """Create low-risk memory proposals asynchronously; no direct LLM fact writes."""
        count=0
        with self._connect() as db:
            rows=db.execute("SELECT * FROM reflection_queue WHERE status='pending' ORDER BY created_at LIMIT ?",(max_items,)).fetchall()
            for row in rows:
                text=row["user_text"].strip()
                proposal={"kind":"memory_proposal","source":row["id"],"statement":"","risk":"low"}
                match=re.search(r"(?:我喜欢|我不喜欢|我的名字是|我叫)\s*([^，。！？!?]{1,80})",text)
                # Store the matched statement, not the whole turn (the regex was
                # computed before but its result was thrown away).
                if match: proposal["statement"] = match.group(0).strip()[:160]
                db.execute("UPDATE reflection_queue SET status=?,proposal_json=?,processed_at=? WHERE id=?",("proposed",json.dumps(proposal,ensure_ascii=False),datetime.now().isoformat(),row["id"]))
                count+=1
        self._prune_reflections()
        return count

    def read_note(self, note_id: str, offset: int = 1, limit: int = 200, scope: str = "") -> dict:
        # Sanitise once and use the same value for both the scope lookup and the
        # file open.  Previously the scope query used the raw id while the file
        # used Path(...).name, so "x/<private>" read the private note but the
        # scope check missed and fell back to "public".
        safe_id = Path(str(note_id)).name
        self._check_note_scope(safe_id, scope)
        candidate = self.notes_dir / f"{safe_id}.md"
        if not candidate.is_file():
            raise FileNotFoundError(f"note '{note_id}' not found")
        lines = candidate.read_text(encoding="utf-8").splitlines()
        start = max(1, int(offset))
        count = max(1, min(int(limit), 1000))
        selected = lines[start - 1:start - 1 + count]
        return {
            "note_id": note_id,
            "offset": start,
            "limit": count,
            "total_lines": len(lines),
            "has_more": start - 1 + len(selected) < len(lines),
            "content": "\n".join(f"{start + index}: {line}" for index, line in enumerate(selected)),
        }

    def _check_note_scope(self, note_id, scope):
        # Same rule as facts: empty scope means public-only, never "no check".
        safe_id = Path(str(note_id)).name
        with self._connect() as db:
            row = db.execute('SELECT scope FROM note_scopes WHERE note_id=?', (safe_id,)).fetchone()
        stored = row[0] if row else "public"
        if not _scope_visible(stored, scope):
            raise PermissionError('Note is not accessible in this session')

    def list_notes(self, query: str = "", limit: int = 20, scope: str = "") -> list[dict]:
        needle = (query or "").lower()
        notes = []
        with self._connect() as db:
            scopes = {row[0]: row[1] for row in db.execute("SELECT note_id, scope FROM note_scopes").fetchall()}
        for path in sorted(self.notes_dir.glob("*.md"), reverse=True):
            # Reuse the scope map loaded above instead of re-querying per note:
            # the old `_check_note_scope` opened a fresh DB connection for every
            # file (N+1 queries on a directory listing).
            if not _scope_visible(scopes.get(path.stem, "public"), scope):
                continue
            text = path.read_text(encoding="utf-8", errors="replace")
            if needle and needle not in path.stem.lower() and needle not in text.lower():
                continue
            notes.append({"note_id": path.stem, "preview": text[:240], "bytes": path.stat().st_size,
                          "scope": scopes.get(path.stem, "public")})
            if len(notes) >= max(1, min(int(limit), 100)):
                break
        return notes

    # --- Local retrieval pipeline: BM25 + hashed vectors + RRF + rerank ---
    def _persist_index(self) -> None:
        """Atomically persist the in-memory BM25 index (tmp + ``os.replace``).

        A bare ``write_text`` truncates the target first, so a crash or a
        concurrent reader mid-write would observe a partial/empty index and be
        forced into a full rebuild.

        Only ids/tokens/df/tier are written: the 256-float hashed vector per
        document is recomputed on load from the deterministic ``_vector`` hash
        over each memory's content (``rebuild_index``/``_index_upsert_doc``),
        so persisting it turned every write into a multi-MB JSON dump.  A
        leftover per-document ``vector``/``embedding`` field from the old
        format is ignored and overwritten here.
        """
        slim = dict(self._index)
        slim["documents"] = {memory_id: {key: value for key, value in doc.items()
                                         if key not in ("vector", "embedding")}
                             for memory_id, doc in self._index.get("documents", {}).items()}
        temporary = self.index_path.with_name(self.index_path.name + ".tmp")
        temporary.write_text(json.dumps(slim, ensure_ascii=False), encoding="utf-8")
        os.replace(temporary, self.index_path)

    @staticmethod
    def _tokens(text: str) -> list[str]:
        ascii_words = re.findall(r"[a-zA-Z0-9_]+", text.lower())
        cjk = re.findall(r"[\u4e00-\u9fff]", text)
        cjk_bigrams = ["".join(cjk[i:i + 2]) for i in range(max(0, len(cjk) - 1))]
        return ascii_words + cjk + cjk_bigrams

    def _memory_tokens(self, memory: Memory) -> frozenset[str]:
        """Token set for one memory, memoised until its content changes.

        The rerank scores candidates on every query; re-tokenising each one was
        pure repeated work.  The cached entry carries the content it was built
        from, so an edited memory misses the cache and is re-tokenised.
        """
        cached = self._token_cache.get(memory.id)
        if cached is not None and cached[0] == memory.content:
            return cached[1]
        tokens = frozenset(self._tokens(memory.content))
        self._token_cache[memory.id] = (memory.content, tokens)
        return tokens

    @classmethod
    def _vector(cls, text: str, dimensions: int = 256) -> list[float]:
        vector = [0.0] * dimensions
        for token in cls._tokens(text):
            bucket = int(hashlib.sha256(token.encode("utf-8")).hexdigest()[:8], 16) % dimensions
            vector[bucket] += 1.0
        norm = math.sqrt(sum(value * value for value in vector)) or 1.0
        return [value / norm for value in vector]

    @staticmethod
    def _cosine(a: list[float], b: list[float]) -> float:
        return sum(x * y for x, y in zip(a, b))

    @synchronized
    def rebuild_index(self) -> dict:
        documents = {}
        df: dict[str, int] = {}
        source = self.short_term.memories + self.long_term.memories
        # Membership test by id-set instead of list `in` per document (was O(n^2)).
        long_term_ids = {m.id for m in self.long_term.memories}
        for memory in source:
            tokens = self._tokens(f"{memory.content} {' '.join(memory.tags)}")
            tf: dict[str, int] = {}
            for token in tokens:
                tf[token] = tf.get(token, 0) + 1
            for token in tf:
                df[token] = df.get(token, 0) + 1
            documents[memory.id] = {"tokens": tf, "length": len(tokens) or 1, "vector": self._vector(memory.content), "tier": "long_term" if memory.id in long_term_ids else "short_term"}
        self._index = {"documents": documents, "avgdl": sum(doc["length"] for doc in documents.values()) / max(1, len(documents)), "df": df, "updated_at": datetime.now().isoformat()}
        self._persist_index()
        tantivy_detail = self._rebuild_tantivy_projection()
        self._index_dirty = False
        self._tantivy_dirty = False
        # A full rebuild re-reads every memory, so drop the memoised token sets
        # (stale entries for since-removed ids would otherwise linger).
        self._token_cache.clear()
        self._persist_projection_state(tantivy_detail)
        return {"documents": len(documents), "terms": len(df), "updated_at": self._index["updated_at"], "tantivy": tantivy_detail}

    def _persist_projection_state(self, tantivy_detail: dict) -> None:
        """Write the dashboard-facing index metadata (BM25 + vector-hash).

        Extracted from ``rebuild_index`` so the incremental upsert/remove paths
        can refresh the same metadata without recomputing the whole index.
        """
        documents = self._index.get("documents", {})
        with self._connect() as db:
            db.execute("INSERT INTO memory_projection_state(name,version,updated_at,detail_json) VALUES('bm25_tantivy',1,?,?) ON CONFLICT(name) DO UPDATE SET version=version+1,updated_at=excluded.updated_at,detail_json=excluded.detail_json", (self._index["updated_at"], json.dumps(tantivy_detail, ensure_ascii=False)))
            db.execute("INSERT INTO memory_projection_state(name,version,updated_at,detail_json) VALUES('vector_hash',1,?,?) ON CONFLICT(name) DO UPDATE SET version=version+1,updated_at=excluded.updated_at,detail_json=excluded.detail_json", (self._index["updated_at"], json.dumps({"dimensions": 256, "documents": len(documents)}, ensure_ascii=False)))

    def _index_upsert_doc(self, memory) -> None:
        """Add or refresh a single document in the in-memory BM25 index.

        Keeps ``documents``/``df``/``avgdl`` consistent with a full rebuild but
        touches only the one memory, so a write no longer re-tokenises the whole
        corpus.  Replaces the per-write ``rebuild_index()`` for single-doc ops.
        """
        idx = self._index
        documents = idx.setdefault("documents", {})
        old = documents.get(memory.id)
        if old is not None:
            df = idx["df"]
            for token in old["tokens"]:
                if df.get(token, 0) > 1:
                    df[token] -= 1
                else:
                    df.pop(token, None)
        long_term_ids = {m.id for m in self.long_term.memories}
        tokens = self._tokens(f"{memory.content} {' '.join(memory.tags)}")
        tf: dict[str, int] = {}
        for token in tokens:
            tf[token] = tf.get(token, 0) + 1
        for token in tf:
            idx["df"][token] = idx["df"].get(token, 0) + 1
        documents[memory.id] = {"tokens": tf, "length": len(tokens) or 1,
                                 "vector": self._vector(memory.content),
                                 "tier": "long_term" if memory.id in long_term_ids else "short_term"}
        idx["avgdl"] = sum(doc["length"] for doc in documents.values()) / max(1, len(documents))
        # Keep the durable lexical projection in step. Before this, the
        # incremental path only updated in-memory BM25 and wrote a placeholder
        # note, so a newly stored memory was invisible to Tantivy until the next
        # full rebuild - i.e. lexical search silently missed recent memories.
        if not self._tantivy_upsert_doc(memory):
            self._tantivy_dirty = True

    def _index_remove_doc(self, fact_id: str) -> None:
        """Drop a single document from the in-memory BM25 index (inverse of upsert)."""
        idx = self._index
        documents = idx.get("documents", {})
        old = documents.pop(fact_id, None)
        if old is None:
            return
        df = idx["df"]
        for token in old["tokens"]:
            if df.get(token, 0) > 1:
                df[token] -= 1
            else:
                df.pop(token, None)
        idx["avgdl"] = sum(doc["length"] for doc in documents.values()) / max(1, len(documents))
        if not self._tantivy_remove_doc(fact_id):
            self._tantivy_dirty = True

    def _tantivy_open(self):
        """Open (creating on first use) the durable lexical index for a write.

        Same open-per-use policy as :func:`_tantivy_schema` documents for reads:
        a live Tantivy ``Index`` holds OS file handles that block directory
        deletion on Windows, so it is never cached on the instance.
        """
        if tantivy is None:
            return None
        self.tantivy_dir.parent.mkdir(parents=True, exist_ok=True)
        self.tantivy_dir.mkdir(parents=True, exist_ok=True)
        return tantivy.Index(_tantivy_schema(), path=str(self.tantivy_dir))

    def _tantivy_delete_by_id(self, index, writer, fact_id: str) -> None:
        """Drop one document by ``id`` from the durable lexical projection.

        ``writer.delete_documents`` is deprecated *and* matches on a raw term,
        which never matches a tokenised ``text`` field (verified against
        tantivy 0.26: the delete silently no-ops and re-adding then duplicates
        the memory). A parsed ``id:<value>`` query is exact and does not bleed
        onto ids sharing a token prefix.
        """
        writer.delete_documents_by_query(index.parse_query(f"id:{fact_id}", ["id"]))

    def _tantivy_upsert_doc(self, memory) -> bool:
        """Add or refresh one document. Returns False when the caller must rebuild."""
        if tantivy is None:
            return True  # projection unavailable by design: nothing to stay in sync with
        try:
            index = self._tantivy_open()
            if index is None:
                return True
            writer = index.writer()
            self._tantivy_delete_by_id(index, writer, str(memory.id))
            writer.add_document(tantivy.Document(
                id=str(memory.id), content=memory.content, tags=" ".join(memory.tags)))
            writer.commit(); writer.wait_merging_threads(); index.reload()
            return True
        except Exception as error:
            logger.warning("tantivy incremental upsert failed: %s", error)
            return False

    def _tantivy_remove_doc(self, fact_id: str) -> bool:
        """Remove one document. Returns False when the caller must rebuild."""
        if tantivy is None:
            return True
        try:
            index = self._tantivy_open()
            if index is None:
                return True
            writer = index.writer()
            self._tantivy_delete_by_id(index, writer, str(fact_id))
            writer.commit(); writer.wait_merging_threads(); index.reload()
            return True
        except Exception as error:
            logger.warning("tantivy incremental remove failed: %s", error)
            return False

    def _rebuild_tantivy_projection(self) -> dict:
        if tantivy is None:
            return {"available": False, "reason": "tantivy package unavailable"}
        self.tantivy_dir.parent.mkdir(parents=True, exist_ok=True)
        # Keep one stable directory: Windows may retain Tantivy segment file
        # handles, so delete/recreate or directory swaps are not reliable.
        self.tantivy_dir.mkdir(parents=True, exist_ok=True)
        index = tantivy.Index(_tantivy_schema(), path=str(self.tantivy_dir))
        writer = index.writer()
        writer.delete_all_documents()
        with self._connect() as db:
            rows = db.execute("SELECT f.id,f.content,COALESCE(GROUP_CONCAT(t.tag,' '),'') tags FROM memory_facts f LEFT JOIN memory_tags t ON t.fact_id=f.id WHERE f.status='active' GROUP BY f.id").fetchall()
        for row in rows:
            writer.add_document(tantivy.Document(id=row["id"], content=row["content"], tags=row["tags"]))
        writer.commit(); writer.wait_merging_threads(); index.reload()
        return {"available": True, "documents": len(rows), "path": str(self.tantivy_dir)}

    @synchronized
    def search(self, query: str, top_k: int = 5, rerank: bool = True, scope: str = "") -> list[dict]:
        # A failed incremental Tantivy write leaves the durable projection
        # possibly missing (or duplicating) a document; repair it here rather
        # than serving lexical results that silently omit recent memories.
        if getattr(self, "_index_dirty", False) or getattr(self, "_tantivy_dirty", False):
            self.rebuild_index()
        docs = self._index.get("documents", {})
        qtokens = self._tokens(query)
        n = len(docs) or 1
        avgdl = self._index.get("avgdl", 1.0) or 1.0
        bm25: list[tuple[str, float]] = []
        qvector = self._vector(query)
        vector: list[tuple[str, float]] = []
        allowed = {m.id for m in self.short_term.memories + self.long_term.memories
                   if _scope_visible(m.metadata.get("scope"), scope)}
        for memory_id, doc in docs.items():
            if memory_id not in allowed:
                continue
            score = 0.0
            for token in qtokens:
                freq = doc["tokens"].get(token, 0)
                if not freq:
                    continue
                idf = math.log(1 + (n - self._index["df"].get(token, 0) + .5) / (self._index["df"].get(token, 0) + .5))
                score += idf * (freq * 2.0) / (freq + 1.2 * (1 - .75 + .75 * doc["length"] / avgdl))
            if score > 0:
                bm25.append((memory_id, score))
                vector.append((memory_id, self._cosine(qvector, doc["vector"])))
        # Tantivy is the lexical/BM25 projection when available. The local
        # scorer remains a recovery fallback if an index is rebuilding.
        tantivy_hits = self._tantivy_search(query, max(top_k * 8, 40))
        if tantivy_hits:
            filtered = [(mid, score) for mid, score in tantivy_hits if mid in allowed]
            # Keep the in-scope local BM25 ranking if the *global* index was
            # dominated by other scopes; otherwise scoped retrieval vanishes.
            if filtered:
                bm25 = filtered
        bm25.sort(key=lambda item: item[1], reverse=True)
        vector.sort(key=lambda item: item[1], reverse=True)
        rrf: dict[str, float] = {}
        for rank, (memory_id, _) in enumerate(bm25, 1): rrf[memory_id] = rrf.get(memory_id, 0) + 1 / (60 + rank)
        for rank, (memory_id, _) in enumerate(vector, 1): rrf[memory_id] = rrf.get(memory_id, 0) + 1 / (60 + rank)
        lookup = {m.id: m for m in self.short_term.memories + self.long_term.memories}
        ranked = sorted(rrf.items(), key=lambda item: item[1], reverse=True)[:max(top_k * 5, 20)]
        if rerank:
            _pe, _n, _medium, _severe, decay = self._thresholds()
            # Freshness uses the same forgetting rate as `recall_engrams`: the
            # half-life `decay` implies, so the configured setting actually
            # affects search ranking instead of a hardcoded 90-day constant.
            half_life = math.log(2) / max(float(decay), 1e-9)
            qset = set(qtokens)
            reranked = []
            for memory_id, score in ranked:
                memory = lookup.get(memory_id)
                if not memory: continue
                overlap = len(qset & self._memory_tokens(memory))
                tag_boost = sum(1 for tag in memory.tags if tag.lower() in query.lower())
                freshness = max(0.0, 1 - (datetime.now() - memory.last_recalled).total_seconds() / half_life)
                reranked.append((memory_id, score + overlap * .03 + tag_boost * .05 + memory.importance * .04 + freshness * .01))
            ranked = sorted(reranked, key=lambda item: item[1], reverse=True)
        result = []
        for memory_id, score in ranked[:top_k]:
            memory = lookup.get(memory_id)
            if not memory: continue
            memory.recall_count += 1
            memory.last_recalled = datetime.now()
            memory.strength = min(1.0, memory.strength + .03)
            # The index normally carries the tier, but a memory missing from it
            # (mid-rebuild / incremental drift) must not discard the whole
            # result: derive the tier from the live memory instead.
            tier = (docs.get(memory_id) or {}).get("tier") or self._tier_of(memory)
            self._sync_fact(memory, tier)
            result.append({"id": memory.id, "content": memory.content, "score": round(score, 5), "tier": tier, "tags": memory.tags})
        return result

    def _tantivy_search(self, query: str, limit: int) -> list[tuple[str, float]]:
        if tantivy is None or not self.tantivy_dir.exists() or not query.strip():
            return []
        try:
            # Opened per call on purpose — see `_tantivy_schema` for why the
            # Index is not cached (Windows file-handle / cleanup interaction).
            index = tantivy.Index.open(str(self.tantivy_dir))
            index.reload()
            # CJK bi-grams are additionally handled by vector/token fallback;
            # Tantivy provides the durable lexical candidate ranking.
            # Lenient parsing on purpose: a query containing a colon ("srv:25565",
            # a pasted URL) is ordinary text to the user, but strict parsing reads
            # it as a field query and raises "Field does not exist".
            parsed = index.parse_query_lenient(query, ["content", "tags"])
            # This build returns `(query, errors)`; tolerate both shapes.
            if isinstance(parsed, tuple):
                parsed = parsed[0]
            searcher = index.searcher()
            hits = searcher.search(parsed, limit).hits
            out: list[tuple[str, float]] = []
            for score, address in hits:
                document = searcher.doc(address)
                raw = document.get_first("id")
                if raw is not None:
                    out.append((str(raw), float(score)))
            return out
        except Exception as error:
            logger.warning("Tantivy search failed: %s", error)
            return []

    def daily_backup(self) -> str:
        today = datetime.now().strftime("%Y%m%d")
        target = self.backup_dir / f"memory-{today}.json"
        if not target.exists():
            payload = {"created_at": datetime.now().isoformat(), "short_term": [m.to_dict() for m in self.short_term.memories], "long_term": [m.to_dict() for m in self.long_term.memories], "index": self._index}
            target.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        for stale in sorted(self.backup_dir.glob("memory-*.json"))[:-7]: stale.unlink(missing_ok=True)
        return str(target)

    @synchronized
    def maintenance(self) -> dict:
        consolidated_before = len(self.long_term.memories)
        recalc = self.recalculate_strengths()
        self.consolidate()
        index = self.rebuild_index()
        return {"consolidated": len(self.long_term.memories) - consolidated_before, "index": index,
                "strength_recalculated": recalc,
                "reflections_pruned": self._prune_reflections(), "backup": self.daily_backup()}

    def recalculate_strengths(self) -> int:
        """Re-apply the forgetting curve to every live memory.

        Strength used to be recomputed only on recall, so a memory nobody
        recalled kept its stale strength forever and never reached the
        archival floor.  A daily pass ages the whole store honestly.
        """
        from datetime import timedelta
        now = datetime.now()
        changed = 0
        for memory in self.short_term.memories + self.long_term.memories:
            days = (now - memory.created_at).total_seconds() / 86400
            effective_lambda = 0.1
            strength = memory.importance * math.exp(-effective_lambda * max(0.0, days))
            strength *= (1 + memory.recall_count * 0.2)
            fresh = min(1.0, max(0.0, strength))
            if abs(fresh - float(memory.strength)) >= 0.01:
                memory.strength = fresh
                changed += 1
        if changed:
            self._sync_dirty_tiers()
        return changed

    def _sync_dirty_tiers(self) -> None:
        """Persist tier membership after a bulk strength rewrite."""
        for memory in self.short_term.memories:
            self._sync_fact(memory, "short_term")
        for memory in self.long_term.memories:
            self._sync_fact(memory, "long_term")

    # --- Memory console API (dashboard browse / inspect / curate) ---
    def _tier_of(self, memory: Memory) -> str:
        return "long_term" if any(m.id == memory.id for m in self.long_term.memories) else "short_term"

    def _fact_dict(self, memory: Memory) -> dict:
        return {
            "id": memory.id,
            "content": memory.content,
            "importance": round(float(memory.importance), 4),
            "strength": round(float(memory.strength), 4),
            "created_at": memory.created_at.isoformat(),
            "last_recalled": memory.last_recalled.isoformat(),
            "recall_count": int(memory.recall_count),
            "tags": list(memory.tags),
            "tier": self._tier_of(memory),
            "scope": memory.metadata.get("scope", "public"),
            "memory_type": memory.metadata.get("memory_type", "knowledge"),
            "source_kind": memory.metadata.get("source_kind", "conversation"),
            # set on memories produced by `extract_semantics` (CLS neocortex)
            "cluster_size": int(memory.metadata.get("cluster_size", 0) or 0),
            "shared_terms": list(memory.metadata.get("shared_terms") or [])[:12],
        }

    @synchronized
    def page_facts(self, tier: str = "", query: str = "", limit: int = 50, offset: int = 0, sort: str = "recent", scope: str = "") -> dict:
        """Paged memory browse with full metadata for the dashboard."""
        pool = self.short_term.memories + self.long_term.memories
        if tier in ("short_term", "long_term"):
            pool = [m for m in pool if self._tier_of(m) == tier]
        # Empty scope means public-only (not "everything"): a caller that forgets
        # the scope must never see session-private or credential facts.  The
        # filter runs for "*" too, because `_scope_visible` still refuses
        # `credential` scope there — otherwise the admin browse leaked passwords.
        pool = [m for m in pool if not _is_credential(m) and _scope_visible(m.metadata.get("scope"), scope)]
        needle = (query or "").strip().lower()
        if needle:
            pool = [m for m in pool
                    if needle in m.content.lower() or any(needle in str(tag).lower() for tag in m.tags)]
        keys = {
            "recent": lambda m: m.created_at,
            "strength": lambda m: m.strength,
            "importance": lambda m: m.importance,
            "recall": lambda m: m.recall_count,
        }
        pool = sorted(pool, key=keys.get(sort, keys["recent"]), reverse=True)
        total = len(pool)
        size = max(1, min(int(limit), 200))
        start = max(0, int(offset))
        return {"items": [self._fact_dict(m) for m in pool[start:start + size]], "total": total, "offset": start, "limit": size}

    @synchronized
    def get_fact(self, fact_id: str) -> dict:
        for memory in self.short_term.memories + self.long_term.memories:
            if memory.id == fact_id:
                if _is_credential(memory):
                    # Read back only through an explicit credential-scope recall.
                    raise PermissionError(f"memory '{fact_id}' is credential-scoped")
                return self._fact_dict(memory)
        raise FileNotFoundError(f"memory '{fact_id}' not found")

    @synchronized
    def reinforce_facts(self, query: str = "", fact_ids: list[str] | None = None, limit: int = 5) -> list[dict]:
        """Reinforce memories by query or explicit ids (bump strength/recall)."""
        targets: list[Memory] = []
        if fact_ids:
            wanted = set(fact_ids)
            targets = [m for m in self.short_term.memories + self.long_term.memories if m.id in wanted and not _is_credential(m)]
        elif (query or "").strip():
            # Admin curation acts across every scope, not just public facts.
            targets = self.recall(query, top_k=max(1, min(int(limit), 20)), scope="*")
        for memory in targets:
            memory.strength = min(1.0, memory.strength + 0.15)
            memory.recall_count += 1
            memory.last_recalled = datetime.now()
            self._sync_fact(memory, self._tier_of(memory))
        return [self._fact_dict(m) for m in targets]

    @synchronized
    def adjust_importance(self, fact_id: str, delta: float) -> dict:
        """Nudge a memory's importance (manual curation)."""
        for memory in self.short_term.memories + self.long_term.memories:
            if memory.id == fact_id:
                if _is_credential(memory):
                    raise PermissionError("credential facts cannot be edited through the dashboard")
                memory.importance = max(0.0, min(1.0, memory.importance + float(delta)))
                self._sync_fact(memory, self._tier_of(memory))
                return self._fact_dict(memory)
        raise FileNotFoundError(f"memory '{fact_id}' not found")

    @synchronized
    def export_snapshot(self) -> dict:
        """Export active facts, tags and note registry as a portable JSON snapshot."""
        with self._connect() as db:
            # `credential` facts (e.g. auto-generated server passwords) must never
            # leave the host in a portable snapshot.
            facts = [dict(row) for row in db.execute("SELECT * FROM memory_facts WHERE status='active' AND scope != 'credential'").fetchall()]
            tags = [dict(row) for row in db.execute("SELECT * FROM memory_tags").fetchall()]
            notes = []
            notes_root = self.notes_dir.resolve()
            for row in db.execute("SELECT * FROM note_files WHERE status='active'").fetchall():
                item = dict(row)
                try:
                    # Confine the read to the notes directory: a tampered DB row
                    # must not turn export into an arbitrary-file read.
                    candidate = Path(str(item["path"])).resolve()
                    item["content"] = candidate.read_text(encoding="utf-8") if candidate.parent == notes_root else ""
                except OSError:
                    item["content"] = ""
                scope_row = db.execute("SELECT scope FROM note_scopes WHERE note_id=?", (item["id"],)).fetchone()
                item["scope"] = scope_row[0] if scope_row else "public"
                notes.append(item)
        return {"version": 1, "exported_at": datetime.now().isoformat(), "facts": facts, "tags": tags, "notes": notes}

    @synchronized
    def import_snapshot(self, snapshot: dict) -> dict:
        """Import a snapshot, skipping facts that already exist by id."""
        imported = 0
        skipped = 0
        with self._connect() as db:
            for row in snapshot.get("facts") or []:
                fact_id = str(row.get("id") or "")
                if not fact_id:
                    continue
                if db.execute("SELECT 1 FROM memory_facts WHERE id=?", (fact_id,)).fetchone():
                    skipped += 1
                    continue
                db.execute(
                    "INSERT INTO memory_facts(id,content,importance,strength,tier,status,scope,metadata_json,created_at,last_recalled,recall_count,source_kind,source_ref,supersedes_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
                    (fact_id, str(row.get("content") or ""), _default_num(row.get("importance"), 0.5),
                     _default_num(row.get("strength"), 0.5),
                     str(row.get("tier") or "short_term"), "active", str(row.get("scope") or "public"),
                     str(row.get("metadata_json") or "{}"), str(row.get("created_at") or datetime.now().isoformat()),
                     str(row.get("last_recalled") or datetime.now().isoformat()), int(row.get("recall_count") or 0),
                     str(row.get("source_kind") or "conversation"), row.get("source_ref"), row.get("supersedes_id")))
                imported += 1
            # Tags were exported but never restored before - a round-trip silently
            # dropped every tag.  Restore them (idempotent).
            for tag in snapshot.get("tags") or []:
                fact_id, tag_name = str(tag.get("fact_id") or ""), str(tag.get("tag") or "")
                if fact_id and tag_name:
                    db.execute("INSERT OR IGNORE INTO memory_tags(fact_id,tag) VALUES(?,?)", (fact_id, tag_name))
            restored_notes = 0
            notes_root = self.notes_dir.resolve()
            for note in snapshot.get("notes") or []:
                # Never trust a snapshot id: "../evil" used to escape notes_dir.
                note_id = Path(str(note.get("id") or "")).name
                if not note_id:
                    continue
                content = str(note.get("content") or "")
                note_path = self.notes_dir / f"{note_id}.md"
                if note_path.resolve().parent != notes_root:
                    continue
                if content:
                    note_path.write_text(content, encoding="utf-8")
                db.execute("INSERT OR REPLACE INTO note_files(id,path,title,content_hash,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?)",
                           (note_id, str(note.get("path") or note_path), str(note.get("title") or note_id),
                            hashlib.sha256(content.encode("utf-8")).hexdigest(), "active",
                            str(note.get("created_at") or datetime.now().isoformat()),
                            str(note.get("updated_at") or datetime.now().isoformat())))
                db.execute("DELETE FROM note_chunks WHERE note_id=?", (note_id,))
                db.executemany("INSERT INTO note_chunks VALUES(?,?,?,?,?,?,?)",
                               [(f"{note_id}:{index}", note_id, index, start, end, text, max(1, len(text) // 4))
                                for index, start, end, text in self._chunk_note(content)])
                db.execute("INSERT OR REPLACE INTO note_scopes(note_id,scope) VALUES(?,?)",
                           (note_id, str(note.get("scope") or "public")))
                restored_notes += 1
        self._reload_facts()
        self.rebuild_index()
        return {"imported": imported, "skipped": skipped, "notes": restored_notes}

    @synchronized
    def delete_note(self, note_id: str) -> bool:
        safe = Path(note_id).name
        path = self.notes_dir / f"{safe}.md"
        with self._connect() as db:
            row = db.execute("SELECT 1 FROM note_files WHERE id=?", (safe,)).fetchone()
            if not row and not path.is_file():
                return False
            db.execute("DELETE FROM note_chunks WHERE note_id=?", (safe,))
            db.execute("DELETE FROM note_scopes WHERE note_id=?", (safe,))
            db.execute("UPDATE note_files SET status='deleted', updated_at=? WHERE id=?", (datetime.now().isoformat(), safe))
            # Escape LIKE metacharacters: a note named "%" used to retract every
            # "Note ...:" fact.
            escaped = safe.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
            db.execute("UPDATE memory_facts SET status='retracted' WHERE content LIKE ? ESCAPE '\\'", (f"Note {escaped}:%",))
        path.unlink(missing_ok=True)
        # Collect the "Note X:" facts this note produced so we can drop them from
        # the search index one by one instead of re-tokenising the whole corpus.
        removed_ids = [m.id for m in self.short_term.memories + self.long_term.memories
                       if m.content.startswith(f"Note {safe}:")]
        self.short_term.memories = [m for m in self.short_term.memories if not m.content.startswith(f"Note {safe}:")]
        self.long_term.memories = [m for m in self.long_term.memories if not m.content.startswith(f"Note {safe}:")]
        for fact_id in removed_ids:
            self._index_remove_doc(fact_id)
        self._index["updated_at"] = datetime.now().isoformat()
        self._persist_index()
        self._persist_projection_state({"available": tantivy is not None, "note": "incremental remove"})
        return True

    @synchronized
    def list_reflections(self, status: str = "", limit: int = 50) -> list[dict]:
        with self._connect() as db:
            query = "SELECT * FROM reflection_queue"
            args: tuple = ()
            if status in ("pending", "proposed", "applied", "rejected"):
                query += " WHERE status=?"
                args = (status,)
            query += " ORDER BY created_at DESC LIMIT ?"
            rows = db.execute(query, (*args, max(1, min(int(limit), 200)))).fetchall()
        items = []
        for row in rows:
            proposal = {}
            if row["proposal_json"]:
                try:
                    proposal = json.loads(row["proposal_json"])
                except json.JSONDecodeError:
                    proposal = {}
            items.append({
                "id": row["id"],
                "session_id": row["session_id"],
                "status": row["status"],
                "statement": proposal.get("statement", ""),
                "risk": proposal.get("risk", "low"),
                "created_at": row["created_at"],
                "processed_at": row["processed_at"],
                "user_text": (row["user_text"] or "")[:280],
                "assistant_text": (row["assistant_text"] or "")[:280],
            })
        return items

    @synchronized
    def review_reflection(self, reflection_id: str, accept: bool) -> dict:
        with self._connect() as db:
            row = db.execute("SELECT * FROM reflection_queue WHERE id=?", (reflection_id,)).fetchone()
            if not row:
                raise FileNotFoundError(f"reflection '{reflection_id}' not found")
            proposal = {}
            if row["proposal_json"]:
                try:
                    proposal = json.loads(row["proposal_json"])
                except json.JSONDecodeError:
                    proposal = {}
            if not accept:
                db.execute("UPDATE reflection_queue SET status='rejected', processed_at=? WHERE id=?",
                           (datetime.now().isoformat(), reflection_id))
                return {"id": reflection_id, "status": "rejected"}
            statement = (proposal.get("statement") or row["user_text"] or "").strip()
            # Preserve the origin scope: a private reflection must not become
            # globally recallable just because it was accepted.
            origin_scope = str(row["scope"] or "public")
            db.execute("UPDATE reflection_queue SET status='applied', processed_at=? WHERE id=?",
                       (datetime.now().isoformat(), reflection_id))
        memory = None
        if statement:
            memory = self.remember(statement[:400], tags=["reflection"], strength=0.7,
                                   memory_type="reflection", scope=origin_scope)
        return {"id": reflection_id, "status": "applied", "memory_id": memory.id if memory else "", "scope": origin_scope}
