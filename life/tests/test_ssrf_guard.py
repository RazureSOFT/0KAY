import asyncio
import os
import sys
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from life.content import ContentSystem
from life.media import MediaPipeline
from life.tools.tools import RuntimeToolConfig, _assert_public_http_url, assert_public_host

LOOPBACK = "127.0.0.1"
PRIVATE = "10.0.0.5"
LINK_LOCAL = "169.254.169.254"  # cloud metadata endpoint
PUBLIC = "93.184.216.34"


class HostGuard(unittest.TestCase):
    def test_public_host_allowed(self):
        self.assertEqual(assert_public_host(PUBLIC, 443), PUBLIC)

    def test_private_and_link_local_blocked(self):
        for host in (LOOPBACK, PRIVATE, LINK_LOCAL, "192.168.1.1"):
            with self.subTest(host=host):
                with self.assertRaises(ValueError) as ctx:
                    assert_public_host(host, 80)
                self.assertIn("non-public", str(ctx.exception))

    def test_unresolvable_host_still_blocked_with_exemption(self):
        # The opt-out only skips the private-address rule, not validation.
        with patch.dict(os.environ, {"LIFE_TEST_ALLOW_PRIVATE": "1"}):
            with self.assertRaises(ValueError):
                assert_public_host("no-such-host.invalid", 0, "LIFE_TEST_ALLOW_PRIVATE")

    def test_exemption_env_allows_private(self):
        with patch.dict(os.environ, {"LIFE_TEST_ALLOW_PRIVATE": "1"}):
            self.assertEqual(assert_public_host(LOOPBACK, 0, "LIFE_TEST_ALLOW_PRIVATE"), LOOPBACK)
        with patch.dict(os.environ, {"LIFE_TEST_ALLOW_PRIVATE": "0"}):
            with self.assertRaises(ValueError):
                assert_public_host(LOOPBACK, 0, "LIFE_TEST_ALLOW_PRIVATE")

    def test_url_guard_blocks_metadata_and_localhost(self):
        for url in (f"http://{LOOPBACK}/", f"http://{LINK_LOCAL}/latest/meta-data/", f"http://{PRIVATE}/"):
            with self.subTest(url=url):
                with self.assertRaises(ValueError):
                    _assert_public_http_url(url)

    def test_url_guard_requires_http_scheme(self):
        with self.assertRaises(ValueError):
            _assert_public_http_url("file:///etc/passwd")
        with self.assertRaises(ValueError):
            _assert_public_http_url("ftp://example.com/x")

    def test_url_guard_exemption(self):
        with patch.dict(os.environ, {"LIFE_TEST_ALLOW_PRIVATE": "yes"}):
            self.assertEqual(_assert_public_http_url(f"http://{LOOPBACK}/", "LIFE_TEST_ALLOW_PRIVATE"),
                             f"http://{LOOPBACK}/")


class ContentFetchGuard(unittest.TestCase):
    def test_private_feed_rejected_before_any_request(self):
        content = ContentSystem(settings_getter=lambda: {})
        with self.assertRaises(ValueError):
            asyncio.run(content.fetch_feed(f"http://{LOOPBACK}/rss"))

    def test_metadata_endpoint_rejected(self):
        content = ContentSystem(settings_getter=lambda: {})
        with self.assertRaises(ValueError):
            asyncio.run(content.fetch_feed(f"http://{LINK_LOCAL}/latest/meta-data/"))

    def test_scheme_smuggling_rejected(self):
        content = ContentSystem(settings_getter=lambda: {})
        with self.assertRaises(ValueError):
            asyncio.run(content.fetch_feed("gopher://example.com/"))


class TtsGuard(unittest.TestCase):
    def test_private_tts_endpoint_is_refused(self):
        pipeline = MediaPipeline(settings_getter=lambda: {"tts_endpoint": f"http://{LOOPBACK}:8080/tts"})
        self.assertIsNone(asyncio.run(pipeline.synthesize("你好")))

    def test_unset_endpoint_stays_disabled(self):
        pipeline = MediaPipeline(settings_getter=lambda: {})
        self.assertFalse(pipeline.has_tts())
        self.assertIsNone(asyncio.run(pipeline.synthesize("你好")))

    def test_scheme_rejected_even_with_allowlist(self):
        pipeline = MediaPipeline(settings_getter=lambda: {"tts_endpoint": "file:///etc/passwd"})
        self.assertIsNone(asyncio.run(pipeline.synthesize("你好")))


class MailApprovalFailsClosed(unittest.TestCase):
    def test_dataclass_defaults_are_fail_closed(self):
        config = RuntimeToolConfig()
        self.assertTrue(config.mail_require_approval)
        self.assertFalse(config.mail_auto_approve_all)

    def test_engine_fallbacks_fail_closed(self):
        import inspect
        from life.engine import legacy

        source = inspect.getsource(legacy)
        self.assertNotIn('mail_require_approval", False)', source)
        self.assertIn('mail_require_approval", True)', source)


if __name__ == "__main__":
    unittest.main()
