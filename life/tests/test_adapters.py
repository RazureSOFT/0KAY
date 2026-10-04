"""Tests for the multi-instance message-platform layer.

Two things are actually load-bearing here and neither is obvious from reading
the code:

* LIFE is the **server** of the reverse WebSocket. A NapCat client dials in, so
  the tests connect as a *client* and prove an event comes out the other end.
* Several bots must coexist. Registry CRUD, port allocation and session routing
  are what make that true; without them the second bot silently takes the first
  one's port and one of them never receives anything.

Run: ``pytest tests/test_adapters.py -q``
"""
import asyncio
import json
import sys
import tempfile
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "gen" / "python"))

from life.adapters.platforms import (  # noqa: E402
    AdapterInstance,
    AdapterRegistry,
    AdapterRuntime,
    SessionRoute,
    new_instance_id,
)


def _run(coro):
    return asyncio.run(coro)


class RegistryCRUDTests(unittest.TestCase):
    def setUp(self):
        self._dir = tempfile.TemporaryDirectory()
        self.registry = AdapterRegistry(self._dir.name)

    def tearDown(self):
        self._dir.cleanup()

    def test_create_assigns_id_and_persists(self):
        result = self.registry.upsert({"name": "napcat", "platform": "aiocqhttp"})
        self.assertTrue(result["ok"], result)
        instance_id = result["instance"]["id"]
        self.assertTrue(instance_id.startswith("adp_"))

        # A fresh registry over the same directory must see the row: the point of
        # persistence is surviving a restart.
        reopened = AdapterRegistry(self._dir.name)
        self.assertEqual(len(reopened.instances), 1)
        self.assertEqual(reopened.instances[0].id, instance_id)
        self.assertEqual(reopened.instances[0].name, "napcat")

    def test_second_instance_gets_a_free_port(self):
        first = self.registry.upsert({"name": "a", "platform": "aiocqhttp"})
        second = self.registry.upsert({"name": "b", "platform": "aiocqhttp"})
        self.assertNotEqual(first["instance"]["ws_port"], second["instance"]["ws_port"])
        self.assertEqual(first["instance"]["ws_port"], 6199)
        self.assertEqual(second["instance"]["ws_port"], 6200)

    def test_an_empty_name_is_rejected_with_a_readable_message(self):
        result = self.registry.upsert({"name": "", "platform": "aiocqhttp"})
        self.assertFalse(result["ok"])
        self.assertIn("机器人名称不能为空", result["error"])
        self.assertEqual(self.registry.instances, [])

    def test_an_unimplemented_platform_is_rejected(self):
        result = self.registry.upsert({"name": "dc", "platform": "discord"})
        self.assertFalse(result["ok"])
        self.assertIn("尚未实现", result["error"])

    def test_update_keeps_the_id_and_does_not_add_a_second_row(self):
        created = self.registry.upsert({"name": "a", "platform": "aiocqhttp"})
        instance_id = created["instance"]["id"]
        updated = self.registry.upsert({"id": instance_id, "name": "renamed"})
        self.assertTrue(updated["ok"])
        self.assertEqual(updated["instance"]["id"], instance_id)
        self.assertEqual(len(self.registry.instances), 1)
        self.assertEqual(self.registry.instances[0].name, "renamed")

    def test_partial_update_does_not_clear_unsupplied_fields(self):
        created = self.registry.upsert(
            {"name": "a", "platform": "aiocqhttp", "ws_token": "secret", "ws_port": 7001})
        instance_id = created["instance"]["id"]
        self.registry.upsert({"id": instance_id, "name": "b"})
        instance = self.registry.get(instance_id)
        self.assertEqual(instance.ws_token, "secret")
        self.assertEqual(instance.ws_port, 7001)

    def test_toggle_and_delete(self):
        created = self.registry.upsert({"name": "a", "platform": "aiocqhttp"})
        instance_id = created["instance"]["id"]
        self.assertTrue(self.registry.set_enabled(instance_id, True)["ok"])
        self.assertTrue(self.registry.get(instance_id).enabled)
        self.assertTrue(self.registry.delete(instance_id)["ok"])
        self.assertIsNone(self.registry.get(instance_id))
        # Deleting something that is gone is an error, not a crash.
        self.assertFalse(self.registry.delete(instance_id)["ok"])

    def test_unknown_platform_is_rejected_not_stored(self):
        result = self.registry.upsert({"name": "x", "platform": "myspace"})
        self.assertFalse(result["ok"])
        self.assertIn("未知的消息平台类别", result["error"])

    def test_a_deliberately_cleared_host_is_rejected_not_defaulted(self):
        """Clearing 主机 must be an error, not a silent 0.0.0.0 listener."""
        result = self.registry.upsert({"name": "x", "platform": "aiocqhttp", "ws_host": ""})
        self.assertFalse(result["ok"])
        self.assertIn("主机不能为空", result["error"])
        self.assertEqual(self.registry.instances, [])

    def test_an_omitted_host_gets_the_default(self):
        result = self.registry.upsert({"name": "x", "platform": "aiocqhttp"})
        self.assertEqual(result["instance"]["ws_host"], "127.0.0.1")

    def test_an_unparseable_port_is_rejected_not_silently_replaced(self):
        result = self.registry.upsert({"name": "x", "platform": "aiocqhttp", "ws_port": "abc"})
        self.assertFalse(result["ok"])
        self.assertIn("端口必须是数字", result["error"])

    def test_port_out_of_range_is_rejected(self):
        for bad in (99999, -1, "abc"):
            result = self.registry.upsert({"name": "x", "platform": "aiocqhttp", "ws_port": bad})
            self.assertFalse(result["ok"], bad)

    def test_port_zero_or_blank_means_auto_assign(self):
        """A form that has not been filled in yet sends 0 — that must not fail.

        Rejecting 0 would make "add a bot" fail on the very first click, so 0 and
        "" are treated as "pick a free port"; only real garbage is an error.
        """
        for blank in (0, "0", "", None):
            registry = AdapterRegistry(self._dir.name)
            registry.instances = []
            result = registry.upsert({"name": "auto", "platform": "aiocqhttp", "ws_port": blank})
            self.assertTrue(result["ok"], blank)
            self.assertEqual(result["instance"]["ws_port"], 6199)

    def test_the_configured_default_port_is_used_for_new_rows(self):
        self.registry.default_port = 7000
        result = self.registry.upsert({"name": "x", "platform": "aiocqhttp"})
        self.assertEqual(result["instance"]["ws_port"], 7000)

    def test_an_existing_row_keeps_its_port_when_the_field_is_blank(self):
        created = self.registry.upsert({"name": "a", "platform": "aiocqhttp", "ws_port": 7100})
        instance_id = created["instance"]["id"]
        result = self.registry.upsert({"id": instance_id, "name": "b", "ws_port": 0})
        self.assertTrue(result["ok"])
        self.assertEqual(result["instance"]["ws_port"], 7100)


