import asyncio
import json
import sys
import threading
import unittest
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.tools.tools import MinecraftTool, RuntimeToolConfig, create_default_registry


class _Handler(BaseHTTPRequestHandler):
    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length) or b"{}")
        self.server.requests.append((self.path, body))
        payload = json.dumps({"ok": True, "result": {"path": self.path, "echo": body}}).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *args):
        pass


class MinecraftToolTests(unittest.TestCase):
    def setUp(self):
        self.server = HTTPServer(("127.0.0.1", 0), _Handler)
        self.server.requests = []
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.url = f"http://127.0.0.1:{self.server.server_port}"

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()

    def test_disabled_is_fail_closed(self):
        tool = MinecraftTool(RuntimeToolConfig(minecraft_enabled=False, minecraft_url=self.url))
        result = asyncio.run(tool.execute(action="connect", host="example"))
        self.assertFalse(result.success)
        self.assertEqual(self.server.requests, [])

    def test_action_is_forwarded(self):
        tool = MinecraftTool(RuntimeToolConfig(minecraft_enabled=True, minecraft_url=self.url))
        result = asyncio.run(tool.execute(action="chat", message="hello"))
        self.assertTrue(result.success)
        path, body = self.server.requests[-1]
        self.assertEqual(path, "/action")
        self.assertEqual(body["action"], "chat")
        self.assertEqual(body["args"]["message"], "hello")

    def test_autopilot_routes(self):
        tool = MinecraftTool(RuntimeToolConfig(minecraft_enabled=True, minecraft_url=self.url))
        asyncio.run(tool.execute(action="autopilot_start", goal="play together"))
        self.assertEqual(self.server.requests[-1][0], "/autopilot/start")
        asyncio.run(tool.execute(action="autopilot_stop"))
        self.assertEqual(self.server.requests[-1][0], "/autopilot/stop")

    def test_registry_exposes_minecraft(self):
        registry = create_default_registry(config=RuntimeToolConfig())
        self.assertIsNotNone(registry.get("minecraft"))


if __name__ == "__main__":
    unittest.main()
