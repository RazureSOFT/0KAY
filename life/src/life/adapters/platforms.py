"""Message-platform instances: several bots, each with its own transport.

The old model was one implicit OneBot connection whose connection details came
from the Core settings document (``onebot_ws_url`` / ``onebot_http_url`` /
``onebot_access_token``). That cannot express what a user actually wants —
several bots on different platforms, several accounts on *the same* platform,
each independently enabled and independently bound to a persona config.

This module adds the instance layer:

* :class:`AdapterInstance` — one configured bot (platform, name, enabled,
  credentials, reverse-WS bind, config binding).
* :class:`AdapterRegistry` — CRUD + persistence for those instances, plus the
  legacy migration so an existing single-OneBot install keeps working.
* :class:`ReverseWSServer` — the transport. LIFE is the **server** side: NapCat
  (or any OneBot v11 client) dials in, as in AstrBot.

Direction note: the old adapter dialled *out* to OneBot's WebSocket. This one
listens, which is what ``napcat``/``aiocqhttp`` deployments expect and what lets
a single LIFE host several bots behind one port.
"""
from __future__ import annotations

import asyncio
import json
import ipaddress
import os
import secrets
import uuid
from dataclasses import asdict, dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Callable, Optional
from urllib.parse import parse_qs, urlsplit

try:  # pragma: no cover - websockets >= 12 exposes the server class here
    from websockets.asyncio.server import serve as ws_serve
except ImportError:  # pragma: no cover - older websockets
    from websockets.server import serve as ws_serve  # type: ignore

from ..logging_setup import get_logger

logger = get_logger("adapters.platforms")

#: Platform categories the UI may offer. Only ``aiocqhttp`` is implemented;
#: the rest are declared so an instance row survives a round-trip unchanged
#: instead of silently losing its platform on save.
KNOWN_PLATFORMS = ("aiocqhttp", "qq_official", "wecom", "lark", "discord", "telegram")

IMPLEMENTED_PLATFORMS = ("aiocqhttp",)

DEFAULT_REVERSE_WS_HOST = "127.0.0.1"
DEFAULT_REVERSE_WS_PORT = 6199


def _now() -> str:
    return datetime.now().isoformat()


def new_instance_id() -> str:
    return f"adp_{uuid.uuid4().hex[:12]}"


def _is_blank_port(value) -> bool:
    """True when a form value means "not filled in yet" rather than "port zero".

    ``0``, ``""`` and ``None`` all mean "auto-assign" coming from a UI; anything
    else is a real value and must go through validation untouched.
    """
    if value is None:
        return True
    if isinstance(value, str) and not value.strip():
        return True
    try:
        return int(value) == 0
    except (TypeError, ValueError):
        return False


def load_json(path: Path, default):
    """Read a JSON file, returning ``default`` on anything unexpected.

    A corrupted adapters file must not stop the process from booting: the worst
    case is the user re-enters their bot settings, not a dead plugin.
    """
    try:
        with open(path, encoding="utf-8") as handle:
            loaded = json.load(handle)
        return loaded if isinstance(loaded, type(default)) else default
    except (OSError, ValueError):
        return default


def save_json(path: Path, payload) -> None:
    """Atomically write JSON: a crash mid-write must not truncate the file."""
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    with open(temporary, "w", encoding="utf-8") as handle:
        json.dump(payload, handle, ensure_ascii=False, indent=2)
    os.replace(temporary, path)


