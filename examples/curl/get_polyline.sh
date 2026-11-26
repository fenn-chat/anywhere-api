#!/usr/bin/env bash
# Read one active line with its points.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
POLYLINE_ID="${1:?usage: ./get_polyline.sh <polyline_id>}"

curl -sS --fail-with-body -w '\n' -X GET "$API/polylines/$POLYLINE_ID" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
