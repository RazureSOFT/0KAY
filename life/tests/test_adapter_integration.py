import asyncio
import json
import tempfile
import unittest
from types import SimpleNamespace

from life.adapters.platforms import AdapterInstance, AdapterRegistry, AdapterRuntime, ReverseWSServer
from life.adapters.inbound import InboundBridge


class AdapterIntegrationTests(unittest.TestCase):
    def test_real_instance_group_reply_and_echo_share_one_socket(self):
        async def run():
            from websockets.asyncio.client import connect
            with tempfile.TemporaryDirectory() as directory:
                registry = AdapterRegistry(directory)
                turns = []
                async def process_message(**kwargs):
                    turns.append(kwargs)
                    yield {"type": "chunk", "chunk": "hello", "done": True}
                engine = SimpleNamespace(process_message=process_message)
                async def handle(data, server):
                    engine.adapter_runtime.note_self_id(server.instance.id, data["self_id"])
                    await InboundBridge(engine, server.instance).handle(data, server)
                    completed.set()
                completed = asyncio.Event()
                runtime = AdapterRuntime(registry, handle)
                engine.adapter_runtime = runtime
                instance = AdapterInstance(name="integration", ws_port=0)
                server = ReverseWSServer(instance, handle)
                runtime.servers[instance.id] = server
                await server.start()
                try:
                    port = server._server.sockets[0].getsockname()[1]
                    async with connect(f"ws://127.0.0.1:{port}") as socket:
                        await socket.send(json.dumps({"post_type": "message", "self_id": 100,
                            "group_id": 5, "user_id": 9, "message": [{"type": "at", "data": {"qq": "100"}}]}))
                        frame = json.loads(await asyncio.wait_for(socket.recv(), 2))
                        await socket.send(json.dumps({"echo": frame["echo"], "status": "ok", "retcode": 0}))
                        await asyncio.wait_for(completed.wait(), 2)
                        self.assertEqual(frame["params"]["group_id"], 5)
                        self.assertEqual(len(turns), 1)
                        self.assertTrue(turns[0]["session_id"].startswith(f"bot:{instance.id}:"))
                finally:
                    await runtime.stop_all()
        asyncio.run(run())

    def test_sessions_isolated_and_legacy_owner_persists(self):
        with tempfile.TemporaryDirectory() as directory:
            registry = AdapterRegistry(directory)
            a = AdapterInstance(name="a")
            registry.instances = [a]
            registry._save()
            registry.legacy_session_instance = a.id
            registry._save()
            registry = AdapterRegistry(directory)
            runtime = AdapterRuntime(registry, None)
            b = AdapterInstance(name="b")
            event = {"user_id": 9}
            self.assertEqual(runtime.session_id(a, event), "qq_9")
            self.assertNotEqual(runtime.session_id(a, event), runtime.session_id(b, event))

    def test_remote_bind_requires_token_at_configuration_and_start(self):
        instance = AdapterInstance(name="remote", ws_host="0.0.0.0")
        self.assertTrue(instance.validate())
        self.assertFalse(asyncio.run(ReverseWSServer(instance, None).start()))
        instance.ws_token = "test-token"
        self.assertEqual(instance.validate(), [])
