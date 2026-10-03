"""Mail tools now delegate to the built-in 0kay-mcp mail server.

These tests pin the delegation payload, the mcp_enabled kill-switch and the
approval scope (mail reached through the generic `mcp` tool must still be
gated), all of which were introduced when the SMTP/IMAP implementation left
L.I.F.E.
"""

import asyncio
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.tools.tools import GetMailTool, RuntimeToolConfig, SendMailTool, ToolRegistry


class FakeCore:
    def __init__(self, payload=None):
        self.calls = []
        self.payload = payload or {
            "success": True,
            "result": '{"server":"mail","tool":"getmail","result":{"emails":[],"total":0}}',
        }

    def run_agent_tool(self, tool, args, caller):
        self.calls.append((tool, args, caller))
        return self.payload


class MailMcpDelegation(unittest.TestCase):
    def test_getmail_calls_mcp_server_mail(self):
        core = FakeCore()
        result = asyncio.run(GetMailTool(core, RuntimeToolConfig()).execute(limit=3, unread_only=True))
        self.assertTrue(result.success)
        tool, payload, caller = core.calls[0]
        self.assertEqual(tool, "mcp")
        self.assertEqual(caller, "life-getmail")
        self.assertEqual(payload["action"], "call")
        self.assertEqual(payload["server"], "mail")
        self.assertEqual(payload["tool"], "getmail")
        self.assertEqual(payload["args"], {"limit": 3, "unread_only": True})
        # The agent wraps the mail result; life unwraps the inner object.
        self.assertEqual(result.data, {"emails": [], "total": 0})

    def test_sendmail_calls_mcp_server_mail(self):
        core = FakeCore(payload={"success": True, "result": '{"server":"mail","tool":"sendmail","result":{"to":"a@b.c"}}'})
        result = asyncio.run(SendMailTool(core, RuntimeToolConfig()).execute(to="a@b.c", subject="s", body="b"))
        self.assertTrue(result.success)
        payload = core.calls[0][1]
        self.assertEqual(payload["tool"], "sendmail")
        self.assertEqual(payload["args"], {"to": "a@b.c", "subject": "s", "body": "b"})

    def test_mcp_disabled_blocks_both_tools(self):
        core = FakeCore()
        config = RuntimeToolConfig(mcp_enabled=False)
        self.assertFalse(asyncio.run(GetMailTool(core, config).execute()).success)
        self.assertFalse(asyncio.run(SendMailTool(core, config).execute(to="a@b.c", body="b")).success)
        self.assertEqual(core.calls, [])

    def test_transport_error_is_reported(self):
        class Broken:
            def run_agent_tool(self, tool, args, caller):
                raise RuntimeError("core down")

        result = asyncio.run(GetMailTool(Broken(), RuntimeToolConfig()).execute())
        self.assertFalse(result.success)
        self.assertIn("core down", result.error)

    def test_mcp_error_surfaces(self):
        core = FakeCore(payload={"success": False, "error": "SMTP 未配置"})
        result = asyncio.run(SendMailTool(core, RuntimeToolConfig()).execute(to="a@b.c", body="b"))
        self.assertFalse(result.success)
        self.assertIn("SMTP", result.error)

    def test_non_json_result_is_reported_as_failure(self):
        core = FakeCore(payload={"success": True, "result": "not json"})
        result = asyncio.run(GetMailTool(core, RuntimeToolConfig()).execute())
        self.assertFalse(result.success)
        self.assertIn("unexpected mail response", result.error)


class ApprovalScope(unittest.TestCase):
    def setUp(self):
        self.registry = ToolRegistry()
        self.registry.approval_tools = {"getmail", "sendmail"}

    def test_typed_mail_needs_approval(self):
        self.assertTrue(self.registry.needs_approval("getmail", {}))
        self.assertTrue(self.registry.needs_approval("sendmail", {}))

    def test_mail_via_generic_mcp_needs_approval(self):
        self.assertTrue(self.registry.needs_approval("mcp", {"action": "call", "server": "mail", "tool": "sendmail"}))
        self.assertTrue(self.registry.needs_approval("mcp", {"action": "call", "server": "mail", "tool": "getmail"}))

    def test_other_mcp_calls_are_not_gated(self):
        self.assertFalse(self.registry.needs_approval("mcp", {"action": "call", "server": "filesystem", "tool": "read"}))
        self.assertFalse(self.registry.needs_approval("mcp", {"action": "list"}))
        self.assertFalse(self.registry.needs_approval("search", {"query": "x"}))


if __name__ == "__main__":
    unittest.main()
