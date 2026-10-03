"""Tools for L.I.F.E - Improved implementations."""

from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Optional
import ipaddress
import json
import socket
import ssl
import uuid
import asyncio
from urllib.parse import urlsplit

import httpx
from ..network import PublicHTTPTransport, SecureIMAP, StartTLSIMAP, SecureSMTP, StartTLSSMTP


def _env_flag(name: str) -> bool:
    """True when the named environment variable is an explicit opt-in."""
    import os
    return str(os.getenv(name, "")).strip().lower() in ("1", "true", "yes", "on")


def assert_public_host(host: str, port: int = 0, allow_env: str = "") -> str:
    """SSRF guard for a bare host target: reject hosts resolving to private IPs.

    ``allow_env`` names an environment variable that opts the caller out of the
    check (e.g. ``LIFE_MAIL_ALLOW_PRIVATE`` for a self-hosted LAN mail server).
    The opt-out only skips the *private-address* rule; an unresolvable host is
    still an error, so the exemption cannot be used to disable validation
    wholesale.
    """
    host = str(host or "").strip()
    if not host:
        raise ValueError("host is required")
    try:
        infos = socket.getaddrinfo(host, int(port or 0), proto=socket.IPPROTO_TCP)
    except socket.gaierror as error:
        raise ValueError(f"cannot resolve host: {error}") from error
    # The opt-out skips only the private-address rule; a host that does not
    # resolve is still rejected, so the exemption cannot disable validation.
    if allow_env and _env_flag(allow_env):
        return host
    for info in infos:
        address = ipaddress.ip_address(info[4][0])
        if not address.is_global:
            raise ValueError(f"blocked non-public address {address}")
    return host


def _assert_public_http_url(url: str, allow_env: str = "") -> str:
    """SSRF guard: allow only http(s) URLs whose host resolves to a public IP.

    Returns the URL unchanged when it is safe to fetch, otherwise raises
    ``ValueError``.  Callers that follow redirects must re-validate every hop,
    because a public URL can 302 into the private network.
    """
    parts = urlsplit(str(url or "").strip())
    if parts.scheme not in ("http", "https"):
        raise ValueError("only http/https URLs are allowed")
    host = parts.hostname
    if not host:
        raise ValueError("URL has no host")
    port = parts.port or (443 if parts.scheme == "https" else 80)
    assert_public_host(host, port, allow_env)
    return url


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
    mail_imap_ssl: bool = True
    mail_smtp_host: str = ""
    mail_smtp_port: int = 465
    mail_smtp_user: str = ""
    mail_smtp_password: str = ""
    mail_from: str = ""
    mail_from_name: str = "0KAY"
    mail_require_approval: bool = True
    mail_auto_approve_all: bool = False
    mcp_enabled: bool = True
    onebot_enabled: bool = False
    onebot_sender: Any = None
    minecraft_enabled: bool = False
    minecraft_url: str = "http://127.0.0.1:8765"


def _imap_credentials(config: "RuntimeToolConfig"):
    import os
    host = config.mail_imap_host or os.environ.get("IMAP_HOST", "")
    user = config.mail_imap_user or os.environ.get("IMAP_USER", "")
    password = config.mail_imap_password or os.environ.get("IMAP_PASSWORD", "")
    port = int(config.mail_imap_port or os.environ.get("IMAP_PORT") or 993)
    use_ssl = getattr(config, "mail_imap_ssl", True)
    # Every IMAP path funnels through here, so the SSRF rule lives here too.
    if host:
        assert_public_host(host, port, "LIFE_MAIL_ALLOW_PRIVATE")
    return host, port, user, password, use_ssl


def _smtp_credentials(config: "RuntimeToolConfig"):
    import os
    host = config.mail_smtp_host or os.environ.get("SMTP_HOST", "")
    user = config.mail_smtp_user or os.environ.get("SMTP_USER", "")
    password = config.mail_smtp_password or os.environ.get("SMTP_PASSWORD", "")
    port = int(config.mail_smtp_port or os.environ.get("SMTP_PORT") or 465)
    sender = config.mail_from or os.environ.get("MAIL_FROM") or user
    if host:
        assert_public_host(host, port, "LIFE_MAIL_ALLOW_PRIVATE")
    return host, port, user, password, sender


