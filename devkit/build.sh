#!/usr/bin/env bash
# Package the 0kay devkit for every language into devkit/dist/.
#
#   bash devkit/build.sh
#
# Artifacts:
#   okay-devkit-python.zip   Python package (also `pip install .` from devkit/python)
#   okay-devkit-0.1.0.tgz    npm tarball (also `npm install <tgz>`)
#   okay-devkit-go.zip       Go module (module okaydevkit)
#   okay-devkit-0.1.0.crate  Rust crate (also `cargo add --path devkit/rust`)
#   okay-devkit-java.jar     Java library (also `javac` from devkit/java)
set -euo pipefail
cd "$(dirname "$0")"
DIST="dist"
rm -rf "$DIST"
mkdir -p "$DIST"

echo "== python =="
# Drop __pycache__ so the shipped zip carries only source.
find python -type d -name __pycache__ -prune -exec rm -rf {} +
python -m zipfile -c "$DIST/okay-devkit-python.zip" python/okay_devkit python/pyproject.toml
echo "   $DIST/okay-devkit-python.zip"

echo "== node =="
(cd node && npm pack --silent --pack-destination "../$DIST" >/dev/null)
echo "   $DIST/$(ls "$DIST" | grep -E '\.tgz$' | head -n1)"

echo "== go =="
(cd go && go build ./...)
python - "$DIST" <<'PY'
import shutil, sys
shutil.make_archive("dist/okay-devkit-go", "zip", "go")
PY
echo "   $DIST/okay-devkit-go.zip"

echo "== rust =="
(cd rust && cargo package --allow-dirty --no-verify --quiet)
CRATE_VERSION=$(sed -n 's/^version[[:space:]]*=[[:space:]]*"\(.*\)"//p' rust/Cargo.toml | head -n1)
CRATE="okay-devkit-${CRATE_VERSION}.crate"
cp "rust/target/package/$CRATE" "$DIST/"
echo "   $DIST/$CRATE"

echo "== java =="
(cd java && rm -rf out && javac -d out src/OkayDevkit.java && jar cfe "../$DIST/okay-devkit-java.jar" OkayDevkit -C out .)
echo "   $DIST/okay-devkit-java.jar"

echo
echo "Done. Artifacts in $(pwd)/$DIST:"
ls -1 "$DIST"
