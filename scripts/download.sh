#!/bin/zsh
set -euo pipefail

BASE_URL="https://plus-93d208fa-a68d-4d66-a5d1-119307d5c509.database.sankuai.com"
PACKAGE_DIR="${0:A:h:h}"
SITE_DIR="$PACKAGE_DIR/site"
ROUTES_FILE="$PACKAGE_DIR/routes.txt"
ASSET_LIST="$PACKAGE_DIR/assets.txt"
FAILURES_FILE="$PACKAGE_DIR/download-failures.txt"

mkdir -p "$SITE_DIR"
: > "$FAILURES_FILE"

while IFS= read -r route; do
  [[ -z "$route" ]] && continue
  if [[ "$route" == "/" ]]; then
    output="$SITE_DIR/index.html"
  else
    output="$SITE_DIR${route}/index.html"
  fi
  mkdir -p "${output:h}"
  curl -fsSL --max-time 60 "$BASE_URL$route" -o "$output"
done < "$ROUTES_FILE"

collect_assets() {
  rg --no-filename -o \
    '/(?:_next/static|assets|cities)/[A-Za-z0-9%_./-]+\.(?:js|css|png|jpg|jpeg|webp|gif|svg|woff|woff2)|/og\.png' \
    "$SITE_DIR" \
    -g '*.html' -g '*.js' -g '*.css' 2>/dev/null || true
}

download_assets() {
  while IFS= read -r asset; do
    [[ -z "$asset" ]] && continue
    output="$SITE_DIR$asset"
    [[ -f "$output" ]] && continue
    mkdir -p "${output:h}"
    if ! curl -fsSL --max-time 60 "$BASE_URL$asset" -o "$output"; then
      print -r -- "$asset" >> "$FAILURES_FILE"
      rm -f "$output"
    fi
  done < "$ASSET_LIST"
}

for _pass in 1 2 3; do
  collect_assets | LC_ALL=C sort -u > "$ASSET_LIST"
  download_assets
done

collect_assets | LC_ALL=C sort -u > "$ASSET_LIST"

# ASGI/static servers decode %5Bslug%5D to [slug] before filesystem lookup.
# Keep an unescaped local alias so the recovered dynamic city chunk is runnable.
encoded_city_chunk="$SITE_DIR/_next/static/chunks/app/city/%5Bslug%5D"
decoded_city_chunk="$SITE_DIR/_next/static/chunks/app/city/[slug]"
if [[ -d "$encoded_city_chunk" ]]; then
  mkdir -p "$decoded_city_chunk"
  cp -p "$encoded_city_chunk"/*.js "$decoded_city_chunk"/
fi

(
  cd "$SITE_DIR"
  find . -type f -print0 | LC_ALL=C sort -z | xargs -0 shasum -a 256
) > "$PACKAGE_DIR/SHA256SUMS.txt"

sort -u "$FAILURES_FILE" -o "$FAILURES_FILE"