def test_imap(config: "RuntimeToolConfig") -> dict:
    """Verify IMAP credentials and count INBOX messages."""
    try:
        host, port, user, password, use_ssl = _imap_credentials(config)
    except ValueError as error:
        return {"ok": False, "error": str(error)}
    if not (host and user and password):
        return {"ok": False, "error": "IMAP 未配置（缺少主机/用户名/密码）"}
    try:
        import imaplib
        conn = SecureIMAP(host, port=port, timeout=15, ssl_context=ssl.create_default_context()) if use_ssl else StartTLSIMAP(host, port=port, timeout=15)
        try:
            if not use_ssl:
                conn.starttls(ssl_context=ssl.create_default_context())
            conn.login(user, password)
            typ, _ = conn.select("INBOX")
            total = 0
            if typ == "OK":
                try:
                    typ2, data = conn.search(None, "ALL")
                    if typ2 == "OK" and data and data[0]:
                        total = len((data[0] or b"").split())
                except Exception:
                    total = 0
            return {"ok": True, "host": host, "port": port, "user": user, "messages": total}
        finally:
            try:
                conn.logout()
            except Exception:
                pass
    except Exception as e:
        return {"ok": False, "error": str(e)}


def test_smtp(config: "RuntimeToolConfig") -> dict:
    """Verify SMTP credentials (connect + STARTTLS/SSL + login)."""
    try:
        host, port, user, password, _sender = _smtp_credentials(config)
    except ValueError as error:
        return {"ok": False, "error": str(error)}
    if not (host and user and password):
        return {"ok": False, "error": "SMTP 未配置（缺少主机/用户名/密码）"}
    try:
        import smtplib
        if port == 465:
            server = SecureSMTP(host, port, timeout=15, context=ssl.create_default_context())
        else:
            server = StartTLSSMTP(host, port, timeout=15)
            server.ehlo()
            if not server.has_extn("starttls"):
                try:
                    server.quit()
                except Exception:
                    pass
                raise RuntimeError("SMTP 服务器未提供 STARTTLS，已拒绝明文登录")
            server.starttls(context=ssl.create_default_context())
            server.ehlo()
        try:
            server.login(user, password)
        finally:
            try:
                server.quit()
            except Exception:
                pass
        return {"ok": True, "host": host, "port": port, "user": user}
    except Exception as e:
        return {"ok": False, "error": str(e)}


def send_mail(config: "RuntimeToolConfig", to: str, subject: str, body: str) -> ToolResult:
    """Send a plain-text email via SMTP."""
    try:
        host, port, user, password, sender = _smtp_credentials(config)
    except ValueError as error:
        return ToolResult(False, None, str(error))
    if not (host and user and password):
        return ToolResult(False, None, "SMTP 未配置（缺少主机/用户名/密码）")
    if not to:
        return ToolResult(False, None, "缺少收件人")
    try:
        import smtplib
        from email.mime.text import MIMEText
        from email.header import Header
        from email.utils import formataddr

        msg = MIMEText(body or "", "plain", "utf-8")
        msg["Subject"] = Header(subject or "(无主题)", "utf-8")
        display_name = str(getattr(config, "mail_from_name", "") or "").strip()
        msg["From"] = formataddr((display_name, sender)) if (sender and display_name) else sender
        msg["To"] = to

        if port == 465:
            server = SecureSMTP(host, port, timeout=20, context=ssl.create_default_context())
        else:
            server = StartTLSSMTP(host, port, timeout=20)
            server.ehlo()
            if not server.has_extn("starttls"):
                try:
                    server.quit()
                except Exception:
                    pass
                return ToolResult(False, None, "SMTP 服务器未提供 STARTTLS，已拒绝明文发送密码")
            server.starttls(context=ssl.create_default_context())
            server.ehlo()
        try:
            server.login(user, password)
            server.sendmail(sender or user, [to], msg.as_string())
        finally:
            try:
                server.quit()
            except Exception:
                pass
        return ToolResult(True, {"to": to, "subject": subject, "from": sender})
    except Exception as e:
        return ToolResult(False, None, str(e))


