#!/usr/bin/env python3
"""Terminal dashboard for a running 0KAY stack.

It talks to the same HTTP API the WebUI uses, so it needs no database access and
cannot disagree with what the UI shows.

    python tui/0kay.py plugins
    python tui/0kay.py tasks --limit 20
    python tui/0kay.py usage
    python tui/0kay.py watch --interval 3
    python tui/0kay.py reconnect life
    python tui/0kay.py ui

Auth: CORE_API_TOKEN or CORE_PAIR_TOKEN, or --token. Base URL: --url or
CORE_HTTP_ADDR (default http://127.0.0.1:8080).

`ui` is the interactive client for the agent: it opens a session, sends each
message as a turn, and renders the agent's running transcript -- reasoning, tool
calls and the answer -- as markdown. It completes commands on `/` and paths on
`@`, and folds the plugin, task and usage views into panels. The other commands stay line
oriented so they keep working over a pipe.

Standard library only, on purpose: this has to run on a box where nothing is
installed yet — which is exactly when you need to look at the stack.
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

DEFAULT_URL = "http://127.0.0.1:8080"
BAR_WIDTH = 12
NEWLINE = chr(10)

# Older Core builds only send the status enum; the phase is still readable once
# the prefix is stripped.
PHASE_FROM_STATUS = {
    "PLUGIN_STATUS_HEALTHY": "healthy",
    "PLUGIN_STATUS_UNHEALTHY": "failed",
    "PLUGIN_STATUS_DISABLED": "stopped",
}


# --- pure formatting --------------------------------------------------------

def short_id(value: str, width: int = 8) -> str:
    text = str(value or "")
    return text if len(text) <= width else text[: width - 1] + "…"


def clip(value: object, width: int) -> str:
    text = " ".join(str(value or "").split())
    return text if len(text) <= width else text[: max(0, width - 1)] + "…"


def bar(percent: int | None, width: int = BAR_WIDTH) -> str:
    """A progress bar that reads the same in any monospace terminal."""
    if percent is None:
        return " " * width + "   --"
    try:
        value = max(0, min(100, int(percent)))
    except (TypeError, ValueError):
        return " " * width + "   --"
    filled = int(round(width * value / 100.0))
    return "█" * filled + "░" * (width - filled) + f" {value:3d}%"


def table(headers: list[str], rows: list[list[str]]) -> str:
    """Fixed-width columns, no external dependency."""
    widths = [len(h) for h in headers]
    for row in rows:
        for index, cell in enumerate(row):
            if index < len(widths):
                widths[index] = max(widths[index], len(str(cell)))
    lines = ["  ".join(h.ljust(widths[i]) for i, h in enumerate(headers)).rstrip()]
    lines.append("  ".join("-" * widths[i] for i in range(len(headers))))
    for row in rows:
        lines.append("  ".join(str(cell).ljust(widths[i]) for i, cell in enumerate(row)).rstrip())
    return NEWLINE.join(lines)


def phase_of(row: dict) -> str:
    """One word for a plugin's state, whatever the Core version sends."""
    for key in ("lifecycle", "health"):
        value = str(row.get(key) or "").strip()
        if value and value != "unknown":
            return value.lower()
    status = str(row.get("status") or "").strip()
    if not status:
        return "unknown"
    return PHASE_FROM_STATUS.get(status, status.lower().replace("plugin_status_", ""))


def _uptime(seconds: object) -> str:
    try:
        total = int(float(seconds))
    except (TypeError, ValueError):
        return "--"
    if total < 60:
        return f"{total}s"
    if total < 3600:
        return f"{total // 60}m"
    if total < 86400:
        return f"{total // 3600}h{(total % 3600) // 60:02d}m"
    return f"{total // 86400}d{(total % 86400) // 3600:02d}h"


def format_plugins(rows: list[dict]) -> str:
    if not rows:
        return "No plugins registered."
    body = []
    for row in rows:
        age = row.get("heartbeat_age_seconds")
        body.append([
            clip(row.get("name") or row.get("plugin_id") or "?", 18),
            phase_of(row),
            f"{age:.1f}s" if isinstance(age, (int, float)) else "--",
            _uptime(row.get("uptime_seconds")),
            clip(row.get("version") or "", 12),
        ])
    # Anything that needs attention sorts to the top; healthy rows follow in
    # name order so the list does not jump around between refreshes.
    body.sort(key=lambda line: (line[1] == "healthy", line[0]))
    return table(["PLUGIN", "PHASE", "BEAT", "UPTIME", "VERSION"], body)


