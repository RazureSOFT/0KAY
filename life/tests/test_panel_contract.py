"""Guard: every action the companion panel calls must exist on the server.

This is a cheap contract test that catches a renamed/removed action before a
user clicks a button that silently no-ops.
"""

import re
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
PANEL = REPO_ROOT / "plugin-web" / "life" / "src" / "CompanionPage.vue"
SERVER = Path(__file__).resolve().parents[1] / "src" / "life" / "grpc" / "server.py"

# Actions the panel invokes through dynamic helpers and so are not literal regex hits.
DYNAMIC = {"journal", "dream"}


class PanelActionContract(unittest.TestCase):
    def test_panel_actions_exist_on_server(self):
        if not PANEL.exists():
            self.skipTest("panel source not present")
        panel_text = PANEL.read_text(encoding="utf-8")
        server_text = SERVER.read_text(encoding="utf-8")
        panel_actions = set(re.findall(r"(?:act|query)\('([a-z_0-9]+)'", panel_text))
        panel_actions |= set(re.findall(r"action:\s*'([a-z_0-9]+)'", panel_text))
        server_actions = set(re.findall(r'action == "([a-z_0-9]+)"', server_text))
        for group in re.findall(r"action in \(([^)]*)\)", server_text):
            server_actions |= set(re.findall(r'"([a-z_0-9]+)"', group))
        missing = sorted(panel_actions - server_actions - DYNAMIC)
        self.assertEqual(missing, [], f"panel calls actions missing on server: {missing}")


if __name__ == "__main__":
    unittest.main()
