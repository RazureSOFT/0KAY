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
import re
import sqlite3
from typing import Any
from uuid import uuid4

from .i18n import translate


def now() -> str: return datetime.now().isoformat()
def new_id(prefix: str) -> str: return f"{prefix}_{uuid4().hex}"


GROUP_POSITIVE = ("哈哈", "笑死", "赞", "好耶", "开心", "可爱", "谢谢", "厉害", "喜欢", "冲", "加油", "牛")
GROUP_NEGATIVE = ("烦", "气人", "恶心", "难过", "无语", "滚", "傻", "崩", "吵", "骂", "吐了")
GROUP_STOPWORDS = frozenset((
    "这个", "那个", "就是", "什么", "怎么", "可以", "不是", "没有", "我们", "你们", "他们",
    "现在", "今天", "真的", "感觉", "因为", "所以", "但是", "如果", "然后", "还是", "已经",
    "一下", "这样", "那样", "知道", "觉得", "一个", "自己", "时候", "东西", "这里", "那里",
))


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
            CREATE TABLE IF NOT EXISTS group_threads (id TEXT PRIMARY KEY, group_id TEXT NOT NULL, topic TEXT NOT NULL, score REAL NOT NULL DEFAULT 1, status TEXT NOT NULL DEFAULT 'active', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(group_id,topic));
            CREATE TABLE IF NOT EXISTS group_bot_state (group_id TEXT PRIMARY KEY, last_spoke TEXT, last_topic TEXT);
            CREATE TABLE IF NOT EXISTS daily_reviews (id TEXT PRIMARY KEY, date TEXT NOT NULL, summary TEXT NOT NULL, findings TEXT NOT NULL DEFAULT '[]', created_at TEXT NOT NULL, UNIQUE(date));
            CREATE TABLE IF NOT EXISTS journal_entries (id TEXT PRIMARY KEY, kind TEXT NOT NULL, content TEXT NOT NULL, created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS audit_events (id TEXT PRIMARY KEY, trace_id TEXT, kind TEXT NOT NULL, target TEXT, outcome TEXT NOT NULL, detail TEXT, created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS persona_evolution (id TEXT PRIMARY KEY, trait TEXT NOT NULL, value TEXT NOT NULL, evidence TEXT NOT NULL, support_count INTEGER NOT NULL DEFAULT 1, confidence REAL NOT NULL DEFAULT 0.35, status TEXT NOT NULL DEFAULT 'proposed', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(trait,value));
            CREATE TABLE IF NOT EXISTS important_dates (id TEXT PRIMARY KEY, title TEXT NOT NULL, date_text TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'date', repeat_yearly INTEGER NOT NULL DEFAULT 1, note TEXT DEFAULT '', created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS personal_goals (id TEXT PRIMARY KEY, title TEXT NOT NULL, detail TEXT DEFAULT '', kind TEXT NOT NULL DEFAULT 'growth', status TEXT NOT NULL DEFAULT 'active', progress REAL NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS food_menu (id TEXT PRIMARY KEY, name TEXT NOT NULL, kind TEXT NOT NULL DEFAULT 'meal', tags TEXT NOT NULL DEFAULT '', note TEXT DEFAULT '', created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS group_registry (group_id TEXT PRIMARY KEY, policy TEXT NOT NULL DEFAULT 'observe', alias TEXT NOT NULL DEFAULT '', note TEXT DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS group_member_flags (group_id TEXT NOT NULL, user_id TEXT NOT NULL, flag TEXT NOT NULL DEFAULT 'watch', updated_at TEXT NOT NULL, PRIMARY KEY(group_id,user_id));
            CREATE TABLE IF NOT EXISTS skills (id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL DEFAULT 'general', level INTEGER NOT NULL DEFAULT 1, keywords TEXT NOT NULL DEFAULT '', aliases TEXT NOT NULL DEFAULT '', note TEXT DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS expressions (id TEXT PRIMARY KEY, text TEXT NOT NULL, scene TEXT NOT NULL DEFAULT '', scope TEXT NOT NULL DEFAULT 'public', status TEXT NOT NULL DEFAULT 'pending', source TEXT NOT NULL DEFAULT 'manual', created_at TEXT NOT NULL, reviewed_at TEXT, UNIQUE(text));
            CREATE TABLE IF NOT EXISTS social_nodes (user_id TEXT PRIMARY KEY, name TEXT NOT NULL DEFAULT '', tags TEXT NOT NULL DEFAULT '', note TEXT DEFAULT '', updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS social_edges (id TEXT PRIMARY KEY, source_id TEXT NOT NULL, target_id TEXT NOT NULL, relation TEXT NOT NULL DEFAULT 'contact', note TEXT DEFAULT '', created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS world_knowledge (id TEXT PRIMARY KEY, kind TEXT NOT NULL DEFAULT 'worldview', title TEXT NOT NULL, content TEXT NOT NULL, tags TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL, updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS unfinished_topics (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, topic TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(user_id,topic));
            CREATE TABLE IF NOT EXISTS user_portraits (user_id TEXT PRIMARY KEY, summary TEXT NOT NULL DEFAULT '', traits TEXT NOT NULL DEFAULT '', updated_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS outreach_state (target TEXT PRIMARY KEY, consecutive_unanswered INTEGER NOT NULL DEFAULT 0, last_sent TEXT, paused_until TEXT);
            CREATE TABLE IF NOT EXISTS bot_timeline (id TEXT PRIMARY KEY, topic TEXT NOT NULL, summary TEXT NOT NULL, detail TEXT DEFAULT '', created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS goal_logs (id TEXT PRIMARY KEY, goal_id TEXT NOT NULL, evidence TEXT NOT NULL, progress REAL, created_at TEXT NOT NULL);
            CREATE TABLE IF NOT EXISTS content_digests (id TEXT PRIMARY KEY, kind TEXT NOT NULL DEFAULT 'news', source TEXT DEFAULT '', title TEXT NOT NULL, summary TEXT DEFAULT '', url TEXT DEFAULT '', created_at TEXT NOT NULL);
            """)
            for key, value in {"proactive_daily_limit":"3", "proactive_target_limit":"1", "quiet_start":"23", "quiet_end":"8"}.items():
                db.execute("INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)", (key,value))
            self._migrate(db)

    DB_SCHEMA_VERSION = 1

    def _migrate(self, db) -> None:
        """Versioned schema migration; CREATE TABLE IF NOT EXISTS covers new tables."""
        current = int(db.execute("PRAGMA user_version").fetchone()[0] or 0)
        if current >= self.DB_SCHEMA_VERSION:
            return
        # Hot-path indexes for the dashboard's filtered reads.
        db.executescript("""
        CREATE INDEX IF NOT EXISTS idx_journal_kind_day ON journal_entries(kind, created_at);
        CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_events(created_at);
        CREATE INDEX IF NOT EXISTS idx_receipts_created ON proactive_receipts(created_at);
        CREATE INDEX IF NOT EXISTS idx_timeline_created ON bot_timeline(created_at);
        CREATE INDEX IF NOT EXISTS idx_ledger_user ON relationship_ledger(user_id, created_at);
        CREATE INDEX IF NOT EXISTS idx_topics_open ON unfinished_topics(user_id, status);
        """)
        db.execute(f"PRAGMA user_version={int(self.DB_SCHEMA_VERSION)}")

    def backup(self, keep: int = 7) -> dict[str,Any]:
        """Consistent copy of the companion DB; prunes to the newest `keep` files."""
        backups = self.path.parent / "backups"
        backups.mkdir(parents=True, exist_ok=True)
        target = backups / f"companion-{datetime.now().strftime('%Y%m%d-%H%M%S')}.db"
        try:
            source = sqlite3.connect(self.path)
            destination = sqlite3.connect(target)
            with destination:
                source.backup(destination)
            source.close(); destination.close()
        except Exception as error:
            return {"backup": "", "error": str(error)}
        for old in sorted(backups.glob("companion-*.db"))[:-max(1, keep)]:
            try:
                old.unlink()
            except OSError:
                pass
        return {"backup": str(target)}

    def backup_if_due(self, keep: int = 7) -> dict[str,Any]:
        today = date.today().isoformat()
        with self.db() as db:
            if self._setting(db, "last_backup_date", "") == today:
                return {"skipped": "done"}
        result = self.backup(keep=keep)
        with self.db() as db:
            db.execute("INSERT INTO settings(key,value) VALUES('last_backup_date',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (today,))
        return result

    def journal_count_for_day(self, day: str, kind: str = "journal") -> int:
        with self.db() as db:
            return db.execute("SELECT COUNT(*) FROM journal_entries WHERE kind=? AND substr(created_at,1,10)=?", (kind, day)).fetchone()[0]

    def proactive_delivered_count(self, day: str) -> int:
        with self.db() as db:
            return db.execute("SELECT COUNT(*) FROM proactive_receipts WHERE phase='delivered' AND created_at LIKE ?", (f"{day}%",)).fetchone()[0]

    def digests_count(self, day: str) -> int:
        with self.db() as db:
            return db.execute("SELECT COUNT(*) FROM content_digests WHERE substr(created_at,1,10)=?", (day,)).fetchone()[0]

    def save_daily_review(self, day: str, summary: str, findings: list[dict]) -> dict[str,Any]:
        item = {"id": new_id("review"), "date": day, "summary": summary[:2000],
                "findings": json.dumps(findings or [], ensure_ascii=False), "created_at": now()}
        with self.db() as db:
            db.execute("INSERT INTO daily_reviews VALUES(?,?,?,?,?) ON CONFLICT(date) DO UPDATE SET "
                       "summary=excluded.summary, findings=excluded.findings, created_at=excluded.created_at",
                       (item["id"], item["date"], item["summary"], item["findings"], item["created_at"]))
            row = dict(db.execute("SELECT * FROM daily_reviews WHERE date=?", (day,)).fetchone())
        return row

    def list_daily_reviews(self, limit: int = 14) -> list[dict[str,Any]]:
        with self.db() as db:
            return [dict(r) for r in db.execute(
                "SELECT * FROM daily_reviews ORDER BY date DESC LIMIT ?", (max(1, min(int(limit), 60)),)).fetchall()]

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
            # Eight-stage climb; hysteresis avoids flicker when grazing a threshold.
            stage = self._hysteresis(old, score)
            db.execute("UPDATE relationship_accounts SET affinity=?, stage=?, last_seen=?, revision=revision+1 WHERE user_id=?", (score,stage,now(),user_id))
            db.execute("INSERT INTO relationship_ledger VALUES(?,?,?,?,?,?,?)", (new_id("rel"),user_id,event_key,delta,reason,channel,now()))
            return dict(db.execute("SELECT * FROM relationship_accounts WHERE user_id=?", (user_id,)).fetchone())

    def observe_user(self, user_id: str, message: str, is_group: bool = False) -> dict[str,Any]:
        lower = message.lower()
        delta = .03 if any(x in lower for x in ("谢谢","喜欢","好棒","thanks","love")) else -.04 if any(x in lower for x in ("讨厌","滚","hate","stupid")) else .003
        self.note_outreach_reply(user_id)
        return self.apply_relationship_event(user_id, f"message:{hash((user_id,message,datetime.now().strftime('%Y%m%d%H%M')))}", "message_sentiment", "group" if is_group else "private", delta)

    # Calendar / continuity domain ---------------------------------------
    def add_agenda(self, title: str, when: str = "", detail: str = "", kind: str = "persona_soft_activity", auto_confirm: bool = True) -> dict[str,Any]:
        """Add an agenda item. Confirmed immediately by default — no manual step."""
        title = (title or "").strip()[:160]
        if not title:
            return {"status": "ignored"}
        candidate = {"id":new_id("cal_candidate"),"title":title,"when":when,"detail":detail[:2000],"kind":kind,"status":"pending_confirmation","created_at":now()}
        with self.db() as db:
            db.execute("INSERT INTO calendar_candidates VALUES(?,?,?,?,?,?,?,?,?,?)", (candidate["id"],candidate["title"],when,detail,kind,candidate["status"],None,candidate["created_at"],(datetime.now()+timedelta(days=7)).isoformat(),1))
            if auto_confirm:
                event_id = new_id("calendar")
                db.execute("INSERT INTO calendar_events VALUES(?,?,?,?,?,?,?,?,?,?)", (event_id,candidate["id"],title,when,detail,kind,"active",1,now(),now()))
                db.execute("UPDATE calendar_candidates SET status='confirmed', revision=revision+1 WHERE id=?", (candidate["id"],))
                candidate["status"] = "confirmed"
                candidate["event_id"] = event_id
                self._audit_tx(db, "calendar_confirm", title, event_id)
            else:
                self._audit_tx(db, "calendar_candidate", title, candidate["id"])
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
    SETTING_DEFAULTS = {"proactive_daily_limit": "3", "proactive_target_limit": "1", "quiet_start": "23", "quiet_end": "8",
                        "idle_minutes": "30", "min_interval_minutes": "5", "check_interval_seconds": "600", "burst_max": "2",
                        "daily_token_limit": "0", "enable_proactive": "1", "enable_group_observe": "1", "enable_dream": "1",
                        "owner_user_ids": "", "secondary_user_ids": "", "other_stage_cap": "熟悉",
                        "secondary_stage_cap": "友好", "enable_exclusive_bond": "1",
                        "affinity_decay_per_day": "0.02", "affinity_decay_after_days": "3",
                        "reply_deceleration": "1",
                        "env_timezone": "Asia/Shanghai", "env_city": "", "env_latitude": "", "env_longitude": "",
                        "enable_environment_fetch": "0", "weather_cache_minutes": "60",
                        "enable_content_fetch": "0", "news_feeds": "", "content_items_per_feed": "3",
                        "tts_endpoint": "", "proactive_tts": "0"}

    SCHEMA_VERSION = 2
    # key -> (kind, spec). kind: int/float/bool/choice/json/text
    CONFIG_SCHEMA = {
        "proactive_daily_limit": ("int", (0, 50)), "proactive_target_limit": ("int", (0, 20)),
        "quiet_start": ("int", (0, 23)), "quiet_end": ("int", (0, 23)),
        "idle_minutes": ("int", (1, 1440)), "min_interval_minutes": ("int", (0, 1440)),
        "check_interval_seconds": ("int", (30, 86400)), "burst_max": ("int", (1, 20)),
        "daily_token_limit": ("int", (0, 10 ** 9)),
        "enable_proactive": ("bool", None), "enable_group_observe": ("bool", None), "enable_dream": ("bool", None),
        "enable_exclusive_bond": ("bool", None), "enable_environment_fetch": ("bool", None),
        "reply_deceleration": ("bool", None),
        "affinity_decay_per_day": ("float", (0.0, 1.0)), "affinity_decay_after_days": ("int", (0, 365)),
        "weather_cache_minutes": ("int", (5, 1440)),
        "other_stage_cap": ("choice", None), "secondary_stage_cap": ("choice", None),
        "locale": ("choice", None), "model_routes": ("json", None),
        "owner_user_ids": ("text", None), "secondary_user_ids": ("text", None),
        "env_timezone": ("text", None), "env_city": ("text", None),
        "env_latitude": ("float", (-90.0, 90.0)), "env_longitude": ("float", (-180.0, 180.0)),
        "enable_content_fetch": ("bool", None), "content_items_per_feed": ("int", (1, 20)),
        "news_feeds": ("text", None), "tts_endpoint": ("text", None), "proactive_tts": ("bool", None),
    }
    LOCALE_CHOICES = ("zh-CN", "en-US")
    BOOL_VALUES = {"1", "0", "true", "false", "yes", "no", "on", "off"}

    @classmethod
    def validate_setting(cls, key: str, value: Any) -> str | None:
        """Coerce a setting to its canonical string, or None if invalid/unknown."""
        if key not in cls.SETTING_DEFAULTS:
            return None
        kind, spec = cls.CONFIG_SCHEMA.get(key, ("text", None))
        try:
            if kind == "int":
                number = int(float(value))
                low, high = spec
                return str(max(low, min(high, number)))
            if kind == "float":
                number = float(value)
                if spec:
                    low, high = spec
                    number = max(low, min(high, number))
                return f"{number:g}"
            if kind == "bool":
                text = str(value).strip().lower()
                if text not in cls.BOOL_VALUES:
                    return None
                return "1" if text in ("1", "true", "yes", "on") else "0"
            if kind == "choice":
                choices = cls.STAGE_ORDER if key.endswith("stage_cap") else cls.LOCALE_CHOICES
                return str(value).strip() if str(value).strip() in choices else None
            if kind == "json":
                json.loads(str(value))
                return str(value)
            return str(value)[:2000]
        except (TypeError, ValueError):
            return None

    # Relationship: eight ordinary stages (index order = monotonic climb) plus
    # an exclusive bond reserved for the owner. Interaction is decided separately.
    RELATIONSHIP_STAGES = (
        ("警惕", -0.5), ("疏离", -0.2), ("陌生", 0.1), ("认识", 0.3),
        ("熟悉", 0.5), ("友好", 0.68), ("亲近", 0.85), ("亲密", 1.01),
    )
    STAGE_ORDER = [name for name, _ in RELATIONSHIP_STAGES]
    INTERACTION_LIMITS = {"回避": 0, "受伤": 0, "放松": 1, "活泼": 1, "温暖": 2, "亲近": 2, "爱意": 3}

    @classmethod
    def stage_for_score(cls, score: float) -> str:
        for name, ceiling in cls.RELATIONSHIP_STAGES:
            if score < ceiling:
                return name
        return cls.RELATIONSHIP_STAGES[-1][0]

    @classmethod
    def _hysteresis(cls, old: str, score: float) -> str:
        target = cls.stage_for_score(score)
        if old in cls.STAGE_ORDER and target in cls.STAGE_ORDER:
            old_index, target_index = cls.STAGE_ORDER.index(old), cls.STAGE_ORDER.index(target)
            if target_index < old_index and score > cls.RELATIONSHIP_STAGES[old_index][1] - 0.06:
                return old  # dropping requires clearing the band, not grazing it
        return target

    def _id_set(self, key: str) -> set[str]:
        raw = str((self.get_settings() or {}).get(key) or "")
        return {part.strip() for part in raw.replace("，", ",").split(",") if part.strip()}

    def user_role(self, user_id: str) -> str:
        value = str(user_id or "").strip()
        if not value:
            return "other"
        if value in self._id_set("owner_user_ids"):
            return "owner"
        if value in self._id_set("secondary_user_ids"):
            return "secondary"
        return "other"

    def is_owner(self, user_id: str) -> bool:
        return self.user_role(user_id) == "owner"

    def _cap_stage(self, stage: str, role: str, settings: dict | None = None) -> str:
        settings = settings or self.get_settings()
        cap = {"owner": "亲密", "secondary": settings.get("secondary_stage_cap", "友好"),
               "other": settings.get("other_stage_cap", "熟悉")}.get(role, "熟悉")
        if cap in self.STAGE_ORDER and stage in self.STAGE_ORDER:
            return stage if self.STAGE_ORDER.index(stage) <= self.STAGE_ORDER.index(cap) else cap
        return stage

    @staticmethod
    def _tone(stage: str, interaction: str) -> str:
        tones = {
            "回避": "此刻想安静一下，语气简短克制，不主动展开话题。",
            "受伤": "对方或近期的事让你有些受伤，语气收敛、话少，但不失礼。",
            "放松": "相处放松自然，像平常聊天。",
            "活泼": "心情轻快，语气活泼，可以有玩笑和更多表情。",
            "温暖": "语气温和体贴，适度关心对方。",
            "亲近": "关系亲近，可用昵称与玩笑，主动关心对方在做什么。",
            "爱意": "与对方有专属的亲密联结，语气亲昵真情，但保持日常尺度。",
        }
        return tones.get(interaction, "语气自然友好。")

    def relationship_expression(self, user_id: str, valence: float = 0.5, arousal: float = 0.5, irritation: float = 0.0) -> dict[str, Any]:
        """Unified expression decision: stage (capped by role) + interaction + outreach cap."""
        account = self.relationship(user_id)
        role = self.user_role(user_id)
        settings = self.get_settings()
        affinity = float(account.get("affinity") or 0.0)
        stage = self._cap_stage(str(account.get("stage") or "陌生"), role, settings)
        bond = (role == "owner" and str(settings.get("enable_exclusive_bond", "1")) == "1"
                and affinity >= self.RELATIONSHIP_STAGES[-2][1])
        if irritation >= 0.7 or stage in ("警惕",) or affinity <= -0.35:
            interaction = "回避"
        elif valence <= 0.32:
            interaction = "受伤"
        elif stage == "疏离":
            interaction = "回避"
        elif bond and valence >= 0.6:
            interaction = "爱意"
        elif stage in ("亲近", "亲密") and valence >= 0.55:
            interaction = "亲近"
        elif valence >= 0.62 and arousal >= 0.6:
            interaction = "活泼"
        elif valence >= 0.58:
            interaction = "温暖"
        else:
            interaction = "放松"
        if interaction in ("亲近", "爱意") and role != "owner":
            interaction = "温暖" if valence >= 0.5 else "放松"
        return {
            "user_id": str(user_id or ""), "role": role, "stage": stage, "affinity": round(affinity, 3),
            "interaction": interaction, "bond": bond, "tone": self._tone(stage, interaction),
            "proactive_limit": self.INTERACTION_LIMITS.get(interaction, 1),
        }

    def decay_relationships(self) -> dict[str, Any]:
        """Natural cooling: positive affinity drifts toward 0 for quiet accounts, once per day."""
        today = date.today().isoformat()
        with self.db() as db:
            if self._setting(db, "affinity_decay_date", "") == today:
                return {"decayed": 0, "skipped": "done"}
            rate = float(self._setting(db, "affinity_decay_per_day", "0.02"))
            after = float(self._setting(db, "affinity_decay_after_days", "3"))
            decayed = 0
            for row in db.execute("SELECT user_id, affinity, last_seen FROM relationship_accounts").fetchall():
                if float(row["affinity"]) <= 0:
                    continue
                last = str(row["last_seen"] or "")
                quiet = True
                if last:
                    try:
                        quiet = (datetime.now() - datetime.fromisoformat(last)).total_seconds() >= after * 86400
                    except ValueError:
                        quiet = True
                if not quiet:
                    continue
                new_score = max(0.0, float(row["affinity"]) - rate)
                db.execute("UPDATE relationship_accounts SET affinity=?, stage=?, revision=revision+1 WHERE user_id=?",
                           (new_score, self.stage_for_score(new_score), row["user_id"]))
                decayed += 1
            db.execute("INSERT INTO settings(key,value) VALUES('affinity_decay_date',?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (today,))
            self._audit_tx(db, "relationship_decay", f"decayed={decayed}", "", "ok")
        return {"decayed": decayed}

    # Unfinished topics / light portrait / outreach deceleration -----------
    def record_open_topics(self, user_id: str, topics: list[str]) -> int:
        user_id = str(user_id or "").strip()
        if not user_id:
            return 0
        added = 0
        with self.db() as db:
            for raw in topics or []:
                topic = str(raw or "").strip()[:120]
                if not topic:
                    continue
                existing = db.execute("SELECT 1 FROM unfinished_topics WHERE user_id=? AND topic=?", (user_id, topic)).fetchone()
                if existing:
                    db.execute("UPDATE unfinished_topics SET status='open', updated_at=? WHERE user_id=? AND topic=?", (now(), user_id, topic))
                    continue
                db.execute("INSERT INTO unfinished_topics VALUES(?,?,?,?,?,?)",
                           (new_id("topic"), user_id, topic, "open", now(), now()))
                added += 1
        return added

    def resolve_open_topics(self, user_id: str, topics: list[str] | None = None) -> int:
        user_id = str(user_id or "").strip()
        if not user_id:
            return 0
        with self.db() as db:
            if topics:
                count = 0
                for raw in topics:
                    topic = str(raw or "").strip()[:120]
                    if topic:
                        count += db.execute("UPDATE unfinished_topics SET status='closed', updated_at=? WHERE user_id=? AND topic=?",
                                            (now(), user_id, topic)).rowcount
                return count
            return db.execute("UPDATE unfinished_topics SET status='closed', updated_at=? WHERE user_id=? AND status='open'",
                              (now(), user_id)).rowcount

    def list_open_topics(self, user_id: str, limit: int = 5) -> list[str]:
        with self.db() as db:
            return [row["topic"] for row in db.execute(
                "SELECT topic FROM unfinished_topics WHERE user_id=? AND status='open' ORDER BY updated_at DESC LIMIT ?",
                (str(user_id or ""), max(1, min(int(limit), 20)))).fetchall()]

    def set_user_portrait(self, user_id: str, summary: str, traits: str = "") -> dict[str,Any]:
        user_id = str(user_id or "").strip()
        if not user_id:
            return {"updated": False}
        with self.db() as db:
            db.execute("INSERT INTO user_portraits(user_id,summary,traits,updated_at) VALUES(?,?,?,?) "
                       "ON CONFLICT(user_id) DO UPDATE SET summary=excluded.summary, traits=excluded.traits, updated_at=excluded.updated_at",
                       (user_id, str(summary or "")[:600], str(traits or "")[:300], now()))
            return dict(db.execute("SELECT * FROM user_portraits WHERE user_id=?", (user_id,)).fetchone())

    def get_user_portrait(self, user_id: str) -> dict[str,Any]:
        with self.db() as db:
            row = db.execute("SELECT * FROM user_portraits WHERE user_id=?", (str(user_id or ""),)).fetchone()
        return dict(row) if row else {"user_id": str(user_id or ""), "summary": "", "traits": "", "updated_at": ""}

    # Self timeline / goal logs / skill growth -----------------------------
    def timeline_add(self, topic: str, summary: str, detail: str = "") -> dict[str,Any]:
        topic, summary = str(topic or "").strip()[:40], str(summary or "").strip()[:200]
        if not topic or not summary:
            return {"status": "ignored"}
        item = {"id": new_id("tl"), "topic": topic, "summary": summary, "detail": str(detail or "")[:1000], "created_at": now()}
        with self.db() as db:
            db.execute("INSERT INTO bot_timeline VALUES(?,?,?,?,?)", (item["id"], item["topic"], item["summary"], item["detail"], item["created_at"]))
        return item

    def add_digest(self, kind: str, source: str, title: str, summary: str = "", url: str = "") -> dict[str,Any]:
        title = str(title or "").strip()[:200]
        if not title:
            return {"status": "ignored"}
        item = {"id": new_id("digest"), "kind": str(kind or "news")[:40], "source": str(source or "")[:120],
                "title": title, "summary": str(summary or "")[:800], "url": str(url or "")[:500], "created_at": now()}
        with self.db() as db:
            db.execute("INSERT INTO content_digests VALUES(?,?,?,?,?,?,?)",
                       (item["id"], item["kind"], item["source"], item["title"], item["summary"], item["url"], item["created_at"]))
        return item

    def list_digests(self, kind: str = "", limit: int = 30) -> list[dict[str,Any]]:
        with self.db() as db:
            size = max(1, min(int(limit), 200))
            if kind:
                return [dict(r) for r in db.execute("SELECT * FROM content_digests WHERE kind=? ORDER BY created_at DESC LIMIT ?", (kind, size)).fetchall()]
            return [dict(r) for r in db.execute("SELECT * FROM content_digests ORDER BY created_at DESC LIMIT ?", (size,)).fetchall()]

    def recent_digest_context(self, limit: int = 6) -> str:
        rows = self.list_digests("", limit)
        return "\n".join(f"- [{row['kind']}] {row['title']}：{row['summary'][:80]}" for row in rows)

    def has_digest_today(self) -> bool:
        with self.db() as db:
            row = db.execute("SELECT 1 FROM content_digests WHERE substr(created_at,1,10)=? LIMIT 1", (date.today().isoformat(),)).fetchone()
        return bool(row)

    def timeline_list(self, limit: int = 50, topic: str = "") -> list[dict[str,Any]]:
        with self.db() as db:
            size = max(1, min(int(limit), 300))
            if topic:
                return [dict(r) for r in db.execute("SELECT * FROM bot_timeline WHERE topic=? ORDER BY created_at DESC LIMIT ?", (topic, size)).fetchall()]
            return [dict(r) for r in db.execute("SELECT * FROM bot_timeline ORDER BY created_at DESC LIMIT ?", (size,)).fetchall()]

    def add_goal_log(self, goal_id: str, evidence: str, progress: float | None = None) -> dict[str,Any]:
        evidence = str(evidence or "").strip()[:400]
        if not evidence:
            return {"updated": False}
        with self.db() as db:
            row = db.execute("SELECT * FROM personal_goals WHERE id=?", (goal_id,)).fetchone()
            if not row:
                return {"updated": False}
            pct = row["progress"] if progress is None else max(0.0, min(1.0, float(progress)))
            db.execute("INSERT INTO goal_logs VALUES(?,?,?,?,?)", (new_id("glog"), goal_id, evidence, pct, now()))
            db.execute("UPDATE personal_goals SET progress=?, updated_at=? WHERE id=?", (pct, now(), goal_id))
            self._audit_tx(db, "goal_log", evidence[:60], goal_id)
        return {"updated": True, "goal_id": goal_id, "progress": pct}

    def goal_logs(self, goal_id: str, limit: int = 20) -> list[dict[str,Any]]:
        with self.db() as db:
            return [dict(r) for r in db.execute(
                "SELECT * FROM goal_logs WHERE goal_id=? ORDER BY created_at DESC LIMIT ?",
                (goal_id, max(1, min(int(limit), 100)))).fetchall()]

    def grow_skill(self, name: str, delta: int = 1) -> dict[str,Any]:
        name = str(name or "").strip()[:80]
        if not name:
            return {"updated": False}
        with self.db() as db:
            row = db.execute("SELECT * FROM skills WHERE name=? ORDER BY updated_at DESC LIMIT 1", (name,)).fetchone()
            if not row:
                return {"updated": False, "reason": "not_found"}
            level = max(1, min(10, int(row["level"]) + int(delta)))
            db.execute("UPDATE skills SET level=?, updated_at=? WHERE id=?", (level, now(), row["id"]))
            self._audit_tx(db, "skill_grow", f"{name}={level}", row["id"])
        return {"updated": True, "name": name, "level": level}

    def note_outreach_reply(self, user_id: str) -> None:
        """A reply resets the unanswered streak for that user target."""
        target = f"user:{str(user_id or '').strip()}"
        if target == "user:":
            return
        with self.db() as db:
            db.execute("INSERT INTO outreach_state(target,consecutive_unanswered) VALUES(?,0) "
                       "ON CONFLICT(target) DO UPDATE SET consecutive_unanswered=0, paused_until=NULL", (target,))

    def _note_outreach_sent(self, db, target: str) -> None:
        row = db.execute("SELECT consecutive_unanswered FROM outreach_state WHERE target=?", (target,)).fetchone()
        unanswered = (int(row["consecutive_unanswered"]) if row else 0) + 1
        paused = None
        if unanswered >= 3:
            paused = (datetime.now() + timedelta(days=3)).isoformat()
        elif unanswered == 2:
            paused = (datetime.now() + timedelta(hours=24)).isoformat()
        db.execute("INSERT INTO outreach_state(target,consecutive_unanswered,last_sent,paused_until) VALUES(?,?,?,?) "
                   "ON CONFLICT(target) DO UPDATE SET consecutive_unanswered=excluded.consecutive_unanswered, last_sent=excluded.last_sent, paused_until=excluded.paused_until",
                   (target, unanswered, now(), paused))

    def _outreach_paused(self, target: str) -> bool:
        with self.db() as db:
            row = db.execute("SELECT paused_until FROM outreach_state WHERE target=?", (target,)).fetchone()
        if not row or not row["paused_until"]:
            return False
        try:
            return datetime.fromisoformat(row["paused_until"]) > datetime.now()
        except ValueError:
            return False

    def can_proactively_send(self, target: str) -> tuple[bool,str]:
        expression = self.relationship_expression(target.split(":",1)[1]) if target.startswith("user:") else None
        if self._outreach_paused(target):
            return False, "outreach paused (no reply)"
        with self.db() as db:
            daily = int(self._setting(db,"proactive_daily_limit","3")); per_target = int(self._setting(db,"proactive_target_limit","1"))
            if expression is not None:
                cap = int(expression.get("proactive_limit", 1))
                if cap <= 0:
                    return False, f"interaction {expression['interaction']} blocks outreach"
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

    def last_delivery_at(self) -> datetime | None:
        with self.db() as db:
            row = db.execute("SELECT created_at FROM proactive_receipts WHERE phase='delivered' ORDER BY created_at DESC LIMIT 1").fetchone()
        if not row or not row["created_at"]:
            return None
        try:
            return datetime.fromisoformat(row["created_at"])
        except ValueError:
            return None

    def record_proactive_send(self, target: str, content: str) -> None:
        candidate = self.create_proactive_candidate(target,"manual_tool",content)
        with self.db() as db:
            db.execute("UPDATE proactive_candidates SET status='delivered',updated_at=? WHERE id=?",(now(),candidate["id"]))
            db.execute("INSERT INTO proactive_receipts VALUES(?,?,?,?,?,?)",(new_id("receipt"),candidate["id"],"delivered","ok",content[:1000],now()))
            if target.startswith("user:"):
                self._note_outreach_sent(db, target)
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
            row = db.execute("SELECT target FROM proactive_candidates WHERE id=?", (candidate_id,)).fetchone()
            db.execute("UPDATE proactive_candidates SET status='delivered', updated_at=? WHERE id=?", (now(), candidate_id))
            db.execute("INSERT INTO proactive_receipts VALUES(?,?,?,?,?,?)", (new_id("receipt"), candidate_id, "delivered", outcome, content[:1000], now()))
            if row and str(row["target"] or "").startswith("user:"):
                self._note_outreach_sent(db, row["target"])
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
    @staticmethod
    def group_terms(message: str) -> list[str]:
        """CJK n-grams + alnum words for slang/thread tracking (no segmenter available)."""
        text = str(message or "")
        terms: list[str] = []
        for run in re.findall(r"[\u4e00-\u9fff]+", text):
            for size in (2, 3):
                for index in range(len(run) - size + 1):
                    term = run[index:index + size]
                    if term not in GROUP_STOPWORDS:
                        terms.append(term)
        terms.extend(word.lower() for word in re.findall(r"[A-Za-z0-9_]{2,20}", text))
        return list(dict.fromkeys(terms))[:16]

    @staticmethod
    def group_sentiment(message: str) -> float:
        text = str(message or "")
        positive = sum(1 for word in GROUP_POSITIVE if word in text)
        negative = sum(1 for word in GROUP_NEGATIVE if word in text)
        if not positive and not negative:
            return 0.0
        return max(-1.0, min(1.0, (positive - negative) / (positive + negative)))

    def observe_group(self, group_id: str, user_id: str, message: str) -> None:
        if self.group_policy(group_id) == "blacklist":
            return
        sentiment = self.group_sentiment(message)
        with self.db() as db:
            db.execute("INSERT OR IGNORE INTO group_scenes(group_id,updated_at) VALUES(?,?)",(group_id,now()))
            row = db.execute("SELECT mood FROM group_scenes WHERE group_id=?", (group_id,)).fetchone()
            mood = max(-1.0, min(1.0, float(row["mood"] if row else 0.0) * 0.8 + sentiment))
            db.execute("UPDATE group_scenes SET mood=?, updated_at=? WHERE group_id=?", (mood, now(), group_id))
            db.execute("INSERT INTO group_observations VALUES(?,?,?,?,?,?,?,?)",(new_id("group_obs"),group_id,user_id,"message",message[:800],"group",now(),(datetime.now()+timedelta(days=14)).isoformat()))
            for token in self.group_terms(message):
                db.execute("INSERT INTO group_topics(group_id,topic,score,updated_at) VALUES(?,?,1,?) ON CONFLICT(group_id,topic) DO UPDATE SET score=score+1,updated_at=excluded.updated_at",(group_id,token,now()))
                db.execute("INSERT INTO group_threads VALUES(?,?,?,1,'active',?,?) ON CONFLICT(group_id,topic) DO UPDATE SET score=score+1,status='active',updated_at=excluded.updated_at",
                           (new_id("thread"), group_id, token, now(), now()))
            # Social graph: consecutive speakers are linked as talking to each other.
            previous = db.execute("SELECT user_id FROM group_observations WHERE group_id=? ORDER BY created_at DESC LIMIT 1 OFFSET 1", (group_id,)).fetchone()
            if previous and str(previous["user_id"]) != str(user_id) and user_id:
                exists = db.execute(
                    "SELECT 1 FROM social_edges WHERE (source_id=? AND target_id=?) OR (source_id=? AND target_id=?)",
                    (previous["user_id"], user_id, user_id, previous["user_id"])).fetchone()
                if not exists:
                    db.execute("INSERT INTO social_edges VALUES(?,?,?,?,?,?)",
                               (new_id("edge"), previous["user_id"], user_id, "group_interaction", "auto", now()))

    def group_atmosphere(self, group_id: str) -> dict[str,Any]:
        with self.db() as db:
            scene = db.execute("SELECT mood FROM group_scenes WHERE group_id=?", (group_id,)).fetchone()
            threads = [dict(r) for r in db.execute(
                "SELECT topic, score FROM group_threads WHERE group_id=? AND status='active' ORDER BY score DESC, updated_at DESC LIMIT 8",
                (group_id,)).fetchall()]
            recent = [dict(r) for r in db.execute(
                "SELECT user_id, content FROM group_observations WHERE group_id=? ORDER BY created_at DESC LIMIT 5", (group_id,)).fetchall()]
        mood = float(scene["mood"]) if scene else 0.0
        label = "热闹" if mood >= 0.3 else "有点低沉" if mood <= -0.3 else "平稳"
        return {"group_id": group_id, "mood": round(mood, 3), "label": label, "threads": threads, "recent": recent}

    def note_group_bot_spoke(self, group_id: str, topic_text: str = "") -> None:
        """Remember that LIFE just spoke in a group, and about what (for continuation)."""
        group_id = str(group_id or "").strip()
        if not group_id:
            return
        topic = " ".join(self.group_terms(topic_text)[:6])
        with self.db() as db:
            db.execute("INSERT INTO group_bot_state(group_id,last_spoke,last_topic) VALUES(?,?,?) "
                       "ON CONFLICT(group_id) DO UPDATE SET last_spoke=excluded.last_spoke, last_topic=excluded.last_topic",
                       (group_id, now(), topic))

    def group_should_continue(self, group_id: str, message: str, window_minutes: int = 6) -> bool:
        """Natural continuation: still on a topic LIFE recently spoke about."""
        group_id = str(group_id or "").strip()
        if not group_id:
            return False
        with self.db() as db:
            row = db.execute("SELECT last_spoke,last_topic FROM group_bot_state WHERE group_id=?", (group_id,)).fetchone()
        if not row or not row["last_spoke"]:
            return False
        try:
            if (datetime.now() - datetime.fromisoformat(row["last_spoke"])).total_seconds() > window_minutes * 60:
                return False
        except ValueError:
            return False
        previous = {term for term in str(row["last_topic"] or "").split() if term}
        current = set(self.group_terms(message))
        return bool(previous & current)

    def group_interest_match(self, group_id: str, interests: list[str]) -> list[str]:
        """Active threads matching LIFE's own interests (world/skills keywords)."""
        wanted = [str(item).strip().lower() for item in (interests or []) if str(item).strip()]
        if not wanted:
            return []
        with self.db() as db:
            threads = [dict(r) for r in db.execute(
                "SELECT topic FROM group_threads WHERE group_id=? AND status='active' ORDER BY score DESC LIMIT 30", (group_id,)).fetchall()]
        return [t["topic"] for t in threads if any(word in t["topic"].lower() or t["topic"].lower() in word for word in wanted)]

    def group_should_wake(self, group_id: str, message: str, mentioned: bool = False, keywords: tuple[str,...] = ()) -> bool:
        if mentioned: return True
        return any(word.lower() in message.lower() for word in keywords if word)

    # Group registry / slang / member safety -------------------------------
    POLICIES = ("whitelist", "observe", "blacklist")

    def group_policy(self, group_id: str) -> str:
        with self.db() as db:
            row = db.execute("SELECT policy FROM group_registry WHERE group_id=?", (group_id,)).fetchone()
        return row["policy"] if row else "observe"

    def group_list(self) -> list[dict[str,Any]]:
        with self.db() as db:
            registry = {r["group_id"]: dict(r) for r in db.execute("SELECT * FROM group_registry").fetchall()}
            scenes = {r["group_id"]: dict(r) for r in db.execute("SELECT * FROM group_scenes").fetchall()}
            observations = {r["group_id"]: r["n"] for r in db.execute("SELECT group_id, COUNT(*) AS n FROM group_observations GROUP BY group_id").fetchall()}
            topics = {r["group_id"]: r["n"] for r in db.execute("SELECT group_id, COUNT(*) AS n FROM group_topics GROUP BY group_id").fetchall()}
        ids = list(dict.fromkeys([*registry, *scenes]))
        out = []
        for group_id in ids:
            entry = registry.get(group_id, {})
            out.append({"group_id": group_id, "policy": entry.get("policy", "observe"), "alias": entry.get("alias", ""),
                        "note": entry.get("note", ""), "mood": (scenes.get(group_id) or {}).get("mood", 0),
                        "observations": observations.get(group_id, 0), "topics": topics.get(group_id, 0)})
        out.sort(key=lambda x: x["observations"], reverse=True)
        return out

    def group_upsert(self, group_id: str, policy: str = "observe", alias: str = "", note: str = "") -> dict[str,Any]:
        group_id = (group_id or "").strip()
        if not group_id:
            raise ValueError("group_id is required")
        policy = policy if policy in self.POLICIES else "observe"
        with self.db() as db:
            db.execute("INSERT INTO group_registry VALUES(?,?,?,?,?,?) ON CONFLICT(group_id) DO UPDATE SET policy=excluded.policy, alias=excluded.alias, note=excluded.note, updated_at=excluded.updated_at",
                       (group_id, policy, (alias or "")[:80], (note or "")[:300], now(), now()))
            self._audit_tx(db, "group_upsert", group_id, group_id)
            return dict(db.execute("SELECT * FROM group_registry WHERE group_id=?", (group_id,)).fetchone())

    def group_delete(self, group_id: str) -> dict[str,Any]:
        with self.db() as db:
            db.execute("DELETE FROM group_registry WHERE group_id=?", (group_id,))
            db.execute("DELETE FROM group_scenes WHERE group_id=?", (group_id,))
            db.execute("DELETE FROM group_observations WHERE group_id=?", (group_id,))
            db.execute("DELETE FROM group_topics WHERE group_id=?", (group_id,))
            db.execute("DELETE FROM group_threads WHERE group_id=?", (group_id,))
            self._audit_tx(db, "group_delete", group_id, group_id)
        return {"deleted": True, "group_id": group_id}

    def group_slang_list(self, group_id: str) -> list[dict[str,Any]]:
        with self.db() as db:
            return [dict(r) for r in db.execute("SELECT topic,score,updated_at FROM group_topics WHERE group_id=? ORDER BY score DESC", (group_id,)).fetchall()]

    def group_slang_update(self, group_id: str, topic: str, score: float = 1.0) -> dict[str,Any]:
        topic = (topic or "").strip()[:60]
        if not topic:
            raise ValueError("topic is required")
        with self.db() as db:
            db.execute("INSERT INTO group_topics(group_id,topic,score,updated_at) VALUES(?,?,?,?) ON CONFLICT(group_id,topic) DO UPDATE SET score=excluded.score, updated_at=excluded.updated_at",
                       (group_id, topic, float(score), now()))
        return {"topic": topic, "score": float(score)}

    def group_slang_delete(self, group_id: str, topic: str) -> dict[str,Any]:
        with self.db() as db:
            cursor = db.execute("DELETE FROM group_topics WHERE group_id=? AND topic=?", (group_id, topic))
            return {"deleted": bool(cursor.rowcount)}

    def group_members(self, group_id: str, limit: int = 50) -> list[dict[str,Any]]:
        with self.db() as db:
            rows = [dict(r) for r in db.execute("SELECT user_id, COUNT(*) AS messages, MAX(created_at) AS last_at FROM group_observations WHERE group_id=? GROUP BY user_id ORDER BY messages DESC LIMIT ?", (group_id, max(1, min(int(limit), 200)))).fetchall()]
            flags = {r["user_id"]: r["flag"] for r in db.execute("SELECT user_id,flag FROM group_member_flags WHERE group_id=?", (group_id,)).fetchall()}
        for row in rows:
            row["flag"] = flags.get(row["user_id"], "watch")
        return rows

    def group_member_flag(self, group_id: str, user_id: str, flag: str = "watch") -> dict[str,Any]:
        flag = flag if flag in ("allow", "watch", "mute") else "watch"
        with self.db() as db:
            db.execute("INSERT INTO group_member_flags VALUES(?,?,?,?) ON CONFLICT(group_id,user_id) DO UPDATE SET flag=excluded.flag, updated_at=excluded.updated_at",
                       (group_id, user_id, flag, now()))
            self._audit_tx(db, "group_member_flag", f"{user_id}={flag}", group_id)
        return {"group_id": group_id, "user_id": user_id, "flag": flag}

    # Learning: skills / expressions / social graph -----------------------
    def add_skill(self, name: str, category: str = "general", level: int = 1, keywords: str = "", aliases: str = "", note: str = "") -> dict[str,Any]:
        name = (name or "").strip()[:80]
        if not name:
            raise ValueError("skill name is required")
        item = {"id": new_id("skill"), "name": name, "category": (category or "general")[:40], "level": max(1, min(10, int(level))),
                "keywords": (keywords or "")[:200], "aliases": (aliases or "")[:200], "note": (note or "")[:400], "created_at": now(), "updated_at": now()}
        with self.db() as db:
            db.execute("INSERT INTO skills VALUES(?,?,?,?,?,?,?,?,?)", (item["id"], item["name"], item["category"], item["level"], item["keywords"], item["aliases"], item["note"], item["created_at"], item["updated_at"]))
            self._audit_tx(db, "skill_add", name, item["id"])
        return item

    def update_skill(self, skill_id: str, level: int | None = None, keywords: str | None = None, aliases: str | None = None, note: str | None = None, category: str | None = None) -> dict[str,Any]:
        with self.db() as db:
            row = db.execute("SELECT * FROM skills WHERE id=?", (skill_id,)).fetchone()
            if not row:
                return {"updated": False}
            final = {"level": row["level"] if level is None else max(1, min(10, int(level))),
                     "keywords": row["keywords"] if keywords is None else keywords[:200],
                     "aliases": row["aliases"] if aliases is None else aliases[:200],
                     "note": row["note"] if note is None else note[:400],
                     "category": row["category"] if category is None else category[:40]}
            db.execute("UPDATE skills SET level=?,keywords=?,aliases=?,note=?,category=?,updated_at=? WHERE id=?",
                       (final["level"], final["keywords"], final["aliases"], final["note"], final["category"], now(), skill_id))
            after = dict(db.execute("SELECT * FROM skills WHERE id=?", (skill_id,)).fetchone())
            self._audit_tx(db, "skill_update", after["name"], skill_id)
        return {"updated": True, "skill": after}

    def delete_skill(self, skill_id: str) -> dict[str,Any]:
        with self.db() as db:
            cursor = db.execute("DELETE FROM skills WHERE id=?", (skill_id,))
            return {"deleted": bool(cursor.rowcount), "id": skill_id}

    def list_skills(self) -> list[dict[str,Any]]:
        with self.db() as db:
            return [dict(r) for r in db.execute("SELECT * FROM skills ORDER BY level DESC, updated_at DESC").fetchall()]

    def add_expression(self, text: str, scene: str = "", scope: str = "public", source: str = "manual") -> dict[str,Any]:
        text = (text or "").strip()[:300]
        if not text:
            raise ValueError("expression text is required")
        with self.db() as db:
            row = db.execute("SELECT * FROM expressions WHERE text=?", (text,)).fetchone()
            if row:
                return dict(row)
            item = {"id": new_id("expr"), "text": text, "scene": (scene or "")[:60], "scope": (scope or "public")[:40], "status": "pending", "source": (source or "manual")[:40], "created_at": now()}
            db.execute("INSERT INTO expressions VALUES(?,?,?,?,?,?,?,?)", (item["id"], item["text"], item["scene"], item["scope"], item["status"], item["source"], item["created_at"], None))
            self._audit_tx(db, "expression_add", text[:60], item["id"])
        return item

    def list_expressions(self, status: str = "", limit: int = 200) -> list[dict[str,Any]]:
        with self.db() as db:
            size = max(1, min(int(limit), 500))
            if status:
                return [dict(r) for r in db.execute("SELECT * FROM expressions WHERE status=? ORDER BY created_at DESC LIMIT ?", (status, size)).fetchall()]
            return [dict(r) for r in db.execute("SELECT * FROM expressions ORDER BY created_at DESC LIMIT ?", (size,)).fetchall()]

    def review_expression(self, expression_id: str, accept: bool = True) -> dict[str,Any]:
        status = "approved" if accept else "rejected"
        with self.db() as db:
            row = db.execute("SELECT * FROM expressions WHERE id=?", (expression_id,)).fetchone()
            if not row:
                return {"updated": False}
            db.execute("UPDATE expressions SET status=?, reviewed_at=? WHERE id=?", (status, now(), expression_id))
            self._audit_tx(db, "expression_review", status, expression_id)
            return {"updated": True, "id": expression_id, "status": status}

    def delete_expression(self, expression_id: str) -> dict[str,Any]:
        with self.db() as db:
            cursor = db.execute("DELETE FROM expressions WHERE id=?", (expression_id,))
            return {"deleted": bool(cursor.rowcount), "id": expression_id}

    def upsert_social_node(self, user_id: str, name: str = "", tags: str = "", note: str = "") -> dict[str,Any]:
        user_id = (user_id or "").strip()
        if not user_id:
            raise ValueError("user_id is required")
        with self.db() as db:
            db.execute("INSERT INTO social_nodes VALUES(?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET name=excluded.name, tags=excluded.tags, note=excluded.note, updated_at=excluded.updated_at",
                       (user_id, (name or "")[:80], (tags or "")[:200], (note or "")[:300], now()))
            return dict(db.execute("SELECT * FROM social_nodes WHERE user_id=?", (user_id,)).fetchone())

    def list_social_nodes(self) -> list[dict[str,Any]]:
        with self.db() as db:
            return [dict(r) for r in db.execute("SELECT * FROM social_nodes ORDER BY updated_at DESC").fetchall()]

    def add_social_edge(self, source_id: str, target_id: str, relation: str = "contact", note: str = "") -> dict[str,Any]:
        source_id, target_id = (source_id or "").strip(), (target_id or "").strip()
        if not source_id or not target_id or source_id == target_id:
            raise ValueError("two distinct user ids are required")
        item = {"id": new_id("edge"), "source_id": source_id, "target_id": target_id, "relation": (relation or "contact")[:40], "note": (note or "")[:300], "created_at": now()}
        with self.db() as db:
            db.execute("INSERT INTO social_edges VALUES(?,?,?,?,?,?)", (item["id"], item["source_id"], item["target_id"], item["relation"], item["note"], item["created_at"]))
        return item

    def list_social_edges(self) -> list[dict[str,Any]]:
        with self.db() as db:
            return [dict(r) for r in db.execute("SELECT * FROM social_edges ORDER BY created_at DESC").fetchall()]

    def delete_social_edge(self, edge_id: str) -> dict[str,Any]:
        with self.db() as db:
            cursor = db.execute("DELETE FROM social_edges WHERE id=?", (edge_id,))
            return {"deleted": bool(cursor.rowcount), "id": edge_id}

    # Configuration / diagnostics ------------------------------------------
    def get_settings(self) -> dict[str,str]:
        with self.db() as db:
            stored = {r["key"]: r["value"] for r in db.execute("SELECT key,value FROM settings").fetchall()}
        return {**self.SETTING_DEFAULTS, **stored}

    def set_settings(self, payload: dict[str,Any]) -> dict[str,Any]:
        cleaned: dict[str, str] = {}
        rejected: list[str] = []
        for key, value in (payload or {}).items():
            key = str(key)
            validated = self.validate_setting(key, value)
            if validated is None:
                if key in self.SETTING_DEFAULTS:
                    rejected.append(key)
                continue
            cleaned[key] = validated
        with self.db() as db:
            for key, value in cleaned.items():
                db.execute("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (key, value))
            self._audit_tx(db, "settings_update", ",".join(sorted(cleaned)) or "(none)", ",".join(rejected), "ok")
        return {**self.get_settings(), "rejected": rejected}

    def audit_query(self, kind: str = "", outcome: str = "", target: str = "", limit: int = 100, offset: int = 0) -> dict[str,Any]:
        clauses, params = [], []
        if kind:
            clauses.append("kind LIKE ?"); params.append(f"%{kind}%")
        if outcome:
            clauses.append("outcome=?"); params.append(outcome)
        if target:
            clauses.append("target LIKE ?"); params.append(f"%{target}%")
        where = ("WHERE " + " AND ".join(clauses)) if clauses else ""
        size = max(1, min(int(limit), 500))
        with self.db() as db:
            total = db.execute(f"SELECT COUNT(*) FROM audit_events {where}", params).fetchone()[0]
            rows = [dict(r) for r in db.execute(f"SELECT * FROM audit_events {where} ORDER BY created_at DESC LIMIT ? OFFSET ?",
                                                (*params, size, max(0, int(offset)))).fetchall()]
        return {"total": total, "items": rows}

    def audit_kinds(self) -> list[str]:
        with self.db() as db:
            return [row["kind"] for row in db.execute("SELECT DISTINCT kind FROM audit_events ORDER BY kind").fetchall()]

    def export_config(self) -> dict[str,Any]:
        with self.db() as db:
            def rows(query: str) -> list[dict]:
                return [dict(r) for r in db.execute(query).fetchall()]
            settings = {**self.SETTING_DEFAULTS, **{r["key"]: r["value"] for r in db.execute("SELECT key,value FROM settings").fetchall()}}
            return {"version": self.SCHEMA_VERSION, "schema_version": self.SCHEMA_VERSION, "exported_at": now(), "settings": settings,
                    "important_dates": rows("SELECT * FROM important_dates"), "goals": rows("SELECT * FROM personal_goals"),
                    "food": rows("SELECT * FROM food_menu"), "skills": rows("SELECT * FROM skills"),
                    "expressions": rows("SELECT * FROM expressions"), "social_nodes": rows("SELECT * FROM social_nodes"),
                    "social_edges": rows("SELECT * FROM social_edges")}

    def import_config(self, snapshot: dict[str,Any]) -> dict[str,Any]:
        snapshot = self.migrate_config(snapshot)
        applied: dict[str, int] = {}
        with self.db() as db:
            for key, value in (snapshot.get("settings") or {}).items():
                validated = self.validate_setting(str(key), value)
                if validated is not None:
                    db.execute("INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value", (key, validated))
            applied["settings"] = len(snapshot.get("settings") or {})
            for item in snapshot.get("goals") or []:
                if item.get("title"):
                    db.execute("INSERT INTO personal_goals VALUES(?,?,?,?,?,?,?,?)", (item.get("id") or new_id("goal"), item["title"], item.get("detail", ""), item.get("kind", "growth"), item.get("status", "active"), item.get("progress", 0), item.get("created_at") or now(), item.get("updated_at") or now()))
            applied["goals"] = len(snapshot.get("goals") or [])
            for item in snapshot.get("food") or []:
                if item.get("name"):
                    db.execute("INSERT INTO food_menu VALUES(?,?,?,?,?,?)", (item.get("id") or new_id("food"), item["name"], item.get("kind", "meal"), item.get("tags", ""), item.get("note", ""), item.get("created_at") or now()))
            applied["food"] = len(snapshot.get("food") or [])
            for item in snapshot.get("skills") or []:
                if item.get("name"):
                    db.execute("INSERT INTO skills VALUES(?,?,?,?,?,?,?,?,?)", (item.get("id") or new_id("skill"), item["name"], item.get("category", "general"), int(item.get("level", 1)), item.get("keywords", ""), item.get("aliases", ""), item.get("note", ""), item.get("created_at") or now(), item.get("updated_at") or now()))
            applied["skills"] = len(snapshot.get("skills") or [])
            for item in snapshot.get("expressions") or []:
                if item.get("text"):
                    db.execute("INSERT OR IGNORE INTO expressions VALUES(?,?,?,?,?,?,?,?)", (item.get("id") or new_id("expr"), item["text"], item.get("scene", ""), item.get("scope", "public"), item.get("status", "pending"), item.get("source", "import"), item.get("created_at") or now(), item.get("reviewed_at")))
            applied["expressions"] = len(snapshot.get("expressions") or [])
            for item in snapshot.get("important_dates") or []:
                if item.get("title") and item.get("date_text"):
                    db.execute("INSERT OR IGNORE INTO important_dates VALUES(?,?,?,?,?,?,?)", (item.get("id") or new_id("date"), item["title"], item["date_text"], item.get("kind", "date"), int(item.get("repeat_yearly", 1)), item.get("note", ""), item.get("created_at") or now()))
            applied["important_dates"] = len(snapshot.get("important_dates") or [])
            self._audit_tx(db, "config_import", json.dumps(applied, ensure_ascii=False), "", "ok")
        return {"applied": applied}

    SETTING_MIGRATIONS = {"daily_limit": "proactive_daily_limit", "per_target_limit": "proactive_target_limit",
                          "quiet_from": "quiet_start", "quiet_to": "quiet_end"}

    def migrate_config(self, snapshot: dict[str,Any]) -> dict[str,Any]:
        """Normalize an imported snapshot to the current schema (idempotent)."""
        if not isinstance(snapshot, dict):
            raise ValueError("config snapshot must be an object")
        snapshot = dict(snapshot)
        version = int(snapshot.get("schema_version") or snapshot.get("version") or 1)
        settings = dict(snapshot.get("settings") or {})
        for old, new in self.SETTING_MIGRATIONS.items():
            if old in settings and new not in settings:
                settings[new] = settings.pop(old)
            elif old in settings:
                settings.pop(old, None)
        if version < 2:
            settings.setdefault("locale", "zh-CN")
        snapshot["settings"] = settings
        snapshot["schema_version"] = self.SCHEMA_VERSION
        snapshot["version"] = self.SCHEMA_VERSION
        return snapshot

    FULL_TABLES = (
        ("relationships", "relationship_accounts",
         ("user_id", "affinity", "stage", "interaction", "notes", "last_seen", "revision")),
        ("open_topics", "unfinished_topics",
         ("id", "user_id", "topic", "status", "created_at", "updated_at")),
        ("portraits", "user_portraits", ("user_id", "summary", "traits", "updated_at")),
        ("timeline", "bot_timeline", ("id", "topic", "summary", "detail", "created_at")),
        ("digests", "content_digests", ("id", "kind", "source", "title", "summary", "url", "created_at")),
        ("reviews", "daily_reviews", ("id", "date", "summary", "findings", "created_at")),
        ("journal", "journal_entries", ("id", "kind", "content", "created_at")),
    )

    def export_all(self) -> dict[str,Any]:
        """Full companion export: config + relationships + topics + timeline + journals."""
        snapshot = self.export_config()
        with self.db() as db:
            for key, table, _cols in self.FULL_TABLES:
                snapshot[key] = [dict(row) for row in db.execute(f"SELECT * FROM {table}").fetchall()]
        snapshot["scope"] = "all"
        return snapshot

    def import_all(self, snapshot: dict[str,Any]) -> dict[str,Any]:
        """Merge a full export. Existing rows win (INSERT OR IGNORE)."""
        if not isinstance(snapshot, dict):
            raise ValueError("import payload must be an object")
        self.import_config(snapshot)
        applied: dict[str, int] = {}
        with self.db() as db:
            for key, table, cols in self.FULL_TABLES:
                count = 0
                for item in snapshot.get(key) or []:
                    if not isinstance(item, dict):
                        continue
                    values = []
                    for column in cols:
                        value = item.get(column)
                        if column == "id" and not value:
                            value = new_id(key)
                        if column in ("created_at", "updated_at") and not value:
                            value = now()
                        values.append(value)
                    try:
                        db.execute(
                            f"INSERT OR IGNORE INTO {table}({','.join(cols)}) VALUES({','.join('?' for _ in cols)})",
                            tuple(values))
                        count += 1
                    except Exception:
                        continue
                applied[key] = count
        return {"applied": applied}

    def diagnostics(self) -> dict[str,Any]:
        locale = self.get_settings().get("locale", "zh-CN")
        with self.db() as db:
            def count(query: str) -> int:
                return db.execute(query).fetchone()[0]
            counts = {
                "relationships": count("SELECT COUNT(*) FROM relationship_accounts"),
                "agenda_active": count("SELECT COUNT(*) FROM calendar_events WHERE status='active'"),
                "candidates_pending": count("SELECT COUNT(*) FROM calendar_candidates WHERE status='pending_confirmation'"),
                "proactive_pending": count("SELECT COUNT(*) FROM proactive_candidates WHERE status='candidate'"),
                "groups": count("SELECT COUNT(*) FROM group_registry"),
                "journal": count("SELECT COUNT(*) FROM journal_entries WHERE kind='journal'"),
                "dreams": count("SELECT COUNT(*) FROM journal_entries WHERE kind='dream'"),
                "skills": count("SELECT COUNT(*) FROM skills"),
                "expressions_pending": count("SELECT COUNT(*) FROM expressions WHERE status='pending'"),
            }
            integrity = db.execute("PRAGMA integrity_check").fetchone()[0]
            last_audit = db.execute("SELECT created_at FROM audit_events ORDER BY created_at DESC LIMIT 1").fetchone()
        checks = [
            {"name": translate("diag.integrity", locale), "status": "ok" if integrity == "ok" else "error", "detail": integrity},
            {"name": translate("diag.pending_candidates", locale), "status": "warn" if counts["candidates_pending"] else "ok", "detail": translate("diag.detail_count", locale, count=counts["candidates_pending"])},
            {"name": translate("diag.pending_expressions", locale), "status": "warn" if counts["expressions_pending"] else "ok", "detail": translate("diag.detail_count", locale, count=counts["expressions_pending"])},
            {"name": translate("diag.pending_proactive", locale), "status": "warn" if counts["proactive_pending"] else "ok", "detail": translate("diag.detail_count", locale, count=counts["proactive_pending"])},
            {"name": translate("diag.recent_audit", locale), "status": "ok" if last_audit else "info", "detail": last_audit[0] if last_audit else translate("diag.none", locale)},
        ]
        return {"checks": checks, "counts": counts, "generated_at": now()}

    # World knowledge / reference / wardrobe (text) ------------------------
    WORLD_KINDS = ("persona", "worldview", "style", "background", "wardrobe", "reference")

    def upsert_world_knowledge(self, kind: str, title: str, content: str, tags: str = "", knowledge_id: str = "") -> dict[str,Any]:
        kind = kind if kind in self.WORLD_KINDS else "worldview"
        title, content = (title or "").strip()[:120], (content or "").strip()[:4000]
        if not title or not content:
            raise ValueError("title and content are required")
        with self.db() as db:
            existing = db.execute("SELECT 1 FROM world_knowledge WHERE id=?", (knowledge_id,)).fetchone() if knowledge_id else None
            if existing:
                db.execute("UPDATE world_knowledge SET kind=?,title=?,content=?,tags=?,updated_at=? WHERE id=?", (kind, title, content, (tags or "")[:200], now(), knowledge_id))
            else:
                knowledge_id = knowledge_id or new_id("world")
                db.execute("INSERT INTO world_knowledge VALUES(?,?,?,?,?,?,?)", (knowledge_id, kind, title, content, (tags or "")[:200], now(), now()))
            self._audit_tx(db, "world_upsert", title, knowledge_id)
            return dict(db.execute("SELECT * FROM world_knowledge WHERE id=?", (knowledge_id,)).fetchone())

    def list_world_knowledge(self, kind: str = "") -> list[dict[str,Any]]:
        with self.db() as db:
            if kind:
                return [dict(r) for r in db.execute("SELECT * FROM world_knowledge WHERE kind=? ORDER BY updated_at DESC", (kind,)).fetchall()]
            return [dict(r) for r in db.execute("SELECT * FROM world_knowledge ORDER BY kind, updated_at DESC").fetchall()]

    def delete_world_knowledge(self, knowledge_id: str) -> dict[str,Any]:
        with self.db() as db:
            cursor = db.execute("DELETE FROM world_knowledge WHERE id=?", (knowledge_id,))
            return {"deleted": bool(cursor.rowcount), "id": knowledge_id}

    def world_context(self, limit: int = 12) -> str:
        with self.db() as db:
            rows = db.execute("SELECT kind,title,content FROM world_knowledge ORDER BY updated_at DESC LIMIT ?", (max(1, min(int(limit), 50)),)).fetchall()
        if not rows:
            return ""
        return "\n".join(f"- [{row['kind']}] {row['title']}：{row['content']}" for row in rows)

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

    def journal(self, content: str, kind: str = "journal", at: str = "") -> dict[str,Any]:
        entry = {"id":new_id(kind),"at":at or now(),"content":content[:4000]}
        with self.db() as db: db.execute("INSERT INTO journal_entries VALUES(?,?,?,?)",(entry["id"],kind,entry["content"],entry["at"]))
        self.audit(kind,entry["content"],entry["id"])
        return entry

    def has_journal_for(self, day: str, kind: str = "journal") -> bool:
        """True if a journal of this kind already exists for the calendar day."""
        if not day:
            return False
        with self.db() as db:
            row = db.execute("SELECT 1 FROM journal_entries WHERE kind=? AND substr(created_at,1,10)=? LIMIT 1", (kind, day)).fetchone()
        return bool(row)

    def recent_journals(self, kind: str = "journal", limit: int = 3) -> list[dict[str,Any]]:
        with self.db() as db:
            return [dict(r) for r in db.execute(
                "SELECT content, created_at FROM journal_entries WHERE kind=? ORDER BY created_at DESC LIMIT ?", (kind, max(1, int(limit)))).fetchall()]

    def agenda_for_day(self, day: str) -> list[dict[str,Any]]:
        """All agenda events that started on a given YYYY-MM-DD (including past days)."""
        if not day:
            return []
        with self.db() as db:
            return [dict(r) for r in db.execute(
                "SELECT * FROM calendar_events WHERE substr(replace(start_at,'T',' '),1,10)=? ORDER BY start_at", (day,)).fetchall()]

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
            groups={row["group_id"]:{"mood":row["mood"],"topics":rows("SELECT topic,score FROM group_topics WHERE group_id=? ORDER BY score DESC LIMIT 12",(row["group_id"],)),"threads":rows("SELECT topic,score,status FROM group_threads WHERE group_id=? AND status='active' ORDER BY score DESC LIMIT 12",(row["group_id"],)),"messages":rows("SELECT user_id,content,created_at FROM group_observations WHERE group_id=? ORDER BY created_at DESC LIMIT 20",(row["group_id"],))} for row in db.execute("SELECT * FROM group_scenes").fetchall()}
            # Only today and upcoming events: yesterday's schedule is not shown or reused.
            agenda=rows("SELECT * FROM calendar_events WHERE start_at='' OR substr(replace(start_at,'T',' '),1,10)>=? ORDER BY start_at='' DESC, start_at ASC",(today,))
            return {"relationships":rows("SELECT * FROM relationship_accounts ORDER BY last_seen DESC"),"relationship_ledger":rows("SELECT * FROM relationship_ledger ORDER BY created_at DESC LIMIT 200"),"agenda":agenda,"calendar_candidates":rows("SELECT * FROM calendar_candidates ORDER BY created_at DESC"),"journal":rows("SELECT * FROM journal_entries WHERE kind='journal' ORDER BY created_at DESC LIMIT 50"),"dreams":rows("SELECT * FROM journal_entries WHERE kind='dream' ORDER BY created_at DESC LIMIT 50"),"audit":rows("SELECT * FROM audit_events ORDER BY created_at DESC LIMIT 200"),"groups":groups,"persona_evolution":rows("SELECT * FROM persona_evolution WHERE status='confirmed' ORDER BY updated_at DESC"),"proactive":{"candidates":rows("SELECT * FROM proactive_candidates ORDER BY updated_at DESC LIMIT 100"),"receipts":rows("SELECT * FROM proactive_receipts ORDER BY created_at DESC LIMIT 100")},"important_dates":rows("SELECT * FROM important_dates ORDER BY date_text"),"goals":rows("SELECT * FROM personal_goals ORDER BY updated_at DESC"),"food":rows("SELECT * FROM food_menu ORDER BY created_at DESC"),"word_cloud":rows("SELECT topic, SUM(score) AS score FROM group_topics GROUP BY topic ORDER BY score DESC LIMIT 60"),"skills":rows("SELECT * FROM skills ORDER BY level DESC, updated_at DESC"),"expressions":rows("SELECT * FROM expressions ORDER BY created_at DESC LIMIT 300"),"social_nodes":rows("SELECT * FROM social_nodes ORDER BY updated_at DESC"),"social_edges":rows("SELECT * FROM social_edges ORDER BY created_at DESC"),"settings":{r["key"]: r["value"] for r in db.execute("SELECT key,value FROM settings").fetchall()},"world":rows("SELECT * FROM world_knowledge ORDER BY kind, updated_at DESC"),"timeline":rows("SELECT * FROM bot_timeline ORDER BY created_at DESC LIMIT 100"),"open_topics":rows("SELECT * FROM unfinished_topics WHERE status='open' ORDER BY updated_at DESC LIMIT 100"),"portraits":rows("SELECT * FROM user_portraits ORDER BY updated_at DESC"),"reviews":rows("SELECT * FROM daily_reviews ORDER BY date DESC LIMIT 14")}

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
            "role": self.user_role(user_id),
            "expression": self.relationship_expression(user_id),
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
