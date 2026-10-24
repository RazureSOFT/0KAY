import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
_CHECKOUT_ROOT = os.path.abspath(os.path.join(_HERE, "..", ".."))
if (os.path.isfile(os.path.join(_CHECKOUT_ROOT, "world", "__init__.py"))
        and _CHECKOUT_ROOT not in sys.path):
    sys.path.insert(0, _CHECKOUT_ROOT)
_GEN = os.getenv("PROTO_PYTHON_DIR", os.path.abspath(os.path.join(_HERE, "..", "..", "..", "gen", "python")))
if os.path.isdir(_GEN) and _GEN not in sys.path:
    sys.path.insert(0, _GEN)

_life_gen = os.path.join(_GEN, "life")
if os.path.isdir(_life_gen) and _life_gen not in __path__:
    __path__.append(_life_gen)  # type: ignore[name-defined]

from .engine import LifeEngine


__all__ = [
    "LifeEngine",
]
