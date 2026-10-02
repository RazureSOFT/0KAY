"""Engine package.

The authoritative orchestration implementation lives in
:mod:`life.engine.legacy`; this package re-exports its ``LifeEngine``.

The former modular decomposition (``turn_processor`` / ``reflection`` /
``daily_cycle``) was never instantiated -- ``grpc/server.py`` drives
``LifeEngine`` directly -- and had already drifted from it (stub arbitration,
fail-open tool approval, a second ``_emotion_phrase``).  It has been removed
rather than left behind as a second, silently-divergent implementation.
"""
from __future__ import annotations

from .legacy import ATTACHMENT_MARKER, LifeEngine

__all__ = [
    "LifeEngine",
    "ATTACHMENT_MARKER",
]
