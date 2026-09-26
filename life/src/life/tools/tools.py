"""Tools for L.I.F.E - Improved implementations."""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Optional
import json
import uuid
import asyncio

import httpx


@dataclass
class ToolResult:
    """Result from a tool call."""
    success: bool
    data: Any
    error: Optional[str] = None


@dataclass
class RuntimeToolConfig:
    """Mutable LIFE tool permissions/settings loaded from Core."""
    computer_use: bool = False
    mail_mailbox_path: str = ""
    mail_imap_host: str = ""
    mail_imap_port: int = 993
    mail_imap_user: str = ""
    mail_imap_password: str = ""
    mcp_enabled: bool = True
    onebot_enabled: bool = False
    onebot_sender: Any = None
    minecraft_enabled: bool = False
    minecraft_url: str = "http://127.0.0.1:8765"


class Tool(ABC):
    """Base class for tools."""

    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        pass

    @abstractmethod
    async def execute(self, **kwargs) -> ToolResult:
        pass

    def to_schema(self) -> dict:
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters(),
        }

    def parameters(self) -> dict:
        return {"type": "object", "properties": {}}


class GetMailTool(Tool):
    """Tool to fetch emails via IMAP (env-configured) or local mailbox file."""

    @property
    def name(self) -> str:
        return "getmail"

    @property
    def description(self) -> str:
        return "Fetch recent emails from the user's inbox. Returns subject, sender, preview."

    def __init__(self, config: RuntimeToolConfig):
        self.config = config

    def parameters(self) -> dict:
        return {"type": "object", "properties": {
            "limit": {"type": "integer", "minimum": 1, "maximum": 50},
            "unread_only": {"type": "boolean"},
        }}

    async def execute(self, limit: int = 5, unread_only: bool = False, **kwargs) -> ToolResult:
        import os
        from datetime import datetime, timedelta

        # Local mailbox file (JSON list) for offline / demo use
        mailbox_path = self.config.mail_mailbox_path or os.environ.get("MAILBOX_PATH", "")
        if mailbox_path and os.path.isfile(mailbox_path):
            try:
                with open(mailbox_path, "r", encoding="utf-8") as f:
                    items = json.load(f)
                if not isinstance(items, list):
                    raise ValueError("mailbox must be a JSON list")
                if unread_only:
                    items = [m for m in items if m.get("unread")]
                items = items[: max(1, int(limit))]
                return ToolResult(
                    success=True,
                    data={
                        "emails": items,
                        "total": len(items),
                        "unread_count": sum(1 for m in items if m.get("unread")),
                        "source": "mailbox_file",
                    },
                )
            except Exception as e:
                return ToolResult(success=False, data=None, error=str(e))

        # IMAP via env credentials
        host = self.config.mail_imap_host or os.environ.get("IMAP_HOST", "")
        user = self.config.mail_imap_user or os.environ.get("IMAP_USER", "")
        password = self.config.mail_imap_password or os.environ.get("IMAP_PASSWORD", "")
        port = self.config.mail_imap_port or 993
        if host and user and password:
            try:
                import imaplib
                import email as email_lib
                from email.header import decode_header

                def _decode(v):
                    if not v:
                        return ""
                    parts = decode_header(v)
                    out = []
                    for text, enc in parts:
                        if isinstance(text, bytes):
                            out.append(text.decode(enc or "utf-8", errors="replace"))
                        else:
                            out.append(text)
                    return "".join(out)

                def _read():
                    conn = imaplib.IMAP4_SSL(host, port=port, timeout=15)
                    try:
                        conn.login(user, password)
                        conn.select("INBOX")
                        typ, data = conn.search(None, "UNSEEN" if unread_only else "ALL")
                        if typ != "OK":
                            return []
                        ids = (data[0] or b"").split()
                        ids = list(reversed(ids))[: max(1, int(limit))]
                        emails = []
                        for mid in ids:
                            typ, msg_data = conn.fetch(mid, "(BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)] BODY[TEXT])")
                            if typ != "OK" or not msg_data or msg_data[0] is None:
                                continue
                            raw = b""
                            for part in msg_data:
                                if isinstance(part, tuple) and len(part) > 1:
                                    raw += part[1]
                            msg = email_lib.message_from_bytes(raw)
                            body = msg.get_payload(decode=True)
                            if body is None:
                                payload = msg.get_payload()
                                body = payload.encode() if isinstance(payload, str) else b""
                            emails.append({
                                "id": mid.decode() if isinstance(mid, bytes) else str(mid),
                                "from": _decode(msg.get("From")),
                                "subject": _decode(msg.get("Subject")),
                                "preview": body.decode("utf-8", errors="replace")[:200],
                                "date": msg.get("Date") or "",
                                "unread": unread_only,
                            })
                        return emails
                    finally:
                        try:
                            conn.logout()
                        except Exception:
                            pass

                emails = await asyncio.to_thread(_read)
                return ToolResult(
                    success=True,
                    data={
                        "emails": emails,
                        "total": len(emails),
                        "unread_count": sum(1 for m in emails if m.get("unread")),
                        "source": "imap",
                    },
                )
            except Exception as e:
                return ToolResult(success=False, data=None, error=str(e))

        return ToolResult(
            success=False,
            data=None,
            error="getmail not configured (set L.I.F.E mail settings)",
        )


