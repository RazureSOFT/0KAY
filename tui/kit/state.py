"""A tiny file for the few things worth remembering between launches.

Only the last session id lives here today. It is deliberately not a config
file: nothing here is a setting, it is a bookmark, and deleting the file must
always be safe.
"""

from __future__ import annotations

import json
import os
import pathlib

STATE_DIR = pathlib.Path(os.path.expanduser("~")) / ".0kay-tui"
STATE_FILE = STATE_DIR / "state.json"


def _path() -> pathlib.Path:
    override = os.environ.get("OKAY_TUI_STATE")
    if override:
        return pathlib.Path(override)
    return STATE_FILE


def load() -> dict:
    try:
        raw = _path().read_text(encoding="utf-8")
    except (OSError, ValueError):
        return {}
    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        return {}
    return data if isinstance(data, dict) else {}


def save(**values) -> None:
    """Merge into the state file. Never raises: a bookmark is not critical."""
    data = load()
    data.update({key: value for key, value in values.items() if value is not None})
    path = _path()
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    except OSError:
        pass


def exports_dir() -> pathlib.Path:
    """Where transcripts are written, beside the state file."""
    return _path().parent / "exports"


def last_session() -> str:
    return str(load().get("last_session") or "")