@dataclass
class AdapterInstance:
    """One configured message-platform bot."""

    id: str = field(default_factory=new_instance_id)
    name: str = ""
    platform: str = "aiocqhttp"
    enabled: bool = False
    #: Reverse WebSocket bind. LIFE listens here; the platform client connects.
    ws_host: str = DEFAULT_REVERSE_WS_HOST
    ws_port: int = DEFAULT_REVERSE_WS_PORT
    #: Token the client must present. Empty disables verification, matching the
    #: "未设置则不启用 Token 验证" behaviour users expect from the reference UI.
    ws_token: str = ""
    #: Outbound HTTP API of the client (e.g. NapCat's http server). When empty,
    #: sending falls back to the reverse-WS connection itself.
    http_url: str = ""
    access_token: str = ""
    #: Which persona/config this bot speaks with; matched per session.
    config_id: str = "default"
    trigger_keywords: list = field(default_factory=list)
    observe_group: bool = True
    chunk_delay: float = 0.0
    message_delay: float = 0.0
    created_at: str = field(default_factory=_now)

    @classmethod
    def from_dict(cls, data: dict) -> "AdapterInstance":
        data = data or {}
        instance = cls()
        for key in ("id", "name", "platform", "ws_host", "ws_token", "http_url",
                    "access_token", "config_id"):
            if data.get(key) is not None:
                setattr(instance, key, str(data[key]))
        for key in ("enabled", "observe_group"):
            if key in data:
                setattr(instance, key, bool(data[key]))
        if "ws_port" in data and data["ws_port"] is not None:
            # Keep the raw value when it is not a number so ``validate`` can tell
            # the user their port is unparseable; coercing to a default here
            # would hide the typo and silently bind somewhere they did not choose.
            instance.ws_port = data["ws_port"]
        if isinstance(data.get("trigger_keywords"), (list, tuple)):
            instance.trigger_keywords = [str(item) for item in data["trigger_keywords"] if str(item).strip()]
        instance.created_at = str(data.get("created_at") or instance.created_at)
        return instance

    def to_dict(self) -> dict:
        data = asdict(self)
        # Never let a credential leave the process except to the dashboard, which
        # needs it to render the field. The panel is the owner, so this is the
        # same trust boundary the old single-token setting had.
        return data

    def public_dict(self) -> dict:
        """Redacted view for logs and diagnostics."""
        return {"id": self.id, "name": self.name, "platform": self.platform,
                "enabled": self.enabled, "ws_host": self.ws_host, "ws_port": self.ws_port,
                "config_id": self.config_id,
                "ws_token": "", "has_ws_token": bool(self.ws_token),
                "access_token": "", "has_access_token": bool(self.access_token),
                "trigger_keywords": list(self.trigger_keywords),
                "observe_group": self.observe_group,
                "http_url": self.http_url}

    def validate(self) -> list:
        """Return a list of human-readable problems ([] when the row is usable)."""
        problems = []
        if not str(self.name or "").strip():
            problems.append("机器人名称不能为空")
        if self.platform not in KNOWN_PLATFORMS:
            problems.append(f"未知的消息平台类别：{self.platform}")
        elif self.platform not in IMPLEMENTED_PLATFORMS:
            problems.append(f"平台 {self.platform} 尚未实现")
        if not str(self.ws_host or "").strip():
            problems.append("反向 WebSocket 主机不能为空")
        if not self.bind_authorized():
            problems.append("非本机监听必须配置非空 Token")
        try:
            port = int(self.ws_port)
        except (TypeError, ValueError):
            problems.append("反向 WebSocket 端口必须是数字")
        else:
            if not (1 <= port <= 65535):
                problems.append("反向 WebSocket 端口必须在 1-65535 之间")
        return problems

    def bind_authorized(self) -> bool:
        if str(self.ws_token or "").strip():
            return True
        try:
            return ipaddress.ip_address(self.ws_host).is_loopback
        except ValueError:
            return self.ws_host == "localhost"