class SearchTool(Tool):
    """Tool for web search via env-configured endpoint (SearXNG / DuckDuckGo)."""

    @property
    def name(self) -> str:
        return "search"

    @property
    def description(self) -> str:
        return "Search the web for information. Returns titles, URLs, and snippets."

    def parameters(self) -> dict:
        return {"type": "object", "required": ["query"], "properties": {
            "query": {"type": "string"}, "num_results": {"type": "integer", "minimum": 1, "maximum": 20},
        }}

    async def execute(self, query: str = "", num_results: int = 5, **kwargs) -> ToolResult:
        if not query:
            return ToolResult(success=False, data=None, error="Query is required")

        import os

        # Prefer local SearXNG (self-hosted), then external SEARXNG_URL, then DDG.
        searx = (os.environ.get("SEARXNG_URL") or "http://127.0.0.1:8888").rstrip("/")
        ddg = os.environ.get("SEARCH_DDG", "1") == "1"

        async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
            # 1) Local/remote SearXNG
            if searx:
                try:
                    resp = await client.get(
                        f"{searx}/search",
                        params={"q": query, "format": "json"},
                        headers={"Accept": "application/json"},
                    )
                    resp.raise_for_status()
                    payload = resp.json()
                    results = []
                    for r in payload.get("results", [])[: max(1, int(num_results))]:
                        results.append({
                            "title": r.get("title", ""),
                            "url": r.get("url", ""),
                            "snippet": r.get("content", ""),
                        })
                    if results:
                        return ToolResult(
                            success=True,
                            data={"results": results, "query": query, "engine": "searxng"},
                        )
                except Exception:
                    pass  # fall through to DDG

            # 2) DuckDuckGo fallback
            if ddg:
                try:
                    resp = await client.post(
                        "https://html.duckduckgo.com/html/",
                        data={"q": query},
                        headers={"User-Agent": "0kay-life/0.1"},
                    )
                    resp.raise_for_status()
                    results = []
                    import re
                    blocks = re.findall(
                        r'<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>(.*?)</a>.*?'
                        r'(?:class="result__snippet"[^>]*>(.*?)</(?:a|td)>)?',
                        resp.text,
                        flags=re.S,
                    )
                    for href, title, snippet in blocks[: max(1, int(num_results))]:
                        title = re.sub(r"<[^>]+>", "", title or "").strip()
                        snippet = re.sub(r"<[^>]+>", "", snippet or "").strip()
                        if "uddg=" in href:
                            from urllib.parse import parse_qs, urlparse, unquote
                            qs = parse_qs(urlparse(href).query)
                            href = unquote(qs.get("uddg", [href])[0])
                        results.append({"title": title, "url": href, "snippet": snippet})
                    if results:
                        return ToolResult(
                            success=True,
                            data={"results": results, "query": query, "engine": "duckduckgo"},
                        )
                except Exception as e:
                    return ToolResult(success=False, data=None, error=str(e) or "search failed")

            return ToolResult(
                success=False,
                data=None,
                error=f"search failed (searx={searx or 'off'}, ddg={'on' if ddg else 'off'})",
            )