def mail_status(config: "RuntimeToolConfig", test_to: str = "") -> dict:
    """Full mail check: IMAP login, SMTP login and an optional test send."""
    imap = test_imap(config)
    smtp = test_smtp(config)
    try:
        _host, _port, _user, _password, sender = _smtp_credentials(config)
    except ValueError:
        # test_smtp already reported the same guard rejection in `smtp`.
        sender = ""
    result: dict = {"imap": imap, "smtp": smtp, "from": sender}
    if test_to and smtp.get("ok"):
        sent = send_mail(config, test_to, "0KAY 邮箱测试", "这是一封来自 0KAY L.I.F.E 的测试邮件，收到即表示发件配置正确。")
        result["sent"] = {"ok": sent.success, "to": test_to, "error": sent.error}
    return result


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
                    conn = SecureIMAP(host, port=port, timeout=15, ssl_context=ssl.create_default_context())
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
                            typ, msg_data = conn.fetch(mid, "(FLAGS BODY.PEEK[HEADER.FIELDS (FROM SUBJECT DATE)] BODY[TEXT])")
                            if typ != "OK" or not msg_data or msg_data[0] is None:
                                continue
                            raw = b""
                            flags = b""
                            for part in msg_data:
                                if isinstance(part, tuple) and len(part) > 1:
                                    raw += part[1]
                                elif isinstance(part, (bytes, bytearray)) and b"FLAGS" in part:
                                    flags += bytes(part)
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
                                # `\Seen` in the FETCH FLAGS is the real read state.
                                # Previously this was just the query flag, so every
                                # message reported unread=False unless unread_only
                                # was set, and unread_count was always 0.
                                "unread": (b"\\Seen" not in flags) if flags else bool(unread_only),
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


class SendMailTool(Tool):
    """Tool to send an email via SMTP (config- or env-configured)."""

    @property
    def name(self) -> str:
        return "sendmail"

    @property
    def description(self) -> str:
        return "Send an email to a recipient. Provide to, subject and body."

    def __init__(self, config: RuntimeToolConfig):
        self.config = config

    def parameters(self) -> dict:
        return {"type": "object", "properties": {
            "to": {"type": "string", "description": "Recipient email address"},
            "subject": {"type": "string"},
            "body": {"type": "string"},
        }, "required": ["to", "body"]}

    async def execute(self, to: str = "", subject: str = "", body: str = "", **kwargs) -> ToolResult:
        return await asyncio.to_thread(send_mail, self.config, str(to), str(subject), str(body))


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

        from life.http_auth import auth_headers

        # Search is a built-in Core capability now (no standalone SearXNG service).
        base = (os.environ.get("CORE_HTTP_ADDR") or os.environ.get("CORE_HTTP") or "http://127.0.0.1:8080").rstrip("/")
        limit = max(1, int(num_results))
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.get(
                    f"{base}/api/search",
                    params={"q": query, "n": limit},
                    headers=auth_headers(),
                )
            if response.status_code != 200:
                return ToolResult(False, None, f"搜索失败（HTTP {response.status_code}）")
            payload = response.json()
            results = [
                {"title": r.get("title", ""), "url": r.get("url", ""), "snippet": r.get("snippet", "")}
                for r in (payload.get("results") or [])[:limit]
            ]
            return ToolResult(True, {"results": results, "query": query, "engine": payload.get("engine", "core")})
        except Exception as error:  # noqa: BLE001
            return ToolResult(False, None, str(error) or "search failed")


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
        try:
            _assert_public_http_url(url)
        except ValueError as error:
            return ToolResult(success=False, data=None, error=f"URL rejected: {error}")
        try:
            limit = max(100, min(int(max_length or 5000), 20000))
        except (TypeError, ValueError):
            limit = 5000

        # Redirects are followed manually so every hop is re-validated against
        # the SSRF guard (a public URL must not be able to 302 into 127.0.0.1).
        current = url
        try:
            async with httpx.AsyncClient(follow_redirects=False, timeout=30, transport=PublicHTTPTransport()) as client:
                for _ in range(4):
                    async with client.stream("GET", current) as resp:
                        if resp.is_redirect and resp.headers.get("location"):
                            current = str(httpx.URL(current).join(resp.headers["location"]))
                            continue
                        resp.raise_for_status()
                        data = bytearray()
                        async for chunk in resp.aiter_bytes():
                            if len(data) + len(chunk) > 5 * 1024 * 1024:
                                raise ValueError("web response too large")
                            data.extend(chunk)
                        return ToolResult(True, {
                            "url": current, "status_code": resp.status_code,
                            "content": data.decode(resp.encoding or "utf-8", errors="replace")[:limit],
                            "content_type": resp.headers.get("content-type", ""),
                        })
            return ToolResult(success=False, data=None, error="too many redirects")
        except ValueError as error:
            return ToolResult(success=False, data=None, error=f"URL rejected: {error}")
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
            "action": {"type": "string", "enum": ["screenshot", "listwindows", "move", "click", "type", "key"]},
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