@dataclass
class SessionRoute:
    """One rule mapping a conversation to a persona config.

    ``*`` matches everything; otherwise the pattern is matched against the
    session id (``/sid`` in the reference UI). Rules are evaluated top to bottom
    and the first match wins; no match falls back to the default config.

    The pattern key is accepted under several names because callers reasonably
    reach for different words ("session"/"session_id"/"session_pattern"/
    "match"/"source"). Anything else is treated as a malformed row and dropped
    by :meth:`from_dict` returning ``None`` -- see there for why silently
    defaulting to ``*`` would be dangerous.
    """

    #: Keys callers may use for the matching pattern, in priority order.
    PATTERN_KEYS = ("pattern", "session", "session_id", "session_pattern", "match", "source")

    pattern: str = "*"
    config_id: str = "default"

    @classmethod
    def from_dict(cls, data: dict) -> "SessionRoute | None":
        """Build a route, or return ``None`` when the row carries no pattern.

        Returning ``None`` (rather than a ``"*"`` wildcard) matters: a wildcard
        matches every conversation and, because rules are first-match-wins, a
        single malformed leading row would swallow the whole table and pin
        every session to one persona. Dropping the row instead degrades to the
        default config, which is what the UI promises for "no match".
        """
        data = data or {}
        pattern = None
        for key in cls.PATTERN_KEYS:
            if data.get(key) is not None:
                pattern = str(data[key])
                break
        if pattern is None or not pattern.strip():
            return None
        return cls(pattern=pattern.strip(),
                   config_id=str(data.get("config_id") or data.get("config") or "default").strip() or "default")

    def to_dict(self) -> dict:
        return {"pattern": self.pattern, "config_id": self.config_id}

    def matches(self, session_id: str) -> bool:
        pattern = str(self.pattern or "*").strip()
        if pattern in ("", "*", "全部消息", "全部会话"):
            return True
        session = str(session_id or "")
        if pattern.startswith("/") and pattern.endswith("/") and len(pattern) > 2:
            import re
            try:
                return re.search(pattern[1:-1], session) is not None
            except re.error:
                return False
        if pattern.endswith("*"):
            return session.startswith(pattern[:-1])
        return session == pattern


