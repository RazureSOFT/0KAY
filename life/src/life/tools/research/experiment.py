"""Run an experiment and record its stdout, result and metadata to disk.

A thin, dependency-free wrapper so every experiment produces the same run
folder layout::

    runs/<timestamp>-<name>/meta.json
    runs/<timestamp>-<name>/stdout.txt
    runs/<timestamp>-<name>/result.json
"""
from __future__ import annotations

import contextlib
import io
import json
import re
import traceback
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from time import perf_counter
from typing import Callable


@dataclass
class RunResult:
    name: str
    run_dir: Path
    seconds: float
    stdout: str
    result: object = None
    error: str = ""
    params: dict = field(default_factory=dict)

    def to_dict(self) -> dict:
        return {"name": self.name, "run_dir": str(self.run_dir),
                "seconds": self.seconds, "error": self.error,
                "params": self.params, "result": _jsonable(self.result)}


def _jsonable(value):
    try:
        json.dumps(value)
        return value
    except (TypeError, ValueError):
        return repr(value)


def run_experiment(name: str, fn: Callable[[], object], *, out_dir="runs",
                   params: dict | None = None, capture_stdout: bool = True) -> RunResult:
    """Call ``fn()``, capture its stdout/result, and persist a run folder."""
    safe = re.sub(r"[^\w.-]+", "_", str(name or "run")).strip("_") or "run"
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    run_dir = Path(out_dir) / f"{stamp}-{safe}"
    run_dir.mkdir(parents=True, exist_ok=True)

    buffer = io.StringIO()
    start = perf_counter()
    result: object = None
    error = ""
    try:
        if capture_stdout:
            with contextlib.redirect_stdout(buffer):
                result = fn()
        else:
            result = fn()
    except Exception:
        error = traceback.format_exc()
    seconds = perf_counter() - start

    stdout = buffer.getvalue()
    (run_dir / "stdout.txt").write_text(stdout, encoding="utf-8")
    meta = {"name": name, "seconds": round(seconds, 4), "params": params or {},
            "error": error, "created_at": datetime.now().isoformat()}
    (run_dir / "meta.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    (run_dir / "result.json").write_text(
        json.dumps(_jsonable(result), ensure_ascii=False, indent=2), encoding="utf-8")
    return RunResult(name=name, run_dir=run_dir, seconds=seconds, stdout=stdout,
                     result=result, error=error, params=params or {})
