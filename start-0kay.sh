#!/usr/bin/env bash
# start-0kay.sh — one-click start / stop / status for the whole 0KAY stack (from source, no Docker).
#
# Usage (run from the repo root, in Git Bash on Windows):
#
# Windows-only, despite being a shell script: it relies on `netstat -ano`,
# `taskkill` and `.venv/Scripts/python.exe`, none of which exist on Linux or in
# WSL. On other platforms use docker-compose.yml or the Makefile dev-* targets.
#   ./start-0kay.sh start      # launch core + mocr + life + agent + webui
#   ./start-0kay.sh stop       # stop everything (incl. orphaned node children)
#   ./start-0kay.sh restart    # stop, then start
#   ./start-0kay.sh status     # health + port + plugin roster
#
# Requires: Go 1.27+, Node 22+, Python 3.10+, plus the prebuilt deps
# (webui/agent node_modules, life/.venv, gen/ bindings) and a populated .env.
# No Docker required.
#
# Why the extra env wiring: first-party plugins (mocr/life/agent) must present a
# dedicated enrollment key at registration. Core reads CORE_PLUGIN_TOKEN_<NAME>
# from .env; each plugin must send its own key via CORE_PLUGIN_REGISTRATION_TOKEN.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOGDIR="$ROOT/.logs"
PIDFILE="$ROOT/.0kay.pids"
ENVFILE="$ROOT/.env"
PORTS=(50051 8080 50052 50053 50054 3000)

log()  { echo "[$(date +'%H:%M:%S')] $*"; }
die()  { echo "[$(date +'%H:%M:%S')] ERROR: $*" >&2; exit 1; }

load_env() {
  [[ -f "$ENVFILE" ]] || die ".env not found at $ENVFILE — copy docs/security-runtime.env.example and fill tokens, or run the coordinated restart that generated it."
  set -a
  # shellcheck disable=SC1090
  source "$ENVFILE"
  set +a
}

# PID of whatever is LISTENING on a given port (Windows netstat via Git Bash).
pids_of_port() {
  netstat -ano 2>/dev/null | grep -E "[:.]$1 +.*LISTENING" | awk '{print $NF}' | head -n1
}

# Is this PID one of ours?
#
# `kill_port` used to take the *first* PID listening on a port and force-kill its
# whole tree with no ownership check. :8080 and :3000 are both extremely common
# developer ports (local registries, dev proxies, the React default), so
# `./start-0kay.sh stop` would kill an unrelated application and everything it
# had spawned — no prompt, no confirmation, no dry run. Two lines of ownership
# check removes that entirely.
pid_is_ours() {
  local pid="$1"
  [[ -z "$pid" || "$pid" == "0" ]] && return 1
  # 1) something we recorded in $PIDFILE
  grep -qE "[[:space:]]$pid\$" "$PIDFILE" 2>/dev/null && return 0
  # 2) the executable name matches one of ours
  local image
  image="$(tasklist //FI "PID eq $pid" //FO CSV //NH 2>/dev/null | head -n1 | cut -d, -f1 | tr -d '"')"
  case "$image" in
    core.exe|mocr.exe|life*|agent.exe|node.exe|python.exe|pythonw.exe|go.exe) return 0 ;;
  esac
  return 1
}

kill_port() {
  local pid
  pid="$(pids_of_port "$1")"
  if [[ -z "$pid" || "$pid" == "0" ]]; then
    return 0
  fi
  if ! pid_is_ours "$pid"; then
    local image
    image="$(tasklist //FI "PID eq $pid" //FO CSV //NH 2>/dev/null | head -n1 | cut -d, -f1 | tr -d '"')"
    log "  :$1 is held by $image (pid $pid) — NOT a 0KAY process, leaving it alone."
    log "  stop that process yourself if 0KAY needs the port."
    return 0
  fi
  log "  killing listener pid $pid on :$1"
  taskkill //PID "$pid" //F //T >/dev/null 2>&1 || true
}

wait_for_core() {
  local tries=0 max=120
  log "waiting for Core HTTP (127.0.0.1:8080) ..."
  while (( tries < max )); do
    if curl -s -o /dev/null -m 3 http://127.0.0.1:8080/health 2>/dev/null; then
      log "Core is up."
      return 0
    fi
    sleep 2
    (( tries++ ))
  done
  log "WARN: Core did not become healthy within $((max*2))s — check $LOGDIR/core.log"
  return 1
}