class UseAgentTool(Tool):
    """Tool to dispatch tasks to Agent asynchronously via Core."""

    def __init__(self, core_client=None):
        self.core_client = core_client

    @property
    def name(self) -> str:
        return "useagent"

    @property
    def description(self) -> str:
        return "Dispatch a task to an Agent for async execution. Returns task_id for tracking."

    def parameters(self) -> dict:
        return {"type": "object", "required": ["agent_prompt"], "properties": {
            "agent_prompt": {"type": "string"}, "agent_type": {"type": "string"},
            "thinking_intensity": {"type": "string", "enum": ["low", "medium", "high", "max"]},
        }}

    async def execute(
        self,
        agent_prompt: str = "",
        agent_type: str = "general",
        thinking_intensity: str = "",
        difficulty_hint: float | None = None,
        require_thinking: bool = False,
        metadata: dict | None = None,
        **kwargs,
    ) -> ToolResult:
        task_id = str(uuid.uuid4())
        meta = dict(metadata or {})
        if thinking_intensity:
            meta["thinking_intensity"] = thinking_intensity
            if difficulty_hint is None:
                difficulty_hint = {"low": 0.2, "medium": 0.5, "high": 0.75, "max": 1.0}.get(thinking_intensity, 0.5)
        if difficulty_hint is not None:
            meta["difficulty_hint"] = difficulty_hint
            meta["require_thinking"] = bool(require_thinking or difficulty_hint >= 0.75)

        # Dispatch via Core.UseAgent (real gRPC call when core_client is set)
        if self.core_client is not None:
            resp = await asyncio.to_thread(self.core_client.use_agent,
                task_id=task_id,
                prompt=agent_prompt,
                agent_type=agent_type,
                metadata=meta or None,
            )
            if not resp.get("accepted"):
                return ToolResult(
                    success=False,
                    data=None,
                    error=resp.get("message", "no agents available"),
                )
            return ToolResult(
                success=True,
                data={
                    "task_id": resp.get("task_id", task_id),
                    "status": "pending",
                    "message": resp.get("message", "task accepted"),
                    "thinking_intensity": thinking_intensity,
                },
            )

        return ToolResult(False, None, "Core is unavailable; task was not dispatched")

class WebBrowseTool(Tool):
    """Tool to fetch and parse web pages."""

    @property
    def name(self) -> str:
        return "web_browse"

    @property
    def description(self) -> str:
        return "Fetch and extract text content from a web page URL."

    def parameters(self) -> dict:
        return {"type": "object", "required": ["url"], "properties": {
            "url": {"type": "string"}, "max_length": {"type": "integer", "minimum": 100, "maximum": 20000},
        }}

    async def execute(self, url: str = "", max_length: int = 5000, **kwargs) -> ToolResult:
        if not url:
            return ToolResult(success=False, data=None, error="URL is required")

        async with httpx.AsyncClient(follow_redirects=True, timeout=30) as client:
            try:
                resp = await client.get(url)
                resp.raise_for_status()

                # Simple text extraction (would use BeautifulSoup in production)
                content = resp.text[:max_length]

                return ToolResult(
                    success=True,
                    data={
                        "url": url,
                        "status_code": resp.status_code,
                        "content": content,
                        "content_type": resp.headers.get("content-type", ""),
                    }
                )
            except Exception as e:
                return ToolResult(success=False, data=None, error=str(e))


class ComputerUseTool(Tool):
    """Route computer control to the selected Agent host, never the LIFE host."""

    def __init__(self, core_client, config: RuntimeToolConfig):
        self.core_client = core_client
        self.config = config

    @property
    def name(self) -> str:
        return "computeruse"

    @property
    def description(self) -> str:
        return "Operate the computer where the healthy Agent runs: screenshot, mouse, keyboard. Requires the L.I.F.E computer-use permission."

    def parameters(self) -> dict:
        return {"type": "object", "required": ["action"], "properties": {
            "action": {"type": "string", "enum": ["screenshot", "move", "click", "type", "key"]},
            "x": {"type": "integer"}, "y": {"type": "integer"}, "button": {"type": "string", "enum": ["left", "right"]},
            "text": {"type": "string"}, "key": {"type": "string"},
        }}

    async def execute(self, **kwargs) -> ToolResult:
        if not self.config.computer_use:
            return ToolResult(False, None, "computer_use is disabled in L.I.F.E settings")
        if self.core_client is None:
            return ToolResult(False, None, "Core client is unavailable")
        response = await asyncio.to_thread(self.core_client.run_agent_tool, "computeruse", kwargs, "life-computeruse")
        if not response.get("success"):
            return ToolResult(False, None, response.get("error", "Agent computeruse failed"))
        try:
            return ToolResult(True, json.loads(response.get("result") or "{}"))
        except Exception:
            return ToolResult(True, {"result": response.get("result", "")})


