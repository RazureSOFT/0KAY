"""Bilibili account integration (unofficial web API).

Bilibili is not a standard bot protocol like OneBot: authentication is a login
Cookie (SESSDATA / bili_jct / DedeUserID), and there is no push channel, so
private messages, @/reply/like notifications and the follow feed must be polled.

This module owns the *account store* and a stateless HTTP client bound to one
account's cookies. A runtime (separate) polls it and writes the traffic into the
same transcript (`chatlog.db`) the social sidebar reads, so Bilibili chats show
up next to QQ ones.

Endpoints are the community-reversed ones; Bilibili's WBI signature is applied
to the endpoints that require it.
"""
from __future__ import annotations

import hashlib
import json
import os
import re
import threading
import time
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Optional
from urllib.parse import urlencode

import httpx

from ..logging_setup import get_logger

logger = get_logger("bilibili")

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/122.0 Safari/537.36")

QR_GEN = "https://passport.bilibili.com/x/passport-login/web/qrcode/generate"
QR_POLL = "https://passport.bilibili.com/x/passport-login/web/qrcode/poll"
NAV = "https://api.bilibili.com/x/web-interface/nav"

# WBI mixin key permutation table (fixed, from the web player).
MIXIN_KEY_ENC_TAB = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
    33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
    61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
    36, 20, 34, 44, 52,
]


def _now() -> str:
    return datetime.now().isoformat()


def new_account_id() -> str:
    return f"bili_{uuid.uuid4().hex[:12]}"


def parse_cookie_string(raw: str) -> dict:
    """Turn a `name=value; name2=value2` header into a dict."""
    out: dict[str, str] = {}
    for part in str(raw or "").split(";"):
        if "=" not in part:
            continue
        key, _, value = part.partition("=")
        key = key.strip()
        if key:
            out[key] = value.strip()
    return out


def cookies_from_response(response: httpx.Response) -> dict:
    """Merge every Set-Cookie the login handshake returned."""
    jar: dict[str, str] = {}
    for value in response.headers.get_list("set-cookie"):
        first = value.split(";", 1)[0]
        if "=" in first:
            key, _, val = first.partition("=")
            jar[key.strip()] = val.strip()
    return jar


def wbi_sign(params: dict, img_key: str, sub_key: str) -> dict:
    """Append wts + w_rid (WBI) to a params dict, mutating and returning it."""
    combined = img_key + sub_key
    mixin = "".join(combined[i] for i in MIXIN_KEY_ENC_TAB if i < len(combined))[:32]
    params = dict(params)
    params["wts"] = int(time.time())
    ordered = {k: params[k] for k in sorted(params) if k not in ("w_rid", "wts")}
    query = urlencode({**ordered, "wts": params["wts"]}, safe="")
    params["w_rid"] = hashlib.md5((query + mixin).encode()).hexdigest()
    return params


@dataclass
class BilibiliAccount:
    """One logged-in Bilibili account (its cookies)."""

    id: str = field(default_factory=new_account_id)
    name: str = ""
    enabled: bool = True
    sessdata: str = ""
    bili_jct: str = ""
    dede_user_id: str = ""
    uid: str = ""
    uname: str = ""
    created_at: str = field(default_factory=_now)

    @classmethod
    def from_dict(cls, data: dict) -> "BilibiliAccount":
        data = data or {}
        acct = cls()
        for key in ("id", "name", "sessdata", "bili_jct", "dede_user_id", "uid", "uname"):
            if data.get(key) is not None:
                setattr(acct, key, str(data[key]))
        acct.enabled = bool(data.get("enabled", True))
        acct.created_at = str(data.get("created_at") or acct.created_at)
        return acct

    def to_dict(self) -> dict:
        return asdict(self)

    def public_dict(self) -> dict:
        """Redacted view for the UI: never leaks the cookies."""
        return {"id": self.id, "name": self.name, "enabled": self.enabled,
                "uid": self.uid, "uname": self.uname,
                "has_cookie": bool(self.sessdata), "created_at": self.created_at}

    def cookies(self) -> dict:
        jar = {"SESSDATA": self.sessdata, "bili_jct": self.bili_jct,
               "DedeUserID": self.dede_user_id}
        return {k: v for k, v in jar.items() if v}

    def validate(self) -> list:
        problems = []
        if not str(self.sessdata or "").strip():
            problems.append("缺少 SESSDATA Cookie")
        return problems


class BilibiliStore:
    """Load/save the Bilibili accounts (data_dir/bilibili.json)."""

    def __init__(self, data_dir: str):
        self.path = Path(data_dir) / "bilibili.json"
        self._lock = threading.RLock()
        self.accounts: list[BilibiliAccount] = []
        self._load()

    def _load(self) -> None:
        try:
            raw = json.loads(self.path.read_text(encoding="utf-8"))
        except (OSError, ValueError):
            raw = {}
        self.accounts = [BilibiliAccount.from_dict(a) for a in (raw.get("accounts") or [])]

    def _save(self) -> None:
        with self._lock:
            payload = {"accounts": [a.to_dict() for a in self.accounts], "updated_at": _now()}
            tmp = self.path.with_suffix(".json.tmp")
            tmp.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
            os.replace(tmp, self.path)

    def list(self) -> list:
        return [a.public_dict() for a in self.accounts]

    def get(self, account_id: str) -> Optional[BilibiliAccount]:
        for a in self.accounts:
            if a.id == account_id:
                return a
        return None

    def upsert(self, payload: dict) -> dict:
        payload = dict(payload or {})
        account_id = str(payload.get("id") or "")
        existing = self.get(account_id) if account_id else None
        merged = dict(existing.to_dict()) if existing else {}
        # A blank cookie on edit must not wipe the stored one.
        if existing is not None and not str(payload.get("sessdata") or "").strip():
            payload.pop("sessdata", None)
            payload.pop("bili_jct", None)
            payload.pop("dede_user_id", None)
        merged.update({k: v for k, v in payload.items() if v is not None})
        if not account_id:
            merged["id"] = new_account_id()
        account = BilibiliAccount.from_dict(merged)
        if not account.name:
            account.name = account.uname or account.uid or "Bilibili"
        problems = account.validate()
        if problems:
            return {"ok": False, "error": "；".join(problems)}
        with self._lock:
            if existing is None:
                self.accounts.append(account)
            else:
                self.accounts[self.accounts.index(existing)] = account
            self._save()
        return {"ok": True, "account": account.public_dict()}

    def delete(self, account_id: str) -> dict:
        with self._lock:
            account = self.get(account_id)
            if account is None:
                return {"ok": False, "error": "找不到该账号"}
            self.accounts.remove(account)
            self._save()
        return {"ok": True}


