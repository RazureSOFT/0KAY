"""0kay API devkit — Python client (stdlib only).

    from okay_devkit import Okay

    ok = Okay()                     # prompts for the Core port if unknown
    ok = Okay(port=8080)            # or pass it
    ok = Okay(base_url="http://127.0.0.1:8080")

    ok.health["status"]             # "ok"
    ok.get_core().plugins           # 6
    ok.get_plugin("agent").is_enabled        # -> bool
    ok.get_plugin("plugin_04df...").is_healthy
    [p.name for p in ok.plugins]
    ok.get("/api/models")           # raw JSON from any route
"""

from __future__ import annotations

import json
import os
import urllib.parse
import urllib.request

DEFAULT_PORT = 8080


def resolve_base_url(port: int | None = None, host: str = "127.0.0.1") -> str:
    """Explicit port > CORE_HTTP(_ADDR) > OKAY_CORE_PORT > interactive prompt."""
    if port:
        return f"http://{host}:{int(port)}"
    explicit = os.environ.get("CORE_HTTP") or os.environ.get("CORE_HTTP_ADDR")
    if explicit:
        return explicit.rstrip("/")
    env_port = (os.environ.get("OKAY_CORE_PORT") or "").strip()
    if env_port.isdigit():
        return f"http://{host}:{env_port}"
    try:
        answer = input(f"0kay Core port [{DEFAULT_PORT}]: ").strip()
    except EOFError:
        answer = ""
    return f"http://{host}:{answer or DEFAULT_PORT}"


class Plugin:
    """One plugin from GET /api/plugins."""

    def __init__(self, data: dict):
        self._data = data or {}

    @property
    def id(self) -> str:
        return str(self._data.get("plugin_id") or "")

    @property
    def name(self) -> str:
        return str(self._data.get("name") or "")

    @property
    def version(self) -> str:
        return str(self._data.get("version") or "")

    @property
    def type(self) -> str:
        return str(self._data.get("type") or "")

    @property
    def status(self) -> str:
        return str(self._data.get("status") or "")

    @property
    def capabilities(self) -> list:
        return list(self._data.get("capabilities") or [])

    @property
    def active_tasks(self) -> int:
        return int(self._data.get("active_tasks") or 0)

    @property
    def is_enabled(self) -> bool:
        return not bool(self._data.get("disabled", False))

    @property
    def is_healthy(self) -> bool:
        return self.status == "PLUGIN_STATUS_HEALTHY"

    def raw(self) -> dict:
        return dict(self._data)

    def __repr__(self) -> str:
        return f"<Plugin {self.name} ({self.id}) enabled={self.is_enabled} status={self.status}>"


class Core:
    """The 0kay Core itself, from GET /health."""

    def __init__(self, client: "Okay", data: dict):
        self._client = client
        self._data = data or {}

    @property
    def status(self) -> str:
        return str(self._data.get("status") or "")

    @property
    def healthy(self) -> int:
        return int(self._data.get("healthy") or 0)

    @property
    def plugins(self) -> int:
        return int(self._data.get("plugins") or 0)

    @property
    def base_url(self) -> str:
        return self._client.base_url

    def __repr__(self) -> str:
        return f"<Core {self.base_url} status={self.status} healthy={self.healthy}/{self.plugins}>"


class Okay:
    """Thin, dependency-free client over the Core HTTP API."""

    def __init__(self, port: int | None = None, host: str = "127.0.0.1",
                 base_url: str | None = None, timeout: float = 10.0):
        self.base_url = (base_url or resolve_base_url(port, host)).rstrip("/")
        self.timeout = timeout

    # --- raw HTTP -----------------------------------------------------------
    def get(self, path: str, **params):
        url = self.base_url + path
        if params:
            url += ("&" if "?" in url else "?") + urllib.parse.urlencode(params)
        request = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(request, timeout=self.timeout) as response:
            return json.load(response)

    def post(self, path: str, body=None):
        data = json.dumps(body or {}).encode("utf-8")
        request = urllib.request.Request(
            self.base_url + path, data=data, method="POST",
            headers={"Content-Type": "application/json", "Accept": "application/json"},
        )
        with urllib.request.urlopen(request, timeout=self.timeout) as response:
            raw = response.read()
            return json.loads(raw) if raw else None

    # --- discovered surface -------------------------------------------------
    @property
    def health(self) -> dict:
        return self.get("/health")

    @property
    def plugins(self) -> list:
        return [Plugin(p) for p in (self.get("/api/plugins") or [])]

    @property
    def settings_sections(self) -> list:
        payload = self.get("/api/settings/sections") or {}
        return list(payload.get("sections") or [])

    def get_plugin(self, key: str):
        """Find a plugin by id or name (case-insensitive). Returns None if absent."""
        needle = str(key or "").strip().lower()
        for plugin in self.plugins:
            if plugin.id.lower() == needle or plugin.name.lower() == needle:
                return plugin
        return None

    def require_plugin(self, key: str) -> Plugin:
        plugin = self.get_plugin(key)
        if plugin is None:
            raise KeyError(f"plugin not found: {key}")
        return plugin

    def get_core(self) -> Core:
        return Core(self, self.health)

    def surface(self) -> dict:
        """A snapshot of everything the devkit discovered."""
        return {
            "base_url": self.base_url,
            "health": self.health,
            "plugins": [p.raw() for p in self.plugins],
            "settings_sections": self.settings_sections,
        }
