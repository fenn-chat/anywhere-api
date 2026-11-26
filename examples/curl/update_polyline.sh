#!/usr/bin/env bash
# Rename a line and preserve its expiry.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
POLYLINE_ID="${1:?usage: ./update_polyline.sh <polyline_id>}"

curl -sS --fail-with-body -w '\n' -X PATCH "$API/polylines/$POLYLINE_ID" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Evening waterfront walk"}'