class PluginTool(Tool):
    """A tool contributed by a plugin; execution is routed through Core."""

    def __init__(self, definition: dict):
        self.definition = definition or {}

    @property
    def name(self) -> str:
        return str(self.definition.get("name") or "")

    @property
    def description(self) -> str:
        return str(self.definition.get("description") or "由插件提供的外部工具")

    def parameters(self) -> dict:
        parameters = self.definition.get("parameters")
        return parameters if isinstance(parameters, dict) else {"type": "object", "properties": {}}

    async def execute(self, **kwargs) -> ToolResult:
        import os

        from life.http_auth import auth_headers

        base = (os.environ.get("CORE_HTTP_ADDR") or os.environ.get("CORE_HTTP") or "http://127.0.0.1:8080").rstrip("/")
        try:
            async with httpx.AsyncClient(timeout=120) as client:
                response = await client.post(
                    f"{base}/api/tools/call",
                    json={"tool": self.name, "args": kwargs, "caller": "life"},
                    headers=auth_headers(),
                )
            if response.status_code != 200:
                return ToolResult(False, None, f"调用失败（HTTP {response.status_code}）")
            data = response.json()
            if not data.get("success"):
                return ToolResult(False, None, data.get("error") or "插件工具执行失败")
            return ToolResult(True, data.get("result"))
        except Exception as error:  # noqa: BLE001 - surface any transport error
            return ToolResult(False, None, str(error))


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
            "scan_blocks, scan_entities, scan_grid, plan_route, skill_read, skill_list, "
            "task_status, task_stop, consent_reply, "
            "autopilot_start, autopilot_stop. With autopilot_start the bot plays by itself "
            "using AI decisions and can be stopped with autopilot_stop."
        )

    def parameters(self) -> dict:
        return {"type": "object", "required": ["action"], "properties": {
            "action": {"type": "string", "enum": [
                "connect", "disconnect", "status", "chat", "players", "follow", "goto",
                "stop", "look", "dig", "place", "attack", "inventory", "use",
                "scan_blocks", "scan_entities", "scan_grid", "plan_route", "goto_route",
                "skill_read", "task_status", "task_stop", "consent_reply", "consent_status",
                "autopilot_start", "autopilot_stop", "events",
                "world", "waypoint_add", "waypoint_list", "waypoint_goto", "waypoint_remove",
                "skill_save", "skill_run", "skill_list", "skill_remove"]},
            "edition": {"type": "string", "enum": ["java", "bedrock"]},
            "host": {"type": "string"}, "port": {"type": "integer"},
            "username": {"type": "string"}, "version": {"type": "string"},
            "auth": {"type": "string", "enum": ["offline", "microsoft"]},
            "password": {"type": "string"}, "message": {"type": "string"}, "player": {"type": "string"},
            "target": {"type": "string"}, "distance": {"type": "integer"},
            "x": {"type": "number"}, "y": {"type": "number"}, "z": {"type": "number"},
            "item": {"type": "string"}, "goal": {"type": "string"},
            "interval_ms": {"type": "integer"}, "model_id": {"type": "string"},
            "since": {"type": "integer"},
            "name": {"type": "string"}, "names": {"type": "array", "items": {"type": "string"}},
            "radius": {"type": "integer"}, "count": {"type": "integer"},
            "id": {"type": "string"},
            "note": {"type": "string"}, "type": {"type": "string"}, "dimension": {"type": "string"},
            "allow_dig": {"type": "boolean"}, "background": {"type": "boolean"}, "approve": {"type": "boolean"},
            "steps": {"type": "array", "items": {"type": "object"}},
        }}

    async def execute(self, action: str = "", **kwargs) -> ToolResult:
        if not self.config.minecraft_enabled:
            return ToolResult(False, None, "minecraft is disabled in L.I.F.E settings")
        action = (action or kwargs.pop("mode", "") or kwargs.pop("op", "") or kwargs.pop("command", "")).strip().lower()
        if not action:
            return ToolResult(False, None, "action is required")
        base = (self.config.minecraft_url or "http://127.0.0.1:8765").rstrip("/")
        import os
        token = os.getenv("MINECRAFT_TOKEN", "")
        if not token:
            return ToolResult(False, None, "MINECRAFT_TOKEN is required")
        args = {key: value for key, value in kwargs.items() if value is not None and key != "action"}
        try:
            async with httpx.AsyncClient(timeout=30, headers={"Authorization": "Bearer " + token}) as client:
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