# --- HTTP client (stateless; bound to one account's cookies) ---------------
class BilibiliClient:
    """Thin wrapper over the reverse-engineered web endpoints."""

    def __init__(self, cookies: dict, timeout: float = 15.0):
        self.cookies = dict(cookies or {})
        self.timeout = timeout
        self._wbi: tuple[str, str] | None = None

    def _headers(self) -> dict:
        return {"User-Agent": UA, "Referer": "https://www.bilibili.com/"}

    async def _wbi_keys(self) -> tuple[str, str]:
        if self._wbi:
            return self._wbi
        async with httpx.AsyncClient(headers=self._headers(), cookies=self.cookies, timeout=self.timeout) as c:
            data = (await c.get(NAV)).json()
        wbi = ((data.get("data") or {}).get("wbi_img") or {})
        img = re.search(r"/([^/]+)\.png", wbi.get("img_url", ""))
        sub = re.search(r"/([^/]+)\.png", wbi.get("sub_url", ""))
        self._wbi = (img.group(1) if img else "", sub.group(1) if sub else "")
        return self._wbi

    async def _get(self, url: str, params: dict | None = None, *, wbi: bool = False) -> dict:
        params = dict(params or {})
        if wbi:
            img, sub = await self._wbi_keys()
            params = wbi_sign(params, img, sub)
        async with httpx.AsyncClient(headers=self._headers(), cookies=self.cookies, timeout=self.timeout) as c:
            data = (await c.get(url, params=params)).json()
        if data.get("code", 0) != 0:
            raise RuntimeError(f"bilibili {data.get('code')}: {data.get('message')}")
        return data.get("data") or {}

    async def nav(self) -> dict:
        return await self._get(NAV)

    async def fetch_sessions(self) -> list:
        url = "https://api.vc.bilibili.com/session_svr/v1/session_svr/get_sessions"
        data = await self._get(url, {"session_type": 1, "group_id": 0, "sort_rule": 2, "build": 0, "mobi_app": "web"})
        return data.get("session_list") or []

    async def fetch_messages(self, talker_id: str, size: int = 20) -> list:
        url = "https://api.vc.bilibili.com/svr_sync/v1/svr_sync/fetch_session_msgs"
        data = await self._get(url, {"talker_id": talker_id, "session_type": 1, "size": size})
        return data.get("messages") or []

    async def send_message(self, uid: str, text: str) -> dict:
        url = "https://api.vc.bilibili.com/web_im/v1/web_im/send_msg"
        form = {
            "msg[sender_uid]": str(self.cookies.get("DedeUserID", "")),
            "msg[receiver_id]": str(uid),
            "msg[receiver_type]": "1",
            "msg[msg_type]": "1",
            "msg[content]": json.dumps({"content": text}, ensure_ascii=False),
            "csrf": str(self.cookies.get("bili_jct", "")),
        }
        async with httpx.AsyncClient(headers=self._headers(), cookies=self.cookies, timeout=self.timeout) as c:
            data = (await c.post(url, data=form)).json()
        if data.get("code", 0) != 0:
            raise RuntimeError(f"bilibili 发送失败 {data.get('code')}: {data.get('message')}")
        return data.get("data") or {}

    async def fetch_msgfeed(self, kind: str) -> list:
        url = f"https://api.bilibili.com/x/msgfeed/{kind}"
        data = await self._get(url, {"platform": "web", "build": 0, "mobi_app": "web"})
        return (data.get("items") or [])

    async def fetch_feed(self) -> list:
        url = "https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/all"
        data = await self._get(url, {"type": "all"}, wbi=True)
        return (data.get("items") or [])


async def qr_generate() -> dict:
    async with httpx.AsyncClient(headers={"User-Agent": UA}, timeout=15) as c:
        data = (await c.get(QR_GEN)).json()
    d = data.get("data") or {}
    return {"url": d.get("url", ""), "qrcode_key": d.get("qrcode_key", "")}


async def qr_poll(qrcode_key: str) -> dict:
    """Poll the login QR. Returns {status, cookies}. status: pending|scanned|ok|expired."""
    async with httpx.AsyncClient(headers={"User-Agent": UA}, timeout=15) as c:
        resp = await c.get(QR_POLL, params={"qrcode_key": qrcode_key})
        data = resp.json().get("data") or {}
        code = data.get("code", -1)
        if code == 0:
            return {"status": "ok", "cookies": cookies_from_response(resp)}
        if code == 86090:
            return {"status": "scanned", "cookies": {}}
        if code == 86101:
            return {"status": "pending", "cookies": {}}
        return {"status": "expired", "cookies": {}}
