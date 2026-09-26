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
            CREATE TABLE IF NOT EXISTS important_dates (id TEXT PRIMARY KEY, title TEXT NOT NULL, date_text TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'date', repeat_yearly INTEGER NOT NULL DEFAULT 1, note TEXT DEFAULT '', created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS personal_goals (id TEXT PRIMARY KEY, title TEXT NOT NULL, detail TEXT DEFAULT '', kind TEXT NOT NULL DEFAULT 'growth', status TEXT NOT NULL DEFAULT 'active', progress REAL NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS food_menu (id TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'meal', tags TEXT NOT NULL DEFAULT '', note TEXT DEFAULT '', created_at TEXT NOT NULL);
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

    # Per-stage daily outreach caps for private targets (min with the configured limit).
    STAGE_TARGET_LIMITS = {"亲近": 3, "温暖": 2, "熟悉": 1, "疏离": 1, "受伤": 0}

    def can_proactively_send(self, target: str) -> tuple[bool,str]:
        with self.db() as db:
            daily = int(self._setting(db,"proactive_daily_limit","3")); per_target = int(self._setting(db,"proactive_target_limit","1"))
            if target.startswith("user:"):
                row = db.execute("SELECT stage FROM relationship_accounts WHERE user_id=?", (target.split(":",1)[1],)).fetchone()
                stage = (row["stage"] if row else "") or ""
                if stage == "受伤":
                    return False, "relationship wounded"
                cap = self.STAGE_TARGET_LIMITS.get(stage)
                if cap is not None:
                    per_target = min(per_target, cap) if per_target > 0 else cap
            today = date.today().isoformat()
            sent = db.execute("SELECT COUNT(*) FROM proactive_receipts WHERE phase='delivered' AND created_at LIKE ?", (f"{today}%",)).fetchone()[0]
            per = db.execute("SELECT COUNT(*) FROM proactive_receipts r JOIN proactive_candidates c ON c.id=r.candidate_id WHERE r.phase='delivered' AND c.target=? AND r.created_at LIKE ?", (target,f"{today}%")).fetchone()[0]
            hour = datetime.now().hour
            if sent >= daily: return False,"daily quota exhausted"
            if per >= per_target: return False,"target quota exhausted"
            quiet_start = int(self._setting(db,"quiet_start","23")); quiet_end = int(self._setting(db,"quiet_end","8"))
            if quiet_start != quiet_end and (hour >= quiet_start or hour < quiet_end): return False,"quiet hours"
            return True,"ok"

    def record_proactive_send(self, target: str, content: str) -> None:
        candidate = self.create_proactive_candidate(target,"manual_tool",content)
        with self.db() as db:
            db.execute("UPDATE proactive_candidates SET status='delivered',updated_at=? WHERE id=?",(now(),candidate["id"]))
            db.execute("INSERT INTO proactive_receipts VALUES(?,?,?,?,?,?)",(new_id("receipt"),candidate["id"],"delivered","ok",content[:1000],now()))
        self.audit("proactive_delivery",content,target)

    def set_runtime_policy(self, daily_limit: int, per_target_limit: int, quiet_start: int | None = None, quiet_end: int | None = None) -> None:
        with self.db() as db:
            db.execute("INSERT INTO settings(key,value) VALUES('proactive_daily_limit',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (str(max(0,daily_limit)),))
            db.execute("INSERT INTO settings(key,value) VALUES('proactive_target_limit',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (str(max(0,per_target_limit)),))
            if quiet_start is not None:
                db.execute("INSERT INTO settings(key,value) VALUES('quiet_start',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (str(max(0, min(23, int(quiet_start)))),))
            if quiet_end is not None:
                db.execute("INSERT INTO settings(key,value) VALUES('quiet_end',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (str(max(0, min(23, int(quiet_end)))),))

    def get_policy(self) -> dict:
        with self.db() as db:
            return {
                "daily_limit": int(self._setting(db, "proactive_daily_limit", "3")),
                "per_target_limit": int(self._setting(db, "proactive_target_limit", "1")),
                "quiet_start": int(self._setting(db, "quiet_start", "23")),
                "quiet_end": int(self._setting(db, "quiet_end", "8")),
            }

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

    # Important dates (life continuity) ----------------------------------
    def add_important_date(self, title: str, date_text: str, repeat_yearly: bool = True, note: str = "") -> dict[str,Any]:
        title = (title or "").strip()[:120]
        date_text = (date_text or "").strip()[:32]
        if not title or not date_text:
            return {"status": "ignored"}
        item = {"id": new_id("date"), "title": title, "date_text": date_text, "kind": "date",
                "repeat_yearly": 1 if repeat_yearly else 0, "note": (note or "")[:500], "created_at": now()}
        with self.db() as db:
            db.execute("INSERT INTO important_dates VALUES(?,?,?,?,?,?,?)",
                       (item["id"], item["title"], item["date_text"], item["kind"], item["repeat_yearly"], item["note"], item["created_at"]))
            self._audit_tx(db, "important_date_add", title, item["id"])
        return item

    def list_important_dates(self) -> list[dict[str,Any]]:
        with self.db() as db:
            return [dict(row) for row in db.execute("SELECT * FROM important_dates ORDER BY date_text").fetchall()]

    def delete_important_date(self, date_id: str) -> bool:
        with self.db() as db:
            row = db.execute("SELECT 1 FROM important_dates WHERE id=?", (date_id,)).fetchone()
            if not row:
                return False
            db.execute("DELETE FROM important_dates WHERE id=?", (date_id,))
        return True

    def upcoming_important_dates(self, days: int = 7) -> list[dict[str,Any]]:
        today = date.today()
        out: list[dict[str,Any]] = []
        for row in self.list_important_dates():
            raw = str(row.get("date_text") or "")
            target = None
            try:
                if len(raw) == 10:
                    target = date.fromisoformat(raw)
                    if row.get("repeat_yearly"):
                        target = target.replace(year=today.year)
                        if target < today:
                            target = target.replace(year=today.year + 1)
                elif len(raw) == 5 and raw[2] == "-":
                    target = date(today.year, int(raw[:2]), int(raw[3:]))
                    if target < today:
                        target = target.replace(year=today.year + 1)
            except ValueError:
                continue
            if target is None:
                continue
            delta = (target - today).days
            if 0 <= delta <= max(0, int(days)):
                item = dict(row)
                item["days_until"] = delta
                item["occurs_on"] = target.isoformat()
                out.append(item)
        out.sort(key=lambda item: item["days_until"])
        return out

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

    def advance_agenda(self, now_dt: datetime | None = None) -> dict[str,Any]:
        """LIFE's own reading of its day: activities whose time has passed count as done.

        Mirrors private_companion's reconciliation idea - a soft activity does not
        need a human to tick it off; once its start time is behind us LIFE treats
        it as something it has lived through.
        """
        current = now_dt or datetime.now()
        completed = 0
        with self.db() as db:
            rows = db.execute("SELECT id, title, start_at FROM calendar_events WHERE status='active'").fetchall()
            for row in rows:
                start = str(row["start_at"] or "").strip()
                if not start:
                    continue
                try:
                    start_dt = datetime.fromisoformat(start.replace(" ", "T"))
                except ValueError:
                    continue
                if start_dt.tzinfo is not None:
                    start_dt = start_dt.replace(tzinfo=None)
                if start_dt <= current:
                    db.execute("UPDATE calendar_events SET status='completed', version=version+1, updated_at=? WHERE id=?", (now(), row["id"]))
                    completed += 1
            if completed:
                self._audit_tx(db, "agenda_advance", f"completed={completed}", "", "ok")
        return {"completed": completed}

    def calendar_month(self, month: str = "") -> dict[str,Any]:
        """Events and pending candidates for a YYYY-MM month, with simple conflict detection."""
        try:
            anchor = datetime.strptime(month, "%Y-%m") if month else datetime.now()
        except ValueError:
            raise ValueError("month must be formatted as YYYY-MM")
        start = anchor.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end = start.replace(year=start.year + 1, month=1) if start.month == 12 else start.replace(month=start.month + 1)
        lo, hi = start.date().isoformat(), end.date().isoformat()
        with self.db() as db:
            events = [dict(r) for r in db.execute(
                "SELECT * FROM calendar_events WHERE start_at<>'' AND substr(replace(start_at,'T',' '),1,10)>=? AND substr(replace(start_at,'T',' '),1,10)<? ORDER BY start_at",
                (lo, hi)).fetchall()]
            candidates = [dict(r) for r in db.execute("SELECT * FROM calendar_candidates WHERE status='pending_confirmation' ORDER BY created_at DESC").fetchall()]
        buckets: dict[str, list] = {}
        for event in events:
            key = str(event.get("start_at") or "").replace("T", " ").strip()
            if key:
                buckets.setdefault(key, []).append(event)
        conflicts = [{"start_at": key, "titles": [e["title"] for e in items], "ids": [e["id"] for e in items]}
                     for key, items in buckets.items() if len(items) > 1]
        return {"month": f"{start.year:04d}-{start.month:02d}", "start": lo, "end": hi, "events": events, "candidates": candidates, "conflicts": conflicts}

    # Goals / food / word cloud (life workspace) --------------------------
    def add_goal(self, title: str, detail: str = "", kind: str = "growth") -> dict[str,Any]:
        title = (title or "").strip()[:160]
        if not title:
            raise ValueError("goal title is required")
        item = {"id": new_id("goal"), "title": title, "detail": (detail or "")[:1000], "kind": (kind or "growth")[:40], "status": "active", "progress": 0.0, "created_at": now(), "updated_at": now()}
        with self.db() as db:
            db.execute("INSERT INTO personal_goals VALUES(?,?,?,?,?,?,?,?)", (item["id"], item["title"], item["detail"], item["kind"], item["status"], item["progress"], item["created_at"], item["updated_at"]))
            self._audit_tx(db, "goal_add", title, item["id"])
        return item

    def update_goal(self, goal_id: str, progress: float | None = None, status: str = "", detail: str | None = None) -> dict[str,Any]:
        with self.db() as db:
            row = db.execute("SELECT * FROM personal_goals WHERE id=?", (goal_id,)).fetchone()
            if not row:
                return {"updated": False}
            final_status = (status or row["status"])[:40]
            final_detail = row["detail"] if detail is None else detail[:1000]
            final_progress = row["progress"] if progress is None else max(0.0, min(1.0, float(progress)))
            db.execute("UPDATE personal_goals SET status=?, detail=?, progress=?, updated_at=? WHERE id=?", (final_status, final_detail, final_progress, now(), goal_id))
            after = dict(db.execute("SELECT * FROM personal_goals WHERE id=?", (goal_id,)).fetchone())
            self._audit_tx(db, "goal_update", after["title"], goal_id)
        return {"updated": True, "goal": after}

    def delete_goal(self, goal_id: str) -> dict[str,Any]:
        with self.db() as db:
            cursor = db.execute("DELETE FROM personal_goals WHERE id=?", (goal_id,))
            self._audit_tx(db, "goal_delete", goal_id, goal_id, "ok" if cursor.rowcount else "not_found")
            return {"deleted": bool(cursor.rowcount), "id": goal_id}

    def list_goals(self, status: str = "") -> list[dict[str,Any]]:
        with self.db() as db:
            if status:
                return [dict(r) for r in db.execute("SELECT * FROM personal_goals WHERE status=? ORDER BY updated_at DESC", (status,)).fetchall()]
            return [dict(r) for r in db.execute("SELECT * FROM personal_goals ORDER BY updated_at DESC").fetchall()]

    def add_food(self, name: str, kind: str = "meal", tags: str = "", note: str = "") -> dict[str,Any]:
        name = (name or "").strip()[:80]
        if not name:
            raise ValueError("food name is required")
        item = {"id": new_id("food"), "name": name, "kind": (kind or "meal")[:40], "tags": (tags or "")[:200], "note": (note or "")[:400], "created_at": now()}
        with self.db() as db:
            db.execute("INSERT INTO food_menu VALUES(?,?,?,?,?,?)", (item["id"], item["name"], item["kind"], item["tags"], item["note"], item["created_at"]))
        return item

    def delete_food(self, food_id: str) -> dict[str,Any]:
        with self.db() as db:
            cursor = db.execute("DELETE FROM food_menu WHERE id=?", (food_id,))
            return {"deleted": bool(cursor.rowcount), "id": food_id}

    def list_food(self) -> list[dict[str,Any]]:
        with self.db() as db:
            return [dict(r) for r in db.execute("SELECT * FROM food_menu ORDER BY created_at DESC").fetchall()]

    def word_cloud(self, limit: int = 60) -> list[dict[str,Any]]:
        with self.db() as db:
            return [dict(r) for r in db.execute("SELECT topic, SUM(score) AS score FROM group_topics GROUP BY topic ORDER BY score DESC LIMIT ?", (max(1, min(int(limit), 200)),)).fetchall()]

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

    def journal_page(self, day: str = "") -> dict[str,Any]:
        """Read a day as one diary page, including entries outside snapshot limits."""
        day = date.fromisoformat(day).isoformat() if day else date.today().isoformat()
        with self.db() as db:
            entries = db.execute(
                "SELECT content FROM journal_entries WHERE kind='journal' AND substr(created_at,1,10)=? ORDER BY created_at, id", (day,)
            ).fetchall()
            previous = db.execute(
                "SELECT MAX(substr(created_at,1,10)) FROM journal_entries WHERE kind='journal' AND substr(created_at,1,10)<?", (day,)
            ).fetchone()[0]
            following = db.execute(
                "SELECT MIN(substr(created_at,1,10)) FROM journal_entries WHERE kind='journal' AND substr(created_at,1,10)>?", (day,)
            ).fetchone()[0]
        return {"date": day, "content": "\n\n".join(row["content"] for row in entries), "previous": previous, "next": following}

    def journal(self, content: str, kind: str = "journal") -> dict[str,Any]:
        entry = {"id":new_id(kind),"at":now(),"content":content[:4000]}
        with self.db() as db: db.execute("INSERT INTO journal_entries VALUES(?,?,?,?)",(entry["id"],kind,entry["content"],entry["at"]))
        self.audit(kind,entry["content"],entry["id"])
        return entry

    def clear_journal(self, kind: str = "") -> dict[str,Any]:
        """Remove journal/dream entries (kind filter optional)."""
        with self.db() as db:
            if kind in ("journal", "dream"):
                cursor = db.execute("DELETE FROM journal_entries WHERE kind=?", (kind,))
            else:
                cursor = db.execute("DELETE FROM journal_entries WHERE kind IN ('journal','dream')")
            count = cursor.rowcount
            self._audit_tx(db, "journal_clear", f"kind={kind or 'all'} removed={count}", "")
        return {"cleared": count, "kind": kind or "all"}

    def snapshot(self) -> dict[str,Any]:
        today = date.today().isoformat()
        with self.db() as db:
            rows=lambda q,args=():[dict(row) for row in db.execute(q,args).fetchall()]
            groups={row["group_id"]:{"mood":row["mood"],"topics":rows("SELECT topic,score FROM group_topics WHERE group_id=? ORDER BY score DESC LIMIT 12",(row["group_id"],)),"messages":rows("SELECT user_id,content,created_at FROM group_observations WHERE group_id=? ORDER BY created_at DESC LIMIT 20",(row["group_id"],))} for row in db.execute("SELECT * FROM group_scenes").fetchall()}
            # Only today and upcoming events: yesterday's schedule is not shown or reused.
            agenda=rows("SELECT * FROM calendar_events WHERE start_at='' OR substr(replace(start_at,'T',' '),1,10)>=? ORDER BY start_at='' DESC, start_at ASC",(today,))
            return {"relationships":rows("SELECT * FROM relationship_accounts ORDER BY last_seen DESC"),"relationship_ledger":rows("SELECT * FROM relationship_ledger ORDER BY created_at DESC LIMIT 200"),"agenda":agenda,"calendar_candidates":rows("SELECT * FROM calendar_candidates ORDER BY created_at DESC"),"journal":rows("SELECT * FROM journal_entries WHERE kind='journal' ORDER BY created_at DESC LIMIT 50"),"dreams":rows("SELECT * FROM journal_entries WHERE kind='dream' ORDER BY created_at DESC LIMIT 50"),"audit":rows("SELECT * FROM audit_events ORDER BY created_at DESC LIMIT 200"),"groups":groups,"persona_evolution":rows("SELECT * FROM persona_evolution WHERE status='confirmed' ORDER BY updated_at DESC"),"proactive":{"candidates":rows("SELECT * FROM proactive_candidates ORDER BY updated_at DESC LIMIT 100"),"receipts":rows("SELECT * FROM proactive_receipts ORDER BY created_at DESC LIMIT 100")},"important_dates":rows("SELECT * FROM important_dates ORDER BY date_text"),"goals":rows("SELECT * FROM personal_goals ORDER BY updated_at DESC"),"food":rows("SELECT * FROM food_menu ORDER BY created_at DESC"),"word_cloud":rows("SELECT topic, SUM(score) AS score FROM group_topics GROUP BY topic ORDER BY score DESC LIMIT 60")}

    def user_detail(self, user_id: str, limit: int = 100) -> dict[str,Any]:
        """One user's whole companionship record: relationship, proactive, audit."""
        user_id = (user_id or "").strip()
        if not user_id:
            raise ValueError("user_id is required")
        size = max(1, min(int(limit), 300))
        with self.db() as db:
            rel = db.execute("SELECT * FROM relationship_accounts WHERE user_id=?", (user_id,)).fetchone()
            ledger = [dict(r) for r in db.execute("SELECT * FROM relationship_ledger WHERE user_id=? ORDER BY created_at DESC LIMIT ?", (user_id, size)).fetchall()]
            targets = (f"user:{user_id}", f"session:{user_id}")
            candidates = [dict(r) for r in db.execute("SELECT * FROM proactive_candidates WHERE target IN (?,?) ORDER BY updated_at DESC LIMIT ?", (*targets, size)).fetchall()]
            receipts = [dict(r) for r in db.execute("SELECT r.* FROM proactive_receipts r JOIN proactive_candidates c ON c.id=r.candidate_id WHERE c.target IN (?,?) ORDER BY r.created_at DESC LIMIT ?", (*targets, size)).fetchall()]
            audits = [dict(r) for r in db.execute("SELECT * FROM audit_events WHERE target LIKE ? OR detail LIKE ? ORDER BY created_at DESC LIMIT 50", (f"%{user_id}%", f"%{user_id}%")).fetchall()]
            counts = {
                "ledger": db.execute("SELECT COUNT(*) FROM relationship_ledger WHERE user_id=?", (user_id,)).fetchone()[0],
                "candidates": db.execute("SELECT COUNT(*) FROM proactive_candidates WHERE target IN (?,?)", (*targets,)).fetchone()[0],
                "delivered": db.execute("SELECT COUNT(*) FROM proactive_receipts r JOIN proactive_candidates c ON c.id=r.candidate_id WHERE c.target IN (?,?) AND r.phase='delivered'", (*targets,)).fetchone()[0],
            }
        stage = (rel["stage"] if rel else "") or ""
        return {
            "user_id": user_id,
            "relationship": dict(rel) if rel else None,
            "stage_limit": self.STAGE_TARGET_LIMITS.get(stage),
            "ledger": ledger,
            "counts": counts,
            "proactive": {"candidates": candidates, "receipts": receipts},
            "audit": audits,
        }

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