class SessionRoutingTests(unittest.TestCase):
    def setUp(self):
        self._dir = tempfile.TemporaryDirectory()
        self.registry = AdapterRegistry(self._dir.name)

    def tearDown(self):
        self._dir.cleanup()

    def test_first_match_wins_and_default_is_the_fallback(self):
        self.registry.set_routes([
            {"pattern": "qq_group_123", "config_id": "work"},
            {"pattern": "*", "config_id": "catchall"},
        ])
        self.assertEqual(self.registry.config_for_session("qq_group_123"), "work")
        self.assertEqual(self.registry.config_for_session("qq_999"), "catchall")

    def test_no_match_uses_the_default_config(self):
        self.registry.set_default_config("default")
        self.registry.set_routes([{"pattern": "qq_group_123", "config_id": "work"}])
        self.assertEqual(self.registry.config_for_session("qq_999"), "default")

    def test_wildcard_aliases_and_regex_and_prefix(self):
        route_all = SessionRoute(pattern="全部消息", config_id="any")
        self.assertTrue(route_all.matches("qq_1"))
        self.assertTrue(SessionRoute(pattern="*", config_id="x").matches("anything"))
        self.assertTrue(SessionRoute(pattern="/^qq_group_.*/", config_id="x").matches("qq_group_7"))
        self.assertFalse(SessionRoute(pattern="/^qq_group_.*/", config_id="x").matches("qq_7"))
        self.assertTrue(SessionRoute(pattern="qq_group_*", config_id="x").matches("qq_group_9"))
        self.assertFalse(SessionRoute(pattern="qq_group_*", config_id="x").matches("qq_9"))

    def test_a_bad_regex_does_not_raise(self):
        # A user-typed pattern must never take the routing table down.
        self.assertFalse(SessionRoute(pattern="/[unclosed/", config_id="x").matches("qq_1"))

    def test_routes_survive_a_reopen(self):
        self.registry.set_routes([{"pattern": "qq_1", "config_id": "solo"}])
        reopened = AdapterRegistry(self._dir.name)
        self.assertEqual(reopened.config_for_session("qq_1"), "solo")

    def test_pattern_aliases_are_accepted(self):
        """Callers say "session" as often as "pattern"; both must mean the same thing.

        Regression guard: a rule stored from the ``session`` key used to be
        coerced to the ``*`` wildcard, which -- because rules are first-match-wins
        -- silently pinned every conversation to that one config.
        """
        for alias in ("session", "session_id", "session_pattern", "match", "source"):
            with self.subTest(alias=alias):
                registry = AdapterRegistry(tempfile.mkdtemp())
                registry.set_routes([{alias: "qq_group_*", "config_id": "group"}])
                self.assertEqual([r.to_dict() for r in registry.routes],
                                 [{"pattern": "qq_group_*", "config_id": "group"}])
                self.assertEqual(registry.config_for_session("qq_group_7"), "group")
                self.assertEqual(registry.config_for_session("qq_7"), "default")

    def test_a_rule_without_a_pattern_is_dropped_not_wildcarded(self):
        """A malformed row must not become a catch-all.

        Turning it into ``*`` would swallow every later rule and route all
        traffic to one persona -- a silent, system-wide misroute. Dropping it
        degrades to the documented default instead.
        """
        result = self.registry.set_routes([
            {"config_id": "group"},                              # no pattern at all
            {"pattern": "qq_777", "config_id": "vip"},
        ])
        self.assertEqual([r.to_dict() for r in self.registry.routes],
                         [{"pattern": "qq_777", "config_id": "vip"}])
        self.assertEqual(self.registry.config_for_session("qq_888"), "default")
        self.assertEqual(result.get("skipped"), 1)
        self.assertIn("忽略", result.get("warning", ""))

    def test_blank_pattern_is_dropped(self):
        result = self.registry.set_routes([{"pattern": "   ", "config_id": "x"}])
        self.assertEqual(self.registry.routes, [])
        self.assertEqual(result.get("skipped"), 1)

    def test_a_malformed_stored_row_is_ignored_on_load(self):
        """Rows already on disk from a bad write must not poison the table."""
        self.registry.set_routes([{"pattern": "qq_1", "config_id": "solo"}])
        raw = json.loads((Path(self._dir.name) / "adapters.json").read_text(encoding="utf-8"))
        raw["routes"].insert(0, {"config_id": "bogus"})  # simulate a legacy/corrupt row
        (Path(self._dir.name) / "adapters.json").write_text(
            json.dumps(raw, ensure_ascii=False), encoding="utf-8")
        reopened = AdapterRegistry(self._dir.name)
        self.assertEqual([r.to_dict() for r in reopened.routes],
                         [{"pattern": "qq_1", "config_id": "solo"}])
        self.assertEqual(reopened.config_for_session("qq_999"), "default")


