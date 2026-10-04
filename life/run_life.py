"""Launch the L.I.F.E plugin process detached, with the same environment
docker-compose.yml gives its `life` service.

Why a launcher instead of `make dev-life`:
  - Core does not supervise plugins. `POST /api/plugins/{name}/enable` only flips a
    registry flag; the Python process must already be running with a valid
    enrollment token, otherwise Core rejects registration and every ManageCompanion
    call answers "life unavailable".
  - The token mapping lives in .env + docker-compose.yml, and must be applied on
    every launch:
        CORE_API_TOKEN                  <- .env
        CORE_PLUGIN_REGISTRATION_TOKEN  <- .env LIFE_REGISTRATION_TOKEN
        MOCR_GRPC_TOKEN                 <- .env

Usage:
    python life/run_life.py              # start detached (logs to life/run.*.log)
    python life/run_life.py --foreground # run attached; Ctrl-C to stop (make dev-life)
    python life/run_life.py --status     # report pid / port / last registration line
    python life/run_life.py --stop       # stop the running instance
    python life/run_life.py --verify     # start, probe every adapter action, report

NOTE ON SANDBOXED SHELLS
    Some agent sandboxes reap the entire process tree when the calling shell exits,
    which makes a "detached" child die immediately even with DETACHED_PROCESS.
    If `--status` reports the pid dead seconds after a successful start, run the
    plugin from a normal terminal (`--foreground`, or `make dev-life`) or install it
    as a service. Core itself does NOT supervise plugins: it only flips an enabled
    flag, so nothing will restart the process for you.
"""

from __future__ import annotations

import argparse
import os
import re
import signal
import socket
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

LIFE_DIR = Path(__file__).resolve().parent
ROOT = LIFE_DIR.parent
ENV_FILE = ROOT / ".env"
PYTHON = LIFE_DIR / ".venv" / "Scripts" / "python.exe" if os.name == "nt" else LIFE_DIR / ".venv" / "bin" / "python"
OUT_LOG = LIFE_DIR / "run.out.log"
ERR_LOG = LIFE_DIR / "run.err.log"
PID_FILE = LIFE_DIR / "run.pid"

LIFE_GRPC_PORT = "50053"
LIFE_BIND_HOST = "127.0.0.1"


def log(msg: str) -> None:
    print(f"[run-life] {msg}", flush=True)


