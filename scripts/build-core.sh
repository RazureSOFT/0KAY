#!/usr/bin/env bash
# Build Core with an identity that cannot lie about itself.
#
# The rule:
#   - a build cut from a tag carries the tag;
#   - anything else carries the commit it was built from.
#
# Nothing is edited in the source tree to achieve this. The values go in as
# linker -X flags, so the same commit produces the same binary whether it is
# built by a developer, by CI, or by the release job.
#
# Usage:
#   scripts/build-core.sh                 # auto: tag if HEAD is tagged, else commit
#   scripts/build-core.sh --release v0.2.0   # tag given by the release job
#   scripts/build-core.sh --out dist/core
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT=""
RELEASE_TAG=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --release) RELEASE_TAG="${2:-}"; shift 2 ;;
    --out) OUT="${2:-}"; shift 2 ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
done

cd "$ROOT"

TAG="$RELEASE_TAG"
if [[ -z "$TAG" ]]; then
  # Only an exact tag on HEAD counts. `git describe` would happily report an
  # older tag for a newer commit, which is the same lie in a different shape.
  TAG="$(git describe --tags --exact-match 2>/dev/null || true)"
fi

COMMIT="$(git rev-parse --short=7 HEAD 2>/dev/null || true)"
DIRTY=""
if [[ -n "$(git status --porcelain 2>/dev/null || true)" ]]; then
  DIRTY="1"
fi

LDFLAGS="-s -w"
LDFLAGS="$LDFLAGS -X 0kay/core/internal/version.Tag=${TAG}"
LDFLAGS="$LDFLAGS -X 0kay/core/internal/version.Commit=${COMMIT}"
LDFLAGS="$LDFLAGS -X 0kay/core/internal/version.Dirty=${DIRTY}"

if [[ -z "$OUT" ]]; then
  OUT="$ROOT/core/0kay-core.exe"
fi

mkdir -p "$(dirname "$OUT")"
( cd core && go build -trimpath -ldflags "$LDFLAGS" -o "$OUT" ./cmd/core )

if [[ -n "$TAG" ]]; then
  echo "core $TAG (tag) -> $OUT"
elif [[ -n "$COMMIT" ]]; then
  echo "core ${COMMIT}${DIRTY:+-dirty} (commit) -> $OUT"
else
  echo "core (no git) -> $OUT"
fi
