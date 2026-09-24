"""Memory system for L.I.F.E - Three-tier memory with forgetting curve and persistence."""

from dataclasses import dataclass, field
from datetime import datetime
import json
import math
import os
import hashlib
import shutil
import re
import sqlite3
try:
    import tantivy
except ImportError:
    tantivy = None
from pathlib import Path
from typing import Optional


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
            created_at=datetime.fromisoformat(data["created_at"]),
            last_recalled=datetime.fromisoformat(data["last_recalled"]),
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
        self._file = f"{db_path}/memories.json"
        self._ensure_dir()
        self._load()

    def _ensure_dir(self):
        os.makedirs(self.db_path, exist_ok=True)

    def _load(self):
        """Load memories from disk."""
        try:
            with open(self._file, "r") as f:
                data = json.load(f)
            self.memories = [Memory.from_dict(m) for m in data.get("memories", [])]
        except (FileNotFoundError, json.JSONDecodeError):
            self.memories = []

    def _save(self):
        """Save memories to disk."""
        with open(self._file, "w") as f:
            json.dump({"memories": [m.to_dict() for m in self.memories]}, f, indent=2)

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
        query_words = set(query_lower.split())

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
        """Move strong memories to long-term, archive weak ones."""
        to_consolidate = []
        remaining = []
        for m in self.memories:
            if m.strength > 0.7:
                to_consolidate.append(m)
            elif m.strength > 0.2:
                remaining.append(m)
        self.memories = remaining
        self._save()
        return to_consolidate

    def get_stats(self) -> dict:
        return {
            "total": len(self.memories),
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
            with open(self._file, "r") as f:
                data = json.load(f)
            self.memories = [Memory.from_dict(m) for m in data.get("memories", [])]
        except (FileNotFoundError, json.JSONDecodeError):
            self.memories = []

        try:
            with open(self._relations_file, "r") as f:
                self.relations = [tuple(r) for r in json.load(f).get("relations", [])]
        except (FileNotFoundError, json.JSONDecodeError):
            self.relations = []

    def _save(self):
        with open(self._file, "w") as f:
            json.dump({"memories": [m.to_dict() for m in self.memories]}, f, indent=2)
        with open(self._relations_file, "w") as f:
            json.dump({"relations": self.relations}, f, indent=2)

    def store(self, memory: Memory) -> None:
        self.memories.append(memory)
        self._save()

    def recall(self, query: str, top_k: int = 5) -> list[Memory]:
        scored = []
        query_lower = query.lower()

        for m in self.memories:
            score = 0.0
            content_lower = m.content.lower()
            for word in query_lower.split():
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


class MemorySystem:
    """Unified memory system with three tiers."""

    def __init__(self, data_dir: str = "./data/memory"):
        self.data_dir = str(Path(data_dir).resolve())
        self.working = WorkingMemory()
        self.short_term = ShortTermMemory(f"{self.data_dir}/short_term")
        self.long_term = LongTermMemory(f"{self.data_dir}/long_term")
        self.notes_dir = Path(self.data_dir) / "notes"
        self.notes_dir.mkdir(parents=True, exist_ok=True)
        self.index_path = Path(self.data_dir) / "memory_index.json"
        self.backup_dir = Path(self.data_dir) / "backups"
        self.backup_dir.mkdir(parents=True, exist_ok=True)
        self._index: dict = {"documents": {}, "avgdl": 0.0, "df": {}, "updated_at": ""}
        self._load_index()
        self.db_path = Path(self.data_dir) / "memory_center.db"
        self.tantivy_dir = Path(self.data_dir) / "tantivy_memory"
        self._init_fact_store()
        self._migrate_json_projection()

    def _connect(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")
        return conn

    def _init_fact_store(self) -> None:
        with self._connect() as db:
            db.executescript("""
            CREATE TABLE IF NOT EXISTS memory_facts (id TEXT PRIMARY KEY, content TEXT NOT NULL, importance REAL NOT NULL, strength REAL NOT NULL, tier TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', scope TEXT NOT NULL DEFAULT 'public', metadata_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, last_recalled TEXT NOT NULL, recall_count INTEGER NOT NULL DEFAULT 0, source_kind TEXT NOT NULL DEFAULT 'conversation', source_ref TEXT, supersedes_id TEXT);
            CREATE TABLE IF NOT EXISTS memory_tags (fact_id TEXT NOT NULL, tag TEXT NOT NULL, PRIMARY KEY(fact_id,tag));
            CREATE TABLE IF NOT EXISTS note_files (id TEXT PRIMARY KEY, path TEXT NOT NULL, title TEXT NOT NULL, content_hash TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS note_chunks (id TEXT PRIMARY KEY, note_id TEXT NOT NULL, chunk_no INTEGER NOT NULL, start_line INTEGER NOT NULL, end_line INTEGER NOT NULL, content TEXT NOT NULL, token_count INTEGER NOT NULL, UNIQUE(note_id,chunk_no));
            CREATE TABLE IF NOT EXISTS memory_projection_state (name TEXT PRIMARY KEY, version INTEGER NOT NULL, updated_at TEXT NOT NULL, detail_json TEXT NOT NULL DEFAULT '{}');
            CREATE TABLE IF NOT EXISTS reflection_queue (id TEXT PRIMARY KEY, session_id TEXT NOT NULL, user_text TEXT NOT NULL, assistant_text TEXT NOT NULL, status TEXT NOT NULL, proposal_json TEXT, created_at TEXT NOT NULL, processed_at TEXT);
            CREATE TABLE IF NOT EXISTS memory_audit (id TEXT PRIMARY KEY, fact_id TEXT, kind TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL);
            """)

    def _migrate_json_projection(self) -> None:
        with self._connect() as db:
            if db.execute("SELECT COUNT(*) FROM memory_facts").fetchone()[0]:
                return
            for tier, records in (("short_term", self.short_term.memories), ("long_term", self.long_term.memories)):
                for record in records:
                    self._upsert_fact_tx(db, record, tier)

    def _upsert_fact_tx(self, db, memory: Memory, tier: str) -> None:
        scope = str(memory.metadata.get("scope") or "public")
        db.execute("INSERT OR REPLACE INTO memory_facts VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (memory.id,memory.content,memory.importance,memory.strength,tier,"active",scope,json.dumps(memory.metadata,ensure_ascii=False),memory.created_at.isoformat(),memory.last_recalled.isoformat(),memory.recall_count,"conversation",memory.metadata.get("source_ref"),memory.metadata.get("supersedes_id")))
        db.execute("DELETE FROM memory_tags WHERE fact_id=?",(memory.id,))
        db.executemany("INSERT INTO memory_tags VALUES(?,?)",[(memory.id,tag) for tag in memory.tags])

    def _sync_fact(self, memory: Memory, tier: str) -> None:
        with self._connect() as db:
            self._upsert_fact_tx(db,memory,tier)
            db.execute("INSERT INTO memory_audit VALUES(?,?,?,?,?)",(f"audit_{datetime.now().timestamp()}",memory.id,"upsert",tier,datetime.now().isoformat()))

    def add_working(self, role: str, content: str) -> None:
        self.working.add(role, content)

    def store(self, content: str, importance: float = 0.5, tags: list[str] = None, metadata: dict = None) -> Memory:
        memory = self.short_term.store(content, importance, tags, metadata)
        self._sync_fact(memory, "short_term")
        self.rebuild_index()
        return memory

    def recall(self, query: str, top_k: int = 5) -> list[Memory]:
        ranked = self.search(query, top_k=top_k)
        lookup = {m.id: m for m in self.short_term.memories + self.long_term.memories}
        return [lookup[item["id"]] for item in ranked if item["id"] in lookup]

    def consolidate(self) -> None:
        to_move = self.short_term.consolidate()
        for m in to_move:
            self.long_term.store(m)
            self._sync_fact(m, "long_term")
        self.rebuild_index()
        self.daily_backup()

    def get_memory_context(self, query: str) -> str:
        memories = self.recall(query, top_k=3)
        if not memories:
            return "No relevant memories found."

        lines = ["Relevant memories:"]
        for m in memories:
            lines.append(f"- {m.content}")
        return "\n".join(lines)

    def get_stats(self) -> dict:
        return {
            "working": len(self.working.messages),
            "short_term": self.short_term.get_stats(),
            "long_term": len(self.long_term.memories),
        }

    def reinforce(self, query: str, max_items: int = 5) -> list[Memory]:
        """Actively strengthen memories related to query (forgetting-curve reinforcement)."""
        candidates = self.recall(query, top_k=max_items)
        for m in candidates:
            # Active recall bumps strength beyond normal recall path
            m.strength = min(1.0, m.strength + 0.15)
            m.recall_count += 1
            m.last_recalled = datetime.now()
            # Persist back into owning tier
            if any(x.id == m.id for x in self.short_term.memories):
                self.short_term._save()
            elif any(x.id == m.id for x in self.long_term.memories):
                self.long_term._save()
        return candidates

    def low_strength_memories(self, threshold: float = 0.35, limit: int = 10) -> list[Memory]:
        """Memories at risk of being forgotten (need reinforcement)."""
        pool = list(self.short_term.memories) + list(self.long_term.memories)
        pool.sort(key=lambda m: m.strength)
        return pool[:limit]

    def periodic_reinforce(self) -> int:
        """Background pass: reinforce weak but important memories."""
        reinforced = 0
        for m in self.low_strength_memories(threshold=0.35, limit=10):
            if m.importance >= 0.5:
                m.strength = min(1.0, m.strength + 0.2)
                m.recall_count += 1
                reinforced += 1
                if any(x.id == m.id for x in self.short_term.memories):
                    self.short_term._save()
                elif any(x.id == m.id for x in self.long_term.memories):
                    self.long_term._save()
        return reinforced

    # Angel-Memory-inspired active memory API. These operations are deliberately
    # explicit LLM tools rather than silently stuffing long documents in prompts.
    def remember(self, content: str, judgment: str = "", tags: list[str] | None = None,
                 strength: float = 0.8, memory_type: str = "knowledge", scope: str = "public") -> Memory:
        text = (content or judgment).strip()
        if not text:
            raise ValueError("content or judgment is required")
        normalized_tags = [str(tag).strip() for tag in (tags or []) if str(tag).strip()]
        metadata = {"memory_type": memory_type or "knowledge", "scope": scope or "public", "judgment": judgment}
        return self.store(text, importance=max(0.0, min(1.0, float(strength))), tags=normalized_tags, metadata=metadata)

    def active_recall(self, query: str = "", limit: int = 5, scope: str = "") -> list[Memory]:
        records = self.recall(query or " ", top_k=max(1, min(int(limit), 20)))
        if scope:
            records = [record for record in records if record.metadata.get("scope", "public") == scope]
        return records

    def create_note(self, title: str, content: str, tags: list[str] | None = None) -> dict:
        title = re.sub(r"[^\w\-\u4e00-\u9fff]+", "-", (title or "note").strip()).strip("-") or "note"
        note_id = f"{datetime.now().strftime('%Y%m%d%H%M%S')}-{title[:48]}"
        path = self.notes_dir / f"{note_id}.md"
        path.write_text(content.strip() + "\n", encoding="utf-8")
        note_id = path.stem
        chunks = self._chunk_note(content)
        with self._connect() as db:
            db.execute("INSERT OR REPLACE INTO note_files VALUES(?,?,?,?,?,?,?)",(note_id,str(path),title,hashlib.sha256(content.encode("utf-8")).hexdigest(),"active",datetime.now().isoformat(),datetime.now().isoformat()))
            db.execute("DELETE FROM note_chunks WHERE note_id=?",(note_id,))
            db.executemany("INSERT INTO note_chunks VALUES(?,?,?,?,?,?,?)",[(f"{note_id}:{index}",note_id,index,start,end,text,max(1,len(text)//4)) for index,start,end,text in chunks])
        self.remember(
            content=f"Note {note_id}: {(content or '').strip()[:240]}",
            tags=["note", *(tags or [])],
            strength=0.9,
            memory_type="note",
        )
        return {"note_id": note_id, "path": str(path), "title": title, "bytes": path.stat().st_size}

    @staticmethod
    def _chunk_note(content: str, lines_per_chunk: int = 24) -> list[tuple[int,int,int,str]]:
        lines = content.splitlines()
        return [(index // lines_per_chunk, index + 1, min(len(lines), index + lines_per_chunk), "\n".join(lines[index:index + lines_per_chunk])) for index in range(0,len(lines),lines_per_chunk)]

    def delete_fact(self, fact_id: str, reason: str = "user_delete") -> bool:
        with self._connect() as db:
            exists = db.execute("SELECT 1 FROM memory_facts WHERE id=? AND status='active'",(fact_id,)).fetchone()
            if not exists: return False
            db.execute("UPDATE memory_facts SET status='retracted' WHERE id=?",(fact_id,))
            db.execute("INSERT INTO memory_audit VALUES(?,?,?,?,?)",(f"audit_{datetime.now().timestamp()}",fact_id,"retract",reason,datetime.now().isoformat()))
        self.short_term.memories=[m for m in self.short_term.memories if m.id != fact_id]; self.long_term.memories=[m for m in self.long_term.memories if m.id != fact_id]
        self.short_term._save(); self.long_term._save(); self.rebuild_index()
        return True

    def clear_all(self) -> dict:
        """Purge all LIFE memory facts, notes, proposals, and projections."""
        with self._connect() as db:
            counts = {
                "facts": db.execute("SELECT COUNT(*) FROM memory_facts WHERE status='active'").fetchone()[0],
                "notes": db.execute("SELECT COUNT(*) FROM note_files WHERE status='active'").fetchone()[0],
                "proposals": db.execute("SELECT COUNT(*) FROM reflection_queue").fetchone()[0],
            }
            for table in ("memory_tags", "memory_facts", "note_chunks", "note_files", "reflection_queue", "memory_audit", "memory_projection_state"):
                db.execute(f"DELETE FROM {table}")
            db.execute("INSERT INTO memory_audit VALUES(?,?,?,?,?)", (f"audit_{datetime.now().timestamp()}", None, "clear_all", "dashboard_full_clear", datetime.now().isoformat()))
        self.working.clear()
        self.short_term.memories = []; self.long_term.memories = []
        self.short_term._save(); self.long_term._save()
        for note in self.notes_dir.glob("*.md"):
            note.unlink(missing_ok=True)
        try:
            if tantivy and self.tantivy_dir.exists():
                index = tantivy.Index.open(str(self.tantivy_dir))
                writer = index.writer(); writer.delete_all_documents(); writer.commit(); writer.wait_merging_threads()
        except Exception:
            pass
        self._index = {"documents": {}, "avgdl": 0.0, "df": {}, "updated_at": datetime.now().isoformat()}
        self.index_path.write_text(json.dumps(self._index, ensure_ascii=False), encoding="utf-8")
        return counts

    def enqueue_reflection(self, session_id: str, user_text: str, assistant_text: str) -> None:
        with self._connect() as db:
            db.execute("INSERT INTO reflection_queue VALUES(?,?,?,?,?,?,?,?)",(f"reflection_{datetime.now().timestamp()}",session_id,user_text[:4000],assistant_text[:4000],"pending",None,datetime.now().isoformat(),None))

    def process_reflection_queue(self, max_items: int = 3) -> int:
        """Create low-risk memory proposals asynchronously; no direct LLM fact writes."""
        count=0
        with self._connect() as db:
            rows=db.execute("SELECT * FROM reflection_queue WHERE status='pending' ORDER BY created_at LIMIT ?",(max_items,)).fetchall()
            for row in rows:
                text=row["user_text"].strip()
                proposal={"kind":"memory_proposal","source":row["id"],"statement":"","risk":"low"}
                match=re.search(r"(?:我喜欢|我不喜欢|我的名字是|我叫)\s*([^，。！？!?]{1,80})",text)
                if match: proposal["statement"]=text[:240]
                db.execute("UPDATE reflection_queue SET status=?,proposal_json=?,processed_at=? WHERE id=?",("proposed",json.dumps(proposal,ensure_ascii=False),datetime.now().isoformat(),row["id"]))
                count+=1
        return count

    def read_note(self, note_id: str, offset: int = 1, limit: int = 200) -> dict:
        candidate = self.notes_dir / f"{Path(note_id).name}.md"
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

    def list_notes(self, query: str = "", limit: int = 20) -> list[dict]:
        needle = (query or "").lower()
        notes = []
        for path in sorted(self.notes_dir.glob("*.md"), reverse=True):
            text = path.read_text(encoding="utf-8", errors="replace")
            if needle and needle not in path.stem.lower() and needle not in text.lower():
                continue
            notes.append({"note_id": path.stem, "preview": text[:240], "bytes": path.stat().st_size})
            if len(notes) >= max(1, min(int(limit), 100)):
                break
        return notes

    # --- Local retrieval pipeline: BM25 + hashed vectors + RRF + rerank ---
    def _load_index(self) -> None:
        try:
            self._index = json.loads(self.index_path.read_text(encoding="utf-8"))
        except (FileNotFoundError, json.JSONDecodeError):
            self.rebuild_index()

    @staticmethod
    def _tokens(text: str) -> list[str]:
        ascii_words = re.findall(r"[a-zA-Z0-9_]+", text.lower())
        cjk = re.findall(r"[\u4e00-\u9fff]", text)
        cjk_bigrams = ["".join(cjk[i:i + 2]) for i in range(max(0, len(cjk) - 1))]
        return ascii_words + cjk + cjk_bigrams

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

    def rebuild_index(self) -> dict:
        documents = {}
        df: dict[str, int] = {}
        source = self.short_term.memories + self.long_term.memories
        for memory in source:
            tokens = self._tokens(f"{memory.content} {' '.join(memory.tags)}")
            tf: dict[str, int] = {}
            for token in tokens:
                tf[token] = tf.get(token, 0) + 1
            for token in tf:
                df[token] = df.get(token, 0) + 1
            documents[memory.id] = {"tokens": tf, "length": len(tokens) or 1, "vector": self._vector(memory.content), "tier": "short_term" if memory in self.short_term.memories else "long_term"}
        self._index = {"documents": documents, "avgdl": sum(doc["length"] for doc in documents.values()) / max(1, len(documents)), "df": df, "updated_at": datetime.now().isoformat()}
        self.index_path.write_text(json.dumps(self._index, ensure_ascii=False), encoding="utf-8")
        tantivy_detail = self._rebuild_tantivy_projection()
        with self._connect() as db:
            db.execute("INSERT INTO memory_projection_state(name,version,updated_at,detail_json) VALUES('bm25_tantivy',1,?,?) ON CONFLICT(name) DO UPDATE SET version=version+1,updated_at=excluded.updated_at,detail_json=excluded.detail_json", (self._index["updated_at"], json.dumps(tantivy_detail, ensure_ascii=False)))
            db.execute("INSERT INTO memory_projection_state(name,version,updated_at,detail_json) VALUES('vector_hash',1,?,?) ON CONFLICT(name) DO UPDATE SET version=version+1,updated_at=excluded.updated_at,detail_json=excluded.detail_json", (self._index["updated_at"], json.dumps({"dimensions":256,"documents":len(documents)}, ensure_ascii=False)))
        return {"documents": len(documents), "terms": len(df), "updated_at": self._index["updated_at"], "tantivy": tantivy_detail}

    def _rebuild_tantivy_projection(self) -> dict:
        if tantivy is None:
            return {"available": False, "reason": "tantivy package unavailable"}
        self.tantivy_dir.parent.mkdir(parents=True, exist_ok=True)
        # Keep one stable directory: Windows may retain Tantivy segment file
        # handles, so delete/recreate or directory swaps are not reliable.
        self.tantivy_dir.mkdir(parents=True, exist_ok=True)
        schema_builder = tantivy.SchemaBuilder()
        schema_builder.add_text_field("id", stored=True)
        schema_builder.add_text_field("content", stored=True)
        schema_builder.add_text_field("tags", stored=True)
        schema = schema_builder.build()
        index = tantivy.Index(schema, path=str(self.tantivy_dir))
        writer = index.writer()
        writer.delete_all_documents()
        with self._connect() as db:
            rows = db.execute("SELECT f.id,f.content,COALESCE(GROUP_CONCAT(t.tag,' '),'') tags FROM memory_facts f LEFT JOIN memory_tags t ON t.fact_id=f.id WHERE f.status='active' GROUP BY f.id").fetchall()
        for row in rows:
            writer.add_document(tantivy.Document(id=row["id"], content=row["content"], tags=row["tags"]))
        writer.commit(); writer.wait_merging_threads(); index.reload()
        return {"available": True, "documents": len(rows), "path": str(self.tantivy_dir)}

    def search(self, query: str, top_k: int = 5, rerank: bool = True) -> list[dict]:
        if not self._index.get("documents"):
            self.rebuild_index()
        docs = self._index.get("documents", {})
        qtokens = self._tokens(query)
        n = len(docs) or 1
        avgdl = self._index.get("avgdl", 1.0) or 1.0
        bm25: list[tuple[str, float]] = []
        qvector = self._vector(query)
        vector: list[tuple[str, float]] = []
        for memory_id, doc in docs.items():
            score = 0.0
            for token in qtokens:
                freq = doc["tokens"].get(token, 0)
                if not freq:
                    continue
                idf = math.log(1 + (n - self._index["df"].get(token, 0) + .5) / (self._index["df"].get(token, 0) + .5))
                score += idf * (freq * 2.0) / (freq + 1.2 * (1 - .75 + .75 * doc["length"] / avgdl))
            bm25.append((memory_id, score))
            vector.append((memory_id, self._cosine(qvector, doc["vector"])))
        # Tantivy is the lexical/BM25 projection when available. The local
        # scorer remains a recovery fallback if an index is rebuilding.
        tantivy_hits = self._tantivy_search(query, max(top_k * 8, 40))
        if tantivy_hits:
            bm25 = tantivy_hits
        else:
            bm25.sort(key=lambda item: item[1], reverse=True)
        vector.sort(key=lambda item: item[1], reverse=True)
        rrf: dict[str, float] = {}
        for rank, (memory_id, _) in enumerate(bm25, 1): rrf[memory_id] = rrf.get(memory_id, 0) + 1 / (60 + rank)
        for rank, (memory_id, _) in enumerate(vector, 1): rrf[memory_id] = rrf.get(memory_id, 0) + 1 / (60 + rank)
        lookup = {m.id: m for m in self.short_term.memories + self.long_term.memories}
        ranked = sorted(rrf.items(), key=lambda item: item[1], reverse=True)[:max(top_k * 5, 20)]
        if rerank:
            qset = set(qtokens)
            reranked = []
            for memory_id, score in ranked:
                memory = lookup.get(memory_id)
                if not memory: continue
                overlap = len(qset & set(self._tokens(memory.content)))
                tag_boost = sum(1 for tag in memory.tags if tag.lower() in query.lower())
                freshness = max(0.0, 1 - (datetime.now() - memory.last_recalled).total_seconds() / (86400 * 90))
                reranked.append((memory_id, score + overlap * .03 + tag_boost * .05 + memory.importance * .04 + freshness * .01))
            ranked = sorted(reranked, key=lambda item: item[1], reverse=True)
        result = []
        for memory_id, score in ranked[:top_k]:
            memory = lookup.get(memory_id)
            if not memory: continue
            memory.recall_count += 1
            memory.last_recalled = datetime.now()
            memory.strength = min(1.0, memory.strength + .03)
            result.append({"id": memory.id, "content": memory.content, "score": round(score, 5), "tier": self._index["documents"][memory_id]["tier"], "tags": memory.tags})
        self.short_term._save(); self.long_term._save()
        return result

    def _tantivy_search(self, query: str, limit: int) -> list[tuple[str, float]]:
        if tantivy is None or not self.tantivy_dir.exists() or not query.strip():
            return []
        try:
            schema_builder = tantivy.SchemaBuilder()
            schema_builder.add_text_field("id", stored=True)
            schema_builder.add_text_field("content", stored=True)
            schema_builder.add_text_field("tags", stored=True)
            index = tantivy.Index.open(str(self.tantivy_dir))
            index.reload()
            # CJK bi-grams are additionally handled by vector/token fallback;
            # Tantivy provides the durable lexical candidate ranking.
            parsed = index.parse_query(query, ["content", "tags"])
            searcher = index.searcher()
            hits = searcher.search(parsed, limit).hits
            out: list[tuple[str, float]] = []
            for score, address in hits:
                document = searcher.doc(address)
                raw = document.get_first("id")
                if raw is not None:
                    out.append((str(raw), float(score)))
            return out
        except Exception:
            return []

    def daily_backup(self) -> str:
        today = datetime.now().strftime("%Y%m%d")
        target = self.backup_dir / f"memory-{today}.json"
        if not target.exists():
            payload = {"created_at": datetime.now().isoformat(), "short_term": [m.to_dict() for m in self.short_term.memories], "long_term": [m.to_dict() for m in self.long_term.memories], "index": self._index}
            target.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
        for stale in sorted(self.backup_dir.glob("memory-*.json"))[:-7]: stale.unlink(missing_ok=True)
        return str(target)

    def maintenance(self) -> dict:
        consolidated_before = len(self.long_term.memories)
        self.consolidate()
        index = self.rebuild_index()
        return {"consolidated": len(self.long_term.memories) - consolidated_before, "index": index, "backup": self.daily_backup()}
