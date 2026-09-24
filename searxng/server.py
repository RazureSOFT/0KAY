"""Local SearXNG-compatible meta-search service.

Implements a subset of the SearXNG JSON API so life's SearchTool can use
SEARXNG_URL=http://127.0.0.1:8888 without a full SearXNG deployment.

  GET /search?q=...&format=json
  GET /healthz
  GET /           (HTML form)

Engines: DuckDuckGo HTML + Bing HTML (best-effort, no API keys).
"""

from __future__ import annotations

import html
import json
import os
import re
import sys
import concurrent.futures
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

PORT = int(os.environ.get("SEARXNG_PORT", "8888"))
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) 0kay-searxng/0.1"


def _http_get(url: str, data: bytes | None = None, timeout: float = 12.0) -> str:
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        },
        method="POST" if data else "GET",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        return resp.read().decode(charset, errors="replace")


def _strip_tags(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s or "")
    return html.unescape(s).strip()


def _search_ddg(q: str, limit: int) -> list[dict[str, Any]]:
    body = urllib.parse.urlencode({"q": q}).encode()
    text = _http_get("https://html.duckduckgo.com/html/", data=body, timeout=8.0)
    out: list[dict[str, Any]] = []
    blocks = re.findall(
        r'<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>(.*?)</a>.*?'
        r'(?:class="result__snippet"[^>]*>(.*?)</(?:a|td)>)?',
        text,
        flags=re.S | re.I,
    )
    for href, title, snippet in blocks[:limit]:
        href = html.unescape(href or "")
        if "uddg=" in href:
            qs = urllib.parse.parse_qs(urllib.parse.urlparse(href).query)
            href = urllib.parse.unquote(qs.get("uddg", [href])[0])
        out.append(
            {
                "title": _strip_tags(title),
                "url": href,
                "content": _strip_tags(snippet or ""),
                "engine": "duckduckgo",
            }
        )
    return out


def _search_bing(q: str, limit: int, cn: bool = False) -> list[dict[str, Any]]:
    params = {"q": q, "count": str(max(limit, 10))}
    if cn:
        params.update({"setlang": "zh-Hans", "mkt": "zh-CN", "cc": "CN"})
    else:
        params.update({"setlang": "en", "cc": "US"})
    url = "https://www.bing.com/search?" + urllib.parse.urlencode(params)
    accept_lang = "zh-CN,zh;q=0.9" if cn else "en-US,en;q=0.9"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": UA,
            "Accept": "text/html,application/json;q=0.9,*/*;q=0.8",
            "Accept-Language": accept_lang,
        },
    )
    with urllib.request.urlopen(req, timeout=12.0) as resp:
        charset = resp.headers.get_content_charset() or "utf-8"
        text = resp.read().decode(charset, errors="replace")
    engine_name = "cnbing" if cn else "bing"
    out: list[dict[str, Any]] = []

    # Preferred: h2 > a (stable on Bing SERP)
    for href, title in re.findall(
        r"<h2[^>]*>\s*<a[^>]+href=\"([^\"]+)\"[^>]*>(.*?)</a>",
        text,
        flags=re.S | re.I,
    ):
        href = html.unescape(href)
        if not href.startswith("http") or "bing.com" in href or "microsoft.com" in href:
            continue
        out.append(
            {
                "title": _strip_tags(title),
                "url": href,
                "content": "",
                "engine": engine_name,
            }
        )
        if len(out) >= limit:
            return out

    # Fallback: b_algo blocks
    for block in re.findall(r'<li class="b_algo".*?</li>', text, flags=re.S | re.I)[:limit]:
        m_href = re.search(
            r'<h2>\s*<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', block, flags=re.S | re.I
        )
        if not m_href:
            continue
        snippet_m = re.search(r"<p[^>]*>(.*?)</p>", block, flags=re.S | re.I)
        out.append(
            {
                "title": _strip_tags(m_href.group(2)),
                "url": html.unescape(m_href.group(1)),
                "content": _strip_tags(snippet_m.group(1) if snippet_m else ""),
                "engine": engine_name,
            }
        )
    return out


def _search_marginalia(q: str, limit: int) -> list[dict[str, Any]]:
    url = "https://search.marginalia.nu/search?" + urllib.parse.urlencode({"query": q})
    text = _http_get(url, timeout=8.0)
    out: list[dict[str, Any]] = []
    skip_hosts = (
        "marginalia",
        "creativecommons.org",
        "github.com/marginalia",
        "wiki.marginalia",
        "search.marginalia",
    )
    for href, title in re.findall(
        r'<a[^>]+href="(https?://[^"]+)"[^>]*>(.*?)</a>', text, flags=re.S | re.I
    ):
        href = html.unescape(href)
        title_s = _strip_tags(title)
        if any(s in href for s in skip_hosts):
            continue
        if not title_s or len(title_s) < 3:
            continue
        # Prefer host-as-title style entries from Marginalia SERP
        out.append(
            {
                "title": title_s,
                "url": href,
                "content": "",
                "engine": "marginalia",
            }
        )
        if len(out) >= limit:
            break
    return out


