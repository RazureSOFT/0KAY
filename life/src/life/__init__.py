"""L.I.F.E - Persona plugin for 0kay AI Agent platform."""

import os
import sys

# Ensure gen/python is on sys.path for life.v1 / mocr.v1 / core.v1 / plugin.v1
_HERE = os.path.dirname(os.path.abspath(__file__))
# `world` is a sibling of `src/` in a source checkout. Core launches LIFE with
# PYTHONPATH pointing at src alone, often from a different working directory;
# editable installs expose `life` but do not necessarily expose the sibling
# package. Add only this verified checkout root (not the process CWD), so both
# dashboard worldview imports and the autonomous world tick can find `world`.
_CHECKOUT_ROOT = os.path.abspath(os.path.join(_HERE, "..", ".."))
if (os.path.isfile(os.path.join(_CHECKOUT_ROOT, "world", "__init__.py"))
        and _CHECKOUT_ROOT not in sys.path):
    sys.path.insert(0, _CHECKOUT_ROOT)
_GEN = os.getenv("PROTO_PYTHON_DIR", os.path.abspath(os.path.join(_HERE, "..", "..", "..", "gen", "python")))
if os.path.isdir(_GEN) and _GEN not in sys.path:
    sys.path.insert(0, _GEN)

# Extend this package's __path__ so `life.v1` resolves from gen/python/life/v1
# while `life.engine` etc. still resolve from src/life/.
_life_gen = os.path.join(_GEN, "life")
if os.path.isdir(_life_gen) and _life_gen not in __path__:
    __path__.append(_life_gen)  # type: ignore[name-defined]

# The authoritative orchestration engine.  Imported through `.engine` so the
# package's guard applies.
from .engine import LifeEngine

# NOTE: the former modular decomposition (engine.turn_processor / engine.reflection
# / engine.daily_cycle), the per-domain companion managers, and the interfaces
# package were all never instantiated by the runtime and had drifted from the
# authoritative implementations.  They have been deleted so there is exactly one
# owner for each responsibility.  `LifeEngine` is the single entry point.

__all__ = [
    "LifeEngine",
]
