"""Authorization headers for Core HTTP calls.

Plugins talk to Core over loopback (no token required) or, when paired with a
remote Core, with the paired-device token. `CORE_API_TOKEN` covers deployments
that protect every caller with a shared token.
"""
import os


def auth_headers() -> dict:
    """Return a Bearer header for the paired-device or API token, if configured."""
    token = os.getenv("CORE_PAIR_TOKEN") or os.getenv("CORE_API_TOKEN")
    return {"Authorization": f"Bearer {token}"} if token else {}
