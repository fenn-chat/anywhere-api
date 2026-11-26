#!/usr/bin/env bash
# Delete a line and keep its linked places.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
POLYLINE_ID="${1:?usage: ./remove_polyline.sh <polyline_id>}"

curl -sS --fail-with-body -w '\n' -X DELETE "$API/polylines/$POLYLINE_ID" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