class AdapterRegistry:
    """Load/save/mutate the adapter instances and session routes."""

    def __init__(self, data_dir: str):
        self.path = Path(data_dir) / "adapters.json"
        self._lock = asyncio.Lock()
        self.instances: list[AdapterInstance] = []
        self.routes: list[SessionRoute] = []
        self.default_config_id = "default"
        self.legacy_session_instance = ""
        #: Pre-fill for a newly-created instance. Overridable from the Core
        #: settings document so the panel's defaults come from one place.
        self.default_host = DEFAULT_REVERSE_WS_HOST
        self.default_port = DEFAULT_REVERSE_WS_PORT
        self._load()

    # -- persistence -------------------------------------------------------
    def _load(self) -> None:
        raw = load_json(self.path, {}) or {}
        self.instances = [AdapterInstance.from_dict(item) for item in (raw.get("instances") or [])]
        self.routes = [r for r in (SessionRoute.from_dict(item) for item in (raw.get("routes") or [])) if r is not None]
        self.default_config_id = str(raw.get("default_config_id") or "default")
        # Preserve old single-bot histories for exactly their original owner.
        # Multi-bot legacy data is ambiguous and is never shared automatically.
        self.legacy_session_instance = str(raw.get("legacy_session_instance") or "")
        if "legacy_session_instance" not in raw and len(self.instances) == 1:
            self.legacy_session_instance = self.instances[0].id
            self._save()
        if not self.instances:
            migrated = self._migrate_legacy_env()
            if migrated is not None:
                self.instances = [migrated]
                self.legacy_session_instance = migrated.id
                self._save()

    def _migrate_legacy_env(self) -> Optional[AdapterInstance]:
        """Turn a pre-existing env-configured OneBot into an instance row.

        Without this, an install that already had ``ONEBOT_*`` set would come up
        with its bot silently missing — the old settings path is replaced, not
        layered, so the migration has to happen once and persist.
        """
        ws_url = os.getenv("ONEBOT_WS_URL", "").strip()
        if not ws_url:
            return None
        instance = AdapterInstance(
            name="OneBot (迁移自环境变量)",
            platform="aiocqhttp",
            enabled=True,
            ws_host=DEFAULT_REVERSE_WS_HOST,
            ws_port=DEFAULT_REVERSE_WS_PORT,
            ws_token=os.getenv("ONEBOT_ACCESS_TOKEN", "").strip(),
            http_url=os.getenv("ONEBOT_HTTP_URL", "").strip(),
            access_token=os.getenv("ONEBOT_ACCESS_TOKEN", "").strip(),
        )
        logger.info("migrated legacy ONEBOT_WS_URL configuration into adapter %s", instance.id)
        return instance

    def _save(self) -> None:
        save_json(self.path, {
            "instances": [item.to_dict() for item in self.instances],
            "routes": [item.to_dict() for item in self.routes],
            "default_config_id": self.default_config_id,
            "legacy_session_instance": self.legacy_session_instance,
            "updated_at": _now(),
        })

    # -- CRUD --------------------------------------------------------------
    def list(self) -> list:
        return [item.public_dict() | {"id": item.id} for item in self.instances]

    def get(self, instance_id: str) -> Optional[AdapterInstance]:
        for item in self.instances:
            if item.id == instance_id:
                return item
        return None

    def upsert(self, payload: dict) -> dict:
        """Create (no id) or update (id) one instance. Never raises for user input."""
        payload = dict(payload or {})
        instance_id = str(payload.get("id") or "")
        existing = self.get(instance_id) if instance_id else None
        merged = dict(existing.to_dict()) if existing else {}
        merged.update({key: value for key, value in payload.items() if value is not None})
        if not instance_id:
            merged["id"] = new_instance_id()
        instance = AdapterInstance.from_dict(merged)
        # A brand-new row inherits the configured defaults rather than the
        # hardcoded ones, so "反向 WebSocket 主机/端口" in the settings panel
        # actually controls what the panel pre-fills. A new port must also not
        # collide with an existing bot: pick the next free one so two can coexist.
        #
        # Host is defaulted strictly on *absence*: a user who deliberately clears
        # it to "" is saying "no host", and silently swapping in 0.0.0.0 would
        # open a listener on every interface they did not ask for.
        #
        # Port accepts absence *or* 0/"" as "auto-assign": a form that has not
        # been filled in yet sends 0, and rejecting that would make "add a bot"
        # fail on the very first click. A non-empty garbage value ("abc", -1,
        # 99999) is still surfaced as an error rather than silently replaced.
        if existing is None:
            if "ws_host" not in payload:
                instance.ws_host = self.default_host
            if "ws_port" not in payload or _is_blank_port(payload.get("ws_port")):
                instance.ws_port = self._next_free_port()
        elif _is_blank_port(payload.get("ws_port")):
            # Editing an existing row with the port field momentarily blank must
            # not move a live listener to port 0; keep what it was bound to.
            instance.ws_port = existing.ws_port
        problems = instance.validate()
        if problems:
            return {"ok": False, "error": "；".join(problems), "problems": problems}
        if existing is None:
            self.instances.append(instance)
        else:
            self.instances[self.instances.index(existing)] = instance
        self._save()
        return {"ok": True, "instance": instance.to_dict()}

    def _next_free_port(self) -> int:
        used = {int(item.ws_port) for item in self.instances}
        port = int(self.default_port)
        while port in used and port < 65535:
            port += 1
        return port

    def delete(self, instance_id: str) -> dict:
        instance = self.get(instance_id)
        if instance is None:
            return {"ok": False, "error": "找不到该适配器"}
        self.instances.remove(instance)
        self._save()
        return {"ok": True}

    def set_enabled(self, instance_id: str, enabled: bool) -> dict:
        instance = self.get(instance_id)
        if instance is None:
            return {"ok": False, "error": "找不到该适配器"}
        if enabled and not instance.bind_authorized():
            return {"ok": False, "error": "非本机监听必须配置非空 Token"}
        instance.enabled = bool(enabled)
        self._save()
        return {"ok": True, "instance": instance.to_dict()}

    # -- session -> config routing ----------------------------------------
    def set_routes(self, routes: list) -> dict:
        parsed = [SessionRoute.from_dict(item) for item in (routes or [])]
        # Drop malformed rows instead of turning them into wildcards, and tell
        # the caller how many were rejected so the UI can warn rather than
        # silently saving a table that routes everything to one persona.
        self.routes = [r for r in parsed if r is not None]
        skipped = len(parsed) - len(self.routes)
        self._save()
        result = {"ok": True, "routes": [item.to_dict() for item in self.routes]}
        if skipped:
            result["skipped"] = skipped
            result["warning"] = f"{skipped} 条规则缺少会话匹配条件，已忽略"
        return result

    def set_default_config(self, config_id: str) -> dict:
        self.default_config_id = str(config_id or "default")
        self._save()
        return {"ok": True, "default_config_id": self.default_config_id}

    def config_for_session(self, session_id: str) -> str:
        """First matching rule wins; unmatched sessions use the default config."""
        for route in self.routes:
            if route.matches(session_id):
                return route.config_id
        return self.default_config_id