class McpTool(Tool):
    """Delegate external MCP calls to the Agent-host 0kay-mcp gateway."""

    def __init__(self, core_client, config: RuntimeToolConfig):
        self.core_client = core_client
        self.config = config

    @property
    def name(self) -> str:
        return "mcp"

    @property
    def description(self) -> str:
        return "List or call external MCP tools managed by 0kay-mcp on the Agent host."

    def parameters(self) -> dict:
        return {"type": "object", "required": ["action"], "properties": {
            "action": {"type": "string", "enum": ["list", "call"]}, "server": {"type": "string"},
            "tool": {"type": "string"}, "args": {"type": "object"},
        }}

    async def execute(self, action: str = "list", **kwargs) -> ToolResult:
        if not self.config.mcp_enabled:
            return ToolResult(False, None, "MCP is disabled in L.I.F.E settings")
        if self.core_client is None:
            return ToolResult(False, None, "Core client is unavailable")
        response = await asyncio.to_thread(self.core_client.run_agent_tool, "mcp", {"action": action, **kwargs}, "life-mcp")
        if not response.get("success"):
            return ToolResult(False, None, response.get("error", "MCP call failed"))
        try:
            return ToolResult(True, json.loads(response.get("result") or "{}"))
        except Exception:
            return ToolResult(True, {"result": response.get("result", "")})


class SendOneBotTool(Tool):
    """Allow THINK to send a deliberate proactive OneBot message."""

    def __init__(self, config: RuntimeToolConfig, companion=None):
        self.config = config
        self.companion = companion

    @property
    def name(self) -> str:
        return "send_message"

    @property
    def description(self) -> str:
        return "Send a proactive OneBot v11 private or group message. Requires OneBot to be enabled and connected."

    def parameters(self) -> dict:
        return {"type": "object", "required": ["message"], "properties": {
            "message": {"type": "string"}, "user_id": {"type": "integer"}, "group_id": {"type": "integer"},
        }}

    async def execute(self, message: str = "", user_id: int | None = None, group_id: int | None = None, **kwargs) -> ToolResult:
        if not self.config.onebot_enabled:
            return ToolResult(False, None, "OneBot is disabled in L.I.F.E settings")
        if self.config.onebot_sender is None:
            return ToolResult(False, None, "OneBot is not connected")
        try:
            target = f"group:{group_id}" if group_id else f"user:{user_id}"
            if self.companion:
                allowed, reason = self.companion.can_proactively_send(target)
                if not allowed:
                    self.companion.audit("proactive_send", message, target, reason)
                    return ToolResult(False, None, reason)
            await self.config.onebot_sender(message=message, user_id=user_id, group_id=group_id)
            if self.companion:
                self.companion.record_proactive_send(target, message)
            return ToolResult(True, {"sent": True, "user_id": user_id, "group_id": group_id})
        except Exception as e:
            return ToolResult(False, None, str(e))


