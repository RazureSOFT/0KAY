"""Discover the running 0kay Core and write devkit/surface.json.

    python -m okay_devkit.discover            # prompts for the port
    OKAY_CORE_PORT=8080 python -m okay_devkit.discover
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from .client import Okay, resolve_base_url


def main() -> int:
    base_url = resolve_base_url()
    okay = Okay(base_url=base_url)
    surface = okay.surface()

    out = Path(__file__).resolve().parents[2] / "surface.json"
    surface["generated_at"] = __import__("datetime").datetime.now().isoformat(timespec="seconds")
    out.write_text(json.dumps(surface, ensure_ascii=False, indent=2), encoding="utf-8")

    health = surface["health"]
    print(f"0kay Core at {base_url}")
    print(f"  status:  {health.get('status')}  healthy={health.get('healthy')} plugins={health.get('plugins')}")
    print(f"  plugins: {', '.join(p['name'] for p in surface['plugins'])}")
    print(f"  settings sections: {len(surface['settings_sections'])}")
    print(f"  wrote {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