def format_tasks(rows: list[dict], limit: int = 20) -> str:
    if not rows:
        return "No tasks."
    ordered = sorted(rows, key=lambda row: str(row.get("updated_at") or row.get("created_at") or ""), reverse=True)
    body = []
    for row in ordered[: max(1, limit)]:
        state = str(row.get("state") or "").lower()
        progress = row.get("progress")
        if state == "completed":
            progress = 100
        elif state not in ("running", "pending"):
            progress = None
        body.append([
            short_id(row.get("task_id") or row.get("id") or ""),
            clip(state, 10),
            bar(progress),
            clip(row.get("phase") or "", 14),
            clip(row.get("note") or row.get("prompt") or row.get("error") or "", 44),
        ])
    return table(["TASK", "STATE", "PROGRESS", "PHASE", "NOTE"], body)


def format_usage(payload: dict, today: str | None = None) -> str:
    payload = payload or {}
    day = today or time.strftime("%Y-%m-%d")
    by_day = payload.get("by_day") if isinstance(payload.get("by_day"), dict) else {}
    today_stats = by_day.get(day) if isinstance(by_day.get(day), dict) else {}
    by_model = payload.get("by_model") if isinstance(payload.get("by_model"), dict) else {}

    lines: list[str] = []
    if today_stats:
        lines.append(
            f"Today ({day})  prompt {int(today_stats.get('prompt') or 0):,}  "
            f"completion {int(today_stats.get('completion') or 0):,}  "
            f"total {int(today_stats.get('total') or 0):,}  "
            f"{int(today_stats.get('count') or 0)} requests")
    else:
        lines.append(f"Today ({day})  no requests")

    if by_model:
        rows = []
        grand = sum(int((stats or {}).get("total") or 0) for stats in by_model.values()) or 1
        for name, stats in by_model.items():
            stats = stats if isinstance(stats, dict) else {}
            used = int(stats.get("total") or 0)
            rows.append([clip(name, 32), bar(int(round(100.0 * used / grand))),
                         f"{used:,}", str(int(stats.get("count") or 0))])
        rows.sort(key=lambda row: row[2], reverse=True)
        lines.append("")
        lines.append(table(["MODEL", "SHARE", "TOKENS", "REQ"], rows))

    total = int(payload.get("total_tokens") or 0)
    if total:
        ratio = payload.get("cache_hit_ratio")
        cache = f"  cache {100.0 * float(ratio):.1f}%" if isinstance(ratio, (int, float)) else ""
        lines.append("")
        lines.append(f"All time  {total:,} tokens  {int(payload.get('request_count') or 0):,} requests{cache}")
    return NEWLINE.join(lines)


def format_descriptor(payload: dict) -> str:
    """One plugin, in full: identity, what it contributes, where its pages are."""
    payload = payload or {}
    lines = [
        f"{payload.get('name') or payload.get('id') or '?'}  "
        f"{payload.get('version') or '--'}  {payload.get('kind') or '?'}"
        f"  [{str(payload.get('lifecycle') or 'unknown')}]",
    ]
    if payload.get("plugin_id"):
        lines.append(f"  plugin_id   {payload['plugin_id']}")
    capabilities = payload.get("capabilities") or []
    if capabilities:
        lines.append("  capabilities " + ", ".join(str(item) for item in capabilities))
    permissions = payload.get("permissions") or {}
    if isinstance(permissions, dict):
        if permissions.get("api_requires"):
            lines.append("  may call    " + ", ".join(str(item) for item in permissions["api_requires"]))
        egress = permissions.get("egress") or []
        if egress:
            lines.append("  egress      " + ", ".join(str(item) for item in egress))
    health = payload.get("health") or {}
    if isinstance(health, dict):
        degraded = health.get("degraded_after_seconds")
        stale = health.get("stale_after_seconds")
        if degraded is not None and stale is not None:
            lines.append(f"  health      degraded after {degraded:.0f}s, stale after {stale:.0f}s")
    surfaces = payload.get("surfaces") or []
    if surfaces:
        lines.append("  pages")
        for surface in surfaces:
            lines.append(f"    {surface.get('id')}  {surface.get('module')}")
    return NEWLINE.join(lines)


