"""LIFE companion domains backed by a SQLite source of truth.

This is deliberately organized around durable domain records rather than a
single JSON blob: relationship accounts/ledgers, calendar candidates/events,
proactive candidates/receipts, group scene observations, journals, and audit.
"""
from __future__ import annotations

from contextlib import contextmanager
from datetime import date, datetime, timedelta
import json
from pathlib import Path
import sqlite3
from typing import Any
from uuid import uuid4


def now() -> str: return datetime.now().isoformat()
def new_id(prefix: str) -> str: return f"{prefix}_{uuid4().hex}"


class CompanionSystem:
    def __init__(self, data_dir: str):
        root = Path(data_dir) / "companion"
        root.mkdir(parents=True, exist_ok=True)
        self.path = root / "companion.db"
        self._init()

    @contextmanager
    def db(self):
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row
        try:
            conn.execute("PRAGMA journal_mode=WAL")
            yield conn
            conn.commit()
        finally: conn.close()

    def _init(self) -> None:
        with self.db() as db:
            db.executescript("""
            CREATE TABLE IF NOT EXISTS relationship_accounts (user_id TEXT PRIMARY KEY, affinity REAL NOT NULL DEFAULT 0, stage TEXT NOT NULL DEFAULT '陌生', interaction TEXT NOT NULL DEFAULT '放松', notes TEXT NOT NULL DEFAULT '', last_seen TEXT NOT NULL DEFAULT '', revision INTEGER NOT NULL DEFAULT 0);
            CREATE TABLE IF NOT EXISTS relationship_ledger (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, event_key TEXT NOT NULL, delta REAL NOT NULL, reason TEXT NOT NULL, channel TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE(user_id,event_key));
            CREATE TABLE IF NOT EXISTS calendar_candidates (id TEXT PRIMARY KEY, title TEXT NOT NULL, when_text TEXT, detail TEXT, kind TEXT NOT NULL, status TEXT NOT NULL, source_event_id TEXT, created_at TEXT NOT NULL, expires_at TEXT, revision INTEGER NOT NULL DEFAULT 1);
            CREATE TABLE IF NOT EXISTS calendar_events (id TEXT PRIMARY KEY, candidate_id TEXT, title TEXT NOT NULL, start_at TEXT, detail TEXT, kind TEXT NOT NULL, status TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS calendar_rules (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, rule_json TEXT NOT NULL, active INTEGER NOT NULL DEFAULT 1, created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS calendar_exceptions (id TEXT PRIMARY KEY, event_id TEXT NOT NULL, exception_json TEXT NOT NULL, created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS activity_observations (id TEXT PRIMARY KEY, scope_id TEXT, activity_kind TEXT, evidence TEXT, reality_mode TEXT NOT NULL, observed_at TEXT NOT NULL, expires_at TEXT);
            CREATE TABLE IF NOT EXISTS reconciliation_history (id TEXT PRIMARY KEY, subject TEXT NOT NULL, before_json TEXT, after_json TEXT, reason TEXT, created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS proactive_candidates (id TEXT PRIMARY KEY, target TEXT NOT NULL, motive TEXT NOT NULL, content TEXT NOT NULL, status TEXT NOT NULL, signature TEXT NOT NULL, window_start TEXT, preferred_at TEXT, best_until TEXT, expires_at TEXT, cooldown_key TEXT, decision_json TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(target,signature));
            CREATE TABLE IF NOT EXISTS proactive_receipts (id TEXT PRIMARY KEY, candidate_id TEXT NOT NULL, phase TEXT NOT NULL, outcome TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS group_scenes (group_id TEXT PRIMARY KEY, wake_policy TEXT NOT NULL DEFAULT 'keyword_or_mention', mood REAL NOT NULL DEFAULT 0, updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS group_observations (id TEXT PRIMARY KEY, group_id TEXT NOT NULL, user_id TEXT NOT NULL, kind TEXT NOT NULL, content TEXT, audience TEXT NOT NULL DEFAULT 'group', created_at TEXT NOT NULL, expires_at TEXT);
            CREATE TABLE IF NOT EXISTS group_topics (group_id TEXT NOT NULL, topic TEXT NOT NULL, score REAL NOT NULL DEFAULT 0, updated_at TEXT NOT NULL, PRIMARY KEY(group_id,topic));
            CREATE TABLE IF NOT EXISTS journal_entries (id TEXT PRIMARY KEY, kind TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS audit_events (id TEXT PRIMARY KEY, trace_id TEXT, kind TEXT NOT NULL, target TEXT, outcome TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS persona_evolution (id TEXT PRIMARY KEY, trait TEXT NOT NULL, value TEXT NOT NULL, evidence TEXT NOT NULL, support_count INTEGER NOT NULL DEFAULT 1, confidence REAL NOT NULL DEFAULT 0.35, status TEXT NOT NULL DEFAULT 'proposed', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(trait,value));
            """)
            for key, value in {"proactive_daily_limit":"3", "proactive_target_limit":"1", "quiet_start":"23", "quiet_end":"8"}.items():
                db.execute("INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)", (key,value))

    def audit(self, kind: str, detail: str, target: str = "", outcome: str = "ok", trace_id: str = "") -> None:
        with self.db() as db: db.execute("INSERT INTO audit_events VALUES(?,?,?,?,?,?,?)", (new_id("audit"), trace_id, kind, target, outcome, detail[:4000], now()))

    def _audit_tx(self, db, kind: str, detail: str, target: str = "", outcome: str = "ok") -> None:
        db.execute("INSERT INTO audit_events VALUES(?,?,?,?,?,?,?)", (new_id("audit"), "", kind, target, outcome, detail[:4000], now()))

    def _setting(self, db, key: str, default: str) -> str:
        row = db.execute("SELECT value FROM settings WHERE key=?", (key,)).fetchone()
        return row[0] if row else default

    # Relationship domain -------------------------------------------------
    def relationship(self, user_id: str) -> dict[str, Any]:
        with self.db() as db:
            db.execute("INSERT OR IGNORE INTO relationship_accounts(user_id) VALUES(?)", (user_id,))
            return dict(db.execute("SELECT * FROM relationship_accounts WHERE user_id=?", (user_id,)).fetchone())

    def apply_relationship_event(self, user_id: str, event_key: str, reason: str, channel: str, delta: float) -> dict[str,Any]:
        # Policy: dedup by event, bounded deltas, daily cap, stage hysteresis.
        with self.db() as db:
            db.execute("INSERT OR IGNORE INTO relationship_accounts(user_id) VALUES(?)", (user_id,))
            if db.execute("SELECT 1 FROM relationship_ledger WHERE user_id=? AND event_key=?", (user_id,event_key)).fetchone():
                return dict(db.execute("SELECT * FROM relationship_accounts WHERE user_id=?", (user_id,)).fetchone())
            day = date.today().isoformat()
            used = db.execute("SELECT COALESCE(SUM(ABS(delta)),0) FROM relationship_ledger WHERE user_id=? AND created_at LIKE ?", (user_id, f"{day}%")).fetchone()[0]
            delta = max(-0.12, min(0.12, delta)) if used < .30 else 0.0
            account = dict(db.execute("SELECT * FROM relationship_accounts WHERE user_id=?", (user_id,)).fetchone())
            score = max(-1.0,min(1.0,float(account["affinity"])+delta))
            old = account["stage"]
            stage = "亲近" if score >= .55 else "温暖" if score >= .20 else "受伤" if score <= -.50 else "疏离" if score <= -.20 else "熟悉"
            # Hysteresis avoids stage flicker around thresholds.
            if old == "亲近" and score >= .45: stage = old
            if old == "温暖" and .12 <= score < .55: stage = old
            db.execute("UPDATE relationship_accounts SET affinity=?, stage=?, last_seen=?, revision=revision+1 WHERE user_id=?", (score,stage,now(),user_id))
            db.execute("INSERT INTO relationship_ledger VALUES(?,?,?,?,?,?,?)", (new_id("rel"),user_id,event_key,delta,reason,channel,now()))
            return dict(db.execute("SELECT * FROM relationship_accounts WHERE user_id=?", (user_id,)).fetchone())

    def observe_user(self, user_id: str, message: str, is_group: bool = False) -> dict[str,Any]:
        lower = message.lower()
        delta = .03 if any(x in lower for x in ("谢谢","喜欢","好棒","thanks","love")) else -.04 if any(x in lower for x in ("讨厌","滚","hate","stupid")) else .003
        return self.apply_relationship_event(user_id, f"message:{hash((user_id,message,datetime.now().strftime('%Y%m%d%H%M')))}", "message_sentiment", "group" if is_group else "private", delta)

    # Calendar / continuity domain ---------------------------------------
    def add_agenda(self, title: str, when: str = "", detail: str = "", kind: str = "persona_soft_activity") -> dict[str,Any]:
        candidate = {"id":new_id("cal_candidate"),"title":title[:160],"when":when,"detail":detail[:2000],"kind":kind,"status":"pending_confirmation","created_at":now()}
        with self.db() as db:
            db.execute("INSERT INTO calendar_candidates VALUES(?,?,?,?,?,?,?,?,?,?)", (candidate["id"],candidate["title"],when,detail,kind,candidate["status"],None,candidate["created_at"],(datetime.now()+timedelta(days=7)).isoformat(),1))
        self.audit("calendar_candidate", title, candidate["id"])
        return candidate

    def confirm_agenda(self, candidate_id: str, accept: bool) -> dict[str,Any]:
        with self.db() as db:
            row = db.execute("SELECT * FROM calendar_candidates WHERE id=?", (candidate_id,)).fetchone()
            if not row: return {"updated":False}
            status = "confirmed" if accept else "rejected"
            db.execute("UPDATE calendar_candidates SET status=?, revision=revision+1 WHERE id=?", (status,candidate_id))
            if accept:
                event_id = new_id("calendar")
                db.execute("INSERT INTO calendar_events VALUES(?,?,?,?,?,?,?,?,?,?)", (event_id,candidate_id,row["title"],row["when_text"],row["detail"],row["kind"],"active",1,now(),now()))
                self._audit_tx(db, "calendar_confirm", row["title"], event_id)
                return {"updated":True,"event_id":event_id,"status":status}
            self._audit_tx(db, "calendar_reject", row["title"], candidate_id)
            return {"updated":True,"status":status}

    # Proactive domain ----------------------------------------------------
    def create_proactive_candidate(self, target: str, motive: str, content: str, preferred_at: str = "") -> dict[str,Any]:
        signature = f"{motive}:{content.strip().lower()[:160]}"
        candidate = {"id":new_id("proactive"),"target":target,"motive":motive,"content":content[:2000],"status":"candidate","signature":signature,"created_at":now()}
        with self.db() as db:
            existing = db.execute("SELECT * FROM proactive_candidates WHERE target=? AND signature=?", (target,signature)).fetchone()
            if existing: return dict(existing)
            start = datetime.now(); best = datetime.fromisoformat(preferred_at) if preferred_at else start
            db.execute("INSERT INTO proactive_candidates VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", (candidate["id"],target,motive,candidate["content"],"candidate",signature,start.isoformat(),best.isoformat(),(best+timedelta(hours=2)).isoformat(),(best+timedelta(days=1)).isoformat(),target,"{}",candidate["created_at"],candidate["created_at"]))
        self.audit("proactive_candidate", motive, candidate["id"])
        return candidate

    def can_proactively_send(self, target: str) -> tuple[bool,str]:
        with self.db() as db:
            daily = int(self._setting(db,"proactive_daily_limit","3")); per_target = int(self._setting(db,"proactive_target_limit","1"))
            today = date.today().isoformat()
            sent = db.execute("SELECT COUNT(*) FROM proactive_receipts WHERE phase='delivered' AND created_at LIKE ?", (f"{today}%",)).fetchone()[0]
            per = db.execute("SELECT COUNT(*) FROM proactive_receipts r JOIN proactive_candidates c ON c.id=r.candidate_id WHERE r.phase='delivered' AND c.target=? AND r.created_at LIKE ?", (target,f"{today}%")).fetchone()[0]
            hour = datetime.now().hour
            if sent >= daily: return False,"daily quota exhausted"
            if per >= per_target: return False,"target quota exhausted"
            if hour >= int(self._setting(db,"quiet_start","23")) or hour < int(self._setting(db,"quiet_end","8")): return False,"quiet hours"
            return True,"ok"

    def record_proactive_send(self, target: str, content: str) -> None:
        candidate = self.create_proactive_candidate(target,"manual_tool",content)
        with self.db() as db:
            db.execute("UPDATE proactive_candidates SET status='delivered',updated_at=? WHERE id=?",(now(),candidate["id"]))
            db.execute("INSERT INTO proactive_receipts VALUES(?,?,?,?,?,?)",(new_id("receipt"),candidate["id"],"delivered","ok",content[:1000],now()))
        self.audit("proactive_delivery",content,target)

    def set_runtime_policy(self, daily_limit: int, per_target_limit: int) -> None:
        with self.db() as db:
            db.execute("INSERT INTO settings(key,value) VALUES('proactive_daily_limit',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (str(max(0,daily_limit)),))
            db.execute("INSERT INTO settings(key,value) VALUES('proactive_target_limit',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (str(max(0,per_target_limit)),))

    def cancel_proactive(self, candidate_id: str, reason: str = "dashboard_cancel") -> dict[str,Any]:
        with self.db() as db:
            row = db.execute("SELECT * FROM proactive_candidates WHERE id=?", (candidate_id,)).fetchone()
            if not row:
                return {"cancelled": False, "id": candidate_id, "reason": "not_found"}
            if row["status"] == "delivered":
                return {"cancelled": False, "id": candidate_id, "reason": "already_delivered"}
            db.execute("UPDATE proactive_candidates SET status='cancelled', updated_at=? WHERE id=?", (now(), candidate_id))
            self._audit_tx(db, "proactive_cancel", reason, candidate_id)
        return {"cancelled": True, "id": candidate_id}

    def mark_proactive_delivered(self, candidate_id: str, content: str, outcome: str = "ok") -> dict[str,Any]:
        with self.db() as db:
            db.execute("UPDATE proactive_candidates SET status='delivered', updated_at=? WHERE id=?", (now(), candidate_id))
            db.execute("INSERT INTO proactive_receipts VALUES(?,?,?,?,?,?)", (new_id("receipt"), candidate_id, "delivered", outcome, content[:1000], now()))
        self.audit("proactive_delivery", content[:200], candidate_id)
        return {"delivered": True, "id": candidate_id}

    def complete_agenda(self, event_id: str) -> dict[str,Any]:
        with self.db() as db:
            row = db.execute("SELECT * FROM calendar_events WHERE id=?", (event_id,)).fetchone()
            if not row: return {"updated":False}
            before = json.dumps(dict(row), ensure_ascii=False)
            db.execute("UPDATE calendar_events SET status='completed', version=version+1, updated_at=? WHERE id=?", (now(),event_id))
            after = dict(db.execute("SELECT * FROM calendar_events WHERE id=?", (event_id,)).fetchone())
            db.execute("INSERT INTO reconciliation_history VALUES(?,?,?,?,?,?)", (new_id("reconcile"),event_id,before,json.dumps(after,ensure_ascii=False),"completed",now()))
            self._audit_tx(db, "calendar_complete",after["title"],event_id)
            return {"updated":True,"item":after}

    # Group scene domain --------------------------------------------------
    def observe_group(self, group_id: str, user_id: str, message: str) -> None:
        with self.db() as db:
            db.execute("INSERT OR IGNORE INTO group_scenes(group_id,updated_at) VALUES(?,?)",(group_id,now()))
            db.execute("INSERT INTO group_observations VALUES(?,?,?,?,?,?,?,?)",(new_id("group_obs"),group_id,user_id,"message",message[:800],"group",now(),(datetime.now()+timedelta(days=14)).isoformat()))
            for token in {part.strip("，。！？,.!? ").lower() for part in message.split() if len(part.strip()) >= 2}:
                db.execute("INSERT INTO group_topics(group_id,topic,score,updated_at) VALUES(?,?,1,?) ON CONFLICT(group_id,topic) DO UPDATE SET score=score+1,updated_at=excluded.updated_at",(group_id,token,now()))

    def group_should_wake(self, group_id: str, message: str, mentioned: bool = False, keywords: tuple[str,...] = ()) -> bool:
        if mentioned: return True
        return any(word.lower() in message.lower() for word in keywords if word)

    def journal(self, content: str, kind: str = "journal") -> dict[str,Any]:
        entry = {"id":new_id(kind),"at":now(),"content":content[:4000]}
        with self.db() as db: db.execute("INSERT INTO journal_entries VALUES(?,?,?,?)",(entry["id"],kind,entry["content"],entry["at"]))
        self.audit(kind,entry["content"],entry["id"])
        return entry

    def snapshot(self) -> dict[str,Any]:
        with self.db() as db:
            rows=lambda q,args=():[dict(row) for row in db.execute(q,args).fetchall()]
            groups={row["group_id"]:{"mood":row["mood"],"topics":rows("SELECT topic,score FROM group_topics WHERE group_id=? ORDER BY score DESC LIMIT 12",(row["group_id"],)),"messages":rows("SELECT user_id,content,created_at FROM group_observations WHERE group_id=? ORDER BY created_at DESC LIMIT 20",(row["group_id"],))} for row in db.execute("SELECT * FROM group_scenes").fetchall()}
            return {"relationships":rows("SELECT * FROM relationship_accounts ORDER BY last_seen DESC"),"relationship_ledger":rows("SELECT * FROM relationship_ledger ORDER BY created_at DESC LIMIT 200"),"agenda":rows("SELECT * FROM calendar_events ORDER BY updated_at DESC"),"calendar_candidates":rows("SELECT * FROM calendar_candidates ORDER BY created_at DESC"),"journal":rows("SELECT * FROM journal_entries WHERE kind='journal' ORDER BY created_at DESC LIMIT 50"),"dreams":rows("SELECT * FROM journal_entries WHERE kind='dream' ORDER BY created_at DESC LIMIT 50"),"audit":rows("SELECT * FROM audit_events ORDER BY created_at DESC LIMIT 200"),"groups":groups,"persona_evolution":rows("SELECT * FROM persona_evolution WHERE status='confirmed' ORDER BY updated_at DESC"),"proactive":{"candidates":rows("SELECT * FROM proactive_candidates ORDER BY updated_at DESC LIMIT 100"),"receipts":rows("SELECT * FROM proactive_receipts ORDER BY created_at DESC LIMIT 100")}}

    def propose_persona_evolution(self, trait: str, value: str, evidence: str) -> dict[str,Any]:
        trait, value, evidence = trait.strip()[:80], value.strip()[:240], evidence.strip()[:1000]
        if not trait or not value: return {"status":"ignored"}
        with self.db() as db:
            row = db.execute("SELECT * FROM persona_evolution WHERE trait=? AND value=?",(trait,value)).fetchone()
            if row:
                support = row["support_count"] + 1
                confidence = min(.98, row["confidence"] + .1)
                status = "confirmed" if support >= 3 and confidence >= .7 else row["status"]
                db.execute("UPDATE persona_evolution SET evidence=?,support_count=?,confidence=?,status=?,updated_at=? WHERE id=?",(evidence,support,confidence,status,now(),row["id"]))
            else:
                db.execute("INSERT INTO persona_evolution VALUES(?,?,?,?,?,?,?,?,?)",(new_id("persona"),trait,value,evidence,1,.35,"proposed",now(),now()))
            result = dict(db.execute("SELECT * FROM persona_evolution WHERE trait=? AND value=?",(trait,value)).fetchone())
        self.audit("persona_evolution",f"{trait}={value}",result["id"],result["status"])
        return result

    def persona_evolution_context(self) -> str:
        with self.db() as db:
            rows = db.execute("SELECT trait,value FROM persona_evolution WHERE status='confirmed' ORDER BY confidence DESC LIMIT 12").fetchall()
        return "\n".join(f"- {row['trait']}: {row['value']}" for row in rows)
