"""Local SearXNG-compatible meta-search service.

Implements a subset of the SearXNG JSON API so life's SearchTool can use
SEARXNG_URL=http://127.0.0.1:8888 without a full SearXNG deployment.

  GET /search?q=...&format=json
  GET /healthz
  GET /           (HTML form)

Engines: Bing (intl + cn), 360 Search, DuckDuckGo HTML, Marginalia
(best-effort, no API keys; probed for reachability from this host).
"""

from __future__ import annotations

import html
import json
import os
import re
import sys
import time
import concurrent.futures
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

PORT = int(os.environ.get("SEARXNG_PORT", "8888"))
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"


def _http_get(url: str, data: bytes | None = None, timeout: float = 12.0) -> str:
    # One retry: TLS handshakes to some engines flake intermittently on this
    # network, and a second attempt usually lands.
    last: Exception | None = None
    for attempt in range(2):
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
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                charset = resp.headers.get_content_charset() or "utf-8"
                return resp.read().decode(charset, errors="replace")
        except Exception as e:  # noqa: BLE001
            last = e
            if attempt == 0:
                time.sleep(0.2)
    raise last  # type: ignore[misc]


def _strip_tags(s: str) -> str:
    s = re.sub(r"<[^>]+>", "", s or "")
    return html.unescape(s).strip()


# Query terms that carry no discriminating value for relevance matching.
_STOPWORDS = frozenset({
    "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "for", "from",
    "has", "have", "how", "i", "if", "in", "into", "is", "it", "its", "of", "on",
    "or", "our", "that", "the", "their", "then", "there", "these", "they", "this",
    "to", "was", "we", "were", "what", "when", "where", "which", "who", "why",
    "will", "with", "you", "your",
})


def _query_groups(q: str) -> list[list[str]]:
    """Group query terms in original order.

    Quoted phrases and OR-chains form one group (any variant matches); every
    other non-stopword term is its own group. The first group is the anchor
    that a result must match, so no-result queries cannot surface unrelated
    fallback/spam pages the engines love to return.
    """
    groups: list[list[str]] = []
    seen: set[str] = set()
    join_next = False
    for m in re.finditer(r'"([^"]+)"|\S+', q):
        if m.group(1) is not None:
            phrase = " ".join(m.group(1).lower().split())
            if phrase and phrase not in seen:
                seen.add(phrase)
                if join_next and groups:
                    groups[-1].append(phrase)
                else:
                    groups.append([phrase])
                join_next = False
            continue
        tok = m.group(0)
        if tok.upper() == "OR":
            join_next = bool(groups)
            continue
        word = tok.lower().strip(".,;:!?()[]{}<>/\\|@#$%^&*+=~`'\u2014\u2013")
        if not word or word in _STOPWORDS or word in seen:
            continue
        seen.add(word)
        if join_next and groups:
            groups[-1].append(word)
        else:
            groups.append([word])
        join_next = False
    return groups


def _relevance(haystack: str, groups: list[list[str]]) -> tuple[int, bool]:
    """Return (matched groups, anchor matched).

    Empty groups means there is nothing to match (stopword-only query) and
    results pass through unfiltered.
    """
    if not groups:
        return 0, True
    matched = 0
    anchor = False
    for i, variants in enumerate(groups):
        if any(v in haystack for v in variants):
            matched += 1
            if i == 0:
                anchor = True
    return matched, anchor


def _search_ddg(q: str, limit: int) -> list[dict[str, Any]]:
    body = urllib.parse.urlencode({"q": q}).encode()
    text = _http_get("https://html.duckduckgo.com/html/", data=body, timeout=7.0)
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
    with urllib.request.urlopen(req, timeout=6.0) as resp:
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


