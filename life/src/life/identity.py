import threading

_lock = threading.Lock()
_name = ""
_token = ""


def set_identity(name: str, token: str) -> None:
    global _name, _token
    with _lock:
        _name, _token = name or "", token or ""


def get_identity():
    with _lock:
        return _name, _token
