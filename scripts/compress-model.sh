#!/usr/bin/env bash
# Compress the source GLB into a web-ready Draco + WebP asset.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="${ROOT}/public/models/source/chinese-architecture.original.glb"
OUT="${ROOT}/public/models/chinese-architecture.glb"

if [[ ! -f "$SRC" ]]; then
  echo "Missing source model: $SRC"
  exit 1
fi

npx --yes @gltf-transform/cli@4.2.1 optimize "$SRC" "$OUT" \
  --compress draco \
  --texture-compress webp \
  --texture-size 2048 \
  --simplify true \
  --simplify-error 0.001 \
  --simplify-ratio 0.5

ls -lh "$SRC" "$OUT"