# --- HTTP -------------------------------------------------------------------

class Core:
    def __init__(self, base_url: str, token: str = "", timeout: float = 5.0):
        self.base_url = (base_url or DEFAULT_URL).rstrip("/")
        self.token = token
        self.timeout = timeout

    def headers(self) -> dict:
        return {"Authorization": f"Bearer {self.token}"} if self.token else {}

    def get(self, path: str) -> object:
        request = urllib.request.Request(self.base_url + path, headers=self.headers())
        with urllib.request.urlopen(request, timeout=self.timeout) as response:
            return json.loads(response.read().decode("utf-8"))

    def post(self, path: str, payload: dict | None = None) -> object:
        body = json.dumps(payload or {}).encode("utf-8")
        request = urllib.request.Request(
            self.base_url + path, data=body, method="POST",
            headers={"Content-Type": "application/json", **self.headers()})
        with urllib.request.urlopen(request, timeout=self.timeout) as response:
            raw = response.read().decode("utf-8")
        return json.loads(raw) if raw.strip() else {}


def plugins_frame(core: Core) -> str:
    rows = core.get("/api/plugins")
    if isinstance(rows, dict):
        rows = rows.get("plugins") or []
    return format_plugins(list(rows or []))


def tasks_frame(core: Core, limit: int = 20) -> str:
    payload = core.get("/api/tasks")
    rows = payload.get("tasks") if isinstance(payload, dict) else payload
    return format_tasks(list(rows or []), limit)


def usage_frame(core: Core) -> str:
    payload = core.get("/api/usage")
    return format_usage(payload if isinstance(payload, dict) else {})


def frame(core: Core, limit: int) -> str:
    parts = [
        f"0KAY  {core.base_url}  {time.strftime('%H:%M:%S')}",
        "",
        "PLUGINS",
        plugins_frame(core),
        "",
        "TASKS",
        tasks_frame(core, limit),
        "",
        "USAGE",
        usage_frame(core),
    ]
    return NEWLINE.join(parts)


def _run_ui(args) -> int:
    """Interactive client. Needs a real terminal; pipes keep the subcommands."""
    if not (sys.stdin.isatty() and sys.stdout.isatty()):
        print("ui needs an interactive terminal; use plugins/tasks/usage over a pipe",
              file=sys.stderr)
        return 2
    here = os.path.dirname(os.path.abspath(__file__))
    if here not in sys.path:
        sys.path.insert(0, here)

    from kit.app import App
    from kit.canvas import Renderer
    from kit.client import Client
    from kit.screen import KeyReader, Terminal
    from kit.theme import build, detect_colour

    # Colour capability is probed here, not in build(), so build() stays pure
    # and NO_COLOR / TERM / COLORTERM are honoured at the one place that talks
    # to a real terminal.
    theme = build(args.theme, detect_colour())
    client = Client(args.url, args.token)
    reader = KeyReader()
    with Terminal() as terminal:
        renderer = Renderer(sys.stdout, theme.colour)
        app = App(client, theme, terminal, reader, renderer,
                  model=args.model, formatters=sys.modules[__name__],
                  workdir=args.workdir, continue_last=args.continue_last)
        if args.full_access:
            app._set_permission("full_access")
        if terminal.raw_ok is False and not reader.using_console_queue:
            # Only worth saying when we are also on the msvcrt fallback: the
            # console queue does not care about the mode bits.
            from kit.app import Entry
            app.entries.append(Entry(
                "error",
                "console input mode could not be changed and the key queue is "
                "unavailable; typing may echo twice. run `0kay.py keys` to check."))
        try:
            return app.run()
        except KeyboardInterrupt:
            return 0