def _search_so360(q: str, limit: int) -> list[dict[str, Any]]:
    url = "https://www.so.com/s?" + urllib.parse.urlencode({"q": q})
    text = _http_get(url, timeout=3.5)
    out: list[dict[str, Any]] = []
    for chunk in re.split(r'(?=<li[^>]+class="res-list)', text):
        m = re.search(
            r'<h3[^>]*>\s*<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>', chunk, flags=re.S | re.I
        )
        if not m:
            continue
        mu = re.search(r'\bdata-mdurl="([^"]+)"', chunk)
        href = html.unescape(mu.group(1) if mu else m.group(1))
        title = _strip_tags(m.group(2))
        if not title or len(title) < 2 or not href.startswith("http"):
            continue
        snippet = re.search(
            r'class="res-desc[^"]*"[^>]*>(.*?)</(?:p|span|div)>', chunk, flags=re.S | re.I
        )
        out.append(
            {
                "title": title,
                "url": href,
                "content": _strip_tags(snippet.group(1)) if snippet else "",
                "engine": "so360",
            }
        )
        if len(out) >= limit:
            break
    return out


_ENGINE_CHOICES = ("cnbing", "bing", "so360", "duckduckgo", "marginalia")


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
    # Preferred engine first (settings/env, default cnbing), then distinct
    # hosts early so one provider cannot crowd out the rest.
    preferred = _preferred_engine()
    order = ["so360", "cnbing", "bing", "duckduckgo", "marginalia"]
    engines = [preferred] + [e for e in order if e != preferred]
    errors: list[str] = []

    def run(name):
        if name == 'duckduckgo': return _search_ddg(q, limit)
        if name == 'marginalia': return _search_marginalia(q, limit)
        if name == 'so360': return _search_so360(q, limit)
        return _search_bing(q, limit, cn=name == 'cnbing')
    pool = concurrent.futures.ThreadPoolExecutor(max_workers=5)
    futures = {name: pool.submit(run, name) for name in engines}

    # Overall deadline with early exit: return as soon as finished engines
    # yielded enough raw rows to rank, or when every engine settled — never
    # let one slow/flaky engine hold the whole response hostage.
    deadline = time.monotonic() + 9.0
    lead_pool = engines[:3]
    while time.monotonic() < deadline and not all(f.done() for f in futures.values()):
        # Stop once two of the three lead engines settled with enough rows to
        # rank: one flaky source cannot monopolize the wait, and one fast
        # source cannot monopolize the list.
        lead_done = sum(1 for name in lead_pool if futures[name].done()) >= 2
        raw = sum(
            len(f.result())
            for f in futures.values()
            if f.done() and not f.exception()
        )
        if lead_done and raw >= limit:
            break
        time.sleep(0.15)

    # Rank by relevance after gathering — letting the first engine fill the
    # quota lets junk results crowd out better ones.
    groups = _query_groups(q)
    seen: set[str] = set()
    merged: list[tuple[int, int, int, dict[str, Any]]] = []
    for idx, name in enumerate(engines):
        future = futures[name]
        if not future.done():
            future.cancel()
            errors.append(f"{name}: timed out")
            continue
        try:
            rows = future.result()
        except Exception as e:  # noqa: BLE001
            errors.append(f"{name}: {e}")
            continue
        for pos, r in enumerate(rows):
            u = (r.get("url") or "").rstrip("/")
            if not u or u in seen:
                continue
            seen.add(u)
            hay = f"{r.get('title') or ''} {u} {r.get('content') or ''}".lower()
            score, anchor_ok = _relevance(hay, groups)
            if not anchor_ok:
                continue
            merged.append((-score, idx, pos, r))
    pool.shutdown(wait=False, cancel_futures=True)

    # Interleave engines inside each score tier: on ties the preferred engine
    # would otherwise fill every slot and crowd the other hosts out.
    by_score: dict[int, dict[int, list[dict[str, Any]]]] = {}
    for neg_score, engine_idx, _pos, row in merged:
        by_score.setdefault(neg_score, {}).setdefault(engine_idx, []).append(row)
    results: list[dict[str, Any]] = []
    for neg_score in sorted(by_score):
        per_engine = by_score[neg_score]
        while any(per_engine.values()):
            for engine_idx in sorted(per_engine):
                bucket = per_engine[engine_idx]
                if bucket:
                    results.append(bucket.pop(0))
                    if len(results) >= limit:
                        break
            if len(results) >= limit:
                break
        if len(results) >= limit:
            break

    return {
        "query": q,
        "results": results,
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
        try:
            self.send_response(code)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(payload)
        except OSError:
            pass  # client disconnected mid-response

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
