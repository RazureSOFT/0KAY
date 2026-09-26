"""Local token/usage ledger plus optional provider balance snapshots."""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path


class UsageLedger:
    def __init__(self, data_dir: str):
        self.path = Path(data_dir) / "usage.json"
        self._data = self._load()

    def _load(self) -> dict:
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
            return data if isinstance(data, dict) else {}
        except (FileNotFoundError, ValueError):
            return {}

    def _save(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        temporary = self.path.with_suffix(".tmp")
        temporary.write_text(json.dumps(self._data, ensure_ascii=False, indent=2), encoding="utf-8")
        temporary.replace(self.path)

    def record(self, model: str, input_tokens: int = 0, output_tokens: int = 0, task: str = "") -> None:
        model = str(model or "unknown")
        by_model = self._data.setdefault("by_model", {})
        bucket = by_model.setdefault(model, {"requests": 0, "input": 0, "output": 0, "tasks": {}})
        bucket["requests"] += 1
        bucket["input"] += int(input_tokens or 0)
        bucket["output"] += int(output_tokens or 0)
        if task:
            tasks = bucket.setdefault("tasks", {})
            tasks[task] = int(tasks.get(task, 0)) + 1
        day = date.today().isoformat()
        by_day = self._data.setdefault("by_day", {})
        daily = by_day.setdefault(day, {"requests": 0, "input": 0, "output": 0})
        daily["requests"] += 1
        daily["input"] += int(input_tokens or 0)
        daily["output"] += int(output_tokens or 0)
        self._save()

    def set_balance(self, provider: str, amount, currency: str = "") -> dict:
        self._data.setdefault("balance", {})[str(provider)] = {"amount": amount, "currency": str(currency)}
        self._save()
        return self._data["balance"][str(provider)]

    def summary(self) -> dict:
        by_model = self._data.get("by_model", {})
        totals = {
            "requests": sum(int(m.get("requests", 0)) for m in by_model.values()),
            "input": sum(int(m.get("input", 0)) for m in by_model.values()),
            "output": sum(int(m.get("output", 0)) for m in by_model.values()),
        }
        totals["tokens"] = totals["input"] + totals["output"]
        today = self._data.get("by_day", {}).get(date.today().isoformat(), {"requests": 0, "input": 0, "output": 0})
        return {"totals": totals, "by_model": by_model, "today": today, "balance": self._data.get("balance", {})}
