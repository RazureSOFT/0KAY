#!/usr/bin/env bash
# Build every plugin UI page into core/data/plugin-ui/.
#
# These pages are build output and are no longer committed (see .gitignore). That
# makes this script the only way they come into existence, so it has to work from
# a fresh clone with nothing but the source tree:
#
#   core/data/plugin-ui/webui/*.js        <- webui/src, via `npm run build:plugin`
#   core/data/plugin-ui/<plugin>/index.js <- plugin-web/<plugin>, via its own build
#
# Plugins whose sources are not in this repository are left alone. darkmode,
# compat and marketplace ship hand-written JavaScript that is tracked in git and
# loaded as-is; they are skipped here and a rebuild must not touch them.
#
# Usage:
#   scripts/build-plugin-ui.sh            # build all
#   scripts/build-plugin-ui.sh agent life # build only these
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# plugin-web directories that build a page. Order does not matter; each writes
# only its own output file.
BUILDERS=(agent life minecraft skillsguishow)

requested=()
if [[ $# -gt 0 ]]; then
  requested=("$@")
fi

wanted() {
  local name="$1"
  [[ ${#requested[@]} -eq 0 ]] && return 0
  for entry in "${requested[@]}"; do
    [[ "$entry" == "$name" ]] && return 0
  done
  return 1
}

# The pages are no longer in git, so on a fresh clone the directory may not
# exist yet. Vite creates its output dir but not the parents above it.
mkdir -p core/data/plugin-ui/webui

# The host pages first: the import map resolves `@0kay/host` through the webui
# bundle, so a broken webui build makes every plugin page fail at runtime.
if wanted webui; then
  echo "==> webui"
  if [[ ! -d webui/node_modules ]]; then
    ( cd webui && npm ci )
  fi
  ( cd webui && npm run build:plugin )
fi

for plugin in "${BUILDERS[@]}"; do
  wanted "$plugin" || continue
  dir="plugin-web/$plugin"
  if [[ ! -f "$dir/package.json" ]]; then
    echo "==> $plugin: no package.json, skipped"
    continue
  fi
  echo "==> $plugin"
  if [[ ! -d "$dir/node_modules" ]]; then
    ( cd "$dir" && npm ci )
  fi
  ( cd "$dir" && npm run build )
done

# A page that ends up pointing at a sidecar chunk breaks on a clean checkout,
# because the chunk lives under the gitignored assets/ directory. Catch it here
# rather than in a browser console.
broken=0
while IFS= read -r file; do
  if grep -q 'from "\./' "$file"; then
    echo "ERROR: $file imports a sibling chunk; plugin pages must be single-entry" >&2
    broken=1
  fi
done < <(find core/data/plugin-ui -name '*.js' -not -path '*/assets/*')

if [[ $broken -ne 0 ]]; then
  exit 1
fi

echo "plugin UI pages built."