class MinecraftTool(Tool):
    """Connect a Minecraft bot to the user's server and play alongside people."""

    def __init__(self, config: RuntimeToolConfig):
        self.config = config

    @property
    def name(self) -> str:
        return "minecraft"

    @property
    def description(self) -> str:
        return (
            "Control a Minecraft companion bot on the user's server (Java via mineflayer, "
            "Bedrock via bedrock-protocol). Actions: connect, disconnect, status, chat, "
            "players, follow, goto, stop, look, dig, place, attack, inventory, use, "
            "autopilot_start, autopilot_stop. With autopilot_start the bot plays by itself "
            "using AI decisions and can be stopped with autopilot_stop."
        )

    def parameters(self) -> dict:
        return {"type": "object", "required": ["action"], "properties": {
            "action": {"type": "string", "enum": [
                "connect", "disconnect", "status", "chat", "players", "follow", "goto",
                "stop", "look", "dig", "place", "attack", "inventory", "use",
                "autopilot_start", "autopilot_stop"]},
            "edition": {"type": "string", "enum": ["java", "bedrock"]},
            "host": {"type": "string"}, "port": {"type": "integer"},
            "username": {"type": "string"}, "version": {"type": "string"},
            "auth": {"type": "string", "enum": ["offline", "microsoft"]},
            "password": {"type": "string"}, "message": {"type": "string"}, "player": {"type": "string"},
            "target": {"type": "string"}, "distance": {"type": "integer"},
            "x": {"type": "number"}, "y": {"type": "number"}, "z": {"type": "number"},
            "item": {"type": "string"}, "goal": {"type": "string"},
            "interval_ms": {"type": "integer"}, "model_id": {"type": "string"},
        }}

    async def execute(self, action: str = "", **kwargs) -> ToolResult:
        if not self.config.minecraft_enabled:
            return ToolResult(False, None, "minecraft is disabled in L.I.F.E settings")
        action = (action or kwargs.pop("mode", "") or kwargs.pop("op", "") or kwargs.pop("command", "")).strip().lower()
        if not action:
            return ToolResult(False, None, "action is required")
        base = (self.config.minecraft_url or "http://127.0.0.1:8765").rstrip("/")
        args = {key: value for key, value in kwargs.items() if value is not None and key != "action"}
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                if action in ("autopilot_start", "autopilot_stop"):
                    payload = {"goal": args.get("goal"), "intervalMs": args.get("interval_ms"), "modelId": args.get("model_id")}
                    endpoint = f"{base}/autopilot/{'start' if action.endswith('start') else 'stop'}"
                    resp = await client.post(endpoint, json={key: value for key, value in payload.items() if value not in (None, "")})
                else:
                    resp = await client.post(f"{base}/action", json={"action": action, "args": args})
                resp.raise_for_status()
                data = resp.json()
        except Exception as e:
            return ToolResult(False, None, f"minecraft service unreachable: {e}")
        if data.get("ok") is False:
            return ToolResult(False, data, data.get("error") or "minecraft action failed")
        return ToolResult(True, data.get("result", data))


class AgendaTool(Tool):
    def __init__(self, companion): self.companion = companion
    @property
    def name(self) -> str: return "agenda_add"
    @property
    def description(self) -> str: return "Add an item to LIFE's own schedule. It is confirmed immediately (no manual step). Use for scheduling requests; when is local YYYY-MM-DD HH:MM."
    def parameters(self) -> dict:
        return {"type": "object", "required": ["title"], "properties": {"title": {"type": "string"}, "when": {"type": "string"}, "detail": {"type": "string"}}}
    async def execute(self, title="", when="", detail="", **kwargs) -> ToolResult:
        if not isinstance(title, str) or not title.strip():
            return ToolResult(False, None, "A non-empty schedule title is required")
        try: return ToolResult(True, await asyncio.to_thread(self.companion.add_agenda, title.strip(), when, detail))
        except Exception as e: return ToolResult(False, None, str(e))


class JournalTool(Tool):
    def __init__(self, companion, kind="journal"): self.companion = companion; self.kind = kind
    @property
    def name(self) -> str: return "dream" if self.kind == "dream" else "journal"
    @property
    def description(self) -> str: return "Record a private LIFE dream." if self.kind == "dream" else "Record a LIFE journal entry."
    def parameters(self) -> dict:
        return {"type": "object", "required": ["content"], "properties": {"content": {"type": "string"}}}
    async def execute(self, content="", **kwargs) -> ToolResult:
        try: return ToolResult(True, self.companion.journal(content, self.kind))
        except Exception as e: return ToolResult(False, None, str(e))


class RememberTool(Tool):
    def __init__(self, memory):
        self.memory = memory

    @property
    def name(self) -> str:
        return "remember"

    @property
    def description(self) -> str:
        return "Store an important durable memory with a judgment, tags, scope, and strength. Use only for facts worth remembering."

    def parameters(self) -> dict:
        return {"type": "object", "required": ["content"], "properties": {
            "content": {"type": "string"}, "judgment": {"type": "string"}, "tags": {"type": "array", "items": {"type": "string"}},
            "strength": {"type": "number", "minimum": 0, "maximum": 1}, "memory_type": {"type": "string"}, "scope": {"type": "string"},
        }}

    async def execute(self, content: str = "", judgment: str = "", tags: list | None = None,
                      strength: float = 0.8, memory_type: str = "knowledge", scope: str = "public", **kwargs) -> ToolResult:
        try:
            memory = await asyncio.to_thread(self.memory.remember, content, judgment, tags, strength, memory_type, scope)
            return ToolResult(True, memory.to_dict())
        except Exception as e:
            return ToolResult(False, None, str(e))