cmd_start() {
  # Refuse if any port is already taken.
  local occupied=0
  for p in "${PORTS[@]}"; do
    if [[ -n "$(pids_of_port "$p")" ]]; then
      log "port :$p already in use"
      occupied=1
    fi
  done
  (( occupied )) && die "ports busy — run 'stop' first (or a previous run is still up)."

  load_env
  mkdir -p "$LOGDIR"
  : > "$PIDFILE"

  # Each service is launched in its own directory. CORE_PLUGIN_REGISTRATION_TOKEN
  # carries the per-plugin enrollment key (matched against Core's CORE_PLUGIN_TOKEN_*).
  ( cd "$ROOT/core"  && nohup go run ./cmd/core  >> "$LOGDIR/core.log"  2>&1 & echo "core $!"  >> "$PIDFILE"; disown )
  ( cd "$ROOT/mocr"  && CORE_PLUGIN_REGISTRATION_TOKEN="$MOCR_REGISTRATION_TOKEN" nohup go run ./cmd/mocr  >> "$LOGDIR/mocr.log"  2>&1 & echo "mocr $!"  >> "$PIDFILE"; disown )
  ( cd "$ROOT/life"  && CORE_PLUGIN_REGISTRATION_TOKEN="$LIFE_REGISTRATION_TOKEN" nohup .venv/Scripts/python.exe -m life.main >> "$LOGDIR/life.log"  2>&1 & echo "life $!"  >> "$PIDFILE"; disown )
  ( cd "$ROOT/agent" && CORE_PLUGIN_REGISTRATION_TOKEN="$AGENT_REGISTRATION_TOKEN" nohup npm run dev >> "$LOGDIR/agent.log" 2>&1 & echo "agent $!" >> "$PIDFILE"; disown )
  # Optional TTS backend. Started only when the plugin directory exists;
  # it registers itself as capability "tts" and owns Settings → Genie TTS.
  if [ -f "$ROOT/genie-tts/src/server.mjs" ]; then
    ( cd "$ROOT/genie-tts" && CORE_PLUGIN_REGISTRATION_TOKEN="$GENIETTS_REGISTRATION_TOKEN" nohup node src/server.mjs >> "$LOGDIR/genie-tts.log" 2>&1 & echo "genie-tts $!" >> "$PIDFILE"; disown )
  fi
  # Optional ASR backend. Publishes `asr_endpoint` in Settings → Soniox 语音识别,
  # which is how Core's unified /api/asr finds it (docs/asr.md).
  if [ -f "$ROOT/soniox-asr/src/server.mjs" ]; then
    ( cd "$ROOT/soniox-asr" && CORE_PLUGIN_REGISTRATION_TOKEN="$SONIOX_ASR_REGISTRATION_TOKEN" nohup node src/server.mjs >> "$LOGDIR/soniox-asr.log" 2>&1 & echo "soniox-asr $!" >> "$PIDFILE"; disown )
  fi
  ( cd "$ROOT/webui" && nohup npm run dev >> "$LOGDIR/webui.log" 2>&1 & echo "webui $!" >> "$PIDFILE"; disown )

  log "launched all 5 services (pids in $PIDFILE)"
  wait_for_core
  sleep 8   # give the plugins a moment to register
  cmd_status
  log "WebUI: http://127.0.0.1:3000/   (loopback is trusted, no token/PIN needed locally)"
}

cmd_stop() {
  log "stopping 0KAY stack ..."
  if [[ -f "$PIDFILE" ]]; then
    while read -r name pid; do
      [[ -z "$pid" ]] && continue
      taskkill //PID "$pid" //F //T >/dev/null 2>&1 || true
    done < "$PIDFILE"
    rm -f "$PIDFILE"
  fi
  # Sweep by port so orphaned children (e.g. vite/tsx node procs left behind by
  # a killed npm parent) are also cleaned up.
  for p in "${PORTS[@]}"; do kill_port "$p"; done
  sleep 2
  local still=0
  for p in "${PORTS[@]}"; do
    if [[ -n "$(pids_of_port "$p")" ]]; then log "WARN: :$p still occupied"; still=1; fi
  done
  (( still )) && log "some ports still busy — run stop again, or kill manually." || log "all ports free."
}

cmd_status() {
  log "Core health: $(curl -s -m 5 http://127.0.0.1:8080/health 2>/dev/null || echo 'unreachable')"
  log "listening ports:"
  for p in "${PORTS[@]}"; do
    if [[ -n "$(pids_of_port "$p")" ]]; then echo "  :$p  LISTENING"; else echo "  :$p  -"; fi
  done
  local roster
  roster="$(curl -s -m 5 http://127.0.0.1:8080/api/plugins 2>/dev/null)"
  if [[ -n "$roster" ]]; then
    echo "$roster" | python -c "import sys,json; d=json.load(sys.stdin); [print('  %-10s %s' % (p['name'], p['status'])) for p in d]" 2>/dev/null \
      || echo "$roster" | head -c 400
  fi
}

cmd_restart() { cmd_stop; sleep 2; cmd_start; }

case "${1:-start}" in
  start)   cmd_start ;;
  stop)    cmd_stop ;;
  restart) cmd_restart ;;
  status)  cmd_status ;;
  *) die "unknown command: $1 (use start|stop|restart|status)" ;;
esac
