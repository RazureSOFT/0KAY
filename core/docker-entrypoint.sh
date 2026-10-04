#!/bin/sh
set -eu
data="${CORE_DATA_DIR:-/app/data}"
seed="${CORE_UI_SEED_DIR:-/opt/0kay-ui}"
mkdir -p "$data/plugin-ui" "$data/ui"
# Ship version-matched built-in bundles into fresh and existing data volumes.
# Keep custom plugin directories and user-edited patches intact.
for source in "$seed"/plugin-ui/*; do
  name=$(basename "$source")
  stage="$data/plugin-ui/.$name.new"
  rm -rf "$stage"
  cp -R "$source" "$stage"
  rm -rf "$data/plugin-ui/$name"
  mv "$stage" "$data/plugin-ui/$name"
done
for source in "$seed"/ui/*.patch; do
  destination="$data/ui/$(basename "$source")"
  if [ ! -f "$destination" ]; then cp "$source" "$destination"; fi
done
exec "$@"
