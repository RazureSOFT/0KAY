"""A missing/expired Core credential must be loud, and must stop retrying.

Two faults in `run.err.log` shared the same shape: Core answered
`PERMISSION_DENIED: first-party plugin requires a dedicated enrollment key` and
`/api/settings/life` returned 401, yet the plugin logged one warning and kept
serving on stale defaults forever — re-registering (and re-polling) every 10s
against a credential that retrying cannot fix.

These tests pin the new behaviour: a credential fault is classified as such,
escalated to `error`, backed off, and kept visible through a health accessor.
"""
import asyncio
import sys
import types
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "gen" / "python"))

import httpx  # noqa: E402

from life.core_client import CoreClient  # noqa: E402
from life.grpc.server import LifeServiceServicer  # noqa: E402

_AUTH_ERROR = "PERMISSION_DENIED: first-party plugin requires a dedicated enrollment key"


# --- CoreClient.register ------------------------------------------------
class _RaisingStub:
    def __init__(self, error: Exception):
        self.error = error
        self.calls = 0

    def Register(self, *args, **kwargs):  # noqa: N802 - gRPC stub shape
        self.calls += 1
        raise self.error


class _OkStub:
    def __init__(self):
        self.calls = 0

    def Register(self, *args, **kwargs):  # noqa: N802 - gRPC stub shape
        self.calls += 1
        return types.SimpleNamespace(success=True, plugin_id="p-1", service_token="tok")


class _RejectStub:
    def Register(self, *args, **kwargs):  # noqa: N802 - gRPC stub shape
        return types.SimpleNamespace(success=False, message="plugin quota exceeded",
                                     plugin_id="", service_token="")


class RegistrationFuse(unittest.TestCase):
    def _client(self) -> CoreClient:
        client = CoreClient()
        client._connected = True  # skip the real channel
        return client

    def test_classifies_credential_faults(self):
        self.assertTrue(CoreClient._is_auth_error(_AUTH_ERROR))
        self.assertTrue(CoreClient._is_auth_error("UNAUTHENTICATED"))
        self.assertFalse(CoreClient._is_auth_error("connection refused"))
        self.assertFalse(CoreClient._is_auth_error("deadline exceeded"))

    def test_auth_failure_blocks_and_stops_retrying(self):
        client = self._client()
        stub = _RaisingStub(RuntimeError(_AUTH_ERROR))
        client._plugin_stub = stub
        with mock.patch("life.identity.set_identity"):
            self.assertFalse(client.register())
            self.assertTrue(client.registration_blocked)
            # Second attempt must short-circuit instead of hammering Core.
            self.assertFalse(client.register())
        self.assertEqual(stub.calls, 1)

    def test_transient_failure_is_not_blocked(self):
        client = self._client()
        client._plugin_stub = _RejectStub()
        self.assertFalse(client.register())
        self.assertFalse(client.registration_blocked)
        self.assertEqual(client.registration_failures, 1)

    def test_success_clears_the_block(self):
        client = self._client()
        client._mark_registration_blocked(_AUTH_ERROR)
        client._register_blocked_at = 0.0  # backoff window already elapsed
        client._plugin_stub = _OkStub()
        with mock.patch("life.identity.set_identity"):
            self.assertTrue(client.register())
        self.assertFalse(client.registration_blocked)
        self.assertEqual(client.registration_health()["error"], "")


# --- LifeServiceServicer._life_settings --------------------------------
class _FakeResponse:
    def __init__(self, status_code: int, payload=None):
        self.status_code = status_code
        self._payload = payload or {}

    def raise_for_status(self):
        if self.status_code >= 400:
            raise httpx.HTTPStatusError(
                "error", request=httpx.Request("GET", "http://core"), response=self)

    def json(self):
        return self._payload


class _FakeClient:
    def __init__(self, response=None, error=None):
        self._response = response
        self._error = error

    async def __aenter__(self):
        return self

    async def __aexit__(self, *args):
        return False

    async def get(self, *args, **kwargs):
        if self._error is not None:
            raise self._error
        return self._response


class SettingsFuse(unittest.TestCase):
    def _servicer(self) -> LifeServiceServicer:
        # Built without __init__: that would construct a whole LifeEngine.
        svc = LifeServiceServicer.__new__(LifeServiceServicer)
        svc._settings_auth_failures = 0
        svc._settings_unreachable_failures = 0
        svc._settings_degraded = False
        svc._settings_last_error = ""
        return svc

    def test_unauthorized_is_a_credential_fault(self):
        svc = self._servicer()
        with mock.patch("httpx.AsyncClient", return_value=_FakeClient(_FakeResponse(401))):
            self.assertEqual(asyncio.run(svc._life_settings()), {})
        health = svc.settings_health()
        self.assertTrue(health["degraded"])
        self.assertEqual(health["auth_failures"], 1)

    def test_core_down_is_transient_not_degraded(self):
        svc = self._servicer()
        with mock.patch("httpx.AsyncClient",
                        return_value=_FakeClient(error=httpx.ConnectError("refused"))):
            self.assertEqual(asyncio.run(svc._life_settings()), {})
        health = svc.settings_health()
        self.assertFalse(health["degraded"], "a down Core is not a credential fault")
        self.assertEqual(health["unreachable_failures"], 1)

    def test_recovery_clears_degraded_state(self):
        svc = self._servicer()
        with mock.patch("httpx.AsyncClient", return_value=_FakeClient(_FakeResponse(401))):
            asyncio.run(svc._life_settings())
        self.assertTrue(svc.settings_health()["degraded"])
        ok = _FakeClient(_FakeResponse(200, {"values": {"think_model": "m"}}))
        with mock.patch("httpx.AsyncClient", return_value=ok):
            self.assertEqual(asyncio.run(svc._life_settings()), {"think_model": "m"})
        self.assertFalse(svc.settings_health()["degraded"])


if __name__ == "__main__":
    unittest.main()
