#!/usr/bin/env bash
# install.sh — prepare a checkout so the stack can run, or verify that it already can.
#
#   ./scripts/install.sh --check    # report only; changes nothing, exits 1 if not ready
#   ./scripts/install.sh            # install whatever is missing (idempotent)
#
# Windows note: run this in Git Bash, same as start-0kay.sh. It uses POSIX shell
# and .venv/Scripts/python.exe, so it is not a Linux/WSL script.
#
# What it does not do: create .env (that needs real secrets), fetch the Live2D
# model, or install a system toolchain. Missing prerequisites are reported with
# the command that installs them, not silently skipped.

set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT" || exit 1

CHECK_ONLY=0
case "${1:-}" in
  --check|-n) CHECK_ONLY=1 ;;
  "" ) ;;
  *) echo "usage: $0 [--check]" >&2; exit 2 ;;
esac

GO_MIN="1.21"
NODE_MIN="20"
PY_MIN="3.10"

if [[ -t 1 ]]; then
  OK=$'\033[32m'; MISS=$'\033[31m'; WARN=$'\033[33m'; OFF=$'\033[0m'
else
  OK=""; MISS=""; WARN=""; OFF=""
fi

missing=0
warned=0

ok()   { printf '  %sok%s    %s\n' "$OK" "$OFF" "$1"; }
miss() { printf '  %s--%s    %s\n' "$MISS" "$OFF" "$1"; missing=$((missing + 1)); }
warn() { printf '  %swarn%s  %s\n' "$WARN" "$OFF" "$1"; warned=$((warned + 1)); }

# version_ge A B → A >= B for dotted numeric versions
version_ge() {
  local IFS=.
  local -a a=($1) b=($2)
  local i
  for i in 0 1 2; do
    local x="${a[$i]:-0}" y="${b[$i]:-0}"
    if (( x > y )); then return 0; fi
    if (( x < y )); then return 1; fi
  done
  return 0
}

command_version() {
  # first dotted triple in the output, e.g. "go version go1.27.0 windows/amd64"
  "$@" 2>/dev/null | head -1 | grep -oE '[0-9]+\.[0-9]+(\.[0-9]+)?' | head -1
}

echo "0KAY installer — $( [[ $CHECK_ONLY == 1 ]] && echo 'check only' || echo 'install missing pieces' )"
echo

echo "Toolchain"
if command -v go >/dev/null 2>&1; then
  go_version="$(command_version go version)"
  if version_ge "${go_version:-0}" "$GO_MIN"; then ok "go $go_version"; else miss "go $go_version is older than $GO_MIN (https://go.dev/dl/)"; fi
else
  miss "go not on PATH (https://go.dev/dl/)"
fi
if command -v node >/dev/null 2>&1; then
  node_version="$(command_version node --version)"
  if version_ge "${node_version:-0}" "$NODE_MIN"; then ok "node $node_version"; else miss "node $node_version is older than $NODE_MIN (https://nodejs.org/)"; fi
else
  miss "node not on PATH (https://nodejs.org/)"
fi
if command -v npm >/dev/null 2>&1; then ok "npm $(command_version npm --version)"; else miss "npm not on PATH (ships with node)"; fi
py=""
if [[ -x "$ROOT/life/.venv/Scripts/python.exe" ]]; then
  py="$ROOT/life/.venv/Scripts/python.exe"
elif command -v python3 >/dev/null 2>&1; then
  py="python3"
elif command -v python >/dev/null 2>&1; then
  py="python"
fi
if [[ -n "$py" ]]; then
  py_version="$("$py" -c 'import sys;print("%d.%d.%d" % sys.version_info[:3])' 2>/dev/null)"
  if version_ge "${py_version:-0}" "$PY_MIN"; then ok "python $py_version ($py)"; else miss "python $py_version is older than $PY_MIN"; fi
else
  miss "no python found (https://www.python.org/downloads/)"
fi
echo

echo "Configuration"
if [[ -f "$ROOT/.env" ]]; then
  ok ".env present"
else
  miss ".env missing — copy docs/security-runtime.env.example and fill the tokens"
fi
echo

echo "Dependencies"
install_npm() { # dir
  local dir="$1"
  [[ $CHECK_ONLY == 1 ]] && return 0
  echo "        installing in $dir ..."
  ( cd "$ROOT/$dir" && npm ci --no-audit --no-fund >/dev/null 2>&1 ) || warn "npm ci failed in $dir (run it by hand to see why)"
}
for dir in mcp webui agent plugin-web/agent plugin-web/life plugin-web/webui; do
  [[ -d "$ROOT/$dir" ]] || continue
  if [[ -d "$ROOT/$dir/node_modules" ]]; then
    ok "$dir/node_modules"
  else
    miss "$dir/node_modules"
    install_npm "$dir"
  fi
done

if [[ -d "$ROOT/life" ]]; then
  if [[ -x "$ROOT/life/.venv/Scripts/python.exe" ]]; then
    ok "life/.venv"
  else
    miss "life/.venv"
    if [[ $CHECK_ONLY == 0 ]]; then
      echo "        creating the venv and installing life ..."
      "$py" -m venv "$ROOT/life/.venv" >/dev/null 2>&1 || warn "venv creation failed"
      "$ROOT/life/.venv/Scripts/python.exe" -m pip install -q -e "$ROOT/life" >/dev/null 2>&1 \
        || warn "pip install -e life failed (run it by hand to see why)"
    fi
  fi
fi

if [[ -d "$ROOT/gen" ]]; then
  ok "gen/ (generated protobuf bindings)"
else
  miss "gen/ missing — run: cd mcp && npm run gen"
fi
echo

echo "Build artefacts"
if [[ -f "$ROOT/core/data/plugin-ui/webui/settings.js" ]]; then
  ok "webui plugin bundles"
else
  miss "webui plugin bundles — run: cd webui && npm run build:plugin"
fi
if [[ -f "$ROOT/core/data/plugin-ui/life/companion.js" ]]; then
  ok "life plugin bundles"
else
  miss "life plugin bundles — run: cd plugin-web/life && npm run build"
fi
if [[ -f "$ROOT/webui/dist/index.html" ]]; then
  ok "webui/dist"
else
  warn "webui/dist missing (only needed for the built-in static UI) — run: cd webui && npm run build"
fi
echo

if [[ $missing -gt 0 ]]; then
  printf '%s%d item(s) missing%s' "$MISS" "$missing" "$OFF"
  [[ $warned -gt 0 ]] && printf ', %d warning(s)' "$warned"
  echo
  echo "Fix the items above, then run: ./scripts/install.sh --check"
  exit 1
fi
printf '%sready%s' "$OK" "$OFF"
[[ $warned -gt 0 ]] && printf ' with %d warning(s)' "$warned"
echo
echo "Start the stack with: ./start-0kay.sh start"