class RecallTool(Tool):
    def __init__(self, memory):
        self.memory = memory

    @property
    def name(self) -> str:
        return "recall"

    @property
    def description(self) -> str:
        return "Actively recall durable memories and short-note references relevant to a query."

    def parameters(self) -> dict:
        return {"type": "object", "properties": {
            "query": {"type": "string"}, "limit": {"type": "integer", "minimum": 1, "maximum": 20}, "scope": {"type": "string"},
        }}

    async def execute(self, query: str = "", limit: int = 5, scope: str = "", **kwargs) -> ToolResult:
        try:
            records = await asyncio.to_thread(self.memory.active_recall, query, limit, scope)
            return ToolResult(True, {"memories": [record.to_dict() for record in records], "notes": await asyncio.to_thread(self.memory.list_notes, query, limit, scope)})
        except Exception as e:
            return ToolResult(False, None, str(e))


class NoteCreateTool(Tool):
    def __init__(self, memory):
        self.memory = memory

    @property
    def name(self) -> str:
        return "note_create"

    @property
    def description(self) -> str:
        return "Create a concise Markdown learning note. Do not use it for raw long transcripts."

    def parameters(self) -> dict:
        return {"type": "object", "required": ["title", "content"], "properties": {
            "title": {"type": "string"}, "content": {"type": "string"}, "tags": {"type": "array", "items": {"type": "string"}},
        }}

    async def execute(self, title: str = "", content: str = "", tags: list | None = None, scope: str = "public", **kwargs) -> ToolResult:
        try:
            return ToolResult(True, await asyncio.to_thread(self.memory.create_note, title, content, tags, scope))
        except Exception as e:
            return ToolResult(False, None, str(e))


class NoteReadTool(Tool):
    def __init__(self, memory):
        self.memory = memory

    @property
    def name(self) -> str:
        return "note_read"

    @property
    def description(self) -> str:
        return "Read a saved Markdown learning note by note_id with pagination."

    def parameters(self) -> dict:
        return {"type": "object", "required": ["note_id"], "properties": {
            "note_id": {"type": "string"}, "offset": {"type": "integer", "minimum": 1}, "limit": {"type": "integer", "minimum": 1, "maximum": 1000},
        }}

    async def execute(self, note_id: str = "", offset: int = 1, limit: int = 200, scope: str = "", **kwargs) -> ToolResult:
        try:
            return ToolResult(True, await asyncio.to_thread(self.memory.read_note, note_id, offset, limit, scope))
        except Exception as e:
            return ToolResult(False, None, str(e))


class ToolRegistry:
    """Registry of available tools."""

    def __init__(self):
        self.tools: dict[str, Tool] = {}
        self.recorder = None

    def register(self, tool: Tool) -> None:
        self.tools[tool.name] = tool

    def get(self, name: str) -> Optional[Tool]:
        return self.tools.get(name)

    async def call(self, name: str, **kwargs) -> ToolResult:
        record = await self.recorder.start("tool", name) if self.recorder else None
        tool = self.get(name)
        if not tool:
            result = ToolResult(success=False, data=None, error=f"Tool '{name}' not found")
        else:
            try:
                result = await tool.execute(**kwargs)
            except asyncio.CancelledError:
                if record:
                    await self.recorder.finish(record, cancelled=True)
                raise
            except Exception as error:
                result = ToolResult(False, None, str(error))
        if record:
            await self.recorder.finish(record, json.dumps(result.data, ensure_ascii=False), result.error or ("tool failed" if not result.success else ""))
        return result

    def list_tools(self) -> list[dict]:
        return [tool.to_schema() for tool in self.tools.values()]


def create_default_registry(core_client=None, config: RuntimeToolConfig | None = None, memory=None, companion=None) -> ToolRegistry:
    """Create a ToolRegistry with default tools."""
    registry = ToolRegistry()
    config = config or RuntimeToolConfig()
    registry.register(GetMailTool(config))
    registry.register(SearchTool())
    registry.register(UseAgentTool(core_client=core_client))
    registry.register(WebBrowseTool())
    registry.register(ComputerUseTool(core_client, config))
    registry.register(McpTool(core_client, config))
    registry.register(MinecraftTool(config))
    registry.register(SendOneBotTool(config, companion))
    if memory is not None:
        registry.register(RememberTool(memory))
        registry.register(RecallTool(memory))
        registry.register(NoteCreateTool(memory))
        registry.register(NoteReadTool(memory))
    if companion is not None:
        registry.register(AgendaTool(companion))
        registry.register(JournalTool(companion))
        registry.register(JournalTool(companion, "dream"))
    return registry