class ReverseWebSocketTests(unittest.TestCase):
    """LIFE listens; the platform client dials in. That is the whole contract."""

    def setUp(self):
        self._dir = tempfile.TemporaryDirectory()
        self.registry = AdapterRegistry(self._dir.name)
        self.received: list = []
        self.events: list = []

        async def handler(data, server):
            self.received.append(data)
            self.events.append(data)

        self.handler = handler

    def tearDown(self):
        self._dir.cleanup()

    def _free_port(self) -> int:
        import socket
        with socket.socket() as probe:
            probe.bind(("127.0.0.1", 0))
            return probe.getsockname()[1]

    def test_a_client_can_dial_in_and_its_event_reaches_the_handler(self):
        async def scenario():
            from websockets.asyncio.client import connect

            instance = AdapterInstance(name="t", ws_host="127.0.0.1",
                                       ws_port=self._free_port(), enabled=True)
            runtime = AdapterRuntime(self.registry, self.handler)
            self.registry.instances = [instance]
            result = await runtime.sync()
            self.assertIn(instance.id, result["running"])

            try:
                async with connect(f"ws://127.0.0.1:{instance.ws_port}") as client:
                    await client.send(json.dumps({"post_type": "message", "self_id": 1,
                                                  "user_id": 2, "message": "hi"}))
                    for _ in range(100):
                        if self.received:
                            break
                        await asyncio.sleep(0.01)
                    self.assertEqual(len(self.received), 1)
                    self.assertEqual(self.received[0]["message"], "hi")
            finally:
                await runtime.stop_all()

        _run(scenario())

    def test_a_bad_token_is_refused(self):
        async def scenario():
            import websockets
            from websockets.asyncio.client import connect

            instance = AdapterInstance(name="t", ws_host="127.0.0.1",
                                       ws_port=self._free_port(), enabled=True,
                                       ws_token="correct-horse")
            runtime = AdapterRuntime(self.registry, self.handler)
            self.registry.instances = [instance]
            await runtime.sync()
            try:
                with self.assertRaises(Exception):
                    async with connect(f"ws://127.0.0.1:{instance.ws_port}") as client:
                        await client.send(json.dumps({"post_type": "message", "message": "x"}))
                        await asyncio.sleep(0.2)
                        await client.recv()
                    self.assertEqual(self.received, [])
            finally:
                await runtime.stop_all()

        _run(scenario())

    def test_a_good_token_via_query_string_is_accepted(self):
        async def scenario():
            from websockets.asyncio.client import connect

            instance = AdapterInstance(name="t", ws_host="127.0.0.1",
                                       ws_port=self._free_port(), enabled=True,
                                       ws_token="abc123")
            runtime = AdapterRuntime(self.registry, self.handler)
            self.registry.instances = [instance]
            await runtime.sync()
            try:
                async with connect(f"ws://127.0.0.1:{instance.ws_port}/?access_token=abc123") as client:
                    await client.send(json.dumps({"post_type": "message", "message": "ok"}))
                    for _ in range(100):
                        if self.received:
                            break
                        await asyncio.sleep(0.01)
                    self.assertEqual(len(self.received), 1)
            finally:
                await runtime.stop_all()

        _run(scenario())

    def test_outbound_call_correlates_on_echo(self):
        """Sending when NapCat exposes no HTTP port: an action frame awaits its echo."""

        async def scenario():
            from websockets.asyncio.client import connect

            instance = AdapterInstance(name="t", ws_host="127.0.0.1",
                                       ws_port=self._free_port(), enabled=True)
            runtime = AdapterRuntime(self.registry, self.handler)
            self.registry.instances = [instance]
            await runtime.sync()
            server = runtime.servers[instance.id]

            async def fake_client():
                async with connect(f"ws://127.0.0.1:{instance.ws_port}") as client:
                    raw = await client.recv()
                    frame = json.loads(raw)
                    self.assertEqual(frame["action"], "send_private_msg")
                    await client.send(json.dumps(
                        {"status": "ok", "retcode": 0, "data": {"message_id": 7},
                         "echo": frame["echo"]}))
                    await asyncio.sleep(0.2)

            try:
                task = asyncio.create_task(fake_client())
                for _ in range(200):
                    if server.connected:
                        break
                    await asyncio.sleep(0.01)
                data = await server.call_api("send_private_msg", {"user_id": 1, "message": "x"})
                self.assertEqual(data.get("message_id"), 7)
                await task
            finally:
                await runtime.stop_all()

        _run(scenario())

    def test_disabling_an_instance_stops_its_listener(self):
        async def scenario():
            instance = AdapterInstance(name="t", ws_host="127.0.0.1",
                                       ws_port=self._free_port(), enabled=True)
            runtime = AdapterRuntime(self.registry, self.handler)
            self.registry.instances = [instance]
            await runtime.sync()
            self.assertIn(instance.id, runtime.servers)

            self.registry.set_enabled(instance.id, False)
            result = await runtime.sync()
            self.assertIn(instance.id, result["stopped"])
            self.assertEqual(runtime.servers, {})

        _run(scenario())

    def test_master_switch_stops_every_listener(self):
        async def scenario():
            instance = AdapterInstance(name="t", ws_host="127.0.0.1",
                                       ws_port=self._free_port(), enabled=True)
            runtime = AdapterRuntime(self.registry, self.handler)
            self.registry.instances = [instance]
            await runtime.sync()
            self.assertTrue(runtime.servers)
            runtime.enabled = False
            result = await runtime.sync()
            self.assertEqual(runtime.servers, {})
            self.assertIn(instance.id, result["stopped"])

        _run(scenario())

    def test_sync_is_idempotent(self):
        """Called every 10s from the background loop: it must not thrash."""

        async def scenario():
            instance = AdapterInstance(name="t", ws_host="127.0.0.1",
                                       ws_port=self._free_port(), enabled=True)
            runtime = AdapterRuntime(self.registry, self.handler)
            self.registry.instances = [instance]
            first = await runtime.sync()
            second = await runtime.sync()
            self.assertEqual(first["started"], [instance.id])
            self.assertEqual(second["started"], [])
            self.assertEqual(second["stopped"], [])
            await runtime.stop_all()

        _run(scenario())

    def test_a_port_move_rebinds(self):
        async def scenario():
            port_a = self._free_port()
            instance = AdapterInstance(name="t", ws_host="127.0.0.1",
                                       ws_port=port_a, enabled=True)
            runtime = AdapterRuntime(self.registry, self.handler)
            self.registry.instances = [instance]
            await runtime.sync()

            moved = self._free_port()
            self.registry.upsert({"id": instance.id, "ws_port": moved})
            await runtime.sync()
            self.assertEqual(runtime.servers[instance.id].instance.ws_port, moved)
            await runtime.stop_all()

        _run(scenario())


class RuntimeStatusTests(unittest.TestCase):
    def setUp(self):
        self._dir = tempfile.TemporaryDirectory()

    def tearDown(self):
        self._dir.cleanup()

    def test_status_reports_a_disabled_instance_without_a_server(self):
        async def scenario():
            registry = AdapterRegistry(self._dir.name)
            instance = registry.upsert({"name": "off", "platform": "aiocqhttp"})["instance"]
            runtime = AdapterRuntime(registry, lambda data, server: None)
            await runtime.sync()
            rows = runtime.status()
            self.assertEqual(len(rows), 1)
            self.assertFalse(rows[0]["running"])
            self.assertFalse(rows[0]["connected"])

        _run(scenario())

    def test_public_dict_redacts_the_token(self):
        instance = AdapterInstance(name="t", ws_token="hunter2")
        self.assertEqual(instance.public_dict()["ws_token"], "")
        self.assertTrue(instance.public_dict()["has_ws_token"])
        self.assertNotIn("hunter2", json.dumps(instance.public_dict()))

    def test_new_instance_id_is_unique(self):
        self.assertNotEqual(new_instance_id(), new_instance_id())


if __name__ == "__main__":
    unittest.main()
