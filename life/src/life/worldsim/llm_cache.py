"""sha256 prompt cache for offline (teacher/asset) LLM calls.

Every offline call is keyed by ``sha256(model + "\\n" + prompt)`` so an
interrupted/repeated run never pays twice.  Values are the raw text response.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path


def prompt_key(prompt: str, model: str = "") -> str:
    digest = hashlib.sha256(f"{model}\n{prompt}".encode("utf-8")).hexdigest()
    return digest


class LLMCache:
    def __init__(self, root: Path | str = "data/teacher/cache"):
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)
        self.hits = 0
        self.misses = 0

    def _path(self, prompt: str, model: str) -> Path:
        return self.root / f"{prompt_key(prompt, model)}.json"

    def get(self, prompt: str, model: str = ""):
        path = self._path(prompt, model)
        if path.exists():
            self.hits += 1
            try:
                payload = json.loads(path.read_text(encoding="utf-8"))
            except (ValueError, OSError):
                # A truncated cache entry must read as a miss, not crash the
                # caller that is only asking for a cached response.
                return None
            return payload.get("response") if isinstance(payload, dict) else None
        self.misses += 1
        return None

    def put(self, prompt: str, response, model: str = "") -> None:
        path = self._path(prompt, model)
        temporary = path.with_suffix(".tmp")
        temporary.write_text(json.dumps({"model": model, "prompt_sha256": prompt_key(prompt, model),
                                         "response": response}, ensure_ascii=False), encoding="utf-8")
        temporary.replace(path)

    def stats(self) -> dict:
        return {"hits": self.hits, "misses": self.misses, "root": str(self.root)}


async def cached_generate(cache: LLMCache, generate, prompt: str, *, model: str = "", **kwargs):
    """Call ``generate`` through the cache.  ``generate`` is an async callable."""
    cached = cache.get(prompt, model)
    if cached is not None:
        return cached
    response = await generate(prompt, model=model, **kwargs)
    cache.put(prompt, response, model)
    return response