_ENGINE_CHOICES = ("cnbing", "bing", "duckduckgo", "marginalia")


def _preferred_engine() -> str:
    """Read engine preference from Core settings (default: cnbing)."""
    try:
        base = os.environ.get("CORE_HTTP_ADDR", "http://127.0.0.1:8080").rstrip("/")
        with urllib.request.urlopen(base + "/api/settings/searxng", timeout=1.5) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="replace"))
            eng = str(((data or {}).get("values") or {}).get("engine") or "").strip().lower()
            if eng in _ENGINE_CHOICES:
                return eng
    except Exception:  # noqa: BLE001
        pass
    return os.environ.get("SEARXNG_ENGINE", "cnbing").strip().lower() or "cnbing"


def search(q: str, limit: int = 10) -> dict[str, Any]:
    # Preferred engine first (settings/env, default cnbing), then the rest as fallbacks.
    preferred = _preferred_engine()
    order = ["cnbing", "bing", "marginalia", "duckduckgo"]
    engines = [preferred] + [e for e in order if e != preferred]
    results: list[dict[str, Any]] = []
    errors: list[str] = []
    seen: set[str] = set()

    def run(name):
        if name == 'duckduckgo': return _search_ddg(q, limit)
        if name == 'marginalia': return _search_marginalia(q, limit)
        return _search_bing(q, limit, cn=name == 'cnbing')
    pool=concurrent.futures.ThreadPoolExecutor(max_workers=4)
    futures={name:pool.submit(run,name) for name in engines}
    for name in engines:
        try:
            rows=futures[name].result(timeout=13)
            for r in rows:
                u = (r.get("url") or "").rstrip("/")
                if not u or u in seen:
                    continue
                seen.add(u)
                results.append(r)
                if len(results) >= limit:
                    break
        except Exception as e:  # noqa: BLE001
            errors.append(f"{name}: {e}")
        if len(results) >= limit:
            break
    pool.shutdown(wait=False,cancel_futures=True)

    return {
        "query": q,
        "results": results[:limit],
        "engines": engines,
        "preferred_engine": preferred,
        "errors": errors,
        "number_of_results": len(results),
    }


class Handler(BaseHTTPRequestHandler):
    server_version = "0kay-searxng/0.1"

    def log_message(self, fmt: str, *args: Any) -> None:
        sys.stderr.write("[searxng] " + (fmt % args) + "\n")

    def _json(self, code: int, obj: Any) -> None:
        payload = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self) -> None:  # noqa: N802
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"
        qs = urllib.parse.parse_qs(parsed.query)

        if path in ("/healthz", "/health"):
            self._json(200, {"status": "ok", "service": "searxng", "port": PORT})
            return

        if path == "/search":
            q = (qs.get("q") or qs.get("query") or [""])[0].strip()
            fmt = (qs.get("format") or [""])[0].lower()
            try:
                limit = max(1, min(50, int((qs.get("n") or ["10"])[0])))
            except ValueError:
                limit = 10
            if not q:
                self._json(400, {"error": "missing q"})
                return
            data = search(q, limit)
            if fmt == "json" or "json" in (qs.get("format") or ["json"])[0]:
                self._json(200, data)
            else:
                # minimal HTML
                items = "".join(
                    f'<li><a href="{html.escape(r["url"], quote=True)}">{html.escape(r["title"])}</a>'
                    f'<p>{html.escape(r.get("content") or "")}</p></li>'
                    for r in data["results"]
                )
                body = (
                    f"<!doctype html><title>searxng</title>"
                    f"<form><input name=q value='{html.escape(q)}'><button>go</button></form>"
                    f"<ul>{items}</ul>"
                ).encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(body)))
                self.end_headers()
                self.wfile.write(body)
            return

        if path == "/":
            body = (
                b"<!doctype html><title>0kay searxng</title>"
                b"<form action=/search><input name=q autofocus><button>search</button></form>"
            )
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        self._json(404, {"error": "not found", "path": path})

    def do_POST(self) -> None:  # noqa: N802
        # SearXNG clients sometimes POST form q=
        length = int(self.headers.get("Content-Length") or 0)
        raw = self.rfile.read(length) if length else b""
        form = urllib.parse.parse_qs(raw.decode("utf-8", errors="replace"))
        q = (form.get("q") or [""])[0].strip()
        if not q:
            self._json(400, {"error": "missing q"})
            return
        self._json(200, search(q, 10))


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print(f"searxng-compatible search listening on http://127.0.0.1:{PORT}")
    print(f"  JSON: http://127.0.0.1:{PORT}/search?q=test&format=json")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()


if __name__ == "__main__":
    main()
