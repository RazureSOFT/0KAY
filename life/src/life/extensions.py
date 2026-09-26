"""Optional extension registry with fail-closed availability.

Extensions never pretend to be connected: an unknown, ambiguous, incomplete or
unprobed extension is reported unavailable, and calls against it raise instead of
silently degrading into a fake success.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable

API_VERSION = "1"


class ExtensionUnavailable(RuntimeError):
    pass


@dataclass
class Extension:
    name: str
    api_version: str = API_VERSION
    probe: Callable[[], bool] | None = None
    detail: str = ""


class ExtensionRegistry:
    def __init__(self) -> None:
        self._items: dict[str, Extension] = {}

    def register(self, name: str, api_version: str = API_VERSION, probe: Callable[[], bool] | None = None, detail: str = "") -> None:
        self._items[str(name)] = Extension(name=str(name), api_version=api_version, probe=probe, detail=detail)

    def _available(self, extension: Extension) -> tuple[bool, str]:
        if extension.api_version != API_VERSION:
            return False, f"api mismatch ({extension.api_version})"
        if extension.probe is None:
            return False, "no provider"
        try:
            ok = bool(extension.probe())
        except Exception:
            return False, "probe failed"
        return (True, "ok") if ok else (False, extension.detail or "unavailable")

    def is_available(self, name: str) -> bool:
        extension = self._items.get(str(name))
        return bool(extension and self._available(extension)[0])

    def status(self) -> dict[str, dict[str, Any]]:
        return {name: {"available": available, "reason": reason, "api_version": extension.api_version}
                for name, extension in self._items.items()
                for available, reason in [self._available(extension)]}

    def call(self, name: str, func: Callable[..., Any], *args, **kwargs):
        extension = self._items.get(str(name))
        available, reason = self._available(extension) if extension else (False, "unknown extension")
        if not available:
            raise ExtensionUnavailable(f"{name}: {reason}")
        return func(*args, **kwargs)