class ReverseWSServer:
    """One reverse-WebSocket server for one adapter instance.

    The platform client (NapCat) is expected to connect to
    ``ws://<host>:<port>`` and speak OneBot v11 over it, exactly as it would
    against AstrBot. LIFE accepts the connection, verifies the token, and feeds
    each event into the same handler the old outbound adapter used.
    """

    #: Bound so a stalled/hostile client cannot hold the process open.
    CLOSE_TIMEOUT = 5.0

    def __init__(self, instance: AdapterInstance, event_handler: Callable):
        self.instance = instance
        self.event_handler = event_handler
        self._server = None
        self._clients: set = set()
        self._running = False
        #: ``event_id -> Future`` for outbound API calls awaiting a reply.
        self._pending: dict = {}
        self._echo_seq = 0
        self._event_queue = asyncio.Queue(maxsize=128)
        self._worker = None

    @property
    def address(self) -> str:
        return f"{self.instance.ws_host}:{self.instance.ws_port}"

    def _token_ok(self, path: str, headers) -> bool:
        """Verify the reverse-WS token.

        Clients vary: some put it in the query string, some in an
        ``Authorization: Bearer`` header. Empty token = verification disabled.
        """
        expected = str(self.instance.ws_token or "").strip()
        if not expected:
            return True
        query = parse_qs(urlsplit(path or "").query)
        for key in ("access_token", "token"):
            if secrets.compare_digest(str((query.get(key) or [""])[0]), expected):
                return True
        header = ""
        try:
            header = str(headers.get("Authorization") or "")
        except AttributeError:
            pass
        if header.lower().startswith("bearer "):
            header = header[7:]
        return bool(header) and secrets.compare_digest(header, expected)

    async def _on_connect(self, websocket):
        path = getattr(getattr(websocket, "request", None), "path", "") or ""
        headers = getattr(getattr(websocket, "request", None), "headers", {}) or {}
        if not self._token_ok(path, headers):
            logger.warning("adapter %s: rejected a connection with a bad token", self.instance.id)
            await websocket.close(code=1008, reason="invalid token")
            return
        self._clients.add(websocket)
        logger.info("adapter %s: client connected (%d online)", self.instance.id, len(self._clients))
        try:
            async for raw in websocket:
                try:
                    data = json.loads(raw)
                except (TypeError, ValueError):
                    continue
                await self._dispatch(data, websocket)
        except Exception as error:
            logger.debug("adapter %s: connection ended: %s", self.instance.id, error)
        finally:
            self._clients.discard(websocket)
            logger.info("adapter %s: client disconnected (%d online)", self.instance.id, len(self._clients))

    async def _dispatch(self, data: dict, websocket) -> None:
        """A response to one of our API calls, or an inbound event."""
        if not isinstance(data, dict):
            return
        echo = data.get("echo")
        if echo is not None and echo in self._pending:
            future = self._pending.pop(echo)
            if not future.done():
                future.set_result(data)
            return
        if data.get("post_type"):
            try:
                self._event_queue.put_nowait(data)
            except asyncio.QueueFull:
                await websocket.close(code=1013, reason="event queue full")

    async def _process_events(self):
        # Serialize turns per adapter while the reader keeps resolving echoes.
        while True:
            data = await self._event_queue.get()
            try:
                await self.event_handler(data, self)
            except Exception as error:
                logger.warning("adapter %s: event handling failed: %s", self.instance.id, error)
            finally:
                self._event_queue.task_done()

    async def start(self) -> bool:
        if self._running:
            return False
        if not self.instance.bind_authorized():
            logger.error("adapter %s: non-loopback listener requires a token", self.instance.id)
            return False
        try:
            self._server = await ws_serve(
                self._on_connect,
                self.instance.ws_host,
                int(self.instance.ws_port),
                ping_interval=30,
                ping_timeout=60,
            )
        except OSError as error:
            logger.error("adapter %s: cannot listen on %s: %s", self.instance.id, self.address, error)
            return False
        self._running = True
        self._worker = asyncio.create_task(self._process_events())
        logger.info("adapter %s (%s) listening on ws://%s", self.instance.id, self.instance.name, self.address)
        return True

    async def stop(self) -> None:
        self._running = False
        if self._worker is not None:
            self._worker.cancel()
            await asyncio.gather(self._worker, return_exceptions=True)
            self._worker = None
        for future in self._pending.values():
            future.cancel()
        self._pending.clear()
        for client in list(self._clients):
            try:
                await asyncio.wait_for(client.close(), timeout=self.CLOSE_TIMEOUT)
            except Exception:  # pragma: no cover - best effort
                pass
        self._clients.clear()
        if self._server is not None:
            self._server.close()
            try:
                await self._server.wait_closed()
            except Exception:  # pragma: no cover - best effort
                pass
            self._server = None

    @property
    def connected(self) -> bool:
        return bool(self._clients)

    # -- outbound API over the reverse connection -------------------------
    async def call_api(self, action: str, payload: dict, timeout: float = 20.0) -> dict:
        """Call a OneBot API action over the reverse WebSocket.

        Used when no outbound ``http_url`` is configured: the reverse socket is
        bidirectional, so the server can send an action frame and await the
        matching ``echo``. This is what lets a NapCat dial-in deployment send
        messages at all without exposing an HTTP port.
        """
        if not self._clients:
            raise RuntimeError("没有已连接的消息平台客户端")
        self._echo_seq += 1
        echo = f"life-{self._echo_seq}"
        frame = json.dumps({"action": action, "params": payload or {}, "echo": echo})
        future: asyncio.Future = asyncio.get_running_loop().create_future()
        self._pending[echo] = future
        try:
            # Broadcast: a reverse-WS client commonly opens several connections
            # (one per event class); any of them can carry the reply.
            sent = False
            for client in list(self._clients):
                try:
                    await client.send(frame)
                    sent = True
                except Exception:
                    continue
            if not sent:
                raise RuntimeError("没有可用的消息平台连接")
            response = await asyncio.wait_for(future, timeout=timeout)
        except asyncio.TimeoutError as error:
            self._pending.pop(echo, None)
            raise RuntimeError(f"消息平台无响应（{action} 超时）") from error
        finally:
            self._pending.pop(echo, None)
        if response.get("status") == "failed" or response.get("retcode") not in (0, None):
            raise RuntimeError(f"消息平台拒绝 {action}: {response.get('message') or response}")
        return response.get("data") or {}


