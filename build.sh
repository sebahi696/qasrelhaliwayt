#!/usr/bin/env bash
# One-shot build for Cloudflare Pages / any static host. Output: site/dist
# Env: BASE_PATH (default /), SITE_URL (default https://qasralhalaweyat.com)
set -euo pipefail
cd "$(dirname "$0")/site"
export BASE_PATH="${BASE_PATH:-/}" SITE_URL="${SITE_URL:-https://qasralhalaweyat.com}"
npm ci && npm run build
mkdir -p dist/app dist/staff
cp -r ../app/. dist/app/
cp ../staff/index.html dist/staff/
touch dist/.nojekyll
echo "built site/dist for $SITE_URL$BASE_PATH"
