"""Authorization headers for Core HTTP calls.

Plugins attribute their calls with the name + service token Core issued at
registration (`X-0KAY-Plugin` + `Authorization: Bearer`), which Core uses to
enforce the plugin's declared API allow-list. Before registration, or for
non-plugin callers, fall back to the paired-device / shared API token.
"""
import os

from life.identity import get_identity


def auth_headers() -> dict:
    """Return plugin-identity or Bearer headers for a Core HTTP call."""
    name, token = get_identity()
    if name and token:
        return {"X-0KAY-Plugin": name, "Authorization": f"Bearer {token}"}
    token = os.getenv("CORE_PAIR_TOKEN") or os.getenv("CORE_API_TOKEN")
    return {"Authorization": f"Bearer {token}"} if token else {}


def require_auth_headers() -> dict:
    """Like :func:`auth_headers`, but fail closed when no credentials exist.

    Use this for privileged Core endpoints (e.g. one that returns raw provider
    API keys): silently issuing the request with no ``Authorization`` header is
    worse than not issuing it at all.
    """
    headers = auth_headers()
    if not headers:
        raise RuntimeError("no Core credentials available (plugin identity or CORE_PAIR_TOKEN/CORE_API_TOKEN)")
    return headers
