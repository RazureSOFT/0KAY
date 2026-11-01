"""The version on screen is the gateway's, and it follows a restart.

The TUI's own number is only what it falls back to when nothing answers.
"""

import time
import unittest

from kit.app import TUI_VERSION
from test_kit import make_app


def pumped(app, predicate, timeout=3.0):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        app._drain()
        if predicate():
            return True
        time.sleep(0.01)
    return predicate()


class Version(unittest.TestCase):
    def test_the_banner_shows_the_core_version(self):
        app, capture = make_app(width=100, height=34)
        app.core_version = "9.9.9"
        app._draw()
        body = chr(10).join(capture.frame.lines())
        self.assertIn("v9.9.9", body)
        self.assertNotIn(f"v{TUI_VERSION}", body)

    def test_offline_falls_back_to_this_build(self):
        app, capture = make_app(width=100, height=34)
        app.core_version = ""
        app._draw()
        self.assertIn(f"v{TUI_VERSION}", chr(10).join(capture.frame.lines()))

    def test_the_health_event_updates_it(self):
        app, _ = make_app()
        app.client.health_payload = {"status": "ok", "plugins": 2, "healthy": 2,
                                     "name": "0KAY", "version": "0.2.0"}
        app._load_health()
        self.assertTrue(pumped(app, lambda: app.core_version == "0.2.0"))
        self.assertEqual(app.core_name, "0KAY")
        self.assertEqual(app.core_plugins, 2)

    def test_an_unreachable_gateway_does_not_clear_the_version(self):
        app, _ = make_app()
        app.core_version = "0.1.4"

        def boom():
            raise RuntimeError("offline")

        app.client.health_info = boom
        app._load_health()
        app._drain()
        self.assertEqual(app.core_version, "0.1.4")


class HealthPanel(unittest.TestCase):
    def test_it_names_both_versions(self):
        app, _ = make_app()
        app.client.health_payload = {"status": "ok", "plugins": 8, "healthy": 8,
                                     "name": "0KAY", "version": "0.1.4"}
        app._run_command("/health")
        from test_kit import settle
        settle(app)
        body = chr(10).join(app.panel.lines)
        self.assertIn("v0.1.4", body)
        self.assertIn(f"v{TUI_VERSION}", body)
        self.assertIn("8 of 8", body)

    def test_offline_says_so(self):
        app, _ = make_app()

        def boom():
            raise RuntimeError("offline")

        app.client.health_info = boom
        app._run_command("/health")
        from test_kit import settle
        settle(app)
        body = chr(10).join(app.panel.lines)
        self.assertIn("unreachable", body)
        self.assertIn("unknown", body)


if __name__ == "__main__":
    unittest.main()
