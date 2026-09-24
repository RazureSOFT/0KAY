"""L.I.F.E - Persona plugin for 0kay AI Agent platform."""

import os
import sys

# Ensure gen/python is on sys.path for life.v1 / mocr.v1 / core.v1 / plugin.v1
_HERE = os.path.dirname(os.path.abspath(__file__))
_GEN = os.getenv("PROTO_PYTHON_DIR", os.path.abspath(os.path.join(_HERE, "..", "..", "..", "gen", "python")))
if os.path.isdir(_GEN) and _GEN not in sys.path:
    sys.path.insert(0, _GEN)

# Extend this package's __path__ so `life.v1` resolves from gen/python/life/v1
# while `life.engine` etc. still resolve from src/life/.
_life_gen = os.path.join(_GEN, "life")
if os.path.isdir(_life_gen) and _life_gen not in __path__:
    __path__.append(_life_gen)  # type: ignore[name-defined]

from .engine import LifeEngine

__all__ = ["LifeEngine"]