class GoalAddTool(Tool):
    """Let the character invent a goal of its own.

    ``add_goal`` used to be reachable only from the dashboard, so every goal was
    written *for* the character.  Self-authored goals are capped (and marked
    ``kind="self"``) so it cannot accumulate an unbounded backlog of intentions
    it never acts on.
    """

    MAX_SELF_GOALS = 3

    def __init__(self, companion): self.companion = companion

    @property
    def name(self) -> str: return "goal_add"

    @property
    def description(self) -> str:
        return ("Set yourself a goal — something you want to get better at or finish. Use it when "
                "you notice you care about something you have not acted on. You may hold at most "
                f"{self.MAX_SELF_GOALS} self-set goals; log progress with goal_log.")

    def parameters(self) -> dict:
        return {"type": "object", "required": ["title"], "properties": {
            "title": {"type": "string", "description": "<= 40 chars, concrete and yours"},
            "detail": {"type": "string", "description": "what 'done' looks like, <= 200 chars"}}}

    async def execute(self, title: str = "", detail: str = "", **kwargs) -> ToolResult:
        title = str(title or "").strip()[:40]
        if not title:
            return ToolResult(False, None, "title is required")
        try:
            existing = await asyncio.to_thread(self.companion.list_goals, "")
        except Exception as e:
            return ToolResult(False, None, str(e))
        if any(str(g.get("title")) == title for g in existing):
            return ToolResult(False, None, "you already have a goal with that title")
        mine = [g for g in existing if str(g.get("kind")) == "self" and str(g.get("status")) == "active"]
        if len(mine) >= self.MAX_SELF_GOALS:
            return ToolResult(False, None, "you already hold %d self-set goals; finish one first: %s"
                              % (len(mine), "、".join(str(g.get("title")) for g in mine[:3])))
        try:
            goal = await asyncio.to_thread(self.companion.add_goal, title, str(detail or "")[:200], "self")
            return ToolResult(True, goal)
        except Exception as e:
            return ToolResult(False, None, str(e))


class GoalListTool(Tool):
    """Let the character see its own self-authored goals.

    ``personal_goals`` already reaches the THINK prompt as context, but without
    this tool the model had no way to inspect or advance them, so they were
    decorative.  Progress is never moved automatically.
    """

    def __init__(self, companion): self.companion = companion

    @property
    def name(self) -> str: return "goal_list"

    @property
    def description(self) -> str:
        return ("List LIFE's own personal goals with progress. Call this before deciding what to "
                "work on; goals are self-authored and never advanced automatically.")

    def parameters(self) -> dict:
        return {"type": "object", "properties": {
            "status": {"type": "string", "description": "active / done / paused; omit for all"}}}

    async def execute(self, status: str = "", **kwargs) -> ToolResult:
        try:
            goals = await asyncio.to_thread(self.companion.list_goals, str(status or ""))
            return ToolResult(True, {"goals": goals})
        except Exception as e:
            return ToolResult(False, None, str(e))


