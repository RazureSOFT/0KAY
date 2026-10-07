"""Guard: every action the companion panel calls must exist on the server.

This is a cheap contract test that catches a renamed/removed action before a
user clicks a button that silently no-ops.
"""

import re
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
SRC = REPO_ROOT / "plugin-web" / "life" / "src"
# Every page that drives ManageCompanion. The adapters settings page is a
# separate Vue root, so scanning only CompanionPage would let it rot silently.
PANELS = [SRC / "CompanionPage.vue", SRC / "AdapterSettingsPage.vue"]
SERVER = Path(__file__).resolve().parents[1] / "src" / "life" / "grpc" / "server.py"

# Actions the panel invokes through dynamic helpers and so are not literal regex hits.
DYNAMIC = {"journal", "dream"}

# Actions dispatched through the shared lifeAct() helper in kit.ts rather than a
# local act()/query() wrapper; collected from the pages directly.
ACTION_CALL = re.compile(r"(?:act|query|lifeAct)\('([a-z_0-9]+)'")


class PanelActionContract(unittest.TestCase):
    def test_panel_actions_exist_on_server(self):
        server_text = SERVER.read_text(encoding="utf-8")
        server_actions = set(re.findall(r'action == "([a-z_0-9]+)"', server_text))
        for group in re.findall(r"action in \(([^)]*)\)", server_text):
            server_actions |= set(re.findall(r'"([a-z_0-9]+)"', group))

        for panel in PANELS:
            if not panel.exists():
                continue
            with self.subTest(panel=panel.name):
                panel_text = panel.read_text(encoding="utf-8")
                panel_actions = set(ACTION_CALL.findall(panel_text))
                panel_actions |= set(re.findall(r"action:\s*'([a-z_0-9]+)'", panel_text))
                missing = sorted(panel_actions - server_actions - DYNAMIC)
                self.assertEqual(
                    missing, [], f"{panel.name} calls actions missing on server: {missing}"
                )

    def test_panels_referenced_by_ui_patch_are_scanned(self):
        """A new plugin page must be added to PANELS, not silently skipped.

        Derived from life.patch so adding a settings tab without extending the
        contract test fails here instead of shipping an unscanned page.
        """
        patch = REPO_ROOT / "core" / "data" / "ui" / "life.patch"
        if not patch.exists():
            self.skipTest("life.patch not present")
        modules = re.findall(r'"module":\s*"([^"]+)"', patch.read_text(encoding="utf-8"))
        entries = {m.rsplit("/", 1)[-1].split("?")[0] for m in modules if "/ui/" in m}
        # Entry bundle → Vue root that compiles to it.
        ENTRY_TO_PANEL = {
            "companion.js": "CompanionPage.vue",
        }
        # Read-only pages that never dispatch an action are allowed to be absent.
        # adapters.js is embedded in the companion page (社交账号 tab) and so is no
        # longer its own patch entry, but AdapterSettingsPage.vue stays in PANELS.
        # social.js is a bootstrap module (global window), not a routed page.
        READ_ONLY = {"memory.js", "social.js"}
        covered = set(ENTRY_TO_PANEL) | READ_ONLY
        uncovered = entries - covered
        self.assertEqual(
            uncovered, set(), f"plugin pages with no contract coverage: {sorted(uncovered)}"
        )
        for entry, panel_name in ENTRY_TO_PANEL.items():
            self.assertIn(entry, entries, f"{panel_name} is scanned but not registered in life.patch")
            self.assertTrue((SRC / panel_name).exists(), f"{panel_name} disappeared")


if __name__ == "__main__":
    unittest.main()
