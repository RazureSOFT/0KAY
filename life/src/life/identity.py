"""Per-plugin identity (name + service token) issued by Core at registration.

Core enforces each plugin's declared API allow-list and outbound allow-list; a
plugin attributes its calls with `X-0KAY-Plugin: <name>` and
`Authorization: Bearer <service-token>`.
"""
import threading

_lock = threading.Lock()
_name = ""
_token = ""


def set_identity(name: str, token: str) -> None:
    """Record the identity returned by Core in the Register response."""
    global _name, _token
    with _lock:
        _name, _token = name or "", token or ""


def get_identity():
    """Return (name, token); both empty until the plugin has registered."""
    with _lock:
        return _name, _token