class GoalLogTool(Tool):
    """Advance one of LIFE's own goals by recording real, completed evidence."""

    def __init__(self, companion): self.companion = companion

    @property
    def name(self) -> str: return "goal_log"

    @property
    def description(self) -> str:
        return ("Record evidence that you actually made progress on one of your own goals (get the "
                "id from goal_list). Only log a step you really did — never log an intention.")

    def parameters(self) -> dict:
        return {"type": "object", "required": ["goal_id", "evidence"], "properties": {
            "goal_id": {"type": "string"},
            "evidence": {"type": "string", "description": "what you actually did, <= 80 chars"},
            "progress": {"type": "number", "minimum": 0, "maximum": 1,
                         "description": "absolute progress 0..1; omit to keep the current value"}}}

    async def execute(self, goal_id: str = "", evidence: str = "", progress=None, **kwargs) -> ToolResult:
        if not str(goal_id or "").strip() or not str(evidence or "").strip():
            return ToolResult(False, None, "goal_id and evidence are required")
        try:
            result = await asyncio.to_thread(self.companion.add_goal_log, str(goal_id).strip(),
                                             str(evidence).strip()[:200], progress)
            if not result.get("updated"):
                return ToolResult(False, None, "unknown goal_id")
            return ToolResult(True, result)
        except Exception as e:
            return ToolResult(False, None, str(e))


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


class WorldTool(Tool):
    """Keep up with the people in the character's own (fictional) world.

    The cast are not scenery: they miss the character, get angry when neglected,
    and can be reached out to.  This tool lets the character act on those bids
    for contact; nothing here is surfaced to the user, which is the point - it
    is a social life of its own.
    """

    def __init__(self, world_action=None):
        self.world_action = world_action

    @property
    def name(self) -> str:
        return "world"

    @property
    def description(self) -> str:
        return ("与你自己世界里的人来往（用户看不到）。action=pending 查看谁在等你或生你气；"
                "action=reply/visit 主动联系某个 actor_id，修复冷淡或误会。")

    def parameters(self) -> dict:
        return {"type": "object", "required": ["action"], "properties": {
            "action": {"type": "string", "enum": ["pending", "reply", "visit"]},
            "actor_id": {"type": "string"},
        }}

    async def execute(self, action: str = "pending", actor_id: str = "", **kwargs) -> ToolResult:
        if self.world_action is None:
            return ToolResult(False, None, "world simulation is not available")
        try:
            result = await asyncio.to_thread(self.world_action, action, actor_id=actor_id, **kwargs)
        except Exception as error:  # noqa: BLE001
            return ToolResult(False, None, str(error))
        if isinstance(result, dict) and result.get("success"):
            return ToolResult(True, result)
        error = (result or {}).get("error") if isinstance(result, dict) else "world action failed"
        return ToolResult(False, None, error or "world action failed")


class ToolRegistry:
    """Registry of available tools."""

    def __init__(self):
        self.tools: dict[str, Tool] = {}
        self.recorder = None
        self.approver = None
        self.approval_tools: set[str] = set()

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
            if self.approver is not None and name in self.approval_tools:
                allowed, reason = await self.approver(name, kwargs)
                if not allowed:
                    result = ToolResult(success=False, data=None, error=f"用户未授权「{name}」：{reason}")
                    if record:
                        await self.recorder.finish(record, "", result.error)
                    return result
            try:
                result = await tool.execute(**kwargs)
            except asyncio.CancelledError:
                if record:
                    await self.recorder.finish(record, cancelled=True)
                raise
            except Exception as error:
                result = ToolResult(False, None, str(error))
        if record:
            try:
                payload = json.dumps(result.data, ensure_ascii=False, default=str)
            except Exception:
                payload = ""
            await self.recorder.finish(record, payload, result.error or ("tool failed" if not result.success else ""))
        return result

    def list_tools(self) -> list[dict]:
        return [tool.to_schema() for tool in self.tools.values()]


def create_default_registry(core_client=None, config: RuntimeToolConfig | None = None, memory=None, companion=None, world_action=None) -> ToolRegistry:
    """Create a ToolRegistry with default tools."""
    registry = ToolRegistry()
    config = config or RuntimeToolConfig()
    registry.register(WorldTool(world_action))
    registry.register(GetMailTool(config))
    registry.register(SendMailTool(config))
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
        registry.register(GoalListTool(companion))
        registry.register(GoalAddTool(companion))
        registry.register(GoalLogTool(companion))
    return registry
