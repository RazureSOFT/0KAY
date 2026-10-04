"""Shared pytest bootstrap for the LIFE suite.

Every test file used to repeat the same four-line ``sys.path`` preamble before
importing ``life.*`` (and ``life.v1`` from the generated protobuf package).
Doing it once here keeps that in one place, so new tests can import directly.

The suite itself is written with ``unittest.TestCase`` (async cases wrap their
coroutine in ``asyncio.run``), so most fixtures are unnecessary — the one below
exists for tests that prefer the pytest style.
"""
import sys
import tempfile
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[1]

for _candidate in (ROOT / "src", ROOT.parent / "gen" / "python"):
    if _candidate.is_dir():
        _path = str(_candidate)
        if _path not in sys.path:
            sys.path.insert(0, _path)


@pytest.fixture
def temp_data_dir():
    """An empty, auto-removed data directory for a MemorySystem/CompanionSystem."""
    with tempfile.TemporaryDirectory() as directory:
        yield directory