class AdapterRuntime:
    """Owns every configured instance's server and routes outbound sends.

    Outbound routing must be explicit about *which* bot speaks: a user with a
    work QQ and a personal QQ expects a proactive message to arrive from the
    account that was talking. ``resolve`` therefore matches the session id
    (``qq_group_123`` / ``qq_456``) to the instance whose client is connected,
    falling back to any connected instance only when nothing matches.
    """

    def __init__(self, registry: AdapterRegistry, event_handler: Callable):
        self.registry = registry
        self.event_handler = event_handler
        self.servers: dict[str, ReverseWSServer] = {}
        #: ``(platform, self_id) -> instance_id`` learned from inbound events.
        self._self_ids: dict = {}
        #: Master gate. When False, ``sync`` stops every server regardless of the
        #: per-instance toggles, so one switch can silence all bots.
        self.enabled: bool = True

    async def sync(self) -> dict:
        """Start/stop/restart servers so they match the registry. Idempotent."""
        wanted = ({item.id: item for item in self.registry.instances if item.enabled}
                  if self.enabled else {})
        started, stopped, failed = [], [], []

        for instance_id in list(self.servers):
            if instance_id not in wanted:
                await self.servers.pop(instance_id).stop()
                stopped.append(instance_id)

        for instance_id, instance in wanted.items():
            running = self.servers.get(instance_id)
            if running is not None:
                if (running.instance.ws_host, running.instance.ws_port) != (instance.ws_host, int(instance.ws_port)):
                    # Bind changed: the old socket must be released first.
                    await running.stop()
                    self.servers.pop(instance_id, None)
                    running = None
                elif running.instance.ws_token != instance.ws_token:
                    # Existing authenticated sockets must not survive rotation.
                    await running.stop()
                    self.servers.pop(instance_id, None)
                    running = None
                else:
                    running.instance = instance  # keep settings fresh (keywords…)
                    continue
            server = ReverseWSServer(instance, self.event_handler)
            if await server.start():
                self.servers[instance_id] = server
                started.append(instance_id)
            else:
                failed.append(instance_id)
        return {"started": started, "stopped": stopped, "failed": failed,
                "running": list(self.servers)}

    async def stop_all(self) -> None:
        for server in self.servers.values():
            await server.stop()
        self.servers.clear()

    def note_self_id(self, instance_id: str, self_id: object, platform: str = "aiocqhttp") -> None:
        if self_id:
            self._self_ids[(platform, str(self_id))] = instance_id

    def resolve(self, session_id: str = "", platform: str = "aiocqhttp", self_id: object = "") -> Optional[ReverseWSServer]:
        """The server to send through for a given conversation."""
        if session_id.startswith("group:"):
            session_id = session_id[6:]
        if session_id.startswith("bot:"):
            return self.servers.get(session_id.split(":", 2)[1])
        owner = self.registry.legacy_session_instance
        if session_id.startswith(("qq_", "group:qq_")) and owner:
            return self.servers.get(owner)
        if self_id:
            instance_id = self._self_ids.get((platform, str(self_id)))
            if instance_id and instance_id in self.servers:
                return self.servers[instance_id]
        # ``qq_<user>`` / ``qq_group_<group>`` carry no bot identity, so fall back
        # to the only connected bot when there is exactly one. With several, the
        # caller must pass self_id (the engine knows it from the ambient session).
        connected = [server for server in self.servers.values() if server.connected]
        if len(connected) == 1:
            return connected[0]
        if not connected:
            return None
        return None

    def session_id(self, instance, data: dict) -> str:
        suffix = (f"qq_group_{data.get('group_id')}" if data.get("group_id")
                  else f"qq_{data.get('user_id')}")
        if instance.id == self.registry.legacy_session_instance:
            return suffix
        return f"bot:{instance.id}:{suffix}"

    async def send(self, message: str, *, user_id=None, group_id=None,
                   session_id: str = "", platform: str = "aiocqhttp",
                   self_id: object = "") -> dict:
        server = self.resolve(session_id=session_id, platform=platform, self_id=self_id)
        if server is None:
            raise RuntimeError("没有已连接的消息平台适配器")
        instance = server.instance
        if not str(message or "").strip():
            raise ValueError("message is required")
        action = "send_group_msg" if group_id else "send_private_msg"
        params: dict = {"message": [{"type": "text", "data": {"text": str(message)}}]}
        if group_id:
            params["group_id"] = int(group_id)
        else:
            if not user_id:
                raise ValueError("user_id or group_id is required")
            params["user_id"] = int(user_id)

        if instance.http_url:
            import httpx
            headers = {"Authorization": f"Bearer {instance.access_token}"} if instance.access_token else {}
            async with httpx.AsyncClient(base_url=instance.http_url, headers=headers, timeout=20) as client:
                response = await client.post(f"/{action}", json=params)
                response.raise_for_status()
                body = response.json()
                if body.get("retcode", 0) != 0:
                    raise RuntimeError(f"消息平台拒绝发送：{body.get('message') or body}")
                return {"sent": True, "via": "http", "instance": instance.id}
        await server.call_api(action, params)
        return {"sent": True, "via": "reverse-ws", "instance": instance.id}

    def status(self) -> list:
        """Per-instance health for the dashboard."""
        rows = []
        for instance in self.registry.instances:
            server = self.servers.get(instance.id)
            rows.append({
                "id": instance.id,
                "name": instance.name,
                "platform": instance.platform,
                "enabled": instance.enabled,
                "running": server is not None,
                "connected": bool(server and server.connected),
                "address": server.address if server else f"{instance.ws_host}:{instance.ws_port}",
                "clients": len(server._clients) if server else 0,
                "config_id": instance.config_id,
                "error": "" if (server or not instance.enabled) else "端口监听失败",
            })
        return rows
