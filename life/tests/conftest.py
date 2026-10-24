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
    with tempfile.TemporaryDirectory() as directory:
        yield directory
