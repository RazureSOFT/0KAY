"""``python -m world <command>`` — the worldsim toolchain front-end.

The submodules use relative imports (``from . import ledger_rules``), so they
cannot be run as bare scripts (``python world/sim.py`` raises ``ImportError``);
they must be run as modules.  This dispatcher is the supported convenience
entry point.

Commands:
    assets [args...]   S1: regenerate the cast + event templates
    sim                S0: simulate the seeds and print a summary
    gates              run the S0 gate check
    train [args...]    S4: train, evaluate and promote the world policy
    distill [args...]  distill a teacher model into the prior
    shadow <log>       S5: weekly shadow update from a shadow log
"""
from __future__ import annotations

import json
import runpy
import sys

_MODULE_COMMANDS = {
    "assets": "world.generate_assets",
    "generate-assets": "world.generate_assets",
    "sim": "world.sim",
    "gates": "world.gates",
    "train": "world.train",
    "distill": "world.distill",
}


def _run_module(module: str, argv: list[str]) -> None:
    """Execute ``module`` as ``__main__`` with ``argv`` (mirrors the CLI blocks)."""
    saved = sys.argv
    sys.argv = [module, *argv]
    try:
        runpy.run_module(module, run_name="__main__", alter_sys=True)
    finally:
        sys.argv = saved


def main(argv=None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    if not args or args[0] in ("-h", "--help"):
        print(__doc__)
        return 0 if args else 2
    command, rest = args[0], args[1:]

    if command in _MODULE_COMMANDS:
        _run_module(_MODULE_COMMANDS[command], rest)
        return 0
    if command == "shadow":
        if not rest:
            print("shadow requires a log path", file=sys.stderr)
            return 2
        from .shadow import weekly_update

        print(json.dumps(weekly_update(rest[0]), ensure_ascii=False))
        return 0

    print(f"unknown command: {command}", file=sys.stderr)
    print(__doc__)
    return 2


if __name__ == "__main__":  # pragma: no cover - CLI
    raise SystemExit(main())
