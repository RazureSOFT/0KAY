"""Outgoing Core calls must attribute themselves.

Core authenticates loopback implicitly, but a non-loopback Core requires a
paired/shared token and every plugin call should carry its identity.  These
tests pin that the service token / plugin name ride every steady-state call
(heartbeat, agent query/dispatch, direct tool run, cancel), not just Register.
"""
import os
import sys
import unittest
from pathlib import Path
from types import SimpleNamespace
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life import identity
from life.core_client import CoreClient


class _FakeStub:
    def __init__(self):
        self.calls = []

    def _record(self, name, metadata):
        self.calls.append((name, metadata))

    def Heartbeat(self, request, timeout=None, metadata=None):
        self._record("Heartbeat", metadata)
        return SimpleNamespace(ok=True, shutdown_signal=False)

    def ListAgents(self, request, timeout=None, metadata=None):
        self._record("ListAgents", metadata)
        return SimpleNamespace(agents=[], online_count=0)

    def UseAgent(self, request, timeout=None, metadata=None):
        self._record("UseAgent", metadata)
        return SimpleNamespace(accepted=True, task_id=request.task_id, message="ok")

    def RunDirect(self, request, timeout=None, metadata=None):
        self._record("RunDirect", metadata)
        return SimpleNamespace(success=True, result="{}", error="")

    def CancelAgent(self, request, timeout=None, metadata=None):
        self._record("CancelAgent", metadata)
        return SimpleNamespace(success=True, message="ok")


class OutgoingAuth(unittest.TestCase):
    def setUp(self):
        self._env = mock.patch.dict(os.environ, {}, clear=False)
        self._env.start()
        for key in ("CORE_PAIR_TOKEN", "CORE_API_TOKEN"):
            os.environ.pop(key, None)
        identity.set_identity("", "")
        self.plugin_stub = _FakeStub()
        self.core_stub = _FakeStub()
        self.client = CoreClient()
        self.client._connected = True
        self.client.plugin_id = "life"
        self.client._plugin_stub = self.plugin_stub
        self.client._core_stub = self.core_stub

    def tearDown(self):
        identity.set_identity("", "")
        self._env.stop()

    def test_metadata_is_none_without_any_credential(self):
        self.assertIsNone(self.client._outgoing_metadata())

    def test_service_token_and_plugin_name_are_presented(self):
        identity.set_identity("life", "svc-123")
        metadata = dict(self.client._outgoing_metadata())
        self.assertEqual(metadata["authorization"], "Bearer svc-123")
        self.assertEqual(metadata["x-0kay-plugin"], "life")

    def test_shared_core_token_takes_precedence(self):
        identity.set_identity("life", "svc-123")
        os.environ["CORE_API_TOKEN"] = "shared-xyz"
        metadata = dict(self.client._outgoing_metadata())
        self.assertEqual(metadata["authorization"], "Bearer shared-xyz")

    def test_every_steady_state_call_carries_the_metadata(self):
        identity.set_identity("life", "svc-123")
        self.client.heartbeat(active_tasks=1)
        self.client.list_agents()
        self.client.use_agent("t1", "do a thing")
        self.client.run_agent_tool("computeruse", {"action": "screenshot"})
        self.client.cancel_agent("t1")
        seen = {name: metadata for name, metadata in
                (self.plugin_stub.calls + self.core_stub.calls)}
        self.assertEqual(set(seen), {"Heartbeat", "ListAgents", "UseAgent", "RunDirect", "CancelAgent"})
        for name, metadata in seen.items():
            self.assertEqual(dict(metadata).get("authorization"), "Bearer svc-123", name)


if __name__ == "__main__":
    unittest.main()
