"""Content life: optional RSS/news/AI/Bilibili digests and self-initiated search.

Every network path is optional and fails soft. Configure feeds as a comma
separated list of ``kind:url`` (or bare ``url``) in the ``news_feeds`` setting and
turn on ``enable_content_fetch``.
"""

from __future__ import annotations

import re
import xml.etree.ElementTree as ET
from typing import Any, Callable

FEED_KINDS = ("news", "ai", "bilibili", "tech", "search")


def _clean(text: Any, limit: int = 400) -> str:
    plain = re.sub(r"<[^>]+>", "", re.sub(r"\s+", " ", str(text or "")))
    return plain.strip()[:limit]


def _text(node, name: str) -> str:
    for child in node:
        if child.tag.split("}")[-1] == name:
            if child.text:
                return child.text.strip()
            for grand in child:
                if grand.tag.split("}")[-1] in ("content", "encoded") and grand.text:
                    return grand.text.strip()
    return ""


def parse_feed(xml_text: str, default_kind: str = "news", limit: int = 10) -> list[dict[str, Any]]:
    """Parse RSS or Atom into digest dicts. Malformed input yields an empty list."""
    try:
        root = ET.fromstring(xml_text)
    except ET.ParseError:
        return []
    items: list[dict[str, Any]] = []
    for node in root.iter():
        if node.tag.split("}")[-1] not in ("item", "entry"):
            continue
        title = _clean(_text(node, "title"), 200)
        if not title:
            continue
        summary = _clean(_text(node, "description") or _text(node, "summary") or _text(node, "content"), 400)
        url = _text(node, "link") or _text(node, "id")
        items.append({"kind": default_kind, "title": title, "summary": summary, "url": url[:500]})
        if len(items) >= max(1, limit):
            break
    return items


class ContentSystem:
    def __init__(self, settings_getter: Callable[[], dict] | None = None):
        self.settings_getter = settings_getter or (lambda: {})

    def _settings(self) -> dict:
        try:
            return dict(self.settings_getter() or {})
        except Exception:
            return {}

    def fetch_enabled(self) -> bool:
        return str(self._settings().get("enable_content_fetch", "0")) == "1"

    def feeds(self) -> list[tuple[str, str]]:
        raw = str(self._settings().get("news_feeds") or "")
        feeds: list[tuple[str, str]] = []
        for entry in raw.replace("\n", ",").split(","):
            entry = entry.strip()
            if not entry:
                continue
            if ":" in entry and entry.split(":", 1)[0] in FEED_KINDS:
                kind, url = entry.split(":", 1)
            else:
                kind, url = "news", entry
            if url.startswith("http"):
                feeds.append((kind, url))
        return feeds

    async def fetch_feed(self, url: str) -> str:
        import httpx

        async with httpx.AsyncClient(timeout=10, follow_redirects=True) as client:
            response = await client.get(url, headers={"User-Agent": "LIFE/1.0 (+companion)"})
            response.raise_for_status()
            return response.text

    async def collect(self, companion, search: Callable | None = None, interests: list[str] | None = None) -> dict[str, Any]:
        """Fetch configured feeds (and optionally self-search), storing digests."""
        if not self.fetch_enabled():
            return {"skipped": "disabled", "items": []}
        per_feed = max(1, int(float(self._settings().get("content_items_per_feed", 3))))
        stored: list[dict[str, Any]] = []
        for kind, url in self.feeds()[:10]:
            try:
                items = parse_feed(await self.fetch_feed(url), kind, per_feed)
            except Exception:
                continue
            for item in items[:per_feed]:
                companion.add_digest(item["kind"], url, item["title"], item["summary"], item["url"])
                stored.append(item)
        if search and interests:
            topic = str(interests[0])
            try:
                result = await search(topic)
                text = _clean(result, 300)
                if text:
                    companion.add_digest("search", topic, f"关于「{topic}」的见闻", text, "")
                    stored.append({"kind": "search", "title": f"关于「{topic}」的见闻", "summary": text, "url": ""})
            except Exception:
                pass
        return {"items": stored, "feeds": len(self.feeds())}