def parse_dotenv(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.exists():
        return values
    for raw in path.read_text(encoding="utf-8", errors="replace").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, val = line.partition("=")
        values[key.strip()] = val.strip()
    return values


def build_env() -> dict[str, str]:
    dotenv = parse_dotenv(ENV_FILE)
    env = dict(os.environ)
    env.update(
        {
            "CORE_API_TOKEN": dotenv.get("CORE_API_TOKEN", ""),
            "CORE_PLUGIN_REGISTRATION_TOKEN": dotenv.get("LIFE_REGISTRATION_TOKEN", ""),
            "MOCR_GRPC_TOKEN": dotenv.get("MOCR_GRPC_TOKEN", ""),
            "LIFE_GRPC_PORT": LIFE_GRPC_PORT,
            "LIFE_BIND_HOST": LIFE_BIND_HOST,
            "PYTHONUNBUFFERED": "1",
            "PYTHONUTF8": "1",
        }
    )
    required = ("CORE_API_TOKEN", "CORE_PLUGIN_REGISTRATION_TOKEN", "MOCR_GRPC_TOKEN")
    missing = [k for k in required if not env.get(k)]
    if missing:
        raise SystemExit(
            f"[run-life] refusing to start: missing {', '.join(missing)} in {ENV_FILE}\n"
            "            the plugin MUST present an enrollment token or Core rejects it."
        )
    return env


def port_listening(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.6)
        return s.connect_ex((host, port)) == 0


def read_pid() -> int | None:
    if not PID_FILE.exists():
        return None
    try:
        return int(PID_FILE.read_text().strip())
    except (ValueError, OSError):
        return None


def pid_alive(pid: int) -> bool:
    if os.name == "nt":
        out = subprocess.run(
            ["tasklist", "/FI", f"PID eq {pid}", "/NH"],
            capture_output=True, text=True, errors="replace",
        ).stdout
        return str(pid) in out
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False


def last_registration_line() -> str | None:
    if not ERR_LOG.exists():
        return None
    pattern = re.compile(r"(Registered with Core|rejected plugin registration|without Core integration)")
    hit = None
    for line in ERR_LOG.read_text(encoding="utf-8", errors="replace").splitlines():
        if pattern.search(line):
            hit = line.strip()
    return hit


def cmd_start() -> int:
    if not PYTHON.exists():
        raise SystemExit(f"[run-life] venv python not found: {PYTHON}")

    pid = read_pid()
    if pid and pid_alive(pid) and port_listening(int(LIFE_GRPC_PORT)):
        log(f"already running (pid {pid}, :{LIFE_GRPC_PORT} listening) - nothing to do")
        return 0

    env = build_env()

    OUT_LOG.parent.mkdir(parents=True, exist_ok=True)
    out = open(OUT_LOG, "a", encoding="utf-8", errors="replace")
    err = open(ERR_LOG, "a", encoding="utf-8", errors="replace")
    out.write(f"\n===== launch {datetime.now():%Y-%m-%d %H:%M:%S} =====\n")
    err.write(f"\n===== launch {datetime.now():%Y-%m-%d %H:%M:%S} =====\n")
    out.flush()
    err.flush()

    creationflags = 0
    if os.name == "nt":
        # DETACHED_PROCESS | CREATE_NEW_PROCESS_GROUP: survive the parent shell exiting.
        creationflags = 0x00000008 | 0x00000200

    proc = subprocess.Popen(
        [str(PYTHON), "-m", "life.main"],
        cwd=str(LIFE_DIR),
        env=env,
        stdout=out,
        stderr=err,
        stdin=subprocess.DEVNULL,
        creationflags=creationflags,
        close_fds=True,
    )
    PID_FILE.write_text(str(proc.pid))
    log(f"started pid {proc.pid} (env: CORE_API_TOKEN set, CORE_PLUGIN_REGISTRATION_TOKEN set)")

    # wait for the gRPC port to come up
    for i in range(20):
        time.sleep(1)
        if proc.poll() is not None:
            log(f"process exited early with code {proc.returncode}; tail of {ERR_LOG.name}:")
            tail = ERR_LOG.read_text(encoding="utf-8", errors="replace").splitlines()[-25:]
            for line in tail:
                print("    " + line)
            return 1
        if port_listening(int(LIFE_GRPC_PORT)):
            log(f":{LIFE_GRPC_PORT} is listening after {i + 1}s")
            time.sleep(3)
            reg = last_registration_line()
            if reg:
                log(f"registration: {reg}")
            return 0

    log(f"warning: port {LIFE_GRPC_PORT} not listening after 20s; check {ERR_LOG}")
    return 1


def cmd_foreground() -> int:
    """Run attached so a terminal (or `make dev-life`) owns the process."""
    env = build_env()
    os.chdir(LIFE_DIR)
    log(f"foreground start (pid {os.getpid()}), env applied; Ctrl-C to stop")
    try:
        return subprocess.call([str(PYTHON), "-m", "life.main"], cwd=str(LIFE_DIR), env=env)
    except KeyboardInterrupt:
        log("interrupted")
        return 130


def _core_call(action: str, payload: dict | None = None, timeout: float = 15.0) -> dict:
    """POST one ManageCompanion action through Core's HTTP bridge."""
    import json
    import urllib.error
    import urllib.request

    body = json.dumps({"action": action, "payload": payload or {}}).encode()
    req = urllib.request.Request(
        "http://127.0.0.1:8080/api/life/companion",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8", "replace"))
    except urllib.error.HTTPError as e:
        return {"code": f"http_{e.code}", "error": e.read().decode("utf-8", "replace")[:400]}
    except Exception as e:  # noqa: BLE001
        return {"code": "transport_error", "error": f"{type(e).__name__}: {e}"}


# Every action that the 消息平台 settings page and CompanionPage depend on.
ADAPTER_ACTIONS = (
    "adapter_platforms",
    "adapter_list",
    "adapter_status",
    "adapter_routes_get",
)


def cmd_verify(restart: bool = True) -> int:
    """Start LIFE, probe the adapter actions, report. Proves the shipped code loads."""
    if restart:
        cmd_stop()
        time.sleep(1)
        rc = cmd_start()
        if rc != 0:
            return rc

    print()
    print("--- probing adapter actions through Core ---")
    failures = 0
    for action in ADAPTER_ACTIONS:
        res = _core_call(action)
        code = res.get("code")
        if code in (None, "ok", "success") and "error" not in res:
            summary = repr(res)[:160]
            print(f"  OK   {action:22s} {summary}")
        else:
            failures += 1
            print(f"  FAIL {action:22s} {repr(res)[:220]}")

    print()
    if failures:
        print(f"{failures}/{len(ADAPTER_ACTIONS)} actions failed")
        print("If the error mentions 'unknown action', the RUNNING process has stale code:")
        print("  python life/run_life.py --stop && python life/run_life.py")
        return 1
    print(f"all {len(ADAPTER_ACTIONS)} adapter actions responded")
    return 0


def cmd_status() -> int:
    pid = read_pid()
    alive = bool(pid and pid_alive(pid))
    listening = port_listening(int(LIFE_GRPC_PORT))
    print(f"pid          : {pid} ({'alive' if alive else 'dead'})")
    print(f":{LIFE_GRPC_PORT}   : {'listening' if listening else 'not listening'}")
    reg = last_registration_line()
    print(f"registration : {reg or '(none logged)'}")
    return 0 if (alive and listening) else 1


def cmd_stop() -> int:
    pid = read_pid()
    if not pid or not pid_alive(pid):
        log("nothing to stop")
        return 0
    if os.name == "nt":
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(pid)], capture_output=True, text=True)
    else:
        os.kill(pid, signal.SIGTERM)
    for _ in range(15):
        time.sleep(1)
        if not pid_alive(pid):
            log(f"stopped pid {pid}")
            PID_FILE.unlink(missing_ok=True)
            return 0
    log(f"pid {pid} did not exit")
    return 1


def main() -> int:
    ap = argparse.ArgumentParser(description="L.I.F.E plugin launcher")
    g = ap.add_mutually_exclusive_group()
    g.add_argument("--status", action="store_true", help="report pid / port / registration")
    g.add_argument("--stop", action="store_true", help="stop the running instance")
    g.add_argument("--foreground", action="store_true", help="run attached (Ctrl-C to stop)")
    g.add_argument("--verify", action="store_true", help="start, probe adapter actions, report")
    args = ap.parse_args()
    if args.status:
        return cmd_status()
    if args.stop:
        return cmd_stop()
    if args.foreground:
        return cmd_foreground()
    if args.verify:
        return cmd_verify()
    return cmd_start()


if __name__ == "__main__":
    sys.exit(main())
