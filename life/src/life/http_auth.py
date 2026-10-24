import os

from life.identity import get_identity


def auth_headers() -> dict:
    name, token = get_identity()
    if name and token:
        return {"X-0KAY-Plugin": name, "Authorization": f"Bearer {token}"}
    token = os.getenv("CORE_PAIR_TOKEN") or os.getenv("CORE_API_TOKEN")
    return {"Authorization": f"Bearer {token}"} if token else {}


def require_auth_headers() -> dict:
    headers = auth_headers()
    if not headers:
        raise RuntimeError("no Core credentials available (plugin identity or CORE_PAIR_TOKEN/CORE_API_TOKEN)")
    return headers