def _run_keys(args) -> int:
    """Print what the terminal actually sends, one name per key.

    When a key "does nothing" the question is always the same: did it arrive,
    and as what? This answers both without guessing, and it uses the same
    reader and the same console mode as `ui`, so it fails the same way.
    """
    if not (sys.stdin.isatty() and sys.stdout.isatty()):
        print("keys needs an interactive terminal", file=sys.stderr)
        return 2
    here = os.path.dirname(os.path.abspath(__file__))
    if here not in sys.path:
        sys.path.insert(0, here)

    from kit.screen import IS_WINDOWS, KeyReader, Terminal

    reader = KeyReader()
    with Terminal() as terminal:
        if terminal.raw_ok is True:
            terminal.write("console input mode: raw" + NEWLINE)
        elif IS_WINDOWS and not reader.using_console_queue:
            terminal.write("console input mode: UNCHANGED (keys may echo or wait for enter)"
                           + NEWLINE)
        if IS_WINDOWS:
            source = "console queue" if reader.using_console_queue else "msvcrt (fallback)"
            terminal.write(f"key source: {source}" + NEWLINE)
        terminal.write(NEWLINE + "press keys · ctrl+d to stop" + NEWLINE + NEWLINE)
        while True:
            for key in reader.read(0.2):
                codes = " ".join(f"u+{ord(ch):04x}" for ch in key)
                terminal.write(f"{key!r:<14}{codes}" + NEWLINE)
                if key == "ctrl+d":
                    return 0
                if key in ("ctrl+c", "esc"):
                    # ctrl+c is delivered as a key here, so give it an out.
                    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Terminal dashboard for 0KAY")
    parser.add_argument("command", choices=("ui", "keys", "plugins", "plugin", "tasks", "usage", "watch", "reconnect"),
                        help="what to show; plugin and reconnect take a plugin name")
    parser.add_argument("name", nargs="?", help="plugin name for reconnect")
    parser.add_argument("--url", default=os.environ.get("CORE_HTTP_ADDR") or DEFAULT_URL)
    parser.add_argument("--token", default=os.environ.get("CORE_API_TOKEN") or os.environ.get("CORE_PAIR_TOKEN") or "")
    parser.add_argument("--limit", type=int, default=20)
    parser.add_argument("--interval", type=float, default=3.0)
    parser.add_argument("--model", default=os.environ.get("CORE_MODEL") or "",
                        help="model id for chat; empty uses the gateway default")
    parser.add_argument("--theme", default="auto", choices=("auto", "light", "dark", "ansi"),
                        help="auto reads COLORFGBG; ansi is for 16-colour terminals")
    parser.add_argument("--full-access", dest="full_access", action="store_true",
                        help="start with permission_mode=full_access (no tool approvals)")
    parser.add_argument("-c", "--continue", dest="continue_last", action="store_true",
                        help="pick up the conversation you were last in")
    parser.add_argument("--workdir", default="",
                        help="directory the agent works in; defaults to this directory, "
                             "or the agent's own when the agent is on another machine")
    args = parser.parse_args(argv)

    if args.command == "ui":
        return _run_ui(args)
    if args.command == "keys":
        return _run_keys(args)

    core = Core(args.url, args.token)
    try:
        if args.command == "plugins":
            print(plugins_frame(core))
        elif args.command == "tasks":
            print(tasks_frame(core, args.limit))
        elif args.command == "usage":
            print(usage_frame(core))
        elif args.command == "plugin":
            if not args.name:
                parser.error("plugin needs a plugin name")
            payload = core.get(f"/api/plugins/{args.name}/descriptor")
            print(format_descriptor(payload if isinstance(payload, dict) else {}))
        elif args.command == "reconnect":
            if not args.name:
                parser.error("reconnect needs a plugin name")
            result = core.post(f"/api/plugins/{args.name}/reconnect")
            print(f"reconnect {args.name}: {json.dumps(result, ensure_ascii=False)}")
        else:
            while True:
                # Clear in place rather than using curses: this has to work over
                # a pipe and inside a Windows console alike.
                if sys.stdout.isatty():
                    sys.stdout.write("\x1b[2J\x1b[H")
                sys.stdout.write(frame(core, args.limit) + NEWLINE)
                sys.stdout.flush()
                time.sleep(max(0.5, args.interval))
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", "replace")[:200]
        print(f"HTTP {error.code} from {core.base_url}: {detail}", file=sys.stderr)
        return 1
    except urllib.error.URLError as error:
        print(f"cannot reach {core.base_url}: {error.reason}", file=sys.stderr)
        return 1
    except KeyboardInterrupt:
        return 0
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
